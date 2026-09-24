"""
NIRVIK Utility Functions
"""
import uuid
from typing import Any, Dict

def generate_uuid() -> str:
    return str(uuid.uuid4())

def sanitize_dict(d: Dict[str, Any]) -> Dict[str, Any]:
    return {k: v for k, v in d.items() if v is not None}
