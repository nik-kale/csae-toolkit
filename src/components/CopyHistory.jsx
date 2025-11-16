import React, { useState, useEffect } from 'react';

const CopyHistory = () => {
  const [history, setHistory] = useState([]);
  const [copiedIndex, setCopiedIndex] = useState(null);

  // Load history from chrome.storage.local
  useEffect(() => {
    loadHistory();

    // Listen for new copied selectors
    const messageListener = (message) => {
      if (message.action === 'selectorCopied') {
        addToHistory(message.selector, message.value);
      }
    };

    chrome.runtime.onMessage.addListener(messageListener);

    return () => {
      chrome.runtime.onMessage.removeListener(messageListener);
    };
  }, []);

  const loadHistory = () => {
    chrome.storage.local.get(['copyHistory'], (result) => {
      if (result.copyHistory) {
        setHistory(result.copyHistory);
      }
    });
  };

  const addToHistory = (selector, value) => {
    const newEntry = {
      selector,
      value: value || '',
      timestamp: new Date().toISOString(),
      id: Date.now()
    };

    const updatedHistory = [newEntry, ...history].slice(0, 50); // Keep last 50 entries
    setHistory(updatedHistory);
    chrome.storage.local.set({ copyHistory: updatedHistory });
  };

  const copyToClipboard = (selector, index) => {
    navigator.clipboard.writeText(selector).then(() => {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    });
  };

  const clearHistory = () => {
    setHistory([]);
    chrome.storage.local.set({ copyHistory: [] });
  };

  const removeEntry = (id) => {
    const updatedHistory = history.filter(entry => entry.id !== id);
    setHistory(updatedHistory);
    chrome.storage.local.set({ copyHistory: updatedHistory });
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="p-4 bg-[#464b54] rounded-lg shadow-md mt-4 text-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Copy History</h2>
        {history.length > 0 && (
          <button
            onClick={clearHistory}
            className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition duration-300"
            aria-label="Clear history"
          >
            Clear All
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <p className="text-gray-400 text-sm">No selectors copied yet. Copy a selector to see it here.</p>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {history.map((entry, index) => (
            <div
              key={entry.id}
              className="bg-gray-700 p-3 rounded hover:bg-gray-600 transition duration-200"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs text-gray-400">{formatTimestamp(entry.timestamp)}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => copyToClipboard(entry.selector, index)}
                    className="text-xs px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded transition duration-200"
                    aria-label="Copy selector"
                  >
                    {copiedIndex === index ? '✓ Copied' : 'Copy'}
                  </button>
                  <button
                    onClick={() => removeEntry(entry.id)}
                    className="text-xs px-2 py-1 bg-red-600 hover:bg-red-700 rounded transition duration-200"
                    aria-label="Remove entry"
                  >
                    ×
                  </button>
                </div>
              </div>
              <div className="text-sm break-all">
                <div className="mb-1">
                  <span className="text-green-400 font-semibold">Selector: </span>
                  <code className="text-blue-300">{entry.selector}</code>
                </div>
                {entry.value && (
                  <div className="text-xs text-gray-300 truncate">
                    <span className="text-green-400">Value: </span>
                    {entry.value.substring(0, 100)}{entry.value.length > 100 ? '...' : ''}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CopyHistory;
