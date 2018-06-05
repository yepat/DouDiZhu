(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/gameNetwork/ByteArray.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '2ea8aD4dpZIJoQjo0J0vRIF', 'ByteArray', __filename);
// Script/gameNetwork/ByteArray.js

"use strict";

var config = require("config");

var ByteArray = {};

ByteArray.PACKET_HEADER_LENGTH = 16;

ByteArray.encodeUtf8 = function (text) {
    var code = encodeURIComponent(text);
    var bytes = [];
    for (var i = 0; i < code.length; i++) {
        var c = code.charAt(i);
        if (c === '%') {
            var hex = code.charAt(i + 1) + code.charAt(i + 2);
            var hexVal = parseInt(hex, 16);
            bytes.push(hexVal);
            i += 2;
        } else bytes.push(c.charCodeAt(0));
    }
    return bytes;
};

ByteArray.decodeUtf8 = function (bytes) {
    var encoded = "";
    for (var i = 0; i < bytes.length; i++) {
        encoded += '%' + bytes[i].toString(16);
    }
    // console.log(encoded);
    return decodeURIComponent(encoded);
};

ByteArray.getHead = function (len, cmd) {
    var _bytes = [len, cmd, 1, 2];
    var allBytes = [];
    for (var i = 0; i < _bytes.length; i++) {
        var arr = ByteArray.complementByte(_bytes[i]);
        for (var j = 0; j < arr.length; j++) {
            allBytes.push(arr[j]);
        }
    }
    return allBytes;
};

ByteArray.complementByte = function (code) {
    var strHed = code.toString(2);
    //补齐32位
    var complement = "";
    for (var i = 0; i < 32 - strHed.length; i++) {
        complement += "0";
    }
    var allBytes = complement + strHed;
    var arr = [];
    for (var i = 0; i < 32; i += 8) {
        var strByte = allBytes.substring(i, i + 8);
        arr.push(parseInt(strByte, 2));
    }
    return arr;
};

//获取数据视图
ByteArray.getView = function (params, cmd) {
    var info = JSON.stringify(params);
    var bytes = ByteArray.encodeUtf8(info);
    var buffer = new ArrayBuffer(bytes.length + ByteArray.PACKET_HEADER_LENGTH);
    var view = new DataView(buffer);
    view.setUint32(0, bytes.length + ByteArray.PACKET_HEADER_LENGTH);
    var head = ByteArray.getHead(bytes.length + ByteArray.PACKET_HEADER_LENGTH, cmd);
    for (var i = 0; i < head.length; i++) {
        view.setUint8(i, head[i]);
    }
    for (var i = 0; i < bytes.length; i++) {
        view.setUint8(i + ByteArray.PACKET_HEADER_LENGTH, bytes[i]);
    }
    return view;
};

module.exports = ByteArray;

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=ByteArray.js.map
        