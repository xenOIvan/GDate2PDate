# GDate2PDate Chrome Extension - AI Agent Instructions

## Project Overview
Chrome extension that automatically converts Gregorian dates to Jalali/Persian dates on any webpage. Core conversion logic in `script.js` - **never modify this file**.

## Core Architecture

### Required Files
1. `manifest.json` (v3) - Extension configuration
2. `content.js` - Loads script.js into page context
3. `background.js` - Service worker
4. `popup.html` - Bilingual UI with toggle
5. `popup.js` - UI controller
6. `icons/` - 16x16, 48x48, 128x128 PNG icons
7. `README.md` - Bilingual documentation

### Critical Rules
- **NEVER edit `script.js`**
- Use Manifest V3 only
- Work on ALL websites: `"matches": ["<all_urls>"]`
- Support Persian RTL in popup

## Implementation Patterns

### 1. Manifest Structure (manifest.json)
```json
{
  "manifest_version": 3,
  "name": "GDate2PDate - Gregorian to Jalali Date Converter",
  "version": "1.0.0",
  "description": "تبدیل خودکار تاریخ میلادی به شمسی | Automatic Gregorian to Jalali date conversion",
  "permissions": ["storage", "activeTab"],
  "host_permissions": ["<all_urls>"],
  "content_scripts": [{
    "matches": ["<all_urls>"],
    "js": ["content.js"],
    "run_at": "document_end"
  }],
  "background": {
    "service_worker": "background.js"
  },
  "action": {
    "default_popup": "popup.html",
    "default_icon": { ... }
  },
  "icons": { ... }
}
```

### 2. Content Script Pattern (content.js)
```javascript
// Load and execute script.js content
chrome.storage.sync.get(['enabled'], (result) => {
  if (result.enabled !== false) { // Enabled by default
    // Inject script.js as <script> tag to run in page context
    const script = document.createElement('script');
    script.src = chrome.runtime.getURL('script.js');
    (document.head || document.documentElement).appendChild(script);
  }
});
```

### 3. Background Service Worker (background.js)
```javascript
// Initialize default settings
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ enabled: true });
});

// Handle enable/disable from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'toggle') {
    chrome.storage.sync.set({ enabled: request.enabled });
    // Reload only current active tab to apply changes
    reloadCurrentTab();
  }
  return true; // Keep message channel open for async response
});

// Reload current tab only (not all tabs)
function reloadCurrentTab() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0] && !tabs[0].url.startsWith('chrome://')) {
      chrome.tabs.reload(tabs[0].id);
    }
  });
}
```

```

### 4. Popup UI (popup.html + popup.js)rsion
- Show current status with visual indicator
- Modern gradient design (purple theme: #667eea → #764ba2)
- Width: 320px, responsive and clean
- Clear feedback messages when toggling

### 5. Web Accessible Resources
Add to manifest.json:
```json
"web_accessible_resources": [{
  "resources": ["script.js"],
  "matches": ["<all_urls>"]
}]
```

## Conventions & Standards

### File Organization
```
GDate2PDate/
├── manifest.json          # Extension manifest (V3)
├── content.js            # Content script loader
├── background.js         # Service worker
├── popup.html            # Extension popup UI
├── popup.js              # Popup logic
├── script.js             # ⚠️ CORE LOGIC - DO NOT MODIFY
├── icons/
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md            # Bilingual documentation
```

### Code Style
- Use modern ES6+ JavaScript (async/await, arrow functions)
- Add bilingual comments (English + Persian)
- Use `chrome.*` API (not deprecated `browser.*`)
### Code Style
- ES6+ JavaScript (async/await, arrow functions)
- Bilingual comments (English + Persian)
- `chrome.*` API only
- Try-catch error handling
- `chrome.storage.sync` for settings no errors
- [ ] Dates convert automatically on page load
- [ ] Toggle in popup works (enable/disable)
- [ ] Settings persist across browser restarts
- [ ] Works on different websites (news sites, GitHub, etc.)
- [ ] Dynamic content (AJAX-loaded dates) converts properly
- [ ] No console errors in any page
- [ ] Only current tab reloads when toggling (not all tabs)
- [ ] Icons display correctly in toolbar and extension page
- [ ] Popup UI is bilingual with proper RTL for Persian

## Common Pitfalls to Avoid

1. **Don't modify script.js logic** - It's complete and tested
2. **Don't use Manifest V2** - Chrome deprecated it
## Common Pitfalls

1. Never modify script.js
2. Use Manifest V3 only
3. Add web_accessible_resources for script.js
4. Use async APIs (chrome.storage.sync)
5. Add `dir="rtl"` for Persian text
6. Wrap chrome API calls in try-catch
7. Use `chrome.runtime.getURL()` for paths
8. Reload current tab only (not all tabs)
1. Create all required files (manifest, content, background, popup)
## Development Workflow

### Installation
1. Open `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select project folder

### Debugging
- Check `chrome://extensions/` for errors
- DevTools console for page issues
- Background page console for service worker
- Test on multiple websites
- **128x128** - Chrome Web Store
## Icon Requirements
3 PNG icons (16x16, 48x48, 128x128):
- Purple gradient background (#667eea → #764ba2)
- White calendar card with rounded corners
- Blue header section
- Grid of dots for calendar days
1. **Title** - Bilingual (English + Persian)
2. **Description** - What it does, why it's useful
3. **Features** - Key capabilities (auto-conversion, format detection, etc.)
4. **Installation** - From Chrome Web Store or Developer Mode
5. **Usage** - How to enable/disable, expected behavior
6. **Technical Details** - Brief architecture overview
7. **Privacy** - No data collection, all processing local
8. **License** - Choose appropriate license (MIT suggested)
## Documentation

### README.md
- Bilingual title (English + Persian)
- Features and capabilities
- Installation instructions
- Usage guide
- Privacy policy (no data collection)
- License (MIT)

### Versioning
Semantic versioning: `MAJOR.MINOR.PATCH` (start at 1.0.0)ion never sends data anywhere
- **No permissions abuse** - Only uses storage for settings
- **No tracking** - Fully offline operation
- Document this clearly in README for user trust

## Quick Start for AI Agents
When asked to implement this extension:
## Success Criteria
✅ Load without errors
✅ Convert dates automatically
✅ Working enable/disable toggle
✅ Reload current tab only (not all tabs)
✅ Persist settings
✅ All required files included
✅ Professional icons (16, 48, 128px)
✅ Bilingual UI with RTL
✅ Complete documentation

## Key Behaviors

**Tab Reload:** Only reload current active tab when toggling (use `chrome.tabs.query({ active: true, currentWindow: true })`)

**User Experience:**
- Enabled by default
- Visual feedback (green/red status)
- Bilingual messages
- Settings persist via chrome.storage.sync
- 100% local processing
## Success Criteria
A completed implementation should:
✅ Load without errors in Chrome
✅ Convert dates automatically on all websites
✅ Provide working enable/disable toggle
✅ Persist user preferences
✅ Include all required files
✅ Have clear bilingual documentation
✅ Be ready for Chrome Web Store submission (with real icons)
