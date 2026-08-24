"""
NIRVIK Backend — Search Service
"""
from __future__ import annotations

from typing import Dict, List

from app.repositories.case_repository import CaseRepository
from app.repositories.entity_repository import DocumentRepository, EntityRepository
from app.schemas.finding import SearchResponse, SearchResultItem


class SearchService:
    def __init__(self) -> None:
        self._entity_repo = EntityRepository()
        self._case_repo = CaseRepository()
        self._doc_repo = DocumentRepository()

    async def search(self, query: str, limit: int = 20) -> SearchResponse:
        if not query or len(query.strip()) < 2:
            return SearchResponse(query=query, total=0, results={})

        q = query.strip()
        results: Dict[str, List[SearchResultItem]] = {
            "PERSON": [], "PHONE": [], "VEHICLE": [], "LOCATION": [],
            "ORGANIZATION": [], "BANK_ACCOUNT": [], "CASE": [], "DOCUMENT": [],
        }
        total = 0

        # Search Entities
        entities = await self._entity_repo.find_by_normalized_name(q)
        if not entities:
            entities = await self._entity_repo.find_many(
                {"name": {"$regex": q, "$options": "i"}}, limit=limit
            )

        for e in entities:
            etype = e.get("entity_type", "PERSON")
            item = SearchResultItem(
                id=str(e["_id"]),
                category=etype,
                name=e.get("name", "Unknown"),
                description=f"Confidence: {e.get('confidence', 1.0)} | Sources: {e.get('source_count', 1)}",
                confidence=e.get("confidence", 1.0),
            )
            if etype in results:
                results[etype].append(item)
                total += 1

        # Search Cases
        cases = await self._case_repo.find_many(
            {"$or": [
                {"case_number": {"$regex": q, "$options": "i"}},
                {"title": {"$regex": q, "$options": "i"}},
            ]},
            limit=limit,
        )
        for c in cases:
            results["CASE"].append(
                SearchResultItem(
                    id=str(c["_id"]),
                    category="CASE",
                    name=f"{c['case_number']}: {c['title']}",
                    description=c.get("description", "")[:100],
                )
            )
            total += 1

        return SearchResponse(query=query, total=total, results=results)
