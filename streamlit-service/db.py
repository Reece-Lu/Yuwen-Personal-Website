"""Thin read-only DuckDB helpers for the Streamlit app."""

from __future__ import annotations

import os
from datetime import date
from pathlib import Path
from typing import Iterable, Optional

import duckdb
import pandas as pd


DEFAULT_DB_PATH = Path("/data/quant/quant_pilot.duckdb")


def get_db_path() -> Path:
    configured = os.getenv("QUANT_DUCKDB_PATH")
    if configured:
        return Path(configured).expanduser()
    return DEFAULT_DB_PATH


def _connect() -> duckdb.DuckDBPyConnection:
    return duckdb.connect(str(get_db_path()), read_only=True)


def price_date_bounds(symbol: str, source: str = "yfinance") -> tuple[Optional[date], Optional[date]]:
    if not get_db_path().exists():
        return None, None
    with _connect() as conn:
        row = conn.execute(
            """
            SELECT min(date), max(date) FROM daily_prices
            WHERE symbol = ? AND source = ?;
            """,
            [symbol.upper(), source],
        ).fetchone()
    return row[0], row[1]


def load_candles_with_smas(
    symbol: str,
    sma_windows: Iterable[int],
    start_date: Optional[date | str] = None,
    end_date: Optional[date | str] = None,
    source: str = "yfinance",
) -> pd.DataFrame:
    if not get_db_path().exists():
        return pd.DataFrame()

    sma_windows = list(sma_windows)
    with _connect() as conn:
        prices = conn.execute(
            """
            WITH latest AS (
                SELECT max(date) AS max_date FROM daily_prices
                WHERE symbol = ? AND source = ?
            )
            SELECT p.date, p.open, p.high, p.low, p.close, p.adj_close, p.volume
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

        if prices.empty:
            return prices

        indicators = conn.execute(
            """
            SELECT date, sma_window, sma
            FROM daily_indicators
            WHERE symbol = ? AND source = ? AND sma_window = ANY(?)
            ORDER BY date;
            """,
            [symbol.upper(), source, sma_windows],
        ).fetch_df()

    merged = prices.copy()
    for window in sma_windows:
        window_df = indicators[indicators["sma_window"] == window][["date", "sma"]]
        window_df = window_df.rename(columns={"sma": f"sma{window}"})
        merged = merged.merge(window_df, on="date", how="left")

    return merged
