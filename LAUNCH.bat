@echo off
echo ========================================
echo GDate2PDate Extension - Quick Launch
echo تبدیل تاریخ میلادی به شمسی - راه‌اندازی سریع
echo ========================================
echo.
echo Opening Chrome Extensions page...
echo در حال باز کردن صفحه افزونه‌های کروم...
echo.
start chrome.exe chrome://extensions/
echo.
echo Instructions:
echo 1. Enable "Developer mode" in top right
echo 2. Click "Load unpacked"
echo 3. Select folder: %~dp0
echo.
echo دستورالعمل:
echo 1. "Developer mode" را در گوشه بالا راست فعال کنید
echo 2. روی "Load unpacked" کلیک کنید
echo 3. این پوشه را انتخاب کنید: %~dp0
echo.
echo ========================================
echo Opening test page...
echo در حال باز کردن صفحه تست...
timeout /t 2 >nul
start chrome.exe "file:///%~dp0test.html"
echo.
echo Done! Check Chrome browser.
echo تمام شد! مرورگر کروم را بررسی کنید.
echo ========================================
pause
