"""
NIRVIK Backend — Base Repository (MongoDB CRUD operations)
"""
from __future__ import annotations

from typing import Any, Dict, List, Optional
from bson import ObjectId

from app.db.mongodb import get_database


def _to_str_id(doc: Optional[Dict[str, Any]]) -> Optional[Dict[str, Any]]:
    """Convert MongoDB ObjectId _id to string."""
    if doc is None:
        return None
    if "_id" in doc and isinstance(doc["_id"], ObjectId):
        doc["_id"] = str(doc["_id"])
    return doc


class BaseRepository:
    def __init__(self, collection_name: str) -> None:
        self._collection_name = collection_name

    @property
    def collection(self):
        return get_database()[self._collection_name]

    async def find_by_id(self, doc_id: str) -> Optional[Dict[str, Any]]:
        try:
            oid = ObjectId(doc_id)
        except Exception:
            return None
        doc = await self.collection.find_one({"_id": oid})
        return _to_str_id(doc)

    async def find_one(self, query: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        doc = await self.collection.find_one(query)
        return _to_str_id(doc)

    async def find_many(
        self,
        query: Dict[str, Any],
        skip: int = 0,
        limit: int = 20,
        sort: Optional[List[tuple]] = None,
    ) -> List[Dict[str, Any]]:
        cursor = self.collection.find(query)
        if sort:
            cursor = cursor.sort(sort)
        cursor = cursor.skip(skip).limit(limit)
        docs = await cursor.to_list(length=limit)
        return [_to_str_id(d) for d in docs]

    async def count(self, query: Dict[str, Any]) -> int:
        return await self.collection.count_documents(query)

    async def insert_one(self, doc: Dict[str, Any]) -> str:
        doc_copy = {k: v for k, v in doc.items() if k != "_id" and k != "id"}
        result = await self.collection.insert_one(doc_copy)
        return str(result.inserted_id)

    async def update_by_id(self, doc_id: str, updates: Dict[str, Any]) -> bool:
        try:
            oid = ObjectId(doc_id)
        except Exception:
            return False
        result = await self.collection.update_one(
            {"_id": oid}, {"$set": updates}
        )
        return result.modified_count > 0

    async def delete_by_id(self, doc_id: str) -> bool:
        try:
            oid = ObjectId(doc_id)
        except Exception:
            return False
        result = await self.collection.delete_one({"_id": oid})
        return result.deleted_count > 0

    async def upsert(
        self, query: Dict[str, Any], doc: Dict[str, Any]
    ) -> str:
        result = await self.collection.replace_one(query, doc, upsert=True)
        if result.upserted_id:
            return str(result.upserted_id)
        existing = await self.collection.find_one(query)
        return str(existing["_id"]) if existing else ""
