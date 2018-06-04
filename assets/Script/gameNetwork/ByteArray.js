
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

//前16个字节 len字节长度 cmd 大协议号
ByteArray.getHead = function(len,cmd){ 
    var _bytes = [len,cmd,1,2];
    var strBytes = [];
    for(var i=0;i<_bytes.length;i++){
        // console.log(_bytes[i].toString(16));
        var str16 = _bytes[i].toString(16);
        // (parseInt(str16,16)
        strBytes.push(parseInt(str16,16));
    }
    var xx_Bytes = [];
    for(var i=0;i<strBytes.length;i++){
        for(var j=0;j<3;j++){
            xx_Bytes.push(0);
        }
        xx_Bytes.push(strBytes[i]);
    }
    // console.log(xx_Bytes);
    return xx_Bytes;
}

//获取数据视图
ByteArray.getView = function(info,cmd){
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
