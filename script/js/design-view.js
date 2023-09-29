function setupRightView() {
  // setup tab change
  // create elements in design view
  right_view.onkeydown = function (e) {
    if (e.key === "Enter" && document.activeElement.localName === "input") {
      document.activeElement.blur();
    }
  };
  updateUIDesignView();
}

$("body").on("click", ".tab_right", function () {
  if (design_view_index != $(this).data("index")) {
    design_view_index = $(this).data("index");
    tabChange(this.innerHTML, "right_tab_view");
    wdraw();
    let list_tab_view = document.getElementsByClassName("tab_right");
    for (let i = 0; i < list_tab_view.length; i++) {
      list_tab_view[i].style.opacity = 0.7;
    }
    this.style.opacity = 1;
    switch (design_view_index) {
      case 0:
        updateUIDesignView();
        break;
      case 1:
        update_UI_prototypeView();
        break;
      case 2:
        create_stateContainer();
        break;
      default:
        break;
    }
  }
});

// update UI design view when selected change
function updateUIDesignView() {
  let scrollY = design_view.scrollTop;
  let listEditContainer = document.createDocumentFragment();
  if (selected_list.length == 0) {
    let editCanvasBground = createCanvasBackground();
    listEditContainer.appendChild(editCanvasBground);
    let winiRes = winiResponsive();
    listEditContainer.appendChild(winiRes);
    let breakpoint = createBreakpoint();
    listEditContainer.appendChild(breakpoint);
    let localSkins = createSelectionSkins();
    listEditContainer.appendChild(localSkins);
  } else {
    let editAlign = createEditAlign();
    let editSizePosition = createEditSizePosition();
    // // let selectClass = selectionClass();
    listEditContainer.appendChild(editAlign);
    listEditContainer.appendChild(editSizePosition);
    // if (selected_list.length === 1 && selected_list[0].IsWini && selected_list[0].CateID !== EnumCate.variant) {
    //   let editVariables = createVariables();
    //   listEditContainer.appendChild(editVariables);
    // }
    // // listEditContainer.appendChild(selectClass);
    if (select_box_parentID != wbase_parentID && selected_list.some((e) => window.getComputedStyle(e.value).position === "absolute")) {
      let editConstraints = createConstraints();
      listEditContainer.appendChild(editConstraints);
    }
    // if (select_box_parentID != wbase_parentID && selected_list.every((e) => window.getComputedStyle(e.value).position !== "absolute")) {
    //   let pageParent = $(selected_list[0].value).parents(".wbaseItem-value");
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
    if (selected_list.some(wb => [EnumCate.table,...EnumCate.no_child_component].every(ct => wb.CateID !== ct))) {
      let editAutoLayout = createAutoLayout();
      listEditContainer.appendChild(editAutoLayout);
    }
    // //
    // if (selected_list.length > 0 && selected_list.every((wb) => wb.StyleItem.DecorationItem && wb.StyleItem.DecorationItem.ColorValue == selected_list[0].StyleItem.DecorationItem.ColorValue)) {
    //   let editBackground = createEditBackground();
    //   listEditContainer.appendChild(editBackground);
    // }
    // if (selected_list.some((e) => e.StyleItem.TextStyleItem)) {
    //   let editTextStyle = createEditTextStyle();
    //   listEditContainer.appendChild(editTextStyle);
    // }
    // if (selected_list.some((e) => e.StyleItem.DecorationItem)) {
    //   if (selected_list.length > 1 || selected_list[0].CateID !== EnumCate.w_switch) {
    //     let editBorder = createEditBorder();
    //     listEditContainer.appendChild(editBorder);
    //   }
    //   let editEffect = createEditEffect();
    //   listEditContainer.appendChild(editEffect);
    // }
    // let editVariants = createEditVariants();
    // listEditContainer.appendChild(editVariants);
  }
  design_view.replaceChildren(listEditContainer);
  design_view.scrollTo({
    top: scrollY,
    behavior: "smooth",
  });
}

//
// edit canvas background color
function createCanvasBackground() {
  var canvas_view_background = document.createElement("div");
  canvas_view_background.id = "canvas_view_background";
  canvas_view_background.className = "col";
  canvas_view_background.style.width = "100%";
  canvas_view_background.style.borderBottom = "1px solid #e5e5e5";
  var title = document.createElement("p");
  canvas_view_background.appendChild(title);
  title.innerHTML = "Background";
  title.style.margin = "16px 16px 4px 16px";
  title.style.fontSize = "12px";
  title.style.lineHeight = "16px";
  title.style.fontWeight = "600";
  var change_color = document.createElement("div");
  change_color.className = "row";
  change_color.style.height = "32px";
  change_color.style.width = "148px";
  change_color.style.margin = "6px 12px";
  change_color.style.padding = "0 4px";
  change_color.style.border = "1.5px solid transparent";
  change_color.style.overflow = "hidden";
  change_color.style.borderRadius = "2px";
  var btn_select_color = document.createElement("div");
  change_color.appendChild(btn_select_color);
  btn_select_color.style.width = "16px";
  btn_select_color.style.height = "16px";
  btn_select_color.style.backgroundColor = "#e5e5e5";
  btn_select_color.style.borderRadius = "2px";
  btn_select_color.style.marginRight = "8px";
  var input_color = document.createElement("input");
  change_color.appendChild(input_color);
  input_color.value = "E5E5E5";
  input_color.style.height = "100%";
  input_color.style.minWidth = "0";
  input_color.style.fontSize = "12px";
  input_color.style.lineHeight = "16px";
  input_color.style.color = "#595959";
  input_color.style.flex = 1;
  input_color.style.boxSizing = "border-box";
  input_color.style.padding = "4px";
  input_color.style.border = "none";
  input_color.style.borderRight = "1.5px solid transparent";
  input_color.onfocus = function () {
    this.style.outline = "none";
    this.style.borderRightColor = "#F3F3F3";
    this.parentElement.style.borderColor = "#1890FF";
    this.setSelectionRange(0, this.value.length);
  };
  input_color.onblur = function () {
    this.style.borderRightColor = "transparent";
    this.parentElement.style.borderColor = "transparent";
  };
  var input_opacity = document.createElement("input");
  change_color.appendChild(input_opacity);
  input_opacity.value = "100%";
  input_opacity.style.height = "100%";
  input_opacity.style.width = "40px";
  input_opacity.style.minWidth = "0";
  input_opacity.style.fontSize = "12px";
  input_opacity.style.lineHeight = "16px";
  input_opacity.style.color = "#595959";
  input_opacity.style.boxSizing = "border-box";
  input_opacity.style.padding = "4px";
  input_opacity.style.border = "none";
  input_opacity.onfocus = function () {
    this.style.outline = "none";
    this.parentElement.style.borderColor = "#1890FF";
    this.setSelectionRange(0, this.value.length);
  };
  input_opacity.onblur = function () {
    this.parentElement.style.borderColor = "transparent";
  };
  change_color.onmouseover = function () {
    if (this.lastChild != document.activeElement) {
      this.style.borderColor = "#F3F3F3";
      this.childNodes[1].style.borderRightColor = "#F3F3F3";
    }
  };
  change_color.onmouseout = function () {
    if (this.lastChild != document.activeElement) {
      this.style.borderColor = "transparent";
      this.childNodes[1].style.borderRightColor = "transparent";
    }
  };
  canvas_view_background.appendChild(change_color);
  return canvas_view_background;
}

// edit align UI
function createEditAlign() {
  let editAlignContainer = document.createElement("div");
  editAlignContainer.id = "edit_align_div";
  let isEnable = !selected_list[0].value.closest(`.wbaseItem-value[isinstance="true"]`) && selected_list.every((wb) => (window.getComputedStyle(wb.value).position === "absolute" && (selected_list.length > 1 || wb.Level > 1)) || [...wb.value.querySelectorAll(`.wbaseItem-value[level="${wb.Level + 1}"]`)].some((childWb) => window.getComputedStyle(childWb).position === "absolute"));
  if (isEnable) {
    isEnable = !selected_list.some(wb => wb.IsInstance && (window.getComputedStyle(wb.value).position !== "absolute" || wb.Level === 1));
  }
  editAlignContainer.setAttribute("enable", isEnable);
  editAlignContainer.replaceChildren(
    ...["align left", "align horizontal center", "align right", "align top", "align vertical center", "align bottom"].map((alignType) => {
      let btnAlign = document.createElement("img");
      btnAlign.className = "img-button size-32";
      if (isEnable)
        btnAlign.onclick = function () {
          alignPosition(alignType);
          updateUIEditPosition();
          updateUIConstraints();
        };
      return btnAlign;
    }),
  );
  return editAlignContainer;
}

function updateUIEditAlign() {
  let newEditAlign = createEditAlign();
  document.getElementById("edit_align_div").replaceWith(newEditAlign);
}

// edit position UI
function createEditSizePosition() {
  let edit_size_position_div = document.createElement("div");
  edit_size_position_div.id = "edit_size_position_div";
  edit_size_position_div.className = "edit-container";
  if (select_box_parentID === wbase_parentID && selected_list.every((e) => !e.IsInstance && EnumCate.extend_frame.some((ct) => e.CateID === ct))) {
    let pageDeviceContainer = document.createElement("div");
    pageDeviceContainer.className = "page-device-container row";
    let btn_select_frame_size = document.createElement("button");
    pageDeviceContainer.appendChild(btn_select_frame_size);
    btn_select_frame_size.onclick = function (e) {
      e.stopPropagation();
      let popup = document.createElement("div");
      popup.className = "popup_select_device col wini_popup popup_remove";
      for (let i = 0; i < listDevice.length; i++) {
        let col = document.createElement("nav");
        col.className = "col";
        if (i + 1 != listDevice.length) col.style.borderBottom = "0.5px solid #e5e5e5";
        for (let device of listDevice[i]) {
          let option = document.createElement("div");
          option.className = "w-device-option-tile"
          option.onclick = function (ev) {
            ev.stopPropagation();
            inputFrameItem({ Width: device.Width, Height: device.Height });
            popup.remove();
            updateUIEditPosition();
          };
          option.innerHTML = `<i class="fa-solid fa-check" style="visibility: ${btn_title.innerHTML === device.Name ? "visible" : "hidden"}"></i><span>${device.Name}</span><span>${device.Width}x${device.Height}</span>`;
          col.appendChild(option);
        }
        popup.appendChild(col);
      }
      document.getElementById("body").appendChild(popup);
      if (popup.getBoundingClientRect().bottom > document.body.getBoundingClientRect().bottom) {
        popup.style.height = `${document.body.getBoundingClientRect().bottom - popup.getBoundingClientRect().y}px`;
      }
    };
    let listSize = selected_list.filter((e) => EnumCate.extend_frame.some((cate) => e.CateID == cate)).filterAndMap((e) => `${parseInt(e.StyleItem.FrameItem.Width)}x${parseInt(e.StyleItem.FrameItem.Height)}`);
    btn_select_frame_size.innerHTML = `<p class="semibold1">${listSize.length === 1 ? listDevice.reduce((a, b) => a.concat(b)).find((device) => `${device.Width}x${device.Height}` === listSize[0])?.Name ?? "Device size" : "Device size"}</p><i class="fa-solid fa-chevron-down fa-2xs"></i>`
    edit_size_position_div.appendChild(pageDeviceContainer);
  }

  //
  let editXYContainer = document.createElement("div");
  editXYContainer.className = "row";
  // input edit left position
  let list_offsetX = selected_list.filterAndMap((wbaseItem) => `${getWBaseOffset(wbaseItem).x}`.replace(".00", ""));
  let edit_left = _textField("82px", undefined, "X", list_offsetX.length == 1 ? list_offsetX[0] : "mixed");
  edit_left.id = "edit_position_item_left";
  edit_left.lastChild.onblur = function () {
    let newValue = parseFloat(this.value);
    if (!isNaN(newValue)) {
      inputPositionItem({ Left: newValue });
    }
    updateInputTLWH();
  };
  // input edit right position
  let list_offsetY = selected_list.filterAndMap((wbaseItem) => `${getWBaseOffset(wbaseItem).y}`.replace(".00", ""));
  let edit_top = _textField("82px", undefined, "Y", list_offsetY.length == 1 ? list_offsetY[0] : "mixed");
  edit_top.id = "edit_position_item_top";
  edit_top.lastChild.onblur = function () {
    let newValue = parseFloat(this.value);
    if (!isNaN(newValue)) {
      inputPositionItem({ Top: newValue });
    }
    updateInputTLWH();
  };
  editXYContainer.replaceChildren(edit_left, edit_top);
  let parentHTML = document.getElementById(select_box_parentID);
  if (EnumCate.extend_frame.some((ct) => parentHTML?.getAttribute("cateid") == ct) && window.getComputedStyle(parentHTML).display.match("flex")) {
    let isFixPos = selected_list.every((e) => e.value.classList.contains("fixed-position"));
    let iconFixPos = document.createElement("img");
    iconFixPos.className = "img-button size-28 tlwh-option" + (isFixPos ? " toggle" : "");
    iconFixPos.src = "https://cdn.jsdelivr.net/gh/WiniGit/goline@785f3a1/lib/assets/fix_position.svg";
    edit_top.lastChild.disabled = !isFixPos;
    edit_left.lastChild.disabled = !isFixPos;
    iconFixPos.onclick = function () {
      isFixPos = !isFixPos;
      inputPositionItem({ FixPosition: isFixPos });
      if (isFixPos)
        this.classList.add("toggle");
      else
        this.classList.remove("toggle");
      edit_top.lastChild.disabled = !isFixPos;
      edit_left.lastChild.disabled = !isFixPos;
      updateUIEditAlign();
    };
    editXYContainer.appendChild(iconFixPos);
  }
  edit_size_position_div.appendChild(editXYContainer);
  //
  //
  let editWHContainer = document.createElement("div");
  editWHContainer.className = "row";
  // input edit width
  let list_width = selected_list.filterAndMap((e) => e.value.offsetWidth);
  let edit_width = _textField("82px", undefined, "W", list_width.length == 1 ? list_width[0] : "mixed");
  edit_width.id = "edit_frame_item_w";
  edit_width.lastChild.onblur = function () {
    let newValue = parseFloat(this.value);
    if (!isNaN(newValue)) {
      inputFrameItem({ Width: parseFloat(this.value) }, isRatio);
    }
    updateInputTLWH();
  };
  // input edit height
  let list_height = selected_list.filterAndMap((e) => e.value.offsetHeight);
  let edit_height = _textField("82px", undefined, "H", list_height.length == 1 ? list_height[0] : "mixed");
  edit_height.id = "edit_frame_item_h";
  edit_height.lastChild.onblur = function () {
    let newValue = parseFloat(this.value);
    if (!isNaN(newValue)) {
      inputFrameItem({ Height: parseFloat(this.value) }, isRatio);
    }
    updateInputTLWH();
  };
  let isRatio = selected_list.some((wb) => EnumCate.scale_size_component.some((ct) => wb.CateID === ct));
  let icon_ratioWH = document.createElement("img");
  icon_ratioWH.src = `https://cdn.jsdelivr.net/gh/WiniGit/goline@785f3a1/lib/assets/${isRatio ? "ratioWH" : "un_ratioWH"}.svg`;
  icon_ratioWH.className = "img-button size-28 tlwh-option" + (isRatio ? " toggle" : "");
  if (!isRatio) {
    icon_ratioWH.onclick = function () {
      isRatio = !isRatio;
      this.src = `https://cdn.jsdelivr.net/gh/WiniGit/goline@785f3a1/lib/assets/${isRatio ? "ratioWH" : "un_ratioWH"}.svg`;
      if (isRatio)
        this.classList.add("toggle");
      else
        this.classList.remove("toggle");
    };
  }
  editWHContainer.replaceChildren(edit_width, edit_height, icon_ratioWH);
  edit_size_position_div.appendChild(editWHContainer);

  if (
    selected_list.every((e) => {
      // các scale component luôn cần có size cố định
      if (EnumCate.scale_size_component.some((cate) => e.CateID === cate)) return false;
      return e.WAutolayoutItem || (e.value.parentElement && window.getComputedStyle(e.value.parentElement).display.match(/(flex|table)/g));
    })
  ) {
    let resizeContainer = document.createElement("div");
    resizeContainer.className = "row";
    resizeContainer.style.height = "32px";
    const initResizeW = function () {
      let vl = "";
      if (selected_list.every((e) => e.value.style.width == "100%")) {
        vl = "fill";
      } else if (selected_list.every((e) => !e.value.style.width || e.value.style.width == "fit-content" || e.value.style.width == "max-content")) {
        vl = "hug";
      } else if (selected_list.every((e) => e.value.style.width)) {
        vl = "fixed";
      } else {
        vl = "mixed";
      }
      edit_width.lastChild.disabled = vl !== "fixed";
      icon_ratioWH.style.display = (vl === "fixed" ? null : "none");
      return vl;
    };
    let resizeWBtn = _btnSelectResizeType(true, initResizeW());
    const initResizeH = function () {
      let vl = "";
      if (selected_list.every((e) => e.value.style.height == "100%")) {
        vl = "fill";
      } else if (selected_list.every((e) => !e.value.style.height || e.value.style.height == "fit-content")) {
        vl = "hug";
      } else if (selected_list.every((e) => e.value.style.height)) {
        vl = "fixed";
      } else {
        vl = "mixed";
      }
      edit_height.lastChild.disabled = vl !== "fixed";
      icon_ratioWH.style.display ??= (vl === "fixed" ? null : "none");
      return vl;
    };
    let resizeHBtn = _btnSelectResizeType(false, initResizeH());
    resizeContainer.replaceChildren(resizeWBtn, resizeHBtn);
    edit_size_position_div.appendChild(resizeContainer);
  }
  // input edit radius
  const allowRadius = [EnumCate.rectangle, EnumCate.frame, EnumCate.form, EnumCate.textformfield, EnumCate.button];
  let showInputRadius = selected_list.filter((e) => allowRadius.some(ct => e.CateID === ct));
  let radiusContainer = document.createElement("div");
  radiusContainer.className = "row";
  // input edit rotate
  let edit_rotate = _textField("82px", "https://cdn.jsdelivr.net/gh/WiniGit/goline@785f3a1/lib/assets/rotate_rect.svg", undefined, "0");
  if (showInputRadius.length > 0) {
    let list_radius_value = showInputRadius.map((e) => window.getComputedStyle(e.value).borderRadius.split(" ").map(brvl => parseFloat(brvl.replace("px"))));
    list_radius_value = [].concat(...list_radius_value).filterAndMap();
    let edit_radius = _textField("82px", "https://cdn.jsdelivr.net/gh/WiniGit/goline@785f3a1/lib/assets/radius_rect.svg", undefined, list_radius_value.length == 1 ? list_radius_value[0] : "mixed");
    edit_radius.lastChild.onblur = function () {
      let newValue = parseFloat(this.value);
      if (isNaN(newValue)) {
        let list_radius_value = list_seleted_radius.map((e) => [e.StyleItem.FrameItem.TopLeft, e.StyleItem.FrameItem.TopRight, e.StyleItem.FrameItem.BottomLeft, e.StyleItem.FrameItem.BottomRight]);
        list_radius_value = [].concat(...list_radius_value).filterAndMap();
        this.value = list_radius_value.length == 1 ? list_radius_value[0] : "mixed";
      } else {
        inputFrameItem({
          TopLeft: newValue,
          TopRight: newValue,
          BottomLeft: newValue,
          BottomRight: newValue,
        });
        input_top_left.value = newValue;
        input_top_right = newValue;
        input_bot_left = newValue;
        input_bot_right = newValue;
      }
    };
    let toggleRadiusDetails = document.createElement("img");
    toggleRadiusDetails.setAttribute("show-details", false);
    toggleRadiusDetails.className = "radius-details img-button size-24";
    toggleRadiusDetails.onclick = function () {
      toggleRadiusDetails.setAttribute("show-details", toggleRadiusDetails.getAttribute("show-details") != "true");
      edit_radius.style.pointerEvents = toggleRadiusDetails.getAttribute("show-details") == "true" ? "none" : "auto";
    };
    radiusContainer.replaceChildren(edit_rotate, edit_radius, toggleRadiusDetails);
    edit_size_position_div.appendChild(radiusContainer);
    // fifth line contain 4 rect radius topleft, topright, botleft, botright
    let _row_radius_detail = document.createElement("div");
    _row_radius_detail.id = "row_radius_detail";
    let icon_HTML = document.createElement("img");
    icon_HTML.src = "https://cdn.jsdelivr.net/gh/WiniGit/goline@785f3a1/lib/assets/radius_rect.svg";
    icon_HTML.className = "img-button size-24";
    _row_radius_detail.replaceChildren(icon_HTML, ...["borderTopLeftRadius", "borderTopRightRadius", "borderBottomLeftRadius", "borderBottomRightRadius"].map(radiusProp => {
      let radiusInputDetail = document.createElement("input");
      let rvalue = showInputRadius.filterAndMap((e) => window.getComputedStyle(e.value)[radiusProp].replace("px", ""));
      radiusInputDetail.value = rvalue.length == 1 ? rvalue[0] : "mixed";
      radiusInputDetail.onfocus = function () {
        this.setSelectionRange(0, this.value.length);
      };
      return radiusInputDetail;
    }));
    $("body").on("blur", "#row_radius_detail > input:nth-child(2)", function () {
      let newValue = parseFloat(this.value);
      if (isNaN(newValue)) {
        let list_top_left_value = selected_list.filter((e) => e.StyleItem.FrameItem?.TopLeft != undefined).map((e) => e.StyleItem.FrameItem.TopLeft);
        let top_left_value = list_top_left_value[0];
        list_top_left_value = list_top_left_value.filter((e) => e != top_left_value);
        this.value = list_top_left_value.length == 0 ? top_left_value : "mixed";
      } else {
        inputFrameItem({ TopLeft: newValue });
        if (this.value == input_top_right.value && this.value == input_bot_left.value && this.value == input_bot_right.value) {
          edit_radius.lastChild.value = this.value;
        } else {
          edit_radius.lastChild.value = "mixed";
        }
      }
    });
    $("body").on("blur", "#row_radius_detail > input:nth-child(3)", function () {
      let newValue = parseFloat(this.value);
      if (isNaN(newValue)) {
        let list_top_right_value = selected_list.filter((e) => e.StyleItem.FrameItem?.Topright != undefined).map((e) => e.StyleItem.FrameItem.TopRight);
        let top_right_value = list_top_right_value[0];
        list_top_right_value = list_top_right_value.filter((e) => e != top_right_value);
        this.value = list_top_right_value.length == 0 ? top_right_value : "mixed";
      } else {
        inputFrameItem({ TopRight: newValue });
        if (this.value == input_top_left.value && this.value == input_bot_left.value && this.value == input_bot_right.value) {
          edit_radius.lastChild.value = this.value;
        } else {
          edit_radius.lastChild.value = "mixed";
        }
      }
    });
    $("body").on("blur", "#row_radius_detail > input:nth-child(4)", function () {
      let newValue = parseFloat(this.value);
      if (isNaN(newValue)) {
        let list_bot_left_value = selected_list.filter((e) => e.StyleItem.FrameItem?.BottomLeft != undefined).map((e) => e.StyleItem.FrameItem.BottomLeft);
        let bot_left_value = list_bot_left_value[0];
        list_bot_left_value = list_bot_left_value.filter((e) => e != bot_left_value);
        this.value = list_bot_left_value.length == 0 ? bot_left_value : "mixed";
      } else {
        inputFrameItem({ BottomLeft: newValue });
        if (this.value == input_top_right.value && this.value == input_top_left.value && this.value == input_bot_right.value) {
          edit_radius.lastChild.value = this.value;
        } else {
          edit_radius.lastChild.value = "mixed";
        }
      }
    });
    $("body").on("blur", "#row_radius_detail > input:nth-child(5)", function () {
      let newValue = parseFloat(this.value);
      if (isNaN(newValue)) {
        let list_bot_right_value = selected_list.filter((e) => e.StyleItem.FrameItem?.BottomRight != undefined).map((e) => e.StyleItem.FrameItem.BottomRight);
        let bot_right_value = list_bot_right_value[0];
        list_bot_right_value = list_bot_right_value.filter((e) => e != bot_right_value);
        this.value = list_bot_right_value.length == 0 ? bot_right_value : "mixed";
      } else {
        inputFrameItem({ BottomRight: newValue });
        if (this.value == input_top_right.value && this.value == input_top_left.value && this.value == input_bot_left.value) {
          edit_radius.lastChild.value = this.value;
        } else {
          edit_radius.lastChild.value = "mixed";
        }
      }
    });
    edit_size_position_div.appendChild(_row_radius_detail);
  }
  if (selected_list.filter((wb) => wb !== EnumCate.table && EnumCate.no_child_component.every((ct) => wb.CateID != ct)).length > 0) {
    // sixth line is btn checkboc clip content (overflow)
    let btn_clip_content = document.createElement("label");
    btn_clip_content.className = "row regular1";
    btn_clip_content.style.margin = "4px 0 0 16px";
    btn_clip_content.innerHTML = `<input type="checkbox"${selected_list.filter(wb => wb.CateID !== EnumCate.table).every((wb) => window.getComputedStyle(wb.value).overflow.includes("hidden")) ? " checked" : ""} style="margin-right: 8px; width: fit-content" />Clip content`;
    btn_clip_content.firstChild.onchange = function (ev) {
      inputFrameItem({ IsClip: ev.target.checked });
    };
    edit_size_position_div.appendChild(btn_clip_content);
  }
  return edit_size_position_div;
}

// update style HTML edit position UI
function updateUIEditPosition() {
  // let newEditSizePositionForm = createEditSizePosition();
  // document.getElementById("edit_size_position_div").replaceWith(newEditSizePositionForm);
}

// update input top,left,width,height
function updateInputTLWH() {
  if (document.getElementById("edit_size_position_div")) {
    let edit_left = document.getElementById("edit_position_item_left");
    let list_offsetX = selected_list.filterAndMap((wbaseItem) => `${getWBaseOffset(wbaseItem).x}`.replace(".00", ""));
    edit_left.lastChild.value = list_offsetX.length == 1 ? list_offsetX[0] : "mixed";
    // Y
    let edit_top = document.getElementById("edit_position_item_top");
    let list_offsetY = selected_list.filterAndMap((wbaseItem) => `${getWBaseOffset(wbaseItem).y}`.replace(".00", ""));
    edit_top.lastChild.value = list_offsetY.length == 1 ? list_offsetY[0] : "mixed";
    // W
    let edit_width = document.getElementById("edit_frame_item_w");
    let list_width = selected_list.filterAndMap((e) => (document.getElementById(e.GID) ?? e.value).offsetWidth);
    edit_width.lastChild.value = list_width.length == 1 ? list_width[0] : "mixed";
    // H
    let edit_height = document.getElementById("edit_frame_item_h");
    let list_height = selected_list.filterAndMap((e) => (document.getElementById(e.GID) ?? e.value).offsetHeight);
    edit_height.lastChild.value = list_height.length == 1 ? list_height[0] : "mixed";
    //
    let parentHTML = document.getElementById(select_box_parentID) ?? divSection;
    if (parentHTML && window.getComputedStyle(parentHTML).display.match(/(flex|table)/g) && selected_list.some((e) => !e.StyleItem.PositionItem.FixPosition)) {
      edit_left.lastChild.disabled = true;
      edit_top.lastChild.disabled = true;
    } else {
      edit_left.lastChild.disabled = false;
      edit_top.lastChild.disabled = false;
    }
    if (checkpad <= selected_list.length) {
      let resizeWType = "fixed";
      if (selected_list.every((e) => e.value.style.width == "100%")) {
        resizeWType = "fill";
      } else if (selected_list.every((e) => !e.value.style.width || e.value.style.width == "fit-content" || e.value.style.width == "max-content")) {
        resizeWType = "hug";
      } else if (selected_list.every((e) => e.value.style.width)) {
        resizeWType = "fixed";
      } else {
        resizeWType = "mixed";
      }
      let resizeHType = "fixed";
      if (selected_list.every((e) => e.value.style.height == "100%")) {
        resizeHType = "fill";
      } else if (selected_list.every((e) => !e.value.style.height || e.value.style.height == "fit-content")) {
        resizeHType = "hug";
      } else if (selected_list.every((e) => e.value.style.height)) {
        resizeHType = "fixed";
      } else {
        resizeHType = "mixed";
      }
      if (resizeWType == "fixed" && resizeHType == "fixed") {
        edit_width.parentElement.lastChild.style.display = "block";
      } else {
        edit_width.parentElement.lastChild.style.display = "none";
      }
      if (resizeWType == "fixed") {
        edit_width.lastChild.disabled = false;
      } else {
        edit_width.lastChild.disabled = true;
      }
      if (resizeHType == "fixed") {
        edit_height.lastChild.disabled = false;
      } else {
        edit_height.lastChild.disabled = true;
      }
      // update button select resizing type
      let btn_resize_with_height = document.getElementsByClassName("btn_resize");
      if (btn_resize_with_height.length > 0) {
        if (selected_list.every((e) => e.WAutolayoutItem || (!e.StyleItem.PositionItem.FixPosition && window.getComputedStyle(parentHTML).display.match(/(flex|table)/g)))) {
          btn_resize_with_height[0].parentElement.style.display = "flex";
          for (let option of btn_resize_with_height) {
            if (option.className.includes("width")) {
              option.childNodes[1].innerHTML = resizeWType;
            } else {
              option.childNodes[1].innerHTML = resizeHType;
            }
          }
        } else {
          btn_resize_with_height[0].parentElement.style.display = "none";
        }
      }
    }
  }
  if (checkpad <= selected_list.length && document.getElementById("edit_text_style")) {
    updateUIAutoSizeWH();
  }
}

// edit auto layout
function createAutoLayout() {
  let autoLayoutList = selected_list.filter((e) => e.WAutolayoutItem);
  let isEditTable = autoLayoutList.length > 0 && autoLayoutList.every((e) => e.CateID === EnumCate.table);
  let editContainer = document.createElement("div");
  editContainer.id = "edit_auto_layout_div";
  editContainer.className = "edit-container";
  let header = document.createElement("div");
  header.className = "header_design_style";
  editContainer.appendChild(header);
  let title = document.createElement("p");
  header.appendChild(title);
  title.innerHTML = isEditTable ? "Table layout" : "Auto layout";
  let showDetails = selected_list.every((e) => e.WAutolayoutItem);
  if (showDetails) {
    if (autoLayoutList.every((e) => e.CateID !== EnumCate.textformfield && e.CateID != EnumCate.table)) {
      let icon_remove = document.createElement("i");
      icon_remove.id = "btn_remove_auto_layout";
      header.appendChild(icon_remove);
      icon_remove.className = "fa-solid fa-minus fa-sm";
      icon_remove.onclick = function () {
        removeLayout();
        updateUIAutoLayout();
      };
    }
    let auto_layout_details_div = document.createElement("div");
    editContainer.appendChild(auto_layout_details_div);
    auto_layout_details_div.className = "col";
    auto_layout_details_div.style.marginBottom = "4px";
    let _row1 = document.createElement("div");
    auto_layout_details_div.appendChild(_row1);
    _row1.style.display = "flex";
    _row1.style.position = "relative";
    //
    let isVertical = autoLayoutList.every((e) => e.WAutolayoutItem.Direction == "Vertical");
    // group btn edit auto layout direction
    let group_btn_direction = document.createElement("div");
    group_btn_direction.className = "group_btn_direction";
    _row1.appendChild(group_btn_direction);
    let btn_vertical = document.createElement("i");
    btn_vertical.className = "fa-solid fa-arrow-down fa-xs";
    btn_vertical.style.backgroundColor = isVertical ? "#e5e5e5" : "transparent";
    let btn_horizontal = document.createElement("i");
    group_btn_direction.replaceChildren(btn_vertical, btn_horizontal);
    btn_horizontal.className = "fa-solid fa-arrow-right fa-xs";
    btn_horizontal.style.backgroundColor = isVertical ? "transparent" : "#e5e5e5";
    if (autoLayoutList.every((wbaseItem) => [EnumCate.textformfield, ...EnumCate.data_component].every((cate) => wbaseItem.CateID !== cate)))
      if (isVertical) {
        btn_horizontal.onclick = function () {
          editLayoutStyle({ Direction: "Horizontal" });
          updateUIAutoLayout();
        };
      } else {
        btn_vertical.onclick = function () {
          editLayoutStyle({ Direction: "Vertical" });
          updateUIAutoLayout();
        };
      }
    // select alignment type
    let alignment_type = _alignTable(isVertical, autoLayoutList[0].WAutolayoutItem.Alignment);
    _row1.appendChild(alignment_type);
    // extension auto layout
    let btn_extension = document.createElement("i");
    _row1.appendChild(btn_extension);
    btn_extension.className = "fa-solid fa-ellipsis icon_btn_default_style";
    btn_extension.onclick = function () {
      setTimeout(function () { }, 200);
    };
    // input edit child space
    let childSpaceValues = autoLayoutList.filterAndMap((e) => e.WAutolayoutItem.ChildSpace);
    if (!isEditTable) {
      let input_child_space = _textField("88px", `https://cdn.jsdelivr.net/gh/WiniGit/goline@785f3a1/lib/assets/${isVertical ? "vertical" : "horizontal"} child spacing.svg`, undefined, childSpaceValues.length == 1 ? childSpaceValues[0] : "mixed");
      input_child_space.style.position = "absolute";
      input_child_space.style.left = "0";
      input_child_space.style.bottom = "0";
      input_child_space.lastChild.onblur = function () {
        let newValue = parseFloat(this.value);
        if (newValue != undefined) {
          editLayoutStyle({ ChildSpace: newValue });
          updateUIAutoLayout();
        } else {
          this.value = childSpaceValues.length == 1 ? childSpaceValues[0] : "mixed";
        }
      };
      _row1.appendChild(input_child_space);
      if (autoLayoutList.every((wbaseItem) => EnumCate.extend_frame.some((cate) => wbaseItem.CateID === cate))) {
        let isGridValues = autoLayoutList.filterAndMap((e) => e.WAutolayoutItem.IsWrap);
        let isGridRow = document.createElement("div");
        isGridRow.className = "row";
        isGridRow.style.width = "100%";
        let btnIsGrid = document.createElement("div");
        btnIsGrid.className = "row regular1 check-box-label";
        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.defaultChecked = isGridValues.every((checkVl) => checkVl);
        btnIsGrid.appendChild(checkbox);
        btnIsGrid.innerHTML += "Wrap content";
        btnIsGrid.onclick = function () {
          this.firstChild.checked = !this.firstChild.checked;
          editLayoutStyle({ IsWrap: this.firstChild.checked });
        };
        let runSpaceValues = autoLayoutList.filterAndMap((e) => e.WAutolayoutItem.RunSpace);
        let inputRunSpace = _textField("88px", `https://cdn.jsdelivr.net/gh/WiniGit/goline@785f3a1/lib/assets/${isVertical ? "horizontal" : "vertical"} child spacing.svg`, undefined, runSpaceValues.length == 1 ? runSpaceValues[0] : "mixed");
        inputRunSpace.lastChild.onblur = function () {
          let newValue = parseFloat(this.value);
          if (newValue != undefined) {
            editLayoutStyle({ RunSpace: newValue });
            updateUIAutoLayout();
          } else {
            this.value = runSpaceValues.length == 1 ? runSpaceValues[0] : "mixed";
          }
        };
        isGridRow.replaceChildren(btnIsGrid, inputRunSpace);
        let isScrollValues = autoLayoutList.filterAndMap((e) => e.WAutolayoutItem.IsScroll);
        let btnIsScroll = document.createElement("div");
        btnIsScroll.className = "row regular1 check-box-label";
        let checkIsScroll = document.createElement("input");
        checkIsScroll.type = "checkbox";
        checkIsScroll.defaultChecked = isScrollValues.every((checkVl) => checkVl);
        btnIsScroll.appendChild(checkIsScroll);
        btnIsScroll.innerHTML += "Overflow scroll";
        if (autoLayoutList.some((e) => (e.value.classList.contains("w-col") && e.value.style.height == "fit-content") || (e.value.classList.contains("w-row") && e.value.style.width == "fit-content"))) {
          btnIsScroll.setAttribute("disabled", "true");
        } else {
          btnIsScroll.onclick = function () {
            this.firstChild.checked = !this.firstChild.checked;
            editLayoutStyle({ IsScroll: this.firstChild.checked });
          };
        }
        editContainer.appendChild(isGridRow);
        editContainer.appendChild(btnIsScroll);
      }
    }

    // input padding
    let isShowPadDetails = false;
    let paddingLefts = autoLayoutList.filterAndMap((e) => e.StyleItem.PaddingItem.Left);
    let padLeftValue = paddingLefts.length == 1 ? paddingLefts[0] : "mixed";
    let paddingTops = autoLayoutList.filterAndMap((e) => e.StyleItem.PaddingItem.Top);
    let padTopValue = paddingTops.length == 1 ? paddingTops[0] : "mixed";
    let paddingRights = autoLayoutList.filterAndMap((e) => e.StyleItem.PaddingItem.Right);
    let padRightValue = paddingRights.length == 1 ? paddingRights[0] : "mixed";
    let paddingBots = autoLayoutList.filterAndMap((e) => e.StyleItem.PaddingItem.Bottom);
    let padBotValue = paddingBots.length == 1 ? paddingBots[0] : "mixed";
    let paddingContainer = document.createElement("div");
    paddingContainer.className = "row";
    paddingContainer.style.flexWrap = "wrap";
    paddingContainer.style.gap = "4px";
    paddingContainer.style.marginTop = "6px";
    editContainer.appendChild(paddingContainer);
    let input_padding_horizontal = _textField("88px", "https://cdn.jsdelivr.net/gh/WiniGit/goline@785f3a1/lib/assets/padding horizontal.svg", undefined, padLeftValue == padRightValue ? padLeftValue : "mixed");
    input_padding_horizontal.lastChild.onblur = function () {
      let newValue = parseFloat(this.value);
      if (newValue != undefined) {
        inputPadding({ Left: newValue, Right: newValue });
        input_padding_left.lastChild.value = this.value;
        padLeftValue = this.value;
        input_padding_right.lastChild.value = this.value;
        padRightValue = this.value;
      } else {
        this.value = padLeftValue == padRightValue ? padLeftValue : "mixed";
      }
    };
    paddingContainer.appendChild(input_padding_horizontal);
    let input_padding_vertical = _textField("88px", "https://cdn.jsdelivr.net/gh/WiniGit/goline@785f3a1/lib/assets/padding vertical.svg", undefined, padTopValue == padBotValue ? padTopValue : "mixed");
    input_padding_vertical.style.marginLeft = "6px";
    input_padding_vertical.lastChild.onblur = function () {
      let newValue = parseFloat(this.value);
      if (newValue != undefined) {
        inputPadding({ Top: newValue, Bottom: newValue });
        input_padding_top.lastChild.value = this.value;
        padTopValue = this.value;
        input_padding_bottom.lastChild.value = this.value;
        padBotValue = this.value;
      } else {
        this.value = padTopValue == padBotValue ? padTopValue : "mixed";
      }
    };
    paddingContainer.appendChild(input_padding_vertical);
    let input_padding_left = _textField("88px", "https://cdn.jsdelivr.net/gh/WiniGit/goline@785f3a1/lib/assets/padding left.svg", undefined, padLeftValue);
    input_padding_left.lastChild.onblur = function () {
      let newValue = parseFloat(this.value);
      if (newValue != undefined) {
        inputPadding({ Left: newValue });
        padLeftValue = this.value;
        input_padding_horizontal.lastChild.value = padLeftValue == padRightValue ? padLeftValue : "mixed";
      } else {
        this.value = padLeftValue;
      }
    };
    paddingContainer.appendChild(input_padding_left);
    let input_padding_top = _textField("88px", "https://cdn.jsdelivr.net/gh/WiniGit/goline@785f3a1/lib/assets/padding top.svg", undefined, padTopValue);
    input_padding_top.style.marginLeft = "6px";
    input_padding_top.lastChild.onblur = function () {
      let newValue = parseFloat(this.value);
      if (newValue != undefined) {
        inputPadding({ Top: newValue });
        padTopValue = this.value;
        input_padding_vertical.lastChild.value = padTopValue == padBotValue ? padTopValue : "mixed";
      } else {
        this.value = padTopValue;
      }
    };
    paddingContainer.appendChild(input_padding_top);
    let icon_padding_details = document.createElement("img");
    icon_padding_details.className = "img-button size-24";
    icon_padding_details.style.borderRadius = "2px";
    icon_padding_details.style.margin = "4px 0 0 6px";
    paddingContainer.appendChild(icon_padding_details);
    icon_padding_details.src = "https://cdn.jsdelivr.net/gh/WiniGit/goline@785f3a1/lib/assets/padding details.svg";
    let input_padding_right = _textField("88px", "https://cdn.jsdelivr.net/gh/WiniGit/goline@785f3a1/lib/assets/padding right.svg", undefined, padRightValue);
    input_padding_right.lastChild.onblur = function () {
      var newValue = parseFloat(this.value);
      if (newValue != undefined) {
        inputPadding({ Right: newValue });
        padRightValue = this.value;
        input_padding_horizontal.lastChild.value = padLeftValue == padRightValue ? padLeftValue : "mixed";
      } else {
        this.value = padRightValue;
      }
    };
    paddingContainer.appendChild(input_padding_right);
    let input_padding_bottom = _textField("88px", "https://cdn.jsdelivr.net/gh/WiniGit/goline@785f3a1/lib/assets/padding bottom.svg", undefined, padBotValue);
    input_padding_bottom.style.marginLeft = "6px";
    input_padding_bottom.lastChild.onblur = function () {
      let newValue = parseFloat(this.value);
      if (newValue != undefined) {
        inputPadding({ Bottom: newValue });
        padBotValue = this.value;
        input_padding_vertical.lastChild.value = padTopValue == padBotValue ? padTopValue : "mixed";
      } else {
        this.value = padBotValue;
      }
    };
    paddingContainer.appendChild(input_padding_bottom);
    icon_padding_details.onclick = function () {
      isShowPadDetails = !isShowPadDetails;
      toggleShowDetails();
    };
    toggleShowDetails();
    function toggleShowDetails() {
      if (isShowPadDetails) {
        input_padding_horizontal.style.display = "none";
        input_padding_vertical.style.display = "none";
        input_padding_left.style.display = "flex";
        input_padding_top.style.display = "flex";
        input_padding_right.style.display = "flex";
        input_padding_bottom.style.display = "flex";
        icon_padding_details.style.borderColor = "#e5e5e5";
      } else {
        input_padding_horizontal.style.display = "flex";
        input_padding_vertical.style.display = "flex";
        input_padding_left.style.display = "none";
        input_padding_top.style.display = "none";
        input_padding_right.style.display = "none";
        input_padding_bottom.style.display = "none";
        icon_padding_details.style.borderColor = "transparent";
      }
    }
  } else {
    header.id = "edit-layout-header";
    let icon_add = document.createElement("i");
    icon_add.id = "btn_add_auto_layout";
    header.appendChild(icon_add);
    icon_add.className = "fa-solid fa-plus fa-sm";
    icon_add.onclick = function () {
      addAutoLayout();
      updateUIAutoLayout();
    };
  }
  return editContainer;
}

// update style HTML edit auto layout UI
function updateUIAutoLayout() {
  let newEditAutoLayout = createAutoLayout();
  document.getElementById("edit_auto_layout_div").replaceWith(newEditAutoLayout);
}

// create text field UI
function _textField(width, icon, label, value, iconSize) {
  let inputContainer = document.createElement("div");
  inputContainer.className = "text_field_right_view";
  inputContainer.style.width = width;
  if (icon != null && icon != undefined) {
    let icon_HTML = document.createElement("img");
    icon_HTML.src = icon;
    icon_HTML.style.boxSizing = "border-box";
    icon_HTML.style.width = iconSize ?? "24px";
    icon_HTML.style.height = iconSize ?? "24px";
    icon_HTML.style.padding = "6px";
    inputContainer.appendChild(icon_HTML);
  }
  if (label != null && label != undefined) {
    var label_HTML = document.createElement("p");
    label_HTML.innerHTML = label;
    label_HTML.style.fontSize = "12px";
    label_HTML.style.lineHeight = "16px";
    label_HTML.style.color = "#BFBFBF";
    label_HTML.style.fontWeight = "400";
    label_HTML.style.marginLeft = "4px";
    inputContainer.appendChild(label_HTML);
  }
  let input = document.createElement("input");
  input.className = "input_text_field";
  input.value = value;
  input.onfocus = function () {
    this.select();
  };
  input.style.backgroundColor = "transparent";
  inputContainer.appendChild(input);
  return inputContainer;
}

// ! Constraints
function createConstraints() {
  let editContainer = document.createElement("div");
  editContainer.id = "edit-constraints";
  editContainer.className = "edit-container";

  let header = document.createElement("div");
  header.className = "header_design_style";
  editContainer.appendChild(header);

  let title = document.createElement("p");
  title.innerHTML = "Constraints";
  header.appendChild(title);

  let bodyContainer = document.createElement("div");
  bodyContainer.className = "col";
  editContainer.appendChild(bodyContainer);

  //
  let editConstContainer = document.createElement("div");
  editConstContainer.className = "row";
  bodyContainer.appendChild(editConstContainer);
  let constraintsXValues = selected_list.filterAndMap((e) => e.value.getAttribute("constx"));
  let constraintsX = constraintsXValues.length == 1 ? constraintsXValues[0] : "mixed";
  let constraintsYValues = selected_list.filterAndMap((e) => e.value.getAttribute("consty"));
  let constraintsY = constraintsYValues.length == 1 ? constraintsYValues[0] : "mixed";

  let constraintsRect = document.createElement("div");
  constraintsRect.className = "connstraints-rect";
  let selectConstraintsCol = document.createElement("div");
  selectConstraintsCol.className = "col";
  editConstContainer.replaceChildren(constraintsRect, selectConstraintsCol);

  let listContraintsX = [Constraints.left, Constraints.right, Constraints.center];
  let listContraintsY = [Constraints.top, Constraints.bottom, Constraints.center];
  if (selected_list.every((wb) => EnumCate.scale_size_component.every((cate) => wb.CateID != cate))) {
    if (selected_list.every((wb) => wb.value.getAttribute("width-type") !== "fit")) {
      listContraintsX.push(Constraints.left_right, Constraints.scale);
    }
    if (selected_list.every((wb) => wb.value.getAttribute("height-type") !== "fit")) {
      listContraintsY.push(Constraints.top_bottom, Constraints.scale);
    }
  }

  let smallConstRect = document.createElement("div");
  constraintsRect.appendChild(smallConstRect);

  for (let constY of listContraintsY.slice(0, 3)) {
    let selectBtn = document.createElement("div");
    selectBtn.className = "constraint-selector-outerVertical";
    let typeLine = document.createElement("div");
    if (constY === constraintsY.toLowerCase()) {
      typeLine.style.backgroundColor = "#007be5";
      selectBtn.style.pointerEvents = "none";
    } else if (constraintsY.toLowerCase().includes(constY)) {
      typeLine.style.backgroundColor = "#007be5";
    }
    selectBtn.appendChild(typeLine);
    switch (constY) {
      case Constraints.top:
        selectBtn.style.top = "0px";
        break;
      case Constraints.center:
        selectBtn.style.top = "50%";
        selectBtn.style.padding = "2px";
        selectBtn.style.transform = "translate(-50%, -50%)";
        typeLine.style.height = "12px";
        break;
      case Constraints.bottom:
        selectBtn.style.bottom = "0px";
        break;
      default:
        break;
    }
    selectBtn.onclick = function () {
      inputPositionItem({ ConstraintsY: constY });
      updateUIConstraints();
    };
    constraintsRect.appendChild(selectBtn);
  }

  for (let constX of listContraintsX.slice(0, 3)) {
    let selectBtn = document.createElement("div");
    selectBtn.className = "constraint-selector-outerHorizontal";
    let typeLine = document.createElement("div");
    if (constX === constraintsX.toLowerCase()) {
      typeLine.style.backgroundColor = "#007be5";
      selectBtn.style.pointerEvents = "none";
    } else if (constraintsX.toLowerCase().includes(constX)) {
      typeLine.style.backgroundColor = "#007be5";
    }
    selectBtn.appendChild(typeLine);
    switch (constX) {
      case Constraints.left:
        selectBtn.style.left = "0px";
        break;
      case Constraints.center:
        selectBtn.style.left = "50%";
        selectBtn.style.padding = "2px";
        selectBtn.style.transform = "translate(-50%, -50%)";
        typeLine.style.width = "12px";
        break;
      case Constraints.right:
        selectBtn.style.right = "0px";
        break;
      default:
        break;
    }
    selectBtn.onclick = function () {
      inputPositionItem({ ConstraintsX: constX });
      updateUIConstraints();
    };
    constraintsRect.appendChild(selectBtn);
  }

  let dropdownConstX = _btnDropDownSelect(
    constraintsX !== "mixed" ? listContraintsX : ["mixed", ...listContraintsX],
    function (options) {
      for (let option of options) {
        if (option.getAttribute("value") == constraintsX) {
          option.firstChild.style.opacity = 1;
        } else {
          option.firstChild.style.opacity = 0;
        }
      }
    },
    function (value) {
      inputPositionItem({ ConstraintsX: value });
      updateUIConstraints();
    },
  );
  dropdownConstX.firstChild.innerHTML = constraintsX;

  let dropdownConstY = _btnDropDownSelect(
    constraintsY !== "mixed" ? listContraintsY : ["mixed", ...listContraintsY],
    function (options) {
      for (let option of options) {
        if (option.getAttribute("value") == constraintsY) {
          option.firstChild.style.opacity = 1;
        } else {
          option.firstChild.style.opacity = 0;
        }
      }
    },
    function (value) {
      inputPositionItem({ ConstraintsY: value });
      updateUIConstraints();
    },
  );
  dropdownConstY.firstChild.innerHTML = constraintsY;

  selectConstraintsCol.replaceChildren(dropdownConstX, dropdownConstY);

  // if (select_box_parentID !== wbase_parentID) {
  //   let parentHTML = document.getElementById(select_box_parentID);
  //   if (parentHTML.getAttribute("level") == 1 && EnumCate.extend_frame.some((cate) => parentHTML.getAttribute("cateid") == cate) && !window.getComputedStyle(parentHTML).display.match("flex")) {
  //     let fixPosRow = document.createElement("div");
  //     fixPosRow.className = "row";
  //     fixPosRow.style.margin = "8px 0 0 8px";
  //     fixPosRow.style.gap = "8px";
  //     let checkboxIsFix = document.createElement("input");
  //     checkboxIsFix.id = "check-fix-pos";
  //     checkboxIsFix.type = "checkbox";
  //     checkboxIsFix.style.scale = 1.2;
  //     checkboxIsFix.style.width = "fit-content";
  //     checkboxIsFix.defaultChecked = selected_list.every((e) => e.StyleItem.PositionItem.FixPosition);
  //     checkboxIsFix.onchange = function (e) {
  //       e.stopPropagation();
  //       inputPositionItem({ FixPosition: this.checked });
  //       updateUIConstraints();
  //     };
  //     let labelFixPos = document.createElement("label");
  //     labelFixPos.className = "regular1";
  //     labelFixPos.htmlFor = "check-fix-pos";
  //     labelFixPos.innerHTML = "Fix position when scrolling";
  //     fixPosRow.replaceChildren(checkboxIsFix, labelFixPos);
  //     bodyContainer.appendChild(fixPosRow);
  //   }
  // }

  return editContainer;
}

function updateUIConstraints() {
  if (document.getElementById("edit-constraints")) {
    let newEditConst = createConstraints();
    document.getElementById("edit-constraints").replaceWith(newEditConst);
  }
}

//create button select resizing type
function _btnSelectResizeType(isW = true, type) {
  type = type.toLowerCase();
  let btn_resize = document.createElement("div");
  btn_resize.className = "btn_resize" + (isW ? " width" : " height");
  let icon_resize = document.createElement("span");
  btn_resize.appendChild(icon_resize);
  if (!isW) {
    icon_resize.style.transform = "rotate(90deg)";
  }
  let title = document.createElement("p");
  title.innerHTML = type;
  btn_resize.appendChild(title);
  switch (type) {
    case "hug":
      icon_resize.innerHTML = SVGIcon.hug_content;
      break;
    case "fill":
      icon_resize.innerHTML = SVGIcon.fill_container;
      break;
    default:
      icon_resize.innerHTML = SVGIcon.fixed_size;
      break;
  }
  let icon_down = document.createElement("i");
  btn_resize.appendChild(icon_down);
  icon_down.className = "fa-solid fa-chevron-down fa-2xs";
  icon_down.style.opacity = 0.8;
  btn_resize.onclick = function () {
    document.querySelector("#body > .popup_list_resize_type")?.remove();
    let popup_list_resize_type = document.createElement("div");
    popup_list_resize_type.className = "popup_list_resize_type col wini_popup popup_remove";
    for (let i = 0; i < 4; i++) {
      let resize_type_option = document.createElement("div");
      resize_type_option.className = "resize_type_option";
      let icon_check = document.createElement("span");
      icon_check.innerHTML = SVGIcon.check_mark.replace("#000", "#fff");
      let icon_option_type = document.createElement("span");
      if (!isW) {
        icon_option_type.style.transform = "rotate(90deg)";
      }
      resize_type_option.replaceChildren(icon_check, icon_option_type);
      switch (i) {
        case 0:
          resize_type_option.innerHTML += "mixed";
          break;
        case 1:
          if (type != "fixed") icon_check.style.visibility = "hidden";
          icon_option_type.innerHTML = SVGIcon.fixed_size.replace("#000", "#fff");
          resize_type_option.innerHTML += `fixed ${isW ? "width" : "height"}`;
          resize_type_option.onclick = function (e) {
            e.stopPropagation();
            selectResizeType(isW, "fixed");
            popup_list_resize_type.remove();
            updateInputTLWH();
            updateUIConstraints();
          };
          break;
        case 2:
          if (type != "hug") icon_check.style.visibility = "hidden";
          icon_option_type.innerHTML = SVGIcon.hug_content.replace("#000", "#fff");
          resize_type_option.innerHTML += "hug contents";
          resize_type_option.onclick = function (e) {
            e.stopPropagation();
            selectResizeType(isW, "hug");
            popup_list_resize_type.remove();
            updateInputTLWH();
            updateUIConstraints();
          };
          break;
        case 3:
          if (type != "fill") icon_check.style.visibility = "hidden";
          icon_option_type.innerHTML = SVGIcon.fill_container.replace("#000", "#fff");
          resize_type_option.innerHTML += "fill container";
          resize_type_option.onclick = function (e) {
            e.stopPropagation();
            selectResizeType(isW, "fill");
            popup_list_resize_type.remove();
            updateInputTLWH();
            updateUIConstraints();
          };
          break;
        default:
          break;
      }
      popup_list_resize_type.appendChild(resize_type_option);
    }
    showPopupSelectResizeType(popup_list_resize_type, isW, title.innerHTML);
    let offset = this.getBoundingClientRect();
    popup_list_resize_type.style.left = offset.x + "px";
    popup_list_resize_type.style.top = offset.y + "px";
    setTimeout(function () {
      document.getElementById("body").appendChild(popup_list_resize_type);
    }, 200);
  };

  return btn_resize;
}

//
function showPopupSelectResizeType(popup_list_resize_type, isW, type) {
  var parentHTML;
  var activeFill = false;
  if (select_box_parentID !== wbase_parentID) {
    parentHTML = document.getElementById(select_box_parentID);
    activeFill = window.getComputedStyle(parentHTML).display.match(/(flex|table)/g);
  }
  var activeHug = false;
  activeHug = selected_list.every((e) => {
    if (e.CateID === EnumCate.text || e.CateID === EnumCate.table) return true;
    if (e.WAutolayoutItem && !(e.WAutolayoutItem.IsScroll && e.WAutolayoutItem.IsWrap)) {
      if (isW) {
        if (e.CateID !== EnumCate.textformfield) {
          if (e.WAutolayoutItem.Direction === "Horizontal") {
            return !e.WAutolayoutItem.IsWrap && !e.WAutolayoutItem.IsScroll;
          } else if ([...e.value.querySelectorAll(`.wbaseItem-value[level="${e.Level + 1}"]`)].every((childHTML) => !childHTML.classList.contains("col-"))) {
            return !e.WAutolayoutItem.IsScroll;
          }
        }
      } else {
        if (e.WAutolayoutItem.Direction === "Vertical") {
          return !e.WAutolayoutItem.IsWrap && !e.WAutolayoutItem.IsScroll;
        } else {
          return !e.WAutolayoutItem.IsScroll;
        }
      }
    }
    return false;
  });
  if (activeFill)
    activeFill = selected_list.every((e) => {
      if (isW) {
        if (parentHTML.classList.contains("w-row")) {
          if (parentHTML.style.width && parentHTML.style.width != "fit-content") {
            return parentHTML.getAttribute("wrap") == "wrap" || parentHTML.getAttribute("scroll") != "true";
          }
        } else {
          return parentHTML.getAttribute("wrap") != "wrap";
        }
      } else {
        if (e.CateID !== EnumCate.tree) {
          if (parentHTML.classList.contains("w-row")) {
            return parentHTML.getAttribute("wrap") != "wrap";
          } else {
            if (parentHTML.style.height && parentHTML.style.height != "fit-content") {
              return parentHTML.getAttribute("wrap") == "wrap" || parentHTML.getAttribute("scroll") != "true";
            }
          }
        }
      }
      return false;
    });
  if (activeFill) {
    popup_list_resize_type.childNodes[3].style.display = "flex";
  } else {
    popup_list_resize_type.childNodes[3].style.display = "none";
  }
  if (activeHug) {
    popup_list_resize_type.childNodes[2].style.display = "flex";
  } else {
    popup_list_resize_type.childNodes[2].style.display = "none";
  }
  switch (type.toLowerCase()) {
    case "fixed":
      popup_list_resize_type.firstChild.style.display = "none";
      popup_list_resize_type.childNodes[1].firstChild.style.visibility = "visible";
      popup_list_resize_type.childNodes[2].firstChild.style.visibility = "hidden";
      popup_list_resize_type.childNodes[3].firstChild.style.visibility = "hidden";
      break;
    case "hug":
      popup_list_resize_type.firstChild.style.display = "none";
      popup_list_resize_type.childNodes[1].firstChild.style.visibility = "hidden";
      popup_list_resize_type.childNodes[2].firstChild.style.visibility = "visible";
      popup_list_resize_type.childNodes[3].firstChild.style.visibility = "hidden";
      break;
    case "fill":
      popup_list_resize_type.firstChild.style.display = "none";
      popup_list_resize_type.childNodes[1].firstChild.style.visibility = "hidden";
      popup_list_resize_type.childNodes[2].firstChild.style.visibility = "hidden";
      popup_list_resize_type.childNodes[3].firstChild.style.visibility = "visible";
      break;
    default:
      popup_list_resize_type.firstChild.style.display = "flex";
      for (var i = 1; i < popup_list_resize_type.childNodes.length; i++) {
        popup_list_resize_type.childNodes[i].firstChild.style.visibility = "hidden";
      }
      break;
  }
}

// create alignment type table UI
function _alignTable(isVertical = true, value) {
  let alignment_type = document.createElement("div");
  alignment_type.className = "layout-align-table";
  alignment_type.setAttribute("oy", isVertical);
  let top_left = _btnAlignType();
  top_left.id = AlignmentType.top_left;
  //
  let top_center = _btnAlignType();
  top_center.id = AlignmentType.top_center;
  //
  let top_right = _btnAlignType();
  top_right.id = AlignmentType.top_right;
  //
  let left_center = _btnAlignType();
  left_center.id = AlignmentType.left_center;
  //
  let center = _btnAlignType();
  center.id = AlignmentType.center;
  //
  let right_center = _btnAlignType();
  right_center.id = AlignmentType.right_center;
  //
  let bottom_left = _btnAlignType();
  bottom_left.id = AlignmentType.bottom_left;
  //
  let bottom_center = _btnAlignType();
  bottom_center.id = AlignmentType.bottom_center;
  //
  let bottom_right = _btnAlignType();
  bottom_right.id = AlignmentType.bottom_right;
  [top_left, top_center, top_right, left_center, center, right_center, bottom_left, bottom_center, bottom_right].forEach((alignBtn) => {
    if (value == alignBtn.id) {
      alignBtn.style.opacity = 1;
    }
    alignment_type.appendChild(alignBtn);
  });
  return alignment_type;
}

function _btnAlignType() {
  let img = document.createElement("img");
  img.className = "layout_btn_align_type";
  img.onclick = function () {
    let list_align_type = document.getElementsByClassName("layout_btn_align_type");
    for (alignType of list_align_type) {
      alignType.style.opacity = 0.05;
    }
    this.style.opacity = 1;
    editLayoutStyle({ Alignment: this.id });
  };
  return img;
}

//! background-color || img
function createEditBackground() {
  let editContainer = document.createElement("div");
  editContainer.id = "edit-background";
  editContainer.style.rowGap = "6px";
  editContainer.className = "edit-container";
  let header = document.createElement("div");
  header.className = "header_design_style";
  editContainer.appendChild(header);

  let title = document.createElement("p");
  let checkedComponent = selected_list.every((wb) => EnumCate.scale_size_component.some((ct) => wb.CateID === ct));
  title.innerHTML = checkedComponent ? "Checked primary color" : "Background";
  header.appendChild(title);

  let btnSelectSkin = createButtonAction("https://cdn.jsdelivr.net/gh/WiniGit/goline@785f3a1/lib/assets/buttonStyle.svg", null, function () {
    let offset = header.getBoundingClientRect();
    createDropdownTableSkin(EnumCate.color, offset);
  });
  btnSelectSkin.className = "action-button bg-header-action";
  let btnSelectImg = document.createElement("i");
  btnSelectImg.className = "fa-regular fa-image fa-sm bg-header-action";
  btnSelectImg.onclick = function () {
    if (!document.getElementById("popup_img_document")) {
      FileDA.init();
    }
  };

  if (selected_list.every((wb) => wb.StyleItem.DecorationItem.ColorValue?.match(hexRegex))) {
    header.appendChild(btnSelectImg);

    let listColorID = selected_list.filterAndMap((wb) => wb.StyleItem.DecorationItem.ColorID);
    if (listColorID.length == 1 && listColorID[0]) {
      let colorSkin = ColorDA.list.find((colorItem) => listColorID[0] == colorItem.GID);
      let cateItem;
      if (colorSkin) {
        if (colorSkin.CateID != EnumCate.color) {
          cateItem = CateDA.list_color_cate.find((e) => e.ID == colorSkin.CateID);
        }
        let skin_tile = wbaseSkinTile(
          EnumCate.color,
          function () {
            let offset = header.getBoundingClientRect();
            createDropdownTableSkin(EnumCate.color, offset, colorSkin.GID);
          },
          function () {
            deleteBackgroundColor().then((_) => updateUIBackground());
          },
        );
        skin_tile.firstChild.firstChild.style.backgroundColor = `#${colorSkin.Value.substring(2)}${colorSkin.Value.substring(0, 2)}`;
        skin_tile.firstChild.lastChild.innerHTML = (cateItem ? `${cateItem.Name}/` : "") + colorSkin.Name;
        editContainer.appendChild(skin_tile);
        if (checkedComponent) skin_tile.lastChild.style.display = "none";
      }
    } else if (selected_list.filterAndMap((wb) => wb.StyleItem.DecorationItem.ColorValue.toLowerCase()).length === 1) {
      let selectColorValue = selected_list[0].StyleItem.DecorationItem.ColorValue;
      //body
      let colorsSelectionList = document.createElement("div");
      colorsSelectionList.id = "colors_selection_list";
      colorsSelectionList.className = "col";
      editContainer.appendChild(colorsSelectionList);
      let listEditColorForm = [];

      if (selectColorValue.split(",").length > 1) {
        for (let colorForm of selectColorValue.split(",")) {
          let formEdit = editColorContainer(colorForm, function (_, onSubmit) {
            let newListColorValue = [...colorsSelectionList.querySelectorAll(".edit-color-container")].map((eHTML) => {
              return Ultis.percentToHex(eHTML.querySelector(".opacity-color-value").value.replace("%", "")) + eHTML.querySelector(".hex-color-value").value;
            });
            editBackground({ ColorValue: newListColorValue.join(",") }, onSubmit).then((_) => {
              if (onSubmit) {
                updateUIBackground();
              }
            });
          });
          formEdit.style.justifyContent = "space-between";
          formEdit.style.marginRight = "8px";
          listEditColorForm.push(formEdit);
        }
      } else {
        function updateColor(onSubmit = true) {
          let newListColorValue = [...colorsSelectionList.querySelectorAll(".parameter-form")].map((eHTML) => {
            return Ultis.percentToHex(eHTML.querySelector(".edit-opacity-form").value.replace("%", "")) + eHTML.querySelector(".edit-color-form").value;
          });
          editBackground({ ColorValue: newListColorValue.join(",") }, onSubmit).then((_) => {
            if (onSubmit) {
              updateUIBackground();
            }
          });
        }
        let formEdit = createEditColorForm(
          function () {
            updateColor(false);
          },
          updateColor,
          function () {
            deleteBackgroundColor().then((_) => updateUIBackground());
          },
        );
        for (let eHTML of formEdit.childNodes) {
          // input type color & edit hex color
          if (eHTML.className.includes("parameter-form")) {
            for (let parameterHTML of eHTML.childNodes) {
              if (parameterHTML.className.includes("show-color-container")) {
                parameterHTML.value = `#${selectColorValue.substring(2)}`;
              } else if (parameterHTML.className.includes("edit-color-form")) {
                parameterHTML.value = selectColorValue.substring(2).toUpperCase();
              } else if (parameterHTML.className.includes("edit-opacity-form")) {
                parameterHTML.value = Ultis.hexToPercent(selectColorValue.substring(0, 2)) + "%";
              }
            }
          }
        }
        listEditColorForm.push(formEdit);
      }
      if (checkedComponent) listEditColorForm.forEach((colorForm) => (colorForm.querySelector(".action-button:last-child").style.display = "none"));
      colorsSelectionList.replaceChildren(...listEditColorForm);
      if (listEditColorForm.length <= 1) {
        header.appendChild(btnSelectSkin);
      }
    } else {
      header.appendChild(btnSelectSkin);
      let notiText = document.createElement("p");
      notiText.className = "regular1";
      notiText.style.margin = "4px 8px";
      notiText.innerHTML = "choose a color skin to replace mixed content";
      editContainer.appendChild(notiText);
    }
  } else if (selected_list.every((wb) => wb.StyleItem.DecorationItem.ColorValue && !wb.StyleItem.DecorationItem.ColorValue.match(hexRegex))) {
    header.appendChild(btnSelectSkin);
    if (selected_list.filterAndMap((wb) => wb.StyleItem.DecorationItem.ColorValue).length === 1) {
      let editImgTile = document.createElement("div");
      editImgTile.id = "select_img_tile";
      editContainer.appendChild(editImgTile);

      let divSelectImg = document.createElement("div");
      editImgTile.appendChild(divSelectImg);

      let imgDemo = document.createElement("div");
      imgDemo.style.backgroundImage = `url(${urlImg + selected_list[0].StyleItem.DecorationItem.ColorValue})`;
      imgDemo.style.backgroundSize = "cover";
      imgDemo.style.backgroundPosition = "center";
      imgDemo.style.backgroundRepeat = "no-repeat";
      imgDemo.style.width = "20px";
      imgDemo.style.height = "16px";
      imgDemo.style.margin = "6px";
      imgDemo.onclick = function () {
        if (document.getElementById("popup_img_document") == undefined) {
          FileDA.init();
        }
      };
      divSelectImg.appendChild(imgDemo);
      let imgName = document.createElement("p");
      imgName.innerHTML = "Image";

      divSelectImg.appendChild(imgName);
      let inputOpacity = document.createElement("input");
      inputOpacity.value = "100%";
      inputOpacity.style.width = "38px";
      inputOpacity.style.minWidth = "0px";
      inputOpacity.style.minWidth = "40px";
      inputOpacity.style.padding = "0 0 0 6px";
      divSelectImg.appendChild(inputOpacity);

      let btnEye = document.createElement("img");
      btnEye.src = "https://cdn.jsdelivr.net/gh/WiniGit/goline@785f3a1/lib/assets/eye-outline.svg";
      btnEye.style.width = "16px";
      btnEye.style.height = "16px";
      btnEye.style.padding = "6px";
      editImgTile.appendChild(btnEye);

      let btnRemoveBgImg = document.createElement("i");
      btnRemoveBgImg.className = "fa-solid fa-minus";
      btnRemoveBgImg.style.padding = "10px 8px";
      editImgTile.appendChild(btnRemoveBgImg);
      btnRemoveBgImg.onclick = function () {
        removeBackgroundImg();
        updateUIBackground();
      };
    } else {
      header.appendChild(btnSelectSkin);
      let notiText = document.createElement("p");
      notiText.className = "regular1";
      notiText.style.margin = "4px 8px";
      notiText.innerHTML = "choose a color skin to replace mixed content";
      editContainer.appendChild(notiText);
    }
  } else {
    header.appendChild(btnSelectSkin);
    header.appendChild(btnSelectImg);
    let btnAdd = document.createElement("i");
    btnAdd.className = "fa-solid fa-plus fa-sm bg-header-action";
    btnAdd.onclick = function () {
      addBackgroundColor();
      updateUIBackground();
    };
    header.appendChild(btnAdd);
  }

  return editContainer;
}

function updateUIBackground() {
  let newEditBackground = createEditBackground();
  document.getElementById("edit-background").replaceWith(newEditBackground);
}

let list_font_family = ["Arial", "Algerian", "Broadway", "Calibri", "Curlz MT", "Castellar", "Freestyle Script", "Inter", "Roboto", "Rubik", "Sanchez", "Single Day"];

let list_font_size = [9.0, 10.0, 11.0, 12.0, 14.0, 15.0, 16.0, 18.0, 19.0, 20.0, 22.0, 24.0, 28.0, 32.0, 36.0, 40.0, 56.0];

let list_font_weight = ["200", "300", "400", "500", "600", "700", "800", "900"];

// ! textStyle
function createEditTextStyle() {
  let listTextStyle = selected_list.filter((e) => e.StyleItem.TextStyleItem);
  let editContainer = document.createElement("div");
  editContainer.id = "edit_text_style";
  editContainer.className = "edit-container";
  let header = document.createElement("div");
  header.id = "edit_text_style_header";
  header.className = "header_design_style";
  editContainer.appendChild(header);
  let title = document.createElement("p");
  title.innerHTML = listTextStyle.every((e) => e.CateID === EnumCate.chart) ? "Chart label" : "Text";
  header.appendChild(title);

  let btnSelectSkin = createButtonAction("https://cdn.jsdelivr.net/gh/WiniGit/goline@785f3a1/lib/assets/buttonStyle.svg", null, function () {
    let offset = header.getBoundingClientRect();
    createDropdownTableSkin(EnumCate.typography, offset);
  });
  btnSelectSkin.className = "action-button";

  let listTypoSkin = listTextStyle.filterAndMap((wbaseItem) => wbaseItem.StyleItem.TextStyleItem.IsStyle);

  if (listTypoSkin.length == 1 && listTypoSkin[0] && listTextStyle.filterAndMap((wbaseItem) => wbaseItem.StyleItem.TextStyleID).length == 1) {
    let typoSkin = listTextStyle[0].StyleItem.TextStyleItem;
    let skin_tile = wbaseSkinTile(
      EnumCate.typography,
      function () {
        let offset = header.getBoundingClientRect();
        createDropdownTableSkin(EnumCate.typography, offset, typoSkin.GID);
      },
      undefined,
    );
    let cateItem = CateDA.list_typo_cate.find((e) => e.ID == typoSkin.CateID);
    skin_tile.firstChild.firstChild.style.fontWeight = typoSkin.FontWeight;
    skin_tile.firstChild.lastChild.firstChild.innerHTML = (cateItem ? `${cateItem.Name}/` : "") + typoSkin.Name;
    skin_tile.firstChild.lastChild.lastChild.innerHTML = ` . ${typoSkin.FontSize}/${typoSkin.Height ?? "auto"}`;
    editContainer.appendChild(skin_tile);
  } else if (listTypoSkin.length > 1 || (listTypoSkin[0] && listTextStyle.filterAndMap((wbaseItem) => wbaseItem.StyleItem.TextStyleID).length > 1)) {
    header.appendChild(btnSelectSkin);
    let notiText = document.createElement("p");
    notiText.className = "regular1";
    notiText.style.margin = "4px 8px";
    notiText.innerHTML = "choose a typogrphy skin to replace mixed content";
    editContainer.appendChild(notiText);
  } else {
    header.appendChild(btnSelectSkin);
    let text_style_attribute = document.createElement("div");
    text_style_attribute.className = "col";
    text_style_attribute.style.width = "100%";
    text_style_attribute.style.boxSizing = "border-box";
    editContainer.appendChild(text_style_attribute);
    function updateTextStyleColor(params, onSubmit = true) {
      editTextStyle({ ColorValue: params }, onSubmit);
      if (onSubmit) {
        updateUITextStyle();
      }
    }
    let edit_text_color = createEditColorForm(
      function (params) {
        updateTextStyleColor(params, false);
      },
      function (params) {
        updateTextStyleColor(params);
      },
    );
    edit_text_color.id = "edit_text_color";
    let colorParamForm = edit_text_color.querySelector(".parameter-form");
    for (let elementHTML of colorParamForm.childNodes) {
      let color_value = listTextStyle[0].StyleItem.TextStyleItem.ColorValue;
      if (elementHTML.className?.includes("show-color-container")) {
        elementHTML.value = `#${color_value.substring(2)}`;
      } else if (elementHTML.className?.includes("edit-color-form")) {
        elementHTML.value = color_value.substring(2);
      } else if (elementHTML.className?.includes("edit-opacity-form")) {
        elementHTML.value = Ultis.hexToPercent(color_value.substring(0, 2)) + "%";
      }
    }
    text_style_attribute.appendChild(edit_text_color);
    // select font-family
    let fontFamilyValues = listTextStyle.filterAndMap((e) => e.StyleItem.TextStyleItem.FontFamily);
    let btn_select_font_family = _btnInputSelect(
      fontFamilyValues.length == 1 ? list_font_family : ["mixed", ...list_font_family],
      function (options) {
        let firstValue = fontFamilyValues[0];
        if (fontFamilyValues.length > 1) {
          firstValue = "mixed";
        }
        for (let option of options) {
          if (firstValue == option.getAttribute("value")) {
            option.firstChild.style.opacity = 1;
          } else {
            option.firstChild.style.opacity = 0;
          }
        }
      },
      function (option) {
        let newFontFamily = list_font_family.find((e) => e.toLowerCase() == option.toLowerCase());
        if (newFontFamily) {
          editTextStyle({ FontFamily: newFontFamily });
        }
        updateUITextStyle();
      },
    );
    btn_select_font_family.firstChild.value = fontFamilyValues.length == 1 ? fontFamilyValues[0] : "mixed";
    btn_select_font_family.style.marginTop = "8px";
    btn_select_font_family.style.marginBottom = "8px";
    text_style_attribute.appendChild(btn_select_font_family);
    //
    let div_font_size_weight = document.createElement("div");
    div_font_size_weight.className = "row";
    div_font_size_weight.style.width = "100%";
    div_font_size_weight.style.boxSizing = "border-box";
    text_style_attribute.appendChild(div_font_size_weight);
    // select font-weight
    let fWeightValues = listTextStyle.filterAndMap((wbaseItem) => wbaseItem.StyleItem.TextStyleItem.FontWeight);
    let btn_select_font_weight = _btnDropDownSelect(
      fWeightValues.length == 1 ? list_font_weight : ["mixed", ...list_font_weight],
      function (options) {
        let firstFWeight = fWeightValues[0];
        if (fWeightValues.length > 1) {
          firstFWeight = "mixed";
        }
        for (let option of options) {
          if (option.getAttribute("value") == firstFWeight) {
            option.firstChild.style.opacity = 1;
          } else {
            option.firstChild.style.opacity = 0;
          }
        }
      },
      function (value) {
        editTextStyle({ FontWeight: value });
        updateUITextStyle();
      },
    );
    btn_select_font_weight.firstChild.innerHTML = fWeightValues.length == 1 ? fWeightValues[0] : "mixed";
    div_font_size_weight.appendChild(btn_select_font_weight);
    // select font-size
    let fSizeValues = listTextStyle.filterAndMap((wbaseItem) => wbaseItem.StyleItem.TextStyleItem.FontSize);
    let btn_select_font_size = _btnInputSelect(
      fSizeValues.length == 1 ? list_font_size : ["mixed", ...list_font_size],
      function (options) {
        let firstValue = fSizeValues[0];
        if (fSizeValues.length > 1) {
          firstValue = "mixed";
        }
        for (let option of options) {
          if (firstValue == option.getAttribute("value")) {
            option.firstChild.style.opacity = 1;
          } else {
            option.firstChild.style.opacity = 0;
          }
        }
      },
      function (option) {
        if (!isNaN(parseFloat(option))) {
          editTextStyle({ FontSize: parseFloat(option) });
          updateUITextStyle();
        }
      },
      true,
    );
    btn_select_font_size.firstChild.value = fSizeValues.length == 1 ? fSizeValues[0] : "mixed";
    btn_select_font_size.style.flex = 1;
    div_font_size_weight.appendChild(btn_select_font_size);
    if (listTextStyle.some((e) => e.CateID !== EnumCate.chart)) {
      // row contain edit line-height & letter spacing
      let div_height_spacing = document.createElement("div");
      div_height_spacing.className = "row";
      div_height_spacing.style.width = "100%";
      div_height_spacing.style.boxSizing = "border-box";
      div_height_spacing.style.padding = "8px 4px 0 0";
      text_style_attribute.appendChild(div_height_spacing);
      // input line-height
      let lineHeightValues = listTextStyle.filterAndMap((wbaseItem) => wbaseItem.StyleItem.TextStyleItem.Height);
      let input_line_height = _textField("100%", "https://cdn.jsdelivr.net/gh/WiniGit/goline@785f3a1/lib/assets/line-height.svg", undefined, lineHeightValues.length == 1 ? (lineHeightValues[0] == null ? "Auto" : lineHeightValues[0]) : "mixed", "25px");
      input_line_height.style.flex = 1;
      input_line_height.style.marginRight = "8px";
      input_line_height.lastChild.onblur = function () {
        if (this.value.toLowerCase() == "auto") {
          editTextStyle({ Height: this.value });
        } else if (!isNaN(parseFloat(this.value))) {
          editTextStyle({ Height: parseFloat(this.value) });
        }
        updateUITextStyle();
        updateInputTLWH();
      };
      div_height_spacing.appendChild(input_line_height);
      // input letter spacing
      let lSpacingValues = listTextStyle.filterAndMap((wbaseItem) => wbaseItem.StyleItem.TextStyleItem.LetterSpacing);
      let input_letter_spacing = _textField("100%", "https://cdn.jsdelivr.net/gh/WiniGit/goline@785f3a1/lib/assets/letter-spacing.svg", undefined, lSpacingValues.length == 1 ? lSpacingValues[0] : "mixed", "28px");
      input_letter_spacing.style.flex = 1;
      input_letter_spacing.lastChild.onblur = function () {
        if (!isNaN(parseFloat(this.value))) {
          editTextStyle({ LetterSpacing: parseFloat(this.value) });
        }
        updateUITextStyle();
      };
      div_height_spacing.appendChild(input_letter_spacing);
    }
  }
  if (listTextStyle.some((e) => e.CateID !== EnumCate.chart)) {
    // group btn select text auto size
    let group_btn_auto_size = _groupBtnSelect(
      [
        {
          attribute: TextAutoSize.autoWidth,
          src: "https://cdn.jsdelivr.net/gh/WiniGit/goline@785f3a1/lib/assets/auto-width.svg",
        },
        {
          attribute: TextAutoSize.autoHeight,
          src: "https://cdn.jsdelivr.net/gh/WiniGit/goline@785f3a1/lib/assets/auto-height.svg",
        },
        {
          attribute: TextAutoSize.fixedSize,
          src: "https://cdn.jsdelivr.net/gh/WiniGit/goline@785f3a1/lib/assets/fixed-size.svg",
        },
      ],
      function (value) {
        editTextStyle({ AutoSize: value });
        updateInputTLWH();
        updateUITextStyle();
        updateUIConstraints();
        updateUISelectBox();
      },
    );
    group_btn_auto_size.id = "group_btn_text_auto_size";
    group_btn_auto_size.style.margin = "8px";
    updateUIAutoSizeWH(group_btn_auto_size);
    editContainer.appendChild(group_btn_auto_size);
    let _row = document.createElement("div");
    _row.className = "row";
    _row.style.padding = "0 8px 8px 8px";
    editContainer.appendChild(_row);
    // group btn select text align
    let textAlignValues = listTextStyle.filterAndMap((wbaseItem) => wbaseItem.StyleItem.TypoStyleItem.TextAlign.replace("TextAlign.", ""));
    let group_btn_text_align = _groupBtnSelect(
      [
        {
          attribute: TextAlign.left,
          src: "https://cdn.jsdelivr.net/gh/WiniGit/goline@785f3a1/lib/assets/text-align-left.svg",
        },
        {
          attribute: TextAlign.center,
          src: "https://cdn.jsdelivr.net/gh/WiniGit/goline@785f3a1/lib/assets/text-align-center.svg",
        },
        {
          attribute: TextAlign.right,
          src: "https://cdn.jsdelivr.net/gh/WiniGit/goline@785f3a1/lib/assets/text-align-right.svg",
        },
      ],
      function (value) {
        editTextStyle({ TextAlign: value });
        updateUITextStyle();
      },
    );
    let firstTextAlign = textAlignValues.length == 1 ? textAlignValues[0] : "mixed";
    for (let alignOption of group_btn_text_align.childNodes) {
      if (alignOption.getAttribute("value") == firstTextAlign) {
        alignOption.style.backgroundColor = "#e5e5e5";
      } else {
        alignOption.style.backgroundColor = "transparent";
      }
    }
    _row.appendChild(group_btn_text_align);
    // group btn select text align vertical
    let alignVerticalValues = listTextStyle.filterAndMap((wbaseItem) => wbaseItem.StyleItem.TypoStyleItem.TextAlignVertical);
    let group_btn_text_align_vertical = _groupBtnSelect(
      [
        {
          attribute: TextAlignVertical.top,
          src: "https://cdn.jsdelivr.net/gh/WiniGit/goline@785f3a1/lib/assets/text-align-vertical-top.svg",
        },
        {
          attribute: TextAlignVertical.middle,
          src: "https://cdn.jsdelivr.net/gh/WiniGit/goline@785f3a1/lib/assets/text-align-vertical-center.svg",
        },
        {
          attribute: TextAlignVertical.bottom,
          src: "https://cdn.jsdelivr.net/gh/WiniGit/goline@785f3a1/lib/assets/text-align-vertical-bottom.svg",
        },
      ],
      function (value) {
        editTextStyle({ TextAlignVertical: value });
        updateUITextStyle();
      },
    );
    group_btn_text_align_vertical.style.marginLeft = "42px";
    let firstTextAlignVertical = alignVerticalValues.length == 1 ? alignVerticalValues[0] : "mixed";
    for (let alginVerticalOption of group_btn_text_align_vertical.childNodes) {
      if (alginVerticalOption.getAttribute("value") == firstTextAlignVertical) {
        alginVerticalOption.style.backgroundColor = "#e5e5e5";
      } else {
        alginVerticalOption.style.backgroundColor = "transparent";
      }
    }
    _row.appendChild(group_btn_text_align_vertical);
  }
  return editContainer;
}

function _groupBtnSelect(list_icon, func) {
  let group_btn_select = document.createElement("div");
  group_btn_select.className = "group_btn_select";
  var i;
  for (i = 0; i < list_icon.length; i++) {
    let option = document.createElement("img");
    option.src = list_icon[i].src;
    option.setAttribute("value", list_icon[i].attribute);
    option.style.width = "24px";
    option.style.height = "24px";
    option.onclick = function () {
      func(this.getAttribute("value"));
    };
    group_btn_select.appendChild(option);
  }
  return group_btn_select;
}

function updateUITextStyle() {
  let newEditTextStyle = createEditTextStyle();
  document.getElementById("edit_text_style").replaceWith(newEditTextStyle);
}

function updateUIAutoSizeWH(groupBtn) {
  let group_btn_auto_size = groupBtn ?? document.getElementById("group_btn_text_auto_size");
  let select_list_auto_size = selected_list
    .filter((e) => e.StyleItem.TextStyleItem)
    .map((e) => {
      if (e.StyleItem.FrameItem.Width == undefined) {
        return TextAutoSize.autoWidth;
      } else if (e.StyleItem.FrameItem.Width != undefined && e.StyleItem.FrameItem.Height == undefined) {
        return TextAutoSize.autoHeight;
      } else {
        return TextAutoSize.fixedSize;
      }
    });
  let firstAutoSize = select_list_auto_size[0];
  if (select_list_auto_size.some((e) => e != firstAutoSize)) {
    firstAutoSize = "mixed";
  }
  if (group_btn_auto_size) {
    for (let autoSizeOption of group_btn_auto_size.childNodes) {
      if (autoSizeOption.getAttribute("value") == firstAutoSize) {
        autoSizeOption.style.backgroundColor = "#e5e5e5";
      } else {
        autoSizeOption.style.backgroundColor = "transparent";
      }
    }
  }
}

function _btnInputSelect(list = [], func_on_show_popup, onclick, acceptAll = false) {
  let btn_select = document.createElement("div");
  btn_select.className = "btn_input_select";
  let input = document.createElement("input");
  let inputValue = "";
  input.onfocus = function () {
    inputValue = this.value;
    this.setSelectionRange(0, this.value.length);
    btn_icon_down.style.display = "block";
  };
  input.onblur = function () {
    // func edit font family
    btn_icon_down.style.display = "none";
    if (acceptAll) {
      onclick(this.value);
    } else {
      if (list.filter((vl) => vl != "mixed").some((vl) => vl.toString().toLowerCase() === input.value.toLowerCase())) {
        onclick(list.find((vl) => vl.toLowerCase() === input.value.toLowerCase()));
      } else {
        this.value = inputValue;
      }
    }
  };
  btn_select.appendChild(input);
  let btn_icon_down = document.createElement("i");
  btn_icon_down.className = "fa-solid fa-chevron-down fa-xs";
  btn_icon_down.onclick = function () {
    setTimeout(function () {
      document
        .getElementById("body")
        .querySelectorAll(":scope > .popup_select")
        .forEach((popup) => popup.remove());
      let popup_select = document.createElement("div");
      let popupOffset = btn_select.getBoundingClientRect();
      popup_select.className = "popup_select col wini_popup popup_remove";
      popup_select.style.left = popupOffset.x + "px";
      popup_select.style.top = popupOffset.y + "px";
      popup_select.style.width = btn_select.offsetWidth + "px";
      for (let i = 0; i < list.length; i++) {
        let option = document.createElement("div");
        if (list[i] != "mixed")
          option.onclick = function (e) {
            e.stopPropagation();
            onclick(this.getAttribute("value"));
            popup_select.style.display = "none";
          };
        option.setAttribute("value", list[i]);
        let icon_check = document.createElement("i");
        icon_check.className = "fa-solid fa-check";
        icon_check.style.boxSizing = "border-box";
        icon_check.style.color = "#ffffff";
        icon_check.style.marginRight = "8px";
        option.appendChild(icon_check);
        let title = document.createElement("span");
        title.innerHTML = list[i];
        title.style.fontSize = "14px";
        title.style.fontWeight = "600";
        title.style.color = "#ffffff";
        option.appendChild(title);
        popup_select.appendChild(option);
      }
      document.getElementById("body").appendChild(popup_select);
      func_on_show_popup([...popup_select.childNodes]);
      if (popup_select.getBoundingClientRect().bottom > document.body.offsetHeight) {
        popup_select.style.height = `${document.body.offsetHeight - popup_select.getBoundingClientRect().top}px`;
        popup_select.style.overflowY = "scroll";
      }
    }, 200);
  };
  btn_select.appendChild(btn_icon_down);
  return btn_select;
}

function _btnDropDownSelect(list = [], func_on_show_popup, onclick) {
  let isString = typeof list[0] === "string";
  let btnDropDownSelect = document.createElement("div");
  btnDropDownSelect.className = "btn_dropdown_select";
  let title = document.createElement("span");
  title.innerHTML = "bold";
  btnDropDownSelect.appendChild(title);
  let icon_down = document.createElement("img");
  icon_down.src = "https://cdn.jsdelivr.net/gh/WiniGit/goline@785f3a1/lib/assets/down_black.svg";
  btnDropDownSelect.appendChild(icon_down);

  btnDropDownSelect.onclick = function () {
    setTimeout(function () {
      document
        .getElementById("body")
        .querySelectorAll(":scope > .popup_select")
        .forEach((popup) => popup.remove());
      let popupOffset = btnDropDownSelect.getBoundingClientRect();
      let popup_select_option = document.createElement("div");
      popup_select_option.className = "popup_select col wini_popup popup_remove";
      popup_select_option.style.left = popupOffset.x + "px";
      popup_select_option.style.top = popupOffset.y + "px";
      popup_select_option.style.width = btnDropDownSelect.offsetWidth + "px";
      for (let i = 0; i < list.length; i++) {
        let option = document.createElement("div");
        if (isString ? list[i] != "mixed" : list[i].value != "mixed")
          option.onclick = function (e) {
            e.stopPropagation();
            popup_select_option.style.display = "none";
            onclick(this.getAttribute("value"));
          };
        option.setAttribute("value", isString ? list[i] : list[i].value);
        let icon_check = document.createElement("i");
        icon_check.className = "fa-solid fa-check";
        icon_check.style.boxSizing = "border-box";
        icon_check.style.color = "#ffffff";
        icon_check.style.marginRight = "8px";
        option.appendChild(icon_check);
        let title = document.createElement("span");
        title.innerHTML = isString ? list[i] : list[i].title;
        title.style.fontSize = "14px";
        title.style.fontWeight = "600";
        title.style.color = "#ffffff";
        option.appendChild(title);
        popup_select_option.appendChild(option);
      }
      document.getElementById("body").appendChild(popup_select_option);
      func_on_show_popup([...popup_select_option.childNodes]);
      popup_select_option.style.display = "flex";
    }, 200);
  };
  return btnDropDownSelect;
}

let list_border_style = [BorderStyle.dashed, BorderStyle.dotted, BorderStyle.double, BorderStyle.groove, BorderStyle.inset, BorderStyle.solid];

//! border
function createEditBorder() {
  let listBorder = selected_list.filter((wb) => wb.StyleItem.DecorationItem);
  let editContainer = document.createElement("div");
  editContainer.id = "edit-border";
  editContainer.className = "edit-container";

  let header = document.createElement("div");
  header.className = "header_design_style";
  editContainer.appendChild(header);

  let title = document.createElement("p");
  title.innerHTML = "Border";
  header.appendChild(title);

  let btnSelectSkin = createButtonAction("https://cdn.jsdelivr.net/gh/WiniGit/goline@785f3a1/lib/assets/buttonStyle.svg", null, function () {
    let offset = header.getBoundingClientRect();
    createDropdownTableSkin(EnumCate.border, offset);
  });
  btnSelectSkin.className = "action-button";
  //
  let listBorderSkin = listBorder.filterAndMap((wbaseItem) => wbaseItem.StyleItem.DecorationItem.BorderItem?.IsStyle);
  if (listBorderSkin.length == 1 && listBorderSkin[0] && listBorder.filterAndMap((wbaseItem) => wbaseItem.StyleItem.DecorationItem.BorderID).length == 1) {
    let borderItem = listBorder[0].StyleItem.DecorationItem.BorderItem;
    let cateItem = CateDA.list_border_cate.find((e) => e.ID == borderItem.CateID);
    let skin_tile = wbaseSkinTile(
      EnumCate.border,
      function () {
        let offset = header.getBoundingClientRect();
        createDropdownTableSkin(EnumCate.border, offset, borderItem.GID);
      },
      function () {
        deleteBorder();
        updateUIBorder();
      },
    );
    skin_tile.firstChild.firstChild.style.backgroundColor = `#${borderItem.ColorValue.substring(2)}${borderItem.ColorValue.substring(0, 2)}`;
    skin_tile.firstChild.lastChild.innerHTML = (cateItem ? `${cateItem.Name}/` : "") + borderItem.Name;
    editContainer.appendChild(skin_tile);
  } else if (listBorderSkin.length > 1 || (listBorderSkin[0] && listBorder.filterAndMap((wbaseItem) => wbaseItem.StyleItem.DecorationItem.BorderID).length > 1)) {
    header.appendChild(btnSelectSkin);
    let notiText = document.createElement("span");
    notiText.className = "regular1";
    notiText.style.margin = "4px 8px";
    notiText.innerHTML = "Choose a border skin to replace mixed content";
    editContainer.appendChild(notiText);
  } else {
    header.appendChild(btnSelectSkin);
    if (listBorder.some((wbaseItem) => !wbaseItem.StyleItem.DecorationItem.BorderItem)) {
      let btnAdd = document.createElement("i");
      btnAdd.className = "fa-solid fa-plus fa-sm";
      btnAdd.onclick = function () {
        addBorder();
        updateUIBorder();
      };
      header.appendChild(btnAdd);
    } else {
      let borderColorValues = listBorder.filterAndMap((e) => e.StyleItem.DecorationItem.BorderItem?.ColorValue?.toLowerCase());
      if (borderColorValues.length == 1) {
        let colorValue = borderColorValues[0];
        function updateBorderColor(params, onSubmit = true) {
          editBorder({ ColorValue: params }, onSubmit);
          if (onSubmit) {
            updateUIBorder();
          }
        }
        let formEditColor = createEditColorForm(
          function (params) {
            updateBorderColor(params, false);
          },
          function (params) {
            updateBorderColor(params);
          },
          function () {
            deleteBorder();
            updateUIBorder();
          },
        );
        editContainer.appendChild(formEditColor);
        let paramForm = formEditColor.querySelector(".parameter-form");
        // input type color & edit hex color
        for (let parameterHTML of paramForm.childNodes) {
          if (parameterHTML.className.includes("show-color-container")) {
            parameterHTML.value = `#${colorValue.substring(2)}`;
          } else if (parameterHTML.className.includes("edit-color-form")) {
            parameterHTML.value = colorValue.substring(2).toUpperCase();
          } else if (parameterHTML.className.includes("edit-opacity-form")) {
            parameterHTML.value = Ultis.hexToPercent(colorValue.substring(0, 2)) + "%";
          }
        }
      }

      let formEditLine = document.createElement("div");
      formEditLine.id = "form-edit-style";
      formEditLine.className = "row";
      formEditLine.style.paddingLeft = "4px";
      formEditLine.style.justifyContent = "space-between";
      editContainer.appendChild(formEditLine);
      let borderStyles = listBorder.filterAndMap((e) => e.StyleItem.DecorationItem.BorderItem?.BorderStyle);
      let btnSelectStyle = _btnDropDownSelect(
        borderStyles.length == 1 ? list_border_style : ["mixed", ...list_border_style],
        function (options) {
          let firstStyle = borderStyles[0];
          for (let option of options) {
            let style = option.getAttribute("value");
            option.firstChild.style.opacity = style == firstStyle ? 1 : 0;
          }
        },
        function (value) {
          editBorder({ BorderStyle: value });
          updateUIBorder();
        },
      );
      btnSelectStyle.firstChild.innerHTML = borderStyles.length == 1 ? borderStyles[0] : "mixed";
      formEditLine.appendChild(btnSelectStyle);
      //
      let widthValues = listBorder.filterAndMap((e) => {
        let eListWidth = e.StyleItem.DecorationItem.BorderItem.Width.split(" ");
        switch (e.StyleItem.DecorationItem.BorderItem.BorderSide) {
          case BorderSide.top:
            return eListWidth[0];
          case BorderSide.right:
            return eListWidth[1];
          case BorderSide.bottom:
            return eListWidth[2];
          case BorderSide.left:
            return eListWidth[3];
          default:
            if (eListWidth.every((value) => value == eListWidth[0])) {
              return eListWidth[0];
            } else {
              return "mixed";
            }
        }
      });
      let edit_stroke_width = _textField("60px", "https://cdn.jsdelivr.net/gh/WiniGit/goline@785f3a1/lib/assets/stroke-width.svg", undefined, widthValues.length == 1 ? widthValues[0] : "mixed", "28px");
      edit_stroke_width.lastChild.onblur = function () {
        let newValue = parseFloat(this.value);
        if (newValue != undefined) {
          switch (firstSideValue) {
            case BorderSide.top:
              editBorder({ TopWidth: this.value });
              input_border_top.value = this.value;
              break;
            case BorderSide.right:
              editBorder({ RightWidth: this.value });
              input_border_right.value = this.value;
              break;
            case BorderSide.bottom:
              editBorder({ BottomWidth: this.value });
              input_border_bottom.value = this.value;
              break;
            case BorderSide.left:
              editBorder({ LeftWidth: this.value });
              input_border_left.value = this.value;
              break;
            default:
              editBorder({ Width: this.value });
              [input_border_left, input_border_top, input_border_right, input_border_bottom].forEach((_input) => (_input.value = this.value));
              break;
          }
        } else {
          let thisWidthValues = [input_border_left, input_border_top, input_border_right, input_border_bottom].filterAndMap((_input) => _input.value);
          this.value = thisWidthValues.length == 1 ? thisWidthValues[0] : "mixed";
        }
      };
      formEditLine.appendChild(edit_stroke_width);

      let action_edit_line_container = document.createElement("div");
      action_edit_line_container.className = "action-container";
      formEditLine.appendChild(action_edit_line_container);

      let sideValues = listBorder.filterAndMap((e) => e.StyleItem.DecorationItem.BorderItem.BorderSide);
      let btnSelectBorderSide = createButtonAction("https://cdn.jsdelivr.net/gh/WiniGit/goline@785f3a1/lib/assets/border-all-black.svg", null, function () {
        dropdown_type.style.display = "flex";
        dropdown_type.childNodes[0].style.display = "none";
        let list_border_side = selected_list.filter((e) => e.StyleItem.DecorationItem?.BorderItem).map((e) => e.StyleItem.DecorationItem.BorderItem.BorderSide);
        if (list_border_side.every((side) => side == list_border_side[0])) {
          for (let i = 1; i < dropdown_type.childNodes.length; i++) {
            let type = dropdown_type.childNodes[i].getAttribute("type");
            dropdown_type.childNodes[i].firstChild.style.opacity = type == list_border_side[0] ? 1 : 0;
          }
        } else {
          dropdown_type.childNodes[0].style.display = "flex";
          for (let i = 0; i < dropdown_type.childNodes.length; i++) {
            let type = dropdown_type.childNodes[i].getAttribute("type");
            dropdown_type.childNodes[i].firstChild.style.opacity = type == "mixed" ? 1 : 0;
          }
        }
      });
      btnSelectBorderSide.className = "action-button";
      action_edit_line_container.appendChild(btnSelectBorderSide);

      let dropdown_type = selectBorderSide("All", function (value) {
        if (selected_list.every((wbaseItem) => EnumCate.scale_size_component.every((cate) => wbaseItem.CateID !== cate))) editBorder({ BorderSide: value });
        updateUIBorder();
      });
      btnSelectBorderSide.appendChild(dropdown_type);

      let edit_line_action2 = createButtonAction("https://cdn.jsdelivr.net/gh/WiniGit/goline@785f3a1/lib/assets/more-horizontal.svg", null, function () { });
      edit_line_action2.className = "action-button";
      action_edit_line_container.appendChild(edit_line_action2);

      let group_custom_border_side = document.createElement("div");
      editContainer.appendChild(group_custom_border_side);
      group_custom_border_side.id = "group_input_edit_border_side";
      group_custom_border_side.className = "group_input_border_side";
      let input_border_left = _textField("88px", "https://cdn.jsdelivr.net/gh/WiniGit/goline@785f3a1/lib/assets/border-left-black.svg", undefined, "0", "36px");
      input_border_left.id = "input_border_left";
      input_border_left.style.display = "flex";
      input_border_left.style.marginLeft = "8px";
      input_border_left.lastChild.onblur = function () {
        let left_width_value = parseFloat(this.value);
        if (!isNaN(left_width_value)) {
          editBorder({ LeftWidth: this.value });
        }
        updateUIBorder();
      };
      group_custom_border_side.appendChild(input_border_left);
      var input_border_top = _textField("88px", "https://cdn.jsdelivr.net/gh/WiniGit/goline@785f3a1/lib/assets/border-top-black.svg", undefined, "0", "36px");
      input_border_top.id = "input_border_top";
      input_border_top.style.display = "flex";
      input_border_top.style.marginRight = "35px";
      input_border_top.lastChild.onblur = function () {
        let top_width_value = parseFloat(this.value);
        if (!isNaN(top_width_value)) {
          editBorder({ TopWidth: this.value });
        }
        updateUIBorder();
      };
      group_custom_border_side.appendChild(input_border_top);
      var input_border_right = _textField("88px", "https://cdn.jsdelivr.net/gh/WiniGit/goline@785f3a1/lib/assets/border-right-black.svg", undefined, "0", "36px");
      input_border_right.id = "input_border_right";
      input_border_right.style.display = "flex";
      input_border_right.style.marginLeft = "8px";
      input_border_right.lastChild.onblur = function () {
        let right_width_value = parseFloat(this.value);
        if (!isNaN(right_width_value)) {
          editBorder({ RightWidth: this.value });
        }
        updateUIBorder();
      };
      group_custom_border_side.appendChild(input_border_right);
      var input_border_bottom = _textField("88px", "https://cdn.jsdelivr.net/gh/WiniGit/goline@785f3a1/lib/assets/border-bottom-black.svg", undefined, "0", "36px");
      input_border_bottom.id = "input_border_bottom";
      input_border_bottom.style.marginRight = "35px";
      input_border_bottom.style.display = "flex";
      input_border_bottom.lastChild.onblur = function () {
        let bottom_width_value = parseFloat(this.value);
        if (!isNaN(bottom_width_value)) {
          editBorder({ BottomWidth: this.value });
        }
        updateUIBorder();
      };
      group_custom_border_side.appendChild(input_border_bottom);
      let firstSideValue = sideValues.length == 1 ? sideValues[0] : "mixed";
      if (firstSideValue == BorderSide.custom) {
        group_custom_border_side.style.display = "flex";
        btnSelectBorderSide.firstChild.src = `https://cdn.jsdelivr.net/gh/WiniGit/goline@785f3a1/lib/assets/border-all-black.svg`;
        for (let j = 0; j < group_custom_border_side.childNodes.length; j++) {
          let list_width = [];
          let inputValue;
          switch (j) {
            case 0:
              // case edit left border width
              list_width = listBorder.map((e) => e.StyleItem.DecorationItem.BorderItem.Width.split(" ").pop());
              inputValue = list_width[0];
              if (list_width.some((e) => e != inputValue)) {
                inputValue = "mixed";
              }
              break;
            case 1:
              // case edit top border width
              list_width = listBorder.map((e) => e.StyleItem.DecorationItem.BorderItem.Width.split(" ").shift());
              inputValue = list_width[0];
              if (list_width.some((e) => e != inputValue)) {
                inputValue = "mixed";
              }
              break;
            case 2:
              // case edit right border width
              list_width = listBorder.map((e) => e.StyleItem.DecorationItem.BorderItem.Width.split(" ")[1]);
              inputValue = list_width[0];
              if (list_width.some((e) => e != inputValue)) {
                inputValue = "mixed";
              }
              break;
            case 3:
              // case edit bottom border width
              list_width = listBorder.map((e) => e.StyleItem.DecorationItem.BorderItem.Width.split(" ")[2]);
              inputValue = list_width[0];
              if (list_width.some((e) => e != inputValue)) {
                inputValue = "mixed";
              }
              break;
            default:
              break;
          }
          let inputForm = group_custom_border_side.childNodes[j];
          inputForm.lastChild.value = inputValue;
        }
      } else {
        group_custom_border_side.style.display = "none";
        btnSelectBorderSide.firstChild.src = `https://cdn.jsdelivr.net/gh/WiniGit/goline@785f3a1/lib/assets/border-${firstSideValue.toLowerCase()}-black.svg`;
      }
    }
  }
  return editContainer;
}

function updateUIBorder() {
  let newEditBorder = createEditBorder();
  document.getElementById("edit-border").replaceWith(newEditBorder);
}

let list_effect_type = [ShadowType.inner, ShadowType.dropdown, ShadowType.layer_blur];
// ! effect
function createEditEffect() {
  let listEffect = selected_list.filter((wbaseItem) => wbaseItem.StyleItem.DecorationItem);
  let editContainer = document.createElement("div");
  editContainer.id = "edit-effect";
  editContainer.className = "edit-container";

  let header = document.createElement("div");
  header.className = "header_design_style";
  editContainer.appendChild(header);

  let title = document.createElement("p");
  title.innerHTML = "Effect";
  header.appendChild(title);

  let btnSelectSkin = createButtonAction("https://cdn.jsdelivr.net/gh/WiniGit/goline@785f3a1/lib/assets/buttonStyle.svg", null, function () {
    let offset = header.getBoundingClientRect();
    createDropdownTableSkin(EnumCate.effect, offset);
  });
  btnSelectSkin.className = "action-button";
  //
  let listEffectSkin = listEffect.filterAndMap((wbaseItem) => wbaseItem.StyleItem.DecorationItem.EffectItem?.IsStyle);
  if (listEffectSkin.length == 1 && listEffectSkin[0] && listEffect.filterAndMap((wbaseItem) => wbaseItem.StyleItem.DecorationItem.EffectID).length == 1) {
    let effectItem = listEffect[0].StyleItem.DecorationItem.EffectItem;
    let cateItem = CateDA.list_effect_cate.find((e) => e.ID == effectItem.CateID);
    let skin_tile = wbaseSkinTile(
      EnumCate.effect,
      function () {
        let offset = header.getBoundingClientRect();
        createDropdownTableSkin(EnumCate.effect, offset, effectItem.GID);
      },
      function () {
        deleteEffect();
        updateUIEffect();
      },
    );
    skin_tile.firstChild.lastChild.innerHTML = (cateItem ? `${cateItem.Name}/` : "") + effectItem.Name;
    editContainer.appendChild(skin_tile);
  } else if (listEffectSkin.length > 1 || (listEffectSkin[0] && listEffect.filterAndMap((wbaseItem) => wbaseItem.StyleItem.DecorationItem.EffectID).length > 1)) {
    header.appendChild(btnSelectSkin);
    let notiText = document.createElement("span");
    notiText.className = "regular1";
    notiText.style.margin = "4px 8px";
    notiText.innerHTML = "Choose a effect skin to replace mixed content";
    editContainer.appendChild(notiText);
  } else {
    header.appendChild(btnSelectSkin);
    if (listEffect.every((wbaseItem) => !wbaseItem.StyleItem.DecorationItem.EffectItem)) {
      let btnAdd = document.createElement("i");
      btnAdd.className = "fa-solid fa-plus fa-sm";
      btnAdd.onclick = function () {
        addEffect();
        updateUIEffect();
      };
      header.appendChild(btnAdd);
    } else {
      let div_select_eType = document.createElement("div");
      div_select_eType.id = "edit_effect_type_attribute";
      div_select_eType.className = "row";
      div_select_eType.style.width = "100%";
      editContainer.appendChild(div_select_eType);
      // popup edit effect type attribute
      let effect_setting = createButtonAction("https://cdn.jsdelivr.net/gh/WiniGit/goline@785f3a1/lib/assets/effect-settings.svg", null, function () {
        setTimeout(function () {
          updateUIEffectAttribute();
        }, 200);
      });
      function updateUIEffectAttribute() {
        let list_effect = selected_list.filter((e) => e.StyleItem.DecorationItem?.EffectItem).map((e) => e.StyleItem.DecorationItem.EffectItem);
        let this_effect_type = list_effect[0].Type;
        if (list_effect.every((e) => e.Type == this_effect_type)) {
          popup_edit_effect_style.style.display = "flex";
          popup_edit_effect_style.firstChild.innerHTML = this_effect_type;
          for (let i = 0; i < popup_edit_effect_style.lastChild.childNodes.length; i++) {
            let eHTML = popup_edit_effect_style.lastChild.childNodes[i];
            switch (i) {
              // input offsetX
              case 0:
                if (this_effect_type == ShadowType.layer_blur) {
                  eHTML.style.display = "none";
                } else {
                  eHTML.style.display = "flex";
                  let list_offsetX = list_effect.map((e) => e.OffsetX);
                  let firstValue = list_offsetX[0];
                  if (list_offsetX.some((e) => e != firstValue)) {
                    firstValue = "mixed";
                  }
                  eHTML.lastChild.value = firstValue;
                }
                break;
              // input blur
              case 1:
                eHTML.style.display = "flex";
                let list_blur = list_effect.map((e) => e.BlurRadius);
                let firstBlurValue = list_blur[0];
                if (list_blur.some((e) => e != firstBlurValue)) {
                  firstBlurValue = "mixed";
                }
                eHTML.lastChild.value = firstBlurValue;
                break;
              // input offsetY
              case 2:
                if (this_effect_type == ShadowType.layer_blur) {
                  eHTML.style.display = "none";
                } else {
                  eHTML.style.display = "flex";
                  let list_offsetY = list_effect.map((e) => e.OffsetY);
                  let firstValue = list_offsetY[0];
                  if (list_offsetY.some((e) => e != firstValue)) {
                    firstValue = "mixed";
                  }
                  eHTML.lastChild.value = firstValue;
                }
                break;
              // input spread
              case 3:
                if (this_effect_type == ShadowType.layer_blur) {
                  eHTML.style.display = "none";
                } else {
                  eHTML.style.display = "flex";
                  let list_spread = list_effect.map((e) => e.SpreadRadius);
                  let firstValue = list_spread[0];
                  if (list_spread.some((e) => e != firstValue)) {
                    firstValue = "mixed";
                  }
                  eHTML.lastChild.value = firstValue;
                }
                break;
              // input colorvalue
              case 4:
                if (list_effect.every((e) => e.ColorValue == list_effect[0].ColorValue)) {
                  eHTML.style.display = "flex";
                  let color_value = list_effect[0].ColorValue;
                  for (let parameterHTML of eHTML.querySelector(".parameter-form").childNodes) {
                    // input type color & edit hex color
                    if (parameterHTML.className.includes("show-color-container")) {
                      parameterHTML.value = `#${color_value.substring(2)}`;
                    } else if (parameterHTML.className.includes("edit-color-form")) {
                      parameterHTML.value = color_value.substring(2).toUpperCase();
                    } else if (parameterHTML.className.includes("edit-opacity-form")) {
                      parameterHTML.value = Ultis.hexToPercent(color_value.substring(0, 2)) + "%";
                    }
                  }
                } else {
                  eHTML.style.display = "none";
                }
                break;
              default:
                break;
            }
          }
        }
      }
      effect_setting.className = "action-button";
      effect_setting.style.overflow = "visible";
      effect_setting.style.position = "relative";
      div_select_eType.appendChild(effect_setting);
      let popup_edit_effect_style = document.createElement("div");
      popup_edit_effect_style.id = "popup_edit_effect_style";
      popup_edit_effect_style.className = "popup_edit_effect_attribute col wini_popup";
      effect_setting.appendChild(popup_edit_effect_style);
      let popup_title = document.createElement("span");
      popup_title.innerHTML = "Drop shadow";
      popup_edit_effect_style.appendChild(popup_title);
      let div_attribute = document.createElement("div");
      popup_edit_effect_style.appendChild(div_attribute);
      let input_offsetX = _textField("84px", undefined, "X", "0", undefined);
      input_offsetX.id = "edit_effect_offsetX";
      input_offsetX.lastChild.onblur = function () {
        if (!isNaN(parseFloat(this.value))) {
          editEffect({ OffsetX: parseFloat(this.value) });
        }
        updateUIEffectAttribute();
      };
      let input_blur = _textField("84px", undefined, "Blur", "0", undefined);
      input_blur.id = "edit_effect_blur";
      input_blur.lastChild.onblur = function () {
        if (!isNaN(parseFloat(this.value))) {
          editEffect({ BlurRadius: parseFloat(this.value) });
        }
        updateUIEffectAttribute();
      };
      let input_offsetY = _textField("84px", undefined, "Y", "0", undefined);
      input_offsetY.id = "edit_effect_offsetY";
      input_offsetY.lastChild.onblur = function () {
        if (!isNaN(parseFloat(this.value))) {
          editEffect({ OffsetY: parseFloat(this.value) });
        }
        updateUIEffectAttribute();
      };
      let input_spread = _textField("84px", undefined, "Spread", "0", undefined);
      input_spread.id = "edit_effect_spread";
      input_spread.lastChild.onblur = function () {
        if (!isNaN(parseFloat(this.value))) {
          editEffect({ SpreadRadius: parseFloat(this.value) });
        }
        updateUIEffectAttribute();
      };
      div_attribute.appendChild(input_offsetX);
      div_attribute.appendChild(input_blur);
      div_attribute.appendChild(input_offsetY);
      div_attribute.appendChild(input_spread);

      function updateEffectColor(params, onSubmit = true) {
        editEffect({ ColorValue: params }, onSubmit);
        if (onSubmit) {
          updateUIEffectAttribute();
        }
      }
      let select_effect_color = createEditColorForm(
        function (params) {
          updateEffectColor(params, false);
        },
        function (params) {
          updateEffectColor(params);
        },
      );
      select_effect_color.style.margin = "4px";
      select_effect_color.id = "edit-effect-color";
      div_attribute.appendChild(select_effect_color);
      // select effect type
      let eTypeValues = listEffect.filterAndMap((e) => e.StyleItem.DecorationItem.EffectItem.Type);
      let btn_select_eType = _btnDropDownSelect(
        eTypeValues.length == 1 ? list_effect_type : ["mixed", ...list_effect_type],
        function (options) {
          let firstEType = eTypeValues[0];
          if (eTypeValues.length > 1) {
            firstEType = "mixed";
          }
          for (let option of options) {
            if (option.getAttribute("value") == firstEType) {
              option.firstChild.style.opacity = 1;
            } else {
              option.firstChild.style.opacity = 0;
            }
          }
        },
        function (option) {
          editEffect({ Type: option });
          updateUIEffect();
        },
      );
      btn_select_eType.id = "btn_select_effect_type";
      btn_select_eType.firstChild.innerHTML = eTypeValues.length == 1 ? eTypeValues[0] : "mixed";
      div_select_eType.appendChild(btn_select_eType);

      let btn_isShow = createButtonAction("https://cdn.jsdelivr.net/gh/WiniGit/goline@785f3a1/lib/assets/eye-outline.svg", "https://cdn.jsdelivr.net/gh/WiniGit/goline@785f3a1/lib/assets/eye-close.svg", function () { });
      btn_isShow.className = "action-button";
      div_select_eType.appendChild(btn_isShow);

      let btn_delete = createButtonAction("https://cdn.jsdelivr.net/gh/WiniGit/goline@785f3a1/lib/assets/minus.svg", null, function () {
        deleteEffect();
        updateUIEffect();
      });
      btn_delete.className = "action-button";
      div_select_eType.appendChild(btn_delete);
    }
  }
  // selected_wbase use effect skin

  return editContainer;
}

function updateUIEffect() {
  let newEditEffect = createEditEffect();
  document.getElementById("edit-effect").replaceWith(newEditEffect);
}

function createEditColorForm(funcEdit, funcSubmit, funcDelete) {
  let visible = true;
  let isFocus = false;

  let editColorTile = document.createElement("div");
  editColorTile.className = "container-edit-tile";
  editColorTile.style.padding = "0 4px";

  let containerInput = document.createElement("div");
  containerInput.className = "parameter-form";
  editColorTile.appendChild(containerInput);

  let colorSelected = document.createElement("input");
  colorSelected.className = "show-color-container";
  colorSelected.type = "color";
  colorSelected.oninput = function (e) {
    editColorForm.value = this.value.replace("#", "").toUpperCase();
    funcEdit(Ultis.percentToHex(parseFloat(editOpacity.value.replace("%", ""))) + this.value.replace("#", ""));
  };
  colorSelected.onblur = function () {
    funcSubmit(Ultis.percentToHex(parseFloat(editOpacity.value.replace("%", ""))) + this.value.replace("#", ""));
  };

  containerInput.appendChild(colorSelected);

  let editColorForm = document.createElement("input");
  editColorForm.className = "edit-color-form";
  editColorForm.value = "000000";

  containerInput.appendChild(editColorForm);

  let divider = document.createElement("div");
  divider.className = "ver-line";

  containerInput.appendChild(divider);

  let editOpacity = document.createElement("input");
  editOpacity.className = "edit-opacity-form";
  editOpacity.value = "100%";

  containerInput.appendChild(editOpacity);

  let containerAction = document.createElement("div");
  containerAction.style.display = "flex";
  editColorTile.appendChild(containerAction);

  let buttonVisible = document.createElement("button");
  buttonVisible.className = "action-button";

  containerAction.appendChild(buttonVisible);

  let buttonVisibleIcon = document.createElement("img");
  buttonVisibleIcon.src = "https://cdn.jsdelivr.net/gh/WiniGit/goline@785f3a1/lib/assets/eye-outline.svg";
  buttonVisibleIcon.style.padding = "0px";

  buttonVisible.appendChild(buttonVisibleIcon);

  let buttonMinus = document.createElement("button");

  if (funcDelete) {
    buttonMinus.className = "action-button";
    let buttonMinusIcon = document.createElement("img");
    buttonMinusIcon.src = "https://cdn.jsdelivr.net/gh/WiniGit/goline@785f3a1/lib/assets/minus.svg";
    buttonMinus.appendChild(buttonMinusIcon);
    buttonMinus.onclick = funcDelete;
    containerAction.appendChild(buttonMinus);
  }

  //? <function>
  //change icon
  buttonVisible.onclick = function () {
    visible = visible ? false : true;
    buttonVisibleIcon.src = !visible ? "https://cdn.jsdelivr.net/gh/WiniGit/goline@785f3a1/lib/assets/eye-close.svg" : "https://cdn.jsdelivr.net/gh/WiniGit/goline@785f3a1/lib/assets/eye-outline.svg";
  };
  // UI action
  containerInput.onmouseover = function () {
    if (isFocus == false) {
      this.style.border = "0.5px solid #DFDFDF";
      divider.style.backgroundColor = "#DFDFDF";
    }
  };
  containerInput.onmouseout = function () {
    if (isFocus == false) {
      this.style.border = "0.5px solid transparent";
      divider.style.backgroundColor = "transparent";
    }
  };
  let startHexColor = "ffffff";
  editColorForm.onfocus = function () {
    isFocus = true;
    this.setSelectionRange(0, this.value.length);
    this.parentElement.style.border = "0.5px solid #1890FF";
    divider.style.backgroundColor = "#1890FF";
    startHexColor = this.value;
  };
  editColorForm.oninput = function () {
    if (this.value.startsWith("#")) {
      editColorForm.maxLength = 7;
    } else {
      editColorForm.maxLength = 6;
    }
  };
  editColorForm.onblur = function () {
    isFocus = false;
    this.parentElement.style.border = "0.5px solid transparent";
    divider.style.backgroundColor = "transparent";
    this.value = this.value.replace("#", "");
    if (this.value.length == 6) {
      funcSubmit(Ultis.percentToHex(parseFloat(editOpacity.value.replace("%", ""))) + this.value);
    } else {
      this.value = startHexColor;
    }
  };
  let startOpacity = "100%";
  editOpacity.onfocus = function () {
    isFocus = true;
    this.setSelectionRange(0, this.value.length);
    this.parentElement.style.border = "0.5px solid #1890FF";
    divider.style.backgroundColor = "#1890FF";
    startOpacity = this.value;
  };
  editOpacity.onblur = function () {
    isFocus = false;
    this.parentElement.style.border = "0.5px solid transparent";
    divider.style.backgroundColor = "transparent";
    opacity_value = parseFloat(this.value.replace("%", ""));
    if (opacity_value != undefined) {
      funcSubmit(Ultis.percentToHex(opacity_value) + editColorForm.value);
    } else {
      this.value = startOpacity;
    }
  };
  //? </function>
  return editColorTile;
}

function selectBorderSide(params, onclick) {
  let list = [
    {
      src: "https://cdn.jsdelivr.net/gh/WiniGit/goline@785f3a1/lib/assets/border-all-white.svg",
      name: "mixed",
    },
    {
      src: "https://cdn.jsdelivr.net/gh/WiniGit/goline@785f3a1/lib/assets/border-all-white.svg",
      name: BorderSide.all,
    },
    {
      src: "https://cdn.jsdelivr.net/gh/WiniGit/goline@785f3a1/lib/assets/border-top.svg",
      name: BorderSide.top,
    },
    {
      src: "https://cdn.jsdelivr.net/gh/WiniGit/goline@785f3a1/lib/assets/border-left.svg",
      name: BorderSide.left,
    },
    {
      src: "https://cdn.jsdelivr.net/gh/WiniGit/goline@785f3a1/lib/assets/border-bottom.svg",
      name: BorderSide.bottom,
    },
    {
      src: "https://cdn.jsdelivr.net/gh/WiniGit/goline@785f3a1/lib/assets/border-right.svg",
      name: BorderSide.right,
    },
    {
      src: "https://cdn.jsdelivr.net/gh/WiniGit/goline@785f3a1/lib/assets/settings-gear.svg",
      name: BorderSide.custom,
    },
  ];

  let dropdownContainer = document.createElement("div");
  dropdownContainer.className = "dropdown-border-type wini_popup";

  for (let i = 0; i < list.length; i++) {
    let option = document.createElement("div");
    option.setAttribute("type", list[i].name);
    option.className = "option";
    if (i == 0) {
      option.style.borderBottom = "1.5px solid #C4C4C4";
      option.style.pointerEvents = "none";
      option.style.opacity = "0.8";
    } else {
      option.onclick = function () {
        if (this.firstChild.style.opacity == 0) {
          onclick(this.getAttribute("type"));
        }
        dropdownContainer.style.display = "none";
      };
    }
    let checkIcon = document.createElement("img");
    checkIcon.className = "option-icon";
    checkIcon.src = "https://cdn.jsdelivr.net/gh/WiniGit/goline@785f3a1/lib/assets/check.svg";
    checkIcon.style.opacity = params == list[i].name ? 1 : 0;
    option.appendChild(checkIcon);

    let optionIcon = document.createElement("img");
    optionIcon.className = "option-icon";
    optionIcon.src = list[i].src;
    optionIcon.style.width = "28px";
    optionIcon.style.height = "28px";
    option.appendChild(optionIcon);

    let optionTitle = document.createElement("span");
    optionTitle.className = "option-title";
    optionTitle.innerHTML = list[i].name;
    option.appendChild(optionTitle);
    dropdownContainer.appendChild(option);
  }
  return dropdownContainer;
}

function createButtonAction(src1, src2, action) {
  let changeIcon = false;
  let button = document.createElement("button");
  button.className = "action-button";

  let buttonIcon = document.createElement("img");
  buttonIcon.src = src1;
  buttonIcon.style.pointerEvents = "none";
  button.appendChild(buttonIcon);
  button.onclick = function (event) {
    if (event.target.className.includes(`${this.className}`)) {
      if (src2 != null) {
        changeIcon = !changeIcon;
        buttonIcon.src = !changeIcon ? src1 : src2;
      }
      setTimeout(action, 200);
    }
  };

  return button;
}

function createDropdownTableSkin(enumCate, offset, currentSkinID) {
  let dropdown = document.createElement("div");
  dropdown.onclick = function (e) {
    e.stopPropagation();
    document.getElementById("body").querySelector(":scope > .popupEditOrDelete")?.remove();
  };
  dropdown.id = "popup_table_skin";
  dropdown.className = "wini_popup col popup_remove";
  dropdown.style.left = offset.x + "px";
  dropdown.style.top = offset.y - 56 + "px";
  dropdown.setAttribute("cate", enumCate);
  let header = document.createElement("div");
  header.className = "col header_popup_skin";
  dropdown.appendChild(header);
  let titleBar = document.createElement("div");
  titleBar.className = "row";
  let title = document.createElement("span");
  let action1 = createButtonAction("https://cdn.jsdelivr.net/gh/WiniGit/goline@785f3a1/lib/assets/library-black.svg", null, function () { });

  let action2 = createButtonAction("https://cdn.jsdelivr.net/gh/WiniGit/goline@785f3a1/lib/assets/add2.svg", null, function () {
    setTimeout(function () {
      let create_skin_popup = document.getElementById("create_skin_popup");
      create_skin_popup.style.display = "flex";
      create_skin_popup.querySelector(".popup-input").value = "";
      let popup_header = [...create_skin_popup.childNodes[1].childNodes].find((e) => e.className?.includes("popup-header"));
      switch (parseInt(dropdown.getAttribute("cate"))) {
        case EnumCate.color:
          popup_header.childNodes[1].innerHTML = "Create new color skin";
          break;
        case EnumCate.typography:
          popup_header.childNodes[1].innerHTML = "Create new typography skin";
          break;
        case EnumCate.border:
          popup_header.childNodes[1].innerHTML = "Create new border skin";
          break;
        case EnumCate.effect:
          popup_header.childNodes[1].innerHTML = "Create new effect skin";
          break;
        default:
          break;
      }
      let input_skin_name = document.getElementById("input_new_skin_name");
      let list_demo_skin = [...input_skin_name.childNodes].filter((e) => e.nodeName != "#text" && e.getAttribute("cate"));
      for (let i = 0; i < list_demo_skin.length; i++) {
        if (list_demo_skin[i].getAttribute("cate") == dropdown.getAttribute("cate")) {
          list_demo_skin[i].style.display = "block";
        } else {
          list_demo_skin[i].style.display = "none";
        }
      }
    }, 200);
  });
  titleBar.replaceChildren(title, action1, action2);
  switch (enumCate) {
    case EnumCate.color:
      title.innerHTML = "Color skin";
      if (selected_list.filter((e) => e.StyleItem.DecorationItem?.ColorValue?.length == 8).length == 0) {
        action2.style.display = "none";
      }
      break;
    case EnumCate.typography:
      title.innerHTML = "Typography skin";
      if (selected_list.filter((e) => e.StyleItem.TextStyleItem).length == 0) {
        action2.style.display = "none";
      }
      break;
    case EnumCate.border:
      title.innerHTML = "Border skin";
      if (selected_list.filter((e) => e.StyleItem.DecorationItem?.BorderItem).length == 0) {
        action2.style.display = "none";
      }
      break;
    case EnumCate.effect:
      title.innerHTML = "Effect skin";
      if (selected_list.filter((e) => e.StyleItem.DecorationItem?.EffectItem).length == 0) {
        action2.style.display = "none";
      }
      break;
    default:
      return;
  }
  let searchContainer = document.createElement("div");
  searchContainer.className = "row search-skins";
  let prefixIcon = document.createElement("i");
  prefixIcon.className = "fa-solid fa-magnifying-glass fa-xs";
  let inputSearch = document.createElement("input");
  inputSearch.placeholder = "Search skins...";
  inputSearch.oninput = function (e) {
    e.stopPropagation();
    searchSkins();
  };
  searchContainer.replaceChildren(prefixIcon, inputSearch);
  function searchSkins() {
    let searchContent = inputSearch.value.toLowerCase();
    if (searchContent.trim() == "") {
      let listTile = body.querySelectorAll(":is(.cate-skin-tile, .skin_tile_option)");
      listTile.forEach((tile) => {
        tile.style.display = "flex";
      });
    } else {
      body.querySelectorAll(".cate-skin-tile").forEach((cateSkTile) => {
        let listSkinTile = cateSkTile.querySelectorAll(".skin_tile_option");
        let cateName = cateSkTile.querySelector(":scope > p")?.innerHTML;
        if (cateName && cateName.toLowerCase().includes(searchContent)) {
          cateSkTile.style.display = "flex";
        } else {
          let numberResult = 0;
          listSkinTile.forEach((skinTile) => {
            let skinName = skinTile.querySelector(".skin-name").innerHTML;
            if (skinName.toLowerCase().includes(searchContent)) {
              skinTile.style.display = "flex";
              numberResult++;
            } else {
              skinTile.style.display = "none";
            }
          });
          cateSkTile.style.display = numberResult ? "flex" : "none";
        }
      });
    }
  }
  header.replaceChildren(titleBar, searchContainer);

  document.getElementById("body").appendChild(dropdown);

  updateTableSkinBody(enumCate, currentSkinID);
  let dropdownRect = dropdown.getBoundingClientRect();
  if (dropdownRect.bottom > document.body.offsetHeight) {
    dropdown.style.top = offset.y - 56 - (dropdownRect.bottom - document.body.offsetHeight) - 2 + "px";
  }
}

function updateTableSkinBody(enumCate, currentSkinID) {
  let dropdown = document.getElementById("popup_table_skin");
  if (!dropdown) return;
  let body = document.createElement("div");
  let noti_empty_skin = document.createElement("p");
  noti_empty_skin.style.margin = "8px 16px";
  noti_empty_skin.className = "regular0 text-subtitle";

  switch (enumCate) {
    case EnumCate.color:
      if (ColorDA.list.length == 0) {
        noti_empty_skin.innerHTML = "No color skins.";
        body.replaceChildren(noti_empty_skin);
      } else {
        let list_color_cate = [{ ID: EnumCate.color }, ...CateDA.list_color_cate.sort((a, b) => a.Name - b.Name)];
        body.replaceChildren(...list_color_cate.map((cateItem) => createCateSkinHTML(cateItem, currentSkinID)));
      }

      break;
    case EnumCate.typography:
      if (TypoDA.list.length == 0) {
        noti_empty_skin.innerHTML = "No typography skins.";
        body.replaceChildren(noti_empty_skin);
      } else {
        let list_typo_cate = [{ ID: EnumCate.typography }, ...CateDA.list_typo_cate.sort((a, b) => a.Name - b.Name)];
        body.replaceChildren(...list_typo_cate.map((cateItem) => createCateSkinHTML(cateItem, currentSkinID)));
      }

      break;
    case EnumCate.border:
      if (BorderDA.list.length == 0) {
        noti_empty_skin.innerHTML = "No border skins.";
        body.replaceChildren(noti_empty_skin);
      } else {
        let list_border_cate = [{ ID: EnumCate.border }, ...CateDA.list_border_cate.sort((a, b) => a.Name - b.Name)];
        body.replaceChildren(...list_border_cate.map((cateItem) => createCateSkinHTML(cateItem, currentSkinID)));
      }

      break;
    case EnumCate.effect:
      if (EffectDA.list.length == 0) {
        noti_empty_skin.innerHTML = "No effect skins.";
        body.replaceChildren(noti_empty_skin);
      } else {
        let list_effect_cate = [{ ID: EnumCate.effect }, ...CateDA.list_effect_cate.sort((a, b) => a.Name - b.Name)];
        body.replaceChildren(...list_effect_cate.map((cateItem) => createCateSkinHTML(cateItem, currentSkinID)));
      }

      break;
    default:
      break;
  }
  let currentBody = dropdown.querySelector(":scope > .body_popup_skin");
  if (currentBody) {
    currentBody.replaceWith(body);
  } else {
    dropdown.appendChild(body);
  }
  body.className = "body_popup_skin";
  if (currentSkinID) {
    let usingSkin = document.getElementById(`skinID:${currentSkinID}`);
    if (usingSkin) {
      usingSkin.style.background = "#E6F7FF";
      body.scrollTo({
        top: (usingSkin.offsetTop ?? 0) - 36,
        behavior: "smooth",
      });
    }
  }
}

function createCateSkinHTML(cateItem, currentSkinID) {
  let cateContainer = document.createElement("div");
  cateContainer.className = `CateItemID:${cateItem.ID} col cate-skin-tile`;
  cateContainer.style.width = "100%";
  let childrenHTML = [];
  if (cateItem.ParentID || selected_list.length == 0) {
    let cate_title = document.createElement("p");
    cate_title.className = "semibold1";
    cate_title.style.paddingLeft = "8px";
    cate_title.style.color = "#b2b2b2";
    cate_title.innerHTML = `${cateItem.Name}`;
    if (cateItem.ParentID && selected_list.length == 0) {
      let cateTitleTile = document.createElement("div");
      cateTitleTile.className = "row";
      let prefixIcon = document.createElement("i");
      prefixIcon.className = "fa-solid fa-caret-down fa-2xs";
      prefixIcon.style.color = "#b2b2b2";
      prefixIcon.style.marginLeft = "8px";
      prefixIcon.style.padding = "10px";
      let isShow = true;
      prefixIcon.onclick = function (e) {
        e.stopPropagation();
        isShow = !isShow;
        if (isShow) {
          prefixIcon.className = "fa-solid fa-caret-down fa-2xs";
        } else {
          prefixIcon.className = "fa-solid fa-caret-right fa-2xs";
        }
      };
      cateTitleTile.appendChild(prefixIcon);
      cate_title.style.margin = "6px 0";
      cateTitleTile.appendChild(cate_title);
      childrenHTML.push(cateTitleTile);
    } else {
      cate_title.style.margin = "8px";
      childrenHTML.push(cate_title);
    }
  }
  let enumCate = cateItem.ParentID ?? cateItem.ID;
  switch (enumCate) {
    case EnumCate.color:
      let color_list = ColorDA.list
        .filter((e) => {
          if (selected_list.length == 0) {
            return e.CateID == cateItem.ID;
          } else {
            return e.CateID == cateItem.ID && e.ProjectID == ProjectDA.obj.ID;
          }
        })
        .sort((a, b) => a.Name - b.Name);
      childrenHTML.push(
        ...color_list.map((colorItem) => {
          let skin_tile = createSkinTileHTML(enumCate, colorItem);
          if (colorItem.GID == currentSkinID) {
            skin_tile.style.backgroundColor = "#E6F7FF";
          }
          return skin_tile;
        }),
      );
      break;
    case EnumCate.typography:
      let typo_list = TypoDA.list
        .filter((e) => {
          if (selected_list.length == 0) {
            return e.CateID == cateItem.ID;
          } else {
            return e.CateID == cateItem.ID && e.ProjectID == ProjectDA.obj.ID;
          }
        })
        .sort((a, b) => a.Name - b.Name);
      childrenHTML.push(
        ...typo_list.map((typoItem) => {
          let skin_tile = createSkinTileHTML(enumCate, typoItem);
          if (typoItem.GID == currentSkinID) {
            skin_tile.style.backgroundColor = "#E6F7FF";
          }
          return skin_tile;
        }),
      );
      break;
    case EnumCate.border:
      let border_list = BorderDA.list
        .filter((e) => {
          if (selected_list.length == 0) {
            return e.CateID == cateItem.ID;
          } else {
            return e.CateID == cateItem.ID && e.ProjectID == ProjectDA.obj.ID;
          }
        })
        .sort((a, b) => a.Name - b.Name);
      childrenHTML.push(
        ...border_list.map((borderItem) => {
          let skin_tile = createSkinTileHTML(enumCate, borderItem);
          if (borderItem.GID == currentSkinID) {
            skin_tile.style.backgroundColor = "#E6F7FF";
          }
          return skin_tile;
        }),
      );
      break;
    case EnumCate.effect:
      let effect_list = EffectDA.list
        .filter((e) => {
          if (selected_list.length == 0) {
            return e.CateID == cateItem.ID;
          } else {
            return e.CateID == cateItem.ID && e.ProjectID == ProjectDA.obj.ID;
          }
        })
        .sort((a, b) => a.Name - b.Name);
      childrenHTML.push(
        ...effect_list.map((effectItem) => {
          let skin_tile = createSkinTileHTML(enumCate, effectItem);
          if (effectItem.GID == currentSkinID) {
            skin_tile.style.backgroundColor = "#E6F7FF";
          }
          return skin_tile;
        }),
      );
      break;
    default:
      break;
  }
  if (cateContainer.querySelectorAll(":scope > .skin_tile_option").length && [EnumCate.color, EnumCate.typography, EnumCate.border, EnumCate.effect].every((ct) => cateItem.ID !== ct)) return document.createElement("div");
  cateContainer.replaceChildren(...childrenHTML);
  return cateContainer;
}

function createSkinTileHTML(enumCate, jsonSkin) {
  let skin_tile = document.createElement("button");
  skin_tile.id = `skinID:${jsonSkin.GID}`;
  skin_tile.className = "skin_tile_option";
  if (selected_list.length == 0 && jsonSkin.CateID != enumCate) {
    skin_tile.style.paddingLeft = "36px";
  }
  let action_edit = document.createElement("i");
  if (jsonSkin.ProjectID != ProjectDA.obj.ID) {
    action_edit.className = "fa-regular fa-circle-question fa-lg";
    action_edit.style.display = "flex";
    action_edit.style.color = "#1890ff";
    skin_tile.style.pointerEvents = "none";
  } else {
    action_edit.className = "fa-solid fa-sliders fa-lg";
    action_edit.onclick = showEditSkin;
  }
  function showEditSkin(e) {
    e.stopPropagation();
    let popupEdit = popupEditSkin(enumCate, jsonSkin);
    popupEdit.style.top = e.pageY + "px";
    popupEdit.style.left = e.pageX + "px";
    document.getElementById("body").appendChild(popupEdit);
    if (popupEdit.getBoundingClientRect().bottom >= document.body.offsetHeight) {
      popupEdit.style.top = `${document.body.offsetHeight - popupEdit.offsetHeight}px`;
    }
  }
  skin_tile.onauxclick = function (e) {
    e.stopPropagation();
    let projectViewBody = document.getElementById("body");
    projectViewBody.querySelector(".popupEditOrDelete")?.remove();
    let popupEditOrDelete = document.createElement("div");
    popupEditOrDelete.className = "popupEditOrDelete col wini_popup popup_remove";
    popupEditOrDelete.style.top = e.pageY + "px";
    popupEditOrDelete.style.left = e.pageX + "px";
    popupEditOrDelete.style.zIndex = projectViewBody.childNodes.length;
    let options = [
      {
        title: "Edit",
        click: showEditSkin,
      },
      {
        title: "Delete",
        click: function (e) {
          e.stopPropagation();
          switch (enumCate) {
            case EnumCate.color:
              ColorDA.delete(jsonSkin);
              break;
            case EnumCate.typography:
              TypoDA.delete(jsonSkin);
              break;
            case EnumCate.border:
              BorderDA.delete(jsonSkin);
              break;
            case EnumCate.effect:
              EffectDA.delete(jsonSkin);
              break;
            default:
              break;
          }
          skin_tile.remove();
        },
      },
    ];
    popupEditOrDelete.replaceChildren(
      ...options.map((option) => {
        let optionTile = document.createElement("div");
        optionTile.innerHTML = option.title;
        optionTile.onclick = function (e) {
          option.click(e);
          popupEditOrDelete.remove();
        };
        return optionTile;
      }),
    );
    projectViewBody.appendChild(popupEditOrDelete);
    if (popupEditOrDelete.getBoundingClientRect().right > document.body.offsetWidth) {
      popupEditOrDelete.style.left = null;
      popupEditOrDelete.style.right = "0px";
    }
  };
  switch (enumCate) {
    case EnumCate.color:
      skin_tile.onclick = function (e) {
        e.stopPropagation();
        if (selected_list.length > 0) {
          editBackground({ ColorItem: jsonSkin });
          document.getElementById("popup_table_skin").remove();
          document.getElementById("popup_edit_skin")?.remove();
          updateUIBackground();
        }
      };
      let demo_color = document.createElement("div");
      demo_color.style.width = "15px";
      demo_color.style.height = "15px";
      demo_color.style.borderRadius = "50%";
      demo_color.style.pointerEvents = "none";
      demo_color.style.border = "0.5px solid #c4c4c4";
      demo_color.style.backgroundColor = `#${jsonSkin.Value.substring(2)}${jsonSkin.Value.substring(0, 2)}`;
      skin_tile.appendChild(demo_color);
      let color_name = document.createElement("p");
      color_name.className = "skin-name";
      color_name.innerHTML = jsonSkin.Name;
      color_name.style.margin = "0 8px";
      color_name.style.flex = 1;
      color_name.style.textAlign = "left";
      color_name.style.pointerEvents = "none";
      skin_tile.appendChild(color_name);
      break;
    case EnumCate.typography:
      skin_tile.onclick = function (e) {
        e.stopPropagation();
        if (selected_list.length > 0) {
          editTextStyle(jsonSkin);
          document.getElementById("popup_table_skin").remove();
          document.getElementById("popup_edit_skin")?.remove();
          updateUITextStyle();
        }
      };
      let demo_typo = document.createElement("p");
      demo_typo.innerHTML = "Ag";
      demo_typo.style.fontSize = "14px";
      demo_typo.style.lineHeight = "16px";
      demo_typo.style.fontWeight = jsonSkin.FontWeight;
      demo_typo.style.pointerEvents = "none";
      skin_tile.appendChild(demo_typo);
      let typo_name = document.createElement("div");
      typo_name.style.margin = "0 8px";
      typo_name.style.flex = 1;
      typo_name.style.display = "flex";
      typo_name.style.pointerEvents = "none";
      let title_name = document.createElement("p");
      title_name.className = "skin-name";
      title_name.style.overflow = "auto";
      title_name.innerHTML = jsonSkin.Name;
      let title_style = document.createElement("p");
      title_style.innerHTML = ` . ${jsonSkin.FontSize}/${jsonSkin.Height ?? "auto"}`;
      title_style.style.color = "#c4c4c4";
      typo_name.appendChild(title_name);
      typo_name.appendChild(title_style);
      skin_tile.appendChild(typo_name);
      break;
    case EnumCate.border:
      skin_tile.onclick = function (e) {
        e.stopPropagation();
        if (selected_list.length > 0) {
          editBorder(jsonSkin);
          document.getElementById("popup_table_skin").remove();
          document.getElementById("popup_edit_skin")?.remove();
          updateUIBorder();
        }
      };
      let demo_border = document.createElement("div");
      demo_border.style.width = "15px";
      demo_border.style.height = "15px";
      demo_border.style.borderRadius = "50%";
      demo_border.style.pointerEvents = "none";
      demo_border.style.border = "0.5px solid #c4c4c4";
      demo_border.style.backgroundColor = `#${jsonSkin.ColorValue.substring(2)}${jsonSkin.ColorValue.substring(0, 2)}`;
      skin_tile.appendChild(demo_border);
      let border_name = document.createElement("p");
      border_name.className = "skin-name";
      border_name.innerHTML = jsonSkin.Name;
      border_name.style.margin = "0 8px";
      border_name.style.flex = 1;
      border_name.style.textAlign = "left";
      border_name.style.pointerEvents = "none";
      skin_tile.appendChild(border_name);
      break;
    case EnumCate.effect:
      skin_tile.onclick = function (e) {
        e.stopPropagation();
        if (selected_list.length > 0) {
          editEffect(jsonSkin);
          document.getElementById("popup_table_skin").remove();
          document.getElementById("popup_edit_skin")?.remove();
          updateUIEffect();
        }
      };
      let demo_effect = document.createElement("img");
      demo_effect.src = "https://cdn.jsdelivr.net/gh/WiniGit/goline@785f3a1/lib/assets/effect-settings.svg";
      demo_effect.style.width = "16px";
      demo_effect.style.height = "16px";
      demo_effect.style.pointerEvents = "none";
      skin_tile.appendChild(demo_effect);
      let effect_name = document.createElement("p");
      effect_name.className = "skin-name";
      effect_name.innerHTML = jsonSkin.Name;
      effect_name.style.margin = "0 8px";
      effect_name.style.flex = 1;
      effect_name.style.textAlign = "left";
      effect_name.style.pointerEvents = "none";
      skin_tile.appendChild(effect_name);
      break;
    default:
      break;
  }
  skin_tile.appendChild(action_edit);
  return skin_tile;
}

function popupEditSkin(enumCate, jsonSkin) {
  let divEditSkin = document.createElement("div");
  divEditSkin.id = "popup_edit_skin";
  divEditSkin.className = "wini_popup col popup_remove";
  handlePopupDispose(divEditSkin, function () {
    if (jsonSkin.CateID != -1) {
      switch (enumCate) {
        case EnumCate.color:
          ColorDA.edit(jsonSkin);
          break;
        case EnumCate.typography:
          TypoDA.edit(jsonSkin);
          break;
        case EnumCate.border:
          BorderDA.edit(jsonSkin);
          break;
        case EnumCate.effect:
          EffectDA.edit(jsonSkin);
          break;
        default:
          break;
      }
    }
  });
  divEditSkin.onkeydown = function (e) {
    if (e.key == "Enter" && document.activeElement.localName == "input") {
      document.activeElement.blur();
    }
  };
  divEditSkin.onclick = function () {
    document
      .getElementById("body")
      .querySelectorAll(":scope > .popup_select")
      .forEach((popupSelect) => (popupSelect.style.display = "none"));
  };
  let header = document.createElement("div");
  header.className = "row header_popup_skin";
  divEditSkin.appendChild(header);
  let title = document.createElement("span");
  title.style.pointerEvents = "none";
  title.style.flex = 1;
  title.innerHTML = "Edit skin";
  header.appendChild(title);
  let btn_close = document.createElement("i");
  btn_close.className = "fa-solid fa-xmark";
  btn_close.style.padding = "12px";
  btn_close.onclick = function (e) {
    e.stopImmediatePropagation();
    divEditSkin.remove();
  };
  header.appendChild(btn_close);
  let body = document.createElement("div");
  body.style.width = "100%";
  body.style.height = "100%";
  body.style.flex = 1;
  divEditSkin.appendChild(body);
  let editName = document.createElement("input");
  editName.value = jsonSkin.Name;
  editName.className = "edit_skin_name";
  editName.onfocus = function () {
    this.setSelectionRange(0, this.value.length);
  };
  body.appendChild(editName);
  let demoDiv = document.createElement("div");
  demoDiv.style.height = "122px";
  demoDiv.style.width = "100%";
  demoDiv.style.margin = "8px 0";
  demoDiv.style.boxSizing = "border-box";
  demoDiv.style.overflow = "hidden";
  demoDiv.style.position = "relative";
  demoDiv.style.backgroundImage = `url(${SVGIcon.background_img_default})`;
  body.appendChild(demoDiv);
  let property_text = document.createElement("p");
  property_text.innerHTML = "Properties";
  property_text.style.fontSize = "12px";
  property_text.style.fontWeight = "600";
  property_text.style.margin = "4px 0 4px 8px";
  body.appendChild(property_text);
  switch (enumCate) {
    case EnumCate.color:
      editName.onblur = function () {
        if (this.value != jsonSkin.Name) {
          let nameValue = this.value
            .replace("\\", "/")
            .split("/")
            .filter((_string) => _string.trim() != "");
          if (nameValue.length > 0) {
            editColorSkin({ Name: this.value }, jsonSkin);
            this.value = jsonSkin.Name;
          } else {
            this.value = thisSkin.Name;
          }
        }
      };
      demoDiv.style.backgroundImage = "none";
      demoDiv.style.backgroundColor = `#${jsonSkin.Value.substring(2)}${jsonSkin.Value.substring(0, 2)}`;
      function updateColorSkin(newColor, onSubmit = true) {
        let thisSkin = ColorDA.list.find((e) => e.GID == jsonSkin.GID);
        editColorSkin({ Value: newColor }, thisSkin, onSubmit);
        demoDiv.style.backgroundColor = `#${thisSkin.Value.substring(2)}${thisSkin.Value.substring(0, 2)}`;
      }
      let editColorValue = createEditColorForm(
        function (newColor) {
          updateColorSkin(newColor, false);
        },
        function (newColor) {
          updateColorSkin(newColor);
        },
      );
      var formEditColor = [...editColorValue.childNodes].find((e) => e.className == "parameter-form");
      formEditColor.childNodes.forEach((e) => {
        switch (e.className) {
          case "show-color-container":
            e.value = `#${jsonSkin.Value.substring(2)}`;
            break;
          case "edit-color-form":
            e.value = jsonSkin.Value.substring(2).toUpperCase();
            break;
          case "edit-opacity-form":
            e.value = Ultis.hexToPercent(jsonSkin.Value.substring(0, 2)) + "%";
            break;
          default:
            break;
        }
      });
      body.appendChild(editColorValue);
      break;
    case EnumCate.typography:
      editName.onblur = function () {
        if (this.value != jsonSkin.Name) {
          let nameValue = this.value
            .replace("\\", "/")
            .split("/")
            .filter((_string) => _string.trim() != "");
          if (nameValue.length > 0) {
            editTypoSkin({ Name: this.value }, jsonSkin);
            this.value = jsonSkin.Name;
          } else {
            this.value = thisSkin.Name;
          }
        }
      };
      let demoText = document.createElement("p");
      demoText.innerHTML = "Ag 123";
      demoText.style.position = "absolute";
      demoText.style.margin = "0";
      demoText.style.left = "50%";
      demoText.style.top = "50%";
      demoText.style.transform = "translate(-50%,-50%)";
      demoText.style.fontSize = `${jsonSkin.FontSize}px`;
      if (jsonSkin.Height) {
        demoText.style.lineHeight = `${jsonSkin.Height}px`;
      }
      demoText.style.FontWeight = jsonSkin.FontWeight;
      demoText.style.fontFamily = jsonSkin.FontFamily;
      demoText.style.letterSpacing = jsonSkin.LetterSpacing + "px";
      demoText.style.color = `#${jsonSkin.ColorValue.substring(2)}${jsonSkin.ColorValue.substring(0, 2)}`;
      demoDiv.appendChild(demoText);
      // edit skin color
      let inputTextColor = createEditColorForm(
        function (newColor) {
          let thisSkin = TypoDA.list.find((e) => e.GID == jsonSkin.GID);
          editTypoSkin({ ColorValue: newColor }, thisSkin, false);
          demoText.style.color = `#${thisSkin.ColorValue.substring(2)}${thisSkin.ColorValue.substring(0, 2)}`;
        },
        function (newColor) {
          let thisSkin = TypoDA.list.find((e) => e.GID == jsonSkin.GID);
          editTypoSkin({ ColorValue: newColor }, thisSkin);
          demoText.style.color = `#${thisSkin.ColorValue.substring(2)}${thisSkin.ColorValue.substring(0, 2)}`;
        },
      );
      var formEditColor = [...inputTextColor.childNodes].find((e) => e.className == "parameter-form");
      formEditColor.childNodes.forEach((e) => {
        switch (e.className) {
          case "show-color-container":
            e.value = `#${jsonSkin.ColorValue.substring(2)}`;
            break;
          case "edit-color-form":
            e.value = jsonSkin.ColorValue.substring(2).toUpperCase();
            break;
          case "edit-opacity-form":
            e.value = Ultis.hexToPercent(jsonSkin.ColorValue.substring(0, 2)) + "%";
            break;
          default:
            break;
        }
      });
      body.appendChild(inputTextColor);
      // select font-family
      let btn_select_font_family = _btnInputSelect(
        list_font_family,
        function (options) {
          for (let i = 0; i < options.length; i++) {
            if (jsonSkin.FontFamily == options[i].getAttribute("value")) {
              options[i].firstChild.style.opacity = 1;
            } else {
              options[i].firstChild.style.opacity = 0;
            }
          }
        },
        function (option) {
          let newFontFamily = list_font_family.find((e) => e.toLowerCase() == option.toLowerCase());
          if (newFontFamily) {
            let thisSkin = TypoDA.list.find((e) => e.GID == jsonSkin.GID);
            editTypoSkin({ FontFamily: newFontFamily }, thisSkin);
            demoText.style.fontFamily = newFontFamily;
            btn_select_font_family.firstChild.value = newFontFamily;
          }
        },
      );
      btn_select_font_family.style.marginTop = "8px";
      btn_select_font_family.style.marginBottom = "8px";
      btn_select_font_family.firstChild.value = jsonSkin.FontFamily;
      body.appendChild(btn_select_font_family);
      //
      let div_font_size_weight = document.createElement("div");
      div_font_size_weight.className = "row";
      div_font_size_weight.style.width = "100%";
      body.appendChild(div_font_size_weight);
      // select font-weight
      let btn_select_font_weight = _btnDropDownSelect(
        list_font_weight,
        function (options) {
          for (let i = 0; i < options.length; i++) {
            if (options[i].getAttribute("value") == jsonSkin.fontWeight) {
              options[i].firstChild.style.opacity = 1;
            } else {
              options[i].firstChild.style.opacity = 0;
            }
          }
        },
        function (value) {
          let thisSkin = TypoDA.list.find((e) => e.GID == jsonSkin.GID);
          editTypoSkin({ FontWeight: value }, thisSkin);
          demoText.style.fontWeight = value;
          btn_select_font_weight.firstChild.innerHTML = value;
        },
      );
      btn_select_font_weight.firstChild.innerHTML = jsonSkin.FontWeight;
      div_font_size_weight.appendChild(btn_select_font_weight);
      // select font-size
      let btn_select_font_size = _btnInputSelect(
        list_font_size,
        function (options) {
          for (let i = 0; i < options.length; i++) {
            if (jsonSkin.FontSize == options[i].getAttribute("value")) {
              options[i].firstChild.style.opacity = 1;
            } else {
              options[i].firstChild.style.opacity = 0;
            }
          }
        },
        function (option) {
          if (btn_select_font_size.firstChild.value != option) {
            let thisSkin = TypoDA.list.find((e) => e.GID == jsonSkin.GID);
            editTypoSkin({ FontSize: option }, thisSkin);
            demoText.style.fontSize = option;
            btn_select_font_size.firstChild.value = option;
          }
        },
        true,
      );
      btn_select_font_size.style.flex = 1;
      btn_select_font_size.firstChild.value = jsonSkin.FontSize;
      div_font_size_weight.appendChild(btn_select_font_size);
      // row contain edit line-height & letter spacing
      let div_height_spacing = document.createElement("div");
      div_height_spacing.className = "row";
      div_height_spacing.style.width = "100%";
      div_height_spacing.style.padding = "8px 4px 0 0";
      body.appendChild(div_height_spacing);
      // input line-height
      let input_line_height = _textField("100%", "https://cdn.jsdelivr.net/gh/WiniGit/goline@785f3a1/lib/assets/line-height.svg", undefined, "0", "25px");
      input_line_height.style.flex = 1;
      input_line_height.style.marginRight = "8px";
      input_line_height.lastChild.value = jsonSkin.Height ? jsonSkin.Height : "Auto";
      input_line_height.lastChild.onblur = function () {
        let thisSkin = TypoDA.list.find((e) => e.GID == jsonSkin.GID);
        if (this.value.toLowerCase() == "auto") {
          editTypoSkin({ Height: this.value }, thisSkin);
          demoText.style.lineHeight = "normal";
        } else if (!isNaN(parseFloat(this.value))) {
          editTypoSkin({ Height: parseFloat(this.value) }, thisSkin);
          demoText.style.lineHeight = parseFloat(this.value) + "px";
        } else {
          this.value = thisSkin.Height;
        }
      };
      div_height_spacing.appendChild(input_line_height);
      // input letter spacing
      let input_letter_spacing = _textField("100%", "https://cdn.jsdelivr.net/gh/WiniGit/goline@785f3a1/lib/assets/letter-spacing.svg", undefined, "0", "28px");
      input_letter_spacing.id = "input_letter_spacing";
      input_letter_spacing.style.flex = 1;
      input_letter_spacing.lastChild.value = jsonSkin.LetterSpacing;
      input_letter_spacing.lastChild.onblur = function () {
        let thisSkin = TypoDA.list.find((e) => e.GID == jsonSkin.GID);
        if (!isNaN(parseFloat(this.value))) {
          editTypoSkin({ LetterSpacing: parseFloat(this.value) }, thisSkin);
          demoText.style.letterSpacing = parseFloat(this.value) + "px";
        } else {
          this.value = thisSkin.LetterSpacing;
        }
      };
      div_height_spacing.appendChild(input_letter_spacing);
      break;
    case EnumCate.border:
      editName.onblur = function () {
        if (this.value != jsonSkin.Name) {
          let nameValue = this.value
            .replace("\\", "/")
            .split("/")
            .filter((_string) => _string.trim() != "");
          if (nameValue.length > 0) {
            editBorderSkin({ Name: this.value }, jsonSkin);
            this.value = jsonSkin.Name;
          } else {
            this.value = thisSkin.Name;
          }
        }
      };
      let list_width = jsonSkin.Width.split(" ");
      demoDiv.style.borderTopWidth = list_width[0] + "px";
      demoDiv.style.borderRightWidth = list_width[1] + "px";
      demoDiv.style.borderBottomWidth = list_width[2] + "px";
      demoDiv.style.borderLeftWidth = list_width[3] + "px";
      demoDiv.style.borderStyle = jsonSkin.BorderStyle;
      demoDiv.style.borderColor = `#${jsonSkin.ColorValue.substring(2)}${jsonSkin.ColorValue.substring(0, 2)}`;
      let inputBorderColor = createEditColorForm(
        function (newColor) {
          let thisSkin = BorderDA.list.find((e) => e.GID == jsonSkin.GID);
          editBorderSkin({ ColorValue: newColor }, thisSkin, false);
          demoDiv.style.borderColor = `#${thisSkin.ColorValue.substring(2)}${thisSkin.ColorValue.substring(0, 2)}`;
        },
        function (newColor) {
          let thisSkin = BorderDA.list.find((e) => e.GID == jsonSkin.GID);
          editBorderSkin({ ColorValue: newColor }, thisSkin);
          demoDiv.style.borderColor = `#${thisSkin.ColorValue.substring(2)}${thisSkin.ColorValue.substring(0, 2)}`;
        },
      );
      var formEditColor = [...inputBorderColor.childNodes].find((e) => e.className == "parameter-form");
      formEditColor.childNodes.forEach((e) => {
        switch (e.className) {
          case "show-color-container":
            e.value = `#${jsonSkin.ColorValue.substring(2)}`;
            break;
          case "edit-color-form":
            e.value = jsonSkin.ColorValue.substring(2).toUpperCase();
            break;
          case "edit-opacity-form":
            e.value = Ultis.hexToPercent(jsonSkin.ColorValue.substring(0, 2)) + "%";
            break;
          default:
            break;
        }
      });
      body.appendChild(inputBorderColor);

      let formEditLine = document.createElement("div");
      formEditLine.className = "container-edit-tile";
      formEditLine.style.paddingLeft = "4px";
      body.appendChild(formEditLine);

      let btnSelectStyle = _btnDropDownSelect(
        list_border_style,
        function (options) {
          for (let i = 1; i < options.length; i++) {
            let style = options[i].getAttribute("value");
            options[i].firstChild.style.opacity = style == jsonSkin.BorderStyle ? 1 : 0;
          }
        },
        function (value) {
          let thisSkin = BorderDA.list.find((e) => e.GID == jsonSkin.GID);
          btnSelectStyle.firstChild.innerHTML = value;
          editBorderSkin({ BorderStyle: value }, thisSkin);
          demoDiv.style.borderStyle = value;
        },
      );
      btnSelectStyle.firstChild.innerHTML = jsonSkin.BorderStyle;
      formEditLine.appendChild(btnSelectStyle);

      let edit_stroke_width = _textField("60px", "https://cdn.jsdelivr.net/gh/WiniGit/goline@785f3a1/lib/assets/stroke-width.svg", undefined, "0", "28px");
      let listWidth = jsonSkin.Width.split(" ");
      switch (jsonSkin.BorderSide) {
        case BorderSide.top:
          edit_stroke_width.lastChild.value = listWidth[0];
          break;
        case BorderSide.right:
          edit_stroke_width.lastChild.value = listWidth[1];
          break;
        case BorderSide.bottom:
          edit_stroke_width.lastChild.value = listWidth[2];
          break;
        case BorderSide.left:
          edit_stroke_width.lastChild.value = listWidth[3];
          break;
        default:
          if (listWidth.every((value) => value == listWidth[0])) {
            edit_stroke_width.lastChild.value = listWidth[0];
          } else {
            edit_stroke_width.lastChild.value = "mixed";
          }
          break;
      }
      edit_stroke_width.lastChild.onblur = function () {
        if (!isNaN(parseFloat(this.value))) {
          let thisSkin = BorderDA.list.find((e) => e.GID == jsonSkin.GID);
          group_custom_border_side.style.display = "none";
          editBorderSkin({ Width: parseFloat(this.value) }, thisSkin);
          demoDiv.style.borderTopWidth = thisSkin.Width.split(" ")[0] + "px";
          demoDiv.style.borderRightWidth = thisSkin.Width.split(" ")[1] + "px";
          demoDiv.style.borderBottomWidth = thisSkin.Width.split(" ")[2] + "px";
          demoDiv.style.borderLeftWidth = thisSkin.Width.split(" ")[3] + "px";
        } else {
          let listWidth = jsonSkin.Width.split(" ");
          switch (jsonSkin.BorderSide) {
            case BorderSide.top:
              this.value = listWidth[0];
              break;
            case BorderSide.right:
              this.value = listWidth[1];
              break;
            case BorderSide.bottom:
              this.value = listWidth[2];
              break;
            case BorderSide.left:
              this.value = listWidth[3];
              break;
            default:
              if (listWidth.every((value) => value == listWidth[0])) {
                this.value = listWidth[0];
              } else {
                this.value = "mixed";
              }
              break;
          }
        }
      };
      formEditLine.appendChild(edit_stroke_width);

      let btnSelectBorderSide = createButtonAction("https://cdn.jsdelivr.net/gh/WiniGit/goline@785f3a1/lib/assets/border-all-black.svg", null, function () {
        dropdown_type.style.display = "flex";
        dropdown_type.childNodes[0].style.display = "none";
        for (let i = 1; i < dropdown_type.childNodes.length; i++) {
          let type = dropdown_type.childNodes[i].getAttribute("type");
          dropdown_type.childNodes[i].firstChild.style.opacity = type == jsonSkin.BorderSide ? 1 : 0;
        }
      });
      btnSelectBorderSide.className = "action-button";
      formEditLine.appendChild(btnSelectBorderSide);

      let dropdown_type = selectBorderSide(jsonSkin.BorderSide, function (value) {
        let thisSkin = BorderDA.list.find((e) => e.GID == jsonSkin.GID);
        if (value == BorderSide.custom) {
          group_custom_border_side.style.display = "flex";
          edit_stroke_width.lastChild.value = thisSkin.BorderSide == BorderSide.all ? thisSkin.Width.split(" ")[0] : "mixed";
          editBorderSkin({ BorderSide: BorderSide.custom }, thisSkin);
          input_border_top.lastChild.value = thisSkin.Width.split(" ")[0];
          input_border_right.lastChild.value = thisSkin.Width.split(" ")[1];
          input_border_bottom.lastChild.value = thisSkin.Width.split(" ")[2];
          input_border_left.lastChild.value = thisSkin.Width.split(" ")[3];
        } else {
          editBorderSkin({ BorderSide: value }, thisSkin);
          group_custom_border_side.style.display = "none";
          demoDiv.style.borderTopWidth = thisSkin.Width.split(" ")[0] + "px";
          demoDiv.style.borderRightWidth = thisSkin.Width.split(" ")[1] + "px";
          demoDiv.style.borderBottomWidth = thisSkin.Width.split(" ")[2] + "px";
          demoDiv.style.borderLeftWidth = thisSkin.Width.split(" ")[3] + "px";
        }
      });
      btnSelectBorderSide.appendChild(dropdown_type);

      let group_custom_border_side = document.createElement("div");
      body.appendChild(group_custom_border_side);
      group_custom_border_side.className = "group_input_border_side";
      group_custom_border_side.style.display = jsonSkin.BorderSide == BorderSide.custom ? "flex" : "none";
      let input_border_left = _textField("88px", "https://cdn.jsdelivr.net/gh/WiniGit/goline@785f3a1/lib/assets/border-left-black.svg", undefined, "0", "36px");
      input_border_left.style.marginLeft = "8px";
      input_border_left.lastChild.value = jsonSkin.Width.split(" ")[3];
      input_border_left.lastChild.onblur = function () {
        let left_width_value = parseFloat(this.value);
        let thisSkin = BorderDA.list.find((e) => e.GID == jsonSkin.GID);
        if (left_width_value) {
          editBorderSkin({ LeftWidth: left_width_value }, thisSkin);
          demoDiv.style.borderLeftWidth = left_width_value + "px";
        } else {
          this.value = thisSkin.Width.split(" ")[3];
        }
      };
      group_custom_border_side.appendChild(input_border_left);
      let input_border_top = _textField("88px", "https://cdn.jsdelivr.net/gh/WiniGit/goline@785f3a1/lib/assets/border-top-black.svg", undefined, "0", "36px");
      input_border_top.style.marginRight = "8px";
      input_border_top.lastChild.value = jsonSkin.Width.split(" ")[0];
      input_border_top.lastChild.onblur = function () {
        let top_width_value = parseFloat(this.value);
        if (top_width_value) {
          editBorderSkin({ TopWidth: top_width_value }, thisSkin);
          demoDiv.style.borderTopWidth = top_width_value + "px";
        } else {
          this.value = thisSkin.Width.split(" ")[0];
        }
      };
      group_custom_border_side.appendChild(input_border_top);
      let input_border_right = _textField("88px", "https://cdn.jsdelivr.net/gh/WiniGit/goline@785f3a1/lib/assets/border-right-black.svg", undefined, "0", "36px");
      input_border_right.style.marginLeft = "8px";
      input_border_right.lastChild.value = jsonSkin.Width.split(" ")[1];
      input_border_right.lastChild.onblur = function () {
        let right_width_value = parseFloat(this.value);
        if (right_width_value) {
          editBorderSkin({ RightWidth: right_width_value }, thisSkin);
          demoDiv.style.borderRightWidth = right_width_value + "px";
        } else {
          this.value = thisSkin.Width.split(" ")[1];
        }
      };
      group_custom_border_side.appendChild(input_border_right);
      let input_border_bottom = _textField("88px", "https://cdn.jsdelivr.net/gh/WiniGit/goline@785f3a1/lib/assets/border-bottom-black.svg", undefined, "0", "36px");
      input_border_bottom.style.marginRight = "8px";
      input_border_bottom.lastChild.value = jsonSkin.Width.split(" ")[2];
      input_border_bottom.lastChild.onblur = function () {
        let bottom_width_value = parseFloat(this.value);
        if (bottom_width_value) {
          editBorderSkin({ BottomWidth: bottom_width_value }, thisSkin);
          demoDiv.style.borderBottomWidth = bottom_width_value + "px";
        } else {
          this.value = thisSkin.Width.split(" ")[2];
        }
      };
      group_custom_border_side.appendChild(input_border_bottom);
      break;
    case EnumCate.effect:
      editName.onblur = function () {
        if (this.value != jsonSkin.Name) {
          let nameValue = this.value
            .replace("\\", "/")
            .split("/")
            .filter((_string) => _string.trim() != "");
          if (nameValue.length > 0) {
            editEffectSkin({ Name: this.value }, jsonSkin);
            this.value = jsonSkin.Name;
          } else {
            this.value = thisSkin.Name;
          }
        }
      };
      let demoShadow = document.createElement("div");
      demoShadow.style.width = "80px";
      demoShadow.style.height = "80px";
      demoShadow.style.borderRadius = "50%";
      demoShadow.style.left = "50%";
      demoShadow.style.top = "50%";
      demoShadow.style.position = "absolute";
      demoShadow.style.transform = "translate(-50%,-50%)";
      demoShadow.style.backgroundColor = "white";
      if (jsonSkin.Type == ShadowType.layer_blur) {
        demoShadow.style.filter = `blur(${jsonSkin.BlurRadius}px)`;
      } else {
        let effect_color = jsonSkin.ColorValue;
        /* offset-x | offset-y | blur-radius | spread-radius | color */
        demoShadow.style.boxShadow = `${jsonSkin.OffsetX}px ${jsonSkin.OffsetY}px ${jsonSkin.BlurRadius}px ${jsonSkin.SpreadRadius}px #${effect_color.substring(2)}${effect_color.substring(0, 2)} 
          ${jsonSkin.Type == ShadowType.inner ? "inset" : ""}`;
      }
      demoDiv.appendChild(demoShadow);
      //
      //
      let div_select_eType = document.createElement("div");
      div_select_eType.style.width = "calc(100% - 16px)";
      div_select_eType.style.display = "flex";
      div_select_eType.style.marginLeft = "8px";
      div_select_eType.style.alignItems = "center";
      body.appendChild(div_select_eType);
      // popup edit effect type attribute
      let effect_setting = createButtonAction("https://cdn.jsdelivr.net/gh/WiniGit/goline@785f3a1/lib/assets/effect-settings.svg", null, function () {
        let thisSkin = EffectDA.list.find((e) => e.GID == jsonSkin.GID);
        let popupEditEffect = document.createElement("div");
        let offset = effect_setting.getBoundingClientRect();
        popupEditEffect.style.left = offset.x - 8 + "px";
        popupEditEffect.style.top = offset.y + "px";
        popupEditEffect.style.transform = "translate(-100%,-80%)";
        popupEditEffect.className = "popup_edit_effect_attribute wini_popup col";
        let popup_title = document.createElement("span");
        popup_title.innerHTML = thisSkin.Type;
        popupEditEffect.appendChild(popup_title);
        let btn_close = document.createElement("i");
        btn_close.className = "fa-solid fa-xmark";
        btn_close.style.padding = "6px";
        btn_close.style.float = "right";
        btn_close.onclick = function () {
          popupEditEffect.remove();
        };
        popup_title.appendChild(btn_close);
        let div_attribute = document.createElement("div");
        popupEditEffect.appendChild(div_attribute);
        if (thisSkin.Type != ShadowType.layer_blur) {
          let input_offsetX = _textField("84px", undefined, "X", "0", undefined);
          input_offsetX.lastChild.value = thisSkin.OffsetX;
          input_offsetX.lastChild.onblur = function () {
            let thisSkin = EffectDA.list.find((e) => e.GID == jsonSkin.GID);
            if (!isNaN(parseFloat(this.value))) {
              editEffectSkin({ OffsetX: parseFloat(this.value) }, thisSkin);
              demoShadow.style.boxShadow = `${thisSkin.OffsetX}px ${thisSkin.OffsetY}px ${thisSkin.BlurRadius}px ${thisSkin.SpreadRadius}px #${thisSkin.ColorValue.substring(2)}${thisSkin.ColorValue.substring(0, 2)} 
                      ${thisSkin.Type == ShadowType.inner ? "inset" : ""}`;
            } else {
              this.value = thisSkin.OffsetX;
            }
          };
          div_attribute.appendChild(input_offsetX);
        }
        let input_blur = _textField("84px", undefined, "Blur", "0", undefined);
        input_blur.lastChild.value = thisSkin.BlurRadius;
        input_blur.lastChild.onblur = function () {
          let thisSkin = EffectDA.list.find((e) => e.GID == jsonSkin.GID);
          if (!isNaN(parseFloat(this.value))) {
            editEffectSkin({ BlurRadius: parseFloat(this.value) }, thisSkin);
            if (thisSkin.Type == ShadowType.layer_blur) {
              demoShadow.style.filter = `blur(${thisSkin.BlurRadius}px)`;
            } else {
              let effect_color = thisSkin.ColorValue;
              demoShadow.style.boxShadow = `${thisSkin.OffsetX}px ${thisSkin.OffsetY}px ${thisSkin.BlurRadius}px ${thisSkin.SpreadRadius}px #${effect_color.substring(2)}${effect_color.substring(0, 2)} 
                      ${thisSkin.Type == ShadowType.inner ? "inset" : ""}`;
            }
          } else {
            this.value = thisSkin.BlurRadius;
          }
        };
        div_attribute.appendChild(input_blur);
        if (thisSkin.Type != ShadowType.layer_blur) {
          let input_offsetY = _textField("84px", undefined, "Y", "0", undefined);
          input_offsetY.lastChild.value = thisSkin.OffsetY;
          input_offsetY.lastChild.onblur = function () {
            let thisSkin = EffectDA.list.find((e) => e.GID == jsonSkin.GID);
            if (!isNaN(parseFloat(this.value))) {
              editEffectSkin({ OffsetY: parseFloat(this.value) }, thisSkin);
              demoShadow.style.boxShadow = `${thisSkin.OffsetX}px ${thisSkin.OffsetY}px ${thisSkin.BlurRadius}px ${thisSkin.SpreadRadius}px #${thisSkin.ColorValue.substring(2)}${thisSkin.ColorValue.substring(0, 2)} 
                    ${thisSkin.Type == ShadowType.inner ? "inset" : ""}`;
            } else {
              this.value = thisSkin.OffsetY;
            }
          };
          let input_spread = _textField("84px", undefined, "Spread", "0", undefined);
          input_spread.lastChild.value = thisSkin.SpreadRadius;
          input_spread.lastChild.onblur = function () {
            let thisSkin = EffectDA.list.find((e) => e.GID == jsonSkin.GID);
            if (!isNaN(parseFloat(this.value))) {
              editEffectSkin({ SpreadRadius: parseFloat(this.value) }, thisSkin);
              demoShadow.style.boxShadow = `${thisSkin.OffsetX}px ${thisSkin.OffsetY}px ${thisSkin.BlurRadius}px ${thisSkin.SpreadRadius}px #${thisSkin.ColorValue.substring(2)}${thisSkin.ColorValue.substring(0, 2)} 
                    ${thisSkin.Type == ShadowType.inner ? "inset" : ""}`;
            } else {
              this.value = thisSkin.OffsetY;
            }
          };
          div_attribute.appendChild(input_offsetY);
          div_attribute.appendChild(input_spread);
          let inputEffectColor = createEditColorForm(
            function (newColor) {
              let thisSkin = EffectDA.list.find((e) => e.GID == jsonSkin.GID);
              editEffectSkin({ ColorValue: newColor }, thisSkin, false);
              demoShadow.style.boxShadow = `${thisSkin.OffsetX}px ${thisSkin.OffsetY}px ${thisSkin.BlurRadius}px ${thisSkin.SpreadRadius}px #${newColor.substring(2)}${newColor.substring(0, 2)} 
                    ${thisSkin.Type == ShadowType.inner ? "inset" : ""}`;
            },
            function (newColor) {
              let thisSkin = EffectDA.list.find((e) => e.GID == jsonSkin.GID);
              editEffectSkin({ ColorValue: newColor }, thisSkin);
              demoShadow.style.boxShadow = `${thisSkin.OffsetX}px ${thisSkin.OffsetY}px ${thisSkin.BlurRadius}px ${thisSkin.SpreadRadius}px #${newColor.substring(2)}${newColor.substring(0, 2)} 
                    ${thisSkin.Type == ShadowType.inner ? "inset" : ""}`;
            },
          );
          inputEffectColor.style.margin = "4px";
          var formEditColor = [...inputEffectColor.childNodes].find((e) => e.className == "parameter-form");
          formEditColor.childNodes.forEach((e) => {
            switch (e.className) {
              case "show-color-container":
                e.value = `#${thisSkin.ColorValue.substring(2)}`;
                break;
              case "edit-color-form":
                e.value = thisSkin.ColorValue.substring(2).toUpperCase();
                break;
              case "edit-opacity-form":
                e.value = Ultis.hexToPercent(thisSkin.ColorValue.substring(0, 2)) + "%";
                break;
              default:
                break;
            }
          });
          div_attribute.appendChild(inputEffectColor);
        }
        document.getElementById("body").appendChild(popupEditEffect);
        if (popupEditEffect.getBoundingClientRect().bottom >= document.body.offsetHeight) {
          popupEditEffect.style.top = `${document.body.offsetHeight - popupEditEffect.offsetHeight}px`;
        }
      });
      effect_setting.className = "action-button";
      div_select_eType.appendChild(effect_setting);
      // select effect type
      let btn_select_eType = _btnDropDownSelect(
        list_effect_type,
        function (options) {
          let thisSkin = EffectDA.list.find((e) => e.GID == jsonSkin.GID);
          for (let i = 0; i < options.length; i++) {
            if (options[i].getAttribute("value") == thisSkin.Type) {
              options[i].firstChild.style.opacity = 1;
            } else {
              options[i].firstChild.style.opacity = 0;
            }
          }
        },
        function (option) {
          let popupEditEffect = [...document.getElementById("body").childNodes].find((e) => e.className?.includes("popup_edit_effect_attribute"));
          if (popupEditEffect) {
            popupEditEffect.style.display = "none";
          }
          let thisSkin = EffectDA.list.find((e) => e.GID == jsonSkin.GID);
          editEffectSkin({ Type: option }, thisSkin);
          btn_select_eType.firstChild.innerHTML = option;
          if (thisSkin.Type == ShadowType.layer_blur) {
            demoShadow.style.filter = `blur(${thisSkin.BlurRadius}px)`;
          } else {
            let effect_color = thisSkin.ColorValue;
            /* offset-x | offset-y | blur-radius | spread-radius | color */
            demoShadow.style.boxShadow = `${thisSkin.OffsetX}px ${thisSkin.OffsetY}px ${thisSkin.BlurRadius}px ${thisSkin.SpreadRadius}px #${effect_color.substring(2)}${effect_color.substring(0, 2)} 
              ${thisSkin.Type == ShadowType.inner ? "inset" : ""}`;
          }
        },
      );
      btn_select_eType.firstChild.innerHTML = jsonSkin.Type;
      div_select_eType.appendChild(btn_select_eType);

      let btn_isShow = createButtonAction("https://cdn.jsdelivr.net/gh/WiniGit/goline@785f3a1/lib/assets/eye-outline.svg", "https://cdn.jsdelivr.net/gh/WiniGit/goline@785f3a1/lib/assets/eye-close.svg", function () { });
      btn_isShow.className = "action-button";
      div_select_eType.appendChild(btn_isShow);
      //
      //
      break;
    default:
      break;
  }
  return divEditSkin;
}

function wbaseSkinTile(enumCate, onclick, onRemove) {
  let wbase_skin_tile = document.createElement("div");
  wbase_skin_tile.className = "wbase_skin_tile";
  let btn_table_skin = document.createElement("div");
  btn_table_skin.onclick = function () {
    setTimeout(onclick, 200);
  };
  wbase_skin_tile.appendChild(btn_table_skin);
  let btn_unLink = document.createElement("img");
  btn_unLink.src = "https://cdn.jsdelivr.net/gh/WiniGit/goline@785f3a1/lib/assets/unlink-skin.svg";
  switch (enumCate) {
    case EnumCate.color:
      let demo_color = document.createElement("div");
      demo_color.style.width = "15px";
      demo_color.style.height = "15px";
      demo_color.style.borderRadius = "50%";
      demo_color.style.pointerEvents = "none";
      demo_color.style.border = "0.5px solid #c4c4c4";
      demo_color.style.backgroundColor = `#000000FF`;
      btn_table_skin.appendChild(demo_color);
      let color_name = document.createElement("p");
      color_name.innerHTML = "lalala";
      color_name.style.margin = "0 8px";
      color_name.style.flex = 1;
      color_name.style.pointerEvents = "none";
      btn_table_skin.appendChild(color_name);
      btn_unLink.onclick = function () {
        unlinkColorSkin();
        updateUIBackground();
      };
      break;
    case EnumCate.typography:
      let demo_typo = document.createElement("p");
      demo_typo.innerHTML = "Ag";
      demo_typo.style.fontSize = "14px";
      demo_typo.style.pointerEvents = "none";
      btn_table_skin.appendChild(demo_typo);
      let typo_name = document.createElement("div");
      typo_name.style.margin = "0 8px";
      typo_name.style.flex = 1;
      typo_name.style.display = "flex";
      typo_name.style.pointerEvents = "none";
      let title_name = document.createElement("p");
      title_name.innerHTML = "lalala";
      let title_style = document.createElement("p");
      title_style.innerHTML = ` . 14/16`;
      title_style.style.color = "#c4c4c4";
      typo_name.appendChild(title_name);
      typo_name.appendChild(title_style);
      btn_table_skin.appendChild(typo_name);
      btn_unLink.onclick = function () {
        unlinkTypoSkin();
        updateUITextStyle();
      };
      break;
    case EnumCate.border:
      let demo_border = document.createElement("div");
      demo_border.style.width = "15px";
      demo_border.style.height = "15px";
      demo_border.style.borderRadius = "50%";
      demo_border.style.pointerEvents = "none";
      demo_border.style.border = "0.5px solid #c4c4c4";
      demo_border.style.backgroundColor = `#000000FF`;
      btn_table_skin.appendChild(demo_border);
      let border_name = document.createElement("p");
      border_name.innerHTML = "lalala";
      border_name.style.margin = "0 8px";
      border_name.style.flex = 1;
      border_name.style.textAlign = "left";
      border_name.style.pointerEvents = "none";
      btn_table_skin.appendChild(border_name);
      btn_unLink.onclick = function () {
        unlinkBorderSkin();
        updateUIBorder();
      };
      break;
    case EnumCate.effect:
      let demo_effect = document.createElement("img");
      demo_effect.src = "https://cdn.jsdelivr.net/gh/WiniGit/goline@785f3a1/lib/assets/effect-settings.svg";
      demo_effect.style.width = "16px";
      demo_effect.style.height = "16px";
      demo_effect.style.pointerEvents = "none";
      btn_table_skin.appendChild(demo_effect);
      let effect_name = document.createElement("p");
      effect_name.innerHTML = "lalala";
      effect_name.style.margin = "0 8px";
      effect_name.style.flex = 1;
      effect_name.style.textAlign = "left";
      effect_name.style.pointerEvents = "none";
      btn_table_skin.appendChild(effect_name);
      btn_unLink.onclick = function () {
        unlinkEffectSkin();
        updateUIEffect();
      };
      break;
    default:
      break;
  }
  wbase_skin_tile.appendChild(btn_unLink);
  if (onRemove) {
    let btn_remove_color = document.createElement("img");
    btn_remove_color.src = "https://cdn.jsdelivr.net/gh/WiniGit/goline@785f3a1/lib/assets/minus.svg";
    wbase_skin_tile.appendChild(btn_remove_color);
    btn_remove_color.onclick = onRemove;
  }
  return wbase_skin_tile;
}

function hidePopup(event) {
  let list_popup = document.getElementsByClassName("wini_popup");
  let actived_popup = [...list_popup].filter((e) => window.getComputedStyle(e).display != "none");
  if (actived_popup.length > 0) {
    let isOpenImgDoc = false;
    let pop_up = [...event.composedPath()].find((eHTML) => {
      if (eHTML.id === "popup_img_document") isOpenImgDoc = true;
      return eHTML.classList?.contains("wini_popup");
    });
    if (!pop_up) {
      for (let i = 0; i < actived_popup.length; i++) {
        if (actived_popup[i].classList.contains("popup_remove")) {
          if (!isOpenImgDoc || !actived_popup[i].classList.contains("fake-data-popup")) actived_popup[i].remove();
        } else {
          actived_popup[i].style.display = "none";
        }
      }
    }
  }
}

function isHidden(elHTML) {
  let bouncingClient = elHTML?.getBoundingClientRect();
  if (bouncingClient) {
    let offsetTop = 0;
    let offsetLeft = left_view.offsetWidth;
    let offsetBottom = divMain.offsetHeight;
    let offsetRight = divMain.offsetWidth - right_view.offsetWidth;
    if (bouncingClient.right > offsetLeft && bouncingClient.x < offsetRight && bouncingClient.bottom > offsetTop && bouncingClient.y < offsetBottom) {
      return false;
    } else if (bouncingClient.right < offsetLeft && bouncingClient.right > offsetRight && bouncingClient.bottom > offsetTop && bouncingClient.y < offsetBottom) {
      return false;
    } else if (bouncingClient.right > offsetLeft && bouncingClient.x < offsetRight && bouncingClient.bottom < offsetTop && bouncingClient.bottom > offsetBottom) {
      return false;
    } else if (bouncingClient.right < offsetLeft && bouncingClient.right > offsetRight && bouncingClient.bottom < offsetTop && bouncingClient.bottom > offsetBottom) {
      return false;
    } else {
      return true;
    }
  } else {
    return true;
  }
}

//! variants
function createEditVariants() {
  let editContainer = document.createElement("div");
  editContainer.id = "edit_variant";
  editContainer.style.padding = "8px 0";
  editContainer.className = "edit-container";

  let header = document.createElement("div");
  header.className = "header_design_style";
  editContainer.appendChild(header);

  let btnTitle = document.createElement("div");
  btnTitle.style.display = "flex";
  btnTitle.style.alignItems = "center";
  btnTitle.style.padding = "4px 4px 8px 4px";
  btnTitle.style.marginRight = "16px";
  header.appendChild(btnTitle);

  let action_add = document.createElement("i");
  action_add.className = "fa-solid fa-plus fa-sm";
  action_add.style.padding = "12px 8px";
  action_add.style.marginRight = "8px";
  action_add.onclick = function () {
    let newProperty = PropertyDA.newProperty;
    newProperty.GID = uuidv4();
    newProperty.BaseID = selected_list[0].GID;
    PropertyDA.add(newProperty);
    newProperty.BasePropertyItems = [];
    updateUIVariant();
  };
  header.appendChild(action_add);

  let div_list_property = document.createElement("div");
  div_list_property.id = "list_property_div";

  // TH đang chọn obj là component có nhiều variants
  if (selected_list.length == 1 && selected_list[0].CateID == EnumCate.variant) {
    let titleInnerHTML = document.createElement("p");
    titleInnerHTML.style.margin = "4px 0 0 6px";
    titleInnerHTML.innerHTML = "Property";
    btnTitle.style.pointerEvents = "none";
    btnTitle.replaceChildren(titleInnerHTML);
    action_add.style.display = "flex";
    editContainer.appendChild(div_list_property);
    let list_property_tile = [];
    for (let propertyItem of selected_list[0].PropertyItems) {
      let property_tile = _editPropertyTile(propertyItem);
      list_property_tile.push(property_tile);
    }
    div_list_property.replaceChildren(...list_property_tile);
  }
  // TH đang chọn nhiều obj là component nhg ko có variants con nào
  else if (select_box_parentID != wbase_parentID && document.getElementById(select_box_parentID).getAttribute("cateid") == EnumCate.variant) {
    btnTitle.style.pointerEvents = "none";
    action_add.style.display = "none";
    // TH các component này là những variant của 1 component cha
    let titleInnerHTML = document.createElement("p");
    titleInnerHTML.style.margin = "4px 0 0 6px";
    titleInnerHTML.innerHTML = "Current variant";
    btnTitle.replaceChildren(titleInnerHTML);
    editContainer.appendChild(div_list_property);
    let list_property_tile = [];
    let list_base_property = selected_list.map((e) => e.BasePropertyItems);
    if (list_base_property.length === 0) {
      list_base_property = list_base_property[0];
    } else if (list_base_property.length > 1) {
      list_base_property = list_base_property.reduce((a, b) => a.concat(b));
    }
    let listProperty = PropertyDA.list.filter((e) => e.BaseID == select_box_parentID);
    for (let property_item of listProperty) {
      let list_baseProperty_name = list_base_property.filter((e) => e.PropertyID == property_item.GID).filterAndMap((e) => e.Name);
      let firstValue;
      if (list_baseProperty_name.length == 0) {
        firstValue = "---";
      } else if (list_baseProperty_name.length == 1) {
        firstValue = list_baseProperty_name[0];
      } else {
        firstValue = "mixed";
      }
      let property_tile = _selectPropertyVariant(property_item, firstValue, function (option, property) {
        let deleteBaseProperty = option.trim().replace("-", "") == "" || option.trim() == "none";
        for (let wbaseItem of selected_list) {
          let base_property_item = property.BasePropertyItems.find((e) => e.BaseID == wbaseItem.GID);
          if (base_property_item) {
            isChange = true;
            if (deleteBaseProperty) {
              property.BasePropertyItems = property.BasePropertyItems.filter((e) => e.GID != base_property_item.GID);
              wbaseItem.BasePropertyItems = wbaseItem.BasePropertyItems.filter((e) => e.GID != base_property_item.GID);
            } else {
              base_property_item.Name = option;
              wbaseItem.BasePropertyItems = wbaseItem.BasePropertyItems.filter((e) => e.PropertyID !== property.GID);
              wbaseItem.BasePropertyItems.push(base_property_item);
            }
          } else if (!deleteBaseProperty) {
            isChange = true;
            let newBaseProperty = {
              GID: uuidv4(),
              Name: option,
              BaseID: wbaseItem.GID,
              PropertyID: property.GID,
            };
            if (!wbaseItem.BasePropertyItems) {
              wbaseItem.BasePropertyItems = [];
            }
            property.BasePropertyItems.push(newBaseProperty);
          }
          PropertyDA.edit(property);
        }
        updateUIVariant();
      });
      list_property_tile.push(property_tile);
    }
    div_list_property.replaceChildren(...list_property_tile);
  } else if (selected_list.length > 1 && selected_list.every((e) => e.IsWini && e.CateID != EnumCate.variant)) {
    btnTitle.style.pointerEvents = "none";
    let titleInnerHTML = document.createElement("p");
    titleInnerHTML.style.margin = "4px 0 0 6px";
    titleInnerHTML.innerHTML = "Components";
    btnTitle.replaceChildren(titleInnerHTML);
    let btn_combine_variant = document.createElement("div");
    btn_combine_variant.id = "btn_combine_variant";
    btn_combine_variant.innerHTML = "Combine as variant";
    editContainer.appendChild(btn_combine_variant);
    btn_combine_variant.onclick = function () {
      combineAsVariant();
      updateUIVariant();
    };
    action_add.style.display = "none";
  } else {
    let listVariantID = selected_list.filterAndMap((e) => e.ChildID); // filterSameValue loại bỏ các giá trị đã có trong list (trong file Utils)
    let listWBaseVariant = assets_list.filter((e) => listVariantID.includes(e.GID));
    let listComponentID = listWBaseVariant.filterAndMap((e) => e.ParentID);
    if (listComponentID.length == 1 && selected_list.every((e) => e.ChildID) && listWBaseVariant.some((e) => e.BasePropertyItems && e.BasePropertyItems.length > 0)) {
      let wbaseComponent = assets_list.find((e) => e.GID == listComponentID[0]);
      btnTitle.style.border = "1.5px solid transparent";
      btnTitle.style.borderRadius = "2px";
      btnTitle.style.pointerEvents = "auto";
      let title = document.createElement("p");
      title.innerHTML = wbaseComponent.Name;
      title.style.margin = "4px 0 0 6px";
      let suffixIcon = document.createElement("i");
      suffixIcon.className = "fa-solid fa-chevron-down fa-sm";
      suffixIcon.style.padding = "5px 6px 0 6px";
      btnTitle.replaceChildren(title, suffixIcon);
      btnTitle.addEventListener("mouseover", function () {
        this.style.borderColor = "#f1f1f1";
        this.style.justifyContent = "space-between";
      });
      btnTitle.addEventListener("mouseout", function () {
        this.style.borderColor = "transparent";
        this.style.justifyContent = "start";
      });
      action_add.style.display = "none";

      editContainer.appendChild(div_list_property);
      let list_property_tile = [];
      let list_base_property = listWBaseVariant.map((e) => e.BasePropertyItems).reduce((a, b) => a.concat(b));
      let propertyItemList = wbaseComponent.PropertyItems ?? PropertyDA.list.filter((prt) => prt.BaseID === wbaseComponent.GID) ?? [];
      for (let property_item of propertyItemList) {
        let list_baseProperty_name = list_base_property.filter((e) => e.PropertyID == property_item.GID).map((e) => e.Name);
        let firstValue = list_baseProperty_name[0];
        if (list_baseProperty_name.some((e) => e != firstValue)) {
          firstValue = "mixed";
        }
        let property_tile = _selectPropertyVariant(
          property_item,
          firstValue,
          function (option, property) {
            changeProperty(property.BasePropertyItems.find((e) => e.Name == option)?.BaseID);
            updateUIVariant();
          },
          false,
        );
        list_property_tile.push(property_tile);
      }
      div_list_property.replaceChildren(...list_property_tile);
    } else {
      return document.createElement("div");
    }
  }
  return editContainer;
}

function updateUIVariant() {
  let newEditVariants = createEditVariants();
  document.getElementById("edit_variant").replaceWith(newEditVariants);
}

function _editPropertyTile(property_item) {
  let property_tile = document.createElement("div");
  property_tile.id = `propertyID:${property_item.GID}`;
  property_tile.className = "property_tile";
  let variant_icon = document.createElement("i");
  variant_icon.className = "fa-solid fa-diamond fa-xs";
  property_tile.appendChild(variant_icon);
  let property_name = document.createElement("input");
  property_name.value = property_item.Name;
  property_name.readOnly = true;
  property_name.ondblclick = function (e) {
    e.stopPropagation();
    this.readOnly = false;
    this.focus();
    this.style.borderRadius = "2px";
    this.style.border = "1.5px solid #1890ff";
    this.setSelectionRange(0, this.value.length);
    div_property_infor.style.display = "none";
  };
  property_name.onblur = function () {
    window.getSelection().removeAllRanges();
    this.readOnly = true;
    this.style.borderRadius = "2px";
    this.style.border = "none";
    div_property_infor.style.display = "flex";
    let thisProperty = PropertyDA.list.find((e) => e.GID == property_tile.id.replace("propertyID:", ""));
    thisProperty.Name = this.value;
    PropertyDA.edit(thisProperty);
  };
  property_tile.appendChild(property_name);
  let div_property_infor = document.createElement("div");
  div_property_infor.className = "row";
  div_property_infor.style.width = "120px";
  property_tile.appendChild(div_property_infor);
  let baseProperty_name = document.createElement("p");
  let list_baseProperty_name = [];
  for (let baseProperty of property_item.BasePropertyItems) {
    if (list_baseProperty_name.length == 0 || !list_baseProperty_name.some((name) => name == baseProperty.Name)) {
      list_baseProperty_name.push(baseProperty.Name);
    }
  }
  baseProperty_name.innerHTML = list_baseProperty_name.join(",");
  div_property_infor.appendChild(baseProperty_name);
  let group_action_btn = document.createElement("div");
  group_action_btn.className = "group_action_btn_property_tile";
  div_property_infor.appendChild(group_action_btn);
  let btn_infor = document.createElement("i");
  btn_infor.className = "fa-solid fa-sliders fa-sm";
  group_action_btn.appendChild(btn_infor);
  let btn_remove = document.createElement("i");
  btn_remove.className = "fa-solid fa-minus fa-sm";
  btn_remove.onclick = function () {
    let thisProperty = PropertyDA.list.find((e) => e.GID == property_tile.id.replace("propertyID:", ""));
    if (PropertyDA.list.filter((e) => e.BaseID == thisProperty.BaseID).length > 1) {
      PropertyDA.delete(thisProperty);
      updateUIVariant();
    }
  };
  group_action_btn.appendChild(btn_remove);
  return property_tile;
}

function _selectPropertyVariant(property_item, title, onSelect, enableInput = true) {
  let property_tile = document.createElement("div");
  property_tile.id = property_item.GID;
  property_tile.className = "select_base_property_tile";
  let property_name = document.createElement("p");
  property_name.innerHTML = property_item.Name;
  property_name.style.width = "68px";
  property_tile.appendChild(property_name);
  let select_variant = document.createElement("div");
  select_variant.className = "select_property_variant";
  property_tile.appendChild(select_variant);
  let input_baseProperty_name = document.createElement("input");
  input_baseProperty_name.value = title;
  input_baseProperty_name.readOnly = !enableInput;
  input_baseProperty_name.onfocus = function () {
    this.setSelectionRange(0, this.value.length);
  };
  input_baseProperty_name.onblur = function () {
    window.getSelection().removeAllRanges();
    onSelect(this.value, property_item);
  };
  select_variant.appendChild(input_baseProperty_name);
  let btn_dropdown = document.createElement("i");
  btn_dropdown.className = "fa-solid fa-chevron-down fa-xs";
  select_variant.appendChild(btn_dropdown);
  let dropdown = document.createElement("div");
  dropdown.className = "dropdown_select_baseProperty wini_popup";
  select_variant.appendChild(dropdown);
  btn_dropdown.onclick = function () {
    setTimeout(function () {
      dropdown.style.display = "flex";
      dropdown.style.zIndex = 2;
      let list_baseProperty_name = [];
      if (input_baseProperty_name.value == "mixed") {
        list_baseProperty_name.push("mixed");
      }
      list_baseProperty_name.push(...property_item.BasePropertyItems.filterAndMap((e) => e.Name));
      let list_option = [];
      for (let i = 0; i < list_baseProperty_name.length; i++) {
        let option = document.createElement("div");
        option.className = "row";
        option.setAttribute("value", list_baseProperty_name[i]);
        if (list_baseProperty_name[i] == "mixed") {
          option.style.borderBottom = "1px solid #c4c4c4";
          option.style.pointerEvents = "none";
          option.style.opacity = 0.7;
        }
        option.onclick = function () {
          let option_value = this.getAttribute("value");
          if (option_value != input_baseProperty_name.value) {
            onSelect(option_value, property_item);
          }
          dropdown.style.display = "none";
        };
        // option.setAttribute("value", base_property_item.GID);
        let icon_check = document.createElement("i");
        icon_check.className = "fa-solid fa-check fa-sm";
        icon_check.style.boxSizing = "border-box";
        icon_check.style.marginRight = "8px";
        icon_check.style.pointerEvents = "none";
        if (list_baseProperty_name[i] != input_baseProperty_name.value) {
          icon_check.style.opacity = 0;
        }
        let title = document.createElement("span");
        title.innerHTML = list_baseProperty_name[i];
        title.style.pointerEvents = "none";
        option.replaceChildren(icon_check, title);
        list_option.push(option);
      }
      dropdown.replaceChildren(...list_option);
    }, 200);
  };
  return property_tile;
}

function createSelectionSkins() {
  let selectionSkins = document.createElement("div");
  selectionSkins.id = "selection_skins";
  selectionSkins.className = "edit-container";
  selectionSkins.style.paddingLeft = "0px";
  selectionSkins.style.paddingRight = "0px";

  let header = document.createElement("div");
  header.className = "header_design_style";
  header.style.paddingLeft = "12px";
  header.style.paddingRight = "8px";
  selectionSkins.appendChild(header);
  let title = document.createElement("p");
  title.innerHTML = "Local Skins";
  header.appendChild(title);

  let btnSelectSkin = createButtonAction("https://cdn.jsdelivr.net/gh/WiniGit/goline@785f3a1/lib/assets/read.svg", null, StyleDA.getListMergeSkin);
  header.appendChild(btnSelectSkin);

  let body = document.createElement("div");
  let cateItems = [{ ID: EnumCate.color, Name: "Color skins" }, ...CateDA.list_color_cate, { ID: EnumCate.typography, Name: "Typography skins" }, ...CateDA.list_typo_cate, { ID: EnumCate.border, Name: "Border skins" }, ...CateDA.list_border_cate, { ID: EnumCate.effect, Name: "Effect skins" }, ...CateDA.list_effect_cate];
  body.replaceChildren(...cateItems.map((cateItem) => createCateSkinHTML(cateItem)));
  selectionSkins.appendChild(body);
  return selectionSkins;
}

function updateUISelectionSkins() {
  let newSelectionSkins = createSelectionSkins();
  document.getElementById("selection_skins")?.replaceWith(newSelectionSkins);
}

function mergeSkinDialog() {
  document.getElementById("dialog_merge_skin")?.parentElement?.remove();
  let dialogBackground = document.createElement("div");
  dialogBackground.className = "dialog-background";
  dialogBackground.style.paddingTop = "46px";
  document.getElementById("body").appendChild(dialogBackground);
  document.getElementById("body").querySelector("#header").style.pointerEvents = "none";
  //
  let dialog = document.createElement("div");
  dialog.id = "dialog_merge_skin";
  dialogBackground.appendChild(dialog);
  //
  let header = document.createElement("div");
  header.className = "header";
  dialog.appendChild(header);
  let title = document.createElement("p");
  title.innerHTML = "Merge skins";
  header.appendChild(title);
  let closeBtn = document.createElement("i");
  closeBtn.className = "fa-solid fa-xmark fa-lg";
  closeBtn.style.padding = "8px";
  closeBtn.onclick = function (e) {
    e.stopPropagation();
    dialogBackground.remove();
  };
  header.appendChild(closeBtn);
  //
  let content = document.createElement("div");
  content.id = "merge_skins_dialog_content";
  content.setAttribute("listMergeSkin", JSON.stringify([]));
  content.className = "col";
  dialog.appendChild(content);

  let contentTitle = document.createElement("div");
  contentTitle.style.padding = "4px 8px";
  contentTitle.className = "row";
  let conflictSkinTitle = document.createElement("p");
  conflictSkinTitle.innerHTML = "Foreign skins";
  let mergeSkinTitle = document.createElement("p");
  mergeSkinTitle.innerHTML = "Local skins";
  contentTitle.replaceChildren(conflictSkinTitle, mergeSkinTitle);
  function getUndefinedSkin(skinList) {
    return skinList.filter((skinItem) => {
      let thisProjectID = skinItem.ProjectID ?? ProjectDA.obj.ID;
      if (thisProjectID == ProjectDA.obj.ID) return false;
      return StyleDA.mergeSkins.ListItem.every((projectStyle) => projectStyle.ID != thisProjectID);
    });
  }
  content.replaceChildren(
    contentTitle,
    ...[
      {
        ID: 0,
        Name: "undefined projects",
        ColorItems: getUndefinedSkin(ColorDA.list),
        TextStyleItems: getUndefinedSkin(TypoDA.list),
        BorderItems: getUndefinedSkin(BorderDA.list),
        EffectItems: getUndefinedSkin(EffectDA.list),
      },
      ...StyleDA.mergeSkins.ListItem,
    ].map((skinProjectItem) => conflictSkinInProject(skinProjectItem)),
  );

  let dialogBottom = document.createElement("div");
  dialogBottom.className = "dialog_bottom";
  dialog.appendChild(dialogBottom);
  let submitButton = document.createElement("div");
  submitButton.innerHTML = "Save change";
  submitButton.onclick = function (e) {
    e.stopPropagation();
    let listMergeSkin = JSON.parse(content.getAttribute("listMergeSkin"));
    console.log(listMergeSkin);
    let styleInitItem = {};
    let ColorItems = ColorDA.list.filter((skinItem) => {
      let mergeSkin = listMergeSkin.find((e) => e.GID == skinItem.GID);
      if (mergeSkin) {
        skinItem.ListID = mergeSkin.ListID;
        return true;
      } else return false;
    });
    if (ColorItems.length > 0) {
      styleInitItem.ColorItems = ColorItems;
    }
    let TextStyleItems = TypoDA.list.filter((skinItem) => {
      let mergeSkin = listMergeSkin.find((e) => e.GID == skinItem.GID);
      if (mergeSkin) {
        skinItem.ListID = mergeSkin.ListID;
        return true;
      } else return false;
    });
    if (TextStyleItems.length > 0) {
      styleInitItem.TextStyleItems = TextStyleItems;
    }
    let BorderItems = BorderDA.list.filter((skinItem) => {
      let mergeSkin = listMergeSkin.find((e) => e.GID == skinItem.GID);
      if (mergeSkin) {
        skinItem.ListID = mergeSkin.ListID;
        return true;
      } else return false;
    });
    if (BorderItems.length > 0) {
      styleInitItem.BorderItems = BorderItems;
    }
    let EffectItems = EffectDA.list.filter((skinItem) => {
      let mergeSkin = listMergeSkin.find((e) => e.GID == skinItem.GID);
      if (mergeSkin) {
        skinItem.ListID = mergeSkin.ListID;
        return true;
      } else return false;
    });
    if (EffectItems.length > 0) {
      styleInitItem.EffectItems = EffectItems;
    }
    console.log(styleInitItem);
    StyleDA.mergeSkin(styleInitItem);
    updateUISelectionSkins();
    dialogBackground.remove();
  };
  dialogBottom.replaceChildren(submitButton);
}

function conflictSkinInProject(skinProjectItem) {
  if (skinProjectItem.ColorItems.length == 0 && skinProjectItem.TextStyleItems.length == 0 && skinProjectItem.BorderItems.length == 0 && skinProjectItem.EffectItems.length == 0) return document.createElement("div");
  let isShow = true;
  let container = document.createElement("div");
  container.className = "col";
  container.style.borderBottom = "1px solid #e5e5e5";
  let titleTile = document.createElement("div");
  titleTile.className = "row";
  titleTile.style.padding = "0 8px";
  titleTile.style.color = "#8C8C8C";
  let prefixIcon = document.createElement("i");
  prefixIcon.className = "fa-solid fa-caret-down";
  prefixIcon.style.padding = "8px";
  prefixIcon.onclick = function (e) {
    e.stopPropagation();
    isShow = !isShow;
    if (isShow) {
      prefixIcon.className = "fa-solid fa-caret-down";
      container.querySelectorAll(":scope > *").forEach((childHTML) => (childHTML.style.display = "flex"));
    } else {
      prefixIcon.className = "fa-solid fa-caret-right";
      container.querySelectorAll(":scope > *").forEach((childHTML) => (childHTML.style.display = "none"));
      titleTile.style.display = "flex";
    }
  };
  let title = document.createElement("p");
  title.className = "semibold2";
  title.style.color = "#8C8C8C";
  title.style.margin = "0";
  title.style.marginLeft = "4px";
  titleTile.replaceChildren(prefixIcon, title);
  title.innerHTML = skinProjectItem.Name;
  let conflictSkins = [
    {
      ID: EnumCate.color,
      Name: "Color skins",
      listSkin: skinProjectItem.ColorItems,
    },
    {
      ID: EnumCate.typography,
      Name: "Typography skins",
      listSkin: skinProjectItem.TextStyleItems,
    },
    {
      ID: EnumCate.border,
      Name: "Border skins",
      listSkin: skinProjectItem.BorderItems,
    },
    {
      ID: EnumCate.effect,
      Name: "Effect skins",
      listSkin: skinProjectItem.EffectItems,
    },
  ];
  container.replaceChildren(titleTile, ...conflictSkins.map((cateItem) => mergeSkinByCate(cateItem, cateItem.listSkin)));
  return container;
}

function mergeSkinByCate(cateItem, listSkin) {
  let enumCate = cateItem.ParentID ?? cateItem.ID;
  let isShow = true;
  let children = [];
  let cateContainer = document.createElement("div");
  cateContainer.className = "col";
  let titleContainer = document.createElement("div");
  titleContainer.className = "cate-title";
  if (cateItem.ID != enumCate) {
    titleContainer.style.padding = "4px 8px 4px 36px";
  }
  children.push(titleContainer);
  let prefixIcon = document.createElement("i");
  prefixIcon.className = "fa-solid fa-caret-down";
  prefixIcon.onclick = function (e) {
    e.stopPropagation();
    isShow = !isShow;
    if (isShow) {
      prefixIcon.className = "fa-solid fa-caret-down";
      cateContainer.querySelectorAll(":scope > *").forEach((childHTML) => (childHTML.style.display = "flex"));
    } else {
      prefixIcon.className = "fa-solid fa-caret-right";
      cateContainer.querySelectorAll(":scope > *").forEach((childHTML) => (childHTML.style.display = "none"));
      titleContainer.style.display = "flex";
    }
  };
  let title = document.createElement("p");
  title.innerHTML = cateItem.Name;
  titleContainer.replaceChildren(prefixIcon, title);
  switch (enumCate) {
    case EnumCate.color:
      let colorSkins = listSkin;
      let colorCateItems = [];
      if (colorSkins.length > 0) {
        if (cateItem.ID == enumCate) {
          colorCateItems = colorSkins.filterAndMap((skinItem) => skinItem.CateID);
          colorCateItems = StyleDA.mergeSkins.WCategoryItems.filter((cate_item) => {
            let check = cate_item.ID != enumCate && colorCateItems.some((id) => cate_item.ID == id);
            if (check) cate_item.ParentID = enumCate;
            return check;
          });
        }
        colorSkins = colorSkins.filter((skinItem) => skinItem.CateID == cateItem.ID);
        children.push(...colorSkins.map((skinItem) => mergeSkinTile(enumCate, skinItem)));
        children.push(...colorCateItems.map((cate_item) => mergeSkinByCate(cate_item, listSkin)));
      }
      break;
    case EnumCate.typography:
      let typoSkins = listSkin;
      if (typoSkins.length > 0) {
        let typoCateItems = [];
        if (cateItem.ID == enumCate) {
          typoCateItems = typoSkins.filterAndMap((skinItem) => skinItem.CateID);
          typoCateItems = StyleDA.mergeSkins.WCategoryItems.filter((cate_item) => {
            let check = cate_item.ID != enumCate && typoCateItems.some((id) => cate_item.ID == id);
            if (check) cate_item.ParentID = enumCate;
            return check;
          });
        }
        typoSkins = typoSkins.filter((skinItem) => skinItem.CateID == cateItem.ID);
        children.push(...typoSkins.map((skinItem) => mergeSkinTile(enumCate, skinItem)));
        children.push(...typoCateItems.map((cate_item) => mergeSkinByCate(cate_item, listSkin)));
      }
      break;
    case EnumCate.border:
      let borderSkins = listSkin;
      if (borderSkins.length > 0) {
        let borderCateItems = [];
        if (cateItem.ID == enumCate) {
          borderCateItems = borderSkins.filterAndMap((skinItem) => skinItem.CateID);
          borderCateItems = StyleDA.mergeSkins.WCategoryItems.filter((cate_item) => {
            let check = cate_item.ID != enumCate && borderCateItems.some((id) => cate_item.ID == id);
            if (check) cate_item.ParentID = enumCate;
            return check;
          });
        }
        borderSkins = borderSkins.filter((skinItem) => skinItem.CateID == cateItem.ID);
        children.push(...borderSkins.map((skinItem) => mergeSkinTile(enumCate, skinItem)));
        children.push(...borderCateItems.map((cate_item) => mergeSkinByCate(cate_item, listSkin)));
      }
      break;
    case EnumCate.effect:
      let effectSkins = listSkin;
      if (effectSkins.length > 0) {
        let effectCateItems = [];
        if (cateItem.ID == enumCate) {
          effectCateItems = effectSkins.filterAndMap((skinItem) => skinItem.CateID);
          effectCateItems = StyleDA.mergeSkins.WCategoryItems.filter((cate_item) => {
            let check = cate_item.ID != enumCate && effectCateItems.some((id) => cate_item.ID == id);
            if (check) cate_item.ParentID = enumCate;
            return check;
          });
        }
        effectSkins = effectSkins.filter((skinItem) => skinItem.CateID == cateItem.ID);
        children.push(...effectSkins.map((skinItem) => mergeSkinTile(enumCate, skinItem)));
        children.push(...effectCateItems.map((cate_item) => mergeSkinByCate(cate_item, listSkin)));
      }
      break;
    default:
      break;
  }
  if (children.length == 1) {
    return document.createElement("div");
  } else {
    cateContainer.replaceChildren(...children);
    return cateContainer;
  }
}

function mergeSkinTile(enumCate, jsonSkin) {
  let mergeSkinTile = document.createElement("div");
  mergeSkinTile.className = "merge-skin-tile";
  let conflictSkin = document.createElement("div");
  if (enumCate != jsonSkin.CateID) {
    conflictSkin.style.paddingLeft = "40px";
  }
  let localSkin = document.createElement("div");
  mergeSkinTile.replaceChildren(conflictSkin, localSkin);
  function onSelectLocalSkin(option) {
    let dialogContent = document.getElementById("merge_skins_dialog_content");
    let listMergeSkin = JSON.parse(dialogContent.getAttribute("listMergeSkin"));
    let localSkinItem = listMergeSkin.find((skin_item) => skin_item.GID == option.GID);
    let oldLocalSkinItem = listMergeSkin.find((skin_item) => skin_item.ListID.includes(jsonSkin.GID));
    if (oldLocalSkinItem) {
      let newListID = oldLocalSkinItem.ListID.split(",").filter((id) => id != jsonSkin.GID);
      if (newListID.length == 0) {
        listMergeSkin = listMergeSkin.filter((skin_item) => skin_item.GID != oldLocalSkinItem.GID);
      } else {
        oldLocalSkinItem.ListID = newListID.join(",");
      }
    }
    if (localSkinItem) {
      localSkinItem.ListID = localSkinItem.ListID + `,${jsonSkin.GID}`;
    } else {
      listMergeSkin.push({ GID: option.GID, ListID: jsonSkin.GID });
    }
    dialogContent.setAttribute("listMergeSkin", JSON.stringify(listMergeSkin));
  }
  switch (enumCate) {
    case EnumCate.color:
      var demoDiv1 = document.createElement("div");
      demoDiv1.className = "demo-div";
      demoDiv1.style.border = "1px solid #8c8c8c";
      demoDiv1.style.backgroundColor = `#${jsonSkin.Value.substring(2)}${jsonSkin.Value.substring(0, 2)}`;
      var skinTitle = document.createElement("p");
      skinTitle.className = "regular1";
      skinTitle.innerHTML = jsonSkin.Name;
      conflictSkin.replaceChildren(demoDiv1, skinTitle);
      var arrowIcon = document.createElement("i");
      arrowIcon.className = "fa-solid fa-arrow-right";
      var inputLocalSkin;
      var iconSearch = document.createElement("i");
      iconSearch.className = "fa-solid fa-magnifying-glass";
      inputLocalSkin = suggestInput(
        ColorDA.list.filter((skin) => (skin.ProjectID ?? ProjectDA.obj.ID) == ProjectDA.obj.ID),
        "color skins name",
        iconSearch,
        function (option) {
          let optionTile = document.createElement("div");
          optionTile.className = "row";
          optionTile.style.padding = "2px 8px";
          let demoColor = document.createElement("div");
          demoColor.style.width = "20px";
          demoColor.style.height = "20px";
          demoColor.style.borderRadius = "50%";
          demoColor.style.border = "1px solid #8c8c8c";
          demoColor.style.backgroundColor = `#${option.Value.substring(2)}${option.Value.substring(0, 2)}`;
          let cateItem;
          if (option.CateID !== EnumCate.color) cateItem = CateDA.list_color_cate.find((e) => e.ID === option.CateID);
          let optionTitle = document.createElement("p");
          optionTitle.innerHTML = (cateItem?.Name ?? "") + "/" + option.Name;
          optionTitle.className = "regular1";
          optionTitle.style.color = "#ffffff";
          optionTitle.style.margin = "6px 8px";
          optionTile.replaceChildren(demoColor, optionTitle);
          return optionTile;
        },
        function (option) {
          onSelectLocalSkin(option);
          let demoDiv = document.createElement("div");
          demoDiv.className = "demo-div";
          demoDiv.style.background = `#${option.Value.substring(2)}${option.Value.substring(0, 2)}`;
          iconSearch.replaceWith(demoDiv);
        },
      );
      localSkin.replaceChildren(arrowIcon, inputLocalSkin);
      break;
    case EnumCate.typography:
      var demoDiv1 = document.createElement("div");
      demoDiv1.className = "demo-div";
      demoDiv1.innerHTML = "Ag";
      demoDiv1.style.fontSize = "12px";
      demoDiv1.style.display = "flex";
      demoDiv1.style.alignItems = "center";
      demoDiv1.style.justifyContent = "center";
      demoDiv1.style.fontWeight = jsonSkin.FontWeight;
      var skinTitle = document.createElement("p");
      skinTitle.className = "regular1";
      skinTitle.innerHTML = jsonSkin.Name + " || " + `${jsonSkin.FontSize}px/${jsonSkin.Height ? jsonSkin.Height + "px" : "Auto"}`;
      conflictSkin.replaceChildren(demoDiv1, skinTitle);
      var arrowIcon = document.createElement("i");
      arrowIcon.className = "fa-solid fa-arrow-right";
      var inputLocalSkin;
      var iconSearch = document.createElement("i");
      iconSearch.className = "fa-solid fa-magnifying-glass";
      inputLocalSkin = suggestInput(
        TypoDA.list.filter((skin) => (skin.ProjectID ?? ProjectDA.obj.ID) == ProjectDA.obj.ID),
        "typography skins name",
        iconSearch,
        function (option) {
          let optionTile = document.createElement("div");
          optionTile.className = "row";
          optionTile.style.padding = "2px 8px";
          let demoText = document.createElement("div");
          demoText.style.width = "20px";
          demoText.style.height = "20px";
          demoText.innerHTML = "Ag";
          demoText.style.fontSize = "12px";
          demoText.style.display = "flex";
          demoText.style.alignItems = "center";
          demoText.style.justifyContent = "center";
          demoText.style.color = "#ffffff";
          demoText.style.fontWeight = option.FontWeight;
          let cateItem;
          if (option.CateID !== EnumCate.typography) cateItem = CateDA.list_typo_cate.find((e) => e.ID === option.CateID);
          let optionTitle = document.createElement("p");
          optionTitle.innerHTML = (cateItem?.Name ?? "") + "/" + option.Name + " || " + `${option.FontSize}px/${option.Height ? option.Height + "px" : "Auto"}`;
          optionTitle.className = "regular1";
          optionTitle.style.color = "#ffffff";
          optionTitle.style.margin = "6px 8px";
          optionTile.replaceChildren(demoText, optionTitle);
          return optionTile;
        },
        function (option) {
          onSelectLocalSkin(option);
          var demoDiv = document.createElement("div");
          demoDiv.className = "demo-div";
          demoDiv.innerHTML = "Ag";
          demoDiv.style.fontSize = "12px";
          demoDiv.style.display = "flex";
          demoDiv.style.alignItems = "center";
          demoDiv.style.justifyContent = "center";
          demoDiv.style.fontWeight = option.FontWeight;
          iconSearch.replaceWith(demoDiv);
        },
      );
      localSkin.replaceChildren(arrowIcon, inputLocalSkin);
      break;
    case EnumCate.border:
      var demoDiv1 = document.createElement("div");
      demoDiv1.className = "demo-div";
      demoDiv1.style.border = "1px solid #8c8c8c";
      demoDiv1.style.backgroundColor = `#${jsonSkin.ColorValue.substring(2)}${jsonSkin.ColorValue.substring(0, 2)}`;
      var skinTitle = document.createElement("p");
      skinTitle.className = "regular1";
      skinTitle.innerHTML = jsonSkin.Name;
      conflictSkin.replaceChildren(demoDiv1, skinTitle);
      var arrowIcon = document.createElement("i");
      arrowIcon.className = "fa-solid fa-arrow-right";
      var inputLocalSkin;
      var iconSearch = document.createElement("i");
      iconSearch.className = "fa-solid fa-magnifying-glass";
      inputLocalSkin = suggestInput(
        BorderDA.list.filter((skin) => (skin.ProjectID ?? ProjectDA.obj.ID) == ProjectDA.obj.ID),
        "border skins name",
        iconSearch,
        function (option) {
          let optionTile = document.createElement("div");
          optionTile.className = "row";
          optionTile.style.padding = "2px 8px";
          var demoDiv = document.createElement("div");
          demoDiv.style.width = "20px";
          demoDiv.style.height = "20px";
          demoDiv.style.borderRadius = "50%";
          demoDiv.style.border = "1px solid #8c8c8c";
          demoDiv.style.backgroundColor = `#${option.ColorValue.substring(2)}${option.ColorValue.substring(0, 2)}`;
          let cateItem;
          if (option.CateID !== EnumCate.border) cateItem = CateDA.list_border_cate.find((e) => e.ID === option.CateID);
          let optionTitle = document.createElement("p");
          optionTitle.innerHTML = (cateItem?.Name ?? "") + "/" + option.Name;
          optionTitle.className = "regular1";
          optionTitle.style.color = "#ffffff";
          optionTitle.style.margin = "6px 8px";
          optionTile.replaceChildren(demoDiv, optionTitle);
          return optionTile;
        },
        function (option) {
          onSelectLocalSkin(option);
          var demoDiv = document.createElement("div");
          demoDiv.className = "demo-div";
          demoDiv.style.backgroundColor = `#${option.ColorValue.substring(2)}${option.ColorValue.substring(0, 2)}`;
          iconSearch.replaceWith(demoDiv);
        },
      );
      localSkin.replaceChildren(arrowIcon, inputLocalSkin);
      break;
    case EnumCate.effect:
      var demoDiv1 = document.createElement("div");
      demoDiv1.className = "demo-div";
      demoDiv1.style.backgroundImage = `url(${"https://cdn.jsdelivr.net/gh/WiniGit/goline@785f3a1/lib/assets/effect-settings.svg"})`;
      demoDiv1.style.backgroundSize = `contain`;
      var skinTitle = document.createElement("p");
      skinTitle.className = "regular1";
      skinTitle.innerHTML = jsonSkin.Name;
      conflictSkin.replaceChildren(demoDiv1, skinTitle);
      var arrowIcon = document.createElement("i");
      arrowIcon.className = "fa-solid fa-arrow-right";
      var inputLocalSkin;
      var iconSearch = document.createElement("i");
      iconSearch.className = "fa-solid fa-magnifying-glass";
      inputLocalSkin = suggestInput(
        EffectDA.list.filter((skin) => (skin.ProjectID ?? ProjectDA.obj.ID) == ProjectDA.obj.ID),
        "effect skins name",
        iconSearch,
        function (option) {
          let optionTile = document.createElement("div");
          optionTile.className = "row";
          optionTile.style.padding = "2px 8px";
          let demoDiv = document.createElement("div");
          demoDiv.style.width = "20px";
          demoDiv.style.height = "20px";
          demoDiv.style.borderRadius = "50%";
          demoDiv.style.backgroundColor = "#ffffff";
          demoDiv.style.backgroundImage = `url(${"https://cdn.jsdelivr.net/gh/WiniGit/goline@785f3a1/lib/assets/effect-settings.svg"})`;
          demoDiv.style.backgroundSize = `contain`;
          let cateItem;
          if (option.CateID !== EnumCate.effect) cateItem = CateDA.list_effect_cate.find((e) => e.ID === option.CateID);
          let optionTitle = document.createElement("p");
          optionTitle.innerHTML = (cateItem?.Name ?? "") + "/" + option.Name;
          optionTitle.className = "regular1";
          optionTitle.style.color = "#ffffff";
          optionTitle.style.margin = "6px 8px";
          optionTile.replaceChildren(demoDiv, optionTitle);
          return optionTile;
        },
        function (option) {
          onSelectLocalSkin(option);
          var demoDiv = document.createElement("div");
          demoDiv.className = "demo-div";
          demoDiv.style.backgroundImage = `url(${"https://cdn.jsdelivr.net/gh/WiniGit/goline@785f3a1/lib/assets/effect-settings.svg"})`;
          demoDiv.style.backgroundSize = `contain`;
          iconSearch.replaceWith(demoDiv);
        },
      );
      localSkin.replaceChildren(arrowIcon, inputLocalSkin);
      break;
    default:
      break;
  }
  return mergeSkinTile;
}

function suggestInput(listValue, placeholder, prefixIcon, builder, onSelect) {
  let listSearch = [];
  let inputContainer = document.createElement("div");
  inputContainer.className = "suggetion-input";
  let input = document.createElement("input");
  input.placeholder = placeholder;
  if (prefixIcon) {
    inputContainer.appendChild(prefixIcon);
  }
  inputContainer.appendChild(input);
  input.onfocus = function (e) {
    e.stopPropagation();
    showPopupOptions();
    search();
  };
  let focusIndex = -1;
  input.onkeydown = function (e) {
    e.stopPropagation();
    let check = e.key == "ArrowUp" || e.key == "ArrowDown" || e.key == "Enter";
    if (!check) return;
    let popupListOption = document.getElementById("body").querySelector(":scope > .popup-options");
    let optionList = [...popupListOption.querySelectorAll(":scope > *")];
    optionList.forEach((option) => (option.style.backgroundColor = "transparent"));
    switch (e.key) {
      case "ArrowUp":
        if (focusIndex > 0) {
          optionList[focusIndex - 1].style.backgroundColor = "#1890ff";
          popupListOption.scrollTo({
            top: optionList[focusIndex - 1].offsetTop,
            behavior: "smooth",
          });
        }
        break;
      case "ArrowDown":
        focusIndex++;
        if (focusIndex >= optionList.length) focusIndex = optionList.length - 1;
        optionList[focusIndex].style.backgroundColor = "#1890ff";
        popupListOption.scrollTo({
          top: optionList[focusIndex].offsetTop,
          behavior: "smooth",
        });
        break;
      case "Enter":
        focusIndex = focusIndex == -1 ? 0 : focusIndex;
        let option = listValue.find((value) => value.GID == optionList[focusIndex].id);
        if (onSelect) onSelect(option);
        this.value = typeof option == "string" ? option : option.Name;
        focusIndex = -1;
        this.blur();
        break;
      default:
        return;
    }
  };
  input.oninput = function () {
    search(this.value);
  };
  input.onblur = function (e) {
    if (focusIndex < 0) {
      document.getElementById("body").querySelector(":scope > .popup-options")?.remove();
    }
  };
  function showPopupOptions() {
    let parentRect = inputContainer.getBoundingClientRect();
    document.getElementById("body").querySelector(":scope > .popup-options")?.remove();
    let popupOptionValues = document.createElement("div");
    popupOptionValues.className = "popup-options";
    popupOptionValues.style.left = parentRect.x + "px";
    popupOptionValues.style.top = parentRect.y + "px";
    popupOptionValues.style.width = parentRect.width + "px";
    document.getElementById("body").appendChild(popupOptionValues);
  }

  function search(textValue = "") {
    let popupOptionValues = document.getElementById("body").querySelector(":scope > .popup-options");
    if (textValue == "") {
      listSearch = listValue;
    } else {
      listSearch = listValue.filter((value) => {
        if (typeof value == "string") {
          return value.toLowerCase().trim().includes(textValue.toLowerCase().trim());
        } else {
          return value.Name.toLowerCase().trim().includes(textValue.toLowerCase().trim());
        }
      });
    }
    if (builder) {
      popupOptionValues.replaceChildren(
        ...listSearch.map((option) => {
          let optionTile = builder(option);
          optionTile.id = option.GID ?? option.Name;
          optionTile.onclick = function (e) {
            e.stopPropagation();
            if (onSelect) {
              onSelect(option);
            }
            input.value = option.Name;
            focusIndex = -1;
            popupOptionValues.remove();
          };
          optionTile.onmouseover = function (e) {
            e.stopPropagation();
            focusIndex = listSearch.indexOf(option);
            optionTile.style.backgroundColor = "#1890ff";
          };
          optionTile.onmouseout = function (e) {
            e.stopPropagation();
            focusIndex = -1;
            optionTile.style.backgroundColor = "transparent";
          };
          return optionTile;
        }),
      );
    } else {
      popupOptionValues.replaceChildren(
        ...listSearch.map((option) => {
          let optionTile = document.createElement("p");
          optionTile.innerHTML = typeof option == "string" ? option : option.Name;
          optionTile.onclick = function (e) {
            e.stopPropagation();
            if (onSelect) {
              onSelect(option);
            }
            input.value = optionTile.innerHTML;
            focusIndex = -1;
            popupOptionValues.remove();
          };
          optionTile.onmouseover = function (e) {
            e.stopPropagation();
            focusIndex = listSearch.indexOf(option);
            optionTile.style.backgroundColor = "#1890ff";
          };
          optionTile.onmouseout = function (e) {
            e.stopPropagation();
            focusIndex = -1;
            optionTile.style.backgroundColor = "transparent";
          };
          return optionTile;
        }),
      );
    }
  }
  return inputContainer;
}

// ! Breakpoint
function createBreakpoint() {
  ProjectDA.obj.ResponsiveJson ??= JSON.parse(JSON.stringify(ProjectDA.responsiveJson));
  let localBrpoint = ProjectDA.obj.ResponsiveJson;
  localBrpoint.BreakPoint = localBrpoint.BreakPoint.sort((a, b) => a.Width - b.Width);
  let editContainer = document.createElement("div");
  editContainer.id = "edit-breakpoint";
  editContainer.className = "edit-container";

  let header = document.createElement("div");
  header.className = "header_design_style";
  editContainer.appendChild(header);

  let title = document.createElement("p");
  title.innerHTML = "Breakpoint";

  let btnSelectSkin = createButtonAction("https://cdn.jsdelivr.net/gh/WiniGit/goline@785f3a1/lib/assets/filter.svg", null, function () {
    let brpPopup = document.createElement("div");
    let offsetPopup = editContainer.getBoundingClientRect();
    brpPopup.className = "breakpoint-popup col wini_popup popup_remove";
    brpPopup.style.top = offsetPopup.y + "px";
    brpPopup.style.left = offsetPopup.x + "px";
    let header = document.createElement("div");
    header.className = "popup-header";
    let title = document.createElement("p");
    title.innerHTML = "Breakpoint";
    title.className = "semibold1";
    let historyBtn = document.createElement("i");
    historyBtn.className = "fa-solid fa-clock-rotate-left fa-xs";
    historyBtn.onclick = function (e) {
      e.stopPropagation();
      ProjectDA.obj.ResponsiveJson = JSON.parse(JSON.stringify(ProjectDA.responsiveJson));
      ProjectDA.edit(ProjectDA.obj);
    };
    let closeBtn = document.createElement("i");
    closeBtn.className = "fa-solid fa-xmark fa-xs";
    closeBtn.onclick = function (e) {
      e.stopPropagation();
      brpPopup.remove();
      updateUIBreakpoint();
    };
    header.replaceChildren(title, historyBtn, closeBtn);
    let body = document.createElement("div");
    body.className = "popup-body";
    function listBrpTile() {
      body.replaceChildren(
        ...localBrpoint.BreakPoint.map((brp) => {
          let editBrp = document.createElement("div");
          editBrp.className = "row edit-breakpoint-tile";
          let title = document.createElement("input");
          title.readOnly = true;
          title.value = brp.Key;
          title.className = "regular2";
          title.ondblclick = function (e) {
            e.stopPropagation();
            this.readOnly = false;
            this.focus();
            this.select();
          };
          title.onblur = function (e) {
            e.stopPropagation();
            let selection = window.getSelection();
            selection.removeAllRanges();
            this.readOnly = true;
            this.value = this.value.trim();
            if (this.value === "") {
              if (brp.Key == "") editBrp.remove();
              else this.value = brp.Key;
            } else if (this.value != brp.Key) {
              if (!this.value.match(brpRegex)) {
                this.value = this.value.replace(/[()]/g, "");
                let listValue = this.value.split(/[\s-]/);
                if (listValue.length === 1) {
                  this.value = this.value + " " + `(${this.value.substring(0, this.value.length > 2 ? 2 : this.value.length)})`.toLowerCase();
                } else {
                  this.value = this.value + " " + `(${listValue.reduce((a, b) => a.substring(0, listValue.indexOf(a) + 1) + b.substring(0, 1))})`.toLowerCase();
                }
              }
              brp.Key = this.value;
              ProjectDA.obj.ResponsiveJson = localBrpoint;
              ProjectDA.edit(ProjectDA.obj);
            }
          };
          let inputBrpContainer = document.createElement("div");
          let input = document.createElement("input");
          input.value = `${brp.Width}`;
          input.onfocus = function (e) {
            e.stopPropagation();
            this.select();
          };
          input.onblur = function (e) {
            e.stopPropagation();
            let selection = window.getSelection();
            selection.removeAllRanges();
            if (isNaN(this.value)) {
              this.value = `${brp.Width}`;
            } else if (brp.Width != parseInt(this.value)) {
              brp.Width = parseInt(this.value);
              this.value = `${brp.Width}`;
              ProjectDA.obj.ResponsiveJson = localBrpoint;
              ProjectDA.edit(ProjectDA.obj);
            }
          };
          let px = document.createElement("p");
          px.innerHTML = "px";
          px.className = "regular1";
          px.style.color = "#6E87AA";
          px.style.margin = "4px 0";
          inputBrpContainer.replaceChildren(input, px);
          let deleteBtn = document.createElement("i");
          deleteBtn.className = "fa-solid fa-trash fa-xs";
          if (brp.Key === "Small (sm)") {
            deleteBtn.style.visibility = "hidden";
            title.style.pointerEvents = "none";
            input.readOnly = true;
            input.style.pointerEvents = "none";
          } else {
            deleteBtn.style.color = "#6E87AA";
            deleteBtn.onclick = function (e) {
              e.stopPropagation();
              editBrp.remove();
              localBrpoint.BreakPoint = localBrpoint.BreakPoint.filter((br) => br != brp);
              ProjectDA.obj.ResponsiveJson = localBrpoint;
              ProjectDA.edit(ProjectDA.obj);
            };
          }
          editBrp.replaceChildren(title, inputBrpContainer, deleteBtn);
          return editBrp;
        }),
      );
    }
    listBrpTile();
    let bottom = document.createElement("div");
    bottom.className = "popup-bottom";
    let addIcon = document.createElement("i");
    addIcon.className = "fa-solid fa-plus fa-xs";
    let addTitle = document.createElement("p");
    addTitle.className = "regular2";
    addTitle.innerHTML = "Add breakpoint";
    bottom.replaceChildren(addIcon, addTitle);
    bottom.onclick = function (e) {
      e.stopPropagation();
      localBrpoint.BreakPoint.push({
        Key: "",
        Width: localBrpoint.BreakPoint[localBrpoint.BreakPoint.length - 1].Width,
      });
      listBrpTile();
      let inputTitle = body.lastChild.querySelector(":scope > input");
      body.scrollTo({
        top: inputTitle.offsetTop,
        behavior: "smooth",
      });
      inputTitle.readOnly = false;
      inputTitle.focus();
    };
    brpPopup.replaceChildren(header, body, bottom);
    document.getElementById("body").appendChild(brpPopup);
  });
  btnSelectSkin.className = "action-button";
  header.replaceChildren(title, btnSelectSkin);
  let body = document.createElement("div");
  body.className = "col";
  editContainer.appendChild(body);
  let allDevice = listDevice.reduce((a, b) => a.concat(b));
  body.replaceChildren(
    ...[
      {
        Key: "Auto",
        Width: localBrpoint.BreakPoint[0].Width,
      },
      ...localBrpoint.BreakPoint,
    ].map((brp) => {
      let deviceTree = document.createElement("div");
      deviceTree.className = "col";
      deviceTree.style.padding = "0 16px";
      let breakpointTile = document.createElement("div");
      breakpointTile.className = "row";
      deviceTree.appendChild(breakpointTile);
      let prefixIcon = document.createElement("i");
      let isShowDevices = false;
      prefixIcon.className = "fa-solid fa-caret-right fa-xs";
      prefixIcon.style.padding = "8px 4px";
      prefixIcon.onclick = function () {
        isShowDevices = !isShowDevices;
        if (isShowDevices) {
          deviceTree.querySelectorAll(":scope > .device-tile").forEach((deviceTile) => {
            deviceTile.style.display = "block";
          });
          this.className = this.className.replace("caret-right", "caret-down");
        } else {
          deviceTree.querySelectorAll(":scope > .device-tile").forEach((deviceTile) => {
            deviceTile.style.display = "none";
          });
          this.className = this.className.replace("caret-down", "caret-right");
        }
      };
      let brpTitle = document.createElement("div");
      brpTitle.className = "row";
      let brpName = document.createElement("p");
      brpName.className = "semibold1";
      brpName.style.margin = "4px 2px 4px 8px";
      brpName.innerHTML = brp.Key;
      let brpWidth = document.createElement("p");
      brpWidth.className = "regular11";
      brpWidth.style.color = "#BFBFBF";
      brpWidth.innerHTML = `${brp.Key === "Auto" ? "<" : ">="}${brp.Width}px`;
      brpTitle.replaceChildren(brpName, brpWidth);
      breakpointTile.replaceChildren(prefixIcon, brpTitle);
      let brpIndex = localBrpoint.BreakPoint.indexOf(brp);
      let availableDevices = allDevice.filter((dv) => {
        if (brp.Key === "Auto") {
          return dv.Width < brp.Width;
        } else {
          return dv.Width >= brp.Width && (brpIndex === localBrpoint.BreakPoint.length - 1 || dv.Width < localBrpoint.BreakPoint[brpIndex + 1].Width);
        }
      });
      for (let device of availableDevices) {
        let deviceTile = document.createElement("p");
        deviceTile.className = "regular1 device-tile";
        deviceTile.style.display = "none";
        deviceTile.style.margin = "4px 16px";
        deviceTile.innerHTML = device.Name;
        deviceTree.appendChild(deviceTile);
      }
      return deviceTree;
    }),
  );

  return editContainer;
}

function updateUIBreakpoint() {
  let newBreakpoint = createBreakpoint();
  document.getElementById("edit-breakpoint")?.replaceWith(newBreakpoint);
}

// !Responsive
function winiResponsive() {
  let editContainer = document.createElement("div");
  editContainer.id = "edit-wini-res";
  editContainer.className = "edit-container";
  editContainer.style.padding = "8px 0";

  let header = document.createElement("div");
  header.className = "header_design_style";
  header.style.margin = "0 8px";
  editContainer.appendChild(header);

  let title = document.createElement("p");
  title.innerHTML = "Wini responsive";
  header.appendChild(title);

  let body = document.createElement("div");
  body.className = "row regular1";
  editContainer.appendChild(body);
  let prefixIcon = document.createElement("img");
  prefixIcon.src = "https://cdn.jsdelivr.net/gh/WiniGit/goline@785f3a1/lib/assets/column.svg";
  prefixIcon.style.width = "16px";
  prefixIcon.style.height = "16px";
  let text = document.createElement("p");
  text.innerHTML = "Default";
  text.style.flex = 1;
  text.style.width = "100%";
  text.style.margin = "0 12px";
  text.style.color = "#595959";
  let colNumber = document.createElement("p");
  colNumber.innerHTML = "24 col";
  colNumber.style.color = "#262626";
  body.replaceChildren(prefixIcon, text, colNumber);
  return editContainer;
}

// ! select number col
let copyBrpColSettings;
function colNumberByBrp(enable = true) {
  let editContainer = document.createElement("div");
  editContainer.id = "edit-col-number";
  editContainer.className = "edit-container";

  let header = document.createElement("div");
  header.className = "header_design_style";
  editContainer.appendChild(header);

  let title = document.createElement("p");
  title.innerHTML = "Column count on breakpoints";
  header.appendChild(title);
  if (selected_list.every((wbaseItem) => wbaseItem.ListClassName && wbaseItem.ListClassName.includes("col-"))) {
    let icon_remove = document.createElement("i");
    header.appendChild(icon_remove);
    icon_remove.className = "fa-solid fa-minus fa-sm";
    icon_remove.onclick = function () {
      let eObj;
      for (let wbaseItem of selected_list) {
        wbaseItem.ListClassName = wbaseItem.ListClassName.split(" ")
          .filter((cls) => !cls.includes("col-") && !cls.match(/col[0-9]{1,2}/g))
          .join(" ")
          .trim();
        if (wbaseItem.ListClassName === "") {
          wbaseItem.ListClassName = null;
        } else {
          wbaseItem.ListClassName.split(" ").forEach((cls) => $(wbaseItem.value).addClass(cls));
        }
        let oldClassList = [...wbaseItem.value.classList];
        oldClassList.forEach((cls) => {
          if (cls.includes("col-") || cls.match(/col[0-9]{1,2}/g)) {
            $(wbaseItem.value).removeClass(cls);
          }
        });
        if (wbaseItem.StyleItem.FrameItem.Width != null && wbaseItem.StyleItem.FrameItem.Width < 0) {
          wbaseItem.value.style.width = wbaseItem.value.offsetWidth + "px";
          wbaseItem.value.style.minWidth = wbaseItem.value.offsetWidth + "px";
          wbaseItem.StyleItem.FrameItem.Width = wbaseItem.value.offsetWidth;
          eObj = EnumObj.baseFrame;
        }
      }
      WBaseDA.edit(selected_list, eObj);
      updateUIEditPosition();
      updateUIColNumber();
      updateUISelectBox();
    };

    let body = document.createElement("div");
    body.className = "col";
    editContainer.appendChild(body);

    let localBrpoint = ProjectDA.obj.ResponsiveJson;
    let totalCol = ["none"];
    let pageParent = $(selected_list[0].value).parents(".wbaseItem-value");
    let framePage = pageParent[pageParent.length - 1];
    if (framePage?.classList?.contains("w-variant")) framePage = pageParent[pageParent.length - 2];
    let currentBrp = localBrpoint.BreakPoint.filter((brp) => framePage.offsetWidth >= brp.Width);
    let currentBrpKey = currentBrp.length > 0 ? currentBrp.pop().Key : "Auto";
    for (let i = 0; i <= localBrpoint.Column; i++) {
      totalCol.push(`${i}`);
    }
    body.replaceChildren(
      ...[
        {
          Key: "Auto",
          Width: localBrpoint.BreakPoint[0].Width,
        },
        ...localBrpoint.BreakPoint,
      ].map((brp) => {
        let brpTile = document.createElement("div");
        brpTile.className = "row breakpoint-column-tile";
        if (currentBrpKey === brp.Key) {
          brpTile.style.backgroundColor = "rgba(0, 53, 128, 0.08)";
          setTimeout(function () {
            if (!isNaN(parseInt(selectNumberInput.firstChild.value))) {
              let editW = document.getElementById("edit_frame_item_w");
              let editSizeContainer = document.getElementById("edit_size_position_div");
              editSizeContainer = editSizeContainer?.querySelectorAll(".btn_resize.width") ?? [];
              [editW, ...editSizeContainer].forEach((editWH) => {
                editWH.style.pointerEvents = "none";
                editWH.style.backgroundColor = "#f1f1f1";
              });
            }
          }, 100);
        }
        let brpTitle = document.createElement("div");
        brpTitle.className = "row";
        let brpName = document.createElement("p");
        brpName.className = "regular1";
        brpName.innerHTML = brp.Key;
        let brpWidth = document.createElement("p");
        brpWidth.className = "regular11";
        brpWidth.style.color = "#BFBFBF";
        brpWidth.innerHTML = `${brp.Key === "Auto" ? "<" : ">="}${brp.Width}px`;
        brpTitle.replaceChildren(brpName, brpWidth);
        let brpColValues = [];
        if (brp.Key === "Auto") {
          brpColValues = selected_list.filterAndMap((wbaseItem) => {
            let brpCol = wbaseItem.ListClassName.split(" ").filter((colClass) => !colClass.includes("-"));
            if (brpCol && brpCol.length > 0) return brpCol.shift().replace("col", "");
            else return "none";
          });
        } else {
          let shortName = brp.Key.match(brpRegex).pop().replace(/[()]/g, "");
          brpColValues = selected_list.filterAndMap((wbaseItem) => {
            let brpCol = wbaseItem.ListClassName.split(" ").filter((colClass) => colClass.includes(`-${shortName}`));
            if (brpCol.length > 0) {
              return brpCol.shift().replace("col", "").replace(`-${shortName}`, "");
            } else return "none";
          });
        }
        let selectNumberInput = _btnInputSelect(
          brpColValues.length == 1 ? totalCol : ["mixed", ...totalCol],
          function (options) {
            let firstValue = brpColValues[0];
            if (brpColValues.length > 1) {
              firstValue = "mixed";
            }
            let normalCol = [0, 1, 2, 3, 4, 6, 8, 12, 24];
            for (let option of options) {
              if (normalCol.every((num) => num != option.getAttribute("value"))) option.style.display = "none";
              if (firstValue == option.getAttribute("value")) option.firstChild.style.opacity = 1;
              else option.firstChild.style.opacity = 0;
            }
          },
          function (option) {
            let shortName = "";
            if (brp.Key != "Auto") {
              shortName = `-${brp.Key.match(brpRegex).pop().replace(/[()]/g, "")}`;
            }
            if (option === "none") {
              for (let wbaseItem of selected_list) {
                let listColClass = wbaseItem.ListClassName.split(" ").filter((colClasss) => {
                  colClasss = colClasss.trim();
                  if (brp.Key === "Auto") {
                    return colClasss.includes("-");
                  } else {
                    return !colClasss.includes(shortName);
                  }
                });
                wbaseItem.ListClassName = listColClass.join(" ");
                listColClass.forEach((clName) => $(wbaseItem.value).addClass(clName));
              }
            } else {
              for (let wbaseItem of selected_list) {
                let listColClass = wbaseItem.ListClassName.split(" ").filter((colClasss) => {
                  colClasss = colClasss.trim();
                  if (brp.Key === "Auto") {
                    return colClasss.includes("-");
                  } else {
                    return !colClasss.includes(shortName);
                  }
                });
                listColClass.push(`col${option}${shortName}`);
                wbaseItem.ListClassName = listColClass.join(" ");
                let oldClassList = [...wbaseItem.value.classList];
                oldClassList.forEach((clName) => {
                  if (clName.match(/col[0-9]{1,2}/g) || clName.includes("col-")) {
                    $(wbaseItem.value).removeClass(clName);
                  }
                });
                listColClass.forEach((clName) => $(wbaseItem.value).addClass(clName));
              }
            }
            WBaseDA.edit(selected_list);
            updateUIEditPosition();
            updateUIColNumber();
            updateUISelectBox();
          },
        );
        selectNumberInput.firstChild.value = brpColValues.length == 1 ? brpColValues[0] : "mixed";
        brpTile.replaceChildren(brpTitle, selectNumberInput);
        return brpTile;
      }),
    );
  } else {
    let icon_add = document.createElement("i");
    header.appendChild(icon_add);
    icon_add.className = "fa-solid fa-plus fa-sm";
    if (enable) {
      icon_add.onclick = function () {
        let parentHTML = document.getElementById(select_box_parentID);
        let eObj;
        let listUpdate = [];
        for (let wbaseItem of selected_list) {
          wbaseItem.ListClassName = "col-";
          wbaseItem.ListClassName.split(" ").forEach((clName) => $(wbaseItem.value).addClass(clName));
          wbaseItem.value.style.setProperty("--gutter", parentHTML.style.getPropertyValue("--child-space"));
        }
        if (parentHTML.classList.contains("w-row") && (!parentHTML.style.width || parentHTML.style.width == "fit-content")) {
          let wbParent = wbase_list.find((e) => e.GID === select_box_parentID);
          parentHTML.style.width = parentHTML.offsetWidth + "px";
          wbParent.StyleItem.FrameItem.Width = parentHTML.offsetWidth;
          eObj = EnumObj.baseFrame;
          listUpdate.push(wbParent);
        }
        listUpdate.push(...selected_list);
        WBaseDA.edit(listUpdate, eObj);
        updateUIEditPosition();
        updateUIColNumber();
        updateUISelectBox();
      };
    } else {
      $(header).addClass("disable");
    }
  }
  editContainer.onauxclick = function (ev) {
    if (ev.button === 2)
      setTimeout(function () {
        let copyPastePopup = document.createElement("div");
        copyPastePopup.className = "wini_popup popup_remove";
        copyPastePopup.style.left = ev.pageX + "px";
        copyPastePopup.style.top = ev.pageY + "px";
        copyPastePopup.replaceChildren(
          ...["copy", "paste"].map((op) => {
            let option = document.createElement("div");
            option.className = "regular1 row";
            option.style.padding = "4px 8px";
            option.innerHTML = op;
            if ((op === "copy" && header.querySelector(":scope > .fa-minus")) || copyBrpColSettings) {
              option.style.color = "white";
            } else {
              option.style.color = "#8c8c8c";
              option.style.pointerEvents = "none";
            }
            option.onclick = function (e) {
              e.stopPropagation();
              if (op === "copy") {
                copyBrpColSettings = [...selected_list[0].value.classList].filter((clsN) => clsN.includes("col-") || clsN.match(/col[0-9]{1,2}/g)).join(" ");
              } else {
                let parentHTML = document.getElementById(select_box_parentID);
                for (let wbaseItem of selected_list) {
                  wbaseItem.ListClassName = copyBrpColSettings;
                  wbaseItem.value.className = `wbaseItem-value ${copyBrpColSettings}`;
                  wbaseItem.value.style.setProperty("--gutter", parentHTML.style.getPropertyValue("--child-space"));
                }
                WBaseDA.edit(selected_list);
                updateUIEditPosition();
                updateUIColNumber();
                updateUISelectBox();
              }
              copyPastePopup.remove();
            };
            return option;
          }),
        );
        document.getElementById("body").appendChild(copyPastePopup);
      }, 150);
  };
  return editContainer;
}

function updateUIColNumber() {
  let newSelectCol = colNumberByBrp();
  document.getElementById("edit-col-number")?.replaceWith(newSelectCol);
}

function selectionClass() {
  let listStyleClass = selected_list
    .map((wb) => wb.ListClassName?.split(" ") ?? [])
    .reduce((a, b) => a.concat(b))
    .filter((clName) => clName.startsWith("w-st-cls"));
  let editContainer = document.createElement("div");
  editContainer.id = "edit-create-class";
  editContainer.className = "edit-container";

  let header = document.createElement("div");
  header.className = "header_design_style";
  editContainer.appendChild(header);

  let title = document.createElement("p");
  title.innerHTML = "Style class";

  let iconAdd = document.createElement("i");
  iconAdd.className = "fa-solid fa-plus fa-sm";

  let btnSelectSkin = createButtonAction("https://cdn.jsdelivr.net/gh/WiniGit/goline@785f3a1/lib/assets/buttonStyle.svg", null, function () {
    // let offset = header.getBoundingClientRect();
    // createDropdownTableSkin(EnumCate.typography, offset);
  });
  btnSelectSkin.className = "action-button";

  header.replaceChildren(title, iconAdd, btnSelectSkin);

  let body = document.createElement("div");
  body.className = "col";
  editContainer.appendChild(body);

  body.replaceChildren(
    ...listStyleClass.map((clName) => {
      let classTile = document.createElement("div");
      classTile.className = "row style-class-tile";
      let titleClass = document.createElement("p");
      titleClass.innerHTML = clName;
      titleClass.className = "regular1";
      let btn_unLink = document.createElement("img");
      btn_unLink.src = "https://cdn.jsdelivr.net/gh/WiniGit/goline@785f3a1/lib/assets/unlink-skin.svg";
      let targetImg = document.createElement("img");
      targetImg.src = "https://cdn.jsdelivr.net/gh/WiniGit/goline@785f3a1/lib/assets/target.svg";
      classTile.replaceChildren(titleClass, btn_unLink, targetImg);
      return classTile;
    }),
  );

  return editContainer;
}

function createVariables() {
  let editContainer = document.createElement("div");
  editContainer.id = "edit-variables";
  editContainer.className = "edit-container";
  let header = document.createElement("div");
  header.className = "header_design_style";
  let title = document.createElement("p");
  title.innerHTML = "Variables";
  let addBtn = document.createElement("i");
  addBtn.className = "fa-solid fa-plus fa-sm";
  header.replaceChildren(title, addBtn);
  let body = document.createElement("div");
  body.className = "col";
  if (selected_list[0].VariablesData) {
    for (const prop in selected_list[0].VariablesData) {
      body.appendChild(createVariableTile(prop));
    }
  }
  function createVariableTile(propN) {
    let tile = document.createElement("div");
    tile.className = "row";
    let propEditName = document.createElement("input");
    propEditName.defaultValue = propN ?? "";
    propEditName.placeholder = "variable name";
    propEditName.onblur = function () {
      if (propEditName.value.trim() === "") {
        delete selected_list[0].VariablesData[prop];
        if (propN) selected_list[0].value.removeAttribute(propN);
        if (JSON.stringify(selected_list[0].VariablesData) === "{}") {
          selected_list[0].VariablesData = null;
          selected_list[0].AttributesItem.Content = "";
        }
      } else {
        let varName = Ultis.toSlug(propEditName.value.toLowerCase().trim()).split("-");
        varName.forEach((elName) => elName.substring(0, 1).toUpperCase() + elName.substring(1));
        varName = varName.join("");
        selected_list[0].VariablesData[varName] = "";
        selected_list[0].value.setAttribute("varName", "");
        propN = varName;
      }
      if (propN) WBaseDA.edit(selected_list, EnumObj.attribute);
    };
    let propEditValue = document.createElement("input");
    propEditValue.defaultValue = selected_list[0].VariablesData[propN] ?? "";
    propEditValue.placeholder = "variable value";
    let removeBtn = document.createElement("i");
    addBtn.className = "fa-solid fa-minus fa-sm";
    removeBtn.onclick = function () {
      delete selected_list[0].VariablesData[prop];
      if (JSON.stringify(selected_list[0].VariablesData) === "{}") {
        selected_list[0].VariablesData = null;
        selected_list[0].AttributesItem.Content = "";
      }
      if (propN) {
        selected_list[0].value.removeAttribute(propN);
        WBaseDA.edit(selected_list, EnumObj.attribute);
      }
    };
    tile.replaceChildren(propEditName, propEditValue, removeBtn);
    return tile;
  }
  addBtn.onclick = function () {
    selected_list[0].VariablesData ??= {};
    let newVar = createVariableTile();
    body.appendChild(newVar);
    newVar.firstChild.focus();
  };
  editContainer.replaceChildren(header, body);
  return editContainer;
}
