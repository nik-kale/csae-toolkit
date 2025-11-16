# Cisco Support Assistant Extension (CSAE) Toolkit 🛠️

### Created by Nik Kale (nikkal)

**Version 4.0.0** - A powerful Chrome Extension that complements the Cisco Support Assistant Extension (CSAE) and provides developer tools for campaign creation.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Keyboard Shortcuts](#keyboard-shortcuts)
- [Development](#development)
- [Tech Stack](#tech-stack)
- [Changelog](#changelog)
- [License](#license)

## 🎯 Overview

The CSAE Toolkit is a Chrome Extension designed to streamline the development workflow for CSAE campaigns. It provides a comprehensive set of tools including CSS selector grabbing, storage management, config validation, and more.

## ✨ Features

### Core Features

- **🎯 CSS Selector Grabber**
  - Hover over any element to view its CSS selector and properties
  - Click to copy selector to clipboard
  - ALT+Click to pin multiple hover boxes
  - Visual red outline on hover
  - ESC key to exit selector mode

- **💾 Storage Manager** (v4.0)
  - View/clear localStorage and sessionStorage
  - View/clear cookies
  - **NEW:** Export storage data to JSON
  - **NEW:** Import storage data from JSON
  - **NEW:** Search/filter storage by key or value
  - Pretty-printed JSON viewer

- **📋 Copy History** (v4.0)
  - Track all copied selectors with timestamps
  - Quick re-copy from history
  - Remove individual entries
  - Automatically syncs across extension contexts
  - Stores last 50 entries

- **🎨 Color Picker**
  - EyeDropper API integration
  - Copy color codes to clipboard
  - Visual notification on copy

- **⚙️ DevTools Panel**
  - "CSAE Toolkit CE Storage" panel in Chrome DevTools
  - Load CSAE config from chrome.storage.local
  - Clear chrome.storage.local
  - Syntax highlighted JSON viewer

- **🔧 Settings Panel** (v4.0)
  - Light/Dark theme toggle
  - Auto-load storage preferences
  - Configurable history limit
  - Notification duration settings
  - Keyboard shortcuts toggle

- **⌨️ Command Palette** (v4.0)
  - Quick action launcher (Ctrl/Cmd+K)
  - Fuzzy search for commands
  - Keyboard navigation
  - Fast access to all features

- **🔐 Config Validation** (v4.0)
  - Validate CSAE configuration structure
  - Helpful error messages
  - Schema validation

### Navigation Shortcuts

- Quick link to CSAE Web
- Quick link to Admin Portal

## 📦 Installation

### From Source

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd csae-toolkit
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the extension:
   ```bash
   npm run build
   ```

4. Load in Chrome:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist` folder

### Development Mode

```bash
npm run dev
```

This will start Vite in development mode with hot module replacement.

## 🚀 Usage

### Opening the Toolkit

1. Click the CSAE Toolkit icon in your Chrome toolbar
2. The side panel will open with all available tools

### Using CSS Selector Grabber

1. Click "Grab CSS Selector" button
2. Hover over any element on the page
3. Click to copy the selector
4. ALT+Click to pin the hover box
5. Press ESC to exit

### Storage Manager

1. Click "Show Storage Manager"
2. Select storage area (Local/Session)
3. Click "Load Storage Data" to view
4. **Export:** Click "Export" to download as JSON
5. **Import:** Click "Import" and select a JSON file
6. **Search:** Type in the search box to filter results

### Copy History

1. Click "Show Copy History"
2. View all previously copied selectors
3. Click "Copy" to copy again
4. Click "×" to remove an entry
5. Click "Clear All" to remove all history

### Command Palette

1. Press **Ctrl/Cmd+K** (or click ⌘K button)
2. Type to search for a command
3. Use ↑↓ arrow keys to navigate
4. Press Enter to execute
5. Press ESC to close

### Settings

1. Click "Show Settings"
2. Toggle theme between Light/Dark
3. Configure preferences
4. View keyboard shortcuts reference

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + K` | Open Command Palette |
| `ESC` | Exit Selector Mode / Close Command Palette |
| `Alt + Click` | Pin Hover Box |
| `↑ ↓` | Navigate Command Palette |
| `Enter` | Execute Selected Command |

## 🛠️ Development

### Tech Stack

- **React 18.3.1** - UI Framework
- **Vite 5.2.0** - Build Tool
- **TailwindCSS 3.4.4** - Styling
- **Chrome Extension Manifest V3** - Extension API

### Project Structure

```
csae-toolkit/
├── public/
│   ├── manifest.json      # Extension manifest
│   ├── content.js         # Content script
│   ├── background.js      # Service worker
│   ├── panel.js           # DevTools panel
│   └── devtools.html      # DevTools entry point
├── src/
│   ├── App.jsx            # Main application
│   ├── components/        # React components
│   │   ├── ErrorBoundary.jsx
│   │   ├── CopyHistory.jsx
│   │   ├── CommandPalette.jsx
│   │   └── Settings.jsx
│   ├── utils/             # Utility functions
│   │   ├── logger.js
│   │   ├── sanitize.js
│   │   └── configValidator.js
│   ├── StorageManager.jsx
│   ├── UserGuide.jsx
│   ├── DateTime.jsx
│   └── main.jsx
└── package.json
```

### Building

```bash
# Development build
npm run dev

# Production build
npm run build

# Lint code
npm run lint
```

### Key Improvements in v4.0.0

#### Security
- ✅ XSS protection with HTML sanitization
- ✅ Input validation
- ✅ Error boundaries for graceful failure

#### Performance
- ✅ Fixed memory leaks in event listeners
- ✅ React 18 createRoot API
- ✅ Optimized re-renders with useMemo

#### Developer Experience
- ✅ Removed production console.log statements
- ✅ Added proper logging utility
- ✅ Improved error handling

#### Accessibility
- ✅ ARIA labels on all interactive elements
- ✅ Keyboard navigation support
- ✅ Focus management
- ✅ Screen reader friendly

## 📝 Changelog

See [CHANGELOG.md](CHANGELOG.md) for a detailed list of changes.

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License

Copyright (c) 2024-2025 Cisco Systems Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---

Made with ☕ and ❤️ by Nik Kale
