import React, { useState, useEffect } from 'react';
import { getChromeStorageQuota, PerformanceMonitor as PerfMonitor } from '../utils/performance';

const PerformanceMonitor = () => {
  const [storageQuota, setStorageQuota] = useState(null);
  const [metrics, setMetrics] = useState({
    copyHistoryCount: 0,
    settingsCount: 0,
    totalStorageItems: 0,
    estimatedSize: 0
  });
  const [performanceMetrics, setPerformanceMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMetrics();
    const interval = setInterval(loadMetrics, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const loadMetrics = async () => {
    try {
      // Get storage quota
      const quota = await getChromeStorageQuota();
      setStorageQuota(quota);

      // Get storage metrics
      chrome.storage.local.get(null, (data) => {
        const copyHistory = data.copyHistory || [];
        const settings = data.settings || {};
        const totalItems = Object.keys(data).length;
        const estimatedSize = JSON.stringify(data).length;

        setMetrics({
          copyHistoryCount: copyHistory.length,
          settingsCount: Object.keys(settings).length,
          totalStorageItems: totalItems,
          estimatedSize
        });

        setLoading(false);
      });

      // Get performance metrics if available
      if (window.performance) {
        const perfData = {
          memory: performance.memory ? {
            usedJSHeapSize: (performance.memory.usedJSHeapSize / 1048576).toFixed(2),
            totalJSHeapSize: (performance.memory.totalJSHeapSize / 1048576).toFixed(2),
            jsHeapSizeLimit: (performance.memory.jsHeapSizeLimit / 1048576).toFixed(2)
          } : null,
          timing: {
            domContentLoaded: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart,
            loadComplete: performance.timing.loadEventEnd - performance.timing.navigationStart
          }
        };
        setPerformanceMetrics(perfData);
      }
    } catch (error) {
      console.error('Failed to load metrics:', error);
      setLoading(false);
    }
  };

  const clearCopyHistory = () => {
    if (confirm('Are you sure you want to clear copy history?')) {
      chrome.storage.local.set({ copyHistory: [] }, () => {
        loadMetrics();
      });
    }
  };

  const optimizeStorage = () => {
    chrome.storage.local.get(null, (data) => {
      // Remove duplicate entries in copy history
      if (data.copyHistory && Array.isArray(data.copyHistory)) {
        const seen = new Set();
        const uniqueHistory = data.copyHistory.filter(entry => {
          const key = `${entry.selector}-${entry.timestamp}`;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });

        chrome.storage.local.set({ copyHistory: uniqueHistory }, () => {
          alert(`Optimized! Removed ${data.copyHistory.length - uniqueHistory.length} duplicate entries.`);
          loadMetrics();
        });
      }
    });
  };

  if (loading) {
    return (
      <div className="p-4 bg-[#464b54] rounded-lg shadow-md mt-4 text-white">
        <div className="text-center">Loading metrics...</div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-[#464b54] rounded-lg shadow-md mt-4 text-white">
      <h2 className="text-xl font-bold mb-4 text-center">Performance Monitor</h2>

      {/* Storage Quota */}
      {storageQuota && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Storage Quota</h3>
          <div className="bg-gray-700 p-3 rounded">
            <div className="flex justify-between text-sm mb-2">
              <span>Usage:</span>
              <span>{storageQuota.usageKB} KB / {(storageQuota.quota / 1024).toFixed(0)} KB</span>
            </div>
            <div className="w-full bg-gray-600 rounded-full h-4 mb-2">
              <div
                className={`h-4 rounded-full transition-all ${
                  storageQuota.critical ? 'bg-red-600' :
                  storageQuota.warning ? 'bg-yellow-600' :
                  'bg-green-600'
                }`}
                style={{ width: `${storageQuota.percentUsed}%` }}
              />
            </div>
            <div className="text-xs text-gray-400">
              {storageQuota.percentUsed}% used
              {storageQuota.critical && (
                <span className="text-red-400 ml-2">⚠️ Critical - Clear storage soon!</span>
              )}
              {storageQuota.warning && !storageQuota.critical && (
                <span className="text-yellow-400 ml-2">⚠️ Warning - Consider clearing storage</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Storage Metrics */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Storage Metrics</h3>
        <div className="bg-gray-700 p-3 rounded space-y-2">
          <div className="flex justify-between text-sm">
            <span>Copy History Entries:</span>
            <span className="font-bold">{metrics.copyHistoryCount}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Settings Configured:</span>
            <span className="font-bold">{metrics.settingsCount}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Total Storage Items:</span>
            <span className="font-bold">{metrics.totalStorageItems}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Estimated Data Size:</span>
            <span className="font-bold">{(metrics.estimatedSize / 1024).toFixed(2)} KB</span>
          </div>
        </div>
      </div>

      {/* Browser Performance */}
      {performanceMetrics && performanceMetrics.memory && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Memory Usage</h3>
          <div className="bg-gray-700 p-3 rounded space-y-2">
            <div className="flex justify-between text-sm">
              <span>Used JS Heap:</span>
              <span className="font-bold">{performanceMetrics.memory.usedJSHeapSize} MB</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Total JS Heap:</span>
              <span className="font-bold">{performanceMetrics.memory.totalJSHeapSize} MB</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>JS Heap Limit:</span>
              <span className="font-bold">{performanceMetrics.memory.jsHeapSizeLimit} MB</span>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="space-y-2">
        <button
          onClick={loadMetrics}
          className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition text-sm font-semibold"
        >
          🔄 Refresh Metrics
        </button>
        <button
          onClick={optimizeStorage}
          className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition text-sm font-semibold"
        >
          ⚡ Optimize Storage
        </button>
        <button
          onClick={clearCopyHistory}
          className="w-full px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded transition text-sm font-semibold"
        >
          🗑️ Clear Copy History
        </button>
      </div>

      {/* Tips */}
      <div className="mt-4 p-3 bg-blue-900/30 rounded border border-blue-500">
        <p className="text-xs mb-1"><strong>💡 Optimization Tips:</strong></p>
        <ul className="text-xs space-y-1 ml-4">
          <li>• Regularly clear old copy history entries</li>
          <li>• Use backup before clearing storage</li>
          <li>• Monitor quota to prevent data loss</li>
          <li>• Run "Optimize Storage" monthly</li>
        </ul>
      </div>
    </div>
  );
};

export default PerformanceMonitor;
