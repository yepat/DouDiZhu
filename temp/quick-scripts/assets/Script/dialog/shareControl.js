(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/dialog/shareControl.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '69186QOGcNP24M8wI7sbkLu', 'shareControl', __filename);
// Script/dialog/shareControl.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {},
    start: function start() {},
    closeClick: function closeClick() {
        console.log("close click");
        this.node.destroy();
    },
    btnClick: function btnClick(event) {
        var btnName = event.target.name;
        console.log("-------" + btnName);
    },
    getClick: function getClick() {
        console.log("-------get");
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
        //# sourceMappingURL=shareControl.js.map
        