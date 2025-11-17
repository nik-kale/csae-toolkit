import React, { useState, useEffect } from 'react';
import UserGuide from './UserGuide';
import StorageManager from './StorageManager';
import IndexedDBManager from './IndexedDBManager';
import DateTime from './DateTime';
import Settings from './Settings';
import Onboarding from './components/Onboarding';
import ToolSearch from './components/ToolSearch';
import FloatingButton from './components/FloatingButton';
import AccessibilityAuditor from './components/AccessibilityAuditor';
import NetworkViewer from './components/NetworkViewer';
import SnippetManager from './components/SnippetManager';
import TechStackDetector from './components/TechStackDetector';
import JSONFormatter from './components/JSONFormatter';
import { ThemeToggle } from './utils/theme.jsx';
import { toolHistoryManager } from './utils/toolHistory';
import undoRedoManager from './utils/undoRedo';

const App = () => {
  const [showGuide, setShowGuide] = useState(false);
  const [showStorageManager, setShowStorageManager] = useState(false);
  const [showIndexedDBManager, setShowIndexedDBManager] = useState(false);
  const [activeSection, setActiveSection] = useState('main');
  const [showSettings, setShowSettings] = useState(false);
  const [showToolSearch, setShowToolSearch] = useState(false);
  const [showFloatingButton, setShowFloatingButton] = useState(true);
  const [undoRedoState, setUndoRedoState] = useState({ canUndo: false, canRedo: false });

  // v5.0 Developer Productivity Tools
  const [showAccessibilityAuditor, setShowAccessibilityAuditor] = useState(false);
  const [showNetworkViewer, setShowNetworkViewer] = useState(false);
  const [showSnippetManager, setShowSnippetManager] = useState(false);
  const [showTechStackDetector, setShowTechStackDetector] = useState(false);
  const [showJSONFormatter, setShowJSONFormatter] = useState(false);

  useEffect(() => {
    if (window.chrome && chrome.devtools) {
      // DevTools context
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

    // Subscribe to undo/redo state changes
    const undoRedoListener = (state) => {
      setUndoRedoState(state);
    };
    undoRedoManager.addListener(undoRedoListener);

    // Load floating button preference
    chrome.storage.local.get(['showFloatingButton'], (result) => {
      if (result.showFloatingButton !== undefined) {
        setShowFloatingButton(result.showFloatingButton);
      }
    });

    // Global keyboard shortcuts
    const handleGlobalShortcuts = (e) => {
      // Ctrl+K or Cmd+K for tool search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setShowToolSearch(true);
      }
      // Ctrl+, or Cmd+, for settings
      if ((e.ctrlKey || e.metaKey) && e.key === ',') {
        e.preventDefault();
        setShowSettings(true);
      }
    };
    document.addEventListener('keydown', handleGlobalShortcuts);

    return () => {
      undoRedoManager.removeListener(undoRedoListener);
      document.removeEventListener('keydown', handleGlobalShortcuts);
    };
  }, []);

  const executeAction = (action, mode = null, toolInfo = null) => {
    // Record tool usage if tool info provided
    if (toolInfo) {
      toolHistoryManager.recordToolUsage(toolInfo);
    }

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length === 0) {
        console.error('No active tab found');
        alert('Error: No active tab found. Please ensure you have an active tab open.');
        return;
      }

      chrome.scripting.executeScript(
        {
          target: { tabId: tabs[0].id },
          files: ['content.js'],
        },
        () => {
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError.message);
            alert(`Error: ${chrome.runtime.lastError.message}`);
            return;
          }

          const message = mode ? { action, mode } : { action };

          if (action === 'toggleHover') {
            message.hoverActive = true;
          }

          chrome.tabs.sendMessage(tabs[0].id, message, (response) => {
            if (chrome.runtime.lastError) {
              console.error(chrome.runtime.lastError.message);
            } else if (response && response.status === 'success') {
              if (action === 'toggleHover') {
                window.close(); // Close the popup window
              }
            }
          });
        }
      );
    });
  };

  const handleToolSelect = (tool) => {
    // Map tool ID to action
    const actionMap = {
      // v4.0 Tools
      'css-selector': 'toggleHover',
      'color-picker': 'pickColor',
      'color-palette': 'viewColorPalette',
      'measure-elements': 'measureElement',
      'seo-inspector': 'seoInspector',
      'extract-images': 'extractImages',
      'export-element': 'exportElement',
      'performance-metrics': 'performanceMetrics',
      'live-css-editor': 'liveCSSEditor',
      'edit-text': 'editElement',
      'delete-element': { action: 'manipulateElement', mode: 'delete' },
      'hide-element': { action: 'manipulateElement', mode: 'hide' },
      'duplicate-element': { action: 'manipulateElement', mode: 'duplicate' },
      'highlight-element': 'highlightElement',
      'change-font': 'changeFont',
      'grid-overlay': 'toggleGrid',
      'outline-elements': 'outlineElements',
      'screenshot': 'takeScreenshot',
      'responsive-tester': 'responsiveTester',
      'storage-manager': () => setShowStorageManager(true),
      'indexeddb-manager': () => setShowIndexedDBManager(true),
      'view-config': 'viewConfig',

      // v5.0 Developer Productivity Tools
      'accessibility-auditor': () => setShowAccessibilityAuditor(true),
      'network-viewer': () => setShowNetworkViewer(true),
      'snippet-manager': () => setShowSnippetManager(true),
      'tech-stack-detector': () => setShowTechStackDetector(true),
      'json-formatter': () => setShowJSONFormatter(true),
    };

    const mapping = actionMap[tool.id];
    if (typeof mapping === 'function') {
      mapping();
    } else if (typeof mapping === 'object') {
      executeAction(mapping.action, mapping.mode, tool);
    } else if (mapping) {
      executeAction(mapping, null, tool);
    }
  };

  const navigateToURL = (url) => {
    chrome.tabs.create({ url });
  };

  const renderButton = (label, onClick, color = 'bg-[#649ef5]', hoverColor = 'hover:bg-[#44696d]', title = '') => (
    <button
      className={`px-4 py-2 w-full ${color} text-white rounded ${hoverColor} transition duration-300 text-sm font-semibold`}
      onClick={onClick}
      title={title}
      aria-label={label}
    >
      {label}
    </button>
  );

  const renderSection = () => {
    if (activeSection === 'inspector') {
      return (
        <div className="flex flex-col space-y-3 items-center">
          <h2 className="text-xl font-bold text-[#4ADC71] mb-2">Inspector Tools</h2>
          <p className="text-xs text-gray-400 mb-2 text-center">Keyboard Shortcut: Ctrl+Shift+C for CSS Selector</p>
          {renderButton('🎯 CSS Selector Grabber', () => executeAction('toggleHover'), 'bg-[#649ef5]', 'hover:bg-[#5080d0]', 'Grab CSS selectors by hovering (Ctrl+Shift+C)')}
          {renderButton('🎨 Color Picker', () => executeAction('pickColor'), 'bg-[#649ef5]', 'hover:bg-[#5080d0]', 'Pick colors from the page (Ctrl+Shift+P)')}
          {renderButton('🎨 View Color Palette', () => executeAction('viewColorPalette'), 'bg-[#649ef5]', 'hover:bg-[#5080d0]', 'View your saved color palette')}
          {renderButton('📏 Measure Elements', () => executeAction('measureElement'), 'bg-[#649ef5]', 'hover:bg-[#5080d0]', 'Click and drag to measure')}
          {renderButton('🔍 SEO Meta Inspector', () => executeAction('seoInspector'), 'bg-[#649ef5]', 'hover:bg-[#5080d0]', 'View all SEO meta tags')}
          {renderButton('🖼️ Extract Images', () => executeAction('extractImages'), 'bg-[#649ef5]', 'hover:bg-[#5080d0]', 'Extract all images from page')}
          {renderButton('📤 Export Element HTML/CSS', () => executeAction('exportElement'), 'bg-[#649ef5]', 'hover:bg-[#5080d0]', 'Export element code')}
          {renderButton('📊 Performance Metrics', () => executeAction('performanceMetrics'), 'bg-[#649ef5]', 'hover:bg-[#5080d0]', 'View page performance data')}
          {renderButton('⬅️ Back to Main Menu', () => setActiveSection('main'), 'bg-[#44696d]', 'hover:bg-[#353945]')}
        </div>
      );
    }

    if (activeSection === 'editor') {
      return (
        <div className="flex flex-col space-y-3 items-center">
          <h2 className="text-xl font-bold text-[#4ADC71] mb-2">Page Editor Tools</h2>
          <p className="text-xs text-gray-400 mb-2 text-center">Keyboard Shortcut: Ctrl+Shift+E for CSS Editor</p>
          {renderButton('💅 Live CSS Editor', () => executeAction('liveCSSEditor'), 'bg-[#649ef5]', 'hover:bg-[#5080d0]', 'Edit CSS properties in real-time (Ctrl+Shift+E)')}
          {renderButton('✏️ Edit Text Content', () => executeAction('editElement'), 'bg-[#649ef5]', 'hover:bg-[#5080d0]', 'Edit text directly on page')}
          {renderButton('🗑️ Delete Element', () => executeAction('manipulateElement', 'delete'), 'bg-[#649ef5]', 'hover:bg-[#5080d0]', 'Click to delete elements')}
          {renderButton('👁️ Hide Element', () => executeAction('manipulateElement', 'hide'), 'bg-[#649ef5]', 'hover:bg-[#5080d0]', 'Click to hide elements')}
          {renderButton('📋 Duplicate Element', () => executeAction('manipulateElement', 'duplicate'), 'bg-[#649ef5]', 'hover:bg-[#5080d0]', 'Click to duplicate elements')}
          {renderButton('🖍️ Highlight Element', () => executeAction('highlightElement'), 'bg-[#649ef5]', 'hover:bg-[#5080d0]', 'Permanently highlight elements')}
          {renderButton('🔤 Change Page Font', () => executeAction('changeFont'), 'bg-[#649ef5]', 'hover:bg-[#5080d0]', 'Change fonts globally')}
          {renderButton('⬅️ Back to Main Menu', () => setActiveSection('main'), 'bg-[#44696d]', 'hover:bg-[#353945]')}
        </div>
      );
    }

    if (activeSection === 'layout') {
      return (
        <div className="flex flex-col space-y-3 items-center">
          <h2 className="text-xl font-bold text-[#4ADC71] mb-2">Layout & Design Tools</h2>
          <p className="text-xs text-gray-400 mb-2 text-center">Keyboard Shortcuts: Ctrl+Shift+G for Grid, Ctrl+Shift+O for Outliner</p>
          {renderButton('📐 Toggle Grid Overlay', () => executeAction('toggleGrid'), 'bg-[#649ef5]', 'hover:bg-[#5080d0]', 'Show/hide alignment grid (Ctrl+Shift+G)')}
          {renderButton('🔳 Outline All Elements', () => executeAction('outlineElements'), 'bg-[#649ef5]', 'hover:bg-[#5080d0]', 'Toggle element outlines (Ctrl+Shift+O)')}
          {renderButton('📸 Take Screenshot', () => executeAction('takeScreenshot'), 'bg-[#649ef5]', 'hover:bg-[#5080d0]', 'Capture and download screenshot (Ctrl+Shift+S)')}
          {renderButton('📱 Responsive Tester', () => executeAction('responsiveTester'), 'bg-[#649ef5]', 'hover:bg-[#5080d0]', 'Test different screen sizes')}
          {renderButton('⬅️ Back to Main Menu', () => setActiveSection('main'), 'bg-[#44696d]', 'hover:bg-[#353945]')}
        </div>
      );
    }

    if (activeSection === 'storage') {
      return (
        <div className="flex flex-col space-y-3 items-center">
          <h2 className="text-xl font-bold text-[#4ADC71] mb-2">Storage & Data Tools</h2>
          {renderButton('💾 Storage Manager', () => setShowStorageManager(!showStorageManager), 'bg-[#649ef5]', 'hover:bg-[#5080d0]', 'View/clear LocalStorage, SessionStorage, Cookies')}
          {renderButton('🗄️ IndexedDB & Cache Manager', () => setShowIndexedDBManager(!showIndexedDBManager), 'bg-[#649ef5]', 'hover:bg-[#5080d0]', 'Manage IndexedDB and browser cache')}
          {renderButton('⚙️ View CSAE Config', () => executeAction('viewConfig'), 'bg-[#649ef5]', 'hover:bg-[#5080d0]', 'View CSAE configuration')}
          {renderButton('⬅️ Back to Main Menu', () => setActiveSection('main'), 'bg-[#44696d]', 'hover:bg-[#353945]')}
          {showStorageManager && <StorageManager />}
          {showIndexedDBManager && <IndexedDBManager />}
        </div>
      );
    }

    // Main menu
    return (
      <div className="flex flex-col space-y-3 items-center">
        <h2 className="text-2xl font-bold text-[#4ADC71] mb-2">Choose a Tool Category</h2>
        <p className="text-xs text-gray-400 mb-3 text-center">22 Professional Developer & Designer Tools</p>

        {renderButton('🔍 Inspector Tools (8)', () => setActiveSection('inspector'), 'bg-[#649ef5]', 'hover:bg-[#5080d0]', 'CSS Selector, Colors, SEO, Images, Performance')}
        {renderButton('✏️ Page Editor Tools (7)', () => setActiveSection('editor'), 'bg-[#649ef5]', 'hover:bg-[#5080d0]', 'Live CSS Editor, Text Editor, Element Manipulation')}
        {renderButton('📐 Layout & Design (4)', () => setActiveSection('layout'), 'bg-[#649ef5]', 'hover:bg-[#5080d0]', 'Grid Overlay, Outliner, Screenshots, Responsive')}
        {renderButton('💾 Storage & Data (3)', () => setActiveSection('storage'), 'bg-[#649ef5]', 'hover:bg-[#5080d0]', 'LocalStorage, IndexedDB, Cache, Cookies')}

        <div className="w-full border-t border-gray-600 my-4"></div>

        <h3 className="text-lg font-semibold text-[#649ef5] mb-2">Quick Links</h3>
        {renderButton('🌐 Navigate to CSAE Web', () => navigateToURL('https://supportassistant.cisco.com/extension'), 'bg-[#353945]', 'hover:bg-[#464b54]')}
        {renderButton('🚀 Launch Admin Portal', () => navigateToURL('https://go2.cisco.com/csae-admin-portal'), 'bg-[#353945]', 'hover:bg-[#464b54]')}

        <div className="w-full border-t border-gray-600 my-4"></div>

        <div className="w-full bg-[#353945] p-3 rounded text-xs">
          <div className="font-semibold text-[#4ADC71] mb-2">⌨️ Keyboard Shortcuts:</div>
          <div className="space-y-1 text-gray-300">
            <div><kbd className="bg-[#464b54] px-2 py-1 rounded">Ctrl+Shift+C</kbd> CSS Selector</div>
            <div><kbd className="bg-[#464b54] px-2 py-1 rounded">Ctrl+Shift+P</kbd> Color Picker</div>
            <div><kbd className="bg-[#464b54] px-2 py-1 rounded">Ctrl+Shift+E</kbd> CSS Editor</div>
            <div><kbd className="bg-[#464b54] px-2 py-1 rounded">Ctrl+Shift+G</kbd> Grid Overlay</div>
            <div><kbd className="bg-[#464b54] px-2 py-1 rounded">Ctrl+Shift+O</kbd> Outliner</div>
            <div><kbd className="bg-[#464b54] px-2 py-1 rounded">Ctrl+Shift+S</kbd> Screenshot</div>
            <div><kbd className="bg-[#464b54] px-2 py-1 rounded">ESC</kbd> Exit any tool</div>
          </div>
        </div>

        {renderButton(showGuide ? '📖 Hide User Guide' : '📖 Explore User Guide', () => setShowGuide(!showGuide), 'bg-[#44696d]', 'hover:bg-[#353945]')}

        {showGuide && <UserGuide />}
      </div>
    );
  };

  return (
    <>
      <div className="App p-4 bg-[#23282e] text-white shadow-lg w-full h-screen overflow-y-auto" style={{ fontFamily: 'Inter, Arial, sans-serif' }}>
        <div className="max-w-96 mx-auto">
          {/* Header with v4.0 controls */}
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold">
              CSAE Toolkit v4.0
            </h1>
            <div className="flex gap-2">
              <button
                onClick={() => setShowToolSearch(true)}
                className="p-2 rounded bg-[#353945] hover:bg-[#464b54] transition duration-300"
                title="Search tools (Ctrl+K)"
                aria-label="Search tools"
              >
                🔍
              </button>
              <button
                onClick={() => setShowSettings(true)}
                className="p-2 rounded bg-[#353945] hover:bg-[#464b54] transition duration-300"
                title="Settings (Ctrl+,)"
                aria-label="Settings"
              >
                ⚙️
              </button>
            </div>
          </div>

          <p className="text-center text-sm text-gray-400 mb-2">
            Enterprise Edition - Professional Tools
          </p>

          {/* Theme Toggle */}
          <div className="mb-4">
            <ThemeToggle />
          </div>

          {/* Undo/Redo Indicator */}
          {(undoRedoState.canUndo || undoRedoState.canRedo) && (
            <div className="mb-3 p-2 bg-[#353945] rounded text-xs flex items-center justify-between">
              <span className="text-gray-400">History: {undoRedoState.historyLength || 0} actions</span>
              <div className="flex gap-2">
                <button
                  onClick={() => undoRedoManager.undo()}
                  disabled={!undoRedoState.canUndo}
                  className={`px-2 py-1 rounded ${undoRedoState.canUndo ? 'bg-[#649ef5] hover:bg-[#5080d0]' : 'bg-gray-700 cursor-not-allowed'}`}
                  title="Undo (Ctrl+Z)"
                >
                  ↩️ Undo
                </button>
                <button
                  onClick={() => undoRedoManager.redo()}
                  disabled={!undoRedoState.canRedo}
                  className={`px-2 py-1 rounded ${undoRedoState.canRedo ? 'bg-[#649ef5] hover:bg-[#5080d0]' : 'bg-gray-700 cursor-not-allowed'}`}
                  title="Redo (Ctrl+Shift+Z)"
                >
                  ↪️ Redo
                </button>
              </div>
            </div>
          )}

          <DateTime />
          <img src="background.png" alt="background" className="w-96 h-76 mx-auto mb-4" />

          {renderSection()}

          <br />
          <div className="text-center text-xs text-gray-400 mt-8">
            <p className="font-semibold">Made with ☕ and ❤️ by Nik Kale</p>
            <p className="mt-1">© 2024-2025 Cisco Systems Inc.</p>
            <p className="mt-2 text-[#4ADC71] font-bold">✨ v5.0 Developer Productivity Edition - 30 Professional Tools ✨</p>
          </div>
        </div>
      </div>

      {/* v4.0 & v5.0 Overlays and Components */}
      {showToolSearch && (
        <ToolSearch
          onToolSelect={handleToolSelect}
          onClose={() => setShowToolSearch(false)}
        />
      )}

      {showSettings && (
        <Settings onClose={() => setShowSettings(false)} />
      )}

      {showFloatingButton && (
        <FloatingButton onToolSelect={handleToolSelect} />
      )}

      {/* v5.0 Developer Productivity Tools */}
      {showAccessibilityAuditor && (
        <AccessibilityAuditor onClose={() => setShowAccessibilityAuditor(false)} />
      )}

      {showNetworkViewer && (
        <NetworkViewer onClose={() => setShowNetworkViewer(false)} />
      )}

      {showSnippetManager && (
        <SnippetManager onClose={() => setShowSnippetManager(false)} />
      )}

      {showTechStackDetector && (
        <TechStackDetector onClose={() => setShowTechStackDetector(false)} />
      )}

      {showJSONFormatter && (
        <JSONFormatter onClose={() => setShowJSONFormatter(false)} />
      )}

      <Onboarding onComplete={() => console.log('Onboarding completed')} />
    </>
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
