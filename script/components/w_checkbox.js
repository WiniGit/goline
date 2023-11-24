function createCheckBoxHTML (item) {
  item.value = createCheckbox(item.AttributesItem.Content === 'true', item)
}
const checkboxSize = 24
function createCheckbox (initValue = false, wbaseItem) {
  let toggle = document.createElement('label')
  $(toggle).addClass('w-check-box')
  toggle.setAttribute('value', initValue)
  toggle.innerHTML = `<input type="checkbox"${
    initValue ? ' checked' : ''
  }/><svg width="${checkboxSize}" height="${checkboxSize}" viewBox="0 0 ${checkboxSize} ${checkboxSize}" xmlns="http://www.w3.org/2000/svg"><path d="M${(
    checkboxSize * 0.28
  ).toFixed(1)} ${(checkboxSize * 0.48).toFixed(1)} L${(
    checkboxSize * 0.45
  ).toFixed(1)} ${(checkboxSize * 0.65).toFixed(1)} L${(
    checkboxSize * 0.75
  ).toFixed(1)} ${(checkboxSize * 0.3).toFixed(
    1
  )}" fill="none" stroke-linecap="round" stroke="#${
    wbaseItem.JsonItem?.CheckColor ? wbaseItem.JsonItem.CheckColor : 'ffffff'
  }"/></svg>`
  toggle.onclick = function (ev) {
    ev.stopImmediatePropagation()
    ev.stopPropagation()
    ev.preventDefault()
  }
  if (wbaseItem) {
    toggle.style.setProperty(
      '--unchecked-bg',
      `#${wbaseItem.JsonItem.InactiveColor}`
    )
    if (wbaseItem.JsonItem?.CheckColor)
      toggle.style.setProperty(
        '--check-color',
        `#${wbaseItem.JsonItem.CheckColor}`
      )
  }
  return toggle
}
