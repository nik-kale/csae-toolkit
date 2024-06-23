// SECTION 1: HOVER BOX TO SHOW ELEMENT SELECTOR AND VALUE
if (!window.hoverBox) {
  window.hoverBox = document.createElement('div');
  window.hoverBox.style.position = 'fixed';
  window.hoverBox.style.zIndex = '10000';
  window.hoverBox.style.backgroundColor = '#282A33';  // Updated background color
  window.hoverBox.style.color = 'white';
  window.hoverBox.style.padding = '10px';
  window.hoverBox.style.borderRadius = '8px';  // Slightly rounded corners
  window.hoverBox.style.pointerEvents = 'none';
  window.hoverBox.style.display = 'none';
  window.hoverBox.style.fontFamily = 'Arial, sans-serif';  // Fallback to Arial
  window.hoverBox.style.fontSize = '14px';  // Updated font size
  window.hoverBox.style.lineHeight = '1.5';
  window.hoverBox.style.maxWidth = '600px';  // Increased max-width for two columns
  document.body.appendChild(window.hoverBox);
}

if (typeof window.hoverActive === 'undefined') {
  window.hoverActive = false;
}

if (typeof window.notificationTimeout === 'undefined') {
  window.notificationTimeout = null;
}

if (typeof window.pinnedHoverBoxes === 'undefined') {
  window.pinnedHoverBoxes = [];
}

if (typeof window.currentTarget === 'undefined') {
  window.currentTarget = null;
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'toggleHover') {
    window.hoverActive = message.hoverActive;
    if (window.hoverActive) {
      document.addEventListener('mousemove', mouseMoveHandler);
      document.addEventListener('mouseout', mouseOutHandler, { once: true });
      document.addEventListener('click', clickHandler, { once: true });
    } else {
      window.hoverBox.style.display = 'none';
      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseout', mouseOutHandler);
      document.removeEventListener('click', clickHandler);
    }
    sendResponse({ status: "success" });
  }

  if (message.action === 'pickColor') {
    pickColorHandler();
    sendResponse({ status: "success" });
  }
});

function mouseMoveHandler(event) {
  if (!window.hoverActive) return;

  // Check if hovering over a pinned hover box
  for (let hoverBox of window.pinnedHoverBoxes) {
    if (hoverBox.contains(event.target)) {
      window.hoverBox.style.display = 'none';
      return;
    }
  }

  window.hoverBox.style.left = `${event.clientX + 10}px`;
  window.hoverBox.style.top = `${event.clientY + 10}px`;
}

function mouseOutHandler(event) {
  if (window.currentTarget) {
    window.currentTarget.style.outline = '';
    window.currentTarget = null;
  }
  window.hoverBox.style.display = 'none';
}

function clickHandler(event) {
  if (!window.hoverActive) return;

  event.preventDefault();
  event.stopPropagation();

  let target = event.target;
  let path = getUniqueSelector(target);
  path = path.replace(/\s+/g, '');  // Remove all spaces from the selector

  if (event.altKey) {
    pinHoverBox(target, path);
  } else {
    // Hide hover box
    window.hoverBox.style.display = 'none';

    // Copy to clipboard
    navigator.clipboard.writeText(path).then(() => {
      showCopiedNotification();
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });

    chrome.runtime.sendMessage({ selector: path, value: getElementValue(target) });
  }

  return false;
}

function pinHoverBox(target, path) {
  const hoverBoxClone = window.hoverBox.cloneNode(true);
  hoverBoxClone.style.pointerEvents = 'auto';
  hoverBoxClone.style.position = 'absolute';
  hoverBoxClone.style.left = `${target.getBoundingClientRect().left + window.scrollX}px`;
  hoverBoxClone.style.top = `${target.getBoundingClientRect().top + window.scrollY}px`;
  hoverBoxClone.style.zIndex = '10001';  // Ensure pinned hover box is on top

  const closeButton = document.createElement('button');
  closeButton.textContent = 'x';
  closeButton.style.position = 'absolute';
  closeButton.style.top = '5px';
  closeButton.style.right = '5px';
  closeButton.style.background = 'transparent';
  closeButton.style.border = 'none';
  closeButton.style.color = 'white';
  closeButton.style.fontSize = '16px';
  closeButton.style.cursor = 'pointer';
  closeButton.onclick = () => {
    hoverBoxClone.remove();
    window.pinnedHoverBoxes = window.pinnedHoverBoxes.filter(box => box !== hoverBoxClone);
  };

  hoverBoxClone.appendChild(closeButton);
  document.body.appendChild(hoverBoxClone);
  window.pinnedHoverBoxes.push(hoverBoxClone);
}

function clearAllHoverBoxes() {
  window.hoverBox.style.display = 'none';
  window.pinnedHoverBoxes.forEach(box => box.remove());
  window.pinnedHoverBoxes = [];
  document.querySelectorAll('*').forEach(element => {
    element.style.outline = '';
  });
}

document.addEventListener('mouseover', function(event) {
  if (!window.hoverActive) return;

  // Check if hovering over a pinned hover box
  for (let hoverBox of window.pinnedHoverBoxes) {
    if (hoverBox.contains(event.target)) {
      window.hoverBox.style.display = 'none';
      return;
    }
  }

  let target = event.target;
  if (window.currentTarget) {
    window.currentTarget.style.outline = '';
  }
  window.currentTarget = target;
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
  closeButton.style.position = 'absolute';
  closeButton.style.top = '5px';
  closeButton.style.right = '5px';
  closeButton.style.background = 'transparent';
  closeButton.style.border = 'none';
  closeButton.style.color = 'white';
  closeButton.style.fontSize = '16px';
  closeButton.style.cursor = 'pointer';
  closeButton.onclick = () => {
    window.hoverBox.style.display = 'none';
    window.currentTarget.style.outline = '';
    window.currentTarget = null;
  };

  window.hoverBox.appendChild(closeButton);

  window.hoverBox.style.display = 'block';
  window.hoverBox.style.left = `${event.clientX + 10}px`;
  window.hoverBox.style.top = `${event.clientY + 10}px`;

  document.addEventListener('mousemove', mouseMoveHandler);
  document.addEventListener('mouseout', mouseOutHandler, { once: true });
  document.addEventListener('click', clickHandler, { once: true });
}, true);

document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape') {
    window.hoverActive = false;
    clearAllHoverBoxes();
    document.removeEventListener('mousemove', mouseMoveHandler);
    document.removeEventListener('mouseout', mouseOutHandler);
    document.removeEventListener('click', clickHandler);
  }
});

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

  // Remove leading elements until a unique identifier is found
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

function showCopiedNotification() {
  // Remove any existing notification
  let existingNotification = document.querySelector('.copied-notification');
  if (existingNotification) {
    existingNotification.remove();
    clearTimeout(window.notificationTimeout);
  }

  const notification = document.createElement('div');
  notification.className = 'copied-notification';
  notification.style.position = 'fixed';
  notification.style.top = '20px';
  notification.style.right = '20px';
  notification.style.zIndex = '10001';  // Ensure the notification is on top
  notification.style.backgroundColor = '#23282e';
  notification.style.color = '#4ADC71';
  notification.style.padding = '10px 20px';
  notification.style.borderRadius = '8px';
  notification.style.fontFamily = 'Inter, Arial, sans-serif';  // Fallback to Arial
  notification.style.fontSize = '14px';  // Updated font size
  notification.style.fontWeight = 'bold';  // Make the text bold
  notification.style.display = 'flex';
  notification.style.alignItems = 'center';
  notification.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="#4ADC71" viewBox="0 0 24 24" width="24px" height="24px"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M9 16.17l-4.17-4.17-1.41 1.41L9 19 20.59 7.41l-1.41-1.41z"/></svg><span style="margin-left: 10px;">Copied to clipboard!</span>`;

  document.body.appendChild(notification);

  window.notificationTimeout = setTimeout(() => {
    notification.style.transition = 'opacity 0.5s';
    notification.style.opacity = '0';
    setTimeout(() => {
      notification.remove();
      // Show hover box again
      window.hoverBox.style.display = 'block';
    }, 500);
  }, 2000);
}

// SECTION 2: MODAL WINDOW TO SHOW MESSAGE INTRUCTIONS FOR VIEWING CSAE CONFIG
if (!window.modalInitialized) {
  // Create and inject modal HTML
  const modalHTML = `
    <div id="myModal" class="fixed inset-0 flex items-center justify-center z-50" style="display: none;">
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
    .fixed {
      position: fixed;
    }
    .inset-0 {
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
    }
    .flex {
      display: flex;
    }
    .items-center {
      align-items: center;
    }
    .justify-center {
      justify-content: center;
    }
    .z-50 {
      z-index: 50;
    }
    .bg-gray-800 {
      background-color: #2d3748;
    }
    .rounded-lg {
      border-radius: 0.5rem;
    }
    .shadow-md {
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .p-6 {
      padding: 1.6rem;
      font-weight: 400;
    }
    .text-white {
      color: white;
    }
    .w-3/4 {
      width: 75%;
    }
    .max-w-2xl {
      max-width: 600px;
    }
    .text-2xl {
      font-size: 1.8rem;
    }
    .font-semibold {
      font-weight: 600;
    }
    .mb-4 {
      margin-bottom: 1rem;
    }
    .list-decimal {
      list-style-type: decimal;
    }
    .list-inside {
      list-style-position: inside;
    }
    .ml-4 {
      margin-left: 1rem;
    }
    .mb-2 {
      margin-bottom: 0.5rem;
    }
    .list-disc {
      list-style-type: disc;
    }
    .px-4 {
      padding-left: 1rem;
      padding-right: 1rem;
    }
    .py-2 {
      padding-top: 0.5rem;
      padding-bottom: 0.5rem;
    }
    .bg-blue-500 {
      background-color: #4299e1;
    }
    .rounded {
      border-radius: 0.25rem;
    }
    .hover\\:bg-blue-600:hover {
      background-color: #3182ce;
    }
    .transition {
      transition: all 0.2s ease-in-out;
    }
    .duration-300 {
      transition-duration: 300ms;
    }
    .mt-4 {
      margin-top: 1rem;
    }
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
    body, button, h2, li {
      font-family: 'Inter', Arial, sans-serif;
    }
  `;

    // Inject the modal HTML and CSS into the page
  document.body.insertAdjacentHTML('beforeend', modalHTML);
  const style = document.createElement('style');
  style.textContent = modalCSS;
  document.head.appendChild(style);

  // Add event listener to close the modal
  document.getElementById('closeModal').addEventListener('click', () => {
    document.getElementById('myModal').style.display = 'none';
  });

  // Function to show the modal
  function showModal() {
    document.getElementById('myModal').style.display = 'flex';
  }

  // Listen for messages to show the modal
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'viewConfig') {
      showModal();
    }
  });

  // Mark the modal as initialized
  window.modalInitialized = true;
}


// SECION 3: COLOR PICKER FUNCTIONALITY
function pickColorHandler() {
  if ('EyeDropper' in window) {
    const eyeDropper = new window.EyeDropper();
    eyeDropper.open().then(result => {
      console.log('Color picked:', result.sRGBHex); // Log the picked color

      // Try using the Clipboard API first
      navigator.clipboard.writeText(result.sRGBHex).then(() => {
        console.log('Color copied to clipboard:', result.sRGBHex); // Log successful copy
        showColorCopiedNotification(`Color ${result.sRGBHex} copied to clipboard!`);
      }).catch(() => {
        // Fallback to document.execCommand('copy')
        fallbackCopyTextToClipboard(result.sRGBHex);
      });
    }).catch(() => {
      showColorCopiedNotification('Failed to pick color');
    });
  } else {
    showColorCopiedNotification('EyeDropper API not supported');
  }
}

function fallbackCopyTextToClipboard(text) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed'; // Avoid scrolling to bottom
  textArea.style.opacity = '0';
  textArea.style.left = '-9999px';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    const successful = document.execCommand('copy');
    const msg = successful ? 'successful' : 'unsuccessful';
    console.log('Fallback: Copying text command was ' + msg);
    showColorCopiedNotification(`Color ${text} copied to clipboard!`);
  } catch (err) {
    console.error('Fallback: Oops, unable to copy');
    showColorCopiedNotification('Failed to copy color');
  }

  document.body.removeChild(textArea);
}



function showColorCopiedNotification(message) {
  // Remove any existing notification
  let existingNotification = document.querySelector('.copied-notification');
  if (existingNotification) {
    existingNotification.remove();
    clearTimeout(window.notificationTimeout);
  }

  const notification = document.createElement('div');
  notification.className = 'copied-notification';
  notification.style.position = 'fixed';
  notification.style.top = '20px';
  notification.style.right = '20px';
  notification.style.zIndex = '10001';  // Ensure the notification is on top
  notification.style.backgroundColor = '#23282e';
  notification.style.color = '#4ADC71';
  notification.style.padding = '10px 20px';
  notification.style.borderRadius = '8px';
  notification.style.fontFamily = 'Inter, Arial, sans-serif';  // Fallback to Arial
  notification.style.fontSize = '14px';  // Updated font size
  notification.style.fontWeight = 'bold';  // Make the text bold
  notification.style.display = 'flex';
  notification.style.alignItems = 'center';
  notification.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="#4ADC71" viewBox="0 0 24 24" width="24px" height="24px"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M9 16.17l-4.17-4.17-1.41 1.41L9 19 20.59 7.41l-1.41-1.41z"/></svg><span style="margin-left: 10px;">${message}</span>`;

  document.body.appendChild(notification);

  window.notificationTimeout = setTimeout(() => {
    notification.style.transition = 'opacity 0.5s';
    notification.style.opacity = '0';
    setTimeout(() => {
      notification.remove();
    }, 500);
  }, 2000);
}
