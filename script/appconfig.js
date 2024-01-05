var domainUrl = 'http://localhost:3000/';

var domainApi = 'https://apip.wini.vn/';
// 
var socketHome = "wss://home.wini.vn";
// var socketWini = "wss://server.wini.vn";
var socketWiniFile = "https://server.wini.vn";

var urlFile = "https://file.wini.vn/";
// var urlFile = "https://demo.wini.vn/";
var downloadUrl = "http://download.wini.vn/";

// var domainApi = 'http://192.168.1.20:82/';

// var socketHome = "ws://192.168.1.20:6001";
var socketWini = "ws://10.15.144.126:4000";

// var urlFile = "http://192.168.1.18:86/";

var homeUrl = '/View/';
// var homeUrl = '/wini-test/home/'

const pathUrl = 'https://customer.wini.vn/api';

const base_headers = (contenttype) => {
    return {
        token: localStorage.getItem("token"),
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Accept": "application/json",
        "Content-Type": contenttype != null ? contenttype : "application/json-patch+json",
    };
};