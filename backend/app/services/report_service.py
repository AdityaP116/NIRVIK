"""
NIRVIK Backend — Report Service
"""
from __future__ import annotations

from datetime import datetime, timezone

from app.core.exceptions import NotFoundError
from app.repositories.case_repository import CaseRepository
from app.repositories.entity_repository import (
    AlertRepository, EntityRepository, EvidenceRepository, FindingRepository,
)
from app.schemas.finding import GenerateReportRequest, ReportResponse


class ReportService:
    def __init__(self) -> None:
        self._case_repo = CaseRepository()
        self._entity_repo = EntityRepository()
        self._finding_repo = FindingRepository()
        self._alert_repo = AlertRepository()
        self._evidence_repo = EvidenceRepository()

    async def generate_report(
        self, request: GenerateReportRequest, generated_by: str
    ) -> ReportResponse:
        case = await self._case_repo.find_by_id(request.case_id)
        if not case:
            case = await self._case_repo.find_by_case_number(request.case_id)
        if not case:
            raise NotFoundError("Case", request.case_id)

        case_id = str(case["_id"])
        entities = await self._entity_repo.find_by_case(case_id, limit=20)
        findings = await self._finding_repo.find_by_case(case_id, limit=20)
        alerts = await self._alert_repo.find_by_case(case_id, limit=20)
        evidence = await self._evidence_repo.find_by_case(case_id, limit=20)

        summary = (
            f"NIRVIK Decision Support Report for Case {case['case_number']} ({case['title']}). "
            f"Status: {case['status']}, Jurisdiction: {case['jurisdiction']}. "
            f"Contains {len(entities)} linked entities, {len(findings)} analytical findings, "
            f"and {len(evidence)} verified evidence artifacts."
        )

        return ReportResponse(
            id=f"REP-{case['case_number']}",
            case_id=case_id,
            case_number=case["case_number"],
            title=f"Investigation Report: {case['title']}",
            generated_at=datetime.now(timezone.utc),
            generated_by=generated_by,
            summary=summary,
            entities=[{"id": str(e["_id"]), "name": e.get("name"), "type": e.get("entity_type")} for e in entities],
            timeline_summary={"total_events": len(findings) + len(evidence)},
            findings=[{"title": f.get("title"), "type": f.get("finding_type"), "confidence": f.get("confidence")} for f in findings],
            alerts=[{"title": a.get("title"), "priority": a.get("priority")} for a in alerts],
            evidence_references=[{"filename": ev.get("filename"), "sha256": ev.get("sha256")} for ev in evidence],
            integrity_note="All findings in this report represent decision-support signals. Final legal determination requires human investigator review.",
        )
