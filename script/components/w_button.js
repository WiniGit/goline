function wbutton (item, data) {
  item.value = document.createElement('button')
  item.value.type = 'button'
  let fragment = document.createDocumentFragment()
  fragment.replaceChildren(...data.map(cWb => cWb.value))
  item.value.replaceChildren(fragment)
}
