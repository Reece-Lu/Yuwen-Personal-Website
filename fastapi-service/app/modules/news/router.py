"""HTTP routes for the news archive (read-only)."""

from __future__ import annotations

from datetime import datetime
from typing import Iterator, List, Literal, Optional

from fastapi import APIRouter, Depends, HTTPException, Path, Query

from app.modules.news import database, service
from app.modules.news.prices import PriceUnavailable
from app.modules.news.schemas import ChartResponse, NewsDetail, NewsListResponse, NewsOverview, TrackedSymbol


router = APIRouter(prefix="/news", tags=["News"])


def get_connection() -> Iterator:
    try:
        conn = database.connect()
    except database.NewsDatabaseUnavailable as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    try:
        yield conn
    finally:
        conn.close()


@router.get(
    "/overview",
    response_model=NewsOverview,
    summary="Archive totals, providers and the latest collection round",
)
def overview(conn=Depends(get_connection)) -> NewsOverview:
    return NewsOverview(**service.overview(conn))


@router.get(
    "/symbols",
    response_model=List[TrackedSymbol],
    summary="Tracked symbols with their news counts",
)
def symbols(conn=Depends(get_connection)) -> List[TrackedSymbol]:
    return [TrackedSymbol(**row) for row in service.list_tracked_symbols(conn)]


@router.get(
    "/items",
    response_model=NewsListResponse,
    summary="Search headlines",
    description=(
        "Paged headlines, newest first by default. `start` / `end` are ISO 8601 "
        "datetimes (naive values are read as UTC); `end` is exclusive."
    ),
)
def items(
    symbol: Optional[str] = Query(None, max_length=64, description="Full symbol, e.g. NASDAQ:AAPL."),
    q: Optional[str] = Query(None, max_length=100, description="Substring of the title."),
    provider: Optional[str] = Query(None, max_length=128, description="Provider name, e.g. Reuters."),
    start: Optional[datetime] = Query(None),
    end: Optional[datetime] = Query(None),
    has_story: bool = Query(False, description="Only stories whose full text was fetched."),
    order: Literal["desc", "asc"] = Query("desc"),
    page: int = Query(1, ge=1, le=100000),
    page_size: int = Query(25, ge=1, le=100),
    conn=Depends(get_connection),
) -> NewsListResponse:
    payload = service.list_news(
        conn,
        symbol=(symbol or "").strip() or None,
        q=(q or "").strip() or None,
        provider=provider or None,
        start=start,
        end=end,
        has_story=has_story,
        order=order,
        page=page,
        page_size=page_size,
    )
    return NewsListResponse(**payload)


@router.get(
    "/items/{news_id}",
    response_model=NewsDetail,
    summary="One story with its full text",
)
def item(news_id: int = Path(..., ge=1), conn=Depends(get_connection)) -> NewsDetail:
    row = service.get_news(conn, news_id)
    if row is None:
        raise HTTPException(status_code=404, detail="News item not found.")
    return NewsDetail(**row)


@router.get(
    "/chart",
    response_model=ChartResponse,
    summary="Daily candles with a news count per trading day",
    description=(
        "Daily OHLCV from yfinance (cached for 30 minutes) for a tracked symbol, plus how many "
        "archived stories fall on each candle. Days follow New York time; weekend and holiday "
        "news counts toward the previous trading day. `start`/`end` on each marker can be passed "
        "to `/news/items` to list that day's stories."
    ),
)
def chart(
    symbol: str = Query("NASDAQ:NVDA", max_length=64, description="Tracked symbol, e.g. NASDAQ:NVDA."),
    range: Literal["1M", "3M", "6M", "1Y"] = Query("3M", description="How much history to show."),
    conn=Depends(get_connection),
) -> ChartResponse:
    row = service.tracked_symbol(conn, symbol.strip().upper())
    if row is None:
        raise HTTPException(status_code=404, detail="Symbol is not tracked.")
    try:
        payload = service.chart(conn, symbol=row["symbol"], name=row["name"], range_key=range)
    except PriceUnavailable as exc:
        raise HTTPException(status_code=503, detail="Price data is unavailable right now.") from exc
    return ChartResponse(**payload)
