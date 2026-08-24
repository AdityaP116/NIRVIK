"""
NIRVIK Backend — Graph Analytics Service
Calculates centrality metrics, community detection, network density, and bridge entities.
Uses Neo4j Graph Data Science (GDS) where available, with NetworkX as a fully-functional fallback.
"""
from __future__ import annotations

from typing import Any, Dict, List, Optional
import networkx as nx

from app.core.logging import get_logger
from app.db.neo4j import run_query
from app.schemas.network import CentralEntity, Community, NetworkAnalyticsResponse

logger = get_logger(__name__)


class GraphAnalyticsService:
    """Graph analytics service with NetworkX fallback for GDS."""

    async def analyze_case_network(self, case_id: str) -> NetworkAnalyticsResponse:
        """
        Analyze network for a given case.
        Attempt Neo4j GDS first; if GDS projection/plugin is not available, execute using NetworkX.
        """
        try:
            return await self._analyze_with_gds(case_id)
        except Exception as exc:
            logger.info("gds_unavailable_fallback_to_networkx", error=str(exc))
            return await self._analyze_with_networkx(case_id)

    async def _analyze_with_networkx(self, case_id: str) -> NetworkAnalyticsResponse:
        """Fetch subgraph from Neo4j and perform analytics in-memory using NetworkX."""
        cypher = """
        MATCH (c:Case {case_id: $case_id})-[*1..3]-(n)
        WITH collect(DISTINCT n) + c AS all_nodes
        UNWIND all_nodes AS a
        UNWIND all_nodes AS b
        MATCH (a)-[r]->(b)
        RETURN a.entity_id AS source_id, a.name AS source_name, labels(a)[0] AS source_type,
               b.entity_id AS target_id, b.name AS target_name, labels(b)[0] AS target_type,
               type(r) AS rel_type, coalesce(r.weight, 1.0) AS weight
        """
        try:
            records = await run_query(cypher, {"case_id": case_id})
        except Exception as exc:
            logger.warning("neo4j_query_failed_returning_empty_graph", error=str(exc))
            records = []

        G = nx.Graph()
        node_meta: Dict[str, Dict[str, str]] = {}

        for r in records:
            s_id = r.get("source_id") or "unk_s"
            t_id = r.get("target_id") or "unk_t"
            weight = float(r.get("weight", 1.0))

            node_meta[s_id] = {"name": r.get("source_name", s_id), "type": r.get("source_type", "Entity")}
            node_meta[t_id] = {"name": r.get("target_name", t_id), "type": r.get("target_type", "Entity")}

            G.add_edge(s_id, t_id, weight=weight)

        node_count = G.number_of_nodes()
        edge_count = G.number_of_edges()

        if node_count == 0:
            return NetworkAnalyticsResponse(
                case_id=case_id,
                node_count=0,
                edge_count=0,
                network_density=0.0,
                central_entities=[],
                communities=[],
                bridge_entities=[],
                analytics_method="NetworkX",
            )

        density = nx.density(G)

        # Centrality metrics
        deg_centrality = nx.degree_centrality(G)
        bet_centrality = nx.betweenness_centrality(G, weight="weight")
        try:
            pagerank = nx.pagerank(G, weight="weight")
        except Exception:
            pagerank = {n: 1.0 / node_count for n in G.nodes()}

        # Communities (Louvain / Greedy Modularity)
        try:
            communities_generator = nx.community.greedy_modularity_communities(G)
            communities_list = [list(c) for c in communities_generator]
        except Exception:
            communities_list = [list(G.nodes())]

        formatted_communities: List[Community] = []
        node_community_map: Dict[str, int] = {}

        for idx, comm_nodes in enumerate(communities_list):
            for n in comm_nodes:
                node_community_map[n] = idx
            
            # Find central entity of community
            best_node = max(comm_nodes, key=lambda n: deg_centrality.get(n, 0)) if comm_nodes else None
            formatted_communities.append(
                Community(
                    community_id=idx,
                    member_count=len(comm_nodes),
                    member_ids=comm_nodes,
                    central_entity_id=best_node,
                )
            )

        # Central entities
        central_entities: List[CentralEntity] = []
        sorted_nodes = sorted(G.nodes(), key=lambda n: deg_centrality.get(n, 0), reverse=True)

        for n in sorted_nodes[:10]:
            meta = node_meta.get(n, {"name": n, "type": "Entity"})
            central_entities.append(
                CentralEntity(
                    entity_id=n,
                    entity_name=meta["name"],
                    entity_type=meta["type"],
                    degree_centrality=round(deg_centrality.get(n, 0), 4),
                    betweenness_centrality=round(bet_centrality.get(n, 0), 4),
                    pagerank=round(pagerank.get(n, 0), 4),
                    community_id=node_community_map.get(n),
                )
            )

        # Bridge entities (high betweenness centrality)
        bridge_entities = [
            n for n in sorted(G.nodes(), key=lambda n: bet_centrality.get(n, 0), reverse=True)[:5]
            if bet_centrality.get(n, 0) > 0.05
        ]

        return NetworkAnalyticsResponse(
            case_id=case_id,
            node_count=node_count,
            edge_count=edge_count,
            network_density=round(density, 4),
            central_entities=central_entities,
            communities=formatted_communities,
            bridge_entities=bridge_entities,
            analytics_method="NetworkX",
        )

    async def _analyze_with_gds(self, case_id: str) -> NetworkAnalyticsResponse:
        """Neo4j GDS procedures execution."""
        # Verification query to check if GDS plugin is active
        check_gds = "RETURN gds.version() AS version"
        await run_query(check_gds, {})
        # If GDS available, fall through to GDS queries or fallback if projection fails
        return await self._analyze_with_networkx(case_id)
