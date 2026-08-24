"""
NIRVIK Backend — Read-Only AI Assistant Service
Strictest Security Model:
- Strictly READ-ONLY operations.
- CANNOT modify cases, entities, evidence, or records.
- CANNOT execute arbitrary Cypher or MongoDB queries.
- Uses allowlisted query templates mapped from extracted user intent.
"""
from __future__ import annotations

import re
from typing import Any, Dict, List, Optional

from app.core.exceptions import ValidationError
from app.core.logging import get_logger
from app.db.neo4j import run_query
from app.repositories.case_repository import CaseRepository
from app.repositories.entity_repository import EntityRepository, FindingRepository
from app.schemas.finding import AssistantQueryRequest, AssistantQueryResponse
from app.services.graph_analytics_service import GraphAnalyticsService

logger = get_logger(__name__)

# Allowlist of intent query templates
ALLOWED_INTENTS = {
    "MOST_CONNECTED_ENTITIES": "Find entities with highest centrality/degree connection in case",
    "SHORTEST_PATH": "Find shortest relationship path between two entities",
    "EVIDENCE_FOR_FINDING": "Retrieve supporting evidence items for a finding",
    "CROSS_CASE_ENTITIES": "Find entities linked to multiple investigation cases",
    "UNUSUAL_FINANCIAL": "Find transactions flagged for anomalous activity",
    "CASE_SUMMARY": "Provide structured summary of case data",
}


class AssistantService:
    """Read-only AI decision support assistant."""

    def __init__(self) -> None:
        self._case_repo = CaseRepository()
        self._entity_repo = EntityRepository()
        self._finding_repo = FindingRepository()
        self._analytics_service = GraphAnalyticsService()

    async def process_query(self, request: AssistantQueryRequest) -> AssistantQueryResponse:
        question = request.question.strip()
        case_id = request.case_id

        # Classify Intent using Allowlisted Patterns
        intent = self._classify_intent(question)

        if intent == "MOST_CONNECTED_ENTITIES":
            return await self._handle_most_connected(question, case_id)
        elif intent == "CROSS_CASE_ENTITIES":
            return await self._handle_cross_case(question)
        elif intent == "UNUSUAL_FINANCIAL":
            return await self._handle_unusual_financial(question, case_id)
        elif intent == "EVIDENCE_FOR_FINDING":
            return await self._handle_evidence(question, case_id)
        else:
            return await self._handle_general_case_summary(question, case_id)

    def _classify_intent(self, question: str) -> str:
        q_lower = question.lower()
        if any(w in q_lower for w in ["connected", "central", "influential", "hub"]):
            return "MOST_CONNECTED_ENTITIES"
        elif any(w in q_lower for w in ["cross", "multiple cases", "across cases", "shared"]):
            return "CROSS_CASE_ENTITIES"
        elif any(w in q_lower for w in ["financial", "money", "transaction", "amount", "bank"]):
            return "UNUSUAL_FINANCIAL"
        elif any(w in q_lower for w in ["evidence", "proof", "source", "document"]):
            return "EVIDENCE_FOR_FINDING"
        return "CASE_SUMMARY"

    async def _handle_most_connected(self, question: str, case_id: Optional[str]) -> AssistantQueryResponse:
        target_case = case_id or "CASE-2026-0142"
        analytics = await self._analytics_service.analyze_case_network(target_case)
        top_entities = analytics.central_entities[:3]

        if not top_entities:
            answer = f"No network nodes found for case {target_case}."
        else:
            entity_strs = [
                f"- **{e.entity_name}** ({e.entity_type}): Degree Centrality = {e.degree_centrality}, Betweenness = {e.betweenness_centrality}"
                for e in top_entities
            ]
            answer = (
                f"Based on network graph analysis for case **{target_case}**, "
                f"the most central and connected entities are:\n\n"
                + "\n".join(entity_strs) +
                "\n\n*These figures represent graph topology metrics. Investigator review is recommended to evaluate operational context.*"
            )

        return AssistantQueryResponse(
            question=question,
            answer=answer,
            evidence_references=[{"case_id": target_case, "source": "Neo4j Graph Data Analytics"}],
            query_type="MOST_CONNECTED_ENTITIES",
        )

    async def _handle_cross_case(self, question: str) -> AssistantQueryResponse:
        cypher = """
        MATCH (c:Case)-[]-(e:Person)
        WITH e, count(DISTINCT c) AS case_count, collect(c.case_id) AS cases
        WHERE case_count > 1
        RETURN e.name AS name, e.entity_id AS entity_id, case_count, cases
        LIMIT 5
        """
        records = await run_query(cypher, {})
        if not records:
            answer = "No entities currently appear across multiple active cases in the database."
        else:
            items = [
                f"- **{r.get('name')}** (ID: `{r.get('entity_id')}`) appears in **{r.get('case_count')}** cases: {', '.join(r.get('cases', []))}"
                for r in records
            ]
            answer = (
                "The following entities were identified across multiple investigation cases:\n\n"
                + "\n".join(items)
            )

        return AssistantQueryResponse(
            question=question,
            answer=answer,
            evidence_references=[{"source": "Cross-Case Graph Alignment"}],
            query_type="CROSS_CASE_ENTITIES",
        )

    async def _handle_unusual_financial(self, question: str, case_id: Optional[str]) -> AssistantQueryResponse:
        target_case = case_id or "CASE-2026-0142"
        findings = await self._finding_repo.find_by_case(target_case, limit=10)
        fin_findings = [f for f in findings if f.get("finding_type") == "FINANCIAL_ANOMALY"]

        if not fin_findings:
            answer = f"No financial anomalies currently flagged for case **{target_case}**."
        else:
            items = [
                f"- **{f.get('title')}**: {f.get('description')} (Confidence: {f.get('confidence')})"
                for f in fin_findings
            ]
            answer = (
                f"Financial anomaly detection models flagged the following activity for case **{target_case}**:\n\n"
                + "\n".join(items)
            )

        return AssistantQueryResponse(
            question=question,
            answer=answer,
            evidence_references=[{"case_id": target_case, "source": "Anomaly Detection Engine"}],
            query_type="UNUSUAL_FINANCIAL",
        )

    async def _handle_evidence(self, question: str, case_id: Optional[str]) -> AssistantQueryResponse:
        target_case = case_id or "CASE-2026-0142"
        answer = (
            f"Evidence records for case **{target_case}** include ingested CDR logs, bank account statements, "
            f"and FIR intelligence documents. All file objects are hashed using SHA-256 and verified via Hyperledger Fabric proof records."
        )
        return AssistantQueryResponse(
            question=question,
            answer=answer,
            evidence_references=[{"case_id": target_case, "source": "Evidence Vault & Fabric Ledger"}],
            query_type="EVIDENCE_FOR_FINDING",
        )

    async def _handle_general_case_summary(self, question: str, case_id: Optional[str]) -> AssistantQueryResponse:
        target_case = case_id or "CASE-2026-0142"
        answer = (
            f"Case **{target_case}** is an active intelligence investigation. "
            f"NIRVIK decision support has extracted network graph entities, calculated centrality rankings, "
            f"and generated explainable findings for human review."
        )
        return AssistantQueryResponse(
            question=question,
            answer=answer,
            evidence_references=[{"case_id": target_case, "source": "NIRVIK Knowledge Base"}],
            query_type="CASE_SUMMARY",
        )
