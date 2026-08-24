"""
NIRVIK Backend — Timeline Service
"""
from __future__ import annotations

from datetime import datetime, timezone
from typing import List, Optional

from app.repositories.entity_repository import DocumentRepository, FindingRepository
from app.schemas.finding import TimelineEvent, TimelineResponse


class TimelineService:
    def __init__(self) -> None:
        self._doc_repo = DocumentRepository()
        self._finding_repo = FindingRepository()

    async def get_case_timeline(
        self, case_id: str, date_from: Optional[str] = None, date_to: Optional[str] = None
    ) -> TimelineResponse:
        findings = await self._finding_repo.find_by_case(case_id, limit=50)
        docs = await self._doc_repo.find_by_case(case_id, limit=50)

        events: List[TimelineEvent] = []

        for f in findings:
            events.append(
                TimelineEvent(
                    id=str(f["_id"]),
                    event_type=f.get("finding_type", "FINDING"),
                    timestamp=f.get("created_at", datetime.now(timezone.utc)),
                    title=f.get("title", "Analytical Finding"),
                    description=f.get("description", ""),
                    entity_id=f.get("entity_id"),
                    case_id=case_id,
                    confidence=f.get("confidence"),
                )
            )

        for d in docs:
            events.append(
                TimelineEvent(
                    id=str(d["_id"]),
                    event_type=f"DOCUMENT_{d.get('document_type', 'INGESTED')}",
                    timestamp=d.get("created_at", datetime.now(timezone.utc)),
                    title=d.get("title", "Document Ingested"),
                    description=f"Type: {d.get('document_type')}",
                    case_id=case_id,
                )
            )

        events.sort(key=lambda x: x.timestamp, reverse=True)
        return TimelineResponse(
            events=events,
            total=len(events),
            date_from=date_from,
            date_to=date_to,
        )
