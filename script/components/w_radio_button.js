function createRadioHTML(item) {
  item.value = createRadioButton(item);
}

function createRadioButton(wbaseItem) {
  let toggle = wbaseItem.value ?? document.createElement(!wbaseItem || wbaseItem.build ? "label" : "div");
  $(toggle).addClass("w-radio-btn");
  let input = document.createElement("input");
  input.type = "radio";
  if (wbaseItem.AttributesItem.NameField !== "") input.name = wbaseItem.AttributesItem.NameField;
  input.defaultChecked = wbaseItem.JsonItem.Checked ?? false;
  input.value = wbaseItem.AttributesItem.Content;
  let checkmark = document.createElement("span");
  checkmark.className = "checkmark";
  toggle.style.setProperty("--checked-border", `#${wbaseItem.StyleItem.DecorationItem.ColorValue}`);
  toggle.style.setProperty("--unchecked-border", `#${wbaseItem.StyleItem.DecorationItem.BorderItem?.ColorValue}`);
  toggle.replaceChildren(input, checkmark);
  input.onchange = function (e) {
    e.stopImmediatePropagation();
    e.stopPropagation();
    wbaseItem.JsonItem.Checked = this.checked;
    toggle.style.setProperty("--checked-border", `#${wbaseItem.StyleItem.DecorationItem.ColorValue}`);
    toggle.style.setProperty("--unchecked-border", `#${wbaseItem.StyleItem.DecorationItem.BorderItem?.ColorValue}`);
    if (this.checked) {
      if (this.name && this.name !== "") {
        let formParent = document.querySelector(`form:has(.w-radio-btn[id="${wbaseItem.GID}"])`);
        if (formParent) {
          [...formParent.querySelectorAll(`input[name="${this.name}"]`)]
            .filter((radio) => radio.type === "radio" && radio.parentElement.id !== wbaseItem.GID)
            .forEach((radio) => {
              $(radio).trigger("change");
            });
        } else {
          [...document.getElementsByName(this.name)]
            .filter((radio) => radio.type === "radio" && radio.parentElement.id !== wbaseItem.GID)
            .forEach((radio) => {
              $(radio).trigger("change");
            });
        }
      }
    }
  };
  return toggle;
}
