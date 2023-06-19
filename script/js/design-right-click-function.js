var feature_list = [
  {
    title: "Select layer",
    more: function () {},
    onclick: function () {},
    isShow: function () {
      return selected_list.length > 0;
    },
  },
  {
    title: "Image document",
    onclick: function () {
      if (document.getElementById("popup_img_document") == undefined) {
        FileDA.init();
      }
    },
    isShow: function () {
      return true;
    },
    spaceLine: true,
  },
  {
    title: "Bring to front",
    shortKey: "Ctrl+Alt+]",
    onclick: function () {
      bringToFront();
    },
    isShow: function () {
      return selected_list.length > 0 && document.getElementById(select_box_parentID)?.getAttribute("cateid") != EnumCate.table;
    },
  },
  {
    title: "Bring frontward",
    shortKey: "Ctrl+]",
    onclick: function () {
      bringFrontward();
    },
    isShow: function () {
      return selected_list.length > 0 && document.getElementById(select_box_parentID)?.getAttribute("cateid") != EnumCate.table;
    },
  },
  {
    title: "Send to back",
    shortKey: "Ctrl+Alt+[",
    onclick: function () {
      sendToBack();
    },
    isShow: function () {
      return selected_list.length > 0 && document.getElementById(select_box_parentID)?.getAttribute("cateid") != EnumCate.table;
    },
  },
  {
    title: "Send backward",
    shortKey: "Ctrl+[",
    onclick: function () {
      sendBackward();
    },
    isShow: function () {
      return selected_list.length > 0 && document.getElementById(select_box_parentID)?.getAttribute("cateid") != EnumCate.table;
    },
    spaceLine: true,
  },
  {
    title: "Add auto layout",
    shortKey: "Shift+A",
    onclick: addAutoLayout,
    isShow: function () {
      return selected_list.length > 0;
    },
  },
  {
    title: "Create component",
    shortKey: "Ctrl+Alt+K",
    onclick: createComponent,
    isShow: function () {
      return selected_list.some((e) => !e.IsWini);
    },
  },
  {
    title: "Uncomponent",
    shortKey: "Alt+K",
    onclick: unComponent,
    isShow: function () {
      return selected_list.some((e) => e.IsWini) && document.getElementById(select_box_parentID)?.getAttribute("cateid") != EnumCate.tool_variant;
    },
  },
  {
    title: "Show/Hide UI",
    shortKey: "Ctrl+\\",
    onclick: showOnOffUI,
    isShow: function () {
      return true;
    },
    spaceLine: true,
  },
  {
    title: "Copy",
    shortKey: "Ctrl+C",
    onclick: saveWbaseCopy,
    isShow: function () {
      return selected_list.length > 0;
    },
  },
  {
    title: "Paste",
    shortKey: "Ctrl+V",
    onclick: pasteWbase,
    isShow: function () {
      return copy_item != undefined;
    },
  },
  {
    title: "Delete",
    shortKey: "Delete",
    onclick: function () {
      WBaseDA.delete(selected_list);
    },
    isShow: function () {
      return selected_list.length > 0;
    },
  },
];

function popupRightClick(event) {
  document.getElementById("wini_features")?.remove();
  let popup = document.createElement("wini_features");
  popup.id = "wini_features";
  popup.className = "wini_popup col popup_remove";
  popup.style.top = `${event.pageY}px`;
  popup.style.left = `${event.pageX}px`;
  document.getElementById("body").appendChild(popup);
  for (let i = 0; i < feature_list.length; i++) {
    if (feature_list[i].isShow()) {
      let option = document.createElement("div");
      option.className = "popup_function_option";
      option.style.order = i;
      popup.appendChild(option);
      let title = document.createElement("p");
      title.style.padding = "0";
      title.innerHTML = feature_list[i].title;
      option.appendChild(title);
      if (feature_list[i].more) {
        let btn_more_option = document.createElement("i");
        btn_more_option.className = "fa-solid fa-caret-right";
        option.appendChild(btn_more_option);
        btn_more_option.style.marginRight = "4px";
      } else {
        let shortKey = document.createElement("p");
        option.appendChild(shortKey);
        shortKey.style.padding = "0";
        shortKey.innerHTML = feature_list[i].shortKey ?? "";
        option.onclick = function () {
          feature_list[parseInt(this.style.order)].onclick();
          popup.remove();
        };
      }
      if (feature_list[i].spaceLine) {
        option.style.borderBottom = "1px solid #e5e5e5";
      }
    }
  }
  showPopupObserver.observe(popup);
}

function showOnOffUI() {
  if (left_view.style.display != "none") {
    left_view.style.display = "none";
    right_view.style.display = "none";
    scrollTop.style.right = "0px";
  } else {
    left_view.style.display = "block";
    right_view.style.display = "block";
    scrollTop.style.right = "260px";
  }
}

function saveWbaseCopy() {
  if (select_box) {
    copy_item = selected_list.map((e) => e.GID);
  }
}

function pasteWbase() {
  let listWb = [];
  let list_new_wbase = wbase_list.filter((e) => copy_item.some((id) => id === e.GID));
  if (list_new_wbase.length === copy_item.length) {
    list_new_wbase = list_new_wbase.map((e) => {
      let newWb = JSON.parse(JSON.stringify(e));
      let currentHTML = document.getElementById(e.GID);
      newWb.GID = uuidv4();
      newWb.value = currentHTML.cloneNode(true);
      newWb.value.id = newWb.GID;
      newWb.ChildID = e.GID;
      newWb.IsCopy = true;
      newWb.IsWini = false;
      newWb.value.style.width = currentHTML.offsetWidth + "px";
      newWb.value.style.height = currentHTML.offsetHeight + "px";
      newWb.value.style.transform = null;
      newWb.value.removeAttribute("iswini");
      tmpAltHTML.push(newWb.value);
      newWb.value.setAttribute("loading", "true");
      return newWb;
    });
    let newParent;
    let parent_wbase;
    if (selected_list.length === 1 && copy_item.every((id) => selected_list[0].GID !== id && !selected_list[0].ListID.includes(id))) {
      newParent = selected_list[0].value;
      parent_wbase = selected_list[0];
      if (parent_wbase.CateID === EnumCate.table) {
        let availableCell = findCell(newParent, { pageX: minx, pageY: miny });
        list_new_wbase.forEach((newWb) => availableCell.appendChild(newWb.value));
        let listCell = parent_wbase.TableRows.reduce((a, b) => a.concat(b));
        [...newParent.querySelectorAll(":scope > .table-row > .table-cell")].forEach((cell) => {
          listCell.find((e) => e.id === cell.id).contentid = [...cell.childNodes].map((e) => e.id).join(",");
        });
        parent_wbase.AttributesItem.Content = JSON.stringify(parent_wbase.TableRows);
        wbase_list.push(...list_new_wbase);
        listWb.push(...list_new_wbase);
      } else if (window.getComputedStyle(newParent).display.match(/(flex|grid)/g) && list_new_wbase.some((e) => !e.StyleItem.PositionItem.FixPosition)) {
        let zIndex = Math.max(0, ...newParent.querySelectorAll(`.wbaseItem-value[level="${parent_wbase.Level + 1}"]`)) + 1;
        for (let i = 0; i < list_new_wbase.length; i++) {
          list_new_wbase[i].value.style.left = null;
          list_new_wbase[i].value.style.top = null;
          list_new_wbase[i].value.style.right = null;
          list_new_wbase[i].value.style.bottom = null;
          list_new_wbase[i].value.style.transform = null;
          list_new_wbase[i].Sort = zIndex + i;
          if (list_new_wbase[i].StyleItem.FrameItem.Width < 0 && parent_wbase.StyleItem.FrameItem.Width == null) {
            selected_list[i].StyleItem.FrameItem.Width = list_new_wbase[i].value.offsetWidth;
          }
          if (list_new_wbase[i].StyleItem.FrameItem.Height < 0 && parent_wbase.StyleItem.FrameItem.Height == null) {
            selected_list[i].StyleItem.FrameItem.Height = list_new_wbase[i].value.offsetHeight;
          }
          switch (parseInt(newParent.getAttribute("cateid"))) {
            case EnumCate.tree:
              newParent.querySelector(".children-value").appendChild(list_new_wbase[i].value);
              break;
            case EnumCate.carousel:
              newParent.querySelector(".children-value").appendChild(list_new_wbase[i].value);
              break;
            default:
              newParent.appendChild(list_new_wbase[i].value);
              break;
          }
          listWb.push(list_new_wbase[i]);
          wbase_list.push(list_new_wbase[i]);
        }
      } else {
        let zIndex = Math.max(0, ...newParent.querySelectorAll(`.wbaseItem-value[level="${parent_wbase.Level + 1}"]`)) + 1;
        let parentRect = newParent.getBoundingClientRect();
        parentRect = offsetScale(parentRect.x, parentRect.y);
        for (let i = 0; i < list_new_wbase.length; i++) {
          list_new_wbase[i].Sort = zIndex + i;
          if (list_new_wbase[i].StyleItem.FrameItem.Width < 0) {
            selected_list[i].StyleItem.FrameItem.Width = list_new_wbase[i].value.offsetWidth;
          }
          if (list_new_wbase[i].StyleItem.FrameItem.Height < 0) {
            selected_list[i].StyleItem.FrameItem.Height = list_new_wbase[i].value.offsetHeight;
          }
          let offset = offsetScale(minx, miny);
          list_new_wbase[i].StyleItem.PositionItem.Top = `${offset.y - list_new_wbase[i].value.offsetHeight - parentRect.y}px`;
          list_new_wbase[i].StyleItem.PositionItem.Left = `${offset.x - list_new_wbase[i].value.offsetWidth - parentRect.x}px`;
          list_new_wbase[i].value.style.left = list_new_wbase[i].StyleItem.PositionItem.Left;
          list_new_wbase[i].value.style.top = list_new_wbase[i].StyleItem.PositionItem.Top;
          list_new_wbase[i].StyleItem.PositionItem.ConstraintsX = Constraints.left;
          list_new_wbase[i].StyleItem.PositionItem.ConstraintsY = Constraints.top;
          wbase_list.push(list_new_wbase[i]);
          listWb.push(list_new_wbase[i]);
          newParent.appendChild(list_new_wbase[i].value);
        }
      }
    } else {
      if (list_new_wbase[0].ParentID === wbase_parentID) {
        newParent = divSection;
      } else {
        parent_wbase = wbase_list.find((wb) => wb.GID === list_new_wbase[0].ParentID);
        newParent = document.getElementById(list_new_wbase[0].ParentID);
      }
      for (let i = 0; i < list_new_wbase.length; i++) {
        let selectHTML = list_new_wbase[i].value;
        list_new_wbase[i].Sort++;
        document.getElementById(list_new_wbase[i].ChildID).parentElement.appendChild(selectHTML);
        selectHTML.style.zIndex = list_new_wbase[i].Sort;
        selectHTML.style.order = list_new_wbase[i].Sort;
        if (parent_wbase?.CateID === EnumCate.table) {
          let listCell = parent_wbase.TableRows.reduce((a, b) => a.concat(b));
          [...newParent.querySelectorAll(":scope > .table-row > .table-cell")].forEach((cell) => {
            listCell.find((e) => e.id === cell.id).contentid = [...cell.childNodes].map((e) => e.id).join(",");
          });
          parent_wbase.AttributesItem.Content = JSON.stringify(parent_wbase.TableRows);
        }
        listWb.push(list_new_wbase[i]);
        wbase_list.push(list_new_wbase[i]);
      }
    }
    if (parent_wbase) {
      let children = [...newParent.querySelectorAll(`.wbaseItem-value[level="${parent_wbase.Level + 1}"]`)];
      children.sort((a, b) => parseInt(a.style.zIndex) - parseInt(b.style.zIndex));
      for (let i = 0; i < children.length; i++) {
        wbase_list.find((wbase) => wbase.GID == children[i].id).Sort = i;
        children[i].style.zIndex = i;
        children[i].style.order = i;
      }
      parent_wbase.CountChild = children.length;
      parent_wbase.ListChildID = children.map((e) => e.id);
      listWb.push(parent_wbase);
    }
    replaceAllLyerItemHTML();
    addSelectList(list_new_wbase);
    action_list[action_index].tmpHTML = [...tmpAltHTML];
    tmpAltHTML = [];
    WBaseDA.copy(listWb);
  } else {
    copy_item = null;
  }
}

function createComponent() {
  let un_component_list = selected_list.filter((e) => !e.IsWini);
  for (let i = 0; i < un_component_list.length; i++) {
    un_component_list[i].IsWini = true;
    un_component_list[i].value.setAttribute("Component", "true");
    un_component_list[i].value.setAttribute("IsWini", "true");
  }
  assets_list.push(...un_component_list);
  WBaseDA.edit(un_component_list, EnumObj.wBase);
  wdraw();
  updateUIDesignView();
  replaceAllLyerItemHTML();
}

function unComponent() {
  let component_list = selected_list.filter((e) => e.IsWini);
  for (let i = 0; i < component_list.length; i++) {
    component_list[i].IsWini = false;
    component_list[i].value.setAttribute("Component", "false");
    component_list[i].value.removeAttribute("IsWini");
  }
  assets_list = assets_list.filter((e) => component_list.every((wbaseItem) => wbaseItem.GID != e.GID));
  WBaseDA.edit(component_list, EnumObj.wBase);
  wdraw();
  updateUIDesignView();
  replaceAllLyerItemHTML();
}

function showImgDocument() {
  let imgDocument = createImgDocument();
  document.getElementById("body").appendChild(imgDocument);
}

let imgDocumentOffset = { x: 320, y: 320 };
function createImgDocument() {
  let divImgDoc = document.createElement("div");
  divImgDoc.id = "popup_img_document";
  divImgDoc.style.left = imgDocumentOffset.x + "px";
  divImgDoc.style.top = imgDocumentOffset.y + "px";
  divImgDoc.onclick = function () {
    document.getElementById("popup_img_options")?.remove();
    FileDA.selectFile();
  };
  let filePicker = document.createElement("input");
  filePicker.type = "file";
  filePicker.accept = FileDA.acceptFileTypes.join(",");
  filePicker.style.display = "none";
  filePicker.multiple = "multiple";
  filePicker.onchange = function () {
    FileDA.add(filePicker.files, CollectionDA.selectedDocument.ID);
  };
  divImgDoc.appendChild(filePicker);
  divImgDoc.onkeydown = function (e) {
    if (e.key == "Enter" && document.activeElement.localName == "input") {
      document.activeElement.blur();
    }
  };
  let header = document.createElement("div");
  header.className = "header_popup_skin";
  header.onmousedown = function (e) {
    e.stopPropagation();
    if (e.buttons == 1) {
      divImgDoc.setAttribute("offset", JSON.stringify({ x: e.clientX, y: e.clientY }));
    }
  };
  header.onmouseup = function (e) {
    e.stopPropagation();
    divImgDoc.removeAttribute("offset");
    imgDocumentOffset = { x: divImgDoc.offsetLeft, y: divImgDoc.offsetTop };
  };
  divImgDoc.appendChild(header);
  let title = document.createElement("span");
  title.style.flex = 1;
  title.innerHTML = "Image document";
  header.appendChild(title);
  let btn_close = document.createElement("i");
  btn_close.className = "fa-solid fa-xmark";
  btn_close.style.padding = "12px";
  btn_close.onclick = function () {
    divImgDoc.remove();
    CollectionDA.selectedDocument = undefined;
  };
  header.appendChild(btn_close);
  let body = document.createElement("div");
  body.style.width = "100%";
  body.style.height = "100%";
  body.style.flex = 1;
  body.style.display = "flex";
  divImgDoc.appendChild(body);
  let folder = document.createElement("div");
  folder.id = "list_folder_container";
  let folderHeader = document.createElement("div");
  folderHeader.style.justifyContent = "space-between";
  folderHeader.style.margin = "4px 0";
  folder.appendChild(folderHeader);
  let folderTitle = document.createElement("p");
  folderTitle.innerHTML = "Folder";
  folderTitle.style.marginLeft = "6px";
  folderTitle.style.fontWeight = "600";
  folderHeader.appendChild(folderTitle);
  let btnAddFolder = document.createElement("i");
  btnAddFolder.className = "fa-solid fa-plus fa-sm";
  btnAddFolder.style.padding = "10px 8px";
  btnAddFolder.onclick = function () {
    let newFolder = {
      ID: 0,
      Name: "new folder",
      Type: ApiSelection.document,
    };
    CollectionDA.addDocument(newFolder);
  };
  folderHeader.appendChild(btnAddFolder);
  body.appendChild(folder);
  if (CollectionDA.documentList[0].ID != -1) {
    CollectionDA.documentList.unshift({
      ID: -1,
      Name: "Recycle bin",
    });
  }
  for (let i = 0; i < CollectionDA.documentList.length; i++) {
    let folderTile = createFolderTile(CollectionDA.documentList[i]);
    folder.appendChild(folderTile);
  }
  let divImgs = document.createElement("div");
  divImgs.id = "list_img_container";
  divImgs.onauxclick = function (event) {
    event.stopPropagation();
    let popupImgOption = document.getElementById("popup_img_options");
    if (popupImgOption == undefined) {
      popupImgOption = document.createElement("div");
      popupImgOption.id = "popup_img_options";
      popupImgOption.className = "wini_popup col popup_remove";
    }
    popupImgOption.style.left = event.pageX + "px";
    popupImgOption.style.top = event.pageY + "px";
    let children = [];
    if (CollectionDA.selectedDocument.ID != -1) {
      let optionAdd = document.createElement("div");
      optionAdd.className = "row";
      optionAdd.innerHTML = "add image";
      optionAdd.onclick = function (e) {
        e.stopPropagation();
        popupImgOption.remove();
        filePicker.showPicker();
      };
      children.push(optionAdd);
      let optionPaste = document.createElement("div");
      optionPaste.className = "row";
      optionPaste.innerHTML = "paste here";
      optionPaste.onclick = function (e) {};
      children.push(optionPaste);
    }
    if (event.target.className?.includes("img_folder_demo")) {
      if (FileDA.selectedFile.every((e) => e.ID != event.target.getAttribute("fileID"))) {
        FileDA.selectFile(FileDA.list.filter((e) => e.ID == event.target.getAttribute("fileID")));
      }
    }
    if (FileDA.selectedFile.length > 0) {
      if (CollectionDA.selectedDocument.ID == -1) {
        let optionRecycle = document.createElement("div");
        optionRecycle.className = "row";
        optionRecycle.innerHTML = "recycle";
        optionRecycle.onclick = function (e) {
          e.stopPropagation();
          popupImgOption.remove();
          FileDA.recycle(FileDA.selectedFile.map((_file) => _file.ID));
          selectFolder(CollectionDA.selectedDocument);
        };
        children.push(optionRecycle);
      }
      let optionDelete = document.createElement("div");
      optionDelete.className = "row";
      optionDelete.innerHTML = "delete";
      optionDelete.onclick = function (e) {
        e.stopPropagation();
        popupImgOption.remove();
        if (CollectionDA.selectedDocument.ID == -1) {
          FileDA.delete(FileDA.selectedFile.map((_file) => _file.ID));
        } else {
          FileDA.recycle(FileDA.selectedFile.map((_file) => _file.ID));
        }
        selectFolder(CollectionDA.selectedDocument);
      };
      children.push(optionDelete);
    }
    if (children.length > 0) {
      popupImgOption.replaceChildren(...children);
      document.getElementById("body").appendChild(popupImgOption);
    }
  };
  divImgs.onclick = function (event) {
    event.stopPropagation();
    document.getElementById("popup_img_options")?.remove();
    if (event.target.className?.includes("img_folder_demo")) {
      if (event.shiftKey) {
        if (FileDA.selectedFile.every((e) => e.ID != event.target.getAttribute("fileID"))) {
          FileDA.selectFile([...FileDA.selectedFile, ...FileDA.list.filter((e) => e.ID == event.target.getAttribute("fileID"))]);
        }
      } else {
        FileDA.selectFile(FileDA.list.filter((e) => e.ID == event.target.getAttribute("fileID")));
      }
    } else {
      FileDA.selectFile();
    }
  };
  body.appendChild(divImgs);
  let inputSearch = document.createElement("div");
  let inputPrefixIcon = document.createElement("i");
  inputPrefixIcon.className = "fa-solid fa-magnifying-glass fa-xs";
  inputPrefixIcon.style.color = "#8c8c8c";
  inputPrefixIcon.style.marginLeft = "6px";
  inputSearch.appendChild(inputPrefixIcon);
  let input = document.createElement("input");
  input.placeholder = "image name...";
  input.oninput = function (e) {
    e.stopPropagation();
    selectFolder(CollectionDA.selectedDocument, this.value);
    input.focus();
  };
  inputSearch.appendChild(input);
  divImgs.appendChild(inputSearch);
  let notiText = document.createElement("p");
  notiText.innerHTML = "Select a folder.";
  notiText.style.fontSize = "14px";
  notiText.style.fontWeight = "600";
  divImgs.appendChild(notiText);
  return divImgDoc;
}

function createFolderTile(collectionItem) {
  let folderTile = document.createElement("div");
  folderTile.id = `folder:${collectionItem.ID}`;
  folderTile.className = "folder_tile";
  folderTile.onclick = function (e) {
    e.stopPropagation();
    selectFolder(collectionItem);
  };
  let prefixIcon = document.createElement("i");
  prefixIcon.className = "fa-regular fa-folder";
  prefixIcon.style.margin = "2px 6px";
  folderTile.appendChild(prefixIcon);
  let folderName = document.createElement("input");
  folderName.readOnly = true;
  folderName.style.pointerEvents = "none";
  folderName.value = collectionItem.Name;
  if (collectionItem.ID != -1) {
    folderTile.ondblclick = function (e) {
      e.stopPropagation();
      folderName.style.pointerEvents = "auto";
      folderName.style.cursor = "text";
      folderName.readOnly = false;
      folderName.setSelectionRange(0, folderName.value.length);
      folderName.focus();
    };
    folderName.onblur = function () {
      this.style.cursor = "context-menu";
      this.style.pointerEvents = "none";
      this.setSelectionRange(0, 1);
      this.readOnly = true;
      let thisFolder = CollectionDA.documentList.find((folder) => folder.ID == folderTile.id.replace("folder:", ""));
      thisFolder.Name = this.value;
      CollectionDA.editDocument(thisFolder);
    };
  }
  folderTile.appendChild(folderName);
  return folderTile;
}

function selectFolder(collectionItem, search = "") {
  CollectionDA.selectedDocument = collectionItem;
  [...document.getElementsByClassName("folder_tile")].forEach((eHTML) => {
    if (eHTML.id.replace("folder:", "") == collectionItem.ID) {
      eHTML.style.backgroundColor = "#e6f7ff";
      let prefixIcon = [...eHTML.childNodes].find((e) => e.localName == "i");
      prefixIcon.className = "fa-regular fa-folder-open";
    } else {
      eHTML.style.backgroundColor = "transparent";
      let prefixIcon = [...eHTML.childNodes].find((e) => e.localName == "i");
      prefixIcon.className = "fa-regular fa-folder";
    }
  });
  let divImgs = document.getElementById("list_img_container");
  let children = [
    divImgs.firstChild, // input search
  ];
  let fileList = FileDA.list.filter((e) => {
    if (search.trim() !== "" && !e.Name.toLowerCase().includes(search.toLowerCase().trim())) return false;
    if (collectionItem.ID != -1) {
      return e.CollectionID == collectionItem.ID && !e.IsDeleted;
    } else {
      return e.IsDeleted;
    }
  });
  if (fileList.length > 0) {
    for (let i = 0; i < fileList.length; i++) {
      let _img = document.createElement("div");
      _img.setAttribute("fileID", fileList[i].ID);
      _img.className = "img_folder_demo";
      _img.style.backgroundImage = `url(${urlImg + fileList[i].Url?.replaceAll(" ", "%20")})`;
      _img.ondblclick = function (e) {
        e.stopPropagation();
        if (stringInputFiled) {
          stringInputFiled.value = urlImg + fileList[i].Url?.replaceAll(" ", "%20");
        } else if (selected_list.length > 0 && selected_list.every((wbaseItem) => EnumCate.noImgBg.every((cate) => wbaseItem.CateID !== cate))) {
          let thisUrl = FileDA.list.find((e) => e.ID == this.getAttribute("fileID"))?.Url?.replaceAll(" ", "%20");
          if (thisUrl) {
            editBackgroundImage(thisUrl);
            updateUIBackground();
          }
        }
      };
      children.push(_img);
    }
  } else {
    let notiText = document.createElement("p");
    notiText.innerHTML = CollectionDA.selectedDocument == undefined ? "Select a folder." : "There are no images in this folder.";
    notiText.style.fontSize = "14px";
    notiText.style.fontWeight = "600";
    children.push(notiText);
  }
  divImgs.replaceChildren(...children);
}

async function handleImportFile(event) {
  if (event.targetElement == "popup_img_document") {
    let folderID = CollectionDA.selectedDocument?.ID;
    if (folderID == undefined || folderID == -1) {
      folderID = CollectionDA.documentList.find((e) => e.ID != -1).ID;
    }
    FileDA.add(event.dataTransfer, folderID);
  } else if (event.targetElement == "canvas_view") {
    let folderID = CollectionDA.selectedDocument?.ID;
    if (folderID == undefined || folderID == -1) {
      folderID = CollectionDA.documentList.find((e) => e.ID != -1).ID;
    }
    let result = await FileDA.add(event.dataTransfer, folderID);
    selectParent(event);
    let offset = offsetScale(Math.min(minx, event.pageX), Math.min(miny, event.pageY));
    let listAdd = [];
    for (let fileItem of result) {
      let newRect = fileItem.Name.endsWith(".svg") ? WBaseDefault.imgSvg : WBaseDefault.rectangle;
      newRect.AttributesItem.Content = fileItem.Url;
      let imgSize = await FileDA.getImageSize(urlImg + fileItem.Url);
      let newObj = createWbaseHTML(
        {
          w: imgSize.w,
          h: imgSize.h,
          x: offset.x - imgSize.w / 2,
          y: offset.y - imgSize.h / 2,
          parentID: parent.id?.length == 36 ? parent.id : wbase_parentID,
        },
        newRect,
      );
      listAdd.push(newObj);
    }
    addSelectList(listAdd);
    WBaseDA.add(listAdd);
  }
}

function bringToFront() {
  selected_list.sort((a, b) => a.Sort - b.Sort);
  let parentWbase;
  if (select_box_parentID == wbase_parentID) {
    let listChild = wbase_list.filter((e) => selected_list.every((selectItem) => selectItem.GID != e.GID));
    if (listChild.length == 0) return;
    listChild.push(...selected_list);
    for (let i = 0; i < listChild.length; i++) {
      listChild[i].Sort = i;
      listChild[i].value.style.zIndex = i;
      listChild[i].value.style.order = i;
    }
    arrange();
    parentWbase = {
      GID: wbase_parentID,
      ListChildID: listChild.map((e) => e.GID),
    };
  } else {
    parentWbase = wbase_list.find((e) => e.GID == select_box_parentID);
    if (parentWbase.CountChild == selected_list.length) return;
    parentWbase.ListChildID = parentWbase.ListChildID.filter((id) => selected_list.every((selectItem) => selectItem.GID != id));
    parentWbase.ListChildID.push(...selected_list.map((e) => e.GID));
    for (let i = 0; i < parentWbase.ListChildID.length; i++) {
      let thisWbase = wbase_list.find((e) => e.GID == parentWbase.ListChildID[i]);
      thisWbase.Sort = i;
      thisWbase.value.style.zIndex = i;
      thisWbase.value.style.order = i;
    }
    arrange();
  }
  replaceAllLyerItemHTML();
  WBaseDA.parent([parentWbase, ...selected_list]);
  updateHoverWbase();
  addSelectList(selected_list);
}

function bringFrontward() {
  let parentWbase;
  if (select_box_parentID == wbase_parentID) {
    let listChild = wbase_list.filter((e) => e.ParentID == wbase_parentID);
    for (let i = 0; i < listChild.length; i++) {
      listChild[i].Sort = i;
      listChild[i].value.style.zIndex = i;
      listChild[i].value.style.order = i;
    }
    if (listChild.length == selected_list.length) return;
    selected_list.forEach((e) => {
      if (e.Sort < listChild.length - 1) e.Sort++;
      e.value.style.zIndex = e.Sort;
      e.value.style.order = e.Sort;
    });
    listChild = wbase_list.filter((e) => selected_list.every((selectItem) => selectItem.GID != e.GID));
    for (let child of listChild) {
      if (selected_list.some((e) => e.Sort == child.Sort)) child.Sort -= 1;
      child.value.style.zIndex = child.Sort;
      child.value.style.order = child.Sort;
    }
    arrange();
    parentWbase = {
      GID: wbase_parentID,
      ListChildID: wbase_list.filter((e) => e.ParentID == wbase_parentID).map((e) => e.GID),
    };
  } else {
    parentWbase = wbase_list.find((e) => e.GID == select_box_parentID);
    for (let i = 0; i < parentWbase.ListChildID.length; i++) {
      let thisWbase = wbase_list.find((e) => e.GID == parentWbase.ListChildID[i]);
      thisWbase.Sort = i;
      thisWbase.value.style.zIndex = i;
      thisWbase.value.style.order = i;
    }
    if (parentWbase.CountChild == selected_list.length) return;
    selected_list.forEach((e) => {
      if (e.Sort < parentWbase.CountChild - 1) e.Sort++;
      e.value.style.zIndex = e.Sort;
      e.value.style.order = e.Sort;
    });
    parentWbase.ListChildID = parentWbase.ListChildID.filter((id) => selected_list.every((selectItem) => selectItem.GID != id));
    for (let id of parentWbase.ListChildID) {
      let thisWbase = wbase_list.find((e) => e.GID == id);
      if (selected_list.some((e) => e.Sort == thisWbase.Sort)) thisWbase.Sort -= 1;
      thisWbase.value.style.zIndex = thisWbase.Sort;
      thisWbase.value.style.order = thisWbase.Sort;
    }
    arrange();
    parentWbase.ListChildID = wbase_list.filter((e) => e.ParentID == parentWbase.GID).map((e) => e.GID);
  }
  replaceAllLyerItemHTML();
  WBaseDA.parent([parentWbase, ...selected_list]);
  updateHoverWbase();
  addSelectList(selected_list);
}

function sendToBack() {
  selected_list.sort((a, b) => a.Sort - b.Sort);
  let parentWbase;
  if (select_box_parentID == wbase_parentID) {
    let listChild = wbase_list.filter((e) => selected_list.every((selectItem) => selectItem.GID != e.GID));
    if (listChild.length == 0) return;
    listChild.unshift(...selected_list);
    for (let i = 0; i < listChild.length; i++) {
      listChild[i].Sort = i;
      listChild[i].value.style.zIndex = i;
      listChild[i].value.style.order = i;
    }
    arrange();
    parentWbase = {
      GID: wbase_parentID,
      ListChildID: listChild.map((e) => e.GID),
    };
  } else {
    parentWbase = wbase_list.find((e) => e.GID == select_box_parentID);
    if (parentWbase.CountChild == selected_list.length) return;
    parentWbase.ListChildID = parentWbase.ListChildID.filter((id) => selected_list.every((selectItem) => selectItem.GID != id));
    parentWbase.ListChildID.unshift(...selected_list.map((e) => e.GID));
    for (let i = 0; i < parentWbase.ListChildID.length; i++) {
      let thisWbase = wbase_list.find((e) => e.GID == parentWbase.ListChildID[i]);
      thisWbase.Sort = i;
      thisWbase.value.style.zIndex = i;
      thisWbase.value.style.order = i;
    }
    arrange();
  }
  replaceAllLyerItemHTML();
  WBaseDA.parent([parentWbase, ...selected_list]);
  updateHoverWbase();
  addSelectList(selected_list);
}

function sendBackward() {
  let parentWbase;
  if (select_box_parentID == wbase_parentID) {
    let listChild = wbase_list.filter((e) => e.ParentID == wbase_parentID);
    if (listChild.length == selected_list.length) return;
    for (let i = 0; i < listChild.length; i++) {
      listChild[i].Sort = i;
      listChild[i].value.style.zIndex = i;
      listChild[i].value.style.order = i;
    }
    selected_list.forEach((e) => {
      if (e.Sort > 0) e.Sort -= 1;
      e.value.style.zIndex = e.Sort;
      e.value.style.order = e.Sort;
    });
    listChild = wbase_list.filter((e) => selected_list.every((selectItem) => selectItem.GID != e.GID));
    for (let child of listChild) {
      if (selected_list.some((e) => e.Sort == child.Sort)) child.Sort += 1;
      child.value.style.zIndex = child.Sort;
      child.value.style.order = child.Sort;
    }
    arrange();
    parentWbase = {
      GID: wbase_parentID,
      ListChildID: wbase_list.filter((e) => e.ParentID == wbase_parentID).map((e) => e.GID),
    };
  } else {
    parentWbase = wbase_list.find((e) => e.GID == select_box_parentID);
    if (parentWbase.CountChild == selected_list.length) return;
    for (let i = 0; i < parentWbase.ListChildID.length; i++) {
      let thisWbase = wbase_list.find((e) => e.GID == parentWbase.ListChildID[i]);
      thisWbase.Sort = i;
      thisWbase.value.style.zIndex = i;
      thisWbase.value.style.order = i;
    }
    selected_list.forEach((e) => {
      if (e.Sort > 0) e.Sort -= 1;
      e.value.style.zIndex = e.Sort;
      e.value.style.order = e.Sort;
    });
    parentWbase.ListChildID = parentWbase.ListChildID.filter((id) => selected_list.every((selectItem) => selectItem.GID !== id));
    for (let id of parentWbase.ListChildID) {
      let thisWbase = wbase_list.find((e) => e.GID == id);
      if (selected_list.some((e) => e.Sort == thisWbase.Sort)) thisWbase.Sort += 1;
      thisWbase.value.style.zIndex = thisWbase.Sort;
      thisWbase.value.style.order = thisWbase.Sort;
    }
    arrange();
    parentWbase.ListChildID = wbase_list.filter((e) => e.ParentID == parentWbase.GID).map((e) => e.GID);
  }
  replaceAllLyerItemHTML();
  WBaseDA.parent([parentWbase, ...selected_list]);
  updateHoverWbase();
  addSelectList(selected_list);
}
