/**
 * Application Constants
 * Centralized configuration for the CSAE Toolkit
 */

// Theme Colors
export const COLORS = {
  primary: '#649ef5',
  primaryHover: '#44696d',
  background: '#23282e',
  cardBackground: '#464b54',
  darkBackground: '#353945',
  success: '#4ADC71',
  error: '#ff6b6b',
  warning: '#ffd93d',
  text: '#ffffff',
  textSecondary: '#a0a0a0',
};

// Timing Constants
export const TIMING = {
  notificationDuration: 2000,
  notificationFadeOut: 500,
  debounceDelay: 150,
  tooltipDelay: 500,
};

// Z-Index Layers
export const Z_INDEX = {
  hoverBox: 10000,
  pinnedBox: 10001,
  notification: 10002,
  modal: 10003,
};

// URLs
export const URLS = {
  csaeWeb: 'https://supportassistant.cisco.com/extension',
  adminPortal: 'https://go2.cisco.com/csae-admin-portal',
};

// Storage Keys
export const STORAGE_KEYS = {
  theme: 'csae_toolkit_theme',
  preferences: 'csae_toolkit_preferences',
};

// Messages
export const MESSAGES = {
  copySuccess: 'Copied to clipboard!',
  colorCopySuccess: (color) => `Color ${color} copied to clipboard!`,
  clearStorageConfirm: 'Are you sure you want to clear all storage data? This action cannot be undone.',
  clearCookiesConfirm: 'Are you sure you want to clear all cookies? This action cannot be undone.',
  loadError: 'Failed to load data. Please try again.',
  clearSuccess: 'Data cleared successfully!',
};

// Keyboard Shortcuts
export const SHORTCUTS = {
  toggleHover: 'Escape',
  copySelector: 'Enter',
  pinBox: 'Alt+Click',
  closeBox: 'Escape',
};

// Extension Info
export const EXTENSION_INFO = {
  name: 'CSAE Toolkit',
  version: '1.2.6',
  author: 'Nik Kale',
  copyright: '© 2024-2025 Cisco Systems Inc.',
};
