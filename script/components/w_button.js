function wbutton (item, data) {
  item.value = document.createElement('button')
  item.value.type = 'button'
  $(item.value).addClass('w-button')
  if (item.WAutolayoutItem?.Direction === 'Horizontal') {
    $(item.value).addClass('w-row')
  } else if (item.WAutolayoutItem?.Direction === 'Vertical') {
    $(item.value).addClass('w-col')
  } else {
    $(item.value).addClass('w-stack')
  }
  let fragment = document.createDocumentFragment()
  fragment.replaceChildren(...data.map(cWb => cWb.value))
  item.value.replaceChildren(fragment)
}
