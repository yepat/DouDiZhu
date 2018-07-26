"use strict";
cc._RF.push(module, 'ca1bfsOJVRIfZ+JaI0gWh+N', 'HallLayerControl');
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
        },
        videoAdTip: {
            default: null,
            type: cc.Sprite
        },
        btn_videoAd: {
            default: null,
            type: cc.Sprite
        },
        ad_time: {
            default: null,
            type: cc.Label
        }
    },
    // onLoad () {},
    start: function start() {
        var self = this;
        this.taskTip.enabled = false;
        this.mailTip.enabled = false;
        this.shareTip.enabled = false;
        this.ad_time.string = "";
        this.timeCount = 0;
        this.adCanTouch = true;
        this.btn_videoAd.enabled = false;

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
        EventHelper.AddCustomEvent(config.MyNode, "WatchAdvertisementResult", self.onWatchAdvertisementResult, self);

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

        //第一次登陆弹出分享窗口
        if (config.firstLogin) {
            config.firstLogin = false;
            dialogManager.showShareDialog();
        }

        //微信视频广告
        if (config.showAd == 1) {
            this.btn_videoAd.enabled = true;
        }
        this.initWxVideoAd();

        if (config.device) {
            console.log(">>>>>>>>device:", config.device);
        }

        if (!config.canSeeVideoAd) {
            this.videoAdTip.enabled = false;
            this.btn_videoAd.node.color = new cc.Color(218, 218, 218);
        }
    },
    onEnable: function onEnable() {
        console.log(" HallLayer onEnable");
        if (config.adCdTime > 1) {
            this.btn_videoAd.node.color = new cc.Color(218, 218, 218);
            this.adCanTouch = false;
        }
        if (!config.canSeeVideoAd) {
            this.videoAdTip.enabled = false;
            this.btn_videoAd.node.color = new cc.Color(218, 218, 218);
        }
    },
    onDisable: function onDisable() {
        console.log(" HallLayer onDisable");
    },
    initWxVideoAd: function initWxVideoAd() {
        var self = this;
        if (typeof wx == "undefined") {
            return;
        }
        var rewardedVideoAd = null;

        if (config.adCdTime > 1) {
            this.btn_videoAd.node.color = new cc.Color(218, 218, 218);
            this.adCanTouch = false;
            this.videoAdTip.enabled = false;
        }

        //计时器
        this.timeCount = config.adCdTime;
        this.schedule(function () {
            if (this.timeCount > 0) {
                this.timeCount -= 1;
                this.ad_time.string = this.showTimes(this.timeCount);
                if (this.timeCount == 0) {
                    this.ad_time.string = "";
                    this.btn_videoAd.node.color = new cc.Color(255, 255, 255);
                    this.adCanTouch = true;
                    this.videoAdTip.enabled = true;
                }
            }
        }, 1);

        if (!config.rewardedVideoAd) {
            rewardedVideoAd = wx.createRewardedVideoAd({ adUnitId: 'adunit-5e51a762e521fda5' });
        } else {
            return;
        }
        rewardedVideoAd.onLoad(function () {
            // console.log('激励视频 广告加载成功')
        });
        rewardedVideoAd.onError(function (err) {
            // console.log("激励视频 拉取失败"+err)
        });
        rewardedVideoAd.onClose(function (res) {
            if (res && res.isEnded || res === undefined) {
                // console.log("正常播放结束，可以下发游戏奖励")
                GameNetMgr.sendRequest("System", "WatchAdvertisement", config.rewardedVideoType);
                // console.log(">>>>>rewardedVideoType:",config.rewardedVideoType);
                if (config.rewardedVideoType == 1) {
                    if (config.videoEndFuc) config.videoEndFuc();
                }
            } else {}
            // console.log("播放中途退出，不下发游戏奖励")

            // cc.vv.audioMgr.playBGM("MusicEx_Welcome");
        });

        config.rewardedVideoAd = rewardedVideoAd;
    },
    showTimes: function showTimes(time) {
        //秒转换分钟格式 2:00 == 120
        var times = "00:00";
        var fen = Math.floor(time / 60);
        var miao = time - fen * 60;
        var strfen = "00";
        var strmiao = "00";
        if (fen == 0) {
            strfen = "00";
        } else if (fen < 10) {
            strfen = "0" + fen;
        } else {
            strfen = "" + fen;
        }
        if (miao == 0) {
            strmiao = "00";
        } else if (miao < 10) {
            strmiao = "0" + miao;
        } else {
            strmiao = "" + miao;
        }
        times = strfen + ":" + strmiao;
        return times;
    },
    onDestroy: function onDestroy() {
        console.log(" HallLayer Destroy");
        var self = this;
        EventHelper.RemoveCustomEvent(config.MyNode, "RefreshDataResult", self.onRefreshDataResult, self);
        EventHelper.RemoveCustomEvent(config.MyNode, "WatchAdvertisementResult", self.onWatchAdvertisementResult, self);
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
        cc.director.preloadScene("GameScene", function () {
            // cc.log("Next scene preloaded");
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
        // console.log("btnSetClick");
        dialogManager.showSetDialog();
        cc.vv.audioMgr.playSFX("SpecOk");
    },
    btnTaskClick: function btnTaskClick() {
        // console.log("btnTaskClick");
        dialogManager.showTaskDialog();
        cc.vv.audioMgr.playSFX("SpecOk");
    },
    btnEmailClick: function btnEmailClick() {
        // console.log("btnEmailClick");
        dialogManager.showEmailDialog();
        cc.vv.audioMgr.playSFX("SpecOk");
    },
    btnBagClick: function btnBagClick() {
        // console.log("btnBagClick");
        dialogManager.showBagDialog();
        cc.vv.audioMgr.playSFX("SpecOk");
    },
    btnShopClick: function btnShopClick() {
        // console.log("btnShopClick");
        // dialogManager.showShopDialog();
    },
    btnShouCangClick: function btnShouCangClick() {
        console.log("btnShouCangClick");
        dialogManager.showShouCangDialog();
    },
    btnShareClick: function btnShareClick() {
        // console.log("btnShareClick");
        dialogManager.showShareDialog();
        cc.vv.audioMgr.playSFX("SpecOk");
    },
    btnVideoAdClick: function btnVideoAdClick() {
        // console.log("btnVideoAdClick");
        if (!config.canSeeVideoAd) {
            dialogManager.showCommonDialog("温馨提示", "今日看广告机会已经用完，请明天再来", null, null);
            this.videoAdTip.enabled = false;
            this.btn_videoAd.node.color = new cc.Color(218, 218, 218);
            return;
        }

        if (!this.adCanTouch) {
            // console.log("cd中。。。。。。。。")
            return;
        }
        cc.vv.audioMgr.playSFX("SpecOk");
        if (typeof wx == "undefined") {
            return;
        }
        config.rewardedVideoType = 1;
        if (config.rewardedVideoAd) {
            var self = this;
            var videoEndFuc = function videoEndFuc() {
                self.btn_videoAd.node.color = new cc.Color(218, 218, 218);
                self.adCanTouch = false;
                self.videoAdTip.enabled = false;
            };
            config.videoEndFuc = videoEndFuc;
            config.rewardedVideoAd.show().then(); //() => cc.vv.audioMgr.stopMusic()
        }
    },
    btnKefuClick: function btnKefuClick() {
        // console.log("btnKefuClick");
        cc.vv.audioMgr.playSFX("SpecOk");

        if (typeof wx == "undefined") {
            return;
        }
        wx.openCustomerServiceConversation({
            success: function success(res) {
                // console.log("吊起会话成功>>>>>>>");
            },
            fail: function fail(res) {
                // console.log("吊起会失败>>>>>>>");
            },
            complete: function complete(res) {
                // console.log("会话完成>>>>>>>>");
            }
        });
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
            // console.log("刷新用户乐豆乐券");
        }
        config.tableInfo = args;

        console.log(config.tableInfo);

        config.IsContinueGaming = 1;
        this.preloadNextScene();
    },
    onWatchAdvertisementResult: function onWatchAdvertisementResult(event) {
        // console.log("-----看完广告领奖");
        var response = event.getUserData();
        var award = response.data;
        var list = [];
        if (award.coins) {
            var args = {
                arg1: "ledou",
                arg2: award.coins
            };
            list.push(args);
        }
        if (award.coupon) {
            var args = {
                arg1: "lequan",
                arg2: award.coupon
            };
            list.push(args);
        }
        if (award.noteCards) {
            var args = {
                arg1: "jipaiqi",
                arg2: award.noteCards
            };
            list.push(args);
        }
        if (list.length > 0) {
            dialogManager.showAnimGetProp(list);
        }
        config.adCdTime = award.watch_advertisement_cd;
        this.timeCount = config.adCdTime;

        config.canSeeVideoAd = award.weichatgame_can_watch_advertisement;
    }
});

cc._RF.pop();