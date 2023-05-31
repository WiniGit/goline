async function createSvgImgHTML(item) {
    item.value = document.createElement("div");
    $(item.value).addClass("w-svg");
    if(item.build) {
        await getColorSvg(item);
    } else {
        getColorSvg(item);
    }
    
}

async function getColorSvg(item) {
    let url = urlImg + item.AttributesItem.Content.replaceAll(" ", "%20");
    let svg = await fetch(url).then(response => response.text());
    item.value.innerHTML = svg;
    if (item.StyleItem.DecorationItem.ColorValue) {
        let listColorValue = item.StyleItem.DecorationItem.ColorValue.split(",");
        if (listColorValue.length == 1) {
            item.value.innerHTML = item.value.innerHTML.replace(svgRegex, match => `${match.includes("fill")? "fill" : "stroke"}="#${listColorValue[0].substring(2)}${listColorValue[0].substring(0, 2)}"`)
        } else {
            for (let i = 1; i <= listColorValue.length; i++) {
                let j = 0;
                let color_value = listColorValue[i - 1];
                item.value.innerHTML = item.value.innerHTML.replace(svgRegex, match => ++j === i ? `${match.includes("fill")? "fill" : "stroke"}="#${color_value.substring(2)}${color_value.substring(0, 2)}"` : match);
            }
        }
    } else {
        let listColorValue = svg.match(svgRegex)?.map((value) => {
            let _colorValue = value.replace(/(fill|stroke)/g, "").replace(/[^\w ]/g, "");
            _colorValue = Ultis.colorNameToHex(_colorValue) ?? _colorValue;
            if (_colorValue.length == 6) {
                _colorValue = "ff" + _colorValue;
            }
            return _colorValue;
        });
        item.StyleItem.DecorationItem.ColorValue = listColorValue?.join(",");
    }
} 