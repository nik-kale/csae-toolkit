/**
 * Tool History, Search, and Favorites Management for CSAE Toolkit v4.0
 *
 * Tracks recently used tools, allows tool search, and manages favorites
 * Persists data to Chrome storage
 */

class ToolHistoryManager {
  constructor(maxRecentTools = 10) {
    this.maxRecentTools = maxRecentTools;
    this.recentTools = [];
    this.favoriteTools = [];
    this.listeners = new Set();
    this.init();
  }

  /**
   * Initialize from Chrome storage
   */
  async init() {
    try {
      const result = await chrome.storage.local.get(['recentTools', 'favoriteTools']);
      this.recentTools = result.recentTools || [];
      this.favoriteTools = result.favoriteTools || [];
      this.notifyListeners();
    } catch (error) {
      console.error('Failed to load tool history:', error);
    }
  }

  /**
   * Record tool usage
   * @param {Object} tool - Tool object with id, name, category, icon
   */
  async recordToolUsage(tool) {
    // Remove existing entry if present
    this.recentTools = this.recentTools.filter(t => t.id !== tool.id);

    // Add to beginning
    this.recentTools.unshift({
      ...tool,
      timestamp: Date.now(),
      usageCount: (this.getToolUsageCount(tool.id) || 0) + 1,
    });

    // Trim to max size
    if (this.recentTools.length > this.maxRecentTools) {
      this.recentTools = this.recentTools.slice(0, this.maxRecentTools);
    }

    // Save to storage
    await this.saveRecentTools();
    this.notifyListeners();
  }

  /**
   * Get usage count for a tool
   * @param {string} toolId
   * @returns {number}
   */
  getToolUsageCount(toolId) {
    const tool = this.recentTools.find(t => t.id === toolId);
    return tool ? tool.usageCount : 0;
  }

  /**
   * Get recent tools
   * @param {number} limit - Maximum number of tools to return
   * @returns {Array}
   */
  getRecentTools(limit = null) {
    const tools = limit ? this.recentTools.slice(0, limit) : this.recentTools;
    return tools;
  }

  /**
   * Clear recent tools
   */
  async clearRecentTools() {
    this.recentTools = [];
    await this.saveRecentTools();
    this.notifyListeners();
  }

  /**
   * Toggle favorite status of a tool
   * @param {Object} tool
   */
  async toggleFavorite(tool) {
    const index = this.favoriteTools.findIndex(t => t.id === tool.id);

    if (index >= 0) {
      // Remove from favorites
      this.favoriteTools.splice(index, 1);
    } else {
      // Add to favorites
      this.favoriteTools.push({
        ...tool,
        favoritedAt: Date.now(),
      });
    }

    await this.saveFavoriteTools();
    this.notifyListeners();
  }

  /**
   * Check if tool is favorited
   * @param {string} toolId
   * @returns {boolean}
   */
  isFavorite(toolId) {
    return this.favoriteTools.some(t => t.id === toolId);
  }

  /**
   * Get favorite tools
   * @returns {Array}
   */
  getFavoriteTools() {
    return [...this.favoriteTools];
  }

  /**
   * Clear all favorites
   */
  async clearFavorites() {
    this.favoriteTools = [];
    await this.saveFavoriteTools();
    this.notifyListeners();
  }

  /**
   * Save recent tools to storage
   */
  async saveRecentTools() {
    try {
      await chrome.storage.local.set({ recentTools: this.recentTools });
    } catch (error) {
      console.error('Failed to save recent tools:', error);
    }
  }

  /**
   * Save favorite tools to storage
   */
  async saveFavoriteTools() {
    try {
      await chrome.storage.local.set({ favoriteTools: this.favoriteTools });
    } catch (error) {
      console.error('Failed to save favorite tools:', error);
    }
  }

  /**
   * Add listener for changes
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
   * Notify all listeners
   */
  notifyListeners() {
    this.listeners.forEach(listener => {
      try {
        listener({
          recentTools: this.recentTools,
          favoriteTools: this.favoriteTools,
        });
      } catch (error) {
        console.error('Tool history listener error:', error);
      }
    });
  }
}

/**
 * All available tools in the toolkit
 */
export const ALL_TOOLS = [
  // Inspector Tools
  { id: 'css-selector', name: 'CSS Selector Grabber', category: 'inspector', icon: '🎯', shortcut: 'Ctrl+Shift+C' },
  { id: 'color-picker', name: 'Color Picker', category: 'inspector', icon: '🎨', shortcut: 'Ctrl+Shift+P' },
  { id: 'color-palette', name: 'View Color Palette', category: 'inspector', icon: '🎨' },
  { id: 'measure-elements', name: 'Measure Elements', category: 'inspector', icon: '📏' },
  { id: 'seo-inspector', name: 'SEO Meta Inspector', category: 'inspector', icon: '🔍' },
  { id: 'extract-images', name: 'Extract Images', category: 'inspector', icon: '🖼️' },
  { id: 'export-element', name: 'Export Element HTML/CSS', category: 'inspector', icon: '📤' },
  { id: 'performance-metrics', name: 'Performance Metrics', category: 'inspector', icon: '📊' },

  // Editor Tools
  { id: 'live-css-editor', name: 'Live CSS Editor', category: 'editor', icon: '💅', shortcut: 'Ctrl+Shift+E' },
  { id: 'edit-text', name: 'Edit Text Content', category: 'editor', icon: '✏️' },
  { id: 'delete-element', name: 'Delete Element', category: 'editor', icon: '🗑️' },
  { id: 'hide-element', name: 'Hide Element', category: 'editor', icon: '👁️' },
  { id: 'duplicate-element', name: 'Duplicate Element', category: 'editor', icon: '📋' },
  { id: 'highlight-element', name: 'Highlight Element', category: 'editor', icon: '🖍️' },
  { id: 'change-font', name: 'Change Page Font', category: 'editor', icon: '🔤' },

  // Layout Tools
  { id: 'grid-overlay', name: 'Toggle Grid Overlay', category: 'layout', icon: '📐', shortcut: 'Ctrl+Shift+G' },
  { id: 'outline-elements', name: 'Outline All Elements', category: 'layout', icon: '🔳', shortcut: 'Ctrl+Shift+O' },
  { id: 'screenshot', name: 'Take Screenshot', category: 'layout', icon: '📸', shortcut: 'Ctrl+Shift+S' },
  { id: 'responsive-tester', name: 'Responsive Tester', category: 'layout', icon: '📱' },

  // Storage Tools
  { id: 'storage-manager', name: 'Storage Manager', category: 'storage', icon: '💾' },
  { id: 'indexeddb-manager', name: 'IndexedDB & Cache Manager', category: 'storage', icon: '🗄️' },
  { id: 'view-config', name: 'View CSAE Config', category: 'storage', icon: '⚙️' },
];

/**
 * Search tools by query
 * @param {string} query
 * @returns {Array}
 */
export function searchTools(query) {
  if (!query || query.trim() === '') {
    return ALL_TOOLS;
  }

  const normalizedQuery = query.toLowerCase().trim();

  return ALL_TOOLS.filter(tool => {
    return (
      tool.name.toLowerCase().includes(normalizedQuery) ||
      tool.category.toLowerCase().includes(normalizedQuery) ||
      (tool.shortcut && tool.shortcut.toLowerCase().includes(normalizedQuery))
    );
  });
}

/**
 * Get tools by category
 * @param {string} category
 * @returns {Array}
 */
export function getToolsByCategory(category) {
  return ALL_TOOLS.filter(tool => tool.category === category);
}

/**
 * Get tool by ID
 * @param {string} toolId
 * @returns {Object|null}
 */
export function getToolById(toolId) {
  return ALL_TOOLS.find(tool => tool.id === toolId) || null;
}

/**
 * Get tool statistics
 * @param {Array} recentTools
 * @returns {Object}
 */
export function getToolStatistics(recentTools) {
  const usageByCategory = {};
  const usageByTool = {};
  let totalUsage = 0;

  recentTools.forEach(tool => {
    // By category
    if (!usageByCategory[tool.category]) {
      usageByCategory[tool.category] = 0;
    }
    usageByCategory[tool.category] += tool.usageCount || 1;

    // By tool
    usageByTool[tool.id] = tool.usageCount || 1;
    totalUsage += tool.usageCount || 1;
  });

  return {
    totalUsage,
    usageByCategory,
    usageByTool,
    mostUsedCategory: Object.keys(usageByCategory).reduce((a, b) =>
      usageByCategory[a] > usageByCategory[b] ? a : b
    , 'inspector'),
    mostUsedTool: Object.keys(usageByTool).reduce((a, b) =>
      usageByTool[a] > usageByTool[b] ? a : b
    , null),
  };
}

// Singleton instance
const toolHistoryManager = new ToolHistoryManager();

export default toolHistoryManager;
export { toolHistoryManager };
