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
  notification.style.fontFamily = 'Arial, sans-serif';  // Fallback to Arial
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
