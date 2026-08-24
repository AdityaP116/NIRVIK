"""
NIRVIK Backend — Auth Service
"""
from __future__ import annotations

from datetime import datetime, timezone
from typing import Optional

from app.core.config import settings
from app.core.exceptions import AuthenticationError, ConflictError, NotFoundError
from app.core.logging import get_logger
from app.core.security import (
    UserRole, create_access_token, create_refresh_token,
    decode_token, hash_password, verify_password,
)
from app.repositories.user_repository import UserRepository
from app.schemas.auth import LoginRequest, TokenResponse, UserResponse, CreateUserRequest

logger = get_logger(__name__)


class AuthService:
    def __init__(self) -> None:
        self._repo = UserRepository()

    async def login(self, request: LoginRequest) -> TokenResponse:
        user = await self._repo.find_by_email(request.email.lower())
        if not user:
            raise AuthenticationError("Invalid email or password")
        if not user.get("is_active", True):
            raise AuthenticationError("Account is deactivated")
        if not verify_password(request.password, user["password_hash"]):
            raise AuthenticationError("Invalid email or password")

        await self._repo.set_last_login(user["_id"])
        role = UserRole(user["role"])
        access_token = create_access_token(str(user["_id"]), user["email"], role)
        refresh_token = create_refresh_token(str(user["_id"]), user["email"], role)
        logger.info("user_login", user_id=str(user["_id"]), email=user["email"])
        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            expires_in=settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        )

    async def refresh(self, refresh_token: str) -> TokenResponse:
        payload = decode_token(refresh_token, expected_type="refresh")
        user = await self._repo.find_by_id(payload.sub)
        if not user or not user.get("is_active", True):
            raise AuthenticationError("User not found or deactivated")

        role = UserRole(user["role"])
        access_token = create_access_token(payload.sub, payload.email, role)
        new_refresh = create_refresh_token(payload.sub, payload.email, role)
        return TokenResponse(
            access_token=access_token,
            refresh_token=new_refresh,
            expires_in=settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        )

    async def get_me(self, user_id: str) -> UserResponse:
        user = await self._repo.find_by_id(user_id)
        if not user:
            raise NotFoundError("User", user_id)
        return self._to_response(user)

    async def create_user(self, request: CreateUserRequest) -> UserResponse:
        existing = await self._repo.find_by_email(request.email.lower())
        if existing:
            raise ConflictError(f"User with email {request.email} already exists")

        doc = {
            "email": request.email.lower(),
            "full_name": request.full_name,
            "role": request.role.value,
            "password_hash": hash_password(request.password),
            "officer_id": request.officer_id,
            "department": request.department,
            "badge_number": request.badge_number,
            "is_active": True,
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc),
        }
        user_id = await self._repo.insert_one(doc)
        doc["_id"] = user_id
        logger.info("user_created", user_id=user_id, email=request.email)
        return self._to_response(doc)

    @staticmethod
    def _to_response(user: dict) -> UserResponse:
        return UserResponse(
            id=str(user["_id"]),
            email=user["email"],
            full_name=user["full_name"],
            role=UserRole(user["role"]),
            officer_id=user.get("officer_id"),
            department=user.get("department"),
            is_active=user.get("is_active", True),
            last_login=user.get("last_login"),
            created_at=user["created_at"],
        )
