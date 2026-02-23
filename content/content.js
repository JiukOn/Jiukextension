let blockedKeywords = [];

function updateKeywords() {
  chrome.storage.sync.get(['blockedKeywords']).then((result) => {
    blockedKeywords = (result.blockedKeywords || []).map(k => k.trim());
    processDOM();
  });
}

function shouldBlock(text) {
  if (!text) return false;
  const lowerText = text.toLowerCase();

  return blockedKeywords.some(keyword => {
    if (keyword === "") return false;

    const regexMatch = keyword.match(/^\/(.+)\/([a-z]*)$/);
    if (regexMatch) {
      try {
        const regex = new RegExp(regexMatch[1], regexMatch[2]);
        return regex.test(text);
      } catch (e) {
        return false;
      }
    }

    return lowerText.includes(keyword.toLowerCase());
  });
}

function processElement(el) {
  if (el.dataset.jiukFiltered === "true") return;
  el.dataset.jiukFiltered = "true";

  const titleElement = el.querySelector('#video-title, #video-title-link, span.yt-core-attributed-string[role="text"]');
  const channelElement = el.querySelector('#text.ytd-channel-name, .ytd-channel-name a');

  let textToInspect = "";
  if (titleElement) textToInspect += titleElement.textContent + " ";
  if (channelElement) textToInspect += channelElement.textContent;

  if (shouldBlock(textToInspect)) {
    el.style.display = 'none';
  }
}

function processDOM() {
  const videoSelectors = [
    'ytd-rich-item-renderer',
    'ytd-video-renderer',
    'ytd-compact-video-renderer',
    'ytd-grid-video-renderer'
  ];

  const elements = document.querySelectorAll(videoSelectors.join(', '));
  elements.forEach(processElement);
}

const observer = new MutationObserver((mutations) => {
  let shouldProcess = false;
  for (const mutation of mutations) {
    if (mutation.addedNodes.length > 0) {
      shouldProcess = true;
      break;
    }
  }
  if (shouldProcess) {
    processDOM();
  }
});

function init() {
  updateKeywords();
  observer.observe(document.body, { childList: true, subtree: true });
}

chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync' && changes.blockedKeywords) {
    updateKeywords();
  }
});

window.addEventListener('yt-navigate-finish', processDOM);
window.addEventListener('spfdone', processDOM);

if (document.body) {
  init();
} else {
  document.addEventListener('DOMContentLoaded', init);
}