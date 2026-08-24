"""
NIRVIK Backend — Neo4j Connection (async driver)
All Cypher queries use PARAMETERIZED statements only.
Direct user-input string interpolation into Cypher is FORBIDDEN.
"""
from __future__ import annotations

from typing import Any, Dict, List, Optional

from neo4j import AsyncGraphDatabase, AsyncDriver, AsyncSession

from app.core.config import settings
from app.core.logging import get_logger

logger = get_logger(__name__)

_driver: AsyncDriver | None = None


async def connect_neo4j() -> None:
    global _driver
    _driver = AsyncGraphDatabase.driver(
        settings.NEO4J_URI,
        auth=(settings.NEO4J_USER, settings.NEO4J_PASSWORD),
    )
    # Verify connection
    async with _driver.session(database=settings.NEO4J_DATABASE) as session:
        await session.run("RETURN 1")
    logger.info("neo4j_connected", uri=settings.NEO4J_URI)


async def close_neo4j() -> None:
    global _driver
    if _driver:
        await _driver.close()
        _driver = None
        logger.info("neo4j_disconnected")


def get_neo4j_driver() -> AsyncDriver:
    if _driver is None:
        raise RuntimeError("Neo4j not connected. Call connect_neo4j() first.")
    return _driver


def get_neo4j_session() -> AsyncSession:
    return get_neo4j_driver().session(database=settings.NEO4J_DATABASE)


async def ping_neo4j() -> bool:
    try:
        if _driver is None:
            return False
        async with _driver.session(database=settings.NEO4J_DATABASE) as session:
            result = await session.run("RETURN 1 AS ping")
            await result.single()
        return True
    except Exception:
        return False


async def run_query(
    cypher: str,
    parameters: Optional[Dict[str, Any]] = None,
) -> List[Dict[str, Any]]:
    """
    Execute a parameterized Cypher query and return records as dicts.
    IMPORTANT: Never pass user input as part of the cypher string itself.
    Always use parameters dict for variable values.
    """
    async with get_neo4j_session() as session:
        result = await session.run(cypher, parameters or {})
        records = await result.data()
        return records


async def run_write_query(
    cypher: str,
    parameters: Optional[Dict[str, Any]] = None,
) -> List[Dict[str, Any]]:
    """Execute a write (CREATE/MERGE/SET) parameterized Cypher query."""
    async def _work(tx: Any) -> List[Dict[str, Any]]:
        result = await tx.run(cypher, parameters or {})
        return await result.data()

    async with get_neo4j_session() as session:
        return await session.execute_write(_work)
