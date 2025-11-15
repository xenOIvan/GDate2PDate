# GDate2PDate - Chrome Extension Development Guide

## Rules
Do not create doc file and any other infomation outside what you asked for


## Project Overview
A Chrome extension that automatically converts Gregorian dates to Jalali/Persian dates on any webpage using a **unified standard format** (YYYY/MM/DD). The extension:
- Detects various input formats (ISO, US, European)
- Converts all dates to a consistent Jalali format: `1403/10/11`
- Runs as a content script that monitors and transforms dates in real-time

## Architecture

### Core Components
- **script.js**: Main content script with four key systems:
  1. **Date Conversion Engine**: `gregorianToJalali()` - Mathematical algorithm for Gregorian↔Jalali conversion
  2. **Format Detection System**: `detectDateFormat()` - Pattern matching with priority levels for various date formats (ISO, US, European)
  3. **Page Format Analyzer**: `detectPageDateFormat()` - Scans entire page to determine the most common date format used
  4. **DOM Processing Pipeline**: `traverseDOM()` - Recursive tree walker that processes text nodes and element attributes

### Key Design Decision: Unified Output Format
**All dates are converted to `YYYY/MM/DD` format**, regardless of input format. This ensures:
- Consistent visual experience across all websites
- No ambiguity (e.g., is `01/02/2024` Jan 2 or Feb 1?)
- Easier recognition of converted dates
- Simpler debugging and testing

### Date Format Support
The extension detects multiple input formats but **always outputs to unified YYYY/MM/DD**:
- ISO: `2024-12-31` → `1403/10/11`
- US: `12/31/2024` → `1403/10/11`
- European: `31.12.2024` → `1403/10/11`
- With time: `2024-12-31 14:30:45` → `1403/10/11 14:30:45`

**Format Detection Features**:
- Automatic input format recognition (ISO, US, European)
- Priority system for ambiguous dates (ISO has highest priority)
- Page-level format analysis to log most common format
- Time preservation when present in original date

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
- Check console logs: Extension logs prefixed with 🔄/✅/❌/📊/📅/🎯 emojis
- **Format detection logs**: `📊 Detected format: YYYY-MM-DD (count: 15)`
- **Conversion success**: `✅ All dates converted to standard Jalali format (YYYY/MM/DD)`
- Monitor MutationObserver activity for dynamic content
- Test functions in browser console:
  ```javascript
  detectDateFormat('2024-12-31')
  gregorianToJalali(2024, 12, 31)
  ```

## Code Patterns & Conventions

### Bilingual Comments
All major functions use dual Persian/English comments:
```javascript
// تابع تبدیل تاریخ میلادی به شمسی
// Gregorian to Jalali conversion function
```
**Why**: Persian developers benefit from native language, while international contributors understand English.

### Validation Logic
Date validation boundaries (line 172-175):
- Years: 1900-2100 (prevents false positives on numbers)
- Months: 1-12
- Days: 1-31

### Format Detection Logic
- **Priority system** (line 70-76): ISO format has priority 1, US format priority 2, European priority 3
- **Page-level analysis** (line 98-134): `detectPageDateFormat()` scans entire page text to determine most common format
- **Format confidence tracking**: Logs count of detected dates to help debug format detection issues

### DOM Safety
- **Skip tags**: `<script>` and `<style>` (line 268-271) to avoid breaking code/CSS
- **Mutation Observer**: Monitors `childList`, `subtree`, `characterData` for SPAs/dynamic sites
- **Text node processing**: Only modifies `Node.TEXT_NODE` and specific attributes
- **Global state tracking**: `detectedPageFormat` and `formatConfidence` variables track page-level format statistics

### Attribute Processing
Target attributes for date conversion (line 244):
```javascript
const dateAttributes = ['value', 'placeholder', 'title', 'data-date', 'datetime'];
```
Add custom data attributes if needed (e.g., `data-created`, `data-updated`).

**Note**: All attribute dates are also converted to unified `YYYY/MM/DD` format.

## Extension Points & Customization

### Adding New Date Formats
Extend `patterns` array in `detectDateFormat()` (lines 70-79):
```javascript
{ regex: /YOUR_PATTERN/, format: 'YOUR_FORMAT', separator: null, priority: 4 }
```
**Priority levels**: 1 = highest (ISO), 2 = medium (US), 3+ = lower (European, custom)

Example: Add `DD-MM-YYYY` European format with dash separator:
```javascript
{ regex: /(\d{1,2})-(\d{1,2})-(\d{4})/, format: 'DD-MM-YYYY', separator: '-', priority: 4 }
```

### Performance Optimization
For heavy pages with thousands of dates:
- Debounce MutationObserver callbacks (currently processes immediately)
- Add processed node tracking to avoid re-conversion
- Use `requestIdleCallback()` for non-urgent conversions

### i18n Month Names
Currently outputs numeric months with slash separator (`1403/10/11`). To add Persian month names, modify `convertDateToJalali()` around line 195:
```javascript
const jalaliMonths = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 
                      'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];
let result = `${jDay} ${jalaliMonths[jalali.month - 1]} ${jYear}`;
// Output: `11 دی 1403`
```
**Trade-off**: Text-based dates may not be universally recognized as dates by browsers/scripts.

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
