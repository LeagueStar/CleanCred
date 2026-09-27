"""
CleanCred Verified Waste Recovery API (FastAPI)
Swachh Bharat Mission (SBM-U 2.0) Civic Architecture

Enforces physical custody and segregation gates:
Report (Citizen) -> AI & Proximity Verification (Worker) -> Handover QR (Scale) -> Ledger Mint (Credits)
"""

import os, json, secrets, hashlib
from datetime import datetime, timezone, timedelta
from pathlib import Path
from collections import Counter
from dotenv import load_dotenv
from fastapi import FastAPI, File, Form, Header, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field
from db import get_conn, init_db
from geo import haversine_m
from security import make_qr_token, hash_token, token_matches, sha256_bytes
from ai import verify_image

BASE = Path(__file__).resolve().parent
UPLOADS = BASE / "uploads"; UPLOADS.mkdir(exist_ok=True)
load_dotenv(BASE / ".env")
init_db()
app = FastAPI(title="CleanCred Verified Waste API", version="3.0.0")
app.add_middleware(CORSMiddleware, allow_origins=[x.strip() for x in os.getenv("CORS_ORIGINS","*").split(",")], allow_credentials=False, allow_methods=["*"], allow_headers=["*"])
GPS_RADIUS=float(os.getenv("GPS_RADIUS_METERS","50")); WINDOW_MIN=int(os.getenv("VERIFICATION_WINDOW_MINUTES","1440")); BASE_CREDITS=int(os.getenv("CREDITS_PER_VERIFIED_ACTION","10"))
SESSIONS={}

def now(): return datetime.now(timezone.utc)
def iso(dt): return dt.astimezone(timezone.utc).isoformat()
def parse_dt(v): return datetime.fromisoformat(v.replace("Z","+00:00"))
def pin_hash(pin): return hashlib.pbkdf2_hmac("sha256", pin.encode(), b"cleancred-demo-v3", 150000).hex()
def auth_user(auth):
    if not auth or not auth.startswith("Bearer "): raise HTTPException(401,"Login required")
    uid=SESSIONS.get(auth[7:].strip())
    if not uid: raise HTTPException(401,"Invalid or expired session")
    c=get_conn(); row=c.execute("SELECT * FROM users WHERE id=?",(uid,)).fetchone(); c.close()
    if not row: raise HTTPException(401,"User no longer exists")
    return row
def require_role(auth, role):
    u=auth_user(auth)
    if u["role"]!=role: raise HTTPException(403,f"{role} access required")
    return u

def rowdict(row): return dict(row) if row else None
class CreateUser(BaseModel): name:str=Field(min_length=1,max_length=80); role:str; pin:str=Field(min_length=4,max_length=32)
class LoginRequest(BaseModel): user_id:int; pin:str=Field(min_length=4,max_length=32)
class VerifyRequest(BaseModel): report_id:int; segregated:bool; worker_lat:float=Field(ge=-90,le=90); worker_lon:float=Field(ge=-180,le=180)
class CollectRequest(BaseModel): report_id:int; qr_token:str=Field(min_length=10); worker_lat:float=Field(ge=-90,le=90); worker_lon:float=Field(ge=-180,le=180)

@app.get("/health")
def health():
    """
    Public health check endpoint.
    Auth: None (Public)
    Response: {"ok": true, "service": "cleancred-api", "version": "...", "demo_ai": bool}
    """
    return {"ok":True,"service":"cleancred-api","version":app.version,"demo_ai":os.getenv("DEMO_AI_MODE","0")=="1"}

@app.post("/users")
def create_user(body:CreateUser):
    """
    Register a new user account with hashed PIN storage.
    Auth: None (Bootstrap / Public)
    Body: {"name": str, "role": "citizen"|"worker"|"admin", "pin": str}
    Response: User record dictionary with id, name, role, points, created_at.
    Errors: 400 Bad Request if role is invalid.
    """
    role=body.role.lower()
    if role not in {"citizen","worker","admin"}: raise HTTPException(400,"Invalid role")
    c=get_conn(); cur=c.execute("INSERT INTO users(name,role,pin_hash,points,created_at) VALUES(?,?,?,?,?)",(body.name.strip(),role,pin_hash(body.pin),0,iso(now()))); c.commit(); row=c.execute("SELECT id,name,role,points,created_at FROM users WHERE id=?",(cur.lastrowid,)).fetchone(); c.close(); return dict(row)

@app.post("/auth/login")
def login(body:LoginRequest):
    """
    Authenticate a user via role ID and PIN.
    Auth: None (Public)
    Body: {"user_id": int, "pin": str}
    Response: {"access_token": str, "user": {...}}
    Errors: 401 Unauthorized if user ID or PIN is invalid.
    """
    c=get_conn(); row=c.execute("SELECT * FROM users WHERE id=?",(body.user_id,)).fetchone(); c.close()
    if not row or not secrets.compare_digest(row["pin_hash"],pin_hash(body.pin)): raise HTTPException(401,"Invalid user ID or PIN")
    token=secrets.token_urlsafe(32); SESSIONS[token]=row["id"]
    return {"access_token":token,"user":{"id":row["id"],"name":row["name"],"role":row["role"],"points":row["points"]}}

@app.get("/users")
def users(auth: str|None=Header(default=None)):
    """
    List all registered municipal users.
    Auth: Bearer token (Role: admin)
    Response: List of user dicts [{"id": int, "name": str, "role": str, "points": int, ...}]
    Errors: 401 Unauthorized, 403 Forbidden.
    """
    require_role(auth,"admin"); c=get_conn(); rows=c.execute("SELECT id,name,role,points,created_at FROM users ORDER BY id").fetchall(); c.close(); return [dict(r) for r in rows]

@app.post("/reports")
async def create_report(authorization:str|None=Header(default=None),category:str=Form(...),latitude:float=Form(...),longitude:float=Form(...),image:UploadFile=File(...)):
    """
    Submit citizen waste evidence with GPS coordinates and photo proof.
    Auth: Bearer token (Role: citizen)
    Form data:
        category: WET | DRY | HAZARDOUS
        latitude: float (-90 to 90)
        longitude: float (-180 to 180)
        image: multipart/form-data binary image file (<= 8 MB)
    Response: {"report_id": int, "status": "SUBMITTED", "server_timestamp": str, "evidence_hash": str}
    Errors:
        400 Bad Request (invalid category or non-image MIME)
        401 Unauthorized (missing or invalid token)
        403 Forbidden (non-citizen role)
        409 Conflict (duplicate evidence SHA-256 match)
        413 Payload Too Large (> 8 MB)
    """
    user=require_role(authorization,"citizen"); category=category.upper()
    if category not in {"WET","DRY","HAZARDOUS"}: raise HTTPException(400,"Category must be WET, DRY or HAZARDOUS")
    if not image.content_type or not image.content_type.startswith("image/"): raise HTTPException(400,"Only image data is accepted")
    data=await image.read()
    if len(data)>8*1024*1024: raise HTTPException(413,"Image is larger than 8 MB")
    digest=sha256_bytes(data)
    c=get_conn(); dup=c.execute("SELECT id,status FROM reports WHERE image_sha256=? ORDER BY id DESC LIMIT 1",(digest,)).fetchone()
    if dup: c.close(); raise HTTPException(409,f"Duplicate evidence detected: image already belongs to event #{dup['id']}")
    suffix=Path(image.filename or "").suffix.lower(); suffix=suffix if suffix in {".jpg",".jpeg",".png",".webp"} else ".jpg"
    path=UPLOADS/f"{secrets.token_hex(16)}{suffix}"; path.write_bytes(data); captured=iso(now())
    cur=c.execute("INSERT INTO reports(user_id,category,image_path,image_sha256,report_lat,report_lon,captured_at,status) VALUES(?,?,?,?,?,?,?,?)",(user["id"],category,str(path),digest,latitude,longitude,captured,"SUBMITTED")); c.commit(); c.close()
    return {"report_id":cur.lastrowid,"status":"SUBMITTED","server_timestamp":captured,"evidence_hash":digest[:12]+"…"}

def load_report(rid):
    c=get_conn(); r=c.execute("SELECT * FROM reports WHERE id=?",(rid,)).fetchone(); a=c.execute("SELECT * FROM ai_verifications WHERE report_id=?",(rid,)).fetchone(); w=c.execute("SELECT * FROM worker_verifications WHERE report_id=?",(rid,)).fetchone(); col=c.execute("SELECT * FROM collections WHERE report_id=?",(rid,)).fetchone(); c.close(); return r,a,w,col

def risk_and_score(report, ai, distance, duplicate_count=0):
    score=0; flags=[]
    if ai and ai["accepted"]: score+=40
    if ai and ai["confidence"]>=.85: score+=10
    if distance<=GPS_RADIUS: score+=30
    if duplicate_count==0: score+=20
    else: flags.append("DUPLICATE_PATTERN")
    if distance>GPS_RADIUS: flags.append("GPS_MISMATCH")
    if not ai or not ai["accepted"]: flags.append("AI_UNCERTAIN")
    level="LOW" if score>=90 else ("MEDIUM" if score>=65 else "HIGH")
    return score,level,flags

@app.post("/verify")
def verify(body:VerifyRequest,authorization:str|None=Header(default=None)):
    """
    On-site municipal worker verification of waste segregation and physical proximity.
    Auth: Bearer token (Role: worker)
    Body:
        report_id: int
        segregated: bool (worker approves/rejects sorting)
        worker_lat: float (-90 to 90)
        worker_lon: float (-180 to 180)
    Response:
        {"ok": true, "report_id": int, "status": "READY_FOR_COLLECTION",
         "verification_score": float, "risk_level": "LOW"|"MEDIUM"|"HIGH",
         "risk_flags": list, "ai": {...}, "distance_m": float, "qr_token": str, ...}
    Errors:
        401 Unauthorized (missing/invalid worker token)
        403 Forbidden (GPS distance > 50m, timestamp expired, worker rejected segregation, AI rejected)
        404 Not Found (report doesn't exist)
        409 Conflict (report already collected or already verified)
        502 Bad Gateway (AI multimodal vision error)
    """
    worker=require_role(authorization,"worker"); report,ai,old_worker,collection=load_report(body.report_id)
    if not report: raise HTTPException(404,"Report not found")
    if collection: raise HTTPException(409,"Report is already collected")
    if old_worker: raise HTTPException(409,"Worker verification already recorded")
    if not ai:
        try: result=verify_image(report["image_path"])
        except Exception as e: raise HTTPException(502,f"Image verification failed: {e}")
        c=get_conn(); c.execute("INSERT INTO ai_verifications(report_id,predicted_category,accepted,confidence,explanation,model,verified_at) VALUES(?,?,?,?,?,?,?)",(body.report_id,result["category"],int(result["accepted"]),result["confidence"],result["explanation"],result["model"],iso(now()))); c.commit(); c.close(); report,ai,old_worker,collection=load_report(body.report_id)
    age=now()-parse_dt(report["captured_at"])
    if age<timedelta(seconds=-60) or age>timedelta(minutes=WINDOW_MIN): raise HTTPException(403,"Timestamp/freshness gate failed")
    if not body.segregated:
        c=get_conn(); c.execute("UPDATE reports SET status=?,risk_level=?,risk_flags=? WHERE id=?",("WORKER_REJECTED","HIGH",json.dumps(["WORKER_REJECTED"]),body.report_id)); c.commit(); c.close(); raise HTTPException(403,"Worker rejected segregation; no QR and no credits")
    if not ai["accepted"]: raise HTTPException(403,"AI verification did not pass")
    if ai["predicted_category"]!=report["category"]: raise HTTPException(403,f"AI classified {ai['predicted_category']}, but report says {report['category']}")
    distance=haversine_m(report["report_lat"],report["report_lon"],body.worker_lat,body.worker_lon)
    if distance>GPS_RADIUS: raise HTTPException(403,f"GPS gate failed: worker is {distance:.2f} m away; maximum is {GPS_RADIUS:.0f} m")
    c=get_conn(); dup_count=c.execute("SELECT COUNT(*) n FROM reports WHERE image_sha256=?",(report["image_sha256"],)).fetchone()["n"]; c.close()
    score,level,flags=risk_and_score(report,ai,distance,dup_count-1)
    token=make_qr_token(); verified=iso(now())
    c=get_conn(); c.execute("INSERT INTO worker_verifications(report_id,worker_id,segregated,worker_lat,worker_lon,distance_m,verified_at) VALUES(?,?,?,?,?,?,?)",(body.report_id,worker["id"],1,body.worker_lat,body.worker_lon,distance,verified)); c.execute("UPDATE reports SET qr_token_hash=?,status=?,verification_score=?,risk_level=?,risk_flags=? WHERE id=?",(hash_token(token),"READY_FOR_COLLECTION",score,level,json.dumps(flags),body.report_id)); c.commit(); c.close()
    return {"ok":True,"report_id":body.report_id,"status":"READY_FOR_COLLECTION","verification_score":score,"risk_level":level,"risk_flags":flags,"ai":{"category":ai["predicted_category"],"accepted":bool(ai["accepted"]),"confidence":ai["confidence"],"explanation":ai["explanation"],"model":ai["model"]},"distance_m":round(distance,2),"gps_limit_m":GPS_RADIUS,"qr_token":token,"verified_at":verified}

@app.post("/collect")
def collect(body:CollectRequest,authorization:str|None=Header(default=None)):
    """
    Physical waste handover collection and credit ledger deposit.
    Auth: Bearer token (Role: worker - must match the verifying worker)
    Body:
        report_id: int
        qr_token: str (one-time URL-safe token presented by citizen)
        worker_lat: float (-90 to 90)
        worker_lon: float (-180 to 180)
    Response:
        {"ok": true, "report_id": int, "status": "COLLECTED", "credits_awarded": int, "user": {...}, ...}
    Errors:
        401 Unauthorized (missing/invalid worker token)
        403 Forbidden (GPS distance > 50m, token mismatch, worker ID mismatch, unverified report)
        404 Not Found (report doesn't exist)
        409 Conflict (QR already consumed / replay attack)
    """
    worker=require_role(authorization,"worker"); report,ai,wcheck,collection=load_report(body.report_id)
    if not report: raise HTTPException(404,"Report not found")
    if collection: raise HTTPException(409,"QR has already been consumed")
    if not wcheck: raise HTTPException(403,"Worker verification is required first")
    if wcheck["worker_id"]!=worker["id"]: raise HTTPException(403,"Only the verifying worker can collect this report")
    distance=haversine_m(report["report_lat"],report["report_lon"],body.worker_lat,body.worker_lon)
    if distance>GPS_RADIUS: raise HTTPException(403,f"Collection GPS gate failed: {distance:.2f} m > {GPS_RADIUS:.0f} m")
    if not report["qr_token_hash"] or not token_matches(body.qr_token,report["qr_token_hash"]): raise HTTPException(403,"Invalid one-time QR token")
    collected=iso(now()); points=BASE_CREDITS + ({"HAZARDOUS":5,"WET":2,"DRY":3}.get(report["category"],0))
    c=get_conn(); c.execute("INSERT INTO collections(report_id,worker_id,collected_at,qr_used) VALUES(?,?,?,1)",(body.report_id,worker["id"],collected)); c.execute("UPDATE reports SET status=?,qr_token_hash=NULL WHERE id=?",("COLLECTED",body.report_id)); cur=c.execute("INSERT OR IGNORE INTO credit_transactions(user_id,report_id,points,reason,created_at) VALUES(?,?,?,?,?)",(report["user_id"],body.report_id,points,"VERIFIED_COLLECTION",collected)); awarded=points if cur.rowcount==1 else 0
    if awarded: c.execute("UPDATE users SET points=points+? WHERE id=?",(awarded,report["user_id"]))
    c.commit(); user=c.execute("SELECT id,name,role,points FROM users WHERE id=?",(report["user_id"],)).fetchone(); c.close()
    return {"ok":True,"report_id":body.report_id,"status":"COLLECTED","credits_awarded":awarded,"user":dict(user),"collected_at":collected,"collection_distance_m":round(distance,2)}

@app.get("/reports/mine")
def reports_mine(authorization:str|None=Header(default=None)):
    """Fetch all waste reports submitted by the currently authenticated citizen.

    Requires Bearer token with 'citizen' role.
    Joins AI verification, worker physical check, and collection audit timestamps.

    Returns:
        List[dict]: Array of report objects belonging to the authenticated citizen.
    """
    user=require_role(authorization,"citizen"); c=get_conn(); rows=c.execute("""SELECT r.id,r.user_id,u.name citizen,r.category,r.report_lat,r.report_lon,r.captured_at,r.status,r.verification_score,r.risk_level,r.risk_flags,a.predicted_category,a.accepted ai_accepted,a.confidence,a.explanation,a.model,a.verified_at ai_verified_at,w.worker_id,w.distance_m,w.verified_at worker_verified_at,col.collected_at FROM reports r JOIN users u ON u.id=r.user_id LEFT JOIN ai_verifications a ON a.report_id=r.id LEFT JOIN worker_verifications w ON w.report_id=r.id LEFT JOIN collections col ON col.report_id=r.id WHERE r.user_id=? ORDER BY r.id DESC""",(user["id"],)).fetchall(); c.close(); return [dict(x) for x in rows]

@app.get("/reports")
def reports(authorization:str|None=Header(default=None)):
    """Administrative municipal audit endpoint returning all system reports.

    Requires Bearer token with 'admin' role.
    Includes full operational metadata: citizen identity, geo-coordinates,
    AI model verdicts, worker proximity distance, and collection timestamps.

    Returns:
        List[dict]: Array of all reports across all citizens in reverse chronological order.
    """
    require_role(authorization,"admin"); c=get_conn(); rows=c.execute("""SELECT r.id,r.user_id,u.name citizen,r.category,r.report_lat,r.report_lon,r.captured_at,r.status,r.verification_score,r.risk_level,r.risk_flags,a.predicted_category,a.accepted ai_accepted,a.confidence,a.explanation,a.model,a.verified_at ai_verified_at,w.worker_id,w.distance_m,w.verified_at worker_verified_at,col.collected_at FROM reports r JOIN users u ON u.id=r.user_id LEFT JOIN ai_verifications a ON a.report_id=r.id LEFT JOIN worker_verifications w ON w.report_id=r.id LEFT JOIN collections col ON col.report_id=r.id ORDER BY r.id DESC""").fetchall(); c.close(); return [dict(x) for x in rows]

@app.get("/reports/{report_id}/timeline")
def timeline(report_id:int,authorization:str|None=Header(default=None)):
    """Retrieve the tamper-evident 5-stage lifecycle audit trail for a report.

    Lifecycle stages:
        1. REPORT: Initial citizen submission timestamp & geo-tag.
        2. AI VERIFY: Multimodal AI classification, confidence, and model name.
        3. WORKER VERIFY: Physical worker segregation check and GPS distance.
        4. COLLECT: One-time dynamic QR code burn and handoff confirmation.
        5. EARN: Immutable ledger credit reward transaction.

    Authorized for report owner (citizen), sanitation workers, and municipal admins.
    """
    current=auth_user(authorization); r,a,w,col=load_report(report_id)
    if not r: raise HTTPException(404,"Report not found")
    if current["role"] not in {"admin","worker"} and current["id"]!=r["user_id"]: raise HTTPException(403,"Not allowed")
    events=[{"stage":"REPORT","time":r["captured_at"],"status":"SUBMITTED","detail":"Citizen evidence captured with server timestamp"}]
    if a: events.append({"stage":"AI VERIFY","time":a["verified_at"],"status":"PASSED" if a["accepted"] else "REJECTED","detail":f"{a['predicted_category']} · {a['confidence']:.0%} confidence"})
    if w: events.append({"stage":"WORKER VERIFY","time":w["verified_at"],"status":"PASSED" if w["segregated"] else "REJECTED","detail":f"GPS distance {w['distance_m']:.1f} m"})
    if col: events.append({"stage":"COLLECT","time":col["collected_at"],"status":"CONFIRMED","detail":"One-time QR consumed; credit ledger unlocked"})
    c=get_conn(); tx=c.execute("SELECT points,created_at FROM credit_transactions WHERE report_id=?",(report_id,)).fetchone(); c.close()
    if tx: events.append({"stage":"EARN","time":tx["created_at"],"status":"CREDITED","detail":f"+{tx['points']} Credits"})
    return {"report_id":report_id,"status":r["status"],"verification_score":r["verification_score"],"risk_level":r["risk_level"],"events":events}

@app.get("/wallet/{user_id}")
def wallet(user_id:int,authorization:str|None=Header(default=None)):
    """Retrieve the current points balance and transaction ledger for a user.

    Citizens can only access their own wallet; admins have universal read access.

    Returns:
        dict: {"user": {id, name, role, points}, "transactions": [{report_id, points, reason, created_at}, ...]}
    """
    current=auth_user(authorization)
    if current["id"]!=user_id and current["role"]!="admin": raise HTTPException(403,"Not allowed")
    c=get_conn(); user=c.execute("SELECT id,name,role,points FROM users WHERE id=?",(user_id,)).fetchone(); tx=c.execute("SELECT report_id,points,reason,created_at FROM credit_transactions WHERE user_id=? ORDER BY id DESC",(user_id,)).fetchall(); c.close()
    if not user: raise HTTPException(404,"User not found")
    return {"user":dict(user),"transactions":[dict(x) for x in tx]}

@app.get("/leaderboard")
def leaderboard():
    """Public citizen gamification leaderboard returning top 20 civic contributors.

    Returns:
        List[dict]: Sorted list of citizen records containing id, name, and total points.
    """
    c=get_conn(); rows=c.execute("SELECT id,name,points FROM users WHERE role='citizen' ORDER BY points DESC,name LIMIT 20").fetchall(); c.close(); return [dict(x) for x in rows]

@app.get("/analytics")
def analytics(authorization:str|None=Header(default=None)):
    """Municipal administrative telemetry and KPI intelligence endpoint.

    Requires Bearer token with 'admin' role.
    Aggregates global system metrics: total submissions, verification count,
    collection count, municipal diversion rate, waste category breakdown,
    risk tier distributions, and geospatial dumping hotspots (>= 2 incidents).

    Returns:
        dict: Aggregated analytics payload for admin command center charts and KPIs.
    """
    require_role(authorization,"admin"); c=get_conn()
    total=c.execute("SELECT COUNT(*) n FROM reports").fetchone()["n"]; verified=c.execute("SELECT COUNT(*) n FROM worker_verifications").fetchone()["n"]; collected=c.execute("SELECT COUNT(*) n FROM collections").fetchone()["n"]; credits=c.execute("SELECT COALESCE(SUM(points),0) n FROM credit_transactions").fetchone()["n"]; users=c.execute("SELECT COUNT(*) n FROM users WHERE role='citizen'").fetchone()["n"]
    cats=[dict(x) for x in c.execute("SELECT category,COUNT(*) count FROM reports GROUP BY category ORDER BY count DESC").fetchall()]
    hotspots=[dict(x) for x in c.execute("SELECT ROUND(report_lat,3) lat,ROUND(report_lon,3) lon,COUNT(*) reports FROM reports GROUP BY ROUND(report_lat,3),ROUND(report_lon,3) HAVING COUNT(*)>=2 ORDER BY reports DESC LIMIT 10").fetchall()]
    risks=[dict(x) for x in c.execute("SELECT risk_level,COUNT(*) count FROM reports GROUP BY risk_level").fetchall()]; c.close()
    return {"totals":{"reports":total,"verified":verified,"collected":collected,"citizens":users,"credits":credits},"collection_rate":round((collected/total*100) if total else 0,1),"categories":cats,"risk_distribution":risks,"hotspots":hotspots}

@app.get("/reports/{report_id}/image")
def report_image(report_id:int,authorization:str|None=Header(default=None)):
    """Stream evidence image for a specific waste report from local storage.

    Access is restricted to the citizen owner, field workers, or municipal admins.
    Validates token authorization before serving the binary file.
    """
    current=auth_user(authorization); c=get_conn(); row=c.execute("SELECT image_path,user_id FROM reports WHERE id=?",(report_id,)).fetchone(); c.close()
    if not row: raise HTTPException(404,"Image not found")
    if current["role"] not in {"admin","worker"} and current["id"]!=row["user_id"]: raise HTTPException(403,"Not allowed")
    path=Path(row["image_path"])
    if not path.exists(): raise HTTPException(404,"Image not found")
    return FileResponse(path)

