/**
 * Content Script Utilities
 * Advanced developer tools injected into web pages
 */

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get unique CSS selector for an element
 */
function getUniqueSelector(el) {
  if (!(el instanceof Element)) return '';
  let path = [];

  while (el && el.nodeType === Node.ELEMENT_NODE) {
    let selector = el.nodeName.toLowerCase();
    if (el.id) {
      selector = `#${el.id}`;
      path.unshift(selector);
      break;
    } else if (typeof el.className === 'string' && el.className.trim()) {
      let classes = el.className.trim().split(/\s+/).join('.');
      if (classes) {
        selector += `.${classes}`;
      }
    }
    let sib = el;
    let nth = 1;
    while ((sib = sib.previousElementSibling)) {
      if (sib.nodeName.toLowerCase() === selector) nth++;
    }
    if (nth !== 1) {
      selector += `:nth-of-type(${nth})`;
    }
    path.unshift(selector);
    el = el.parentNode;
  }

  return path.join(' > ');
}

/**
 * Create safe DOM element with text content
 */
function createSafeElement(tag, text, attributes = {}) {
  const element = document.createElement(tag);
  if (text) {
    element.textContent = text;
  }
  Object.entries(attributes).forEach(([key, value]) => {
    if (key === 'style' && typeof value === 'object') {
      Object.assign(element.style, value);
    } else {
      element.setAttribute(key, value);
    }
  });
  return element;
}

/**
 * Show notification
 */
function showNotification(message, type = 'success') {
  const notification = createSafeElement('div', '', {
    style: {
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: '10002',
      backgroundColor: type === 'success' ? '#4ADC71' : type === 'error' ? '#ff6b6b' : '#ffd93d',
      color: '#fff',
      padding: '12px 20px',
      borderRadius: '8px',
      fontFamily: 'Inter, Arial, sans-serif',
      fontSize: '14px',
      fontWeight: 'bold',
      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
      animation: 'slideIn 0.3s ease-out',
    },
  });
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.transition = 'opacity 0.3s';
    notification.style.opacity = '0';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

/**
 * Copy to clipboard
 */
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    showNotification('Copied to clipboard!', 'success');
  } catch (err) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    showNotification('Copied to clipboard!', 'success');
  }
}

// Export for use in other modules
window.csaeUtils = {
  getUniqueSelector,
  createSafeElement,
  showNotification,
  copyToClipboard,
};
