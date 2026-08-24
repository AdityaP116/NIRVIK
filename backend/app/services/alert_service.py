"""
NIRVIK Backend — Alert Service
Generates and manages priority intelligence alerts.
"""
from __future__ import annotations

from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

from app.core.exceptions import NotFoundError
from app.core.logging import get_logger
from app.models.finding import AlertPriority, AlertStatus, AlertType
from app.repositories.entity_repository import AlertRepository
from app.schemas.finding import AlertResponse, UpdateAlertRequest

logger = get_logger(__name__)


class AlertService:
    """Alert management service."""

    def __init__(self) -> None:
        self._repo = AlertRepository()

    async def get_alert(self, alert_id: str) -> AlertResponse:
        doc = await self._repo.find_by_id(alert_id)
        if not doc:
            raise NotFoundError("Alert", alert_id)
        return self._to_response(doc)

    async def list_alerts(
        self, case_id: Optional[str] = None, priority: Optional[str] = None, skip: int = 0, limit: int = 20
    ) -> List[AlertResponse]:
        query: Dict[str, Any] = {}
        if case_id:
            query["case_id"] = case_id
        if priority:
            query["priority"] = priority

        docs = await self._repo.find_many(query, skip=skip, limit=limit)
        return [self._to_response(d) for d in docs]

    async def update_alert(
        self, alert_id: str, request: UpdateAlertRequest, user_id: str
    ) -> AlertResponse:
        doc = await self._repo.find_by_id(alert_id)
        if not doc:
            raise NotFoundError("Alert", alert_id)

        updates = {
            "status": request.status.value,
            "acknowledged_by": user_id if request.status == AlertStatus.ACKNOWLEDGED else doc.get("acknowledged_by"),
            "updated_at": datetime.now(timezone.utc),
        }
        await self._repo.update_by_id(alert_id, updates)
        updated = await self._repo.find_by_id(alert_id)
        return self._to_response(updated)

    async def create_alert(
        self,
        case_id: str,
        alert_type: AlertType,
        title: str,
        description: str,
        priority: AlertPriority = AlertPriority.MEDIUM,
        entity_id: Optional[str] = None,
        finding_id: Optional[str] = None,
    ) -> AlertResponse:
        doc = {
            "case_id": case_id,
            "entity_id": entity_id,
            "finding_id": finding_id,
            "alert_type": alert_type.value,
            "priority": priority.value,
            "title": title,
            "description": description,
            "status": AlertStatus.NEW.value,
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc),
        }
        aid = await self._repo.insert_one(doc)
        doc["_id"] = aid
        return self._to_response(doc)

    @staticmethod
    def _to_response(doc: dict) -> AlertResponse:
        return AlertResponse(
            id=str(doc["_id"]),
            case_id=doc["case_id"],
            entity_id=doc.get("entity_id"),
            finding_id=doc.get("finding_id"),
            alert_type=AlertType(doc["alert_type"]),
            priority=AlertPriority(doc.get("priority", "MEDIUM")),
            title=doc["title"],
            description=doc["description"],
            status=AlertStatus(doc.get("status", "NEW")),
            created_at=doc["created_at"],
            updated_at=doc["updated_at"],
            acknowledged_by=doc.get("acknowledged_by"),
        )
