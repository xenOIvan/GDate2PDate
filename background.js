/**
 * Background Service Worker - Extension lifecycle management
 * سرویس ورکر پس‌زمینه - مدیریت چرخه حیات افزونه
 */

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
    console.log(`GDate2PDate: Icon updated to ${enabled ? 'enabled' : 'disabled'} state`);
    console.log(`تبدیل تاریخ: آیکون به حالت ${enabled ? 'فعال' : 'غیرفعال'} تغییر کرد`);
  }).catch((error) => {
    console.error('GDate2PDate: Error updating icon:', error);
  });
}

// Initialize extension on install
// راه‌اندازی اولیه افزونه هنگام نصب
chrome.runtime.onInstalled.addListener(function(details) {
  console.log('GDate2PDate: Extension installed/updated');
  console.log('تبدیل تاریخ: افزونه نصب/به‌روزرسانی شد');
  
  // Set default settings
  // تنظیم مقادیر پیش‌فرض
  chrome.storage.sync.get(['enabled'], function(result) {
    if (result.enabled === undefined) {
      chrome.storage.sync.set({ 
        enabled: true,
        installDate: new Date().toISOString()
      }, function() {
        console.log('GDate2PDate: Default settings initialized');
        console.log('تبدیل تاریخ: تنظیمات پیش‌فرض مقداردهی شد');
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
    console.log('GDate2PDate: First time installation');
    console.log('تبدیل تاریخ: نصب برای اولین بار');
    
    // You can open a welcome page here if needed
    // می‌توانید صفحه خوش‌آمد را اینجا باز کنید
    // chrome.tabs.create({ url: 'welcome.html' });
  }
});

// Handle messages from content scripts and popup
// مدیریت پیام‌ها از اسکریپت‌های محتوا و popup
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log('GDate2PDate: Received message:', request);
  
  if (request.action === 'toggle') {
    // Update enabled state
    // به‌روزرسانی وضعیت فعال/غیرفعال
    chrome.storage.sync.set({ enabled: request.enabled }, function() {
      console.log(`GDate2PDate: Extension ${request.enabled ? 'enabled' : 'disabled'}`);
      console.log(`تبدیل تاریخ: افزونه ${request.enabled ? 'فعال' : 'غیرفعال'} شد`);
      
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
          console.log('GDate2PDate: Could not reload tab:', error);
        });
      }
    }
  });
}

// Handle extension icon click (opens popup)
// مدیریت کلیک روی آیکون افزونه (باز کردن popup)
chrome.action.onClicked.addListener(function(tab) {
  console.log('GDate2PDate: Extension icon clicked');
  console.log('تبدیل تاریخ: کلیک روی آیکون افزونه');
  // Popup will open automatically due to manifest configuration
  // popup به صورت خودکار باز می‌شود (تنظیم شده در manifest)
});

console.log('GDate2PDate: Background service worker initialized');
console.log('تبدیل تاریخ: سرویس ورکر پس‌زمینه راه‌اندازی شد');

// Initialize icon on startup
// راه‌اندازی آیکون هنگام شروع
chrome.storage.sync.get(['enabled'], function(result) {
  const enabled = result.enabled !== false; // Default to enabled
  updateIcon(enabled);
  console.log(`GDate2PDate: Startup - Extension is ${enabled ? 'enabled' : 'disabled'}`);
  console.log(`تبدیل تاریخ: راه‌اندازی - افزونه ${enabled ? 'فعال' : 'غیرفعال'} است`);
});
