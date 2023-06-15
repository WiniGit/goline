// project popup action
$("body").on("click", `button.button-select-permisson`, function (ev) {
    HomePopup.seleted_userID = null;
    ev.stopPropagation();
    $('.popup-select-permission').remove();
    let permission;
    if ($('#info-container').hasClass("team")) {
        let cus = TeamDA.selected.CustomerTeamItems.find(e => e.CustomerID == userItem.ID);
        if (cus == null) {
            let teamParent = TeamDA.list.find(e => e.ID == TeamDA.selected.ParentID);
            cus = teamParent.CustomerTeamItems.find(el => el.CustomerID == userItem.ID);
        }
        permission = cus?.Permission;
    }
    else {
        permission = ProjectDA.selected.Permission;
    }
    $('.popup-invite-member').append(HomePopup.create_popupSelectPermisson(permission));
    $('.popup-select-permission').css({
        "display": "flex",
        "width": `${document.getElementsByClassName('button-select-permisson')[0].clientWidth}px`,
        "top": `${$('.button-select-permisson').offset().top - $('.popup-invite-member').offset().top + 40}px`,
        "left": `${$('.button-select-permisson').offset().left - $('.popup-invite-member').offset().left}px`,
    });
});

$("body").on("click", `button.button-change-permission`, function (ev) {
    ev.stopPropagation();
    $('.popup-select-permission').remove();
    let permission;
    if ($('#info-container').hasClass("team")) {
        let cus = TeamDA.selected.CustomerTeamItems.find(e => e.CustomerID == userItem.ID);
        if (cus == null) {
            let teamParent = TeamDA.list.find(e => e.ID == TeamDA.selected.ParentID);
            cus = teamParent.CustomerTeamItems.find(el => el.CustomerID == userItem.ID);
        }
        permission = cus?.Permission;
    }
    else {
        permission = ProjectDA.selected.Permission;
    }
    HomePopup.seleted_userID = $(this).parents('.member-row').data('id');
    // HomePopup.seleted_permission = $(this).parents('.member-row').data('permission');
    $('.popup-invite-member').append(HomePopup.create_popupSelectPermisson(permission));
    $('.popup-select-permission').css({
        "display": "flex",
        "width": `${document.getElementsByClassName('button-change-permission')[0].clientWidth}px`,
        "top": `${$(this).parent().offset().top - $('.popup-invite-member').offset().top + 40}px`,
        "right": "16px",
    });
});

$("body").on("click", `.popup-select-permission .option-tile`, function (ev) {
    if (HomePopup.seleted_userID == null) {
        ProjectDA.permission = $(this).data('id');
        $('.permission-selected').text($(this).text());
    }
    else {
        if ($(this).hasClass('remove')) {
            if ($('#info-container').hasClass("team")) {
                let cus = TeamDA.selected.CustomerTeamItems.find(e => e.ID == HomePopup.seleted_userID);
                TeamDA.deleteCustomerTeam(cus.ID);
            }
            else {
                let cus = ProjectDA.selected.CustomerProjectItems.find(e => e.ID == HomePopup.seleted_userID);
                ProjectDA.deleteCustomerProject(cus);
            }
        } else {
            if ($('#info-container').hasClass("team")) {
                let cus = TeamDA.selected.CustomerTeamItems.find(e => e.ID == HomePopup.seleted_userID);
                if (cus.Permission != $(this).data('id')) {
                    cus.Permission = $(this).data('id');
                    TeamDA.editCustomerTeam(cus);
                }
            }
            else {
                let cus = ProjectDA.selected.CustomerProjectItems.find(e => e.ID == HomePopup.seleted_userID);
                if (cus.Permission != $(this).data('id')) {
                    cus.Permission = $(this).data('id');
                    ProjectDA.editCustomerProject(cus);
                }
            }
            $(`.popup-invite-member .member-row[data-id=${HomePopup.seleted_userID}] .button-change-permission>span:nth-child(1)`).text($(this).text());
        }
    }
});

$("body").on("input", `.popup-invite-member .email-input`, function (ev) {
    if ($(this).val().length > 6) {
        if (!$('.button-send-invite').hasClass('active'))
            $('.button-send-invite').addClass(' active');
    } else {
        $('.button-send-invite').removeClass(' active');
    }
});

$("body").on("click", `.popup-invite-member .button-send-invite.active`, function (ev) {
    PermissionDA.getCustomerItem($('.email-input').val());
});


$("body").on("click", function (ev) {
    if (!$(".home-popup").is(ev.target)) {
        $(".home-popup").hide();
    }
    if ($('.popup-background').is(ev.target) || $('.close-popup').is(ev.target)) {
        $('.popup-background').hide();
        $('.popup-background>*').hide();
    }
    // close popup select permission
    if (!$('.popup-select-permission').is(ev.target)) {
        $('.popup-select-permission').remove();
    }
});