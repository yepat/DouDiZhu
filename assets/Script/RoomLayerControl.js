
var config = require("config");
var EventHelper = require("EventHelper");
var PlayerDetailModel = require("PlayerDetailModel");
var GameNetMgr = require("GameNetMgr");
var Events = require("Events");
var dialogManager = require("dialogManager");

cc.Class({
    extends: cc.Component,

    properties: {
        room1 : {
            default : null,
            type : cc.Node
        },
        room2 : {
            default : null,
            type : cc.Node
        },
        room3 : {
            default : null,
            type : cc.Node
        },
        room4 : {
            default : null,
            type : cc.Node
        },
        
    },
    onLoad () {
        var rooms = [];
        rooms.push(this.room1);
        rooms.push(this.room2);
        rooms.push(this.room3);
        rooms.push(this.room4);
        this.rooms = rooms;
        // console.log(this.rooms);
        this.initBaseInfo();
    },
    start () {
        var self = this;
        config.IsContinueGaming = 0;
        this.roomModelId_ = config.curRoomModelId;
        // this.initRoomInfo();
        EventHelper.AddCustomEvent(config.MyNode,Events.Network.LoginRoomResult,self.onLoginRoomResult,self);
        EventHelper.AddCustomEvent(config.MyNode,"OpenRechargeTipResult",self.onOpenRechargeTipResult,self);
    },
    onEnable(){
        // console.log(" RoomLayer onEnable");
        config.IsContinueGaming = 0;
        this.roomModelId_ = config.curRoomModelId;
        this.initRoomInfo();
    },
    onDisable(){
        // console.log(" RoomLayer onDisable");
    },
    onDestroy(){
        console.log(" RoomLayer Destroy");
        // var self = this;
        // EventHelper.RemoveCustomEvent(config.MyNode,Events.Network.LoginRoomResult,self.onLoginRoomResult,self);
        // EventHelper.RemoveCustomEvent(config.MyNode,"OpenRechargeTipResult",self.onOpenRechargeTipResult,self);
    },
    onLoginRoomResult(event){
        var self = this;
        console.log("登陆房间回掉---");
        var data = event.getUserData();
        // console.log(data);
        self.handleLoginRoomResult(data); 
    },
    initBaseInfo(){
        var roomInfos = [];
        for(var i=0;i<4;i++){
            var index = i+1;
            var name = "p_room_"+index;
            var strPeopleNum = "Canvas/happyroom/rooms/"+name+"/lab_peopleNum";
            var strCoins = "Canvas/happyroom/rooms/"+name+"/lab_coins";
            var strBaseCoin = "Canvas/happyroom/rooms/"+name+"/p_roomA_num";

            var lab_peopleNum = cc.find(strPeopleNum).getComponent(cc.Label);
            var lab_coins = cc.find(strCoins).getComponent(cc.Label);
            var pBaseCoin = cc.find(strBaseCoin).getComponent(cc.Sprite);
            var item = {
                peopleNum:lab_peopleNum,
                coins:lab_coins,
                baseCoin:pBaseCoin
            }
            roomInfos.push(item);
            this.rooms[i].active = false;
        }
        this.roomInfos = roomInfos;
        this.node_roomName = cc.find("Canvas/happyroom/topBar/p_roomName").getComponent(cc.Sprite);
    },
    initRoomInfo(){
        console.log(">>>initRoomInfo");
        var self = this;
        for(var i=0;i<4;i++){
            this.rooms[i].active = false;
        }

        var roomNameUrl = "roomInfo/p_roomA";
        var baseCoinUrls = ["roomInfo/p_roomA_num_1","roomInfo/p_roomA_num_2","roomInfo/p_roomA_num_3","roomInfo/p_roomA_num_4"];
        if(config.curRoomModelId == config.ModelId.lazarillo){
            roomNameUrl = "roomInfo/p_roomB";
            baseCoinUrls = ["roomInfo/p_roomB_num_1","roomInfo/p_roomB_num_2","roomInfo/p_roomB_num_3","roomInfo/p_roomB_num_4"];
        }
        cc.loader.loadRes(roomNameUrl,cc.SpriteFrame,function(err,spriteFrame){
            self.node_roomName.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        });


        var roomType_ = [];
        var rooms = PlayerDetailModel.getRoom();
        for(var k in rooms){
            var v = rooms[k];
            if(v.modelId == config.curRoomModelId){
                roomType_ =  v.rooms;
            }
        }
        this.roomType_ = roomType_;
        console.log(roomType_);
        // console.log("curRoomModelId:"+config.curRoomModelId);
        for(var i = 0;i<roomType_.length;i++){
            this.rooms[i].active = true;
            this.roomInfos[i].peopleNum.string = ""+this.pepleNumAdd(roomType_[i]["onlineNum"]);
            var str_enter = roomType_[i]["enter"].replace("乐豆", "");
            this.roomInfos[i].coins.string = str_enter;
        }

        for(var i = 0;i<roomType_.length;i++){
            if(i==0){
                var baseCoin0 = this.roomInfos[i].baseCoin;
                cc.loader.loadRes(baseCoinUrls[i],cc.SpriteFrame,function(err,spriteFrame){
                    baseCoin0.getComponent(cc.Sprite).spriteFrame = spriteFrame;
                });
            }else if(i==1){
                var baseCoin1 = this.roomInfos[i].baseCoin;
                cc.loader.loadRes(baseCoinUrls[i],cc.SpriteFrame,function(err,spriteFrame){
                    baseCoin1.getComponent(cc.Sprite).spriteFrame = spriteFrame;
                });
            }else if(i==2){
                var baseCoin2 = this.roomInfos[i].baseCoin;
                cc.loader.loadRes(baseCoinUrls[i],cc.SpriteFrame,function(err,spriteFrame){
                    baseCoin2.getComponent(cc.Sprite).spriteFrame = spriteFrame;
                });
            }else if(i==3){
                var baseCoin3 = this.roomInfos[i].baseCoin;
                cc.loader.loadRes(baseCoinUrls[i],cc.SpriteFrame,function(err,spriteFrame){
                    baseCoin3.getComponent(cc.Sprite).spriteFrame = spriteFrame;
                });
            }
        }
    },
    room1Click(){
        // console.log("room1Click");
        this.selectedIdx_ = 0
        this.roomMinScore = this.roomType_[0]["enterLimit"];
        this.trialInfo = this.roomType_[0]["trial"];
        this.gotoRoom(this.roomType_[0]["roomId"]);
        cc.vv.audioMgr.playSFX("SpecOk");
    },
    room2Click(){
        // console.log("room2Click");
        this.selectedIdx_ = 1
        this.roomMinScore = this.roomType_[1]["enterLimit"];
        this.trialInfo = this.roomType_[1]["trial"];
        this.gotoRoom(this.roomType_[1]["roomId"]);
        cc.vv.audioMgr.playSFX("SpecOk");
    },
    room3Click(){
        // console.log("room3Click");
        // cc.director.loadScene("GameScene");
        this.selectedIdx_ = 2
        this.roomMinScore = this.roomType_[2]["enterLimit"];
        this.trialInfo = this.roomType_[2]["trial"];
        this.gotoRoom(this.roomType_[2]["roomId"]);
        cc.vv.audioMgr.playSFX("SpecOk");
    },
    room4Click(){
        // console.log("room4Click");
        this.selectedIdx_ = 3
        this.roomMinScore = this.roomType_[3]["enterLimit"];
        this.trialInfo = this.roomType_[3]["trial"];
        this.gotoRoom(this.roomType_[3]["roomId"]);
        cc.vv.audioMgr.playSFX("SpecOk");
    },
    quickStartClick(){
        // console.log("quickStartClick");
        // cc.director.loadScene("GameScene");
        this.onWantGotoRoom();
        cc.vv.audioMgr.playSFX("SpecOk");
    },
    pepleNumAdd(str){
        var curNum = str;
        if(typeof(str) == "string")
            curNum = parseInt(str);
        var endNum = 0
        if (curNum <= 60){
            endNum = curNum + 60;
        }else if(curNum > 60 && curNum <=200){
            endNum = curNum + 200;
        }else if(curNum > 200 && curNum <=500){
            endNum = curNum + 1000;
        }else{
            endNum = curNum + 3000;
        }
           
        return endNum;
    },
    gotoRoom(mRoomId){
        var self = this;
        var coins = PlayerDetailModel.getCoin();
        var arg = {};
        arg.roomId = mRoomId;
        arg.isContinue = 0;
        console.log("coins:"+coins);

        if(mRoomId == config.RoomConfig[1].roomId || 
            mRoomId == config.RoomConfig[7].roomId){
            if (coins >= self.roomMinScore){
                if (self.roomModelId_ == config.ModelId.lazarillo){
                    arg.modelId = config.ModelId.lazarillo
                    GameNetMgr.sendRequest("Game", "loginRoom", arg)
                }
                else{
                    GameNetMgr.sendRequest("Game", "loginRoom", arg)
                }
            }else{
                GameNetMgr.sendRequest("Game", "openRechargeTip", {});
                console.log("弹出救济框");
            }
            console.log("新手场");
        }else{
            if (coins >= self.roomMinScore){
                if (self.roomModelId_ == config.ModelId.lazarillo){
                    arg.modelId = config.ModelId.lazarillo
                    GameNetMgr.sendRequest("Game", "loginRoom", arg)
                }else{
                    GameNetMgr.sendRequest("Game", "loginRoom", arg)
                }
            }else{
                console.log("弹出充值框");
                var click = function(){
                    console.log("打开商城----");
                }
                dialogManager.showCommonDialog("温馨提示","豆子不够无法进入该场次",click);
            }
        }
    },
    handleLoginRoomResult(event){
        var self = this;
        // --更新玩家乐豆
        PlayerDetailModel.setCoin(event.payload["data"]["coins"]);
        var payload = event.payload;
        self.isGotoLazarillo_ = false; //是否进入癞子场

        if(event.ok){
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

            if(payload["data"]["modelId"]){
                args["modelId"] = payload["data"]["modelId"];
            }
            args["buys"] = payload["data"]["buys"];
            args["givecoins"] = null;

            if(payload["data"]["isContinue"] && parseInt(payload["data"]["isContinue"]) == 1){
                args["isContinueGaming"] = true
            } 
            if(args["roomId"] == 1002 || args["roomId"] == 1003 || args["roomId"] == 1009){
                // CompatibleHelper.NoTalkController = false
            }

            if(parseInt(payload["data"]["modelId"]) == config.ModelId.contest){
                console("比赛场")
                return;
            }

            var m_sended = payload["data"]["sendCoins"];
            var m_totalTimes = payload["data"]["sendCoinsTimes"];
            var m_curTimes = payload["data"]["sendCoinsTimesToday"];
            var isSend = payload["data"]["isSend"];

            if(m_sended && m_sended > 0){
                args["givecoins"] = {
                    sended : m_sended,
                    totalTimes : m_totalTimes,
                    curTimes : m_curTimes,
                };
                //刷新用户乐豆乐券
                console.log("刷新用户乐豆乐券");
            }

            config.tableInfo = args;
            console.log(config.tableInfo);

            if(parseInt(payload["data"]["modelId"]) == config.ModelId.lazarillo){
                // --癞子场
                console.log("进入癞子场");
                this.preloadNextScene();
            }else{
                // --普通场
                console.log("进入普通场");
                this.preloadNextScene();
            }

        }else{
            if (event.noCoin){
                if(parseInt(event.payload["data"]["isSmall"]) == 1){ //钱少
                    console.log("乐豆不够去商城充值");
                    dialogManager.showCommonDialog("温馨提示","亲,您的豆子不够哦！",function(){
                        console.log("打开商城");
                    });
                }else{//--0:钱多
                    // console.log("亲,豆子太多啦,系统为您推送到合适的房间！")
                    dialogManager.showCommonDialog("温馨提示","亲,豆子太多啦,系统为您推送到合适的房间！",function(){
                        console.log("去合适场次");
                        self.onWantGotoRoom();
                    });
                    if (parseInt(payload["data"]["modelId"]) == config.ModelId.lazarillo){
                        self.isGotoLazarillo_ = true;
                    }
                }

            }else if(event.inGaming){
                if ( !payload.data.modelId || parseInt(payload.data.modelId) == config.ModelId.normal){
                    // console.log("您还在其他房间中对局哟，现在进去看看吧！");
                    dialogManager.showCommonDialog("温馨提示","您还在其他房间中对局哟，现在进去看看吧！",function(){
                        // console.log("短线重连普通场");
                        self.onWantContinueGaming(event);
                    });
                }else if(!payload.data.modelId || parseInt(payload.data.modelId) == config.ModelId.lazarillo){
                    // console.log("您还在其他癞子场中对局哟，现在进去看看吧！");
                    dialogManager.showCommonDialog("温馨提示","您还在其他癞子场中对局哟，现在进去看看吧！",function(){
                        // console.log("短线重连赖子场");
                        // self.onWantContinueLzGaming();
                        self.onWantContinueGaming(event);
                    });
                }else{
                    // console.log("您正在竞技场牌局中，请返回继续！");
                    dialogManager.showCommonDialog("温馨提示","您正在竞技场牌局中，请返回继续！",function(){
                        // console.log("短线重连比赛场");
                        // self.onWantContest();
                    });
                }
            }
        }

    },
    onWantGotoRoom(){//去适合的场次
        var self = this;
        if (self.roomModelId_ == config.ModelId.contest){
            // --比赛场
            return;
        }

        var model = PlayerDetailModel;
        var rooms = model.getRoomByModel(self.roomModelId_);
        var coins = model.getCoin();

        console.log(rooms);

        if(self.roomModelId_ == config.ModelId.lazarillo){
            var roomId = -1;
            // --癞子场
            for (var i = 0;i<rooms.length;i++){
                var room = rooms[i];
                // --豆够
                if (room.modelId == config.ModelId.lazarillo && coins >= parseInt(room.enterLimit) && coins <= parseInt(room.enterLimit_)){
                    roomId = room.roomId;
                    break;
                }
            }

            if (roomId <= 0 ){
                for (var i = rooms.length-1;i>=0;i--){
                    var room = rooms[i];
                    // --豆够
                    if (room.modelId == config.ModelId.lazarillo && coins >= parseInt(room.enterLimit) ){
                        roomId = room.roomId;
                        break
                    }
                }
            }

            if (roomId > 0 ){
                var arg = {};
                arg.roomId = roomId;
                arg.isContinue = 0;
                arg.modelId = config.ModelId.lazarillo;
                console.log("钱多能去的最高赖子场---------------:"+room.roomId);
                GameNetMgr.sendRequest("Game", "loginRoom", arg);
                return
            }
        }else{
            var roomId = -1;
            // --普通场
            for (var i = 0;i<rooms.length;i++){
                var room = rooms[i];
                // --豆够
                if (room.modelId == config.ModelId.normal && coins >= parseInt(room.enterLimit) && coins <= parseInt(room.enterLimit_)){
                    roomId = room.roomId;
                    break;
                }
            }

            if (roomId <= 0 ){
                for (var i = rooms.length-1;i>=0;i--){
                    var room = rooms[i];
                    // --豆够
                    if (room.modelId == config.ModelId.normal && coins >= parseInt(room.enterLimit) ){
                        roomId = room.roomId;
                        break;
                    }
                }
            }
            console.log("普通场 roomId:"+roomId);
            
            if (roomId > 0 ){
                var arg = {};
                arg.roomId = roomId;
                arg.isContinue = 0;
                console.log("钱多能去的最高普通场---------------:"+room.roomId);
                GameNetMgr.sendRequest("Game", "loginRoom", arg);
                return;
            }

        }

        if (coins >= self.roomType_[0]["enterLimit"]){
        }else{
            GameNetMgr.sendRequest("Game", "openRechargeTip", {})
            console.log("弹出救济框");
        }

    },
    //救济框
    onOpenRechargeTipResult(event){
        var self = this;
        var response = event.getUserData();
        console.log(response);
        var trial_count = response.data.trial_count;
        var trial_cooldown = response.data.trial_cooldown;
        var content = "";

        var click = function(){
            console.log("点击了领取救济按钮");
            GameNetMgr.sendRequest("Game", "openReliefTip", {});
        }

        if(trial_cooldown == 0){
            var index = trial_count+1;
            content = "系统第"+index+"次赠送您1000乐豆。";
            if(config.TrialShareShow == 1){
                dialogManager.showTableShareGet("jiuji");
            }else{
                dialogManager.showCommonDialog("领救济",content,click);
            }  
        }else{
            content = "今天乐豆已经领完了哦，明天在过来吧！";
            dialogManager.showCommonDialog("领救济",content);
        }
    },
    //
    preloadNextScene(){
        var self = this;
        EventHelper.RemoveCustomEvent(config.MyNode,Events.Network.LoginRoomResult,self.onLoginRoomResult,self);
        EventHelper.RemoveCustomEvent(config.MyNode,"OpenRechargeTipResult",self.onOpenRechargeTipResult,self);
        cc.director.preloadScene("GameScene", function () {
            // cc.log("Next scene preloaded");
            cc.director.loadScene("GameScene");
        });
    },
    onWantContinueGaming(event){
        console.log("--进入上局未完的普通牌桌");
        var payload = event.payload;
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

        if(payload["data"]["modelId"]){
            args["modelId"] = payload["data"]["modelId"];
        }
        args["buys"] = payload["data"]["buys"];
        args["givecoins"] = null;

        if(payload["data"]["isContinue"] && parseInt(payload["data"]["isContinue"]) == 1){
            args["isContinueGaming"] = true
        } 
        var m_sended = payload["data"]["sendCoins"];
        var m_totalTimes = payload["data"]["sendCoinsTimes"];
        var m_curTimes = payload["data"]["sendCoinsTimesToday"];

        if(m_sended && m_sended > 0){
            args["givecoins"] = {
                sended : m_sended,
                totalTimes : m_totalTimes,
                curTimes : m_curTimes,
            };
            //刷新用户乐豆乐券
            // console.log("刷新用户乐豆乐券");
        }
        config.tableInfo = args;
        console.log(config.tableInfo);

        config.IsContinueGaming = 1;
        this.preloadNextScene();
    }
});
