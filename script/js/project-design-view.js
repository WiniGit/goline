// khai báo biến ứng vs các view
var left_view = document.getElementById('left_view')
var right_view = document.getElementById('right_view')
var layer_view = document.getElementById('Layer')
var assets_view = document.getElementById('Assets')
var design_view = document.getElementById('Design')
var prototype_view = document.getElementById('Prototype')
var state_view = document.getElementById('State')

async function initData () {
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

function input_scale_set (value) {
  settingsPage = true
  input_scale.innerHTML = `${Math.floor(value)}%`
}

function toolStateChange (toolState) {
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

function createNewWbase ({ wb, relativeWbs = [], listId, sort }) {
  let list_new_wbase = []
  let new_wbase_item = JSON.parse(JSON.stringify(wb))
  new_wbase_item.GID = uuidv4()
  new_wbase_item.IsWini = false
  new_wbase_item.BasePropertyItems = null
  new_wbase_item.PropertyItems = null
  new_wbase_item.value = null
  new_wbase_item.ProtoType = null
  new_wbase_item.PrototypeID = null
  if (new_wbase_item.JsonEventItem)
    new_wbase_item.JsonEventItem = new_wbase_item.JsonEventItem.filter(
      e => e.Name === 'State'
    )
  if (!listId) {
    let parent_wbase = wbase_list.find(e => e.GID == new_wbase_item.ParentID)
    if (parent_wbase) {
      let list_child = wbase_list.filter(e => e.ParentID == parent_wbase.GID)
      list_child.sort((a, b) => b.Sort - a.Sort)
      new_wbase_item.ListID = parent_wbase.ListID + `,${parent_wbase.GID}`
      new_wbase_item.Level = new_wbase_item.ListID.split(',').length
      new_wbase_item.Sort = list_child.length == 0 ? 1 : list_child[0].Sort + 1
    } else {
      let list_level1 = wbase_list.filter(e => e.ParentID == wbase_parentID)
      list_level1.sort((a, b) => b.Sort - a.Sort)
      new_wbase_item.ListID = wbase_parentID
      new_wbase_item.Level = 1
      new_wbase_item.Sort =
        list_level1.length == 0 ? 1 : list_level1[0].Sort + 1
    }
  } else {
    let new_listID = listId.split(',')
    new_wbase_item.ParentID = new_listID[new_listID.length - 1]
    new_wbase_item.ListID = listId
    new_wbase_item.Sort = sort ?? wb.Sort
    new_wbase_item.Level = new_listID.length
  }
  // tạo GuiID mới cho AttributesItem nếu khác null
  if (new_wbase_item.AttributesItem) {
    let newAttributeId = uuidv4()
    new_wbase_item.AttributeID = newAttributeId
    new_wbase_item.AttributesItem.GID = newAttributeId
    if (new_wbase_item.JsonEventItem)
      new_wbase_item.AttributesItem.JsonEvent = JSON.stringify(
        new_wbase_item.JsonEventItem
      )
  }
  if (new_wbase_item.ListChildID?.length > 0) {
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
        listId: new_wbase_item.ListID + `,${new_wbase_item.GID}`,
        sort: list_child.indexOf(child)
      })
      list_new_wbase.push(...new_children)
      switch (new_wbase_item.CateID) {
        case EnumCate.table:
          new_wbase_item.AttributesItem.Content =
            new_wbase_item.AttributesItem.Content.replace(
              child.GID,
              new_children.find(e => e.ParentID === new_wbase_item.GID).GID
            )
          break
        default:
          break
      }
    }
    let new_list_child = list_new_wbase.filter(
      e => e.ParentID == new_wbase_item.GID
    )
    new_wbase_item.ListChildID = new_list_child.map(e => e.GID)
  }
  new_wbase_item.PageID = PageDA.obj.ID
  list_new_wbase.push(new_wbase_item)
  list_new_wbase.sort((a, b) => {
    let tmp = b.Level - a.Level
    if (tmp == 0) return a.Sort - b.Sort
    else return tmp
  })
  return list_new_wbase
}

//! .................................................................................................
function createWbaseHTML ({ parentid, x, y, w, h, newObj }) {
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
      let newListID = wbase_parentID
      if (parentid != wbase_parentID) {
        pWbHTML = document.getElementById(parentid)
        newListID = pWbHTML.getAttribute('listid') + `,${parentid}`
      }
      let listNewWbase = createNewWbase({
        wb: new_obj,
        relativeWbs: relativeWbase,
        listId: newListID,
        sort: pWbHTML.querySelectorAll(
          `.wbaseItem-value[level="${
            parseInt(pWbHTML.getAttribute('level') ?? '0') + 1
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
      new_obj = createNewWbase({ wb: new_obj }).pop()
      initComponents(new_obj, [])
      if (!w && tool_state === ToolState.text) {
        new_obj.Css += `width: max-content;`
        new_obj.value.setAttribute('width', 'fit')
        new_obj.value.setAttribute('height', 'fit')
      } else {
        new_obj.Css += `width: ${w ?? 100}px;height: ${h ?? 100}px;`
      }
    }

    if (pWbHTML === divSection || pWbHTML.classList.contains('w-stack')) {
      if (pWbHTML.classList.contains('w-stack')) {
        let pRect = pWbHTML.getBoundingClientRect()
        new_obj.Css += `left: ${x - offsetScale(pRect.x, 0).x}px;top: ${
          y - offsetScale(0, pRect.y).y
        }px;`
      } else {
        new_obj.Css += `left: ${x}px;top: ${y}px;`
      }
      new_obj.Sort = [
        ...pWbHTML.querySelectorAll(
          `.wbaseItem-value[level="${new_obj.Level}"]`
        )
      ]
        .map(e => e.style.zIndex ?? 0)
        .sort((a, b) => parseFloat(b) - parseFloat(a))[0]
      new_obj.value.style.zIndex = new_obj.Sort
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
      if (pWbHTML.classList.contains('w-col')) {
        let zIndex = 0
        if (children.length > 0) {
          children.sort((aHTML, bHTML) => {
            let aHTMLRect = aHTML.getBoundingClientRect()
            let bHTMLRect = bHTML.getBoundingClientRect()
            let a_center_oy = Math.abs(
              y - offsetScale(0, aHTMLRect.y + aHTMLRect.height / 2).y
            )
            let b_center_oy = Math.abs(
              y - offsetScale(0, bHTMLRect.y + bHTMLRect.height / 2).y
            )
            return a_center_oy - b_center_oy
          })
          let closestHTML = children[0]
          let closestHTMLRect = closestHTML.getBoundingClientRect()
          zIndex = parseInt(window.getComputedStyle(closestHTML).order)
          let distance =
            y - offsetScale(0, closestHTMLRect.y + closestHTMLRect.height / 2).y
          if (distance >= 0) {
            zIndex++
          }
        }
        new_obj.Sort = zIndex
        new_obj.value.style.order = zIndex
        let wbase_children = wbase_list.filter(
          wb => wb.ParentID === parentid && wb.Sort >= zIndex
        )
        for (let cWb of wbase_children) {
          cWb.Sort++
          cWb.value.style.order = cWb.Sort
        }
      } else {
        let zIndex = 0
        if (children.length > 0) {
          children.sort((aHTML, bHTML) => {
            let aHTMLRect = aHTML.getBoundingClientRect()
            let bHTMLRect = bHTML.getBoundingClientRect()
            let a_center_ox = Math.abs(
              x - offsetScale(aHTMLRect.x + aHTMLRect.width / 2, 0).x
            )
            let b_center_ox = Math.abs(
              x - offsetScale(bHTMLRect.x + bHTMLRect.width / 2, 0).x
            )
            return a_center_ox - b_center_ox
          })
          let closestHTML = children[0]
          let closestHTMLRect = closestHTML.getBoundingClientRect()
          zIndex = parseInt(window.getComputedStyle(closestHTML).order)
          let distance =
            x - offsetScale(closestHTMLRect.x + closestHTMLRect.width / 2, 0).x
          if (distance >= 0) {
            zIndex++
          }
        }
        new_obj.Sort = zIndex
        new_obj.value.style.order = zIndex
        let wbase_children = wbase_list.filter(
          wb => wb.ParentID === parentid && wb.Sort >= zIndex
        )
        for (let cWb of wbase_children) {
          cWb.Sort++
          cWb.value.style.order = cWb.Sort
        }
      }
      pWbHTML.appendChild(new_obj.value)
    }
    if (pWb) {
      let list_childID = [
        ...pWbHTML.querySelectorAll(
          `.wbaseItem-value[level="${pWb.Level + 1}"]`
        )
      ]
      list_childID.sort(
        (a, b) =>
          parseInt(a.style.zIndex ?? a.style.order ?? 0) -
          parseInt(b.style.zIndex ?? b.style.order ?? 0)
      )
      pWb.ListChildID = list_childID.map(eHTML => eHTML.id)
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

function arrange (list) {
  if (list) {
    list.sort((a, b) => {
      value = b.Level - a.Level
      if (value == 0) {
        return a.Sort - b.Sort
      } else {
        return value
      }
    })
  } else {
    wbase_list.sort((a, b) => {
      value = b.Level - a.Level
      if (value == 0) {
        return a.Sort - b.Sort
      } else {
        return value
      }
    })
  }
}

function handleWbSelectedList (newlist = []) {
  newlist = newlist.filter(e => e).slice(0, 10)
  let isChange = false
  left_view
    .querySelectorAll('.layer_wbase_tile.selected')
    .forEach(layerTile => layerTile.classList.remove('selected'))
  selectPath?.remove()
  if (newlist.length > 0) {
    isChange = selected_list.some(oldE =>
      newlist.every(newE => oldE.GID !== newE.GID)
    )
    selected_list = newlist
    for (let wb of selected_list.reverse()) {
      var layerTile = document.getElementById(`wbaseID:${wb.GID}`)
      if (layerTile) layerTile.classList.add('selected')
    }
    ;[...$(layerTile).parents(`.col > .layer_wbase_tile`)].forEach(e => {
      let layer = e.querySelector(':scope > .layer_wbase_tile')
      if (layer !== layerTile) {
        let prefixIcon = layer.querySelector('.prefix-btn')
        if (prefixIcon)
          prefixIcon.className = prefixIcon.className.replace(
            'caret-right',
            'caret-down'
          )
      }
    })
    selected_list.sort((a, b) => a.Sort - b.Sort)
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
      // if (assets_view.offsetWidth > 0 && tool_state === ToolState.move) {
      //   if (!(select_component?.ProjectID === 0)) select_component = null
      //   updateListComponentByProject({ ID: 0 })
      // }
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

function updateUISelectBox () {
  select_box = selectBox(selected_list)
  wdraw()
}

function findCell (table, event) {
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

function dragWbaseUpdate (xp, yp, event) {
  if (alt_list.length > 0) {
    alt_list.forEach(altItem => altItem.value?.remove())
    alt_list = []
  }
  let parentHTML = parent
  let new_parentID = parentHTML.id.length != 36 ? wbase_parentID : parentHTML.id
  let isTableParent = parentHTML.localName === 'table'
  document.getElementById(`demo_auto_layout`)?.remove()
  if (
    select_box_parentID !== wbase_parentID &&
    select_box_parentID === drag_start_list[0].ParentID &&
    select_box_parentID !== new_parentID
  ) {
    let oldParentHTML = document.getElementById(select_box_parentID)
    if (oldParentHTML.childElementCount - selected_list.length === 0) {
      if (oldParentHTML.getAttribute('width-type') === 'fit') {
        oldParentHTML.style.width = oldParentHTML.offsetWidth + 'px'
      }
      if (oldParentHTML.getAttribute('height-type') === 'fit') {
        oldParentHTML.style.height = oldParentHTML.offsetHeight + 'px'
      }
    }
  }
  if (isTableParent) {
    console.log('table')
    let availableCell = findCell(parentHTML, event)
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
    window.getComputedStyle(parentHTML).display.match('flex') &&
    selected_list.some(e => !e.value.classList.contains('fixed-position'))
  ) {
    let children = [
      ...parentHTML.querySelectorAll(
        `.wbaseItem-value[level="${
          parseInt(parentHTML.getAttribute('level') ?? '0') + 1
        }"]`
      )
    ]
    let isGrid = window.getComputedStyle(parentHTML).flexWrap == 'wrap'
    if (parentHTML.classList.contains('w-col')) {
      let zIndex = 0
      let distance = 0
      if (children.length > 0) {
        children.sort((aHTML, bHTML) => {
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
        })
        let closestHTML = children[0]
        if (isGrid) {
          closestHTML = children.find(
            childHTML => childHTML.getBoundingClientRect().bottom >= event.pageX
          )
        }
        if (closestHTML) {
          let htmlRect = closestHTML.getBoundingClientRect()
          zIndex = parseInt(window.getComputedStyle(closestHTML).zIndex)
          distance = event.pageY - (htmlRect.y + htmlRect.height / 2)
          if (distance < 0) {
            zIndex--
          }
        } else {
          zIndex = Math.max(
            ...children.map(childHTML => parseInt(childHTML.style.zIndex))
          )
        }
      }
      if (drag_start_list[0].ParentID != new_parentID) {
        selected_list.forEach(e => $(e.value).addClass('drag-hide'))
        let demo = document.createElement('div')
        demo.id = 'demo_auto_layout'
        demo.style.backgroundColor = '#1890FF'
        demo.style.height = `${2.4 / scale}px`
        demo.style.width = `${select_box.w * 0.8}px`
        demo.style.order = zIndex
        switch (parseInt(parentHTML.getAttribute('cateid'))) {
          case EnumCate.tree:
            parentHTML.querySelector('.children-value').appendChild(demo)
            break
          case EnumCate.carousel:
            parentHTML.querySelector('.children-value').appendChild(demo)
            break
          default:
            parentHTML.appendChild(demo)
            break
        }
      } else {
        if (selected_list.every(wbase => wbase.GID != children[0].id)) {
          children = children.filter(eHTML =>
            selected_list.every(wbase => wbase.GID != eHTML.id)
          )
          if (distance >= 0) {
            zIndex++
          }
          for (let i = 0; i < selected_list.length; i++) {
            let selectHTML = selected_list[i].value
            $(selectHTML).removeClass('drag-hide')
            selectHTML.style.position = null
            selected_list[i].Sort = zIndex + i
            selectHTML.style.zIndex = zIndex + i
            selectHTML.style.order = zIndex + i
            if (new_parentID != selected_list[i].ParentID) {
              selected_list[i].ParentID = new_parentID
              let parent_listID = parentHTML.getAttribute('listid')
              selected_list[i].ListID = parent_listID + `,${new_parentID}`
              selected_list[i].Level = selected_list[i].ListID.split(',').length
              switch (parseInt(parentHTML.getAttribute('cateid'))) {
                case EnumCate.tree:
                  parentHTML
                    .querySelector('.children-value')
                    .appendChild(selectHTML)
                  break
                case EnumCate.carousel:
                  parentHTML
                    .querySelector('.children-value')
                    .appendChild(selectHTML)
                  break
                default:
                  parentHTML.appendChild(selectHTML)
                  break
              }
            }
          }
        }
      }
    } else {
      let zIndex = 0
      let distance = 0
      if (children.length > 0) {
        children.sort((aHTML, bHTML) => {
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
        })
        let closestHTML = children[0]
        if (isGrid) {
          closestHTML = children.find(
            childHTML => childHTML.getBoundingClientRect().bottom >= event.pageY
          )
        }
        if (closestHTML) {
          let htmlRect = closestHTML.getBoundingClientRect()
          zIndex = parseInt(window.getComputedStyle(closestHTML).zIndex)
          distance = event.pageX - (htmlRect.x + htmlRect.width / 2)
          if (distance < 0) {
            zIndex--
          }
        } else {
          zIndex = Math.max(
            ...children.map(childHTML => parseInt(childHTML.style.zIndex))
          )
        }
      }
      if (drag_start_list[0].ParentID != new_parentID) {
        selected_list.forEach(e => $(e.value).addClass('drag-hide'))
        let demo = document.createElement('div')
        demo.id = 'demo_auto_layout'
        demo.style.backgroundColor = '#1890FF'
        demo.style.width = `${2.4 / scale}px`
        demo.style.height = `${select_box.h * 0.8}px`
        demo.style.order = zIndex
        switch (parseInt(parentHTML.getAttribute('cateid'))) {
          case EnumCate.tree:
            parentHTML.querySelector('.children-value').appendChild(demo)
            break
          case EnumCate.carousel:
            parentHTML.querySelector('.children-value').appendChild(demo)
            break
          default:
            parentHTML.appendChild(demo)
            break
        }
      } else {
        if (selected_list.every(wbase => wbase.GID != children[0].id)) {
          children = children.filter(eHTML =>
            selected_list.every(wbase => wbase.GID != eHTML.id)
          )
          if (distance >= 0) {
            zIndex++
          }
          for (let i = 0; i < selected_list.length; i++) {
            let selectHTML = selected_list[i].value
            $(selectHTML).removeClass('drag-hide')
            selected_list[i].Sort = zIndex + i
            selectHTML.style.zIndex = zIndex + i
            selectHTML.style.order = zIndex + i
            if (new_parentID != selected_list[i].ParentID) {
              selected_list[i].ParentID = new_parentID
              let parent_listID = parentHTML.getAttribute('listid')
              selected_list[i].ListID = parent_listID + `,${new_parentID}`
              selected_list[i].Level = selected_list[i].ListID.split(',').length
              switch (parseInt(parentHTML.getAttribute('cateid'))) {
                case EnumCate.tree:
                  parentHTML
                    .querySelector('.children-value')
                    .appendChild(selectHTML)
                  break
                case EnumCate.carousel:
                  parentHTML
                    .querySelector('.children-value')
                    .appendChild(selectHTML)
                  break
                default:
                  parentHTML.appendChild(selectHTML)
                  break
              }
            }
          }
        }
      }
    }
  } else {
    console.log('stack')
    let zIndex
    if (
      drag_start_list[0].ParentID != new_parentID &&
      select_box_parentID != new_parentID
    ) {
      let children = [
        ...parentHTML.querySelectorAll(
          `.wbaseItem-value[level="${
            parseInt(parentHTML.getAttribute('level') ?? '0') + 1
          }"]`
        )
      ]
      if (children.length > 0) {
        zIndex =
          Math.max(
            0,
            ...children.map(eHTML => {
              if (selected_list.some(wb => wb.GID === eHTML.id)) return 0
              else return parseInt(window.getComputedStyle(eHTML).zIndex)
            })
          ) + 1
      }
    }
    for (let i = 0; i < selected_list.length; i++) {
      let selectHTML = selected_list[i].value
      $(selectHTML).removeClass('drag-hide')
      selected_list[i].StyleItem.PositionItem.Left = `${
        parseFloat(
          `${drag_start_list[i].StyleItem.PositionItem.Left}`.replace('px', '')
        ) +
        xp +
        parent_offset1.x -
        offsetp.x
      }px`
      selected_list[i].StyleItem.PositionItem.Top = `${
        parseFloat(
          `${drag_start_list[i].StyleItem.PositionItem.Top}`.replace('px', '')
        ) +
        yp +
        parent_offset1.y -
        offsetp.y
      }px`
      selectHTML.style.transform = null
      selectHTML.style.left = selected_list[i].StyleItem.PositionItem.Left
      selectHTML.style.top = selected_list[i].StyleItem.PositionItem.Top
      selectHTML.style.right = null
      selectHTML.style.bottom = null
      if (selectHTML.parentElement !== parentHTML) {
        if (zIndex) {
          selectHTML.style.zIndex = zIndex + i
          selectHTML.style.order = zIndex + i
          selected_list[i].Sort = zIndex + i
        } else {
          selectHTML.style.zIndex = drag_start_list[i].Sort
          selectHTML.style.order = drag_start_list[i].Sort
          selected_list[i].Sort = drag_start_list[i].Sort
        }

        parentHTML.appendChild(selectHTML)
        selected_list[i].ParentID = new_parentID
      }
    }
  }
  select_box_parentID = selected_list[0].ParentID
}

function dragWbaseEnd () {
  if (alt_list.length > 0) {
    alt_list.forEach(altItem => altItem.value?.remove())
    alt_list = []
  }
  if (drag_start_list.length > 0) {
    WBaseDA.enumEvent = EnumEvent.edit
    let new_parentHTML = parent
    let new_parentID =
      new_parentHTML.id?.length == 36 ? new_parentHTML.id : wbase_parentID
    let isTableParent = new_parentHTML.localName === 'table'
    let parent_wbase = wbase_list.find(e => e.GID == new_parentHTML.id)
    if (isTableParent) {
      let demo = document.getElementById('demo_auto_layout')
      if (demo) {
        demo.replaceWith(...selected_list.map(e => e.value))
      }
      let listCell = parent_wbase.TableRows.reduce((a, b) => a.concat(b))
      ;[
        ...new_parentHTML.querySelectorAll(':scope > .table-row > .table-cell')
      ].forEach(cell => {
        listCell.find(e => e.id === cell.id).contentid = [...cell.childNodes]
          .map(e => e.id)
          .join(',')
      })
      WBaseDA.enumEvent = EnumEvent.parent
    }
    if (drag_start_list[0].ParentID !== new_parentID) {
      if (drag_start_list[0].ParentID !== wbase_parentID) {
        let oldParent = wbase_list.find(
          wbaseItem => wbaseItem.GID === drag_start_list[0].ParentID
        )
        if (oldParent.CateID === EnumCate.tree) {
          selected_list.forEach(wb => {
            oldParent.value
              .querySelectorAll(
                `:scope > .w-tree .wbaseItem-value[id="${wb.GID}"]`
              )
              .forEach(dlt => dlt.remove())
          })
        }
        oldParent.ListChildID = oldParent.ListChildID.filter(id =>
          selected_list.every(e => e.GID != id)
        )
        oldParent.CountChild = oldParent.ListChildID.length
        if (oldParent.CateID === EnumCate.table) {
          let listCell = oldParent.TableRows.reduce((a, b) => a.concat(b))
          ;[
            ...oldParent.value.querySelectorAll(
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
            ...oldParent.value.querySelectorAll(
              `.wbaseItem-value[level="${oldParent.Level + 1}"]`
            )
          ]
          for (let i = 0; i < wbaseChildren.length; i++) {
            wbaseChildren[i].style.zIndex = i
          }
          WBaseDA.listData.push(oldParent)
        } else if (oldParent.CountChild == 0) {
          if (oldParent.StyleItem.FrameItem.Width == null) {
            oldParent.StyleItem.FrameItem.Width = oldParent.value.offsetWidth
          }
          if (oldParent.StyleItem.FrameItem.Height == null) {
            oldParent.StyleItem.FrameItem.Height = oldParent.value.offsetHeight
          }
          WBaseDA.listData.push(oldParent)
        } else {
          handleStyleSize(oldParent)
        }
        if (oldParent?.CateID === EnumCate.variant) {
          let listProperty = PropertyDA.list.filter(
            e => e.BaseID === oldParent.GID
          )
          for (let propertyItem of listProperty) {
            propertyItem.BasePropertyItems =
              propertyItem.BasePropertyItems.filter(e =>
                selected_list.every(wbase => e.BaseID != wbase.GID)
              )
          }
        }
      }
      WBaseDA.enumEvent = EnumEvent.parent
      let drag_to_layout =
        window.getComputedStyle(new_parentHTML).display.match('flex') &&
        selected_list.some(e => !e.StyleItem.PositionItem.FixPosition)
      let zIndex
      let demo = document.getElementById('demo_auto_layout')
      if (demo) {
        zIndex = parseInt(demo.style.order)
        demo.remove()
      }
      for (let i = 0; i < selected_list.length; i++) {
        let selectHTML = selected_list[i].value
        $(selectHTML).removeClass('drag-hide')
        if (new_parentID != wbase_parentID) {
          selected_list[i].ParentID = new_parentHTML.id
          selected_list[i].ListID =
            parent_wbase.ListID + `,${new_parentHTML.id}`
          selected_list[i].Level = selected_list[i].ListID.split(',').length
          selectHTML.setAttribute('level', selected_list[i].Level)
          selectHTML.setAttribute('listid', selected_list[i].ListID)
          if (
            selected_list[i].IsWini &&
            selected_list[i].BasePropertyItems?.length > 0
          ) {
            selected_list[i].BasePropertyItems = selected_list[
              i
            ].BasePropertyItems.filter(
              e =>
                PropertyDA.list.find(property => property.GID == e.PropertyID)
                  ?.BaseID == new_parentID
            )
          }
        } else {
          selected_list[i].ParentID = wbase_parentID
          selected_list[i].ListID = wbase_parentID
          selected_list[i].Level = 1
          selectHTML.setAttribute('level', 1)
          selectHTML.setAttribute('listid', wbase_parentID)
          if (
            selected_list[i].IsWini &&
            selected_list[i].BasePropertyItems?.length > 0
          ) {
            selected_list[i].BasePropertyItems = []
          }
        }
        if (isTableParent) {
          let wbaseChildren = [
            ...new_parentHTML.querySelectorAll(
              `.wbaseItem-value[level="${parent_wbase.Level + 1}"]`
            )
          ]
          for (let j = 0; j < wbaseChildren.length; j++) {
            wbaseChildren[j].style.zIndex = j
          }
          selected_list[i].StyleItem.PositionItem.FixPosition = false
          selected_list[i].StyleItem.PositionItem.ConstraintsX =
            Constraints.left
          selected_list[i].StyleItem.PositionItem.ConstraintsY = Constraints.top
          selectHTML.style.left = null
          selectHTML.style.top = null
          selectHTML.style.right = null
          selectHTML.style.bottom = null
          selectHTML.style.transform = null
        } else if (drag_to_layout) {
          let startWbaseItem = drag_start_list.find(
            e => e.GID === selected_list[i].GID
          )
          if (
            startWbaseItem.StyleItem.FrameItem.Width < 0 &&
            parent_wbase.StyleItem.FrameItem.Width != null
          ) {
            selected_list[i].StyleItem.FrameItem.Width =
              startWbaseItem.StyleItem.FrameItem.Width
            selectHTML.style.width = '100%'
          }
          if (
            startWbaseItem.StyleItem.FrameItem.Height < 0 &&
            parent_wbase.StyleItem.FrameItem.Height != null
          ) {
            selected_list[i].StyleItem.FrameItem.Height =
              startWbaseItem.StyleItem.FrameItem.Height
            selectHTML.style.height = '100%'
          }
          switch (parseInt(new_parentHTML.getAttribute('cateid'))) {
            case EnumCate.tree:
              new_parentHTML
                .querySelector('.children-value')
                .appendChild(selectHTML)
              break
            case EnumCate.carousel:
              new_parentHTML
                .querySelector('.children-value')
                .appendChild(selectHTML)
              break
            default:
              new_parentHTML.appendChild(selectHTML)
              break
          }
          selected_list[i].StyleItem.PositionItem.FixPosition = false
          selected_list[i].StyleItem.PositionItem.ConstraintsX =
            Constraints.left
          selected_list[i].StyleItem.PositionItem.ConstraintsY = Constraints.top
          $(selectHTML).removeClass('fixed-position')
          selectHTML.style.position = null
          selectHTML.style.left = null
          selectHTML.style.right = null
          selectHTML.style.top = null
          selectHTML.style.bottom = null
          selectHTML.style.transform = null
          selectHTML.style.zIndex = zIndex + i
          selectHTML.style.order = zIndex + i
        } else {
          if (
            selected_list[i].StyleItem.FrameItem.Width != null &&
            selected_list[i].StyleItem.FrameItem.Width < 0
          )
            selected_list[i].StyleItem.FrameItem.Width = selectHTML.offsetWidth
          if (
            selected_list[i].StyleItem.FrameItem.Height != null &&
            selected_list[i].StyleItem.FrameItem.Height < 0
          )
            selected_list[i].StyleItem.FrameItem.Height =
              selectHTML.offsetHeight
          updateConstraints(selected_list[i])
        }
        let children = wbase_list.filter(wbase =>
          wbase.ListID.includes(selected_list[i].GID)
        )
        for (let j = 0; j < children.length; j++) {
          let child_listID = children[j].ListID.split(',')
          let index = child_listID.indexOf(selected_list[i].GID)
          let new_listID = selected_list[i].ListID.split(',').concat(
            child_listID.slice(index)
          )
          children[j].ListID = new_listID.join(',')
          children[j].Level = new_listID.length
          let childHTML = children[j].value
          childHTML.setAttribute('level', new_listID.length)
          childHTML.setAttribute('listid', new_listID.join(','))
        }
      }
      let children = [
        ...new_parentHTML.querySelectorAll(
          `.wbaseItem-value[level="${(parent_wbase?.Level ?? 0) + 1}"]`
        )
      ]
      children.sort(
        (a, b) => parseInt(a.style.zIndex) - parseInt(b.style.zIndex)
      )
      for (let i = 0; i < children.length; i++) {
        wbase_list.find(wbase => wbase.GID == children[i].id).Sort = i
        children[i].style.zIndex = i
        children[i].style.order = i
      }
      if (parent_wbase) {
        parent_wbase.CountChild = children.length
        parent_wbase.ListChildID = children.map(e => e.id)
      }
      WBaseDA.listData.push(...selected_list)
      if (parent_wbase) WBaseDA.listData.push(parent_wbase)
    } else if (
      window.getComputedStyle(new_parentHTML).display.match('flex') &&
      selected_list.some(e => !e.StyleItem.PositionItem.FixPosition)
    ) {
      WBaseDA.enumEvent = EnumEvent.parent
      handleStyleSize(parent_wbase)
      let children = [
        ...new_parentHTML.querySelectorAll(
          `.wbaseItem-value[level="${(parent_wbase?.Level ?? 0) + 1}"]`
        )
      ]
      children.sort(
        (a, b) => parseInt(a.style.zIndex) - parseInt(b.style.zIndex)
      )
      for (let i = 0; i < children.length; i++) {
        wbase_list.find(wbase => wbase.GID == children[i].id).Sort = i
        children[i].style.zIndex = i
        children[i].style.order = i
      }
      if (parent_wbase) {
        parent_wbase.CountChild = children.length
        parent_wbase.ListChildID = children.map(e => e.id)
      }
      initWbaseStyle(parent_wbase)
    } else if (!isTableParent) {
      for (let wbaseItem of selected_list) {
        wbaseItem.StyleItem.PositionItem.FixPosition = drag_start_list.find(
          e => e.GID === wbaseItem.GID
        ).StyleItem.PositionItem.FixPosition
        updateConstraints(wbaseItem)
      }
    }
    arrange()
    drag_start_list = []
    replaceAllLyerItemHTML()
    updateUIDesignView()
  }
  select_box_parentID = selected_list[0].ParentID
  parent = divSection
  updateHoverWbase()
  handleWbSelectedList([...selected_list])
}

// ALT copy
let tmpAltHTML = []

// new alt
function dragAltUpdate (xp, yp, event) {
  console.log('drag alt update')
  let parentHTML = parent
  if (alt_list.length == 0) {
    let isFixedWhenScroll = false
    if (
      !window
        .getComputedStyle(selected_list[0].value.parentElement)
        .display.match('flex')
    ) {
      isFixedWhenScroll = true
    }
    for (let i = 0; i < selected_list.length; i++) {
      let alt_wbase = JSON.parse(JSON.stringify(selected_list[i]))
      alt_wbase.GID = uuidv4()
      alt_wbase.ChildID = selected_list[i].GID
      alt_wbase.Sort += i
      alt_wbase.IsCopy = true
      if (isFixedWhenScroll)
        alt_wbase.StyleItem.PositionItem.FixPosition = false
      let tmp = selected_list[i].value.cloneNode(true)
      if (selected_list[i].StyleItem.FrameItem.Width < 0) {
        alt_wbase.StyleItem.FrameItem.Width = selected_list[i].value.offsetWidth
        tmp.style.width = alt_wbase.StyleItem.FrameItem.Width + 'px'
      }
      //
      if (selected_list[i].StyleItem.FrameItem.Height < 0) {
        alt_wbase.StyleItem.FrameItem.Height =
          selected_list[i].value.offsetHeight
        tmp.style.height = alt_wbase.StyleItem.FrameItem.Width + 'px'
      }
      tmpAltHTML.push(tmp)
      tmp.id = alt_wbase.GID
      alt_wbase.value = tmp
      alt_list.push(alt_wbase)
    }
  }
  let isTableParent = parentHTML.localName === 'table'
  document.getElementById(`demo_auto_layout`)?.remove()
  if (isTableParent) {
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
    window.getComputedStyle(parentHTML).display?.match('flex') &&
    alt_list.some(e => !e.StyleItem.PositionItem.FixPosition)
  ) {
    console.log('flex')
    let children = [
      ...parentHTML.querySelectorAll(
        `.wbaseItem-value[level="${
          parseInt(parentHTML.getAttribute('level') ?? '0') + 1
        }"]`
      )
    ]
    let isGrid = window.getComputedStyle(parentHTML).flexWrap == 'wrap'
    if (parentHTML.classList.contains('w-col')) {
      let zIndex = 0
      let distance = 0
      if (children.length > 0) {
        children.sort((aHTML, bHTML) => {
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
        })
        let closestHTML = children[0]
        if (isGrid) {
          closestHTML = children.find(
            childHTML => childHTML.getBoundingClientRect().bottom >= event.pageX
          )
        }
        if (closestHTML) {
          let closestRect = closestHTML.getBoundingClientRect()
          zIndex = parseInt(window.getComputedStyle(closestHTML).order)
          distance = event.pageY - (closestRect.y + closestRect.height / 2)
          if (distance < 0) {
            zIndex--
          }
        } else {
          zIndex = Math.max(
            ...children.map(childHTML => parseInt(childHTML.style.zIndex))
          )
        }
      }
      alt_list.forEach(e => $(e.value).addClass('drag-hide'))
      let demo = document.createElement('div')
      demo.id = 'demo_auto_layout'
      demo.style.backgroundColor = '#1890FF'
      demo.style.height = `${2.4 / scale}px`
      demo.style.width = `${select_box.w * 0.8}px`
      demo.style.order = zIndex
      switch (parseInt(parentHTML.getAttribute('cateid'))) {
        case EnumCate.tree:
          parentHTML.querySelector('.children-value').appendChild(demo)
          break
        case EnumCate.carousel:
          parentHTML.querySelector('.children-value').appendChild(demo)
          break
        default:
          parentHTML.appendChild(demo)
          break
      }
    } else {
      let zIndex = 0
      let distance = 0
      if (children.length > 0) {
        children.sort((aHTML, bHTML) => {
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
        })
        let closestHTML = children[0]
        if (isGrid) {
          closestHTML = children.find(
            childHTML => childHTML.getBoundingClientRect().bottom >= event.pageY
          )
        }
        if (closestHTML) {
          let closestRect = closestHTML.getBoundingClientRect()
          zIndex = parseInt(window.getComputedStyle(closestHTML).zIndex)
          distance = event.pageX - (closestRect.x + closestRect.width / 2)
          if (distance < 0) {
            zIndex--
          }
        } else {
          zIndex = Math.max(
            ...children.map(childHTML => parseInt(childHTML.style.zIndex))
          )
        }
      }
      alt_list.forEach(e => $(e.value).addClass('drag-hide'))
      let demo = document.createElement('div')
      demo.id = 'demo_auto_layout'
      demo.style.backgroundColor = '#1890FF'
      demo.style.width = `${2.4 / scale}px`
      demo.style.height = `${select_box.h * 0.8}px`
      demo.style.order = zIndex
      switch (parseInt(parentHTML.getAttribute('cateid'))) {
        case EnumCate.tree:
          parentHTML.querySelector('.children-value').appendChild(demo)
          break
        case EnumCate.carousel:
          parentHTML.querySelector('.children-value').appendChild(demo)
          break
        default:
          parentHTML.appendChild(demo)
          break
      }
    }
  } else {
    document.getElementById('demo_auto_layout')?.remove()
    let children = [
      ...parentHTML.querySelectorAll(
        `.wbaseItem-value[level="${
          parseInt(parentHTML.getAttribute('level') ?? '0') + 1
        }"]`
      )
    ]
    let zIndex = 0
    if (drag_start_list[0].ParentID != parentHTML.id) {
      zIndex =
        Math.max(
          0,
          ...children.map(eHTML =>
            parseInt(window.getComputedStyle(eHTML).zIndex)
          )
        ) + 1
    }
    for (let i = 0; i < alt_list.length; i++) {
      let selectHTML = alt_list[i].value
      selectHTML.style.position = 'absolute'
      $(selectHTML).removeClass('drag-hide')

      if (zIndex) {
        selectHTML.style.zIndex = zIndex + i
        selectHTML.style.order = zIndex + i
        alt_list[i].Sort = zIndex + i
      } else {
        selectHTML.style.zIndex = drag_start_list[i].Sort
        selectHTML.style.order = drag_start_list[i].Sort
        alt_list[i].Sort = drag_start_list[i].Sort
      }
      alt_list[i].StyleItem.PositionItem.Left = `${
        parseFloat(
          `${drag_start_list[i].StyleItem.PositionItem.Left}`.replace('px', '')
        ) +
        xp +
        parent_offset1.x -
        offsetp.x
      }px`
      alt_list[i].StyleItem.PositionItem.Top = `${
        parseFloat(
          `${drag_start_list[i].StyleItem.PositionItem.Top}`.replace('px', '')
        ) +
        yp +
        parent_offset1.y -
        offsetp.y
      }px`
      if (parentHTML.id?.length != 36) {
        alt_list[i].ParentID = wbase_parentID
        alt_list[i].ListID = wbase_parentID
        alt_list[i].Level = 1
      } else {
        alt_list[i].ParentID = parentHTML.id
        let parent_listID = parentHTML.getAttribute('listid')
        alt_list[i].ListID = parent_listID + `,${parentHTML.id}`
        alt_list[i].Level = alt_list[i].ListID.split(',').length
      }
      selectHTML.style.right = null
      selectHTML.style.bottom = null
      selectHTML.style.transform = null
      selectHTML.style.left = alt_list[i].StyleItem.PositionItem.Left
      selectHTML.style.top = alt_list[i].StyleItem.PositionItem.Top
      if (selectHTML.parentElement !== parentHTML) {
        parentHTML.appendChild(selectHTML)
      }
    }
  }
  select_box_parentID = alt_list[0].ParentID
}

function dragAltEnd () {
  console.log('dragend alt')
  if (drag_start_list.length > 0 && alt_list.length > 0) {
    WBaseDA.enumEvent = EnumEvent.copy
    let new_parentHTML = parent
    let new_parentID =
      new_parentHTML.id?.length == 36 ? new_parentHTML.id : wbase_parentID
    let isTableParent = new_parentHTML.localName === 'table'
    let parent_wbase
    let zIndex
    if (new_parentID !== wbase_parentID)
      parent_wbase = wbase_list.find(e => e.GID === new_parentID)
    let drag_to_layout = window
      .getComputedStyle(new_parentHTML)
      .display.match('flex')
    if (isTableParent) {
      let demo = document.getElementById('demo_auto_layout')
      if (demo) {
        zIndex = parent_wbase.CountChild + 1
        demo.replaceWith(...alt_list.map(e => e.value))
      }
      let listCell = parent_wbase.TableRows.reduce((a, b) => a.concat(b))
      ;[
        ...new_parentHTML.querySelectorAll(':scope > .table-row > .table-cell')
      ].forEach(cell => {
        listCell.find(e => e.id === cell.id).contentid = [...cell.childNodes]
          .map(e => e.id)
          .join(',')
      })
      parent_wbase.AttributesItem.Content = JSON.stringify(
        parent_wbase.TableRows
      )
      WBaseDA.listData.push(parent_wbase)
    } else if (drag_to_layout) {
      let demo = document.getElementById('demo_auto_layout')
      if (demo) {
        zIndex = parseInt(demo.style.order)
        demo.remove()
      }
    }
    for (let i = 0; i < alt_list.length; i++) {
      let selectHTML = alt_list[i].value
      $(selectHTML).removeClass('drag-hide')
      if (new_parentID != wbase_parentID) {
        alt_list[i].ParentID = new_parentHTML.id
        alt_list[i].ListID = parent_wbase.ListID + `,${new_parentHTML.id}`
        alt_list[i].Level = alt_list[i].ListID.split(',').length
        selectHTML.setAttribute('level', alt_list[i].Level)
        selectHTML.setAttribute('listid', alt_list[i].ListID)
      } else {
        alt_list[i].ParentID = wbase_parentID
        alt_list[i].ListID = wbase_parentID
        alt_list[i].Level = 1
        selectHTML.setAttribute('level', 1)
        selectHTML.setAttribute('listid', wbase_parentID)
      }
      if (isTableParent) {
        alt_list[i].Sort = zIndex + i + 1
        selectHTML.style.left = null
        selectHTML.style.top = null
        selectHTML.style.right = null
        selectHTML.style.bottom = null
        selectHTML.style.transform = null
        alt_list[i].StyleItem.PositionItem.FixPosition = false
        alt_list[i].StyleItem.PositionItem.ConstraintsX = Constraints.left
        alt_list[i].StyleItem.PositionItem.ConstraintsY = Constraints.top
      } else if (drag_to_layout) {
        let startWbaseItem = drag_start_list.find(
          e => e.GID === alt_list[i].ChildID
        )
        if (
          startWbaseItem.StyleItem.FrameItem.Width < 0 &&
          parent_wbase.StyleItem.FrameItem.Width != undefined
        ) {
          alt_list[i].StyleItem.FrameItem.Width =
            startWbaseItem.StyleItem.FrameItem.Width
          selectHTML.style.width = '100%'
        }
        if (
          startWbaseItem.StyleItem.FrameItem.Height < 0 &&
          parent_wbase.StyleItem.FrameItem.Height != undefined
        ) {
          alt_list[i].StyleItem.FrameItem.Height =
            startWbaseItem.StyleItem.FrameItem.Height
          selectHTML.style.height = '100%'
        }
        switch (parseInt(new_parentHTML.getAttribute('cateid'))) {
          case EnumCate.tree:
            new_parentHTML
              .querySelector('.children-value')
              .appendChild(selectHTML)
            break
          case EnumCate.carousel:
            new_parentHTML
              .querySelector('.children-value')
              .appendChild(selectHTML)
            break
          default:
            new_parentHTML.appendChild(selectHTML)
            break
        }
        alt_list[i].StyleItem.PositionItem.FixPosition = false
        alt_list[i].StyleItem.PositionItem.ConstraintsX = Constraints.left
        alt_list[i].StyleItem.PositionItem.ConstraintsY = Constraints.top
        $(selectHTML).removeClass('fixed-position')
        selectHTML.style.position = null
        selectHTML.style.left = null
        selectHTML.style.right = null
        selectHTML.style.top = null
        selectHTML.style.bottom = null
        selectHTML.style.transform = null
        selectHTML.style.zIndex = zIndex + i
        selectHTML.style.order = zIndex + i
      } else {
        if (alt_list[i].ParentID === selected_list[0].ParentID) {
          alt_list[i].StyleItem.PositionItem.FixPosition = selected_list.find(
            e => e.GID === alt_list[i].ChildID
          ).StyleItem.PositionItem.FixPosition
        }
        updateConstraints(alt_list[i])
      }
      WBaseDA.listData.push(alt_list[i])
      wbase_list.push(alt_list[i])
    }
    if (parent_wbase) {
      let children = [
        ...new_parentHTML.querySelectorAll(
          `.wbaseItem-value[level="${parent_wbase.Level + 1}"]`
        )
      ]
      children.sort(
        (a, b) => parseInt(a.style.zIndex) - parseInt(b.style.zIndex)
      )
      for (let i = 0; i < children.length; i++) {
        wbase_list.find(wbase => wbase.GID == children[i].id).Sort = i
        children[i].style.zIndex = i
        children[i].style.order = i
      }
      parent_wbase.CountChild = children.length
      parent_wbase.ListChildID = children.map(e => e.id)
      WBaseDA.listData.push(parent_wbase)
    }
    replaceAllLyerItemHTML()
    parent = divSection
    handleWbSelectedList(alt_list)
    tmpAltHTML.forEach(tmp => tmp.setAttribute('loading', 'true'))
    action_list[action_index].tmpHTML = [...tmpAltHTML]
    tmpAltHTML = []
    drag_start_list = []
    alt_list = []
  }
}

//
function handlePopupDispose (elementHTML, callback) {
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

function ctrlZ () {
  if (action_index >= 0) {
    let action = action_list[action_index]
    action_index--
    WBaseDA.isCtrlZ = true
    console.log('ctrlz action: ', action_list, action_index)
    let listUpdate = []
    switch (action.enumEvent) {
      case EnumEvent.add:
        if (action.enumObj === EnumObj.wBase) {
          let preAction = action_list[action_index]
          let oldSelectList = preAction?.selected ?? []
          let deletItems = wbase_list.filter(e =>
            action.selected.some(selectItem => selectItem.GID === e.GID)
          )
          if (deletItems.length > 0) WBaseDA.delete(deletItems)
          handleWbSelectedList(
            oldSelectList.length
              ? wbase_list.filter(e =>
                  oldSelectList.some(selectItem => selectItem.GID === e.GID)
                )
              : []
          )
        } else {
          // add style for decoration
          let preAction = action_list[action_index]
          let oldSelectList = preAction?.selected ?? []
          if (preAction) {
            oldSelectList = oldSelectList.map(e =>
              JSON.parse(JSON.stringify(e))
            )
            listUpdate.push(...oldSelectList)
            if (
              [
                EnumObj.frame,
                EnumObj.position,
                EnumObj.framePosition,
                EnumObj.autoLayoutFrame,
                EnumObj.padddingWbaseFrame
              ].some(e => e === action.enumObj)
            ) {
              listUpdate.push(
                ...preAction.oldData
                  .map(e => JSON.parse(JSON.stringify(e)))
                  .filter(
                    e =>
                      isInRange(e.Level, 0, oldSelectList[0].Level - 1) ||
                      e.Level > oldSelectList[0].Level + 1
                  )
              )
            }
            listUpdate = listUpdate.filter(updateItem =>
              wbase_list.some(e => updateItem.GID === e.GID)
            )
            wbase_list = wbase_list.filter(wbaseItem =>
              listUpdate.every(e => wbaseItem.GID !== e.GID)
            )
            wbase_list.push(...listUpdate)
            arrange()
            arrange(listUpdate)
            let parentLevel = Math.min(...listUpdate.map(e => e.Level))
            for (let wbaseItem of listUpdate) {
              initComponents(
                wbaseItem,
                wbase_list.filter(e => e.ParentID === wbaseItem.GID),
                wbaseItem.Level > parentLevel
              )
              if (wbaseItem.Level === 1 || wbaseItem.Level === parentLevel) {
                let parentHTML = divSection
                if (wbaseItem.Level > 1)
                  parentHTML = document.getElementById(wbaseItem.ParentID)
                switch (parseInt(parentHTML.getAttribute('cateid'))) {
                  case EnumCate.tree:
                    createTree(
                      wbase_list.find(e => e.GID === wbaseItem.ParentID),
                      wbase_list.filter(e => e.ParentID === wbaseItem.ParentID)
                    )
                    break
                  case EnumCate.table:
                    createTable(
                      wbase_list.find(e => e.GID === wbaseItem.ParentID),
                      wbase_list.filter(e => e.ParentID === wbaseItem.ParentID)
                    )
                    break
                  default:
                    let oldValue = document.getElementById(wbaseItem.GID)
                    if (
                      !window.getComputedStyle(parentHTML).display.match('flex')
                    ) {
                      initPositionStyle(wbaseItem)
                    }
                    if (oldValue) {
                      oldValue.replaceWith(wbaseItem.value)
                    } else {
                      parentHTML.appendChild(wbaseItem.value)
                    }
                    break
                }
                wbaseItem.value.id = wbaseItem.GID
              }
            }
            WBaseDA.edit(listUpdate, action.enumObj)
          }
          handleWbSelectedList(
            listUpdate.filter(e => oldSelectList.some(el => e.GID === el.GID))
          )
        }
        break
      case EnumEvent.edit:
        var preAction = action_list[action_index]
        var oldSelectList = preAction?.selected ?? []
        if (preAction) {
          oldSelectList = oldSelectList.map(e => JSON.parse(JSON.stringify(e)))
          let oldWBaseList = [
            ...oldSelectList,
            ...preAction.oldData
              .map(e => JSON.parse(JSON.stringify(e)))
              .filter(e => e.Level > 0)
          ]
          listUpdate = [
            ...action.selected,
            ...action.oldData.filter(e => e.Level > 0)
          ].map(e => JSON.parse(JSON.stringify(e)))
          let listDelete = listUpdate.filter(e => {
            let check =
              e.Level > 0 && oldWBaseList.every(oldE => oldE.GID !== e.GID)
            if (check) {
              e.IsDeleted = true
              document.getElementById(e.GID)?.remove()
            }
            return check
          })
          oldWBaseList = oldWBaseList.filter(updateItem =>
            wbase_list.some(e => updateItem.GID === e.GID)
          )
          wbase_list = wbase_list.filter(e =>
            listUpdate.every(el => el.GID !== e.GID)
          )
          wbase_list.push(...oldWBaseList)
          arrange()
          arrange(oldWBaseList)
          let parentLevel = Math.min(...oldWBaseList.map(e => e.Level))
          for (let wbaseItem of oldWBaseList) {
            initComponents(
              wbaseItem,
              wbase_list.filter(e => e.ParentID === wbaseItem.GID),
              wbaseItem.Level > parentLevel
            )
            if (wbaseItem.Level === 1 || wbaseItem.Level === parentLevel) {
              let parentHTML = divSection
              if (wbaseItem.Level > 1)
                parentHTML = document.getElementById(wbaseItem.ParentID)
              switch (parseInt(parentHTML.getAttribute('cateid'))) {
                case EnumCate.tree:
                  createTree(
                    wbase_list.find(e => e.GID === wbaseItem.ParentID),
                    wbase_list.filter(e => e.ParentID === wbaseItem.ParentID)
                  )
                  break
                case EnumCate.table:
                  createTable(
                    wbase_list.find(e => e.GID === wbaseItem.ParentID),
                    wbase_list.filter(e => e.ParentID === wbaseItem.ParentID)
                  )
                  break
                default:
                  let oldValue = document.getElementById(wbaseItem.GID)
                  if (
                    !window.getComputedStyle(parentHTML).display.match('flex')
                  ) {
                    initPositionStyle(wbaseItem)
                  }
                  if (oldValue) {
                    try {
                      oldValue?.replaceWith(wbaseItem.value)
                    } catch (error) {}
                  } else {
                    parentHTML.appendChild(wbaseItem.value)
                  }
                  break
              }
              wbaseItem.value.id = wbaseItem.GID
            }
          }
          replaceAllLyerItemHTML()
          if (listDelete.length > 0) {
            WBaseDA.parent([...listDelete, ...oldWBaseList])
          } else {
            WBaseDA.edit(oldWBaseList, action.enumObj)
          }
          if (
            oldSelectList.length === 1 &&
            (oldSelectList[0].isNew || oldSelectList[0].isEditting)
          ) {
            oldSelectList[0].value = document.getElementById(
              oldSelectList[0].GID
            )
            if (oldSelectList[0].value) {
              oldSelectList[0].value.contentEditable = true
              oldSelectList[0].value.setAttribute('isCtrlZ', 'true')
              oldSelectList[0].value.focus()
            }
          }
          handleWbSelectedList(
            oldWBaseList.filter(e => oldSelectList.some(el => e.GID === el.GID))
          )
        } else {
          let deleteItems = wbase_list.filter(e =>
            action.selected.some(selectItem => selectItem.GID === e.GID)
          )
          if (deleteItems.length > 0) WBaseDA.delete(deleteItems)
          handleWbSelectedList(
            oldSelectList.length
              ? wbase_list.filter(e =>
                  oldSelectList.some(selectItem => selectItem.GID === e.GID)
                )
              : []
          )
        }
        break
      case EnumEvent.parent:
        var preAction = action_list[action_index]
        var oldSelectList = preAction?.selected ?? []
        if (preAction) {
          oldSelectList = oldSelectList.map(e => JSON.parse(JSON.stringify(e)))
          let oldWBaseList = [
            ...oldSelectList,
            ...preAction.oldData
              .map(e => JSON.parse(JSON.stringify(e)))
              .filter(e => e.Level > 0)
          ]
          let oldParentLevel = Math.min(...preAction.oldData.map(e => e.Level))
          let newParentLevel = Math.min(...action.oldData.map(e => e.Level))
          let oldParent = oldWBaseList.find(e => e.Level === oldParentLevel)
          let newParent = JSON.parse(
            JSON.stringify(action.oldData.find(e => e.Level === newParentLevel))
          )
          listUpdate.push(...oldWBaseList)
          if (oldWBaseList.every(e => e.GID !== newParent.GID)) {
            newParent.ListChildID = newParent.ListChildID.filter(id =>
              action.selected.every(e => e.GID !== id)
            )
            newParent.CountChild = newParent.ListChildID.length
            if (oldParent?.CateID === EnumCate.variant) {
              PropertyDA.list = PropertyDA.list.filter(
                e => e.BaseID !== oldParent.GID
              )
              PropertyDA.list.push(...oldParent.PropertyItems)
            }
            if (newParent.Level > 0) listUpdate.push(newParent)
          }
          listUpdate = listUpdate.filter(updateItem =>
            wbase_list.some(e => updateItem.GID === e.GID)
          )
          wbase_list = wbase_list.filter(e =>
            listUpdate.every(el => el.GID !== e.GID)
          )
          wbase_list.push(...listUpdate)
          arrange()
          arrange(listUpdate)
          action.selected.forEach(e => document.getElementById(e.GID)?.remove())
          for (let wbaseItem of listUpdate) {
            let children = wbase_list.filter(e => e.ParentID === wbaseItem.GID)
            initComponents(
              wbaseItem,
              children,
              wbaseItem.GID !== oldParent?.GID &&
                wbaseItem.GID !== newParent.GID
            )
            wbaseItem.value
              .querySelectorAll(
                `.wbaseItem-value[level="${wbaseItem.Level + 1}"]`
              )
              .forEach(child => {
                let zIndex = wbaseItem.ListChildID.indexOf(child.id)
                children.find(e => e.GID === child.id).Sort = zIndex
                child.style.zIndex = zIndex
                child.style.order = zIndex
              })
            if (
              wbaseItem.GID === oldParent?.GID ||
              wbaseItem.GID === newParent.GID
            ) {
              let parentHTML = divSection
              if (wbaseItem.Level > 1)
                parentHTML = document.getElementById(wbaseItem.ParentID)
              switch (parseInt(parentHTML?.getAttribute('cateid') ?? '0')) {
                case EnumCate.tree:
                  createTree(
                    wbase_list.find(e => e.GID === wbaseItem.ParentID),
                    wbase_list.filter(e => e.ParentID === wbaseItem.ParentID)
                  )
                  break
                case EnumCate.table:
                  createTable(
                    wbase_list.find(e => e.GID === wbaseItem.ParentID),
                    wbase_list.filter(e => e.ParentID === wbaseItem.ParentID)
                  )
                  break
                default:
                  let oldValue = document.getElementById(wbaseItem.GID)
                  if (
                    !window.getComputedStyle(parentHTML).display.match('flex')
                  ) {
                    initPositionStyle(wbaseItem)
                  }
                  if (oldValue) {
                    oldValue?.replaceWith(wbaseItem.value)
                  } else {
                    parentHTML.appendChild(wbaseItem.value)
                  }
                  break
              }
              wbaseItem.value.id = wbaseItem.GID
            }
          }
          replaceAllLyerItemHTML()
          WBaseDA.parent(listUpdate)
        }
        handleWbSelectedList(
          listUpdate.filter(e => oldSelectList.some(el => e.GID === el.GID))
        )
        break
      case EnumEvent.unDelete:
        break
      case EnumEvent.delete:
        var preAction = action_list[action_index]
        var oldSelectList = preAction?.selected ?? []
        if (preAction) {
          oldSelectList = oldSelectList.map(e => JSON.parse(JSON.stringify(e)))
          listUpdate.push(
            ...oldSelectList,
            ...preAction.oldData
              .map(e => JSON.parse(JSON.stringify(e)))
              .filter(e => e.Level > 0)
          )
          wbase_list = wbase_list.filter(e =>
            listUpdate.every(el => el.GID !== e.GID)
          )
          wbase_list.push(...listUpdate)
          arrange()
          arrange(listUpdate)
          let parentLevel = Math.min(...listUpdate.map(e => e.Level))
          for (let wbaseItem of listUpdate) {
            wbaseItem.IsDeleted = false
            if (wbaseItem.CateID == EnumCate.variant) {
              PropertyDA.list = PropertyDA.list.filter(
                e => e.BaseID !== wbaseItem.GID
              )
              PropertyDA.list.push(...wbaseItem.PropertyItems)
            }
            if (
              wbaseItem.BasePropertyItems &&
              wbaseItem.BasePropertyItems.length > 0
            ) {
              for (let baseProperty of wbaseItem.BasePropertyItems) {
                let propertyItem = PropertyDA.list.find(
                  e => e.GID === baseProperty.PropertyID
                )
                propertyItem.BasePropertyItems =
                  propertyItem.BasePropertyItems.filter(
                    e => e.GID != baseProperty.GID
                  )
                propertyItem.BasePropertyItems.push(baseProperty)
              }
            }
            let children = wbase_list.filter(e => e.ParentID === wbaseItem.GID)
            initComponents(wbaseItem, children, wbaseItem.Level > parentLevel)
            wbaseItem.value
              .querySelectorAll(
                `.wbaseItem-value[level="${wbaseItem.Level + 1}"]`
              )
              .forEach(child => {
                let zIndex = wbaseItem.ListChildID.indexOf(child.id)
                children.find(e => e.GID === child.id).Sort = zIndex
                child.style.zIndex = zIndex
                child.style.order = zIndex
              })
            if (wbaseItem.Level === 1 || wbaseItem.Level === parentLevel) {
              let parentHTML = divSection
              if (wbaseItem.Level > 1)
                parentHTML = document.getElementById(wbaseItem.ParentID)
              switch (parseInt(parentHTML.getAttribute('cateid'))) {
                case EnumCate.tree:
                  createTree(
                    wbase_list.find(e => e.GID === wbaseItem.ParentID),
                    wbase_list.filter(e => e.ParentID === wbaseItem.ParentID)
                  )
                  break
                case EnumCate.table:
                  createTable(
                    wbase_list.find(e => e.GID === wbaseItem.ParentID),
                    wbase_list.filter(e => e.ParentID === wbaseItem.ParentID)
                  )
                  break
                default:
                  let oldValue = document.getElementById(wbaseItem.GID)
                  if (
                    !window.getComputedStyle(parentHTML).display.match('flex')
                  ) {
                    initPositionStyle(wbaseItem)
                  }
                  if (oldValue) {
                    oldValue?.replaceWith(wbaseItem.value)
                  } else {
                    parentHTML.appendChild(wbaseItem.value)
                  }
                  break
              }
              wbaseItem.value.id = wbaseItem.GID
            }
          }
          replaceAllLyerItemHTML()
          if (oldSelectList.length === 1 && oldSelectList[0].isNew) {
            oldSelectList[0].value.contentEditable = true
            oldSelectList[0].value.setAttribute('isCtrlZ', 'true')
            oldSelectList[0].value.focus()
          } else {
            WBaseDA.unDelete(listUpdate)
          }
        }
        handleWbSelectedList(oldSelectList)
        break
      case EnumEvent.edit_delete:
        var preAction = action_list[action_index]
        var oldSelectList = preAction?.selected ?? []
        if (preAction) {
          oldSelectList = oldSelectList.map(e => JSON.parse(JSON.stringify(e)))
          let oldWBaseList = [
            ...oldSelectList,
            ...preAction.oldData
              .map(e => JSON.parse(JSON.stringify(e)))
              .filter(e => e.Level > 0)
          ]
          let unDeleteList = []
          wbase_list = wbase_list.filter(e =>
            oldWBaseList.every(el => el.GID !== e.GID)
          )
          wbase_list.push(...oldWBaseList)
          arrange()
          arrange(oldWBaseList)
          let parentLevel = Math.min(...oldWBaseList.map(e => e.Level))
          for (let wbaseItem of oldWBaseList) {
            if (
              [...action.selected, ...action.oldData].every(
                el => el.GID !== wbaseItem.GID
              )
            ) {
              wbaseItem.IsDeleted = false
              unDeleteList.push(wbaseItem)
            } else {
              listUpdate.push(wbaseItem)
            }
            initComponents(
              wbaseItem,
              wbase_list.filter(e => e.ParentID === wbaseItem.GID),
              wbaseItem.Level > parentLevel
            )
            if (wbaseItem.Level === 1 || wbaseItem.Level === parentLevel) {
              let parentHTML = divSection
              if (wbaseItem.Level > 1)
                parentHTML = document.getElementById(wbaseItem.ParentID)
              switch (parseInt(parentHTML.getAttribute('cateid'))) {
                case EnumCate.tree:
                  createTree(
                    wbase_list.find(e => e.GID === wbaseItem.ParentID),
                    wbase_list.filter(e => e.ParentID === wbaseItem.ParentID)
                  )
                  break
                case EnumCate.table:
                  createTable(
                    wbase_list.find(e => e.GID === wbaseItem.ParentID),
                    wbase_list.filter(e => e.ParentID === wbaseItem.ParentID)
                  )
                  break
                default:
                  let oldValue = document.getElementById(wbaseItem.GID)
                  if (
                    !window.getComputedStyle(parentHTML).display.match('flex')
                  ) {
                    initPositionStyle(wbaseItem)
                  }
                  if (oldValue) {
                    try {
                      oldValue?.replaceWith(wbaseItem.value)
                    } catch (error) {}
                  } else {
                    parentHTML.appendChild(wbaseItem.value)
                  }
                  break
              }
              wbaseItem.value.id = wbaseItem.GID
            }
          }
          replaceAllLyerItemHTML()
          WBaseDA.unDelete(unDeleteList)
          WBaseDA.edit(listUpdate, action.enumObj)
          if (
            oldSelectList.length === 1 &&
            (oldSelectList[0].isNew || oldSelectList[0].isEditting)
          ) {
            oldSelectList[0].value.contentEditable = true
            oldSelectList[0].value.setAttribute('isCtrlZ', 'true')
            oldSelectList[0].value.focus()
          }
        }
        handleWbSelectedList(oldSelectList)
        break
      default: // usually event select
        var preAction = action_list[action_index]
        var oldSelectList = preAction?.selected ?? []
        if (preAction) {
          oldSelectList = oldSelectList.map(e => JSON.parse(JSON.stringify(e)))
          if (
            oldSelectList.length === 1 &&
            (oldSelectList[0].isNew || oldSelectList[0].isEditting)
          ) {
            oldSelectList[0].value = document.getElementById(
              oldSelectList[0].GID
            )
            if (oldSelectList[0].value) {
              oldSelectList[0].value.contentEditable = true
              oldSelectList[0].value.setAttribute('isCtrlZ', 'true')
              oldSelectList[0].value.focus()
            }
          }
        }
        handleWbSelectedList(
          wbase_list.filter(e =>
            oldSelectList.some(selectItem => e.GID === selectItem.GID)
          )
        )
        break
    }
  } else {
    handleWbSelectedList()
  }
  WBaseDA.isCtrlZ = false
}

function shiftCtrlZ () {
  if (action_index < action_list.length - 1) {
    action_index++
    let action = action_list[action_index]
    WBaseDA.isCtrlZ = true
    console.log('hehehehehe', action, action_index)
    let listUpdate = []
    switch (action.enumEvent) {
      case EnumEvent.add:
        switch (action.enumObj) {
          default:
            listUpdate.push(
              ...action.oldData.filter(e => e.GID != wbase_parentID),
              ...action.selected
            )
            listUpdate.sort((a, b) => {
              value = b.Level - a.Level
              if (value == 0) {
                return a.Sort - b.Sort
              } else {
                return value
              }
            })
            wbase_list = wbase_list.filter(e =>
              listUpdate.every(wbaseItem => wbaseItem.GID != e.GID)
            )
            wbase_list.push(...listUpdate)
            arrange()
            listUpdate.forEach(wbaseItem => {
              let oldHTML = document.getElementById(wbaseItem.GID)
              initComponents(
                wbaseItem,
                wbase_list.filter(e => e.ParentID == wbaseItem.GID),
                !oldHTML
              )
              if (oldHTML) {
                if (
                  window
                    .getComputedStyle(oldHTML.parentElement)
                    .display.match('flex')
                ) {
                  wbaseItem.value.style.left = null
                  wbaseItem.value.style.top = null
                } else {
                  initPositionStyle(wbaseItem)
                }
                oldHTML.replaceWith(wbaseItem.value)
              }
              wbaseItem.value.id = wbaseItem.GID
            })
            replaceAllLyerItemHTML()
            handleWbSelectedList(action.selected, false)
            if (action.enumObj == EnumObj.wBase) WBaseDA.add(listUpdate)
            else WBaseDA.addStyle(listUpdate, action.enumObj)
            break
        }
        break
      case EnumEvent.edit:
        listUpdate.push(
          ...action.oldData.filter(e => e.GID != wbase_parentID),
          ...action.selected
        )
        listUpdate.sort((a, b) => {
          value = b.Level - a.Level
          if (value == 0) {
            return a.Sort - b.Sort
          } else {
            return value
          }
        })
        wbase_list = wbase_list.filter(e =>
          listUpdate.every(wbaseItem => wbaseItem.GID != e.GID)
        )
        wbase_list.push(...listUpdate)
        arrange()
        listUpdate.forEach(wbaseItem => {
          let oldHTML = document.getElementById(wbaseItem.GID)
          initComponents(
            wbaseItem,
            wbase_list.filter(e => e.ParentID == wbaseItem.GID),
            !oldHTML
          )
          if (oldHTML) {
            if (
              window
                .getComputedStyle(oldHTML.parentElement)
                .display.match('flex')
            ) {
              wbaseItem.value.style.left = null
              wbaseItem.value.style.top = null
            } else {
              initPositionStyle(wbaseItem)
            }
            oldHTML.replaceWith(wbaseItem.value)
          }
          wbaseItem.value.id = wbaseItem.GID
        })
        replaceAllLyerItemHTML()
        handleWbSelectedList(action.selected, false)
        WBaseDA.edit(listUpdate, action.enumObj)
        break
      case EnumEvent.parent:
        let oldParentWBase = action.oldData.find(
          e => e.GID == action.selected[0].ParentID
        )
        if (select_box_parentID != oldParentWBase.GID) {
          if (oldParentWBase.GID != wbase_parentID) {
            listUpdate.push(oldParentWBase)
          }
          listUpdate.push(...action.selected)
          wbase_list = wbase_list.filter(e =>
            listUpdate.every(updateItem => e.GID != updateItem.GID)
          )
          wbase_list.push(...listUpdate)
          if (select_box_parentID != wbase_parentID) {
            let currentParent = wbase_list.find(
              e => e.GID == select_box_parentID
            )
            currentParent.ListChildID = currentParent.ListChildID.filter(id =>
              action.selected.every(selectItem => selectItem.GID != id)
            )
            currentParent.CountChild = currentParent.ListChildID.length
            let oldHTML = document.getElementById(currentParent.GID)
            initComponents(
              currentParent,
              wbase_list.filter(e => e.ParentID == currentParent.GID),
              !oldHTML
            )
            currentParent.value.id = currentParent.GID
            if (oldHTML) {
              if (
                window
                  .getComputedStyle(oldHTML.parentElement)
                  .display.match('flex')
              ) {
                currentParent.value.style.left = null
                currentParent.value.style.top = null
              } else {
                initPositionStyle(currentParent)
              }
              oldHTML.replaceWith(currentParent.value)
            }
          }
          wbase_list
            .filter(wbaseItem =>
              action.selected.some(selectItem =>
                wbaseItem.ListID.includes(selectItem.GID)
              )
            )
            .forEach(wbaseItem => {
              wbaseItem.ListID = action.oldData.find(
                oldWbase => oldWbase.GID == wbaseItem.GID
              ).ListID
              wbaseItem.value.setAttribute('listid', wbaseItem.ListID)
              wbaseItem.value.setAttribute('Level', wbaseItem.Level)
            })
          arrange()
          action.selected.forEach(wbaseItem => {
            document.getElementById(wbaseItem.GID)?.remove()
            initComponents(
              wbaseItem,
              wbase_list.filter(e => e.ParentID == wbaseItem.GID)
            )
          })
          if (oldParentWBase.GID != wbase_parentID) {
            let oldHTML = document.getElementById(oldParentWBase.GID)
            initComponents(
              oldParentWBase,
              wbase_list.filter(e => e.ParentID == oldParentWBase.GID),
              !oldHTML
            )
            oldParentWBase.value.id = oldParentWBase.GID
            if (oldHTML) {
              if (
                window
                  .getComputedStyle(oldHTML.parentElement)
                  .display.match('flex')
              ) {
                oldParentWBase.value.style.left = null
                oldParentWBase.value.style.top = null
              } else {
                initPositionStyle(oldParentWBase)
              }
              oldHTML.replaceWith(oldParentWBase.value)
            }
          }
          replaceAllLyerItemHTML()
          selected_list = []
          handleWbSelectedList(action.selected, false)
        } else {
          listUpdate.push(oldParentWBase)
          if (select_box_parentID != wbase_parentID) {
            let currentParent = wbase_list.find(
              e => e.GID == select_box_parentID
            )
            currentParent.ListChildID = oldParentWBase.ListChildID
          }
          listUpdate.push(
            ...wbase_list.filter(wbaseItem => {
              let zIndex = oldParentWBase.ListChildID.indexOf(wbaseItem.GID)
              if (zIndex < 0) return false
              else {
                wbaseItem.Sort = zIndex
                wbaseItem.value.style.order = zIndex
                wbaseItem.value.style.zIndex = zIndex
                return true
              }
            })
          )
          arrange()
          replaceAllLyerItemHTML()
          handleWbSelectedList(selected_list, false)
        }
        WBaseDA.parent(listUpdate)
        break
      case EnumEvent.delete:
        WBaseDA.delete(selected_list)
        break
      case EnumEvent.select:
        handleWbSelectedList(
          wbase_list.filter(e =>
            action.selected.some(selectItem => selectItem.GID == e.GID)
          ),
          false
        )
        break
      default:
        break
    }
  }
  WBaseDA.isCtrlZ = false
}
