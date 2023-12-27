function createIconHTML (wb) {
  createIcon({ url: urlImg + wb.AttributesItem.Content.replaceAll(' ', '%20'), wb: wb })
}

async function createIcon ({ url, wb, GID }) {
  let icon = document.createElement('div')
  if (wb) wb.value = icon
  let svg = await fetch(url).then(response => response.text())
  icon.innerHTML = svg.replaceAll(`style="mix-blend-mode:multiply"`, '')
  let styleText = []
  icon.querySelectorAll('svg path').forEach(path => {
    if (path.getAttribute('fill')) {
      let colorFill = path.getAttribute('fill')
      if (!colorFill.match(hexRegex))
        colorFill = `#${Ultis.colorNameToHex(colorFill)}`
      if (colorFill.length === 7) colorFill += 'ff'
      if (!styleText.length || styleText.every(e => e !== colorFill)) {
        styleText.push(colorFill)
        path.classList.add('color0')
      } else {
        path.classList.add(`color${styleText.indexOf(colorFill)}`)
      }
    } else if (path.getAttribute('stroke')) {
      let colorStroke = path.getAttribute('stroke')
      if (!colorStroke.match(hexRegex))
        colorStroke = `#${Ultis.colorNameToHex(colorStroke)}`
      if (colorStroke.length === 7) colorStroke += 'ff'
      if (!styleText.length || styleText.every(e => e !== colorStroke)) {
        styleText.push(colorStroke)
        path.classList.add('color0')
      } else {
        path.classList.add(`color${styleText.indexOf(colorStroke)}`)
      }
    }
  })
  let styleTag = document.createElement('style')
  styleTag.className = 'svg-config'
  styleTag.innerHTML = styleText.map(vl => {
    const vlIndex = styleText.indexOf(vl)
    if (!wb) icon.style.setProperty(`--svg-color${vlIndex}`, vl)
    return `.w-svg[id="${wb?.GID ?? GID}"] .color${vlIndex}[fill] { fill: var(--svg-color${vlIndex}) }
    .w-svg[id="${wb?.GID ?? GID}"] .color${vlIndex}[stroke] { stroke: var(--svg-color${vlIndex}) }`
  })
  icon.appendChild(styleTag)
  return icon
}
