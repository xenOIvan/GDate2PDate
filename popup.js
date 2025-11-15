/**
 * Popup Script - Controls extension UI and state
 * اسکریپت Popup - کنترل رابط کاربری و وضعیت افزونه
 */

(function() {
  'use strict';

  const toggleSwitch = document.getElementById('toggle-switch');
  const statusDot = document.getElementById('status-dot');
  const statusText = document.getElementById('status-text');

  /**
   * Update UI based on extension state
   * به‌روزرسانی رابط کاربری بر اساس وضعیت افزونه
   */
  function updateUI(enabled) {
    if (enabled) {
      toggleSwitch.classList.add('active');
      statusDot.classList.remove('disabled');
      statusText.textContent = 'وضعیت: فعال';
    } else {
      toggleSwitch.classList.remove('active');
      statusDot.classList.add('disabled');
      statusText.textContent = 'وضعیت: غیرفعال';
    }
  }

  /**
   * Load current extension state
   * بارگذاری وضعیت فعلی افزونه
   */
  function loadState() {
    chrome.storage.sync.get(['enabled'], function(result) {
      const enabled = result.enabled !== false; // Default to enabled
      updateUI(enabled);
      console.log('GDate2PDate Popup: Current state:', enabled ? 'enabled' : 'disabled');
    });
  }

  /**
   * Handle toggle switch change
   * مدیریت تغییر سوئیچ فعال/غیرفعال
   */
  function handleToggle() {
    const enabled = toggleSwitch.classList.contains('active');
    const newState = !enabled;
    
    console.log('GDate2PDate Popup: Toggle changed to:', newState ? 'enabled' : 'disabled');
    
    // Update storage
    // به‌روزرسانی ذخیره‌سازی
    chrome.storage.sync.set({ enabled: newState }, function() {
      if (chrome.runtime.lastError) {
        console.error('GDate2PDate Popup: Error saving state:', chrome.runtime.lastError);
        return;
      }
      
      console.log('GDate2PDate Popup: State saved successfully');
      updateUI(newState);
      
      // Send message to background script
      // ارسال پیام به اسکریپت پس‌زمینه
      chrome.runtime.sendMessage({
        action: 'toggle',
        enabled: newState,
        reloadTabs: true
      }, function(response) {
        if (chrome.runtime.lastError) {
          console.error('GDate2PDate Popup: Error sending message:', chrome.runtime.lastError);
          return;
        }
        
        if (response && response.success) {
          console.log('GDate2PDate Popup: Extension state updated and tabs reloading');
          
          // Show a brief confirmation (optional)
          // نمایش تأیید کوتاه (اختیاری)
          showConfirmation(newState);
        }
      });
    });
  }

  /**
   * Show brief confirmation message
   * نمایش پیام تأیید کوتاه
   */
  function showConfirmation(enabled) {
    const originalText = statusText.textContent;
    
    if (enabled) {
      statusText.textContent = 'تب در حال بارگذاری...';
    } else {
      statusText.textContent = 'تب در حال بارگذاری...';
    }
    
    // Reset after 2 seconds
    // بازنشانی پس از 2 ثانیه
    setTimeout(function() {
      updateUI(enabled);
    }, 2000);
  }

  /**
   * Initialize popup
   * راه‌اندازی popup
   */
  function initialize() {
    console.log('GDate2PDate Popup: Initializing...');
    
    // Load current state
    // بارگذاری وضعیت فعلی
    loadState();
    
    // Add event listener to toggle switch
    // افزودن شنونده رویداد به سوئیچ
    toggleSwitch.addEventListener('click', handleToggle);
    
    console.log('GDate2PDate Popup: Initialized successfully');
  }

  // Initialize when DOM is ready
  // راه‌اندازی زمانی که DOM آماده است
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }

  // Handle errors
  // مدیریت خطاها
  window.addEventListener('error', function(event) {
    console.error('GDate2PDate Popup: Error:', event.error);
  });

})();
