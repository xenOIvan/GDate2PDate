# GDate2PDate - Chrome Extension Development Guide

## Project Overview
A Chrome extension that automatically converts Gregorian (میلادی) dates to Jalali/Persian (شمسی) dates on any webpage while preserving the original format. The extension runs as a content script that monitors and transforms dates in real-time.

## Architecture

### Core Components
- **script.js**: Main content script with three key systems:
  1. **Date Conversion Engine**: `gregorianToJalali()` - Mathematical algorithm for Gregorian↔Jalali conversion
  2. **Format Detection System**: `detectDateFormat()` - Pattern matching for various date formats (ISO, US, European)
  3. **DOM Processing Pipeline**: `traverseDOM()` - Recursive tree walker that processes text nodes and element attributes

### Date Format Support
The extension handles multiple formats while preserving original separators and structure:
- ISO: `2024-12-31` → `1403-10-11`
- US: `12/31/2024` → `10/11/1403`
- European: `31.12.2024` → `11.10.1403`
- With time: `2024-12-31 14:30:45` → `1403-10-11 14:30:45`

Separator detection is automatic: `/`, `-`, or `.` are preserved from the original format.

## Chrome Extension Structure (To Be Implemented)

### Required Files
1. **manifest.json** (v3): Define extension metadata, permissions, and content script injection
   - Required permissions: `activeTab`, `scripting`
   - Content script: `script.js` (inject on all URLs: `<all_urls>`)
   - Match pattern: `*://*/*` for universal date conversion

2. **icons/**: Extension icons (16x16, 48x48, 128x128 PNG)

3. **popup.html** (optional): Toggle extension on/off, show conversion stats

### Manifest Structure
```json
{
  "manifest_version": 3,
  "name": "GDate2PDate - تبدیل تاریخ میلادی به شمسی",
  "version": "1.0.0",
  "content_scripts": [{
    "matches": ["<all_urls>"],
    "js": ["script.js"],
    "run_at": "document_idle"
  }]
}
```

## Development Workflow

### Testing Locally
1. Open Chrome → `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked" → Select project directory
4. Test on pages with various date formats (GitHub, Wikipedia, news sites)

### Debugging
- Check console logs: Extension logs prefixed with 🔄/✅/❌ emojis
- Monitor MutationObserver activity for dynamic content
- Test regex patterns in browser console: `detectDateFormat('2024-12-31')`

## Code Patterns & Conventions

### Bilingual Comments
All major functions use dual Persian/English comments:
```javascript
// تابع تبدیل تاریخ میلادی به شمسی
// Gregorian to Jalali conversion function
```
**Why**: Persian developers benefit from native language, while international contributors understand English.

### Validation Logic
Date validation boundaries (line 124-127):
- Years: 1900-2100 (prevents false positives on numbers)
- Months: 1-12
- Days: 1-31

Adjust range if historical/future date support is needed.

### DOM Safety
- **Skip tags**: `<script>` and `<style>` (line 208-211) to avoid breaking code/CSS
- **Mutation Observer**: Monitors `childList`, `subtree`, `characterData` for SPAs/dynamic sites
- **Text node processing**: Only modifies `Node.TEXT_NODE` and specific attributes

### Attribute Processing
Target attributes for date conversion (line 184):
```javascript
const dateAttributes = ['value', 'placeholder', 'title', 'data-date', 'datetime'];
```
Add custom data attributes if needed (e.g., `data-created`, `data-updated`).

## Extension Points & Customization

### Adding New Date Formats
Extend `patterns` array in `detectDateFormat()` (lines 60-71):
```javascript
{ regex: /YOUR_PATTERN/, format: 'YOUR_FORMAT', separator: null }
```
Example: Add `DD-MM-YYYY` European format with dash separator.

### Performance Optimization
For heavy pages with thousands of dates:
- Debounce MutationObserver callbacks (currently processes immediately)
- Add processed node tracking to avoid re-conversion
- Use `requestIdleCallback()` for non-urgent conversions

### i18n Month Names
Currently outputs numeric months (`1403-10-11`). To add Persian month names:
```javascript
const jalaliMonths = ['فروردین', 'اردیبهشت', ...];
// Format: `11 دی 1403`
```

## Common Issues & Solutions

### False Positives
Numbers like `2024-01-01` in non-date contexts may convert. Solutions:
- Add context detection (look for date-related keywords nearby)
- Implement whitelist/blacklist domains
- Add user configuration for sensitivity levels

### Time Zone Handling
Current implementation ignores time zones. For UTC/local time conversion:
- Parse with `new Date()` for time zone awareness
- Adjust Jalali calculation for regional calendars

### Dynamic Content Sites (SPAs)
MutationObserver handles React/Vue/Angular apps, but heavy frameworks may need:
- Delayed initialization: `setTimeout(convertAllDates, 1000)`
- Framework-specific hooks (React DevTools detection)

## File Organization Standards
- Keep `script.js` under 500 lines for maintainability
- Extract conversion algorithm to separate module if adding complex features
- Use ES6 modules for manifest v3 compatibility (`type="module"` in manifest)

## Next Steps for AI Agents
When asked to implement Chrome extension features:
1. Create `manifest.json` first (defines extension capabilities)
2. Add icons to `icons/` directory (use placeholder PNGs initially)
3. Implement popup UI if user settings are needed
4. Test on real-world Persian websites (Divar, Digikala, IRNA)
5. Handle edge cases: RTL text, mixed Persian/English dates, calendar widgets
