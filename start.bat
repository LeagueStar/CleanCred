@echo off
title CLEANCRED — Municipal Waste Management System
echo ===================================================
echo   Starting CleanCred Platform...
echo   Backend: FastAPI + SQLite (Port 8000)
echo   Frontend: Neumorphism UI (Port 8081)
echo ===================================================

cd /d "%~dp0"

echo [1/2] Starting Backend Engine on port 8000...
start "CleanCred Backend" cmd /k "cd backend && python -m uvicorn main:app --host 0.0.0.0 --port 8000"

timeout /t 2 /nobreak >nul

echo [2/2] Starting Frontend Web Server on port 8081...
start http://127.0.0.1:8081
cd frontend && python server.py
