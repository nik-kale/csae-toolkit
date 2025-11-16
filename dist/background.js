chrome.runtime.onInstalled.addListener(async function () {
  chrome.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error) => console.error(error));
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus?.removeAll(() => {
    console.log("All context menus have been removed.");
  });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'getCookies') {
    chrome.cookies.getAll({}, (cookies) => {
      sendResponse({ cookies });
    });
    return true; // Keeps the message channel open for sendResponse
  } else if (message.action === 'clearCookies') {
    chrome.cookies.getAll({}, (cookies) => {
      cookies.forEach(cookie => {
        chrome.cookies.remove({ url: `http${cookie.secure ? 's' : ''}://${cookie.domain}${cookie.path}`, name: cookie.name });
      });
      sendResponse({ success: true });
    });
    return true; // Keeps the message channel open for sendResponse
  } else if (message.action === 'clearBrowserCache') {
    chrome.browsingData.removeCache({}, () => {
      if (chrome.runtime.lastError) {
        sendResponse({ success: false, error: chrome.runtime.lastError.message });
      } else {
        sendResponse({ success: true });
      }
    });
    return true; // Keeps the message channel open for sendResponse
  } else if (message.action === 'clearIndexedDB') {
    chrome.browsingData.removeIndexedDB({}, () => {
      if (chrome.runtime.lastError) {
        sendResponse({ success: false, error: chrome.runtime.lastError.message });
      } else {
        sendResponse({ success: true });
      }
    });
    return true; // Keeps the message channel open for sendResponse
  }
});

