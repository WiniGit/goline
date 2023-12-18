const socketH = io(socketHome
    // const socketH = io("http://10.15.138.23:6001"
    , {
        //reconnectionDelayMax: 1000,
        auth: {
            token: "123"
        },
        query: {
            "my-key": "my-value"
        }
    });

socketH.on("connect", () => {
    console.log(socketH.id); // "G5p5..."
    console.log(socketH.connected); // true
});

socketH.io.on("ping", () => {
});

socketH.on('server-log', (data) => {
    console.log('server-log', data.Code);
    switch (data["Code"]) {
        case StatusApi.refreshToken:
            // toastr["error"]("Phiên làm việc của bạn đã hết hạn, vui lòng đăng nhập lại!!!");
            // window.location.href = '/View/login-view.html';
            let item = {
                type: "warning",
                title: "Thông báo",
                content: "Phiên làm việc của bạn đã hết hạn, vui lòng đăng nhập lại để tiếp tục sử dụng",
                cancelTitle: "Hủy bỏ",
                confirmTitle: "Đồng ý",
                cancelAction: function () {
                },
                confirmAction: function () {
                    window.location.href = '/View/login-view.html';
                    $('.popup-background').css("display", "none");
                },
            };
            $('.popup-background').append(PopupDA.create_alertPopup_center(item));
            $('.popup-background').css("display", "flex");
            break;
        case StatusApi.errorPhoneNumber:
            // ignore: invalid_use_of_protected_member
            //LoginDA.loginKey.currentState.setState(() {
            LoginDA.phoneSMS = data['Message'];
            //});
            break;
        case StatusApi.errorOTP:
            LoginDA.isAcceptOTP = false;
            // ignore: invalid_use_of_protected_member

            break;
        default:
            toastr["error"](data.Message + "Home");
        // alert(JSON.stringify(data.Data));
    }
});
//! SOCKET GET
socketH.on('server-get', (data) => {
    switch (data.enumEvent) {
        default:
            var tok = UserService.getToken();
            if (tok != null && data.headers.token === tok) {
                switch (data.enumObj) {
                    // GET user details
                    case EnumObj.User:
                        switch (data.enumEvent) {
                        }
                        break;
                    // //! GET router
                    case EnumObj.router:
                        switch (data.enumEvent) {
                            case EnumEvent.get:
                                RouterDA.listPage = data.data;
                                // RouterDA.init();
                                break;
                            // case EnumEvent.init:
                            //     RouterDA.list = data.data;
                            //     RouterDA.update_listRouter();
                            //     break;
                        }
                        break;
                    // //! GET TEAM
                    case EnumObj.team:
                        switch (data.enumEvent) {
                            case EnumEvent.init:
                                TeamDA.list = data.data.sort((a, b) => b.DateUpdate - a.DateUpdate);
                                update_UI_ListTeam();
                                update_SelectedOption();
                                break;
                            case EnumEvent.get:
                                TeamDA.selected.ID = data.data.ID;
                                TeamDA.obj = data.data;
                                TeamDA.initListteamContent(data.data);
                                break;
                            case EnumEvent.getProjectByID:
                                TeamDA.selected.ID = data.data.ID;
                                TeamDA.obj = data.data;
                                ProjectDA.list = data.data.ListProjectItem;
                                TeamDA.initListteamChildContent(data.data);
                                break;
                            case EnumEvent.getByCode:
                                TeamDA.list.push(data.data);
                                update_UI_ListTeam();
                                break;
                            // other case
                        }
                        break;
                    //! GET PROJECT
                    case EnumObj.project:
                        switch (data.enumEvent) {
                            case EnumEvent.init: // get list project
                                ProjectDA.list = data.data.sort((a, b) => b.DateUpdate - a.DateUpdate);
                                ProjectDA.showing_list = ProjectDA.list;
                                update_UI_ListProject(ProjectDA.list);
                                TitleBarDA.initDataStorage();
                                TeamDA.init();
                                setTimeout(
                                    function () {
                                        $('.loading-view').hide();
                                        $('.home-view').css('display', "flex");
                                    }, 500
                                )
                                break;
                            case EnumEvent.getProjectByID: // get project detail 
                                // ProjectDA.selected = data.data;
                                ProjectDA.obj_click = data.data;
                                // debugger
                                if (data.data.RouterJson) {
                                    RouterDA.list = JSON.parse(data.data.RouterJson);
                                } else {
                                    RouterDA.list = [];
                                }
                                RouterDA.update_listRouter();
                                break;
                            case EnumEvent.getByCode: // 
                                ProjectDA.list.push(data.data);
                                ProjectDA.selected = data.data;
                                update_UI_InfoView(ProjectDA.selected, 'project');
                                break;
                            case EnumEvent.getProjectByIDapi: // get API info 
                                CollectionDA.list = data.data.CollectionItems;
                                ProjectDA.selected = data.data;
                                $('.api-header-container span').text(ProjectDA.selected.Name);
                                // update list collection view
                                CollectionDA.update_UI_ListCollection();
                                // get 
                                api_getDataStorage();
                                ProjectDA.getByID();
                                break;
                            case EnumEvent.check: // edit domain project
                                if (!data.data) {
                                    ProjectDA.selected.Domain = $('.domain-form input').val();
                                    ProjectDA.edit(ProjectDA.selected);
                                    $('.domain-value u').text(ProjectDA.selected?.Domain ?? ProjectDA.selected?.Code);
                                } else {
                                    toastr["error"]("Domain này đã tồn tại");
                                }
                                $('.domain-value').show();
                                break;
                        }

                    //! GET CUSTOMER
                    case EnumObj.customer:
                        switch (data['enumEvent']) {
                            case EnumEvent.get:
                                if (data.data) {
                                    // nếu đã tồn tại
                                    if (HomeDA.info_type == 'project') {
                                        if (ProjectDA.selected.CustomerProjectItems.some((e) => e.CustomerID == data.data.ID)) {
                                            toastr["error"]("Người dùng đã là thành viên của dự án!");
                                        } else {
                                            // if (ProjectDA.permission == 0) {
                                            //     let customerSelectedItem = ProjectDA.selected.CustomerProjectItems.find(e => e.CustomerID == userItem.ID);
                                            //     customerSelectedItem.Permission = 1;
                                            //     ProjectDA.editCustomerProject(customerSelectedItem);
                                            // }
                                            let customerInviteItem = {
                                                ID: 0,
                                                Permission: ProjectDA.permission,
                                                CustomerID: data.data.ID,
                                                CustomerName: data.data.Email,
                                                ProjectID: ProjectDA.selected.ID,
                                            }
                                            ProjectDA.addCustomerProject(customerInviteItem);
                                        }
                                    } else {
                                        if (TeamDA.selected.CustomerTeamItems.some((e) => e.CustomerID == data.data.ID)) {
                                            toastr["error"]("Người dùng đã là thành viên trong nhóm này!");
                                        } else {
                                            let customerInviteItem = {
                                                ID: 0,
                                                Permission: TeamDA.permission,
                                                CustomerID: data.data.ID,
                                                CustomerName: data.data.Email,
                                                TeamID: TeamDA.selected.ID,
                                            }
                                            TeamDA.addCustomerTeam(customerInviteItem);
                                        }
                                    }

                                } else {
                                    toastr["error"]("Người dùng chưa đăng ký tài khoản Wini!");
                                }
                                break;
                        }
                        break;
                    // case EnumObj.apilist:
                    //     switch (data['enumEvent']) {
                    //         case EnumEvent.getByID:
                    //             ApiDA.selected = data.data;
                    //             ApiDA.selected.ProjectID = pid;
                    //             ApiDA.listOpened.push(ApiDA.selected);
                    //             updateListOpened();
                    //             addStorage();
                    //             $('.tab_bar div').removeClass('select_tab');
                    //             $('.param_tab').addClass('select_tab');

                    //             $('.select_request_method span').text(getMethodString(ApiDA.selected.Type));
                    //             $('.request_url').val(ApiDA.selected.Url);
                    //             updateListInput(EnumInputType.Param);
                    //             updateListOutput();
                    //             setActive($(this).data('id'));
                    //             break;
                    //         case EnumEvent.init:
                    //             ApiDA.list = data.data;
                    //             break;
                    //         case EnumEvent.Save:
                    //             if (data.data.Code == 200) {
                    //                 toastr["success"]('Lưu thành công');
                    //                 ApiDA.selected["isSave"] = true;
                    //                 addStorage();
                    //             }
                    //             break;
                    //         default:
                    //             break;
                    //     }
                    // break;
                    //! GET api input
                    // case EnumObj.apiInput:
                    //     switch (data['enumEvent']) {
                    //         case EnumEvent.init:
                    //             InputDA.list = data.data;
                    //             // initDataStorage();
                    //             //updateListInput(EnumInputType.Param);
                    //             break;
                    //         default:
                    //     }
                    //     break;
                    // //! GET api output
                    // case EnumObj.apiOutput:
                    //     switch (data['enumEvent']) {
                    //         case EnumEvent.init:
                    //             OutputDA.list = data.data;
                    //             //updateListOutput();
                    //             break;
                    //         default:
                    //     }
                    //     break;

                    // !GET collection
                    // case EnumObj.collection:
                    //     switch (data['enumEvent']) {
                    //         case EnumEvent.init:
                    //             
                    //             CollectionDA.list = data['data'];
                    //             // update_UI_LeftView();
                    //             // initDataStorage();
                    //             break;
                    //         default:
                    //     }
                    //     break;

                    // !GET request
                    case EnumObj.request:
                        switch (data['enumEvent']) {
                            case EnumEvent.getByID:
                                RequestDA.selected = data.data;
                                RequestDA.selected.ProjectID = pid;

                                if (!RequestDA.list_opening.some(e => e.GID == data.data.GID)) {
                                    RequestDA.list_opening.push(data.data);
                                    RequestDA.set_ListOpening();
                                }
                                RequestDA.set_TabSelected(data.data);
                                break;
                            // case EnumEvent.init:
                            //     RequestDA.list = data.data;
                            //     break;
                            default:
                        }
                        break;

                    // !GET field
                    case EnumObj.field:
                        switch (data['enumEvent']) {
                            case EnumEvent.listBase:
                                // print('List_Base: ${data["data"]}');
                                ApiEvent.initDataBase(data);
                                break;
                            case EnumEvent.init:
                                // print('List_Field: ${data["data"]}');
                                ApiEvent.initField(data);
                                break;
                        }
                        break;
                }

            }
            break;
    }
});
socketH.on('server-google',
    (data) => {
        console.log('vao day');
        // Ultis.setStorage('token', data.Data.Token);
        // Ultis.setStorage('refresh-token', data.Data.RefreshToken);
        UserService.setToken(data.Data.Token, data.Data.RefreshToken);
        Ultis.setStorage('customer', JSON.stringify(data.Data));
        window.location.href = '/View/home-screen.html?tab=home';
    });

socketH.on('server-post', (data) => {
    switch (data["enumObj"]) {
        // ! User Post
        case EnumObj.User:
            switch (data["enumEvent"]) {
                case EnumEvent.registor:
                    const btnSubmit = document.getElementById("button-signup");
                    if (btnSubmit.disabled === true) {
                        return false;
                    } else {
                        btnSubmit.style.backgroundColor = "#B0B0B0";
                        document.getElementById("loader").style.display = "block";
                        document.getElementById("btn-text").style.display = "none";
                        btnSubmit.disabled = true;
                        if (data.data.Code === 200) {
                            btnSubmit.style.backgroundColor = "#366AE2";
                            document.getElementById("loader").style.display = "none";
                            document.getElementById("btn-text").style.display = "block";
                            btnSubmit.disabled = false;
                            // Ultis.setStorage('token', data.data.Data.Token);
                            // Ultis.setStorage('refresh-token', data.data.Data.RefreshToken);
                            UserService.setToken(data.data.Data.Token, data.data.Data.RefreshToken);
                            Ultis.setStorage('customer', JSON.stringify(data.data.Data));
                            window.location.href = '/View/home-screen.html?tab=home';
                            $("#button-signup #loader").hide();
                            $("#button-signup #btn-text").show();
                        } else {
                            // btnSubmit.style.backgroundColor = "#366AE2";
                            // document.getElementById("loader").style.display = "none";
                            // document.getElementById("btn-text").style.display = "block";
                            // btnSubmit.disabled = false;
                            // //alert(data.data.Message);
                            // var item = {
                            //     type: "warning",
                            //     title: "Content Title",
                            //     content: data.data.Message,
                            //     cancelTitle: "Cancel",
                            //     confirmTitle: "Confirm",
                            //     cancelAction: function () {
                            //     },
                            //     confirmAction: function () {
                            //     },
                            // }
                            // PopupItem.showPopup(item);
                            toastr["warning"](data.data.Message);
                            $("#button-signup #loader").hide();
                            $("#button-signup #btn-text").show();
                        }
                    }

                    break;
                default:
            }
            break;
        //! router
        case EnumObj.router:
            switch (data['enumEvent']) {
                // case EnumEvent.add:
                //     let newItem = data.data.Data;
                //     RouterDA.list[RouterDA.list.indexOf(RouterDA.selected)] = newItem;
                //     $('.router-row[data-id="' + `${RouterDA.selected.Id}` + '"]').replaceWith(RouterDA.create_routerRow(newItem));
                //     break;
                // case EnumEvent.edit:
                //     let editItem = data.data.Data;
                //     RouterDA.list[RouterDA.list.indexOf(RouterDA.selected)] = editItem;
                //     $('.router-row[data-id="' + `${RouterDA.selected.Id}` + '"]').replaceWith(RouterDA.create_routerRow(editItem));
                //     break;
                // case EnumEvent.delete:
                //     // hien chua can event
                //     // RouterDA.list.splice(RouterDA.list.indexOf(RouterDA.selected), 1);
                //     break;
            }
            break;
        //! TEAM post
        case EnumObj.team:
            switch (data["enumEvent"]) {
                case EnumEvent.add:
                    if (data.data.Code === 200) {
                        let new_item = data.data.Data;
                        history.pushState('', 'Team', `/View/home-screen.html?tab=${new_item.ParentID == null ? "team" : "team-child"}&id=` + data.data.Data.ID);
                        if (new_item.ParentID == null) {
                            TeamDA.list.push(new_item);
                            TeamDA.list = TeamDA.list.sort((a, b) => a.DateUpdate - b.DateUpdate);
                        } else {
                            let temp = TeamDA.getByID(new_item.ParentID);
                            temp.ListChild.push(new_item);
                        }
                        update_UI_ListTeam();
                        update_SelectedOption();
                    } else {
                        toastr["error"](data.data.Message);
                    }
                    break;
                case EnumEvent.create:
                    let new_item = data.data.Data;
                    TeamDA.list.push(new_item);
                    window.location.href = '/View/home-screen.html?tab=team&id=' + new_item.ID;
                    update_UI_ListTeam();
                    TeamDA.set_selected(new_item.ID);
                    break;
                case EnumEvent.edit:
                    if (TeamDA.selected.ParentID == null) {
                        TeamDA.list.map((e) => {
                            if (e.ID == data['data'].ID) {
                                e = data['data'];
                            }
                        });
                    } else {
                        let parent_item = TeamDA.getByID(TeamDA.selected.ParentID);
                        parent_item.ListChild.map((e) => {
                            if (e.ID == data['data'].ID) {
                                e = data['data'];
                            }
                        });
                    }
                    update_UI_InfoView(TeamDA.selected, 'team');
                    break;
                case EnumEvent.delete:
                    let delete_item = TeamDA.getByID(data.data.Data);
                    if (delete_item.ParentID == null) {
                        TeamDA.list.splice(TeamDA.list.indexOf(delete_item), 1);
                        update_UI_ListTeam();
                        if (TeamDA.selected?.ID == delete_item.ID) {
                            history.pushState('', "Home", "/View/home-screen.html?tab=home");
                        }
                        update_SelectedOption();
                    } else {
                        let parent_item = TeamDA.getByID(delete_item.ParentID);
                        parent_item.ListChild.splice(parent_item.ListChild.indexOf(delete_item), 1);
                        update_UI_ListTeam();
                        history.pushState('', 'Team', "/View/home-screen.html?tab=team&id=" + parent_item.ID);
                        update_SelectedOption();
                    }

                    break;
                case EnumEvent.leave:
                    window.location.reload();
                    break;
                case EnumEvent.unDelete:
                    break;
            };
            break;
        //! PROJECT post
        case EnumObj.project:
            switch (data["enumEvent"]) {
                case EnumEvent.add:
                    var pro = data.data.Data;
                    ProjectDA.list.push(pro);
                    ProjectDA.obj = pro;
                    // add project tab
                    TitleBarDA.list.push(pro);
                    Ultis.setStorage('project-tab-selected', pro.ID);
                    Ultis.setStorage('list-project-tab', JSON.stringify(TitleBarDA.list));
                    TitleBarDA.updateTitleBar();
                    //
                    window.location.href = "/View/project-design-view.html?id=" + pro.ID;
                    update_UI_ListProject(ProjectDA.list);
                    break;
                case EnumEvent.edit:
                    ProjectDA.list.map((e) => {
                        if (e.ID == data['data'].ID) {
                            e = data['data'];
                        }
                    });
                    update_UI_InfoView(ProjectDA.selected, 'project');
                    if (TitleBarDA.list.some((e) => e.ID == data.data.Data.ID)) {
                        TitleBarDA.list.find((e) => e.ID == data.data.Data.ID).Name = data.data.Data.Name;
                        Ultis.setStorage('list-project-tab', JSON.stringify(TitleBarDA.list));
                        TitleBarDA.initDataStorage();
                    }
                    if (TeamDA.selected != null) {
                        ProjectDA.showing_list = ProjectDA.list.filter(e => e.TeamID == TeamDA.selected.ID);
                    } else {
                        ProjectDA.showing_list = ProjectDA.list;
                    }
                    update_UI_ListProject(ProjectDA.showing_list);
                    $('.list-project-view').css('display', 'flex');
                    break;
                case EnumEvent.delete:
                    let deleteItem = ProjectDA.list.find((e) => e.ID == data.data.Data);
                    ProjectDA.list.splice(ProjectDA.list.indexOf(deleteItem), 1);
                    update_UI_ListProject(ProjectDA.list);

                    TitleBarDA.list.splice(TitleBarDA.list.indexOf(deleteItem), 1);
                    Ultis.setStorage('list-project-tab', JSON.stringify(TitleBarDA.list));

                    if (TitleBarDA.selectedID == data.data.Data) {
                        TitleBarDA.selectedID = null;
                        Ultis.setStorage('project-tab-selected', null);
                    }

                    TitleBarDA.updateTitleBar();
                case EnumEvent.editcode:
                    ProjectDA.selected.Code = data.data.Data.Code;
                    update_UI_InfoView(ProjectDA.selected, 'project');
                    break;
                case EnumEvent.joinbycode:
                    //window.location.href = 'project-view.html?id=' + data.data.Data;
                    window.location.reload();
                    break;
                case EnumEvent.unDelete:
                    break;
            }
            break;
        //! CUSTOMERTEAM post
        case EnumObj.customerTeam:
            switch (data["enumEvent"]) {
                case EnumEvent.add:
                    TeamDA.selected.CustomerTeamItems.push(data.data.Data);
                    update_UI_InfoView(TeamDA.selected, 'team');
                    $('.popup-background').hide();
                    break;
                case EnumEvent.edit:
                    break;
                case EnumEvent.delete:
                    if (TeamDA.selected.ParentID == null) {
                        TeamDA.list.splice(TeamDA.list.indexOf(TeamDA.selected), 1);
                        update_UI_ListTeam();
                        if (TeamDA.selected?.ID == TeamDA.selected.ID) {
                            history.pushState('', "Home", "/View/home-screen.html?tab=home");
                        }
                        update_SelectedOption();
                    } else {
                        let parent_item = TeamDA.getByID(TeamDA.selected.ParentID);
                        parent_item.ListChild.splice(parent_item.ListChild.indexOf(TeamDA.selected), 1);
                        update_UI_ListTeam();
                        history.pushState('', 'Team', "/View/home-screen.html?tab=team&id=" + parent_item.ID);
                        update_SelectedOption();
                    }
                    break;
            }

            break;
        case EnumObj.customerProject:
            switch (data["enumEvent"]) {
                case EnumEvent.add:
                    // let updateItem = ProjectDA.list.find((e) => e.ID == ProjectDA.selected.ID);
                    ProjectDA.selected.CustomerProjectItems.push(data.data.Data);
                    update_UI_InfoView(ProjectDA.selected, 'project');
                    $('.popup-background').hide();
                    ProjectDA.Permission = 2;
                    break;
                case EnumEvent.delete:
                    ProjectDA.list = ProjectDA.list.filter(e => e.ID != ProjectDA.selected.ID)
                    update_UI_ListProject(ProjectDA.list);
                    break;
            }
            break;
        case EnumObj.customerPage:
            switch (data["enumEvent"]) {
                case EnumEvent.add:
                    PageDA.obj.listCustomerPage.push(data['data']);
                    PageDA.objInvite = null;
                    //showSnackBar(
                    //    context: PopupAddMember.popupAddMemberKey.currentContext,
                    //    type: WSnackBar.colorStyle(
                    //        content: 'Thêm thành viên thành công',
                    //        type: WSnackBarType.success,
                    //    ),
                    //);
                    //PopupAddMember.popupAddMemberKey.currentState.setState(() { });
                    break;
                case EnumEvent.delete:
                    ProjectDA.list =
                        ProjectDA.list.filter(
                            (e) => e.ID != ProjectDA.objOneClick.ID,
                        );
                    reloadApp();
                    break;
            }
            break;
        //! POST api input
        case EnumObj.apiInput:
            switch (data['enumEvent']) {
                case EnumEvent.add:
                    ApiEvent.addInput(data);
                    break;
                case EnumEvent.edit:
                    ApiEvent.editInput(data);
                    break;
                case EnumEvent.delete:
                    ApiEvent.deleteInput(data);
                    break;
            }
            break;
        //! POST api output
        case EnumObj.apiOutput:
            switch (data['enumEvent']) {
                case EnumEvent.add:
                    ApiEvent.addOutput(data);
                    break;
                case EnumEvent.edit:
                    ApiEvent.editOutput(data);
                    break;
                case EnumEvent.delete:
                    ApiEvent.deleteOutput(data);
                    break;
            }
            break;
        //! POST collection
        case EnumObj.collection:
            switch (data['enumEvent']) {
                case EnumEvent.add:
                    let new_collection = data.data.Data;
                    CollectionDA.selected = new_collection;
                    CollectionDA.list.push(new_collection);
                    CollectionDA.update_UI_ListCollection();
                    CollectionDA.set_selected();
                    break;
                case EnumEvent.edit:
                    // let editing_collection = data.data.Data;
                    // CollectionDA.update_UI_ListCollection();
                    // CollectionDA.set_selected(editing_collection.ID);
                    break;
                case EnumEvent.delete:
                    let list_request_delete = CollectionDA.selected.listApi;
                    if (list_request_delete) {
                        RequestDA.list_opening = RequestDA.list_opening.filter(e => !list_request_delete.includes(e));
                        RequestDA.set_ListOpening();
                    }
                    if (list_request_delete.includes(RequestDA.selected)) {
                        let list = RequestDA.list_opening.filter(e => e.ProjectID == pid);
                        if (list.length > 0) {
                            RequestDA.selected = list[list.length - 1];
                            RequestDA.set_TabSelected(RequestDA.selected);
                        } else {
                            RequestDA.selected = null;
                            RequestDA.set_TabSelected(null);
                        }
                    };
                    CollectionDA.list.splice(CollectionDA.list.indexOf(CollectionDA.selected), 1);
                    CollectionDA.update_UI_ListCollection();
                    break;
            }
            break;
        //! POST request
        case EnumObj.request:
            switch (data['enumEvent']) {
                case EnumEvent.add:
                    let new_request = data.data.Data;
                    RequestDA.selected = new_request;
                    // update UI slide bar
                    CollectionDA.selected.listApi.push(new_request);
                    CollectionDA.update_UI_ListCollection();
                    // update list opening & UI opening tab
                    RequestDA.list_opening.push(new_request);
                    RequestDA.set_ListOpening();
                    // update selected request
                    RequestDA.set_TabSelected(new_request);
                    //
                    InputDA.update_listInput();
                    break;
                case EnumEvent.edit:
                    let editing_request = data.data.Data;

                    let index = RequestDA.list_opening.findIndex(e => e.ID == editing_request.ID);
                    RequestDA.list_opening[index] = editing_request;

                    RequestDA.set_ListOpening();

                    // RequestDA.set_TabSelected(editing_request);
                    break;
                case EnumEvent.delete:
                    let list = CollectionDA.selected.listApi;
                    // update UI slide bar
                    list.splice(list.indexOf(RequestDA.selected), 1);
                    CollectionDA.update_UI_ListCollection();
                    // update list opening tab
                    RequestDA.list_opening.splice(RequestDA.list_opening.indexOf(RequestDA.selected), 1);
                    RequestDA.set_ListOpening();
                    // update selected request
                    if (RequestDA.list_opening.length > 0) {
                        RequestDA.set_TabSelected(RequestDA.list_opening[RequestDA.list_opening.length - 1]);
                    } else {
                        RequestDA.set_TabSelected(null);
                    }
                    break;
                case EnumEvent.Save:
                    if (data.data.Code == 200) {
                        RequestDA.selected = data.data.Data;
                        RequestDA.selected.Saved = true;
                        RequestDA.update_list_opening(RequestDA.selected);
                        RequestDA.set_TabSelected(RequestDA.selected);

                        CollectionDA.update_UI_ListCollection();
                        toastr["success"]('Lưu thành công');

                        // RequestDA.selected["isSave"] = true;
                    }
                    break;
            }
            break;
    }
});
socketH.on('server-noti', (data) => {
});

socketH.on('server-refresh', (data) => {
    const href = window.location.href;
    if (data != null && data.data.Code == 200) {
        UserService.setToken(
            data.data.Data.Token, UserService.getRefreshToken()
        );
        if (!href.includes("login-success.html")) {
            location.reload();
        }
    } else {
        let item = {
            type: "warning",
            title: "Thông báo",
            content: "Phiên làm việc của bạn đã hết hạn, vui lòng đăng nhập lại để tiếp tục sử dụng",
            cancelTitle: "Hủy bỏ",
            confirmTitle: "Đồng ý",
            cancelAction: function () {
            },
            confirmAction: function () {
                if (!href.includes("login-success.html")) {
                    window.location.href = '/View/login-view.html';
                } else {
                    window.location.href = '/View/login-web-success.html';
                }
                $('.popup-background').css("display", "none");
            },
        };
        $('.popup-background').append(PopupDA.create_alertPopup_center(item));
        $('.popup-background').css("display", "flex");
        return false;
        // toastr["error"]("Phiên làm việc của bạn đã hết hạn, vui lòng đăng nhập lại!!!");
    }
});

async function emitRefreshToken() {
    await socketH.emit(
        'client-refresh',
        { "headers": UserService.headerRefreshSocket(), 'data': [] },
    );
}

async function emitGet(json, url, enumObj, enumEvent) {
    await socketH.emit(
        'client-get',
        {
            "headers": UserService.headerSocket(),
            "body": json,
            'url': url,
            'data': [],
            "enumObj": enumObj,
            "enumEvent": enumEvent
        },
    );
}

function emitPort(json, url, enumObj, enumEvent) {
    socketH.emit(
        'client-post',
        {
            "headers": UserService.headerSocket(),
            "body": json,
            'url': url,
            'data': [],
            "enumEvent": enumEvent,
            "enumObj": enumObj
        },
    );
}

