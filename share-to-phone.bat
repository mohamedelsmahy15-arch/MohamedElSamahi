@echo off
title تشغيل السماحي OS ومشاركته مع الهاتف
cd /d "%~dp0"
set PATH=C:\Program Files\nodejs;C:\Program Files (x86)\cloudflared;%PATH%

echo ====================================================
echo   تشغيل نظام السماحي OS وإنشاء رابط للموبايل
echo ====================================================
echo.
echo [1] جاري تشغيل خادم التطبيق على المنفذ 3000...
start cmd /k "npm run dev"

echo [2] جاري إنشاء رابط إنترنت عام مشفر للهاتف...
echo.
echo انسخ الرابط الذي سينتهي بـ .trycloudflare.com وافتحه من متصفح هاتفك!
echo.
"C:\Program Files (x86)\cloudflared\cloudflared.exe" tunnel --url http://localhost:3000
pause
