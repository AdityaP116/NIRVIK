"""
NIRVIK Backend — Remaining Repositories (Entity, Document, Finding, Alert, Evidence, Audit)
"""
from __future__ import annotations

from typing import Any, Dict, List, Optional
from pymongo import DESCENDING

from app.repositories.base import BaseRepository


class EntityRepository(BaseRepository):
    def __init__(self) -> None:
        super().__init__("entities")

    async def find_by_type(self, entity_type: str, skip: int = 0, limit: int = 20) -> List[Dict[str, Any]]:
        return await self.find_many({"entity_type": entity_type}, skip=skip, limit=limit)

    async def find_by_case(self, case_id: str, skip: int = 0, limit: int = 50) -> List[Dict[str, Any]]:
        return await self.find_many({"linked_cases": case_id}, skip=skip, limit=limit)

    async def search_by_name(self, query: str, limit: int = 20) -> List[Dict[str, Any]]:
        return await self.find_many(
            {"$text": {"$search": query}}, limit=limit
        )

    async def find_by_normalized_name(self, normalized_name: str) -> List[Dict[str, Any]]:
        return await self.find_many({"normalized_name": {"$regex": normalized_name, "$options": "i"}})


class DocumentRepository(BaseRepository):
    def __init__(self) -> None:
        super().__init__("documents")

    async def find_by_case(self, case_id: str, skip: int = 0, limit: int = 20) -> List[Dict[str, Any]]:
        return await self.find_many({"case_id": case_id}, skip=skip, limit=limit, sort=[("created_at", DESCENDING)])


class FindingRepository(BaseRepository):
    def __init__(self) -> None:
        super().__init__("findings")

    async def find_by_case(self, case_id: str, skip: int = 0, limit: int = 20) -> List[Dict[str, Any]]:
        return await self.find_many({"case_id": case_id}, skip=skip, limit=limit, sort=[("created_at", DESCENDING)])

    async def find_by_entity(self, entity_id: str, skip: int = 0, limit: int = 20) -> List[Dict[str, Any]]:
        return await self.find_many({"entity_id": entity_id}, skip=skip, limit=limit)


class AlertRepository(BaseRepository):
    def __init__(self) -> None:
        super().__init__("alerts")

    async def find_by_case(self, case_id: str, skip: int = 0, limit: int = 20) -> List[Dict[str, Any]]:
        return await self.find_many({"case_id": case_id}, skip=skip, limit=limit, sort=[("created_at", DESCENDING)])

    async def find_high_priority(self, limit: int = 10) -> List[Dict[str, Any]]:
        return await self.find_many(
            {"priority": {"$in": ["HIGH", "CRITICAL"]}, "status": "NEW"},
            limit=limit,
            sort=[("created_at", DESCENDING)],
        )


class EvidenceRepository(BaseRepository):
    def __init__(self) -> None:
        super().__init__("evidence")

    async def find_by_case(self, case_id: str, skip: int = 0, limit: int = 20) -> List[Dict[str, Any]]:
        return await self.find_many({"case_id": case_id}, skip=skip, limit=limit)

    async def find_by_sha256(self, sha256: str) -> Optional[Dict[str, Any]]:
        return await self.find_one({"sha256": sha256})


class AuditRepository(BaseRepository):
    def __init__(self) -> None:
        super().__init__("audit_logs")

    async def get_last_entry(self) -> Optional[Dict[str, Any]]:
        docs = await self.find_many({}, skip=0, limit=1, sort=[("timestamp", DESCENDING)])
        return docs[0] if docs else None

    async def find_by_user(self, user_id: str, skip: int = 0, limit: int = 50) -> List[Dict[str, Any]]:
        return await self.find_many({"user_id": user_id}, skip=skip, limit=limit, sort=[("timestamp", DESCENDING)])
