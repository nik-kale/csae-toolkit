import React, { useState } from 'react';
import { getChromeStorageQuota } from '../utils/performance';

const BackupRestore = () => {
  const [backupStatus, setBackupStatus] = useState(null);
  const [restoreStatus, setRestoreStatus] = useState(null);
  const [quota, setQuota] = useState(null);

  // Load quota info on mount
  React.useEffect(() => {
    loadQuotaInfo();
  }, []);

  const loadQuotaInfo = async () => {
    const info = await getChromeStorageQuota();
    setQuota(info);
  };

  const createBackup = () => {
    chrome.storage.local.get(null, (data) => {
      const backup = {
        version: '4.2.0',
        timestamp: new Date().toISOString(),
        data: data
      };

      const dataStr = JSON.stringify(backup, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `csae-toolkit-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setBackupStatus({
        type: 'success',
        message: 'Backup created successfully!',
        size: (dataStr.length / 1024).toFixed(2) + ' KB'
      });

      setTimeout(() => setBackupStatus(null), 3000);
    });
  };

  const restoreBackup = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const backup = JSON.parse(e.target.result);

        // Validate backup structure
        if (!backup.version || !backup.data) {
          setRestoreStatus({
            type: 'error',
            message: 'Invalid backup file format'
          });
          return;
        }

        // Confirm restore
        const confirmed = confirm(
          `⚠️ Restore backup from ${new Date(backup.timestamp).toLocaleDateString()}?\n\n` +
          'This will replace ALL current settings:\n' +
          '• Extension settings\n' +
          '• Copy history\n' +
          '• Theme preferences\n' +
          '• All stored data\n\n' +
          'Current data will be permanently lost!'
        );

        if (!confirmed) {
          event.target.value = '';
          return;
        }

        // Restore data
        chrome.storage.local.clear(() => {
          chrome.storage.local.set(backup.data, () => {
            setRestoreStatus({
              type: 'success',
              message: 'Backup restored successfully! Refresh to see changes.',
              version: backup.version,
              date: new Date(backup.timestamp).toLocaleString()
            });

            // Reload quota info
            loadQuotaInfo();
          });
        });
      } catch (error) {
        setRestoreStatus({
          type: 'error',
          message: 'Failed to parse backup file: ' + error.message
        });
      }
    };

    reader.readAsText(file);
    event.target.value = '';
  };

  return (
    <div className="p-4 bg-[#464b54] rounded-lg shadow-md mt-4 text-white">
      <h2 className="text-lg font-semibold mb-4">🗄️ Backup & Restore</h2>

      {/* Storage Quota Info */}
      {quota && (
        <div className="mb-4 p-3 bg-gray-700 rounded">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold">Storage Usage</span>
            <span className="text-sm">{quota.usageKB} KB / {quota.quotaMB} MB</span>
          </div>
          <div className="w-full bg-gray-600 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                quota.critical ? 'bg-red-600' :
                quota.warning ? 'bg-yellow-600' :
                'bg-green-600'
              }`}
              style={{ width: `${quota.percentUsed}%` }}
            />
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {quota.percentUsed}% used
            {quota.warning && <span className="text-yellow-400 ml-2">⚠️ Running low on storage</span>}
            {quota.critical && <span className="text-red-400 ml-2">🔴 Critical: Clear some data</span>}
          </div>
        </div>
      )}

      {/* Backup Status */}
      {backupStatus && (
        <div className={`mb-4 p-3 rounded ${
          backupStatus.type === 'success' ? 'bg-green-900/30 border border-green-500' :
          'bg-red-900/30 border border-red-500'
        }`}>
          <p className="text-sm">
            {backupStatus.type === 'success' ? '✅' : '❌'} {backupStatus.message}
          </p>
          {backupStatus.size && (
            <p className="text-xs text-gray-400 mt-1">Size: {backupStatus.size}</p>
          )}
        </div>
      )}

      {/* Restore Status */}
      {restoreStatus && (
        <div className={`mb-4 p-3 rounded ${
          restoreStatus.type === 'success' ? 'bg-green-900/30 border border-green-500' :
          'bg-red-900/30 border border-red-500'
        }`}>
          <p className="text-sm">
            {restoreStatus.type === 'success' ? '✅' : '❌'} {restoreStatus.message}
          </p>
          {restoreStatus.version && (
            <div className="text-xs text-gray-400 mt-1">
              <p>Version: {restoreStatus.version}</p>
              <p>Date: {restoreStatus.date}</p>
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="space-y-3">
        <div>
          <button
            onClick={createBackup}
            className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded transition duration-300 font-semibold flex items-center justify-center gap-2"
            aria-label="Create backup"
          >
            <span>📦</span>
            <span>Create Backup</span>
          </button>
          <p className="text-xs text-gray-400 mt-1">
            Export all settings, history, and preferences to a JSON file
          </p>
        </div>

        <div>
          <label className="w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 rounded transition duration-300 font-semibold cursor-pointer flex items-center justify-center gap-2">
            <span>📥</span>
            <span>Restore from Backup</span>
            <input
              type="file"
              accept=".json"
              onChange={restoreBackup}
              className="hidden"
              aria-label="Restore from backup"
            />
          </label>
          <p className="text-xs text-gray-400 mt-1">
            Import a previously created backup file
          </p>
        </div>
      </div>

      {/* Info */}
      <div className="mt-4 p-3 bg-blue-900/30 rounded border border-blue-500">
        <p className="text-xs text-blue-200">
          <strong>💡 Tip:</strong> Regular backups are recommended before major updates or changes.
          Backup files can be shared across devices.
        </p>
      </div>

      {/* What's Included */}
      <details className="mt-4">
        <summary className="cursor-pointer text-sm font-semibold text-gray-300 hover:text-white">
          What's included in backups?
        </summary>
        <ul className="mt-2 ml-4 text-sm text-gray-400 space-y-1">
          <li>• Extension settings and preferences</li>
          <li>• Copy history (all entries)</li>
          <li>• Theme selection (dark/light)</li>
          <li>• Keyboard shortcuts configuration</li>
          <li>• All stored configurations</li>
          <li>• Notification preferences</li>
        </ul>
      </details>
    </div>
  );
};

export default BackupRestore;
