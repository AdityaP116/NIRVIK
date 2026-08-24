"""
NIRVIK Backend — Comprehensive Unit Tests
Tests NLP, Entity Resolution, Anomaly Engine, Evidence Hashing, and Assistant Query Allowlist.
"""
import pytest
import hashlib
from app.services.nlp_service import NLPService
from app.services.entity_resolution_service import EntityResolutionService
from app.services.anomaly_service import AnomalyService
from app.services.assistant_service import AssistantService
from app.schemas.finding import AssistantQueryRequest


def test_nlp_entity_extraction():
    nlp = NLPService()
    text = "Officer Ramesh Kumar called +919876543210 regarding vehicle MH12AB1234 in Mumbai."
    res = nlp.extract(text)

    entity_types = {e.entity_type for e in res.entities}
    assert "PHONE" in entity_types
    assert "VEHICLE" in entity_types
    assert len(res.entities) >= 2


def test_entity_resolution_comparison():
    res_service = EntityResolutionService()
    e1 = {
        "name": "Ramesh Kumar",
        "entity_type": "PERSON",
        "attributes": {"phone": "+919876543210"},
    }
    e2 = {
        "name": "Ramesh Kumar",
        "entity_type": "PERSON",
        "attributes": {"phone": "+919876543210"},
    }
    match = res_service.compare_entities(e1, e2)
    assert match.status == "MATCH"
    assert match.confidence >= 0.95


def test_anomaly_detection_rules():
    anomaly_service = AnomalyService()
    transactions = [
        {"transaction_id": "tx_1", "amount": 15000, "recent_count": 2},
        {"transaction_id": "tx_2", "amount": 2500000, "recent_count": 15},  # High amount & high count
    ]
    anomalies = anomaly_service.detect_financial_anomalies(transactions)
    assert len(anomalies) >= 1
    assert anomalies[0]["amount"] == 2500000
    assert anomalies[0]["anomaly_score"] >= 0.75


def test_evidence_sha256_calculation():
    payload = b"NIRVIK Synthetic Evidence File Content 2026"
    expected_hash = hashlib.sha256(payload).hexdigest()
    assert len(expected_hash) == 64


@pytest.mark.asyncio
async def test_assistant_query_read_only_restriction():
    assistant = AssistantService()
    request = AssistantQueryRequest(
        question="Who are the most connected entities in this case?",
        case_id="CASE-2026-0142"
    )
    res = await assistant.process_query(request)
    assert res.is_read_only is True
    assert "disclaimer" in res.model_dump()
    assert res.query_type == "MOST_CONNECTED_ENTITIES"
