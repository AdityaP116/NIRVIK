"""
NIRVIK Backend — Entities API Router
"""
from __future__ import annotations

from typing import Annotated, Optional

from fastapi import APIRouter, Depends, Query, status

from app.core.dependencies import PaginationParams, get_current_user
from app.core.exceptions import NotFoundError
from app.core.security import TokenPayload
from app.repositories.entity_repository import EntityRepository
from app.schemas.entity import CreateEntityRequest, EntityResponse
from app.services.entity_resolution_service import EntityResolutionService

router = APIRouter(prefix="/entities", tags=["Entity Intelligence"])
entity_repo = EntityRepository()
resolution_service = EntityResolutionService()


@router.get("", response_model=list[EntityResponse])
async def list_entities(
    entity_type: Optional[str] = Query(None),
    case_id: Optional[str] = Query(None),
    pagination: PaginationParams = Depends(),
    user: TokenPayload = Depends(get_current_user),
):
    if case_id:
        docs = await entity_repo.find_by_case(case_id, skip=pagination.skip, limit=pagination.limit)
    elif entity_type:
        docs = await entity_repo.find_by_type(entity_type, skip=pagination.skip, limit=pagination.limit)
    else:
        docs = await entity_repo.find_many({}, skip=pagination.skip, limit=pagination.limit)

    return [
        EntityResponse(
            id=str(d["_id"]),
            entity_type=d["entity_type"],
            name=d["name"],
            normalized_name=d["normalized_name"],
            attributes=d.get("attributes", {}),
            confidence=d.get("confidence", 1.0),
            source_count=d.get("source_count", 1),
            linked_cases=d.get("linked_cases", []),
            created_at=d["created_at"],
            updated_at=d["updated_at"],
        )
        for d in docs
    ]


@router.get("/{entity_id}", response_model=EntityResponse)
async def get_entity(
    entity_id: str,
    user: TokenPayload = Depends(get_current_user),
):
    doc = await entity_repo.find_by_id(entity_id)
    if not doc:
        raise NotFoundError("Entity", entity_id)
    return EntityResponse(
        id=str(doc["_id"]),
        entity_type=doc["entity_type"],
        name=doc["name"],
        normalized_name=doc["normalized_name"],
        attributes=doc.get("attributes", {}),
        confidence=doc.get("confidence", 1.0),
        source_count=doc.get("source_count", 1),
        linked_cases=doc.get("linked_cases", []),
        created_at=doc["created_at"],
        updated_at=doc["updated_at"],
    )


@router.post("/{entity_id}/resolve")
async def resolve_entity(
    entity_id: str,
    user: TokenPayload = Depends(get_current_user),
):
    doc = await entity_repo.find_by_id(entity_id)
    if not doc:
        raise NotFoundError("Entity", entity_id)
    return await resolution_service.resolve_candidate(doc)
