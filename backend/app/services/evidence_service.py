"""
NIRVIK Backend — Evidence Service
Handles evidence uploads, SHA-256 calculation, object storage persistence,
metadata tracking in MongoDB, and integrity recording in Hyperledger Fabric.
"""
from __future__ import annotations

import hashlib
import io
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

from app.core.exceptions import NotFoundError
from app.core.logging import get_logger
from app.integrations.fabric.client import get_fabric_client
from app.integrations.storage.minio_storage import get_storage
from app.repositories.entity_repository import EvidenceRepository
from app.schemas.finding import EvidenceResponse, EvidenceVerifyResponse

logger = get_logger(__name__)


class EvidenceService:
    """Evidence storage and integrity service."""

    def __init__(self) -> None:
        self._repo = EvidenceRepository()
        self._storage = get_storage()
        self._fabric = get_fabric_client()

    async def upload_evidence(
        self,
        case_id: str,
        filename: str,
        file_bytes: bytes,
        content_type: str,
        uploaded_by: str,
        document_id: Optional[str] = None,
    ) -> EvidenceResponse:
        """
        1. Calculate SHA-256
        2. Save file to MinIO/S3 object storage
        3. Save metadata to MongoDB
        4. Record evidence hash on Hyperledger Fabric
        """
        # 1. SHA-256
        sha256 = hashlib.sha256(file_bytes).hexdigest()

        # 2. Key generation & storage
        storage_key = f"cases/{case_id}/{sha256[:16]}_{filename}"
        await self._storage.upload(
            key=storage_key,
            data=io.BytesIO(file_bytes),
            size=len(file_bytes),
            content_type=content_type,
        )

        # 3. Document in MongoDB
        doc = {
            "case_id": case_id,
            "document_id": document_id,
            "storage_key": storage_key,
            "filename": filename,
            "content_type": content_type,
            "size": len(file_bytes),
            "sha256": sha256,
            "uploaded_by": uploaded_by,
            "created_at": datetime.now(timezone.utc),
        }
        evidence_id = await self._repo.insert_one(doc)

        # 4. Hyperledger Fabric proof creation
        fabric_proof = await self._fabric.record_evidence_hash(
            evidence_id=evidence_id, sha256=sha256, case_id=case_id
        )

        updates = {
            "fabric_transaction_id": fabric_proof.transaction_id,
            "fabric_status": fabric_proof.fabric_status,
        }
        await self._repo.update_by_id(evidence_id, updates)

        doc["_id"] = evidence_id
        doc.update(updates)
        return self._to_response(doc)

    async def get_evidence(self, evidence_id: str) -> EvidenceResponse:
        doc = await self._repo.find_by_id(evidence_id)
        if not doc:
            raise NotFoundError("Evidence", evidence_id)
        return self._to_response(doc)

    async def download_evidence(self, evidence_id: str) -> tuple[bytes, str, str]:
        """Return file bytes, filename, content_type."""
        doc = await self._repo.find_by_id(evidence_id)
        if not doc:
            raise NotFoundError("Evidence", evidence_id)
        data = await self._storage.download(doc["storage_key"])
        return data, doc["filename"], doc["content_type"]

    async def verify_evidence_integrity(self, evidence_id: str) -> EvidenceVerifyResponse:
        """Verify evidence SHA-256 against stored hash and Hyperledger Fabric record."""
        doc = await self._repo.find_by_id(evidence_id)
        if not doc:
            raise NotFoundError("Evidence", evidence_id)

        # Download and verify hash matches stored hash
        file_bytes = await self._storage.download(doc["storage_key"])
        calculated_sha = hashlib.sha256(file_bytes).hexdigest()
        hash_matched = (calculated_sha == doc["sha256"])

        # Check fabric
        fabric_verified = await self._fabric.verify_evidence_hash(evidence_id, doc["sha256"])
        proof = await self._fabric.get_evidence_proof(evidence_id)

        proof_dict = None
        if proof:
            proof_dict = {
                "transaction_id": proof.transaction_id,
                "block_number": proof.block_number,
                "timestamp": proof.timestamp,
                "fabric_status": proof.fabric_status,
            }

        return EvidenceVerifyResponse(
            evidence_id=evidence_id,
            sha256=calculated_sha,
            verified=hash_matched and (fabric_verified or doc.get("fabric_status") == "FABRIC_MOCK"),
            fabric_status=doc.get("fabric_status", "FABRIC_MOCK"),
            proof=proof_dict,
        )

    async def list_case_evidence(
        self, case_id: str, skip: int = 0, limit: int = 20
    ) -> List[EvidenceResponse]:
        docs = await self._repo.find_by_case(case_id, skip=skip, limit=limit)
        return [self._to_response(d) for d in docs]

    @staticmethod
    def _to_response(doc: dict) -> EvidenceResponse:
        return EvidenceResponse(
            id=str(doc["_id"]),
            case_id=doc["case_id"],
            document_id=doc.get("document_id"),
            filename=doc["filename"],
            content_type=doc["content_type"],
            size=doc["size"],
            sha256=doc["sha256"],
            uploaded_by=doc["uploaded_by"],
            fabric_transaction_id=doc.get("fabric_transaction_id"),
            fabric_status=doc.get("fabric_status"),
            created_at=doc["created_at"],
        )
