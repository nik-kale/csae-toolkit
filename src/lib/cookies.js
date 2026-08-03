// Pure cookie helpers. public/background.js inlines equivalent logic because a
// Manifest V3 service worker is a classic script and cannot import ES modules;
// keeping the canonical, tested implementation here guards against regressions.

// Domain cookies report a leading-dot domain (".example.com"). Leaving the dot
// in produces an invalid "https://.example.com/" URL that chrome.cookies.remove
// silently rejects, so it must be stripped.
export function cookieRemovalUrl(cookie) {
  const domain = String(cookie.domain || '').replace(/^\./, '');
  return `${cookie.secure ? 'https' : 'http'}://${domain}${cookie.path || '/'}`;
}

// Privileged cookie RPCs must only come from the extension's own pages. Content
// scripts and web pages always carry a sender.tab, so its absence (plus a
// matching extension id) is the authorization signal.
export function isFromExtensionPage(sender, extensionId) {
  return Boolean(sender && sender.id === extensionId && !sender.tab);
}
