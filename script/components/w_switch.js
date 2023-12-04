function createSwitchHTML (wb) {
  wb.value = document.createElement('label')
  wb.value.innerHTML = `<input type="checkbox" ${
    wb.AttributesItem.Content === 'true' ? 'checked' : ''
  }/><span class="slider"></span>`
  wb.value.onclick = function (ev) {
    ev.stopImmediatePropagation()
    ev.stopPropagation()
    ev.preventDefault()
  }
}
