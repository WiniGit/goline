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
              let cssRule = StyleDA.docStyleSheets.find(rule => {
                let selector = [
                  ...pWbComponent.querySelectorAll(rule.selectorText)
                ]
                let check = selector.includes(cWbHTML)
                if (check) {
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
                  selector.forEach(e =>
                    e.setAttribute('constx', Constraints.left)
                  )
                }
                return check
              })
              if (cWbHTML.getAttribute('consty') === Constraints.center) {
                cssRule.style.transform = 'translateY(-50%)'
              } else cssRule.style.transform = null
              cssRule.style.left = '0px'
              cssRule.style.right = null
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
                } else cWb.value.style.transform = null
                cWb.value.style.left = '0px'
                cWb.value.style.right = null
                cWb.value.setAttribute('constx', Constraints.left)
                cWb.StyleItem.PositionItem.Left = '0px'
                cWb.StyleItem.PositionItem.ConstraintsX = Constraints.left
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
          } else selected_list[0].value.style.transform = null
          selected_list[0].value.style.left = '0px'
          selected_list[0].value.style.right = null
          selected_list[0].value.setAttribute('constx', Constraints.left)
          selected_list[0].StyleItem.PositionItem.Left = '0px'
          selected_list[0].StyleItem.PositionItem.ConstraintsX =
            Constraints.left
          listUpdate.push(...selected_list)
        } else {
          let pWbComponent = selected_list[0].value.closest(
            `.wbaseItem-value[iswini="true"]`
          )
          let cssItem = StyleDA.cssStyleSheets.find(
            e => e.GID === pWbComponent.id
          )
          let cssRule = StyleDA.docStyleSheets.find(rule => {
            let selector = [...pWbComponent.querySelectorAll(rule.selectorText)]
            let check = selector.includes(selected_list[0].value)
            if (check) {
              switch (selected_list[0].value.getAttribute('constx')) {
                case Constraints.left_right:
                  cssRule.style.width =
                    selected_list[0].value.offsetWidth + 'px'
                  break
                case Constraints.scale:
                  cssRule.style.width =
                    selected_list[0].value.offsetWidth + 'px'
                  break
                default:
                  break
              }
              selector.forEach(e => e.setAttribute('constx', Constraints.left))
            }
            return check
          })
          if (
            selected_list[0].value.getAttribute('consty') === Constraints.center
          ) {
            cssRule.style.transform = 'translateY(-50%)'
          } else cssRule.style.transform = null
          cssRule.style.left = '0px'
          cssRule.style.right = null
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
                wb.StyleItem.PositionItem.Right = wb.value.style.right
                break
              case Constraints.left_right:
                wb.value.style.right = `${Math.round(
                  parseFloat(pStyle.width.replace('px')) -
                    parseFloat(pStyle.borderRightWidth.replace('px')) -
                    parseFloat(pStyle.borderLeftWidth.replace('px')) -
                    minX
                )}px`
                wb.value.style.left = minX + 'px'
                wb.StyleItem.PositionItem.Left = wb.value.style.left
                wb.StyleItem.PositionItem.Right = wb.value.style.right
                break
              case Constraints.center:
                let centerValue = `${
                  minX +
                  (wb.value.offsetWidth - wb.value.parentElement.offsetWidth) /
                    2
                }px`
                wb.value.style.left = `calc(50% + ${centerValue})`
                wb.StyleItem.PositionItem.Right = centerValue
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
                      minX -
                      wb.value.offsetWidth
                  ) *
                    100) /
                  wb.value.parentElement.offsetWidth
                ).toFixed(2)}%`
                wb.value.style.left = leftValue
                wb.value.style.right = rightValue
                wb.StyleItem.PositionItem.Left = leftValue
                wb.StyleItem.PositionItem.Right = rightValue
                break
              default:
                wb.value.style.left = minX + 'px'
                wb.StyleItem.PositionItem.Left = minX + 'px'
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
                    minX -
                    wb.value.offsetWidth
                )}px`
                break
              case Constraints.left_right:
                cssRule.style.right = `${Math.round(
                  parseFloat(pStyle.width.replace('px')) -
                    parseFloat(pStyle.borderRightWidth.replace('px')) -
                    parseFloat(pStyle.borderLeftWidth.replace('px')) -
                    minX -
                    wb.value.offsetWidth
                )}px`
                cssRule.style.left = minX + 'px'
                break
              case Constraints.center:
                let centerValue = `${
                  minX +
                  (wb.value.offsetWidth - wb.value.parentElement.offsetWidth) /
                    2
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
                      minX -
                      wb.value.offsetWidth
                  ) *
                    100) /
                  wb.value.parentElement.offsetWidth
                ).toFixed(2)}%`
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
              let cssRule = StyleDA.docStyleSheets.find(rule => {
                let selector = [
                  ...pWbComponent.querySelectorAll(rule.selectorText)
                ]
                let check = selector.includes(cWbHTML)
                if (check) {
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
                  selector.forEach(e =>
                    e.setAttribute('constx', Constraints.center)
                  )
                }
                return check
              })
              if (cWbHTML.getAttribute('consty') === Constraints.center) {
                cssRule.style.transform = 'translate(-50%,-50%)'
              } else cssRule.style.transform = 'translateX(-50%)'
              cssRule.style.left = `calc(50% + 0px)`
              cssRule.style.right = null
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
                cWb.value.style.right = null
                cWb.value.setAttribute('constx', Constraints.center)
                cWb.StyleItem.PositionItem.Right = '0px'
                cWb.StyleItem.PositionItem.ConstraintsX = Constraints.center
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
          selected_list[0].value.style.right = null
          selected_list[0].value.setAttribute('constx', Constraints.center)
          selected_list[0].StyleItem.PositionItem.Right = '0px'
          selected_list[0].StyleItem.PositionItem.ConstraintsX =
            Constraints.center
          listUpdate.push(...selected_list)
        } else {
          let pWbComponent = selected_list[0].value.closest(
            `.wbaseItem-value[iswini="true"]`
          )
          let cssItem = StyleDA.cssStyleSheets.find(
            e => e.GID === pWbComponent.id
          )
          let cssRule = StyleDA.docStyleSheets.find(rule => {
            let selector = [...pWbComponent.querySelectorAll(rule.selectorText)]
            let check = selector.includes(selected_list[0].value)
            if (check) {
              switch (selected_list[0].value.getAttribute('constx')) {
                case Constraints.left_right:
                  cssRule.style.width =
                    selected_list[0].value.offsetWidth + 'px'
                  break
                case Constraints.scale:
                  cssRule.style.width =
                    selected_list[0].value.offsetWidth + 'px'
                  break
                default:
                  break
              }
              selector.forEach(e =>
                e.setAttribute('constx', Constraints.center)
              )
            }
            return check
          })
          if (
            selected_list[0].value.getAttribute('consty') === Constraints.center
          ) {
            cssRule.style.transform = 'translate(-50%,-50%)'
          } else cssRule.style.transform = 'translateX(-50%)'
          cssRule.style.left = 'calc(50% + 0px)'
          cssRule.style.right = null
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
                    newOffX -
                    wb.value.offsetWidth
                )}px`
                wb.StyleItem.PositionItem.Right = wb.value.style.right
                break
              case Constraints.left_right:
                wb.value.style.right = `${Math.round(
                  parseFloat(pStyle.width.replace('px')) -
                    parseFloat(pStyle.borderRightWidth.replace('px')) -
                    parseFloat(pStyle.borderLeftWidth.replace('px')) -
                    newOffX -
                    wb.value.offsetWidth
                )}px`
                wb.value.style.left = newOffX + 'px'
                wb.StyleItem.PositionItem.Left = wb.value.style.left
                wb.StyleItem.PositionItem.Right = wb.value.style.right
                break
              case Constraints.center:
                let centerValue = `${
                  newOffX +
                  (wb.value.offsetWidth - wb.value.parentElement.offsetWidth) /
                    2
                }px`
                wb.value.style.left = `calc(50% + ${centerValue})`
                wb.StyleItem.PositionItem.Right = centerValue
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
                      newOffX -
                      wb.value.offsetWidth
                  ) *
                    100) /
                  wb.value.parentElement.offsetWidth
                ).toFixed(2)}%`
                wb.value.style.left = leftValue
                wb.value.style.right = rightValue
                wb.StyleItem.PositionItem.Left = leftValue
                wb.StyleItem.PositionItem.Right = rightValue
                break
              default:
                wb.value.style.left = newOffX + 'px'
                wb.StyleItem.PositionItem.Left = newOffX + 'px'
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
                    newOffX -
                    wb.value.offsetWidth
                )}px`
                break
              case Constraints.left_right:
                cssRule.style.right = `${Math.round(
                  parseFloat(pStyle.width.replace('px')) -
                    parseFloat(pStyle.borderRightWidth.replace('px')) -
                    parseFloat(pStyle.borderLeftWidth.replace('px')) -
                    newOffX -
                    wb.value.offsetWidth
                )}px`
                cssRule.style.left = newOffX + 'px'
                break
              case Constraints.center:
                let centerValue = `${
                  newOffX +
                  (wb.value.offsetWidth - wb.value.parentElement.offsetWidth) /
                    2
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
                      newOffX -
                      wb.value.offsetWidth
                  ) *
                    100) /
                  wb.value.parentElement.offsetWidth
                ).toFixed(2)}%`
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
              let cssRule = StyleDA.docStyleSheets.find(rule => {
                let selector = [
                  ...pWbComponent.querySelectorAll(rule.selectorText)
                ]
                let check = selector.includes(cWbHTML)
                if (check) {
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
                  selector.forEach(e =>
                    e.setAttribute('constx', Constraints.right)
                  )
                }
                return check
              })

              if (cWbHTML.getAttribute('consty') === Constraints.center) {
                cssRule.style.transform = 'translateY(-50%)'
              } else cssRule.style.transform = null
              cssRule.style.left = ''
              cssRule.style.right = '0px'
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
                } else cWb.value.style.transform = null
                cWb.value.style.left = ''
                cWb.value.style.right = '0px'
                cWb.value.setAttribute('constx', Constraints.right)
                cWb.StyleItem.PositionItem.Right = '0px'
                cWb.StyleItem.PositionItem.ConstraintsX = Constraints.right
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
          } else selected_list[0].value.style.transform = null
          selected_list[0].value.style.left = ''
          selected_list[0].value.style.right = '0px'
          selected_list[0].value.setAttribute('constx', Constraints.right)
          selected_list[0].StyleItem.PositionItem.Right = '0px'
          selected_list[0].StyleItem.PositionItem.ConstraintsX =
            Constraints.right
          listUpdate.push(...selected_list)
        } else {
          let pWbComponent = selected_list[0].value.closest(
            `.wbaseItem-value[iswini="true"]`
          )
          let cssItem = StyleDA.cssStyleSheets.find(
            e => e.GID === pWbComponent.id
          )
          let cssRule = StyleDA.docStyleSheets.find(rule => {
            let selector = [...pWbComponent.querySelectorAll(rule.selectorText)]
            let check = selector.includes(selected_list[0].value)
            if (check) {
              switch (selected_list[0].value.getAttribute('constx')) {
                case Constraints.left_right:
                  cssRule.style.width =
                    selected_list[0].value.offsetWidth + 'px'
                  break
                case Constraints.scale:
                  cssRule.style.width =
                    selected_list[0].value.offsetWidth + 'px'
                  break
                default:
                  break
              }
              selector.forEach(e => e.setAttribute('constx', Constraints.right))
            }
            return check
          })
          if (
            selected_list[0].value.getAttribute('consty') === Constraints.center
          ) {
            cssRule.style.transform = 'translateY(-50%)'
          } else cssRule.style.transform = null
          cssRule.style.left = ''
          cssRule.style.right = '0px'
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
                wb.StyleItem.PositionItem.Left = wb.value.style.left
                break
              case Constraints.left_right:
                wb.value.style.left = `${Math.round(
                  maxX - wb.value.offsetWidth
                )}px`
                wb.value.style.right = maxX + 'px'
                wb.StyleItem.PositionItem.Left = wb.value.style.left
                wb.StyleItem.PositionItem.Right = wb.value.style.right
                break
              case Constraints.center:
                let centerValue = `${
                  maxX -
                  wb.value.offsetWidth +
                  (wb.value.offsetWidth - wb.value.parentElement.offsetWidth) /
                    2
                }px`
                wb.value.style.left = `calc(50% + ${centerValue})`
                wb.StyleItem.PositionItem.Right = centerValue
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
                ).toFixed(2)}%`
                wb.value.style.left = leftValue
                wb.value.style.right = rightValue
                wb.StyleItem.PositionItem.Left = leftValue
                wb.StyleItem.PositionItem.Right = rightValue
                break
              default:
                wb.value.style.right = maxX + 'px'
                wb.StyleItem.PositionItem.Right = maxX + 'px'
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
                  (wb.value.offsetWidth - wb.value.parentElement.offsetWidth) /
                    2
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
                ).toFixed(2)}%`
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
              let cssRule = StyleDA.docStyleSheets.find(rule => {
                let selector = [
                  ...pWbComponent.querySelectorAll(rule.selectorText)
                ]
                let check = selector.includes(cWbHTML)
                if (check) {
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
                  selector.forEach(e =>
                    e.setAttribute('consty', Constraints.top)
                  )
                }
                return check
              })
              if (cWbHTML.getAttribute('constx') === Constraints.center) {
                cssRule.style.transform = 'translateX(-50%)'
              } else cssRule.style.transform = null
              cssRule.style.top = '0px'
              cssRule.style.bottom = ''
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
                } else cWb.value.style.transform = null
                cWb.value.style.top = '0px'
                cWb.value.style.bottom = ''
                cWb.value.setAttribute('consty', Constraints.top)
                cWb.StyleItem.PositionItem.Top = '0px'
                cWb.StyleItem.PositionItem.ConstraintsY = Constraints.top
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
          } else selected_list[0].value.style.transform = null
          selected_list[0].value.style.top = '0px'
          selected_list[0].value.style.bottom = ''
          selected_list[0].value.setAttribute('consty', Constraints.top)
          selected_list[0].StyleItem.PositionItem.Top = '0px'
          selected_list[0].StyleItem.PositionItem.ConstraintsY = Constraints.top
          listUpdate.push(...selected_list)
        } else {
          let pWbComponent = selected_list[0].value.closest(
            `.wbaseItem-value[iswini="true"]`
          )
          let cssItem = StyleDA.cssStyleSheets.find(
            e => e.GID === pWbComponent.id
          )
          let cssRule = StyleDA.docStyleSheets.find(rule => {
            let selector = [...pWbComponent.querySelectorAll(rule.selectorText)]
            let check = selector.includes(selected_list[0].value)
            if (check) {
              switch (selected_list[0].value.getAttribute('consty')) {
                case Constraints.top_bottom:
                  cssRule.style.height =
                    selected_list[0].value.offsetHeight + 'px'
                  break
                case Constraints.scale:
                  cssRule.style.height =
                    selected_list[0].value.offsetHeight + 'px'
                  break
                default:
                  break
              }
              selector.forEach(e => e.setAttribute('consty', Constraints.top))
            }
            return check
          })
          if (
            selected_list[0].value.getAttribute('constx') === Constraints.center
          ) {
            cssRule.style.transform = 'translateX(-50%)'
          } else cssRule.style.transform = null
          cssRule.style.top = '0px'
          cssRule.style.bottom = ''
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
                    minY -
                    wb.value.offsetHeight
                )}px`
                wb.StyleItem.PositionItem.Bottom = wb.value.style.bottom
                break
              case Constraints.top_bottom:
                wb.value.style.bottom = `${Math.round(
                  parseFloat(pStyle.height.replace('px')) -
                    parseFloat(pStyle.borderBottomWidth.replace('px')) -
                    parseFloat(pStyle.borderTopWidth.replace('px')) -
                    minY -
                    wb.value.offsetHeight
                )}px`
                wb.value.style.top = minY + 'px'
                wb.StyleItem.PositionItem.Top = wb.value.style.top
                wb.StyleItem.PositionItem.Bottom = wb.value.style.bottom
                break
              case Constraints.center:
                let centerValue = `${
                  minY +
                  (wb.value.offsetHeight -
                    wb.value.parentElement.offsetHeight) /
                    2
                }px`
                wb.value.style.top = `calc(50% + ${centerValue})`
                wb.StyleItem.PositionItem.Bottom = centerValue
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
                      minY -
                      wb.value.offsetHeight
                  ) *
                    100) /
                  wb.value.parentElement.offsetHeight
                ).toFixed(2)}%`
                wb.value.style.top = topValue
                wb.value.style.bottom = botValue
                wb.StyleItem.PositionItem.Top = topValue
                wb.StyleItem.PositionItem.Bottom = botValue
                break
              default:
                wb.value.style.top = minY + 'px'
                wb.StyleItem.PositionItem.Top = minY + 'px'
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
                    minY -
                    wb.value.offsetHeight
                )}px`
                break
              case Constraints.top_bottom:
                cssRule.style.bottom = `${Math.round(
                  parseFloat(pStyle.height.replace('px')) -
                    parseFloat(pStyle.borderBottomWidth.replace('px')) -
                    parseFloat(pStyle.borderRightWidth.replace('px')) -
                    minY -
                    wb.value.offsetHeight
                )}px`
                cssRule.style.top = minY + 'px'
                break
              case Constraints.center:
                let centerValue = `${
                  minY +
                  (wb.value.offsetHeight -
                    wb.value.parentElement.offsetHeight) /
                    2
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
                      minY -
                      wb.value.offsetHeight
                  ) *
                    100) /
                  wb.value.parentElement.offsetHeight
                ).toFixed(2)}%`
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
              let cssRule = StyleDA.docStyleSheets.find(rule => {
                let selector = [
                  ...pWbComponent.querySelectorAll(rule.selectorText)
                ]
                let check = selector.includes(cWbHTML)
                if (check) {
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
                  selector.forEach(e =>
                    e.setAttribute('consty', Constraints.center)
                  )
                }
                return check
              })
              if (cWbHTML.getAttribute('constx') === Constraints.center) {
                cssRule.style.transform = 'translate(-50%,-50%)'
              } else cssRule.style.transform = 'translateY(-50%)'
              cssRule.style.top = `calc(50% + 0px)`
              cssRule.style.bottom = ''
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
                cWb.StyleItem.PositionItem.Right = '0px'
                cWb.StyleItem.PositionItem.ConstraintsY = Constraints.center
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
          selected_list[0].StyleItem.PositionItem.Bottom = '0px'
          selected_list[0].StyleItem.PositionItem.ConstraintsY =
            Constraints.center
          listUpdate.push(...selected_list)
        } else {
          let pWbComponent = selected_list[0].value.closest(
            `.wbaseItem-value[iswini="true"]`
          )
          let cssItem = StyleDA.cssStyleSheets.find(
            e => e.GID === pWbComponent.id
          )
          let cssRule = StyleDA.docStyleSheets.find(rule => {
            let selector = [...pWbComponent.querySelectorAll(rule.selectorText)]
            let check = selector.includes(selected_list[0].value)
            if (check) {
              switch (selected_list[0].value.getAttribute('consty')) {
                case Constraints.top_bottom:
                  cssRule.style.height =
                    selected_list[0].value.offsetHeight + 'px'
                  break
                case Constraints.scale:
                  cssRule.style.height =
                    selected_list[0].value.offsetHeight + 'px'
                  break
                default:
                  break
              }
              selector.forEach(e =>
                e.setAttribute('consty', Constraints.center)
              )
            }
            return check
          })
          if (
            selected_list[0].value.getAttribute('constx') === Constraints.center
          ) {
            cssRule.style.transform = 'translate(-50%,-50%)'
          } else cssRule.style.transform = 'translateY(-50%)'
          cssRule.style.top = 'calc(50% + 0px)'
          cssRule.style.bottom = ''
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
                wb.StyleItem.PositionItem.Bottom = wb.value.style.bottom
                break
              case Constraints.top_bottom:
                wb.value.style.bottom = `${Math.round(
                  parseFloat(pStyle.height.replace('px')) -
                    parseFloat(pStyle.borderBottomWidth.replace('px')) -
                    parseFloat(pStyle.borderTopWidth.replace('px')) -
                    newOffY
                )}px`
                wb.value.style.top = newOffY + 'px'
                wb.StyleItem.PositionItem.Top = wb.value.style.top
                wb.StyleItem.PositionItem.Bottom = wb.value.style.bottom
                break
              case Constraints.center:
                let centerValue = `${
                  newOffY +
                  (wb.value.offsetHeight -
                    wb.value.parentElement.offsetHeight) /
                    2
                }px`
                wb.value.style.top = `calc(50% + ${centerValue})`
                wb.StyleItem.PositionItem.Bottom = wb.value.style.centerValue
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
                      newOffY -
                      wb.value.offsetHeight
                  ) *
                    100) /
                  wb.value.parentElement.offsetHeight
                ).toFixed(2)}%`
                wb.value.style.top = topValue
                wb.value.style.bottom = botValue
                wb.StyleItem.PositionItem.Top = topValue
                wb.StyleItem.PositionItem.Bottom = botValue
                break
              default:
                wb.value.style.top = newOffY + 'px'
                wb.StyleItem.PositionItem.Top = newOffY + 'px'
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
                  newOffY +
                  (wb.value.offsetHeight -
                    wb.value.parentElement.offsetHeight) /
                    2
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
                      newOffY -
                      wb.value.offsetHeight
                  ) *
                    100) /
                  wb.value.parentElement.offsetHeight
                ).toFixed(2)}%`
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
              let cssRule = StyleDA.docStyleSheets.find(rule => {
                let selector = [
                  ...pWbComponent.querySelectorAll(rule.selectorText)
                ]
                let check = selector.includes(cWbHTML)
                if (check) {
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
                  selector.forEach(e =>
                    e.setAttribute('consty', Constraints.bottom)
                  )
                }
                return check
              })
              if (cWbHTML.getAttribute('constx') === Constraints.center) {
                cssRule.style.transform = 'translateX(-50%)'
              } else cssRule.style.transform = null
              cssRule.style.top = ''
              cssRule.style.bottom = '0px'
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
                } else cWb.value.style.transform = null
                cWb.value.style.top = ''
                cWb.value.style.bottom = '0px'
                cWb.value.setAttribute('consty', Constraints.bottom)
                wb.StyleItem.PositionItem.Bottom = botValue
                wb.StyleItem.PositionItem.ConstraintsY = Constraints.bottom
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
          } else selected_list[0].value.style.transform = null
          selected_list[0].value.style.top = ''
          selected_list[0].value.style.bottom = '0px'
          selected_list[0].value.setAttribute('consty', Constraints.bottom)
          selected_list[0].StyleItem.PositionItem.Bottom = botValue
          selected_list[0].StyleItem.PositionItem.ConstraintsY =
            Constraints.bottom
          listUpdate.push(...selected_list)
        } else {
          let pWbComponent = selected_list[0].value.closest(
            `.wbaseItem-value[iswini="true"]`
          )
          let cssItem = StyleDA.cssStyleSheets.find(
            e => e.GID === pWbComponent.id
          )
          let cssRule = StyleDA.docStyleSheets.find(rule => {
            let selector = [...pWbComponent.querySelectorAll(rule.selectorText)]
            let check = selector.includes(selected_list[0].value)
            if (check) {
              switch (selected_list[0].value.getAttribute('consty')) {
                case Constraints.top_bottom:
                  cssRule.style.height =
                    selected_list[0].value.offsetHeight + 'px'
                  break
                case Constraints.scale:
                  cssRule.style.height =
                    selected_list[0].value.offsetHeight + 'px'
                  break
                default:
                  break
              }
              selector.forEach(e =>
                e.setAttribute('consty', Constraints.bottom)
              )
            }
            return check
          })
          if (
            selected_list[0].value.getAttribute('constx') === Constraints.center
          ) {
            cssRule.style.transform = 'translateX(-50%)'
          } else cssRule.style.transform = null
          cssRule.style.top = ''
          cssRule.style.bottom = '0px'
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
                wb.StyleItem.PositionItem.Top = wb.value.style.top
                break
              case Constraints.top_bottom:
                wb.value.style.top = `${Math.round(
                  maxY - wb.value.offsetHeight
                )}px`
                wb.value.style.bottom = maxY + 'px'
                wb.StyleItem.PositionItem.Top = wb.value.style.top
                wb.StyleItem.PositionItem.Bottom = wb.value.style.bottom
                break
              case Constraints.center:
                let centerValue = `${
                  maxY -
                  wb.value.offsetHeight +
                  (wb.value.offsetHeight -
                    wb.value.parentElement.offsetHeight) /
                    2
                }px`
                wb.value.style.top = `calc(50% + ${centerValue})`
                wb.StyleItem.PositionItem.Bottom = centerValue
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
                ).toFixed(2)}%`
                wb.value.style.top = topValue
                wb.value.style.bottom = botValue
                wb.StyleItem.PositionItem.Top = topValue
                wb.StyleItem.PositionItem.Bottom = botValue
                break
              default:
                wb.value.style.bottom = maxY + 'px'
                wb.StyleItem.PositionItem.Bottom = maxY + 'px'
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
                  (wb.value.offsetHeight -
                    wb.value.parentElement.offsetHeight) /
                    2
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
                ).toFixed(2)}%`
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

function handleEditOffset ({
  width,
  height,
  x,
  y,
  radius,
  radiusTL,
  radiusTR,
  radiusBL,
  radiusBR,
  fixPosition,
  ratioWH = false
}) {
  let listUpdate = []
  if ((width !== undefined && height !== undefined) || ratioWH) {
    if (selected_list[0].StyleItem) {
      for (let wb of selected_list) {
        let children = [
          ...wb.value.querySelectorAll(
            `.wbaseItem-value[level="${wb.Level + 1}"]`
          )
        ]
        if (ratioWH) {
          if (width !== undefined) {
            height = (width * wb.value.offsetHeight) / wb.value.offsetWidth
          } else {
            width = (height * wb.value.offsetWidth) / wb.value.offsetHeight
          }
        }
        if (width === null) {
          if (wb.value.classList.contains('w-row')) {
            children = children.filter(
              e => e.getAttribute('width-type') === 'fill'
            )
          } else if (
            children.every(e => e.getAttribute('width-type') === 'fill')
          ) {
            children = children
              .sort((a, b) => a.offsetWidth - b.offsetWidth)
              .slice(0, 1)
          } else {
            children = []
          }
          if (children.length > 0) {
            if (wb.IsWini && wb.CateID !== EnumCate.variant) {
              let cssItem = StyleDA.cssStyleSheets.find(e => e.GID === wb.GID)
              for (let cWbHTML of children) {
                let cssRule = StyleDA.docStyleSheets.find(rule => {
                  let selector = [
                    ...wb.value.querySelectorAll(rule.selectorText)
                  ]
                  let check = selector.includes(cWbHTML)
                  if (check) {
                    rule.style.width = cWbHTML.offsetWidth + 'px'
                    selector.forEach(e => e.removeAttribute('width-type'))
                  }
                  return check
                })
                cssItem.Css = cssItem.Css.replace(
                  new RegExp(`${cssRule.selectorText} {[^}]*}`, 'g'),
                  cssRule.cssText
                )
              }
              StyleDA.editStyleSheet(cssItem)
            } else {
              children = wbase_list.filter(wb =>
                children.some(wbHTML => wb.GID === wbHTML)
              )
              for (let cWb of children) {
                cWb.StyleItem.FrameItem.Width = cWb.value.offsetWidth
                cWb.value.style.width = cWb.value.offsetWidth + 'px'
                cWb.value.removeAttribute('width-type')
              }
              listUpdate.push(...children)
            }
          }
          wb.StyleItem.FrameItem.Width = null
          wb.value.style.width = null
          wb.value.setAttribute('width-type', 'fit')
        } else if (width < 0) {
          wb.StyleItem.FrameItem.Width = width
          wb.value.style.width = '100%'
          wb.value.setAttribute('width-type', 'fill')
        } else {
          wb.StyleItem.FrameItem.Width = width
          wb.value.style.width = width + 'px'
          wb.value.removeAttribute('width-type')
        }
        if (height === null) {
          if (wb.value.classList.contains('w-col')) {
            children = children.filter(
              e => e.getAttribute('height-type') === 'fill'
            )
          } else if (
            children.every(e => e.getAttribute('height-type') === 'fill')
          ) {
            children = children
              .sort((a, b) => (a.offsetHeight = b.offsetHeight))
              .slice(0, 1)
          } else {
            children = []
          }
          if (children.length > 0) {
            if (wb.IsWini && wb.CateID !== EnumCate.variant) {
              let cssItem = StyleDA.cssStyleSheets.find(e => e.GID === wb.GID)
              for (let cWbHTML of children) {
                let cssRule = StyleDA.docStyleSheets.find(rule => {
                  let selector = [
                    ...wb.value.querySelectorAll(rule.selectorText)
                  ]
                  let check = selector.includes(cWbHTML)
                  if (check) {
                    rule.style.height = cWbHTML.offsetHeight + 'px'
                    selector.forEach(e => e.removeAttribute('height-type'))
                  }
                  return check
                })
                cssItem.Css = cssItem.Css.replace(
                  new RegExp(`${cssRule.selectorText} {[^}]*}`, 'g'),
                  cssRule.cssText
                )
              }
              StyleDA.editStyleSheet(cssItem)
            } else {
              children = wbase_list.filter(wb =>
                children.some(wbHTML => wb.GID === wbHTML)
              )
              for (let cWb of children) {
                cWb.StyleItem.FrameItem.Height = cWb.value.offsetHeight
                cWb.value.style.height = cWb.value.offsetHeight + 'px'
                cWb.value.removeAttribute('height-type')
              }
              listUpdate.push(...children)
            }
          }
          wb.StyleItem.FrameItem.Height = null
          wb.value.style.height = null
          wb.value.setAttribute('height-type', 'fit')
        } else if (height < 0) {
          wb.StyleItem.FrameItem.Height = height
          wb.value.style.height = '100%'
          wb.value.setAttribute('height-type', 'fill')
        } else {
          wb.StyleItem.FrameItem.Height = height
          wb.value.style.height = height + 'px'
          wb.value.removeAttribute('height-type')
        }
      }
      listUpdate.push(...selected_list)
      WBaseDA.edit(listUpdate, EnumObj.frame)
    } else {
      let pWbComponent = selected_list[0].value.closest(
        `.wbaseItem-value[iswini="true"]`
      )
      let cssItem = StyleDA.cssStyleSheets.find(e => e.GID === pWbComponent.id)
      for (let wb of selected_list) {
        let cssRule = StyleDA.docStyleSheets.find(rule => {
          let selector = [...pWbComponent.querySelectorAll(rule.selectorText)]
          let check = selector.includes(wb.value)
          if (check)
            selector.forEach(e => {
              if (e !== wb.value) {
                if (width === null) e.setAttribute('width-type', 'fit')
                else if (width < 0) e.setAttribute('width-type', 'fill')
                else e.removeAttribute('width-type')
                //
                if (height === null) e.setAttribute('height-type', 'fit')
                else if (height < 0) e.setAttribute('height-type', 'fill')
                else e.removeAttribute('height-type')
              }
            })
          return check
        })
        let children = [
          ...wb.value.querySelectorAll(
            `.wbaseItem-value[level="${wb.Level + 1}"]`
          )
        ]
        if (width === null) {
          if (wb.value.classList.contains('w-row')) {
            children = children.filter(
              e => e.getAttribute('width-type') === 'fill'
            )
          } else if (
            children.every(e => e.getAttribute('width-type') === 'fill')
          ) {
            children = children
              .sort((a, b) => (a.offsetWidth = b.offsetWidth))
              .slice(0, 1)
          } else {
            children = []
          }
          if (children.length > 0) {
            for (let cWbHTML of children) {
              let cCssRule = StyleDA.docStyleSheets.find(rule => {
                let selector = [...wb.value.querySelectorAll(rule.selectorText)]
                let check = selector.includes(cWbHTML)
                if (check) {
                  rule.style.width = cWbHTML.offsetWidth + 'px'
                  selector.forEach(e => e.removeAttribute('width-type'))
                }
                return check
              })
              cssItem.Css = cssItem.Css.replace(
                new RegExp(`${cCssRule.selectorText} {[^}]*}`, 'g'),
                cCssRule.cssText
              )
            }
          }
          cssRule.style.width = null
          wb.value.setAttribute('width-type', 'fit')
        } else if (width < 0) {
          cssRule.style.width = '100%'
          wb.value.setAttribute('width-type', 'fill')
        } else {
          cssRule.style.width = width + 'px'
          wb.value.removeAttribute('width-type')
        }
        if (height === null) {
          if (wb.value.classList.contains('w-col')) {
            children = children.filter(
              e => e.getAttribute('height-type') === 'fill'
            )
          } else if (
            children.every(e => e.getAttribute('height-type') === 'fill')
          ) {
            children = children
              .sort((a, b) => a.offsetHeight - b.offsetHeight)
              .slice(0, 1)
          } else {
            children = []
          }
          if (children.length > 0) {
            for (let cWbHTML of children) {
              let cCssRule = StyleDA.docStyleSheets.find(rule => {
                let selector = [...wb.value.querySelectorAll(rule.selectorText)]
                let check = selector.includes(cWbHTML)
                if (check) {
                  rule.style.height = cWbHTML.offsetHeight + 'px'
                  selector.forEach(e => e.removeAttribute('height-type'))
                }
                return check
              })
              cssItem.Css = cssItem.Css.replace(
                new RegExp(`${cCssRule.selectorText} {[^}]*}`, 'g'),
                cCssRule.cssText
              )
            }
          }
          cssRule.style.height = null
          wb.value.setAttribute('height-type', 'fit')
        } else if (height < 0) {
          cssRule.style.height = '100%'
          wb.value.setAttribute('height-type', 'fill')
        } else {
          cssRule.style.height = height + 'px'
          wb.value.removeAttribute('height-type')
        }
        cssItem.Css = cssItem.Css.replace(
          new RegExp(`${cssRule.selectorText} {[^}]*}`, 'g'),
          cssRule.cssText
        )
        StyleDA.editStyleSheet(cssItem)
      }
    }
  } else if (width !== undefined) {
    if (selected_list[0].StyleItem) {
      for (let wb of selected_list) {
        let children = [
          ...wb.value.querySelectorAll(
            `.wbaseItem-value[level="${wb.Level + 1}"]`
          )
        ]
        if (width === null) {
          if (wb.value.classList.contains('w-row')) {
            children = children.filter(
              e => e.getAttribute('width-type') === 'fill'
            )
          } else if (
            children.every(e => e.getAttribute('width-type') === 'fill')
          ) {
            children = children
              .sort((a, b) => a.offsetWidth - b.offsetWidth)
              .slice(0, 1)
          } else {
            children = []
          }
          if (children.length > 0) {
            if (wb.IsWini && wb.CateID !== EnumCate.variant) {
              let cssItem = StyleDA.cssStyleSheets.find(e => e.GID === wb.GID)
              for (let cWbHTML of children) {
                let cssRule = StyleDA.docStyleSheets.find(rule => {
                  let selector = [
                    ...wb.value.querySelectorAll(rule.selectorText)
                  ]
                  let check = selector.includes(cWbHTML)
                  if (check) {
                    rule.style.width = cWbHTML.offsetWidth + 'px'
                    selector.forEach(e => e.removeAttribute('width-type'))
                  }
                  return check
                })
                cssItem.Css = cssItem.Css.replace(
                  new RegExp(`${cssRule.selectorText} {[^}]*}`, 'g'),
                  cssRule.cssText
                )
              }
              StyleDA.editStyleSheet(cssItem)
            } else {
              children = wbase_list.filter(wb =>
                children.some(wbHTML => wb.GID === wbHTML)
              )
              for (let cWb of children) {
                cWb.StyleItem.FrameItem.Width = cWb.value.offsetWidth
                cWb.value.style.width = cWb.value.offsetWidth + 'px'
                cWb.value.removeAttribute('width-type')
              }
              listUpdate.push(...children)
            }
          }
          wb.StyleItem.FrameItem.Width = null
          wb.value.style.width = null
          wb.value.setAttribute('width-type', 'fit')
        } else if (width < 0) {
          wb.StyleItem.FrameItem.Width = width
          wb.value.style.width = '100%'
          wb.value.setAttribute('width-type', 'fill')
        } else {
          wb.StyleItem.FrameItem.Width = width
          wb.value.style.width = width + 'px'
          wb.value.removeAttribute('width-type')
        }
      }
      listUpdate.push(...selected_list)
      WBaseDA.edit(listUpdate, EnumObj.frame)
    } else {
      let pWbComponent = selected_list[0].value.closest(
        `.wbaseItem-value[iswini="true"]`
      )
      let cssItem = StyleDA.cssStyleSheets.find(e => e.GID === pWbComponent.id)
      for (let wb of selected_list) {
        let cssRule = StyleDA.docStyleSheets.find(rule => {
          let selector = [...pWbComponent.querySelectorAll(rule.selectorText)]
          let check = selector.includes(wb.value)
          if (check)
            selector.forEach(e => {
              if (e !== wb.value) {
                if (width === null) e.setAttribute('width-type', 'fit')
                else if (width < 0) e.setAttribute('width-type', 'fill')
                else e.removeAttribute('width-type')
              }
            })
          return check
        })
        let children = [
          ...wb.value.querySelectorAll(
            `.wbaseItem-value[level="${wb.Level + 1}"]`
          )
        ]
        if (width === null) {
          if (wb.value.classList.contains('w-row')) {
            children = children.filter(
              e => e.getAttribute('width-type') === 'fill'
            )
          } else if (
            children.every(e => e.getAttribute('width-type') === 'fill')
          ) {
            children = children
              .sort((a, b) => (a.offsetWidth = b.offsetWidth))
              .slice(0, 1)
          } else {
            children = []
          }
          if (children.length > 0) {
            for (let cWbHTML of children) {
              let cCssRule = StyleDA.docStyleSheets.find(rule => {
                let selector = [...wb.value.querySelectorAll(rule.selectorText)]
                let check = selector.includes(cWbHTML)
                if (check) {
                  rule.style.width = cWbHTML.offsetWidth + 'px'
                  selector.forEach(e => e.removeAttribute('width-type'))
                }
                return check
              })
              cssItem.Css = cssItem.Css.replace(
                new RegExp(`${cCssRule.selectorText} {[^}]*}`, 'g'),
                cCssRule.cssText
              )
            }
          }
          cssRule.style.width = null
          wb.value.setAttribute('width-type', 'fit')
        } else if (width < 0) {
          cssRule.style.width = '100%'
          wb.value.setAttribute('width-type', 'fill')
        } else {
          cssRule.style.width = width + 'px'
          wb.value.removeAttribute('width-type')
        }
        cssItem.Css = cssItem.Css.replace(
          new RegExp(`${cssRule.selectorText} {[^}]*}`, 'g'),
          cssRule.cssText
        )
        StyleDA.editStyleSheet(cssItem)
      }
    }
  } else if (height !== undefined) {
    if (selected_list[0].StyleItem) {
      for (let wb of selected_list) {
        let children = [
          ...wb.value.querySelectorAll(
            `.wbaseItem-value[level="${wb.Level + 1}"]`
          )
        ]
        if (height === null) {
          if (wb.value.classList.contains('w-col')) {
            children = children.filter(
              e => e.getAttribute('height-type') === 'fill'
            )
          } else if (
            children.every(e => e.getAttribute('height-type') === 'fill')
          ) {
            children = children
              .sort((a, b) => (a.offsetHeight = b.offsetHeight))
              .slice(0, 1)
          } else {
            children = []
          }
          if (children.length > 0) {
            if (wb.IsWini && wb.CateID !== EnumCate.variant) {
              let cssItem = StyleDA.cssStyleSheets.find(e => e.GID === wb.GID)
              for (let cWbHTML of children) {
                let cssRule = StyleDA.docStyleSheets.find(rule => {
                  let selector = [
                    ...wb.value.querySelectorAll(rule.selectorText)
                  ]
                  let check = selector.includes(cWbHTML)
                  if (check) {
                    rule.style.height = cWbHTML.offsetHeight + 'px'
                    selector.forEach(e => e.removeAttribute('height-type'))
                  }
                  return check
                })
                cssItem.Css = cssItem.Css.replace(
                  new RegExp(`${cssRule.selectorText} {[^}]*}`, 'g'),
                  cssRule.cssText
                )
              }
              StyleDA.editStyleSheet(cssItem)
            } else {
              children = wbase_list.filter(wb =>
                children.some(wbHTML => wb.GID === wbHTML)
              )
              for (let cWb of children) {
                cWb.StyleItem.FrameItem.Height = cWb.value.offsetHeight
                cWb.value.style.height = cWb.value.offsetHeight + 'px'
                cWb.value.removeAttribute('height-type')
              }
              listUpdate.push(...children)
            }
          }
          wb.StyleItem.FrameItem.Height = null
          wb.value.style.height = null
          wb.value.setAttribute('height-type', 'fit')
        } else if (height < 0) {
          wb.StyleItem.FrameItem.Height = height
          wb.value.style.height = '100%'
          wb.value.setAttribute('height-type', 'fill')
        } else {
          wb.StyleItem.FrameItem.Height = height
          wb.value.style.height = height + 'px'
          wb.value.removeAttribute('height-type')
        }
      }
      listUpdate.push(...selected_list)
      WBaseDA.edit(listUpdate, EnumObj.frame)
    } else {
      let pWbComponent = selected_list[0].value.closest(
        `.wbaseItem-value[iswini="true"]`
      )
      let cssItem = StyleDA.cssStyleSheets.find(e => e.GID === pWbComponent.id)
      for (let wb of selected_list) {
        let cssRule = StyleDA.docStyleSheets.find(rule => {
          let selector = [...pWbComponent.querySelectorAll(rule.selectorText)]
          let check = selector.includes(wb.value)
          if (check)
            selector.forEach(e => {
              if (e !== wb.value) {
                if (height === null) e.setAttribute('height-type', 'fit')
                else if (height < 0) e.setAttribute('height-type', 'fill')
                else e.removeAttribute('height-type')
              }
            })
          return check
        })
        let children = [
          ...wb.value.querySelectorAll(
            `.wbaseItem-value[level="${wb.Level + 1}"]`
          )
        ]
        if (height === null) {
          if (wb.value.classList.contains('w-col')) {
            children = children.filter(
              e => e.getAttribute('height-type') === 'fill'
            )
          } else if (
            children.every(e => e.getAttribute('height-type') === 'fill')
          ) {
            children = children
              .sort((a, b) => a.offsetHeight - b.offsetHeight)
              .slice(0, 1)
          } else {
            children = []
          }
          if (children.length > 0) {
            for (let cWbHTML of children) {
              let cCssRule = StyleDA.docStyleSheets.find(rule => {
                let selector = [...wb.value.querySelectorAll(rule.selectorText)]
                let check = selector.includes(cWbHTML)
                if (check) {
                  rule.style.height = cWbHTML.offsetHeight + 'px'
                  selector.forEach(e => e.removeAttribute('height-type'))
                }
                return check
              })
              cssItem.Css = cssItem.Css.replace(
                new RegExp(`${cCssRule.selectorText} {[^}]*}`, 'g'),
                cCssRule.cssText
              )
            }
          }
          cssRule.style.height = null
          wb.value.setAttribute('height-type', 'fit')
        } else if (height < 0) {
          cssRule.style.height = '100%'
          wb.value.setAttribute('height-type', 'fill')
        } else {
          cssRule.style.height = height + 'px'
          wb.value.removeAttribute('height-type')
        }
        cssItem.Css = cssItem.Css.replace(
          new RegExp(`${cssRule.selectorText} {[^}]*}`, 'g'),
          cssRule.cssText
        )
        StyleDA.editStyleSheet(cssItem)
      }
    }
  } else if (x !== undefined) {
    let pStyle = window.getComputedStyle(selected_list[0].value.parentElement)
    if (selected_list[0].StyleItem) {
      for (let wb of selected_list) {
        switch (wb.value.getAttribute('constx')) {
          case Constraints.right:
            wb.value.style.right = `${Math.round(
              parseFloat(pStyle.width.replace('px')) -
                parseFloat(pStyle.borderRightWidth.replace('px')) -
                parseFloat(pStyle.borderLeftWidth.replace('px')) -
                x -
                wb.value.offsetWidth
            )}px`
            wb.StyleItem.PositionItem.Right = wb.value.style.right
            break
          case Constraints.left_right:
            wb.value.style.right = `${Math.round(
              parseFloat(pStyle.width.replace('px')) -
                parseFloat(pStyle.borderRightWidth.replace('px')) -
                parseFloat(pStyle.borderLeftWidth.replace('px')) -
                x -
                wb.value.offsetWidth
            )}px`
            wb.value.style.left = x + 'px'
            wb.StyleItem.PositionItem.Left = x + 'px'
            wb.StyleItem.PositionItem.Right = wb.value.style.right
            break
          case Constraints.center:
            let centerValue = `${
              x +
              (wb.value.offsetWidth - wb.value.parentElement.offsetWidth) / 2
            }px`
            wb.value.style.left = `calc(50% + ${centerValue})`
            wb.StyleItem.PositionItem.Right = centerValue
            break
          case Constraints.scale:
            let leftValue = `${(
              (x * 100) /
              wb.value.parentElement.offsetWidth
            ).toFixed(2)}%`
            let rightValue = `${(
              (Math.round(
                parseFloat(pStyle.width.replace('px')) -
                  parseFloat(pStyle.borderRightWidth.replace('px')) -
                  parseFloat(pStyle.borderLeftWidth.replace('px')) -
                  x -
                  wb.value.offsetWidth
              ) *
                100) /
              wb.value.parentElement.offsetWidth
            ).toFixed(2)}%`
            wb.value.style.left = leftValue
            wb.value.style.right = rightValue
            wb.StyleItem.PositionItem.Left = leftValue
            wb.StyleItem.PositionItem.Right = rightValue
            break
          default:
            wb.value.style.left = x + 'px'
            wb.StyleItem.PositionItem.Left = x + 'px'
            break
        }
      }
      listUpdate.push(...selected_list)
      WBaseDA.edit(listUpdate, EnumObj.position)
    } else {
      let pWbComponent = selected_list[0].value.closest(
        `.wbaseItem-value[iswini="true"]`
      )
      let cssItem = StyleDA.cssStyleSheets.find(e => e.GID === pWbComponent.id)
      for (let wb of selected_list) {
        let cssRule = StyleDA.docStyleSheets.find(e =>
          [...pWbComponent.querySelectorAll(e.selectorText)].includes(wb.value)
        )
        switch (wb.value.getAttribute('constx')) {
          case Constraints.right:
            cssRule.style.right = `${Math.round(
              parseFloat(pStyle.width.replace('px')) -
                parseFloat(pStyle.borderRightWidth.replace('px')) -
                parseFloat(pStyle.borderLeftWidth.replace('px')) -
                x -
                wb.value.offsetWidth
            )}px`
            break
          case Constraints.left_right:
            cssRule.style.right = `${Math.round(
              parseFloat(pStyle.width.replace('px')) -
                parseFloat(pStyle.borderRightWidth.replace('px')) -
                parseFloat(pStyle.borderLeftWidth.replace('px')) -
                x -
                wb.value.offsetWidth
            )}px`
            cssRule.style.left = x + 'px'
            break
          case Constraints.center:
            let centerValue = `${
              x +
              (wb.value.offsetWidth - wb.value.parentElement.offsetWidth) / 2
            }px`
            cssRule.style.left = `calc(50% + ${centerValue})`
            break
          case Constraints.scale:
            let leftValue = `${(
              (x * 100) /
              wb.value.parentElement.offsetWidth
            ).toFixed(2)}%`
            let rightValue = `${(
              (Math.round(
                parseFloat(pStyle.width.replace('px')) -
                  parseFloat(pStyle.borderRightWidth.replace('px')) -
                  parseFloat(pStyle.borderLeftWidth.replace('px')) -
                  x -
                  wb.value.offsetWidth
              ) *
                100) /
              wb.value.parentElement.offsetWidth
            ).toFixed(2)}%`
            cssRule.style.left = leftValue
            cssRule.style.right = rightValue
            break
          default:
            cssRule.style.left = x + 'px'
            break
        }
        cssItem.Css = cssItem.Css.replace(
          new RegExp(`${cssRule.selectorText} {[^}]*}`, 'g'),
          cssRule.cssText
        )
      }
      StyleDA.editStyleSheet(cssItem)
    }
  } else if (y !== undefined) {
    let pStyle = window.getComputedStyle(selected_list[0].value.parentElement)
    if (selected_list[0].StyleItem) {
      for (let wb of selected_list) {
        switch (wb.value.getAttribute('consty')) {
          case Constraints.bottom:
            wb.value.style.bottom = `${Math.round(
              parseFloat(pStyle.height.replace('px')) -
                parseFloat(pStyle.borderBottomWidth.replace('px')) -
                parseFloat(pStyle.borderTopWidth.replace('px')) -
                y -
                wb.value.offsetHeight
            )}px`
            wb.StyleItem.PositionItem.Bottom = wb.value.style.bottom
            break
          case Constraints.top_bottom:
            wb.value.style.bottom = `${Math.round(
              parseFloat(pStyle.height.replace('px')) -
                parseFloat(pStyle.borderBottomWidth.replace('px')) -
                parseFloat(pStyle.borderTopWidth.replace('px')) -
                y -
                wb.value.offsetHeight
            )}px`
            wb.value.style.top = y + 'px'
            wb.StyleItem.PositionItem.Top = y + 'px'
            wb.StyleItem.PositionItem.Bottom = wb.value.style.bottom
            break
          case Constraints.center:
            let centerValue = `${
              y +
              (wb.value.offsetHeight - wb.value.parentElement.offsetHeight) / 2
            }px`
            wb.value.style.top = `calc(50% + ${centerValue})`
            wb.StyleItem.PositionItem.Bottom = centerValue
            break
          case Constraints.scale:
            let topValue = `${(
              (y * 100) /
              wb.value.parentElement.offsetHeight
            ).toFixed(2)}%`
            let botValue = `${(
              (Math.round(
                parseFloat(pStyle.height.replace('px')) -
                  parseFloat(pStyle.borderBottomWidth.replace('px')) -
                  parseFloat(pStyle.borderRightWidth.replace('px')) -
                  y -
                  wb.value.offsetHeight
              ) *
                100) /
              wb.value.parentElement.offsetHeight
            ).toFixed(2)}%`
            wb.value.style.top = topValue
            wb.value.style.bottom = botValue
            wb.StyleItem.PositionItem.Top = topValue
            wb.StyleItem.PositionItem.Bottom = botValue
            break
          default:
            wb.value.style.top = y + 'px'
            wb.StyleItem.PositionItem.Top = y + 'px'
            break
        }
      }
      listUpdate.push(...selected_list)
      WBaseDA.edit(listUpdate, EnumObj.position)
    } else {
      let pWbComponent = selected_list[0].value.closest(
        `.wbaseItem-value[iswini="true"]`
      )
      let cssItem = StyleDA.cssStyleSheets.find(e => e.GID === pWbComponent.id)
      for (let wb of selected_list) {
        let cssRule = StyleDA.docStyleSheets.find(e =>
          [...pWbComponent.querySelectorAll(e.selectorText)].includes(wb.value)
        )
        switch (wb.value.getAttribute('consty')) {
          case Constraints.bottom:
            cssRule.style.bottom = `${Math.round(
              parseFloat(pStyle.height.replace('px')) -
                parseFloat(pStyle.borderBottomWidth.replace('px')) -
                parseFloat(pStyle.borderRightWidth.replace('px')) -
                y -
                wb.value.offsetHeight
            )}px`
            break
          case Constraints.top_bottom:
            cssRule.style.bottom = `${Math.round(
              parseFloat(pStyle.height.replace('px')) -
                parseFloat(pStyle.borderBottomWidth.replace('px')) -
                parseFloat(pStyle.borderRightWidth.replace('px')) -
                y -
                wb.value.offsetHeight
            )}px`
            cssRule.style.top = y + 'px'
            break
          case Constraints.center:
            let centerValue = `${
              y +
              (wb.value.offsetHeight - wb.value.parentElement.offsetHeight) / 2
            }px`
            cssRule.style.top = `calc(50% + ${centerValue})`
            break
          case Constraints.scale:
            let topValue = `${(
              (y * 100) /
              wb.value.parentElement.offsetHeight
            ).toFixed(2)}%`
            let botValue = `${(
              (Math.round(
                parseFloat(pStyle.height.replace('px')) -
                  parseFloat(pStyle.borderBottomWidth.replace('px')) -
                  parseFloat(pStyle.borderTopWidth.replace('px')) -
                  y -
                  wb.value.offsetHeight
              ) *
                100) /
              wb.value.parentElement.offsetHeight
            ).toFixed(2)}%`
            cssRule.style.top = topValue
            cssRule.style.bottom = botValue
            break
          default:
            cssRule.style.top = y + 'px'
            break
        }
        cssItem.Css = cssItem.Css.replace(
          new RegExp(`${cssRule.selectorText} {[^}]*}`, 'g'),
          cssRule.cssText
        )
      }
      StyleDA.editStyleSheet(cssItem)
    }
  } else if (radius !== undefined) {
    if (selected_list[0].StyleItem) {
      for (let wb of selected_list) {
        wb.StyleItem.FrameItem.TopLeft = radius
        wb.StyleItem.FrameItem.TopRight = radius
        wb.StyleItem.FrameItem.BottomLeft = radius
        wb.StyleItem.FrameItem.BottomRight = radius
        wb.value.style.borderRadius = `${radius}px`
      }
      listUpdate.push(...selected_list)
      WBaseDA.edit(listUpdate, EnumObj.frame)
    } else {
      let pWbComponent = selected_list[0].value.closest(
        `.wbaseItem-value[iswini="true"]`
      )
      let cssItem = StyleDA.cssStyleSheets.find(e => e.GID === pWbComponent.id)
      for (let wb of selected_list) {
        let cssRule = StyleDA.docStyleSheets.find(e =>
          [...pWbComponent.querySelectorAll(e.selectorText)].includes(wb.value)
        )
        cssRule.style.borderRadius = `${radius}px`
        cssItem.Css = cssItem.Css.replace(
          new RegExp(`${cssRule.selectorText} {[^}]*}`, 'g'),
          cssRule.cssText
        )
      }
      StyleDA.editStyleSheet(cssItem)
    }
  } else if (radiusTL !== undefined) {
    if (selected_list[0].StyleItem) {
      for (let wb of selected_list) {
        wb.StyleItem.FrameItem.TopLeft = radiusTL
        wb.value.style.borderTopLeftRadius = `${radiusTL}px`
      }
      listUpdate.push(...selected_list)
      WBaseDA.edit(listUpdate, EnumObj.frame)
    } else {
      let pWbComponent = selected_list[0].value.closest(
        `.wbaseItem-value[iswini="true"]`
      )
      let cssItem = StyleDA.cssStyleSheets.find(e => e.GID === pWbComponent.id)
      for (let wb of selected_list) {
        let cssRule = StyleDA.docStyleSheets.find(e =>
          [...pWbComponent.querySelectorAll(e.selectorText)].includes(wb.value)
        )
        cssRule.style.borderTopLeftRadius = `${radiusTL}px`
        cssItem.Css = cssItem.Css.replace(
          new RegExp(`${cssRule.selectorText} {[^}]*}`, 'g'),
          cssRule.cssText
        )
      }
      StyleDA.editStyleSheet(cssItem)
    }
  } else if (radiusTR !== undefined) {
    if (selected_list[0].StyleItem) {
      for (let wb of selected_list) {
        wb.StyleItem.FrameItem.TopRight = radiusTR
        wb.value.style.borderTopRightRadius = `${radiusTR}px`
      }
      listUpdate.push(...selected_list)
      WBaseDA.edit(listUpdate, EnumObj.frame)
    } else {
      let pWbComponent = selected_list[0].value.closest(
        `.wbaseItem-value[iswini="true"]`
      )
      let cssItem = StyleDA.cssStyleSheets.find(e => e.GID === pWbComponent.id)
      for (let wb of selected_list) {
        let cssRule = StyleDA.docStyleSheets.find(e =>
          [...pWbComponent.querySelectorAll(e.selectorText)].includes(wb.value)
        )
        cssRule.style.borderTopRightRadius = `${radiusTR}px`
        cssItem.Css = cssItem.Css.replace(
          new RegExp(`${cssRule.selectorText} {[^}]*}`, 'g'),
          cssRule.cssText
        )
      }
      StyleDA.editStyleSheet(cssItem)
    }
  } else if (radiusBL !== undefined) {
    if (selected_list[0].StyleItem) {
      for (let wb of selected_list) {
        wb.StyleItem.FrameItem.BottomLeft = radiusBL
        wb.value.style.borderBottomLeftRadius = `${radiusBL}px`
      }
      listUpdate.push(...selected_list)
      WBaseDA.edit(listUpdate, EnumObj.frame)
    } else {
      let pWbComponent = selected_list[0].value.closest(
        `.wbaseItem-value[iswini="true"]`
      )
      let cssItem = StyleDA.cssStyleSheets.find(e => e.GID === pWbComponent.id)
      for (let wb of selected_list) {
        let cssRule = StyleDA.docStyleSheets.find(e =>
          [...pWbComponent.querySelectorAll(e.selectorText)].includes(wb.value)
        )
        cssRule.style.borderBottomLeftRadius = `${radiusBL}px`
        cssItem.Css = cssItem.Css.replace(
          new RegExp(`${cssRule.selectorText} {[^}]*}`, 'g'),
          cssRule.cssText
        )
      }
      StyleDA.editStyleSheet(cssItem)
    }
  } else if (radiusBR !== undefined) {
    if (selected_list[0].StyleItem) {
      for (let wb of selected_list) {
        wb.StyleItem.FrameItem.BottomRight = radiusBR
        wb.value.style.borderBottomRightRadius = `${radiusBR}px`
      }
      listUpdate.push(...selected_list)
      WBaseDA.edit(listUpdate, EnumObj.frame)
    } else {
      let pWbComponent = selected_list[0].value.closest(
        `.wbaseItem-value[iswini="true"]`
      )
      let cssItem = StyleDA.cssStyleSheets.find(e => e.GID === pWbComponent.id)
      for (let wb of selected_list) {
        let cssRule = StyleDA.docStyleSheets.find(e =>
          [...pWbComponent.querySelectorAll(e.selectorText)].includes(wb.value)
        )
        cssRule.style.borderBottomRightRadius = `${radiusBR}px`
        cssItem.Css = cssItem.Css.replace(
          new RegExp(`${cssRule.selectorText} {[^}]*}`, 'g'),
          cssRule.cssText
        )
      }
      StyleDA.editStyleSheet(cssItem)
    }
  } else if (fixPosition !== undefined) {
    if (selected_list[0].StyleItem) {
      let pWb = wbase_list.find(wb => wb.GID === select_box_parentID)
      for (let wb of selected_list) {
        if (fixPosition) {
          if (pWb.value.getAttribute('width-type') === 'fit') {
            pWb.StyleItem.FrameItem.Width = pWb.value.offsetWidth
            pWb.value.style.width = pWb.value.offsetWidth + 'px'
            pWb.value.removeAttribute('width-type')
            listUpdate.push(pWb)
          }
          if (pWb.value.getAttribute('height-type') === 'fit') {
            pWb.StyleItem.FrameItem.Height = pWb.value.offsetHeight
            pWb.value.style.height = pWb.value.offsetHeight + 'px'
            pWb.value.removeAttribute('height-type')
            if (!listUpdate.includes(pWb)) listUpdate.push(pWb)
          }
          if (wb.value.getAttribute('width-type') === 'fill') {
            wb.StyleItem.FrameItem.Width = wb.value.offsetWidth
            wb.value.style.width = wb.value.offsetWidth + 'px'
            wb.value.removeAttribute('width-type')
          }
          if (wb.value.getAttribute('height-type') === 'fill') {
            wb.StyleItem.FrameItem.Height = wb.value.offsetHeight
            wb.value.style.height = wb.value.offsetHeight + 'px'
            wb.value.removeAttribute('height-type')
          }
          wb.StyleItem.PositionItem.ConstraintsX = Constraints.left
          wb.StyleItem.PositionItem.ConstraintsY = Constraints.top
          wb.value.setAttribute('constx', Constraints.left)
          wb.value.setAttribute('consty', Constraints.top)
          wb.value.style.left = wb.value.style.top = $(wb.value).addClass(
            'fixed-position'
          )
        } else {
          $(wb.value).removeClass('fixed-position')
          wb.value.style.position = null
          wb.value.style.left = null
          wb.value.style.right = null
          wb.value.style.top = null
          wb.value.style.bottom = null
          wb.value.style.transform = null
        }
      }
    } else {
    }
  }
  updateUISelectBox()
}

function handleEditConstraints ({ constX, constY }) {
  if (constX) {
    switch (constX) {
      case Constraints.left:
        if (selected_list[0].StyleItem) {
          for (let wb of selected_list) {
            let x = `${getWBaseOffset(wb).x}`.replace('.00', '') + 'px'
            wb.StyleItem.PositionItem.Left = x
            wb.StyleItem.PositionItem.ConstraintsX = Constraints.left
            switch (wb.value.getAttribute('constx')) {
              case Constraints.left_right:
                wb.value.style.width = wb.value.offsetWidth + 'px'
                break
              case Constraints.scale:
                wb.value.style.width = wb.value.offsetWidth + 'px'
                break
              default:
                break
            }
            wb.value.setAttribute('constx', Constraints.left)
            wb.value.style.left = x
            wb.value.style.right = null
            if (wb.value.getAttribute('consty') === Constraints.center) {
              wb.value.style.transform = 'translateY(-50%)'
            } else wb.value.style.transform = null
          }
          WBaseDA.edit(selected_list, EnumObj.position)
        } else {
          let pWbComponent = selected_list[0].value.closest(
            `.wbaseItem-value[iswini="true"]`
          )
          let cssItem = StyleDA.cssStyleSheets.find(
            e => e.GID === pWbComponent.id
          )
          for (let wb of selected_list) {
            let cssRule = StyleDA.docStyleSheets.find(rule => {
              let selector = [
                ...pWbComponent.querySelectorAll(rule.selectorText)
              ]
              let check = selector.includes(wb.value)
              if (check) {
                switch (wb.value.getAttribute('constx')) {
                  case Constraints.left_right:
                    rule.style.width = wb.value.offsetWidth + 'px'
                    break
                  case Constraints.scale:
                    rule.style.width = wb.value.offsetWidth + 'px'
                    break
                  default:
                    break
                }
                selector.forEach(e =>
                  e.setAttribute('constx', Constraints.left)
                )
              }
              return check
            })
            let x = `${getWBaseOffset(wb).x}`.replace('.00', '') + 'px'
            cssRule.style.left = x
            cssRule.style.right = null
            if (wb.value.getAttribute('consty') === Constraints.center) {
              cssRule.style.transform = 'translateY(-50%)'
            } else cssRule.style.transform = null
            cssItem.Css = cssItem.Css.replace(
              new RegExp(`${cssRule.selectorText} {[^}]*}`, 'g'),
              cssRule.cssText
            )
          }
          StyleDA.editStyleSheet(cssItem)
        }
        break
      case Constraints.right:
        var pStyle = window.getComputedStyle(
          selected_list[0].value.parentElement
        )
        if (selected_list[0].StyleItem) {
          for (let wb of selected_list) {
            let x = parseFloat(`${getWBaseOffset(wb).x}`.replace('.00', ''))
            let right = `${Math.round(
              parseFloat(pStyle.width.replace('px')) -
                parseFloat(pStyle.borderRightWidth.replace('px')) -
                parseFloat(pStyle.borderLeftWidth.replace('px')) -
                x -
                wb.value.offsetWidth
            )}px`
            wb.StyleItem.PositionItem.Right = right
            wb.StyleItem.PositionItem.ConstraintsX = Constraints.right
            switch (wb.value.getAttribute('constx')) {
              case Constraints.left_right:
                wb.value.style.width = wb.value.offsetWidth + 'px'
                break
              case Constraints.scale:
                wb.value.style.width = wb.value.offsetWidth + 'px'
                break
              default:
                break
            }
            wb.value.setAttribute('constx', Constraints.right)
            wb.value.style.left = null
            wb.value.style.right = right
            if (wb.value.getAttribute('consty') === Constraints.center) {
              wb.value.style.transform = 'translateY(-50%)'
            } else wb.value.style.transform = null
          }
          WBaseDA.edit(selected_list, EnumObj.position)
        } else {
          let pWbComponent = selected_list[0].value.closest(
            `.wbaseItem-value[iswini="true"]`
          )
          let cssItem = StyleDA.cssStyleSheets.find(
            e => e.GID === pWbComponent.id
          )
          for (let wb of selected_list) {
            let cssRule = StyleDA.docStyleSheets.find(rule => {
              let selector = [
                ...pWbComponent.querySelectorAll(rule.selectorText)
              ]
              let check = selector.includes(wb.value)
              if (check) {
                switch (wb.value.getAttribute('constx')) {
                  case Constraints.left_right:
                    rule.style.width = wb.value.offsetWidth + 'px'
                    break
                  case Constraints.scale:
                    rule.style.width = wb.value.offsetWidth + 'px'
                    break
                  default:
                    break
                }
                selector.forEach(e =>
                  e.setAttribute('constx', Constraints.right)
                )
              }
              return check
            })
            let x = parseFloat(`${getWBaseOffset(wb).x}`.replace('.00', ''))
            let right = `${Math.round(
              parseFloat(pStyle.width.replace('px')) -
                parseFloat(pStyle.borderRightWidth.replace('px')) -
                parseFloat(pStyle.borderLeftWidth.replace('px')) -
                x -
                wb.value.offsetWidth
            )}px`
            cssRule.style.left = null
            cssRule.style.right = right
            if (wb.value.getAttribute('consty') === Constraints.center) {
              cssRule.style.transform = 'translateY(-50%)'
            } else cssRule.style.transform = null
            cssItem.Css = cssItem.Css.replace(
              new RegExp(`${cssRule.selectorText} {[^}]*}`, 'g'),
              cssRule.cssText
            )
          }
          StyleDA.editStyleSheet(cssItem)
        }
        break
      case Constraints.left_right:
        var pStyle = window.getComputedStyle(
          selected_list[0].value.parentElement
        )
        if (selected_list[0].StyleItem) {
          for (let wb of selected_list) {
            let x = parseFloat(`${getWBaseOffset(wb).x}`.replace('.00', ''))
            let right = `${Math.round(
              parseFloat(pStyle.width.replace('px')) -
                parseFloat(pStyle.borderRightWidth.replace('px')) -
                parseFloat(pStyle.borderLeftWidth.replace('px')) -
                x -
                wb.value.offsetWidth
            )}px`
            wb.StyleItem.PositionItem.Left = x + 'px'
            wb.StyleItem.PositionItem.Right = right
            wb.StyleItem.PositionItem.ConstraintsX = Constraints.left_right
            wb.value.setAttribute('constx', Constraints.left_right)
            wb.value.style.left = x + 'px'
            wb.value.style.right = right
            wb.value.style.width = null
            if (wb.value.getAttribute('consty') === Constraints.center) {
              wb.value.style.transform = 'translateY(-50%)'
            } else wb.value.style.transform = null
          }
          WBaseDA.edit(selected_list, EnumObj.position)
        } else {
          let pWbComponent = selected_list[0].value.closest(
            `.wbaseItem-value[iswini="true"]`
          )
          let cssItem = StyleDA.cssStyleSheets.find(
            e => e.GID === pWbComponent.id
          )
          for (let wb of selected_list) {
            let cssRule = StyleDA.docStyleSheets.find(rule => {
              let selector = [
                ...pWbComponent.querySelectorAll(rule.selectorText)
              ]
              let check = selector.includes(wb.value)
              if (check)
                selector.forEach(e =>
                  e.setAttribute('constx', Constraints.left_right)
                )
              return check
            })
            let x = parseFloat(`${getWBaseOffset(wb).x}`.replace('.00', ''))
            let right = `${Math.round(
              parseFloat(pStyle.width.replace('px')) -
                parseFloat(pStyle.borderRightWidth.replace('px')) -
                parseFloat(pStyle.borderLeftWidth.replace('px')) -
                x -
                wb.value.offsetWidth
            )}px`
            cssRule.style.left = x + "px"
            cssRule.style.right = right
            cssRule.style.width = null
            if (wb.value.getAttribute('consty') === Constraints.center) {
              cssRule.style.transform = 'translateY(-50%)'
            } else cssRule.style.transform = null
            cssItem.Css = cssItem.Css.replace(
              new RegExp(`${cssRule.selectorText} {[^}]*}`, 'g'),
              cssRule.cssText
            )
          }
          StyleDA.editStyleSheet(cssItem)
        }
        break
      case Constraints.center:
        if (selected_list[0].StyleItem) {
          for (let wb of selected_list) {
            let x = parseFloat(`${getWBaseOffset(wb).x}`.replace('.00', ''))
            let centerValue = `${
              x +
              (wb.value.offsetWidth - wb.value.parentElement.offsetWidth) / 2
            }px`
            wb.StyleItem.PositionItem.Right = centerValue
            wb.StyleItem.PositionItem.ConstraintsX = Constraints.center
            switch (wb.value.getAttribute('constx')) {
              case Constraints.left_right:
                wb.value.style.width = wb.value.offsetWidth + 'px'
                break
              case Constraints.scale:
                wb.value.style.width = wb.value.offsetWidth + 'px'
                break
              default:
                break
            }
            wb.value.setAttribute('constx', Constraints.center)
            wb.value.style.left = `calc(50% + ${centerValue})`
            wb.value.style.right = null
            if (wb.value.getAttribute('consty') === Constraints.center) {
              wb.value.style.transform = 'translate(-50%,-50%)'
            } else wb.value.style.transform = 'translateX(-50%)'
          }
          WBaseDA.edit(selected_list, EnumObj.position)
        } else {
          let pWbComponent = selected_list[0].value.closest(
            `.wbaseItem-value[iswini="true"]`
          )
          let cssItem = StyleDA.cssStyleSheets.find(
            e => e.GID === pWbComponent.id
          )
          for (let wb of selected_list) {
            let cssRule = StyleDA.docStyleSheets.find(rule => {
              let selector = [
                ...pWbComponent.querySelectorAll(rule.selectorText)
              ]
              let check = selector.includes(wb.value)
              if (check) {
                switch (wb.value.getAttribute('constx')) {
                  case Constraints.left_right:
                    rule.style.width = wb.value.offsetWidth + 'px'
                    break
                  case Constraints.scale:
                    rule.style.width = wb.value.offsetWidth + 'px'
                    break
                  default:
                    break
                }
                selector.forEach(e =>
                  e.setAttribute('constx', Constraints.center)
                )
              }
              return check
            })
            let x = parseFloat(`${getWBaseOffset(wb).x}`.replace('.00', ''))
            let centerValue = `${
              x + (wb.value.offsetWidth - wb.value.parentElement.offsetWidth) / 2
            }px`
            cssRule.style.left = `calc(50% + ${centerValue})`
            cssRule.style.right = null
            if (wb.value.getAttribute('consty') === Constraints.center) {
              cssRule.style.transform = 'translate(-50%,-50%)'
            } else cssRule.style.transform = 'translateX(-50%)'
            cssItem.Css = cssItem.Css.replace(
              new RegExp(`${cssRule.selectorText} {[^}]*}`, 'g'),
              cssRule.cssText
            )
          }
          StyleDA.editStyleSheet(cssItem)
        }
        break
      case Constraints.scale:
        if (selected_list[0].StyleItem) {
          for (let wb of selected_list) {
            let x = parseFloat(`${getWBaseOffset(wb).x}`.replace('.00', ''))
            let leftValue = `${(
              (x * 100) /
              wb.value.parentElement.offsetWidth
            ).toFixed(2)}%`
            let rightValue = `${(
              (Math.round(
                parseFloat(pStyle.width.replace('px')) -
                  parseFloat(pStyle.borderRightWidth.replace('px')) -
                  parseFloat(pStyle.borderLeftWidth.replace('px')) -
                  x -
                  wb.value.offsetWidth
              ) *
                100) /
              wb.value.parentElement.offsetWidth
            ).toFixed(2)}%`
            wb.StyleItem.PositionItem.Left = leftValue
            wb.StyleItem.PositionItem.Right = rightValue
            wb.StyleItem.PositionItem.ConstraintsX = Constraints.scale
            wb.value.setAttribute('constx', Constraints.scale)
            wb.value.style.left = leftValue
            wb.value.style.right = rightValue
            wb.value.style.width = null
            if (wb.value.getAttribute('consty') === Constraints.center) {
              wb.value.style.transform = 'translateY(-50%)'
            } else wb.value.style.transform = null
          }
          WBaseDA.edit(selected_list, EnumObj.position)
        } else {
          let pWbComponent = selected_list[0].value.closest(
            `.wbaseItem-value[iswini="true"]`
          )
          let cssItem = StyleDA.cssStyleSheets.find(
            e => e.GID === pWbComponent.id
          )
          for (let wb of selected_list) {
            let cssRule = StyleDA.docStyleSheets.find(rule => {
              let selector = [
                ...pWbComponent.querySelectorAll(rule.selectorText)
              ]
              let check = selector.includes(wb.value)
              if (check)
                selector.forEach(e =>
                  e.setAttribute('constx', Constraints.scale)
                )
              return check
            })
            let x = parseFloat(`${getWBaseOffset(wb).x}`.replace('.00', ''))
            let leftValue = `${(
              (x * 100) /
              wb.value.parentElement.offsetWidth
            ).toFixed(2)}%`
            let rightValue = `${(
              (Math.round(
                parseFloat(pStyle.width.replace('px')) -
                  parseFloat(pStyle.borderRightWidth.replace('px')) -
                  parseFloat(pStyle.borderLeftWidth.replace('px')) -
                  x -
                  wb.value.offsetWidth
              ) *
                100) /
              wb.value.parentElement.offsetWidth
            ).toFixed(2)}%`
            cssRule.style.left = leftValue
            cssRule.style.right = rightValue
            cssRule.style.width = null
            if (wb.value.getAttribute('consty') === Constraints.center) {
              cssRule.style.transform = 'translateY(-50%)'
            } else cssRule.style.transform = null
            cssItem.Css = cssItem.Css.replace(
              new RegExp(`${cssRule.selectorText} {[^}]*}`, 'g'),
              cssRule.cssText
            )
          }
          StyleDA.editStyleSheet(cssItem)
        }
        break
      default:
        break
    }
  } else if (constY) {
    switch (constY) {
      case Constraints.top:
        if (selected_list[0].StyleItem) {
          for (let wb of selected_list) {
            let y = `${getWBaseOffset(wb).y}`.replace('.00', '') + 'px'
            wb.StyleItem.PositionItem.Top = y
            wb.StyleItem.PositionItem.ConstraintsY = Constraints.top
            switch (wb.value.getAttribute('consty')) {
              case Constraints.top_bottom:
                wb.value.style.height = wb.value.offsetHeight + 'px'
                break
              case Constraints.scale:
                wb.value.style.height = wb.value.offsetHeight + 'px'
                break
              default:
                break
            }
            wb.value.setAttribute('consty', Constraints.top)
            wb.value.style.top = y
            wb.value.style.bottom = null
            if (wb.value.getAttribute('constx') === Constraints.center) {
              wb.value.style.transform = 'translateX(-50%)'
            } else wb.value.style.transform = null
          }
          WBaseDA.edit(selected_list, EnumObj.position)
        } else {
          let pWbComponent = selected_list[0].value.closest(
            `.wbaseItem-value[iswini="true"]`
          )
          let cssItem = StyleDA.cssStyleSheets.find(
            e => e.GID === pWbComponent.id
          )
          for (let wb of selected_list) {
            let cssRule = StyleDA.docStyleSheets.find(rule => {
              let selector = [
                ...pWbComponent.querySelectorAll(rule.selectorText)
              ]
              let check = selector.includes(wb.value)
              if (check) {
                switch (wb.value.getAttribute('consty')) {
                  case Constraints.top_bottom:
                    rule.style.height = wb.value.offsetHeight + 'px'
                    break
                  case Constraints.scale:
                    rule.style.height = wb.value.offsetHeight + 'px'
                    break
                  default:
                    break
                }
                selector.forEach(e => e.setAttribute('consty', Constraints.top))
              }
              return check
            })
            let y = `${getWBaseOffset(wb).y}`.replace('.00', '') + 'px'
            cssRule.style.top = y
            cssRule.style.bottom = null
            if (wb.value.getAttribute('constx') === Constraints.center) {
              cssRule.style.transform = 'translateX(-50%)'
            } else cssRule.style.transform = null
            cssItem.Css = cssItem.Css.replace(
              new RegExp(`${cssRule.selectorText} {[^}]*}`, 'g'),
              cssRule.cssText
            )
          }
          StyleDA.editStyleSheet(cssItem)
        }
        break
      case Constraints.bottom:
        var pStyle = window.getComputedStyle(
          selected_list[0].value.parentElement
        )
        if (selected_list[0].StyleItem) {
          for (let wb of selected_list) {
            let y = parseFloat(`${getWBaseOffset(wb).y}`.replace('.00', ''))
            let bot = `${Math.round(
              parseFloat(pStyle.height.replace('px')) -
                parseFloat(pStyle.borderBottomWidth.replace('px')) -
                parseFloat(pStyle.borderTopWidth.replace('px')) -
                y -
                wb.value.offsetHeight
            )}px`
            wb.StyleItem.PositionItem.Bottom = bot
            wb.StyleItem.PositionItem.ConstraintsY = Constraints.bottom
            switch (wb.value.getAttribute('consty')) {
              case Constraints.top_bottom:
                wb.value.style.height = wb.value.offsetHeight + 'px'
                break
              case Constraints.scale:
                wb.value.style.height = wb.value.offsetHeight + 'px'
                break
              default:
                break
            }
            wb.value.setAttribute('consty', Constraints.bottom)
            wb.value.style.top = null
            wb.value.style.bottom = bot
            if (wb.value.getAttribute('constx') === Constraints.center) {
              wb.value.style.transform = 'translateX(-50%)'
            } else wb.value.style.transform = null
          }
          WBaseDA.edit(selected_list, EnumObj.position)
        } else {
          let pWbComponent = selected_list[0].value.closest(
            `.wbaseItem-value[iswini="true"]`
          )
          let cssItem = StyleDA.cssStyleSheets.find(
            e => e.GID === pWbComponent.id
          )
          for (let wb of selected_list) {
            let cssRule = StyleDA.docStyleSheets.find(rule => {
              let selector = [
                ...pWbComponent.querySelectorAll(rule.selectorText)
              ]
              let check = selector.includes(wb.value)
              if (check) {
                switch (wb.value.getAttribute('consty')) {
                  case Constraints.left_right:
                    rule.style.height = wb.value.offsetHeight + 'px'
                    break
                  case Constraints.scale:
                    rule.style.height = wb.value.offsetHeight + 'px'
                    break
                  default:
                    break
                }
                selector.forEach(e =>
                  e.setAttribute('consty', Constraints.bottom)
                )
              }
              return check
            })
            let y = parseFloat(`${getWBaseOffset(wb).y}`.replace('.00', ''))
            let bot = `${Math.round(
              parseFloat(pStyle.height.replace('px')) -
                parseFloat(pStyle.borderBottomWidth.replace('px')) -
                parseFloat(pStyle.borderTopWidth.replace('px')) -
                y -
                wb.value.offsetHeight
            )}px`
            cssRule.style.top = null
            cssRule.style.right = bot
            if (wb.value.getAttribute('constx') === Constraints.center) {
              cssRule.style.transform = 'translateX(-50%)'
            } else cssRule.style.transform = null
            cssItem.Css = cssItem.Css.replace(
              new RegExp(`${cssRule.selectorText} {[^}]*}`, 'g'),
              cssRule.cssText
            )
          }
          StyleDA.editStyleSheet(cssItem)
        }
        break
      case Constraints.top_bottom:
        var pStyle = window.getComputedStyle(
          selected_list[0].value.parentElement
        )
        if (selected_list[0].StyleItem) {
          for (let wb of selected_list) {
            let y = parseFloat(`${getWBaseOffset(wb).y}`.replace('.00', ''))
            let bot = `${Math.round(
              parseFloat(pStyle.height.replace('px')) -
                parseFloat(pStyle.borderBottomWidth.replace('px')) -
                parseFloat(pStyle.borderTopWidth.replace('px')) -
                y -
                wb.value.offsetHeight
            )}px`
            wb.StyleItem.PositionItem.Top = y + "px"
            wb.StyleItem.PositionItem.Bottom = bot
            wb.StyleItem.PositionItem.ConstraintsY = Constraints.top_bottom
            wb.value.setAttribute('constx', Constraints.top_bottom)
            wb.value.style.top = y + "px"
            wb.value.style.bottom = bot
            wb.value.style.height = null
            if (wb.value.getAttribute('constx') === Constraints.center) {
              wb.value.style.transform = 'translateX(-50%)'
            } else wb.value.style.transform = null
          }
          WBaseDA.edit(selected_list, EnumObj.position)
        } else {
          let pWbComponent = selected_list[0].value.closest(
            `.wbaseItem-value[iswini="true"]`
          )
          let cssItem = StyleDA.cssStyleSheets.find(
            e => e.GID === pWbComponent.id
          )
          for (let wb of selected_list) {
            let cssRule = StyleDA.docStyleSheets.find(rule => {
              let selector = [
                ...pWbComponent.querySelectorAll(rule.selectorText)
              ]
              let check = selector.includes(wb.value)
              if (check)
                selector.forEach(e =>
                  e.setAttribute('consty', Constraints.top_bottom)
                )
              return check
            })
            let y = parseFloat(`${getWBaseOffset(wb).y}`.replace('.00', ''))
            let bot = `${Math.round(
              parseFloat(pStyle.height.replace('px')) -
                parseFloat(pStyle.borderBottomWidth.replace('px')) -
                parseFloat(pStyle.borderTopWidth.replace('px')) -
                y -
                wb.value.offsetHeight
            )}px`
            cssRule.style.top = y + "px"
            cssRule.style.bottom = bot
            cssRule.style.height = null
            if (wb.value.getAttribute('constx') === Constraints.center) {
              cssRule.style.transform = 'translateX(-50%)'
            } else cssRule.style.transform = null
            cssItem.Css = cssItem.Css.replace(
              new RegExp(`${cssRule.selectorText} {[^}]*}`, 'g'),
              cssRule.cssText
            )
          }
          StyleDA.editStyleSheet(cssItem)
        }
        break
      case Constraints.center:
        if (selected_list[0].StyleItem) {
          for (let wb of selected_list) {
            let y = parseFloat(`${getWBaseOffset(wb).y}`.replace('.00', ''))
            let centerValue = `${
              y +
              (wb.value.offsetHeight - wb.value.parentElement.offsetHeight) / 2
            }px`
            wb.StyleItem.PositionItem.Bottom = centerValue
            wb.StyleItem.PositionItem.ConstraintsY = Constraints.center
            switch (wb.value.getAttribute('consty')) {
              case Constraints.top_bottom:
                wb.value.style.height = wb.value.offsetHeight + 'px'
                break
              case Constraints.scale:
                wb.value.style.height = wb.value.offsetHeight + 'px'
                break
              default:
                break
            }
            wb.value.setAttribute('consty', Constraints.center)
            wb.value.style.top = `calc(50% + ${centerValue})`
            wb.value.style.bottom = null
            if (wb.value.getAttribute('constx') === Constraints.center) {
              wb.value.style.transform = 'translate(-50%,-50%)'
            } else wb.value.style.transform = 'translateY(-50%)'
          }
          WBaseDA.edit(selected_list, EnumObj.position)
        } else {
          let pWbComponent = selected_list[0].value.closest(
            `.wbaseItem-value[iswini="true"]`
          )
          let cssItem = StyleDA.cssStyleSheets.find(
            e => e.GID === pWbComponent.id
          )
          for (let wb of selected_list) {
            let cssRule = StyleDA.docStyleSheets.find(rule => {
              let selector = [
                ...pWbComponent.querySelectorAll(rule.selectorText)
              ]
              let check = selector.includes(wb.value)
              if (check) {
                switch (wb.value.getAttribute('consty')) {
                  case Constraints.top_bottom:
                    rule.style.height = wb.value.offsetHeight + 'px'
                    break
                  case Constraints.scale:
                    rule.style.height = wb.value.offsetHeight + 'px'
                    break
                  default:
                    break
                }
                selector.forEach(e =>
                  e.setAttribute('consty', Constraints.center)
                )
              }
              return check
            })
            let y = parseFloat(`${getWBaseOffset(wb).y}`.replace('.00', ''))
            let centerValue = `${
              y + (wb.value.offsetHeight - wb.value.parentElement.offsetHeight) / 2
            }px`
            cssRule.style.top = `calc(50% + ${centerValue})`
            cssRule.style.bottom = null
            if (wb.value.getAttribute('constx') === Constraints.center) {
              cssRule.style.transform = 'translate(-50%,-50%)'
            } else cssRule.style.transform = 'translateY(-50%)'
            cssItem.Css = cssItem.Css.replace(
              new RegExp(`${cssRule.selectorText} {[^}]*}`, 'g'),
              cssRule.cssText
            )
          }
          StyleDA.editStyleSheet(cssItem)
        }
        break
      case Constraints.scale:
        if (selected_list[0].StyleItem) {
          for (let wb of selected_list) {
            let y = parseFloat(`${getWBaseOffset(wb).y}`.replace('.00', ''))
            let topValue = `${(
              (y * 100) /
              wb.value.parentElement.offsetHeight
            ).toFixed(2)}%`
            let botValue = `${(
              (Math.round(
                parseFloat(pStyle.height.replace('px')) -
                  parseFloat(pStyle.borderBottomWidth.replace('px')) -
                  parseFloat(pStyle.borderTopWidth.replace('px')) -
                  y -
                  wb.value.offsetHeight
              ) *
                100) /
              wb.value.parentElement.offsetHeight
            ).toFixed(2)}%`
            wb.StyleItem.PositionItem.Top = topValue
            wb.StyleItem.PositionItem.Bottom = botValue
            wb.StyleItem.PositionItem.ConstraintsY = Constraints.scale
            wb.value.setAttribute('consty', Constraints.scale)
            wb.value.style.top = topValue
            wb.value.style.bottom = botValue
            wb.value.style.height = null
            if (wb.value.getAttribute('constx') === Constraints.center) {
              wb.value.style.transform = 'translateX(-50%)'
            } else wb.value.style.transform = null
          }
          WBaseDA.edit(selected_list, EnumObj.position)
        } else {
          let pWbComponent = selected_list[0].value.closest(
            `.wbaseItem-value[iswini="true"]`
          )
          let cssItem = StyleDA.cssStyleSheets.find(
            e => e.GID === pWbComponent.id
          )
          for (let wb of selected_list) {
            let cssRule = StyleDA.docStyleSheets.find(rule => {
              let selector = [
                ...pWbComponent.querySelectorAll(rule.selectorText)
              ]
              let check = selector.includes(wb.value)
              if (check)
                selector.forEach(e =>
                  e.setAttribute('consty', Constraints.scale)
                )
              return check
            })
            let y = parseFloat(`${getWBaseOffset(wb).y}`.replace('.00', ''))
            let topValue = `${(
              (y * 100) /
              wb.value.parentElement.offsetHeight
            ).toFixed(2)}%`
            let botValue = `${(
              (Math.round(
                parseFloat(pStyle.height.replace('px')) -
                  parseFloat(pStyle.borderBottomWidth.replace('px')) -
                  parseFloat(pStyle.borderTopWidth.replace('px')) -
                  y -
                  wb.value.offsetHeight
              ) *
                100) /
              wb.value.parentElement.offsetHeight
            ).toFixed(2)}%`
            cssRule.style.top = topValue
            cssRule.style.bottom = botValue
            cssRule.style.height = null
            if (wb.value.getAttribute('constx') === Constraints.center) {
              cssRule.style.transform = 'translateX(-50%)'
            } else cssRule.style.transform = null
            cssItem.Css = cssItem.Css.replace(
              new RegExp(`${cssRule.selectorText} {[^}]*}`, 'g'),
              cssRule.cssText
            )
          }
          StyleDA.editStyleSheet(cssItem)
        }
        break
      default:
        break
    }
  }
}

function frameHugChildrenSize () {
  let frameList = selected_list.filter(
    e =>
      EnumCate.extend_frame.some(cate => e.CateID === cate) &&
      (e.value.style.width != '100%' || e.value.style.height != '100%')
  )
  let list_update = [...frameList]
  for (let wbaseItem of frameList) {
    let childrenHTML = [...wbaseItem.value.childNodes]
    if (
      wbaseItem.value.style.width != '100%' &&
      wbaseItem.value.style.height != '100%'
    ) {
      let dx = parseFloat(
        Math.min(...childrenHTML.map(e => e.offsetLeft)).toFixed(2)
      )
      let dy = parseFloat(
        Math.min(...childrenHTML.map(e => e.offsetTop)).toFixed(2)
      )
      wbaseItem.StyleItem.PositionItem.Left = `${
        wbaseItem.value.offsetLeft + dx
      }px`
      wbaseItem.StyleItem.PositionItem.Top = `${
        wbaseItem.value.offsetTop + dy
      }px`
      childrenHTML.forEach(childHTML => {
        if (childHTML.style.width == 'auto') {
          childHTML.style.width = childHTML.offsetWidth + 'px'
        }
        if (childHTML.style.height == 'auto') {
          childHTML.style.height = childHTML.offsetHeight + 'px'
        }
        childHTML.style.right = null
        childHTML.style.bottom = null
        childHTML.style.left = `${childHTML.offsetLeft - dx}px`
        childHTML.style.top = `${childHTML.offsetTop - dy}px`
      })
      wbaseItem.StyleItem.FrameItem.Width = Math.max(
        ...childrenHTML.map(e => e.offsetLeft + e.offsetWidth)
      ).toFixed(2)
      wbaseItem.StyleItem.FrameItem.Height = Math.max(
        ...childrenHTML.map(e => e.offsetTop + e.offsetHeight)
      ).toFixed(2)
      wbaseItem.value.style.right = null
      wbaseItem.value.style.bottom = null
      wbaseItem.value.style.transform = null
      wbaseItem.value.style.left = wbaseItem.StyleItem.PositionItem.Left
      wbaseItem.value.style.top = wbaseItem.StyleItem.PositionItem.Top
      wbaseItem.value.style.width = wbaseItem.StyleItem.FrameItem.Width + 'px'
      wbaseItem.value.style.height = wbaseItem.StyleItem.FrameItem.Height + 'px'
      if (wbaseItem.ParentID !== wbase_parentID) updateConstraints(wbaseItem)
      wbase_list
        .filter(e => e.ParentID === wbaseItem.GID)
        .forEach(child => {
          updateConstraints(child)
          list_update.push(child)
        })
    } else if (wbaseItem.value.style.width != '100%') {
      let dx = parseFloat(
        Math.min(...childrenHTML.map(e => e.offsetLeft)).toFixed(2)
      )
      wbaseItem.StyleItem.PositionItem.Left = `${dx}px`
      childrenHTML.forEach(childHTML => {
        if (childHTML.style.width == 'auto') {
          childHTML.style.width = childHTML.offsetWidth + 'px'
        }
        childHTML.style.right = `unset`
        childHTML.style.left = `${childHTML.offsetLeft - dx}px`
        childHTML.style.transform = null
      })
      wbaseItem.StyleItem.FrameItem.Width = Math.max(
        ...childrenHTML.map(e => e.offsetLeft + e.offsetWidth)
      ).toFixed(2)
      wbaseItem.value.style.width = wbaseItem.StyleItem.FrameItem.Width + 'px'
      wbase_list
        .filter(e => e.ParentID === wbaseItem.GID)
        .forEach(child => {
          updateConstraints(child)
          list_update.push(child)
        })
    } else if (wbaseItem.value.style.height != '100%') {
      let dy = parseFloat(
        Math.min(...childrenHTML.map(e => e.offsetTop)).toFixed(2)
      )
      wbaseItem.StyleItem.PositionItem.Top = `${dy}px`
      childrenHTML.forEach(childHTML => {
        if (childHTML.style.height == 'auto') {
          childHTML.style.height = childHTML.offsetHeight + 'px'
        }
        childHTML.style.bottom = `unset`
        childHTML.style.top = `${childHTML.offsetTop - dy}px`
        childHTML.style.transform = null
      })
      wbaseItem.StyleItem.FrameItem.Height = Math.max(
        ...childrenHTML.map(e => e.offsetTop + e.offsetHeight)
      ).toFixed(2)
      wbaseItem.value.style.height = wbaseItem.StyleItem.FrameItem.Height + 'px'
      wbase_list
        .filter(e => e.ParentID === wbaseItem.GID)
        .forEach(child => {
          updateConstraints(child)
          list_update.push(child)
        })
    }
  }
  WBaseDA.edit(list_update, EnumObj.framePosition)
}

function inputFrameItem (frame_item, isRatioWH) {
  let _enumObj = EnumObj.frame
  if (frame_item.Width != undefined && frame_item.Height != undefined) {
    for (let wbaseItem of selected_list) {
      wbaseItem.StyleItem.FrameItem.Width = frame_item.Width
      wbaseItem.StyleItem.FrameItem.Height = frame_item.Height
      handleStyleSize(wbaseItem)
      if (
        select_box_parentID != wbase_parentID &&
        window.getComputedStyle(wb.value).position === 'absolute'
      ) {
        _enumObj = EnumObj.framePosition
        updateConstraints(wb)
      }
    }
  } else if (frame_item.Width != undefined) {
    for (let wb of selected_list) {
      switch (wb.CateID) {
        case EnumCate.w_switch:
          wb.StyleItem.FrameItem.Width = frame_item.Width
          wb.StyleItem.FrameItem.Height = Math.round((frame_item.Width * 5) / 9)
          break
        case EnumCate.radio_button:
          wb.StyleItem.FrameItem.Width = frame_item.Width
          wb.StyleItem.FrameItem.Height = frame_item.Width
          break
        case EnumCate.checkbox:
          wb.StyleItem.FrameItem.Width = frame_item.Width
          wb.StyleItem.FrameItem.Height = frame_item.Width
          break
        default:
          if (isRatioWH) {
            let ratio = wb.value.offsetHeight / wb.value.offsetWidth
            let newH = frame_item.Width * ratio
            wb.StyleItem.FrameItem.Width = frame_item.Width
            wb.StyleItem.FrameItem.Height = newH
          } else {
            wb.StyleItem.FrameItem.Width = frame_item.Width
          }
          break
      }
      handleStyleSize(wb)
      if (
        select_box_parentID != wbase_parentID &&
        window.getComputedStyle(wb.value).position === 'absolute'
      ) {
        _enumObj = EnumObj.framePosition
        updateConstraints(wb)
      }
    }
  } else if (frame_item.Height != undefined) {
    for (let wb of selected_list) {
      switch (wb.CateID) {
        case EnumCate.w_switch:
          wb.StyleItem.FrameItem.Height = frame_item.Height
          wb.StyleItem.FrameItem.Width = Math.round((frame_item.Height * 9) / 5)
          break
        case EnumCate.radio_button:
          wb.StyleItem.FrameItem.Width = frame_item.Height
          wb.StyleItem.FrameItem.Height = frame_item.Height
          break
        case EnumCate.checkbox:
          wb.StyleItem.FrameItem.Width = frame_item.Height
          wb.StyleItem.FrameItem.Height = frame_item.Height
          break
        default:
          if (isRatioWH) {
            var ratio = wb.value.offsetWidth / wb.value.offsetHeight
            var newW = frame_item.Height * ratio
            wb.StyleItem.FrameItem.Width = newW
            if (wb.CateID === EnumCate.tree) {
              wb.StyleItem.FrameItem.Height =
                frame_item.Height /
                ([...wb.value.querySelectorAll('.w-tree')].filter(
                  wtree => wtree.offsetHeight > 0
                ).length +
                  1)
            } else {
              wb.StyleItem.FrameItem.Height = frame_item.Height
            }
          } else {
            if (wb.CateID === EnumCate.tree) {
              wb.StyleItem.FrameItem.Height =
                frame_item.Height /
                ([...wb.value.querySelectorAll('.w-tree')].filter(
                  wtree => wtree.offsetHeight > 0
                ).length +
                  1)
            } else {
              wb.StyleItem.FrameItem.Height = frame_item.Height
            }
          }
          break
      }
      handleStyleSize(wb)
      if (
        select_box_parentID != wbase_parentID &&
        window.getComputedStyle(wb.value).position === 'absolute'
      ) {
        _enumObj = EnumObj.framePosition
        updateConstraints(wb)
      }
    }
  }
  if (
    frame_item.TopLeft != undefined &&
    frame_item.TopRight != undefined &&
    frame_item.BottomLeft != undefined &&
    frame_item.BottomRight != undefined
  ) {
    for (let i = 0; i < selected_list.length; i++) {
      selected_list[i].StyleItem.FrameItem.TopLeft = frame_item.TopLeft
      selected_list[i].StyleItem.FrameItem.TopRight = frame_item.TopRight
      selected_list[i].StyleItem.FrameItem.BottomLeft = frame_item.BottomLeft
      selected_list[i].StyleItem.FrameItem.BottomRight = frame_item.BottomRight
      var elementHTML = document.getElementById(selected_list[i].GID)
      elementHTML.style.borderTopLeftRadius = `${frame_item.TopLeft}px`
      elementHTML.style.borderTopRightRadius = `${frame_item.TopRight}px`
      elementHTML.style.borderBottomLeftRadius = `${frame_item.BottomLeft}px`
      elementHTML.style.borderBottomRightRadius = `${frame_item.BottomRight}px`
    }
  } else {
    if (frame_item.TopLeft != undefined) {
      for (let i = 0; i < selected_list.length; i++) {
        selected_list[i].StyleItem.FrameItem.TopLeft = frame_item.TopLeft
        var elementHTML = document.getElementById(selected_list[i].GID)
        elementHTML.style.borderTopLeftRadius = `${frame_item.TopLeft}px`
      }
    }
    if (frame_item.TopRight != undefined) {
      for (let i = 0; i < selected_list.length; i++) {
        selected_list[i].StyleItem.FrameItem.TopRight = frame_item.TopRight
        var elementHTML = document.getElementById(selected_list[i].GID)
        elementHTML.style.borderTopRightRadius = `${frame_item.TopRight}px`
      }
    }
    if (frame_item.BottomLeft != undefined) {
      for (let i = 0; i < selected_list.length; i++) {
        selected_list[i].StyleItem.FrameItem.BottomLeft = frame_item.BottomLeft
        var elementHTML = document.getElementById(selected_list[i].GID)
        elementHTML.style.borderBottomLeftRadius = `${frame_item.BottomLeft}px`
      }
    }
    if (frame_item.BottomRight != undefined) {
      for (let i = 0; i < selected_list.length; i++) {
        selected_list[i].StyleItem.FrameItem.BottomRight =
          frame_item.BottomRight
        var elementHTML = document.getElementById(selected_list[i].GID)
        elementHTML.style.borderBottomRightRadius = `${frame_item.BottomRight}px`
      }
    }
  }
  if (frame_item.IsClip != undefined) {
    for (let i = 0; i < selected_list.length; i++) {
      selected_list[i].StyleItem.FrameItem.IsClip = frame_item.IsClip
      var elementHTML = document.getElementById(selected_list[i].GID)
      elementHTML.style.overflow = frame_item.IsClip ? 'hidden' : 'visible'
    }
  }
  WBaseDA.edit(selected_list, _enumObj)
  updateUISelectBox()
}

function updatePosition (position_item, wbaseItem) {
  if (position_item.Left != undefined && position_item.Top != undefined) {
    if (!isNaN(position_item.Left))
      position_item.Left = `${position_item.Left}px`
    if (!isNaN(position_item.Top)) position_item.Top = `${position_item.Top}px`
    let elementHTML = wbaseItem.value
    if (!elementHTML.style.width || elementHTML.style.width == 'auto') {
      elementHTML.style.width = elementHTML.offsetWidth + 'px'
    }
    if (!elementHTML.style.height || elementHTML.style.height == 'auto') {
      elementHTML.style.height = elementHTML.offsetHeight + 'px'
    }
    if (elementHTML.style.right) {
      elementHTML.style.right = null
    } else {
      elementHTML.style.right = 'unset'
    }
    if (elementHTML.style.bottom) {
      elementHTML.style.bottom = null
    } else {
      elementHTML.style.bottom = 'unset'
    }
    elementHTML.style.left = position_item.Left
    elementHTML.style.top = position_item.Top
    if (elementHTML.style.transform) {
      elementHTML.style.transform = null
    } else {
      elementHTML.style.transform = 'unset'
    }
    updateConstraints(wbaseItem)
  } else if (position_item.Left != undefined) {
    if (!isNaN(position_item.Left))
      position_item.Left = `${position_item.Left}px`
    let elementHTML = document.getElementById(wbaseItem.GID)
    if (elementHTML.style.width == 'auto') {
      elementHTML.style.width = elementHTML.offsetWidth + 'px'
    }
    if (elementHTML.style.right) {
      elementHTML.style.right = null
    } else {
      elementHTML.style.right = 'unset'
    }
    elementHTML.style.left = position_item.Left
    if (elementHTML.getAttribute('constY') === Constraints.center) {
      elementHTML.style.transform = 'translateY(-50%)'
    } else {
      elementHTML.style.transform = 'unset'
    }
    updateConstraints(wbaseItem)
  } else if (position_item.Right != undefined) {
    let elementHTML = document.getElementById(wbaseItem.GID)
    if (!elementHTML.style.width || elementHTML.style.width == 'auto') {
      elementHTML.style.width = elementHTML.offsetWidth + 'px'
    }
    if (elementHTML.style.left) {
      elementHTML.style.left = null
    } else {
      elementHTML.style.left = 'unset'
    }
    elementHTML.style.right = position_item.Right
    if (elementHTML.getAttribute('constY') === Constraints.center) {
      elementHTML.style.transform = 'translateY(-50%)'
    } else {
      elementHTML.style.transform = 'unset'
    }
    updateConstraints(wbaseItem)
  } else if (position_item.Top != undefined) {
    if (!isNaN(position_item.Top)) position_item.Top = `${position_item.Top}px`
    let elementHTML = document.getElementById(wbaseItem.GID)
    if (!elementHTML.style.height || elementHTML.style.height == 'auto') {
      elementHTML.style.height = elementHTML.offsetHeight + 'px'
    }
    if (elementHTML.style.bottom) {
      elementHTML.style.bottom = null
    } else {
      elementHTML.style.bottom = 'unset'
    }
    elementHTML.style.top = position_item.Top
    if (elementHTML.getAttribute('constX') === Constraints.center) {
      elementHTML.style.transform = 'translateX(-50%)'
    } else {
      elementHTML.style.transform = 'unset'
    }
    updateConstraints(wbaseItem)
  } else if (position_item.Bottom != undefined) {
    let elementHTML = document.getElementById(wbaseItem.GID)
    if (elementHTML.style.height == 'auto') {
      elementHTML.style.height = elementHTML.offsetHeight + 'px'
    }
    if (elementHTML.style.top) {
      elementHTML.style.top = null
    } else {
      elementHTML.style.top = 'unset'
    }
    elementHTML.style.bottom = position_item.Bottom
    if (elementHTML.getAttribute('constX') === Constraints.center) {
      elementHTML.style.transform = 'translateX(-50%)'
    } else {
      elementHTML.style.transform = 'unset'
    }
    updateConstraints(wbaseItem)
  }
}

function inputPositionItem (position_item) {
  if (position_item.ConstraintsX != undefined) {
    for (let wbaseItem of selected_list) {
      wbaseItem.StyleItem.PositionItem.ConstraintsX = position_item.ConstraintsX
      updateConstraints(wbaseItem)
    }
  }
  if (position_item.ConstraintsY != undefined) {
    for (let wbaseItem of selected_list) {
      wbaseItem.StyleItem.PositionItem.ConstraintsY = position_item.ConstraintsY
      updateConstraints(wbaseItem)
    }
  }
  WBaseDA.edit(selected_list, EnumObj.position)
  updateUISelectBox()
}

function updateConstraints (wbaseItem) {
  let constX = Constraints.left
  let constY = Constraints.top
  if (wbaseItem.ParentID != wbase_parentID) {
    wbaseItem.StyleItem.PositionItem.ConstraintsX ??=
      wbaseItem.value.getAttribute('constX')
    wbaseItem.StyleItem.PositionItem.ConstraintsY ??=
      wbaseItem.value.getAttribute('constY')
    constX = wbaseItem.StyleItem.PositionItem.ConstraintsX
    constY = wbaseItem.StyleItem.PositionItem.ConstraintsY
  }
  let wbaseHTML = wbaseItem.value
  switch (constX) {
    case Constraints.left:
      var leftValue = `${
        Math.round(
          (wbaseHTML.getBoundingClientRect().x -
            wbaseHTML.parentElement.getBoundingClientRect().x) /
            scale
        ) -
        parseFloat(
          window
            .getComputedStyle(wbaseHTML.parentElement)
            .borderLeftWidth?.replace('px') ?? '0'
        )
      }px`
      wbaseItem.StyleItem.PositionItem.Left = leftValue
      break
    case Constraints.right:
      var rightValue = `${
        Math.round(
          (wbaseHTML.parentElement.getBoundingClientRect().right -
            wbaseHTML.getBoundingClientRect().right) /
            scale
        ) -
        parseFloat(
          window
            .getComputedStyle(wbaseHTML.parentElement)
            .borderRightWidth?.replace('px') ?? '0'
        )
      }px`
      wbaseItem.StyleItem.PositionItem.Right = rightValue
      break
    case Constraints.left_right:
      var leftValue = `${
        Math.round(
          (wbaseHTML.getBoundingClientRect().x -
            wbaseHTML.parentElement.getBoundingClientRect().x) /
            scale
        ) -
        parseFloat(
          window
            .getComputedStyle(wbaseHTML.parentElement)
            .borderLeftWidth?.replace('px') ?? '0'
        )
      }px`
      wbaseItem.StyleItem.PositionItem.Left = leftValue
      var rightValue = `${
        Math.round(
          (wbaseHTML.parentElement.getBoundingClientRect().right -
            wbaseHTML.getBoundingClientRect().right) /
            scale
        ) -
        parseFloat(
          window
            .getComputedStyle(wbaseHTML.parentElement)
            .borderRightWidth?.replace('px') ?? '0'
        )
      }px`
      wbaseItem.StyleItem.PositionItem.Right = rightValue
      break
    case Constraints.center:
      var leftValue =
        Math.round(
          (wbaseHTML.getBoundingClientRect().x -
            wbaseHTML.parentElement.getBoundingClientRect().x) /
            scale
        ) -
        parseFloat(
          window
            .getComputedStyle(wbaseHTML.parentElement)
            .borderLeftWidth?.replace('px') ?? '0'
        )
      var centerValue = `${
        leftValue +
        (wbaseHTML.offsetWidth - wbaseHTML.parentElement.offsetWidth) / 2
      }px`
      wbaseItem.StyleItem.PositionItem.Left = `${leftValue}px`
      wbaseItem.StyleItem.PositionItem.Right = centerValue
      break
    case Constraints.scale:
      var leftValue = `${(
        ((Math.round(
          (wbaseHTML.getBoundingClientRect().x -
            wbaseHTML.parentElement.getBoundingClientRect().x) /
            scale
        ) -
          parseFloat(
            window
              .getComputedStyle(wbaseHTML.parentElement)
              .borderLeftWidth?.replace('px') ?? '0'
          )) *
          100) /
        wbaseHTML.parentElement.offsetWidth
      ).toFixed(2)}%`
      var rightValue = `${(
        ((Math.round(
          (wbaseHTML.parentElement.getBoundingClientRect().right -
            wbaseHTML.getBoundingClientRect().right) /
            scale
        ) -
          parseFloat(
            window
              .getComputedStyle(wbaseHTML.parentElement)
              .borderRightWidth?.replace('px') ?? '0'
          )) *
          100) /
        wbaseHTML.parentElement.offsetWidth
      ).toFixed(2)}%`
      wbaseItem.StyleItem.PositionItem.Left = leftValue
      wbaseItem.StyleItem.PositionItem.Right = rightValue
      break
    default:
      break
  }
  switch (constY) {
    case Constraints.top:
      var topValue = `${
        Math.round(
          (wbaseHTML.getBoundingClientRect().y -
            wbaseHTML.parentElement.getBoundingClientRect().y) /
            scale
        ) -
        parseFloat(
          window
            .getComputedStyle(wbaseHTML.parentElement)
            .borderTopWidth?.replace('px') ?? '0'
        )
      }px`
      wbaseItem.StyleItem.PositionItem.Top = topValue
      break
    case Constraints.bottom:
      var bottomValue = `${
        Math.round(
          (wbaseHTML.parentElement.getBoundingClientRect().bottom -
            wbaseHTML.getBoundingClientRect().bottom) /
            scale
        ) -
        parseFloat(
          window
            .getComputedStyle(wbaseHTML.parentElement)
            .borderBottomWidth?.replace('px') ?? '0'
        )
      }px`
      wbaseItem.StyleItem.PositionItem.Bottom = bottomValue
      break
    case Constraints.top_bottom:
      var topValue = `${
        Math.round(
          (wbaseHTML.getBoundingClientRect().y -
            wbaseHTML.parentElement.getBoundingClientRect().y) /
            scale
        ) -
        parseFloat(
          window
            .getComputedStyle(wbaseHTML.parentElement)
            .borderTopWidth?.replace('px') ?? '0'
        )
      }px`
      wbaseItem.StyleItem.PositionItem.Top = topValue
      var bottomValue = `${
        Math.round(
          (wbaseHTML.parentElement.getBoundingClientRect().bottom -
            wbaseHTML.getBoundingClientRect().bottom) /
            scale
        ) -
        parseFloat(
          window
            .getComputedStyle(wbaseHTML.parentElement)
            .borderBottomWidth?.replace('px') ?? '0'
        )
      }px`
      wbaseItem.StyleItem.PositionItem.Bottom = bottomValue
      break
    case Constraints.center:
      var topValue =
        Math.round(
          (wbaseHTML.getBoundingClientRect().y -
            wbaseHTML.parentElement.getBoundingClientRect().y) /
            scale
        ) -
        parseFloat(
          window
            .getComputedStyle(wbaseHTML.parentElement)
            .borderTopWidth?.replace('px') ?? '0'
        )
      var centerValue = `${
        topValue +
        (wbaseHTML.offsetHeight - wbaseHTML.parentElement.offsetHeight) / 2
      }px`
      wbaseItem.StyleItem.PositionItem.Top = `${topValue}px`
      wbaseItem.StyleItem.PositionItem.Bottom = centerValue
      break
    case Constraints.scale:
      var topValue = `${(
        ((Math.round(
          (wbaseHTML.getBoundingClientRect().y -
            wbaseHTML.parentElement.getBoundingClientRect().y) /
            scale
        ) -
          parseFloat(
            window
              .getComputedStyle(wbaseHTML.parentElement)
              .borderTopWidth?.replace('px') ?? '0'
          )) *
          100) /
        wbaseHTML.parentElement.offsetHeight
      ).toFixed(2)}%`
      var rightValue = `${(
        ((Math.round(
          (wbaseHTML.parentElement.getBoundingClientRect().bottom -
            wbaseHTML.getBoundingClientRect().bottom) /
            scale
        ) -
          parseFloat(
            window
              .getComputedStyle(wbaseHTML.parentElement)
              .borderBottomWidth?.replace('px') ?? '0'
          )) *
          100) /
        wbaseHTML.parentElement.offsetHeight
      ).toFixed(2)}%`
      wbaseItem.StyleItem.PositionItem.Top = topValue
      wbaseItem.StyleItem.PositionItem.Bottom = rightValue
      break
    default:
      break
  }
  initPositionStyle(wbaseItem)
}

function selectResizeType (isW = true, type) {
  let enumObj = EnumObj.frame
  let parent_wbase
  if (select_box_parentID !== wbase_parentID)
    parent_wbase = wbase_list.find(e => e.GID == select_box_parentID)
  let parentHTML = parent_wbase?.value
  let list_update = []
  list_update.push(...selected_list)
  if (isW) {
    switch (type) {
      case 'fixed':
        for (let wb of selected_list) {
          wb.StyleItem.FrameItem.Width = wb.value.offsetWidth
          wb.value.style.width = `${wb.value.offsetWidth}px`
          wbHTML.removeAttribute('width-type')
        }
        break
      case 'hug':
        let checkConstX = false
        if (parent_wbase) {
          checkConstX = parentHTML.classList.contains('w-stack')
        }
        for (let wb of selected_list) {
          let wbHTML = wb.value
          if (window.getComputedStyle(wbHTML).display.match('flex')) {
            if (wbHTML.classList.contains('w-row')) {
              let list_child = wbase_list.filter(
                e =>
                  e.ParentID == wb.GID &&
                  e.value.getAttribute('width-type') === 'fill'
              )
              list_update.push(...list_child)
              for (let childWb of list_child) {
                childWb.StyleItem.FrameItem.Width = childWb.value.offsetWidth
                childWb.value.style.width = `${childWb.value.offsetWidth}px`
              }
            } else {
              let fillChild = [
                ...wbHTML.querySelectorAll(
                  `.wbaseItem-value[level="${wb.Level + 1}"][width-type="fill"]`
                )
              ]
              if (childrenHTML.length === fillChild.length) {
                fillChild.sort((a, b) => b.offsetWidth - a.offsetWidth)
                let wbChild = wbase_list.find(e => e.GID == fillChild[0].id)
                wbChild.StyleItem.FrameItem.Width = wbChild.value.offsetWidth
                wbChild.value.style.width = wbChild.value.offsetWidth + 'px'
                wbChild.value.removeAttribute('width-type')
                list_update.push(wbChild)
              }
            }
          }
          if (checkConstX) {
            if (
              [Constraints.center, Constraints.scale].some(
                constX => wb.StyleItem.PositionItem.ConstraintsX === constX
              )
            ) {
              enumObj = EnumObj.framePosition
              wb.StyleItem.PositionItem.ConstraintsX = Constraints.left
              wb.StyleItem.PositionItem.Left = wbase_eHTML.offsetLeft + 'px'
              initPositionStyle(wb)
            }
          }
          wb.StyleItem.FrameItem.Width = null
          wbHTML.style.width = 'fit-content'
          wbHTML.style.minWidth = null
          wbHTML.setAttribute('width-type', 'fit')
        }
        break
      case 'fill':
        if (parent_wbase) {
          if (
            !parentHTML.style.width ||
            parentHTML.style.width == 'fit-content'
          ) {
            if (parentHTML.classList.contains('w-row')) {
              parent_wbase.StyleItem.FrameItem.Width = parentHTML.offsetWidth
              parentHTML.style.width = `${parentHTML.offsetWidth}px`
              list_update.push(parent_wbase)
            } else {
              let fillChild = [
                ...parentHTML.querySelectorAll(
                  `.wbaseItem-value[level="${
                    parent_wbase.Level + 1
                  }"]:not(*[width-type="fill"])`
                )
              ]
              if (
                fillChild.every(e => selected_list.some(wb => e.id === wb.GID))
              ) {
                parent_wbase.StyleItem.FrameItem.Width = parentHTML.offsetWidth
                parentHTML.style.width = `${parentHTML.offsetWidth}px`
                list_update.push(parent_wbase)
              }
            }
          }
          for (let wb of selected_list) {
            let wbHTML = wb.value
            wb.StyleItem.FrameItem.Width =
              wbHTML.offsetWidth === 0 ? -1 : -wbHTML.offsetWidth
            wbHTML.style.width = '100%'
            wbHTML.setAttribute('width-type', 'fill')
          }
        } else return
        break
      default:
        break
    }
  } else {
    switch (type) {
      case 'fixed':
        for (let wb of selected_list) {
          wb.StyleItem.FrameItem.Height = wb.value.offsetHeight
          wb.value.style.height = `${wb.value.offsetHeight}px`
          wbHTML.removeAttribute('height-type')
        }
        break
      case 'hug':
        let checkConstY = false
        if (parent_wbase) {
          checkConstY = parentHTML.classList.contains('w-stack')
        }
        for (let wb of selected_list) {
          let wbHTML = wb.value
          if (window.getComputedStyle(wbHTML).display.match('flex')) {
            if (wbHTML.classList.contains('w-col')) {
              let list_child = wbase_list.filter(
                e =>
                  e.ParentID == wb.GID &&
                  e.value.getAttribute('height-type') === 'fill'
              )
              list_update.push(...list_child)
              for (let childWb of list_child) {
                childWb.StyleItem.FrameItem.Height = childWb.value.offsetHeight
                childWb.value.style.height = `${childWb.value.offsetHeight}px`
              }
            } else {
              let fillChild = [
                ...wbHTML.querySelectorAll(
                  `.wbaseItem-value[level="${
                    wb.Level + 1
                  }"][height-type="fill"]`
                )
              ]
              if (childrenHTML.length === fillChild.length) {
                fillChild.sort((a, b) => b.offsetHeight - a.offsetHeight)
                let wbChild = wbase_list.find(e => e.GID == fillChild[0].id)
                wbChild.StyleItem.FrameItem.Height = wbChild.value.offsetHeight
                wbChild.value.style.height = wbChild.value.offsetHeight + 'px'
                wbChild.value.removeAttribute('height-type')
                list_update.push(wbChild)
              }
            }
          }
          if (checkConstY) {
            if (
              [Constraints.center, Constraints.scale].some(
                constY => wb.StyleItem.PositionItem.ConstraintsY === constY
              )
            ) {
              enumObj = EnumObj.framePosition
              wb.StyleItem.PositionItem.ConstraintsY = Constraints.top
              wb.StyleItem.PositionItem.Top = wbase_eHTML.offsetTop + 'px'
              initPositionStyle(wb)
            }
          }
          wb.StyleItem.FrameItem.Height = null
          wbHTML.style.height = 'fit-content'
          wbHTML.style.minHeight = null
          wbHTML.setAttribute('height-type', 'fit')
        }
        break
      case 'fill':
        if (parent_wbase) {
          if (
            !parentHTML.style.height ||
            parentHTML.style.height == 'fit-content'
          ) {
            if (parentHTML.classList.contains('w-col')) {
              parent_wbase.StyleItem.FrameItem.Height = parentHTML.offsetHeight
              parentHTML.style.height = `${parentHTML.offsetHeight}px`
              list_update.push(parent_wbase)
            } else {
              let fillChild = [
                ...parentHTML.querySelectorAll(
                  `.wbaseItem-value[level="${
                    parent_wbase.Level + 1
                  }"]:not(*[height-type="fill"])`
                )
              ]
              if (
                fillChild.every(e => selected_list.some(wb => e.id === wb.GID))
              ) {
                parent_wbase.StyleItem.FrameItem.Height =
                  parentHTML.offsetHeight
                parentHTML.style.height = `${parentHTML.offsetHeight}px`
                list_update.push(parent_wbase)
              }
            }
          }
          for (let wb of selected_list) {
            let wbHTML = wb.value
            wb.StyleItem.FrameItem.Height =
              wbHTML.offsetHeight === 0 ? -1 : -wbHTML.offsetHeight
            wbHTML.style.height = '100%'
            wbHTML.setAttribute('height-type', 'fill')
          }
        } else return
        break
      default:
        break
    }
  }
  WBaseDA.edit(list_update, enumObj)
  setTimeout(updateUISelectBox, 20)
}

async function addAutoLayout () {
  let new_auto_layout = {
    GID: uuidv4(),
    Name: 'new layout',
    Alignment: 'Center',
    Direction: select_box.w > select_box.h ? 'Horizontal' : 'Vertical',
    ChildSpace: 8.0,
    IsScroll: false,
    IsWrap: false,
    RunSpace: 0.0,
    CountItem: 1
  }
  let new_padding_item = {
    GID: uuidv4(),
    Top: 8,
    Left: 8,
    Right: 8,
    Bottom: 8
  }
  if (
    selected_list.length === 1 &&
    EnumCate.extend_frame.some(cate => cate === selected_list[0].CateID) &&
    !selected_list[0].WAutolayoutItem
  ) {
    let eHTML = selected_list[0].value
    selected_list[0].AutoLayoutID = new_auto_layout.GID
    selected_list[0].WAutolayoutItem = new_auto_layout
    if (!selected_list[0].StyleItem.PaddingItem) {
      selected_list[0].StyleItem.PaddingID = null
      selected_list[0].StyleItem.PaddingItem = new_padding_item
    } else {
      selected_list[0].StyleItem.PaddingItem.Top = 8
      selected_list[0].StyleItem.PaddingItem.Left = 8
      selected_list[0].StyleItem.PaddingItem.Right = 8
      selected_list[0].StyleItem.PaddingItem.Bottom = 8
    }
    eHTML.style.setProperty('--padding', '8px')
    if (
      selected_list[0].Level === 1 &&
      new_auto_layout.Direction === 'Horizontal'
    ) {
      selected_list[0].StyleItem.FrameItem.Width = eHTML.offsetWidth
      if (selected_list[0].CountChild > 0)
        selected_list[0].StyleItem.FrameItem.Height = null
      eHTML.style.width = eHTML.offsetWidth + 'px'
    } else if (
      selected_list[0].Level === 1 &&
      new_auto_layout.Direction === 'Vertical'
    ) {
      if (selected_list[0].CountChild > 0)
        selected_list[0].StyleItem.FrameItem.Width = null
      selected_list[0].StyleItem.FrameItem.Height = eHTML.offsetHeight
      eHTML.style.height = eHTML.offsetHeight + 'px'
    } else if (
      selected_list[0].CountChild > 0 &&
      !(
        select_box_parentID === wbase_parentID &&
        selected_list[0].value.querySelectorAll('.col-').length > 0
      )
    ) {
      if (!(selected_list[0].StyleItem.FrameItem.Width < 0)) {
        selected_list[0].StyleItem.FrameItem.Width = null
        eHTML.style.width = 'fit-content'
      }
      if (!(selected_list[0].StyleItem.FrameItem.Height < 0)) {
        selected_list[0].StyleItem.FrameItem.Height = null
        eHTML.style.height = 'fit-content'
      }
    }
    handleStyleLayout(selected_list[0])
    WBaseDA.edit(selected_list, EnumObj.padddingWbaseFrame)
    selected_list[0].StyleItem.PaddingID = new_padding_item.GID
    addSelectList(selected_list)
  } else {
    let list_update = [...selected_list]
    let newWb = JSON.parse(JSON.stringify(WBaseDefault.frame))
    newWb.WAutolayoutItem = new_auto_layout
    newWb.StyleItem.PaddingItem = new_padding_item
    newWb = createNewWbase(newWb)[0]
    newWb.StyleItem.PositionItem.Left = `${Math.min(
      ...selected_list.map(e => getWBaseOffset(e).x)
    ).toFixed(2)}px`
    newWb.StyleItem.PositionItem.Top = `${Math.min(
      ...selected_list.map(e => getWBaseOffset(e).y)
    ).toFixed(2)}px`
    newWb.CountChild = selected_list.length
    newWb.ListChildID = selected_list.map(e => e.GID)
    if (selected_list.some) {
      document.styleSheets
    }
    if (
      !(
        select_box_parentID === wbase_parentID &&
        selected_list.every(wb => wb.value.querySelectorAll('.col-').length > 0)
      )
    ) {
      newWb.StyleItem.FrameItem.Width = null
      newWb.StyleItem.FrameItem.Height = null
    } else {
      newWb.StyleItem.FrameItem.Width = select_box.w / scale
      newWb.StyleItem.FrameItem.Height = select_box.h / scale
    }
    newWb.ParentID = selected_list[0].ParentID
    newWb.ListID = selected_list[0].ListID
    newWb.Sort = selected_list[0].Sort
    newWb.Level = selected_list[0].Level
    for (let i = 0; i < selected_list.length; i++) {
      let eHTML = selected_list[i].value
      selected_list[i].ParentID = newWb.GID
      selected_list[i].ListID += `,${newWb.GID}`
      selected_list[i].Sort = i
      selected_list[i].Level = selected_list[i].ListID.split(',').length
      eHTML.setAttribute('level', selected_list[i].Level)
      eHTML.setAttribute('listid', selected_list[i].ListID)
      eHTML.style.zIndex = i
      eHTML.style.order = i
      if (selected_list[i].CountChild > 0) {
        for (let childSelect of wbase_list.filter(e =>
          e.ListID.includes(selected_list[i].GID)
        )) {
          let thisListID = childSelect.ListID.split(',')
          thisListID = thisListID.slice(
            thisListID.indexOf(selected_list[i].GID)
          )
          thisListID.unshift(...selected_list[i].ListID.split(','))
          childSelect.ListID = thisListID.join(',')
          childSelect.Level = thisListID.length
          childSelect.value.setAttribute('level', childSelect.Level)
          childSelect.value.setAttribute('listid', childSelect.ListID)
        }
      }
    }
    await initComponents(newWb, selected_list)
    wbase_list.push(newWb)
    list_update.push(newWb)
    if (newWb.ParentID != wbase_parentID) {
      let parent_wbase = wbase_list.find(e => e.GID === newWb.ParentID)
      list_update.push(parent_wbase)
      parent_wbase.CountChild += 1 - selected_list.length
      let parentHTML = document.getElementById(newWb.ParentID)
      if (parentHTML.getAttribute('cateid') == EnumCate.table) {
        let cellList = parent_wbase.TableRows.reduce((a, b) => a.concat(b))
        let availableCell = cellList.find(cd =>
          cd.contentid.includes(selected_list[0].GID)
        )
        parentHTML
          .querySelector(
            `:scope > .table-row > .table-cell[id="${availableCell.id}"]`
          )
          .appendChild(newWb.value)
        cellList.forEach(cd => {
          cd.contentid = cd.contentid
            .split(',')
            .filter(id => selected_list.every(e => e.GID !== id))
            .join(',')
          if (cd.id === availableCell.id) cd.contentid = newWb.GID
        })
      } else if (!window.getComputedStyle(parentHTML).display.match('flex')) {
        initPositionStyle(newWb)
        parentHTML.appendChild(newWb.value)
      } else {
        parentHTML.appendChild(newWb.value)
      }
      let childrenHTML = [
        ...parentHTML.querySelectorAll(
          `.wbaseItem-value[level="${
            parseInt(parentHTML.getAttribute('level') ?? '0') + 1
          }"]`
        )
      ]
      childrenHTML.sort(
        (a, b) => parseInt(a.style.zIndex) - parseInt(b.style.zIndex)
      )
      parent_wbase.ListChildID = childrenHTML.map(e => e.id)
    }
    arrange()
    replaceAllLyerItemHTML()
    addSelectList([newWb])
    WBaseDA.add(list_update, null, EnumEvent.parent, EnumObj.wBase)
  }
}

function editLayoutStyle (auto_layout_item) {
  let list_update = []
  let _enumObj = EnumObj.autoLayout
  if (auto_layout_item.Direction) {
    // TH user muốn cập nhật layout từ dạng chiều ngang sang chiều dọc
    if (auto_layout_item.Direction == 'Vertical') {
      // lấy ra danh sách wbase item parent đang autoLayout theo chiều ngang
      let list_layout_horizontal = selected_list.filter(
        e => e.WAutolayoutItem.Direction != 'Vertical'
      )
      list_update.push(...list_layout_horizontal)
      for (let wbaseItem of list_layout_horizontal) {
        // gán lại chiều autoLayout của wbase item này sang chiều dọc
        wbaseItem.WAutolayoutItem.Direction = 'Vertical'
        let elementHTML = wbaseItem.value
        let _layout = wbaseItem.WAutolayoutItem
        // TH kiểu align trong autoLayout là spacebetween thì phải cập nhật cả dạng align cho autoLayout của wbase item này
        if (_layout.Alignment.includes('SpaceBetween')) {
          // align TopSpaceBetween => SpaceBetweenLeft
          if (_layout.Alignment.includes('Top'))
            _layout.Alignment = 'SpaceBetweenLeft'
          // align BottomSpaceBetween => SpaceBetweenRight
          if (_layout.Alignment.includes('Bottom'))
            _layout.Alignment = 'SpaceBetweenRight'
        }
        handleStyleLayout(wbaseItem)
        let frame = wbaseItem.StyleItem.FrameItem
        let parent_item = wbase_list.find(e => e.GID == wbaseItem.ParentID)
        // đảo ngược thuộc tính của resizing ( thuộc tính của width height ) của wbase item này
        //
        //TH width của wbase item này đang hug contents thì height của wbase item này phải chuyển về dạng hug contents
        if (frame.Width == undefined) {
          // TH height của wbase item này dạng fill container thì phải chuyển width của wbase item này về dạng fill container
          if (frame.Height < 0) {
            _enumObj = EnumObj.autoLayoutFrame
            //TH đang có wbase item parent của item này đang hug contents width thì lúc này bắt buộc phải chuyển width của nó từ hug sang fixed
            if (parent_item.StyleItem.FrameItem.Width == undefined) {
              parent_item.StyleItem.FrameItem.Width =
                elementHTML.parentElement.offsetWidth
              elementHTML.parentElement.style.width = `${elementHTML.parentElement.offsetWidth}px`
              list_update.push(parent_item)
            }
            frame.Width = -elementHTML.offsetWidth
            elementHTML.style.width = '100%'
          }
          // TH height của wbase item này dạng fixed thì phải chuyển width của wbase item này về dạng fixed
          else if (frame.Height != undefined) {
            _enumObj = EnumObj.autoLayoutFrame
            frame.Width = elementHTML.offsetWidth
            elementHTML.style.width = `${elementHTML.offsetWidth}px`
          }
          // gán height của wbase item này null để hug contents
          frame.Height = undefined
          elementHTML.style.height = 'fit-content'
          //TH đang có bất kì wbase item con của item này đang fill container height thì phải chuyển height của nó về fixed
          let list_child_fillH = wbase_list.filter(
            e =>
              e.ParentID == elementHTML.id && e.StyleItem.FrameItem.Height < 0
          )
          list_update.push(...list_child_fillH)
          for (let j = 0; j < list_child_fillH.length; j++) {
            let child_elementHTML = document.getElementById(
              list_child_fillH[j].GID
            )
            list_child_fillH[j].StyleItem.FrameItem.Height =
              child_elementHTML.offsetHeight
            child_elementHTML.style.height = `${child_elementHTML.offsetHeight}px`
          }
        }
        //TH width của wbase item này đang fill container thì height của wbase item này phải chuyển về dạng fill container
        else if (frame.Width < 0) {
          _enumObj = EnumObj.autoLayoutFrame
          //TH đang có wbase item parent của item này đang hug contents height thì lúc này bắt buộc phải chuyển height của nó từ hug sang fixed
          if (parent_item.StyleItem.FrameItem.Height == undefined) {
            list_update.push(parent_item)
            parent_item.StyleItem.FrameItem.Height =
              elementHTML.parentElement.offsetHeight
            elementHTML.parentElement.style.height = `${elementHTML.parentElement.offsetHeight}px`
          }
          elementHTML.style.height = '100%'
          // TH height của wbase item này dạng hug contents thì phải chuyển width của wbase item này về dạng hug contents
          if (frame.Height == undefined) {
            frame.Width = undefined
            elementHTML.style.width = 'fit-content'
            //TH đang có bất kì wbase item con của item này đang fill container width thì phải chuyển width của nó về fixed
            let list_child_fillW = wbase_list.filter(
              e =>
                e.ParentID == elementHTML.id && e.StyleItem.FrameItem.Width < 0
            )
            list_update.push(...list_child_fillW)
            for (let j = 0; j < list_child_fillW.length; j++) {
              let child_elementHTML = document.getElementById(
                list_child_fillW[j].GID
              )
              list_child_fillW[j].StyleItem.FrameItem.Width =
                child_elementHTML.offsetWidth
              child_elementHTML.style.width = `${child_elementHTML.offsetWidth}px`
            }
          } else if (frame.Height > 0) {
            frame.Width = elementHTML.offsetWidth
            elementHTML.style.width = `${elementHTML.offsetWidth}px`
          }
          frame.Height = -elementHTML.offsetHeight
        }
      }
    }
    // TH user muốn cập nhật layout từ dạng chiều dọc sang chiều ngang
    else {
      // lấy ra danh sách wbase item parent đang autoLayout theo chiều dọc
      let list_layout_vertical = selected_list.filter(
        e => e.WAutolayoutItem.Direction != 'Horizontal'
      )
      list_update.push(...list_layout_vertical)
      for (let wbaseItem of list_layout_vertical) {
        wbaseItem.WAutolayoutItem.Direction = 'Horizontal'
        let elementHTML = wbaseItem.value
        let _layout = wbaseItem.WAutolayoutItem
        // TH kiểu align trong autoLayout là spacebetween thì phải cập nhật cả dạng align cho autoLayout của wbase item này
        if (_layout.Alignment.includes('SpaceBetween')) {
          // align SpaceBetweenLeft => TopSpaceBetween
          if (_layout.Alignment.includes('Left'))
            _layout.Alignment = 'TopSpaceBetween'
          // align SpaceBetweenRight => BottomSpaceBetween
          if (_layout.Alignment.includes('Right'))
            _layout.Alignment = 'BottomSpaceBetween'
        }
        handleStyleLayout(wbaseItem)
        let frame = wbaseItem.StyleItem.FrameItem
        let parent_item = wbase_list.find(e => e.GID == wbaseItem.ParentID)
        // đảo ngược thuộc tính của resizing ( thuộc tính của width height ) của wbase item này
        //
        //TH height của wbase item này đang hug contents thì width của wbase item này phải chuyển về dạng hug contents
        if (frame.Height == undefined) {
          _enumObj = EnumObj.autoLayoutFrame
          // TH width của wbase item này dạng fill container thì phải chuyển height của wbase item này về dạng fill container
          if (frame.Width < 0) {
            frame.Height = -elementHTML.offsetHeight
            elementHTML.style.height = '100%'
            //TH đang có wbase item parent của item này đang hug contents height thì lúc này bắt buộc phải chuyển height của nó từ hug sang fixed
            if (parent_item.StyleItem.FrameItem.Height == undefined) {
              list_update.push(parent_item)
              parent_item.StyleItem.FrameItem.Height =
                elementHTML.parentElement.offsetHeight
              elementHTML.parentElement.style.height = `${elementHTML.parentElement.offsetHeight}px`
            }
          }
          // TH width của wbase item này dạng fixed thì phải chuyển height của wbase item này về dạng fixed
          else if (frame.Width > 0) {
            frame.Height = elementHTML.offsetHeight
            elementHTML.style.height = `${elementHTML.offsetHeight}px`
          }
          // gán width của wbase item này null để hug contents
          frame.Width = undefined
          elementHTML.style.width = 'fit-content'
          //TH đang có bất kì wbase item con của item này đang fill container width thì phải chuyển width của nó về fixed
          let list_child_fillW = wbase_list.filter(
            e => e.ParentID == elementHTML.id && e.StyleItem.FrameItem.Width < 0
          )
          list_update.push(...list_child_fillW)
          for (let j = 0; j < list_child_fillW.length; j++) {
            let child_elementHTML = document.getElementById(
              list_child_fillW[j].GID
            )
            list_child_fillW[j].StyleItem.FrameItem.Width =
              child_elementHTML.offsetWidth
            child_elementHTML.style.width = `${child_elementHTML.offsetWidth}px`
          }
        }
        //TH height của wbase item này đang fill container thì width của wbase item này phải chuyển về dạng fill container
        else if (frame.Height < 0) {
          _enumObj = EnumObj.autoLayoutFrame
          //TH đang có wbase item parent của item này đang hug contents width thì lúc này bắt buộc phải chuyển width của nó từ hug sang fixed
          if (parent_item.StyleItem.FrameItem.Width == undefined) {
            list_update.push(parent_item)
            parent_item.StyleItem.FrameItem.Width =
              elementHTML.parentElement.offsetWidth
            elementHTML.parentElement.style.width = `${elementHTML.parentElement.offsetWidth}px`
          }
          elementHTML.style.width = '100%'
          // TH width của wbase item này dạng hug contents thì phải chuyển height của wbase item này về dạng hug contents
          if (frame.Width == undefined) {
            frame.Height = undefined
            elementHTML.style.height = 'fit-content'
            //TH đang có bất kì wbase item con của item này đang fill container width thì phải chuyển height của nó về fixed
            let list_child_fillH = wbase_list.filter(
              e =>
                e.parentId == elementHTML.id && e.StyleItem.FrameItem.Height < 0
            )
            list_update.push(...list_child_fillH)
            for (let j = 0; j < list_child_fillH.length; j++) {
              let child_elementHTML = document.getElementById(
                list_child_fillH[j].GID
              )
              list_child_fillH[j].StyleItem.FrameItem.Height =
                child_elementHTML.offsetHeight
              child_elementHTML.style.height = `${child_elementHTML.offsetHeight}px`
            }
          } else if (frame.Width > 0) {
            frame.Height = elementHTML.offsetHeight
            elementHTML.style.height = `${elementHTML.offsetHeight}px`
          }
          frame.Width = -elementHTML.offsetWidth
        }
      }
    }
  }
  if (auto_layout_item.Alignment) {
    list_update.push(...selected_list)
    switch (auto_layout_item.Alignment) {
      case 'TopLeft':
        for (let i = 0; i < selected_list.length; i++) {
          selected_list[i].WAutolayoutItem.Alignment = 'TopLeft'
          selected_list[i].value.style.setProperty(
            '--main-axis-align',
            wMainAxis(
              'TopLeft',
              selected_list[i].WAutolayoutItem.Direction === 'Horizontal'
            )
          )
          selected_list[i].value.style.setProperty(
            '--cross-axis-align',
            wCrossAxis(
              'TopLeft',
              selected_list[i].WAutolayoutItem.Direction === 'Horizontal'
            )
          )
        }
        break
      case 'TopCenter':
        for (let i = 0; i < selected_list.length; i++) {
          selected_list[i].WAutolayoutItem.Alignment = 'TopCenter'
          selected_list[i].value.style.setProperty(
            '--main-axis-align',
            wMainAxis(
              'TopCenter',
              selected_list[i].WAutolayoutItem.Direction === 'Horizontal'
            )
          )
          selected_list[i].value.style.setProperty(
            '--cross-axis-align',
            wCrossAxis(
              'TopCenter',
              selected_list[i].WAutolayoutItem.Direction === 'Horizontal'
            )
          )
        }
        break
      case 'TopRight':
        for (let i = 0; i < selected_list.length; i++) {
          selected_list[i].WAutolayoutItem.Alignment = 'TopRight'
          selected_list[i].value.style.setProperty(
            '--main-axis-align',
            wMainAxis(
              'TopRight',
              selected_list[i].WAutolayoutItem.Direction === 'Horizontal'
            )
          )
          selected_list[i].value.style.setProperty(
            '--cross-axis-align',
            wCrossAxis(
              'TopRight',
              selected_list[i].WAutolayoutItem.Direction === 'Horizontal'
            )
          )
        }
        break
      case 'LeftCenter':
        for (let i = 0; i < selected_list.length; i++) {
          selected_list[i].WAutolayoutItem.Alignment = 'LeftCenter'
          selected_list[i].value.style.setProperty(
            '--main-axis-align',
            wMainAxis(
              'LeftCenter',
              selected_list[i].WAutolayoutItem.Direction === 'Horizontal'
            )
          )
          selected_list[i].value.style.setProperty(
            '--cross-axis-align',
            wCrossAxis(
              'LeftCenter',
              selected_list[i].WAutolayoutItem.Direction === 'Horizontal'
            )
          )
        }
        break
      case 'Center':
        for (let i = 0; i < selected_list.length; i++) {
          selected_list[i].WAutolayoutItem.Alignment = 'Center'
          selected_list[i].value.style.setProperty(
            '--main-axis-align',
            wMainAxis(
              'Center',
              selected_list[i].WAutolayoutItem.Direction === 'Horizontal'
            )
          )
          selected_list[i].value.style.setProperty(
            '--cross-axis-align',
            wCrossAxis(
              'Center',
              selected_list[i].WAutolayoutItem.Direction === 'Horizontal'
            )
          )
        }
        break
      case 'RightCenter':
        for (let i = 0; i < selected_list.length; i++) {
          selected_list[i].WAutolayoutItem.Alignment = 'RightCenter'
          selected_list[i].value.style.setProperty(
            '--main-axis-align',
            wMainAxis(
              'RightCenter',
              selected_list[i].WAutolayoutItem.Direction === 'Horizontal'
            )
          )
          selected_list[i].value.style.setProperty(
            '--cross-axis-align',
            wCrossAxis(
              'RightCenter',
              selected_list[i].WAutolayoutItem.Direction === 'Horizontal'
            )
          )
        }
        break
      case 'BottomLeft':
        for (let i = 0; i < selected_list.length; i++) {
          selected_list[i].WAutolayoutItem.Alignment = 'BottomLeft'
          selected_list[i].value.style.setProperty(
            '--main-axis-align',
            wMainAxis(
              'BottomLeft',
              selected_list[i].WAutolayoutItem.Direction === 'Horizontal'
            )
          )
          selected_list[i].value.style.setProperty(
            '--cross-axis-align',
            wCrossAxis(
              'BottomLeft',
              selected_list[i].WAutolayoutItem.Direction === 'Horizontal'
            )
          )
        }
        break
      case 'BottomCenter':
        for (let i = 0; i < selected_list.length; i++) {
          selected_list[i].WAutolayoutItem.Alignment = 'BottomCenter'
          selected_list[i].value.style.setProperty(
            '--main-axis-align',
            wMainAxis(
              'BottomCenter',
              selected_list[i].WAutolayoutItem.Direction === 'Horizontal'
            )
          )
          selected_list[i].value.style.setProperty(
            '--cross-axis-align',
            wCrossAxis(
              'BottomCenter',
              selected_list[i].WAutolayoutItem.Direction === 'Horizontal'
            )
          )
        }
        break
      case 'BottomRight':
        for (let i = 0; i < selected_list.length; i++) {
          selected_list[i].WAutolayoutItem.Alignment = 'BottomRight'
          selected_list[i].value.style.setProperty(
            '--main-axis-align',
            wMainAxis(
              'BottomRight',
              selected_list[i].WAutolayoutItem.Direction === 'Horizontal'
            )
          )
          selected_list[i].value.style.setProperty(
            '--cross-axis-align',
            wCrossAxis(
              'BottomRight',
              selected_list[i].WAutolayoutItem.Direction === 'Horizontal'
            )
          )
        }
        break
      default:
        if (
          auto_layout_item.Alignment == 'TopSpaceBetween' ||
          auto_layout_item.Alignment == 'SpaceBetweenLeft'
        ) {
          for (let i = 0; i < selected_list.length; i++) {
            let is_horizontal =
              selected_list[i].WAutolayoutItem.Direction == 'Horizontal'
            if (is_horizontal) {
              selected_list[i].WAutolayoutItem.Alignment = 'TopSpaceBetween'
            } else {
              selected_list[i].WAutolayoutItem.Alignment = 'SpaceBetweenLeft'
            }
            handleStyleLayout(selected_list[i])
          }
        } else if (auto_layout_item.Alignment == 'SpaceBetweenCenter') {
          for (let i = 0; i < selected_list.length; i++) {
            selected_list[i].WAutolayoutItem.Alignment = 'SpaceBetweenCenter'
            handleStyleLayout(selected_list[i])
          }
        } else {
          for (let i = 0; i < selected_list.length; i++) {
            let is_horizontal =
              selected_list[i].WAutolayoutItem.Airection == 'Horizontal'
            if (is_horizontal) {
              selected_list[i].WAutolayoutItem.Alignment = 'BottomSpaceBetween'
            } else {
              selected_list[i].WAutolayoutItem.Alignment = 'SpaceBetweenRight'
            }
            handleStyleLayout(selected_list[i])
          }
        }
        break
    }
  }
  if (auto_layout_item.ChildSpace != undefined) {
    list_update.push(...selected_list)
    // thực hiện update cho list frame hoặc form có autoLayout
    for (let wbaseItem of selected_list) {
      let elementHTML = wbaseItem.value
      // update giá trị childSpace mới ( khoảng cách giữa các phần tử con )
      wbaseItem.WAutolayoutItem.ChildSpace = auto_layout_item.ChildSpace
      let is_horizontal = wbaseItem.WAutolayoutItem.Direction == 'Horizontal'
      // TH align của layout này đang ở dạng spaceBetween thì phải cập nhật đồng thời align của layout về khác dạng spaceBetween
      if (wbaseItem.WAutolayoutItem.Alignment.includes('SpaceBetween')) {
        // TH layout theo chiều ngang
        if (wbaseItem.WAutolayoutItem.Direction == 'Horizontal') {
          wbaseItem.WAutolayoutItem.Alignment =
            wbaseItem.WAutolayoutItem.Alignment.replace('SpaceBetween', 'Left')
        }
        // TH layout theo chiều dọc
        else {
          wbaseItem.WAutolayoutItem.Alignment =
            wbaseItem.WAutolayoutItem.Alignment.replace('SpaceBetween', 'Top')
        }
      }
      elementHTML.style.setProperty(
        '--child-space',
        `${auto_layout_item.ChildSpace}px`
      )
      elementHTML
        .querySelectorAll(`.col-[level="${wbaseItem.Level + 1}"]`)
        .forEach(childCol => {
          childCol.style.setProperty(
            '--gutter',
            `${auto_layout_item.ChildSpace}px`
          )
        })
    }
  }
  if (auto_layout_item.IsWrap != undefined) {
    list_update.push(...selected_list)
    for (let wbaseItem of selected_list) {
      wbaseItem.WAutolayoutItem.IsWrap = auto_layout_item.IsWrap
      handleStyleLayout(wbaseItem)
      if (auto_layout_item.IsWrap) {
        if (wbaseItem.WAutolayoutItem.Direction === 'Vertical') {
          if (wbaseItem.StyleItem.FrameItem.Height == undefined) {
            _enumObj = EnumObj.autoLayoutFrame
            wbaseItem.StyleItem.FrameItem.Height = parseFloat(
              window.getComputedStyle(wbaseItem.value).height.replace('px')
            )
            wbaseItem.value.style.height =
              wbaseItem.StyleItem.FrameItem.Height + 'px'
          }
          if (wbaseItem.CountChild > 0) {
            let listFillWChild = [
              ...wbaseItem.value.querySelectorAll(':scope > .wbaseItem-value')
            ].filter(childHTML => childHTML.style.width == '100%')
            listFillWChild.forEach(childHTML => {
              let childItem = wbase_list.find(e => e.GID === childHTML.id)
              childItem.StyleItem.FrameItem.Width = childHTML.offsetWidth
              childHTML.style.width = childItem.StyleItem.FrameItem.Width + 'px'
              list_update.push(childItem)
            })
          }
        } else {
          if (wbaseItem.StyleItem.FrameItem.Width == undefined) {
            _enumObj = EnumObj.autoLayoutFrame
            wbaseItem.StyleItem.FrameItem.Width = parseFloat(
              window.getComputedStyle(wbaseItem.value).width.replace('px')
            )
            wbaseItem.value.style.width =
              wbaseItem.StyleItem.FrameItem.Width + 'px'
          }
          if (wbaseItem.CountChild > 0) {
            let listFillHChild = [
              ...wbaseItem.value.querySelectorAll(
                `.wbaseItem-value[level="${wbaseItem.Level + 1}"]`
              )
            ].filter(childHTML => childHTML.style.height == '100%')
            listFillHChild.forEach(childHTML => {
              let childItem = wbase_list.find(e => e.GID === childHTML.id)
              childItem.StyleItem.FrameItem.Height = childHTML.offsetHeight
              childHTML.style.height =
                childItem.StyleItem.FrameItem.Height + 'px'
              list_update.push(childItem)
            })
          }
        }
      }
    }
  }
  if (auto_layout_item.RunSpace != undefined) {
    list_update.push(...selected_list)
    // thực hiện update cho list frame hoặc form có autoLayout
    for (let wbaseItem of selected_list) {
      let elementHTML = wbaseItem.value
      // update giá trị RunSpace mới ( khoảng cách giữa các phần tử con )
      wbaseItem.WAutolayoutItem.RunSpace = auto_layout_item.RunSpace
      elementHTML.style.setProperty(
        '--run-space',
        `${auto_layout_item.RunSpace}px`
      )
    }
  }
  if (auto_layout_item.IsScroll != undefined) {
    list_update.push(...selected_list)
    for (let wbaseItem of selected_list) {
      let elementHTML = wbaseItem.value
      wbaseItem.WAutolayoutItem.IsScroll = auto_layout_item.IsScroll
      if (auto_layout_item.IsScroll) {
        elementHTML.setAttribute('scroll', 'true')
      } else {
        elementHTML.removeAttribute('scroll', 'true')
      }
    }
  }
  WBaseDA.edit(list_update, _enumObj)
  updateUISelectBox()
}

function removeLayout () {
  let listUpdate = []
  let listLayout = selected_list.filter(e => e.WAutolayoutItem)
  for (let wbaseItem of listLayout) {
    let eHTML = wbaseItem.value
    let eHTMLRect = eHTML.getBoundingClientRect()
    let offseteHTMLRect = offsetScale(eHTMLRect.x, eHTMLRect.y)
    let currentSize = {
      width: eHTML.offsetWidth,
      height: eHTML.offsetHeight
    }
    wbaseItem.AutoLayoutID = null
    wbaseItem.WAutolayoutItem = null
    if (eHTML.style.width == 'fit-content') {
      wbaseItem.StyleItem.FrameItem.Width = currentSize.width
      eHTML.style.width = currentSize.width + 'px'
    }
    if (eHTML.style.height == 'fit-content') {
      wbaseItem.StyleItem.FrameItem.Height = currentSize.height
      eHTML.style.height = currentSize.height + 'px'
    }
    let wbaseChildren = wbase_list.filter(e => e.ParentID == wbaseItem.GID)
    for (let childWbase of wbaseChildren) {
      let childHTML = document.getElementById(childWbase.GID)
      let childRect = childHTML.getBoundingClientRect()
      let childCurrentSize = {
        width: childHTML.offsetWidth,
        height: childHTML.offsetHeight
      }
      let childOffset = offsetScale(childRect.x, childRect.y)
      childWbase.StyleItem.PositionItem.Left = `${Math.round(
        childOffset.x - offseteHTMLRect.x
      )}px`
      childWbase.StyleItem.PositionItem.Top = `${Math.round(
        childOffset.y - offseteHTMLRect.y
      )}px`

      if (childHTML.style.width == '100%') {
        childWbase.StyleItem.FrameItem.Width = childCurrentSize.width
        childHTML.style.width = childCurrentSize.width + 'px'
      }
      if (childHTML.style.height == '100%') {
        childWbase.StyleItem.FrameItem.Height = childCurrentSize.height
        childHTML.style.height = childCurrentSize.height + 'px'
      }
    }
    wbaseChildren.forEach(childWbase => initPositionStyle(childWbase))
    removeAutoLayoutProperty(eHTML)
    listUpdate.push(wbaseItem, ...wbaseChildren)
  }
  WBaseDA.edit(listUpdate, EnumObj.basePositionFrame)
}

function inputPadding (padding_item) {
  for (let wbaseItem of selected_list) {
    if (padding_item.Left != undefined) {
      wbaseItem.StyleItem.PaddingItem.Left = padding_item.Left
      handleStyleLayout(wbaseItem, true)
    }
    if (padding_item.Top != undefined) {
      wbaseItem.StyleItem.PaddingItem.Top = padding_item.Top
      handleStyleLayout(wbaseItem, true)
    }
    if (padding_item.Right != undefined) {
      wbaseItem.StyleItem.PaddingItem.Right = padding_item.Right
      handleStyleLayout(wbaseItem, true)
    }
    if (padding_item.Bottom != undefined) {
      wbaseItem.StyleItem.PaddingItem.Bottom = padding_item.Bottom
      handleStyleLayout(wbaseItem, true)
    }
  }
  WBaseDA.edit(selected_list, EnumObj.paddingPosition)
  updateUISelectBox()
}

function addBorder () {
  let border_skin = selected_list.find(
    e => e.StyleItem.DecorationItem.BorderItem?.IsStyle
  )
  if (border_skin) {
    border_skin = border_skin.StyleItem.DecorationItem.BorderItem
  }
  let list_add_border = selected_list.filter(
    e => e.StyleItem.DecorationItem.BorderItem == undefined
  )
  for (let i = 0; i < list_add_border.length; i++) {
    let elementHTML = document.getElementById(list_add_border[i].GID)
    let new_border_skin = border_skin
    if (!new_border_skin) {
      let new_borderID = uuidv4()
      new_border_skin = {
        GID: new_borderID,
        Name: 'new border',
        BorderStyle: BorderStyle.solid,
        IsStyle: false,
        ColorValue: '000000FF',
        BorderSide: BorderSide.all,
        Width: '1 1 1 1'
      }
    }
    list_add_border[i].StyleItem.DecorationItem.BorderID = new_border_skin.GID
    list_add_border[i].StyleItem.DecorationItem.BorderItem = new_border_skin
    let list_width = new_border_skin.Width.split(' ')
    elementHTML.style.borderTopWidth = list_width[0] + 'px'
    elementHTML.style.borderRightWidth = list_width[1] + 'px'
    elementHTML.style.borderBottomWidth = list_width[2] + 'px'
    elementHTML.style.borderLeftWidth = list_width[3] + 'px'
    elementHTML.style.borderStyle = new_border_skin.BorderStyle
    let border_color = new_border_skin.ColorValue
    elementHTML.style.borderColor = `#${border_color}`
  }
  WBaseDA.addStyle(list_add_border, EnumObj.border)
  updateUISelectBox()
}

function deleteBorder () {
  let list_border_wbase = selected_list.filter(
    e => e.StyleItem.DecorationItem.BorderID
  )
  for (let i = 0; i < list_border_wbase.length; i++) {
    let elementHTML = document.getElementById(list_border_wbase[i].GID)
    list_border_wbase[i].StyleItem.DecorationItem.BorderID = null
    list_border_wbase[i].StyleItem.DecorationItem.BorderItem = null
    elementHTML.style.border = null
    elementHTML.style.borderWidth = null
    elementHTML.style.borderStyle = null
    elementHTML.style.borderColor = null
  }
  WBaseDA.edit(list_border_wbase, EnumObj.decoration)
  updateUISelectBox()
}

function editBorder (border_item, onSubmit = true) {
  let list_border = []
  let _enumObj
  if (border_item.IsStyle) {
    _enumObj = EnumObj.decoration
    list_border = selected_list.filter(e => e.StyleItem.DecorationItem)
    for (let wb of list_border) {
      wb.StyleItem.DecorationItem.BorderID = border_item.GID
      wb.StyleItem.DecorationItem.BorderItem = border_item
      wb.value.style.borderWidth = `var(--border-width-${border_item.GID})`
      wb.value.style.borderStyle = `var(--border-style-${border_item.GID})`
      wb.value.style.borderColor = `var(--border-color-${border_item.GID})`
    }
  } else {
    _enumObj = EnumObj.border
    list_border = selected_list.filter(
      e => e.StyleItem.DecorationItem?.BorderItem
    )
    if (border_item.ColorValue != undefined) {
      let new_color_value = border_item.ColorValue
      let i
      for (i = 0; i < list_border.length; i++) {
        let eHTML = document.getElementById(list_border[i].GID)
        list_border[i].StyleItem.DecorationItem.BorderItem.ColorValue =
          new_color_value
        eHTML.style.borderColor = `#${new_color_value}`
      }
    }
    if (border_item.Width != undefined) {
      let i
      for (i = 0; i < list_border.length; i++) {
        let eHTML = document.getElementById(list_border[i].GID)
        let listWidth =
          list_border[i].StyleItem.DecorationItem.BorderItem.Width.split(' ')
        switch (list_border.BorderSide) {
          case BorderSide.top:
            listWidth[0] = border_item.Width
            break
          case BorderSide.right:
            listWidth[1] = border_item.Width
            break
          case BorderSide.bottom:
            listWidth[2] = border_item.Width
            break
          case BorderSide.left:
            listWidth[3] = border_item.Width
            break
          default: // all || custom
            list_border[i].StyleItem.DecorationItem.BorderItem.BorderSide =
              BorderSide.all
            listWidth = [
              border_item.Width,
              border_item.Width,
              border_item.Width,
              border_item.Width
            ]
            break
        }
        list_border[i].StyleItem.DecorationItem.BorderItem.Width =
          listWidth.join(' ')
        eHTML.style.borderTopWidth = listWidth[0] + 'px'
        eHTML.style.borderRightWidth = listWidth[1] + 'px'
        eHTML.style.borderBottomWidth = listWidth[2] + 'px'
        eHTML.style.borderLeftWidth = listWidth[3] + 'px'
      }
    } else if (border_item.LeftWidth != undefined) {
      let i
      for (i = 0; i < list_border.length; i++) {
        let eHTML = document.getElementById(list_border[i].GID)
        let listWidth =
          list_border[i].StyleItem.DecorationItem.BorderItem.Width.split(' ')
        listWidth[3] = border_item.LeftWidth
        list_border[i].StyleItem.DecorationItem.BorderItem.Width =
          listWidth.join(' ')
        eHTML.style.borderLeftWidth = border_item.LeftWidth + 'px'
      }
    } else if (border_item.TopWidth != undefined) {
      let i
      for (i = 0; i < list_border.length; i++) {
        let eHTML = document.getElementById(list_border[i].GID)
        let listWidth =
          list_border[i].StyleItem.DecorationItem.BorderItem.Width.split(' ')
        listWidth[0] = border_item.TopWidth
        list_border[i].StyleItem.DecorationItem.BorderItem.Width =
          listWidth.join(' ')
        eHTML.style.borderTopWidth = border_item.TopWidth + 'px'
      }
    } else if (border_item.RightWidth != undefined) {
      let i
      for (i = 0; i < list_border.length; i++) {
        let eHTML = document.getElementById(list_border[i].GID)
        let listWidth =
          list_border[i].StyleItem.DecorationItem.BorderItem.Width.split(' ')
        listWidth[1] = border_item.RightWidth
        list_border[i].StyleItem.DecorationItem.BorderItem.Width =
          listWidth.join(' ')
        eHTML.style.borderRight = border_item.RightWidth + 'px'
      }
    } else if (border_item.BottomWidth != undefined) {
      let i
      for (i = 0; i < list_border.length; i++) {
        let eHTML = document.getElementById(list_border[i].GID)
        let listWidth =
          list_border[i].StyleItem.DecorationItem.BorderItem.Width.split(' ')
        listWidth[2] = border_item.BottomWidth
        list_border[i].StyleItem.DecorationItem.BorderItem.Width =
          listWidth.join(' ')
        eHTML.style.borderBottomWidth = border_item.BottomWidth + 'px'
      }
    }
    if (border_item.BorderSide != undefined) {
      let i
      for (i = 0; i < list_border.length; i++) {
        let eHTML = document.getElementById(list_border[i].GID)
        let listWidth = list_border[
          i
        ].StyleItem.DecorationItem.BorderItem.Width.split(' ').map(e =>
          parseFloat(e)
        )
        listWidth.sort((a, b) => b - a)
        switch (border_item.BorderSide) {
          case BorderSide.all:
            listWidth = [listWidth[0], listWidth[0], listWidth[0], listWidth[0]]
            break
          case BorderSide.left:
            listWidth = [0, 0, 0, listWidth[0]]
            break
          case BorderSide.top:
            listWidth = [listWidth[0], 0, 0, 0]
            break
          case BorderSide.right:
            listWidth = [0, listWidth[0], 0, 0]
            break
          case BorderSide.bottom:
            listWidth = [0, 0, listWidth[0], 0]
            break
          case BorderSide.custom:
            listWidth = list_border[
              i
            ].StyleItem.DecorationItem.BorderItem.Width.split(' ').map(e =>
              parseFloat(e)
            )
          default:
            break
        }
        list_border[i].StyleItem.DecorationItem.BorderItem.Width =
          listWidth.join(' ')
        list_border[i].StyleItem.DecorationItem.BorderItem.BorderSide =
          border_item.BorderSide
        eHTML.style.borderTopWidth = listWidth[0] + 'px'
        eHTML.style.borderRightWidth = listWidth[1] + 'px'
        eHTML.style.borderBottomWidth = listWidth[2] + 'px'
        eHTML.style.borderLeftWidth = listWidth[3] + 'px'
      }
    }
    if (border_item.BorderStyle) {
      for (let i = 0; i < list_border.length; i++) {
        let eHTML = document.getElementById(list_border[i].GID)
        eHTML.style.borderStyle = border_item.BorderStyle
        list_border[i].StyleItem.DecorationItem.BorderItem.BorderStyle =
          border_item.BorderStyle
      }
    }
  }
  if (onSubmit) {
    WBaseDA.edit(list_border, _enumObj)
  }
}

function editBorderSkin (border_item, thisSkin) {
  if (border_item.ColorValue != undefined) {
    thisSkin.ColorValue = border_item.ColorValue
    document.documentElement.style.setProperty(
      `--border-color-${thisSkin.GID}`,
      `#${thisSkin.ColorValue}`
    )
  }
  if (border_item.Width != undefined) {
    let listWidth = thisSkin.Width.split(' ')
    switch (thisSkin.BorderSide) {
      case BorderSide.top:
        listWidth[0] = border_item.Width
        break
      case BorderSide.right:
        listWidth[1] = border_item.Width
        break
      case BorderSide.bottom:
        listWidth[2] = border_item.Width
        break
      case BorderSide.left:
        listWidth[3] = border_item.Width
        break
      default: // all || custom
        thisSkin.BorderSide = BorderSide.all
        listWidth = [
          border_item.Width,
          border_item.Width,
          border_item.Width,
          border_item.Width
        ]
        break
    }
    thisSkin.Width = listWidth.join(' ')
    document.documentElement.style.setProperty(
      `--border-width-${thisSkin.GID}`,
      `${listWidth[0]}px ${listWidth[1]}px ${listWidth[2]}px ${listWidth[3]}px`
    )
  } else if (border_item.LeftWidth != undefined) {
    let listWidth = thisSkin.Width.split(' ')
    listWidth[3] = border_item.LeftWidth
    thisSkin.Width = listWidth.join(' ')
    document.documentElement.style.setProperty(
      `--border-width-${thisSkin.GID}`,
      `${listWidth[0]}px ${listWidth[1]}px ${listWidth[2]}px ${listWidth[3]}px`
    )
  } else if (border_item.TopWidth != undefined) {
    let listWidth = thisSkin.Width.split(' ')
    listWidth[0] = border_item.TopWidth
    thisSkin.Width = listWidth.join(' ')
    document.documentElement.style.setProperty(
      `--border-width-${thisSkin.GID}`,
      `${listWidth[0]}px ${listWidth[1]}px ${listWidth[2]}px ${listWidth[3]}px`
    )
  } else if (border_item.RightWidth != undefined) {
    let listWidth = thisSkin.Width.split(' ')
    listWidth[1] = border_item.RightWidth
    thisSkin.Width = listWidth.join(' ')
    document.documentElement.style.setProperty(
      `--border-width-${thisSkin.GID}`,
      `${listWidth[0]}px ${listWidth[1]}px ${listWidth[2]}px ${listWidth[3]}px`
    )
  } else if (border_item.BottomWidth != undefined) {
    let listWidth = thisSkin.Width.split(' ')
    listWidth[2] = border_item.BottomWidth
    thisSkin.Width = listWidth.join(' ')
    document.documentElement.style.setProperty(
      `--border-width-${thisSkin.GID}`,
      `${listWidth[0]}px ${listWidth[1]}px ${listWidth[2]}px ${listWidth[3]}px`
    )
  }
  if (border_item.BorderSide != undefined) {
    let listWidth = thisSkin.Width.split(' ').map(e => parseFloat(e))
    listWidth.sort((a, b) => b - a)
    switch (border_item.BorderSide) {
      case BorderSide.all:
        listWidth = [listWidth[0], listWidth[0], listWidth[0], listWidth[0]]
        break
      case BorderSide.left:
        listWidth = [0, 0, 0, listWidth[0]]
        break
      case BorderSide.top:
        listWidth = [listWidth[0], 0, 0, 0]
        break
      case BorderSide.right:
        listWidth = [0, listWidth[0], 0, 0]
        break
      case BorderSide.bottom:
        listWidth = [0, 0, listWidth[0], 0]
        break
      case BorderSide.custom:
        listWidth = thisSkin.Width.split(' ').map(e => parseFloat(e))
      default:
        break
    }
    thisSkin.Width = listWidth.join(' ')
    thisSkin.BorderSide = border_item.BorderSide
    document.documentElement.style.setProperty(
      `--border-width-${thisSkin.GID}`,
      `${listWidth[0]}px ${listWidth[1]}px ${listWidth[2]}px ${listWidth[3]}px`
    )
  }
  if (border_item.BorderStyle) {
    thisSkin.BorderStyle = border_item.BorderStyle
    document.documentElement.style.setProperty(
      `--border-style-${thisSkin.GID}`,
      thisSkin.BorderStyle
    )
  }
  if (border_item.Name) {
    let listName = border_item.Name.replace('\\', '/').split('/')
    if (listName.length <= 1) {
      if (listName.length == 1 && listName[0].trim() != '') {
        thisSkin.Name = listName[0]
      } else {
        thisSkin.Name = `#${thisSkin.ColorValue} - ${thisSkin.BorderStyle}`
      }
    } else {
      thisSkin.Name = listName.pop()
      let nameCate = listName.join(' ')
      let cateItem = CateDA.list_border_cate.find(
        e => e.Name.toLowerCase() == nameCate.toLowerCase()
      )
      if (cateItem) {
        thisSkin.CateID = cateItem.ID
      } else {
        let newCate = {
          ID: 0,
          Name: nameCate,
          ParentID: EnumCate.border
        }
        thisSkin.CateID = -1
        CateDA.add(newCate)
        return
      }
    }
  }
}

function unlinkBorderSkin () {
  let listBorder = selected_list.filter(
    e => e.StyleItem.DecorationItem.BorderItem
  )
  for (let wb of listBorder) {
    let currentBorder = wb.StyleItem.DecorationItem.BorderItem
    let newBorderItem = {
      GID: uuidv4(),
      Name: 'new border',
      BorderStyle: currentBorder.BorderStyle,
      IsStyle: false,
      ColorValue: currentBorder.ColorValue,
      BorderSide: currentBorder.BorderSide,
      Width: currentBorder.Width
    }
    wb.StyleItem.DecorationItem.BorderID = newBorderItem.GID
    wb.StyleItem.DecorationItem.BorderItem = newBorderItem
    let listWidth = newBorderItem.Width.split(' ')
    wb.value.style.borderWidth = `${listWidth[0]}px ${listWidth[1]}px ${listWidth[2]}px ${listWidth[3]}px`
    wb.value.style.borderStyle = newBorderItem.BorderStyle
    wb.value.style.borderColor = `#${newBorderItem.ColorValue}`
  }
  WBaseDA.addStyle(listBorder, EnumObj.border)
}

function addBackgroundColor () {
  let list_change_background = selected_list.filter(
    e => e.StyleItem.DecorationItem
  )
  for (let i = 0; i < list_change_background.length; i++) {
    let elementHTML = document.getElementById(list_change_background[i].GID)
    let new_color_value
    switch (list_change_background[i].CateID) {
      case EnumCate.frame:
        new_color_value = 'FFFFFFFF'
        break
      case EnumCate.form:
        new_color_value = 'FFFFFFFF'
        break
      case EnumCate.variant:
        new_color_value = 'FFFFFFFF'
        break
      default:
        new_color_value = 'FFD9D9D9'
        break
    }
    list_change_background[i].StyleItem.DecorationItem.ColorValue =
      new_color_value
    elementHTML.style.backgroundColor = `#${new_color_value}`
  }
  WBaseDA.edit(list_change_background, EnumObj.decoration)
}

async function deleteBackgroundColor () {
  let list_change_background = selected_list.filter(
    e => e.StyleItem.DecorationItem
  )
  for (let wbaseItem of list_change_background) {
    var elementHTML = wbaseItem.value
    wbaseItem.StyleItem.DecorationItem.ColorID = null
    wbaseItem.StyleItem.DecorationItem.ColorValue = null
    if (wbaseItem.CateID == EnumCate.svg) {
      await getColorSvg(wbaseItem)
    } else {
      elementHTML.style.backgroundColor = null
    }
  }
  WBaseDA.edit(list_change_background, EnumObj.decoration)
}

async function editBackground (decorationItem, onSubmit = true) {
  let list_change_background = selected_list.filter(
    e => e.StyleItem.DecorationItem
  )
  if (decorationItem.ColorItem) {
    let new_color_value = decorationItem.ColorItem.Value
    for (let wbaseItem of list_change_background) {
      wbaseItem.StyleItem.DecorationItem.ColorID = decorationItem.ColorItem.GID
      wbaseItem.StyleItem.DecorationItem.ColorValue = new_color_value
      switch (wbaseItem.CateID) {
        case EnumCate.svg:
          await getColorSvg(wbaseItem)
          break
        case EnumCate.radio_button:
          wbaseItem.value.style.setProperty(
            '--checked-border',
            `#${new_color_value}`
          )
          break
        case EnumCate.w_switch:
          wbaseItem.value.style.setProperty(
            '--checked-bg',
            `#${new_color_value}`
          )
          break
        case EnumCate.checkbox:
          wbaseItem.value.style.setProperty(
            '--checked-bg',
            `#${new_color_value}`
          )
          break
        default:
          wbaseItem.value.style.backgroundColor = `var(--background-color-${decorationItem.ColorItem.GID})`
          break
      }
      wbaseItem.value.style.backgroundImage = null
    }
  } else {
    if (decorationItem.ColorValue) {
      let new_color_value = decorationItem.ColorValue
      for (let wbaseItem of list_change_background) {
        wbaseItem.StyleItem.DecorationItem.ColorValue = new_color_value
        switch (wbaseItem.CateID) {
          case EnumCate.svg:
            await getColorSvg(wbaseItem)
            break
          case EnumCate.radio_button:
            wbaseItem.value.style.setProperty(
              '--checked-border',
              `#${new_color_value}`
            )
            break
          case EnumCate.w_switch:
            wbaseItem.value.style.setProperty(
              '--checked-bg',
              `#${new_color_value}`
            )
            break
          case EnumCate.checkbox:
            wbaseItem.value.style.setProperty(
              '--checked-bg',
              `#${new_color_value}`
            )
            break
          default:
            wbaseItem.value.style.backgroundColor = `#${new_color_value}`
            break
        }
      }
    }
  }
  if (onSubmit) {
    WBaseDA.edit(list_change_background, EnumObj.decoration)
  }
}

function editBackgroundImage (url) {
  if (!url.endsWith('.svg')) {
    let list_change_background = selected_list.filter(
      wb =>
        wb.StyleItem.DecorationItem &&
        EnumCate.noImgBg.every(ct => wb.CateID !== ct)
    )
    for (let wb of list_change_background) {
      wb.StyleItem.DecorationItem.ColorID = null
      wb.StyleItem.DecorationItem.ColorValue = url
      wb.value.style.backgroundImage = `url(${urlImg + url})`
      wb.value.style.backgroundColor = null
    }
    WBaseDA.edit(list_change_background, EnumObj.decoration)
  }
}

function removeBackgroundImg () {
  let list_change_background = selected_list.filter(
    wb =>
      wb.StyleItem.DecorationItem &&
      EnumCate.noImgBg.every(ct => wb.CateID !== ct)
  )
  for (let wb of list_change_background) {
    wb.StyleItem.DecorationItem.ColorValue = ''
    wb.value.style.backgroundImage = null
    wb.value.style.backgroundColor = null
  }
  WBaseDA.edit(list_change_background, EnumObj.decoration)
}

function editColorSkin (color_item, thisSkin) {
  if (color_item.Name) {
    let listName = color_item.Name.replace('\\', '/').split('/')
    if (listName.length <= 1) {
      if (listName.length == 1 && listName[0].trim() != '') {
        thisSkin.Name = listName[0]
      } else {
        thisSkin.Name = `#${thisSkin.Value}`
      }
    } else {
      thisSkin.Name = listName.pop()
      let nameCate = listName.join(' ')
      let cateItem = CateDA.list_color_cate.find(
        e => e.Name.toLowerCase() == nameCate.toLowerCase()
      )
      if (cateItem) {
        thisSkin.CateID = cateItem.ID
      } else {
        let newCate = {
          ID: 0,
          Name: nameCate,
          ParentID: EnumCate.color
        }
        thisSkin.CateID = -1
        CateDA.add(newCate)
        return
      }
    }
  } else if (color_item.Value) {
    thisSkin.Value = color_item.Value
    document.documentElement.style.setProperty(
      `--background-color-${thisSkin.GID}`,
      `#${thisSkin.Value}`
    )
  }
}

function unlinkColorSkin () {
  let list_change_background = selected_list.filter(
    e => e.StyleItem.DecorationItem
  )
  for (let wb of list_change_background) {
    wb.StyleItem.DecorationItem.ColorID = null
    let backgroundColor = Ultis.rgbToHex(
      window.getComputedStyle(wb.value).backgroundColor
    ).replace('#', '')
    wb.StyleItem.DecorationItem.ColorValue = backgroundColor
  }
  WBaseDA.edit(list_change_background, EnumObj.decoration)
}

function editTextStyle (text_style_item, onSubmit = true) {
  let list_text = selected_list.filter(e => e.StyleItem.TextStyleItem)
  let _enumObj
  if (text_style_item.IsStyle) {
    _enumObj = EnumObj.style
    for (let wb of list_text) {
      wb.StyleItem.TextStyleID = text_style_item.GID
      wb.StyleItem.TextStyleItem = text_style_item
      wb.value.style.font = `var(--font-style-${text_style_item.GID})`
      wb.value.style.color = `var(--font-color-${text_style_item.GID})`
      if (text_style_item.LetterSpacing)
        wb.value.style.letterSpacing = `${text_style_item.LetterSpacing}px`
    }
  } else {
    _enumObj = EnumObj.textStyle
    if (text_style_item.ColorValue) {
      for (let wbaseItem of list_text) {
        wbaseItem.StyleItem.TextStyleItem.ColorValue =
          text_style_item.ColorValue
        if (wbaseItem.CateID === EnumCate.chart) {
          createChart(wbaseItem)
        } else {
          wbaseItem.value.style.color = `#${text_style_item.ColorValue}`
        }
      }
    }
    if (text_style_item.FontFamily) {
      for (let wbaseItem of list_text) {
        wbaseItem.StyleItem.TextStyleItem.FontFamily =
          text_style_item.FontFamily
        if (wbaseItem.CateID === EnumCate.chart) {
          createChart(wbaseItem)
        } else {
          wbaseItem.value.style.fontFamily = text_style_item.FontFamily
        }
      }
    }
    if (text_style_item.FontSize != undefined) {
      for (let wb of list_text) {
        wb.StyleItem.TextStyleItem.FontSize = parseFloat(
          text_style_item.FontSize
        )
        if (wb.CateID === EnumCate.chart) {
          createChart(wb)
        } else {
          wb.value.style.fontSize = `${text_style_item.FontSize}px`
        }
      }
    }
    if (text_style_item.FontWeight != undefined) {
      for (let wbaseItem of list_text) {
        wbaseItem.StyleItem.TextStyleItem.FontWeight =
          text_style_item.FontWeight.toString()
        if (wbaseItem.CateID === EnumCate.chart) {
          createChart(wbaseItem)
        } else {
          wbaseItem.value.style.fontWeight = text_style_item.FontWeight
        }
      }
    }
    if (text_style_item.Height != undefined) {
      let lineHeightValue = text_style_item.Height.toString().toLowerCase()
      for (let wbaseItem of list_text) {
        wbaseItem.StyleItem.TextStyleItem.Height =
          lineHeightValue == 'auto' ? undefined : parseFloat(lineHeightValue)
        if (wbaseItem.CateID !== EnumCate.chart) {
          wbaseItem.value.style.lineHeight =
            lineHeightValue == 'auto' ? 'normal' : `${lineHeightValue}px`
        }
      }
    }
    if (text_style_item.LetterSpacing != undefined) {
      for (let wbaseItem of list_text) {
        wbaseItem.StyleItem.TextStyleItem.LetterSpacing = parseFloat(
          text_style_item.LetterSpacing
        )
        if (wbaseItem.CateID !== EnumCate.chart) {
          wbaseItem.value.style.letterSpacing = `${text_style_item.LetterSpacing}px`
        }
      }
    }
    if (text_style_item.AutoSize) {
      _enumObj = EnumObj.frame
      let checkConst = false
      if (select_box_parentID !== wbase_parentID) {
        checkConst = !window
          .getComputedStyle(document.getElementById(select_box_parentID))
          .display.match('flex')
      }
      for (let wbaseItem of list_text.filter(
        e => e.CateID !== EnumCate.chart
      )) {
        switch (text_style_item.AutoSize) {
          case TextAutoSize.autoWidth:
            if (checkConst) {
              if (
                [Constraints.center, Constraints.scale].some(
                  constX =>
                    wbaseItem.StyleItem.PositionItem.ConstraintsX === constX
                )
              ) {
                _enumObj = EnumObj.framePosition
                wbaseItem.StyleItem.PositionItem.ConstraintsX = Constraints.left
                wbaseItem.StyleItem.PositionItem.Left =
                  wbaseItem.value.offsetLeft + 'px'
                initPositionStyle(wbaseItem)
              }
            }
            wbaseItem.value.style.width = 'max-content'
            wbaseItem.StyleItem.FrameItem.Width = undefined
            wbaseItem.value.style.height = 'fit-content'
            wbaseItem.StyleItem.FrameItem.Height = undefined
            break
          case TextAutoSize.autoHeight:
            if (checkConst) {
              if (
                [Constraints.center, Constraints.scale].some(
                  constY =>
                    wbaseItem.StyleItem.PositionItem.ConstraintsY === constY
                )
              ) {
                _enumObj = EnumObj.framePosition
                wbaseItem.StyleItem.PositionItem.ConstraintsY = Constraints.top
                wbaseItem.StyleItem.PositionItem.Top =
                  wbaseItem.value.offsetTop + 'px'
                initPositionStyle(wbaseItem)
              }
            }
            wbaseItem.value.style.height = 'fit-content'
            wbaseItem.StyleItem.FrameItem.Height = undefined
            if (wbaseItem.StyleItem.FrameItem.Width == undefined) {
              wbaseItem.value.style.width = `${wbaseItem.value.offsetWidth}px`
              wbaseItem.StyleItem.FrameItem.Width = wbaseItem.value.offsetWidth
            }
            break
          case TextAutoSize.fixedSize:
            if (wbaseItem.StyleItem.FrameItem.Width == undefined) {
              wbaseItem.value.style.width = `${wbaseItem.value.offsetWidth}px`
              wbaseItem.StyleItem.FrameItem.Width = wbaseItem.value.offsetWidth
            }
            if (wbaseItem.StyleItem.FrameItem.Height == undefined) {
              wbaseItem.value.style.height = `${wbaseItem.value.offsetHeight}px`
              wbaseItem.StyleItem.FrameItem.Height =
                wbaseItem.value.offsetHeight
            }
            break
          default:
            break
        }
      }
    }
    if (text_style_item.TextAlign) {
      _enumObj = EnumObj.typoStyleItem
      for (let wbaseItem of list_text.filter(
        e => e.CateID !== EnumCate.chart
      )) {
        wbaseItem.StyleItem.TypoStyleItem.TextAlign = text_style_item.TextAlign
        switch (text_style_item.TextAlign) {
          case TextAlign.left:
            wbaseItem.value.style.alignItems = TextAlign.left
            wbaseItem.value.style.textAlign = TextAlign.left
            break
          case TextAlign.center:
            wbaseItem.value.style.alignItems = TextAlign.center
            wbaseItem.value.style.textAlign = TextAlign.center
            break
          case TextAlign.right:
            wbaseItem.value.style.alignItems = TextAlign.right
            wbaseItem.value.style.textAlign = TextAlign.right
            break
          default:
            break
        }
      }
    }
    if (text_style_item.TextAlignVertical) {
      _enumObj = EnumObj.typoStyleItem
      for (let wbaseItem of list_text.filter(
        e => e.CateID !== EnumCate.chart
      )) {
        wbaseItem.StyleItem.TypoStyleItem.TextAlignVertical =
          text_style_item.TextAlignVertical
        switch (text_style_item.TextAlignVertical) {
          case TextAlignVertical.top:
            wbaseItem.value.style.justifyContent = TextAlignVertical.top
            break
          case TextAlignVertical.middle:
            wbaseItem.value.style.justifyContent = TextAlignVertical.middle
            break
          case TextAlignVertical.bottom:
            wbaseItem.value.style.justifyContent = TextAlignVertical.bottom
            break
          default:
            break
        }
      }
    }
  }
  if (onSubmit) {
    if (
      _enumObj === EnumObj.textStyle &&
      list_text.some(e => e.StyleItem.TextStyleID === 0)
    ) {
      list_text
        .filter(e => e.StyleItem.TextStyleID === 0)
        .forEach(e => {
          e.StyleItem.TextStyleID = uuidv4()
          e.StyleItem.TextStyleItem.GID = e.StyleItem.TextStyleID
        })
      WBaseDA.addStyle(list_text, _enumObj)
    } else {
      WBaseDA.edit(list_text, _enumObj)
    }
  }
  updateUISelectBox()
}

function editTypoSkin (text_style_item, thisSkin) {
  if (text_style_item.ColorValue) {
    thisSkin.ColorValue = text_style_item.ColorValue
    document.documentElement.style.setProperty(
      `--font-color-${thisSkin.GID}`,
      `#${thisSkin.ColorValue}`
    )
  }
  if (text_style_item.FontFamily) {
    thisSkin.FontFamily = text_style_item.FontFamily
    document.documentElement.style.setProperty(
      `--font-style-${thisSkin.GID}`,
      `${thisSkin.FontWeight} ${thisSkin.FontSize}px/${
        thisSkin.Height != undefined ? thisSkin.Height + 'px' : 'normal'
      } ${thisSkin.FontFamily}`
    )
  }
  if (text_style_item.FontSize != undefined) {
    thisSkin.FontSize = parseFloat(text_style_item.FontSize)
    document.documentElement.style.setProperty(
      `--font-style-${thisSkin.GID}`,
      `${thisSkin.FontWeight} ${thisSkin.FontSize}px/${
        thisSkin.Height != undefined ? thisSkin.Height + 'px' : 'normal'
      } ${thisSkin.FontFamily}`
    )
  }
  if (text_style_item.FontWeight != undefined) {
    thisSkin.FontWeight = parseFloat(text_style_item.FontWeight)
    document.documentElement.style.setProperty(
      `--font-style-${thisSkin.GID}`,
      `${thisSkin.FontWeight} ${thisSkin.FontSize}px/${
        thisSkin.Height != undefined ? thisSkin.Height + 'px' : 'normal'
      } ${thisSkin.FontFamily}`
    )
  }
  if (text_style_item.Height != undefined) {
    let lineHeightValue = text_style_item.Height.toString().toLowerCase()
    thisSkin.Height =
      lineHeightValue == 'auto' ? null : parseFloat(lineHeightValue)
    document.documentElement.style.setProperty(
      `--font-style-${thisSkin.GID}`,
      `${thisSkin.FontWeight} ${thisSkin.FontSize}px/${
        thisSkin.Height != undefined ? thisSkin.Height + 'px' : 'normal'
      } ${thisSkin.FontFamily}`
    )
  }
  if (text_style_item.LetterSpacing != undefined) {
    thisSkin.LetterSpacing = parseFloat(text_style_item.LetterSpacing)
    let listRelative = wbase_list.filter(
      e => e.StyleItem.TextStyleID == thisSkin.GID
    )
    for (let i = 0; i < listRelative.length; i++) {
      listRelative[i].value.style.letterSpacing = thisSkin.LetterSpacing + 'px'
    }
  }
  if (text_style_item.Name) {
    let listName = text_style_item.Name.replace('\\', '/').split('/')
    if (listName.length <= 1) {
      if (listName.length == 1 && listName[0].trim() != '') {
        thisSkin.Name = listName[0]
      } else {
        thisSkin.Name = `${thisSkin.FontSize}/${thisSkin.Height ?? 'auto'}`
      }
    } else {
      thisSkin.Name = listName.pop()
      let nameCate = listName.join(' ')
      let cateItem = CateDA.list_typo_cate.find(
        e => e.Name.toLowerCase() == nameCate.toLowerCase()
      )
      if (cateItem) {
        thisSkin.CateID = cateItem.ID
      } else {
        let newCate = {
          ID: 0,
          Name: nameCate,
          ParentID: EnumCate.typography
        }
        thisSkin.CateID = -1
        CateDA.add(newCate)
        return
      }
    }
  }
}

function unlinkTypoSkin () {
  let listTypo = selected_list.filter(e => e.StyleItem.TextStyleItem)
  for (let wb of listTypo) {
    let currentTextStyle = wb.StyleItem.TextStyleItem
    let newTextStyleItem = {
      GID: uuidv4(),
      Name: 'new text style',
      FontSize: currentTextStyle.FontSize,
      FontWeight: currentTextStyle.FontWeight,
      CateID: 17,
      IsStyle: false,
      ColorValue: currentTextStyle.ColorValue,
      LetterSpacing: currentTextStyle.LetterSpacing,
      FontFamily: currentTextStyle.FontFamily,
      Height: currentTextStyle.Height
    }
    wb.StyleItem.TextStyleID = newTextStyleItem.GID
    wb.StyleItem.TextStyleItem = newTextStyleItem
    wb.value.style.font = null
    wb.value.style.fontFamily = newTextStyleItem.FontFamily
    wb.value.style.fontSize = `${newTextStyleItem.FontSize}px`
    wb.value.style.fontWeight = newTextStyleItem.FontWeight
    wb.value.style.color = `#${newTextStyleItem.ColorValue}`
    if (newTextStyleItem.Height != undefined) {
      wb.value.style.lineHeight = `${newTextStyleItem.Height}px`
    }
  }
  WBaseDA.addStyle(listTypo, EnumObj.textStyle)
}

function addEffect () {
  let effect_skin = selected_list.find(
    e => e.StyleItem.DecorationItem.EffectItem?.IsStyle
  )
  if (effect_skin) {
    effect_skin = effect_skin.StyleItem.DecorationItem.EffectItem
  }
  let list_add_effect = selected_list.filter(
    e => e.StyleItem.DecorationItem.EffectItem == undefined
  )
  for (let i = 0; i < list_add_effect.length; i++) {
    let elementHTML = document.getElementById(list_add_effect[i].GID)
    let new_effect_skin = effect_skin
    if (new_effect_skin == undefined) {
      let new_effectID = uuidv4()
      new_effect_skin = {
        GID: new_effectID,
        Name: 'new effect',
        OffsetX: 0,
        OffsetY: 4,
        IsStyle: false,
        ColorValue: '00000040',
        SpreadRadius: 0,
        BlurRadius: 4,
        Type: ShadowType.dropdown
      }
    }
    list_add_effect[i].StyleItem.DecorationItem.EffectID = new_effect_skin.GID
    list_add_effect[i].StyleItem.DecorationItem.EffectItem = new_effect_skin
    elementHTML.style.boxShadow = `${new_effect_skin.OffsetX}px ${new_effect_skin.OffsetY}px ${new_effect_skin.BlurRadius}px ${new_effect_skin.SpreadRadius}px #${new_effect_skin.ColorValue}`
  }
  WBaseDA.addStyle(list_add_effect, EnumObj.effect)
}

function deleteEffect () {
  var list_effect_wbase = selected_list.filter(
    e => e.StyleItem.DecorationItem.EffectID
  )
  for (let wb of list_effect_wbase) {
    wb.StyleItem.DecorationItem.EffectID = null
    wb.StyleItem.DecorationItem.EffectItem = null
    wb.value.style.boxShadow = null
    wb.value.style.filter = null
  }
  WBaseDA.edit(list_effect_wbase, EnumObj.decoration)
}

function editEffect (effect_item, onSubmit = true) {
  if (effect_item.IsStyle) {
    let list_effect = selected_list.filter(e => e.StyleItem.DecorationItem)
    for (let wb of list_effect) {
      wb.StyleItem.DecorationItem.EffectID = effect_item.GID
      wb.StyleItem.DecorationItem.EffectItem = effect_item
      if (effect_item.Type == ShadowType.layer_blur) {
        wb.value.style.filter = `var(--effect-blur-${effect_item.GID})`
      } else {
        wb.value.style.boxShadow = `var(--effect-shadow-${effect_item.GID})`
      }
    }
    WBaseDA.edit(list_effect, EnumObj.decoration)
  } else {
    let list_effect = selected_list.filter(
      e => e.StyleItem.DecorationItem?.EffectItem
    )
    if (effect_item.OffsetX != undefined) {
      let i
      for (i = 0; i < list_effect.length; i++) {
        var elementHTML = document.getElementById(list_effect[i].GID)
        list_effect[i].StyleItem.DecorationItem.EffectItem.OffsetX =
          effect_item.OffsetX
        let this_effect_item =
          list_effect[i].StyleItem.DecorationItem.EffectItem
        if (this_effect_item.Type == ShadowType.layer_blur) {
          elementHTML.style.filter = `blur(${this_effect_item.BlurRadius}px)`
        } else {
          let effect_color = this_effect_item.ColorValue
          /* offset-x | offset-y | blur-radius | spread-radius | color */
          elementHTML.style.boxShadow = `${this_effect_item.OffsetX}px ${
            this_effect_item.OffsetY
          }px ${this_effect_item.BlurRadius}px ${
            this_effect_item.SpreadRadius
          }px #${effect_color} ${
            this_effect_item.Type == ShadowType.inner ? 'inset' : ''
          }`
        }
      }
    }
    if (effect_item.OffsetY != undefined) {
      let i
      for (i = 0; i < list_effect.length; i++) {
        var elementHTML = document.getElementById(list_effect[i].GID)
        list_effect[i].StyleItem.DecorationItem.EffectItem.OffsetY =
          effect_item.OffsetY
        let this_effect_item =
          list_effect[i].StyleItem.DecorationItem.EffectItem
        if (this_effect_item.Type == ShadowType.layer_blur) {
          elementHTML.style.filter = `blur(${this_effect_item.BlurRadius}px)`
        } else {
          let effect_color = this_effect_item.ColorValue
          /* offset-x | offset-y | blur-radius | spread-radius | color */
          elementHTML.style.boxShadow = `${this_effect_item.OffsetX}px ${
            this_effect_item.OffsetY
          }px ${this_effect_item.BlurRadius}px ${
            this_effect_item.SpreadRadius
          }px #${effect_color} ${
            this_effect_item.Type == ShadowType.inner ? 'inset' : ''
          }`
        }
      }
    }
    if (effect_item.BlurRadius != undefined) {
      let i
      for (i = 0; i < list_effect.length; i++) {
        var elementHTML = document.getElementById(list_effect[i].GID)
        list_effect[i].StyleItem.DecorationItem.EffectItem.BlurRadius =
          effect_item.BlurRadius
        let this_effect_item =
          list_effect[i].StyleItem.DecorationItem.EffectItem
        if (this_effect_item.Type == ShadowType.layer_blur) {
          elementHTML.style.filter = `blur(${this_effect_item.BlurRadius}px)`
        } else {
          let effect_color = this_effect_item.ColorValue
          /* offset-x | offset-y | blur-radius | spread-radius | color */
          elementHTML.style.boxShadow = `${this_effect_item.OffsetX}px ${
            this_effect_item.OffsetY
          }px ${this_effect_item.BlurRadius}px ${
            this_effect_item.SpreadRadius
          }px #${effect_color} ${
            this_effect_item.Type == ShadowType.inner ? 'inset' : ''
          }`
        }
      }
    }
    if (effect_item.SpreadRadius != undefined) {
      let i
      for (i = 0; i < list_effect.length; i++) {
        var elementHTML = document.getElementById(list_effect[i].GID)
        list_effect[i].StyleItem.DecorationItem.EffectItem.SpreadRadius =
          effect_item.SpreadRadius
        let this_effect_item =
          list_effect[i].StyleItem.DecorationItem.EffectItem
        if (this_effect_item.Type == ShadowType.layer_blur) {
          elementHTML.style.filter = `blur(${this_effect_item.BlurRadius}px)`
        } else {
          let effect_color = this_effect_item.ColorValue
          /* offset-x | offset-y | blur-radius | spread-radius | color */
          elementHTML.style.boxShadow = `${this_effect_item.OffsetX}px ${
            this_effect_item.OffsetY
          }px ${this_effect_item.BlurRadius}px ${
            this_effect_item.SpreadRadius
          }px #${effect_color} ${
            this_effect_item.Type == ShadowType.inner ? 'inset' : ''
          }`
        }
      }
    }
    if (effect_item.ColorValue) {
      let i
      for (i = 0; i < list_effect.length; i++) {
        var elementHTML = document.getElementById(list_effect[i].GID)
        list_effect[i].StyleItem.DecorationItem.EffectItem.ColorValue =
          effect_item.ColorValue
        let this_effect_item =
          list_effect[i].StyleItem.DecorationItem.EffectItem
        if (this_effect_item.Type == ShadowType.layer_blur) {
          elementHTML.style.filter = `blur(${this_effect_item.BlurRadius}px)`
        } else {
          let effect_color = this_effect_item.ColorValue
          /* offset-x | offset-y | blur-radius | spread-radius | color */
          elementHTML.style.boxShadow = `${this_effect_item.OffsetX}px ${
            this_effect_item.OffsetY
          }px ${this_effect_item.BlurRadius}px ${
            this_effect_item.SpreadRadius
          }px #${effect_color} ${
            this_effect_item.Type == ShadowType.inner ? 'inset' : ''
          }`
        }
      }
    }
    if (effect_item.Type) {
      let i
      for (i = 0; i < list_effect.length; i++) {
        var elementHTML = document.getElementById(list_effect[i].GID)
        list_effect[i].StyleItem.DecorationItem.EffectItem.Type =
          effect_item.Type
        let this_effect_item =
          list_effect[i].StyleItem.DecorationItem.EffectItem
        if (effect_item.Type == ShadowType.layer_blur) {
          elementHTML.style.filter = `blur(${this_effect_item.BlurRadius}px)`
          elementHTML.style.boxShadow = 'none'
        } else {
          elementHTML.style.filter = 'none'
          let effect_color = this_effect_item.ColorValue
          /* offset-x | offset-y | blur-radius | spread-radius | color */
          elementHTML.style.boxShadow = `${this_effect_item.OffsetX}px ${
            this_effect_item.OffsetY
          }px ${this_effect_item.BlurRadius}px ${
            this_effect_item.SpreadRadius
          }px #${effect_color} ${
            effect_item.Type == ShadowType.inner ? 'inset' : ''
          }`
        }
      }
    }
    if (onSubmit) {
      WBaseDA.edit(list_effect, EnumObj.effect)
    }
  }
}

function editEffectSkin (effect_item, thisSkin) {
  if (effect_item.OffsetX != undefined) {
    thisSkin.OffsetX = effect_item.OffsetX
    document.documentElement.style.setProperty(
      `--effect-shadow-${thisSkin.GID}`,
      `${thisSkin.OffsetX}px ${thisSkin.OffsetY}px ${thisSkin.BlurRadius}px ${
        thisSkin.SpreadRadius
      }px #${thisSkin.ColorValue} ${
        thisSkin.Type == ShadowType.inner ? 'inset' : ''
      }`
    )
  }
  if (effect_item.OffsetY != undefined) {
    thisSkin.OffsetY = effect_item.OffsetY
    document.documentElement.style.setProperty(
      `--effect-shadow-${thisSkin.GID}`,
      `${thisSkin.OffsetX}px ${thisSkin.OffsetY}px ${thisSkin.BlurRadius}px ${
        thisSkin.SpreadRadius
      }px #${thisSkin.ColorValue} ${
        thisSkin.Type == ShadowType.inner ? 'inset' : ''
      }`
    )
  }
  if (effect_item.BlurRadius != undefined) {
    thisSkin.BlurRadius = effect_item.BlurRadius
    if (thisSkin.Type == ShadowType.layer_blur) {
      document.documentElement.style.setProperty(
        `--effect-blur-${thisSkin.GID}`,
        `blur(${thisSkin.BlurRadius}px)`
      )
    } else {
      document.documentElement.style.setProperty(
        `--effect-shadow-${thisSkin.GID}`,
        `${thisSkin.OffsetX}px ${thisSkin.OffsetY}px ${thisSkin.BlurRadius}px ${
          thisSkin.SpreadRadius
        }px #${thisSkin.ColorValue} ${
          thisSkin.Type == ShadowType.inner ? 'inset' : ''
        }`
      )
    }
  }
  if (effect_item.SpreadRadius != undefined) {
    thisSkin.SpreadRadius = effect_item.SpreadRadius
    document.documentElement.style.setProperty(
      `--effect-shadow-${thisSkin.GID}`,
      `${thisSkin.OffsetX}px ${thisSkin.OffsetY}px ${thisSkin.BlurRadius}px ${
        thisSkin.SpreadRadius
      }px #${thisSkin.ColorValue} ${
        thisSkin.Type == ShadowType.inner ? 'inset' : ''
      }`
    )
  }
  if (effect_item.ColorValue) {
    thisSkin.ColorValue = effect_item.ColorValue
    document.documentElement.style.setProperty(
      `--effect-shadow-${thisSkin.GID}`,
      `${thisSkin.OffsetX}px ${thisSkin.OffsetY}px ${thisSkin.BlurRadius}px ${
        thisSkin.SpreadRadius
      }px #${thisSkin.ColorValue} ${
        thisSkin.Type == ShadowType.inner ? 'inset' : ''
      }`
    )
  }
  if (effect_item.Type) {
    if (effect_item.Type !== thisSkin.Type) {
      let listRelative = []
      if (thisSkin.Type === ShadowType.layer_blur) {
        document.documentElement.style.removeProperty(
          `--effect-blur-${thisSkin.GID}`
        )
        listRelative = wbase_list.filter(
          e => e.StyleItem.DecorationItem?.EffectID == thisSkin.GID
        )
      } else if (effect_item.Type == ShadowType.layer_blur) {
        document.documentElement.style.removeProperty(
          `--effect-shadow-${thisSkin.GID}`
        )
        listRelative = wbase_list.filter(
          e => e.StyleItem.DecorationItem?.EffectID == thisSkin.GID
        )
      }
      thisSkin.Type = effect_item.Type
      if (thisSkin.Type === ShadowType.layer_blur) {
        document.documentElement.style.setProperty(
          `--effect-blur-${thisSkin.GID}`,
          `blur(${thisSkin.BlurRadius}px)`
        )
      } else {
        document.documentElement.style.setProperty(
          `--effect-shadow-${thisSkin.GID}`,
          `${thisSkin.OffsetX}px ${thisSkin.OffsetY}px ${
            thisSkin.BlurRadius
          }px ${thisSkin.SpreadRadius}px #${thisSkin.ColorValue} ${
            thisSkin.Type == ShadowType.inner ? 'inset' : ''
          }`
        )
      }
      for (let wb of listRelative) {
        if (thisSkin.Type === ShadowType.layer_blur) {
          wb.value.style.filter = `var(--effect-blur-${thisSkin.GID})`
        } else {
          wb.value.style.boxShadow = `var(--effect-shadow-${thisSkin.GID})`
        }
      }
    }
  }
  if (effect_item.Name) {
    let listName = effect_item.Name.replace('\\', '/').split('/')
    if (listName.length <= 1) {
      if (listName.length == 1 && listName[0].trim() != '') {
        thisSkin.Name = listName[0]
      } else {
        thisSkin.Name = `#${thisSkin.ColorValue}`
      }
    } else {
      thisSkin.Name = listName.pop()
      let nameCate = listName.join(' ')
      let cateItem = CateDA.list_effect_cate.find(
        e => e.Name.toLowerCase() == nameCate.toLowerCase()
      )
      if (cateItem) {
        thisSkin.CateID = cateItem.ID
      } else {
        let newCate = {
          ID: 0,
          Name: nameCate,
          ParentID: EnumCate.effect
        }
        thisSkin.CateID = -1
        CateDA.add(newCate)
        return
      }
    }
  }
}

function unlinkEffectSkin () {
  let listEffect = selected_list.filter(
    e => e.StyleItem.DecorationItem.EffectItem
  )
  for (let wb of listEffect) {
    let currentEffect = wb.StyleItem.DecorationItem.EffectItem
    let newEffectItem = {
      GID: uuidv4(),
      Name: 'new effect',
      OffsetX: currentEffect.OffsetX,
      OffsetY: currentEffect.OffsetY,
      IsStyle: false,
      ColorValue: currentEffect.ColorValue,
      SpreadRadius: currentEffect.SpreadRadius,
      BlurRadius: currentEffect.BlurRadius,
      Type: currentEffect.Type
    }
    wb.StyleItem.DecorationItem.EffectID = newEffectItem.GID
    wb.StyleItem.DecorationItem.EffectItem = newEffectItem
    if (newEffectItem.Type === ShadowType.layer_blur) {
      wb.value.style.filter = `blur(${newEffectItem.BlurRadius}px)`
    } else {
      wb.value.style.boxShadow = `${newEffectItem.OffsetX}px ${
        newEffectItem.OffsetY
      }px ${newEffectItem.BlurRadius}px ${newEffectItem.SpreadRadius}px #${
        newEffectItem.ColorValue
      } ${newEffectItem.Type == ShadowType.inner ? 'inset' : ''}`
    }
  }
  WBaseDA.addStyle(listEffect, EnumObj.effect)
}

function combineAsVariant () {
  let list_update = [...selected_list]
  let new_wbase_item = JSON.parse(JSON.stringify(WBaseDefault.variant))
  new_wbase_item = createNewWbase(new_wbase_item).pop()
  new_wbase_item.IsWini = true
  new_wbase_item.StyleItem.PositionItem.Left = `${
    Math.min(
      ...selected_list.map(e => {
        let leftValue = getWBaseOffset(e).x
        e.StyleItem.PositionItem.ConstraintsX = Constraints.left
        e.StyleItem.PositionItem.Left = `${leftValue}px`
        return leftValue
      })
    ).toFixed(2) - 8
  }px`
  new_wbase_item.StyleItem.PositionItem.Top = `${
    Math.min(
      ...selected_list.map(e => {
        let topValue = getWBaseOffset(e).y
        e.StyleItem.PositionItem.ConstraintsY = Constraints.top
        e.StyleItem.PositionItem.Top = `${topValue}px`
        return topValue
      })
    ).toFixed(2) - 8
  }px`
  new_wbase_item.CountChild = selected_list.length
  new_wbase_item.ListChildID = selected_list.map(e => e.GID)
  new_wbase_item.StyleItem.FrameItem.Width = select_box.w / scale + 16
  new_wbase_item.StyleItem.FrameItem.Height = select_box.h / scale + 16
  new_wbase_item.ParentID = selected_list[0].ParentID
  new_wbase_item.ListID = selected_list[0].ListID
  new_wbase_item.Sort = selected_list[0].Sort
  new_wbase_item.Level = selected_list[0].Level
  assets_list.push(new_wbase_item)
  let newPropertyItem = {
    GID: uuidv4(),
    Name: 'Property 1',
    BaseID: new_wbase_item.GID,
    BasePropertyItems: []
  }
  PropertyDA.list.push(newPropertyItem)
  for (let i = 0; i < selected_list.length; i++) {
    let eHTML = document.getElementById(selected_list[i].GID)
    document
      .getElementById(`wbaseID:${selected_list[i].GID}`)
      .parentElement.remove()
    selected_list[i].StyleItem.PositionItem.Left = `${
      parseFloat(
        `${selected_list[i].StyleItem.PositionItem.Left}`.replace('px', '')
      ) -
      parseFloat(
        `${new_wbase_item.StyleItem.PositionItem.Left}`.replace('px', '')
      )
    }px`
    selected_list[i].StyleItem.PositionItem.Top = `${
      parseFloat(
        `${selected_list[i].StyleItem.PositionItem.Top}`.replace('px', '')
      ) -
      parseFloat(
        `${new_wbase_item.StyleItem.PositionItem.Top}`.replace('px', '')
      )
    }px`
    selected_list[i].ParentID = new_wbase_item.GID
    selected_list[i].ListID += `,${new_wbase_item.GID}`
    selected_list[i].Sort = i
    selected_list[i].Level++
    let newBaseProperty = {
      GID: uuidv4(),
      Name: selected_list[i].Name,
      BaseID: selected_list[i].GID,
      PropertyID: newPropertyItem.GID
    }
    newPropertyItem.BasePropertyItems.push(newBaseProperty)
    selected_list[i].BasePropertyItems = [newBaseProperty]
    eHTML.setAttribute('Level', selected_list[i].Level)
    eHTML.setAttribute('listid', selected_list[i].ListID)
    eHTML.style.left = selected_list[i].StyleItem.PositionItem.Left
    eHTML.style.top = selected_list[i].StyleItem.PositionItem.Top
    eHTML.style.zIndex = i
    eHTML.style.order = i
    if (selected_list[i].CountChild > 0) {
      for (let childSelect of wbase_list.filter(e =>
        e.ListID.includes(selected_list[i].GID)
      )) {
        childSelect.ListID = childSelect.ListID
        let thisListID = childSelect.ListID.split(',')
        thisListID = thisListID.slice(thisListID.indexOf(selected_list[i].GID))
        thisListID.unshift(...selected_list[i].ListID.split(','))
        childSelect.ListID = thisListID.join(',')
        childSelect.Level = thisListID.length
        childSelect.value.setAttribute('Level', childSelect.Level)
        childSelect.value.setAttribute('listid', childSelect.ListID)
      }
    }
  }
  initComponents(new_wbase_item, selected_list)
  wbase_list.push(new_wbase_item)
  list_update.push(new_wbase_item)
  if (new_wbase_item.ParentID != wbase_parentID) {
    let parent_wbase = wbase_list.find(e => e.GID == new_wbase_item.ParentID)
    parent_wbase.CountChild += 1 - selected_list.length
    let parentHTML = document.getElementById(new_wbase_item.ParentID)
    parentHTML.appendChild(new_wbase_item.value)
    let childrenHTML = [...parentHTML.childNodes]
    childrenHTML.sort(
      (a, b) => parseInt(a.style.zIndex) - parseInt(b.style.zIndex)
    )
    parent_wbase.ListChildID = childrenHTML.map(e => e.id)
    if (!window.getComputedStyle(parentHTML).display.match('flex')) {
      initPositionStyle(new_wbase_item)
    }
  }
  arrange()
  replaceAllLyerItemHTML()
  addSelectList([new_wbase_item])
  WBaseDA.add(list_update, null, EnumEvent.parent, EnumObj.wBase)
}

function changeProperty (variantID) {
  if (variantID) {
    let listUpdate = []
    listUpdate.push(...selected_list)
    let deleteList = selected_list.map(e => e.GID)
    wbase_list = wbase_list.filter(
      e => !deleteList.some(id => e.GID == id || e.ListID.includes(id))
    )
    let wbaseVariant = assets_list.find(e => e.GID == variantID)
    let wbaseParent
    if (selected_list[0].ParentID != wbase_parentID) {
      wbaseParent = wbase_list.find(e => e.GID == selected_list[0].ParentID)
    }
    let newSelectedList = []
    for (let selectedWbase of selected_list) {
      let copy = JSON.parse(JSON.stringify(wbaseVariant))
      copy.ChildID = wbaseVariant.GID
      copy.ApiID = selectedWbase.ApiID
      copy.PrototypeID = selectedWbase.PropertyID
      copy.ProtoType = selectedWbase.ProtoType
      copy.AttributesItem = selectedWbase.AttributesItem
      copy.AttributesItem.Content = wbaseVariant.AttributesItem.Content
      copy.StyleItem.PositionItem = selectedWbase.StyleItem.PositionItem
      let newWbaseList = createNewWbase(
        copy,
        assets_list,
        selectedWbase.ListID,
        selectedWbase.Sort
      )
      listUpdate.push(...newWbaseList)
      let newWbaseSelect = newWbaseList.pop()
      newSelectedList.push(newWbaseSelect)
      ;[...newWbaseList, newWbaseSelect].forEach(wbaseItem => {
        initComponents(
          wbaseItem,
          newWbaseList.filter(e => e.ParentID == wbaseItem.GID),
          false
        )
        wbaseItem.value.id = wbaseItem.GID
      })
      if (wbaseParent) {
        wbaseParent.ListChildID[indexOf(selectedWbase.GID)] = newWbaseSelect.GID
      }
      let seletedHTML = document.getElementById(selectedWbase.GID)
      let seletedComputeStyle = window.getComputedStyle(seletedHTML)
      newWbaseSelect.value.style.position = seletedComputeStyle.position
      newWbaseSelect.value.style.left = seletedComputeStyle.left
      newWbaseSelect.value.style.top = seletedComputeStyle.top
      seletedHTML.replaceWith(newWbaseSelect.value)
      selectedWbase.IsDeleted = true
      replaceAllLyerItemHTML()
    }
    selected_list = []
    WBaseDA.changeProperty(listUpdate)
    addSelectList(newSelectedList)
  }
}

function editJsonItem (jsonItem, onSubmit = true) {
  if (jsonItem.CheckColor) {
    selected_list[0].JsonItem.CheckColor = jsonItem.CheckColor
    switch (selected_list[0].CateID) {
      case EnumCate.checkbox:
        selected_list[0].value
          .querySelector('svg > path')
          .setAttribute('stroke', `#${jsonItem.CheckColor}`)
        drawCheckMark(selected_list[0].value)
        break
      default:
        selected_list[0].value
          .querySelector('.checkmark')
          .setAttribute('checkcolor', jsonItem.CheckColor)
        break
    }
  } else if (jsonItem.InactiveColor) {
    selected_list[0].JsonItem.InactiveColor = jsonItem.InactiveColor
    if (selected_list[0].JsonItem.Content !== 'true') {
      selected_list[0].value.style.backgroundColor = `#${jsonItem.InactiveColor}`
      selected_list[0].value.style.setProperty(
        '--unchecked-bg',
        `#${jsonItem.InactiveColor}`
      )
    }
  } else if (jsonItem.Enable != undefined) {
    selected_list[0].JsonItem.Enable = jsonItem.Enable
  } else if (jsonItem.Checked != undefined) {
    selected_list[0].JsonItem.Checked = jsonItem.Checked
    selected_list[0].value.querySelector(':scope > input').checked =
      jsonItem.Checked
    $(selected_list[0].value.querySelector(':scope > input')).trigger('change')
  } else if (jsonItem.DotColor) {
    selected_list[0].JsonItem.DotColor = jsonItem.DotColor
    selected_list[0].value.style.setProperty(
      '--dot-color',
      `#${jsonItem.DotColor}`
    )
  } else if (jsonItem.LabelText != undefined) {
    selected_list[0].JsonItem.LabelText = jsonItem.LabelText
    let thislabel = selected_list[0].value.querySelector('.textfield > label')
    if (jsonItem.LabelText != '') {
      if (thislabel) thislabel.innerHTML = jsonItem.LabelText
      else {
        let label = document.createElement('label')
        label.innerHTML = jsonItem.LabelText
        label.htmlFor = selected_list[0].value.querySelector('.textfield').id
        selected_list[0].value.querySelector('.textfield > input').after(label)
        selected_list[0].value.querySelector('.textfield > input').placeholder =
          ''
      }
    } else {
      thislabel?.remove()
      selected_list[0].value.querySelector('.textfield > input').placeholder =
        selected_list[0].JsonItem.HintText
    }
    updateUISelectBox()
  } else if (jsonItem.HintText != undefined) {
    selected_list[0].JsonItem.HintText = jsonItem.HintText
    let thislabel = selected_list[0].value.querySelector('.textfield > label')
    if (!thislabel)
      selected_list[0].value.querySelector('.textfield > input').placeholder =
        jsonItem.HintText
  } else if (jsonItem.AutoValidate != undefined) {
    selected_list[0].JsonItem.AutoValidate = jsonItem.AutoValidate
  } else if (jsonItem.TextFormFieldType) {
    selected_list[0].JsonItem.Type = jsonItem.TextFormFieldType
    createTextFieldHTML(
      wbase_list.find(
        e =>
          e.CateID === EnumCate.textfield && e.ParentID === selected_list[0].GID
      ),
      selected_list[0]
    )
  } else if (jsonItem.SuffixSize != undefined) {
    selected_list[0].JsonItem.SuffixSize = jsonItem.SuffixSize
    selected_list[0].value
      .querySelector(`.wbaseItem-value:has(> .textfield)`)
      .style.setProperty('--suffix-size', `${jsonItem.SuffixSize}px`)
  } else if (jsonItem.Enabled != undefined) {
    selected_list[0].JsonItem.Enabled = jsonItem.Enabled
    selected_list[0].value.querySelector('.textfield > input').disabled =
      !jsonItem.Enabled
  } else if (jsonItem.ReadOnly != undefined) {
    selected_list[0].JsonItem.ReadOnly = jsonItem.ReadOnly
    selected_list[0].value.querySelector('.textfield > input').readOnly =
      jsonItem.ReadOnly
  } else if (jsonItem.Content != undefined) {
    selected_list[0].AttributesItem.Content = jsonItem.Content
    switch (selected_list[0].CateID) {
      case EnumCate.radio_button:
        selected_list[0].value.querySelector(':scope > input').value =
          jsonItem.Content
        break
      case EnumCate.textformfield:
        selected_list[0].value.querySelector('.textfield > input').value =
          jsonItem.Content
        if (jsonItem.Content.length > 0) {
          $(selected_list[0].value.querySelector('.textfield')).addClass(
            'content'
          )
        } else {
          $(selected_list[0].value.querySelector('.textfield')).removeClass(
            'content'
          )
        }
        break
      default:
        selected_list[0].value.querySelector(':scope > input').checked =
          jsonItem.Content === 'true'
        $(selected_list[0].value.querySelector('input')).trigger('change')
        break
    }
  } else if (jsonItem.NameField != undefined) {
    for (let wbaseItem of selected_list) {
      let oldNameField = wbaseItem.AttributesItem.NameField
      wbaseItem.AttributesItem.NameField = jsonItem.NameField
      let input
      if (wbaseItem.CateID === EnumCate.textformfield) {
        input = selected_list[0].value.querySelector('.textfield > input')
      } else {
        input = selected_list[0].value.querySelector(':scope > input')
      }
      if (input && jsonItem.NameField !== '') {
        input.name = wbaseItem.AttributesItem.NameField
      } else {
        input?.removeAttribute('name')
      }
      if (wbaseItem.CateID === EnumCate.radio_button) {
        if (oldNameField !== '')
          document.getElementsByName(oldNameField).forEach(elementHTML => {
            $(elementHTML).trigger('change')
          })
        if (jsonItem.NameField !== '')
          document
            .getElementsByName(jsonItem.NameField)
            .forEach(elementHTML => {
              $(elementHTML).trigger('change')
            })
        createRadioButton(wbaseItem)
      }
    }
  } else if (jsonItem.ColNumber != undefined) {
    let colNumber = Math.max(...selected_list[0].TableRows.map(tr => tr.length))
    jsonItem.ColNumber = parseInt(jsonItem.ColNumber)
    if (colNumber > jsonItem.ColNumber) {
      let deleteList = selected_list[0].TableRows.reduce((a, b) => a.concat(b))
        .filter(
          cell =>
            parseInt(cell.id.substring(cell.id.indexOf('x') + 1)) >
            jsonItem.ColNumber
        )
        .map(cell => cell.contentid)
      deleteList = wbase_list.filter(e => {
        let check = deleteList.some(id => e.GID === id)
        if (check) e.IsDeleted = true
        return check
      })
      for (let i = 0; i < selected_list[0].TableRows.length; i++) {
        let tr = selected_list[0].TableRows[i].filter(
          cell =>
            parseInt(cell.id.substring(cell.id.indexOf('x') + 1)) <=
            jsonItem.ColNumber
        )
        selected_list[0].TableRows[i] = tr
      }
      WBaseDA.editAndDelete([selected_list[0], ...deleteList])
      createTable(selected_list[0])
      replaceAllLyerItemHTML()
      return
    } else {
      for (let i = 1; i <= selected_list[0].TableRows.length; i++) {
        let tr = selected_list[0].TableRows[i - 1]
        let startj =
          parseInt(
            tr.slice(-1)[0].id.substring(tr.slice(-1)[0].id.indexOf('x') + 1)
          ) + 1
        for (let j = startj; j <= jsonItem.ColNumber; j++) {
          tr.push({
            id: `${i}x${j}`,
            contentid: '',
            rowspan: 1,
            colspan: 1
          })
        }
      }
      createTable(selected_list[0])
    }
  } else if (jsonItem.RowNumber != undefined) {
    jsonItem.ColNumber = parseInt(jsonItem.ColNumber)
    if (selected_list[0].TableRows.length > jsonItem.RowNumber) {
      let deleteList = selected_list[0].TableRows.slice(jsonItem.RowNumber)
        .reduce((a, b) => a.concat(b))
        .map(cell => cell.contentid)
      deleteList = wbase_list.filter(e => {
        let check = deleteList.some(id => e.GID === id)
        if (check) e.IsDeleted = true
        return check
      })
      selected_list[0].TableRows = selected_list[0].TableRows.slice(
        0,
        jsonItem.RowNumber
      )
      WBaseDA.editAndDelete([selected_list[0], ...deleteList])
      createTable(selected_list[0])
      replaceAllLyerItemHTML()
      return
    } else {
      let colNumber = Math.max(
        ...selected_list[0].TableRows.map(tr => tr.length)
      )
      let newTr = []
      for (
        let i = selected_list[0].TableRows.length + 1;
        i <= jsonItem.RowNumber;
        i++
      ) {
        let tr = []
        for (let j = 1; j <= colNumber; j++) {
          tr.push({
            id: `${i}x${j}`,
            contentid: '',
            rowspan: 1,
            colspan: 1
          })
        }
        newTr.push(tr)
      }
      selected_list[0].TableRows.push(...newTr)
      createTable(selected_list[0])
    }
  } else if (jsonItem.ColBorderWidth != undefined) {
    selected_list[0].JsonItem.ColBorderWidth = parseFloat(
      jsonItem.ColBorderWidth
    )
    selected_list[0].value.style.setProperty(
      '--col-border',
      `${parseFloat(jsonItem.ColBorderWidth)}px`
    )
  } else if (jsonItem.RowBorderWidth != undefined) {
    selected_list[0].JsonItem.RowBorderWidth = parseFloat(
      jsonItem.RowBorderWidth
    )
    selected_list[0].value.style.setProperty(
      '--row-border',
      `${parseFloat(jsonItem.RowBorderWidth)}px`
    )
  } else if (jsonItem.TableLayout != undefined) {
    selected_list[0].JsonItem.TableLayout = jsonItem.TableLayout
    selected_list[0].value.style.tableLayout = jsonItem.TableLayout
  } else if (jsonItem.TableType != undefined) {
    selected_list[0].JsonItem.Type = jsonItem.TableType
    selected_list[0].value.setAttribute('type', jsonItem.TableType)
  } else if (jsonItem.HeaderBackground != undefined) {
    selected_list[0].JsonItem.HeaderBackground = jsonItem.HeaderBackground
    selected_list[0].value.style.setProperty(
      '--header-bg',
      `#${jsonItem.HeaderBackground}`
    )
  } else if (jsonItem.FooterBackground != undefined) {
    selected_list[0].JsonItem.FooterBackground = jsonItem.FooterBackground
    selected_list[0].value.style.setProperty(
      '--header-bg',
      `#${jsonItem.FooterBackground}`
    )
  } else if (jsonItem.ActionPosition) {
    selected_list[0].JsonItem.ActionPosition = jsonItem.ActionPosition
    if (jsonItem.ActionPosition === 'left') {
      selected_list[0].value
        .querySelectorAll('.tile-item > .btn-tree-action')
        .forEach(btnAction => {
          btnAction.style.order = 0
        })
    } else {
      selected_list[0].value
        .querySelectorAll('.tile-item > .btn-tree-action')
        .forEach(btnAction => {
          btnAction.style.order = 2
        })
    }
  } else if (jsonItem.ActionType) {
    selected_list[0].JsonItem.ActionType = jsonItem.ActionType
    selected_list[0].value
      .querySelectorAll('.tile-item > .btn-tree-action')
      .forEach(btnAction => {
        btnAction.className = `fa-solid fa-${jsonItem.ActionType}-${
          selected_list[0].JsonItem.DefaultHide ? 'right' : 'down'
        } btn-tree-action`
      })
  } else if (jsonItem.ActionSize) {
    selected_list[0].JsonItem.ActionSize = jsonItem.ActionSize
    selected_list[0].value.style.setProperty(
      '--action-size',
      `${jsonItem.ActionSize}px`
    )
  } else if (jsonItem.IndentSpace) {
    selected_list[0].JsonItem.IndentSpace = jsonItem.IndentSpace
    selected_list[0].value.style.setProperty(
      '--indent-space',
      `${jsonItem.IndentSpace}px`
    )
  } else if (jsonItem.ActionColor) {
    selected_list[0].JsonItem.ActionColor = jsonItem.ActionColor
    selected_list[0].value.style.setProperty(
      '--action-color',
      `#${jsonItem.ActionColor}`
    )
  } else if (jsonItem.DefaultHide != undefined) {
    selected_list[0].JsonItem.DefaultHide = jsonItem.DefaultHide
    selected_list[0].value
      .querySelectorAll('.tile-item > .btn-tree-action')
      .forEach(btnAction => {
        btnAction.className = `fa-solid fa-${
          selected_list[0].JsonItem.ActionType
        }-${jsonItem.DefaultHide ? 'right' : 'down'} btn-tree-action`
      })
  } else if (jsonItem.ChartType) {
    selected_list[0].JsonItem.Type = jsonItem.ChartType
    createChart(selected_list[0])
  } else if (jsonItem.HoverOffset != undefined) {
    selected_list[0].JsonItem.HoverOffset = jsonItem.HoverOffset
  } else if (jsonItem.MaxValue != undefined) {
    selected_list[0].JsonItem.MaxValue =
      jsonItem.MaxValue === 'auto' ? null : jsonItem.MaxValue
    createChart(selected_list[0])
  } else if (jsonItem.StepSize != undefined) {
    selected_list[0].JsonItem.StepSize = jsonItem.StepSize
    createChart(selected_list[0])
  } else if (jsonItem.TransitionTime != undefined) {
    selected_list[0].JsonItem.TransitionTime = jsonItem.TransitionTime
  } else if (jsonItem.TransformTime != undefined) {
    selected_list[0].JsonItem.TransformTime = jsonItem.TransformTime
  } else if (jsonItem.AutoPlay != undefined) {
    selected_list[0].JsonItem.AutoPlay = jsonItem.AutoPlay
    if (jsonItem.AutoPlay) {
      $(selected_list[0]).addClass('autoplay')
    } else {
      $(selected_list[0]).removeClass('autoplay')
    }
  } else if (jsonItem.CaroActionType != undefined) {
    selected_list[0].JsonItem.ActionType = jsonItem.CaroActionType
    selected_list[0].value
      .querySelectorAll(':scope > .slide-arrow')
      .forEach(btnAction => {
        if (jsonItem.CaroActionType === 'caret') {
          btnAction.className = btnAction.className.replace(
            'fa-chevron',
            'fa-caret'
          )
        } else {
          btnAction.className = btnAction.className.replace(
            'fa-caret',
            'fa-chevron'
          )
        }
      })
  } else if (jsonItem.CaroActionSize) {
    selected_list[0].JsonItem.ActionSize = jsonItem.CaroActionSize
    selected_list[0].value.style.setProperty(
      '--action-size',
      `${jsonItem.CaroActionSize}px`
    )
  } else if (jsonItem.CaroActionColor) {
    selected_list[0].JsonItem.ActionColor = jsonItem.CaroActionColor
    selected_list[0].value.style.setProperty(
      '--action-color',
      `#${jsonItem.CaroActionColor}`
    )
  } else if (jsonItem.CaroActionBgColor) {
    selected_list[0].JsonItem.ActionBackground = jsonItem.CaroActionBgColor
    selected_list[0].value.style.setProperty(
      '--action-bg',
      `#${jsonItem.CaroActionBgColor}`
    )
  } else if (jsonItem.CaroEffect) {
    selected_list[0].JsonItem.Effect = jsonItem.CaroEffect
    createCarousel(
      selected_list[0],
      wbase_list.filter(e => e.ParentID === selected_list[0].GID)
    )
  }
  if (onSubmit) WBaseDA.edit(selected_list, EnumObj.attribute)
}

function createForm () {
  if (selected_list.length > 1) {
    let list_update = [...selected_list]
    let new_wbase_item = JSON.parse(JSON.stringify(WBaseDefault.frame))
    new_wbase_item = createNewWbase(new_wbase_item).pop()
    new_wbase_item.Name = 'Form'
    new_wbase_item.AttributesItem.Name = 'Form'
    new_wbase_item.CateID = EnumCate.form
    new_wbase_item.StyleItem.DecorationItem.ColorValue = null
    new_wbase_item.StyleItem.PositionItem.Left = `${Math.min(
      ...selected_list.map(e => {
        let leftValue = getWBaseOffset(e).x
        e.StyleItem.PositionItem.ConstraintsX = Constraints.left
        e.StyleItem.PositionItem.Left = `${leftValue}px`
        return leftValue
      })
    ).toFixed(2)}px`
    new_wbase_item.StyleItem.PositionItem.Top = `${Math.min(
      ...selected_list.map(e => {
        let topValue = getWBaseOffset(e).y
        e.StyleItem.PositionItem.ConstraintsY = Constraints.top
        e.StyleItem.PositionItem.Top = `${topValue}px`
        return topValue
      })
    ).toFixed(2)}px`
    new_wbase_item.CountChild = selected_list.length
    new_wbase_item.ListChildID = selected_list.map(e => e.GID)
    new_wbase_item.StyleItem.FrameItem.Width = Math.round(select_box.w / scale)
    new_wbase_item.StyleItem.FrameItem.Height = Math.round(select_box.h / scale)
    new_wbase_item.ParentID = selected_list[0].ParentID
    new_wbase_item.ListID = selected_list[0].ListID
    new_wbase_item.Sort = selected_list[0].Sort
    new_wbase_item.Level = selected_list[0].Level
    for (let i = 0; i < selected_list.length; i++) {
      let eHTML = document.getElementById(selected_list[i].GID)
      document
        .getElementById(`wbaseID:${selected_list[i].GID}`)
        .parentElement.remove()
      selected_list[i].StyleItem.PositionItem.Left = `${
        parseInt(
          `${selected_list[i].StyleItem.PositionItem.Left}`.replace('px', '')
        ) -
        parseInt(
          `${new_wbase_item.StyleItem.PositionItem.Left}`.replace('px', '')
        )
      }px`
      selected_list[i].StyleItem.PositionItem.Top = `${
        parseInt(
          `${selected_list[i].StyleItem.PositionItem.Top}`.replace('px', '')
        ) -
        parseInt(
          `${new_wbase_item.StyleItem.PositionItem.Top}`.replace('px', '')
        )
      }px`
      selected_list[i].ParentID = new_wbase_item.GID
      selected_list[i].ListID += `,${new_wbase_item.GID}`
      selected_list[i].Sort = i
      selected_list[i].Level++
      eHTML.setAttribute('Level', selected_list[i].Level)
      eHTML.setAttribute('listid', selected_list[i].ListID)
      eHTML.style.left = selected_list[i].StyleItem.PositionItem.Left
      eHTML.style.top = selected_list[i].StyleItem.PositionItem.Top
      eHTML.style.zIndex = i
      eHTML.style.order = i
      if (selected_list[i].CountChild > 0) {
        for (let childSelect of wbase_list.filter(e =>
          e.ListID.includes(selected_list[i].GID)
        )) {
          childSelect.ListID = childSelect.ListID
          let thisListID = childSelect.ListID.split(',')
          thisListID = thisListID.slice(
            thisListID.indexOf(selected_list[i].GID)
          )
          thisListID.unshift(...selected_list[i].ListID.split(','))
          childSelect.ListID = thisListID.join(',')
          childSelect.Level = thisListID.length
          childSelect.value.setAttribute('Level', childSelect.Level)
          childSelect.value.setAttribute('listid', childSelect.ListID)
        }
      }
    }
    initComponents(new_wbase_item, selected_list)
    wbase_list.push(new_wbase_item)
    list_update.push(new_wbase_item)
    if (new_wbase_item.ParentID != wbase_parentID) {
      let parent_wbase = wbase_list.find(e => e.GID == new_wbase_item.ParentID)
      parent_wbase.CountChild += 1 - selected_list.length
      let parentHTML = document.getElementById(new_wbase_item.ParentID)
      parentHTML.appendChild(new_wbase_item.value)
      let childrenHTML = [...parentHTML.childNodes]
      childrenHTML.sort(
        (a, b) => parseInt(a.style.zIndex) - parseInt(b.style.zIndex)
      )
      parent_wbase.ListChildID = childrenHTML.map(e => e.id)
      if (!window.getComputedStyle(parentHTML).display.match('flex')) {
        initPositionStyle(new_wbase_item)
      }
    }
    arrange()
    replaceAllLyerItemHTML()
    addSelectList([new_wbase_item])
    WBaseDA.add(list_update)
  } else {
    selected_list[0].Name = 'Form'
    selected_list[0].CateID = EnumCate.form
    let newForm = document.createElement('form')
    for (let i = 0; i < selected_list[0].value.attributes.length; i++) {
      let attrObj = selected_list[0].value.attributes[i]
      newForm.setAttribute(attrObj.name, attrObj.nodeValue)
    }
    selected_list[0].value.replaceWith(newForm)
    newForm.replaceChildren(...selected_list[0].value.childNodes)
    selected_list[0].value = newForm
    WBaseDA.edit(selected_list, EnumObj.wBase)
  }
}

function removeForm () {
  selected_list[0].Name = 'Frame'
  selected_list[0].CateID = EnumCate.frame
  let newFrame = document.createElement('div')
  for (let i = 0; i < selected_list[0].value.attributes.length; i++) {
    let attrObj = selected_list[0].value.attributes[i]
    newFrame.setAttribute(attrObj.name, attrObj.nodeValue)
  }
  selected_list[0].value.replaceWith(newFrame)
  newFrame.replaceChildren(...selected_list[0].value.childNodes)
  selected_list[0].value = newFrame
  WBaseDA.edit(selected_list, EnumObj.wBaseAttribute)
}

function editFormDataContent (elementTag, form) {
  let list_update = []
  if (elementTag.type === 'radio') {
    elementTag.checked = true
    $(elementTag).trigger('change')
    let radioList = [
      ...form.querySelectorAll(`input[name="${elementTag.name}"]`)
    ]
      .filter(radio => radio.type === 'radio')
      .map(radio => radio.parentElement.id)
    list_update.push(
      ...wbase_list.filter(wbasItem =>
        radioList.some(id => wbasItem.GID === id)
      )
    )
  } else if (elementTag.type === 'checkbox') {
    elementTag.checked = !elementTag.checked
    $(elementTag).trigger('change')
    list_update.push(
      wbase_list.find(wbaseItem => wbaseItem.GID === radio.parentElement.id)
    )
  } else {
    $(elementTag).trigger('blur')
    list_update.push(
      wbase_list.find(wbaseItem => wbaseItem.GID === radio.parentElement.id)
    )
  }
  WBaseDA.edit(list_update, EnumObj.attribute)
}
