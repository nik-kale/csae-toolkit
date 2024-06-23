import React, { useState, useEffect } from 'react';
import UserGuide from './UserGuide';
import StorageManager from './StorageManager';
import DateTime from './DateTime';

const App = () => {
  const [showGuide, setShowGuide] = useState(false);
  const [showStorageManager, setShowStorageManager] = useState(false);

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
              if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError.message);
              } else if (response && response.status === 'success') {
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

  return (
    <div className="App p-4 bg-[#23282e] text-white shadow-lg w-full h-screen" style={{ fontFamily: 'Inter, Arial, sans-serif' }}>
      <div className="max-w-96 mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-center">Cisco Support Assistant Extension Toolkit 🛠️</h1>
        <DateTime />
        <img src="background.png" alt="background" className="w-96 h-76 mx-auto" />
        <div className="flex flex-col space-y-4 items-center">
          <button
            className="px-4 py-2 w-full bg-[#649ef5] text-white rounded hover:bg-[#44696d] transition duration-300 text-sm font-semibold "
            onClick={toggleHover}
          >
            Grab CSS Selector
          </button>
          <button
            className="px-4 py-2 bg-[#649ef5] text-white rounded hover:bg-[#44696d] transition duration-300 w-full text-sm font-semibold "
            onClick={viewConfig}
          >
            View CSAE Config
          </button>
          <button
            className="px-4 py-2 w-full bg-[#649ef5] text-white rounded hover:bg-[#44696d] transition duration-300 text-sm font-semibold "
            onClick={handleColorPicker}
          >
            Utilize Color Picker
          </button>
          <button
            className="px-4 py-2 w-full bg-[#649ef5] text-white rounded hover:bg-[#44696d] transition duration-300 text-sm font-semibold "
            onClick={() => navigateToURL('https://supportassistant.cisco.com/extension')}
          >
            Navigate to CSAE Web
          </button>
          <button
            className="px-4 py-2 w-full bg-[#649ef5] text-white rounded hover:bg-[#44696d] transition duration-300 text-sm font-semibold "
            onClick={() => navigateToURL('https://go2.cisco.com/csae-admin-portal')}
          >
            Launch Admin Portal
          </button>
          <button
            className="px-4 py-2 bg-[#649ef5] text-white rounded hover:bg-[#44696d] transition duration-300 w-full text-sm font-semibold "
            onClick={() => setShowStorageManager(!showStorageManager)}
          >
            {showStorageManager ? 'Hide Storage Manager' : 'Show Storage Manager'}
          </button>
          <button
            className="px-4 py-2 w-full bg-[#649ef5] text-white rounded hover:bg-[#44696d] transition duration-300 text-sm font-semibold "
            onClick={() => setShowGuide(!showGuide)}
          >
            {showGuide ? 'Hide User Guide' : 'Explore User Guide'}
          </button>
        </div>
        {showGuide && <UserGuide />}
        {showStorageManager && <StorageManager />}
        <br />
        <h4 className="text-center text-sm font-semibold">© 2024-2025 Cisco Systems Inc. Created by Nik Kale. </h4>
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
