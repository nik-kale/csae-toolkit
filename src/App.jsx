import React, { useState, useEffect } from 'react';
import UserGuide from './UserGuide';
import StorageManager from './StorageManager';
import DateTime from './DateTime';
import CopyHistory from './components/CopyHistory';
import CommandPalette from './components/CommandPalette';
import Settings from './components/Settings';
import BackupRestore from './components/BackupRestore';
import StorageDiff from './components/StorageDiff';
import Onboarding from './components/Onboarding';
import PerformanceMonitor from './components/PerformanceMonitor';

const App = () => {
  const [showGuide, setShowGuide] = useState(false);
  const [showStorageManager, setShowStorageManager] = useState(false);
  const [showCopyHistory, setShowCopyHistory] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showBackupRestore, setShowBackupRestore] = useState(false);
  const [showStorageDiff, setShowStorageDiff] = useState(false);
  const [showPerformanceMonitor, setShowPerformanceMonitor] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Check onboarding status and load theme
  useEffect(() => {
    chrome.storage.local.get(['theme', 'onboardingCompleted'], (result) => {
      if (result.theme) {
        setTheme(result.theme);
      }
      // Show onboarding for first-time users
      if (!result.onboardingCompleted) {
        setShowOnboarding(true);
      }
    });
  }, []);

  // Save theme to storage
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    chrome.storage.local.set({ theme: newTheme });
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl/Cmd + K for command palette
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setShowCommandPalette(prev => !prev);
      }
      // Escape to close command palette
      if (e.key === 'Escape' && showCommandPalette) {
        setShowCommandPalette(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showCommandPalette]);

  useEffect(() => {
    if (window.chrome && chrome.devtools) {
      // DevTools context
      chrome.devtools.inspectedWindow.eval(
        `(${injectContentScript.toString()})();`,
        (result, isException) => {
          if (isException) {
            // Error will be caught by error boundary if critical
          }
        }
      );
    }
  }, []);

  const toggleHover = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0) {
        chrome.scripting.executeScript(
          {
            target: { tabId: tabs[0].id },
            files: ['content.js'],
          },
          () => {
            chrome.tabs.sendMessage(tabs[0].id, { action: 'toggleHover', hoverActive: true }, (response) => {
              if (!chrome.runtime.lastError && response && response.status === 'success') {
                window.close(); // Close the popup window
              }
            });
          }
        );
      }
    });
  };

  const viewConfig = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0) {
        chrome.scripting.executeScript(
          {
            target: { tabId: tabs[0].id },
            files: ['content.js'],
          },
          () => {
            chrome.tabs.sendMessage(tabs[0].id, { action: 'viewConfig' });
          }
        );
      }
    });
  };

  const navigateToURL = (url) => {
    chrome.tabs.create({ url });
  };

  const handleColorPicker = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0) {
        chrome.scripting.executeScript(
          {
            target: { tabId: tabs[0].id },
            files: ['content.js'],
          },
          () => {
            chrome.tabs.sendMessage(tabs[0].id, { action: 'pickColor' });
          }
        );
      }
    });
  };

  // Handle command palette actions
  const handleCommand = (action) => {
    switch (action) {
      case 'toggleHover':
        toggleHover();
        break;
      case 'viewConfig':
        viewConfig();
        break;
      case 'colorPicker':
        handleColorPicker();
        break;
      case 'toggleStorage':
        setShowStorageManager(!showStorageManager);
        break;
      case 'toggleHistory':
        setShowCopyHistory(!showCopyHistory);
        break;
      case 'toggleSettings':
        setShowSettings(!showSettings);
        break;
      case 'toggleGuide':
        setShowGuide(!showGuide);
        break;
      case 'toggleBackup':
        setShowBackupRestore(!showBackupRestore);
        break;
      case 'toggleDiff':
        setShowStorageDiff(!showStorageDiff);
        break;
      case 'togglePerformance':
        setShowPerformanceMonitor(!showPerformanceMonitor);
        break;
      case 'csaeWeb':
        navigateToURL('https://supportassistant.cisco.com/extension');
        break;
      case 'adminPortal':
        navigateToURL('https://go2.cisco.com/csae-admin-portal');
        break;
      case 'showOnboarding':
        setShowOnboarding(true);
        break;
      default:
        break;
    }
  };

  // Theme colors
  const themeColors = {
    dark: {
      bg: '#23282e',
      secondary: '#464b54',
    },
    light: {
      bg: '#f5f5f5',
      secondary: '#e0e0e0',
    }
  };

  return (
    <div
      className="App p-4 shadow-lg w-full h-screen overflow-y-auto"
      style={{
        fontFamily: 'Inter, Arial, sans-serif',
        backgroundColor: themeColors[theme].bg,
        color: theme === 'dark' ? 'white' : 'black'
      }}
    >
      {/* Onboarding (first-time users) */}
      {showOnboarding && (
        <Onboarding onComplete={() => setShowOnboarding(false)} />
      )}

      {showCommandPalette && (
        <CommandPalette
          onClose={() => setShowCommandPalette(false)}
          onCommand={handleCommand}
        />
      )}

      <div className="max-w-96 mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-center flex-1">
            CSAE Toolkit 🛠️
          </h1>
          <button
            onClick={() => setShowCommandPalette(true)}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm"
            aria-label="Open command palette"
            title="Ctrl/Cmd+K"
          >
            ⌘K
          </button>
        </div>

        <DateTime />
        <img src="background.png" alt="Cisco Support Assistant Extension Toolkit" className="w-96 h-76 mx-auto" />

        <div className="flex flex-col space-y-4 items-center">
          <button
            className="px-4 py-2 w-full bg-[#649ef5] text-white rounded hover:bg-[#44696d] transition duration-300 text-sm font-semibold"
            onClick={toggleHover}
            aria-label="Grab CSS Selector"
          >
            Grab CSS Selector
          </button>
          <button
            className="px-4 py-2 bg-[#649ef5] text-white rounded hover:bg-[#44696d] transition duration-300 w-full text-sm font-semibold"
            onClick={viewConfig}
            aria-label="View CSAE Config"
          >
            View CSAE Config
          </button>
          <button
            className="px-4 py-2 w-full bg-[#649ef5] text-white rounded hover:bg-[#44696d] transition duration-300 text-sm font-semibold"
            onClick={handleColorPicker}
            aria-label="Utilize Color Picker"
          >
            Utilize Color Picker
          </button>
          <button
            className="px-4 py-2 w-full bg-[#649ef5] text-white rounded hover:bg-[#44696d] transition duration-300 text-sm font-semibold"
            onClick={() => navigateToURL('https://supportassistant.cisco.com/extension')}
            aria-label="Navigate to CSAE Web"
          >
            Navigate to CSAE Web
          </button>
          <button
            className="px-4 py-2 w-full bg-[#649ef5] text-white rounded hover:bg-[#44696d] transition duration-300 text-sm font-semibold"
            onClick={() => navigateToURL('https://go2.cisco.com/csae-admin-portal')}
            aria-label="Launch Admin Portal"
          >
            Launch Admin Portal
          </button>
          <button
            className="px-4 py-2 bg-[#649ef5] text-white rounded hover:bg-[#44696d] transition duration-300 w-full text-sm font-semibold"
            onClick={() => setShowStorageManager(!showStorageManager)}
            aria-label="Toggle Storage Manager"
          >
            {showStorageManager ? 'Hide Storage Manager' : 'Show Storage Manager'}
          </button>
          <button
            className="px-4 py-2 bg-[#649ef5] text-white rounded hover:bg-[#44696d] transition duration-300 w-full text-sm font-semibold"
            onClick={() => setShowCopyHistory(!showCopyHistory)}
            aria-label="Toggle Copy History"
          >
            {showCopyHistory ? 'Hide Copy History' : 'Show Copy History'}
          </button>
          <button
            className="px-4 py-2 bg-[#649ef5] text-white rounded hover:bg-[#44696d] transition duration-300 w-full text-sm font-semibold"
            onClick={() => setShowBackupRestore(!showBackupRestore)}
            aria-label="Toggle Backup & Restore"
          >
            <span className="text-xs bg-green-600 px-2 py-1 rounded mr-2">NEW</span>
            {showBackupRestore ? 'Hide Backup & Restore' : 'Backup & Restore'}
          </button>
          <button
            className="px-4 py-2 bg-[#649ef5] text-white rounded hover:bg-[#44696d] transition duration-300 w-full text-sm font-semibold"
            onClick={() => setShowStorageDiff(!showStorageDiff)}
            aria-label="Toggle Storage Diff"
          >
            <span className="text-xs bg-green-600 px-2 py-1 rounded mr-2">NEW</span>
            {showStorageDiff ? 'Hide Storage Diff' : 'Storage Diff Tool'}
          </button>
          <button
            className="px-4 py-2 bg-[#649ef5] text-white rounded hover:bg-[#44696d] transition duration-300 w-full text-sm font-semibold"
            onClick={() => setShowPerformanceMonitor(!showPerformanceMonitor)}
            aria-label="Toggle Performance Monitor"
          >
            <span className="text-xs bg-green-600 px-2 py-1 rounded mr-2">NEW</span>
            {showPerformanceMonitor ? 'Hide Performance Monitor' : 'Performance Monitor'}
          </button>
          <button
            className="px-4 py-2 bg-[#649ef5] text-white rounded hover:bg-[#44696d] transition duration-300 w-full text-sm font-semibold"
            onClick={() => setShowSettings(!showSettings)}
            aria-label="Toggle Settings"
          >
            {showSettings ? 'Hide Settings' : 'Show Settings'}
          </button>
          <button
            className="px-4 py-2 w-full bg-[#649ef5] text-white rounded hover:bg-[#44696d] transition duration-300 text-sm font-semibold"
            onClick={() => setShowGuide(!showGuide)}
            aria-label="Toggle User Guide"
          >
            {showGuide ? 'Hide User Guide' : 'Explore User Guide'}
          </button>
        </div>

        {showGuide && <UserGuide />}
        {showStorageManager && <StorageManager />}
        {showCopyHistory && <CopyHistory />}
        {showBackupRestore && <BackupRestore />}
        {showStorageDiff && <StorageDiff />}
        {showPerformanceMonitor && <PerformanceMonitor />}
        {showSettings && <Settings theme={theme} onThemeToggle={toggleTheme} />}

        <br />
        <h4 className="text-center text-sm font-semibold mt-8 mb-2">Made with ☕ and ❤️ by Nik Kale</h4>
        <h4 className="text-center text-sm font-semibold my-4">© 2024-2025 Cisco Systems Inc.</h4>
        <p className="text-center text-xs text-gray-500">Version 4.2.0</p>
      </div>
    </div>
  );
};

// Function to inject content script into the inspected page
function injectContentScript() {
  const script = document.createElement('script');
  script.src = chrome.runtime.getURL('content.js');
  script.onload = () => script.remove();
  (document.head || document.documentElement).appendChild(script);
}

export default App;
