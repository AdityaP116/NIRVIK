"""
NIRVIK Backend — Database Reset Script
Clears and re-seeds both MongoDB and Neo4j synthetic databases.
"""
from __future__ import annotations

import asyncio
from app.core.logging import configure_logging, get_logger
from seed.seed_database import seed_mongodb
from seed.seed_graph import seed_neo4j_graph

logger = get_logger(__name__)


async def main():
    logger.info("starting_full_database_reset")
    await seed_mongodb()
    try:
        await seed_neo4j_graph()
    except Exception as e:
        logger.warning("neo4j_reset_warning", note="Neo4j graph seeding requires running Neo4j database instance.", error=str(e))
    logger.info("full_database_reset_completed")


if __name__ == "__main__":
    configure_logging()
    asyncio.run(main())
