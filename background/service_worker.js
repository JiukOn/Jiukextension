chrome.runtime.onInstalled.addListener(({ reason }) => {
  if (reason === 'install' || reason === 'update') {
    chrome.storage.local.get(['blockedKeywords']).then((result) => {
      if (!Array.isArray(result.blockedKeywords)) {
        chrome.storage.local.set({ blockedKeywords: [] });
      }
    });
  }
});