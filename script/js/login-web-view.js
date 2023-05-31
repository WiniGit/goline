{
    $("#login_e_browser_form").validate({
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
        }, submitHandler: function () {
            //onSubmit
            const btnSubmit = document.getElementById("button-login");
            if (btnSubmit.disabled === true) {
                return false;
            } else {
                btnSubmit.style.backgroundColor = "#B0B0B0";
                document.getElementById("loader").style.display = "block";
                //document.getElementById("btn-text").style.display = "none";
                btnSubmit.disabled = true;
                var loginAPi = domainApi + 'Customer/LoginPass?username=' + $('#login-input-email').val() + '&pass=' + $('#login-input-password').val();
                $.post(loginAPi, function (data) {
                    if (data.Code === 200) {
                        btnSubmit.style.backgroundColor = "#366AE2";
                        document.getElementById("loader").style.display = "none";
                        //document.getElementById("btn-text").style.display = "block";
                        btnSubmit.disabled = false;
                        // Ultis.setStorage('token', data.Data.Token);
                        // Ultis.setStorage('refresh-token', data.Data.RefreshToken);
                        UserService.setToken(data.Data.Token, data.Data.RefreshToken);
                        Ultis.set_timeRefreshToken();
                        Ultis.setStorage('customer', JSON.stringify(data.Data));
                        window.location.href = '/View/login-web-success.html';
                    } else {
                        btnSubmit.disabled = false;
                        btnSubmit.style.backgroundColor = "#366AE2";
                        document.getElementById("loader").style.display = "none";
                        //document.getElementById("btn-text").style.display = "block";
                        toastr["error"](data.Message);
                    }
                });

                return false;
            }

        },
    });


    let loginPass = false;
    $(".login-input-visible").click(function () {
        loginPass = !loginPass;
        $('.login-input-visible-img').attr('src', loginPass ? "https://cdn.jsdelivr.net/gh/WiniGit/goline@latest/lib/assets/eye-invisible.svg" : "https://cdn.jsdelivr.net/gh/WiniGit/goline@latest/lib/assets/eye-visible.svg");
        $("#login-input-password").prop("type", loginPass ? "text" : "password");
    });

    $('body').on('keydown', '#btn_browser', function (ev) {
        ev.preventDefault();
    })
}
