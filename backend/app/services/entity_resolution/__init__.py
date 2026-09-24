"""
NIRVIK Backend — Entity Resolution Subpackage
"""
from app.services.entity_resolution_service import resolve_entity, deduplicate_entities

__all__ = ["resolve_entity", "deduplicate_entities"]
