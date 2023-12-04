function createVariantHTML (item, data) {
  item.value = document.createElement('div')
  let fragment = document.createDocumentFragment()
  fragment.replaceChildren(...data.map(child => child.value))
  item.value.replaceChildren(fragment)
}
