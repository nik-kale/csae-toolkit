/**
 * Performance Utilities
 * Debounce, throttle, and performance monitoring
 */

/**
 * Debounce function - delays execution until after wait time
 */
export function debounce(func, wait = 300) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function - limits execution to once per wait time
 */
export function throttle(func, wait = 300) {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, wait);
    }
  };
}

/**
 * Memoize function results
 */
export function memoize(func) {
  const cache = new Map();
  return function(...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = func(...args);
    cache.set(key, result);
    return result;
  };
}

/**
 * Performance monitor
 */
export class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
    this.enabled = true;
  }

  start(label) {
    if (!this.enabled) return;
    this.metrics.set(label, performance.now());
  }

  end(label) {
    if (!this.enabled) return;
    const startTime = this.metrics.get(label);
    if (startTime) {
      const duration = performance.now() - startTime;
      this.metrics.delete(label);
      return duration;
    }
    return 0;
  }

  measure(label, func) {
    this.start(label);
    const result = func();
    const duration = this.end(label);
    return { result, duration };
  }

  async measureAsync(label, func) {
    this.start(label);
    const result = await func();
    const duration = this.end(label);
    return { result, duration };
  }

  getMetrics() {
    return {
      memory: performance.memory ? {
        usedJS: (performance.memory.usedJSHeapSize / 1048576).toFixed(2) + ' MB',
        totalJS: (performance.memory.totalJSHeapSize / 1048576).toFixed(2) + ' MB',
        limit: (performance.memory.jsHeapSizeLimit / 1048576).toFixed(2) + ' MB'
      } : null,
      timing: performance.timing ? {
        loadTime: performance.timing.loadEventEnd - performance.timing.navigationStart,
        domReady: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart
      } : null
    };
  }
}

/**
 * Storage quota monitor
 */
export async function getStorageQuota() {
  if ('storage' in navigator && 'estimate' in navigator.storage) {
    const estimate = await navigator.storage.estimate();
    const usage = estimate.usage || 0;
    const quota = estimate.quota || 0;
    const percentUsed = quota > 0 ? (usage / quota * 100).toFixed(2) : 0;

    return {
      usage,
      quota,
      percentUsed: parseFloat(percentUsed),
      usageMB: (usage / 1048576).toFixed(2),
      quotaMB: (quota / 1048576).toFixed(2),
      available: quota - usage,
      availableMB: ((quota - usage) / 1048576).toFixed(2),
      warning: percentUsed > 80,
      critical: percentUsed > 90
    };
  }

  // Fallback for browsers without Storage API
  return {
    usage: 0,
    quota: 0,
    percentUsed: 0,
    usageMB: '0.00',
    quotaMB: 'Unknown',
    available: 0,
    availableMB: 'Unknown',
    warning: false,
    critical: false,
    unsupported: true
  };
}

/**
 * Get chrome.storage quota info
 */
export async function getChromeStorageQuota() {
  return new Promise((resolve) => {
    chrome.storage.local.getBytesInUse(null, (bytesInUse) => {
      const quota = chrome.storage.local.QUOTA_BYTES || 10485760; // 10MB default
      const percentUsed = (bytesInUse / quota * 100).toFixed(2);

      resolve({
        usage: bytesInUse,
        quota,
        percentUsed: parseFloat(percentUsed),
        usageKB: (bytesInUse / 1024).toFixed(2),
        quotaMB: (quota / 1048576).toFixed(2),
        available: quota - bytesInUse,
        availableKB: ((quota - bytesInUse) / 1024).toFixed(2),
        warning: percentUsed > 80,
        critical: percentUsed > 90
      });
    });
  });
}

/**
 * Lazy load component
 */
export function lazyLoadComponent(importFunc) {
  return React.lazy(importFunc);
}

/**
 * Request idle callback wrapper
 */
export function requestIdleCallbackPolyfill(callback, options) {
  if ('requestIdleCallback' in window) {
    return window.requestIdleCallback(callback, options);
  }
  // Fallback
  return setTimeout(() => callback({ didTimeout: false, timeRemaining: () => 50 }), 1);
}

/**
 * Cancel idle callback wrapper
 */
export function cancelIdleCallbackPolyfill(id) {
  if ('cancelIdleCallback' in window) {
    return window.cancelIdleCallback(id);
  }
  clearTimeout(id);
}

export default {
  debounce,
  throttle,
  memoize,
  PerformanceMonitor,
  getStorageQuota,
  getChromeStorageQuota,
  requestIdleCallbackPolyfill,
  cancelIdleCallbackPolyfill
};
