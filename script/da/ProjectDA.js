class ProjectDA {
  static selected;
  static obj_click;
  static list = [];
  static urlCtr = "Project/";
  static showing_list = [];
  static obj = { ID: 0 };
  static permission = 2;

  static isShowPopup = false;
  static openingList = [];
  static assetsList = [];
  static objOneClick = { ID: 0 };
  static objInvite = {};
  static importLib = false;
  static responsiveJson = {
    Column: 24,
    BreakPoint: [
      // {
      //     Key: "X-small (xs)",
      //     Width: 480
      // },
      {
        Key: "Small (sm)",
        Width: 576,
      },
      {
        Key: "Medium (md)",
        Width: 768,
      },
      {
        Key: "Large (lg)",
        Width: 992,
      },
      {
        Key: "X-large (xl)",
        Width: 1200,
      },
      {
        Key: "XX-large (xxl)",
        Width: 1600,
      },
    ],
  };

  static initLayoutResponsive() {
    fetch("https://cdn.jsdelivr.net/gh/WiniGit/goline@fc5ed59/css/css_Responsive.txt").then((response) =>
      response.text().then((text) => {
        let colCss = text.replace(/(\.w-grid ){0,1}\.{1}col[0-9]{1,2}/g, (mtc) => `.min-brp ${mtc}`);
        colCss += text.substring(text.indexOf(`/* .w-grid */`)).replace(/(\.w-grid ){1}\.{1}col[0-9]{1,2}/g, (mtc) => `.min-brp${mtc}`);
        let localResponsive = ProjectDA.obj.ResponsiveJson ?? ProjectDA.responsiveJson;
        for (let brp of localResponsive.BreakPoint) {
          let thisCss = text;
          let shortName = brp.Key.match(brpRegex).pop().replace(/[()]/g, "");
          colCss += thisCss.replace(/(\.w-grid ){0,1}\.{1}col[0-9]{1,2}/g, (mtc) => `.${shortName} ${mtc}-${shortName}`);
          colCss += thisCss.substring(text.indexOf(`/* .w-grid */`)).replace(/(\.w-grid ){1}\.{1}col[0-9]{1,2}/g, (mtc) => `.${shortName}${mtc}-${shortName}`);
        }
        document.getElementById("class-res").innerHTML = colCss;
      }),
    );
  }

  static init() {
    if (this.obj.ID != 0) {
      var url = this.urlCtr + "ListAll";
      WiniIO.emitGet(null, url, EnumObj.project, EnumEvent.init);
    } else {
      var url = ProjectDA.urlCtr + "ListAll";
      emitGet(null, url, EnumObj.project, EnumEvent.init);
    }
  }

  static checkDomain(domain) {
    let url = ProjectDA.urlCtr + `CheckDomain?domain=${domain}`;
    emitGet(null, url, EnumObj.project, EnumEvent.check);
  }

  static add(obj) {
    let url = ProjectDA.urlCtr + "Add";
    if (ProjectDA.obj.ID != 0) {
      WiniIO.emitPort(obj, url, EnumObj.project, EnumEvent.add);
    } else {
      emitPort(obj, url, EnumObj.project, EnumEvent.add);
    }
  }

  static edit(obj) {
    var url = ProjectDA.urlCtr + "Edit";
    if (ProjectDA.obj.ID != 0) {
      if (obj.ResponsiveJson) {
        obj = JSON.parse(JSON.stringify(obj));
        obj.ResponsiveJson = JSON.stringify(obj.ResponsiveJson);
      }
      WiniIO.emitPort(obj, url, EnumObj.project, EnumEvent.edit);
    } else if (socketH?.connected) {
      emitPort(obj, url, EnumObj.project, EnumEvent.edit);
    }
  }
  static editRouter(obj) {
    var url = ProjectDA.urlCtr + "Edit";
    if (ProjectDA.obj.ID != 0) {
      if (obj.ResponsiveJson) {
        obj = JSON.parse(JSON.stringify(obj));
        obj.ResponsiveJson = JSON.stringify(obj.ResponsiveJson);
      }
      WiniIO.emitPort(obj, url, EnumObj.project, EnumEvent.editRouter);
    } else if (socketH?.connected) {
      emitPort(obj, url, EnumObj.project, EnumEvent.editRouter);
    }
  }

  static deleted(obj) {
    let url = ProjectDA.urlCtr + "Delete";
    emitPort(obj, url, EnumObj.project, EnumEvent.delete);
  }

  static joinbycode(obj) {
    let url = ProjectDA.urlCtr + "joinbycode";
    emitPort(obj, url, EnumObj.project, EnumEvent.joinbycode);
  }

  static editcode(obj) {
    let url = ProjectDA.urlCtr + "EditCode";
    emitPort(obj, url, EnumObj.project, EnumEvent.editcode);
  }

  static addCustomerProject(obj) {
    var url = "UrPermission/AddCustomerProject";
    if (ProjectDA.obj.ID != 0) {
      WiniIO.emitPort(obj, url, EnumObj.customerProject, EnumEvent.add);
    } else {
      emitPort(obj, url, EnumObj.customerProject, EnumEvent.add);
    }
  }

  static editCustomerProject(obj) {
    let url = "UrPermission/EditCustomerProject";
    if (ProjectDA.obj.ID != 0) {
      WiniIO.emitPort(obj, url, EnumObj.customerProject, EnumEvent.edit);
    } else {
      emitPort(obj, url, EnumObj.customerProject, EnumEvent.edit);
    }
  }

  static deleteCustomerProject(obj) {
    let url = "UrPermission/DeleteCustomerProject?id=" + obj;
    if (ProjectDA.obj.ID != 0) {
      WiniIO.emitPort(null, url, EnumObj.customerProject, EnumEvent.delete);
    } else {
      emitPort(null, url, EnumObj.customerProject, EnumEvent.delete);
    }
  }

  static getByIDApi() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const pid = urlParams.get("pid");
    var url = ProjectDA.urlCtr + "GetByIDApi?pid=" + pid;
    emitGet(null, url, EnumObj.project, EnumEvent.getProjectByIDapi);
  }

  static getByID(id) {
    let pid;
    if (id == null) {
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      pid = urlParams.get("id");
    } else {
      pid = id;
    }
    let url = ProjectDA.urlCtr + "GetByID?pid=" + pid;
    if (ProjectDA.obj.ID == 0) {
      emitGet(null, url, EnumObj.project, EnumEvent.getProjectByID);
    } else {
      WiniIO.emitGet(null, url, EnumObj.project, EnumEvent.getProjectByID);
    }
  }

  static getProjectInfor() {
    let url = ProjectDA.urlCtr + "GetByID";
    WiniIO.emitGet(null, url, EnumObj.project, EnumEvent.getProjectByID);
  }

  static getPermission() {
    let url = ProjectDA.urlCtr + "GetPermissionItem";
    WiniIO.emitGet(null, url, EnumObj.project, EnumEvent.permission);
  }

  static create_UI_Project(item) {
    let pro = "";

    if (HomeDA.sort_project == 1) {
      pro = '<div class="disable-text-select project-card-container ' + `${ProjectDA.selected?.ID == item.ID ? "selected" : ""}` + '">' + '    <div class="project-card col elevation7"  data-id="' + item.ID + '">' + '        <div class="design-preview background-grey3"></div>' + '        <div class="project-info row background-white">' + '            <img src="https://cdn.jsdelivr.net/gh/WiniGit/goline@fc5ed59/lib/assets/pen.svg" class="box32">' + '                <div class="col">' + '                    <input class="button-text-5 text-title" type="text" value="' + item.Name + '" disabled>' + '                        <span class="regular11 text-subtitle">Editor ' + Ultis.getTimeEdit(item.DateUpdate) + " ago</span>" + "                </div>" + "        </div>" + "    </div>" + "</div>";
    } else {
      pro = '<div class="disable-text-select project-tile elevation4 row ' + `${ProjectDA.selected?.ID == item.ID ? "selected" : ""}` + '" data-id="' + item.ID + '">' + '    <div class="block1 row">' + '        <button class="button-transparent box32"><i class="fa-regular fa-star"></i></button>' + '        <input type="text" class="button-text-5 text-title" value="' + item.Name + '" disabled>' + "    </div>" + '    <div class="block2">' + '        <span class="regular11 text-subtitle">Editor ' + Ultis.getTimeEdit(item.DateUpdate) + " ago</span>" + "    </div>" + '    <div class="block3 row">' + '        <div class="box12 circular background-grey3"></div>' + '        <div class="box12 circular background-grey3"></div>' + "    </div>" + "</div>";
    }
    return pro;
  }

  static set_selected(this_item) {
    this.getByID($(this_item).data("id"));
    $(".project-card-container .project-card").removeClass("selected");
    $(".project-tile").removeClass("selected");
    $(this_item).addClass("selected");
    ProjectDA.selected = ProjectDA.list.find((e) => e.ID == $(this_item).data("id"));
    update_UI_InfoView(ProjectDA.selected, "project");
  }

  static projectUIByPermission() {}

  static update_titlebar(id) {
    if (!TitleBarDA.list.some((e) => e.ID == id)) {
      TitleBarDA.list.push(ProjectDA.list.find((e) => e.ID == id));
    }
    Ultis.setStorage("list-project-tab", JSON.stringify(TitleBarDA.list));
    Ultis.setStorage("project-tab-selected", id);
    TitleBarDA.updateTitleBar();
    TitleBarDA.setActive(id);
  }

  static changeProject(projectId) {
    ProjectDA.update_titlebar(projectId);
    if (copy_item?.length) {
      Ultis.setStorage(
        "copy-item",
        JSON.stringify({
          time: Date.now(),
          list: copy_item,
        }),
      );
    }
    window.location.href = "/View/project-design-view.html?id=" + projectId;
  }
}
