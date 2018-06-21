"use strict";
cc._RF.push(module, '11981lKVm5PCYFV3U8YkCcn', 'opratOutCardControl');
// Script/opratOutCardControl.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        timeTxt: {
            default: null,
            type: cc.Label
        },
        buchuBtn: {
            default: null,
            type: cc.Node
        },
        tishiBtn: {
            default: null,
            type: cc.Node
        },
        chupaiBtn: {
            default: null,
            type: cc.Node
        },
        clock: {
            default: null,
            type: cc.Node
        },
        tishi: {
            default: null,
            type: cc.Sprite
        },
        timeCount: 30
    },

    onLoad: function onLoad() {
        this.clockX = this.clock.getPositionX();
        this.clockY = this.clock.getPositionY();

        // this.tishi.visible = false;
        this.tishi.enabled = false;

        this.schedule(function () {
            // 这里的 this 指向 component
            if (this.timeCount > 0) {
                this.timeCount -= 1;
                if (this.timeCount <= 5) {
                    // cc.vv.audioMgr.playSFX("timeup_alarm.mp3");
                    this.shakeClock();
                }
                var pre = "";
                if (this.timeCount <= 0) {
                    this.timeCount = 0;
                    this.node.destroy();
                }
                var t = Math.ceil(this.timeCount);
                if (t < 10) {
                    pre = "";
                }
                this.timeTxt.string = pre + t;
            }
        }, 1);
    },

    // start () {
    // },
    show: function show(time, buchuFunc, tishiFunc, chupaiFunc) {
        this.timeCount = time;
        this.buchuFunc = buchuFunc;
        this.tishiFunc = tishiFunc;
        this.chupaiFunc = chupaiFunc;

        var pre = "";
        this.timeTxt.string = pre + time;
    },
    close: function close() {
        if (this.node) {
            this.node.destroy();
        }
    },
    buchuClick: function buchuClick() {
        console.log("不出");
        if (this.buchuFunc) this.buchuFunc();
        this.node.destroy();
        // cc.vv.audioMgr.playSFX("SpecOk");
    },
    tishiClick: function tishiClick() {
        console.log("提示");
        if (this.tishiFunc) this.tishiFunc();
        // cc.vv.audioMgr.playSFX("SpecOk");
    },
    chupaiClick: function chupaiClick(num) {
        console.log(">>>出牌");
        var typenum = 0;
        if (this.chupaiFunc) {
            typenum = this.chupaiFunc();
            console.log("typenum:" + typenum);
        }

        if (typeof num == "number") {
            typenum = num;
        }

        console.log("typenum11111:" + typenum);

        if (typenum == 0) {
            // this.showTips("没有选择要出的牌！");
            this.showTips("showTips/p_tips_noSeletcedCrad");
        } else if (typenum == -1) {
            // this.showTips("您选择的牌无法出出去哦！");  
            this.showTips("showTips/p_tips_seletcedCardTypeError");
        } else if (typenum == -2) {
            this.showTips("showTips/p_tips_noCard");
            // this.node.destroy();
        } else {}
            // this.tishi.enabled = false;


            // cc.vv.audioMgr.playSFX("SpecOk");
    },
    shakeClock: function shakeClock() {
        var mt1 = cc.moveTo(0.05, this.clockX, this.clockY - 2);
        var mt2 = cc.moveTo(0.05, this.clockX, this.clockY + 2);
        var mt3 = cc.moveTo(0.05, this.clockX, this.clockY - 2);
        var mt4 = cc.moveTo(0.05, this.clockX, this.clockY + 2);
        var mt5 = cc.moveTo(0.05, this.clockX, this.clockY - 2);
        var mt6 = cc.moveTo(0.05, this.clockX, this.clockY + 2);
        var mt7 = cc.moveTo(0.05, this.clockX, this.clockY);
        this.clock.runAction(cc.sequence(mt1, mt2, mt3, mt4, mt5, mt6, mt7));
    },
    showTips: function showTips(imgUrl) {
        var self = this;
        if (self.tishi) {} else {
            return;
        }
        this.tishi.node.stopAllActions();
        this.tishi.enabled = true;
        // this.tishi.string = content;
        cc.loader.loadRes(imgUrl, cc.SpriteFrame, function (err, spriteFrame) {
            self.tishi.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        });

        var delay = cc.delayTime(2);
        var callFunc = cc.callFunc(function () {
            self.tishi.enabled = false;
        });
        this.tishi.node.runAction(cc.sequence(delay, callFunc));
    }
});

cc._RF.pop();