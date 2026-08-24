"""
NIRVIK Backend — Search, Findings, Alerts, Evidence, Timeline, Reports, Assistant, Health, Dashboard, Audit API Routers
"""
from __future__ import annotations

from typing import Annotated, Optional

from fastapi import APIRouter, Depends, File, Form, Query, UploadFile, status

from app.core.dependencies import PaginationParams, get_current_user
from app.core.security import TokenPayload
from app.db.mongodb import ping_mongodb
from app.db.neo4j import ping_neo4j
from app.db.redis import ping_redis
from app.integrations.fabric.client import get_fabric_client
from app.integrations.storage.minio_storage import get_storage
from app.schemas.finding import (
    AlertResponse, AssistantQueryRequest, AssistantQueryResponse,
    DashboardResponse, EvidenceResponse, EvidenceVerifyResponse,
    FindingResponse, GenerateReportRequest, ReportResponse,
    ReviewFindingRequest, TimelineResponse, UpdateAlertRequest,
)
from app.services.alert_service import AlertService
from app.services.assistant_service import AssistantService
from app.services.audit_service import AuditService
from app.services.dashboard_service import DashboardService
from app.services.evidence_service import EvidenceService
from app.services.finding_service import FindingService
from app.services.report_service import ReportService
from app.services.search_service import SearchService
from app.services.timeline_service import TimelineService

# ── Health Router ─────────────────────────────────────────────────────────────
health_router = APIRouter(tags=["Health Check"])


@health_router.get("/health")
async def health():
    return {"status": "ok", "service": "NIRVIK Backend"}


@health_router.get("/health/live")
async def liveness():
    return {"status": "alive"}


@health_router.get("/health/ready")
async def readiness():
    mongo_ok = await ping_mongodb()
    neo4j_ok = await ping_neo4j()
    redis_ok = await ping_redis()
    storage_ok = await get_storage().ping()
    fabric_status = await get_fabric_client().ping()

    ready = mongo_ok and redis_ok
    return {
        "status": "ready" if ready else "degraded",
        "components": {
            "mongodb": "CONNECTED" if mongo_ok else "DISCONNECTED",
            "neo4j": "CONNECTED" if neo4j_ok else "DISCONNECTED",
            "redis": "CONNECTED" if redis_ok else "DISCONNECTED",
            "minio_storage": "CONNECTED" if storage_ok else "DISCONNECTED",
            "fabric_adapter": fabric_status,
        },
    }


# ── Search Router ─────────────────────────────────────────────────────────────
search_router = APIRouter(prefix="/search", tags=["Global Search"])
search_service = SearchService()


@search_router.get("")
async def global_search(
    q: str = Query(..., min_length=2),
    limit: int = Query(default=20, ge=1, le=100),
    user: TokenPayload = Depends(get_current_user),
):
    return await search_service.search(q, limit=limit)


# ── Findings Router ────────────────────────────────────────────────────────────
findings_router = APIRouter(prefix="/findings", tags=["Explainable Findings"])
finding_service = FindingService()


@findings_router.get("/{finding_id}", response_model=FindingResponse)
async def get_finding(
    finding_id: str,
    user: TokenPayload = Depends(get_current_user),
):
    return await finding_service.get_finding(finding_id)


@findings_router.patch("/{finding_id}", response_model=FindingResponse)
async def review_finding(
    finding_id: str,
    request: ReviewFindingRequest,
    user: TokenPayload = Depends(get_current_user),
):
    return await finding_service.review_finding(finding_id, request, user_id=user.sub)


# ── Alerts Router ─────────────────────────────────────────────────────────────
alerts_router = APIRouter(prefix="/alerts", tags=["Intelligence Alerts"])
alert_service = AlertService()


@alerts_router.get("", response_model=list[AlertResponse])
async def list_alerts(
    case_id: Optional[str] = Query(None),
    priority: Optional[str] = Query(None),
    pagination: PaginationParams = Depends(),
    user: TokenPayload = Depends(get_current_user),
):
    return await alert_service.list_alerts(case_id, priority, skip=pagination.skip, limit=pagination.limit)


@alerts_router.patch("/{alert_id}", response_model=AlertResponse)
async def update_alert(
    alert_id: str,
    request: UpdateAlertRequest,
    user: TokenPayload = Depends(get_current_user),
):
    return await alert_service.update_alert(alert_id, request, user_id=user.sub)


# ── Evidence Router ────────────────────────────────────────────────────────────
evidence_router = APIRouter(prefix="/evidence", tags=["Evidence Storage & Integrity"])
evidence_service = EvidenceService()


@evidence_router.post("", response_model=EvidenceResponse, status_code=status.HTTP_201_CREATED)
async def upload_evidence(
    case_id: str = Form(...),
    file: UploadFile = File(...),
    user: TokenPayload = Depends(get_current_user),
):
    content = await file.read()
    return await evidence_service.upload_evidence(
        case_id=case_id,
        filename=file.filename or "evidence.bin",
        file_bytes=content,
        content_type=file.content_type or "application/octet-stream",
        uploaded_by=user.sub,
    )


@evidence_router.get("/{evidence_id}/verify", response_model=EvidenceVerifyResponse)
async def verify_evidence(
    evidence_id: str,
    user: TokenPayload = Depends(get_current_user),
):
    return await evidence_service.verify_evidence_integrity(evidence_id)


# ── Timeline Router ───────────────────────────────────────────────────────────
timeline_router = APIRouter(prefix="/timeline", tags=["Investigation Timeline"])
timeline_service = TimelineService()


@timeline_router.get("/{case_id}", response_model=TimelineResponse)
async def get_timeline(
    case_id: str,
    date_from: Optional[str] = Query(None),
    date_to: Optional[str] = Query(None),
    user: TokenPayload = Depends(get_current_user),
):
    return await timeline_service.get_case_timeline(case_id, date_from, date_to)


# ── Reports Router ────────────────────────────────────────────────────────────
reports_router = APIRouter(prefix="/reports", tags=["Report Generation"])
report_service = ReportService()


@reports_router.post("", response_model=ReportResponse, status_code=status.HTTP_201_CREATED)
async def generate_report(
    request: GenerateReportRequest,
    user: TokenPayload = Depends(get_current_user),
):
    return await report_service.generate_report(request, generated_by=user.sub)


# ── Assistant Router ──────────────────────────────────────────────────────────
assistant_router = APIRouter(prefix="/assistant", tags=["Read-Only AI Assistant"])
assistant_service = AssistantService()


@assistant_router.post("/query", response_model=AssistantQueryResponse)
async def query_assistant(
    request: AssistantQueryRequest,
    user: TokenPayload = Depends(get_current_user),
):
    return await assistant_service.process_query(request)


# ── Dashboard Router ──────────────────────────────────────────────────────────
dashboard_router = APIRouter(prefix="/dashboard", tags=["Dashboard"])
dashboard_service = DashboardService()


@dashboard_router.get("", response_model=DashboardResponse)
async def get_dashboard(
    user: TokenPayload = Depends(get_current_user),
):
    return await dashboard_service.get_dashboard_data()


# ── Audit Router ──────────────────────────────────────────────────────────────
audit_router = APIRouter(prefix="/audit", tags=["Audit Log"])
audit_service = AuditService()


@audit_router.get("")
async def list_audit_logs(
    pagination: PaginationParams = Depends(),
    user: TokenPayload = Depends(get_current_user),
):
    return await audit_service.list_audit_logs(user_id=user.sub, skip=pagination.skip, limit=pagination.limit)
