import { useState } from 'react';
import UserGuide from './UserGuide';
import StorageManager from './StorageManager';
import SelectorHistory from './SelectorHistory';
import ColorPicker from './ColorPicker';
import DateTime from './DateTime';
import Button from './Button';

const App = () => {
  const [showGuide, setShowGuide] = useState(false);
  const [showStorageManager, setShowStorageManager] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showColorTools, setShowColorTools] = useState(false);

  const toggleHover = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0) {
        // Inject into every frame so selectors work inside iframes too.
        chrome.scripting.executeScript(
          {
            target: { tabId: tabs[0].id, allFrames: true },
            files: ['content.js'],
          },
          () => {
            if (chrome.runtime.lastError) {
              console.error(chrome.runtime.lastError.message);
              return;
            }
            chrome.tabs.sendMessage(
              tabs[0].id,
              { action: 'toggleHover', hoverActive: true },
              (response) => {
                if (chrome.runtime.lastError) {
                  console.error(chrome.runtime.lastError.message);
                } else if (response && response.status === 'success') {
                  window.close(); // Close the side panel
                }
              }
            );
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

  return (
    <div
      className="App p-4 bg-[#23282e] text-white shadow-lg w-full h-screen"
      style={{
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      }}
    >
      <div className="max-w-96 mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-center">
          Cisco Support Assistant Extension Toolkit 🛠️
        </h1>
        <DateTime />
        <img src="background.png" alt="" className="w-96 h-76 mx-auto" />
        <div className="flex flex-col space-y-4 items-center">
          <Button onClick={toggleHover}>Grab CSS Selector</Button>
          <Button onClick={viewConfig}>View CSAE Config</Button>
          <Button
            onClick={() => setShowColorTools(!showColorTools)}
            aria-expanded={showColorTools}
            aria-controls="color-tools-panel"
          >
            {showColorTools ? 'Hide Color Tools' : 'Utilize Color Picker'}
          </Button>
          <Button onClick={() => navigateToURL('https://supportassistant.cisco.com/extension')}>
            Navigate to CSAE Web
          </Button>
          <Button onClick={() => navigateToURL('https://go2.cisco.com/csae-admin-portal')}>
            Launch Admin Portal
          </Button>
          <Button
            onClick={() => setShowHistory(!showHistory)}
            aria-expanded={showHistory}
            aria-controls="selector-history-panel"
          >
            {showHistory ? 'Hide Selector History' : 'Show Selector History'}
          </Button>
          <Button
            onClick={() => setShowStorageManager(!showStorageManager)}
            aria-expanded={showStorageManager}
            aria-controls="storage-manager-panel"
          >
            {showStorageManager ? 'Hide Storage Manager' : 'Show Storage Manager'}
          </Button>
          <Button
            onClick={() => setShowGuide(!showGuide)}
            aria-expanded={showGuide}
            aria-controls="user-guide-panel"
          >
            {showGuide ? 'Hide User Guide' : 'Explore User Guide'}
          </Button>
        </div>
        {showColorTools && (
          <div id="color-tools-panel">
            <ColorPicker />
          </div>
        )}
        {showHistory && (
          <div id="selector-history-panel">
            <SelectorHistory />
          </div>
        )}
        {showGuide && (
          <div id="user-guide-panel">
            <UserGuide />
          </div>
        )}
        {showStorageManager && (
          <div id="storage-manager-panel">
            <StorageManager />
          </div>
        )}
        <br />
        <h4 className="text-center text-sm font-semibold mt-8 mb-2">
          Made with ☕ and ❤️ by Nik Kale
        </h4>
        <h4 className="text-center text-sm font-semibold my-4">© 2024-2025 Cisco Systems Inc.</h4>
      </div>
    </div>
  );
};

export default App;
