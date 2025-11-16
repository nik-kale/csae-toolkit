import React, { useState } from 'react';

const StorageDiff = () => {
  const [snapshot1, setSnapshot1] = useState(null);
  const [snapshot2, setSnapshot2] = useState(null);
  const [diff, setDiff] = useState(null);

  const takeSnapshot = (slot) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript(
        {
          target: { tabId: tabs[0].id },
          function: () => JSON.stringify(window.localStorage),
        },
        (results) => {
          if (results && results[0] && results[0].result) {
            const data = JSON.parse(results[0].result);
            const snapshot = {
              data,
              timestamp: new Date().toISOString(),
              itemCount: Object.keys(data).length
            };

            if (slot === 1) {
              setSnapshot1(snapshot);
            } else {
              setSnapshot2(snapshot);
            }

            // Auto-compare if both snapshots exist
            if ((slot === 1 && snapshot2) || (slot === 2 && snapshot1)) {
              compareDiff(slot === 1 ? snapshot : snapshot1, slot === 1 ? snapshot2 : snapshot);
            }
          }
        }
      );
    });
  };

  const compareDiff = (snap1, snap2) => {
    const added = {};
    const removed = {};
    const modified = {};
    const unchanged = {};

    const keys1 = new Set(Object.keys(snap1.data));
    const keys2 = new Set(Object.keys(snap2.data));

    // Find added keys
    for (const key of keys2) {
      if (!keys1.has(key)) {
        added[key] = snap2.data[key];
      }
    }

    // Find removed keys
    for (const key of keys1) {
      if (!keys2.has(key)) {
        removed[key] = snap1.data[key];
      }
    }

    // Find modified keys
    for (const key of keys1) {
      if (keys2.has(key)) {
        if (snap1.data[key] !== snap2.data[key]) {
          modified[key] = {
            old: snap1.data[key],
            new: snap2.data[key]
          };
        } else {
          unchanged[key] = snap1.data[key];
        }
      }
    }

    setDiff({
      added,
      removed,
      modified,
      unchanged,
      summary: {
        added: Object.keys(added).length,
        removed: Object.keys(removed).length,
        modified: Object.keys(modified).length,
        unchanged: Object.keys(unchanged).length
      }
    });
  };

  const clearSnapshots = () => {
    setSnapshot1(null);
    setSnapshot2(null);
    setDiff(null);
  };

  const exportDiff = () => {
    if (!diff) return;

    const exportData = {
      snapshot1: snapshot1,
      snapshot2: snapshot2,
      diff: diff,
      exportedAt: new Date().toISOString()
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `storage-diff-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 bg-[#464b54] rounded-lg shadow-md mt-4 text-white">
      <h2 className="text-lg font-semibold mb-4">🔍 Storage Diff Tool</h2>

      <p className="text-sm text-gray-300 mb-4">
        Compare localStorage between two states to see what changed
      </p>

      {/* Snapshot Controls */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="p-3 bg-gray-700 rounded">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold">Snapshot 1 {snapshot1 && '✓'}</span>
            {snapshot1 && (
              <span className="text-xs text-gray-400">{snapshot1.itemCount} items</span>
            )}
          </div>
          <button
            onClick={() => takeSnapshot(1)}
            className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm transition"
            aria-label="Take snapshot 1"
          >
            {snapshot1 ? 'Retake' : 'Take Snapshot'}
          </button>
          {snapshot1 && (
            <p className="text-xs text-gray-400 mt-2">
              {new Date(snapshot1.timestamp).toLocaleTimeString()}
            </p>
          )}
        </div>

        <div className="p-3 bg-gray-700 rounded">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold">Snapshot 2 {snapshot2 && '✓'}</span>
            {snapshot2 && (
              <span className="text-xs text-gray-400">{snapshot2.itemCount} items</span>
            )}
          </div>
          <button
            onClick={() => takeSnapshot(2)}
            className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm transition"
            aria-label="Take snapshot 2"
          >
            {snapshot2 ? 'Retake' : 'Take Snapshot'}
          </button>
          {snapshot2 && (
            <p className="text-xs text-gray-400 mt-2">
              {new Date(snapshot2.timestamp).toLocaleTimeString()}
            </p>
          )}
        </div>
      </div>

      {/* Actions */}
      {(snapshot1 || snapshot2) && (
        <div className="flex gap-2 mb-4">
          <button
            onClick={clearSnapshots}
            className="px-3 py-2 bg-red-600 hover:bg-red-700 rounded text-sm transition"
            aria-label="Clear snapshots"
          >
            Clear All
          </button>
          {diff && (
            <button
              onClick={exportDiff}
              className="px-3 py-2 bg-green-600 hover:bg-green-700 rounded text-sm transition"
              aria-label="Export diff"
            >
              Export Diff
            </button>
          )}
        </div>
      )}

      {/* Diff Results */}
      {diff && (
        <div className="space-y-3">
          {/* Summary */}
          <div className="p-3 bg-gray-700 rounded">
            <h3 className="text-sm font-semibold mb-2">Summary</h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex justify-between">
                <span className="text-green-400">✚ Added:</span>
                <span>{diff.summary.added}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-red-400">✖ Removed:</span>
                <span>{diff.summary.removed}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-yellow-400">✎ Modified:</span>
                <span>{diff.summary.modified}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">= Unchanged:</span>
                <span>{diff.summary.unchanged}</span>
              </div>
            </div>
          </div>

          {/* Added */}
          {diff.summary.added > 0 && (
            <details className="bg-green-900/20 border border-green-500 rounded p-3">
              <summary className="cursor-pointer text-sm font-semibold text-green-400">
                ✚ Added ({diff.summary.added})
              </summary>
              <div className="mt-2 space-y-2">
                {Object.entries(diff.added).map(([key, value]) => (
                  <div key={key} className="text-xs bg-black/30 p-2 rounded">
                    <div className="text-green-300 font-semibold">{key}</div>
                    <div className="text-gray-400 mt-1 truncate">{JSON.stringify(value)}</div>
                  </div>
                ))}
              </div>
            </details>
          )}

          {/* Removed */}
          {diff.summary.removed > 0 && (
            <details className="bg-red-900/20 border border-red-500 rounded p-3">
              <summary className="cursor-pointer text-sm font-semibold text-red-400">
                ✖ Removed ({diff.summary.removed})
              </summary>
              <div className="mt-2 space-y-2">
                {Object.entries(diff.removed).map(([key, value]) => (
                  <div key={key} className="text-xs bg-black/30 p-2 rounded">
                    <div className="text-red-300 font-semibold">{key}</div>
                    <div className="text-gray-400 mt-1 truncate">{JSON.stringify(value)}</div>
                  </div>
                ))}
              </div>
            </details>
          )}

          {/* Modified */}
          {diff.summary.modified > 0 && (
            <details className="bg-yellow-900/20 border border-yellow-500 rounded p-3">
              <summary className="cursor-pointer text-sm font-semibold text-yellow-400">
                ✎ Modified ({diff.summary.modified})
              </summary>
              <div className="mt-2 space-y-2">
                {Object.entries(diff.modified).map(([key, { old, new: newVal }]) => (
                  <div key={key} className="text-xs bg-black/30 p-2 rounded">
                    <div className="text-yellow-300 font-semibold mb-1">{key}</div>
                    <div className="text-red-400">- {JSON.stringify(old)}</div>
                    <div className="text-green-400">+ {JSON.stringify(newVal)}</div>
                  </div>
                ))}
              </div>
            </details>
          )}
        </div>
      )}

      {/* No Diff */}
      {!diff && snapshot1 && snapshot2 && (
        <div className="p-4 text-center text-gray-400">
          <p className="text-sm">Take both snapshots to see differences</p>
        </div>
      )}

      {/* Instructions */}
      {!snapshot1 && !snapshot2 && (
        <div className="p-4 bg-blue-900/30 rounded border border-blue-500">
          <p className="text-xs text-blue-200">
            <strong>How to use:</strong>
          </p>
          <ol className="text-xs text-blue-200 mt-2 ml-4 space-y-1">
            <li>1. Take Snapshot 1 (current state)</li>
            <li>2. Make changes to localStorage (clear, add, modify)</li>
            <li>3. Take Snapshot 2 (new state)</li>
            <li>4. View the differences automatically</li>
          </ol>
        </div>
      )}
    </div>
  );
};

export default StorageDiff;
