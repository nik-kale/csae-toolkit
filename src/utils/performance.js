/**
 * Performance Utilities for CSAE Toolkit v4.0
 *
 * Provides performance optimization functions including:
 * - Debouncing
 * - Throttling
 * - Memoization
 * - Lazy loading
 * - Memory management
 */

// Debounce function - delays execution until after wait period
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

// Throttle function - limits execution to once per wait period
export function throttle(func, wait = 300) {
  let inThrottle;
  let lastResult;

  return function executedFunction(...args) {
    if (!inThrottle) {
      lastResult = func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, wait);
    }
    return lastResult;
  };
}

// Memoization with LRU cache
export function memoize(func, maxSize = 100) {
  const cache = new Map();

  return function memoized(...args) {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      // Move to end (most recently used)
      const value = cache.get(key);
      cache.delete(key);
      cache.set(key, value);
      return value;
    }

    const result = func(...args);

    // If cache is full, remove least recently used
    if (cache.size >= maxSize) {
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }

    cache.set(key, result);
    return result;
  };
}

// Lazy load modules/functions
export function lazyLoad(loader) {
  let loaded = null;
  let loading = null;

  return async function lazyFunction() {
    if (loaded) return loaded;
    if (loading) return loading;

    loading = loader().then(module => {
      loaded = module;
      loading = null;
      return module;
    });

    return loading;
  };
}

// Request Animation Frame throttle for smooth animations
export function rafThrottle(func) {
  let rafId = null;

  return function throttled(...args) {
    if (rafId !== null) return;

    rafId = requestAnimationFrame(() => {
      func(...args);
      rafId = null;
    });
  };
}

// Batch DOM reads and writes to avoid layout thrashing
export class DOMBatcher {
  constructor() {
    this.readQueue = [];
    this.writeQueue = [];
    this.scheduled = false;
  }

  read(callback) {
    this.readQueue.push(callback);
    this.schedule();
  }

  write(callback) {
    this.writeQueue.push(callback);
    this.schedule();
  }

  schedule() {
    if (this.scheduled) return;
    this.scheduled = true;

    requestAnimationFrame(() => {
      // Execute all reads first
      while (this.readQueue.length) {
        const read = this.readQueue.shift();
        read();
      }

      // Then execute all writes
      while (this.writeQueue.length) {
        const write = this.writeQueue.shift();
        write();
      }

      this.scheduled = false;
    });
  }
}

// Memory usage tracker
export class MemoryMonitor {
  constructor(threshold = 50 * 1024 * 1024) { // 50MB default
    this.threshold = threshold;
    this.measurements = [];
  }

  measure() {
    if (performance.memory) {
      const usage = {
        timestamp: Date.now(),
        used: performance.memory.usedJSHeapSize,
        total: performance.memory.totalJSHeapSize,
        limit: performance.memory.jsHeapSizeLimit,
      };

      this.measurements.push(usage);

      // Keep only last 100 measurements
      if (this.measurements.length > 100) {
        this.measurements.shift();
      }

      if (usage.used > this.threshold) {
        console.warn(`Memory usage high: ${(usage.used / 1024 / 1024).toFixed(2)}MB`);
        return { warning: true, usage };
      }

      return { warning: false, usage };
    }

    return null;
  }

  getStats() {
    if (this.measurements.length === 0) return null;

    const latest = this.measurements[this.measurements.length - 1];
    const avg = this.measurements.reduce((sum, m) => sum + m.used, 0) / this.measurements.length;

    return {
      current: latest.used,
      average: avg,
      peak: Math.max(...this.measurements.map(m => m.used)),
      measurements: this.measurements.length,
    };
  }
}

// Virtual scrolling for large lists
export class VirtualScroller {
  constructor(containerHeight, itemHeight, buffer = 3) {
    this.containerHeight = containerHeight;
    this.itemHeight = itemHeight;
    this.buffer = buffer;
  }

  getVisibleRange(scrollTop, totalItems) {
    const visibleCount = Math.ceil(this.containerHeight / this.itemHeight);
    const startIndex = Math.max(0, Math.floor(scrollTop / this.itemHeight) - this.buffer);
    const endIndex = Math.min(totalItems, startIndex + visibleCount + this.buffer * 2);

    return { startIndex, endIndex, visibleCount };
  }
}

// Intersection Observer wrapper for lazy loading images/content
export function createLazyObserver(callback, options = {}) {
  const defaultOptions = {
    root: null,
    rootMargin: '50px',
    threshold: 0.01,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        callback(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { ...defaultOptions, ...options });

  return observer;
}

// Performance mark and measure wrapper
export class PerformanceTracker {
  constructor() {
    this.marks = new Map();
  }

  start(label) {
    const markName = `${label}-start`;
    performance.mark(markName);
    this.marks.set(label, markName);
  }

  end(label) {
    const startMark = this.marks.get(label);
    if (!startMark) {
      console.warn(`No start mark found for: ${label}`);
      return null;
    }

    const endMark = `${label}-end`;
    performance.mark(endMark);

    try {
      performance.measure(label, startMark, endMark);
      const measure = performance.getEntriesByName(label)[0];

      // Clean up
      performance.clearMarks(startMark);
      performance.clearMarks(endMark);
      performance.clearMeasures(label);
      this.marks.delete(label);

      return measure.duration;
    } catch (e) {
      console.error('Performance measurement failed:', e);
      return null;
    }
  }

  getAll() {
    return performance.getEntriesByType('measure');
  }
}

// Idle callback wrapper with fallback
export function requestIdleTask(callback, options = {}) {
  if ('requestIdleCallback' in window) {
    return requestIdleCallback(callback, options);
  } else {
    // Fallback for browsers without requestIdleCallback
    return setTimeout(() => {
      callback({
        didTimeout: false,
        timeRemaining: () => 50,
      });
    }, 1);
  }
}

// Cancel idle task
export function cancelIdleTask(id) {
  if ('cancelIdleCallback' in window) {
    cancelIdleCallback(id);
  } else {
    clearTimeout(id);
  }
}

// Web Worker pool for heavy computations
export class WorkerPool {
  constructor(workerScript, poolSize = navigator.hardwareConcurrency || 4) {
    this.workers = [];
    this.queue = [];
    this.activeWorkers = 0;

    for (let i = 0; i < poolSize; i++) {
      const worker = new Worker(workerScript);
      this.workers.push({ worker, busy: false });
    }
  }

  execute(task) {
    return new Promise((resolve, reject) => {
      const availableWorker = this.workers.find(w => !w.busy);

      if (availableWorker) {
        this.runTask(availableWorker, task, resolve, reject);
      } else {
        this.queue.push({ task, resolve, reject });
      }
    });
  }

  runTask(workerObj, task, resolve, reject) {
    workerObj.busy = true;
    this.activeWorkers++;

    const handleMessage = (e) => {
      workerObj.worker.removeEventListener('message', handleMessage);
      workerObj.worker.removeEventListener('error', handleError);
      workerObj.busy = false;
      this.activeWorkers--;

      resolve(e.data);
      this.processQueue();
    };

    const handleError = (e) => {
      workerObj.worker.removeEventListener('message', handleMessage);
      workerObj.worker.removeEventListener('error', handleError);
      workerObj.busy = false;
      this.activeWorkers--;

      reject(e);
      this.processQueue();
    };

    workerObj.worker.addEventListener('message', handleMessage);
    workerObj.worker.addEventListener('error', handleError);
    workerObj.worker.postMessage(task);
  }

  processQueue() {
    if (this.queue.length === 0) return;

    const availableWorker = this.workers.find(w => !w.busy);
    if (!availableWorker) return;

    const { task, resolve, reject } = this.queue.shift();
    this.runTask(availableWorker, task, resolve, reject);
  }

  terminate() {
    this.workers.forEach(w => w.worker.terminate());
    this.workers = [];
    this.queue = [];
  }
}

// Event delegation helper
export function delegateEvent(parent, eventType, selector, handler) {
  parent.addEventListener(eventType, function(event) {
    const target = event.target.closest(selector);
    if (target && parent.contains(target)) {
      handler.call(target, event);
    }
  });
}

// Cache with expiration
export class CacheWithExpiry {
  constructor(defaultTTL = 5 * 60 * 1000) { // 5 minutes default
    this.cache = new Map();
    this.defaultTTL = defaultTTL;
  }

  set(key, value, ttl = this.defaultTTL) {
    const expiry = Date.now() + ttl;
    this.cache.set(key, { value, expiry });
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  has(key) {
    return this.get(key) !== null;
  }

  delete(key) {
    this.cache.delete(key);
  }

  clear() {
    this.cache.clear();
  }

  prune() {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiry) {
        this.cache.delete(key);
      }
    }
  }
}

export default {
  debounce,
  throttle,
  memoize,
  lazyLoad,
  rafThrottle,
  DOMBatcher,
  MemoryMonitor,
  VirtualScroller,
  createLazyObserver,
  PerformanceTracker,
  requestIdleTask,
  cancelIdleTask,
  WorkerPool,
  delegateEvent,
  CacheWithExpiry,
};
