import React, { useState, useMemo } from 'react';

const StorageManager = () => {
  const [localStorageData, setLocalStorageData] = useState(null);
  const [sessionStorageData, setSessionStorageData] = useState(null);
  const [cookiesData, setCookiesData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedArea, setSelectedArea] = useState('local');
  const [searchQuery, setSearchQuery] = useState('');
  const [successMessage, setSuccessMessage] = useState(null);

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

  // Export storage data to JSON file
  const exportStorage = () => {
    const dataToExport = selectedArea === 'local' ? localStorageData : sessionStorageData;
    if (!dataToExport) {
      setError('No data to export. Please load storage first.');
      return;
    }

    const dataStr = JSON.stringify(dataToExport, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${selectedArea}-storage-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showSuccessMessage(`${selectedArea} storage exported successfully!`);
  };

  // Import storage data from JSON file
  const importStorage = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);

        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          chrome.scripting.executeScript(
            {
              target: { tabId: tabs[0].id },
              function: (data, area) => {
                const storage = area === 'local' ? window.localStorage : window.sessionStorage;
                Object.keys(data).forEach(key => {
                  storage.setItem(key, data[key]);
                });
                return true;
              },
              args: [importedData, selectedArea]
            },
            () => {
              showSuccessMessage(`${selectedArea} storage imported successfully!`);
              loadSelectedStorage(); // Reload to show imported data
            }
          );
        });
      } catch (err) {
        setError('Invalid JSON file. Please check the file format.');
      }
    };
    reader.readAsText(file);

    // Reset the input
    event.target.value = '';
  };

  // Filter storage data based on search query
  const getFilteredData = useMemo(() => {
    const currentData = selectedArea === 'local' ? localStorageData : sessionStorageData;
    if (!currentData || !searchQuery) return currentData;

    const filtered = {};
    Object.keys(currentData).forEach(key => {
      const value = currentData[key];
      const matchesKey = key.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesValue = typeof value === 'string' &&
        value.toLowerCase().includes(searchQuery.toLowerCase());

      if (matchesKey || matchesValue) {
        filtered[key] = value;
      }
    });
    return filtered;
  }, [localStorageData, sessionStorageData, selectedArea, searchQuery]);

  // Show success message temporarily
  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 3000);
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
      <div className="mb-4 flex flex-wrap gap-2">
        <button
          className="px-4 py-2 bg-[#649ef5] text-white text-sm rounded hover:bg-blue-600 transition duration-300"
          onClick={loadSelectedStorage}
          disabled={loading}
          aria-label="Load storage data"
        >
          {loading ? 'Loading...' : 'Load Storage Data'}
        </button>
        <button
          className="px-4 py-2 bg-[#44696d] text-white text-sm rounded hover:bg-red-600 transition duration-300"
          onClick={clearSelectedStorage}
          disabled={loading}
          aria-label="Clear storage data"
        >
          {loading ? 'Clearing...' : 'Clear Storage Data'}
        </button>
        <button
          className="px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition duration-300"
          onClick={exportStorage}
          disabled={loading}
          aria-label="Export storage data"
        >
          Export
        </button>
        <label className="px-4 py-2 bg-purple-600 text-white text-sm rounded hover:bg-purple-700 transition duration-300 cursor-pointer">
          Import
          <input
            type="file"
            accept=".json"
            onChange={importStorage}
            className="hidden"
            aria-label="Import storage data"
          />
        </label>
      </div>
      {(localStorageData || sessionStorageData) && (
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by key or value..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2 bg-gray-700 text-white rounded text-sm"
            aria-label="Search storage data"
          />
        </div>
      )}
      {successMessage && (
        <div className="bg-green-600 text-white text-sm p-2 rounded mb-4">
          {successMessage}
        </div>
      )}
      {error && (
        <div className="bg-red-500 text-white text-sm p-2 rounded mb-4">
          <p>Error: {error}</p>
        </div>
      )}
      {(selectedArea === 'local' && localStorageData) && (
        <div>
          <h3 className="text-lg font-semibold mb-2">
            Local Storage Data
            {searchQuery && ` (${Object.keys(getFilteredData || {}).length} results)`}
          </h3>
          <pre className="text-sm font-semibold  bg-gray-800 p-4 rounded text-wrap overflow-x-auto whitespace-pre-wrap">{JSON.stringify(getFilteredData, null, 2)}</pre>
        </div>
      )}
      {(selectedArea === 'session' && sessionStorageData) && (
        <div>
          <h3 className="text-lg font-semibold mb-2">
            Session Storage Data
            {searchQuery && ` (${Object.keys(getFilteredData || {}).length} results)`}
          </h3>
          <pre className="text-sm font-semibold  bg-gray-800 p-4 rounded text-wrap overflow-x-auto whitespace-pre-wrap">{JSON.stringify(getFilteredData, null, 2)}</pre>
        </div>
      )}
      <div className="mt-4">
        <h2 className="text-lg font-semibold">Cookies</h2>
        <button onClick={loadCookies} className="px-4 py-2 bg-[#649ef5] text-white text-sm rounded hover:bg-blue-600 transition duration-300">Load Cookies</button>
        <button onClick={clearCookies} className="px-4 py-2 bg-[#44696d] text-white text-sm rounded hover:bg-red-600 transition duration-300 ml-2">Clear Cookies</button>
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
