function main(){
	const startParser = document.getElementById("startBtn");
	startParser.addEventListener("click", async() => {
		
		const tab = await getCurrentTab();

		chrome.tabs.create({
			url: chrome.runtime.getURL(`html/parser.html?tabId=${tab.id}`)
		});
	})
}

async function getCurrentTab() {
	let queryOptions = { active: true, lastFocusedWindow: true };
	// `tab` will either be a `tabs.Tab` instance or `undefined`.
	let [tab] = await chrome.tabs.query(queryOptions);

	return tab;
}

main()
