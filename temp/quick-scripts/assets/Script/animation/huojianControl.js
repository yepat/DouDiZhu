(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/animation/huojianControl.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '5d964Tg8XVFl5JoYVvxDv5h', 'huojianControl', __filename);
// Script/animation/huojianControl.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {},
    start: function start() {
        var self = this;
        var callFunc = cc.callFunc(function () {
            self.node.destroy();
        });
        var delay = cc.delayTime(1);
        this.node.runAction(cc.sequence(delay, callFunc));
    },
    close: function close() {
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
        //# sourceMappingURL=huojianControl.js.map
        