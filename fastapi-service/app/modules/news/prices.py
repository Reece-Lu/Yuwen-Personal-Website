"""Daily candles for the news chart: fetched from yfinance on demand, kept in memory.

Only tracked symbols are charted (the router checks), so the cache stays small: a
little over a year of daily rows per symbol, refreshed after ``CACHE_SECONDS``.
"""

from __future__ import annotations

import threading
import time
from datetime import date, timedelta
from typing import Dict, List, Tuple

from app.modules.quant.data_source import download_daily_prices

#: How long a symbol's candles are reused before yfinance is asked again.
CACHE_SECONDS = 30 * 60
#: Enough history for the longest chart range (1Y) plus a margin.
HISTORY_DAYS = 400

_cache: Dict[str, Tuple[float, List[dict]]] = {}
_locks: Dict[str, threading.Lock] = {}
_locks_guard = threading.Lock()


class PriceUnavailable(RuntimeError):
    """yfinance returned nothing usable for the symbol."""


def yahoo_ticker(symbol: str) -> str:
    """NASDAQ:NVDA -> NVDA (US listings only; the chart only shows tracked Nasdaq symbols)."""
    return symbol.split(":", 1)[-1].replace(".", "-").upper()


def _lock_for(ticker: str) -> threading.Lock:
    with _locks_guard:
        return _locks.setdefault(ticker, threading.Lock())


def daily_candles(ticker: str) -> List[dict]:
    """Daily OHLCV rows, oldest first: {date, open, high, low, close, volume}."""
    cached = _cache.get(ticker)
    if cached and time.monotonic() - cached[0] < CACHE_SECONDS:
        return cached[1]
    with _lock_for(ticker):
        cached = _cache.get(ticker)  # another request may have refreshed it meanwhile
        if cached and time.monotonic() - cached[0] < CACHE_SECONDS:
            return cached[1]
        start = (date.today() - timedelta(days=HISTORY_DAYS)).isoformat()
        frame, errors = download_daily_prices([ticker], start_date=start)
        if frame.empty:
            if cached:  # keep serving the last good copy rather than failing
                return cached[1]
            raise PriceUnavailable(errors.get(ticker) or "no price rows")
        rows = [
            {
                "date": row.date,
                "open": float(row.open),
                "high": float(row.high),
                "low": float(row.low),
                "close": float(row.close),
                "volume": int(row.volume) if row.volume == row.volume else 0,  # NaN-safe
            }
            for row in frame.itertuples(index=False)
            if row.open == row.open and row.high == row.high and row.low == row.low
        ]
        _cache[ticker] = (time.monotonic(), rows)
        return rows
