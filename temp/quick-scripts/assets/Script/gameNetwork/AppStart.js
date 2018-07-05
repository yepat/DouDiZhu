(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/gameNetwork/AppStart.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'b138eOALeJJxJ+Gm8GgMV+l', 'AppStart', __filename);
// Script/gameNetwork/AppStart.js

"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var config = require("config");
// var ByteArray = require("ByteArray");
var Protocol = require("Protocol");
var EventHelper = require("EventHelper");
var PlayerDetailModel = require("PlayerDetailModel");
var dialogManager = require("dialogManager");
var MD5 = require("md5");

function initMgr() {
    cc.vv = {};
    cc.vv.http = require("HTTP");
    cc.vv.net = require("GameNet");

    var AudioMgr = require("AudioMgr");
    cc.vv.audioMgr = new AudioMgr();
    cc.vv.audioMgr.init();
}

cc.Class({
    extends: cc.Component,
    properties: {
        labLoading: {
            default: null,
            type: cc.Label
        },
        progress: {
            default: null,
            type: cc.Label
        }
    },
    // use this for initialization
    onLoad: function onLoad() {
        initMgr();
        this.progress.string = "";
        this.shareUid = 0;
        if (typeof wx == "undefined") {
            this.getServerInfo();
        } else {
            this.weixinLogin();
        }
        //设置常驻节点
        var myNode = new cc.Node("myNode");
        EventHelper.addPersistRootNode(myNode);
        this.isShow = false;

        console.log("typeof(wx):" + (typeof wx === "undefined" ? "undefined" : _typeof(wx)));
        if (typeof wx == "undefined") {
            return;
        }

        wx.setKeepScreenOn({
            keepScreenOn: true,
            success: function success(res) {
                console.log("设置保持常亮状态成功。", res);
            },
            fail: function fail(res) {
                console.log("设置保持常亮状态失败。", res);
            }
        });

        wx.showShareMenu({
            withShareTicket: true
        });
        cc.loader.loadRes("shareImg", function (err, data) {
            console.log("url:" + data.url);
            wx.onShareAppMessage(function (res) {
                return {
                    title: "小伙伴们帮帮忙，小手一点助我拿豆！",
                    imageUrl: data.url,
                    query: "key=" + PlayerDetailModel.uid,
                    success: function success(res) {
                        console.log("转发成功!!!");
                        console.log(res);
                    },
                    fail: function fail(res) {
                        console.log("转发失败!!!");
                    }
                };
            });
        });
    },
    weixinLogin: function weixinLogin() {
        var self = this;
        wx.login({
            success: function success(ress) {
                if (ress.code) {
                    var _url = "https://sdk.youjoy.tv/Api/ThirdParty/WxSmallProgram/Login";
                    var params = {};
                    params.game_id = 1034;
                    params.version = "1.0.0";
                    params.code = ress.code; //game_id=1034
                    var sign = "code=" + ress.code + "&" + "game_id=" + "1034" + "&" + "version=" + "1.0.0";
                    console.log("sign:" + sign);
                    var _sign = self.getSign(sign);
                    params._sign = _sign.toUpperCase();

                    var xhr = null;
                    var complete = false;
                    var fnRequest = function fnRequest() {
                        console.log("sdk.youjoy.tv 正在连接服务器...");
                        xhr = cc.vv.http.sendRequest("", params, function (ret) {
                            xhr = null;
                            complete = true;
                            console.log("connectSdkServer = " + JSON.stringify(ret));
                            self.sdkuid = ret.data.user_id;
                            console.log("------------sdkuid:" + self.sdkuid);
                            self.getServerInfo();
                        }, _url);
                        setTimeout(fn, 5000);
                    };

                    var fn = function fn() {
                        if (!complete) {
                            if (xhr) {
                                xhr.abort();
                                console.log("sdk.youjoy.tv 连接失败，即将重试...");
                                setTimeout(function () {
                                    fnRequest();
                                }, 5000);
                            } else {
                                fnRequest();
                            }
                        }
                    };
                    fn();
                } else {
                    console.log('登录失败！' + res.errMsg);
                }
            }
        });
    },
    getSign: function getSign(sign) {
        var endData = MD5.hex_md5(sign + "79fad6f7510d86aabe01a7006153ddd0");
        return endData;
    },

    getServerInfo: function getServerInfo() {
        var params = {};
        params.env = "prod";
        params.ver = "2.0.0";
        params.channel = "weichatgame";
        params.udid = "udid";
        params.pver = "2.0.0";
        params.pchannel = "weichatgame";
        params.presver = "2.0.0";

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
                console.log(config.GlobalRouter);
                self.connectGameServer();
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
    connectGameServer: function connectGameServer() {
        var self = this;
        cc.vv.net.connect(config.GlobalRouter.host, config.GlobalRouter.port, function (ret) {
            //WebSocket连接成功
            if (typeof wx == "undefined") {
                self.sendRegist();
            } else {
                self.getWxUserInfo();
            }
        });

        var ConnectionClosedShow = function ConnectionClosedShow() {
            self.isShow = true;
            // dialogManager.showCommonDialog("提示","与服务器断开连接！",function(){
            //     self.isShow = false;
            //     cc.vv.audioMgr.stopMusic();
            //     cc.director.loadScene("LoadingScene");
            // });
            cc.vv.audioMgr.stopMusic();
            config.stopOnMassage = false;
            cc.director.loadScene("LoadingScene");
        };

        setInterval(function () {
            if (cc.vv.net.isPinging) {
                self.sendHeartBeat();
            } else {
                if (!self.isShow) ConnectionClosedShow();
            }
        }.bind(this), 10000);

        EventHelper.AddCustomEvent(config.MyNode, "Regist", self.onRegist, self);
        EventHelper.AddCustomEvent(config.MyNode, "HeartBeat", self.onHeartBeat, self);
        EventHelper.AddCustomEvent(config.MyNode, "LoginOK", self.onLoginOK, self);
    },
    getWxUserInfo: function getWxUserInfo() {
        var self = this;
        var launch = wx.getLaunchOptionsSync();
        console.log("launch =  " + JSON.stringify(launch));
        self.shareUid = launch.query.key;
        console.log("shareUid =  " + self.shareUid);

        wx.getUserInfo({
            success: function success(res) {
                console.log("res.userInfo = " + JSON.stringify(res.userInfo));
                config.UpdateWxInfo(res.userInfo);
                self.sendRegist();
            }
        });
    },
    onRegist: function onRegist(event) {
        var self = this;
        console.log("Regist---");
        var data = event.getUserData();
        console.log(data);
        config.temppassword = data.data.data.password;
        self.sendLogin();
    },
    onHeartBeat: function onHeartBeat(event) {
        // console.log("HeartBeat---");
    },
    onLoginOK: function onLoginOK(event) {
        var self = this;
        console.log("LoginOK---");
        console.log(event.getUserData());
        var data = event.getUserData();
        self.setPlayerDetailModel(data);
    },
    sendHeartBeat: function sendHeartBeat() {
        //发送心跳
        var params = {};
        params.t = Protocol.Request.HeartBeat.Alive;
        cc.vv.net.send("HeartBeat", Protocol.Command.HeartBeat, params);
    },
    sendRegist: function sendRegist() {
        //注册请求
        if (typeof wx == "undefined") {
            var params = {};
            params.t = Protocol.Request.Login.Regist;
            params.d = MD5.hex_md5("yepat123");
            params.u = "50ee8041a7fd8baa6348252ea114432bb3be23bd";
            params.v = "2.0.0";
            params.c = "weichatgame";
            params.e = "defaults";
            params.type = "guest";
            // params.sdkid = self.sdkuid;
            cc.vv.net.send("Regist", Protocol.Command.Login, params);
            return;
        }
        var self = this;
        var username = "3rdplt_" + self.sdkuid;
        var password = username + config.OpenUDIDEncryptToken + "suffix";
        password = MD5.hex_md5(password);
        var encodedUsername = username + config.OpenUDIDEncryptToken;
        encodedUsername = MD5.hex_md5(encodedUsername);
        var encodedUDID = self.sdkuid + config.OpenUDIDEncryptToken;
        encodedUDID = MD5.hex_md5(encodedUDID);

        var params = {};
        params.t = Protocol.Request.Login.Regist;
        params.d = encodedUsername;
        params.a = username;
        params.p = password;
        params.v = config.VERSION_NAME;
        params.c = "weichatgame";
        params.e = encodedUDID;
        params.type = "third";
        params.sdkid = self.sdkuid;
        cc.vv.net.send("Regist", Protocol.Command.Login, params);
    },
    sendLogin: function sendLogin() {
        if (typeof wx == "undefined") {
            var params = {};
            params.t = Protocol.Request.Login.Guest;
            params.d = MD5.hex_md5("yepat123");
            params.p = config.temppassword;
            params.c = "weichatgame";
            params.v = "2.0.0";
            params.tv = 1;
            params.e = "defaults";
            params.wn = config.wxInfo.nickName;
            params.wurl = config.wxInfo.avatarUrl;
            cc.vv.net.send("Login", Protocol.Command.Login, params);
            return;
        }
        var self = this;
        var params = {};
        params.t = Protocol.Request.Login.Guest;
        params.d = self.sdkuid;
        params.p = config.temppassword;
        params.c = "weichatgame";
        params.v = "2.0.0";
        params.tv = 1;
        params.e = "defaults";
        params.f = self.sdkuid;
        params.wn = config.wxInfo.nickName;
        params.wurl = config.wxInfo.avatarUrl;
        params.invite = self.shareUid;
        cc.vv.net.send("Login", Protocol.Command.Login, params);
    },
    setPlayerDetailModel: function setPlayerDetailModel(response) {
        var room = response.data.room;
        // console.log(room);
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

            PlayerDetailModel.taskUnReward = parseInt(response["data"]["weichatgame_task_unaward"]);
            PlayerDetailModel.shareUnReward = parseInt(response["data"]["weichatgame_invite_unaward"]);

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

            PlayerDetailModel.continueRoomId = response["data"]["continueRoomId"];

            console.log(response["data"]);

            console.log("进入游戏大厅...uid:" + parseInt(response["data"]["uid"]));
            this.labLoading.string = "进入游戏大厅...";
            // this.preloadNextScene();
            this.downloadFile();
        } else {
            console.log("登陆游戏失败！");
            this.labLoading.string = "登陆游戏失败！";
            dialogManager.showCommonDialog("提示", "登陆游戏失败！", function () {
                cc.director.loadScene("LoadingScene");
            });
        }
    },

    //
    preloadNextScene: function preloadNextScene() {
        cc.director.preloadScene("HallScene", function () {
            cc.log("Next scene preloaded");
            cc.director.loadScene("HallScene");
        });
    },

    //下载资源包
    downloadFile: function downloadFile() {
        var self = this;
        if (typeof wx == "undefined") {
            self.preloadNextScene();
        } else {

            var fileManager = wx.getFileSystemManager();
            var soundspath = wx.env.USER_DATA_PATH + "/sounds/1.0.1";
            console.log("soundspath:" + soundspath);
            fileManager.access({
                path: soundspath,
                success: function success(res) {
                    console.log("目录存在!!!", res);
                    self.preloadNextScene();
                },
                fail: function fail(res) {
                    console.log("目录不存在!!!", res);
                    var downloadTask = wx.downloadFile({
                        url: 'https://sg.youjoy.tv/ddzwechatgame/resources/sounds3.zip',
                        success: function success(res) {
                            console.log("资源下载成功");
                            var filePath = res.tempFilePath;
                            fileManager.unzip({
                                zipFilePath: filePath,
                                targetPath: wx.env.USER_DATA_PATH,
                                success: function success(res) {
                                    console.log("解压成功!!!", res);
                                    self.preloadNextScene();
                                },
                                fail: function fail(res) {
                                    console.log("解压失败!!!", res);
                                }
                            });
                        },
                        fail: function fail(res) {
                            console.log("资源下载失败", res);
                        }
                    });
                    downloadTask.onProgressUpdate(function (res) {
                        self.progress.string = res.progress + "%";
                        self.labLoading.string = "资源更新中...";
                        // console.log('下载进度', res.progress);
                        // console.log('已经下载的数据长度', res.totalBytesWritten);
                        // console.log('预期需要下载的数据总长度', res.totalBytesExpectedToWrite);
                    });
                }
            });
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
        