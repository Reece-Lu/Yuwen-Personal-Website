"""Queries against the news archive. Every function takes an open connection."""

from __future__ import annotations

from datetime import datetime
from typing import Any, Dict, List, Optional

from app.modules.news.database import as_utc, to_naive_utc


def _escape_like(text: str) -> str:
    return text.replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_")


def _symbols_by_news(conn, news_ids: List[int]) -> Dict[int, List[str]]:
    if not news_ids:
        return {}
    placeholders = ", ".join(["%s"] * len(news_ids))
    sql = f"""
        SELECT ns.news_id, ns.symbol
        FROM news_symbol ns
        LEFT JOIN tracked_symbol t ON t.symbol = ns.symbol
        WHERE ns.news_id IN ({placeholders})
        ORDER BY ns.news_id, (t.symbol IS NULL), ns.symbol
    """
    out: Dict[int, List[str]] = {news_id: [] for news_id in news_ids}
    with conn.cursor() as cur:
        cur.execute(sql, news_ids)
        for row in cur.fetchall():
            out[row["news_id"]].append(row["symbol"])
    return out


def _item(row: Dict[str, Any], symbols: List[str]) -> Dict[str, Any]:
    return {
        "id": row["id"],
        "title": row["title"],
        "published_at": as_utc(row["published_at"]),
        "provider": row["provider_name"],
        "urgency": row["urgency"],
        "paywall": bool(row["paywall"]),
        "story_status": row["story_status"],
        "link": row["link"],
        "symbols": symbols,
    }


_ITEM_COLUMNS = (
    "n.id, n.title, n.published_at, n.provider_name, n.urgency, n.paywall, n.story_status, n.link"
)


def list_news(
    conn,
    *,
    symbol: Optional[str],
    q: Optional[str],
    provider: Optional[str],
    start: Optional[datetime],
    end: Optional[datetime],
    has_story: bool,
    order: str,
    page: int,
    page_size: int,
) -> Dict[str, Any]:
    joins = ""
    # With a symbol filter, range and sort on news_symbol.published_at so the
    # (symbol, published_at) index serves both.
    time_col = "n.published_at"
    where: List[str] = []
    params: List[Any] = []

    if symbol:
        joins = "JOIN news_symbol s ON s.news_id = n.id"
        time_col = "s.published_at"
        where.append("s.symbol = %s")
        params.append(symbol)
    if q:
        where.append("n.title LIKE %s")
        params.append(f"%{_escape_like(q)}%")
    if provider:
        where.append("n.provider_name = %s")
        params.append(provider)
    if start:
        where.append(f"{time_col} >= %s")
        params.append(to_naive_utc(start))
    if end:
        where.append(f"{time_col} < %s")
        params.append(to_naive_utc(end))
    if has_story:
        where.append("n.story_status = 'fetched'")

    where_sql = f"WHERE {' AND '.join(where)}" if where else ""
    direction = "ASC" if order == "asc" else "DESC"

    with conn.cursor() as cur:
        cur.execute(f"SELECT COUNT(*) AS c FROM news_item n {joins} {where_sql}", params)
        total = cur.fetchone()["c"]
        cur.execute(
            f"""
            SELECT {_ITEM_COLUMNS}
            FROM news_item n {joins} {where_sql}
            ORDER BY {time_col} {direction}, n.id {direction}
            LIMIT %s OFFSET %s
            """,
            [*params, page_size, (page - 1) * page_size],
        )
        rows = cur.fetchall()

    symbols = _symbols_by_news(conn, [row["id"] for row in rows])
    return {
        "total": total,
        "page": page,
        "page_size": page_size,
        "items": [_item(row, symbols[row["id"]]) for row in rows],
    }


def get_news(conn, news_id: int) -> Optional[Dict[str, Any]]:
    with conn.cursor() as cur:
        cur.execute(
            f"""
            SELECT {_ITEM_COLUMNS}, st.short_description, st.body_text, st.copyright
            FROM news_item n
            LEFT JOIN news_story st ON st.news_id = n.id
            WHERE n.id = %s
            """,
            [news_id],
        )
        row = cur.fetchone()
    if row is None:
        return None
    item = _item(row, _symbols_by_news(conn, [news_id])[news_id])
    item.update(
        short_description=row["short_description"],
        body_text=row["body_text"],
        copyright=row["copyright"],
    )
    return item


def list_tracked_symbols(conn) -> List[Dict[str, Any]]:
    with conn.cursor() as cur:
        cur.execute(
            """
            SELECT t.symbol, t.name, COUNT(s.news_id) AS news_count, MAX(s.published_at) AS latest
            FROM tracked_symbol t
            LEFT JOIN news_symbol s ON s.symbol = t.symbol
            WHERE t.active = 1
            GROUP BY t.symbol, t.name
            ORDER BY t.symbol
            """
        )
        rows = cur.fetchall()
    return [
        {
            "symbol": row["symbol"],
            "name": row["name"],
            "news_count": row["news_count"],
            "latest_published_at": as_utc(row["latest"]),
        }
        for row in rows
    ]


def overview(conn) -> Dict[str, Any]:
    with conn.cursor() as cur:
        cur.execute(
            """
            SELECT COUNT(*) AS total, COALESCE(SUM(story_status = 'fetched'), 0) AS with_story,
                   MIN(published_at) AS earliest, MAX(published_at) AS latest
            FROM news_item
            """
        )
        totals = cur.fetchone()
        cur.execute("SELECT COUNT(*) AS c FROM tracked_symbol WHERE active = 1")
        tracked = cur.fetchone()["c"]
        cur.execute(
            """
            SELECT provider_name AS name, COUNT(*) AS count
            FROM news_item
            WHERE provider_name IS NOT NULL
            GROUP BY provider_name
            ORDER BY count DESC, name
            """
        )
        providers = cur.fetchall()
        cur.execute(
            """
            SELECT started_at, finished_at, status, headlines_new, stories_fetched
            FROM collect_run
            ORDER BY id DESC
            LIMIT 1
            """
        )
        run = cur.fetchone()

    if run:
        run["started_at"] = as_utc(run["started_at"])
        run["finished_at"] = as_utc(run["finished_at"])
    return {
        "total_news": totals["total"],
        "with_story": int(totals["with_story"]),
        "earliest_published_at": as_utc(totals["earliest"]),
        "latest_published_at": as_utc(totals["latest"]),
        "tracked_symbols": tracked,
        "providers": providers,
        "last_run": run,
    }
