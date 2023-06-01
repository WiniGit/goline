const socketH = io(socketHome
    //    const socketH = io("http://localhost:6001"
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
            let item = {
                type: "warning",
                title: "Thông báo",
                content: "Phiên làm việc của bạn đã hết hạn, vui lòng đăng nhập lại để tiếp tục sử dụng",
                cancelTitle: "Hủy bỏ",
                confirmTitle: "Đồng ý",
                cancelAction: function () {
                },
                confirmAction: function () {
                    window.location.href = '/View/login-tool-view.html';
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

            toastr["error"](data.Message);
            alert(JSON.stringify(data.Data));

    }
});
//! SOCKET GET
socketH.on('server-get', (data) => {
    console.log('server-get: ', data);
    switch (data.enumEvent) {
        default:
            var tok = UserService.getToken();
            if (tok != null && data.headers.token === tok) {
                switch (data.enumObj) {
                    // //! GET TEAM
                    case EnumObj.team:
                        switch (data.enumEvent) {
                            case EnumEvent.init:
                                TeamDA.list = data.data.sort((a, b) => b.DateUpdate - a.DateUpdate);
                                loadding_T_success = true;
                                check_loadingSuccess();
                                break;
                        }
                        break;
                    //! GET PROJECT
                    case EnumObj.project:
                        switch (data.enumEvent) {
                            case EnumEvent.init:
                                ProjectDA.list = data.data.sort((a, b) => b.DateUpdate - a.DateUpdate);
                                loadding_P_success = true;
                                check_loadingSuccess();
                                break;
                            case EnumEvent.getProjectByIDapi: // get API info 
                                CollectionDA.list = data.data.CollectionItems;
                                ProjectDA.selected = data.data;
                                $('.back-container span').text(ProjectDA.selected.Name);
                                // update list collection view
                                CollectionDA.update_UI_ListCollection();
                                // get 
                                api_getDataStorage();
                                ProjectDA.getByID();
                                break;
                            case EnumEvent.getProjectByID:
                                ProjectDA.obj_click = data.data;
                                try {
                                    if (ProjectView.show_option) {
                                        $('.project-option-popup').html(ProjectView.create_projectOptionPopup());
                                        let posEqual = $("body").height() - ProjectView.mouserEvent.pageY;
                                        $('.project-option-popup').css({
                                            top: posEqual > 250 ? ProjectView.mouserEvent.pageY : ProjectView.mouserEvent.pageY - 250,
                                            left: ProjectView.mouserEvent.pageX,
                                            display: "block",
                                        });
                                        ProjectView.show_option = false;
                                    }
                                } catch (error) {
                                    console.log("Catch exception: ", error.message);
                                }
                                try {
                                    if (data.data.RouterJson) {
                                        RouterDA.list = JSON.parse(data.data.RouterJson);
                                    } else {
                                        RouterDA.list = [];
                                    }
                                    RouterDA.update_listRouter();
                                } catch (error) {
                                    console.log("Catch exception: ", error.message);
                                }
                                break;
                        }
                        break;
                    case EnumObj.customer:
                        switch (data["enumEvent"]) {
                            case EnumEvent.get:
                                if (data.data) {
                                    if ($('#info-container').hasClass("team")) {
                                        if (TeamDA.selected.CustomerTeamItems.some((e) => e.CustomerID == data.data.ID)) {
                                            toastr["error"]("Người dùng đã là thành viên trong nhóm này!");
                                        } else {
                                            let customerInviteItem = {
                                                ID: 0,
                                                Permission: ProjectDA.permission,
                                                CustomerID: data.data.ID,
                                                CustomerName: data.data.Email,
                                                TeamID: TeamDA.selected.ID,
                                            }
                                            TeamDA.addCustomerTeam(customerInviteItem);
                                        }
                                    }
                                    else {
                                        if (ProjectDA.selected.CustomerProjectItems.some(e => e.CustomerID == data.data.ID)) {
                                            toastr["error"]("Người dùng đã là thành viên của dự án này!");
                                        } else {
                                            let customerInviteItem = {
                                                ID: 0,
                                                Permission: ProjectDA.permission,
                                                CustomerID: data.data.ID,
                                                CustomerName: data.data.Email,
                                                ProjectID: ProjectDA.selected.ID,
                                            }
                                            ProjectDA.addCustomerProject(customerInviteItem);
                                        }
                                    }
                                }
                                else {
                                    toastr["error"]("Người dùng chưa đăng ký tài khoản Wini!");
                                }
                                break;
                            case EnumEvent.edit:
                                break
                        }
                        break;
                }
            }
            break;
    }
});

socketH.on('server-post', (data) => {
    console.log('server-post: ', data);
    switch (data["enumObj"]) {
        //! TEAM post
        case EnumObj.team:
            switch (data["enumEvent"]) {
                case EnumEvent.add:
                    if (data.data.Code === 200) {
                        let new_item = data.data.Data;
                        if (new_item.ParentID == null) {
                            let new_HTML = '<div class=" team-container col">';
                            new_HTML += TeamView.create_teamNav(new_item);
                            if (new_item.ListChild.length > 0) {
                                for (let child of item.ListChild) {
                                    new_HTML += TeamView.create_teamChildNav(child);
                                }
                            }
                            new_HTML += '</div>';
                            $('.list-team-container').append(new_HTML);
                            TeamDA.push(new_item);
                            TeamDA.list = TeamDA.list.sort((a, b) => a.DateUpdate - b.DateUpdate);
                        } else {
                            let new_HTML = TeamView.create_teamChildNav(new_item);
                            $(`.team-nav[data-id=${new_item.ParentID}]`).parent().append(new_HTML);
                            let team_parent = TeamDA.list.find(e => e.ID == new_item.ParentID);
                            team_parent.ListChild.push(new_item);
                        }
                    } else {
                        toastr["error"](data.data.Message);
                    }
                    break;
                case EnumEvent.create:
                    TeamDA.list.push(data.data.Data);
                    TeamDA.selected = data.data.Data;
                    window.location.href = '/View/home-screen.html?tab=team&id=' + TeamDA.selected.ID;
                    break;
                case EnumEvent.edit:
                    break
                case EnumEvent.delete:
                    if (TeamDA.selected.ParentID == null) {
                        $(`.team-nav[data-id=${TeamDA.selected.ID}]`).parent().remove();
                        TeamDA.list = TeamDA.list.filter(e => e != TeamDA.selected);

                        window.history.pushState(null, null, "/View/home-screen.html?tab=recent");
                        switch_tab_selected("recent");
                    }
                    else {
                        $(`.team-child-nav[data-id=${TeamDA.selected.ID}]`).remove();
                        let team_parent = TeamDA.list.find(e => e.ID == TeamDA.selected.ParentID);
                        team_parent.ListChild = team_parent.ListChild.filter(e => e != TeamDA.selected);

                        window.history.pushState(null, null, "/View/home-screen.html?tab=team?id=" + team_parent.ID);
                        switch_tab_selected("team", team_parent.ID);
                    }
                    break
            }
            break;
        case EnumObj.customerTeam:
            switch (data["enumEvent"]) {
                case EnumEvent.add:
                    TeamDA.selected.CustomerTeamItems.push(data.data.Data);

                    let info_new_member = InfoView.create_memberTile(data.data.Data);
                    $('#info-container .list-member').append(info_new_member);

                    let popup_new_member = HomePopup.create_memberRow(data.data.Data);
                    $('.popup-invite-member .list-member').append(popup_new_member);

                    ProjectDA.Permission = 2;
                    break
                case EnumEvent.edit:
                    break
                case EnumEvent.delete:
                    if (TeamDA.selected.ParentID == null) {
                        $(`.team-nav[data-id=${TeamDA.selected.ID}]`).remove();
                        TeamDA.list = TeamDA.list.filter(e => e != TeamDA.selected);
                    } else {
                        $(`.team-child-nav[data-id=${TeamDA.selected.ID}]`).remove();
                        TeamDA.selected.ListChild = TeamDA.list.ListChild.filter(e => e != TeamDA.selected);
                    }
                    toastr["success"]('Thêm thành công');
                    break;
            }
            break;
        //! PROJECT post
        case EnumObj.project:
            switch (data["enumEvent"]) {
                case EnumEvent.add:
                    let new_project = data.data.Data;
                    ProjectDA.list.push(new_project);

                    ProjectDA.selected = ProjectDA.obj = new_project;

                    TitleBarDA.list.push(new_project);
                    Ultis.setStorage('project-tab-selected', new_project.ID);
                    Ultis.setStorage('list-project-tab', JSON.stringify(TitleBarDA.list));

                    window.location.href = "/View/project-design-view.html?id=" + new_project.ID;
                    break;
                case EnumEvent.edit:
                    break;
                case EnumEvent.delete:
                    $('#info-container .info_block').css("visibility", "hidden");
                    $(`.project-card[data-id=${ProjectDA.selected.ID}], .project-tile[data-id=${ProjectDA.selected.ID}]`).remove();
                    break;
            }
            break;
        case EnumObj.customerProject:
            switch (data["enumEvent"]) {
                case EnumEvent.add:
                    ProjectDA.selected.CustomerProjectItems.push(data.data.Data);
                    let new_HTML = InfoView.create_memberTile(data.data.Data);
                    $('#info-container .list-member').append(new_HTML);

                    let popup_new_member = HomePopup.create_memberRow(data.data.Data);
                    $('.popup-invite-member .list-member').append(popup_new_member);

                    ProjectDA.Permission = 2;
                    toastr["success"]('Thêm thành công');
                    break
                case EnumEvent.edit:
                    break
                case EnumEvent.delete:
                    $(`.project-card[data-id=${ProjectDA.selected.ID}], .project-tile[data-id=${ProjectDA.selected.ID}]`).remove();
                    ProjectDA.list = ProjectDA.list.filter(e => e != ProjectDA.selected);
                    break
            }
            break;
        //! POST collection
        case EnumObj.collection:
            debugger
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
                    window.location.href = '/View/login-tool-view.html';
                } else {
                    window.location.href = '/View/login-web-view.html';
                }
                $('.popup-background').css("display", "none");
            },
        };
        $('.popup-background').append(PopupDA.create_alertPopup_center(item));
        $('.popup-background').css("display", "flex");
    }
});

socketH.on('server-google', (data) => {
    UserService.setToken(data.Data.Token, data.Data.RefreshToken);
    Ultis.setStorage('customer', JSON.stringify(data.Data));
    window.location.href = '/View/home-screen.html?tab=home';
});

async function emitRefreshToken() {
    await socketH.emit('client-refresh',
        { "headers": UserService.headerRefreshSocket(), 'data': [] },
    );
}

async function emitGet(json, url, enumObj, enumEvent) {
    await socketH.emit('client-get',
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
    socketH.emit('client-post',
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

