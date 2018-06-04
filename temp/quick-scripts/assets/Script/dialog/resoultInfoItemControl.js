(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/dialog/resoultInfoItemControl.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'befceraMjdEGZQ+n9tC5pA+', 'resoultInfoItemControl', __filename);
// Script/dialog/resoultInfoItemControl.js

"use strict";

var emailItemControl = require("emailItemControl");
cc.Class({
    extends: cc.Component,

    properties: {
        pDizhu: {
            default: null,
            type: cc.Sprite
        },
        labNickName: {
            default: null,
            type: cc.Label
        },
        labDifen: {
            default: null,
            type: cc.Label
        },
        labBeishu: {
            default: null,
            type: cc.Label
        },
        labLedou: {
            default: null,
            type: cc.Label
        }
    },
    onLoad: function onLoad() {
        this.pDizhu.node.active = false;
    },

    // start () {

    // },   
    init: function init(isDizhi, name, difen, beishu, ledou) {
        if (isDizhi) {
            this.pDizhu.node.active = true;
        } else {
            this.labNickName.node.color = new cc.Color(255, 255, 255);
            this.labDifen.node.color = new cc.Color(255, 255, 255);
            this.labBeishu.node.color = new cc.Color(255, 255, 255);
            this.labLedou.node.color = new cc.Color(255, 255, 255);
        }
        this.labNickName.string = name;
        this.labDifen.string = "" + difen;
        this.labBeishu.string = "" + beishu;
        this.labLedou.string = "" + ledou;
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
        //# sourceMappingURL=resoultInfoItemControl.js.map
        