# CleanCred — Municipal Waste Segregation & Verified Civic Incentive Engine

[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688?logo=fastapi)](https://fastapi.tiangolo.com)
[![Python](https://img.shields.io/badge/Python-3.11%2B-3776AB?logo=python)](https://python.org)
[![JavaScript](https://img.shields.io/badge/Frontend-Vanilla%20ES6%20SPA-F7DF1E?logo=javascript)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Leaflet](https://img.shields.io/badge/Maps-Leaflet.js-199900?logo=leaflet)](https://leafletjs.com)
[![Tests](https://img.shields.io/badge/Tests-12%20Unit%20%7C%2014%20E2E%20Passing-success)](docs/TEST_MATRIX.md)

**CleanCred** is a civic technology platform and municipal incentive engine designed for Smart India Hackathon (SIH). It turns household waste segregation into an auditable, fraud-resistant civic game. By combining multimodal vision AI (Google Gemini 2.5 Flash), geospatial proximity verification ($\le$ 50m Haversine gate), one-time dynamic QR physical handoff, and an immutable double-entry credit ledger (100 Credits = ₹10 INR), CleanCred ensures that municipal rewards are only distributed when segregated waste is physically collected and verified on the ground.

---

## 5-Stage Verification Lifecycle

CleanCred strictly enforces a 5-stage sequential chain of custody before awarding any civic credits:

```
[ Citizen: Report ] ────────► [ Multimodal AI Verify ]
 (Photo + Geo-coords)          (Gemini 2.5 Flash Vision)
                                        │
                                        ▼
[ Citizen Earns Credits ] ◄─── [ Physical QR Collect ] ◄─── [ Worker Proximity Verify ]
 (Immutable Ledger Entry)       (Dynamic Token Burn)         (GPS Gate <= 50m + Sorting)
```

1. **REPORT (Citizen Submission)**: The citizen snaps real-time waste evidence using the in-app WebRTC camera or file picker. The client captures high-resolution imagery and current geolocation.
2. **AI VERIFY (Computer Vision)**: Backend inspects raw image bytes via Gemini 2.5 Flash (or `DEMO_AI_MODE` fallback) to categorize waste (`WET`, `DRY`, `HAZARDOUS`), evaluate segregation purity, and reject fraudulent/stock photos via SHA-256 binary deduplication.
3. **WORKER VERIFY (Proximity & Physical Check)**: A municipal collector arrives on site. The backend enforces a strict Haversine distance hard gate ($\le$ 50m) between the worker's live coordinates and the citizen's report location before physical segregation inspection can be submitted.
4. **COLLECT (Physical Custody Handoff)**: The citizen displays a dynamic one-time QR code. The worker scans it with the in-app camera scanner. The cryptographic token is verified via constant-time HMAC comparison and burned to prevent replay attacks.
5. **EARN (Double-Entry Ledger Settlement)**: The database records an idempotent credit transaction, and clean credits are added to the citizen's wallet, convertible to INR civic rewards or municipal utility tax rebates.

---

## Repository Directory Structure

```
CleanCred/
├── backend/
│   ├── ai.py               # Multimodal Gemini vision AI service & offline heuristic
│   ├── db.py               # SQLite schema, foreign keys, migrations, WAL mode
│   ├── geo.py              # Great-Circle Haversine distance formula & proximity gates
│   ├── main.py             # FastAPI REST engine, role RBAC, life-cycle endpoints
│   ├── security.py         # Dynamic QR tokens, constant-time HMAC, SHA-256 deduplication
│   ├── seed_demo_data.py   # Populates realistic demo dataset across all lifecycle states
│   ├── requirements.txt    # Python dependencies (fastapi, uvicorn, pydantic, pytest, etc.)
│   ├── uploads/            # Secure local filesystem storage for evidence photos
│   └── tests/
│       └── test_core_logic.py # 12 pure-logic unit tests (Haversine, SHA-256, HMAC, fraud)
├── frontend/
│   ├── index.html          # Main responsive single-page application (SPA) shell
│   ├── qa-desktop.html     # Side-by-side evaluator cockpit with dual viewports
│   ├── server.py           # Lightweight local static HTTP development server
│   ├── start.bat           # One-click Windows launch script
│   ├── css/
│   │   ├── main.css        # Tactile neumorphic design system & typography
│   │   ├── components.css  # Cards, buttons, dialogs, badges, and HUD widgets
│   │   ├── animations.css  # Keyframe transitions, pulse rings, confetti
│   │   └── responsive.css  # Mobile and desktop viewport media queries
│   └── js/
│       ├── app.js          # Client-side router and view controller
│       ├── state.js        # Reactive store, schema v3 persistence, auth bootstrap, API client
│       ├── components/     # Modular view controllers (12 views)
│       │   ├── adminDashboard.js     # Municipal command center, KPIs, charts, Leaflet map
│       │   ├── dashboard.js          # Citizen mobile dashboard & gamification
│       │   ├── illegalDumping.js     # Blackspot dumping reporting & telemetry
│       │   ├── impactDashboard.js    # CO2 offset, trees, water conservation metrics
│       │   ├── institutionPortal.js  # Bulk waste generator management
│       │   ├── landing.js            # Public platform landing page
│       │   ├── leaderboard.js        # Civic rankings & achievement badges
│       │   ├── liveTracking.js       # Swiggy/Uber-style route tracking & dynamic QR
│       │   ├── profile.js            # User profile, registered ward address
│       │   ├── reportWaste.js        # 5-step waste reporting wizard & camera capture
│       │   ├── rewardsWallet.js      # Credit wallet balance, INR cash-out & vouchers
│       │   └── workerPortal.js       # Field collection queue, proximity check, QR scanner
│       └── utils/          # Frontend utility helpers
│           ├── audio.js              # Web Audio API synthesizers for micro-interactions
│           ├── confetti.js           # Canvas particle burst celebration engine
│           ├── formatters.js         # Indian numbering system, currency, date formatting
│           ├── mapHelper.js          # Leaflet map pins, routing polylines, auto-resizing
│           ├── qrCode.js             # QR code matrix generator
│           └── qrScanner.js          # WebRTC live camera barcode & QR decoder
├── docs/
│   ├── JUDGE_DEMO.md       # Step-by-step 3-minute hackathon judge evaluation script
│   └── TEST_MATRIX.md      # Full automated test matrix and anti-fraud verification spec
├── verify_e2e_v3.py        # 14-step automated end-to-end integration and anti-fraud test suite
└── README.md
```

---

## Role Credentials & Demo PINs

The platform comes pre-seeded with standardized demo accounts for instant evaluation:

| Role | Demo Account Name | User ID | PIN | Capabilities |
| :--- | :--- | :--- | :--- | :--- |
| **Citizen** | `DemoTester` | `1` | `1234` | Submit waste reports, live tracking, dynamic QR, wallet redemption |
| **Worker** | `DemoCollector` | `2` | `5678` | Proximity verification ($\le$ 50m), camera QR scanner, custody collect |
| **Admin** | `DemoAdmin` | `3` | `9999` | Citywide analytics, Leaflet coverage map, ward telemetry, audit logs |

---

## Quickstart & Local Setup

### Prerequisites
- Python 3.11+
- Modern Web Browser (Chrome, Edge, Firefox, or Safari) with camera permissions enabled for QR/evidence testing

### 1. Backend Setup

```bash
# Navigate to the backend directory
cd backend

# Create and activate a virtual environment (optional but recommended)
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

# Install required dependencies
pip install -r requirements.txt

# Start the FastAPI engine (runs on http://127.0.0.1:8000)
uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

Interactive OpenAPI Swagger documentation is immediately available at `http://127.0.0.1:8000/docs`.

### 2. Frontend Setup

In a separate terminal:

```bash
# Navigate to the frontend directory
cd frontend

# Run the local HTTP server
python server.py 3000
```

Open your browser to:
- **Mobile Citizen Experience**: `http://localhost:3000/index.html`
- **Side-by-Side Evaluator Cockpit**: `http://localhost:3000/qa-desktop.html` (Citizen view on left, Worker portal on right)

---

## API Endpoints Reference

| Method | Endpoint | Required Role | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/health` | Public | System health check, database status, and AI engine mode |
| `POST` | `/auth/login` | Public | Authenticates user via PIN and returns role-scoped Bearer token |
| `POST` | `/reports` | Citizen | Submits geo-tagged photo evidence for AI segregation verification |
| `GET` | `/reports/mine` | Citizen | Fetches all historical submissions and statuses for current citizen |
| `POST` | `/verify` | Worker | Submits worker physical inspection; gates on Haversine distance $\le$ 50m |
| `POST` | `/collect` | Worker | Burns one-time QR token, verifies proximity, awards double-entry credits |
| `GET` | `/reports/{id}/timeline` | Any Auth | Returns tamper-evident 5-stage lifecycle audit timestamps |
| `GET` | `/wallet/{user_id}` | Owner / Admin | Returns credit ledger transaction history and balance |
| `GET` | `/leaderboard` | Public | Returns top 20 civic contributors ranked by clean credit points |
| `GET` | `/analytics` | Admin | Returns aggregate city diversion metrics, category mix, and hotspots |
| `GET` | `/reports` | Admin | Returns global report audit log for municipal command center |
| `GET` | `/reports/{id}/image` | Authorized | Securely streams stored evidence image file |

---

## Testing & Quality Assurance

CleanCred includes both sub-second pure-logic unit tests and a full automated end-to-end integration and anti-fraud test suite.

### 1. Pure-Logic Unit Tests (`pytest`)

Executes 12 unit tests covering spherical distance calculations, cryptographic hashes, and fraud scoring:

```bash
python -m pytest backend/tests -v
```

Expected output: `12 passed in < 0.15s`

### 2. End-to-End Integration & Anti-Fraud Suite (`verify_e2e_v3.py`)

Executes 14 end-to-end operational scenarios against the running FastAPI daemon:

```bash
python verify_e2e_v3.py
```

Validates:
1. `GET /health` operational status
2. Multi-role PIN authentication (`1234`, `5678`, `9999`)
3. Citizen multipart report submission with SHA-256 evidence hashing
4. Duplicate evidence rejection (Anti-Fraud Gate 1)
5. Out-of-bounds GPS verification rejection (> 50m Haversine gate)
6. Valid worker proximity verification ($\le$ 50m)
7. Fake QR token collection rejection (Anti-Fraud Gate 2)
8. Worker GPS collection gate enforcement
9. Successful QR collection & token burn
10. QR replay attack prevention (Anti-Fraud Gate 3)
11. Double-entry credit ledger credit award
12. 5-Stage report timeline audit trail
13. Citizen wallet balance reconciliation
14. Municipal analytics aggregation & hotspot detection

---

## Real-World Limitations & Production Roadmap

- **Computer Vision Model**: In production, the system connects directly to Google Gemini 2.5 Flash via `GEMINI_API_KEY`. When offline or for zero-cost local evaluation, `DEMO_AI_MODE=1` activates a deterministic heuristic fallback.
- **Digital Scales**: Waste weights are currently reported by the citizen and audited by the worker during physical inspection. Production deployment integrates Bluetooth Low Energy (BLE) smart municipal scales directly with the worker handheld terminal.
- **Relational Storage**: The prototype utilizes SQLite in Write-Ahead Logging (`WAL`) mode with foreign key constraints. For high-throughput multi-ward municipal deployment, the database connection layer is designed for drop-in migration to PostgreSQL with PostGIS geospatial indexing.
- **Evidence Storage**: Images are stored on the local filesystem under `backend/uploads/`. Production architecture targets private S3-compatible object storage with signed ephemeral URLs.

---

## 🤝 Contributing

This project was developed exclusively for the **Smart India Hackathon 2026**. Outside contributions, pull requests, and forks are not accepted at this time to preserve the integrity of the submission. The repository will be opened for community contributions after SIH 2026 concludes.

---

## 🛡️ License & Copyright

**Copyright © 2026 Team GreenLegacy. All Rights Reserved.**

This software and its associated documentation are proprietary and confidential. All rights remain strictly reserved until the conclusion of the Smart India Hackathon (SIH) 2026, after which the project will be transitioned to an open-source license. Outside copying, distribution, cloning, or commercial use is not permitted during the competition evaluation window.

For the full legal terms, restrictions, and planned open-source transition details, please see [COPYRIGHT](COPYRIGHT).

---

## 👥 Team GreenLegacy

| Member | Role / Affiliation | GitHub |
| :--- | :--- | :--- |
| **Kartik Devdhawala** | Current Lead Maintainer | [@LeagueStar](https://github.com/LeagueStar) |
| **Harshprit Bagga** | Core Team Member | — |
| **Shivansh Prajapati** | Project Founder / Original Author | — |
| **Suraj Singh** | Core Team Member | — |
| **Satyam Gupta** | Core Team Member | — |
| **Kreya Patel** | Core Team Member | — |

<div align="center">

**🌐 [Live Website](https://leaguestar.github.io/CleanCred/)** · Built with 💚 for a cleaner tomorrow

</div>

