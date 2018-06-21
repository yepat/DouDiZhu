"use strict";
cc._RF.push(module, '1a81b2s2IlExZ02fjc4CfR3', 'fankuiControl');
// Script/dialog/fankuiControl.js

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