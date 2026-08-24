"""
NIRVIK Backend — Blockchain Service wrapper
Provides evidence hash verification via the Hyperledger Fabric adapter interface.
"""
from __future__ import annotations

from typing import Optional

from app.integrations.fabric.client import FabricProof, get_fabric_client


class BlockchainService:
    def __init__(self) -> None:
        self._client = get_fabric_client()

    async def record_evidence_hash(
        self, evidence_id: str, sha256: str, case_id: str
    ) -> FabricProof:
        return await self._client.record_evidence_hash(evidence_id, sha256, case_id)

    async def verify_evidence_hash(self, evidence_id: str, sha256: str) -> bool:
        return await self._client.verify_evidence_hash(evidence_id, sha256)

    async def get_evidence_proof(self, evidence_id: str) -> Optional[FabricProof]:
        return await self._client.get_evidence_proof(evidence_id)

    async def get_status(self) -> str:
        return await self._client.ping()
