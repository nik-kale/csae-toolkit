import React from 'react';

const UserGuide = () => {
  return (
    <div className="p-4 bg-[#464b54] rounded-lg shadow-md mt-4 text-white">
      <h1 className="text-xl font-bold mb-6">📖 CSAE Toolkit v4.0 User Guide</h1>

      {/* Quick Start */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-3 text-blue-400">🚀 Quick Start</h2>
        <ol className="list-decimal list-inside ml-4 space-y-2">
          <li className="text-sm">Install the extension and enable it in Chrome</li>
          <li className="text-sm">Click the CSAE Toolkit icon in your toolbar to open the side panel</li>
          <li className="text-sm">Use the buttons or press <kbd className="px-2 py-1 bg-gray-700 rounded text-xs">Ctrl/Cmd+K</kbd> for the Command Palette</li>
          <li className="text-sm">Explore the features below!</li>
        </ol>
      </section>

      {/* Keyboard Shortcuts */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-3 text-blue-400">⌨️ Keyboard Shortcuts</h2>
        <div className="bg-gray-700 p-3 rounded space-y-2">
          <div className="text-sm flex justify-between">
            <span>Command Palette:</span>
            <kbd className="px-2 py-1 bg-gray-800 rounded text-xs">Ctrl/Cmd + K</kbd>
          </div>
          <div className="text-sm flex justify-between">
            <span>Exit Selector Mode:</span>
            <kbd className="px-2 py-1 bg-gray-800 rounded text-xs">ESC</kbd>
          </div>
          <div className="text-sm flex justify-between">
            <span>Pin Hover Box:</span>
            <kbd className="px-2 py-1 bg-gray-800 rounded text-xs">Alt + Click</kbd>
          </div>
        </div>
      </section>

      {/* CSS Selector Grabber */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-3 text-blue-400">🎯 CSS Selector Grabber</h2>
        <ol className="list-decimal list-inside ml-4 space-y-2">
          <li className="text-sm">Click <strong>Grab CSS Selector</strong> button</li>
          <li className="text-sm">Hover over any element to see its selector and CSS properties</li>
          <li className="text-sm"><strong>Click</strong> to copy the selector to clipboard</li>
          <li className="text-sm"><strong>Alt + Click</strong> to pin the hover box (pin multiple!)</li>
          <li className="text-sm">Press <strong>ESC</strong> to exit selector mode</li>
        </ol>
        <div className="mt-3 p-3 bg-blue-900/30 rounded border border-blue-500">
          <p className="text-xs text-blue-200">💡 <strong>Tip:</strong> Pinned boxes stay on screen so you can compare multiple elements. Click the × button to close individual boxes.</p>
        </div>
      </section>

      {/* Copy History (NEW in v4) */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-3 text-blue-400">📋 Copy History <span className="text-xs bg-green-600 px-2 py-1 rounded">NEW</span></h2>
        <p className="text-sm mb-2">Every selector you copy is automatically saved to history!</p>
        <ol className="list-decimal list-inside ml-4 space-y-2">
          <li className="text-sm">Click <strong>Show Copy History</strong></li>
          <li className="text-sm">View all previously copied selectors with timestamps</li>
          <li className="text-sm">Click <strong>Copy</strong> on any entry to copy it again</li>
          <li className="text-sm">Click <strong>×</strong> to remove individual entries</li>
          <li className="text-sm">Click <strong>Clear All</strong> to wipe history</li>
        </ol>
        <div className="mt-3 p-3 bg-green-900/30 rounded border border-green-500">
          <p className="text-xs text-green-200">✨ History stores last 50 entries (configurable in Settings)</p>
        </div>
      </section>

      {/* Storage Manager */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-3 text-blue-400">💾 Storage Manager</h2>
        <ol className="list-decimal list-inside ml-4 space-y-2">
          <li className="text-sm">Click <strong>Show Storage Manager</strong></li>
          <li className="text-sm">Select storage type (Local/Session)</li>
          <li className="text-sm">Click <strong>Load Storage Data</strong> to view</li>
          <li className="text-sm">Click <strong>Clear Storage Data</strong> to remove</li>
        </ol>

        <h3 className="text-md font-semibold mt-4 mb-2 text-green-400">NEW in v4:</h3>
        <ul className="list-disc list-inside ml-4 space-y-2">
          <li className="text-sm"><strong>Export:</strong> Download storage as JSON file (click Export button)</li>
          <li className="text-sm"><strong>Import:</strong> Upload JSON file to restore storage (click Import button)</li>
          <li className="text-sm"><strong>Search:</strong> Filter storage by key or value in real-time</li>
          <li className="text-sm">Result count displayed when searching</li>
        </ul>

        <h3 className="text-md font-semibold mt-4 mb-2">Cookies:</h3>
        <ul className="list-disc list-inside ml-4 space-y-2">
          <li className="text-sm">Click <strong>Load Cookies</strong> to view domain cookies</li>
          <li className="text-sm">Click <strong>Clear Cookies</strong> to remove them</li>
        </ul>
      </section>

      {/* Command Palette (NEW in v4) */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-3 text-blue-400">⌨️ Command Palette <span className="text-xs bg-green-600 px-2 py-1 rounded">NEW</span></h2>
        <p className="text-sm mb-2">Quick access to all features with keyboard shortcuts!</p>
        <ol className="list-decimal list-inside ml-4 space-y-2">
          <li className="text-sm">Press <kbd className="px-2 py-1 bg-gray-700 rounded text-xs">Ctrl/Cmd+K</kbd> or click the ⌘K button</li>
          <li className="text-sm">Type to search for any command</li>
          <li className="text-sm">Use <strong>↑↓</strong> arrows to navigate</li>
          <li className="text-sm">Press <strong>Enter</strong> to execute</li>
          <li className="text-sm">Press <strong>ESC</strong> to close</li>
        </ol>
      </section>

      {/* Settings (NEW in v4) */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-3 text-blue-400">⚙️ Settings <span className="text-xs bg-green-600 px-2 py-1 rounded">NEW</span></h2>
        <p className="text-sm mb-2">Customize your CSAE Toolkit experience!</p>
        <ul className="list-disc list-inside ml-4 space-y-2">
          <li className="text-sm"><strong>Theme:</strong> Toggle between Dark and Light mode</li>
          <li className="text-sm"><strong>Auto-load Storage:</strong> Automatically load storage on open</li>
          <li className="text-sm"><strong>History Limit:</strong> Set max entries (25/50/100/200)</li>
          <li className="text-sm"><strong>Notification Duration:</strong> How long messages stay visible</li>
          <li className="text-sm"><strong>Keyboard Shortcuts:</strong> Enable/disable hotkeys</li>
        </ul>
      </section>

      {/* Color Picker */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-3 text-blue-400">🎨 Color Picker</h2>
        <ol className="list-decimal list-inside ml-4 space-y-2">
          <li className="text-sm">Click <strong>Utilize Color Picker</strong></li>
          <li className="text-sm">Click anywhere on the screen to pick a color</li>
          <li className="text-sm">Color code is automatically copied to clipboard</li>
          <li className="text-sm">Success notification appears confirming the copy</li>
        </ol>
      </section>

      {/* CSAE Config */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-3 text-blue-400">⚙️ View CSAE Config</h2>
        <ol className="list-decimal list-inside ml-4 space-y-2">
          <li className="text-sm">Click <strong>View CSAE Config</strong> button</li>
          <li className="text-sm">A modal appears with instructions</li>
          <li className="text-sm">Right-click the CSAE extension and select "Inspect"</li>
          <li className="text-sm">Navigate to "CSAE Toolkit CE Storage" panel in DevTools</li>
          <li className="text-sm">Click "Load Storage" to view the config</li>
        </ol>
      </section>

      {/* DevTools Panel */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-3 text-blue-400">🔧 DevTools Panel</h2>
        <p className="text-sm mb-2">Access advanced storage features in Chrome DevTools:</p>
        <ol className="list-decimal list-inside ml-4 space-y-2">
          <li className="text-sm">Open Chrome DevTools (F12)</li>
          <li className="text-sm">Look for "CSAE Toolkit CE Storage" tab</li>
          <li className="text-sm">Click <strong>Load chrome.storage.local</strong> to view extension storage</li>
          <li className="text-sm">Click <strong>Clear chrome.storage.local</strong> to reset</li>
          <li className="text-sm">View pretty-printed, syntax-highlighted JSON</li>
        </ol>
      </section>

      {/* Use Cases */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-3 text-blue-400">💡 Common Use Cases</h2>
        <ul className="list-disc list-inside ml-4 space-y-2">
          <li className="text-sm"><strong>Campaign Development:</strong> Quickly grab selectors for CSAE campaigns</li>
          <li className="text-sm"><strong>Debugging:</strong> Export storage, make changes, compare with diff tool</li>
          <li className="text-sm"><strong>Testing:</strong> Clear storage/cookies to test fresh user experiences</li>
          <li className="text-sm"><strong>Config Management:</strong> Export configs, share with team, import on other machines</li>
          <li className="text-sm"><strong>Privacy:</strong> Clear tracking cookies and localStorage</li>
          <li className="text-sm"><strong>Security:</strong> Clear session to prevent CSRF attacks</li>
          <li className="text-sm"><strong>Cache Busting:</strong> Clear cache to prevent fingerprinting</li>
        </ul>
      </section>

      {/* Tips & Tricks */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-3 text-blue-400">🎓 Tips & Tricks</h2>
        <div className="space-y-3">
          <div className="p-3 bg-purple-900/30 rounded border border-purple-500">
            <p className="text-sm"><strong>💡 Pro Tip:</strong> Use Command Palette (Ctrl/Cmd+K) for fastest access to all features!</p>
          </div>
          <div className="p-3 bg-purple-900/30 rounded border border-purple-500">
            <p className="text-sm"><strong>💡 Workflow:</strong> Pin multiple elements → Copy all selectors → Check Copy History → Export for backup</p>
          </div>
          <div className="p-3 bg-purple-900/30 rounded border border-purple-500">
            <p className="text-sm"><strong>💡 Organization:</strong> Export storage before major changes, so you can restore if needed</p>
          </div>
          <div className="p-3 bg-purple-900/30 rounded border border-purple-500">
            <p className="text-sm"><strong>💡 Productivity:</strong> Use Search in Storage Manager to quickly find specific keys</p>
          </div>
        </div>
      </section>

      {/* Troubleshooting */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-3 text-blue-400">🔧 Troubleshooting</h2>
        <ul className="list-disc list-inside ml-4 space-y-2">
          <li className="text-sm"><strong>Selector not copying?</strong> Check browser clipboard permissions</li>
          <li className="text-sm"><strong>Storage not loading?</strong> Refresh the page and try again</li>
          <li className="text-sm"><strong>Color picker not working?</strong> Requires Chromium-based browser with EyeDropper API</li>
          <li className="text-sm"><strong>Command Palette not opening?</strong> Check if shortcuts are enabled in Settings</li>
          <li className="text-sm"><strong>Theme not changing?</strong> Theme persists in chrome.storage, check Settings</li>
        </ul>
      </section>

      {/* Footer */}
      <section className="mt-8 pt-4 border-t border-gray-600">
        <p className="text-xs text-gray-400 text-center">
          CSAE Toolkit v4.0.0 | Made with ☕ and ❤️ by Nik Kale
        </p>
        <p className="text-xs text-gray-400 text-center mt-1">
          © 2024-2025 Cisco Systems Inc.
        </p>
      </section>
    </div>
  );
};

export default UserGuide;
