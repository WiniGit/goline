class ProtoTypeDA {
    static click = 1;
    static dbclick = 2;
    static hover = 3;
    static get_actionTitle(action) {
        switch (action) {
            case this.click:
                return "Click"
            case this.dbclick:
                return "Double click"
            case this.hover:
                return "Hover"
            default:
                return "Click"
        }
    }
    static data_id;
}

$('.prototype_setting_view').load('/View/design-prototype.html', function (ev) { });

function update_UI_prototypeView() {
    update_UI_prorotypeContainer();
    update_UI_routerContainer();

    if (selected_list.length == 1) {
        $('.device-container').css('display', 'none');
    }
    else {
        $('.device-container').css('display', 'flex');
    }
}

function update_UI_prorotypeContainer() {
    if (selected_list.length == 1) {
        $('.prototype-container').css('display', 'flex');
        if (selected_list[0].ProtoType != null) {
            $('.add-interaction').css('visibility', 'hidden');
            $('.interaction-tile, .setting-data').css('display', 'flex');

            update_dataUI_interactionTile();
        } else {
            $('.add-interaction').css('visibility', 'visible');
            $('.interaction-tile, .setting-data').css('display', 'none');
        }
    }
    else {
        $('.prototype-container').css('display', 'none');
    }
}

function update_UI_routerContainer() {
    if (selected_list.length == 1) {
        $('.router-container').css('display', 'flex');
        let router_item = selected_list[0].JsonEventItem?.find(e => e.Name == "Router");
        if (router_item != null && router_item.RouterID != null) {
            $('.router-container .router-name, .router-container .router-value, .list-route-field, .param-container').css('display', 'flex');
            update_dataUI_Router();
        }
        else {
            $('.router-container .router-name, .router-container .router-value, .list-route-field, .param-container').css('display', 'none');
        }
    }
    else {
        $('.router-container').css('display', 'none');
    }
}

function get_name_selectedData(item) {
    if (item) {
        switch (item.DataType) {
            case 1: // input
                let input = InputDA.list.find(e => e.GID == item.Value);
                return input.Name;
            case 2: // output
                let output = OutputDA.list.find(e => e.GID == item.Value);
                return output.Name;
            case 3: // wbase
                let wbase = wbase_list.find(e => e.GID == item.Value);
                return wbase.Name;
            default:
                return item.Value == "" ? "" : "None";
        }
    } else {
        return item.Value == "" ? "" : "None";
    }
}

function create_UI_dataOutputRow(item, space) {
    let output =
        '<div data-type="2" data-value="' + item.GID + '" class="data-option output-data text-white regular11">' +
        '<span style="padding-left:' + space + 'px"></span>' + item.Name +
        '</div>';
    let _list = OutputDA.list.filter(el => el.ParentID == item.GID);
    if (_list.length > 0) {
        for (let _item of _list) {
            output += create_UI_dataOutputRow(_item, space + 12);
        }
    }
    return output;
}

function update_UI_selectDataPopup() {
    let list_input = '';
    let list_output = '';
    let list_wbaseItem = '';

    let pageID = selected_list[0].Level === 1 ? selected_list[0].GID : selected_list[0].ListID.split(",")[1];
    let listWBase = wbase_list.filter(e => e.ListID.includes(pageID) || e.GID == pageID);
    let listApi = [];
    for (let wbase of listWBase) {
        if (wbase.ApiID && !listApi.includes(wbase.ApiID)) {
            listApi.push(wbase.ApiID);
        }

        list_wbaseItem += '<div data-type="3" data-value="' + wbase.GID + '" class="data-option output-data text-white regular11">' + wbase.Name + '</div>';
    }
    if (listApi.length > 0) {
        for (let api_id of listApi) {
            let request = RequestDA.list.find(e => e.GID == api_id);
            let collection = CollectionDA.list.find(e => e.ID == request.CollectionID);

            let list_inputItem = InputDA.list.filter(e => e.APIID == api_id && e.Name?.length > 0);
            if (list_inputItem.length > 0) {
                list_input += '<div class="request-name text-white regular0">' + `${collection.Name}/ ${request.Name}` + '</div>';
                for (let item of list_inputItem) {
                    list_input += '<div data-type="1" data-value="' + item.GID + '" class="data-option input-data text-white regular11">' + item.Name + '</div>'
                }
            }

            let list_outputItem = OutputDA.list.filter(e => e.APIID == api_id && e.Name?.length > 0 && e.ParentID == null);
            if (list_outputItem.length > 0) {
                list_output += '<div class="request-name text-white regular0">' + `${collection.Name}/ ${request.Name}` + '</div>';
                for (let item of list_outputItem) {
                    list_output += create_UI_dataOutputRow(item, 0);
                }
            }
        }
    }

    $('.list-input-item').html(list_input);
    $('.list-output-item').html(list_output);
    $('.list-wbase-item').html(list_wbaseItem);
}

{ // Prototype
    function create_UI_selectNextPage() {
        let list_option = '<div data-id="" class="page-option regular11 select-option row text-white">None</div>';
        let list_page = wbase_list.filter(e =>
            e.Level == 1
            && (e.CateID == EnumCate.tool_frame || e.CateID == EnumCate.form)
            // && e.GID != selected_list[0].GID
            && !selected_list[0].ListID.includes(e.GID)
        );
        if (list_page.length > 0) {
            for (let item of list_page) {
                list_option +=
                    '<div data-id="' + item.GID + '" class="page-option regular11 select-option row text-white">' + item.Name + '</div>';
            }
        }
        $('.selecte-next-page-popup').html(list_option);
    }

    function update_dataUI_interactionTile() {
        let endPage = wbase_list.find(e => e.GID == selected_list[0].PrototypeID);
        $('.content-container .page-end, .select-next-page>span').text(`${endPage?.Name ?? "Not selected"}`);
        $('.content-container .event-handle, .select-action>span').text(`${ProtoTypeDA.get_actionTitle(selected_list[0].ProtoType)}`);
    }
    // show popup detail
    $('body').on('click', '.interaction-tile .content-container', function (ev) {
        ev.stopPropagation();
        $('.prototype-popup').hide();

        let animation_item = selected_list[0].JsonEventItem.find(e => e.Name == "Animation");
        $(".selected-animation").text(EnumAnimation.get_animationName(animation_item.Data.Animation));
        $(".selected-timing").text(EnumTiming.get_timingName(animation_item.Data.Timing));
        $('.direction-option').removeClass("selected");
        if (animation_item.Data.Direction) {
            $('.direction-option[data-direction="' + animation_item.Data.Direction + '"]').addClass("selected");
        } else {
            $('.direction-option.left').addClass("selected");
        }
        $(".animate-time").val(animation_item.Data?.Duration ?? "1s");

        $('.setting-interaction-popup').css('top', $(this).offset().top - 88);
        $('.setting-interaction-popup').css('display', 'flex');
    });
    // delete prototype
    $('body').on('click', '.interaction-tile .delete-prototype', function (ev) {
        ev.stopPropagation();
        selected_list[0].ProtoType = null;
        selected_list[0].PrototypeID = null;
        // let prototype_item = selected_list[0].JsonEventItem.find(e => e.Name == "Prototype");
        // selected_list[0].JsonEventItem.splice(selected_list[0].JsonEventItem.indexOf(prototype_item), 1);
        selected_list[0].JsonEventItem = selected_list[0].JsonEventItem.filter(e => e.Name != "Prototype" && e.Name != "Animation");
        WBaseDA.edit(selected_list, EnumObj.wBaseAttribute);
        update_UI_prorotypeContainer();
                wdraw();
    });
    // add prototype
    $('body').on('click', '.setting-interactions .add-interaction', function (ev) {
        ev.stopPropagation();
        selected_list[0].ProtoType = '1';
        selected_list[0].PrototypeID = '';
        selected_list[0].JsonEventItem.push({ Name: "Prototype", Data: [] }, { Name: "Animation", Data: {} });
        WBaseDA.edit(selected_list, EnumObj.wBaseAttribute);
        update_UI_prorotypeContainer();
                wdraw();
    });
    // show popup select action
    $('body').on('click', '.select-action', function (ev) {
        ev.stopPropagation();
        $('.prototype-popup-select').css('display', 'none');

        $('.selecte-action-popup').css('top', 28);
        $('.selecte-action-popup').css('width', 196);
        $('.selecte-action-popup').css('display', 'flex');
        // update_UI_prototypeData();
    });
    $('body').on('click', '.selecte-action-popup .action-option', function (ev) {
        ev.stopPropagation();
        selected_list[0].ProtoType = $(this).data('index');
        WBaseDA.edit(selected_list, EnumObj.wbase);
        update_dataUI_interactionTile();
                wdraw();
        $('.prototype-popup-select').css('display', 'none');
    });
    // show popup select event
    $('body').on('click', '.select-event', function (ev) {
        ev.stopPropagation();
        $('.prototype-popup-select').css('display', 'none');

        $('.selecte-event-popup').css('top', 28);
        $('.selecte-event-popup').css('left', 0);
        $('.selecte-event-popup').css('width', 140);
        $('.selecte-event-popup').css('display', 'flex');
        // update_UI_prototypeData();
    });
    // show popup select next page
    $('body').on('click', '.select-next-page', function (ev) {
        ev.stopPropagation();
        $('.prototype-popup-select').css('display', 'none');
        create_UI_selectNextPage();
        $('.selecte-next-page-popup').css('top', 28);
        $('.selecte-next-page-popup').css('width', 140);
        $('.selecte-next-page-popup').css('display', 'flex');
        // update_UI_prototypeData();
    });
    $('body').on('click', '.selecte-next-page-popup .page-option', function (ev) {
        ev.stopPropagation();
        selected_list[0].PrototypeID = $(this).data('id');
        WBaseDA.edit(selected_list, EnumObj.wbase);
        update_dataUI_interactionTile();
                wdraw();
        $('.prototype-popup-select').hide();
    });
    // show popup setting data
    $('body').on('click', '.show-table-data', function (ev) {
        ev.stopPropagation();
        $('.prototype-popup').hide();
        $('.setting-data-popup').css('top', $(this).offset().top - 88);
        update_UI_prototypeData();
    });
    // 
    function update_UI_prototypeData() {
        let list_row = '';
        let prototype_data = selected_list[0].JsonEventItem.find(e => e.Name == 'Prototype');
        if (prototype_data.Data.length == 0) {
            prototype_data.Data.push({ ID: 0, Key: "", Value: "", DataType: null });
        }
        for (let item of prototype_data.Data) {
            list_row +=
                '<div data-index="' + `${prototype_data.Data.indexOf(item)}` + '" data-id="' + `${item.ID}` + '" class="table-row row">' +
                '    <div class="row-index regular11 center">' + `${prototype_data.Data.indexOf(item) + 1}` + '</div>' +
                '    <div class="row-key">' +
                '        <input value="' + item.Key + '" class="regular11" type="text" placeholder="Add key" />' +
                '    </div>' +
                '    <div class="row-value">' +
                '        <input value="' + `${get_name_selectedData(item)}` + '" class="regular11" type="text" placeholder="Select value" readonly />' +
                '    </div>' +
                '    <button class="delete-row box32"><i class="fa-solid fa-minus fa-sm text-subtitle"></i></button>' +
                '</div>';
        }
        $('.setting-data-popup .data-table').html(list_row);

        $('.setting-data-popup').css('display', 'flex');
    }

    $('body').on('click', '.setting-data-popup .add-row', function (ev) {
        ev.stopPropagation();
        let prototype_data = selected_list[0].JsonEventItem.find(e => e.Name == 'Prototype');
        prototype_data.Data.push({ ID: prototype_data.Data.length, Key: "", Value: "", DataType: null });
        update_UI_prototypeData();
        WBaseDA.edit(selected_list, EnumObj.attribute);
    });
    $('body').on('click', '.setting-data-popup .delete-row', function (ev) {
        ev.stopPropagation();
        let prototype_data = selected_list[0].JsonEventItem.find(e => e.Name == 'Prototype');
        prototype_data.Data.splice($(this).parents('.table-row').data('index'), 1);
        update_UI_prototypeData();
        WBaseDA.edit(selected_list, EnumObj.attribute);
    });

    $('body').on('blur', '.setting-data-popup .table-row .row-key input', function (ev) {
        let prototype_data = selected_list[0].JsonEventItem.find(e => e.Name == 'Prototype');
        let update_item = prototype_data.Data.find(e => e.ID == $(this).parents('.table-row').data('id'));
        if (update_item.Key != $(this).val()) {
            update_item.Key = $(this).val();
        }
        WBaseDA.edit(selected_list, EnumObj.attribute);
    });

    $('body').on('keydown', '.setting-data-popup .table-row .row-key input', function (ev) {
        if (ev.key == "Enter") {
            $(this).trigger('blur');
        }
    });

    $('body').on('click', '.setting-data-popup .table-row .row-value', function (ev) {
        ev.stopPropagation();
        $('.select-data-popup').css('top', this.getBoundingClientRect().top - 56);
        $('.select-data-popup').css('right', $('body').width() - this.getBoundingClientRect().right);
        update_UI_selectDataPopup();
        ProtoTypeDA.data_id = $(this).parent().data('id');
        $('.select-data-popup').attr('setting-type', 'prototype-data');
        $('.select-data-popup').css('display', 'flex');
    });
}

{ // router
    function update_dataUI_Router() {
        let router_item = selected_list[0].JsonEventItem.find(e => e.Name == "Router");
        let selected_router = JSON.parse(ProjectDA.obj.RouterJson).find(e => e.Id == router_item.RouterID)
        $('.router-name').text(`${selected_router.Name}`);
        $('.router-value').text(`${selected_router.Route}`);

        update_UI_routerField(router_item);
    }

    function update_UI_selectRouter(search_value) {
        if (search_value == null) search_value = '';

        let list_router =
            '<div class="router-tile col">' +
            '    <span class="row semibold11 text-subtitle">None</span>' +
            '</div>';

        let list = JSON.parse(ProjectDA.obj.RouterJson).filter(e => e.Name.includes(search_value) || e.Route.includes(search_value));
        if (list.length > 0) {
            for (let item of list) {
                list_router +=
                    '<div data-id=' + item.Id + ' class="router-tile col">' +
                    '    <span class="row semibold0 text-subtitle">' + item.Name + '</span>' +
                    '    <span class="row regular11 text-title">' + item.Route + '</span>' +
                    '</div>';
            }
        }
        $('.list-router').html(list_router);
    }

    function update_UI_routerField(router_item) {
        let list_routerField = '';
        if (router_item.ListName.length > 0) {
            for (let item of router_item.ListName) {
                list_routerField +=
                    '<li data-id="' + item.ID + '" class="block-tile route-field row">' +
                    '    <span class="field-key regular11">' + item.Key + '</span>' +
                    '    <div class="field-value regular11 text-disable ' + `${item.Value?.length > 0 ? "active" : ""}` + '" >' +
                    '        <span class="value">' + get_name_selectedData(item) + '</span>' +
                    '        <span><i class="fa-solid fa-chevron-down fa-xs"></i></span>' +
                    '    </div>' +
                    '</li>';
            }
        }
        $('.list-route-field').html(list_routerField);
    }

    $('body').on('click', '.route-field .field-value', function (ev) {
        ev.stopPropagation();
        $('.select-data-popup').css('top', this.getBoundingClientRect().top - 64);
        $('.select-data-popup').css('right', $('body').width() - this.getBoundingClientRect().right);
        update_UI_selectDataPopup();
        ProtoTypeDA.data_id = $(this).parent().data('id');
        $('.select-data-popup').attr('setting-type', 'router-field');
        $('.select-data-popup').css('display', 'flex');
    });

    $('body').on('click', '.show-select-router', function (ev) {
        ev.stopPropagation();
        $('.prototype-popup').hide();

        update_UI_selectRouter();
        $('.select-router-popup').css('top', $(this).offset().top - 88);
        $('.select-router-popup').css('display', 'flex');
    });

    function get_listNameField(name) {
        let regex = /{([^}]+)}/g;
        let list = name.match(regex)?.map(e => e.replace(/({|})/g, "")) ?? [];
        let _list = [];
        list.forEach(e => {
            if (!_list.includes(e)) _list.push(e);
        });
        return _list;
    }

    $('body').on('click', '.select-router-popup .router-tile', function (ev) {
        let router = RouterDA.list.find(e => e.Id == $(this).data('id'));
        let event_item = selected_list[0].JsonEventItem?.find(e => e.Name == "Router");
        if (router) {
            if (event_item) {
                event_item.RouterID = router?.Id;
                event_item.ListName = [];
                event_item.ListParam = [];
            } else {
                if (selected_list[0].JsonEventItem == null) selected_list[0].JsonEventItem = [];
                selected_list[0].JsonEventItem.push({
                    Name: "Router",
                    RouterID: router.Id,
                    ListName: [],
                    ListParam: [],
                });
            }
            let list_name = get_listNameField(router.Route);
            for (let name of list_name) {
                selected_list[0].JsonEventItem?.find(e => e.Name == "Router").ListName.push(
                    { ID: list_name.indexOf(name), Key: name, Value: null, DataType: null }
                );
            }
        } else {
            selected_list[0].JsonEventItem = selected_list[0].JsonEventItem.filter(e => e.Name != "Router");
        }

        WBaseDA.edit(selected_list, EnumObj.attribute);
        update_UI_routerContainer();
        $('.select-router-popup').css('display', 'none');
    });

    $('body').on('input', '.select-router-popup .search-container input', function (ev) {
        update_UI_selectRouter($(this).val())
    });

    // show popup setting router param
    function update_UI_listRouterParam() {
        let list_row = '';
        let router_item = selected_list[0].JsonEventItem.find(e => e.Name == 'Router');
        if (router_item.ListParam.length == 0) {
            router_item.ListParam.push({ ID: 0, Key: "", Value: "", DataType: null });
        }
        for (let item of router_item.ListParam) {
            list_row +=
                '<div data-index="' + `${router_item.ListParam.indexOf(item)}` + '" data-id="' + `${item.ID}` + '" class="table-row row">' +
                '    <div class="row-index regular11 center">' + `${router_item.ListParam.indexOf(item) + 1}` + '</div>' +
                '    <div class="row-key">' +
                '        <input value="' + item.Key + '" class="regular11" type="text" placeholder="Add key" />' +
                '    </div>' +
                '    <div class="row-value">' +
                '        <input value="' + `${get_name_selectedData(item)}` + '" class="regular11" type="text" placeholder="Select value" readonly />' +
                '    </div>' +
                '    <button class="delete-row box32"><i class="fa-solid fa-minus fa-sm text-subtitle"></i></button>' +
                '</div>';
        }
        $('.setting-router-param-popup .data-table').html(list_row);

        $('.setting-router-param-popup').css('display', 'flex');
    }

    $('body').on('click', '.show-setting-param', function (ev) {
        ev.stopPropagation();
        $('.prototype-popup').hide();
        update_UI_listRouterParam();
        $('.setting-router-param-popup').css('top', $(this).offset().top - 88);
        $('.setting-router-param-popup').css('display', 'flex');
    });

    $('body').on('click', '.setting-router-param-popup .add-row', function (ev) {
        ev.stopPropagation();
        let router_item = selected_list[0].JsonEventItem.find(e => e.Name == 'Router');
        router_item.ListParam.push({ ID: router_item.ListParam.length, Key: "", Value: "", DataType: null });
        update_UI_listRouterParam();
        WBaseDA.edit(selected_list, EnumObj.attribute);
    });
    $('body').on('click', '.setting-router-param-popup .delete-row', function (ev) {
        ev.stopPropagation();
        let router_item = selected_list[0].JsonEventItem.find(e => e.Name == 'Router');
        router_item.ListParam.splice($(this).parents('.table-row').data('index'), 1);
        update_UI_listRouterParam();
        WBaseDA.edit(selected_list, EnumObj.attribute);
    });

    $('body').on('blur', '.setting-router-param-popup .table-row .row-key input', function (ev) {
        let router_item = selected_list[0].JsonEventItem.find(e => e.Name == 'Router');
        let update_item = router_item.ListParam.find(e => e.ID == $(this).parents('.table-row').data('id'));
        if (update_item.Key != $(this).val()) {
            update_item.Key = $(this).val();
        }
        WBaseDA.edit(selected_list, EnumObj.attribute);
    });

    $('body').on('keydown', '.setting-router-param-popup .table-row .row-key input', function (ev) {
        if (ev.key == "Enter") {
            $(this).trigger('blur');
        }
    });

    $('body').on('click', '.setting-router-param-popup .table-row .row-value', function (ev) {
        ev.stopPropagation();
        $('.select-data-popup').css('top', this.getBoundingClientRect().top - 56);
        $('.select-data-popup').css('right', $('body').width() - this.getBoundingClientRect().right);
        update_UI_selectDataPopup();
        ProtoTypeDA.data_id = $(this).parent().data('id');
        $('.select-data-popup').attr('setting-type', 'router-param');
        $('.select-data-popup').css('display', 'flex');
    });

    $('body').on('click', '.select-data-popup .data-option', function (ev) {
        let router_item = selected_list[0].JsonEventItem.find(e => e.Name == "Router");
        let prototype_item = selected_list[0].JsonEventItem.find(e => e.Name == "Prototype");

        switch ($('.select-data-popup').attr('setting-type')) {
            case 'router-param':
                let param = router_item.ListParam.find(e => e.ID == ProtoTypeDA.data_id);
                if (param) {
                    param.Value = $(this).data('value');
                    param.DataType = $(this).data('type');
                } else {
                    router_item.ListParam.push({ Key: "", Value: $(this).data('value'), DataType: $(this).data('type') });
                }
                WBaseDA.edit(selected_list, EnumObj.attribute);
                update_UI_listRouterParam();
                break;
            case 'router-field':
                let name = router_item.ListName.find(e => e.ID == ProtoTypeDA.data_id);
                if (name) {
                    name.Value = $(this).data('value');
                    name.DataType = $(this).data('type');
                } else {
                    router_item.ListName.push({ Key: "", Value: $(this).data('value'), DataType: $(this).data('type') });
                }
                WBaseDA.edit(selected_list, EnumObj.attribute);
                update_UI_routerField(router_item);
                break;
            case 'prototype-data':
                let prototype = prototype_item.Data.find(e => e.ID == ProtoTypeDA.data_id);
                if (prototype) {
                    prototype.Value = $(this).data('value');
                    prototype.DataType = $(this).data('type');
                } else {
                    prototype_item.Data.push({ Key: "", Value: $(this).data('value'), DataType: $(this).data('type') });
                }
                WBaseDA.edit(selected_list, EnumObj.attribute);
                update_UI_prototypeData();
                break;
            default:
                break;
        }
        $('.select-data-popup').css('display', 'none !important');
    })
}

$('body').on('click', function (ev) {
    if (!$('.prototype-popup-select').is(ev.target)) {
        $('.prototype-popup-select').css('display', 'none');
    }
})
//  && $('.prototype-popup-select').has(ev.target).length == 1