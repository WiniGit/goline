function createRadioHTML(item) {
	item.value = createRadioButton(item);
}

function createRadioButton(wbaseItem) {
	let toggle = wbaseItem.value ?? document.createElement(!wbaseItem || wbaseItem.build ? "label" : "div");
	$(toggle).addClass("radio-btn");
	toggle.htmlFor = `input-${wbaseItem.GID}`;
	let input = document.createElement("input");
	input.type = "radio";
	if (wbaseItem.AttributesItem.NameField !== "")
		input.name = wbaseItem.AttributesItem.NameField;
	input.id = `input-${wbaseItem.GID}`;
	input.defaultChecked = wbaseItem.JsonItem.Checked ?? false;
	input.value = wbaseItem.AttributesItem.Content;
	let checkmark = document.createElement("span");
	checkmark.className = "checkmark";
	checkmark.style.backgroundColor = `#${wbaseItem.StyleItem.DecorationItem.ColorValue?.substring(2) + wbaseItem.StyleItem.DecorationItem.ColorValue?.substring(2, 0)}`;
	toggle.style.setProperty("--checked-border", `#${wbaseItem.StyleItem.DecorationItem.ColorValue.substring(2) + wbaseItem.StyleItem.DecorationItem.ColorValue.substring(2, 0)}`);
	toggle.style.setProperty("--unchecked-border", `#${wbaseItem.StyleItem.DecorationItem.BorderItem?.ColorValue?.substring(2) + wbaseItem.StyleItem.DecorationItem.BorderItem?.ColorValue?.substring(2, 0)}`);
	toggle.replaceChildren(input, checkmark);
	input.onchange = function (e) {
		e.stopImmediatePropagation();
		e.stopPropagation();
		wbaseItem.JsonItem.Checked = this.checked;
		toggle.style.setProperty("--checked-border", `#${wbaseItem.StyleItem.DecorationItem.ColorValue.substring(2) + wbaseItem.StyleItem.DecorationItem.ColorValue.substring(2, 0)}`);
		toggle.style.setProperty("--unchecked-border", `#${wbaseItem.StyleItem.DecorationItem.BorderItem?.ColorValue?.substring(2) + wbaseItem.StyleItem.DecorationItem.BorderItem?.ColorValue?.substring(2, 0)}`);
		if (this.checked) {
			if (this.name && this.name !== "") {
				let formParent = document.querySelector(`form:has(#${this.id})`);
				if (formParent) {
					[...formParent.querySelectorAll(`input[name="${this.name}"]`)].
						filter(radio => radio.type === "radio" && radio.id !== this.id).
						forEach(radio => {
							$(radio).trigger("change");
						});
				} else {
					[...document.getElementsByName(this.name)].
						filter(radio => radio.type === "radio" && radio.id !== this.id).
						forEach(radio => {
							$(radio).trigger("change");
						});
				}
			}
		} 
	}
	return toggle;
}