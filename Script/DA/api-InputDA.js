
class InputDA {
    static urlCtr = 'InputAPI/';
    static list = [];
    static listParam = [];
    static listHeader = [];
    static listBody = [];
    static selected_id;
    static selected_type = EnumInputType.Param;

    static init() {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const id = urlParams.get('pid');
        var url = InputDA.urlCtr + 'ListItem?pid=' + id;

        if (ProjectDA.obj.ID != 0) {
            WiniIO.emitGet(null, url, EnumObj.apiInput, EnumEvent.init);
        } else {
            emitGet(null, url, EnumObj.apiInput, EnumEvent.init);
        }
    }

    static add(items) {
        var url = InputDA.urlCtr + 'AddList';
        var _list = items;
        emitPort(_list, url, EnumObj.apiInput, EnumEvent.add);
    }

    static edit(items) {
        var url = InputDA.urlCtr + 'EditList';
        var _list = items;
        emitPort(_list, url, EnumObj.apiInput, EnumEvent.edit);
    }

    static deleted(items) {
        var url = InputDA.urlCtr + 'DeleteList';
        var _list = items;
        emitPort(_list, url, EnumObj.apiInput, EnumEvent.delete);
    }

    static update_listInput() {
        let list_input =
            '<div class="input-row row header">' +
            '   <div class="row-move center text-body"></div>' +
            '   <div class="row-index center regular1 text-body">STT</div>' +
            '   <input class="input-name regular1 text-body" value="Key" disabled />' +
            '   <input class="input-value regular1 text-body" value="Value" disabled />' +
            '   <input class="data-input-type regular1 text-body" value="Data Type" disabled />' +
            '</div>';
        if (RequestDA.selected.inputApiItem.filter(e => e.Type == InputDA.selected_type).length == 0) {
            RequestDA.selected.inputApiItem.push(
                { GID: uuidv4(), Name: "", Value: "", DataType: InputType.String, Type: InputDA.selected_type, APIID: RequestDA.selected.GID, OutputID: null }
            );
            RequestDA.update_list_opening(RequestDA.selected);
            RequestDA.set_TabSelected(RequestDA.selected);
        }
        let list = RequestDA.selected.inputApiItem.filter(e => e.Type == InputDA.selected_type);

        for (let item of list) {
            list_input +=
                '<div data-id="' + item.GID + '" class="input-row row">' +
                '    <div class="row-move center text-body"></div>' +
                '    <div class="row-index center regular1 text-body">' + `${list.indexOf(item) + 1}` + '</div>' +
                '    <input class="input-name regular1 text-body" value="' + `${item.Name ?? ""}` + '" placeholder="Key" />' +
                '    <input class="input-value regular1 text-body" value="' + `${item.Value ?? ""}` + '" placeholder="Value" />' +
                '    <input class="data-input-type regular1 text-body" value="' + `${InputType.get_inputType(item.DataType)}` + '" placeholder="Data type"  readonly/>' +
                '    <button class="delete-input-btn box24 text-placeholder button-transparent"><i class="fa-solid fa-close fa-xs"></i></button>' +
                '</div>';
        }

        $('.tabbar-view').html(list_input);
    }
}

class InputType {
    static String = 1;
    static Int = 2;
    static Double = 3;
    static Boolean = 4;
    static Date = 5;
    static File = 6;
    static dynamic = 7;

    static get_inputType(type) {
        switch (type) {
            case this.String:
                return "String";
            case this.Int:
                return "Int";
            case this.Double:
                return "Double";
            case this.Boolean:
                return "Boolean";
            case this.Date:
                return "Date time";
            case this.File:
                return "File";
            case this.dynamic:
                return "dynamic";
            default:
                return "String";
        }
    }
}