"""
NIRVIK Backend — Graph Analytics Subpackage
"""
from app.services.graph_analytics_service import run_pagerank, detect_communities

__all__ = ["run_pagerank", "detect_communities"]
