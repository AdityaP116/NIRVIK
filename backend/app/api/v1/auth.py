"""
NIRVIK Backend — Auth API Router
"""
from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends, status

from app.core.dependencies import get_current_user, require_role
from app.core.security import TokenPayload, UserRole
from app.schemas.auth import (
    CreateUserRequest, LoginRequest, RefreshRequest, TokenResponse, UserResponse,
)
from app.services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["Authentication"])
auth_service = AuthService()


@router.post("/login", response_model=TokenResponse)
async def login(request: LoginRequest):
    return await auth_service.login(request)


@router.post("/refresh", response_model=TokenResponse)
async def refresh(request: RefreshRequest):
    return await auth_service.refresh(request.refresh_token)


@router.get("/me", response_model=UserResponse)
async def get_me(user: Annotated[TokenPayload, Depends(get_current_user)]):
    return await auth_service.get_me(user.sub)


@router.post(
    "/users",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(require_role(UserRole.ADMIN))],
)
async def create_user(request: CreateUserRequest):
    return await auth_service.create_user(request)
