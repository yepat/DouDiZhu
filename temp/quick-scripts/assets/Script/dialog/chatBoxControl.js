(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/dialog/chatBoxControl.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'e7857uEaN1AV5ZXYlbc5zrw', 'chatBoxControl', __filename);
// Script/dialog/chatBoxControl.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        content: {
            default: null,
            type: cc.Label
        }
    },
    // onLoad () {},
    start: function start() {},
    show: function show(contentTxt) {
        this.node.active = true;
        this.content.string = contentTxt;
        this.node.stopAllActions();
        var self = this;
        var callFunc = cc.callFunc(function () {
            // self.node.destroy();
            self.node.active = false;
        });
        var delay = cc.delayTime(2);
        this.node.runAction(cc.sequence(delay, callFunc));
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
        //# sourceMappingURL=chatBoxControl.js.map
        