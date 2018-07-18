(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/dialog/aboutControl.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'cff8dsADs1O87bsG851NEGA', 'aboutControl', __filename);
// Script/dialog/aboutControl.js

"use strict";

var config = require("config");
cc.Class({
    extends: cc.Component,

    properties: {
        lab_content_1: {
            default: null,
            type: cc.Label
        },
        lab_content_2: {
            default: null,
            type: cc.Label
        }
    },
    start: function start() {
        this.lab_content_2.string = "版本号：" + config.VERSION_ABOUT;
    },
    closeClick: function closeClick() {
        console.log("close click");
        this.node.destroy();
        cc.vv.audioMgr.playSFX("SpecOk");
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
        //# sourceMappingURL=aboutControl.js.map
        