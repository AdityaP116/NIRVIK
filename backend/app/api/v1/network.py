"""
NIRVIK Backend — Network & Graph API Router (Cytoscape & Leaflet compatible)
"""
from __future__ import annotations

from typing import Optional

from fastapi import APIRouter, Depends, Query

from app.core.dependencies import get_current_user
from app.core.security import TokenPayload
from app.schemas.network import (
    LocationsResponse, NetworkAnalyticsResponse, NetworkResponse, ShortestPathResponse,
)
from app.services.graph_analytics_service import GraphAnalyticsService
from app.services.graph_service import (
    get_case_locations, get_case_network, get_shortest_path,
)

router = APIRouter(prefix="/network", tags=["Graph & Network Intelligence"])
analytics_service = GraphAnalyticsService()


@router.get("/{case_id}", response_model=NetworkResponse)
async def get_network(
    case_id: str,
    depth: int = Query(default=2, ge=1, le=5),
    max_nodes: int = Query(default=100, ge=10, le=200),
    entity_type: Optional[str] = Query(None),
    relationship_type: Optional[str] = Query(None),
    min_confidence: float = Query(default=0.0, ge=0.0, le=1.0),
    user: TokenPayload = Depends(get_current_user),
):
    return await get_case_network(
        case_id=case_id,
        depth=depth,
        max_nodes=max_nodes,
        entity_type=entity_type,
        relationship_type=relationship_type,
        min_confidence=min_confidence,
    )


@router.get("/{case_id}/analytics", response_model=NetworkAnalyticsResponse)
async def get_network_analytics(
    case_id: str,
    user: TokenPayload = Depends(get_current_user),
):
    return await analytics_service.analyze_case_network(case_id)


@router.get("/path/shortest", response_model=ShortestPathResponse)
async def shortest_path(
    source: str = Query(...),
    target: str = Query(...),
    max_depth: int = Query(default=5, ge=1, le=5),
    user: TokenPayload = Depends(get_current_user),
):
    return await get_shortest_path(source_id=source, target_id=target, max_depth=max_depth)


@router.get("/{case_id}/locations", response_model=LocationsResponse)
async def get_locations(
    case_id: str,
    user: TokenPayload = Depends(get_current_user),
):
    return await get_case_locations(case_id)
