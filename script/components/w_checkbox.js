function createCheckBoxHTML(item) {
  item.value = createCheckbox(item.AttributesItem.Content === "true", item);
}

function drawCheckMark(checkboxHTML) {
  let checkboxSize = checkboxHTML.offsetWidth > 0 ? checkboxHTML.offsetWidth : parseFloat(checkboxHTML.style.width.replace("px", ""));
  if (!isNaN(checkboxSize)) {
    let svgTag = checkboxHTML.querySelector("svg");
    svgTag.setAttribute("width", checkboxSize);
    svgTag.setAttribute("height", checkboxSize);
    let path = `<path d="M${(checkboxSize * 0.28).toFixed(1)} ${(checkboxSize * 0.48).toFixed(1)} L${(checkboxSize * 0.45).toFixed(1)} ${(checkboxSize * 0.65).toFixed(1)} L${(checkboxSize * 0.75).toFixed(1)} ${(checkboxSize * 0.3).toFixed(1)}" fill="none" stroke-linecap="round" stroke="#${svgTag.getAttribute("checkcolor").substring(2)}${svgTag.getAttribute("checkcolor").substring(0, 2)}"/>`
    svgTag.innerHTML = path;
  }
}

function createCheckbox(initValue = false, wbaseItem) {
  let toggle = document.createElement(!wbaseItem || wbaseItem.build ? "label" : "div");
  $(toggle).addClass("w-check-box");
  toggle.setAttribute("value", initValue);
  let input = document.createElement("input");
  input.type = "checkbox";
  input.defaultChecked = initValue;
  let checkmark = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  toggle.replaceChildren(input, checkmark);
  if (wbaseItem) {
    if (wbaseItem.AttributesItem.NameField !== "")
      input.name = wbaseItem.AttributesItem.NameField;
    checkmark.setAttribute("checkcolor", wbaseItem.JsonItem.CheckColor);
    toggle.style.setProperty("--unchecked-bg", `#${wbaseItem.JsonItem.InactiveColor.substring(2) + wbaseItem.JsonItem.InactiveColor.substring(2, 0)}`);
  } else {
    checkmark.setAttribute("checkcolor", "ffffffff");
  }
  drawCheckMark(toggle);
  input.onchange = function (e) {
    e.stopImmediatePropagation();
    e.stopPropagation();
    if (wbaseItem) {
      wbaseItem.AttributesItem.Content = `${this.checked}`;
      toggle.style.setProperty("--unchecked-bg", `#${wbaseItem.JsonItem.InactiveColor.substring(2) + wbaseItem.JsonItem.InactiveColor.substring(2, 0)}`);
    }
    drawCheckMark(toggle);
  }
  return toggle;
}