"use strict";
cc._RF.push(module, '15c8fdeug5LtJuDTQtrqwqd', 'GameNet');
// Script/gameNetwork/GameNet.js

"use strict";

var ByteArray = require("ByteArray");
var config = require("config");
var EventHelper = require("EventHelper");
var Protocol = require("Protocol");

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

                // var arr=[];
                // var dataLength = 0;
                var cmd = -1; //第八位是大协议号
                // arr = evt.data.slice(0,16);
                // for(var i = 0;i<arr.length;i++){
                //     // var code  = arr[i].charCodeAt();
                //     // console.log(a);
                //     // if( i == 0){
                //     //     dataLength = arr[i].charCodeAt();
                //     //     console.log("0--:"+dataLength);
                //     // }
                //     // if( i == 1){
                //     //     dataLength = arr[i].charCodeAt();
                //     //     console.log("1--:"+dataLength);
                //     // }
                //     // if( i == 2){
                //     //     dataLength = arr[i].charCodeAt();
                //     //     console.log("2--:"+dataLength);
                //     // }
                //     if( i == 3){
                //         dataLength = arr[i].charCodeAt();
                //     }
                //     if(i == 7){
                //         cmd = arr[i].charCodeAt();
                //     }
                // }

                // console.log("cmd:"+cmd+" dataLength:"+dataLength);
                // var strdata = evt.data.slice(16,evt.data.length);
                var strdata = evt.data;

                // console.log(typeof(strdata));
                // console.log(strdata)
                var data = JSON.parse(strdata);

                // console.log(data)

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
        send: function send(event, data) {
            console.log(event);
            if (this.sio) this.sio.send(data);
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
        }
    }
});

cc._RF.pop();