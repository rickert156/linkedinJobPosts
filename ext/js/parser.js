// parser
const params = new URLSearchParams(window.location.search);
const tabId = parseInt(params.get('tabId'), 10);

// пример парсинга
document.getElementById('info').textContent = `Парсим вкладку #${tabId}`;


// Внедряем код в эту вкладку
document.getElementById('parseBtn').addEventListener('click', async () => {
	document.getElementById('parseBtn').innerText = 'Парсим посты'

	const result_block = document.getElementById('result');
	chrome.runtime.onMessage.addListener(async (message) => {
		if (message.type === 'add_post'){
			let report_send = '<p style="color:#8B0000">Ошибка при отправке на сервер</p>'
			const result_send = await sendPost(message.data);
			console.log(result_send)
			if (result_send){
				report_send = '<p style="color:#191970">Успешно отправлено на сервер</p>';
			}
			result_block.innerHTML += `
				<div class="job_post">
				    <img width="32" src="${message.data.logo_url}">
				    <p style="color:#00008B"><a href="${message.data.company_url}">${message.data.company}</a></p>
				    <p>${message.data.title}</p>
				    <p><a href="${message.data.url_job_post}" target="_blank" rel="noopener">Link post</a></p>
				    ${report_send}
				</div>
				`;
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
					let company_url = null;
					let about_job = null;
					let logo_url = null
					
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
						company_url = job_block.querySelector('.job-details-jobs-unified-top-card__company-name').querySelector('a').href;
					}catch(err){
						console.log(`Error: ${err}`)
					}
					try{
						about_job = job_block.querySelector('.jobs-description__container').innerText;
					}catch(err){
						console.log(`Error: ${err}`)
					}
					try{
						logo_url = job_block.querySelector('.ivm-view-attr__img-wrapper').querySelector('img').src;
					}catch(err){
						console.log(`Error: ${err}`)
					}

					if (url_job_post != null && !list_link.has(url_job_post)){
						count_job+=1
						
						list_link.add(url_job_post);

						console.log(`[ ${count_job} ] ${title}`);
						console.log(`Company URL: ${company_url}`);
						console.log(`Company Name: ${company_name}`);
						console.log(`Job Title: ${job_title}`);
						console.log(`Link job post: ${url_job_post}`);
						//console.log(`About Job: ${about_job}`);

						let job_information = {					
							title:title,
							url_job_post:url_job_post,
							company:company_name,
							about_job:about_job,
							company_url:company_url,
							logo_url:logo_url
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
		return result;
	}catch(err){
		console.log(`Ошибка при отправке данных: ${err}`);
		return null;
	}
}
