# Testing Guide for GDate2PDate Chrome Extension
# راهنمای تست افزونه GDate2PDate

## Quick Test Steps | مراحل تست سریع

### 1. Load Extension in Chrome | بارگذاری افزونه در کروم

#### فارسی:
1. کروم را باز کنید و به `chrome://extensions/` بروید
2. در گوشه بالا راست، "Developer mode" را فعال کنید
3. روی "Load unpacked" کلیک کنید
4. پوشه `Z:\Dev\GDate2PDate` را انتخاب کنید
5. اگر خطایی دیدید، آن را بررسی کنید

#### English:
1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" in top right
3. Click "Load unpacked"
4. Select the folder `Z:\Dev\GDate2PDate`
5. Check for any errors

### 2. Test Popup UI | تست رابط کاربری

#### فارسی:
1. روی آیکون افزونه در toolbar کلیک کنید
2. باید یک popup با طراحی دوزبانه ظاهر شود
3. سوئیچ را امتحان کنید (فعال/غیرفعال)
4. وضعیت باید تغییر کند و ذخیره شود

#### English:
1. Click extension icon in toolbar
2. Should see a bilingual popup
3. Try the toggle switch (enable/disable)
4. Status should change and persist

### 3. Test Date Conversion | تست تبدیل تاریخ

#### Test Websites | وب‌سایت‌های تست:

**Option 1: Create Test HTML Page**
```html
<!DOCTYPE html>
<html>
<head><title>Date Test</title></head>
<body>
  <h1>Test Dates:</h1>
  <p>ISO: 2024-11-16</p>
  <p>US: 11/16/2024</p>
  <p>European: 16/11/2024</p>
  <p>With time: 2024-11-16 14:30:45</p>
  <p>Textual: November 16, 2024</p>
  <p>Short: 16 Nov</p>
  <p>Month: November</p>
</body>
</html>
```

**Option 2: Test on Real Websites**
- GitHub (dates in repository)
- News websites (article dates)
- Wikipedia (historical dates)
- Gmail (email dates)

### 4. Expected Results | نتایج مورد انتظار

#### فارسی:
تاریخ‌های میلادی باید به این صورت تبدیل شوند:
- `2024-11-16` → `1403/08/26`
- `November 16, 2024` → `1403/08/26`
- `16 Nov` → `1403/08/26`

#### English:
Gregorian dates should convert like this:
- `2024-11-16` → `1403/08/26`
- `November 16, 2024` → `1403/08/26`
- `16 Nov` → `1403/08/26`

### 5. Test Dynamic Content | تست محتوای پویا

#### فارسی:
1. یک سایت با AJAX را باز کنید (مثل Twitter/X)
2. اسکرول کنید تا محتوای جدید بارگذاری شود
3. تاریخ‌های جدید هم باید تبدیل شوند

#### English:
1. Open a site with AJAX (like Twitter/X)
2. Scroll to load new content
3. New dates should also convert

### 6. Check Console | بررسی کنسول

#### فارسی:
1. DevTools را باز کنید (F12)
2. به تب Console بروید
3. باید پیام‌های موفقیت‌آمیز ببینید:
   - ✅ تبدیل تاریخ‌ها با موفقیت انجام شد
   - 📅 سیستم تبدیل خودکار تاریخ فعال شد

#### English:
1. Open DevTools (F12)
2. Go to Console tab
3. Should see success messages:
   - ✅ Date conversion completed successfully
   - 📅 Automatic date conversion system activated

### 7. Test Settings Persistence | تست ماندگاری تنظیمات

#### فارسی:
1. افزونه را غیرفعال کنید
2. کروم را ببندید و دوباره باز کنید
3. افزونه باید همچنان غیرفعال باشد

#### English:
1. Disable the extension
2. Close and reopen Chrome
3. Extension should remain disabled

## Checklist | چک‌لیست

### Installation | نصب
- [ ] افزونه بدون خطا بارگذاری می‌شود
- [ ] آیکون در toolbar نمایش داده می‌شود
- [ ] No errors in `chrome://extensions/`
- [ ] Extension icon appears in toolbar

### Functionality | عملکرد
- [ ] تبدیل تاریخ‌ها به صورت خودکار انجام می‌شود
- [ ] فرمت‌های مختلف تاریخ پشتیبانی می‌شوند
- [ ] محتوای AJAX هم تبدیل می‌شود
- [ ] Dates convert automatically
- [ ] Different formats are supported
- [ ] AJAX content converts

### UI/UX | رابط کاربری
- [ ] Popup به درستی باز می‌شود
- [ ] متن‌های فارسی RTL هستند
- [ ] سوئیچ به درستی کار می‌کند
- [ ] Popup opens correctly
- [ ] Persian text is RTL
- [ ] Toggle switch works

### Performance | کارایی
- [ ] سرعت مرورگر تحت تأثیر قرار نمی‌گیرد
- [ ] صفحات به سرعت بارگذاری می‌شوند
- [ ] هیچ خطایی در کنسول نیست
- [ ] Browser speed not affected
- [ ] Pages load quickly
- [ ] No console errors

### Privacy | حریم خصوصی
- [ ] هیچ درخواست شبکه‌ای ارسال نمی‌شود
- [ ] تمام پردازش محلی است
- [ ] No network requests sent
- [ ] All processing is local

## Common Issues | مشکلات رایج

### فارسی:

**مشکل**: افزونه بارگذاری نمی‌شود
- **راه‌حل**: مطمئن شوید تمام فایل‌ها در پوشه هستند
- بررسی کنید که Developer mode فعال باشد

**مشکل**: تاریخ‌ها تبدیل نمی‌شوند
- **راه‌حل**: کنسول را بررسی کنید
- مطمئن شوید افزونه فعال است
- صفحه را Reload کنید

**مشکل**: Popup باز نمی‌شود
- **راه‌حل**: به `chrome://extensions/` بروید
- روی "Errors" کلیک کنید
- خطاها را بررسی کنید

### English:

**Issue**: Extension won't load
- **Solution**: Make sure all files are in folder
- Check that Developer mode is enabled

**Issue**: Dates don't convert
- **Solution**: Check console
- Make sure extension is enabled
- Reload the page

**Issue**: Popup won't open
- **Solution**: Go to `chrome://extensions/`
- Click on "Errors"
- Check for errors

## Success Criteria | معیارهای موفقیت

### فارسی:
✅ افزونه بدون خطا بارگذاری می‌شود
✅ تاریخ‌های میلادی به شمسی تبدیل می‌شوند
✅ سوئیچ فعال/غیرفعال کار می‌کند
✅ تنظیمات ذخیره می‌شوند
✅ در وب‌سایت‌های مختلف کار می‌کند
✅ محتوای AJAX تبدیل می‌شود
✅ بدون خطا در کنسول

### English:
✅ Extension loads without errors
✅ Gregorian dates convert to Jalali
✅ Enable/disable toggle works
✅ Settings persist
✅ Works on different websites
✅ AJAX content converts
✅ No console errors
