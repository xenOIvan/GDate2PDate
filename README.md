# GDate2PDate - تبدیل تاریخ میلادی به شمسی

<div align="center">

![Extension Icon](icons/icon128.png)

**تبدیل خودکار تاریخ‌های میلادی به شمسی در هر صفحه وب**

**Automatic Gregorian to Jalali (Persian) Date Conversion on Any Webpage**

[![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-4285F4?style=for-the-badge&logo=google-chrome&logoColor=white)](https://chrome.google.com/webstore)
[![Version](https://img.shields.io/badge/Version-1.0.0-success?style=for-the-badge)](https://github.com/yourusername/GDate2PDate)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

</div>

---

## 📋 فهرست | Table of Contents

- [درباره پروژه | About](#-درباره-پروژه--about)
- [ویژگی‌ها | Features](#-ویژگیها--features)
- [نصب | Installation](#-نصب--installation)
- [نحوه استفاده | Usage](#-نحوه-استفاده--usage)
- [جزئیات فنی | Technical Details](#-جزئیات-فنی--technical-details)
- [حریم خصوصی | Privacy](#-حریم-خصوصی--privacy)
- [مشارکت | Contributing](#-مشارکت--contributing)
- [پشتیبانی | Support](#-پشتیبانی--support)
- [مجوز | License](#-مجوز--license)

---

## 🌟 درباره پروژه | About

### فارسی

**GDate2PDate** یک افزونه کروم است که به صورت خودکار تمام تاریخ‌های میلادی را در هر صفحه وبی که مشاهده می‌کنید به تاریخ شمسی (جلالی) تبدیل می‌کند. این افزونه برای فارسی‌زبان‌هایی طراحی شده که ترجیح می‌دهند تاریخ‌ها را به تقویم شمسی ببینند.

### English

**GDate2PDate** is a Chrome extension that automatically converts all Gregorian dates to Jalali (Persian) dates on any webpage you visit. This extension is designed for Persian speakers who prefer to see dates in the Solar Hijri calendar.

---

## ✨ ویژگی‌ها | Features

### فارسی

✅ **تبدیل خودکار**: تشخیص و تبدیل خودکار تاریخ‌های میلادی به شمسی  
✅ **پشتیبانی از فرمت‌های مختلف**: شناسایی فرمت‌های مختلف تاریخ (YYYY-MM-DD, DD/MM/YYYY, و غیره)  
✅ **تاریخ‌های متنی**: تبدیل تاریخ‌های نوشته شده به حروف (مانند "November 15, 2024")  
✅ **بارگذاری دینامیک**: تشخیص و تبدیل تاریخ‌های بارگذاری شده با AJAX  
✅ **قابل کنترل**: امکان فعال/غیرفعال کردن از طریق آیکون افزونه  
✅ **سبک و سریع**: بدون تأثیر محسوس بر سرعت مرورگر  
✅ **حفظ حریم خصوصی**: تمام پردازش‌ها در محلی انجام می‌شود، بدون ارسال داده  
✅ **فرمت یکپارچه**: تبدیل تمام تاریخ‌ها به فرمت استاندارد YYYY/MM/DD  

### English

✅ **Automatic Conversion**: Automatically detects and converts Gregorian dates to Jalali  
✅ **Multiple Format Support**: Recognizes various date formats (YYYY-MM-DD, DD/MM/YYYY, etc.)  
✅ **Textual Dates**: Converts written dates (like "November 15, 2024")  
✅ **Dynamic Loading**: Detects and converts AJAX-loaded dates  
✅ **Controllable**: Enable/disable via extension icon  
✅ **Lightweight & Fast**: No noticeable impact on browser performance  
✅ **Privacy Focused**: All processing done locally, no data sent anywhere  
✅ **Unified Format**: Converts all dates to standard YYYY/MM/DD format  

---

## 📥 نصب | Installation

### فارسی

#### روش 1: از Chrome Web Store (توصیه می‌شود)
1. به [صفحه افزونه در Chrome Web Store](#) بروید
2. روی دکمه "Add to Chrome" کلیک کنید
3. تأیید کنید تا افزونه نصب شود

#### روش 2: نصب دستی (حالت توسعه‌دهنده)
1. این مخزن را دانلود کنید یا کلون کنید:
   ```bash
   git clone https://github.com/yourusername/GDate2PDate.git
   ```
2. کروم را باز کرده و به آدرس `chrome://extensions/` بروید
3. "Developer mode" را در گوشه بالا راست فعال کنید
4. روی "Load unpacked" کلیک کنید
5. پوشه دانلود شده را انتخاب کنید

### English

#### Method 1: From Chrome Web Store (Recommended)
1. Visit the [extension page on Chrome Web Store](#)
2. Click "Add to Chrome"
3. Confirm to install the extension

#### Method 2: Manual Installation (Developer Mode)
1. Download or clone this repository:
   ```bash
   git clone https://github.com/yourusername/GDate2PDate.git
   ```
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked"
5. Select the downloaded folder

---

## 🚀 نحوه استفاده | Usage

### فارسی

1. **فعال‌سازی خودکار**: پس از نصب، افزونه به صورت خودکار روی تمام وب‌سایت‌ها فعال است

2. **فعال/غیرفعال کردن**:
   - روی آیکون افزونه در نوار ابزار کروم کلیک کنید
   - سوئیچ را برای فعال یا غیرفعال کردن استفاده کنید
   - صفحات باز به صورت خودکار بارگذاری مجدد می‌شوند

3. **مشاهده نتایج**:
   - تاریخ‌های میلادی به صورت خودکار به فرمت شمسی تبدیل می‌شوند
   - فرمت خروجی: `YYYY/MM/DD` (مثال: 1403/08/26)

### English

1. **Automatic Activation**: After installation, the extension works automatically on all websites

2. **Enable/Disable**:
   - Click the extension icon in Chrome toolbar
   - Use the toggle switch to enable or disable
   - Open pages will automatically reload

3. **View Results**:
   - Gregorian dates are automatically converted to Jalali format
   - Output format: `YYYY/MM/DD` (Example: 1403/08/26)

---

## 🔧 جزئیات فنی | Technical Details

### فارسی

#### معماری
- **Manifest Version**: 3 (آخرین نسخه استاندارد کروم)
- **Content Script**: تزریق اسکریپت تبدیل به صفحات وب
- **Background Service Worker**: مدیریت چرخه حیات افزونه
- **Popup UI**: رابط کاربری دوزبانه با پشتیبانی RTL

#### فرمت‌های پشتیبانی شده
- `YYYY-MM-DD` (ISO format)
- `MM/DD/YYYY` (US format)
- `DD/MM/YYYY` (European format)
- `DD.MM.YYYY` (German format)
- تاریخ‌های همراه با زمان
- تاریخ‌های متنی (November 15, 2024)

#### الگوریتم تبدیل
استفاده از الگوریتم استاندارد تبدیل میلادی به شمسی با دقت کامل

### English

#### Architecture
- **Manifest Version**: 3 (Latest Chrome standard)
- **Content Script**: Injects conversion script into web pages
- **Background Service Worker**: Manages extension lifecycle
- **Popup UI**: Bilingual interface with RTL support

#### Supported Formats
- `YYYY-MM-DD` (ISO format)
- `MM/DD/YYYY` (US format)
- `DD/MM/YYYY` (European format)
- `DD.MM.YYYY` (German format)
- Dates with time
- Textual dates (November 15, 2024)

#### Conversion Algorithm
Uses standard Gregorian to Jalali conversion algorithm with full accuracy

---

## 🔒 حریم خصوصی | Privacy

### فارسی

🛡️ **تضمین حریم خصوصی کامل**:
- ❌ هیچ داده‌ای به سرور ارسال نمی‌شود
- ❌ بدون ردیابی یا تحلیل رفتار کاربر
- ❌ بدون نیاز به ثبت‌نام یا ورود
- ✅ تمام پردازش‌ها در دستگاه شما انجام می‌شود
- ✅ کدهای منبع باز برای بررسی عمومی

### English

🛡️ **Complete Privacy Guarantee**:
- ❌ No data sent to any server
- ❌ No tracking or user behavior analysis
- ❌ No registration or login required
- ✅ All processing done on your device
- ✅ Open source code for public review

---

## 📁 ساختار پروژه | Project Structure

```
GDate2PDate/
├── manifest.json          # تنظیمات افزونه | Extension configuration
├── content.js            # اسکریپت محتوا | Content script
├── background.js         # سرویس ورکر | Service worker
├── popup.html            # رابط کاربری | UI interface
├── popup.js              # منطق popup | Popup logic
├── script.js             # منطق اصلی تبدیل | Core conversion logic
├── icons/                # آیکون‌ها | Icons
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
├── .github/
│   └── copilot-instructions.md
└── README.md
```

---

## 🤝 مشارکت | Contributing

### فارسی

مشارکت‌های شما استقبال می‌شود! برای مشارکت:

1. این مخزن را Fork کنید
2. یک Branch جدید بسازید (`git checkout -b feature/AmazingFeature`)
3. تغییرات خود را Commit کنید (`git commit -m 'Add some AmazingFeature'`)
4. به Branch خود Push کنید (`git push origin feature/AmazingFeature`)
5. یک Pull Request باز کنید

### English

Contributions are welcome! To contribute:

1. Fork this repository
2. Create a new Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to your Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 💡 پشتیبانی | Support

### فارسی

اگر مشکلی دارید یا پیشنهادی دارید:

- 🐛 [گزارش باگ](https://github.com/yourusername/GDate2PDate/issues)
- 💡 [درخواست ویژگی جدید](https://github.com/yourusername/GDate2PDate/issues)
- 📧 ایمیل: your.email@example.com

### English

If you have issues or suggestions:

- 🐛 [Report Bug](https://github.com/yourusername/GDate2PDate/issues)
- 💡 [Request Feature](https://github.com/yourusername/GDate2PDate/issues)
- 📧 Email: your.email@example.com

---

## 📜 مجوز | License

این پروژه تحت مجوز MIT منتشر شده است. برای جزئیات بیشتر فایل [LICENSE](LICENSE) را مشاهده کنید.

This project is licensed under the MIT License. See [LICENSE](LICENSE) file for details.

---

## 🌟 تشکر | Acknowledgments

### فارسی

- از تمام کاربران فارسی‌زبان که از این افزونه استفاده می‌کنند، سپاسگزاریم
- الگوریتم تبدیل تاریخ بر اساس استانداردهای رسمی تقویم شمسی

### English

- Thanks to all Persian-speaking users who use this extension
- Date conversion algorithm based on official Solar Hijri calendar standards

---

<div align="center">

**ساخته شده با ❤️ برای جامعه فارسی‌زبان**

**Made with ❤️ for the Persian-speaking community**

⭐ اگر این افزونه برای شما مفید بود، لطفاً یک ستاره بدهید!  
⭐ If this extension is useful for you, please give it a star!

</div>
