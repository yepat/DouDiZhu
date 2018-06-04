"use strict";
cc._RF.push(module, '32b68GmBLZM66Mox1ff/d6j', 'opratShowCardControl');
// Script/opratShowCardControl.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        spNum: {
            default: null,
            type: cc.Sprite
        }
    },

    start: function start() {
        this.show(5, null);
    },
    show: function show(time, click) {
        this.time = time;
        this.click = click;
        var self = this;

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
        }, 1.0, this.time, 0);
    },
    btnClick: function btnClick() {
        console.log("点击了明牌按钮");
        if (this.click) {
            this.click();
        }
        this.node.destroy();
    }
});

cc._RF.pop();