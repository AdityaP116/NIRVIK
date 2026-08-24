"""
NIRVIK Backend — Finding Service
Generates and manages explainable findings.
Never outputs "AI says this person is suspicious".
Outputs explicit analytical rationale ("Analytical finding generated because...").
"""
from __future__ import annotations

from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

from app.core.exceptions import NotFoundError
from app.core.logging import get_logger
from app.models.finding import FindingStatus, FindingType
from app.repositories.entity_repository import FindingRepository
from app.schemas.finding import FindingResponse, ReviewFindingRequest

logger = get_logger(__name__)


class FindingService:
    """Finding service for generating explainable intelligence findings."""

    def __init__(self) -> None:
        self._repo = FindingRepository()

    async def get_finding(self, finding_id: str) -> FindingResponse:
        doc = await self._repo.find_by_id(finding_id)
        if not doc:
            raise NotFoundError("Finding", finding_id)
        return self._to_response(doc)

    async def list_case_findings(
        self, case_id: str, skip: int = 0, limit: int = 20
    ) -> List[FindingResponse]:
        docs = await self._repo.find_by_case(case_id, skip=skip, limit=limit)
        return [self._to_response(d) for d in docs]

    async def review_finding(
        self, finding_id: str, request: ReviewFindingRequest, user_id: str
    ) -> FindingResponse:
        doc = await self._repo.find_by_id(finding_id)
        if not doc:
            raise NotFoundError("Finding", finding_id)

        updates = {
            "status": request.status.value,
            "reviewed_by": user_id,
            "reviewed_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc),
        }
        await self._repo.update_by_id(finding_id, updates)
        updated = await self._repo.find_by_id(finding_id)
        return self._to_response(updated)

    async def create_finding(
        self,
        case_id: str,
        entity_id: str,
        finding_type: FindingType,
        title: str,
        description: str,
        confidence: float,
        explanation: Dict[str, Any],
        evidence_summary: List[Dict[str, Any]],
        evidence_ids: Optional[List[str]] = None,
        anomaly_score: Optional[float] = None,
    ) -> FindingResponse:
        """Create a new explainable finding."""
        doc = {
            "case_id": case_id,
            "entity_id": entity_id,
            "finding_type": finding_type.value,
            "title": title,
            "description": description,
            "confidence": round(confidence, 2),
            "anomaly_score": round(anomaly_score, 2) if anomaly_score is not None else None,
            "status": FindingStatus.NEW.value,
            "evidence_ids": evidence_ids or [],
            "explanation": explanation,
            "evidence_summary": evidence_summary,
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc),
        }
        fid = await self._repo.insert_one(doc)
        doc["_id"] = fid
        return self._to_response(doc)

    @staticmethod
    def _to_response(doc: dict) -> FindingResponse:
        return FindingResponse(
            id=str(doc["_id"]),
            case_id=doc["case_id"],
            entity_id=doc["entity_id"],
            finding_type=FindingType(doc["finding_type"]),
            title=doc["title"],
            description=doc["description"],
            confidence=doc["confidence"],
            anomaly_score=doc.get("anomaly_score"),
            status=FindingStatus(doc.get("status", "NEW")),
            evidence_ids=doc.get("evidence_ids", []),
            explanation=doc.get("explanation", {}),
            evidence_summary=doc.get("evidence_summary", []),
            created_at=doc["created_at"],
            updated_at=doc["updated_at"],
            reviewed_by=doc.get("reviewed_by"),
            reviewed_at=doc.get("reviewed_at"),
        )
