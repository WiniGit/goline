class TeamDA {
    static urlCtr = "WTeam/";

    static list = [];
    static obj = {};

    static selected = { ID: 0 };
    static objInvite = {};

    // static getById(id) {
    //     var url = TeamDA.urlCtr + 'GetbyteamId?id=' + id;
    //     emitGet(null, url, EnumObj.team, EnumEvent.get);
    // }

    static getByID(ID) {
        let _list = [...TeamDA.list, ...TeamDA.list.map(item => item.ListChild).reduce((a, b) => a.concat(b))]
        return _list.find(e => e.ID == ID);
    }

    static getPermission(team) {
        return team.CustomerTeamItems.find((e) => e.CustomerID == userItem.ID)?.Permission;
    }

    static getProjectbyTeamId(id) {
        var url = TeamDA.urlCtr + 'GetbyteamId?id=' + id;
        emitGet(null, url, EnumObj.team, EnumEvent.getProjectByID);
    }

    static init() {
        var url = TeamDA.urlCtr + 'ListItem';
        emitGet(null, url, EnumObj.team, EnumEvent.init);
    }

    static add(obj) {
        var url = TeamDA.urlCtr + 'Add';
        emitPort(obj, url, EnumObj.team, EnumEvent.add);
    }
    static create(obj) {
        var url = TeamDA.urlCtr + 'Add';
        emitPort(obj, url, EnumObj.team, EnumEvent.create);
    }

    static edit(obj) {
        var url = TeamDA.urlCtr + 'Edit';
        emitPort(obj, url, EnumObj.team, EnumEvent.edit);
    }

    static deleted(obj) {
        var url = TeamDA.urlCtr + 'Delete';
        emitPort(obj, url, EnumObj.team, EnumEvent.delete);
    }

    static leave(obj) {
        var url = TeamDA.urlCtr + 'Leave';
        emitPort(obj, url, EnumObj.team, EnumEvent.leave);
    }

    static addCustomerTeam(obj) {
        var url = 'UrPermission/AddCustomerTeam';
        emitPort(obj, url, EnumObj.customerTeam, EnumEvent.add);
    }

    static editCustomerTeam(obj) {
        var url = 'UrPermission/EditCustomerTeam';
        emitPort(obj, url, EnumObj.customerTeam, EnumEvent.edit);
    }

    static deleteCustomerTeam(id) {
        var url = 'UrPermission/DeleteCustomerTeam?id=' + id;
        emitPort(null, url, EnumObj.customerTeam, EnumEvent.delete);
    }
}