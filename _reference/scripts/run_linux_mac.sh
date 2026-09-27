#!/usr/bin/env bash
# REFERENCE ONLY: This script is for reference and will not run as-is from this directory.
set -e
cd "$(dirname "$0")/../backend"
if [ ! -f .env ]; then cp .env.example .env; fi
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
echo "Add GEMINI_API_KEY to backend/.env"
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
