# CSAE Toolkit 🛠️

<div align="center">

![Version](https://img.shields.io/badge/version-2.0.1-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-yellow.svg?logo=google-chrome&logoColor=white)
![React](https://img.shields.io/badge/React-18.3.1-61DAFB.svg?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6.4.3-646CFF.svg?logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.4-38B2AC.svg?logo=tailwind-css&logoColor=white)

**A powerful Chrome Extension toolkit that complements the Cisco Support Assistant Extension (CSAE) with purpose-built tools to aid in campaign creation and management.**

[Features](#features) • [Installation](#installation) • [Usage](#usage) • [Development](#development) • [Contributing](#contributing) • [License](#license)

</div>

---

## 📋 Table of Contents

- [About](#about)
- [Features](#features)
- [Screenshots](#screenshots)
- [Installation](#installation)
  - [From Source](#from-source)
  - [For Development](#for-development)
- [Usage](#usage)
- [Permissions & Shortcuts](#-permissions--shortcuts)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Development](#development)
- [Building](#building)
- [Contributing](#contributing)
- [Changelog](#changelog)
- [License](#license)
- [Author](#author)
- [Support](#support)

---

## 🎯 About

The **CSAE Toolkit** is a Chrome Extension designed to enhance the workflow of Cisco Support Assistant Extension users. Built with modern web technologies, it provides an intuitive interface for essential tools like CSS selector grabbing, configuration viewing, color picking, and storage management.

This toolkit streamlines campaign creation and makes working with CSAE more efficient and user-friendly.

---

## ✨ Features

### 🎨 **CSS Selector Grabber**

Hover over any element to capture a robust, uniqueness-validated CSS selector. The engine prefers stable attributes (`data-testid`, `data-qa`, `id`, `name`, `aria-label`, `role`), escapes tricky identifiers with `CSS.escape`, filters framework-hashed classes, and works across shadow DOM and iframes. Each hover shows a **live match count**, click to copy the selector, or **Shift + Click** to copy the element's **XPath**. Every capture is saved to a persisted **selector history** so a mis-click never loses your previous copy.

### ⚙️ **CSAE Config Viewer**

Locates the CSAE configuration the page actually stores (window globals plus local/session storage) and renders it in a **collapsible JSON viewer** with **search** and one-click **Copy JSON**.

### 🎨 **Color Tools**

Sample any pixel on screen with the eyedropper, then copy the value as **HEX, RGB, or HSL**. Colors accumulate in a reusable **palette history**, and a built-in **WCAG contrast checker** reports the contrast ratio with AA/AAA pass/fail for normal and large text.

### 💾 **Storage Manager**

Inspect and manage the active tab's `localStorage` and `sessionStorage`: **per-key edit and delete**, **add/overwrite** keys, **search/filter**, and **JSON export**. Cookies are **scoped to the active tab's domain** — load them, delete individual cookies, or clear the site's cookies (with a confirmation prompt) without touching the rest of your cookie jar.

### ⌨️ **Keyboard Shortcuts**

Trigger the core tools without opening the panel (see [Permissions & Shortcuts](#-permissions--shortcuts)).

### 📚 **Integrated User Guide**

Comprehensive user guide built right into the extension to help you get started quickly.

### 🚀 **Quick Navigation**

- Direct link to CSAE Web Portal
- Quick access to CSAE Admin Portal
- Seamless integration with existing CSAE workflows

### 🎨 **Modern UI/UX**

- Clean, dark-themed interface
- Responsive design with TailwindCSS
- Smooth transitions and hover effects
- Side panel integration for better workspace management

---

## 📸 Screenshots

> **Note:** Screenshots will be added in future updates to showcase the extension's interface and features.

---

## 📦 Installation

### From Source

1. **Clone the repository**

   ```bash
   git clone https://github.com/nik-kale/csae-toolkit.git
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
   - Enable "Developer mode" (toggle in top-right corner)
   - Click "Load unpacked"
   - Select the `dist` folder from the project directory

### For Development

1. **Start development server**

   ```bash
   npm run dev
   ```

2. **Load the extension** from the `dist` folder as described above

3. **Make changes** - The extension will rebuild automatically with Vite's hot module replacement

---

## 🚀 Usage

### Opening the Extension

1. Click the CSAE Toolkit icon in your Chrome toolbar
2. The side panel will open with all available tools

### Using the Tools

**CSS Selector Grabber:**

1. Click "Grab CSS Selector"
2. Hover over any element to see its selector, XPath, value, and a live match count
3. Click to copy the CSS selector, or Shift + Click to copy the XPath
4. Alt + Click to pin a hover box; press ESC to exit
5. Open "Show Selector History" to re-copy any recent capture

**CSAE Config Viewer:**

1. Open the page where CSAE stores its config
2. Click "View CSAE Config"
3. Browse the collapsible JSON, filter with the search box, and click "Copy JSON"

**Color Tools:**

1. Click "Utilize Color Picker"
2. Click "Pick a Color" and sample any pixel on screen
3. Copy the value as HEX, RGB, or HSL and reuse colors from the palette history
4. Use the contrast checker to validate foreground/background pairs against WCAG AA/AAA

**Storage Manager:**

1. Click "Show Storage Manager"
2. Choose Local or Session, then Load Storage Data
3. Edit or delete individual keys, add new keys, filter, or export as JSON
4. Load Cookies (scoped to the active tab), delete individual cookies, or clear the site's cookies

---

## 🔐 Permissions & Shortcuts

The extension requests the minimum permissions its features need:

| Permission                | Why it is needed                                                                                    |
| ------------------------- | --------------------------------------------------------------------------------------------------- |
| `activeTab` + `scripting` | Inject the content script on demand (only when you click a tool), instead of running on every page. |
| `host_permissions: *`     | So the selector grabber and config viewer can reach any site you explicitly run them on.            |
| `cookies`                 | Read and delete cookies **scoped to the active tab's domain** via the service worker.               |
| `storage`                 | Persist selector history and the color palette in `chrome.storage.local`.                           |
| `clipboardWrite`          | Copy selectors, XPath, config, and color values to your clipboard.                                  |
| `sidePanel`               | Host the toolkit UI in Chrome's side panel.                                                         |

**Security model:** the content script is injected on demand rather than declared for `<all_urls>`, all page-derived data is rendered with `createElement`/`textContent` (never `innerHTML`), and the cookie service worker rejects messages that don't originate from the extension's own pages and scopes every cookie operation to the active tab's origin.

**Keyboard shortcuts** (editable at `chrome://extensions/shortcuts`):

| Command         | Default (Win/Linux) | Default (macOS)   | Action                         |
| --------------- | ------------------- | ----------------- | ------------------------------ |
| `grab-selector` | `Ctrl+Shift+S`      | `Command+Shift+S` | Toggle the selector hover tool |
| `pick-color`    | `Ctrl+Shift+K`      | `Command+Shift+K` | Open the eyedropper            |
| `view-config`   | _unassigned_        | _unassigned_      | Open the CSAE config viewer    |

---

## 🛠️ Tech Stack

- **Framework:** React 18.3.1 (`createRoot` with an error boundary)
- **Build Tool:** Vite 6.4.3
- **Styling:** TailwindCSS 3.4.4 (system font stack, no remote fonts)
- **Language:** JavaScript (ESNext)
- **Extension:** Chrome Extension Manifest V3
- **Linting/Formatting:** ESLint 9 (flat config) + Prettier
- **Testing:** Vitest + Testing Library (mocked `chrome` global)
- **CI:** GitHub Actions (lint, test, build, version check, `npm audit`)

---

## 📁 Project Structure

```
csae-toolkit/
├── public/                  # Static assets copied verbatim into the build
│   ├── manifest.json        # Chrome extension manifest (MV3)
│   ├── background.js        # Service worker (cookie RPCs, keyboard commands)
│   ├── content.js           # On-demand content script (selectors, config, color)
│   ├── icon*.png            # Extension icons
│   └── background.png       # UI banner
├── src/                     # Side panel source
│   ├── App.jsx              # Main application component
│   ├── main.jsx            # Entry point (createRoot + ErrorBoundary)
│   ├── ErrorBoundary.jsx    # Render-error fallback
│   ├── Button.jsx           # Shared button component
│   ├── UserGuide.jsx        # User guide component
│   ├── StorageManager.jsx   # Storage + cookie manager
│   ├── SelectorHistory.jsx  # Persisted selector history
│   ├── ColorPicker.jsx      # Color tools (formats, palette, contrast)
│   ├── DateTime.jsx         # Date/time display component
│   ├── devtools.js          # DevTools page
│   ├── panel.js             # DevTools storage panel logic
│   └── lib/                 # Pure, unit-tested helpers
│       ├── selector.js      # CSS selector + XPath engine
│       ├── cookies.js       # Cookie URL/sender helpers
│       └── color.js         # Color parsing, formatting, WCAG contrast
├── test/                    # Vitest suites (selector, color, cookies, storage)
├── scripts/                 # sync-version.js, package.js
├── .github/workflows/ci.yml # CI pipeline
├── eslint.config.js         # ESLint 9 flat config
├── vite.config.js           # Vite configuration
├── vitest.config.js         # Vitest configuration
├── .prettierrc.json         # Prettier configuration
├── tailwind.config.js       # Tailwind configuration
├── postcss.config.js        # PostCSS configuration
└── package.json             # Project metadata and scripts
```

---

## 💻 Development

### Prerequisites

- Node.js (v20 or higher, matching CI)
- npm
- Google Chrome browser

### Setup Development Environment

```bash
# Clone the repository
git clone https://github.com/nik-kale/csae-toolkit.git
cd csae-toolkit

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build production-ready extension
- `npm run lint` - Run ESLint (flat config) to check code quality
- `npm run format` / `npm run format:check` - Apply / verify Prettier formatting
- `npm test` / `npm run test:watch` - Run the Vitest suite
- `npm run check-version` / `npm run sync-version` - Verify / fix version consistency across `package.json`, `manifest.json`, and the README badge
- `npm run package` - Build and zip `dist/` for distribution
- `npm run preview` - Preview production build

### Development Workflow

1. Make changes to source files in `src/`
2. Vite will automatically rebuild
3. Reload the extension in Chrome (`chrome://extensions/`)
4. Test your changes

---

## 🏗️ Building

To create a production build:

```bash
npm run build
```

The optimized extension will be output to the `dist/` directory, ready for distribution.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed contribution guidelines.

---

## 📝 Changelog

See [CHANGELOG.md](CHANGELOG.md) for a detailed list of changes and version history.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

**Copyright © 2024-2025 Cisco Systems Inc.**

---

## 👨‍💻 Author

**Nik Kale** (nikkal)

- GitHub: [@nik-kale](https://github.com/nik-kale)
- Made with ☕ and ❤️

---

## 💬 Support

For support, questions, or feedback:

1. **Issues:** Open an issue on [GitHub Issues](https://github.com/nik-kale/csae-toolkit/issues)
2. **CSAE Portal:** Visit [Cisco Support Assistant Extension](https://supportassistant.cisco.com/extension)
3. **Admin Portal:** Access the [CSAE Admin Portal](https://go2.cisco.com/csae-admin-portal)

---

<div align="center">

**[⬆ back to top](#csae-toolkit-️)**

Made with ☕ and ❤️ by Nik Kale

</div>
