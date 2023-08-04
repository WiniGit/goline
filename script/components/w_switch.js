function createSwitchHTML(item) {
  item.value = createSwitch(item.AttributesItem.Content === "true", item);
}

function createSwitch(initValue = false, wbaseItem) {
	let toggle = document.createElement(!wbaseItem || wbaseItem.build ? "label" : "div");
	$(toggle).addClass("w-switch");
	toggle.setAttribute("value", initValue);
	let input = document.createElement("input");
	input.type = "checkbox";
	input.defaultChecked = initValue;
	let slider = document.createElement("span");
	slider.className = "slider";
	toggle.replaceChildren(input, slider);
	if (wbaseItem) {
		if (wbaseItem.AttributesItem.NameField !== "")
			input.name = wbaseItem.AttributesItem.NameField;
		toggle.style.setProperty("--dot-color", `#${wbaseItem.JsonItem.DotColor.substring(2) + wbaseItem.JsonItem.DotColor.substring(2, 0)}`);
		toggle.style.setProperty("--unchecked-bg", `#${wbaseItem.JsonItem.InactiveColor.substring(2) + wbaseItem.JsonItem.InactiveColor.substring(2, 0)}`);
	}
	input.onchange = function (e) {
		e.stopImmediatePropagation();
		e.stopPropagation();
		if (wbaseItem) {
			wbaseItem.AttributesItem.Content = `${this.checked}`;
			toggle.style.setProperty("--unchecked-bg", `#${wbaseItem.JsonItem.InactiveColor.substring(2) + wbaseItem.JsonItem.InactiveColor.substring(2, 0)}`);
		}
	}
	return toggle;
}
