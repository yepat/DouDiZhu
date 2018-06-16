"use strict";
cc._RF.push(module, 'c3e81EziVFOC6wdlw2myYgS', 'loadingControl');
// Script/animation/loadingControl.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        loading: {
            default: null,
            type: cc.Sprite
        }
    },

    start: function start() {
        var rotate = cc.rotateBy(3, 360);
        var repeat_ = cc.repeatForever(rotate);
        this.loading.node.runAction(repeat_);
    },
    show: function show(time) {},
    close: function close() {
        if (this.node) {
            this.node.destroy();
        }
    }
});

cc._RF.pop();