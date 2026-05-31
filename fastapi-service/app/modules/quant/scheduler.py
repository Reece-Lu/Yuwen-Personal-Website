"""APScheduler glue: runs a daily yfinance refresh after US market close."""

from __future__ import annotations

import logging
from typing import Optional

from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger

from app.modules.quant import service
from app.modules.quant.config import (
    SCHEDULER_HOUR_ET,
    SCHEDULER_MINUTE_ET,
    SCHEDULER_TIMEZONE,
)


logger = logging.getLogger(__name__)

_scheduler: Optional[BackgroundScheduler] = None


def _job() -> None:
    try:
        summary = service.refresh_prices()
        logger.info("quant scheduler: refresh OK %s", summary)
    except Exception:  # noqa: BLE001
        logger.exception("quant scheduler: refresh failed")


def start_scheduler() -> None:
    global _scheduler
    if _scheduler is not None:
        return

    try:
        service.refresh_prices()
    except Exception:  # noqa: BLE001
        logger.exception("quant scheduler: initial refresh failed (will retry on cron)")

    scheduler = BackgroundScheduler(timezone=SCHEDULER_TIMEZONE)
    scheduler.add_job(
        _job,
        CronTrigger(
            day_of_week="mon-fri",
            hour=SCHEDULER_HOUR_ET,
            minute=SCHEDULER_MINUTE_ET,
            timezone=SCHEDULER_TIMEZONE,
        ),
        id="quant_daily_refresh",
        replace_existing=True,
    )
    scheduler.start()
    _scheduler = scheduler
    logger.info(
        "quant scheduler started — daily refresh at %02d:%02d %s (Mon–Fri)",
        SCHEDULER_HOUR_ET,
        SCHEDULER_MINUTE_ET,
        SCHEDULER_TIMEZONE,
    )


def stop_scheduler() -> None:
    global _scheduler
    if _scheduler is None:
        return
    _scheduler.shutdown(wait=False)
    _scheduler = None
