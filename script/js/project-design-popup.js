$('body').on('click', '.popup-background', function (ev) {
    if (!$('.wpopup').is(ev.target) && $('.wpopup').has(ev.target).length == 0) {
        $('.popup-background').hide();
    }
});

$('body').on('click', '.close-popup', function (ev) {
    $('.popup-background').hide();
});

// invite member 
{
    $('body').on('input', '.popup-invite-member .input-email-form', function () {
        if ($(this).val().length > 0) {
            $('.button-send-invite').addClass('active');
        } else {
            $('.button-send-invite').removeClass('active');
        }
    });

    function init_UI_Popup() {
        $('.list-permission span').show();
        let permission = HomeDA.info_type == 'team' ? TeamDA.getPermission(TeamDA.selected) : ProjectDA.selected.Permission;
        if (permission == EnumPermission.editer) {
            $('.list-permission span[data-permission=0]').hide();
        } else if (permission == EnumPermission.viewer) {
            $('.list-permission span[data-permission=0]').hide();
            $('.list-permission span[data-permission=1]').hide();
        }
    }

    function getPermission(per) {
        switch (per) {
            case 0:
                return "owner";
            case 1:
                return "can edit";
            case 2:
                return "can view";
            default:
                return "can view";
        }
    }
    $('body').on('click', '.button-send-invite', function () {
        if ($(this).hasClass("active")) {
            PermissionDA.getCustomerItem($('.input-email-form').val());
        }
    });
    $('body').on('click', '.list-permission span', function () {
        if (HomeDA.info_type == 'project') {
            ProjectDA.permission = $(this).data('permission');
            $('.button-permission>span').text(getPermission(ProjectDA.permission));
        } else {
            TeamDA.permission = $(this).data('permission');
            $('.button-permission>span').text(getPermission(TeamDA.permission));
        }
    });

    const select_permission = e => {
        if (!$('.list-permission').is(e.target)
            && $('.button-permission').has(e.target).length === 0) {
            $('.button-permission').removeClass('is-show');
        }
    }

    $('body').on('click', '.button-permission', () => {
        $('.button-permission').toggleClass('is-show').promise().done(() => {
            if ($('.button-permission').hasClass('is-show')) {
                $(document).on('mouseup', select_permission);
            } else {
                $(document).off('mouseup', select_permission);
            }
        })
    });
}

// join by code
{
    $('body').on('input', '.popup-join-by-code .input-code-form', function () {
        if ($(this).val().length > 0) {
            $('.button-join').addClass('active');
        } else {
            $('.button-join').removeClass('active');
        }
    });

    $('body').on('click', '.button-join', function () {
        if ($(this).hasClass("active")) {
            PermissionDA.getByCode($('.popup-join-by-code .input-code-form').val());
            $('.popup-join-by-code .input-code-form').val("");
            $('.popup-join-by-code').parent().hide();
        }
    });
}