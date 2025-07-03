function findPolicyLinks() {
  const links = document.getElementsByTagName('a');
  const policyRegex = /privacy|cookie/i;
  const policyUrls = new Set();

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
    sendResponse({ urls: policyUrls });
  }
});
