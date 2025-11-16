/**
 * Undo/Redo System for CSAE Toolkit v4.0
 *
 * Tracks element manipulation history and allows undo/redo operations
 * Supports element deletion, hiding, duplication, CSS changes, and text edits
 */

class UndoRedoManager {
  constructor(maxSteps = 50) {
    this.maxSteps = maxSteps;
    this.history = [];
    this.currentIndex = -1;
    this.listeners = new Set();
  }

  /**
   * Push a new action to history
   * @param {Object} action - Action object with type, data, and undo/redo functions
   */
  push(action) {
    // Remove any actions after current index (redo history)
    this.history = this.history.slice(0, this.currentIndex + 1);

    // Add new action
    this.history.push({
      timestamp: Date.now(),
      ...action,
    });

    // Trim history if exceeds max steps
    if (this.history.length > this.maxSteps) {
      this.history.shift();
    } else {
      this.currentIndex++;
    }

    this.notifyListeners();
  }

  /**
   * Undo the last action
   * @returns {boolean} - True if undo was successful
   */
  undo() {
    if (!this.canUndo()) {
      console.warn('Nothing to undo');
      return false;
    }

    const action = this.history[this.currentIndex];

    try {
      if (typeof action.undo === 'function') {
        action.undo();
        this.currentIndex--;
        this.notifyListeners();
        return true;
      } else {
        console.error('Action does not have an undo function');
        return false;
      }
    } catch (error) {
      console.error('Undo failed:', error);
      return false;
    }
  }

  /**
   * Redo the next action
   * @returns {boolean} - True if redo was successful
   */
  redo() {
    if (!this.canRedo()) {
      console.warn('Nothing to redo');
      return false;
    }

    this.currentIndex++;
    const action = this.history[this.currentIndex];

    try {
      if (typeof action.redo === 'function') {
        action.redo();
        this.notifyListeners();
        return true;
      } else {
        console.error('Action does not have a redo function');
        return false;
      }
    } catch (error) {
      console.error('Redo failed:', error);
      this.currentIndex--;
      return false;
    }
  }

  /**
   * Check if undo is available
   * @returns {boolean}
   */
  canUndo() {
    return this.currentIndex >= 0;
  }

  /**
   * Check if redo is available
   * @returns {boolean}
   */
  canRedo() {
    return this.currentIndex < this.history.length - 1;
  }

  /**
   * Clear all history
   */
  clear() {
    this.history = [];
    this.currentIndex = -1;
    this.notifyListeners();
  }

  /**
   * Get current history state
   * @returns {Object}
   */
  getState() {
    return {
      canUndo: this.canUndo(),
      canRedo: this.canRedo(),
      historyLength: this.history.length,
      currentIndex: this.currentIndex,
      history: this.history.map(action => ({
        type: action.type,
        description: action.description,
        timestamp: action.timestamp,
      })),
    };
  }

  /**
   * Add listener for state changes
   * @param {Function} listener
   */
  addListener(listener) {
    this.listeners.add(listener);
  }

  /**
   * Remove listener
   * @param {Function} listener
   */
  removeListener(listener) {
    this.listeners.delete(listener);
  }

  /**
   * Notify all listeners of state change
   */
  notifyListeners() {
    const state = this.getState();
    this.listeners.forEach(listener => {
      try {
        listener(state);
      } catch (error) {
        console.error('Listener error:', error);
      }
    });
  }
}

// Singleton instance
const undoRedoManager = new UndoRedoManager();

/**
 * Helper functions for creating common actions
 */

/**
 * Create element deletion action
 * @param {HTMLElement} element
 * @returns {Object}
 */
export function createDeleteAction(element) {
  const parent = element.parentNode;
  const nextSibling = element.nextSibling;
  const elementClone = element.cloneNode(true);

  return {
    type: 'delete',
    description: `Delete ${element.tagName.toLowerCase()}`,
    undo: () => {
      if (nextSibling) {
        parent.insertBefore(elementClone, nextSibling);
      } else {
        parent.appendChild(elementClone);
      }
    },
    redo: () => {
      const targetElement = nextSibling
        ? nextSibling.previousSibling
        : parent.lastChild;
      if (targetElement) {
        parent.removeChild(targetElement);
      }
    },
  };
}

/**
 * Create element hide action
 * @param {HTMLElement} element
 * @returns {Object}
 */
export function createHideAction(element) {
  const originalDisplay = element.style.display;

  return {
    type: 'hide',
    description: `Hide ${element.tagName.toLowerCase()}`,
    undo: () => {
      element.style.display = originalDisplay;
    },
    redo: () => {
      element.style.display = 'none';
    },
  };
}

/**
 * Create element duplicate action
 * @param {HTMLElement} element
 * @param {HTMLElement} duplicate
 * @returns {Object}
 */
export function createDuplicateAction(element, duplicate) {
  return {
    type: 'duplicate',
    description: `Duplicate ${element.tagName.toLowerCase()}`,
    undo: () => {
      if (duplicate && duplicate.parentNode) {
        duplicate.parentNode.removeChild(duplicate);
      }
    },
    redo: () => {
      if (element.parentNode) {
        const newDuplicate = element.cloneNode(true);
        element.parentNode.insertBefore(newDuplicate, element.nextSibling);
      }
    },
  };
}

/**
 * Create CSS change action
 * @param {HTMLElement} element
 * @param {Object} oldStyles
 * @param {Object} newStyles
 * @returns {Object}
 */
export function createCSSChangeAction(element, oldStyles, newStyles) {
  return {
    type: 'css',
    description: `CSS change on ${element.tagName.toLowerCase()}`,
    undo: () => {
      Object.keys(newStyles).forEach(prop => {
        element.style[prop] = oldStyles[prop] || '';
      });
    },
    redo: () => {
      Object.keys(newStyles).forEach(prop => {
        element.style[prop] = newStyles[prop];
      });
    },
  };
}

/**
 * Create text edit action
 * @param {HTMLElement} element
 * @param {string} oldText
 * @param {string} newText
 * @returns {Object}
 */
export function createTextEditAction(element, oldText, newText) {
  return {
    type: 'text',
    description: `Text edit on ${element.tagName.toLowerCase()}`,
    undo: () => {
      element.textContent = oldText;
    },
    redo: () => {
      element.textContent = newText;
    },
  };
}

/**
 * Create attribute change action
 * @param {HTMLElement} element
 * @param {string} attribute
 * @param {string} oldValue
 * @param {string} newValue
 * @returns {Object}
 */
export function createAttributeChangeAction(element, attribute, oldValue, newValue) {
  return {
    type: 'attribute',
    description: `Change ${attribute} on ${element.tagName.toLowerCase()}`,
    undo: () => {
      if (oldValue === null) {
        element.removeAttribute(attribute);
      } else {
        element.setAttribute(attribute, oldValue);
      }
    },
    redo: () => {
      if (newValue === null) {
        element.removeAttribute(attribute);
      } else {
        element.setAttribute(attribute, newValue);
      }
    },
  };
}

/**
 * Keyboard shortcuts for undo/redo
 * Ctrl+Z / Cmd+Z for undo
 * Ctrl+Shift+Z / Cmd+Shift+Z for redo
 */
export function setupUndoRedoKeyboardShortcuts() {
  document.addEventListener('keydown', (event) => {
    // Check for Ctrl/Cmd + Z (undo)
    if ((event.ctrlKey || event.metaKey) && event.key === 'z' && !event.shiftKey) {
      event.preventDefault();
      if (undoRedoManager.undo()) {
        showUndoRedoNotification('Undo successful');
      }
    }

    // Check for Ctrl/Cmd + Shift + Z (redo)
    if ((event.ctrlKey || event.metaKey) && event.key === 'z' && event.shiftKey) {
      event.preventDefault();
      if (undoRedoManager.redo()) {
        showUndoRedoNotification('Redo successful');
      }
    }
  });
}

/**
 * Show notification for undo/redo actions
 * @param {string} message
 */
function showUndoRedoNotification(message) {
  // Create temporary notification
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #282A33;
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    z-index: 10000;
    font-family: Arial, sans-serif;
    font-size: 14px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
    animation: slideIn 0.3s ease-out;
  `;
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-in';
    setTimeout(() => notification.remove(), 300);
  }, 2000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

export default undoRedoManager;
export { undoRedoManager };
