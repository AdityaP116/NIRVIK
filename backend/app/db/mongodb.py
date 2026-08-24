"""
NIRVIK Backend — MongoDB Connection via Motor (async)
"""
from __future__ import annotations

from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase

from app.core.config import settings
from app.core.logging import get_logger

logger = get_logger(__name__)

_client: AsyncIOMotorClient | None = None


async def connect_mongodb() -> None:
    global _client
    _client = AsyncIOMotorClient(
        settings.MONGODB_URI,
        serverSelectionTimeoutMS=5000,
        connectTimeoutMS=5000,
    )
    # Verify connection
    await _client.admin.command("ping")
    logger.info("mongodb_connected", database=settings.MONGODB_DATABASE)


async def close_mongodb() -> None:
    global _client
    if _client:
        _client.close()
        _client = None
        logger.info("mongodb_disconnected")


def get_database() -> AsyncIOMotorDatabase:
    if _client is None:
        raise RuntimeError("MongoDB not connected. Call connect_mongodb() first.")
    return _client[settings.MONGODB_DATABASE]


async def ping_mongodb() -> bool:
    try:
        if _client is None:
            return False
        await _client.admin.command("ping")
        return True
    except Exception:
        return False
