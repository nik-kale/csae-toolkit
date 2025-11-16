import React, { useState, useEffect } from 'react';

const Settings = ({ theme, onThemeToggle }) => {
  const [settings, setSettings] = useState({
    autoLoadStorage: false,
    historyLimit: 50,
    notificationDuration: 2000,
    enableKeyboardShortcuts: true,
  });

  useEffect(() => {
    // Load settings from chrome.storage
    chrome.storage.local.get(['settings'], (result) => {
      if (result.settings) {
        setSettings({ ...settings, ...result.settings });
      }
    });
  }, []);

  const updateSetting = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    chrome.storage.local.set({ settings: newSettings });
  };

  return (
    <div className="p-4 bg-[#464b54] rounded-lg shadow-md mt-4 text-white">
      <h2 className="text-lg font-semibold mb-4">Settings</h2>

      <div className="space-y-4">
        {/* Theme Toggle */}
        <div className="flex items-center justify-between">
          <div>
            <label className="font-semibold">Theme</label>
            <p className="text-sm text-gray-400">Switch between light and dark mode</p>
          </div>
          <button
            onClick={onThemeToggle}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition duration-300"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
          </button>
        </div>

        {/* Auto Load Storage */}
        <div className="flex items-center justify-between">
          <div>
            <label className="font-semibold">Auto Load Storage</label>
            <p className="text-sm text-gray-400">Automatically load storage data on open</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.autoLoadStorage}
              onChange={(e) => updateSetting('autoLoadStorage', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {/* History Limit */}
        <div className="flex items-center justify-between">
          <div>
            <label className="font-semibold">Copy History Limit</label>
            <p className="text-sm text-gray-400">Maximum number of entries to keep</p>
          </div>
          <select
            value={settings.historyLimit}
            onChange={(e) => updateSetting('historyLimit', parseInt(e.target.value))}
            className="px-3 py-2 bg-gray-700 rounded"
            aria-label="History limit"
          >
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
            <option value="200">200</option>
          </select>
        </div>

        {/* Notification Duration */}
        <div className="flex items-center justify-between">
          <div>
            <label className="font-semibold">Notification Duration</label>
            <p className="text-sm text-gray-400">How long notifications stay visible (ms)</p>
          </div>
          <input
            type="number"
            min="1000"
            max="10000"
            step="500"
            value={settings.notificationDuration}
            onChange={(e) => updateSetting('notificationDuration', parseInt(e.target.value))}
            className="px-3 py-2 bg-gray-700 rounded w-24"
            aria-label="Notification duration"
          />
        </div>

        {/* Keyboard Shortcuts */}
        <div className="flex items-center justify-between">
          <div>
            <label className="font-semibold">Keyboard Shortcuts</label>
            <p className="text-sm text-gray-400">Enable Ctrl/Cmd+K command palette</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.enableKeyboardShortcuts}
              onChange={(e) => updateSetting('enableKeyboardShortcuts', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-600">
        <h3 className="font-semibold mb-2">Keyboard Shortcuts</h3>
        <div className="space-y-1 text-sm text-gray-400">
          <div><kbd className="px-2 py-1 bg-gray-700 rounded">Ctrl/Cmd + K</kbd> - Command Palette</div>
          <div><kbd className="px-2 py-1 bg-gray-700 rounded">Esc</kbd> - Exit Selector Mode</div>
          <div><kbd className="px-2 py-1 bg-gray-700 rounded">Alt + Click</kbd> - Pin Hover Box</div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-600">
        <h3 className="font-semibold mb-2">About</h3>
        <div className="text-sm text-gray-400">
          <p>CSAE Toolkit v4.0.0</p>
          <p>Made with ☕ and ❤️ by Nik Kale</p>
          <p>© 2024-2025 Cisco Systems Inc.</p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
