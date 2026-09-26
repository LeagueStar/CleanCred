# CleanCred pre-SIH test matrix

| Test | Expected result |
|---|---|
| Citizen submits valid camera image | Report created |
| Non-image upload | Rejected |
| >8 MB image | Rejected |
| Same image twice | Duplicate evidence rejected |
| Worker absent | Verification rejected |
| Worker rejects segregation | No QR, no credits |
| AI low confidence | Verification rejected |
| AI category mismatch | Verification rejected |
| Worker >50 m away | Verification rejected |
| Worker within 50 m | Verification may pass |
| Valid QR + collection GPS | Collection succeeds |
| Reused QR | Rejected |
| Different worker tries collection | Rejected |
| Second credit for same report | Unique constraint prevents duplicate |
| Citizen reads another citizen's timeline | Rejected |
| Admin reads analytics | Allowed |
| Browser GPS unavailable | User sees clear error |
