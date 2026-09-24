"""
NIRVIK Backend — NLP Service Subpackage Implementation
"""
from app.services.nlp_service import NLPService, ExtractedEntity, ExtractedRelationship, NLPExtractionResult

__all__ = ["NLPService", "ExtractedEntity", "ExtractedRelationship", "NLPExtractionResult"]
