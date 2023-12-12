$('.left-view').load('../Layout/DesignView/LeftView/left-view.html', function (ev) {
    $(`.resize-pages-line`).on("mousedown", function (ev) {
        resizingPages = true;
    });
    // chuyển tab && tab view
    $(`body`).on("click", ".list-tab>*", function (ev) {
        $(`.list-tab>*`).removeClass("selected");
        $(this).addClass("selected");

        tabSelected = $(this).data("index");

        changeTab();
    });
    // search
    $(`body`).on("click", ".search-button", function (ev) {
        $(`.left-view`).addClass("searching");

        changeTab(0);
    });
    $(`body`).on("click", ".search-container .close-search", function (ev) {
        $(`.left-view`).removeClass("searching");

        changeTab();
    });

    // show list pages
    $(`body`).on(`click`, `.page-selected-container .action-button`, function (ev) {
        $(this).children("i").toggleClass("fa-chevron-down fa-chevron-up");

        $('.page-selected>*').removeClass("show");

        if ($(this).children("i").hasClass("fa-chevron-down")) {
            $('.page-selected>*:nth-child(1)').addClass("show");
            $('.list-page-container').css({ "display": "flex" });
            $('.left-view .tabbar-view>*[class*="-view"]').css({ "height": `calc(100% - ${$('.list-page-container').height()}px)` });
        } else {
            $('.page-selected>*:nth-child(2)').addClass("show");
            $('.list-page-container').css({ "display": "none" });
            $('.left-view .tabbar-view>*[class*="-view"]').css({ "height": "100%" })
        }
    });

    const changeTab = (index) => {
        $(`.tabbar-view>*`).removeClass("selected");
        $(`.tabbar-view>*[data-index=${index != undefined ? index : tabSelected}]`).addClass("selected");

        // thêm function cập nhật UI vào đây
    }

    const listModule = [
        { id: 0, name: "module name 1" },
        { id: 0, name: "module name 2" },
        { id: 0, name: "module name 3" },
        { id: 0, name: "module name 4" },
    ];

    $('body').on('click', `.page-card`, function (ev) {
        $(`.page-card`).removeClass("selected");
        $(this).addClass("selected");

        // function update data page
    });

    const listBaseItem = [
        { id: 0, name: "layer name 0", listChild: [] },
        {
            id: 1, name: "layer name 1",
            listChild: [
                { id: 11, name: "layer name 21" },
                {
                    id: 12, name: "layer name 22",
                    listChild: [
                        { id: 121, name: "layer name 221" },
                        { id: 121, name: "layer name 221" },
                        { id: 121, name: "layer name 221" },
                        { id: 121, name: "layer name 221" },
                        { id: 121, name: "layer name 221" },
                        { id: 121, name: "layer name 221" },
                    ]
                },
                { id: 122, name: "layer name 122" },
                { id: 122, name: "layer name 122" },
                { id: 122, name: "layer name 122" },
                { id: 122, name: "layer name 122" },
                { id: 122, name: "layer name 122" },
                { id: 122, name: "layer name 122" },
                { id: 122, name: "layer name 122" },
            ]
        },
        {
            id: 2, name: "layer name 2",
            listChild: [
                { id: 21, name: "layer name aaaaaaaaa" },
                { id: 22, name: "layer name aaaaaaaaa" },
                { id: 23, name: "layer name aaaaaaaaa" },
                { id: 24, name: "layer name aaaaaaaaa" },
                { id: 25, name: "layer name aaaaaaaaa" },
                { id: 25, name: "layer name aaaaaaaaa" },
                { id: 25, name: "layer name aaaaaaaaa" },
                { id: 25, name: "layer name aaaaaaaaa" },
                { id: 25, name: "layer name aaaaaaaaa" },
                { id: 25, name: "layer name aaaaaaaaa" },
                { id: 25, name: "layer name aaaaaaaaa" },
                { id: 25, name: "layer name aaaaaaaaa" },
                { id: 25, name: "layer name aaaaaaaaa" },
                { id: 25, name: "layer name aaaaaaaaa" },
            ]
        },
        {
            id: 3,
            name: "layer name 111111111",
            listChild: [
                { id: 31, name: "layer name aaaaaaaaa" },
                { id: 32, name: "layer name aaaaaaaaa" },
                { id: 33, name: "layer name aaaaaaaaa" },
                { id: 34, name: "layer name aaaaaaaaa" },
            ]
        },
        {
            id: 4,
            name: "layer name 111111111",
            listChild: [
                { id: 41, name: "layer name aaaaaaaaaaaaaaaaaaaaaaa aaaaaaaaaaa" }
            ]
        },
        {
            id: 5,
            name: "layer name 111111111",
            listChild: [
                { id: 51, name: "layer name aaaaaaaaaaaaaaaaaaaaaaa aaaaaaaaaaa" }
            ]
        },
    ];

    const createLayerCard = ({ item, space }) => {
        let layerCard = `
            <div data-id=${item.id} class="layers-card row" style="padding-left: ${space}px">
                <button data-id=${item.id} class="show-children show">
                    ${item.listChild?.length ? '<i class="fa-solid fa-caret-right fa-xs text-label"></i>' : ""}
                </button>
                <button class="layer-type-image">
                    <i class="fa-solid fa-star fa-xs text-label"></i>
                </button>
                <input class="regular11 medium1" value="${item.name}" placeholder=null readonly />
                <button class="button-lock">
                    <i class="fa-solid fa-lock-open fa-xs text-label"></i>
                </button>
            </div>`;

        return layerCard;
    }

    // tạo một group layer
    const createGroupCard = (item, space) => {
        let groupCard = '';
        groupCard += createLayerCard({ item: item, space: space });

        if (item.listChild?.length > 0) {
            let groupChild = `<div data-parent=${item.id} class="group-layer-child col">`;
            for (let i of item.listChild) {
                groupChild += createGroupCard(i, space + 24)
            }
            groupChild += '</div>';

            groupCard += groupChild;
        }

        return groupCard;
    }

    let layerHTML = '';
    for (let item of listBaseItem) {
        layerHTML += createGroupCard(item, 0);
    }

    // gán html vào layer
    $(`.layers-view`).html(layerHTML);

    // ẩn hiện các group layer child
    $(`body`).on("click", ".show-children.show", function (ev) {
        $(this).children("i").toggleClass("fa-caret-down fa-caret-right");

        if ($(this).children("i").hasClass("fa-caret-down")) {
            $(`.group-layer-child[data-parent=${$(this).data("id")}]`).css({ "display": "flex" });
        } else {
            $(`.group-layer-child[data-parent=${$(this).data("id")}]`).css({ "display": "none" });
        }
    });

    $('body').on('click', `.layers-card`, function (ev) {
        $(`.layers-card`).removeClass("selected");
        $(this).addClass("selected");

        // function update data page
    });

    $('body').on('click', `.layers-card .button-lock`, function (ev) {
        ev.stopPropagation();
        $(this).children("i").toggleClass("fa-lock fa-lock-open");
        if ($(this).children("i").hasClass("fa-lock")) {
            $(this).parent().addClass("locked");
        } else {
            $(this).parent().removeClass("locked");
        }

        // function lock/ unlock item
    });
});