function createVariantHTML(item, data) {
    item.value = document.createElement("div");
    $(item.value).addClass("w-variant");
    $(item.value).addClass("w-stack");
    var listChild = data;
    listChild.forEach((child) => {
      initPositionStyle(child)
      item.value.appendChild(child.value);
    });
}