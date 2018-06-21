(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/dialog/emailControl.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '59af9SWmdhEaaOvGCS7ZmBO', 'emailControl', __filename);
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
        },
        label_noEmail: {
            default: null,
            type: cc.Label
        }
    },
    start: function start() {
        var self = this;
        // this.btnRight_1.enabled = false;

        this.label_noEmail.node.active = false;
        GameNetMgr.sendRequest("System", "Mail");
        EventHelper.AddCustomEvent(config.MyNode, "MailResult", self.onMailResult, self);
        EventHelper.AddCustomEvent(config.MyNode, "ReadMailResult", self.onReadMailResult, self);
        EventHelper.AddCustomEvent(config.MyNode, "GetMailAttachmentResult", self.onGetMailAttachmentResult, self);
    },
    closeClick: function closeClick() {
        console.log("close click");
        var self = this;
        EventHelper.RemoveCustomEvent(config.MyNode, "MailResult", self.onMailResult, self);
        EventHelper.RemoveCustomEvent(config.MyNode, "ReadMailResult", self.onReadMailResult, self);
        EventHelper.RemoveCustomEvent(config.MyNode, "GetMailAttachmentResult", self.onGetMailAttachmentResult, self);
        this.node.destroy();
        cc.vv.audioMgr.playSFX("SpecOk");
    },
    leftClick: function leftClick() {
        // console.log("left click");
        // this.btnLeft_1.enabled = true;
        // this.btnRight_1.enabled = false;
        cc.vv.audioMgr.playSFX("SpecOk");
    },
    rightClick: function rightClick() {
        // console.log("right click");
        // this.btnLeft_1.enabled = false;
        // this.btnRight_1.enabled = true; 
        cc.vv.audioMgr.playSFX("SpecOk");
    },
    onMailResult: function onMailResult(event) {
        var response = event.getUserData();
        console.log(response);
        var list = response.data.list;

        if (list.length == 0) {
            this.label_noEmail.node.active = true;
        }
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
            text = text + "获得乐豆" + response.data.coins;
        }
        if (response.data.coupon) {
            //乐劵
            text = text + "获得乐劵" + response.data.coupon;
        }
        if (response.data.propItems) {
            for (k in response.data.propItems) {
                var v = response.data.propItems[k];
                text = text + "获得道具" + v.name + v.num + "个";
            }
        }
        dialogManager.showCommonDialog("温馨提示", text);
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
        //# sourceMappingURL=emailControl.js.map
        