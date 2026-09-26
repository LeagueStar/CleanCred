import sqlite3
from pathlib import Path

DB_PATH = Path(__file__).resolve().parent / "cleancred.db"

def get_conn():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    conn.execute("PRAGMA journal_mode = WAL")
    return conn

def init_db():
    conn = get_conn()
    conn.executescript("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        role TEXT NOT NULL CHECK(role IN ('citizen','worker','admin')),
        pin_hash TEXT NOT NULL,
        points INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS reports (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        category TEXT NOT NULL,
        image_path TEXT NOT NULL,
        image_sha256 TEXT,
        report_lat REAL NOT NULL,
        report_lon REAL NOT NULL,
        captured_at TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'SUBMITTED',
        qr_token_hash TEXT,
        verification_score REAL,
        risk_level TEXT DEFAULT 'LOW',
        risk_flags TEXT DEFAULT '[]',
        FOREIGN KEY(user_id) REFERENCES users(id)
    );
    CREATE TABLE IF NOT EXISTS ai_verifications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        report_id INTEGER NOT NULL UNIQUE,
        predicted_category TEXT NOT NULL,
        accepted INTEGER NOT NULL,
        confidence REAL,
        explanation TEXT NOT NULL,
        model TEXT NOT NULL,
        verified_at TEXT NOT NULL,
        FOREIGN KEY(report_id) REFERENCES reports(id)
    );
    CREATE TABLE IF NOT EXISTS worker_verifications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        report_id INTEGER NOT NULL UNIQUE,
        worker_id INTEGER NOT NULL,
        segregated INTEGER NOT NULL,
        worker_lat REAL NOT NULL,
        worker_lon REAL NOT NULL,
        distance_m REAL NOT NULL,
        verified_at TEXT NOT NULL,
        FOREIGN KEY(report_id) REFERENCES reports(id),
        FOREIGN KEY(worker_id) REFERENCES users(id)
    );
    CREATE TABLE IF NOT EXISTS collections (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        report_id INTEGER NOT NULL UNIQUE,
        worker_id INTEGER NOT NULL,
        collected_at TEXT NOT NULL,
        qr_used INTEGER NOT NULL DEFAULT 1,
        FOREIGN KEY(report_id) REFERENCES reports(id),
        FOREIGN KEY(worker_id) REFERENCES users(id)
    );
    CREATE TABLE IF NOT EXISTS credit_transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        report_id INTEGER NOT NULL UNIQUE,
        points INTEGER NOT NULL,
        reason TEXT NOT NULL DEFAULT 'VERIFIED_ACTION',
        created_at TEXT NOT NULL,
        FOREIGN KEY(user_id) REFERENCES users(id),
        FOREIGN KEY(report_id) REFERENCES reports(id)
    );
    CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
    CREATE INDEX IF NOT EXISTS idx_reports_location ON reports(report_lat, report_lon);
    CREATE INDEX IF NOT EXISTS idx_reports_image_hash ON reports(image_sha256);
    """)
    # Safe migration for databases created by the earlier demo.
    for sql in [
        "ALTER TABLE reports ADD COLUMN image_sha256 TEXT",
        "ALTER TABLE reports ADD COLUMN verification_score REAL",
        "ALTER TABLE reports ADD COLUMN risk_level TEXT DEFAULT 'LOW'",
        "ALTER TABLE reports ADD COLUMN risk_flags TEXT DEFAULT '[]'",
        "ALTER TABLE credit_transactions ADD COLUMN reason TEXT NOT NULL DEFAULT 'VERIFIED_ACTION'",
    ]:
        try:
            conn.execute(sql)
        except sqlite3.OperationalError:
            pass
    conn.commit()
    conn.close()
