"""
NIRVIK Backend — Storage Interface
Abstract base class for object storage (MinIO, S3, GCS, etc.)
Swap provider by implementing this interface.
"""
from __future__ import annotations

from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import BinaryIO, Optional


@dataclass
class StorageMetadata:
    storage_key: str
    bucket: str
    size: int
    content_type: str
    etag: str
    url: Optional[str] = None


class StorageInterface(ABC):
    """Abstract object storage interface. Implementations: MinIO, S3."""

    @abstractmethod
    async def upload(
        self,
        key: str,
        data: BinaryIO,
        size: int,
        content_type: str = "application/octet-stream",
    ) -> StorageMetadata:
        """Upload a file and return storage metadata."""
        ...

    @abstractmethod
    async def download(self, key: str) -> bytes:
        """Download a file and return raw bytes."""
        ...

    @abstractmethod
    async def delete(self, key: str) -> bool:
        """Delete a file. Returns True if deleted."""
        ...

    @abstractmethod
    async def exists(self, key: str) -> bool:
        """Check if a file exists."""
        ...

    @abstractmethod
    async def get_metadata(self, key: str) -> Optional[StorageMetadata]:
        """Get metadata without downloading the file."""
        ...

    @abstractmethod
    async def get_presigned_url(self, key: str, expires_seconds: int = 3600) -> str:
        """Generate a pre-signed download URL."""
        ...

    @abstractmethod
    async def ping(self) -> bool:
        """Health check — returns True if storage is reachable."""
        ...
