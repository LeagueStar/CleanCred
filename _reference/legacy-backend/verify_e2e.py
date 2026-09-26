import urllib.request
import urllib.parse
import json
import sqlite3
import time
import sys

if sys.platform == 'win32':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass

API_BASE = "http://127.0.0.1:8000"
FRONTEND_BASE = "http://127.0.0.1:8081"

def test_get(url):
    req = urllib.request.Request(url)
    with urllib.request.urlopen(req) as response:
        return response.status, response.read().decode('utf-8')

def test_post_json(url, data):
    body = json.dumps(data).encode('utf-8')
    req = urllib.request.Request(url, data=body, headers={'Content-Type': 'application/json'}, method='POST')
    with urllib.request.urlopen(req) as response:
        return response.status, json.loads(response.read().decode('utf-8'))

def test_put_json(url, data):
    body = json.dumps(data).encode('utf-8')
    req = urllib.request.Request(url, data=body, headers={'Content-Type': 'application/json'}, method='PUT')
    with urllib.request.urlopen(req) as response:
        return response.status, json.loads(response.read().decode('utf-8'))

def test_post_form(url, form_data):
    boundary = "----WebKitFormBoundaryCleanCredTest"
    lines = []
    for key, val in form_data.items():
        lines.append(f"--{boundary}")
        lines.append(f'Content-Disposition: form-data; name="{key}"')
        lines.append('')
        lines.append(str(val))
    lines.append(f"--{boundary}--")
    lines.append('')
    body = '\r\n'.join(lines).encode('utf-8')
    
    req = urllib.request.Request(
        url,
        data=body,
        headers={'Content-Type': f'multipart/form-data; boundary={boundary}'},
        method='POST'
    )
    with urllib.request.urlopen(req) as response:
        return response.status, json.loads(response.read().decode('utf-8'))

def run_tests():
    print("==================================================")
    print("CLEANCRED END-TO-END VERIFICATION SUITE")
    print("==================================================")

    # 1. Test frontend is serving
    print("\n[1] Testing Frontend Server on port 8081...")
    fe_status, fe_html = test_get(f"{FRONTEND_BASE}/index.html")
    assert fe_status == 200, f"Frontend failed: status {fe_status}"
    assert "CleanCred" in fe_html, "Frontend index.html missing CleanCred title"
    print(f"    Frontend is serving index.html ({len(fe_html)} bytes) - OK")

    # 2. Test backend health
    print("\n[2] Testing Backend Server on port 8000...")
    be_status, be_resp = test_get(f"{API_BASE}/")
    assert be_status == 200, f"Backend failed: status {be_status}"
    print(f"    Backend status response: {be_resp.strip()} - OK")

    # 3. Check Dashboard BEFORE adding report
    print("\n[3] Checking Kreya's Dashboard Data (BEFORE report submission)...")
    dash_status, dash_before = test_get(f"{API_BASE}/dashboard")
    dash_before = json.loads(dash_before)
    print(f"    Dashboard BEFORE: total_reports={dash_before['total_reports']}, approved_reports={dash_before['approved_reports']}, waste_summary={dash_before['waste_summary']}")

    # 4. Submit real waste report (multipart form)
    print("\n[4] Submitting real waste report via POST /reports...")
    form_payload = {
        'user_id': '1',
        'waste_type': 'wet',
        'category': 'wet',
        'subtype': 'Kitchen Vegetable & Fruit Scraps',
        'approximate_weight': '4.5',
        'latitude': '19.0760',
        'longitude': '72.8777',
        'address': 'Flat 402, Green Meadows, Ward 4B, Mumbai',
        'pickup_slot': 'Morning Route (08:00 AM - 11:00 AM)'
    }
    rep_status, rep_data = test_post_form(f"{API_BASE}/reports", form_payload)
    assert rep_status == 200, f"Failed to submit report: {rep_status}"
    created_report = rep_data['report']
    request_id = created_report['id']
    report_db_id = created_report['report_id']
    print(f"    Report created successfully: ID={request_id} (DB ID: {report_db_id}), OTP={created_report['otp']}, Worker={created_report['workerName']}")

    # 5. Confirm report appears directly in cleancred.db via SQLite
    print("\n[5] Confirming report directly in cleancred.db via SQLite query...")
    conn = sqlite3.connect("cleancred.db")
    cursor = conn.cursor()
    cursor.execute("SELECT id, request_id, waste_type, approximate_weight, latitude, longitude, otp, verification_status FROM waste_reports WHERE id = ?", (report_db_id,))
    row = cursor.fetchone()
    assert row is not None, "Report not found in SQLite database!"
    print(f"    SQLite DB row: id={row[0]}, request_id={row[1]}, waste_type={row[2]}, weight={row[3]}, lat={row[4]}, lon={row[5]}, otp={row[6]}, status={row[7]}")
    conn.close()

    # 6. Test GET /users/{user_id}/reports (simulating UI refresh)
    print("\n[6] Testing GET /users/1/reports (UI sync on refresh)...")
    user_rep_status, user_reports_raw = test_get(f"{API_BASE}/users/1/reports")
    user_reports = json.loads(user_reports_raw)
    matching = [r for r in user_reports if r['id'] == request_id]
    assert len(matching) > 0, f"Report {request_id} not found in user reports!"
    print(f"    Found newly submitted report in GET /users/1/reports ({len(user_reports)} total reports) - OK")

    # 7. Test Location Verification (Gupta's proximity)
    print("\n[7] Testing Location Verification via POST /reports/{id}/verify-location...")
    # Point near: worker is within 15 meters
    loc_status, loc_resp = test_post_json(f"{API_BASE}/reports/{request_id}/verify-location?worker_latitude=19.0761&worker_longitude=72.8778", {})
    assert loc_resp['within_50_meters'] == True, f"Expected within_50_meters=True, got: {loc_resp}"
    print(f"    Worker nearby (within 50m): {loc_resp['within_50_meters']} - OK")

    # Point distant: worker is > 50 meters away
    loc_status2, loc_resp2 = test_post_json(f"{API_BASE}/reports/{request_id}/verify-location?worker_latitude=19.0900&worker_longitude=72.8900", {})
    assert loc_resp2['within_50_meters'] == False, f"Expected within_50_meters=False, got: {loc_resp2}"
    print(f"    Worker distant (> 50m): within_50_meters={loc_resp2['within_50_meters']} - OK")

    # 8. Test Verification with Purity check (deterministic catalog)
    print("\n[8] Testing Deterministic Purity Verification via POST /reports/{id}/verify...")
    ver_status, ver_resp = test_post_json(f"{API_BASE}/reports/{request_id}/verify", {})
    assert ver_resp['segregated'] == True, f"Expected segregated=True, got: {ver_resp}"
    assert ver_resp['purity_score'] == 95, f"Expected purity_score=95 for Kitchen Vegetable Scraps, got: {ver_resp['purity_score']}"
    print(f"    Purity score: {ver_resp['purity_score']}%, Accepted: {ver_resp['accepted']}, Points Awarded: {ver_resp['points_awarded']}")
    print(f"    Rationale: {ver_resp['rationale']} - OK")

    # 9. Test Collection status update
    print("\n[9] Testing Collection status via POST /reports/{id}/collect...")
    col_status, col_resp = test_post_json(f"{API_BASE}/reports/{request_id}/collect?status=collected", {})
    assert col_resp['collection_status'] == 'collected', f"Expected collected, got: {col_resp}"
    print(f"    Collection status updated to: {col_resp['collection_status']} - OK")

    # 10. Test Redeem Points
    print("\n[10] Testing Points Redemption via POST /users/1/redeem...")
    redeem_status, redeem_resp = test_post_json(f"{API_BASE}/users/1/redeem", {
        "category": "RECHARGE",
        "title": "Jio Mobile Recharge ₹10",
        "amountGp": 100,
        "metadata": "Mob: 9876543210 (Jio Prepaid)"
    })
    assert redeem_resp['success'] == True, f"Expected redemption success, got: {redeem_resp}"
    print(f"    Redemption success: deducted {redeem_resp['redeemed_points']} GC, new balance: {redeem_resp['new_balance']} GC (INR {redeem_resp['inrValue']}) - OK")

    # 11. Test Profile Update
    print("\n[11] Testing Profile Save via PUT /users/1...")
    prof_status, prof_resp = test_put_json(f"{API_BASE}/users/1", {
        "name": "Shivansh Prajapati",
        "email": "shivansh.green@karma.org",
        "phone": "+91 98765 43210",
        "address": "Flat 402, Green Meadows, Ward 4B, Mumbai"
    })
    assert prof_status == 200, f"Expected profile update 200, got {prof_status}"
    print(f"    Profile updated: {prof_resp['user']['name']}, {prof_resp['user']['address']} - OK")

    # 12. Test Illegal Dumping Report
    print("\n[12] Testing Illegal Dumping Report via POST /dumping-reports...")
    dump_status, dump_resp = test_post_json(f"{API_BASE}/dumping-reports", {
        "location": "Near Flyover Pillar 14, Link Road",
        "wasteType": "Construction Debris & Dry Plastic",
        "rewardGp": 20
    })
    assert dump_status == 200, f"Expected dumping report 200, got {dump_status}"
    print(f"    Dumping report created: ID={dump_resp['id']}, Status={dump_resp['status']}, Reward=+{dump_resp['rewardGp']} GC - OK")

    # 13. Check Dashboard AFTER adding report
    print("\n[13] Checking Kreya's Dashboard Data (AFTER report submission & verification)...")
    dash_status_after, dash_after = test_get(f"{API_BASE}/dashboard")
    dash_after = json.loads(dash_after)
    print(f"    Dashboard AFTER: total_reports={dash_after['total_reports']}, approved_reports={dash_after['approved_reports']}, collected_reports={dash_after['collected_reports']}, waste_summary={dash_after['waste_summary']}")
    
    assert dash_after['total_reports'] > dash_before['total_reports'], "Total reports did not increment!"
    assert dash_after['approved_reports'] > dash_before['approved_reports'], "Approved reports did not increment!"
    assert dash_after['waste_summary']['wet'] > dash_before['waste_summary'].get('wet', 0), "Wet waste weight did not increase!"
    print(f"    DASHBOARD METRICS CONFIRMED MOVING: before={dash_before['total_reports']} -> after={dash_after['total_reports']} reports! Chart data updated dynamically!")

    print("\n==================================================")
    print("ALL 13 END-TO-END VERIFICATION CHECKS PASSED! (100% SUCCESS)")
    print("==================================================")

if __name__ == '__main__':
    run_tests()
