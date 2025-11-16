import React, { useState, useEffect } from 'react';
import UserGuide from './UserGuide';
import StorageManager from './StorageManager';
import IndexedDBManager from './IndexedDBManager';
import DateTime from './DateTime';

const App = () => {
  const [showGuide, setShowGuide] = useState(false);
  const [showStorageManager, setShowStorageManager] = useState(false);
  const [showIndexedDBManager, setShowIndexedDBManager] = useState(false);
  const [activeSection, setActiveSection] = useState('main');

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
  }, []);

  const executeAction = (action, mode = null) => {
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
    <div className="App p-4 bg-[#23282e] text-white shadow-lg w-full h-screen overflow-y-auto" style={{ fontFamily: 'Inter, Arial, sans-serif' }}>
      <div className="max-w-96 mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-center">
          CSAE Toolkit v3.0
        </h1>
        <p className="text-center text-sm text-gray-400 mb-4">
          Professional Developer & Designer Tools
        </p>
        <DateTime />
        <img src="background.png" alt="background" className="w-96 h-76 mx-auto mb-4" />

        {renderSection()}

        <br />
        <div className="text-center text-xs text-gray-400 mt-8">
          <p className="font-semibold">Made with ☕ and ❤️ by Nik Kale</p>
          <p className="mt-1">© 2024-2025 Cisco Systems Inc.</p>
          <p className="mt-2 text-[#4ADC71] font-bold">✨ 22 Professional Tools + Keyboard Shortcuts ✨</p>
        </div>
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
