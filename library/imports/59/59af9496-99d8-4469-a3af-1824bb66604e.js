"use strict";
cc._RF.push(module, '59af9SWmdhEaaOvGCS7ZmBO', 'emailControl');
// Script/dialog/emailControl.js

"use strict";

var emailItemControl = require("emailItemControl");
var GameNetMgr = require("GameNetMgr");
var EventHelper = require("EventHelper");
var config = require("config");
var dialogManager = require("dialogManager");
var PlayerDetailModel = require("PlayerDetailModel");
cc.Class({
    extends: cc.Component,

    properties: {
        btnLeft_1: {
            default: null,
            type: cc.Sprite
        },
        btnLeft_2: {
            default: null,
            type: cc.Sprite
        },
        btnRight_1: {
            default: null,
            type: cc.Sprite
        },
        btnRight_2: {
            default: null,
            type: cc.Sprite
        },
        content: {
            default: null,
            type: cc.Node
        },
        emailItem: {
            default: null,
            type: cc.Prefab
        }
    },
    start: function start() {
        var self = this;
        this.btnRight_1.enabled = false;

        GameNetMgr.sendRequest("System", "Mail");
        EventHelper.AddCustomEvent(config.MyNode, "MailResult", self.onMailResult, self);
        EventHelper.AddCustomEvent(config.MyNode, "ReadMailResult", self.onReadMailResult, self);
        EventHelper.AddCustomEvent(config.MyNode, "GetMailAttachmentResult", self.onGetMailAttachmentResult, self);

        // var testItem=[1,1,1,1,2,2,2,2,2,2];
        // var disBetween = 130;
        // for(var i = 0;i < testItem.length;i++){
        //     var emailItem = cc.instantiate(this.emailItem);
        //     emailItem.parent = this.content;
        //     var task = emailItem.getComponent(emailItemControl);
        //     task.init(testItem[i],i,"标题"+i,"内容111。。。","2018-05-28 08:36");
        // }
        // this.content.height = disBetween*testItem.length;
    },
    closeClick: function closeClick() {
        console.log("close click");
        var self = this;
        EventHelper.RemoveCustomEvent(config.MyNode, "MailResult", self.onMailResult, self);
        EventHelper.RemoveCustomEvent(config.MyNode, "ReadMailResult", self.onReadMailResult, self);
        EventHelper.RemoveCustomEvent(config.MyNode, "GetMailAttachmentResult", self.onGetMailAttachmentResult, self);
        this.node.destroy();
    },
    leftClick: function leftClick() {
        console.log("left click");
        this.btnLeft_1.enabled = true;
        this.btnRight_1.enabled = false;
    },
    rightClick: function rightClick() {
        console.log("right click");
        this.btnLeft_1.enabled = false;
        this.btnRight_1.enabled = true;
    },
    onMailResult: function onMailResult(event) {
        var response = event.getUserData();
        console.log(response);
        var list = response.data.list;
        for (var i = 0; i < list.length; i++) {
            var info = list[i];
            var emailItem = cc.instantiate(this.emailItem);
            emailItem.parent = this.content;
            var task = emailItem.getComponent(emailItemControl);
            task.init(info, info.id, info.subject, info.content, info.create_time);
        }
    },
    onReadMailResult: function onReadMailResult(event) {
        var response = event.getUserData();
        console.log(response);
    },
    onGetMailAttachmentResult: function onGetMailAttachmentResult(event) {
        var response = event.getUserData();
        console.log(response);
        var text = "恭喜您";
        if (response.data.coins) {
            //乐豆
            // model:setCoin(model:getCoin() + response.data.coins)
            text = text + "获得乐豆" + response.data.coins;
        }
        if (response.data.coupon) {
            //乐劵
            // model:setCoupon(model:getCoupon() + response.data.coupon)
            text = text + "获得乐劵" + response.data.coupon;
        }
        // if (response.data.lottery){//抽奖次数
        //     text = text + "获得抽奖次数" + response.data.lottery;
        // }
        // if (response.data.propDress){//--皮肤
        //     // model:setPropDress(response.data.propDress)
        // }
        if (response.data.propItems) {
            for (k in response.data.propItems) {
                var v = response.data.propItems[k];
                text = text + "获得道具" + v.name + v.num + "个";
            }
        }
        // if (response.data.other){ //其他奖项
        //     text = text + "获得" + response.data.other;
        // }

        dialogManager.showCommonDialog("温馨提示", text);
    }
});

cc._RF.pop();