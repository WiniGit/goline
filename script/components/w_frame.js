function createFrameHTML (item, data) {
  item.value = document.createElement(
    item.CateID === EnumCate.form ? 'form' : 'div'
  )
  $(item.value).addClass('w-frame')
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
