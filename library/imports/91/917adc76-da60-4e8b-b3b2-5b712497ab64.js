"use strict";
cc._RF.push(module, '917adx22mBOi7OyW3Ekl6tk', 'CancelDelegateController');
// Script/CancelDelegateController.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {},
    start: function start() {},
    show: function show(click) {
        this.click = click;
    },
    close: function close() {
        this.node.destroy();
    },
    btnClick: function btnClick() {
        console.log("取消托管");
        if (this.click) this.click();
        this.node.destroy();
    }
});

cc._RF.pop();