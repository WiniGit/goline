class EnumOutputType {
    static Default = 1;
    static Static = 2;
    static Storage = 3;
    static Enviroment = 4;
    static System = 0;
}
class OutputDA {
    static urlCtr = 'OutputAPI/';
    static selected;
    static list = [];
    static listSelected = [];

    // static getElementByID(id) {
    //     return OutputDA.list.find((e) => e.ID == id);
    // }

    static updateList() {
        var listOutput = list
            .filter((e) => e.APIID == RequestDA.selected?.GID && e.ProjectID == BigInt.from(ProjectDA.objOneClick.ID));
        if (listOutput.isNotEmpty) {
            listSelected = listOutput;
        } else
            listSelected = [
                {
                    Sort: 0,
                    Name: "",
                    Value: "",
                    GID: uuidv4(),
                    Type: EnumOutputType.Default,
                    APIID: RequestDA.selected?.GID,
                    ProjectID: BigInt.from(ProjectDA.objOneClick.ID),
                },
            ];
    }

    static init() {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const id = urlParams.get('pid');
        var url = OutputDA.urlCtr + 'ListItem?pid=' + id;

        if (ProjectDA.obj.ID != 0) {
            WiniIO.emitGet(null, url, EnumObj.apiOutput, EnumEvent.init);
        } else {
            emitGet(null, url, EnumObj.apiOutput, EnumEvent.init);
        }
    }

    static add(items) {
        var url = OutputDA.urlCtr + 'AddList';
        var _list = items;
        emitPort(_list, url, EnumObj.apiOutput, EnumEvent.add);
    }

    static edit(items) {
        var url = OutputDA.urlCtr + 'EditList';
        var _list = items;
        emitPort(_list, url, EnumObj.apiOutput, EnumEvent.edit);
    }

    static deleted(items) {
        var url = OutputDA.urlCtr + 'DeleteList';
        var _list = items;
        emitPort(_list, url, EnumObj.apiOutput, EnumEvent.delete);
    }

    static handleTest({ jsonData, outputItem, index }) {
        try {
            var apiInput = RequestDA.list.find((e) => e.GID == outputItem.APIID);
            if (apiInput.DataType == WEnum.field) {
                outputItem.ValueJson = jsonData;
                return outputItem.ValueJson;
            } else if (apiInput.DataType == WEnum.list) {
                if (outputItem.ParentID != null) {
                    var parent = OutputDA.listSelected.find((element) => element.GID == outputItem.ParentID);
                    if (parent.DataType == WEnum.list) outputItem.ValueJson = parent.ValueJson[index];
                    if (parent.DataType == WEnum.obj) outputItem.ValueJson = parent.ValueJson[outputItem.NameField];
                } else
                    outputItem.ValueJson = jsonData;
                return outputItem.ValueJson;
            } else {
                if (outputItem.ParentID != null) {
                    var parent = OutputDA.listSelected.find((element) => element.GID == outputItem.ParentID);
                    if (parent.DataType == WEnum.list) outputItem.ValueJson = parent.ValueJson[index][outputItem.NameField];
                    if (parent.DataType == WEnum.obj) outputItem.ValueJson = parent.ValueJson[outputItem.NameField];
                } else {
                    outputItem.ValueJson = jsonData;
                }
                return outputItem.ValueJson;
            }
        } catch (e) {
            return null;
        }
    }

    static update_listOutput() {
        let list_output =
            '<div class="output-row row header">' +
            '    <div class="row-move center text-body"></div>' +
            '    <div class="row-index center regular1 text-body">STT</div>' +
            '    <input class="output-name regular1 text-body" value="Name response" disabled />' +
            '    <input class="output-value regular1 text-body" value="Value" disabled />' +
            '    <input class="output-datatype regular1 text-body" type="text" value="Data type" placeholder="-- Data type --" readonly />' +
            '    <input class="output-type regular1 text-body" type="text" value="Output type" placeholder="-- Output type --" readonly />' +
            '    <div class="calc center regular1 text-body">Calc</div>' +
            '</div>';
        if (RequestDA.selected.outputApiItem.length == 0) {
            RequestDA.selected.outputApiItem.push(
                { GID: uuidv4(), NameField: "", Value: "", Level: 1, DataType: null, Type: EnumOutputType.Default, APIID: RequestDA.selected.GID, ParentID: 0 }
            );
            RequestDA.update_list_opening(RequestDA.selected);
            RequestDA.set_TabSelected(RequestDA.selected);
        }
        let list = RequestDA.selected.outputApiItem.filter(e => e.Level == 1);

        for (let item of list) {
            list_output += OutputDA.create_outputRow(item, list.indexOf(item) + 1, 16);
        }

        $('.list-output').html(list_output);

        // $('.setting-output-container').animate({
        //     scrollTop:
        //         $('.output-row[data-id="' + list.length + '"]').offset().top
        //         - $('.setting-output-container').offset().top
        //         + $('.setting-output-container').scrollTop()
        // }, 300);
    }
    static handle_outputCalc(cal) {
        let regex = /{([^}]+)}/g;
        if (cal) {
            let list = cal.match(regex)?.map(e => e.replace(/({|})/g, "")) ?? [];
            if (list.length > 0) {
                for (let item of list) {
                    let output = RequestDA.selected.outputApiItem.find(e => e.GID == item);
                    cal = cal.replaceAll(item, output.NameField);
                }
            }
            return cal;
        } else {
            return "";
        }
    }

    static handle_outputVal(item) {
        if (item.Calculate) {
            let regex = /{([^}]+)}/g;
            let list = item.Calculate.match(regex)?.map(e => e.replace(/({|})/g, "")) ?? [];
            let cal = '';
            if (list.length > 0) {
                for (let _item of list) {
                    var output = RequestDA.selected.outputApiItem.find(e => e.GID == _item);
                    cal = item.Calculate?.replaceAll(_item, output.Value).replaceAll(/({|})/g, "") ?? "";
                }
            }
            return eval(cal);
        }
        else {
            return `${item?.Value}` ?? "";
        }
    }

    static create_outputRow(item, index, space) {
        let output = '';
        output +=
            '<div class="output-row-container col">' +
            '    <div data-id="' + item.GID + '" class="output-row row">' +
            '        <div class="row-move center text-body"></div>' +
            '        <div class="row-index center regular1 text-body">' + index + '</div>' +
            '        <input style="padding-left: ' + space + 'px;" class="output-name regular1 text-body" value="' + `${item?.NameField ?? ""}` + '" placeholder="Name response" />' +
            '        <input class="output-value regular1 text-body" value="' + `${this.handle_outputVal(item)}` + '" placeholder="Value" />' +
            '        <input class="output-datatype regular1 text-body" type="text" value="' + `${getDataOutputDataType(item.DataType) ?? ""}` + '" placeholder="-- Data type --" readonly />' +
            '        <input class="output-type regular1 text-body" type="text" value="' + `${getDataOutputType(item.Type) ?? ""}` + '" placeholder="-- Output type --" readonly />' +
            '        <div class="calc center text-body">' +
            '            <button class="button-transparent text-primary row">' +
            '                <span><span><i class="fa-solid ' + `${item.Calculate ? "fa-edit" : "fa-plus"}` + '"></i></span>' + `${item.Calculate ? " Edit" : " New"}` + '</span>' +
            '            </button>' +
            '        </div>' +
            '        <button class="delete-output-btn box24 text-placeholder button-transparent"><i class="fa-solid fa-close fa-xs"></i></button>' +
            '    </div>' +

            '    <div data-id="' + item.GID + '" class="input-calculate regular1 text-title row">' +
            '        <input class="calc-value regular1 text-title" placeholder ="Input calculate" value = "' + OutputDA.handle_outputCalc(item?.Calculate) + '" /> ' +
            '    </div>' +
            '</div>';

        let list = RequestDA.selected.outputApiItem.filter((e) => e.ParentID != null && e.ParentID == item.GID);
        if (list?.length > 0) {
            for (let i = 0; i < list.length; i++) {
                output += OutputDA.create_outputRow(list[i], `${index}.${i + 1}`, space + 6);
            }
        }
        return output;
    }

    static update_selectOutput_Calculate() {
        let list_output = '';
        let list = RequestDA.selected.outputApiItem;

        for (let item of list) {
            list_output += '<div data-id="' + item.GID + '" class="option-tile regular1 text-white disable-text-select">' + item.NameField + '</div>';
        }

        $('.select-output-calculate').html(list_output);
    }

    // static calculate_value(calculate) {
    //     // debugger
    //     let calculate_value = '';
    //     let list = calculate?.split(" ").filter(e => e.length > 0);
    //     if (list?.length > 0) {
    //         for (let i = 0; i < list.length; i++) {
    //             if (list[i].length > 0)
    //                 if (list[i].includes("{") && list[i].includes("}")) {
    //                     let output = RequestDA.selected.outputApiItem.find(e => e.GID == list[i].replace('{', '').replace('}', ''));
    //                     if (output) {
    //                         calculate_value += ` ${output?.Value ?? ""} `;
    //                     } else {
    //                         calculate_value += ` ${list[i]} `;
    //                     }
    //                 } else {
    //                     calculate_value += ` ${list[i]} `;
    //                 }
    //         }
    //     }
    //     try {
    //         return eval(calculate_value);
    //     } catch (error) {
    //         return calculate_value;
    //     }
    // }
}
// value="' + `${calculate ?? ""}` + '"

