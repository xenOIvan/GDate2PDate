/**
 * Content Script - Loads and manages the date conversion script
 * اسکریپت محتوا - مدیریت و بارگذاری اسکریپت تبدیل تاریخ
 */

(function() {
  'use strict';

  let scriptInjected = false;

  // Check if extension is enabled
  // بررسی فعال بودن افزونه
  chrome.storage.sync.get(['enabled'], function(result) {
    // Default to enabled if no setting exists
    // پیش‌فرض: فعال بودن افزونه
    const isEnabled = result.enabled !== false;
    
    if (isEnabled) {
      injectConversionScript();
      
      // Setup additional observers for late-loading content
      setupLateLoadingHandlers();
    }
  });

  /**
   * Inject the main conversion script into the page context
   * تزریق اسکریپت اصلی تبدیل به محیط صفحه
   */
  function injectConversionScript() {
    if (scriptInjected) {
      console.log('GDate2PDate: Script already injected, skipping...');
      return;
    }
    
    try {
      // Create script element
      // ایجاد المان اسکریپت
      const script = document.createElement('script');
      script.src = chrome.runtime.getURL('script.js');
      script.type = 'text/javascript';
      script.id = 'gdate2pdate-converter';
      
      // Add error handling
      // مدیریت خطا
      script.onerror = function() {
        console.error('GDate2PDate: Failed to load conversion script');
        console.error('تبدیل تاریخ: خطا در بارگذاری اسکریپت تبدیل');
        scriptInjected = false;
      };
      
      script.onload = function() {
        console.log('GDate2PDate: Conversion script loaded successfully');
        console.log('تبدیل تاریخ: اسکریپت با موفقیت بارگذاری شد');
        scriptInjected = true;
        
        // Remove script tag after loading to keep DOM clean
        // حذف تگ اسکریپت پس از بارگذاری برای تمیز نگه داشتن DOM
        setTimeout(() => {
          script.remove();
        }, 100);
      };
      
      // Inject into page
      // تزریق به صفحه
      (document.head || document.documentElement).appendChild(script);
      
    } catch (error) {
      console.error('GDate2PDate: Error injecting script:', error);
      console.error('تبدیل تاریخ: خطا در تزریق اسکریپت:', error);
      scriptInjected = false;
    }
  }

  /**
   * Setup handlers for late-loading content (e.g., Azure dashboards, SPAs)
   * راه‌اندازی مدیریت‌کننده‌های محتوای دیررس (مثل داشبورد Azure، اپلیکیشن‌های تک‌صفحه‌ای)
   */
  function setupLateLoadingHandlers() {
    try {
      // Handle visibility changes (e.g., dashboard widgets loading when visible)
      // مدیریت تغییرات نمایش (مثلاً ویجت‌های داشبورد که هنگام نمایش بارگذاری می‌شوند)
      document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
          console.log('GDate2PDate: Page became visible, triggering conversion check');
          triggerConversionEvent();
        }
      });

      // Handle popstate events for SPAs
      // مدیریت رویدادهای popstate برای اپلیکیشن‌های تک‌صفحه‌ای
      window.addEventListener('popstate', function() {
        console.log('GDate2PDate: Popstate event detected, triggering conversion');
        setTimeout(triggerConversionEvent, 100);
      });

      // Handle hash changes
      // مدیریت تغییرات hash
      window.addEventListener('hashchange', function() {
        console.log('GDate2PDate: Hash change detected, triggering conversion');
        setTimeout(triggerConversionEvent, 100);
      });

      // Monitor for large DOM updates (e.g., dashboard rendering)
      // رصد به‌روزرسانی‌های بزرگ DOM (مثلاً رندر داشبورد)
      let mutationCount = 0;
      const contentObserver = new MutationObserver(function(mutations) {
        mutationCount += mutations.length;
        
        // If we detect many mutations, likely content has loaded
        // اگر تعداد زیادی تغییر تشخیص دهیم، احتمالاً محتوا بارگذاری شده
        if (mutationCount > 10) {
          mutationCount = 0;
          console.log('GDate2PDate: Large DOM update detected');
          triggerConversionEvent();
        }
      });

      contentObserver.observe(document.body, {
        childList: true,
        subtree: true
      });

      // Periodic check for new content (fallback for complex SPAs)
      // بررسی دوره‌ای برای محتوای جدید (پشتیبان برای اپلیکیشن‌های پیچیده)
      setInterval(function() {
        triggerConversionEvent();
      }, 5000); // Check every 5 seconds

      console.log('GDate2PDate: Late-loading handlers setup complete');
      
    } catch (error) {
      console.error('GDate2PDate: Error setting up late-loading handlers:', error);
    }
  }

  /**
   * Trigger a custom event to notify script.js to re-process the page
   * فعال‌سازی رویداد سفارشی برای اطلاع به script.js جهت پردازش مجدد صفحه
   */
  function triggerConversionEvent() {
    try {
      const event = new CustomEvent('gdate2pdate-reconvert', {
        bubbles: true,
        detail: { timestamp: Date.now() }
      });
      document.dispatchEvent(event);
    } catch (error) {
      console.error('GDate2PDate: Error triggering conversion event:', error);
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
