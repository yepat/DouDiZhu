(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/dialog/setControl.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'd16ccLCjY5O86/MTBSCS0tQ', 'setControl', __filename);
// Script/dialog/setControl.js

"use strict";

var dialogManager = require("dialogManager");
cc.Class({
    extends: cc.Component,

    properties: {
        imgMusic: {
            default: null,
            type: cc.Node
        },
        imgEffect: {
            default: null,
            type: cc.Node
        },
        musicSet: false,
        effectSet: false
    },
    start: function start() {
        var self = this;
        var t = cc.sys.localStorage.getItem("bgmVolume");
        if (t != null) {
            this.bgmVolume = parseFloat(t);
        } else {
            cc.sys.localStorage.setItem("bgmVolume", 1);
        }
        var imgUrl = "";
        if (t == 1) {
            imgUrl = "img_dialog/btn_on";
        } else {
            imgUrl = "img_dialog/btn_off";
        }
        cc.loader.loadRes(imgUrl, cc.SpriteFrame, function (err, spriteFrame) {
            self.imgMusic.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        });

        var t2 = cc.sys.localStorage.getItem("sfxVolume");
        if (t2 != null) {
            this.sfxVolume = parseFloat(t2);
        } else {
            cc.sys.localStorage.setItem("sfxVolume", 1);
        }

        if (t2 == 1) {
            imgUrl = "img_dialog/btn_on";
        } else {
            imgUrl = "img_dialog/btn_off";
        }
        cc.loader.loadRes(imgUrl, cc.SpriteFrame, function (err, spriteFrame) {
            self.imgEffect.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        });
    },
    musicClick: function musicClick() {
        var self = this;
        console.log("music click");
        var imgUrl = "img_dialog/btn_off";
        if (this.musicSet) {
            this.musicSet = false;
            imgUrl = "img_dialog/btn_off";
            cc.vv.audioMgr.setBGMVolume(0);
        } else {
            this.musicSet = true;
            imgUrl = "img_dialog/btn_on";
            cc.vv.audioMgr.setBGMVolume(1);
        }

        cc.loader.loadRes(imgUrl, cc.SpriteFrame, function (err, spriteFrame) {
            self.imgMusic.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        });
        cc.vv.audioMgr.playSFX("SpecOk");
    },
    effectClick: function effectClick() {
        var self = this;
        console.log("effect click");
        var imgUrl = "img_dialog/btn_off";
        if (this.effectSet) {
            this.effectSet = false;
            imgUrl = "img_dialog/btn_off";
            cc.vv.audioMgr.setSFXVolume(0);
        } else {
            this.effectSet = true;
            imgUrl = "img_dialog/btn_on";
            cc.vv.audioMgr.setSFXVolume(1);
        }

        cc.loader.loadRes(imgUrl, cc.SpriteFrame, function (err, spriteFrame) {
            self.imgEffect.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        });
        cc.vv.audioMgr.playSFX("SpecOk");
    },
    fankuiClick: function fankuiClick() {
        console.log("fankui click");
        dialogManager.showFanKuiDialog();
        cc.vv.audioMgr.playSFX("SpecOk");
    },
    aboutClick: function aboutClick() {
        console.log("about click");
        dialogManager.showAboutDialog();
        // this.node.destroy();
        cc.vv.audioMgr.playSFX("SpecOk");
    },
    closeClick: function closeClick() {
        console.log("close click");
        this.node.destroy();
        cc.vv.audioMgr.playSFX("SpecOk");
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
        //# sourceMappingURL=setControl.js.map
        