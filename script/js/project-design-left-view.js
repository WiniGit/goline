//setup left view
function setupLeftView() {
  // layer view HTML
  left_view.style.width = `${left_view.offsetWidth}px`;
  // setup tab change
  let list_tab_view = document.getElementsByClassName("tab_left");
  for (let i = 0; i < list_tab_view.length; i++) {
    if (!PageDA.enableEdit) {
      if (list_tab_view[i].innerHTML === "Assets") list_tab_view[i].style.display = "none";
    }
    list_tab_view[i].onclick = function () {
      tabChange(this.innerHTML, "left_tab_view");
      if (this.innerHTML === "Assets") {
        assets_view.style.display = "inline-flex";
        let btnIcon = [...btn_select_page.childNodes].find((e) => e.localName == "i");
        btnIcon.className = btnIcon.className.replace("fa-chevron-up", "fa-chevron-down");
        div_list_page.style.display = "none";
        select_component = undefined;
        initUIAssetView(true);
      }
    };
  }
  // btn select page
  let btn_select_page = document.getElementById("btn_select_page");
  btn_select_page.firstChild.innerHTML = PageDA.obj.Name;
  btn_select_page.onclick = function () {
    let btnIcon = [...btn_select_page.childNodes].find((e) => e.localName == "i");
    if (div_list_page.style.display == "none") {
      btnIcon.className = btnIcon.className.replace("fa-chevron-down", "fa-chevron-up");
      div_list_page.style.display = "inline-flex";
      if (layer_view.style.display == "none") {
        tabChange("Layer", "left_tab_view");
      }
    } else {
      btnIcon.className = btnIcon.className.replace("fa-chevron-up", "fa-chevron-down");
      div_list_page.style.display = "none";
    }
  };
  let div_list_page = document.createElement("div");
  div_list_page.id = "div_list_page";
  observer_listPage.observe(div_list_page);
  let header_page = document.createElement("div");
  header_page.className = "header row";
  header_page.innerHTML = "Pages";
  let btn_add_page = document.createElement("i");
  btn_add_page.className = "fa-solid fa-plus";
  btn_add_page.style.padding = "8px";
  btn_add_page.style.borderRadius = "2px";
  btn_add_page.onclick = function () {
    let newName = `Page ${PageDA.list.length + 1}`;
    PageDA.list.forEach((e) => {
      if (e.Name === newName) {
        newName = `Page ${PageDA.list.length + 2}`;
      }
    });
    let newPage = {
      ID: 0,
      Name: newName,
      ProjectID: ProjectDA.obj.ID,
    };
    PageDA.add(newPage);
  };
  header_page.appendChild(btn_add_page);
  if (!PageDA.enableEdit) {
    btn_add_page.style.display = "none";
  }
  div_list_page.replaceChildren(header_page, ...PageDA.list.map((pageItem) => createPageTile(pageItem)));
  // add event unfocus when click white space
  layer_view.onclick = function (event) {
    if (event.target.readOnly == true) {
      event.target.blur();
    } else if (event.target.id == "Layer") {
      addSelectList();
    }
  };
  document.getElementById("layer-search").onclick = showSearchResult;
  // div contain all wbase_item as list tile
  let show_list_tile = document.createElement("div");
  layer_view.replaceChildren(div_list_page, show_list_tile);
  show_list_tile.id = `parentID:${wbase_parentID}`;
  show_list_tile.style.overflowY = "scroll";
  show_list_tile.style.height = "100%";
  replaceAllLyerItemHTML();
}

function showSearchResult() {
  tabChange("Layer", "left_tab_view");
  let searchFilter = 0;
  let filterBy = [
    0, // all
    -1, //base component
    -2, // search by text content
    -3, // local component
    EnumCate.tool_text,
    EnumCate.svg,
    EnumCate.tool_rectangle,
    EnumCate.tool_frame,
    EnumCate.tool_variant,
  ];
  let searchContainer = document.createElement("div");
  searchContainer.className = "col";
  searchContainer.style.background = "white";
  let searchHeader = document.createElement("div");
  searchHeader.className = "row search-header";
  let glassIcon = document.createElement("i");
  glassIcon.className = "fa-solid fa-magnifying-glass fa-xs";
  let inputBar = document.createElement("input");
  inputBar.oninput = function (e) {
    e.stopPropagation();
    let filterList = [];
    switch (searchFilter) {
      case 0:
        filterList = wbase_list.filter((wb) => Ultis.toSlug(wb.Name.toLowerCase()).includes(Ultis.toSlug(this.value.toLowerCase())));
        break;
      case -1:
        filterList = wbase_list.filter((wb) => EnumCate.baseComponent.some((ct) => wb.CateID === ct) && Ultis.toSlug(wb.Name.toLowerCase()).includes(Ultis.toSlug(this.value.toLowerCase())));
        break;
      case -2:
        filterList = wbase_list.filter((wb) => wb.CateID === EnumCate.tool_text && wb.AttributesItem.Content.toLowerCase().includes(Ultis.toSlug(this.value.toLowerCase())));
        break;
      case -3:
        filterList = wbase_list.filter((wb) => wb.IsWini);
        break;
      case EnumCate.tool_text:
        filterList = wbase_list.filter((wb) => wb.CateID === EnumCate.tool_text && Ultis.toSlug(wb.Name.toLowerCase()).includes(Ultis.toSlug(this.value.toLowerCase())));
        break;
      case EnumCate.svg:
        filterList = wbase_list.filter((wb) => wb.CateID === EnumCate.svg && Ultis.toSlug(wb.Name.toLowerCase()).includes(Ultis.toSlug(this.value.toLowerCase())));
        break;
      case EnumCate.tool_rectangle:
        filterList = wbase_list.filter((wb) => wb.CateID === EnumCate.tool_rectangle && Ultis.toSlug(wb.Name.toLowerCase()).includes(Ultis.toSlug(this.value.toLowerCase())));
        break;
      case EnumCate.tool_frame:
        filterList = wbase_list.filter((wb) => EnumCate.extend_frame.some((ct) => wb.CateID === ct) && Ultis.toSlug(wb.Name.toLowerCase()).includes(Ultis.toSlug(this.value.toLowerCase())));
        break;
      case EnumCate.tool_variant:
        filterList = wbase_list.filter((wb) => wb.CateID === EnumCate.tool_variant && Ultis.toSlug(wb.Name.toLowerCase()).includes(Ultis.toSlug(this.value.toLowerCase())));
        break;
      default:
        break;
    }
    searchBody.replaceChildren(
      ...filterList.reverse().map((wb) => {
        let result = document.createElement("div");
        result.className = "layer-search-result row";
        let cateImg = document.createElement("img");
        if (wb.IsWini && wb.CateID != EnumCate.tool_variant) {
          cateImg.src = "https://cdn.jsdelivr.net/gh/WiniGit/goline@7925dd0/lib/assets/component.svg";
        } else {
          switch (wb.CateID) {
            case EnumCate.tool_frame:
              cateImg.src = "https://cdn.jsdelivr.net/gh/WiniGit/goline@7925dd0/lib/assets/frame_black.svg";
              break;
            case EnumCate.tool_rectangle:
              cateImg.src = "https://cdn.jsdelivr.net/gh/WiniGit/goline@7925dd0/lib/assets/rectangle_black.svg";
              break;
            case EnumCate.tool_text:
              cateImg.src = "https://cdn.jsdelivr.net/gh/WiniGit/goline@7925dd0/lib/assets/text_black.svg";
              break;
            case EnumCate.tool_variant:
              cateImg.src = "https://cdn.jsdelivr.net/gh/WiniGit/goline@7925dd0/lib/assets/multiple_component.svg";
              break;
            default:
              cateImg.src = "https://cdn.jsdelivr.net/gh/WiniGit/goline@7925dd0/lib/assets/base_component_black.svg";
              break;
          }
        }
        cateImg.style.width = "16px";
        cateImg.style.height = "16px";
        cateImg.ondblclick = function (ev) {
          ev.stopPropagation();
          let objCenter = document.getElementById(wb.GID);
          let centerRect = objCenter.getBoundingClientRect();
          centerRect = offsetScale(centerRect.x + centerRect.width / 2, centerRect.y + centerRect.height / 2);
          divSection.style.transition = "1s";
          scrollbdClick(centerRect.x, centerRect.y, objCenter.offsetWidth, objCenter.offsetHeight);
          divSection.style.transition = "none";
          updateHoverWbase();
          PageDA.saveSettingsPage();
          if (wb.CateID === EnumCate.textfield) {
            addSelectList([wbase_list.find((ele) => ele.GID === wb.ParentID)]);
          } else {
            addSelectList([wb]);
          }
          searchBody.querySelectorAll(".layer-search-result").forEach((searchR) => {
            searchR.style.backgroundColor = "transparent";
          });
          result.style.backgroundColor = "#e6f7ff";
        };
        let titleCol = document.createElement("div");
        titleCol.className = "col";
        let wbName = document.createElement("p");
        wbName.className = "regular1";
        wbName.innerHTML = wb.Name;
        titleCol.appendChild(wbName);
        if (wb.Level > 1) {
          let wbPName = document.createElement("p");
          wbPName.className = "regular11";
          wbPName.innerHTML = document.getElementById("inputName:" + wb.ListID.split(",")[1]).value;
          titleCol.appendChild(wbPName);
        }
        result.replaceChildren(cateImg, titleCol);
        result.ondblclick = function () {
          $(cateImg).trigger("dblclick");
          searchContainer.remove();
        };
        if (selected_list.some((ele) => ele.GID === wb.GID)) result.style.backgroundColor = "#e6f7ff";
        return result;
      }),
    );
  };
  inputBar.className = "search-input regular1";
  inputBar.placeholder = "Find...";
  let filterIcon = document.createElement("i");
  filterIcon.className = "fa-solid fa-sliders fa-xs";
  filterIcon.onclick = function () {
    setTimeout(function () {
      let filterPopup = document.createElement("div");
      filterPopup.className = "wini_popup popup_remove col search-filter-popup";
      let offset = filterIcon.getBoundingClientRect();
      filterPopup.style.left = offset.x + "px";
      filterPopup.style.top = offset.y + offset.height + "px";
      filterPopup.replaceChildren(
        ...filterBy.map((num) => {
          let option = document.createElement("div");
          option.className = "row";
          let checkMark = document.createElement("i");
          checkMark.className = "fa-solid fa-check fa-xs";
          let type = document.createElement("p");
          type.className = "regular1";
          switch (num) {
            case 0:
              type.innerHTML = "All";
              break;
            case -1:
              type.innerHTML = "Base component";
              break;
            case -2:
              type.innerHTML = "Text content";
              break;
            case -3:
              type.innerHTML = "Local component";
              break;
            case EnumCate.tool_text:
              type.innerHTML = "Text";
              break;
            case EnumCate.svg:
              type.innerHTML = "Svg picture";
              break;
            case EnumCate.tool_rectangle:
              type.innerHTML = "Rectangle";
              break;
            case EnumCate.tool_frame:
              type.innerHTML = "Frame";
              break;
            case EnumCate.tool_variant:
              type.innerHTML = "Variant";
              break;
            default:
              break;
          }
          if (num !== searchFilter) checkMark.style.visibility = "hidden";
          option.replaceChildren(checkMark, type);
          option.onclick = function (evt) {
            evt.stopPropagation();
            searchFilter = num;
            filterPopup.remove();
            $(inputBar).trigger("input");
          };
          return option;
        }),
      );
      document.getElementById("body").appendChild(filterPopup);
    }, 150);
  };
  let xIcon = document.createElement("i");
  xIcon.className = "fa-solid fa-xmark fa-sm";
  xIcon.onclick = function () {
    searchContainer.remove();
  };
  searchHeader.replaceChildren(glassIcon, inputBar, filterIcon, xIcon);
  let searchBody = document.createElement("div");
  searchBody.className = "col search-body";
  searchContainer.replaceChildren(searchHeader, searchBody);
  left_view.appendChild(searchContainer);
  inputBar.focus();
}

function replaceAllLyerItemHTML() {
  let show_list_tile = document.getElementById(`parentID:${wbase_parentID}`);
  let list_level1 = wbase_list.filter((e) => e.ParentID == wbase_parentID).reverse();
  let isReplace = show_list_tile.childElementCount > 0;
  show_list_tile.replaceChildren(
    ...list_level1.map((wbaseItem) => {
      let isShowChildren = false;
      if (isReplace) {
        isShowChildren = document.getElementById(`pefixAction:${wbaseItem.GID}`);
        if (isShowChildren) {
          isShowChildren = isShowChildren.className.includes("fa-caret-down");
        }
      }
      return createLayerTile(wbaseItem, isShowChildren);
    }),
  );
}

// handle tab change
function tabChange(tabName, leftOrRight) {
  tabName = tabName.trim();
  let x = document.getElementsByClassName(leftOrRight);
  for (let i = 0; i < x.length; i++) {
    x[i].style.display = "none";
  }
  document.getElementById(tabName).style.display = "block";
  let list_tab_view = document.getElementsByClassName("tab_left");
  for (let j = 0; j < list_tab_view.length; j++) {
    if (list_tab_view[j].innerHTML == tabName) {
      list_tab_view[j].style.opacity = 1;
    } else {
      list_tab_view[j].style.opacity = 0.7;
    }
  }
}

function createPageTile(pageItem) {
  let pageTile = document.createElement("div");
  pageTile.id = `pageID:${pageItem.ID}`;
  pageTile.className = "page_item_tile row";
  let prefixIcon = document.createElement("i");
  prefixIcon.className = "fa-solid fa-check fa-sm";
  if (pageItem.ID !== PageDA.obj.ID) {
    prefixIcon.style.visibility = "hidden";
  }
  pageTile.appendChild(prefixIcon);
  let inputPageName = document.createElement("input");
  inputPageName.className = "inputPageName";
  pageTile.appendChild(inputPageName);
  inputPageName.readOnly = true;
  inputPageName.value = pageItem.Name;
  if (PageDA.enableEdit) {
    inputPageName.ondblclick = function () {
      this.style.cursor = "text";
      this.style.outline = "2px solid #1890FF";
      this.readOnly = false;
      this.setSelectionRange(0, this.value.length);
      this.focus();
    };
    inputPageName.onblur = function () {
      this.style.cursor = "context-menu";
      this.readOnly = true;
      this.style.outline = "none";
      this.setSelectionRange(0, 0);
      let thisPage = PageDA.list.find((e) => e.ID == pageTile.id.replace("pageID:", ""));
      if (thisPage && thisPage.Name != this.value.trim()) {
        thisPage.Name = this.value.trim();
        PageDA.edit(thisPage);
      }
    };
    pageTile.onauxclick = function (e) {
      e.stopPropagation();
      hidePopup(e);
      let popupPage = document.createElement("div");
      popupPage.className = "popupEditOrDelete col wini_popup popup_remove";
      popupPage.style.left = e.pageX + "px";
      popupPage.style.top = e.pageY + "px";
      let optionEdit = document.createElement("div");
      optionEdit.innerHTML = "Edit";
      optionEdit.onclick = function (e) {
        e.stopPropagation();
        popupPage.remove();
        inputPageName.style.cursor = "text";
        inputPageName.style.outline = "2px solid #1890FF";
        inputPageName.readOnly = false;
        inputPageName.setSelectionRange(0, inputPageName.value.length);
        inputPageName.focus();
      };
      popupPage.appendChild(optionEdit);
      if (PageDA.list.length > 1) {
        let optionDelete = document.createElement("div");
        optionDelete.innerHTML = "Delete";
        optionDelete.onclick = function (e) {
          e.stopPropagation();
          popupPage.remove();
          let pageItem = PageDA.list.find((e) => e.ID == pageTile.id.replace("pageID:", ""));
          if (pageItem) {
            PageDA.delete(pageItem);
          }
        };
        popupPage.appendChild(optionDelete);
      }
      document.getElementById("body").appendChild(popupPage);
    };
  }
  pageTile.onclick = function (e) {
    e.stopPropagation();
    PageDA.selectPage(PageDA.list.find((e) => e.ID == this.id.replace("pageID:", "")));
  };
  return pageTile;
}

// create layer tile depend wbaseItem
function createLayerTile(wbaseItem, isShowChildren = false) {
  let layerContainer = document.createElement("div");
  layerContainer.className = "col";
  let wbase_tile = document.createElement("div");
  wbase_tile.id = `wbaseID:${wbaseItem.GID}`;
  wbase_tile.className = "layer_wbase_tile";
  wbase_tile.setAttribute("cateid", wbaseItem.CateID);
  layerContainer.appendChild(wbase_tile);

  let isShowListChid = isShowChildren;
  let icon_caret_right = document.createElement("i");
  icon_caret_right.id = `pefixAction:${wbaseItem.GID}`;
  icon_caret_right.className = `fa-solid fa-caret-${isShowListChid ? "down" : "right"} fa-xs prefix-btn`;
  icon_caret_right.style.padding = "12px 6px";
  icon_caret_right.style.boxSizing = "border-box";
  icon_caret_right.style.marginLeft = `${(wbaseItem.Level - 1) * 16}px`;
  icon_caret_right.addEventListener("click", function () {
    isShowListChid = !this.className.includes("caret-down");
    if (isShowListChid) {
      this.className = this.className.replace("caret-right", "caret-down");
    } else {
      this.className = this.className.replace("caret-down", "caret-right");
    }
  });
  wbase_tile.appendChild(icon_caret_right);
  let icon_wbase = document.createElement("img");
  wbase_tile.appendChild(icon_wbase);
  if (wbaseItem.IsWini && wbaseItem.CateID != EnumCate.tool_variant) {
    icon_wbase.src = "https://cdn.jsdelivr.net/gh/WiniGit/goline@7925dd0/lib/assets/component.svg";
  } else {
    switch (wbaseItem.CateID) {
      case EnumCate.tool_frame:
        icon_wbase.src = "https://cdn.jsdelivr.net/gh/WiniGit/goline@7925dd0/lib/assets/frame_black.svg";
        break;
      case EnumCate.tool_rectangle:
        icon_wbase.src = "https://cdn.jsdelivr.net/gh/WiniGit/goline@7925dd0/lib/assets/rectangle_black.svg";
        break;
      case EnumCate.tool_text:
        icon_wbase.src = "https://cdn.jsdelivr.net/gh/WiniGit/goline@7925dd0/lib/assets/text_black.svg";
        break;
      case EnumCate.tool_variant:
        icon_wbase.src = "https://cdn.jsdelivr.net/gh/WiniGit/goline@7925dd0/lib/assets/multiple_component.svg";
        break;
      default:
        icon_wbase.src = "https://cdn.jsdelivr.net/gh/WiniGit/goline@7925dd0/lib/assets/base_component_black.svg";
        break;
    }
  }
  icon_wbase.style.width = "16px";
  icon_wbase.style.height = "16px";
  icon_wbase.ondblclick = function (e) {
    e.stopPropagation();
    let objCenter = document.getElementById(wbaseItem.GID);
    let centerRect = objCenter.getBoundingClientRect();
    centerRect = offsetScale(centerRect.x + centerRect.width / 2, centerRect.y + centerRect.height / 2);
    divSection.style.transition = "1s";
    scrollbdClick(centerRect.x, centerRect.y, objCenter.offsetWidth, objCenter.offsetHeight);
    divSection.style.transition = "none";
    updateHoverWbase();
    PageDA.saveSettingsPage();
    if (wbaseItem.CateID !== EnumCate.textfield) addSelectList([wbaseItem]);
  };
  let inputWBaseName = document.createElement("input");
  inputWBaseName.id = `inputName:${wbaseItem.GID}`;
  wbase_tile.appendChild(inputWBaseName);
  inputWBaseName.readOnly = true;
  inputWBaseName.value = wbaseItem.Name;
  //
  let icon_lock = document.createElement("i");
  icon_lock.className = "fa-solid fa-lock fa-xs is-lock";
  wbase_tile.appendChild(icon_lock);
  //
  let wbaseChildren = [];
  if ([EnumCate.tool_variant, ...EnumCate.parent_cate].some((cate) => wbaseItem.CateID === cate)) {
    let childrenLayer = document.createElement("div");
    layerContainer.appendChild(childrenLayer);
    childrenLayer.id = `parentID:${wbaseItem.GID}`;
    childrenLayer.className = "col";
    wbaseChildren = wbase_list.filter((e) => e.ParentID == wbaseItem.GID).reverse();
    childrenLayer.replaceChildren(...wbaseChildren.map((wbaseChild) => createLayerTile(wbaseChild)));
  }
  wbase_tile.onmouseover = function () {
    if (!sortLayer) {
      updateHoverWbase(wbaseItem);
    }
  };
  wbase_tile.onmouseout = function () {
    if (!sortLayer) {
      updateHoverWbase();
    }
  };
  if (wbaseItem.CateID !== EnumCate.textfield) {
    if (wbaseItem.IsShow) {
      icon_lock.className = "fa-solid fa-lock-open fa-xs is-lock";
    } else {
      layerContainer.querySelectorAll(".is-lock").forEach((lockBtn) => {
        if (lockBtn !== icon_lock) {
          lockBtn.className = "fa-solid fa-lock fa-xs is-lock";
          lockBtn.style.pointerEvents = "none";
        }
      });
    }
    wbase_tile.onclick = function () {
      addSelectList([wbaseItem]);
    };
    if (PageDA.enableEdit)
      icon_lock.onclick = function () {
        wbaseItem.IsShow = !wbaseItem.IsShow;
        if (wbaseItem.IsShow) {
          wbaseItem.value.removeAttribute("lock");
          icon_lock.className = "fa-solid fa-lock-open fa-xs is-lock";
          layerContainer.querySelectorAll(".is-lock").forEach((lockBtn) => {
            let valueHTML = document.getElementById(lockBtn.parentElement.id.replace("wbaseID:", ""));
            if (valueHTML.getAttribute("lock") !== "true" && $(valueHTML).parents(`.wbaseItem-value[lock="true"]`).length === 0) {
              lockBtn.className = "fa-solid fa-lock-open fa-xs is-lock";
              lockBtn.style.pointerEvents = "auto";
            }
          });
        } else {
          wbaseItem.value.setAttribute("lock", "true");
          icon_lock.className = "fa-solid fa-lock fa-xs is-lock";
          layerContainer.querySelectorAll(".is-lock").forEach((lockBtn) => {
            if (lockBtn !== icon_lock) {
              lockBtn.className = "fa-solid fa-lock fa-xs is-lock";
              lockBtn.style.pointerEvents = "none";
            }
          });
        }
        WBaseDA.edit([wbaseItem], EnumObj.wBase);
      };
  }
  if (PageDA.enableEdit) {
    inputWBaseName.ondblclick = function () {
      this.style.cursor = "text";
      this.style.outline = "2px solid #1890FF";
      this.readOnly = false;
      this.setSelectionRange(0, this.value.length);
      this.focus();
    };
    inputWBaseName.onblur = function () {
      if (!sortLayer && !this.readOnly) {
        this.style.cursor = "auto";
        this.style.outline = "none";
        this.readOnly = true;
        window.getSelection().removeAllRanges();
        if (wbaseItem.Name != this.value) {
          wbaseItem.Name = this.value;
          WBaseDA.edit([wbaseItem], EnumObj.wBase);
        }
      }
    };
  }

  return layerContainer;
}

var select_component;
async function initUIAssetView(reloadComponent = false) {
  assets_view.style.width = "100%";
  let children = [];
  let scrollY = assets_view.scrollTop;
  if (reloadComponent) {
    assets_view.replaceChildren(...children);
    let loader = document.createElement("div");
    loader.style.setProperty("--border-width", "3px");
    loader.style.height = "20px";
    loader.style.width = "20px";
    loader.style.flex = "none";
    loader.style.margin = "12px";
    loader.className = "data-loader";
    assets_view.replaceChildren(loader);
    if (!ProjectDA.obj.ListID || ProjectDA.obj.ListID.split(",").length == 0) {
      initUIAssetView();
    } else {
      StyleDA.getSkinsByListId(ProjectDA.obj.ListID);
    }
  } else {
    WBaseDA.reloadAssetsList();
    let component_div = document.createElement("div");
    component_div.className = "col";
    let scroll_div = document.createElement("div");
    scroll_div.className = "col";
    scroll_div.style.overflowY = "scroll";
    scroll_div.style.height = "100%";
    scroll_div.style.flex = 1;
    let instance_div = document.createElement("div");
    // create list component tile assets view
    let search_container = document.createElement("div");
    search_container.className = "row";
    search_container.style.width = "100%";
    let search_input = document.createElement("input");
    search_input.id = "search_input_assets";
    search_input.placeholder = "Search assets...";
    let onSearch = false;
    search_input.oninput = function () {
      onSearch = false;
    };
    search_input.onkeyup = function (e) {
      e.stopPropagation();
      onSearch = true;
      setTimeout(function () {
        if (onSearch) {
          let content = search_input.value
            .split(" ")
            .filter((text) => text != "")
            .join(" ");
          let isContainLocal = false;
          updateListComponentByProject(ProjectDA.obj);
          [...document.getElementById(`component projectID:${ProjectDA.obj.ID}`).querySelectorAll(".assets-component-tile")].reverse().forEach((componentTile) => {
            let thisComponent = assets_list.find((com) => com.GID == componentTile.id.replace("Component:", ""));
            if (content.split(" ").some((key) => thisComponent.Name.toLowerCase().includes(key))) {
              componentTile.style.display = "flex";
              isContainLocal = true;
              componentTile.querySelectorAll(".assets-component-tile").forEach((childComponentTile) => {
                childComponentTile.style.display = "flex";
              });
            } else {
              componentTile.style.display = "none";
            }
          });
          if (!isContainLocal) updateListComponentByProject(ProjectDA.obj, false);
          if (content.length > 3) {
            if (ProjectDA.obj.ListID && ProjectDA.obj.ListID.trim() != "") WBaseDA.getAssetsList(ProjectDA.obj.ListID, content);
          } else if (content.length == 0) {
            initUIAssetView();
            document.getElementById("search_input_assets").focus();
          }
        }
      }, 200);
    };
    search_container.appendChild(search_input);
    let btn_display_type = document.createElement("i");
    btn_display_type.className = "fa-solid fa-list-ul fa-sm";
    btn_display_type.style.margin = "0 8px 0 4px";
    btn_display_type.style.color = "#262626";
    search_container.appendChild(btn_display_type);
    let btn_book = document.createElement("i");
    btn_book.className = "fa-brands fa-readme fa-sm";
    btn_book.style.margin = "2px 4px 0 0";
    btn_book.style.color = "#262626";
    btn_book.onclick = function () {
      if (WBaseDA.assetsLoading) {
        WBaseDA.getAssetsList();
      } else {
        linkComptAndSkinDialog();
      }
    };
    search_container.appendChild(btn_book);
    let list_component_div = document.createElement("div");
    component_div.appendChild(list_component_div);
    list_component_div.className = "col";
    list_component_div.style.overflowY = "scroll";
    list_component_div.style.flex = 1;
    let assetsProjects = ProjectDA.assetsList;
    scroll_div.replaceChildren(...[{ ID: 0 }, ProjectDA.obj, ...assetsProjects].map((projectItem) => createListComponent(projectItem)));
    component_div.replaceChildren(search_container, scroll_div);
    children.push(component_div);
    // list component
    if (select_component) {
      children.push(instance_div);
      if (left_view.offsetWidth < 320) {
        left_view.style.width = "380px";
      }
      let instance_demo = document.createElement("div");
      instance_demo.className = "instance_demo";
      let list_relative_instance = [];
      list_relative_instance = [...select_component.children, select_component];
      list_relative_instance = list_relative_instance.map((e) => {
        let fakeItem = JSON.parse(JSON.stringify(e));
        fakeItem.value = null;
        fakeItem.ProjectID = select_component.ProjectID;
        return fakeItem;
      });
      let div_instance_value = document.createElement("div");
      div_instance_value.setAttribute("iswini", select_component.ProjectID !== 0 ? "true" : false);
      for (let inst of list_relative_instance) {
        await initComponents(
          inst,
          list_relative_instance.filter((e) => e.ParentID === inst.GID),
          false,
        );
        if (inst.StyleItem.FrameItem) {
          if (inst.value.style.width != "100%" && inst.value.style.width != "fit-content") inst.value.style.minWidth = inst.StyleItem.FrameItem.Width + "px";
          if (inst.value.style.height != "100%" && inst.value.style.height != "fit-content") inst.value.style.minHeight = inst.StyleItem.FrameItem.Height + "px";
        }
        if (inst.GID === select_component.GID) {
          div_instance_value.setAttribute("componentid", inst.GID);
          div_instance_value.appendChild(inst.value);
          instance_demo.appendChild(div_instance_value);
        }
      }
      if (instance_demo) {
        instance_div.replaceChildren(instance_demo);
        observer_instance.observe(instance_demo);
      }
    }
    assets_view.replaceChildren(...children);
  }
  assets_view.scrollTo({
    top: scrollY,
    behavior: "smooth",
  });
}

// create list component depend on projectId
function createListComponent(projectItem, isShowContent) {
  let currentListTile = document.getElementById(`component projectID:${projectItem.ID}`);
  let isShow = isShowContent ?? (currentListTile ? currentListTile.querySelector(".list_tile > .fa-caret-down") != undefined : false);
  let container = document.createElement("div");
  container.id = `component projectID:${projectItem.ID}`;
  container.className = "col";
  let list_tile = document.createElement("div");
  list_tile.className = "list_tile row";
  container.appendChild(list_tile);
  let prefix_action = document.createElement("i");
  prefix_action.className = `fa-solid fa-caret-${isShow ? "down" : "right"} fa-xs`;
  list_tile.appendChild(prefix_action);
  let title = document.createElement("p");
  title.className = "title";
  list_tile.appendChild(title);
  let container_child = document.createElement("div");
  container_child.className = "col";
  container_child.style.display = isShow ? "flex" : "none";
  container.appendChild(container_child);
  if (projectItem.ID === 0) {
    title.innerHTML = "Selected objects";
  } else if (projectItem.ID === ProjectDA.obj.ID) {
    title.innerHTML = "Local components";
  } else {
    title.innerHTML = projectItem.Name;
  }
  if (projectItem.ID === 0 || projectItem.ID === ProjectDA.obj.ID || isShow) {
    let list_component_parent = [];
    if (projectItem.ID === 0) {
      list_component_parent = selected_list.map((e) => {
        let jsonE = JSON.parse(JSON.stringify(e));
        jsonE.ProjectID = 0;
        return jsonE;
      });
    } else {
      list_component_parent = assets_list.filter((e) => e.ProjectID === projectItem.ID && assets_list.every((el) => !e.ListID.includes(el.GID)));
    }
    container_child.replaceChildren(...list_component_parent.map((comItem) => createComponentTile(comItem)));
  }
  list_tile.onclick = function () {
    if (!WBaseDA.assetsLoading) {
      isShow = !isShow;
      if (isShow) {
        if (projectItem.ID === 0 || projectItem.ID === ProjectDA.obj.ID) {
          container_child.style.display = "flex";
          prefix_action.className = "fa-solid fa-caret-down fa-xs";
        } else {
          WBaseDA.assetsLoading = true;
          let loader = document.createElement("div");
          loader.style.setProperty("--border-width", "3px");
          loader.style.width = "10px";
          loader.style.margin = "0 4px";
          loader.className = "data-loader";
          prefix_action.replaceWith(loader);
          WBaseDA.getAssetsList(projectItem.ID);
        }
      } else {
        container_child.style.display = "none";
        prefix_action.className = "fa-solid fa-caret-right fa-xs";
      }
    }
  };
  return container;
}

function updateListComponentByProject(projectItem, isShow = true) {
  let newListComponent = createListComponent(projectItem, isShow);
  document.getElementById(`component projectID:${projectItem.ID}`).replaceWith(newListComponent);
  WBaseDA.assetsLoading = false;
}

// create component tile
function createComponentTile(item, space = 0) {
  let container = document.createElement("div");
  container.id = `Component:${item.GID}`;
  container.className = "col assets-component-tile";
  container.style.marginLeft = `${16 + space}px`;
  let select_tile = document.createElement("div");
  select_tile.className = "row list_tile";
  container.appendChild(select_tile);
  let prefix_action = document.createElement("i");
  prefix_action.className = "fa-solid fa-caret-right fa-xs";
  select_tile.appendChild(prefix_action);
  let title = document.createElement("p");
  title.innerHTML = `${item.Name}`;
  title.className = "title";
  select_tile.appendChild(title);
  if (item.CateID === EnumCate.tool_variant) {
    let container_child = document.createElement("div");
    container_child.className = "col";
    container.appendChild(container_child);
    let children = [];
    if (item.ProjectID === 0) {
      children = wbase_list.filter((e) => e.ParentID === item.GID);
    } else {
      children = assets_list.filter((e) => e.ParentID === item.GID);
    }
    for (let i = 0; i < children.length; i++) {
      let result = createComponentTile(children[i], 8);
      container_child.appendChild(result);
    }
    select_tile.onclick = function () {
      if (container_child.style.display == "none") {
        container_child.style.display = "inline-flex";
        prefix_action.className = "fa-solid fa-caret-down fa-xs";
      } else {
        container_child.style.display = "none";
        prefix_action.className = "fa-solid fa-caret-right fa-xs";
      }
    };
  } else {
    select_tile.onclick = function () {
      if (item.ProjectID === 0 || item.ProjectID === ProjectDA.obj.ID) {
        select_component = JSON.parse(JSON.stringify(item));
        if (item.ProjectID === 0) {
          select_component.children = wbase_list.filter((e) => e.ListID.includes(item.GID)).map((e) => JSON.parse(JSON.stringify(e)));
        } else {
          select_component.children = assets_list.filter((e) => e.ListID.includes(item.GID)).map((e) => JSON.parse(JSON.stringify(e)));
        }
        initUIAssetView();
      } else {
        let loader = document.createElement("div");
        loader.style.setProperty("--border-width", "3px");
        loader.style.width = "10px";
        loader.style.margin = "0 4px";
        loader.className = "data-loader";
        prefix_action.replaceWith(loader);
        WBaseDA.getAssetChildren(item.GID).then((result) => {
          let relativeList = initDOM([...result, JSON.parse(JSON.stringify(item))]);
          arrange(relativeList);
          select_component = relativeList.pop();
          select_component.children = relativeList;
          initUIAssetView();
        });
      }
    };
  }
  return container;
}

const observer_instance = new ResizeObserver((entries) => {
  entries.forEach((entry) => {
    let instance_demo = entry.target;
    let instance_value = instance_demo.firstChild?.firstChild;
    if (instance_value) {
      instance_demo.style.height = entry.contentRect.width + "px";
      let scale = entry.contentRect.width - 16;
      scale = instance_value.offsetHeight > instance_value.offsetWidth ? scale / instance_value.offsetHeight : scale / instance_value.offsetWidth;
      instance_value.style.transform = `scale(${scale})`;
      instance_value.style.position = "absolute";
      let rectBox = instance_value.getBoundingClientRect();
      instance_value.style.left = `-${(instance_value.offsetWidth - rectBox.width) / 2}px`;
      instance_value.style.top = `-${(instance_value.offsetHeight - rectBox.height) / 2}px`;
      instance_demo.firstChild.style.width = rectBox.width + "px";
      instance_demo.firstChild.style.height = rectBox.height + "px";
    }
  });
});

const observer_listPage = new ResizeObserver((entries) => {
  entries.forEach((entry) => {
    let listPageHTML = entry.target;
    let listLayerHTML = document.getElementById(`parentID:${wbase_parentID}`);
    listLayerHTML.style.height = `calc(100% - ${listPageHTML.offsetHeight}px)`;
  });
});

function ondragSortLayer(event) {
  let fromY = document.getElementById("div_list_page").offsetHeight;
  let listLayer = [...document.getElementsByClassName("layer_wbase_tile")].filter((e) => e.offsetHeight > 0);
  if (listLayer.length > 1) {
    listLayer.sort((a, b) => {
      a.style.border = "1px solid transparent";
      b.style.border = "1px solid transparent";
      let rectA = a.getBoundingClientRect();
      let distanceA = Math.min(Math.abs(event.pageY - rectA.y), Math.abs(event.pageY - rectA.y - rectA.height));
      let rectB = b.getBoundingClientRect();
      let distanceB = Math.min(Math.abs(event.pageY - rectB.y), Math.abs(event.pageY - rectB.y - rectB.height));
      return distanceA - distanceB;
    });
    let minDistanceRect = listLayer[0].getBoundingClientRect();
    let rectTopY = minDistanceRect.y;
    let rectCenterY = minDistanceRect.y + minDistanceRect.height / 2;
    let rectBotY = minDistanceRect.y + minDistanceRect.height;
    let wbaseID = listLayer[0]?.id?.replace("wbaseID:", "");
    let layerViewY = document.getElementById(`parentID:${wbase_parentID}`).offsetTop + 41; // 40 is height of tab bar
    let sortWbase = wbase_list.find((wbaseItem) => wbaseItem.GID === wbaseID);
    let parent_cate = [...EnumCate.parent_cate];
    if (selected_list[0].CateID !== EnumCate.tool_variant && selected_list[0].IsWini) {
      parent_cate.push(EnumCate.tool_variant);
    }
    let wbaseHTML = document.getElementById(wbaseID);
    // drag to centerY of layer
    if (!listLayer[0].id.includes(selected_list[0].GID) && parent_cate.some((cate) => cate == listLayer[0].getAttribute("cateid")) && isInRange(event.pageY, rectCenterY - 6, rectCenterY + 6)) {
      let time = parseInt(sortLayer.getAttribute("time") ?? "0");
      time += 1;
      sortLayer.setAttribute("time", time);
      sortLayer.style.display = "none";
      updateHoverWbase(sortWbase);
      if (time >= 8) {
        let preAction = document.getElementById(`pefixAction:${wbaseID}`);
        if (preAction.className.includes("caret-right")) {
          preAction.className = preAction.className.replace("caret-right", "caret-down");
        }
      }
      let childHTML = [...wbaseHTML.querySelectorAll(":scope > .wbaseItem-value")];
      sortLayer.setAttribute("sort", Math.max(0, ...childHTML.map((eHTML) => parseInt(window.getComputedStyle(eHTML).zIndex))));
      sortLayer.setAttribute("parentid", wbaseID);
    } else if (Math.abs(event.pageY - rectTopY) <= Math.abs(event.pageY - rectBotY)) {
      // drag to abbove of layer
      sortLayer.removeAttribute("time");
      sortLayer.style.display = "block";
      updateHoverWbase();
      sortLayer.style.top = fromY + rectTopY - layerViewY + "px";
      sortLayer.style.width = minDistanceRect.width - (sortWbase.Level - 1) * 16 + "px";
      sortLayer.setAttribute("sort", sortWbase.Sort + 1);
      sortLayer.setAttribute("parentid", wbaseHTML.getAttribute("listid").split(",").pop());
    } else {
      // drag to below of layer
      sortLayer.removeAttribute("time");
      sortLayer.style.display = "block";
      updateHoverWbase();
      let preAction = document.getElementById(`pefixAction:${wbaseID}`);
      sortLayer.style.top = fromY + rectBotY - layerViewY + "px";
      let spacing = (sortWbase.Level - 1) * 16;
      if (preAction.className.includes("caret-down")) {
        spacing += 16;
        let childHTML = [...wbaseHTML.querySelectorAll(":scope > .wbaseItem-value")];
        sortLayer.setAttribute("sort", Math.max(0, ...childHTML.map((eHTML) => parseInt(window.getComputedStyle(eHTML).zIndex))) + 1);
        sortLayer.setAttribute("parentid", wbaseID);
      } else {
        sortLayer.setAttribute("sort", sortWbase.Sort);
        sortLayer.setAttribute("parentid", wbaseHTML.getAttribute("listid").split(",").pop());
      }
      sortLayer.style.width = `${minDistanceRect.width - spacing}px`;
    }
  }
}

function endDragSortLayer() {
  let listUpdate = [];
  let thisWbaseItem = selected_list[0];
  let currentParent;
  let thisWbaseHTML = document.getElementById(thisWbaseItem.GID);
  if (sortLayer) {
    let newParentID = sortLayer.getAttribute("parentid");
    let zIndex = parseInt(sortLayer.getAttribute("sort"));
    if (newParentID && zIndex != undefined) {
      thisWbaseHTML.style.order = zIndex;
      thisWbaseHTML.style.zIndex = zIndex;
      let newParent;
      if (newParentID !== wbase_parentID) newParent = wbase_list.find((e) => e.GID === newParentID);
      if (thisWbaseItem.ParentID != newParentID) {
        if (thisWbaseItem.ParentID != wbase_parentID) {
          currentParent = wbase_list.find((e) => e.GID === thisWbaseItem.ParentID);
          currentParent.ListChildID = currentParent.ListChildID.filter((id) => id !== thisWbaseItem.GID);
          currentParent.CountChild = currentParent.length;
          if (currentParent.CountChild == 0 && currentParent.WAutolayoutItem) {
            let oldParentHTML = document.getElementById(currentParent.GID);
            oldParentHTML.style.width = oldParentHTML.offsetWidth + "px";
            oldParentHTML.style.height = oldParentHTML.offsetHeight + "px";
            currentParent.StyleItem.FrameItem.Height = oldParentHTML.offsetHeight;
            currentParent.StyleItem.FrameItem.Width = oldParentHTML.offsetWidth;
            listUpdate.push(currentParent);
          }
          if (currentParent.CateID === EnumCate.tool_variant) {
            let listProperty = PropertyDA.list.filter((e) => e.BaseID === currentParent.GID);
            for (let property of listProperty) {
              property.BasePropertyItems = property.BasePropertyItems.filter((e) => e.BaseID != thisWbaseItem.GID);
            }
          }
        }
      }
      thisWbaseItem.ParentID = newParentID;
      if (newParentID === wbase_parentID) {
        let newParentHTML = divSection;
        thisWbaseItem.ListID = newParentID;
        thisWbaseHTML.setAttribute("listid", thisWbaseItem.ListID);
        thisWbaseItem.Level = 1;
        thisWbaseHTML.setAttribute("Level", thisWbaseItem.Level);
        newParentHTML.childNodes.forEach((eHTML) => {
          if (eHTML.id != thisWbaseItem.GID && parseInt(window.getComputedStyle(eHTML).order) >= zIndex) {
            let thisZIndex = parseInt(window.getComputedStyle(eHTML).order) + zIndex;
            eHTML.style.order = thisZIndex;
            eHTML.style.zIndex = thisZIndex;
          }
        });
        if ([...newParentHTML.childNodes].every((eHTML) => eHTML.id != thisWbaseItem.GID)) {
          let thisWbaseRect = thisWbaseHTML.getBoundingClientRect();
          let offsetLevel1 = offsetScale(thisWbaseRect.x, thisWbaseRect.y);
          thisWbaseHTML.style.position = "absolute";
          thisWbaseHTML.style.left = offsetLevel1.x + "px";
          thisWbaseHTML.style.top = offsetLevel1.y + "px";
          newParentHTML.appendChild(thisWbaseHTML);
        }
        let newParentChildren = [...newParentHTML.childNodes].filter((eHTML) => eHTML.id?.length == 36);
        newParentChildren.sort((a, b) => parseInt(window.getComputedStyle(a).order) - parseInt(window.getComputedStyle(b).order));
        let childrenWbase = wbase_list.filter((wbaseItem) => wbaseItem.ParentID == wbase_parentID);
        for (let i = 0; i < newParentChildren.length; i++) {
          let wbaseItemIndex = childrenWbase.find((wbaseItem) => wbaseItem.GID == newParentChildren[i].id);
          wbaseItemIndex.Sort = i;
          newParentChildren[i].style.order = i;
          newParentChildren[i].style.zIndex = i;
          listUpdate.push(wbaseItemIndex);
        }
        WBaseDA.parent([
          {
            GID: wbase_parentID,
            ListChildID: listUpdate.map((wbaseItem) => wbaseItem.GID),
          },
          ...listUpdate,
        ]);
      } else {
        let newParentHTML = document.getElementById(newParentID);
        thisWbaseItem.ListID = newParentHTML.getAttribute("listid") + `,${newParentID}`;
        thisWbaseHTML.setAttribute("listid", thisWbaseItem.ListID);
        thisWbaseItem.Level = thisWbaseItem.ListID.split(",").length;
        let children = [...newParentHTML.querySelectorAll(`.wbaseItem-value[level="${parseInt(newParentHTML.getAttribute("level")) + 1}"]`)];
        thisWbaseHTML.setAttribute("Level", thisWbaseItem.Level);
        children.forEach((eHTML) => {
          if (eHTML.id != thisWbaseItem.GID && parseInt(window.getComputedStyle(eHTML).zIndex) >= zIndex) {
            let thisZIndex = parseInt(window.getComputedStyle(eHTML).zIndex) + 1;
            eHTML.style.order = thisZIndex;
            eHTML.style.zIndex = thisZIndex;
          }
        });
        if (children.every((eHTML) => eHTML.id != thisWbaseHTML.id)) {
          if (window.getComputedStyle(newParentHTML).display.match(/(flex|grid)/g) && !thisWbaseHTML.classList.contains("fixed-position")) {
            thisWbaseHTML.style.position = "relative";
            thisWbaseHTML.style.left = null;
            thisWbaseHTML.style.top = null;
            thisWbaseHTML.style.right = null;
            thisWbaseHTML.style.bottom = null;
            thisWbaseHTML.style.transform = null;
            newParentHTML.appendChild(thisWbaseHTML);
          } else {
            let thisWbaseRect = thisWbaseHTML.getBoundingClientRect();
            let offsetLevel1 = offsetScale(thisWbaseRect.x, thisWbaseRect.y);
            let newParentRect = newParentHTML.getBoundingClientRect();
            let parentOffLevel1 = offsetScale(newParentRect.x, newParentRect.y);
            thisWbaseHTML.style.position = "absolute";
            updatePosition({ Left: offsetLevel1.x - parentOffLevel1.x, Top: offsetLevel1.y - parentOffLevel1.y }, thisWbaseItem);
            newParentHTML.appendChild(thisWbaseHTML);
          }
        }
        let thisWbaseChild = wbase_list.filter((wbase) => wbase.ListID.includes(thisWbaseItem.GID));
        for (let j = 0; j < thisWbaseChild.length; j++) {
          thisWbaseChild[j].ListID = thisWbaseItem.ListID + `,${thisWbaseItem.GID}`;
          thisWbaseChild[j].Level = thisWbaseChild[j].ListID.split(",").length;
          let childHTML = document.getElementById(thisWbaseChild[j].GID);
          childHTML.setAttribute("Level", thisWbaseChild[j].Level);
          childHTML.setAttribute("listid", thisWbaseChild[j].ListID);
        }
        let newParentChildren = [...newParentHTML.querySelectorAll(`.wbaseItem-value[level="${parseInt(newParentHTML.getAttribute("level")) + 1}"]`)];
        newParentChildren.sort((a, b) => parseInt(window.getComputedStyle(a).zIndex) - parseInt(window.getComputedStyle(b).zIndex));
        let childrenWbase = wbase_list.filter((e) => e.ParentID === newParentID);
        for (let i = 0; i < newParentChildren.length; i++) {
          let wbaseItemIndex = childrenWbase.find((wbaseItem) => wbaseItem.GID === newParentChildren[i].id);
          wbaseItemIndex.Sort = i;
          newParentChildren[i].style.order = i;
          newParentChildren[i].style.zIndex = i;
          listUpdate.push(wbaseItemIndex);
        }
        newParent.ListChildID = newParentChildren.map((wbaseItem) => wbaseItem.id);
        newParent.CountChild = newParentChildren.length;
        listUpdate.unshift(newParent);
        WBaseDA.parent(listUpdate);
      }
      arrange();
      if (newParent?.CateID === EnumCate.table) {
        createTable(newParent);
      }
      replaceAllLyerItemHTML();
      addSelectList(selected_list);
    }
  }
  sortLayer?.remove();
  sortLayer = undefined;
}

function linkComptAndSkinDialog() {
  let dialogBackground = document.createElement("div");
  dialogBackground.className = "dialog-background";
  dialogBackground.style.paddingTop = "46px";
  document.getElementById("body").appendChild(dialogBackground);
  document.getElementById("body").querySelector("#header").style.pointerEvents = "none";
  //
  let dialog = document.createElement("div");
  dialog.id = "dialog_link_component_skin";
  dialogBackground.appendChild(dialog);
  //
  let header = document.createElement("div");
  header.className = "header";
  dialog.appendChild(header);
  let libTab = document.createElement("p");
  libTab.innerHTML = "Library";
  header.appendChild(libTab);
  let closeBtn = document.createElement("i");
  closeBtn.className = "fa-solid fa-xmark fa-lg";
  closeBtn.style.padding = "8px";
  closeBtn.onclick = function () {
    dialogBackground.remove();
  };
  header.appendChild(closeBtn);
  //
  let libContent = document.createElement("div");
  libContent.id = "lib_dialog_content";
  dialog.appendChild(libContent);
  let searchContainer = document.createElement("div");
  libContent.appendChild(searchContainer);
  let searchPrefixIcon = document.createElement("i");
  searchPrefixIcon.className = "fa-solid fa-magnifying-glass fa-sm";
  searchPrefixIcon.style.padding = "8px 0 8px 16px";
  searchPrefixIcon.style.color = "#8C8C8C";
  searchContainer.appendChild(searchPrefixIcon);
  let searchInput = document.createElement("input");
  searchInput.placeholder = "Search...";
  searchContainer.appendChild(searchInput);
  let libContentDetails = document.createElement("div");
  libContentDetails.className = "lib_content_details";
  libContent.appendChild(libContentDetails);

  //
  let dialogBottom = document.createElement("div");
  dialogBottom.className = "dialog_bottom";
  dialog.appendChild(dialogBottom);
  linkComponentView();
}

function linkComponentView() {
  let dialog = document.getElementById("dialog_link_component_skin");
  let libContentDetails = dialog.querySelector(".lib_content_details");
  libContentDetails.replaceChildren(
    ...ProjectDA.list
      .filter((e) => e.ID != ProjectDA.obj.ID)
      .map((projectItem) =>
        createProjectTile(projectItem, function (project) {
          StyleDA.init(project);
        }),
      ),
  );
  let dialogBottom = dialog.querySelector(".dialog_bottom");
  let submitButton = document.createElement("div");
  submitButton.innerHTML = "Submit";
  submitButton.onclick = function (e) {
    e.stopPropagation();
    if (!StyleDA.skinProjectID && !ProjectDA.obj.EditListID) {
      let listLinkID = [...document.getElementsByClassName("project_tile")].filter((tileHTML) => tileHTML.querySelector(".toggle_ptoject_tile > input").checked).map((tileHTML) => tileHTML.id.replace("projectID:", ""));
      ProjectDA.obj.ListID = listLinkID.join(",");
      ProjectDA.obj.EditListID = true;
      ProjectDA.edit(ProjectDA.obj);
    }
  };
  dialogBottom.replaceChildren(submitButton);
}

function createProjectTile(projectItem, suffixOnclick) {
  let projectTile = document.createElement("div");
  projectTile.id = `projectID:${projectItem.ID}`;
  projectTile.className = "project_tile";
  let toggle = createSwitch(ProjectDA.obj.ListID?.split(",")?.includes(projectItem.ID.toString()));
  $(toggle).addClass(" toggle_ptoject_tile");
  toggle.style.setProperty("--unchecked-bg", "#ccc");
  toggle.style.setProperty("--checked-bg", "#1890ff");
  if (projectItem.Permission === EnumPermission.view) {
    toggle.style.pointerEvents = "none";
  }
  toggle.style.scale = 24 / 32;
  projectTile.appendChild(toggle);
  let projectName = document.createElement("p");
  projectName.innerHTML = projectItem.Name;
  projectTile.appendChild(projectName);
  let countComponent = document.createElement("p");
  countComponent.innerHTML = projectItem.CountComponent + " components";
  projectTile.appendChild(countComponent);
  let suffixAction = document.createElement("i");
  suffixAction.className = "fa-solid fa-chevron-right fa-sm";
  suffixAction.style.color = "#262626";
  suffixAction.style.padding = "10px";
  if (suffixOnclick) {
    suffixAction.onclick = function () {
      if (!StyleDA.skinProjectID) {
        let loader = document.createElement("div");
        loader.style.setProperty("--border-width", "4px");
        loader.style.width = "16px";
        loader.style.margin = "0 3px";
        loader.className = "data-loader";
        suffixAction.replaceWith(loader);
        suffixOnclick(ProjectDA.list.find((e) => e.ID == projectTile.id.replace("projectID:", "")));
      }
    };
  }
  projectTile.appendChild(suffixAction);
  return projectTile;
}

function linkSkinView(project) {
  let dialog = document.getElementById("dialog_link_component_skin");
  let libContentDetails = dialog.querySelector(".lib_content_details");
  let titleBar = document.createElement("div");
  titleBar.style.display = "flex";
  titleBar.style.gap = "12px";
  titleBar.style.alignItems = "center";
  titleBar.style.borderBottom = "1px solid #e5e5e5";
  titleBar.style.padding = "8px 0";
  let prefixIcon = document.createElement("i");
  prefixIcon.className = "fa-solid fa-chevron-left fa-lg";
  prefixIcon.style.padding = "12px 0 12px 8px";
  prefixIcon.onclick = function (e) {
    e.stopPropagation();
    linkComponentView();
  };
  let projectTitle = document.createElement("p");
  projectTitle.innerHTML = project.Name;
  projectTitle.style.fontSize = "14px";
  projectTitle.style.lineHeight = "22px";
  projectTitle.style.fontWeight = "600";
  projectTitle.style.margin = 0;
  titleBar.replaceChildren(prefixIcon, projectTitle);
  let listCateParent = [
    {
      ID: EnumCate.color,
      Name: "Color",
      ParentID: 1,
    },
    {
      ID: EnumCate.typography,
      Name: "Typography",
      ParentID: 1,
    },
    {
      ID: EnumCate.border,
      Name: "Border",
      ParentID: 1,
    },
    {
      ID: EnumCate.effect,
      Name: "Effect",
      ParentID: 1,
    },
  ];
  libContentDetails.replaceChildren(titleBar, ...listCateParent.map((cateItem) => checkboxLinkSkin(cateItem)));
  let dialogBottom = dialog.querySelector(".dialog_bottom");
  let insertButton = document.createElement("div");
  insertButton.innerHTML = "Insert to project";
  insertButton.onclick = function (e) {
    e.stopPropagation();
    let listColorID = [...libContentDetails.querySelector(`.EnumCate${EnumCate.color}`).querySelectorAll(".checkbox_skin_tile")].filter((tileHTML) => tileHTML.querySelector("input").checked);
    if (listColorID.length > 0) {
      let colorCates = listColorID.map((tileHTML) => tileHTML.getAttribute("cateid"));
      CateDA.list.push(...StyleDA.listCate.filter((cateItem) => colorCates.includes(cateItem.ID.toString())));
      listColorID = listColorID.map((tileHTML) => tileHTML.getAttribute("skinid"));
    }
    let listTypoID = [...libContentDetails.querySelector(`.EnumCate${EnumCate.typography}`).querySelectorAll(".checkbox_skin_tile")].filter((tileHTML) => tileHTML.querySelector("input").checked);
    if (listTypoID.length > 0) {
      let typoCates = listTypoID.map((tileHTML) => tileHTML.getAttribute("cateid"));
      CateDA.list.push(...StyleDA.listCate.filter((cateItem) => typoCates.includes(cateItem.ID.toString())));
      listTypoID = listTypoID.map((tileHTML) => tileHTML.getAttribute("skinid"));
    }
    let listBorderID = [...libContentDetails.querySelector(`.EnumCate${EnumCate.border}`).querySelectorAll(".checkbox_skin_tile")].filter((tileHTML) => tileHTML.querySelector("input").checked);
    if (listBorderID.length > 0) {
      let borderCates = listBorderID.map((tileHTML) => tileHTML.getAttribute("cateid"));
      CateDA.list.push(...StyleDA.listCate.filter((cateItem) => borderCates.includes(cateItem.ID.toString())));
      listBorderID = listBorderID.map((tileHTML) => tileHTML.getAttribute("skinid"));
    }
    let listEffectID = [...libContentDetails.querySelector(`.EnumCate${EnumCate.effect}`).querySelectorAll(".checkbox_skin_tile")].filter((tileHTML) => tileHTML.querySelector("input").checked);
    if (listEffectID.length > 0) {
      let effectCates = listEffectID.map((tileHTML) => tileHTML.getAttribute("cateid"));
      CateDA.list.push(...StyleDA.listCate.filter((cateItem) => effectCates.includes(cateItem.ID.toString())));
      listEffectID = listEffectID.map((tileHTML) => tileHTML.getAttribute("skinid"));
    }
    let styleCopySkin = {
      ID: 0,
      ColorIDs: listColorID.join(","),
      TypoIDs: listTypoID.join(","),
      BorderIDs: listBorderID.join(","),
      EffectIDs: listEffectID.join(","),
    };
    StyleDA.copySkin(styleCopySkin, project.ID);
    dialog.parentElement.remove();
  };
  dialogBottom.replaceChildren(insertButton);
}

function checkboxLinkSkin(cateItem) {
  let enumCate = cateItem.ParentID != 1 ? cateItem.ParentID : cateItem.ID;
  let cateForm = document.createElement("div");
  cateForm.className = "link_skin_cate_form";
  if (cateItem.ParentID == 1) {
    cateForm.style.borderBottom = "1px solid #e5e5e5";
    cateForm.className += ` EnumCate${enumCate}`;
  }
  let titleBar = document.createElement("div");
  cateForm.appendChild(titleBar);
  let title = document.createElement("p");
  title.innerHTML = cateItem.Name;
  let suffixAction = document.createElement("i");
  suffixAction.className = "fa-solid fa-caret-down fa-lg";
  suffixAction.onclick = function (e) {
    e.stopPropagation();
    if (this.className.includes("down")) {
      this.className = this.className.replace("down", "right");
      for (let i = 1; i < cateForm.childNodes.length; i++) {
        cateForm.childNodes[i].style.display = "none";
      }
    } else {
      this.className = this.className.replace("right", "down");
      for (let i = 1; i < cateForm.childNodes.length; i++) {
        cateForm.childNodes[i].style.display = "flex";
      }
    }
  };
  titleBar.replaceChildren(suffixAction, title);
  function onChangeCheckbox(isSingleCheck = true) {
    if (isSingleCheck) {
      if ([...cateForm.querySelectorAll("input")].splice(1).every((inputHTML) => inputHTML.checked)) {
        cateForm.querySelector("input").checked = true;
      } else {
        cateForm.querySelector("input").checked = false;
      }
    } else {
      cateForm.querySelectorAll("input").forEach((inputHTML) => (inputHTML.checked = cateForm.querySelector("input").checked));
    }
  }
  switch (enumCate) {
    case EnumCate.color:
      var listSkin = StyleDA.listColor.filter((e) => e.CateID == cateItem.ID);
      for (let skinItem of listSkin) {
        let checkboxSkinTile = document.createElement("div");
        checkboxSkinTile.className = "checkbox_skin_tile";
        checkboxSkinTile.setAttribute("skinid", skinItem.GID);
        checkboxSkinTile.setAttribute("cateid", skinItem.CateID);
        checkboxSkinTile.style.display = "flex";
        cateForm.appendChild(checkboxSkinTile);
        let checkbox = document.createElement("input");
        checkbox.onchange = function () {
          onChangeCheckbox();
        };
        checkbox.type = "checkbox";
        let skinName = document.createElement("p");
        skinName.innerHTML = skinItem.Name;
        checkboxSkinTile.replaceChildren(checkbox, skinName);
      }
      let listColorCate = [];
      if (cateItem.ParentID == 1) {
        listColorCate = StyleDA.listColor.filter((e) => e.CateID != EnumCate.color).filterAndMap((e) => e.CateID);
        listColorCate = StyleDA.listCate.filter((e) => {
          let check = listColorCate.some((id) => e.ID == id);
          if (check) e.ParentID = EnumCate.color;
          return check;
        });
      }
      if (listColorCate.length > 0 || listSkin.length > 0) {
        let checkbox = document.createElement("input");
        checkbox.onchange = function () {
          onChangeCheckbox(false);
        };
        checkbox.type = "checkbox";
        titleBar.replaceChildren(suffixAction, checkbox, title);
        for (let cateChild of listColorCate) {
          let cateFormChild = checkboxLinkSkin(cateChild);
          cateForm.appendChild(cateFormChild);
        }
      }
      break;
    case EnumCate.typography:
      var listSkin = StyleDA.listTypo.filter((e) => e.CateID == cateItem.ID);
      for (let skinItem of listSkin) {
        let checkboxSkinTile = document.createElement("div");
        checkboxSkinTile.className = "checkbox_skin_tile";
        checkboxSkinTile.setAttribute("skinid", skinItem.GID);
        checkboxSkinTile.setAttribute("cateid", skinItem.CateID);
        checkboxSkinTile.style.display = "flex";
        cateForm.appendChild(checkboxSkinTile);
        let checkbox = document.createElement("input");
        checkbox.onchange = function () {
          onChangeCheckbox();
        };
        checkbox.type = "checkbox";
        let skinName = document.createElement("p");
        skinName.innerHTML = skinItem.Name;
        checkboxSkinTile.replaceChildren(checkbox, skinName);
      }
      let listTypoCate = [];
      if (cateItem.ParentID == 1) {
        listTypoCate = StyleDA.listTypo.filter((e) => e.CateID != EnumCate.typography).filterAndMap((e) => e.CateID);
        listTypoCate = StyleDA.listCate.filter((e) => {
          let check = listTypoCate.some((id) => e.ID == id);
          if (check) e.ParentID = EnumCate.typography;
          return check;
        });
      }
      if (listTypoCate.length > 0 || listSkin.length > 0) {
        let checkbox = document.createElement("input");
        checkbox.onchange = function () {
          onChangeCheckbox(false);
        };
        checkbox.type = "checkbox";
        titleBar.replaceChildren(suffixAction, checkbox, title);
        for (let cateChild of listTypoCate) {
          let cateFormChild = checkboxLinkSkin(cateChild);
          cateForm.appendChild(cateFormChild);
        }
      }
      break;
    case EnumCate.border:
      var listSkin = StyleDA.listBorder.filter((e) => e.CateID == cateItem.ID);
      for (let skinItem of listSkin) {
        let checkboxSkinTile = document.createElement("div");
        checkboxSkinTile.className = "checkbox_skin_tile";
        checkboxSkinTile.setAttribute("skinid", skinItem.GID);
        checkboxSkinTile.setAttribute("cateid", skinItem.CateID);
        checkboxSkinTile.style.display = "flex";
        cateForm.appendChild(checkboxSkinTile);
        let checkbox = document.createElement("input");
        checkbox.onchange = function () {
          onChangeCheckbox();
        };
        checkbox.type = "checkbox";
        let skinName = document.createElement("p");
        skinName.innerHTML = skinItem.Name;
        checkboxSkinTile.replaceChildren(checkbox, skinName);
      }
      let listBorderCate = [];
      if (cateItem.ParentID == 1) {
        listBorderCate = StyleDA.listBorder.filter((e) => e.CateID != EnumCate.border).filterAndMap((e) => e.CateID);
        listBorderCate = StyleDA.listCate.filter((e) => {
          let check = listBorderCate.some((id) => e.ID == id);
          if (check) e.ParentID = EnumCate.border;
          return check;
        });
      }
      if (listBorderCate.length > 0 || listSkin.length > 0) {
        let checkbox = document.createElement("input");
        checkbox.onchange = function () {
          onChangeCheckbox(false);
        };
        checkbox.type = "checkbox";
        titleBar.replaceChildren(suffixAction, checkbox, title);
        for (let cateChild of listBorderCate) {
          let cateFormChild = checkboxLinkSkin(cateChild);
          cateForm.appendChild(cateFormChild);
        }
      }
      break;
    case EnumCate.effect:
      var listSkin = StyleDA.listEffect.filter((e) => e.CateID == cateItem.ID);
      for (let skinItem of listSkin) {
        let checkboxSkinTile = document.createElement("div");
        checkboxSkinTile.className = "checkbox_skin_tile";
        checkboxSkinTile.setAttribute("skinid", skinItem.GID);
        checkboxSkinTile.setAttribute("cateid", skinItem.CateID);
        checkboxSkinTile.style.display = "flex";
        cateForm.appendChild(checkboxSkinTile);
        let checkbox = document.createElement("input");
        checkbox.onchange = function () {
          onChangeCheckbox();
        };
        checkbox.type = "checkbox";
        let skinName = document.createElement("p");
        skinName.innerHTML = skinItem.Name;
        checkboxSkinTile.replaceChildren(checkbox, skinName);
      }
      let listEffectCate = [];
      if (cateItem.ParentID == 1) {
        listEffectCate = StyleDA.listEffect.filter((e) => e.CateID != EnumCate.effect).filterAndMap((e) => e.CateID);
        listEffectCate = StyleDA.listCate.filter((e) => {
          let check = listEffectCate.some((id) => e.ID == id);
          if (check) e.ParentID = EnumCate.effect;
          return check;
        });
      }
      if (listEffectCate.length > 0 || listSkin.length > 0) {
        let checkbox = document.createElement("input");
        checkbox.onchange = function () {
          onChangeCheckbox(false);
        };
        checkbox.type = "checkbox";
        titleBar.replaceChildren(suffixAction, checkbox, title);
        for (let cateChild of listEffectCate) {
          let cateFormChild = checkboxLinkSkin(cateChild);
          cateForm.appendChild(cateFormChild);
        }
      }
      break;
    default:
      break;
  }
  return cateForm;
}

function dragInstanceUpdate(event) {
  console.log("drag instance update");
  selectParent(event);
  instance_drag.style.left = instance_drag.offsetLeft + event.pageX - previousX + "px";
  instance_drag.style.top = instance_drag.offsetTop + event.pageY - previousY + "px";
  previousX = event.pageX;
  previousY = event.pageY;
  let parentHTML = parent;
  let isTableParent = parentHTML.localName === "table";
  document.getElementById(`demo_auto_layout`)?.remove();
  if (isTableParent) {
    console.log("table");
    let availableCell = findCell(parentHTML, event);
    if (availableCell) {
      let distance = 0;
      let cellChildren = [...availableCell.childNodes];
      if (cellChildren.length > 0) {
        cellChildren.sort((aHTML, bHTML) => {
          let aRect = aHTML.getBoundingClientRect();
          let bRect = bHTML.getBoundingClientRect();
          let a_center_oy = Math.abs(event.pageY - (aRect.y + aRect.height / 2));
          let b_center_oy = Math.abs(event.pageY - (bRect.y + bRect.height / 2));
          return a_center_oy - b_center_oy;
        });
        let closestHTML = cellChildren[0];
        let htmlRect = closestHTML.getBoundingClientRect();
        distance = event.pageY - (htmlRect.y + htmlRect.height / 2);
      }
      $(instance_drag).addClass("drag-hide");
      let demo = document.createElement("div");
      demo.id = "demo_auto_layout";
      demo.style.backgroundColor = "#1890FF";
      demo.style.height = `${2.4 / scale}px`;
      demo.style.width = `${instance_drag.firstChild.offsetWidth * 0.8}px`;
      if (distance < 0) {
        demo.style.zIndex = 0;
        demo.style.zIndex = Math.max(...cellChildren.map((e) => parseInt(e.style.zIndex))) + 1;
        availableCell.replaceChildren(demo, ...cellChildren);
      } else {
        demo.style.zIndex = Math.max(...cellChildren.map((e) => parseInt(e.style.zIndex))) + 1;
        availableCell.replaceChildren(...cellChildren, demo);
      }
    }
  } else if (window.getComputedStyle(parentHTML).display?.match(/(flex|grid)/g) && !select_component.StyleItem.PositionItem.FixPosition) {
    console.log("flex|grid");
    let children = [...parentHTML.querySelectorAll(`.wbaseItem-value[level="${parseInt(parentHTML.getAttribute("level") ?? "0") + 1}"]`)];
    let isGrid = window.getComputedStyle(parentHTML).display.match("grid");
    if (parentHTML.style.flexDirection == "column") {
      let zIndex = 0;
      let distance = 0;
      if (children.length > 0) {
        children.sort((aHTML, bHTML) => {
          let aRect = aHTML.getBoundingClientRect();
          let bRect = bHTML.getBoundingClientRect();
          let a_center_oy;
          let b_center_oy;
          if (isGrid) {
            a_center_oy = Math.sqrt(Math.pow(event.pageX - (aRect.x + aRect.width / 2), 2) + Math.pow(event.pageY - (aRect.y + aRect.height / 2), 2));
            b_center_oy = Math.sqrt(Math.pow(event.pageX - (bRect.x + bRect.width / 2), 2) + Math.pow(event.pageY - (bRect.y + bRect.height / 2), 2));
          } else {
            a_center_oy = Math.abs(event.pageY - (aRect.y + aRect.height / 2));
            b_center_oy = Math.abs(event.pageY - (bRect.y + bRect.height / 2));
          }
          return a_center_oy - b_center_oy;
        });
        let closestHTML = children[0];
        if (isGrid) {
          closestHTML = children.find((childHTML) => childHTML.getBoundingClientRect().bottom >= event.pageX);
        }
        if (closestHTML) {
          let closestRect = closestHTML.getBoundingClientRect();
          zIndex = parseInt(window.getComputedStyle(closestHTML).order);
          distance = event.pageY - (closestRect.y + closestRect.height / 2);
          if (distance < 0) {
            zIndex--;
          }
        } else {
          zIndex = Math.max(...children.map((childHTML) => parseInt(childHTML.style.zIndex)));
        }
      }
      $(instance_drag).addClass("drag-hide");
      let demo = document.createElement("div");
      demo.id = "demo_auto_layout";
      demo.style.backgroundColor = "#1890FF";
      demo.style.height = `${2.4 / scale}px`;
      demo.style.width = `${instance_drag.firstChild.offsetWidth * 0.8}px`;
      demo.style.order = zIndex;
      switch (parseInt(parentHTML.getAttribute("cateid"))) {
        case EnumCate.tree:
          parentHTML.querySelector(".children-value").appendChild(demo);
          break;
        case EnumCate.carousel:
          parentHTML.querySelector(".children-value").appendChild(demo);
          break;
        default:
          parentHTML.appendChild(demo);
          break;
      }
    } else {
      let zIndex = 0;
      let distance = 0;
      if (children.length > 0) {
        children.sort((aHTML, bHTML) => {
          let aRect = aHTML.getBoundingClientRect();
          let bRect = bHTML.getBoundingClientRect();
          let a_center_ox;
          let b_center_ox;
          if (isGrid) {
            a_center_ox = Math.sqrt(Math.pow(event.pageX - (aRect.x + aRect.width / 2), 2) + Math.pow(event.pageY - (aRect.y + aRect.height / 2), 2));
            b_center_ox = Math.sqrt(Math.pow(event.pageX - (bRect.x + bRect.width / 2), 2) + Math.pow(event.pageY - (bRect.y + bRect.height / 2), 2));
          } else {
            a_center_ox = Math.abs(event.pageX - (aRect.x + aRect.width / 2));
            b_center_ox = Math.abs(event.pageX - (bRect.x + bRect.width / 2));
          }
          return a_center_ox - b_center_ox;
        });
        let closestHTML = children[0];
        if (isGrid) {
          closestHTML = children.find((childHTML) => childHTML.getBoundingClientRect().bottom >= event.pageY);
        }
        if (closestHTML) {
          let closestRect = closestHTML.getBoundingClientRect();
          zIndex = parseInt(window.getComputedStyle(closestHTML).zIndex);
          distance = event.pageX - (closestRect.x + closestRect.width / 2);
          if (distance < 0) {
            zIndex--;
          }
        } else {
          zIndex = Math.max(...children.map((childHTML) => parseInt(childHTML.style.zIndex)));
        }
      }
      $(instance_drag).addClass("drag-hide");
      let demo = document.createElement("div");
      demo.id = "demo_auto_layout";
      demo.style.backgroundColor = "#1890FF";
      demo.style.width = `${2.4 / scale}px`;
      demo.style.height = `${instance_drag.firstChild.offsetHeight * 0.8}px`;
      demo.style.order = zIndex;
      switch (parseInt(parentHTML.getAttribute("cateid"))) {
        case EnumCate.tree:
          parentHTML.querySelector(".children-value").appendChild(demo);
          break;
        case EnumCate.carousel:
          parentHTML.querySelector(".children-value").appendChild(demo);
          break;
        default:
          parentHTML.appendChild(demo);
          break;
      }
    }
  } else {
    $(instance_drag).removeClass("drag-hide");
  }
}

function dragInstanceEnd(event) {
  WBaseDA.enumEvent = EnumEvent.copy;
  select_component.children = null;
  let newParent = parent;
  let parent_wbase;
  let isTableParent = newParent.localName === "table";
  if (newParent.id?.length === 36) parent_wbase = wbase_list.find((e) => e.GID === newParent.id);
  let drag_to_layout = window.getComputedStyle(newParent).display.match(/(flex|grid)/g);
  let newWb = JSON.parse(JSON.stringify(select_component));
  newWb.GID = uuidv4();
  newWb.value = instance_drag.firstChild;
  newWb.value.id = newWb.GID;
  newWb.ChildID = select_component.GID;
  newWb.IsCopy = true;
  newWb.IsWini = false;
  newWb.value.style.width = newWb.value.offsetWidth + "px";
  newWb.value.style.height = newWb.value.offsetHeight + "px";
  newWb.value.style.transform = null;
  newWb.value.removeAttribute("iswini");
  let zIndex = 0;
  if (isTableParent) {
    let demo = document.getElementById("demo_auto_layout");
    if (demo) {
      zIndex = parseInt(demo.style.order) + 1;
      demo.replaceWith(newWb.value);
    }
    let listCell = parent_wbase.TableRows.reduce((a, b) => a.concat(b));
    [...newParent.querySelectorAll(":scope > .table-row > .table-cell")].forEach((cell) => {
      listCell.find((e) => e.id === cell.id).contentid = [...cell.childNodes].map((e) => e.id).join(",");
    });
    parent_wbase.AttributesItem.Content = JSON.stringify(parent_wbase.TableRows);
    WBaseDA.listData.push(parent_wbase);
  } else if (drag_to_layout) {
    let demo = document.getElementById("demo_auto_layout");
    if (demo) {
      zIndex = parseInt(demo.style.order);
      demo.remove();
    }
  }
  $(newWb.value).removeClass("drag-hide");
  if (parent_wbase) {
    newWb.ParentID = newParent.id;
    newWb.ListID = parent_wbase.ListID + `,${newParent.id}`;
    newWb.Level = newWb.ListID.split(",").length;
    newWb.value.setAttribute("level", newWb.Level);
    newWb.value.setAttribute("listid", newWb.ListID);
  } else {
    newWb.ParentID = wbase_parentID;
    newWb.ListID = wbase_parentID;
    newWb.Level = 1;
    newWb.value.setAttribute("level", 1);
    newWb.value.setAttribute("listid", wbase_parentID);
  }
  if (isTableParent) {
    let wbaseChildren = [...newParent.querySelectorAll(`.wbaseItem-value[level="${parseInt(newParent.getAttribute("level") ?? "0") + 1}"]`)];
    for (let i = 0; i < wbaseChildren.length; i++) {
      wbaseChildren[i].style.zIndex = i;
    }
    newWb.Sort = zIndex;
    newWb.value.style.left = null;
    newWb.value.style.top = null;
    newWb.value.style.right = null;
    newWb.value.style.bottom = null;
    newWb.value.style.transform = null;
    newWb.StyleItem.PositionItem.FixPosition = false;
    newWb.StyleItem.PositionItem.ConstraintsX = Constraints.left;
    newWb.StyleItem.PositionItem.ConstraintsY = Constraints.top;
  } else if (drag_to_layout) {
    if (select_component.StyleItem.FrameItem.Width < 0 && parent_wbase.StyleItem.FrameItem.Width != undefined) {
      newWb.StyleItem.FrameItem.Width = select_component.StyleItem.FrameItem.Width;
      newWb.value.style.width = "100%";
    }
    if (select_component.StyleItem.FrameItem.Height < 0 && parent_wbase.StyleItem.FrameItem.Height != undefined) {
      newWb.StyleItem.FrameItem.Height = select_component.StyleItem.FrameItem.Height;
      newWb.value.style.height = "100%";
    }
    switch (parseInt(newParent.getAttribute("cateid"))) {
      case EnumCate.tree:
        newParent.querySelector(".children-value").appendChild(newWb.value);
        break;
      case EnumCate.carousel:
        newParent.querySelector(".children-value").appendChild(newWb.value);
        break;
      default:
        newParent.appendChild(newWb.value);
        break;
    }
    newWb.StyleItem.PositionItem.FixPosition = false;
    newWb.StyleItem.PositionItem.ConstraintsX = Constraints.left;
    newWb.StyleItem.PositionItem.ConstraintsY = Constraints.top;
    $(newWb.value).removeClass("fixed-position");
    newWb.value.style.position = "relative";
    newWb.value.style.left = null;
    newWb.value.style.right = null;
    newWb.value.style.top = null;
    newWb.value.style.bottom = null;
    newWb.value.style.transform = null;
    newWb.value.style.zIndex = zIndex;
    newWb.value.style.order = zIndex;
  } else {
    let parentRect = { x: 0, y: 0 };
    if (parent_wbase) {
      parentRect = newParent.getBoundingClientRect();
      parentRect = offsetScale(parentRect.x, parentRect.y);
    }
    let offset = offsetScale(event.pageX, event.pageY);
    newWb.StyleItem.PositionItem.Top = `${offset.y - newWb.value.offsetHeight - parentRect.y}px`;
    newWb.StyleItem.PositionItem.Left = `${offset.x - newWb.value.offsetWidth - parentRect.x}px`;
    newWb.value.style.left = newWb.StyleItem.PositionItem.Left;
    newWb.value.style.top = newWb.StyleItem.PositionItem.Top;
    newWb.StyleItem.PositionItem.ConstraintsX = Constraints.left;
    newWb.StyleItem.PositionItem.ConstraintsY = Constraints.top;
    newParent.appendChild(newWb.value);
  }
  WBaseDA.listData.push(newWb);
  wbase_list.push(newWb);
  if (parent_wbase) {
    let children = [...newParent.querySelectorAll(`.wbaseItem-value[level="${parseInt(newParent.getAttribute("level") ?? "0") + 1}"]`)];
    children.sort((a, b) => parseInt(a.style.zIndex) - parseInt(b.style.zIndex));
    for (let i = 0; i < children.length; i++) {
      let wbChild = wbase_list.find((wbase) => wbase.GID == children[i].id);
      if (wbChild) wbChild.Sort = i;
      children[i].style.zIndex = i;
      children[i].style.order = i;
    }
    parent_wbase.CountChild = children.length;
    parent_wbase.ListChildID = children.map((e) => e.id);
    WBaseDA.listData.push(parent_wbase);
  }
  replaceAllLyerItemHTML();
  parent = divSection;
  addSelectList([newWb]);
  newWb.value.setAttribute("loading", "true");
  action_list[action_index].tmpHTML = [newWb.value];
}
