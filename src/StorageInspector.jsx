import React, { useState, useEffect } from 'react';

const StorageInspector = () => {
  const [storageData, setStorageData] = useState(null);
  const [selectedArea, setSelectedArea] = useState('local');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadStorage = (area) => {
    setLoading(true);
    setError(null);
    chrome.storage[area].get(null, (items) => {
      if (chrome.runtime.lastError) {
        console.error('Failed to load storage:', chrome.runtime.lastError.message);
        setError(chrome.runtime.lastError.message);
        setStorageData(null);
      } else {
        console.log('Loaded storage data:', items);
        setStorageData(items);
      }
      setLoading(false);
    });
  };

  const clearStorage = (area) => {
    setLoading(true);
    setError(null);
    chrome.storage[area].clear(() => {
      if (chrome.runtime.lastError) {
        console.error('Failed to clear storage:', chrome.runtime.lastError.message);
        setError(chrome.runtime.lastError.message);
      } else {
        console.log('Cleared storage data');
        setStorageData({});
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    loadStorage(selectedArea);
  }, [selectedArea]);

  return (
    <div className="p-4 bg-[#464b54] rounded-lg shadow-md mt-4 text-white">
      <h2 className="text-lg font-semibold mb-4">Storage Area Inspector</h2>
      <div className="mb-4">
        <label htmlFor="storageArea" className="block mb-2">Select Storage Area:</label>
        <select
          id="storageArea"
          value={selectedArea}
          onChange={(e) => setSelectedArea(e.target.value)}
          className="p-2 bg-gray-700 text-white rounded"
        >
          <option value="local">Local</option>
          <option value="sync">Sync</option>
          <option value="managed">Managed</option>
          <option value="session">Session</option>
        </select>
      </div>
      <button
        className="px-4 py-2 bg-[#649ef5] text-white rounded hover:bg-blue-600 transition duration-300 mb-4"
        onClick={() => loadStorage(selectedArea)}
        disabled={loading}
      >
        {loading ? 'Loading...' : 'Load Storage Data'}
      </button>
      <button
        className="px-4 py-2 bg-[#44696d] text-white rounded hover:bg-red-600 transition duration-300 mb-4"
        onClick={() => clearStorage(selectedArea)}
        disabled={loading}
      >
        {loading ? 'Clearing...' : 'Clear Storage Data'}
      </button>
      {error && (
        <div className="bg-red-500 text-white p-2 rounded mb-4">
          <p>Error: {error}</p>
        </div>
      )}
      {storageData && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Storage Data:</h3>
          <pre className="text-sm bg-gray-800 p-4 rounded">{JSON.stringify(storageData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default StorageInspector;
