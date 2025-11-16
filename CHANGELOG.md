# Changelog

All notable changes to the CSAE Toolkit project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [4.0.0] - 2025-11-16

### 🚀 Enterprise Edition - Major Feature Release

This is a massive enterprise-level upgrade introducing advanced workflow features, professional UX improvements, and comprehensive security hardening.

### ✨ NEW Enterprise Features

#### 🎨 Theme System
- **Light/Dark/Auto Theme Toggle** - Choose between dark mode, light mode, or auto (system preference)
- **Persistent Theme Selection** - Theme preference saved to Chrome storage
- **CSS Variables System** - Dynamic theme switching without page reload
- **System Theme Detection** - Auto mode follows OS dark/light preference

#### ↩️ Undo/Redo System
- **Full History Tracking** - Track all element manipulations (delete, hide, duplicate, CSS changes, text edits)
- **Keyboard Shortcuts** - Ctrl+Z to undo, Ctrl+Shift+Z to redo
- **Configurable History** - Up to 50 undo steps (configurable in settings)
- **Visual History Indicator** - Shows current position in undo/redo stack
- **Action Descriptions** - Each action labeled with what was changed

#### ⭐ Favorites & Tool History
- **Favorite Tools** - Star your most-used tools for quick access
- **Recent Tools Tracking** - Automatically tracks last 10 tools used
- **Usage Statistics** - See which tools you use most
- **Persistent Storage** - Favorites and history saved to Chrome storage

#### 🔍 Tool Search (Ctrl+K)
- **Instant Search** - Search all 22 tools by name, category, or keyboard shortcut
- **Keyboard Navigation** - Arrow keys to navigate, Enter to select
- **Visual Categorization** - Tools color-coded by category
- **Quick Favorites** - Star/unstar tools directly from search
- **Search Highlighting** - Matched text highlighted in results

#### 🎯 Floating Quick Access Button
- **Draggable Button** - Position anywhere on screen and save preference
- **Recent Tools Menu** - Quick access to 5 most recent tools
- **Favorites Menu** - Instant access to starred tools
- **Persistent Position** - Remembers position across sessions
- **Always Available** - Access tools without opening main panel

#### 🎓 Onboarding Flow
- **5-Step Interactive Guide** - Welcoming first-time users
- **Feature Overview** - Introduction to 22 tools across 4 categories
- **Keyboard Shortcuts Tutorial** - Learn all 6 shortcuts
- **v4.0 Feature Highlights** - Showcase of new enterprise features
- **Pro Tips** - Best practices for productivity
- **Skip Option** - Can skip or navigate freely
- **One-Time Display** - Only shown on first launch

#### ⚙️ Settings & Preferences
- **Comprehensive Settings Panel** - Customize all aspects of toolkit
- **Theme Configuration** - Dark/light/auto theme selection
- **Grid Size Adjustment** - Customize grid overlay spacing (10px-100px)
- **Undo Steps Limit** - Configure history depth (10-100 steps)
- **Keyboard Shortcuts Toggle** - Enable/disable shortcuts
- **Batch Mode Toggle** - Enable multi-select operations
- **Floating Button Toggle** - Show/hide quick access button
- **Recent Tools Limit** - How many recent tools to track (5-20)
- **Feature Flags** - Enable experimental features, beta tools, advanced mode
- **Export Settings** - Backup settings as JSON file
- **Import Settings** - Restore settings from JSON file
- **Reset to Defaults** - One-click reset all settings
- **Audit Log Viewer** - View security event history
- **Settings Keyboard Shortcut** - Ctrl+, to open settings

#### 🛡️ Security Hardening
- **Security Utilities Module** (`src/utils/security.js`)
  - `escapeHTML()` - XSS prevention for all user input
  - `sanitizeCSS()` - CSS value sanitization blocking dangerous patterns
  - `sanitizeURL()` - URL validation allowing only http/https/chrome-extension
  - `sanitizeSelector()` - Selector string sanitization
  - `rateLimit()` - Rate limiting for actions (default: 10 per second)
  - `securityLog()` - Comprehensive audit logging
  - `safeAssign()` - Prototype pollution prevention
  - `detectSuspiciousPatterns()` - Pattern detection for XSS attempts
- **Content Security Policy** - Strict CSP enforcement
- **Input Validation** - All user inputs validated before processing
- **Error Logging** - Security events logged to Chrome storage
- **Prototype Protection** - Guards against `__proto__` pollution

#### ⚡ Performance Optimizations
- **Performance Utilities Module** (`src/utils/performance.js`)
  - `debounce()` - Debounce function execution (default: 300ms)
  - `throttle()` - Throttle function execution (default: 300ms)
  - `memoize()` - LRU cache memoization (default: 100 items)
  - `rafThrottle()` - RequestAnimationFrame throttling for smooth animations
  - `DOMBatcher` - Batch DOM reads/writes to avoid layout thrashing
  - `MemoryMonitor` - Track memory usage with 50MB threshold warnings
  - `VirtualScroller` - Virtual scrolling for large lists
  - `PerformanceTracker` - Mark and measure performance metrics
  - `CacheWithExpiry` - TTL-based caching (default: 5 minutes)
  - `WorkerPool` - Web Worker pool for heavy computations
  - `requestIdleTask()` - Idle callback wrapper with fallback
  - `createLazyObserver()` - Intersection Observer for lazy loading
- **Lazy Loading** - Components loaded on demand
- **Event Delegation** - Reduced event listener count
- **Memory Management** - Proper cleanup and garbage collection

#### 🧩 React Error Boundaries
- **ErrorBoundary Component** - Catches React errors in component tree
- **Fallback UI** - User-friendly error display with stack traces
- **Error Logging** - Errors saved to Chrome storage for debugging
- **Try Again/Reload** - Recovery options for users
- **Error Statistics** - Tracks error frequency
- **Component Stack Trace** - Detailed debugging information

### 🔧 Improved

#### User Experience
- **Header Redesign** - Compact header with quick access to search and settings
- **Visual Undo/Redo Indicator** - Shows available undo/redo actions
- **Better Navigation** - Clearer tool categorization
- **Responsive Modals** - All modals support keyboard shortcuts and ESC to close
- **Improved Tooltips** - More descriptive hover text
- **Visual Feedback** - Loading states and success confirmations

#### Code Quality
- **Modular Architecture** - Utilities separated into dedicated modules
- **Type Safety** - Better prop validation and error handling
- **Code Organization** - Clear separation of concerns
- **Component Reusability** - Shared components for common patterns
- **Performance Profiling** - Built-in performance tracking

### 🐛 Fixed

- **Theme Persistence** - Theme now persists across extension reloads
- **Memory Leaks** - Proper cleanup of all event listeners
- **State Management** - Better React state handling
- **Modal Z-Index** - Proper layering of overlays
- **Keyboard Event Conflicts** - Better event handling and propagation
- **Extension Reload** - Handles hot reload without breaking state

### 📚 Documentation

- **Updated README.md** - v4.0 Enterprise Edition features documented
- **Architecture Documentation** - Component and utility module documentation
- **API Documentation** - JSDoc comments for all major functions
- **Security Guidelines** - Best practices for secure usage
- **Performance Tips** - Optimization recommendations

### 🔒 Security Enhancements

- **Comprehensive Input Sanitization** - All inputs validated and sanitized
- **Rate Limiting** - Prevents abuse of tool actions
- **Audit Logging** - Security events tracked and logged
- **XSS Protection** - Multiple layers of XSS prevention
- **CSRF Protection** - Cross-site request forgery protection
- **Content Security Policy** - Strict CSP headers
- **Prototype Pollution Prevention** - Safe object operations

### 🏗️ Technical

- **New Components:**
  - `ErrorBoundary.jsx` - React error boundary
  - `Onboarding.jsx` - First-time user guide
  - `ToolSearch.jsx` - Tool search modal
  - `FloatingButton.jsx` - Quick access button
  - `Settings.jsx` - Settings panel

- **New Utility Modules:**
  - `src/utils/security.js` - Security functions
  - `src/utils/performance.js` - Performance utilities
  - `src/utils/theme.jsx` - Theme management
  - `src/utils/undoRedo.js` - Undo/redo system
  - `src/utils/toolHistory.js` - Tool history and favorites

- **Updated Files:**
  - `App.jsx` - v4.0 integration with all new features
  - `main.jsx` - ErrorBoundary wrapper
  - `manifest.json` - v4.0.0 with updated description
  - `package.json` - v4.0.0 version bump

### 📊 Metrics

- **Total Components:** 10 React components (up from 4)
- **Utility Modules:** 5 specialized modules (new)
- **Total Tools:** 22 professional tools
- **Keyboard Shortcuts:** 8 shortcuts (up from 6)
  - Added: Ctrl+K (tool search), Ctrl+, (settings)
- **Code Organization:** 15+ files with clear separation
- **Build Size:** ~3.5MB (optimized)
- **TypeScript Ready:** JSDoc annotations throughout

### 🎯 New Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+K` | Open tool search |
| `Ctrl+,` | Open settings |
| `Ctrl+Z` | Undo last action |
| `Ctrl+Shift+Z` | Redo action |
| `ESC` | Close any modal/overlay |

---

## [3.0.0] - 2025-01-16

### 🎉 Major Release - Feature Parity & Professional Polish

This is a major version upgrade that achieves complete feature parity with SuperDev Pro and adds comprehensive professional developer and designer tools.

### ✨ Added

#### Inspector Tools (NEW)
- **Live CSS Editor** - Edit CSS properties in real-time with visual editor interface
- **Color Palette Viewer** - View, manage, and copy all saved colors from the color picker
- **Performance Metrics Viewer** - Display detailed page performance data (DNS, TCP, paint times, resources)
- **Element Export** - Enhanced export of HTML and CSS for any element

#### Page Editor Tools (NEW)
- **Element Highlighter** - Permanently highlight elements with customizable outlines
- **Live Text Editor** - Edit text content directly on the page with visual feedback

#### Layout & Design Tools (NEW)
- **Element Outliner** - Outline all elements on the page to visualize DOM structure
- **Responsive Tester** - Test page at different screen sizes with device presets (iPhone, iPad, Desktop)
- **Real Screenshot Functionality** - Actual screenshot capture and download (replaced placeholder)

#### System Features (NEW)
- **Comprehensive Keyboard Shortcuts** - 6 shortcuts for quick tool access
  - `Ctrl+Shift+C` - CSS Selector Grabber
  - `Ctrl+Shift+P` - Color Picker
  - `Ctrl+Shift+E` - Live CSS Editor
  - `Ctrl+Shift+G` - Grid Overlay
  - `Ctrl+Shift+O` - Element Outliner
  - `Ctrl+Shift+S` - Screenshot
- **Error Handling System** - Try-catch blocks with user-friendly error notifications
- **XSS Protection** - Sanitized HTML output using escapeHTML() utility
- **Accessibility Improvements** - ARIA labels, keyboard navigation, focus indicators

### 🔧 Improved

#### User Interface
- **Categorized Navigation** - Tools organized into 4 clear categories
- **Tool Count Display** - Shows tool count for each category (Inspector: 8, Editor: 7, Layout: 4, Storage: 3)
- **Keyboard Shortcuts Panel** - Visible shortcuts reference on main menu
- **Better Error Messaging** - User-facing alerts instead of console-only errors
- **Improved Button Styling** - Consistent hover states, tooltips, and ARIA labels

#### Functionality
- **Enhanced Color Picker** - Now saves colors to storage and palette
- **Better Screenshot Tool** - Real implementation using chrome.tabs.captureVisibleTab()
- **Improved State Management** - Centralized csaeToolkit object prevents memory leaks
- **Better Event Cleanup** - Proper listener removal on ESC press
- **Optimized Content Script** - From 912 lines to 1360 lines with better organization

### 🐛 Fixed

- **Duplicate Measurement Tool** - Removed duplicate entry in Layout section
- **Event Listener Leaks** - Fixed duplicate listeners in content.js
- **Modal Re-injection** - Prevented multiple modal injections on script reload
- **Empty Tabs Array** - Added proper error handling when no active tab exists
- **Clipboard Fallbacks** - Better fallback mechanisms for clipboard operations
- **Notification Overlap** - Proper timeout clearing prevents notification stacking

### 📚 Documentation

- **Complete README.md** - Comprehensive documentation with:
  - Feature list (22 tools documented)
  - Installation guide
  - Usage instructions for each tool
  - Keyboard shortcuts table
  - Troubleshooting guide
  - Development guide
  - Project structure
- **CHANGELOG.md** - This file, tracking all versions
- **Enhanced UserGuide.jsx** - Updated with all v3.0 features and keyboard shortcuts

### 🔒 Security

- **XSS Protection** - All user-controlled content is sanitized before rendering
- **Input Validation** - CSS properties and selectors validated before use
- **Safe HTML Rendering** - Using textContent instead of innerHTML where possible
- **Error Boundaries** - Try-catch blocks prevent crashes from propagating

### 🏗️ Technical

- **Updated Dependencies** - All packages up-to-date
- **Manifest V3 Compliance** - Full compliance with modern Chrome Extension standards
- **New Permission** - Added `browsingData` for cache/IndexedDB clearing
- **Better Code Organization** - Modular functions with clear responsibilities
- **Performance Optimizations** - Reduced unnecessary re-renders and computations

### 📊 Metrics

- **Total Tools:** 22 professional tools (up from 12)
- **Code Size:** content.js: 1360 lines (up from 569)
- **Components:** 4 React components (added IndexedDBManager.jsx)
- **Keyboard Shortcuts:** 6 shortcuts (new)
- **Build Size:** ~3.1MB (optimized from 5.5MB)

---

## [1.2.6] - 2024-12-XX

### Added
- CSAE Config Viewer integration
- DevTools panel for storage inspection
- Basic storage manager functionality

### Fixed
- Storage panel loading issues
- DevTools integration bugs

---

## [1.2.0] - 2024-11-XX

### Added
- IndexedDB Manager component
- Cookie management capabilities
- Enhanced storage clearing options

### Improved
- Storage Manager UI with better organization
- Error handling in storage operations

---

## [1.1.0] - 2024-10-XX

### Added
- Color Picker tool using EyeDropper API
- Grid Overlay feature
- Image Extractor functionality

### Improved
- CSS Selector Grabber performance
- UI responsiveness

---

## [1.0.0] - 2024-09-XX

### 🎉 Initial Release

#### Added
- CSS Selector Grabber with hover functionality
- Basic Storage Manager (LocalStorage, SessionStorage)
- Cookie viewer
- CSAE Config Viewer
- User Guide documentation
- React + Vite + TailwindCSS stack
- Chrome Extension Manifest V3 support

#### Features
- Hover over elements to see CSS selectors
- Click to copy selectors to clipboard
- Alt+Click to pin hover boxes
- ESC to exit tools
- Side panel interface
- DevTools panel integration
- Dark theme UI

---

## Version Comparison

| Version | Tools | Features | Code Size | Documentation |
|---------|-------|----------|-----------|---------------|
| 3.0.0 | 22 | Complete | 1360 lines | Comprehensive |
| 1.2.6 | 12 | Partial | 569 lines | Basic |
| 1.2.0 | 10 | Partial | ~500 lines | Minimal |
| 1.1.0 | 8 | Basic | ~400 lines | Minimal |
| 1.0.0 | 5 | Basic | ~300 lines | Minimal |

---

## Upgrade Notes

### Upgrading from 1.x to 3.0

#### Breaking Changes
- None - fully backward compatible

#### New Permissions Required
- `browsingData` - For cache and IndexedDB clearing

#### Migration Steps
1. Backup your color palette (if you want to keep saved colors)
2. Uninstall old version
3. Install v3.0.0
4. Reload extension
5. Color palette will be preserved in chrome.storage

#### What's New for Users
- 10 new professional tools
- 6 keyboard shortcuts for productivity
- Better UI with categorized navigation
- Comprehensive documentation
- Real screenshot functionality
- Performance metrics viewer
- Live CSS editor
- Element outliner
- Responsive tester

---

## Roadmap

### Future Enhancements (v3.1+)
- [ ] Custom grid size configuration
- [ ] Export/Import settings
- [ ] Undo/Redo for element manipulations
- [ ] Batch operations (select multiple elements)
- [ ] Element hierarchy tree viewer
- [ ] CSS/JS syntax highlighting in exports
- [ ] Before/After comparison mode
- [ ] Auto-save preferences
- [ ] Multi-language support
- [ ] Custom color palette export/import

### Under Consideration
- [ ] Integration with popular design tools
- [ ] Network request viewer
- [ ] Console access/viewer
- [ ] Custom keyboard shortcuts configuration
- [ ] Light mode toggle
- [ ] Advanced performance profiling
- [ ] Accessibility audit tool
- [ ] SEO audit tool

---

## Contributing

See [README.md](README.md) for contribution guidelines.

---

## License

MIT License - See [LICENSE](LICENSE) or README.md for full text.

---

**Maintainer:** Nik Kale (nikkal) | Cisco Systems Inc.
**Repository:** https://github.com/nik-kale/csae-toolkit
**Issues:** https://github.com/nik-kale/csae-toolkit/issues
