(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/opratShowCardControl.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '32b68GmBLZM66Mox1ff/d6j', 'opratShowCardControl', __filename);
// Script/opratShowCardControl.js

"use strict";

var config = require("config");
cc.Class({
    extends: cc.Component,

    properties: {
        spNum: {
            default: null,
            type: cc.Sprite
        }
    },

    start: function start() {
        // this.show(5,null);
    },
    show: function show(click) {
        this.click = click;
        var self = this;
        this.time = 5;
        this.spTxt = "operation_btn/p_add";

        this.schedule(function () {
            if (this.time > 2) {
                this.time -= 1;
                var spurl = this.spTxt + this.time;
                cc.loader.loadRes(spurl, cc.SpriteFrame, function (err, spriteFrame) {
                    self.spNum.getComponent(cc.Sprite).spriteFrame = spriteFrame;
                });
            } else {
                this.node.destroy();
            }
        }, 0.8, this.time, 0);
    },
    close: function close() {
        if (this.node) {
            this.node.destroy();
        }
    },
    btnClick: function btnClick() {
        console.log("点击了明牌按钮");
        if (this.click) {
            this.click(this.time);
        }
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
        //# sourceMappingURL=opratShowCardControl.js.map
        