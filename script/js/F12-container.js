class F12Container {
  static selected_id
  static api_input

  static wbase_id
  static input_id
}
{
  $('body').on('click', '.f12-container .close-f12-container', function (ev) {
    showF12 = false
    $('.f12-container').hide()
  })

  // TODO: Load F12 Html
  $('.f12-container').load('/View/f12-container.html', function (ev) {})

  // TODO: Resize F12 container
  let on_resize = false
  $('body').on('mousedown', function (ev) {
    if ($(ev.target).is('.f12-resize-line')) {
      on_resize = true
    }
  })

  $('body').on('mouseup', function (ev) {
    if (on_resize) {
      on_resize = false
    }
  })

  $('body').on('mousemove', function (ev) {
    if (on_resize) {
      ev.stopPropagation()
      $('.f12-container').css('height', $('body').height() - ev.pageY)
    }
  })

  // TODO: Switch tab
  function f12_getRequest () {
    let list = selected_list.filterAndMap(e => e.ApiID)
    if (list.length == 1 && list[0] != null) {
      F12Container.selected_id = list[0]
      RequestDA.getDataByID(list[0])
      return RequestDA.list.find(e => e.GID == list[0])
    } else {
      f12_update_listOutputRow()
      return null
    }
  }

  // function create_wbaseRow(item, space) {
  //     let wbase = '<div class="wbase-option regular11 text-white" style="padding-left:' + `${12 + space}` + 'px">' + item.Name + '</div>';

  //     if (item.CountChild > 0) {
  //         let list_childItem = wbase_list.filter((e) => item.ListChildID.some((el) => el == e.GID));
  //         for (let i = 0; i < list_childItem.length; i++) {
  //             wbase += create_wbaseRow(list_childItem[i], space + 8);
  //         }
  //     }
  //     return wbase;
  // }

  function f12_update_selectWbase () {
    switch ($($('.f12-container .tab.selected')).data('tab')) {
      case 1:
        if (selected_list.length > 0) {
          $(
            '.f12-container .select-api-container .show-select-request-button'
          ).addClass('active')
        } else {
          $(
            '.f12-container .select-api-container .show-select-request-button'
          ).removeClass('active')
        }
        let request = f12_getRequest()
        $('.f12-container .select-api-container .selected-request').val(
          request?.Url ?? ''
        )
        // f12_update_listOutputRow();
        break
      case 2:
        $(
          '.f12-container .select-api-container .show-select-request-button'
        ).addClass('active')
        $('.f12-container .select-api-container .selected-request').val(
          F12Container.api_input?.Url ?? ''
        )
        // ! add function update list input UI
        f12_update_listInputRow()
        break
    }

    if (
      selected_list.length == 1 &&
      $('.f12-container').css('display') != 'none'
    ) {
      let parent =
        selected_list[0].Level == 1
          ? selected_list[0]
          : wbase_list.find(e => e.GID == selected_list[0].ListID.split(',')[1])
      let list_tab = wbase_list.filter(e => e.PrototypeID == parent.GID)
      let tab = ''
      let tabview = ''
      if (list_tab.length > 0) {
        for (let item of list_tab) {
          let prototype_item = item.JsonEventItem.find(
            e => e.Name == 'Prototype'
          )
          let parent_item =
            item.Level == 1
              ? item
              : wbase_list.find(e => e.GID == item.ListID.split(',')[1])
          if (prototype_item != null && prototype_item.Data.length > 0) {
            tab +=
              '<div data-tab="' +
              `${4 + list_tab.indexOf(item)}` +
              '" data-id="' +
              `${item.GID}` +
              '" class="prototype-tab tab semibold11 text-disable center">' +
              parent_item.Name +
              '</div>'
            tabview +=
              '<div data-tab="' +
              `${4 + list_tab.indexOf(item)}` +
              '" class="prototype-view  view col ">' +
              '   <div class="table-row table-header row">' +
              '       <div class="table-cell regular11 row-index center">STT</div>' +
              '       <div class="table-cell regular11 row-name">Name Field</div>' +
              '       <div class="table-cell regular11 row-value">Prototype data</div>' +
              '       <div class="table-cell regular11 row-calculate last">Calculate</div>' +
              '   </div>' +
              '   <div class="table-body col"></div>' +
              '   <div class="f12-select-data-popup wini_popup col"></div>' +
              '</div>'
          }
        }
      }

      $('.list-prototype-data').html(tab)
      $('.list-tabview-prototype').html(tabview)
    } else {
      $('.list-prototype-data').html('')
      $('.list-tabview-prototype').html('')
    }
  }
  let wdata_id
  $('body').on(
    'click',
    '.prototype-view .row-value:not(.table-header)',
    function (ev) {
      ev.stopPropagation()
      update_UI_dataPrototype()
      $('.f12-select-data-popup').css('width', $(this).width() + 24)
      $('.f12-select-data-popup').css(
        'top',
        $(this).parent().offset().top - $('.f12-container').offset().top + 36
      )
      $('.f12-select-data-popup').css('left', $(this).offset().left)
      wdata_id = $(this).parent().data('id')
    }
  )

  $('body').on('click', '.f12-container .tab', function (ev) {
    $('.f12-container .tab').removeClass('selected')
    $(this).addClass('selected')
    $('.f12-container .tab-bar-view .view').removeClass('selected')
    $(
      '.f12-container .tab-bar-view .view[data-tab="' +
        $(this).data('tab') +
        '"]'
    ).addClass('selected')

    $('.wbaseItem-value').removeClass('selected')
    switch ($($('.f12-container .tab.selected')).data('tab')) {
      case 1:
        if (selected_list.length > 0) {
          $(
            '.f12-container .select-api-container .show-select-request-button'
          ).addClass('active')
        } else {
          $(
            '.f12-container .select-api-container .show-select-request-button'
          ).removeClass('active')
        }
        let request = f12_getRequest()
        $('.f12-container .select-api-container .selected-request').val(
          request?.Url ?? ''
        )
        // f12_update_listOutputRow();
        break
      case 2:
        $(
          '.f12-container .select-api-container .show-select-request-button'
        ).addClass('active')
        $('.f12-container .select-api-container .selected-request').val(
          F12Container.api_input?.Url ?? ''
        )
        // ! add function update list input UI
        f12_update_listInputRow()
        break
      case 3:
        break
      default:
        update_UI_dataView()
      // $('.select-api-container').hide();
      // $('.tab-bar-view').css('width', $('.tab-bar-view').width() + 48);
    }
  })

  // TODO: Select request
  $('body').on(
    'click',
    '.f12-container .select-api-container .show-select-request-button',
    function (ev) {
      ev.stopPropagation()
      if ($(this).hasClass('active')) {
        $('.f12-container .select-api-container .select-request-popup').css(
          'top',
          92
        )
        f12_update_listRequest()
      }
    }
  )

  function f12_create_requestRow (item) {
    let request_row =
      '<div data-id="' +
      `${item.GID}` +
      '" class="request-row col text-white ' +
      `${item.GID == F12Container.selected_id ? 'selected' : ''}` +
      '">' +
      '   <div class="regular0 text-subtitle-white">' +
      `${CollectionDA.getElementByID(item.CollectionID).Name}/ ${item.Name}` +
      '</div>' +
      '   <div class="regular11 text-white">' +
      `${item.Url}` +
      '</div>' +
      '</div>'
    return request_row
  }

  function f12_update_listRequest () {
    let list_request =
      '<div class="request-row row regular11 text-white">None</div>'
    for (let i = 0; i < RequestDA.list.length; i++) {
      list_request += f12_create_requestRow(RequestDA.list[i])
    }

    $('.f12-container .select-api-container .select-request-popup').html(
      list_request
    )
    $('.f12-container .select-api-container .select-request-popup').css(
      'display',
      'flex'
    )
  }

  function f12_clear_dataOutput (item) {
    let list = wbase_list.filter(e => e.ListID.includes(item.GID))
    for (let item of list) {
      item.AttributesItem.OutputID = null
      item.AttributesItem.DataType = null
    }
  }

  $('body').on('click', '.select-request-popup .request-row', function (ev) {
    F12Container.selected_id = $(this).data('id')
    debugger
    if ($(this).data('id')) {
      debugger
      RequestDA.getDataByID($(this).data('id'))
    }
    let request = RequestDA.list.find(e => e.GID == $(this).data('id'))
    $('.f12-container .select-api-container .selected-request').val(
      request?.Url ?? ''
    )
    switch ($($('.f12-container .tab.selected')).data('tab')) {
      case 1:
        for (let i = 0; i < selected_list.length; i++) {
          if (selected_list[i].ApiID != $(this).data('id')) {
            f12_clear_dataOutput(selected_list[i])
          }
          f12_update_listOutputRow()
          selected_list[i].ApiID = $(this).data('id')
        }
        WBaseDA.edit(selected_list, EnumObj.wBaseAttribute)
        break
      case 2:
        F12Container.api_input = request
        break
    }
    $('.select-request-popup').hide()
  })

  $('body').on(
    'mouseover',
    '.select-request-popup .request-row',
    function (ev) {
      $('.select-request-popup .request-row').removeClass('selected')
      $(this).addClass('selected')
    }
  )

  window.onclick = function (ev) {
    if (
      !$(ev.target).is('.select-request-popup') ||
      $('.select-request-popup').has(ev.target).length === 1
    ) {
      $('.select-request-popup').hide()
    }
  }

  // TODO: setting Output UI
  function f12_create_outputRow (item, index, space) {
    let output = RequestDA.selected?.outputApiItem.find(
      e => e.GID == item.AttributesItem.OutputID
    )
    // Nếu không tìm thấy output => Api đã thay đổi => clear data
    if (item.AttributesItem.OutputID && output == null) {
      item.AttributesItem.ApiID = null
      item.AttributesItem.OutputID = null
      item.AttributesItem.ListFieldID = ''
      WBaseDA.edit([item], EnumObj.attribute)
    }
    let dataType =
      output?.DataType == 1
        ? 'Field'
        : output?.DataType == 2
        ? 'List'
        : output?.DataType == 3
        ? 'Object'
        : item.AttributesItem?.Content
        ? 'Field'
        : ''
    let output_row =
      '<div data-id="' +
      `${item.GID}` +
      '" class="f12-output-row row f12-setting-row">' +
      '    <div class="row regular1 text-title index center">' +
      index +
      '</div>' +
      '    <div class="row name">' +
      '        <input class="regular1 text-title" placeholder="Add a name field" value="' +
      `${item.AttributesItem.NameField}` +
      '" type="text" style="padding-left:' +
      `${16 + space}px;` +
      '"/>' +
      '    </div>' +
      '    <div class="row data-type">' +
      '        <input class="regular1 text-title" placeholder="-- Data type --" value="' +
      dataType +
      '" type="text" readonly/>' +
      '    </div>' +
      '    <div class="row init-value">' +
      '        <input class="regular1 text-title" placeholder="Init value" value="' +
      `${item.AttributesItem?.Content ?? ''}` +
      '" type="text" />' +
      '    </div>' +
      '    <div class="row output-value">' +
      '        <input class="regular1 text-title" placeholder="-- Output --" value="' +
      `${output?.Name ?? ''}` +
      '" type="text" readonly/>' +
      '    </div>' +
      '    <div class="row calculate">' +
      '        <input class="regular1 text-title" placeholder="Add calculate" value="' +
      `${output?.Calculate ?? ''}` +
      '" type="text" />' +
      '    </div>' +
      '</div>'

    if (item.CountChild > 0) {
      let list_childItem = wbase_list.filter(e =>
        item.ListChildID.some(el => el == e.GID)
      )
      for (let i = 0; i < list_childItem.length; i++) {
        output_row += f12_create_outputRow(list_childItem[i], '', space + 6)
      }
    }

    return output_row
  }

  function f12_update_listOutputRow () {
    let list_field = ''
    let wbSelectedList = wbase_list.filter(e =>
      selected_list.some(wbHTML => wbHTML.id === e.GID)
    )
    for (let i = 0; i < wbSelectedList.length; i++) {
      list_field += f12_create_outputRow(wbSelectedList[i], i + 1, 0)
    }

    $('.list-field').html(list_field)
  }
  //? show popup output
  function f12_create_outputRowPopup (item, space) {
    let row =
      '<div data-id=' +
      item.GID +
      ' class="option-tile row text-white regular11" style="padding-left: ' +
      `${12 + space}px` +
      '">' +
      `${item.NameField}` +
      '</div>'
    if (item.DataType != 1) {
      let list = RequestDA.selected.outputApiItem.filter(
        e => e.ParentID != null && e.ParentID == item.GID
      )
      for (let child of list) {
        row += f12_create_outputRowPopup(child, space + 12)
      }
    }
    return row
  }
  function f12_create_outputPopup () {
    let list_output =
      '<div class="option-tile row text-white regular11">None</div>'
    if (RequestDA.selected) {
      let list = RequestDA.selected.outputApiItem.filter(
        e => e.ParentID == null
      )
      for (let item of list) {
        list_output += f12_create_outputRowPopup(item, 0)
      }
    }
    $('.list-output-popup').html(list_output)
    $('.list-output-popup').css('display', 'flex')
  }

  $('body').on('click', '.output-value', function (ev) {
    ev.stopPropagation()
    if (!$(this).parent().hasClass('row-header')) {
      $('.list-output-popup').css('width', $(this).width())
      $('.list-output-popup').css('left', $(this).offset().left)
      $('.list-output-popup').css(
        'top',
        $(this).offset().top - $('.f12-container').offset().top + 33
      )
      f12_create_outputPopup()
    }
  })

  $('body').on('click', '.list-output-popup .option-tile', function (ev) {
    let wbase = wbase_list.find(e => e.GID == F12Container.wbase_id)
    let output = RequestDA.selected.outputApiItem.find(
      e => e.GID == $(this).data('id')
    )
    wbase.AttributesItem.OutputID = output?.GID
    wbase.AttributesItem.APIID = output?.APIID
    wbase.AttributesItem.ListFieldID = output?.ListFieldID ?? ''

    f12_update_listOutputRow()
    WBaseDA.edit([wbase], EnumObj.attribute)
    $('.list-output-popup').hide()
  })

  //? change value input of output-row
  $('body').on('blur', '.f12-output-row input', function (ev) {
    let wbase = wbase_list.find(e => e.GID == F12Container.wbase_id)
    if ($(this).parent().hasClass('name')) {
      if (wbase.AttributesItem?.NameField != $(this).val()) {
        wbase.AttributesItem.NameField = $(this).val()
        WBaseDA.edit([wbase], EnumObj.attribute)
        f12_update_listOutputRow()
      }
    } else if ($(this).parent().hasClass('init-value')) {
      if (wbase.AttributesItem?.Content != $(this).val()) {
        wbase.AttributesItem.Content = $(this).val()
        WBaseDA.edit([wbase], EnumObj.attribute)
        f12_update_listOutputRow()
      }
    } else if ($(this).parent().hasClass('calculate')) {
    }
  })

  $('body').on('keydown', '.f12-output-row input', function (ev) {
    if (ev.key == 'Enter') {
      $(this).trigger('blur')
    }
  })

  // $('body').on('', '', function (ev) { });

  //? show border for item selected
  $('body').on('click', '.f12-output-row>*', function (ev) {
    $('.wbaseItem-value').removeClass('selected')
    $('.wbaseItem-value[id="' + $(this).parent().data('id') + '"]').addClass(
      'selected'
    )
    F12Container.wbase_id = $(this).parent().data('id')
  })

  $('body').on('blur', '.f12-output-row input', function (ev) {
    $('.wbaseItem-value').removeClass('selected')
  })

  // TODO: setting Intput UI
  function f12_create_inputRow (item) {
    let wbase = wbase_list.find(e => e.AttributesItem.InputID == item.GID)
    let input_row =
      '<div data-id="' +
      `${item.GID}` +
      '" class="f12-input-row row f12-setting-row">' +
      '    <div class="row regular1 text-title index">' +
      `${F12Container.api_input.inputApiItem.indexOf(item) + 1}` +
      '</div>' +
      '    <div class="row input-value">' +
      '        <input class="regular1 text-title" value="' +
      `${item.Name}` +
      '" type="text" readonly>' +
      '    </div>' +
      '    <div class="row wbase">' +
      '        <input class="regular1 text-title" value="' +
      `${wbase?.AttributesItem?.NameField ?? ''}` +
      '" placeholder="-- Select item --" type="text" readonly>' +
      '    </div>' +
      '    <div class="row calculate">' +
      '        <input class="regular1 text-title" value="' +
      `${item?.Calculate ?? ''}` +
      '" placeholder="Add calculate" type="text">' +
      '    </div>' +
      '</div>'

    return input_row
  }

  function f12_update_listInputRow () {
    let list_input = ''

    if (F12Container.api_input) {
      for (let item of F12Container.api_input.inputApiItem) {
        list_input += f12_create_inputRow(item)
      }
    }

    $('.list-field').html(list_input)
  }

  function f12_create_wbaseRowPopup (item, space) {
    let row =
      '<div data-id=' +
      item.GID +
      ' class="option-tile row text-white regular11" style="padding-left: ' +
      `${12 + space}px` +
      '">' +
      `${
        item.AttributesItem?.NameField.length > 0
          ? item.AttributesItem?.NameField
          : item.Name
      }` +
      '</div>'
    if (item.CountChild > 1) {
      let list = wbase_list.filter(e => e.ListID.includes(item.GID))
      for (let child of list) {
        row += f12_create_wbaseRowPopup(child, space + 12)
      }
    }
    return row
  }

  function f12_create_wbasePopup () {
    let list_wbase =
      '<div class="option-tile row text-white regular11">None</div>'
    if (selected_list.length > 0) {
      for (let i = 0; i < selected_list.length; i++) {
        list_wbase += f12_create_wbaseRowPopup(selected_list[i], 0)
      }
    }
    $('.list-wbase-popup').html(list_wbase)
    $('.list-wbase-popup').css('display', 'flex')
  }

  $('body').on('click', '.f12-input-row .wbase', function (ev) {
    ev.stopPropagation()
    if (!$(this).parent().hasClass('row-header')) {
      F12Container.input_id = $(this).parent().data('id')
      $('.list-wbase-popup').css('width', $(this).width())
      $('.list-wbase-popup').css('left', $(this).offset().left)
      $('.list-wbase-popup').css(
        'top',
        $(this).offset().top - $('.f12-container').offset().top + 33
      )
      f12_create_wbasePopup()
    }
  })

  $('body').on('click', '.list-wbase-popup .option-tile', function (ev) {
    let wbase = wbase_list.find(e => e.GID == $(this).data('id'))
    wbase.AttributesItem.InputID = F12Container.input_id
    // wbase.AttributesItem.ApiID = F12Container.api_input.APIID;
    f12_update_listInputRow()
    $('.list-wbase-popup').hide()
    WBaseDA.edit(selected_list, EnumObj.attribute)
  })

  // TODO: Prototype data
  // function get_dataPrototype(item) { }

  function create_UI_dataRow (item = selected_list[0], index = '', space = 0) {
    let data_item = wbase_list.find(
      e => e.GID == $('.prototype-tab.tab.selected').data('id')
    )
    let prototype_item = data_item?.JsonEventItem.find(
      e => e.Name == 'Prototype'
    )
    let data = prototype_item?.Data.find(e =>
      e.ListID?.some(el => el?.toLowerCase() == item.GID)
    )

    let row =
      '<div  data-id="' +
      item.GID +
      '" class="table-row row">' +
      '    <div class="table-cell regular11 row-index center">' +
      index +
      '</div>' +
      '    <div class="table-cell regular11 row-name">' +
      '        <input type="text"  value="' +
      item.Name +
      '" placeholder="Select map data item" readonly />' +
      '    </div>' +
      '    <div class="table-cell regular11 row-value">' +
      '        <input type="text"  value="' +
      `${data?.Key ?? ''}` +
      '" placeholder="Select data" readonly />' +
      '    </div>' +
      '    <div class="table-cell regular11 row-calculate last">' +
      '        <input type="text" placeholder="Calculate" />' +
      '    </div>' +
      '</div>'
    if (item.CountChild > 0) {
      let list_childItem = wbase_list.filter(e =>
        item.ListChildID.some(el => el == e.GID)
      )
      for (let i = 0; i < list_childItem.length; i++) {
        row += create_UI_dataRow(list_childItem[i], '', space + 6)
      }
    }
    return row
  }
  function update_UI_dataView () {
    let list_row = create_UI_dataRow()
    $('.list-tabview-prototype .table-body').html(list_row)
  }

  function update_UI_dataPrototype () {
    let list_data = '<div class="data-option regular11 text-white">None</div>'
    let data_item = wbase_list.find(
      e => e.GID == $('.prototype-tab.tab.selected').data('id')
    )
    let prototype_item = data_item.JsonEventItem.find(
      e => e.Name == 'Prototype'
    )
    for (let item of prototype_item.Data) {
      list_data +=
        '<div data-id="' +
        item.ID +
        '" class="data-option regular11 text-white">' +
        `${item?.Key ?? 'Untitled'}` +
        '</div>'
    }
    $('.f12-select-data-popup').html(list_data)
    $('.f12-select-data-popup').css('display', 'flex')
  }

  $('body').on('click', '.f12-select-data-popup .data-option', function (ev) {
    ev.stopPropagation()
    // TODO: add field to save data
    let data_item = wbase_list.find(
      e => e.GID == $('.prototype-tab.tab.selected').data('id')
    )
    let prototype_item = data_item.JsonEventItem.find(
      e => e.Name == 'Prototype'
    )
    // TODO:
    let item = prototype_item.Data.find(e => e.ID == $(this).data('id'))
    if (item) {
      if (item.ListID == null) {
        item.ListID = [wdata_id]
      } else {
        item.ListID.push(wdata_id)
      }
    } else {
      let update_dataItem = prototype_item?.Data.find(e =>
        e.ListID?.some(el => el?.toLowerCase() == wdata_id)
      )

      update_dataItem.ListID.splice(update_dataItem.ListID.indexOf(wdata_id), 1)
    }
    WBaseDA.edit([data_item], EnumObj.attribute)
    update_UI_dataView()
    $('.f12-select-data-popup').hide()
  })
}

// // First UI
// // tabview UI
// function f12_update_tableOuput() { }
// function f12_update_tableInput() { }
// function f12_update_tableBaseresponse() { }
// function f12_update_tableDataPrototype() { }
// // change w_item
// //      switch(tab) => change UI function
// function f12_change_wbase() {
//     switch ($(".tab.selected").data("index")) {
//         case 1:  // output
//             f12_update_tableOuput();
//             break;
//         case 2:  // input
//             f12_update_tableInput();
//             break;
//         case 3:  // baseresponse
//             f12_update_tableBaseresponse();
//             break;
//         default: // prototype data
//             f12_update_tableDataPrototype();
//             break;
//     }
// }
// // change tab & tabview
// //      switch(tab) => change UI function
// function f12_change_Tab() {
//     switch ($(".tab.selected").data("index")) {
//         case 1:  // output
//             f12_update_tableOuput();
//             break;
//         case 2:  // input
//             f12_update_tableInput();
//             break;
//         case 3:  // baseresponse
//             f12_update_tableBaseresponse();
//             break;
//         default: // prototype data
//             f12_update_tableDataPrototype();
//             break;
//     }
// }
// // // update data
// // //      switch(tab) => change Data function
// // switch ($(".tab").data("index")) {
// //     case 1:  // output
// //         break;
// //     case 2:  // input
// //         break;
// //     case 3:  // baseresponse
// //         break;
// //     default: // prototype data
// //         break;
// // }
