"""MySQL connection for the news archive.

Every DATETIME in `market_news` is UTC, so the session time zone is pinned to
+00:00 and values are tagged as UTC before they leave this module.
"""

from __future__ import annotations

import os
from datetime import datetime, timezone
from typing import Optional

import pymysql
from pymysql.cursors import DictCursor


class NewsDatabaseUnavailable(RuntimeError):
    """The archive is not configured or cannot be reached."""


def connect() -> pymysql.connections.Connection:
    password = os.getenv("NEWS_MYSQL_PASSWORD", "")
    if not password:
        raise NewsDatabaseUnavailable("News database is not configured (NEWS_MYSQL_PASSWORD is empty).")
    try:
        return pymysql.connect(
            host=os.getenv("NEWS_MYSQL_HOST", "host.docker.internal"),
            port=int(os.getenv("NEWS_MYSQL_PORT", "3306")),
            user=os.getenv("NEWS_MYSQL_USER", "news_reader"),
            password=password,
            database=os.getenv("NEWS_MYSQL_DATABASE", "market_news"),
            charset="utf8mb4",
            cursorclass=DictCursor,
            autocommit=True,
            connect_timeout=5,
            read_timeout=20,
            init_command="SET time_zone = '+00:00'",
        )
    except pymysql.MySQLError as exc:
        raise NewsDatabaseUnavailable("News database is unreachable.") from exc


def as_utc(value: Optional[datetime]) -> Optional[datetime]:
    """Tag a naive UTC value from MySQL as UTC (so it serializes with a trailing Z)."""
    if value is None:
        return None
    return value.replace(tzinfo=timezone.utc)


def to_naive_utc(value: Optional[datetime]) -> Optional[datetime]:
    """Convert a request datetime to the naive UTC form MySQL stores. Naive input is taken as UTC."""
    if value is None:
        return None
    if value.tzinfo is not None:
        value = value.astimezone(timezone.utc).replace(tzinfo=None)
    return value
