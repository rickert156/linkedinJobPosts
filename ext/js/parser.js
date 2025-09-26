// parser.js
const params = new URLSearchParams(window.location.search);
const tabId = parseInt(params.get('tabId'), 10);

// пример парсинга
document.getElementById('info').textContent = `Парсим вкладку #${tabId}`;

// Внедряем код в эту вкладку
document.getElementById('parseBtn').addEventListener('click', async () => {
	const results = await chrome.scripting.executeScript({
		target: { tabId: tabId },
		func: parserPage
	});
});


async function parserPage() {
	const all_blocks = document.querySelectorAll('.job-card-job-posting-card-wrapper__entity-lockup');
	if (all_blocks.length > 0){
		for (let count_block = 0; count_block < all_blocks.length; count_block+=1){
			const block = all_blocks[count_block];
			const title = block.querySelector('strong').innerText;
			console.log(`[ ${count_block+1} ] ${title}`);
		}
	} else {
		console.log(all_blocks);
	}
}

