# Changelog

All notable changes to the CSAE Toolkit will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [4.2.0] - 2025-01-16

### 🎉 Feature-Packed Release - Complete v4 Vision

This release implements ALL remaining improvements from the roadmap, delivering a comprehensive suite of professional features for CSAE campaign development.

### ✨ Added

#### Selector Format Conversion
- **CSS to XPath Converter** - Generate XPath selectors from CSS selectors
- **CSS to JSPath Converter** - Generate document.querySelector() format
- **Format Selector Dropdown** - Choose CSS/XPath/JSPath in real-time
- **Format Persistence** - Remembers your preferred selector format
- **Format-Specific Copy** - Copies selector in your chosen format
- **Format Indicator** - Shows current format in notifications

#### Performance Monitoring Dashboard
- **Storage Quota Display** - Real-time quota usage with visual progress bar
- **Storage Metrics** - Copy history count, settings, total items, data size
- **Memory Usage Stats** - JS heap monitoring (when available)
- **Visual Warnings** - Color-coded alerts (green/yellow/red) for quota levels
- **Optimize Storage** - Remove duplicate entries automatically
- **Refresh Metrics** - Manual refresh button for latest stats
- **Optimization Tips** - Built-in best practices guide

#### Backup & Restore System
- **Full Data Export** - Backup all extension data to JSON
- **Date-Stamped Backups** - Automatic filename with timestamp
- **Import from JSON** - Restore from previous backups
- **Storage Quota Indicator** - See quota usage before backup
- **Warning Levels** - Visual alerts when approaching limits

#### Storage Diff Tool
- **Snapshot Comparison** - Compare two storage states
- **Change Detection** - Identify added, removed, and modified items
- **Detailed Diff View** - See old vs new values for modified items
- **Summary Stats** - Count of changes by type
- **Export Diff** - Save comparison results to JSON
- **Timestamp Tracking** - Know when snapshots were created

#### First-Time User Onboarding
- **5-Step Tutorial** - Interactive walkthrough for new users
- **What's New Highlights** - Feature showcase with visual indicators
- **Quick Start Guide** - Essential actions for getting started
- **Keyboard Shortcuts Reference** - Complete shortcuts list
- **Backup Recommendations** - Best practices before major changes
- **Progress Indicator** - Visual progress through onboarding steps
- **Skip & Navigate** - Full control over tutorial flow

#### Utility Enhancements
- **Selector Optimizer** - Simplifies selectors by removing redundant parts
- **Selector Validator** - Checks uniqueness of generated selectors
- **Alternative Selectors** - Generates multiple selector options
- **Reliability Scoring** - Rates selector quality (0-100)
- **Debounce Utility** - Performance optimization for frequent operations
- **Throttle Utility** - Rate limiting for expensive operations
- **Memoization Helper** - Cache expensive computations
- **Validation Schemas** - Zod-like validation for settings and data

### 🔒 Security Enhancements

- **Enhanced CSP** - Stricter Content Security Policy
  - `object-src 'none'` - No plugin objects allowed
  - `base-uri 'self'` - Prevent base tag injection
  - `form-action 'self'` - Restrict form submissions
  - `frame-ancestors 'none'` - Prevent clickjacking
  - `upgrade-insecure-requests` - Force HTTPS
- **Content Script Hardening** - `all_frames: false` to prevent iframe injection
- **XSS Protection** - All user input sanitized in selector formats
- **Format Validation** - Strict format checking for conversions

### 🎨 UI/UX Improvements

- **NEW Badges** - Visual indicators on new features
- **Performance Monitor** - Dedicated dashboard with real-time stats
- **Format Selector UI** - Inline dropdown in hover box
- **Progress Bars** - Visual quota usage indicators
- **Color-Coded Warnings** - Red/yellow/green status indicators
- **Command Palette Updates** - New commands for all features
- **Responsive Layouts** - Better spacing and organization
- **Optimization Tips** - Contextual help throughout UI

### 🏗️ Technical Improvements

- **Modular Utilities** - Separated concerns into dedicated files:
  - `selectorUtils.js` - Selector conversion and optimization
  - `performance.js` - Performance monitoring and optimization
  - `validation.js` - Data validation schemas
- **Component Organization** - Clean component structure:
  - `BackupRestore.jsx` - Backup/restore functionality
  - `StorageDiff.jsx` - Storage comparison tool
  - `Onboarding.jsx` - First-time user experience
  - `PerformanceMonitor.jsx` - Performance dashboard
- **Performance Optimizations** - Debounce, throttle, memoization throughout
- **Code Quality** - Consistent patterns and best practices
- **Error Handling** - Comprehensive error boundaries and validation

### 📝 Documentation

- Updated onboarding with v4.2 features
- Added selector format conversion guide
- Documented performance monitoring
- Included backup/restore workflows
- Added troubleshooting for new features

### 🔄 Changed

- Version updated from 4.1.0 to 4.2.0
- Enhanced manifest.json security policies
- Improved content.js with format conversion
- Extended command palette with new actions
- Upgraded onboarding experience

### 📦 New Files Created

- `src/utils/selectorUtils.js` - Selector format conversions
- `src/utils/performance.js` - Performance monitoring utilities
- `src/utils/validation.js` - Validation schemas
- `src/components/BackupRestore.jsx` - Backup/restore UI
- `src/components/StorageDiff.jsx` - Diff comparison UI
- `src/components/Onboarding.jsx` - Onboarding experience
- `src/components/PerformanceMonitor.jsx` - Performance dashboard

### 🐛 Bug Fixes

- Fixed selector format persistence
- Corrected quota calculation edge cases
- Resolved duplicate detection in optimization
- Fixed onboarding display timing

## [4.1.0] - 2025-01-16

### 🎉 Polish & Quality Release

This release focuses on documentation, backend improvements, and developer experience enhancements.

### ✨ Added

- **Comprehensive User Guide** - Complete rewrite of UserGuide.jsx
  - All v4 features documented with visual indicators
  - Organized sections: Quick Start, Keyboard Shortcuts, Features, Use Cases
  - Tips & Tricks section with pro tips
  - Troubleshooting guide
  - Professional formatting with color-coded sections

- **IMPROVEMENTS.md** - Comprehensive roadmap document
  - Known issues with actionable solutions
  - Future enhancement ideas categorized by priority
  - Technical debt tracking
  - Contributing guidelines

### 🔧 Enhanced

- **Background Service Worker (background.js)**
  - Production-safe logging system (no console pollution)
  - Better error handling and message routing
  - Default settings initialization on first install
  - Improved cookie operations with proper error handling
  - Broadcast system for copy history updates across contexts
  - Service worker lifecycle logging

- **DevTools Panel (panel.js)**
  - Loading states with animated spinners
  - Success/error message display with auto-hide
  - Confirmation dialog before clearing storage
  - Storage size display (items count + KB)
  - Keyboard shortcut: Ctrl/Cmd+R to reload
  - Better empty state and error handling
  - Professional welcome screen with branding
  - Storage info header showing size metrics

### 📚 Documentation

- Enhanced user guide with all v4 features
- Created improvements roadmap
- Documented icon optimization requirements
- Added troubleshooting section

### 🐛 Fixed

- Console pollution in background worker (removed development logs)
- Duplicate event listener in background.js
- Missing error handling in cookie operations
- Poor UX in DevTools panel (no loading states)

### 📝 Notes

- Icon optimization still pending (requires image processing tools)
- See IMPROVEMENTS.md for detailed future roadmap
- All core v4 features are stable and production-ready

## [4.0.0] - 2025-01-16

### 🎉 Major Release - Version 4.0

This is a major release with significant new features, improvements, and bug fixes.

### ✨ Added

#### New Features
- **Export/Import Functionality**
  - Export storage data (localStorage/sessionStorage) to JSON files
  - Import storage configurations from JSON files
  - Date-stamped export filenames for easy organization

- **Storage Search/Filter**
  - Real-time search across storage keys and values
  - Case-insensitive filtering
  - Result count display
  - Highlights matching entries

- **Copy History**
  - Automatic tracking of all copied CSS selectors
  - Chronological history with relative timestamps ("2m ago", "1h ago")
  - Quick re-copy functionality
  - Individual entry removal
  - Clear all history option
  - Stores last 50 entries with configurable limit
  - Displays selector and element value

- **Command Palette** (Ctrl/Cmd+K)
  - Quick action launcher with keyboard shortcuts
  - Fuzzy search for commands
  - Keyboard navigation (↑↓ arrows)
  - Fast access to all toolkit features
  - Visual command icons

- **Settings/Preferences Panel**
  - Light/Dark theme toggle
  - Auto-load storage preference
  - Configurable copy history limit (25/50/100/200)
  - Adjustable notification duration
  - Keyboard shortcuts toggle
  - About section with version info
  - Keyboard shortcuts reference

- **Theme System**
  - Dark mode (default)
  - Light mode option
  - Persistent theme preference
  - Smooth transitions between themes
  - Theme-aware UI components

- **Config Validation**
  - CSAE config structure validation
  - Schema validation with helpful error messages
  - Warnings for missing recommended fields
  - Formatted validation results

#### Components
- `ErrorBoundary.jsx` - React error boundary for graceful error handling
- `CopyHistory.jsx` - Copy history management component
- `CommandPalette.jsx` - Quick action command palette
- `Settings.jsx` - Settings and preferences panel

#### Utilities
- `logger.js` - Development logging utility (production-safe)
- `sanitize.js` - HTML sanitization for XSS prevention
- `configValidator.js` - CSAE config validation

### 🔒 Security

- **XSS Protection**
  - HTML sanitization for all user-controlled content
  - Safe innerHTML usage with escapeHtml utility
  - Input validation on all forms
  - Sanitized notification messages

- **Error Handling**
  - React Error Boundaries prevent full UI crashes
  - Graceful degradation on errors
  - User-friendly error messages
  - Development mode stack traces

### 🐛 Bug Fixes

- **Memory Leak Fix**
  - Fixed memory leak in content script event listeners
  - Proper event listener cleanup
  - Prevented duplicate listener registration
  - Added listener tracking flags

- **React 18 Migration**
  - Updated from deprecated `ReactDOM.render()` to `createRoot()`
  - Ensures compatibility with React 18
  - Improved concurrent rendering support

- **Console Cleanup**
  - Removed all production `console.log` statements
  - Added development-only logging utility
  - Silent production builds
  - Cleaner browser console

### ♿ Accessibility

- **ARIA Labels**
  - Added `aria-label` to all buttons
  - Descriptive labels for screen readers
  - Semantic HTML elements
  - Proper heading hierarchy

- **Keyboard Navigation**
  - Full keyboard support for all features
  - Command Palette keyboard shortcuts
  - Tab navigation through UI
  - ESC key support for modals

- **Focus Management**
  - Auto-focus on command palette
  - Visible focus indicators
  - Logical tab order
  - Focus trapping in modals

### 🎨 UI/UX Improvements

- Cleaner button layouts with flexbox
- Success/error message notifications
- Loading states for async operations
- Improved color contrast
- Responsive design improvements
- Visual feedback for all interactions
- Relative timestamps in copy history
- Result counts in search
- Command Palette visual polish

### 🏗️ Technical Improvements

- **Code Quality**
  - Added PropTypes for type checking (preparation)
  - Better error handling throughout
  - Consistent code style
  - Reduced technical debt

- **Performance**
  - `useMemo` for filtered data calculations
  - Optimized re-renders
  - Efficient event listener management
  - Smaller bundle size (pending icon optimization)

- **Build System**
  - Updated `.gitignore` to exclude build artifacts
  - Excluded `dist/` and `*.zip` files from git
  - Cleaner repository structure

### 📝 Documentation

- Comprehensive README with:
  - Feature documentation
  - Installation instructions
  - Usage guide
  - Keyboard shortcuts reference
  - Development guide
  - Project structure
  - Contributing guidelines

- Created CHANGELOG.md
- Added inline code comments
- Better function documentation

### 🔄 Changed

- Updated version from 1.2.6 to 4.0.0
- Improved manifest.json structure
- Enhanced storage manager UI
- Better button grouping and layout
- Modernized color scheme
- Streamlined navigation

### 📦 Dependencies

- React: 18.3.1
- Vite: 5.2.0
- TailwindCSS: 3.4.4
- All dependencies up to date (except icon optimization pending)

## [1.2.6] - 2024 (Phase 4)

### Added
- CSAE Config working functionality
- DevTools panel implementation

## [1.2.5] - 2024 (Phase 3)

### Added
- Side panel version migration
- Improved panel UI

## [1.0.0] - 2024 (Phase 1-2)

### Added
- Initial CSS Selector Grabber
- Storage Manager (localStorage, sessionStorage, cookies)
- Color Picker with EyeDropper API
- Basic DevTools integration
- Navigation shortcuts

---

## Version History Summary

- **v4.0.0** (2025-01-16): Major feature release - Export/Import, Search, Copy History, Command Palette, Settings, Theme, Security fixes
- **v1.2.6** (2024): Phase 4 - CSAE Config features
- **v1.2.5** (2024): Phase 3 - Side panel migration
- **v1.0.0** (2024): Initial release - Core features

[4.0.0]: https://github.com/your-repo/csae-toolkit/releases/tag/v4.0.0
[1.2.6]: https://github.com/your-repo/csae-toolkit/releases/tag/v1.2.6
[1.2.5]: https://github.com/your-repo/csae-toolkit/releases/tag/v1.2.5
[1.0.0]: https://github.com/your-repo/csae-toolkit/releases/tag/v1.0.0
