@echo off
cd /d "%~dp0"
echo Starting dev server...
start /b npm run dev > dev.log 2>&1
timeout /t 10 /nobreak > nul
echo Testing login API...
node test-api.js
echo Stopping dev server...
taskkill /f /im node.exe > nul 2>&1
type dev.log
