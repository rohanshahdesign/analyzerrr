async function analyzeText(text, sendResponse) {
  try {
    const response = await fetch('https://analyzerrr.vercel.app/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, task: 'full_analysis' }),
    });
    const analysis = await response.json();
    sendResponse(analysis);
  } catch (error) {
    console.error("Error during full analysis:", error);
    sendResponse({ error: "Could not get analysis from server." });
  }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "analyze") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      if (activeTab && activeTab.id) {
        chrome.scripting.executeScript({
          target: { tabId: activeTab.id },
          files: ["content.js"]
        }, () => {
          chrome.tabs.sendMessage(activeTab.id, { action: "getPageText" }, async (response) => {
            if (response && response.text) {
              try {
                const preliminaryCheck = await fetch('https://analyzerrr.vercel.app/api/analyze', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ text: response.text, task: 'preliminary_check' }),
                });
                const checkResult = await preliminaryCheck.json();

                if (checkResult.is_privacy_policy) {
                  analyzeText(response.text, sendResponse);
                } else {
                  chrome.tabs.sendMessage(activeTab.id, { action: "getPrivacyPolicyUrl" }, (policyResponse) => {
                    if (policyResponse && policyResponse.urls && policyResponse.urls.length > 0) {
                      const policyUrl = policyResponse.urls[0];
                      chrome.tabs.create({ url: policyUrl, active: false }, (newTab) => {
                        chrome.scripting.executeScript({
                          target: { tabId: newTab.id },
                          files: ["content.js"]
                        }, () => {
                          chrome.tabs.sendMessage(newTab.id, { action: "getPageText" }, (textResponse) => {
                            if (textResponse && textResponse.text) {
                              analyzeText(textResponse.text, (analysis) => {
                                sendResponse(analysis);
                                chrome.tabs.remove(newTab.id);
                              });
                            } else {
                              sendResponse({ error: "Could not get text from policy page." });
                              chrome.tabs.remove(newTab.id);
                            }
                          });
                        });
                      });
                    } else {
                      sendResponse({ error: "This is not a privacy policy and no links were found." });
                    }
                  });
                }
              } catch (error) {
                console.error("Error during preliminary check:", error);
                sendResponse({ error: "Could not perform preliminary check." });
              }
            } else {
              sendResponse({ error: "Could not get page text." });
            }
          });
        });
      } else {
        sendResponse({ error: "Could not get active tab." });
      }
    });
    return true;
  }
});
