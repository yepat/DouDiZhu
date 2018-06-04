"use strict";
cc._RF.push(module, '80f25rAokFAa4ngb857PFia', 'exchangeRecordControl');
// Script/dialog/exchangeRecordControl.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {},
    start: function start() {},
    closeClick: function closeClick() {
        console.log("close click");
        this.node.destroy();
    }
});

cc._RF.pop();