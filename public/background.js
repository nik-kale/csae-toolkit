// CSAE Toolkit Background Service Worker
// Handles extension lifecycle, cookies, and cross-component messaging

// Development mode flag
const isDev = false; // Set to true for development logging

// Safe logging utility
function safeLog(...args) {
  if (isDev) {
    console.log('[CSAE Toolkit BG]', ...args);
  }
}

// Initialize extension on install/update
chrome.runtime.onInstalled.addListener(async (details) => {
  safeLog('Extension installed/updated', details);

  // Set up side panel behavior
  try {
    await chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
    safeLog('Side panel behavior configured');
  } catch (error) {
    // Silent fail in production, log in dev
    safeLog('Error setting panel behavior:', error);
  }

  // Clean up any existing context menus
  if (chrome.contextMenus) {
    chrome.contextMenus.removeAll(() => {
      safeLog('Context menus cleared');
    });
  }

  // Initialize default settings on first install
  if (details.reason === 'install') {
    const defaultSettings = {
      theme: 'dark',
      settings: {
        autoLoadStorage: false,
        historyLimit: 50,
        notificationDuration: 2000,
        enableKeyboardShortcuts: true,
      },
      copyHistory: []
    };

    chrome.storage.local.set(defaultSettings, () => {
      safeLog('Default settings initialized');
    });
  }
});

// Message handler for cross-component communication
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Handle cookie operations
  if (message.action === 'getCookies') {
    handleGetCookies(sendResponse);
    return true; // Keep channel open for async response
  }

  if (message.action === 'clearCookies') {
    handleClearCookies(sendResponse);
    return true; // Keep channel open for async response
  }

  // Handle selector copy history
  if (message.action === 'selectorCopied') {
    handleSelectorCopied(message.selector, message.value);
    // No response needed
    return false;
  }

  // Unknown message type
  safeLog('Unknown message action:', message.action);
  return false;
});

// Get all cookies for the current tab
function handleGetCookies(sendResponse) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs || tabs.length === 0) {
      sendResponse({ error: 'No active tab found', cookies: [] });
      return;
    }

    const url = tabs[0].url;

    chrome.cookies.getAll({ url }, (cookies) => {
      if (chrome.runtime.lastError) {
        safeLog('Error getting cookies:', chrome.runtime.lastError);
        sendResponse({ error: chrome.runtime.lastError.message, cookies: [] });
      } else {
        safeLog('Retrieved cookies:', cookies.length);
        sendResponse({ cookies: cookies || [] });
      }
    });
  });
}

// Clear all cookies for the current tab
function handleClearCookies(sendResponse) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs || tabs.length === 0) {
      sendResponse({ success: false, error: 'No active tab found' });
      return;
    }

    const url = tabs[0].url;

    chrome.cookies.getAll({ url }, (cookies) => {
      if (chrome.runtime.lastError) {
        safeLog('Error getting cookies to clear:', chrome.runtime.lastError);
        sendResponse({ success: false, error: chrome.runtime.lastError.message });
        return;
      }

      let removedCount = 0;
      const totalCookies = cookies.length;

      if (totalCookies === 0) {
        sendResponse({ success: true, removed: 0 });
        return;
      }

      cookies.forEach((cookie, index) => {
        const cookieUrl = `http${cookie.secure ? 's' : ''}://${cookie.domain}${cookie.path}`;

        chrome.cookies.remove({ url: cookieUrl, name: cookie.name }, () => {
          removedCount++;

          // Send response after all cookies processed
          if (removedCount === totalCookies) {
            safeLog('Cleared cookies:', removedCount);
            sendResponse({ success: true, removed: removedCount });
          }
        });
      });
    });
  });
}

// Add selector to copy history
function handleSelectorCopied(selector, value) {
  if (!selector) return;

  chrome.storage.local.get(['copyHistory', 'settings'], (result) => {
    const history = result.copyHistory || [];
    const settings = result.settings || { historyLimit: 50 };
    const historyLimit = settings.historyLimit || 50;

    const newEntry = {
      selector,
      value: value || '',
      timestamp: new Date().toISOString(),
      id: Date.now()
    };

    // Add to beginning and limit size
    const updatedHistory = [newEntry, ...history].slice(0, historyLimit);

    chrome.storage.local.set({ copyHistory: updatedHistory }, () => {
      safeLog('Selector added to history, total entries:', updatedHistory.length);

      // Broadcast to all extension contexts
      chrome.runtime.sendMessage({
        action: 'historyUpdated',
        history: updatedHistory
      }).catch(() => {
        // Silent fail if no listeners
      });
    });
  });
}

// Error handler for unhandled promise rejections
self.addEventListener('unhandledrejection', (event) => {
  safeLog('Unhandled rejection:', event.reason);
  // Prevent default error handling in production
  if (!isDev) {
    event.preventDefault();
  }
});

// Log service worker lifecycle
self.addEventListener('activate', () => {
  safeLog('Service worker activated');
});

self.addEventListener('install', () => {
  safeLog('Service worker installed');
  self.skipWaiting(); // Activate immediately
});

safeLog('Background service worker loaded');
