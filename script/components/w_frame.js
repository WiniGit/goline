export default function createFrameHTML(item, data) {
  item.value = document.createElement(item.CateID === EnumCate.form ? "form" : "div");
  $(item.value).addClass("w-frame");
  if (item.WAutolayoutItem) {
    let fragment = document.createDocumentFragment();
    fragment.replaceChildren(
      ...data.map((child) => {
        if (child.StyleItem && child.StyleItem.PositionItem.FixPosition) {
          initPositionStyle(child);
        }
        return child.value;
      }),
    );
    item.value.replaceChildren(fragment);
  } else {
    $(item.value).addClass("w-stack");
    let fragment = document.createDocumentFragment();
    fragment.replaceChildren(
      ...data.map((child) => {
        initPositionStyle(child);
        return child.value;
      }),
    );
    item.value.replaceChildren(fragment);
  }
}
