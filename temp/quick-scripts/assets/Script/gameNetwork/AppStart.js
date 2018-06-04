(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/gameNetwork/AppStart.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'b138eOALeJJxJ+Gm8GgMV+l', 'AppStart', __filename);
// Script/gameNetwork/AppStart.js

"use strict";

var config = require("config");
var ByteArray = require("ByteArray");
var Protocol = require("Protocol");
var EventHelper = require("EventHelper");
var PlayerDetailModel = require("PlayerDetailModel");

function initMgr() {
    cc.vv = {};
    cc.vv.http = require("HTTP");
    cc.vv.net = require("GameNet");
    // cc.vv.net = require("Net");
}

cc.Class({
    extends: cc.Component,

    properties: {
        labLoading: {
            default: null,
            type: cc.Label
        }
    },
    // use this for initialization
    onLoad: function onLoad() {
        initMgr();
        this.getServerInfo();

        //设置常驻节点
        var myNode = new cc.Node("myNode");
        EventHelper.addPersistRootNode(myNode);
    },
    getServerInfo: function getServerInfo() {
        var params = {};
        params.env = "prod";
        params.ver = "1.0.0";
        params.channel = "weichatgame";
        params.udid = "udid";
        params.pver = "1.0.0";
        params.pchannel = "weichatgame";
        params.presver = "1.0.0";

        var self = this;
        var xhr = null;
        var complete = false;
        var fnRequest = function fnRequest() {
            console.log("正在连接服务器...");
            self.labLoading.string = "正在连接服务器...";
            xhr = cc.vv.http.sendRequest("", params, function (ret) {
                console.log("连接成功");
                self.labLoading.string = "连接成功...";
                xhr = null;
                complete = true;
                config.GlobalRouterUpdate(ret);
                console.log("host:" + config.GlobalRouter.host + ":" + config.GlobalRouter.port);

                self.connectGameServer();
                // self.connectGameServer2();
            }, config.GlobalRouter.director);
            setTimeout(fn, 5000);
        };

        var fn = function fn() {
            if (!complete) {
                if (xhr) {
                    xhr.abort();
                    console.log("连接失败，即将重试...");
                    self.labLoading.string = "连接失败，即将重试...";
                    setTimeout(function () {
                        fnRequest();
                    }, 5000);
                } else {
                    fnRequest();
                }
            }
        };
        fn();
    },
    connectGameServer2: function connectGameServer2() {

        console.log(">>>>>>>>>>>>connectGameServer");
        // this.dissoveData = null;
        cc.vv.net.ip = config.GlobalRouter.host + ":" + config.GlobalRouter.port;
        console.log(cc.vv.net.ip);
        var self = this;

        var onConnectOK = function onConnectOK() {
            console.log("onConnectOK");
            // var sd = {
            //     token:data.token,
            //     roomid:data.roomid,
            //     time:data.time,
            //     sign:data.sign,
            // };
            // cc.vv.net.send("login",sd);
        };

        var onConnectFailed = function onConnectFailed() {
            console.log("failed.");
            // cc.vv.wc.hide();
        };
        // cc.vv.wc.show("正在进入房间");
        cc.vv.net.connect(onConnectOK, onConnectFailed);
    },
    connectGameServer: function connectGameServer() {

        var self = this;

        cc.vv.net.connect(config.GlobalRouter.host, config.GlobalRouter.port, function (ret) {
            //WebSocket连接成功
            self.sendRegist();
        });

        setInterval(function () {
            if (cc.vv.net.isPinging) self.sendHeartBeat();
        }.bind(this), 10000);

        EventHelper.AddCustomEvent(config.MyNode, "Regist", function (event) {
            console.log("Regist---");
            // console.log(event.getUserData());

            var data = event.getUserData();
            config.temppassword = data.data.data.password;
            self.sendLogin();
        });

        EventHelper.AddCustomEvent(config.MyNode, "HeartBeat", function (event) {
            // console.log("HeartBeat---");
            // console.log(event.getUserData());
        });

        EventHelper.AddCustomEvent(config.MyNode, "LoginOK", function (event) {
            console.log("LoginOK---");
            console.log(event.getUserData());
            var data = event.getUserData();
            self.setPlayerDetailModel(data);
        });
    },
    sendHeartBeat: function sendHeartBeat() {
        //发送心跳
        // var info = '{"t":0}';
        var params = {};
        params.t = Protocol.Request.HeartBeat.Alive;
        var info = JSON.stringify(params);
        var view = ByteArray.getView(info, Protocol.Command.HeartBeat);
        cc.vv.net.send("HeartBeat", view);
    },
    sendRegist: function sendRegist() {
        //注册请求
        // var info = '{"t":6,"type":"guest","u":"50ee8041a7fd8baa6348252ea114432bb3be23bd","d":"23c686a260c586ee03ea5fb2b8252770","v":"2.1.1","c":"weichatgame","e":"defaults"}';
        var params = {};
        params.t = Protocol.Request.Login.Regist;
        params.d = "23c686a260c586ee03ea5fb2b8252770";
        params.u = "50ee8041a7fd8baa6348252ea114432bb3be23bd";
        params.v = "2.1.1";
        params.c = "sjweichat";
        params.e = "defaults";
        params.type = "guest";
        var info = JSON.stringify(params);
        var view = ByteArray.getView(info, Protocol.Command.Login);
        cc.vv.net.send("Regist", view);
    },
    sendLogin: function sendLogin() {
        var params = {};
        params.t = Protocol.Request.Login.Guest;
        params.d = "23c686a260c586ee03ea5fb2b8252770";
        params.p = config.temppassword;
        params.c = "sjweichat";
        params.v = "2.1.1";
        params.tv = 1;
        params.e = "defaults";
        params.wn = "";
        params.wurl = "";

        var info = JSON.stringify(params);
        var view = ByteArray.getView(info, Protocol.Command.Login);
        cc.vv.net.send("Login", view);
    },
    setPlayerDetailModel: function setPlayerDetailModel(response) {
        var room = response.data.room;
        console.log(room);

        if (response["code"] == Protocol.Response.Login.OK) {
            var isDevData = response["data"]["isDev"];
            if (isDevData && typeof isDevData == "number") {} else {
                isDevData = 0;
            }
            for (var i = 0; i < room.length; i++) {
                if (room[i].rooms) {
                    for (var j = 0; j < room[i].rooms.length; j++) {
                        room[i].rooms[j].modelId = room[i].modelId;
                    }
                }
            }
            config.playGameId = response["data"].playGameId;
            config.playGameMsg = response["data"].playGameMsg;

            PlayerDetailModel.nickname = response["data"]["nick"];
            PlayerDetailModel.uid = parseInt(response["data"]["uid"]);
            PlayerDetailModel.coin = parseInt(response["data"]["coins"]);
            PlayerDetailModel.gold = parseInt(response["data"]["gold"]);
            PlayerDetailModel.gender = parseInt(response["data"]["sex"]);
            PlayerDetailModel.word = response["data"]["word"];
            PlayerDetailModel.coolnum = response["data"]["cool_num"];
            PlayerDetailModel.level = parseInt(response["data"]["level"]);
            PlayerDetailModel.matches = parseInt(response["data"]["gameData"]["matches"]);
            PlayerDetailModel.win = parseInt(response["data"]["gameData"]["win"]);
            PlayerDetailModel.checkCode = response["data"]["check_code"];
            PlayerDetailModel.propDress = response["data"]["propDress"];
            PlayerDetailModel.score = parseInt(response["data"]["score"]);

            PlayerDetailModel.verfile = parseInt(response["data"]["verfile"]);
            PlayerDetailModel.vertips = parseInt(response["data"]["vertips"]);
            PlayerDetailModel.mailUnread = parseInt(response["data"]["mail_unread"]);
            PlayerDetailModel.coupon = parseInt(response["data"]["coupon"]);
            PlayerDetailModel.age = parseInt(response["data"]["age"]);
            PlayerDetailModel.room = room;
            PlayerDetailModel.contact = response["data"]["contact"];
            PlayerDetailModel.contacts = response["data"]["contacts"];
            PlayerDetailModel.wechat = response["data"]["wechat"];

            PlayerDetailModel.lottery = parseInt(response["data"]["lottery"]);
            PlayerDetailModel.checkinUndo = parseInt(response["data"]["checkin_undo"]);
            PlayerDetailModel.task1Unaward = parseInt(response["data"]["task1_unaward"]);
            PlayerDetailModel.task2Unaward = parseInt(response["data"]["task2_unaward"]);
            PlayerDetailModel.chargeRate = parseInt(response["data"]["charge_rate"]);
            PlayerDetailModel.propItems = response["data"]["propItems"];

            PlayerDetailModel.rewardList = response["data"]["n_reward_list"];

            PlayerDetailModel.wechatImg = response["data"]["img"];
            PlayerDetailModel.title = response["data"]["title"];
            PlayerDetailModel.isDev = isDevData;

            this.labLoading.string = "进入游戏大厅...";

            cc.director.loadScene("HallScene");

            // EventHelper.DispatchCustomEvent(config.MyNode,"EnterHallOK",{});
            // console.log(PlayerDetailModel);
        } else {
            console.log("登陆游戏失败！");

            this.labLoading.string = "登陆游戏失败！";
        }
    }
});

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
        //# sourceMappingURL=AppStart.js.map
        