import React from 'react';

const UserGuide = () => {
  return (
    <div className="p-4 bg-[#464b54] rounded-lg shadow-md mt-4 text-white">
      <h1 className="text-xl font-bold mb-4">Quick Start Guide</h1>
      <p className="mb-4">Author: Nik Kale</p>
      <h2 className="text-lg font-semibold mt-4">How to Use:</h2>
      <ol className="list-decimal list-inside ml-4 mb-4">
        <li>Install the extension and enable it in your browser.</li>
        <li>Click on the extension icon to open the popup window.</li>
        <li>Click the <strong>Grab CSS Selector</strong> button to start the hover functionality.</li>
        <li>Hover over any element on the page to see its CSS selector and value in real-time.</li>
        <li>Click on an element to grab its CSS selector and value. The CSS selector will be copied to the clipboard with all spaces removed.</li>
        <li>Press the <strong>ESC</strong> key to stop the hover functionality.</li>
        <li>To restart the hover & capture functionality, click the <strong>Grab CSS Selector</strong> button again.</li>
        <li>Use <strong>ALT + Click</strong> on an element to pin the hover box for that element. You can pin multiple hover boxes using this method.</li>
        <li>Click the <strong>x</strong> button on a pinned hover box to close it.</li>
        <li>Alternatively, use the ESC key to close the functionality completely.</li>
      </ol>
      <h2 className="text-lg font-semibold mt-4">Features:</h2>
      <ul className="list-disc list-inside ml-4">
        <li>Modern and appealing hover box UI with proper formatting and spacing.</li>
        <li>Real-time display of CSS selector and value upon hovering on HTML page elements.</li>
        <li>Click to copy CSS selector and value to the clipboard (with spaces removed for convenience).</li>
        <li>Press <strong>ALT + Click</strong> to pin hover boxes for multiple elements.</li>
        <li>Pin as many boxes as you want to further explore the CSS Properties.</li>
        <li>Click the <strong>x</strong> button to close pinned hover boxes individually or use the ESC key to close the functionality completely.</li>
      </ul>
      <h2 className="text-lg font-semibold mt-4">Retrieve and View CSAE Config</h2>
      <ol className="list-decimal list-inside ml-4 mb-4">
        <li className="mb-2">Open the Extension:
          <ul className="list-disc list-inside ml-4">
            <li>Click on the Cisco Support Assistant Extension icon in your Chrome browser to open it.</li>
          </ul>
        </li>
        <li className="mb-2">Inspect the Extension:
          <ul className="list-disc list-inside ml-4">
            <li>Right-click on the opened extension window.</li>
            <li>Select "Inspect" from the context menu. This action opens the Chrome Developer Tools (DevTools) for that extension.</li>
          </ul>
        </li>
        <li className="mb-2">Navigate to the CSAE Toolkit CE Storage Panel:
          <ul className="list-disc list-inside ml-4">
            <li>In the DevTools, look for a panel labeled "CSAE Toolkit CE Storage". This might be among the tabs at the top or accessible via the "&gt;&gt;" button if there are many tabs.</li>
          </ul>
        </li>
        <li className="mb-2">Load the CSAE Config:
          <ul className="list-disc list-inside ml-4">
            <li>Inside the "CSAE Toolkit CE Storage" panel, you will find two buttons.</li>
            <li>Click on the button labeled to load the storage, typically named something like "Load Storage". This action will retrieve the CSAE configuration for your browser from the extension's storage.</li>
          </ul>
        </li>
      </ol>
      <h2 className="text-lg font-semibold mt-4">Storage Manager</h2>
      <ol className="list-decimal list-inside ml-4 mb-4">
        <li>Click the <strong>Show Storage Manager</strong> button to open the storage manager interface.</li>
        <li>Select the storage area you want to inspect (Local or Session) from the dropdown menu.</li>
        <li>Click the <strong>Load Storage Data</strong> button to view the current storage data for the selected area.</li>
        <li>Click the <strong>Clear Storage Data</strong> button to clear the current storage data for the selected area.</li>
        <li>Click the <strong>Load Cookies</strong> button to view the current cookies for the domain.</li>
        <li>Click the <strong>Clear Cookies</strong> button to clear the current cookies for the domain.</li>
      </ol>
      <h2 className="text-lg font-semibold mt-4">Examples</h2>
      <ul className="list-disc list-inside ml-4">
        <li>You can use this extension to clear your session to render CSRF useless.</li>
        <li>You can use this extension to clear first party tracking cookies.</li>
        <li>You can use this extension to clear your cache to prevent cache fingerprinting.</li>
        <li>You can use this extension to clear localStorage and IndexedDB to help prevent evercookies.</li>
      </ul>
    </div>
  );
};

export default UserGuide;