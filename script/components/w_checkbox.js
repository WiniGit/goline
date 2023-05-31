function createCheckBoxHTML(item) {
  item.value = createCheckbox(item.AttributesItem.Content === "true", item);
}

function drawCheckMark(checkboxHTML) {
  let checkboxSize = checkboxHTML.offsetWidth > 0 ? checkboxHTML.offsetWidth : parseFloat(checkboxHTML.style.width.replace("px", ""));
  checkboxHTML.querySelector(".checkmark").width = checkboxSize;
  checkboxHTML.querySelector(".checkmark").height = checkboxSize;
  let checkboxCtx = checkboxHTML.querySelector(".checkmark").getContext("2d");
  checkboxCtx.clearRect(0, 0, checkboxSize, checkboxSize);
  checkboxCtx.save();
  checkboxCtx.beginPath();
  checkboxCtx.lineWidth = checkboxSize / 16;
  checkboxCtx.strokeStyle = `#${checkboxHTML.querySelector(".checkmark").getAttribute("checkcolor").substring(2)}${checkboxHTML.querySelector(".checkmark").getAttribute("checkcolor").substring(0, 2)}`;
  checkboxCtx.moveTo(checkboxSize * 0.28, checkboxSize * 0.48);
  checkboxCtx.lineTo(checkboxSize * 0.45, checkboxSize * 0.65);
  checkboxCtx.lineTo(checkboxSize * 0.75, checkboxSize * 0.3);
  checkboxCtx.lineCap = "round";
  checkboxCtx.stroke();
}

function createCheckbox(initValue = false, wbaseItem) {
  let toggle = document.createElement(!wbaseItem || wbaseItem.build ? "label" : "div");
  $(toggle).addClass("check-box");
  toggle.setAttribute("value", initValue);
  let input = document.createElement("input");
  input.type = "checkbox";
  input.defaultChecked = initValue;
  let checkmark = document.createElement("canvas");
  checkmark.className = "checkmark";
  toggle.replaceChildren(input, checkmark);
  if (wbaseItem) {
    toggle.htmlFor = `input-${wbaseItem.GID}`;
    input.id = `input-${wbaseItem.GID}`;
    if (wbaseItem.AttributesItem.NameField !== "")
      input.name = wbaseItem.AttributesItem.NameField;
    checkmark.setAttribute("checkcolor", wbaseItem.JsonItem.CheckColor);
    toggle.style.setProperty("--checked-bg", `#${wbaseItem.StyleItem.DecorationItem.ColorValue.substring(2) + wbaseItem.StyleItem.DecorationItem.ColorValue.substring(2, 0)}`);
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
      toggle.style.setProperty("--checked-bg", `#${wbaseItem.StyleItem.DecorationItem.ColorValue.substring(2) + wbaseItem.StyleItem.DecorationItem.ColorValue.substring(2, 0)}`);
      toggle.style.setProperty("--unchecked-bg", `#${wbaseItem.JsonItem.InactiveColor.substring(2) + wbaseItem.JsonItem.InactiveColor.substring(2, 0)}`);
    }
    drawCheckMark(toggle);
  }
  return toggle;
}