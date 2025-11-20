/**
 * Background Service Worker - Extension lifecycle management
 * سرویس ورکر پس‌زمینه - مدیریت چرخه حیات افزونه
 */

// Simple logging wrapper for background service worker
// حلقه‌بندی ساده لاگ‌گیری برای سرویس ورکر پس‌زمینه
const IS_DEV = false; // Set by build script
const log = {
  debug: IS_DEV ? console.log.bind(console) : () => {},
  info: IS_DEV ? console.info.bind(console) : () => {},
  warn: IS_DEV ? console.warn.bind(console) : () => {},
  error: console.error.bind(console) // Always log errors
};

/**
 * Update extension icon based on enabled/disabled state
 * به‌روزرسانی آیکون افزونه بر اساس وضعیت فعال/غیرفعال
 */
function updateIcon(enabled) {
  const iconSuffix = enabled ? '' : '-disabled';
  
  chrome.action.setIcon({
    path: {
      16: `icons/icon16${iconSuffix}.png`,
      48: `icons/icon48${iconSuffix}.png`,
      128: `icons/icon128${iconSuffix}.png`
    }
  }).then(() => {
    log.debug(`GDate2PDate: Icon updated to ${enabled ? 'enabled' : 'disabled'} state`);
    log.debug(`تبدیل تاریخ: آیکون به حالت ${enabled ? 'فعال' : 'غیرفعال'} تغییر کرد`);
  }).catch((error) => {
    log.error('GDate2PDate: Error updating icon:', error);
  });
}

// Initialize extension on install
// راه‌اندازی اولیه افزونه هنگام نصب
chrome.runtime.onInstalled.addListener(function(details) {
  log.debug('GDate2PDate: Extension installed/updated');
  log.debug('تبدیل تاریخ: افزونه نصب/به‌روزرسانی شد');
  
  // Set default settings
  // تنظیم مقادیر پیش‌فرض
  chrome.storage.sync.get(['enabled'], function(result) {
    if (result.enabled === undefined) {
      chrome.storage.sync.set({ 
        enabled: true,
        installDate: new Date().toISOString()
      }, function() {
        log.debug('GDate2PDate: Default settings initialized');
        log.debug('تبدیل تاریخ: تنظیمات پیش‌فرض مقداردهی شد');
        // Set icon to enabled state
        updateIcon(true);
      });
    } else {
      // Set icon based on current state
      updateIcon(result.enabled !== false);
    }
  });

  // Show welcome message on first install
  // نمایش پیام خوش‌آمد در اولین نصب
  if (details.reason === 'install') {
    log.debug('GDate2PDate: First time installation');
    log.debug('تبدیل تاریخ: نصب برای اولین بار');
    
    // You can open a welcome page here if needed
    // می‌توانید صفحه خوش‌آمد را اینجا باز کنید
    // chrome.tabs.create({ url: 'welcome.html' });
  }
});

// Handle messages from content scripts and popup
// مدیریت پیام‌ها از اسکریپت‌های محتوا و popup
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  log.debug('GDate2PDate: Received message:', request);
  
  if (request.action === 'toggle') {
    // Update enabled state
    // به‌روزرسانی وضعیت فعال/غیرفعال
    chrome.storage.sync.set({ enabled: request.enabled }, function() {
      log.debug(`GDate2PDate: Extension ${request.enabled ? 'enabled' : 'disabled'}`);
      log.debug(`تبدیل تاریخ: افزونه ${request.enabled ? 'فعال' : 'غیرفعال'} شد`);
      
      // Update icon to reflect new state
      // به‌روزرسانی آیکون برای نمایش وضعیت جدید
      updateIcon(request.enabled);
      
      // Reload only current active tab to apply changes
      // بارگذاری مجدد فقط تب فعال فعلی برای اعمال تغییرات
      if (request.reloadTabs !== false) {
        reloadCurrentTab();
      }
      
      sendResponse({ success: true, enabled: request.enabled });
    });
    
    return true; // Keep message channel open for async response
  }
  
  if (request.action === 'getStatus') {
    // Return current status
    // بازگشت وضعیت فعلی
    chrome.storage.sync.get(['enabled'], function(result) {
      sendResponse({ enabled: result.enabled !== false });
    });
    
    return true; // Keep message channel open for async response
  }
});

/**
 * Reload only the current active tab to apply extension state changes
 * بارگذاری مجدد فقط تب فعال فعلی برای اعمال تغییرات وضعیت افزونه
 */
function reloadCurrentTab() {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    if (tabs[0]) {
      const tab = tabs[0];
      // Skip chrome:// and edge:// URLs (can't reload these)
      // عبور از URLهای chrome:// و edge:// (قابل بارگذاری مجدد نیستند)
      if (tab.url && !tab.url.startsWith('chrome://') && !tab.url.startsWith('edge://')) {
        chrome.tabs.reload(tab.id).catch(function(error) {
          log.warn('GDate2PDate: Could not reload tab:', error);
        });
      }
    }
  });
}

// Handle extension icon click (opens popup)
// مدیریت کلیک روی آیکون افزونه (باز کردن popup)
chrome.action.onClicked.addListener(function(tab) {
  log.debug('GDate2PDate: Extension icon clicked');
  log.debug('تبدیل تاریخ: کلیک روی آیکون افزونه');
  // Popup will open automatically due to manifest configuration
  // popup به صورت خودکار باز می‌شود (تنظیم شده در manifest)
});

log.debug('GDate2PDate: Background service worker initialized');
log.debug('تبدیل تاریخ: سرویس ورکر پس‌زمینه راه‌اندازی شد');

// Initialize icon on startup
// راه‌اندازی آیکون هنگام شروع
chrome.storage.sync.get(['enabled'], function(result) {
  const enabled = result.enabled !== false; // Default to enabled
  updateIcon(enabled);
  log.debug(`GDate2PDate: Startup - Extension is ${enabled ? 'enabled' : 'disabled'}`);
  log.debug(`تبدیل تاریخ: راه‌اندازی - افزونه ${enabled ? 'فعال' : 'غیرفعال'} است`);
});
