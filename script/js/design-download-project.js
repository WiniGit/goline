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

$("body").on("click", '.download-project:not(".downloading")', async function () {
  $(".download-project").addClass("downloading");
  $(".download-project span").html('Download... <i class="fa-solid fa-download fa-sm"></i>');

  $(".download-project i").toggleClass("fa-spinner fa-download");
  $(".download-project i").addClass("fa-spin");

  let page_script = "";
  document.body.getAttribute;

  let list_page = wbase_list.filter((e) => e.ParentID === wbase_parentID && EnumCate.extend_frame.some((ct) => ct === e.CateID));
  list_page = list_page.map((e) => {
    let cloneValue = e.value.cloneNode(true);
    cloneValue.style.position = "unset";
    cloneValue.style.top = "unset";
    cloneValue.style.left = "unset";
    [cloneValue, ...cloneValue.querySelectorAll(".wbaseItem-value")].forEach((wbValue) => {
      wbValue.removeAttribute("listid");
      wbValue.removeAttribute("lock");
      wbValue.removeAttribute("iswini");
      if (wbValue.getAttribute("cateid") == EnumCate.chart) {
        let item = wbase_list.find((wb) => wb.GID === cloneValue.id);
        let labelStyle = item.StyleItem.TextStyleItem;
        const config = {
          type: item.JsonItem.Type,
          data: item.ChartData,
          options: {
            plugins: {
              legend: {
                display: false,
              },
            },
            scales: ChartType.axes_chart.some((chartType) => chartType === item.JsonItem.Type)
              ? {
                x: {
                  ticks: {
                    color: `#${labelStyle.ColorValue.substring(2)}${labelStyle.ColorValue.substring(0, 2)}`,
                    font: {
                      size: labelStyle.FontSize,
                      weight: labelStyle.FontWeight,
                      family: labelStyle.FontFamily,
                    },
                  },
                },
                y: {
                  beginAtZero: true,
                  max: item.JsonItem.MaxValue,
                  ticks: {
                    stepSize: item.JsonItem.StepSize,
                    color: `#${labelStyle.ColorValue.substring(2)}${labelStyle.ColorValue.substring(0, 2)}`,
                    font: {
                      size: labelStyle.FontSize,
                      weight: labelStyle.FontWeight,
                      family: labelStyle.FontFamily,
                    },
                  },
                },
              }
              : null,
          },
        };
        wbValue.setAttribute("config", JSON.stringify(config));
      }
    });
    $(cloneValue).addClass("w-page");
    cloneValue.Name = e.Name;
    return cloneValue;
  });
  // try {
    for (let page of list_page) {
      page_script = "";
      let list_itemShow = get_listItemInside(page.id);
      for (let witem of list_itemShow) {
        if (witem.JsonEventItem) {
          let router_item = witem.JsonEventItem.find((e) => e.Name == "Router");
          if (router_item) {
            let clickElement = page;
            if (page.id !== witem.GID) clickElement = page.querySelector(`.wbaseItem-value[id="${witem.GID}"]`);
            let new_url = "/" + `${RouterDA.list.find((e) => e.Id == router_item.RouterID)?.Route ?? ""}`;
            $(clickElement).addClass("event-click");
            page_script += "<script>" + '    document.getElementById("' + witem.GID + '").onclick = function (ev) {' + '        location.href = "' + new_url + '"' + "    }" + "</script>";
          }

          if (witem.PrototypeID != null) {
            let nextPagePrototype = list_page.find((e) => e.id == witem.PrototypeID);
            if (nextPagePrototype) {
              let animation = witem.JsonEventItem?.find((e) => (e.Name = "Animation"));
              let animation_class;
              if (animation != null) {
                animation_class += " animation_move";
                console.log(animation);
                switch (animation.Data.Animation) {
                  case EnumAnimation.MoveIn:
                    animation_class += " in";
                    break;
                  case EnumAnimation.MoveOut:
                    animation_class += " out";
                    break;
                  case EnumAnimation.SlideIn:
                    animation_class += " in";
                    break;
                  case EnumAnimation.SlideOut:
                    animation_class += " out";
                    break;
                  default:
                    animation_class += " in";
                    break;
                }
                switch (animation.Data.Direction) {
                  case "left":
                    animation_class += " left";
                    break;
                  case "right":
                    animation_class += " right";
                    break;
                  case "up":
                    animation_class += " up";
                    break;
                  case "down":
                    animation_class += " down";
                    break;
                  default:
                    animation_class += " left";
                    break;
                }
              }
              if (nextPagePrototype) {
                $(nextPagePrototype).addClass(animation_class);
              }
              //   else {
              //     next_wbase_prototype.ListClassName += animation_class;
              //   }
            }
          }
        }
      }

      await $.post(
        domainApi + "/WBase/build/",
        {
          Name: page.Name,
          Code: ProjectDA.obj.Code,
          Item: `${page.outerHTML + page_script}`.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"),
        },
        function (data) {
          console.log("data", data);
        },
      );
    }

    window.open(domainApi + `/WBase/buildend?code=${ProjectDA.obj.Code}&name=${ProjectDA.obj.Name}&id=${ProjectDA.obj.ID}`);

    $(".download-project").removeClass("downloading");
    $(".download-project>span").html('Download <i class="fa-solid fa-download fa-sm"></i>');

    $(".download-project>i").toggleClass("fa-spinner fa-download");
    $(".download-project>i").removeClass("fa-spin");

    toastr["success"]("Download successful!");
  // } catch (error) {
  //   toastr["error"](`${error}`);
  // }
});
