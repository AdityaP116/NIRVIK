"""
NIRVIK Backend — FastAPI Dependencies
Provides: current_user, require_role, db handles, pagination
"""
from __future__ import annotations

import uuid
from typing import Annotated, Optional

from fastapi import Depends, Header, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.core.exceptions import AuthenticationError, AuthorizationError
from app.core.logging import request_id_var
from app.core.security import TokenPayload, UserRole, decode_token

bearer_scheme = HTTPBearer(auto_error=False)


async def get_request_id(
    x_request_id: Optional[str] = Header(default=None),
) -> str:
    rid = x_request_id or str(uuid.uuid4())
    request_id_var.set(rid)
    return rid


async def get_current_token(
    credentials: Annotated[
        Optional[HTTPAuthorizationCredentials], Depends(bearer_scheme)
    ],
) -> TokenPayload:
    if not credentials:
        raise AuthenticationError("Missing bearer token")
    return decode_token(credentials.credentials, expected_type="access")


async def get_current_user(
    token: Annotated[TokenPayload, Depends(get_current_token)],
) -> TokenPayload:
    return token


def require_role(*roles: UserRole):
    """Dependency factory that validates user role."""

    async def _check(
        current_user: Annotated[TokenPayload, Depends(get_current_user)],
    ) -> TokenPayload:
        if current_user.role not in roles:
            raise AuthorizationError(
                f"Role '{current_user.role.value}' is not permitted for this action."
            )
        return current_user

    return _check


# ── Pagination ─────────────────────────────────────────────────────────────────

class PaginationParams:
    def __init__(
        self,
        page: int = 1,
        page_size: int = 20,
    ) -> None:
        if page < 1:
            page = 1
        if page_size < 1:
            page_size = 1
        if page_size > 100:
            page_size = 100
        self.page = page
        self.page_size = page_size
        self.skip = (page - 1) * page_size
        self.limit = page_size
