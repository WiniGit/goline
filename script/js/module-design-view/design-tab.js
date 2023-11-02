function updateUIDesignView () {
  let scrollY = design_view.scrollTop
  let listEditContainer = document.createDocumentFragment()
  if (selected_list.length === 0) {
    let editCanvasBground = createCanvasBackground()
    listEditContainer.appendChild(editCanvasBground)
    let winiRes = winiResponsive()
    listEditContainer.appendChild(winiRes)
    let breakpoint = createBreakpoint()
    listEditContainer.appendChild(breakpoint)
    let localSkins = createSelectionSkins()
    listEditContainer.appendChild(localSkins)
  } else {
    let editAlign = EditAlignBlock()
    let editSizePosition = createEditSizePosition()
    // // let selectClass = selectionClass();
    listEditContainer.appendChild(editAlign)
    listEditContainer.appendChild(editSizePosition)
    // if (selected_list.length === 1 && selected_list[0].IsWini && selected_list[0].CateID !== EnumCate.variant) {
    //   let editVariables = createVariables();
    //   listEditContainer.appendChild(editVariables);
    // }
    // // listEditContainer.appendChild(selectClass);
    if (
      select_box_parentID != wbase_parentID &&
      selected_list.some(
        wb => window.getComputedStyle(wb.value).position === 'absolute'
      )
    ) {
      let editConstraints = createConstraints()
      listEditContainer.appendChild(editConstraints)
    }
    // if (select_box_parentID != wbase_parentID && selected_list.every((e) => window.getComputedStyle(e.value).position !== "absolute")) {
    //   let pageParent = $(selected_list[0].value).parents(".wbaseItem-va69lue");
    //   let framePage = pageParent[pageParent.length - 1];
    //   if (framePage?.classList?.contains("w-variant")) framePage = pageParent[pageParent.length - 2];
    //   if (framePage) {
    //     let isPage = EnumCate.extend_frame.some((cate) => framePage.getAttribute("cateid") == cate);
    //     if (isPage) {
    //       let selectColByBrp = colNumberByBrp(framePage.style.width != "fit-content");
    //       listEditContainer.appendChild(selectColByBrp);
    //     }
    //   }
    // }
    if (
      selected_list.some(wb =>
        EnumCate.no_child_component.every(ct => wb.CateID !== ct)
      )
    ) {
      let editAutoLayout = createAutoLayout()
      listEditContainer.appendChild(editAutoLayout)
    }
    //
    if (
      selected_list.length > 0 &&
      selected_list.every(wb => wb.CateID !== EnumCate.text)
    ) {
      let editBackground = createEditBackground()
      listEditContainer.appendChild(editBackground)
    }
    if (
      selected_list.some(
        wb =>
          wb.CateID === EnumCate.text || wb.CateID === EnumCate.textformfield
      )
    ) {
      let editTextStyle = createEditTextStyle()
      listEditContainer.appendChild(editTextStyle)
    }
    if (
      selected_list.some(wb =>
        EnumCate.accept_border_effect.some(ct => wb.CateID === ct)
      )
    ) {
      let editBorder = createEditBorder()
      listEditContainer.appendChild(editBorder)
      let editEffect = createEditEffect()
      listEditContainer.appendChild(editEffect)
    }
    // let editVariants = createEditVariants();
    // listEditContainer.appendChild(editVariants);
  }
  design_view.replaceChildren(listEditContainer)
  design_view.scrollTo({
    top: scrollY,
    behavior: 'smooth'
  })
}

export function setupRightView () {
  // setup tab change
  // create elements in design view
//   right_view.onkeydown = function (e) {
//     if (e.key === 'Enter' && document.activeElement.localName === 'input') {
//       document.activeElement.blur()
//     }
//   }
  updateUIDesignView()
}
