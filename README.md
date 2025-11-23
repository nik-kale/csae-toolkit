# CSAE Toolkit 🛠️

<div align="center">

![Version](https://img.shields.io/badge/version-1.2.6-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-yellow.svg?logo=google-chrome&logoColor=white)
![React](https://img.shields.io/badge/React-18.3.1-61DAFB.svg?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.2.0-646CFF.svg?logo=vite&logoColor=white)
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
Easily capture CSS selectors from any element on a webpage by hovering over it. Perfect for campaign creation and web automation tasks.

### ⚙️ **CSAE Config Viewer**
View and inspect CSAE configuration in a clean, readable format directly from the extension.

### 🎨 **Color Picker Tool**
Built-in color picker utility to help you select and copy color values from any webpage element.

### 💾 **Storage Manager**
Manage Chrome extension storage with an intuitive interface. View, edit, and clear stored data effortlessly.

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
2. Hover over any element on the webpage
3. Click to copy the CSS selector to clipboard

**CSAE Config Viewer:**
1. Navigate to a page with CSAE config
2. Click "View CSAE Config"
3. Configuration will be displayed in a modal

**Color Picker:**
1. Click "Utilize Color Picker"
2. Click on any element to pick its color
3. Color value will be copied to clipboard

**Storage Manager:**
1. Click "Show Storage Manager"
2. View, edit, or clear extension storage data

---

## 🛠️ Tech Stack

- **Framework:** React 18.3.1
- **Build Tool:** Vite 5.2.0
- **Styling:** TailwindCSS 3.4.4
- **Language:** JavaScript (ESNext)
- **Extension:** Chrome Extension Manifest V3
- **Linting:** ESLint with React plugins

---

## 📁 Project Structure

```
csae-toolkit/
├── public/               # Static assets
│   ├── manifest.json    # Chrome extension manifest
│   ├── icon*.png        # Extension icons
│   └── background.png   # UI assets
├── src/                 # Source code
│   ├── App.jsx         # Main application component
│   ├── UserGuide.jsx   # User guide component
│   ├── StorageManager.jsx  # Storage management component
│   ├── DateTime.jsx    # Date/time display component
│   ├── main.jsx        # Entry point
│   ├── devtools.js     # DevTools integration
│   ├── panel.js        # Panel logic
│   └── assets/         # Component assets
├── dist/               # Build output (generated)
├── .eslintrc.cjs      # ESLint configuration
├── vite.config.js     # Vite configuration
├── tailwind.config.js # Tailwind configuration
├── postcss.config.js  # PostCSS configuration
└── package.json       # Project dependencies
```

---

## 💻 Development

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
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
- `npm run lint` - Run ESLint to check code quality
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
