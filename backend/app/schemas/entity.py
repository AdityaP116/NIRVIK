"""
NIRVIK Backend — Entity Schemas
"""
from __future__ import annotations

from datetime import datetime
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field

from app.models.entity import EntityType


class EntityResponse(BaseModel):
    id: str
    entity_type: EntityType
    name: str
    normalized_name: str
    attributes: Dict[str, Any]
    confidence: float
    source_count: int
    linked_cases: List[str]
    created_at: datetime
    updated_at: datetime


class EntitySummaryResponse(BaseModel):
    id: str
    entity_type: EntityType
    name: str
    confidence: float
    linked_cases: List[str]


class CreateEntityRequest(BaseModel):
    entity_type: EntityType
    name: str = Field(..., min_length=1, max_length=200)
    attributes: Dict[str, Any] = Field(default_factory=dict)
    confidence: float = Field(default=1.0, ge=0.0, le=1.0)
    case_id: Optional[str] = None


class EntityResolutionResult(BaseModel):
    status: str  # MATCH, LIKELY_MATCH, REVIEW_REQUIRED, NO_MATCH
    confidence: float
    signals: Dict[str, float]
    explanation: str
    matched_entity_id: Optional[str] = None
