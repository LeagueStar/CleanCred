"""
CleanCred Multimodal AI Waste Classification Service
Connects to Google Gemini 2.5 Flash for computer vision segregation verification,
with a labeled local fallback (DEMO_AI_MODE=1) for offline hackathon testing.
"""

import json
import os
from pathlib import Path
from google import genai
from google.genai import types
from PIL import Image

ALLOWED = {"WET", "DRY", "HAZARDOUS"}
PROMPT = """
You are CleanCred's waste-segregation verification assistant.
Inspect ONLY the supplied image. Return JSON:
{"category":"WET|DRY|HAZARDOUS|UNKNOWN","accepted":true|false,"confidence":0.0,"explanation":"short evidence-based reason"}
Rules: WET=mostly organic/biodegradable; DRY=paper/cardboard/plastic/metal/glass and other dry recyclable waste; HAZARDOUS=batteries, chemicals, medical/sharp hazardous household waste. UNKNOWN if unclear, empty, unrelated or clearly mixed. Never infer from the user's selected category. accepted=true only when visual evidence is sufficient.
"""

def _extract_json(text: str) -> dict:
    """
    Extract structured JSON dictionary from Gemini markdown response.
    """
    text = (text or "").strip().replace("```json", "").replace("```", "").strip()
    start, end = text.find("{"), text.rfind("}")
    if start < 0 or end < 0: raise ValueError("Model did not return JSON")
    return json.loads(text[start:end+1])

def verify_image(image_path: str) -> dict:
    """
    Inspect waste image evidence using Gemini vision model or offline demo heuristic.

    Args:
        image_path (str): Path to stored image evidence file on disk.

    Returns:
        dict: Classification payload with category, accepted flag, confidence, explanation, and model name.
    """
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        if os.getenv("DEMO_AI_MODE", "0") == "1":
            return {"category":"DRY","accepted":True,"confidence":0.91,"explanation":"Demo mode: simulated classifier result. Replace with GEMINI_API_KEY for live image analysis.","model":"demo-simulator"}
        raise RuntimeError("GEMINI_API_KEY is not configured")
    model = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
    client = genai.Client(api_key=api_key)
    image = Image.open(Path(image_path))
    response = client.models.generate_content(
        model=model, contents=[PROMPT, image],
        config=types.GenerateContentConfig(response_mime_type="application/json", temperature=0),
    )
    result = _extract_json(response.text)
    category = str(result.get("category", "UNKNOWN")).upper()
    accepted = bool(result.get("accepted", False))
    confidence = max(0.0, min(1.0, float(result.get("confidence", 0))))
    if category not in ALLOWED: category, accepted = "UNKNOWN", False
    if confidence < 0.60: accepted = False
    return {"category":category,"accepted":accepted,"confidence":confidence,"explanation":str(result.get("explanation","No explanation returned."))[:500],"model":model}
