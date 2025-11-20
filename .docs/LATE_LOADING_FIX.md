# Late-Loading Content Fix
## Azure Dashboard & Dynamic Content Support

### 🔍 Problem Identified

The extension was not working on Azure dashboards and other pages with late-loaded content because:

1. **`_dateConverted` Flag Issue**: Text nodes were marked as "processed" and never re-checked when content changed
2. **Missing CharacterData Handling**: MutationObserver only watched for new nodes, not text content changes in existing nodes
3. **No Re-conversion Trigger**: No mechanism for content.js to tell script.js to re-process the page

### ✅ Solutions Implemented

#### 1. **content.js Improvements**

Added comprehensive late-loading handlers:

- **Visibility Change Detection**: Re-converts when page becomes visible (useful for background tabs)
- **Popstate Events**: Handles SPA navigation (Azure portal is a SPA)
- **Hash Changes**: Monitors URL hash changes
- **Large DOM Updates**: Detects when many elements are added at once (dashboard rendering)
- **Periodic Checks**: Fallback timer checks every 5 seconds for complex scenarios
- **Custom Event System**: Can trigger re-conversion from content script

#### 2. **script.js Improvements**

Fixed core conversion logic:

- **Removed `_dateConverted` Flag**: Now uses smarter detection (checks if text already contains Persian dates)
- **Added CharacterData Handling**: MutationObserver now processes text content changes in existing nodes
- **Custom Event Listener**: Listens for `gdate2pdate-reconvert` events from content.js
- **Improved Detection Logic**: Allows re-processing when Gregorian dates are detected even if Persian dates exist

### 🎯 Key Changes

#### content.js
```javascript
// NEW: Late-loading handlers
function setupLateLoadingHandlers() {
  // Visibility changes
  document.addEventListener('visibilitychange', ...);
  
  // SPA navigation
  window.addEventListener('popstate', ...);
  window.addEventListener('hashchange', ...);
  
  // Large DOM updates
  const contentObserver = new MutationObserver(...);
  
  // Periodic fallback
  setInterval(triggerConversionEvent, 5000);
}

// NEW: Trigger custom event
function triggerConversionEvent() {
  const event = new CustomEvent('gdate2pdate-reconvert', {
    bubbles: true,
    detail: { timestamp: Date.now() }
  });
  document.dispatchEvent(event);
}
```

#### script.js
```javascript
// REMOVED: _dateConverted flag that prevented re-processing

// NEW: Smart detection instead
const hasPersianDate = /\d{4}\/\d{2}\/\d{2}/.test(originalText);
if (hasPersianDate && originalText.indexOf('/') > -1) {
    const hasGregorianPattern = /\d{4}[-]\d{1,2}[-]\d{1,2}|.../.test(originalText);
    if (!hasGregorianPattern) return; // Skip if already converted
}

// NEW: CharacterData handling in MutationObserver
if (mutation.type === 'characterData' && mutation.target) {
    processTextNode(mutation.target);
}

// NEW: Custom event listener
document.addEventListener('gdate2pdate-reconvert', function(event) {
    if (!isProcessing) {
        convertAllDates();
    }
});
```

### 🧪 Testing

Use the new test file: **test-late-loading.html**

This file simulates:
- ✅ Delayed widget loading (2-4 second delays)
- ✅ AJAX content updates
- ✅ Dynamic text changes in existing nodes
- ✅ Chart data loading
- ✅ Azure dashboard-like behavior

### 📊 How It Works Now

```
Page Load
    ↓
content.js injected
    ↓
script.js loaded → Initial conversion
    ↓
Late-loading handlers active
    ↓
[Widget loads via AJAX]
    ↓
MutationObserver detects new nodes → Converts dates
    ↓
OR
    ↓
Large DOM update detected → Triggers reconvert event
    ↓
OR
    ↓
Periodic check (every 5s) → Triggers reconvert event
    ↓
script.js receives event → Re-runs conversion
    ↓
✅ Dates converted!
```

### 🎓 What Changed vs Previous Version

| Feature | Before | After |
|---------|--------|-------|
| Initial page dates | ✅ Works | ✅ Works |
| Late-loaded content | ❌ Failed | ✅ Works |
| Text content updates | ❌ Failed | ✅ Works |
| Azure dashboards | ❌ Failed | ✅ Works |
| SPA navigation | ❌ Failed | ✅ Works |
| Background tab visibility | ❌ Failed | ✅ Works |
| Performance | Good | Good (throttled) |

### 🚀 Deployment

1. Save both `content.js` and `script.js`
2. Reload extension in Chrome
3. Test on Azure dashboard or use `test-late-loading.html`
4. Check console for conversion logs

### 📝 Console Messages

You should now see these messages:
```
✅ GDate2PDate: Conversion script loaded successfully
👀 MutationObserver started successfully
🎯 Output format: Always YYYY/MM/DD (Jalali)
👂 Listening for late-loading content events
🔄 GDate2PDate: Large DOM update detected
🔄 GDate2PDate: Re-conversion triggered by event
```

### 🐛 Debugging

If dates still don't convert on a specific page:

1. Open DevTools Console
2. Look for GDate2PDate messages
3. Check if MutationObserver is detecting changes
4. Manually trigger: `document.dispatchEvent(new CustomEvent('gdate2pdate-reconvert'))`

### ⚡ Performance Notes

- Throttling: 100ms delay on mutation batches
- Periodic checks: Every 5 seconds (can be adjusted)
- Smart detection: Avoids re-converting already Persian dates
- Mutation counting: Only triggers on 10+ mutations

---

**Version**: 1404.8.25 (feature/late-change-fix)
**Date**: 2024-11-16
**Status**: ✅ Fixed and Tested
