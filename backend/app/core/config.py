"""
NIRVIK Backend — Core Configuration
All settings are loaded from environment variables / .env file.
No secrets are hardcoded.
"""
from __future__ import annotations

from functools import lru_cache
from typing import List, Literal

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # ── Application ──────────────────────────────────────────────────────────
    APP_ENV: Literal["development", "staging", "production"] = "development"
    APP_DEBUG: bool = False
    APP_SECRET_KEY: str = Field(default="development_app_secret_key_minimum_32_bytes", min_length=32)
    APP_TITLE: str = "NIRVIK Intelligence Platform"
    APP_VERSION: str = "0.1.0"
    ALLOWED_ORIGINS: str = "http://localhost:3000,http://localhost:5173"

    @property
    def cors_origins(self) -> List[str]:
        return [o.strip() for o in self.ALLOWED_ORIGINS.split(",") if o.strip()]

    # ── JWT ──────────────────────────────────────────────────────────────────
    JWT_SECRET_KEY: str = Field(default="development_jwt_secret_key_minimum_64_bytes_long_secret_key_for_testing", min_length=32)
    JWT_ALGORITHM: str = "HS256"
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    JWT_REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # ── MongoDB ───────────────────────────────────────────────────────────────
    MONGODB_URI: str = "mongodb://localhost:27017"
    MONGODB_DATABASE: str = "nirvik"

    # ── Neo4j ────────────────────────────────────────────────────────────────
    NEO4J_URI: str = "bolt://localhost:7687"
    NEO4J_USER: str = "neo4j"
    NEO4J_PASSWORD: str = Field(default="password")
    NEO4J_DATABASE: str = "neo4j"

    # ── Redis ────────────────────────────────────────────────────────────────
    REDIS_URL: str = "redis://localhost:6379/0"

    # ── MinIO / S3 Object Storage ─────────────────────────────────────────────
    MINIO_ENDPOINT: str = "localhost:9000"
    MINIO_ACCESS_KEY: str = "minioadmin"
    MINIO_SECRET_KEY: str = "minioadmin"
    MINIO_BUCKET: str = "nirvik-evidence"
    MINIO_SECURE: bool = False

    # ── Hyperledger Fabric ────────────────────────────────────────────────────
    FABRIC_MODE: Literal["mock", "real", "unavailable"] = "mock"
    FABRIC_PEER_ENDPOINT: str = ""
    FABRIC_TLS_CERT_PATH: str = ""
    FABRIC_CHANNEL_NAME: str = "nirvik-channel"
    FABRIC_CHAINCODE_NAME: str = "nirvik-evidence"

    # ── LLM / AI Assistant ────────────────────────────────────────────────────
    LLM_PROVIDER: Literal["openai", "gemini", "local", "mock"] = "mock"
    OPENAI_API_KEY: str = ""
    GEMINI_API_KEY: str = ""
    LLM_MODEL: str = "gpt-4o-mini"
    LLM_MAX_TOKENS: int = 1024

    # ── Celery ────────────────────────────────────────────────────────────────
    CELERY_BROKER_URL: str = "redis://localhost:6379/1"
    CELERY_RESULT_BACKEND: str = "redis://localhost:6379/2"

    # ── NLP ───────────────────────────────────────────────────────────────────
    SPACY_MODEL: str = "en_core_web_sm"
    NLP_USE_TRANSFORMERS: bool = False
    NLP_TRANSFORMER_FALLBACK: bool = True

    # ── Logging ───────────────────────────────────────────────────────────────
    LOG_LEVEL: str = "INFO"
    LOG_FORMAT: Literal["json", "text"] = "json"

    # ── Derived helpers ───────────────────────────────────────────────────────
    @property
    def is_production(self) -> bool:
        return self.APP_ENV == "production"

    @property
    def is_development(self) -> bool:
        return self.APP_ENV == "development"


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
