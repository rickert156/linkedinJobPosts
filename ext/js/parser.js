// parser
const params = new URLSearchParams(window.location.search);
const tabId = parseInt(params.get('tabId'), 10);

// пример парсинга
document.getElementById('info').textContent = `Парсим вкладку #${tabId}`;


// Внедряем код в эту вкладку
document.getElementById('parseBtn').addEventListener('click', async () => {
	
	chrome.runtime.onMessage.addListener((message) => {
		if (message.type === 'add_post'){
			sendPost(message.data)
		}
	})
	
	const results = await chrome.scripting.executeScript({
		target: { tabId: tabId },
		func: parserPage
	});
});


async function parserPage() {
	let list_link = new Set();
	let list_preview_link = new Set();

	let count_job = 0;

	while (true){

		const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
		const all_blocks = document.querySelectorAll('.job-card-job-posting-card-wrapper__card-link');

		all_blocks[all_blocks.length-1].scrollIntoView({behavior: 'smooth'})
		
		if (all_blocks.length > 0){
			for (let count_block = 0; count_block < all_blocks.length; count_block+=1){
				const block = all_blocks[count_block];
			
				const title = block.querySelector('strong').innerText;

				block.click();
				await delay(2000)
			
				try{
					const job_block = document.querySelector('.jobs-semantic-search-job-details-wrapper');
				
					let job_title = null;
					let url_job_post = null
					let company_name = null;
					let about_job = null;
				
					try{
						job_title = job_block.querySelector('.t-24.t-bold.inline').innerText;
					}catch (err){
						console.log(`Error: ${err}`);
					};
					try{
						url_job_post = job_block.querySelector('.t-24.t-bold.inline').querySelector('a').href;
					}catch(err){
						console.log(`Error: ${err}`)
					}
					try{
						company_name = job_block.querySelector('.job-details-jobs-unified-top-card__company-name').innerText;
					}catch(err){
						console.log(`Error: ${err}`)
					};
					try{
						about_job = job_block.querySelector('.jobs-description__container').innerText;
					}catch(err){
						console.log(`Error: ${err}`)
					}

					if (url_job_post != null && !list_link.has(url_job_post)){
						count_job+=1
						
						list_link.add(url_job_post);

						console.log(`[ ${count_job} ] ${title}`);
						console.log(`Company Name: ${company_name}`);
						console.log(`Job Title: ${job_title}`);
						console.log(`Link job post: ${url_job_post}`);
						//console.log(`About Job: ${about_job}`);

						let job_information = {					
							title:title,
							url_job_post:url_job_post,
							company:company_name,
							about_job:about_job
						}
						console.log(job_information);
						
						chrome.runtime.sendMessage(
							{type:'add_post', data:job_information}
						);
					}

				}catch(err){
					console.log(`Ошибка при парсинге джоб поста: ${err}`);
				};
			
				await delay(1000);
			}
		} else {
			console.log(all_blocks);
		}
	}
}

async function sendPost(info){
	try{
		const response = await fetch("http://127.0.0.1:7721/api/lead", {
			method:"POST",
			headers:{"Content-Type": "application/json"},
			body: JSON.stringify(info)
		});
		const result = await response;
		console.log(`send to server: ${info.title}`)
	}catch(err){
		console.log(`Ошибка при отправке данных: ${err}`);
	}
}
