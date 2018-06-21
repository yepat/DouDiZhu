"use strict";
cc._RF.push(module, '78080u08PZNb6W8rE8TrOth', 'exchangeControl');
// Script/dialog/exchangeControl.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        lequanNum: {
            default: null,
            type: cc.Label
        }
    },
    start: function start() {},
    closeClick: function closeClick() {
        console.log("close click");
        this.node.destroy();
        cc.vv.audioMgr.playSFX("SpecOk");
    },
    recordClick: function recordClick() {
        console.log("record click");
    }
});

cc._RF.pop();