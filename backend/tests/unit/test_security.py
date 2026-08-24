"""
NIRVIK Backend — Security & Auth Unit Tests
"""
import pytest
from app.core.security import (
    UserRole, create_access_token, create_refresh_token, decode_token,
    hash_password, verify_password,
)


def test_password_hashing():
    plain = "SuperSecretPassword123!"
    hashed = hash_password(plain)
    assert hashed != plain
    assert verify_password(plain, hashed) is True
    assert verify_password("WrongPassword!", hashed) is False


def test_jwt_access_token():
    token = create_access_token("user_123", "officer@nirvik.gov.in", UserRole.INVESTIGATOR)
    assert isinstance(token, str)

    payload = decode_token(token, expected_type="access")
    assert payload.sub == "user_123"
    assert payload.email == "officer@nirvik.gov.in"
    assert payload.role == UserRole.INVESTIGATOR


def test_jwt_refresh_token():
    token = create_refresh_token("user_123", "officer@nirvik.gov.in", UserRole.ADMIN)
    payload = decode_token(token, expected_type="refresh")
    assert payload.sub == "user_123"
    assert payload.token_type == "refresh"
