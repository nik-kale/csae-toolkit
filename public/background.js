/**
 * Background Service Worker
 * Handles extension installation, side panel behavior, and storage operations
 */

// Handle installation and setup
chrome.runtime.onInstalled.addListener(async function () {
  try {
    // Set up side panel behavior
    await chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });

    // Clean up context menus
    chrome.contextMenus?.removeAll(() => {
      console.log("All context menus have been removed.");
    });

    console.log("CSAE Toolkit installed successfully");
  } catch (error) {
    console.error("Installation error:", error);
  }
});

// Handle runtime messages
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'getCookies') {
    chrome.cookies.getAll({}, (cookies) => {
      if (chrome.runtime.lastError) {
        sendResponse({ error: chrome.runtime.lastError.message });
      } else {
        sendResponse({ cookies });
      }
    });
    return true; // Keep message channel open for async response
  }

  if (message.action === 'clearCookies') {
    chrome.cookies.getAll({}, (cookies) => {
      if (chrome.runtime.lastError) {
        sendResponse({ error: chrome.runtime.lastError.message, success: false });
        return;
      }

      let cleared = 0;
      const total = cookies.length;

      if (total === 0) {
        sendResponse({ success: true });
        return;
      }

      cookies.forEach((cookie, index) => {
        const url = `http${cookie.secure ? 's' : ''}://${cookie.domain}${cookie.path}`;
        chrome.cookies.remove({ url, name: cookie.name }, () => {
          cleared++;
          if (cleared === total) {
            sendResponse({ success: true });
          }
        });
      });
    });
    return true; // Keep message channel open for async response
  }

  return false; // No async response needed for other messages
});

