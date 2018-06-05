(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/animation/blinkAlarmControl.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '1104axk1NtBda0XlAkGGWdL', 'blinkAlarmControl', __filename);
// Script/animation/blinkAlarmControl.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        blinkNode: {
            default: null,
            type: cc.Sprite
        }
    },

    start: function start() {
        var action = cc.blink(1, 3);
        var repeat_ = cc.repeatForever(action);
        this.blinkNode.node.runAction(repeat_);
    },
    show: function show(time) {},
    close: function close() {
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
        //# sourceMappingURL=blinkAlarmControl.js.map
        