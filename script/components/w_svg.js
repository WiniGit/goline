async function createSvgImgHTML (wb) {
  wb.value = document.createElement('div')
  let url = urlImg + wb.AttributesItem.Content.replaceAll(' ', '%20')
  let svg = await fetch(url).then(response => response.text())
  wb.value.innerHTML = svg.replaceAll(`style="mix-blend-mode:multiply"`, '')
  // let styleTag = wb.value.querySelector('svg style')
  // if (styleTag && !wb.value.querySelector('.svg-config')) {
  //   styleTag.innerHTML = styleTag.innerHTML.replace(/\.([^\s{}]+)/g, match => {
  //     return `.w-svg[id="${wb.GID}"] ${match}`
  //   })
  // } else {
  let styleText = []
  wb.value.querySelectorAll('svg path').forEach(path => {
    if (path.getAttribute('fill')) {
      styleText.push(`path[fill="${path.getAttribute('fill')}"]`)
    } else if (path.getAttribute('stroke')) {
      styleText.push(`path[stroke="${path.getAttribute('stroke')}"]`)
    }
  })
  styleText = styleText.filterAndMap()
  let styleTag =
    wb.value.querySelector('.svg-config') ?? document.createElement('style')
  styleTag.className = 'svg-config'
  styleText = styleText.map(vl => {
    const prop = vl.includes('stroke') ? 'stroke' : 'fill'
    const styleProp = `--${vl.replace(`path[${prop}="`, '').replace('"]', '')}`
    let colorProp = wb.value.style.getPropertyValue(styleProp.replace('#', ''))
    if (!colorProp?.length) {
      let color = colorProp.match(uuid4Regex)?.[0]
      if (!color || StyleDA.listSkin.every(e => e.GID !== color)) {
        wb.value.style.setProperty(
          styleProp.replace('#', ''),
          styleProp.replace('--', '')
        )
      }
    }
    return `.w-svg[id="${wb.GID}"] ${vl} { ${prop}: var(${styleProp.replace(
      '#',
      ''
    )}) }`
  }).join(`
      `)
  styleTag.innerHTML = styleText
  wb.value.querySelector('svg').appendChild(styleTag)
  // }
}
