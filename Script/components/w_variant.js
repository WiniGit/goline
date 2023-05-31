function createVariantHTML(item, data) {
    item.value = document.createElement("div");
    $(item.value).addClass("variant");
    var listChild = data;
    item.value.style.position = "relative";
    listChild.forEach((child) => {
      initPositionStyle(child)
      item.value.appendChild(child.value);
    });
}