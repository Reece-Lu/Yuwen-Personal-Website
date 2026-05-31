"""Pydantic models for quant module responses."""

from __future__ import annotations

from typing import List, Optional

from pydantic import BaseModel, Field


class Candle(BaseModel):
    date: str
    open: float
    high: float
    low: float
    close: float
    adj_close: float
    volume: int
    sma50: Optional[float] = None
    sma100: Optional[float] = None
    sma200: Optional[float] = None


class Latest(BaseModel):
    date: str
    close: float
    sma50: Optional[float] = None
    sma100: Optional[float] = None
    sma200: Optional[float] = None


class CandlestickResponse(BaseModel):
    symbol: str
    candles: List[Candle]
    latest: Optional[Latest] = None


class DateBoundsResponse(BaseModel):
    symbol: str
    min_date: Optional[str] = None
    max_date: Optional[str] = None


class RefreshResponse(BaseModel):
    rows_written: int
    sma_rows: dict = Field(default_factory=dict)
    symbols: List[str]
    start_date: str
    errors: dict = Field(default_factory=dict)
