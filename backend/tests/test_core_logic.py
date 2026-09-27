"""
CleanCred Backend Pure-Logic Unit Test Suite
Fast, sub-second unit tests verifying cryptographic, geospatial,
risk-scoring, and fraud-detection invariants without a running server.
"""

import sys
import hashlib
from pathlib import Path

# Add backend directory to sys.path so modules can be imported directly
BACKEND_DIR = Path(__file__).resolve().parent.parent
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from geo import haversine_m
from security import make_qr_token, hash_token, token_matches, sha256_bytes
from main import risk_and_score, GPS_RADIUS


# ==============================================================================
# 1. GEOSPATIAL (Haversine Distance) Tests
# ==============================================================================

def test_haversine_same_point():
    """Distance between identical coordinates must be exactly 0 meters."""
    dist = haversine_m(19.0760, 72.8777, 19.0760, 72.8777)
    assert round(dist, 4) == 0.0


def test_haversine_known_offset():
    """
    1 degree of latitude is approximately 111.139 km (111,139 m).
    A 0.0001 deg lat shift (~11.1 meters) should be calculated accurately.
    """
    dist = haversine_m(19.0760, 72.8777, 19.0761, 72.8777)
    assert 10.0 < dist < 12.5


def test_haversine_gps_radius_threshold():
    """
    Ensure points within 50m radius are recognized as within threshold,
    and points beyond are strictly recognized as exceeding threshold.
    """
    # 0.0003 deg latitude at Mumbai latitude is ~33.3 meters (<= GPS_RADIUS 50m)
    dist_close = haversine_m(19.0760, 72.8777, 19.0763, 72.8777)
    assert dist_close <= GPS_RADIUS

    # 0.001 deg latitude is ~111 meters (> GPS_RADIUS 50m)
    dist_far = haversine_m(19.0760, 72.8777, 19.0770, 72.8777)
    assert dist_far > GPS_RADIUS


# ==============================================================================
# 2. FRAUD RULES & RISK SCORING Tests
# ==============================================================================

def test_risk_and_score_perfect_verification():
    """
    Optimal submission:
    - AI accepted (+40)
    - AI confidence >= 0.85 (+10)
    - Distance <= GPS_RADIUS (+30)
    - Duplicate count == 0 (+20)
    Total = 100, Level = LOW, Flags = []
    """
    report = {"id": 1, "category": "DRY"}
    ai = {"accepted": 1, "confidence": 0.95, "predicted_category": "DRY"}
    score, level, flags = risk_and_score(report, ai, distance=12.5, duplicate_count=0)

    assert score == 100
    assert level == "LOW"
    assert flags == []


def test_risk_and_score_ai_moderate_confidence():
    """
    AI accepted (+40), but confidence 0.75 (< 0.85, +0), distance within gate (+30),
    0 duplicates (+20) -> Score = 90, Level = LOW, Flags = []
    """
    report = {"id": 2, "category": "WET"}
    ai = {"accepted": 1, "confidence": 0.75, "predicted_category": "WET"}
    score, level, flags = risk_and_score(report, ai, distance=25.0, duplicate_count=0)

    assert score == 90
    assert level == "LOW"
    assert flags == []


def test_risk_and_score_gps_mismatch_flag():
    """
    When worker distance exceeds GPS_RADIUS:
    - Distance bonus (+0)
    - GPS_MISMATCH flag added
    """
    report = {"id": 3, "category": "DRY"}
    ai = {"accepted": 1, "confidence": 0.90, "predicted_category": "DRY"}
    score, level, flags = risk_and_score(report, ai, distance=85.0, duplicate_count=0)

    assert score == 70  # 40 + 10 + 20
    assert level == "MEDIUM"
    assert "GPS_MISMATCH" in flags


def test_risk_and_score_duplicate_pattern_flag():
    """
    When duplicate count > 0:
    - Duplicate bonus (+0)
    - DUPLICATE_PATTERN flag added
    """
    report = {"id": 4, "category": "HAZARDOUS"}
    ai = {"accepted": 1, "confidence": 0.92, "predicted_category": "HAZARDOUS"}
    score, level, flags = risk_and_score(report, ai, distance=10.0, duplicate_count=1)

    assert score == 80  # 40 + 10 + 30
    assert level == "MEDIUM"
    assert "DUPLICATE_PATTERN" in flags


def test_risk_and_score_all_flags_high_risk():
    """
    Worst-case scenario:
    - AI uncertain / rejected (+0)
    - Distance > GPS_RADIUS (+0)
    - Duplicate detected (+0)
    Total = 0, Level = HIGH, all 3 flags present.
    """
    report = {"id": 5, "category": "HAZARDOUS"}
    ai = {"accepted": 0, "confidence": 0.35, "predicted_category": "UNKNOWN"}
    score, level, flags = risk_and_score(report, ai, distance=250.0, duplicate_count=2)

    assert score == 0
    assert level == "HIGH"
    assert set(flags) == {"AI_UNCERTAIN", "GPS_MISMATCH", "DUPLICATE_PATTERN"}


# ==============================================================================
# 3. CRYPTOGRAPHIC & DUPLICATE HASH Tests
# ==============================================================================

def test_sha256_bytes_consistency():
    """Ensure sha256_bytes computes standard hex SHA-256 for binary payloads."""
    payload = b"CleanCred verified waste proof SIH 2026"
    expected = hashlib.sha256(payload).hexdigest()
    assert sha256_bytes(payload) == expected
    assert len(sha256_bytes(payload)) == 64


def test_sha256_bytes_distinct():
    """Distinct byte streams must yield distinct cryptographic hashes."""
    hash1 = sha256_bytes(b"image_evidence_packet_1")
    hash2 = sha256_bytes(b"image_evidence_packet_2")
    assert hash1 != hash2


# ==============================================================================
# 4. ONE-TIME QR TOKEN & HASH MATCHING Tests
# ==============================================================================

def test_qr_token_generation():
    """Generated QR tokens must be URL-safe strings with high entropy."""
    token1 = make_qr_token()
    token2 = make_qr_token()

    assert isinstance(token1, str)
    assert len(token1) >= 40
    assert token1 != token2


def test_qr_token_hashing_and_matching():
    """
    Hash comparison must use constant-time verification,
    returning True for matching raw token and False for tampered token.
    """
    token = make_qr_token()
    hashed = hash_token(token)

    assert isinstance(hashed, str)
    assert len(hashed) == 64
    assert token_matches(token, hashed) is True
    assert token_matches(token + "_tampered", hashed) is False
    assert token_matches("wrong_token_entirely", hashed) is False
