import hashlib
import hmac
import secrets

def make_qr_token():
    return secrets.token_urlsafe(32)

def hash_token(token: str) -> str:
    return hashlib.sha256(token.encode("utf-8")).hexdigest()

def token_matches(raw: str, stored_hash: str) -> bool:
    return hmac.compare_digest(hash_token(raw), stored_hash)

def sha256_bytes(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()
