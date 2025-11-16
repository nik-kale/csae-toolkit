// ===================================
// CSAE TOOLKIT V3.0 - CONTENT SCRIPT
// ===================================

// Global state management
if (typeof window.csaeToolkit === 'undefined') {
  window.csaeToolkit = {
    hoverActive: false,
    currentTarget: null,
    pinnedHoverBoxes: [],
    notificationTimeout: null,
    rulerActive: false,
    gridActive: false,
    editMode: false,
    colorPalette: [],
    measurementStart: null,
    measurementBox: null,
  };
}

// Initialize hover box
if (!window.hoverBox) {
  window.hoverBox = document.createElement('div');
  window.hoverBox.style.cssText = `
    position: fixed;
    z-index: 10000;
    background-color: #282A33;
    color: white;
    padding: 10px;
    border-radius: 8px;
    pointer-events: none;
    display: none;
    font-family: Arial, sans-serif;
    font-size: 14px;
    line-height: 1.5;
    max-width: 600px;
  `;
  document.body.appendChild(window.hoverBox);
}

// ===================================
// MESSAGE LISTENER
// ===================================
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const actions = {
    toggleHover: () => handleToggleHover(message),
    pickColor: () => handleColorPicker(),
    viewConfig: () => showConfigModal(),
    takeScreenshot: () => handleScreenshot(),
    measureElement: () => handleMeasurement(),
    toggleGrid: () => handleToggleGrid(),
    extractImages: () => handleImageExtractor(),
    seoInspector: () => handleSEOInspector(),
    editElement: () => handleElementEditor(),
    manipulateElement: () => handleElementManipulator(message.mode),
    exportElement: () => handleElementExport(),
    changeFont: () => handleFontChanger(),
    clearCache: () => handleCacheClear(),
  };

  if (actions[message.action]) {
    actions[message.action]();
    sendResponse({ status: 'success' });
  }

  if (message.type === 'storageData') {
    console.log('Received storage data from DevTools panel:', message.data);
    alert('Received storage data from DevTools panel. Check the console for details.');
    sendResponse({ status: 'success' });
  }

  return true;
});

// ===================================
// CSS SELECTOR GRABBER
// ===================================
function handleToggleHover(message) {
  window.csaeToolkit.hoverActive = message.hoverActive;

  if (window.csaeToolkit.hoverActive) {
    document.addEventListener('mouseover', mouseOverHandler, true);
    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('click', clickHandler, { once: true });
  } else {
    clearAllHoverBoxes();
    removeHoverListeners();
  }
}

function mouseOverHandler(event) {
  if (!window.csaeToolkit.hoverActive) return;

  // Check if hovering over a pinned hover box
  for (let hoverBox of window.csaeToolkit.pinnedHoverBoxes) {
    if (hoverBox.contains(event.target)) {
      window.hoverBox.style.display = 'none';
      return;
    }
  }

  let target = event.target;
  if (window.csaeToolkit.currentTarget) {
    window.csaeToolkit.currentTarget.style.outline = '';
  }
  window.csaeToolkit.currentTarget = target;
  target.style.outline = '2px solid red';

  let path = getUniqueSelector(target);
  let value = getElementValue(target);
  let cssProperties = getCSSProperties(target);

  window.hoverBox.innerHTML = `
    <div style="margin-bottom: 10px; padding: 10px; background-color: #3a3f4b; border-radius: 8px; position: relative;">
      <strong style="color:#4ADC71; font-weight: bold;">Selector:</strong><br>${path}<br><br>
      <strong style="color:#4ADC71; font-weight: bold;">Value:</strong><br>${value}
    </div>
    <div style="padding: 10px; background-color: #353945; border-radius: 8px; max-height: 300px; overflow-y: auto; position: relative;">
      <strong style="color:#4ADC71; font-weight: bold;">CSS Properties:</strong><br>
      <div style="display: flex; flex-wrap: wrap;">
        <div style="flex: 1; min-width: 200px;">
          ${cssProperties.slice(0, Math.ceil(cssProperties.length / 2)).join('<br>')}
        </div>
        <div style="flex: 1; min-width: 200px;">
          ${cssProperties.slice(Math.ceil(cssProperties.length / 2)).join('<br>')}
        </div>
      </div>
    </div>
  `;

  // Add close button
  const closeButton = document.createElement('button');
  closeButton.textContent = 'x';
  closeButton.style.cssText = `
    position: absolute;
    top: 5px;
    right: 5px;
    background: transparent;
    border: none;
    color: white;
    font-size: 16px;
    cursor: pointer;
  `;
  closeButton.onclick = () => {
    window.hoverBox.style.display = 'none';
    if (window.csaeToolkit.currentTarget) {
      window.csaeToolkit.currentTarget.style.outline = '';
      window.csaeToolkit.currentTarget = null;
    }
  };

  window.hoverBox.appendChild(closeButton);
  window.hoverBox.style.display = 'block';
}

function mouseMoveHandler(event) {
  if (!window.csaeToolkit.hoverActive) return;

  for (let hoverBox of window.csaeToolkit.pinnedHoverBoxes) {
    if (hoverBox.contains(event.target)) {
      window.hoverBox.style.display = 'none';
      return;
    }
  }

  window.hoverBox.style.left = `${event.clientX + 10}px`;
  window.hoverBox.style.top = `${event.clientY + 10}px`;
}

function clickHandler(event) {
  if (!window.csaeToolkit.hoverActive) return;

  event.preventDefault();
  event.stopPropagation();

  let target = event.target;
  let path = getUniqueSelector(target).replace(/\s+/g, '');

  if (event.altKey) {
    pinHoverBox(target, path);
  } else {
    window.hoverBox.style.display = 'none';
    navigator.clipboard.writeText(path).then(() => {
      showNotification('Selector copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy: ', err);
      showNotification('Failed to copy selector', 'error');
    });

    chrome.runtime.sendMessage({ selector: path, value: getElementValue(target) });
  }

  // Re-attach click listener for next click
  document.addEventListener('click', clickHandler, { once: true });

  return false;
}

function pinHoverBox(target, path) {
  const hoverBoxClone = window.hoverBox.cloneNode(true);
  hoverBoxClone.style.pointerEvents = 'auto';
  hoverBoxClone.style.position = 'absolute';
  hoverBoxClone.style.left = `${target.getBoundingClientRect().left + window.scrollX}px`;
  hoverBoxClone.style.top = `${target.getBoundingClientRect().top + window.scrollY}px`;
  hoverBoxClone.style.zIndex = '10001';

  const closeButton = document.createElement('button');
  closeButton.textContent = 'x';
  closeButton.style.cssText = `
    position: absolute;
    top: 5px;
    right: 5px;
    background: transparent;
    border: none;
    color: white;
    font-size: 16px;
    cursor: pointer;
  `;
  closeButton.onclick = () => {
    hoverBoxClone.remove();
    window.csaeToolkit.pinnedHoverBoxes = window.csaeToolkit.pinnedHoverBoxes.filter(box => box !== hoverBoxClone);
  };

  hoverBoxClone.appendChild(closeButton);
  document.body.appendChild(hoverBoxClone);
  window.csaeToolkit.pinnedHoverBoxes.push(hoverBoxClone);
}

function clearAllHoverBoxes() {
  window.hoverBox.style.display = 'none';
  window.csaeToolkit.pinnedHoverBoxes.forEach(box => box.remove());
  window.csaeToolkit.pinnedHoverBoxes = [];
  document.querySelectorAll('*').forEach(element => {
    element.style.outline = '';
  });
}

function removeHoverListeners() {
  document.removeEventListener('mouseover', mouseOverHandler, true);
  document.removeEventListener('mousemove', mouseMoveHandler);
  document.removeEventListener('click', clickHandler);
}

// ESC key to deactivate
document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape') {
    window.csaeToolkit.hoverActive = false;
    clearAllHoverBoxes();
    removeHoverListeners();
    removeGrid();
    removeMeasurement();
  }
});

// ===================================
// COLOR PICKER
// ===================================
function handleColorPicker() {
  if ('EyeDropper' in window) {
    const eyeDropper = new window.EyeDropper();
    eyeDropper.open().then(result => {
      const color = result.sRGBHex;

      // Add to color palette
      if (!window.csaeToolkit.colorPalette.includes(color)) {
        window.csaeToolkit.colorPalette.push(color);
        chrome.storage.local.set({ colorPalette: window.csaeToolkit.colorPalette });
      }

      navigator.clipboard.writeText(color).then(() => {
        showNotification(`Color ${color} copied to clipboard!`);
      }).catch(() => {
        fallbackCopyTextToClipboard(color);
      });
    }).catch(() => {
      showNotification('Failed to pick color', 'error');
    });
  } else {
    showNotification('EyeDropper API not supported', 'error');
  }
}

function fallbackCopyTextToClipboard(text) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.cssText = 'position:fixed;opacity:0;left:-9999px;';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    const successful = document.execCommand('copy');
    showNotification(successful ? `Color ${text} copied!` : 'Failed to copy color', successful ? 'success' : 'error');
  } catch (err) {
    console.error('Fallback: Unable to copy', err);
    showNotification('Failed to copy color', 'error');
  }

  document.body.removeChild(textArea);
}

// ===================================
// SCREENSHOT TOOL
// ===================================
function handleScreenshot() {
  showNotification('Screenshot functionality requires extension permissions. Use browser screenshot tool or right-click > Save as...', 'info');
}

// ===================================
// MEASUREMENT TOOL
// ===================================
function handleMeasurement() {
  if (window.csaeToolkit.measurementBox) {
    removeMeasurement();
    return;
  }

  showNotification('Click and drag to measure. Press ESC to exit.', 'info');

  let startX, startY, measureBox;

  const startMeasure = (e) => {
    startX = e.clientX;
    startY = e.clientY;

    measureBox = document.createElement('div');
    measureBox.style.cssText = `
      position: fixed;
      border: 2px dashed #4ADC71;
      background: rgba(74, 220, 113, 0.1);
      pointer-events: none;
      z-index: 999999;
    `;
    document.body.appendChild(measureBox);

    document.addEventListener('mousemove', updateMeasure);
    document.addEventListener('mouseup', endMeasure);
  };

  const updateMeasure = (e) => {
    const width = Math.abs(e.clientX - startX);
    const height = Math.abs(e.clientY - startY);
    const left = Math.min(e.clientX, startX);
    const top = Math.min(e.clientY, startY);

    measureBox.style.left = left + 'px';
    measureBox.style.top = top + 'px';
    measureBox.style.width = width + 'px';
    measureBox.style.height = height + 'px';

    measureBox.innerHTML = `<div style="background: #282A33; color: #4ADC71; padding: 5px; position: absolute; top: -30px; left: 0; font-size: 12px; border-radius: 4px;">${width}px × ${height}px</div>`;
  };

  const endMeasure = () => {
    document.removeEventListener('mousemove', updateMeasure);
    document.removeEventListener('mouseup', endMeasure);
    document.removeEventListener('mousedown', startMeasure);

    setTimeout(() => {
      if (measureBox && measureBox.parentNode) {
        measureBox.remove();
      }
    }, 3000);
  };

  document.addEventListener('mousedown', startMeasure);
  window.csaeToolkit.measurementBox = measureBox;
}

function removeMeasurement() {
  if (window.csaeToolkit.measurementBox && window.csaeToolkit.measurementBox.parentNode) {
    window.csaeToolkit.measurementBox.remove();
  }
  window.csaeToolkit.measurementBox = null;
}

// ===================================
// GRID OVERLAY
// ===================================
function handleToggleGrid() {
  if (window.csaeToolkit.gridActive) {
    removeGrid();
  } else {
    createGrid();
  }
}

function createGrid() {
  const gridOverlay = document.createElement('div');
  gridOverlay.id = 'csae-grid-overlay';
  gridOverlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    pointer-events: none;
    z-index: 999998;
    background-image:
      repeating-linear-gradient(0deg, rgba(74, 220, 113, 0.3) 0px, rgba(74, 220, 113, 0.3) 1px, transparent 1px, transparent 10px),
      repeating-linear-gradient(90deg, rgba(74, 220, 113, 0.3) 0px, rgba(74, 220, 113, 0.3) 1px, transparent 1px, transparent 10px),
      repeating-linear-gradient(0deg, rgba(74, 220, 113, 0.5) 0px, rgba(74, 220, 113, 0.5) 2px, transparent 2px, transparent 50px),
      repeating-linear-gradient(90deg, rgba(74, 220, 113, 0.5) 0px, rgba(74, 220, 113, 0.5) 2px, transparent 2px, transparent 50px);
  `;
  document.body.appendChild(gridOverlay);
  window.csaeToolkit.gridActive = true;
  showNotification('Grid overlay enabled. Press ESC or toggle again to disable.', 'info');
}

function removeGrid() {
  const grid = document.getElementById('csae-grid-overlay');
  if (grid) {
    grid.remove();
  }
  window.csaeToolkit.gridActive = false;
}

// ===================================
// IMAGE EXTRACTOR
// ===================================
function handleImageExtractor() {
  const images = Array.from(document.querySelectorAll('img'));
  const bgImages = Array.from(document.querySelectorAll('*'))
    .map(el => {
      const bg = window.getComputedStyle(el).backgroundImage;
      const match = bg.match(/url\(['"]?([^'"]+)['"]?\)/);
      return match ? match[1] : null;
    })
    .filter(Boolean);

  const allImages = [...new Set([...images.map(img => img.src), ...bgImages])];

  if (allImages.length === 0) {
    showNotification('No images found on this page', 'info');
    return;
  }

  // Create modal to display images
  const modal = document.createElement('div');
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.9);
    z-index: 1000000;
    overflow-y: auto;
    padding: 20px;
  `;

  const content = document.createElement('div');
  content.style.cssText = `
    max-width: 1200px;
    margin: 0 auto;
    background: #282A33;
    padding: 20px;
    border-radius: 8px;
  `;

  content.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
      <h2 style="color: #4ADC71; margin: 0;">Extracted Images (${allImages.length})</h2>
      <button id="close-image-modal" style="background: #649ef5; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer;">Close</button>
    </div>
    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 15px;">
      ${allImages.map((src, idx) => `
        <div style="background: #353945; padding: 10px; border-radius: 4px;">
          <img src="${src}" style="width: 100%; height: 150px; object-fit: contain; background: #fff; border-radius: 4px;" />
          <a href="${src}" download="image-${idx}" target="_blank" style="display: block; margin-top: 10px; padding: 8px; background: #649ef5; color: white; text-align: center; text-decoration: none; border-radius: 4px; font-size: 12px;">Download</a>
        </div>
      `).join('')}
    </div>
  `;

  modal.appendChild(content);
  document.body.appendChild(modal);

  document.getElementById('close-image-modal').onclick = () => modal.remove();
  modal.onclick = (e) => {
    if (e.target === modal) modal.remove();
  };
}

// ===================================
// SEO META INSPECTOR
// ===================================
function handleSEOInspector() {
  const getMeta = (name) => {
    const meta = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
    return meta ? meta.content : 'Not found';
  };

  const seoData = {
    'Page Title': document.title || 'Not found',
    'Meta Description': getMeta('description'),
    'Meta Keywords': getMeta('keywords'),
    'Canonical URL': document.querySelector('link[rel="canonical"]')?.href || 'Not found',
    'Open Graph Title': getMeta('og:title'),
    'Open Graph Description': getMeta('og:description'),
    'Open Graph Image': getMeta('og:image'),
    'Open Graph URL': getMeta('og:url'),
    'Twitter Card': getMeta('twitter:card'),
    'Twitter Title': getMeta('twitter:title'),
    'Twitter Description': getMeta('twitter:description'),
    'Twitter Image': getMeta('twitter:image'),
    'Robots': getMeta('robots'),
    'Viewport': getMeta('viewport'),
    'H1 Tags': Array.from(document.querySelectorAll('h1')).map(h => h.textContent.trim()).join(', ') || 'Not found',
  };

  const modal = document.createElement('div');
  modal.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #282A33;
    color: white;
    padding: 20px;
    border-radius: 8px;
    z-index: 1000000;
    max-width: 600px;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 4px 20px rgba(0,0,0,0.5);
  `;

  modal.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
      <h2 style="color: #4ADC71; margin: 0;">SEO Meta Inspector</h2>
      <button id="close-seo-modal" style="background: #649ef5; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">Close</button>
    </div>
    <div style="font-size: 14px;">
      ${Object.entries(seoData).map(([key, value]) => `
        <div style="margin-bottom: 15px; padding: 10px; background: #353945; border-radius: 4px;">
          <strong style="color: #4ADC71;">${key}:</strong><br>
          <span style="word-break: break-word;">${value}</span>
        </div>
      `).join('')}
    </div>
  `;

  document.body.appendChild(modal);

  document.getElementById('close-seo-modal').onclick = () => modal.remove();
}

// ===================================
// ELEMENT EDITOR
// ===================================
function handleElementEditor() {
  showNotification('Click on any text element to edit it. Press ESC to exit edit mode.', 'info');

  const editHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const target = e.target;

    if (target.isContentEditable) return;

    target.contentEditable = 'true';
    target.style.outline = '2px solid #4ADC71';
    target.focus();

    const saveEdit = () => {
      target.contentEditable = 'false';
      target.style.outline = '';
      target.removeEventListener('blur', saveEdit);
      showNotification('Element text updated!', 'success');
    };

    target.addEventListener('blur', saveEdit);

    document.removeEventListener('click', editHandler);
  };

  document.addEventListener('click', editHandler, { once: true });
}

// ===================================
// ELEMENT MANIPULATOR
// ===================================
function handleElementManipulator(mode) {
  const messages = {
    delete: 'Click on an element to delete it',
    hide: 'Click on an element to hide it',
    duplicate: 'Click on an element to duplicate it',
  };

  showNotification(messages[mode] + '. Press ESC to cancel.', 'info');

  const manipulateHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const target = e.target;

    switch(mode) {
      case 'delete':
        target.remove();
        showNotification('Element deleted!', 'success');
        break;
      case 'hide':
        target.style.display = 'none';
        showNotification('Element hidden!', 'success');
        break;
      case 'duplicate':
        const clone = target.cloneNode(true);
        target.parentNode.insertBefore(clone, target.nextSibling);
        showNotification('Element duplicated!', 'success');
        break;
    }

    document.removeEventListener('click', manipulateHandler);
  };

  document.addEventListener('click', manipulateHandler, { once: true });
}

// ===================================
// ELEMENT EXPORT
// ===================================
function handleElementExport() {
  showNotification('Click on an element to export its HTML and CSS', 'info');

  const exportHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const target = e.target;
    const html = target.outerHTML;
    const css = getCSSProperties(target).join('\n');

    const exportData = `/* HTML */\n${html}\n\n/* CSS */\n${target.tagName.toLowerCase()} {\n${css}\n}`;

    navigator.clipboard.writeText(exportData).then(() => {
      showNotification('Element HTML and CSS copied to clipboard!', 'success');
    }).catch(() => {
      showNotification('Failed to copy element data', 'error');
    });

    document.removeEventListener('click', exportHandler);
  };

  document.addEventListener('click', exportHandler, { once: true });
}

// ===================================
// FONT CHANGER
// ===================================
function handleFontChanger() {
  const fonts = [
    'Arial', 'Helvetica', 'Times New Roman', 'Courier New', 'Verdana',
    'Georgia', 'Comic Sans MS', 'Trebuchet MS', 'Arial Black', 'Impact',
    'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Poppins'
  ];

  const modal = document.createElement('div');
  modal.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #282A33;
    color: white;
    padding: 20px;
    border-radius: 8px;
    z-index: 1000000;
    max-width: 400px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.5);
  `;

  modal.innerHTML = `
    <h2 style="color: #4ADC71; margin-bottom: 20px;">Change Page Font</h2>
    <select id="font-selector" style="width: 100%; padding: 10px; background: #353945; color: white; border: none; border-radius: 4px; margin-bottom: 15px; font-size: 14px;">
      <option value="">Select a font...</option>
      ${fonts.map(font => `<option value="${font}" style="font-family: ${font};">${font}</option>`).join('')}
    </select>
    <div style="display: flex; gap: 10px;">
      <button id="apply-font" style="flex: 1; padding: 10px; background: #649ef5; color: white; border: none; border-radius: 4px; cursor: pointer;">Apply</button>
      <button id="reset-font" style="flex: 1; padding: 10px; background: #44696d; color: white; border: none; border-radius: 4px; cursor: pointer;">Reset</button>
      <button id="close-font-modal" style="padding: 10px; background: #353945; color: white; border: none; border-radius: 4px; cursor: pointer;">Close</button>
    </div>
  `;

  document.body.appendChild(modal);

  document.getElementById('apply-font').onclick = () => {
    const selectedFont = document.getElementById('font-selector').value;
    if (selectedFont) {
      document.body.style.fontFamily = selectedFont + ', sans-serif';
      showNotification(`Font changed to ${selectedFont}`, 'success');
    }
  };

  document.getElementById('reset-font').onclick = () => {
    document.body.style.fontFamily = '';
    showNotification('Font reset to default', 'success');
  };

  document.getElementById('close-font-modal').onclick = () => modal.remove();
}

// ===================================
// CACHE CLEAR
// ===================================
function handleCacheClear() {
  chrome.runtime.sendMessage({ action: 'clearBrowserCache' }, (response) => {
    if (response && response.success) {
      showNotification('Cache cleared successfully!', 'success');
    } else {
      showNotification('Failed to clear cache', 'error');
    }
  });
}

// ===================================
// CONFIG MODAL
// ===================================
function showConfigModal() {
  if (document.getElementById('myModal')) {
    document.getElementById('myModal').style.display = 'flex';
    return;
  }

  const modalHTML = `
    <div id="myModal" class="fixed inset-0 flex items-center justify-center z-50" style="display: flex;">
      <div class="bg-gray-800 rounded-lg shadow-md p-6 text-white w-3/4 max-w-2xl">
        <h2 class="text-2xl font-semibold mb-4" style="color: #649ef5;">Steps to Retrieve and View CSAE Config Stored on Your Browser</h2>
        <ol class="list-decimal list-inside ml-4 mb-4">
          <li class="mb-2 text-white">Open the Extension:
            <ul class="list-disc list-inside ml-4">
              <li class="text-white">Click on the Cisco Support Assistant Extension icon in your Chrome browser to open the extension window.</li>
            </ul>
          </li>
          <li class="mb-2 text-white">Inspect the Extension:
            <ul class="list-disc list-inside ml-4">
              <li class="text-white">Right-click on the opened extension window.</li>
              <li class="text-white">Select "Inspect" from the context menu. This action opens the Chrome Developer Tools (DevTools) for that extension.</li>
            </ul>
          </li>
          <li class="mb-2 text-white">Navigate to the CSAE Toolkit CE Storage Panel:
            <ul class="list-disc list-inside ml-4">
              <li class="text-white">In the DevTools, look for a panel labeled "CSAE Toolkit CE Storage". This might be among the tabs at the top or accessible via the "&gt;&gt;" button if there are many tabs.</li>
            </ul>
          </li>
          <li class="mb-2 text-white">Load the CSAE Config:
            <ul class="list-disc list-inside ml-4">
              <li class="text-white">Inside the "CSAE Toolkit CE Storage" panel, you will find two buttons.</li>
              <li class="text-white">Click on the button labeled to load the storage, typically named something like "Load Storage". This action will retrieve the CSAE configuration for your browser from the extension's storage.</li>
            </ul>
          </li>
        </ol>
        <button id="closeModal" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300 mt-4 font-semibold">Close</button>
      </div>
    </div>
  `;

  const modalCSS = `
    .fixed { position: fixed; }
    .inset-0 { top: 0; right: 0; bottom: 0; left: 0; }
    .flex { display: flex; }
    .items-center { align-items: center; }
    .justify-center { justify-content: center; }
    .z-50 { z-index: 50; }
    .bg-gray-800 { background-color: #2d3748; }
    .rounded-lg { border-radius: 0.5rem; }
    .shadow-md { box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
    .p-6 { padding: 1.6rem; font-weight: 400; }
    .text-white { color: white; }
    .w-3/4 { width: 75%; }
    .max-w-2xl { max-width: 600px; }
    .text-2xl { font-size: 1.8rem; }
    .font-semibold { font-weight: 600; }
    .mb-4 { margin-bottom: 1rem; }
    .list-decimal { list-style-type: decimal; }
    .list-inside { list-style-position: inside; }
    .ml-4 { margin-left: 1rem; }
    .mb-2 { margin-bottom: 0.5rem; }
    .list-disc { list-style-type: disc; }
    .px-4 { padding-left: 1rem; padding-right: 1rem; }
    .py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
    .bg-blue-500 { background-color: #4299e1; }
    .rounded { border-radius: 0.25rem; }
    .hover\\:bg-blue-600:hover { background-color: #3182ce; }
    .transition { transition: all 0.2s ease-in-out; }
    .duration-300 { transition-duration: 300ms; }
    .mt-4 { margin-top: 1rem; }
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
    body, button, h2, li { font-family: 'Inter', Arial, sans-serif; }
  `;

  document.body.insertAdjacentHTML('beforeend', modalHTML);
  const style = document.createElement('style');
  style.textContent = modalCSS;
  document.head.appendChild(style);

  document.getElementById('closeModal').addEventListener('click', () => {
    document.getElementById('myModal').style.display = 'none';
  });
}

// ===================================
// UTILITY FUNCTIONS
// ===================================
function getUniqueSelector(el) {
  if (!(el instanceof Element)) return '';
  let path = [];

  while (el && el.nodeType === Node.ELEMENT_NODE) {
    let selector = el.nodeName.toLowerCase();
    if (el.id) {
      selector = `#${el.id}`;
      path.unshift(selector);
      break;
    } else if (typeof el.className === 'string' && el.className.trim()) {
      let classes = el.className.trim().split(/\s+/).join('.');
      if (classes) {
        selector += `.${classes}`;
      }
    }
    let sib = el;
    let nth = 1;
    while (sib = sib.previousElementSibling) {
      if (sib.nodeName.toLowerCase() === selector) nth++;
    }
    if (nth !== 1) {
      selector += `:nth-of-type(${nth})`;
    }
    path.unshift(selector);
    el = el.parentNode;
  }

  while (path.length > 1 && !path[0].includes('#') && !path[0].includes('.')) {
    path.shift();
  }

  return path.join(' > ');
}

function getElementValue(el) {
  if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
    return el.value;
  } else {
    return el.textContent.trim();
  }
}

function getCSSProperties(el) {
  const computedStyle = window.getComputedStyle(el);
  const properties = Array.from(computedStyle).map(prop =>
    `<span style="color:#00BCEA;">${prop}</span>: ${computedStyle.getPropertyValue(prop)};`
  );
  return properties;
}

function showNotification(message, type = 'success') {
  // Remove any existing notification
  let existingNotification = document.querySelector('.csae-notification');
  if (existingNotification) {
    existingNotification.remove();
    clearTimeout(window.csaeToolkit.notificationTimeout);
  }

  const colors = {
    success: '#4ADC71',
    error: '#FF4444',
    info: '#649ef5',
  };

  const notification = document.createElement('div');
  notification.className = 'csae-notification';
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 10001;
    background-color: #23282e;
    color: ${colors[type]};
    padding: 10px 20px;
    border-radius: 8px;
    font-family: Inter, Arial, sans-serif;
    font-size: 14px;
    font-weight: bold;
    display: flex;
    align-items: center;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  `;

  const icon = type === 'success'
    ? '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" width="24px" height="24px"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M9 16.17l-4.17-4.17-1.41 1.41L9 19 20.59 7.41l-1.41-1.41z"/></svg>'
    : type === 'error'
    ? '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" width="24px" height="24px"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/></svg>'
    : '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" width="24px" height="24px"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>';

  notification.innerHTML = `${icon}<span style="margin-left: 10px;">${message}</span>`;

  document.body.appendChild(notification);

  window.csaeToolkit.notificationTimeout = setTimeout(() => {
    notification.style.transition = 'opacity 0.5s';
    notification.style.opacity = '0';
    setTimeout(() => {
      notification.remove();
    }, 500);
  }, 3000);
}

console.log('CSAE Toolkit v3.0 Content Script Loaded');
