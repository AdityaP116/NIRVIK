"""
NIRVIK Backend — MinIO Storage Implementation
S3-compatible; can be replaced with AWS S3 by swapping credentials/endpoint.
"""
from __future__ import annotations

import asyncio
import io
from typing import BinaryIO, Optional

from minio import Minio
from minio.error import S3Error

from app.core.config import settings
from app.core.logging import get_logger
from app.integrations.storage.interface import StorageInterface, StorageMetadata

logger = get_logger(__name__)


class MinIOStorage(StorageInterface):
    def __init__(self) -> None:
        self._client = Minio(
            endpoint=settings.MINIO_ENDPOINT,
            access_key=settings.MINIO_ACCESS_KEY,
            secret_key=settings.MINIO_SECRET_KEY,
            secure=settings.MINIO_SECURE,
        )
        self._bucket = settings.MINIO_BUCKET

    async def _ensure_bucket(self) -> None:
        loop = asyncio.get_event_loop()
        exists = await loop.run_in_executor(
            None, self._client.bucket_exists, self._bucket
        )
        if not exists:
            await loop.run_in_executor(
                None, self._client.make_bucket, self._bucket
            )
            logger.info("minio_bucket_created", bucket=self._bucket)

    async def upload(
        self,
        key: str,
        data: BinaryIO,
        size: int,
        content_type: str = "application/octet-stream",
    ) -> StorageMetadata:
        await self._ensure_bucket()
        loop = asyncio.get_event_loop()
        result = await loop.run_in_executor(
            None,
            lambda: self._client.put_object(
                self._bucket, key, data, size, content_type=content_type
            ),
        )
        logger.info("minio_upload", key=key, size=size)
        return StorageMetadata(
            storage_key=key,
            bucket=self._bucket,
            size=size,
            content_type=content_type,
            etag=result.etag,
        )

    async def download(self, key: str) -> bytes:
        loop = asyncio.get_event_loop()
        response = await loop.run_in_executor(
            None, lambda: self._client.get_object(self._bucket, key)
        )
        try:
            return response.read()
        finally:
            response.close()
            response.release_conn()

    async def delete(self, key: str) -> bool:
        loop = asyncio.get_event_loop()
        try:
            await loop.run_in_executor(
                None, lambda: self._client.remove_object(self._bucket, key)
            )
            return True
        except S3Error:
            return False

    async def exists(self, key: str) -> bool:
        loop = asyncio.get_event_loop()
        try:
            await loop.run_in_executor(
                None, lambda: self._client.stat_object(self._bucket, key)
            )
            return True
        except S3Error:
            return False

    async def get_metadata(self, key: str) -> Optional[StorageMetadata]:
        loop = asyncio.get_event_loop()
        try:
            stat = await loop.run_in_executor(
                None, lambda: self._client.stat_object(self._bucket, key)
            )
            return StorageMetadata(
                storage_key=key,
                bucket=self._bucket,
                size=stat.size,
                content_type=stat.content_type or "application/octet-stream",
                etag=stat.etag,
            )
        except S3Error:
            return None

    async def get_presigned_url(self, key: str, expires_seconds: int = 3600) -> str:
        from datetime import timedelta
        loop = asyncio.get_event_loop()
        url = await loop.run_in_executor(
            None,
            lambda: self._client.presigned_get_object(
                self._bucket, key, expires=timedelta(seconds=expires_seconds)
            ),
        )
        return url

    async def ping(self) -> bool:
        try:
            loop = asyncio.get_event_loop()
            await loop.run_in_executor(None, self._client.list_buckets)
            return True
        except Exception:
            return False


# Singleton
_storage_instance: MinIOStorage | None = None


def get_storage() -> MinIOStorage:
    global _storage_instance
    if _storage_instance is None:
        _storage_instance = MinIOStorage()
    return _storage_instance
