import React, { useState } from 'react';

const StorageManager = () => {
  const [localStorageData, setLocalStorageData] = useState(null);
  const [sessionStorageData, setSessionStorageData] = useState(null);
  const [cookiesData, setCookiesData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedArea, setSelectedArea] = useState('local');

  const loadLocalStorage = () => {
    setLoading(true);
    setError(null);
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript(
        {
          target: { tabId: tabs[0].id },
          function: () => JSON.stringify(window.localStorage),
        },
        (results) => {
          setLoading(false);
          if (results && results[0] && results[0].result) {
            setLocalStorageData(JSON.parse(results[0].result));
          } else {
            setError('Failed to load local storage');
          }
        }
      );
    });
  };

  const clearLocalStorage = () => {
    setLoading(true);
    setError(null);
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript(
        {
          target: { tabId: tabs[0].id },
          function: () => {
            window.localStorage.clear();
            return true;
          },
        },
        () => {
          setLoading(false);
          setLocalStorageData({});
        }
      );
    });
  };

  const loadSessionStorage = () => {
    setLoading(true);
    setError(null);
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript(
        {
          target: { tabId: tabs[0].id },
          function: () => JSON.stringify(window.sessionStorage),
        },
        (results) => {
          setLoading(false);
          if (results && results[0] && results[0].result) {
            setSessionStorageData(JSON.parse(results[0].result));
          } else {
            setError('Failed to load session storage');
          }
        }
      );
    });
  };

  const clearSessionStorage = () => {
    setLoading(true);
    setError(null);
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript(
        {
          target: { tabId: tabs[0].id },
          function: () => {
            window.sessionStorage.clear();
            return true;
          },
        },
        () => {
          setLoading(false);
          setSessionStorageData({});
        }
      );
    });
  };

  const loadCookies = () => {
    setLoading(true);
    setError(null);
    chrome.runtime.sendMessage({ action: 'getCookies' }, (response) => {
      setLoading(false);
      if (response && response.cookies) {
        setCookiesData(response.cookies);
      } else {
        setError('Failed to load cookies');
      }
    });
  };

  const clearCookies = () => {
    setLoading(true);
    setError(null);
    chrome.runtime.sendMessage({ action: 'clearCookies' }, (response) => {
      setLoading(false);
      if (response && response.success) {
        setCookiesData({});
      } else {
        setError('Failed to clear cookies');
      }
    });
  };

  const loadSelectedStorage = () => {
    if (selectedArea === 'local') loadLocalStorage();
    if (selectedArea === 'session') loadSessionStorage();
  };

  const clearSelectedStorage = () => {
    if (selectedArea === 'local') clearLocalStorage();
    if (selectedArea === 'session') clearSessionStorage();
  };

  return (
    <div className="p-4 bg-[#464b54] rounded-lg shadow-md mt-4 text-white">
      <h2 className="text-lg font-semibold mb-4">Storage Manager</h2>
      <div className="mb-4">
        <label htmlFor="storageArea" className="block mb-2 text-sm">Select Storage Area:</label>
        <select
          id="storageArea"
          value={selectedArea}
          onChange={(e) => setSelectedArea(e.target.value)}
          className="p-2 bg-gray-700 text-white rounded text-sm"
        >
          <option value="local">Local</option>
          <option value="session">Session</option>
        </select>
      </div>
      <div className="mb-4">
        <button
          className="px-4 py-2 bg-[#649ef5] text-white text-sm rounded hover:bg-blue-600 transition duration-300"
          onClick={loadSelectedStorage}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Load Storage Data'}
        </button>
        <button
          className="px-4 py-2 bg-[#44696d] text-white text-sm rounded hover:bg-red-600 transition duration-300 ml-2"
          onClick={clearSelectedStorage}
          disabled={loading}
        >
          {loading ? 'Clearing...' : 'Clear Storage Data'}
        </button>
      </div>
      {error && (
        <div className="bg-red-500 text-white text-sm p-2 rounded mb-4">
          <p>Error: {error}</p>
        </div>
      )}
      {(selectedArea === 'local' && localStorageData) && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Local Storage Data:</h3>
          <pre className="text-sm font-semibold  bg-gray-800 p-4 rounded text-wrap overflow-x-auto whitespace-pre-wrap">{JSON.stringify(localStorageData, null, 2)}</pre>
        </div>
      )}
      {(selectedArea === 'session' && sessionStorageData) && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Session Storage Data:</h3>
          <pre className="text-sm font-semibold  bg-gray-800 p-4 rounded text-wrap overflow-x-auto whitespace-pre-wrap">{JSON.stringify(sessionStorageData, null, 2)}</pre>
        </div>
      )}
      <div className="mt-4">
        <h2 className="text-lg font-semibold">Cookies</h2>
        <button onClick={loadCookies} className="px-4 py-2 bg-[#649ef5] text-white rounded hover:bg-blue-600 transition duration-300">Load Cookies</button>
        <button onClick={clearCookies} className="px-4 py-2 bg-[#44696d] text-white rounded hover:bg-red-600 transition duration-300 ml-2">Clear Cookies</button>
        {cookiesData && (
          <div>
            <h3 className="text-lg font-semibold mb-2 mt-4">Cookies Data:</h3>
            <pre className="text-sm font-semibold  bg-gray-800 p-4 rounded text-wrap overflow-x-auto whitespace-pre-wrap">{JSON.stringify(cookiesData, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default StorageManager;
