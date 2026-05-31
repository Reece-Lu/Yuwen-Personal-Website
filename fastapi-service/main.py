"""FastAPI service entry point.

Modules are mounted under ``app/modules/`` and included here as routers.
Add new feature modules by creating ``app/modules/<name>/router.py`` and
appending it to ``MODULE_ROUTERS`` below.
"""

import os
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.modules.quant.router import router as quant_router
from app.modules.quant.scheduler import start_scheduler, stop_scheduler
from app.modules.quantum.router import router as quantum_router
from app.modules.users.router import router as users_router

# Routers from every feature module. Add new ones here.
MODULE_ROUTERS = [
    quantum_router,
    users_router,
    quant_router,
]


@asynccontextmanager
async def lifespan(_: FastAPI):
    start_scheduler()
    try:
        yield
    finally:
        stop_scheduler()

# OpenAPI tag descriptions — shown as group headers in Swagger UI.
TAGS_METADATA = [
    {
        "name": "Quantum ML",
        "description": (
            "Image classifiers — a classic CNN and a hybrid Quantum-Classical NN — "
            "trained on a 2-class subset of CIFAR-10 (airplane vs automobile)."
        ),
    },
    {
        "name": "Users",
        "description": "Fake user data generators (Chinese-style names + pinyin).",
    },
    {
        "name": "Quant",
        "description": (
            "Nasdaq-100 ETF (QQQ) daily K-line and SMA 50/100/200 monitor. "
            "Prices are refreshed daily from yfinance via APScheduler and stored in DuckDB."
        ),
    },
    {
        "name": "Meta",
        "description": "Service metadata and health checks.",
    },
]

# When deployed behind nginx at `/api/*`, set ROOT_PATH=/api so Swagger UI
# generates correct URLs. For direct local use, leave empty.
ROOT_PATH = os.environ.get("ROOT_PATH", "")

app = FastAPI(
    title="Yuwen's FastAPI Service",
    description=(
        "Modular FastAPI backend for meetyuwen.com.\n\n"
        "Current modules:\n"
        "* **Quantum ML** — Classic CNN vs hybrid Quantum NN image classification.\n"
        "* **Users** — Random Chinese-style user data generator.\n"
        "* **Quant** — Nasdaq-100 (QQQ) K-line + SMA 50/100/200 with daily yfinance refresh.\n"
    ),
    version="0.3.0",
    contact={"name": "Yuwen Lu", "url": "https://www.meetyuwen.com"},
    license_info={"name": "MIT"},
    openapi_tags=TAGS_METADATA,
    # No explicit `servers` list — FastAPI derives the server URL from the
    # incoming request host + root_path, so Swagger UI works correctly both
    # at http://localhost/api/docs and at https://www.meetyuwen.com/api/docs
    # without any hardcoded hostnames.
    root_path=ROOT_PATH,
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get(
    "/",
    tags=["Meta"],
    summary="Service welcome message",
    response_description="A short greeting and service version.",
)
def read_root() -> dict:
    return {"message": "Welcome to Yuwen's FastAPI service.", "version": app.version}


@app.get(
    "/health",
    tags=["Meta"],
    summary="Liveness probe",
    response_description="Always returns `{\"status\": \"ok\"}` when the service is up.",
)
def health() -> dict:
    return {"status": "ok"}


for module_router in MODULE_ROUTERS:
    app.include_router(module_router)
