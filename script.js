/**
 * تبدیل خودکار تاریخ میلادی به شمسی
 * Automatic Gregorian to Jalali Date Converter
 * 
 * این فایل به صورت خودکار تمام تاریخ‌های میلادی را در صفحه پیدا کرده و به تاریخ شمسی تبدیل می‌کند
 * This file automatically finds and converts all Gregorian dates to Jalali dates
 */

(function() {
    'use strict';

    // تابع تبدیل تاریخ میلادی به شمسی
    // Gregorian to Jalali conversion function
    function gregorianToJalali(gy, gm, gd) {
        var g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
        var jy, jm, jd, gy2, days;
        
        if (gy > 1600) {
            jy = 979;
            gy -= 1600;
        } else {
            jy = 0;
            gy -= 621;
        }
        
        gy2 = (gm > 2) ? (gy + 1) : gy;
        days = (365 * gy) + (Math.floor((gy2 + 3) / 4)) - (Math.floor((gy2 + 99) / 100))
            + (Math.floor((gy2 + 399) / 400)) - 80 + gd + g_d_m[gm - 1];
        jy += 33 * (Math.floor(days / 12053));
        days %= 12053;
        jy += 4 * (Math.floor(days / 1461));
        days %= 1461;
        
        if (days > 365) {
            jy += Math.floor((days - 1) / 365);
            days = (days - 1) % 365;
        }
        
        if (days < 186) {
            jm = 1 + Math.floor(days / 31);
            jd = 1 + (days % 31);
        } else {
            jm = 7 + Math.floor((days - 186) / 30);
            jd = 1 + ((days - 186) % 30);
        }
        
        return { year: jy, month: jm, day: jd };
    }

    // تابع تشخیص فرمت تاریخ
    // Detect date format function
    function detectDateFormat(dateStr) {
        // فرمت‌های مختلف تاریخ میلادی
        const patterns = [
            // ISO format: 2024-12-31 or 2024/12/31
            { regex: /(\d{4})[-\/](\d{1,2})[-\/](\d{1,2})/, format: 'YYYY-MM-DD', separator: null },
            // US format: 12/31/2024 or 12-31-2024
            { regex: /(\d{1,2})[-\/](\d{1,2})[-\/](\d{4})/, format: 'MM-DD-YYYY', separator: null },
            // European format: 31.12.2024 or 31/12/2024
            { regex: /(\d{1,2})[\.](\d{1,2})[\.](\d{4})/, format: 'DD.MM.YYYY', separator: '.' },
            // With time: 2024-12-31 14:30:45 or 2024/12/31 14:30:45
            { regex: /(\d{4})[-\/](\d{1,2})[-\/](\d{1,2})\s+(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?/, format: 'YYYY-MM-DD HH:mm:ss', separator: null },
            // US with time: 12/31/2024 14:30:45
            { regex: /(\d{1,2})[-\/](\d{1,2})[-\/](\d{4})\s+(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?/, format: 'MM-DD-YYYY HH:mm:ss', separator: null }
        ];

        for (let pattern of patterns) {
            const match = dateStr.match(pattern.regex);
            if (match) {
                // Detect separator from original string
                if (!pattern.separator) {
                    if (dateStr.includes('/')) pattern.separator = '/';
                    else if (dateStr.includes('-')) pattern.separator = '-';
                    else pattern.separator = '/';
                }
                return { match, format: pattern.format, separator: pattern.separator };
            }
        }
        return null;
    }

    // تابع تبدیل تاریخ با حفظ فرمت
    // Convert date while preserving format
    function convertDateToJalali(dateStr) {
        const detected = detectDateFormat(dateStr.trim());
        if (!detected) return dateStr;

        const { match, format, separator } = detected;
        let year, month, day, hour, minute, second;

        // استخراج اجزای تاریخ بر اساس فرمت
        // Extract date parts based on format
        if (format.startsWith('YYYY')) {
            year = parseInt(match[1]);
            month = parseInt(match[2]);
            day = parseInt(match[3]);
            hour = match[4] ? parseInt(match[4]) : null;
            minute = match[5] ? parseInt(match[5]) : null;
            second = match[6] ? parseInt(match[6]) : null;
        } else if (format.startsWith('MM')) {
            month = parseInt(match[1]);
            day = parseInt(match[2]);
            year = parseInt(match[3]);
            hour = match[4] ? parseInt(match[4]) : null;
            minute = match[5] ? parseInt(match[5]) : null;
            second = match[6] ? parseInt(match[6]) : null;
        } else if (format.startsWith('DD')) {
            day = parseInt(match[1]);
            month = parseInt(match[2]);
            year = parseInt(match[3]);
        }

        // بررسی اعتبار تاریخ
        // Validate date
        if (year < 1900 || year > 2100 || month < 1 || month > 12 || day < 1 || day > 31) {
            return dateStr;
        }

        // تبدیل به شمسی
        // Convert to Jalali
        const jalali = gregorianToJalali(year, month, day);
        
        // ساخت تاریخ شمسی با فرمت مشابه
        // Build Jalali date with similar format
        const jYear = jalali.year.toString();
        const jMonth = jalali.month.toString().padStart(2, '0');
        const jDay = jalali.day.toString().padStart(2, '0');

        let result = '';
        if (format.startsWith('YYYY')) {
            result = `${jYear}${separator}${jMonth}${separator}${jDay}`;
        } else if (format.startsWith('MM')) {
            result = `${jMonth}${separator}${jDay}${separator}${jYear}`;
        } else if (format.startsWith('DD')) {
            result = `${jDay}${separator}${jMonth}${separator}${jYear}`;
        }

        // اضافه کردن زمان در صورت وجود
        // Add time if present
        if (hour !== null) {
            const hh = hour.toString().padStart(2, '0');
            const mm = minute.toString().padStart(2, '0');
            const ss = second !== null ? ':' + second.toString().padStart(2, '0') : '';
            result += ` ${hh}:${mm}${ss}`;
        }

        return result;
    }

    // تابع پردازش محتوای متنی
    // Process text content
    function processTextNode(node) {
        if (!node.nodeValue || node.nodeValue.trim() === '') return;
        
        const originalText = node.nodeValue;
        let newText = originalText;

        // الگوهای تاریخ برای جایگزینی
        // Date patterns for replacement
        const datePatterns = [
            /\d{4}[-\/]\d{1,2}[-\/]\d{1,2}(?:\s+\d{1,2}:\d{1,2}(?::\d{1,2})?)?/g,
            /\d{1,2}[-\/]\d{1,2}[-\/]\d{4}(?:\s+\d{1,2}:\d{1,2}(?::\d{1,2})?)?/g,
            /\d{1,2}\.\d{1,2}\.\d{4}/g
        ];

        for (let pattern of datePatterns) {
            newText = newText.replace(pattern, (match) => {
                return convertDateToJalali(match);
            });
        }

        if (newText !== originalText) {
            node.nodeValue = newText;
        }
    }

    // تابع پردازش اتریبیوت‌های المان
    // Process element attributes
    function processElementAttributes(element) {
        // اتریبیوت‌هایی که ممکن است تاریخ داشته باشند
        // Attributes that might contain dates
        const dateAttributes = ['value', 'placeholder', 'title', 'data-date', 'datetime'];
        
        for (let attr of dateAttributes) {
            if (element.hasAttribute(attr)) {
                const originalValue = element.getAttribute(attr);
                const newValue = convertDateToJalali(originalValue);
                if (newValue !== originalValue) {
                    element.setAttribute(attr, newValue);
                }
            }
        }
    }

    // تابع بازگشتی برای پیمایش DOM
    // Recursive DOM traversal function
    function traverseDOM(node) {
        // پردازش نودهای متنی
        // Process text nodes
        if (node.nodeType === Node.TEXT_NODE) {
            processTextNode(node);
        } 
        // پردازش المان‌ها
        // Process elements
        else if (node.nodeType === Node.ELEMENT_NODE) {
            // نادیده گرفتن تگ‌های script و style
            // Skip script and style tags
            if (node.tagName !== 'SCRIPT' && node.tagName !== 'STYLE') {
                processElementAttributes(node);
                
                // پردازش فرزندان
                // Process children
                const children = node.childNodes;
                for (let i = 0; i < children.length; i++) {
                    traverseDOM(children[i]);
                }
            }
        }
    }

    // تابع اصلی تبدیل تمام تاریخ‌ها
    // Main function to convert all dates
    function convertAllDates() {
        console.log('🔄 شروع تبدیل تاریخ‌های میلادی به شمسی...');
        console.log('🔄 Starting Gregorian to Jalali date conversion...');
        
        try {
            traverseDOM(document.body);
            console.log('✅ تبدیل تاریخ‌ها با موفقیت انجام شد');
            console.log('✅ Date conversion completed successfully');
        } catch (error) {
            console.error('❌ خطا در تبدیل تاریخ‌ها:', error);
            console.error('❌ Error converting dates:', error);
        }
    }

    // اجرای تبدیل پس از بارگذاری کامل صفحه
    // Execute conversion after page load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', convertAllDates);
    } else {
        convertAllDates();
    }

    // رصد تغییرات DOM و تبدیل تاریخ‌های جدید
    // Monitor DOM changes and convert new dates
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === Node.ELEMENT_NODE || node.nodeType === Node.TEXT_NODE) {
                    traverseDOM(node);
                }
            });
        });
    });

    // شروع رصد تغییرات
    // Start observing changes
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true
    });

    console.log('📅 سیستم تبدیل خودکار تاریخ فعال شد');
    console.log('📅 Automatic date conversion system activated');

})();
