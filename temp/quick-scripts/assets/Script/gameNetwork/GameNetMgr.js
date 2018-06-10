(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/gameNetwork/GameNetMgr.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '72ee4iEEmpHqLHnKeAEFN6H', 'GameNetMgr', __filename);
// Script/gameNetwork/GameNetMgr.js

"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var Protocol = require("Protocol");

var GameNetMgr = cc.Class({
    extends: cc.Component,
    statics: {
        opPlayerSeatId: "",
        sendRequest: function sendRequest(cmdName, eventName, arg) {
            if (cmdName == "Game") {
                if (eventName == "loginRoom") {
                    this.sendLoginRoom(arg);
                } else if (eventName == "startGame") {
                    this.sendStartGame(arg);
                } else if (eventName == "callLord") {
                    this.sendCallLord(arg);
                } else if (eventName == "grabLord") {
                    this.sendGrabLord(arg);
                } else if (eventName == "showCard") {
                    this.sendShowCard(arg);
                } else if (eventName == "giveupSendCard") {
                    this.sendGiveupSendCard(arg);
                } else if (eventName == "sendCard") {
                    this.sendSendCard(arg);
                } else if (eventName == "requestDelegate") {
                    this.sendRequestDelegate(arg);
                } else if (eventName == "cancelDelegate") {
                    this.sendCancelDelegate(arg);
                } else if (eventName == "addRatio") {
                    this.sendAddRatio(arg);
                } else if (eventName == "exitRoom") {
                    this.sendExitRoom();
                } else if (eventName == "sayToTable") {
                    this.SendSayToTable(arg);
                }
            }
        },
        sendLoginRoom: function sendLoginRoom(arg) {
            var params = {};
            params.t = Protocol.Request.Game.Init;
            params.roomId = parseInt(arg.roomId);
            params.isContinue = parseInt(arg.isContinue);
            params.modelId = arg.modelId;
            cc.vv.net.send("loginRoom", Protocol.Command.Game, params);
        },
        sendStartGame: function sendStartGame(arg) {
            var params = {};
            params.t = Protocol.Request.Game.Go;
            if (arg) {
                params.showcard = true;
            }
            this.opPlayerSeatId = "-1";
            cc.vv.net.send("startGame", Protocol.Command.Game, params);
        },
        sendCallLord: function sendCallLord(arg) {
            var params = {};
            var num = arg; // 1=叫地主 2=不叫地主
            params.t = Protocol.Request.Game.CallLord;
            params.doLord = num;
            cc.vv.net.send("callLord", Protocol.Command.Game, params);
        },
        sendGrabLord: function sendGrabLord(arg) {
            var params = {};
            var num = arg; // 1=抢地主 2=不抢地主
            params.t = Protocol.Request.Game.GrabLord;
            params.grabLord = num;
            cc.vv.net.send("grabLord", Protocol.Command.Game, params);
        },
        sendShowCard: function sendShowCard(rate) {
            if (rate > 2) {} else {
                rate = 2;
            }
            var params = {};
            params.t = Protocol.Request.Game.ShowCard;
            params.showRate = rate;
            cc.vv.net.send("showCard", Protocol.Command.Game, params);
        },
        sendGiveupSendCard: function sendGiveupSendCard() {
            var params = {};
            params.t = Protocol.Request.Game.NotFollow;
            cc.vv.net.send("giveupSendCard", Protocol.Command.Game, params);
        },
        sendSendCard: function sendSendCard(args) {
            var params = {};
            params.t = Protocol.Request.Game.SendCard;
            if (_typeof(args[0]) == "object") {
                params.sendCards = args[0];
                params.jokto = args[1];
            } else {
                params.sendCards = args;
            }
            cc.vv.net.send("sendCard", Protocol.Command.Game, params);
        },
        sendRequestDelegate: function sendRequestDelegate() {
            var params = {};
            params.t = Protocol.Request.Game.RequestDelegate;
            cc.vv.net.send("requestDelegate", Protocol.Command.Game, params);
        },
        sendCancelDelegate: function sendCancelDelegate() {
            var params = {};
            params.t = Protocol.Request.Game.CancelDelegate;
            cc.vv.net.send("cancelDelegate", Protocol.Command.Game, params);
        },

        //--加倍
        sendAddRatio: function sendAddRatio() {
            var params = {};
            params.t = Protocol.Request.Game.AddRatio;
            cc.vv.net.send("addRatio", Protocol.Command.Game, params);
        },

        //退出
        sendExitRoom: function sendExitRoom() {
            var params = {};
            params.t = Protocol.Request.Game.ExitRoom;
            cc.vv.net.send("exitRoom", Protocol.Command.Game, params);
        },

        //拍桌聊天
        //牌桌里发语言
        SendSayToTable: function SendSayToTable(arg) {
            var params = {};
            params.t = Protocol.Request.Game.SayToTable;
            params.wordId = arg.id;
            params.word = arg.word;
            cc.vv.net.send("sayToTable", Protocol.Command.Game, params);
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
        //# sourceMappingURL=GameNetMgr.js.map
        