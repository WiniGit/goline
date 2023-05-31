var userItem = JSON.parse(Ultis.getStorage('customer'));
$(".login-success-customer-email").text(userItem.Email);

let callback = document.getElementById("callback-href");
// callback.href = `wini://open-url/`
callback.href = `wini://${btoa(encodeURIComponent(JSON.stringify(userItem)))}`
callback.onclick = function () {
    // window.close();
}