function initDOM(list) {
  list.forEach((e) => {
    e.value = document.createElement("div");
    e.value.id = e.GID;
  });
  let sortItems = [];
  let newList = [];
  list.forEach((e) => {
    if (e.ParentID === wbase_parentID) {
      e.Level = 1;
      e.ListID = wbase_parentID;
    } else {
      let parent = list.find((eP) => eP.GID === e.ParentID);
      if (parent) {
        sortItems.push(e);
        parent.value.appendChild(e.value);
      } else {
        if (wbase_list.length > 0) {
          parent = document.getElementById(e.ParentID);
          if (parent) {
            e.ListID = parent.getAttribute("listid") + `,${e.ParentID}`;
            e.Level = e.ListID.split(",").length;
            let m = e.value;
            e.ListID.split(",")
              .filter((id) => id !== wbase_parentID)
              .reverse()
              .forEach((id) => {
                let tmp = document.createElement("div");
                tmp.id = id;
                tmp.appendChild(m);
                m = tmp;
              });
          }
        }
        if (!parent) {
          e.ParentID = wbase_parentID;
          e.Level = 1;
          e.ListID = wbase_parentID;
        }
      }
    }
    newList.push(e);
  });
  sortItems.forEach((e) => {
    e.ListID = [...$(e.value).parents("div")].map((eP) => eP.id).reverse();
    e.ListID.unshift(wbase_parentID);
    e.Level = e.ListID.length;
    e.ListID = e.ListID.join(",");
  });
  return newList;
}

/// lalala
async function initComponents(item, list, initListener = true) {
  if (item.AttributesItem.Json) {
    item.JsonItem = JSON.parse(item.AttributesItem.Json);
  }
  if (item.AttributesItem.JsonEvent) {
    item.JsonEventItem = JSON.parse(item.AttributesItem.JsonEvent);
  }
  if (item.IsWini) {
    if (item.CateID == EnumCate.tool_variant) {
      item.PropertyItems = PropertyDA.list.filter((e) => e.BaseID == item.GID);
      for (let property of item.PropertyItems) {
        property.BasePropertyItems = property.BasePropertyItems.filter((e) => item.ListChildID.some((id) => id === e.BaseID));
      }
    } else {
      let listBaseProperty = PropertyDA.list.map((e) => e.BasePropertyItems);
      if (listBaseProperty.length > 0) {
        item.BasePropertyItems = listBaseProperty.reduce((a, b) => a.concat(b)).filter((e) => e.BaseID === item.GID);
      } else {
        item.BasePropertyItems = [];
      }
    }
  }
  initSkinWbase(item);
  switch (item.CateID) {
    case EnumCate.tool_frame:
      createFrameHTML(item, list);
      break;
    case EnumCate.form:
      createFrameHTML(item, list);
      $(item.value).addClass("wbase-form");
      break;
    case EnumCate.tool_variant:
      createVariantHTML(item, list);
      break;
    case EnumCate.tool_rectangle:
      createRectangleHTML(item);
      break;
    case EnumCate.tool_text:
      createTextHTML(item);
      break;
    case EnumCate.textfield:
      createTextFieldHTML(item);
      break;
    case EnumCate.textformfield:
      createTextFormFieldHTML(item, list);
      break;
    case EnumCate.w_switch:
      createSwitchHTML(item);
      break;
    case EnumCate.svg:
      if (item.build) {
        await createSvgImgHTML(item);
      } else {
        createSvgImgHTML(item);
      }
      break;
    case EnumCate.checkbox:
      createCheckBoxHTML(item);
      break;
    case EnumCate.radio_button:
      createRadioHTML(item);
      break;
    case EnumCate.progress_bar:
      createProgressBarHTML(item);
      break;
    case EnumCate.button:
      wbutton(item, list);
      break;
    case EnumCate.tree:
      if (item.AttributesItem.Content != "") item.TreeData = JSON.parse(item.AttributesItem.Content);
      createTreeHTML(item, list);
      break;
    case EnumCate.table:
      if (item.AttributesItem.Content != "") item.TableRows = JSON.parse(item.AttributesItem.Content);
      createTableHTML(item, list);
      break;
    case EnumCate.datePicker:
      createDatePickerHTML(item);
      break;
    case EnumCate.chart:
      if (item.AttributesItem.Content != "") item.ChartData = JSON.parse(item.AttributesItem.Content);
      createChartHTML(item);
      break;
    case EnumCate.carousel:
      if (item.AttributesItem.Content != "") item.CarouselData = JSON.parse(item.AttributesItem.Content);
      createCarouselHTML(item, list);
      break;
    default:
      item.value = document.createElement("div");
      break;
  }
  $(item.value).addClass("wbaseItem-value");
  initWbaseStyle(item);
  if (item.AttributesItem.NameField && item.AttributesItem.NameField.trim() != "") $(item.value).attr("name-field", item.AttributesItem.NameField);
  item.value.setAttribute("Level", item.Level);
  item.value.setAttribute("cateid", item.CateID);
  //
  item.value.style.zIndex = item.Sort;
  item.value.style.order = item.Sort;
  if (item.ListClassName) {
    item.ListClassName.split(" ").forEach((clssName) => $(item.value).addClass(clssName));
  }
  //
  if (!item.build) {
    if (!item.IsShow) {
      item.value.setAttribute("lock", "true");
    }
    item.value.setAttribute("listid", item.ListID);
    if (item.IsWini) item.value.setAttribute("iswini", item.IsWini);
    setSizeObserver.observe(item.value, {
      attributeOldValue: true,
      attributes: true,
      childList: EnumCate.parent_cate.some((cate) => item.CateID === cate),
    });
  }
  if (initListener) {
    addListenFromSection(item);
  }
}

async function updateComponentContent(item) {
  switch (item.CateID) {
    case EnumCate.tool_rectangle:
      item.value.style.backgroundImage = `url(${item.AttributesItem.Content})`;
      item.value.style.backgroundRepeat = "no-repeat";
      item.value.style.backgroundSize = "cover";
      item.value.style.backgroundPosition = "center";
      break;
    case EnumCate.tool_text:
      item.value.innerText = item.AttributesItem.Content ?? "";
      break;
    case EnumCate.radio_button:
      item.value.querySelector(":scope > input").value = item.AttributesItem.Content;
      item.value.querySelector(":scope > input").onchange = function (e) {
        e.stopImmediatePropagation();
        e.stopPropagation();
        item.JsonItem.Checked = this.checked;
        if (this.checked) {
          item.value.style.borderColor = `#${item.StyleItem.DecorationItem.ColorValue?.substring(2) + item.StyleItem.DecorationItem.ColorValue?.substring(2, 0)}`;
          item.value.querySelector(":scope > .checkmark").style.display = "block";
          if (this.name && this.name !== "") {
            let formParent = document.querySelector(`form:has(#${this.id})`);
            if (formParent) {
              [...formParent.querySelectorAll(`input[name="${this.name}"]`)]
                .filter((radio) => radio.type === "radio" && radio.id !== this.id)
                .forEach((radio) => {
                  $(radio).trigger("change");
                });
            } else {
              [...document.getElementsByName(this.name)]
                .filter((radio) => radio.type === "radio" && radio.id !== this.id)
                .forEach((radio) => {
                  $(radio).trigger("change");
                });
            }
          }
        } else {
          item.value.style.borderColor = `#${item.StyleItem.DecorationItem.BorderItem?.ColorValue?.substring(2) + item.StyleItem.DecorationItem.BorderItem?.ColorValue?.substring(2, 0)}`;
          item.value.querySelector(":scope > .checkmark").style.display = "none";
        }
      };
      break;
    case EnumCate.textformfield:
      item.value.querySelector(".textfield > input").value = item.AttributesItem.Content;
      if (item.AttributesItem.Content.length > 0) {
        $(item.value.querySelector(".textfield")).addClass("content");
      } else {
        $(item.value.querySelector(".textfield")).removeClass("content");
      }
      let input = item.value.querySelector(`.textfield > input[id="${item.GID}"`);
      input.onblur = function (e) {
        e.stopPropagation();
        this.value = this.value.trim();
        item.AttributesItem.Content = this.value;
        $(this.parentElement).removeClass("content");
        if (this.value.trim() !== "") {
          $(this.parentElement).addClass("content");
        } else if ($(this.parentElement).find("label").length > 0) {
          this.placeholder = "";
          $(this.parentElement).find("label").css("color", "inherit");
        } else {
          input.placeholder = item.JsonItem.HintText;
        }
        if (item.JsonItem.AutoValidate) {
        }
      };
      input.onfocus = function (e) {
        e.stopPropagation();
        if ($(this.parentElement).find("label")) {
          let focusColor = "#1890ff";
          if (item.JsonEventItem) {
            let eventFocus = item.JsonEventItem.find((evt) => evt.Name === "State")?.ListState?.find((state) => state.Type === ComponentState.focus);
            if (eventFocus && eventFocus.BorderSkinID && eventFocus.BorderSkinID != "") {
              let borderSkin = BorderDA.list.find((skin) => skin.GID === eventFocus.BorderSkinID);
              focusColor = `#${borderSkin.ColorValue.substring(2)}${borderSkin.ColorValue.substring(0, 2)}`;
            }
          }
          $(this.parentElement).find("label").css("color", focusColor);
        }
        if (item.JsonItem?.HintText) {
          this.placeholder = item.JsonItem.HintText;
        }
      };
      break;
    case EnumCate.w_switch:
      item.value.querySelector(":scope > input").checked = item.AttributesItem.Content === "true";
      item.value.querySelector(":scope > input").onchange = function (e) {
        e.stopImmediatePropagation();
        e.stopPropagation();
        if (item) {
          this.value = this.checked;
          item.AttributesItem.Content = `${this.checked}`;
          if (this.checked) {
            item.value.style.backgroundColor = `#${item.StyleItem.DecorationItem.ColorValue.substring(2) + item.StyleItem.DecorationItem.ColorValue.substring(2, 0)}`;
          } else {
            item.value.style.backgroundColor = `#${item.JsonItem.InactiveColor.substring(2) + item.JsonItem.InactiveColor.substring(2, 0)}`;
          }
        }
      };
      $(item.value.querySelector("input")).trigger("change");
      break;
    case EnumCate.svg:
      if (item.build) {
        await getColorSvg(item);
      } else {
        getColorSvg(item);
      }
      break;
    case EnumCate.checkbox:
      item.value.querySelector(":scope > input").checked = item.AttributesItem.Content === "true";
      item.value.querySelector(":scope > input").onchange = function (e) {
        e.stopImmediatePropagation();
        e.stopPropagation();
        if (item) {
          this.value = this.checked;
          item.AttributesItem.Content = `${this.checked}`;
          if (this.checked) {
            item.value.style.backgroundColor = `#${item.StyleItem.DecorationItem.ColorValue.substring(2) + item.StyleItem.DecorationItem.ColorValue.substring(2, 0)}`;
          } else {
            item.value.style.backgroundColor = `#${item.JsonItem.InactiveColor.substring(2) + item.JsonItem.InactiveColor.substring(2, 0)}`;
          }
        }
        drawCheckMark(item.value);
      };
      $(item.value.querySelector("input")).trigger("change");
      break;
    default:
      break;
  }
}

function initElement(wbaseHTML) {
  switch (parseInt(wbaseHTML.getAttribute("cateid"))) {
    case EnumCate.checkbox:
      $(wbaseHTML.querySelector("input")).trigger("change");
      break;
    case EnumCate.radio_button:
      $(wbaseHTML.querySelector("input")).trigger("change");
      break;
    case EnumCate.w_switch:
      $(wbaseHTML.querySelector("input")).trigger("change");
      break;
    case EnumCate.textformfield:
      let textFieldRow = wbaseHTML.querySelector(".textfield");
      if (textFieldRow) {
        if (wbaseHTML.style.height == "fit-content") {
          textFieldRow.parentElement.style.height = "fit-content";
        } else {
          textFieldRow.parentElement.style.height = "100%";
        }
      }
      break;
    case EnumCate.table:
      if (wbaseHTML.style.width == "fit-content") {
        wbaseHTML.setAttribute("table-width", "hug");
      } else {
        wbaseHTML.removeAttribute("table-width");
      }
      break;
    case EnumCate.tree:
      if (wbaseHTML.style.height == "fit-content") {
        wbaseHTML.setAttribute("tree-height", "hug");
      } else {
        wbaseHTML.removeAttribute("tree-height");
      }
      wbaseHTML.querySelectorAll(".children-value > .check-box").forEach((chbox) => $(chbox.querySelector("input")).trigger("change"));
      break;
    default:
      break;
  }
  if (wbaseHTML.style.width == "100%") {
    if (wbaseHTML.parentElement?.style?.flexDirection == "row") {
      wbaseHTML.style.flex = 1;
    }
  }
  if (wbaseHTML.style.height == "100%") {
    if (wbaseHTML.parentElement?.style?.flexDirection == "column") {
      wbaseHTML.style.flex = 1;
    }
  }
}

const setSizeObserver = new MutationObserver((mutationList) => {
  mutationList.forEach((mutation) => {
    let targetWbase = mutation.target;
    if (mutation.attributeName === "id") {
      initElement(targetWbase);
    } else if (mutation.type === "childList" && window.getComputedStyle(targetWbase).display.includes("flex")) {
      targetWbase.querySelectorAll(`.col-[level="${parseInt(targetWbase.getAttribute("level")) + 1}"]`).forEach((childCol) => {
        childCol.style.setProperty("--spacing", targetWbase.style.flexDirection == "column" ? targetWbase.style.rowGap : targetWbase.style.columnGap);
        childCol.style.setProperty("--count-child", targetWbase.childElementCount);
      });
    }
    if (mutation.attributeName === "style") {
      let changeSelectBox = false;
      let widthValue;
      let heightValue;
      if (mutation.oldValue) {
        let listOldValue = mutation.oldValue.split(";");
        widthValue = listOldValue
          .find((styleCss) => styleCss.includes("width") && !styleCss.includes("-width"))
          ?.replace("width:", "")
          ?.trim();
        heightValue = listOldValue
          .find((styleCss) => styleCss.includes("height") && !styleCss.includes("-height"))
          ?.replace("height:", "")
          ?.trim();
      }
      if (widthValue != targetWbase.style.width) {
        changeSelectBox = true;
        if (targetWbase.style.width == "100%") {
          if (targetWbase.parentElement?.style?.flexDirection == "row") {
            targetWbase.style.flex = 1;
          }
        }
      }
      if (heightValue != targetWbase.style.height) {
        changeSelectBox = true;
        if (targetWbase.style.height == "100%") {
          if (targetWbase.parentElement?.style?.flexDirection == "column") {
            targetWbase.style.flex = 1;
          }
        } else if (targetWbase.getAttribute("cateid") == EnumCate.tree) {
          targetWbase.style.setProperty("--height", `${parseFloat(targetWbase.style.height.replace("px", "")) / ([...targetWbase.querySelectorAll(".w-tree")].filter((wtree) => wtree.offsetHeight > 0).length + 1)}px`);
        }
      }
      if (changeSelectBox && document.getElementById("divSection") && checkpad < selected_list.length) {
        switch (parseInt(targetWbase.getAttribute("cateid"))) {
          case EnumCate.checkbox:
            $(targetWbase.querySelector("input")).trigger("change");
            break;
          case EnumCate.radio_button:
            $(targetWbase.querySelector("input")).trigger("change");
            break;
          case EnumCate.w_switch:
            break;
          case EnumCate.textformfield:
            if (targetWbase.style.height == "fit-content") {
              targetWbase.querySelector(".textfield").parentElement.style.height = "fit-content";
            } else {
              targetWbase.querySelector(".textfield").parentElement.style.height = "100%";
            }
            break;
          case EnumCate.table:
            if (targetWbase.style.width == "fit-content") {
              targetWbase.setAttribute("table-width", "hug");
            } else {
              targetWbase.removeAttribute("table-width");
            }
            break;
          case EnumCate.tree:
            if (targetWbase.style.height == "fit-content") {
              targetWbase.setAttribute("tree-height", "hug");
            } else {
              targetWbase.removeAttribute("tree-height");
            }
            break;
          default:
            break;
        }
      }
      if (targetWbase.getAttribute("level") == 1 && EnumCate.extend_frame.some((cate) => targetWbase.getAttribute("cateid") == cate) && targetWbase.style.width != "fit-content") {
        let localResponsive = ProjectDA.obj.ResponsiveJson ?? ProjectDA.responsiveJson;
        let brpShortName = ["min-brp", ...localResponsive.BreakPoint.map((brp) => brp.Key.match(brpRegex).pop().replace(/[()]/g, ""))];
        let isContainBrp = false;
        let targetClassList = [...targetWbase.classList].filter((clName) => {
          let check = brpShortName.every((brpName) => brpName != clName);
          if (!check) isContainBrp = true;
          return check;
        });
        if (document.getElementById("divSection")) {
          if (!targetWbase.parentElement || targetWbase.parentElement != divSection || targetWbase.style.width == "fit-content") {
            targetWbase.className = targetClassList.join(" ");
          } else if (!isContainBrp) {
            let closestBrp = localResponsive.BreakPoint.filter((brp) => targetWbase.offsetWidth >= brp.Width);
            if (closestBrp.length > 0) {
              closestBrp = closestBrp.pop().Key.match(brpRegex).pop().replace(/[()]/g, "");
              targetClassList.push(closestBrp);
            } else {
              targetClassList.push("min-brp");
            }
            targetWbase.className = targetClassList.join(" ");
            resizeWbase.observe(targetWbase);
          }
          if (changeSelectBox && checkpad == 0) updateUISelectBox();
        }
      }
    }
  });
});

const resizeWbase = new ResizeObserver((entries) => {
  entries.forEach((entry) => {
    let framePage = entry.target;
    let localResponsive = ProjectDA.obj.ResponsiveJson ?? ProjectDA.responsiveJson;
    let brpShortName = localResponsive.BreakPoint.map((brp) => brp.Key.match(brpRegex).pop().replace(/[()]/g, ""));
    let listClass = [...framePage.classList].filter((clName) => ["min-brp", ...brpShortName].every((brpKey) => clName != brpKey));
    let closestBrp = localResponsive.BreakPoint.filter((brp) => framePage.offsetWidth >= brp.Width);
    if (closestBrp.length > 0) {
      closestBrp = closestBrp.pop().Key.match(brpRegex).pop().replace(/[()]/g, "");
      listClass.push(closestBrp);
    } else {
      listClass.push("min-brp");
    }
    framePage.className = listClass.join(" ");
  });
});

function addListenFromSection(item) {
  item.value.id = item.GID;
  if (item.ParentID == wbase_parentID) {
    initPositionStyle(item);
    divSection.appendChild(item.value);
  }
}

function getWBaseOffset(wbaseItem) {
  let leftValue;
  let topValue;
  if (wbaseItem.ParentID == wbase_parentID) {
    leftValue = Math.round(parseFloat(`${wbaseItem.StyleItem.PositionItem.Left}`.replace("px", "")).toFixed(2));
    topValue = Math.round(parseFloat(`${wbaseItem.StyleItem.PositionItem.Top}`.replace("px", "")).toFixed(2));
  } else {
    leftValue = Math.round((wbaseItem.value.getBoundingClientRect().x - document.getElementById(wbaseItem.ParentID).getBoundingClientRect().x) / scale).toFixed(2);
    topValue = Math.round((wbaseItem.value.getBoundingClientRect().y - document.getElementById(wbaseItem.ParentID).getBoundingClientRect().y) / scale).toFixed(2);
  }
  return { x: leftValue, y: topValue };
}

function initSkinWbase(item) {
  let isLocalItem = !item.ProjectID || item.ProjectID === ProjectDA.obj.ID;
  if (item.StyleItem.DecorationItem?.ColorID) {
    let colorID = item.StyleItem.DecorationItem.ColorID;
    let colorSkin = (isLocalItem ? ColorDA.list : ColorDA.listAssets).find((e) => e.GID == colorID || e.ListID?.includes(colorID));
    if (colorSkin) {
      item.StyleItem.DecorationItem.ColorID = colorSkin.GID;
      item.StyleItem.DecorationItem.ColorValue = colorSkin.Value;
    } else {
      item.StyleItem.DecorationItem.ColorID = null;
    }
  }
  if (item.StyleItem.DecorationItem?.BorderID) {
    let borderID = item.StyleItem.DecorationItem.BorderID;
    let borderSkin = (isLocalItem ? BorderDA.list : BorderDA.listAssets).find((e) => e.GID == borderID || e.ListID?.includes(borderID));
    if (borderSkin) {
      item.StyleItem.DecorationItem.BorderID = borderSkin.GID;
      item.StyleItem.DecorationItem.BorderItem = borderSkin;
    } else {
      if (item.StyleItem.DecorationItem.BorderItem?.IsStyle === true) {
        item.StyleItem.DecorationItem.BorderID = null;
        item.StyleItem.DecorationItem.BorderItem = null;
      }
    }
  }
  if (item.StyleItem.DecorationItem?.EffectID) {
    let effectID = item.StyleItem.DecorationItem.EffectID;
    let effectSkin = (isLocalItem ? EffectDA.list : EffectDA.listAssets).find((e) => e.GID == effectID || e.ListID?.includes(effectID));
    if (effectSkin) {
      item.StyleItem.DecorationItem.EffectID = effectSkin.GID;
      item.StyleItem.DecorationItem.EffectItem = effectSkin;
    } else {
      if (item.StyleItem.DecorationItem.BorderItem?.IsStyle === true) {
        item.StyleItem.DecorationItem.EffectID = null;
        item.StyleItem.DecorationItem.EffectItem = null;
      }
    }
  }
  if (item.StyleItem.TextStyleID || item.CateID === EnumCate.tool_text || item.CateID === EnumCate.textformfield) {
    let typoID = item.StyleItem.TextStyleID;
    if (typoID) {
      let typoSkin = (isLocalItem ? TypoDA.list : TypoDA.listAssets).find((e) => e.GID == typoID || e.ListID?.includes(typoID));
      if (typoSkin) {
        item.StyleItem.TextStyleID = typoSkin.GID;
        item.StyleItem.TextStyleItem = typoSkin;
      } else if (item.StyleItem.TextStyleItem) {
        item.StyleItem.TextStyleItem.IsStyle = false;
      }
    } else {
      item.StyleItem.TextStyleItem = {
        GID: 0,
        FontSize: 14,
        FontWeight: "400",
        CateID: EnumCate.typography,
        IsStyle: false,
        ColorValue: "FF000000",
        LetterSpacing: 0,
        FontFamily: "Roboto",
      };
      item.StyleItem.TextStyleID = 0;
    }
  }
}

async function callAPI(request) {
  var listParam = InputDA.list.filter((e) => e.APIID == request.ID && e.Type == enumTypeInput.param);
  var listHeader = InputDA.list.filter((e) => e.APIID == request.ID && e.Type == enumTypeInput.header);
  var listBody = InputDA.list.filter((e) => e.APIID == request.ID && e.Type == enumTypeInput.body);

  let requestUrl = handleRequestUrl(request, listParam);
  let headers = handleListInput(listHeader);
  let contentType = "content-Type";
  headers[contentType] = "application/json";
  let body = handleListInput(listBody);

  var response;
  if (request.Type == 1) {
    response = await post(requestUrl, headers, body);
  } else {
    response = await get(requestUrl, headers);
  }

  return response;
}

function initPositionStyle(item) {
  item.value.style.position = "absolute";
  if (item.ParentID === wbase_parentID) item.StyleItem.PositionItem.FixPosition = false;
  if (item.StyleItem.PositionItem.FixPosition) $(item.value).addClass("fixed-position");
  let valueL = item.StyleItem.PositionItem.Left;
  let valueT = item.StyleItem.PositionItem.Top;
  if (item.ParentID === wbase_parentID) {
    if (isNaN(valueL)) {
      item.value.style.left = valueL;
    } else {
      item.value.style.left = valueL + "px";
    }
    item.value.style.right = null;
    if (isNaN(valueT)) {
      item.value.style.top = valueT;
    } else {
      item.value.style.top = valueT + "px";
    }
    item.value.style.bottom = null;
    item.value.style.transform = null;
  } else {
    let valueR = item.StyleItem.PositionItem.Right;
    let valueB = item.StyleItem.PositionItem.Bottom;
    switch (item.StyleItem.PositionItem.ConstraintsX) {
      case Constraints.left:
        if (isNaN(valueL)) item.value.style.left = valueL;
        else item.value.style.left = valueL + "px";
        handleStyleSize(item);
        item.value.style.right = null;
        item.value.style.transform = null;
        break;
      case Constraints.right:
        if (isNaN(valueR)) item.value.style.right = valueR;
        else item.value.style.right = valueR + "px";
        handleStyleSize(item);
        item.value.style.left = null;
        item.value.style.transform = null;
        break;
      case Constraints.left_right:
        if (isNaN(valueL)) {
          item.value.style.left = valueL;
        } else {
          item.value.style.left = valueL + "px";
        }
        if (isNaN(valueR)) {
          item.value.style.right = valueR;
        } else {
          item.value.style.right = valueR + "px";
        }
        item.value.style.width = "auto";
        item.value.style.transform = null;
        break;
      case Constraints.center:
        item.value.style.left = `calc(50% + ${valueR})`;
        item.value.style.transform = "translateX(-50%)";
        break;
      case Constraints.scale:
        item.value.style.left = valueL;
        item.value.style.right = valueR;
        item.value.style.width = "auto";
        item.value.style.transform = null;
        break;
      default:
        break;
    }
    switch (item.StyleItem.PositionItem.ConstraintsY) {
      case Constraints.top:
        if (isNaN(valueT)) item.value.style.top = valueT;
        else item.value.style.top = valueT + "px";
        handleStyleSize(item);
        item.value.style.bottom = null;
        break;
      case Constraints.bottom:
        if (isNaN(valueB)) item.value.style.bottom = valueB;
        else item.value.style.bottom = valueB + "px";
        handleStyleSize(item);
        item.value.style.top = null;
        break;
      case Constraints.top_bottom:
        if (isNaN(valueT)) {
          item.value.style.top = valueT;
        } else {
          item.value.style.top = valueT + "px";
        }
        if (isNaN(valueB)) {
          item.value.style.bottom = valueB;
        } else {
          item.value.style.bottom = valueB + "px";
        }
        item.value.style.height = "auto";
        break;
      case Constraints.center:
        item.value.style.top = `calc(50% + ${valueB})`;
        if (item.StyleItem.PositionItem.ConstraintsX === Constraints.center) item.value.style.transform = "translateX(-50%) translateY(-50%)";
        else item.value.style.transform = "translateY(-50%)";
        handleStyleSize(item);
        break;
      case Constraints.scale:
        item.value.style.top = valueT;
        item.value.style.bottom = valueB;
        item.value.style.height = "auto";
        break;
      default:
        break;
    }
  }
}

function initWbaseStyle(item) {
  item.value.style.boxSizing = "border-box";
  if (item.StyleItem.FrameItem) {
    handleStyleSize(item);
  }
  if (item.StyleItem.DecorationItem) {
    if (EnumCate.noImgBg.every((cate) => item.CateID != cate) && item.AttributesItem.Content && item.AttributesItem.Content.trim() != "") {
      item.value.style.backgroundImage = `url(${urlImg + item.AttributesItem.Content.replaceAll(" ", "%20")})`;
      item.value.style.backgroundRepeat = "no-repeat";
      item.value.style.backgroundSize = "cover";
      item.value.style.backgroundPosition = "center";
    }
    if (item.StyleItem.DecorationItem.ColorValue) {
      let color_value = item.StyleItem.DecorationItem.ColorValue;
      if (item.CateID != EnumCate.svg && item.CateID !== EnumCate.checkbox) {
        item.value.style.backgroundColor = `#${color_value.substring(2)}${color_value.substring(0, 2)}`;
      }
    }
    if (item.StyleItem.DecorationItem.BorderItem) {
      let listWidth = item.StyleItem.DecorationItem.BorderItem.Width.split(" ");
      item.value.style.borderTop = listWidth[0] + "px";
      item.value.style.borderRight = listWidth[1] + "px";
      item.value.style.borderBottom = listWidth[2] + "px";
      item.value.style.borderLeft = listWidth[3] + "px";
      item.value.style.borderStyle = item.StyleItem.DecorationItem.BorderItem.BorderStyle;
      let border_color = item.StyleItem.DecorationItem.BorderItem.ColorValue;
      item.value.style.borderColor = `#${border_color.substring(2)}${border_color.substring(0, 2)}`;
    }
    if (item.StyleItem.DecorationItem.EffectItem) {
      if (item.StyleItem.DecorationItem.EffectItem.Type == ShadowType.layer_blur) {
        item.value.style.filter = `blur(${item.StyleItem.DecorationItem.EffectItem.BlurRadius}px)`;
      } else {
        let effect_color = item.StyleItem.DecorationItem.EffectItem.ColorValue;
        /* offset-x | offset-y | blur-radius | spread-radius | color */
        item.value.style.boxShadow = `${item.StyleItem.DecorationItem.EffectItem.OffsetX}px ${item.StyleItem.DecorationItem.EffectItem.OffsetY}px ${item.StyleItem.DecorationItem.EffectItem.BlurRadius}px ${item.StyleItem.DecorationItem.EffectItem.SpreadRadius}px #${effect_color.substring(2)}${effect_color.substring(0, 2)} ${item.StyleItem.DecorationItem.EffectItem.Type == ShadowType.inner ? "inset" : ""}`;
      }
    }
  }
  if (item.StyleItem.TextStyleItem && item.CateID !== EnumCate.chart) {
    item.value.style.fontFamily = item.StyleItem.TextStyleItem.FontFamily;
    item.value.style.fontSize = `${item.StyleItem.TextStyleItem.FontSize}px`;
    item.value.style.fontWeight = item.StyleItem.TextStyleItem.FontWeight;
    item.value.style.letterSpacing = `${item.StyleItem.TextStyleItem.LetterSpacing ?? 0}px`;
    item.value.style.color = `#${item.StyleItem.TextStyleItem.ColorValue?.substring(2)}${item.StyleItem.TextStyleItem.ColorValue?.substring(0, 2)}`;
    if (item.StyleItem.TextStyleItem.Height != undefined) {
      item.value.style.lineHeight = `${item.StyleItem.TextStyleItem.Height}px`;
    }
  }
  if (item.StyleItem.TypoStyleItem && item.CateID != EnumCate.textformfield) {
    item.value.style.alignItems = item.StyleItem.TypoStyleItem.TextAlign.replace("TextAlign.", "");
    item.value.style.textAlign = item.StyleItem.TypoStyleItem.TextAlign.replace("TextAlign.", "");
    item.value.style.justifyContent = item.StyleItem.TypoStyleItem.TextAlignVertical;
    item.value.style.textOverflow = item.StyleItem.TypoStyleItem.TextOverflow?.replace("TextOverflow.", "") ?? "ellipsis";
  }
  if (item.WAutolayoutItem) {
    handleStyleLayout(item);
  }
}

function handleStyleSize(item) {
  if (item.StyleItem.FrameItem.Width == undefined) {
    item.value.style.width = "fit-content";
    if (item.value.parentElement?.style?.flexDirection == "row") item.value.style.flex = null;
  } else if (item.StyleItem.FrameItem.Width < 0) {
    item.value.style.width = "100%";
  } else {
    if ([Constraints.left, Constraints.right, Constraints.center].some((constX) => item.StyleItem.PositionItem.ConstraintsX === constX)) {
      item.value.style.width = `${item.StyleItem.FrameItem.Width}px`;
      // item.value.style.minWidth = `${item.StyleItem.FrameItem.Width}px`;
    }
  }
  if (item.StyleItem.FrameItem.Height == undefined) {
    item.value.style.height = "fit-content";
    if (item.value.parentElement?.style?.flexDirection == "column") item.value.style.flex = null;
  } else if (item.StyleItem.FrameItem.Height < 0) {
    item.value.style.height = "100%";
  } else {
    if ([Constraints.top, Constraints.bottom, Constraints.center].some((constY) => item.StyleItem.PositionItem.ConstraintsY === constY)) {
      if (item.CateID === EnumCate.tree) {
        item.value.style.setProperty("--height", `${item.StyleItem.FrameItem.Height}px`);
        item.value.style.height = `${item.StyleItem.FrameItem.Height * ([...item.value.querySelectorAll(".w-tree")].filter((wtree) => wtree.offsetHeight > 0).length + 1)}px`;
      } else {
        item.value.style.height = `${item.StyleItem.FrameItem.Height}px`;
        // item.value.style.minHeight = `${item.StyleItem.FrameItem.Height}px`;
      }
    }
  }
  // }
  if (item.StyleItem.FrameItem.TopLeft == undefined) {
    switch (item.CateID) {
      case EnumCate.tool_rectangle:
        item.value.style.borderRadius = "50%";
        break;
      default:
        break;
    }
  } else {
    item.value.style.borderTopLeftRadius = `${item.StyleItem.FrameItem.TopLeft}px`;
    item.value.style.borderTopRightRadius = `${item.StyleItem.FrameItem.TopRight}px`;
    item.value.style.borderBottomLeftRadius = `${item.StyleItem.FrameItem.BottomLeft}px`;
    item.value.style.borderBottomRightRadius = `${item.StyleItem.FrameItem.BottomRight}px`;
  }
  if (EnumCate.no_child_component.every((cate) => item.CateID != cate)) {
    item.value.style.overflow = item.StyleItem.FrameItem.IsClip === true ? "hidden" : "visible";
  }
}

function handleStyleLayout(wbaseItem, onlyPadding = false) {
  if (onlyPadding) {
    if (EnumCate.data_component.some((cate) => wbaseItem.CateID === cate)) {
      wbaseItem.value.style.setProperty("--padding", `${wbaseItem.StyleItem.PaddingItem.Top}px ${wbaseItem.StyleItem.PaddingItem.Right}px ${wbaseItem.StyleItem.PaddingItem.Bottom}px ${wbaseItem.StyleItem.PaddingItem.Left}px`);
    } else {
      wbaseItem.value.style.padding = `${wbaseItem.StyleItem.PaddingItem.Top}px ${wbaseItem.StyleItem.PaddingItem.Right}px ${wbaseItem.StyleItem.PaddingItem.Bottom}px ${wbaseItem.StyleItem.PaddingItem.Left}px`;
    }
    return;
  }
  if (wbaseItem.CateID === EnumCate.table) {
    wbaseItem.value.style.setProperty("--text-align", wMainAxis(wbaseItem.WAutolayoutItem.Alignment));
    wbaseItem.value.style.setProperty("--vertical-align", wCrossAxis(wbaseItem.WAutolayoutItem.Alignment));
  } else if (wbaseItem.CateID === EnumCate.carousel) {
    wbaseItem.value.style.alignItems = wCrossAxis(wbaseItem.WAutolayoutItem.Alignment, true);
    wbaseItem.value.style.setProperty("--justify-content", wMainAxis(wbaseItem.WAutolayoutItem.Alignment, true));
    wbaseItem.value.style.setProperty("--gap", `${wbaseItem.WAutolayoutItem.ChildSpace}px`);
  } else {
    let isRow = wbaseItem.WAutolayoutItem.Direction === "Horizontal";
    let thisClassList = [...wbaseItem.value.classList].filter((clName) => clName != "grid-layout");
    if (wbaseItem.WAutolayoutItem.IsWrap && isRow) {
      thisClassList.push("grid-layout");
      wbaseItem.value.style.flexDirection = null;
      wbaseItem.value.style.flexWrap = null;
    } else {
      wbaseItem.value.style.display = "flex";
      wbaseItem.value.style.flexDirection = isRow ? "row" : "column";
      wbaseItem.value.style.flexWrap = wbaseItem.WAutolayoutItem.IsWrap ? "wrap" : "nowrap";
    }
    wbaseItem.value.className = thisClassList.join(" ");
    if (isRow) {
      if (wbaseItem.CateID === EnumCate.table) wbaseItem.value.setAttribute("direction", "row");
      wbaseItem.value.style.columnGap = `${wbaseItem.WAutolayoutItem.ChildSpace}px`;
      wbaseItem.value.style.rowGap = `${wbaseItem.WAutolayoutItem.RunSpace}px`;
      wbaseItem.value.style.alignItems = wCrossAxis(wbaseItem.WAutolayoutItem.Alignment, true);
      wbaseItem.value.style.justifyContent = wMainAxis(wbaseItem.WAutolayoutItem.Alignment, true);
    } else {
      wbaseItem.value.style.rowGap = `${wbaseItem.WAutolayoutItem.ChildSpace}px`;
      wbaseItem.value.style.columnGap = `${wbaseItem.WAutolayoutItem.RunSpace}px`;
      wbaseItem.value.style.alignItems = wCrossAxis(wbaseItem.WAutolayoutItem.Alignment, false);
      wbaseItem.value.style.justifyContent = wMainAxis(wbaseItem.WAutolayoutItem.Alignment, false);
    }
    wbaseItem.value.querySelectorAll(`.col-[level="${wbaseItem.Level + 1}"]`).forEach((childCol) => {
      childCol.style.setProperty("--spacing", `${wbaseItem.WAutolayoutItem.ChildSpace}px`);
      childCol.style.setProperty("--count-child", wbaseItem.CountChild);
    });
    if (EnumCate.data_component.some((cate) => wbaseItem.CateID === cate)) {
      wbaseItem.value.style.setProperty("--padding", `${wbaseItem.StyleItem.PaddingItem.Top}px ${wbaseItem.StyleItem.PaddingItem.Right}px ${wbaseItem.StyleItem.PaddingItem.Bottom}px ${wbaseItem.StyleItem.PaddingItem.Left}px`);
    } else {
      wbaseItem.value.style.padding = `${wbaseItem.StyleItem.PaddingItem.Top}px ${wbaseItem.StyleItem.PaddingItem.Right}px ${wbaseItem.StyleItem.PaddingItem.Bottom}px ${wbaseItem.StyleItem.PaddingItem.Left}px`;
    }
  }
}

function addStyleComponents(item, elements) {
  if (item.IsWini == true) {
    elements.setAttribute("class", item.StyleItem.Name);
  }
}

function handleListInput(listInput) {
  let _obj = {};
  listInput.forEach(function (item) {
    let name = item.Name;
    _obj[name] = item.Value;
  });
  return _obj;
}

function handleRequestUrl(request, listParam) {
  let param = "";
  listParam.forEach(function (e) {
    if (e.Name != null && e.Name != "") {
      param.concat(e.Name + "=" + e.value + "&");
    }
  });
  var requestUrl = request.Url;
  if (param != "") {
    requestUrl = requestUrl + "?" + param.slice(0, -1);
  }
  return requestUrl;
}

class enumTypeInput {
  static param = 1;
  static header = 2;
  static body = 3;
}

function wMainAxis(key, isHorizontal) {
  if (isHorizontal == undefined) {
    if (key.includes("Left")) {
      return "-webkit-left";
    } else if (key.includes("Right")) {
      return "-webkit-right";
    } else {
      return "-webkit-center";
    }
  } else if (isHorizontal) {
    if (key.includes("Left")) {
      return "flex-start";
    } else if (key.includes("Right")) {
      return "flex-end";
    } else if (key.includes("SpaceBetween")) {
      return "space-between";
    } else {
      return "center";
    }
  } else {
    if (key.includes("Top")) {
      return "flex-start";
    } else if (key.includes("Bottom")) {
      return "flex-end";
    } else if (key.includes("SpaceBetween")) {
      return "space-between";
    } else {
      return "center";
    }
  }
}

function wCrossAxis(key, isHorizontal) {
  if (isHorizontal == undefined) {
    if (key.includes("Top")) {
      return "top";
    } else if (key.includes("Bottom")) {
      return "bottom";
    } else {
      return "middle";
    }
  } else if (isHorizontal) {
    if (key.includes("Top")) {
      return "flex-start";
    } else if (key.includes("Bottom")) {
      return "flex-end";
    } else {
      return "center";
    }
  } else {
    if (key.includes("Left")) {
      return "flex-start";
    } else if (key.includes("Right")) {
      return "flex-end";
    } else {
      return "center";
    }
  }
}
