(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/HallLayerControl.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'ca1bfsOJVRIfZ+JaI0gWh+N', 'HallLayerControl', __filename);
// Script/HallLayerControl.js

"use strict";

var dialogManager = require("dialogManager");
var PlayerDetailModel = require("PlayerDetailModel");
var EventHelper = require("EventHelper");
var config = require("config");
var GameNetMgr = require("GameNetMgr");
var Events = require("Events");
cc.Class({
    extends: cc.Component,

    properties: {
        taskTip: {
            default: null,
            type: cc.Sprite
        },
        mailTip: {
            default: null,
            type: cc.Sprite
        },
        shareTip: {
            default: null,
            type: cc.Sprite
        }
    },
    // onLoad () {},
    start: function start() {
        var self = this;
        this.taskTip.enabled = false;
        this.mailTip.enabled = false;
        this.shareTip.enabled = false;

        if (PlayerDetailModel.getTaskUnReward() > 0) {
            this.taskTip.enabled = true;
        }
        if (PlayerDetailModel.getMailUnread() > 0) {
            this.mailTip.enabled = true;
        }
        if (PlayerDetailModel.getShareUnReward() > 0) {
            this.shareTip.enabled = true;
        }

        EventHelper.AddCustomEvent(config.MyNode, "RefreshDataResult", self.onRefreshDataResult, self);

        if (PlayerDetailModel.continueRoomId != 0) {
            var callFunc = cc.callFunc(function () {
                var arg = {};
                arg.roomId = PlayerDetailModel.continueRoomId;
                GameNetMgr.sendRequest("Game", "loginRoom", arg);
                // self.preloadNextScene();
            });
            var delay = cc.delayTime(0.5);
            this.node.runAction(cc.sequence(delay, callFunc));
            EventHelper.AddCustomEvent(config.MyNode, Events.Network.LoginRoomResult, self.onLoginRoomResult, self);
        }

        // var index = config.getRandom(1);
        // console.log("index=",index);


        //第一次登陆弹出分享窗口
        if (config.firstLogin) {
            config.firstLogin = false;
            dialogManager.showShareDialog();
        }
    },
    onDestroy: function onDestroy() {
        console.log(" HallLayer Destroy");
    },
    onLoginRoomResult: function onLoginRoomResult(event) {
        var self = this;
        console.log("登陆房间回掉---");
        var data = event.getUserData();
        // console.log(data);
        self.handleLoginRoomResult(data);
    },
    preloadNextScene: function preloadNextScene() {
        var self = this;
        EventHelper.RemoveCustomEvent(config.MyNode, Events.Network.LoginRoomResult, self.onLoginRoomResult, self);
        // EventHelper.RemoveCustomEvent(config.MyNode,"OpenRechargeTipResult",self.onOpenRechargeTipResult,self);
        cc.director.preloadScene("GameScene", function () {
            cc.log("Next scene preloaded");
            cc.director.loadScene("GameScene");
        });
    },
    onRefreshDataResult: function onRefreshDataResult(event) {
        var payload = event.getUserData();
        console.log("onRefreshDataResult  33333");
        //未读邮件数
        if (payload.data) {
            if (payload.data.mail_unread > 0) {
                this.mailTip.enabled = true;
            } else {
                this.mailTip.enabled = false;
            }
        }
        //未领取任务数
        if (payload.data) {
            if (payload.data.weichatgame_task_unaward > 0) {
                this.taskTip.enabled = true;
            } else {
                this.taskTip.enabled = false;
            }
        }
        //未领取分享数
        if (payload.data) {
            if (payload.data.weichatgame_invite_unaward > 0) {
                this.shareTip.enabled = true;
            } else {
                this.shareTip.enabled = false;
            }
        }
    },
    btnSetClick: function btnSetClick() {
        console.log("btnSetClick");
        dialogManager.showSetDialog();
        cc.vv.audioMgr.playSFX("SpecOk");
    },
    btnTaskClick: function btnTaskClick() {
        console.log("btnTaskClick");
        dialogManager.showTaskDialog();
        cc.vv.audioMgr.playSFX("SpecOk");
    },
    btnEmailClick: function btnEmailClick() {
        console.log("btnEmailClick");
        dialogManager.showEmailDialog();
        cc.vv.audioMgr.playSFX("SpecOk");
    },
    btnBagClick: function btnBagClick() {
        console.log("btnBagClick");
        dialogManager.showBagDialog();
        cc.vv.audioMgr.playSFX("SpecOk");
    },
    btnShopClick: function btnShopClick() {
        console.log("btnShopClick");
        // dialogManager.showShopDialog();
    },
    btnShareClick: function btnShareClick() {
        console.log("btnShareClick");
        dialogManager.showShareDialog();
        cc.vv.audioMgr.playSFX("SpecOk");
    },
    handleLoginRoomResult: function handleLoginRoomResult(event) {
        console.log("--进入上局未完的普通牌桌>>>");
        var payload = event.payload;
        var args = {};
        args["baseCoins"] = payload["data"]["baseCoins"];
        args["rate"] = payload["data"]["rate"];
        args["limitCoins"] = payload["data"]["limitCoins"];
        args["rake"] = payload["data"]["rake"];
        args["roomId"] = payload["data"]["roomId"];
        args["rateMax"] = payload["data"]["rateMax"];
        args["enterLimit"] = payload["data"]["enterLimit"];
        args["emoticon"] = payload["data"]["emoticon"];
        args["emoticon_items"] = payload["data"]["emoticon_items"];
        args["advert"] = payload["data"]["advert"]; //记牌器数据

        if (payload["data"]["modelId"]) {
            args["modelId"] = payload["data"]["modelId"];
        }
        args["buys"] = payload["data"]["buys"];
        args["givecoins"] = null;

        if (payload["data"]["isContinue"] && parseInt(payload["data"]["isContinue"]) == 1) {
            args["isContinueGaming"] = true;
        }
        var m_sended = payload["data"]["sendCoins"];
        var m_totalTimes = payload["data"]["sendCoinsTimes"];
        var m_curTimes = payload["data"]["sendCoinsTimesToday"];

        if (m_sended && m_sended > 0) {
            args["givecoins"] = {
                sended: m_sended,
                totalTimes: m_totalTimes,
                curTimes: m_curTimes
            };
            //刷新用户乐豆乐券
            console.log("刷新用户乐豆乐券");
        }
        config.tableInfo = args;

        console.log(config.tableInfo);

        config.IsContinueGaming = 1;
        this.preloadNextScene();
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
        //# sourceMappingURL=HallLayerControl.js.map
        