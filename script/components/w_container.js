function createContainerHTML (wb, data) {
  wb.value = document.createElement(
    wb.ListClassName.includes('w-form') ? 'form' : 'div'
  )
  let fragment = document.createDocumentFragment()
  fragment.replaceChildren(...data.map(cWb => cWb.value))
  wb.value.replaceChildren(fragment)
}
