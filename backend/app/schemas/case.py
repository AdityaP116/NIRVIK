"""
NIRVIK Backend — Case Schemas
"""
from __future__ import annotations

from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field

from app.models.case import CasePriority, CaseStatus


class CreateCaseRequest(BaseModel):
    case_number: str = Field(..., min_length=3, max_length=50)
    title: str = Field(..., min_length=3, max_length=200)
    description: str = Field(..., min_length=10)
    jurisdiction: str = Field(..., min_length=2, max_length=100)
    priority: CasePriority = CasePriority.MEDIUM
    assigned_to: Optional[str] = None
    tags: List[str] = Field(default_factory=list)


class UpdateCaseRequest(BaseModel):
    title: Optional[str] = Field(default=None, min_length=3, max_length=200)
    description: Optional[str] = None
    status: Optional[CaseStatus] = None
    priority: Optional[CasePriority] = None
    assigned_to: Optional[str] = None
    tags: Optional[List[str]] = None


class CaseResponse(BaseModel):
    id: str
    case_number: str
    title: str
    description: str
    jurisdiction: str
    status: CaseStatus
    priority: CasePriority
    assigned_to: Optional[str] = None
    entity_ids: List[str]
    created_by: str
    created_at: datetime
    updated_at: datetime
    closed_at: Optional[datetime] = None
    tags: List[str]


class CaseSummaryResponse(BaseModel):
    """Lightweight case listing."""
    id: str
    case_number: str
    title: str
    status: CaseStatus
    priority: CasePriority
    assigned_to: Optional[str] = None
    entity_count: int = 0
    created_at: datetime
    updated_at: datetime
