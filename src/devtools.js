console.log("DevTools script loaded");

chrome.devtools.panels.create(
  "CSAE Toolkit CE Storage",
  "icon128.png",
  "panel.html",
  function(panel) {
    console.log("CSAE Toolkit Storage panel created");
  }
);
