"""Pydantic models for news module responses. All datetimes are UTC."""

from __future__ import annotations

from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel


class NewsItem(BaseModel):
    id: int
    title: str
    published_at: datetime
    provider: Optional[str] = None
    urgency: Optional[int] = None
    paywall: bool
    story_status: str
    link: Optional[str] = None
    # NASDAQ-100 members first, then any other symbols the story mentions.
    symbols: List[str]


class NewsListResponse(BaseModel):
    total: int
    page: int
    page_size: int
    items: List[NewsItem]


class NewsDetail(NewsItem):
    short_description: Optional[str] = None
    body_text: Optional[str] = None
    copyright: Optional[str] = None


class TrackedSymbol(BaseModel):
    symbol: str
    name: Optional[str] = None
    news_count: int
    latest_published_at: Optional[datetime] = None


class ProviderCount(BaseModel):
    name: str
    count: int


class CollectRun(BaseModel):
    started_at: datetime
    finished_at: Optional[datetime] = None
    status: str
    headlines_new: int
    stories_fetched: int


class NewsOverview(BaseModel):
    total_news: int
    with_story: int
    earliest_published_at: Optional[datetime] = None
    latest_published_at: Optional[datetime] = None
    tracked_symbols: int
    providers: List[ProviderCount]
    last_run: Optional[CollectRun] = None
