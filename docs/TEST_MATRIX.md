# CleanCred System & Security Test Matrix (v3.0.0)

This matrix defines the end-to-end verification and pure-logic security checks required for the CleanCred Swachh Bharat Mission (SBM-U 2.0) platform.

---

## 1. Authentication & Role-Based Access Control (RBAC)

| Test ID | Role / Actor | Test Case | Mechanism | Expected Response |
|---|---|---|---|---|
| **AUTH-01** | Citizen (`id=1`) | Valid PIN login | `POST /auth/login` (`{"user_id": 1, "pin": "1234"}`) | `200 OK`, `access_token` minted |
| **AUTH-02** | Worker (`id=2`) | Valid PIN login | `POST /auth/login` (`{"user_id": 2, "pin": "5678"}`) | `200 OK`, `access_token` minted |
| **AUTH-03** | Admin (`id=3`) | Valid PIN login | `POST /auth/login` (`{"user_id": 3, "pin": "9999"}`) | `200 OK`, `access_token` minted |
| **AUTH-04** | Any | Invalid PIN rejection | `POST /auth/login` (`{"user_id": 1, "pin": "0000"}`) | `401 Unauthorized` |
| **AUTH-05** | Public | Unauthenticated report history | `GET /reports/mine` with no header | `401 Unauthorized` |
| **AUTH-06** | Citizen | Cross-citizen report leak check | `GET /reports` (Admin route) with citizen token | `403 Forbidden` (`admin access required`) |

---

## 2. Waste Evidence Submission & Anti-Fraud Gates

| Test ID | Endpoint | Test Scenario | Mechanism | Expected Response |
|---|---|---|---|---|
| **EVID-01** | `POST /reports` | Valid waste evidence | Multipart image (`WET`/`DRY`/`HAZARDOUS`), GPS | `200 OK`, report ID created, SHA-256 hash returned |
| **EVID-02** | `POST /reports` | Re-upload identical photo | SHA-256 content digest matches existing record | `409 Conflict` (`Duplicate evidence detected`) |
| **EVID-03** | `POST /reports` | Non-image payload upload | Invalid MIME content type (e.g. `.txt` / `.pdf`) | `400 Bad Request` |
| **EVID-04** | `POST /reports` | Oversized payload upload | Payload size > 8 MB | `413 Payload Too Large` |
| **EVID-05** | UI (Camera) | Live `getUserMedia` stream | WebRTC camera viewfinder captured to blob | Emits `File` object identical to file picker upload |
| **EVID-06** | UI (Camera) | Camera denied / unavailable | Permission denial or insecure context | Graceful error toast, auto-fallback to file picker |

---

## 3. Municipal Worker Verification & Scoring Gates

| Test ID | Endpoint | Gate Tested | Security Rule | Expected Response |
|---|---|---|---|---|
| **VERIF-01** | `POST /verify` | GPS Proximity Gate (Fail) | Worker distance > 50.0 meters from report lat/lon | `403 Forbidden` (`GPS gate failed: worker is ... m away`) |
| **VERIF-02** | `POST /verify` | Worker Segregation Rejection | Worker flags waste as unsegregated (`segregated=False`) | `403 Forbidden`, report marked `WORKER_REJECTED`, 0 credits |
| **VERIF-03** | `POST /verify` | AI Classification Gate | Gemini vision category mismatch against report | `403 Forbidden` (`AI classified X, but report says Y`) |
| **VERIF-04** | `POST /verify` | Dynamic Risk Scoring | Score computed across AI (40+10), GPS (30), Dup (20) | Returns 0-100 score, `risk_level` (`LOW`/`MED`/`HIGH`), flags |
| **VERIF-05** | `POST /verify` | One-Time QR Minting | Successful verification (AI + Proximity + Segregation) | `200 OK`, `qr_token` (URL-safe string) generated and hashed |

---

## 4. Physical Custody Transfer & Handover Collection

| Test ID | Endpoint | Gate Tested | Security Rule | Expected Response |
|---|---|---|---|---|
| **COLL-01** | `POST /collect` | Collection GPS Gate (Fail) | Worker coordinates > 50.0 meters from report | `403 Forbidden` (`Collection GPS gate failed`) |
| **COLL-02** | `POST /collect` | Invalid QR Token | Altered, truncated, or forged token payload | `403 Forbidden` (`Invalid one-time QR token`) |
| **COLL-03** | `POST /collect` | Verifying Worker Integrity | Different worker ID attempts collection | `403 Forbidden` (`Only verifying worker can collect`) |
| **COLL-04** | `POST /collect` | Valid Handover Collection | Same worker, distance <= 50m, valid QR token | `200 OK`, `COLLECTED` status, EPR credits awarded |
| **COLL-05** | `POST /collect` | QR Replay Attack Prevention | Attempting collection second time with same QR | `409 Conflict` (`QR has already been consumed`) |
| **COLL-06** | `POST /collect` | Credit Ledger Idempotency | Duplicate transaction insertion | Prevented by UNIQUE constraint on `report_id` |

---

## 5. Automated Test Suite Execution

### Pure-Logic Unit Tests (No Server Required)
```bash
python -m pytest backend/tests -v
```
- **Coverage**: Haversine distance, boundary conditions, fraud scoring rules, SHA-256 byte hashing, and URL-safe QR token HMAC verification.
- **Runtime**: Sub-second execution time.

### End-to-End System & Security Verification
```bash
python verify_e2e_v3.py
```
- **Coverage**: 14 live automated checks verifying health, PIN auth, report creation, duplicate image rejection (409), GPS gates (403), QR token issuance, QR consumption, replay rejection (409), and wallet ledger synchronization.
