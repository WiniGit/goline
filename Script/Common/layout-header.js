$('.home-header').load('/View/lauout-header.html', function () {
    let customer = JSON.parse(Ultis.getStorage('customer'));
    $('.customer-name .name').text(customer.Fullname);
    $('.customer-name .email').text(customer.Email);
    $('.customer-setting-dropdown .email').text(customer.Email);

    $('.home-header .header-search-form').on('input', function () {
        let list = ProjectDA.list.filter(e => e.Name.toLowerCase().includes($(this).val().toLowerCase()));
        update_SelectedOption(list);
    });
});

const toggle_setting = e => {
    if (!$('.customer-setting-dropdown').is(e.target)
        && $('.customer-setting').has(e.target).length <= 1) {
        $('.customer-setting').removeClass('is-show')
    }
}

$('body').on('click', '.customer-setting', function () {
    $('.customer-setting').toggleClass('is-show').promise().done(() => {
        if ($('.customer-setting').hasClass('is-show')) {
            $(document).on('mouseup', toggle_setting)
        } else {
            $(document).off('mouseup', toggle_setting)
        }
    });
});

$('body').on('click', '.join-by-code', function () {
    $('.popup-join-by-code').parent().css('display', 'flex');
});