# Changelog

All notable changes to the CSAE Toolkit project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.0.1] - 2026-08-02

### Fixed

- `icon16.png`, `icon48.png`, and `icon128.png` were all the same 1024x1024
  image, so Chrome downscaled them at runtime and the packaged extension
  carried roughly 3 MB of unused pixels. Each is now stored at the size the
  manifest declares, cutting the package from 5.6 MB to under 3 MB.
- `scripts/sync-version.js` rewrote `public/manifest.json` with `JSON.stringify`,
  which reformatted the file and left it failing `format:check` after every
  version bump. It now patches the version string in place.

## [2.0.0] - 2026-08-02

Major release. The extension no longer runs on every page: the always-on
`<all_urls>` content script is gone in favor of on-demand injection, cookie
access is scoped to the active tab, and the legacy popup has been removed in
favor of the side panel. Existing users will be prompted to accept the revised
permission set on update.

### Security

- Rebuilt the hover box, color notification, config viewer, and DevTools panel to
  render page-derived data with `createElement`/`textContent` instead of `innerHTML`,
  closing a DOM XSS vector.
- The cookie service worker now rejects messages that do not originate from the
  extension's own pages and scopes every cookie read/clear/delete to the active
  tab's origin, closing an XSS-to-cookie-exfiltration chain.
- Removed the always-on `<all_urls>` content script in favor of on-demand injection.
- Removed remote Google Fonts loading in favor of a system font stack.

### Added

- Rewritten selector engine: `nth-of-type` fix, `CSS.escape`, stable-attribute
  priority, hashed-class filtering, uniqueness validation, shadow DOM, and iframes.
- Live match count and XPath output while hovering; Shift + Click copies XPath.
- Persisted selector history and a "Selector History" panel.
- Real CSAE config viewer with collapsible JSON, search, and copy.
- Storage Manager: per-key edit/delete, add key, search/filter, JSON export, and
  per-cookie delete.
- Color Tools: eyedropper with HEX/RGB/HSL output, palette history, and a WCAG
  contrast checker.
- Shared `Button` component, `aria-expanded` on toggles, `role="alert"` on errors.
- Keyboard shortcuts via the `commands` API.
- Vitest + Testing Library suite, ESLint 9 flat config, Prettier, a GitHub Actions
  CI workflow, and `package`/version-sync scripts.
- Comprehensive GitHub documentation, contributing guidelines, issue/PR templates,
  Code of Conduct, and an enhanced README documenting the permission model.

### Changed

- Upgraded Vite to 6.4.3 (from 5.2.0) and migrated `main.jsx` to `createRoot`
  wrapped in an error boundary.
- Consolidated the content script's message listeners into a single router with an
  injection sentinel to prevent handler stacking.

### Fixed

- Cookie removal for domain cookies whose domain starts with `.` (previously built
  an invalid URL and silently failed).
- Selectors are copied verbatim; whitespace is no longer stripped, so attribute
  values and combinators survive intact.

### Removed

- Dead code: orphan runtime messages, the unused DevTools block in `App.jsx`,
  `src/assets/react.svg`, `public/popup.html`, and the stale `dist_new.zip`.

## [1.2.6] - 2024

### Features

- Side panel integration for better workspace management
- CSS Selector grabber tool
- CSAE Config viewer
- Color picker utility
- Storage manager with intuitive interface
- Integrated user guide
- Quick navigation to CSAE Web and Admin portals

### Technical

- Built with React 18.3.1
- Powered by Vite 5.2.0 for fast development
- Styled with TailwindCSS 3.4.4
- Chrome Extension Manifest V3 compliance
- ESLint integration for code quality

### UI/UX

- Modern dark-themed interface
- Responsive design
- Smooth transitions and hover effects
- Clean and intuitive user experience

---

## Version History Format

### Types of Changes

- **Added** - New features
- **Changed** - Changes in existing functionality
- **Deprecated** - Soon-to-be removed features
- **Removed** - Removed features
- **Fixed** - Bug fixes
- **Security** - Vulnerability fixes

---

[Unreleased]: https://github.com/nik-kale/csae-toolkit/compare/v2.0.1...HEAD
[2.0.1]: https://github.com/nik-kale/csae-toolkit/compare/v2.0.0...v2.0.1
[2.0.0]: https://github.com/nik-kale/csae-toolkit/compare/v1.2.6...v2.0.0
[1.2.6]: https://github.com/nik-kale/csae-toolkit/releases/tag/v1.2.6
