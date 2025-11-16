/**
 * Theme Management System for CSAE Toolkit v4.0
 *
 * Supports dark, light, and auto (system preference) themes
 * Persists theme selection to Chrome storage
 */

class ThemeManager {
  constructor() {
    this.currentTheme = 'dark';
    this.listeners = new Set();
    this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    // Initialize theme
    this.init();
  }

  /**
   * Initialize theme from storage or system preference
   */
  async init() {
    try {
      const result = await chrome.storage.local.get(['theme']);
      const savedTheme = result.theme || 'dark';
      this.setTheme(savedTheme);

      // Listen for system theme changes
      this.mediaQuery.addEventListener('change', (e) => {
        if (this.currentTheme === 'auto') {
          this.applyTheme(e.matches ? 'dark' : 'light');
        }
      });
    } catch (error) {
      console.error('Failed to load theme:', error);
      this.setTheme('dark');
    }
  }

  /**
   * Set theme
   * @param {string} theme - 'dark', 'light', or 'auto'
   */
  async setTheme(theme) {
    if (!['dark', 'light', 'auto'].includes(theme)) {
      console.error('Invalid theme:', theme);
      return;
    }

    this.currentTheme = theme;

    // Determine actual theme to apply
    let actualTheme = theme;
    if (theme === 'auto') {
      actualTheme = this.mediaQuery.matches ? 'dark' : 'light';
    }

    this.applyTheme(actualTheme);

    // Save to storage
    try {
      await chrome.storage.local.set({ theme });
    } catch (error) {
      console.error('Failed to save theme:', error);
    }

    // Notify listeners
    this.notifyListeners();
  }

  /**
   * Apply theme to document
   * @param {string} theme - 'dark' or 'light'
   */
  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);

    // Update CSS variables
    if (theme === 'dark') {
      this.applyDarkTheme();
    } else {
      this.applyLightTheme();
    }
  }

  /**
   * Apply dark theme colors
   */
  applyDarkTheme() {
    const root = document.documentElement;
    root.style.setProperty('--bg-primary', '#23282e');
    root.style.setProperty('--bg-secondary', '#282A33');
    root.style.setProperty('--bg-tertiary', '#353945');
    root.style.setProperty('--bg-hover', '#464b54');
    root.style.setProperty('--text-primary', '#ffffff');
    root.style.setProperty('--text-secondary', '#9ca3af');
    root.style.setProperty('--text-tertiary', '#6b7280');
    root.style.setProperty('--accent-primary', '#649ef5');
    root.style.setProperty('--accent-primary-hover', '#5080d0');
    root.style.setProperty('--accent-secondary', '#44696d');
    root.style.setProperty('--accent-success', '#4ADC71');
    root.style.setProperty('--border-color', '#4b5563');
    root.style.setProperty('--shadow', 'rgba(0, 0, 0, 0.3)');
  }

  /**
   * Apply light theme colors
   */
  applyLightTheme() {
    const root = document.documentElement;
    root.style.setProperty('--bg-primary', '#ffffff');
    root.style.setProperty('--bg-secondary', '#f3f4f6');
    root.style.setProperty('--bg-tertiary', '#e5e7eb');
    root.style.setProperty('--bg-hover', '#d1d5db');
    root.style.setProperty('--text-primary', '#111827');
    root.style.setProperty('--text-secondary', '#4b5563');
    root.style.setProperty('--text-tertiary', '#6b7280');
    root.style.setProperty('--accent-primary', '#2563eb');
    root.style.setProperty('--accent-primary-hover', '#1d4ed8');
    root.style.setProperty('--accent-secondary', '#0891b2');
    root.style.setProperty('--accent-success', '#059669');
    root.style.setProperty('--border-color', '#d1d5db');
    root.style.setProperty('--shadow', 'rgba(0, 0, 0, 0.1)');
  }

  /**
   * Get current theme
   * @returns {string}
   */
  getTheme() {
    return this.currentTheme;
  }

  /**
   * Get actual applied theme (resolves 'auto')
   * @returns {string}
   */
  getAppliedTheme() {
    if (this.currentTheme === 'auto') {
      return this.mediaQuery.matches ? 'dark' : 'light';
    }
    return this.currentTheme;
  }

  /**
   * Toggle between dark and light
   */
  toggle() {
    const current = this.getAppliedTheme();
    this.setTheme(current === 'dark' ? 'light' : 'dark');
  }

  /**
   * Add listener for theme changes
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
        listener(this.currentTheme, this.getAppliedTheme());
      } catch (error) {
        console.error('Theme listener error:', error);
      }
    });
  }
}

// Singleton instance
const themeManager = new ThemeManager();

/**
 * React hook for theme management
 * @returns {Object}
 */
export function useTheme() {
  const [theme, setTheme] = React.useState(themeManager.getTheme());
  const [appliedTheme, setAppliedTheme] = React.useState(themeManager.getAppliedTheme());

  React.useEffect(() => {
    const listener = (newTheme, newAppliedTheme) => {
      setTheme(newTheme);
      setAppliedTheme(newAppliedTheme);
    };

    themeManager.addListener(listener);

    return () => {
      themeManager.removeListener(listener);
    };
  }, []);

  return {
    theme,
    appliedTheme,
    setTheme: (newTheme) => themeManager.setTheme(newTheme),
    toggle: () => themeManager.toggle(),
  };
}

/**
 * Theme Toggle Button Component
 */
export function ThemeToggle() {
  const { theme, appliedTheme, setTheme } = useTheme();

  const themeOptions = [
    { value: 'dark', label: 'Dark', icon: '🌙' },
    { value: 'light', label: 'Light', icon: '☀️' },
    { value: 'auto', label: 'Auto', icon: '🌓' },
  ];

  return (
    <div className="theme-toggle flex items-center gap-2">
      {themeOptions.map(option => (
        <button
          key={option.value}
          onClick={() => setTheme(option.value)}
          className={`px-3 py-2 rounded transition duration-300 text-sm font-semibold ${
            theme === option.value
              ? 'bg-[#649ef5] text-white'
              : 'bg-[#353945] text-gray-300 hover:bg-[#464b54]'
          }`}
          title={`${option.label} theme`}
          aria-label={`${option.label} theme`}
        >
          <span className="mr-1">{option.icon}</span>
          {option.label}
        </button>
      ))}
    </div>
  );
}

/**
 * Compact Theme Toggle Button (icon only)
 */
export function CompactThemeToggle() {
  const { appliedTheme, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      className="p-2 rounded bg-[#353945] hover:bg-[#464b54] transition duration-300"
      title={`Switch to ${appliedTheme === 'dark' ? 'light' : 'dark'} theme`}
      aria-label="Toggle theme"
    >
      {appliedTheme === 'dark' ? '☀️' : '🌙'}
    </button>
  );
}

export default themeManager;
export { themeManager };
