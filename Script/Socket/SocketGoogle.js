
const socketG = io(socketWini
    // const socketG = io("ws://10.15.138.23:4000"
    , {
        //reconnectionDelayMax: 1000,
        auth: {
            token: "123"
        },
        query: {
            "my-key": "my-value"
        }
    });
socketG.on("connect", () => {
    console.log(socketG.id); // "G5p5..."
    console.log(socketG.connected); // true
});
//socket.io.on("error", (error) => {
//	// ...
//	socket.io.on("reconnect_attempt", (attempt) => {
//		// ...
//	});
//});
socketG.io.on("ping", () => {
    //console.log("ping_connect");
});

socketG.on('server-log', (data) => {
    switch (data["Code"]) {
        case StatusApi.refreshToken:
            //wShowPopup(
            //    context: EnumWg.context,
            //    type: WPopup.oneSolidButton(
            //        context: EnumWg.context,
            //        popupType: WPopupType.warning,
            //        title: 'Thông báo',
            //        content: 'Phiên làm việc của bạn đã hết hạn, vui lòng đăng nhập lại!!!',
            //        onAccept: () {
            //            Navigator.pushReplacement(
            //                EnumWg.context,
            //                MaterialPageRoute(builder: (context) => UserLogin()),
            //            );
            //        },
            //    ),
            //);
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
    }
});
//! SOCKET GET
socketG.on('server-google',
    (data) => {
        console.log(data);
        // Ultis.setStorage('token', data.data.Token);
        // Ultis.setStorage('refresh-token', data.data.RefreshToken);
        Ultis.set_timeRefreshToken();
        UserService.setToken(data.data.Token, data.data.RefreshToken);
        Ultis.setStorage('customer', JSON.stringify(data.data));
        window.location.href = '/wini-login/login-web/login-success.html';
    });

async function emitGetGoogle(json, url) {
    await socketG.emit(
        'client-google',
        {
            "headers": "",
            "body": json,
            'url': url,
            'data': [],
            "userId": socketG.id
        },
    );
}
