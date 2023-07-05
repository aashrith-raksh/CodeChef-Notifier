// popup.js

// Get the currently active tab
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tabId = tabs[0].id;
    // Clear the active tab's notification when the popup is opened
    chrome.notifications.clear(tabId.toString());
  });
  
  // Close the popup after a certain delay
  setTimeout(() => {
    window.close();
  }, 3000);
  