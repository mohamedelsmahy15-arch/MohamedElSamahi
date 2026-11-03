@echo off
title رفع التحديثات إلى GitHub
cd /d "%~dp0"
echo ====================================================
echo   جاري رفع التحديثات وإصلاحات السحابة إلى GitHub...
echo ====================================================
echo.
git push -u origin main
echo.
pause
