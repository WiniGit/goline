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
                debugger
            },
            error: function (xhr, status, error) {
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