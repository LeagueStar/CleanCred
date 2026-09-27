"""
CleanCred Initial Demo Data Seeder
Ensures the backend database contains realistic, diverse demo records across
all three states: SUBMITTED, READY_FOR_COLLECTION, and COLLECTED.
"""

import os
import sqlite3
import hashlib
from datetime import datetime, timezone, timedelta
from pathlib import Path

DB_PATH = Path(__file__).resolve().parent / "cleancred.db"

def pin_hash(pin: str) -> str:
    return hashlib.pbkdf2_hmac("sha256", pin.encode(), b"cleancred-demo-v3", 150000).hex()

def iso_time(offset_minutes=0):
    dt = datetime.now(timezone.utc) - timedelta(minutes=offset_minutes)
    return dt.isoformat()

def seed_demo_data(conn=None):
    close_when_done = False
    if conn is None:
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row
        close_when_done = True

    cur = conn.cursor()

    # 1. Ensure Standard Demo Users (DemoTester, DemoCollector, DemoAdmin)
    users = [
        (1, "DemoTester", "citizen", pin_hash("1234"), 150, iso_time(120)),
        (2, "DemoCollector", "worker", pin_hash("5678"), 0, iso_time(120)),
        (3, "DemoAdmin", "admin", pin_hash("9999"), 0, iso_time(120))
    ]
    for uid, name, role, phash, pts, created in users:
        cur.execute("""
            INSERT OR IGNORE INTO users(id, name, role, pin_hash, points, created_at)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (uid, name, role, phash, pts, created))

    # Check existing reports count
    count = cur.execute("SELECT COUNT(*) FROM reports").fetchone()[0]
    if count < 4:
        # Seed realistic reports across different lifecycle states
        demo_reports = [
            # 1. SUBMITTED state (Wet waste awaiting worker dispatch)
            {
                "id": 101,
                "user_id": 1,
                "category": "WET",
                "image_path": "uploads/demo_seed_wet.jpg",
                "image_sha256": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
                "report_lat": 19.0620,
                "report_lon": 72.8310,
                "captured_at": iso_time(45),
                "status": "SUBMITTED",
                "qr_token_hash": None,
                "verification_score": None,
                "risk_level": "LOW",
                "risk_flags": "[]"
            },
            # 2. READY_FOR_COLLECTION state (Dry waste verified on digital scale, QR generated)
            {
                "id": 102,
                "user_id": 1,
                "category": "DRY",
                "image_path": "uploads/demo_seed_dry.jpg",
                "image_sha256": "d41d8cd98f00b204e9800998ecf8427e00000000000000000000000000000001",
                "report_lat": 19.0585,
                "report_lon": 72.8280,
                "captured_at": iso_time(30),
                "status": "READY_FOR_COLLECTION",
                "qr_token_hash": hashlib.sha256(b"CLEANCRED_DEMO_QR_102").hexdigest(),
                "verification_score": 100.0,
                "risk_level": "LOW",
                "risk_flags": "[]",
                "ai": {
                    "predicted_category": "DRY",
                    "accepted": 1,
                    "confidence": 0.94,
                    "explanation": "High cardboard and clean paper segregation detected.",
                    "model": "gemini-2.5-flash"
                },
                "worker": {
                    "worker_id": 2,
                    "segregated": 1,
                    "worker_lat": 19.0586,
                    "worker_lon": 72.8281,
                    "distance_m": 14.8,
                    "verified_at": iso_time(15)
                }
            },
            # 3. COLLECTED state (Hazardous e-waste completed, credits awarded)
            {
                "id": 103,
                "user_id": 1,
                "category": "HAZARDOUS",
                "image_path": "uploads/demo_seed_haz.jpg",
                "image_sha256": "d41d8cd98f00b204e9800998ecf8427e00000000000000000000000000000002",
                "report_lat": 19.0560,
                "report_lon": 72.8340,
                "captured_at": iso_time(120),
                "status": "COLLECTED",
                "qr_token_hash": None,
                "verification_score": 90.0,
                "risk_level": "LOW",
                "risk_flags": "[]",
                "ai": {
                    "predicted_category": "HAZARDOUS",
                    "accepted": 1,
                    "confidence": 0.88,
                    "explanation": "Domestic lithium batteries and e-waste identified.",
                    "model": "gemini-2.5-flash"
                },
                "worker": {
                    "worker_id": 2,
                    "segregated": 1,
                    "worker_lat": 19.0561,
                    "worker_lon": 72.8339,
                    "distance_m": 12.0,
                    "verified_at": iso_time(90)
                },
                "collection": {
                    "worker_id": 2,
                    "collected_at": iso_time(85),
                    "qr_used": 1
                },
                "credits": 15
            },
            # 4. COLLECTED state (Dry recyclable plastic bottles completed)
            {
                "id": 104,
                "user_id": 1,
                "category": "DRY",
                "image_path": "uploads/demo_seed_dry2.jpg",
                "image_sha256": "d41d8cd98f00b204e9800998ecf8427e00000000000000000000000000000003",
                "report_lat": 19.0635,
                "report_lon": 72.8250,
                "captured_at": iso_time(180),
                "status": "COLLECTED",
                "qr_token_hash": None,
                "verification_score": 100.0,
                "risk_level": "LOW",
                "risk_flags": "[]",
                "ai": {
                    "predicted_category": "DRY",
                    "accepted": 1,
                    "confidence": 0.96,
                    "explanation": "Crushed PET bottles sorted and segregated.",
                    "model": "gemini-2.5-flash"
                },
                "worker": {
                    "worker_id": 2,
                    "segregated": 1,
                    "worker_lat": 19.0636,
                    "worker_lon": 72.8251,
                    "distance_m": 13.5,
                    "verified_at": iso_time(150)
                },
                "collection": {
                    "worker_id": 2,
                    "collected_at": iso_time(145),
                    "qr_used": 1
                },
                "credits": 13
            }
        ]

        for r in demo_reports:
            cur.execute("""
                INSERT OR IGNORE INTO reports(id, user_id, category, image_path, image_sha256, report_lat, report_lon, captured_at, status, qr_token_hash, verification_score, risk_level, risk_flags)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                r["id"], r["user_id"], r["category"], r["image_path"], r["image_sha256"],
                r["report_lat"], r["report_lon"], r["captured_at"], r["status"],
                r["qr_token_hash"], r["verification_score"], r["risk_level"], r["risk_flags"]
            ))

            if "ai" in r:
                ai = r["ai"]
                cur.execute("""
                    INSERT OR IGNORE INTO ai_verifications(report_id, predicted_category, accepted, confidence, explanation, model, verified_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                """, (r["id"], ai["predicted_category"], ai["accepted"], ai["confidence"], ai["explanation"], ai["model"], r["captured_at"]))

            if "worker" in r:
                w = r["worker"]
                cur.execute("""
                    INSERT OR IGNORE INTO worker_verifications(report_id, worker_id, segregated, worker_lat, worker_lon, distance_m, verified_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                """, (r["id"], w["worker_id"], w["segregated"], w["worker_lat"], w["worker_lon"], w["distance_m"], w["verified_at"]))

            if "collection" in r:
                col = r["collection"]
                cur.execute("""
                    INSERT OR IGNORE INTO collections(report_id, worker_id, collected_at, qr_used)
                    VALUES (?, ?, ?, ?)
                """, (r["id"], col["worker_id"], col["collected_at"], col["qr_used"]))

            if "credits" in r:
                cur.execute("""
                    INSERT OR IGNORE INTO credit_transactions(user_id, report_id, points, reason, created_at)
                    VALUES (?, ?, ?, ?, ?)
                """, (r["user_id"], r["id"], r["credits"], "VERIFIED_COLLECTION", r["captured_at"]))

        conn.commit()

    if close_when_done:
        conn.close()

if __name__ == "__main__":
    seed_demo_data()
    print("Seed demo data verified successfully.")
