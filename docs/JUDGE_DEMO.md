# CleanCred — 3-Minute SIH 2026 Judge Demonstration Script

A structured, timed walk-through for demonstrating CleanCred to hackathon judges.

---

## Pitch Opening (25 Seconds)

> *"Distinguished judges, most civic waste applications merely record that a citizen tapped 'Report'. They cannot prove whether waste was actually segregated, collected, or dumped down the street.*
>
> *CleanCred introduces cryptographic chain-of-custody for municipal waste recovery. We chain camera evidence, AI purity verification, a 50-meter GPS proximity hard gate, field scale verification, and a one-time dynamic QR token into an auditable ledger event that unlocks verified EPR Credits."*

---

## Live Product Walkthrough (2 Minutes)

### Phase 1: Citizen Waste Reporting & Camera Proof (40s)
1. **Open Citizen View**: Show the dashboard with citizen identity (`DemoTester`, Bandra West Ward 4B).
2. **Start Report**: Click **"Report Waste"**.
3. **Step 1 (Classification)**: Select **"Dry Waste (Recyclable)"** &bull; Material: *Cardboard Shipping Cartons & Paper* (7 Credits/KG).
4. **Step 2 (Evidence)**:
   - Click **"Live Camera"** to demonstrate live WebRTC viewfinder capture, OR click **"Upload File"** / select a sample demonstration image.
   - Point out that every uploaded image produces an immutable SHA-256 fingerprint on the backend.
5. **Step 3 (Location)**: Click **"Refresh GPS"** to lock live coordinates (`19.0596° N, 72.8295° E`).
6. **Step 4 (Review)**: Emphasize the notice: *Credits are not pre-funded; they unlock strictly upon physical municipal handover.*
7. **Step 5 (Submission)**: Confirm submission. Note the assigned pickup request ID and handover OTP.

### Phase 2: Worker Route Portal & Verification Gates (45s)
1. **Switch Role**: Tap **"Worker"** in the top navigation bar (switches to `DemoCollector`).
2. **Review Queue**: Open the active item in the worker queue.
3. **Trigger Verification**:
   - Point out that the worker must be physically within **50 meters** of the citizen report coordinates.
   - If the worker is far away, the backend returns `403 GPS gate failed`.
   - When verified on-site: The system displays AI category match confidence, proximity distance (e.g. `12.5 m`), and generates a **one-time cryptographically hashed QR token**.

### Phase 3: Handover Collection & Credit Minting (35s)
1. **Scan QR Code**: Use the integrated scanner or simulate collection handover.
2. **Instant Ledger Deposit**: The one-time QR token is consumed on the SQLite ledger.
3. **Switch to Citizen**: Navigate to **"Rewards / Green Wallet"**.
4. **Show Ledger Audit**: Show the newly minted EPR Credits, timestamped transaction receipt, and the Swachh Bharat Mission compliance verification.

---

## Anti-Fraud Proof Demonstration (30 Seconds)

Judges frequently ask how CleanCred prevents abuse. Demonstrate these two live backend rejection gates:

### Attack 1: Replay of Duplicate Evidence
- Attempt to re-upload the exact same waste photo.
- **Backend Result**: `409 Conflict: Duplicate evidence detected: image already belongs to event #...`.

### Attack 2: Replay Attack on Consumed QR Token
- Attempt to scan or collect the same QR token a second time.
- **Backend Result**: `409 Conflict: QR has already been consumed`.

---

## Municipal Command Center & Telemetry (25 Seconds)

1. **Switch Role**: Tap **"Command"** in the top navigation bar.
2. **Review Real-Time KPIs**:
   - Total Credits Minted (synchronized from real ledger)
   - Recovery Rate (%)
   - Verified Pickups vs Collections
   - Estimated Landfill Diversion (Tons)
3. **Geospatial Activity Map**:
   - Show the interactive Leaflet map rendering active cluster pins across Ward 4B and the Bandra MRF Facility Hub.
4. **Compliance Export**:
   - Click **"Export SBM Report (PDF)"** for audit-ready municipal exports.

---

## Critical Honesty & Transparency Rule

> [!IMPORTANT]
> If running with `DEMO_AI_MODE=1` (standard hackathon simulation fallback without live Gemini cloud credentials):
> - Transparently state: *"For reliable demo connectivity, AI is operating in deterministic local classification simulator mode. In cloud deployment, this endpoint connects directly to Gemini 2.5 Flash multimodal vision."*
> - The model name is always explicitly returned in the `/verify` response payload (`demo-ai-heuristic-v1` vs `gemini-2.5-flash`).
