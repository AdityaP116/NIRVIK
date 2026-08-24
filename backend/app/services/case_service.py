"""
NIRVIK Backend — Case Service
"""
from __future__ import annotations

from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

from app.core.exceptions import ConflictError, NotFoundError
from app.core.logging import get_logger
from app.models.case import CaseStatus
from app.repositories.case_repository import CaseRepository
from app.repositories.entity_repository import EntityRepository
from app.schemas.case import (
    CaseResponse, CaseSummaryResponse, CreateCaseRequest, UpdateCaseRequest,
)

logger = get_logger(__name__)


class CaseService:
    def __init__(self) -> None:
        self._repo = CaseRepository()
        self._entity_repo = EntityRepository()

    async def create_case(self, request: CreateCaseRequest, created_by: str) -> CaseResponse:
        existing = await self._repo.find_by_case_number(request.case_number)
        if existing:
            raise ConflictError(f"Case number {request.case_number} already exists")

        doc = {
            "case_number": request.case_number,
            "title": request.title,
            "description": request.description,
            "jurisdiction": request.jurisdiction,
            "status": request.priority.value if hasattr(request, 'priority') else "MEDIUM",
            "priority": request.priority.value,
            "status": "DRAFT",
            "assigned_to": request.assigned_to,
            "entity_ids": [],
            "created_by": created_by,
            "tags": request.tags,
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc),
        }
        case_id = await self._repo.insert_one(doc)
        doc["_id"] = case_id
        logger.info("case_created", case_id=case_id, case_number=request.case_number)
        return self._to_response(doc)

    async def get_case(self, case_id: str) -> CaseResponse:
        case = await self._repo.find_by_id(case_id)
        if not case:
            # Try by case_number
            case = await self._repo.find_by_case_number(case_id)
        if not case:
            raise NotFoundError("Case", case_id)
        return self._to_response(case)

    async def list_cases(
        self,
        status: Optional[str] = None,
        priority: Optional[str] = None,
        assigned_to: Optional[str] = None,
        skip: int = 0,
        limit: int = 20,
    ) -> tuple[List[CaseSummaryResponse], int]:
        filters: Dict[str, Any] = {}
        if status:
            filters["status"] = status
        if priority:
            filters["priority"] = priority
        if assigned_to:
            filters["assigned_to"] = assigned_to

        cases = await self._repo.list_cases(filters, skip=skip, limit=limit)
        total = await self._repo.count(filters)
        return [self._to_summary(c) for c in cases], total

    async def update_case(self, case_id: str, request: UpdateCaseRequest) -> CaseResponse:
        case = await self._repo.find_by_id(case_id)
        if not case:
            raise NotFoundError("Case", case_id)

        updates: Dict[str, Any] = {"updated_at": datetime.now(timezone.utc)}
        if request.title is not None:
            updates["title"] = request.title
        if request.description is not None:
            updates["description"] = request.description
        if request.status is not None:
            updates["status"] = request.status.value
            if request.status == CaseStatus.CLOSED:
                updates["closed_at"] = datetime.now(timezone.utc)
        if request.priority is not None:
            updates["priority"] = request.priority.value
        if request.assigned_to is not None:
            updates["assigned_to"] = request.assigned_to
        if request.tags is not None:
            updates["tags"] = request.tags

        await self._repo.update_by_id(case_id, updates)
        updated = await self._repo.find_by_id(case_id)
        return self._to_response(updated)

    async def get_case_entities(
        self, case_id: str, skip: int = 0, limit: int = 50
    ) -> List[Dict[str, Any]]:
        case = await self._repo.find_by_id(case_id)
        if not case:
            raise NotFoundError("Case", case_id)
        return await self._entity_repo.find_by_case(case_id, skip=skip, limit=limit)

    @staticmethod
    def _to_response(case: dict) -> CaseResponse:
        return CaseResponse(
            id=str(case["_id"]),
            case_number=case["case_number"],
            title=case["title"],
            description=case["description"],
            jurisdiction=case["jurisdiction"],
            status=CaseStatus(case.get("status", "DRAFT")),
            priority=case.get("priority", "MEDIUM"),
            assigned_to=case.get("assigned_to"),
            entity_ids=case.get("entity_ids", []),
            created_by=case["created_by"],
            created_at=case["created_at"],
            updated_at=case["updated_at"],
            closed_at=case.get("closed_at"),
            tags=case.get("tags", []),
        )

    @staticmethod
    def _to_summary(case: dict) -> CaseSummaryResponse:
        return CaseSummaryResponse(
            id=str(case["_id"]),
            case_number=case["case_number"],
            title=case["title"],
            status=CaseStatus(case.get("status", "DRAFT")),
            priority=case.get("priority", "MEDIUM"),
            assigned_to=case.get("assigned_to"),
            entity_count=len(case.get("entity_ids", [])),
            created_at=case["created_at"],
            updated_at=case["updated_at"],
        )
