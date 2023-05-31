function createProgressBarHTML(item) {
	item.value = document.createElement("div");
	// item.value.style.width = "100%";
	item.value.style.backgroundColor = "grey";
	var _progressBar = document.createElement("div");
	_progressBar.style.width = "50%";
	_progressBar.style.height = "100px";
	_progressBar.style.backgroundColor = "green";
	item.value.appendChild(_progressBar);
}
