function initDOM (list) {
  list.forEach(e => {
    e.value = document.createElement('div')
    e.value.id = e.GID
    if (e.IsWini && !e.CopyID) e.value.setAttribute('iswini', 'true')
  })
  let sortItems = []
  let newList = []
  list.forEach(e => {
    if (e.ParentID === wbase_parentID) {
      e.Level = 1
    } else {
      let parent = list.find(eP => eP.GID === e.ParentID)
      if (parent) {
        sortItems.push(e)
        parent.value.appendChild(e.value)
      } else {
        if (wbase_list.length > 0) {
          parent = document.getElementById(e.ParentID)
          if (parent) e.Level = parseInt(parent.getAttribute('level')) + 1
        }
        if (!parent) {
          e.ParentID = wbase_parentID
          e.Level = 1
        }
      }
    }
    newList.push(e)
  })
  sortItems.forEach(e => {
    e.Level =
      [...$(e.value).parents('div')].map(eP => {
        if (eP.getAttribute('iswini') && !e.IsWini) {
          delete e.CopyID
          delete e.ChildID
        }
        return eP.id
      }).length + 1
  })
  return newList
}

function initComponents (wb, children) {
  if (wb.AttributesItem.Json) {
    wb.JsonItem = JSON.parse(wb.AttributesItem.Json)
  }
  if (wb.AttributesItem.JsonEvent) {
    wb.JsonEventItem = JSON.parse(wb.AttributesItem.JsonEvent)
  }
  if (wb.AttributesItem.Variables) {
    wb.VariablesData = JSON.parse(wb.AttributesItem.Variables)
  }
  // if (wb.IsWini) {
  //   if (wb.ListClassName.includes('w-variant')) {
  //     wb.PropertyItems = PropertyDA.list.filter(e => e.BaseID == wb.GID)
  //     for (let property of wb.PropertyItems) {
  //       property.BasePropertyItems = property.BasePropertyItems.filter(e =>
  //         wb.ListChildID.some(id => id === e.BaseID)
  //       )
  //     }
  //   } else {
  //     let listBaseProperty = PropertyDA.list.map(e => e.BasePropertyItems)
  //     if (listBaseProperty.length > 0) {
  //       wb.BasePropertyItems = listBaseProperty
  //         .reduce((a, b) => a.concat(b))
  //         .filter(e => e.BaseID === wb.GID)
  //     } else {
  //       wb.BasePropertyItems = []
  //     }
  //   }
  // }
  switch (wb.ListClassName.split(' ')[1]) {
    case 'w-container':
      children ??= wbase_list.filter(e => e.ParentID === wb.GID)
      createContainerHTML(wb, children)
      break
    case 'w-form':
      children ??= wbase_list.filter(e => e.ParentID === wb.GID)
      createContainerHTML(wb, children)
      break
    case 'w-variant':
      children ??= wbase_list.filter(e => e.ParentID === wb.GID)
      createVariantHTML(wb, children)
      break
    case 'w-text':
      createTextHTML(wb)
      break
    case 'w-textfield':
      createTextFieldHTML(wb)
      break
    case 'w-textformfield':
      children ??= wbase_list.filter(e => e.ParentID === wb.GID)
      createTextFormFieldHTML(wb, children)
      break
    case 'w-switch':
      createSwitchHTML(wb)
      break
    case 'w-svg':
      createIconHTML(wb)
      break
    case 'w-checkbox':
      createCheckBoxHTML(wb)
      break
    case 'w-radio':
      createRadioHTML(wb)
      break
    // case EnumCate.progress_bar:
    //   createProgressBarHTML(item)
    //   break
    case 'w-button':
      children ??= wbase_list.filter(e => e.ParentID === wb.GID)
      wbutton(wb, children)
      break
    case 'w-table':
      if (wb.AttributesItem.Content != '')
        wb.TableRows = JSON.parse(wb.AttributesItem.Content)
      createTableHTML(wb, list)
      break
    // case EnumCate.datePicker:
    //   createDatePickerHTML(item)
    //   break
    // case EnumCate.chart:
    //   if (item.AttributesItem.Content != '')
    //     item.ChartData = JSON.parse(item.AttributesItem.Content)
    //   createChartHTML(item)
    //   break
    default:
      wb.value = document.createElement('div')
      break
  }
  // if (
  //   item.AttributesItem.NameField &&
  //   item.AttributesItem.NameField.trim() != ''
  // )
  // $(item.value).attr('name-field', item.AttributesItem.NameField)
  //
  wb.value.id = wb.GID
  wb.value.className = wb.ListClassName
  wb.value.setAttribute('level', wb.Level)
  //
  wb.value.setAttribute('parentid', wb.ParentID)
  if (wb.IsWini) {
    wb.value.setAttribute('iswini', wb.IsWini)
  } else if (
    [...wb.value.classList].some(cls => cls.startsWith('w-st0')) &&
    wb.CopyID
  ) {
    wb.value.setAttribute('isinstance', true)
    wb.IsInstance = true
  }
  if (wb.Css?.length > 0) {
    wb.value.style = wb.Css
    setAttributeByStyle(wb.value)
  }
  // if (wb.IsInstance && children?.length > 0) {
  //   if (wb.value.classList.contains('w-stack')) {
  //     for (let i = 0; i < children.length; i++)
  //       children[i].value.style.zIndex = i
  //   } else {
  //     for (let i = 0; i < children.length; i++)
  //       children[i].value.style.order = i
  //   }
  // }
}

function setAttributeByStyle (wbHTML, cssRule) {
  cssRule ??= wbHTML.style
  for (let stProp of cssRule) {
    switch (stProp) {
      case 'width':
        switch (cssRule[stProp]) {
          case '100%':
            wbHTML.setAttribute('width-type', 'fill')
            break
          case 'fit-content':
            wbHTML.setAttribute('width-type', 'fit')
            break
          case 'max-content':
            wbHTML.setAttribute('width-type', 'fit')
            break
          default:
            wbHTML.removeAttribute('width-type')
            break
        }
        break
      case 'height':
        switch (cssRule[stProp]) {
          case '100%':
            wbHTML.setAttribute('height-type', 'fill')
            break
          case 'fit-content':
            wbHTML.setAttribute('height-type', 'fit')
            break
          default:
            wbHTML.removeAttribute('height-type')
            break
        }
        break
      case 'left':
        if (cssRule[stProp].includes('calc')) {
          wbHTML.setAttribute('constX', Constraints.center)
        } else if (cssRule[stProp].includes('%')) {
          wbHTML.setAttribute('constX', Constraints.scale)
        } else if (cssRule['right']) {
          wbHTML.setAttribute('constX', Constraints.left_right)
        } else {
          wbHTML.setAttribute('constX', Constraints.left)
        }
        break
      case 'right':
        if (!cssRule['left']) {
          wbHTML.setAttribute('constX', Constraints.right)
        }
        break
      case 'top':
        if (cssRule[stProp].includes('calc')) {
          wbHTML.setAttribute('constY', Constraints.center)
        } else if (cssRule[stProp].includes('%')) {
          wbHTML.setAttribute('constY', Constraints.scale)
        } else if (cssRule['bottom']) {
          wbHTML.setAttribute('constY', Constraints.top_bottom)
        } else {
          wbHTML.setAttribute('constY', Constraints.top)
        }
        break
      case 'bottom':
        if (!cssRule['top']) {
          wbHTML.setAttribute('constY', Constraints.bottom)
        }
        break
      case 'flex-wrap':
        if (cssRule[stProp] === 'wrap') {
          wbHTML.setAttribute('wrap', 'wrap')
        }
        break
      case 'overflow':
        if (cssRule[stProp] === 'scroll') {
          wbHTML.setAttribute('scroll', 'true')
        }
        break
      default:
        break
    }
  }
  if (cssRule.width === '') wbHTML.setAttribute('width-type', 'fit')
  if (cssRule.height === '') wbHTML.setAttribute('height-type', 'fit')
}

const resizeWbase = new ResizeObserver(entries => {
  entries.forEach(entry => {
    let framePage = entry.target
    let localResponsive =
      ProjectDA.obj.ResponsiveJson ?? ProjectDA.responsiveJson
    let brpShortName = localResponsive.BreakPoint.map(brp =>
      brp.Key.match(brpRegex).pop().replace(/[()]/g, '')
    )
    let listClass = [...framePage.classList].filter(clName =>
      [...brpShortName, 'min-brp'].every(brpKey => clName != brpKey)
    )
    let closestBrp = localResponsive.BreakPoint.filter(
      brp => framePage.offsetWidth >= brp.Width
    )
    if (closestBrp.length > 0) {
      closestBrp = closestBrp
        .pop()
        .Key.match(brpRegex)
        .pop()
        .replace(/[()]/g, '')
      listClass.push(closestBrp)
    } else {
      listClass.push('min-brp')
    }
    framePage.className = listClass.join(' ')
  })
})

function getWBaseOffset (wb) {
  let leftValue
  let topValue
  if (wb.ParentID === wbase_parentID) {
    leftValue = Math.round(
      parseFloat(`${wb.value.style.left}`.replace('px', '')).toFixed(2)
    )
    topValue = Math.round(
      parseFloat(`${wb.value.style.top}`.replace('px', '')).toFixed(2)
    )
  } else {
    leftValue = Math.round(
      (wb.value.getBoundingClientRect().x -
        document.getElementById(wb.ParentID).getBoundingClientRect().x) /
        scale
    ).toFixed(2)
    topValue = Math.round(
      (wb.value.getBoundingClientRect().y -
        document.getElementById(wb.ParentID).getBoundingClientRect().y) /
        scale
    ).toFixed(2)
  }
  return { x: parseFloat(leftValue), y: parseFloat(topValue) }
}

async function callAPI (request) {
  var listParam = InputDA.list.filter(
    e => e.APIID == request.ID && e.Type == enumTypeInput.param
  )
  var listHeader = InputDA.list.filter(
    e => e.APIID == request.ID && e.Type == enumTypeInput.header
  )
  var listBody = InputDA.list.filter(
    e => e.APIID == request.ID && e.Type == enumTypeInput.body
  )

  let requestUrl = handleRequestUrl(request, listParam)
  let headers = handleListInput(listHeader)
  let contentType = 'content-Type'
  headers[contentType] = 'application/json'
  let body = handleListInput(listBody)

  var response
  if (request.Type == 1) {
    response = await post(requestUrl, headers, body)
  } else {
    response = await get(requestUrl, headers)
  }

  return response
}

function addStyleComponents (item, elements) {
  if (item.IsWini == true) {
    elements.setAttribute('class', item.StyleItem.Name)
  }
}

function handleListInput (listInput) {
  let _obj = {}
  listInput.forEach(function (item) {
    let name = item.Name
    _obj[name] = item.Value
  })
  return _obj
}

function handleRequestUrl (request, listParam) {
  let param = ''
  listParam.forEach(function (e) {
    if (e.Name != null && e.Name != '') {
      param.concat(e.Name + '=' + e.value + '&')
    }
  })
  var requestUrl = request.Url
  if (param != '') {
    requestUrl = requestUrl + '?' + param.slice(0, -1)
  }
  return requestUrl
}

class enumTypeInput {
  static param = 1
  static header = 2
  static body = 3
}

function wMainAxis (key, isHorizontal) {
  if (isHorizontal == null) {
    if (key.includes('Left')) {
      return '-webkit-left'
    } else if (key.includes('Right')) {
      return '-webkit-right'
    } else {
      return '-webkit-center'
    }
  } else if (isHorizontal) {
    if (key.includes('Left')) {
      return 'start'
    } else if (key.includes('Right')) {
      return 'end'
    } else if (key.includes('SpaceBetween')) {
      return 'space-between'
    } else {
      return 'center'
    }
  } else {
    if (key.includes('Top')) {
      return 'start'
    } else if (key.includes('Bottom')) {
      return 'end'
    } else if (key.includes('SpaceBetween')) {
      return 'space-between'
    } else {
      return 'center'
    }
  }
}

function wCrossAxis (key, isHorizontal) {
  if (isHorizontal == undefined) {
    if (key.includes('Top')) {
      return 'top'
    } else if (key.includes('Bottom')) {
      return 'bottom'
    } else {
      return 'middle'
    }
  } else if (isHorizontal) {
    if (key.includes('Top')) {
      return 'start'
    } else if (key.includes('Bottom')) {
      return 'end'
    } else {
      return 'center'
    }
  } else {
    if (key.includes('Left')) {
      return 'start'
    } else if (key.includes('Right')) {
      return 'end'
    } else {
      return 'center'
    }
  }
}

function mainAxisToAlign (key, isHorizontal) {
  if (isHorizontal == null) {
    switch (key) {
      case '-webkit-left':
        return 'Left'
      case '-webkit-right':
        return 'Right'
      default: // '-webkit-center'
        return 'Center'
    }
  } else if (isHorizontal) {
    switch (key) {
      case 'start':
        return 'Left'
      case 'end':
        return 'Right'
      case 'space-between':
        return 'SpaceBetween'
      default:
        return 'Center'
    }
  } else {
    switch (key) {
      case 'start':
        return 'Top'
      case 'end':
        return 'Bottom'
      case 'space-between':
        return 'SpaceBetween'
      default:
        return 'Center'
    }
  }
}

function crossAxisToAlign (key, isHorizontal) {
  if (isHorizontal == undefined) {
    switch (key) {
      case 'top':
        return 'Top'
      case 'bottom':
        return 'Bottom'
      default: // 'middle'
        return 'Center'
    }
  } else if (isHorizontal) {
    switch (key) {
      case 'start':
        return 'Top'
      case 'end':
        return 'Bottom'
      default:
        return 'Center'
    }
  } else {
    switch (key) {
      case 'start':
        return 'Left'
      case 'end':
        return 'Right'
      default:
        return 'Center'
    }
  }
}
