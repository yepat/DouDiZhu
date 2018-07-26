(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/util/ClockControl.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '74c75z4+AFA2p0Z2kyQJ1wv', 'ClockControl', __filename);
// Script/ClockControl.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        timeTxt: {
            default: null,
            type: cc.Label
        },
        clock: {
            default: null,
            type: cc.Node
        },
        timeCount: 30
    },

    start: function start() {

        this.clockX = this.clock.getPositionX();
        this.clockY = this.clock.getPositionY();

        this.schedule(function () {
            if (this.timeCount > 0) {
                this.timeCount -= 1;
                if (this.timeCount <= 5 && this.timeCount >= 1) {
                    // cc.vv.audioMgr.playSFX("timeup_alarm.mp3");
                    this.shakeClock();
                }
                var pre = "";
                if (this.timeCount <= 0) {
                    this.timeCount = 0;
                    // this.node.destroy();
                    this.node.active = false;
                }
                var t = Math.ceil(this.timeCount);
                if (t < 10) {
                    pre = "";
                }
                this.timeTxt.string = pre + t;
            }
        }, 1);
    },
    show: function show(time) {
        this.node.active = true;
        this.timeCount = time;
        this.timeTxt.string = "" + time;
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
        //xx_test
        cc.vv.audioMgr.playSFX("Special_Remind");
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
        //# sourceMappingURL=ClockControl.js.map
        