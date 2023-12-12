var tabSelected = 1;
var resizingPages = false;
var resizing = false;


// resize view
$(`body`).on("mousemove", function (ev) {
    if (resizing) {
        $(`.left-view-container`).css({ "width": ev.pageX })
    }
    else if (resizingPages) {
        $(`.list-page-container`).css({ "height": ev.pageY - 32 })

        $('.left-view .tabbar-view>*[class*="-view"]').css({ "height": `calc(100% -${$('.list-page-container').width()}px)` });
    }
});

$(`body`).on("mouseup", function (ev) {
    resizing = false;
    resizingPages = false;
});

$(`.resize-line`).on("mousedown", function (ev) {
    resizing = true;
});

