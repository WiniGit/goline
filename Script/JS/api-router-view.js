RouterDA.getAllPage();

$('.environments-container').load('/View/api-router-view.html');

function updateData() {
    ProjectDA.selected.RouterJson = JSON.stringify(RouterDA.list);
    ProjectDA.editRouter(ProjectDA.selected);
}

$('body').on('click', '.add-router-button', function (ev) {
    RouterDA.list.push({ 'Id': RouterDA.list.length, 'Name': 'untitle', 'Route': '/', 'PageId': null, 'Sort': RouterDA.list.length, 'Save': false });
    $('.list-router-container').append(RouterDA.create_routerRow(RouterDA.list[RouterDA.list.length - 1]))
});

$('body').on('blur', '.row-name>input', function (ev) {
    RouterDA.selected = RouterDA.list.find(e => e.Id == $(this).parents(".router-row").data('id'));
    if (RouterDA.selected.Name != $(this).val()) {
        RouterDA.selected.Name = $(this).val()
        updateData();
    };
});

$('body').on('keydown', '.router-name>input', function (ev) {
    if (ev.key == "Enter") {
        $(this).trigger('blur');
    }
});

$('body').on('blur', '.router-value>input', function (ev) {
    RouterDA.selected = RouterDA.list.find(e => e.Id == $(this).parents(".router-row").data('id'));
    if (RouterDA.selected.Route != $(this).val()) {
        RouterDA.selected.Route = $(this).val()
        updateData();
    };
});

$('body').on('keydown', '.router-value>input', function (ev) {
    if (ev.key == "Enter") {
        $(this).trigger('blur');
    }
});

$('body').on('click', '.delete-router', function (ev) {
    RouterDA.selected = RouterDA.list.find(e => e.Id == $(this).parent().data('id'));
    RouterDA.list.splice(RouterDA.list.indexOf(RouterDA.selected), 1);
    if (RouterDA.list.length > 0) {
        $('.router-row[data-id="' + `${$(this).parent().data('id')}` + '"]').remove();
    } else {
        RouterDA.update_listRouter();
    }
    updateData(true);
});

$('body').on('click', '.page-value', function (ev) {
    if (!$(this).parent().hasClass('header')) {
        ev.stopPropagation();
        $('.select-page-popup').css('top', $(this).offset().top - $('.list-router-container').offset().top + 36);
        $('.select-page-popup').css('width', $('.page-value').width() + 32);

        $('.select-page-popup').show();
        $('.select-page-popup').removeAttr('rid');
        $('.select-page-popup').attr('rid', $(this).parent().data('id'));
    }
});

$('body').on('click', '.select-page-popup .option-tile', function (ev) {
    RouterDA.selected = RouterDA.list.find(e => e.Id == $('.select-page-popup').attr('rid'));
    if (RouterDA.selected.PageId != $(this).data('id')) {
        RouterDA.selected.PageId = $(this).data('id');
        RouterDA.selected.PageName = $(this).data('name');
        $('.router-row[data-id="' + `${$('.select-page-popup').attr('rid')}` + '"]').replaceWith(RouterDA.create_routerRow(RouterDA.selected));
        updateData();
    }
});


// Hide popup
$('body').on('click', function (ev) {
    if ($(ev.target).is('.router-popup') || $(ev.target).has('.option-tile')) {
        $('.router-popup').hide();
    }
});