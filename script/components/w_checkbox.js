function createCheckBoxHTML (wb) {
  wb.value = document.createElement('label')
  toggle.innerHTML = `<input type="checkbox"${
    wb.AttributesItem.Content === 'true' ? ' checked' : ''
  }/><svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M6.72 11.52 L10.8 15.6 L18 7.2" fill="none" stroke-linecap="round" stroke="#ffffff"/></svg>`
  wb.value.onclick = function (ev) {
    ev.stopImmediatePropagation()
    ev.stopPropagation()
    ev.preventDefault()
  }
}
