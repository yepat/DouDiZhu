(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/animation/expressionControl.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'd0a233e+vFILqcnZGW6aMCC', 'expressionControl', __filename);
// Script/animation/expressionControl.js

"use strict";

// var GameNetMgr = require("GameNetMgr");
// var config = require("config");
cc.Class({
    extends: cc.Component,

    properties: {
        node_ske: {
            default: null,
            type: cc.Node
        },
        node_pic: {
            default: null,
            type: cc.Sprite
        }
    },
    onLoad: function onLoad() {
        var width = cc.director.getWinSize().width;
        var height = cc.director.getWinSize().height;
        // console.log("width:"+width);
        // console.log("height:"+height);
        this.node.width = width;
        this.node.height = height;
    },
    start: function start() {
        // var args = {
        //     beginPos:cc.p(0,0),
        //     endpos:cc.p(300,300),
        //     audioUrl:""
        // }
        // this.show(args);
    },
    show: function show(args) {
        if (!args) return;

        var beginPos = args.beginPos;
        var endpos = args.endpos;
        var audioUrl = args.audioUrl;

        this.node_pic.node.setPosition(beginPos);
        this.node_ske.setPosition(cc.p(endpos.x, endpos.y - 50));
        this.node_ske.active = false;
        var self = this;
        var callFunc1 = cc.callFunc(function () {
            self.node_ske.active = true;
            self.node_pic.enabled = false;
            var dragonDisplay = self.node_ske.getComponent(dragonBones.ArmatureDisplay);
            if (dragonDisplay) {
                dragonDisplay.playAnimation('newAnimation');
                if (audioUrl != "") cc.vv.audioMgr.playSFX(audioUrl);
            }
        });
        var callFunc2 = cc.callFunc(function () {
            self.node.destroy();
        });

        var move = cc.moveTo(0.2, cc.p(endpos.x, endpos.y - 50));
        var delay = cc.delayTime(2);
        this.node_pic.node.runAction(cc.sequence(move, callFunc1, delay, callFunc2));
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
        //# sourceMappingURL=expressionControl.js.map
        