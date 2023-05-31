function createRectangleHTML(item) {
	item.value = document.createElement("div");
	$(item.value).addClass("w-rect");
	item.value.name = item.NameField;
}
