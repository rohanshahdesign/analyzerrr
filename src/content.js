function findPolicyLinks() {
  const links = document.getElementsByTagName('a');
  const policyRegex = /privacy|cookie/i;
  const policyUrls = new Set();

  // Add the current page's URL if it seems to be a privacy policy
  if (policyRegex.test(window.location.href)) {
    policyUrls.add(window.location.href);
  }

  for (let i = 0; i < links.length; i++) {
    if (policyRegex.test(links[i].textContent) || policyRegex.test(links[i].href)) {
      policyUrls.add(links[i].href);
    }
  }
  return Array.from(policyUrls);
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getPrivacyPolicyUrl") {
    const policyUrls = findPolicyLinks();
    console.log("Found policy URLs:", policyUrls);
    sendResponse({ urls: policyUrls });
  }
});
