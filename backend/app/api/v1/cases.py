"""
NIRVIK Backend — Cases API Router
"""
from __future__ import annotations

from typing import Annotated, Optional

from fastapi import APIRouter, Depends, Query, status

from app.core.dependencies import PaginationParams, get_current_user
from app.core.security import TokenPayload
from app.schemas.case import (
    CaseResponse, CaseSummaryResponse, CreateCaseRequest, UpdateCaseRequest,
)
from app.schemas.common import PaginatedResponse
from app.services.case_service import CaseService

router = APIRouter(prefix="/cases", tags=["Case Management"])
case_service = CaseService()


@router.get("", response_model=PaginatedResponse[CaseSummaryResponse])
async def list_cases(
    status: Optional[str] = Query(None),
    priority: Optional[str] = Query(None),
    assigned_to: Optional[str] = Query(None),
    pagination: PaginationParams = Depends(),
    user: TokenPayload = Depends(get_current_user),
):
    items, total = await case_service.list_cases(
        status=status,
        priority=priority,
        assigned_to=assigned_to,
        skip=pagination.skip,
        limit=pagination.limit,
    )
    return PaginatedResponse.build(items, total, pagination.page, pagination.page_size)


@router.post("", response_model=CaseResponse, status_code=status.HTTP_201_CREATED)
async def create_case(
    request: CreateCaseRequest,
    user: TokenPayload = Depends(get_current_user),
):
    return await case_service.create_case(request, created_by=user.sub)


@router.get("/{case_id}", response_model=CaseResponse)
async def get_case(
    case_id: str,
    user: TokenPayload = Depends(get_current_user),
):
    return await case_service.get_case(case_id)


@router.patch("/{case_id}", response_model=CaseResponse)
async def update_case(
    case_id: str,
    request: UpdateCaseRequest,
    user: TokenPayload = Depends(get_current_user),
):
    return await case_service.update_case(case_id, request)


@router.get("/{case_id}/entities")
async def get_case_entities(
    case_id: str,
    pagination: PaginationParams = Depends(),
    user: TokenPayload = Depends(get_current_user),
):
    return await case_service.get_case_entities(case_id, skip=pagination.skip, limit=pagination.limit)
