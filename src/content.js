chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getPrivacyPolicyUrl") {
    const links = document.getElementsByTagName('a');
    const privacyRegex = /privacy/i;
    let policyUrl = null;

    for (let i = 0; i < links.length; i++) {
      if (privacyRegex.test(links[i].textContent) || privacyRegex.test(links[i].href)) {
        policyUrl = links[i].href;
        break;
      }
    }
    sendResponse({ url: policyUrl });
  }
});
