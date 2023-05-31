{
    $("#login_form").validate({
        rules: {
            Password: {
                required: true, minlength: 3
            }, Email: {
                required: true, email: true, minlength: 3
            }
        }, messages: {
            Password: {
                required: "Trường này là bắt buộc.", minlength: "Vui lòng nhập ít nhất 3 ký tự."
            }, Email: {
                required: "Trường này là bắt buộc.",
                email: "Vui lòng nhập một địa chỉ email hợp lệ.",
                minlength: "Vui lòng nhập ít nhất 3 ký tự."
            }
        },
        submitHandler: function (ev) {
            const btnSubmit = document.getElementById("button-login");
            if (btnSubmit.disabled === true) {
                return false;
            } else {
                btnSubmit.style.backgroundColor = "#B0B0B0";
                $("#button-login #btn-text").hide();
                $("#button-login #loader").show();
                btnSubmit.disabled = true;
                var loginAPi = domainApi + 'Customer/LoginPass?username=' + $('#login-input-email').val() + '&pass=' + $('#login-input-password').val();
                $.post(loginAPi, function (data) {
                    if (data.Code === 200) {
                        btnSubmit.style.backgroundColor = "#366AE2";
                        $("#button-login #loader").hide();
                        $("#button-login #btn-text").show();
                        btnSubmit.disabled = false;
                        UserService.setToken(data.Data.Token, data.Data.RefreshToken);
                        Ultis.set_timeRefreshToken();
                        Ultis.setStorage('customer', JSON.stringify(data.Data));
                        window.location.href = '/View/home-screen.html?tab=home';
                    } else {
                        btnSubmit.disabled = false;
                        btnSubmit.style.backgroundColor = "#366AE2";
                        $("#button-login #loader").hide();
                        $("#button-login #btn-text").show();
                        toastr["error"](data.Message);
                    }
                });
                return false;
            }
        },
    });


    let loginPass = false;
    $(".login-input-visible").on('click', function () {
        loginPass = !loginPass;
        $('.login-input-visible-img').attr('src', loginPass ? "/lib/assets/eye-invisible.svg" : "/lib/assets/eye-visible.svg");
        $("#login-input-password").prop("type", loginPass ? "text" : "password");
    });
}

try {
    const ipcRenderer = require('electron').ipcRenderer;
    const btnclick = document.getElementById('btn_browser');
    console.log("HDH:" + navigator.platform);
    btnclick.addEventListener('click', function () {
        ipcRenderer.send('asynchronous-web', 'ping');
    });

    $('body').on('keydown', '#btn_browser', function (ev) {
        ev.preventDefault();
    })
} catch (error) {

}