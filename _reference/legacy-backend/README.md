# CleanCred Backend Engine

A beginner-friendly FastAPI backend for the CleanCred SIH prototype.

## Features
- User registration and login-like lookup
- Waste report creation with image upload
- 50-meter location verification
- Waste verification status updates
- Worker collection status updates
- Automatic Green Points
- Dashboard analytics endpoint
- SQLite database (easy to run locally)

## Run

```bash
pip install -r requirements.txt
uvicorn main:app --reload
```

Open:
- API docs: http://127.0.0.1:8000/docs
- Dashboard data: http://127.0.0.1:8000/dashboard

## Main Flow

1. Create a user with POST /users
2. Upload/report waste with POST /reports
3. Check worker proximity with POST /reports/{report_id}/verify-location
4. Approve or reject the report with POST /reports/{report_id}/verify
5. Mark collection with POST /reports/{report_id}/collect
6. Points are added automatically after approval
7. Dashboard reads real data from GET /dashboard

## AI Integration

Your teammate's Gemini script can call:

POST /reports/{report_id}/verify

with JSON:

```json
{
  "segregated": true,
  "source": "gemini_ai"
}
```

The backend then updates the report and points.

## Important

This is a hackathon prototype backend. Before production, add authentication, password hashing, cloud file storage, stronger validation, and a production database.
