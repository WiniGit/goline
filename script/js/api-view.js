const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const pid = urlParams.get('pid');

$('.appbar').load('/View/title-bar.html', function () {
    TitleBarDA.initDataStorage();
});

// select folder (collection or environments)
$('body').on('click', '.setting-option .option-tile', function () {
    $('.api-view .api-body-content-container').hide();
    // check event
    if ($(this).hasClass('collection')) {
        $('.api-container').css('display', 'flex');
    } else if ($(this).hasClass('environments')) {
        $('.environments-container').css('display', 'flex');
    } else {
        $('.router-container').css('display', 'flex');
    }
    // update UI
    $('.option-tile').removeClass('selected');
    $(this).addClass('selected');
});

//! Collection
{
    let double_click = false;

    // click button add collection
    $('.add-collection').on('click', () => add_collection());

    // click collection tile
    $('body').on('mousedown', '.collection-tile', function (ev) {
        // set html element collection using
        CollectionDA.element_selected = this;
        // hide popup
        $('.collection-slide').removeClass('show-popup-request');
        $('.collection-slide').removeClass('show-popup-collection');
        // click action
        setTimeout(function () {
            if (!double_click) {
                CollectionDA.selected = CollectionDA.getElementByID($(CollectionDA.element_selected).data('id'));
                CollectionDA.set_selected();
                if (RequestDA.selected?.CollectionID != CollectionDA.selected.ID) {
                    $('.request-tile').removeClass("selected");
                }
            }
        }, 200);
        // right click action
        if (ev.button == 2) {
            // set popup offset
            $('.collection-popup').css('left', ev.pageX - 1);
            if ($('body').height() - ev.pageY > $('.collection-popup').height()) {
                $('.collection-popup').css('top', ev.pageY);
            } else {
                $('.collection-popup').css('top', ev.pageY - $('.collection-popup').height() - 6);
            }
            // show popup
            $('.collection-slide').toggleClass('show-popup-collection').promise().done(() => {
                if ($('.collection-slide').hasClass('show-popup-collection')) {
                    $(document).on('mouseup', keyup_collection_popup);
                } else {
                    $(document).off('mouseup', keyup_collection_popup);
                }
            });
        }
    });

    // click popup add request
    $('body').on('click', '.collection-popup .add-request', function () {
        add_request();
        $('.collection-slide').removeClass('show-popup-collection');
    });

    // click popup change name
    $('body').on('click', '.collection-popup .change-name', function () {
        $('.collection-slide').removeClass('show-popup-collection');
        double_click = true;
        enable_change_name(CollectionDA.element_selected);
    });

    // click popup delete collection
    $('body').on('click', '.collection-popup .delete', function () {
        CollectionDA.deleted(CollectionDA.selected.ID);
        $('.collection-slide').removeClass('show-popup-collection');
    });

    // unfocus change name collection
    $('body').on('blur', '.collection-tile input', function (ev) {
        double_click = false;
        let collection_editing;
        if ($(this).parent().data('id') != CollectionDA.selected.ID) {
            collection_editing = CollectionDA.list.find(e => e.ID == $(this).parent().data('id'));
        }
        else {
            collection_editing = CollectionDA.selected;
        }
        if (this.value.length > 0 && this.value != collection_editing.Name) {
            collection_editing.Name = this.value;
            CollectionDA.edit(collection_editing);
        }
        this.disabled = true;
    });

    // on enter change name
    $('body').on('keyup', '.collection-tile input', function (ev) {
        if (ev.key == "Enter") {
            double_click = false;
            if (this.value.length > 0 && this.value != CollectionDA.selected.Name) {
                CollectionDA.selected.Name = this.value;
                CollectionDA.edit(CollectionDA.selected);
            }
            this.disabled = true;
        }
    });

    // show hide list request of collection
    $('body').on('click', '.collection-tile button', function (ev) {
        ev.stopPropagation();
        $(this).find('i').toggleClass('fa-chevron-down fa-chevron-right');

        if ($(this).find('i').hasClass('fa-chevron-down')) {
            $(this).closest('.collection-container').find('.list-request').css('display', 'flex');
        } else {
            $(this).closest('.collection-container').find('.list-request').hide();
        }
    });

    // hide collection action popup
    const keyup_collection_popup = (ev) => {
        if (!$('.collection-popup').is(ev.target) || $('.collection-slide-bar').is(ev.target)) {
            $('.collection-slide').removeClass('show-popup-collection');
        }
    }
}

//! Request
{
    let double_click = false;
    // add request
    $('body').on('click', '.add-request-btn', () => add_request());

    // click request tab
    $('body').on('click', '.request-tab', function () {
        InputDA.selected_type = EnumInputType.Param;
        if (CollectionDA.selected.ID != $(this).data('collectionid')) {
            CollectionDA.selected = CollectionDA.getElementByID($(this).data('collectionid'));
        }
        let item = RequestDA.list_opening.find(e => e.GID == $(this).data('id'));
        RequestDA.set_TabSelected(item);

        InputDA.update_listInput();
        OutputDA.update_listOutput();

        let collection = $('.collection-tile[data-id="' + CollectionDA.selected.ID + '"]');
        if (collection.find('i').hasClass('fa-chevron-right')) {
            collection.find('i').toggleClass('fa-chevron-right fa-chevron-down');
            collection.parent().find('.list-request').css('display', 'flex');
        }
    });
    // $('body').on('mousedown', '.request-tile *', function (ev) {
    //     ev.stopPropagation();
    // });
    // click request tile
    $('body').on('mousedown', '.request-tile', function (ev) {
        $('.response-container .content').text('')
        // set html element request using
        RequestDA.element_selected = this;
        // set tab input
        InputDA.selected_type = EnumInputType.Param;
        // hide popup
        $('.collection-slide').removeClass('show-popup-request');
        $('.collection-slide').removeClass('show-popup-collection');

        CollectionDA.selected = CollectionDA.getElementByID($(this).data('collectionid'));

        if (double_click == false) {
            InputDA.selected_type = EnumInputType.Param;
            if (!RequestDA.list_opening.some(e => e.GID == $(this).data('id'))) {
                RequestDA.getDataByID($(this).data('id'));
            } else {
                let item = RequestDA.list_opening.find(e => e.GID == $(this).data('id'));
                RequestDA.set_TabSelected(item);
                InputDA.update_listInput();
                OutputDA.update_listOutput();
            }
        }

        if (ev.button == 2) {
            $('.request-popup').css('left', ev.pageX - 2);
            if ($('body').height() - ev.pageY > $('.request-popup').height()) {
                $('.request-popup').css('top', ev.pageY);
            } else {
                $('.request-popup').css('top', ev.pageY - $('.request-popup').height() - 6);
            }

            $('.collection-slide').toggleClass('show-popup-request').promise().done(() => {
                if ($('.collection-slide').hasClass('show-popup-request')) {
                    $(document).on('mouseup', keyup_request_popup);
                } else {
                    $(document).off('mouseup', keyup_request_popup);
                }
            });
        }

    });
    // double click tile
    // $('body').on('dblclick', '.request-tile', function (ev) {
    //     ev.stopPropagation();
    //     double_click = true;
    //     enable_change_name(this);
    // });

    // unfocus tile input
    $('body').on('blur', '.request-tile input', function () {
        double_click = false;
        let request_editing;
        if ($(this).parent().data('id') != RequestDA.selected.GID) {
            request_editing = CollectionDA.selected.listApi.find(e => e.GID == $(this).parent().data('id'));
        }
        else {
            request_editing = RequestDA.selected;
        }
        if (this.value.length > 0 && this.value != request_editing.Name) {
            request_editing.Name = this.value;
            RequestDA.edit(request_editing);
        }
        this.disabled = true;
    });
    // on enter
    $('body').on('keyup', '.request-tile input', function (ev) {
        double_click = false;
        if (ev.key == "Enter") {
            if (this.value.length > 0 && this.value != RequestDA.selected.Name) {
                RequestDA.selected.Name = this.value;
                RequestDA.edit(RequestDA.selected);
            }
            this.disabled = true;
        }
    });
    // click change name
    $('body').on('click', '.request-popup .change-name', function () {
        $('.collection-slide').removeClass('show-popup-request');
        double_click = true;
        enable_change_name(RequestDA.element_selected);
    });
    // click delete
    $('body').on('click', '.request-popup .delete', function () {
        RequestDA.delete(RequestDA.selected.GID);
        $('.collection-slide').removeClass('show-popup-request');
    });
    // click close tab
    $('body').on('click', '.request-tab .close-btn', function (ev) {
        ev.stopPropagation();
        let close_tab = RequestDA.list_opening.find((e) => e.GID == $(this).parent().data('id'));
        RequestDA.list_opening.splice(RequestDA.list_opening.indexOf(close_tab), 1);
        RequestDA.set_ListOpening();
        let _list_opening = RequestDA.list_opening.filter(e => e.ProjectID == pid);
        if (_list_opening.length > 0) {
            let selected = _list_opening[_list_opening.length - 1];
            RequestDA.set_TabSelected(selected);
        } else {
            RequestDA.set_TabSelected(null);
            $('.no-request').css('display', 'flex');
            $('.content-container').css('display', 'none');
        }
    });

    const keyup_request_popup = (ev) => {
        if (!$('.request-popup').is(ev.target) || $('.collection-slide-bar').is(ev.target)) {
            $('.collection-slide').removeClass('show-popup-request');
        }
    }
}

function add_request() {
    let new_item = { GID: uuidv4(), Type: 1, Url: '{{url}}', Name: 'New request', CollectionID: CollectionDA.selected.ID, ProjectID: pid }
    RequestDA.add(new_item);
}

function add_collection() {
    let new_item = { ID: 0, Name: "New collection", listApi: [], Type: ApiSelection.collection }
    CollectionDA.add(new_item);
}

function enable_change_name(item) {
    item.querySelector('input').disabled = false;
    item.querySelector('input').select();
    item.querySelector('input').focus();
}

//! Setting api
{
    function update_setting(request) {
        $('.choose-method-btn>span').text(request.Type == ApiMethod.GET ? "GET" : "POST");
        $('.request-url').val(request?.Url ?? "");
    }

    function active_method(ev) {
        if (!$('.choose-method-btn').is(ev.target) && $('.choose-method').has(ev.target).length == 0) {
            $('.choose-method-btn').removeClass('show');
        }
    }

    $('body').on('click', '.choose-method-btn', function (ev) {
        $(this).toggleClass('show').promise().done(() => {
            if ($(this).hasClass('show')) {
                $(document).on('mouseup', (ev) => active_method(ev));
            } else {
                $(document).off('mouseup', (ev) => active_method(ev));
            }
        });
    });

    $('body').on('click', '.choose-method .option-tile', function () {
        RequestDA.selected.Type = $(this).data('method');
        $('.choose-method-btn>span').text($(this).text());

        RequestDA.update_list_opening(RequestDA.selected);
        RequestDA.set_TabSelected(RequestDA.selected);
    });
    //
    $('body').on('blur', '.request-url', function () {
        RequestDA.selected.Url = $(this).val();
        RequestDA.update_list_opening(RequestDA.selected);
        RequestDA.set_TabSelected(RequestDA.selected);
    });
    //
    $('body').on('keyup', '.request-url', function (ev) {
        if (ev.key == "Enter") {
            $('.request-url').trigger("blur");
        }
    });

    // setting
    {
        $('body').on('click', '.tab', function () {
            $('.tab').removeClass('selected');
            $(this).addClass('selected');

            InputDA.selected_type = $(this).data('type');

            InputDA.update_listInput();
            OutputDA.update_listOutput();
        });
    }

    // send request
    $('body').on('click', '.send-request-btn', function () {
        list_output = [];
        let url = RequestDA.selected.Url;
        let headers = RequestDA.selected.inputApiItem.filter(e => e.Type == EnumInputType.Header);
        let headersjson = Ultis.handleListInput(headers);
        if (RequestDA.selected.Type == ApiMethod.POST) {
            let body = RequestDA.selected.inputApiItem.filter(e => e.Type == EnumInputType.Body);
            let bodyson = Ultis.handleListInput(body);
            submitRequest(url, headersjson, bodyson)
        }
        else {
            let param = RequestDA.selected.inputApiItem.filter(e => e.Type == EnumInputType.Param);
            url = Ultis.handleRequestUrl(RequestDA.selected, param);
            submitRequestGet(url, headersjson);
        }
    });
    let st_res = '';
    async function submitRequest(url, headers, body) {
        let startTime = performance.now();
        let code;
        try {
            let res = await fetch(url, { method: "POST", headers: headers, body: body }).then(response => {
                code = response.status;
                return response.json();
            });
            st_res = res;
            $(".response-container .content").html(JSON.stringify(res, null, 6)
                .replace(/\n( *)/g, function (match, p1) {
                    return '<br>' + '&nbsp;'.repeat(p1.length);
                }));
            $('.get-output-row').addClass('active');
        } catch (error) {
            let res = await fetch(url, { method: "GET", headers: headers })
                .then(response => {
                    code = response.status;
                    return response.text()
                })
                .then((bd) => {
                    $(".response-container .content").text(`${bd}`)
                });
            st_res = '';
        }
        let endTime = performance.now();
        $('.response-code').html(code + " " + StatusApi.statusName(code));
        $('.time-process>.time').text(Math.floor(endTime - startTime));
        $('.time-process').show();
        $('.response-code').show();
    }

    async function submitRequestGet(url, headers) {
        let startTime = performance.now();
        let code;
        try {
            let res = await fetch(url, { method: "GET", headers: headers }).then(response => {
                code = response.status;
                return response.json()
            });
            st_res = res;
            $(".response-container .content").html(JSON.stringify(res, null, 6)
                .replace(/\n( *)/g, function (match, p1) {
                    return '<br>' + '&nbsp;'.repeat(p1.length);
                }));
            $('.get-output-row').addClass('active');
        } catch (error) {
            let res = await fetch(url, { method: "GET", headers: headers })
                .then(response => {
                    code = response.status;
                    return response.text()
                })
                .then((bd) => {
                    $(".response-container .content").text(`${bd}`)
                });
            st_res = '';
        }
        let endTime = performance.now();
        $('.response-code').html(code + " " + StatusApi.statusName(code));
        $('.time-process>.time').text(Math.floor(endTime - startTime));
        $('.time-process').show();
        $('.response-code').show();
    }

    $('body').on('click', '.get-output-row', function (ev) {
        if (st_res != '' && $(this).hasClass('active')) {
            ConvertJsonToListMap(st_res, null, 1);
            $('.get-output-row').removeClass('active');
        }
    })

    let list_output = [];
    function ConvertJsonToListMap(data, parent, level) {
        if (data) {
            const map = new Map(Object.entries(data));
            map.forEach((value, key) => {
                let gid = uuidv4();
                var item = {
                    "NameField": key,
                    "ParentID": parent,
                    "APIID": RequestDA.selected.GID,
                    "GID": gid,
                    "Level": level,
                    "Value": value,
                    "Type": 1,
                    "Calculate": "",
                    "IsNew": true,
                    "ListFieldID": parent != null ? list_output.find(e => e.GID == parent).ListFieldID + `${level != 2 ? ',' : ''}` + parent + `,${gid}` : ""
                };
                if (Array.isArray(value)) {
                    item.DataType = WEnum.list;
                    // item.Value = JSON.stringify(value);
                    item.Value = `List ${value.length} items`;
                    list_output.push(item);
                    ConvertJsonToListMap(value[0], item.GID, level + 1);
                } else if (typeof value == 'object') {
                    item.DataType = WEnum.obj;
                    list_output.push(item);
                    ConvertJsonToListMap(value, item.GID, level + 1);
                } else {
                    item.DataType = WEnum.field;
                    list_output.push(item);
                }
            });
            RequestDA.selected.Saved = false;
            RequestDA.selected.outputApiItem = list_output;
            RequestDA.update_list_opening(RequestDA.selected);
            RequestDA.set_TabSelected(RequestDA.selected);
            OutputDA.update_listOutput();
            st_res = '';
        }
    }

    // save request 
    $('body').on('click', '.save-request-btn', function () {
        // RequestDA.selected.outputApiItem.forEach(e => e.ID = 0);
        RequestDA.Save(RequestDA.selected);
    });
}

// input
{
    // change name input row 
    $('body').on('blur', '.input-row .input-name', function () {
        let item = RequestDA.selected.inputApiItem.find(e => e.GID == $(this).parent().data('id') && e.Type == InputDA.selected_type);
        item.Name = $(this).val();
        RequestDA.update_list_opening(RequestDA.selected);
        RequestDA.set_TabSelected(RequestDA.selected);
    });
    $('body').on('keyup', '.input-row .input-name', function (ev) {
        if (ev.key == "Enter") { $(this).trigger('blur'); }
    });
    // change value input value
    $('body').on('blur', '.input-row .input-value', function () {
        let item = RequestDA.selected.inputApiItem.find(e => e.GID == $(this).parent().data('id') && e.Type == InputDA.selected_type);
        item.Value = $(this).val();
        RequestDA.update_list_opening(RequestDA.selected);
        RequestDA.set_TabSelected(RequestDA.selected);
        InputDA.update_listInput();
    });
    $('body').on('keyup', '.input-row .input-value', function (ev) {
        if (ev.key == "Enter") {
            let item = RequestDA.selected.inputApiItem.find(e => e.GID == $(this).parent().data('id') && e.Type == InputDA.selected_type);
            let list = RequestDA.selected.inputApiItem.filter(e => e.Type == item.Type);
            if (list.indexOf(item) == list.length - 1) {
                RequestDA.selected.inputApiItem.push(
                    { GID: uuidv4(), Name: "", Value: "", DataType: null, Type: item.Type, APIID: RequestDA.selected.GID, OutputID: null }
                )
            }
            $(this).trigger('blur');
        }
    });

    // click select data type
    $('body').on('click', '.input-row .data-input-type', function (ev) {
        ev.stopPropagation();
        $('.datatype-popup').width($(this).width() + 36);
        $('.datatype-popup').css('top', $(this).offset().top + 36);
        $('.datatype-popup').css('left', $(this).offset().left);
        InputDA.selected_id = $(this).parents(".input-row").data("id");
        $('.datatype-popup').show();
    });

    $('body').on('click', '.datatype-popup .option-tile', function (ev) {
        ev.stopPropagation();
        RequestDA.selected.inputApiItem.find(e => e.GID == InputDA.selected_id).DataType = $(this).data('type');
        RequestDA.update_list_opening(RequestDA.selected);
        RequestDA.set_TabSelected(RequestDA.selected);
        InputDA.update_listInput();
        $('.datatype-popup').hide();
    });

    // click select from output
    function hide_select_output(ev) {
        if ((!$('.select-output-popup').is(ev.target)
            || $(ev.target).hasClass('input-select-from-output')
            || $('.select-output-popup').has(ev.target).length == 1)
            && !$(ev.target).hasClass('api-name')) {
            $('.tabbar-views').removeClass('show-select-output');
        }
    }

    let input_select;
    $('body').on('click', '.input-row .input-select-from-output', function (ev) {
        let rect = this.getBoundingClientRect();
        OutputDA.update_select_output()
        $('.select-output-popup').css('top', rect.top + 36);
        $('.select-output-popup').css('left', rect.left);
        $('.select-output-popup').css('width', rect.width);


        if (!$(this).parent().hasClass('header')) {
            $('.tabbar-views').toggleClass('show-select-output').promise().done(() => {
                if ($('.tabbar-views').hasClass('show-select-output')) {
                    $(document).on('mouseup', hide_select_output);
                } else {
                    $(document).off('mouseup', hide_select_output);
                }
            });
        }

        input_select = $(this).parent();
    });

    $('body').on('click', '.select-output-popup .option-tile', function (ev) {
        let input = RequestDA.selected.inputApiItem.find((e) => e.GID == input_select.data('id'));
        input.OutputID = $(this).data('id');
        input.Name = (OutputDA.getElementByID(input.OutputID)?.Name ?? "");

        RequestDA.update_list_opening(RequestDA.selected);
        RequestDA.set_TabSelected(RequestDA.selected);
        InputDA.update_listInput();
    });

    // delete input row
    $('body').on('click', '.input-row .delete-input-btn', function (ev) {
        let item = RequestDA.selected.inputApiItem.find(e => e.GID == $(this).parent().data('id') && e.Type == InputDA.selected_type);
        RequestDA.selected.inputApiItem.splice(RequestDA.selected.inputApiItem.indexOf(item), 1);

        let list = RequestDA.selected.inputApiItem.filter(e => e.Type == item.Type);
        if (list.length == 0) {
            RequestDA.selected.inputApiItem.push(
                { GID: uuidv4(), Name: "", Value: "", DataType: null, Type: item.Type, APIID: RequestDA.selected.GID, OutputID: null, IsNew: true }
            );
        }
        RequestDA.update_list_opening(RequestDA.selected);
        RequestDA.set_TabSelected(RequestDA.selected);
        InputDA.update_listInput();
    });
}

//! output
{
    let output_select;
    // show setting container
    $('body').on('click', '.setting-output-btn', function (ev) {
        $('.response-container').toggleClass('active')
    });
    // show input calculate container
    $('body').on('click', '.output-row .calc', function () {
        // update UI
        let output = RequestDA.selected.outputApiItem.find(e => e.GID == $(this).parent().data('id'));
        // show calc
        let cal_box = $(this).closest('.output-row-container').find('.input-calculate');
        if (cal_box.css('display') == "flex") {
            cal_box.hide();
        } else {
            cal_box.css('display', 'flex');
        }

        output_select = $(this).parent();
    });

    $('body').on('input', '.input-calculate input', function (ev) {
        if (this.value == "") {
            $('.select-output-calculate').hide();
        }
    });
    $('body').on('keydown', '.input-calculate input', function (ev) {
        if (ev.key == "{") {
            let rect = this.getBoundingClientRect();
            let rect_parent = document.getElementsByClassName('response-container')[0].getBoundingClientRect();

            $('.select-output-calculate').width($(this).parent().width());
            $('.select-output-calculate').css('top', rect.top - rect_parent.top + 36);

            $('.select-output-calculate').show();
        }
    });
    $('body').on('click', '.select-output-calculate .option-tile', function () {
        let output = RequestDA.selected.outputApiItem.find(e => e.GID == $(this).data('id'));
        let update_output = RequestDA.selected.outputApiItem.find(e => e.GID == output_select.data('id'));

        let _val = output_select.parent().find('.calc-value').val().replaceAll(" ", "");
        let _inx = _val.lastIndexOf('{') - 1;
        update_output.Calculate += `${_val.substring(_inx) + output.GID}}`;

        output_select.parent().find('.calc-value').val(output_select.parent().find('.calc-value').val() + output.NameField + "}");
        $('.select-output-calculate').hide();

        output_select.parent().find('.calc-value').focus();

        RequestDA.update_list_opening(RequestDA.selected);
        Ultis.setStorage("api--selected-request", JSON.stringify(RequestDA.selected));
    });
    $('body').on('blur', '.input-calculate input', function (ev) {
        let output = RequestDA.selected.outputApiItem.find(e => e.GID == output_select.data('id'));
        // $('.input-calculate[data-id="' + output_select.data('id') + '"] .calc-value').val(OutputDA.handle_outputVal(output?.Calculate ?? ""));
    });

    // $('body').on('input', '.input-calculate input', function (ev) {
    //     if (this.value == "") {
    //         $('.select-output-calculate').hide();
    //     }
    // });

    // $('body').on('blur', '.input-calculate input', function (ev) {
    //     let output = RequestDA.selected.outputApiItem.find(e => e.GID == output_select.data('id'));
    //     output.Calculate = (output?.Calculate ? output?.Calculate : "") + $(this).val();


    //     output.Value = OutputDA.calculate_value(output.Calculate);

    //     RequestDA.update_list_opening(RequestDA.selected);
    //     Ultis.setStorage("api--selected-request", JSON.stringify(RequestDA.selected));

    // $('.input-calculate[data-id="' + output_select.data('id') + '"]').html(OutputDA.update_calculate(output?.Calculate ?? ""));

    //     output_select.find('.output-value').val(output.Value);
    //     // OutputDA.update_listOutput();
    // });

    // $('body').on('keyup', '.input-calculate input', function (ev) {
    //     if (this.value == "" && ev.key == "Backspace") {
    //         let output = RequestDA.selected.outputApiItem.find(e => e.GID == output_select.data('id'));
    //         this.previousElementSibling?.remove();
    //         let calc = '';
    //         let list = $(this).parent().find('span');
    //         for (let item of list) {
    //             calc += `${$(item).data('db')} `;
    //         }
    //         output.Calculate = calc;
    //         $('.input-calculate[data-id="' + output_select.data('id') + '"]').html(OutputDA.update_calculate(output?.Calculate ?? ""));

    //         RequestDA.update_list_opening(RequestDA.selected);
    //         Ultis.setStorage("api--selected-request", JSON.stringify(RequestDA.selected));

    //         output_select.parent().find('.calc-value').focus();
    //     }
    //     if (ev.key == "{") {
    //         let rect = this.getBoundingClientRect();
    //         let rect_parent = document.getElementsByClassName('response-container')[0].getBoundingClientRect();

    //         $('.select-output-calculate').width($(this).parent().width());
    //         $('.select-output-calculate').css('top', rect.top - rect_parent.top + 36);

    //         $('.select-output-calculate').show();
    //     }
    //     if (ev.key == "}") {
    //         $('.select-output-calculate').hide();
    //     }
    // });

    // $('body').on('keyup', '.calc-field', function (ev) {
    //     if (ev.key == "Backspace") {
    //         let output = RequestDA.selected.outputApiItem.find(e => e.GID == output_select.data('id'));

    //         let nextFocusEl;
    //         try {
    //             nextFocusEl = this.previousElementSibling;
    //         } catch (e) {
    //             nextFocusEl = this.nextElementSibling;
    //         }

    //         $(this).remove();

    //         let calc = '';
    //         let list = $(output_select).parent().find('.calc-field');
    //         for (let item of list) {
    //             calc += `${$(item).data('db')} `;
    //         }
    //         output.Calculate = calc;
    //         // $('.input-calculate[data-id="' + output_select.data('id') + '"]').html(OutputDA.update_calculate(output?.Calculate ?? ""));

    //         RequestDA.update_list_opening(RequestDA.selected);
    //         Ultis.setStorage("api--selected-request", JSON.stringify(RequestDA.selected));

    //         setTimeout(() => {
    //             console.log(nextFocusEl)
    //             $(nextFocusEl).trigger('focus');
    //         }, 100)
    //     }
    // });

    // $('body').on('click', '.select-output-calculate .option-tile', function () {
    //     let output = RequestDA.selected.outputApiItem.find(e => e.GID == output_select.data('id'));
    //     output.Calculate = output.Calculate.substring(output.Calculate.lastIndexOf("{"), 0) + ` {${$(this).data('id')}} `;
    //     output.Calculate = output.Calculate.replace(/\s+/g, ' ');
    //     if (output.Calculate.charAt(0) == " ") {
    //         output.Calculate = output.Calculate.substring(1);
    //     }
    //     $('.select-output-calculate').hide();

    //     output_select.parent().find('.calc-value').focus();

    //     $('.input-calculate[data-id="' + output_select.data('id') + '"]').html(OutputDA.update_calculate(output?.Calculate ? output?.Calculate : ""));
    //     $('.input-calculate input').focus();

    //     RequestDA.update_list_opening(RequestDA.selected);
    //     Ultis.setStorage("api--selected-request", JSON.stringify(RequestDA.selected));
    // });
    //! Không xóa
    // let index_select = 0;
    // $('body').on('keydown', function (ev) {
    //     if ($('.select-output-calculate').css('display') == 'block') {
    //         output_select.parent().find('.calc-value').trigger('blur');
    //         // TODO: Fix hover output option ..........................................
    //         if (ev.key == "ArrowDown" && index_select < RequestDA.selected.outputApiItem.length) {
    //             index_select += 1;
    //             $('.select-output-calculate .option-tile').removeClass('select');
    //             $('.select-output-calculate .option-tile:nth-child(' + index_select + ')').addClass('select');

    //             $('.select-output-calculate').animate({
    //                 // TODO: Cần tính toán lại
    //                 scrollTop: $('.select-output-calculate .option-tile.select').offset().top - ($('.select-output-calculate').offset().top) + $('.select-output-calculate .option-tile.select').scrollTop()
    //             }, 300);
    //         }
    //         else if (ev.key == "ArrowUp" && index_select > 1) {
    //             index_select -= 1;
    //             $('.select-output-calculate .option-tile').removeClass('select');
    //             $('.select-output-calculate .option-tile:nth-child(' + index_select + ')').addClass('select');

    //             $('.select-output-calculate').animate({
    //                 // TODO: Cần tính toán lại
    //                 scrollTop: $('.select-output-calculate .option-tile.select').offset().top - ($('.select-output-calculate').offset().top) + $('.select-output-calculate .option-tile.select').scrollTop()
    //             }, 300);
    //         }
    //         else if (ev.key == "Enter") {
    //             // TODO: Fix unfocus issue .....................................
    //             if (index_select >= 0) {
    //                 let output = RequestDA.selected.outputApiItem.find(e => e.GID == output_select.data('id'));
    //                 output.Calculate = output.Calculate.substring(output.Calculate.lastIndexOf("{"), 0) + ` {${$('.select-output-calculate .option-tile.select').data('id')}} `;
    //                 // let new_value = output_select.parent().find('.calc-value').val() + $('.select-output-calculate .option-tile.select').data('id') + "} ";
    //                 // output_select.parent().find('.calc-value').val(new_value);
    //                 RequestDA.update_list_opening(RequestDA.selected);
    //                 Ultis.setStorage("api--selected-request", JSON.stringify(RequestDA.selected));
    //                 $('.input-calculate[data-id="' + output_select.data('id') + '"]').html(OutputDA.update_calculate(output?.Calculate ? output?.Calculate : ""));

    //                 $('.select-output-calculate').hide();
    //                 output_select.parent().find('.calc-value').trigger('focus');
    //             } else {
    //                 $('.select-output-calculate').hide();
    //             }
    //             // output_select.parent().find('.calc-value').trigger('focus');
    //         }
    //     }
    // });
    // change name field output row
    $('body').on('blur', '.output-row .output-name', function () {
        let list = RequestDA.selected.outputApiItem;
        let item = list.find((e) => e.GID == $(this).parent().data('id'));
        item.NameField = $(this).val();

        RequestDA.update_list_opening(RequestDA.selected);
        RequestDA.set_TabSelected(RequestDA.selected);
    });
    $('body').on('keyup', '.output-row .output-name', function (ev) {
        if (ev.key == "Enter") { $(this).trigger('blur'); }
    });
    // change value output row
    $('body').on('blur', '.output-row .output-value', function () {
        let list = RequestDA.selected.outputApiItem;
        let item = list.find((e) => e.GID == $(this).parent().data('id'));
        item.Value = $(this).val();

        RequestDA.update_list_opening(RequestDA.selected);
        RequestDA.set_TabSelected(RequestDA.selected);
    });
    $('body').on('keyup', '.output-row .output-value', function (ev) {
        if (ev.key == "Enter") {
            let list = RequestDA.selected.outputApiItem;
            let item = list.find((e) => e.GID == $(this).parent().data('id'));
            if (item.DataType == WEnum.list || item.DataType == WEnum.obj) {
                RequestDA.selected.outputApiItem.push(
                    {
                        GID: uuidv4(),
                        NameField: "",
                        Value: "",
                        Level: item.Level + 1,
                        ParentID: item.GID,
                        DataType: null,
                        Type: EnumOutputType.Default,
                        APIID: RequestDA.selected.GID,
                        IsNew: true,
                    }
                );
            } else {
                RequestDA.selected.outputApiItem.push(
                    {
                        GID: uuidv4(),
                        NameField: "",
                        Value: "",
                        Level: 1,
                        ParentID: null,
                        DataType: null,
                        Type: EnumOutputType.Default,
                        APIID: RequestDA.selected.GID,
                        IsNew: true,
                    }
                );
            }
            $(this).trigger('blur');

        }
    });
    // click choose data type
    function hide_select_type_ouput(ev) {
        if (!$('.select-type-output-row').is(ev.target)
            || $(ev.target).hasClass('output-type')
            || $('.select-type-output-row').has(ev.target).length == 1
        ) {
            $('.response-container').removeClass('show-select-type');
        }
    }

    $('body').on('click', '.output-row .output-datatype', function () {
        let rect = this.getBoundingClientRect();
        let rect_parent = document.getElementsByClassName('response-container')[0].getBoundingClientRect();

        $('.select-datatype-output-row').css('top', rect.top - rect_parent.top + 36);
        $('.select-datatype-output-row').css('left', rect.left - rect_parent.left);
        $('.select-datatype-output-row').css('width', rect.width);

        if (!$(this).parent().hasClass('header')) {
            $('.response-container').toggleClass('show-select-datatype').promise().done(() => {
                if ($('.response-container').hasClass('show-select-datatype')) {
                    $(document).on('mouseup', hide_select_datatype_ouput);
                } else {
                    $(document).off('mouseup', hide_select_datatype_ouput);
                }
            });
        }
        output_select = $(this).parent();
    });
    $('body').on('click', '.select-datatype-output-row .option-tile', function () {
        let output = RequestDA.selected.outputApiItem.find(e => e.GID == output_select.data('id'));
        output.DataType = $(this).data('type');

        RequestDA.update_list_opening(RequestDA.selected);
        RequestDA.set_TabSelected(RequestDA.selected);
    });
    // click choose output type
    function hide_select_datatype_ouput(ev) {
        if (!$('.select-datatype-output-row').is(ev.target)
            || $(ev.target).hasClass('output-datatype')
            || $('.select-datatype-output-row').has(ev.target).length == 1
        ) {
            $('.response-container').removeClass('show-select-datatype');
        }
    }
    $('body').on('click', '.output-row .output-type', function () {
        let rect = this.getBoundingClientRect();
        let rect_parent = document.getElementsByClassName('response-container')[0].getBoundingClientRect();

        $('.select-type-output-row').css('top', rect.top - rect_parent.top + 36);
        $('.select-type-output-row').css('left', rect.left - rect_parent.left);
        $('.select-type-output-row').css('width', rect.width);

        if (!$(this).parent().hasClass('header')) {
            $('.response-container').toggleClass('show-select-type').promise().done(() => {
                if ($('.response-container').hasClass('show-select-type')) {
                    $(document).on('mouseup', hide_select_type_ouput);
                } else {
                    $(document).off('mouseup', hide_select_type_ouput);
                }
            });
        }
        output_select = $(this).parent();
    });

    $('body').on('click', '.select-type-output-row .option-tile', function () {
        let output = RequestDA.selected.outputApiItem.find(e => e.GID == output_select.data('id'));
        output.Type = $(this).data('type');

        RequestDA.update_list_opening(RequestDA.selected);
        RequestDA.set_TabSelected(RequestDA.selected);
    });
    // add output row
    $('body').on('click', '.add-output-row', function () {
        let list = RequestDA.selected.outputApiItem;
        RequestDA.selected.outputApiItem.push(
            {
                GID: uuidv4(),
                NameField: "",
                Value: "",
                Level: 1,
                ParentID: null,
                DataType: null,
                Type: EnumOutputType.Default,
                APIID: RequestDA.selected.GID,
                IsNew: true,
            }
        );
        RequestDA.update_list_opening(RequestDA.selected);
        RequestDA.set_TabSelected(RequestDA.selected);
    });
    // $('body').on('keyup', '.output-value', function (ve) {
    //     if (ev.key == "Enter") {

    //     }
    // });
    // delete output row
    $('body').on('click', '.delete-output-btn', function (ve) {
        let list = RequestDA.selected.outputApiItem;
        let item = list.find(e => e.GID == $(this).parent().data('id'));
        list.splice(list.indexOf(item), 1);

        if (list.length == 0) {
            RequestDA.selected.outputApiItem.push(
                { GID: uuidv4(), NameField: "", Value: "", Level: 1, DataType: null, Type: EnumOutputType.Default, APIID: RequestDA.selected.GID, ParentID: null, IsNew: true }
            );
        }
        RequestDA.update_list_opening(RequestDA.selected);
        RequestDA.set_TabSelected(RequestDA.selected);
    });
}

document.onclick = function (ev) {
    if (!$('.api_popup').is(ev.target)) {
        $('.api_popup').hide();
    }
}