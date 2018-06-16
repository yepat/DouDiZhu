(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/animation/loadingControl.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'c3e81EziVFOC6wdlw2myYgS', 'loadingControl', __filename);
// Script/animation/loadingControl.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        loading: {
            default: null,
            type: cc.Sprite
        }
    },

    start: function start() {
        var rotate = cc.rotateBy(3, 360);
        var repeat_ = cc.repeatForever(rotate);
        this.loading.node.runAction(repeat_);
    },
    show: function show(time) {},
    close: function close() {
        if (this.node) {
            this.node.destroy();
        }
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
        //# sourceMappingURL=loadingControl.js.map
        