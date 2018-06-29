(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/animation/cardTypeControl.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '39670ZwbAhBCJqRuNMPR0N5', 'cardTypeControl', __filename);
// Script/animation/cardTypeControl.js

"use strict";

var config = require("config");
cc.Class({
    extends: cc.Component,

    properties: {
        myCardtype: {
            default: null,
            type: cc.Sprite
        }
    },
    start: function start() {
        var self = this;
        var callFunc = cc.callFunc(function () {
            self.node.destroy();
        });
        var delay = cc.delayTime(2);
        this.node.runAction(cc.sequence(delay, callFunc));
    },
    close: function close() {
        this.node.destroy();
    },
    show: function show(cardType) {
        var self = this;
        var numUrl = "showTips/p_cardtype_1";
        if (cardType == config.CardType.Straight) {} else if (cardType == config.CardType.StraightDouble) {
            numUrl = "showTips/p_cardtype_2";
        }
        cc.loader.loadRes(numUrl, cc.SpriteFrame, function (err, spriteFrame) {
            self.myCardtype.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        });
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
        //# sourceMappingURL=cardTypeControl.js.map
        