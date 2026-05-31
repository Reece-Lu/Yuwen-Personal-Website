"""Tiny i18n dictionary for the Streamlit QQQ monitor.

Language is chosen by the `?lang=zh` / `?lang=en` query parameter set by
the React wrapper page. Falls back to English.
"""

from __future__ import annotations


STRINGS = {
    "en": {
        "page_title": "QQQ SMA Monitor",
        "no_data_warning": (
            "No price data is available yet.\n\n"
            "Wait for the FastAPI daily scheduler to run once, or trigger "
            "an immediate backfill with `POST /api/quant/refresh?full=true`."
        ),
        "no_data_window": "No QQQ price data in this date range.",
        "date_range_header": "Date range",
        "start_date_label": "Start date",
        "end_date_label": "End date",
        "date_order_error": "Start date cannot be after end date.",
        "latest_header": "Latest metrics",
        "close_label": "Close",
        "sma_label": "SMA{window}",
        "caption": (
            "Data is fetched daily from yfinance by the FastAPI service "
            "after the U.S. market close and persisted to DuckDB. "
            "Research use only — not investment advice."
        ),
    },
    "zh": {
        "page_title": "QQQ 均线监控",
        "no_data_warning": (
            "还没有可用行情数据。\n\n"
            "请等待 FastAPI 的每日定时任务运行一次，或者直接调用 "
            "`POST /api/quant/refresh?full=true` 触发一次数据回填。"
        ),
        "no_data_window": "这个时间段没有 QQQ 行情数据。",
        "date_range_header": "时间范围",
        "start_date_label": "开始日期",
        "end_date_label": "结束日期",
        "date_order_error": "开始日期不能晚于结束日期。",
        "latest_header": "最新指标",
        "close_label": "收盘价",
        "sma_label": "SMA{window}",
        "caption": (
            "数据每日由 FastAPI 服务在美东收盘后从 yfinance 抓取并写入 DuckDB。"
            "仅供研究使用，不构成投资建议。"
        ),
    },
}


def resolve_lang(raw_value) -> str:
    """Normalize whatever Streamlit gives us for `?lang=` to 'en' / 'zh'."""

    if not raw_value:
        return "en"
    if isinstance(raw_value, list):
        raw_value = raw_value[0] if raw_value else ""
    normalized = str(raw_value).strip().lower()
    return "zh" if normalized in {"zh", "zh-cn", "zh_cn", "cn", "chinese"} else "en"


def get_strings(lang: str) -> dict:
    return STRINGS.get(lang, STRINGS["en"])
