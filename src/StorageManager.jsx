import React, { useState } from 'react';

const StorageManager = () => {
  const [localStorageData, setLocalStorageData] = useState(null);
  const [sessionStorageData, setSessionStorageData] = useState(null);
  const [cookiesData, setCookiesData] = useState(null);

  const loadLocalStorage = () => {
    const localStorageItems = { ...localStorage };
    setLocalStorageData(localStorageItems);
  };

  const clearLocalStorage = () => {
    localStorage.clear();
    setLocalStorageData(null);
  };

  const loadSessionStorage = () => {
    const sessionStorageItems = { ...sessionStorage };
    setSessionStorageData(sessionStorageItems);
  };

  const clearSessionStorage = () => {
    sessionStorage.clear();
    setSessionStorageData(null);
  };

  const loadCookies = () => {
    chrome.runtime.sendMessage({ action: 'getCookies' }, (response) => {
      if (response && response.cookies) {
        setCookiesData(response.cookies);
      } else {
        console.error('Failed to load cookies');
      }
    });
  };

  const clearCookies = () => {
    chrome.runtime.sendMessage({ action: 'clearCookies' }, (response) => {
      if (response && response.success) {
        setCookiesData(null);
      } else {
        console.error('Failed to clear cookies');
      }
    });
  };

  return (
    <div className="storage-manager p-4 bg-[#464b54] rounded-lg shadow-md mt-4 text-white">
      <h1 className="text-xl font-bold mb-4">Storage Manager</h1>

      <div>
        <h2 className="text-lg font-semibold mt-4">Local Storage</h2>
        <button onClick={loadLocalStorage} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300">Load Local Storage</button>
        <button onClick={clearLocalStorage} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-300 ml-2">Clear Local Storage</button>
        {localStorageData && <pre className="mt-2">{JSON.stringify(localStorageData, null, 2)}</pre>}
      </div>

      <div>
        <h2 className="text-lg font-semibold mt-4">Session Storage</h2>
        <button onClick={loadSessionStorage} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300">Load Session Storage</button>
        <button onClick={clearSessionStorage} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-300 ml-2">Clear Session Storage</button>
        {sessionStorageData && <pre className="mt-2">{JSON.stringify(sessionStorageData, null, 2)}</pre>}
      </div>

      <div>
        <h2 className="text-lg font-semibold mt-4">Cookies</h2>
        <button onClick={loadCookies} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300">Load Cookies</button>
        <button onClick={clearCookies} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-300 ml-2">Clear Cookies</button>
        {cookiesData && <pre className="mt-2">{JSON.stringify(cookiesData, null, 2)}</pre>}
      </div>
    </div>
  );
};

export default StorageManager;
