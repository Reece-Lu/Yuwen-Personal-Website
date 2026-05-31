"""DuckDB client for storing daily prices and SMA indicators."""

from __future__ import annotations

from datetime import date
from pathlib import Path
from typing import Iterable, Optional

import duckdb
import pandas as pd

from app.modules.quant.config import get_db_path


DAILY_PRICES_SCHEMA = """
CREATE TABLE IF NOT EXISTS daily_prices (
    date DATE,
    symbol VARCHAR,
    open DOUBLE,
    high DOUBLE,
    low DOUBLE,
    close DOUBLE,
    adj_close DOUBLE,
    volume BIGINT,
    source VARCHAR,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
"""

DAILY_INDICATORS_SCHEMA = """
CREATE TABLE IF NOT EXISTS daily_indicators (
    date DATE,
    symbol VARCHAR,
    source VARCHAR,
    sma_window INTEGER,
    sma DOUBLE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
"""


class DuckDBClient:
    def __init__(self, db_path: Optional[Path] = None) -> None:
        self.db_path = db_path or get_db_path()
        self.db_path.parent.mkdir(parents=True, exist_ok=True)

    def connect(self) -> duckdb.DuckDBPyConnection:
        return duckdb.connect(str(self.db_path))

    def initialize(self) -> None:
        with self.connect() as conn:
            conn.execute(DAILY_PRICES_SCHEMA)
            conn.execute(DAILY_INDICATORS_SCHEMA)

    def upsert_daily_prices(self, prices: pd.DataFrame) -> int:
        if prices.empty:
            return 0

        clean = prices[
            ["date", "symbol", "open", "high", "low", "close", "adj_close", "volume", "source"]
        ].copy()
        clean["date"] = pd.to_datetime(clean["date"]).dt.date
        clean["symbol"] = clean["symbol"].str.upper()
        clean["source"] = clean["source"].str.lower()

        with self.connect() as conn:
            conn.execute(DAILY_PRICES_SCHEMA)
            conn.register("incoming_prices", clean)
            conn.execute(
                """
                DELETE FROM daily_prices
                WHERE EXISTS (
                    SELECT 1 FROM incoming_prices
                    WHERE daily_prices.date = incoming_prices.date
                      AND daily_prices.symbol = incoming_prices.symbol
                      AND daily_prices.source = incoming_prices.source
                );
                """
            )
            conn.execute(
                """
                INSERT INTO daily_prices
                    (date, symbol, open, high, low, close, adj_close, volume, source)
                SELECT date, symbol, open, high, low, close, adj_close, volume, source
                FROM incoming_prices;
                """
            )
            conn.unregister("incoming_prices")

        return len(clean)

    def calculate_and_store_sma(
        self,
        window: int,
        symbols: Optional[Iterable[str]] = None,
        source: str = "yfinance",
    ) -> int:
        with self.connect() as conn:
            conn.execute(DAILY_PRICES_SCHEMA)
            conn.execute(DAILY_INDICATORS_SCHEMA)
            prices = conn.execute(
                """
                SELECT date, symbol, adj_close, source
                FROM daily_prices
                WHERE source = ?
                ORDER BY symbol, date;
                """,
                [source],
            ).fetch_df()

        if prices.empty:
            return 0

        if symbols:
            wanted = {s.upper() for s in symbols}
            prices = prices[prices["symbol"].isin(wanted)].copy()
        if prices.empty:
            return 0

        prices["sma"] = prices.groupby("symbol")["adj_close"].transform(
            lambda s: s.rolling(window=window, min_periods=window).mean()
        )
        prices["sma_window"] = window
        indicators = prices.dropna(subset=["sma"])[
            ["date", "symbol", "source", "sma_window", "sma"]
        ].copy()

        if indicators.empty:
            return 0

        with self.connect() as conn:
            conn.execute(DAILY_INDICATORS_SCHEMA)
            conn.register("incoming_indicators", indicators)
            conn.execute(
                """
                DELETE FROM daily_indicators
                WHERE EXISTS (
                    SELECT 1 FROM incoming_indicators
                    WHERE daily_indicators.date = incoming_indicators.date
                      AND daily_indicators.symbol = incoming_indicators.symbol
                      AND daily_indicators.source = incoming_indicators.source
                      AND daily_indicators.sma_window = incoming_indicators.sma_window
                );
                """
            )
            conn.execute(
                """
                INSERT INTO daily_indicators
                    (date, symbol, source, sma_window, sma)
                SELECT date, symbol, source, sma_window, sma FROM incoming_indicators;
                """
            )
            conn.unregister("incoming_indicators")

        return len(indicators)

    def load_candles_with_smas(
        self,
        symbol: str,
        sma_windows: Iterable[int],
        start_date: Optional[date | str] = None,
        end_date: Optional[date | str] = None,
        source: str = "yfinance",
    ) -> pd.DataFrame:
        sma_windows = list(sma_windows)
        with self.connect() as conn:
            conn.execute(DAILY_PRICES_SCHEMA)
            conn.execute(DAILY_INDICATORS_SCHEMA)
            prices = conn.execute(
                """
                WITH latest AS (
                    SELECT max(date) AS max_date FROM daily_prices
                    WHERE symbol = ? AND source = ?
                )
                SELECT p.date, p.symbol, p.open, p.high, p.low, p.close,
                       p.adj_close, p.volume
                FROM daily_prices p
                CROSS JOIN latest
                WHERE p.symbol = ?
                  AND p.source = ?
                  AND p.date >= COALESCE(CAST(? AS DATE), latest.max_date - INTERVAL 6 MONTH)
                  AND p.date <= COALESCE(CAST(? AS DATE), latest.max_date)
                ORDER BY p.date;
                """,
                [symbol.upper(), source, symbol.upper(), source, start_date, end_date],
            ).fetch_df()

            indicators = conn.execute(
                """
                SELECT date, sma_window, sma
                FROM daily_indicators
                WHERE symbol = ? AND source = ?
                  AND sma_window = ANY(?)
                ORDER BY date;
                """,
                [symbol.upper(), source, sma_windows],
            ).fetch_df()

        if prices.empty:
            return prices

        merged = prices.copy()
        for window in sma_windows:
            window_df = indicators[indicators["sma_window"] == window][["date", "sma"]]
            window_df = window_df.rename(columns={"sma": f"sma{window}"})
            merged = merged.merge(window_df, on="date", how="left")

        return merged

    def price_date_bounds(
        self, symbol: str, source: str = "yfinance"
    ) -> tuple[Optional[date], Optional[date]]:
        with self.connect() as conn:
            conn.execute(DAILY_PRICES_SCHEMA)
            row = conn.execute(
                """
                SELECT min(date), max(date) FROM daily_prices
                WHERE symbol = ? AND source = ?;
                """,
                [symbol.upper(), source],
            ).fetchone()
            return row[0], row[1]
