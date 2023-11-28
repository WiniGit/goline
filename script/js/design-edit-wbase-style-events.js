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
                  ...divSection.querySelectorAll(rule.selectorText)
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
            let selector = [...divSection.querySelectorAll(rule.selectorText)]
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
              [...divSection.querySelectorAll(e.selectorText)].includes(
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
                  ...divSection.querySelectorAll(rule.selectorText)
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
            let selector = [...divSection.querySelectorAll(rule.selectorText)]
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
              [...divSection.querySelectorAll(e.selectorText)].includes(
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
                  ...divSection.querySelectorAll(rule.selectorText)
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
            let selector = [...divSection.querySelectorAll(rule.selectorText)]
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
          cssRule.style.left = null
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
              [...divSection.querySelectorAll(e.selectorText)].includes(
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
                  ...divSection.querySelectorAll(rule.selectorText)
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
              cssRule.style.bottom = null
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
                cWb.value.style.bottom = null
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
          selected_list[0].value.style.bottom = null
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
            let selector = [...divSection.querySelectorAll(rule.selectorText)]
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
          cssRule.style.bottom = null
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
              [...divSection.querySelectorAll(e.selectorText)].includes(
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
                  ...divSection.querySelectorAll(rule.selectorText)
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
              cssRule.style.bottom = null
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
                cWb.value.style.bottom = null
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
          selected_list[0].value.style.bottom = null
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
            let selector = [...divSection.querySelectorAll(rule.selectorText)]
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
          cssRule.style.bottom = null
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
              [...divSection.querySelectorAll(e.selectorText)].includes(
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
                  ...divSection.querySelectorAll(rule.selectorText)
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
              cssRule.style.top = null
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
                cWb.value.style.top = null
                cWb.value.style.bottom = '0px'
                cWb.value.setAttribute('consty', Constraints.bottom)
                wb.StyleItem.PositionItem.Bottom = '0px'
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
          selected_list[0].value.style.top = null
          selected_list[0].value.style.bottom = '0px'
          selected_list[0].value.setAttribute('consty', Constraints.bottom)
          selected_list[0].StyleItem.PositionItem.Bottom = '0px'
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
            let selector = [...divSection.querySelectorAll(rule.selectorText)]
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
          cssRule.style.top = null
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
              [...divSection.querySelectorAll(e.selectorText)].includes(
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
  ratioWH = false,
  isClip
}) {
  let listUpdate = []
  if ((width !== undefined && height !== undefined) || ratioWH) {
    let resizeFixedW = width === 'fixed'
    let resizeFixedH = height === 'fixed'
    if (selected_list[0].StyleItem) {
      for (let wb of selected_list) {
        let children = [
          ...wb.value.querySelectorAll(
            `.wbaseItem-value[level="${wb.Level + 1}"]`
          )
        ]
        if (resizeFixedW) width = wb.value.offsetWidth
        if (resizeFixedH) height = wb.value.offsetHeight
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
              var cssItem = StyleDA.cssStyleSheets.find(e => e.GID === wb.GID)
              for (let cWbHTML of children) {
                StyleDA.docStyleSheets.find(rule => {
                  let selector = [
                    ...wb.value.querySelectorAll(rule.selectorText)
                  ]
                  let check = selector.includes(cWbHTML)
                  if (check) {
                    rule.style.width = cWbHTML.offsetWidth + 'px'
                    selector.forEach(e => e.removeAttribute('width-type'))
                    cssItem.Css = cssItem.Css.replace(
                      new RegExp(`${rule.selectorText} {[^}]*}`, 'g'),
                      rule.cssText
                    )
                  }
                  return check
                })
              }
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
          wb.value.style.width =
            wb.CateID === EnumCate.text ? 'max-content' : null
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
              cssItem ??= StyleDA.cssStyleSheets.find(e => e.GID === wb.GID)
              for (let cWbHTML of children) {
                StyleDA.docStyleSheets.find(rule => {
                  let selector = [
                    ...wb.value.querySelectorAll(rule.selectorText)
                  ]
                  let check = selector.includes(cWbHTML)
                  if (check) {
                    rule.style.height = cWbHTML.offsetHeight + 'px'
                    selector.forEach(e => e.removeAttribute('height-type'))
                    cssItem.Css = cssItem.Css.replace(
                      new RegExp(`${rule.selectorText} {[^}]*}`, 'g'),
                      rule.cssText
                    )
                  }
                  return check
                })
              }
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
        if (cssItem) {
          StyleDA.docStyleSheets.find(rule => {
            let selector = [...divSection.querySelectorAll(rule.selectorText)]
            let check = selector.includes(wb.value)
            if (check) {
              rule.style.width = wb.value.style.width
              rule.style.height = wb.value.style.height
              selector.forEach(e => {
                if (wb.value.getAttribute('width-type'))
                  e.setAttribute(
                    'width-type',
                    wb.value.getAttribute('width-type')
                  )
                if (wb.value.getAttribute('height-type'))
                  e.setAttribute(
                    'height-type',
                    wb.value.getAttribute('height-type')
                  )
              })
              cssItem.Css = cssItem.Css.replace(
                new RegExp(`${rule.selectorText} {[^}]*}`, 'g'),
                rule.cssText
              )
            }
            return check
          })
          StyleDA.editStyleSheet(cssItem)
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
        if (resizeFixedW) width = wb.value.offsetWidth
        if (resizeFixedH) height = wb.value.offsetHeight
        let cssRule = StyleDA.docStyleSheets.find(rule => {
          let selector = [...divSection.querySelectorAll(rule.selectorText)]
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
          cssRule.style.width =
            wb.CateID === EnumCate.text ? 'max-content' : null
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
    let resizeFixed = width === 'fixed'
    if (selected_list[0].StyleItem) {
      for (let wb of selected_list) {
        let children = [
          ...wb.value.querySelectorAll(
            `.wbaseItem-value[level="${wb.Level + 1}"]`
          )
        ]
        if (resizeFixed) width = wb.value.offsetWidth
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
              var cssItem = StyleDA.cssStyleSheets.find(e => e.GID === wb.GID)
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
          wb.value.style.width =
            wb.CateID === EnumCate.text ? 'max-content' : null
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
        if (cssItem) {
          StyleDA.docStyleSheets.find(rule => {
            let selector = [...divSection.querySelectorAll(rule.selectorText)]
            let check = selector.includes(wb.value)
            if (check) {
              rule.style.width = wb.value.style.width
              selector.forEach(e => {
                if (wb.value.getAttribute('width-type'))
                  e.setAttribute(
                    'width-type',
                    wb.value.getAttribute('width-type')
                  )
              })
              cssItem.Css = cssItem.Css.replace(
                new RegExp(`${rule.selectorText} {[^}]*}`, 'g'),
                rule.cssText
              )
            }
            return check
          })
          StyleDA.editStyleSheet(cssItem)
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
        if (resizeFixed) width = wb.value.offsetWidth
        let cssRule = StyleDA.docStyleSheets.find(rule => {
          let selector = [...divSection.querySelectorAll(rule.selectorText)]
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
          cssRule.style.width =
            wb.CateID === EnumCate.text ? 'max-content' : null
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
    let resizeFixed = height === 'fixed'
    if (selected_list[0].StyleItem) {
      for (let wb of selected_list) {
        let children = [
          ...wb.value.querySelectorAll(
            `.wbaseItem-value[level="${wb.Level + 1}"]`
          )
        ]
        if (resizeFixed) height = wb.value.offsetHeight
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
              var cssItem = StyleDA.cssStyleSheets.find(e => e.GID === wb.GID)
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
        if (cssItem) {
          StyleDA.docStyleSheets.find(rule => {
            let selector = [...divSection.querySelectorAll(rule.selectorText)]
            let check = selector.includes(wb.value)
            if (check) {
              rule.style.height = wb.value.style.height
              selector.forEach(e => {
                if (wb.value.getAttribute('height-type'))
                  e.setAttribute(
                    'height-type',
                    wb.value.getAttribute('height-type')
                  )
              })
              cssItem.Css = cssItem.Css.replace(
                new RegExp(`${rule.selectorText} {[^}]*}`, 'g'),
                rule.cssText
              )
            }
            return check
          })
          StyleDA.editStyleSheet(cssItem)
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
        if (resizeFixed) height = wb.value.offsetHeight
        let cssRule = StyleDA.docStyleSheets.find(rule => {
          let selector = [...divSection.querySelectorAll(rule.selectorText)]
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
          [...divSection.querySelectorAll(e.selectorText)].includes(wb.value)
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
          [...divSection.querySelectorAll(e.selectorText)].includes(wb.value)
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
        if (wb.IsWini && wb.CateID !== EnumCate.variant) {
          let cssItem = StyleDA.cssStyleSheets.find(e => e.GID === wb.GID)
          let cssRule = StyleDA.docStyleSheets.find(e =>
            [...divSection.querySelectorAll(e.selectorText)].includes(wb.value)
          )
          cssRule.style.style.borderRadius = `${radius}px`
          cssItem.Css = cssItem.Css.replace(
            new RegExp(`${cssRule.selectorText} {[^}]*}`, 'g'),
            cssRule.cssText
          )
          StyleDA.editStyleSheet(cssItem)
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
        let cssRule = StyleDA.docStyleSheets.find(e =>
          [...divSection.querySelectorAll(e.selectorText)].includes(wb.value)
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
        wb.value.style.borderRadius = `${radiusTL}px ${wb.StyleItem.FrameItem.TopRight}px ${wb.StyleItem.FrameItem.BottomRight}px ${wb.StyleItem.FrameItem.BottomLeft}px`
        if (wb.IsWini && wb.CateID !== EnumCate.variant) {
          let cssItem = StyleDA.cssStyleSheets.find(e => e.GID === wb.GID)
          let cssRule = StyleDA.docStyleSheets.find(e =>
            [...divSection.querySelectorAll(e.selectorText)].includes(wb.value)
          )
          cssRule.style.style.borderRadius = `${radiusTL}px ${wb.StyleItem.FrameItem.TopRight}px ${wb.StyleItem.FrameItem.BottomRight}px ${wb.StyleItem.FrameItem.BottomLeft}px`
          cssItem.Css = cssItem.Css.replace(
            new RegExp(`${cssRule.selectorText} {[^}]*}`, 'g'),
            cssRule.cssText
          )
          StyleDA.editStyleSheet(cssItem)
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
        let cssRule = StyleDA.docStyleSheets.find(e =>
          [...divSection.querySelectorAll(e.selectorText)].includes(wb.value)
        )
        let radiusList = cssRule.style.borderRadius.split(' ')
        radiusList[0] = `${radiusTL}px`
        cssRule.style.borderRadius = radiusList.join(' ')
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
        wb.value.style.borderRadius = `${wb.StyleItem.FrameItem.TopLeft}px ${radiusTR}px ${wb.StyleItem.FrameItem.BottomRight}px ${wb.StyleItem.FrameItem.BottomLeft}px`
        if (wb.IsWini && wb.CateID !== EnumCate.variant) {
          let cssItem = StyleDA.cssStyleSheets.find(e => e.GID === wb.GID)
          let cssRule = StyleDA.docStyleSheets.find(e =>
            [...divSection.querySelectorAll(e.selectorText)].includes(wb.value)
          )
          cssRule.style.style.borderRadius = `${wb.StyleItem.FrameItem.TopLeft}px ${radiusTR}px ${wb.StyleItem.FrameItem.BottomRight}px ${wb.StyleItem.FrameItem.BottomLeft}px`
          cssItem.Css = cssItem.Css.replace(
            new RegExp(`${cssRule.selectorText} {[^}]*}`, 'g'),
            cssRule.cssText
          )
          StyleDA.editStyleSheet(cssItem)
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
        let cssRule = StyleDA.docStyleSheets.find(e =>
          [...divSection.querySelectorAll(e.selectorText)].includes(wb.value)
        )
        let radiusList = cssRule.style.borderRadius.split(' ')
        radiusList[1] = `${radiusTR}px`
        cssRule.style.borderRadius = radiusList.join(' ')
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
        wb.value.style.borderRadius = `${wb.StyleItem.FrameItem.TopLeft}px ${wb.StyleItem.FrameItem.TopRight}px ${wb.StyleItem.FrameItem.BottomRight}px ${radiusBL}px`
        if (wb.IsWini && wb.CateID !== EnumCate.variant) {
          let cssItem = StyleDA.cssStyleSheets.find(e => e.GID === wb.GID)
          let cssRule = StyleDA.docStyleSheets.find(e =>
            [...divSection.querySelectorAll(e.selectorText)].includes(wb.value)
          )
          cssRule.style.style.borderRadius = `${wb.StyleItem.FrameItem.TopLeft}px ${wb.StyleItem.FrameItem.TopRight}px ${wb.StyleItem.FrameItem.BottomRight}px ${radiusBL}px`
          cssItem.Css = cssItem.Css.replace(
            new RegExp(`${cssRule.selectorText} {[^}]*}`, 'g'),
            cssRule.cssText
          )
          StyleDA.editStyleSheet(cssItem)
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
        let cssRule = StyleDA.docStyleSheets.find(e =>
          [...divSection.querySelectorAll(e.selectorText)].includes(wb.value)
        )
        let radiusList = cssRule.style.borderRadius.split(' ')
        radiusList[3] = `${radiusBL}px`
        cssRule.style.borderRadius = radiusList.join(' ')
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
        wb.value.style.borderRadius = `${wb.StyleItem.FrameItem.TopLeft}px ${wb.StyleItem.FrameItem.TopRight}px ${radiusBR}px ${wb.StyleItem.FrameItem.BottomLeft}px`
        if (wb.IsWini && wb.CateID !== EnumCate.variant) {
          let cssItem = StyleDA.cssStyleSheets.find(e => e.GID === wb.GID)
          let cssRule = StyleDA.docStyleSheets.find(e =>
            [...divSection.querySelectorAll(e.selectorText)].includes(wb.value)
          )
          cssRule.style.style.borderRadius = `${wb.StyleItem.FrameItem.TopLeft}px ${wb.StyleItem.FrameItem.TopRight}px ${radiusBR}px ${wb.StyleItem.FrameItem.BottomLeft}px`
          cssItem.Css = cssItem.Css.replace(
            new RegExp(`${cssRule.selectorText} {[^}]*}`, 'g'),
            cssRule.cssText
          )
          StyleDA.editStyleSheet(cssItem)
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
        let cssRule = StyleDA.docStyleSheets.find(e =>
          [...divSection.querySelectorAll(e.selectorText)].includes(wb.value)
        )
        let radiusList = cssRule.style.borderRadius.split(' ')
        radiusList[2] = `${radiusBR}px`
        cssRule.style.borderRadius = radiusList.join(' ')
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
  } else if (typeof isClip === 'boolean') {
    if (selected_list[0].StyleItem) {
      for (let wb of selected_list) {
        wb.StyleItem.FrameItem.IsClip = isClip
        wb.value.style.overflow = isClip ? 'hidden' : null
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
          [...divSection.querySelectorAll(e.selectorText)].includes(wb.value)
        )
        cssRule.style.overflow = isClip ? 'hidden' : null
        cssItem.Css = cssItem.Css.replace(
          new RegExp(`${cssRule.selectorText} {[^}]*}`, 'g'),
          cssRule.cssText
        )
      }
      StyleDA.editStyleSheet(cssItem)
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
              let selector = [...divSection.querySelectorAll(rule.selectorText)]
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
              let selector = [...divSection.querySelectorAll(rule.selectorText)]
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
              let selector = [...divSection.querySelectorAll(rule.selectorText)]
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
            cssRule.style.left = x + 'px'
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
              let selector = [...divSection.querySelectorAll(rule.selectorText)]
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
              x +
              (wb.value.offsetWidth - wb.value.parentElement.offsetWidth) / 2
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
              let selector = [...divSection.querySelectorAll(rule.selectorText)]
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
              let selector = [...divSection.querySelectorAll(rule.selectorText)]
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
              let selector = [...divSection.querySelectorAll(rule.selectorText)]
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
            wb.StyleItem.PositionItem.Top = y + 'px'
            wb.StyleItem.PositionItem.Bottom = bot
            wb.StyleItem.PositionItem.ConstraintsY = Constraints.top_bottom
            wb.value.setAttribute('constx', Constraints.top_bottom)
            wb.value.style.top = y + 'px'
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
              let selector = [...divSection.querySelectorAll(rule.selectorText)]
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
            cssRule.style.top = y + 'px'
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
              let selector = [...divSection.querySelectorAll(rule.selectorText)]
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
              y +
              (wb.value.offsetHeight - wb.value.parentElement.offsetHeight) / 2
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
              let selector = [...divSection.querySelectorAll(rule.selectorText)]
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

function addBackgroundColor () {
  let listUpdate = selected_list.filter(wb => wb.CateID !== EnumCate.text)
  if (listUpdate[0].StyleItem) {
    for (let wb of [...listUpdate]) {
      switch (wb.CateID) {
        case EnumCate.frame:
          var new_color_value = 'FFFFFFFF'
          break
        case EnumCate.form:
          var new_color_value = 'FFFFFFFF'
          break
        case EnumCate.variant:
          var new_color_value = 'FFFFFFFF'
          break
        case EnumCate.rectangle:
          var new_color_value = 'C4C4C4FF'
          break
        default:
          var new_color_value = 'D9D9D9FF'
          break
      }
      wb.StyleItem.DecorationItem.ColorValue = new_color_value
      wb.value.style.backgroundColor = `#${new_color_value}`
      if (wb.IsWini && wb.CateID !== EnumCate.variant) {
        let cssItem = StyleDA.cssStyleSheets.find(e => e.GID === wb.GID)
        let cssRule = StyleDA.docStyleSheets.find(e =>
          [...divSection.querySelectorAll(e.selectorText)].includes(wb.value)
        )
        cssRule.style.backgroundColor = `#${new_color_value}`
        cssItem.Css = cssItem.Css.replace(
          new RegExp(`${cssRule.selectorText} {[^}]*}`, 'g'),
          cssRule.cssText
        )
        StyleDA.editStyleSheet(cssItem)
      }
    }
    WBaseDA.edit(listUpdate, EnumObj.decoration)
  } else {
    let pWbComponent = listUpdate[0].value.closest(
      `.wbaseItem-value[iswini="true"]`
    )
    let cssItem = StyleDA.cssStyleSheets.find(e => e.GID === pWbComponent.id)
    for (let wb of [...listUpdate]) {
      let cssRule = StyleDA.docStyleSheets.find(e =>
        [...divSection.querySelectorAll(e.selectorText)].includes(wb.value)
      )
      switch (wb.CateID) {
        case EnumCate.frame:
          var new_color_value = 'FFFFFFFF'
          break
        case EnumCate.form:
          var new_color_value = 'FFFFFFFF'
          break
        case EnumCate.variant:
          var new_color_value = 'FFFFFFFF'
          break
        case EnumCate.rectangle:
          var new_color_value = 'C4C4C4FF'
          break
        default:
          var new_color_value = 'D9D9D9FF'
          break
      }
      cssRule.style.backgroundColor = `#${new_color_value}`
      cssItem.Css = cssItem.Css.replace(
        new RegExp(`${cssRule.selectorText} {[^}]*}`, 'g'),
        cssRule.cssText
      )
    }
    StyleDA.editStyleSheet(cssItem)
  }
}

function unlinkColorSkin () {
  let listUpdate = selected_list.filter(wb => wb.CateID !== EnumCate.text)
  if (listUpdate[0].StyleItem) {
    for (let wb of [...listUpdate]) {
      wb.StyleItem.DecorationItem.ColorID = null
      let backgroundColor = Ultis.rgbToHex(
        window.getComputedStyle(wb.value).backgroundColor
      )
      wb.StyleItem.DecorationItem.ColorValue = backgroundColor.replace('#', '')
      wb.value.style.backgroundColor = backgroundColor
      if (wb.IsWini && wb.CateID !== EnumCate.variant) {
        let cssItem = StyleDA.cssStyleSheets.find(e => e.GID === wb.GID)
        let cssRule = StyleDA.docStyleSheets.find(e =>
          [...divSection.querySelectorAll(e.selectorText)].includes(wb.value)
        )
        cssRule.style.backgroundColor = backgroundColor
        cssItem.Css = cssItem.Css.replace(
          new RegExp(`${cssRule.selectorText} {[^}]*}`, 'g'),
          cssRule.cssText
        )
        StyleDA.editStyleSheet(cssItem)
      }
    }
    WBaseDA.edit(listUpdate, EnumObj.decoration)
  } else {
    let pWbComponent = listUpdate[0].value.closest(
      `.wbaseItem-value[iswini="true"]`
    )
    let cssItem = StyleDA.cssStyleSheets.find(e => e.GID === pWbComponent.id)
    for (let wb of [...listUpdate]) {
      let cssRule = StyleDA.docStyleSheets.find(e =>
        [...divSection.querySelectorAll(e.selectorText)].includes(wb.value)
      )
      let backgroundColor = Ultis.rgbToHex(
        window.getComputedStyle(wb.value).backgroundColor
      )
      cssRule.style.backgroundColor = backgroundColor
      cssItem.Css = cssItem.Css.replace(
        new RegExp(`${cssRule.selectorText} {[^}]*}`, 'g'),
        cssRule.cssText
      )
    }
    StyleDA.editStyleSheet(cssItem)
  }
}

function handleEditBackground ({ hexCode, image, colorSkin, onSubmit = true }) {
  let listUpdate = selected_list.filter(wb => wb.CateID !== EnumCate.text)
  if (colorSkin) {
    if (listUpdate[0].StyleItem) {
      for (let wb of [...listUpdate]) {
        wb.StyleItem.DecorationItem.ColorID = colorSkin.GID
        wb.StyleItem.DecorationItem.ColorValue = colorSkin.Value
        wb.value.style.backgroundImage = null
        switch (wb.CateID) {
          case EnumCate.svg:
            getColorSvg(wb)
            break
          case EnumCate.radio_button:
            wb.value.style.setProperty('--checked-color', `#${colorSkin.Value}`)
            break
          case EnumCate.w_switch:
            wb.value.style.setProperty('--checked-color', `#${colorSkin.Value}`)
            break
          case EnumCate.checkbox:
            wb.value.style.setProperty('--checked-color', `#${colorSkin.Value}`)
            break
          default:
            wb.value.style.backgroundColor = `var(--background-color-${colorSkin.GID})`
            break
        }
        if (wb.IsWini && wb.CateID !== EnumCate.variant) {
          let cssItem = StyleDA.cssStyleSheets.find(e => e.GID === wb.GID)
          let cssRule = StyleDA.docStyleSheets.find(e =>
            [...divSection.querySelectorAll(e.selectorText)].includes(wb.value)
          )
          cssRule.style.backgroundImage = null
          switch (wb.CateID) {
            // case EnumCate.svg:
            //   getColorSvg(wb)
            //   break
            case EnumCate.radio_button:
              cssRule.style.setProperty(
                '--checked-color',
                `#${colorSkin.Value}`
              )
              break
            case EnumCate.w_switch:
              cssRule.style.setProperty(
                '--checked-color',
                `#${colorSkin.Value}`
              )
              break
            case EnumCate.checkbox:
              cssRule.style.setProperty(
                '--checked-color',
                `#${colorSkin.Value}`
              )
              break
            default:
              cssRule.style.backgroundColor = `var(--background-color-${colorSkin.GID})`
              break
          }
          cssItem.Css = cssItem.Css.replace(
            new RegExp(`${cssRule.selectorText} {[^}]*}`, 'g'),
            cssRule.cssText
          )
          StyleDA.editStyleSheet(cssItem)
        }
      }
      WBaseDA.edit(listUpdate, EnumObj.decoration)
    } else {
      let pWbComponent = listUpdate[0].value.closest(
        `.wbaseItem-value[iswini="true"]`
      )
      let cssItem = StyleDA.cssStyleSheets.find(e => e.GID === pWbComponent.id)
      for (let wb of [...listUpdate]) {
        let cssRule = StyleDA.docStyleSheets.find(e =>
          [...divSection.querySelectorAll(e.selectorText)].includes(wb.value)
        )
        cssRule.style.backgroundImage = null
        switch (wb.CateID) {
          case EnumCate.svg:
            getColorSvg(wb)
            break
          case EnumCate.radio_button:
            cssRule.style.setProperty('--checked-color', `#${colorSkin.Value}`)
            break
          case EnumCate.w_switch:
            cssRule.style.setProperty('--checked-color', `#${colorSkin.Value}`)
            break
          case EnumCate.checkbox:
            cssRule.style.setProperty('--checked-color', `#${colorSkin.Value}`)
            break
          default:
            cssRule.style.backgroundColor = `var(--background-color-${colorSkin.GID})`
            break
        }
        cssItem.Css = cssItem.Css.replace(
          new RegExp(`${cssRule.selectorText} {[^}]*}`, 'g'),
          cssRule.cssText
        )
      }
      StyleDA.editStyleSheet(cssItem)
    }
  } else if (hexCode !== undefined) {
    if (listUpdate[0].StyleItem) {
      for (let wb of [...listUpdate]) {
        wb.StyleItem.DecorationItem.ColorID = null
        wb.StyleItem.DecorationItem.ColorValue = hexCode
        wb.value.style.backgroundImage = null
        switch (wb.CateID) {
          case EnumCate.svg:
            getColorSvg(wb)
            break
          case EnumCate.radio_button:
            wb.value.style.setProperty('--checked-color', `#${hexCode}`)
            break
          case EnumCate.w_switch:
            wb.value.style.setProperty('--checked-color', `#${hexCode}`)
            break
          case EnumCate.checkbox:
            wb.value.style.setProperty('--checked-color', `#${hexCode}`)
            break
          default:
            wb.value.style.backgroundColor =
              hexCode === null ? null : `#${hexCode}`
            break
        }
        if (wb.IsWini && wb.CateID !== EnumCate.variant) {
          let cssItem = StyleDA.cssStyleSheets.find(e => e.GID === wb.GID)
          let cssRule = StyleDA.docStyleSheets.find(e =>
            [...divSection.querySelectorAll(e.selectorText)].includes(wb.value)
          )
          cssRule.style.backgroundImage = null
          switch (wb.CateID) {
            // case EnumCate.svg:
            //   getColorSvg(wb)
            //   break
            case EnumCate.radio_button:
              cssRule.style.setProperty('--checked-color', `#${hexCode}`)
              break
            case EnumCate.w_switch:
              cssRule.style.setProperty('--checked-color', `#${hexCode}`)
              break
            case EnumCate.checkbox:
              cssRule.style.setProperty('--checked-color', `#${hexCode}`)
              break
            default:
              cssRule.style.backgroundColor =
                hexCode === null ? null : `#${hexCode}`
              break
          }
          cssItem.Css = cssItem.Css.replace(
            new RegExp(`${cssRule.selectorText} {[^}]*}`, 'g'),
            cssRule.cssText
          )
          StyleDA.editStyleSheet(cssItem)
        }
      }
      if (onSubmit) WBaseDA.edit(listUpdate, EnumObj.decoration)
    } else {
      let pWbComponent = listUpdate[0].value.closest(
        `.wbaseItem-value[iswini="true"]`
      )
      let cssItem = StyleDA.cssStyleSheets.find(e => e.GID === pWbComponent.id)
      for (let wb of [...listUpdate]) {
        let cssRule = StyleDA.docStyleSheets.find(e =>
          [...divSection.querySelectorAll(e.selectorText)].includes(wb.value)
        )
        cssRule.style.backgroundImage = null
        switch (wb.CateID) {
          case EnumCate.svg:
            getColorSvg(wb)
            break
          case EnumCate.radio_button:
            cssRule.style.setProperty('--checked-color', `#${hexCode}`)
            break
          case EnumCate.w_switch:
            cssRule.style.setProperty('--checked-color', `#${hexCode}`)
            break
          case EnumCate.checkbox:
            cssRule.style.setProperty('--checked-color', `#${hexCode}`)
            break
          default:
            cssRule.style.backgroundColor =
              hexCode === null ? null : `#${hexCode}`
            break
        }
        cssItem.Css = cssItem.Css.replace(
          new RegExp(`${cssRule.selectorText} {[^}]*}`, 'g'),
          cssRule.cssText
        )
      }
      if (onSubmit) StyleDA.editStyleSheet(cssItem)
    }
  } else if (image && !image.endsWith('.svg')) {
    listUpdate = listUpdate.filter(wb =>
      EnumCate.noImgBg.every(ct => wb.CateID !== ct)
    )
    if (listUpdate[0].StyleItem) {
      for (let wb of [...listUpdate]) {
        wb.StyleItem.DecorationItem.ColorID = null
        wb.StyleItem.DecorationItem.ColorValue = image.replaceAll(' ', '%20')
        wb.value.style.backgroundColor = null
        wb.value.style.backgroundImage = `url(${
          urlImg + image.replaceAll(' ', '%20')
        })`
        if (wb.IsWini && wb.CateID !== EnumCate.variant) {
          let cssItem = StyleDA.cssStyleSheets.find(e => e.GID === wb.GID)
          let cssRule = StyleDA.docStyleSheets.find(e =>
            [...divSection.querySelectorAll(e.selectorText)].includes(wb.value)
          )
          cssRule.style.backgroundColor = null
          cssRule.style.backgroundImage = `url(${
            urlImg + image.replaceAll(' ', '%20')
          })`
          cssItem.Css = cssItem.Css.replace(
            new RegExp(`${cssRule.selectorText} {[^}]*}`, 'g'),
            cssRule.cssText
          )
          StyleDA.editStyleSheet(cssItem)
        }
      }
      WBaseDA.edit(listUpdate, EnumObj.decoration)
    } else {
      let pWbComponent = listUpdate[0].value.closest(
        `.wbaseItem-value[iswini="true"]`
      )
      let cssItem = StyleDA.cssStyleSheets.find(e => e.GID === pWbComponent.id)
      for (let wb of [...listUpdate]) {
        let cssRule = StyleDA.docStyleSheets.find(e =>
          [...divSection.querySelectorAll(e.selectorText)].includes(wb.value)
        )
        cssRule.style.backgroundColor = null
        cssRule.style.backgroundImage = `url(${
          urlImg + image.replaceAll(' ', '%20')
        })`
        cssItem.Css = cssItem.Css.replace(
          new RegExp(`${cssRule.selectorText} {[^}]*}`, 'g'),
          cssRule.cssText
        )
      }
      StyleDA.editStyleSheet(cssItem)
    }
  }
}

function unlinkTypoSkin () {
  let listUpdate = selected_list.filter(
    wb => wb.CateID === EnumCate.text || wb.CateID === EnumCate.textformfield
  )
  if (listUpdate[0].StyleItem) {
    for (let wb of [...listUpdate]) {
      let skinTypo = wb.StyleItem.TextStyleItem
      let newTextStyleItem = {
        GID: uuidv4(),
        Name: 'new text style',
        FontSize: skinTypo.FontSize,
        FontWeight: skinTypo.FontWeight,
        CateID: 17,
        IsStyle: false,
        ColorValue: skinTypo.ColorValue,
        LetterSpacing: skinTypo.LetterSpacing,
        FontFamily: skinTypo.FontFamily,
        Height: skinTypo.Height
      }
      wb.StyleItem.TextStyleID = null
      wb.StyleItem.TextStyleItem = newTextStyleItem
      wb.value.style.font = null
      wb.value.style.fontFamily = newTextStyleItem.FontFamily
      wb.value.style.fontSize = `${newTextStyleItem.FontSize}px`
      wb.value.style.fontWeight = newTextStyleItem.FontWeight
      wb.value.style.color = `#${newTextStyleItem.ColorValue}`
      wb.value.style.letterSpacing = `${newTextStyleItem.LetterSpacing}px`
      if (newTextStyleItem.Height != undefined)
        wb.value.style.lineHeight = `${newTextStyleItem.Height}px`
    }
    WBaseDA.addStyle(listUpdate, EnumObj.textStyle)
    listUpdate.forEach(
      wb => (wb.StyleItem.TextStyleID = wb.StyleItem.TextStyleItem.GID)
    )
  } else {
    let pWbComponent = listUpdate[0].value.closest(
      `.wbaseItem-value[iswini="true"]`
    )
    let cssItem = StyleDA.cssStyleSheets.find(e => e.GID === pWbComponent.id)
    for (let wb of [...listUpdate]) {
      let cssRule = StyleDA.docStyleSheets.find(e =>
        [...divSection.querySelectorAll(e.selectorText)].includes(wb.value)
      )
      let wbStyle =
        wb.CateID === EnumCate.text
          ? window.getComputedStyle(wb.value)
          : window.getComputedStyle(wb.value.querySelector('input'))
      let typoItem = {
        FontSize: wbStyle.fontSize,
        FontWeight: wbStyle.fontWeight,
        ColorValue: Ultis.rgbToHex(wbStyle.color),
        LetterSpacing: parseFloat(
          wbStyle.letterSpacing.length > 0 ? wbStyle.letterSpacing : '0'
        ),
        FontFamily: wbStyle.fontFamily,
        Height: wbStyle.lineHeight.length > 0 ? wbStyle.lineHeight : null
      }
      cssRule.style.font = null
      cssRule.style.fontFamily = typoItem.FontFamily
      cssRule.style.fontSize = typoItem.FontSize
      cssRule.style.fontWeight = typoItem.FontWeight
      cssRule.style.color = typoItem.ColorValue
      cssRule.style.letterSpacing = typoItem.LetterSpacing
      if (typoItem.Height != null) cssRule.style.lineHeight = typoItem.Height
      cssItem.Css = cssItem.Css.replace(
        new RegExp(`${cssRule.selectorText} {[^}]*}`, 'g'),
        cssRule.cssText
      )
    }
    StyleDA.editStyleSheet(cssItem)
  }
}

function handleEditTypo ({
  typoSkin,
  color,
  fontFamily,
  fontSize,
  fontWeight,
  height,
  letterSpacing,
  textAlign,
  alignVertical,
  onSubmit = true
}) {
  let listUpdate = selected_list.filter(
    wb => wb.CateID === EnumCate.text || wb.CateID === EnumCate.textformfield
  )
  if (typoSkin) {
    if (listUpdate[0].StyleItem) {
      for (let wb of [...listUpdate]) {
        wb.StyleItem.TextStyleID = typoSkin.GID
        wb.StyleItem.TextStyleItem = typoSkin
        wb.value.style.font = `var(--font-style-${typoSkin.GID})`
        wb.value.style.color = `var(--font-color-${typoSkin.GID})`
      }
      WBaseDA.edit(listUpdate, EnumObj.style)
    } else {
      let pWbComponent = listUpdate[0].value.closest(
        `.wbaseItem-value[iswini="true"]`
      )
      let cssItem = StyleDA.cssStyleSheets.find(e => e.GID === pWbComponent.id)
      for (let wb of [...listUpdate]) {
        let cssRule = StyleDA.docStyleSheets.find(e =>
          [...divSection.querySelectorAll(e.selectorText)].includes(wb.value)
        )
        cssRule.style.font = `var(--font-style-${typoSkin.GID})`
        cssRule.style.color = `var(--font-color-${typoSkin.GID})`
        cssItem.Css = cssItem.Css.replace(
          new RegExp(`${cssRule.selectorText} {[^}]*}`, 'g'),
          cssRule.cssText
        )
      }
      StyleDA.editStyleSheet(cssItem)
    }
  } else if (color) {
    if (listUpdate[0].StyleItem) {
      for (let wb of [...listUpdate]) {
        wb.StyleItem.TextStyleItem.ColorValue = color
        wb.value.style.color = `#${color}`
      }
      if (onSubmit) WBaseDA.edit(listUpdate, EnumObj.textStyle)
    } else {
      let pWbComponent = listUpdate[0].value.closest(
        `.wbaseItem-value[iswini="true"]`
      )
      let cssItem = StyleDA.cssStyleSheets.find(e => e.GID === pWbComponent.id)
      for (let wb of [...listUpdate]) {
        let cssRule = StyleDA.docStyleSheets.find(e =>
          [...divSection.querySelectorAll(e.selectorText)].includes(wb.value)
        )
        cssRule.style.color = `#${color}`
        cssItem.Css = cssItem.Css.replace(
          new RegExp(`${cssRule.selectorText} {[^}]*}`, 'g'),
          cssRule.cssText
        )
      }
      if (onSubmit) StyleDA.editStyleSheet(cssItem)
    }
  } else if (fontFamily) {
    if (listUpdate[0].StyleItem) {
      for (let wb of [...listUpdate]) {
        wb.StyleItem.TextStyleItem.FontFamily = fontFamily
        wb.value.style.fontFamily = fontFamily
      }
      WBaseDA.edit(listUpdate, EnumObj.textStyle)
    } else {
      let pWbComponent = listUpdate[0].value.closest(
        `.wbaseItem-value[iswini="true"]`
      )
      let cssItem = StyleDA.cssStyleSheets.find(e => e.GID === pWbComponent.id)
      for (let wb of [...listUpdate]) {
        let cssRule = StyleDA.docStyleSheets.find(e =>
          [...divSection.querySelectorAll(e.selectorText)].includes(wb.value)
        )
        cssRule.style.fontFamily = fontFamily
        cssItem.Css = cssItem.Css.replace(
          new RegExp(`${cssRule.selectorText} {[^}]*}`, 'g'),
          cssRule.cssText
        )
      }
      StyleDA.editStyleSheet(cssItem)
    }
  } else if (fontSize !== undefined) {
    if (listUpdate[0].StyleItem) {
      for (let wb of [...listUpdate]) {
        wb.StyleItem.TextStyleItem.FontSize = fontSize
        wb.value.style.fontSize = `${fontSize}px`
      }
      WBaseDA.edit(listUpdate, EnumObj.textStyle)
    } else {
      let pWbComponent = listUpdate[0].value.closest(
        `.wbaseItem-value[iswini="true"]`
      )
      let cssItem = StyleDA.cssStyleSheets.find(e => e.GID === pWbComponent.id)
      for (let wb of [...listUpdate]) {
        let cssRule = StyleDA.docStyleSheets.find(e =>
          [...divSection.querySelectorAll(e.selectorText)].includes(wb.value)
        )
        cssRule.style.fontSize = `${fontSize}px`
        cssItem.Css = cssItem.Css.replace(
          new RegExp(`${cssRule.selectorText} {[^}]*}`, 'g'),
          cssRule.cssText
        )
      }
      StyleDA.editStyleSheet(cssItem)
    }
  } else if (fontWeight) {
    if (listUpdate[0].StyleItem) {
      for (let wb of [...listUpdate]) {
        wb.StyleItem.TextStyleItem.FontWeight = fontWeight
        wb.value.style.fontWeight = fontWeight
      }
      WBaseDA.edit(listUpdate, EnumObj.textStyle)
    } else {
      let pWbComponent = listUpdate[0].value.closest(
        `.wbaseItem-value[iswini="true"]`
      )
      let cssItem = StyleDA.cssStyleSheets.find(e => e.GID === pWbComponent.id)
      for (let wb of [...listUpdate]) {
        let cssRule = StyleDA.docStyleSheets.find(e =>
          [...divSection.querySelectorAll(e.selectorText)].includes(wb.value)
        )
        cssRule.style.fontWeight = fontWeight
        cssItem.Css = cssItem.Css.replace(
          new RegExp(`${cssRule.selectorText} {[^}]*}`, 'g'),
          cssRule.cssText
        )
      }
      StyleDA.editStyleSheet(cssItem)
    }
  } else if (height !== undefined) {
    if (listUpdate[0].StyleItem) {
      for (let wb of [...listUpdate]) {
        wb.StyleItem.TextStyleItem.Height = height
        wb.value.style.height = height === null ? height : `${height}px`
      }
      WBaseDA.edit(listUpdate, EnumObj.textStyle)
    } else {
      let pWbComponent = listUpdate[0].value.closest(
        `.wbaseItem-value[iswini="true"]`
      )
      let cssItem = StyleDA.cssStyleSheets.find(e => e.GID === pWbComponent.id)
      for (let wb of [...listUpdate]) {
        let cssRule = StyleDA.docStyleSheets.find(e =>
          [...divSection.querySelectorAll(e.selectorText)].includes(wb.value)
        )
        cssRule.style.height = height === null ? height : `${height}px`
        cssItem.Css = cssItem.Css.replace(
          new RegExp(`${cssRule.selectorText} {[^}]*}`, 'g'),
          cssRule.cssText
        )
      }
      StyleDA.editStyleSheet(cssItem)
    }
  } else if (letterSpacing !== undefined) {
    if (listUpdate[0].StyleItem) {
      for (let wb of [...listUpdate]) {
        wb.StyleItem.TextStyleItem.LetterSpacing = letterSpacing
        wb.value.style.letterSpacing = `${letterSpacing}px`
      }
      WBaseDA.edit(listUpdate, EnumObj.textStyle)
    } else {
      let pWbComponent = listUpdate[0].value.closest(
        `.wbaseItem-value[iswini="true"]`
      )
      let cssItem = StyleDA.cssStyleSheets.find(e => e.GID === pWbComponent.id)
      for (let wb of [...listUpdate]) {
        let cssRule = StyleDA.docStyleSheets.find(e =>
          [...divSection.querySelectorAll(e.selectorText)].includes(wb.value)
        )
        cssRule.style.letterSpacing = `${letterSpacing}px`
        cssItem.Css = cssItem.Css.replace(
          new RegExp(`${cssRule.selectorText} {[^}]*}`, 'g'),
          cssRule.cssText
        )
      }
      StyleDA.editStyleSheet(cssItem)
    }
  } else if (textAlign) {
    if (listUpdate[0].StyleItem) {
      for (let wb of [...listUpdate]) {
        wb.StyleItem.TypoStyleItem.TextAlign = textAlign
        wb.value.style.textAlign = textAlign
      }
      WBaseDA.edit(listUpdate, EnumObj.typoStyleItem)
    } else {
      let pWbComponent = listUpdate[0].value.closest(
        `.wbaseItem-value[iswini="true"]`
      )
      let cssItem = StyleDA.cssStyleSheets.find(e => e.GID === pWbComponent.id)
      for (let wb of [...listUpdate]) {
        let cssRule = StyleDA.docStyleSheets.find(e =>
          [...divSection.querySelectorAll(e.selectorText)].includes(wb.value)
        )
        cssRule.style.textAlign = textAlign
        cssItem.Css = cssItem.Css.replace(
          new RegExp(`${cssRule.selectorText} {[^}]*}`, 'g'),
          cssRule.cssText
        )
      }
      StyleDA.editStyleSheet(cssItem)
    }
  } else if (alignVertical) {
    if (listUpdate[0].StyleItem) {
      for (let wb of [...listUpdate]) {
        wb.StyleItem.TypoStyleItem.TextAlignVertical = alignVertical
        wb.value.style.alignItems = alignVertical
      }
      WBaseDA.edit(listUpdate, EnumObj.typoStyleItem)
    } else {
      let pWbComponent = listUpdate[0].value.closest(
        `.wbaseItem-value[iswini="true"]`
      )
      let cssItem = StyleDA.cssStyleSheets.find(e => e.GID === pWbComponent.id)
      for (let wb of [...listUpdate]) {
        let cssRule = StyleDA.docStyleSheets.find(e =>
          [...divSection.querySelectorAll(e.selectorText)].includes(wb.value)
        )
        cssRule.style.alignItems = alignVertical
        cssItem.Css = cssItem.Css.replace(
          new RegExp(`${cssRule.selectorText} {[^}]*}`, 'g'),
          cssRule.cssText
        )
      }
      StyleDA.editStyleSheet(cssItem)
    }
  }
}

function unlinkBorderSkin () {
  let listUpdate = selected_list.filter(wb =>
    EnumCate.accept_border_effect.some(
      ct =>
        wb.CateID === ct &&
        window.getComputedStyle(wb.value).borderStyle !== 'none'
    )
  )
  if (listUpdate[0].StyleItem) {
    for (let wb of [...listUpdate]) {
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
      wb.StyleItem.DecorationItem.BorderID = null
      wb.StyleItem.DecorationItem.BorderItem = newBorderItem
      wb.value.style.borderWidth = newBorderItem.Width.split(' ')
        .map(e => `${e}px}`)
        .join(' ')
      wb.value.style.borderStyle = newBorderItem.BorderStyle
      wb.value.style.borderColor = `#${newBorderItem.ColorValue}`
      if (wb.IsWini && wb.CateID !== EnumCate.variant) {
        let cssItem = StyleDA.cssStyleSheets.find(e => e.GID === wb.GID)
        let cssRule = StyleDA.docStyleSheets.find(e =>
          [...divSection.querySelectorAll(e.selectorText)].includes(wb.value)
        )
        cssRule.style.borderWidth = newBorderItem.Width.split(' ')
          .map(e => `${e}px}`)
          .join(' ')
        cssRule.style.borderStyle = newBorderItem.BorderStyle
        cssRule.style.borderColor = `#${newBorderItem.ColorValue}`
        cssItem.Css = cssItem.Css.replace(
          new RegExp(`${cssRule.selectorText} {[^}]*}`, 'g'),
          cssRule.cssText
        )
        StyleDA.editStyleSheet(cssItem)
      }
    }
    WBaseDA.addStyle(listUpdate, EnumObj.border)
    listUpdate.forEach(
      wb =>
        (wb.StyleItem.DecorationItem.BorderID =
          wb.StyleItem.DecorationItem.BorderItem.GID)
    )
  } else {
    let pWbComponent = listUpdate[0].value.closest(
      `.wbaseItem-value[iswini="true"]`
    )
    let cssItem = StyleDA.cssStyleSheets.find(e => e.GID === pWbComponent.id)
    for (let wb of [...listUpdate]) {
      let cssRule = StyleDA.docStyleSheets.find(e =>
        [...divSection.querySelectorAll(e.selectorText)].includes(wb.value)
      )
      let wbStyle = window.getComputedStyle(wb.value)
      cssRule.style.borderWidth = wbStyle.borderWidth
      cssRule.style.borderStyle = wbStyle.borderStyle
      cssRule.style.borderColor = wbStyle.borderColor
      cssItem.Css = cssItem.Css.replace(
        new RegExp(`${cssRule.selectorText} {[^}]*}`, 'g'),
        cssRule.cssText
      )
    }
    StyleDA.editStyleSheet(cssItem)
  }
}

function addBorder () {
  let listUpdate = selected_list.filter(
    wb =>
      EnumCate.accept_border_effect.some(ct => wb.CateID === ct) &&
      window.getComputedStyle(wb.value).borderStyle === 'none'
  )
  let newBorderItem = {
    GID: uuidv4(),
    Name: 'new border',
    BorderStyle: BorderStyle.solid,
    IsStyle: false,
    ColorValue: '000000FF',
    BorderSide: BorderSide.all,
    Width: '1 1 1 1'
  }
  if (listUpdate[0].StyleItem) {
    for (let wb of [...listUpdate]) {
      wb.StyleItem.DecorationItem.BorderID = newBorderItem.GID
      wb.StyleItem.DecorationItem.BorderItem = newBorderItem
      wb.value.style.borderWidth = newBorderItem.Width.split(' ')
        .map(e => `${e}px`)
        .join(' ')
      wb.value.style.borderStyle = newBorderItem.BorderStyle
      wb.value.style.borderColor = `#${newBorderItem.ColorValue}`
      if (wb.IsWini && wb.CateID !== EnumCate.variant) {
        let cssItem = StyleDA.cssStyleSheets.find(e => e.GID === wb.GID)
        let cssRule = StyleDA.docStyleSheets.find(e =>
          [...divSection.querySelectorAll(e.selectorText)].includes(wb.value)
        )
        cssRule.style.borderWidth = newBorderItem.Width.split(' ')
          .map(e => `${e}px}`)
          .join(' ')
        cssRule.style.borderStyle = newBorderItem.BorderStyle
        cssRule.style.borderColor = `#${newBorderItem.ColorValue}`
        cssItem.Css = cssItem.Css.replace(
          new RegExp(`${cssRule.selectorText} {[^}]*}`, 'g'),
          cssRule.cssText
        )
        StyleDA.editStyleSheet(cssItem)
      }
    }
    WBaseDA.edit(listUpdate, EnumObj.border)
  } else {
    let pWbComponent = listUpdate[0].value.closest(
      `.wbaseItem-value[iswini="true"]`
    )
    let cssItem = StyleDA.cssStyleSheets.find(e => e.GID === pWbComponent.id)
    for (let wb of [...listUpdate]) {
      let cssRule = StyleDA.docStyleSheets.find(e =>
        [...divSection.querySelectorAll(e.selectorText)].includes(wb.value)
      )
      cssRule.style.borderWidth = newBorderItem.Width.split(' ')
        .map(e => `${e}px`)
        .join(' ')
      cssRule.style.borderStyle = newBorderItem.BorderStyle
      cssRule.style.borderColor = `#${newBorderItem.ColorValue}`
      cssItem.Css = cssItem.Css.replace(
        new RegExp(`${cssRule.selectorText} {[^}]*}`, 'g'),
        cssRule.cssText
      )
    }
    StyleDA.editStyleSheet(cssItem)
  }
  updateUISelectBox()
}

function handleEditBorder ({
  borderSkin,
  color,
  width,
  lWidth,
  rWidth,
  tWidth,
  bWidth,
  side,
  style,
  onSubmit = true
}) {
  let listUpdate = selected_list.filter(
    wb =>
      EnumCate.accept_border_effect.some(ct => wb.CateID === ct) &&
      (borderSkin || window.getComputedStyle(wb.value).borderStyle !== 'none')
  )
  if (borderSkin) {
    if (listUpdate[0].StyleItem) {
      for (let wb of [...listUpdate]) {
        wb.StyleItem.DecorationItem.BorderID = borderSkin.GID
        wb.StyleItem.DecorationItem.BorderItem = borderSkin
        wb.value.style.borderWidth = `var(--border-width-${borderSkin.GID})`
        wb.value.style.borderStyle = `var(--border-style-${borderSkin.GID})`
        wb.value.style.borderColor = `var(--border-color-${borderSkin.GID})`
        if (wb.IsWini && wb.CateID !== EnumCate.variant) {
          let cssItem = StyleDA.cssStyleSheets.find(e => e.GID === wb.GID)
          let cssRule = StyleDA.docStyleSheets.find(e =>
            [...divSection.querySelectorAll(e.selectorText)].includes(wb.value)
          )
          cssRule.style.borderWidth = `var(--border-width-${borderSkin.GID})`
          cssRule.style.borderStyle = `var(--border-style-${borderSkin.GID})`
          cssRule.style.borderColor = `var(--border-color-${borderSkin.GID})`
          cssItem.Css = cssItem.Css.replace(
            new RegExp(`${cssRule.selectorText} {[^}]*}`, 'g'),
            cssRule.cssText
          )
          StyleDA.editStyleSheet(cssItem)
        }
      }
      WBaseDA.edit(listUpdate, EnumObj.decoration)
    } else {
      let pWbComponent = listUpdate[0].value.closest(
        `.wbaseItem-value[iswini="true"]`
      )
      let cssItem = StyleDA.cssStyleSheets.find(e => e.GID === pWbComponent.id)
      for (let wb of [...listUpdate]) {
        let cssRule = StyleDA.docStyleSheets.find(e =>
          [...divSection.querySelectorAll(e.selectorText)].includes(wb.value)
        )
        cssRule.style.borderWidth = `var(--border-width-${borderSkin.GID})`
        cssRule.style.borderStyle = `var(--border-style-${borderSkin.GID})`
        cssRule.style.borderColor = `var(--border-color-${borderSkin.GID})`
        cssItem.Css = cssItem.Css.replace(
          new RegExp(`${cssRule.selectorText} {[^}]*}`, 'g'),
          cssRule.cssText
        )
      }
      StyleDA.editStyleSheet(cssItem)
    }
  } else if (color) {
    if (listUpdate[0].StyleItem) {
      for (let wb of [...listUpdate]) {
        wb.StyleItem.DecorationItem.BorderItem.ColorValue = color
        wb.value.style.borderColor = `#${color}`
        if (wb.IsWini && wb.CateID !== EnumCate.variant) {
          let cssItem = StyleDA.cssStyleSheets.find(e => e.GID === wb.GID)
          let cssRule = StyleDA.docStyleSheets.find(e =>
            [...divSection.querySelectorAll(e.selectorText)].includes(wb.value)
          )
          cssRule.style.borderColor = `#${color}`
          cssItem.Css = cssItem.Css.replace(
            new RegExp(`${cssRule.selectorText} {[^}]*}`, 'g'),
            cssRule.cssText
          )
          StyleDA.editStyleSheet(cssItem)
        }
      }
      if (onSubmit) WBaseDA.edit(listUpdate, EnumObj.border)
    } else {
      let pWbComponent = listUpdate[0].value.closest(
        `.wbaseItem-value[iswini="true"]`
      )
      let cssItem = StyleDA.cssStyleSheets.find(e => e.GID === pWbComponent.id)
      for (let wb of [...listUpdate]) {
        let cssRule = StyleDA.docStyleSheets.find(e =>
          [...divSection.querySelectorAll(e.selectorText)].includes(wb.value)
        )
        cssRule.style.borderColor = `#${color}`
        cssItem.Css = cssItem.Css.replace(
          new RegExp(`${cssRule.selectorText} {[^}]*}`, 'g'),
          cssRule.cssText
        )
      }
      if (onSubmit) StyleDA.editStyleSheet(cssItem)
    }
  } else if (width !== undefined) {
    if (listUpdate[0].StyleItem) {
      for (let wb of [...listUpdate]) {
        switch (wb.StyleItem.DecorationItem.BorderItem.BorderSide) {
          case BorderSide.top:
            wb.StyleItem.DecorationItem.BorderItem.Width = `${width} 0 0 0`
            wb.value.style.borderWidth = `${width}px 0 0 0`
            break
          case BorderSide.right:
            wb.StyleItem.DecorationItem.BorderItem.Width = `0 ${width} 0 0`
            wb.value.style.borderWidth = `0 ${width}px 0 0`
            break
          case BorderSide.bottom:
            wb.StyleItem.DecorationItem.BorderItem.Width = `0 0 ${width} 0`
            wb.value.style.borderWidth = `0 0 ${width}px 0`
            break
          case BorderSide.left:
            wb.StyleItem.DecorationItem.BorderItem.Width = `0 0 0 ${width}`
            wb.value.style.borderWidth = `0 0 0 ${width}px`
            break
          default: // all & custom
            wb.StyleItem.DecorationItem.BorderItem.Width = `${width} ${width} ${width} ${width}`
            wb.value.style.borderWidth = `${width}px ${width}px ${width}px ${width}px`
            break
        }
        if (wb.IsWini && wb.CateID !== EnumCate.variant) {
          let cssItem = StyleDA.cssStyleSheets.find(e => e.GID === wb.GID)
          let cssRule = StyleDA.docStyleSheets.find(e =>
            [...divSection.querySelectorAll(e.selectorText)].includes(wb.value)
          )
          cssRule.style.borderWidth = wb.value.style.borderWidth
          cssItem.Css = cssItem.Css.replace(
            new RegExp(`${cssRule.selectorText} {[^}]*}`, 'g'),
            cssRule.cssText
          )
          StyleDA.editStyleSheet(cssItem)
        }
      }
      WBaseDA.edit(listUpdate, EnumObj.border)
    } else {
      let pWbComponent = listUpdate[0].value.closest(
        `.wbaseItem-value[iswini="true"]`
      )
      let cssItem = StyleDA.cssStyleSheets.find(e => e.GID === pWbComponent.id)
      for (let wb of [...listUpdate]) {
        let cssRule = StyleDA.docStyleSheets.find(e =>
          [...divSection.querySelectorAll(e.selectorText)].includes(wb.value)
        )
        switch (wb.borderSide) {
          case BorderSide.top:
            cssRule.style.borderWidth = `${width}px 0 0 0`
            break

          case BorderSide.right:
            cssRule.style.borderWidth = `0 ${width}px 0 0`
            break
          case BorderSide.bottom:
            cssRule.style.borderWidth = `0 0 ${width}px 0`
            break
          case BorderSide.left:
            cssRule.style.borderWidth = `0 0 0 ${width}px`
            break
          default: // all & custom
            cssRule.style.borderWidth = `${width}px ${width}px ${width}px ${width}px`
            break
        }
        delete wb.borderSide
        cssItem.Css = cssItem.Css.replace(
          new RegExp(`${cssRule.selectorText} {[^}]*}`, 'g'),
          cssRule.cssText
        )
      }
      StyleDA.editStyleSheet(cssItem)
    }
  } else if (lWidth !== undefined) {
    if (listUpdate[0].StyleItem) {
      for (let wb of [...listUpdate]) {
        switch (wb.StyleItem.DecorationItem.BorderItem.BorderSide) {
          case BorderSide.left:
            wb.StyleItem.DecorationItem.BorderItem.Width = `0 0 0 ${lWidth}`
            wb.value.style.borderWidth = `0 0 0 ${lWidth}px`
            break
          case BorderSide.custom:
            let widthList =
              wb.StyleItem.DecorationItem.BorderItem.Width.split(' ')
            widthList[3] = lWidth
            wb.StyleItem.DecorationItem.BorderItem.Width = widthList.join(' ')
            wb.value.style.borderWidth = widthList.map(e => `${e}px`).join(' ')
            break
          default:
            break
        }
        if (wb.IsWini && wb.CateID !== EnumCate.variant) {
          let cssItem = StyleDA.cssStyleSheets.find(e => e.GID === wb.GID)
          let cssRule = StyleDA.docStyleSheets.find(e =>
            [...divSection.querySelectorAll(e.selectorText)].includes(wb.value)
          )
          cssRule.style.borderWidth = wb.value.style.borderWidth
          cssItem.Css = cssItem.Css.replace(
            new RegExp(`${cssRule.selectorText} {[^}]*}`, 'g'),
            cssRule.cssText
          )
          StyleDA.editStyleSheet(cssItem)
        }
      }
      WBaseDA.edit(listUpdate, EnumObj.border)
    } else {
      let pWbComponent = listUpdate[0].value.closest(
        `.wbaseItem-value[iswini="true"]`
      )
      let cssItem = StyleDA.cssStyleSheets.find(e => e.GID === pWbComponent.id)
      for (let wb of [...listUpdate]) {
        let cssRule = StyleDA.docStyleSheets.find(e =>
          [...divSection.querySelectorAll(e.selectorText)].includes(wb.value)
        )
        switch (wb.borderSide) {
          case BorderSide.left:
            cssRule.style.borderWidth = `0 0 0 ${lWidth}px`
            break
          case BorderSide.custom:
            let widthList = cssRule.style.borderWidth.split(' ')
            widthList[3] = `${lWidth}px`
            cssRule.style.borderWidth = widthList.join(' ')
            break
          default:
            break
        }
        delete wb.borderSide
        cssItem.Css = cssItem.Css.replace(
          new RegExp(`${cssRule.selectorText} {[^}]*}`, 'g'),
          cssRule.cssText
        )
      }
      StyleDA.editStyleSheet(cssItem)
    }
  } else if (rWidth !== undefined) {
    if (listUpdate[0].StyleItem) {
      for (let wb of [...listUpdate]) {
        switch (wb.StyleItem.DecorationItem.BorderItem.BorderSide) {
          case BorderSide.right:
            wb.StyleItem.DecorationItem.BorderItem.Width = `0 ${rWidth} 0 0`
            wb.value.style.borderWidth = `0 ${rWidth}px 0 0`
            break
          case BorderSide.custom:
            let widthList =
              wb.StyleItem.DecorationItem.BorderItem.Width.split(' ')
            widthList[1] = rWidth
            wb.StyleItem.DecorationItem.BorderItem.Width = widthList.join(' ')
            wb.value.style.borderWidth = widthList.map(e => `${e}px`).join(' ')
            break
          default:
            break
        }
        if (wb.IsWini && wb.CateID !== EnumCate.variant) {
          let cssItem = StyleDA.cssStyleSheets.find(e => e.GID === wb.GID)
          let cssRule = StyleDA.docStyleSheets.find(e =>
            [...divSection.querySelectorAll(e.selectorText)].includes(wb.value)
          )
          cssRule.style.borderWidth = wb.value.style.borderWidth
          cssItem.Css = cssItem.Css.replace(
            new RegExp(`${cssRule.selectorText} {[^}]*}`, 'g'),
            cssRule.cssText
          )
          StyleDA.editStyleSheet(cssItem)
        }
      }
      WBaseDA.edit(listUpdate, EnumObj.border)
    } else {
      let pWbComponent = listUpdate[0].value.closest(
        `.wbaseItem-value[iswini="true"]`
      )
      let cssItem = StyleDA.cssStyleSheets.find(e => e.GID === pWbComponent.id)
      for (let wb of [...listUpdate]) {
        let cssRule = StyleDA.docStyleSheets.find(e =>
          [...divSection.querySelectorAll(e.selectorText)].includes(wb.value)
        )
        switch (wb.borderSide) {
          case BorderSide.right:
            cssRule.style.borderWidth = `0 ${rWidth}px 0 0`
            break
          case BorderSide.custom:
            let widthList = cssRule.style.borderWidth.split(' ')
            widthList[1] = `${rWidth}px`
            cssRule.style.borderWidth = widthList.join(' ')
            break
          default:
            break
        }
        delete wb.borderSide
        cssItem.Css = cssItem.Css.replace(
          new RegExp(`${cssRule.selectorText} {[^}]*}`, 'g'),
          cssRule.cssText
        )
      }
      StyleDA.editStyleSheet(cssItem)
    }
  } else if (tWidth !== undefined) {
    if (listUpdate[0].StyleItem) {
      for (let wb of [...listUpdate]) {
        switch (wb.StyleItem.DecorationItem.BorderItem.BorderSide) {
          case BorderSide.top:
            wb.StyleItem.DecorationItem.BorderItem.Width = `${tWidth} 0 0 0`
            wb.value.style.borderWidth = `${tWidth}px 0 0 0`
            break
          case BorderSide.custom:
            let widthList =
              wb.StyleItem.DecorationItem.BorderItem.Width.split(' ')
            widthList[0] = tWidth
            wb.StyleItem.DecorationItem.BorderItem.Width = widthList.join(' ')
            wb.value.style.borderWidth = widthList.map(e => `${e}px`).join(' ')
            break
          default:
            break
        }
        if (wb.IsWini && wb.CateID !== EnumCate.variant) {
          let cssItem = StyleDA.cssStyleSheets.find(e => e.GID === wb.GID)
          let cssRule = StyleDA.docStyleSheets.find(e =>
            [...divSection.querySelectorAll(e.selectorText)].includes(wb.value)
          )
          cssRule.style.borderWidth = wb.value.style.borderWidth
          cssItem.Css = cssItem.Css.replace(
            new RegExp(`${cssRule.selectorText} {[^}]*}`, 'g'),
            cssRule.cssText
          )
          StyleDA.editStyleSheet(cssItem)
        }
      }
      WBaseDA.edit(listUpdate, EnumObj.border)
    } else {
      let pWbComponent = listUpdate[0].value.closest(
        `.wbaseItem-value[iswini="true"]`
      )
      let cssItem = StyleDA.cssStyleSheets.find(e => e.GID === pWbComponent.id)
      for (let wb of [...listUpdate]) {
        let cssRule = StyleDA.docStyleSheets.find(e =>
          [...divSection.querySelectorAll(e.selectorText)].includes(wb.value)
        )
        switch (wb.borderSide) {
          case BorderSide.top:
            cssRule.style.borderWidth = `${tWidth}px 0 0 0`
            break
          case BorderSide.custom:
            let widthList = cssRule.style.borderWidth.split(' ')
            widthList[0] = `${tWidth}px`
            cssRule.style.borderWidth = widthList.join(' ')
            break
          default:
            break
        }
        delete wb.borderSide
        cssItem.Css = cssItem.Css.replace(
          new RegExp(`${cssRule.selectorText} {[^}]*}`, 'g'),
          cssRule.cssText
        )
      }
      StyleDA.editStyleSheet(cssItem)
    }
  } else if (bWidth !== undefined) {
    if (listUpdate[0].StyleItem) {
      for (let wb of [...listUpdate]) {
        switch (wb.StyleItem.DecorationItem.BorderItem.BorderSide) {
          case BorderSide.bottom:
            wb.StyleItem.DecorationItem.BorderItem.Width = `0 0 ${bWidth} 0`
            wb.value.style.borderWidth = `0 0 ${bWidth}px 0`
            break
          case BorderSide.custom:
            let widthList =
              wb.StyleItem.DecorationItem.BorderItem.Width.split(' ')
            widthList[2] = bWidth
            wb.StyleItem.DecorationItem.BorderItem.Width = widthList.join(' ')
            wb.value.style.borderWidth = widthList.map(e => `${e}px`).join(' ')
            break
          default:
            break
        }
        if (wb.IsWini && wb.CateID !== EnumCate.variant) {
          let cssItem = StyleDA.cssStyleSheets.find(e => e.GID === wb.GID)
          let cssRule = StyleDA.docStyleSheets.find(e =>
            [...divSection.querySelectorAll(e.selectorText)].includes(wb.value)
          )
          cssRule.style.borderWidth = wb.value.style.borderWidth
          cssItem.Css = cssItem.Css.replace(
            new RegExp(`${cssRule.selectorText} {[^}]*}`, 'g'),
            cssRule.cssText
          )
          StyleDA.editStyleSheet(cssItem)
        }
      }
      WBaseDA.edit(listUpdate, EnumObj.border)
    } else {
      let pWbComponent = listUpdate[0].value.closest(
        `.wbaseItem-value[iswini="true"]`
      )
      let cssItem = StyleDA.cssStyleSheets.find(e => e.GID === pWbComponent.id)
      for (let wb of [...listUpdate]) {
        let cssRule = StyleDA.docStyleSheets.find(e =>
          [...divSection.querySelectorAll(e.selectorText)].includes(wb.value)
        )
        switch (wb.borderSide) {
          case BorderSide.bottom:
            cssRule.style.borderWidth = `0 0 ${bWidth}px 0`
            break
          case BorderSide.custom:
            let widthList = cssRule.style.borderWidth.split(' ')
            widthList[2] = `${bWidth}px`
            cssRule.style.borderWidth = widthList.join(' ')
            break
          default:
            break
        }
        delete wb.borderSide
        cssItem.Css = cssItem.Css.replace(
          new RegExp(`${cssRule.selectorText} {[^}]*}`, 'g'),
          cssRule.cssText
        )
      }
      StyleDA.editStyleSheet(cssItem)
    }
  } else if (side) {
    if (listUpdate[0].StyleItem) {
      for (let wb of [...listUpdate]) {
        let widthList = wb.StyleItem.DecorationItem.BorderItem.Width.split(
          ' '
        ).sort((a, b) => parseFloat(b) - parseFloat(a))
        switch (side) {
          case BorderSide.all:
            widthList = [widthList[0], widthList[0], widthList[0], widthList[0]]
            break
          case BorderSide.left:
            widthList = [0, 0, 0, widthList[0]]
            break
          case BorderSide.top:
            widthList = [widthList[0], 0, 0, 0]
            break
          case BorderSide.right:
            widthList = [0, widthList[0], 0, 0]
            break
          case BorderSide.bottom:
            widthList = [0, 0, widthList[0], 0]
            break
          default:
            break
        }
        wb.StyleItem.DecorationItem.BorderItem.Width = widthList.join(' ')
        wb.StyleItem.DecorationItem.BorderItem.BorderSide = side
        wb.value.style.borderWidth = widthList.map(e => `${e}px`).join(' ')
        if (wb.IsWini && wb.CateID !== EnumCate.variant) {
          let cssItem = StyleDA.cssStyleSheets.find(e => e.GID === wb.GID)
          let cssRule = StyleDA.docStyleSheets.find(e =>
            [...divSection.querySelectorAll(e.selectorText)].includes(wb.value)
          )
          cssRule.style.borderWidth = wb.value.style.borderWidth
          cssItem.Css = cssItem.Css.replace(
            new RegExp(`${cssRule.selectorText} {[^}]*}`, 'g'),
            cssRule.cssText
          )
          StyleDA.editStyleSheet(cssItem)
        }
      }
      WBaseDA.edit(listUpdate, EnumObj.border)
    } else if (side !== BorderSide.custom) {
      let pWbComponent = listUpdate[0].value.closest(
        `.wbaseItem-value[iswini="true"]`
      )
      let cssItem = StyleDA.cssStyleSheets.find(e => e.GID === pWbComponent.id)
      for (let wb of [...listUpdate]) {
        let cssRule = StyleDA.docStyleSheets.find(e =>
          [...divSection.querySelectorAll(e.selectorText)].includes(wb.value)
        )
        let widthList = cssRule.style.borderWidth
          .split(' ')
          .sort(
            (a, b) =>
              parseFloat(b.replace('px', '')) - parseFloat(a.replace('px', ''))
          )
        switch (side) {
          case BorderSide.all:
            widthList = [widthList[0], widthList[0], widthList[0], widthList[0]]
            break
          case BorderSide.left:
            widthList = [0, 0, 0, widthList[0]]
            break
          case BorderSide.top:
            widthList = [widthList[0], 0, 0, 0]
            break
          case BorderSide.right:
            widthList = [0, widthList[0], 0, 0]
            break
          case BorderSide.bottom:
            widthList = [0, 0, widthList[0], 0]
            break
          default:
            break
        }
        cssRule.style.borderWidth = widthList.join(' ')
        delete wb.borderSide
        cssItem.Css = cssItem.Css.replace(
          new RegExp(`${cssRule.selectorText} {[^}]*}`, 'g'),
          cssRule.cssText
        )
      }
      StyleDA.editStyleSheet(cssItem)
    }
  } else if (style) {
    if (listUpdate[0].StyleItem) {
      for (let wb of [...listUpdate]) {
        wb.StyleItem.DecorationItem.BorderItem.BorderStyle = style
        wb.value.style.borderStyle = style
        if (wb.IsWini && wb.CateID !== EnumCate.variant) {
          let cssItem = StyleDA.cssStyleSheets.find(e => e.GID === wb.GID)
          let cssRule = StyleDA.docStyleSheets.find(e =>
            [...divSection.querySelectorAll(e.selectorText)].includes(wb.value)
          )
          cssRule.style.borderStyle = style
          cssItem.Css = cssItem.Css.replace(
            new RegExp(`${cssRule.selectorText} {[^}]*}`, 'g'),
            cssRule.cssText
          )
          StyleDA.editStyleSheet(cssItem)
        }
      }
      WBaseDA.edit(listUpdate, EnumObj.border)
    } else {
      let pWbComponent = listUpdate[0].value.closest(
        `.wbaseItem-value[iswini="true"]`
      )
      let cssItem = StyleDA.cssStyleSheets.find(e => e.GID === pWbComponent.id)
      for (let wb of [...listUpdate]) {
        let cssRule = StyleDA.docStyleSheets.find(e =>
          [...divSection.querySelectorAll(e.selectorText)].includes(wb.value)
        )
        cssRule.style.borderStyle = style
        cssItem.Css = cssItem.Css.replace(
          new RegExp(`${cssRule.selectorText} {[^}]*}`, 'g'),
          cssRule.cssText
        )
      }
      StyleDA.editStyleSheet(cssItem)
    }
  }
}

function deleteBorder () {
  let listUpdate = selected_list.filter(wb =>
    EnumCate.accept_border_effect.some(ct => wb.CateID === ct)
  )
  if (listUpdate[0].StyleItem) {
    for (let wb of [...listUpdate]) {
      wb.StyleItem.DecorationItem.BorderID = null
      wb.StyleItem.DecorationItem.BorderItem = null
      wb.value.style.borderWidth = null
      wb.value.style.borderStyle = null
      wb.value.style.borderColor = null
      if (wb.IsWini && wb.CateID !== EnumCate.variant) {
        let cssItem = StyleDA.cssStyleSheets.find(e => e.GID === wb.GID)
        let cssRule = StyleDA.docStyleSheets.find(e =>
          [...divSection.querySelectorAll(e.selectorText)].includes(wb.value)
        )
        cssRule.style.borderWidth = null
        cssRule.style.borderStyle = null
        cssRule.style.borderColor = null
        cssItem.Css = cssItem.Css.replace(
          new RegExp(`${cssRule.selectorText} {[^}]*}`, 'g'),
          cssRule.cssText
        )
        StyleDA.editStyleSheet(cssItem)
      }
    }
    WBaseDA.edit(listUpdate, EnumObj.decoration)
  } else {
    let pWbComponent = listUpdate[0].value.closest(
      `.wbaseItem-value[iswini="true"]`
    )
    let cssItem = StyleDA.cssStyleSheets.find(e => e.GID === pWbComponent.id)
    for (let wb of [...listUpdate]) {
      let cssRule = StyleDA.docStyleSheets.find(e =>
        [...divSection.querySelectorAll(e.selectorText)].includes(wb.value)
      )
      cssRule.style.borderWidth = null
      cssRule.style.borderStyle = null
      cssRule.style.borderColor = null
      cssItem.Css = cssItem.Css.replace(
        new RegExp(`${cssRule.selectorText} {[^}]*}`, 'g'),
        cssRule.cssText
      )
    }
    StyleDA.editStyleSheet(cssItem)
  }
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

async function addAutoLayout () {
  let newLayoutItem = {
    GID: uuidv4(),
    Name: '',
    Alignment: 'Center',
    Direction: select_box.w > select_box.h ? 'Horizontal' : 'Vertical',
    ChildSpace: 8.0,
    IsScroll: false,
    IsWrap: false,
    RunSpace: 0.0,
    CountItem: 1
  }
  let newPaddingItem = {
    GID: uuidv4(),
    Top: 8,
    Left: 8,
    Right: 8,
    Bottom: 8
  }
  if (
    selected_list.length === 1 &&
    EnumCate.extend_frame.some(ct => ct === selected_list[0].CateID) &&
    !selected_list[0].WAutolayoutItem
  ) {
    let wb = selected_list[0]
    wb.AutoLayoutID = newLayoutItem.GID
    wb.WAutolayoutItem = newLayoutItem
    if (wb.StyleItem) {
      if (!wb.StyleItem.PaddingItem) {
        wb.StyleItem.PaddingID = null
        wb.StyleItem.PaddingItem = newPaddingItem
      } else {
        wb.StyleItem.PaddingItem.Top = {
          ...newPaddingItem,
          GID: wb.StyleItem.PaddingID
        }
      }
      if (
        wb.Level === 1 &&
        wb.CountChild > 0 &&
        wb.value.querySelectorAll('.col-').length === 0
      ) {
        wb.StyleItem.FrameItem.Height = null
        wb.StyleItem.FrameItem.Width = null
        wb.value.style.width = null
        wb.value.style.height = null
        wb.value.setAttribute('width-type', 'fit')
        wb.value.setAttribute('height-type', 'fit')
      }
      $(wb.value).addClass(
        newLayoutItem.Direction === 'Horizontal' ? 'w-row' : 'w-col'
      )
      $(wb.value).removeClass('w-stack')
      wb.value.style.setProperty(
        '--child-space',
        `${newLayoutItem.ChildSpace}px`
      )
      wb.value.style.setProperty('--run-space', `${newLayoutItem.RunSpace}px`)
      wb.value.style.setProperty(
        '--main-axis-align',
        wMainAxis(
          newLayoutItem.Alignment,
          newLayoutItem.Direction === 'Horizontal'
        )
      )
      wb.value.style.setProperty(
        '--cross-axis-align',
        wCrossAxis(
          newLayoutItem.Alignment,
          newLayoutItem.Direction === 'Horizontal'
        )
      )
      wb.value.style.setProperty(
        '--padding',
        `${newPaddingItem.Top}px ${newPaddingItem.Right}px ${newPaddingItem.Bottom}px ${newPaddingItem.Left}px`
      )
      wb.value
        .querySelectorAll(`.col-[level="${wb.Level + 1}"]`)
        .forEach(cWbHTML => {
          cWbHTML.style.setProperty('--gutter', `${newLayoutItem.ChildSpace}px`)
        })
      WBaseDA.edit(selected_list, EnumObj.padddingWbaseFrame)
      addSelectList(selected_list)
      wb.StyleItem.PaddingID = wb.StyleItem.PaddingItem.GID
    } else {
      let pWbComponent = wb.value.closest(`.wbaseItem-value[iswini="true"]`)
      let cssItem = StyleDA.cssStyleSheets.find(e => e.GID === pWbComponent.id)
      let cssRule = StyleDA.docStyleSheets.find(rule => {
        let selector = [...divSection.querySelectorAll(rule.selectorText)]
        let check = selector.includes(wb.value)
        if (check) {
          if (
            wb.Level === 1 &&
            wb.CountChild > 0 &&
            wb.value.querySelectorAll('.col-').length === 0
          ) {
            rule.style.width = null
            rule.style.height = null
            var setWH = true
          }
          selector.forEach(e => {
            if (setWH) {
              e.setAttribute('width-type', 'fit')
              e.setAttribute('height-type', 'fit')
            }
            $(e).addClass(
              newLayoutItem.Direction === 'Horizontal' ? 'w-row' : 'w-col'
            )
            $(e).removeClass('w-stack')
          })
        }
        return check
      })
      cssRule.style.setProperty(
        '--child-space',
        `${newLayoutItem.ChildSpace}px`
      )
      cssRule.style.setProperty('--run-space', `${newLayoutItem.RunSpace}px`)
      cssRule.style.setProperty(
        '--main-axis-align',
        wMainAxis(
          newLayoutItem.Alignment,
          newLayoutItem.Direction === 'Horizontal'
        )
      )
      cssRule.style.setProperty(
        '--cross-axis-align',
        wCrossAxis(
          newLayoutItem.Alignment,
          newLayoutItem.Direction === 'Horizontal'
        )
      )
      cssRule.style.setProperty(
        '--padding',
        `${newPaddingItem.Top}px ${newPaddingItem.Right}px ${newPaddingItem.Bottom}px ${newPaddingItem.Left}px`
      )
      wb.value
        .querySelectorAll(`.col-[level="${wb.Level + 1}"]`)
        .forEach(cWbHTML => {
          let childRule = StyleDA.docStyleSheets.find(e =>
            [...divSection.querySelectorAll(e.selectorText)].includes(cWbHTML)
          )
          childRule.style.setProperty(
            '--gutter',
            `${newLayoutItem.ChildSpace}px`
          )
        })
      cssItem.Css = cssItem.Css.replace(
        new RegExp(`${cssRule.selectorText} {[^}]*}`, 'g'),
        cssRule.cssText
      )
      StyleDA.editStyleSheet(cssItem)
    }
  } else {
    let list_update = [...selected_list]
    let newWb = JSON.parse(JSON.stringify(WBaseDefault.frame))
    newWb.WAutolayoutItem = newLayoutItem
    newWb.StyleItem.PaddingItem = newPaddingItem
    newWb = createNewWbase(newWb)[0]
    newWb.StyleItem.PositionItem.Left = `${Math.min(
      ...selected_list.map(e => getWBaseOffset(e).x)
    ).toFixed(2)}px`
    newWb.StyleItem.PositionItem.Top = `${Math.min(
      ...selected_list.map(e => getWBaseOffset(e).y)
    ).toFixed(2)}px`
    newWb.CountChild = selected_list.length
    newWb.ListChildID = selected_list.map(e => e.GID)
    if (
      selected_list.some(
        wb => wb.Level === 1 || wb.value.querySelectorAll('.col-').length === 0
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

function handleEditLayout ({
  direction,
  alignment,
  childSpace,
  isWrap,
  runSpace,
  isScroll
}) {
  let listUpdate = selected_list.filter(wb =>
    window.getComputedStyle(wb.value).display.match(/(flex|table)/g)
  )
  if (direction) {
    // TH user muốn cập nhật layout từ dạng chiều ngang sang chiều dọc
    listUpdate = selected_list.filter(
      wb =>
        wb.value.classList.contains(
          direction === 'Vertical' ? 'w-row' : 'w-col'
        ) &&
        wb.CateID !== EnumCate.table &&
        wb.CateID !== EnumCate.textformfield
    )
    let pWb = wbase_list.find(e => e.GID === select_box_parentID)
    if (direction === 'Vertical') {
      if (listUpdate[0].StyleItem) {
        for (let wb of [...listUpdate]) {
          // gán lại chiều autoLayout của wbase item này sang chiều dọc
          wb.WAutolayoutItem.Direction = direction
          let _layout = wb.WAutolayoutItem
          // TH kiểu align trong autoLayout là spacebetween thì phải cập nhật cả dạng align cho autoLayout của wbase item này
          if (_layout.Alignment.includes('SpaceBetween')) {
            // align TopSpaceBetween => SpaceBetweenLeft
            if (_layout.Alignment.includes('Top'))
              _layout.Alignment = 'SpaceBetweenLeft'
            // align BottomSpaceBetween => SpaceBetweenRight
            if (_layout.Alignment.includes('Bottom'))
              _layout.Alignment = 'SpaceBetweenRight'
          }
          //TH width của wbase item này đang hug contents thì height của wbase item này phải chuyển về dạng hug contents
          if (wb.StyleItem.FrameItem.Width == null) {
            // TH height của wbase item này dạng fill container thì phải chuyển width của wbase item này về dạng fill container
            if (wb.StyleItem.FrameItem.Height < 0) {
              //TH đang có wbase item parent của item này đang hug contents width thì lúc này bắt buộc phải chuyển width của nó từ hug sang fixed
              if (pWb.StyleItem.FrameItem.Width == null) {
                pWb.StyleItem.FrameItem.Width = pWb.value.offsetWidth
                pWb.value.style.width = `${pWb.value.offsetWidth}px`
                pWb.value.removeAttribute('width-type')
                listUpdate.push(pWb)
              }
              wb.StyleItem.FrameItem.Width = -1
              wb.value.style.width = '100%'
              wb.value.setAttribute('width-type', 'fill')
            }
            // TH height của wbase item này dạng fixed thì phải chuyển width của wbase item này về dạng fixed
            else if (wb.StyleItem.FrameItem.Height != null) {
              wb.StyleItem.FrameItem.Width = wb.value.offsetWidth
              wb.value.style.width = `${wb.value.offsetWidth}px`
              cWb.value.removeAttribute('width-type')
            }
            // gán height của wbase item này null để hug contents
            //TH đang có bất kì wbase item con của item này đang fill container height thì phải chuyển height của nó về fixed
            let listChildFillH = wbase_list.filter(
              e =>
                e.ParentID === wb.GID &&
                e.value.getAttribute('height-type') === 'fill'
            )
            if (listChildFillH.length > 0) {
              if (listChildFillH[0].StyleItem) {
                for (let cWb of listChildFillH) {
                  cWb.StyleItem.FrameItem.Height = cWb.value.offsetHeight
                  cWb.value.style.height = `${cWb.value.offsetHeight}px`
                  cWb.value.removeAttribute('height-type')
                  if (cWb.IsWini && cWb.CateID !== EnumCate.variant) {
                    let childCss = StyleDA.cssStyleSheets.find(
                      e => e.GID === cWb.GID
                    )
                    StyleDA.docStyleSheets.find(rule => {
                      let selector = [
                        ...divSection.querySelectorAll(rule.selectorText)
                      ]
                      let check = selector.includes(cWb.value)
                      if (check) {
                        rule.style.height = `${cWb.value.offsetHeight}px`
                        selector.forEach(e => e.removeAttribute('height-type'))
                        childCss.Css = childCss.Css.replace(
                          new RegExp(`${rule.selectorText} {[^}]*}`, 'g'),
                          rule.cssText
                        )
                      }
                      return check
                    })
                    StyleDA.editStyleSheet(childCss)
                  }
                }
                listUpdate.push(...listChildFillH)
              } else {
                var cssItem = StyleDA.cssStyleSheets.find(e => e.GID === wb.GID)
                for (let cWb of listChildFillH) {
                  StyleDA.docStyleSheets.find(rule => {
                    let selector = [
                      ...divSection.querySelectorAll(rule.selectorText)
                    ]
                    let check = selector.includes(cWb.value)
                    if (check) {
                      rule.style.height = `${cWb.value.offsetHeight}px`
                      selector.forEach(e => e.removeAttribute('height-type'))
                      cssItem.Css = cssItem.Css.replace(
                        new RegExp(`${rule.selectorText} {[^}]*}`, 'g'),
                        rule.cssText
                      )
                    }
                    return check
                  })
                }
              }
            }
            wb.StyleItem.FrameItem.Height = null
            wb.value.style.height = null
            wb.value.setAttribute('height-type', 'fit')
          }
          //TH width của wbase item này đang fill container thì height của wbase item này phải chuyển về dạng fill container
          else if (wb.StyleItem.FrameItem.Width < 0) {
            //TH đang có wbase item parent của item này đang hug contents height thì lúc này bắt buộc phải chuyển height của nó từ hug sang fixed
            if (pWb.StyleItem.FrameItem.Height == null) {
              pWb.StyleItem.FrameItem.Height = pWb.value.offsetHeight
              pWb.value.style.height = `${pWb.value.offsetHeight}px`
              pWb.value.removeAttribute('height-type')
              listUpdate.push(pWb)
            }
            // TH height của wbase item này dạng hug contents thì phải chuyển width của wbase item này về dạng hug contents
            if (wb.StyleItem.FrameItem.Height == null) {
              //TH đang có bất kì wbase item con của item này đang fill container width thì phải chuyển width của nó về fixed
              let listChildFillW = wbase_list.filter(
                e =>
                  e.ParentID === wb.GID &&
                  e.value.getAttribute('width-type') === 'fill'
              )
              if (listChildFillW.length > 0) {
                if (listChildFillW[0].StyleItem) {
                  for (let cWb of listChildFillW) {
                    cWb.StyleItem.FrameItem.Width = cWb.value.offsetWidth
                    cWb.value.style.width = `${cWb.value.offsetWidth}px`
                    cWb.value.removeAttribute('width-type')
                    if (cWb.IsWini && cWb.CateID !== EnumCate.variant) {
                      let childCss = StyleDA.cssStyleSheets.find(
                        e => e.GID === cWb.GID
                      )
                      StyleDA.docStyleSheets.find(rule => {
                        let selector = [
                          ...divSection.querySelectorAll(rule.selectorText)
                        ]
                        let check = selector.includes(cWb.value)
                        if (check) {
                          rule.style.width = `${cWb.value.offsetWidth}px`
                          selector.forEach(e => e.removeAttribute('width-type'))
                          childCss.Css = childCss.Css.replace(
                            new RegExp(`${rule.selectorText} {[^}]*}`, 'g'),
                            rule.cssText
                          )
                        }
                        return check
                      })
                      StyleDA.editStyleSheet(childCss)
                    }
                  }
                  listUpdate.push(...listChildFillW)
                } else {
                  cssItem ??= StyleDA.cssStyleSheets.find(e => e.GID === wb.GID)
                  for (let cWb of listChildFillW) {
                    StyleDA.docStyleSheets.find(rule => {
                      let selector = [
                        ...divSection.querySelectorAll(rule.selectorText)
                      ]
                      let check = selector.includes(cWb.value)
                      if (check) {
                        rule.style.width = `${cWb.value.offsetWidth}px`
                        selector.forEach(e => e.removeAttribute('width-type'))
                        cssItem.Css = cssItem.Css.replace(
                          new RegExp(`${rule.selectorText} {[^}]*}`, 'g'),
                          rule.cssText
                        )
                      }
                      return check
                    })
                  }
                }
              }
              wb.StyleItem.FrameItem.Width = null
              wb.value.style.width = null
              wb.value.setAttribute('width-type', 'fit')
            } else if (wb.StyleItem.FrameItem.Height >= 0) {
              wb.StyleItem.FrameItem.Width = wb.value.offsetWidth
              wb.value.style.width = `${wb.value.offsetWidth}px`
              wb.value.removeAttribute('width-type')
            }
            wb.StyleItem.FrameItem.Height = -1
            wb.value.style.height = '100%'
            wb.value.setAttribute('height-type', 'fill')
          }
          $(wb.value).removeClass('w-row')
          $(wb.value).addClass('w-col')
          wb.value.style.setProperty(
            '--main-axis-align',
            wMainAxis(_layout.Alignment, false)
          )
          wb.value.style.setProperty(
            '--cross-axis-align',
            wCrossAxis(_layout.Alignment, false)
          )
          if (wb.IsWini && wb.CateID !== EnumCate.variant) {
            cssItem ??= StyleDA.cssStyleSheets.find(e => e.GID === wb.GID)
            StyleDA.docStyleSheets.find(wbRule => {
              let selector = [
                ...divSection.querySelectorAll(wbRule.selectorText)
              ]
              let check = selector.includes(wb.value)
              if (check) {
                wbRule.style.width = wb.value.style.width
                wbRule.style.height = wb.value.style.height
                selector.forEach(e => {
                  if (e !== wb.value) {
                    $(e).removeClass('w-row')
                    $(e).addClass('w-col')
                    if (wb.value.getAttribute('width-type')) {
                      e.setAttribute(
                        'width-type',
                        wb.value.getAttribute('width-type')
                      )
                    } else {
                      e.removeAttribute('width-type')
                    }
                    if (wb.value.getAttribute('height-type')) {
                      e.setAttribute(
                        'height-type',
                        wb.value.getAttribute('height-type')
                      )
                    } else {
                      e.removeAttribute('height-type')
                    }
                    e.style.setProperty(
                      '--main-axis-align',
                      wMainAxis(_layout.Alignment, false)
                    )
                    e.style.setProperty(
                      '--cross-axis-align',
                      wCrossAxis(_layout.Alignment, false)
                    )
                  }
                })
                cssItem.Css = cssItem.Css.replace(
                  new RegExp(`${wbRule.selectorText} {[^}]*}`, 'g'),
                  wbRule.cssText
                )
              }
              return check
            })
          }
        }
        if (cssItem) StyleDA.editStyleSheet(cssItem)
      } else {
        let pWbComponent = listUpdate[0].value.closest(
          `.wbaseItem-value[iswini="true"]`
        )
        let cssItem = StyleDA.cssStyleSheets.find(
          e => e.GID === pWbComponent.id
        )
        for (let wb of [...listUpdate]) {
          wb.WAutolayoutItem.Direction = direction
          let _layout = wb.WAutolayoutItem
          // TH kiểu align trong autoLayout là spacebetween thì phải cập nhật cả dạng align cho autoLayout của wbase item này
          if (_layout.Alignment.includes('SpaceBetween')) {
            // align TopSpaceBetween => SpaceBetweenLeft
            if (_layout.Alignment.includes('Top'))
              _layout.Alignment = 'SpaceBetweenLeft'
            // align BottomSpaceBetween => SpaceBetweenRight
            if (_layout.Alignment.includes('Bottom'))
              _layout.Alignment = 'SpaceBetweenRight'
          }
          StyleDA.docStyleSheets.find(rule => {
            let selector = [...divSection.querySelectorAll(rule.selectorText)]
            let check = selector.includes(wb.value)
            if (check) {
              if (wb.value.getAttribute('width-type') === 'fit') {
                // TH height của wbase item này dạng fill container thì phải chuyển width của wbase item này về dạng fill container
                if (wb.value.getAttribute('height-type') === 'fill') {
                  //TH đang có wbase item parent của item này đang hug contents width thì lúc này bắt buộc phải chuyển width của nó từ hug sang fixed
                  if (pWb.value.getAttribute('width-type') === 'fit') {
                    if (pWb.StyleItem) {
                      pWb.StyleItem.FrameItem.Width = pWb.value.offsetWidth
                      pWb.value.style.width = `${pWb.value.offsetWidth}px`
                      pWb.value.removeAttribute('width-type')
                      listUpdate.push(pWb)
                    }
                    if (
                      (pWb.IsWini && pWb.CateID !== EnumCate.variant) ||
                      !pWb.StyleItem
                    ) {
                      StyleDA.docStyleSheets.find(pRule => {
                        let pSelector = [
                          ...divSection.querySelectorAll(pRule.selectorText)
                        ]
                        let check = pSelector.includes(pWb.value)
                        if (check) {
                          pRule.style.width = `${pWb.value.offsetWidth}px`
                          pSelector.forEach(e =>
                            e.removeAttribute('width-type')
                          )
                          cssItem.Css = cssItem.Css.replace(
                            new RegExp(`${pRule.selectorText} {[^}]*}`, 'g'),
                            pRule.cssText
                          )
                        }
                        return check
                      })
                    }
                  }
                  rule.style.width = '100%'
                  selector.forEach(e => e.setAttribute('width-type', 'fill'))
                }
                // TH height của wbase item này dạng fixed thì phải chuyển width của wbase item này về dạng fixed
                else if (!wb.value.getAttribute('height-type')) {
                  rule.style.width = `${wb.value.offsetWidth}px`
                  selector.forEach(e => e.removeAttribute('width-type'))
                }
                // gán height của wbase item này null để hug contents
                //TH đang có bất kì wbase item con của item này đang fill container height thì phải chuyển height của nó về fixed
                let listChildFillH = wb.value.querySelectorAll(
                  `.wbaseItem-value[level="${
                    wb.Level + 1
                  }"][height-type="fill"]`
                )
                for (let cWbHTML of listChildFillH) {
                  StyleDA.docStyleSheets.find(cRule => {
                    let selectorC = [
                      ...divSection.querySelectorAll(cRule.selectorText)
                    ]
                    let checkC = selectorC.includes(cWbHTML)
                    if (checkC) {
                      cRule.style.height = `${cWbHTML.offsetHeight}px`
                      selectorC.forEach(e => e.removeAttribute('height-type'))
                      cssItem.Css = cssItem.Css.replace(
                        new RegExp(`${cRule.selectorText} {[^}]*}`, 'g'),
                        cRule.cssText
                      )
                    }
                    return checkC
                  })
                }
                rule.style.height = null
                selector.forEach(e => e.setAttribute('height-type', 'fit'))
              }
              //TH width của wbase item này đang fill container thì height của wbase item này phải chuyển về dạng fill container
              else if (wb.value.getAttribute('width-type') === 'fill') {
                //TH đang có wbase item parent của item này đang hug contents height thì lúc này bắt buộc phải chuyển height của nó từ hug sang fixed
                if (pWb.value.getAttribute('height-type', 'fit')) {
                  if (pWb.StyleItem) {
                    pWb.StyleItem.FrameItem.Height = pWb.value.offsetHeight
                    pWb.value.style.height = `${pWb.value.offsetHeight}px`
                    pWb.value.removeAttribute('height-type')
                    listUpdate.push(pWb)
                  }
                  if (
                    (pWb.IsWini && pWb.CateID !== EnumCate.variant) ||
                    !pWb.StyleItem
                  ) {
                    StyleDA.docStyleSheets.find(pRule => {
                      let selectorP = [
                        ...divSection.querySelectorAll(pRule.selectorText)
                      ]
                      let checkP = selectorP.includes(pWb.value)
                      if (checkP) {
                        pRule.style.height = `${pWb.value.offsetHeight}px`
                        selectorP.forEach(e => e.removeAttribute('height-type'))
                        cssItem.Css = cssItem.Css.replace(
                          new RegExp(`${pRule.selectorText} {[^}]*}`, 'g'),
                          pRule.cssText
                        )
                      }
                      return checkP
                    })
                  }
                }
                // TH height của wbase item này dạng hug contents thì phải chuyển width của wbase item này về dạng hug contents
                if (wb.value.getAttribute('height-type', 'fit')) {
                  //TH đang có bất kì wbase item con của item này đang fill container width thì phải chuyển width của nó về fixed
                  let listChildFillW = wb.value.querySelectorAll(
                    `.wbaseItem-value[level="${
                      wb.Level + 1
                    }"][width-type="fill"]`
                  )
                  for (let cWbHTML of listChildFillW) {
                    StyleDA.docStyleSheets.find(cRule => {
                      let selectorC = [
                        ...divSection.querySelectorAll(cRule.selectorText)
                      ]
                      let checkC = selectorC.includes(cWbHTML)
                      if (checkC) {
                        cRule.style.width = `${cWbHTML.offsetWidth}px`
                        selectorC.forEach(e => e.removeAttribute('width-type'))
                        cssItem.Css = cssItem.Css.replace(
                          new RegExp(`${cRule.selectorText} {[^}]*}`, 'g'),
                          cRule.cssText
                        )
                      }
                      return checkC
                    })
                  }
                  rule.style.width = null
                  selector.forEach(e => e.setAttribute('width-type', 'fit'))
                } else if (!wb.value.getAttribute('height-type')) {
                  rule.style.width = `${wb.value.offsetWidth}px`
                  selector.forEach(e => e.removeAttribute('width-type'))
                }
                rule.style.height = '100%'
                selector.forEach(e => e.setAttribute('height-type', 'fill'))
              }
              selector.forEach(e => {
                $(e).removeClass('w-row')
                $(e).addClass('w-col')
              })
              rule.style.setProperty(
                '--main-axis-align',
                wMainAxis(_layout.Alignment, false)
              )
              rule.style.setProperty(
                '--cross-axis-align',
                wCrossAxis(_layout.Alignment, false)
              )
              cssItem.Css = cssItem.Css.replace(
                new RegExp(`${rule.selectorText} {[^}]*}`, 'g'),
                rule.cssText
              )
            }
            return check
          })
        }
        StyleDA.editStyleSheet(cssItem)
      }
    } else {
      if (listUpdate[0].StyleItem) {
        for (let wb of [...listUpdate]) {
          wb.WAutolayoutItem.Direction = direction
          let _layout = wb.WAutolayoutItem
          // TH kiểu align trong autoLayout là spacebetween thì phải cập nhật cả dạng align cho autoLayout của wbase item này
          if (_layout.Alignment.includes('SpaceBetween')) {
            // align SpaceBetweenLeft => TopSpaceBetween
            if (_layout.Alignment.includes('Left'))
              _layout.Alignment = 'TopSpaceBetween'
            // align SpaceBetweenRight => BottomSpaceBetween
            if (_layout.Alignment.includes('Right'))
              _layout.Alignment = 'BottomSpaceBetween'
          }
          //TH height của wbase item này đang hug contents thì width của wbase item này phải chuyển về dạng hug contents
          if (wb.StyleItem.FrameItem.Height == null) {
            // TH width của wbase item này dạng fill container thì phải chuyển height của wbase item này về dạng fill container
            if (wb.StyleItem.FrameItem.Width < 0) {
              //TH đang có wbase item parent của item này đang hug contents height thì lúc này bắt buộc phải chuyển height của nó từ hug sang fixed
              if (pWb.StyleItem.FrameItem.Height == null) {
                pWb.StyleItem.FrameItem.Height = pWb.value.offsetHeight
                pWb.value.style.height = `${pWb.value.offsetHeight}px`
                pWb.value.removeAttribute('height-type')
                listUpdate.push(pWb)
              }
              wb.StyleItem.FrameItem.Height = -1
              wb.value.style.height = '100%'
              wb.value.setAttribute('height-type', 'fill')
            }
            // TH width của wbase item này dạng fixed thì phải chuyển height của wbase item này về dạng fixed
            else if (wb.StyleItem.FrameItem.Width != null) {
              wb.StyleItem.FrameItem.Height = wb.value.offsetHeight
              wb.value.style.height = `${wb.value.offsetHeight}px`
              wb.value.removeAttribute('height-type')
            }
            //TH đang có bất kì wbase item con của item này đang fill container width thì phải chuyển width của nó về fixed
            let listChildFillW = wbase_list.filter(
              e =>
                e.ParentID === wb.GID &&
                e.value.getAttribute('width-type') === 'fill'
            )
            if (listChildFillW.length > 0) {
              if (listChildFillW[0].StyleItem) {
                for (let cWb of listChildFillW) {
                  cWb.StyleItem.FrameItem.Width = cWb.value.offsetWidth
                  cWb.value.style.width = `${cWb.value.offsetWidth}px`
                  cWb.value.removeAttribute('width-type')
                  if (cWb.IsWini && cWb.CateID !== EnumCate.variant) {
                    let childCss = StyleDA.cssStyleSheets.find(
                      e => e.GID === cWb.GID
                    )
                    StyleDA.docStyleSheets.find(rule => {
                      let selector = [
                        ...divSection.querySelectorAll(rule.selectorText)
                      ]
                      let check = selector.includes(cWb.value)
                      if (check) {
                        rule.style.width = `${cWb.value.offsetWidth}px`
                        selector.forEach(e => e.removeAttribute('width-type'))
                        childCss.Css = childCss.Css.replace(
                          new RegExp(`${rule.selectorText} {[^}]*}`, 'g'),
                          rule.cssText
                        )
                      }
                      return check
                    })
                    StyleDA.editStyleSheet(childCss)
                  }
                }
                listUpdate.push(...listChildFillW)
              } else {
                var cssItem = StyleDA.cssStyleSheets.find(e => e.GID === wb.GID)
                for (let cWb of listChildFillW) {
                  StyleDA.docStyleSheets.find(rule => {
                    let selector = [
                      ...divSection.querySelectorAll(rule.selectorText)
                    ]
                    let check = selector.includes(cWb.value)
                    if (check) {
                      rule.style.width = `${cWb.value.offsetWidth}px`
                      selector.forEach(e => e.removeAttribute('width-type'))
                      cssItem.Css = cssItem.Css.replace(
                        new RegExp(`${rule.selectorText} {[^}]*}`, 'g'),
                        rule.cssText
                      )
                    }
                    return check
                  })
                }
              }
            }
            // gán width của wbase item này null để hug contents
            wb.StyleItem.FrameItem.Width = null
            wb.value.style.width = null
            wb.value.setAttribute('width-type', 'fit')
          }
          //TH height của wbase item này đang fill container thì width của wbase item này phải chuyển về dạng fill container
          else if (wb.StyleItem.FrameItem.Height < 0) {
            //TH đang có wbase item parent của item này đang hug contents width thì lúc này bắt buộc phải chuyển width của nó từ hug sang fixed
            if (pWb.StyleItem.FrameItem.Width == null) {
              pWb.StyleItem.FrameItem.Width = pWb.value.offsetWidth
              pWb.value.style.width = `${pWb.value.offsetWidth}px`
              pWb.value.removeAttribute('width-type')
              listUpdate.push(pWb)
            }
            // TH width của wbase item này dạng hug contents thì phải chuyển height của wbase item này về dạng hug contents
            if (wb.StyleItem.FrameItem.Width == null) {
              //TH đang có bất kì wbase item con của item này đang fill container width thì phải chuyển height của nó về fixed
              let listChildFillH = wbase_list.filter(
                e =>
                  e.ParentID === wb.GID &&
                  e.value.getAttribute('height-type') === 'fill'
              )
              if (listChildFillH.length > 0) {
                if (listChildFillH[0].StyleItem) {
                  for (let cWb of listChildFillH) {
                    cWb.StyleItem.FrameItem.Height = cWb.value.offsetHeight
                    cWb.value.style.height = `${cWb.value.offsetHeight}px`
                    cWb.value.removeAttribute('height-type')
                    if (cWb.IsWini && cWb.CateID !== EnumCate.variant) {
                      let childCss = StyleDA.cssStyleSheets.find(
                        e => e.GID === cWb.GID
                      )
                      StyleDA.docStyleSheets.find(rule => {
                        let selector = [
                          ...divSection.querySelectorAll(rule.selectorText)
                        ]
                        let check = selector.includes(cWb.value)
                        if (check) {
                          rule.style.height = `${cWb.value.offsetHeight}px`
                          selector.forEach(e =>
                            e.removeAttribute('height-type')
                          )
                          childCss.Css = childCss.Css.replace(
                            new RegExp(`${rule.selectorText} {[^}]*}`, 'g'),
                            rule.cssText
                          )
                        }
                        return check
                      })
                      StyleDA.editStyleSheet(childCss)
                    }
                  }
                  listUpdate.push(...listChildFillH)
                } else {
                  cssItem ??= StyleDA.cssStyleSheets.find(e => e.GID === wb.GID)
                  for (let cWb of listChildFillH) {
                    StyleDA.docStyleSheets.find(rule => {
                      let selector = [
                        ...divSection.querySelectorAll(rule.selectorText)
                      ]
                      let check = selector.includes(cWb.value)
                      if (check) {
                        rule.style.height = `${cWb.value.offsetHeight}px`
                        selector.forEach(e => e.removeAttribute('height-type'))
                        cssItem.Css = cssItem.Css.replace(
                          new RegExp(`${rule.selectorText} {[^}]*}`, 'g'),
                          rule.cssText
                        )
                      }
                      return check
                    })
                  }
                }
              }
              wb.StyleItem.FrameItem.Height = null
              wb.value.style.height = null
              wb.value.setAttribute('height-type', 'fit')
            } else if (wb.StyleItem.FrameItem.Width >= 0) {
              wb.StyleItem.FrameItem.Height = wb.value.offsetHeight
              wb.value.style.height = `${wb.value.offsetHeight}px`
              wb.value.removeAttribute('height-type')
            }
            wb.StyleItem.FrameItem.Width = -1
            wb.value.style.width = '100%'
            wb.value.setAttribute('width-type', 'fill')
          }
          $(wb.value).addClass('w-row')
          $(wb.value).removeClass('w-col')
          wb.value.style.setProperty(
            '--main-axis-align',
            wMainAxis(_layout.Alignment, true)
          )
          wb.value.style.setProperty(
            '--cross-axis-align',
            wCrossAxis(_layout.Alignment, true)
          )
          if (wb.IsWini && wb.CateID !== EnumCate.variant) {
            cssItem ??= StyleDA.cssStyleSheets.find(e => e.GID === wb.GID)
            StyleDA.docStyleSheets.find(wbRule => {
              let selector = [
                ...divSection.querySelectorAll(wbRule.selectorText)
              ]
              let check = selector.includes(wb.value)
              if (check) {
                wbRule.style.width = wb.value.style.width
                wbRule.style.height = wb.value.style.height
                selector.forEach(e => {
                  if (e !== wb.value) {
                    $(e).addClass('w-row')
                    $(e).removeClass('w-col')
                    if (wb.value.getAttribute('width-type')) {
                      e.setAttribute(
                        'width-type',
                        wb.value.getAttribute('width-type')
                      )
                    } else {
                      e.removeAttribute('width-type')
                    }
                    if (wb.value.getAttribute('height-type')) {
                      e.setAttribute(
                        'height-type',
                        wb.value.getAttribute('height-type')
                      )
                    } else {
                      e.removeAttribute('height-type')
                    }
                    e.style.setProperty(
                      '--main-axis-align',
                      wMainAxis(_layout.Alignment, true)
                    )
                    e.style.setProperty(
                      '--cross-axis-align',
                      wCrossAxis(_layout.Alignment, true)
                    )
                  }
                })
                cssItem.Css = cssItem.Css.replace(
                  new RegExp(`${wbRule.selectorText} {[^}]*}`, 'g'),
                  wbRule.cssText
                )
              }
              return check
            })
          }
        }
        if (cssItem) StyleDA.editStyleSheet(cssItem)
      } else {
        let pWbComponent = listUpdate[0].value.closest(
          `.wbaseItem-value[iswini="true"]`
        )
        let cssItem = StyleDA.cssStyleSheets.find(
          e => e.GID === pWbComponent.id
        )
        for (let wb of [...listUpdate]) {
          wb.WAutolayoutItem.Direction = direction
          let _layout = wb.WAutolayoutItem
          // TH kiểu align trong autoLayout là spacebetween thì phải cập nhật cả dạng align cho autoLayout của wbase item này
          if (_layout.Alignment.includes('SpaceBetween')) {
            // align SpaceBetweenLeft => TopSpaceBetween
            if (_layout.Alignment.includes('Left'))
              _layout.Alignment = 'TopSpaceBetween'
            // align SpaceBetweenRight => BottomSpaceBetween
            if (_layout.Alignment.includes('Right'))
              _layout.Alignment = 'BottomSpaceBetween'
          }
          StyleDA.docStyleSheets.find(rule => {
            let selector = [...divSection.querySelectorAll(rule.selectorText)]
            let check = selector.includes(wb.value)
            if (check) {
              //TH height của wbase item này đang hug contents thì width của wbase item này phải chuyển về dạng hug contents
              if (wb.value.getAttribute('height-type') === 'fit') {
                // TH width của wbase item này dạng fill container thì phải chuyển height của wbase item này về dạng fill container
                if (wb.value.getAttribute('width-type') === 'fill') {
                  //TH đang có wbase item parent của item này đang hug contents height thì lúc này bắt buộc phải chuyển height của nó từ hug sang fixed
                  if (pWb.value.getAttribute('height-type') === 'fit') {
                    if (pWb.StyleItem) {
                      pWb.StyleItem.FrameItem.Height = pWb.value.offsetHeight
                      pWb.value.style.height = `${pWb.value.offsetHeight}px`
                      pWb.value.removeAttribute('height-type')
                      listUpdate.push(pWb)
                    }
                    if (
                      (pWb.IsWini && pWb.CateID !== EnumCate.variant) ||
                      !pWb.StyleItem
                    ) {
                      StyleDA.docStyleSheets.find(pRule => {
                        let pSelector = [
                          ...divSection.querySelectorAll(pRule.selectorText)
                        ]
                        let check = pSelector.includes(pWb.value)
                        if (check) {
                          pRule.style.height = `${pWb.value.offsetHeight}px`
                          pSelector.forEach(e =>
                            e.removeAttribute('height-type')
                          )
                        }
                        return check
                      })
                      cssItem.Css = cssItem.Css.replace(
                        new RegExp(`${pRule.selectorText} {[^}]*}`, 'g'),
                        pRule.cssText
                      )
                    }
                  }
                  rule.style.height = '100%'
                  selector.forEach(e => e.setAttribute('height-type', 'fill'))
                }
                // TH width của wbase item này dạng fixed thì phải chuyển height của wbase item này về dạng fixed
                else if (!wb.value.getAttribute('width-type')) {
                  rule.style.height = `${wb.value.offsetHeight}px`
                  selector.forEach(e => e.removeAttribute('height-type'))
                }
                //TH đang có bất kì wbase item con của item này đang fill container width thì phải chuyển width của nó về fixed
                let listChildFillW = wb.value.querySelectorAll(
                  `.wbaseItem-value[level="${wb.Level + 1}"][width-type="fill"]`
                )
                for (let cWbHTML of listChildFillW) {
                  StyleDA.docStyleSheets.find(cRule => {
                    let selectorC = [
                      ...divSection.querySelectorAll(cRule.selectorText)
                    ]
                    let checkC = selectorC.includes(cWbHTML)
                    if (checkC) {
                      cRule.style.width = `${cWbHTML.offsetWidth}px`
                      selectorC.forEach(e => e.removeAttribute('width-type'))
                      cssItem.Css = cssItem.Css.replace(
                        new RegExp(`${cRule.selectorText} {[^}]*}`, 'g'),
                        cRule.cssText
                      )
                    }
                    return checkC
                  })
                }
                // gán width của wbase item này null để hug contents
                rule.style.width = null
                selector.forEach(e => e.setAttribute('width-type', 'fit'))
              }
              //TH height của wbase item này đang fill container thì width của wbase item này phải chuyển về dạng fill container
              else if (wb.value.getAttribute('height-type') === 'fill') {
                //TH đang có wbase item parent của item này đang hug contents width thì lúc này bắt buộc phải chuyển width của nó từ hug sang fixed
                if (pWb.value.getAttribute('width-type', 'fit')) {
                  if (pWb.StyleItem) {
                    pWb.StyleItem.FrameItem.Width = pWb.value.offsetWidth
                    pWb.value.style.width = `${pWb.value.offsetWidth}px`
                    pWb.value.removeAttribute('width-type')
                    listUpdate.push(pWb)
                  } else {
                    StyleDA.docStyleSheets.find(pRule => {
                      let selectorP = [
                        ...divSection.querySelectorAll(pRule.selectorText)
                      ]
                      let checkP = selectorP.includes(pWb.value)
                      if (checkP) {
                        pRule.style.width = `${pWb.value.offsetWidth}px`
                        selectorP.forEach(e => e.removeAttribute('width-type'))
                        cssItem.Css = cssItem.Css.replace(
                          new RegExp(`${pRule.selectorText} {[^}]*}`, 'g'),
                          pRule.cssText
                        )
                      }
                      return checkP
                    })
                  }
                }
                // TH width của wbase item này dạng hug contents thì phải chuyển height của wbase item này về dạng hug contents
                if (wb.value.getAttribute('width-type', 'fit')) {
                  //TH đang có bất kì wbase item con của item này đang fill container width thì phải chuyển height của nó về fixed
                  let listChildFillH = wb.value.querySelectorAll(
                    `.wbaseItem-value[level="${
                      wb.Level + 1
                    }"][height-type="fill"]`
                  )
                  for (let cWbHTML of listChildFillH) {
                    StyleDA.docStyleSheets.find(cRule => {
                      let selector = [
                        ...divSection.querySelectorAll(cRule.selectorText)
                      ]
                      let checkC = selector.includes(cWbHTML)
                      if (checkC) {
                        cRule.style.height = `${cWbHTML.offsetHeight}px`
                        selector.forEach(e => e.removeAttribute('height-type'))
                        cssItem.Css = cssItem.Css.replace(
                          new RegExp(`${cRule.selectorText} {[^}]*}`, 'g'),
                          cRule.cssText
                        )
                      }
                      return checkC
                    })
                  }
                  rule.style.height = null
                  selector.forEach(e => e.setAttribute('height-type', 'fit'))
                } else if (!wb.value.getAttribute('width-type')) {
                  rule.style.height = `${wb.value.offsetHeight}px`
                  selector.forEach(e => e.removeAttribute('height-type'))
                }
                rule.style.width = '100%'
                selector.forEach(e => e.setAttribute('width-type', 'fill'))
              }
              selector.forEach(e => {
                $(e).addClass('w-row')
                $(e).removeClass('w-col')
              })
              rule.style.setProperty(
                '--main-axis-align',
                wMainAxis(_layout.Alignment, true)
              )
              rule.style.setProperty(
                '--cross-axis-align',
                wCrossAxis(_layout.Alignment, true)
              )
              cssItem.Css = cssItem.Css.replace(
                new RegExp(`${rule.selectorText} {[^}]*}`, 'g'),
                rule.cssText
              )
            }
            return check
          })
        }
        StyleDA.editStyleSheet(cssItem)
      }
    }
    WBaseDA.edit(listUpdate, EnumObj.autoLayoutFrame)
  } else if (alignment) {
    if (listUpdate[0].StyleItem) {
      for (let wb of [...listUpdate]) {
        wb.WAutolayoutItem.Alignment = alignment
        wb.value.style.setProperty(
          '--main-axis-align',
          wMainAxis(
            alignment,
            wb.CateID === EnumCate.table
              ? null
              : wb.WAutolayoutItem.Direction === 'Horizontal'
          )
        )
        wb.value.style.setProperty(
          '--cross-axis-align',
          wCrossAxis(
            alignment,
            wb.CateID === EnumCate.table
              ? null
              : wb.WAutolayoutItem.Direction === 'Horizontal'
          )
        )
        if (wb.IsWini && wb.CateID !== EnumCate.variant) {
          let cssItem = StyleDA.cssStyleSheets.find(e => e.GID === wb.GID)
          let cssRule = StyleDA.docStyleSheets.find(e =>
            [...divSection.querySelectorAll(e.selectorText)].includes(wb.value)
          )
          cssRule.style.setProperty(
            '--main-axis-align',
            wMainAxis(
              alignment,
              wb.CateID === EnumCate.table
                ? null
                : wb.WAutolayoutItem.Direction === 'Horizontal'
            )
          )
          cssRule.style.setProperty(
            '--cross-axis-align',
            wCrossAxis(
              alignment,
              wb.CateID === EnumCate.table
                ? null
                : wb.WAutolayoutItem.Direction === 'Horizontal'
            )
          )
          cssItem.Css = cssItem.Css.replace(
            new RegExp(`${cssRule.selectorText} {[^}]*}`, 'g'),
            cssRule.cssText
          )
          StyleDA.editStyleSheet(cssItem)
        }
      }
    } else {
      let pWbComponent = listUpdate[0].value.closest(
        `.wbaseItem-value[iswini="true"]`
      )
      let cssItem = StyleDA.cssStyleSheets.find(e => e.GID === pWbComponent.id)
      for (let wb of [...listUpdate]) {
        let cssRule = StyleDA.docStyleSheets.find(e =>
          [...divSection.querySelectorAll(e.selectorText)].includes(wb.value)
        )
        wb.WAutolayoutItem.Alignment = alignment
        cssRule.style.setProperty(
          '--main-axis-align',
          wMainAxis(
            alignment,
            wb.CateID === EnumCate.table
              ? null
              : wb.value.classList.contains('w-row')
          )
        )
        cssRule.style.setProperty(
          '--cross-axis-align',
          wCrossAxis(
            alignment,
            wb.CateID === EnumCate.table
              ? null
              : wb.value.classList.contains('w-row')
          )
        )
        cssItem.Css = cssItem.Css.replace(
          new RegExp(`${cssRule.selectorText} {[^}]*}`, 'g'),
          cssRule.cssText
        )
      }
      StyleDA.editStyleSheet(cssItem)
    }
    WBaseDA.edit(listUpdate, EnumObj.autoLayout)
  } else if (childSpace !== undefined) {
    if (listUpdate[0].StyleItem) {
      for (let wb of [...listUpdate]) {
        wb.WAutolayoutItem.ChildSpace = childSpace
        if (wb.WAutolayoutItem.Alignment.includes('SpaceBetween')) {
          var isRow = wb.WAutolayoutItem.Direction == 'Horizontal'
          if (isRow) {
            wb.WAutolayoutItem.Alignment = wb.WAutolayoutItem.Alignment.replace(
              'SpaceBetween',
              'Left'
            )
          } else {
            wb.WAutolayoutItem.Alignment = wb.WAutolayoutItem.Alignment.replace(
              'SpaceBetween',
              'Top'
            )
          }
          wb.value.style.setProperty(
            '--main-axis-align',
            wMainAxis(
              wb.WAutolayoutItem.Alignment,
              wb.CateID === EnumCate.table ? null : isRow
            )
          )
          wb.value.style.setProperty(
            '--cross-axis-align',
            wCrossAxis(
              wb.WAutolayoutItem.Alignment,
              wb.CateID === EnumCate.table ? null : isRow
            )
          )
        }
        wb.value.style.setProperty('--child-space', `${childSpace}px`)
        if (wb.IsWini && wb.CateID !== EnumCate.variant) {
          let cssItem = StyleDA.cssStyleSheets.find(e => e.GID === wb.GID)
          let cssRule = StyleDA.docStyleSheets.find(e =>
            [...divSection.querySelectorAll(e.selectorText)].includes(wb.value)
          )
          if (isRow != null) {
            cssRule.style.setProperty(
              '--main-axis-align',
              wMainAxis(
                wb.WAutolayoutItem.Alignment,
                wb.CateID === EnumCate.table ? null : isRow
              )
            )
            cssRule.style.setProperty(
              '--cross-axis-align',
              wCrossAxis(
                wb.WAutolayoutItem.Alignment,
                wb.CateID === EnumCate.table ? null : isRow
              )
            )
          }
          cssRule.style.setProperty('--child-space', `${childSpace}px`)
          cssItem.Css = cssItem.Css.replace(
            new RegExp(`${cssRule.selectorText} {[^}]*}`, 'g'),
            cssRule.cssText
          )
          StyleDA.editStyleSheet(cssItem)
        } else {
          wb.value
            .querySelectorAll(`.col-[level="${wb.Level + 1}"]`)
            .forEach(cWbHTMl => {
              cWbHTMl.style.setProperty('--gutter', `${childSpace}px`)
            })
        }
      }
    } else {
      let pWbComponent = listUpdate[0].value.closest(
        `.wbaseItem-value[iswini="true"]`
      )
      let cssItem = StyleDA.cssStyleSheets.find(e => e.GID === pWbComponent.id)
      for (let wb of [...listUpdate]) {
        let cssRule = StyleDA.docStyleSheets.find(e =>
          [...divSection.querySelectorAll(e.selectorText)].includes(wb.value)
        )
        cssRule.style.setProperty('--child-space', `${childSpace}px`)
        wb.value
          .querySelectorAll(`.col-[level="${wb.Level + 1}"]`)
          .forEach(cWbHTMl => {
            let cRule = StyleDA.docStyleSheets.find(e =>
              [...divSection.querySelectorAll(e.selectorText)].includes(cWbHTMl)
            )
            cRule.style.setProperty('--gutter', `${childSpace}px`)
            cssItem.Css = cssItem.Css.replace(
              new RegExp(`${cRule.selectorText} {[^}]*}`, 'g'),
              cRule.cssText
            )
          })
        cssItem.Css = cssItem.Css.replace(
          new RegExp(`${cssRule.selectorText} {[^}]*}`, 'g'),
          cssRule.cssText
        )
      }
      StyleDA.editStyleSheet(cssItem)
    }
    WBaseDA.edit(listUpdate, EnumObj.autoLayout)
  } else if (runSpace !== undefined) {
    if (listUpdate[0].StyleItem) {
      for (let wb of [...listUpdate]) {
        wb.WAutolayoutItem.RunSpace = runSpace
        wb.value.style.setProperty('--run-space', `${runSpace}px`)
        if (wb.IsWini && wb.CateID !== EnumCate.variant) {
          let cssItem = StyleDA.cssStyleSheets.find(e => e.GID === wb.GID)
          let cssRule = StyleDA.docStyleSheets.find(e =>
            [...divSection.querySelectorAll(e.selectorText)].includes(wb.value)
          )
          cssRule.style.setProperty('--run-space', `${runSpace}px`)
          cssItem.Css = cssItem.Css.replace(
            new RegExp(`${cssRule.selectorText} {[^}]*}`, 'g'),
            cssRule.cssText
          )
          StyleDA.editStyleSheet(cssItem)
        }
      }
    } else {
      let pWbComponent = listUpdate[0].value.closest(
        `.wbaseItem-value[iswini="true"]`
      )
      let cssItem = StyleDA.cssStyleSheets.find(e => e.GID === pWbComponent.id)
      for (let wb of [...listUpdate]) {
        wb.WAutolayoutItem.RunSpace = runSpace
        let cssRule = StyleDA.docStyleSheets.find(e =>
          [...divSection.querySelectorAll(e.selectorText)].includes(wb.value)
        )
        cssRule.style.setProperty('--run-space', `${runSpace}px`)
        cssItem.Css = cssItem.Css.replace(
          new RegExp(`${cssRule.selectorText} {[^}]*}`, 'g'),
          cssRule.cssText
        )
      }
      StyleDA.editStyleSheet(cssItem)
    }
    WBaseDA.edit(listUpdate, EnumObj.autoLayout)
  } else if (isWrap !== undefined) {
    if (listUpdate[0].StyleItem) {
      for (let wb of [...listUpdate]) {
        wb.WAutolayoutItem.IsWrap = isWrap
        if (isWrap) {
          if (wb.WAutolayoutItem.Direction === 'Vertical') {
            let listChildFillW = wbase_list.filter(
              e => e.ParentID === wb.GID && e.StyleItem.FrameItem.Width < 0
            )
            if (listChildFillW.length > 0) {
              if (listChildFillW[0].StyleItem) {
                for (let cWb of listChildFillW) {
                  cWb.StyleItem.FrameItem.Width = cWb.value.offsetWidth
                  cWb.value.style.width = `${cWb.value.offsetWidth}px`
                  cWb.value.removeAttribute('width-type')
                  if (cWb.IsWini && cWb.CateID !== EnumCate.variant) {
                    let cssItem = StyleDA.cssStyleSheets.find(
                      e => e.GID === cWb.GID
                    )
                    StyleDA.docStyleSheets.find(rule => {
                      let selector = [
                        ...divSection.querySelectorAll(rule.selectorText)
                      ]
                      let check = selector.includes(cWb.value)
                      if (check) {
                        rule.style.width = `${cWb.value.offsetWidth}px`
                        selector.forEach(e => e.removeAttribute('width-type'))
                        cssItem.Css = cssItem.Css.replace(
                          new RegExp(`${rule.selectorText} {[^}]*}`, 'g'),
                          rule.cssText
                        )
                      }
                      return check
                    })
                    StyleDA.editStyleSheet(cssItem)
                  }
                }
                listUpdate.push(...listChildFillW)
              } else {
                var cssItem = StyleDA.cssStyleSheets.find(e => e.GID === wb.GID)
                for (let cWb of listChildFillW) {
                  StyleDA.docStyleSheets.find(rule => {
                    let selector = [
                      ...divSection.querySelectorAll(rule.selectorText)
                    ]
                    let check = selector.includes(cWb.value)
                    if (check) {
                      rule.style.width = `${cWb.value.offsetWidth}px`
                      selector.forEach(e => e.removeAttribute('width-type'))
                      cssItem.Css = cssItem.Css.replace(
                        new RegExp(`${rule.selectorText} {[^}]*}`, 'g'),
                        rule.cssText
                      )
                    }
                    return check
                  })
                }
              }
            }
            if (wb.StyleItem.FrameItem.Height == null) {
              wb.StyleItem.FrameItem.Height = wb.value.offsetHeight
              wb.value.style.height = wb.value.offsetHeight + 'px'
              wb.value.removeAttribute('height-type')
            }
          } else {
            let listChildFillH = wbase_list.filter(
              e => e.ParentID === wb.GID && e.StyleItem.FrameItem.Height < 0
            )
            if (listChildFillH.length > 0) {
              if (listChildFillH[0].StyleItem) {
                for (let cWb of listChildFillH) {
                  cWb.StyleItem.FrameItem.Height = cWb.value.offsetHeight
                  cWb.value.style.height = `${cWb.value.offsetHeight}px`
                  cWb.value.removeAttribute('height-type')
                  if (cWb.IsWini && cWb.CateID !== EnumCate.variant) {
                    let cssItem = StyleDA.cssStyleSheets.find(
                      e => e.GID === cWb.GID
                    )
                    StyleDA.docStyleSheets.find(rule => {
                      let selector = [
                        ...divSection.querySelectorAll(rule.selectorText)
                      ]
                      let check = selector.includes(cWb.value)
                      if (check) {
                        rule.style.height = `${cWb.value.offsetHeight}px`
                        selector.forEach(e => e.removeAttribute('height-type'))
                        cssItem.Css = cssItem.Css.replace(
                          new RegExp(`${rule.selectorText} {[^}]*}`, 'g'),
                          rule.cssText
                        )
                      }
                      return check
                    })
                    StyleDA.editStyleSheet(cssItem)
                  }
                }
                listUpdate.push(...listChildFillH)
              } else {
                cssItem ??= StyleDA.cssStyleSheets.find(e => e.GID === wb.GID)
                for (let cWb of listChildFillH) {
                  StyleDA.docStyleSheets.find(rule => {
                    let selector = [
                      ...divSection.querySelectorAll(rule.selectorText)
                    ]
                    let check = selector.includes(cWb.value)
                    if (check) {
                      rule.style.height = `${cWb.value.offsetHeight}px`
                      selector.forEach(e => e.removeAttribute('height-type'))
                      cssItem.Css = cssItem.Css.replace(
                        new RegExp(`${rule.selectorText} {[^}]*}`, 'g'),
                        rule.cssText
                      )
                    }
                    return check
                  })
                }
              }
            }
            if (wb.StyleItem.FrameItem.Width == null) {
              wb.StyleItem.FrameItem.Width = wb.value.offsetWidth
              wb.value.style.width = wb.value.offsetWidth + 'px'
              wb.value.removeAttribute('width-type')
            }
          }
          wb.value.setAttribute('wrap', 'wrap')
        } else wb.value.removeAttribute('wrap')
        if (wb.IsWini && wb.CateID !== EnumCate.variant) {
          cssItem ??= StyleDA.cssStyleSheets.find(e => e.GID === wb.GID)
          let cssRule = StyleDA.docStyleSheets.find(e =>
            [...divSection.querySelectorAll(e.selectorText)].includes(wb.value)
          )
          cssRule.style.flexWrap = isWrap ? 'wrap' : null
          cssItem.Css = cssItem.Css.replace(
            new RegExp(`${cssRule.selectorText} {[^}]*}`, 'g'),
            cssRule.cssText
          )
        }
        if (cssItem) StyleDA.editStyleSheet(cssItem)
      }
      WBaseDA.edit(listUpdate, EnumObj.autoLayoutFrame)
    } else {
      let pWbComponent = listUpdate[0].value.closest(
        `.wbaseItem-value[iswini="true"]`
      )
      let cssItem = StyleDA.cssStyleSheets.find(e => e.GID === pWbComponent.id)
      for (let wb of [...listUpdate]) {
        wb.WAutolayoutItem.IsWrap = isWrap
        StyleDA.docStyleSheets.find(rule => {
          let selector = [...divSection.querySelectorAll(rule.selectorText)]
          let check = selector.includes(wb.value)
          if (check) {
            if (isWrap) {
              if (wb.value.classList.contains('w-col')) {
                let listChildFillW = wb.value.querySelectorAll(
                  `.wbaseItem-value[level="${wb.Level + 1}"][width-type="fill"]`
                )
                if (listChildFillW.length > 0) {
                  for (let cWb of listChildFillW) {
                    StyleDA.docStyleSheets.find(cRule => {
                      let selectorC = [
                        ...divSection.querySelectorAll(cRule.selectorText)
                      ]
                      let checkC = selectorC.includes(cWb.value)
                      if (checkC) {
                        cRule.style.width = `${cWb.value.offsetWidth}px`
                        selectorC.forEach(e => e.removeAttribute('width-type'))
                        cssItem.Css = cssItem.Css.replace(
                          new RegExp(`${cRule.selectorText} {[^}]*}`, 'g'),
                          cRule.cssText
                        )
                      }
                      return checkC
                    })
                  }
                }
                if (wb.value.getAttribute('height-type') === 'fit') {
                  rule.style.height = wb.value.offsetHeight + 'px'
                  selector.forEach(e => e.removeAttribute('height-type'))
                }
              } else {
                let listChildFillH = wb.value.querySelectorAll(
                  `.wbaseItem-value[level="${
                    wb.Level + 1
                  }"][height-type="fill"]`
                )
                if (listChildFillH.length > 0) {
                  for (let cWb of listChildFillH) {
                    StyleDA.docStyleSheets.find(cRule => {
                      let selectorC = [
                        ...divSection.querySelectorAll(cRule.selectorText)
                      ]
                      let checkC = selectorC.includes(cWb.value)
                      if (checkC) {
                        cRule.style.height = `${cWb.value.offsetHeight}px`
                        selectorC.forEach(e => e.removeAttribute('height-type'))
                        cssItem.Css = cssItem.Css.replace(
                          new RegExp(`${cRule.selectorText} {[^}]*}`, 'g'),
                          cRule.cssText
                        )
                      }
                      return checkC
                    })
                  }
                }
                if (wb.value.getAttribute('width-type') === 'fit') {
                  rule.style.width = wb.value.offsetWidth + 'px'
                  selector.forEach(e => e.removeAttribute('width-type'))
                }
              }
              selector.forEach(e => e.setAttribute('wrap', 'wrap'))
            } else {
              selector.forEach(e => e.removeAttribute('wrap'))
            }
            rule.style.flexWrap = isWrap ? 'wrap' : null
            cssItem.Css = cssItem.Css.replace(
              new RegExp(`${rule.selectorText} {[^}]*}`, 'g'),
              rule.cssText
            )
          }
          return check
        })
      }
      StyleDA.editStyleSheet(cssItem)
      WBaseDA.edit(listUpdate, EnumObj.autoLayout)
    }
  } else if (isScroll !== undefined) {
    if (listUpdate[0].StyleItem) {
      for (let wb of [...listUpdate]) {
        wb.WAutolayoutItem.IsScroll = isScroll
        if (isScroll) wb.value.setAttribute('scroll', 'true')
        else wb.value.removeAttribute('scroll')
        if (wb.IsWini && wb.CateID !== EnumCate.variant) {
          let cssItem = StyleDA.cssStyleSheets.find(e => e.GID === wb.id)
          let cssRule = StyleDA.docStyleSheets.find(e => {
            let selector = [...divSection.querySelectorAll(e.selectorText)]
            let check = selector.includes(wb.value)
            if (check)
              selector.forEach(el => {
                if (isScroll) el.setAttribute('scroll', 'true')
                else el.removeAttribute('scroll')
              })
            return check
          })
          cssRule.style.overflow = isScroll ? 'scroll' : 'hidden'
          cssItem.Css = cssItem.Css.replace(
            new RegExp(`${cssRule.selectorText} {[^}]*}`, 'g'),
            cssRule.cssText
          )
        }
      }
    } else {
      let pWbComponent = listUpdate[0].value.closest(
        `.wbaseItem-value[iswini="true"]`
      )
      let cssItem = StyleDA.cssStyleSheets.find(e => e.GID === pWbComponent.id)
      for (let wb of [...listUpdate]) {
        wb.WAutolayoutItem.IsScroll = isScroll
        let cssRule = StyleDA.docStyleSheets.find(rule => {
          let selector = [...divSection.querySelectorAll(rule.selectorText)]
          let check = selector.includes(wb.value)
          if (check)
            selector.forEach(e => {
              if (isScroll) e.setAttribute('scroll', 'true')
              else e.removeAttribute('scroll')
            })
          return check
        })
        cssRule.style.overflow = isScroll ? 'scroll' : 'hidden'
        cssItem.Css = cssItem.Css.replace(
          new RegExp(`${cssRule.selectorText} {[^}]*}`, 'g'),
          cssRule.cssText
        )
      }
      StyleDA.editStyleSheet(cssItem)
    }
    WBaseDA.edit(listUpdate, EnumObj.autoLayout)
  }
  updateUISelectBox()
}

function removeLayout () {
  let listUpdate = selected_list.filter(wb =>
    window.getComputedStyle(wb.value).display.match(/(flex|table)/g)
  )
  if (listUpdate[0].StyleItem) {
    for (let wb of [...listUpdate]) {
      let wbRect = wb.value.getBoundingClientRect()
      let offsetWbRect = offsetScale(wbRect.x, wbRect.y)
      wb.AutoLayoutID = null
      wb.WAutolayoutItem = null
      if (wb.value.getAttribute('width-type') === 'fit') {
        wb.StyleItem.FrameItem.Width = wb.value.offsetWidth
        wb.value.style.width = wb.value.offsetWidth + 'px'
        wb.value.removeAttribute('width-type')
      }
      if (wb.value.getAttribute('height-type') === 'fit') {
        wb.StyleItem.FrameItem.Height = wb.value.offsetHeight
        wb.value.style.height = wb.value.offsetHeight + 'px'
        wb.value.removeAttribute('height-type')
      }
      let wbChildren = wbase_list.filter(e => e.ParentID === wb.GID)
      if (wbChildren[0].StyleItem) {
        for (let cWb of wbChildren) {
          let cWbRect = cWb.value.getBoundingClientRect()
          let childOffset = offsetScale(cWbRect.x, cWbRect.y)
          if (cWb.value.getAttribute('width-type') === 'fill') {
            cWb.StyleItem.FrameItem.Width = cWb.value.offsetWidth
            cWb.value.style.width = cWb.value.offsetWidth + 'px'
            cWb.value.removeAttribute('width-type')
          }
          if (cWb.value.getAttribute('height-type') === 'fill') {
            cWb.StyleItem.FrameItem.Height = cWb.value.offsetHeight
            cWb.value.style.height = cWb.value.offsetHeight + 'px'
            cWb.value.removeAttribute('height-type')
          }
          //
          cWb.StyleItem.PositionItem.Left = `${Math.round(
            childOffset.x - offsetWbRect.x
          )}px`
          cWb.StyleItem.PositionItem.Top = `${Math.round(
            childOffset.y - offsetWbRect.y
          )}px`
          cWb.StyleItem.PositionItem.ConstraintsX = Constraints.left
          cWb.StyleItem.PositionItem.ConstraintsY = Constraints.top
          cWb.value.style.left = cWb.StyleItem.PositionItem.Left
          cWb.value.style.top = cWb.StyleItem.PositionItem.Top
          cWb.value.setAttribute('constx', Constraints.left)
          cWb.value.setAttribute('consty', Constraints.top)
          if (cWb.IsWini && cWb.CateID !== EnumCate.variant) {
            let cssItem = StyleDA.cssStyleSheets.find(e => e.GID === cWb.GID)
            StyleDA.docStyleSheets.find(rule => {
              let selector = [...divSection.querySelectorAll(rule.selectorText)]
              let check = selector.includes(cWb.value)
              if (check) {
                if (cWb.value.getAttribute('width-type') === 'fill') {
                  rule.style.width = cWb.value.offsetWidth + 'px'
                  selector.forEach(e => {
                    e.removeAttribute('width-type')
                    e.setAttribute('constx', Constraints.left)
                  })
                }
                if (cWb.value.getAttribute('height-type') === 'fill') {
                  rule.style.height = cWb.value.offsetHeight + 'px'
                  selector.forEach(e => {
                    e.removeAttribute('height-type')
                    e.setAttribute('consty', Constraints.top)
                  })
                }
                rule.style.left = cWb.StyleItem.PositionItem.Left
                rule.style.top = cWb.StyleItem.PositionItem.Top
                cssItem.Css = cssItem.Css.replace(
                  new RegExp(`${rule.selectorText} {[^}]*}`, 'g'),
                  rule.cssText
                )
              }
              return check
            })
            StyleDA.editStyleSheet(cssItem)
          }
        }
        listUpdate.push(...wbChildren)
      } else {
        let cssItem = StyleDA.cssStyleSheets.find(e => e.GID === wb.GID)
        for (let cWb of wbChildren) {
          let cssRule = StyleDA.docStyleSheets.find(rule => {
            let selector = [...divSection.querySelectorAll(rule.selectorText)]
            let check = selector.includes(cWb.value)
            if (check) {
              if (cWb.value.getAttribute('width-type') === 'fill') {
                rule.style.width = cWb.value.offsetWidth + 'px'
                selector.forEach(e => {
                  e.removeAttribute('width-type')
                  e.setAttribute('constx', Constraints.left)
                })
              }
              if (cWb.value.getAttribute('height-type') === 'fill') {
                rule.style.height = cWb.value.offsetHeight + 'px'
                selector.forEach(e => {
                  e.removeAttribute('height-type')
                  e.setAttribute('consty', Constraints.top)
                })
              }
            }
            return check
          })
          let cWbRect = cWb.value.getBoundingClientRect()
          let childOffset = offsetScale(cWbRect.x, cWbRect.y)
          //
          cssRule.style.left = `${Math.round(childOffset.x - offsetWbRect.x)}px`
          cssRule.style.top = `${Math.round(childOffset.y - offsetWbRect.y)}px`
          cssRule.style.removeProperty('--gutter')
          cssItem.Css = cssItem.Css.replace(
            new RegExp(`${cssRule.selectorText} {[^}]*}`, 'g'),
            cssRule.cssText
          )
        }
        StyleDA.editStyleSheet(cssItem)
      }
      wb.value.style.removeProperty('--child-space')
      wb.value.style.removeProperty('--run-space')
      wb.value.style.removeProperty('--main-axis-align')
      wb.value.style.removeProperty('--cross-axis-align')
      wb.value.style.removeProperty('--padding')
      $(wb.value).removeClass('w-row')
      $(wb.value).removeClass('w-col')
      $(wb.value).addClass('w-stack')
      if (wb.IsWini && wb.CateID !== EnumCate.variant) {
        let cssItem = StyleDA.cssStyleSheets.find(e => e.GID === wb.GID)
        StyleDA.docStyleSheets.find(rule => {
          let selector = [...divSection.querySelectorAll(rule.selectorText)]
          let check = selector.includes(wb.value)
          if (check) {
            rule.cssText = wb.value.style.cssText
              .split(';')
              .filter(e =>
                e.match(/(z-index|order|left|top|bottom|right|transform)/g)
              )
              .join(';')
            selector.forEach(e => {
              $(e).removeClass('w-row')
              $(e).removeClass('w-col')
              $(e).addClass('w-stack')
            })
            cssItem.Css = cssItem.Css.replace(
              new RegExp(`${rule.selectorText} {[^}]*}`, 'g'),
              rule.cssText
            )
          }
          return check
        })
        StyleDA.editStyleSheet(cssItem)
      }
    }
    WBaseDA.edit(listUpdate, EnumObj.basePositionFrame)
  } else {
    let pWbComponent = selected_list[0].value.closest(
      `.wbaseItem-value[iswini="true"]`
    )
    let cssItem = StyleDA.cssStyleSheets.find(e => e.GID === pWbComponent.id)
    for (let wb of [...listUpdate]) {
      let wbRect = wb.value.getBoundingClientRect()
      let offsetWbRect = offsetScale(wbRect.x, wbRect.y)
      wb.AutoLayoutID = null
      wb.WAutolayoutItem = null
      let cssRule = StyleDA.docStyleSheets.find(rule => {
        let selector = [...divSection.querySelectorAll(rule.selectorText)]
        let check = selector.includes(wb.value)
        if (check) {
          if (wb.value.getAttribute('width-type') === 'fit') {
            rule.style.width = wb.value.offsetWidth + 'px'
            selector.forEach(e => e.removeAttribute('width-type'))
          }
          if (wb.value.getAttribute('height-type') === 'fit') {
            rule.style.height = wb.value.offsetHeight + 'px'
            selector.forEach(e => e.removeAttribute('height-type'))
          }
          selector.forEach(e => {
            $(e).removeClass('w-row')
            $(e).removeClass('w-col')
            $(e).addClass('w-stack')
          })
        }
        return check
      })
      let wbChildren = wb.value.querySelectorAll(
        `.wbaseItem-value[level="${wb.Level + 1}"]`
      )
      for (let cWbHTML of wbChildren) {
        let childRule = StyleDA.docStyleSheets.find(rule => {
          let selector = [...divSection.querySelectorAll(rule.selectorText)]
          let check = selector.includes(cWbHTML)
          if (check) {
            if (cWbHTML.getAttribute('width-type') === 'fill') {
              rule.style.width = cWbHTML.offsetWidth + 'px'
              selector.forEach(e => {
                e.removeAttribute('width-type')
                e.setAttribute('constx', Constraints.left)
              })
            }
            if (cWbHTML.getAttribute('height-type') === 'fill') {
              rule.style.height = cWbHTML.offsetHeight + 'px'
              selector.forEach(e => {
                e.removeAttribute('height-type')
                e.setAttribute('consty', Constraints.top)
              })
            }
          }
          return check
        })
        let cWbRect = cWbHTML.getBoundingClientRect()
        let childOffset = offsetScale(cWbRect.x, cWbRect.y)
        //
        childRule.style.left = `${Math.round(childOffset.x - offsetWbRect.x)}px`
        childRule.style.top = `${Math.round(childOffset.y - offsetWbRect.y)}px`
        childRule.style.removeProperty('--gutter')
        cssItem.Css = cssItem.Css.replace(
          new RegExp(`${childRule.selectorText} {[^}]*}`, 'g'),
          childRule.cssText
        )
      }
      cssRule.style.removeProperty('--child-space')
      cssRule.style.removeProperty('--run-space')
      cssRule.style.removeProperty('--main-axis-align')
      cssRule.style.removeProperty('--cross-axis-align')
      cssRule.style.removeProperty('--padding')
      cssItem.Css = cssItem.Css.replace(
        new RegExp(`${cssRule.selectorText} {[^}]*}`, 'g'),
        cssRule.cssText
      )
    }
    StyleDA.editStyleSheet(cssItem)
    WBaseDA.edit(listUpdate, EnumObj.wBase)
  }
}

function handleEditPadding ({ top, right, bottom, left }) {
  let listUpdate = selected_list.filter(wb =>
    EnumCate.no_child_component.every(ct => wb.CateID !== ct)
  )
  if (listUpdate[0].StyleItem) {
    for (let wb of [...listUpdate]) {
      wb.StyleItem.PaddingItem ??= {
        GID: uuidv4(),
        Top: 0,
        Right: 0,
        Bottom: 0,
        Left: 0
      }
      if (top !== undefined) wb.StyleItem.PaddingItem.Top = top
      if (right !== undefined) wb.StyleItem.PaddingItem.Right = right
      if (bottom !== undefined) wb.StyleItem.PaddingItem.Bottom = bottom
      if (left !== undefined) wb.StyleItem.PaddingItem.Left = left
      //
      wb.value.style.setProperty(
        '--padding',
        `${wb.StyleItem.PaddingItem.Top}px ${wb.StyleItem.PaddingItem.Right}px ${wb.StyleItem.PaddingItem.Bottom}px ${wb.StyleItem.PaddingItem.Left}px`
      )
      if (wb.IsWini && wb.CateID !== EnumCate.variant) {
        let cssItem = StyleDA.cssStyleSheets.find(e => e.GID === wb.GID)
        let cssRule = StyleDA.docStyleSheets.find(e =>
          [...divSection.querySelectorAll(e.selectorText)].includes(wb.value)
        )
        cssRule.style.setProperty(
          '--padding',
          `${wb.StyleItem.PaddingItem.Top}px ${wb.StyleItem.PaddingItem.Right}px ${wb.StyleItem.PaddingItem.Bottom}px ${wb.StyleItem.PaddingItem.Left}px`
        )
        cssItem.Css = cssItem.Css.replace(
          new RegExp(`${cssRule.selectorText} {[^}]*}`, 'g'),
          cssRule.cssText
        )
        StyleDA.editStyleSheet(cssItem)
      }
    }
    WBaseDA.edit(listUpdate, EnumObj.padding)
    listUpdate.forEach(
      wb => (wb.StyleItem.PaddingID = wb.StyleItem.PaddingItem.GID)
    )
  } else {
    let pWbComponent = listUpdate[0].value.closest(
      `.wbaseItem-value[iswini="true"]`
    )
    let cssItem = StyleDA.cssStyleSheets.find(e => e.GID === pWbComponent.id)
    for (let wb of [...listUpdate]) {
      let cssRule = StyleDA.docStyleSheets.find(e =>
        [...divSection.querySelectorAll(e.selectorText)].includes(wb.value)
      )
      let paddingValues = cssRule.style.getPropertyValue('--padding').split(' ')
      if (top !== undefined) paddingValues[0] = top + 'px'
      if (right !== undefined) paddingValues[1] = right + 'px'
      if (bottom !== undefined) paddingValues[2] = bottom + 'px'
      if (left !== undefined) paddingValues[3] = left + 'px'
      cssRule.style.setProperty('--padding', paddingValues.join(' '))
      cssItem.Css = cssItem.Css.replace(
        new RegExp(`${cssRule.selectorText} {[^}]*}`, 'g'),
        cssRule.cssText
      )
    }
    StyleDA.editStyleSheet(cssItem)
  }
  updateUISelectBox()
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

function unlinkEffectSkin () {
  let listUpdate = selected_list.filter(
    wb =>
      EnumCate.accept_border_effect.some(ct => wb.CateID === ct) &&
      (window.getComputedStyle(wb.value).boxShadow !== 'none' ||
        window.getComputedStyle(wb.value).filter !== 'none')
  )
  if (listUpdate[0].StyleItem) {
    for (let wb of [...listUpdate]) {
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
    WBaseDA.addStyle(listUpdate, EnumObj.effect)
    listUpdate.forEach(
      wb =>
        (wb.StyleItem.DecorationItem.EffectID =
          wb.StyleItem.DecorationItem.EffectItem.GID)
    )
  } else {
    let pWbComponent = listUpdate[0].value.closest(
      `.wbaseItem-value[iswini="true"]`
    )
    let cssItem = StyleDA.cssStyleSheets.find(e => e.GID === pWbComponent.id)
    for (let wb of [...listUpdate]) {
      let cssRule = StyleDA.docStyleSheets.find(e =>
        [...divSection.querySelectorAll(e.selectorText)].includes(wb.value)
      )
      let wbStyle = window.getComputedStyle(wb.value)
      cssRule.style.filter = wbStyle.filter
      cssRule.style.boxShadow = wbStyle.boxShadow
      cssItem.Css = cssItem.Css.replace(
        new RegExp(`${cssRule.selectorText} {[^}]*}`, 'g'),
        cssRule.cssText
      )
    }
    StyleDA.editStyleSheet(cssItem)
  }
}

function addEffect () {
  let listUpdate = selected_list.filter(
    wb =>
      EnumCate.accept_border_effect.some(ct => wb.CateID === ct) &&
      window.getComputedStyle(wb.value).boxShadow === 'none' &&
      window.getComputedStyle(wb.value).filter === 'none'
  )
  let newEffectItem = {
    GID: uuidv4(),
    Name: 'new effect',
    OffsetX: 0,
    OffsetY: 4,
    IsStyle: false,
    ColorValue: '00000040',
    SpreadRadius: 0,
    BlurRadius: 4,
    Type: ShadowType.dropdown
  }
  if (listUpdate[0].StyleItem) {
    for (let wb of [...listUpdate]) {
      wb.StyleItem.DecorationItem.EffectID = newEffectItem.GID
      wb.StyleItem.DecorationItem.EffectItem = newEffectItem
      wb.value.style.boxShadow = `${newEffectItem.OffsetX}px ${newEffectItem.OffsetY}px ${newEffectItem.BlurRadius}px ${newEffectItem.SpreadRadius}px #${newEffectItem.ColorValue}`
    }
    WBaseDA.edit(listUpdate, EnumObj.effect)
  } else {
    let pWbComponent = listUpdate[0].value.closest(
      `.wbaseItem-value[iswini="true"]`
    )
    let cssItem = StyleDA.cssStyleSheets.find(e => e.GID === pWbComponent.id)
    for (let wb of [...listUpdate]) {
      let cssRule = StyleDA.docStyleSheets.find(e =>
        [...divSection.querySelectorAll(e.selectorText)].includes(wb.value)
      )
      cssRule.style.boxShadow = `${newEffectItem.OffsetX}px ${newEffectItem.OffsetY}px ${newEffectItem.BlurRadius}px ${newEffectItem.SpreadRadius}px #${newEffectItem.ColorValue}`
      cssItem.Css = cssItem.Css.replace(
        new RegExp(`${cssRule.selectorText} {[^}]*}`, 'g'),
        cssRule.cssText
      )
    }
    StyleDA.editStyleSheet(cssItem)
  }
}

function deleteEffect () {
  let listUpdate = selected_list.filter(wb =>
    EnumCate.accept_border_effect.some(ct => wb.CateID === ct)
  )
  if (listUpdate[0].StyleItem) {
    for (let wb of [...listUpdate]) {
      wb.StyleItem.DecorationItem.EffectID = null
      wb.StyleItem.DecorationItem.EffectItem = null
      wb.value.style.boxShadow = null
      wb.value.style.filter = null
    }
    WBaseDA.edit(listUpdate, EnumObj.decoration)
  } else {
    let pWbComponent = listUpdate[0].value.closest(
      `.wbaseItem-value[iswini="true"]`
    )
    let cssItem = StyleDA.cssStyleSheets.find(e => e.GID === pWbComponent.id)
    for (let wb of [...listUpdate]) {
      let cssRule = StyleDA.docStyleSheets.find(e =>
        [...divSection.querySelectorAll(e.selectorText)].includes(wb.value)
      )
      cssRule.style.boxShadow = null
      cssRule.style.filter = null
      cssItem.Css = cssItem.Css.replace(
        new RegExp(`${cssRule.selectorText} {[^}]*}`, 'g'),
        cssRule.cssText
      )
    }
    StyleDA.editStyleSheet(cssItem)
  }
}

function handleEditEffect ({
  effectSkin,
  offX,
  offY,
  color,
  spreadRadius,
  blurRadius,
  type,
  onSubmit = true
}) {
  let listUpdate = selected_list.filter(
    wb =>
      EnumCate.accept_border_effect.some(ct => wb.CateID === ct) &&
      (effectSkin ||
        window.getComputedStyle(wb.value).boxShadow !== 'none' ||
        window.getComputedStyle(wb.value).filter !== 'none')
  )
  if (effectSkin) {
    if (listUpdate[0].StyleItem) {
      for (let wb of [...listUpdate]) {
        wb.StyleItem.DecorationItem.EffectID = effectSkin.GID
        wb.StyleItem.DecorationItem.EffectItem = effectSkin
        if (effectSkin.Type == ShadowType.layer_blur) {
          wb.value.style.filter = `var(--effect-blur-${effectSkin.GID})`
        } else {
          wb.value.style.boxShadow = `var(--effect-shadow-${effectSkin.GID})`
        }
      }
      WBaseDA.edit(listUpdate, EnumObj.decoration)
    } else {
      let pWbComponent = listUpdate[0].value.closest(
        `.wbaseItem-value[iswini="true"]`
      )
      let cssItem = StyleDA.cssStyleSheets.find(e => e.GID === pWbComponent.id)
      for (let wb of [...listUpdate]) {
        let cssRule = StyleDA.docStyleSheets.find(e =>
          [...divSection.querySelectorAll(e.selectorText)].includes(wb.value)
        )
        if (effectSkin.Type == ShadowType.layer_blur) {
          cssRule.style.filter = `var(--effect-blur-${effectSkin.GID})`
        } else {
          cssRule.style.boxShadow = `var(--effect-shadow-${effectSkin.GID})`
        }
        cssItem.Css = cssItem.Css.replace(
          new RegExp(`${cssRule.selectorText} {[^}]*}`, 'g'),
          cssRule.cssText
        )
      }
      StyleDA.editStyleSheet(cssItem)
    }
  } else if (color) {
    if (listUpdate[0].StyleItem) {
      for (let wb of [...listUpdate]) {
        wb.StyleItem.DecorationItem.EffectItem.ColorValue = color
        wb.value.style.boxShadow = wb.value.style.boxShadow.replace(
          /(rgba|rgb)\(.*\)/g,
          `#${color}`
        )
      }
      if (onSubmit) WBaseDA.edit(listUpdate, EnumObj.decoration)
    } else {
      let pWbComponent = listUpdate[0].value.closest(
        `.wbaseItem-value[iswini="true"]`
      )
      let cssItem = StyleDA.cssStyleSheets.find(e => e.GID === pWbComponent.id)
      for (let wb of [...listUpdate]) {
        let cssRule = StyleDA.docStyleSheets.find(e =>
          [...divSection.querySelectorAll(e.selectorText)].includes(wb.value)
        )
        cssRule.style.boxShadow = cssRule.style.boxShadow.replace(
          /(rgba|rgb)\(.*\)/g,
          `#${color}`
        )
        cssItem.Css = cssItem.Css.replace(
          new RegExp(`${cssRule.selectorText} {[^}]*}`, 'g'),
          cssRule.cssText
        )
      }
      if (onSubmit) StyleDA.editStyleSheet(cssItem)
    }
  } else if (offX !== undefined) {
    if (listUpdate[0].StyleItem) {
      for (let wb of [...listUpdate]) {
        wb.StyleItem.DecorationItem.EffectItem.OffsetX = offX
        let wbEffect = wb.StyleItem.DecorationItem.EffectItem
        wb.value.style.boxShadow = `${offX}px ${wbEffect.OffsetY}px ${
          wbEffect.BlurRadius
        }px ${wbEffect.SpreadRadius}px #${wbEffect.ColorValue} ${
          wbEffect.Type == ShadowType.inner ? 'inset' : ''
        }`
      }
      WBaseDA.edit(listUpdate, EnumObj.decoration)
    } else {
      let pWbComponent = listUpdate[0].value.closest(
        `.wbaseItem-value[iswini="true"]`
      )
      let cssItem = StyleDA.cssStyleSheets.find(e => e.GID === pWbComponent.id)
      for (let wb of [...listUpdate]) {
        let cssRule = StyleDA.docStyleSheets.find(e =>
          [...divSection.querySelectorAll(e.selectorText)].includes(wb.value)
        )
        let effectColor = cssRule.style.boxShadow.match(/(rgba|rgb)\(.*\)/g)[0]
        let props = cssRule.style.boxShadow
          .replace(effectColor, '')
          .trim()
          .split(' ')
        props[0] = `${offX}px`
        cssRule.style.boxShadow = effectColor + ' ' + props.join(' ')
        cssItem.Css = cssItem.Css.replace(
          new RegExp(`${cssRule.selectorText} {[^}]*}`, 'g'),
          cssRule.cssText
        )
      }
      StyleDA.editStyleSheet(cssItem)
    }
  } else if (offY !== undefined) {
    if (listUpdate[0].StyleItem) {
      for (let wb of [...listUpdate]) {
        wb.StyleItem.DecorationItem.EffectItem.OffsetY = offY
        let wbEffect = wb.StyleItem.DecorationItem.EffectItem
        wb.value.style.boxShadow = `${wbEffect.OffsetX}px ${offY}px ${
          wbEffect.BlurRadius
        }px ${wbEffect.SpreadRadius}px #${wbEffect.ColorValue} ${
          wbEffect.Type == ShadowType.inner ? 'inset' : ''
        }`
      }
      WBaseDA.edit(listUpdate, EnumObj.decoration)
    } else {
      let pWbComponent = listUpdate[0].value.closest(
        `.wbaseItem-value[iswini="true"]`
      )
      let cssItem = StyleDA.cssStyleSheets.find(e => e.GID === pWbComponent.id)
      for (let wb of [...listUpdate]) {
        let cssRule = StyleDA.docStyleSheets.find(e =>
          [...divSection.querySelectorAll(e.selectorText)].includes(wb.value)
        )
        let effectColor = cssRule.style.boxShadow.match(/(rgba|rgb)\(.*\)/g)[0]
        let props = cssRule.style.boxShadow
          .replace(effectColor, '')
          .trim()
          .split(' ')
        props[1] = `${offY}px`
        cssRule.style.boxShadow = effectColor + ' ' + props.join(' ')
        cssItem.Css = cssItem.Css.replace(
          new RegExp(`${cssRule.selectorText} {[^}]*}`, 'g'),
          cssRule.cssText
        )
      }
      StyleDA.editStyleSheet(cssItem)
    }
  } else if (spreadRadius !== undefined) {
    if (listUpdate[0].StyleItem) {
      for (let wb of [...listUpdate]) {
        wb.StyleItem.DecorationItem.EffectItem.SpreadRadius = spreadRadius
        let wbEffect = wb.StyleItem.DecorationItem.EffectItem
        wb.value.style.boxShadow = `${wbEffect.OffsetX}px ${
          wbEffect.OffsetY
        }px ${wbEffect.BlurRadius}px ${spreadRadius}px #${
          wbEffect.ColorValue
        } ${wbEffect.Type == ShadowType.inner ? 'inset' : ''}`
      }
      WBaseDA.edit(listUpdate, EnumObj.decoration)
    } else {
      let pWbComponent = listUpdate[0].value.closest(
        `.wbaseItem-value[iswini="true"]`
      )
      let cssItem = StyleDA.cssStyleSheets.find(e => e.GID === pWbComponent.id)
      for (let wb of [...listUpdate]) {
        let cssRule = StyleDA.docStyleSheets.find(e =>
          [...divSection.querySelectorAll(e.selectorText)].includes(wb.value)
        )
        let effectColor = cssRule.style.boxShadow.match(/(rgba|rgb)\(.*\)/g)[0]
        let props = cssRule.style.boxShadow
          .replace(effectColor, '')
          .trim()
          .split(' ')
        props[3] = `${spreadRadius}px`
        cssRule.style.boxShadow = effectColor + ' ' + props.join(' ')
        cssItem.Css = cssItem.Css.replace(
          new RegExp(`${cssRule.selectorText} {[^}]*}`, 'g'),
          cssRule.cssText
        )
      }
      StyleDA.editStyleSheet(cssItem)
    }
  } else if (blurRadius !== undefined) {
    if (listUpdate[0].StyleItem) {
      for (let wb of [...listUpdate]) {
        wb.StyleItem.DecorationItem.EffectItem.BlurRadius = blurRadius
        let wbEffect = wb.StyleItem.DecorationItem.EffectItem
        if (wbEffect.Type === ShadowType.layer_blur) {
          wb.value.style.filter = `blur(${blurRadius}px)`
        } else {
          wb.value.style.boxShadow = `${wbEffect.OffsetX}px ${
            wbEffect.OffsetY
          }px ${blurRadius}px ${wbEffect.spreadRadius}px #${
            wbEffect.ColorValue
          } ${wbEffect.Type == ShadowType.inner ? 'inset' : ''}`
        }
      }
      WBaseDA.edit(listUpdate, EnumObj.decoration)
    } else {
      let pWbComponent = listUpdate[0].value.closest(
        `.wbaseItem-value[iswini="true"]`
      )
      let cssItem = StyleDA.cssStyleSheets.find(e => e.GID === pWbComponent.id)
      for (let wb of [...listUpdate]) {
        let cssRule = StyleDA.docStyleSheets.find(e =>
          [...divSection.querySelectorAll(e.selectorText)].includes(wb.value)
        )
        if (cssRule.style.filter?.length > 0) {
          cssRule.style.filter = `blur(${blurRadius}px)`
        } else {
          let effectColor =
            cssRule.style.boxShadow.match(/(rgba|rgb)\(.*\)/g)[0]
          let props = cssRule.style.boxShadow
            .replace(effectColor, '')
            .trim()
            .split(' ')
          props[2] = `${blurRadius}px`
          cssRule.style.boxShadow = effectColor + ' ' + props.join(' ')
        }
        cssItem.Css = cssItem.Css.replace(
          new RegExp(`${cssRule.selectorText} {[^}]*}`, 'g'),
          cssRule.cssText
        )
      }
      StyleDA.editStyleSheet(cssItem)
    }
  } else if (type) {
    switch (type) {
      case ShadowType.layer_blur:
        if (listUpdate[0].StyleItem) {
          for (let wb of [...listUpdate]) {
            wb.StyleItem.DecorationItem.EffectItem.Type = type
            wb.value.style.filter = `blur(${wb.StyleItem.DecorationItem.EffectItem.BlurRadius}px)`
            wb.value.style.boxShadow = null
          }
          WBaseDA.edit(listUpdate, EnumObj.decoration)
        } else {
          let pWbComponent = listUpdate[0].value.closest(
            `.wbaseItem-value[iswini="true"]`
          )
          let cssItem = StyleDA.cssStyleSheets.find(
            e => e.GID === pWbComponent.id
          )
          for (let wb of [...listUpdate]) {
            let cssRule = StyleDA.docStyleSheets.find(e =>
              [...divSection.querySelectorAll(e.selectorText)].includes(
                wb.value
              )
            )
            if (cssRule.style.filter === '') {
              let effectColor =
                cssRule.style.boxShadow.match(/(rgba|rgb)\(.*\)/g)[0]
              let props = cssRule.style.boxShadow
                .replace(effectColor, '')
                .trim()
                .split(' ')
              cssRule.style.filter = `blur(${props[2]})`
              cssRule.style.boxShadow = null
              cssItem.Css = cssItem.Css.replace(
                new RegExp(`${cssRule.selectorText} {[^}]*}`, 'g'),
                cssRule.cssText
              )
            }
          }
          StyleDA.editStyleSheet(cssItem)
        }
        break
      default:
        if (listUpdate[0].StyleItem) {
          for (let wb of [...listUpdate]) {
            wb.StyleItem.DecorationItem.EffectItem.Type = type
            wb.value.style.filter = null
            wb.value.style.boxShadow = `${wbEffect.OffsetX}px ${
              wbEffect.OffsetY
            }px ${wbEffect.BlurRadius}px ${wbEffect.spreadRadius}px #${
              wbEffect.ColorValue
            } ${wbEffect.Type === ShadowType.inner ? 'inset' : ''}`
          }
          WBaseDA.edit(listUpdate, EnumObj.decoration)
        } else {
          let pWbComponent = listUpdate[0].value.closest(
            `.wbaseItem-value[iswini="true"]`
          )
          let cssItem = StyleDA.cssStyleSheets.find(
            e => e.GID === pWbComponent.id
          )
          for (let wb of [...listUpdate]) {
            let cssRule = StyleDA.docStyleSheets.find(e =>
              [...divSection.querySelectorAll(e.selectorText)].includes(
                wb.value
              )
            )
            if (cssRule.style.filter.length > 0) {
              let blurValue = cssRule.style.filter.replace(/(blur\(|\))/g, '')
              cssRule.style.filter = null
              cssRule.style.boxShadow = `0px 4px ${blurValue} 0px #00000040`
              cssItem.Css = cssItem.Css.replace(
                new RegExp(`${cssRule.selectorText} {[^}]*}`, 'g'),
                cssRule.cssText
              )
            }
          }
          StyleDA.editStyleSheet(cssItem)
        }
        break
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
