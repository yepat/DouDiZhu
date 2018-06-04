"use strict";
cc._RF.push(module, '51232MuRg1Etoh6eMoOYPIJ', 'config');
// Script/config.js

"use strict";

var config = {};

config.MyNode = null; //常驻节点

config.temppassword = "";

config.playGameId = 0; //断线
config.playGameMsg = "";

config.roomModelId = 0; //房间模式

//房间模式
config.ModelId = { normal: 0, contest: 3, lazarillo: 2 };

config.pokerCardType = {
    // spade : "spade",//黑桃
    // hearts : "hearts",//红桃
    // redslice : "redslice",//红方
    // blackberry : "blackberry",//黑梅
    spade: 1, //黑桃
    hearts: 2, //红桃
    redslice: 3, //红方
    blackberry: 4 //黑梅
};

config.ghostCardType = {
    bigG: "bigG", //大王
    smallG: "smallG" //小王


    //数组降序排列
};config.arrayDown = function (val1, val2) {
    return val2 - val1;
};
//数组升序排列
config.arrayUp = function (val1, val2) {
    return val1 - val2;
};
//截取数组的一部分
config.arraySub = function (index, count, arr) {
    var newarr = [];
    for (var i = index; i < count; i++) {
        newarr.push(arr[i]);
    }
    return newarr;
};

config.arraySub2 = function (index, count, arr) {
    var newarr = [];
    for (var i = index; i < count; i++) {
        newarr.push(arr[i]);
        newarr.push(arr[i]);
    }
    return newarr;
};

config.arraySub3 = function (index, count, arr) {
    var newarr = [];
    for (var i = index; i < count; i++) {
        newarr.push(arr[i]);
        newarr.push(arr[i]);
        newarr.push(arr[i]);
    }
    return newarr;
};

config.seatPos = {
    center: {
        pokerScale: 1, //0.5
        disBetween: 77, //45
        positionY: 250
    },
    left: {
        pokerScale: 0.38,
        disBetween: 27,
        positionY: 860
    },
    right: {
        pokerScale: 0.38,
        disBetween: 27,
        positionY: 860
    }

};

config.opratType = {
    callLoad: 1, //叫地主
    grabLoad: 2, //抢地主
    mustOutCard: 3 //自己必须出牌


    //牌型编号
};config.CardType = {
    Single: 1, //单张
    Pair: 2, //对子
    ThreeOfKind: 3, //三不带
    ThreeOfKindPlusOne: 4, //三带一
    ThreeOfKindPlusPair: 5, //三带二
    Straight: 6, //顺子
    StraightDouble: 7, //双顺  33 44 55
    StraightThree: 8, //三顺  333 444    飞机  [333 444 555 a b c/ aa bb cc]
    StraightThreePlusSingle: 9, //三顺+散牌 飞机带翅膀  333 444 5 6 / +一对
    StraightThreePlusPair: 10, //三顺+对   飞机带翅膀  333 444 66 77
    SoftBomb: 87, //软炸弹
    Bomb: 88, //炸弹
    LazarilloBomb: 89, //纯癞子炸弹
    DoubleKing: 99, //双王
    FourPlusOne: 11, //四带1, 四只带两只单牌
    FourPlusTwo: 12 //四带2, 四只带两对
};

config.GlobalRouter = {
    director: "http://ddzprotocal.51864.com/clientConfig/host.php", // host_inner
    statistics: "http://applog.51864.com/index.php",
    host: null,
    port: null,
    versionUrl: null,
    downloadUrl: null,
    filepath: null,
    resversion: null, //热更新版本号
    silenceVerUrl: null, //静默下载资源版本文件地址
    silenceFileUrl: null, //静默下载资源文件地址
    configtable: null
};

config.GlobalRouterUpdate = function (json) {
    config.GlobalRouter.host = json.data.host;
    config.GlobalRouter.port = json.data.port;
    config.GlobalRouter.versionUrl = json.data.update.versionUrl;
    config.GlobalRouter.downloadUrl = json.data.update.downloadUrl;
    config.GlobalRouter.resversion = json.data.update.resversion;
};

//房间配置
RoomConfig = {
    0: { name: "新手场", umengEvent: "novice_room", pot: 5, min: 1000, max: 80000, texture: "room_1.png", roomId: 1000, roomNameTexture: "p_novice_bar.png" },
    1: { name: "初级场", umengEvent: "primary_room", pot: 10, min: 2000, max: 200000, texture: "room_2.png", roomId: 1001, roomNameTexture: "p_primary_bar.png" },
    2: { name: "中级场", umengEvent: "intermediate_room", pot: 10, min: 2000, max: 200000, texture: "room_3.png", roomId: 1002, roomNameTexture: "p_intermediate_bar.png" },
    3: { name: "高级场", umengEvent: "senior_room", pot: 10, min: 2000, max: 200000, texture: "room_4.png", roomId: 1003, roomNameTexture: "p_senior_bar.png" },
    4: { name: "竞技场", umengEvent: "contest_room", pot: 10, min: 5000, max: 50000, texture: "room_JJC.png", roomId: 1004, roomNameTexture: "p_primary_arena_bar.png" },
    5: { name: "无限场", umengEvent: "advanced_room", pot: 50, min: 10000, max: 1000000, texture: "room_5.png", roomId: 1006, roomNameTexture: "p_advanced_bar.png" },

    6: { name: "新手场", umengEvent: "l_novice_room", pot: 50, min: 10000, max: 1000000, texture: "room_1.png", roomId: 1007, roomNameTexture: "p_novice_bar.png" },
    7: { name: "初级场", umengEvent: "l_primary_room", pot: 50, min: 10000, max: 1000000, texture: "room_2.png", roomId: 1008, roomNameTexture: "p_primary_bar.png" },
    8: { name: "中级场", umengEvent: "l_intermediate_room", pot: 50, min: 10000, max: 1000000, texture: "room_3.png", roomId: 1009, roomNameTexture: "p_intermediate_bar.png" },
    9: { name: "高级场", umengEvent: "l_senior_room", pot: 50, min: 10000, max: 1000000, texture: "room_4.png", roomId: 1010, roomNameTexture: "p_senior_bar.png" },
    10: { name: "无限场", umengEvent: "l_noRate_room", pot: 50, min: 10000, max: 1000000, texture: "room_5.png", roomId: 1011, roomNameTexture: "p_senior_bar.png" }
};

module.exports = config;

cc._RF.pop();