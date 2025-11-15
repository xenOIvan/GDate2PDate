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

    // بررسی پشتیبانی مرورگر
    // Browser support check
    if (typeof Node === 'undefined') {
        console.error('❌ Browser does not support Node API');
        return;
    }

    // متغیر سراسری برای ذخیره فرمت تشخیص داده شده
    // Global variable to store detected format
    let detectedPageFormat = null;
    let formatConfidence = 0;
    
    // پرچم برای جلوگیری از پردازش مجدد
    // Flag to prevent reprocessing
    let isProcessing = false;

    // نام ماه‌های میلادی و شمسی
    // Gregorian and Jalali month names
    const gregorianMonths = {
        'january': 1, 'jan': 1,
        'february': 2, 'feb': 2,
        'march': 3, 'mar': 3,
        'april': 4, 'apr': 4,
        'may': 5,
        'june': 6, 'jun': 6,
        'july': 7, 'jul': 7,
        'august': 8, 'aug': 8,
        'september': 9, 'sep': 9, 'sept': 9,
        'october': 10, 'oct': 10,
        'november': 11, 'nov': 11,
        'december': 12, 'dec': 12
    };

    const jalaliMonthNames = [
        'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
        'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
    ];

    const gregorianMonthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const gregorianMonthNamesShort = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    // تابع تبدیل تاریخ میلادی به شمسی
    // Gregorian to Jalali conversion function
    function gregorianToJalali(gy, gm, gd) {
        try {
            // اعتبارسنجی ورودی
            // Input validation
            if (typeof gy !== 'number' || typeof gm !== 'number' || typeof gd !== 'number') {
                console.warn('⚠️ gregorianToJalali: Invalid input types', { gy, gm, gd });
                return null;
            }
            
            if (isNaN(gy) || isNaN(gm) || isNaN(gd)) {
                console.warn('⚠️ gregorianToJalali: NaN values detected', { gy, gm, gd });
                return null;
            }
            
            if (gy < 1900 || gy > 2100) {
                console.warn('⚠️ gregorianToJalali: Year out of range (1900-2100)', { gy });
                return null;
            }
            
            if (gm < 1 || gm > 12) {
                console.warn('⚠️ gregorianToJalali: Month out of range (1-12)', { gm });
                return null;
            }
            
            if (gd < 1 || gd > 31) {
                console.warn('⚠️ gregorianToJalali: Day out of range (1-31)', { gd });
                return null;
            }
            
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
        } catch (error) {
            console.error('❌ gregorianToJalali: Unexpected error', error, { gy, gm, gd });
            return null;
        }
    }

    // تابع تشخیص فرمت تاریخ
    // Detect date format function
    function detectDateFormat(dateStr) {
        try {
            if (!dateStr || typeof dateStr !== 'string') {
                console.warn('⚠️ detectDateFormat: Invalid input', dateStr);
                return null;
            }
            
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
                { regex: /(\d{1,2})[-\/](\d{1,2})[-\/](\d{4})\s+(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?/, format: 'MM-DD-YYYY HH:mm:ss', separator: null, priority: 2 },
                // Textual dates: "8 Nov", "Nov 8", "November 15", "15 September", "September 16, 1961"
                { regex: /\b(\d{1,2})\s+(january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)\b/i, format: 'DD Month', separator: null, priority: 4 },
                { regex: /\b(january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)\s+(\d{1,2})\b/i, format: 'Month DD', separator: null, priority: 4 },
                { regex: /\b(january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)\s+(\d{1,2}),\s+(\d{4})\b/i, format: 'Month DD, YYYY', separator: null, priority: 4 }
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
            
            console.warn('⚠️ detectDateFormat: No matching pattern found', dateStr);
            return null;
        } catch (error) {
            console.error('❌ detectDateFormat: Unexpected error', error, dateStr);
            return null;
        }
    }

    // تابع تبدیل نام ماه به شماره
    // Convert month name to number
    function getMonthNumber(monthName) {
        try {
            if (!monthName || typeof monthName !== 'string') {
                console.warn('⚠️ getMonthNumber: Invalid month name', monthName);
                return null;
            }
            return gregorianMonths[monthName.toLowerCase()] || null;
        } catch (error) {
            console.error('❌ getMonthNumber: Error processing month name', error, monthName);
            return null;
        }
    }

    // تابع تبدیل تاریخ متنی (مثل "8 Nov" یا "September 15" یا "September 16, 1961")
    // Convert textual dates like "8 Nov" or "September 15" or "September 16, 1961"
    function convertTextualDate(dateStr) {
        try {
            if (!dateStr || typeof dateStr !== 'string') {
                console.warn('⚠️ convertTextualDate: Invalid input', dateStr);
                return dateStr;
            }
            
            let day, month, year;
            
            // الگوی "September 16, 1961" (Month DD, YYYY)
            let match = dateStr.match(/\b(january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)\s+(\d{1,2}),\s+(\d{4})\b/i);
            if (match) {
                month = getMonthNumber(match[1]);
                day = parseInt(match[2]);
                year = parseInt(match[3]);
            } else {
                // الگوی "8 Nov" یا "15 September" (DD Month)
                match = dateStr.match(/\b(\d{1,2})\s+(january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)\b/i);
                
                if (match) {
                    day = parseInt(match[1]);
                    month = getMonthNumber(match[2]);
                    year = new Date().getFullYear(); // استفاده از سال جاری
                } else {
                    // الگوی "Nov 8" یا "September 15" (Month DD)
                    match = dateStr.match(/\b(january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)\s+(\d{1,2})\b/i);
                    if (match) {
                        month = getMonthNumber(match[1]);
                        day = parseInt(match[2]);
                        year = new Date().getFullYear(); // استفاده از سال جاری
                    }
                }
            }

            if (day && month && year) {
                const jalali = gregorianToJalali(year, month, day);
                
                if (!jalali) {
                    console.warn('⚠️ convertTextualDate: Conversion failed', { dateStr, year, month, day });
                    return dateStr;
                }
                
                const jYear = jalali.year.toString();
                const jMonth = jalali.month.toString().padStart(2, '0');
                const jDay = jalali.day.toString().padStart(2, '0');
                
                return `${jYear}/${jMonth}/${jDay}`;
            }
            
            return dateStr;
        } catch (error) {
            console.error('❌ convertTextualDate: Unexpected error', error, dateStr);
            return dateStr;
        }
    }

    // تابع تبدیل نام ماه تنها (مثل "Nov" یا "October")
    // Convert standalone month names like "Nov" or "October"
    function convertStandaloneMonth(monthStr) {
        try {
            if (!monthStr || typeof monthStr !== 'string') {
                console.warn('⚠️ convertStandaloneMonth: Invalid input', monthStr);
                return monthStr;
            }
            
            const monthName = monthStr.trim();
            const monthNumber = getMonthNumber(monthName);
            
            if (monthNumber) {
                // تبدیل به نام ماه شمسی تقریبی
                // برای سادگی، از یک نقشه تقریبی استفاده می‌کنیم
                const approximateJalaliMonth = {
                    1: 'دی', 2: 'بهمن', 3: 'اسفند', 4: 'فروردین',
                    5: 'اردیبهشت', 6: 'خرداد', 7: 'تیر', 8: 'مرداد',
                    9: 'شهریور', 10: 'مهر', 11: 'آبان', 12: 'آذر'
                };
                
                const jalaliMonth = approximateJalaliMonth[monthNumber];
                
                // نمایش هر دو نام به صورت: "Nov (آبان)"
                return `${monthName} (${jalaliMonth})`;
            }
            
            return monthStr;
        } catch (error) {
            console.error('❌ convertStandaloneMonth: Unexpected error', error, monthStr);
            return monthStr;
        }
    }

    // تابع تشخیص فرمت رایج در کل صفحه
    // Detect the most common date format on the entire page
    function detectPageDateFormat() {
        try {
            if (!document || !document.body) {
                console.warn('⚠️ detectPageDateFormat: Document or body not available');
                return 'YYYY-MM-DD';
            }
            
            const bodyText = document.body.innerText;
            
            if (!bodyText || typeof bodyText !== 'string') {
                console.warn('⚠️ detectPageDateFormat: Invalid body text');
                return 'YYYY-MM-DD';
            }
            
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
        } catch (error) {
            console.error('❌ detectPageDateFormat: Unexpected error', error);
            return 'YYYY-MM-DD'; // Return default format on error
        }
    }

    // تابع تبدیل تاریخ با حفظ فرمت
    // Convert date while preserving format
    function convertDateToJalali(dateStr) {
        try {
            if (!dateStr || typeof dateStr !== 'string') {
                console.warn('⚠️ convertDateToJalali: Invalid input', dateStr);
                return dateStr;
            }
            
            const detected = detectDateFormat(dateStr.trim());
            if (!detected) {
                console.warn('⚠️ convertDateToJalali: No format detected', dateStr);
                return dateStr;
            }

            const { match, format } = detected;
            let year, month, day, hour, minute, second;

            // بررسی تاریخ‌های متنی (مثل "8 Nov" یا "November 15" یا "September 16, 1961")
            // Check for textual dates like "8 Nov" or "November 15" or "September 16, 1961"
            if (format === 'DD Month' || format === 'Month DD' || format === 'Month DD, YYYY') {
                return convertTextualDate(dateStr);
            }

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

            // Validate parsed values
            if (isNaN(year) || isNaN(month) || isNaN(day)) {
                console.warn('⚠️ convertDateToJalali: Invalid parsed values (NaN)', { year, month, day, dateStr });
                return dateStr;
            }

            // بررسی اعتبار تاریخ
            // Validate date
            if (year < 1900 || year > 2100 || month < 1 || month > 12 || day < 1 || day > 31) {
                console.warn('⚠️ convertDateToJalali: Date out of valid range', { year, month, day, dateStr });
                return dateStr;
            }

            // تبدیل به شمسی
            // Convert to Jalali
            const jalali = gregorianToJalali(year, month, day);
            
            if (!jalali) {
                console.warn('⚠️ convertDateToJalali: Conversion returned null', { year, month, day, dateStr });
                return dateStr;
            }
            
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
        } catch (error) {
            console.error('❌ convertDateToJalali: Unexpected error', error, dateStr);
            return dateStr;
        }
    }

    // تابع پردازش محتوای متنی
    // Process text content
    function processTextNode(node) {
        try {
            if (!node || !node.nodeValue || node.nodeValue.trim() === '') return;
            
            const originalText = node.nodeValue;
            
            // بررسی اینکه آیا این node قبلاً پردازش شده است
            // Check if this node was already processed
            if (node._dateConverted) return;
            
            let newText = originalText;

            // الگوهای تاریخ برای جایگزینی
            // Date patterns for replacement
            const datePatterns = [
                /\d{4}[-\/]\d{1,2}[-\/]\d{1,2}(?:\s+\d{1,2}:\d{1,2}(?::\d{1,2})?)?/g,
                /\d{1,2}[-\/]\d{1,2}[-\/]\d{4}(?:\s+\d{1,2}:\d{1,2}(?::\d{1,2})?)?/g,
                /\d{1,2}\.\d{1,2}\.\d{4}/g,
                // تاریخ‌های متنی با سال: "September 16, 1961"
                /\b(january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)\s+(\d{1,2}),\s+(\d{4})\b/gi,
                // تاریخ‌های متنی بدون سال: "8 Nov", "November 15"
                /\b(\d{1,2})\s+(january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)\b/gi,
                /\b(january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)\s+(\d{1,2})\b/gi
            ];

            for (let pattern of datePatterns) {
                newText = newText.replace(pattern, (match) => {
                    return convertDateToJalali(match);
                });
            }

            // جایگزینی نام ماه‌های تنها (مثل "Nov", "October")
            // Replace standalone month names like "Nov", "October"
            const standaloneMonthPattern = /\b(january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)\b/gi;
            
            // فقط اگر قبلاً با الگوهای دیگر جایگزین نشده باشد
            // Only if not already replaced by other patterns
            newText = newText.replace(standaloneMonthPattern, (match, offset, string) => {
                // بررسی اینکه آیا این ماه قبلاً در یک تاریخ کامل پردازش شده یا نه
                // Check if this month is not already part of a processed date
                const before = newText.substring(Math.max(0, offset - 3), offset);
                const after = newText.substring(offset + match.length, Math.min(newText.length, offset + match.length + 3));
                
                // اگر قبل یا بعد از آن عدد یا کاما باشد، این قسمت از یک تاریخ کامل است
                // If there's a number or comma before or after, it's part of a full date
                if (/[\d,]/.test(before) || /[\d,]/.test(after)) {
                    return match; // تغییر نده
                }
                
                return convertStandaloneMonth(match);
            });

            // اگر متن تغییر کرده، به‌روزرسانی کن
            // If text changed, update it
            if (newText !== originalText) {
                node.nodeValue = newText;
                // علامت‌گذاری که این node پردازش شده است
                // Mark this node as processed
                try {
                    node._dateConverted = true;
                } catch (e) {
                    // برخی از node ها read-only هستند
                    // Some nodes are read-only
                }
            }
        } catch (error) {
            console.error('❌ processTextNode: Unexpected error', error, node);
        }
    }

    // تابع پردازش اتریبیوت‌های المان
    // Process element attributes
    function processElementAttributes(element) {
        try {
            if (!element || typeof element.hasAttribute !== 'function') {
                console.warn('⚠️ processElementAttributes: Invalid element', element);
                return;
            }
            
            // اتریبیوت‌هایی که ممکن است تاریخ داشته باشند
            // Attributes that might contain dates
            const dateAttributes = ['value', 'placeholder', 'title', 'data-date', 'datetime'];
            
            for (let attr of dateAttributes) {
                if (element.hasAttribute(attr)) {
                    const originalValue = element.getAttribute(attr);
                    if (originalValue && typeof originalValue === 'string') {
                        const newValue = convertDateToJalali(originalValue);
                        if (newValue !== originalValue) {
                            element.setAttribute(attr, newValue);
                        }
                    }
                }
            }
        } catch (error) {
            console.error('❌ processElementAttributes: Unexpected error', error, element);
        }
    }

    // تابع بازگشتی برای پیمایش DOM
    // Recursive DOM traversal function
    function traverseDOM(node) {
        try {
            if (!node) {
                console.warn('⚠️ traverseDOM: Invalid node (null/undefined)');
                return;
            }
            
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
                    if (children && children.length > 0) {
                        for (let i = 0; i < children.length; i++) {
                            traverseDOM(children[i]);
                        }
                    }
                }
            }
        } catch (error) {
            console.error('❌ traverseDOM: Error processing node', error, node);
            // Continue traversal despite error
        }
    }

    // تابع اصلی تبدیل تمام تاریخ‌ها
    // Main function to convert all dates
    function convertAllDates() {
        try {
            // جلوگیری از اجرای همزمان
            // Prevent concurrent execution
            if (isProcessing) {
                console.warn('⚠️ convertAllDates: Already processing, skipping...');
                return;
            }
            
            isProcessing = true;
            
            console.log('🔄 شروع تبدیل تاریخ‌های میلادی به شمسی...');
            console.log('🔄 Starting Gregorian to Jalali date conversion...');
            
            // Validate document availability
            if (!document || !document.body) {
                console.error('❌ convertAllDates: Document or body not available');
                isProcessing = false;
                return;
            }
            
            // مرحله 1: تشخیص فرمت رایج صفحه
            detectPageDateFormat();
            
            // مرحله 2: تبدیل تمام تاریخ‌ها به فرمت استاندارد YYYY/MM/DD
            traverseDOM(document.body);
            
            console.log('✅ تبدیل تاریخ‌ها با موفقیت انجام شد');
            console.log('✅ Date conversion completed successfully');
            console.log(`📅 تمام تاریخ‌ها به فرمت استاندارد شمسی (YYYY/MM/DD) تبدیل شدند`);
            console.log(`📅 All dates converted to standard Jalali format (YYYY/MM/DD)`);
        } catch (error) {
            console.error('❌ convertAllDates: Critical error during conversion', error);
        } finally {
            isProcessing = false;
        }
    }

    // اجرای تبدیل پس از بارگذاری کامل صفحه
    // Execute conversion after page load
    try {
        if (!document) {
            console.error('❌ Initialization: Document not available');
        } else if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', convertAllDates);
            console.log('⏳ Waiting for DOMContentLoaded event...');
        } else {
            convertAllDates();
        }
    } catch (error) {
        console.error('❌ Initialization: Failed to setup conversion', error);
    }

    // رصد تغییرات DOM و تبدیل تاریخ‌های جدید
    // Monitor DOM changes and convert new dates
    let mutationTimeout = null;
    const observer = new MutationObserver((mutations) => {
        try {
            if (!mutations || !Array.isArray(mutations)) {
                console.warn('⚠️ MutationObserver: Invalid mutations', mutations);
                return;
            }
            
            // Throttle mutations to prevent excessive processing
            // محدودسازی پردازش برای جلوگیری از اجرای بیش از حد
            if (mutationTimeout) {
                clearTimeout(mutationTimeout);
            }
            
            mutationTimeout = setTimeout(() => {
                mutations.forEach((mutation) => {
                    try {
                        if (!mutation || !mutation.addedNodes) {
                            return;
                        }
                        
                        mutation.addedNodes.forEach((node) => {
                            try {
                                if (node && (node.nodeType === Node.ELEMENT_NODE || node.nodeType === Node.TEXT_NODE)) {
                                    traverseDOM(node);
                                }
                            } catch (nodeError) {
                                console.error('❌ MutationObserver: Error processing added node', nodeError, node);
                            }
                        });
                    } catch (mutationError) {
                        console.error('❌ MutationObserver: Error processing mutation', mutationError, mutation);
                    }
                });
            }, 100); // 100ms throttle
        } catch (error) {
            console.error('❌ MutationObserver: Critical error in callback', error);
        }
    });

    // شروع رصد تغییرات
    // Start observing changes
    try {
        if (!document || !document.body) {
            console.error('❌ MutationObserver: Cannot start - document.body not available');
        } else {
            observer.observe(document.body, {
                childList: true,
                subtree: true,
                characterData: true
            });
            console.log('👀 MutationObserver started successfully');
        }
    } catch (error) {
        console.error('❌ MutationObserver: Failed to start observer', error);
    }

    console.log('📅 سیستم تبدیل خودکار تاریخ فعال شد');
    console.log('📅 Automatic date conversion system activated');
    console.log('🎯 فرمت خروجی: همیشه YYYY/MM/DD (شمسی)');
    console.log('🎯 Output format: Always YYYY/MM/DD (Jalali)');

})();
