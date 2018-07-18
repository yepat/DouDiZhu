"use strict";
cc._RF.push(module, '8bdcevf/XxFAKDbPvMW3ocZ', 'watingStarControl');
// Script/animation/watingStarControl.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        timeTxt: {
            default: null,
            type: cc.Label
        },
        timeCount: 30
    },

    start: function start() {
        this.schedule(function () {
            if (this.timeCount > 0) {
                this.timeCount -= 1;
                var pre = "";
                if (this.timeCount <= 0) {
                    this.timeCount = 30;
                    // this.node.destroy();
                }
                var t = Math.ceil(this.timeCount);
                if (t < 10) {
                    pre = "";
                }
                this.timeTxt.string = pre + t;
            }
        }, 1);

        //xx_test
        this.show(30);
    },
    show: function show(time) {
        this.timeCount = time;
        this.timeTxt.string = "" + time;
    },
    close: function close() {
        if (this.node) {
            this.node.destroy();
        }
    },
    showNode: function showNode() {
        console.log("wating-----showNode");
        if (this.timeCount <= 1) this.show(30);
        this.node.active = true;
    },
    hideNode: function hideNode() {
        console.log("wating-----hideNode");
        this.timeCount = 0;
        this.node.active = false;
    }
});

cc._RF.pop();