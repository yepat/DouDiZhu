"use strict";
cc._RF.push(module, '505a7cMGzRIa4SP1t5a1uM0', 'topBarControl');
// Script/topBarControl.js

"use strict";

var config = require("config");
var EventHelper = require("EventHelper");
var PlayerDetailModel = require("PlayerDetailModel");
var dialogManager = require("dialogManager");

cc.Class({
    extends: cc.Component,

    properties: {
        headImg: {
            default: null,
            type: cc.Sprite
        },
        playerName: {
            default: null,
            type: cc.Label
        },
        playerLevel: {
            default: null,
            type: cc.Label
        },
        playerLedou: {
            default: null,
            type: cc.Label
        },
        playerLeQuan: {
            default: null,
            type: cc.Label
        }
    },
    // onLoad () {},
    start: function start() {
        var self = this;
        self.setHeadUrl();
        var nickname = PlayerDetailModel.getNickName();
        self.setNickName(config.parseString(nickname, 5));
        self.setLevel(PlayerDetailModel.getTitle());
        self.setLeDou(PlayerDetailModel.getCoin());
        self.setLuQuan(PlayerDetailModel.getCoupon());

        EventHelper.AddCustomEvent(config.MyNode, "RefreshDataResult", self.onRefreshDataResult, self);
        EventHelper.AddCustomEvent(config.MyNode, "RepeatLogin", self.onRepeatLogin, self);
        // EventHelper.AddCustomEvent(config.MyNode,"ShareWxResResult",self.onShareWxResResult,self);
    },
    onDestroy: function onDestroy() {
        console.log(" topBar Destroy");
    },
    onRepeatLogin: function onRepeatLogin(event) {
        console.log("您的账号已经在其他地方登陆！");
        var self = this;
        var data = event.getUserData();
        console.log(data);
        dialogManager.showCommonDialog("提示", "您的账号已经在其他地方登陆！", function () {
            self.isShow = false;
            cc.vv.audioMgr.stopMusic();
            cc.director.loadScene("LoadingScene");
        });
    },
    onRefreshDataResult: function onRefreshDataResult(event) {
        console.log("刷新用户信息数据1111------");
        var self = this;
        var data = event.getUserData();
        console.log(data);

        var payload = data;
        // var model = app:getModel("PlayerDetailModel")
        //用户乐豆数
        if (payload.data && payload.data.coins) {
            PlayerDetailModel.setCoin(payload.data.coins);
            self.setLeDou(PlayerDetailModel.getCoin());

            //分享获取乐豆
            if (config.leDouShareSucss) {
                config.leDouShareSucss = false;
                var list = [];
                var args = {
                    arg1: "ledou",
                    arg2: 1000
                };
                list.push(args);
                dialogManager.showAnimGetProp(list);
            }
        }
        //用户奖券数
        if (payload.data && payload.data.coupon) {
            PlayerDetailModel.setCoupon(payload.data.coupon);
            self.setLuQuan(PlayerDetailModel.getCoupon());
        }
        //用户抽奖数
        if (payload.data && payload.data.lottery) {
            PlayerDetailModel.setLottery(payload.data.lottery);
        }
        //未读邮件数
        if (payload.data && payload.data.mail_unread) {
            PlayerDetailModel.setMailUnread(payload.data.mail_unread);
        }
        //未领取任务数
        if (payload.data && payload.data.weichatgame_task_unaward) {
            PlayerDetailModel.setTaskUnReward(payload.data.weichatgame_task_unaward);
        }
        //未领取分享数
        if (payload.data && payload.data.weichatgame_invite_unaward) {
            PlayerDetailModel.setShareUnReward(payload.data.weichatgame_invite_unaward);
        }

        //0不可签到, 1可以签到
        if (payload.data && payload.data.checkin_undo) {
            PlayerDetailModel.setCheckinUndo(payload.data.checkin_undo);
        }
        //可领奖的每日任务数
        if (payload.data && payload.data.task1_unaward) {
            PlayerDetailModel.setTask1Unaward(payload.data.task1_unaward);
        }
        //可领奖的成长任务数
        if (payload.data && payload.data.task2_unaward) {
            PlayerDetailModel.setTask2Unaward(payload.data.task2_unaward);
        }
        //充值奖励利率
        if (payload.data && payload.data.charge_rate) {
            PlayerDetailModel.setChargeRate(payload.data.charge_rate);
        }
        //皮肤
        if (payload.data && payload.data.propDress) {
            PlayerDetailModel.setPropDress(payload.data.propDress);
        }
        //道具
        if (payload.data && payload.data.propItems) {
            PlayerDetailModel.setPropItems(payload.data.propItems);
        }
    },
    setHeadUrl: function setHeadUrl() {
        var self = this;
        //设置微信头像
        var imgUrl = config.wxInfo.avatarUrl;

        if (imgUrl == "") {
            var headUrl = "p_head_woman";
            if (PlayerDetailModel.getGender() == 1) {
                headUrl = "p_head_man";
            }
            cc.loader.loadRes(headUrl, cc.SpriteFrame, function (err, spriteFrame) {
                self.headImg.getComponent(cc.Sprite).spriteFrame = spriteFrame;
            });
            return;
        }

        imgUrl = imgUrl + "?aa=aa.jpg";
        cc.loader.load(imgUrl, function (err, texture) {
            self.headImg.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
        });
    },
    setNickName: function setNickName(name) {
        //修改昵称
        this.playerName.string = name;
    },
    setLevel: function setLevel(lv) {
        //修改等级
        this.playerLevel.string = lv;
    },
    setLeDou: function setLeDou(number) {
        //修改乐豆数
        if (number >= 10000000) {
            number = Math.floor(number / 10000);
            this.playerLedou.string = "" + number + "万";
        } else {
            this.playerLedou.string = "" + number;
        }
    },
    setLuQuan: function setLuQuan(number) {
        //修改乐券数
        if (number >= 10000000) {
            number = Math.floor(number / 10000);
            this.playerLeQuan.string = "" + number + "万";
        } else {
            this.playerLeQuan.string = "" + number;
        }
    },

    //点击头像
    headClick: function headClick() {
        var args = "hall";
        dialogManager.showPlayerInfo(args);
        cc.vv.audioMgr.playSFX("SpecOk");
    }
}
// onShareWxResResult(event){
//     console.log("微信分享成功发送结果------");
//     // var self = this;
//     var response = event.getUserData();
//     console.log(response);

//     if(config.leQuanShareSucss){
//         GameNetMgr.sendRequest("System","ShareWxRes",5);
//     }else if(config.leDouShareSucss){
//         GameNetMgr.sendRequest("System","ShareWxRes",3);
//         GameNetMgr.sendRequest("Game", "openReliefTip", {});
//     }
// },
);

cc._RF.pop();