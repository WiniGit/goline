function createVariantHTML(item, data) {
    item.value = document.createElement("div");
    $(item.value).addClass("variant");
    var listChild = data;
    listChild.forEach((child) => {
      initPositionStyle(child)
      item.value.appendChild(child.value);
    });
}