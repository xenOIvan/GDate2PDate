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
        if (typeof Logger !== 'undefined') {
            Logger.error('❌ Browser does not support Node API');
        } else {
            log.error('❌ Browser does not support Node API');
        }
        return;
    }

    // Use Logger if available, fallback to console for errors
    // استفاده از Logger در صورت وجود، بازگشت به console برای خطاها
    const log = typeof Logger !== 'undefined' ? Logger : {
        debug: () => {},
        info: () => {},
        warn: () => {},
        error: console.error.bind(console),
        conversion: () => {},
        performance: () => {},
        mutation: () => {},
        format: () => {}
    };

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
                log.warn('⚠️ gregorianToJalali: Invalid input types', { gy, gm, gd });
                return null;
            }
            
            if (isNaN(gy) || isNaN(gm) || isNaN(gd)) {
                log.warn('⚠️ gregorianToJalali: NaN values detected', { gy, gm, gd });
                return null;
            }
            
            if (gy < 1900 || gy > 2100) {
                log.warn('⚠️ gregorianToJalali: Year out of range (1900-2100)', { gy });
                return null;
            }
            
            if (gm < 1 || gm > 12) {
                log.warn('⚠️ gregorianToJalali: Month out of range (1-12)', { gm });
                return null;
            }
            
            if (gd < 1 || gd > 31) {
                log.warn('⚠️ gregorianToJalali: Day out of range (1-31)', { gd });
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
            log.error('❌ gregorianToJalali: Unexpected error', error, { gy, gm, gd });
            return null;
        }
    }

    // تابع تشخیص فرمت تاریخ
    // Detect date format function
    function detectDateFormat(dateStr) {
        try {
            if (!dateStr || typeof dateStr !== 'string') {
                log.warn('⚠️ detectDateFormat: Invalid input', dateStr);
                return null;
            }
            
            // فرمت‌های مختلف تاریخ میلادی
            // IMPORTANT: Patterns with time MUST come BEFORE patterns without time!
            const patterns = [
                // With time: 2024-12-31 14:30:45 or 2024/12/31 14:30:45 (MUST BE FIRST!)
                { regex: /(\d{4})[-\/](\d{1,2})[-\/](\d{1,2})\s+(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?/, format: 'YYYY-MM-DD HH:mm:ss', separator: null, priority: 1 },
                // US with time: 12/31/2024 14:30:45 (MUST BE BEFORE US format without time!)
                { regex: /(\d{1,2})[-\/](\d{1,2})[-\/](\d{4})\s+(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?/, format: 'MM-DD-YYYY HH:mm:ss', separator: null, priority: 2 },
                // ISO format: 2024-12-31 or 2024/12/31 (without time)
                { regex: /(\d{4})[-\/](\d{1,2})[-\/](\d{1,2})/, format: 'YYYY-MM-DD', separator: null, priority: 1 },
                // European format: 31.12.2024 (dot separator = European)
                { regex: /(\d{1,2})\.(\d{1,2})\.(\d{4})/, format: 'DD.MM.YYYY', separator: '.', priority: 2 },
                // Ambiguous slash format: could be DD/MM/YYYY or MM/DD/YYYY
                // Prioritize DD/MM/YYYY (European) when first number > 12
                { regex: /^(1[3-9]|[2-3]\d)[\/](\d{1,2})[\/](\d{4})/, format: 'DD-MM-YYYY', separator: '/', priority: 2 },
                // US format: 12/31/2024 or 12-31-2024 (only when first number <= 12)
                { regex: /(\d{1,2})[-\/](\d{1,2})[-\/](\d{4})/, format: 'MM-DD-YYYY', separator: null, priority: 3 },
                // Textual dates: "15 Jan 2024", "8 Nov", "Nov 8", "November 15", "15 September", "September 16, 1961"
                // IMPORTANT: Patterns WITH year must come BEFORE patterns WITHOUT year!
                { regex: /\b(\d{1,2})\s+(january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)\s+(\d{4})\b/i, format: 'DD Month YYYY', separator: null, priority: 4 },
                { regex: /\b(january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)\s+(\d{1,2}),\s+(\d{4})\b/i, format: 'Month DD, YYYY', separator: null, priority: 4 },
                { regex: /\b(\d{1,2})\s+(january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)\b/i, format: 'DD Month', separator: null, priority: 5 },
                { regex: /\b(january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)\s+(\d{1,2})\b/i, format: 'Month DD', separator: null, priority: 5 }
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
            
            log.warn('⚠️ detectDateFormat: No matching pattern found', dateStr);
            return null;
        } catch (error) {
            log.error('❌ detectDateFormat: Unexpected error', error, dateStr);
            return null;
        }
    }

    // تابع تبدیل نام ماه به شماره
    // Convert month name to number
    function getMonthNumber(monthName) {
        try {
            if (!monthName || typeof monthName !== 'string') {
                log.warn('⚠️ getMonthNumber: Invalid month name', monthName);
                return null;
            }
            return gregorianMonths[monthName.toLowerCase()] || null;
        } catch (error) {
            log.error('❌ getMonthNumber: Error processing month name', error, monthName);
            return null;
        }
    }

    // تابع تبدیل تاریخ متنی (مثل "8 Nov" یا "September 15" یا "September 16, 1961")
    // Convert textual dates like "8 Nov" or "September 15" or "September 16, 1961"
    function convertTextualDate(dateStr) {
        try {
            if (!dateStr || typeof dateStr !== 'string') {
                log.warn('⚠️ convertTextualDate: Invalid input', dateStr);
                return dateStr;
            }
            
            let day, month, year;
            
            // Pattern 1: "September 16, 1961" (Month DD, YYYY)
            let match = dateStr.match(/\b(january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)\s+(\d{1,2}),\s+(\d{4})\b/i);
            if (match) {
                month = getMonthNumber(match[1]);
                day = parseInt(match[2]);
                year = parseInt(match[3]);
            } else {
                // Pattern 2: "15 Jan 2024" (DD Month YYYY - no comma)
                match = dateStr.match(/\b(\d{1,2})\s+(january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)\s+(\d{4})\b/i);
                if (match) {
                    day = parseInt(match[1]);
                    month = getMonthNumber(match[2]);
                    year = parseInt(match[3]);
                } else {
                    // Pattern 3: "8 Nov" or "15 September" (DD Month - no year)
                    match = dateStr.match(/\b(\d{1,2})\s+(january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)\b/i);
                    
                    if (match) {
                        day = parseInt(match[1]);
                        month = getMonthNumber(match[2]);
                        // Use current year for dates without year
                        const now = new Date();
                        year = now.getFullYear();
                        
                        // If the date hasn't occurred yet this year, it might refer to last year
                        // For example: If today is Jan 2025 and we see "Dec 31", it likely means Dec 31, 2024
                        const currentMonth = now.getMonth() + 1;
                        const currentDay = now.getDate();
                        if (month > currentMonth || (month === currentMonth && day > currentDay)) {
                            // Date is in the future this year - might actually refer to last year
                            // But we'll keep current year as default behavior
                        }
                    } else {
                        // Pattern 4: "Nov 8" or "September 15" (Month DD - no year)
                        match = dateStr.match(/\b(january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)\s+(\d{1,2})\b/i);
                        if (match) {
                            month = getMonthNumber(match[1]);
                            day = parseInt(match[2]);
                            // Use current year for dates without year
                            const now = new Date();
                            year = now.getFullYear();
                            
                            // Same logic as above for future dates
                            const currentMonth = now.getMonth() + 1;
                            const currentDay = now.getDate();
                            if (month > currentMonth || (month === currentMonth && day > currentDay)) {
                                // Date is in the future this year - might actually refer to last year
                                // But we'll keep current year as default behavior
                            }
                        }
                    }
                }
            }

            if (day && month && year) {
                const jalali = gregorianToJalali(year, month, day);
                
                if (!jalali) {
                    log.warn('⚠️ convertTextualDate: Conversion failed', { dateStr, year, month, day });
                    return dateStr;
                }
                
                const jYear = jalali.year.toString();
                const jMonth = jalali.month.toString().padStart(2, '0');
                const jDay = jalali.day.toString().padStart(2, '0');
                
                return `${jYear}/${jMonth}/${jDay}`;
            }
            
            return dateStr;
        } catch (error) {
            log.error('❌ convertTextualDate: Unexpected error', error, dateStr);
            return dateStr;
        }
    }

    // تابع تبدیل نام ماه تنها (مثل "Nov" یا "October")
    // Convert standalone month names like "Nov" or "October"
    function convertStandaloneMonth(monthStr, originalText, offset) {
        try {
            if (!monthStr || typeof monthStr !== 'string') {
                log.warn('⚠️ convertStandaloneMonth: Invalid input', monthStr);
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
                
                // Check if Persian month is already present after this position
                // بررسی اینکه آیا ماه شمسی قبلاً بعد از این موقعیت وجود دارد
                if (originalText && offset !== undefined) {
                    const textAfter = originalText.substring(offset + monthName.length, offset + monthName.length + 20);
                    // If Persian month already exists in parentheses, don't convert
                    if (textAfter.includes(`(${jalaliMonth})`)) {
                        return monthName;
                    }
                }
                
                // نمایش هر دو نام به صورت: "Nov (آبان)"
                return `${monthName} (${jalaliMonth})`;
            }
            
            return monthStr;
        } catch (error) {
            log.error('❌ convertStandaloneMonth: Unexpected error', error, monthStr);
            return monthStr;
        }
    }

    // تابع تشخیص فرمت رایج در کل صفحه
    // Detect the most common date format on the entire page
    function detectPageDateFormat() {
        try {
            if (!document || !document.body) {
                log.warn('⚠️ detectPageDateFormat: Document or body not available');
                return 'YYYY-MM-DD';
            }
            
            const bodyText = document.body.innerText;
            
            if (!bodyText || typeof bodyText !== 'string') {
                log.warn('⚠️ detectPageDateFormat: Invalid body text');
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

            log.debug(`📊 فرمت تشخیص داده شده: ${mostCommonFormat} (تعداد: ${maxCount})`);
            log.debug(`📊 Detected format: ${mostCommonFormat} (count: ${maxCount})`);
            
            return mostCommonFormat;
        } catch (error) {
            log.error('❌ detectPageDateFormat: Unexpected error', error);
            return 'YYYY-MM-DD'; // Return default format on error
        }
    }

    // تابع تبدیل تاریخ با حفظ فرمت
    // Convert date while preserving format
    function convertDateToJalali(dateStr) {
        try {
            if (!dateStr || typeof dateStr !== 'string') {
                log.warn('⚠️ convertDateToJalali: Invalid input', dateStr);
                return dateStr;
            }
            
            // Skip if already a Jalali date (YYYY/MM/DD with year > 1300)
            // رد کردن تاریخ‌های شمسی که قبلاً تبدیل شده‌اند
            // Updated pattern to also match timestamps like "1403/08/26 14:30:45"
            const jalaliPattern = /^(1[3-4]\d{2})[\/](0?[1-9]|1[0-2])[\/](0?[1-9]|[12]\d|3[01])(\s+\d{1,2}:\d{1,2}(?::\d{1,2})?)?$/;
            if (jalaliPattern.test(dateStr.trim())) {
                return dateStr; // Already converted to Jalali
            }
            
            const detected = detectDateFormat(dateStr.trim());
            if (!detected) {
                log.warn('⚠️ convertDateToJalali: No format detected', dateStr);
                return dateStr;
            }

            const { match, format } = detected;
            let year, month, day, hour, minute, second;

            // بررسی تاریخ‌های متنی (مثل "8 Nov" یا "November 15" یا "15 Jan 2024" یا "September 16, 1961")
            // Check for textual dates like "8 Nov" or "November 15" or "15 Jan 2024" or "September 16, 1961"
            if (format === 'DD Month' || format === 'Month DD' || format === 'DD Month YYYY' || format === 'Month DD, YYYY') {
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
                log.debug(`🔍 Extracted (YYYY format): Y=${year}, M=${month}, D=${day}, h=${hour}, m=${minute}, s=${second}`);
            } else if (format.startsWith('MM')) {
                month = parseInt(match[1]);
                day = parseInt(match[2]);
                year = parseInt(match[3]);
                hour = match[4] ? parseInt(match[4]) : null;
                minute = match[5] ? parseInt(match[5]) : null;
                second = match[6] ? parseInt(match[6]) : null;
                log.debug(`🔍 Extracted (MM format): Y=${year}, M=${month}, D=${day}, h=${hour}, m=${minute}, s=${second}`);
            } else if (format.startsWith('DD')) {
                day = parseInt(match[1]);
                month = parseInt(match[2]);
                year = parseInt(match[3]);
                hour = match[4] ? parseInt(match[4]) : null;
                minute = match[5] ? parseInt(match[5]) : null;
                second = match[6] ? parseInt(match[6]) : null;
                log.debug(`🔍 Extracted (DD format): Y=${year}, M=${month}, D=${day}, h=${hour}, m=${minute}, s=${second}`);
            }

            // Validate parsed values
            if (isNaN(year) || isNaN(month) || isNaN(day)) {
                log.warn('⚠️ convertDateToJalali: Invalid parsed values (NaN)', { year, month, day, dateStr });
                return dateStr;
            }

            // بررسی اعتبار تاریخ میلادی
            // Validate Gregorian date
            if (year < 1900 || year > 2100) {
                log.warn('⚠️ convertDateToJalali: Year out of valid range (1900-2100)', { year, month, day, dateStr });
                return dateStr;
            }
            
            // If month or day are invalid, this might be a misdetected format
            // اگر ماه یا روز نامعتبر است، احتمالاً فرمت اشتباه تشخیص داده شده
            if (month < 1 || month > 12) {
                // Try swapping day and month (DD/MM vs MM/DD confusion)
                if (day >= 1 && day <= 12 && month >= 1 && month <= 31) {
                    const temp = month;
                    month = day;
                    day = temp;
                    log.debug('🔄 Swapped day and month', { original: dateStr, newMonth: month, newDay: day });
                } else {
                    log.warn('⚠️ convertDateToJalali: Month out of valid range', { year, month, day, dateStr });
                    return dateStr;
                }
            }
            
            if (day < 1 || day > 31) {
                log.warn('⚠️ convertDateToJalali: Day out of valid range', { year, month, day, dateStr });
                return dateStr;
            }

            // تبدیل به شمسی
            // Convert to Jalali
            const jalali = gregorianToJalali(year, month, day);
            
            if (!jalali) {
                log.warn('⚠️ convertDateToJalali: Conversion returned null', { year, month, day, dateStr });
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
                log.debug(`⏰ Time preserved: ${dateStr} → ${result} (hour=${hour}, min=${minute}, sec=${second})`);
            }

            log.debug(`📅 Conversion: ${dateStr} → ${result}`);
            return result;
        } catch (error) {
            log.error('❌ convertDateToJalali: Unexpected error', error, dateStr);
            return dateStr;
        }
    }

    // تابع پردازش محتوای متنی
    // Process text content
    function processTextNode(node) {
        try {
            if (!node || !node.nodeValue || node.nodeValue.trim() === '') return;
            
            const originalText = node.nodeValue;
            
            // Check parent element - skip if it's a time-related element
            // بررسی المان والد - رد کردن اگر المان مربوط به زمان است
            if (node.parentNode && node.parentNode.tagName) {
                const parentTag = node.parentNode.tagName.toLowerCase();
                const parentClass = node.parentNode.className || '';
                
                // Skip <time>, <relative-time>, or elements with time-related classes
                if (parentTag === 'time' || 
                    parentTag === 'relative-time' || 
                    /time|date|timestamp|relative|ago/i.test(parentClass)) {
                    return; // Skip time elements
                }
            }
            
            // Skip relative time phrases ("1 hour ago", "2 min ago", "2 minutes ago", etc.)
            // رد کردن عبارات زمان نسبی ("1 hour ago", "2 min ago", "2 minutes ago" و غیره)
            const relativeTimePattern = /\b\d+\s*(second|seconds|sec|secs|minute|minutes|min|mins|hour|hours|hr|hrs|day|days|week|weeks|month|months|year|years|yr|yrs)\s+(ago|from now|later|earlier|before|after)\b/i;
            if (relativeTimePattern.test(originalText)) {
                return; // Skip relative time expressions
            }
            
            // Also skip "just now", "moments ago", "yesterday", "today", "tomorrow", "an hour ago", "a minute ago"
            const commonTimePattern = /\b(just now|moments? ago|yesterday|today|tomorrow|last (week|month|year)|next (week|month|year)|an? (second|minute|hour|day|week|month|year) ago)\b/i;
            if (commonTimePattern.test(originalText)) {
                return; // Skip common time expressions
            }
            
            // Check if this text contains Persian dates (already converted)
            // بررسی اینکه آیا این متن شامل تاریخ شمسی است (قبلاً تبدیل شده)
            const hasPersianDate = /\d{4}\/\d{2}\/\d{2}(?:\s+\d{1,2}:\d{1,2}(?::\d{1,2})?)?/.test(originalText);
            
            // Check if text contains Persian characters (likely already converted)
            // بررسی اینکه آیا متن شامل حروف فارسی است (احتمالاً قبلاً تبدیل شده)
            const hasPersianChars = /[\u0600-\u06FF]/.test(originalText);
            
            // Skip if already contains Persian dates to avoid re-conversion
            // رد کردن اگر قبلاً شامل تاریخ شمسی است تا از تبدیل مجدد جلوگیری شود
            if (hasPersianDate && originalText.indexOf('/') > -1) {
                // But allow if there are also Gregorian dates present
                const hasGregorianPattern = /\d{4}[-]\d{1,2}[-]\d{1,2}|\d{1,2}[-]\d{1,2}[-]\d{4}/.test(originalText);
                if (!hasGregorianPattern) return;
            }
            
            // If text has Persian chars and month name pattern like "Sep (مهر)", skip it
            // اگر متن دارای حروف فارسی و الگوی نام ماه مثل "Sep (مهر)" باشد، رد کن
            if (hasPersianChars && /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|january|february|march|april|june|july|august|september|october|november|december)\s*\([^)]*[\u0600-\u06FF]/i.test(originalText)) {
                return; // Already converted month names, skip
            }
            
            let newText = originalText;

            // الگوهای تاریخ برای جایگزینی
            // Date patterns for replacement
            const datePatterns = [
                /\d{4}[-\/]\d{1,2}[-\/]\d{1,2}(?:\s+\d{1,2}:\d{1,2}(?::\d{1,2})?)?/g,
                /\d{1,2}[-\/]\d{1,2}[-\/]\d{4}(?:\s+\d{1,2}:\d{1,2}(?::\d{1,2})?)?/g,
                /\d{1,2}\.\d{1,2}\.\d{4}/g,
                // تاریخ‌های متنی با سال: "September 16, 1961" و "15 Jan 2024"
                /\b(january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)\s+(\d{1,2}),\s+(\d{4})\b/gi,
                /\b(\d{1,2})\s+(january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)\s+(\d{4})\b/gi,
                // تاریخ‌های متنی بدون سال: "8 Nov", "November 15" (but not "8 hours ago")
                /\b(\d{1,2})\s+(january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)(?!\s+ago)\b/gi,
                /\b(january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)\s+(\d{1,2})(?!\s+ago)\b/gi
            ];

            for (let pattern of datePatterns) {
                newText = newText.replace(pattern, (match, ...args) => {
                    // Get the full match string and its position
                    const fullMatch = match;
                    const offset = args[args.length - 2];
                    const fullString = args[args.length - 1];
                    
                    // Check context before and after match to ensure it's not a relative time
                    const contextBefore = fullString.substring(Math.max(0, offset - 20), offset);
                    const contextAfter = fullString.substring(offset + fullMatch.length, Math.min(fullString.length, offset + fullMatch.length + 20));
                    
                    // Skip if it's part of a relative time expression
                    if (/\b(second|minute|hour|day|week|month|year)s?\s*$/i.test(contextBefore) || 
                        /^\s*(second|minute|hour|day|week|month|year)s?\s+(ago|from|later)/i.test(contextAfter)) {
                        return fullMatch; // Don't convert
                    }
                    
                    return convertDateToJalali(fullMatch);
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
                const after = newText.substring(offset + match.length, Math.min(newText.length, offset + match.length + 20));
                
                // اگر قبل یا بعد از آن عدد یا کاما باشد، این قسمت از یک تاریخ کامل است
                // If there's a number or comma before or after, it's part of a full date
                if (/[\d,]/.test(before) || /[\d,]/.test(after)) {
                    return match; // تغییر نده
                }
                
                // اگر بعد از آن قبلاً پرانتز با متن فارسی وجود دارد، تغییر نده
                // If there's already a parenthesis with Persian text after it, don't change
                if (/^\s*\([^)]*[\u0600-\u06FF]/.test(after)) {
                    return match; // Already converted
                }
                
                return convertStandaloneMonth(match, newText, offset);
            });

            // اگر متن تغییر کرده، به‌روزرسانی کن
            // If text changed, update it
            if (newText !== originalText) {
                node.nodeValue = newText;
            }
        } catch (error) {
            log.error('❌ processTextNode: Unexpected error', error, node);
        }
    }

    // تابع پردازش اتریبیوت‌های المان
    // Process element attributes
    function processElementAttributes(element) {
        try {
            if (!element || typeof element.hasAttribute !== 'function') {
                log.warn('⚠️ processElementAttributes: Invalid element', element);
                return;
            }
            
            // Skip input elements, textarea, and select to preserve user input
            // رد کردن المان‌های ورودی برای حفظ داده‌های کاربر
            const tagName = element.tagName ? element.tagName.toLowerCase() : '';
            if (tagName === 'input' || tagName === 'textarea' || tagName === 'select') {
                log.debug('⏭️ Skipping input element to preserve user data:', tagName);
                return;
            }
            
            // اتریبیوت‌هایی که ممکن است تاریخ داشته باشند
            // Attributes that might contain dates (excluding value to avoid input interference)
            const dateAttributes = ['title', 'data-date', 'datetime'];
            
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
            log.error('❌ processElementAttributes: Unexpected error', error, element);
        }
    }

    // تابع بازگشتی برای پیمایش DOM
    // Recursive DOM traversal function
    function traverseDOM(node) {
        try {
            if (!node) {
                log.warn('⚠️ traverseDOM: Invalid node (null/undefined)');
                return;
            }
            
            // پردازش نودهای متنی
            // Process text nodes
            if (node.nodeType === Node.TEXT_NODE) {
                // Skip text nodes inside input, textarea, select, time, relative-time elements
                // رد کردن نودهای متنی داخل المان‌های ورودی و زمان
                const parentTag = node.parentNode ? node.parentNode.tagName : '';
                if (parentTag && (parentTag === 'INPUT' || parentTag === 'TEXTAREA' || parentTag === 'SELECT' || 
                    parentTag === 'TIME' || parentTag === 'RELATIVE-TIME')) {
                    return;
                }
                processTextNode(node);
            } 
            // پردازش المان‌ها
            // Process elements
            else if (node.nodeType === Node.ELEMENT_NODE) {
                const tagName = node.tagName ? node.tagName.toUpperCase() : '';
                
                // نادیده گرفتن تگ‌های script، style، time و المان‌های ورودی
                // Skip script, style, time tags and input elements
                if (tagName !== 'SCRIPT' && tagName !== 'STYLE' && 
                    tagName !== 'INPUT' && tagName !== 'TEXTAREA' && tagName !== 'SELECT' &&
                    tagName !== 'TIME' && tagName !== 'RELATIVE-TIME') {
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
            log.error('❌ traverseDOM: Error processing node', error, node);
            // Continue traversal despite error
        }
    }

    // تابع بررسی اولیه وجود تاریخ در صفحه
    // Quick check if page contains any dates
    function hasDateContent() {
        try {
            const bodyText = document.body.innerText;
            if (!bodyText) return false;
            
            // Sample first 10000 characters only for performance
            const sample = bodyText.substring(0, 10000);
            
            // Quick regex check for date patterns
            const hasDatePattern = /\d{4}[-\/]\d{1,2}[-\/]\d{1,2}|\d{1,2}[-\/\.]\d{1,2}[-\/\.]\d{4}|\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|january|february|march|april|june|july|august|september|october|november|december)\b/i.test(sample);
            
            return hasDatePattern;
        } catch (error) {
            log.error('❌ hasDateContent: Error', error);
            return true; // Proceed if check fails
        }
    }

    // تابع اصلی تبدیل تمام تاریخ‌ها
    // Main function to convert all dates
    function convertAllDates() {
        try {
            // جلوگیری از اجرای همزمان
            // Prevent concurrent execution
            if (isProcessing) {
                log.warn('⚠️ convertAllDates: Already processing, skipping...');
                return;
            }
            
            // Validate document availability
            if (!document || !document.body) {
                log.error('❌ convertAllDates: Document or body not available');
                return;
            }
            
            // Early exit if no dates detected
            // خروج سریع اگر تاریخی وجود ندارد
            if (!hasDateContent()) {
                log.debug('⏭️ No dates detected, skipping conversion');
                return;
            }
            
            isProcessing = true;
            
            log.debug('🔄 شروع تبدیل تاریخ‌های میلادی به شمسی...');
            log.debug('🔄 Starting Gregorian to Jalali date conversion...');
            
            // مرحله 1: تشخیص فرمت رایج صفحه
            detectPageDateFormat();
            
            // مرحله 2: تبدیل تمام تاریخ‌ها با استفاده از requestIdleCallback
            // Use requestIdleCallback for non-blocking processing
            if (typeof requestIdleCallback !== 'undefined') {
                requestIdleCallback(function() {
                    try {
                        traverseDOM(document.body);
                        log.debug('✅ تبدیل تاریخ‌ها با موفقیت انجام شد');
                        log.debug('✅ Date conversion completed successfully');
                    } catch (error) {
                        log.error('❌ traverseDOM error:', error);
                    } finally {
                        isProcessing = false;
                    }
                }, { timeout: 2000 });
            } else {
                // Fallback for browsers without requestIdleCallback
                setTimeout(function() {
                    try {
                        traverseDOM(document.body);
                        log.debug('✅ تبدیل تاریخ‌ها با موفقیت انجام شد');
                        log.debug('✅ Date conversion completed successfully');
                    } catch (error) {
                        log.error('❌ traverseDOM error:', error);
                    } finally {
                        isProcessing = false;
                    }
                }, 100);
            }
        } catch (error) {
            log.error('❌ convertAllDates: Critical error during conversion', error);
            isProcessing = false;
        }
    }

    // اجرای تبدیل پس از بارگذاری کامل صفحه
    // Execute conversion after page load
    try {
        if (!document) {
            log.error('❌ Initialization: Document not available');
        } else if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', convertAllDates);
            log.debug('⏳ Waiting for DOMContentLoaded event...');
        } else {
            convertAllDates();
        }
    } catch (error) {
        log.error('❌ Initialization: Failed to setup conversion', error);
    }

    // رصد تغییرات DOM و تبدیل تاریخ‌های جدید
    // Monitor DOM changes and convert new dates
    let mutationTimeout = null;
    let pendingMutations = [];
    
    const observer = new MutationObserver((mutations) => {
        try {
            if (!mutations || !Array.isArray(mutations)) {
                log.warn('⚠️ MutationObserver: Invalid mutations', mutations);
                return;
            }
            
            // Add to pending queue
            pendingMutations.push(...mutations);
            
            // Throttle mutations to prevent excessive processing
            // محدودسازی پردازش برای جلوگیری از اجرای بیش از حد
            if (mutationTimeout) {
                clearTimeout(mutationTimeout);
            }
            
            mutationTimeout = setTimeout(() => {
                // Process only if not currently processing
                if (isProcessing) {
                    pendingMutations = [];
                    return;
                }
                
                const mutationsToProcess = pendingMutations.slice(0, 50); // Limit batch size
                pendingMutations = [];
                
                mutationsToProcess.forEach((mutation) => {
                    try {
                        // Handle added nodes only
                        // مدیریت فقط نودهای اضافه شده
                        if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                            mutation.addedNodes.forEach((node) => {
                                try {
                                    // Only process elements with significant content
                                    if (node && node.nodeType === Node.ELEMENT_NODE) {
                                        // Skip small or non-visible elements
                                        if (node.textContent && node.textContent.length > 8) {
                                            traverseDOM(node);
                                        }
                                    } else if (node && node.nodeType === Node.TEXT_NODE) {
                                        if (node.nodeValue && node.nodeValue.length > 8) {
                                            processTextNode(node);
                                        }
                                    }
                                } catch (nodeError) {
                                    log.error('❌ MutationObserver: Error processing added node', nodeError);
                                }
                            });
                        }
                    } catch (mutationError) {
                        log.error('❌ MutationObserver: Error processing mutation', mutationError);
                    }
                });
            }, 500); // Increased throttle to 500ms
        } catch (error) {
            log.error('❌ MutationObserver: Critical error in callback', error);
        }
    });

    // شروع رصد تغییرات
    // Start observing changes
    try {
        if (!document || !document.body) {
            log.error('❌ MutationObserver: Cannot start - document.body not available');
        } else {
            observer.observe(document.body, {
                childList: true,
                subtree: true,
                characterData: false  // Disable for better performance
            });
            log.debug('👀 MutationObserver started successfully (optimized mode)');
        }
    } catch (error) {
        log.error('❌ MutationObserver: Failed to start observer', error);
    }

    // Listen for custom re-conversion events from content script
    // گوش دادن به رویدادهای سفارشی تبدیل مجدد از content script
    document.addEventListener('gdate2pdate-reconvert', function(event) {
        try {
            log.debug('🔄 GDate2PDate: Re-conversion triggered by event', event.detail);
            
            // Re-run conversion on the entire page
            // اجرای مجدد تبدیل در کل صفحه
            if (!isProcessing) {
                convertAllDates();
            } else {
                log.debug('⏳ GDate2PDate: Conversion already in progress, will retry...');
                setTimeout(function() {
                    if (!isProcessing) {
                        convertAllDates();
                    }
                }, 500);
            }
        } catch (error) {
            log.error('❌ GDate2PDate: Error handling reconvert event', error);
        }
    });

    log.debug('📅 سیستم تبدیل خودکار تاریخ فعال شد');
    log.debug('📅 Automatic date conversion system activated');
    log.debug('🎯 فرمت خروجی: همیشه YYYY/MM/DD (شمسی)');
    log.debug('🎯 Output format: Always YYYY/MM/DD (Jalali)');
    log.debug('👂 Listening for late-loading content events');
    log.debug('👂 گوش دادن به رویدادهای محتوای دیررس');

})();
