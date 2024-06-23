document.addEventListener('DOMContentLoaded', function() {
  const loadButton = document.getElementById('loadStorage');
  const clearButton = document.getElementById('clearStorage');
  const storageDataDiv = document.getElementById('storageData');

  loadButton.addEventListener('click', () => {
    async function fetchStorageData() {
      const code = `
        (async function() {
          try {
            //console.log('Evaluating chrome.storage.local.get');
            const result = await new Promise((resolve, reject) => {
              chrome.storage.local.get(null, function(items) {
                if (chrome.runtime.lastError) {
                  console.error('chrome.runtime.lastError:', chrome.runtime.lastError.message);
                  reject(chrome.runtime.lastError.message);
                } else {
                  //console.log('Items retrieved:', items);
                  resolve(items);
                }
              });
            });
            console.clear();
            console.log('CSAE Config retrieved from CSAE cloud and used on this browser:', result);
            return JSON.stringify({ data: result });
          } catch (error) {
            console.error('Error getting storage items:', error);
            return JSON.stringify({ error: error.toString() });
          }
        })()
      `;

      chrome.devtools.inspectedWindow.eval(code, (result, isException) => {
        if (isException) {
          console.error('Failed to load storage data:', isException);
          storageDataDiv.innerHTML = '<p>Error: Failed to load storage data.</p>';
        } else {
          console.log('Loaded storage data:', result);
          if (result) {
            storageDataDiv.innerHTML = `<pre>Check the Console tab for results</pre>`;
          } else {
            storageDataDiv.innerHTML = '<p>No storage data found.</p>';
          }
        }
      });
    }

    // Call the function to execute the logic
    fetchStorageData();


  });

  clearButton.addEventListener('click', () => {
    chrome.devtools.inspectedWindow.eval(
      `(async function() {
        try {
          console.log('Evaluating chrome.storage.local.clear');
          await new Promise((resolve, reject) => {
            chrome.storage.local.clear(function() {
              if (chrome.runtime.lastError) {
                console.error('chrome.runtime.lastError:', chrome.runtime.lastError.message);
                reject(chrome.runtime.lastError.message);
              } else {
                console.log('Storage cleared successfully');
                resolve();
              }
            });
          });
          return JSON.stringify({ success: true });
        } catch (error) {
          console.error('Error clearing storage:', error);
          return JSON.stringify({ error: error.toString() });
        }
      })()`,
      (result, isException) => {
        console.log('Evaluated script result:', result);
        if (isException) {
          console.error('Failed to clear storage data:', isException);
          storageDataDiv.innerHTML = '<p>Error: Failed to clear storage data.</p>';
        } else {
            console.log('Storage cleared');
              storageDataDiv.innerHTML = '<p>Storage cleared.</p>';
        }
      }
    );
  });
});
