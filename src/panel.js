// CSAE Toolkit DevTools Panel
// Enhanced with better error handling, loading states, and user feedback

document.addEventListener('DOMContentLoaded', function() {
  const loadButton = document.getElementById('loadStorage');
  const clearButton = document.getElementById('clearStorage');
  const jsonEditorContainer = document.getElementById('jsoneditor');

  // State management
  let isLoading = false;
  let currentData = null;

  // Pretty print JSON utility with syntax highlighting
  const prettyPrintJson = {
    toHtml(data, options) {
        const defaults = {
            indent: 3,
            lineNumbers: false,
            linkUrls: true,
            linksNewTab: true,
            quoteKeys: false,
            trailingCommas: true,
        };
        const settings = { ...defaults, ...options };
        const invalidHtml = /[<>&]|\\"/g;
        const toHtml = (char) => char === '<' ? '&lt;' :
            char === '>' ? '&gt;' :
                char === '&' ? '&amp;' :
                    '&bsol;&quot;';
        const spanTag = (type, display) => display ? '<span class=json-' + type + '>' + display + '</span>' : '';
        const buildValueHtml = (value) => {
            const strType = /^"/.test(value) && 'string';
            const boolType = ['true', 'false'].includes(value) && 'boolean';
            const nullType = value === 'null' && 'null';
            const type = boolType || nullType || strType || 'number';
            const urlPattern = /https?:\/\/[^\s"]+/g;
            const target = settings.linksNewTab ? ' target=_blank' : '';
            const makeLink = (link) => `<a class=json-link href="${link}"${target}>${link}</a>`;
            const display = strType && settings.linkUrls ? value.replace(urlPattern, makeLink) : value;
            return spanTag(type, display);
        };
        const replacer = (match, ...parts) => {
            const part = { indent: parts[0], key: parts[1], value: parts[2], end: parts[3] };
            const findName = settings.quoteKeys ? /(.*)(): / : /"([\w$]+)": |(.*): /;
            const indentHtml = part.indent || '';
            const keyName = part.key && part.key.replace(findName, '$1$2');
            const keyHtml = part.key ? spanTag('key', keyName) + spanTag('mark', ': ') : '';
            const valueHtml = part.value ? buildValueHtml(part.value) : '';
            const noComma = !part.end || [']', '}'].includes(match.at(-1));
            const addComma = settings.trailingCommas && match.at(0) === ' ' && noComma;
            const endHtml = spanTag('mark', addComma ? (part.end ?? '') + ',' : part.end);
            return indentHtml + keyHtml + valueHtml + endHtml;
        };
        const jsonLine = /^( *)("[^"]+": )?("[^"]*"|[\w.+-]*)?([{}[\],]*)?$/mg;
        const json = JSON.stringify(data, null, settings.indent) || 'undefined';
        const html = json.replace(invalidHtml, toHtml).replace(jsonLine, replacer);
        const makeLine = (line) => `   <li>${line}</li>`;
        const addLineNumbers = (html) => ['<ol class=json-lines>', ...html.split('\n').map(makeLine), '</ol>'].join('\n');
        return settings.lineNumbers ? addLineNumbers(html) : html;
    },
  };

  // Show loading state
  function showLoading(message = 'Loading...') {
    isLoading = true;
    loadButton.disabled = true;
    clearButton.disabled = true;
    jsonEditorContainer.innerHTML = `
      <div style="padding: 20px; text-align: center; color: #666;">
        <div style="font-size: 14px; margin-bottom: 10px;">${message}</div>
        <div class="spinner" style="border: 3px solid #f3f3f3; border-top: 3px solid #3498db; border-radius: 50%; width: 30px; height: 30px; animation: spin 1s linear infinite; margin: 0 auto;"></div>
      </div>
      <style>
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      </style>
    `;
  }

  // Hide loading state
  function hideLoading() {
    isLoading = false;
    loadButton.disabled = false;
    clearButton.disabled = false;
  }

  // Show error message
  function showError(message, details = null) {
    hideLoading();
    const detailsHtml = details ? `<div style="margin-top: 10px; padding: 10px; background: #2a2a2a; border-radius: 4px; font-size: 12px; font-family: monospace;">${details}</div>` : '';
    jsonEditorContainer.innerHTML = `
      <div style="padding: 20px; color: #e74c3c;">
        <strong>❌ Error:</strong> ${message}
        ${detailsHtml}
      </div>
    `;
  }

  // Show success message
  function showSuccess(message, autoHide = true) {
    hideLoading();
    jsonEditorContainer.innerHTML = `
      <div style="padding: 20px; color: #27ae60;">
        <strong>✅ Success:</strong> ${message}
      </div>
    `;

    if (autoHide) {
      setTimeout(() => {
        if (currentData) {
          displayData(currentData);
        }
      }, 2000);
    }
  }

  // Display JSON data
  function displayData(data) {
    try {
      currentData = data;
      const dataSize = JSON.stringify(data).length;
      const itemCount = Object.keys(data).length;

      jsonEditorContainer.innerHTML = `
        <div style="padding: 10px; background: #f5f5f5; border-bottom: 1px solid #ddd; font-size: 12px; color: #666;">
          <strong>Storage Info:</strong> ${itemCount} items | ${(dataSize / 1024).toFixed(2)} KB
        </div>
        <pre class=json-container>${prettyPrintJson.toHtml(data, {
          indent: 3,
          lineNumbers: false,
          linkUrls: true,
          linksNewTab: true,
          quoteKeys: false,
          trailingCommas: true
        })}</pre>
      `;
    } catch (error) {
      showError('Failed to display data', error.message);
    }
  }

  // Load Storage Data
  loadButton.addEventListener('click', () => {
    if (isLoading) return;

    showLoading('Loading chrome.storage.local...');

    const code = `
      (function() {
        chrome.storage.local.get(null, function(result) {
          window.__devtools_storage_data = JSON.stringify(result);
        });
        return true;
      })();
    `;

    chrome.devtools.inspectedWindow.eval(code, (result, isException) => {
      if (isException) {
        showError('Failed to access storage', isException.value || 'Unknown error');
        return;
      }

      // Small delay to ensure data is set
      setTimeout(() => {
        chrome.devtools.inspectedWindow.eval(
          'window.__devtools_storage_data;',
          (storageData, storageException) => {
            if (storageException) {
              showError('Failed to retrieve storage data', storageException.value || 'Unknown error');
            } else if (storageData) {
              try {
                const parsedData = JSON.parse(storageData);
                hideLoading();

                if (Object.keys(parsedData).length === 0) {
                  jsonEditorContainer.innerHTML = `
                    <div style="padding: 20px; text-align: center; color: #888;">
                      📭 Storage is empty
                    </div>
                  `;
                } else {
                  displayData(parsedData);
                }
              } catch (error) {
                showError('Failed to parse storage data', error.message);
              }
            } else {
              hideLoading();
              jsonEditorContainer.innerHTML = `
                <div style="padding: 20px; text-align: center; color: #888;">
                  📭 No storage data available
                </div>
              `;
            }
          }
        );
      }, 100);
    });
  });

  // Clear Storage Data with confirmation
  clearButton.addEventListener('click', () => {
    if (isLoading) return;

    const confirmed = confirm(
      '⚠️ Are you sure you want to clear all chrome.storage.local data?\n\n' +
      'This will delete:\n' +
      '• Extension settings\n' +
      '• Copy history\n' +
      '• Theme preferences\n' +
      '• All stored configurations\n\n' +
      'This action cannot be undone!'
    );

    if (!confirmed) return;

    showLoading('Clearing storage...');

    const code = `
      (async function() {
        await new Promise((resolve, reject) => {
          chrome.storage.local.clear(function() {
            if (chrome.runtime.lastError) {
              reject(chrome.runtime.lastError.message);
            } else {
              resolve();
            }
          });
        });
        return true;
      })();
    `;

    chrome.devtools.inspectedWindow.eval(code, (result, isException) => {
      if (isException) {
        showError('Failed to clear storage', isException.value || 'Unknown error');
      } else {
        currentData = {};
        showSuccess('Storage cleared successfully!', false);

        // Show empty state after success message
        setTimeout(() => {
          jsonEditorContainer.innerHTML = `
            <div style="padding: 20px; text-align: center; color: #888;">
              📭 Storage is now empty
            </div>
          `;
        }, 2500);
      }
    });
  });

  // Initial load on panel open
  showLoading('Initializing DevTools panel...');
  setTimeout(() => {
    hideLoading();
    jsonEditorContainer.innerHTML = `
      <div style="padding: 40px; text-align: center; color: #666;">
        <div style="font-size: 48px; margin-bottom: 20px;">📦</div>
        <h3 style="margin: 0 0 10px 0; color: #333;">CSAE Toolkit Storage Panel</h3>
        <p style="margin: 0 0 20px 0;">Click "Load chrome.storage.local" to view extension storage</p>
        <div style="font-size: 12px; color: #999;">
          Version 4.0.0 | Made with ☕ and ❤️ by Nik Kale
        </div>
      </div>
    `;
  }, 500);

  // Keyboard shortcut: Ctrl/Cmd + R to reload
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
      e.preventDefault();
      loadButton.click();
    }
  });
});
