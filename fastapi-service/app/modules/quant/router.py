"""HTTP routes for the quant (Nasdaq-100 SMA) module."""

from __future__ import annotations

from datetime import date
from typing import Optional

from fastapi import APIRouter, HTTPException, Query

from app.modules.quant import service
from app.modules.quant.config import TRACKED_SYMBOLS
from app.modules.quant.schemas import (
    CandlestickResponse,
    DateBoundsResponse,
    RefreshResponse,
)


router = APIRouter(prefix="/quant", tags=["Quant"])


@router.get(
    "/candlestick",
    response_model=CandlestickResponse,
    summary="Daily OHLC + SMA 50/100/200 for a symbol",
    description=(
        "Returns daily candles together with the 50-, 100-, and 200-day simple "
        "moving averages stored in DuckDB. Data is refreshed daily by the "
        "scheduler. If `start_date` / `end_date` are omitted, the API returns "
        "the most recent ~6 months."
    ),
)
def candlestick(
    symbol: str = Query("QQQ", description="Ticker symbol (currently only QQQ is tracked)."),
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
) -> CandlestickResponse:
    if symbol.upper() not in {s.upper() for s in TRACKED_SYMBOLS}:
        raise HTTPException(
            status_code=400,
            detail=f"Symbol '{symbol}' is not tracked. Tracked: {list(TRACKED_SYMBOLS)}.",
        )
    payload = service.load_chart_payload(symbol=symbol, start_date=start_date, end_date=end_date)
    return CandlestickResponse(**payload)


@router.get(
    "/date-bounds",
    response_model=DateBoundsResponse,
    summary="Min / max stored dates for a symbol",
)
def date_bounds(symbol: str = Query("QQQ")) -> DateBoundsResponse:
    return DateBoundsResponse(**service.get_date_bounds(symbol))


@router.post(
    "/refresh",
    response_model=RefreshResponse,
    summary="Manually trigger a yfinance refresh",
    description=(
        "Forces an incremental refresh of daily prices from yfinance and "
        "recomputes the SMA indicators. Pass `full=true` to re-download "
        "history from 2011-01-01 instead of an incremental tail."
    ),
)
def refresh(full: bool = Query(False, description="Re-download full history.")) -> RefreshResponse:
    summary = service.refresh_prices(full_history=full)
    return RefreshResponse(**summary)
