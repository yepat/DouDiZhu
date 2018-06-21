"use strict";
cc._RF.push(module, 'cff8dsADs1O87bsG851NEGA', 'aboutControl');
// Script/dialog/aboutControl.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {},
    start: function start() {},
    closeClick: function closeClick() {
        console.log("close click");
        this.node.destroy();
        cc.vv.audioMgr.playSFX("SpecOk");
    }
});

cc._RF.pop();