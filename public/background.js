// CSAE Toolkit service worker (Manifest V3).
//
// Handles one-shot cookie RPCs from the extension's own pages. Cookie access is
// deliberately scoped to the active tab's origin: a compromised web page must
// never be able to read or wipe the whole cookie jar through this worker.

chrome.runtime.onInstalled.addListener(() => {
  chrome.sidePanel
    ?.setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error) => console.error('CSAE Toolkit: side panel setup failed', error));
});

// Keyboard shortcuts (chrome.commands). Each command injects the content script
// into the active tab and forwards the matching action, so the shortcuts work
// without the side panel being open.
const COMMAND_ACTIONS = {
  'grab-selector': { action: 'toggleHover', hoverActive: true, allFrames: true },
  'pick-color': { action: 'pickColor' },
  'view-config': { action: 'viewConfig' },
};

function runCommandOnActiveTab(command) {
  const payload = COMMAND_ACTIONS[command];
  if (!payload) return;
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
    const tab = tabs && tabs[0];
    if (!tab || !/^https?:\/\//.test(tab.url || '')) return;
    chrome.scripting.executeScript(
      { target: { tabId: tab.id, allFrames: Boolean(payload.allFrames) }, files: ['content.js'] },
      () => {
        if (chrome.runtime.lastError) {
          console.error('CSAE Toolkit: injection failed', chrome.runtime.lastError.message);
          return;
        }
        const message = { action: payload.action };
        if (payload.hoverActive !== undefined) message.hoverActive = payload.hoverActive;
        chrome.tabs.sendMessage(tab.id, message, () => void chrome.runtime.lastError);
      }
    );
  });
}

chrome.commands?.onCommand.addListener(runCommandOnActiveTab);

// Accept privileged messages only from this extension's own pages. Content
// scripts and web pages carry a `sender.tab`, so requiring its absence (plus a
// matching extension id) rejects anything originating from a page.
// Canonical, unit-tested version lives in src/lib/cookies.js.
function isFromExtensionPage(sender) {
  return sender && sender.id === chrome.runtime.id && !sender.tab;
}

// Resolve the origin the user is actually looking at, so cookie operations can
// be scoped to it. Returns null when there is no http(s) tab to act on.
function getActiveTabUrl() {
  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
      const url = tabs && tabs[0] && tabs[0].url;
      resolve(url && /^https?:\/\//.test(url) ? url : null);
    });
  });
}

// Build a valid removal URL. Domain cookies report a leading-dot domain
// (".example.com"); leaving it in yields an invalid "https://.example.com/"
// URL and the removal silently fails, so it is stripped here. URL-building
// logic mirrors cookieRemovalUrl() in src/lib/cookies.js.
function removeCookie(cookie) {
  const domain = cookie.domain.replace(/^\./, '');
  const url = `${cookie.secure ? 'https' : 'http'}://${domain}${cookie.path}`;
  return new Promise((resolve) => {
    chrome.cookies.remove({ url, name: cookie.name, storeId: cookie.storeId }, (details) =>
      resolve(Boolean(details))
    );
  });
}

const COOKIE_ACTIONS = new Set(['getCookies', 'clearCookies', 'removeCookie']);

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (!COOKIE_ACTIONS.has(message?.action)) {
    return false;
  }

  if (!isFromExtensionPage(sender)) {
    sendResponse({ error: 'unauthorized' });
    return false;
  }

  if (message.action === 'getCookies') {
    getActiveTabUrl().then((url) => {
      if (!url) {
        sendResponse({ cookies: [], scope: null });
        return;
      }
      chrome.cookies.getAll({ url }, (cookies) => {
        sendResponse({ cookies, scope: new URL(url).hostname });
      });
    });
    return true;
  }

  // removeCookie: delete a single cookie, but only if it is actually in scope
  // for the active tab. The active-tab cookie set is the authority; the caller's
  // domain is never trusted, so a page cannot coax the worker into deleting
  // cookies for an unrelated origin.
  if (message.action === 'removeCookie') {
    getActiveTabUrl().then((url) => {
      if (!url) {
        sendResponse({ success: false, error: 'No active http(s) tab to scope cookies to.' });
        return;
      }
      chrome.cookies.getAll({ url }, (cookies) => {
        const match = cookies.find(
          (c) => c.name === message.name && (message.path == null || c.path === message.path)
        );
        if (!match) {
          sendResponse({ success: false, error: 'Cookie is not in the active tab scope.' });
          return;
        }
        removeCookie(match).then((ok) =>
          sendResponse({ success: ok, scope: new URL(url).hostname })
        );
      });
    });
    return true;
  }

  // clearCookies
  getActiveTabUrl().then((url) => {
    if (!url) {
      sendResponse({ success: false, error: 'No active http(s) tab to scope cookies to.' });
      return;
    }
    chrome.cookies.getAll({ url }, (cookies) => {
      Promise.all(cookies.map(removeCookie)).then((results) => {
        sendResponse({
          success: true,
          removed: results.filter(Boolean).length,
          scope: new URL(url).hostname,
        });
      });
    });
  });
  return true;
});
