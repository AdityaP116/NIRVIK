"""
NIRVIK Backend — Security: JWT, Argon2, RBAC
"""
from __future__ import annotations

import uuid
from datetime import datetime, timedelta, timezone
from enum import Enum
from typing import Optional

from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError, VerificationError, InvalidHashError
from jose import JWTError, jwt
from pydantic import BaseModel

from app.core.config import settings
from app.core.exceptions import AuthenticationError, AuthorizationError
from app.core.logging import get_logger

logger = get_logger(__name__)

# Argon2 with strong parameters
_ph = PasswordHasher(
    time_cost=2,
    memory_cost=65536,
    parallelism=2,
    hash_len=32,
    salt_len=16,
)


class UserRole(str, Enum):
    ADMIN = "ADMIN"
    INVESTIGATOR = "INVESTIGATOR"
    SUPERVISOR = "SUPERVISOR"
    ANALYST = "ANALYST"


# Role hierarchy — higher index = more privileges
ROLE_HIERARCHY = [
    UserRole.ANALYST,
    UserRole.INVESTIGATOR,
    UserRole.SUPERVISOR,
    UserRole.ADMIN,
]


class TokenPayload(BaseModel):
    sub: str          # user_id
    email: str
    role: UserRole
    jti: str          # token ID (for revocation)
    exp: datetime
    iat: datetime
    token_type: str   # "access" | "refresh"


def hash_password(plain: str) -> str:
    """Hash a plaintext password with Argon2. Never store plaintext."""
    return _ph.hash(plain)


def verify_password(plain: str, hashed: str) -> bool:
    """Returns True if plain matches hashed. Raises AuthenticationError on failure."""
    try:
        return _ph.verify(hashed, plain)
    except (VerifyMismatchError, VerificationError, InvalidHashError):
        return False


def create_access_token(user_id: str, email: str, role: UserRole) -> str:
    now = datetime.now(timezone.utc)
    payload = {
        "sub": user_id,
        "email": email,
        "role": role.value,
        "jti": str(uuid.uuid4()),
        "iat": now,
        "exp": now + timedelta(minutes=settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES),
        "token_type": "access",
    }
    return jwt.encode(payload, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)


def create_refresh_token(user_id: str, email: str, role: UserRole) -> str:
    now = datetime.now(timezone.utc)
    payload = {
        "sub": user_id,
        "email": email,
        "role": role.value,
        "jti": str(uuid.uuid4()),
        "iat": now,
        "exp": now + timedelta(days=settings.JWT_REFRESH_TOKEN_EXPIRE_DAYS),
        "token_type": "refresh",
    }
    return jwt.encode(payload, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)


def decode_token(token: str, expected_type: str = "access") -> TokenPayload:
    try:
        raw = jwt.decode(
            token,
            settings.JWT_SECRET_KEY,
            algorithms=[settings.JWT_ALGORITHM],
        )
        payload = TokenPayload(
            sub=raw["sub"],
            email=raw["email"],
            role=UserRole(raw["role"]),
            jti=raw["jti"],
            exp=datetime.fromtimestamp(raw["exp"], tz=timezone.utc),
            iat=datetime.fromtimestamp(raw["iat"], tz=timezone.utc),
            token_type=raw["token_type"],
        )
        if payload.token_type != expected_type:
            raise AuthenticationError(f"Expected {expected_type} token")
        return payload
    except JWTError as e:
        logger.warning("jwt_decode_failed", error=str(e))
        raise AuthenticationError("Invalid or expired token")


def require_roles(*roles: UserRole):
    """Dependency factory: raises AuthorizationError if user role not in allowed set."""
    allowed = set(roles)

    def checker(current_role: UserRole) -> None:
        if current_role not in allowed:
            raise AuthorizationError(
                f"Role {current_role.value} is not permitted. Required: {[r.value for r in roles]}"
            )

    return checker
