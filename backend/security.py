"""
CleanCred Cryptographic & Security Utilities
Handles high-entropy one-time QR token generation, constant-time HMAC hash
verification, and SHA-256 binary content digests for anti-fraud evidence deduplication.
"""

import hashlib
import hmac
import secrets

def make_qr_token() -> str:
    """
    Generate a cryptographically secure, URL-safe random token for one-time physical handover verification.

    Returns:
        str: 32-byte URL-safe base64 token string (minimum 43 characters).
    """
    return secrets.token_urlsafe(32)

def hash_token(token: str) -> str:
    """
    Compute standard SHA-256 hexadecimal digest for storing QR token hashes at rest.

    Args:
        token (str): The raw plaintext token.

    Returns:
        str: 64-character lowercase hex digest.
    """
    return hashlib.sha256(token.encode("utf-8")).hexdigest()

def token_matches(raw: str, stored_hash: str) -> bool:
    """
    Verify whether a raw candidate token matches the stored cryptographic hash using constant-time comparison.

    Args:
        raw (str): The candidate raw token presented by the collector or scanner.
        stored_hash (str): The SHA-256 digest previously saved on the report record.

    Returns:
        bool: True if digests match exactly; False otherwise.
    """
    return hmac.compare_digest(hash_token(raw), stored_hash)

def sha256_bytes(data: bytes) -> str:
    """
    Compute SHA-256 hex digest for binary data buffers (e.g. uploaded waste photos) to detect duplicate evidence.

    Args:
        data (bytes): Raw binary byte stream.

    Returns:
        str: 64-character lowercase hex digest.
    """
    return hashlib.sha256(data).hexdigest()

