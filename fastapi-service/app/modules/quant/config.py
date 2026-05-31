"""Configuration for the quant module."""

from __future__ import annotations

import os
from pathlib import Path


DEFAULT_DB_PATH = Path("/data/quant/quant_pilot.duckdb")

TRACKED_SYMBOLS = ("QQQ",)

SMA_WINDOWS = (50, 100, 200)

HISTORY_START_DATE = "2011-01-01"

SCHEDULER_HOUR_ET = 17
SCHEDULER_MINUTE_ET = 30
SCHEDULER_TIMEZONE = "America/New_York"


def get_db_path() -> Path:
    configured = os.getenv("QUANT_DUCKDB_PATH")
    if configured:
        return Path(configured).expanduser()
    return DEFAULT_DB_PATH
