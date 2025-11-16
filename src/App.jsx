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

  const renderButton = (label, onClick, color = 'bg-[#649ef5]', hoverColor = 'hover:bg-[#44696d]') => (
    <button
      className={`px-4 py-2 w-full ${color} text-white rounded ${hoverColor} transition duration-300 text-sm font-semibold`}
      onClick={onClick}
    >
      {label}
    </button>
  );

  const renderSection = () => {
    if (activeSection === 'inspector') {
      return (
        <div className="flex flex-col space-y-3 items-center">
          <h2 className="text-xl font-bold text-[#4ADC71] mb-2">Inspector Tools</h2>
          {renderButton('🎯 Grab CSS Selector', () => executeAction('toggleHover'))}
          {renderButton('🎨 Color Picker', () => executeAction('pickColor'))}
          {renderButton('📏 Measure Elements', () => executeAction('measureElement'))}
          {renderButton('🔍 SEO Meta Inspector', () => executeAction('seoInspector'))}
          {renderButton('🖼️ Extract Images', () => executeAction('extractImages'))}
          {renderButton('📤 Export Element HTML/CSS', () => executeAction('exportElement'))}
          {renderButton('⬅️ Back to Main Menu', () => setActiveSection('main'), 'bg-[#44696d]', 'hover:bg-[#353945]')}
        </div>
      );
    }

    if (activeSection === 'editor') {
      return (
        <div className="flex flex-col space-y-3 items-center">
          <h2 className="text-xl font-bold text-[#4ADC71] mb-2">Page Editor Tools</h2>
          {renderButton('✏️ Edit Text Content', () => executeAction('editElement'))}
          {renderButton('🗑️ Delete Element', () => executeAction('manipulateElement', 'delete'))}
          {renderButton('👁️ Hide Element', () => executeAction('manipulateElement', 'hide'))}
          {renderButton('📋 Duplicate Element', () => executeAction('manipulateElement', 'duplicate'))}
          {renderButton('🔤 Change Page Font', () => executeAction('changeFont'))}
          {renderButton('⬅️ Back to Main Menu', () => setActiveSection('main'), 'bg-[#44696d]', 'hover:bg-[#353945]')}
        </div>
      );
    }

    if (activeSection === 'layout') {
      return (
        <div className="flex flex-col space-y-3 items-center">
          <h2 className="text-xl font-bold text-[#4ADC71] mb-2">Layout & Design Tools</h2>
          {renderButton('📐 Toggle Grid Overlay', () => executeAction('toggleGrid'))}
          {renderButton('📏 Ruler/Measurement Tool', () => executeAction('measureElement'))}
          {renderButton('📸 Take Screenshot', () => executeAction('takeScreenshot'))}
          {renderButton('⬅️ Back to Main Menu', () => setActiveSection('main'), 'bg-[#44696d]', 'hover:bg-[#353945]')}
        </div>
      );
    }

    if (activeSection === 'storage') {
      return (
        <div className="flex flex-col space-y-3 items-center">
          <h2 className="text-xl font-bold text-[#4ADC71] mb-2">Storage & Data Tools</h2>
          {renderButton('💾 Storage Manager', () => setShowStorageManager(!showStorageManager))}
          {renderButton('🗄️ IndexedDB & Cache Manager', () => setShowIndexedDBManager(!showIndexedDBManager))}
          {renderButton('⚙️ View CSAE Config', () => executeAction('viewConfig'))}
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

        {renderButton('🔍 Inspector Tools', () => setActiveSection('inspector'), 'bg-[#649ef5]', 'hover:bg-[#5080d0]')}
        {renderButton('✏️ Page Editor Tools', () => setActiveSection('editor'), 'bg-[#649ef5]', 'hover:bg-[#5080d0]')}
        {renderButton('📐 Layout & Design', () => setActiveSection('layout'), 'bg-[#649ef5]', 'hover:bg-[#5080d0]')}
        {renderButton('💾 Storage & Data', () => setActiveSection('storage'), 'bg-[#649ef5]', 'hover:bg-[#5080d0]')}

        <div className="w-full border-t border-gray-600 my-4"></div>

        <h3 className="text-lg font-semibold text-[#649ef5] mb-2">Quick Links</h3>
        {renderButton('🌐 Navigate to CSAE Web', () => navigateToURL('https://supportassistant.cisco.com/extension'), 'bg-[#353945]', 'hover:bg-[#464b54]')}
        {renderButton('🚀 Launch Admin Portal', () => navigateToURL('https://go2.cisco.com/csae-admin-portal'), 'bg-[#353945]', 'hover:bg-[#464b54]')}

        <div className="w-full border-t border-gray-600 my-4"></div>

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
          <p className="mt-2 text-[#4ADC71]">✨ Now with 18+ Professional Tools ✨</p>
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
