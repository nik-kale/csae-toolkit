import { useEffect, useState } from 'react';

// Must match HISTORY_KEY in public/content.js.
const HISTORY_KEY = 'csae_selector_history';

function relativeTime(ts) {
  if (!ts) return '';
  const diff = Date.now() - ts;
  const mins = Math.round(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  return `${days}d ago`;
}

function hostOf(url) {
  try {
    return new URL(url).host;
  } catch {
    return url || '';
  }
}

const SelectorHistory = () => {
  const [history, setHistory] = useState([]);
  const [copied, setCopied] = useState(null);

  useEffect(() => {
    if (!chrome?.storage?.local) return undefined;

    const read = () => {
      chrome.storage.local.get({ [HISTORY_KEY]: [] }, (data) => {
        if (chrome.runtime?.lastError) return;
        setHistory(data[HISTORY_KEY] || []);
      });
    };
    read();

    // Live-refresh when the content script records a new selector.
    const onChanged = (changes, area) => {
      if (area === 'local' && changes[HISTORY_KEY]) {
        setHistory(changes[HISTORY_KEY].newValue || []);
      }
    };
    chrome.storage.onChanged?.addListener(onChanged);
    return () => chrome.storage.onChanged?.removeListener(onChanged);
  }, []);

  const copy = (entry, index) => {
    navigator.clipboard
      .writeText(entry.selector)
      .then(() => {
        setCopied(index);
        setTimeout(() => setCopied(null), 1200);
      })
      .catch(() => setCopied(null));
  };

  const clearHistory = () => {
    if (!chrome?.storage?.local) return;
    chrome.storage.local.set({ [HISTORY_KEY]: [] }, () => setHistory([]));
  };

  return (
    <div className="p-4 bg-[#464b54] rounded-lg shadow-md mt-4 text-white">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">Recent Selectors</h2>
        <button
          type="button"
          onClick={clearHistory}
          disabled={history.length === 0}
          className="px-3 py-1 bg-[#44696d] text-white text-xs rounded hover:bg-red-600 transition duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Clear
        </button>
      </div>
      {history.length === 0 ? (
        <p className="text-sm text-gray-300">
          No selectors yet. Use “Grab CSS Selector”, then click an element to capture one.
        </p>
      ) : (
        <ul className="space-y-2 max-h-72 overflow-y-auto">
          {history.map((entry, index) => (
            <li key={`${entry.selector}-${entry.at}`} className="bg-gray-800 rounded p-2">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    entry.kind === 'xpath'
                      ? 'bg-[#00BCEA] text-[#23282e]'
                      : 'bg-[#4ADC71] text-[#23282e]'
                  }`}
                >
                  {entry.kind === 'xpath' ? 'XPath' : 'CSS'}
                </span>
                <button
                  type="button"
                  onClick={() => copy(entry, index)}
                  className="px-2 py-0.5 bg-[#649ef5] text-white text-[10px] rounded hover:bg-blue-600 transition duration-300"
                >
                  {copied === index ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <code className="block text-xs break-all text-[#e6edf3]">{entry.selector}</code>
              <div className="text-[10px] text-gray-400 mt-1 flex justify-between gap-2">
                <span className="truncate">{hostOf(entry.url)}</span>
                <span className="shrink-0">{relativeTime(entry.at)}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SelectorHistory;
