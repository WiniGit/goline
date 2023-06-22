// const { data } = require("jquery");

const urlImg = urlFile;
// const urlImg = "http://10.15.138.23:86/";
const urlSocketIO = socketWini;
// const socket = io("ws://10.15.138.23:4000"
const socket = io(urlSocketIO, {
  //reconnectionDelayMax: 1000,
  auth: {
    token: "123",
  },
  query: {
    "my-key": "my-value",
  },
});
socket.on("connect", () => {
  // WIndexedDB.initDB();
  console.log("socketID:" + socket.id); // "G5p5..."
  console.log("socket connect" + socket.connected); // true
  PageDA.obj = undefined;
  PageDA.list = [];
  if (socket.connected) {
    PageDA.pageLoadingView(function () {
      clearActionListFrom();
      WiniIO.emitRefreshToken();
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      const projectID = urlParams.get("id");
      ProjectDA.openingList = JSON.parse(Ultis.getStorage("list-project-tab")) ?? [];
      ProjectDA.obj = ProjectDA.openingList.find((e) => e.ID === projectID);
      if (!ProjectDA.obj) {
        ProjectDA.obj = { ID: projectID };
      }
      ProjectDA.getProjectInfor();
      ProjectDA.getByID();
      ProjectDA.getPermission();
      ProjectDA.init();
    });
  }
});
//socket.io.on("error", (error) => {
//	// ...
//	socket.io.on("reconnect_attempt", (attempt) => {
//		// ...
//	});
//});
socket.io.on("ping", () => {
  //console.log("ping_connect");
});

socket.on("server-log", (data) => {
  console.log("server-log");
  console.log(data);
  switch (data.Code) {
    case StatusApi.refreshToken:
      toastr["error"]("Phiên làm việc của bạn đã hết hạn, vui lòng đăng nhập lại!!!");
      window.location.href = "/View/login-tool-view.html";
      break;
    default:
      toastr["error"](data.Message);
    // window.location.href = "/View/home-screen.html";
  }
});
// socket.on('server-init-style', (data) => {
//     console.log("init style");
//     let result = data.data;
//     console.log(result);
//     ColorDA.list = result.ColorItems;
//     TypoDA.list = result.TextStyleItems;
//     EffectDA.list = result.EffectItems;
//     BorderDA.list = result.BorderItems;
//     PropertyDA.list = result.WPropertyItems;
//     [...ColorDA.list, ...TypoDA.list, ...EffectDA.list, ...BorderDA.list].forEach(skinData => {
//         WIndexedDB.add_dataRequestStore(skinData, WIndexedDB.skinStore);
//     })
//     WiniIO.emitInit(EnumObj.wBase);
// });
// //thay hàm init cũ
// socket.on('server-init-base', (data) => {
//     console.log('server-init-wbase', data.data);
//     let result = data.data;
//     wbase_list = result;
//     wbase_list.forEach(wbaseData => {
//         WIndexedDB.add_dataRequestStore(wbaseData, WIndexedDB.skinStore);
//     })
//     parent = divSection;
//     selected_list = [];
//     updateHoverWbase();
//     arrange();
//     replaceAllLyerItemHTML();
//     assets_list = wbase_list.filter(wbaseItem => wbaseItem.IsWini);
//     PageDA.selectPage(PageDA.obj);
// });
// socket.on('server-init-wbase', (data) => {
//     console.log('server-init-base-component', data);
//     base_component_list = data.data;
//     base_component_list.forEach(e => {
//         if (e.CateID === EnumCate.radio_button && e.Level === 1) {
//             e.StyleItem.DecorationItem.BorderItem.ColorValue = "FFccd7e6";
//         } else if (e.CateID === EnumCate.textfield) {
//             e.IsShow = false;
//         }
//     })
// });
socket.on("server-color", (data) => {
  console.log("server-color");
  console.log(data);
  let obj = data.data;
  if (data.pid == ProjectDA.obj.ID) {
    switch (data.enumEvent) {
      case EnumEvent.delete:
        ColorDA.list = ColorDA.list.filter((e) => e.GID != obj.GID);
        break;
      case EnumEvent.unDelete:
        ColorDA.list.push(obj);
        break;
      default:
        if (ColorDA.list.some((e) => e.GID == obj.GID)) {
          ColorDA.list[ColorDA.list.findIndex((e) => e.GID == obj.GID)] = obj;
          CateDA.convertData(CateDA.list);
          CateDA.updateUISkin(EnumCate.color, obj.GID);
        } else {
          ColorDA.list.push(obj);
          CateDA.convertData(CateDA.list);
        }
        let create_skin_popup = document.getElementById("create_skin_popup");
        if (window.getComputedStyle(create_skin_popup).display != "none") {
          create_skin_popup.style.display = "none";
          if (selected_list.length > 0) {
            editBackground({ ColorItem: obj });
            document.getElementById("popup_table_skin").remove();
            updateUIBackground();
          }
        }
        break;
    }
  }
});
socket.on("server-border", (data) => {
  console.log("server-border");
  let obj = data.data;
  if (data.pid == ProjectDA.obj.ID) {
    switch (data.enumEvent) {
      case EnumEvent.delete:
        BorderDA.list = BorderDA.list.filter((e) => e.GID != obj.GID);
        break;
      case EnumEvent.unDelete:
        BorderDA.list.push(obj);
        break;
      default:
        if (BorderDA.list.some((e) => e.GID == obj.GID)) {
          BorderDA.list[BorderDA.list.findIndex((e) => e.GID == obj.GID)] = obj;
          CateDA.updateUISkin(EnumCate.border, obj.GID);
        } else {
          BorderDA.list.push(obj);
          CateDA.convertData(CateDA.list);
        }
        let create_skin_popup = document.getElementById("create_skin_popup");
        if (window.getComputedStyle(create_skin_popup).display != "none") {
          create_skin_popup.style.display = "none";
          if (selected_list.length > 0) {
            editBorder(obj);
            document.getElementById("popup_table_skin").remove();
            updateUIBorder();
          }
        }
        break;
    }
  }
});
socket.on("server-effect", (data) => {
  console.log("server-effect");
  let obj = data.data;
  if (data.pid == ProjectDA.obj.ID) {
    switch (data.enumEvent) {
      case EnumEvent.delete:
        EffectDA.list = EffectDA.list.filter((e) => e.GID != obj.GID);
        break;
      case EnumEvent.unDelete:
        EffectDA.list.push(obj);
        break;
      default:
        if (EffectDA.list.some((e) => e.GID == obj.GID)) {
          EffectDA.list[EffectDA.list.findIndex((e) => e.GID == obj.GID)] = obj;
          CateDA.updateUISkin(EnumCate.effect, obj.GID);
        } else {
          EffectDA.list.push(obj);
          CateDA.convertData(CateDA.list);
        }
        let create_skin_popup = document.getElementById("create_skin_popup");
        if (window.getComputedStyle(create_skin_popup).display != "none") {
          create_skin_popup.style.display = "none";
          if (selected_list.length > 0) {
            editEffect(obj);
            document.getElementById("popup_table_skin").remove();
            updateUIEffect();
          }
        }
        break;
    }
  }
});
socket.on("server-typo", (data) => {
  console.log("server-typo");
  let obj = data.data;
  if (data.pid == ProjectDA.obj.ID) {
    switch (data.enumEvent) {
      case EnumEvent.delete:
        TypoDA.list = TypoDA.list.filter((e) => e.GID != obj.GID);
        break;
      case EnumEvent.unDelete:
        TypoDA.list.push(obj);
        break;
      default:
        if (TypoDA.list.some((e) => e.GID == obj.GID)) {
          TypoDA.list[TypoDA.list.findIndex((e) => e.GID == obj.GID)] = obj;
          CateDA.updateUISkin(EnumCate.typography, obj.GID);
        } else {
          TypoDA.list.push(obj);
          CateDA.convertData(CateDA.list);
        }
        let create_skin_popup = document.getElementById("create_skin_popup");
        if (window.getComputedStyle(create_skin_popup).display != "none") {
          create_skin_popup.style.display = "none";
          if (selected_list.length > 0) {
            editTextStyle(obj);
            document.getElementById("popup_table_skin").remove();
            updateUITextStyle();
          }
        }
        break;
    }
  }
});
socket.on("server-property", (data) => {
  var obj = data["data"];
  switch (data["enumEvent"]) {
    case EnumEvent.add:
      PropertyDA.list.push(obj);
      break;
    case EnumEvent.edit:
      PropertyDA.list[PropertyDA.list.findIndex((e) => e.id == obj.id)] = obj;
      break;
    case EnumEvent.delete:
      PropertyDA.list = PropertyDA.list.filter((e) => e.id != obj.id);
      break;
    case EnumEvent.unDelete:
      PropertyDA.list.push(obj);
      break;
  }
});
socket.on("server-page", (data) => {
  console.log("server-page");
  console.log(data);
  if (data.pid == ProjectDA.obj.ID) {
    switch (data.enumEvent) {
      case EnumEvent.delete:
        var obj = data.data;
        let deleteIndex = PageDA.list.findIndex((e) => e.ID == obj.ID) - 1;
        if (deleteIndex < 0) {
          deleteIndex = 0;
        }
        PageDA.list = PageDA.list.filter((e) => e.ID != obj.ID);
        if (PageDA.obj.ID == obj.ID) {
          PageDA.selectPage(PageDA.list[deleteIndex]);
        }
        break;
      case EnumEvent.unDelete:
        var obj = data["data"];
        PageDA.list.push(obj);
        break;
      case EnumEvent.sort:
        break;
      default:
        var obj = data.data;
        let editIndex = PageDA.list.findIndex((e) => e.ID == obj.ID);
        if (editIndex > 0) {
          PageDA.list[editIndex] = obj;
        } else {
          PageDA.list.push(obj);
          PageDA.selectPage(obj);
        }
        break;
    }
  }
});
socket.on("server-get", (data) => {
  console.log("server-get");
  console.log(data);
  switch (data.enumObj) {
    case EnumObj.apiOutput:
      OutputDA.list = data.data;
      break;
    case EnumObj.apiInput:
      InputDA.list = data.data;
      break;
    //! GET router .....................
    // case EnumObj.router:
    //     switch (data.enumEvent) {
    //         case EnumEvent.init:
    //             RouterDA.list = data.data;
    //             // update_popupSelectRouter();
    //             break;
    //     }
    //     break;
    case EnumObj.request:
      switch (data.enumEvent) {
        case EnumEvent.init:
          RequestDA.list = data.data;
          // update_ListApiDropdown();
          f12_update_selectWbase();
          $(".f12-container").css("display", "flex");
          break;
        case EnumEvent.getByID:
          switch ($($(".f12-container .tab.selected")).data("tab")) {
            case 1:
              RequestDA.selected = data.data;
              f12_update_listOutputRow();
              break;
            case 2:
              F12Container.api_input = data.data;
              f12_update_listInputRow();
              break;
            default:
              update_UI_dataView();
          }
          // if (F12View.tab_index == 1) {
          //     RequestDA.selected = data.data;
          //     update_F12OutputRow();
          //     update_SelectOutputDropdown(RequestDA.selected.outputApiItem);
          // } else if (F12View.tab_index == 2) {
          //     F12View.api_input = data.data;
          //     update_F12InputRow();
          // } else {
          //     F12View.api_br = data.data;
          //     update_F12BrRow();
          //     update_BrSelectOutputDropdown(F12View.api_br.outputApiItem);
          // }

          //TODO: Prototype router select popup
          // add_inputContainer(data.data);
          // add_outputContainer(data.data);
          break;
        default:
      }
      break;
    case EnumObj.cate:
      switch (data.enumEvent) {
        case EnumEvent.init:
          if (data.headers.pid == ProjectDA.obj.ID) {
            CateDA.convertData(data.data);
            updateUISelectionSkins();
            CateDA.needInit = false;
          } else {
            StyleDA.listCate = data.data;
            StyleDA.init();
          }
          break;
        default:
          break;
      }
      break;
    case EnumObj.page:
      if (PageDA.list.isNotEmpty) {
        PageDA.obj = data["data"];
        PageDA.list[PageDA.list.findIndex((element) => element.ID == PageDA.obj.ID)] = PageDA.obj;
        inviteMemberProject(EnumWg.context);
      }
      break;
    case EnumObj.wBase:
      switch (data.enumEvent) {
        case EnumEvent.get:
          let listAssets = data.data;
          listAssets = initDOM(listAssets);
          if (listAssets.length > 0) {
            assets_list = assets_list.filter((wb) => wb.PageID !== listAssets[0].PageID);
            assets_list.push(...listAssets);
            let listProjectID = listAssets.filterAndMap((e) => e.ProjectID);
            [...ProjectDA.assetsList, ProjectDA.obj].filter((pro) => listProjectID.some((id) => pro.ID == id)).forEach((projectItem) => updateListComponentByProject(projectItem));
          }
          break;
        default:
          break;
      }
      break;
    // !GET Style
    case EnumObj.style:
      switch (data.enumEvent) {
        case EnumEvent.init:
          StyleDA.convertInitData(data.data);
          linkSkinView(ProjectDA.list.find((e) => e.ID == data.headers.pid));
          StyleDA.skinProjectID = null;
          break;
        case EnumEvent.get:
          let listSkinProject = data.data;
          ProjectDA.assetsList = listSkinProject.map((skinProject) => {
            return {
              ID: skinProject.ID,
              Name: skinProject.Name,
            };
          });
          ColorDA.listAssets = listSkinProject.map((skinProject) => skinProject.ColorItems).reduce((a, b) => a.concat(b));
          TypoDA.listAssets = listSkinProject.map((skinProject) => skinProject.TextStyleItems).reduce((a, b) => a.concat(b));
          BorderDA.listAssets = listSkinProject.map((skinProject) => skinProject.BorderItems).reduce((a, b) => a.concat(b));
          EffectDA.listAssets = listSkinProject.map((skinProject) => skinProject.EffectItems).reduce((a, b) => a.concat(b));
          initUIAssetView();
          break;
        case EnumEvent.merge:
          StyleDA.mergeSkins = data.data;
          mergeSkinDialog();
          break;
        default:
          break;
      }
      break;
    // !GET project
    case EnumObj.project:
      //
      switch (data.enumEvent) {
        case EnumEvent.getProjectByID:
          ProjectDA.obj = data.data;
          if (ProjectDA.obj.ResponsiveJson) ProjectDA.obj.ResponsiveJson = JSON.parse(ProjectDA.obj.ResponsiveJson);
          ProjectDA.initLayoutResponsive();
          let projectTitle = document.getElementById("project_name");
          if (projectTitle) {
            projectTitle.innerHTML = ProjectDA.obj?.Name;
          }
          try {
            updateUIBreakpoint();
            customerList();
          } catch (error) {
            setTimeout(function () {
              updateUIBreakpoint();
              customerList();
            }, 250);
          }
          if (data.data.RouterJson) {
            RouterDA.list = JSON.parse(data.data.RouterJson);
          } else {
            RouterDA.list = [];
          }
          break;
        case EnumEvent.init:
          ProjectDA.list = data.data.sort((a, b) => b.DateUpdate - a.DateUpdate);
          TitleBarDA.initDataStorage();
          break;
        case EnumEvent.permission:
          try {
            for (let wpageItem of data.data.WPageItems) {
              if (wpageItem.Name == undefined) {
                wpageItem.Name = `Page ${i + 1}`;
              }
            }
            PageDA.list.push(...data.data.WPageItems);
            if (PageDA.list.length > 0) {
              PageDA.obj = Ultis.getStorage("opening-page");
              if (checkTypeof(PageDA.obj) === "string") PageDA.obj = JSON.parse(PageDA.obj);
              if (PageDA.obj == undefined || PageDA.obj.ProjectID != ProjectDA.obj.ID) {
                PageDA.obj = PageDA.list.find((e) => e.ID == ProjectDA.obj.PageDefaultID) ?? PageDA.list[0];
              }
              PageDA.obj.Permission = data.data.Permission;
              if (PageDA.obj?.scale == undefined) {
                PageDA.obj.scale = scale;
                PageDA.obj.topx = topx;
                PageDA.obj.leftx = leftx;
              }
              PageDA.checkEditPermission(PageDA.obj);
            }
            WiniIO.emitInit();
            permissionTool();
            initData();
            CollectionDA.getListDocument();
            InputDA.init();
            OutputDA.init();
          } catch (error) {
            toastr["error"]["Bạn không có quyền truy cập dự án này!"];
          }
          break;
        default:
          break;
      }
      //
      break;
    // !GET collection
    case EnumObj.collection:
      switch (data.enumEvent) {
        case EnumEvent.init:
          CollectionDA.list = data["data"];
          CollectionDA.documentList = CollectionDA.list.filter((e) => e.Type == ApiSelection.document);
          if (CollectionDA.documentList.length == 0) {
            let defaultFolder = {
              ID: 0,
              Name: "default folder",
              Type: ApiSelection.document,
            };
            CollectionDA.addDocument(defaultFolder);
          }
          break;
        default:
          break;
      }
      break;
    // !GET file
    case EnumObj.file:
      console.log("get file");
      switch (data.enumEvent) {
        case EnumEvent.init:
          FileDA.list = data.data;
          showImgDocument();
          selectFolder(CollectionDA.documentList[1]);
          break;
        default:
          break;
      }
      break;
    // !GET customer
    case EnumObj.customer:
      switch (data.enumEvent) {
        case EnumEvent.get:
          if (data.data) {
            // nếu đã tồn tại
            if (ProjectDA.obj.CustomerProjectItems.some((e) => e.CustomerID == data.data.ID)) {
              toastr["warning"]("Người dùng đã là thành viên của dự án!");
            } else {
              let customerInviteItem = {
                ID: 0,
                Permission: ProjectDA.permission,
                CustomerID: data.data.ID,
                CustomerName: data.data.Email,
                ProjectID: ProjectDA.obj.ID,
              };
              ProjectDA.addCustomerProject(customerInviteItem);
              $(".wpopup-background").remove();
            }
          } else {
            toastr["warning"]("Người dùng chưa đăng ký tài khoản Wini!");
          }
          break;
      }
    default:
      break;
  }
});
socket.on("server-google", (data) => {
  UserService.setToken(data["data"]["Token"], data["data"]["RefreshToken"]);
  UserDA.setToStore(data["data"]);
  moveProject({ ID: 0 });
});
socket.on("server-post", (data) => {
  console.log("server post");
  console.log(data);
  switch (data.enumObj) {
    case EnumObj.project:
      switch (data.enumEvent) {
        case EnumEvent.add:
          var pro = data.data;
          ProjectDA.list.push(pro);
          ProjectDA.obj = pro;
          // add project tab
          TitleBarDA.list.push(pro);
          Ultis.setStorage("project-tab-selected", pro.ID);
          Ultis.setStorage("list-project-tab", JSON.stringify(TitleBarDA.list));
          TitleBarDA.updateTitleBar();
          //
          window.location.href = "/View/project-design-view.html?id=" + pro.ID;
          break;
        default:
          if (TitleBarDA.list.some((e) => e.ID == data.data.ID)) {
            TitleBarDA.list.find((e) => e.ID == data.data.ID).Name = data.data.Name;
            Ultis.setStorage("list-project-tab", JSON.stringify(TitleBarDA.list));
            TitleBarDA.initDataStorage();
          }
          if (ProjectDA.obj.EditListID) {
            document.getElementById("dialog_link_component_skin").parentElement.remove();
            ProjectDA.obj.EditListID = null;
            $.get(WBaseDA.skin_url + `?pid=${ProjectDA.obj.ID}`).then((res) => {
              ColorDA.list = res.Data.ColorItems;
              TypoDA.list = res.Data.TextStyleItems;
              EffectDA.list = res.Data.EffectItems;
              BorderDA.list = res.Data.BorderItems;
              PropertyDA.list = res.Data.WPropertyItems;
              CateDA.initCate();
            });
            initUIAssetView(true);
          }
          break;
      }
      break;
    // !POST Style
    case EnumObj.style:
      switch (data.enumEvent) {
        case EnumEvent.copy:
          StyleDA.copySkinToProject(data.data);
          break;
        case EnumEvent.merge:
          // StyleDA.mergeSkinSuccess(data.data);
          break;
        default:
          break;
      }
      break;
    // !POST cate
    case EnumObj.cate:
      let newId = data.data;
      CateDA.list[CateDA.list.length - 1].ID = newId;
      let is_show_popup_create = window.getComputedStyle(document.getElementById("create_skin_popup")).display != "none";
      switch (CateDA.parentCateID) {
        case EnumCate.color:
          if (is_show_popup_create) {
            ColorDA.newColor.CateID = newId;
            ColorDA.add(ColorDA.newColor);
          } else {
            let colorItem = ColorDA.list.find((e) => e.CateID == -1);
            colorItem.CateID = newId;
            ColorDA.edit(colorItem);
          }
          break;
        case EnumCate.border:
          if (is_show_popup_create) {
            BorderDA.newBorder.CateID = newId;
            BorderDA.add(BorderDA.newBorder);
          } else {
            let borderItem = BorderDA.list.find((e) => e.CateID == -1);
            borderItem.CateID = newId;
            BorderDA.edit(borderItem);
          }
          break;
        case EnumCate.effect:
          if (is_show_popup_create) {
            EffectDA.newEffect.CateID = newId;
            EffectDA.add(EffectDA.newEffect);
          } else {
            let effectItem = EffectDA.list.find((e) => e.CateID == -1);
            effectItem.CateID = newId;
            EffectDA.edit(effectItem);
          }
          break;
        case EnumCate.typography:
          if (is_show_popup_create) {
            TypoDA.newTypo.CateID = newId;
            TypoDA.add(TypoDA.newTypo);
          } else {
            let typoItem = TypoDA.list.find((e) => e.CateID == -1);
            typoItem.CateID = newId;
            TypoDA.edit(typoItem);
          }
          break;
        default:
          break;
      }
      CateDA.convertData(CateDA.list);
      break;
    // !POST collection
    case EnumObj.collection:
      switch (data.enumEvent) {
        case EnumEvent.add:
          CollectionDA.documentList.push(data.data);
          let listFolder = document.getElementById("list_folder_container");
          if (listFolder) {
            let newFolderTile = createFolderTile(data.data);
            listFolder.appendChild(newFolderTile);
            selectFolder(data.data);
          }
          break;
        case EnumEvent.edit:
          break;
        case EnumEvent.delete:
          break;
        default:
          break;
      }
      break;
    // !POST customerProject
    case EnumObj.customerProject:
      switch (data.enumEvent) {
        case EnumEvent.add:
          ProjectDA.obj.CustomerProjectItems.push(data.data);
          toastr["success"]("Thêm thành viên vào dự án thành công");
          customerList();
          break;
        case EnumEvent.delete:
          // ProjectDA.objOneClick.ListCustomerProject = ProjectDA.objOneClick.ListCustomerProject.filter((e) => e.CustomerID != data.data);
          break;
      }
    default:
      break;
  }
});
// Nhận Wbase từ các máy khác
socket.on("server-main", async (data) => {
  console.log("server-main");
  console.log(data);
  if (data.pageid === PageDA.obj.ID) {
    let copyList = [];
    let initskin = false;
    let thisAction;
    if (data.token === UserService.getToken() || data.token === UserService.getRefreshToken()) {
      thisAction = action_list[data.index];
      if (thisAction.tmpHTML) {
        wbase_list = wbase_list.filter((e) => {
          let check = thisAction.tmpHTML.every((eHTML) => eHTML.id !== e.GID);
          if (!check) {
            copyList.push(e);
            if (e.ProjectID !== data.pid) initskin = true;
          }
          return check;
        });
      }
    }
    let importColor = [];
    let importTypo = [];
    let importBorder = [];
    let importEffect = [];
    let listData = initskin
      ? data.data.filter((e) => {
          if (e.GID !== wbase_parentID) {
            if (e.StyleItem?.DecorationItem?.ColorID) importColor.push(e.StyleItem.DecorationItem.ColorID);
            if (e.StyleItem?.DecorationItem?.BorderID) importBorder.push(e.StyleItem.DecorationItem.BorderID);
            if (e.StyleItem?.DecorationItem?.EffectID) importEffect.push(e.StyleItem.DecorationItem.EffectID);
            if (e.StyleItem?.TextStyleID) importTypo.push(e.StyleItem.TextStyleID);
            return true;
          }
          return false;
        })
      : data.data.filter((e) => e.GID !== wbase_parentID);
    listData = initDOM(listData);
    arrange(listData);
    if (data.enumEvent === EnumEvent.delete) {
      WbaseIO.delete(listData);
    } else {
      if (initskin) {
        ColorDA.list.push(...ColorDA.listAssets.filter((skin) => importColor.some((id) => skin.GID === id) && ColorDA.list.every((localSkin) => localSkin.GID !== id)));
        TypoDA.list.push(...TypoDA.listAssets.filter((skin) => importTypo.some((id) => skin.GID === id) && TypoDA.list.every((localSkin) => localSkin.GID !== id)));
        BorderDA.list.push(...BorderDA.listAssets.filter((skin) => importBorder.some((id) => skin.GID === id) && BorderDA.list.every((localSkin) => localSkin.GID !== id)));
        EffectDA.list.push(...EffectDA.listAssets.filter((skin) => importEffect.some((id) => skin.GID === id) && EffectDA.list.every((localSkin) => localSkin.GID !== id)));
        CateDA.initCate();
      }
      await WbaseIO.addOrUpdate(listData, data.enumEvent);
      if (thisAction?.tmpHTML) {
        thisAction.tmpHTML.forEach((e) => e.remove());
        thisAction.tmpHTML = null;
      }
      if (data.enumEvent === EnumEvent.copy && copyList.length > 0) {
        replaceAllLyerItemHTML();
        if (action_index === data.index) {
          clearActionListFrom(action_index - 1);
          addSelectList(listData.filter((e) => copyList.some((copyE) => copyE.Level === e.Level)));
          action_list[action_index].enumEvent = EnumEvent.add;
        } else {
          let oldData = [];
          if (!data.parentid) {
            oldData.push({
              GID: wbase_parentID,
              ListChildID: wbase_list.filter((e) => e.ParentID === wbase_parentID).map((e) => e.GID),
              Level: 0,
            });
          }
          action_list[data.index] = {
            oldData: oldData,
            selected: listData.filter((e) => copyList.some((copyE) => copyE.Level === e.Level)).map((wbaseItem) => JSON.parse(JSON.stringify(wbaseItem))),
            enumObj: EnumObj.wBase,
            enumEvent: EnumEvent.add,
          };
          oldData.push(...wbase_list.filter((wbaseItem) => wbaseItem.GID === data.parentid || action_list[data.index].selected.some((selectItem) => wbaseItem.ListID.includes(selectItem.GID))).map((wbaseItem) => JSON.parse(JSON.stringify(wbaseItem))));
        }
      }
    }
    // else {
    //   if (data.enumEvent === EnumEvent.delete) {
    //     WbaseIO.delete(listData);
    //   } else {
    //     await WbaseIO.addOrUpdate(listData, data.enumEvent);
    //   }
    //   replaceAllLyerItemHTML();
    //   wdraw();
    // }
  }
});
socket.on("server-mouse", (data) => {
  if (data.data.ID !== UserService.getUser().ID) {
    listRect = listRect.filter((e) => e.ID !== data.data.ID);
    listRect.push(data.data);
    wdraw();
  }
});
// socket.on("server-update", (data) => {
//   var listu = data;
//   WbaseIO.addOrUpdate({ data: listu });
// });

socket.on("server-refresh", (data) => {
  const href = window.location.href;
  if (data != null && data.data.Code == 200) {
    UserService.setToken(data.data.Data.Token, UserService.getRefreshToken());
  } else {
    if (!href.includes("login-success.html")) {
      window.location.href = "/View/login-tool-view.html";
    } else {
      window.location.href = "/View/login-web-success.html";
    }
    toastr["error"]("Phiên làm việc của bạn đã hết hạn, vui lòng đăng nhập lại!!!");
  }
});

class WiniIO {
  static emitMain(obj) {
    obj.userItem = UserService.getUser();
    obj.token = UserService.getToken();
    obj.pid = parseInt(obj.pid ?? ProjectDA.obj.ID);
    obj.pageid = obj.pageid ?? PageDA.obj.ID;
    arrange(obj.data);
    obj.data = obj.data.reverse();
    console.log(Date.now(), " : ", obj);
    obj.data = [
      ...obj.data.map((e) => {
        let dtItem = JSON.parse(JSON.stringify(e));
        dtItem.ListID = null;
        dtItem.Level = null;
        return dtItem;
      }),
    ];
    if (obj.pageid === PageDA.obj.ID && action_index >= 0 && action_index === action_list.length - 1) {
      action_list[action_index].enumObj = obj.enumObj;
      action_list[action_index].enumEvent = obj.enumEvent;
    }
    if (obj.data.some((wbaseItem) => wbaseItem.JsonItem || wbaseItem.JsonEventItem || wbaseItem.TableRows || wbaseItem.TreeData)) {
      for (let wbaseItem of obj.data) {
        if (wbaseItem.JsonItem) {
          wbaseItem.AttributesItem.Json = JSON.stringify(wbaseItem.JsonItem);
        }
        if (wbaseItem.JsonEventItem) {
          wbaseItem.AttributesItem.JsonEvent = JSON.stringify(wbaseItem.JsonEventItem);
        }
        if (wbaseItem.TableRows) {
          wbaseItem.AttributesItem.Content = JSON.stringify(wbaseItem.TableRows);
        } else if (wbaseItem.TreeData) {
          wbaseItem.AttributesItem.Content = JSON.stringify(wbaseItem.TreeData);
        } else if (wbaseItem.ChartData) {
          wbaseItem.AttributesItem.Content = JSON.stringify(wbaseItem.ChartData);
        } else if (wbaseItem.CarouselData) {
          wbaseItem.AttributesItem.Content = JSON.stringify(wbaseItem.CarouselData);
        }
      }
    }
    if (obj.enumEvent < 0) {
      let updateList = obj.data.filter((e) => !e.IsDeleted);
      let deleteList = obj.data.filter((e) => e.IsDeleted);
      obj.enumEvent = EnumEvent.edit;
      obj.data = updateList;
      socket.emit("client-main", obj);
      if (deleteList.length > 0) {
        obj.enumEvent = EnumEvent.delete;
        obj.enumObj = EnumObj.wBase;
        obj.data = deleteList;
        socket.emit("client-main", obj);
      }
      return;
    }
    socket.emit("client-main", obj);
  }

  static emitProperty(item, enumEvent) {
    var jsonData = item;
    socket.emit("client-property", {
      headers: UserService.headerProject(),
      data: jsonData,
      pid: PageDA.obj.ProjectID,
      enumEvent: enumEvent,
    });
  }

  static emitColor(color, enumEvent) {
    console.log("emit-color");
    let jsonData = color;
    console.log(jsonData);
    socket.emit("client-color", {
      headers: UserService.headerProject(),
      data: jsonData,
      enumEvent: enumEvent,
      pid: PageDA.obj.ProjectID,
      pageid: PageDA.obj.ID,
      enumObj: EnumObj.color,
    });
  }

  static emitTypo(typo, enumEvent) {
    var jsonData = typo;
    socket.emit("client-typo", {
      headers: UserService.headerProject(),
      data: jsonData,
      enumEvent: enumEvent,
      pid: PageDA.obj.ProjectID,
      pageid: PageDA.obj.ID,
      enumObj: EnumObj.textStyle,
    });
  }

  static emitEffect(effect, enumEvent) {
    var jsonData = effect;
    socket.emit("client-effect", {
      headers: UserService.headerProject(),
      data: jsonData,
      enumEvent: enumEvent,
      pid: PageDA.obj.ProjectID,
      pageid: PageDA.obj.ID,
      enumObj: EnumObj.effect,
    });
  }

  static emitBorder(borderItem, enumEvent) {
    var jsonData = borderItem;
    socket.emit("client-border", {
      headers: UserService.headerProject(),
      data: jsonData,
      enumEvent: enumEvent,
      pid: PageDA.obj.ProjectID,
      pageid: PageDA.obj.ID,
      enumObj: EnumObj.border,
    });
  }

  static emitInit() {
    socket.emit("client-init", {
      pid: ProjectDA.obj.ID,
      headers: UserService.headerProject(),
    });
  }

  static emitPage(listPage, enumEvent) {
    console.log("client-page");
    let jsonData;
    if (enumEvent != EnumEvent.sort) {
      jsonData = listPage[0];
    } else {
      jsonData = listPage;
    }
    socket.emit("client-page", {
      pid: ProjectDA.obj.ID,
      data: jsonData,
      enumEvent: enumEvent,
      headers: UserService.headerProject(),
    });
  }

  static kc = { xMouse: 0, yMouse: 0 };
  static emitMouse(mouseItem) {
    if ((!this.kc.w && mouseItem.w !== undefined) || Math.sqrt(Math.pow(this.kc.xMouse - mouseItem.xMouse, 2) + Math.pow(this.kc.yMouse - mouseItem.yMouse, 2)) >= 20 / scale) {
      let mouseData = JSON.parse(JSON.stringify(mouseItem));
      this.kc = mouseData;
      mouseData.ID = UserService.getUser().ID;
      if (PageDA.obj?.ProjectID) {
        socket.emit("client-mouse", {
          headers: UserService.headerProject(),
          pid: PageDA.obj.ProjectID,
          data: mouseData,
        });
      }
    }
  }

  static emitGet(json, url, enumObj, enumEvent) {
    var header = UserService.headerProject();
    socket.emit("client-get", {
      headers: header,
      body: json,
      url: url,
      data: [],
      enumObj: enumObj,
      enumEvent: enumEvent,
      userId: UserService.getUser().ID,
    });
  }

  static emitPort(json, url, enumObj, enumEvent) {
    socket.emit("client-post", {
      headers: UserService.headerProject(),
      body: json,
      url: url,
      data: [],
      enumEvent: enumEvent,
      enumObj: enumObj,
      userId: UserService.getUser().ID,
    });
  }

  static emitFile(listFile, collectionId) {
    let result = BaseDA.uploadFile(
      listFile,
      // "http://10.15.138.23:4000/uploadfile",
      socketWiniFile + "/uploadfile",
      collectionId,
    );
    return result;
  }

  static emitRefreshToken() {
    socket.emit("client-refresh", { headers: UserService.headerRefreshSocket(), data: [] });
  }
}
class WbaseIO {
  static delete(list) {
    if (list.some((e) => e.GID == hover_wbase?.GID)) {
      updateHoverWbase();
    }
    selected_list = selected_list.filter((e) => list.every((deleteItem) => deleteItem.GID !== e.GID));
    updateUISelectBox();
    updateUIDesignView();
    let reBuildParent = false;
    if (list[0].ParentID !== wbase_parentID) {
      let parentWbase = wbase_list.find((wbaseItem) => wbaseItem.GID === list[0].ParentID);
      if (parentWbase) {
        parentWbase.ListChildID = parentWbase.ListChildID.filter((id) => list.every((deleteItem) => deleteItem.GID != id));
        parentWbase.CountChild = parentWbase.ListChildID.length;
        let oldParentHTML = parentWbase.value;
        if (parentWbase.CountChild === 0 && parentWbase.WAutolayoutItem && (oldParentHTML.style.width == "fit-content" || oldParentHTML.style.height == "fit-content")) {
          if (oldParentHTML.style.width == "fit-content") {
            oldParentHTML.style.width = oldParentHTML.offsetWidth + "px";
            parentWbase.StyleItem.FrameItem.Width = oldParentHTML.offsetWidth;
          }
          if (oldParentHTML.style.height == "fit-content") {
            oldParentHTML.style.height = oldParentHTML.offsetHeight + "px";
            parentWbase.StyleItem.FrameItem.Height = oldParentHTML.offsetHeight;
          }
        }
        if (parentWbase.CateID === EnumCate.table) {
          parentWbase.TableRows.reduce((a, b) => a.concat(b))
            .filter((cell) => list.some((deleteItem) => cell.contentid.includes(deleteItem.GID)))
            .forEach((cell) => {
              let newListContentID = cell.contentid.split(",").filter((id) => list.every((deleteItem) => deleteItem.GID !== id));
              cell.contentid = newListContentID.join(",");
            });
        }
      }
    }
    for (let wbaseItem of list) {
      if (wbaseItem.CateID == EnumCate.tool_variant) {
        PropertyDA.list = PropertyDA.list.filter((e) => e.BaseID != wbaseItem.GID);
      }
      if (wbaseItem.BasePropertyItems && wbaseItem.BasePropertyItems.length > 0) {
        for (let baseProperty of wbaseItem.BasePropertyItems) {
          let propertyItem = PropertyDA.list.find((e) => e.GID == baseProperty.PropertyID);
          propertyItem.BasePropertyItems = propertyItem.BasePropertyItems.filter((e) => e.GID != baseProperty.GID);
        }
      }
      let eHTML = document.getElementById(wbaseItem.GID);
      let layerHTML = document.getElementById(`wbaseID:${wbaseItem.GID}`);
      try {
        if ($(eHTML).parents(".w-tree")) reBuildParent = $(eHTML).parents(".w-tree");
        eHTML.remove();
        layerHTML?.parentElement?.remove();
      } catch (error) {
        console.log(error);
      }
    }
    wbase_list = wbase_list.filter((e) => !list.some((delete_item) => delete_item.GID == e.GID || e.ListID.includes(delete_item.GID)));
    arrange();
    if (reBuildParent.length) {
      switch (parseInt(reBuildParent[0].getAttribute("cateid"))) {
        case EnumCate.tree:
          reBuildParent = reBuildParent[0];
          createTree(
            wbase_list.find((e) => e.GID === reBuildParent.id),
            wbase_list.filter((e) => e.ParentID === reBuildParent.id),
          );
          break;
        default:
          break;
      }
    }
  }

  static async addOrUpdate(list, enumEvent) {
    let relativeList = [];
    if (enumEvent === EnumEvent.parent) {
      relativeList = wbase_list.filter((wbaseItem) => list.some((editItem) => wbaseItem.ListID.includes(editItem.GID) || wbaseItem.ListChildID.includes(editItem.GID)));
    }
    wbase_list = wbase_list.filter((e) => list.every((element) => e.GID !== element.GID));
    wbase_list.push(...list);
    if (relativeList.length > 0) {
      for (let item of relativeList) {
        if (list.some((editItem) => item.ListID.includes(editItem.GID))) {
          if (item.ParentID === wbase_parentID) {
            item.ListID = wbase_parentID;
          } else {
            item.ListID = wbase_list.find((e) => e.GID === item.ParentID).ListID + "," + item.ParentID;
          }
          item.Level = item.ListID.split(",").length;
        } else {
          let children = wbase_list.filter((e) => e.ParentID === item.GID);
          children.sort((a, b) => a.Sort - b.Sort);
          item.ListChildID = children.map((e) => e.GID);
          item.CountChild = children.length;
        }
      }
    }
    arrange();
    let parentList = [];
    for (let item of list) {
      item.value = null;
      if (item.BasePropertyItems && item.BasePropertyItems.length > 0) {
        for (let baseProperty of item.BasePropertyItems) {
          if (baseProperty.BaseID == undefined) {
            baseProperty.BaseID = item.GID;
          }
          let property = PropertyDA.list.find((e) => baseProperty.PropertyID == e.GID);
          if (property && property.BasePropertyItems.every((e) => e.GID != baseProperty.GID)) {
            property.listBaseProperty.push(e);
          } else {
            if (PropertyDA.list.some((e) => e.GID != baseProperty.PropertyID)) {
              PropertyDA.list.push({
                GID: baseProperty.PropertyID,
                Name: `Property ${PropertyDA.list.filter((property) => property.BaseID == item.ParentID).length + 1}`,
                BaseID: item.ParentID,
                BasePropertyItems: [baseProperty],
              });
            }
          }
        }
      }
      if (item.ParentID === wbase_parentID) {
        let currentItemHTML = document.getElementById(item.GID);
        await initComponents(
          item,
          wbase_list.filter((e) => e.ParentID === item.GID),
          false,
        );
        if (currentItemHTML) currentItemHTML.replaceWith(item.value);
        item.value.id = item.GID;
        initPositionStyle(item);
        divSection.appendChild(item.value);
      } else {
        document.getElementById(item.GID)?.remove();
        await initComponents(
          item,
          wbase_list.filter((e) => e.ParentID === item.GID),
        );
        parentList.push(item.ParentID);
      }
    }
    parentList = parentList.filterAndMap();
    parentList = [...relativeList, ...wbase_list.filter((e) => parentList.some((id) => e.GID === id))];
    for (let wb of parentList) {
      await initComponents(
        wb,
        wbase_list.filter((el) => el.ParentID === wb.GID),
        false,
      );
      if (wb.ParentID === wbase_parentID) {
        let currentValue = document.getElementById(wb.GID);
        initPositionStyle(wb);
        if (currentValue && $(currentValue).parents(".wbaseItem-value").length === 0) {
          currentValue.replaceWith(wb.value);
        } else {
          currentValue?.remove();
          divSection.appendChild(wb.value);
        }
      } else {
        let currentE = document.getElementById(wb.GID);
        if (currentE) {
          currentE?.replaceWith(wb.value);
        } else {
          let parentHTML = document.getElementById(wb.ParentID);
          if (parentHTML) {
            switch (parseInt(parentHTML.getAttribute("cateid"))) {
              case EnumCate.tree:
                createTree(
                  wbase_list.find((e) => e.GID === wb.ParentID),
                  wbase_list.filter((e) => e.ParentID === wb.ParentID),
                );
                break;
              case EnumCate.table:
                createTable(
                  wbase_list.find((e) => e.GID === wb.ParentID),
                  wbase_list.filter((e) => e.ParentID === wb.ParentID),
                );
                break;
              default:
                if (!window.getComputedStyle(parentHTML).display.match(/(flex|grid)/g)) {
                  initPositionStyle(wb);
                }
                parentHTML.appendChild(wb.value);
                break;
            }
          }
        }
      }
      wb.value.id = wb.GID;
    }
    if (list.some((e) => e.GID === hover_wbase?.GID)) {
      updateHoverWbase();
    }
    selected_list = selected_list.filter((e) => list.every((editItem) => editItem.GID !== e.GID));
    updateUISelectBox();
  }
}
