"""
CleanCred Phase 2 End-to-End Verification Test Script
Tests the full lifecycle of the merged system:
1. Health and demo mode check
2. Role-based PIN authentication (Citizen, Worker, Admin)
3. Citizen report creation with image evidence
4. SHA-256 duplicate evidence hard rejection (409)
5. Citizen GET /reports/mine with citizen Bearer auth
6. Worker GPS gate rejection >50m on /verify (403)
7. Worker on-site verification & AI evaluation (200, one-time QR token issued)
8. Worker GPS gate rejection >50m on /collect (403)
9. Forged QR token rejection on /collect (403)
10. Valid QR token collection on-site (200, credits awarded, status COLLECTED)
11. QR token replay / reuse attack rejection (409)
12. Citizen wallet ledger sync & points balance
13. Admin analytics & live metrics
14. Public leaderboard
"""

import sys
import io
import time
import requests
from PIL import Image

BASE_URL = "http://127.0.0.1:8000"

def log(msg, ok=True):
    symbol = "PASS" if ok else "FAIL"
    print(f"[{symbol}] {msg}")

def fail(msg):
    log(msg, ok=False)
    sys.exit(1)

def create_test_image(color=(34, 197, 94), text_seed=None):
    img = Image.new("RGB", (100, 100), color=color)
    if text_seed:
        # modify a pixel to guarantee unique hash
        img.putpixel((0, 0), (text_seed % 256, (text_seed * 7) % 256, (text_seed * 13) % 256))
    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    return buf.getvalue()

def main():
    print("=" * 60)
    print("CleanCred Phase 2: Full System Verification Test")
    print("=" * 60)

    # 1. Health check
    try:
        r = requests.get(f"{BASE_URL}/health", timeout=5)
        assert r.status_code == 200, f"Health status {r.status_code}"
        data = r.json()
        assert data.get("ok") is True
        log(f"Backend health OK (version {data.get('version')}, demo_ai={data.get('demo_ai')})")
    except Exception as e:
        fail(f"Health check failed: {e}")

    # 2. Authentication
    # Citizen login
    r_cit = requests.post(f"{BASE_URL}/auth/login", json={"user_id": 1, "pin": "1234"})
    if r_cit.status_code == 401 or r_cit.status_code == 404:
        # seed if needed
        requests.post(f"{BASE_URL}/users", json={"name": "DemoTester", "role": "citizen", "pin": "1234"})
        r_cit = requests.post(f"{BASE_URL}/auth/login", json={"user_id": 1, "pin": "1234"})
    assert r_cit.status_code == 200, f"Citizen login failed: {r_cit.text}"
    citizen_token = r_cit.json()["access_token"]
    citizen_headers = {"Authorization": f"Bearer {citizen_token}"}
    log("Citizen PIN authentication succeeded")

    # Worker login
    r_wrk = requests.post(f"{BASE_URL}/auth/login", json={"user_id": 2, "pin": "5678"})
    if r_wrk.status_code == 401 or r_wrk.status_code == 404:
        requests.post(f"{BASE_URL}/users", json={"name": "Ramesh Kumar", "role": "worker", "pin": "5678"})
        r_wrk = requests.post(f"{BASE_URL}/auth/login", json={"user_id": 2, "pin": "5678"})
    assert r_wrk.status_code == 200, f"Worker login failed: {r_wrk.text}"
    worker_token = r_wrk.json()["access_token"]
    worker_headers = {"Authorization": f"Bearer {worker_token}"}
    log("Worker PIN authentication succeeded")

    # Admin login
    r_adm = requests.post(f"{BASE_URL}/auth/login", json={"user_id": 3, "pin": "9999"})
    if r_adm.status_code == 401 or r_adm.status_code == 404:
        requests.post(f"{BASE_URL}/users", json={"name": "Admin Office", "role": "admin", "pin": "9999"})
        r_adm = requests.post(f"{BASE_URL}/auth/login", json={"user_id": 3, "pin": "9999"})
    assert r_adm.status_code == 200, f"Admin login failed: {r_adm.text}"
    admin_token = r_adm.json()["access_token"]
    admin_headers = {"Authorization": f"Bearer {admin_token}"}
    log("Admin PIN authentication succeeded")

    # Wrong PIN check
    r_bad = requests.post(f"{BASE_URL}/auth/login", json={"user_id": 1, "pin": "0000"})
    assert r_bad.status_code == 401, "Wrong PIN should return 401"
    log("Invalid PIN rejection check passed (401)")

    # 3. Report Submission
    unique_seed = int(time.time() * 1000) % 100000
    img_data = create_test_image(color=(16, 185, 129), text_seed=unique_seed)
    report_lat, report_lon = 19.0760, 72.8777

    files = {"image": ("test_evidence.jpg", img_data, "image/jpeg")}
    data = {"category": "DRY", "latitude": str(report_lat), "longitude": str(report_lon)}
    r_rep = requests.post(f"{BASE_URL}/reports", headers=citizen_headers, data=data, files=files)
    assert r_rep.status_code == 200, f"Create report failed: {r_rep.text}"
    report_id = r_rep.json()["report_id"]
    log(f"Report #{report_id} created with SHA-256 evidence hash")

    # 4. Duplicate Evidence Rejection (409)
    files_dup = {"image": ("test_evidence.jpg", img_data, "image/jpeg")}
    r_dup = requests.post(f"{BASE_URL}/reports", headers=citizen_headers, data=data, files=files_dup)
    assert r_dup.status_code == 409, f"Duplicate image should return 409, got {r_dup.status_code}: {r_dup.text}"
    assert "Duplicate evidence detected" in r_dup.text
    log("Duplicate evidence hard rejection passed (409 Conflict)")

    # 5. GET /reports/mine (Citizen Auth)
    r_mine = requests.get(f"{BASE_URL}/reports/mine", headers=citizen_headers)
    assert r_mine.status_code == 200, f"GET /reports/mine failed: {r_mine.text}"
    mine_list = r_mine.json()
    assert any(r["id"] == report_id for r in mine_list), f"Report #{report_id} not found in /reports/mine"
    log(f"GET /reports/mine returned citizen's reports (found #{report_id})")

    # Unauthenticated /reports/mine check
    r_unauth = requests.get(f"{BASE_URL}/reports/mine")
    assert r_unauth.status_code == 401, "Unauthenticated /reports/mine should return 401"
    log("GET /reports/mine unauthenticated gate passed (401)")

    # 6. Worker GPS Gate Rejection on /verify (>50m)
    distant_lat, distant_lon = 19.0800, 72.8800 # ~500m away
    verify_bad_gps = {
        "report_id": report_id,
        "segregated": True,
        "worker_lat": distant_lat,
        "worker_lon": distant_lon
    }
    r_vbad = requests.post(f"{BASE_URL}/verify", headers=worker_headers, json=verify_bad_gps)
    assert r_vbad.status_code == 403, f"Distant verify should return 403, got {r_vbad.status_code}: {r_vbad.text}"
    assert "GPS gate failed" in r_vbad.text
    log("Worker verification GPS gate (>50m) rejection passed (403 Forbidden)")

    # 7. Worker Verification on-site (<=50m)
    verify_good = {
        "report_id": report_id,
        "segregated": True,
        "worker_lat": report_lat,
        "worker_lon": report_lon
    }
    r_vgood = requests.post(f"{BASE_URL}/verify", headers=worker_headers, json=verify_good)
    assert r_vgood.status_code == 200, f"Verify failed: {r_vgood.text}"
    v_data = r_vgood.json()
    assert v_data.get("status") == "READY_FOR_COLLECTION"
    qr_token = v_data.get("qr_token")
    assert qr_token and len(qr_token) >= 10, f"Invalid qr_token: {qr_token}"
    assert "verification_score" in v_data
    log(f"Worker verification succeeded: score={v_data['verification_score']}, risk={v_data['risk_level']}, qr_token generated")

    # 8. Worker GPS Gate Rejection on /collect (>50m)
    collect_bad_gps = {
        "report_id": report_id,
        "qr_token": qr_token,
        "worker_lat": distant_lat,
        "worker_lon": distant_lon
    }
    r_cbad_gps = requests.post(f"{BASE_URL}/collect", headers=worker_headers, json=collect_bad_gps)
    assert r_cbad_gps.status_code == 403, f"Distant collect should return 403, got {r_cbad_gps.status_code}: {r_cbad_gps.text}"
    assert "GPS gate failed" in r_cbad_gps.text
    log("Worker collection GPS gate (>50m) rejection passed (403 Forbidden)")

    # 9. Forged / Invalid QR Token Rejection on /collect
    collect_bad_token = {
        "report_id": report_id,
        "qr_token": "FORGED_QR_TOKEN_ABC123",
        "worker_lat": report_lat,
        "worker_lon": report_lon
    }
    r_cbad_tok = requests.post(f"{BASE_URL}/collect", headers=worker_headers, json=collect_bad_token)
    assert r_cbad_tok.status_code == 403, f"Forged token should return 403, got {r_cbad_tok.status_code}: {r_cbad_tok.text}"
    assert "Invalid one-time QR token" in r_cbad_tok.text
    log("Invalid one-time QR token rejection passed (403 Forbidden)")

    # 10. Valid QR Token Collection on-site (200)
    collect_good = {
        "report_id": report_id,
        "qr_token": qr_token,
        "worker_lat": report_lat,
        "worker_lon": report_lon
    }
    r_cgood = requests.post(f"{BASE_URL}/collect", headers=worker_headers, json=collect_good)
    assert r_cgood.status_code == 200, f"Collection failed: {r_cgood.text}"
    c_data = r_cgood.json()
    assert c_data.get("status") == "COLLECTED"
    credits_awarded = c_data.get("credits_awarded")
    assert credits_awarded > 0, f"Expected credits awarded, got {credits_awarded}"
    log(f"Waste collected successfully: +{credits_awarded} credits awarded to citizen")

    # 11. Replay / Reuse Attack Rejection (409)
    r_creplay = requests.post(f"{BASE_URL}/collect", headers=worker_headers, json=collect_good)
    assert r_creplay.status_code == 409, f"Replayed token should return 409, got {r_creplay.status_code}: {r_creplay.text}"
    assert "already been consumed" in r_creplay.text
    log("One-time QR replay attack rejection passed (409 Conflict)")

    # 12. Citizen Wallet & Ledger
    r_wal = requests.get(f"{BASE_URL}/wallet/1", headers=citizen_headers)
    assert r_wal.status_code == 200, f"Wallet fetch failed: {r_wal.text}"
    wal_data = r_wal.json()
    assert wal_data["user"]["points"] >= credits_awarded
    tx_reports = [t["report_id"] for t in wal_data.get("transactions", [])]
    assert report_id in tx_reports, f"Transaction for report #{report_id} missing from wallet"
    log(f"Citizen wallet verified: balance={wal_data['user']['points']} credits, transaction logged")

    # 13. Admin Analytics
    r_ana = requests.get(f"{BASE_URL}/analytics", headers=admin_headers)
    assert r_ana.status_code == 200, f"Analytics fetch failed: {r_ana.text}"
    ana_data = r_ana.json()
    assert ana_data["totals"]["reports"] >= 1
    assert ana_data["totals"]["collected"] >= 1
    assert ana_data["totals"]["credits"] >= credits_awarded
    log(f"Admin analytics verified: total_reports={ana_data['totals']['reports']}, collected={ana_data['totals']['collected']}")

    # 14. Public Leaderboard
    r_lead = requests.get(f"{BASE_URL}/leaderboard")
    assert r_lead.status_code == 200, f"Leaderboard fetch failed: {r_lead.text}"
    lead_data = r_lead.json()
    assert any(u["id"] == 1 for u in lead_data), "Citizen user 1 missing from leaderboard"
    log("Public leaderboard verified: citizen ranked with verified credits")

    print("=" * 60)
    print("ALL 14 E2E INTEGRATION & SECURITY TESTS PASSED PERFECTLY!")
    print("=" * 60)

if __name__ == "__main__":
    main()
