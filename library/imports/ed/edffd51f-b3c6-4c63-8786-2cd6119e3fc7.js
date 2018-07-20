"use strict";
cc._RF.push(module, 'edffdUfs8ZMY4eGLNYRnj/H', 'HTTP');
// Script/gameNetwork/HTTP.js

"use strict";

var URL = "http://39.108.156.104:9000";

var HTTP = cc.Class({
    extends: cc.Component,

    statics: {
        sessionId: 0,
        userId: 0,
        master_url: URL,
        url: URL,
        sendRequest: function sendRequest(path, data, handler, extraUrl) {
            var xhr = cc.loader.getXMLHttpRequest();
            xhr.timeout = 5000;
            var str = "?";
            for (var k in data) {
                if (str != "?") {
                    str += "&";
                }
                str += k + "=" + data[k];
            }
            if (extraUrl == null) {
                extraUrl = HTTP.url;
            }
            var requestURL = extraUrl + path + encodeURI(str);
            console.log("RequestURL:" + requestURL);
            xhr.open("POST", requestURL, true); //POST GET
            if (cc.sys.isNative) {
                xhr.setRequestHeader("Accept-Encoding", "gzip,deflate", "text/html;charset=UTF-8");
            }
            xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && xhr.status >= 200 && xhr.status < 300) {
                    console.log("http res(" + xhr.responseText.length + "):" + xhr.responseText);
                    try {
                        var ret = JSON.parse(xhr.responseText);
                        if (handler !== null) {
                            handler(ret);
                        }
                    } catch (e) {
                        console.log("err:" + e);
                        //handler(null);
                    } finally {
                        if (cc.vv && cc.vv.wc) {
                            //       cc.vv.wc.hide();    
                        }
                    }
                }
            };

            if (cc.vv && cc.vv.wc) {
                //cc.vv.wc.show();
            }
            xhr.send();
            return xhr;
        }
    }
});

cc._RF.pop();