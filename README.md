# CSAE Toolkit 🛠️

<div align="center">

**A powerful Chrome Extension toolkit for Cisco Support Assistant Extension (CSAE)**

[![Version](https://img.shields.io/badge/version-1.2.6-blue.svg)](https://github.com/yourusername/csae-toolkit)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Made with](https://img.shields.io/badge/Made%20with-React-61DAFB.svg)](https://reactjs.org/)

Created with ☕ and ❤️ by **Nik Kale** (nikkal)

© 2024-2025 Cisco Systems Inc.

</div>

---

## 📋 Table of Contents

- [Features](#-features)
- [Installation](#-installation)
- [Usage](#-usage)
- [Keyboard Shortcuts](#-keyboard-shortcuts)
- [Development](#-development)
- [Architecture](#-architecture)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### Core Features

- **🎯 CSS Selector Grabber** - Hover over any element to view and copy its CSS selector
- **🎨 Color Picker** - Extract colors from any element on the page using EyeDropper API
- **📦 Storage Manager** - View, edit, export, and import browser storage (localStorage, sessionStorage, cookies)
- **⚙️ CSAE Config Viewer** - Inspect and manage CSAE configuration stored in your browser
- **🔍 Search & Filter** - Search through storage data with real-time filtering
- **📥 Export/Import** - Save and restore storage data as JSON files

### Enhanced User Experience

- **🌗 Dark/Light Theme Toggle** - Switch between themes with a single click (Ctrl/Cmd + T)
- **⌨️ Keyboard Shortcuts** - Fast access to features via keyboard
- **♿ Accessibility** - ARIA labels, keyboard navigation, and screen reader support
- **🔔 Smart Notifications** - Toast notifications for all actions
- **✅ Confirmation Dialogs** - Safe guards for destructive operations
- **⏳ Loading States** - Visual feedback during async operations
- **🎭 Error Boundaries** - Graceful error handling with recovery options

### Developer Features

- **📝 ESLint 9 Configuration** - Modern linting with flat config
- **💅 Prettier Integration** - Consistent code formatting
- **🎨 Tailwind CSS** - Utility-first styling
- **⚡ Vite Build System** - Lightning-fast development and builds
- **🧩 Modular Architecture** - Clean, maintainable code structure
- **🔒 Security Improvements** - Reduced permissions, input sanitization

---

## 📦 Installation

### From Source

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/csae-toolkit.git
   cd csae-toolkit
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the extension**
   ```bash
   npm run build
   ```

4. **Load in Chrome**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top-right)
   - Click "Load unpacked"
   - Select the `dist` folder from the project

### Development Mode

```bash
npm run dev
```

This starts Vite in development mode with hot module replacement.

---

## 🚀 Usage

### CSS Selector Grabber

1. Click the **"Grab CSS Selector"** button
2. Hover over any element on the page
3. Click the element to copy its CSS selector
4. Use **Alt + Click** to pin the hover box
5. Press **ESC** to exit

**Features:**
- Real-time CSS property display
- Unique selector generation
- Multi-element pinning
- Clipboard integration

### Color Picker

1. Click the **"Utilize Color Picker"** button
2. Click anywhere on the screen to select a color
3. The color code is automatically copied to your clipboard

**Supported formats:** HEX color codes

### Storage Manager

1. Click **"Show Storage Manager"** or press **Ctrl/Cmd + K**
2. Select storage type (Local/Session)
3. Click **"Load Storage Data"** to view current data
4. Use the search bar to filter results
5. Export data as JSON or import from a file
6. Clear storage with confirmation

**Features:**
- Real-time search/filter
- JSON export/import
- Safe deletion with confirmations
- Cookie management
- Formatted JSON display

### CSAE Config Viewer

1. Click **"View CSAE Config"**
2. Follow the on-screen instructions
3. Open DevTools for the extension
4. Navigate to "CSAE Toolkit CE Storage" panel
5. Load and view your CSAE configuration

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| **Ctrl/Cmd + K** | Toggle Storage Manager |
| **Ctrl/Cmd + H** | Toggle User Guide |
| **Ctrl/Cmd + T** | Toggle Dark/Light Theme |
| **ESC** | Exit CSS Selector Mode |
| **Alt + Click** | Pin Hover Box (in selector mode) |

---

## 🛠️ Development

### Project Structure

```
csae-toolkit/
├── public/
│   ├── background.js        # Service worker
│   ├── content.js           # Content script
│   ├── manifest.json        # Extension manifest
│   └── devtools.html        # DevTools page
├── src/
│   ├── components/          # React components
│   │   ├── ErrorBoundary.jsx
│   │   ├── ConfirmDialog.jsx
│   │   ├── LoadingSpinner.jsx
│   │   └── Notification.jsx
│   ├── constants/           # App constants
│   │   └── index.js
│   ├── context/             # React context
│   │   └── ThemeContext.jsx
│   ├── utils/               # Utility functions
│   │   └── helpers.js
│   ├── App.jsx              # Main app component
│   ├── StorageManager.jsx   # Storage management
│   ├── UserGuide.jsx        # User guide component
│   ├── DateTime.jsx         # Date/time display
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
├── eslint.config.js         # ESLint configuration
├── .prettierrc.json         # Prettier configuration
├── tailwind.config.js       # Tailwind configuration
├── vite.config.js           # Vite configuration
└── package.json             # Dependencies
```

### Available Scripts

```bash
# Development
npm run dev          # Start development server

# Build
npm run build        # Production build

# Linting
npm run lint         # Run ESLint

# Preview
npm run preview      # Preview production build
```

### Tech Stack

- **Frontend:** React 18, Tailwind CSS
- **Build Tool:** Vite 5
- **Code Quality:** ESLint 9, Prettier
- **Chrome APIs:** Manifest V3

### Adding New Features

1. Create component in `src/components/`
2. Add constants to `src/constants/index.js`
3. Add utilities to `src/utils/helpers.js`
4. Update manifest if new permissions needed
5. Build and test

---

## 🏗️ Architecture

### Component Hierarchy

```
App (ErrorBoundary > ThemeProvider)
├── DateTime
├── StorageManager
│   ├── ConfirmDialog
│   ├── LoadingSpinner
│   └── Notification
└── UserGuide
```

### State Management

- **React Context:** Theme management
- **Local State:** Component-specific state
- **Chrome Storage:** Persistent preferences

### Security Features

- **Content Security Policy:** Strict CSP in manifest
- **Input Sanitization:** All user inputs sanitized
- **Error Handling:** Comprehensive error boundaries
- **Permission Scoping:** Minimal required permissions

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Follow ESLint rules
- Use Prettier for formatting
- Add JSDoc comments for functions
- Write meaningful commit messages

---

## 📝 License

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

## 🙏 Acknowledgments

- Built with love by **Nik Kale**
- Powered by React, Vite, and Tailwind CSS
- Thanks to the Cisco CSAE team

---

<div align="center">

**Made with ☕ and ❤️ by Nik Kale**

**© 2024-2025 Cisco Systems Inc.**

</div>
