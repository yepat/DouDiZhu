"use strict";
cc._RF.push(module, 'e7857uEaN1AV5ZXYlbc5zrw', 'chatBoxControl');
// Script/dialog/chatBoxControl.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        content: {
            default: null,
            type: cc.Label
        }
    },
    // onLoad () {},
    start: function start() {},
    show: function show(contentTxt) {
        this.node.active = true;
        this.content.string = contentTxt;
        this.node.stopAllActions();
        var self = this;
        var callFunc = cc.callFunc(function () {
            // self.node.destroy();
            self.node.active = false;
        });
        var delay = cc.delayTime(2);
        this.node.runAction(cc.sequence(delay, callFunc));
    }
});

cc._RF.pop();