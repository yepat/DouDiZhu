"use strict";
cc._RF.push(module, '1104axk1NtBda0XlAkGGWdL', 'blinkAlarmControl');
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