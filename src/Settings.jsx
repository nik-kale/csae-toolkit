import React, { useState, useEffect } from 'react';

const Settings = ({ onClose }) => {
  const [settings, setSettings] = useState({
    theme: 'dark',
    enableAnalytics: false,
    enableAuditLog: true,
    recentToolsLimit: 10,
    autoSaveHistory: true,
    enableKeyboardShortcuts: true,
    enableNotifications: true,
    gridSize: 10,
    maxUndoSteps: 50,
    enableBatchMode: false,
    floatingButtonPosition: 'bottom-right',
    favoriteTools: [],
    featureFlags: {
      experimentalFeatures: false,
      betaTools: false,
      advancedMode: false,
    }
  });

  const [recentTools, setRecentTools] = useState([]);
  const [auditLog, setAuditLog] = useState([]);

  useEffect(() => {
    // Load settings from chrome.storage
    chrome.storage.local.get(['csaeSettings', 'recentTools', 'auditLog'], (result) => {
      if (result.csaeSettings) {
        setSettings({ ...settings, ...result.csaeSettings });
      }
      if (result.recentTools) {
        setRecentTools(result.recentTools);
      }
      if (result.auditLog) {
        setAuditLog(result.auditLog);
      }
    });
  }, []);

  const updateSetting = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    chrome.storage.local.set({ csaeSettings: newSettings });

    // Log setting change
    logAction('settings_changed', { setting: key, value });
  };

  const updateFeatureFlag = (flag, value) => {
    const newFlags = { ...settings.featureFlags, [flag]: value };
    const newSettings = { ...settings, featureFlags: newFlags };
    setSettings(newSettings);
    chrome.storage.local.set({ csaeSettings: newSettings });
    logAction('feature_flag_changed', { flag, value });
  };

  const logAction = (action, data) => {
    if (!settings.enableAuditLog) return;

    const entry = {
      timestamp: new Date().toISOString(),
      action,
      data,
      userAgent: navigator.userAgent,
    };

    const newLog = [entry, ...auditLog].slice(0, 100); // Keep last 100 entries
    setAuditLog(newLog);
    chrome.storage.local.set({ auditLog: newLog });
  };

  const exportSettings = () => {
    const exportData = {
      version: '4.0.0',
      exportDate: new Date().toISOString(),
      settings,
      recentTools,
      favoriteTools: settings.favoriteTools,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `csae-toolkit-settings-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);

    logAction('settings_exported', {});
  };

  const importSettings = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const imported = JSON.parse(event.target.result);
          if (imported.version && imported.settings) {
            setSettings(imported.settings);
            chrome.storage.local.set({ csaeSettings: imported.settings });
            if (imported.recentTools) {
              setRecentTools(imported.recentTools);
              chrome.storage.local.set({ recentTools: imported.recentTools });
            }
            alert('Settings imported successfully!');
            logAction('settings_imported', { version: imported.version });
          } else {
            alert('Invalid settings file');
          }
        } catch (error) {
          alert('Failed to import settings: ' + error.message);
          logAction('settings_import_failed', { error: error.message });
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const resetSettings = () => {
    if (confirm('Are you sure you want to reset all settings to defaults? This cannot be undone.')) {
      const defaultSettings = {
        theme: 'dark',
        enableAnalytics: false,
        enableAuditLog: true,
        recentToolsLimit: 10,
        autoSaveHistory: true,
        enableKeyboardShortcuts: true,
        enableNotifications: true,
        gridSize: 10,
        maxUndoSteps: 50,
        enableBatchMode: false,
        floatingButtonPosition: 'bottom-right',
        favoriteTools: [],
        featureFlags: {
          experimentalFeatures: false,
          betaTools: false,
          advancedMode: false,
        }
      };
      setSettings(defaultSettings);
      chrome.storage.local.set({ csaeSettings: defaultSettings });
      logAction('settings_reset', {});
      alert('Settings reset to defaults');
    }
  };

  const clearAuditLog = () => {
    if (confirm('Clear all audit log entries?')) {
      setAuditLog([]);
      chrome.storage.local.set({ auditLog: [] });
    }
  };

  const clearRecentTools = () => {
    if (confirm('Clear recent tools history?')) {
      setRecentTools([]);
      chrome.storage.local.set({ recentTools: [] });
    }
  };

  return (
    <div className="p-4 bg-[#464b54] rounded-lg shadow-md mt-4 text-white max-h-[70vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-[#4ADC71]">Settings & Preferences</h2>
        <button
          onClick={onClose}
          className="px-3 py-1 bg-[#649ef5] text-white rounded hover:bg-[#5080d0] text-sm"
        >
          Close
        </button>
      </div>

      {/* Appearance */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-[#4ADC71] mb-3">Appearance</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm">Theme</span>
            <select
              value={settings.theme}
              onChange={(e) => updateSetting('theme', e.target.value)}
              className="px-3 py-1 bg-[#353945] text-white rounded text-sm border border-[#464b54]"
            >
              <option value="dark">Dark</option>
              <option value="light">Light</option>
              <option value="auto">Auto (System)</option>
            </select>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm">Floating Button Position</span>
            <select
              value={settings.floatingButtonPosition}
              onChange={(e) => updateSetting('floatingButtonPosition', e.target.value)}
              className="px-3 py-1 bg-[#353945] text-white rounded text-sm border border-[#464b54]"
            >
              <option value="bottom-right">Bottom Right</option>
              <option value="bottom-left">Bottom Left</option>
              <option value="top-right">Top Right</option>
              <option value="top-left">Top Left</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tools & Features */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-[#4ADC71] mb-3">Tools & Features</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm">Enable Keyboard Shortcuts</span>
            <input
              type="checkbox"
              checked={settings.enableKeyboardShortcuts}
              onChange={(e) => updateSetting('enableKeyboardShortcuts', e.target.checked)}
              className="w-4 h-4"
            />
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm">Enable Notifications</span>
            <input
              type="checkbox"
              checked={settings.enableNotifications}
              onChange={(e) => updateSetting('enableNotifications', e.target.checked)}
              className="w-4 h-4"
            />
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm">Enable Batch Mode</span>
            <input
              type="checkbox"
              checked={settings.enableBatchMode}
              onChange={(e) => updateSetting('enableBatchMode', e.target.checked)}
              className="w-4 h-4"
            />
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm">Grid Size (px)</span>
            <input
              type="number"
              value={settings.gridSize}
              onChange={(e) => updateSetting('gridSize', parseInt(e.target.value))}
              min="5"
              max="50"
              className="w-20 px-2 py-1 bg-[#353945] text-white rounded text-sm border border-[#464b54]"
            />
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm">Max Undo Steps</span>
            <input
              type="number"
              value={settings.maxUndoSteps}
              onChange={(e) => updateSetting('maxUndoSteps', parseInt(e.target.value))}
              min="10"
              max="100"
              className="w-20 px-2 py-1 bg-[#353945] text-white rounded text-sm border border-[#464b54]"
            />
          </div>
        </div>
      </div>

      {/* History & Privacy */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-[#4ADC71] mb-3">History & Privacy</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm">Auto-Save History</span>
            <input
              type="checkbox"
              checked={settings.autoSaveHistory}
              onChange={(e) => updateSetting('autoSaveHistory', e.target.checked)}
              className="w-4 h-4"
            />
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm">Recent Tools Limit</span>
            <input
              type="number"
              value={settings.recentToolsLimit}
              onChange={(e) => updateSetting('recentToolsLimit', parseInt(e.target.value))}
              min="5"
              max="50"
              className="w-20 px-2 py-1 bg-[#353945] text-white rounded text-sm border border-[#464b54]"
            />
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm">Enable Audit Logging</span>
            <input
              type="checkbox"
              checked={settings.enableAuditLog}
              onChange={(e) => updateSetting('enableAuditLog', e.target.checked)}
              className="w-4 h-4"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={clearRecentTools}
              className="flex-1 px-3 py-2 bg-[#44696d] text-white rounded hover:bg-red-600 text-xs"
            >
              Clear Recent Tools
            </button>
            <button
              onClick={clearAuditLog}
              className="flex-1 px-3 py-2 bg-[#44696d] text-white rounded hover:bg-red-600 text-xs"
            >
              Clear Audit Log
            </button>
          </div>
        </div>
      </div>

      {/* Feature Flags */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-[#4ADC71] mb-3">Advanced Features</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm">Experimental Features</span>
            <input
              type="checkbox"
              checked={settings.featureFlags.experimentalFeatures}
              onChange={(e) => updateFeatureFlag('experimentalFeatures', e.target.checked)}
              className="w-4 h-4"
            />
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm">Beta Tools</span>
            <input
              type="checkbox"
              checked={settings.featureFlags.betaTools}
              onChange={(e) => updateFeatureFlag('betaTools', e.target.checked)}
              className="w-4 h-4"
            />
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm">Advanced Mode</span>
            <input
              type="checkbox"
              checked={settings.featureFlags.advancedMode}
              onChange={(e) => updateFeatureFlag('advancedMode', e.target.checked)}
              className="w-4 h-4"
            />
          </div>
        </div>
      </div>

      {/* Import/Export */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-[#4ADC71] mb-3">Backup & Restore</h3>
        <div className="flex gap-2">
          <button
            onClick={exportSettings}
            className="flex-1 px-4 py-2 bg-[#649ef5] text-white rounded hover:bg-[#5080d0] text-sm font-semibold"
          >
            Export Settings
          </button>
          <button
            onClick={importSettings}
            className="flex-1 px-4 py-2 bg-[#649ef5] text-white rounded hover:bg-[#5080d0] text-sm font-semibold"
          >
            Import Settings
          </button>
        </div>
      </div>

      {/* Recent Tools */}
      {recentTools.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-[#4ADC71] mb-3">Recent Tools</h3>
          <div className="space-y-2">
            {recentTools.slice(0, 5).map((tool, idx) => (
              <div key={idx} className="flex justify-between items-center text-sm bg-[#353945] px-3 py-2 rounded">
                <span>{tool.name}</span>
                <span className="text-xs text-gray-400">{new Date(tool.timestamp).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reset */}
      <div>
        <button
          onClick={resetSettings}
          className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm font-semibold"
        >
          Reset All Settings to Defaults
        </button>
      </div>

      <div className="mt-4 text-xs text-gray-400 text-center">
        CSAE Toolkit v4.0.0 - Enterprise Edition
      </div>
    </div>
  );
};

export default Settings;
