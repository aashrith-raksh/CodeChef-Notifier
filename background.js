// background.js

// Global variables
let submissionId = null;
let csrfToken = null;

// Step 1: Listen for messages from the content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "submit") {
    // Save submission ID and csrf token
    submissionId = request.submissionId;
    csrfToken = request.csrfToken;
    // Step 2: Fetch problem details
    fetchProblemDetails();
  }
});

// Step 2: Fetch problem details
function fetchProblemDetails() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tabId = tabs[0].id;
    chrome.tabs.sendMessage(tabId, { action: "getProblemDetails" }, (response) => {
      // Save problem details
      const { problemName, problemId } = response;
      // Step 3: Check verdict
      checkVerdict(problemName, problemId);
    });
  });
}

// Step 3: Check verdict
function checkVerdict(problemName, problemId) {
  const url = `https://www.codechef.com/api/contests/COOK123/problems/${problemId}/submissions/${submissionId}`;

  const checkResult = () => {
    fetch(url, {
      headers: {
        "x-csrf-token": csrfToken
      }
    })
      .then(response => response.json())
      .then(data => {
        if (data.result_code === 0) {
          // Verdict not available yet, retry after some time
          setTimeout(checkResult, 5000);
        } else {
          // Step 4: Verdict available, notify user
          notifyUser(problemName, data.result);
        }
      })
      .catch(error => {
        console.error("An error occurred while checking the verdict:", error);
      });
  };

  // Initial check
  checkResult();
}

// Step 4: Notify user
function notifyUser(problemName, verdict) {
  chrome.notifications.create({
    type: "basic",
    iconUrl: "icon.png",
    title: "Codechef Notifier",
    message: `Verdict for problem "${problemName}": ${verdict}`
  });
}
