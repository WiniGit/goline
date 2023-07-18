function createVariantHTML(item, data) {
  item.value = document.createElement("div");
  $(item.value).addClass("w-variant");
  $(item.value).addClass("w-stack");
  let fragment = document.createDocumentFragment();
  fragment.replaceChildren(...data.map((child) => {
    initPositionStyle(child);
    return child.value;
  }));
  item.value.replaceChildren(fragment);
}