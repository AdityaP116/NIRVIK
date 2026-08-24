"""
NIRVIK Backend — Network / Graph Schemas (Cytoscape-compatible)
"""
from __future__ import annotations

from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field


# ── Cytoscape-compatible response ──────────────────────────────────────────────

class CytoscapeNodeData(BaseModel):
    id: str
    label: str
    type: str
    importance: Optional[float] = None
    confidence: Optional[float] = None
    community: Optional[int] = None
    centrality: Optional[float] = None
    attributes: Dict[str, Any] = Field(default_factory=dict)


class CytoscapeNode(BaseModel):
    data: CytoscapeNodeData


class CytoscapeEdgeData(BaseModel):
    id: str
    source: str
    target: str
    type: str
    confidence: float
    status: str
    weight: float = 1.0
    first_seen: Optional[str] = None
    last_seen: Optional[str] = None
    evidence_ids: List[str] = Field(default_factory=list)


class CytoscapeEdge(BaseModel):
    data: CytoscapeEdgeData


class NetworkMetadata(BaseModel):
    node_count: int
    edge_count: int
    case_id: str
    depth: int = 2
    network_density: Optional[float] = None


class NetworkResponse(BaseModel):
    """Cytoscape.js-compatible graph response."""
    nodes: List[CytoscapeNode]
    edges: List[CytoscapeEdge]
    metadata: NetworkMetadata


# ── Analytics ─────────────────────────────────────────────────────────────────

class CentralEntity(BaseModel):
    entity_id: str
    entity_name: str
    entity_type: str
    degree_centrality: float
    betweenness_centrality: float
    pagerank: float
    community_id: Optional[int] = None


class Community(BaseModel):
    community_id: int
    member_count: int
    member_ids: List[str]
    central_entity_id: Optional[str] = None


class NetworkAnalyticsResponse(BaseModel):
    case_id: str
    node_count: int
    edge_count: int
    network_density: float
    central_entities: List[CentralEntity]
    communities: List[Community]
    bridge_entities: List[str]
    analytics_method: str  # "GDS" or "NetworkX"


# ── Shortest Path ─────────────────────────────────────────────────────────────

class PathNode(BaseModel):
    id: str
    label: str
    type: str


class PathEdge(BaseModel):
    source: str
    target: str
    type: str
    confidence: float


class ShortestPathResponse(BaseModel):
    source: str
    target: str
    path_length: int
    nodes: List[PathNode]
    edges: List[PathEdge]
    explanation: str


# ── Location (Leaflet-compatible) ─────────────────────────────────────────────

class LocationPoint(BaseModel):
    id: str
    label: str
    latitude: float
    longitude: float
    event_count: int
    confidence: float
    entity_id: Optional[str] = None
    location_type: Optional[str] = None


class LocationsResponse(BaseModel):
    case_id: str
    locations: List[LocationPoint]
