/**
 * HTML sanitization utility to prevent XSS attacks
 * Escapes HTML special characters
 */

export function escapeHtml(unsafe) {
  if (typeof unsafe !== 'string') {
    return String(unsafe);
  }

  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Sanitize CSS selector for safe display
 */
export function sanitizeSelector(selector) {
  return escapeHtml(selector);
}

/**
 * Sanitize element value for safe display
 */
export function sanitizeValue(value) {
  return escapeHtml(value);
}

/**
 * Create a safe HTML string from template and values
 * All values are automatically escaped
 */
export function safeHTML(template, ...values) {
  const escapedValues = values.map(v => escapeHtml(v));
  return template.reduce((acc, str, i) => {
    return acc + str + (escapedValues[i] || '');
  }, '');
}

export default {
  escapeHtml,
  sanitizeSelector,
  sanitizeValue,
  safeHTML
};
