class InfoView {
    static create_memberTile(item, isOwner) {
        // `<div data-id=${item.ID} data-customer=${item.CustomerID} class="member-row info_tile row">
        let member_tile =
            `<div data-id=${item.ID} class="member-row info_tile row">
                <div class="box36 center"><i class="fa-solid fa-user-circle text-body fa-lg"></i></div>
                <div class="regular2 space">
                    <span class="text-body">${item?.FullName ?? "Anonymus"}</span>
                    <span class="regular2 text-subtitle ${item.ID == userItem.ID ? "" : "hide"}">(You)</span>
                </div>
                <button class="${item.ID == userItem.ID && !isOwner ? "" : "hide"} button-delete button-transparent text-primary regular1">leave</button>
            </div>`;
        return member_tile;
    }

    static create_listMember(list, type) {
        let list_member = '';
        let isOwner = false;
        if (type == "team") {
            let cus = TeamDA.selected.CustomerTeamItems.find(e => e.CustomerID == userItem.ID);
            if (cus == null) {
                let teamParent = TeamDA.list.find(e => e.ID == TeamDA.selected.ParentID);
                cus = teamParent.CustomerTeamItems.find(el => el.CustomerID == userItem.ID);
            }
            isOwner = cus?.Permission == 0 ?? false;
        }
        else {
            isOwner = ProjectDA.selected.Permission == 0 ?? false;
        }
        for (let item of list) {
            list_member += InfoView.create_memberTile(item, isOwner);
        }
        return list_member;
    }
}

const getListUser = async (list) => {
    let output;
    const url = `${pathUrl}/Customer/get-info-mutiple`;

    await $.ajax({
        url: url,
        type: 'POST',
        data: JSON.stringify(list.map((e) => e.CustomerID)),
        contentType: 'application/json',
        success: async function (data) {
            output = data.Data;
        },
        error: function (xhr, status, error) {
            output = null
            // Handle error cases here
        }
    });
    return output;
}

$("body").on("click", ".copy-code-button", function (ev) {
    navigator.clipboard.writeText($(".code-value").text());
    toastr['success']('copied');
});

$("body").on("click", ".edit-domain-button", function (ev) {
    $('.domain-value-button').hide();
    $('.change-domain-input').show();
    $('.change-domain-input').focus();
    $('.change-domain-input').select();
});

$("body").on("blur", ".change-domain-input", function (ev) {
    if ($(this).val().length > 0 && $(this).val() != ProjectDA.selected.Domain) {
        ProjectDA.selected.Domain = $(this).val();
        ProjectDA.edit(ProjectDA.selected);

        $('.domain-value-button .domain-value').text($(this).val());
    }
    $('.change-domain-input').hide();
    $('.domain-value-button').show();
});

$("body").on("keydown", ".change-domain-input", function (ev) {
    if (ev.key == "Enter") {
        $(this).trigger("blur");
    }
});

$("body").on("blur", ".description-block input", function (ev) {
    if ($(this).val().length > 0 && $(this).val() != ProjectDA.selected.Description) {
        ProjectDA.selected.Description = $(this).val();
        ProjectDA.edit(ProjectDA.selected);
    }
})
$("body").on("keydown", ".description-block input", function (ev) {
    if (ev.key == "Enter") {
        $(this).trigger("blur");
    }
});

$("body").on("blur", ".keyword-block input", function (ev) { })
$("body").on("keydown", ".keyword-block input", function (ev) {
    if (ev.key == "Enter") {
        $(this).trigger("blur");
    }
});

$("body").on("click", ".team-action-container .add-new-project", function (ev) {
    if (TeamDA.selected.ParentID == null) {
        TeamDA.add({
            ParentID: TeamDA.selected.ID,
            Name: "New project"
        });
    } else {
        ProjectDA.add({
            ID: 0,
            TeamID: TeamDA.selected,
            Name: "Untitled"
        });
    }
});

$('body').on('click', `button.invite-member`, function (ev) {
    ev.stopPropagation();
    HomePopup.seleted_userID = null;
    // $('.popup-invite-member').css('display', 'flex');
    let popup = document.getElementsByClassName("popup-invite-member")[0];
    if ($('#info-container').hasClass("team")) {
        popup.outerHTML = HomePopup.create_popupInviteMember(TeamDA.selected.CustomerTeamItems);
    } else {
        popup.outerHTML = HomePopup.create_popupInviteMember(ProjectDA.selected.CustomerProjectItems);
    }
    // $('.popup-invite-member').append(HomePopup.create_popupInviteMember(ProjectDA.selected.CustomerProjectItems));
    $('.popup-invite-member').css('display', 'flex');
    $('.popup-background').css('display', 'flex');
});

$("body").on("click", ".team-action-container .more-action", function (ev) { });

$('body').on('click', `.list-member button.button-delete`, function (ev) {
    ev.stopPropagation();
    let _this = this;
    let item = {
        type: "warning",
        title: "Thông báo",
        content: `Bạn có chắc chắn muốn rời khỏi <span class="text-primary semibold2">${$(_this).parents("#info-container").hasClass("project") ? ProjectDA.selected.Name : TeamDA.selected.Name}</span> không?Bạn sẽ không thể tiếp tục làm việc với ${$(_this).parents("#info-container").hasClass("project") ? "dự án" : "nhóm"} này nữa!`,
        cancelTitle: "Cancel",
        confirmTitle: "Confirm",
        cancelAction: function () {
        },
        confirmAction: function () {
            if ($(_this).parents("#info-container").hasClass("project")) {
                let permissionItem = ProjectDA.selected.CustomerProjectItems.find(e => e.CustomerID == userItem.ID);
                ProjectDA.deleteCustomerProject(permissionItem.ID);
            } else {
                let permissionItem = TeamDA.selected.CustomerTeamItems.find(e => e.CustomerID == userItem.ID);
                TeamDA.deleteCustomerTeam(permissionItem.ID);
            }
        },
    };
    $('.popup-background').append(PopupDA.create_alertPopup_center(item));
    $('.popup-background').css("display", "flex");
});


try {
    const ipcRenderer = require('electron').ipcRenderer;
    $('body').on('click', '.domain-value-button', function () {
        ipcRenderer.send('asynchronous', `${$(this).find("u").text()}`);
    });
} catch (error) {

}