document.addEventListener('DOMContentLoaded', () => {
  const keywordInput = document.getElementById('keyword-input');
  const addBtn = document.getElementById('add-btn');
  const keywordList = document.getElementById('keyword-list');
  const shortsToggle = document.getElementById('shorts-toggle');

  function loadConfig() {
    chrome.storage.sync.get(['blockedKeywords', 'blockShorts'], (result) => {
      const keywords = result.blockedKeywords || [];
      renderList(keywords);
      shortsToggle.checked = result.blockShorts !== false;
    });
  }

  shortsToggle.addEventListener('change', (e) => {
    chrome.storage.sync.set({ blockShorts: e.target.checked });
  });

  function renderList(keywords) {
    keywordList.innerHTML = '';
    keywords.forEach((keyword, index) => {
      const li = document.createElement('li');
      li.textContent = keyword;

      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = '×';
      deleteBtn.className = 'delete-btn';
      deleteBtn.addEventListener('click', () => {
        removeKeyword(index);
      });

      li.appendChild(deleteBtn);
      keywordList.appendChild(li);
    });
  }

  function addKeyword() {
    const newKeyword = keywordInput.value.trim();
    if (!newKeyword) return;

    chrome.storage.sync.get(['blockedKeywords'], (result) => {
      const keywords = result.blockedKeywords || [];
      if (!keywords.includes(newKeyword)) {
        keywords.push(newKeyword);
        chrome.storage.sync.set({ blockedKeywords: keywords }, () => {
          keywordInput.value = '';
          renderList(keywords);
        });
      } else {
        keywordInput.value = '';
      }
    });
  }

  function removeKeyword(index) {
    chrome.storage.sync.get(['blockedKeywords'], (result) => {
      const keywords = result.blockedKeywords || [];
      keywords.splice(index, 1);
      chrome.storage.sync.set({ blockedKeywords: keywords }, () => {
        renderList(keywords);
      });
    });
  }

  addBtn.addEventListener('click', addKeyword);

  keywordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      addKeyword();
    }
  });

  loadConfig();
});