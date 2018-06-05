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
                }
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
                    CompatibleHelper.RoomId = response["data"]["roomId"];
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
        