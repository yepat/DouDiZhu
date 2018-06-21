(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/dialog/exchangeControl.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '78080u08PZNb6W8rE8TrOth', 'exchangeControl', __filename);
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
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=exchangeControl.js.map
        