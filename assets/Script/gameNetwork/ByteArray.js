
var config = require("config");

var ByteArray = {};

ByteArray.PACKET_HEADER_LENGTH = 16;

ByteArray.encodeUtf8 = function(text){
    const code = encodeURIComponent(text);
    const bytes = [];
    for (var i = 0; i < code.length; i++) {
        const c = code.charAt(i);
        if (c === '%') {
            const hex = code.charAt(i + 1) + code.charAt(i + 2);
            const hexVal = parseInt(hex, 16);
            bytes.push(hexVal);
            i += 2;
        } else bytes.push(c.charCodeAt(0));
    }
    return bytes;
}

ByteArray.decodeUtf8 = function(bytes){
    var encoded = "";
    for (var i = 0; i < bytes.length; i++) {
        encoded += '%' + bytes[i].toString(16);
    }
    // console.log(encoded);
    return decodeURIComponent(encoded);
}

ByteArray.getHead = function(len,cmd){ 
    var _bytes = [len,cmd,1,2];
    var allBytes = [];
    for(var i=0;i<_bytes.length;i++){
        var arr = ByteArray.complementByte(_bytes[i]);
        for(var j = 0;j<arr.length;j++){
            allBytes.push(arr[j]);
        }   
    }
    return allBytes;
}

ByteArray.complementByte = function(code){
    var strHed = code.toString(2);
    //补齐32位
    var complement = "";
    for(var i = 0;i<32-strHed.length;i++){
        complement+="0";
    }
    var allBytes = complement+strHed;
    var arr = [];
    for(var i = 0;i<32;i+=8){
        var strByte = allBytes.substring(i,i+8);
        arr.push(parseInt(strByte,2))
    }
    return arr;
}

//获取数据视图
ByteArray.getView = function(params,cmd){
    var info = JSON.stringify(params);
    var bytes = ByteArray.encodeUtf8(info);
    var buffer = new ArrayBuffer(bytes.length+ByteArray.PACKET_HEADER_LENGTH);
    var view = new DataView(buffer);
    view.setUint32(0, bytes.length+ByteArray.PACKET_HEADER_LENGTH);
    var head = ByteArray.getHead(bytes.length+ByteArray.PACKET_HEADER_LENGTH,cmd);
    for(var i=0;i<head.length;i++){
        view.setUint8(i, head[i]);
    }
    for (var i = 0; i < bytes.length; i++) {
        view.setUint8(i+ByteArray.PACKET_HEADER_LENGTH, bytes[i]);
    }
    return view;
}



module.exports = ByteArray;
