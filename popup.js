let keywords = new Set();

const style = document.createElement('style');
style.textContent = `
  .keyword-item {
    background: white;
    padding: 0.6rem 1rem;
    border-radius: 6px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    animation: slideIn 0.3s ease;
    color: #2d3436;
  }
  
  .remove-btn {
    background: none;
    border: none;
    color: #e74c3c;
    cursor: pointer;
    padding: 0.3rem;
    margin-left: 0.5rem;
    transition: opacity 0.2s ease;
  }
  
  .remove-btn:hover {
    opacity: 0.8;
  }
  
  @keyframes slideIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;
document.head.appendChild(style);

chrome.storage.local.get('keywords', (data) => {
	keywords = new Set(data.keywords || []);
	updateUI();
});

document.getElementById('addBtn').addEventListener('click', () => {
	const input = document.getElementById('keywordInput');
	const keyword = input.value.trim().toLowerCase();

	if (keyword) {
		keywords.add(keyword);
		chrome.storage.local.set({ keywords: Array.from(keywords) });
		input.value = '';
		updateUI();
	}
});

function updateUI() {
	const list = document.getElementById('keywordList');
	list.innerHTML = Array.from(keywords)
		.map(kw => `
      <div class="keyword-item">
        <span>${kw}</span>
        <button class="remove-btn" data-kw="${kw}">×</button>
      </div>
    `).join('');

	document.querySelectorAll('.remove-btn').forEach(btn => {
		btn.addEventListener('click', (e) => {
			keywords.delete(e.target.dataset.kw);
			chrome.storage.local.set({ keywords: Array.from(keywords) });
			updateUI();
		});
	});
}
