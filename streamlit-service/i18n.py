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
        "projection_header": "SMA{window} forecast (no future data)",
        "projection_caption": (
            "Tomorrow's SMA{window} is approximated by today's SMA{window_minus_one} "
            "(drop the oldest close instead of inventing a future one). Day +H uses "
            "SMA({window}-H) on the current tail."
        ),
        "projection_horizon_label": "Forecast horizon (business days)",
        "projection_horizon_help": (
            "How many trading days into the future to extend the SMA{window} projection."
        ),
        "projection_legend": "SMA{window} forecast",
        "projection_metric_label": "+{days} day(s) · {date}",
        "projection_not_enough_data": (
            "Need at least {window} closes in the visible window to build a projection."
        ),
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
        "projection_header": "SMA{window} 推测（不使用未来数据）",
        "projection_caption": (
            "用今天的 SMA{window_minus_one} 近似明天的 SMA{window}："
            "去掉最早一天的收盘价，而不是凭空虚构未来一天。"
            "未来第 H 天用今天的 SMA({window}-H)。"
        ),
        "projection_horizon_label": "推测天数（交易日）",
        "projection_horizon_help": (
            "把 SMA{window} 的推测线向未来延伸多少个交易日。"
        ),
        "projection_legend": "SMA{window} 推测",
        "projection_metric_label": "+{days} 天 · {date}",
        "projection_not_enough_data": (
            "需要可见区间内至少 {window} 个收盘价才能生成推测。"
        ),
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
