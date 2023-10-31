export default function EditAlignBlock () {
  let editAlignContainer = document.createElement('div')
  editAlignContainer.id = 'edit_align_div'
  let isEnable =
    !selected_list[0].value.closest(`.wbaseItem-value[isinstance="true"]`) &&
    selected_list.every(
      wb =>
        (window.getComputedStyle(wb.value).position === 'absolute' &&
          (selected_list.length > 1 || wb.Level > 1)) ||
        [
          ...wb.value.querySelectorAll(
            `.wbaseItem-value[level="${wb.Level + 1}"]`
          )
        ].some(
          childWb => window.getComputedStyle(childWb).position === 'absolute'
        )
    )
  if (isEnable) {
    isEnable = !selected_list.some(
      wb =>
        wb.IsInstance &&
        (window.getComputedStyle(wb.value).position !== 'absolute' ||
          wb.Level === 1)
    )
  }
  editAlignContainer.setAttribute('enable', isEnable)
  editAlignContainer.replaceChildren(
    ...[
      'align left',
      'align horizontal center',
      'align right',
      'align top',
      'align vertical center',
      'align bottom'
    ].map(alignType => {
      let btnAlign = document.createElement('img')
      btnAlign.className = 'img-button size-32'
      if (isEnable)
        btnAlign.onclick = function () {
          handleEditAlign(alignType)
          updateUIEditPosition()
          updateUIConstraints()
        }
      return btnAlign
    })
  )
  return editAlignContainer
}

export default function reloadEditAlignBlock () {
  let newEditAlign = EditAlignBlock()
  document.getElementById('edit_align_div').replaceWith(newEditAlign)
}

function handleEditAlign (newValue) {
  let is_edit_children =
    (selected_list.length === 1 &&
      !selected_list[0].IsInstance &&
      [
        ...selected_list[0].value.querySelectorAll(
          `.wbaseItem-value[level="${selected_list[0].Level + 1}"]`
        )
      ].some(
        childWb => window.getComputedStyle(childWb).position === 'absolute'
      )) ||
    !selected_list.every(
      wb => window.getComputedStyle(wb.value).position === 'absolute'
    )
  let listUpdate = []
  switch (newValue) {
    case 'align left':
      if (is_edit_children) {
        for (let wb of selected_list) {
          let children = [
            ...wb.value.querySelectorAll(
              `.wbaseItem-value[level="${wb.Level + 1}"]`
            )
          ].filter(
            cWbHTML => window.getComputedStyle(cWbHTML).position === 'absolute'
          )
          if (wb.IsWini && wb.CateID !== EnumCate.variant) {
            let cssItem = StyleDA.cssStyleSheets.find(e => e.GID === wb.GID)
            for (let cWbHTML of children) {
              let cssRule = StyleDA.docStyleSheets.find(e =>
                [...wb.querySelectorAll(e.selectorText)].includes(cWbHTML)
              )
              switch (cWbHTML.getAttribute('constx')) {
                case Constraints.left_right:
                  cssRule.style.width = cWbHTML.offsetWidth + 'px'
                  break
                case Constraints.scale:
                  cssRule.style.width = cWbHTML.offsetWidth + 'px'
                  break
                default:
                  break
              }
              if (cWbHTML.getAttribute('consty') === Constraints.center) {
                cssRule.style.transform = 'translateY(-50%)'
              } else cssRule.style.transform = ''
              cssRule.style.left = '0px'
              cssRule.style.right = ''
              cWbHTML.setAttribute('constx', Constraints.left)
              cssItem.Css = cssItem.Css.replace(
                new RegExp(`${cssRule.selectorText} {[^}]*}`, 'g'),
                cssRule.cssText
              )
            }
            StyleDA.editStyleSheet(cssItem)
          } else {
            if (children.length > 0) {
              children = wbase_list.filter(e =>
                children.some(cWbHTML => e.GID === cWbHTML.id)
              )
              for (let cWb of children) {
                switch (cWb.value.getAttribute('constx')) {
                  case Constraints.left_right:
                    cWb.value.style.width = cWb.value.offsetWidth + 'px'
                    break
                  case Constraints.scale:
                    cWb.value.style.width = cWb.value.offsetWidth + 'px'
                    break
                  default:
                    break
                }
                if (cWb.value.getAttribute('consty') === Constraints.center) {
                  cWb.value.style.transform = 'translateY(-50%)'
                } else cWb.value.style.transform = ''
                cWb.value.style.left = '0px'
                cWb.value.style.right = ''
                cWb.value.setAttribute('constx', Constraints.left)
              }
              listUpdate.push(...children)
            }
          }
        }
      } else if (selected_list.length === 1) {
        if (selected_list[0].StyleItem) {
          switch (selected_list[0].value.getAttribute('constx')) {
            case Constraints.left_right:
              selected_list[0].value.style.width =
                selected_list[0].value.offsetWidth + 'px'
              break
            case Constraints.scale:
              selected_list[0].value.style.width =
                selected_list[0].value.offsetWidth + 'px'
              break
            default:
              break
          }
          if (
            selected_list[0].value.getAttribute('consty') === Constraints.center
          ) {
            selected_list[0].value.style.transform = 'translateY(-50%)'
          } else selected_list[0].value.style.transform = ''
          selected_list[0].value.style.left = '0px'
          selected_list[0].value.style.right = ''
          selected_list[0].value.setAttribute('constx', Constraints.left)
          listUpdate.push(...selected_list)
        } else {
          let pWbComponent = selected_list[0].value.closest(
            `.wbaseItem-value[iswini="true"]`
          )
          let cssItem = StyleDA.cssStyleSheets.find(
            e => e.GID === pWbComponent.id
          )
          let cssRule = StyleDA.docStyleSheets.find(e =>
            [...pWbComponent.querySelectorAll(e.selectorText)].includes(
              selected_list[0].value
            )
          )
          switch (selected_list[0].value.getAttribute('constx')) {
            case Constraints.left_right:
              cssRule.style.width = selected_list[0].value.offsetWidth + 'px'
              break
            case Constraints.scale:
              cssRule.style.width = selected_list[0].value.offsetWidth + 'px'
              break
            default:
              break
          }
          if (
            selected_list[0].value.getAttribute('consty') === Constraints.center
          ) {
            cssRule.style.transform = 'translateY(-50%)'
          } else cssRule.style.transform = ''
          cssRule.style.left = '0px'
          cssRule.style.right = ''
          selected_list[0].value.setAttribute('constx', Constraints.left)
          cssItem.Css = cssItem.Css.replace(
            new RegExp(`${cssRule.selectorText} {[^}]*}`, 'g'),
            cssRule.cssText
          )
          StyleDA.editStyleSheet(cssItem)
        }
      } else {
        let minX = Math.min(
          ...selected_list.map(wb =>
            parseFloat(window.getComputedStyle(wb.value).left.replace('px'))
          )
        )
        let pStyle = window.getComputedStyle(
          selected_list[0].value.parentElement
        )
        if (selected_list[0].StyleItem) {
          for (let wb of selected_list) {
            switch (wb.value.getAttribute('constx')) {
              case Constraints.right:
                wb.value.style.right = `${Math.round(
                  parseFloat(pStyle.width.replace('px')) -
                    parseFloat(pStyle.borderRightWidth.replace('px')) -
                    parseFloat(pStyle.borderLeftWidth.replace('px')) -
                    minX
                )}px`
                break
              case Constraints.left_right:
                wb.value.style.right = `${Math.round(
                  parseFloat(pStyle.width.replace('px')) -
                    parseFloat(pStyle.borderRightWidth.replace('px')) -
                    parseFloat(pStyle.borderLeftWidth.replace('px')) -
                    minX
                )}px`
                wb.value.style.left = minX + 'px'
                break
              case Constraints.center:
                let centerValue = `${
                  minX + (wb.value.offsetWidth - wb.value.offsetWidth) / 2
                }px`
                wb.value.style.left = `calc(50% + ${centerValue})`
                break
              case Constraints.scale:
                let leftValue = `${(
                  (minX * 100) /
                  wb.value.parentElement.offsetWidth
                ).toFixed(2)}%`
                let rightValue = `${(
                  (Math.round(
                    parseFloat(pStyle.width.replace('px')) -
                      parseFloat(pStyle.borderRightWidth.replace('px')) -
                      parseFloat(pStyle.borderLeftWidth.replace('px')) -
                      minX
                  ) *
                    100) /
                  wb.value.parentElement.offsetWidth
                ).toFixed(2)}px`
                wb.value.style.left = leftValue
                wb.value.style.right = rightValue
                break
              default:
                wb.value.style.left = minX + 'px'
                break
            }
          }
          listUpdate.push(...selected_list)
        } else {
          let pWbComponent = selected_list[0].value.closest(
            `.wbaseItem-value[iswini="true"]`
          )
          let cssItem = StyleDA.cssStyleSheets.find(
            e => e.GID === pWbComponent.id
          )
          for (let wb of selected_list) {
            let cssRule = StyleDA.docStyleSheets.find(e =>
              [...pWbComponent.querySelectorAll(e.selectorText)].includes(
                wb.value
              )
            )
            switch (wb.value.getAttribute('constx')) {
              case Constraints.right:
                cssRule.style.right = `${Math.round(
                  parseFloat(pStyle.width.replace('px')) -
                    parseFloat(pStyle.borderRightWidth.replace('px')) -
                    parseFloat(pStyle.borderLeftWidth.replace('px')) -
                    minX
                )}px`
                break
              case Constraints.left_right:
                cssRule.style.right = `${Math.round(
                  parseFloat(pStyle.width.replace('px')) -
                    parseFloat(pStyle.borderRightWidth.replace('px')) -
                    parseFloat(pStyle.borderLeftWidth.replace('px')) -
                    minX
                )}px`
                cssRule.style.left = minX + 'px'
                break
              case Constraints.center:
                let centerValue = `${
                  minX + (wb.value.offsetWidth - wb.value.offsetWidth) / 2
                }px`
                cssRule.style.left = `calc(50% + ${centerValue})`
                break
              case Constraints.scale:
                let leftValue = `${(
                  (minX * 100) /
                  wb.value.parentElement.offsetWidth
                ).toFixed(2)}%`
                let rightValue = `${(
                  (Math.round(
                    parseFloat(pStyle.width.replace('px')) -
                      parseFloat(pStyle.borderRightWidth.replace('px')) -
                      parseFloat(pStyle.borderLeftWidth.replace('px')) -
                      minX
                  ) *
                    100) /
                  wb.value.parentElement.offsetWidth
                ).toFixed(2)}px`
                cssRule.style.left = leftValue
                cssRule.style.right = rightValue
                break
              default:
                cssRule.style.left = minX + 'px'
                break
            }
            cssItem.Css = cssItem.Css.replace(
              new RegExp(`${cssRule.selectorText} {[^}]*}`, 'g'),
              cssRule.cssText
            )
          }
          StyleDA.editStyleSheet(cssItem)
        }
      }
      break
    case 'align horizontal center':
      if (is_edit_children) {
        for (let wb of selected_list) {
          let children = [
            ...wb.value.querySelectorAll(
              `.wbaseItem-value[level="${wb.Level + 1}"]`
            )
          ].filter(
            cWbHTML => window.getComputedStyle(cWbHTML).position === 'absolute'
          )
          if (wb.IsWini && wb.CateID !== EnumCate.variant) {
            let cssItem = StyleDA.cssStyleSheets.find(e => e.GID === wb.GID)
            for (let cWbHTML of children) {
              let cssRule = StyleDA.docStyleSheets.find(e =>
                [...wb.querySelectorAll(e.selectorText)].includes(cWbHTML)
              )
              switch (cWbHTML.getAttribute('constx')) {
                case Constraints.left_right:
                  cssRule.style.width = cWbHTML.offsetWidth + 'px'
                  break
                case Constraints.scale:
                  cssRule.style.width = cWbHTML.offsetWidth + 'px'
                  break
                default:
                  break
              }
              if (cWbHTML.getAttribute('consty') === Constraints.center) {
                cssRule.style.transform = 'translate(-50%,-50%)'
              } else cssRule.style.transform = 'translateX(-50%)'
              cssRule.style.left = `calc(50% + 0px)`
              cssRule.style.right = ''
              cWbHTML.setAttribute('constx', Constraints.center)
              cssItem.Css = cssItem.Css.replace(
                new RegExp(`${cssRule.selectorText} {[^}]*}`, 'g'),
                cssRule.cssText
              )
            }
            StyleDA.editStyleSheet(cssItem)
          } else {
            if (children.length > 0) {
              children = wbase_list.filter(e =>
                children.some(cWbHTML => e.GID === cWbHTML.id)
              )
              for (let cWb of children) {
                switch (cWb.value.getAttribute('constx')) {
                  case Constraints.left_right:
                    cWb.value.style.width = cWb.value.offsetWidth + 'px'
                    break
                  case Constraints.scale:
                    cWb.value.style.width = cWb.value.offsetWidth + 'px'
                    break
                  default:
                    break
                }
                if (cWb.value.getAttribute('consty') === Constraints.center) {
                  cWb.value.style.transform = 'translate(-50%,-50%)'
                } else cWb.value.style.transform = 'translateX(-50%)'
                wb.value.style.left = `calc(50% + 0px)`
                cWb.value.style.right = ''
                cWb.value.setAttribute('constx', Constraints.center)
              }
              listUpdate.push(...children)
            }
          }
        }
      } else if (selected_list.length === 1) {
        if (selected_list[0].StyleItem) {
          switch (selected_list[0].value.getAttribute('constx')) {
            case Constraints.left_right:
              selected_list[0].value.style.width =
                selected_list[0].value.offsetWidth + 'px'
              break
            case Constraints.scale:
              selected_list[0].value.style.width =
                selected_list[0].value.offsetWidth + 'px'
              break
            default:
              break
          }
          if (
            selected_list[0].value.getAttribute('consty') === Constraints.center
          ) {
            selected_list[0].value.style.transform = 'translate(-50%,-50%)'
          } else selected_list[0].value.style.transform = 'translateX(-50%)'
          selected_list[0].value.style.left = 'calc(50% + 0px)'
          selected_list[0].value.style.right = ''
          selected_list[0].value.setAttribute('constx', Constraints.center)
          listUpdate.push(...selected_list)
        } else {
          let pWbComponent = selected_list[0].value.closest(
            `.wbaseItem-value[iswini="true"]`
          )
          let cssItem = StyleDA.cssStyleSheets.find(
            e => e.GID === pWbComponent.id
          )
          let cssRule = StyleDA.docStyleSheets.find(e =>
            [...pWbComponent.querySelectorAll(e.selectorText)].includes(
              selected_list[0].value
            )
          )
          switch (selected_list[0].value.getAttribute('constx')) {
            case Constraints.left_right:
              cssRule.style.width = selected_list[0].value.offsetWidth + 'px'
              break
            case Constraints.scale:
              cssRule.style.width = selected_list[0].value.offsetWidth + 'px'
              break
            default:
              break
          }
          if (
            selected_list[0].value.getAttribute('consty') === Constraints.center
          ) {
            cssRule.style.transform = 'translate(-50%,-50%)'
          } else cssRule.style.transform = 'translateX(-50%)'
          cssRule.style.left = 'calc(50% + 0px)'
          cssRule.style.right = ''
          selected_list[0].value.setAttribute('constx', Constraints.center)
          cssItem.Css = cssItem.Css.replace(
            new RegExp(`${cssRule.selectorText} {[^}]*}`, 'g'),
            cssRule.cssText
          )
          StyleDA.editStyleSheet(cssItem)
        }
      } else {
        let pStyle = window.getComputedStyle(
          selected_list[0].value.parentElement
        )
        let minX = Math.min(
          ...selected_list.map(wb =>
            parseFloat(window.getComputedStyle(wb.value).left.replace('px'))
          )
        )
        let maxX = Math.max(
          ...selected_list.map(
            wb =>
              parseFloat(window.getComputedStyle(wb.value).left.replace('px')) +
              wb.value.offsetWidth
          )
        )
        let newOffX = minX + (maxX - minX) / 2
        if (selected_list[0].StyleItem) {
          for (let wb of selected_list) {
            switch (wb.value.getAttribute('constx')) {
              case Constraints.right:
                wb.value.style.right = `${Math.round(
                  parseFloat(pStyle.width.replace('px')) -
                    parseFloat(pStyle.borderRightWidth.replace('px')) -
                    parseFloat(pStyle.borderLeftWidth.replace('px')) -
                    newOffX
                )}px`
                break
              case Constraints.left_right:
                wb.value.style.right = `${Math.round(
                  parseFloat(pStyle.width.replace('px')) -
                    parseFloat(pStyle.borderRightWidth.replace('px')) -
                    parseFloat(pStyle.borderLeftWidth.replace('px')) -
                    newOffX
                )}px`
                wb.value.style.left = newOffX + 'px'
                break
              case Constraints.center:
                let centerValue = `${
                  newOffX + (wb.value.offsetWidth - wb.value.offsetWidth) / 2
                }px`
                wb.value.style.left = `calc(50% + ${centerValue})`
                break
              case Constraints.scale:
                let leftValue = `${(
                  (newOffX * 100) /
                  wb.value.parentElement.offsetWidth
                ).toFixed(2)}%`
                let rightValue = `${(
                  (Math.round(
                    parseFloat(pStyle.width.replace('px')) -
                      parseFloat(pStyle.borderRightWidth.replace('px')) -
                      parseFloat(pStyle.borderLeftWidth.replace('px')) -
                      newOffX
                  ) *
                    100) /
                  wb.value.parentElement.offsetWidth
                ).toFixed(2)}px`
                wb.value.style.left = leftValue
                wb.value.style.right = rightValue
                break
              default:
                wb.value.style.left = newOffX + 'px'
                break
            }
          }
          listUpdate.push(...selected_list)
        } else {
          let pWbComponent = selected_list[0].value.closest(
            `.wbaseItem-value[iswini="true"]`
          )
          let cssItem = StyleDA.cssStyleSheets.find(
            e => e.GID === pWbComponent.id
          )
          for (let wb of selected_list) {
            let cssRule = StyleDA.docStyleSheets.find(e =>
              [...pWbComponent.querySelectorAll(e.selectorText)].includes(
                wb.value
              )
            )
            switch (wb.value.getAttribute('constx')) {
              case Constraints.right:
                cssRule.style.right = `${Math.round(
                  parseFloat(pStyle.width.replace('px')) -
                    parseFloat(pStyle.borderRightWidth.replace('px')) -
                    parseFloat(pStyle.borderLeftWidth.replace('px')) -
                    newOffX
                )}px`
                break
              case Constraints.left_right:
                cssRule.style.right = `${Math.round(
                  parseFloat(pStyle.width.replace('px')) -
                    parseFloat(pStyle.borderRightWidth.replace('px')) -
                    parseFloat(pStyle.borderLeftWidth.replace('px')) -
                    newOffX
                )}px`
                cssRule.style.left = newOffX + 'px'
                break
              case Constraints.center:
                let centerValue = `${
                  newOffX + (wb.value.offsetWidth - wb.value.offsetWidth) / 2
                }px`
                cssRule.style.left = `calc(50% + ${centerValue})`
                break
              case Constraints.scale:
                let leftValue = `${(
                  (newOffX * 100) /
                  wb.value.parentElement.offsetWidth
                ).toFixed(2)}%`
                let rightValue = `${(
                  (Math.round(
                    parseFloat(pStyle.width.replace('px')) -
                      parseFloat(pStyle.borderRightWidth.replace('px')) -
                      parseFloat(pStyle.borderLeftWidth.replace('px')) -
                      newOffX
                  ) *
                    100) /
                  wb.value.parentElement.offsetWidth
                ).toFixed(2)}px`
                cssRule.style.left = leftValue
                cssRule.style.right = rightValue
                break
              default:
                cssRule.style.left = newOffX + 'px'
                break
            }
            cssItem.Css = cssItem.Css.replace(
              new RegExp(`${cssRule.selectorText} {[^}]*}`, 'g'),
              cssRule.cssText
            )
          }
          StyleDA.editStyleSheet(cssItem)
        }
      }
      break
    case 'align right':
      if (is_edit_children) {
        for (let wb of selected_list) {
          let children = [
            ...wb.value.querySelectorAll(
              `.wbaseItem-value[level="${wb.Level + 1}"]`
            )
          ].filter(
            cWbHTML => window.getComputedStyle(cWbHTML).position === 'absolute'
          )
          if (wb.IsWini && wb.CateID !== EnumCate.variant) {
            let cssItem = StyleDA.cssStyleSheets.find(e => e.GID === wb.GID)
            for (let cWbHTML of children) {
              let cssRule = StyleDA.docStyleSheets.find(e =>
                [...wb.querySelectorAll(e.selectorText)].includes(cWbHTML)
              )
              switch (cWbHTML.getAttribute('constx')) {
                case Constraints.left_right:
                  cssRule.style.width = cWbHTML.offsetWidth + 'px'
                  break
                case Constraints.scale:
                  cssRule.style.width = cWbHTML.offsetWidth + 'px'
                  break
                default:
                  break
              }
              if (cWbHTML.getAttribute('consty') === Constraints.center) {
                cssRule.style.transform = 'translateY(-50%)'
              } else cssRule.style.transform = ''
              cssRule.style.left = ''
              cssRule.style.right = '0px'
              cWbHTML.setAttribute('constx', Constraints.right)
              cssItem.Css = cssItem.Css.replace(
                new RegExp(`${cssRule.selectorText} {[^}]*}`, 'g'),
                cssRule.cssText
              )
            }
            StyleDA.editStyleSheet(cssItem)
          } else {
            if (children.length > 0) {
              children = wbase_list.filter(e =>
                children.some(cWbHTML => e.GID === cWbHTML.id)
              )
              for (let cWb of children) {
                switch (cWb.value.getAttribute('constx')) {
                  case Constraints.left_right:
                    cWb.value.style.width = cWb.value.offsetWidth + 'px'
                    break
                  case Constraints.scale:
                    cWb.value.style.width = cWb.value.offsetWidth + 'px'
                    break
                  default:
                    break
                }
                if (cWb.value.getAttribute('consty') === Constraints.center) {
                  cWb.value.style.transform = 'translateY(-50%)'
                } else cWb.value.style.transform = ''
                cWb.value.style.left = ''
                cWb.value.style.right = '0px'
                cWb.value.setAttribute('constx', Constraints.right)
              }
              listUpdate.push(...children)
            }
          }
        }
      } else if (selected_list.length === 1) {
        if (selected_list[0].StyleItem) {
          switch (selected_list[0].value.getAttribute('constx')) {
            case Constraints.left_right:
              selected_list[0].value.style.width =
                selected_list[0].value.offsetWidth + 'px'
              break
            case Constraints.scale:
              selected_list[0].value.style.width =
                selected_list[0].value.offsetWidth + 'px'
              break
            default:
              break
          }
          if (
            selected_list[0].value.getAttribute('consty') === Constraints.center
          ) {
            selected_list[0].value.style.transform = 'translateY(-50%)'
          } else selected_list[0].value.style.transform = ''
          selected_list[0].value.style.left = ''
          selected_list[0].value.style.right = '0px'
          selected_list[0].value.setAttribute('constx', Constraints.right)
          listUpdate.push(...selected_list)
        } else {
          let pWbComponent = selected_list[0].value.closest(
            `.wbaseItem-value[iswini="true"]`
          )
          let cssItem = StyleDA.cssStyleSheets.find(
            e => e.GID === pWbComponent.id
          )
          let cssRule = StyleDA.docStyleSheets.find(e =>
            [...pWbComponent.querySelectorAll(e.selectorText)].includes(
              selected_list[0].value
            )
          )
          switch (selected_list[0].value.getAttribute('constx')) {
            case Constraints.left_right:
              cssRule.style.width = selected_list[0].value.offsetWidth + 'px'
              break
            case Constraints.scale:
              cssRule.style.width = selected_list[0].value.offsetWidth + 'px'
              break
            default:
              break
          }
          if (
            selected_list[0].value.getAttribute('consty') === Constraints.center
          ) {
            cssRule.style.transform = 'translateY(-50%)'
          } else cssRule.style.transform = ''
          cssRule.style.left = ''
          cssRule.style.right = '0px'
          selected_list[0].value.setAttribute('constx', Constraints.right)
          cssItem.Css = cssItem.Css.replace(
            new RegExp(`${cssRule.selectorText} {[^}]*}`, 'g'),
            cssRule.cssText
          )
          StyleDA.editStyleSheet(cssItem)
        }
      } else {
        let maxX = Math.max(
          ...selected_list.map(
            wb =>
              parseFloat(window.getComputedStyle(wb.value).left.replace('px')) +
              wb.value.offsetWidth
          )
        )
        let pStyle = window.getComputedStyle(
          selected_list[0].value.parentElement
        )
        if (selected_list[0].StyleItem) {
          for (let wb of selected_list) {
            switch (wb.value.getAttribute('constx')) {
              case Constraints.left:
                wb.value.style.left = `${Math.round(
                  maxX - wb.value.offsetWidth
                )}px`
                break
              case Constraints.left_right:
                wb.value.style.left = `${Math.round(
                  maxX - wb.value.offsetWidth
                )}px`
                wb.value.style.right = maxX + 'px'
                break
              case Constraints.center:
                let centerValue = `${
                  maxX -
                  wb.value.offsetWidth +
                  (wb.value.offsetWidth - wb.value.offsetWidth) / 2
                }px`
                wb.value.style.left = `calc(50% + ${centerValue})`
                break
              case Constraints.scale:
                let leftValue = `${(
                  ((maxX - wb.value.offsetWidth) * 100) /
                  wb.value.parentElement.offsetWidth
                ).toFixed(2)}%`
                let rightValue = `${(
                  (Math.round(
                    parseFloat(pStyle.width.replace('px')) -
                      parseFloat(pStyle.borderRightWidth.replace('px')) -
                      parseFloat(pStyle.borderLeftWidth.replace('px')) -
                      (maxX - wb.value.offsetWidth)
                  ) *
                    100) /
                  wb.value.parentElement.offsetWidth
                ).toFixed(2)}px`
                wb.value.style.left = leftValue
                wb.value.style.right = rightValue
                break
              default:
                wb.value.style.right = maxX + 'px'
                break
            }
          }
          listUpdate.push(...selected_list)
        } else {
          let pWbComponent = selected_list[0].value.closest(
            `.wbaseItem-value[iswini="true"]`
          )
          let cssItem = StyleDA.cssStyleSheets.find(
            e => e.GID === pWbComponent.id
          )
          for (let wb of selected_list) {
            let cssRule = StyleDA.docStyleSheets.find(e =>
              [...pWbComponent.querySelectorAll(e.selectorText)].includes(
                wb.value
              )
            )
            switch (wb.value.getAttribute('constx')) {
              case Constraints.left:
                cssRule.style.left = `${Math.round(
                  maxX - wb.value.offsetWidth
                )}px`
                break
              case Constraints.left_right:
                cssRule.style.left = `${Math.round(
                  maxX - wb.value.offsetWidth
                )}px`
                cssRule.style.right = maxX + 'px'
                break
              case Constraints.center:
                let centerValue = `${
                  maxX -
                  wb.value.offsetWidth +
                  (wb.value.offsetWidth - wb.value.offsetWidth) / 2
                }px`
                cssRule.style.left = `calc(50% + ${centerValue})`
                break
              case Constraints.scale:
                let leftValue = `${(
                  ((maxX - wb.value.offsetWidth) * 100) /
                  wb.value.parentElement.offsetWidth
                ).toFixed(2)}%`
                let rightValue = `${(
                  (Math.round(
                    parseFloat(pStyle.width.replace('px')) -
                      parseFloat(pStyle.borderRightWidth.replace('px')) -
                      parseFloat(pStyle.borderLeftWidth.replace('px')) -
                      (maxX - wb.value.offsetWidth)
                  ) *
                    100) /
                  wb.value.parentElement.offsetWidth
                ).toFixed(2)}px`
                cssRule.style.left = leftValue
                cssRule.style.right = rightValue
                break
              default:
                cssRule.style.right = maxX + 'px'
                break
            }
            cssItem.Css = cssItem.Css.replace(
              new RegExp(`${cssRule.selectorText} {[^}]*}`, 'g'),
              cssRule.cssText
            )
          }
          StyleDA.editStyleSheet(cssItem)
        }
      }
      break
    case 'align top':
      if (is_edit_children) {
        for (let wb of selected_list) {
          let children = [
            ...wb.value.querySelectorAll(
              `.wbaseItem-value[level="${wb.Level + 1}"]`
            )
          ].filter(
            cWbHTML => window.getComputedStyle(cWbHTML).position === 'absolute'
          )
          if (wb.IsWini && wb.CateID !== EnumCate.variant) {
            let cssItem = StyleDA.cssStyleSheets.find(e => e.GID === wb.GID)
            for (let cWbHTML of children) {
              let cssRule = StyleDA.docStyleSheets.find(e =>
                [...wb.querySelectorAll(e.selectorText)].includes(cWbHTML)
              )
              switch (cWbHTML.getAttribute('consty')) {
                case Constraints.top_bottom:
                  cssRule.style.height = cWbHTML.offsetHeight + 'px'
                  break
                case Constraints.scale:
                  cssRule.style.height = cWbHTML.offsetHeight + 'px'
                  break
                default:
                  break
              }
              if (cWbHTML.getAttribute('constx') === Constraints.center) {
                cssRule.style.transform = 'translateX(-50%)'
              } else cssRule.style.transform = ''
              cssRule.style.top = '0px'
              cssRule.style.bottom = ''
              cWbHTML.setAttribute('consty', Constraints.top)
              cssItem.Css = cssItem.Css.replace(
                new RegExp(`${cssRule.selectorText} {[^}]*}`, 'g'),
                cssRule.cssText
              )
            }
            StyleDA.editStyleSheet(cssItem)
          } else {
            if (children.length > 0) {
              children = wbase_list.filter(e =>
                children.some(cWbHTML => e.GID === cWbHTML.id)
              )
              for (let cWb of children) {
                switch (cWb.value.getAttribute('consty')) {
                  case Constraints.top_bottom:
                    cWb.value.style.height = cWb.value.offsetHeight + 'px'
                    break
                  case Constraints.scale:
                    cWb.value.style.height = cWb.value.offsetHeight + 'px'
                    break
                  default:
                    break
                }
                if (cWb.value.getAttribute('constx') === Constraints.center) {
                  cWb.value.style.transform = 'translateX(-50%)'
                } else cWb.value.style.transform = ''
                cWb.value.style.top = '0px'
                cWb.value.style.bottom = ''
                cWb.value.setAttribute('consty', Constraints.top)
              }
              listUpdate.push(...children)
            }
          }
        }
      } else if (selected_list.length === 1) {
        if (selected_list[0].StyleItem) {
          switch (selected_list[0].value.getAttribute('consty')) {
            case Constraints.top_bottom:
              selected_list[0].value.style.height =
                selected_list[0].value.offsetHeight + 'px'
              break
            case Constraints.scale:
              selected_list[0].value.style.height =
                selected_list[0].value.offsetHeight + 'px'
              break
            default:
              break
          }
          if (
            selected_list[0].value.getAttribute('constx') === Constraints.center
          ) {
            selected_list[0].value.style.transform = 'translateX(-50%)'
          } else selected_list[0].value.style.transform = ''
          selected_list[0].value.style.top = '0px'
          selected_list[0].value.style.bottom = ''
          selected_list[0].value.setAttribute('consty', Constraints.top)
          listUpdate.push(...selected_list)
        } else {
          let pWbComponent = selected_list[0].value.closest(
            `.wbaseItem-value[iswini="true"]`
          )
          let cssItem = StyleDA.cssStyleSheets.find(
            e => e.GID === pWbComponent.id
          )
          let cssRule = StyleDA.docStyleSheets.find(e =>
            [...pWbComponent.querySelectorAll(e.selectorText)].includes(
              selected_list[0].value
            )
          )
          switch (selected_list[0].value.getAttribute('consty')) {
            case Constraints.top_bottom:
              cssRule.style.height = selected_list[0].value.offsetHeight + 'px'
              break
            case Constraints.scale:
              cssRule.style.height = selected_list[0].value.offsetHeight + 'px'
              break
            default:
              break
          }
          if (
            selected_list[0].value.getAttribute('constx') === Constraints.center
          ) {
            cssRule.style.transform = 'translateX(-50%)'
          } else cssRule.style.transform = ''
          cssRule.style.top = '0px'
          cssRule.style.bottom = ''
          selected_list[0].value.setAttribute('consty', Constraints.top)
          cssItem.Css = cssItem.Css.replace(
            new RegExp(`${cssRule.selectorText} {[^}]*}`, 'g'),
            cssRule.cssText
          )
          StyleDA.editStyleSheet(cssItem)
        }
      } else {
        let minY = Math.min(
          ...selected_list.map(wb =>
            parseFloat(window.getComputedStyle(wb.value).top.replace('px'))
          )
        )
        let pStyle = window.getComputedStyle(
          selected_list[0].value.parentElement
        )
        if (selected_list[0].StyleItem) {
          for (let wb of selected_list) {
            switch (wb.value.getAttribute('consty')) {
              case Constraints.bottom:
                wb.value.style.bottom = `${Math.round(
                  parseFloat(pStyle.height.replace('px')) -
                    parseFloat(pStyle.borderBottomWidth.replace('px')) -
                    parseFloat(pStyle.borderTopWidth.replace('px')) -
                    minY
                )}px`
                break
              case Constraints.top_bottom:
                wb.value.style.bottom = `${Math.round(
                  parseFloat(pStyle.height.replace('px')) -
                    parseFloat(pStyle.borderBottomWidth.replace('px')) -
                    parseFloat(pStyle.borderTopWidth.replace('px')) -
                    minY
                )}px`
                wb.value.style.top = minY + 'px'
                break
              case Constraints.center:
                let centerValue = `${
                  minY + (wb.value.offsetHeight - wb.value.offsetHeight) / 2
                }px`
                wb.value.style.top = `calc(50% + ${centerValue})`
                break
              case Constraints.scale:
                let topValue = `${(
                  (minY * 100) /
                  wb.value.parentElement.offsetHeight
                ).toFixed(2)}%`
                let botValue = `${(
                  (Math.round(
                    parseFloat(pStyle.height.replace('px')) -
                      parseFloat(pStyle.borderBottomWidth.replace('px')) -
                      parseFloat(pStyle.borderRightWidth.replace('px')) -
                      minY
                  ) *
                    100) /
                  wb.value.parentElement.offsetHeight
                ).toFixed(2)}px`
                wb.value.style.top = topValue
                wb.value.style.bottom = botValue
                break
              default:
                wb.value.style.top = minY + 'px'
                break
            }
          }
          listUpdate.push(...selected_list)
        } else {
          let pWbComponent = selected_list[0].value.closest(
            `.wbaseItem-value[iswini="true"]`
          )
          let cssItem = StyleDA.cssStyleSheets.find(
            e => e.GID === pWbComponent.id
          )
          for (let wb of selected_list) {
            let cssRule = StyleDA.docStyleSheets.find(e =>
              [...pWbComponent.querySelectorAll(e.selectorText)].includes(
                wb.value
              )
            )
            switch (wb.value.getAttribute('consty')) {
              case Constraints.bottom:
                cssRule.style.bottom = `${Math.round(
                  parseFloat(pStyle.height.replace('px')) -
                    parseFloat(pStyle.borderBottomWidth.replace('px')) -
                    parseFloat(pStyle.borderRightWidth.replace('px')) -
                    minY
                )}px`
                break
              case Constraints.top_bottom:
                cssRule.style.bottom = `${Math.round(
                  parseFloat(pStyle.height.replace('px')) -
                    parseFloat(pStyle.borderBottomWidth.replace('px')) -
                    parseFloat(pStyle.borderRightWidth.replace('px')) -
                    minY
                )}px`
                cssRule.style.top = minY + 'px'
                break
              case Constraints.center:
                let centerValue = `${
                  minY + (wb.value.offsetHeight - wb.value.offsetHeight) / 2
                }px`
                cssRule.style.top = `calc(50% + ${centerValue})`
                break
              case Constraints.scale:
                let topValue = `${(
                  (minY * 100) /
                  wb.value.parentElement.offsetHeight
                ).toFixed(2)}%`
                let botValue = `${(
                  (Math.round(
                    parseFloat(pStyle.height.replace('px')) -
                      parseFloat(pStyle.borderBottomWidth.replace('px')) -
                      parseFloat(pStyle.borderTopWidth.replace('px')) -
                      minY
                  ) *
                    100) /
                  wb.value.parentElement.offsetHeight
                ).toFixed(2)}px`
                cssRule.style.top = topValue
                cssRule.style.bottom = botValue
                break
              default:
                cssRule.style.top = minY + 'px'
                break
            }
            cssItem.Css = cssItem.Css.replace(
              new RegExp(`${cssRule.selectorText} {[^}]*}`, 'g'),
              cssRule.cssText
            )
          }
          StyleDA.editStyleSheet(cssItem)
        }
      }
      break
    case 'align vertical center':
      if (is_edit_children) {
        for (let wb of selected_list) {
          let children = [
            ...wb.value.querySelectorAll(
              `.wbaseItem-value[level="${wb.Level + 1}"]`
            )
          ].filter(
            cWbHTML => window.getComputedStyle(cWbHTML).position === 'absolute'
          )
          if (wb.IsWini && wb.CateID !== EnumCate.variant) {
            let cssItem = StyleDA.cssStyleSheets.find(e => e.GID === wb.GID)
            for (let cWbHTML of children) {
              let cssRule = StyleDA.docStyleSheets.find(e =>
                [...wb.querySelectorAll(e.selectorText)].includes(cWbHTML)
              )
              switch (cWbHTML.getAttribute('consty')) {
                case Constraints.top_bottom:
                  cssRule.style.height = cWbHTML.offsetHeight + 'px'
                  break
                case Constraints.scale:
                  cssRule.style.height = cWbHTML.offsetHeight + 'px'
                  break
                default:
                  break
              }
              if (cWbHTML.getAttribute('constx') === Constraints.center) {
                cssRule.style.transform = 'translate(-50%,-50%)'
              } else cssRule.style.transform = 'translateY(-50%)'
              cssRule.style.top = `calc(50% + 0px)`
              cssRule.style.bottom = ''
              cWbHTML.setAttribute('consty', Constraints.center)
              cssItem.Css = cssItem.Css.replace(
                new RegExp(`${cssRule.selectorText} {[^}]*}`, 'g'),
                cssRule.cssText
              )
            }
            StyleDA.editStyleSheet(cssItem)
          } else {
            if (children.length > 0) {
              children = wbase_list.filter(e =>
                children.some(cWbHTML => e.GID === cWbHTML.id)
              )
              for (let cWb of children) {
                switch (cWb.value.getAttribute('consty')) {
                  case Constraints.top_bottom:
                    cWb.value.style.height = cWb.value.offsetHeight + 'px'
                    break
                  case Constraints.scale:
                    cWb.value.style.height = cWb.value.offsetHeight + 'px'
                    break
                  default:
                    break
                }
                if (cWb.value.getAttribute('constx') === Constraints.center) {
                  cWb.value.style.transform = 'translate(-50%,-50%)'
                } else cWb.value.style.transform = 'translateY(-50%)'
                wb.value.style.top = `calc(50% + 0px)`
                cWb.value.style.bottom = ''
                cWb.value.setAttribute('consty', Constraints.center)
              }
              listUpdate.push(...children)
            }
          }
        }
      } else if (selected_list.length === 1) {
        if (selected_list[0].StyleItem) {
          switch (selected_list[0].value.getAttribute('consty')) {
            case Constraints.top_bottom:
              selected_list[0].value.style.height =
                selected_list[0].value.offsetHeight + 'px'
              break
            case Constraints.scale:
              selected_list[0].value.style.height =
                selected_list[0].value.offsetHeight + 'px'
              break
            default:
              break
          }
          if (
            selected_list[0].value.getAttribute('constx') === Constraints.center
          ) {
            selected_list[0].value.style.transform = 'translate(-50%,-50%)'
          } else selected_list[0].value.style.transform = 'translateY(-50%)'
          selected_list[0].value.style.top = 'calc(50% + 0px)'
          selected_list[0].value.style.bottom = ''
          selected_list[0].value.setAttribute('consty', Constraints.center)
          listUpdate.push(...selected_list)
        } else {
          let pWbComponent = selected_list[0].value.closest(
            `.wbaseItem-value[iswini="true"]`
          )
          let cssItem = StyleDA.cssStyleSheets.find(
            e => e.GID === pWbComponent.id
          )
          let cssRule = StyleDA.docStyleSheets.find(e =>
            [...pWbComponent.querySelectorAll(e.selectorText)].includes(
              selected_list[0].value
            )
          )
          switch (selected_list[0].value.getAttribute('consty')) {
            case Constraints.top_bottom:
              cssRule.style.height = selected_list[0].value.offsetHeight + 'px'
              break
            case Constraints.scale:
              cssRule.style.height = selected_list[0].value.offsetHeight + 'px'
              break
            default:
              break
          }
          if (
            selected_list[0].value.getAttribute('constx') === Constraints.center
          ) {
            cssRule.style.transform = 'translate(-50%,-50%)'
          } else cssRule.style.transform = 'translateY(-50%)'
          cssRule.style.top = 'calc(50% + 0px)'
          cssRule.style.bottom = ''
          selected_list[0].value.setAttribute('consty', Constraints.center)
          cssItem.Css = cssItem.Css.replace(
            new RegExp(`${cssRule.selectorText} {[^}]*}`, 'g'),
            cssRule.cssText
          )
          StyleDA.editStyleSheet(cssItem)
        }
      } else {
        let pStyle = window.getComputedStyle(
          selected_list[0].value.parentElement
        )
        let minY = Math.min(
          ...selected_list.map(wb =>
            parseFloat(window.getComputedStyle(wb.value).top.replace('px'))
          )
        )
        let maxY = Math.max(
          ...selected_list.map(
            wb =>
              parseFloat(window.getComputedStyle(wb.value).top.replace('px')) +
              wb.value.offsetHeight
          )
        )
        let newOffY = minY + (maxY - minY) / 2
        if (selected_list[0].StyleItem) {
          for (let wb of selected_list) {
            switch (wb.value.getAttribute('consty')) {
              case Constraints.bottom:
                wb.value.style.bottom = `${Math.round(
                  parseFloat(pStyle.height.replace('px')) -
                    parseFloat(pStyle.borderBottomWidth.replace('px')) -
                    parseFloat(pStyle.borderTopWidth.replace('px')) -
                    newOffY
                )}px`
                break
              case Constraints.top_bottom:
                wb.value.style.bottom = `${Math.round(
                  parseFloat(pStyle.height.replace('px')) -
                    parseFloat(pStyle.borderBottomWidth.replace('px')) -
                    parseFloat(pStyle.borderTopWidth.replace('px')) -
                    newOffY
                )}px`
                wb.value.style.top = newOffY + 'px'
                break
              case Constraints.center:
                let centerValue = `${
                  newOffY + (wb.value.offsetHeight - wb.value.offsetHeight) / 2
                }px`
                wb.value.style.top = `calc(50% + ${centerValue})`
                break
              case Constraints.scale:
                let topValue = `${(
                  (newOffY * 100) /
                  wb.value.parentElement.offsetHeight
                ).toFixed(2)}%`
                let botValue = `${(
                  (Math.round(
                    parseFloat(pStyle.height.replace('px')) -
                      parseFloat(pStyle.borderBottomWidth.replace('px')) -
                      parseFloat(pStyle.borderTopWidth.replace('px')) -
                      newOffY
                  ) *
                    100) /
                  wb.value.parentElement.offsetHeight
                ).toFixed(2)}px`
                wb.value.style.top = topValue
                wb.value.style.bottom = botValue
                break
              default:
                wb.value.style.top = newOffY + 'px'
                break
            }
          }
          listUpdate.push(...selected_list)
        } else {
          let pWbComponent = selected_list[0].value.closest(
            `.wbaseItem-value[iswini="true"]`
          )
          let cssItem = StyleDA.cssStyleSheets.find(
            e => e.GID === pWbComponent.id
          )
          for (let wb of selected_list) {
            let cssRule = StyleDA.docStyleSheets.find(e =>
              [...pWbComponent.querySelectorAll(e.selectorText)].includes(
                wb.value
              )
            )
            switch (wb.value.getAttribute('consty')) {
              case Constraints.bottom:
                cssRule.style.bottom = `${Math.round(
                  parseFloat(pStyle.height.replace('px')) -
                    parseFloat(pStyle.borderBottomWidth.replace('px')) -
                    parseFloat(pStyle.borderTopWidth.replace('px')) -
                    newOffY
                )}px`
                break
              case Constraints.top_bottom:
                cssRule.style.bottom = `${Math.round(
                  parseFloat(pStyle.height.replace('px')) -
                    parseFloat(pStyle.borderBottomWidth.replace('px')) -
                    parseFloat(pStyle.borderTopWidth.replace('px')) -
                    newOffY
                )}px`
                cssRule.style.top = newOffY + 'px'
                break
              case Constraints.center:
                let centerValue = `${
                  newOffY + (wb.value.offsetHeight - wb.value.offsetHeight) / 2
                }px`
                cssRule.style.top = `calc(50% + ${centerValue})`
                break
              case Constraints.scale:
                let topValue = `${(
                  (newOffY * 100) /
                  wb.value.parentElement.offsetHeight
                ).toFixed(2)}%`
                let botValue = `${(
                  (Math.round(
                    parseFloat(pStyle.height.replace('px')) -
                      parseFloat(pStyle.borderBottomWidth.replace('px')) -
                      parseFloat(pStyle.borderTopWidth.replace('px')) -
                      newOffY
                  ) *
                    100) /
                  wb.value.parentElement.offsetHeight
                ).toFixed(2)}px`
                cssRule.style.top = topValue
                cssRule.style.bottom = botValue
                break
              default:
                cssRule.style.top = newOffY + 'px'
                break
            }
            cssItem.Css = cssItem.Css.replace(
              new RegExp(`${cssRule.selectorText} {[^}]*}`, 'g'),
              cssRule.cssText
            )
          }
          StyleDA.editStyleSheet(cssItem)
        }
      }
      break
    case 'align bottom':
      if (is_edit_children) {
        for (let wb of selected_list) {
          let children = [
            ...wb.value.querySelectorAll(
              `.wbaseItem-value[level="${wb.Level + 1}"]`
            )
          ].filter(
            cWbHTML => window.getComputedStyle(cWbHTML).position === 'absolute'
          )
          if (wb.IsWini && wb.CateID !== EnumCate.variant) {
            let cssItem = StyleDA.cssStyleSheets.find(e => e.GID === wb.GID)
            for (let cWbHTML of children) {
              let cssRule = StyleDA.docStyleSheets.find(e =>
                [...wb.querySelectorAll(e.selectorText)].includes(cWbHTML)
              )
              switch (cWbHTML.getAttribute('consty')) {
                case Constraints.top_bottom:
                  cssRule.style.height = cWbHTML.offsetHeight + 'px'
                  break
                case Constraints.scale:
                  cssRule.style.height = cWbHTML.offsetHeight + 'px'
                  break
                default:
                  break
              }
              if (cWbHTML.getAttribute('constx') === Constraints.center) {
                cssRule.style.transform = 'translateX(-50%)'
              } else cssRule.style.transform = ''
              cssRule.style.top = ''
              cssRule.style.bottom = '0px'
              cWbHTML.setAttribute('consty', Constraints.bottom)
              cssItem.Css = cssItem.Css.replace(
                new RegExp(`${cssRule.selectorText} {[^}]*}`, 'g'),
                cssRule.cssText
              )
            }
            StyleDA.editStyleSheet(cssItem)
          } else {
            if (children.length > 0) {
              children = wbase_list.filter(e =>
                children.some(cWbHTML => e.GID === cWbHTML.id)
              )
              for (let cWb of children) {
                switch (cWb.value.getAttribute('consty')) {
                  case Constraints.top_bottom:
                    cWb.value.style.height = cWb.value.offsetHeight + 'px'
                    break
                  case Constraints.scale:
                    cWb.value.style.height = cWb.value.offsetHeight + 'px'
                    break
                  default:
                    break
                }
                if (cWb.value.getAttribute('constx') === Constraints.center) {
                  cWb.value.style.transform = 'translateX(-50%)'
                } else cWb.value.style.transform = ''
                cWb.value.style.top = ''
                cWb.value.style.bottom = '0px'
                cWb.value.setAttribute('consty', Constraints.bottom)
              }
              listUpdate.push(...children)
            }
          }
        }
      } else if (selected_list.length === 1) {
        if (selected_list[0].StyleItem) {
          switch (selected_list[0].value.getAttribute('consty')) {
            case Constraints.top_bottom:
              selected_list[0].value.style.height =
                selected_list[0].value.offsetHeight + 'px'
              break
            case Constraints.scale:
              selected_list[0].value.style.height =
                selected_list[0].value.offsetHeight + 'px'
              break
            default:
              break
          }
          if (
            selected_list[0].value.getAttribute('constx') === Constraints.center
          ) {
            selected_list[0].value.style.transform = 'translateX(-50%)'
          } else selected_list[0].value.style.transform = ''
          selected_list[0].value.style.top = ''
          selected_list[0].value.style.bottom = '0px'
          selected_list[0].value.setAttribute('consty', Constraints.bottom)
          listUpdate.push(...selected_list)
        } else {
          let pWbComponent = selected_list[0].value.closest(
            `.wbaseItem-value[iswini="true"]`
          )
          let cssItem = StyleDA.cssStyleSheets.find(
            e => e.GID === pWbComponent.id
          )
          let cssRule = StyleDA.docStyleSheets.find(e =>
            [...pWbComponent.querySelectorAll(e.selectorText)].includes(
              selected_list[0].value
            )
          )
          switch (selected_list[0].value.getAttribute('consty')) {
            case Constraints.top_bottom:
              cssRule.style.height = selected_list[0].value.offsetHeight + 'px'
              break
            case Constraints.scale:
              cssRule.style.height = selected_list[0].value.offsetHeight + 'px'
              break
            default:
              break
          }
          if (
            selected_list[0].value.getAttribute('constx') === Constraints.center
          ) {
            cssRule.style.transform = 'translateX(-50%)'
          } else cssRule.style.transform = ''
          cssRule.style.top = ''
          cssRule.style.bottom = '0px'
          selected_list[0].value.setAttribute('consty', Constraints.bottom)
          cssItem.Css = cssItem.Css.replace(
            new RegExp(`${cssRule.selectorText} {[^}]*}`, 'g'),
            cssRule.cssText
          )
          StyleDA.editStyleSheet(cssItem)
        }
      } else {
        let maxY = Math.max(
          ...selected_list.map(
            wb =>
              parseFloat(window.getComputedStyle(wb.value).top.replace('px')) +
              wb.value.offsetHeight
          )
        )
        let pStyle = window.getComputedStyle(
          selected_list[0].value.parentElement
        )
        if (selected_list[0].StyleItem) {
          for (let wb of selected_list) {
            switch (wb.value.getAttribute('consty')) {
              case Constraints.top:
                wb.value.style.top = `${Math.round(
                  maxY - wb.value.offsetHeight
                )}px`
                break
              case Constraints.top_bottom:
                wb.value.style.top = `${Math.round(
                  maxY - wb.value.offsetHeight
                )}px`
                wb.value.style.bottom = maxY + 'px'
                break
              case Constraints.center:
                let centerValue = `${
                  maxY -
                  wb.value.offsetHeight +
                  (wb.value.offsetHeight - wb.value.offsetHeight) / 2
                }px`
                wb.value.style.top = `calc(50% + ${centerValue})`
                break
              case Constraints.scale:
                let topValue = `${(
                  ((maxY - wb.value.offsetHeight) * 100) /
                  wb.value.parentElement.offsetHeight
                ).toFixed(2)}%`
                let botValue = `${(
                  (Math.round(
                    parseFloat(pStyle.height.replace('px')) -
                      parseFloat(pStyle.borderBottomWidth.replace('px')) -
                      parseFloat(pStyle.borderTopWidth.replace('px')) -
                      (maxY - wb.value.offsetHeight)
                  ) *
                    100) /
                  wb.value.parentElement.offsetHeight
                ).toFixed(2)}px`
                wb.value.style.top = topValue
                wb.value.style.bottom = botValue
                break
              default:
                wb.value.style.bottom = maxY + 'px'
                break
            }
          }
          listUpdate.push(...selected_list)
        } else {
          let pWbComponent = selected_list[0].value.closest(
            `.wbaseItem-value[iswini="true"]`
          )
          let cssItem = StyleDA.cssStyleSheets.find(
            e => e.GID === pWbComponent.id
          )
          for (let wb of selected_list) {
            let cssRule = StyleDA.docStyleSheets.find(e =>
              [...pWbComponent.querySelectorAll(e.selectorText)].includes(
                wb.value
              )
            )
            switch (wb.value.getAttribute('consty')) {
              case Constraints.top:
                cssRule.style.top = `${Math.round(
                  maxY - wb.value.offsetHeight
                )}px`
                break
              case Constraints.top_bottom:
                cssRule.style.top = `${Math.round(
                  maxY - wb.value.offsetHeight
                )}px`
                cssRule.style.bottom = maxY + 'px'
                break
              case Constraints.center:
                let centerValue = `${
                  maxY -
                  wb.value.offsetHeight +
                  (wb.value.offsetHeight - wb.value.offsetHeight) / 2
                }px`
                cssRule.style.top = `calc(50% + ${centerValue})`
                break
              case Constraints.scale:
                let topValue = `${(
                  ((maxY - wb.value.offsetHeight) * 100) /
                  wb.value.parentElement.offsetHeight
                ).toFixed(2)}%`
                let botValue = `${(
                  (Math.round(
                    parseFloat(pStyle.height.replace('px')) -
                      parseFloat(pStyle.borderBottomWidth.replace('px')) -
                      parseFloat(pStyle.borderTopWidth.replace('px')) -
                      (maxY - wb.value.offsetHeight)
                  ) *
                    100) /
                  wb.value.parentElement.offsetHeight
                ).toFixed(2)}px`
                cssRule.style.top = topValue
                cssRule.style.bottom = botValue
                break
              default:
                cssRule.style.bottom = maxY + 'px'
                break
            }
            cssItem.Css = cssItem.Css.replace(
              new RegExp(`${cssRule.selectorText} {[^}]*}`, 'g'),
              cssRule.cssText
            )
          }
          StyleDA.editStyleSheet(cssItem)
        }
      }
      break
    default:
      break
  }
  if (listUpdate.length) WBaseDA.edit(listUpdate, EnumObj.position)
  updateUISelectBox()
}

