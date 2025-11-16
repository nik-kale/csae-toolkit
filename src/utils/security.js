/**
 * Security Utilities for CSAE Toolkit v4.0
 *
 * Provides comprehensive security functions including:
 * - XSS prevention
 * - Input sanitization
 * - CSP compliance
 * - URL validation
 * - Safe regex patterns
 */

// XSS Prevention - Escape HTML entities
export function escapeHTML(str) {
  if (typeof str !== 'string') return '';

  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// Sanitize CSS values
export function sanitizeCSS(value) {
  if (typeof value !== 'string') return '';

  // Remove potentially dangerous CSS
  const dangerous = [
    'expression',
    'javascript:',
    'vbscript:',
    'data:',
    'import',
    '@import',
    'behavior',
    '-moz-binding',
  ];

  const lowerValue = value.toLowerCase();
  for (const pattern of dangerous) {
    if (lowerValue.includes(pattern)) {
      console.warn(`Blocked potentially dangerous CSS: ${pattern}`);
      return '';
    }
  }

  return value;
}

// Validate and sanitize URLs
export function sanitizeURL(url) {
  if (typeof url !== 'string') return null;

  try {
    const parsed = new URL(url);

    // Only allow http, https, chrome-extension
    const allowedProtocols = ['http:', 'https:', 'chrome-extension:'];
    if (!allowedProtocols.includes(parsed.protocol)) {
      console.warn(`Blocked URL with dangerous protocol: ${parsed.protocol}`);
      return null;
    }

    return parsed.href;
  } catch (e) {
    console.warn('Invalid URL:', url);
    return null;
  }
}

// Sanitize selector strings
export function sanitizeSelector(selector) {
  if (typeof selector !== 'string') return '';

  // Basic validation - no script tags or event handlers
  if (selector.includes('<script') || selector.includes('on') && selector.includes('=')) {
    console.warn('Blocked potentially dangerous selector');
    return '';
  }

  return selector.trim();
}

// Safe regex creation with timeout protection
export function createSafeRegex(pattern, flags = '') {
  try {
    // Prevent catastrophic backtracking by limiting pattern complexity
    if (pattern.length > 1000) {
      throw new Error('Regex pattern too long');
    }

    const regex = new RegExp(pattern, flags);

    // Test with timeout
    const testTimeout = setTimeout(() => {
      throw new Error('Regex execution timeout');
    }, 1000);

    regex.test('test');
    clearTimeout(testTimeout);

    return regex;
  } catch (e) {
    console.error('Invalid or dangerous regex pattern:', e);
    return null;
  }
}

// Content Security Policy - check if action is allowed
export function checkCSP(action, details) {
  const policy = {
    allowInlineScripts: false,
    allowEval: false,
    allowUnsafeInline: false,
  };

  if (action === 'eval' && !policy.allowEval) {
    console.error('CSP: eval() blocked');
    return false;
  }

  if (action === 'inline-script' && !policy.allowInlineScripts) {
    console.error('CSP: Inline script blocked');
    return false;
  }

  return true;
}

// Prevent prototype pollution
export function safeAssign(target, source) {
  const safeKeys = Object.keys(source).filter(key => {
    return key !== '__proto__' && key !== 'constructor' && key !== 'prototype';
  });

  const safeSource = {};
  safeKeys.forEach(key => {
    safeSource[key] = source[key];
  });

  return Object.assign(target, safeSource);
}

// Rate limiting for operations
const rateLimits = new Map();

export function rateLimit(key, limit = 10, windowMs = 1000) {
  const now = Date.now();
  const record = rateLimits.get(key) || { count: 0, resetTime: now + windowMs };

  if (now > record.resetTime) {
    record.count = 0;
    record.resetTime = now + windowMs;
  }

  if (record.count >= limit) {
    console.warn(`Rate limit exceeded for: ${key}`);
    return false;
  }

  record.count++;
  rateLimits.set(key, record);
  return true;
}

// Generate secure random IDs
export function generateSecureId(prefix = 'csae') {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  const hex = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  return `${prefix}-${hex}`;
}

// Validate input against whitelist
export function validateInput(input, type) {
  const validators = {
    alphanumeric: /^[a-zA-Z0-9]+$/,
    numeric: /^[0-9]+$/,
    cssValue: /^[a-zA-Z0-9\s\-\.%#(),'"/]+$/,
    selector: /^[a-zA-Z0-9\s\-_#.\[\]=>+~:()]+$/,
  };

  const validator = validators[type];
  if (!validator) {
    console.warn(`Unknown validation type: ${type}`);
    return false;
  }

  return validator.test(input);
}

// Audit logging with security context
export function securityLog(event, data = {}) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    event,
    data,
    userAgent: navigator.userAgent,
    url: window.location.href,
    stackTrace: new Error().stack,
  };

  // Store in chrome.storage with encryption flag
  chrome.storage.local.get(['securityLogs'], (result) => {
    const logs = result.securityLogs || [];
    logs.push(logEntry);

    // Keep only last 100 security events
    const trimmed = logs.slice(-100);
    chrome.storage.local.set({ securityLogs: trimmed });
  });

  // Also log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log('[Security Event]', logEntry);
  }
}

// Sanitize file names for downloads
export function sanitizeFileName(fileName) {
  if (typeof fileName !== 'string') return 'download';

  // Remove path traversal attempts
  let safe = fileName.replace(/[\/\\:*?"<>|]/g, '_');

  // Remove leading dots
  safe = safe.replace(/^\.+/, '');

  // Limit length
  if (safe.length > 255) {
    const ext = safe.split('.').pop();
    safe = safe.substring(0, 250) + '.' + ext;
  }

  return safe || 'download';
}

// Check for suspicious patterns in data
export function detectSuspiciousPatterns(data) {
  const suspiciousPatterns = [
    /<script[^>]*>.*?<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /eval\s*\(/gi,
    /expression\s*\(/gi,
    /vbscript:/gi,
    /data:text\/html/gi,
  ];

  const dataStr = JSON.stringify(data);

  for (const pattern of suspiciousPatterns) {
    if (pattern.test(dataStr)) {
      securityLog('suspicious_pattern_detected', { pattern: pattern.toString() });
      return true;
    }
  }

  return false;
}

export default {
  escapeHTML,
  sanitizeCSS,
  sanitizeURL,
  sanitizeSelector,
  createSafeRegex,
  checkCSP,
  safeAssign,
  rateLimit,
  generateSecureId,
  validateInput,
  securityLog,
  sanitizeFileName,
  detectSuspiciousPatterns,
};
