// content.js

// Step 1: Listen for form submission
document.addEventListener("submit", (event) => {
    const form = event.target;
    const submissionId = form.elements["submissionId"].value;
    const csrfToken = form.elements["csrfToken"].value;
    
    // Step 2: Send submission details to background script
    chrome.runtime.sendMessage({ action: "submit", submissionId, csrfToken });
  });
  
  // Step 2: Get problem details
  function getProblemDetails() {
    const problemNameElement = document.querySelector(".breadcrumb strong");
    const problemIdElement = document.querySelector(".problem-code");
    const problemName = problemNameElement ? problemNameElement.textContent.trim() : "";
    const problemId = problemIdElement ? problemIdElement.textContent.trim() : "";
  
    // Step 2: Respond with problem details
    return { problemName, problemId };
  }
  
  // Step 3: Send problem details to background script
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getProblemDetails") {
      // Step 2: Respond with problem details
      sendResponse(getProblemDetails());
    }
  });
  