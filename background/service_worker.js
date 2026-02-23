chrome.runtime.onInstalled.addListener(({ reason }) => {
  if (reason === 'install' || reason === 'update') {
    chrome.storage.sync.get(['blockedKeywords']).then((result) => {
      if (!Array.isArray(result.blockedKeywords)) {
        chrome.storage.sync.set({ blockedKeywords: [] });
      }
    });
  }
});