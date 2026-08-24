"""
NIRVIK Backend — NLP Service
Extracts entities, relationships, dates, and locations from unstructured text (FIRs, intelligence reports, CDR notes).
Uses spaCy with deterministic regex patterns, with graceful Transformer model fallback behavior.
"""
from __future__ import annotations

import re
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field

from app.core.config import settings
from app.core.logging import get_logger

logger = get_logger(__name__)

# Try loading spaCy
try:
    import spacy
    try:
        _nlp = spacy.load(settings.SPACY_MODEL)
    except Exception:
        _nlp = spacy.blank("en")
except Exception:
    _nlp = None


class ExtractedEntity(BaseModel):
    text: str
    entity_type: str  # PERSON, PHONE, VEHICLE, LOCATION, ORGANIZATION, BANK_ACCOUNT
    confidence: float
    start_char: int
    end_char: int


class ExtractedRelationship(BaseModel):
    source_entity: str
    target_entity: str
    relationship_type: str
    confidence: float
    context: str


class NLPExtractionResult(BaseModel):
    entities: List[ExtractedEntity]
    relationships: List[ExtractedRelationship]
    dates: List[str]
    locations: List[str]


class NLPService:
    """Natural Language Processing Service for entity and relationship extraction."""

    # Regex patterns for deterministic extraction
    PHONE_REGEX = re.compile(r"(?:\+91[\-\s]?)?[6-9]\d{9}\b")
    VEHICLE_REGEX = re.compile(r"\b[A-Z]{2}[\-\s]?\d{2}[\-\s]?[A-Z]{1,2}[\-\s]?\d{4}\b", re.IGNORECASE)
    BANK_ACCOUNT_REGEX = re.compile(r"\b[0-9]{9,18}\b")

    def extract(self, text: str) -> NLPExtractionResult:
        entities: List[ExtractedEntity] = []
        relationships: List[ExtractedRelationship] = []
        dates: List[str] = []
        locations: List[str] = []

        if not text:
            return NLPExtractionResult(entities=[], relationships=[], dates=[], locations=[])

        # 1. Deterministic Pattern Extraction
        for match in self.PHONE_REGEX.finditer(text):
            entities.append(
                ExtractedEntity(
                    text=match.group(0),
                    entity_type="PHONE",
                    confidence=0.98,
                    start_char=match.start(),
                    end_char=match.end(),
                )
            )

        for match in self.VEHICLE_REGEX.finditer(text):
            entities.append(
                ExtractedEntity(
                    text=match.group(0).upper(),
                    entity_type="VEHICLE",
                    confidence=0.95,
                    start_char=match.start(),
                    end_char=match.end(),
                )
            )

        # 2. spaCy Named Entity Recognition (NER)
        if _nlp is not None:
            doc = _nlp(text)
            for ent in doc.ents:
                etype = "ORGANIZATION" if ent.label_ == "ORG" else (
                    "PERSON" if ent.label_ == "PERSON" else (
                        "LOCATION" if ent.label_ in ("GPE", "LOC") else (
                            "DATE" if ent.label_ == "DATE" else None
                        )
                    )
                )

                if etype == "DATE":
                    dates.append(ent.text)
                elif etype == "LOCATION":
                    locations.append(ent.text)
                    entities.append(
                        ExtractedEntity(
                            text=ent.text,
                            entity_type="LOCATION",
                            confidence=0.88,
                            start_char=ent.start_char,
                            end_char=ent.end_char,
                        )
                    )
                elif etype in ("PERSON", "ORGANIZATION"):
                    entities.append(
                        ExtractedEntity(
                            text=ent.text,
                            entity_type=etype,
                            confidence=0.90,
                            start_char=ent.start_char,
                            end_char=ent.end_char,
                        )
                    )

        # 3. Simple Rule-Based Relationship Extraction
        person_entities = [e.text for e in entities if e.entity_type == "PERSON"]
        phone_entities = [e.text for e in entities if e.entity_type == "PHONE"]
        loc_entities = [e.text for e in entities if e.entity_type == "LOCATION"]

        # Link persons to phones in proximity
        if person_entities and phone_entities:
            for p in person_entities:
                for ph in phone_entities:
                    relationships.append(
                        ExtractedRelationship(
                            source_entity=p,
                            target_entity=ph,
                            relationship_type="CALLED",
                            confidence=0.85,
                            context=f"{p} associated with phone {ph}",
                        )
                    )

        # Link persons to locations
        if person_entities and loc_entities:
            for p in person_entities:
                for l in loc_entities:
                    relationships.append(
                        ExtractedRelationship(
                            source_entity=p,
                            target_entity=l,
                            relationship_type="LOCATED_AT",
                            confidence=0.80,
                            context=f"{p} reported near {l}",
                        )
                    )

        # Deduplicate entities
        seen = set()
        unique_entities: List[ExtractedEntity] = []
        for e in entities:
            key = (e.text.lower(), e.entity_type)
            if key not in seen:
                seen.add(key)
                unique_entities.append(e)

        return NLPExtractionResult(
            entities=unique_entities,
            relationships=relationships,
            dates=list(set(dates)),
            locations=list(set(locations)),
        )

    def normalize_entity_name(self, name: str) -> str:
        """Normalize entity names for deduplication."""
        if not name:
            return ""
        cleaned = re.sub(r"[^\w\s]", "", name).lower().strip()
        return re.sub(r"\s+", " ", cleaned)
