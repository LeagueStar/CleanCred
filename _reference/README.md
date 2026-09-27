# CleanCred — Enhanced SIH 2026 Demo

**Problem:** SIH26195 · Clean & Green Technology · Team GreenLegacy (GSIH26015)

CleanCred is a proof-backed waste-action platform. It is designed around one core rule:

> **A report is not a reward. A verified collection event is.**

## Demo flow

`Camera evidence → server timestamp → AI classification → worker decision → GPS gate → one-time QR → collection → Green Credits → audit timeline → municipal analytics`

## What this enhanced build adds

- Real Gemini image verification when `GEMINI_API_KEY` is configured.
- Explicit demo AI mode (`DEMO_AI_MODE=1`) for offline rehearsal; it is clearly labelled as simulated and must not be presented as live AI.
- Server-side timestamps.
- Live camera capture rather than a gallery evidence path.
- SHA-256 duplicate-image detection before a report is accepted.
- 50 m server-side Haversine GPS gate for worker verification and collection.
- Worker segregation decision as a hard gate.
- AI category must match the citizen's declared category.
- Verification score and risk level.
- One-time QR token; token hash is stored, raw token is not reconstructable.
- QR token is cleared after collection.
- Exactly-once credit transaction using a unique report constraint.
- Category-weighted Green Credits for the demo ledger.
- Proof timeline for every event.
- Municipal analytics: totals, collection rate, waste mix, risk distribution and recurring coordinate hotspots.
- Citizen leaderboard.
- Role-based demo authentication.
- SQLite persistence and indexes.
- CORS configurable through environment variable.

## Important honesty notes for judges

This is a **prototype**, not a production municipal identity system. Browser GPS can be spoofed, so CleanCred performs a server-side distance calculation but does not claim cryptographic location attestation. AI is assistive classification, not regulatory certification. Production deployment should add a proper identity provider, HTTPS, object storage, signed capture evidence, rate limiting, audit logs, secure secrets management, monitoring and a tested municipal integration.

## Run

### 1. Backend

```bash
cd backend
python -m venv .venv
# Windows: .venv\\Scripts\\activate
# Linux/macOS: source .venv/bin/activate
pip install -r requirements.txt
copy .env.example .env   # Windows
# cp .env.example .env   # Linux/macOS
uvicorn main:app --reload --port 8000
```

For live AI, put `GEMINI_API_KEY=...` in `.env`.
For a rehearsal without an API key, use `DEMO_AI_MODE=1` and say explicitly that the AI result is simulated.

### 2. Frontend

Serve `frontend/` over HTTP (camera/GPS permissions are much more reliable on localhost/HTTPS):

```bash
cd frontend
python -m http.server 5500
```

Open `http://127.0.0.1:5500`.

## Judge demo script

1. Create/login as **Citizen**.
2. Capture one clean waste image and submit it.
3. Show the event ID and evidence hash.
4. Login as **Worker**.
5. Run verification and show AI confidence, GPS distance, verification score and risk level.
6. Show the one-time QR.
7. Confirm collection and show credits being awarded.
8. Open the proof timeline.
9. Login as **Admin** and show collection rate, risk distribution and recurring hotspots.
10. Attempt to submit the same image again: **Duplicate evidence detected**.
11. Attempt collection twice: **QR already consumed**.

These two rejection demonstrations are especially valuable because they prove that the reward system is not simply a button that increments points.

## Team split

- **Kartik — Front end:** citizen UX, responsive UI, demo polish, camera/GPS flows.
- **Satyam — Front end:** municipal dashboard, timeline, leaderboard, visual QA.
- **Shivansh — Backend:** API, persistence, auth, event lifecycle and deployment.
- **Suraj — API / DSA / coding:** verification engine, duplicate detection, scoring, analytics queries, tests.
- **Kreya — coding / support:** test cases, demo data, documentation, QA, judge-flow rehearsal and edge-case validation.

## Production roadmap

1. Device/identity attestation for stronger location evidence.
2. Object storage + signed evidence URLs.
3. PostgreSQL/PostGIS for city-scale geospatial queries.
4. Background AI jobs and human review queue for low-confidence cases.
5. Rate limiting, audit logs, HTTPS and secure session/JWT provider.
6. Municipal API/export integration.
7. Field pilot with measured KPIs before claiming impact percentages.
