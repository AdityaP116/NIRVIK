"""
NIRVIK Backend — Audit Service Implementation
"""
from app.services.audit_service import log_audit_event, get_audit_trail

__all__ = ["log_audit_event", "get_audit_trail"]
