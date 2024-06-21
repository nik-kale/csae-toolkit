import React from 'react';

const UserGuide = () => {
  return (
    <div className="p-4 bg-[#464b54] rounded-lg shadow-md mt-4 text-white">
      <h1 className="text-xl font-bold mb-4">Quick Start Guide</h1>
      <p className="mb-4">Author: Nik Kale</p>

      <h2 className="text-lg font-semibold mt-4">CSS Selector Grabber</h2>
      <h3 className="text-md font-semibold mt-4">How to Use:</h3>
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
      <h3 className="text-md font-semibold mt-4">Features:</h3>
      <ul className="list-disc list-inside ml-4">
        <li>Modern and appealing hover box UI with proper formatting and spacing.</li>
        <li>Real-time display of CSS selector and value upon hovering on HTML page elements.</li>
        <li>Click to copy CSS selector and value to the clipboard (with spaces removed for convenience).</li>
        <li>Press <strong>ALT + Click</strong> to pin hover boxes for multiple elements.</li>
        <li>Pin as many boxes as you want to further explore the CSS Properties.</li>
        <li>Click the <strong>x</strong> button to close pinned hover boxes individually or use the ESC key to close the functionality completely.</li>
      </ul>

      <h2 className="text-lg font-semibold mt-4">Storage Manager</h2>
      <h3 className="text-md font-semibold mt-4">How to Use:</h3>
      <ol className="list-decimal list-inside ml-4 mb-4">
        <li>Click on the extension icon to open the popup window.</li>
        <li>By default, the Storage Manager is displayed.</li>
        <li>Select the storage area you want to inspect (Local or Session) from the dropdown menu.</li>
        <li>Click the <strong>Load Storage Data</strong> button to load and display the storage data for the selected area.</li>
        <li>Click the <strong>Clear Storage Data</strong> button to clear the storage data for the selected area.</li>
        <li>Click the <strong>Load Cookies</strong> button to load and display the cookies data.</li>
        <li>Click the <strong>Clear Cookies</strong> button to clear the cookies data.</li>
      </ol>
      <h3 className="text-md font-semibold mt-4">Features:</h3>
      <ul className="list-disc list-inside ml-4">
        <li>Load and clear Local Storage data for the current tab.</li>
        <li>Load and clear Session Storage data for the current tab.</li>
        <li>Load and clear Cookies data.</li>
      </ul>

      <h3 className="text-md font-semibold mt-4">Examples:</h3>
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
