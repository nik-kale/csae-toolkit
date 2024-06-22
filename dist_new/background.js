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
  }
});
