chrome.runtime.onInstalled.addListener(({ reason }) => {
  if (reason === 'install' || reason === 'update') {
    chrome.storage.sync.get(['blockedKeywords', 'blockShorts']).then((result) => {
      const updates = {};
      if (!Array.isArray(result.blockedKeywords)) {
        updates.blockedKeywords = [];
      }
      if (result.blockShorts === undefined) {
        updates.blockShorts = true;
      }
      if (Object.keys(updates).length > 0) {
        chrome.storage.sync.set(updates);
      }
    });
  }
});