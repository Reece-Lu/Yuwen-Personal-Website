"""Streamlit dashboard: QQQ K-line with SMA 50 / 100 / 200.

Reads the DuckDB file maintained by the FastAPI quant module's scheduler
(shared via the /data/quant volume in docker-compose).

Language is controlled by `?lang=zh` / `?lang=en` query string — set by the
React wrapper page at /quantmonitor.
"""

from __future__ import annotations

from datetime import date

import pandas as pd
import plotly.graph_objects as go
import streamlit as st

from db import load_candles_with_smas, price_date_bounds
from i18n import get_strings, resolve_lang


SYMBOL = "QQQ"
SMA_WINDOWS = (50, 100, 200)

SMA_COLORS = {
    50: "#1f9d72",
    100: "#ba7a13",
    200: "#2368b8",
}

# SMA used for the forward projection. This window IS one of SMA_WINDOWS
# (already drawn as a solid line from DuckDB), so the projection just extends
# that existing line into the future with a dashed segment.
PROJECTION_WINDOW = 50
PROJECTION_COLOR = "#8849c4"  # purple — distinct from the solid SMA50 green
PROJECTION_MAX_HORIZON = 15
PROJECTION_DEFAULT_HORIZON = 5


def _query_lang() -> str:
    """Read `?lang=` from Streamlit's query params with version compatibility."""

    try:  # Streamlit >= 1.30
        raw = st.query_params.get("lang")
    except Exception:  # pragma: no cover
        raw = st.experimental_get_query_params().get("lang")
    return resolve_lang(raw)


def format_price(value: float) -> str:
    return f"${value:,.2f}"


def format_price_delta(value: float) -> str:
    sign = "+" if value >= 0 else "-"
    return f"{sign}${abs(value):,.2f}"


def format_percent(value: float) -> str:
    return f"{value:+.2f}%"


def apply_page_style(page_title: str) -> None:
    st.set_page_config(
        page_title=page_title,
        layout="wide",
        initial_sidebar_state="collapsed",
    )
    st.markdown(
        """
        <style>
            :root {
                --qp-ink: #172026;
                --qp-muted: #66737f;
                --qp-line: #e6eaee;
                --qp-bg: #f7f8fa;
                --qp-green: #1f9d72;
                --qp-blue: #2368b8;
                --qp-amber: #ba7a13;
            }
            /* Streamlit normally pegs .stApp to min-height:100vh and scrolls
               internally. When embedded in an auto-resizing iframe we want
               wrappers sized purely by content so the host page can size the
               iframe to match — otherwise the iframe and wrappers feedback
               into runaway growth. */
            html, body, .stApp,
            [data-testid="stAppViewContainer"],
            [data-testid="stMain"],
            section.main {
                height: auto !important;
                min-height: 0 !important;
                overflow: visible !important;
            }
            .stApp { background: var(--qp-bg); color: var(--qp-ink); }
            [data-testid="stHeader"] { background: rgba(247, 248, 250, 0.9); }
            /* Fill the iframe width — the React wrapper already constrains
               the overall column, so we let Streamlit's container span the
               full available width here. */
            .block-container {
                max-width: 100% !important;
                padding-top: 0.8rem;
                padding-bottom: 1.5rem;
                padding-left: 1.5rem;
                padding-right: 1.5rem;
            }
        </style>
        """,
        unsafe_allow_html=True,
    )


@st.cache_data(ttl=300)
def cached_bounds() -> tuple[date | None, date | None]:
    return price_date_bounds(SYMBOL)


@st.cache_data(ttl=300)
def cached_chart_data(start: date, end: date) -> pd.DataFrame:
    return load_candles_with_smas(
        symbol=SYMBOL,
        sma_windows=SMA_WINDOWS,
        start_date=start,
        end_date=end,
    )


def compute_projection(series: list[float], horizon: int) -> list[float]:
    """Approximate SMA(PROJECTION_WINDOW) for the next `horizon` days
    WITHOUT using any future data.

    Heuristic: tomorrow's SMA ≈ today's SMA(W-1) (drop the oldest value
    instead of inventing a fictitious tomorrow value). Day +H ≈ SMA(W-H)
    on the current tail. Requires at least PROJECTION_WINDOW values;
    entries that would shrink the window below 2 values are dropped.

    `series` should be the same price series the stored SMA uses
    (adj_close) so the projection lines up with the solid SMA line.
    """

    if len(series) < PROJECTION_WINDOW:
        return []
    tail = list(series[-PROJECTION_WINDOW:])
    values: list[float] = []
    for h in range(1, horizon + 1):
        window_size = PROJECTION_WINDOW - h
        if window_size < 2:
            break
        # Last `window_size` values from today (i.e. drop the oldest h).
        slice_ = tail[h:]
        values.append(sum(slice_) / len(slice_))
    return values


def projection_dates(last_date: pd.Timestamp, count: int) -> list[pd.Timestamp]:
    """Next `count` business days strictly after `last_date`."""

    if count <= 0:
        return []
    # +1 because date_range is inclusive of `start` if it's a business day.
    return list(
        pd.bdate_range(
            start=last_date + pd.Timedelta(days=1),
            periods=count,
        )
    )


def build_figure(
    data: pd.DataFrame,
    projection_xs: list[pd.Timestamp],
    projection_ys: list[float],
    t: dict,
) -> go.Figure:
    chart = data.copy()
    chart["date"] = pd.to_datetime(chart["date"])

    fig = go.Figure()
    fig.add_trace(
        go.Candlestick(
            x=chart["date"],
            open=chart["open"],
            high=chart["high"],
            low=chart["low"],
            close=chart["close"],
            name=SYMBOL,
            increasing_line_color="#1f9d72",
            increasing_fillcolor="#1f9d72",
            decreasing_line_color="#cf3d3d",
            decreasing_fillcolor="#cf3d3d",
        )
    )

    # SMA 50 / 100 / 200 — solid lines straight from DuckDB. SMA50 is also
    # the line the forward projection extends below.
    for window in SMA_WINDOWS:
        column = f"sma{window}"
        if column not in chart.columns:
            continue
        fig.add_trace(
            go.Scatter(
                x=chart["date"],
                y=chart[column],
                mode="lines",
                name=f"SMA{window}",
                line={"color": SMA_COLORS[window], "width": 2},
                hovertemplate=f"SMA{window}: $%{{y:,.2f}}<extra></extra>",
            )
        )

    # Forward projection — anchor with today's actual SMA50 so the dashed
    # line visually continues the solid SMA50 line.
    projection_column = f"sma{PROJECTION_WINDOW}"
    if projection_xs and projection_ys and projection_column in chart.columns:
        last_actual_idx = chart[projection_column].last_valid_index()
        if last_actual_idx is not None:
            anchor_x = [chart["date"].iloc[last_actual_idx]]
            anchor_y = [float(chart[projection_column].iloc[last_actual_idx])]
        else:
            anchor_x, anchor_y = [], []

        fig.add_trace(
            go.Scatter(
                x=anchor_x + list(projection_xs),
                y=anchor_y + list(projection_ys),
                mode="lines+markers",
                name=t["projection_legend"].format(window=PROJECTION_WINDOW),
                line={"color": PROJECTION_COLOR, "width": 2, "dash": "dot"},
                marker={"color": PROJECTION_COLOR, "size": 6, "symbol": "circle-open"},
                hovertemplate=(
                    t["projection_legend"].format(window=PROJECTION_WINDOW)
                    + ": $%{y:,.2f}<extra></extra>"
                ),
            )
        )

    fig.update_layout(
        height=640,
        margin={"l": 10, "r": 10, "t": 32, "b": 10},
        paper_bgcolor="rgba(0,0,0,0)",
        plot_bgcolor="#ffffff",
        hovermode="x unified",
        showlegend=True,
        legend={
            "orientation": "h",
            "yanchor": "bottom",
            "y": 1.02,
            "xanchor": "right",
            "x": 1,
        },
        xaxis={"rangeslider": {"visible": False}, "showgrid": False, "type": "date"},
        yaxis={
            "title": "",
            "tickprefix": "$",
            "showgrid": True,
            "gridcolor": "#edf0f3",
        },
    )
    return fig


def render_metrics(data: pd.DataFrame, t: dict) -> None:
    latest = data.iloc[-1]
    close = float(latest["close"])

    st.markdown(f"##### {t['latest_header']}")
    cols = st.columns(4, gap="medium")
    cols[0].metric(t["close_label"], format_price(close))

    for i, window in enumerate(SMA_WINDOWS, start=1):
        column = f"sma{window}"
        sma = latest.get(column)
        label = t["sma_label"].format(window=window)
        if pd.isna(sma):
            cols[i].metric(label, "—")
            continue
        sma_value = float(sma)
        delta = close - sma_value
        pct = delta / sma_value * 100
        cols[i].metric(
            label,
            format_price(sma_value),
            delta=f"{format_percent(pct)} ({format_price_delta(delta)})",
        )


def render_projection_section(
    data: pd.DataFrame,
    projection_xs: list[pd.Timestamp],
    projection_ys: list[float],
    t: dict,
) -> None:
    st.markdown(f"##### {t['projection_header'].format(window=PROJECTION_WINDOW)}")
    st.caption(
        t["projection_caption"].format(
            window=PROJECTION_WINDOW,
            window_minus_one=PROJECTION_WINDOW - 1,
        )
    )

    if not projection_ys:
        st.info(t["projection_not_enough_data"].format(window=PROJECTION_WINDOW))
        return

    # Today's actual SMA50 (from DuckDB) as the baseline for deltas.
    today_sma = None
    sma_column = f"sma{PROJECTION_WINDOW}"
    if sma_column in data.columns:
        valid = data[sma_column].dropna()
        if not valid.empty:
            today_sma = float(valid.iloc[-1])

    cols = st.columns(min(5, len(projection_ys)), gap="small")
    for i, (when, value) in enumerate(zip(projection_xs, projection_ys)):
        col = cols[i % len(cols)]
        label = t["projection_metric_label"].format(days=i + 1, date=when.date().isoformat())
        if today_sma is None:
            col.metric(label, format_price(value))
        else:
            delta = value - today_sma
            pct = delta / today_sma * 100
            col.metric(
                label,
                format_price(value),
                delta=f"{format_percent(pct)} ({format_price_delta(delta)})",
            )


def render_chart_section(t: dict) -> None:
    min_date, max_date = cached_bounds()
    if min_date is None or max_date is None:
        st.warning(t["no_data_warning"])
        return

    default_start = (pd.Timestamp(max_date) - pd.DateOffset(months=6)).date()
    default_start = max(default_start, min_date)

    st.markdown(f"##### {t['date_range_header']}")
    start_col, end_col = st.columns(2, gap="medium")
    with start_col:
        start_date = st.date_input(
            t["start_date_label"],
            value=default_start,
            min_value=min_date,
            max_value=max_date,
        )
    with end_col:
        end_date = st.date_input(
            t["end_date_label"],
            value=max_date,
            min_value=min_date,
            max_value=max_date,
        )

    if start_date > end_date:
        st.error(t["date_order_error"])
        return

    data = cached_chart_data(start_date, end_date)
    if data.empty:
        st.warning(t["no_data_window"])
        return

    render_metrics(data, t)

    horizon = st.slider(
        t["projection_horizon_label"].format(window=PROJECTION_WINDOW),
        min_value=1,
        max_value=PROJECTION_MAX_HORIZON,
        value=PROJECTION_DEFAULT_HORIZON,
        step=1,
        help=t["projection_horizon_help"].format(window=PROJECTION_WINDOW),
    )

    # Project on adj_close so the dashed line lines up with the stored
    # SMA50 (which is computed from adj_close in the FastAPI module).
    series_for_projection = data["adj_close"].tolist()
    projection_ys = compute_projection(series_for_projection, horizon)
    last_date = pd.to_datetime(data["date"].iloc[-1])
    projection_xs = projection_dates(last_date, len(projection_ys))

    fig = build_figure(data, projection_xs, projection_ys, t)
    st.plotly_chart(fig, use_container_width=True)

    render_projection_section(data, projection_xs, projection_ys, t)

    st.caption(t["caption"])


def main() -> None:
    lang = _query_lang()
    t = get_strings(lang)

    apply_page_style(t["page_title"])
    # The hero block (kicker / title / subtitle) is rendered by the React
    # wrapper at /quantmonitor, so the Streamlit app jumps straight into the
    # chart controls to avoid duplication.
    render_chart_section(t)


if __name__ == "__main__":
    main()
