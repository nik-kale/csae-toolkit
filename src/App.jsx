import React, { useState } from 'react';
import UserGuide from './UserGuide';
import StorageManager from './StorageManager';

const App = () => {
  const [showGuide, setShowGuide] = useState(false);
  const [showStorageManager, setShowStorageManager] = useState(true); // Show storage manager by default

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

  return (
    <div className="App p-4 bg-[#23282e] text-white shadow-lg w-96" style={{ fontFamily: 'Inter, Arial, sans-serif' }}>
      <h1 className="text-2xl font-bold mb-4 text-center">Cisco Support Assistant Extension Toolkit 🛠️</h1>
      <div className="flex flex-col space-y-4 items-center">
        <button
          className="px-4 py-2 w-full bg-[#649ef5] text-white rounded hover:bg-[#44696d] transition duration-300"
          onClick={toggleHover}
        >
          Grab CSS Selector
        </button>
        <button
          className="px-4 py-2 w-full bg-[#649ef5] text-white rounded hover:bg-[#44696d] transition duration-300"
          onClick={() => setShowGuide(!showGuide)}
        >
          {showGuide ? 'Hide User Guide' : 'Show User Guide'}
        </button>
        <button
          className="px-4 py-2 bg-[#649ef5] text-white rounded hover:bg-blue-600 transition duration-300 w-full"
          onClick={() => setShowStorageManager(!showStorageManager)}
        >
          {showStorageManager ? 'Hide Storage Manager' : 'Show Storage Manager'}
        </button>
      </div>
      {showGuide && <UserGuide />}
      {showStorageManager && <StorageManager />}
    </div>
  );
};

export default App;
