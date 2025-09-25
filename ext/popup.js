function main(){
	const startButton = document.getElementById("startBtn");
	startButton.addEventListener("click", () => {eventClick()});
}

function eventClick(){
    console.log('click...');
}

main()

