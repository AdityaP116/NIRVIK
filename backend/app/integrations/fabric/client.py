"""
NIRVIK Backend — Hyperledger Fabric Client
Supports three modes:
  - FABRIC_MOCK      : in-memory simulation (SIH MVP)
  - FABRIC_CONNECTED : real Hyperledger Fabric network
  - FABRIC_UNAVAILABLE: fabric unreachable

Replace the mock adapter with a real HF SDK adapter without changing callers.
"""
from __future__ import annotations

import hashlib
import json
import uuid
from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Any, Dict, Literal, Optional

from app.core.config import settings
from app.core.logging import get_logger

logger = get_logger(__name__)

FabricStatus = Literal["FABRIC_CONNECTED", "FABRIC_MOCK", "FABRIC_UNAVAILABLE"]


@dataclass
class FabricProof:
    evidence_id: str
    sha256: str
    case_id: str
    timestamp: str
    transaction_id: str
    fabric_status: FabricStatus
    block_number: Optional[int] = None
    channel_name: Optional[str] = None
    chaincode_name: Optional[str] = None


class FabricClientInterface:
    """Base interface — subclass for real Fabric or mock."""

    async def record_evidence_hash(
        self, evidence_id: str, sha256: str, case_id: str
    ) -> FabricProof:
        raise NotImplementedError

    async def verify_evidence_hash(self, evidence_id: str, sha256: str) -> bool:
        raise NotImplementedError

    async def get_evidence_proof(self, evidence_id: str) -> Optional[FabricProof]:
        raise NotImplementedError

    async def ping(self) -> FabricStatus:
        raise NotImplementedError


class MockFabricClient(FabricClientInterface):
    """
    In-memory mock Fabric adapter for SIH MVP.
    Clearly reports FABRIC_MOCK on every response.
    Does NOT pretend to be a real blockchain.
    """

    def __init__(self) -> None:
        self._ledger: Dict[str, FabricProof] = {}

    async def record_evidence_hash(
        self, evidence_id: str, sha256: str, case_id: str
    ) -> FabricProof:
        tx_id = f"MOCK_TX_{uuid.uuid4().hex[:16].upper()}"
        proof = FabricProof(
            evidence_id=evidence_id,
            sha256=sha256,
            case_id=case_id,
            timestamp=datetime.now(timezone.utc).isoformat(),
            transaction_id=tx_id,
            fabric_status="FABRIC_MOCK",
            block_number=len(self._ledger) + 1,
            channel_name=settings.FABRIC_CHANNEL_NAME,
            chaincode_name=settings.FABRIC_CHAINCODE_NAME,
        )
        self._ledger[evidence_id] = proof
        logger.info(
            "fabric_mock_record",
            evidence_id=evidence_id,
            tx_id=tx_id,
            sha256=sha256[:16] + "...",
        )
        return proof

    async def verify_evidence_hash(self, evidence_id: str, sha256: str) -> bool:
        proof = self._ledger.get(evidence_id)
        if proof is None:
            return False
        return proof.sha256 == sha256

    async def get_evidence_proof(self, evidence_id: str) -> Optional[FabricProof]:
        return self._ledger.get(evidence_id)

    async def ping(self) -> FabricStatus:
        return "FABRIC_MOCK"


class UnavailableFabricClient(FabricClientInterface):
    """Adapter for when Fabric is not configured."""

    async def record_evidence_hash(
        self, evidence_id: str, sha256: str, case_id: str
    ) -> FabricProof:
        logger.warning("fabric_unavailable_record_skipped", evidence_id=evidence_id)
        return FabricProof(
            evidence_id=evidence_id,
            sha256=sha256,
            case_id=case_id,
            timestamp=datetime.now(timezone.utc).isoformat(),
            transaction_id="UNAVAILABLE",
            fabric_status="FABRIC_UNAVAILABLE",
        )

    async def verify_evidence_hash(self, evidence_id: str, sha256: str) -> bool:
        return False

    async def get_evidence_proof(self, evidence_id: str) -> Optional[FabricProof]:
        return None

    async def ping(self) -> FabricStatus:
        return "FABRIC_UNAVAILABLE"


# ── Factory ────────────────────────────────────────────────────────────────────

_fabric_client: FabricClientInterface | None = None


def get_fabric_client() -> FabricClientInterface:
    global _fabric_client
    if _fabric_client is not None:
        return _fabric_client

    mode = settings.FABRIC_MODE
    if mode == "mock":
        _fabric_client = MockFabricClient()
        logger.info("fabric_mode", mode="FABRIC_MOCK")
    elif mode == "real":
        # TODO: Replace with real Hyperledger Fabric SDK client
        # e.g. from hfc.fabric import Client
        logger.warning(
            "fabric_real_mode_not_implemented",
            note="Falling back to FABRIC_UNAVAILABLE. Implement real client in integrations/fabric/client.py",
        )
        _fabric_client = UnavailableFabricClient()
    else:
        _fabric_client = UnavailableFabricClient()
        logger.info("fabric_mode", mode="FABRIC_UNAVAILABLE")

    return _fabric_client
