@echo off
title CLEANCRED — Municipal Waste Command Center
echo ===================================================
echo   Starting CLEANCRED Platform...
echo   ISRO Telemetry Command Center Aesthetic
echo ===================================================

cd /d "%~dp0"

echo Opening browser at http://127.0.0.1:8081 ...
start http://127.0.0.1:8081

echo Starting local server on port 8081...
python server.py

pause
