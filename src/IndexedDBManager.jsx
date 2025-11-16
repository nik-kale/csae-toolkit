import React, { useState } from 'react';

const IndexedDBManager = () => {
  const [databases, setDatabases] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadIndexedDB = () => {
    setLoading(true);
    setError(null);
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length === 0) {
        setError('No active tab found');
        setLoading(false);
        return;
      }

      chrome.scripting.executeScript(
        {
          target: { tabId: tabs[0].id },
          function: async () => {
            try {
              const dbs = await window.indexedDB.databases();
              return JSON.stringify(dbs);
            } catch (e) {
              return JSON.stringify({ error: e.message });
            }
          },
        },
        (results) => {
          setLoading(false);
          if (results && results[0] && results[0].result) {
            const data = JSON.parse(results[0].result);
            if (data.error) {
              setError(data.error);
            } else {
              setDatabases(data);
            }
          } else {
            setError('Failed to load IndexedDB data');
          }
        }
      );
    });
  };

  const clearIndexedDB = () => {
    setLoading(true);
    setError(null);
    chrome.runtime.sendMessage({ action: 'clearIndexedDB' }, (response) => {
      setLoading(false);
      if (response && response.success) {
        setDatabases([]);
        alert('IndexedDB cleared successfully!');
      } else {
        setError(response?.error || 'Failed to clear IndexedDB');
      }
    });
  };

  const clearBrowserCache = () => {
    setLoading(true);
    setError(null);
    chrome.runtime.sendMessage({ action: 'clearBrowserCache' }, (response) => {
      setLoading(false);
      if (response && response.success) {
        alert('Browser cache cleared successfully!');
      } else {
        setError(response?.error || 'Failed to clear cache');
      }
    });
  };

  return (
    <div className="p-4 bg-[#464b54] rounded-lg shadow-md mt-4 text-white">
      <h2 className="text-lg font-semibold mb-4">Advanced Storage Manager</h2>

      <div className="mb-4">
        <h3 className="text-md font-semibold mb-2">IndexedDB</h3>
        <div className="flex gap-2">
          <button
            className="px-4 py-2 bg-[#649ef5] text-white text-sm rounded hover:bg-blue-600 transition duration-300"
            onClick={loadIndexedDB}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Load IndexedDB'}
          </button>
          <button
            className="px-4 py-2 bg-[#44696d] text-white text-sm rounded hover:bg-red-600 transition duration-300"
            onClick={clearIndexedDB}
            disabled={loading}
          >
            {loading ? 'Clearing...' : 'Clear IndexedDB'}
          </button>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-md font-semibold mb-2">Browser Cache</h3>
        <button
          className="px-4 py-2 bg-[#44696d] text-white text-sm rounded hover:bg-red-600 transition duration-300"
          onClick={clearBrowserCache}
          disabled={loading}
        >
          {loading ? 'Clearing...' : 'Clear Browser Cache'}
        </button>
      </div>

      {error && (
        <div className="bg-red-500 text-white text-sm p-2 rounded mb-4">
          <p>Error: {error}</p>
        </div>
      )}

      {databases && (
        <div>
          <h3 className="text-lg font-semibold mb-2">IndexedDB Databases:</h3>
          {databases.length === 0 ? (
            <p className="text-sm text-gray-400">No databases found or cleared successfully.</p>
          ) : (
            <pre className="text-sm font-semibold bg-gray-800 p-4 rounded text-wrap overflow-x-auto whitespace-pre-wrap">
              {JSON.stringify(databases, null, 2)}
            </pre>
          )}
        </div>
      )}
    </div>
  );
};

export default IndexedDBManager;
