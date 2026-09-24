"""
NIRVIK Backend — Evidence Service Subpackage
"""
from app.services.evidence_service import get_case_evidence, add_evidence

__all__ = ["get_case_evidence", "add_evidence"]
