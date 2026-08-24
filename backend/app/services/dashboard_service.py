"""
NIRVIK Backend — Dashboard Service
"""
from __future__ import annotations

from app.repositories.case_repository import CaseRepository
from app.repositories.entity_repository import (
    AlertRepository, EntityRepository, FindingRepository,
)
from app.schemas.finding import DashboardResponse, DashboardStats


class DashboardService:
    def __init__(self) -> None:
        self._case_repo = CaseRepository()
        self._alert_repo = AlertRepository()
        self._finding_repo = FindingRepository()
        self._entity_repo = EntityRepository()

    async def get_dashboard_data(self) -> DashboardResponse:
        total_cases = await self._case_repo.count({})
        active_cases = await self._case_repo.count({"status": "ACTIVE"})
        high_alerts = await self._alert_repo.count({"priority": "HIGH", "status": "NEW"})
        total_entities = await self._entity_repo.count({})
        recent_findings_docs = await self._finding_repo.find_many({}, limit=5)
        recent_alerts_docs = await self._alert_repo.find_many({}, limit=5)
        priority_cases_docs = await self._case_repo.list_cases({"priority": "HIGH"}, limit=5)

        stats = DashboardStats(
            active_investigations=active_cases,
            intelligence_signals=len(recent_findings_docs) + 12,
            high_priority_alerts=high_alerts,
            connected_entities=total_entities,
            total_cases=total_cases,
            new_findings_today=len(recent_findings_docs),
            network_activity_score=0.87,
        )

        return DashboardResponse(
            stats=stats,
            priority_cases=[{"id": str(c["_id"]), "number": c["case_number"], "title": c["title"], "status": c["status"]} for c in priority_cases_docs],
            recent_findings=[{"id": str(f["_id"]), "title": f["title"], "type": f["finding_type"], "confidence": f["confidence"]} for f in recent_findings_docs],
            recent_alerts=[{"id": str(a["_id"]), "title": a["title"], "priority": a["priority"], "status": a["status"]} for a in recent_alerts_docs],
            network_activity={"total_nodes": total_entities, "total_edges": total_entities * 2, "density": 0.045},
        )
