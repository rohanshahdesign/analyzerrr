// importScripts('analyzer.js');

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "analyze") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      if (activeTab && activeTab.id) {
        chrome.scripting.executeScript({
          target: { tabId: activeTab.id },
          files: ["content.js"]
        }, () => {
          chrome.tabs.sendMessage(activeTab.id, { action: "getPrivacyPolicyUrl" }, (response) => {
            if (response && response.url) {
              fetch(response.url)
                .then(res => res.text())
                .then(text => {
                  // Send the text to our serverless function for analysis
                  fetch('https://analyzerrr.vercel.app/api/analyze', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ text: text }),
                  })
                  .then(res => res.json())
                  .then(analysis => {
                    sendResponse(analysis);
                  })
                  .catch(error => {
                    console.error("Error from analysis server:", error);
                    sendResponse({ error: "Could not get analysis from server." });
                  });
                })
                .catch(error => {
                  console.error("Error fetching privacy policy:", error);
                  sendResponse({ error: "Could not fetch the privacy policy." });
                });
            } else {
              sendResponse({ error: "Could not find the privacy policy link." });
            }
          });
        });
      } else {
        sendResponse({ error: "Could not get active tab." });
      }
    });
    return true; // Indicates that the response is sent asynchronously
  }
});
