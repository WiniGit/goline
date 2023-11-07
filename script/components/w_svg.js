async function createSvgImgHTML(item) {
  item.value = document.createElement("div");
  $(item.value).addClass("w-svg");
  if (item.build) {
    await getColorSvg(item);
  } else {
    getColorSvg(item);
  }
}

async function getColorSvg(item) {
  let url = urlImg + item.AttributesItem.Content.replaceAll(" ", "%20");
  let svg = await fetch(url).then((response) => response.text());
  item.value.innerHTML = svg.replaceAll(`style="mix-blend-mode:multiply"`, "");
  let styleTag = item.value.querySelector("svg style");
  if (styleTag) {
    styleTag.innerHTML = styleTag.innerHTML.replace(/\.([^\s{}]+)/g, (match) => `.w-svg[id="${item.GID}"] ${match}`);
  }
  if (item.StyleItem) {
    if (item.StyleItem.DecorationItem.ColorValue) {
      let listColorValue = item.StyleItem.DecorationItem.ColorValue.split(",");
      if (listColorValue.length == 1) {
        item.value.innerHTML = item.value.innerHTML.replace(svgRegex, (match) => match.replace(/(?![fill|stroke])(#){0,1}\w+/g, `#${listColorValue[0]}`));
      } else {
        for (let i = 1; i <= listColorValue.length; i++) {
          let j = 0;
          let color_value = listColorValue[i - 1];
          item.value.innerHTML = item.value.innerHTML.replace(svgRegex, (match) => (++j === i ? match.replace(/(?![fill|stroke])(#){0,1}\w+/g, `#${color_value}`) : match));
        }
      }
    } else {
      let listColorValue = svg.match(svgRegex)?.map((value) => {
        let _colorValue = value.replace(/(fill|stroke)/g, "").replace(/[^\w ]/g, "");
        _colorValue = Ultis.colorNameToHex(_colorValue) ?? _colorValue;
        if (_colorValue.length == 6) {
          _colorValue = _colorValue + "ff";
        }
        return _colorValue;
      });
      item.StyleItem.DecorationItem.ColorValue = listColorValue?.join(",");
    }
  }
}
