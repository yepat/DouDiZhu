"use strict";
cc._RF.push(module, '917adx22mBOi7OyW3Ekl6tk', 'CancelDelegateController');
// Script/CancelDelegateController.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {},
    start: function start() {},
    show: function show(click) {
        this.node.active = true;
        this.click = click;
    },
    close: function close() {
        if (this.node) {
            // this.node.destroy();
            this.node.active = false;
        }
    },
    btnClick: function btnClick() {
        console.log("取消托管");
        if (this.click) this.click();
        // this.node.destroy();
        this.node.active = false;
    }
});

cc._RF.pop();