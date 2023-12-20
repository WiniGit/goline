class PermissionDA {
    static async getCustomerItem(email) {
        // var url = 'Customer/GetByPhone?mobile=' + email;
        // if (ProjectDA.obj.ID != 0) {
        //     WiniIO.emitGet(null, url, EnumObj.customer, EnumEvent.get);
        // } else {
        //     emitGet(null, url, EnumObj.customer, EnumEvent.get);
        // }
        const url = `${pathUrl}/Customer/search?email=${email}`;

        await $.ajax({
            url: url,
            type: 'GET',
            contentType: 'application/json',
            success: async function (data) {
                if ($('#info-container').hasClass("team")) {
                    if (TeamDA.selected.CustomerTeamItems.some((e) => e.CustomerID == data.Data.ID)) {
                        toastr["error"]("Người dùng đã là thành viên trong nhóm này!");
                    } else {
                        let customerInviteItem = {
                            ID: 0,
                            Permission: ProjectDA.permission,
                            CustomerID: data.Data.ID,
                            CustomerName: data.Data.Email,
                            TeamID: TeamDA.selected.ID,
                            UrlAvatar: data.Data.UrlAvatar,
                        }
                        TeamDA.addCustomerTeam(customerInviteItem);
                    }
                }
                else {
                    if (ProjectDA.selected.CustomerProjectItems.some(e => e.CustomerID == data.Data.ID)) {
                        toastr["error"]("Người dùng đã là thành viên của dự án này!");
                    } else {
                        let customerInviteItem = {
                            ID: 0,
                            Permission: ProjectDA.permission,
                            CustomerID: data.Data.ID,
                            CustomerName: data.Data.Email,
                            ProjectID: ProjectDA.selected.ID,
                            UrlAvatar: data.Data.UrlAvatar,
                        }
                        ProjectDA.addCustomerProject(customerInviteItem);
                    }
                }
            },
            error: function (xhr, status, error) {
                toastr["error"]("Người dùng chưa đăng ký tài khoản Wini!");
            }
        });
    }
    static editCustomerItem(item) {
        var url = 'Customer/UpdateAcount';
        if (ProjectDA.obj.ID != 0) {
            WiniIO.emitPort(item, url, EnumObj.customer, EnumEvent.edit);
        } else {
            emitPort(item, "Customer/UpdateAcount", EnumObj.customer, EnumEvent.edit);
        }
    }
    static getByCode(code) {
        let url = 'UrPermission/GeIDByCode?code=' + code;
        if (code.length == 12) {
            emitGet(null, url, EnumObj.team, EnumEvent.getByCode);
        } else if (code.length == 14) {
            emitGet(null, url, EnumObj.project, EnumEvent.getByCode);
        } else if (code.length == 16) {
            emitGet(null, url, EnumObj.page, EnumEvent.getByCode);
        } else {
            toastr.error('Mã code không đúng!');
        }
    }
}