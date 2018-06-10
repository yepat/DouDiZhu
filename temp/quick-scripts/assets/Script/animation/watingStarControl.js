(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/animation/watingStarControl.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '8bdcevf/XxFAKDbPvMW3ocZ', 'watingStarControl', __filename);
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
        //# sourceMappingURL=watingStarControl.js.map
        