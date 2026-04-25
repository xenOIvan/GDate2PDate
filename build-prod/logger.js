/**
 * Centralized Logging Utility for GDate2PDate
 * ابزار متمرکز لاگ‌گیری برای افزونه تبدیل تاریخ
 * 
 * Handles all logging with environment-aware controls
 * مدیریت تمام لاگ‌ها با کنترل‌های آگاه از محیط
 */

(function() {
  'use strict';

  // Check if CONFIG is available
  const isDevelopment = typeof CONFIG !== 'undefined' && CONFIG.mode === 'development';
  const loggingEnabled = typeof CONFIG !== 'undefined' && CONFIG.enableLogging;

  /**
   * Logger utility object
   * شیء ابزار لاگ‌گیری
   */
  window.Logger = {
    /**
     * Log debug messages (only in development mode)
     * لاگ پیام‌های اشکال‌زدایی (فقط در حالت development)
     */
    debug: function(...args) {
      if (isDevelopment && loggingEnabled) {
        console.log(...args);
      }
    },

    /**
     * Log info messages (only in development mode)
     * لاگ پیام‌های اطلاعاتی (فقط در حالت development)
     */
    info: function(...args) {
      if (isDevelopment && loggingEnabled) {
        console.info(...args);
      }
    },

    /**
     * Log warning messages (only in development mode)
     * لاگ پیام‌های هشدار (فقط در حالت development)
     */
    warn: function(...args) {
      if (isDevelopment && loggingEnabled) {
        console.warn(...args);
      }
    },

    /**
     * Log error messages (always logged, even in production)
     * لاگ پیام‌های خطا (همیشه ثبت می‌شود، حتی در production)
     */
    error: function(...args) {
      console.error(...args);
    },

    /**
     * Log conversion events (controlled by feature flag)
     * لاگ رویدادهای تبدیل (کنترل شده توسط پرچم ویژگی)
     */
    conversion: function(...args) {
      if (isDevelopment && loggingEnabled && 
          typeof CONFIG !== 'undefined' && 
          CONFIG.features && 
          CONFIG.features.detailedConversionLogs) {
        console.log(...args);
      }
    },

    /**
     * Log performance tracking (controlled by feature flag)
     * لاگ ردیابی عملکرد (کنترل شده توسط پرچم ویژگی)
     */
    performance: function(...args) {
      if (isDevelopment && loggingEnabled && 
          typeof CONFIG !== 'undefined' && 
          CONFIG.features && 
          CONFIG.features.performanceTracking) {
        console.log(...args);
      }
    },

    /**
     * Log mutation observer events (controlled by feature flag)
     * لاگ رویدادهای رصدگر تغییرات (کنترل شده توسط پرچم ویژگی)
     */
    mutation: function(...args) {
      if (isDevelopment && loggingEnabled && 
          typeof CONFIG !== 'undefined' && 
          CONFIG.features && 
          CONFIG.features.mutationLogs) {
        console.log(...args);
      }
    },

    /**
     * Log format detection events (controlled by feature flag)
     * لاگ رویدادهای تشخیص فرمت (کنترل شده توسط پرچم ویژگی)
     */
    format: function(...args) {
      if (isDevelopment && loggingEnabled && 
          typeof CONFIG !== 'undefined' && 
          CONFIG.features && 
          CONFIG.features.formatDetectionLogs) {
        console.log(...args);
      }
    },

    /**
     * Check if logging is enabled
     * بررسی فعال بودن لاگ‌گیری
     */
    isEnabled: function() {
      return isDevelopment && loggingEnabled;
    },

    /**
     * Get current mode
     * دریافت حالت فعلی
     */
    getMode: function() {
      return isDevelopment ? 'development' : 'production';
    }
  };

  // Log initialization (only in development)
  if (isDevelopment && loggingEnabled) {
    console.log('🔧 Logger initialized in DEVELOPMENT mode');
    console.log('🔧 لاگر در حالت توسعه راه‌اندازی شد');
  }

})();
