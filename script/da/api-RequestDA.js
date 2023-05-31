class ApiMethod {
    static GET = 0;
    static POST = 1;
}

class EnumInputType {
    static Param = 1;
    static Header = 2;
    static Body = 3;
}
class DataTypeInput {
    static bool = 2;
    static int = 3;
    static string = 5;
    static double = 6;
    static dynamic = 8;
    static file = 9;
}

class RequestDA {
    static selected;
    static element_selected;

    static list = [];
    static list_opening = [];

    static urlCtr = "WApi/";

    static getElementByID(id) {
        return CollectionDA.selected.listApi.find((e) => e.GID == id);
    }

    static getDataByID(apiID) {
        var url = RequestDA.urlCtr + 'GetByID?id=' + apiID;
        if (ProjectDA.obj.ID != 0) {
            WiniIO.emitGet(null, url, EnumObj.request, EnumEvent.getByID);
        } else {
            emitGet(null, url, EnumObj.request, EnumEvent.getByID);
        }
    }

    static init() {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const id = urlParams.get('id');
        var url = RequestDA.urlCtr + 'ListItem?pid=' + id;
        if (ProjectDA.obj.ID != 0) {
            WiniIO.emitGet(null, url, EnumObj.request, EnumEvent.init);
        } else {
            emitGet(null, url, EnumObj.request, EnumEvent.init);
        }
    }

    static Save(obj) {
        var url = RequestDA.urlCtr + 'Save';
        emitPort(obj, url, EnumObj.request, EnumEvent.Save);
    }

    static add(item) {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const id = urlParams.get('pid');
        var url = RequestDA.urlCtr + 'Add?pid=' + id;
        emitPort(item, url, EnumObj.request, EnumEvent.add);
    }

    static edit(item) {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const id = urlParams.get('pid');
        var url = RequestDA.urlCtr + 'Edit?pid=' + id;
        emitPort(item, url, EnumObj.request, EnumEvent.edit);
    }

    static delete(id) {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const pid = urlParams.get('pid');
        var url = RequestDA.urlCtr + 'Delete?pid=' + pid;
        emitPort({ 'ID': id }, url, EnumObj.request, EnumEvent.delete);
    }

    static set_ListOpening() {
        Ultis.setStorage("api--list-opening", JSON.stringify(RequestDA.list_opening));
        RequestDA.update_UI_ListRequestTab();
    }

    static get_ListOpening() {
        let list = JSON.parse(Ultis.getStorage("api--list-opening"));
        return list ?? [];
    }

    static set_TabSelected(item) {
        Ultis.setStorage("api--selected-request", JSON.stringify(item));
        RequestDA.set_selected(item);
        if (item == null) {
            $('.no-request').css('display', 'flex');
            $('.content-container').css('display', 'none');
        }
    }

    static get_TabSelected() {
        let item = JSON.parse(Ultis.getStorage("api--selected-request"));
        return item;
    }

    static update_UI_ListRequestTile(list) {
        let list_request = '';
        if (list != null) {
            for (let item of list) {
                list_request +=
                    '<div data-id="' + item.GID + '" data-collectionid="' + item.CollectionID + '" class="request-tile option-tile row">' +
                    '    <div class="request-method semibold11 center ' + `${item.Type == ApiMethod.POST ? "text-secondary1" : "text-secondary2"} ` + '">' + `${item.Type == ApiMethod.POST ? "POST" : "GET"} ` + '</div>' +
                    '    <input class="regular1 text-title" type="text" value="' + item.Name + '" disabled>' +
                    '</div>';
            }
        }
        return list_request;
    }
    static update_UI_ListRequestTab() {
        let list = RequestDA.list_opening.filter(e => e.ProjectID == pid);
        let list_request = '';
        if (list != null) {
            for (let item of list) {
                list_request +=
                    '<div data-id="' + item.GID + '" data-collectionid="' + item.CollectionID + '" class="request-tab row">' +
                    '    <div class="request-method semibold11 center  ' + `${item.Type == ApiMethod.POST ? "text-secondary1" : "text-secondary2"} ` + '">' + `${item.Type == ApiMethod.POST ? "POST" : "GET"} ` + '</div>' +
                    '    <span class="request-name regular11 text-title overflow-elipstic">' + item.Name + '</span>' +
                    '    <button class="close-btn box24 button-transparent"><i class="fa-solid fa-close fa-xs text-body"></i></button>' +
                    '</div>';
            }
        }
        $('.opening-tab-slider').html(list_request);
    }

    static set_selected(item) {
        RequestDA.selected = item;
        $('.request-tile, .request-tab, .collection-tile').removeClass('selected');

        if (item != null) {
            $('.request-tile[data-id="' + item.GID + '"]').addClass('selected');
            $('.request-tab[data-id="' + item.GID + '"]').addClass('selected');

            $('.request-tab').removeClass('no-border-right');
            $('.request-tab[data-id="' + item.GID + '"]').prev().addClass('no-border-right');

            $('.no-request').css('display', 'none');
            $('.content-container').css('display', 'flex');

            $('.collection-slide-bar').animate({
                scrollTop: $('.request-tile[data-id="' + item.GID + '"]').offset().top - $('.collection-slide-bar').offset().top + $('.collection-slide-bar').scrollTop()
            }, 300);

            $('.opening-tab-slider').animate({
                scrollLeft: $('.request-tab[data-id="' + item.GID + '"]').offset().left - $('.opening-tab-slider').offset().left + $('.opening-tab-slider').scrollLeft()
            }, 300);

            update_setting(RequestDA.selected);
            InputDA.update_listInput();
            OutputDA.update_listOutput();
            OutputDA.update_selectOutput_Calculate();
        } else {
            RequestDA.selected = null;
            // CollectionDA.set_selected(CollectionDA.selected.ID);
        }
        $('.response-code').text('');
        $('.response-code').hide();
        $('.time-process>.time').text('');
        $('.time-process').hide();


    }

    static update_list_opening(new_item) {
        let item = RequestDA.list_opening.find(e => e.GID == new_item.GID);
        let index = RequestDA.list_opening.indexOf(item);
        RequestDA.list_opening[index] = new_item;
        RequestDA.set_ListOpening();
    }
}


function getDataTypeString(type) {
    switch (type) {
        case 2:
            return 'bool';
        case 3:
            return 'int';
        case 5:
            return 'string';
        case 6:
            return 'double';
        case 8:
            return 'dynamic';
        default:
            return '';
    }
}
function getDataOutputType(type) {
    switch (type) {
        case 1:
            return 'Default';
        case 2:
            return 'Static';
        case 3:
            return 'Store';
        case 4:
            return 'Enviroment';
        default:
            return '';
    }
}
function getDataOutputDataType(type) {
    switch (type) {
        case 1:
            return 'Field';
        case 2:
            return 'List';
        case 3:
            return 'Obj';
    }
}