class UserService {
    static getToken() {
        return Ultis.getStorage('token');
    }
    static getRefreshToken() {
        return Ultis.getStorage('refreshToken');
    }
    static setToken(token, refreshToken) {
        Ultis.setStorage('token', token);
        Ultis.setStorage('refreshToken', refreshToken);
        UserService.setTimeRefresh();
    }

    static getUser() {
        return JSON.parse(Ultis.getStorage('customer'));
    }

    static setTimeRefresh() {
        var now = Date.now() / 1000 + 9 * 60;
        Ultis.setStorage('time_refresh', now);
    }

    static getTimeRefresh() {
        return Ultis.getStorage('time_refresh');
    }

    static headerProject() {
        var timeRefresh = UserService.getTimeRefresh();
        var now = Date.now() / 1000;
        if (timeRefresh > 0 && timeRefresh <= now) {
            WiniIO.emitRefreshToken();
            return {
                "refreshToken": UserService.getRefreshToken(),
                "token": UserService.getToken(),
                "pid": StyleDA.skinProjectID ?? ProjectDA.obj?.ID ?? 0,
                "pageid": PageDA.obj?.ID,
                "Content-Type": "application/json"
            };
        } else {
            return {
                "token": UserService.getToken(),
                "refreshToken": "",
                "pid": StyleDA.skinProjectID ?? ProjectDA.obj?.ID,
                "pageid": PageDA.obj?.ID,
                "Content-Type": "application/json"
            };
        }
    }
    static headerFile() {
        var timeRefresh = UserService.getTimeRefresh();
        var now = Date.now() / 1000;
        if (timeRefresh > 0 && timeRefresh <= now) {
            WiniIO.emitRefreshToken();
            return {
                "refreshToken": UserService.getRefreshToken(),
                "token": UserService.getToken(),
                "pid": ProjectDA.obj?.ID ?? 0,
                "pageid": PageDA.obj?.ID,
            };
        } else {
            return {
                "token": UserService.getToken(),
                "refreshToken": "",
                "pid": ProjectDA.obj?.ID,
                "pageid": PageDA.obj?.ID,
            };
        }
    }

    static sokect_homeHeader = {};
    static get_socketHome_header() {
        let timeRefresh = UserService.getTimeRefresh();
        if (timeRefresh) {
            let now = Date.now() / 1000;

        } else {
            // TODO: bạn chưa đăng nhập
        }
    }
    static headerSocket() {
        var timeRefresh = UserService.getTimeRefresh();
        var now = Date.now() / 1000;
        if (timeRefresh > 0 && timeRefresh <= now) {
            emitRefreshToken();
            let headers = {
                "refreshToken": UserService.getRefreshToken(),
                "token": UserService.getToken(),
                "Content-Type": "application/json"
            };
            if (ProjectDA.selected != null) {
                headers.pid = ProjectDA.selected.ID.toString();
            }
            return headers;
        } else {
            let headers = {
                "token": UserService.getToken(),
                "Content-Type": "application/json"
            };
            if (ProjectDA.selected != null) {
                headers.pid = ProjectDA.selected.ID.toString();
            }
            return headers;
        }
    }

    static headerRefreshSocket() {
        return { "refreshToken": UserService.getRefreshToken(), "Content-Type": "application/json" };
    }
}