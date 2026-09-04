@echo off
echo ===================================================
echo   Starting VANVISION Forest Rights DSS Dev Server
echo ===================================================
if not exist "V:\" (
    subst V: "%~dp0"
)
cd /d V:\
call npm run dev
