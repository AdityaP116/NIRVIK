"""
NIRVIK Backend — MongoDB Index Creation
Run via: python scripts/create_indexes.py
"""
from __future__ import annotations

import asyncio

from pymongo import ASCENDING, DESCENDING, IndexModel, TEXT

from app.core.logging import configure_logging, get_logger
from app.db.mongodb import connect_mongodb, get_database

logger = get_logger(__name__)

INDEXES: dict[str, list[IndexModel]] = {
    "users": [
        IndexModel([("email", ASCENDING)], unique=True, name="idx_users_email"),
        IndexModel([("officer_id", ASCENDING)], unique=True, sparse=True, name="idx_users_officer_id"),
        IndexModel([("role", ASCENDING)], name="idx_users_role"),
    ],
    "cases": [
        IndexModel([("case_number", ASCENDING)], unique=True, name="idx_cases_case_number"),
        IndexModel([("status", ASCENDING)], name="idx_cases_status"),
        IndexModel([("priority", ASCENDING)], name="idx_cases_priority"),
        IndexModel([("assigned_to", ASCENDING)], name="idx_cases_assigned_to"),
        IndexModel([("created_at", DESCENDING)], name="idx_cases_created_at"),
        IndexModel([("title", TEXT), ("description", TEXT)], name="idx_cases_text"),
    ],
    "entities": [
        IndexModel([("entity_type", ASCENDING)], name="idx_entities_type"),
        IndexModel([("normalized_name", ASCENDING)], name="idx_entities_normalized_name"),
        IndexModel([("linked_cases", ASCENDING)], name="idx_entities_linked_cases"),
        IndexModel([("name", TEXT)], name="idx_entities_text"),
    ],
    "documents": [
        IndexModel([("case_id", ASCENDING)], name="idx_documents_case_id"),
        IndexModel([("document_type", ASCENDING)], name="idx_documents_type"),
        IndexModel([("content_hash", ASCENDING)], name="idx_documents_content_hash"),
    ],
    "cdr_records": [
        IndexModel([("caller", ASCENDING)], name="idx_cdr_caller"),
        IndexModel([("receiver", ASCENDING)], name="idx_cdr_receiver"),
        IndexModel([("timestamp", DESCENDING)], name="idx_cdr_timestamp"),
        IndexModel([("caller", ASCENDING), ("timestamp", DESCENDING)], name="idx_cdr_caller_ts"),
    ],
    "financial_transactions": [
        IndexModel([("sender_account", ASCENDING)], name="idx_fin_sender"),
        IndexModel([("receiver_account", ASCENDING)], name="idx_fin_receiver"),
        IndexModel([("timestamp", DESCENDING)], name="idx_fin_timestamp"),
        IndexModel([("amount", DESCENDING)], name="idx_fin_amount"),
    ],
    "findings": [
        IndexModel([("case_id", ASCENDING)], name="idx_findings_case_id"),
        IndexModel([("entity_id", ASCENDING)], name="idx_findings_entity_id"),
        IndexModel([("status", ASCENDING)], name="idx_findings_status"),
        IndexModel([("finding_type", ASCENDING)], name="idx_findings_type"),
        IndexModel([("created_at", DESCENDING)], name="idx_findings_created_at"),
    ],
    "alerts": [
        IndexModel([("case_id", ASCENDING)], name="idx_alerts_case_id"),
        IndexModel([("priority", ASCENDING)], name="idx_alerts_priority"),
        IndexModel([("status", ASCENDING)], name="idx_alerts_status"),
        IndexModel([("created_at", DESCENDING)], name="idx_alerts_created_at"),
    ],
    "evidence": [
        IndexModel([("case_id", ASCENDING)], name="idx_evidence_case_id"),
        IndexModel([("sha256", ASCENDING)], name="idx_evidence_sha256"),
        IndexModel([("document_id", ASCENDING)], name="idx_evidence_document_id"),
    ],
    "audit_logs": [
        IndexModel([("user_id", ASCENDING)], name="idx_audit_user_id"),
        IndexModel([("timestamp", DESCENDING)], name="idx_audit_timestamp"),
        IndexModel([("resource_id", ASCENDING)], name="idx_audit_resource_id"),
        IndexModel([("action", ASCENDING)], name="idx_audit_action"),
    ],
    "ingestion_jobs": [
        IndexModel([("status", ASCENDING)], name="idx_ingestion_status"),
        IndexModel([("created_at", DESCENDING)], name="idx_ingestion_created_at"),
    ],
}


async def create_indexes() -> None:
    await connect_mongodb()
    db = get_database()
    for collection_name, indexes in INDEXES.items():
        collection = db[collection_name]
        try:
            result = await collection.create_indexes(indexes)
            logger.info("indexes_created", collection=collection_name, count=len(result))
        except Exception as exc:
            logger.error("index_creation_failed", collection=collection_name, error=str(exc))


if __name__ == "__main__":
    configure_logging()
    asyncio.run(create_indexes())
