function create_stateContainer() {
    let state_container = '<div class="state-container"></div>';
    if (selected_list.length === 1) state_container = '<div class="state-container">' + '   <div class="state-container-body-UI col">' + '      <div class="header semibold1 row">State<i class="fa-solid fa-plus"></i></div>' + '      <div id="state-setting_UI" class="body col">' + create_UI_State() + "</div>" + "   </div>" + "</div>";
    $(".state_setting_view").html(state_container);
    if (selected_list.length > 0) {
      state_container = state_view.querySelector(".state_setting_view .state-container");
      state_container.appendChild(createDataForm());
      if (selected_list.length === 1) {
        state_container.appendChild(createAttributeComponent());
        state_container.querySelector(".header > .fa-plus").onclick = function () {
          let offset = this.getBoundingClientRect();
          setTimeout(function () {
            let popupSelectState = document.createElement("div");
            popupSelectState.className = "wini_popup popup_remove popup-add-state-type";
            popupSelectState.style.left = offset.x + "px";
            popupSelectState.style.top = offset.bottom + "px";
            if (!selected_list[0].JsonEventItem) selected_list[0].JsonEventItem = [];
            let list_state = selected_list[0].JsonEventItem?.find((e) => e.Name === "State")?.ListState ?? [];
            for (let stateType of ComponentState.listState) {
              if (list_state.every((stateItem) => stateItem.Type !== stateType)) {
                let selectStateTypeBtn = document.createElement("div");
                selectStateTypeBtn.className = "regular1";
                selectStateTypeBtn.innerHTML = stateType;
                selectStateTypeBtn.onclick = function (e) {
                  e.stopPropagation();
                  let state_item = selected_list[0].JsonEventItem?.find((e) => e.Name === "State");
                  if (state_item) {
                    state_item.ListState.push({
                      Type: stateType,
                      ColorSkinID: "",
                      BorderSkinID: "",
                      EffectSkinID: "",
                    });
                  } else {
                    selected_list[0].JsonEventItem.push({
                      Name: "State",
                      ListState: [
                        {
                          Type: stateType,
                          ColorSkinID: "",
                          BorderSkinID: "",
                          EffectSkinID: "",
                        },
                      ],
                    });
                  }
                  WBaseDA.edit(selected_list, EnumObj.attribute);
                  popupSelectState.remove();
                  $("#state-setting_UI").html(create_UI_State());
                };
                popupSelectState.appendChild(selectStateTypeBtn);
              }
            }
            document.getElementById("body").appendChild(popupSelectState);
          }, 200);
        };
      }
      state_container.querySelectorAll("input").forEach((input) => {
        if (input.type !== "checkbox")
          input.onfocus = function (e) {
            e.stopPropagation();
            this.select();
          };
      });
    }
  }
  
  function get_colorValue(item, check) {
    if (item) {
      let value;
      if (check == "background") {
        value = ColorDA.list.find((e) => e.GID === item.ColorSkinID)?.Value ?? selected_list[0].StyleItem.DecorationItem?.ColorValue ?? "ffffffff";
      } else if (check == "border") {
        value = BorderDA.list.find((e) => e.GID === item.BorderSkinID)?.ColorValue ?? selected_list[0].StyleItem.DecorationItem?.BorderItem?.ColorValue ?? "ffffffff";
      }
  
      return value.substring(2) + value.substring(2, 0);
    } else {
      return "FFFFFFFF";
    }
  }
  
  function create_UI_State() {
    if (selected_list[0].JsonEventItem == null) selected_list[0].JsonEventItem = [];
    let list_state = selected_list[0].JsonEventItem?.find((e) => e.Name == "State")?.ListState ?? [];
    function settingStateItem(stateItem) {
      return (
        `<div data-state="${stateItem.Type}" class="setting-state-container col hover-setting">` +
        '   <div class="setting-header row text-label ' +
        `${stateItem ? "active" : ""}` +
        '">' +
        `       <div class="setting-state-header-label semibold1">${stateItem.Type.substring(0, 1).toUpperCase()}${stateItem.Type.substring(1)}</div>` +
        '       <button class="box24 setting-header-button button-transparent"><i class="fa-solid fa-minus fa-sm"></i></button>' +
        "   </div>" +
        '   <div class="list-field-setting col ' +
        `${stateItem ? "active" : ""}` +
        '">' +
        '       <div class="col field-setting background-setting">' +
        '           <div class="row field-header">' +
        '               <div class="field-name regular1 text-title">Background</div>' +
        // '               <button class="box24 select-skin-button button-transparent"><img src="https://cdn.jsdelivr.net/gh/WiniGit/goline@6520db8/lib/assets/buttonStyle.svg"></button>' +
        "           </div>" +
        '           <div class="row field-value ">' +
        '               <div class="row skin-container hover-setting">' +
        // '                   <input type="color" class="skin-color box16 circular" value="' + `#${get_colorValue(stateItem, "background")}` + '"/>' +
        '                       <div class="skin-color box16 circular" style="background-color: ' +
        `#${get_colorValue(stateItem, "background")}` +
        '"></div>' +
        '                   <div class="skin-name regular1 text-body">' +
        `${ColorDA.list.find((e) => e.GID == stateItem.ColorSkinID)?.Name ?? "Initial"}` +
        "</div>" +
        "               </div>" +
        '               <button class="box24 abort-skin-button button-transparent hover-setting"><img src="https://cdn.jsdelivr.net/gh/WiniGit/goline@6520db8/lib/assets/unlink-skin.svg"></button>' +
        "           </div>" +
        "       </div>" +
        '       <div class="col field-setting border-setting">' +
        '           <div class="row field-header">' +
        '               <div class="field-name regular1 text-title">Border</div>' +
        // '               <button class="box24 select-skin-button button-transparent"><img src="https://cdn.jsdelivr.net/gh/WiniGit/goline@6520db8/lib/assets/buttonStyle.svg"></button>' +
        "           </div>" +
        '           <div class="row field-value">' +
        '               <div class="row skin-container hover-setting">' +
        // '                   <input type="color" class="skin-color box16 circular" value="' + `#${get_colorValue(stateItem, "border")}` + '"/>' +
        '                       <div class="skin-color box16 circular" style="background-color: ' +
        `#${get_colorValue(stateItem, "border")}` +
        '"></div>' +
        '                   <div class="skin-name regular1 text-body">' +
        `${BorderDA.list.find((e) => e.GID == stateItem.BorderSkinID)?.Name ?? "Initial"}` +
        "</div>" +
        "               </div>" +
        '               <button class="box24 abort-skin-button button-transparent hover-setting"><img src="https://cdn.jsdelivr.net/gh/WiniGit/goline@6520db8/lib/assets/unlink-skin.svg"></button>' +
        "           </div>" +
        "       </div>" +
        '       <div class="col field-setting effect-setting">' +
        '           <div class="row field-header">' +
        '               <div class="field-name regular1 text-title">Effect</div>' +
        // '               <button class="box24 select-skin-button button-transparent"><img src="https://cdn.jsdelivr.net/gh/WiniGit/goline@6520db8/lib/assets/buttonStyle.svg"></button>' +
        "           </div>" +
        '           <div class="row field-value">' +
        '               <div class="row skin-container hover-setting">' +
        '                   <div class="box16"><img src="https://cdn.jsdelivr.net/gh/WiniGit/goline@6520db8/lib/assets/effect-settings.svg"></div>' +
        '                   <div class="skin-name regular1 text-body">' +
        `${EffectDA.list.find((e) => e.GID == stateItem.EffectSkinID)?.Name ?? "Initial"}` +
        "</div>" +
        "               </div>" +
        '               <button class="box24 abort-skin-button button-transparent hover-setting"><img src="https://cdn.jsdelivr.net/gh/WiniGit/goline@6520db8/lib/assets/unlink-skin.svg"></button>' +
        "           </div>" +
        "       </div>" +
        "   </div>" +
        "</div>"
      );
    }
    let button_state_UI = "";
    list_state.forEach((stateItem) => (button_state_UI += settingStateItem(stateItem)));
    return button_state_UI;
  }
  
  $("body").on("click", ".background-setting .skin-container", function (e) {
    if (selected_list[0].JsonEventItem == null) selected_list[0].JsonEventItem = [];
    let list_state = selected_list[0].JsonEventItem?.find((e) => e.Name == "State") ?? [];
    let stateItem = list_state.ListState.find((e) => e.Type == $(this).parents(".setting-state-container").data("state"));
    e.stopPropagation();
    let rect = this.getBoundingClientRect();
    createDropdownTableSkin(EnumCate.color, rect);
    document
      .getElementById("popup_table_skin")
      .querySelectorAll(".skin_tile_option")
      .forEach((option) => {
        option.onclick = function (ev) {
          ev.stopPropagation();
          stateItem.ColorSkinID = this.id.replace("skinID:", "");
          selected_list[0].AttributesItem.JsonEvent = JSON.stringify(list_state);
          WBaseDA.edit(selected_list, EnumObj.attribute);
          $("#popup_table_skin").remove();
          $("#state-setting_UI").html(create_UI_State());
        };
      });
  });
  $("body").on("click", ".border-setting .skin-container", function (e) {
    if (selected_list[0].JsonEventItem == null) selected_list[0].JsonEventItem = [];
    let list_state = selected_list[0].JsonEventItem?.find((e) => e.Name == "State") ?? [];
    let stateItem = list_state.ListState.find((e) => e.Type == $(this).parents(".setting-state-container").data("state"));
    e.stopPropagation();
    let rect = this.getBoundingClientRect();
    createDropdownTableSkin(EnumCate.border, rect);
    document
      .getElementById("popup_table_skin")
      .querySelectorAll(".skin_tile_option")
      .forEach((e) => {
        e.onclick = function (ev) {
          ev.stopPropagation();
          stateItem.BorderSkinID = this.id.replace("skinID:", "");
          selected_list[0].AttributesItem.JsonEvent = JSON.stringify(list_state);
          WBaseDA.edit(selected_list, EnumObj.attribute);
          $("#popup_table_skin").remove();
          $("#state-setting_UI").html(create_UI_State());
        };
      });
  });
  $("body").on("click", ".effect-setting .skin-container", function (e) {
    if (selected_list[0].JsonEventItem == null) selected_list[0].JsonEventItem = [];
    let list_state = selected_list[0].JsonEventItem?.find((e) => e.Name == "State") ?? [];
    let stateItem = list_state.ListState.find((e) => e.Type == $(this).parents(".setting-state-container").data("state"));
    e.stopPropagation();
    let rect = this.getBoundingClientRect();
    createDropdownTableSkin(EnumCate.effect, rect);
    document
      .getElementById("popup_table_skin")
      .querySelectorAll(".skin_tile_option")
      .forEach((e) => {
        e.onclick = function (ev) {
          ev.stopPropagation();
          stateItem.EffectSkinID = this.id.replace("skinID:", "");
          selected_list[0].AttributesItem.JsonEvent = JSON.stringify(list_state);
          WBaseDA.edit(selected_list, EnumObj.attribute);
          $("#popup_table_skin").remove();
          $("#state-setting_UI").html(create_UI_State());
        };
      });
  });
  
  $("body").on("click", ".setting-header button", function (ev) {
    if (selected_list[0].JsonEventItem == null) selected_list[0].JsonEventItem = [];
    let state_item = selected_list[0].JsonEventItem.find((e) => e.Name == "State");
    // state_item.remove
    let remove = state_item.ListState.find((e) => e.Type == $(this).parents(".setting-state-container").data("state"));
    state_item.ListState.splice(state_item.ListState.indexOf(remove), 1);
    WBaseDA.edit(selected_list, EnumObj.attribute);
    $("#state-setting_UI").html(create_UI_State());
  });
  
  $("body").on("click", ".background-setting .abort-skin-button", function (e) {
    if (selected_list[0].JsonEventItem == null) selected_list[0].JsonEventItem = [];
    let list_state = selected_list[0].JsonEventItem?.find((e) => e.Name == "State") ?? [];
    let stateItem = list_state.ListState.find((e) => e.Type == $(this).parents(".setting-state-container").data("state"));
    stateItem.ColorSkinID = "";
    selected_list[0].AttributesItem.JsonEvent = JSON.stringify(list_state);
    WBaseDA.edit(selected_list, EnumObj.attribute);
    $("#popup_table_skin").remove();
    $("#state-setting_UI").html(create_UI_State());
  });
  
  $("body").on("click", ".border-setting .abort-skin-button", function (e) {
    if (selected_list[0].JsonEventItem == null) selected_list[0].JsonEventItem = [];
    let list_state = selected_list[0].JsonEventItem?.find((e) => e.Name == "State") ?? [];
    let stateItem = list_state.ListState.find((e) => e.Type == $(this).parents(".setting-state-container").data("state"));
    stateItem.BorderSkinID = "";
    selected_list[0].AttributesItem.JsonEvent = JSON.stringify(list_state);
    WBaseDA.edit(selected_list, EnumObj.attribute);
    $("#popup_table_skin").remove();
    $("#state-setting_UI").html(create_UI_State());
  });
  
  $("body").on("click", ".effect-setting .abort-skin-button", function (e) {
    if (selected_list[0].JsonEventItem == null) selected_list[0].JsonEventItem = [];
    let list_state = selected_list[0].JsonEventItem?.find((e) => e.Name == "State") ?? [];
    let stateItem = list_state.ListState.find((e) => e.Type == $(this).parents(".setting-state-container").data("state"));
    stateItem.EffectSkinID = "";
    selected_list[0].AttributesItem.JsonEvent = JSON.stringify(list_state);
    WBaseDA.edit(selected_list, EnumObj.attribute);
    $("#popup_table_skin").remove();
    $("#state-setting_UI").html(create_UI_State());
  });
  
  function update_StyleState(componentState) {
    if (selected_list[0].JsonEventItem == null) selected_list[0].JsonEventItem = [];
    let list_state = selected_list[0].JsonEventItem?.find((e) => e.Name == "State") ?? [];
    let itemState = list_state.ListState.find((e) => e.Type == componentState);
  
    let color_skin = ColorDA.list.find((e) => e.GID == itemState.ColorSkinID)?.Value;
    let border_skin = BorderDA.list.find((e) => e.GID == itemState.BorderSkinID);
    let effect_skin = EffectDA.list.find((e) => e.GID == itemState.EffectSkinID);
  
    if (color_skin) {
      selected_list[0].value.style.backgroundColor = `#${color_skin.substring(2) + color_skin.substring(2, 0)}`;
    }
    if (border_skin) {
      let list_width = border_skin.Width.split(" ");
      selected_list[0].value.style.borderTopWidth = list_width[0] + "px";
      selected_list[0].value.style.borderRightWidth = list_width[1] + "px";
      selected_list[0].value.style.borderBottomWidth = list_width[2] + "px";
      selected_list[0].value.style.borderLeftWidth = list_width[3] + "px";
      selected_list[0].value.style.borderStyle = border_skin.BorderStyle;
      selected_list[0].value.style.borderColor = `#${border_skin.ColorValue.substring(2)}${border_skin.ColorValue.substring(0, 2)}`;
    }
    if (effect_skin) {
      selected_list[0].value.style.boxShadow = `${effect_skin.OffsetX}px ${effect_skin.OffsetY}px ${effect_skin.BlurRadius}px ${effect_skin.SpreadRadius}px #${effect_skin.ColorValue.substring(2)}${effect_skin.ColorValue.substring(0, 2)} ${effect_skin.Type == ShadowType.inner ? "inset" : ""}`;
    }
  }
  
  $("body").on("mousedown", ".setting-state-container.hover-setting .setting-state-header-label", function (ev) {
    update_StyleState(ComponentState.hover);
  });
  
  $("body").on("mousedown", ".setting-state-container.focus-setting .setting-state-header-label", function (ev) {
    update_StyleState(ComponentState.focus);
  });
  
  $("body").on("mousedown", ".setting-state-container.disable-setting .setting-state-header-label", function (ev) {
    update_StyleState(ComponentState.disabled);
  });
  
  $("body").on("mouseup", ".setting-state-container .setting-state-header-label", function (ev) {
    let _item = selected_list[0];
    let initial_value = _item.StyleItem.DecorationItem.ColorValue.substring(2) + _item.StyleItem.DecorationItem.ColorValue.substring(2, 0);
  
    _item.value.style.backgroundColor = `#${initial_value}`;
  
    let list_width = _item.StyleItem.DecorationItem?.BorderItem?.Width?.split(" ");
    if (list_width) {
      selected_list[0].value.style.borderTopWidth = list_width[0] + "px";
      selected_list[0].value.style.borderRightWidth = list_width[1] + "px";
      selected_list[0].value.style.borderBottomWidth = list_width[2] + "px";
      selected_list[0].value.style.borderLeftWidth = list_width[3] + "px";
      selected_list[0].value.style.borderStyle = border_skin.BorderStyle;
      selected_list[0].value.style.borderColor = `#${border_skin.ColorValue.substring(2)}${border_skin.ColorValue.substring(0, 2)}`;
    } else {
      selected_list[0].value.style.border = "none";
    }
  
    if (_item.StyleItem.DecorationItem.EffectItem) {
      selected_list[0].value.style.boxShadow = `${_item.StyleItem.DecorationItem.EffectItem.OffsetX}px ${_item.StyleItem.DecorationItem.EffectItem.OffsetY}px ${_item.StyleItem.DecorationItem.EffectItem.BlurRadius}px ${_item.StyleItem.DecorationItem.EffectItem.SpreadRadius}px #${_item.StyleItem.DecorationItem.EffectItem.ColorValue.substring(2)}${_item.StyleItem.DecorationItem.EffectItem.ColorValue.substring(0, 2)} ${_item.StyleItem.DecorationItem.EffectItem.Type == ShadowType.inner ? "inset" : ""}`;
    } else {
      selected_list[0].value.style.boxShadow = "none";
    }
  });
  
  function createAttributeComponent() {
    let attributeUI = document.createElement("div");
    if (selected_list[0].JsonItem) {
      attributeUI.className = "state-container-body-UI col";
      let header = document.createElement("div");
      header.className = "header semibold1 row";
      let jsonItemContainer = editJsonItemByCate();
      attributeUI.replaceChildren(header, jsonItemContainer);
      header.innerHTML = jsonItemContainer.firstChild.innerHTML + " Attribute";
      jsonItemContainer.firstChild.remove();
    }
    return attributeUI;
  }
  
  function editJsonItemByCate() {
    let jsonItemEditUI = document.createElement("div");
    jsonItemEditUI.className = "col attr-settings-details";
    let title = document.createElement("div");
    title.className = "semibold1";
    switch (selected_list[0].CateID) {
      case EnumCate.checkbox:
        title.innerHTML = "Checkbox";
        var initValueRow = document.createElement("div");
        initValueRow.className = "row";
        initValueRow.style.columnGap = "60px";
        var initTitle = document.createElement("div");
        initTitle.className = "regular1";
        initTitle.innerHTML = "Init value:";
        var dropdownBtn = _btnDropDownSelect(
          ["true", "false"],
          function (options) {
            for (let option of options) {
              let initVl = option.getAttribute("value");
              option.firstChild.style.opacity = initVl === selected_list[0].AttributesItem.Content ? 1 : 0;
            }
          },
          function (option) {
            editJsonItem({ Content: option });
            dropdownBtn.firstChild.innerHTML = option;
          },
        );
        dropdownBtn.firstChild.innerHTML = selected_list[0].AttributesItem.Content;
        initValueRow.replaceChildren(initTitle, dropdownBtn);
        let editCheckmark = document.createElement("div");
        editCheckmark.className = "col regular1";
        editCheckmark.innerHTML = "Checkmark color";
        editCheckmark.appendChild(
          editColorContainer(selected_list[0].JsonItem.CheckColor, function (colorVl, onSubmit) {
            editJsonItem({ CheckColor: colorVl }, onSubmit ?? true);
          }),
        );
        var editInactive = document.createElement("div");
        editInactive.className = "col regular1";
        editInactive.innerHTML = "Inactive color";
        editInactive.appendChild(
          editColorContainer(selected_list[0].JsonItem.InactiveColor, function (colorVl, onSubmit) {
            editJsonItem({ InactiveColor: colorVl }, onSubmit ?? true);
          }),
        );
        var checkboxRow = document.createElement("div");
        checkboxRow.className = "row";
        var checkbox = document.createElement("input");
        checkbox.id = "cb-check-enable";
        checkbox.type = "checkbox";
        checkbox.defaultChecked = selected_list[0].JsonItem.Enable;
        checkbox.onchange = function (e) {
          e.stopPropagation();
          editJsonItem({ Enable: this.checked });
        };
        var label = document.createElement("label");
        label.className = "regular1";
        label.htmlFor = "cb-check-enable";
        label.innerHTML = "Enable";
        checkboxRow.replaceChildren(checkbox, label);
        jsonItemEditUI.replaceChildren(title, initValueRow, editCheckmark, editInactive, checkboxRow);
        break;
      //
      case EnumCate.w_switch:
        title.innerHTML = "Switch";
        var initValueRow = document.createElement("div");
        initValueRow.className = "row";
        initValueRow.style.columnGap = "60px";
        var initTitle = document.createElement("div");
        initTitle.className = "regular1";
        initTitle.innerHTML = "Init value:";
        var dropdownBtn = _btnDropDownSelect(
          ["true", "false"],
          function (options) {
            for (let option of options) {
              let initVl = option.getAttribute("value");
              option.firstChild.style.opacity = initVl === selected_list[0].AttributesItem.Content ? 1 : 0;
            }
          },
          function (option) {
            editJsonItem({ Content: option });
            dropdownBtn.firstChild.innerHTML = option;
          },
        );
        dropdownBtn.firstChild.innerHTML = selected_list[0].AttributesItem.Content;
        initValueRow.replaceChildren(initTitle, dropdownBtn);
        let editDot = document.createElement("div");
        editDot.className = "col regular1";
        editDot.innerHTML = "Dot color";
        editDot.appendChild(
          editColorContainer(selected_list[0].JsonItem.DotColor, function (colorVl, onSubmit) {
            editJsonItem({ DotColor: colorVl }, onSubmit ?? true);
          }),
        );
        var editInactive = document.createElement("div");
        editInactive.className = "col regular1";
        editInactive.innerHTML = "Inactive color";
        editInactive.appendChild(
          editColorContainer(selected_list[0].JsonItem.InactiveColor, function (colorVl, onSubmit) {
            editJsonItem({ InactiveColor: colorVl }, onSubmit ?? true);
          }),
        );
        var checkboxRow = document.createElement("div");
        checkboxRow.className = "row";
        var checkbox = document.createElement("input");
        checkbox.id = "cb-check-enable";
        checkbox.type = "checkbox";
        checkbox.defaultChecked = selected_list[0].JsonItem.Enable;
        checkbox.onchange = function (e) {
          e.stopPropagation();
          editJsonItem({ Enable: this.checked });
        };
        var label = document.createElement("label");
        label.className = "regular1";
        label.htmlFor = "cb-check-enable";
        label.innerHTML = "Enable";
        checkboxRow.replaceChildren(checkbox, label);
        jsonItemEditUI.replaceChildren(title, initValueRow, editDot, editInactive, checkboxRow);
        break;
      //
      case EnumCate.radio_button:
        title.innerHTML = "Radio button";
        var inputFieldInitValue = document.createElement("div");
        inputFieldInitValue.className = "input-edit-field row";
        var labelInitValue = document.createElement("label");
        labelInitValue.htmlFor = "radio-init-vl";
        labelInitValue.className = "regular1";
        labelInitValue.innerHTML = "Init value";
        var inputInitValue = document.createElement("input");
        inputInitValue.id = "radio-init-vl";
        inputInitValue.className = "regular1";
        inputInitValue.defaultValue = selected_list[0].AttributesItem.Content;
        inputFieldInitValue.replaceChildren(labelInitValue, inputInitValue);
        inputInitValue.onblur = function (e) {
          e.stopPropagation();
          if (selected_list[0].AttributesItem.Content != this.value) editJsonItem({ Content: this.value });
        };
        var checkboxRow = document.createElement("div");
        checkboxRow.className = "row";
        var checkboxEnable = document.createElement("input");
        checkboxEnable.id = "cb-check-enable";
        checkboxEnable.type = "checkbox";
        checkboxEnable.defaultChecked = selected_list[0].JsonItem.Enable;
        checkboxEnable.onchange = function (e) {
          e.stopPropagation();
          editJsonItem({ Enable: this.checked });
        };
        var labelEnable = document.createElement("label");
        labelEnable.className = "regular1";
        labelEnable.htmlFor = "cb-check-enable";
        labelEnable.innerHTML = "Enable";
        var checkboxChecked = document.createElement("input");
        checkboxChecked.id = "cb-check-checked";
        checkboxChecked.type = "checkbox";
        checkboxChecked.defaultChecked = selected_list[0].JsonItem.Checked ?? false;
        checkboxChecked.onchange = function (e) {
          e.stopPropagation();
          editJsonItem({ Checked: this.checked });
        };
        var labelChecked = document.createElement("label");
        labelChecked.className = "regular1";
        labelChecked.htmlFor = "cb-check-checked";
        labelChecked.innerHTML = "Checked";
        checkboxRow.replaceChildren(checkboxEnable, labelEnable, checkboxChecked, labelChecked);
        jsonItemEditUI.replaceChildren(title, inputFieldInitValue, checkboxRow);
        break;
      //
      case EnumCate.table:
        title.innerHTML = "Table";
        //
        let tableTypeRow = document.createElement("div");
        tableTypeRow.className = "row";
        let typeTitle = document.createElement("div");
        typeTitle.className = "regular1";
        typeTitle.innerHTML = "Table type";
        typeTitle.style.flex = 1;
        let tableTypes = [
          { title: "header", value: TableType.header },
          { title: "only body", value: TableType.only_body },
          { title: "header & footer", value: TableType.header_footer },
          { title: "footer", value: TableType.footer },
        ];
        let tbTypeInt = selected_list[0].JsonItem.Type;
        let dropdownBtnType = _btnDropDownSelect(
          tableTypes,
          function (options) {
            for (let option of options) {
              let initVl = option.getAttribute("value");
              option.firstChild.style.opacity = initVl == selected_list[0].JsonItem.Type ? 1 : 0;
            }
          },
          function (option) {
            editJsonItem({ TableType: parseInt(option) });
            tbTypeInt = parseInt(option);
            renderEditTableAttr();
            dropdownBtnType.firstChild.innerHTML = tableTypes.find((tbType) => tbType.value === parseInt(option)).title;
          },
        );
        dropdownBtnType.firstChild.innerHTML = tableTypes.find((tbType) => tbType.value === tbTypeInt).title;
        tableTypeRow.replaceChildren(typeTitle, dropdownBtnType);
        //
        let inputFieldColNumber = document.createElement("div");
        inputFieldColNumber.className = "input-edit-field row";
        let labelColNumber = document.createElement("label");
        labelColNumber.htmlFor = "table-col-num";
        labelColNumber.className = "regular1";
        labelColNumber.innerHTML = "Number of column";
        let inputColNumber = document.createElement("input");
        inputColNumber.id = "table-col-num";
        inputColNumber.className = "regular1";
        inputColNumber.defaultValue = Math.max(...selected_list[0].TableRows.map((tr) => tr.length));
        inputFieldColNumber.replaceChildren(labelColNumber, inputColNumber);
        inputColNumber.onblur = function (e) {
          e.stopPropagation();
          if (!isNaN(parseInt(this.value)) && Math.max(...selected_list[0].TableRows.map((tr) => tr.length)) !== parseInt(this.value) && parseInt(this.value) > 0) editJsonItem({ ColNumber: parseInt(this.value) });
          else this.value = Math.max(...selected_list[0].TableRows.map((tr) => tr.length));
        };
        //
        let inputFieldRowNumber = document.createElement("div");
        inputFieldRowNumber.className = "input-edit-field row";
        let labelRowNumber = document.createElement("label");
        labelRowNumber.htmlFor = "table-row-num";
        labelRowNumber.className = "regular1";
        labelRowNumber.innerHTML = "Number of row";
        let inputRowNumber = document.createElement("input");
        inputRowNumber.id = "table-row-num";
        inputRowNumber.className = "regular1";
        inputRowNumber.defaultValue = selected_list[0].TableRows.length;
        inputFieldRowNumber.replaceChildren(labelRowNumber, inputRowNumber);
        inputRowNumber.onblur = function (e) {
          e.stopPropagation();
          if (!isNaN(parseInt(this.value)) && selected_list[0].TableRows.length !== parseInt(this.value) && parseInt(this.value) > 0) editJsonItem({ RowNumber: this.value });
          else this.value = selected_list[0].TableRows.length;
        };
        //
        let inputFieldColBorder = document.createElement("div");
        inputFieldColBorder.className = "input-edit-field row";
        let labelColBorder = document.createElement("label");
        labelColBorder.htmlFor = "table-col-border";
        labelColBorder.className = "regular1";
        labelColBorder.innerHTML = "Vertical border width";
        let inputColBorder = document.createElement("input");
        inputColBorder.id = "table-col-border";
        inputColBorder.className = "regular1";
        inputColBorder.defaultValue = selected_list[0].JsonItem.ColBorderWidth ?? 0;
        inputFieldColBorder.replaceChildren(labelColBorder, inputColBorder);
        inputColBorder.onblur = function (e) {
          e.stopPropagation();
          if (selected_list[0].JsonItem.ColBorderWidth != this.value) editJsonItem({ ColBorderWidth: this.value });
        };
        //
        let inputFieldRowBorder = document.createElement("div");
        inputFieldRowBorder.className = "input-edit-field row";
        let labelRowBorder = document.createElement("label");
        labelRowBorder.htmlFor = "table-row-border";
        labelRowBorder.className = "regular1";
        labelRowBorder.innerHTML = "Horizontal border width";
        let inputRowBorder = document.createElement("input");
        inputRowBorder.id = "table-row-border";
        inputRowBorder.className = "regular1";
        inputRowBorder.defaultValue = selected_list[0].JsonItem.RowBorderWidth ?? 0;
        inputFieldRowBorder.replaceChildren(labelRowBorder, inputRowBorder);
        inputRowBorder.onblur = function (e) {
          e.stopPropagation();
          if (selected_list[0].JsonItem.RowBorderWidth != this.value) editJsonItem({ RowBorderWidth: this.value });
        };
        //
        let tableLayoutRow = document.createElement("div");
        tableLayoutRow.className = "row";
        tableLayoutRow.style.columnGap = "60px";
        let layoutTitle = document.createElement("div");
        layoutTitle.className = "regular1";
        layoutTitle.innerHTML = "Table layout";
        let dropdownBtnLayout = _btnDropDownSelect(
          ["auto", "fixed"],
          function (options) {
            for (let option of options) {
              let initVl = option.getAttribute("value");
              option.firstChild.style.opacity = initVl === selected_list[0].JsonItem.TableLayout ? 1 : 0;
            }
          },
          function (option) {
            editJsonItem({ TableLayout: option });
            dropdownBtnLayout.firstChild.innerHTML = option;
          },
        );
        dropdownBtnLayout.firstChild.innerHTML = selected_list[0].JsonItem.TableLayout;
        tableLayoutRow.replaceChildren(layoutTitle, dropdownBtnLayout);
        //
        let editHeaderBg = document.createElement("div");
        editHeaderBg.className = "col regular1";
        editHeaderBg.innerHTML = "Header background";
        editHeaderBg.appendChild(
          editColorContainer(selected_list[0].JsonItem.HeaderBackground, function (colorVl, onSubmit) {
            editJsonItem({ HeaderBackground: colorVl }, onSubmit ?? true);
          }),
        );
        let editFooterBg = document.createElement("div");
        editFooterBg.className = "col regular1";
        editFooterBg.innerHTML = "Footer background";
        editFooterBg.appendChild(
          editColorContainer(selected_list[0].JsonItem.FooterBackground, function (colorVl, onSubmit) {
            editJsonItem({ FooterBackground: colorVl }, onSubmit ?? true);
          }),
        );
        //
        function renderEditTableAttr() {
          switch (tbTypeInt) {
            case TableType.header_footer:
              jsonItemEditUI.replaceChildren(title, tableTypeRow, inputFieldColNumber, inputFieldRowNumber, inputFieldColBorder, inputFieldRowBorder, tableLayoutRow, editHeaderBg, editFooterBg);
              break;
            case TableType.header:
              jsonItemEditUI.replaceChildren(title, tableTypeRow, inputFieldColNumber, inputFieldRowNumber, inputFieldColBorder, inputFieldRowBorder, tableLayoutRow, editHeaderBg);
              break;
            case TableType.footer:
              jsonItemEditUI.replaceChildren(title, tableTypeRow, inputFieldColNumber, inputFieldRowNumber, inputFieldColBorder, inputFieldRowBorder, tableLayoutRow, editFooterBg);
              break;
            default:
              jsonItemEditUI.replaceChildren(title, tableTypeRow, inputFieldColNumber, inputFieldRowNumber, inputFieldColBorder, inputFieldRowBorder, tableLayoutRow);
              break;
          }
        }
        renderEditTableAttr();
        break;
      //
      case EnumCate.tree:
        title.innerHTML = "Tree";
        //
        let actionPositionRow = document.createElement("div");
        actionPositionRow.className = "row";
        actionPositionRow.style.columnGap = "60px";
        let actionPosTitle = document.createElement("div");
        actionPosTitle.className = "regular1";
        actionPosTitle.innerHTML = "Action postion";
        let drpBtnActPosition = _btnDropDownSelect(
          ["right", "left"],
          function (options) {
            for (let option of options) {
              let initVl = option.getAttribute("value");
              option.firstChild.style.opacity = initVl === selected_list[0].JsonItem.ActionPosition ? 1 : 0;
            }
          },
          function (option) {
            editJsonItem({ ActionPosition: option });
            drpBtnActPosition.firstChild.innerHTML = option;
          },
        );
        drpBtnActPosition.firstChild.innerHTML = selected_list[0].JsonItem.ActionPosition;
        actionPositionRow.replaceChildren(actionPosTitle, drpBtnActPosition);
        //
        var actionTypeRow = document.createElement("div");
        actionTypeRow.className = "row";
        actionTypeRow.style.columnGap = "60px";
        var actionTypeTitle = document.createElement("div");
        actionTypeTitle.className = "regular1";
        actionTypeTitle.innerHTML = "Action type";
        var drpBtnActType = _btnDropDownSelect(
          ["caret", "chevron"],
          function (options) {
            for (let option of options) {
              let initVl = option.getAttribute("value");
              option.firstChild.style.opacity = initVl === selected_list[0].JsonItem.ActionType ? 1 : 0;
            }
          },
          function (option) {
            editJsonItem({ ActionType: option });
            drpBtnActType.firstChild.innerHTML = option;
          },
        );
        drpBtnActType.firstChild.innerHTML = selected_list[0].JsonItem.ActionType;
        actionTypeRow.replaceChildren(actionTypeTitle, drpBtnActType);
        //
        var inputFieldActionSize = document.createElement("div");
        inputFieldActionSize.className = "input-edit-field row";
        inputFieldActionSize.style.columnGap = "24px";
        var labelActionSize = document.createElement("label");
        labelActionSize.htmlFor = "tree-action-size";
        labelActionSize.className = "regular1";
        labelActionSize.innerHTML = "Action size";
        var inputActionSize = document.createElement("input");
        inputActionSize.id = "tree-action-size";
        inputActionSize.className = "regular1";
        inputActionSize.defaultValue = selected_list[0].JsonItem.ActionSize ?? 0;
        inputFieldActionSize.replaceChildren(labelActionSize, inputActionSize);
        inputActionSize.onblur = function (e) {
          e.stopPropagation();
          if (selected_list[0].JsonItem.ActionSize != this.value && !isNaN(this.value)) editJsonItem({ ActionSize: parseFloat(this.value) });
        };
        //
        let inputFieldIndentSpace = document.createElement("div");
        inputFieldIndentSpace.className = "input-edit-field row";
        inputFieldIndentSpace.style.columnGap = "24px";
        let labelIndentSpace = document.createElement("label");
        labelIndentSpace.htmlFor = "tree-indent-space";
        labelIndentSpace.className = "regular1";
        labelIndentSpace.innerHTML = "Indent space";
        let inputIndentSpace = document.createElement("input");
        inputIndentSpace.id = "tree-indent-space";
        inputIndentSpace.className = "regular1";
        inputIndentSpace.defaultValue = selected_list[0].JsonItem.IndentSpace ?? 0;
        inputFieldIndentSpace.replaceChildren(labelIndentSpace, inputIndentSpace);
        inputIndentSpace.onblur = function (e) {
          e.stopPropagation();
          if (selected_list[0].JsonItem.IndentSpace != this.value && !isNaN(this.value)) editJsonItem({ IndentSpace: parseFloat(this.value) });
        };
        //
        let defaultHidekRow = document.createElement("div");
        defaultHidekRow.className = "row";
        let checkboxDefaultHide = document.createElement("input");
        checkboxDefaultHide.id = "tree-check-default-hide";
        checkboxDefaultHide.type = "checkbox";
        checkboxDefaultHide.defaultChecked = selected_list[0].JsonItem.DefaultHide;
        checkboxDefaultHide.onchange = function (e) {
          e.stopPropagation();
          editJsonItem({ DefaultHide: this.checked });
        };
        let labelDefaultHide = document.createElement("label");
        labelDefaultHide.className = "regular1";
        labelDefaultHide.htmlFor = "tree-check-default-hide";
        labelDefaultHide.innerHTML = "Default shorten";
        defaultHidekRow.replaceChildren(checkboxDefaultHide, labelDefaultHide);
        //
        var editActionColor = document.createElement("div");
        editActionColor.className = "col regular1";
        editActionColor.innerHTML = "Action color";
        editActionColor.appendChild(
          editColorContainer(selected_list[0].JsonItem.ActionColor, function (colorVl, onSubmit) {
            editJsonItem({ ActionColor: colorVl }, onSubmit ?? true);
          }),
        );
        //
        let fakeTreeData = document.createElement("div");
        fakeTreeData.className = "content-data-container";
        let treeDataHeader = document.createElement("div");
        treeDataHeader.className = "row";
        let headerTitle = document.createElement("div");
        headerTitle.className = "semibold1 row";
        headerTitle.innerHTML = "Tree data";
        headerTitle.style.flexFlow = "row-reverse";
        headerTitle.style.columnGap = "6px";
        let btnAddDataProperty = document.createElement("i");
        btnAddDataProperty.className = "fa-solid fa-plus";
        btnAddDataProperty.onclick = function () {
          setTimeout(function () {
            let offset = treeDataHeader.getBoundingClientRect();
            let currentData = JSON.parse(JSON.stringify(selected_list[0].TreeData));
            let fakeDataPopup = popupAddOrEditFakeData(null, selected_list[0].TreeData, [], 0, null, function () {
              selected_list[0].TreeData = currentData;
            });
            fakeDataPopup.style.left = offset.x + "px";
            fakeDataPopup.style.top = offset.y + "px";
            document.getElementById("body").appendChild(fakeDataPopup);
            if (fakeDataPopup.getBoundingClientRect().bottom - document.body.offsetHeight > 12) {
              fakeDataPopup.style.top = `${fakeDataPopup.getBoundingClientRect().top - (fakeDataPopup.getBoundingClientRect().bottom - document.body.offsetHeight) - 12}px`;
            }
          }, 150);
        };
        treeDataHeader.replaceChildren(headerTitle, btnAddDataProperty);
        let treeDataBody = document.createElement("div");
        treeDataBody.className = "col content-data-body";
        fakeTreeData.replaceChildren(treeDataHeader, treeDataBody);
        treeDataBody.replaceChildren(...jsonPropertyForm([], 0, selected_list[0].TreeData));
        //
        jsonItemEditUI.replaceChildren(title, actionPositionRow, actionTypeRow, inputFieldActionSize, inputFieldIndentSpace, defaultHidekRow, editActionColor, fakeTreeData);
        break;
      //
      case EnumCate.carousel:
        title.innerHTML = "Carousel";
        //
        let effectTypeRow = document.createElement("div");
        effectTypeRow.className = "row";
        effectTypeRow.style.columnGap = "60px";
        let effectTypeTitle = document.createElement("div");
        effectTypeTitle.className = "regular1";
        effectTypeTitle.innerHTML = "Effect type";
        let drpBtnEffectType = _btnDropDownSelect(
          [WCarouselEffect.fade, WCarouselEffect.easeInOut],
          function (options) {
            for (let option of options) {
              let initVl = option.getAttribute("value");
              option.firstChild.style.opacity = initVl === selected_list[0].JsonItem.Effect ? 1 : 0;
            }
          },
          function (option) {
            editJsonItem({ CaroEffect: option });
            drpBtnEffectType.firstChild.innerHTML = option;
          },
        );
        drpBtnEffectType.firstChild.innerHTML = selected_list[0].JsonItem.Effect;
        effectTypeRow.replaceChildren(effectTypeTitle, drpBtnEffectType);
        //
        let inputFieldTransition = document.createElement("div");
        inputFieldTransition.className = "input-edit-field row";
        inputFieldTransition.style.columnGap = "24px";
        let labelTransition = document.createElement("label");
        labelTransition.htmlFor = "carousel-transition-time";
        labelTransition.className = "regular1";
        labelTransition.innerHTML = "Transition time(ms)";
        let inputTransitionTime = document.createElement("input");
        inputTransitionTime.id = "carousel-transition-time";
        inputTransitionTime.className = "regular1";
        inputTransitionTime.defaultValue = selected_list[0].JsonItem.TransitionTime ?? 0;
        inputFieldTransition.replaceChildren(labelTransition, inputTransitionTime);
        inputTransitionTime.onblur = function (e) {
          e.stopPropagation();
          if (selected_list[0].JsonItem.TransitionTime != this.value && !isNaN(this.value)) editJsonItem({ TransitionTime: parseInt(this.value) });
        };
        //
        let inputFieldTransform = document.createElement("div");
        inputFieldTransform.className = "input-edit-field row";
        inputFieldTransform.style.columnGap = "24px";
        let labelTransform = document.createElement("label");
        labelTransform.htmlFor = "carousel-transform-time";
        labelTransform.className = "regular1";
        labelTransform.innerHTML = "Transform time(ms)";
        let inputTransformTime = document.createElement("input");
        inputTransformTime.id = "carousel-transform-time";
        inputTransformTime.className = "regular1";
        inputTransformTime.defaultValue = selected_list[0].JsonItem.TransformTime ?? 0;
        inputFieldTransform.replaceChildren(labelTransform, inputTransformTime);
        inputTransformTime.onblur = function (e) {
          e.stopPropagation();
          if (selected_list[0].JsonItem.TransformTime != this.value && !isNaN(this.value)) editJsonItem({ TransformTime: parseInt(this.value) });
        };
        //
        let playPreviewRow = document.createElement("div");
        playPreviewRow.className = "row";
        playPreviewRow.style.justifyContent = "space-between";
        let checkAutoPlayRow = document.createElement("div");
        checkAutoPlayRow.className = "row";
        let checkboxAutoPlay = document.createElement("input");
        checkboxAutoPlay.id = "carousel-check-auto-play";
        checkboxAutoPlay.type = "checkbox";
        checkboxAutoPlay.defaultChecked = selected_list[0].JsonItem.AutoPlay;
        checkboxAutoPlay.onchange = function (e) {
          e.stopPropagation();
          editJsonItem({ AutoPlay: this.checked });
          btnPreview.style.display = this.checked ? "flex" : "none";
        };
        let labelAutoPlay = document.createElement("label");
        labelAutoPlay.className = "regular1";
        labelAutoPlay.htmlFor = "carousel-check-auto-play";
        labelAutoPlay.innerHTML = "Auto play";
        checkAutoPlayRow.replaceChildren(checkboxAutoPlay, labelAutoPlay);
        let btnPreview = document.createElement("div");
        btnPreview.className = "row preview-carousel-data";
        btnPreview.style.display = selected_list[0].JsonItem.AutoPlay ? "flex" : "none";
        let previewFocus = document.createElement("input");
        previewFocus.id = "preview-carousel-focus";
        let previewLabel = document.createElement("label");
        previewLabel.innerHTML = "Preview";
        previewLabel.htmlFor = "preview-carousel-focus";
        previewLabel.className = "regular1 row";
        let previewIcon = document.createElement("i");
        previewIcon.className = "fa-solid fa-play fa-xs";
        previewLabel.appendChild(previewIcon);
        btnPreview.replaceChildren(previewFocus, previewLabel);
        previewFocus.onclick = function () {
          createCarousel(
            selected_list[0],
            wbase_list.filter((e) => e.ParentID === selected_list[0].GID),
          );
          playCarousel(selected_list[0].value);
        };
        previewFocus.onblur = function () {
          stopCarousel(selected_list[0].value);
        };
        playPreviewRow.replaceChildren(checkAutoPlayRow, btnPreview);
        //
        var actionTypeRow = document.createElement("div");
        actionTypeRow.className = "row";
        actionTypeRow.style.columnGap = "60px";
        var actionTypeTitle = document.createElement("div");
        actionTypeTitle.className = "regular1";
        actionTypeTitle.innerHTML = "Action type";
        var drpBtnActType = _btnDropDownSelect(
          ["caret", "chevron"],
          function (options) {
            for (let option of options) {
              let initVl = option.getAttribute("value");
              option.firstChild.style.opacity = initVl === selected_list[0].JsonItem.ActionType ? 1 : 0;
            }
          },
          function (option) {
            editJsonItem({ CaroActionType: option });
            drpBtnActType.firstChild.innerHTML = option;
          },
        );
        drpBtnActType.firstChild.innerHTML = selected_list[0].JsonItem.ActionType;
        actionTypeRow.replaceChildren(actionTypeTitle, drpBtnActType);
        //
        var inputFieldActionSize = document.createElement("div");
        inputFieldActionSize.className = "input-edit-field row";
        inputFieldActionSize.style.columnGap = "24px";
        var labelActionSize = document.createElement("label");
        labelActionSize.htmlFor = "tree-action-size";
        labelActionSize.className = "regular1";
        labelActionSize.innerHTML = "Action size";
        var inputActionSize = document.createElement("input");
        inputActionSize.id = "tree-action-size";
        inputActionSize.className = "regular1";
        inputActionSize.defaultValue = selected_list[0].JsonItem.ActionSize ?? 0;
        inputFieldActionSize.replaceChildren(labelActionSize, inputActionSize);
        inputActionSize.onblur = function (e) {
          e.stopPropagation();
          if (selected_list[0].JsonItem.ActionSize != this.value && !isNaN(this.value)) editJsonItem({ CaroActionSize: parseFloat(this.value) });
        };
        //
        var editActionColor = document.createElement("div");
        editActionColor.className = "col regular1";
        editActionColor.innerHTML = "Action color";
        editActionColor.appendChild(
          editColorContainer(selected_list[0].JsonItem.ActionColor, function (colorVl, onSubmit) {
            editJsonItem({ CaroActionColor: colorVl }, onSubmit ?? true);
          }),
        );
        //
        var editActionBgColor = document.createElement("div");
        editActionBgColor.className = "col regular1";
        editActionBgColor.innerHTML = "Action background color";
        editActionBgColor.appendChild(
          editColorContainer(selected_list[0].JsonItem.ActionBackground, function (colorVl, onSubmit) {
            editJsonItem({ CaroActionBgColor: colorVl }, onSubmit ?? true);
          }),
        );
        //
        let fakeCarouselData = document.createElement("div");
        fakeCarouselData.className = "content-data-container";
        let carouselDataHeader = document.createElement("div");
        carouselDataHeader.className = "row";
        let caroDataHeaderTitle = document.createElement("div");
        caroDataHeaderTitle.className = "semibold1 row";
        caroDataHeaderTitle.innerHTML = "Carousel data";
        caroDataHeaderTitle.style.flexFlow = "row-reverse";
        caroDataHeaderTitle.style.columnGap = "6px";
        let btnAddCaroDataProperty = document.createElement("i");
        btnAddCaroDataProperty.className = "fa-solid fa-plus";
        btnAddCaroDataProperty.onclick = function () {
          setTimeout(function () {
            let offset = carouselDataHeader.getBoundingClientRect();
            let currentData = JSON.parse(JSON.stringify(selected_list[0].CarouselData));
            let fakeDataPopup = popupAddOrEditFakeData(null, selected_list[0].CarouselData, [], 0, null, function () {
              selected_list[0].CarouselData = currentData;
            });
            fakeDataPopup.style.left = offset.x + "px";
            fakeDataPopup.style.top = offset.y + "px";
            document.getElementById("body").appendChild(fakeDataPopup);
            if (fakeDataPopup.getBoundingClientRect().bottom - document.body.offsetHeight > 12) {
              fakeDataPopup.style.top = `${fakeDataPopup.getBoundingClientRect().top - (fakeDataPopup.getBoundingClientRect().bottom - document.body.offsetHeight) - 12}px`;
            }
          }, 150);
        };
        carouselDataHeader.replaceChildren(caroDataHeaderTitle, btnAddCaroDataProperty);
        let carouselDataBody = document.createElement("div");
        carouselDataBody.className = "col content-data-body";
        fakeCarouselData.replaceChildren(carouselDataHeader, carouselDataBody);
        carouselDataBody.replaceChildren(...jsonPropertyForm([], 0, selected_list[0].CarouselData));
        //
        jsonItemEditUI.replaceChildren(title, effectTypeRow, inputFieldTransition, inputFieldTransform, playPreviewRow, actionTypeRow, inputFieldActionSize, editActionColor, editActionBgColor, fakeCarouselData);
        break;
      //
      case EnumCate.chart:
        title.innerHTML = "Chart";
        //
        let chartTypeRow = document.createElement("div");
        chartTypeRow.className = "row";
        chartTypeRow.style.columnGap = "60px";
        let chartTypeTitle = document.createElement("div");
        chartTypeTitle.className = "regular1";
        chartTypeTitle.innerHTML = "Action type";
        let drpBtnChartType = _btnDropDownSelect(
          ChartType.list,
          function (options) {
            for (let option of options) {
              let initVl = option.getAttribute("value");
              option.firstChild.style.opacity = initVl === selected_list[0].JsonItem.Type ? 1 : 0;
            }
          },
          function (option) {
            editJsonItem({ ChartType: option });
            drpBtnChartType.firstChild.innerHTML = option;
          },
        );
        drpBtnChartType.firstChild.innerHTML = selected_list[0].JsonItem.Type;
        chartTypeRow.replaceChildren(chartTypeTitle, drpBtnChartType);
        //
        let inputFieldHoverOffset = document.createElement("div");
        inputFieldHoverOffset.className = "input-edit-field row";
        inputFieldHoverOffset.style.columnGap = "24px";
        let labelHoverOffset = document.createElement("label");
        labelHoverOffset.htmlFor = "chart-hover-offset";
        labelHoverOffset.className = "regular1";
        labelHoverOffset.innerHTML = "Hover offset";
        let inputHoverOffset = document.createElement("input");
        inputHoverOffset.id = "chart-hover-offset";
        inputHoverOffset.className = "regular1";
        inputHoverOffset.defaultValue = selected_list[0].JsonItem.HoverOffset ?? 0;
        inputFieldHoverOffset.replaceChildren(labelHoverOffset, inputHoverOffset);
        inputHoverOffset.onblur = function (e) {
          e.stopPropagation();
          if (selected_list[0].JsonItem.HoverOffset != this.value && !isNaN(this.value)) editJsonItem({ HoverOffset: parseFloat(this.value) });
        };
        //
        let inputFieldMaxValue = document.createElement("div");
        inputFieldMaxValue.className = "input-edit-field row";
        inputFieldMaxValue.style.columnGap = "24px";
        let labelMaxValue = document.createElement("label");
        labelMaxValue.htmlFor = "chart-max-value";
        labelMaxValue.className = "regular1";
        labelMaxValue.innerHTML = "Max value";
        let inputMaxValue = document.createElement("input");
        inputMaxValue.id = "chart-max-value";
        inputMaxValue.className = "regular1";
        inputMaxValue.defaultValue = selected_list[0].JsonItem.MaxValue ?? 0;
        inputFieldMaxValue.replaceChildren(labelMaxValue, inputMaxValue);
        inputMaxValue.onblur = function (e) {
          e.stopPropagation();
          if (selected_list[0].JsonItem.MaxValue != this.value && (!isNaN(this.value) || this.value.toLowerCase() === "auto"))
            if (this.value.toLowerCase() === "auto") editJsonItem({ MaxValue: "auto" });
            else editJsonItem({ MaxValue: parseFloat(this.value) });
        };
        //
        let inputFieldStepSize = document.createElement("div");
        inputFieldStepSize.className = "input-edit-field row";
        inputFieldStepSize.style.columnGap = "24px";
        let labelStepSize = document.createElement("label");
        labelStepSize.htmlFor = "chart-step-size";
        labelStepSize.className = "regular1";
        labelStepSize.innerHTML = "Step size";
        let inputStepSize = document.createElement("input");
        inputStepSize.id = "chart-step-size";
        inputStepSize.className = "regular1";
        inputStepSize.defaultValue = (selected_list[0].JsonItem.StepSize ?? 0) === 0 ? "auto" : selected_list[0].JsonItem.StepSize;
        inputFieldStepSize.replaceChildren(labelStepSize, inputStepSize);
        inputStepSize.onblur = function (e) {
          e.stopPropagation();
          if (selected_list[0].JsonItem.StepSize != this.value && (!isNaN(this.value) || this.value.toLowerCase() === "auto")) {
            if (this.value.toLowerCase() === "auto") editJsonItem({ StepSize: 0 });
            else editJsonItem({ StepSize: parseFloat(this.value) });
          }
        };
        //
        let fakeChartData = document.createElement("div");
        fakeChartData.className = "content-data-container";
        let chartDataHeader = document.createElement("div");
        chartDataHeader.className = "row";
        let chartHeaderTitle = document.createElement("div");
        chartHeaderTitle.className = "semibold1 row";
        chartHeaderTitle.innerHTML = "Chart data";
        chartHeaderTitle.style.flexFlow = "row-reverse";
        chartHeaderTitle.style.columnGap = "6px";
        let btnAddDataChart = document.createElement("i");
        btnAddDataChart.className = "fa-solid fa-plus";
        btnAddDataChart.style.display = "none";
        chartDataHeader.replaceChildren(chartHeaderTitle, btnAddDataChart);
        let chartDataBody = document.createElement("div");
        chartDataBody.className = "col content-data-body";
        fakeChartData.replaceChildren(chartDataHeader, chartDataBody);
        chartDataBody.replaceChildren(...jsonPropertyForm([], 0, selected_list[0].ChartData));
        //
        if (ChartType.axes_chart.some((axesType) => selected_list[0].JsonItem.Type === axesType)) {
          jsonItemEditUI.replaceChildren(title, chartTypeRow, inputFieldMaxValue, inputFieldStepSize, fakeChartData);
        } else if ([ChartType.doughnut, ChartType.pie].some((pieType) => selected_list[0].JsonItem.Type === pieType)) {
          jsonItemEditUI.replaceChildren(title, chartTypeRow, inputFieldHoverOffset, fakeChartData);
        } else {
          jsonItemEditUI.replaceChildren(title, chartTypeRow, fakeChartData);
        }
        break;
      //
      case EnumCate.textformfield:
        title.innerHTML = "Textformfield";
        //
        var inputFieldInitValue = document.createElement("div");
        inputFieldInitValue.className = "input-edit-field row";
        var labelInitValue = document.createElement("label");
        labelInitValue.htmlFor = "txtfd-init-vl";
        labelInitValue.className = "regular1";
        labelInitValue.innerHTML = "Init value";
        var inputInitValue = document.createElement("input");
        inputInitValue.id = "txtfd-init-vl";
        inputInitValue.className = "regular1";
        inputInitValue.defaultValue = selected_list[0].AttributesItem.Content;
        inputFieldInitValue.replaceChildren(labelInitValue, inputInitValue);
        inputInitValue.onblur = function (e) {
          e.stopPropagation();
          if (selected_list[0].AttributesItem.Content != this.value) editJsonItem({ Content: this.value });
        };
        //
        let inputFieldLabel = document.createElement("div");
        inputFieldLabel.className = "input-edit-field row";
        let labelLabel = document.createElement("label");
        labelLabel.htmlFor = "txtfd-label";
        labelLabel.className = "regular1";
        labelLabel.innerHTML = "Label";
        let inputLabel = document.createElement("input");
        inputLabel.id = "txtfd-label";
        inputLabel.className = "regular1";
        inputLabel.defaultValue = selected_list[0].JsonItem.LabelText;
        inputFieldLabel.replaceChildren(labelLabel, inputLabel);
        inputLabel.onblur = function (e) {
          e.stopPropagation();
          if (selected_list[0].JsonItem.LabelText != this.value) editJsonItem({ LabelText: this.value });
        };
        //
        let inputFieldPlaceholder = document.createElement("div");
        inputFieldPlaceholder.className = "input-edit-field row";
        let labelPlaceholder = document.createElement("label");
        labelPlaceholder.htmlFor = "txtfd-placeholder";
        labelPlaceholder.className = "regular1";
        labelPlaceholder.innerHTML = "Placeholder";
        let inputPlaceholder = document.createElement("input");
        inputPlaceholder.id = "txtfd-placeholder";
        inputPlaceholder.className = "regular1";
        inputPlaceholder.defaultValue = selected_list[0].JsonItem.HintText;
        inputPlaceholder.onblur = function (e) {
          e.stopPropagation();
          if (selected_list[0].JsonItem.HintText != this.value) editJsonItem({ HintText: this.value });
        };
        inputFieldPlaceholder.replaceChildren(labelPlaceholder, inputPlaceholder);
        //
        let obscureCheckRow = document.createElement("div");
        obscureCheckRow.className = "row";
        let checkboxObsucre = document.createElement("input");
        checkboxObsucre.id = "txtfd-check-obscure";
        checkboxObsucre.type = "checkbox";
        checkboxObsucre.defaultChecked = selected_list[0].JsonItem.ObscureText;
        checkboxObsucre.onchange = function (e) {
          e.stopPropagation();
          editJsonItem({ ObscureText: this.checked });
        };
        let labelObscure = document.createElement("label");
        labelObscure.className = "regular1";
        labelObscure.htmlFor = "txtfd-check-obscure";
        labelObscure.innerHTML = "Password type";
        obscureCheckRow.replaceChildren(checkboxObsucre, labelObscure);
        //
        let enableRow = document.createElement("div");
        enableRow.className = "row";
        var checkboxEnable = document.createElement("input");
        checkboxEnable.id = "txtfd-check-enable";
        checkboxEnable.type = "checkbox";
        checkboxEnable.defaultChecked = selected_list[0].JsonItem.Enabled;
        checkboxEnable.onchange = function (e) {
          e.stopPropagation();
          editJsonItem({ Enabled: this.checked });
        };
        var labelEnable = document.createElement("label");
        labelEnable.className = "regular1";
        labelEnable.htmlFor = "txtfd-check-enable";
        labelEnable.innerHTML = "Enable";
        let checkboxReadonly = document.createElement("input");
        checkboxReadonly.id = "txtfd-check-readonly";
        checkboxReadonly.type = "checkbox";
        checkboxReadonly.defaultChecked = selected_list[0].JsonItem.ReadOnly;
        checkboxReadonly.onchange = function (e) {
          e.stopPropagation();
          editJsonItem({ ReadOnly: this.checked });
        };
        let labelReadonly = document.createElement("label");
        labelReadonly.className = "regular1";
        labelReadonly.htmlFor = "txtfd-check-readonly";
        labelReadonly.innerHTML = "ReadOnly";
        enableRow.replaceChildren(checkboxEnable, labelEnable, checkboxReadonly, labelReadonly);
        //
        let validateContainer = document.createElement("div");
        validateContainer.className = "col validate-settings";
        let validateHeader = document.createElement("div");
        validateHeader.className = "semibold1 row";
        validateHeader.innerHTML = "Validate";
        if (selected_list[0].JsonItem.JsonVadidate.length < 11) {
          let btnAddValidate = document.createElement("i");
          btnAddValidate.className = "fa-solid fa-plus";
          validateHeader.appendChild(btnAddValidate);
          btnAddValidate.onclick = function () {
            setTimeout(function () {
              let offset = btnAddValidate.getBoundingClientRect();
              let validateTypeSelect = document.createElement("div");
              validateTypeSelect.className = "wini_popup popup_remove list-validate-type-select col";
              validateTypeSelect.style.left = offset.x + "px";
              validateTypeSelect.style.top = offset.bottom + "px";
              for (let x = 0; x < 11; x++) {
                if (selected_list[0].JsonItem.JsonVadidate.every((validateItem) => validateItem.Type !== x)) {
                  let selectValidateBtn = document.createElement("div");
                  selectValidateBtn.className = "regular1";
                  selectValidateBtn.innerHTML = ValidateType.typeName(x);
                  selectValidateBtn.onclick = function (e) {
                    e.stopPropagation();
                    let newValidateItem = {
                      Type: x,
                      Message: "Invalid value!",
                    };
                    if (x === ValidateType.minCharacter) {
                      newValidateItem["MinLength"] = 0;
                    }
                    if (x === ValidateType.maxCharacter) {
                      newValidateItem["MaxLength"] = 8;
                    }
                    selected_list[0].JsonItem.JsonVadidate.push(newValidateItem);
                    WBaseDA.edit(selected_list, EnumObj.attribute);
                    validateTypeSelect.remove();
                    listValidateTile();
                  };
                  validateTypeSelect.appendChild(selectValidateBtn);
                }
              }
              document.getElementById("body").appendChild(validateTypeSelect);
              if (validateTypeSelect.getBoundingClientRect().bottom > document.body.offsetHeight) {
                let dropdownH = document.body.offsetHeight - validateTypeSelect.getBoundingClientRect().y;
                if (dropdownH < 112) {
                  validateTypeSelect.style.height = "112px";
                  validateTypeSelect.style.transform = `translate(-85%,${dropdownH - 112}px)`;
                } else {
                  validateTypeSelect.style.height = `${dropdownH}px`;
                }
                validateTypeSelect.style.overflowY = "scroll";
              }
            }, 200);
          };
        }
        let validateBody = document.createElement("div");
        function listValidateTile() {
          if (selected_list[0].JsonItem.JsonVadidate.length > 0) {
            validateBody.className = "col";
            let autoValidateCheckRow = document.createElement("div");
            autoValidateCheckRow.className = "row";
            autoValidateCheckRow.style.marginBottom = "6px";
            let checkboxAutoValidate = document.createElement("input");
            checkboxAutoValidate.id = "txtfd-check-auto-validate";
            checkboxAutoValidate.type = "checkbox";
            checkboxAutoValidate.defaultChecked = selected_list[0].JsonItem.AutoValidate;
            checkboxAutoValidate.onchange = function (e) {
              e.stopPropagation();
              editJsonItem({ AutoValidate: this.checked });
            };
            let labelAutoValidate = document.createElement("label");
            labelAutoValidate.className = "regular1";
            labelAutoValidate.htmlFor = "txtfd-check-auto-validate";
            labelAutoValidate.innerHTML = "Auto validate";
            autoValidateCheckRow.replaceChildren(checkboxAutoValidate, labelAutoValidate);
            validateBody.replaceChildren(
              autoValidateCheckRow,
              ...selected_list[0].JsonItem.JsonVadidate.map((validateItem) => {
                let validateTile = document.createElement("div");
                validateTile.className = "row validate-tile regular1";
                validateTile.innerHTML = ValidateType.typeName(validateItem.Type);
                let btnRemoveValidate = document.createElement("i");
                btnRemoveValidate.className = "fa-solid fa-minus";
                validateTile.appendChild(btnRemoveValidate);
                btnRemoveValidate.onclick = function (e) {
                  e.stopPropagation();
                  hidePopup(e);
                  selected_list[0].JsonItem.JsonVadidate = selected_list[0].JsonItem.JsonVadidate.filter((vali) => vali.Type !== validateItem.Type);
                  listValidateTile();
                  WBaseDA.edit(selected_list, EnumObj.attribute);
                };
                validateTile.onclick = function () {
                  setTimeout(function () {
                    $(selected_list[0].value).addClass("helper-text");
                    $(selected_list[0].value).attr("helper-text", validateItem.Message);
                    let stateItem = selected_list[0].JsonEventItem.find((e) => e.Name === "State");
                    if (stateItem) {
                      let errorState = stateItem.ListState.find((st) => st.Type === ComponentState.error);
                      if (errorState) {
                        let stateColor = "#E14337";
                        if (errorState.BorderSkinID?.length === 36) {
                          stateColor = BorderDA.list.find((e) => e.GID === errorState.BorderSkinID);
                          stateColor = `#${stateColor.ColorValue.substring(2)}${stateColor.ColorValue.substring(0, 2)}`;
                        }
                        selected_list[0].value.style.setProperty("--state-color", stateColor);
                      }
                    }
                    let offset = validateTile.getBoundingClientRect();
                    let popupMessageValid = document.createElement("div");
                    popupMessageValid.className = "wini_popup popup_remove valite-item-settings";
                    popupMessageValid.style.left = offset.x + "px";
                    popupMessageValid.style.top = offset.y - 8 + "px";
                    let header = document.createElement("div");
                    header.className = "row semibold1";
                    header.innerHTML = "Validate settings";
                    let closeBtn = document.createElement("i");
                    closeBtn.className = "fa-solid fa-xmark";
                    closeBtn.onclick = function (e) {
                      e.stopPropagation();
                      popupMessageValid.remove();
                    };
                    header.appendChild(closeBtn);
                    let body = document.createElement("div");
                    body.className = "col";
                    let inputFieldMessage = document.createElement("div");
                    inputFieldMessage.className = "input-edit-field row";
                    let labelMessage = document.createElement("label");
                    labelMessage.htmlFor = "validate-message";
                    labelMessage.className = "regular1";
                    labelMessage.innerHTML = "Message";
                    let inputMessage = document.createElement("input");
                    inputMessage.id = "validate-message";
                    inputMessage.className = "regular1";
                    inputMessage.defaultValue = validateItem.Message;
                    inputMessage.onblur = function (e) {
                      e.stopPropagation();
                      validateItem.Message = this.value;
                      $(selected_list[0].value).attr("helper-text", this.value);
                      WBaseDA.edit(selected_list, EnumObj.attribute);
                    };
                    inputFieldMessage.replaceChildren(labelMessage, inputMessage);
                    body.replaceChildren(inputFieldMessage);
                    if (validateItem.Type === ValidateType.maxCharacter) {
                      let inputFieldMaxLength = document.createElement("div");
                      inputFieldMaxLength.className = "input-edit-field row";
                      let labelMaxLength = document.createElement("label");
                      labelMaxLength.htmlFor = "validate-message";
                      labelMaxLength.className = "regular1";
                      labelMaxLength.innerHTML = "Min length";
                      let inputMaxLength = document.createElement("input");
                      inputMaxLength.id = "validate-message";
                      inputMaxLength.className = "regular1";
                      inputMaxLength.defaultValue = validateItem.MaxLength;
                      inputMaxLength.onblur = function (e) {
                        e.stopPropagation();
                        if (isNaN(parseInt(this.value))) {
                          this.value = validateItem.MaxLength;
                        } else {
                          validateItem.MaxLength = parseInt(this.value);
                          WBaseDA.edit(selected_list, EnumObj.attribute);
                        }
                      };
                      inputFieldMaxLength.replaceChildren(labelMaxLength, inputMaxLength);
                      body.appendChild(inputFieldMaxLength);
                    }
                    if (validateItem.Type === ValidateType.minCharacter) {
                      let inputFieldMinLength = document.createElement("div");
                      inputFieldMinLength.className = "input-edit-field row";
                      let labelMinLength = document.createElement("label");
                      labelMinLength.htmlFor = "validate-message";
                      labelMinLength.className = "regular1";
                      labelMinLength.innerHTML = "Max length";
                      let inputMinLength = document.createElement("input");
                      inputMinLength.id = "validate-message";
                      inputMinLength.className = "regular1";
                      inputMinLength.defaultValue = validateItem.MinLength;
                      inputMinLength.onblur = function (e) {
                        e.stopPropagation();
                        if (isNaN(parseInt(this.value))) {
                          this.value = validateItem.MinLength;
                        } else {
                          validateItem.MinLength = parseInt(this.value);
                          WBaseDA.edit(selected_list, EnumObj.attribute);
                        }
                      };
                      inputFieldMinLength.replaceChildren(labelMinLength, inputMinLength);
                      body.appendChild(inputFieldMinLength);
                    }
                    popupMessageValid.replaceChildren(header, body);
                    document.getElementById("body").appendChild(popupMessageValid);
                    if (popupMessageValid.getBoundingClientRect().bottom > document.body.offsetHeight) {
                      popupMessageValid.style.transform = `translate(calc(-100% - 16px), ${document.body.offsetHeight - popupMessageValid.getBoundingClientRect().bottom}px)`;
                    }
                    handlePopupDispose(popupMessageValid, function () {
                      divSection.querySelectorAll(".textformfield.helper-text").forEach((element) => {
                        $(element).removeClass("helper-text");
                        $(element).removeAttr("helper-text");
                        element.style.removeProperty("--state-color");
                      });
                    });
                  }, 200);
                };
                return validateTile;
              }),
            );
          } else {
            validateBody.replaceWith(document.createElement("div"));
          }
        }
        listValidateTile();
        validateContainer.replaceChildren(validateHeader, validateBody);
        //
        jsonItemEditUI.replaceChildren(title, inputFieldInitValue, inputFieldLabel, inputFieldPlaceholder, obscureCheckRow, enableRow, validateContainer);
        break;
      default:
        break;
    }
    return jsonItemEditUI;
  }
  
  function editColorContainer(color, func) {
    color = color.toUpperCase();
    let container = document.createElement("div");
    container.className = "row";
    let colorContainer = document.createElement("div");
    colorContainer.className = "row edit-color-container";
    let demoColor = document.createElement("input");
    demoColor.type = "color";
    demoColor.defaultValue = `#${color.substring(2)}`;
    demoColor.className = "demo-color";
    demoColor.oninput = function (e) {
      e.stopPropagation();
      hexColor.value = this.value.replace("#", "");
      func(Ultis.percentToHex(parseFloat(opacityColor.value.replace("%", ""))) + this.value.replace("#", ""), false);
    };
    demoColor.onblur = function (e) {
      e.stopPropagation();
      hexColor.value = this.value.replace("#", "");
      func(Ultis.percentToHex(parseFloat(opacityColor.value.replace("%", ""))) + this.value.replace("#", ""));
    };
    let hexColor = document.createElement("input");
    hexColor.defaultValue = `${color.substring(2)}`;
    hexColor.className = "hex-color-value regular1";
    hexColor.maxLength = 6;
    hexColor.onblur = function (e) {
      e.stopPropagation();
      func(Ultis.percentToHex(parseFloat(opacityColor.value.replace("%", ""))) + this.value);
    };
    let opacityColor = document.createElement("input");
    opacityColor.defaultValue = `${Ultis.hexToPercent(color.substring(0, 2))}%`;
    opacityColor.className = "opacity-color-value regular1";
    opacityColor.onblur = function (e) {
      e.stopPropagation();
      if (!isNaN(parseInt(this.value.replace("%", "")))) {
        func(Ultis.percentToHex(this.value.replace("%", "")) + hexColor.value);
        this.value = parseInt(this.value.replace("%", "")) + "%";
      }
    };
    colorContainer.replaceChildren(demoColor, hexColor, opacityColor);
    let btnSkin = document.createElement("button");
    let imgIcon = document.createElement("img");
    imgIcon.src = "https://cdn.jsdelivr.net/gh/WiniGit/goline@6520db8/lib/assets/buttonStyle.svg";
    btnSkin.appendChild(imgIcon);
    btnSkin.onclick = function (event) {
      event.stopPropagation();
      let offset = container.getBoundingClientRect();
      createDropdownTableSkin(EnumCate.color, offset);
      document
        .getElementById("popup_table_skin")
        .querySelectorAll(".skin_tile_option")
        .forEach((e) => {
          e.onclick = function (ev) {
            ev.stopPropagation();
            let newColorValue = ColorDA.list.find((skin) => skin.GID == this.id.replace("skinID:", "")).Value;
            demoColor.value = `#${newColorValue.substring(2)}`;
            hexColor.value = `${newColorValue.substring(2)}`;
            opacityColor.value = `${Ultis.hexToPercent(newColorValue.substring(0, 2))}%`;
            func(newColorValue);
            document.getElementById("popup_table_skin").remove();
          };
        });
    };
    container.replaceChildren(colorContainer, btnSkin);
  
    return container;
  }
  
  function createDataForm() {
    let editNameField = document.createElement("div");
    editNameField.className = "state-container-body-UI col";
    let header = document.createElement("div");
    header.className = "header semibold1 row";
    header.style.justifyContent = "space-between";
    let body = document.createElement("div");
    body.className = "col setting-data-form-container attr-settings-details";
    editNameField.replaceChildren(header, body);
    if (EnumCate.extend_frame.some((cate) => selected_list[0].CateID === cate)) {
      header.innerHTML = "Data form";
      let listForm = selected_list.filter((wbaseItem) => wbaseItem.CateID === EnumCate.form);
      if (listForm.length === 1) {
        const formData = new FormData(listForm[0].value);
        [...listForm[0].value.querySelectorAll('input[type="checkbox"]')].filter((tag) => [...formData.keys()].every((key) => tag.name && tag.name !== key)).forEach((tag) => formData.append(tag.name, tag.checked));
        for (const [key, cntValue] of formData) {
          let elementTags = [...listForm[0].value.querySelectorAll(`input[name="${key}"]`)];
          let eTag = elementTags.find((tag) => tag.value === cntValue);
          switch (eTag.type) {
            case "checkbox":
              var keyValueRow = document.createElement("div");
              keyValueRow.className = "row";
              var keyTitle = document.createElement("div");
              keyTitle.className = "regular1";
              keyTitle.innerHTML = key;
              keyTitle.style.flex = 1;
              let checkboxDropdown = _btnDropDownSelect(
                ["true", "false"],
                function (options) {
                  for (let option of options) {
                    let toggleVl = option.getAttribute("value");
                    option.firstChild.style.opacity = toggleVl === `${eTag.checked}` ? 1 : 0;
                  }
                },
                function (option) {
                  if (`${eTag.checked}` !== option) editFormDataContent(eTag);
                  checkboxDropdown.firstChild.innerHTML = option;
                },
              );
              checkboxDropdown.firstChild.innerHTML = eTag.checked;
              keyValueRow.replaceChildren(keyTitle, checkboxDropdown);
              body.appendChild(keyValueRow);
              break;
            case "radio":
              var keyValueRow = document.createElement("div");
              keyValueRow.className = "row";
              var keyTitle = document.createElement("div");
              keyTitle.className = "regular1";
              keyTitle.innerHTML = key;
              keyTitle.style.flex = 1;
              let radioDropdown = _btnDropDownSelect(
                elementTags.filter((tag) => tag.type === "radio").map((tag) => tag.value),
                function (options) {
                  for (let option of options) {
                    let initVl = option.getAttribute("value");
                    option.firstChild.style.opacity = initVl === radioDropdown.firstChild.innerHTML ? 1 : 0;
                  }
                },
                function (option) {
                  if (radioDropdown.firstChild.innerHTML !== option)
                    editFormDataContent(
                      elementTags.filter((tag) => tag.type === "radio").find((tag) => tag.value === option),
                      listForm[0].value,
                    );
                  radioDropdown.firstChild.innerHTML = option;
                },
              );
              radioDropdown.firstChild.innerHTML = cntValue;
              keyValueRow.replaceChildren(keyTitle, radioDropdown);
              body.appendChild(keyValueRow);
              break;
            default:
              var inputFieldKeyValue = document.createElement("div");
              inputFieldKeyValue.className = "input-edit-field row";
              var labelKeyValue = document.createElement("label");
              labelKeyValue.htmlFor = "form-key-value";
              labelKeyValue.className = "regular1";
              labelKeyValue.innerHTML = key;
              var inputKeyValue = document.createElement("input");
              inputKeyValue.id = "form-key-value";
              inputKeyValue.className = "regular1";
              inputKeyValue.defaultValue = cntValue;
              inputKeyValue.style.marginLeft = "8px";
              inputFieldKeyValue.replaceChildren(labelKeyValue, inputKeyValue);
              inputKeyValue.onblur = function (e) {
                e.stopPropagation();
                eTag.value = this.value;
                editFormDataContent(eTag);
              };
              body.appendChild(inputFieldKeyValue);
              break;
          }
        }
      }
    } else {
      header.innerHTML = "Data form output name";
      let inputNameFieldContainer = document.createElement("div");
      inputNameFieldContainer.className = "input-edit-field row";
      let labelNameField = document.createElement("label");
      labelNameField.htmlFor = "name-field-vl";
      labelNameField.className = "regular1";
      labelNameField.innerHTML = "Name field";
      let inputNameField = document.createElement("input");
      inputNameField.id = "name-field-vl";
      inputNameField.className = "regular1";
      let listNameFieldVl = selected_list.filterAndMap((wbaseItem) => wbaseItem.AttributesItem.NameField);
      inputNameField.defaultValue = listNameFieldVl.length === 1 ? listNameFieldVl[0] : "Mixed";
      inputNameFieldContainer.replaceChildren(labelNameField, inputNameField);
      inputNameField.onblur = function (e) {
        e.stopPropagation();
        if (this.value != (listNameFieldVl.length === 1 ? listNameFieldVl[0] : "Mixed")) editJsonItem({ NameField: this.value });
      };
      body.replaceChildren(inputNameFieldContainer);
    }
    if (selected_list.length > 1 || selected_list[0].CateID === EnumCate.tool_frame) {
      header.innerHTML = "Data form";
      let iconAddForm = document.createElement("i");
      iconAddForm.className = "fa-solid fa-plus";
      iconAddForm.onclick = function (e) {
        e.stopPropagation();
        createForm();
        create_stateContainer();
      };
      header.appendChild(iconAddForm);
    } else if (selected_list.length === 1 && selected_list[0].CateID === EnumCate.form) {
      header.innerHTML = "Data form";
      let iconRemoveForm = document.createElement("i");
      iconRemoveForm.className = "fa-solid fa-minus";
      iconRemoveForm.onclick = function (e) {
        e.stopPropagation();
        removeForm();
        create_stateContainer();
      };
      header.appendChild(iconRemoveForm);
    }
    return editNameField;
  }
  
  function jsonPropertyForm(listRelativeProp = [], dataIndex = 0, parentData) {
    let propList = [];
    let data;
    switch (dataIndex) {
      case 0:
        data = parentData;
        break;
      case 1:
        data = parentData[listRelativeProp[0]];
        break;
      default:
        let ctx = 0;
        data = listRelativeProp.slice(0, dataIndex).reduce((a, b) => {
          ctx++;
          if (ctx === 1) return parentData[a][b];
          else return a[b];
        });
        break;
    }
    if (checkTypeof(data) === "array") {
      listRelativeProp.pop();
      return jsonPropertyForm(listRelativeProp, dataIndex - 1, parentData);
    }
    for (const prop in data) {
      propList.push(tilePropData(prop, listRelativeProp, dataIndex, parentData));
    }
    let treeDataHeader = state_view.querySelector(".attr-settings-details > .content-data-container > div:first-child");
    if (treeDataHeader) {
      if (dataIndex > 0) {
        function getHeader(propNameIndex) {
          if (checkTypeof(listRelativeProp[propNameIndex]) === "number") {
            return getHeader(propNameIndex - 1) + `[${listRelativeProp[propNameIndex]}]`;
          } else {
            return listRelativeProp[propNameIndex];
          }
        }
        let iconBack = document.createElement("i");
        iconBack.className = "fa-solid fa-caret-left";
        treeDataHeader.firstChild.innerHTML = getHeader(dataIndex - 1);
        treeDataHeader.firstChild.appendChild(iconBack);
        iconBack.onclick = function () {
          let fakeDataTreeBody = state_view.querySelector(".attr-settings-details .content-data-container .content-data-body");
          listRelativeProp.pop();
          fakeDataTreeBody.replaceChildren(...jsonPropertyForm(listRelativeProp, dataIndex - 1, parentData));
        };
      } else {
        if (selected_list[0].CateID === EnumCate.chart) {
          treeDataHeader.firstChild.innerHTML = "Chart data";
        } else {
          treeDataHeader.firstChild.innerHTML = "Tree data";
        }
      }
      treeDataHeader.lastChild.onclick = function () {
        setTimeout(function () {
          let offset = treeDataHeader.getBoundingClientRect();
          let currentData = JSON.parse(JSON.stringify(data));
          let fakeDataPopup = popupAddOrEditFakeData(null, data, listRelativeProp, dataIndex, parentData, function () {
            data = currentData;
          });
          fakeDataPopup.style.left = offset.x + "px";
          fakeDataPopup.style.top = offset.y + "px";
          document.getElementById("body").appendChild(fakeDataPopup);
          if (fakeDataPopup.getBoundingClientRect().bottom - document.body.offsetHeight > 12) {
            fakeDataPopup.style.top = `${fakeDataPopup.getBoundingClientRect().top - (fakeDataPopup.getBoundingClientRect().bottom - document.body.offsetHeight) - 12}px`;
          }
        }, 150);
      };
    }
    return propList;
  }
  
  function tilePropData(prop, listRelativeProp = [], dataIndex = 0, parentData) {
    let data;
    switch (dataIndex) {
      case 0:
        data = parentData;
        break;
      case 1:
        data = parentData[listRelativeProp[0]];
        break;
      default:
        let ctx = 0;
        data = listRelativeProp.slice(0, dataIndex).reduce((a, b) => {
          ctx++;
          if (ctx === 1) return parentData[a][b];
          else return a[b];
        });
        break;
    }
    let propTree = document.createElement("div");
    propTree.className = "col";
    let propFormContainer = document.createElement("div");
    propFormContainer.className = "row prop-data-container";
    let prop_title_value = document.createElement("span");
    prop_title_value.className = "regular1";
    let editBtn = document.createElement("i");
    editBtn.className = "fa-solid fa-pen";
    let deleteBtn = document.createElement("i");
    deleteBtn.className = "fa-solid fa-trash";
    let nextToDetails = document.createElement("i");
    nextToDetails.className = "fa-solid fa-chevron-right";
    propTree.replaceChildren(propFormContainer);
    editBtn.onclick = function () {
      setTimeout(function () {
        let offset = propTree.getBoundingClientRect();
        let currentData = JSON.parse(JSON.stringify(data));
        let fakeDataPopup = popupAddOrEditFakeData(prop, data, listRelativeProp, dataIndex, parentData, function () {
          data = currentData;
        });
        fakeDataPopup.style.left = offset.x + "px";
        fakeDataPopup.style.top = offset.y + "px";
        document.getElementById("body").appendChild(fakeDataPopup);
        if (fakeDataPopup.getBoundingClientRect().bottom - document.body.offsetHeight > 12) {
          fakeDataPopup.style.top = `${fakeDataPopup.getBoundingClientRect().top - (fakeDataPopup.getBoundingClientRect().bottom - document.body.offsetHeight) - 12}px`;
        }
      }, 150);
    };
    if (checkTypeof(data) === "object") {
      propFormContainer.setAttribute("level", data.Level);
      propFormContainer.setAttribute("prop", `${prop}`);
      deleteBtn.onclick = function () {
        let checkClearArray = false;
        if (checkTypeof(data[prop]) === "array") {
          let getEvenElement = [];
          for (let i = 0; i < listRelativeProp.length; i++) {
            if (i % 2 === 0) {
              // index is even
              getEvenElement.push(listRelativeProp[i]);
            }
          }
          if (getEvenElement.every((propName) => propName === "ChildrenItem")) {
            checkClearArray = true;
          } else if (selected_list[0].CateID === EnumCate.chart) {
            checkClearArray = true;
          }
        }
        if (checkClearArray) {
          data[prop] = [];
          propTree.replaceChildren(propFormContainer);
          prop_title_value.innerHTML = `${prop}:  []`;
        } else {
          delete data[prop];
          propTree.remove();
        }
        switch (selected_list[0].CateID) {
          case EnumCate.chart:
            createChart(selected_list[0]);
            break;
          case EnumCate.tree:
            createTree(
              selected_list[0],
              wbase_list.filter((e) => e.ParentID === selected_list[0].GID),
            );
            break;
          default:
            break;
        }
        WBaseDA.edit(selected_list, EnumObj.attribute);
      };
      switch (checkTypeof(data[prop])) {
        case "string":
          prop_title_value.innerHTML = `${prop}:  "${data[prop]}"`;
          break;
        case "array":
          editBtn.className = "fa-solid fa-plus";
          editBtn.onclick = function () {
            let getEvenElement = [];
            for (let i = 0; i < listRelativeProp.length; i++) {
              if (i % 2 === 0) {
                // index is even
                getEvenElement.push(listRelativeProp[i]);
              }
            }
            if ((getEvenElement.length === 0 && prop === "ChildrenItem") || (getEvenElement.length > 0 && getEvenElement.some((propName) => propName === "ChildrenItem"))) {
              let newTreeItemObj;
              if (data[prop].length > 0) {
                newTreeItemObj = JSON.parse(JSON.stringify(data[prop][0]));
              } else {
                newTreeItemObj = JSON.parse(JSON.stringify(data));
              }
              newTreeItemObj.ID = Math.max(...[...selected_list[0].value.querySelectorAll(".w-tree")].map((wTree) => parseInt(wTree.id.replace("treeID:", "")))) + 1;
              newTreeItemObj.ChildrenItem = [];
              newTreeItemObj.Level = data.Level + 1;
              newTreeItemObj.ParentID = data.ID;
              data[prop].push(newTreeItemObj);
              let fakeDataTreeBody = state_view.querySelector(".attr-settings-details .content-data-container .content-data-body");
              fakeDataTreeBody.replaceChildren(...jsonPropertyForm(listRelativeProp, dataIndex, parentData));
              createTree(
                selected_list[0],
                wbase_list.filter((wbaseItem) => wbaseItem.ParentID === selected_list[0].GID),
              );
              WBaseDA.edit(selected_list, EnumObj.attribute);
            } else {
              let offset = propTree.getBoundingClientRect();
              switch (selected_list[0].CateID) {
                case EnumCate.chart:
                  if (["data", "borderWidth"].some((chartProp) => prop === chartProp)) {
                    data[prop].push(1);
                  } else if (prop === "datasets") {
                    let newDataSet;
                    if (data[prop][data[prop].length - 1]) {
                      newDataSet = JSON.parse(JSON.stringify(data[prop][data[prop].length - 1]));
                      newDataSet.label = "new dataset";
                      newDataSet.data = data.labels.map((label) => data.labels.indexOf(label) + 1);
                    } else {
                      newDataSet = {
                        label: "new dataset",
                        data: data.labels.map((label) => data.labels.indexOf(label) + 1),
                        backgroundColor: ["#36a2ebff", "#ff6384ff", "#ffcd56ff"],
                      };
                    }
                    data[prop].push(newDataSet);
                    createChart(selected_list[0]);
                    WBaseDA.edit(selected_list, EnumObj.attribute);
                    return;
                  } else {
                    data[prop].push("");
                  }
                  break;
                case EnumCate.tree:
                  switch (checkTypeof(data[prop][0])) {
                    case WDataType.number:
                      data[prop].push(1);
                      break;
                    case WDataType.string:
                      data[prop].push("");
                      break;
                    case WDataType.boolean:
                      data[prop].push(true);
                      break;
                    case WDataType.array:
                      data[prop].push([]);
                      break;
                    case WDataType.object:
                      data[prop].push({});
                      break;
                    default:
                      data[prop].push(null);
                      break;
                  }
                  break;
                default:
                  break;
              }
              setTimeout(function () {
                let fakeDataPopup = popupAddOrEditFakeData(data[prop].length - 1, data[prop], listRelativeProp, dataIndex, parentData, function () {
                  data[prop].pop();
                });
                fakeDataPopup.style.left = offset.x + "px";
                fakeDataPopup.style.top = offset.y + "px";
                document.getElementById("body").appendChild(fakeDataPopup);
                if (fakeDataPopup.getBoundingClientRect().bottom - document.body.offsetHeight > 12) {
                  fakeDataPopup.style.top = `${fakeDataPopup.getBoundingClientRect().top - (fakeDataPopup.getBoundingClientRect().bottom - document.body.offsetHeight) - 12}px`;
                }
                if (data[prop][0] === null) {
                  let inputDataType = fakeDataPopup.querySelector(`.body-data-tree > .single-prop-tile input[name="data-type"]`);
                  inputDataType.disabled = false;
                  $(".prop-input-container").css("pointer-events", "auto");
                }
              }, 150);
            }
          };
          if (data[prop].length > 0) {
            prop_title_value.innerHTML = `${prop}:`;
            let shortenBtn = document.createElement("i");
            shortenBtn.className = "fa-solid fa-caret-down";
            let isShorten = false;
            shortenBtn.onclick = function () {
              isShorten = !isShorten;
              if (isShorten) {
                shortenBtn.className = "fa-solid fa-caret-right";
                propTree.childNodes.forEach((propChild) => (propChild.style.display = "none"));
                propFormContainer.style.display = "flex";
              } else {
                shortenBtn.className = "fa-solid fa-caret-down";
                propTree.childNodes.forEach((propChild) => (propChild.style.display = "flex"));
              }
            };
            prop_title_value.style.display = "flex";
            prop_title_value.style.alignItems = "center";
            prop_title_value.appendChild(shortenBtn);
            let relativeList = [...listRelativeProp, prop];
            propTree.replaceChildren(propFormContainer, ...data[prop].map((e) => tilePropData(data[prop].indexOf(e), relativeList, dataIndex + 1, parentData)));
          } else {
            prop_title_value.innerHTML = `${prop}:  []`;
          }
          break;
        case "object":
          prop_title_value.innerHTML = `${prop}:  {...}`;
          nextToDetails.style.display = "flex";
          editBtn.style.display = "none";
          nextToDetails.onclick = function () {
            let fakeDataTreeBody = state_view.querySelector(".attr-settings-details .content-data-container .content-data-body");
            let relativeList = [...listRelativeProp, prop];
            fakeDataTreeBody.replaceChildren(...jsonPropertyForm(relativeList, dataIndex + 1, parentData));
          };
          break;
        case "number":
          prop_title_value.innerHTML = `${prop}:  ${data[prop]}`;
          break;
        default:
          prop_title_value.innerHTML = `${prop}:  ${data[prop]}`;
          break;
      }
      let listUnableEdit = ["ID", "Level", "ParentID"];
      if (listUnableEdit.some((propType) => `${prop}` === propType)) {
        editBtn.style.display = "none";
        deleteBtn.style.display = "none";
      }
    } else {
      // "array"
      deleteBtn.onclick = function () {
        data.splice(prop, 1);
        let fakeDataTreeBody = state_view.querySelector(".attr-settings-details .content-data-container .content-data-body");
        fakeDataTreeBody.replaceChildren(...jsonPropertyForm(listRelativeProp, dataIndex, parentData));
        if (selected_list[0].CateID === EnumCate.tree)
          createTree(
            selected_list[0],
            wbase_list.filter((e) => e.ParentID === selected_list[0].GID),
          );
        WBaseDA.edit(selected_list, EnumObj.attribute);
      };
      prop_title_value.setAttribute("array-number", "true");
      function getSpacing(propNameIndex) {
        if (checkTypeof(listRelativeProp[propNameIndex]) === "number") {
          return getSpacing(propNameIndex - 1) + 1;
        } else {
          return 1;
        }
      }
      prop_title_value.style.paddingLeft = `${getSpacing(dataIndex) * 20}px`;
      switch (checkTypeof(data[prop])) {
        case "string":
          prop_title_value.innerHTML = `${prop}:  "${data[prop]}"`;
          break;
        case "array":
          editBtn.className = "fa-solid fa-plus";
          editBtn.onclick = function () {
            let offset = propTree.getBoundingClientRect();
            switch (checkTypeof(data[prop][0])) {
              case WDataType.number:
                data[prop].push(1);
                break;
              case WDataType.string:
                data[prop].push("");
                break;
              case WDataType.boolean:
                data[prop].push(true);
                break;
              case WDataType.array:
                data[prop].push([]);
                break;
              case WDataType.object:
                data[prop].push({});
                break;
              default:
                data[prop].push(null);
                break;
            }
            setTimeout(function () {
              let fakeDataPopup = popupAddOrEditFakeData(data.length - 1, data, listRelativeProp, dataIndex, parentData, function () {
                data[prop].pop();
              });
              fakeDataPopup.style.left = offset.x + "px";
              fakeDataPopup.style.top = offset.y + "px";
              document.getElementById("body").appendChild(fakeDataPopup);
              if (fakeDataPopup.getBoundingClientRect().bottom - document.body.offsetHeight > 12) {
                fakeDataPopup.style.top = `${fakeDataPopup.getBoundingClientRect().top - (fakeDataPopup.getBoundingClientRect().bottom - document.body.offsetHeight) - 12}px`;
              }
            }, 150);
          };
          if (data[prop].length > 0) {
            prop_title_value.innerHTML = `${prop}:`;
            let shortenBtn = document.createElement("i");
            shortenBtn.className = "fa-solid fa-caret-down";
            let isShorten = false;
            shortenBtn.onclick = function () {
              isShorten = !isShorten;
              if (isShorten) {
                shortenBtn.className = "fa-solid fa-caret-right";
                propTree.childNodes.forEach((propChild) => (propChild.style.display = "none"));
                propFormContainer.style.display = "flex";
              } else {
                shortenBtn.className = "fa-solid fa-caret-down";
                propTree.childNodes.forEach((propChild) => (propChild.style.display = "flex"));
              }
            };
            prop_title_value.style.display = "flex";
            prop_title_value.style.alignItems = "center";
            prop_title_value.appendChild(shortenBtn);
            let relativeList = [...listRelativeProp, prop];
            propTree.replaceChildren(propFormContainer, ...data[prop].map((e) => tilePropData(data[prop].indexOf(e), relativeList, dataIndex + 1, parentData)));
          } else {
            prop_title_value.innerHTML = `${prop}:  []`;
          }
          break;
        case "object":
          prop_title_value.innerHTML = `${prop}:  {...}`;
          nextToDetails.style.display = "flex";
          editBtn.style.display = "none";
          nextToDetails.onclick = function () {
            let fakeDataTreeBody = state_view.querySelector(".attr-settings-details .content-data-container .content-data-body");
            let relativeList = [...listRelativeProp, prop];
            fakeDataTreeBody.replaceChildren(...jsonPropertyForm(relativeList, dataIndex + 1, parentData));
          };
          break;
        case "number":
          prop_title_value.innerHTML = `${prop}:  ${data[prop]}`;
          break;
        default:
          prop_title_value.innerHTML = `${prop}:  ${data[prop]}`;
          break;
      }
    }
    propFormContainer.replaceChildren(prop_title_value, editBtn, deleteBtn, nextToDetails);
    return propTree;
  }
  
  function popupAddOrEditFakeData(prop, data, listRelative, dataIndex, parentData, handleClose) {
    let popupProp = document.createElement("div");
    popupProp.className = "wini_popup popup_remove col fake-data-popup";
    popupProp.onclick = function (e) {
      e.stopPropagation();
      popupProp.querySelectorAll(".dropdow-popup-list-value").forEach((drdPopup) => (drdPopup.style.display = "none"));
    };
    let footer = document.createElement("div");
    footer.className = "row data-submit-footer";
    let cancelBtn = document.createElement("div");
    cancelBtn.className = "row cancel-prop-data regular1";
    cancelBtn.innerHTML = "Cancel";
    cancelBtn.onclick = function (e) {
      e.stopPropagation();
      popupProp.remove();
    };
    let submitBtn = document.createElement("div");
    submitBtn.className = "row submit-prop-data regular1";
    submitBtn.innerHTML = "Submit";
    submitBtn.onclick = function (e) {
      e.stopPropagation();
      let inputFieldTrigger = popupProp.querySelector(`:scope > .body-data-tree > .single-prop-tile input[name="data-name-field"]`);
      $(inputFieldTrigger).blur();
      let errorInput = popupProp.querySelector(".helper-text");
      if (errorInput) {
        let fakeDataPopupBody = document.getElementById("body").querySelector(".fake-data-popup").firstChild;
        fakeDataPopupBody.scrollTo({
          top: errorInput.offsetTop,
          behavior: "smooth",
        });
      } else {
        let fakeDataTreeBody = state_view.querySelector(".attr-settings-details .content-data-container .content-data-body");
        fakeDataTreeBody.replaceChildren(...jsonPropertyForm(listRelative, dataIndex, parentData ?? data));
        if (prop != null) {
          switch (selected_list[0].CateID) {
            case EnumCate.tree:
              createTree(
                selected_list[0],
                wbase_list.filter((wbaseItem) => wbaseItem.ParentID === selected_list[0].GID),
              );
              break;
            case EnumCate.chart:
              createChart(selected_list[0]);
              break;
            default:
              break;
          }
        }
        WBaseDA.edit(selected_list, EnumObj.attribute);
        popupProp.setAttribute("isSubmit", "true");
        popupProp.remove();
      }
    };
    let space = document.createElement("div");
    space.style.flex = 1;
    space.style.width = "100%";
    if (prop) {
      let iconDelete = document.createElement("i");
      iconDelete.className = "fa-solid fa-trash";
      footer.replaceChildren(iconDelete, space, cancelBtn, submitBtn);
    } else {
      footer.replaceChildren(space, cancelBtn, submitBtn);
    }
    popupProp.replaceChildren(propInforTile(prop, data), footer);
    handlePopupDispose(popupProp, function () {
      if (popupProp.getAttribute("isSubmit") !== "true") handleClose();
    });
    return popupProp;
  }
  
  let stringInputFiled;
  function propInforTile(prop, data = {}, spacingLine = 0) {
    let listCurrentProp = [];
    for (const crtProp in data) {
      listCurrentProp.push(crtProp);
    }
    let thisDataType = WDataType.string;
    if (prop != null) {
      thisDataType = checkTypeof(data[prop]);
    }
    let spaceLineDiv = document.createElement("div");
    spaceLineDiv.style.width = spacingLine + "px";
    let popupPropBody = document.createElement("div");
    popupPropBody.className = "body-data-tree col";
    let singlePropTile = document.createElement("div");
    singlePropTile.className = "row single-prop-tile";
    let fieldContainer = document.createElement("div");
    fieldContainer.className = "col prop-input-container";
    let iconEqual = document.createElement("i");
    iconEqual.className = "fa-solid fa-equals";
    //
    let typeContainer = document.createElement("div");
    typeContainer.className = "col prop-input-container";
    let labelType = document.createElement("label");
    labelType.innerHTML = "Type";
    let dropdown = document.createElement("div");
    dropdown.className = "dropdown-select-data-type";
    let inputType = document.createElement("input");
    inputType.name = "data-type";
    inputType.readOnly = true;
    if (spacingLine === 0 && prop != undefined) {
      inputType.disabled = true;
      typeContainer.style.pointerEvents = "none";
    }
    inputType.defaultValue = thisDataType;
    let iconDown = document.createElement("i");
    iconDown.className = "fa-solid fa-caret-down";
    let dropdownList = document.createElement("div");
    dropdownList.className = "col dropdow-popup-list-value";
    dropdownList.replaceChildren(
      ...WDataType.list.map((wDtType) => {
        let option = document.createElement("div");
        option.className = "regular1";
        option.innerHTML = wDtType;
        option.onclick = function (e) {
          e.stopPropagation();
          dropdownList.style.display = "none";
          thisDataType = wDtType;
          inputType.value = thisDataType;
          if (!inputType.disabled) {
            let propBodyParent = $(popupPropBody).parent(".body-data-tree");
            if (propBodyParent?.length > 0) {
              propBodyParent[0].querySelectorAll(":scope > .body-data-tree").forEach((propTreeChild) => {
                let optTrigger = [...propTreeChild.querySelector(`.prop-input-container .dropdow-popup-list-value`).childNodes].find((opt) => opt.innerHTML === thisDataType);
                if (option !== optTrigger) {
                  $(optTrigger).click();
                }
              });
            }
          }
          renderByDataType();
        };
        return option;
      }),
    );
    dropdown.onclick = function (e) {
      e.stopPropagation();
      dropdownList.style.display = "flex";
    };
    dropdown.replaceChildren(inputType, iconDown, dropdownList);
    typeContainer.replaceChildren(labelType, dropdown);
    //
    let valueContainer = document.createElement("div");
    valueContainer.className = "col prop-input-container";
    let labelValue = document.createElement("label");
    labelValue.innerHTML = "Value";
    let inputValue = document.createElement("input");
    valueContainer.replaceChildren(labelValue, inputValue);
    //
    let minusPropTile = document.createElement("i");
    minusPropTile.className = "fa-solid fa-circle-minus";
    //
    let inputField = document.createElement("input");
    inputField.name = "data-name-field";
    if (prop != undefined) {
      inputField.disabled = true;
      inputField.defaultValue = prop;
    }
    if (checkTypeof(prop) === WDataType.number) {
      $(fieldContainer).addClass("prop-index-field");
      if (prop > 0) {
        typeContainer.style.pointerEvents = "none";
        inputType.disabled = true;
      }
      fieldContainer.replaceChildren(inputField);
    } else {
      let labelField = document.createElement("label");
      labelField.innerHTML = "Field";
      fieldContainer.replaceChildren(labelField, inputField);
    }
    inputField.onblur = function (e) {
      e.stopPropagation();
      this.value = this.value.trim();
      if (this.value.length === 0) {
        $(fieldContainer).addClass("helper-text");
        $(fieldContainer).attr("helper-text", "Required !");
      } else {
        switch (thisDataType) {
          case WDataType.number:
            if (inputValue.value.trim().length === 0) {
              $(valueContainer).addClass("helper-text");
              $(valueContainer).attr("helper-text", "Required !");
            } else if (isNaN(parseFloat(inputValue.value))) {
              $(valueContainer).addClass("helper-text");
              $(valueContainer).attr("helper-text", "Must be a number !");
            } else if (checkTypeof(prop) === WDataType.number) {
              data[parseInt(prop)] = parseFloat(inputValue.value);
            } else {
              data[this.value] = parseFloat(inputValue.value);
            }
            break;
          case WDataType.boolean:
            if (checkTypeof(prop) === WDataType.number) {
              data[parseInt(prop)] = inputValue.value === "true";
            } else {
              data[this.value] = inputValue.value === "true";
            }
            break;
          case WDataType.string:
            if (checkTypeof(prop) === WDataType.number) {
              data[parseInt(prop)] = inputValue.value ?? "";
            } else {
              data[this.value] = inputValue.value ?? "";
            }
            break;
          case WDataType.null:
            break;
          case WDataType.undefined:
            break;
          default:
            $(fieldContainer).removeClass("helper-text");
            popupPropBody.querySelectorAll(":scope > .body-data-tree").forEach((treeBodyChild) => {
              treeBodyChild.querySelectorAll(":scope > .single-prop-tile").forEach((singleProp) => {
                let inputFieldTrigger = singleProp.querySelector(`input[name="data-name-field"]`);
                if (inputFieldTrigger !== inputField) $(inputFieldTrigger).blur();
              });
            });
            let errorInput = popupPropBody.querySelector(".helper-text");
            if (errorInput) {
              let fakeDataPopupBody = document.getElementById("body").querySelector(".fake-data-popup").firstChild;
              fakeDataPopupBody.scrollTo({
                top: errorInput.offsetTop,
                behavior: "smooth",
              });
            } else {
              if (checkTypeof(prop) === WDataType.number) {
                data[parseInt(prop)] = newData;
              } else {
                if (listCurrentProp.some((crtProp) => crtProp === this.value)) {
                  $(fieldContainer).addClass("helper-text");
                  $(fieldContainer).attr("helper-text", "This property already exist !");
                } else {
                  data[this.value] = newData;
                }
              }
            }
            break;
        }
      }
    };
    let newData;
    function renderByDataType() {
      newData = null;
      popupPropBody.replaceChildren(singlePropTile);
      $(fieldContainer).removeClass("helper-text");
      $(valueContainer).removeClass("helper-text");
      if (prop) {
        inputValue.value = data[prop];
      } else {
        inputValue.value = "";
      }
      switch (thisDataType) {
        case WDataType.object:
          singlePropTile.replaceChildren(spaceLineDiv, fieldContainer, iconEqual, typeContainer, minusPropTile);
          newData = {};
          let prop0 = propInforTile(null, newData, spacingLine + 20);
          popupPropBody.appendChild(prop0);
          let addPropLine = document.createElement("div");
          addPropLine.className = "row single-prop-tile";
          var addCircleIcon = document.createElement("i");
          addCircleIcon.className = "fa-solid fa-circle-plus";
          var addCircleSpaceLine = spaceLineDiv.cloneNode(true);
          addCircleSpaceLine.style.width = spacingLine + 20 + "px";
          addPropLine.replaceChildren(addCircleSpaceLine, addCircleIcon);
          popupPropBody.appendChild(addPropLine);
          addCircleIcon.onclick = function () {
            let nextProp = propInforTile(null, newData, spacingLine + 20);
            popupPropBody.appendChild(nextProp);
            addPropLine.style.order = popupPropBody.childElementCount;
          };
          break;
        case WDataType.array:
          singlePropTile.replaceChildren(spaceLineDiv, fieldContainer, iconEqual, typeContainer, minusPropTile);
          newData = [""];
          let element0 = propInforTile(0, newData, spacingLine + 20);
          popupPropBody.appendChild(element0);
          let addElementLine = document.createElement("div");
          addElementLine.className = "row single-prop-tile";
          var addCircleIcon = document.createElement("i");
          addCircleIcon.className = "fa-solid fa-circle-plus";
          var addCircleSpaceLine = spaceLineDiv.cloneNode(true);
          addCircleSpaceLine.style.width = spacingLine + 20 + "px";
          addElementLine.replaceChildren(addCircleSpaceLine, addCircleIcon);
          popupPropBody.appendChild(addElementLine);
          addCircleIcon.onclick = function () {
            switch (checkTypeof(newData[0])) {
              case WDataType.boolean:
                newData.push(false);
                break;
              case WDataType.string:
                newData.push("");
                break;
              case WDataType.number:
                newData.push(1);
                break;
              case WDataType.object:
                newData.push({});
                break;
              case WDataType.array:
                newData.push([]);
                break;
              default:
                break;
            }
            let nextElement = propInforTile(newData.length - 1, newData, spacingLine + 20);
            popupPropBody.appendChild(nextElement);
            addElementLine.style.order = popupPropBody.childElementCount;
          };
          break;
        case WDataType.boolean:
          let dropdown = document.createElement("div");
          dropdown.className = "dropdown-select-data-type";
          let iconDown = document.createElement("i");
          iconDown.className = "fa-solid fa-caret-down";
          let dropdownBoolV = document.createElement("div");
          dropdownBoolV.className = "col dropdow-popup-list-value";
          dropdownBoolV.replaceChildren(
            ...[true, false].map((boolValue) => {
              let option = document.createElement("div");
              option.className = "regular1";
              option.innerHTML = `${boolValue}`;
              option.onclick = function (e) {
                e.stopPropagation();
                dropdownBoolV.style.display = "none";
                inputValue.value = `${boolValue}`;
              };
              return option;
            }),
          );
          dropdown.onclick = function (e) {
            e.stopPropagation();
            dropdownBoolV.style.display = "flex";
          };
          inputValue.readOnly = true;
          dropdown.replaceChildren(inputValue, iconDown, dropdownBoolV);
          valueContainer.replaceChildren(labelValue, dropdown);
          singlePropTile.replaceChildren(spaceLineDiv, fieldContainer, iconEqual, typeContainer, valueContainer, minusPropTile);
          break;
        default:
          if (thisDataType === "string") {
            let iconDoc = document.createElement("i");
            iconDoc.className = "fa-regular fa-file-image row";
            valueContainer.appendChild(iconDoc);
            iconDoc.onclick = function (e) {
              stringInputFiled = inputValue;
              e.stopPropagation();
              if (document.getElementById("popup_img_document") == undefined) {
                FileDA.init();
              }
              inputValue.focus();
            };
          }
          inputValue.readOnly = false;
          singlePropTile.replaceChildren(spaceLineDiv, fieldContainer, iconEqual, typeContainer, valueContainer, minusPropTile);
          break;
      }
    }
    renderByDataType();
    popupPropBody.onclick = function (e) {
      e.stopPropagation();
      stringInputFiled = null;
    };
    return popupPropBody;
  }
  