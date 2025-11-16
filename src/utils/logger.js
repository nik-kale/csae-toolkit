/**
 * Simple logging utility for CSAE Toolkit
 * Only logs in development mode
 */

const isDev = import.meta.env.DEV;

export const logger = {
  log: (...args) => {
    if (isDev) {
      console.log('[CSAE Toolkit]', ...args);
    }
  },

  warn: (...args) => {
    if (isDev) {
      console.warn('[CSAE Toolkit]', ...args);
    }
  },

  error: (...args) => {
    // Always log errors, even in production
    console.error('[CSAE Toolkit]', ...args);
  },

  info: (...args) => {
    if (isDev) {
      console.info('[CSAE Toolkit]', ...args);
    }
  }
};

export default logger;
