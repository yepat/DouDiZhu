"use strict";
cc._RF.push(module, '5d964Tg8XVFl5JoYVvxDv5h', 'huojianControl');
// Script/animation/huojianControl.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {},
    start: function start() {
        var self = this;
        var callFunc = cc.callFunc(function () {
            self.node.destroy();
        });
        var delay = cc.delayTime(1);
        this.node.runAction(cc.sequence(delay, callFunc));
    },
    close: function close() {
        this.node.destroy();
    }
});

cc._RF.pop();