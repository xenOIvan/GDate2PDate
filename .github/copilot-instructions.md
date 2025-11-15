# GDate2PDate Chrome Extension - AI Agent Instructions

## Project Overview
This is a Chrome extension that automatically converts Gregorian (میلادی) dates to Jalali/Persian (شمسی) dates on any webpage. The core conversion logic exists in `script.js` - **never modify this file**. Your job is to create a professional Chrome extension wrapper around it.

## Core Architecture

### Files You Must Create
1. **`manifest.json`** (v3) - Extension configuration
2. **`content.js`** - Wrapper that loads script.js
3. **`background.js`** - Service worker for extension lifecycle
4. **`popup.html`** - Simple UI for enable/disable toggle
5. **`popup.js`** - Controls extension state
6. **`icons/`** - Extension icons (16x16, 48x48, 128x128)
7. **`README.md`** - User-facing documentation in English and Persian

### Critical Rules
- **NEVER edit `script.js`** - it contains the complete date conversion logic
- Use Manifest V3 (not V2) for modern Chrome compatibility
- The extension must work on ALL websites by default (`"matches": ["<all_urls>"]`)
- Support Persian (RTL) UI elements in popup

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

**Why?** `script.js` uses direct DOM manipulation and must run in the page context, not the isolated content script context.

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

**Important:** Only reload the **current active tab**, not all open tabs. This prevents disrupting the user's other work.

### 4. Popup UI (popup.html + popup.js)
- Bilingual (English/Persian) interface with RTL for Persian
- Toggle switch to enable/disable conversion
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
- Handle errors gracefully with try-catch
- Use `chrome.storage.sync` for settings persistence

### Testing Checklist
Before considering implementation complete, verify:
- [ ] Extension loads in `chrome://extensions/` with no errors
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
3. **Don't forget web_accessible_resources** - script.js won't load without it
4. **Don't use blocking APIs** - Use chrome.storage.sync (async)
5. **Don't forget Persian RTL support** - Add `dir="rtl"` for Persian text
6. **Don't skip error handling** - Wrap chrome API calls in try-catch
7. **Don't hardcode URLs** - Use `chrome.runtime.getURL()`
8. **Don't reload all tabs** - Only reload the current active tab when toggling

## Development Workflow

### Building the Extension
1. Create all required files (manifest, content, background, popup)
2. Generate icons (use placeholder if needed, but document it)
3. Test in Chrome Developer Mode:
   - Open `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select project folder

### Debugging
- Check `chrome://extensions/` for errors
- Use DevTools console for page-level issues
- Use Extension's background page console for service worker logs
- Test on multiple websites with different date formats
## Icon Requirements
Create 3 PNG icons with Persian calendar theme:
- **16x16** - Toolbar icon
- **48x48** - Extension management
- **128x128** - Chrome Web Store

**Design specifications:**
- Purple gradient background (#667eea → #764ba2)
- White calendar card with rounded corners
- Blue header section on calendar
- Grid of dots representing calendar days
- Professional and clean appearance
Suggested design: Persian numerals (۱۴۰۳) with calendar/date iconography

## Documentation Standards

### README.md Structure
1. **Title** - Bilingual (English + Persian)
2. **Description** - What it does, why it's useful
3. **Features** - Key capabilities (auto-conversion, format detection, etc.)
4. **Installation** - From Chrome Web Store or Developer Mode
5. **Usage** - How to enable/disable, expected behavior
6. **Technical Details** - Brief architecture overview
7. **Privacy** - No data collection, all processing local
8. **License** - Choose appropriate license (MIT suggested)

### Version Format
Use semantic versioning: `MAJOR.MINOR.PATCH`
- Start at `1.0.0` for initial release
- Bump PATCH for bug fixes
- Bump MINOR for new features
- Bump MAJOR for breaking changes

## External Dependencies
**NONE** - This extension is 100% vanilla JavaScript, no npm packages needed. Keep it simple.

## Performance Considerations
- The MutationObserver in `script.js` watches for DOM changes - this is expected
- Extension adds minimal overhead (~5-10ms on page load)
- No network requests, all processing is client-side

## Privacy & Security
- **No data collection** - Extension never sends data anywhere
- **No permissions abuse** - Only uses storage for settings
- **No tracking** - Fully offline operation
- Document this clearly in README for user trust

## Quick Start for AI Agents
When asked to implement this extension:
## Success Criteria
A completed implementation should:
✅ Load without errors in Chrome
✅ Convert dates automatically on all websites
✅ Provide working enable/disable toggle
✅ Only reload current tab (not all tabs) when toggling
✅ Persist user preferences across sessions
✅ Include all required files (manifest, content, background, popup, icons)
✅ Have professional gradient-themed icons (16, 48, 128px)
✅ Have beautiful bilingual UI with RTL support
✅ Have clear bilingual documentation
✅ Be ready for Chrome Web Store submission

## Key Behavioral Requirements

**Tab Reload Behavior:**
- When user toggles extension on/off, ONLY reload the current active tab
- Do NOT reload all open tabs (this disrupts user's workflow)
- Use `chrome.tabs.query({ active: true, currentWindow: true })`
- Skip chrome:// and edge:// URLs that cannot be reloaded

**User Experience:**
- Extension enabled by default on first install
- Clear visual feedback in popup (green for enabled, red for disabled)
- Status messages should be bilingual
- Settings persist using chrome.storage.sync
- No network requests - all processing is local
## Success Criteria
A completed implementation should:
✅ Load without errors in Chrome
✅ Convert dates automatically on all websites
✅ Provide working enable/disable toggle
✅ Persist user preferences
✅ Include all required files
✅ Have clear bilingual documentation
✅ Be ready for Chrome Web Store submission (with real icons)
