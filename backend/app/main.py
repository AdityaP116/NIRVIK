"""
NIRVIK Backend — Main Application Entrypoint
"""
from __future__ import annotations

from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.v1.auth import router as auth_router
from app.api.v1.cases import router as cases_router
from app.api.v1.entities import router as entities_router
from app.api.v1.network import router as network_router
from app.api.v1.routers import (
    alerts_router, assistant_router, audit_router, dashboard_router,
    evidence_router, findings_router, health_router, reports_router,
    search_router, timeline_router,
)
from app.core.config import settings
from app.core.exceptions import (
    NIRVIKException, http_exception_handler,
    nirvik_exception_handler, unhandled_exception_handler,
)
from app.core.logging import configure_logging, get_logger
from app.db.mongodb import close_mongodb, connect_mongodb
from app.db.neo4j import close_neo4j, connect_neo4j
from app.db.redis import close_redis, connect_redis

configure_logging()
logger = get_logger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application startup and shutdown lifecycles."""
    logger.info("starting_nirvik_backend", version=settings.APP_VERSION, env=settings.APP_ENV)

    # 1. Connect MongoDB
    try:
        await connect_mongodb()
    except Exception as exc:
        logger.warning("mongodb_connection_deferred", error=str(exc))

    # 2. Connect Neo4j
    try:
        await connect_neo4j()
    except Exception as exc:
        logger.warning("neo4j_connection_deferred", error=str(exc))

    # 3. Connect Redis
    try:
        await connect_redis()
    except Exception as exc:
        logger.warning("redis_connection_deferred", error=str(exc))

    yield

    # Shutdown
    logger.info("shutting_down_nirvik_backend")
    await close_mongodb()
    await close_neo4j()
    await close_redis()


app = FastAPI(
    title=settings.APP_TITLE,
    version=settings.APP_VERSION,
    description="NIRVIK Intelligence & Investigation Decision-Support Platform Backend",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Exception Handlers
app.add_exception_handler(NIRVIKException, nirvik_exception_handler)
app.add_exception_handler(HTTPException, http_exception_handler)
app.add_exception_handler(Exception, unhandled_exception_handler)

# Include Health Check
app.include_router(health_router)

# Include API v1 Routers
api_v1_prefix = "/api/v1"
app.include_router(auth_router, prefix=api_v1_prefix)
app.include_router(cases_router, prefix=api_v1_prefix)
app.include_router(entities_router, prefix=api_v1_prefix)
app.include_router(network_router, prefix=api_v1_prefix)
app.include_router(search_router, prefix=api_v1_prefix)
app.include_router(findings_router, prefix=api_v1_prefix)
app.include_router(alerts_router, prefix=api_v1_prefix)
app.include_router(evidence_router, prefix=api_v1_prefix)
app.include_router(timeline_router, prefix=api_v1_prefix)
app.include_router(reports_router, prefix=api_v1_prefix)
app.include_router(assistant_router, prefix=api_v1_prefix)
app.include_router(dashboard_router, prefix=api_v1_prefix)
app.include_router(audit_router, prefix=api_v1_prefix)


@app.get("/")
async def root():
    return {
        "title": settings.APP_TITLE,
        "version": settings.APP_VERSION,
        "docs": "/docs",
        "health": "/health/ready",
    }
