async function createSvgImgHTML (wb) {
  wb.value = document.createElement('div')
  let url = urlImg + wb.AttributesItem.Content.replaceAll(' ', '%20')
  let svg = await fetch(url).then(response => response.text())
  wb.value.innerHTML = svg.replaceAll(`style="mix-blend-mode:multiply"`, '')
  let styleTag = wb.value.querySelector('svg style')
  if (styleTag)
    styleTag.innerHTML = styleTag.innerHTML.replace(
      /\.([^\s{}]+)/g,
      match => `.w-svg[id="${wb.GID}"] ${match}`
    )
}
