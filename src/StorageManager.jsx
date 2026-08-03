import { useMemo, useState } from 'react';

// Web Storage globals keyed by the UI's short area name.
const AREA_GLOBAL = { local: 'localStorage', session: 'sessionStorage' };

function downloadJson(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

const StorageManager = () => {
  const [localStorageData, setLocalStorageData] = useState(null);
  const [sessionStorageData, setSessionStorageData] = useState(null);
  const [cookiesData, setCookiesData] = useState(null);
  const [cookieScope, setCookieScope] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedArea, setSelectedArea] = useState('local');
  const [filter, setFilter] = useState('');
  const [editingKey, setEditingKey] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');

  const activeData = selectedArea === 'local' ? localStorageData : sessionStorageData;

  const withActiveTab = (cb) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs || !tabs[0]) {
        setLoading(false);
        setError('No active tab to read storage from');
        return;
      }
      cb(tabs[0]);
    });
  };

  const readStorage = (areaGlobal) => {
    setLoading(true);
    setError(null);
    withActiveTab((tab) => {
      chrome.scripting.executeScript(
        {
          target: { tabId: tab.id },
          func: (area) => JSON.stringify(window[area]),
          args: [areaGlobal],
        },
        (results) => {
          setLoading(false);
          const raw = results && results[0] && results[0].result;
          const label = areaGlobal === 'localStorage' ? 'local' : 'session';
          if (raw == null) {
            setError(`Failed to load ${label} storage`);
            return;
          }
          // Guard the parse: window storage should stringify cleanly, but a
          // hostile or corrupt value should surface an error, not throw.
          try {
            const parsed = JSON.parse(raw);
            if (areaGlobal === 'localStorage') setLocalStorageData(parsed);
            else setSessionStorageData(parsed);
          } catch {
            setError(`Failed to parse ${label} storage data`);
          }
        }
      );
    });
  };

  const clearStorage = (areaGlobal) => {
    setLoading(true);
    setError(null);
    withActiveTab((tab) => {
      chrome.scripting.executeScript(
        {
          target: { tabId: tab.id },
          func: (area) => {
            window[area].clear();
            return true;
          },
          args: [areaGlobal],
        },
        () => {
          setLoading(false);
          if (areaGlobal === 'localStorage') setLocalStorageData({});
          else setSessionStorageData({});
        }
      );
    });
  };

  const saveItem = (areaGlobal, key, value) => {
    setError(null);
    withActiveTab((tab) => {
      chrome.scripting.executeScript(
        {
          target: { tabId: tab.id },
          func: (area, k, v) => {
            window[area].setItem(k, v);
            return true;
          },
          args: [areaGlobal, key, value],
        },
        () => readStorage(areaGlobal)
      );
    });
  };

  const deleteItem = (areaGlobal, key) => {
    setError(null);
    withActiveTab((tab) => {
      chrome.scripting.executeScript(
        {
          target: { tabId: tab.id },
          func: (area, k) => {
            window[area].removeItem(k);
            return true;
          },
          args: [areaGlobal, key],
        },
        () => readStorage(areaGlobal)
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
        setCookieScope(response.scope || null);
      } else {
        setError(
          response?.error === 'unauthorized'
            ? 'Not authorized to read cookies'
            : 'Failed to load cookies'
        );
      }
    });
  };

  const clearCookies = () => {
    const scopeLabel = cookieScope ? `for ${cookieScope}` : 'for the active tab';
    if (!window.confirm(`Clear all cookies ${scopeLabel}? You may be signed out of this site.`)) {
      return;
    }
    setLoading(true);
    setError(null);
    chrome.runtime.sendMessage({ action: 'clearCookies' }, (response) => {
      setLoading(false);
      if (response && response.success) {
        setCookiesData([]);
        setCookieScope(response.scope || null);
      } else {
        setError(response?.error || 'Failed to clear cookies');
      }
    });
  };

  const deleteCookie = (cookie) => {
    setError(null);
    chrome.runtime.sendMessage(
      { action: 'removeCookie', name: cookie.name, path: cookie.path },
      (response) => {
        if (response && response.success) {
          setCookiesData((prev) =>
            (prev || []).filter((c) => !(c.name === cookie.name && c.path === cookie.path))
          );
        } else {
          setError(response?.error || 'Failed to delete cookie');
        }
      }
    );
  };

  const loadSelectedStorage = () => readStorage(AREA_GLOBAL[selectedArea]);
  const clearSelectedStorage = () => clearStorage(AREA_GLOBAL[selectedArea]);

  const beginEdit = (key, value) => {
    setEditingKey(key);
    setEditValue(String(value));
  };

  const commitEdit = (key) => {
    saveItem(AREA_GLOBAL[selectedArea], key, editValue);
    setEditingKey(null);
    setEditValue('');
  };

  const addItem = () => {
    if (!newKey) return;
    saveItem(AREA_GLOBAL[selectedArea], newKey, newValue);
    setNewKey('');
    setNewValue('');
  };

  const filteredEntries = useMemo(() => {
    if (!activeData) return [];
    const q = filter.toLowerCase();
    return Object.entries(activeData).filter(
      ([key, value]) =>
        !q || key.toLowerCase().includes(q) || String(value).toLowerCase().includes(q)
    );
  }, [activeData, filter]);

  const filteredCookies = useMemo(() => {
    if (!cookiesData) return [];
    const q = filter.toLowerCase();
    return cookiesData.filter(
      (c) => !q || c.name.toLowerCase().includes(q) || String(c.value).toLowerCase().includes(q)
    );
  }, [cookiesData, filter]);

  const smallBtn =
    'px-2 py-1 text-xs rounded transition duration-300 disabled:opacity-40 disabled:cursor-not-allowed';

  return (
    <div className="p-4 bg-[#464b54] rounded-lg shadow-md mt-4 text-white">
      <h2 className="text-lg font-semibold mb-4">Storage Manager</h2>

      <div className="mb-3">
        <label htmlFor="storageArea" className="block mb-2 text-sm">
          Select Storage Area:
        </label>
        <select
          id="storageArea"
          value={selectedArea}
          onChange={(e) => {
            setSelectedArea(e.target.value);
            setEditingKey(null);
          }}
          className="p-2 bg-gray-700 text-white rounded text-sm"
        >
          <option value="local">Local</option>
          <option value="session">Session</option>
        </select>
      </div>

      <div className="mb-3">
        <label htmlFor="storageFilter" className="block mb-1 text-sm">
          Search keys and values:
        </label>
        <input
          id="storageFilter"
          type="search"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter…"
          className="w-full p-2 bg-gray-700 text-white rounded text-sm"
        />
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <button
          className={`${smallBtn} px-4 py-2 text-sm bg-[#649ef5] hover:bg-blue-600`}
          onClick={loadSelectedStorage}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Load Storage Data'}
        </button>
        <button
          className={`${smallBtn} px-4 py-2 text-sm bg-[#44696d] hover:bg-red-600`}
          onClick={clearSelectedStorage}
          disabled={loading}
        >
          {loading ? 'Clearing...' : 'Clear Storage Data'}
        </button>
        <button
          className={`${smallBtn} px-4 py-2 text-sm bg-[#3a4750] hover:bg-[#556069]`}
          onClick={() => downloadJson(activeData || {}, `${selectedArea}-storage.json`)}
          disabled={!activeData}
        >
          Export JSON
        </button>
      </div>

      {error && (
        <div className="bg-red-500 text-white text-sm p-2 rounded mb-4" role="alert">
          <p>Error: {error}</p>
        </div>
      )}

      {activeData && (
        <div className="mb-4">
          <h3 className="text-sm font-semibold mb-2">
            {selectedArea === 'local' ? 'Local' : 'Session'} Storage ({filteredEntries.length})
          </h3>
          {filteredEntries.length === 0 ? (
            <p className="text-xs text-gray-300">No matching keys.</p>
          ) : (
            <ul className="space-y-2 max-h-72 overflow-y-auto">
              {filteredEntries.map(([key, value]) => (
                <li key={key} className="bg-gray-800 rounded p-2">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <code className="text-xs text-[#00BCEA] break-all">{key}</code>
                    <div className="flex gap-1 shrink-0">
                      {editingKey === key ? (
                        <>
                          <button
                            className={`${smallBtn} bg-[#4ADC71] text-[#23282e] hover:bg-green-400`}
                            onClick={() => commitEdit(key)}
                          >
                            Save
                          </button>
                          <button
                            className={`${smallBtn} bg-[#3a4750] hover:bg-[#556069]`}
                            onClick={() => setEditingKey(null)}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className={`${smallBtn} bg-[#649ef5] hover:bg-blue-600`}
                            onClick={() => beginEdit(key, value)}
                          >
                            Edit
                          </button>
                          <button
                            className={`${smallBtn} bg-[#44696d] hover:bg-red-600`}
                            onClick={() => deleteItem(AREA_GLOBAL[selectedArea], key)}
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  {editingKey === key ? (
                    <textarea
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      aria-label={`Value for ${key}`}
                      className="w-full p-2 bg-gray-900 text-white rounded text-xs font-mono"
                      rows={3}
                    />
                  ) : (
                    <code className="block text-xs break-all text-[#e6edf3]">{String(value)}</code>
                  )}
                </li>
              ))}
            </ul>
          )}

          <div className="mt-3 border-t border-gray-600 pt-3">
            <h4 className="text-xs font-semibold mb-2">Add / overwrite key</h4>
            <div className="flex flex-col gap-2">
              <input
                type="text"
                value={newKey}
                onChange={(e) => setNewKey(e.target.value)}
                placeholder="key"
                aria-label="New storage key"
                className="w-full p-2 bg-gray-700 text-white rounded text-xs"
              />
              <input
                type="text"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                placeholder="value"
                aria-label="New storage value"
                className="w-full p-2 bg-gray-700 text-white rounded text-xs"
              />
              <button
                className={`${smallBtn} px-4 py-2 text-sm bg-[#649ef5] hover:bg-blue-600 self-start`}
                onClick={addItem}
                disabled={!newKey}
              >
                Save Key
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4">
        <h3 className="text-lg font-semibold">Cookies</h3>
        <p className="text-xs text-gray-300 mb-2">
          Scoped to the active tab{cookieScope ? ` (${cookieScope})` : ''}. Clearing affects only
          this site.
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={loadCookies}
            className={`${smallBtn} px-4 py-2 text-sm bg-[#649ef5] hover:bg-blue-600`}
          >
            Load Cookies
          </button>
          <button
            onClick={clearCookies}
            className={`${smallBtn} px-4 py-2 text-sm bg-[#44696d] hover:bg-red-600`}
          >
            Clear Cookies
          </button>
          <button
            onClick={() => downloadJson(cookiesData || [], 'cookies.json')}
            className={`${smallBtn} px-4 py-2 text-sm bg-[#3a4750] hover:bg-[#556069]`}
            disabled={!cookiesData}
          >
            Export JSON
          </button>
        </div>
        {cookiesData && (
          <div className="mt-3">
            <h4 className="text-sm font-semibold mb-2">Cookies ({filteredCookies.length})</h4>
            {filteredCookies.length === 0 ? (
              <p className="text-xs text-gray-300">No matching cookies.</p>
            ) : (
              <ul className="space-y-2 max-h-72 overflow-y-auto">
                {filteredCookies.map((cookie) => (
                  <li
                    key={`${cookie.name}-${cookie.domain}-${cookie.path}`}
                    className="bg-gray-800 rounded p-2"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <code className="text-xs text-[#00BCEA] break-all">{cookie.name}</code>
                      <button
                        className={`${smallBtn} bg-[#44696d] hover:bg-red-600 shrink-0`}
                        onClick={() => deleteCookie(cookie)}
                      >
                        Delete
                      </button>
                    </div>
                    <code className="block text-xs break-all text-[#e6edf3]">{cookie.value}</code>
                    <div className="text-[10px] text-gray-400 mt-1">
                      {cookie.domain}
                      {cookie.path}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StorageManager;
