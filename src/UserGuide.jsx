import React from 'react';

const UserGuide = () => {
  return (
    <div className="p-4 bg-[#464b54] rounded-lg shadow-md mt-4 text-white">
      <h1 className="text-xl font-bold mb-6">CSAE Toolkit v3.0 - Complete Guide</h1>

      <div className="mb-6 p-3 bg-[#4ADC71] bg-opacity-20 rounded border-l-4 border-[#4ADC71]">
        <p className="text-sm font-semibold">What's New in v3.0?</p>
        <p className="text-xs mt-1">This major update brings 18+ professional tools including SEO Inspector, Element Editor, Image Extractor, Grid Overlay, IndexedDB Manager, and much more!</p>
      </div>

      <h2 className="text-lg font-semibold mt-6 mb-3 text-[#4ADC71]">🔍 Inspector Tools</h2>

      <div className="mb-4">
        <h3 className="text-md font-semibold mb-2">CSS Selector Grabber</h3>
        <ol className="list-decimal list-inside ml-4 text-sm space-y-1">
          <li>Click <strong>Grab CSS Selector</strong> button</li>
          <li>Hover over any element to see its CSS selector, value, and properties</li>
          <li>Click on an element to copy its selector to clipboard</li>
          <li>Use <strong>ALT + Click</strong> to pin multiple hover boxes</li>
          <li>Press <strong>ESC</strong> to exit</li>
        </ol>
      </div>

      <div className="mb-4">
        <h3 className="text-md font-semibold mb-2">Color Picker</h3>
        <ol className="list-decimal list-inside ml-4 text-sm space-y-1">
          <li>Click <strong>Color Picker</strong> button</li>
          <li>Click anywhere on the screen to pick a color</li>
          <li>Color code is automatically copied to clipboard</li>
          <li>Colors are saved to your palette for future reference</li>
        </ol>
      </div>

      <div className="mb-4">
        <h3 className="text-md font-semibold mb-2">Element Measurement Tool</h3>
        <ol className="list-decimal list-inside ml-4 text-sm space-y-1">
          <li>Click <strong>Measure Elements</strong></li>
          <li>Click and drag to measure any area on the page</li>
          <li>Dimensions (width × height) are shown in real-time</li>
          <li>Press <strong>ESC</strong> to exit</li>
        </ol>
      </div>

      <div className="mb-4">
        <h3 className="text-md font-semibold mb-2">SEO Meta Inspector</h3>
        <ol className="list-decimal list-inside ml-4 text-sm space-y-1">
          <li>Click <strong>SEO Meta Inspector</strong></li>
          <li>View all meta tags, Open Graph data, Twitter cards</li>
          <li>See page title, description, keywords, canonical URL</li>
          <li>Check robots directives and viewport settings</li>
        </ol>
      </div>

      <div className="mb-4">
        <h3 className="text-md font-semibold mb-2">Image Extractor</h3>
        <ol className="list-decimal list-inside ml-4 text-sm space-y-1">
          <li>Click <strong>Extract Images</strong></li>
          <li>View all images from the page (including background images)</li>
          <li>Download individual images with one click</li>
          <li>Organized grid view for easy browsing</li>
        </ol>
      </div>

      <div className="mb-4">
        <h3 className="text-md font-semibold mb-2">Export Element HTML/CSS</h3>
        <ol className="list-decimal list-inside ml-4 text-sm space-y-1">
          <li>Click <strong>Export Element HTML/CSS</strong></li>
          <li>Click on any element you want to export</li>
          <li>Complete HTML and CSS is copied to clipboard</li>
          <li>Perfect for recreating designs or debugging</li>
        </ol>
      </div>

      <h2 className="text-lg font-semibold mt-6 mb-3 text-[#4ADC71]">✏️ Page Editor Tools</h2>

      <div className="mb-4">
        <h3 className="text-md font-semibold mb-2">Edit Text Content</h3>
        <ol className="list-decimal list-inside ml-4 text-sm space-y-1">
          <li>Click <strong>Edit Text Content</strong></li>
          <li>Click on any text element to make it editable</li>
          <li>Type your changes directly on the page</li>
          <li>Click outside or press Enter to save</li>
        </ol>
      </div>

      <div className="mb-4">
        <h3 className="text-md font-semibold mb-2">Element Manipulator</h3>
        <ul className="list-disc list-inside ml-4 text-sm space-y-1">
          <li><strong>Delete Element:</strong> Click to permanently remove any element</li>
          <li><strong>Hide Element:</strong> Click to hide any element (sets display: none)</li>
          <li><strong>Duplicate Element:</strong> Click to create a copy of any element</li>
        </ul>
      </div>

      <div className="mb-4">
        <h3 className="text-md font-semibold mb-2">Change Page Font</h3>
        <ol className="list-decimal list-inside ml-4 text-sm space-y-1">
          <li>Click <strong>Change Page Font</strong></li>
          <li>Select from 15+ professional fonts</li>
          <li>Click Apply to change the entire page font</li>
          <li>Click Reset to restore original font</li>
        </ol>
      </div>

      <h2 className="text-lg font-semibold mt-6 mb-3 text-[#4ADC71]">📐 Layout & Design Tools</h2>

      <div className="mb-4">
        <h3 className="text-md font-semibold mb-2">Grid Overlay</h3>
        <ol className="list-decimal list-inside ml-4 text-sm space-y-1">
          <li>Click <strong>Toggle Grid Overlay</strong></li>
          <li>A precise grid appears over the entire page</li>
          <li>Perfect for checking alignment and spacing</li>
          <li>Click again or press <strong>ESC</strong> to disable</li>
        </ol>
      </div>

      <div className="mb-4">
        <h3 className="text-md font-semibold mb-2">Ruler/Measurement Tool</h3>
        <ol className="list-decimal list-inside ml-4 text-sm space-y-1">
          <li>Click <strong>Ruler/Measurement Tool</strong></li>
          <li>Click and drag to measure any area</li>
          <li>See precise pixel dimensions in real-time</li>
        </ol>
      </div>

      <h2 className="text-lg font-semibold mt-6 mb-3 text-[#4ADC71]">💾 Storage & Data Tools</h2>

      <div className="mb-4">
        <h3 className="text-md font-semibold mb-2">Storage Manager</h3>
        <ol className="list-decimal list-inside ml-4 text-sm space-y-1">
          <li>Select storage area (Local or Session)</li>
          <li>Click <strong>Load Storage Data</strong> to view contents</li>
          <li>Click <strong>Clear Storage Data</strong> to delete</li>
          <li>View and manage cookies separately</li>
        </ol>
      </div>

      <div className="mb-4">
        <h3 className="text-md font-semibold mb-2">IndexedDB & Cache Manager</h3>
        <ol className="list-decimal list-inside ml-4 text-sm space-y-1">
          <li>Click <strong>Load IndexedDB</strong> to see all databases</li>
          <li>Click <strong>Clear IndexedDB</strong> to remove all databases</li>
          <li>Click <strong>Clear Browser Cache</strong> to clear cache</li>
          <li>Useful for testing and privacy management</li>
        </ol>
      </div>

      <div className="mb-4">
        <h3 className="text-md font-semibold mb-2">View CSAE Config</h3>
        <ol className="list-decimal list-inside ml-4 text-sm space-y-1">
          <li>Right-click on CSAE extension and select Inspect</li>
          <li>Navigate to "CSAE Toolkit CE Storage" panel in DevTools</li>
          <li>Click Load Storage to view configuration</li>
        </ol>
      </div>

      <h2 className="text-lg font-semibold mt-6 mb-3 text-[#4ADC71]">💡 Pro Tips</h2>

      <ul className="list-disc list-inside ml-4 text-sm space-y-2">
        <li><strong>ESC Key:</strong> Press ESC to exit any active tool quickly</li>
        <li><strong>Multiple Tools:</strong> You can pin CSS selector boxes while using other tools</li>
        <li><strong>Clipboard:</strong> Most tools automatically copy results to clipboard</li>
        <li><strong>Privacy:</strong> Clear storage and cache to prevent tracking</li>
        <li><strong>Design Work:</strong> Use grid overlay + measurement tool for pixel-perfect designs</li>
        <li><strong>Debugging:</strong> Export element HTML/CSS to share with team members</li>
      </ul>

      <h2 className="text-lg font-semibold mt-6 mb-3 text-[#4ADC71]">🎯 Use Cases</h2>

      <ul className="list-disc list-inside ml-4 text-sm space-y-2">
        <li>Clear session storage to test CSRF protection</li>
        <li>Clear first-party tracking cookies for privacy</li>
        <li>Clear cache to prevent cache fingerprinting</li>
        <li>Clear localStorage and IndexedDB to help prevent evercookies</li>
        <li>Extract all images from a page for design inspiration</li>
        <li>Check SEO meta tags for optimization</li>
        <li>Measure spacing and alignment for design accuracy</li>
        <li>Edit text content to preview copy changes</li>
        <li>Delete unwanted elements for cleaner screenshots</li>
        <li>Export HTML/CSS to recreate designs</li>
      </ul>

      <div className="mt-6 p-3 bg-[#649ef5] bg-opacity-20 rounded border-l-4 border-[#649ef5]">
        <p className="text-sm font-semibold">Need Help?</p>
        <p className="text-xs mt-1">All tools show helpful instructions when activated. If you encounter issues, press ESC to reset and try again.</p>
      </div>
    </div>
  );
};

export default UserGuide;
