"""
NIRVIK Backend — Health Check CLI Script
Runs standalone status check against FastAPI readiness endpoint.
"""
from __future__ import annotations

import httpx


def check_health():
    url = "http://localhost:8000/health/ready"
    try:
        r = httpx.get(url, timeout=5.0)
        print(f"Health Status [{r.status_code}]:")
        print(r.json())
    except Exception as e:
        print(f"Health check failed (is server running on port 8000?): {e}")


if __name__ == "__main__":
    check_health()
