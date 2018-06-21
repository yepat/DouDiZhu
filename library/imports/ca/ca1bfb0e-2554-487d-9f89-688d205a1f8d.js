"use strict";
cc._RF.push(module, 'ca1bfsOJVRIfZ+JaI0gWh+N', 'HallLayerControl');
// Script/HallLayerControl.js

"use strict";

var dialogManager = require("dialogManager");
var PlayerDetailModel = require("PlayerDetailModel");
var EventHelper = require("EventHelper");
var config = require("config");
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
    }
});

cc._RF.pop();