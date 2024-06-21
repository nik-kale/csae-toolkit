document.addEventListener('DOMContentLoaded', function() {
  const loadButton = document.getElementById('loadStorage');
  const clearButton = document.getElementById('clearStorage');
  const storageDataDiv = document.getElementById('storageData');

  loadButton.addEventListener('click', async () => {
    try {
      const result = await new Promise((resolve, reject) => {
        chrome.devtools.inspectedWindow.eval(
          "new Promise((resolve) => { chrome.storage.local.get(null, (items) => { resolve(items); }); })",
          (result, isException) => {
            if (isException) {
              reject(isException);
            } else {
              resolve(result);
            }
          }
        );
      });

      if (result === undefined || result === null) {
        throw new Error('No result returned');
      } else {
        console.log('Loaded storage data:', result);
        storageDataDiv.innerHTML = `<pre>${JSON.stringify(result, null, 2)}</pre>`;
      }
    } catch (error) {
      console.error('Failed to load storage data:', error);
      storageDataDiv.innerHTML = '<p>Error: Failed to load storage data.</p>';
    }
  });

  clearButton.addEventListener('click', async () => {
    try {
      const result = await new Promise((resolve, reject) => {
        chrome.devtools.inspectedWindow.eval(
          "new Promise((resolve) => { chrome.storage.local.clear(() => { resolve('Storage cleared'); }); })",
          (result, isException) => {
            if (isException) {
              reject(isException);
            } else {
              resolve(result);
            }
          }
        );
      });

      if (result === undefined || result === null) {
        throw new Error('No result returned');
      } else {
        console.log(result);
        storageDataDiv.innerHTML = '<p>Storage cleared.</p>';
      }
    } catch (error) {
      console.error('Failed to clear storage data:', error);
      storageDataDiv.innerHTML = '<p>Error: Failed to clear storage data.</p>';
    }
  });
});
