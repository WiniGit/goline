function createSwitchHTML (item) {
  item.value = createSwitch(item.AttributesItem.Content === 'true', item)
}

function createSwitch (initValue = false, wbaseItem) {
  let toggle = document.createElement('label')
  $(toggle).addClass('w-switch')
  toggle.setAttribute('value', initValue)
  let input = document.createElement('input')
  input.type = 'checkbox'
  input.defaultChecked = initValue
  let slider = document.createElement('span')
  slider.className = 'slider'
  toggle.replaceChildren(input, slider)
  if (wbaseItem) {
//     if (wbaseItem.AttributesItem.NameField !== '')
//       input.name = wbaseItem.AttributesItem.NameField
    toggle.style.setProperty('--dot-color', `#${wbaseItem.JsonItem.DotColor}`)
    toggle.style.setProperty(
      '--unchecked-bg',
      `#${wbaseItem.JsonItem.InactiveColor}`
    )
    toggle.click = function (e) {
      e.stopImmediatePropagation()
      e.stopPropagation()
      e.preventDefault()
    }
  }
  input.onchange = function (e) {
    e.stopImmediatePropagation()
    e.stopPropagation()
    if (wbaseItem) {
      wbaseItem.AttributesItem.Content = `${this.checked}`
      toggle.style.setProperty(
        '--unchecked-bg',
        `#${wbaseItem.JsonItem.InactiveColor}`
      )
    }
  }
  return toggle
}
