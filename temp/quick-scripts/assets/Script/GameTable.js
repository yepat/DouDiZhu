(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/GameTable.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '1393cipeeNFZbpX9aJxYpTG', 'GameTable', __filename);
// Script/GameTable.js

"use strict";

var PokerData = require("PokerData");
var PokerControl = require("PokerControl");
var config = require("config");
var CardUtil = require("CardUtil");
var PopCardUtil = require("PopCardUtil");

var opratOutCardControl = require("opratOutCardControl");
var dialogManager = require("dialogManager");
var PlayerDetailModel = require("PlayerDetailModel");
var Player = require("Player");

var EventHelper = require("EventHelper");
var GameNetMgr = require("GameNetMgr");
var Events = require("Events");

cc.Class({
    extends: cc.Component,

    properties: {
        pokerCard: {
            default: null,
            type: cc.Prefab
        },

        pokerLayerLeft: {
            default: null,
            type: cc.Node
        },
        pokerLayerRight: {
            default: null,
            type: cc.Node
        },
        pokerLayerMy: {
            default: null,
            type: cc.Node
        },

        chupaiBtn: {
            default: null,
            type: cc.Node
        },

        buchuBtn: {
            default: null,
            type: cc.Node
        },
        canvas: cc.Node,
        opratOutCard: {
            default: null,
            type: cc.Prefab
        },
        leftPlayer: {
            default: null,
            type: cc.Node
        },
        rightPlayer: {
            default: null,
            type: cc.Node
        }
    },
    // LIFE-CYCLE CALLBACKS:
    onLoad: function onLoad() {},
    start: function start() {
        var self = this;
        var sceneWidth = cc.director.getWinSize().width;
        var scene = cc.director.getScene();

        this.sceneWidth = sceneWidth;
        this.scene = scene;
        this.mySeatId = 0;

        this.preSendCards = []; //上架出牌
        this.preSeatId = -1; //上架出牌id


        this.loadSeatId = 0; //地主的id
        this.nicknames = []; //所有玩家昵称

        self.touchBeganX = 0;
        self.leftX = 0;
        self.rightX = 0;
        self.upY = 0;
        self.downY = 0;
        self.isTouchbegan = false;

        var wechatImgUrl = "http://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLSO7sOWsNicYdNM3MbNGGo58zticxgqoO2aqS7zOCVClXl7WExa4KNQ48uSTSszicsyspzsDQ51M4EQ/132";
        //--创建自己的形象
        var detailModel = PlayerDetailModel;
        var params = {};
        params.uid = detailModel.getUid();
        params.nickname = detailModel.getNickName();
        params.gender = toString(detailModel.getGender());
        params.coin = detailModel.getCoin();
        params.gold = detailModel.getGold();
        params.lequan = detailModel.getCoupon();
        params.propDress = detailModel.getPropDress();
        params.wechatImg = wechatImgUrl; //detailModel.getWechatImg();
        params.title = detailModel.getTitle();
        params.emoticon = {};
        params.emoticonItems = {};

        this.myOpratShow = null; //我自己的弹出操作洁面
        this.CancelDelegate = null;

        this.myPokerData = [];
        this.myPokerNode = [];
        this.dispatchCard = [];
        var player = new Player(params);
        self.playerme_ = player;
        self.initMyPlayerNode();
        self.playerme_.initBaseInfo();

        // var cards = ["13","25","35","45","15","26","36","46","16","29","39","49","1a","2a","3a","1b","2b","3b","3c","4d"];
        // this.myPokerData = CardUtil.serverCardsToClient(cards);
        // self.playerme_.initMyCards(this.myPokerData,this.myPokerNode,this.scene,this.sceneWidth);

        //左边玩家形象
        this.leftDispatchCard = [];
        this.leftPokerData = [];
        this.leftPokerNode = [];
        this.left_player = new Player();
        this.initLeftPlayerNode();
        // self.left_player.initBaseInfo();
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
        this.registerEvent();

        this.leftPlayer.active = false;
        this.rightPlayer.active = false;

        GameNetMgr.sendRequest("Game", "startGame");
        this.addEventListener();

        this.initTable3Card();
    },

    //初始化桌面3张底牌
    initTable3Card: function initTable3Card() {
        this.table3Card = [];
        for (var i = 0; i < 3; i++) {
            var path = "Canvas/top_bar1/dipaibg/poker" + i;
            var card = cc.find(path);
            this.table3Card.push(card);
            card.active = false;
        }

        this.node_tableTimes = cc.find("Canvas/bottom_bar3/beishu/lab_bei").getComponent(cc.Label);
    },
    setTable3Card: function setTable3Card(severCards) {
        for (var i = 0; i < 3; i++) {
            this.table3Card[i].active = true;
            var poker = this.table3Card[i].getComponent(PokerControl);
            poker.showPoker(CardUtil.convertCardToClient(severCards[i]));
        }
    },
    initMyPlayerNode: function initMyPlayerNode() {
        var self = this;
        var node_name = cc.find("Canvas/my_player/head1/name").getComponent(cc.Label);
        var node_LeDou = cc.find("Canvas/my_player/ledou/lab_ledou").getComponent(cc.Label);
        var node_LeQuan = cc.find("Canvas/my_player/lequan/lab_lequan").getComponent(cc.Label);
        var node_Landlord = cc.find("Canvas/my_player/head1/p_dz_icon").getComponent(cc.Sprite);
        var node_hint = cc.find("Canvas/my_player/my_tip/p_tip_jiaodizhu").getComponent(cc.Sprite);
        var node_wechatImg = cc.find("Canvas/my_player/head1/p_head/p_head_1").getComponent(cc.Sprite);

        var nodes = {};
        nodes.node_name = node_name; //昵称
        nodes.node_LeDou = node_LeDou; //乐斗
        nodes.node_LeQuan = node_LeQuan; //乐券
        nodes.node_cardsNum = null; //剩余牌数 
        nodes.node_Landlord = node_Landlord; //地主标志
        nodes.node_delegate = null; //托管标志
        nodes.node_hint = node_hint; //操作显示语 “要不起”
        nodes.node_clockDwonTime = null; //闹钟倒计时
        nodes.node_wechatImg = node_wechatImg; //微信头像
        nodes.pokerCard = this.pokerCard; //预设扑克牌
        nodes.node_alarm = null; //警报装置

        node_Landlord.enabled = false;
        nodes.node_hint.enabled = false;

        self.playerme_.initNodes(nodes);
    },
    initLeftPlayerNode: function initLeftPlayerNode() {
        var self = this;
        var node_name = cc.find("Canvas/left_player/head/name").getComponent(cc.Label);
        var node_LeDou = cc.find("Canvas/left_player/ledou/lab_ledou").getComponent(cc.Label);
        var node_cardsNum = cc.find("Canvas/left_player/p_card_1/cardNum").getComponent(cc.Label);
        var node_Landlord = cc.find("Canvas/left_player/head/p_dz_icon").getComponent(cc.Sprite);
        var node_delegate = cc.find("Canvas/left_player/head/p_delegate").getComponent(cc.Sprite);
        var node_hint = cc.find("Canvas/left_player/left_tip/p_tip_yaobuqi").getComponent(cc.Sprite);
        var node_clockDwonTime = cc.find("Canvas/left_player/left_clock/clockDown"); //.getComponent(cc.Node);
        var node_wechatImg = cc.find("Canvas/left_player/head/p_head/p_head_1").getComponent(cc.Sprite);
        var node_alarm = cc.find("Canvas/left_player/alarm");

        var nodes = {};
        nodes.node_name = node_name; //昵称
        nodes.node_LeDou = node_LeDou; //乐斗
        nodes.node_LeQuan = null; //乐券
        nodes.node_cardsNum = node_cardsNum; //剩余牌数 
        nodes.node_Landlord = node_Landlord; //地主标志
        nodes.node_delegate = node_delegate; //托管标志
        nodes.node_hint = node_hint; //操作显示语 “要不起”
        nodes.node_clockDwonTime = node_clockDwonTime; //闹钟倒计时
        nodes.node_wechatImg = node_wechatImg; //微信头像
        nodes.pokerCard = this.pokerCard; //预设扑克牌
        nodes.node_alarm = node_alarm; //警报装置

        node_Landlord.enabled = false;
        node_delegate.enabled = false;
        node_hint.enabled = false;
        node_clockDwonTime.active = false;
        node_alarm.active = false;

        self.left_player.initNodes(nodes);
    },
    initRightPlayerNode: function initRightPlayerNode() {
        var self = this;
        var node_name = cc.find("Canvas/right_player/head/name").getComponent(cc.Label);
        var node_LeDou = cc.find("Canvas/right_player/ledou/lab_ledou").getComponent(cc.Label);
        var node_cardsNum = cc.find("Canvas/right_player/p_card_1/cardNum").getComponent(cc.Label);
        var node_Landlord = cc.find("Canvas/right_player/head/p_dz_icon").getComponent(cc.Sprite);
        var node_delegate = cc.find("Canvas/right_player/head/p_delegate").getComponent(cc.Sprite);
        var node_hint = cc.find("Canvas/right_player/right_tip/p_tip_qiangdizhu").getComponent(cc.Sprite);
        var node_clockDwonTime = cc.find("Canvas/right_player/right_clock/clockDown"); //.getComponent(cc.Node);
        var node_wechatImg = cc.find("Canvas/right_player/head/p_head/p_head_1").getComponent(cc.Sprite);
        var node_alarm = cc.find("Canvas/right_player/alarm");

        var nodes = {};
        nodes.node_name = node_name; //昵称
        nodes.node_LeDou = node_LeDou; //乐斗
        nodes.node_LeQuan = null; //乐券
        nodes.node_cardsNum = node_cardsNum; //剩余牌数 
        nodes.node_Landlord = node_Landlord; //地主标志
        nodes.node_delegate = node_delegate; //托管标志
        nodes.node_hint = node_hint; //操作显示语 “要不起”
        nodes.node_clockDwonTime = node_clockDwonTime; //闹钟倒计时
        nodes.node_wechatImg = node_wechatImg; //微信头像
        nodes.pokerCard = this.pokerCard; //预设扑克牌
        nodes.node_alarm = node_alarm; //警报装置

        node_Landlord.enabled = false;
        node_delegate.enabled = false;
        node_hint.enabled = false;
        node_clockDwonTime.active = false;
        node_alarm.active = false;

        self.right_player.initNodes(nodes);
    },
    clearTable: function clearTable() {
        //清理拍桌
        this.playerme_.clear();
        this.left_player.clear();
        this.right_player.clear();

        this.playerme_.clearTableCard(this.dispatchCard);
        this.left_player.clearTableCard(this.leftDispatchCard);
        this.right_player.clearTableCard(this.rightDispatchCard);

        if (this.myPokerNode.length > 0) {
            //先清理桌上的牌
            for (var i = 0; i < this.myPokerNode.length; i++) {
                this.myPokerNode[i].getComponent(PokerControl).node.removeFromParent();
            }
            this.myPokerNode = [];
        }
        this.myPokerData = [];

        this.leftPlayer.active = false;
        this.rightPlayer.active = false;

        this.preSendCards = []; //上架出牌
        this.preSeatId = -1; //上架出牌id

        console.log("//清理拍桌");

        // for(this.table3Card)
        for (var i = 0; i < this.table3Card.length; i++) {
            this.table3Card[i].active = false;
        }

        if (this.CancelDelegate) {
            console.log("//清理拍桌 11111");
            this.CancelDelegate.close();
            this.CancelDelegate = null;
        }
    },

    //注册触摸事件
    registerEvent: function registerEvent() {
        var self = this;
        // var myPokerNode = this.myPokerNode;

        this.canvas.on(cc.Node.EventType.TOUCH_START, function (event) {
            // console.log("touchStart");
            if (self.myPokerNode.length < 1) return false;
            var p = event.getLocation();
            // console.log(">>x:"+p.x+">>y:"+p.y);
            self.touchBeganX = p.x;
            self.leftX = 0;
            self.rightX = 10000;
            self.upY = 10000;
            self.downY = 0;
            self.isTouchbegan = true;
            self.setSelectCardByTouch(self.myPokerNode, p.x, p.y, self.isTouchbegan);

            if (self.isTouchbegan) {
                var x1 = self.myPokerNode[0].getPositionX();
                var x2 = self.myPokerNode[self.myPokerNode.length - 1].getPositionX();
                var py = self.myPokerNode[0].getPositionY();
                var psize = self.myPokerNode[0].getContentSize();
                var pwidth = psize.width;
                var pheight = psize.height;

                var disBetween = 10;

                self.leftX = x1 - pwidth / 2 - disBetween;
                self.rightX = x2 + pwidth / 2 + disBetween;
                self.upY = py + pheight / 2 + 40;
                self.downY = py - pheight / 2;

                console.log("self.leftX:" + self.leftX + "  self.rightX:" + self.rightX + " self.downY:" + self.downY + "  self.upY:" + self.upY);
                if (self.isTouchbegan && (p.y > self.upY || p.y < self.downY || p.x < self.leftX || p.x > self.rightX)) {
                    self.moveAllCardDown(self.myPokerNode);
                }
            }
        }, this.node);
        this.canvas.on(cc.Node.EventType.TOUCH_END, function (event) {
            // console.log("touchEnd");
            if (self.myPokerNode.length < 1) return;
            var p = event.getLocation();
            self.moveCard(self.myPokerNode);
        }, this.node);
        this.canvas.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            if (self.myPokerNode.length < 1) return;
            var p = event.getLocation();
            if (Math.abs(self.touchBeganX - p.x) > 40) {
                self.isTouchbegan = false;
                self.setSelectCardByTouch(self.myPokerNode, p.x, p.y, self.isTouchbegan);
            }
        }, this.node);
    },

    //移除触摸事件
    unregisterEvent: function unregisterEvent() {
        this.canvas.targetOff(this.node);
        console.log("off");
    },
    setSelectCardByTouch: function setSelectCardByTouch(myPokerNode, x, y, istouchbegan) {
        var touchStart = this.touchBeganX;
        var touchEnd = x;
        this.isTouchbegan = istouchbegan;

        if (this.touchBeganX > x) {
            touchStart = x;
            touchEnd = this.touchBeganX;
        }
        //如果起点跟终点距离小于5 则处理成起点等于终点
        if (touchEnd - touchStart < 5) {
            touchEnd = touchStart;
        }

        var selected = false; //选中状态

        for (var i = 0; i < myPokerNode.length; i++) {
            var pokerNode = myPokerNode[i];
            var posY = pokerNode.getPositionY();
            var size = pokerNode.getContentSize();
            var posX = pokerNode.getPositionX(); //+ size.width/2;

            var width = size.width;
            var height = size.height;

            var disBetween = config.seatPos.center.disBetween;

            var right = posX - width / 2 + disBetween;
            var left = posX - width / 2;
            var buttom = posY - height / 2;
            var up = posY + height / 2;
            //最后一张整张牌都可以点击
            if (i == myPokerNode.length - 1) {
                right = posX + width / 2;
            }
            if (y >= buttom && y <= up && (left >= touchStart && left <= touchEnd || right >= touchStart && right <= touchEnd || touchStart >= left && touchStart <= right || touchEnd >= left && touchEnd <= right)) {
                pokerNode.getComponent(PokerControl).setChoosed(true);
            } else {}
        }
    },
    moveCard: function moveCard(myPokerNode) {
        for (var i = 0; i < myPokerNode.length; i++) {
            var pokerNode = myPokerNode[i];
            pokerNode.getComponent(PokerControl).cardMove();
        }
    },
    moveAllCardDown: function moveAllCardDown(myPokerNode) {
        console.log("moveAllCardDown");
        for (var i = 0; i < myPokerNode.length; i++) {
            var pokerNode = myPokerNode[i];
            pokerNode.getComponent(PokerControl).cardMoveDown();
        }
    },
    onShow: function onShow() {
        console.log("onShow");
        this.onMyOutCard();

        // this.left_player.hideClock();
        // this.right_player.showClock(15);
    },
    onHide: function onHide() {
        console.log("onHide");
        //智能提牌测试
        var myPokerNode = this.myPokerNode;
        var myPokerData = this.myPokerData;
        var topcards = CardUtil.getMyTopCards(myPokerNode, PokerControl);

        var mycards = [];
        for (var i = myPokerData.length - 1; i > -1; i--) {
            mycards.push(myPokerData[i].showTxt);
            console.log("xx" + myPokerData[i].showTxt);
        }

        var autocards = CardUtil.getCardsFromTopCards(mycards, topcards);
        if (autocards.length < 1) {} else {
            this.moveAllCardDown(myPokerNode); //先放下在提起
            CardUtil.AutoChooseLiftUpCard(myPokerNode, PokerControl, autocards);
        }
    },

    //轮到自己出牌
    onMyOutCard: function onMyOutCard() {
        var self = this;
        var dispatchCard = this.dispatchCard;
        var sceneWidth = this.sceneWidth;
        var scene = cc.director.getScene();

        var myPokerNode = this.myPokerNode;
        var myPokerData = this.myPokerData;

        var buchuFunc = function buchuFunc() {
            self.moveAllCardDown(myPokerNode);
            // GameNetMgr.sendGiveupSendCard();
            GameNetMgr.sendRequest("Game", "giveupSendCard");

            if (self.myOpratShow) {
                self.myOpratShow = null;
            }
        };
        var tishiNum = 0;
        var tishiFunc = function tishiFunc() {
            var cards = []; //"3","3","3","3"

            if (self.preSendCards && self.preSendCards.length > 0) {
                var pokerdata = CardUtil.serverCardsToClient(self.preSendCards);
                pokerdata.sort(CardUtil.gradeUp);
                for (var i = 0; i < pokerdata.length; i++) {
                    cards.push(pokerdata.showTxt);
                }
            }

            // self.preSendCards;

            var cardstype = CardUtil.get_topCard_type(cards);
            var myCards = [];
            console.log(cardstype);
            for (var i = myPokerData.length - 1; i > -1; i--) {
                var cardValue = CardUtil.StringToNumber(myPokerData[i].showTxt);
                myCards.push(cardValue);
            }

            var tishicards = CardUtil.get_cards_larger(cardstype, myCards);
            if (tishicards.length == 0) {
                console.log("没有符合的牌型可供提示");
                return;
            }
            cards = tishicards[tishiNum];
            if (tishiNum < tishicards.length - 1) {
                tishiNum++;
            } else {
                tishiNum = 0;
            }

            // this.node.stopAllActions();
            var callFunc = cc.callFunc(function () {
                CardUtil.AutoChooseLiftUpCard(myPokerNode, PokerControl, cards);
            });
            var delay = cc.delayTime(0.25);
            this.node.runAction(cc.sequence(delay, callFunc));
            self.moveAllCardDown(myPokerNode);
        };
        var chupaiFunc = function chupaiFunc() {
            console.log("点击了出牌");
            if (self.myOpratShow) {
                self.myOpratShow = null;
            }
            //牌桌上已经有了出牌，清除掉
            // var self = this;
            if (self.dispatchCard && self.dispatchCard.length > 0) {
                console.log("dispatchCard.length:" + self.dispatchCard.length);
                for (var i = 0; i < self.dispatchCard.length; i++) {
                    self.dispatchCard[i].getComponent(PokerControl).node.removeFromParent();
                }
                self.dispatchCard = [];
            }
            var topCards = [];
            var topCardData = [];
            //获取提起的牌直
            for (var i = myPokerData.length - 1; i > -1; i--) {
                if (myPokerData[i].isTopped) {
                    var cardValue = CardUtil.StringToNumber(myPokerData[i].showTxt);
                    topCards.push(cardValue);
                    var cardType = myPokerData[i].showType;
                    var pokerDataItem = {
                        showTxt: cardValue,
                        showType: cardType
                    };
                    topCardData.push(pokerDataItem);
                }
            }

            if (topCards.length >= 1) {
                var popCardsType = CardUtil.get_topCard_type(topCards);
                console.log(popCardsType);
                if (popCardsType.type == 0) {
                    console.log("提起的牌不合法");
                    return -1;
                }
            } else {
                console.log("没有牌提起");
                return 0;
            }

            var args = CardUtil.clientCardsToServer(topCardData);
            // GameNetMgr.sendSendCard(args);
            GameNetMgr.sendRequest("Game", "sendCard", args);

            // self.mySendCards(args);

            // for(var i = myPokerData.length - 1; i > -1;i--){
            //         if(myPokerData[i].isTopped){ //myPokerData[i].isChoosed
            //         var isChoosedPoker = myPokerNode[i];
            //         dispatchCard.unshift(isChoosedPoker);
            //         myPokerData.splice(i,1);
            //         myPokerNode.splice(i,1);
            //     }
            // }
            // self.dispatchCard = dispatchCard;
            // //出牌
            // self.playerme_.playCard(dispatchCard);
            // self.playerme_.neatenPoker(myPokerNode,config.seatPos.center,sceneWidth);
            // //最后一张牌设置为地主牌
            // if(self.playerme_.getLandlord()&&myPokerNode.length>0){
            //     myPokerNode[myPokerNode.length-1].getComponent(PokerControl).setCardDiZhu(true);
            // }
            // self.playerme_.setCardCount(myPokerNode.length);

            // self.leftSendCards(topCards,topCardData,false);
            // // self.rightSendCards(topCards,topCardData,false)
            // var cards = ["25","35","45","15"];
            // self.rightSendCards(args,null,false);
        };

        // self.preSendCards = response["data"]["sendCards"];//上架出牌
        // self.preSeatId = seatId;//上架出牌id


        if (self.playerme_.getCardCount() == 20 || self.mySeatId == self.preSeatId) {
            self.showCallLord(config.SendCardTimeout, null, chupaiFunc, config.opratType.mustOutCard);
        } else {
            var opOutCard = cc.instantiate(this.opratOutCard);
            opOutCard.parent = scene;
            var opOutCardControl = opOutCard.getComponent(opratOutCardControl);
            opOutCardControl.show(config.SendCardTimeout, buchuFunc, tishiFunc, chupaiFunc);

            self.myOpratShow = opOutCardControl;
        }
    },
    mySendCards: function mySendCards(severCards) {
        //自己出牌
        var self = this;

        if (severCards) {
            //(根据服务器返回的牌出牌)
            var cardData = CardUtil.serverCardsToClient(severCards);
            cardData.sort(CardUtil.gradeUp); //这边生序拍下
            self.dispatchCard = self.playerme_.getSendCard(self.dispatchCard, cardData, self.myPokerNode, self.myPokerData);
        } else {}
        // for(var i = self.myPokerData.length - 1; i > -1;i--){//( 根据提出的牌出牌)
        //         if(self.myPokerData[i].isTopped){ 
        //         var isChoosedPoker = self.myPokerNode[i];
        //         self.dispatchCard.unshift(isChoosedPoker);
        //         self.myPokerData.splice(i,1);
        //         self.myPokerNode.splice(i,1);
        //     }
        // }


        //出牌
        self.playerme_.playCard(self.dispatchCard);
        self.playerme_.neatenPoker(self.myPokerNode, config.seatPos.center, self.sceneWidth);
        //最后一张牌设置为地主牌
        if (self.playerme_.getLandlord() && self.myPokerNode.length > 0) {
            self.myPokerNode[self.myPokerNode.length - 1].getComponent(PokerControl).setCardDiZhu(true);
        }
        self.playerme_.setCardCount(self.myPokerNode.length);
    },
    leftSendCards: function leftSendCards(severCards, cardData, isShowCard) {
        var self = this;
        var sceneWidth = this.sceneWidth;

        if (!severCards) {
            return;
        }

        if (cardData) {} else {
            cardData = CardUtil.serverCardsToClient(severCards);
            cardData.sort(CardUtil.gradeUp); //这边生序拍下
        }

        //左边明牌出牌
        if (isShowCard) {
            self.leftDispatchCard = self.left_player.getSendCard(self.leftDispatchCard, cardData, self.leftPokerNode, self.leftPokerData);
            self.left_player.playCardLeft(self.leftDispatchCard, 320, 650);
            self.left_player.neatenLeftPoker(self.leftPokerNode, config.seatPos.left, sceneWidth / 2, 230);
        } else {
            //左边暗牌出牌
            self.leftDispatchCard = self.left_player.darkCardSend(self.leftDispatchCard, cardData, self.pokerLayerLeft, 2, sceneWidth);
            self.left_player.playCardLeft(self.leftDispatchCard, 320, 650);
        }
    },
    rightSendCards: function rightSendCards(severCards, cardData, isShowCard) {
        var self = this;
        var sceneWidth = this.sceneWidth;

        if (!severCards) {
            return;
        }

        if (cardData) {} else {
            if (severCards) {
                cardData = CardUtil.serverCardsToClient(severCards);
                cardData.sort(CardUtil.gradeUp); //这边生序拍下
            }
        }

        if (isShowCard) {
            //右边明牌出牌
            self.rightDispatchCard = self.right_player.getSendCard(self.rightDispatchCard, cardData, self.rightPokerNode, self.rightPokerData);
            self.right_player.playCardRight(self.rightDispatchCard, 620, 650);
            self.right_player.neatenRightPoker(self.rightPokerNode, config.seatPos.right, sceneWidth / 2, sceneWidth / 2 + 140);
        } else {
            //右边暗牌出牌
            self.rightDispatchCard = self.right_player.darkCardSend(self.rightDispatchCard, cardData, self.pokerLayerRight, 0, sceneWidth);
            self.right_player.playCardRight(self.rightDispatchCard, 620, 650);
        }
    },


    //返回按钮点击事件
    btnBackClick: function btnBackClick() {
        console.log("btnBackClick");
        cc.director.loadScene("HallScene");
    },
    btnDelegateClick: function btnDelegateClick() {
        console.log("btnDelegateClick");
        // dialogManager.showJpqNode();
        // dialogManager.showCancelDelegate();
        var self = this;
        var click = function click() {
            GameNetMgr.sendRequest("Game", "cancelDelegate");
            self.CancelDelegate = null;
            self.playerme_.setDelegated(false);
        };

        // 

        if (self.CancelDelegate) {} else {
            cc.loader.loadRes("prefab/CancelDelegate", function (err, prefab) {
                //匹配计数动画
                if (err) {
                    console.log(err);
                    return;
                }
                var newNode = cc.instantiate(prefab);
                cc.director.getScene().addChild(newNode);
                var prefabControl = newNode.getComponent(require("CancelDelegateController"));
                prefabControl.show(click);
                self.CancelDelegate = prefabControl;
            });
        }
    },
    btnSetClick: function btnSetClick() {
        console.log("btnSetClick");
        dialogManager.showSetDialog();
    },
    btnJiPaiQiClick: function btnJiPaiQiClick() {
        console.log("btnJiPaiQiClick");
    },
    btnChatClick: function btnChatClick() {
        console.log("btnChatClick");
    },

    //监听协议
    addEventListener: function addEventListener() {
        var self = this;
        self.watingStart = null;
        EventHelper.AddCustomEvent(config.MyNode, "Queued", function (event) {
            console.log("进入队列---");
            cc.loader.loadRes("animatiom/watingStartGame", function (err, prefab) {
                //匹配计数动画
                if (err) {
                    console.log(err);
                    return;
                }
                var newNode = cc.instantiate(prefab);
                cc.director.getScene().addChild(newNode);
                self.watingStart = newNode.getComponent(require("watingStarControl"));
            });
        });
        EventHelper.AddCustomEvent(config.MyNode, "GameReady", function (event) {
            console.log("游戏准备好了---");
            self.watingStart.close();
            var response = event.getUserData();
            self.initPlayerInfo(response);
        });
        EventHelper.AddCustomEvent(config.MyNode, "TableTimesUpdate", function (event) {
            console.log("桌子的倍数发生改变---");
            var response = event.getUserData();
            var times = response["data"]["rate"];
            self.node_tableTimes.string = "" + times;
        });
        EventHelper.AddCustomEvent(config.MyNode, "SendCard", function (event) {
            console.log("发牌, 包括各用户的牌信息---");

            if (self.myPokerNode.length > 0) {
                //先清理桌上的牌
                for (var i = 0; i < self.myPokerNode.length; i++) {
                    self.myPokerNode[i].getComponent(PokerControl).node.removeFromParent();
                }
                self.myPokerNode = [];
            }
            self.myPokerData = [];

            var response = event.getUserData();
            self.myPokerData = CardUtil.serverCardsToClient(response.data.myCard);
            self.playerme_.initMyCards(self.myPokerData, self.myPokerNode, self.scene, self.sceneWidth);
            //明牌按钮现实
            var click = function click(time) {
                GameNetMgr.sendRequest("Game", "showCard", time);
            };
            dialogManager.showOpratShowCard(click);
        });
        EventHelper.AddCustomEvent(config.MyNode, "RefreshPlayerData", function (event) {
            console.log("刷新用户金币---");
        });
        EventHelper.AddCustomEvent(config.MyNode, "TurnCallLord", function (event) {
            console.log("轮到谁叫地主---");
            var response = event.getUserData();
            var seatNum = config.getPlayerSeatNum(self.mySeatId, response.data.callId);
            if (seatNum == 1) {
                //自己
                var btn1Func = function btn1Func() {
                    // GameNetMgr.sendCallLord(1);
                    GameNetMgr.sendRequest("Game", "callLord", 1);
                    if (self.myOpratShow) {
                        self.myOpratShow = null;
                    }
                };
                var btn2Func = function btn2Func() {
                    // GameNetMgr.sendCallLord(2);
                    GameNetMgr.sendRequest("Game", "callLord", 2);
                    if (self.myOpratShow) {
                        self.myOpratShow = null;
                    }
                };
                self.showCallLord(config.CallLordTimeout, btn1Func, btn2Func, config.opratType.callLoad);
                self.playerme_.hideHint();
            } else if (seatNum == 0) {
                //右边
                self.right_player.showClock(config.CallLordTimeout);
                self.right_player.hideHint();
            } else if (seatNum == 2) {
                //左边
                self.left_player.showClock(config.CallLordTimeout);
                self.left_player.hideHint();
            }
        });
        EventHelper.AddCustomEvent(config.MyNode, "CallLord", function (event) {
            console.log("玩家叫地主---");
            var response = event.getUserData();
            var seatId = response["data"]["beLordId"];
            var status = response["data"]["beLordInfo"]; // 1叫 2不叫
            var seatNum = config.getPlayerSeatNum(self.mySeatId, seatId);
            if (seatNum == 1) {
                //自己
                if (status == 1) {
                    self.playerme_.showHint(config.hintType.callLoad);
                } else {
                    self.playerme_.showHint(config.hintType.callLoadNo);
                }
            } else if (seatNum == 0) {
                //右边
                self.right_player.hideClock();
                if (status == 1) {
                    self.right_player.showHint(config.hintType.callLoad);
                } else {
                    self.right_player.showHint(config.hintType.callLoadNo);
                }
            } else if (seatNum == 2) {
                //左边
                self.left_player.hideClock();
                if (status == 1) {
                    self.left_player.showHint(config.hintType.callLoad);
                } else {
                    self.left_player.showHint(config.hintType.callLoadNo);
                }
            }
        });
        EventHelper.AddCustomEvent(config.MyNode, "TurnGrabLord", function (event) {
            console.log("轮到谁抢地主---");
            var response = event.getUserData();
            var callId = response["data"]["callId"];
            var seatNum = config.getPlayerSeatNum(self.mySeatId, callId);
            if (seatNum == 1) {
                //自己
                var btn1Func = function btn1Func() {
                    // GameNetMgr.sendGrabLord(1);
                    GameNetMgr.sendRequest("Game", "grabLord", 1);
                };
                var btn2Func = function btn2Func() {
                    // GameNetMgr.sendGrabLord(2);
                    GameNetMgr.sendRequest("Game", "grabLord", 2);
                };
                self.showCallLord(config.CallLordTimeout, btn1Func, btn2Func, config.opratType.grabLoad);
                self.playerme_.hideHint();
            } else if (seatNum == 0) {
                //右边
                self.right_player.showClock(config.CallLordTimeout);
                self.right_player.hideHint();
            } else if (seatNum == 2) {
                //左边
                self.left_player.showClock(config.CallLordTimeout);
                self.left_player.hideHint();
            }
        });
        EventHelper.AddCustomEvent(config.MyNode, "GrabLord", function (event) {
            console.log("玩家抢地主---");
            var response = event.getUserData();
            var seatId = response["data"]["grabLordId"];
            var status = response["data"]["grabLordInfo"];
            var seatNum = config.getPlayerSeatNum(self.mySeatId, seatId);
            if (seatNum == 1) {
                //自己
                if (status == 1) {
                    self.playerme_.showHint(config.hintType.grabLoad);
                } else {
                    self.playerme_.showHint(config.hintType.grabLoadNo);
                }
            } else if (seatNum == 0) {
                //右边
                self.right_player.hideClock();
                if (status == 1) {
                    self.right_player.showHint(config.hintType.grabLoad);
                } else {
                    self.right_player.showHint(config.hintType.grabLoadNo);
                }
            } else if (seatNum == 2) {
                //左边
                self.left_player.hideClock();
                if (status == 1) {
                    self.left_player.showHint(config.hintType.grabLoad);
                } else {
                    self.left_player.showHint(config.hintType.grabLoadNo);
                }
            }
        });
        EventHelper.AddCustomEvent(config.MyNode, "CallLordOver", function (event) {
            console.log("叫地主结束---");
            self.playerme_.hideHint();
            self.left_player.hideHint();
            self.right_player.hideHint();

            var response = event.getUserData();
            var lordId = response["data"]["lordId"];
            var cards = response["data"]["lordCard"];
            var times = response["data"]["lordBonus"];
            self.setTable3Card(cards);

            self.loadSeatId = lordId; //地主的id

            var seatNum = config.getPlayerSeatNum(self.mySeatId, lordId);
            if (seatNum == 1) {
                //自己
                if (response.data.myCard && response.data.myCard.length == 20) {
                    //插3张牌
                    if (self.myPokerNode.length > 0) {
                        //先清理桌上的牌
                        for (var i = 0; i < self.myPokerNode.length; i++) {
                            self.myPokerNode[i].getComponent(PokerControl).node.removeFromParent();
                        }
                        self.myPokerNode = [];
                    }
                    self.myPokerData = [];

                    self.myPokerData = CardUtil.serverCardsToClient(response.data.myCard);
                    self.myPokerNode = self.playerme_.initMyCards(self.myPokerData, self.myPokerNode, self.scene, self.sceneWidth);
                    self.playerme_.setCardCount(20);
                    self.playerme_.setLandlord(true);
                }
            } else if (seatNum == 0) {
                //右边
                self.right_player.setCardCount(20);
                self.right_player.setLandlord(true);
            } else if (seatNum == 2) {
                //左边
                self.left_player.setCardCount(20);
                self.left_player.setLandlord(true);
            }
        });
        EventHelper.AddCustomEvent(config.MyNode, "CanDoubleResult", function (event) {
            console.log("通知是否可以加倍---");
            var response = event.getUserData();
            var candouble = response.data.can_double;

            if (candouble && candouble == 1) {
                var btn1Func = function btn1Func() {
                    GameNetMgr.sendRequest("Game", "addRatio");
                };
                dialogManager.showOpratDouble(btn1Func);
            }
        });
        EventHelper.AddCustomEvent(config.MyNode, "TurnSendCard", function (event) {
            console.log("轮到谁出牌---");

            var response = event.getUserData();
            var seatId = response["data"]["callId"];
            var seatNum = config.getPlayerSeatNum(self.mySeatId, seatId);

            if (seatNum == 1) {
                //自己
                self.onMyOutCard();
                self.playerme_.hideHint();
                self.playerme_.clearTableCard(self.dispatchCard);
                //lipai
                self.playerme_.neatenPoker(self.myPokerNode, config.seatPos.center, self.sceneWidth);
            } else if (seatNum == 0) {
                //右边
                self.right_player.showClock(config.SendCardTimeout);
                self.right_player.hideHint();
                self.right_player.clearTableCard(self.rightDispatchCard);
            } else if (seatNum == 2) {
                //左边
                self.left_player.showClock(config.SendCardTimeout);
                self.left_player.hideHint();
                self.left_player.clearTableCard(self.leftDispatchCard);
            }
        });
        EventHelper.AddCustomEvent(config.MyNode, "PlayerDelegated", function (event) {
            console.log("用户托管---");
            var response = event.getUserData();
            var seatId = response["data"]["trustId"];
            var giveup = response["data"]["giveup"]; //是否断线  0在线 1在线
            var seatNum = config.getPlayerSeatNum(self.mySeatId, seatId);

            // local response = event.payload
            // local seatId = response["data"]["trustId"]
            // local mySeatId = self.playerme_:getMySeatId()
            // local giveup = response["data"]["giveup"] --是否断线  0在线 1在线

            if (seatNum == 1) {
                //自己
                if (!self.playerme_.getDelegated()) {
                    self.btnDelegateClick();
                    self.playerme_.setDelegated(true);
                }
            } else if (seatNum == 0) {//右边

            } else if (seatNum == 2) {//左边

            }
        });
        EventHelper.AddCustomEvent(config.MyNode, "PlayerSendCard", function (event) {
            console.log("用户出牌---");
            var response = event.getUserData();
            var seatId = response["data"]["callId"];
            var seatNum = config.getPlayerSeatNum(self.mySeatId, seatId);
            if (seatNum == 1) {
                //自己
                self.mySendCards(response["data"]["sendCards"]);
                if (self.myOpratShow) {
                    self.myOpratShow.close();
                    self.myOpratShow = null;
                }
            } else if (seatNum == 0) {
                //右边
                self.rightSendCards(response["data"]["sendCards"], null, false);
                var outCardsNum = response["data"]["sendCards"].length;
                var cardNum = self.right_player.getCardCount();
                self.right_player.setCardCount(cardNum - outCardsNum);
                self.right_player.hideClock();
            } else if (seatNum == 2) {
                //左边
                self.leftSendCards(response["data"]["sendCards"], null, false);
                var outCardsNum = response["data"]["sendCards"].length;
                var cardNum = self.left_player.getCardCount();
                self.left_player.setCardCount(cardNum - outCardsNum);
                self.left_player.hideClock();
            }

            self.preSendCards = response["data"]["sendCards"]; //上架出牌
            self.preSeatId = seatId; //上架出牌id
        });
        EventHelper.AddCustomEvent(config.MyNode, "PlayerNotSend", function (event) {
            console.log("用户不出牌---");
            var response = event.getUserData();
            var seatId = response["data"]["callId"];
            var seatNum = config.getPlayerSeatNum(self.mySeatId, seatId);
            if (seatNum == 1) {
                //自己
                // self.mySendCards(response["data"]["sendCards"]);
                self.playerme_.showHint(config.hintType.dont);
                if (self.myOpratShow) {
                    self.myOpratShow.close();
                    self.myOpratShow = null;
                }
            } else if (seatNum == 0) {
                //右边
                // self.rightSendCards(null,null,false);
                self.right_player.showHint(config.hintType.dont);
                self.right_player.hideClock();
            } else if (seatNum == 2) {
                //左边
                // self.leftSendCards(null,null,false);
                self.left_player.showHint(config.hintType.dont);
                self.left_player.hideClock();
            }
        });
        EventHelper.AddCustomEvent(config.MyNode, "PlayerShowCard", function (event) {
            console.log("用户明牌---");
        });
        EventHelper.AddCustomEvent(config.MyNode, "GameComplete", function (event) {
            console.log("本局结束---");
            var response = event.getUserData();
            self.showGameResult(response);
        });
        EventHelper.AddCustomEvent(config.MyNode, "TableUserExit", function (event) {
            console.log("有用户退出 通知桌上的玩家重新进入队列---");
            self.clearTable();
        });
    },

    //初始化玩家信息
    initPlayerInfo: function initPlayerInfo(response) {
        var self = this;
        if (response.data["time"]) {
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
        } else {
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
        if (newGame) {
            var mySeatId = response["data"]["seatId"];
            self.mySeatId = mySeatId;
            self.playerme_.setMySeatId(mySeatId);
            self.playerme_.setMySeatNum(1);
            var peers = { 0: response["data"]["0"], 1: response["data"]["1"], 2: response["data"]["2"] };
            for (var k in peers) {
                var v = peers[k];
                var curSeatId = v["seatId"];

                this.nicknames.push(v["nick"]);

                if (curSeatId == mySeatId) {
                    self.playerme_.setMySeatId(v["seatId"]);
                    self.playerme_.setRoomId(v["roomId"]);
                    self.playerme_.setTableId(v["tableId"]);
                    self.playerme_.setSignature(v["word"]);
                    self.playerme_.setBuff(v["buff"]);
                } else {
                    var seatNum = 1;
                    if (mySeatId == 0) {
                        if (curSeatId == 1) {
                            seatNum = 2;
                        } else if (curSeatId == 2) {
                            seatNum = 0;
                        }
                    } else if (mySeatId == 1) {
                        if (curSeatId == 0) {
                            seatNum = 0;
                        } else if (curSeatId == 2) {
                            seatNum = 2;
                        }
                    } else if (mySeatId == 2) {
                        if (curSeatId == 0) {
                            seatNum = 2;
                        } else if (curSeatId == 1) {
                            seatNum = 0;
                        }
                    }

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

                    if (seatNum == 2) {
                        //左边玩家
                        self.left_player.initInfo(parm);
                        self.left_player.initBaseInfo();
                        self.left_player.setMySeatNum(seatNum);
                        self.leftPlayer.active = true;
                    } else if (seatNum == 0) {
                        //右边玩家
                        self.right_player.initInfo(parm);
                        self.right_player.initBaseInfo();
                        self.right_player.setMySeatNum(seatNum);
                        self.rightPlayer.active = true;
                    }
                }
            }
        } else {}
    },

    //叫地主，抢地主弹出框
    showCallLord: function showCallLord(time, btn1Func, btn2Func, type) {
        var self = this;
        cc.loader.loadRes("prefab/opratCallLord", function (err, prefab) {
            //匹配计数动画
            if (err) {
                console.log(err);
                return;
            }
            var newNode = cc.instantiate(prefab);
            cc.director.getScene().addChild(newNode);
            var prefabControl = newNode.getComponent(require("opratCallLordControl"));
            prefabControl.show(time, btn1Func, btn2Func, type);

            self.myOpratShow = prefabControl;
        });
    },

    //结算洁面
    showGameResult: function showGameResult(response) {
        var self = this;
        var infos = [];
        // var infoItem = {};

        var data = response.data;

        var click1 = function click1() {
            //名牌
            GameNetMgr.sendRequest("Game", "startGame", true);
        };
        var click2 = function click2() {
            GameNetMgr.sendRequest("Game", "startGame", false);
        };
        var url = "prefab/gameResultWin";

        // self.mySeatId

        if (response["data"]["isWinner"]["" + self.mySeatId] == 1) {} else {
            url = "prefab/gameResultLose";
        }

        self.playerme_.setCoin(data.coins[self.mySeatId]);
        // self.playerme_.setLeQuan();

        // {isdizhu : false,nickname : "新手123",difen : 60,beishu : 1000,ledou : "- 60000"},

        var rate = data.rate;
        var rateMax = data.rateMax;
        // var modelId = data.modelId;
        var baseCoins = data.baseCoins;

        // this.loadSeatId = 0; //地主的id
        // this.nicknames = []; //所有玩家昵称

        for (var i = 0; i < 3; i++) {
            var socre = data.total["" + i];
            if (socre > 0) {
                socre = "+" + socre;
            } else {
                socre = "- " + Math.abs(socre);
            }
            var infoItem = {
                isdizhu: self.loadSeatId == i, nickname: self.nicknames[i], difen: baseCoins, beishu: rate, ledou: socre
            };
            infos.push(infoItem);
        }

        cc.loader.loadRes(url, function (err, prefab) {
            //匹配计数动画
            if (err) {
                console.log(err);
                return;
            }
            var newNode = cc.instantiate(prefab);
            cc.director.getScene().addChild(newNode);
            var prefabControl = newNode.getComponent(require("gameResultControl"));
            prefabControl.show(infos, click1, click2, self.mySeatId);
        });
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
        //# sourceMappingURL=GameTable.js.map
        