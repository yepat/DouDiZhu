(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/RoomLayerControl.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '094768yJc5Ff7oZBOq48GCP', 'RoomLayerControl', __filename);
// Script/RoomLayerControl.js

"use strict";

var config = require("config");
var EventHelper = require("EventHelper");
var PlayerDetailModel = require("PlayerDetailModel");
var GameNetMgr = require("GameNetMgr");
var Events = require("Events");
var dialogManager = require("dialogManager");

cc.Class({
    extends: cc.Component,

    properties: {
        headImg: {
            default: null,
            type: cc.Sprite
        },
        playerName: {
            default: null,
            type: cc.Label
        },
        playerLevel: {
            default: null,
            type: cc.Label
        },
        playerLedou: {
            default: null,
            type: cc.Label
        },
        playerLeQuan: {
            default: null,
            type: cc.Label
        },
        room1: {
            default: null,
            type: cc.Node
        },
        room2: {
            default: null,
            type: cc.Node
        },
        room3: {
            default: null,
            type: cc.Node
        },
        room4: {
            default: null,
            type: cc.Node
        }

    },
    // onLoad () {},
    start: function start() {
        var self = this;
        this.setHeadUrl("");
        this.setNickName(PlayerDetailModel.getNickName());
        this.setLevel(PlayerDetailModel.getTitle());
        this.setLeDou(PlayerDetailModel.getCoin());
        this.setLuQuan(PlayerDetailModel.getCoupon());
        this.roomModelId_ = config.curRoomModelId;
        this.initRoomInfo();

        EventHelper.AddCustomEvent(config.MyNode, Events.Network.LoginRoomResult, self.onLoginRoomResult, self);
    },
    onLoginRoomResult: function onLoginRoomResult(event) {
        var self = this;
        console.log("登陆房间回掉---");
        var data = event.getUserData();
        // console.log(data);
        self.handleLoginRoomResult(data);
    },
    initRoomInfo: function initRoomInfo() {
        console.log(">>>initRoomInfo");

        var roomInfos = [];
        for (var i = 0; i < 4; i++) {
            var index = i + 1;
            var name = "p_room_" + index;
            var strPeopleNum = "Canvas/happyroom/rooms/" + name + "/lab_peopleNum";
            var strCoins = "Canvas/happyroom/rooms/" + name + "/lab_coins";

            var lab_peopleNum = cc.find(strPeopleNum).getComponent(cc.Label);
            var lab_coins = cc.find(strCoins).getComponent(cc.Label);
            var item = {
                peopleNum: lab_peopleNum,
                coins: lab_coins
            };
            roomInfos.push(item);
        }

        var roomType_ = [];
        var rooms = PlayerDetailModel.getRoom();
        for (var k in rooms) {
            var v = rooms[k];
            if (v.modelId == config.curRoomModelId) {
                roomType_ = v.rooms;
            }
        }
        this.roomType_ = roomType_;
        console.log(roomType_);

        for (var i = 0; i < roomType_.length; i++) {
            roomInfos[i].peopleNum.string = "" + this.pepleNumAdd(roomType_[i]["onlineNum"]);
            var str_enter = roomType_[i]["enter"].replace("乐豆", "");
            roomInfos[i].coins.string = str_enter;
        }
    },
    setHeadUrl: function setHeadUrl(url) {
        var self = this;
        //设置微信头像
        var imgUrl = "http://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLSO7sOWsNicYdNM3MbNGGo58zticxgqoO2aqS7zOCVClXl7WExa4KNQ48uSTSszicsyspzsDQ51M4EQ/132";
        imgUrl = imgUrl + "?aa=aa.jpg";
        cc.loader.load(imgUrl, function (err, texture) {
            self.headImg.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
        });
    },
    setNickName: function setNickName(name) {
        //修改昵称
        this.playerName.string = name;
    },
    setLevel: function setLevel(lv) {
        //修改等级
        this.playerLevel.string = lv;
    },
    setLeDou: function setLeDou(number) {
        //修改乐豆数
        if (number >= 10000000) {
            number = Math.floor(number / 10000);
            this.playerLedou.string = "" + number + "万";
        } else {
            this.playerLedou.string = "" + number;
        }
    },
    setLuQuan: function setLuQuan(number) {
        //修改乐券数
        if (number >= 10000000) {
            number = Math.floor(number / 10000);
            this.playerLeQuan.string = "" + number + "万";
        } else {
            this.playerLeQuan.string = "" + number;
        }
    },
    room1Click: function room1Click() {
        console.log("room1Click");
        // cc.director.loadScene("GameScene");
        this.selectedIdx_ = 0;
        this.roomMinScore = this.roomType_[0]["enterLimit"];
        this.trialInfo = this.roomType_[0]["trial"];
        this.gotoRoom(this.roomType_[0]["roomId"]);
        // console.log("roomMinScore:"+this.roomMinScore+"  trialInfo:"+this.trialInfo+" roomId:"+this.roomType_[0]["roomId"]);
    },
    room2Click: function room2Click() {
        console.log("room2Click");
        // cc.director.loadScene("GameScene");
        this.selectedIdx_ = 1;
        this.roomMinScore = this.roomType_[1]["enterLimit"];
        this.trialInfo = this.roomType_[1]["trial"];
        this.gotoRoom(this.roomType_[1]["roomId"]);
        // console.log("roomMinScore:"+this.roomMinScore+"  trialInfo:"+this.trialInfo+" roomId:"+this.roomType_[1]["roomId"]);
    },
    room3Click: function room3Click() {
        console.log("room3Click");
        // cc.director.loadScene("GameScene");
        this.selectedIdx_ = 2;
        this.roomMinScore = this.roomType_[2]["enterLimit"];
        this.trialInfo = this.roomType_[2]["trial"];
        this.gotoRoom(this.roomType_[2]["roomId"]);
        // console.log("roomMinScore:"+this.roomMinScore+"  trialInfo:"+this.trialInfo+" roomId:"+this.roomType_[2]["roomId"]);
    },
    room4Click: function room4Click() {
        console.log("room4Click");
        // cc.director.loadScene("GameScene");
        this.selectedIdx_ = 3;
        this.roomMinScore = this.roomType_[3]["enterLimit"];
        this.trialInfo = this.roomType_[3]["trial"];
        this.gotoRoom(this.roomType_[3]["roomId"]);
        // console.log("roomMinScore:"+this.roomMinScore+"  trialInfo:"+this.trialInfo+" roomId:"+this.roomType_[3]["roomId"]);
    },
    quickStartClick: function quickStartClick() {
        console.log("quickStartClick");
        // cc.director.loadScene("GameScene");
        this.onWantGotoRoom();
    },
    pepleNumAdd: function pepleNumAdd(str) {
        var curNum = str;
        if (typeof str == "string") curNum = parseInt(str);
        var endNum = 0;
        if (curNum <= 60) {
            endNum = curNum + 60;
        } else if (curNum > 60 && curNum <= 200) {
            endNum = curNum + 200;
        } else if (curNum > 200 && curNum <= 500) {
            endNum = curNum + 1000;
        } else {
            endNum = curNum + 3000;
        }

        return endNum;
    },
    gotoRoom: function gotoRoom(mRoomId) {
        var self = this;
        var coins = PlayerDetailModel.getCoin();
        var arg = {};
        arg.roomId = mRoomId;
        arg.isContinue = 0;
        console.log("coins:" + coins);

        if (mRoomId == config.RoomConfig[1].roomId || mRoomId == config.RoomConfig[7].roomId) {
            if (coins >= self.roomMinScore) {
                if (self.roomModelId_ == config.ModelId.lazarillo) {
                    arg.modelId = config.ModelId.lazarillo;
                    GameNetMgr.sendRequest("Game", "loginRoom", arg);
                } else {
                    GameNetMgr.sendRequest("Game", "loginRoom", arg);
                }
            } else {
                // GameNetMgr.sendRequest("Game", "openRechargeTip", {})
                console.log("弹出救济框");
            }
            console.log("新手场");
        } else {
            if (coins >= self.roomMinScore) {
                if (self.roomModelId_ == config.ModelId.lazarillo) {
                    arg.modelId = config.ModelId.lazarillo;
                    GameNetMgr.sendRequest("Game", "loginRoom", arg);
                } else {
                    GameNetMgr.sendRequest("Game", "loginRoom", arg);
                }
            } else {
                console.log("弹出充值框");
            }
        }
    },
    handleLoginRoomResult: function handleLoginRoomResult(event) {
        var self = this;
        // --更新玩家乐豆
        PlayerDetailModel.setCoin(event.payload["data"]["coins"]);
        var payload = event.payload;
        self.isGotoLazarillo_ = false; //是否进入癞子场

        if (event.ok) {
            var args = {};
            args["baseCoins"] = payload["data"]["baseCoins"];
            args["rate"] = payload["data"]["rate"];
            args["limitCoins"] = payload["data"]["limitCoins"];
            args["rake"] = payload["data"]["rake"];
            args["roomId"] = payload["data"]["roomId"];
            args["rateMax"] = payload["data"]["rateMax"];
            args["enterLimit"] = payload["data"]["enterLimit"];
            args["emoticon"] = payload["data"]["emoticon"];
            args["emoticon_items"] = payload["data"]["emoticon_items"];
            args["advert"] = payload["data"]["advert"]; //记牌器数据

            if (payload["data"]["modelId"]) {
                args["modelId"] = payload["data"]["modelId"];
            }
            args["buys"] = payload["data"]["buys"];
            args["givecoins"] = null;

            if (payload["data"]["isContinue"] && parseInt(payload["data"]["isContinue"]) == 1) {
                args["isContinueGaming"] = true;
            }
            if (args["roomId"] == 1002 || args["roomId"] == 1003 || args["roomId"] == 1009) {
                // CompatibleHelper.NoTalkController = false
            }

            if (parseInt(payload["data"]["modelId"]) == config.ModelId.contest) {
                console("比赛场");
                return;
            }

            var m_sended = payload["data"]["sendCoins"];
            var m_totalTimes = payload["data"]["sendCoinsTimes"];
            var m_curTimes = payload["data"]["sendCoinsTimesToday"];
            var isSend = payload["data"]["isSend"];

            if (m_sended && m_sended > 0) {
                args["givecoins"] = {
                    sended: m_sended,
                    totalTimes: m_totalTimes,
                    curTimes: m_curTimes
                };
                //刷新用户乐豆乐券
                // app:dispatchEvent({name = app.class.UserProfileUpdate})
                console.log("刷新用户乐豆乐券");
            }

            config.tableInfo = args;

            if (parseInt(payload["data"]["modelId"]) == config.ModelId.lazarillo) {
                // --癞子场
                // DeviceHelper.addGameLog("enterRoom_lz"..args["roomId"],"a")
                // app:enterPokerLazarilloScene(args)
                console.log("进入癞子场");
            } else {
                // --普通场
                // DeviceHelper.addGameLog("enterRoom"..args["roomId"],"a")
                // app:enterPokerScene(args)
                console.log("进入普通场");
                // cc.director.loadScene("GameScene");
                self.preloadNextScene();
            }
        } else {
            if (event.noCoin) {
                if (parseInt(event.payload["data"]["isSmall"]) == 1) {
                    //钱少
                    // var trial = null;
                    // var rooms = PlayerDetailModel.getRoomByModel();
                    // for(var k  in rooms){
                    //     var room = rooms[k]
                    //     if (parseInt(room.roomId) == parseInt(payload["data"]["roomId"])){
                    //         trial = {
                    //             id=room.trial.goodsId, text=room.trial.into, price=room.trial.price
                    //         }
                    //         break
                    //     }
                    // }
                    console.log("乐豆不够去商城充值");
                    dialogManager.showCommonDialog("温馨提示", "乐豆不够前往商城充值", function () {
                        console.log("打开商城");
                    });
                } else {
                    //--0:钱多
                    console.log("亲,豆子太多啦,系统为您推送到合适的房间！");
                    dialogManager.showCommonDialog("温馨提示", "亲,豆子太多啦,系统为您推送到合适的房间！", function () {
                        console.log("去合适场次");
                        self.onWantGotoRoom();
                    });
                    if (parseInt(payload["data"]["modelId"]) == config.ModelId.lazarillo) {
                        self.isGotoLazarillo_ = true;
                    }
                }
            } else if (event.inGaming) {
                if (!payload.data.modelId || parseInt(payload.data.modelId) == config.ModelId.normal) {
                    console.log("您还在其他房间中对局哟，现在进去看看吧！");
                    dialogManager.showCommonDialog("温馨提示", "您还在其他房间中对局哟，现在进去看看吧！", function () {
                        console.log("短线重连普通场");
                        self.onWantContinueGaming(event);
                    });
                } else if (!payload.data.modelId || parseInt(payload.data.modelId) == config.ModelId.lazarillo) {
                    console.log("您还在其他癞子场中对局哟，现在进去看看吧！");
                    dialogManager.showCommonDialog("温馨提示", "您还在其他癞子场中对局哟，现在进去看看吧！", function () {
                        console.log("短线重连赖子场");
                        // self.onWantContinueLzGaming();
                    });
                } else {
                    console.log("您正在竞技场牌局中，请返回继续！");
                    dialogManager.showCommonDialog("温馨提示", "您正在竞技场牌局中，请返回继续！", function () {
                        console.log("短线重连比赛场");
                        // self.onWantContest();
                    });
                }
            }
        }
    },
    onWantGotoRoom: function onWantGotoRoom() {
        //去适合的场次
        var self = this;
        if (self.roomModelId_ == config.ModelId.contest) {
            // --比赛场
            return;
        }

        var model = PlayerDetailModel;
        var rooms = model.getRoomByModel(self.roomModelId_);
        var coins = model.getCoin();

        console.log(rooms);

        if (self.roomModelId_ == config.ModelId.lazarillo) {
            var roomId = -1;
            // --癞子场
            for (var i = 0; i < rooms.length; i++) {
                var room = rooms[i];
                // --豆够
                if (room.modelId == config.ModelId.lazarillo && coins >= parseInt(room.enterLimit) && coins <= parseInt(room.enterLimit_)) {
                    roomId = room.roomId;
                    break;
                }
            }

            if (roomId <= 0) {
                for (var i = rooms.length - 1; i >= 0; i--) {
                    var room = rooms[i];
                    // --豆够
                    if (room.modelId == config.ModelId.lazarillo && coins >= parseInt(room.enterLimit)) {
                        roomId = room.roomId;
                        break;
                    }
                }
            }

            if (roomId > 0) {
                var arg = {};
                arg.roomId = roomId;
                arg.isContinue = 0;
                arg.modelId = config.ModelId.lazarillo;
                console.log("钱多能去的最高赖子场---------------:" + room.roomId);
                GameNetMgr.sendRequest("Game", "loginRoom", arg);
                return;
            }
        } else {
            var roomId = -1;
            // --普通场
            for (var i = 0; i < rooms.length; i++) {
                var room = rooms[i];
                // --豆够
                if (room.modelId == config.ModelId.normal && coins >= parseInt(room.enterLimit) && coins <= parseInt(room.enterLimit_)) {
                    roomId = room.roomId;
                    break;
                }
            }

            if (roomId <= 0) {
                for (var i = rooms.length - 1; i >= 0; i--) {
                    var room = rooms[i];
                    // --豆够
                    if (room.modelId == config.ModelId.normal && coins >= parseInt(room.enterLimit)) {
                        roomId = room.roomId;
                        break;
                    }
                }
            }
            console.log("普通场 roomId:" + roomId);

            if (roomId > 0) {
                var arg = {};
                arg.roomId = roomId;
                arg.isContinue = 0;
                console.log("钱多能去的最高普通场---------------:" + room.roomId);
                GameNetMgr.sendRequest("Game", "loginRoom", arg);
                return;
            }
        }

        if (coins >= self.roomType_[0]["enterLimit"]) {} else {
            // proxy:sendRequest("Game", "openRechargeTip", {})
            console.log("弹出救济框");
        }
    },


    //
    preloadNextScene: function preloadNextScene() {
        cc.director.preloadScene("GameScene", function () {
            cc.log("Next scene preloaded");
            cc.director.loadScene("GameScene");
        });
    },
    onWantContinueGaming: function onWantContinueGaming(event) {
        var payload = event.payload;

        console.log("--进入上局未完的普通牌桌");

        var args = {};
        args["baseCoins"] = payload["data"]["baseCoins"];
        args["rate"] = payload["data"]["rate"];
        args["limitCoins"] = payload["data"]["limitCoins"];
        args["rake"] = payload["data"]["rake"];
        args["buys"] = payload["data"]["buys"];

        args["rateMax"] = payload["data"]["rateMax"];
        args["enterLimit"] = payload["data"]["enterLimit"];

        args["emoticon"] = payload["data"]["emoticon"];
        args["emoticon_items"] = payload["data"]["emoticon_items"];
        args["advert"] = payload["data"]["advert"]; //记牌器数据

        if (payload["data"]["modelId"]) {
            args["modelId"] = payload["data"]["modelId"];
            if (parseInt(payload["data"]["modelId"]) == AppConfig.ModelId.contest) {
                // CompatibleHelper.MatchGameRoomId = payload["data"]["roomId"];
                // console.log(">>>>>>>>>>>>>>MatchGameRoomId:"+CompatibleHelper.MatchGameRoomId);
            }
        }
        args["givecoins"] = null;
        var sended = payload["data"]["sendCoins"];
        var totalTimes = payload["data"]["sendCoinsTimes"];
        var curTimes = payload["data"]["sendCoinsTimesToday"];
        var isSend = payload["data"]["isSend"];

        if (sended > 0) {
            args["givecoins"] = {
                sended: sended,
                totalTimes: totalTimes,
                curTimes: curTimes
                // app:dispatchEvent({name = app.class.UserProfileUpdate})
            };
        }
        // var proxy = RPCProxy:getInstance();
        // proxy:setOpMsg(true);//暂停处理数据

        args["roomId"] = payload["data"]["roomId"];
        args["isContinueGaming"] = true;
        config.tableInfo = args;
        this.preloadNextScene();
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
        //# sourceMappingURL=RoomLayerControl.js.map
        