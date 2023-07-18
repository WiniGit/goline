function createFrameHTML(item, data) {
  item.value = document.createElement(item.CateID === EnumCate.form ? "form" : "div");
  $(item.value).addClass("w-frame");
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
      initPositionStyle(child);
      return child.value;
    }));
    item.value.replaceChildren(fragment);
  }
}