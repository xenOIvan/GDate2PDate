/**
 * Content Script - Loads and manages the date conversion script
 * اسکریپت محتوا - مدیریت و بارگذاری اسکریپت تبدیل تاریخ
 */

(function() {
  'use strict';

  // Check if extension is enabled
  // بررسی فعال بودن افزونه
  chrome.storage.sync.get(['enabled'], function(result) {
    // Default to enabled if no setting exists
    // پیش‌فرض: فعال بودن افزونه
    const isEnabled = result.enabled !== false;
    
    if (isEnabled) {
      injectConversionScript();
    }
  });

  /**
   * Inject the main conversion script into the page context
   * تزریق اسکریپت اصلی تبدیل به محیط صفحه
   */
  function injectConversionScript() {
    try {
      // Create script element
      // ایجاد المان اسکریپت
      const script = document.createElement('script');
      script.src = chrome.runtime.getURL('script.js');
      script.type = 'text/javascript';
      
      // Add error handling
      // مدیریت خطا
      script.onerror = function() {
        console.error('GDate2PDate: Failed to load conversion script');
        console.error('تبدیل تاریخ: خطا در بارگذاری اسکریپت تبدیل');
      };
      
      script.onload = function() {
        console.log('GDate2PDate: Conversion script loaded successfully');
        console.log('تبدیل تاریخ: اسکریپت با موفقیت بارگذاری شد');
      };
      
      // Inject into page
      // تزریق به صفحه
      (document.head || document.documentElement).appendChild(script);
      
      // Remove script tag after loading to keep DOM clean
      // حذف تگ اسکریپت پس از بارگذاری برای تمیز نگه داشتن DOM
      script.onload = function() {
        script.remove();
      };
      
    } catch (error) {
      console.error('GDate2PDate: Error injecting script:', error);
      console.error('تبدیل تاریخ: خطا در تزریق اسکریپت:', error);
    }
  }

  // Listen for messages from popup to reload page
  // گوش دادن به پیام‌های popup برای بارگذاری مجدد صفحه
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'reload') {
      window.location.reload();
      sendResponse({ status: 'reloading' });
    }
    return true;
  });

})();
