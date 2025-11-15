/**
 * تبدیل خودکار تاریخ میلادی به شمسی با فرمت یکپارچه
 * Automatic Gregorian to Jalali Date Converter with Unified Format
 * 
 * این فایل ابتدا فرمت رایج تاریخ در صفحه را تشخیص می‌دهد
 * سپس تمام تاریخ‌ها را به فرمت استاندارد شمسی (YYYY/MM/DD) تبدیل می‌کند
 * 
 * This file first detects the common date format on the page
 * Then converts all dates to standard Jalali format (YYYY/MM/DD)
 */

(function() {
    'use strict';

    // متغیر سراسری برای ذخیره فرمت تشخیص داده شده
    // Global variable to store detected format
    let detectedPageFormat = null;
    let formatConfidence = 0;

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
            { regex: /(\d{4})[-\/](\d{1,2})[-\/](\d{1,2})/, format: 'YYYY-MM-DD', separator: null, priority: 1 },
            // US format: 12/31/2024 or 12-31-2024
            { regex: /(\d{1,2})[-\/](\d{1,2})[-\/](\d{4})/, format: 'MM-DD-YYYY', separator: null, priority: 2 },
            // European format: 31.12.2024 or 31/12/2024
            { regex: /(\d{1,2})[\.](\d{1,2})[\.](\d{4})/, format: 'DD.MM.YYYY', separator: '.', priority: 3 },
            // With time: 2024-12-31 14:30:45 or 2024/12/31 14:30:45
            { regex: /(\d{4})[-\/](\d{1,2})[-\/](\d{1,2})\s+(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?/, format: 'YYYY-MM-DD HH:mm:ss', separator: null, priority: 1 },
            // US with time: 12/31/2024 14:30:45
            { regex: /(\d{1,2})[-\/](\d{1,2})[-\/](\d{4})\s+(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?/, format: 'MM-DD-YYYY HH:mm:ss', separator: null, priority: 2 }
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
                return { match, format: pattern.format, separator: pattern.separator, priority: pattern.priority };
            }
        }
        return null;
    }

    // تابع تشخیص فرمت رایج در کل صفحه
    // Detect the most common date format on the entire page
    function detectPageDateFormat() {
        const bodyText = document.body.innerText;
        const formatCounts = {};
        
        // الگوهای مختلف تاریخ برای اسکن صفحه
        const datePatterns = [
            /\d{4}[-\/]\d{1,2}[-\/]\d{1,2}(?:\s+\d{1,2}:\d{1,2}(?::\d{1,2})?)?/g,
            /\d{1,2}[-\/]\d{1,2}[-\/]\d{4}(?:\s+\d{1,2}:\d{1,2}(?::\d{1,2})?)?/g,
            /\d{1,2}\.\d{1,2}\.\d{4}/g
        ];

        // پیدا کردن تمام تاریخ‌ها در صفحه
        for (let pattern of datePatterns) {
            const matches = bodyText.match(pattern) || [];
            matches.forEach(match => {
                const detected = detectDateFormat(match);
                if (detected) {
                    const baseFormat = detected.format.replace(' HH:mm:ss', '');
                    formatCounts[baseFormat] = (formatCounts[baseFormat] || 0) + 1;
                }
            });
        }

        // پیدا کردن رایج‌ترین فرمت
        let maxCount = 0;
        let mostCommonFormat = 'YYYY-MM-DD'; // فرمت پیش‌فرض

        for (let [format, count] of Object.entries(formatCounts)) {
            if (count > maxCount) {
                maxCount = count;
                mostCommonFormat = format;
            }
        }

        detectedPageFormat = mostCommonFormat;
        formatConfidence = maxCount;

        console.log(`📊 فرمت تشخیص داده شده: ${mostCommonFormat} (تعداد: ${maxCount})`);
        console.log(`📊 Detected format: ${mostCommonFormat} (count: ${maxCount})`);
        
        return mostCommonFormat;
    }

    // تابع تبدیل تاریخ با حفظ فرمت
    // Convert date while preserving format
    function convertDateToJalali(dateStr) {
        const detected = detectDateFormat(dateStr.trim());
        if (!detected) return dateStr;

        const { match, format } = detected;
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
        
        // ساخت تاریخ شمسی با فرمت استاندارد YYYY/MM/DD
        // Build Jalali date with standard format YYYY/MM/DD
        const jYear = jalali.year.toString();
        const jMonth = jalali.month.toString().padStart(2, '0');
        const jDay = jalali.day.toString().padStart(2, '0');

        // همیشه فرمت YYYY/MM/DD استفاده می‌شود
        // Always use YYYY/MM/DD format
        let result = `${jYear}/${jMonth}/${jDay}`;

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
            // مرحله 1: تشخیص فرمت رایج صفحه
            detectPageDateFormat();
            
            // مرحله 2: تبدیل تمام تاریخ‌ها به فرمت استاندارد YYYY/MM/DD
            traverseDOM(document.body);
            
            console.log('✅ تبدیل تاریخ‌ها با موفقیت انجام شد');
            console.log('✅ Date conversion completed successfully');
            console.log(`📅 تمام تاریخ‌ها به فرمت استاندارد شمسی (YYYY/MM/DD) تبدیل شدند`);
            console.log(`📅 All dates converted to standard Jalali format (YYYY/MM/DD)`);
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
    console.log('🎯 فرمت خروجی: همیشه YYYY/MM/DD (شمسی)');
    console.log('🎯 Output format: Always YYYY/MM/DD (Jalali)');

})();
