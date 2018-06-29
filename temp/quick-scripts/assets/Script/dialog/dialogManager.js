(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/dialog/dialogManager.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '4b867ajR6hL6KpFRRVm3Qvl', 'dialogManager', __filename);
// Script/dialog/dialogManager.js

"use strict";

var commonControl = require("commonControl");

var CancelDelegateController = require("CancelDelegateController");
var opratShowCardControl = require("opratShowCardControl");
var opratDoubleControl = require("opratDoubleControl");
var doubleControl = require("doubleControl");
var playerInfoControl = require("playerInfoControl");
var expressionControl = require("expressionControl");

var dialogManager = cc.Class({
    extends: cc.Component,
    statics: {
        showDialog: function showDialog(prefabUrl, mControl, args) {
            cc.loader.loadRes(prefabUrl, function (err, prefab) {
                if (err) {
                    console.log(err);
                    return;
                }
                var newNode = cc.instantiate(prefab);
                cc.director.getScene().addChild(newNode, 9999);
                if (mControl) {
                    newNode.getComponent(mControl).show(args);
                    return newNode.getComponent(mControl);
                }
            });
        },
        showCommonDialog: function showCommonDialog(title, content, enterClick, cancelClick) {
            var args = {};
            args.arg1 = title;
            args.arg2 = content;
            args.arg3 = enterClick;
            args.arg4 = cancelClick;
            this.showDialog("prefab/commonDialog", commonControl, args);
        },
        showBagDialog: function showBagDialog() {
            this.showDialog("prefab/bagDialog");
        },
        showEmailDialog: function showEmailDialog() {
            this.showDialog("prefab/emailDialog");
        },
        showExchangeDialog: function showExchangeDialog() {
            this.showDialog("prefab/exchangeDialog");
        },
        showFanKuiDialog: function showFanKuiDialog() {
            this.showDialog("prefab/fankuiDialog");
        },
        showAboutDialog: function showAboutDialog() {
            this.showDialog("prefab/aboutDialog");
        },
        showGameResultDialog: function showGameResultDialog(isWin) {
            if (isWin) {
                this.showDialog("prefab/gameResultWin");
            } else {
                this.showDialog("prefab/gameResultLose");
            }
        },
        showSetDialog: function showSetDialog() {
            this.showDialog("prefab/setDialog");
        },
        showTaskDialog: function showTaskDialog() {
            this.showDialog("prefab/taskDialog");
        },
        showJpqNode: function showJpqNode() {
            this.showDialog("prefab/jpqNode");
        },
        showShareDialog: function showShareDialog() {
            this.showDialog("prefab/shareDialog");
        },
        showShopDialog: function showShopDialog() {
            this.showDialog("prefab/shopDialog");
        },
        showChatDialog: function showChatDialog() {
            this.showDialog("prefab/chatDialog");
        },

        //个人信息
        showPlayerInfo: function showPlayerInfo(args) {
            this.showDialog("prefab/playerInfoDialog", playerInfoControl, args);
        },


        //牌桌操作界面
        showOpratCallLord: function showOpratCallLord() {
            this.showDialog("prefab/opratCallLord");
        },
        showOpratOutCard: function showOpratOutCard() {
            this.showDialog("prefab/opratOutCard");
        },
        showOpratDouble: function showOpratDouble(click1, click2) {
            var args = {};
            args.arg1 = click1;
            args.arg2 = click2;
            this.showDialog("prefab/opratDouble", opratDoubleControl, args);
        },
        showOpratShowCard: function showOpratShowCard(click) {
            this.showDialog("prefab/opratShowCard", opratShowCardControl, click);
        },
        showCancelDelegate: function showCancelDelegate(click) {
            this.showDialog("prefab/CancelDelegate", CancelDelegateController, click);
        },


        //动画
        showAnimChunTian: function showAnimChunTian() {
            this.showDialog("animatiom/anim_chuntian");
        },
        showAnimFeiJi: function showAnimFeiJi() {
            this.showDialog("animatiom/anim_feiji");
        },
        showAnimHuoJian: function showAnimHuoJian() {
            this.showDialog("animatiom/anim_huojian");
        },
        showAnimZhaDan: function showAnimZhaDan() {
            this.showDialog("animatiom/anim_zhadan");
        },

        //加倍动画
        showAnimDouble: function showAnimDouble(rate, seatNum) {
            var args = {};
            args.arg1 = rate;
            args.arg2 = seatNum;
            this.showDialog("animatiom/anim_double", doubleControl, args);
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
        //# sourceMappingURL=dialogManager.js.map
        