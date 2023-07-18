function wbutton(item, data) {
  item.value = document.createElement("button");
  item.value.type = "button";
  $(item.value).addClass("w-button");
  if (item.WAutolayoutItem) {
    let fragment = document.createDocumentFragment();
    fragment.replaceChildren(...data.map((child) => {
      if (child.StyleItem.PositionItem.FixPosition) {
        initPositionStyle(child);
      } else if (item.WAutolayoutItem.Direction === "Vertical" && child.value.style.height == "100%")
        child.value.style.flex = 1;
      else if (item.WAutolayoutItem.Direction === "Horizontal" && child.value.style.width == "100%")
        child.value.style.flex = 1;
      return child.value;
    }));
    item.value.replaceChildren(fragment);
  } else {
    $(item.value).addClass("w-stack");
    let fragment = document.createDocumentFragment();
    fragment.replaceChildren(...data.map((child) => {
      initPositionStyle(child)
      return child.value;
    }));
    item.value.replaceChildren(fragment);
  }
}
  //TODO: add event state
  // let hoverItem = JSON.parse(item.AttributesItem.JsonEvent).ListState.find(e => e.Type == ComponentState.focus);
  // item.value.onmouseover = function (ev) {
  //   ev.stopPropagation();
  //   item.value.style.backgroundColor = "red";
  // }
  // item.value.onmouseout = function (ev) {
  //   ev.stopPropagation();
  //   item.value.style.backgroundColor = `#${item.StyleItem.DecorationItem.ColorValue.substring(2)}${item.StyleItem.DecorationItem.ColorValue.substring(2, 0)}`;
  // }