document.addEventListener('DOMContentLoaded', function() {
  const loadButton = document.getElementById('loadStorage');
  const clearButton = document.getElementById('clearStorage');
  const jsonEditorContainer = document.getElementById('jsoneditor');
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

  // Load Storage Data
  loadButton.addEventListener('click', () => {
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
        jsonEditorContainer.innerHTML = 'Failed to load storage data: ' + isException.value;
      } else {
        chrome.devtools.inspectedWindow.eval(
          'window.__devtools_storage_data;',
          (storageData, storageException) => {
            if (storageException) {
              jsonEditorContainer.innerHTML = 'Failed to load storage data: ' + storageException.value;
            } else if (storageData) {
              // Clear previous content
              jsonEditorContainer.innerHTML = '';
              jsonEditorContainer.innerHTML = '<pre class=json-container>' + prettyPrintJson.toHtml(JSON.parse(storageData, { indent: 5, lineNumbers: false, linkUrls: true, linksNewTab: true, quoteKeys:false, trailingCommas:true })) + '</pre>';
            } else {
              jsonEditorContainer.innerHTML = 'Storage data is empty.';
            }
          }
        );
      }
    });
  });

  // Clear Storage Data
  clearButton.addEventListener('click', () => {
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
        jsonEditorContainer.innerHTML = 'Failed to clear storage data: ' + isException.value;
      } else {
        jsonEditorContainer.innerHTML = '<pre>' + 'Storage cleared successfully.' + '</pre>';
      }
    });
  });
});
