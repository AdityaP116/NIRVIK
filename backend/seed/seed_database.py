"""
NIRVIK Backend — MongoDB Database Seeder
Seeds MongoDB collections with realistic synthetic data:
- users (Admin, Investigator, Supervisor, Analyst)
- cases (including CASE-2026-0142)
- entities
- cdr_records
- financial_transactions
- documents
- findings & alerts
"""
from __future__ import annotations

import asyncio
from datetime import datetime, timezone

from app.core.logging import configure_logging, get_logger
from app.core.security import UserRole, hash_password
from app.db.indexes import create_indexes
from app.db.mongodb import connect_mongodb, get_database
from seed.generate_data import generate_all_synthetic_data

logger = get_logger(__name__)


async def seed_mongodb() -> None:
    await connect_mongodb()
    db = get_database()

    # Create Indexes
    await create_indexes()

    # 1. Users
    users_col = db["users"]
    await users_col.delete_many({})

    demo_users = [
        {
            "officer_id": "OFFICER_001",
            "email": "admin@nirvik.gov.in",
            "full_name": "Senior Admin Officer",
            "role": UserRole.ADMIN.value,
            "is_active": True,
            "password_hash": hash_password("NirvikAdmin2026!"),
            "department": "Cyber Crime & Economic Offences",
            "badge_number": "ADM-8801",
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc),
        },
        {
            "officer_id": "OFFICER_002",
            "email": "investigator@nirvik.gov.in",
            "full_name": "Lead Investigator Kumar",
            "role": UserRole.INVESTIGATOR.value,
            "is_active": True,
            "password_hash": hash_password("Investigator2026!"),
            "department": "Special Investigation Division",
            "badge_number": "INV-4402",
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc),
        },
        {
            "officer_id": "OFFICER_003",
            "email": "supervisor@nirvik.gov.in",
            "full_name": "Superintendent Inspector Singh",
            "role": UserRole.SUPERVISOR.value,
            "is_active": True,
            "password_hash": hash_password("Supervisor2026!"),
            "department": "Intelligence Control Cell",
            "badge_number": "SUP-1103",
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc),
        },
        {
            "officer_id": "OFFICER_004",
            "email": "analyst@nirvik.gov.in",
            "full_name": "Intelligence Analyst Patel",
            "role": UserRole.ANALYST.value,
            "is_active": True,
            "password_hash": hash_password("Analyst2026!"),
            "department": "Data Analytics Division",
            "badge_number": "ANA-3304",
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc),
        },
    ]

    await users_col.insert_many(demo_users)
    logger.info("seeded_users", count=len(demo_users))

    # Generate synthetic dataset
    data = generate_all_synthetic_data()

    # 2. Seed Entities
    entities_col = db["entities"]
    await entities_col.delete_many({})
    all_entities = (
        data["persons"] + data["phones"] + data["vehicles"] +
        data["locations"] + data["organizations"] + data["bank_accounts"]
    )
    for e in all_entities:
        e["created_at"] = datetime.now(timezone.utc)
        e["updated_at"] = datetime.now(timezone.utc)
    await entities_col.insert_many(all_entities)
    logger.info("seeded_entities", count=len(all_entities))

    # 3. Seed Cases
    cases_col = db["cases"]
    await cases_col.delete_many({})
    for c in data["cases"]:
        c["created_at"] = datetime.now(timezone.utc)
        c["updated_at"] = datetime.now(timezone.utc)
    await cases_col.insert_many(data["cases"])
    logger.info("seeded_cases", count=len(data["cases"]))

    # 4. Seed CDR Records
    cdr_col = db["cdr_records"]
    await cdr_col.delete_many({})
    await cdr_col.insert_many(data["cdr_records"])
    logger.info("seeded_cdr_records", count=len(data["cdr_records"]))

    # 5. Seed Financial Transactions
    fin_col = db["financial_transactions"]
    await fin_col.delete_many({})
    await fin_col.insert_many(data["financial_records"])
    logger.info("seeded_financial_records", count=len(data["financial_records"]))

    # 6. Seed Documents
    docs_col = db["documents"]
    await docs_col.delete_many({})
    for d in data["documents"]:
        d["created_at"] = datetime.now(timezone.utc)
        d["updated_at"] = datetime.now(timezone.utc)
    await docs_col.insert_many(data["documents"])
    logger.info("seeded_documents", count=len(data["documents"]))

    # 7. Seed Initial Findings & Alerts for primary case CASE-2026-0142
    findings_col = db["findings"]
    await findings_col.delete_many({})
    demo_findings = [
        {
            "case_id": "CASE-2026-0142",
            "entity_id": data["persons"][0]["id"],
            "finding_type": "NETWORK_INFLUENCE",
            "title": "High Degree Centrality Entity Detected",
            "description": f"Entity {data['persons'][0]['name']} demonstrates high betweenness centrality (0.91) bridging multiple sub-networks.",
            "confidence": 0.92,
            "status": "REQUIRES_REVIEW",
            "explanation": {
                "degree_centrality": 0.88,
                "betweenness_centrality": 0.91,
                "linked_entities": 24,
                "linked_cases": 3,
            },
            "evidence_summary": [{"source_type": "CDR", "count": 18}, {"source_type": "FINANCIAL", "count": 6}],
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc),
        },
        {
            "case_id": "CASE-2026-0142",
            "entity_id": data["bank_accounts"][0]["id"],
            "finding_type": "FINANCIAL_ANOMALY",
            "title": "Sudden High-Volume Transaction Burst",
            "description": f"Account {data['bank_accounts'][0]['name']} registered 3 transactions exceeding 1,500,000 INR in a 2-hour window.",
            "confidence": 0.89,
            "anomaly_score": 0.94,
            "status": "NEW",
            "explanation": {
                "method": "HYBRID_RULES_ISOLATION_FOREST",
                "amount_deviation": 4.2,
                "velocity_spike": "5x baseline",
            },
            "evidence_summary": [{"source_type": "FINANCIAL", "count": 3}],
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc),
        },
    ]
    await findings_col.insert_many(demo_findings)

    alerts_col = db["alerts"]
    await alerts_col.delete_many({})
    demo_alerts = [
        {
            "case_id": "CASE-2026-0142",
            "alert_type": "FINANCIAL_ANOMALY",
            "priority": "HIGH",
            "title": "High Volume Transaction Spike Alert",
            "description": "Rapid succession transactions flagged by isolation forest model.",
            "status": "NEW",
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc),
        },
        {
            "case_id": "CASE-2026-0142",
            "alert_type": "COMMUNICATION_BURST",
            "priority": "MEDIUM",
            "title": "CDR Communication Frequency Anomaly",
            "description": "Burst of 22 incoming/outgoing calls detected within 45 minutes.",
            "status": "NEW",
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc),
        },
    ]
    await alerts_col.insert_many(demo_alerts)
    logger.info("seeded_findings_and_alerts")


if __name__ == "__main__":
    configure_logging()
    asyncio.run(seed_mongodb())
