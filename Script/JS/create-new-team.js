$('.appbar').load('/View/title-bar.html', function () {
    TitleBarDA.initDataStorage();
});

$('body').on('input', '.new-team-name', function () {
    if ($(this).val().length > 0) {
        $('.button-create-new-team').addClass('active');
    } else {
        $('.button-create-new-team').removeClass('active');
    }
});

$('body').on('click', '.button-create-new-team', function () {
    if ($(this).hasClass('active')) { 
        TeamDA.create({"Name": $('.new-team-name').val()});
        
    }
});