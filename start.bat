@echo off
title CleanCred — Verified Waste Action & Green Credits Platform
echo ===================================================
echo   CleanCred — Smart India Hackathon 2026
echo   Team GreenLegacy ^| Problem Statement SIH26195
echo   Verified waste recovery
echo ===================================================

cd /d "%~dp0"

echo Opening browser at http://127.0.0.1:8081 ...
start http://127.0.0.1:8081

echo Starting local server on port 8081...
python server.py

pause
