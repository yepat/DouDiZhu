(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/gameNetwork/GameNet.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '15c8fdeug5LtJuDTQtrqwqd', 'GameNet', __filename);
// Script/gameNetwork/GameNet.js

"use strict";

var ByteArray = require("ByteArray");
var config = require("config");
var EventHelper = require("EventHelper");
var Protocol = require("Protocol");
var Events = require("Events");

var GameNet = cc.Class({
    extends: cc.Component,
    statics: {
        ip: "",
        sio: null,
        isPinging: false,
        fnDisconnect: null,
        handlers: {},
        addHandler: function addHandler(event, fn) {},
        connect: function connect(ip, port, callback) {
            var self = this;
            self.callback = callback;
            this.ip = ip + ":" + port;
            this.sio = new WebSocket("ws://" + this.ip);
            this.sio.binaryType = "arraybuffer";
            this.sio.onopen = function (evt) {
                console.log("Connection open ");
                self.isPinging = true;
                self.callback();
            };
            this.sio.onmessage = function (evt) {
                // console.log(evt.data);
                // console.log("length:"+evt.data.length)
                var cmd = -1; //第八位是大协议号
                var strdata = evt.data;
                var data = JSON.parse(strdata);
                self.receivedMsg(data, cmd);
            };
            this.sio.onclose = function (evt) {
                console.log("Connection closed.");
                self.isPinging = false;
            };
            this.sio.onerror = function (evt) {
                console.log("Connection onerror." + evt.data);
                self.isPinging = false;
            };
        },
        send: function send(event, cmd, params) {
            console.log("send:" + event);
            var view = ByteArray.getView(params, cmd);
            if (this.sio) this.sio.send(view);
        },
        close: function close() {
            if (this.sio) this.sio.close();
        },
        receivedMsg: function receivedMsg(data, cmd) {
            // console.log(typeof(data));
            // console.log(data);
            cmd = data.cmd;
            console.log("cmd:" + cmd + " code:" + data.code);

            if (cmd == Protocol.Command.HeartBeat) {
                //心跳
                if (data.code == Protocol.Response.HeartBeat.Alive) {
                    EventHelper.DispatchCustomEvent(config.MyNode, "HeartBeat", data);
                }
            }

            if (cmd == Protocol.Command.Login) {
                //登陆
                if (data.code == Protocol.Response.Login.Regist) {
                    EventHelper.DispatchCustomEvent(config.MyNode, "Regist", data);
                } else if (data.code == Protocol.Response.Login.OK) {
                    EventHelper.DispatchCustomEvent(config.MyNode, "LoginOK", data);
                }
            }

            if (cmd == Protocol.Command.Game) {
                console.log(data);
                if (data.code == Protocol.Response.Game.NoLogin) {
                    this.handleLoginRoomResult(data, data.code);
                } else if (data.code == Protocol.Response.Game.InitOk) {
                    this.handleLoginRoomResult(data, data.code);
                } else if (data.code == Protocol.Response.Game.CoinsNoMatchRoom) {
                    this.handleLoginRoomResult(data, data.code);
                } else if (data.code == Protocol.Response.Game.Queued) {
                    //进入队列
                    console.log("进入队列");
                    EventHelper.DispatchCustomEvent(config.MyNode, "Queued", data);
                } else if (data.code == Protocol.Response.Game.GameReady) {
                    //游戏准备好了
                    console.log("游戏准备好了");
                    EventHelper.DispatchCustomEvent(config.MyNode, "GameReady", data);
                } else if (data.code == Protocol.Response.Game.TableTimesUpdate) {
                    //桌子的倍数发生改变
                    console.log("桌子的倍数发生改变");
                    EventHelper.DispatchCustomEvent(config.MyNode, "TableTimesUpdate", data);
                } else if (data.code == Protocol.Response.Game.SendCard) {
                    //发牌, 包括各用户的牌信息
                    console.log("发牌, 包括各用户的牌信息");
                    EventHelper.DispatchCustomEvent(config.MyNode, "SendCard", data);
                } else if (data.code == Protocol.Response.Game.RefreshPlayerData) {
                    //刷新用户金币(用户桌面)
                    console.log("刷新用户金币");
                    EventHelper.DispatchCustomEvent(config.MyNode, "RefreshPlayerData", data);
                } else if (data.code == Protocol.Response.Game.TurnCallLord) {
                    //轮到谁叫地主
                    console.log("轮到谁叫地主");
                    EventHelper.DispatchCustomEvent(config.MyNode, "TurnCallLord", data);
                } else if (data.code == Protocol.Response.Game.CallLord) {
                    //玩家叫地主
                    console.log("玩家叫地主");
                    EventHelper.DispatchCustomEvent(config.MyNode, "CallLord", data);
                } else if (data.code == Protocol.Response.Game.TurnGrabLord) {
                    //轮到谁抢地主
                    console.log("轮到谁抢地主");
                    EventHelper.DispatchCustomEvent(config.MyNode, "TurnGrabLord", data);
                } else if (data.code == Protocol.Response.Game.GrabLord) {
                    //玩家抢地主
                    console.log("玩家抢地主");
                    EventHelper.DispatchCustomEvent(config.MyNode, "GrabLord", data);
                } else if (data.code == Protocol.Response.Game.CallLordOver) {
                    //叫地主结束
                    console.log("叫地主结束");
                    EventHelper.DispatchCustomEvent(config.MyNode, "CallLordOver", data);
                } else if (data.code == Protocol.Response.Game.CanDoubleResult) {
                    //通知是否可以加倍
                    console.log("通知是否可以加倍");
                    EventHelper.DispatchCustomEvent(config.MyNode, "CanDoubleResult", data);
                } else if (data.code == Protocol.Response.Game.TurnSendCard) {
                    //轮到谁出牌
                    console.log("轮到谁出牌");
                    EventHelper.DispatchCustomEvent(config.MyNode, "TurnSendCard", data);
                } else if (data.code == Protocol.Response.Game.PlayerDelegated) {
                    //用户托管
                    console.log("用户托管");
                    EventHelper.DispatchCustomEvent(config.MyNode, "PlayerDelegated", data);
                } else if (data.code == Protocol.Response.Game.PlayerSendCard) {
                    //用户出牌
                    console.log("用户出牌");
                    EventHelper.DispatchCustomEvent(config.MyNode, "PlayerSendCard", data);
                } else if (data.code == Protocol.Response.Game.PlayerNotSend) {
                    //用户不出牌
                    console.log("用户不出牌");
                    EventHelper.DispatchCustomEvent(config.MyNode, "PlayerNotSend", data);
                } else if (data.code == Protocol.Response.Game.PlayerShowCard) {
                    //用户明牌
                    console.log("用户明牌");
                    EventHelper.DispatchCustomEvent(config.MyNode, "PlayerShowCard", data);
                } else if (data.code == Protocol.Response.Game.GameComplete) {
                    //本局结束
                    console.log("本局结束");
                    EventHelper.DispatchCustomEvent(config.MyNode, "GameComplete", data);
                } else if (data.code == Protocol.Response.Game.TableUserExit) {
                    //有用户退出 通知桌上的玩家重新进入队列
                    console.log("有用户退出 通知桌上的玩家重新进入队列");
                    EventHelper.DispatchCustomEvent(config.MyNode, "TableUserExit", data);
                } else if (data.code == Protocol.Response.Game.InvalidCardNum) {
                    ////出的牌不够大 [非法出牌]
                    console.log("出的牌不够大 [非法出牌]");
                    EventHelper.DispatchCustomEvent(config.MyNode, "InvalidCardNum", data);
                } else if (data.code == Protocol.Response.Game.SayToTableInfo) {
                    ////聊天信息
                    console.log("聊天信息");
                    EventHelper.DispatchCustomEvent(config.MyNode, "SayToTableInfo", data);
                }
                //
            }
        },
        handleLoginRoomResult: function handleLoginRoomResult(response, code) {
            var succ = true;
            var coinsNoMatchRoom = false;
            var inGaming = false;
            var msg = null;
            var newRoomId = null;

            if (code == Protocol.Response.Game.NoLogin) {
                succ = false;
                console.log("未登录");
                return;
            } else if (code == Protocol.Response.Game.InitOk) {
                console.log("进入房间成功");
                if (response["data"]["isGaming"] == 1) {
                    console.log("进入未完成牌局");
                    inGaming = true;
                    succ = false;
                    config.RoomId = response["data"]["roomId"];
                }
            } else if (code == Protocol.Response.Game.CoinsNoMatchRoom) {
                console.log("进入房间失败");
                succ = false;
                coinsNoMatchRoom = true;
                msg = response["data"]["msg"];
                newRoomId = response["data"]["newRoomId"];
            }

            var params = {};
            params.name = Events.Network.LoginRoomResult;
            params.ok = succ;
            params.payload = response;
            params.noCoin = coinsNoMatchRoom;
            params.inGaming = inGaming;
            params.msg = msg;
            params.newRoomId = newRoomId;

            console.log(">>>>>>>>>>Events.Network.LoginRoomResult");

            EventHelper.DispatchCustomEvent(config.MyNode, Events.Network.LoginRoomResult, params);
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
        //# sourceMappingURL=GameNet.js.map
        