"""Business logic for the quant module."""

from __future__ import annotations

import logging
from datetime import date, timedelta
from typing import Iterable, Optional

from app.modules.quant.config import HISTORY_START_DATE, SMA_WINDOWS, TRACKED_SYMBOLS
from app.modules.quant.data_source import download_daily_prices
from app.modules.quant.database import DuckDBClient


logger = logging.getLogger(__name__)


def refresh_prices(
    symbols: Iterable[str] = TRACKED_SYMBOLS,
    full_history: bool = False,
) -> dict:
    """Download incremental (or full) daily prices and recompute SMAs."""

    client = DuckDBClient()
    client.initialize()

    symbols = list(symbols)
    start_date = HISTORY_START_DATE
    if not full_history:
        # Use min of (max_date - 5 days) across symbols so we re-fetch the
        # tail in case yfinance revised the last bar. Falls back to full
        # history when DB is empty.
        starts = []
        for symbol in symbols:
            _, max_date = client.price_date_bounds(symbol)
            if max_date is not None:
                starts.append(max_date - timedelta(days=5))
        if starts:
            start_date = min(starts).isoformat()

    logger.info("quant: downloading %s from %s", symbols, start_date)
    prices, errors = download_daily_prices(symbols, start_date=start_date)
    rows = client.upsert_daily_prices(prices) if not prices.empty else 0

    sma_rows = {}
    for window in SMA_WINDOWS:
        sma_rows[window] = client.calculate_and_store_sma(window=window, symbols=symbols)

    summary = {
        "rows_written": rows,
        "sma_rows": sma_rows,
        "symbols": symbols,
        "start_date": start_date,
        "errors": errors,
    }
    logger.info("quant: refresh summary %s", summary)
    return summary


def load_chart_payload(
    symbol: str,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
) -> dict:
    client = DuckDBClient()
    client.initialize()

    data = client.load_candles_with_smas(
        symbol=symbol,
        sma_windows=SMA_WINDOWS,
        start_date=start_date,
        end_date=end_date,
    )

    if data.empty:
        return {"symbol": symbol.upper(), "candles": [], "latest": None}

    data = data.sort_values("date")
    candles = []
    for _, row in data.iterrows():
        candles.append(
            {
                "date": row["date"].isoformat() if hasattr(row["date"], "isoformat") else str(row["date"]),
                "open": float(row["open"]),
                "high": float(row["high"]),
                "low": float(row["low"]),
                "close": float(row["close"]),
                "adj_close": float(row["adj_close"]),
                "volume": int(row["volume"]) if row["volume"] == row["volume"] else 0,
                "sma50": _none_or_float(row.get("sma50")),
                "sma100": _none_or_float(row.get("sma100")),
                "sma200": _none_or_float(row.get("sma200")),
            }
        )

    latest_row = data.iloc[-1]
    latest = {
        "date": candles[-1]["date"],
        "close": float(latest_row["close"]),
        "sma50": _none_or_float(latest_row.get("sma50")),
        "sma100": _none_or_float(latest_row.get("sma100")),
        "sma200": _none_or_float(latest_row.get("sma200")),
    }

    return {"symbol": symbol.upper(), "candles": candles, "latest": latest}


def get_date_bounds(symbol: str) -> dict:
    client = DuckDBClient()
    client.initialize()
    start, end = client.price_date_bounds(symbol)
    return {
        "symbol": symbol.upper(),
        "min_date": start.isoformat() if start else None,
        "max_date": end.isoformat() if end else None,
    }


def _none_or_float(value) -> Optional[float]:
    if value is None:
        return None
    try:
        if value != value:  # NaN
            return None
    except TypeError:
        return None
    return float(value)
