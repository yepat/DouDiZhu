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
    start: function start() {},
    musicClick: function musicClick() {
        var self = this;
        console.log("music click");
        var imgUrl = "img_dialog/btn_off";
        if (this.musicSet) {
            this.musicSet = false;
            imgUrl = "img_dialog/btn_off";
        } else {
            this.musicSet = true;
            imgUrl = "img_dialog/btn_on";
        }

        cc.loader.loadRes(imgUrl, cc.SpriteFrame, function (err, spriteFrame) {
            self.imgMusic.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        });
    },
    effectClick: function effectClick() {
        var self = this;
        console.log("effect click");
        var imgUrl = "img_dialog/btn_off";
        if (this.effectSet) {
            this.effectSet = false;
            imgUrl = "img_dialog/btn_off";
        } else {
            this.effectSet = true;
            imgUrl = "img_dialog/btn_on";
        }

        cc.loader.loadRes(imgUrl, cc.SpriteFrame, function (err, spriteFrame) {
            self.imgEffect.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        });
    },
    fankuiClick: function fankuiClick() {
        console.log("fankui click");
        dialogManager.showFanKuiDialog();
    },
    aboutClick: function aboutClick() {
        console.log("about click");
        dialogManager.showAboutDialog();
        // this.node.destroy();
    },
    closeClick: function closeClick() {
        console.log("close click");
        this.node.destroy();
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
        