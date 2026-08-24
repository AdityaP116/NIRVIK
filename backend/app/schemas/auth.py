"""
NIRVIK Backend — Auth Schemas
"""
from __future__ import annotations

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr

from app.core.security import UserRole


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int  # seconds


class RefreshRequest(BaseModel):
    refresh_token: str


class UserResponse(BaseModel):
    id: str
    email: str
    full_name: str
    role: UserRole
    officer_id: Optional[str] = None
    department: Optional[str] = None
    is_active: bool
    last_login: Optional[datetime] = None
    created_at: datetime


class CreateUserRequest(BaseModel):
    email: EmailStr
    full_name: str
    password: str
    role: UserRole
    officer_id: Optional[str] = None
    department: Optional[str] = None
    badge_number: Optional[str] = None
