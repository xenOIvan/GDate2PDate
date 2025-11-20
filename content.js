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
   * Inject a script file into the page context
   * تزریق فایل اسکریپت به محیط صفحه
   */
  function injectScript(fileName, onLoadCallback) {
    return new Promise((resolve, reject) => {
      try {
        const script = document.createElement('script');
        script.src = chrome.runtime.getURL(fileName);
        script.type = 'text/javascript';
        
        script.onerror = function() {
          console.error(`GDate2PDate: Failed to load ${fileName}`);
          reject(new Error(`Failed to load ${fileName}`));
        };
        
        script.onload = function() {
          console.log(`GDate2PDate: ${fileName} loaded successfully`);
          if (onLoadCallback) onLoadCallback();
          
          // Remove script tag after loading to keep DOM clean
          setTimeout(() => {
            script.remove();
          }, 100);
          
          resolve();
        };
        
        (document.head || document.documentElement).appendChild(script);
      } catch (error) {
        console.error(`GDate2PDate: Error injecting ${fileName}:`, error);
        reject(error);
      }
    });
  }

  /**
   * Inject the main conversion script into the page context
   * تزریق اسکریپت اصلی تبدیل به محیط صفحه
   */
  async function injectConversionScript() {
    if (scriptInjected) {
      console.log('GDate2PDate: Script already injected, skipping...');
      return;
    }
    
    try {
      // Inject scripts in order: config.js -> logger.js -> script.js
      // تزریق اسکریپت‌ها به ترتیب: config.js -> logger.js -> script.js
      await injectScript('config.js');
      await injectScript('logger.js');
      await injectScript('script.js', () => {
        console.log('تبدیل تاریخ: اسکریپت با موفقیت بارگذاری شد');
        scriptInjected = true;
      });
      
    } catch (error) {
      console.error('GDate2PDate: Error injecting scripts:', error);
      console.error('تبدیل تاریخ: خطا در تزریق اسکریپت‌ها:', error);
      scriptInjected = false;
    }
  }

  /**
   * Setup handlers for late-loading content (e.g., Azure dashboards, SPAs)
   * راه‌اندازی مدیریت‌کننده‌های محتوای دیررس (مثل داشبورد Azure، اپلیکیشن‌های تک‌صفحه‌ای)
   */
  function setupLateLoadingHandlers() {
    try {
      let eventDebounceTimeout = null;
      
      function debounceConversionEvent(eventName, delay) {
        console.log('GDate2PDate: ' + eventName + ' detected');
        if (eventDebounceTimeout) {
          clearTimeout(eventDebounceTimeout);
        }
        eventDebounceTimeout = setTimeout(triggerConversionEvent, delay);
      }

      // Handle visibility changes (e.g., dashboard widgets loading when visible)
      // مدیریت تغییرات نمایش (مثلاً ویجت‌های داشبورد که هنگام نمایش بارگذاری می‌شوند)
      document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
          debounceConversionEvent('Page became visible', 500);
        }
      });

      // Handle popstate events for SPAs
      // مدیریت رویدادهای popstate برای اپلیکیشن‌های تک‌صفحه‌ای
      window.addEventListener('popstate', function() {
        debounceConversionEvent('Popstate event', 500);
      });

      // Handle hash changes
      // مدیریت تغییرات hash
      window.addEventListener('hashchange', function() {
        debounceConversionEvent('Hash change', 500);
      });

      // Monitor for large DOM updates (e.g., dashboard rendering)
      // رصد به‌روزرسانی‌های بزرگ DOM (مثلاً رندر داشبورد)
      let mutationCount = 0;
      let mutationCheckTimeout = null;
      
      const contentObserver = new MutationObserver(function(mutations) {
        mutationCount += mutations.length;
        
        // Throttle mutation checks
        if (mutationCheckTimeout) {
          clearTimeout(mutationCheckTimeout);
        }
        
        mutationCheckTimeout = setTimeout(function() {
          // If we detect many mutations, likely content has loaded
          // اگر تعداد زیادی تغییر تشخیص دهیم، احتمالاً محتوا بارگذاری شده
          if (mutationCount > 50) {  // Increased threshold from 10 to 50
            mutationCount = 0;
            console.log('GDate2PDate: Large DOM update detected');
            triggerConversionEvent();
          } else {
            mutationCount = 0;  // Reset if threshold not met
          }
        }, 1000);  // Check after 1 second of mutations
      });

      contentObserver.observe(document.body, {
        childList: true,
        subtree: true
      });

      // REMOVED aggressive 5-second interval for better performance

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
