(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/dialog/shopControl.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '500admjfkxC4pcuxdFqWeDz', 'shopControl', __filename);
// Script/dialog/shopControl.js

"use strict";

var config = require("config");
var EventHelper = require("EventHelper");
var PlayerDetailModel = require("PlayerDetailModel");
var dialogManager = require("dialogManager");

cc.Class({
    extends: cc.Component,

    properties: {
        btnCoin: {
            default: null,
            type: cc.Sprite
        },
        btnProp: {
            default: null,
            type: cc.Sprite
        },
        gridCoin: {
            default: null,
            type: cc.Node
        },
        gridProp: {
            default: null,
            type: cc.Node
        }
    },
    // onLoad () {},
    start: function start() {
        var self = this;
        cc.loader.loadRes("shop/p_shopBtn_1", cc.SpriteFrame, function (err, spriteFrame) {
            self.btnCoin.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        });
        cc.loader.loadRes("shop/p_shopBtn_2", cc.SpriteFrame, function (err, spriteFrame) {
            self.btnProp.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        });
        this.gridCoin.active = true;
        this.gridProp.active = false;
    },
    closeClick: function closeClick() {
        console.log("close click");
        this.node.destroy();
        cc.vv.audioMgr.playSFX("SpecOk");
    },
    btnCoinClick: function btnCoinClick() {
        console.log("btnCoinClick");
        this.gridCoin.active = true;
        this.gridProp.active = false;
        var self = this;
        cc.loader.loadRes("shop/p_shopBtn_1", cc.SpriteFrame, function (err, spriteFrame) {
            self.btnCoin.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        });
        cc.loader.loadRes("shop/p_shopBtn_2", cc.SpriteFrame, function (err, spriteFrame) {
            self.btnProp.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        });
    },
    btnPropClick: function btnPropClick() {
        console.log("btnPropClick");
        this.gridCoin.active = false;
        this.gridProp.active = true;
        var self = this;
        cc.loader.loadRes("shop/p_shopBtn_2", cc.SpriteFrame, function (err, spriteFrame) {
            self.btnCoin.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        });
        cc.loader.loadRes("shop/p_shopBtn_1", cc.SpriteFrame, function (err, spriteFrame) {
            self.btnProp.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        });
    },
    coinItemClick: function coinItemClick(event) {
        var btnName = event.target.name;
        console.log("coinItemClick:" + btnName);
    },
    propItemClick: function propItemClick(event) {
        var btnName = event.target.name;
        console.log("propItemClick:" + btnName);
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
        //# sourceMappingURL=shopControl.js.map
        