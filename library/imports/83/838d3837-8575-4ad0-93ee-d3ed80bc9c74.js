"use strict";
cc._RF.push(module, '838d3g3hXVK0JPu0+2AvJx0', 'Player');
// Script/Player.js

"use strict";

//玩家状态
// Player.ST_PLAYER_WAITTOSTART      = 0 //等待开始
// Player.ST_PLAYER_PUSHCARD         = 1 //发牌
// Player.ST_PLAYER_CALLLANDLORD     = 2 //叫/抢地主
// Player.ST_PLAYER_CONFIRM_LANDLORD = 3 //确认地主
// Player.ST_PLAYER_CONFIRM_LAIZI    = 4 //确认癞子
// Player.ST_PLAYER_WAITING          = 5 //等待其他玩家出牌
// Player.ST_PLAYER_DOUBLE           = 6 //加倍
// Player.ST_PLAYER_PUTCARD          = 7 //出牌
// Player.ST_PLAYER_BALANCE          = 8 //结算
// Player.ST_PLAYER_DELEGATED        = 9 //托管状态
// Player.ST_PLAYER_SENDCARD         = 10 //出牌
// Player.ST_PLAYER_READY            = 11 //准备好了
// Player.LOAD_TYPE_CALL             = 0 //叫地主
// Player.LOAD_TYPE_NOTCALL          = 1 //不叫地主
// Player.LOAD_TYPE_GRAP             = 2 //抢地主
// Player.LOAD_TYPE_NOTGRAP          = 3 //不抢地主


var PokerControl = require("PokerControl");
var config = require("config");
var CardUtil = require("CardUtil");
var PopCardUtil = require("PopCardUtil");

var Player = cc.Class({

    ctor: function ctor(parm) {
        this.uid = parm.uid;
        this.nickname = parm.nickname;
        this.gender = parm.gender;
        this.coin = parm.coin;
        this.gold = parm.gold;
        this.propDress = parm.propDress; //玩家服装
        this.seatId = parm.myseat; //座位id（服务器端）
        this.roomid = parm.roomid;
        this.tableid = parm.tableid;
        this.signature = parm.signature; //个性签名
        this.buff = parm.buff;
        this.wechatImg = parm.wechatImg;
        this.title = parm.title; //称号
        this.emoticon = parm.emoticon; //表情包
        this.emoticonItems = parm.emoticonItems; //表情包道具

        this.state = -1;
        this.seatNumber = 0; //座位编号(客户端) 0右边 1下边 2左边
        this.isLandlord = false; // 是否是地主
        this.cardCount = 0; //手牌数量
        this.isDelegated = false; //是否托管
        this.jokerValue = -1; //癞子牌值
        this.openHandCards = false; //是否明牌

        this.currentCards = {}; //最近一次出的牌
        this.curSendedCards = {}; //最近一次出的牌的面值
        this.cards = {}; //所有牌
        this.smallcards = {}; //小牌（纯粹用于计数）
        this.noteCards = {}; //记牌器
        this.lordCard = {}; //地主牌
        this.currentCardType = 0; //最近一次出的牌的牌型
        this.noteCards = ""; //记牌器(剩余没出出去的全部牌)
        this.joktoCards = {}; //最近一次出的牌里癞子当的牌
        this.jokerCardsValue = {}; //最近一次出的牌里癞子当的牌的值


        //玩家信息节点
        this.node_name = null; //昵称
        this.node_LeDou = null; //乐斗
        this.node_cardsNum = null; //剩余牌数 
        this.node_Landlord = null; //地主标志
        this.node_delegate = null; //托管标志
        this.node_hint = null; //操作显示语 “要不起”
        this.node_clockDwonTime = null; //闹钟倒计时
        this.node_wechatImg = null; //微信头像

        this.pokerCard = null;
    },
    clear: function clear() {
        this.cardCount = 0; //手牌数量
        this.currentCardType = 0; //最近一次出的牌的牌型
        this.jokerValue = -1;
        this.preSelectedCardIdx = -1;
        this.curSendedCards = {};
        this.currentCards = {};
        this.cards = {};
        this.smallcards = {};
        this.lordCard = {};
        this.joktoCards = {};
        this.jokerCardsValue = {};
        this.sendCardPos = {};
        this.noteCards = {};
    },
    setnickname: function setnickname(nickname) {
        this.nickname = nickname;
    },
    getNickname: function getNickname() {
        return this.nickname;
    },
    getWechatImg: function getWechatImg() {
        return this.wechatImg;
    },
    setWechatImg: function setWechatImg(wechatImg) {
        this.wechatImg = wechatImg;
    },
    getTitle: function getTitle() {
        return this.title;
    },
    setTitle: function setTitle(title) {
        this.title = title;
    },
    setCoin: function setCoin(coin) {
        this.coin = coin;
    },
    setWinCoin: function setWinCoin(coin) {
        this.winCoin = coin;
    },
    getWinCoin: function getWinCoin() {
        return this.winCoin;
    },
    getIsWinner: function getIsWinner() {
        return this.isWinner;
    },
    setIsWinner: function setIsWinner(win) {
        this.isWinner = win;
    },
    getCoin: function getCoin() {
        return this.coin;
    },
    setGold: function setGold(gold) {
        this.gold = gold;
    },
    getGold: function getGold() {
        return this.gold;
    },
    setCoinNode: function setCoinNode(node) {
        this.node_Coin = node;
    },
    setFlagNode: function setFlagNode(node) {
        this.node_Flag = node;
    },
    setCardCountNode: function setCardCountNode(node) {
        this.label_cardCount = node;
    },
    setJockerVlue: function setJockerVlue(jokerValue) {
        this.jokerValue = jokerValue;
    },

    //身份得到确认
    refreshIdentity: function refreshIdentity() {},
    getGender: function getGender() {
        return this.gender;
    },
    getMySeatId: function getMySeatId() {
        return this.seatId;
    },
    setMySeatId: function setMySeatId(seatId) {
        this.seatId = seatId;
    },
    setMySeatNum: function setMySeatNum(seatNumber) {
        this.seatNumber = seatNumber;
    },
    getMySeatNum: function getMySeatNum() {
        return this.seatNumber;
    },

    //设置癞子当的牌
    setJoktoCards: function setJoktoCards(joktoCards) {
        this.joktoCards = joktoCards;
    },

    //获得癞子当的牌
    getJoktoCards: function getJoktoCards() {
        return this.joktoCards;
    },

    //癞子牌面值
    setJokerCardsValue: function setJokerCardsValue(jokerCardsValue) {
        this.jokerCardsValue = jokerCardsValue;
    },
    setPokerCard: function setPokerCard(pokerCard) {
        this.pokerCard = pokerCard;
    },

    //初始化自己的牌
    initMyCards: function initMyCards(myPokerData, myPokerNode, parentNode, sceneWidth, seatNumber) {
        //0右边 1下边 2左边
        var myCardValue = [3, 5, 5, 5, 5, 6, 6, 6, 6, 9, 9, 9, 10, 10, 10, "J", "J", "J", "Q", "K" //g/G
        ];
        var myCardColor = [1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4 //"smallG","bigG"
        ];
        for (var i = 0; i < myCardValue.length; i++) {
            var pokerDataItem = {
                showTxt: myCardValue[i],
                showType: myCardColor[i]
            };
            myPokerData.push(pokerDataItem);
        }
        myPokerData.sort(CardUtil.gradeDown);

        for (var i = 0; i < myPokerData.length; i++) {
            var cardNode = cc.instantiate(this.pokerCard);
            cardNode.parent = parentNode;

            if (seatNumber == 0) {
                cardNode.scale = config.seatPos.right.pokerScale;
            } else if (seatNumber == 2) {
                cardNode.scale = config.seatPos.left.pokerScale;
            } else {
                cardNode.scale = config.seatPos.center.pokerScale;
            }
            var poker = cardNode.getComponent(PokerControl);
            myPokerData[i].canTouch = true;
            poker.showPoker(myPokerData[i]);
            myPokerNode.push(cardNode);

            if (seatNumber == 0) {
                this.neatenRightPoker(myPokerNode, config.seatPos.right, sceneWidth / 2, sceneWidth / 2 + 140);
            } else if (seatNumber == 2) {
                this.neatenLeftPoker(myPokerNode, config.seatPos.left, sceneWidth / 2, 230);
            } else {
                this.neatenPoker(myPokerNode, config.seatPos.center, sceneWidth);
            }
        }
        //最后一张牌设置为地主牌
        myPokerNode[myPokerNode.length - 1].getComponent(PokerControl).setCardDiZhu(true);
    },

    //理牌
    neatenPoker: function neatenPoker(pokerNode, seatPosParam, showWidth, startX, seatNumber) {
        if (pokerNode.length < 1) {
            return;
        }
        var pokerNum = pokerNode.length;
        var needWidth = (pokerNum - 1) * seatPosParam.disBetween + pokerNode[0].getComponent(PokerControl).node.width * seatPosParam.pokerScale;
        // console.log("needWidth:" + needWidth);
        showWidth = showWidth || cc.director.getWinSize().width;
        var startPosX = (showWidth - needWidth) / 2;
        startX = startX || startPosX;
        for (var i = 0; i < pokerNode.length; i++) {
            pokerNode[i].setPosition(startX + i * seatPosParam.disBetween + pokerNode[0].getComponent(PokerControl).node.width * seatPosParam.pokerScale * 0.5, seatPosParam.positionY);
        }
    },

    //出牌
    playCard: function playCard(pokerNode, startX, startY, seatNumber) {
        if (pokerNode.length < 1) {
            return;
        }
        var cardScale = 0.57;
        var disBetween = 40;
        var showCardWidth = (pokerNode.length - 1) * disBetween + pokerNode[0].getComponent(PokerControl).node.width * cardScale;
        var sceneWidth = cc.director.getWinSize().width;
        var startX = (sceneWidth - showCardWidth) / 2;
        //设置出去的牌的大小
        for (var i = 0; i < pokerNode.length; i++) {
            pokerNode[i].scale = cardScale;
            var posX = startX + i * disBetween + pokerNode[0].getComponent(PokerControl).node.width * cardScale * 0.5;
            var move = cc.moveTo(0.2, posX, 500);
            move.easing(cc.easeIn(2));
            var poker = pokerNode[i].getComponent(PokerControl);
            poker.node.runAction(move);

            //最后一张牌设置为地主牌
            if (i == pokerNode.length - 1) {
                poker.setCardDiZhu(true);
            }
        }
    },

    //------------------
    playerLeftShowCard: function playerLeftShowCard(myPokerData, myPokerNode, parentNode, sceneWidth) {
        this.initMyCards(myPokerData, myPokerNode, parentNode, sceneWidth, 2); //0右边 1下边 2左边
    },
    neatenLeftPoker: function neatenLeftPoker(pokerNode, seatPosParam, showWidth, startX) {
        if (pokerNode.length < 1) {
            return;
        }
        var pokerNum = pokerNode.length;
        var needWidth = (pokerNum - 1) * seatPosParam.disBetween + pokerNode[0].getComponent(PokerControl).node.width * seatPosParam.pokerScale;
        showWidth = showWidth || cc.director.getWinSize().width;
        var startPosX = (showWidth - needWidth) / 2;
        startX = startX || startPosX;

        var len = pokerNode.length;
        if (len <= 10) {
            for (var i = 0; i < pokerNode.length; i++) {
                pokerNode[i].setPosition(startX + i * seatPosParam.disBetween + pokerNode[0].getComponent(PokerControl).node.width * seatPosParam.pokerScale * 0.5, seatPosParam.positionY);
            }
        } else {
            for (var i = 0; i < 10; i++) {
                pokerNode[i].setPosition(startX + i * seatPosParam.disBetween + pokerNode[0].getComponent(PokerControl).node.width * seatPosParam.pokerScale * 0.5, seatPosParam.positionY);
            }

            for (var i = 0; i < len - 10; i++) {
                pokerNode[i + 10].setPosition(startX + i * seatPosParam.disBetween + pokerNode[0].getComponent(PokerControl).node.width * seatPosParam.pokerScale * 0.5, seatPosParam.positionY - 55);
            }
        }
    },

    //左边出牌
    playCardLeft: function playCardLeft(pokerNode, startX, startY) {
        if (pokerNode.length < 1) {
            return;
        }
        var cardScale = 0.38;
        var disBetween = 27;
        var showCardWidth = (pokerNode.length - 1) * disBetween + pokerNode[0].getComponent(PokerControl).node.width * cardScale;
        var sceneWidth = cc.director.getWinSize().width;

        //设置出去的牌的大小
        for (var i = 0; i < pokerNode.length; i++) {
            pokerNode[i].scale = cardScale;
            var posX = startX + i * disBetween + pokerNode[0].getComponent(PokerControl).node.width * cardScale * 0.5;
            // console.log("posX:"+posX);
            var poker = pokerNode[i].getComponent(PokerControl);
            poker.node.runAction(cc.moveTo(0.2, posX, startY));

            if (i == pokerNode.length - 1) {
                poker.setCardDiZhu(true);
            }
        }
    },

    //右边玩家明牌
    playerRightShowCard: function playerRightShowCard(myPokerData, myPokerNode, parentNode, sceneWidth) {
        this.initMyCards(myPokerData, myPokerNode, parentNode, sceneWidth, 0);
    },
    neatenRightPoker: function neatenRightPoker(pokerNode, seatPosParam, showWidth, startX) {
        if (pokerNode.length < 1) {
            return;
        }
        var pokerNum = pokerNode.length;
        var needWidth = (pokerNum - 1) * seatPosParam.disBetween + pokerNode[0].getComponent(PokerControl).node.width * seatPosParam.pokerScale;
        showWidth = showWidth || cc.director.getWinSize().width;
        var startPosX = (showWidth - needWidth) / 2;
        startX = startX || startPosX;

        startX = startX + 10 * seatPosParam.disBetween;

        var len = pokerNode.length;
        if (len <= 10) {
            startX = startX + (10 - len) * seatPosParam.disBetween;
            for (var i = 0; i < pokerNode.length; i++) {
                pokerNode[i].setPosition(startX + i * seatPosParam.disBetween + pokerNode[0].getComponent(PokerControl).node.width * seatPosParam.pokerScale * 0.5, seatPosParam.positionY);
            }
        } else {
            for (var i = 0; i < 10; i++) {
                pokerNode[i].setPosition(startX + i * seatPosParam.disBetween + pokerNode[0].getComponent(PokerControl).node.width * seatPosParam.pokerScale * 0.5, seatPosParam.positionY);
            }
            for (var i = 0; i < len - 10; i++) {
                pokerNode[i + 10].setPosition(startX + i * seatPosParam.disBetween + pokerNode[0].getComponent(PokerControl).node.width * seatPosParam.pokerScale * 0.5, seatPosParam.positionY - 55);
            }
        }
    },
    playCardRight: function playCardRight(pokerNode, startX, startY) {
        if (pokerNode.length < 1) {
            return;
        }
        var cardScale = 0.38;
        var disBetween = 27;
        var showCardWidth = (pokerNode.length - 1) * disBetween + pokerNode[0].getComponent(PokerControl).node.width * cardScale;
        var sceneWidth = cc.director.getWinSize().width;
        startX = sceneWidth / 2 + 590 - disBetween * pokerNode.length;

        //设置出去的牌的大小
        for (var i = 0; i < pokerNode.length; i++) {
            pokerNode[i].scale = cardScale;
            var posX = startX + i * disBetween + pokerNode[0].getComponent(PokerControl).node.width * cardScale * 0.5;
            var poker = pokerNode[i].getComponent(PokerControl);
            poker.node.runAction(cc.moveTo(0.2, posX, startY));
            // if(i==pokerNode.length-1){
            //     poker.setCardDiZhu(true);
            // }
        }
    }
});

cc._RF.pop();