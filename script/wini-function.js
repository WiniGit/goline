function checkIsLogin() {
    var token = UserService.getToken();
    if (UserService.getToken() == null) {
        window.location.href = '/View/login-tool-view.html';
    }
}

function checkSucces() {
    var token = UserService.getToken();
    if (token == null) {
        window.location.href = '/View/login-web-view.html';
    } else {
        // emitRefreshToken();
    }
}
function checkToken() {
    var token = UserService.getToken();
    if (token != null) {
        window.location.href = '/View/login-web-success.html';
    }
}

function check_loginSuccess() {
    let now = Date.now();
    let time_refresh = Ultis.get_timeRefreshToken();
    if (time_refresh - now < 0) {
        window.location.href = '/View/login-web-success.html';
    }
}