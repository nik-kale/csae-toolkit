import React, { useState, useEffect, useCallback } from 'react';
import UserGuide from './UserGuide';
import StorageManager from './StorageManager';
import DateTime from './DateTime';
import Notification from './components/Notification';
import { useTheme } from './context/ThemeContext';
import { URLS, EXTENSION_INFO, SHORTCUTS } from './constants';
import { safeChromeAPI } from './utils/helpers';

/**
 * Main App Component
 * Entry point for the CSAE Toolkit extension
 */
const App = () => {
  const [showGuide, setShowGuide] = useState(false);
  const [showStorageManager, setShowStorageManager] = useState(false);
  const [notification, setNotification] = useState(null);
  const { theme, toggleTheme, isDark } = useTheme();

  useEffect(() => {
    // Apply theme to body
    document.body.className = isDark ? '' : 'light-theme';

    // DevTools context injection
    if (window.chrome && chrome.devtools) {
      chrome.devtools.inspectedWindow.eval(
        `(${injectContentScript.toString()})();`,
        (result, isException) => {
          if (isException) {
            console.error('Error injecting content script:', isException);
          } else {
            console.log('Content script injected:', result);
          }
        }
      );
    }

    // Set up keyboard shortcuts
    const handleKeyDown = (e) => {
      // Ctrl/Cmd + K to toggle storage manager
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setShowStorageManager(prev => !prev);
      }
      // Ctrl/Cmd + H to toggle user guide
      if ((e.ctrlKey || e.metaKey) && e.key === 'h') {
        e.preventDefault();
        setShowGuide(prev => !prev);
      }
      // Ctrl/Cmd + T to toggle theme
      if ((e.ctrlKey || e.metaKey) && e.key === 't') {
        e.preventDefault();
        toggleTheme();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDark, toggleTheme]);

  const showNotification = useCallback((type, message) => {
    setNotification({ type, message });
  }, []);

  const closeNotification = useCallback(() => {
    setNotification(null);
  }, []);

  const toggleHover = useCallback(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs || tabs.length === 0) {
        showNotification('error', 'No active tab found');
        return;
      }
      if (chrome.runtime.lastError) {
        showNotification('error', chrome.runtime.lastError.message);
        return;
      }
      chrome.scripting.executeScript(
        {
          target: { tabId: tabs[0].id },
          files: ['content.js'],
        },
        () => {
          if (chrome.runtime.lastError) {
            showNotification('error', chrome.runtime.lastError.message);
            return;
          }
          chrome.tabs.sendMessage(
            tabs[0].id,
            { action: 'toggleHover', hoverActive: true },
            (response) => {
              if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError.message);
              } else if (response && response.status === 'success') {
                showNotification('success', 'CSS Selector mode activated');
              }
            }
          );
        }
      );
    });
  }, [showNotification]);

  const viewConfig = useCallback(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs || tabs.length === 0) {
        showNotification('error', 'No active tab found');
        return;
      }
      chrome.scripting.executeScript(
        {
          target: { tabId: tabs[0].id },
          files: ['content.js'],
        },
        () => {
          if (chrome.runtime.lastError) {
            showNotification('error', chrome.runtime.lastError.message);
            return;
          }
          chrome.tabs.sendMessage(tabs[0].id, { action: 'viewConfig' });
        }
      );
    });
  }, [showNotification]);

  const navigateToURL = useCallback((url) => {
    try {
      chrome.tabs.create({ url }, () => {
        if (chrome.runtime.lastError) {
          showNotification('error', chrome.runtime.lastError.message);
        } else {
          showNotification('success', 'New tab opened');
        }
      });
    } catch (error) {
      showNotification('error', 'Failed to open new tab');
    }
  }, [showNotification]);

  const handleColorPicker = useCallback(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs || tabs.length === 0) {
        showNotification('error', 'No active tab found');
        return;
      }
      chrome.scripting.executeScript(
        {
          target: { tabId: tabs[0].id },
          files: ['content.js'],
        },
        () => {
          if (chrome.runtime.lastError) {
            showNotification('error', chrome.runtime.lastError.message);
            return;
          }
          chrome.tabs.sendMessage(tabs[0].id, { action: 'pickColor' });
        }
      );
    });
  }, [showNotification]);

  const activateContentTool = useCallback((toolName) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs || tabs.length === 0) {
        showNotification('error', 'No active tab found');
        return;
      }

      // Inject advanced tools scripts
      chrome.scripting.executeScript(
        {
          target: { tabId: tabs[0].id },
          files: ['content.js'],
        },
        () => {
          if (chrome.runtime.lastError) {
            showNotification('error', chrome.runtime.lastError.message);
            return;
          }

          // Send message to activate the specific tool
          chrome.tabs.sendMessage(
            tabs[0].id,
            { action: 'activateAdvancedTool', tool: toolName },
            (response) => {
              if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError.message);
                showNotification('error', 'Failed to activate tool');
              } else if (response && response.status === 'success') {
                showNotification('success', `${toolName} activated`);
              }
            }
          );
        }
      );
    });
  }, [showNotification]);

  return (
    <div
      className={`App p-4 ${isDark ? 'bg-[#23282e]' : 'bg-gray-100'} ${isDark ? 'text-white' : 'text-gray-900'} shadow-lg w-full h-screen`}
      style={{ fontFamily: 'Inter, Arial, sans-serif' }}
      role="main"
    >
      <div className="max-w-96 mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-center flex-1">
            {EXTENSION_INFO.name}
          </h1>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-gray-700 transition duration-300"
            aria-label="Toggle theme"
            title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
          >
            {isDark ? '🌙' : '☀️'}
          </button>
        </div>

        <DateTime />

        <img
          src="background.png"
          alt="CSAE Toolkit Background"
          className="w-96 h-76 mx-auto"
        />

        <div className="flex flex-col space-y-4 items-center">
          <button
            className="btn-primary w-full"
            onClick={toggleHover}
            aria-label="Activate CSS selector grabbing mode"
            title={`Grab CSS selectors (${SHORTCUTS.toggleHover} to exit)`}
          >
            Grab CSS Selector
          </button>

          <button
            className="btn-primary w-full"
            onClick={viewConfig}
            aria-label="View CSAE configuration"
          >
            View CSAE Config
          </button>

          <button
            className="btn-primary w-full"
            onClick={handleColorPicker}
            aria-label="Activate color picker tool"
          >
            Utilize Color Picker
          </button>

          <button
            className="btn-primary w-full"
            onClick={() => navigateToURL(URLS.csaeWeb)}
            aria-label="Open CSAE web portal"
          >
            Navigate to CSAE Web
          </button>

          <button
            className="btn-primary w-full"
            onClick={() => navigateToURL(URLS.adminPortal)}
            aria-label="Open CSAE admin portal"
          >
            Launch Admin Portal
          </button>

          <button
            className="btn-primary w-full"
            onClick={() => setShowStorageManager(!showStorageManager)}
            aria-label={`${showStorageManager ? 'Hide' : 'Show'} storage manager`}
            title="Ctrl/Cmd + K"
          >
            {showStorageManager ? 'Hide Storage Manager' : 'Show Storage Manager'}
          </button>

          <button
            className="btn-primary w-full"
            onClick={() => setShowGuide(!showGuide)}
            aria-label={`${showGuide ? 'Hide' : 'Show'} user guide`}
            title="Ctrl/Cmd + H"
          >
            {showGuide ? 'Hide User Guide' : 'Explore User Guide'}
          </button>

          {/* Advanced Developer Tools Section */}
          <div className="w-full border-t border-gray-600 my-4 pt-4">
            <h3 className="text-lg font-bold mb-3 text-center">🛠️ Advanced Dev Tools</h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                className="btn-secondary text-xs py-2"
                onClick={() => activateContentTool('liveCSSEditor')}
                aria-label="Live CSS Editor"
                title="Edit CSS in real-time"
              >
                CSS Editor
              </button>
              <button
                className="btn-secondary text-xs py-2"
                onClick={() => activateContentTool('pageRuler')}
                aria-label="Page Ruler"
                title="Measure elements"
              >
                Page Ruler
              </button>
              <button
                className="btn-secondary text-xs py-2"
                onClick={() => activateContentTool('elementOutliner')}
                aria-label="Element Outliner"
                title="Show element outlines"
              >
                Outliner
              </button>
              <button
                className="btn-secondary text-xs py-2"
                onClick={() => activateContentTool('imageExtractor')}
                aria-label="Image Extractor"
                title="Extract page images"
              >
                Images
              </button>
              <button
                className="btn-secondary text-xs py-2"
                onClick={() => activateContentTool('screenshotTool')}
                aria-label="Screenshot Tool"
                title="Capture screenshots"
              >
                Screenshot
              </button>
              <button
                className="btn-secondary text-xs py-2"
                onClick={() => activateContentTool('seoInspector')}
                aria-label="SEO Inspector"
                title="Analyze SEO meta tags"
              >
                SEO Check
              </button>
              <button
                className="btn-secondary text-xs py-2"
                onClick={() => activateContentTool('performanceAnalyzer')}
                aria-label="Performance Analyzer"
                title="Analyze page performance"
              >
                Performance
              </button>
              <button
                className="btn-secondary text-xs py-2"
                onClick={() => showNotification('info', 'More tools coming soon!')}
                aria-label="More Tools"
                title="Additional tools"
              >
                More...
              </button>
            </div>
          </div>
        </div>

        {showGuide && <UserGuide />}
        {showStorageManager && <StorageManager />}

        <div className="mt-8 text-center">
          <p className="text-sm font-semibold mb-2">
            Made with ☕ and ❤️ by {EXTENSION_INFO.author}
          </p>
          <p className="text-sm font-semibold">
            {EXTENSION_INFO.copyright}
          </p>
          <p className="text-xs mt-2 text-gray-500">
            Version {EXTENSION_INFO.version}
          </p>
          <div className="mt-2 text-xs text-gray-500">
            <p>Keyboard Shortcuts:</p>
            <p>Ctrl/Cmd + K: Toggle Storage Manager</p>
            <p>Ctrl/Cmd + H: Toggle User Guide</p>
            <p>Ctrl/Cmd + T: Toggle Theme</p>
          </div>
        </div>
      </div>

      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={closeNotification}
        />
      )}
    </div>
  );
};

/**
 * Inject content script into the inspected page
 * Used in DevTools context
 */
function injectContentScript() {
  const script = document.createElement('script');
  script.src = chrome.runtime.getURL('content.js');
  script.onload = () => script.remove();
  (document.head || document.documentElement).appendChild(script);
}

export default App;
