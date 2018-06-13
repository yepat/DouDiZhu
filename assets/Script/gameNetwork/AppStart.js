var config = require("config");
var ByteArray = require("ByteArray");
var Protocol = require("Protocol");
var EventHelper = require("EventHelper");
var PlayerDetailModel = require("PlayerDetailModel");
var dialogManager = require("dialogManager");
var MD5 = require("md5");

function initMgr(){
    cc.vv = {};
    cc.vv.http = require("HTTP");
    cc.vv.net = require("GameNet");
    // cc.vv.net = require("Net");
}
   
cc.Class({
    extends: cc.Component,
    properties: {
        labLoading : {
            default : null,
            type : cc.Label
        },
    },
    // use this for initialization
    onLoad: function () {
        initMgr();
        this.getServerInfo();
        //设置常驻节点
        var myNode = new cc.Node("myNode");
        EventHelper.addPersistRootNode(myNode);
        this.isShow = false;

        // wx.showShareMenu({
        //     withShareTicket: true
        // });
        // cc.loader.loadRes("img_dialog/p_sharebg",function(err,data){
        //     wx.onShareAppMessage(function(res){
        //         return {
        //             title: "有乐斗地主等你来战！",
        //             imageUrl: data.url,
        //             query : PlayerDetailModel.uid,
        //             success(res){
        //                 console.log("转发成功!!!")
        //                 console.log(res);
        //                 // common.diamond += 20;
        //             },
        //             fail(res){
        //                 console.log("转发失败!!!")
        //             } 
        //         }
        //     })
        // });
    },
    getServerInfo:function(){
        var params = {};
        params.env = "prod";
        params.ver = "1.0.0";
        params.channel = "weichatgame";
        params.udid = "udid";
        params.pver = "1.0.0";
        params.pchannel = "weichatgame";
        params.presver = "1.0.0";
        
        var self = this;
        var xhr = null;
        var complete = false;
        var fnRequest = function(){
            console.log("正在连接服务器...");
            self.labLoading.string = "正在连接服务器...";
            xhr = cc.vv.http.sendRequest("",params,function(ret){
                console.log("连接成功");
                self.labLoading.string = "连接成功...";
                xhr = null;
                complete = true;
                config.GlobalRouterUpdate(ret);
                console.log("host:"+config.GlobalRouter.host+":"+config.GlobalRouter.port);
                self.connectGameServer();
            },config.GlobalRouter.director);
            setTimeout(fn,5000);            
        };
        
        var fn = function(){
            if(!complete){
                if(xhr){
                    xhr.abort();
                    console.log("连接失败，即将重试...");
                    self.labLoading.string = "连接失败，即将重试...";
                    setTimeout(function(){
                        fnRequest();
                    },5000);
                }
                else{
                    fnRequest();
                }
            }
        };
        fn();
    },
    connectGameServer(){
        var self = this;
        cc.vv.net.connect(config.GlobalRouter.host,config.GlobalRouter.port,function(ret){
            //WebSocket连接成功
            self.sendRegist();
            // self.getWxUserInfo();
        });

        var ConnectionClosedShow = function(){
            self.isShow = true;
            dialogManager.showCommonDialog("提示","与服务器断开连接！",function(){
                self.isShow = false;
                cc.director.loadScene("LoadingScene");
            });
        }

        setInterval(function(){
            if(cc.vv.net.isPinging){
                self.sendHeartBeat();
            }else{
                if(!self.isShow)
                    ConnectionClosedShow();
            }     
        }.bind(this),10000);

        EventHelper.AddCustomEvent(config.MyNode,"Regist",self.onRegist,self);
        EventHelper.AddCustomEvent(config.MyNode,"HeartBeat",self.onHeartBeat,self);
        EventHelper.AddCustomEvent(config.MyNode,"LoginOK",self.onLoginOK,self);  
    },
    getWxUserInfo(){
        var self = this; 
        wx.getUserInfo({
            success: function (res) {
               console.log("res.userInfo = " + JSON.stringify(res.userInfo));
               config.UpdateWxInfo(res.userInfo);
               self.sendRegist();
             },
       })
    },
    onRegist(event){
        var self = this;
        console.log("Regist---");
        var data = event.getUserData();
        config.temppassword = data.data.data.password;
        self.sendLogin();
    },
    onHeartBeat(event){
        // console.log("HeartBeat---");
    },
    onLoginOK(event){
        var self = this;
        console.log("LoginOK---");
        console.log(event.getUserData());
        var data = event.getUserData();
        self.setPlayerDetailModel(data);
    },
    sendHeartBeat(){
        //发送心跳
        var params = {};
        params.t = Protocol.Request.HeartBeat.Alive;
        cc.vv.net.send("HeartBeat",Protocol.Command.HeartBeat,params);
    },
    sendRegist(){
        //注册请求
        var _d = MD5.hex_md5("yepat2");
        if(config.wxInfo.nickName !=""){
            _d = MD5.hex_md5(config.wxInfo.nickName);
        }
        var params = {};
        params.t = Protocol.Request.Login.Regist;
        params.d = _d;
        params.u = "50ee8041a7fd8baa6348252ea114432bb3be23bd";
        params.v = "2.1.1";
        params.c = "sjweichat";
        params.e = "defaults";
        params.type = "guest";
        cc.vv.net.send("Regist",Protocol.Command.Login,params);  
    },
    sendLogin(){
        var _d = MD5.hex_md5("yepat2");
        if(config.wxInfo.nickName !=""){
            _d = MD5.hex_md5(config.wxInfo.nickName);
        }
        var params = {};
        params.t = Protocol.Request.Login.Guest;
        params.d = _d;
        params.p = config.temppassword;
        params.c = "sjweichat";
        params.v = "2.1.1";
        params.tv = 1;
        params.e = "defaults";
        params.wn = config.wxInfo.nickName;
        params.wurl = config.wxInfo.avatarUrl;
        cc.vv.net.send("Login",Protocol.Command.Login,params);  
    },
    setPlayerDetailModel(response){
        var room = response.data.room
        console.log(room);
        if(response["code"] == Protocol.Response.Login.OK){
            var isDevData = response["data"]["isDev"];
            if (isDevData && typeof(isDevData) == "number"){
            }else{
                isDevData = 0
            }
            for(var i=0;i<room.length;i++){
                if(room[i].rooms){
                    for(var j=0;j<room[i].rooms.length;j++){
                        room[i].rooms[j].modelId = room[i].modelId;
                    }
                }
            }
            config.playGameId = response["data"].playGameId;
            config.playGameMsg = response["data"].playGameMsg;

    
            PlayerDetailModel.nickname = response["data"]["nick"];
            PlayerDetailModel.uid = parseInt(response["data"]["uid"]);
            PlayerDetailModel.coin = parseInt(response["data"]["coins"]);
            PlayerDetailModel.gold = parseInt(response["data"]["gold"]);
            PlayerDetailModel.gender = parseInt(response["data"]["sex"]);
            PlayerDetailModel.word = response["data"]["word"];
            PlayerDetailModel.coolnum = response["data"]["cool_num"];
            PlayerDetailModel.level = parseInt(response["data"]["level"]);
            PlayerDetailModel.matches = parseInt(response["data"]["gameData"]["matches"]);
            PlayerDetailModel.win = parseInt(response["data"]["gameData"]["win"]);
            PlayerDetailModel.checkCode = response["data"]["check_code"];
            PlayerDetailModel.propDress = response["data"]["propDress"];
            PlayerDetailModel.score = parseInt(response["data"]["score"]);

            PlayerDetailModel.verfile = parseInt(response["data"]["verfile"]);
            PlayerDetailModel.vertips = parseInt(response["data"]["vertips"]);
            PlayerDetailModel.mailUnread = parseInt(response["data"]["mail_unread"]);
            PlayerDetailModel.coupon = parseInt(response["data"]["coupon"]);
            PlayerDetailModel.age = parseInt(response["data"]["age"]);
            PlayerDetailModel.room = room;
            PlayerDetailModel.contact = response["data"]["contact"];
            PlayerDetailModel.contacts = response["data"]["contacts"];
            PlayerDetailModel.wechat = response["data"]["wechat"];

            PlayerDetailModel.lottery = parseInt(response["data"]["lottery"]);
            PlayerDetailModel.checkinUndo = parseInt(response["data"]["checkin_undo"]);
            PlayerDetailModel.task1Unaward = parseInt(response["data"]["task1_unaward"]);
            PlayerDetailModel.task2Unaward = parseInt(response["data"]["task2_unaward"]);
            PlayerDetailModel.chargeRate = parseInt(response["data"]["charge_rate"]);
            PlayerDetailModel.propItems = response["data"]["propItems"];

            PlayerDetailModel.rewardList = response["data"]["n_reward_list"];

            PlayerDetailModel.wechatImg = response["data"]["img"];
            PlayerDetailModel.title = response["data"]["title"];
            PlayerDetailModel.isDev = isDevData;

            console.log("进入游戏大厅...uid:"+parseInt(response["data"]["uid"]));
            this.labLoading.string = "进入游戏大厅...";
            this.preloadNextScene();
        }else{
            console.log("登陆游戏失败！");
            this.labLoading.string = "登陆游戏失败！";
            dialogManager.showCommonDialog("提示","登陆游戏失败！",function(){
                cc.director.loadScene("LoadingScene");
            });
            
        }
    },
     //
     preloadNextScene(){
        cc.director.preloadScene("HallScene", function () {
            cc.log("Next scene preloaded");
            cc.director.loadScene("HallScene");
        });
    }
});
