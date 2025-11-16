import React, { useState } from 'react';
import ConfirmDialog from './components/ConfirmDialog';
import LoadingSpinner from './components/LoadingSpinner';
import Notification from './components/Notification';
import { downloadFile, readFileAsText, formatJSON } from './utils/helpers';
import { MESSAGES } from './constants';

/**
 * StorageManager Component
 * Manages browser storage (localStorage, sessionStorage, cookies)
 * with export/import, search/filter capabilities
 */
const StorageManager = () => {
  const [localStorageData, setLocalStorageData] = useState(null);
  const [sessionStorageData, setSessionStorageData] = useState(null);
  const [cookiesData, setCookiesData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedArea, setSelectedArea] = useState('local');
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });
  const [notification, setNotification] = useState(null);

  const showNotification = (type, message) => {
    setNotification({ type, message });
  };

  const closeNotification = () => {
    setNotification(null);
  };

  const loadLocalStorage = () => {
    setLoading(true);
    setError(null);
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs || tabs.length === 0) {
        setError('No active tab found');
        setLoading(false);
        return;
      }
      chrome.scripting.executeScript(
        {
          target: { tabId: tabs[0].id },
          function: () => JSON.stringify(window.localStorage),
        },
        (results) => {
          setLoading(false);
          if (chrome.runtime.lastError) {
            setError(chrome.runtime.lastError.message);
            showNotification('error', MESSAGES.loadError);
          } else if (results && results[0] && results[0].result) {
            try {
              setLocalStorageData(JSON.parse(results[0].result));
              showNotification('success', 'Local storage loaded successfully');
            } catch (err) {
              setError('Failed to parse storage data');
              showNotification('error', MESSAGES.loadError);
            }
          } else {
            setError('Failed to load local storage');
            showNotification('error', MESSAGES.loadError);
          }
        }
      );
    });
  };

  const clearLocalStorage = () => {
    setConfirmDialog({
      isOpen: true,
      title: 'Clear Local Storage',
      message: MESSAGES.clearStorageConfirm,
      onConfirm: () => {
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
              if (chrome.runtime.lastError) {
                setError(chrome.runtime.lastError.message);
                showNotification('error', 'Failed to clear storage');
              } else {
                setLocalStorageData({});
                showNotification('success', MESSAGES.clearSuccess);
              }
            }
          );
        });
        setConfirmDialog({ ...confirmDialog, isOpen: false });
      },
    });
  };

  const loadSessionStorage = () => {
    setLoading(true);
    setError(null);
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs || tabs.length === 0) {
        setError('No active tab found');
        setLoading(false);
        return;
      }
      chrome.scripting.executeScript(
        {
          target: { tabId: tabs[0].id },
          function: () => JSON.stringify(window.sessionStorage),
        },
        (results) => {
          setLoading(false);
          if (chrome.runtime.lastError) {
            setError(chrome.runtime.lastError.message);
            showNotification('error', MESSAGES.loadError);
          } else if (results && results[0] && results[0].result) {
            try {
              setSessionStorageData(JSON.parse(results[0].result));
              showNotification('success', 'Session storage loaded successfully');
            } catch (err) {
              setError('Failed to parse storage data');
              showNotification('error', MESSAGES.loadError);
            }
          } else {
            setError('Failed to load session storage');
            showNotification('error', MESSAGES.loadError);
          }
        }
      );
    });
  };

  const clearSessionStorage = () => {
    setConfirmDialog({
      isOpen: true,
      title: 'Clear Session Storage',
      message: MESSAGES.clearStorageConfirm,
      onConfirm: () => {
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
              if (chrome.runtime.lastError) {
                setError(chrome.runtime.lastError.message);
                showNotification('error', 'Failed to clear storage');
              } else {
                setSessionStorageData({});
                showNotification('success', MESSAGES.clearSuccess);
              }
            }
          );
        });
        setConfirmDialog({ ...confirmDialog, isOpen: false });
      },
    });
  };

  const loadCookies = () => {
    setLoading(true);
    setError(null);
    chrome.runtime.sendMessage({ action: 'getCookies' }, (response) => {
      setLoading(false);
      if (chrome.runtime.lastError) {
        setError(chrome.runtime.lastError.message);
        showNotification('error', MESSAGES.loadError);
      } else if (response && response.cookies) {
        setCookiesData(response.cookies);
        showNotification('success', 'Cookies loaded successfully');
      } else {
        setError('Failed to load cookies');
        showNotification('error', MESSAGES.loadError);
      }
    });
  };

  const clearCookies = () => {
    setConfirmDialog({
      isOpen: true,
      title: 'Clear Cookies',
      message: MESSAGES.clearCookiesConfirm,
      onConfirm: () => {
        setLoading(true);
        setError(null);
        chrome.runtime.sendMessage({ action: 'clearCookies' }, (response) => {
          setLoading(false);
          if (chrome.runtime.lastError) {
            setError(chrome.runtime.lastError.message);
            showNotification('error', 'Failed to clear cookies');
          } else if (response && response.success) {
            setCookiesData({});
            showNotification('success', MESSAGES.clearSuccess);
          } else {
            setError('Failed to clear cookies');
            showNotification('error', 'Failed to clear cookies');
          }
        });
        setConfirmDialog({ ...confirmDialog, isOpen: false });
      },
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

  const exportStorage = () => {
    const data = selectedArea === 'local' ? localStorageData : sessionStorageData;
    if (!data) {
      showNotification('warning', 'No data to export. Please load storage first.');
      return;
    }
    const filename = `${selectedArea}-storage-${new Date().toISOString()}.json`;
    downloadFile(formatJSON(data), filename);
    showNotification('success', 'Storage data exported successfully');
  };

  const importStorage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      try {
        const content = await readFileAsText(file);
        const data = JSON.parse(content);

        if (selectedArea === 'local') {
          setLocalStorageData(data);
          showNotification('success', 'Storage data imported successfully');
        } else {
          setSessionStorageData(data);
          showNotification('success', 'Storage data imported successfully');
        }
      } catch (err) {
        showNotification('error', 'Failed to import data. Invalid JSON format.');
      }
    };
    input.click();
  };

  const filterData = (data) => {
    if (!searchQuery || !data) return data;
    const filtered = {};
    Object.keys(data).forEach((key) => {
      if (
        key.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(data[key]).toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        filtered[key] = data[key];
      }
    });
    return filtered;
  };

  const getDisplayData = () => {
    if (selectedArea === 'local') return filterData(localStorageData);
    if (selectedArea === 'session') return filterData(sessionStorageData);
    return null;
  };

  return (
    <div className="p-4 bg-[#464b54] rounded-lg shadow-md mt-4 text-white" role="region" aria-label="Storage Manager">
      <h2 className="text-lg font-semibold mb-4">Storage Manager</h2>

      <div className="mb-4">
        <label htmlFor="storageArea" className="block mb-2 text-sm font-medium">
          Select Storage Area:
        </label>
        <select
          id="storageArea"
          value={selectedArea}
          onChange={(e) => setSelectedArea(e.target.value)}
          className="input-field w-full"
          aria-label="Storage area selector"
        >
          <option value="local">Local Storage</option>
          <option value="session">Session Storage</option>
        </select>
      </div>

      <div className="mb-4">
        <label htmlFor="searchQuery" className="block mb-2 text-sm font-medium">
          Search/Filter:
        </label>
        <input
          type="text"
          id="searchQuery"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search keys or values..."
          className="input-field w-full"
          aria-label="Search storage data"
        />
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <button
          className="btn-primary"
          onClick={loadSelectedStorage}
          disabled={loading}
          aria-label={`Load ${selectedArea} storage data`}
        >
          {loading ? 'Loading...' : 'Load Storage Data'}
        </button>
        <button
          className="btn-danger"
          onClick={clearSelectedStorage}
          disabled={loading}
          aria-label={`Clear ${selectedArea} storage data`}
        >
          Clear Storage Data
        </button>
        <button
          className="btn-secondary"
          onClick={exportStorage}
          disabled={loading || !getDisplayData()}
          aria-label="Export storage data"
        >
          Export
        </button>
        <button
          className="btn-secondary"
          onClick={importStorage}
          disabled={loading}
          aria-label="Import storage data"
        >
          Import
        </button>
      </div>

      {loading && <LoadingSpinner message={`Loading ${selectedArea} storage...`} />}

      {error && (
        <div className="bg-red-500 text-white text-sm p-3 rounded mb-4" role="alert">
          <p>Error: {error}</p>
        </div>
      )}

      {getDisplayData() && (
        <div>
          <h3 className="text-lg font-semibold mb-2 capitalize">
            {selectedArea} Storage Data:
          </h3>
          <pre className="text-sm font-semibold bg-gray-800 p-4 rounded overflow-x-auto whitespace-pre-wrap">
            {formatJSON(getDisplayData())}
          </pre>
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-gray-600">
        <h2 className="text-lg font-semibold mb-3">Cookies</h2>
        <div className="flex gap-2 mb-4">
          <button
            onClick={loadCookies}
            className="btn-primary"
            disabled={loading}
            aria-label="Load cookies"
          >
            Load Cookies
          </button>
          <button
            onClick={clearCookies}
            className="btn-danger"
            disabled={loading}
            aria-label="Clear cookies"
          >
            Clear Cookies
          </button>
        </div>
        {cookiesData && (
          <div>
            <h3 className="text-lg font-semibold mb-2 mt-4">Cookies Data:</h3>
            <pre className="text-sm font-semibold bg-gray-800 p-4 rounded overflow-x-auto whitespace-pre-wrap">
              {formatJSON(cookiesData)}
            </pre>
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
      />

      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={closeNotification}
        />
      )}
    </div>
  );
};

export default StorageManager;
