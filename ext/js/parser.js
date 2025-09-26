// parser.js
const params = new URLSearchParams(window.location.search);
const tabId = parseInt(params.get('tabId'), 10);

// пример парсинга
document.getElementById('info').textContent = `Парсим вкладку #${tabId}`;

// Внедряем код в эту вкладку
document.getElementById('parseBtn').addEventListener('click', async () => {
	const results = await chrome.scripting.executeScript({
		target: { tabId: tabId },
		func: () => {
			return {
				title: document.title,
				h1: document.querySelector('h1')?.innerText || ''
			};
		}
	});
	console.log(results[0].result);
});

