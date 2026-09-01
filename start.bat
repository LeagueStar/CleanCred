@echo off
title GREEN LEGACY Platform
echo ===================================================
echo   Starting GREEN LEGACY Platform...
echo   Tagline: EARN. RECYCLE. REWARD.
echo ===================================================

cd /d "%~dp0"

echo Opening browser at http://127.0.0.1:8081 ...
start http://127.0.0.1:8081

echo Starting local server on port 8081...
python server.py

pause
