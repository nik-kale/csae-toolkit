# CSAE Toolkit v5.0 🛠️

**Developer Productivity Edition - Professional Toolkit with 30 Tools**

Created by Nik Kale (nikkal) | © 2024-2025 Cisco Systems Inc.

---

## 🎯 Overview

CSAE Toolkit is a powerful Chrome Extension that complements the Cisco Support Assistant Extension (CSAE) and provides comprehensive developer and designer tools for web inspection, editing, debugging, and optimization.

**Tech Stack:** React 18.3.1, Vite 5.2.0, TailwindCSS 3.4.4
**License:** MIT
**Manifest:** V3 (Modern Chrome Extension Standard)

### 🚀 What's New in v5.0 Developer Productivity Edition

**5 Powerful New Developer Tools:**
- **♿ Accessibility Audit Tool** - WCAG 2.1/2.2 compliance checker with 10+ checks and remediation guidance
- **📡 Network Request Viewer** - Monitor and inspect all network requests with HAR export
- **📝 Code Snippet Manager** - Save, organize, and inject JavaScript/CSS code snippets
- **🔍 Technology Stack Detector** - Auto-detect 30+ frameworks, libraries, and technologies
- **📋 JSON/XML Formatter** - Format, validate, and beautify JSON/XML data

**v4.0 Enterprise Features (All Included):**
- **🎨 Light/Dark Theme Toggle** - Choose your preferred theme or use auto (system preference)
- **↩️ Undo/Redo System** - Full history tracking with Ctrl+Z/Ctrl+Shift+Z shortcuts
- **⭐ Favorites & Recent Tools** - Star your favorites and quick access to recent tools
- **🔍 Tool Search (Ctrl+K)** - Instant search across all 30 tools
- **🎯 Floating Quick Access Button** - Draggable quick access to favorite tools
- **🎓 Interactive Onboarding** - First-time user guide with 5-step tutorial
- **⚙️ Settings & Preferences** - Comprehensive settings with export/import
- **🛡️ Security Hardening** - XSS protection, sanitization, rate limiting, audit logging
- **⚡ Performance Optimizations** - Debouncing, throttling, memoization, lazy loading
- **🧩 Error Boundaries** - Graceful error handling with recovery options

---

## ✨ Features (30 Professional Tools)

### 🔍 Inspector Tools (8 tools)
1. **CSS Selector Grabber** - Hover over any element to see its CSS selector, value, and all computed properties. Click to copy, Alt+Click to pin multiple boxes.
2. **Color Picker** - Pick any color from the page using EyeDropper API. Automatically saves to your palette.
3. **Color Palette Viewer** - View, manage, and copy all your saved colors.
4. **Element Measurement Tool** - Click and drag to measure pixel dimensions of any area.
5. **SEO Meta Inspector** - View all meta tags, Open Graph data, Twitter cards, canonical URLs, and more.
6. **Image Extractor** - Extract all images from the page (including background images) with download links.
7. **Element Export** - Export complete HTML and CSS of any element to clipboard.
8. **Performance Metrics** - View detailed page performance metrics (DNS, TCP, load times, paint metrics, resources).

### ✏️ Page Editor Tools (7 tools)
9. **Live CSS Editor** - Click any element to edit its CSS properties in real-time with a visual editor.
10. **Live Text Editor** - Edit any text content directly on the page.
11. **Delete Element** - Click to permanently remove any element.
12. **Hide Element** - Click to hide any element (sets display: none).
13. **Duplicate Element** - Click to create a copy of any element.
14. **Element Highlighter** - Permanently highlight elements with yellow outline.
15. **Font Changer** - Change page fonts globally from 15+ professional fonts.

### 📐 Layout & Design Tools (4 tools)
16. **Grid Overlay** - Display precise alignment grid with 10px and 50px increments.
17. **Element Outliner** - Outline all elements on the page to visualize structure.
18. **Screenshot Tool** - Capture and download full-page screenshots.
19. **Responsive Tester** - Test page at different screen sizes (iPhone, iPad, Desktop presets).

### 💾 Storage & Data Tools (3 tools)
20. **Storage Manager** - View and clear LocalStorage, SessionStorage, and Cookies.
21. **IndexedDB Manager** - View and clear IndexedDB databases.
22. **Browser Cache Clearer** - Clear browser cache with one click.

### 🚀 Developer Productivity Tools (5 tools) **NEW in v5.0**
23. **Accessibility Audit Tool** - Comprehensive WCAG 2.1/2.2 compliance checker with 10+ accessibility checks, severity levels, detailed reports, and remediation guidance. Export audit results as JSON.
24. **Network Request Viewer** - Real-time network monitoring with request/response inspection, filtering by type, sorting options, HAR export, pause/resume recording, and detailed request analysis.
25. **Code Snippet Manager** - Save, organize, and inject JavaScript/CSS code snippets. Import/export snippets, track usage statistics, search and filter, with built-in code editor.
26. **Technology Stack Detector** - Auto-detect 30+ technologies including frameworks (React, Vue, Angular), libraries (jQuery, Lodash), CMS (WordPress, Shopify), analytics, CDNs, and more. Export reports with confidence scores.
27. **JSON/XML Formatter** - Format and beautify JSON/XML data, minify for production, validate syntax, copy to clipboard, download output, handle large files with character/line count.

**Plus:** CSAE Config Viewer, Quick Links to CSAE Web and Admin Portal

---

## ⌨️ Keyboard Shortcuts

### Tool Shortcuts
| Shortcut | Action |
|----------|--------|
| `Ctrl+Shift+C` | CSS Selector Grabber |
| `Ctrl+Shift+P` | Color Picker |
| `Ctrl+Shift+E` | Live CSS Editor |
| `Ctrl+Shift+G` | Grid Overlay |
| `Ctrl+Shift+O` | Element Outliner |
| `Ctrl+Shift+S` | Screenshot |

### v4.0 Enterprise Shortcuts
| Shortcut | Action |
|----------|--------|
| `Ctrl+K` | Open Tool Search |
| `Ctrl+,` | Open Settings |
| `Ctrl+Z` | Undo Last Action |
| `Ctrl+Shift+Z` | Redo Action |
| `ESC` | Exit/Close any active tool or modal |

*Note: Use `Cmd` instead of `Ctrl` on macOS*

---

## 🚀 Installation

### For Development:
```bash
# Clone the repository
git clone https://github.com/nik-kale/csae-toolkit.git
cd csae-toolkit

# Install dependencies
npm install

# Build the extension
npm run build

# Load in Chrome:
# 1. Open chrome://extensions/
# 2. Enable "Developer mode"
# 3. Click "Load unpacked"
# 4. Select the `dist` folder
```

### For Production Use:
1. Download the latest release from GitHub
2. Extract the ZIP file
3. Load the `dist` folder as an unpacked extension in Chrome
4. Pin the extension to your toolbar for quick access

---

## 📖 Usage Guide

### Basic Workflow:
1. Click the CSAE Toolkit extension icon
2. Choose a tool category from the main menu
3. Select the specific tool you want to use
4. Follow the on-screen instructions
5. Press ESC to exit any tool

### CSS Selector Grabber:
- Click "Grab CSS Selector" or press `Ctrl+Shift+C`
- Hover over any element to see its selector
- Click to copy the selector to clipboard
- Use `Alt+Click` to pin multiple hover boxes
- Press `ESC` to exit

### Live CSS Editor:
- Click "Live CSS Editor" or press `Ctrl+Shift+E`
- Click on any element
- Edit CSS properties in the modal
- Click "Apply Changes" to see live updates
- Click "Reset to Original" to undo

### Color Palette Management:
- Use Color Picker to pick colors (they auto-save)
- Click "View Color Palette" to see all saved colors
- Click any color to copy it
- Click "Clear All" to remove all saved colors

### Storage Management:
- Go to Storage & Data category
- Use Storage Manager for LocalStorage/SessionStorage/Cookies
- Use IndexedDB Manager for IndexedDB databases
- All operations show clear confirmations

---

## 🏗️ Project Structure

```
csae-toolkit/
├── src/
│   ├── App.jsx              # Main React component with UI
│   ├── UserGuide.jsx        # Built-in documentation
│   ├── StorageManager.jsx   # Storage inspection component
│   ├── IndexedDBManager.jsx # IndexedDB manager component
│   ├── DateTime.jsx         # Real-time clock component
│   ├── main.jsx             # React entry point
│   └── index.css            # TailwindCSS styles
├── public/
│   ├── manifest.json        # Chrome Extension manifest (MV3)
│   ├── background.js        # Service worker
│   ├── content.js           # Content script (1360+ lines, all tools)
│   ├── devtools.html        # DevTools panel
│   ├── panel.html           # Storage panel
│   ├── popup.html           # Popup window
│   └── icons/               # Extension icons
├── dist/                    # Build output (load this in Chrome)
├── package.json             # Dependencies and scripts
├── vite.config.js           # Build configuration
├── tailwind.config.js       # TailwindCSS configuration
├── README.md                # This file
└── CHANGELOG.md             # Version history

```

---

## 🔧 Development

### Available Scripts:
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run lint     # Run ESLint checks
npm run preview  # Preview build output
```

### Building:
```bash
npm run build
# Output will be in /dist folder
# Load /dist as unpacked extension in Chrome
```

### Code Style:
- React functional components with hooks
- TailwindCSS for styling
- ESLint for code quality
- Modular architecture with separation of concerns

---

## 🛡️ Permissions

The extension requires the following permissions:

- **activeTab** - Access current tab for tools
- **scripting** - Inject content scripts
- **storage** - Save user preferences and color palette
- **cookies** - View and clear cookies
- **clipboardWrite** - Copy selectors/colors/code
- **sidePanel** - Display side panel UI
- **browsingData** - Clear cache and IndexedDB
- **host_permissions** - Access all URLs for universal tool functionality

All permissions are used exclusively for the stated tool functionality. No data is collected or transmitted.

---

## 🎨 Design Philosophy

**Colors:**
- Primary: `#649ef5` (Blue) - Main actions
- Success: `#4ADC71` (Green) - Confirmations, highlights
- Dark: `#23282e`, `#282A33`, `#353945` - Backgrounds
- Accent: `#44696d` (Teal) - Secondary actions

**UI Principles:**
- Dark theme optimized for long sessions
- Clear visual hierarchy
- Accessible keyboard shortcuts
- Instant feedback for all actions
- Minimal clicks to access tools

---

## 🐛 Troubleshooting

### Tools not working?
- Ensure you're on an active tab (not chrome:// or extension pages)
- Refresh the page and try again
- Check that the extension is enabled in chrome://extensions/

### Keyboard shortcuts not working?
- Ensure no other extension is using the same shortcuts
- Try clicking the tool button instead
- Check if the page has focus (click on the page first)

### Screenshot not capturing?
- Ensure the extension has permission to capture screenshots
- Try refreshing the page
- Check Chrome's screenshot permission settings

### Storage data not showing?
- Click "Load Storage Data" button
- Ensure the page has storage data to display
- Check DevTools Console for any errors

---

## 📝 Version History

See [CHANGELOG.md](CHANGELOG.md) for detailed version history.

**Current Version:** 5.0.0 (Developer Productivity Edition)
**Previous Versions:** 4.0.0, 3.0.0, 1.2.6, 1.2.0, 1.1.0, 1.0.0

### Major Milestones
- **v5.0.0** (Nov 2025) - Developer Productivity Edition with accessibility auditing, network monitoring, snippet manager, tech detection, JSON formatter
- **v4.0.0** (Nov 2025) - Enterprise Edition with theme toggle, undo/redo, tool search, favorites, security hardening
- **v3.0.0** (Jan 2025) - Feature parity with SuperDev Pro, 22 professional tools, keyboard shortcuts
- **v1.2.6** (Dec 2024) - CSAE Config integration, storage management
- **v1.0.0** (Sep 2024) - Initial release with core tools

---

## 🤝 Contributing

While this is primarily a Cisco internal tool, contributions are welcome:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

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

## 👨‍💻 Author

**Nik Kale** (nikkal)
Cisco Systems Inc.

---

## 🔗 Links

- **CSAE Web Platform:** https://supportassistant.cisco.com/extension
- **CSAE Admin Portal:** https://go2.cisco.com/csae-admin-portal
- **GitHub Repository:** https://github.com/nik-kale/csae-toolkit
- **Issues & Feedback:** https://github.com/nik-kale/csae-toolkit/issues

---

## ⭐ Acknowledgments

- Built with React, Vite, and TailwindCSS
- Inspired by modern developer tools and SuperDev Pro
- Designed specifically for Cisco Support professionals
- Community feedback and testing

---

**Made with ☕ and ❤️ by Nik Kale**

*CSAE Toolkit - Your Complete Web Development & Debugging Companion*
