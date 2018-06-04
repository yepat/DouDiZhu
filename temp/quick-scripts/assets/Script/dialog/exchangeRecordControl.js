(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/dialog/exchangeRecordControl.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '80f25rAokFAa4ngb857PFia', 'exchangeRecordControl', __filename);
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
        //# sourceMappingURL=exchangeRecordControl.js.map
        