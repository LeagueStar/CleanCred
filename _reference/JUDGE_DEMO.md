# CleanCred — 4-minute SIH judge demo

## Opening (20 seconds)

> “Most waste apps prove that someone pressed Report. CleanCred is designed to prove that a waste action reached collection. We connect evidence, AI, GPS, a field-worker confirmation and a one-time QR into one auditable event.”

## Live flow (2 minutes)

1. Citizen logs in.
2. Capture a real camera image and GPS location.
3. Show the generated event ID/evidence hash.
4. Worker logs in and runs verification.
5. Point out the AI category + confidence, GPS distance and verification score.
6. Show the one-time QR.
7. Confirm collection.
8. Show Green Credits and the proof timeline.

## Anti-fraud proof (40 seconds)

### Test A — duplicate evidence
Submit the same image again.

Expected result: `Duplicate evidence detected`.

### Test B — replayed QR
Try to collect the same report again.

Expected result: `QR has already been consumed`.

## Municipal value (40 seconds)

Admin → analytics:

- total reports
- verified events
- collection rate
- credits issued
- risk distribution
- recurring hotspots

Then say:

> “The same event that earns a citizen credit becomes structured operational data for a municipality.”

## Critical honesty rule

Never call demo AI mode “live AI”. If `DEMO_AI_MODE=1`, tell judges it is a rehearsal simulator. For the final presentation, use a real model/API and keep the model name visible in the verification result.
