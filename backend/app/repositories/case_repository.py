"""
NIRVIK Backend — Case Repository
"""
from __future__ import annotations

from typing import Any, Dict, List, Optional
from pymongo import DESCENDING

from app.repositories.base import BaseRepository


class CaseRepository(BaseRepository):
    def __init__(self) -> None:
        super().__init__("cases")

    async def find_by_case_number(self, case_number: str) -> Optional[Dict[str, Any]]:
        return await self.find_one({"case_number": case_number})

    async def list_cases(
        self,
        filters: Dict[str, Any],
        skip: int = 0,
        limit: int = 20,
    ) -> List[Dict[str, Any]]:
        return await self.find_many(
            filters, skip=skip, limit=limit, sort=[("created_at", DESCENDING)]
        )

    async def add_entity_to_case(self, case_id: str, entity_id: str) -> bool:
        from bson import ObjectId
        try:
            oid = ObjectId(case_id)
        except Exception:
            return False
        result = await self.collection.update_one(
            {"_id": oid},
            {"$addToSet": {"entity_ids": entity_id}},
        )
        return result.modified_count > 0
