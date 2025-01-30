const blockedKeywords = new Set();
let observer;

function checkAndHidePost(postElement) {
	const contentElement = postElement.querySelector('.update-components-text .break-words');
	if (!contentElement) return;

	const textContent = contentElement.textContent.toLowerCase();
	Array.from(blockedKeywords).forEach(keyword => {
		if (textContent.includes(keyword)) {
			postElement.style.display = 'none';
			console.log('Blocked post containing:', keyword);
		}
	});
}

function initObserver() {
	observer = new MutationObserver(mutations => {
		mutations.forEach(({ addedNodes }) => {
			addedNodes.forEach(node => {
				if (node.nodeType === Node.ELEMENT_NODE) {
					// Check both main posts and suggested posts
					const posts = node.querySelectorAll ?
						node.querySelectorAll('.feed-shared-update-v2, .update-components-actor--suggested') : [];
					posts.forEach(checkAndHidePost);
				}
			});
		});
	});

	const feedContainer = document.querySelector('.scaffold-finite-scroll__content') ||
		document.querySelector('.main-feed-components');

	if (feedContainer) {
		observer.observe(feedContainer, {
			childList: true,
			subtree: true
		});
		feedContainer.querySelectorAll('.feed-shared-update-v2').forEach(checkAndHidePost);
	}
}

document.addEventListener('scroll', initObserver, { once: true, passive: true });
document.addEventListener('DOMContentLoaded', initObserver);

chrome.storage.onChanged.addListener((changes) => {
	if (changes.keywords) {
		blockedKeywords.clear();
		changes.keywords.newValue.forEach(kw => blockedKeywords.add(kw.toLowerCase()));
		document.querySelectorAll('.feed-shared-update-v2').forEach(checkAndHidePost);
	}
});

chrome.storage.local.get('keywords', ({ keywords = [] }) => {
	keywords.forEach(kw => blockedKeywords.add(kw.toLowerCase()));
	initObserver();
});
