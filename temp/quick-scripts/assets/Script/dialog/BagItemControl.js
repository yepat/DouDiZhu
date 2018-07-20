(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/dialog/BagItemControl.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '7db1dtw8c5EO4Ca/LHnxP6f', 'BagItemControl', __filename);
// Script/dialog/BagItemControl.js

"use strict";

var config = require("config");
var GameNetMgr = require("GameNetMgr");
var dialogManager = require("dialogManager");
cc.Class({
    extends: cc.Component,

    properties: {
        p_item: {
            default: null,
            type: cc.Sprite
        },
        lab_num: {
            default: null,
            type: cc.Label
        },
        lab_name: {
            default: null,
            type: cc.Label
        },
        index: 0
    },
    onLoad: function onLoad() {},
    show: function show(propName, propNum, index) {
        var self = this;
        var numUrl = "";
        this.propName = propName;
        self.lab_num.string = "";
        self.lab_name.string = "";
        if (propName == "jipaiqi") {
            self.lab_name.string = "记牌器";
            numUrl = "p_daoju_jpq";
            self.lab_num.string = "" + this.showTime(propNum);
        } else if (propName == "lequan") {
            self.lab_name.string = "乐券";
            numUrl = "p_daoju_lequan";
            self.lab_num.string = "" + propNum;
        }

        cc.loader.loadRes(numUrl, cc.SpriteFrame, function (err, spriteFrame) {
            self.p_item.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        });
    },
    itemClick: function itemClick() {
        console.log("背包道具点击");
        if (this.propName && this.propName == "lequan") {
            console.log("打开道具兑换");
            // dialogManager.showCommonDialog("温馨提示","敬请期待");
        }
        // cc.vv.audioMgr.playSFX("SpecOk");
    },
    showTime: function showTime(propNum) {
        var showNum = "";
        var time = propNum.time;
        var num = propNum.num;

        if (time == 0) {
            showNum = "永久";
        } else if (time == -1) {
            showNum = "" + num;
        } else {
            var d = Math.floor(time / (24 * 60 * 60)); //天
            var h = Math.floor((time - d * 24 * 60 * 60) / (60 * 60));
            var m = Math.floor((time - d * 24 * 60 * 60 - h * 60 * 60) / 60);
            showNum = d + "天" + h + "小时" + m + "分";
        }
        return showNum;
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
        //# sourceMappingURL=BagItemControl.js.map
        