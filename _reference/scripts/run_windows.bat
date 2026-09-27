REM REFERENCE ONLY: This script is for reference and will not run as-is from this directory.
@echo off
cd /d "%~dp0..\backend"
if not exist ".env" copy ".env.example" ".env"
python -m venv .venv
call .venv\Scripts\activate
python -m pip install -r requirements.txt
echo.
echo Add your GEMINI_API_KEY to backend\.env, then press any key.
pause
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
