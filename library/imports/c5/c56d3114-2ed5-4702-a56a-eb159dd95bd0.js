"use strict";
cc._RF.push(module, 'c56d3EULtVHAqVq6xWd2VvQ', 'opratDoubleControl');
// Script/opratDoubleControl.js

"use strict";

var config = require("config");

cc.Class({
    extends: cc.Component,

    properties: {
        // progressBar : {
        //     default : null,
        //     type : cc.ProgressBar
        // },
        timeTxt: {
            default: null,
            type: cc.Label
        },
        clock: {
            default: null,
            type: cc.Node
        },
        timeCount: 3
    },
    onLoad: function onLoad() {
        this.timeCount = 3;
        this.timeTxt.string = "" + this.timeCount;
    },
    start: function start() {
        // this.show(10,null);

        // this.timeCount = config.AddRatioTime;
        // this.timeTxt.string = "" + this.timeCount;

        this.clockX = this.clock.getPositionX();
        this.clockY = this.clock.getPositionY();

        this.schedule(function () {
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
    show: function show(click) {
        // this.time = time*10;
        this.click = click;

        // this.pross = 1.0;
        // this.dt = 1/this.time;
        // this.schedule(function() {
        //     if(this.pross > 0){
        //         this.pross -= this.dt;
        //         // this.progressBar.getComponent(cc.ProgressBar).progress = this.pross;
        //     }else{
        //         // this.progressBar.getComponent(cc.ProgressBar).progress = 0;
        //         this.node.destroy();
        //     }  
        // },0.1, this.time, 0.01);
    },
    close: function close() {
        if (this.node) {
            this.node.destroy();
        }
    },
    btnClick1: function btnClick1() {
        console.log("点击了加倍按钮");
        if (this.click) {
            this.click();
        }
        this.node.destroy();
    },
    btnClick2: function btnClick2() {
        console.log("点击了不加倍按钮");
        // if(this.click){
        //     this.click();
        // }
        this.node.destroy();
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
    }
});

cc._RF.pop();