const UserGuide = () => {
  return (
    <div className="p-4 bg-[#464b54] rounded-lg shadow-md mt-4 text-white">
      <h2 className="text-xl font-bold mb-6">Quick Start Guide</h2>
      <h3 className="text-lg font-semibold mt-4">How to Use:</h3>
      <ol className="list-decimal list-inside ml-4 mb-4">
        <li className="text-sm">Install the extension and enable it in your browser.</li>
        <li className="text-sm">Click on the extension icon to open the side panel.</li>
        <li className="text-sm">
          Click the <strong>Grab CSS Selector</strong> button to start the hover functionality.
        </li>
        <li className="text-sm">
          Hover over any element on the page to see its CSS selector and value in real-time.
        </li>
        <li className="text-sm">
          Click on an element to copy its CSS selector to the clipboard. Use{' '}
          <strong>Shift + Click</strong> to copy the element&apos;s XPath instead. A live match
          count shows whether the selector is unique.
        </li>
        <li className="text-sm">
          Press the <strong>ESC</strong> key to stop the hover functionality.
        </li>
        <li className="text-sm">
          To restart the hover & capture functionality, click the <strong>Grab CSS Selector</strong>{' '}
          button again.
        </li>
        <li className="text-sm">
          Use <strong>ALT + Click</strong> on an element to pin the hover box for that element. You
          can pin multiple hover boxes using this method.
        </li>
        <li className="text-sm">
          Click the <strong>x</strong> button on a pinned hover box to close it.
        </li>
        <li className="text-sm">
          Alternatively, use the ESC key to close the functionality completely.
        </li>
      </ol>
      <h3 className="text-lg font-semibold mt-4">Features:</h3>
      <ul className="list-disc list-inside ml-4">
        <li className="text-sm">
          Modern and appealing hover box UI with proper formatting and spacing.
        </li>
        <li className="text-sm">
          Real-time display of CSS selector and value upon hovering on HTML page elements.
        </li>
        <li className="text-sm">
          Click to copy the CSS selector (or Shift + Click for XPath) to the clipboard.
        </li>
        <li className="text-sm">
          Press <strong>ALT + Click</strong> to pin hover boxes for multiple elements.
        </li>
        <li className="text-sm">
          Pin as many boxes as you want to further explore the CSS Properties.
        </li>
        <li className="text-sm">
          Click the <strong>x</strong> button to close pinned hover boxes individually or use the
          ESC key to close the functionality completely.
        </li>
      </ul>
      <h3 className="text-lg font-semibold mt-4">Retrieve and View CSAE Config</h3>
      <ol className="list-decimal list-inside ml-4 mb-4">
        <li className="text-sm">Open the page where CSAE stores its configuration.</li>
        <li className="text-sm">
          Click the <strong>View CSAE Config</strong> button. The toolkit scans the page&apos;s
          globals and local/session storage for CSAE-related keys.
        </li>
        <li className="text-sm">
          Browse the config in a collapsible JSON viewer, use the search box to filter keys and
          values, and click <strong>Copy JSON</strong> to copy the whole configuration.
        </li>
      </ol>
      <h3 className="text-lg font-semibold mt-4">Storage Manager</h3>
      <ol className="list-decimal list-inside ml-4 mb-4">
        <li className="text-sm">
          Click the <strong>Show Storage Manager</strong> button to open the storage manager
          interface.
        </li>
        <li className="text-sm">
          Select the storage area you want to inspect (Local or Session) from the dropdown menu.
        </li>
        <li className="text-sm">
          Click the <strong>Load Storage Data</strong> button to view the current storage data for
          the selected area.
        </li>
        <li className="text-sm">
          Click the <strong>Clear Storage Data</strong> button to clear the current storage data for
          the selected area.
        </li>
        <li className="text-sm">
          Click the <strong>Load Cookies</strong> button to view the current cookies for the domain.
        </li>
        <li className="text-sm">
          Click the <strong>Clear Cookies</strong> button to clear the current cookies for the
          domain.
        </li>
      </ol>
      <h3 className="text-lg font-semibold mt-4">Color Tools</h3>
      <ol className="list-decimal list-inside ml-4 mb-4">
        <li className="text-sm">
          Click the <strong>Utilize Color Picker</strong> button to open Color Tools.
        </li>
        <li className="text-sm">
          Click <strong>Pick a Color</strong> and sample any pixel on screen with the eyedropper.
        </li>
        <li className="text-sm">
          Copy the value as HEX, RGB, or HSL, and build up a reusable palette history.
        </li>
        <li className="text-sm">
          Use the WCAG contrast checker to confirm foreground/background pairs meet AA/AAA.
        </li>
      </ol>
      <h3 className="text-lg font-semibold mt-4">Examples</h3>
      <ul className="list-disc list-inside ml-4">
        <li className="text-sm">
          You can use this extension to clear your session to render CSRF useless.
        </li>
        <li className="text-sm">
          You can use this extension to clear first party tracking cookies.
        </li>
        <li className="text-sm">
          You can use this extension to clear your cache to prevent cache fingerprinting.
        </li>
        <li className="text-sm">
          You can use this extension to clear localStorage and IndexedDB to help prevent
          evercookies.
        </li>
      </ul>
    </div>
  );
};

export default UserGuide;
