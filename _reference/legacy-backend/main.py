from fastapi import FastAPI, HTTPException, UploadFile, File, Form, Request, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy import create_engine, Column, Integer, String, Float, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import declarative_base, sessionmaker, relationship
from datetime import datetime
from pathlib import Path
from typing import Optional, List, Dict, Any
from pydantic import BaseModel
import shutil
import uuid
import random

# Gupta's Geodesic Proximity Verification module
from proximity import within_50_meters as geo_within_50m

# Deterministic Catalog-Based Purity module
from purity import calculate_purity_score

# -------------------------------------------------
# DATABASE SETUP
# -------------------------------------------------
DATABASE_URL = "sqlite:///./cleancred.db"

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
Base = declarative_base()

# -------------------------------------------------
# DATABASE MODELS
# -------------------------------------------------
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    phone = Column(String, nullable=True)
    address = Column(String, nullable=True)
    green_points = Column(Integer, default=1250)
    created_at = Column(DateTime, default=datetime.utcnow)

    reports = relationship("WasteReport", back_populates="user")


class WasteReport(Base):
    __tablename__ = "waste_reports"

    id = Column(Integer, primary_key=True, index=True)
    request_id = Column(String, unique=True, index=True, nullable=True)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    waste_type = Column(String, nullable=False)
    category = Column(String, nullable=True)
    subtype = Column(String, nullable=True)
    pickup_slot = Column(String, nullable=True)
    otp = Column(String, nullable=True)
    worker_name = Column(String, nullable=True)
    worker_eta = Column(Integer, nullable=True)
    address = Column(String, nullable=True)

    approximate_weight = Column(Float, default=0)

    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)

    image_path = Column(String, nullable=True)

    ai_segregated = Column(Boolean, nullable=True)
    verification_status = Column(String, default="pending")
    collection_status = Column(String, default="reported")

    worker_latitude = Column(Float, nullable=True)
    worker_longitude = Column(Float, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="reports")


class PointTransaction(Base):
    __tablename__ = "point_transactions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    points = Column(Integer, nullable=False)
    reason = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class DumpingReport(Base):
    __tablename__ = "dumping_reports"

    id = Column(Integer, primary_key=True, index=True)
    report_id = Column(String, unique=True, index=True)
    location = Column(String, nullable=False)
    waste_type = Column(String, nullable=False)
    status = Column(String, default="Submitted")
    photo_url = Column(String, nullable=True)
    reward_gp = Column(Integer, default=20)
    created_at = Column(DateTime, default=datetime.utcnow)


Base.metadata.create_all(bind=engine)

# -------------------------------------------------
# SEED CITIZEN USER
# -------------------------------------------------
def init_seed_user():
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.id == 1).first()
        if not user:
            user = User(
                id=1,
                name="Shivansh Prajapati",
                email="shivansh.green@karma.org",
                phone="+91 98765 43210",
                address="Flat 402, Green Meadows, Ward 4B, Mumbai",
                green_points=1250,
            )
            db.add(user)
            db.commit()
    finally:
        db.close()

init_seed_user()

# -------------------------------------------------
# FASTAPI APP & CORS (STEP 4)
# -------------------------------------------------
app = FastAPI(
    title="CleanCred Backend Engine",
    description="Unified backend for waste reporting, geodesic proximity verification, deterministic purity checking, and Green Points ledger",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)
app.mount("/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")


# -------------------------------------------------
# HELPER FUNCTIONS
# -------------------------------------------------
def get_db():
    return SessionLocal()


def resolve_user(db, user_id_val: Any) -> Optional[User]:
    """Find user by numeric ID or fallback to the seed citizen user."""
    user = None
    try:
        uid = int(user_id_val)
        user = db.query(User).filter(User.id == uid).first()
    except (ValueError, TypeError):
        pass

    if not user and str(user_id_val) in ("usr_shivansh_99", "citizen", "1"):
        user = db.query(User).filter(User.id == 1).first()

    if not user:
        user = db.query(User).first()
    return user


def find_report(db, report_identifier: Any) -> Optional[WasteReport]:
    """Find waste report by primary key or request_id string (e.g. GK-2026-89421)."""
    if str(report_identifier).isdigit():
        rep = db.query(WasteReport).filter(WasteReport.id == int(report_identifier)).first()
        if rep:
            return rep
    rep = db.query(WasteReport).filter(WasteReport.request_id == str(report_identifier)).first()
    return rep


def add_points(db, user_id: int, points: int, reason: str):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return

    user.green_points += points
    transaction = PointTransaction(
        user_id=user_id,
        points=points,
        reason=reason
    )
    db.add(transaction)
    db.commit()


def report_to_dict(report: WasteReport) -> dict:
    """Serialize report with full schema expected by frontend UI/UX."""
    points_map = {"wet": 10, "dry": 7, "harmful": 5}
    cat = (report.category or report.waste_type or "wet").lower()
    category_name_map = {
        "wet": "Wet Waste (Organic)",
        "dry": "Dry Waste (Recyclable)",
        "harmful": "Harmful Waste (Hazardous)"
    }

    # Map database status to state.js pickup status:
    status = "created"
    if report.verification_status == "approved":
        status = "verified"
    elif report.verification_status == "rejected":
        status = "rejected"
    elif report.collection_status == "collected":
        status = "collected"
    elif report.collection_status in ("assigned", "on_the_way"):
        status = report.collection_status

    created_iso = report.created_at.isoformat() if report.created_at else datetime.utcnow().isoformat()
    req_id = report.request_id or f"GK-{report.created_at.year if report.created_at else 2026}-{report.id:05d}"

    return {
        "id": req_id,
        "report_id": report.id,
        "requestId": req_id,
        "user_id": report.user_id,
        "userName": report.user.name if report.user else "Shivansh Prajapati",
        "category": cat,
        "categoryName": category_name_map.get(cat, "Wet Waste (Organic)"),
        "waste_type": cat,
        "subType": report.subtype or "General segregated waste",
        "subtype": report.subtype or "General segregated waste",
        "quantityKg": report.approximate_weight or 3.0,
        "approximate_weight": report.approximate_weight or 3.0,
        "pointsReward": points_map.get(cat, 5),
        "pointsCredited": points_map.get(cat, 5) if report.verification_status == "approved" else 0,
        "address": report.address or "Flat 402, Green Meadows, Ward 4B, Mumbai",
        "pickupSlot": report.pickup_slot or "Morning Route (08:00 AM - 11:00 AM)",
        "pickup_slot": report.pickup_slot or "Morning Route (08:00 AM - 11:00 AM)",
        "scheduledDate": "Today",
        "scheduledTime": "08:00 AM - 11:00 AM",
        "status": status,
        "workerName": report.worker_name or "DemoCollector (Ward 4B Fleet)",
        "worker_name": report.worker_name or "DemoCollector (Ward 4B Fleet)",
        "workerPhone": "+91 98111 22334",
        "vehicleNo": "MH-02-GK-4091",
        "otp": report.otp or "8492",
        "etaMinutes": report.worker_eta if report.worker_eta is not None else 18,
        "worker_eta": report.worker_eta if report.worker_eta is not None else 18,
        "latitude": report.latitude,
        "longitude": report.longitude,
        "geoCoords": [report.latitude, report.longitude] if (report.latitude and report.longitude) else [19.0760, 72.8777],
        "image_path": report.image_path,
        "photoUrl": f"http://localhost:8000/{report.image_path}" if report.image_path else "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&q=80",
        "photoSource": "upload" if report.image_path else "demo",
        "ai_segregated": report.ai_segregated,
        "verification_status": report.verification_status,
        "collection_status": report.collection_status,
        "createdAt": created_iso,
        "created_at": report.created_at
    }


# -------------------------------------------------
# BASIC ROUTES
# -------------------------------------------------
@app.get("/")
def home():
    return {
        "status": "online",
        "message": "CleanCred Backend Engine v2.0 is running",
        "docs": "http://localhost:8000/docs"
    }


# -------------------------------------------------
# USER ROUTES
# -------------------------------------------------
@app.post("/users")
def create_user(name: str, email: str, phone: Optional[str] = None, address: Optional[str] = None):
    db = get_db()
    try:
        existing_user = db.query(User).filter(User.email == email).first()
        if existing_user:
            raise HTTPException(
                status_code=400,
                detail="User with this email already exists"
            )

        user = User(
            name=name,
            email=email,
            phone=phone,
            address=address,
            green_points=1250
        )
        db.add(user)
        db.commit()
        db.refresh(user)

        return {
            "message": "User created successfully",
            "user_id": user.id,
            "green_points": user.green_points
        }
    finally:
        db.close()


@app.get("/users/{user_id}")
def get_user(user_id: str):
    db = get_db()
    try:
        user = resolve_user(db, user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        return {
            "id": user.id,
            "backendId": user.id,
            "name": user.name,
            "email": user.email,
            "phone": user.phone or "+91 98765 43210",
            "address": user.address or "Flat 402, Green Meadows, Ward 4B, Mumbai",
            "green_points": user.green_points,
            "greenPoints": user.green_points
        }
    finally:
        db.close()


# PUT /users/{user_id} — Profile save (STEP 3 & 5)
class UserUpdateRequest(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None

@app.put("/users/{user_id}")
async def update_user(user_id: str, request: Request):
    db = get_db()
    try:
        user = resolve_user(db, user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        # Parse either JSON or Form data
        content_type = request.headers.get("content-type", "")
        if "application/json" in content_type:
            data = await request.json()
        else:
            form = await request.form()
            data = dict(form)

        if "name" in data and data["name"]:
            user.name = str(data["name"])
        if "email" in data and data["email"]:
            user.email = str(data["email"])
        if "phone" in data and data["phone"]:
            user.phone = str(data["phone"])
        if "address" in data and data["address"]:
            user.address = str(data["address"])

        db.commit()
        db.refresh(user)

        return {
            "message": "Profile updated successfully",
            "user": {
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "phone": user.phone,
                "address": user.address,
                "green_points": user.green_points
            }
        }
    finally:
        db.close()


# POST /users/{user_id}/redeem — Redeem Points (STEP 3 & 5)
@app.post("/users/{user_id}/redeem")
async def redeem_points(user_id: str, request: Request):
    db = get_db()
    try:
        user = resolve_user(db, user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        content_type = request.headers.get("content-type", "")
        if "application/json" in content_type:
            data = await request.json()
        else:
            form = await request.form()
            data = dict(form)

        amount_gp = int(data.get("amountGp") or data.get("amount_gp") or data.get("amount") or 100)
        category = str(data.get("category") or "RECHARGE")
        title = str(data.get("title") or "Green Credits Redemption")
        metadata = str(data.get("metadata") or data.get("meta") or "")

        if user.green_points < amount_gp:
            raise HTTPException(status_code=400, detail="Insufficient Green Credits balance")

        user.green_points -= amount_gp

        transaction = PointTransaction(
            user_id=user.id,
            points=-amount_gp,
            reason=f"Redeemed: {title} ({category})"
        )
        db.add(transaction)
        db.commit()

        inr_value = (amount_gp // 100) * 10

        return {
            "success": True,
            "message": f"{title} applied successfully",
            "redeemed_points": amount_gp,
            "new_balance": user.green_points,
            "newBalanceGp": user.green_points,
            "inrValue": inr_value
        }
    finally:
        db.close()


# -------------------------------------------------
# WASTE REPORT ROUTES (STEP 3 & 5)
# -------------------------------------------------
@app.post("/reports")
def create_report(
    user_id: Optional[str] = Form("1"),
    waste_type: Optional[str] = Form("wet"),
    category: Optional[str] = Form(None),
    subtype: Optional[str] = Form(None),
    subType: Optional[str] = Form(None),
    approximate_weight: Optional[float] = Form(3.0),
    quantity: Optional[float] = Form(None),
    latitude: Optional[float] = Form(19.0760),
    longitude: Optional[float] = Form(72.8777),
    address: Optional[str] = Form(None),
    pickup_slot: Optional[str] = Form(None),
    pickupSlot: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None)
):
    db = get_db()
    try:
        user = resolve_user(db, user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        resolved_category = (category or waste_type or "wet").lower()
        resolved_subtype = subtype or subType or "General segregated waste"
        resolved_weight = quantity if quantity is not None else (approximate_weight or 3.0)
        resolved_slot = pickupSlot or pickup_slot or "Morning Route (08:00 AM - 11:00 AM)"
        resolved_address = address or user.address or "Flat 402, Green Meadows, Ward 4B, Mumbai"

        # Generate request_id in same format as frontend formatters.js: GK-2026-XXXXX
        year = datetime.utcnow().year
        random_suffix = random.randint(10000, 99999)
        request_id = f"GK-{year}-{random_suffix}"

        # Generate 4-digit OTP
        otp_str = str(random.randint(1000, 9999))

        image_path = None
        if image and image.filename:
            extension = Path(image.filename).suffix
            filename = f"{uuid.uuid4()}{extension}"
            image_path = str(UPLOAD_DIR / filename)
            with open(image_path, "wb") as buffer:
                shutil.copyfileobj(image.file, buffer)

        report = WasteReport(
            request_id=request_id,
            user_id=user.id,
            waste_type=resolved_category,
            category=resolved_category,
            subtype=resolved_subtype,
            approximate_weight=resolved_weight,
            latitude=latitude if latitude is not None else 19.0760,
            longitude=longitude if longitude is not None else 72.8777,
            address=resolved_address,
            pickup_slot=resolved_slot,
            otp=otp_str,
            worker_name="DemoCollector (Ward 4B Fleet)",
            worker_eta=18,
            image_path=image_path,
            verification_status="pending",
            collection_status="created"
        )

        db.add(report)
        db.commit()
        db.refresh(report)

        return {
            "message": "Waste report created successfully",
            "report": report_to_dict(report)
        }
    finally:
        db.close()


@app.get("/reports/{report_id}")
def get_report(report_id: str):
    db = get_db()
    try:
        report = find_report(db, report_id)
        if not report:
            raise HTTPException(status_code=404, detail="Report not found")
        return report_to_dict(report)
    finally:
        db.close()


@app.get("/users/{user_id}/reports")
def get_user_reports(user_id: str):
    db = get_db()
    try:
        user = resolve_user(db, user_id)
        if not user:
            return []

        reports = db.query(WasteReport).filter(
            WasteReport.user_id == user.id
        ).order_by(WasteReport.id.desc()).all()

        return [report_to_dict(report) for report in reports]
    finally:
        db.close()


# -------------------------------------------------
# LOCATION VERIFICATION (STEP 1: Gupta's Proximity)
# -------------------------------------------------
@app.post("/reports/{report_id}/verify-location")
def verify_location(
    report_id: str,
    worker_latitude: float = 19.0761,
    worker_longitude: float = 72.8778
):
    """Gupta's geodesic proximity verification."""
    db = get_db()
    try:
        report = find_report(db, report_id)
        if not report:
            raise HTTPException(status_code=404, detail="Report not found")

        # Gupta's function takes two (lat, lon) tuples:
        is_near = geo_within_50m(
            (report.latitude, report.longitude),
            (worker_latitude, worker_longitude)
        )

        report.worker_latitude = worker_latitude
        report.worker_longitude = worker_longitude
        db.commit()

        return {
            "report_id": report.request_id or report.id,
            "within_50_meters": is_near
        }
    finally:
        db.close()


# -------------------------------------------------
# AI / WORKER VERIFICATION (STEP 2: Deterministic Purity Check)
# -------------------------------------------------
@app.post("/reports/{report_id}/verify")
def verify_report(
    report_id: str,
    segregated: Optional[bool] = None,
    source: str = "worker"
):
    """Deterministic catalog-based purity verification."""
    db = get_db()
    try:
        report = find_report(db, report_id)
        if not report:
            raise HTTPException(status_code=404, detail="Report not found")

        # Reconciled deterministic purity check logic (STEP 2):
        score, accepted, rationale = calculate_purity_score(
            report.waste_type or report.category,
            report.subtype
        )

        # Segregated flag is driven deterministically by the purity check
        segregated = accepted

        # Prevent duplicate points
        already_verified = report.verification_status == "approved"
        report.ai_segregated = segregated

        points_awarded = 0
        if segregated:
            report.verification_status = "approved"
            if not already_verified:
                points_map = {"wet": 10, "dry": 7, "harmful": 5}
                cat = (report.waste_type or report.category or "wet").lower()
                points_awarded = points_map.get(cat, 10)
                add_points(
                    db,
                    report.user_id,
                    points_awarded,
                    f"Verified segregated {cat} waste report #{report.request_id or report.id}"
                )
        else:
            report.verification_status = "rejected"

        db.commit()

        return {
            "report_id": report.request_id or report.id,
            "segregated": segregated,
            "purity_score": score,
            "accepted": accepted,
            "rationale": rationale,
            "points_awarded": points_awarded,
            "verification_status": report.verification_status,
            "verification_source": source
        }
    finally:
        db.close()


# -------------------------------------------------
# COLLECTION STATUS (STEP 3 & 5)
# -------------------------------------------------
@app.post("/reports/{report_id}/collect")
def update_collection_status(
    report_id: str,
    status: str = "collected"
):
    db = get_db()
    try:
        report = find_report(db, report_id)
        if not report:
            raise HTTPException(status_code=404, detail="Report not found")

        report.collection_status = status
        db.commit()

        return {
            "message": "Collection status updated",
            "report_id": report.request_id or report.id,
            "collection_status": report.collection_status
        }
    finally:
        db.close()


# -------------------------------------------------
# DUMPING REPORTS (STEP 3: Missing Endpoint)
# -------------------------------------------------
@app.post("/dumping-reports")
async def create_dumping_report(request: Request):
    db = get_db()
    try:
        content_type = request.headers.get("content-type", "")
        if "application/json" in content_type:
            data = await request.json()
        else:
            form = await request.form()
            data = dict(form)

        location = str(data.get("location") or "Under Flyover, Link Road, Ward 4B")
        waste_type = str(data.get("wasteType") or data.get("waste_type") or "Construction Debris & Mixed Plastics")
        photo_url = str(data.get("photoUrl") or data.get("photo_url") or "https://images.unsplash.com/photo-1611288875785-58586c06a4b1?w=300&q=80")
        reward_gp = int(data.get("rewardGp") or data.get("reward_gp") or 20)

        dumping_id = f"DUMP-2026-{random.randint(100, 999)}"
        dump_report = DumpingReport(
            report_id=dumping_id,
            location=location,
            waste_type=waste_type,
            status="Submitted",
            photo_url=photo_url,
            reward_gp=reward_gp
        )
        db.add(dump_report)
        db.commit()
        db.refresh(dump_report)

        return {
            "id": dump_report.report_id,
            "location": dump_report.location,
            "wasteType": dump_report.waste_type,
            "status": dump_report.status,
            "photoUrl": dump_report.photo_url,
            "rewardGp": dump_report.reward_gp,
            "reportedAt": dump_report.created_at.isoformat()
        }
    finally:
        db.close()


# -------------------------------------------------
# POINTS / REWARDS
# -------------------------------------------------
@app.get("/users/{user_id}/points")
def get_user_points(user_id: str):
    db = get_db()
    try:
        user = resolve_user(db, user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        transactions = db.query(PointTransaction).filter(
            PointTransaction.user_id == user.id
        ).order_by(PointTransaction.id.desc()).all()

        return {
            "user_id": user.id,
            "total_green_points": user.green_points,
            "transactions": [
                {
                    "id": f"TXN-{item.id:06d}",
                    "points": item.points,
                    "reason": item.reason,
                    "created_at": item.created_at.isoformat() if item.created_at else None
                }
                for item in transactions
            ]
        }
    finally:
        db.close()


# -------------------------------------------------
# LIVE DASHBOARD DATA (STEP 6: Kreya's Dashboard)
# -------------------------------------------------
@app.get("/dashboard")
def get_dashboard():
    """Live dashboard endpoint returning counts, recovery metrics, and waste summary."""
    db = get_db()
    try:
        reports = db.query(WasteReport).all()

        waste_summary = {"wet": 0.0, "dry": 0.0, "harmful": 0.0}

        for report in reports:
            cat = (report.category or report.waste_type or "wet").lower()
            weight = report.approximate_weight or 3.0
            waste_summary[cat] = waste_summary.get(cat, 0.0) + weight

        total_users = db.query(User).count()
        total_reports = len(reports)

        approved_reports = db.query(WasteReport).filter(
            WasteReport.verification_status == "approved"
        ).count()

        collected_reports = db.query(WasteReport).filter(
            WasteReport.collection_status == "collected"
        ).count()

        return {
            "total_users": total_users,
            "total_reports": total_reports,
            "approved_reports": approved_reports,
            "collected_reports": collected_reports,
            "waste_summary": waste_summary
        }
    finally:
        db.close()
