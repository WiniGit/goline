// header
let projectHeader = document.getElementById("header");
projectHeader.onkeydown = function (e) {
  if (e.key == "Enter" && (document.activeElement.localName == "input" || document.activeElement.localName == "p")) {
    document.activeElement.blur();
  }
};

let create_skin_popup = document.getElementById("create_skin_popup");
function closePopupSkin() {
  create_skin_popup.style.display = "none";
}
function createNewSkin() {
  let input_new_skin_name = document.getElementById("input_new_skin_name");
  let new_skin;
  let popup_cate = [...input_new_skin_name.childNodes].find((e) => e.nodeName != "#text" && e.style.display != "none" && e.getAttribute("cate"))?.getAttribute("cate");
  let input_value = [...input_new_skin_name.childNodes].find((e) => e.localName == "input").value;
  switch (parseInt(popup_cate)) {
    case EnumCate.color:
      new_skin = {
        GID: uuidv4(),
        ProjectID: ProjectDA.obj.ID,
        Value: selected_list[0].StyleItem.DecorationItem.ColorValue,
      };
      break;
    case EnumCate.typography:
      let select_typo = selected_list.find((e) => e.StyleItem.TextStyleItem).StyleItem.TextStyleItem;
      new_skin = {
        GID: uuidv4(),
        ProjectID: ProjectDA.obj.ID,
        FontSize: select_typo.FontSize,
        FontWeight: select_typo.FontWeight.toString().replace("FontWeight.w", ""),
        IsStyle: true,
        ColorValue: select_typo.ColorValue,
        LetterSpacing: select_typo.LetterSpacing,
        FontFamily: select_typo.FontFamily,
        Height: select_typo.Height,
      };
      break;
    case EnumCate.border:
      let select_border = selected_list.find((e) => e.StyleItem.DecorationItem.BorderItem).StyleItem.DecorationItem.BorderItem;
      new_skin = {
        GID: uuidv4(),
        ProjectID: ProjectDA.obj.ID,
        BorderStyle: select_border.BorderStyle,
        IsStyle: true,
        BorderSide: select_border.BorderSide,
        Width: select_border.Width,
        ColorValue: select_border.ColorValue,
      };
      break;
    case EnumCate.effect:
      let select_effect = selected_list.find((e) => e.StyleItem.DecorationItem.EffectItem).StyleItem.DecorationItem.EffectItem;
      new_skin = {
        GID: uuidv4(),
        ProjectID: ProjectDA.obj.ID,
        IsStyle: true,
        OffsetX: select_effect.OffsetX,
        OffsetY: select_effect.OffsetY,
        ColorValue: select_effect.ColorValue,
        BlurRadius: select_effect.BlurRadius,
        SpreadRadius: select_effect.SpreadRadius,
        Type: select_effect.Type,
      };
      break;
    default:
      break;
  }
  CateDA.createSkin(new_skin, input_value.replace("\\", "/").split("/"), parseInt(popup_cate));
}
let list_cate = [EnumCate.color, EnumCate.typography, EnumCate.border, EnumCate.effect];
for (let i = 0; i < list_cate.length; i++) {
  let demo_skin;
  switch (list_cate[i]) {
    case EnumCate.color:
      demo_skin = document.createElement("div");
      demo_skin.className = "box20";
      demo_skin.style.backgroundColor = "#e5e5e5";
      demo_skin.style.borderRadius = "50%";
      break;
    case EnumCate.typography:
      demo_skin = document.createElement("p");
      demo_skin.innerHTML = "T";
      demo_skin.className = "semibold4";
      break;
    case EnumCate.border:
      demo_skin = document.createElement("div");
      demo_skin.className = "box20";
      demo_skin.style.backgroundColor = "#000000";
      demo_skin.style.borderRadius = "50%";
      break;
    case EnumCate.effect:
      demo_skin = document.createElement("img");
      demo_skin.className = "box20";
      demo_skin.src = "https://cdn.jsdelivr.net/gh/WiniGit/goline@f7ad6db/lib/assets/effect-settings.svg";
      break;
    default:
      break;
  }
  demo_skin.style.order = -1;
  demo_skin.style.marginRight = "16px";
  demo_skin.setAttribute("cate", list_cate[i]);
  document.getElementById("input_new_skin_name").appendChild(demo_skin);
}
// setup create obj tool
let create_obj_tool = document.getElementById("create_tool");
let list_tool = [
  {
    message: ToolState.move,
    expand: function () {
      console.log("move");
    },
    scr: "https://cdn.jsdelivr.net/gh/WiniGit/goline@f7ad6db/lib/assets/move.svg",
  },
  {
    message: ToolState.hand_tool,
    scr: "https://cdn.jsdelivr.net/gh/WiniGit/goline@f7ad6db/lib/assets/hand.svg",
  },
];

let logo_wini = document.createElement("img");
logo_wini.src = "https://cdn.jsdelivr.net/gh/WiniGit/goline@f7ad6db/lib/assets/logo_wini.svg";
logo_wini.style.padding = "12px";
logo_wini.style.width = "24px";
logo_wini.style.height = "24px";
logo_wini.style.border = "none";

function update_UI_owner(owner_item) {
  $(".wmember-container").css("pointer-events", "none");
  $(".wmember-container").find(".fa-chevron-down").show();
  $('.wmember-container[data-customer="' + owner_item.CustomerID + '"]').css("pointer-events", "none");
  $('.wmember-container[data-customer="' + owner_item.CustomerID + '"]')
    .find(".fa-chevron-down")
    .hide();
}

// setup share tool
let share_tool = document.getElementById("share_tool");
let customer_circle = document.createElement("div");
customer_circle.className = "row customer-circle-list";
let button_share = document.createElement("div");
button_share.className = "regular1 btn-share";
button_share.innerHTML = "Share";
button_share.onclick = function () {
  let list_customer = '<div class="col">';
  let p_user = PageDA.customerList.find((e) => e.CustomerID == userItem.ID);
  let owner_item = PageDA.customerList.find((e) => e.Permission == EnumPermission.owner);
  for (let customer of PageDA.customerList) {
    list_customer += '<div data-id="' + customer.ID + '" data-customer="' + customer.CustomerID + '" class="wmember-container row">' + '    <div class="center box32"><i class="fa-solid fa-user-circle text-body"></i></div>' + '    <span class="regular11 text-title space">' + "        <span>" + `${customer?.CustomerName ?? "Anonymus"}` + "</span > " + '        <span class="indentify regular11 text-subtitle ' + `${userItem.ID == customer.CustomerID ? "" : " hide"}` + '">(You)</span>' + "    </span>" + '    <button class="edit-member-permission wbutton-permission button-transparent overlay" type="button" >' + "        <span>" + '            <span class="user_permission">' + EnumPermission.get_namePermission(customer.Permission) + "</span>" + '            <i class="fa-solid fa-chevron-down fa-xs"></i>' + "        </span>" + "    </button>" + '    <div class="wpopup-edit-permisson permission_popup">' + '        <div class="owner ' + `${p_user.Permission == EnumPermission.owner ? "" : "hide "}` + 'permission-option regular11 text-white">Owner</div>' + '        <div class="edit ' + `${p_user.Permission != EnumPermission.viewer && (customer.CustomerID == userItem.ID || p_user.Permission < customer.Permission) ? "" : "hide "}` + 'permission-option regular11 text-white">Can edit</div>' + '        <div class="view permission-option regular11 text-white">Can view</div>' + '        <div class="remove ' + `${p_user.Permission == EnumPermission.owner ? "" : "hide "}` + 'permission-option regular11 text-white border-top-light">remove</div>' + '        <div class="leave ' + `${p_user.Permission != EnumPermission.owner && customer.CustomerID == userItem.ID ? "" : "hide "}` + 'permission-option regular11 text-white border-top-light">Leave</div>' + "    </div>" + "</div>";
  }
  list_customer += "</div>";
  $("body").append(
    `<div class="center wpopup-background">
            <div class="wpopup-container elevation7">

                <div class="popup-block border-bottom row">
                    <div class="heading-9 space">Invite member</div>
                    <button type="button" class="close_popup button-transparent box24"><i style="pointer-events:none" class="fa-solid fa-close fa-lg"></i></button>
                </div>

                <form id="invite_container" class="popup-block invite-block row">
                    <div class="invite-container row">
                        <input class="invite-email-input" type="email" name="Email" placeholder="Enter email" />
                        <button class="select-inviter-permission button-transparent semibold11 center background-disable" type="button">
                            <span class="selected_permission text-body">Can view</span>
                        </button>
                        <div class="wpopup-select-permission permission_popup">
                            <div data-permission="1" class="permission-option regular0 text-white">Can edit</div>
                            <div data-permission="2" class="permission-option regular0 text-white">Can view</div>
                        </div>
                    </div>
                    <button class="wbutton-send-invite semibold11" type="submit" class="button-transparent box24">Send invite</button>
                </form>

                <div class="popup-block col">
                    <div class="semibold11 member-title">Members</div> ${list_customer}
                </div>
            </div>
        </div>`,
  );
  // if (p_user.Permission == EnumPermission.owner) {
  $('.wmember-container[data-customer="' + owner_item.CustomerID + '"]').css("pointer-events", "none");
  $('.wmember-container[data-customer="' + owner_item.CustomerID + '"]')
    .find(".fa-chevron-down")
    .hide();
  // }

  $("#invite_container").validate({
    rules: {
      Email: {
        required: true,
        email: true,
        minlength: 8,
      },
    },
    messages: {
      Email: {
        required: "Trường này là bắt buộc.",
        email: "Vui lòng nhập một địa chỉ email hợp lệ.",
        minlength: "Vui lòng nhập ít nhất 3 ký tự.",
      },
    },
    submitHandler: function (ev) {
      PermissionDA.getCustomerItem($(".invite-email-input").val());
    },
  });

  $("body").on("click", ".select-inviter-permission", function (ev) {
    ev.stopPropagation();
    $(".permission_popup").hide();
    $(this).next(".wpopup-select-permission").show();
  });
  // $('body').on('click', '.wpopup-select-permission .permission-option', function (ev) {
  //     $('.selected_permission').text($(this).text());
  //     ProjectDA.permission = $(this).data('permission');
  // });

  $("body").on("click", ".edit-member-permission", function (ev) {
    ev.stopPropagation();
    $(".permission_popup").hide();
    $(this).next(".wpopup-edit-permisson").show();
  });
  $("body").on("click", ".wpopup-edit-permisson .permission-option", function (ev) {
    if ($(this).hasClass("owner")) {
      let selected_cus = PageDA.customerList.find((e) => e.ID == $(this).parents(".wmember-container").data("id"));
      // TODO: show popup warning
      // then:
      $(this).parents(".wmember-container").find(".user_permission").text($(this).text());
      selected_cus.Permission = EnumPermission.owner;

      $('.wmember-container[data-customer="' + userItem.ID + '"]')
        .find(".user_permission")
        .text("Can edit");
      // let tmp = PageDA.customerList.find(e => e.CustomerID == userItem.ID).Permission = EnumPermission.editer;

      PageDA.editCustomerPermission(selected_cus, selected_cus.CustomerType);
      // PageDA.editCustomerPermission(tmp, tmp.CustomerType);

      $('.wmember-container[data-customer="' + p_user.CustomerID + '"]').css("pointer-events", "visible");
      $('.wmember-container[data-customer="' + p_user.CustomerID + '"]')
        .find(".fa-chevron-down")
        .show();

      $('.wmember-container[data-customer="' + selected_cus.CustomerID + '"]').css("pointer-events", "none");
      $('.wmember-container[data-customer="' + selected_cus.CustomerID + '"]')
        .find(".fa-chevron-down")
        .hide();
    } else if (!$(this).hasClass("remove")) {
      $(this).parents(".wmember-container").find(".user_permission").text($(this).text());
    } else {
      $(this).parents(".wmember-container").remove();
      let selected_cus = PageDA.customerList.find((e) => e.ID == $(this).parents(".wmember-container").data("id"));
      PageDA.deleteCustomerPermission(selected_cus.ID, selected_cus.CustomerType);
    }

    if ($(this).hasClass("edit")) {
      let selected_cus = PageDA.customerList.find((e) => e.ID == $(this).parents(".wmember-container").data("id"));
      if (selected_cus.Permission != EnumPermission.editer) {
        selected_cus.Permission = EnumPermission.editer;
        PageDA.editCustomerPermission(selected_cus, selected_cus.CustomerType);
      }
    } else if ($(this).hasClass("view")) {
      let selected_cus = PageDA.customerList.find((e) => e.ID == $(this).parents(".wmember-container").data("id"));
      if (selected_cus.Permission != EnumPermission.viewer) {
        selected_cus.Permission = EnumPermission.viewer;
        PageDA.editCustomerPermission(selected_cus, selected_cus.CustomerType);
      }
    } else if ($(this).hasClass("leave")) {
      let selected_cus = PageDA.customerList.find((e) => e.ID == $(this).parents(".wmember-container").data("id"));
      PageDA.deleteCustomerPermission(selected_cus.ID, selected_cus.CustomerType);

      TitleBarDA.list.splice(TitleBarDA.list.indexOf(ProjectDA.obj), 1);
      Ultis.setStorage("list-project-tab", JSON.stringify(TitleBarDA.list));

      location.href = "/View/home-screen.html?tab=recent";
    }
  });

  $("body").on("click", function (ev) {
    if (!$(".permission_popup").is(ev.target)) {
      $(".permission_popup").hide();
    }
    if ($(".close_popup").is(ev.target) || $(".wpopup-background").is(ev.target)) {
      $(".wpopup-background").remove();
    }
  });
};

let button_play = document.createElement("img");
button_play.src = "https://cdn.jsdelivr.net/gh/WiniGit/goline@f7ad6db/lib/assets/play.svg";
button_play.className = "btn-play";
$('body').on('click', '.btn-play', function (ev) {
  ev.stopPropagation();
  push_dataProject();
  window.open("https://demo.wini.vn/" + ProjectDA.obj.Code);
})
let input_scale = document.createElement("div");
input_scale.className = "regular1 input-scale";
input_scale.innerHTML = "20%";
let icon_down = document.createElement("i");
icon_down.className = "fa-solid fa-chevron-down fa-xs";
icon_down.style.marginLeft = "4px";
input_scale.appendChild(icon_down);
share_tool.replaceChildren(customer_circle, button_share, button_play, input_scale);

//
function customerList() {
  let user = UserService.getUser();
  ProjectDA.obj.CustomerProjectItems.forEach((e) => {
    e.CustomerType = EnumObj.customerProject;
    if (PageDA.customerList.length === 0 || PageDA.customerList.every((el) => el.CustomerID !== e.CustomerID)) {
      PageDA.customerList.push(e);
    }
  });
  ProjectDA.obj.CustomerTeamItems.forEach((e) => {
    e.CustomerType = EnumObj.customerTeam;
    let el = PageDA.customerList.find((el) => el.CustomerID === e.CustomerID);
    if (el) {
      ProjectDA.obj.CustomerTeamItems.indexOf[e] = el;
    } else {
      PageDA.customerList.push(e);
    }
  });
  ProjectDA.obj.CustomerTeamPItems.forEach((e) => {
    e.CustomerType = EnumObj.customerTeam;
    let el = PageDA.customerList.find((el) => el.CustomerID === e.CustomerID);
    if (el) {
      ProjectDA.obj.CustomerTeamPItems.indexOf[e] = el;
    } else {
      PageDA.customerList.push(e);
    }
  });
  customer_circle.replaceChildren(
    ...PageDA.customerList.slice(0, 3).map((customerItem) => {
      let itemCircle = document.createElement("div");
      const randomColor = Ultis.generateRandomColor();
      customerItem.color = randomColor;
      if (!customerItem.CustomerName && customerItem.CustomerID === user.ID) customerItem.CustomerName = user.Email;
      itemCircle.style.backgroundColor = randomColor;
      itemCircle.innerHTML = (customerItem.CustomerName ?? "Anonymous").substring(0, 1).toUpperCase();
      let tooltip = document.createElement("span");
      tooltip.innerHTML = customerItem.CustomerName ?? "Anonymous";
      itemCircle.appendChild(tooltip);
      return itemCircle;
    }),
  );
  if (PageDA.customerList.length > 3) {
    let itemCircle = document.createElement("div");
    const randomColor = Ultis.generateRandomColor();
    itemCircle.style.backgroundColor = randomColor;
    itemCircle.innerHTML = PageDA.customerList.length - 3;
    let tooltip = document.createElement("span");
    tooltip.innerText = PageDA.customerList
      .slice(3)
      .map((customerItem) => {
        if (!customerItem.CustomerName && customerItem.CustomerID === user.ID) customerItem.CustomerName = user.Email;
        const randomColor = Ultis.generateRandomColor();
        customerItem.color = randomColor;
        return customerItem.CustomerName;
      })
      .join("\n");
    itemCircle.appendChild(tooltip);
    customer_circle.appendChild(itemCircle);
  }
}
//
let projectTitle = document.getElementById("project_name");
projectTitle.innerHTML = ProjectDA.obj.Name;

function permissionTool() {
  if (PageDA.enableEdit) {
    list_tool = [
      list_tool[0],
      ...[
        {
          message: ToolState.frame,
          expand: function () {
            console.log("frame");
          },
          scr: "https://cdn.jsdelivr.net/gh/WiniGit/goline@f7ad6db/lib/assets/frame.svg",
        },
        {
          message: ToolState.rectangle,
          expand: function () {
            console.log("rectangle");
          },
          scr: "https://cdn.jsdelivr.net/gh/WiniGit/goline@f7ad6db/lib/assets/rectangle.svg",
        },
        {
          message: ToolState.base_component,
          expand: function () {
            console.log("base component");
            let component_button = create_obj_tool.querySelector("#BaseComponent");
            let popup_offset = component_button.getBoundingClientRect();
            // set display and position for popup
            $("#choose-component-popup").css({ top: popup_offset.top + 52, left: popup_offset.left });
            $("#choose-component-popup").css("display", "flex");
            $("#choose-component-popup").removeAttr("cateid");
          },
          scr: "https://cdn.jsdelivr.net/gh/WiniGit/goline@f7ad6db/lib/assets/base_component.svg",
        },
        {
          message: ToolState.text,
          scr: "https://cdn.jsdelivr.net/gh/WiniGit/goline@f7ad6db/lib/assets/text.svg",
        },
      ],
      list_tool.pop(),
    ];
  } else {
    $(".f12-container").css("pointer-event", "none");
  }
  create_obj_tool.replaceChildren(
    logo_wini,
    ...list_tool.map((wTool) => {
      let new_tool = document.createElement("button");
      new_tool.id = wTool.message;
      new_tool.className = "row btn-tool-state";
      if (wTool.message === tool_state) {
        $(new_tool).addClass("on-select");
      }
      let tooltip = document.createElement("span");
      tooltip.innerHTML = wTool.message.replace("ToolState.", "");
      let icon_tool = document.createElement("img");
      icon_tool.src = wTool.scr;
      new_tool.appendChild(icon_tool);
      if (wTool.expand != null) {
        let icon_down = document.createElement("i");
        icon_down.className = "fa-solid fa-chevron-down fa-2xs";
        icon_down.style.color = "#ffffff";
        icon_down.onclick = function (e) {
          e.stopPropagation();
          wTool.expand();
        };
        new_tool.appendChild(icon_down);
      }
      new_tool.onclick = function (e) {
        e.stopPropagation();
        toolStateChange(this.id);
        if (wTool.message === ToolState.base_component) {
          wTool.expand();
        }
      };
      new_tool.appendChild(tooltip);
      return new_tool;
    }),
  );
  if (PageDA.enableEdit) {
    projectTitle.onclick = function (e) {
      e.stopPropagation();
      this.contentEditable = true;
      this.style.outline = "none";
      var range = document.createRange();
      range.selectNodeContents(this);
      var sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    };

    projectTitle.onblur = function () {
      this.contentEditable = false;
      ProjectDA.obj.Name = this.innerHTML;
      ProjectDA.edit(ProjectDA.obj);
    };
  }
}
