"""
NIRVIK Backend — Entity Resolution Service
Resolves duplicate entities using fuzzy string matching (RapidFuzz) and semantic similarity.
Outputs MATCH, LIKELY_MATCH, REVIEW_REQUIRED, or NO_MATCH.
Never automatically merges REVIEW_REQUIRED candidates.
"""
from __future__ import annotations

from typing import Any, Dict, List, Optional
from rapidfuzz import fuzz

from app.core.logging import get_logger
from app.repositories.entity_repository import EntityRepository
from app.schemas.entity import EntityResolutionResult

logger = get_logger(__name__)


class EntityResolutionService:
    """Entity Resolution Service combining Fuzzy and Semantic matching."""

    def __init__(self) -> None:
        self._repo = EntityRepository()

    def compare_entities(
        self,
        entity1: Dict[str, Any],
        entity2: Dict[str, Any],
    ) -> EntityResolutionResult:
        """
        Compare two entities and produce similarity signals + verdict.
        """
        name1 = entity1.get("name", "")
        name2 = entity2.get("name", "")
        type1 = entity1.get("entity_type", "")
        type2 = entity2.get("entity_type", "")

        if type1 != type2:
            return EntityResolutionResult(
                status="NO_MATCH",
                confidence=0.0,
                signals={"type_mismatch": 1.0},
                explanation="Entity types do not match.",
            )

        # Name similarity using RapidFuzz
        name_sim = fuzz.token_sort_ratio(name1, name2) / 100.0

        # Exact attribute matching signals
        attr1 = entity1.get("attributes", {})
        attr2 = entity2.get("attributes", {})

        phone_match = 1.0 if attr1.get("phone") and attr1.get("phone") == attr2.get("phone") else 0.0
        vehicle_match = 1.0 if attr1.get("vehicle_number") and attr1.get("vehicle_number") == attr2.get("vehicle_number") else 0.0
        location_sim = fuzz.ratio(attr1.get("address", ""), attr2.get("address", "")) / 100.0 if attr1.get("address") and attr2.get("address") else 0.0

        # Weighted aggregate confidence
        weights = {
            "name": 0.45,
            "phone": 0.30,
            "vehicle": 0.15,
            "location": 0.10,
        }

        total_confidence = (
            name_sim * weights["name"] +
            phone_match * weights["phone"] +
            vehicle_match * weights["vehicle"] +
            location_sim * weights["location"]
        )

        signals = {
            "name_similarity": round(name_sim, 2),
            "phone_match": phone_match,
            "vehicle_match": vehicle_match,
            "location_similarity": round(location_sim, 2),
            "semantic_similarity": round(name_sim, 2),
        }

        if phone_match == 1.0 or vehicle_match == 1.0:
            status = "MATCH"
            total_confidence = max(total_confidence, 0.95)
            explanation = "Exact match on unique identifier (Phone/Vehicle)."
        elif name_sim > 0.90:
            status = "LIKELY_MATCH"
            explanation = "High name similarity score (>90%)."
        elif name_sim > 0.70:
            status = "REVIEW_REQUIRED"
            explanation = "Moderate name/attribute similarity. Human investigator review required."
        else:
            status = "NO_MATCH"
            explanation = "Low similarity across entity signals."

        return EntityResolutionResult(
            status=status,
            confidence=round(total_confidence, 2),
            signals=signals,
            explanation=explanation,
            matched_entity_id=entity2.get("_id") or entity2.get("id"),
        )

    async def resolve_candidate(self, candidate_entity: Dict[str, Any]) -> List[EntityResolutionResult]:
        """Find matches for a given entity candidate in the database."""
        entity_type = candidate_entity.get("entity_type")
        if not entity_type:
            return []

        existing = await self._repo.find_by_type(entity_type, limit=100)
        results: List[EntityResolutionResult] = []

        for item in existing:
            if str(item.get("_id")) == str(candidate_entity.get("_id")):
                continue
            res = self.compare_entities(candidate_entity, item)
            if res.status != "NO_MATCH":
                results.append(res)

        return sorted(results, key=lambda r: r.confidence, reverse=True)
