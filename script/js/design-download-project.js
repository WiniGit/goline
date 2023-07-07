function get_listItemInside(pageID) {
  let list = wbase_list.filter((a) => a.ListID.includes(pageID) || a.GID === pageID);
  return list;
}

function get_data_outputFromJson(json, outputID, index) {
  let output = jsonOutput.Data.find((e) => e.GID == outputID);

  if (output.ParentID != null) {
    let parent = jsonOutput.Data.find((e) => e.GID == output.ParentID);
    // parent is list
    if (parent.DataType == 2) {
      if (output.DataType == 1) {
        // output is field
        output.Value = parent.Value[index][output.Name];
      } else {
        output.Value = parent.Value[index];
      }
    }
    // parent is obj
    else if (parent.DataType == 3) {
      output.Value = parent.Value[output.Name];
    }
    // parent is field
    else {
      // ! Error
    }
  } else {
    // if (output.Name == "Code") {
    //     debugger
    // }
    if (Array.isArray(json)) {
      output.Value = json;
    } else if (typeof json == "object") {
      output.Value = json[output.Name];
    } else {
      output.Value = json;
    }
  }
  return output.Value;
}

async function push_dataProject() {
  var page_script = "";
  // document.body.getAttribute;

  var list_page = wbase_list.filter((e) => e.ParentID === wbase_parentID && EnumCate.extend_frame.some((ct) => ct === e.CateID));
  list_page = list_page.map((wb) => {
    let cloneValue = wb.value.cloneNode(true);
    cloneValue.style.position = null;
    cloneValue.style.top = null;
    cloneValue.style.left = null;
    let cssString = "";
    [cloneValue, ...cloneValue.querySelectorAll(".wbaseItem-value")].forEach((wbValue) => {
      wbValue.removeAttribute("listid");
      wbValue.removeAttribute("lock");
      wbValue.removeAttribute("iswini");
      switch (parseInt(wbValue.getAttribute("cateid"))) {
        case EnumCate.chart:
          buildChart(wbValue);
          break;
        case EnumCate.tool_text:
          wbValue.removeAttribute("contenteditable");
          break;
        case EnumCate.textformfield:
          if(wbValue.querySelector(".wbaseItem-value:has(> .textfield) > label")) {
            let wbItem = wbase_list.find(e => e.GID === wbValue.id);
            if(wbItem) wbValue.setAttribute("placeholder", wbItem.JsonItem.HintText);
          }
          break;
        case EnumCate.textfield:
          wbValue.style.pointerEvents = null;
          break;
        case EnumCate.tree:
          wbValue.querySelectorAll(".w-tree").forEach((wtree) => (wtree.style.pointerEvents = null));
          break;
        default:
          break;
      }
      if (wbValue !== cloneValue) {
        cssString += `
        /*  */
        `;
      }
      let wbCss = `.wbaseItem-value[id="${wbValue.id}"] {`;
      for (let i = 0; i < wbValue.style.length; i++) {
        wbCss += `
        ${wbValue.style[i]}: ${wbValue.style[i].startsWith("--") ? wbValue.style.getPropertyValue(wbValue.style[i]) : wbValue.style[wbValue.style[i]]};
        `
      }
      wbCss += `
    }`;
      cssString += wbCss;
      wbValue.removeAttribute("style");
    });
    cloneValue.cssString = cssString;
    $(cloneValue).addClass("w-page");
    cloneValue.Name = Ultis.toSlug(wb.Name);
    return cloneValue;
  });

  for (let page of list_page) {
    page_script = "";
    var list_itemShow = get_listItemInside(page.id);
    for (let witem of list_itemShow) {
      if (witem.JsonEventItem) {
        let router_item = witem.JsonEventItem.find((e) => e.Name == "Router");
        if (router_item) {
          let clickElement = page;
          if (page.id !== witem.GID) clickElement = page.querySelector(`.wbaseItem-value[id="${witem.GID}"]`);

          $(clickElement).addClass("event-click");
          let new_url = '';
          // if (isDemo == true) {
          //   let new_router = RouterDA.list.find((e) => e.Id == router_item.RouterID);
          //   if (new_router != null) {
          //     new_url = `https://demo.wini.vn/${ProjectDA.obj.Code}/Views/${Ultis.toSlug(new_router.PageName)}.html`
          //   } else {
          //     new_url = ``;
          //   }
          // } else {
          new_url = `/${RouterDA.list.find((e) => e.Id == router_item.RouterID)?.Route ?? ""}`;
          // }
          if (new_url.length > 0) {
            page_script += "<script>" + '    document.getElementById("' + witem.GID + '").onclick = function (ev) {' + '        location.href = "' + new_url + '"' + "    }" + "</script>";
          }
        }
      }

      if (witem.PrototypeID != null) {
        let nextPagePrototype = list_page.find((e) => e.id == witem.PrototypeID);
        if (nextPagePrototype) {
          // let animation = witem.JsonEventItem?.find((e) => e.Name === "Animation");
          // let animation_class = "";
          // if (animation != null) {
          //   animation_class += " animation_move";
          //   console.log(animation);
          //   switch (animation.Data.Animation) {
          //     case EnumAnimation.MoveIn:
          //       animation_class += " in";
          //       break;
          //     case EnumAnimation.MoveOut:
          //       animation_class += " out";
          //       break;
          //     case EnumAnimation.SlideIn:
          //       animation_class += " in";
          //       break;
          //     case EnumAnimation.SlideOut:
          //       animation_class += " out";
          //       break;
          //     default:
          //       animation_class += " in";
          //       break;
          //   }
          //   switch (animation.Data.Direction) {
          //     case "left":
          //       animation_class += " left";
          //       break;
          //     case "right":
          //       animation_class += " right";
          //       break;
          //     case "up":
          //       animation_class += " up";
          //       break;
          //     case "down":
          //       animation_class += " down";
          //       break;
          //     default:
          //       animation_class += " left";
          //       break;
          //   }
          // }
          // $(nextPagePrototype).addClass(animation_class); //TODO: animation
          let clickElement = page;
          if (page.id !== witem.GID) clickElement = page.querySelector(`.wbaseItem-value[id="${witem.GID}"]`);

          $(clickElement).addClass("event-click");
          let new_url = '';
          new_url = `/${Ultis.toSlug(nextPagePrototype.Name)}`;
          // }
          if (new_url.length > 0) {
            page_script += "<script>" + '    document.getElementById("' + witem.GID + '").onclick = function (ev) {' + '        location.href = "' + new_url + '"' + "    }" + "</script>";
          }
        }
      }

    }
    console.log(page.cssString);

    await $.post(
      "/view/build",
      {
        Sort: list_page.indexOf(page),
        Name: page.Name,
        Type: 1,
        Code: ProjectDA.obj.Code.toLowerCase(),
        Item: `<link rel="stylesheet" href="/Styles/${page.Name}.css" />${page.outerHTML + page_script}`.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"),
      },
      function (data) {
        console.log("data-start: ", data);
      },
    );

    await $.post(
      "/view/build",
      {
        Sort: list_page.indexOf(page),
        Name: page.Name,
        Type: 0,
        Code: ProjectDA.obj.Code.toLowerCase(),
        Item: page.cssString,
      },
      function (data) {
        console.log("data-start: ", data);
      },
    );
  }
  // await $.get(
  //   `https://server.wini.vn/buildend?name=${Ultis.toSlug(ProjectDA.obj.Name)}&code=${ProjectDA.obj.Code.toLowerCase()}&router=${JSON.stringify(router)}`,
  //   function (data) {
  //     console.log("data-end", data);
  //     action();
  //   },
  // );
}

$("body").on("click", '.download-project:not(".downloading")', async function () {
  $(".download-project").addClass("downloading");
  $(".download-project span").html('Download... <i class="fa-solid fa-download fa-sm"></i>');

  $(".download-project i").toggleClass("fa-spinner fa-download");
  $(".download-project i").addClass("fa-spin");

  let list_page = wbase_list.filter((e) => e.ParentID === wbase_parentID && EnumCate.extend_frame.some((ct) => ct === e.CateID));

  try {
    await push_dataProject();

    var router;
    if (ProjectDA.obj.RouterJson != null) {
      router = JSON.parse(ProjectDA.obj.RouterJson);
    } else {
      router = [{ Id: 0, Name: "", Route: "", Sort: 0, PageName: Ultis.toSlug(list_page[list_page.length - 1].Name) }];
    }
    await $.post(
      "/view/download",
      {
        Code: ProjectDA.obj.Code.toLowerCase(),
        Item: JSON.stringify(router),
      },
      function (data) {
        console.log("build-end: ", data);
        window.open(downloadUrl + `/${ProjectDA.obj.Code.toLowerCase()}.zip`);
      },
    );

    $(".download-project").removeClass("downloading");
    $(".download-project>span").html('Download <i class="fa-solid fa-download fa-sm"></i>');

    $(".download-project>i").toggleClass("fa-spinner fa-download");
    $(".download-project>i").removeClass("fa-spin");

    toastr["success"]("Download successful!");
  } catch (error) {
    toastr["error"](`${error}`);
    $(".download-project").removeClass("downloading");
    $(".download-project>span").html('Download <i class="fa-solid fa-download fa-sm"></i>');

    $(".download-project>i").toggleClass("fa-spinner fa-download");
    $(".download-project>i").removeClass("fa-spin");
  }
});

try {
  const ipcRenderer = require("electron").ipcRenderer;
  $("body").on("click", ".btn-play", async function () {
    $('.btn-play').html(`<i class="fa-solid fa-spinner fa-spin text-white"></i>`);

    let list_page = wbase_list.filter((e) => e.ParentID === wbase_parentID && EnumCate.extend_frame.some((ct) => ct === e.CateID));
    await push_dataProject();

    var router;
    if (selected_list.length == 1 && list_page.some(e => e.ID == selected_list[0].ID)) {
      router = [{ Id: 0, Name: "", Route: "", Sort: 0, PageName: Ultis.toSlug(selected_list[0].Name) }];
    }
    else {
      if (ProjectDA.obj.RouterJson != null) {
        router = JSON.parse(ProjectDA.obj.RouterJson);
      } else {
        router = [{ Id: 0, Name: "", Route: "", Sort: 0, PageName: Ultis.toSlug(list_page[list_page.length - 1].Name) }];
      }
    }

    await $.post(
      "/view/download",
      {
        Code: ProjectDA.obj.Code.toLowerCase(),
        Item: JSON.stringify(router),
      },
      function (data) {
        console.log("build-end: ", data);
        // window.open(`https://wini.vn`);
        // ${ProjectDA.obj.Code}/Views/${router[0].PageName}.html
        ipcRenderer.send("asynchronous-play", `${ProjectDA.obj.Code}`);
        $('.btn-play').html(`<img src="https://cdn.jsdelivr.net/gh/WiniGit/goline@785f3a1/lib/assets/play.svg" class="btn-play">`);
      },
    );
  });
} catch (error) { }
