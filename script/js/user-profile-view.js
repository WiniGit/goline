const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const pid = urlParams.get('pid');

$('.appbar').load('/View/title-bar.html', function () {
    TitleBarDA.initDataStorage();
});

$('.screen-header').load('/View/layout-hedaer.html', function (ev) {
    $('.user-container .user-name').text(userItem.Fullname);
    $('.user-container .user-email').text(userItem.Email);

    $('body').on('click', `button.join-by-code`, function (ev) {
        ev.stopPropagation();
        $('.popup-join-by-code').css('display', 'flex');
        $('.popup-background').css('display', 'flex');
    });
    $('body').on('click', `.show-user-action`, function (ev) {
        ev.stopPropagation();
        $('.user-option').css({
            "display": "flex",
        });
        $('.popup-background').css('display', 'flex');
    });
    $("body").on("click", function (ev) {
        if ($('.popup-background').is(ev.target) || $('.close-popup').is(ev.target)) {
            $('.popup-background').hide();
            $('.popup-background>*').hide();
        }

    });
});

function create_userInfoTable() {
    let output =
        `<div class="info-content-row row border-bottom">
            <div class="space">
                <span class="regular2 text-subtitle">Profile name</span>
                <span class="space"></span>
                <span class="user-name regular2 text-title"></span>
            </div>
            <div class="space">
                <span class="regular2 text-subtitle">Company/ Team</span>
                <span class="space"></span>
                <span style="white-space: nowrap;" class="regular2 text-title">None</span>
            </div>
        </div>
        <div class="info-content-row row border-bottom">
            <div class="space">
                <span class="regular2 text-subtitle">Email</span>
                <span class="space"></span>
                <span class="user-email regular2 text-title"></span>
            </div>
            <div class="space">
                <span class="regular2 text-subtitle">Job</span>
                <span class="space"></span>
                <span style="white-space: nowrap;" class="regular2 text-title">None</span>
            </div>
        </div>
        <div class="info-content-row row border-bottom">
            <div class="space">
                <span class="regular2 text-subtitle">Contact</span>
                <span class="space"></span>
                <span class="user-mobile regular2 text-title"></span>
            </div>
            <div class="space"></div>
        </div>
        <div class="info-content-row row">
            <div class="space">
                <span class="regular2 text-subtitle">Description</span>
                <span class="space"></span>
                <span class="regular2 text-title"></span>
            </div>
            <div class="space"></div>
        </div>`;

    return output;
}

function create_editUserInfoTable() {
    let output =
        `<div class="info-content-row row">
            <div class="space col" style="justify-content: center; align-items: start;">
                <span class="semibold2 text-label">Profile name</span>
                <input class="new-user-name regular2 text-body" value="" />
            </div>
            <div class="space col" style="justify-content: center; align-items: start;">
                <span class="semibold2 text-label">Company/ Team</span>
                <input class="regular2 text-body" value="None" disabled/>
            </div>
        </div>
        <div class="info-content-row row">
            <div class="space col" style="justify-content: center; align-items: start;">
                <span class="semibold2 text-label">Email</span>
                <input class="new-user-email regular2 text-body" value="" disabled/>
            </div>
            <div class="space col" style="justify-content: center; align-items: start;">
                <span class="semibold2 text-label">Job</span>
                <input class="regular2 text-body" value="None" disabled/>
            </div>
        </div>
        <div class="info-content-row row">
            <div class="space col" style="justify-content: center; align-items: start;">
                <span class="semibold2 text-label">Contact</span>
                <input class="new-user-contact regular2 text-body" value="0988977403" />
            </div>
            <div class="space col" style="justify-content: center; align-items: start;"></div>
        </div>
        <div class="info-content-row row">
            <div class="space col" style="justify-content: center; align-items: start;">
                <span class="semibold2 text-label">Description</span>
                <input class="regular2 text-body" value="" placeholder="Enter description" />
            </div>
            <div class="space col" style="justify-content: center; align-items: start;"></div>
        </div>
        <div class="button-action-edit-container row">
            <button class="button-cancel-edit button-transparent semibold2 ">Cancel</button>
            <button class="button-save-change button-transparent semibold2 ">Save change</button>
        </div>`;

    return output;
}

function update_UI_userInfo(userItem) {
    $('.user-name').text(userItem.Fullname);
    $('.user-email').text(userItem.Email);
    $('.user-mobile').text(userItem.Mobile);
    $('.count-container.team').first().find('div').first().text(TeamDA.list.length);
    $('.count-container.project').first().find('div').first().text(ProjectDA.list.length);

    $('.new-user-name').val(userItem.Fullname);
    $('.new-user-email').val(userItem.Email);
    $('.new-new-mobile').val(userItem.Mobile);

}


$('.tab-bar-content').html(create_userInfoTable());
update_UI_userInfo(userItem);

$('body').on('click', `.button-edit-profile`, function (ev) {
    $(`.button-edit-profile`).hide();
    $('.tab-bar-content').html(create_editUserInfoTable());

    update_UI_userInfo(userItem);
});

$('body').on('click', `.button-cancel-edit`, function (ev) {
    $(`.button-edit-profile`).show();
    $('.tab-bar-content').html(create_userInfoTable());

    update_UI_userInfo(userItem);
});

$('body').on('click', `.button-save-change`, function (ev) {
    let is_change = false;
    if (userItem.Fullname != $('.new-user-name').val()) {
        is_change = true;
        userItem.Fullname = $('.new-user-name').val();
    }
    if (userItem.Mobile != $('.new-user-contact').val()) {
        is_change = true;
        userItem.Mobile = $('.new-user-contact').val();
    };

    if (is_change == true) {
        PermissionDA.editCustomerItem(userItem)
    }


});
