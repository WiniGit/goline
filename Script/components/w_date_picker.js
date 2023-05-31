const _time = new Date();
var selectDate = new Date(
	_time.getFullYear(),
	_time.getMonth(),
	_time.getDate()
);
var selectMonth = _time.getMonth();
var selectYear = _time.getFullYear();
function createDatePickerHTML(item) {
	item.value = document.createElement("div");
	item.value.style.position = "relative";
	var input = document.createElement("input");
	input.type = "button";
	input.value = selectDate.toString();
	input.style.position = "absolute";
	input.style.width = "0";
	input.style.height = "0";
	input.style.top = "0";
	input.style.left = "0";
	input.style.opacity = "0";
	item.value.appendChild(input);
	var header = document.createElement("div");
	header.style.display = "flex";
	header.style.padding = "0 24px";
	header.style.height = "40px";
	header.style.alignItems = "center";
	var iconDoubleLeft = document.createElement("i");
	iconDoubleLeft.className = "fa-solid fa-angles-left";
	iconDoubleLeft.style.fontSize = "20px";
	iconDoubleLeft.style.color = "#4B6281";
	var iconLeft = document.createElement("i");
	iconLeft.className = "fa-solid fa-angle-left";
	iconLeft.style.fontSize = "20px";
	iconLeft.style.color = "#4B6281";
	iconLeft.style.marginLeft = "12px";
	var iconRight = document.createElement("i");
	iconRight.className = "fa-solid fa-angle-right";
	iconRight.style.fontSize = "20px";
	iconRight.style.color = "#4B6281";
	iconRight.style.marginRight = "12px";
	var iconDoubleRight = document.createElement("i");
	iconDoubleRight.className = "fa-solid fa-angles-right";
	iconDoubleRight.style.fontSize = "20px";
	iconDoubleRight.style.color = "#4B6281";
	var title = document.createElement("span");
	title.style.width = "100%";
	title.style.flex = 1;
	title.style.textAlign = "center";
	title.style.fontSize = "16px";
	title.style.lineHeight = "24px";
	title.style.fontWeight = "bold";
	header.appendChild(iconDoubleLeft);
	header.appendChild(iconLeft);
	header.appendChild(title);
	header.appendChild(iconRight);
	header.appendChild(iconDoubleRight);
	var dateTable = document.createElement("div");
	var lineWeekDay = document.createElement("div");
	lineWeekDay.style.display = "flex";
	lineWeekDay.style.justifyContent = "space-between";
	for (var i = 0; i < 7; i++) {
		var weekday = document.createElement("div");
		weekday.style.width = "32px";
		weekday.style.height = "32px";
		weekday.style.display = "flex";
		weekday.style.alignItems = "center";
		weekday.style.justifyContent = "center";
		var weekdayTitle = "";
		switch (i) {
			case 0:
				weekdayTitle = "Sun";
				break;
			case 1:
				weekdayTitle = "Mon";
				break;
			case 2:
				weekdayTitle = "Tue";
				break;
			case 3:
				weekdayTitle = "Wed";
				break;
			case 4:
				weekdayTitle = "Thu";
				break;
			case 5:
				weekdayTitle = "Fri";
				break;
			case 6:
				weekdayTitle = "Sat";
				break;
			default:
				break;
		}
		weekday.innerHTML = weekdayTitle;
		lineWeekDay.appendChild(weekday);
	}
	dateTable.appendChild(lineWeekDay);
	var monthName = "";
	switch (selectMonth) {
		case 0:
			monthName = "January";
			break;
		case 1:
			monthName = "February";
			break;
		case 2:
			monthName = "March";
			break;
		case 3:
			monthName = "April";
			break;
		case 4:
			monthName = "May";
			break;
		case 5:
			monthName = "June";
			break;
		case 6:
			monthName = "July";
			break;
		case 7:
			monthName = "August";
			break;
		case 8:
			monthName = "September";
			break;
		case 9:
			monthName = "October";
			break;
		case 10:
			monthName = "November";
			break;
		case 11:
			monthName = "December";
			break;
		default:
			break;
	}
	title.innerHTML = `${monthName} ${selectYear}`;
	const firstDayOfMonth = new Date(selectYear, selectMonth, 1);
	const _today = new Date(
		_time.getFullYear(),
		_time.getMonth(),
		_time.getDate()
	);
	for (var j = 0; j < 6; j++) {
		var lineDate = document.createElement("div");
		lineDate.style.display = "flex";
		lineDate.style.justifyContent = "space-between";
		for (var i = 0; i < 7; i++) {
			var dateHTML = document.createElement("div");
			// dateHTML.style.cursor = "pointer";
			dateHTML.style.width = "32px";
			dateHTML.style.height = "32px";
			dateHTML.style.display = "flex";
			dateHTML.style.alignItems = "center";
			dateHTML.style.justifyContent = "center";
			dateHTML.style.borderRadius = "50%";
			dateHTML.style.fontSize = "14px";
			dateHTML.style.color = "#394960";
			dateHTML.style.boxSizing = "border-box";
			dateHTML.style.lineHeight = "22px";
			var dateNumber = i + j + j * 6 - firstDayOfMonth.getDay();
			const timeValue = new Date(selectYear, selectMonth, dateNumber + 1);
			dateHTML.id = timeValue.valueOf();
			if (timeValue.valueOf() == _today.valueOf()) {
				dateHTML.style.border = "1px solid #366AE2";
			}
			if (timeValue.getMonth() != selectMonth) {
				dateHTML.style.color = "#9FB0C7";
			}
			if (selectDate.valueOf() == timeValue.valueOf()) {
				dateHTML.style.backgroundColor = "#366AE2";
				dateHTML.style.color = "white";
			}
			// dateHTML.addEventListener("click", function () {
			// 	var _dateHTMLSelect = document.getElementById(
			// 		selectDate.valueOf()
			// 	);
			// 	_dateHTMLSelect.style.backgroundColor = "transparent";
			// 	if (selectDate.getMonth() != selectMonth) {
			// 		_dateHTMLSelect.style.color = "#9FB0C7";
			// 	} else {
			// 		_dateHTMLSelect.style.color = "#394960";
			// 	}
			// 	this.style.backgroundColor = "#366AE2";
			// 	this.style.color = "white";
			// 	selectDate = timeValue;
			// 	input.value = selectDate.toString();
			// });
			dateHTML.innerHTML = timeValue.getDate();
			lineDate.appendChild(dateHTML);
		}
		dateTable.appendChild(lineDate);
	}
	var buttonToday = document.createElement("div");
	// buttonToday.style.cursor = "pointer";
	buttonToday.innerHTML = "Today";
	buttonToday.style.padding = "8px 0px";
	buttonToday.style.textAlign = "center";
	buttonToday.style.width = "100%";
	buttonToday.style.fontSize = "14px";
	buttonToday.style.lineHeight = "22px";
	buttonToday.style.color = "#366AE2";
	// buttonToday.addEventListener("click", function () {
	// 	var _dateHTMLSelect = document.getElementById(selectDate.valueOf());
	// 	_dateHTMLSelect.style.backgroundColor = "transparent";
	// 	if (selectDate.getMonth() != selectMonth) {
	// 		_dateHTMLSelect.style.color = "#9FB0C7";
	// 	} else {
	// 		_dateHTMLSelect.style.color = "#394960";
	// 	}
	// 	selectDate = _today;
	// 	var _todayHTML = document.getElementById(_today.valueOf());
	// 	_todayHTML.style.backgroundColor = "#366AE2";
	// 	_todayHTML.style.color = "white";
	// 	input.value = selectDate.toString();
	// });
	item.value.appendChild(header);
	item.value.appendChild(dateTable);
	item.value.appendChild(buttonToday);
}