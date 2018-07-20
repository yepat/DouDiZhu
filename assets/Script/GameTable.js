
var PokerControl = require("PokerControl");
var config = require("config");
var CardUtil = require("CardUtil")
var opratOutCardControl = require("opratOutCardControl");
var dialogManager = require("dialogManager");
var PlayerDetailModel = require("PlayerDetailModel");
var Player = require("Player");
var EventHelper = require("EventHelper");
var GameNetMgr = require("GameNetMgr");
var LazarilloCardUtil = require("LazarilloCardUtil");

cc.Class({
    extends: cc.Component,

    properties: {
        pokerCard : {
            default : null,
            type : cc.Prefab
        },
        pokerLayerLeft:{
            default : null,
            type : cc.Node,
        },
        pokerLayerRight:{
            default : null,
            type : cc.Node,
        },
        pokerLayerMy:{
            default : null,
            type : cc.Node,
        },
        canvas:cc.Node, 
        opratOutCard:{
            default : null,
            type : cc.Prefab
        },
        myPlayer:{
            default : null,
            type : cc.Node,
        },
        leftPlayer:{
            default : null,
            type : cc.Node,
        },
        rightPlayer:{
            default : null,
            type : cc.Node,
        },
        WatingStartNode:{
            default : null,
            type : cc.Node,
        }
    },
    // LIFE-CYCLE CALLBACKS:
    onLoad () {
        //xx_test
        this.gameState = 0;
        cc.game.on(cc.game.EVENT_HIDE, function(){
            console.log("游戏进入后台");
            config.stopOnMassage = true;
            cc.vv.audioMgr.stopMusic();
        },this);
        cc.game.on(cc.game.EVENT_SHOW, function(){
            console.log("重新返回游戏");
            if(config.stopOnMassage){
                GameNetMgr.sendRequest("Game", "reconnection");
                cc.vv.audioMgr.playBGM("MusicEx_Normal");
            }
        },this);
        cc.vv.audioMgr.playBGM("MusicEx_Normal");
        this.showWatingStartGame();
        if(!config.rewardedVideoAd){
            this.initWxVideoAd();
        }
    },
    start () {
        var self = this;
        var sceneWidth = cc.director.getWinSize().width;
        var scene = cc.director.getScene();

        console.log(">>>>sceneWidth:"+sceneWidth);

        this.sceneWidth = sceneWidth;
        this.scene = scene;
        this.mySeatId = 0;

        this.preSendCards = [];//上架出牌
        this.preSeatId = -1;//上架出牌id

        this.gameState = 0;//游戏状态

        this.myShowDialog = [];//我的

        this.loadSeatId = 0; //地主的id
        this.nicknames = []; //所有玩家昵称
        this.animShake = false; //屏幕是否在抖动
        this.myHandCards = [];  //我的手牌

        this.taskComplete = false;
        this.taskRewardNum = 0;
    
        self.touchBeganX = 0;
        self.leftX = 0;
        self.rightX = 0;
        self.upY = 0;
        self.downY = 0;
        self.isTouchbegan = false;

        var wechatImgUrl=config.wxInfo.avatarUrl;
        //--创建自己的形象
        var detailModel = PlayerDetailModel;
        var params = {};
        params.uid = detailModel.getUid();
        params.nickname = detailModel.getNickName();
        params.gender = detailModel.getGender(); //toString
        params.coin = detailModel.getCoin();
        params.gold = detailModel.getGold();
        params.lequan = detailModel.getCoupon();
        params.propDress = detailModel.getPropDress();
        params.wechatImg = wechatImgUrl;//detailModel.getWechatImg();
        params.title = detailModel.getTitle();
        params.emoticon = {};
        params.emoticonItems = {};
        params.play = PlayerDetailModel.getMatches();//游戏总局数
        params.win = PlayerDetailModel.getWin();//胜利局数

        this.myOpratShow = null; //我自己的弹出操作洁面
        this.CancelDelegate = null;
        this.ChatDialog = null;
        this.jpqNode = null;
        this.LazarilloPokerSelected = null;
        this.gameResultControl = null;
        this.myOpratCall = null;//叫地主、抢地主弹出操作洁面
        // this.watingStart = null;

        this.myPokerData = [];
        this.myPokerNode = [];
        this.dispatchCard = [];
        var player = new Player(params);
        self.playerme_ = player;
        self.initMyPlayerNode();
        self.playerme_.initBaseInfo();

        //xx_test
        // config.joker = "c";//"43", "33","23", "13", 
        // var cards = ["2c", "1c", "31", "21", "1d","4b","3b", "2a", "49", "29", "47", "47", "44"];//, "33", "23", "13"
        // this.myPokerData = CardUtil.serverCardsToClient(cards);
        // self.playerme_.initMyCards(this.myPokerData,this.myPokerNode,this.scene,this.sceneWidth,-1);
        
        // self.onMyOutCard(10000);
        // this.registerTouchEvent();
        // return;
       
        //左边玩家形象
        this.leftDispatchCard = [];
        this.leftPokerData = [];
        this.leftPokerNode = [];
        this.left_player = new Player();
        this.initLeftPlayerNode();
        
        // self.left_player.initBaseInfo();
        // this.leftPokerData = this.myPokerData;
        // this.left_player.playerLeftShowCard(this.leftPokerData,this.leftPokerNode,this.pokerLayerLeft,this.sceneWidth);

        //右边玩家形象
        this.rightDispatchCard = [];
        this.rightPokerData = [];
        this.rightPokerNode = [];
        this.right_player = new Player();
        this.initRightPlayerNode();
        // self.right_player.initBaseInfo();
        // this.right_player.playerRightShowCard(this.rightPokerData,this.rightPokerNode,this.pokerLayerRight,this.sceneWidth);
        
        //注册触摸事件
        this.registerTouchEvent();

        this.leftPlayer.active = false;
        this.rightPlayer.active = false;
        this.table3Card = [];
        this.table3Cards = [];

        if(config.IsContinueGaming == 1){
            // console.log(">>>>>>>>");
            GameNetMgr.sendRequest("Game", "reconnection");
            config.IsContinueGaming = 0;
        }else{
            GameNetMgr.sendRequest("Game", "startGame");
        }
        this.registerEventListener();
        this.initTable3Card();
    },
    //初始化桌面3张底牌
    initTable3Card(){
        this.node_diPai = cc.find("Canvas/top_bar1/diPai");
        this.node_pCardBg = cc.find("Canvas/top_bar1/p_card_bg");
        this.node_tableTimes = cc.find("Canvas/bottom_bar3/beishu/lab_bei").getComponent(cc.Label);
        this.node_pCardBg.active = false;
        this.node_diPai.active = false;

        for(var i=1;i<=3;i++){
            var path = "Canvas/top_bar1/diPai/poker_"+i;
            var poker = cc.find(path);
            this.table3Card.push(poker);
        }

        this.node_lazarillo_poker = cc.find("Canvas/top_bar1/lazarillo_poker");
        this.node_lazarillo_poker.active = false;
        this.node_lazarillo_Num = cc.find("Canvas/top_bar1/lazarillo_poker/sp_num").getComponent(cc.Sprite);
    },
    setLazarillo_poker(cardValue){
        var self = this;
        this.node_lazarillo_poker.active = true;
        cardValue = CardUtil.serverCardValueToClient(cardValue);
        var numUrl = "cards/poke_"+cardValue;
        cc.loader.loadRes(numUrl,cc.SpriteFrame,function(err,spriteFrame){
            self.node_lazarillo_Num.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        });
    },
    setTable3Card(severCards){
        this.node_pCardBg.active = true;
        this.node_diPai.active = true;
        this.table3Cards = severCards;
        for(var i=0;i<3;i++){
            var poker = this.table3Card[i].getComponent(PokerControl);
            poker.setPokerBg();
            poker.showPoker(CardUtil.convertCardToClient(severCards[i]));
        }
    },
    clearTable3Card(){
        this.node_pCardBg.active = false;
        this.node_diPai.active = false;
    },
    setNodeRate(times){
        console.log(times);
        if(times&&times>=2){
        }else{
            return;
        }
        var self = this;
        self.nodeRate.enabled = true;
        if(times == 3){
            cc.loader.loadRes("p_rate3",cc.SpriteFrame,function(err,spriteFrame){
                self.nodeRate.getComponent(cc.Sprite).spriteFrame = spriteFrame;
            });
        }else{
            cc.loader.loadRes("p_rate2",cc.SpriteFrame,function(err,spriteFrame){
                self.nodeRate.getComponent(cc.Sprite).spriteFrame = spriteFrame;
            });
        }
    },
    initMyPlayerNode(){
        var self = this;
        var node_name =  cc.find("Canvas/my_player/head1/name").getComponent(cc.Label);
        var node_LeDou =  cc.find("Canvas/my_player/ledou/lab_ledou").getComponent(cc.Label);
        var node_LeQuan =  cc.find("Canvas/my_player/lequan/lab_lequan").getComponent(cc.Label);
        var node_Landlord =  cc.find("Canvas/my_player/head1/p_dz_icon").getComponent(cc.Sprite);
        var node_hint =  cc.find("Canvas/my_tip/p_tip_jiaodizhu").getComponent(cc.Sprite);
        var node_wechatImg =  cc.find("Canvas/my_player/head1/p_head/p_head_1").getComponent(cc.Sprite);

        var nodes = {};
        nodes.node_name = node_name;//昵称
        nodes.node_LeDou = node_LeDou;//乐斗
        nodes.node_LeQuan = node_LeQuan;//乐券
        nodes.node_cardsNum = null;//剩余牌数 
        nodes.node_Landlord = node_Landlord;//地主标志
        nodes.node_delegate = null;//托管标志
        nodes.node_hint = node_hint;//操作显示语 “要不起”
        nodes.node_clockDwonTime = null;//闹钟倒计时
        nodes.node_wechatImg = node_wechatImg;//微信头像
        nodes.pokerCard = this.pokerCard;//预设扑克牌
        nodes.node_alarm = null;//警报装置

        node_Landlord.enabled = false;
        nodes.node_hint.enabled = false;
        self.playerme_.initNodes(nodes);

        //牌桌任务
        self.node_taskbg = cc.find("Canvas/p_taskbg").getComponent(cc.Sprite);
        self.node_taskName = cc.find("Canvas/p_taskbg/taskName").getComponent(cc.Label);
        self.node_taskbg.enabled = false;
        self.node_taskName.string = "";

        self.lab_roomId = cc.find("Canvas/p_table_icon/lab_roomId").getComponent(cc.Label);
        if(config.tableInfo){
            self.lab_roomId.string = config.tableName[config.tableInfo.roomId];
        }   
        self.leftChatBoxNode = cc.find("Canvas/leftchatBox");
        self.leftChatBoxLabel = cc.find("Canvas/leftchatBox/lab_content").getComponent(cc.Label);
        self.rightChatBoxNode = cc.find("Canvas/rightchatBox");
        self.rightChatBoxLabel = cc.find("Canvas/rightchatBox/lab_content").getComponent(cc.Label);
        self.leftChatBoxNode.active = false;
        self.rightChatBoxNode.active = false;

        //牌型显示
        self.leftCardtype = cc.find("Canvas/left_player/p_cardtype").getComponent(cc.Sprite);
        self.rightCardtype = cc.find("Canvas/right_player/p_cardtype").getComponent(cc.Sprite);
        self.leftCardtype.enabled = false;
        self.rightCardtype.enabled = false;

        //底牌倍数
        self.nodeRate = cc.find("Canvas/top_bar1/p_rate").getComponent(cc.Sprite);
        self.nodeRate.enabled = false;
    },
    initLeftPlayerNode(){
        var self = this;
        var node_name =  cc.find("Canvas/left_player/head/name").getComponent(cc.Label);
        var node_LeDou =  cc.find("Canvas/left_player/ledou/lab_ledou").getComponent(cc.Label);
        var node_cardsNum = cc.find("Canvas/left_player/p_card_1/cardNum").getComponent(cc.Label);
        var node_Landlord =  cc.find("Canvas/left_player/head/p_dz_icon").getComponent(cc.Sprite);
        var node_delegate =  cc.find("Canvas/left_player/head/p_delegate").getComponent(cc.Sprite);
        var node_hint =  cc.find("Canvas/left_player/left_tip/p_tip_yaobuqi").getComponent(cc.Sprite);
        var node_clockDwonTime = cc.find("Canvas/left_player/left_clock/clockDown");//.getComponent(cc.Node);
        var node_wechatImg =  cc.find("Canvas/left_player/head/p_head/p_head_1").getComponent(cc.Sprite);
        var node_alarm =  cc.find("Canvas/left_player/alarm");

        var nodes = {};
        nodes.node_name = node_name;//昵称
        nodes.node_LeDou = node_LeDou;//乐斗
        nodes.node_LeQuan = null;//乐券
        nodes.node_cardsNum = node_cardsNum;//剩余牌数 
        nodes.node_Landlord = node_Landlord;//地主标志
        nodes.node_delegate = node_delegate;//托管标志
        nodes.node_hint = node_hint;//操作显示语 “要不起”
        nodes.node_clockDwonTime = node_clockDwonTime;//闹钟倒计时
        nodes.node_wechatImg = node_wechatImg;//微信头像
        nodes.pokerCard = this.pokerCard;//预设扑克牌
        nodes.node_alarm = node_alarm;//警报装置

        node_Landlord.enabled = false;
        node_delegate.enabled = false;
        node_hint.enabled = false;
        node_clockDwonTime.active = false;
        node_alarm.active = false;

        self.left_player.initNodes(nodes);
    },
    initRightPlayerNode(){
        var self = this;
        var node_name =  cc.find("Canvas/right_player/head/name").getComponent(cc.Label);
        var node_LeDou =  cc.find("Canvas/right_player/ledou/lab_ledou").getComponent(cc.Label);
        var node_cardsNum = cc.find("Canvas/right_player/p_card_1/cardNum").getComponent(cc.Label);
        var node_Landlord =  cc.find("Canvas/right_player/head/p_dz_icon").getComponent(cc.Sprite);
        var node_delegate =  cc.find("Canvas/right_player/head/p_delegate").getComponent(cc.Sprite);
        var node_hint =  cc.find("Canvas/right_player/right_tip/p_tip_qiangdizhu").getComponent(cc.Sprite);
        var node_clockDwonTime = cc.find("Canvas/right_player/right_clock/clockDown");//.getComponent(cc.Node);
        var node_wechatImg =  cc.find("Canvas/right_player/head/p_head/p_head_1").getComponent(cc.Sprite);
        var node_alarm =  cc.find("Canvas/right_player/alarm");

        var nodes = {};
        nodes.node_name = node_name;//昵称
        nodes.node_LeDou = node_LeDou;//乐豆
        nodes.node_LeQuan = null;//乐券
        nodes.node_cardsNum = node_cardsNum;//剩余牌数 
        nodes.node_Landlord = node_Landlord;//地主标志
        nodes.node_delegate = node_delegate;//托管标志
        nodes.node_hint = node_hint;//操作显示语 “要不起”
        nodes.node_clockDwonTime = node_clockDwonTime;//闹钟倒计时
        nodes.node_wechatImg = node_wechatImg;//微信头像
        nodes.pokerCard = this.pokerCard;//预设扑克牌
        nodes.node_alarm = node_alarm;//警报装置

        node_Landlord.enabled = false;
        node_delegate.enabled = false;
        node_hint.enabled = false;
        node_clockDwonTime.active = false;
        node_alarm.active = false;

        self.right_player.initNodes(nodes);
    },
    clearTable(){//清理拍桌
        // var self = this;
        this.playerme_.clear();
        this.left_player.clear();
        this.right_player.clear();

        this.clearTable3Card();

        this.playerme_.clearTableCard(this.dispatchCard);
        this.left_player.clearTableCard(this.leftDispatchCard);
        this.right_player.clearTableCard(this.rightDispatchCard);

        if(this.myPokerNode.length > 0){ //先清理桌上的牌(自己)
            for(var i = 0; i < this.myPokerNode.length; i++){
                this.myPokerNode[i].getComponent(PokerControl).node.removeFromParent();
            }
            this.myPokerNode = [];
        }
        this.myPokerData = [];

        if(this.leftPokerNode.length > 0){ //先清理桌上的牌(自己)
            for(var i = 0; i < this.leftPokerNode.length; i++){
                this.leftPokerNode[i].getComponent(PokerControl).node.removeFromParent();
            }
            this.leftPokerNode = [];
        }
        this.leftPokerData = [];

        if(this.rightPokerNode.length > 0){ //先清理桌上的牌(自己)
            for(var i = 0; i < this.rightPokerNode.length; i++){
                this.rightPokerNode[i].getComponent(PokerControl).node.removeFromParent();
            }
            this.rightPokerNode = [];
        }
        this.rightPokerData = [];

        this.leftPlayer.active = false;
        this.rightPlayer.active = false;
        this.node_taskbg.enabled = false;
        this.node_taskName.string = "";

        this.nodeRate.enabled = false;

        this.preSendCards = [];//上架出牌
        this.preSeatId = -1;//上架出牌id
        config.joker = "";

        console.log("//清理拍桌");

        if(this.CancelDelegate){
            console.log("//清理托管 22222");
            this.CancelDelegate.close();
            // this.CancelDelegate = null;
        }

        if(this.ChatDialog){//聊天界面
            this.ChatDialog.close();
            // this.ChatDialog = null;
        }

        if(this.jpqNode){
            console.log("//记牌器 11111");
            this.jpqNode.close();
            this.jpqNode = null;
        }

        if(this.myOpratShow){
            this.myOpratShow.close();
            // this.myOpratShow = null;
        }
    
        if(this.myOpratCall){
            this.myOpratCall.close();
            this.myOpratCall = null;
        }
        
        if(this.LazarilloPokerSelected){
            this.LazarilloPokerSelected.closeClick();
            this.LazarilloPokerSelected = null;
        }

        if(this.watingStart)
            this.watingStart.hideNode();

        this.node_lazarillo_poker.active = false;
        this.table3Cards = [];
    },
    //注册触摸事件
    registerTouchEvent(){
        var self = this;
        this.canvas.on(cc.Node.EventType.TOUCH_START, function(event){
            // console.log("touchStart");
            if(self.myPokerNode.length < 1 && !config.sendCardState)//|| self.gameState < config.gameState.ST_GAME_OutCard
                return false;
            var p = event.getLocation();
            // console.log(">>x:"+p.x+">>y:"+p.y);
            self.touchBeganX = p.x;
            self.leftX = 0;
            self.rightX = 10000;
            self.upY = 10000;
            self.downY = 0;
            self.isTouchbegan = true;
            self.setSelectCardByTouch(self.myPokerNode,p.x,p.y,self.isTouchbegan);

            if (self.isTouchbegan){
                var x1 = self.myPokerNode[0].getPositionX();
                var x2 = self.myPokerNode[self.myPokerNode.length-1].getPositionX();
                var py = self.myPokerNode[0].getPositionY();
                var psize = self.myPokerNode[0].getContentSize();
                var pwidth = psize.width;
                var pheight = psize.height;

                var disBetween = 10;
    
                self.leftX = x1-pwidth/2-disBetween;
                self.rightX = x2+pwidth/2+disBetween;
                self.upY = py+pheight/2+40;
                self.downY = py-pheight/2;

                // console.log("self.leftX:"+self.leftX+"  self.rightX:"+self.rightX+" self.downY:"+self.downY+"  self.upY:"+ self.upY);
                if (self.isTouchbegan && (p.y > self.upY || p.y < self.downY || p.x < self.leftX || p.x > self.rightX)){
                    self.moveAllCardDown(self.myPokerNode);
                }
            }
        }, this.node);
        this.canvas.on(cc.Node.EventType.TOUCH_END,function(event){
            // console.log("touchEnd");
            if(self.ChatDialog){
                self.ChatDialog.close();
                // self.ChatDialog = null;
            }
            if(self.LazarilloPokerSelected){
                self.LazarilloPokerSelected.closeClick();
                self.LazarilloPokerSelected = null;
            }
            
            if(self.myPokerNode.length < 1  && !config.sendCardState)//|| self.gameState < config.gameState.ST_GAME_OutCard
            return;
            var p = event.getLocation();
            self.moveCard(self.myPokerNode);
        }, this.node);
        this.canvas.on(cc.Node.EventType.TOUCH_MOVE,function(event){
            if(self.myPokerNode.length < 1 && !config.sendCardState)// || self.gameState < config.gameState.ST_GAME_OutCard
            return;
            var p = event.getLocation();
            if (Math.abs(self.touchBeganX - p.x) > 40){
                self.isTouchbegan = false;
                self.setSelectCardByTouch(self.myPokerNode,p.x,p.y,self.isTouchbegan);
            }
        }, this.node);
    },
    //移除触摸事件
    unregisterEvent(){
        this.canvas.targetOff(this.node);
        console.log("off");
    },
    setSelectCardByTouch(myPokerNode,x,y,istouchbegan){
        var touchStart = this.touchBeganX;
        var touchEnd = x;
        this.isTouchbegan = istouchbegan;

        if (this.touchBeganX > x){
            touchStart = x;
            touchEnd = this.touchBeganX; 
        }
        //如果起点跟终点距离小于5 则处理成起点等于终点
        if (touchEnd - touchStart<5){
            touchEnd = touchStart;
        }

        for(var i = 0;i < myPokerNode.length;i++){
            var pokerNode = myPokerNode[i];
            var posY = pokerNode.getPositionY();
            var size = pokerNode.getContentSize();
            var posX = pokerNode.getPositionX(); //+ size.width/2;

            var width = size.width;
            var height = size.height;

            var disBetween = config.seatPos.center.disBetween;
            if(this.sceneWidth > 2330){
                disBetween = config.seatPos.center.disBetweenIX;
            }

            var right = posX - width/2+disBetween;
            var left =  posX - width/2;
            var buttom = posY - height/2;
            var up = posY + height/2;
            //最后一张整张牌都可以点击
            if(i == myPokerNode.length-1){
                right = posX+width/2; 
            }
            if ( y >= buttom && y <= up &&
                ((left>= touchStart && left <= touchEnd) || (right>= touchStart && right <= touchEnd) ||
                (touchStart>= left && touchStart <= right) || (touchEnd>= left && touchEnd <= right))){
                    pokerNode.getComponent(PokerControl).setChoosed(true);
                }else{
            }
        }   
    },
    moveCard(myPokerNode){
        // this.cardData.isChoosed
        var isChoosed = false;
        for(var i = 0;i < myPokerNode.length;i++){
            var pokerNode = myPokerNode[i];
            var pokerControl = pokerNode.getComponent(PokerControl);
            if(pokerControl.cardData.isChoosed){
                isChoosed = true;
            }
            pokerControl.cardMove();
        }
        //xx_test
        if(isChoosed)
            cc.vv.audioMgr.playSFX("Special_selectedCrad");
    },
    moveAllCardDown(myPokerNode){
        console.log("moveAllCardDown");
        var isTopped = false;
        for(var i = 0;i < myPokerNode.length;i++){
            var pokerNode = myPokerNode[i];
            var pokerControl = pokerNode.getComponent(PokerControl);
            if(pokerControl.cardData.isTopped){
                isTopped = true;
            }
            pokerControl.cardMoveDown();
        }
        //xx_test
        if(isTopped)
            cc.vv.audioMgr.playSFX("Special_selectedCrad");
    },
    onShow(){
    },
    onHide(){
        // console.log("onHide");
        // //智能提牌测试
        // var topcards = CardUtil.getMyTopCards(this.myPokerNode,PokerControl);
        
        // var mycards = [];
        // for(var i = this.myPokerData.length - 1; i > -1;i--){
        //     mycards.push(this.myPokerData[i].showTxt);
        //     console.log("xx"+this.myPokerData[i].showTxt);
        // } 

        // var autocards = CardUtil.getCardsFromTopCards(mycards,topcards);
        // if(autocards.length < 1){
        // }else{
        //     this.moveAllCardDown(this.myPokerNode);//先放下在提起
        //     CardUtil.AutoChooseLiftUpCard(this.myPokerNode,PokerControl,autocards);
        // } 
    },
    onMyOutCard(time){
        var self = this;
        var buchuFunc = function(){
            self.moveAllCardDown(self.myPokerNode);
            GameNetMgr.sendRequest("Game","giveupSendCard");
            if(self.myOpratShow){
                self.myOpratShow.close();
                // self.myOpratShow = null;
            }
        }
        var tishiNum = 0;
        var tishiFunc = function(){
            //xx_test
            // var cards = ["17"];//"3","3","3","3"
            var cards = [];
            // console.log("-------preSendCards",self.preSendCards);
            if(self.preSendCards&&self.preSendCards.length>0){
                var pokerdata = CardUtil.serverCardsToClient(self.preSendCards);
                // console.log(pokerdata);
                if(self.prejokto&&self.prejokto.length>0){
                    var joktoIndex = 0;
                    var jokerValue = CardUtil.serverCardValueToClient(config.joker);
                    var jokto = self.prejokto;
                    for(var i=0;i<pokerdata.length;i++){
                        if(jokto[joktoIndex] && pokerdata[i].showTxt == jokerValue){
                            var joktoValue = CardUtil.serverCardValueToClient(jokto[joktoIndex]);
                            cards.push(joktoValue);
                            joktoIndex++;
                        }else{
                            cards.push(pokerdata[i].showTxt);
                        }
                    }
                }else{
                    for(var i =0;i<pokerdata.length;i++){
                        cards.push(pokerdata[i].showTxt);
                    }
                }
            }
            cards.sort(config.arrayUp);
            // console.log(cards);
            var cardstype = CardUtil.get_topCard_type(cards,self.preCardType);
            var myCards = [];
            console.log(cardstype);
            for(var i = self.myPokerData.length - 1; i > -1;i--){
                var cardValue = CardUtil.StringToNumber(self.myPokerData[i].showTxt);
                myCards.push(cardValue); 
            }

            var tishicards = null;
            if(config.joker != ""){
                tishicards = LazarilloCardUtil.get_cards_larger(cardstype,myCards);
            }else{
                tishicards = CardUtil.get_cards_larger(cardstype,myCards);
            }
            // var tishicards = CardUtil.get_cards_larger(cardstype,myCards);
            if(tishicards.length == 0){
                console.log("没有符合的牌型可供提示");
                if(self.myOpratShow){
                    // self.myOpratShow.chupaiClick(-2);
                    buchuFunc();
                }
                return;
            }
            cards = tishicards[tishiNum];
            if(tishiNum<tishicards.length-1){
                tishiNum++;
            }else{
                tishiNum = 0;
            }

            self.node.stopAllActions();
            self.moveAllCardDown(self.myPokerNode);
            var callFunc = cc.callFunc(function(){
                CardUtil.AutoChooseLiftUpCard(self.myPokerNode,PokerControl,cards);
            });
            var delay = cc.delayTime(0.1);
            self.node.runAction(cc.sequence(delay,callFunc));

            // return 100;
        }
        var chupaiFunc = function(){
            console.log("点击了出牌");
            //牌桌上已经有了出牌，清除掉
            if(self.dispatchCard&&self.dispatchCard.length > 0){
                console.log("dispatchCard.length:"+self.dispatchCard.length);
                for(var i = 0; i < self.dispatchCard.length; i++){
                    self.dispatchCard[i].getComponent(PokerControl).node.removeFromParent();
                }
                self.dispatchCard = [];
            }
            var topCards = [];
            var topCardData = [];
            //获取提起的牌直
            for(var i = self.myPokerData.length - 1; i > -1;i--){
                if(self.myPokerData[i].isTopped){
                    var cardValue = CardUtil.StringToNumber(self.myPokerData[i].showTxt);
                    topCards.push(cardValue);
                    var cardType = self.myPokerData[i].showType;
                    var pokerDataItem = {
                        showTxt : cardValue,
                        showType : cardType
                    }
                    topCardData.push(pokerDataItem);
                }
            }

            //获取上家出牌类型
            var cards = [];//"3","3","3","3"
            if(config.joker != ""&&self.preSendCards&&self.preSendCards.length>0){
                var pokerdata = CardUtil.serverCardsToClient(self.preSendCards);
                // console.log(pokerdata);
                if(self.prejokto&&self.prejokto.length>0){
                    var joktoIndex = 0;
                    var jokerValue = CardUtil.serverCardValueToClient(config.joker);
                    var jokto = self.prejokto;
                    for(var i=0;i<pokerdata.length;i++){
                        if(jokto[joktoIndex] && pokerdata[i].showTxt == jokerValue){
                            var joktoValue = CardUtil.serverCardValueToClient(jokto[joktoIndex]);
                            cards.push(joktoValue);
                            joktoIndex++;
                        }else{
                            cards.push(pokerdata[i].showTxt);
                        }
                    }
                }else{
                    for(var i =0;i<pokerdata.length;i++){
                        cards.push(pokerdata[i].showTxt);
                    }
                }
                cards.sort(config.arrayUp);
            }
            
            //赖子场目前不做判断
            if(config.joker != ""){
                var args = CardUtil.clientCardsToServer(topCardData);
                console.log("-----赖子出牌测试")
                console.log(args);
                if(args.length){
                    // var cardstype = CardUtil.get_topCard_type(cards,self.preCardType);
                    var tips = LazarilloCardUtil.get_effective_tips_cards(args, config.joker);
                    console.log(tips);
                    
                    if(tips.length == 1){
                        var jackto = tips[0][1];
                        for(var i=0;i<jackto.length;i++){
                            jackto[i] = CardUtil.serverCardValueToServer(jackto[i]);
                        }
                        GameNetMgr.sendRequest("Game","sendCard",{0:tips[0][0],1:jackto});
                    }else if(tips.length > 1){
                        if(self.mySeatId == self.preSeatId || self.myPokerData.length == 20){//自己必出或地主第一手出牌
                            self.showLazarilloPokerSelected(tips);
                            return 100;
                        }

                        var cardstype = CardUtil.get_topCard_type(cards,self.preCardType);
                        var big_tips = LazarilloCardUtil.get_big_tips_cards(tips,cardstype);
                        if(big_tips.length == 1){
                            var jackto = big_tips[0][1];
                            for(var i=0;i<jackto.length;i++){
                                jackto[i] = CardUtil.serverCardValueToServer(jackto[i]);
                            }
                            GameNetMgr.sendRequest("Game","sendCard",{0:big_tips[0][0],1:jackto});//big_tips[0]
                        }else{
                            self.showLazarilloPokerSelected(big_tips);
                        }
                    }else{
                        return -1;
                    }
                }
                return 100;
            }

            if(topCards.length>=1){
                var popCardsType = CardUtil.get_topCard_type(topCards);
                // console.log(popCardsType);
                if(popCardsType.type == 0){
                    console.log("提起的牌不合法");
                    return -1;
                }    
            }else{
                console.log("没有牌提起");
                return 0;
            }
            
            var args = CardUtil.clientCardsToServer(topCardData);
            // console.log(args);
            GameNetMgr.sendRequest("Game","sendCard",args);
            return 100;
        }

        var curTime = config.SendCardTimeout;
        if(time){
            curTime = time;
        }

        if(this.myOpratShow){
            if(this.playerme_.getCardCount()==20 || this.mySeatId == this.preSeatId){
                this.myOpratShow.show(curTime,buchuFunc,tishiFunc,chupaiFunc,1);
            }else{
                this.myOpratShow.show(curTime,buchuFunc,tishiFunc,chupaiFunc);
            }
            return;
        }

        if(this.playerme_.getCardCount()==20 || this.mySeatId == this.preSeatId){
            var opOutCard = cc.instantiate(this.opratOutCard);
            cc.director.getScene().addChild(opOutCard,999);
            var opOutCardControl = opOutCard.getComponent(opratOutCardControl);
            opOutCardControl.show(curTime,buchuFunc,tishiFunc,chupaiFunc,1);
            this.myOpratShow = opOutCardControl;
        }else{
            var opOutCard = cc.instantiate(this.opratOutCard);
            cc.director.getScene().addChild(opOutCard,999);
            var opOutCardControl = opOutCard.getComponent(opratOutCardControl);
            opOutCardControl.show(curTime,buchuFunc,tishiFunc,chupaiFunc);
            this.myOpratShow = opOutCardControl;
        }
    },
    mySendCards(severCards,jokto){//自己出牌
        var self = this;
        if(severCards){//(根据服务器返回的牌出牌)
            var cardData = CardUtil.serverCardsToClient(severCards);
            cardData.sort(CardUtil.gradeUp);//这边生序拍下
            self.dispatchCard = self.playerme_.getSendCard(self.dispatchCard,cardData,self.myPokerNode,self.myPokerData);
        }

        //出牌
        self.playerme_.playCard(self.dispatchCard,jokto);
        self.playerme_.neatenPoker(self.myPokerNode,config.seatPos.center,self.sceneWidth);
        //最后一张牌设置为地主牌
        if(self.playerme_.getLandlord()&&self.myPokerNode.length>0){
            self.myPokerNode[self.myPokerNode.length-1].getComponent(PokerControl).setCardDiZhu(true);
        }
        if(self.playerme_.getOpenHandCards()&&self.myPokerNode.length>0){
            self.myPokerNode[self.myPokerNode.length-1].getComponent(PokerControl).setCardShow(true);
        }
        self.playerme_.setCardCount(self.myPokerNode.length);
    },
    leftSendCards(severCards,cardData,isShowCard,jokto){
        var self = this;
        var sceneWidth = this.sceneWidth;

        if(!severCards){
            return;
        }

        if(cardData){
        }else{
            cardData = CardUtil.serverCardsToClient(severCards);
        }

        //左边明牌出牌
        if(isShowCard){
            cardData.sort(CardUtil.gradeUp);//这边生序拍下
            self.leftDispatchCard = self.left_player.getSendCard(self.leftDispatchCard,cardData,self.leftPokerNode,self.leftPokerData);
            self.left_player.playCardLeft(self.leftDispatchCard,320,650,jokto);
            self.left_player.neatenLeftPoker(self.leftPokerNode,config.seatPos.left,sceneWidth/2, 230);
        }else{
            //左边暗牌出牌
            self.leftDispatchCard = self.left_player.darkCardSend(self.leftDispatchCard,cardData,self.pokerLayerLeft,2,sceneWidth,jokto);
            self.left_player.playCardLeft(self.leftDispatchCard,320,650,jokto);
        }  
    },
    rightSendCards(severCards,cardData,isShowCard,jokto){
        var self = this;
        var sceneWidth = this.sceneWidth;
        if(!severCards){
            return;
        }
        if(cardData){
        }else{
            if(severCards){
                cardData = CardUtil.serverCardsToClient(severCards);
            } 
        }

        if(isShowCard){
            //右边明牌出牌
            cardData.sort(CardUtil.gradeUp);//这边生序拍下
            self.rightDispatchCard = self.right_player.getSendCard(self.rightDispatchCard,cardData,self.rightPokerNode,self.rightPokerData);
            self.right_player.playCardRight(self.rightDispatchCard,620,650,jokto);
            self.right_player.neatenRightPoker(self.rightPokerNode,config.seatPos.right,sceneWidth/2, sceneWidth/2 + 140);
        }else{
            //右边暗牌出牌
            self.rightDispatchCard = self.right_player.darkCardSend(self.rightDispatchCard,cardData,self.pokerLayerRight,0,sceneWidth,jokto);
            self.right_player.playCardRight(self.rightDispatchCard,620,650,jokto);
        }  
    },
    btnMyPlayerClick(){
        console.log("点击自己头像")
        var args = {};
        args.player = this.playerme_;
        args.sendSeatId = this.mySeatId;
        args.receiveSeatId = this.mySeatId;
        dialogManager.showPlayerInfo(args);
        cc.vv.audioMgr.playSFX("SpecOk");
    },
    btnLeftPlayerClick(){
        console.log("点击左边头像")
        var args = {};
        args.player = this.left_player;
        args.sendSeatId = this.mySeatId;
        args.receiveSeatId = this.left_player.getMySeatId();
        dialogManager.showPlayerInfo(args);
        cc.vv.audioMgr.playSFX("SpecOk");
    },
    btnRightPlayerClick(){
        console.log("点击右边头像")
        var args = {};
        args.player = this.right_player;
        args.sendSeatId = this.mySeatId;
        args.receiveSeatId = this.right_player.getMySeatId();
        dialogManager.showPlayerInfo(args);
        cc.vv.audioMgr.playSFX("SpecOk");
    },
    //返回按钮点击事件
    btnBackClick(){
        var self = this;
        console.log("btnBackClick");
        PlayerDetailModel.continueRoomId = 0;
        if(self.gameState < config.gameState.ST_GAME_BALANCE&&self.gameState>config.gameState.ST_GAME_PREPARE){
            var click = function(){ 
                // GameNetMgr.sendRequest("Game", "exitRoom");
                GameNetMgr.sendRequest("Game","requestDelegate",true);
                self.removeEventListener();
                self.preloadNextScene();
            }
            dialogManager.showCommonDialog("温馨提示","现在离开会由笨笨的机器人代打哟，输了豆豆可不能怪它喔！",click);
        }else{
            if(self.gameState==config.gameState.ST_GAME_PREPARE){
                GameNetMgr.sendRequest("Game", "exitRoom");
            }
            self.removeEventListener();
            self.preloadNextScene();
        }
        cc.vv.audioMgr.playSFX("SpecOk");
    },
    btnDelegateClick(){
        console.log("btnDelegateClick");
        var self = this;
        if(self.playerme_.getDelegated()){
            console.log("托管中。。。。");
        }else{
            if(self.gameState >= config.gameState.ST_GAME_CallLordOver){
                GameNetMgr.sendRequest("Game","requestDelegate",true);
                self.playerme_.setDelegated(true);
                self.showCancelDelegate();
            }
        }
        cc.vv.audioMgr.playSFX("SpecOk");
    },
    showCancelDelegate(){
        var self = this;
        var click = function(){
            GameNetMgr.sendRequest("Game","cancelDelegate");
            // self.CancelDelegate = null;
            self.playerme_.setDelegated(false);
            cc.vv.audioMgr.playSFX("SpecOk");
        }
        if(self.CancelDelegate){
            self.CancelDelegate.show(click);
            return;
        }
        cc.loader.loadRes("prefab/CancelDelegate", function (err, prefab) {
            //匹配计数动画
            if (err) {
                console.log(err);
                return;
            }
            var newNode = cc.instantiate(prefab);
            cc.director.getScene().addChild(newNode,10);
            var prefabControl= newNode.getComponent(require("CancelDelegateController"));
            prefabControl.show(click);
            self.CancelDelegate = prefabControl; 
        });
    },
    btnSetClick(){
        console.log("btnSetClick");
        dialogManager.showSetDialog();
        cc.vv.audioMgr.playSFX("SpecOk");
    },
    btnJiPaiQiClick(){
        console.log("btnJiPaiQiClick");
        //没有记牌器弹出分享窗口
        // if(this.gameState <= 6)
        //     return;
        this.showJPQShareGet();

        var self = this;
        if(self.jpqNode){
            if(self.jpqNode.getIsActive()){
                self.jpqNode.showNode(false);
            }else{
                self.jpqNode.showNode(true);
            }
        }
        cc.vv.audioMgr.playSFX("SpecOk");
    },
    showJPQShareGet(){
        //记牌器开启
        var self = this;
        var propItems = PlayerDetailModel.getPropItems();
        if (propItems["5"] && propItems["5"] == 1){
            return;
        }
        console.log(">>>>>>gameState:",self.gameState)
        if(self.gameState > config.gameState.ST_GAME_START)
            dialogManager.showTableShareGet("jipaiqi");
    },
    showJPQ(mycards){
        var self = this;
        if(self.jpqNode){
            self.jpqNode.show(mycards);
            return;
        }
        cc.loader.loadRes("prefab/jpqNode", function (err, prefab) {
            if (err) {
                console.log(err);
                return;
            }
            var newNode = cc.instantiate(prefab);
            cc.director.getScene().addChild(newNode,9);
            var prefabControl= newNode.getComponent(require("jpqNodeControl"));
            self.jpqNode = prefabControl; 
            self.jpqNode.show(mycards);
        });
    },
    btnChatClick(){
        console.log("btnChatClick");
        var self = this;
        if(self.ChatDialog){
            self.ChatDialog.show();
        }else{
            var click = function(){
                // self.ChatDialog = null;
            }
            cc.loader.loadRes("prefab/chatDialog", function (err, prefab) {
                if (err) {
                    console.log(err);
                    return;
                }
                var newNode = cc.instantiate(prefab);
                cc.director.getScene().addChild(newNode,9999);
                var prefabControl= newNode.getComponent(require("chatControl"));
                prefabControl.show(click);
                self.ChatDialog = prefabControl; 
            });
        }
        cc.vv.audioMgr.playSFX("SpecOk");
    },
    showMyChat(content){
        var self = this;
        if(self.myChatBox){
            self.myChatBox.show(content);
            console.log("myChatBox 已存在");
            return;
        }
        cc.loader.loadRes("prefab/chatBox", function (err, prefab) {
            if (err) {
                console.log(err);
                return;
            }
            var newNode = cc.instantiate(prefab);
            cc.director.getScene().addChild(newNode,9999);
            var prefabControl= newNode.getComponent(require("chatBoxControl"));
            self.myChatBox = prefabControl;
            prefabControl.show(content);
        });
    },
    showLeftChat(content){
        var self = this;
        self.leftChatBoxNode.active = true;
        self.leftChatBoxLabel.string = content;
        this.pokerLayerLeft.stopAllActions();
        var callFunc = cc.callFunc(function(){
            self.leftChatBoxNode.active = false;
        });
        var delay = cc.delayTime(2);
        this.pokerLayerLeft.runAction(cc.sequence(delay,callFunc)); 
    },
    showRightChat(content){
        var self = this;
        self.rightChatBoxNode.active = true;
        self.rightChatBoxLabel.string = content;
        this.pokerLayerRight.stopAllActions();
        var callFunc = cc.callFunc(function(){
            self.rightChatBoxNode.active = false;
        });
        var delay = cc.delayTime(2);
        this.pokerLayerRight.runAction(cc.sequence(delay,callFunc)); 
    },
    showMyCardtype(cardType){
        cc.loader.loadRes("animatiom/anim_cardType", function (err, prefab) {
            if (err) {
                console.log(err);
                return;
            }
            var newNode = cc.instantiate(prefab);
            cc.director.getScene().addChild(newNode,9999);
            var prefabControl= newNode.getComponent(require("cardTypeControl"));
            prefabControl.show(cardType);
        });
    },
    showLeftCardtype(cardType){
        var self = this;
        var numUrl = "showTips/p_cardtype_1";
        if(cardType == config.CardType.Straight){
        }else if(cardType == config.CardType.StraightDouble){
            numUrl = "showTips/p_cardtype_2";
        }
        cc.loader.loadRes(numUrl,cc.SpriteFrame,function(err,spriteFrame){
            self.leftCardtype.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        });
        self.leftCardtype.enabled = true;
        var callFunc = cc.callFunc(function(){
            self.leftCardtype.enabled = false;
        });
        var delay = cc.delayTime(2);
        this.leftCardtype.node.runAction(cc.sequence(delay,callFunc)); 
    },
    showRightCardtype(cardType){
        var self = this;
        var numUrl = "showTips/p_cardtype_1";
        if(cardType == config.CardType.Straight){
        }else if(cardType == config.CardType.StraightDouble){
            numUrl = "showTips/p_cardtype_2";
        }
        cc.loader.loadRes(numUrl,cc.SpriteFrame,function(err,spriteFrame){
            self.rightCardtype.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        });
        self.rightCardtype.enabled = true;
        var callFunc = cc.callFunc(function(){
            self.rightCardtype.enabled = false;
        });
        var delay = cc.delayTime(2);
        this.rightCardtype.node.runAction(cc.sequence(delay,callFunc)); 
    },
    registerEventListener(){
        var self = this;
        EventHelper.AddCustomEvent(config.MyNode,"Queued",self.onQueued,self);
        EventHelper.AddCustomEvent(config.MyNode,"GameReady",self.onGameReady,self);
        EventHelper.AddCustomEvent(config.MyNode,"TableTimesUpdate",self.onTableTimesUpdate,self);
        EventHelper.AddCustomEvent(config.MyNode,"SendCard",self.onSendCard,self);
        EventHelper.AddCustomEvent(config.MyNode,"RefreshPlayerData",self.onRefreshPlayerData,self);
        EventHelper.AddCustomEvent(config.MyNode,"TurnCallLord",self.onTurnCallLord,self);
        EventHelper.AddCustomEvent(config.MyNode,"CallLord",self.onCallLord,self);
        EventHelper.AddCustomEvent(config.MyNode,"TurnGrabLord",self.onTurnGrabLord,self);
        EventHelper.AddCustomEvent(config.MyNode,"GrabLord",self.onGrabLord,self);
        EventHelper.AddCustomEvent(config.MyNode,"CallLordOver",self.onCallLordOver,self);
        EventHelper.AddCustomEvent(config.MyNode,"CanDoubleResult",self.onCanDoubleResult,self);
        EventHelper.AddCustomEvent(config.MyNode,"TurnSendCard",self.onTurnSendCard,self);
        EventHelper.AddCustomEvent(config.MyNode,"PlayerDelegated",self.onPlayerDelegated,self);
        EventHelper.AddCustomEvent(config.MyNode,"PlayerCancelDelegate",self.onPlayerCancelDelegate,self);
        EventHelper.AddCustomEvent(config.MyNode,"PlayerSendCard",self.onPlayerSendCard,self);
        EventHelper.AddCustomEvent(config.MyNode,"PlayerNotSend",self.onPlayerNotSend,self);
        EventHelper.AddCustomEvent(config.MyNode,"PlayerShowCard",self.onPlayerShowCard,self);
        EventHelper.AddCustomEvent(config.MyNode,"GameComplete",self.onGameComplete,self);
        EventHelper.AddCustomEvent(config.MyNode,"TableUserExit",self.onTableUserExit,self);
        EventHelper.AddCustomEvent(config.MyNode,"InvalidCardNum",self.onInvalidCardNum,self);
        EventHelper.AddCustomEvent(config.MyNode,"SayToTableInfo",self.onSayToTableInfo,self);
        EventHelper.AddCustomEvent(config.MyNode,"ReconnectionData",self.onReconnectionData,self);
        EventHelper.AddCustomEvent(config.MyNode,"PokerTask",self.onPokerTask,self);
        EventHelper.AddCustomEvent(config.MyNode,"OpenRechargeTipResult",self.onOpenRechargeTipResult,self);
        EventHelper.AddCustomEvent(config.MyNode,"RefreshDataResult",self.onRefreshDataResult,self);
        EventHelper.AddCustomEvent(config.MyNode,"RepeatLogin",self.onRepeatLogin,self);
        EventHelper.AddCustomEvent(config.MyNode,"EmoticonData",self.onEmoticonData,self);
        EventHelper.AddCustomEvent(config.MyNode,"SendLzCard",self.onSendLzCard,self);
        //ShareWxResResult
        EventHelper.AddCustomEvent(config.MyNode,"ShareWxResResult",self.onShareWxResResult,self);
        EventHelper.AddCustomEvent(config.MyNode,"InvalidCardType",self.onInvalidCardType,self);

        EventHelper.AddCustomEvent(config.MyNode,"WatchAdvertisementResult",self.onWatchAdvertisementResult,self);
    },
    removeEventListener(){
        var self = this;
        EventHelper.RemoveCustomEvent(config.MyNode,"Queued",self.onQueued,self);
        EventHelper.RemoveCustomEvent(config.MyNode,"GameReady",self.onGameReady,self);
        EventHelper.RemoveCustomEvent(config.MyNode,"TableTimesUpdate",self.onTableTimesUpdate,self);
        EventHelper.RemoveCustomEvent(config.MyNode,"SendCard",self.onSendCard,self);
        EventHelper.RemoveCustomEvent(config.MyNode,"RefreshPlayerData",self.onRefreshPlayerData,self);
        EventHelper.RemoveCustomEvent(config.MyNode,"TurnCallLord",self.onTurnCallLord,self);
        EventHelper.RemoveCustomEvent(config.MyNode,"CallLord",self.onCallLord,self);
        EventHelper.RemoveCustomEvent(config.MyNode,"TurnGrabLord",self.onTurnGrabLord,self);
        EventHelper.RemoveCustomEvent(config.MyNode,"GrabLord",self.onGrabLord,self);
        EventHelper.RemoveCustomEvent(config.MyNode,"CallLordOver",self.onCallLordOver,self);
        EventHelper.RemoveCustomEvent(config.MyNode,"CanDoubleResult",self.onCanDoubleResult,self);
        EventHelper.RemoveCustomEvent(config.MyNode,"TurnSendCard",self.onTurnSendCard,self);
        EventHelper.RemoveCustomEvent(config.MyNode,"PlayerDelegated",self.onPlayerDelegated,self);
        EventHelper.RemoveCustomEvent(config.MyNode,"PlayerCancelDelegate",self.onPlayerCancelDelegate,self);
        EventHelper.RemoveCustomEvent(config.MyNode,"PlayerSendCard",self.onPlayerSendCard,self);
        EventHelper.RemoveCustomEvent(config.MyNode,"PlayerNotSend",self.onPlayerNotSend,self);
        EventHelper.RemoveCustomEvent(config.MyNode,"PlayerShowCard",self.onPlayerShowCard,self);
        EventHelper.RemoveCustomEvent(config.MyNode,"GameComplete",self.onGameComplete,self);
        EventHelper.RemoveCustomEvent(config.MyNode,"TableUserExit",self.onTableUserExit,self);
        EventHelper.RemoveCustomEvent(config.MyNode,"InvalidCardNum",self.onInvalidCardNum,self);
        EventHelper.RemoveCustomEvent(config.MyNode,"SayToTableInfo",self.onSayToTableInfo,self);
        EventHelper.RemoveCustomEvent(config.MyNode,"ReconnectionData",self.onReconnectionData,self);
        EventHelper.RemoveCustomEvent(config.MyNode,"PokerTask",self.onPokerTask,self);
        EventHelper.RemoveCustomEvent(config.MyNode,"OpenRechargeTipResult",self.onOpenRechargeTipResult,self);
        EventHelper.RemoveCustomEvent(config.MyNode,"RefreshDataResult",self.onRefreshDataResult,self);
        EventHelper.RemoveCustomEvent(config.MyNode,"RepeatLogin",self.onRepeatLogin,self);
        EventHelper.RemoveCustomEvent(config.MyNode,"EmoticonData",self.onEmoticonData,self);
        EventHelper.RemoveCustomEvent(config.MyNode,"SendLzCard",self.onSendLzCard,self);
        EventHelper.RemoveCustomEvent(config.MyNode,"ShareWxResResult",self.onShareWxResResult,self);
        EventHelper.RemoveCustomEvent(config.MyNode,"InvalidCardType",self.onInvalidCardType,self);

        EventHelper.RemoveCustomEvent(config.MyNode,"WatchAdvertisementResult",self.onWatchAdvertisementResult,self);
    },
    //初始化玩家信息
    initPlayerInfo(response){
        var self = this;
        if(response.data["time"]){
            //出牌等待时间
            config.CallLordTimeout = response.data["time"]["lord"];
            //抢地主超时时间
            config.GrabLordTimeout = response.data["time"]["lord"];
            //出牌倒计时时间
            config.SendCardTimeout = response.data["time"]["send"];
            //过牌时间--要不起
            config.CheckCardTimeout = response.data["time"]["giveup"];
            //加倍时间
            config.AddRatioTime = response.data["time"]["double"]; 
        }else{
            config.CallLordTimeout = 15;
            //抢地主超时时间
            config.GrabLordTimeout = 15;
            //出牌倒计时时间
            config.SendCardTimeout = 30;
            //过牌时间--要不起
            config.CheckCardTimeout = 10;
            //加倍时间
            config.AddRatioTime = 5;
        }
        var newGame = response["data"]["isNewGame"];
        this.nicknames = [];
        if(newGame){
            var mySeatId = response["data"]["seatId"];
            self.mySeatId = mySeatId;
            self.playerme_.setMySeatId(mySeatId);
            self.playerme_.setMySeatNum(1);
            var peers = {0:response["data"]["0"], 1:response["data"]["1"], 2:response["data"]["2"]};
            for(var k in peers){
                var v = peers[k];
                var curSeatId = v["seatId"];

                this.nicknames.push(v["nick"]);

                if(curSeatId == mySeatId){
                    self.playerme_.setMySeatId(v["seatId"]);
                    self.playerme_.setRoomId(v["roomId"]);
                    self.playerme_.setTableId(v["tableId"]);
                    self.playerme_.setSignature(v["word"]);
                    self.playerme_.setBuff(v["buff"]);
                    self.playerme_.setPlay(v["play"]);
                    self.playerme_.setWin(v["win"]);
                }else{
                    var seatNum = 1;
                    seatNum = config.getPlayerSeatNum(self.mySeatId,curSeatId);
                    
                    var parm = {};
                    parm.uid = parseInt(v["uid"]);
                    parm.nickname = v["nick"];
                    parm.gender = v["sex"];
                    parm.coin = parseInt(v["coin"]);
                    parm.gold = parseInt(v["gold"]);
                    parm.propDress = v["propDress"];
                    parm.myseat = v["seatId"];
                    parm.roomid = v["roomId"];
                    parm.tableid = v["tableId"];
                    parm.signature = v["word"];
                    parm.buff = v["buff"];
                    parm.wechatImg = v["img"];
                    parm.title = v["title"];
                    parm.emoticon = {};
                    parm.emoticonItems = {};
                    parm.play = v["play"];//游戏总局数
                    parm.win = v["win"];//胜利局数

                    if(seatNum == 2){//左边玩家
                        self.left_player.initInfo(parm);
                        self.left_player.initBaseInfo();
                        self.left_player.setMySeatNum(seatNum);
                        self.leftPlayer.active = true;   
                    }else if(seatNum == 0){//右边玩家
                        self.right_player.initInfo(parm);
                        self.right_player.initBaseInfo();
                        self.right_player.setMySeatNum(seatNum);
                        self.rightPlayer.active = true;
                    }
                }
            }
        }else{
            console.log("短线重连 进入游戏-----------");
        }
    },
    //叫地主，抢地主弹出框
    showCallLord(time,btn1Func,btn2Func,type){
        var self = this;
        cc.loader.loadRes("prefab/opratCallLord", function (err, prefab) {
            if (err) {
                console.log(err);
                return;
            }
            var newNode = cc.instantiate(prefab);
            cc.director.getScene().addChild(newNode,999);
            var prefabControl= newNode.getComponent(require("opratCallLordControl"));
            prefabControl.show(time,btn1Func,btn2Func,type);
            
            // if(type == 3 && !self.myOpratShow){
            //     self.myOpratShow = prefabControl; 
            // }else{
                self.myOpratCall = prefabControl;
            // }
        });
    },
    //结算洁面
    showGameResult(response){
        var self = this;
        var infos = [];
        var data = response.data;

        cc.vv.audioMgr.stopMusic();
        config.IsContinueGaming = 0;
        PlayerDetailModel.continueRoomId = 0;

        var click1 = function(){//名牌
            self.clearTable();
            cc.vv.audioMgr.stopMusic();
            if(config.tableInfo&&self.playerme_.getCoin()<config.tableInfo.enterLimit){
                if(config.tableInfo.roomId == config.RoomConfig[1].roomId||config.tableInfo.roomId == config.RoomConfig[7].roomId){
                    dialogManager.showCommonDialog("温馨提示","您的豆子不足该场次！",function(){
                        GameNetMgr.sendRequest("Game", "openRechargeTip", {});
                        console.log("弹出救济框----");
                    });
                }else{
                    dialogManager.showCommonDialog("温馨提示","您的豆子不足该场次！",function(){
                        self.preloadNextScene();
                    });
                }
            }else{
                GameNetMgr.sendRequest("Game", "startGame",true);
                cc.vv.audioMgr.playBGM("MusicEx_Normal");
                self.gameResultControl.closeClick();
                self.gameResultControl = null;
            }
        }
        var click2 = function(){
            self.clearTable();
            cc.vv.audioMgr.stopMusic();
            if(config.tableInfo&&self.playerme_.getCoin()<config.tableInfo.enterLimit){
                if(config.tableInfo.roomId == config.RoomConfig[1].roomId||config.tableInfo.roomId == config.RoomConfig[7].roomId){
                    dialogManager.showCommonDialog("温馨提示","您的豆子不足该场次！",function(){
                        GameNetMgr.sendRequest("Game", "openRechargeTip", {});
                        console.log("弹出救济框----");
                    });
                }else{
                    dialogManager.showCommonDialog("温馨提示","您的豆子不足该场次！",function(){
                        self.preloadNextScene();
                    });
                }
            }else{
                GameNetMgr.sendRequest("Game", "startGame",false);
                cc.vv.audioMgr.playBGM("MusicEx_Normal");
                self.gameResultControl.closeClick();
                self.gameResultControl = null;
            }
        }
        var url = "prefab/gameResultWin";

        if(response["data"]["isWinner"][""+self.mySeatId] == 1){
            cc.vv.audioMgr.playSFX("MusicEx_Win");
        }else{
            url = "prefab/gameResultLose";
            cc.vv.audioMgr.playSFX("MusicEx_Lose");
        }
        self.playerme_.setCoin(data.coins[self.mySeatId]);
   
        var rate = data.rate;
        var rateMax = data.rateMax;
        var baseCoins = data.baseCoins;

        var mySocre = 0;
        var myStwin = 0;//连胜

        for (var i=0;i<3;i++){
            var socre = data.total[""+i];
            var infoItem = {
                isdizhu : self.loadSeatId==i,nickname : self.nicknames[i],difen : baseCoins,beishu : rate,ledou : socre,coin:data.coins[i],rateMax : rateMax
            }
            infos.push(infoItem);

            if(self.mySeatId==i){
                mySocre = socre;
                myStwin = data.stwin[""+i];
            } 
        }

        console.log(">>>>>myStwin:",myStwin);

        if(!self.gameResultControl){
            cc.loader.loadRes(url, function (err, prefab) {
                if (err) {
                    console.log(err);
                    return;
                }
                var nextScene = function(){
                    self.gameResultControl = null;
                    self.removeEventListener();
                    self.preloadNextScene();
                }
                var newNode = cc.instantiate(prefab);
                cc.director.getScene().addChild(newNode,999);
                var prefabControl= newNode.getComponent(require("gameResultControl"));
                prefabControl.show(infos,click1,click2,self.mySeatId,nextScene);
                self.gameResultControl = prefabControl;
            });
        }

        var showShare = false;
        if(response.data.spring == 1 || response.data.boorSpring == 1){
            if(mySocre>0){
                //弹出春天分享
                this.taskComplete = false;
                dialogManager.showTaskCompleteShare("chuntian");
            } 
            showShare = true;
        }

        if(myStwin == 3 && !showShare){
            //连胜
            dialogManager.showTaskCompleteShare("liansheng_3");
            showShare = true;
        }

        //如果任务完成
        if(this.taskComplete && !showShare){
            //弹出奖品分享
            dialogManager.showTaskCompleteShare("lequan");
            config.leQuanShareSucss = true;
            showShare = true;
        }
    },
    showWatingStartGame(){
        var self = this;
        // cc.loader.loadRes("animatiom/watingStartGame", function (err, prefab) {
        //     //匹配计数动画
        //     if (err) {
        //         console.log(err);
        //         return;
        //     }
        //     var newNode = cc.instantiate(prefab);
        //     cc.director.getScene().addChild(newNode);
        //     var prefabControl = newNode.getComponent(require("watingStarControl"));
        //     self.watingStart = prefabControl;
        //     self.watingStart.hideNode();
        // });
        var prefabControl = self.WatingStartNode.getComponent(require("watingStarControl"));
        self.watingStart = prefabControl;
        self.watingStart.hideNode();
    },
    //监听服务器返回事件
    ////////////
    onQueued(event){
        var self = this;
        console.log("进入队列---");

        if(self.gameState > 1 && self.gameState < 8)
            return;

        self.gameState = config.gameState.ST_GAME_PREPARE;
        if(self.watingStart)
            self.watingStart.showNode();
    },
    onGameReady(event){
        var self = this;
        console.log("游戏准备好了---");
        self.playerme_.hideHint();
        self.left_player.hideHint();
        self.right_player.hideHint();
        config.joker = "";

        self.gameState = config.gameState.ST_GAME_START;
        var response = event.getUserData();
        self.initPlayerInfo(response);
    },
    onTableTimesUpdate(event){
        var self = this;
        console.log("桌子的倍数发生改变---");
        var response = event.getUserData();
        var times = response["data"]["rate"];
        self.node_tableTimes.string = "" + times;
        var rate = response["data"]["rate_num"];
        
        var rateId = response["data"]["rateId"];
        var seatNum = config.getPlayerSeatNum(self.mySeatId,rateId);

        console.log("seatNum:"+seatNum);
        console.log("self.gameState:"+self.gameState);

        var gender = 1;

        if(self.gameState == config.gameState.ST_GAME_Double){
            if(seatNum == 1){//自己
                gender = self.playerme_.getGender();
                if(rate>1&&rate<=5){
                    dialogManager.showAnimDouble(rate,seatNum);
                }
            }else if(seatNum == 0){//右边
                gender = self.right_player.getGender();
                if(rate>1&&rate<=5){
                    dialogManager.showAnimDouble(rate,seatNum);
                    // self.right_player.showHint(config.hintType.double);
                }
            }else if(seatNum == 2){//左边
                gender = self.left_player.getGender();
                if(rate>1&&rate<=5){
                    dialogManager.showAnimDouble(rate,seatNum);
                    // self.left_player.showHint(config.hintType.double);
                }
            }else{
                if(rate>1&&rate<=5){
                    dialogManager.showAnimDouble(rate,1);
                }
            }

            if(self.gameState == config.gameState.ST_GAME_Double){
                cc.vv.audioMgr.playCardsEffect(gender,"jiabei");
            }
                    
        }else{
            if(rate>1&&rate<=5){
                dialogManager.showAnimDouble(rate,1);
            }
        }
    },
    onSendCard(event){
        var self = this;
        console.log("发牌, 包括各用户的牌信息---");
        self.gameState = config.gameState.ST_GAME_SendCard;

        if(self.watingStart)
            self.watingStart.hideNode();

        self.playerme_.hideHint();
        self.left_player.hideHint();
        self.right_player.hideHint();

        if(self.myPokerNode.length > 0){ //先清理桌上的牌
            for(var i = 0; i < self.myPokerNode.length; i++){
                self.myPokerNode[i].getComponent(PokerControl).node.removeFromParent();
            }
            self.myPokerNode = [];
        }
        self.myPokerData = [];

        config.sendCardState = true;
        var moveCardend = function(){
            config.sendCardState = false;
        }
        setTimeout(moveCardend,1800);

        var response = event.getUserData();
        self.myPokerData = CardUtil.serverCardsToClient(response.data.myCard);
        self.playerme_.initMyCards(self.myPokerData,self.myPokerNode,self.scene,self.sceneWidth,-1);
        cc.vv.audioMgr.playSFX("Special_Dispatch");
        self.myHandCards = response.data.myCard;

        
    
        var myShowCard = response.data.showCard[self.mySeatId];
        if(myShowCard == 0){
            //明牌按钮现实
            var click = function(time){
                GameNetMgr.sendRequest("Game","showCard",time);
            }
            // dialogManager.showOpratShowCard(click);
            cc.loader.loadRes("prefab/opratShowCard", function (err, prefab) {
                if (err) {
                    console.log(err);
                    return;
                }
                var newNode = cc.instantiate(prefab);
                cc.director.getScene().addChild(newNode,999);
                self.opratShowCard = newNode.getComponent(require("opratShowCardControl"));
                self.opratShowCard.show(click);
            });
        } 

    },
    onRefreshPlayerData(event){
        var self = this;
        console.log("刷新用户金币---");
        var response = event.getUserData();
        var data = response.data;
        if(data){
            for(var i=0;i<data.length;i++){
                var seatNum = config.getPlayerSeatNum(self.mySeatId,i);
                if(seatNum == 1){//自己
                    self.playerme_.setCoin(data[i].coins);
                    PlayerDetailModel.setCoin(data[i].coins)
                }else if(seatNum == 0){//右边
                    self.right_player.setCoin(data[i].coins);
                }else if(seatNum == 2){//左边
                    self.left_player.setCoin(data[i].coins);
                }
            }
        }
    },
    onTurnCallLord(event){
        var self = this;
        console.log("轮到谁叫地主---");
        self.gameState = config.gameState.ST_GAME_CallLord;

        if(this.watingStart)
            this.watingStart.hideNode();

        if(self.opratShowCard){
            self.opratShowCard.close();
            self.opratShowCard = null;
        }
        if(self.opratDouble){
            self.opratDouble.close();
            self.opratDouble = null;
        }

        var response = event.getUserData();
        var seatNum = config.getPlayerSeatNum(self.mySeatId,response.data.callId);
        if(seatNum == 1){//自己
            var btn1Func = function(){
                GameNetMgr.sendRequest("Game","callLord",1);
                if(self.myOpratShow){
                    self.myOpratShow.close();
                    // self.myOpratShow = null;
                }
            }
            var btn2Func = function(){
                GameNetMgr.sendRequest("Game","callLord",2);
                if(self.myOpratShow){
                    self.myOpratShow.close();
                    // self.myOpratShow = null;
                }
            }
            self.showCallLord(config.CallLordTimeout,btn1Func,btn2Func,config.opratType.callLoad);
            self.playerme_.hideHint();
        }else if(seatNum == 0){//右边
            self.right_player.showClock(config.CallLordTimeout);
            self.right_player.hideHint();
        }else if(seatNum == 2){//左边
            self.left_player.showClock(config.CallLordTimeout);
            self.left_player.hideHint();
        }
    },
    onCallLord(event){
        var self = this;
        console.log("玩家叫地主---");
        var response = event.getUserData();
        var seatId = response["data"]["beLordId"];
        var status = response["data"]["beLordInfo"];  // 1叫 2不叫
        var seatNum = config.getPlayerSeatNum(self.mySeatId,seatId);
        if(seatNum == 1){//自己
            var gender = self.playerme_.getGender();
            if(status == 1){
                self.playerme_.showHint(config.hintType.callLoad);
                cc.vv.audioMgr.playCardsEffect(gender,"jiaodizhu");
            }else{
                self.playerme_.showHint(config.hintType.callLoadNo);
                cc.vv.audioMgr.playCardsEffect(gender,"bujiao");
            }
        }else if(seatNum == 0){//右边
            self.right_player.hideClock();
            var gender = self.right_player.getGender();
            if(status == 1){
                self.right_player.showHint(config.hintType.callLoad);
                cc.vv.audioMgr.playCardsEffect(gender,"jiaodizhu");
            }else{
                self.right_player.showHint(config.hintType.callLoadNo);
                cc.vv.audioMgr.playCardsEffect(gender,"bujiao");
            }
        }else if(seatNum == 2){//左边
            self.left_player.hideClock();
            var gender = self.left_player.getGender();
            if(status == 1){
                self.left_player.showHint(config.hintType.callLoad);
                cc.vv.audioMgr.playCardsEffect(gender,"jiaodizhu");
            }else{
                self.left_player.showHint(config.hintType.callLoadNo);
                cc.vv.audioMgr.playCardsEffect(gender,"bujiao");
            }
        }
    },
    onTurnGrabLord(event){
        var self = this;
        console.log("轮到谁抢地主---");

        var response = event.getUserData();
        var callId = response["data"]["callId"]
        var seatNum = config.getPlayerSeatNum(self.mySeatId,callId);
        if(seatNum == 1){//自己
            var btn1Func = function(){
                GameNetMgr.sendRequest("Game","grabLord",1);
            }
            var btn2Func = function(){
                GameNetMgr.sendRequest("Game","grabLord",2);
            }
            self.showCallLord(config.CallLordTimeout,btn1Func,btn2Func,config.opratType.grabLoad);
            self.playerme_.hideHint();
        }else if(seatNum == 0){//右边
            self.right_player.showClock(config.CallLordTimeout);
            self.right_player.hideHint();
        }else if(seatNum == 2){//左边
            self.left_player.showClock(config.CallLordTimeout);
            self.left_player.hideHint();
        }
    },
    onGrabLord(event){
        var self = this;
        console.log("玩家抢地主---");
        var response = event.getUserData();
        var seatId = response["data"]["grabLordId"]
        var status = response["data"]["grabLordInfo"]
        var seatNum = config.getPlayerSeatNum(self.mySeatId,seatId);
        if(seatNum == 1){//自己
            var gender = self.playerme_.getGender();
            if(status == 1){
                self.playerme_.showHint(config.hintType.grabLoad);
                cc.vv.audioMgr.playCardsEffect(gender,"qiangdizhu");
            }else{
                self.playerme_.showHint(config.hintType.grabLoadNo);
                cc.vv.audioMgr.playCardsEffect(gender,"buqiang");
            }
        }else if(seatNum == 0){//右边
            self.right_player.hideClock();
            var gender = self.right_player.getGender();
            if(status == 1){
                self.right_player.showHint(config.hintType.grabLoad);
                cc.vv.audioMgr.playCardsEffect(gender,"qiangdizhu");
            }else{
                self.right_player.showHint(config.hintType.grabLoadNo);
                cc.vv.audioMgr.playCardsEffect(gender,"buqiang");
            }
        }else if(seatNum == 2){//左边
            self.left_player.hideClock();
            var gender = self.left_player.getGender();
            if(status == 1){
                self.left_player.showHint(config.hintType.grabLoad);
                cc.vv.audioMgr.playCardsEffect(gender,"qiangdizhu");
            }else{
                self.left_player.showHint(config.hintType.grabLoadNo);
                cc.vv.audioMgr.playCardsEffect(gender,"buqiang");
            }
        }
    },
    onCallLordOver(event){
        var self = this;
        console.log("叫地主结束---");
        self.gameState = config.gameState.ST_GAME_CallLordOver;
        // self.playerme_.hideHint();
        // self.left_player.hideHint();
        // self.right_player.hideHint();

        var hideHint = function(){
            self.playerme_.hideHint();
            self.left_player.hideHint();
            self.right_player.hideHint();
        }
        setTimeout(hideHint,500);
    
        var response = event.getUserData();
        var lordId = response["data"]["lordId"];
        var cards = response["data"]["lordCard"];
        var times = response["data"]["lordBonus"];
        self.setTable3Card(cards);
        self.setNodeRate(times);

        var noteCards = response.data.noteCards;
        PlayerDetailModel.setJpqData(noteCards);

        self.loadSeatId = lordId; //地主的id

        var seatNum = config.getPlayerSeatNum(self.mySeatId,lordId);
        if(seatNum == 1){//自己
            if(response.data.myCard&&response.data.myCard.length == 20){ //插3张牌
                if(self.myPokerNode.length > 0){ //先清理桌上的牌
                    for(var i = 0; i < self.myPokerNode.length; i++){
                        self.myPokerNode[i].getComponent(PokerControl).node.removeFromParent();
                    }
                    self.myPokerNode = [];
                }
                self.myPokerData = [];
                
                self.playerme_.setCardCount(20);
                self.playerme_.setLandlord(true);
                self.myPokerData = CardUtil.serverCardsToClient(response.data.myCard);
                self.myPokerNode = self.playerme_.initMyCards(self.myPokerData,self.myPokerNode,self.scene,self.sceneWidth);
            }
            self.myHandCards = response.data.myCard;
        }else if(seatNum == 0){//右边
            self.right_player.setCardCount(20);
            self.right_player.setLandlord(true);
            if(response.data.lordShowCard&&response.data.lordShowCard.length == 20){
                if(self.rightPokerNode.length > 0){ //先清理桌上的牌
                    for(var i = 0; i < self.rightPokerNode.length; i++){
                        self.rightPokerNode[i].getComponent(PokerControl).node.removeFromParent();
                    }
                    self.rightPokerNode = [];
                }
                self.rightPokerData = [];
                self.rightPokerData = CardUtil.serverCardsToClient(response.data.lordShowCard);
                self.right_player.playerRightShowCard(self.rightPokerData,self.rightPokerNode,self.pokerLayerRight,self.sceneWidth);
            }

        }else if(seatNum == 2){//左边
            self.left_player.setCardCount(20);
            self.left_player.setLandlord(true);
            if(response.data.lordShowCard&&response.data.lordShowCard.length == 20){
                if(self.leftPokerNode.length > 0){ //先清理桌上的牌
                    for(var i = 0; i < self.leftPokerNode.length; i++){
                        self.leftPokerNode[i].getComponent(PokerControl).node.removeFromParent();
                    }
                    self.leftPokerNode = [];
                }
                self.leftPokerData = [];
                self.leftPokerData = CardUtil.serverCardsToClient(response.data.lordShowCard);
                self.left_player.playerLeftShowCard(self.leftPokerData,self.leftPokerNode,self.pokerLayerLeft,self.sceneWidth);
            }
        }

        //记牌器开启
        var propItems = PlayerDetailModel.getPropItems();
        self.myHandCards = CardUtil.clientCardsToServer(self.myPokerData);
        if (propItems["5"] && propItems["5"] == 1){
            var _cards = CardUtil.getNodeCards(self.myHandCards);
            if(_cards)
                self.showJPQ(_cards);
        }
    },
    onCanDoubleResult(event){
        var self = this;
        console.log("通知是否可以加倍---");
        var response = event.getUserData();
        var candouble = response.data.can_double;

        self.gameState = config.gameState.ST_GAME_Double;

        if(candouble&&candouble == 1){
            var btn1Func = function(){
                self.playerme_.showHint(config.hintType.waitingDouble);
                GameNetMgr.sendRequest("Game","addRatio");
            }
            var btn2Func = function(){
                self.playerme_.showHint(config.hintType.waitingDouble);
                cc.vv.audioMgr.playCardsEffect(self.playerme_.getGender(),"jiabeiNo");
            }
            var args = {};
            args.arg1 = btn1Func;
            args.arg2 = btn2Func;

            cc.loader.loadRes("prefab/opratDouble", function (err, prefab) {
                if (err) {
                    console.log(err);
                    return;
                }
                var newNode = cc.instantiate(prefab);
                cc.director.getScene().addChild(newNode,999);
                self.opratDouble = newNode.getComponent(require("opratDoubleControl"));
                self.opratDouble.show(args);
            });
        }
    },
    onTurnSendCard(event){
        var self = this;
        console.log("轮到谁出牌---");
        self.gameState = config.gameState.ST_GAME_OutCard;

        if(self.playerme_.getShowHintType()==config.hintType.waitingDouble){
            self.playerme_.hideHint();
        }

        var response = event.getUserData();
        var seatId = response["data"]["callId"];
        var seatNum = config.getPlayerSeatNum(self.mySeatId,seatId);
        if(seatNum == 1){//自己
            if(self.myOpratShow){
                self.myOpratShow.close()
                // self.myOpratShow = null;
            }
            // self.onMyOutCard();
            self.playerme_.hideHint();
            self.playerme_.clearTableCard(self.dispatchCard);

            // console.log("myCardCount:"+self.myHandCards.length);
            // console.log(self.myHandCards);

            if (self.myHandCards.length == 1){ //只剩最后一张牌，自动出牌
                console.log("最后一张牌了");
                if(self.mySeatId == self.preSeatId){
                    GameNetMgr.sendRequest("Game","sendCard",self.myHandCards);
                    return;
                }

                if(self.preSendCards&&self.preSendCards.length == 1){
                    var preCards = self.preSendCards[0];
                    var card = self.myHandCards[0];
                    var sub = CardUtil.convertCardToClient(card).showTxt - CardUtil.convertCardToClient(preCards).showTxt;
                    console.log("sub = "+sub);
                    if(sub>0){
                        GameNetMgr.sendRequest("Game","sendCard",self.myHandCards);
                    }else{
                        GameNetMgr.sendRequest("Game","giveupSendCard");
                    }
                }else{
                    GameNetMgr.sendRequest("Game","giveupSendCard");
                }
            }else{
                self.onMyOutCard();
            }

            // self.playerme_.neatenPoker(self.myPokerNode,config.seatPos.center,self.sceneWidth);
        }else if(seatNum == 0){//右边
            self.right_player.showClock(config.SendCardTimeout);
            self.right_player.hideHint();
            self.right_player.clearTableCard(self.rightDispatchCard);
            if(self.myOpratShow){
                self.myOpratShow.close()
                // self.myOpratShow = null;
            }
        }else if(seatNum == 2){//左边
            self.left_player.showClock(config.SendCardTimeout);
            self.left_player.hideHint();
            self.left_player.clearTableCard(self.leftDispatchCard);

            if(self.myOpratShow){
                self.myOpratShow.close()
                // self.myOpratShow = null;
            }
        }
    },
    onPlayerDelegated(event){
        var self = this;
        console.log("用户托管---");
        var response = event.getUserData();
        var seatId = response["data"]["trustId"];
        var giveup = response["data"]["giveup"]; //是否断线  0在线 1在线
        var seatNum = config.getPlayerSeatNum(self.mySeatId,seatId);

        console.log("用户托管---"+seatNum);
        if(seatNum == 1){//自己
            if(!self.playerme_.getDelegated()){
                self.showCancelDelegate();
                self.playerme_.setDelegated(true);
            }
        }else if(seatNum == 0){//右边    
            self.right_player.setDelegated(true); 
        }else if(seatNum == 2){//左边
            self.left_player.setDelegated(true);
        }
    },
    onPlayerCancelDelegate(event){
        var self = this;
        console.log("用户取消托管---");
        var response = event.getUserData();
        var seatId = response["data"]["trustId"];
        // var giveup = response["data"]["giveup"]; //是否断线  0在线 1在线
        var seatNum = config.getPlayerSeatNum(self.mySeatId,seatId);

        console.log("用户取消托管---"+seatNum);
        if(seatNum == 1){//自己
            
        }else if(seatNum == 0){//右边
            self.right_player.setDelegated(false); 
        }else if(seatNum == 2){//左边
            self.left_player.setDelegated(false); 
        }
    },
    onPlayerSendCard(event){
        var self = this;
        console.log("用户出牌---");
        self.gameState = config.gameState.ST_GAME_OutCard;

        var response = event.getUserData();
        var seatId = response["data"]["callId"];
        var seatNum = config.getPlayerSeatNum(self.mySeatId,seatId);
        var noteCards = response.data.noteCards;
        PlayerDetailModel.setJpqData(noteCards);
        var curCardType = response["data"]["cardType"];
        
        var jokto = [];
        if(config.joker!=""){
            jokto = response.data.jokto;
        }

        var gender = 1;
        if(seatNum == 1){//自己
            self.playerme_.setCurrentCards(response["data"]["sendCards"]);
            self.mySendCards(response["data"]["sendCards"],jokto);
            var outCardsNum = response["data"]["sendCards"].length;
            var cardNum =  self.playerme_.getCardCount();
            if(cardNum >= outCardsNum)
                self.playerme_.setCardCount(cardNum-outCardsNum);

            if(self.myOpratShow){
                self.myOpratShow.close()
                // self.myOpratShow = null;
            }
            gender = self.playerme_.getGender();
        }else if(seatNum == 0){//右边
            gender = self.right_player.getGender();
            self.right_player.setCurrentCards(response["data"]["sendCards"]);
            self.rightSendCards(response["data"]["sendCards"],null,self.right_player.getOpenHandCards(),jokto);
            var outCardsNum = response["data"]["sendCards"].length;
            var cardNum =  self.right_player.getCardCount();
            var cardCount = cardNum-outCardsNum;
            if(cardCount >= 0){
                self.right_player.setCardCount(cardCount);
                if(cardCount == 2){
                    self.right_player.setNode_alarmShow(true);
                    cc.vv.audioMgr.playCardsEffect(gender, "baojing2");
                }else if(cardCount == 1){
                    self.right_player.setNode_alarmShow(true);
                    cc.vv.audioMgr.playCardsEffect(gender, "baojing1");
                }
            }
            self.right_player.hideClock();
        }else if(seatNum == 2){//左边
            gender = self.left_player.getGender();
            self.left_player.setCurrentCards(response["data"]["sendCards"]);
            self.leftSendCards(response["data"]["sendCards"],null,self.left_player.getOpenHandCards(),jokto);
            var outCardsNum = response["data"]["sendCards"].length;
            var cardNum =  self.left_player.getCardCount();
            var cardCount = cardNum-outCardsNum;
            if(cardCount >= 0){
                self.left_player.setCardCount(cardCount);
                if(cardCount == 2){
                    self.left_player.setNode_alarmShow(true);
                    cc.vv.audioMgr.playCardsEffect(gender, "baojing2");
                }else if(cardCount == 1){
                    self.left_player.setNode_alarmShow(true);
                    cc.vv.audioMgr.playCardsEffect(gender, "baojing1");
                }
            }  
            self.left_player.hideClock();
        }
        // self.preSendCards = response["data"]["sendCards"];//上次出牌
        // self.preSeatId = seatId;//上次玩家出牌id

        var curSendCards = response["data"]["sendCards"];//当前出牌
        var curSeatId = seatId;//当前玩家出牌id
        // console.log(response["data"]["sendCards"]);
        var isShowCardType = false;
        if(curSendCards&&curSendCards.length>0){
            var cardstype = curCardType;
            if(cardstype == config.CardType.StraightThree||cardstype == config.CardType.StraightThreePlusSingle ||
                cardstype == config.CardType.StraightThreePlusPair){
                //飞机
                dialogManager.showAnimFeiJi();
            }else if(cardstype == config.CardType.DoubleKing){
                //火箭
                dialogManager.showAnimHuoJian();
                self.animShakeNode();
            }else if(cardstype == config.CardType.Bomb || cardstype == config.CardType.SoftBomb || 
                cardstype == config.CardType.LazarilloBomb){
                //炸弹
                dialogManager.showAnimZhaDan();
                self.animShakeNode();
            }else if(cardstype == config.CardType.Straight){
                //顺子
                isShowCardType = true;
            }else if(cardstype == config.CardType.StraightDouble){
                //连队
                isShowCardType = true;
            }
            if(isShowCardType){
                if(seatNum == 1){//自己
                    self.showMyCardtype(cardstype);
                }else if(seatNum == 0){//右边
                    self.showRightCardtype(cardstype);
                }else if(seatNum == 2){//左边
                    self.showLeftCardtype(cardstype);
                }
            }
        
            cc.vv.audioMgr.playCardsEffect(gender,cardstype,curSendCards);
        }

        self.preSendCards = response["data"]["sendCards"];//上次出牌
        self.preSeatId = seatId;//上次玩家出牌id
        self.preCardType = curCardType;
        if(config.joker!=""){
            self.prejokto = jokto;
        }

        //记牌器开启
        var propItems = PlayerDetailModel.getPropItems();
        self.myHandCards = CardUtil.clientCardsToServer(self.myPokerData);
        if (propItems["5"] && propItems["5"] == 1){
            var _cards = CardUtil.getNodeCards(self.myHandCards);
            if(_cards)
                self.showJPQ(_cards);
        }
    },
    onPlayerNotSend(event){
        var self = this;
        console.log("用户不出牌---");
        self.gameState = config.gameState.ST_GAME_OutCard;

        var response = event.getUserData();
        var seatId = response["data"]["callId"];
        var seatNum = config.getPlayerSeatNum(self.mySeatId,seatId);
        if(seatNum == 1){//自己
            self.playerme_.showHint(config.hintType.dont);
            if(self.myOpratShow){
                self.myOpratShow.close()
                // self.myOpratShow = null;
            }
            var gender = self.playerme_.getGender();
            cc.vv.audioMgr.playCardsEffect(gender,"buyao");
        }else if(seatNum == 0){//右边
            self.right_player.showHint(config.hintType.dont);
            self.right_player.hideClock();
            var gender = self.right_player.getGender();
            cc.vv.audioMgr.playCardsEffect(gender,"buyao");
        }else if(seatNum == 2){//左边
            self.left_player.showHint(config.hintType.dont);
            self.left_player.hideClock();
            var gender = self.left_player.getGender();
            cc.vv.audioMgr.playCardsEffect(gender,"buyao");
        }
    },
    onPlayerShowCard(event){
        var self = this;
        console.log("用户明牌---");
        var response = event.getUserData();
        var seatId = response["data"]["showCardId"];
        var showCardInfo = response["data"]["showCardInfo"];
        var seatNum = config.getPlayerSeatNum(self.mySeatId,seatId);
        console.log("seatNum:"+seatNum);
        if(seatNum == 1){//自己
            self.playerme_.setOpenHandCards(true);
            if(self.myPokerNode.length>0){
                self.myPokerNode[self.myPokerNode.length-1].getComponent(PokerControl).setCardShow(true);
            }
            var gender = self.playerme_.getGender();
            cc.vv.audioMgr.playCardsEffect(gender,"mingpai");
        }else if(seatNum == 0){//右边
            self.right_player.setOpenHandCards(true);
            self.rightPokerData = CardUtil.serverCardsToClient(showCardInfo);
            self.right_player.playerRightShowCard(self.rightPokerData,self.rightPokerNode,self.pokerLayerRight,self.sceneWidth);
            var gender = self.right_player.getGender();
            cc.vv.audioMgr.playCardsEffect(gender,"mingpai");
        }else if(seatNum == 2){//左边
            self.left_player.setOpenHandCards(true);
            self.leftPokerData = CardUtil.serverCardsToClient(showCardInfo);
            self.left_player.playerLeftShowCard(self.leftPokerData,self.leftPokerNode,self.pokerLayerLeft,self.sceneWidth);
            var gender = self.left_player.getGender();
            cc.vv.audioMgr.playCardsEffect(gender,"mingpai");
        }
    },
    onGameComplete(event){
        var self = this;
        console.log("本局结束---");
        self.gameState = config.gameState.ST_GAME_BALANCE;
        var response = event.getUserData();
        // self.showGameResult(response);
        // cc.vv.audioMgr.stopMusic();

        console.log(response.data);

        if(response.data.spring == 1 || response.data.boorSpring == 1){
            //春天
            dialogManager.showAnimChunTian();
        }

        var callFunc = cc.callFunc(function(){
            self.showGameResult(response);
            // self.clearTable();
        });
        var delay = cc.delayTime(2.0);
        this.node.runAction(cc.sequence(delay,callFunc));

        if(this.CancelDelegate){
            console.log("//清理托管弹框");
            this.CancelDelegate.close();
            // this.CancelDelegate = null;
        }

        //实现玩家剩余牌
        for(var i = 0;i<3;i++){
            var seatNum = config.getPlayerSeatNum(self.mySeatId,i);
            var showCardInfo = response.data.cards[i];
            if(seatNum == 1){//自己
            }else if(seatNum == 0 && !self.right_player.getOpenHandCards()&&showCardInfo.length>0){//右边
                // self.right_player.setOpenHandCards(true);
                self.rightPokerData = CardUtil.serverCardsToClient(showCardInfo);
                self.right_player.playerRightShowCard(self.rightPokerData,self.rightPokerNode,self.pokerLayerRight,self.sceneWidth);
            }else if(seatNum == 2 && !self.left_player.getOpenHandCards()&&showCardInfo.length>0){//左边
                // self.left_player.setOpenHandCards(true);
                self.leftPokerData = CardUtil.serverCardsToClient(showCardInfo);
                self.left_player.playerLeftShowCard(self.leftPokerData,self.leftPokerNode,self.pokerLayerLeft,self.sceneWidth);
            }
        }

    },
    onTableUserExit(event){
        var self = this;
        console.log("有用户退出 通知桌上的玩家重新进入队列---");
        self.gameState = config.gameState.ST_GAME_WAIT_NEXTROUND;
        // var response = event.getUserData();
        // self.clearTable();

        if(self.LazarilloPokerSelected){
            self.LazarilloPokerSelected.closeClick();
            self.LazarilloPokerSelected = null;
        }
    },
    onInvalidCardNum(event){
        var self = this;
        console.log("出的牌不够大 [非法出牌]---");
        var response = event.getUserData();
        if(self.myOpratShow){
            self.myOpratShow.chupaiClick(-1);
        }
    },  
    onInvalidCardType(event){
        var self = this;
        console.log("出牌有非法数据 [非法出牌]---");
        if(self.myOpratShow){
            self.myOpratShow.chupaiClick(-1);
        }
    },
    onSayToTableInfo(event){
        var self = this;
        console.log("聊天信息---");
        var response = event.getUserData();
        var seatId = response["data"]["sayId"];
        var seatNum = config.getPlayerSeatNum(self.mySeatId,seatId);
        var word = response["data"]["word"];
        if(seatNum == 1){//自己
            this.showMyChat(word);
            cc.vv.audioMgr.playSay(self.playerme_.getGender(),word);
        }else if(seatNum == 0){//右边
            this.showRightChat(word);
            cc.vv.audioMgr.playSay(self.right_player.getGender(),word);
        }else if(seatNum == 2){//左边
            this.showLeftChat(word);
            cc.vv.audioMgr.playSay(self.left_player.getGender(),word);
        }
    },
    onReconnectionData(event){
        console.log("短线重连-------");
        config.stopOnMassage = false;
        var self = this;
        var response = event.getUserData();
        console.log(response)
    
        var sendReq = function(){
            var fn = function(){
                if(config.jpqShareSucss){
                    GameNetMgr.sendRequest("System","ShareWxRes",4);
                }else if(config.leQuanShareSucss){
                    GameNetMgr.sendRequest("System","ShareWxRes",5);
                }else if(config.leDouShareSucss){
                    GameNetMgr.sendRequest("System","ShareWxRes",3);
                    GameNetMgr.sendRequest("Game", "openReliefTip", {});
                }
            }
            setTimeout(fn,1000);
        }
        sendReq();

        if(response.data.act == "AUTO_CALL_LORD"||response.data.act == "TURN_CALL_LORD"){
            self.gameState = config.gameState.ST_GAME_CallLord;
        }else if(response.data.act == "AUTO_GRAB_LORD"||response.data.act == "TURN_GRAB_LORD"){
            self.gameState = config.gameState.ST_GAME_GrabLord;
        }else if(response.data.act == "AUTO_PLAY_CARD"||response.data.act == "TURN_PLAY_CARD"){
            self.gameState = config.gameState.ST_GAME_OutCard;
        }

        if(response.data.act == "JOIN_TRIO" && self.gameState == config.gameState.ST_GAME_PREPARE){
            if(self.watingStart)
                self.watingStart.showNode();
            return;
        }

        if(response.data.act == "WAIT_TOTAL_DONE" && self.gameState < config.gameState.ST_GAME_BALANCE){//牌局结束等待下一轮
            dialogManager.showCommonDialog("温馨提示","当前牌局已经结束",function(){
                config.IsContinueGaming = 0;
                PlayerDetailModel.continueRoomId = 0;
                self.preloadNextScene();
            });
            return;
        }
        if(response.data.act == "WAIT_TOTAL_DONE"){
            return;
        }
        self.clearTable();

        config.joker = response.data.joker;
        var jokto = response.data.lastJokto;

        if(config.joker!=""){
            self.prejokto = jokto;
        }
    
        var players = {};
        players.lastCall = response.data.lastCall;
        players.lastCards = response.data.lastCards; //noteCards
        players.noteCards = response.data.noteCards;
        players.lordId = response.data.lordId;
        players.noteCards = response.data.lordCard;
        players.task = response.data.task;
        players.rate = response.data.rate;

        self.preSeatId = players.lastCall;

        if(response.data.rate){
            self.node_tableTimes.string = "" + response.data.rate;
        }

        // 任务
        // self.node_taskbg.enabled = true;
        var table_task = players.task.name;
        if (players.task.coins&&players.task.coins!="0"){
            table_task = table_task + " 奖"+players.task.coins+"乐豆";
        }else if(players.task.lottery&&players.task.lottery!="0"){
            table_task = table_task + " 奖"+players.task.lottery+"抽奖数";
        }else if(players.task.tip){
            table_task = table_task + players.task.tip;
        }else if(players.task.coupon){
            table_task = table_task + " 奖"+players.task.coupon+"乐劵";
            this.taskRewardNum = players.task.coupon;
        }
        if(table_task){
            self.node_taskbg.enabled = true;
            self.node_taskName.string = table_task;
            var w = self.node_taskName.node.width;
            self.node_taskbg.node.width = w+70;
        }
        

        players.act = response.data.act;//操作 TURN_CALL_LORD 叫地主 TURN_GRAB_LORD 抢地主 TURN_PLAY_CARD 出牌
        players.time = response.data.time;//操作倒计时
        players.turnSeat = response.data.turnSeat;//操作玩家
        var turnSeatNum = config.getPlayerSeatNum(response.data.mySeatId,players.turnSeat);

        players.data = [];
        for(var i = 0;i<3;i++){
            var player = {};
            player.cards = response["data"]["seat"+i+"cards"];
            player.info = response["data"]["seat"+i+"info"];
            player.show = response["data"]["seat"+i+"show"];
            player.trust = response["data"]["seat"+i+"trust"];//托管
            players.data.push(player);
            self.nicknames[i] = player.info.nick;
        }
        console.log("players-------");
        console.log(players);

        self.preSendCards = response.data.lastCards;//上架出牌
        self.preSeatId = response.data.lastCall;//上架出牌id
        
        self.leftPlayer.active = true;
        self.rightPlayer.active = true;

        self.mySeatId = response.data.mySeatId;
        if(players.lordId!=4){
            self.loadSeatId = players.lordId;
            if(config.joker!="")
                self.setLazarillo_poker(config.joker);
            self.setTable3Card(response.data.lordCard);
            var times = response["data"]["lordBouns"];
            self.setNodeRate(times);
        }

        for(var i=0;i<3;i++){
            var seatNum = config.getPlayerSeatNum(self.mySeatId,i);
            var cards = players.data[i].cards;
            var show = players.data[i].show;
            var info = players.data[i].info;
            var trust = players.data[i].trust;
            if(seatNum == 1){//自己
                if(show == 1){//明牌
                }else{  
                }
                if(self.myPokerNode.length > 0){ //先清理桌上的牌
                    for(var i = 0; i < self.myPokerNode.length; i++){
                        self.myPokerNode[i].getComponent(PokerControl).node.removeFromParent();
                    }
                    self.myPokerNode = [];
                }
                self.myPokerData = [];
                self.playerme_.setCardCount(cards.length);
                self.playerme_.setOpenHandCards(show==1);
                self.playerme_.setLandlord(players.lordId == i);
                self.myPokerData = CardUtil.serverCardsToClient(cards);
                self.myPokerNode = self.playerme_.initMyCards(self.myPokerData,self.myPokerNode,self.scene,self.sceneWidth);
                
                self.myHandCards = cards;

                var parm = {};
                parm.nickname = info.nick;
                parm.coin = info.coins;
                parm.lequan = info.coupon;
                parm.wechatImg = info.img;
                parm.cardCount = cards.length;
                parm.seatId = info.seatId;
                parm.play = info.play;//游戏总局数
                parm.win = info.win;//胜利局数
                parm.uid = info.uid;
                parm.sex = info.sex;
                self.playerme_.continueInfo(parm);
                if(trust != 0){
                    console.log("自己托管中。。。。")
                    self.playerme_.setDelegated(true);
                    if(self.playerme_.getDelegated()){
                        console.log("自己托管中。。。。1111")
                        self.showCancelDelegate();
                        // self.playerme_.setDelegated(true);
                    }
                }
            }else if(seatNum == 0){//右边
                if(show == 1){//明牌
                    if(self.rightPokerNode.length > 0){ //先清理桌上的牌
                        for(var i = 0; i < self.rightPokerNode.length; i++){
                            self.rightPokerNode[i].getComponent(PokerControl).node.removeFromParent();
                        }
                        self.rightPokerNode = [];
                    }
                    self.rightPokerData = [];
                    self.rightPokerData = CardUtil.serverCardsToClient(cards);
                    self.right_player.playerRightShowCard(self.rightPokerData,self.rightPokerNode,self.pokerLayerRight,self.sceneWidth);
                }else{  
                }
                self.right_player.setOpenHandCards(show==1);
                self.right_player.setLandlord(players.lordId == i);
                // self.right_player.setMySeatId();

                var parm = {};
                parm.nickname = info.nick;
                parm.coin = info.coins;
                parm.lequan = info.coupon;
                parm.wechatImg = info.img;
                parm.cardCount = cards.length;
                parm.seatId = info.seatId;
                parm.play = info.play;//游戏总局数
                parm.win = info.win;//胜利局数
                parm.uid = info.uid;
                parm.sex = info.sex;
                self.right_player.continueInfo(parm);

                if(trust != 0){
                    self.right_player.setDelegated(true);
                }
            }else if(seatNum == 2){//左边
                if(show == 1){//明牌
                    if(self.leftPokerNode.length > 0){ //先清理桌上的牌
                        for(var i = 0; i < self.leftPokerNode.length; i++){
                            self.leftPokerNode[i].getComponent(PokerControl).node.removeFromParent();
                        }
                        self.leftPokerNode = [];
                    }
                    self.leftPokerData = [];
                    self.leftPokerData = CardUtil.serverCardsToClient(cards);
                    self.left_player.playerLeftShowCard(self.leftPokerData,self.leftPokerNode,self.pokerLayerLeft,self.sceneWidth);
                }else{  
                }
                self.left_player.setOpenHandCards(show==1);
                self.left_player.setLandlord(players.lordId == i);
                var parm = {};
                parm.nickname = info.nick;
                parm.coin = info.coins;
                parm.lequan = info.coupon;
                parm.wechatImg = info.img;
                parm.cardCount = cards.length;
                parm.seatId = info.seatId;
                parm.play = info.play;//游戏总局数
                parm.win = info.win;//胜利局数
                parm.uid = info.uid;
                parm.sex = info.sex;
                self.left_player.continueInfo(parm);

                if(trust != 0){
                    self.left_player.setDelegated(true);
                }
            }
        }
        //显示上家出牌
        var preSeatNum = config.getPlayerSeatNum(response.data.mySeatId,self.preSeatId);
        if(preSeatNum == 1){//自己
            self.playerme_.setCurrentCards(self.preSendCards);
            self.mySendCards(self.preSendCards,jokto);
        }else if(preSeatNum == 0){//右边
            self.right_player.setCurrentCards(self.preSendCards);
            self.rightSendCards(self.preSendCards,null,self.right_player.getOpenHandCards(),jokto);
        }else if(preSeatNum == 2){//左边
            self.left_player.setCurrentCards(self.preSendCards);
            self.leftSendCards(self.preSendCards,null,self.left_player.getOpenHandCards(),jokto);
        }

        //弹出操作倒计时
        if(turnSeatNum == 1){
            if(players.act == "AUTO_CALL_LORD"){
                var btn1Func = function(){
                    if(self.myOpratCall){ 
                        self.myOpratCall.close();
                        self.myOpratCall = null;
                    }
                    GameNetMgr.sendRequest("Game","callLord",1);
                }
                var btn2Func = function(){
                    if(self.myOpratCall){
                        self.myOpratCall.close();
                        self.myOpratCall = null;
                    }
                    GameNetMgr.sendRequest("Game","callLord",2);
                }
                self.showCallLord(players.time,btn1Func,btn2Func,config.opratType.callLoad);
                self.playerme_.hideHint();
            }else if(players.act == "AUTO_GRAB_LORD"){
                var btn1Func = function(){
                    if(self.myOpratCall){ 
                        self.myOpratCall.close();
                        self.myOpratCall = null;
                    }
                    GameNetMgr.sendRequest("Game","grabLord",1);
                }
                var btn2Func = function(){
                    if(self.myOpratCall){ 
                        self.myOpratCall.close();
                        self.myOpratCall = null;
                    }
                    GameNetMgr.sendRequest("Game","grabLord",2);
                }
                self.showCallLord(players.time,btn1Func,btn2Func,config.opratType.grabLoad);
                self.playerme_.hideHint();
            }else if(players.act == "AUTO_PLAY_CARD"){
                if(self.myOpratShow){
                    self.myOpratShow.close()
                    // self.myOpratShow = null;
                }
                self.onMyOutCard(players.time);//players.time 23
                self.playerme_.hideHint();
                self.playerme_.clearTableCard(self.dispatchCard);
            }
        }else if(turnSeatNum == 0){//右边
            self.right_player.showClock(players.time);
            self.right_player.hideHint();
            self.right_player.clearTableCard(self.rightDispatchCard);
        }else if(turnSeatNum == 2){//左边
            self.left_player.showClock(players.time);
            self.left_player.hideHint();
            self.left_player.clearTableCard(self.leftDispatchCard);
        }
    },
    onPokerTask(event){
        console.log("触发牌局任务-------");
        var self = this;
        var response = event.getUserData();
        self.node_taskbg.enabled = true;

        this.taskComplete = false;

        if(response.data&&response.data.is_done == 0){
            var table_task = response.data.table_task;
            if (response.data.coins){
                table_task = table_task + " 奖"+response.data.coins+"乐豆";
            }else if(response.data.lottery){
                table_task = table_task + " 奖"+response.data.lottery+"抽奖数";
            }else if(response.data.tip){
                table_task = table_task + response.data.tip;
            }else{
                table_task = table_task + " 奖"+response.data.coupon+"乐劵";
                this.taskRewardNum = response.data.coupon;
            }
            self.node_taskName.string = table_task;
            var w = self.node_taskName.node.width;
            self.node_taskbg.node.width = w+70;   
        }else{
            this.taskComplete = true;
        }
    },
    onOpenRechargeTipResult(event){
        var self = this;
        var response = event.getUserData();
        console.log(response);
        var trial_count = response.data.trial_count;
        var trial_cooldown = response.data.trial_cooldown;
        var content = "";

        var callFunc = cc.callFunc(function(){
            var click = function(){
                console.log("点击了领取救济按钮");
                if(trial_cooldown == 0){
                    GameNetMgr.sendRequest("Game", "openReliefTip", {});
                }else{
                    self.preloadNextScene();
                }
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
                dialogManager.showCommonDialog("温馨提示",content,function(){
                    self.preloadNextScene();
                });
            }
        });
        var delay = cc.delayTime(0.5);//延迟0.5秒弹出
        this.node.runAction(cc.sequence(delay,callFunc));  
    },
    onRepeatLogin(event){
        console.log("您的账号已经在其他地方登陆！");
        var self = this;
        var data = event.getUserData();
        console.log(data);
        dialogManager.showCommonDialog("提示","您的账号已经在其他地方登陆！",function(){
            self.isShow = false;
            cc.vv.audioMgr.stopMusic();
            cc.director.loadScene("LoadingScene");
        });
    },
    onRefreshDataResult(event){
        console.log("刷新用户信息数据222------");
        var self = this;
        var data = event.getUserData();
        console.log(data);

        var payload = data;
        // var model = app:getModel("PlayerDetailModel")
        //用户乐豆数
        if (payload.data && payload.data.coins){
            PlayerDetailModel.setCoin(payload.data.coins)
            // self.setLeDou(PlayerDetailModel.getCoin());
            self.playerme_.setCoin(payload.data.coins);

            //分享获取乐豆
            if(config.leDouShareSucss){
                config.leDouShareSucss = false;
                var list = [];
                var args = {
                    arg1:"ledou",
                    arg2:1000,
                }
                list.push(args);
                dialogManager.showAnimGetProp(list);
            } 
        }
        //用户奖券数
        if (payload.data && payload.data.coupon){
            PlayerDetailModel.setCoupon(payload.data.coupon)
            // self.setLuQuan(PlayerDetailModel.getCoupon());
            self.playerme_.setLeQuan(payload.data.coupon);
        }
        //用户抽奖数
        if (payload.data && payload.data.lottery){
            PlayerDetailModel.setLottery(payload.data.lottery)
        }
        //未读邮件数
        if (payload.data && payload.data.mail_unread){
            PlayerDetailModel.setMailUnread(payload.data.mail_unread)
        }
        //未领取任务数
        if (payload.data && payload.data.weichatgame_task_unaward){
            PlayerDetailModel.setTaskUnReward(payload.data.weichatgame_task_unaward)
        }
        //未领取分享数
        if (payload.data && payload.data.weichatgame_invite_unaward){
            PlayerDetailModel.setShareUnReward(payload.data.weichatgame_invite_unaward)
        }


        //0不可签到, 1可以签到
        if (payload.data && payload.data.checkin_undo){
            PlayerDetailModel.setCheckinUndo(payload.data.checkin_undo)
        }
        //可领奖的每日任务数
        if (payload.data && payload.data.task1_unaward){
            PlayerDetailModel.setTask1Unaward(payload.data.task1_unaward)
        }
        //可领奖的成长任务数
        if (payload.data && payload.data.task2_unaward){
            PlayerDetailModel.setTask2Unaward(payload.data.task2_unaward)
        }
        //充值奖励利率
        if (payload.data && payload.data.charge_rate){
            PlayerDetailModel.setChargeRate(payload.data.charge_rate)
        }
        //皮肤
        if (payload.data && payload.data.propDress){
            PlayerDetailModel.setPropDress(payload.data.propDress)
        }
        //道具
        if (payload.data && payload.data.propItems){
            PlayerDetailModel.setPropItems(payload.data.propItems)

            var propItems = PlayerDetailModel.getPropItems();
            if (propItems["5"] && propItems["5"] == 1 && config.jpqShareSucss){
                //获得记牌器
                console.log("---获得记牌器");
                var fn = function(){
                    var list = [];
                    var args = {
                        arg1:"jipaiqi",
                        arg2:3,
                    }
                    list.push(args);
                    dialogManager.showAnimGetProp(list);//"lequan",//jipaiqi
                }
                setTimeout(fn,500);
                config.jpqShareSucss = false;
            }
        }
        // self.playerDetailController_:refreshUI()
    },
    onEmoticonData(event){
        console.log("广播表情包------");
        var self = this;
        var response = event.getUserData();
        // console.log(data);
        var id = response.data.emoticonData.id;
        var sendSeatNum = config.getPlayerSeatNum(self.mySeatId,response.data.emoticonData.sendSeatId);
        var receiveSeatNum = config.getPlayerSeatNum(self.mySeatId,response.data.emoticonData.receiveSeatId);

        var beginPos = cc.p(0,0);
        var endpos = cc.p(0,0);
        var audioUrl = "";
        var prefabUrl = "";
        if(sendSeatNum == 1){//自己
            beginPos = self.myPlayer.getPosition();
        }else if(sendSeatNum == 0){//右边
            beginPos = self.rightPlayer.getPosition();
        }else if(sendSeatNum == 2){//左边
            beginPos = self.leftPlayer.getPosition();
        }
        if(receiveSeatNum == 1){//自己
            endpos = self.myPlayer.getPosition();
        }else if(receiveSeatNum == 0){//右边
            endpos = self.rightPlayer.getPosition();
        }else if(receiveSeatNum == 2){//左边
            endpos = self.leftPlayer.getPosition();
        }
        if(id == 1001){
            audioUrl = "mf_tuoxie";
            prefabUrl = "animatiom/anim_tuoxie";
        }else if(id == 1002){
            audioUrl = "mf_xihongshi";
            prefabUrl = "animatiom/anim_jidan";
        }else if(id == 1003){
            audioUrl = "mf_dianzan";
            prefabUrl = "animatiom/anim_dianzan"; 
        }else if(id == 1004){
            audioUrl = "mf_meigui";
            prefabUrl = "animatiom/anim_xianhua";
        }

        var args = {};
        args.beginPos = beginPos;
        args.endpos = endpos;
        args.audioUrl = audioUrl;
        args.prefabUrl = prefabUrl;

        self.showEmoticon(args);
    },
    showEmoticon(args){
        var prefabUrl = args.prefabUrl;
        console.log("prefabUrl:"+prefabUrl);
        cc.loader.loadRes(prefabUrl, function (err, prefab) {
            if (err) {
                console.log(err);
                return;
            }
            var newNode = cc.instantiate(prefab);
            cc.director.getScene().addChild(newNode,9999);
            newNode.getComponent(require("expressionControl")).show(args);  
        });
    },
    onSendLzCard(event){
        console.log("发送癞子牌------");
        var self = this;
        var response = event.getUserData();
        var joker = response.data.joker;
        config.joker = joker;
        if(config.joker!="")
            this.setLazarillo_poker(joker);
        // this.clearTable3Card();
        this.setTable3Card(this.table3Cards);

        if(response.data.myCard){ //插3张牌
            if(self.myPokerNode.length > 0){ //先清理桌上的牌
                for(var i = 0; i < self.myPokerNode.length; i++){
                    self.myPokerNode[i].getComponent(PokerControl).node.removeFromParent();
                }
                self.myPokerNode = [];
            }
            self.myPokerData = [];
    
            self.myPokerData = CardUtil.serverCardsToClient(response.data.myCard);
            self.myPokerNode = self.playerme_.initMyCards(self.myPokerData,self.myPokerNode,self.scene,self.sceneWidth);
            self.myHandCards = response.data.myCard;
        }
        var showCardInfo = response.data.showCardInfo;
        console.log("showCardInfo>>>",showCardInfo);
        if(showCardInfo){
            for(var index=0;index<showCardInfo.length;index++){
                var sendSeatNum = config.getPlayerSeatNum(self.mySeatId,index);
                if(sendSeatNum == 1){//自己
                }else if(sendSeatNum == 0){//右边
                    if(showCardInfo[index]&&showCardInfo[index].length > 1){
                        if(self.rightPokerNode.length > 0){ //先清理桌上的牌
                            for(var i = 0; i < self.rightPokerNode.length; i++){
                                self.rightPokerNode[i].getComponent(PokerControl).node.removeFromParent();
                            }
                            self.rightPokerNode = [];
                        }
                        self.rightPokerData = [];
                        console.log(index+" : ",showCardInfo[index])
                        self.rightPokerData = CardUtil.serverCardsToClient(showCardInfo[index]);
                        self.right_player.playerRightShowCard(self.rightPokerData,self.rightPokerNode,self.pokerLayerRight,self.sceneWidth);
                    }
                }else if(sendSeatNum == 2){//左边
                    if(showCardInfo[index]&&showCardInfo[index].length > 1){
                        if(self.leftPokerNode.length > 0){ //先清理桌上的牌
                            for(var i = 0; i < self.leftPokerNode.length; i++){
                                self.leftPokerNode[i].getComponent(PokerControl).node.removeFromParent();
                            }
                            self.leftPokerNode = [];
                        }
                        self.leftPokerData = [];
                        console.log(index+" : ",showCardInfo[index])
                        self.leftPokerData = CardUtil.serverCardsToClient(showCardInfo[index]);
                        self.left_player.playerLeftShowCard(self.leftPokerData,self.leftPokerNode,self.pokerLayerLeft,self.sceneWidth);
                    }
                }
            }
        }
    },
    onShareWxResResult(event){
        console.log("微信分享成功发送结果------");
        var self = this;
        var response = event.getUserData();
        console.log(response);

        if(config.leQuanShareSucss){
            config.leQuanShareSucss = false;
            var fn = function(){
                console.log("taskRewardNum = ",self.taskRewardNum)
                var list = [];
                var args = {
                    arg1:"lequan",
                    arg2:3,
                }
                list.push(args);
                dialogManager.showAnimGetProp(list);//"lequan",//jipaiqi
            }
            setTimeout(fn,500);
        } 
    },
    onWatchAdvertisementResult(event){
        console.log("-----看完广告领奖");
        var response = event.getUserData();
        var award = response.data;
        var list = [];
        if(award.coins){
            var args = {
                arg1:"ledou",
                arg2:award.coins,
            }
            list.push(args);
        } 
        if(award.coupon){
            var args = {
                arg1:"lequan",
                arg2:award.coupon,
            }
            list.push(args);
        } 
        if(award.noteCards){
            var args = {
                arg1:"jipaiqi",
                arg2:award.coupon,
            }
            list.push(args);
        } 
        if(list.length>0){
            dialogManager.showAnimGetProp(list);
        }
        config.adCdTime = award.watch_advertisement_cd;
    },
////////////
    preloadNextScene(){
        cc.director.preloadScene("HallScene", function () {
            // cc.log("Next scene preloaded");
            cc.director.loadScene("HallScene");
        });
    },
    //震动屏幕
    animShakeNode(){
        var self = this;
        if(this.animShake){
            return;
        }
        this.animShake = true;
        var x = this.scene.x;
        var y = this.scene.y;
        var move1 = cc.moveTo(0.08, x-5, y-5);
        var move2 = cc.moveTo(0.08, x+5, y+5);
        var move3 = cc.moveTo(0.08, x-5, y+5);
        var move4 = cc.moveTo(0.08, x+5, y-5);
        var move5 = cc.moveTo(0.08, x-3, y-3);
        var move6 = cc.moveTo(0.08, x+3, y+3);
        var move7 = cc.moveTo(0.08, x-3, y+3);
        var move8 = cc.moveTo(0.08, x+3, y-3);
        var move9 = cc.moveTo(0.08, x, y);
        var callFunc = cc.callFunc(function(){
            self.animShake = false;
        });
        this.scene.runAction(cc.sequence(move1,move2,move3,move4,move5,move6,move7,move8,move9,callFunc));
    },
    showLazarilloPokerSelected(cardsList){
        var self = this;
        if(self.LazarilloPokerSelected)
            return;
        var click = function(){
            // self.LazarilloPokerSelected.closeClick();
            self.LazarilloPokerSelected = null;
        }

        cc.loader.loadRes("prefab/LazarilloPokerSelected", function (err, prefab) {
            if (err) {
                console.log(err);
                return;
            }
            var newNode = cc.instantiate(prefab);
            cc.director.getScene().addChild(newNode,10000);
            var prefabControl= newNode.getComponent(require("LazarilloPokerSelectedControl"));
            prefabControl.show(cardsList,click);
            self.LazarilloPokerSelected = prefabControl; 
        });
    },
    initWxVideoAd(){
        if(typeof(wx)=="undefined"){
            return;
        }
        var rewardedVideoAd = config.rewardedVideoAd;
        rewardedVideoAd.onLoad(() => {
            // console.log('激励视频 广告加载成功')
        })
        rewardedVideoAd.onError(err => {
            // console.log("激励视频 拉取失败"+err)
        })
        rewardedVideoAd.onClose(res => {
            if (res && res.isEnded || res === undefined) {
                // console.log("正常播放结束，可以下发游戏奖励")
                GameNetMgr.sendRequest("System", "WatchAdvertisement",config.rewardedVideoType);
            }
            else {
                // console.log("播放中途退出，不下发游戏奖励")
            }
            cc.vv.audioMgr.playBGM("MusicEx_Welcome");
        })
        this.rewardedVideoAd = rewardedVideoAd;
    },

});
