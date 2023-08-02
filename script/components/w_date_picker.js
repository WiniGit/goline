const dtpicker_calendar = `<svg xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 17 16" fill="none"><path d="M12.3876 2.99967V1.88856C12.3876 1.74122 12.3291 1.59991 12.2249 1.49573C12.1207 1.39154 11.9794 1.33301 11.832 1.33301C11.6847 1.33301 11.5434 1.39154 11.4392 1.49573C11.335 1.59991 11.2765 1.74122 11.2765 1.88856V2.99967H12.3876Z" fill="#282829" fill-opacity="0.6" style="mix-blend-mode:multiply"/><path d="M5.72092 2.99967V1.88856C5.72092 1.74122 5.66239 1.59991 5.5582 1.49573C5.45401 1.39154 5.31271 1.33301 5.16536 1.33301C5.01802 1.33301 4.87671 1.39154 4.77253 1.49573C4.66834 1.59991 4.60981 1.74122 4.60981 1.88856V2.99967H5.72092Z" fill="#282829" fill-opacity="0.6" style="mix-blend-mode:multiply"/><path d="M13.4987 14.1108H3.4987C3.05667 14.1108 2.63275 13.9352 2.32019 13.6226C2.00763 13.3101 1.83203 12.8861 1.83203 12.4441V5.2219C1.83203 4.77987 2.00763 4.35595 2.32019 4.04339C2.63275 3.73082 3.05667 3.55523 3.4987 3.55523H13.4987C13.9407 3.55523 14.3646 3.73082 14.6772 4.04339C14.9898 4.35595 15.1654 4.77987 15.1654 5.2219V12.4441C15.1654 12.8861 14.9898 13.3101 14.6772 13.6226C14.3646 13.9352 13.9407 14.1108 13.4987 14.1108ZM14.0543 6.33301H2.94314V12.4441C2.94314 12.5915 3.00167 12.7328 3.10586 12.837C3.21005 12.9411 3.35136 12.9997 3.4987 12.9997H13.4987C13.646 12.9997 13.7873 12.9411 13.8915 12.837C13.9957 12.7328 14.0543 12.5915 14.0543 12.4441V6.33301Z" fill="#282829" fill-opacity="0.6" style="mix-blend-mode:multiply"/><path d="M6.27648 7.44412H4.05425V9.11079H6.27648V7.44412Z" fill="#282829" fill-opacity="0.6" style="mix-blend-mode:multiply"/><path d="M9.60981 7.44412H7.38759V9.11079H9.60981V7.44412Z" fill="#282829" fill-opacity="0.6" style="mix-blend-mode:multiply"/><path d="M6.27648 10.2219H4.05425V11.8886H6.27648V10.2219Z" fill="#282829" fill-opacity="0.6" style="mix-blend-mode:multiply"/><path d="M9.60981 10.2219H7.38759V11.8886H9.60981V10.2219Z" fill="#282829" fill-opacity="0.6" style="mix-blend-mode:multiply"/><path d="M12.9431 7.44412H10.7209V9.11079H12.9431V7.44412Z" fill="#282829" fill-opacity="0.6" style="mix-blend-mode:multiply"/></svg>`;

function differentInDay(date1, date2) {
	return (date1.getTime() - date2.getTime()) / (1000 * 3600 * 24);
}
function inRangeTime(date, startDate, endDate) {
	return (
		differentInDay(date, startDate) > -1 &&
		differentInDay(endDate, date) > -1
	);
}

let selectDate = today;
let selectMonth = _time.getMonth();
let selectYear = _time.getFullYear();
let inputPicker = document.createElement("label");
inputPicker.className = "w-input-date-picker";
let input = document.createElement("input");
input.value = selectDate.toString();
let textValue = document.createElement("p");
textValue.innerHTML = "From date";
let btnCalendar = document.createElement("i");
btnCalendar.className = "fa-regular fa-calendar-days fa-sm";
inputPicker.replaceChildren(input, textValue, btnCalendar);
input.addEventListener("focus", function (ev) {
	if (this.getAttribute("onshowpicker") === "true") {
		this.removeAttribute("onshowpicker");
	} else {
		let pickerContainer = document.createElement("div");
		pickerContainer.className = "w-date-picker-table";
		let header = document.createElement("div");
		header.className = "header";
		let iconDoubleLeft = document.createElement("i");
		iconDoubleLeft.className = "fa-solid fa-angles-left";
		let iconLeft = document.createElement("i");
		iconLeft.className = "fa-solid fa-angle-left";
		iconLeft.style.marginLeft = "12px";
		let iconRight = document.createElement("i");
		iconRight.className = "fa-solid fa-angle-right";
		iconRight.style.marginRight = "12px";
		let iconDoubleRight = document.createElement("i");
		iconDoubleRight.className = "fa-solid fa-angles-right";
		iconDoubleLeft.onclick = function () { };
		let title = document.createElement("span");
		header.replaceChildren(
			iconDoubleLeft,
			iconLeft,
			title,
			iconRight,
			iconDoubleRight
		);
		let dateTable = document.createElement("div");
		dateTable.className = "body";
		let lineWeekDay = document.createElement("div");
		for (let i = 0; i < 7; i++) {
			let weekday = document.createElement("div");
			weekday.className = "date-picker-circle";
			let weekdayTitle = "";
			switch (i) {
				case 0:
					weekdayTitle = "Su";
					break;
				case 1:
					weekdayTitle = "Mo";
					break;
				case 2:
					weekdayTitle = "Tu";
					break;
				case 3:
					weekdayTitle = "We";
					break;
				case 4:
					weekdayTitle = "Th";
					break;
				case 5:
					weekdayTitle = "Fr";
					break;
				case 6:
					weekdayTitle = "Sa";
					break;
				default:
					break;
			}
			weekday.innerHTML = weekdayTitle;
			lineWeekDay.appendChild(weekday);
		}
		//
		let firstDayOfMonth = new Date(selectYear, selectMonth, 1);
		function showDateInMonth() {
			let monthName = "";
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
			let dateWeekLines = [];
			for (let j = 0; j < 6; j++) {
				let lineDate = document.createElement("div");
				for (let i = 0; i < 7; i++) {
					let dateHTML = document.createElement("div");
					dateHTML.className = "date-picker-circle";
					let dateNumber = i + j + j * 6 - firstDayOfMonth.getDay();
					const timeValue = new Date(
						selectYear,
						selectMonth,
						dateNumber + 1
					);
					dateHTML.id = timeValue.valueOf();
					if (timeValue.valueOf() == today.valueOf()) {
						dateHTML.style.border = "1px solid #366AE2";
					}
					if (!inRangeTime(timeValue, startDate, endDate)) {
						dateHTML.setAttribute("in-range", "false");
					} else if (selectDate.valueOf() == timeValue.valueOf()) {
						dateHTML.setAttribute("selected", "true");
					} else if (timeValue.getMonth() != selectMonth) {
						dateHTML.style.color = "#9FB0C7";
					}
					dateHTML.innerHTML = timeValue.getDate();
					dateHTML.onclick = function () {
						selectDate = timeValue;
						textValue.innerHTML = Ultis.datetoString(
							selectDate,
							"dd/MM/yyyy"
						);
						pickerContainer.remove();
					};
					lineDate.appendChild(dateHTML);
				}
				dateWeekLines.push(lineDate);
			}
			dateTable.replaceChildren(lineWeekDay, ...dateWeekLines);
			//
			iconDoubleLeft.onclick = function () {
				selectYear--;
				firstDayOfMonth = new Date(selectYear, selectMonth, 1);
				showDateInMonth();
			};
			iconLeft.onclick = function () {
				firstDayOfMonth = new Date(selectYear, selectMonth - 1, 1);
				selectMonth = firstDayOfMonth.getMonth();
				selectYear = firstDayOfMonth.getFullYear();
				showDateInMonth();
			};
			title.onclick = showMonthInYear;
			iconDoubleRight.onclick = function () {
				selectYear++;
				firstDayOfMonth = new Date(selectYear, selectMonth, 1);
				showDateInMonth();
			};
			iconRight.onclick = function () {
				firstDayOfMonth = new Date(selectYear, selectMonth + 1, 1);
				selectMonth = firstDayOfMonth.getMonth();
				selectYear = firstDayOfMonth.getFullYear();
				showDateInMonth();
			};
			//
		}
		function showMonthInYear() {
			title.innerHTML = selectYear;
			let monthLines = [];
			for (let i = 0; i < 4; i++) {
				let monthLine = document.createElement("div");
				for (let j = 0; j < 3; j++) {
					let monthHTML = document.createElement("div");
					monthHTML.className = "month-picker-circle";
					let monthNumber = i * 3 + j;
					switch (monthNumber) {
						case 0:
							monthHTML.innerHTML = "Jan";
							break;
						case 1:
							monthHTML.innerHTML = "Feb";
							break;
						case 2:
							monthHTML.innerHTML = "Mar";
							break;
						case 3:
							monthHTML.innerHTML = "Apr";
							break;
						case 4:
							monthHTML.innerHTML = "May";
							break;
						case 5:
							monthHTML.innerHTML = "Jun";
							break;
						case 6:
							monthHTML.innerHTML = "Jul";
							break;
						case 7:
							monthHTML.innerHTML = "Aug";
							break;
						case 8:
							monthHTML.innerHTML = "Sep";
							break;
						case 9:
							monthHTML.innerHTML = "Oct";
							break;
						case 10:
							monthHTML.innerHTML = "Nov";
							break;
						case 11:
							monthHTML.innerHTML = "Dec";
							break;
						default:
							break;
					}
					let timeValue = new Date(selectYear, monthNumber, 1);
					if (
						selectYear === today.getFullYear() &&
						today.getMonth() === monthNumber
					) {
						monthHTML.style.border = "1px solid #366AE2";
					}
					if (
						selectYear === selectDate.getFullYear() &&
						selectDate.getMonth() === monthNumber
					) {
						monthHTML.setAttribute("selected", "true");
					}
					monthHTML.onclick = function () {
						firstDayOfMonth = timeValue;
						selectMonth = monthNumber;
						showDateInMonth();
					};
					monthLine.appendChild(monthHTML);
				}
				monthLines.push(monthLine);
			}
			dateTable.replaceChildren(...monthLines);
			iconDoubleLeft.onclick = function () {
				if (selectYear - 10 < startDate.getFullYear()) {
					selectYear = startDate.getFullYear();
				} else {
					selectYear -= 10;
				}
				showMonthInYear();
			};
			iconLeft.onclick = function () {
				if (selectYear - 1 >= startDate.getFullYear()) {
					selectYear--;
					showMonthInYear();
				}
			};
			title.onclick = function () {
				showYearInRange(selectYear);
			};
			iconDoubleRight.onclick = function () {
				if (selectYear + 10 < endDate.getFullYear()) {
					selectYear = endDate.getFullYear();
				} else {
					selectYear += 10;
				}
				showMonthInYear();
			};
			iconRight.onclick = function () {
				if (selectYear + 1 <= endDate.getFullYear()) {
					selectYear++;
					showMonthInYear();
				}
			};
		}
		function showYearInRange(focusYear) {
			let firstYearInTable =
				focusYear - ((focusYear - startDate.getFullYear()) % 12);
			title.innerHTML = `${firstYearInTable}-${firstYearInTable + 11}`;
			let yearLines = [];
			for (let i = 0; i < 4; i++) {
				let yearLine = document.createElement("div");
				for (let j = 0; j < 3; j++) {
					let yearHTML = document.createElement("div");
					yearHTML.className = "year-picker-circle";
					let yearNumber = i * 3 + j + firstYearInTable;
					yearHTML.innerHTML = yearNumber;
					if (yearNumber === today.getFullYear()) {
						yearHTML.style.border = "1px solid #366AE2";
					}
					if (selectYear === yearNumber) {
						yearHTML.setAttribute("selected", "true");
					}
					yearHTML.onclick = function () {
						selectYear = yearNumber;
						showMonthInYear();
					};
					yearLine.appendChild(yearHTML);
				}
				yearLines.push(yearLine);
			}
			dateTable.replaceChildren(...yearLines);
			iconDoubleLeft.onclick = function () {
				let preRange = selectYear;
				if (preRange - 20 < startDate.getFullYear()) {
					preRange = startDate.getFullYear();
				} else {
					preRange -= 20;
				}
				showYearInRange(preRange);
			};
			iconLeft.onclick = function () {
				let preRange = selectYear;
				if (preRange - 10 < startDate.getFullYear()) {
					preRange = startDate.getFullYear();
				} else {
					preRange -= 10;
				}
				showYearInRange(preRange);
			};
			iconDoubleRight.onclick = function () {
				let nextRange = selectYear;
				if (nextRange + 20 > endDate.getFullYear()) {
					nextRange = endDate.getFullYear();
				} else {
					nextRange += 20;
				}
				showYearInRange(nextRange);
			};
			iconRight.onclick = function () {
				let nextRange = selectYear;
				if (nextRange + 10 > endDate.getFullYear()) {
					nextRange = endDate.getFullYear();
				} else {
					nextRange += 10;
				}
				showYearInRange(nextRange);
			};
		}
		showDateInMonth();
		let buttonToday = document.createElement("div");
		buttonToday.className = "footer";
		buttonToday.innerHTML = "Today";
		buttonToday.addEventListener("click", function () {
			selectDate = today;
			textValue.innerHTML = Ultis.datetoString(selectDate, "dd/MM/yyyy");
			pickerContainer.remove();
		});
		pickerContainer.replaceChildren(header, dateTable, buttonToday);
		document.body.appendChild(pickerContainer);
		let offset = this.parentElement.getBoundingClientRect();
		if (
			offset.bottom + pickerContainer.offsetHeight + 16 >
			document.body.offsetHeight &&
			offset.y - pickerContainer.offsetHeight - 16 > 0
		) {
			pickerContainer.style.left = offset.x + "px";
			pickerContainer.style.top = `${offset.y - 2}px`;
		} else {
			pickerContainer.style.left = offset.x + "px";
			pickerContainer.style.top = `${offset.bottom + 2}px`;
		}
		pickerContainer.addEventListener("click", function () {
			input.setAttribute("onshowpicker", "true");
		});
		input.onblur = function () {
			setTimeout(function () {
				if (input.getAttribute("onshowpicker") === "true") {
					input.focus();
				} else if (document.body.contains(pickerContainer)) {
					pickerContainer.remove();
				}
			}, 150);
		};
	}
});

function createDatePickerHTML(item) {
	const today = new Date();
	const startDate = new Date(
		today.getFullYear() - 100,
		today.getMonth(),
		today.getDate()
	);
	const endDate = new Date(
		today.getFullYear() + 100,
		today.getMonth(),
		today.getDate()
	);
	item.value = document.createElement("label");
	$(item.value).addClass("w-input-date-picker");
	let input = document.createElement("input");
	input.value = selectDate.toString();
	let btnCalendar = document.createElement("div");
	btnCalendar.className = "icon";
	btnCalendar.innerHTML = txtfd_eye_on.replace('fill="#282829"', `fill="#${item.StyleItem.TextStyleItem.ColorValue.substring(2)}"`);
	item.value.replaceChildren(input, btnCalendar);
}