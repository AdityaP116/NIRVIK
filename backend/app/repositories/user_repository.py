"""
NIRVIK Backend — User Repository
"""
from __future__ import annotations

from typing import Optional

from app.repositories.base import BaseRepository


class UserRepository(BaseRepository):
    def __init__(self) -> None:
        super().__init__("users")

    async def find_by_email(self, email: str):
        return await self.find_one({"email": email.lower()})

    async def find_by_officer_id(self, officer_id: str):
        return await self.find_one({"officer_id": officer_id})

    async def set_last_login(self, user_id: str) -> None:
        from datetime import datetime, timezone
        await self.update_by_id(user_id, {"last_login": datetime.now(timezone.utc)})
