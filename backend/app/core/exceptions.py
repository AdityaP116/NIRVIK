"""
NIRVIK Backend — Unified Exception Handling
All errors return: {"error": {"code": ..., "message": ..., "request_id": ...}}
"""
from __future__ import annotations

import uuid
from typing import Any, Dict, Optional

from fastapi import HTTPException, Request, status
from fastapi.responses import JSONResponse

from app.core.logging import get_logger, request_id_var

logger = get_logger(__name__)


class NIRVIKException(Exception):
    """Base exception for all application errors."""

    def __init__(
        self,
        code: str,
        message: str,
        status_code: int = status.HTTP_500_INTERNAL_SERVER_ERROR,
        details: Optional[Dict[str, Any]] = None,
    ) -> None:
        self.code = code
        self.message = message
        self.status_code = status_code
        self.details = details or {}
        super().__init__(message)


# ── Domain Exceptions ─────────────────────────────────────────────────────────

class NotFoundError(NIRVIKException):
    def __init__(self, resource: str, identifier: str = "") -> None:
        super().__init__(
            code=f"{resource.upper().replace(' ', '_')}_NOT_FOUND",
            message=f"{resource} not found" + (f": {identifier}" if identifier else ""),
            status_code=status.HTTP_404_NOT_FOUND,
        )


class AuthenticationError(NIRVIKException):
    def __init__(self, message: str = "Authentication failed") -> None:
        super().__init__(
            code="AUTHENTICATION_FAILED",
            message=message,
            status_code=status.HTTP_401_UNAUTHORIZED,
        )


class AuthorizationError(NIRVIKException):
    def __init__(self, message: str = "Insufficient permissions") -> None:
        super().__init__(
            code="AUTHORIZATION_FAILED",
            message=message,
            status_code=status.HTTP_403_FORBIDDEN,
        )


class ValidationError(NIRVIKException):
    def __init__(self, message: str, details: Optional[Dict[str, Any]] = None) -> None:
        super().__init__(
            code="VALIDATION_ERROR",
            message=message,
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            details=details,
        )


class ConflictError(NIRVIKException):
    def __init__(self, message: str) -> None:
        super().__init__(
            code="CONFLICT",
            message=message,
            status_code=status.HTTP_409_CONFLICT,
        )


class ServiceUnavailableError(NIRVIKException):
    def __init__(self, service: str) -> None:
        super().__init__(
            code="SERVICE_UNAVAILABLE",
            message=f"{service} is unavailable",
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
        )


class GraphTraversalError(NIRVIKException):
    def __init__(self, message: str = "Graph traversal failed") -> None:
        super().__init__(
            code="GRAPH_TRAVERSAL_ERROR",
            message=message,
            status_code=status.HTTP_400_BAD_REQUEST,
        )


# ── Error Response Builder ────────────────────────────────────────────────────

def _error_response(
    code: str,
    message: str,
    status_code: int,
    details: Optional[Dict[str, Any]] = None,
) -> JSONResponse:
    rid = request_id_var.get("") or str(uuid.uuid4())
    body: Dict[str, Any] = {
        "error": {
            "code": code,
            "message": message,
            "request_id": rid,
        }
    }
    if details:
        body["error"]["details"] = details
    return JSONResponse(status_code=status_code, content=body)


# ── FastAPI Exception Handlers ────────────────────────────────────────────────

async def nirvik_exception_handler(request: Request, exc: NIRVIKException) -> JSONResponse:
    logger.warning("application_error", code=exc.code, message=exc.message, path=str(request.url))
    return _error_response(exc.code, exc.message, exc.status_code, exc.details)


async def http_exception_handler(request: Request, exc: HTTPException) -> JSONResponse:
    code = {
        401: "UNAUTHORIZED",
        403: "FORBIDDEN",
        404: "NOT_FOUND",
        405: "METHOD_NOT_ALLOWED",
        422: "VALIDATION_ERROR",
        429: "TOO_MANY_REQUESTS",
        500: "INTERNAL_SERVER_ERROR",
    }.get(exc.status_code, "HTTP_ERROR")
    return _error_response(code, str(exc.detail), exc.status_code)


async def unhandled_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    logger.exception("unhandled_error", path=str(request.url), exc_info=exc)
    return _error_response(
        "INTERNAL_SERVER_ERROR",
        "An unexpected error occurred",
        status.HTTP_500_INTERNAL_SERVER_ERROR,
    )
