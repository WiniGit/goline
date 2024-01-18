// khai báo biến ứng vs các view
var left_view = document.getElementById('left_view')
var right_view = document.getElementById('right_view')
var layer_view = document.getElementById('Layer')
var assets_view = document.getElementById('Assets')
var design_view = document.getElementById('Design')
var prototype_view = document.getElementById('Prototype')
var state_view = document.getElementById('State')

async function initData() {
  WiniIO.emitInit()
  console.log('init: ', Date.now())
  console.log('get server: ', Date.now())
  listShowName = []
  action_list = []
  action_index = -1
  divSection.replaceChildren()
  let wbaseResponse = await WBaseDA.apiGetInitWbase()
  StyleDA.initSkin(ProjectDA.obj.ID).then(skinResponse => {
    CateDA.initCate()
    StyleDA.listSkin = skinResponse
    StyleDA.listSkin.forEach(skin => {
      document.documentElement.style.setProperty(`--${skin.GID}`, skin.Css)
    })
  })
  // PropertyDA.list = skinResponse.Data.WPropertyItems
  console.log('get server done: ', Date.now())
  wbase_list = []
  wbase_list = initDOM(wbaseResponse)
  parent = divSection
  selected_list = []
  updateHoverWbase()
  arrange()
  $.get(WBaseDA.base_item_url, function (baseComponentResponse) {
    base_component_list = baseComponentResponse.Data
    console.log('base component:', base_component_list)
    base_component_list = initDOM(base_component_list)
  })
  console.log('in handle data: ', Date.now())
  for (let wb of wbase_list) {
    wb.value = null
    initComponents(wb)
    if (wb.Level === 1) divSection.appendChild(wb.value)
  }
  StyleDA.docStyleSheets.forEach(cssRuleItem => {
    if (cssRuleItem.style.length > 0) {
      divSection
        .querySelectorAll(cssRuleItem.selectorText)
        .forEach(wbHTML => setAttributeByStyle(wbHTML, cssRuleItem.style))
    }
  })
  divSection
    .querySelectorAll('.wbaseItem-value[isinstance][class*="w-st0"]')
    .forEach(wbHTML => setAttributeByStyle(wbHTML))
  console.log('out handle data: ', Date.now())
  centerViewInitListener()
  if (PageDA.obj.scale !== undefined) {
    topx = PageDA.obj.topx
    leftx = PageDA.obj.leftx
    scale = PageDA.obj.scale
    divSection.style.top = topx + 'px'
    divSection.style.left = leftx + 'px'
    divSection.style.transform = `scale(${scale}, ${scale})`
    input_scale_set(scale * 100)
    positionScrollLeft()
    positionScrollTop()
  } else {
    initScroll(
      wbase_list
        .filter(m => m.ParentID === wbase_parentID)
        .map(m => m.StyleItem)
    )
  }
  document.getElementById('body').querySelector('.loading-view').remove()
  setupRightView()
  setupLeftView()
  document
    .getElementById('btn_select_page')
    .querySelector(':scope > p').innerHTML = PageDA.obj.Name
  console.log('show done: ', Date.now())
  setTimeout(function () {
    toolStateChange(ToolState.move)
  }, 80)
}

function input_scale_set(value) {
  settingsPage = true
  input_scale.innerHTML = `${Math.floor(value)}%`
}

function toolStateChange(toolState) {
  if (tool_state != toolState) {
    if (
      ToolState.resize_type.every(
        tool => tool !== toolState && tool_state !== tool
      )
    ) {
      let current_tool_state = document.getElementById(`${tool_state}`)
      $(current_tool_state).removeClass('on-select')
      let new_tool_state = document.getElementById(`${toolState}`)
      $(new_tool_state).addClass('on-select')
    }
    tool_state = toolState
    switch (tool_state) {
      case ToolState.move:
        document.getElementById('canvas_view').style.cursor = 'context-menu'
        break
      case ToolState.hand_tool:
        document.getElementById('canvas_view').style.cursor = 'grab'
        break
      case ToolState.resize_left:
        document.getElementById('canvas_view').style.cursor = 'e-resize'
        break
      case ToolState.resize_right:
        document.getElementById('canvas_view').style.cursor = 'e-resize'
        break
      case ToolState.resize_top:
        document.getElementById('canvas_view').style.cursor = 'n-resize'
        break
      case ToolState.resize_bot:
        document.getElementById('canvas_view').style.cursor = 'n-resize'
        break
      case ToolState.resize_top_left:
        document.getElementById('canvas_view').style.cursor = 'nw-resize'
        break
      case ToolState.resize_top_right:
        document.getElementById('canvas_view').style.cursor = 'ne-resize'
        break
      case ToolState.resize_bot_left:
        document.getElementById('canvas_view').style.cursor = 'ne-resize'
        break
      case ToolState.resize_bot_right:
        document.getElementById('canvas_view').style.cursor = 'nw-resize'
        break
      default:
        if (ToolState.create_new_type.some(tool => tool_state === tool)) {
          document.getElementById('canvas_view').style.cursor = 'cell'
        } else {
          document.getElementById('canvas_view').style.cursor = 'context-menu'
        }
        break
    }
  }
  if (
    [ToolState.hand_tool, ...ToolState.create_new_type].some(
      tool => tool_state == tool
    )
  ) {
    handleWbSelectedList()
    listLine = []
    listText = []
    updateHoverWbase()
  }
}

function createNewWbase({ wb, relativeWbs = [], level }) {
  let list_new_wbase = []
  let newWb = JSON.parse(JSON.stringify(wb))
  newWb.GID = uuidv4()
  // newWb.ChildID = wb.GID
  newWb.IsWini = false
  newWb.BasePropertyItems = null
  newWb.PropertyItems = null
  newWb.value = null
  newWb.ProtoType = null
  newWb.PrototypeID = null
  newWb.Level = level
  if (newWb.JsonEventItem)
    newWb.JsonEventItem = newWb.JsonEventItem.filter(e => e.Name === 'State')
  // tạo GuiID mới cho AttributesItem nếu khác null
  if (newWb.AttributesItem) {
    let newAttributeId = uuidv4()
    newWb.AttributeID = newAttributeId
    newWb.AttributesItem.GID = newAttributeId
    if (newWb.JsonEventItem)
      newWb.AttributesItem.JsonEvent = JSON.stringify(newWb.JsonEventItem)
  }
  if (newWb.ListChildID?.length > 0) {
    let list_child = []
    list_child = list_contain_child.filter(e =>
      wb.ListChildID.some(id => e.GID == id)
    )
    if (list_child.length == 0 && wb.ListChildID.length > 0)
      list_child = assets_list.filter(e =>
        wb.ListChildID.some(id => e.GID == id)
      )

    for (let child of list_child) {
      let new_children = createNewWbase({
        wb: child,
        relativeWbs: relativeWbs,
        level: newWb.Level + 1,
        sort: list_child.indexOf(child)
      })
      list_new_wbase.push(...new_children)
      switch (newWb.ListClassName.includes('w-table')) {
        case EnumCate.table:
          newWb.AttributesItem.Content = newWb.AttributesItem.Content.replace(
            child.GID,
            new_children.find(e => e.ParentID === newWb.GID).GID
          )
          break
        default:
          break
      }
    }
    let new_list_child = list_new_wbase.filter(e => e.ParentID == newWb.GID)
    newWb.ListChildID = new_list_child.map(e => e.GID)
  }
  newWb.PageID = PageDA.obj.ID
  list_new_wbase.push(newWb)
  list_new_wbase.sort((a, b) => b.Level - a.Level)
  return list_new_wbase
}

//! .................................................................................................
function createWbaseHTML({ parentid, x, y, w, h, newObj }) {
  WBaseDA.listData = []
  if (newObj) {
    var new_obj = newObj
  } else {
    switch (tool_state) {
      case ToolState.rectangle:
        new_obj = WbClass.rectangle
        break
      case ToolState.container:
        new_obj = WbClass.container
        break
      case ToolState.text:
        new_obj = WbClass.text
        break
      case ToolState.base_component:
        let thisBaseComponent = base_component_list.find(
          baseCom =>
            baseCom.ParentID === wbase_parentID &&
            baseCom.CateID == $('#choose-component-popup').attr('cateid')
        )
        if (thisBaseComponent)
          new_obj = JSON.parse(JSON.stringify(thisBaseComponent))
        else {
          toolStateChange(ToolState.move)
          return
        }
        break
      default:
        break
    }
  }
  if (new_obj) {
    new_obj.ParentID = parentid
    let pWbHTML = document.getElementById(parentid) ?? divSection
    if (tool_state === ToolState.base_component) {
      let relativeWbase = base_component_list.filter(baseCom =>
        baseCom.ListID.includes(new_obj.GID)
      )
      let listNewWbase = createNewWbase({
        wb: new_obj,
        relativeWbs: relativeWbase,
        level: parseInt(pWbHTML.getAttribute('level') ?? 0) + 1,
        sort: pWbHTML.querySelectorAll(
          `.wbaseItem-value[level="${parseInt(pWbHTML.getAttribute('level') ?? '0') + 1
          }"]`
        ).length
      })
      listNewWbase.forEach(wbaseItem => {
        initComponents(
          wbaseItem,
          listNewWbase.filter(e => e.ParentID == wbaseItem.GID)
        )
      })
      WBaseDA.listData.push(...listNewWbase)
      new_obj = listNewWbase.pop()
      wbase_list.push(...listNewWbase)
    } else {
      new_obj = createNewWbase({
        wb: new_obj,
        level: parseInt(pWbHTML.getAttribute('level') ?? 0) + 1
      }).pop()
      initComponents(new_obj, [])
      if (!w && tool_state === ToolState.text) {
        new_obj.Css += `width: max-content;`
        new_obj.value.setAttribute('width', 'fit')
        new_obj.value.setAttribute('height', 'fit')
      } else {
        new_obj.Css += `width: ${w ?? 100}px;height: ${h ?? 100}px;`
      }
    }

    if (pWbHTML === divSection || pWbHTML.classList.contains('w-block')) {
      if (pWbHTML.classList.contains('w-block')) {
        let pRect = pWbHTML.getBoundingClientRect()
        new_obj.Css += `left: ${x - offsetScale(pRect.x, 0).x}px;top: ${y - offsetScale(0, pRect.y).y
          }px;`
      } else {
        new_obj.Css += `left: ${x}px;top: ${y}px;`
      }
      new_obj.value.setAttribute('constx', Constraints.left)
      new_obj.value.setAttribute('consty', Constraints.top)
      pWbHTML.appendChild(new_obj.value)
    } else if (pWbHTML.classList.contains('w-table')) {
      var pWb = wbase_list.find(wb => wb.GID === parentid)
      let availableCell = findCell(pWbHTML, {
        pageX: offsetConvertScale(x, 0).x,
        pageY: offsetConvertScale(0, y).y
      })
      availableCell.appendChild(new_obj.value)
      pWb.TableRows.reduce((a, b) => a.concat(b)).find(
        cell => cell.id === availableCell.id
      ).contentid = [...availableCell.childNodes].map(e => e.id).join(',')
    } else {
      let children = [
        ...pWbHTML.querySelectorAll(
          `.wbaseItem-value[level="${new_obj.Level}"]`
        )
      ]
      let isGrid = window.getComputedStyle(pWbHTML).flexWrap == 'wrap'
      if (pWbHTML.classList.contains('w-col')) {
        var zIndex = 0
        if (children.length > 0) {
          let closestHTML = [...children].sort((aHTML, bHTML) => {
            let aRect = aHTML.getBoundingClientRect()
            let bRect = bHTML.getBoundingClientRect()
            let a_center_oy
            let b_center_oy
            if (isGrid) {
              a_center_oy = Math.sqrt(
                Math.pow(x - offsetScale(aRect.x + aRect.width / 2, 0).x, 2) +
                Math.pow(y - offsetScale(0, aRect.y + aRect.height / 2).y, 2)
              )
              b_center_oy = Math.sqrt(
                Math.pow(x - offsetScale(bRect.x + bRect.width / 2, 0).x, 2) +
                Math.pow(y - offsetScale(0, bRect.y + bRect.height / 2).y, 2)
              )
            } else {
              a_center_oy = Math.abs(
                y - offsetScale(0, aRect.y + aRect.height / 2).y
              )
              b_center_oy = Math.abs(
                y - offsetScale(0, bRect.y + bRect.height / 2).y
              )
            }
            return a_center_oy - b_center_oy
          })[0]
          if (isGrid) {
            closestHTML = children.find(
              childHTML =>
                childHTML.getBoundingClientRect().right >=
                offsetConvertScale(x, 0).x
            )
          }
          if (closestHTML) {
            let htmlRect = closestHTML.getBoundingClientRect()
            zIndex = children.indexOf(closestHTML)
            distance = y - offsetScale(0, htmlRect.y + htmlRect.height / 2).y
            if (distance < 0) zIndex--
          } else {
            zIndex = children.length - 1
          }
        }
      } else {
        zIndex = 0
        if (children.length > 0) {
          let closestHTML = [...children].sort((aHTML, bHTML) => {
            let aRect = aHTML.getBoundingClientRect()
            let bRect = bHTML.getBoundingClientRect()
            let a_center_ox
            let b_center_ox
            if (isGrid) {
              a_center_ox = Math.sqrt(
                Math.pow(x - offsetScale(aRect.x + aRect.width / 2, 0).x, 2) +
                Math.pow(y - offsetScale(0, aRect.y + aRect.height / 2).y, 2)
              )
              b_center_ox = Math.sqrt(
                Math.pow(x - offsetScale(bRect.x + bRect.width / 2, 0).x, 2) +
                Math.pow(y - offsetScale(0, bRect.y + bRect.height / 2).y, 2)
              )
            } else {
              a_center_ox = Math.abs(
                x - offsetScale(aRect.x + aRect.width / 2, 0).x
              )
              b_center_ox = Math.abs(
                x - offsetScale(bRect.x + bRect.width / 2, 0).x
              )
            }
            return a_center_ox - b_center_ox
          })[0]
          if (isGrid) {
            closestHTML = children.find(
              childHTML =>
                childHTML.getBoundingClientRect().bottom >=
                offsetConvertScale(0, y).y
            )
          }
          if (closestHTML) {
            let htmlRect = closestHTML.getBoundingClientRect()
            zIndex = children.indexOf(closestHTML)
            distance = x - offsetScale(htmlRect.x + htmlRect.width / 2, 0)
            if (distance < 0) zIndex--
          } else {
            zIndex = children.length - 1
          }
        }
      }
      pWbHTML.replaceChildren(
        ...children.slice(0, zIndex + 1),
        new_obj.value,
        ...children.slice(zIndex + 1)
      )
      new_obj.value.style.order = $(new_obj.value).index()
      wbase_list
        .filter(e => e.ParentID === pWbHTML.id)
        .forEach(e => {
          const newZindex = $(e.value).index()
          if (newZindex != window.getComputedStyle(e.value).order) {
            e.value.style.order = newZindex
            WBaseDA.listData.push(e)
          }
        })
    }
    new_obj.value.style.cssText = new_obj.Css
    wbase_list.push(new_obj)
    arrange()
    replaceAllLyerItemHTML()
  }
  toolStateChange(ToolState.move)
  if (newObj) {
    return new_obj
  } else {
    listRect = [] // xóa tất cả hình vẽ đang tồn tại để hiện thị selectedRect trên canvas
    handleWbSelectedList([new_obj])
    if (new_obj.value.classList.contains('w-text')) {
      new_obj.isNew = true
      new_obj.value.querySelector('span').contentEditable = true
      new_obj.value.querySelector('span').focus()
    } else {
      WBaseDA.enumEvent = EnumEvent.add
    }
    return
  }
}

function arrange(list) {
  if (list) {
    list.sort((a, b) => b.Level - a.Level)
  } else {
    wbase_list.sort((a, b) => b.Level - a.Level)
  }
}

function handleWbSelectedList(newlist = []) {
  newlist = newlist.filter(e => e).slice(0, 10)
  let isChange = false
  left_view
    .querySelectorAll('.layer_wbase_tile.selected')
    .forEach(layerTile => layerTile.classList.remove('selected'))
  selectPath?.remove()
  if (newlist.length > 0) {
    isChange = selected_list.some(oldE => newlist.every(newE => oldE !== newE))
    selected_list = newlist
    let layerTile
    for (let wb of selected_list.reverse()) {
      layerTile = document.getElementById(`wbaseID:${wb.GID}`)
      if (layerTile) layerTile.classList.add('selected')
    }
    ;[...$(layerTile).parents(`.col:has(> .layer_wbase_tile)`)].forEach(e => {
      let layer = e.querySelector('.layer_wbase_tile')
      if (layer !== layerTile) {
        let prefixIcon = layer.querySelector('.prefix-btn')
        if (prefixIcon)
          prefixIcon.className = prefixIcon.className.replace('right', 'down')
      }
    })
    selected_list.sort((a, b) => $(a.value).index() - $(b.value).index())
    select_box_parentID = selected_list[0].ParentID
    let layerSelect = document.getElementById(`wbaseID:${selected_list[0].GID}`)
    let layerParentRect = document
      .getElementById(`parentID:${wbase_parentID}`)
      .getBoundingClientRect()
    if (
      layerSelect &&
      !isInRange(
        layerSelect.getBoundingClientRect().y,
        layerParentRect.y,
        layerParentRect.y + layerParentRect.height,
        true
      )
    ) {
      let scrollToY =
        layerSelect.offsetTop -
        layerSelect.offsetHeight -
        document.getElementById('div_list_page').offsetHeight -
        8
      document.getElementById(`parentID:${wbase_parentID}`).scrollTo({
        top: scrollToY,
        behavior: 'smooth'
      })
    }
  } else {
    selected_list = []
  }
  console.log('isChange: ', isChange)
  if (!objr && tool_state === ToolState.move) {
    if (isChange) {
      console.log('selected_list:', selected_list)
      // if (!WBaseDA.isCtrlZ) {
      //   addAction()
      // }
      if (assets_view.offsetWidth > 0 && tool_state === ToolState.move) {
        const selectedComp = assets_view.querySelector(
          'div[id*="projectID:0"] .list_tile.comp-selected'
        )
        if (selectedComp)
          assets_view.querySelector('.instance-container').replaceChildren()
        updateListComponentByProject({ ID: 0 })
      }
      f12_update_selectWbase()
      $('.wbaseItem-value').removeClass('selected')
    }
    switch (design_view_index) {
      case 0:
        updateUIDesignView()
        break
      case 1:
        update_UI_prototypeView()
        break
      case 2:
        create_stateContainer()
        break
      default:
        break
    }
  }
  updateUISelectBox()
}

function updateUISelectBox() {
  select_box = selectBox(selected_list)
  wdraw()
}

function findCell(table, event) {
  let listCellHTML = [
    ...table.querySelectorAll(':scope > .table-row > .table-cell')
  ]
  let availableCell = listCellHTML.find(cellHTML => {
    let cellRect = cellHTML.getBoundingClientRect()
    cellOffset = offsetScale(cellRect.x, cellRect.y)
    return (
      cellOffset.x <= event.pageX / scale - leftx / scale &&
      cellOffset.x + cellHTML.offsetWidth >=
      event.pageX / scale - leftx / scale &&
      cellOffset.y <= event.pageY / scale - topx / scale &&
      cellOffset.y + cellHTML.offsetHeight >= event.pageY / scale - topx / scale
    )
  })
  return availableCell
}

function dragWbaseUpdate(xp, yp, event) {
  if (alt_list.length > 0) {
    alt_list.forEach(altItem => altItem.value?.remove())
    alt_list = []
  }
  let newPWbHTML = parent
  let new_parentID = newPWbHTML.id.length != 36 ? wbase_parentID : newPWbHTML.id
  if (checkpad === 0) {
    const wbSt0 = selected_list[0].value.closest(
      `.wbaseItem-value[iswini], .wbaseItem-value[isinstance]`
    )
    if (wbSt0) {
      for (let wb of selected_list) {
        let cssRule = StyleDA.docStyleSheets.find(e =>
          [...divSection.querySelectorAll(e.selectorText)].includes(wb.value)
        )
        wb.value.style.cssText = cssRule.style.cssText + wb.value.style.cssText
      }
    }
  }
  if (
    select_box_parentID !== wbase_parentID &&
    select_box_parentID !== new_parentID
  ) {
    document.getElementById(select_box_parentID).removeAttribute('onsort')
  }
  if (
    drag_start_list[0].ParentID !== new_parentID &&
    drag_start_list[0].Level > 1 &&
    drag_start_list[0].ParentID === select_box_parentID
  ) {
    let oldPWbHTML = document.getElementById(select_box_parentID)
    if (oldPWbHTML.childElementCount - selected_list.length === 0) {
      if (oldPWbHTML.getAttribute('width-type') === 'fit') {
        oldPWbHTML.style.width = oldPWbHTML.offsetWidth + 'px'
      }
      if (oldPWbHTML.getAttribute('height-type') === 'fit') {
        oldPWbHTML.style.height = oldPWbHTML.offsetHeight + 'px'
      }
    }
  }
  if (newPWbHTML.classList.contains('w-table')) {
    console.log('table')
    let availableCell = findCell(newPWbHTML, event)
    if (availableCell) {
      let distance = 0
      let cellChildren = [...availableCell.childNodes].filter(eHTML =>
        selected_list.every(e => e.GID !== eHTML.id)
      )
      if (cellChildren.length > 0) {
        cellChildren.sort((aHTML, bHTML) => {
          let aRect = aHTML.getBoundingClientRect()
          let bRect = bHTML.getBoundingClientRect()
          let a_center_oy = Math.abs(event.pageY - (aRect.y + aRect.height / 2))
          let b_center_oy = Math.abs(event.pageY - (bRect.y + bRect.height / 2))
          return a_center_oy - b_center_oy
        })
        let closestHTML = cellChildren[0]
        let htmlRect = closestHTML.getBoundingClientRect()
        distance = event.pageY - (htmlRect.y + htmlRect.height / 2)
      }
      if (drag_start_list[0].ParentID !== new_parentID) {
        selected_list.forEach(e => $(e.value).addClass('drag-hide'))
        let demo = document.createElement('div')
        demo.id = 'demo_auto_layout'
        demo.style.backgroundColor = '#1890FF'
        demo.style.height = `${2.4 / scale}px`
        demo.style.width = `${select_box.w * 0.8}px`
        if (distance < 0) {
          availableCell.replaceChildren(demo, ...cellChildren)
        } else {
          availableCell.replaceChildren(...cellChildren, demo)
        }
      } else {
        selected_list.forEach(e => $(e.value).removeClass('drag-hide'))
        if (distance < 0) {
          availableCell.replaceChildren(
            ...selected_list.map(e => e.value),
            ...cellChildren
          )
        } else {
          availableCell.replaceChildren(
            ...cellChildren,
            ...selected_list.map(e => e.value)
          )
        }
      }
    }
  } else if (
    window.getComputedStyle(newPWbHTML).display.match('flex') &&
    selected_list.some(e => !e.value.classList.contains('fixed-position'))
  ) {
    newPWbHTML.setAttribute('onsort', 'true')
    let children = [
      ...newPWbHTML.querySelectorAll(
        `.wbaseItem-value[level="${parseInt(newPWbHTML.getAttribute('level') ?? '0') + 1
        }"]`
      )
    ].filter(e => selected_list.every(wb => wb.GID !== e.id))
    let isGrid = window.getComputedStyle(newPWbHTML).flexWrap == 'wrap'
    if (newPWbHTML.classList.contains('w-col')) {
      let zIndex = 0
      let distance = 0
      if (children.length > 0) {
        let closestHTML = [...children].sort((aHTML, bHTML) => {
          let aRect = aHTML.getBoundingClientRect()
          let bRect = bHTML.getBoundingClientRect()
          let a_center_oy
          let b_center_oy
          if (isGrid) {
            a_center_oy = Math.sqrt(
              Math.pow(event.pageX - (aRect.x + aRect.width / 2), 2) +
              Math.pow(event.pageY - (aRect.y + aRect.height / 2), 2)
            )
            b_center_oy = Math.sqrt(
              Math.pow(event.pageX - (bRect.x + bRect.width / 2), 2) +
              Math.pow(event.pageY - (bRect.y + bRect.height / 2), 2)
            )
          } else {
            a_center_oy = Math.abs(event.pageY - (aRect.y + aRect.height / 2))
            b_center_oy = Math.abs(event.pageY - (bRect.y + bRect.height / 2))
          }
          return a_center_oy - b_center_oy
        })[0]
        if (isGrid) {
          closestHTML = children.find(
            childHTML => childHTML.getBoundingClientRect().right >= event.pageX
          )
        }
        if (closestHTML) {
          let htmlRect = closestHTML.getBoundingClientRect()
          zIndex = children.indexOf(closestHTML)
          distance = event.pageY - (htmlRect.y + htmlRect.height / 2)
          if (distance < 0) zIndex--
        } else {
          zIndex = children.length - 1
        }
      }
      if (drag_start_list[0].ParentID != new_parentID) {
        selected_list.forEach(e => $(e.value).addClass('drag-hide'))
        var demo = document.getElementById('demo_auto_layout')
        if (!demo) {
          demo = document.createElement('div')
          demo.id = 'demo_auto_layout'
          demo.style.backgroundColor = '#1890FF'
          demo.style.height = `${2.4 / scale}px`
          demo.style.width = `${select_box.w * 0.8}px`
        }
        newPWbHTML.replaceChildren(
          ...children.slice(0, zIndex + 1),
          demo,
          ...children.slice(zIndex + 1)
        )
      } else {
        newPWbHTML.replaceChildren(
          ...children.slice(0, zIndex + 1),
          ...selected_list.map(wb => {
            $(wb.value).removeClass('drag-hide')
            $(wb.value).removeClass('fixed-position')
            wb.value.style.position = null
            wb.value.style.left = null
            wb.value.style.top = null
            wb.value.style.right = null
            wb.value.style.bottom = null
            wb.value.style.transform = null
            wb.value.setAttribute('parentid', new_parentID)
            wb.Level = parseInt(newPWbHTML.getAttribute('level')) + 1
            wb.value.setAttribute('level', wb.Level)
            wb.ParentID = new_parentID
            return wb.value
          }),
          ...children.slice(zIndex + 1)
        )
      }
    } else {
      let zIndex = 0
      let distance = 0
      if (children.length > 0) {
        let closestHTML = [...children].sort((aHTML, bHTML) => {
          let aRect = aHTML.getBoundingClientRect()
          let bRect = bHTML.getBoundingClientRect()
          let a_center_ox
          let b_center_ox
          if (isGrid) {
            a_center_ox = Math.sqrt(
              Math.pow(event.pageX - (aRect.x + aRect.width / 2), 2) +
              Math.pow(event.pageY - (aRect.y + aRect.height / 2), 2)
            )
            b_center_ox = Math.sqrt(
              Math.pow(event.pageX - (bRect.x + bRect.width / 2), 2) +
              Math.pow(event.pageY - (bRect.y + bRect.height / 2), 2)
            )
          } else {
            a_center_ox = Math.abs(event.pageX - (aRect.x + aRect.width / 2))
            b_center_ox = Math.abs(event.pageX - (bRect.x + bRect.width / 2))
          }
          return a_center_ox - b_center_ox
        })[0]
        if (isGrid) {
          closestHTML = children.find(
            childHTML => childHTML.getBoundingClientRect().bottom >= event.pageY
          )
        }
        if (closestHTML) {
          let htmlRect = closestHTML.getBoundingClientRect()
          zIndex = children.indexOf(closestHTML)
          distance = event.pageX - (htmlRect.x + htmlRect.width / 2)
          if (distance < 0) zIndex--
        } else {
          zIndex = children.length - 1
        }
      }
      if (drag_start_list[0].ParentID != new_parentID) {
        selected_list.forEach(e => $(e.value).addClass('drag-hide'))
        var demo = document.getElementById('demo_auto_layout')
        if (!demo) {
          demo = document.createElement('div')
          demo.id = 'demo_auto_layout'
          demo.style.backgroundColor = '#1890FF'
          demo.style.width = `${2.4 / scale}px`
          demo.style.height = `${select_box.h * 0.8}px`
        }
        newPWbHTML.replaceChildren(
          ...children.slice(0, zIndex + 1),
          demo,
          ...children.slice(zIndex + 1)
        )
      } else {
        newPWbHTML.replaceChildren(
          ...children.slice(0, zIndex + 1),
          ...selected_list.map(wb => {
            $(wb.value).removeClass('drag-hide')
            $(wb.value).removeClass('fixed-position')
            wb.value.style.position = null
            wb.value.style.left = null
            wb.value.style.top = null
            wb.value.style.right = null
            wb.value.style.bottom = null
            wb.value.style.transform = null
            wb.value.setAttribute('parentid', new_parentID)
            wb.Level = parseInt(newPWbHTML.getAttribute('level')) + 1
            wb.value.setAttribute('level', wb.Level)
            wb.ParentID = new_parentID
            return wb.value
          }),
          ...children.slice(zIndex + 1)
        )
      }
    }
  } else {
    console.log('stack')
    selected_list.forEach(wb => {
      $(wb.value).removeClass('drag-hide')
      $(wb.value).removeClass('fixed-position')

      wb.value.style.left = `${wb.tmpX + xp + parent_offset1.x - offsetp.x}px`
      wb.value.style.top = `${wb.tmpY + yp + parent_offset1.y - offsetp.y}px`
      wb.value.style.right = 'unset'
      wb.value.style.bottom = 'unset'
      wb.value.style.transform = 'none'
      wb.value.setAttribute('parentid', new_parentID)
      wb.value.querySelectorAll('.wbaseItem-value').forEach(e => {
        e.setAttribute(
          'level',
          parseInt(e.getAttribute('level')) -
          wb.Level +
          parseInt(newPWbHTML.getAttribute('level') ?? '0') +
          1
        )
      })
      wb.Level = parseInt(newPWbHTML.getAttribute('level') ?? '0') + 1
      wb.value.setAttribute('level', wb.Level)
      wb.ParentID = new_parentID
      return wb.value
    })
    if (select_box_parentID !== new_parentID) {
      let children = [
        ...newPWbHTML.querySelectorAll(
          `.wbaseItem-value[level="${parseInt(newPWbHTML.getAttribute('level') ?? '0') + 1
          }"]`
        )
      ]
      if (children.length > 0) {
        children = children.filter(e =>
          selected_list.every(wb => e !== wb.value)
        )
        let zIndex = children.length + 1
        newPWbHTML.replaceChildren(
          ...children.slice(0, zIndex + 1),
          ...selected_list.map(wb => wb.value),
          ...children.slice(zIndex + 1)
        )
      } else {
        newPWbHTML.replaceChildren(...selected_list.map(wb => wb.value))
      }
    }
  }
  if (!demo) document.getElementById('demo_auto_layout')?.remove()
  select_box_parentID = selected_list[0].ParentID
}

function dragWbaseEnd() {
  if (alt_list.length > 0) {
    alt_list.forEach(altItem => altItem.value?.remove())
    alt_list = []
  }
  WBaseDA.listData = []
  if (drag_start_list.length > 0) {
    let newPWbHTML = parent
    let new_parentID =
      newPWbHTML.id.length != 36 ? wbase_parentID : newPWbHTML.id
    if (new_parentID !== wbase_parentID) {
      var pWb = wbase_list.find(e => e.GID === new_parentID)
      var component = newPWbHTML.closest(
        `.wbaseItem-value[iswini]:not(.w-variant)`
      )
      if (component)
        var cssItem = StyleDA.cssStyleSheets.find(e => e.GID === component.id)
    }
    //
    if (drag_start_list[0].ParentID !== new_parentID) {
      var eEvent = EnumEvent.parent
      if (drag_start_list[0].ParentID !== wbase_parentID) {
        var oldPWb = wbase_list.find(
          wb => wb.GID === drag_start_list[0].ParentID
        )
        if (oldPWb.value.classList.contains('w-table')) {
          let listCell = oldPWb.TableRows.reduce((a, b) => a.concat(b))
            ;[
              ...oldPWb.value.querySelectorAll(
                ':scope > .table-row > .table-cell'
              )
            ].forEach(cell => {
              listCell.find(e => e.id === cell.id).contentid = [
                ...cell.childNodes
              ]
                .map(e => e.id)
                .join(',')
            })
          let wbaseChildren = [
            ...oldPWb.value.querySelectorAll(
              `.wbaseItem-value[level="${oldPWb.Level + 1}"]`
            )
          ]
          for (let i = 0; i < wbaseChildren.length; i++) {
            wbaseChildren[i].style.zIndex = i
          }
        }
        if (oldPWb.value.classList.contains('w-variant')) {
          let listProperty = PropertyDA.list.filter(
            e => e.BaseID === oldPWb.GID
          )
          for (let propertyItem of listProperty) {
            propertyItem.BasePropertyItems =
              propertyItem.BasePropertyItems.filter(e =>
                selected_list.every(wbase => e.BaseID != wbase.GID)
              )
          }
        }
        WBaseDA.listData.push(oldPWb)
      }
      let demo = document.getElementById('demo_auto_layout')
      if (demo) {
        demo.replaceWith(
          ...selected_list.map(wb => {
            $(wb.value).removeClass('drag-hide')
            $(wb.value).removeClass('fixed-position')
            wb.value.removeAttribute('constx')
            wb.value.removeAttribute('consty')
            wb.value.style.position = null
            wb.value.style.left = null
            wb.value.style.top = null
            wb.value.style.right = null
            wb.value.style.bottom = null
            wb.value.style.transform = null
            wb.value.setAttribute('parentid', new_parentID)
            wb.Level = pWb.Level + 1
            wb.value.setAttribute('level', wb.Level)
            wb.ParentID = new_parentID
            if (wb.value.getAttribute('width-type') === 'fill') {
              if (newPWbHTML.getAttribute('width-type') !== 'fit') {
                wb.value.style.width = '100%'
                if (newPWbHTML.classList.contains('w-row'))
                  wb.value.style.flex = 1
              } else {
                wb.value.removeAttribute('width-type')
              }
            }
            if (wb.value.getAttribute('height-type') === 'fill') {
              if (newPWbHTML.getAttribute('height-type') !== 'fit') {
                wb.value.style.height = '100%'
                if (newPWbHTML.classList.contains('w-col'))
                  wb.value.style.flex = 1
              } else {
                wb.value.removeAttribute('height-type')
              }
            }
            return wb.value
          })
        )
        if (component) {
          wbase_list.filter(e => {
            if (
              e.ParentID === new_parentID &&
              selected_list.every(wb => wb !== e)
            ) {
              let eRule = StyleDA.docStyleSheets.find(rule =>
                [...divSection.querySelectorAll(rule.selectorText)].includes(
                  e.value
                )
              )
              eRule.style.order = $(e.value).index()
              cssItem.Css = cssItem.Css.replace(
                new RegExp(`${eRule.selectorText} {[^}]*}`, 'g'),
                eRule.cssText
              )
            }
          })
        } else {
          wbase_list.filter(e => {
            if (
              e.ParentID === new_parentID &&
              e.value.style.order != $(e.value).index()
            ) {
              e.value.style.order = $(e.value).index()
              e.Css = e.value.style.cssText
              if (selected_list.every(wb => wb !== e)) WBaseDA.listData.push(e)
            }
          })
        }
      } else if (new_parentID === wbase_parentID) {
        selected_list.forEach(wb => {
          wb.value.setAttribute('constx', Constraints.left)
          wb.value.setAttribute('consty', Constraints.top)
          if (wb.value.getAttribute('width-type') === 'fill')
            wb.value.removeAttribute('width-type')
          if (wb.value.getAttribute('height-type') === 'fill')
            wb.value.removeAttribute('height-type')
          updateConstraints(wb.value)
        })
      } else if (newPWbHTML.classList.contains('w-block')) {
        selected_list.forEach(wb => {
          if (wb.value.getAttribute('width-type') === 'fill')
            wb.value.removeAttribute('width-type')
          if (wb.value.getAttribute('height-type') === 'fill')
            wb.value.removeAttribute('height-type')
          updateConstraints(wb.value)
        })
      }
      if (pWb) WBaseDA.listData.push(pWb)
    } else if (window.getComputedStyle(newPWbHTML).display === 'flex') {
      if (pWb.value.getAttribute('width-type') === 'fit') {
        pWb.value.style.width = null
      }
      if (pWb.value.getAttribute('height-type') === 'fit') {
        pWb.value.style.height = null
      }
      eEvent = EnumEvent.parent
      if (component) {
        pWb.value
          .querySelectorAll(`.wbaseItem-value[level="${pWb.Level + 1}"]`)
          .forEach(e => {
            if (selected_list.every(wb => wb.value !== e)) {
              let eRule = StyleDA.docStyleSheets.find(rule =>
                [...divSection.querySelectorAll(rule.selectorText)].includes(e)
              )
              eRule.style.order = $(e).index()
              cssItem.Css = cssItem.Css.replace(
                new RegExp(`${eRule.selectorText} {[^}]*}`, 'g'),
                eRule.cssText
              )
            }
          })
      } else {
        wbase_list.filter(e => {
          if (
            e.ParentID === new_parentID &&
            e.value.style.order != $(e.value).index()
          ) {
            e.value.style.order = $(e.value).index()
            e.Css = e.value.style.cssText
            if (selected_list.every(wb => wb !== e)) WBaseDA.listData.push(e)
          }
        })
      }
      WBaseDA.listData.push(pWb)
    } else if (new_parentID === wbase_parentID) {
      selected_list.forEach(wb => {
        wb.value.setAttribute('constx', Constraints.left)
        wb.value.setAttribute('consty', Constraints.top)
        updateConstraints(wb.value)
      })
    } else if (newPWbHTML.classList.contains('w-block')) {
      selected_list.forEach(wb => updateConstraints(wb.value))
    }
    WBaseDA.listData.push(
      ...selected_list.map(wb => {
        if (wb.value.getAttribute('width-type') === 'fill') {
          if (
            wb.value.closest(
              `.w-row[level="${wb.Level - 1}"]:not(*[width-type="fit"])`
            )
          ) {
            wb.value.style.width = '100%'
            wb.value.style.flex = 1
          } else {
            wb.value.style.width = wb.value.offsetWidth + 'px'
            wb.value.removeAttribute('width-type')
          }
        }
        if (wb.value.getAttribute('height-type') === 'fill') {
          if (
            wb.value.closest(
              `.w-col[level="${wb.Level - 1}"]:not(*[height-type="fit"]`
            )
          ) {
            wb.value.style.height = '100%'
            wb.value.style.flex = 1
          } else {
            wb.value.style.height = wb.value.offsetHeight + 'px'
            wb.value.removeAttribute('height-type')
          }
        }
        if (window.getComputedStyle(newPWbHTML).display === 'flex') {
          wb.value.style.order = $(wb.value).index()
        } else {
          wb.value.style.order = null
        }
        if (component) {
          const stClassName = [...wb.value.classList].find(cls =>
            cls.startsWith('w-st')
          )
          if (stClassName) {
            StyleDA.docStyleSheets.find(rule => {
              let selector = [...divSection.querySelectorAll(rule.selectorText)]
              const check = selector.includes(wb.value)
              if (check) {
                rule.style.cssText += wb.value.style.cssText
                selector.forEach(e => {
                  if (wb.value.getAttribute('constx')) {
                    e.setAttribute('constx', wb.value.getAttribute('constx'))
                  } else {
                    e.removeAttribute('constx')
                  }
                  if (wb.value.getAttribute('consty')) {
                    e.setAttribute('consty', wb.value.getAttribute('consty'))
                  } else {
                    e.removeAttribute('consty')
                  }
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
                })
                cssItem.Css = cssItem.Css.replace(
                  new RegExp(`${rule.selectorText} {[^}]*}`, 'g'),
                  rule.cssText
                )
              }
              return check
            })
          } else {
            const componentClsName = [...component.classList].find(cls =>
              cls.startsWith('w-st0')
            )
            let newClassName =
              `w-st${wb.Level - pWb.Level}-` +
              Ultis.toSlug(wb.Name.toLowerCase().trim())
            let existNameList = [
              ...component.querySelectorAll(`.wbaseItem-value`)
            ]
              .map(e => [...e.classList].find(cls => cls.startsWith('w-st')))
              .filter(e => e != null && e.startsWith(newClassName))
            for (let i = 1; i < 100; i++) {
              if (existNameList.every(vl => vl !== `${newClassName}${i}`)) {
                newClassName = newClassName + `${i}`
                break
              }
            }
            let cssText = wb.value.style.cssText.split(';').map(vl => vl.trim())
            let cssTextValue = newPWbHTML.classList.contains('w-block')
              ? cssText.filter(e => !e.match(/order/g)).join(';')
              : cssText
                .filter(
                  e =>
                    !e.match(
                      /(z-index|left|top|bottom|right|transform|--gutter)/g
                    )
                )
                .join(';')
            const clsRegex = new RegExp(
              `.${componentClsName} .${newClassName} {[^}]*}`,
              'g'
            )
            if (cssItem.Css.match(clsRegex)) {
              cssItem.Css = cssItem.Css.replace(
                clsRegex,
                `.${componentClsName} .${newClassName} { ${cssTextValue} }`
              )
            } else {
              cssItem.Css += `/**/ .${componentClsName} .${newClassName} { ${cssTextValue} }`
            }
            wb.value.classList.add(newClassName)
            wb.IsCopy = true
          }
          wb.value.removeAttribute('style')
        } else if (
          oldPWb?.value?.closest(`.wbaseItem-value[iswini]:not(.w-variant)`)
        ) {
          wb.value.className = [...wb.value.classList]
            .filter(cls => !cls.startsWith('w-st'))
            .join(' ')
        }
        wb.Css = wb.value.style.cssText
        if (wb.Css.length === 0) wb.Css = null
        wb.ListClassName = wb.value.className
        return wb
      })
    )
    select_box_parentID = selected_list[0].ParentID
    if (component) {
      StyleDA.editStyleSheet(cssItem)
      document.getElementById(`w-st-comp${cssItem.GID}`).innerHTML = cssItem.Css
    } else if (
      oldPWb?.value?.closest(`.wbaseItem-value[iswini]:not(.w-variant)`)
    ) {
      WBaseDA.deleteWb({ listWb: selected_list })
    }
    if (WBaseDA.listData.length) {
      if (eEvent === EnumEvent.parent) {
        WBaseDA.parent(WBaseDA.listData, EnumObj.wBase)
      } else {
        WBaseDA.edit(WBaseDA.listData, EnumObj.wBase)
      }
    }
    newPWbHTML.removeAttribute('onsort')
    replaceAllLyerItemHTML()
    updateUIDesignView()
    drag_start_list = []
    WBaseDA.listData = []
  }
  parent = divSection
  updateHoverWbase()
  handleWbSelectedList([...selected_list])
  reloadEditOffsetBlock()
}

// ALT copy
let tmpAltHTML = []

// new alt
function dragAltUpdate(xp, yp, event) {
  console.log('drag alt update')
  let newPWbHTML = parent
  let new_parentID = newPWbHTML.id.length != 36 ? wbase_parentID : newPWbHTML.id
  if (
    select_box_parentID !== wbase_parentID &&
    select_box_parentID !== new_parentID
  ) {
    document.getElementById(select_box_parentID).removeAttribute('onsort')
  }
  if (alt_list.length == 0) {
    const component = selected_list[0].value.closest(
      `.wbaseItem-value:is(*[iswini], *[isinstance]):not(*[level="${selected_list[0].Level}"], .w-variant)`
    )
    if (component) {
      var componentCls = [...component.classList].find(e =>
        e.startsWith('w-st0')
      )
    }
    for (let wb of selected_list) {
      let alt_wbase = JSON.parse(JSON.stringify(wb))
      alt_wbase.GID = uuidv4()
      alt_wbase.ChildID = wb.GID
      alt_wbase.IsCopy = true
      let tmp = wb.value.cloneNode(true)
      if (
        wb.value.getAttribute('width-type') === 'fill' ||
        wb.value.getAttribute('constx') === Constraints.left_right ||
        wb.value.getAttribute('constx') === Constraints.scale
      ) {
        tmp.style.width = wb.value.offsetWidth + 'px'
        tmp.style.flex = null
      }
      if (
        (wb.value.getAttribute('height-type') === 'fill') |
        (wb.value.getAttribute('consty') === Constraints.top_bottom) ||
        wb.value.getAttribute('consty') === Constraints.scale
      ) {
        tmp.style.height = wb.value.offsetHeight + 'px'
        tmp.style.flex = null
      }
      if (componentCls) {
        const removeClsList = [tmp, ...tmp.querySelectorAll(`.wbaseItem-value`)]
        removeClsList.forEach(e => {
          if (e === tmp) {
            tmp.id = alt_wbase.GID
          } else {
            e.setAttribute('copyid', e.id)
            e.id = uuidv4()
            e.setAttribute(
              'parentid',
              e.closest(
                `.wbaseItem-value[level="${parseInt(e.getAttribute('level')) - 1
                }"]`
              )
            )
          }
          const eCls = [...e.classList].find(cls => cls.startsWith('w-st'))
          if (eCls) {
            const cssRule = StyleDA.docStyleSheets.find(rule =>
              rule.selectorText.endsWith(eCls)
            )
            e.style.cssText = cssRule.style.cssText + e.style.cssText
            e.classList.remove(eCls)
          }
        })
      }
      tmpAltHTML.push(tmp)
      alt_wbase.value = tmp
      alt_list.push(alt_wbase)
    }
  }
  if (newPWbHTML.classList.contains('w-table')) {
    console.log('table')
    let availableCell = findCell(parentHTML, event)
    if (availableCell) {
      let distance = 0
      let cellChildren = [...availableCell.childNodes].filter(eHTML =>
        alt_list.every(e => e.GID !== eHTML.id)
      )
      if (cellChildren.length > 0) {
        cellChildren.sort((aHTML, bHTML) => {
          let aRect = aHTML.getBoundingClientRect()
          let bRect = bHTML.getBoundingClientRect()
          let a_center_oy = Math.abs(event.pageY - (aRect.y + aRect.height / 2))
          let b_center_oy = Math.abs(event.pageY - (bRect.y + bRect.height / 2))
          return a_center_oy - b_center_oy
        })
        let closestHTML = cellChildren[0]
        let htmlRect = closestHTML.getBoundingClientRect()
        distance = event.pageY - (htmlRect.y + htmlRect.height / 2)
      }
      alt_list.forEach(e => $(e.value).addClass('drag-hide'))
      let demo = document.createElement('div')
      demo.id = 'demo_auto_layout'
      demo.style.backgroundColor = '#1890FF'
      demo.style.height = `${2.4 / scale}px`
      demo.style.width = `${select_box.w * 0.8}px`
      if (distance < 0) {
        availableCell.replaceChildren(demo, ...cellChildren)
      } else {
        availableCell.replaceChildren(...cellChildren, demo)
      }
    }
  } else if (
    window.getComputedStyle(newPWbHTML).display.match('flex') &&
    alt_list.some(e => !e.value.classList.contains('fixed-position'))
  ) {
    newPWbHTML.setAttribute('onsort', 'true')
    console.log('flex')
    let children = [
      ...newPWbHTML.querySelectorAll(
        `.wbaseItem-value[level="${parseInt(newPWbHTML.getAttribute('level') ?? '0') + 1
        }"]`
      )
    ].filter(e => alt_list.every(wb => wb.GID !== e.id))
    let isGrid = window.getComputedStyle(newPWbHTML).flexWrap == 'wrap'
    if (newPWbHTML.classList.contains('w-col')) {
      let zIndex = 0
      let distance = 0
      if (children.length > 0) {
        let closestHTML = [...children].sort((aHTML, bHTML) => {
          let aRect = aHTML.getBoundingClientRect()
          let bRect = bHTML.getBoundingClientRect()
          if (isGrid) {
            var a_center_oy = Math.sqrt(
              Math.pow(event.pageX - (aRect.x + aRect.width / 2), 2) +
              Math.pow(event.pageY - (aRect.y + aRect.height / 2), 2)
            )
            var b_center_oy = Math.sqrt(
              Math.pow(event.pageX - (bRect.x + bRect.width / 2), 2) +
              Math.pow(event.pageY - (bRect.y + bRect.height / 2), 2)
            )
          } else {
            a_center_oy = Math.abs(event.pageY - (aRect.y + aRect.height / 2))
            b_center_oy = Math.abs(event.pageY - (bRect.y + bRect.height / 2))
          }
          return a_center_oy - b_center_oy
        })[0]
        if (isGrid) {
          closestHTML = children.find(
            childHTML => childHTML.getBoundingClientRect().right >= event.pageX
          )
        }
        if (closestHTML) {
          let closestRect = closestHTML.getBoundingClientRect()
          zIndex = children.indexOf(closestHTML)
          distance = event.pageY - (closestRect.y + closestRect.height / 2)
          if (distance < 0) zIndex--
        } else {
          zIndex = children.length - 1
        }
      }
      alt_list.forEach(e => $(e.value).addClass('drag-hide'))
      var demo = document.getElementById('demo_auto_layout')
      if (!demo) {
        demo = document.createElement('div')
        demo.id = 'demo_auto_layout'
        demo.style.backgroundColor = '#1890FF'
        demo.style.height = `${2.4 / scale}px`
        demo.style.width = `${select_box.w * 0.8}px`
      }
      newPWbHTML.replaceChildren(
        ...children.slice(0, zIndex + 1),
        demo,
        ...children.slice(zIndex + 1)
      )
    } else {
      let zIndex = 0
      let distance = 0
      if (children.length > 0) {
        let closestHTML = [...children].sort((aHTML, bHTML) => {
          let aRect = aHTML.getBoundingClientRect()
          let bRect = bHTML.getBoundingClientRect()
          if (isGrid) {
            var a_center_ox = Math.sqrt(
              Math.pow(event.pageX - (aRect.x + aRect.width / 2), 2) +
              Math.pow(event.pageY - (aRect.y + aRect.height / 2), 2)
            )
            var b_center_ox = Math.sqrt(
              Math.pow(event.pageX - (bRect.x + bRect.width / 2), 2) +
              Math.pow(event.pageY - (bRect.y + bRect.height / 2), 2)
            )
          } else {
            a_center_ox = Math.abs(event.pageX - (aRect.x + aRect.width / 2))
            b_center_ox = Math.abs(event.pageX - (bRect.x + bRect.width / 2))
          }
          return a_center_ox - b_center_ox
        })[0]
        if (isGrid) {
          closestHTML = children.find(
            childHTML => childHTML.getBoundingClientRect().bottom >= event.pageY
          )
        }
        if (closestHTML) {
          let closestRect = closestHTML.getBoundingClientRect()
          zIndex = children.indexOf(closestHTML)
          distance = event.pageX - (closestRect.x + closestRect.width / 2)
          if (distance < 0) zIndex--
        } else {
          zIndex = children.length - 1
        }
      }
      alt_list.forEach(e => $(e.value).addClass('drag-hide'))
      var demo = document.getElementById('demo_auto_layout')
      if (!demo) {
        demo = document.createElement('div')
        demo.id = 'demo_auto_layout'
        demo.style.backgroundColor = '#1890FF'
        demo.style.width = `${2.4 / scale}px`
        demo.style.height = `${select_box.h * 0.8}px`
      }
      newPWbHTML.replaceChildren(
        ...children.slice(0, zIndex + 1),
        demo,
        ...children.slice(zIndex + 1)
      )
    }
  } else {
    alt_list.forEach(wb => {
      $(wb.value).removeClass('drag-hide')
      $(wb.value).removeClass('fixed-position')
      wb.value.style.left = `${wb.tmpX + xp + parent_offset1.x - offsetp.x}px`
      wb.value.style.top = `${wb.tmpY + yp + parent_offset1.y - offsetp.y}px`
      wb.value.style.right = null
      wb.value.style.bottom = null
      wb.value.style.transform = null
      wb.value.setAttribute('parentid', new_parentID)
      wb.value.querySelectorAll('.wbaseItem-value').forEach(e => {
        e.setAttribute(
          'level',
          parseInt(e.getAttribute('level')) -
          wb.Level +
          parseInt(newPWbHTML.getAttribute('level') ?? '0') +
          1
        )
      })
      wb.Level = parseInt(newPWbHTML.getAttribute('level') ?? '0') + 1
      wb.ParentID = new_parentID
      return wb.value
    })
    if (
      select_box_parentID !== new_parentID ||
      checkpad === selected_list.length
    ) {
      let children = [
        ...newPWbHTML.querySelectorAll(
          `.wbaseItem-value[level="${parseInt(newPWbHTML.getAttribute('level') ?? '0') + 1
          }"]`
        )
      ]
      if (children.length > 0) {
        let zIndex =
          Math.max(
            0,
            ...children.map(eHTML => {
              if (alt_list.some(wb => wb.GID === eHTML.id)) return 0
              else return $(eHTML).index()
            })
          ) + 1
        newPWbHTML.replaceChildren(
          ...children.slice(0, zIndex + 1),
          ...alt_list.map(wb => wb.value),
          ...children.slice(zIndex + 1)
        )
      }
    }
  }
  if (!demo) document.getElementById('demo_auto_layout')?.remove()
  select_box_parentID = alt_list[0].ParentID
}

function dragAltEnd() {
  WBaseDA.listData = []
  console.log('dragend alt')
  if (drag_start_list.length > 0 && alt_list.length > 0) {
    const component = selected_list[0].value.closest(
      `.wbaseItem-value:is(*[iswini], *[isinstance]):not(*[level="${selected_list[0].Level}"], .w-variant)`
    )
    let newPWbHTML = parent
    let new_parentID =
      newPWbHTML.id.length != 36 ? wbase_parentID : newPWbHTML.id
    if (new_parentID !== wbase_parentID) {
      var pWb = wbase_list.find(e => e.GID === new_parentID)
      var newComponent = pWb.value.closest('.wbaseItem-value[iswini]')
      if (newComponent)
        var cssItem = StyleDA.cssStyleSheets.find(
          e => e.GID === newComponent.id
        )
    }
    let demo = document.getElementById('demo_auto_layout')
    if (demo) {
      demo.replaceWith(
        ...alt_list.map(wb => {
          $(wb.value).removeClass('drag-hide')
          $(wb.value).removeClass('fixed-position')
          wb.value.style.position = null
          wb.value.style.left = null
          wb.value.style.top = null
          wb.value.style.right = null
          wb.value.style.bottom = null
          wb.value.style.transform = null
          wb.value.setAttribute('parentid', new_parentID)
          wb.Level = pWb.Level + 1
          wb.value.setAttribute('level', wb.Level)
          wb.ParentID = new_parentID
          wb.value.querySelectorAll('.wbaseItem-value').forEach(e => {
            e.setAttribute(
              'level',
              parseInt(e.getAttribute('level')) -
              wb.Level +
              parseInt(newPWbHTML.getAttribute('level') ?? '0') +
              1
            )
          })
          return wb.value
        })
      )
    } else if (new_parentID === wbase_parentID) {
      alt_list.forEach(wb => {
        wb.value.setAttribute('constx', Constraints.left)
        wb.value.setAttribute('consty', Constraints.top)
        updateConstraints(wb.value)
      })
    } else if (newPWbHTML.classList.contains('w-block')) {
      alt_list.forEach(wb => updateConstraints(wb.value))
    }
    if (pWb) WBaseDA.listData.push(pWb)
    alt_list.forEach(wb => {
      if (demo) wb.value.style.order = $(wb.value).index()
      if (wb.value.getAttribute('width-type') === 'fill') {
        if (
          wb.value.closest(
            `.w-row[level="${wb.Level - 1}"]:not(*[width-type="fit"])`
          )
        ) {
          wb.value.style.width = '100%'
          wb.value.style.flex = 1
        } else {
          wb.value.style.width = wb.value.offsetWidth + 'px'
          wb.value.removeAttribute('width-type')
        }
      }
      if (wb.value.getAttribute('height-type') === 'fill') {
        if (
          wb.value.closest(
            `.w-col[level="${wb.Level - 1}"]:not(*[height-type="fit"]`
          )
        ) {
          wb.value.style.height = '100%'
          wb.value.style.flex = 1
        } else {
          wb.value.style.height = wb.value.offsetHeight + 'px'
          wb.value.removeAttribute('height-type')
        }
      }
      if (component) {
        wb.AttributeID = uuidv4()
        wbase_list.forEach(e => {
          if (e.GID === wb.ChildID) {
            wb.AttributesItem = {
              ...e.AttributesItem,
              GID: wb.AttributeID
            }
            delete wb.ChildID
            if (!cssItem) delete wb.IsCopy
            var check = true
          } else if (
            selected_list.some(eSelect => eSelect.value.contains(e.value))
          ) {
            let cWbHTML = wb.value.querySelector(
              `.wbaseItem-value[copyid="${e.GID}"]`
            )
            var newWb = JSON.parse(JSON.stringify(e))
            newWb.GID = cWbHTML.id
            newWb.ParentID = cWbHTML.getAttribute('parentid')
            newWb.AttributeID = uuidv4()
            newWb.AttributesItem.GID = newWb.AttributeID
            newWb.Css = cWbHTML.style.cssText
            newWb.ListClassName = cWbHTML.className
            newWb.Level = parseInt(cWbHTML.getAttribute('level'))
            newWb.value = cWbHTML
            delete newWb.ChildID
            WBaseDA.listData.push(newWb)
            check = true
          }
          if (check && cssItem) {
            newWb ??= wb
            const componentClsName = [...newComponent.classList].find(cls =>
              cls.startsWith('w-st0')
            )
            let newClassName =
              `w-st${newWb.Level - parseInt(newComponent.getAttribute('level'))
              }-` + Ultis.toSlug(newWb.Name.toLowerCase().trim())
            let existNameList = [
              ...newComponent.querySelectorAll(`.wbaseItem-value`)
            ]
              .map(e => [...e.classList].find(cls => cls.startsWith('w-st')))
              .filter(e => e != null && e.startsWith(newClassName))
            for (let i = 1; i < 100; i++) {
              if (existNameList.every(vl => vl !== `${newClassName}${i}`)) {
                newClassName = newClassName + `${i}`
                break
              }
            }
            let cssText = newWb.value.style.cssText
              .split(';')
              .map(vl => vl.trim())
            let cssTextValue = newPWbHTML.classList.contains('w-block')
              ? cssText.filter(e => !e.match(/order/g)).join(';')
              : cssText
                .filter(
                  e =>
                    !e.match(
                      /(z-index|left|top|bottom|right|transform|--gutter)/g
                    )
                )
                .join(';')
            const clsRegex = new RegExp(
              `.${componentClsName} .${newClassName} {[^}]*}`,
              'g'
            )
            if (cssItem.Css.match(clsRegex)) {
              cssItem.Css = cssItem.Css.replace(
                clsRegex,
                `.${componentClsName} .${newClassName} { ${cssTextValue} }`
              )
            } else {
              cssItem.Css += `/**/ .${componentClsName} .${newClassName} { ${cssTextValue} }`
            }
            newWb.value.classList.add(newClassName)
            newWb.value.removeAttribute('style')
          }
        })
      }
      wb.Css = wb.value.style.cssText
      if (!wb.Css.length) wb.Css = null
      wb.ListClassName = wb.value.className
    })
    WBaseDA.listData.push(...alt_list)
    if (component) {
      wbase_list.push(...WBaseDA.listData.filter(e => e !== pWb))
      arrange()
    }
    if (demo) {
      if (cssItem) {
        newPWbHTML
          .querySelectorAll(`.wbaseItem-value[level="${pWb.Level + 1}"]`)
          .forEach(e => {
            let eRule = StyleDA.docStyleSheets.find(rule =>
              rule.selectorText.endsWith([...e.classList].find(cls => cls.startsWith('w-st')))
            )
            eRule.style.order = $(e).index()
            cssItem.Css = cssItem.Css.replace(
              new RegExp(`${eRule.selectorText} {[^}]*}`, 'g'),
              eRule.cssText
            )
          })
        StyleDA.editStyleSheet(cssItem)
        document.getElementById(`w-st-comp${cssItem.GID}`).innerHTML = cssItem.Css
      } else {
        wbase_list.filter(e => {
          if (e.ParentID === new_parentID && e.value.style.order != $(e.value).index()) {
            e.value.style.order = $(e.value).index()
            e.Css = e.value.style.cssText
          }
        })
      }
    }
    if (component) {
      wbase_list.push(...WBaseDA.listData.filter(e => e !== pWb))
      arrange()
      WBaseDA.add({ listWb: WBaseDA.listData, parentid: new_parentID })
      replaceAllLyerItemHTML()
    } else {
      WBaseDA.copy(WBaseDA.listData)
      tmpAltHTML.forEach(tmp => tmp.setAttribute('loading', 'true'))
    }
    newPWbHTML.removeAttribute('onsort')
    parent = divSection
    // handleWbSelectedList(alt_list)
    // action_list[action_index].tmpHTML = [...tmpAltHTML]
    // tmpAltHTML = []
    drag_start_list = []
    alt_list = []
    WBaseDA.listData = []
  }
}

//
function handlePopupDispose(elementHTML, callback) {
  if (callback) {
    const observer = new IntersectionObserver((entries, observe) => {
      let target = entries[0].target
      if (!document.body.contains(target)) {
        callback(entries, observe)
      }
    })
    observer.observe(elementHTML)
  }
}

function handleCompleteAddWbase() {
  let wb = selected_list[0]
  const component = wb.value.closest(`.wbaseItem-value[iswini]`)
  if (component) {
    const componentClsName = [...component.classList].find(cls =>
      cls.startsWith('w-st0')
    )
    let newClassName =
      `w-st${wb.Level - parseInt(component.getAttribute('level'))}-` +
      Ultis.toSlug(wb.Name.toLowerCase().trim())
    let existNameList = [...component.querySelectorAll(`.wbaseItem-value`)]
      .map(e => [...e.classList].find(cls => cls.startsWith('w-st')))
      .filter(e => e != null && e.startsWith(newClassName))
    for (let i = 1; i < 100; i++) {
      if (existNameList.every(vl => vl !== `${newClassName}${i}`)) {
        newClassName = newClassName + `${i}`
        break
      }
    }
    let cssItem = StyleDA.cssStyleSheets.find(e => e.GID === component.id)
    let cssText = wb.value.style.cssText.split(';').map(vl => vl.trim())
    let cssTextValue = wb.value
      .closest(`.wbaseItem-value[level="${wb.Level - 1}"]`)
      .classList.contains('w-block')
      ? cssText.filter(e => !e.match(/order/g)).join(';')
      : cssText
        .filter(
          e => !e.match(/(z-index|left|top|bottom|right|transform|--gutter)/g)
        )
        .join(';')
    const clsRegex = new RegExp(
      `.${componentClsName} .${newClassName} {[^}]*}`,
      'g'
    )
    if (cssItem.Css.match(clsRegex)) {
      cssItem.Css = cssItem.Css.replace(
        clsRegex,
        `.${componentClsName} .${newClassName} { ${cssTextValue} }`
      )
    } else {
      cssItem.Css += `/**/ .${componentClsName} .${newClassName} { ${cssTextValue} }`
    }
    wb.Css = null
    wb.value.removeAttribute('style')
    wb.value.classList.add(newClassName)
    wb.ListClassName = wb.value.className
    wb.IsCopy = true
    WBaseDA.listData.forEach(e => {
      let cssRule = StyleDA.docStyleSheets.find(
        rule =>
          component.querySelector(
            rule.selectorText.replace(componentClsName, '')
          ) === e.value
      )
      cssRule.style.cssText += e.value.style.cssText
      cssItem.Css = cssItem.Css.replace(
        new RegExp(`${cssRule.selectorText} {[^}]*}`, 'g'),
        cssRule.cssText
      )
    })
    WBaseDA.add({ listWb: [wb] })
    StyleDA.editStyleSheet(cssItem)
    document.getElementById(`w-st-comp${cssItem.GID}`).innerHTML = cssItem.Css
    delete wb.IsCopy
  } else {
    WBaseDA.listData.push(wb)
    WBaseDA.listData.forEach(e => (e.Css = e.value.style.cssText))
    WBaseDA.add({ listWb: WBaseDA.listData })
  }
  WBaseDA.listData = []
}

// function ctrlZ () {
//   if (action_index >= 0) {
//     let action = action_list[action_index]
//     action_index--
//     WBaseDA.isCtrlZ = true
//     console.log('ctrlz action: ', action_list, action_index)
//     let listUpdate = []
//     switch (action.enumEvent) {
//       case EnumEvent.add:
//         if (action.enumObj === EnumObj.wBase) {
//           let preAction = action_list[action_index]
//           let oldSelectList = preAction?.selected ?? []
//           let deletItems = wbase_list.filter(e =>
//             action.selected.some(selectItem => selectItem.GID === e.GID)
//           )
//           if (deletItems.length > 0) WBaseDA.delete(deletItems)
//           handleWbSelectedList(
//             oldSelectList.length
//               ? wbase_list.filter(e =>
//                   oldSelectList.some(selectItem => selectItem.GID === e.GID)
//                 )
//               : []
//           )
//         } else {
//           // add style for decoration
//           let preAction = action_list[action_index]
//           let oldSelectList = preAction?.selected ?? []
//           if (preAction) {
//             oldSelectList = oldSelectList.map(e =>
//               JSON.parse(JSON.stringify(e))
//             )
//             listUpdate.push(...oldSelectList)
//             if (
//               [
//                 EnumObj.frame,
//                 EnumObj.position,
//                 EnumObj.framePosition,
//                 EnumObj.autoLayoutFrame,
//                 EnumObj.padddingWbaseFrame
//               ].some(e => e === action.enumObj)
//             ) {
//               listUpdate.push(
//                 ...preAction.oldData
//                   .map(e => JSON.parse(JSON.stringify(e)))
//                   .filter(
//                     e =>
//                       isInRange(e.Level, 0, oldSelectList[0].Level - 1) ||
//                       e.Level > oldSelectList[0].Level + 1
//                   )
//               )
//             }
//             listUpdate = listUpdate.filter(updateItem =>
//               wbase_list.some(e => updateItem.GID === e.GID)
//             )
//             wbase_list = wbase_list.filter(wbaseItem =>
//               listUpdate.every(e => wbaseItem.GID !== e.GID)
//             )
//             wbase_list.push(...listUpdate)
//             arrange()
//             arrange(listUpdate)
//             let parentLevel = Math.min(...listUpdate.map(e => e.Level))
//             for (let wbaseItem of listUpdate) {
//               initComponents(
//                 wbaseItem,
//                 wbase_list.filter(e => e.ParentID === wbaseItem.GID),
//                 wbaseItem.Level > parentLevel
//               )
//               if (wbaseItem.Level === 1 || wbaseItem.Level === parentLevel) {
//                 let parentHTML = divSection
//                 if (wbaseItem.Level > 1)
//                   parentHTML = document.getElementById(wbaseItem.ParentID)
//                 switch (parseInt(parentHTML.getAttribute('cateid'))) {
//                   case EnumCate.tree:
//                     createTree(
//                       wbase_list.find(e => e.GID === wbaseItem.ParentID),
//                       wbase_list.filter(e => e.ParentID === wbaseItem.ParentID)
//                     )
//                     break
//                   case EnumCate.table:
//                     createTable(
//                       wbase_list.find(e => e.GID === wbaseItem.ParentID),
//                       wbase_list.filter(e => e.ParentID === wbaseItem.ParentID)
//                     )
//                     break
//                   default:
//                     let oldValue = document.getElementById(wbaseItem.GID)
//                     if (
//                       !window.getComputedStyle(parentHTML).display.match('flex')
//                     ) {
//                       initPositionStyle(wbaseItem)
//                     }
//                     if (oldValue) {
//                       oldValue.replaceWith(wbaseItem.value)
//                     } else {
//                       parentHTML.appendChild(wbaseItem.value)
//                     }
//                     break
//                 }
//                 wbaseItem.value.id = wbaseItem.GID
//               }
//             }
//             WBaseDA.edit(listUpdate, action.enumObj)
//           }
//           handleWbSelectedList(
//             listUpdate.filter(e => oldSelectList.some(el => e.GID === el.GID))
//           )
//         }
//         break
//       case EnumEvent.edit:
//         var preAction = action_list[action_index]
//         var oldSelectList = preAction?.selected ?? []
//         if (preAction) {
//           oldSelectList = oldSelectList.map(e => JSON.parse(JSON.stringify(e)))
//           let oldWBaseList = [
//             ...oldSelectList,
//             ...preAction.oldData
//               .map(e => JSON.parse(JSON.stringify(e)))
//               .filter(e => e.Level > 0)
//           ]
//           listUpdate = [
//             ...action.selected,
//             ...action.oldData.filter(e => e.Level > 0)
//           ].map(e => JSON.parse(JSON.stringify(e)))
//           let listDelete = listUpdate.filter(e => {
//             let check =
//               e.Level > 0 && oldWBaseList.every(oldE => oldE.GID !== e.GID)
//             if (check) {
//               e.IsDeleted = true
//               document.getElementById(e.GID)?.remove()
//             }
//             return check
//           })
//           oldWBaseList = oldWBaseList.filter(updateItem =>
//             wbase_list.some(e => updateItem.GID === e.GID)
//           )
//           wbase_list = wbase_list.filter(e =>
//             listUpdate.every(el => el.GID !== e.GID)
//           )
//           wbase_list.push(...oldWBaseList)
//           arrange()
//           arrange(oldWBaseList)
//           let parentLevel = Math.min(...oldWBaseList.map(e => e.Level))
//           for (let wbaseItem of oldWBaseList) {
//             initComponents(
//               wbaseItem,
//               wbase_list.filter(e => e.ParentID === wbaseItem.GID),
//               wbaseItem.Level > parentLevel
//             )
//             if (wbaseItem.Level === 1 || wbaseItem.Level === parentLevel) {
//               let parentHTML = divSection
//               if (wbaseItem.Level > 1)
//                 parentHTML = document.getElementById(wbaseItem.ParentID)
//               switch (parseInt(parentHTML.getAttribute('cateid'))) {
//                 case EnumCate.tree:
//                   createTree(
//                     wbase_list.find(e => e.GID === wbaseItem.ParentID),
//                     wbase_list.filter(e => e.ParentID === wbaseItem.ParentID)
//                   )
//                   break
//                 case EnumCate.table:
//                   createTable(
//                     wbase_list.find(e => e.GID === wbaseItem.ParentID),
//                     wbase_list.filter(e => e.ParentID === wbaseItem.ParentID)
//                   )
//                   break
//                 default:
//                   let oldValue = document.getElementById(wbaseItem.GID)
//                   if (
//                     !window.getComputedStyle(parentHTML).display.match('flex')
//                   ) {
//                     initPositionStyle(wbaseItem)
//                   }
//                   if (oldValue) {
//                     try {
//                       oldValue?.replaceWith(wbaseItem.value)
//                     } catch (error) {}
//                   } else {
//                     parentHTML.appendChild(wbaseItem.value)
//                   }
//                   break
//               }
//               wbaseItem.value.id = wbaseItem.GID
//             }
//           }
//           replaceAllLyerItemHTML()
//           if (listDelete.length > 0) {
//             WBaseDA.parent([...listDelete, ...oldWBaseList])
//           } else {
//             WBaseDA.edit(oldWBaseList, action.enumObj)
//           }
//           if (
//             oldSelectList.length === 1 &&
//             (oldSelectList[0].isNew || oldSelectList[0].isEditting)
//           ) {
//             oldSelectList[0].value = document.getElementById(
//               oldSelectList[0].GID
//             )
//             if (oldSelectList[0].value) {
//               oldSelectList[0].value.contentEditable = true
//               oldSelectList[0].value.setAttribute('isCtrlZ', 'true')
//               oldSelectList[0].value.focus()
//             }
//           }
//           handleWbSelectedList(
//             oldWBaseList.filter(e => oldSelectList.some(el => e.GID === el.GID))
//           )
//         } else {
//           let deleteItems = wbase_list.filter(e =>
//             action.selected.some(selectItem => selectItem.GID === e.GID)
//           )
//           if (deleteItems.length > 0) WBaseDA.delete(deleteItems)
//           handleWbSelectedList(
//             oldSelectList.length
//               ? wbase_list.filter(e =>
//                   oldSelectList.some(selectItem => selectItem.GID === e.GID)
//                 )
//               : []
//           )
//         }
//         break
//       case EnumEvent.parent:
//         var preAction = action_list[action_index]
//         var oldSelectList = preAction?.selected ?? []
//         if (preAction) {
//           oldSelectList = oldSelectList.map(e => JSON.parse(JSON.stringify(e)))
//           let oldWBaseList = [
//             ...oldSelectList,
//             ...preAction.oldData
//               .map(e => JSON.parse(JSON.stringify(e)))
//               .filter(e => e.Level > 0)
//           ]
//           let oldParentLevel = Math.min(...preAction.oldData.map(e => e.Level))
//           let newParentLevel = Math.min(...action.oldData.map(e => e.Level))
//           let oldParent = oldWBaseList.find(e => e.Level === oldParentLevel)
//           let newParent = JSON.parse(
//             JSON.stringify(action.oldData.find(e => e.Level === newParentLevel))
//           )
//           listUpdate.push(...oldWBaseList)
//           if (oldWBaseList.every(e => e.GID !== newParent.GID)) {
//             newParent.ListChildID = newParent.ListChildID.filter(id =>
//               action.selected.every(e => e.GID !== id)
//             )
//             newParent.CountChild = newParent.ListChildID.length
//             if (oldParent?.CateID === EnumCate.variant) {
//               PropertyDA.list = PropertyDA.list.filter(
//                 e => e.BaseID !== oldParent.GID
//               )
//               PropertyDA.list.push(...oldParent.PropertyItems)
//             }
//             if (newParent.Level > 0) listUpdate.push(newParent)
//           }
//           listUpdate = listUpdate.filter(updateItem =>
//             wbase_list.some(e => updateItem.GID === e.GID)
//           )
//           wbase_list = wbase_list.filter(e =>
//             listUpdate.every(el => el.GID !== e.GID)
//           )
//           wbase_list.push(...listUpdate)
//           arrange()
//           arrange(listUpdate)
//           action.selected.forEach(e => document.getElementById(e.GID)?.remove())
//           for (let wbaseItem of listUpdate) {
//             let children = wbase_list.filter(e => e.ParentID === wbaseItem.GID)
//             initComponents(
//               wbaseItem,
//               children,
//               wbaseItem.GID !== oldParent?.GID &&
//                 wbaseItem.GID !== newParent.GID
//             )
//             wbaseItem.value
//               .querySelectorAll(
//                 `.wbaseItem-value[level="${wbaseItem.Level + 1}"]`
//               )
//               .forEach(child => {
//                 let zIndex = wbaseItem.ListChildID.indexOf(child.id)
//                 children.find(e => e.GID === child.id).Sort = zIndex
//                 child.style.zIndex = zIndex
//                 child.style.order = zIndex
//               })
//             if (
//               wbaseItem.GID === oldParent?.GID ||
//               wbaseItem.GID === newParent.GID
//             ) {
//               let parentHTML = divSection
//               if (wbaseItem.Level > 1)
//                 parentHTML = document.getElementById(wbaseItem.ParentID)
//               switch (parseInt(parentHTML?.getAttribute('cateid') ?? '0')) {
//                 case EnumCate.tree:
//                   createTree(
//                     wbase_list.find(e => e.GID === wbaseItem.ParentID),
//                     wbase_list.filter(e => e.ParentID === wbaseItem.ParentID)
//                   )
//                   break
//                 case EnumCate.table:
//                   createTable(
//                     wbase_list.find(e => e.GID === wbaseItem.ParentID),
//                     wbase_list.filter(e => e.ParentID === wbaseItem.ParentID)
//                   )
//                   break
//                 default:
//                   let oldValue = document.getElementById(wbaseItem.GID)
//                   if (
//                     !window.getComputedStyle(parentHTML).display.match('flex')
//                   ) {
//                     initPositionStyle(wbaseItem)
//                   }
//                   if (oldValue) {
//                     oldValue?.replaceWith(wbaseItem.value)
//                   } else {
//                     parentHTML.appendChild(wbaseItem.value)
//                   }
//                   break
//               }
//               wbaseItem.value.id = wbaseItem.GID
//             }
//           }
//           replaceAllLyerItemHTML()
//           WBaseDA.parent(listUpdate)
//         }
//         handleWbSelectedList(
//           listUpdate.filter(e => oldSelectList.some(el => e.GID === el.GID))
//         )
//         break
//       case EnumEvent.unDelete:
//         break
//       case EnumEvent.delete:
//         var preAction = action_list[action_index]
//         var oldSelectList = preAction?.selected ?? []
//         if (preAction) {
//           oldSelectList = oldSelectList.map(e => JSON.parse(JSON.stringify(e)))
//           listUpdate.push(
//             ...oldSelectList,
//             ...preAction.oldData
//               .map(e => JSON.parse(JSON.stringify(e)))
//               .filter(e => e.Level > 0)
//           )
//           wbase_list = wbase_list.filter(e =>
//             listUpdate.every(el => el.GID !== e.GID)
//           )
//           wbase_list.push(...listUpdate)
//           arrange()
//           arrange(listUpdate)
//           let parentLevel = Math.min(...listUpdate.map(e => e.Level))
//           for (let wbaseItem of listUpdate) {
//             wbaseItem.IsDeleted = false
//             if (wbaseItem.CateID == EnumCate.variant) {
//               PropertyDA.list = PropertyDA.list.filter(
//                 e => e.BaseID !== wbaseItem.GID
//               )
//               PropertyDA.list.push(...wbaseItem.PropertyItems)
//             }
//             if (
//               wbaseItem.BasePropertyItems &&
//               wbaseItem.BasePropertyItems.length > 0
//             ) {
//               for (let baseProperty of wbaseItem.BasePropertyItems) {
//                 let propertyItem = PropertyDA.list.find(
//                   e => e.GID === baseProperty.PropertyID
//                 )
//                 propertyItem.BasePropertyItems =
//                   propertyItem.BasePropertyItems.filter(
//                     e => e.GID != baseProperty.GID
//                   )
//                 propertyItem.BasePropertyItems.push(baseProperty)
//               }
//             }
//             let children = wbase_list.filter(e => e.ParentID === wbaseItem.GID)
//             initComponents(wbaseItem, children, wbaseItem.Level > parentLevel)
//             wbaseItem.value
//               .querySelectorAll(
//                 `.wbaseItem-value[level="${wbaseItem.Level + 1}"]`
//               )
//               .forEach(child => {
//                 let zIndex = wbaseItem.ListChildID.indexOf(child.id)
//                 children.find(e => e.GID === child.id).Sort = zIndex
//                 child.style.zIndex = zIndex
//                 child.style.order = zIndex
//               })
//             if (wbaseItem.Level === 1 || wbaseItem.Level === parentLevel) {
//               let parentHTML = divSection
//               if (wbaseItem.Level > 1)
//                 parentHTML = document.getElementById(wbaseItem.ParentID)
//               switch (parseInt(parentHTML.getAttribute('cateid'))) {
//                 case EnumCate.tree:
//                   createTree(
//                     wbase_list.find(e => e.GID === wbaseItem.ParentID),
//                     wbase_list.filter(e => e.ParentID === wbaseItem.ParentID)
//                   )
//                   break
//                 case EnumCate.table:
//                   createTable(
//                     wbase_list.find(e => e.GID === wbaseItem.ParentID),
//                     wbase_list.filter(e => e.ParentID === wbaseItem.ParentID)
//                   )
//                   break
//                 default:
//                   let oldValue = document.getElementById(wbaseItem.GID)
//                   if (
//                     !window.getComputedStyle(parentHTML).display.match('flex')
//                   ) {
//                     initPositionStyle(wbaseItem)
//                   }
//                   if (oldValue) {
//                     oldValue?.replaceWith(wbaseItem.value)
//                   } else {
//                     parentHTML.appendChild(wbaseItem.value)
//                   }
//                   break
//               }
//               wbaseItem.value.id = wbaseItem.GID
//             }
//           }
//           replaceAllLyerItemHTML()
//           if (oldSelectList.length === 1 && oldSelectList[0].isNew) {
//             oldSelectList[0].value.contentEditable = true
//             oldSelectList[0].value.setAttribute('isCtrlZ', 'true')
//             oldSelectList[0].value.focus()
//           } else {
//             WBaseDA.unDelete(listUpdate)
//           }
//         }
//         handleWbSelectedList(oldSelectList)
//         break
//       case EnumEvent.edit_delete:
//         var preAction = action_list[action_index]
//         var oldSelectList = preAction?.selected ?? []
//         if (preAction) {
//           oldSelectList = oldSelectList.map(e => JSON.parse(JSON.stringify(e)))
//           let oldWBaseList = [
//             ...oldSelectList,
//             ...preAction.oldData
//               .map(e => JSON.parse(JSON.stringify(e)))
//               .filter(e => e.Level > 0)
//           ]
//           let unDeleteList = []
//           wbase_list = wbase_list.filter(e =>
//             oldWBaseList.every(el => el.GID !== e.GID)
//           )
//           wbase_list.push(...oldWBaseList)
//           arrange()
//           arrange(oldWBaseList)
//           let parentLevel = Math.min(...oldWBaseList.map(e => e.Level))
//           for (let wbaseItem of oldWBaseList) {
//             if (
//               [...action.selected, ...action.oldData].every(
//                 el => el.GID !== wbaseItem.GID
//               )
//             ) {
//               wbaseItem.IsDeleted = false
//               unDeleteList.push(wbaseItem)
//             } else {
//               listUpdate.push(wbaseItem)
//             }
//             initComponents(
//               wbaseItem,
//               wbase_list.filter(e => e.ParentID === wbaseItem.GID),
//               wbaseItem.Level > parentLevel
//             )
//             if (wbaseItem.Level === 1 || wbaseItem.Level === parentLevel) {
//               let parentHTML = divSection
//               if (wbaseItem.Level > 1)
//                 parentHTML = document.getElementById(wbaseItem.ParentID)
//               switch (parseInt(parentHTML.getAttribute('cateid'))) {
//                 case EnumCate.tree:
//                   createTree(
//                     wbase_list.find(e => e.GID === wbaseItem.ParentID),
//                     wbase_list.filter(e => e.ParentID === wbaseItem.ParentID)
//                   )
//                   break
//                 case EnumCate.table:
//                   createTable(
//                     wbase_list.find(e => e.GID === wbaseItem.ParentID),
//                     wbase_list.filter(e => e.ParentID === wbaseItem.ParentID)
//                   )
//                   break
//                 default:
//                   let oldValue = document.getElementById(wbaseItem.GID)
//                   if (
//                     !window.getComputedStyle(parentHTML).display.match('flex')
//                   ) {
//                     initPositionStyle(wbaseItem)
//                   }
//                   if (oldValue) {
//                     try {
//                       oldValue?.replaceWith(wbaseItem.value)
//                     } catch (error) {}
//                   } else {
//                     parentHTML.appendChild(wbaseItem.value)
//                   }
//                   break
//               }
//               wbaseItem.value.id = wbaseItem.GID
//             }
//           }
//           replaceAllLyerItemHTML()
//           WBaseDA.unDelete(unDeleteList)
//           WBaseDA.edit(listUpdate, action.enumObj)
//           if (
//             oldSelectList.length === 1 &&
//             (oldSelectList[0].isNew || oldSelectList[0].isEditting)
//           ) {
//             oldSelectList[0].value.contentEditable = true
//             oldSelectList[0].value.setAttribute('isCtrlZ', 'true')
//             oldSelectList[0].value.focus()
//           }
//         }
//         handleWbSelectedList(oldSelectList)
//         break
//       default: // usually event select
//         var preAction = action_list[action_index]
//         var oldSelectList = preAction?.selected ?? []
//         if (preAction) {
//           oldSelectList = oldSelectList.map(e => JSON.parse(JSON.stringify(e)))
//           if (
//             oldSelectList.length === 1 &&
//             (oldSelectList[0].isNew || oldSelectList[0].isEditting)
//           ) {
//             oldSelectList[0].value = document.getElementById(
//               oldSelectList[0].GID
//             )
//             if (oldSelectList[0].value) {
//               oldSelectList[0].value.contentEditable = true
//               oldSelectList[0].value.setAttribute('isCtrlZ', 'true')
//               oldSelectList[0].value.focus()
//             }
//           }
//         }
//         handleWbSelectedList(
//           wbase_list.filter(e =>
//             oldSelectList.some(selectItem => e.GID === selectItem.GID)
//           )
//         )
//         break
//     }
//   } else {
//     handleWbSelectedList()
//   }
//   WBaseDA.isCtrlZ = false
// }

// function shiftCtrlZ () {
//   if (action_index < action_list.length - 1) {
//     action_index++
//     let action = action_list[action_index]
//     WBaseDA.isCtrlZ = true
//     console.log('hehehehehe', action, action_index)
//     let listUpdate = []
//     switch (action.enumEvent) {
//       case EnumEvent.add:
//         switch (action.enumObj) {
//           default:
//             listUpdate.push(
//               ...action.oldData.filter(e => e.GID != wbase_parentID),
//               ...action.selected
//             )
//             listUpdate.sort((a, b) => {
//               value = b.Level - a.Level
//               if (value == 0) {
//                 return a.Sort - b.Sort
//               } else {
//                 return value
//               }
//             })
//             wbase_list = wbase_list.filter(e =>
//               listUpdate.every(wbaseItem => wbaseItem.GID != e.GID)
//             )
//             wbase_list.push(...listUpdate)
//             arrange()
//             listUpdate.forEach(wbaseItem => {
//               let oldHTML = document.getElementById(wbaseItem.GID)
//               initComponents(
//                 wbaseItem,
//                 wbase_list.filter(e => e.ParentID == wbaseItem.GID),
//                 !oldHTML
//               )
//               if (oldHTML) {
//                 if (
//                   window
//                     .getComputedStyle(oldHTML.parentElement)
//                     .display.match('flex')
//                 ) {
//                   wbaseItem.value.style.left = null
//                   wbaseItem.value.style.top = null
//                 } else {
//                   initPositionStyle(wbaseItem)
//                 }
//                 oldHTML.replaceWith(wbaseItem.value)
//               }
//               wbaseItem.value.id = wbaseItem.GID
//             })
//             replaceAllLyerItemHTML()
//             handleWbSelectedList(action.selected, false)
//             if (action.enumObj == EnumObj.wBase) WBaseDA.add(listUpdate)
//             else WBaseDA.addStyle(listUpdate, action.enumObj)
//             break
//         }
//         break
//       case EnumEvent.edit:
//         listUpdate.push(
//           ...action.oldData.filter(e => e.GID != wbase_parentID),
//           ...action.selected
//         )
//         listUpdate.sort((a, b) => {
//           value = b.Level - a.Level
//           if (value == 0) {
//             return a.Sort - b.Sort
//           } else {
//             return value
//           }
//         })
//         wbase_list = wbase_list.filter(e =>
//           listUpdate.every(wbaseItem => wbaseItem.GID != e.GID)
//         )
//         wbase_list.push(...listUpdate)
//         arrange()
//         listUpdate.forEach(wbaseItem => {
//           let oldHTML = document.getElementById(wbaseItem.GID)
//           initComponents(
//             wbaseItem,
//             wbase_list.filter(e => e.ParentID == wbaseItem.GID),
//             !oldHTML
//           )
//           if (oldHTML) {
//             if (
//               window
//                 .getComputedStyle(oldHTML.parentElement)
//                 .display.match('flex')
//             ) {
//               wbaseItem.value.style.left = null
//               wbaseItem.value.style.top = null
//             } else {
//               initPositionStyle(wbaseItem)
//             }
//             oldHTML.replaceWith(wbaseItem.value)
//           }
//           wbaseItem.value.id = wbaseItem.GID
//         })
//         replaceAllLyerItemHTML()
//         handleWbSelectedList(action.selected, false)
//         WBaseDA.edit(listUpdate, action.enumObj)
//         break
//       case EnumEvent.parent:
//         let oldParentWBase = action.oldData.find(
//           e => e.GID == action.selected[0].ParentID
//         )
//         if (select_box_parentID != oldParentWBase.GID) {
//           if (oldParentWBase.GID != wbase_parentID) {
//             listUpdate.push(oldParentWBase)
//           }
//           listUpdate.push(...action.selected)
//           wbase_list = wbase_list.filter(e =>
//             listUpdate.every(updateItem => e.GID != updateItem.GID)
//           )
//           wbase_list.push(...listUpdate)
//           if (select_box_parentID != wbase_parentID) {
//             let currentParent = wbase_list.find(
//               e => e.GID == select_box_parentID
//             )
//             currentParent.ListChildID = currentParent.ListChildID.filter(id =>
//               action.selected.every(selectItem => selectItem.GID != id)
//             )
//             currentParent.CountChild = currentParent.ListChildID.length
//             let oldHTML = document.getElementById(currentParent.GID)
//             initComponents(
//               currentParent,
//               wbase_list.filter(e => e.ParentID == currentParent.GID),
//               !oldHTML
//             )
//             currentParent.value.id = currentParent.GID
//             if (oldHTML) {
//               if (
//                 window
//                   .getComputedStyle(oldHTML.parentElement)
//                   .display.match('flex')
//               ) {
//                 currentParent.value.style.left = null
//                 currentParent.value.style.top = null
//               } else {
//                 initPositionStyle(currentParent)
//               }
//               oldHTML.replaceWith(currentParent.value)
//             }
//           }
//           wbase_list
//             .filter(wbaseItem =>
//               action.selected.some(selectItem =>
//                 wbaseItem.ListID.includes(selectItem.GID)
//               )
//             )
//             .forEach(wbaseItem => {
//               wbaseItem.ListID = action.oldData.find(
//                 oldWbase => oldWbase.GID == wbaseItem.GID
//               ).ListID
//               wbaseItem.value.setAttribute('listid', wbaseItem.ListID)
//               wbaseItem.value.setAttribute('Level', wbaseItem.Level)
//             })
//           arrange()
//           action.selected.forEach(wbaseItem => {
//             document.getElementById(wbaseItem.GID)?.remove()
//             initComponents(
//               wbaseItem,
//               wbase_list.filter(e => e.ParentID == wbaseItem.GID)
//             )
//           })
//           if (oldParentWBase.GID != wbase_parentID) {
//             let oldHTML = document.getElementById(oldParentWBase.GID)
//             initComponents(
//               oldParentWBase,
//               wbase_list.filter(e => e.ParentID == oldParentWBase.GID),
//               !oldHTML
//             )
//             oldParentWBase.value.id = oldParentWBase.GID
//             if (oldHTML) {
//               if (
//                 window
//                   .getComputedStyle(oldHTML.parentElement)
//                   .display.match('flex')
//               ) {
//                 oldParentWBase.value.style.left = null
//                 oldParentWBase.value.style.top = null
//               } else {
//                 initPositionStyle(oldParentWBase)
//               }
//               oldHTML.replaceWith(oldParentWBase.value)
//             }
//           }
//           replaceAllLyerItemHTML()
//           selected_list = []
//           handleWbSelectedList(action.selected, false)
//         } else {
//           listUpdate.push(oldParentWBase)
//           if (select_box_parentID != wbase_parentID) {
//             let currentParent = wbase_list.find(
//               e => e.GID == select_box_parentID
//             )
//             currentParent.ListChildID = oldParentWBase.ListChildID
//           }
//           listUpdate.push(
//             ...wbase_list.filter(wbaseItem => {
//               let zIndex = oldParentWBase.ListChildID.indexOf(wbaseItem.GID)
//               if (zIndex < 0) return false
//               else {
//                 wbaseItem.Sort = zIndex
//                 wbaseItem.value.style.order = zIndex
//                 wbaseItem.value.style.zIndex = zIndex
//                 return true
//               }
//             })
//           )
//           arrange()
//           replaceAllLyerItemHTML()
//           handleWbSelectedList(selected_list, false)
//         }
//         WBaseDA.parent(listUpdate)
//         break
//       case EnumEvent.delete:
//         WBaseDA.delete(selected_list)
//         break
//       case EnumEvent.select:
//         handleWbSelectedList(
//           wbase_list.filter(e =>
//             action.selected.some(selectItem => selectItem.GID == e.GID)
//           ),
//           false
//         )
//         break
//       default:
//         break
//     }
//   }
//   WBaseDA.isCtrlZ = false
// }
