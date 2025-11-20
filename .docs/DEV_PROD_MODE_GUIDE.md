# Development & Production Mode Guide

## تبدیل تاریخ میلادی به شمسی - راهنمای حالت‌های توسعه و تولید

This guide explains how to work with development and production modes in the GDate2PDate extension.

این راهنما نحوه کار با حالت‌های توسعه و تولید در افزونه GDate2PDate را توضیح می‌دهد.

---

## 📋 Overview / نمای کلی

The extension now supports two distinct modes:
افزونه اکنون از دو حالت مجزا پشتیبانی می‌کند:

### 🔧 Development Mode / حالت توسعه
- **Full logging enabled** / لاگ‌گیری کامل فعال
- **All debug messages** / تمام پیام‌های اشکال‌زدایی
- **Performance tracking** / ردیابی عملکرد
- **Format detection logs** / لاگ‌های تشخیص فرمت
- **Manifest marked with [DEV]** / Manifest با برچسب [DEV]
- **Version suffix: -dev** / پسوند نسخه: -dev

### 🚀 Production Mode / حالت تولید
- **Logging disabled** / لاگ‌گیری غیرفعال
- **Only errors logged** / فقط خطاها ثبت می‌شوند
- **Optimized performance** / عملکرد بهینه‌شده
- **Clean console** / کنسول تمیز
- **Standard manifest** / Manifest استاندارد
- **Clean version number** / شماره نسخه تمیز

---

## 🛠️ Build System / سیستم ساخت

### Creating Builds / ایجاد نسخه‌های ساخت

#### Development Build / ساخت توسعه
```powershell
.\build.ps1 -Mode dev
```

**Output:** `build-dev/` folder
**خروجی:** پوشه `build-dev/`

Features / ویژگی‌ها:
- All logging active / تمام لاگ‌ها فعال
- Debug console messages / پیام‌های کنسول اشکال‌زدایی
- Detailed conversion tracking / ردیابی تفصیلی تبدیل
- Extension name: "... [DEV]" / نام افزونه: "... [DEV]"
- Version: "1404.8.25-dev" / نسخه: "1404.8.25-dev"

#### Production Build / ساخت تولید
```powershell
.\build.ps1 -Mode prod
```

**Output:** `build-prod/` folder
**خروجی:** پوشه `build-prod/`

Features / ویژگی‌ها:
- No debug logs / بدون لاگ اشکال‌زدایی
- Only error messages / فقط پیام‌های خطا
- Optimized for performance / بهینه‌شده برای عملکرد
- Clean extension name / نام افزونه تمیز
- Standard version number / شماره نسخه استاندارد

---

## 📁 Key Files / فایل‌های کلیدی

### 1. `config.js`
Central configuration file for the extension.
فایل پیکربندی مرکزی برای افزونه.

```javascript
const CONFIG = {
  mode: 'development', // or 'production'
  enableLogging: true, // or false
  features: {
    detailedConversionLogs: true,
    performanceTracking: true,
    mutationLogs: true,
    formatDetectionLogs: true
  }
};
```

### 2. `logger.js`
Centralized logging utility that respects environment mode.
ابزار متمرکز لاگ‌گیری که حالت محیط را رعایت می‌کند.

Methods / متدها:
- `Logger.debug()` - Debug messages (dev only) / پیام‌های اشکال‌زدایی (فقط dev)
- `Logger.info()` - Info messages (dev only) / پیام‌های اطلاعاتی (فقط dev)
- `Logger.warn()` - Warnings (dev only) / هشدارها (فقط dev)
- `Logger.error()` - Errors (always logged) / خطاها (همیشه ثبت می‌شود)
- `Logger.conversion()` - Conversion tracking (dev only) / ردیابی تبدیل (فقط dev)
- `Logger.performance()` - Performance tracking (dev only) / ردیابی عملکرد (فقط dev)
- `Logger.mutation()` - Mutation observer logs (dev only) / لاگ‌های رصدگر تغییرات (فقط dev)
- `Logger.format()` - Format detection logs (dev only) / لاگ‌های تشخیص فرمت (فقط dev)

### 3. `build.ps1`
PowerShell build script that creates mode-specific builds.
اسکریپت ساخت PowerShell که نسخه‌های مخصوص هر حالت را ایجاد می‌کند.

---

## 🔍 How It Works / نحوه کار

### Development Mode / حالت توسعه

1. **Config Settings** / تنظیمات پیکربندی
   ```javascript
   mode: 'development'
   enableLogging: true
   ```

2. **Logger Behavior** / رفتار لاگر
   - All `Logger.debug()` calls produce output
   - All `Logger.info()` calls produce output
   - All feature-specific logs are shown
   - تمام فراخوانی‌های `Logger.debug()` خروجی تولید می‌کنند
   - تمام فراخوانی‌های `Logger.info()` خروجی تولید می‌کنند
   - تمام لاگ‌های مخصوص ویژگی‌ها نمایش داده می‌شوند

3. **Console Output** / خروجی کنسول
   - Rich debugging information / اطلاعات اشکال‌زدایی غنی
   - Date conversion tracking / ردیابی تبدیل تاریخ
   - Performance metrics / معیارهای عملکرد
   - Format detection details / جزئیات تشخیص فرمت

### Production Mode / حالت تولید

1. **Config Settings** / تنظیمات پیکربندی
   ```javascript
   mode: 'production'
   enableLogging: false
   ```

2. **Logger Behavior** / رفتار لاگر
   - All `Logger.debug()` calls are no-ops (do nothing)
   - All `Logger.info()` calls are no-ops
   - Only `Logger.error()` produces output
   - تمام فراخوانی‌های `Logger.debug()` هیچ کاری نمی‌کنند
   - تمام فراخوانی‌های `Logger.info()` هیچ کاری نمی‌کنند
   - فقط `Logger.error()` خروجی تولید می‌کند

3. **Console Output** / خروجی کنسول
   - Clean and minimal / تمیز و حداقلی
   - Only critical errors / فقط خطاهای حیاتی
   - No debug noise / بدون نویز اشکال‌زدایی

---

## 🎯 Usage Guide / راهنمای استفاده

### For Development / برای توسعه

1. **Create dev build** / ایجاد نسخه dev
   ```powershell
   .\build.ps1 -Mode dev
   ```

2. **Load in Chrome** / بارگذاری در Chrome
   - Go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select `build-dev` folder

3. **Test and Debug** / تست و اشکال‌زدایی
   - Open browser console (F12)
   - All debug logs will appear
   - Test on `test.html` or any website
   - تمام لاگ‌های اشکال‌زدایی نمایش داده می‌شوند
   - روی `test.html` یا هر وب‌سایتی تست کنید

### For Production / برای تولید

1. **Create prod build** / ایجاد نسخه prod
   ```powershell
   .\build.ps1 -Mode prod
   ```

2. **Package for distribution** / بسته‌بندی برای توزیع
   - Use `build-prod` folder
   - Zip for Chrome Web Store
   - استفاده از پوشه `build-prod`
   - فشرده‌سازی برای فروشگاه Chrome

3. **Deploy** / استقرار
   - Upload to Chrome Web Store
   - Clean console for end users
   - Optimal performance
   - کنسول تمیز برای کاربران نهایی
   - عملکرد بهینه

---

## 📊 Logging Levels / سطوح لاگ‌گیری

| Method | Dev Mode | Prod Mode | Use Case |
|--------|----------|-----------|----------|
| `Logger.debug()` | ✅ Enabled | ❌ Disabled | General debugging |
| `Logger.info()` | ✅ Enabled | ❌ Disabled | Informational messages |
| `Logger.warn()` | ✅ Enabled | ❌ Disabled | Warnings |
| `Logger.error()` | ✅ Enabled | ✅ Enabled | Critical errors |
| `Logger.conversion()` | ✅ Enabled | ❌ Disabled | Date conversion tracking |
| `Logger.performance()` | ✅ Enabled | ❌ Disabled | Performance metrics |
| `Logger.mutation()` | ✅ Enabled | ❌ Disabled | DOM mutation tracking |
| `Logger.format()` | ✅ Enabled | ❌ Disabled | Format detection |

---

## 🚨 Important Notes / نکات مهم

### ⚠️ Never Edit Build Folders Directly
**هرگز پوشه‌های ساخت را مستقیماً ویرایش نکنید**

- Always edit source files in the root directory
- Always use `build.ps1` to create builds
- Build folders are auto-generated
- همیشه فایل‌های منبع را در دایرکتوری ریشه ویرایش کنید
- همیشه از `build.ps1` برای ایجاد نسخه‌ها استفاده کنید
- پوشه‌های ساخت به صورت خودکار تولید می‌شوند

### ✅ Source Control
Add to `.gitignore`:
```
build-dev/
build-prod/
```

### 🔄 Rebuilding
After any code changes:
پس از هر تغییر کد:
```powershell
.\build.ps1 -Mode dev    # For testing
.\build.ps1 -Mode prod   # For release
```

---

## 🎨 Customizing Logging / سفارشی‌سازی لاگ‌گیری

### Disabling Specific Log Types / غیرفعال کردن انواع خاص لاگ

Edit `config.js` features:
```javascript
features: {
  detailedConversionLogs: false,  // Disable conversion logs
  performanceTracking: false,      // Disable performance logs
  mutationLogs: false,             // Disable mutation logs
  formatDetectionLogs: true        // Keep format logs
}
```

Then rebuild:
سپس مجدداً بسازید:
```powershell
.\build.ps1 -Mode dev
```

---

## 📦 Distribution Checklist / چک‌لیست توزیع

Before publishing to Chrome Web Store:
قبل از انتشار در فروشگاه Chrome:

- [ ] Run `.\build.ps1 -Mode prod`
- [ ] Test `build-prod` build in Chrome
- [ ] Verify console is clean (only errors)
- [ ] Check extension name (no [DEV])
- [ ] Check version number (no -dev)
- [ ] Zip `build-prod` folder
- [ ] Upload to Chrome Web Store

---

## 🤝 Contributing / مشارکت

When contributing code:
هنگام مشارکت در کد:

1. Always test in **dev mode** first
2. Use `Logger` methods instead of `console.log`
3. Choose appropriate logging level
4. Test both dev and prod builds before PR
5. همیشه ابتدا در **حالت dev** تست کنید
6. از متدهای `Logger` به جای `console.log` استفاده کنید
7. سطح لاگ‌گیری مناسب را انتخاب کنید
8. قبل از PR هر دو نسخه dev و prod را تست کنید

---

## 📚 Additional Resources / منابع اضافی

- Main README: `README.md`
- Testing Guide: `TESTING.md`
- Build Summary: `BUILD_SUMMARY.md`

---

**Made with ❤️ by GDate2PDate Team**
