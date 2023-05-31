function checkIsLogin() {
    var token = UserService.getToken();
    if (token == null) {
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
