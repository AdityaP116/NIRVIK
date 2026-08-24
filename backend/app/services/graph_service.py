"""
NIRVIK Backend — Graph Service (Neo4j)
Returns Cytoscape-compatible graph data.
All Cypher queries are PARAMETERIZED.
"""
from __future__ import annotations

import uuid
from typing import Any, Dict, List, Optional

from app.core.exceptions import NotFoundError
from app.core.logging import get_logger
from app.db.neo4j import run_query, run_write_query
from app.schemas.network import (
    CytoscapeEdge, CytoscapeEdgeData, CytoscapeNode, CytoscapeNodeData,
    LocationPoint, LocationsResponse, NetworkMetadata, NetworkResponse,
    PathEdge, PathNode, ShortestPathResponse,
)

logger = get_logger(__name__)

# Graph traversal hard limits
MAX_NODES = 200
MAX_DEPTH = 5


async def get_case_network(
    case_id: str,
    depth: int = 2,
    max_nodes: int = 100,
    entity_type: Optional[str] = None,
    relationship_type: Optional[str] = None,
    min_confidence: float = 0.0,
    date_from: Optional[str] = None,
    date_to: Optional[str] = None,
) -> NetworkResponse:
    """
    Return Cytoscape-compatible graph for a case.
    Depth is capped at MAX_DEPTH; max_nodes capped at MAX_NODES.
    """
    depth = min(depth, MAX_DEPTH)
    max_nodes = min(max_nodes, MAX_NODES)

    # Build entity type filter clause
    type_clause = ""
    if entity_type:
        type_clause = f" AND n.entity_type = $entity_type"

    rel_clause = ""
    if relationship_type:
        rel_clause = f"[r:{relationship_type}]"
    else:
        rel_clause = "[r]"

    cypher = f"""
    MATCH (c:Case {{case_id: $case_id}})
    CALL apoc.path.subgraphAll(c, {{
        maxLevel: $depth,
        limit: $max_nodes
    }})
    YIELD nodes, relationships
    RETURN nodes, relationships
    LIMIT $max_nodes
    """

    # Fallback without APOC (compatible with community edition)
    cypher_fallback = """
    MATCH (c:Case {case_id: $case_id})
    OPTIONAL MATCH path = (c)-[*1..2]-(n)
    WITH collect(DISTINCT c) + collect(DISTINCT n) AS all_nodes,
         collect(DISTINCT relationships(path)) AS all_rels_list
    UNWIND all_nodes AS node
    WITH collect(DISTINCT node) AS nodes_dedup, all_rels_list
    UNWIND all_rels_list AS rels_set
    UNWIND rels_set AS rel
    WITH nodes_dedup, collect(DISTINCT rel) AS rels
    RETURN nodes_dedup AS nodes, rels AS relationships
    """

    params: Dict[str, Any] = {
        "case_id": case_id,
        "depth": depth,
        "max_nodes": max_nodes,
        "min_confidence": min_confidence,
    }
    if entity_type:
        params["entity_type"] = entity_type

    try:
        records = await run_query(cypher, params)
    except Exception:
        records = await run_query(cypher_fallback, params)

    return _build_cytoscape_response(records, case_id, depth)


def _build_cytoscape_response(
    records: List[Dict[str, Any]], case_id: str, depth: int
) -> NetworkResponse:
    nodes: Dict[str, CytoscapeNode] = {}
    edges: Dict[str, CytoscapeEdge] = {}

    for record in records:
        # Process nodes
        for node in record.get("nodes", []) or []:
            if node is None:
                continue
            node_id = str(node.get("neo4j_id") or node.get("entity_id") or node.element_id)
            labels = list(node.labels) if hasattr(node, "labels") else []
            node_type = labels[0] if labels else "UNKNOWN"
            props = dict(node) if hasattr(node, "keys") else node

            if node_id not in nodes:
                nodes[node_id] = CytoscapeNode(
                    data=CytoscapeNodeData(
                        id=node_id,
                        label=props.get("name", props.get("label", node_id[:12])),
                        type=node_type.upper(),
                        importance=props.get("pagerank", props.get("importance", 0.5)),
                        confidence=props.get("confidence", 1.0),
                        attributes={
                            k: v for k, v in props.items()
                            if k not in {"name", "label", "confidence", "pagerank"}
                        },
                    )
                )

        # Process relationships
        for rel in record.get("relationships", []) or []:
            if rel is None:
                continue
            rel_props = dict(rel) if hasattr(rel, "keys") else rel
            rel_id = str(rel.element_id) if hasattr(rel, "element_id") else str(uuid.uuid4())
            start_id = str(rel.start_node.element_id) if hasattr(rel, "start_node") else ""
            end_id = str(rel.end_node.element_id) if hasattr(rel, "end_node") else ""
            rel_type = rel.type if hasattr(rel, "type") else rel_props.get("type", "CONNECTED_TO")

            if rel_id not in edges and start_id and end_id:
                edges[rel_id] = CytoscapeEdge(
                    data=CytoscapeEdgeData(
                        id=rel_id,
                        source=start_id,
                        target=end_id,
                        type=rel_type,
                        confidence=rel_props.get("confidence", 1.0),
                        status=rel_props.get("status", "CONFIRMED"),
                        weight=float(rel_props.get("weight", rel_props.get("source_count", 1))),
                        first_seen=str(rel_props.get("first_seen", "")),
                        last_seen=str(rel_props.get("last_seen", "")),
                        evidence_ids=rel_props.get("evidence_ids", []),
                    )
                )

    node_list = list(nodes.values())
    edge_list = list(edges.values())

    return NetworkResponse(
        nodes=node_list,
        edges=edge_list,
        metadata=NetworkMetadata(
            node_count=len(node_list),
            edge_count=len(edge_list),
            case_id=case_id,
            depth=depth,
        ),
    )


async def get_shortest_path(
    source_id: str,
    target_id: str,
    max_depth: int = 5,
) -> ShortestPathResponse:
    max_depth = min(max_depth, MAX_DEPTH)

    cypher = """
    MATCH (source {entity_id: $source_id}), (target {entity_id: $target_id})
    MATCH path = shortestPath((source)-[*1..$max_depth]-(target))
    RETURN path
    LIMIT 1
    """
    params = {"source_id": source_id, "target_id": target_id, "max_depth": max_depth}

    records = await run_query(cypher, params)
    if not records:
        raise NotFoundError("Path", f"{source_id} -> {target_id}")

    path = records[0].get("path")
    path_nodes: List[PathNode] = []
    path_edges: List[PathEdge] = []
    node_names: List[str] = []

    if path:
        for n in path.nodes:
            props = dict(n)
            labels = list(n.labels)
            node_type = labels[0] if labels else "UNKNOWN"
            name = props.get("name", props.get("label", str(n.element_id)[:8]))
            path_nodes.append(PathNode(id=str(n.element_id), label=name, type=node_type))
            node_names.append(f"{name} ({node_type})")

        for r in path.relationships:
            path_edges.append(PathEdge(
                source=str(r.start_node.element_id),
                target=str(r.end_node.element_id),
                type=r.type,
                confidence=dict(r).get("confidence", 1.0),
            ))

    explanation = (
        f"Shortest connection path ({len(path_nodes)} hops): "
        + " → ".join(node_names)
        + ". This path represents inferred relationships derived from "
        + "call records, financial transactions, and co-location data. "
        + "Human review is required to assess the significance of this connection."
    )

    return ShortestPathResponse(
        source=source_id,
        target=target_id,
        path_length=len(path_edges),
        nodes=path_nodes,
        edges=path_edges,
        explanation=explanation,
    )


async def get_case_locations(case_id: str) -> LocationsResponse:
    """Return location data for Leaflet map rendering."""
    cypher = """
    MATCH (c:Case {case_id: $case_id})-[]-(loc:Location)
    RETURN loc
    LIMIT 100
    """
    records = await run_query(cypher, {"case_id": case_id})
    locations: List[LocationPoint] = []
    for r in records:
        loc = dict(r.get("loc", {}))
        if not loc:
            continue
        locations.append(LocationPoint(
            id=loc.get("entity_id", str(uuid.uuid4())),
            label=loc.get("name", "Unknown Location"),
            latitude=float(loc.get("latitude", 0.0)),
            longitude=float(loc.get("longitude", 0.0)),
            event_count=int(loc.get("event_count", 1)),
            confidence=float(loc.get("confidence", 0.8)),
            entity_id=loc.get("entity_id"),
            location_type=loc.get("location_type", "POINT"),
        ))
    return LocationsResponse(case_id=case_id, locations=locations)


async def create_entity_node(
    entity_id: str,
    entity_type: str,
    name: str,
    attributes: Dict[str, Any],
) -> str:
    """Create or update a Neo4j entity node. Returns element_id."""
    label = entity_type.replace("_", "").title().replace("Bankaccount", "BankAccount")
    # Normalize label
    label_map = {
        "Person": "Person", "Phone": "Phone", "Vehicle": "Vehicle",
        "Organization": "Organization", "Location": "Location",
        "BankAccount": "BankAccount", "Case": "Case", "Document": "Document",
    }
    safe_label = label_map.get(label, "Entity")

    cypher = f"""
    MERGE (n:{safe_label} {{entity_id: $entity_id}})
    SET n.name = $name,
        n.entity_type = $entity_type,
        n.normalized_name = $normalized_name,
        n.confidence = $confidence,
        n.updated_at = datetime()
    RETURN n
    """
    params: Dict[str, Any] = {
        "entity_id": entity_id,
        "entity_type": entity_type,
        "name": name,
        "normalized_name": name.lower().strip(),
        "confidence": attributes.get("confidence", 1.0),
    }
    records = await run_write_query(cypher, params)
    if records:
        n = records[0].get("n")
        return str(n.element_id) if n and hasattr(n, "element_id") else entity_id
    return entity_id


async def create_relationship(
    source_entity_id: str,
    target_entity_id: str,
    rel_type: str,
    properties: Dict[str, Any],
) -> None:
    """Create or update a relationship between two entity nodes."""
    # Allowlisted relationship types only
    allowed_rel_types = {
        "CALLED", "MESSAGED", "TRANSACTED_WITH", "OWNS", "LOCATED_AT",
        "ASSOCIATED_WITH", "INVOLVED_IN", "MENTIONED_IN", "CONNECTED_TO",
        "CO_LOCATED", "WORKS_FOR",
    }
    if rel_type not in allowed_rel_types:
        logger.warning("disallowed_rel_type", rel_type=rel_type)
        return

    cypher = f"""
    MATCH (a {{entity_id: $source_id}}), (b {{entity_id: $target_id}})
    MERGE (a)-[r:{rel_type}]->(b)
    SET r.confidence = $confidence,
        r.source_count = coalesce(r.source_count, 0) + $source_count,
        r.weight = coalesce(r.weight, 0) + $weight,
        r.status = $status,
        r.last_seen = datetime(),
        r.first_seen = coalesce(r.first_seen, datetime())
    """
    params: Dict[str, Any] = {
        "source_id": source_entity_id,
        "target_id": target_entity_id,
        "confidence": properties.get("confidence", 1.0),
        "source_count": properties.get("source_count", 1),
        "weight": properties.get("weight", 1.0),
        "status": properties.get("status", "CONFIRMED"),
    }
    await run_write_query(cypher, params)
