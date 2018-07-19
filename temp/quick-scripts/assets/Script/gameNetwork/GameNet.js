(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/gameNetwork/GameNet.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '15c8fdeug5LtJuDTQtrqwqd', 'GameNet', __filename);
// Script/gameNetwork/GameNet.js

"use strict";

// var ByteArray = require("ByteArray");
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
            this.sio = new WebSocket("wss://" + this.ip);
            //xx_test
            // this.ip = "180.150.178.112:9300";
            // this.sio = new WebSocket("ws://"+this.ip);

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
            if (event != "HeartBeat") console.log("<- send:" + event);
            // console.log(params);

            params.cmd = cmd;
            var info = JSON.stringify(params);
            // console.log(params);
            this.sio.send(info);

            // var view = ByteArray.getView(params,cmd);
            // if(this.sio)
            //     this.sio.send(view);
        },
        close: function close() {
            if (this.sio) this.sio.close();
        },
        receivedMsg: function receivedMsg(data, cmd) {
            // console.log(typeof(data));
            // console.log(data);
            cmd = data.cmd;
            if (cmd != 0) {
                console.log("-> cmd:" + cmd + " code:" + data.code);
            }

            if (cmd == Protocol.Command.Game) {
                if (data.code == Protocol.Response.Game.ReconnectionData) {
                    //短线重连
                    console.log("短线重连");
                    EventHelper.DispatchCustomEvent(config.MyNode, "ReconnectionData", data);
                }
            }

            if (config.stopOnMassage) //暂停协议处理
                return;

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

            if (cmd == Protocol.Command.System) {

                if (data.code == Protocol.Response.System.RepeatLogin) {
                    //通知用户连接被另外一个连接踢掉
                    console.log("通知用户连接被另外一个连接踢掉");
                    EventHelper.DispatchCustomEvent(config.MyNode, "RepeatLogin", data);
                }

                if (data.code == Protocol.Response.System.RefreshDataResult) {
                    //刷新用户信息数据
                    console.log("刷新用户信息数据");
                    EventHelper.DispatchCustomEvent(config.MyNode, "RefreshDataResult", data);
                } else if (data.code == Protocol.Response.System.MailResult) {
                    //邮箱数据
                    console.log("邮箱数据");
                    EventHelper.DispatchCustomEvent(config.MyNode, "MailResult", data);
                } else if (data.code == Protocol.Response.System.ReadMailResult) {
                    //标记邮件已读结果
                    console.log("标记邮件已读结果");
                    EventHelper.DispatchCustomEvent(config.MyNode, "ReadMailResult", data);
                } else if (data.code == Protocol.Response.System.GetMailAttachmentResult) {
                    //领取邮件附件结果
                    console.log("领取邮件附件结果");
                    EventHelper.DispatchCustomEvent(config.MyNode, "GetMailAttachmentResult", data);
                } else if (data.code == Protocol.Response.System.DelMailResult) {
                    //删除某个邮件结果
                    console.log("删除某个邮件结果");
                    EventHelper.DispatchCustomEvent(config.MyNode, "DelMailResult", data);
                } else if (data.code == Protocol.Response.System.TaskDailyResult) {
                    //打开每日任务面板
                    console.log("打开每日任务面板");
                    EventHelper.DispatchCustomEvent(config.MyNode, "TaskDailyResult", data);
                } else if (data.code == Protocol.Response.System.GetTaskRewardResult) {
                    //领取任务奖励
                    console.log("领取任务奖励");
                    EventHelper.DispatchCustomEvent(config.MyNode, "GetTaskRewardResult", data);
                } else if (data.code == Protocol.Response.System.ShareInfoResult) {
                    //分享信息结果
                    console.log("分享信息结果");
                    EventHelper.DispatchCustomEvent(config.MyNode, "ShareInfoResult", data);
                } else if (data.code == Protocol.Response.System.ShareGetResult) {
                    //分享领取结果
                    console.log("分享领取结果");
                    EventHelper.DispatchCustomEvent(config.MyNode, "ShareGetResult", data);
                } else if (data.code == Protocol.Response.System.ShareWxResResult) {
                    //微信分享成功发送结果
                    console.log("微信分享成功发送结果");
                    console.log(data);
                    EventHelper.DispatchCustomEvent(config.MyNode, "ShareWxResResult", data);
                } else if (data.code == Protocol.Response.System.WatchAdvertisementResult) {
                    //看完广告领奖
                    console.log("看完广告领奖");
                    console.log(data);
                    EventHelper.DispatchCustomEvent(config.MyNode, "WatchAdvertisementResult", data);
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
                } else if (data.code == Protocol.Response.Game.PlayerCancelDelegate) {
                    //用户取消托管
                    console.log("用户取消托管");
                    EventHelper.DispatchCustomEvent(config.MyNode, "PlayerCancelDelegate", data);
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
                    //出的牌不够大 [非法出牌]
                    console.log("出的牌不够大 [非法出牌]");
                    EventHelper.DispatchCustomEvent(config.MyNode, "InvalidCardNum", data);
                } else if (data.code == Protocol.Response.Game.SayToTableInfo) {
                    //聊天信息
                    console.log("聊天信息");
                    EventHelper.DispatchCustomEvent(config.MyNode, "SayToTableInfo", data);
                } else if (data.code == Protocol.Response.Game.OpenRechargeTipResult) {
                    //打开救济面板
                    console.log("打开救济面板");
                    EventHelper.DispatchCustomEvent(config.MyNode, "OpenRechargeTipResult", data);
                } else if (data.code == Protocol.Response.Game.PokerTask) {
                    //触发牌局任务
                    console.log("触发牌局任务");
                    EventHelper.DispatchCustomEvent(config.MyNode, "PokerTask", data);
                } else if (data.code == Protocol.Response.Game.EmoticonData) {
                    //广播表情包
                    console.log("广播表情包");
                    EventHelper.DispatchCustomEvent(config.MyNode, "EmoticonData", data);
                } else if (data.code == Protocol.Response.Game.SendLzCard) {
                    //发送癞子牌
                    console.log("发送癞子牌");
                    EventHelper.DispatchCustomEvent(config.MyNode, "SendLzCard", data);
                } else if (data.code == Protocol.Response.Game.InvalidCardType) {
                    //出牌有非法数据 [非法出牌] InvalidCardType : 1020,     //出牌有非法数据 [非法出牌]
                    console.log("出牌有非法数据 [非法出牌]");
                    EventHelper.DispatchCustomEvent(config.MyNode, "InvalidCardType", data);
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

            // console.log(">>>>>>>>>>Events.Network.LoginRoomResult");
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
        