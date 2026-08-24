"""
NIRVIK Backend — Audit Service
"""
from __future__ import annotations

import hashlib
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

from app.models.finding import AuditAction
from app.repositories.entity_repository import AuditRepository


class AuditService:
    """Audit service maintaining SHA-256 hash chain integrity."""

    def __init__(self) -> None:
        self._repo = AuditRepository()

    async def log_action(
        self,
        user_id: str,
        action: AuditAction,
        resource_type: Optional[str] = None,
        resource_id: Optional[str] = None,
        details: Optional[Dict[str, Any]] = None,
        ip_address: Optional[str] = None,
    ) -> str:
        last = await self._repo.get_last_entry()
        prev_hash = last.get("current_hash", "GENESIS_HASH_NIRVIK") if last else "GENESIS_HASH_NIRVIK"

        ts = datetime.now(timezone.utc).isoformat()
        payload = f"{user_id}|{action.value}|{resource_id or ''}|{ts}|{prev_hash}"
        curr_hash = hashlib.sha256(payload.encode("utf-8")).hexdigest()

        doc = {
            "user_id": user_id,
            "action": action.value,
            "resource_type": resource_type,
            "resource_id": resource_id,
            "details": details or {},
            "ip_address": ip_address,
            "timestamp": datetime.now(timezone.utc),
            "previous_hash": prev_hash,
            "current_hash": curr_hash,
        }
        return await self._repo.insert_one(doc)

    async def list_audit_logs(
        self, user_id: Optional[str] = None, skip: int = 0, limit: int = 50
    ) -> List[Dict[str, Any]]:
        query = {"user_id": user_id} if user_id else {}
        return await self._repo.find_many(query, skip=skip, limit=limit)
