{
    let signupPass = false;
    $(".signup-input-visible").on("click", function () {
        signupPass = !signupPass;
        $('.signup-input-visible-img').attr('src', signupPass ? "https://cdn.jsdelivr.net/gh/WiniGit/goline@c082ccf/lib/assets/eye-invisible.svg" : "https://cdn.jsdelivr.net/gh/WiniGit/goline@c082ccf/lib/assets/eye-visible.svg");
        $("#signup-input-password").prop("type", signupPass ? "text" : "password");
    });

    let signupRePass = false;
    $(".signup-re-input-visible").on("click", function () {
        signupRePass = !signupRePass;
        $('.signup-re-input-visible-img').attr('src', signupRePass ? "https://cdn.jsdelivr.net/gh/WiniGit/goline@c082ccf/lib/assets/eye-invisible.svg" : "https://cdn.jsdelivr.net/gh/WiniGit/goline@c082ccf/lib/assets/eye-visible.svg");
        $("#signup-re-input-password").prop("type", signupRePass ? "text" : "password");
    });

    $("#button-cancel-signup").on("click", function () {
        window.location.href = "/View/login-tool-view.html";
    });
    $("#signup-form").validate({
        rules: {
            Password:
            {
                required: true,
                minlength: 3
            },
            Fullname:
            {
                required: true,
                minlength: 3
            },
            rePassword: {
                required: true,
                minlength: 3,
                equalTo: "#signup-input-password"
            },
            Email:
            {
                required: true,
                email: true,
                minlength: 3
            }
        },
        messages: {
            Password:
            {
                required: "Trường này là bắt buộc.",
                minlength: "Vui lòng nhập ít nhất 3 ký tự."
            },
            Fullname:
            {
                required: "Trường này là bắt buộc.",
                minlength: "Vui lòng nhập ít nhất 3 ký tự."
            },
            rePassword:
            {
                required: "Trường này là bắt buộc.",
                minlength: "Vui lòng nhập ít nhất 3 ký tự.",
                equalTo: "Nhắc lại mật khẩu không chính xác"
            },
            Email:
            {
                required: "Trường này là bắt buộc.",
                email: "Vui lòng nhập một địa chỉ email hợp lệ.",
                minlength: "Vui lòng nhập ít nhất 3 ký tự."
            }
        },
        submitHandler: function () { //onSubmit
            const btnSubmit = document.getElementById("button-signup");
            if (btnSubmit.disabled === true) {
                return false;
            } else {
                btnSubmit.style.backgroundColor = "#B0B0B0";
                $("#button-signup #btn-text").hide();
                $("#button-signup #loader").show();
                btnSubmit.disabled = true;
                var signupApi = domainApi + 'Customer/Add';
                $.post(signupApi, Ultis.convertFormToJSON('#signup-form'), function (data) {
                    if (data.Code === 200) {
                        $("#button-signup #loader").hide();
                        $("#button-signup #btn-text").show();
                        btnSubmit.disabled = false;
                        UserService.setToken(data.Data.Token, data.Data.RefreshToken);
                        Ultis.set_timeRefreshToken();
                        Ultis.setStorage('customer', JSON.stringify(data.Data));
                        window.location.href = '/View/login-web-success.html';
                    } else {
                        $("#button-signup #loader").hide();
                        $("#button-signup #btn-text").show();
                        toastr["error"](data.Message);
                        btnSubmit.disabled = false;
                        btnSubmit.style.backgroundColor = "#366AE2";
                    }
                });
                return false;
            }
        }
    });

    let loginPass = false;
    $("body").on('click', '.login-input-visible', function () {
        loginPass = !loginPass;
        $(this).parent().find('.login-input-visible-img').attr('src', loginPass ? "https://cdn.jsdelivr.net/gh/WiniGit/goline@c082ccf/lib/assets/eye-invisible.svg" : "https://cdn.jsdelivr.net/gh/WiniGit/goline@c082ccf/lib/assets/eye-visible.svg");
        $(this).parent().find('input').prop("type", loginPass ? "text" : "password");
    });
    // $('#button-signup').on('click', function (ev) {
    //     ev.preventDefault();
    //     var resgisterAPi = 'Customer/Add';
    //     emitPort(Ultis.convertFormToJSON('#signup-form'), resgisterAPi, EnumObj.User, EnumEvent.registor);
    // })
}

// const ipcRenderer = require('electron').ipcRenderer;
// const btnclickSignin = document.getElementById('btn_browser_signup');
// console.log("HDH:" + navigator.platform);
// btnclickSignin.addEventListener('click', function () {
//     ipcRenderer.send('asynchronous-signup-web', 'ping');
// });