class RouterDA {
    static selected;
    static list = [];
    static listPage = [];
    static urlCrl = "Router/"

    static selected;

    static getAllPage() {
        let url = this.urlCrl + 'GetAllPage?pid=' + pid;
        emitGet(null, url, EnumObj.router, EnumEvent.get);
    }

    static update_listRouter() {
        if (RouterDA.list.length == 0) {
            RouterDA.list.push({ 'Id': 0, 'Name': 'untitle', 'Route': '/', 'PageId': null, 'Sort': 0, 'Save': false });
        }
        let list_router = '';
        for (let item of RouterDA.list) list_router += this.create_routerRow(item);
        list_router += '<div class="router-popup select-page-popup" >' + RouterDA.update_listPage() + '</div >';
        $('.list-router-container').html(list_router);
    }

    static create_routerRow(item) {
        let router_row =
            '<div data-id="' + `${item.Id}` + '" class="router-row row">' +
            '    <div class="center about row-index">' + `${RouterDA.list.indexOf(item) + 1}` + '</div>' +
            '    <div class="row row-name">' + '<input type="text" placeholder="Router name" value="' + `${item.Name}` + '">' + '</div>' +
            '    <div class="row router-value">' + '<input type="text" placeholder="Router" value="' + `${item.Route}` + '">' + '</div>' +
            '    <div class="row page-value">' +
            '        <input type="text" placeholder="Select page" readonly value="' + `${RouterDA.listPage.find(e => e.GID == item.PageId)?.Name ?? ""}` + '">' +
            '    </div>' +
            '    <button class="box24 delete-router button-transparent text-body"><i class="fa-solid fa-close fa-sm"></i></button>' +
            '</div>';
        return router_row;
    }

    static update_listPage() {
        let list_page = '<div class="option-tile">None</div>';
        for (let item of RouterDA.listPage) {
            list_page += '<div data-id="' + `${item.GID}` + '" data-name="' + `${Ultis.toSlug(item.Name)}` + '" class="option-tile">' + `${item.Name}` + '</div>';
        }
        return list_page;
    }
}