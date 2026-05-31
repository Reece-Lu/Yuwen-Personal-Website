"""yfinance data ingestion helpers, adapted from quant-pilot."""

from __future__ import annotations

import logging
from typing import Iterable, Optional

import pandas as pd
import yfinance as yf

try:
    from curl_cffi import requests as curl_requests
except ImportError:  # pragma: no cover
    curl_requests = None


logger = logging.getLogger(__name__)


def _build_session():
    """Return a curl_cffi Chrome-impersonating session if available.

    Yahoo Finance increasingly blocks plain `requests` traffic via Cloudflare
    fingerprinting; impersonating a real browser via curl_cffi avoids the
    empty / 401 responses that surface as `YFTzMissingError`.
    """

    if curl_requests is None:
        logger.warning(
            "curl_cffi not installed — falling back to default yfinance session; "
            "may hit empty responses if Yahoo throttles."
        )
        return None
    return curl_requests.Session(impersonate="chrome")


PRICE_COLUMNS = [
    "date",
    "symbol",
    "open",
    "high",
    "low",
    "close",
    "adj_close",
    "volume",
    "source",
]


def _normalize(symbol: str, raw: pd.DataFrame) -> pd.DataFrame:
    if raw.empty:
        return pd.DataFrame(columns=PRICE_COLUMNS)

    if isinstance(raw.columns, pd.MultiIndex):
        raw = raw.copy()
        raw.columns = raw.columns.get_level_values(0)

    prices = raw.reset_index()
    prices.columns = [str(c).strip().lower().replace(" ", "_") for c in prices.columns]

    if "adj_close" not in prices.columns and "close" in prices.columns:
        prices["adj_close"] = prices["close"]

    prices["date"] = pd.to_datetime(prices["date"]).dt.date
    prices["symbol"] = symbol.upper()
    prices["source"] = "yfinance"

    return prices[PRICE_COLUMNS].dropna(subset=["date", "close", "adj_close"])


def download_daily_prices(
    symbols: Iterable[str],
    start_date: str = "2011-01-01",
    end_date: Optional[str] = None,
) -> tuple[pd.DataFrame, dict[str, str]]:
    frames: list[pd.DataFrame] = []
    errors: dict[str, str] = {}
    session = _build_session()

    for raw_symbol in symbols:
        symbol = raw_symbol.strip().upper()
        if not symbol:
            continue
        try:
            kwargs = dict(
                start=start_date,
                end=end_date,
                interval="1d",
                auto_adjust=False,
                progress=False,
            )
            if session is not None:
                kwargs["session"] = session
            raw = yf.download(symbol, **kwargs)
            normalized = _normalize(symbol, raw)
            if normalized.empty:
                errors[symbol] = "No rows returned from yfinance."
                continue
            frames.append(normalized)
        except Exception as exc:
            errors[symbol] = str(exc)

    if not frames:
        return pd.DataFrame(columns=PRICE_COLUMNS), errors

    data = pd.concat(frames, ignore_index=True)
    data = data.sort_values(["symbol", "date"]).reset_index(drop=True)
    return data, errors
