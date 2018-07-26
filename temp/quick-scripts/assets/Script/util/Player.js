(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/util/Player.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '838d3g3hXVK0JPu0+2AvJx0', 'Player', __filename);
// Script/util/Player.js

"use strict";

var PokerControl = require("PokerControl");
var config = require("config");
var CardUtil = require("CardUtil");
var ClockControl = require("ClockControl");

var Player = cc.Class({

    ctor: function ctor(parm) {
        if (!parm) return;
        this.uid = parm.uid;
        this.nickname = parm.nickname;
        this.gender = parm.gender;
        this.coin = parm.coin;
        this.gold = parm.gold;
        this.lequan = parm.lequan;
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

        this.play = parm.play; //游戏总局数
        this.win = parm.win; //胜利局数

        this.state = -1;
        this.seatNumber = 0; //座位编号(客户端) 0右边 1下边 2左边
        this.isLandlord = false; // 是否是地主
        this.cardCount = 0; //手牌数量
        this.isDelegated = false; //是否托管
        this.jokerValue = -1; //癞子牌值
        this.openHandCards = false; //是否明牌

        this.currentCards = []; //最近一次出的牌
        this.curSendedCards = {}; //最近一次出的牌的面值
        this.cards = {}; //所有牌
        this.smallcards = {}; //小牌（纯粹用于计数）
        this.noteCards = {}; //记牌器
        this.lordCard = {}; //地主牌
        this.currentCardType = 0; //最近一次出的牌的牌型
        this.noteCards = ""; //记牌器(剩余没出出去的全部牌)
        this.joktoCards = {}; //最近一次出的牌里癞子当的牌
        this.jokerCardsValue = {}; //最近一次出的牌里癞子当的牌的值

        this.myCards = []; //  自己手牌


        this.showHintType = 0;

        //玩家信息节点
        this.node_name = null; //昵称
        this.node_LeDou = null; //乐斗
        this.node_LeQuan = null; //乐券
        this.node_cardsNum = null; //剩余牌数 
        this.node_Landlord = null; //地主标志
        this.node_delegate = null; //托管标志
        this.node_hint = null; //操作显示语 “要不起”
        this.node_clockDwonTime = null; //闹钟倒计时
        this.node_wechatImg = null; //微信头像
        this.pokerCard = null; //预设扑克牌
        this.node_alarm = null; //警报装置
    },
    initInfo: function initInfo(parm) {
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

        this.play = parm.play; //游戏总局数
        this.win = parm.win; //胜利局数
    },
    setPlay: function setPlay(play) {
        this.play = play;
    },
    getPlay: function getPlay() {
        return this.play;
    },
    setWin: function setWin(win) {
        this.win = win;
    },
    getWin: function getWin() {
        return this.win;
    },
    initNodes: function initNodes(nodes) {
        //初始化玩家节点信息
        this.node_name = nodes.node_name; //昵称
        this.node_LeDou = nodes.node_LeDou; //乐斗
        this.node_LeQuan = nodes.node_LeQuan; //乐券
        this.node_cardsNum = nodes.node_cardsNum; //剩余牌数 
        this.node_Landlord = nodes.node_Landlord; //地主标志
        this.node_delegate = nodes.node_delegate; //托管标志
        this.node_hint = nodes.node_hint; //操作显示语 “要不起”
        this.node_clockDwonTime = nodes.node_clockDwonTime; //闹钟倒计时
        this.node_wechatImg = nodes.node_wechatImg; //微信头像
        this.pokerCard = nodes.pokerCard; //预设扑克牌
        this.node_alarm = nodes.node_alarm; //警报装置
    },

    //初始化玩家基础信息
    initBaseInfo: function initBaseInfo() {
        console.log("初始化玩家基础信息");
        this.setnickname(this.nickname);
        this.setCoin(this.coin);
        this.setLeQuan(this.lequan);
        this.setWechatImg(this.wechatImg);
        this.setCardCount(17);
    },
    continueInfo: function continueInfo(parm) {
        // console.log("短线重连玩家信息");
        this.play = parm.play; //游戏总局数
        this.win = parm.win; //胜利局数
        this.uid = parm.uid; //胜利局数
        this.gender = parm.sex;

        this.setnickname(parm.nickname);
        this.setCoin(parm.coin);
        this.setLeQuan(parm.lequan);
        this.setWechatImg(parm.wechatImg);
        this.setCardCount(parm.cardCount);
        this.setMySeatId(parm.seatId);
    },
    clear: function clear() {
        this.cardCount = 0; //手牌数量
        this.currentCardType = 0; //最近一次出的牌的牌型
        this.jokerValue = -1;
        this.preSelectedCardIdx = -1;
        this.curSendedCards = {};
        this.currentCards = [];
        this.cards = {};
        this.smallcards = {};
        this.lordCard = {};
        this.joktoCards = {};
        this.jokerCardsValue = {};
        this.sendCardPos = {};
        this.noteCards = {};

        this.state = -1;
        this.seatNumber = 0; //座位编号(客户端) 0右边 1下边 2左边
        this.isLandlord = false; // 是否是地主
        this.isDelegated = false; //是否托管
        this.openHandCards = false; //是否明牌

        if (this.node_Landlord) {
            this.node_Landlord.enabled = false;
        }
        if (this.node_delegate) {
            this.node_delegate.enabled = false;
        }
        if (this.node_hint) {
            this.node_hint.enabled = false;
        }
        if (this.node_clockDwonTime) {
            this.node_clockDwonTime.active = false;
        }
        if (this.node_alarm) {
            this.node_alarm.active = false;
        }
    },
    setNode_alarmShow: function setNode_alarmShow(blt) {
        if (this.node_alarm) {
            this.node_alarm.active = blt;
        }
    },
    setOpenHandCards: function setOpenHandCards(blt) {
        this.openHandCards = blt;
    },
    getOpenHandCards: function getOpenHandCards() {
        return this.openHandCards;
    },
    setDelegated: function setDelegated(isDelegated) {
        this.isDelegated = isDelegated;
        if (isDelegated && this.node_delegate) {
            this.node_delegate.enabled = true;
        } else if (this.node_delegate) {
            this.node_delegate.enabled = false;
        }
    },
    getDelegated: function getDelegated() {
        return this.isDelegated;
    },
    setLandlord: function setLandlord(isLandlord) {
        this.isLandlord = isLandlord;
        if (isLandlord && this.node_Landlord) {
            this.node_Landlord.enabled = true;
        }
    },
    getLandlord: function getLandlord() {
        return this.isLandlord;
    },
    setRoomId: function setRoomId(roomid) {
        this.roomid = roomid;
    },
    getRoomId: function getRoomId() {
        return this.roomid;
    },
    setTableId: function setTableId(tableid) {
        this.tableid = tableid;
    },
    getTableId: function getTableId() {
        return this.tableid;
    },
    setSignature: function setSignature(signature) {
        this.signature = signature;
    },
    getSignature: function getSignature() {
        return this.signature;
    },
    setBuff: function setBuff(buff) {
        this.buff = buff;
    },
    getBuff: function getBuff() {
        return this.buff;
    },
    getUid: function getUid() {
        return this.uid;
    },
    setUid: function setUid(uid) {
        this.uid = uid;
    },
    setnickname: function setnickname(nickname) {
        this.nickname = nickname;
        if (this.node_name) {
            this.node_name.string = config.parseString(nickname);
        }
    },
    getNickname: function getNickname() {
        return this.nickname;
    },
    getWechatImg: function getWechatImg() {
        return this.wechatImg;
    },
    setWechatImg: function setWechatImg(wechatImg) {
        var self = this;
        this.wechatImg = wechatImg;
        if (wechatImg == "") {
            var headUrl = "common/p_head_woman";
            if (this.gender == 1) {
                headUrl = "common/p_head_man";
            }
            cc.loader.loadRes(headUrl, cc.SpriteFrame, function (err, spriteFrame) {
                self.node_wechatImg.getComponent(cc.Sprite).spriteFrame = spriteFrame;
            });
            return;
        }
        var imgUrl = wechatImg + "?aa=aa.jpg";
        if (this.node_wechatImg) {
            cc.loader.load(imgUrl, function (err, texture) {
                self.node_wechatImg.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
            });
        }
    },
    getTitle: function getTitle() {
        return this.title;
    },
    setTitle: function setTitle(title) {
        this.title = title;
    },
    getCoin: function getCoin() {
        return this.coin;
    },
    setCoin: function setCoin(coin) {
        this.coin = coin;
        if (this.node_LeDou) {
            this.node_LeDou.string = "" + config.parseNumber(coin);
        }
    },
    setLeQuan: function setLeQuan(lequan) {
        this.lequan = lequan;
        if (this.node_LeQuan) {
            this.node_LeQuan.string = "" + config.parseNumber(lequan);
        }
    },
    getLeQuan: function getLeQuan() {
        return this.lequan;
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
    setCardCount: function setCardCount(num) {
        this.cardCount = num;
        if (this.node_cardsNum) {
            this.node_cardsNum.string = "" + num;
        }
    },
    getCardCount: function getCardCount() {
        return this.cardCount;
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

    //自己手牌
    setMyCards: function setMyCards(cards) {
        this.myCards = cards;
    },
    getMyCards: function getMyCards() {
        return this.myCards;
    },

    //当前出牌
    getCurrentCards: function getCurrentCards() {
        return this.currentCards;
    },
    setCurrentCards: function setCurrentCards(cards) {
        this.currentCards = cards;
    },

    //提示类型
    getShowHintType: function getShowHintType() {
        return this.showHintType;
    },


    //初始化自己的牌
    initMyCards: function initMyCards(myPokerData, myPokerNode, parentNode, sceneWidth, seatNumber) {
        //0右边 1下边 2左边
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

            if (!seatNumber) {
                //new
                // console.log("test 自己-----");
                cardNode.setPosition(sceneWidth / 2, config.seatPos.center.positionY);
            }

            myPokerNode.push(cardNode);
        }

        if (seatNumber == 0) {
            console.log("右边玩家明牌-----");
            // console.log(myPokerNode);
            this.neatenRightPoker(myPokerNode, config.seatPos.right, sceneWidth / 2, sceneWidth / 2 + 140);
        } else if (seatNumber == 2) {
            console.log("左边玩家明牌-----");
            // console.log(myPokerNode);
            this.neatenLeftPoker(myPokerNode, config.seatPos.left, sceneWidth / 2, 230);
        } else {
            // this.neatenPoker(myPokerNode,config.seatPos.center,sceneWidth);
            if (seatNumber == -1) {
                this.mySendCardAnim(myPokerNode, config.seatPos.center, sceneWidth);
            } else {
                this.neatenPoker(myPokerNode, config.seatPos.center, sceneWidth);
            }
        }

        //最后一张牌设置为地主牌
        if (this.isLandlord) {
            myPokerNode[myPokerNode.length - 1].getComponent(PokerControl).setCardDiZhu(true);
        }
        if (this.openHandCards) {
            myPokerNode[myPokerNode.length - 1].getComponent(PokerControl).setCardShow(true);
        }
        return myPokerNode;
    },

    //发牌动画
    mySendCardAnim: function mySendCardAnim(pokerNode, seatPosParam, showWidth) {
        if (pokerNode.length < 1) {
            return;
        }
        var pokerNum = pokerNode.length;

        var disBetween = seatPosParam.disBetween;
        if (showWidth > 2330) {
            disBetween = config.seatPos.center.disBetweenIX;
        }

        var pokerWith = pokerNode[0].getComponent(PokerControl).node.width * seatPosParam.pokerScale * 0.5;
        var needWidth = (pokerNum - 1) * disBetween + pokerWith;
        var startPosX = (showWidth - needWidth) / 2;
        var startX = startPosX;
        //new
        startX = startX + 8 * disBetween + pokerWith / 2;

        for (var i = 0; i < pokerNode.length; i++) {
            pokerNode[i].setPosition(startX, seatPosParam.positionY);
        }
        var j = 0;
        var moveCard = function moveCard() {
            if (j < 8) {
                for (var i = 0; i < 8 - j; i++) {
                    var move = cc.moveBy(0.22, -disBetween, 0);
                    if (pokerNode[i]) pokerNode[i].runAction(move);
                }
                for (var k = j + 9; k < pokerNum; k++) {
                    var move = cc.moveBy(0.22, disBetween, 0);
                    if (pokerNode[k]) pokerNode[k].runAction(move);
                }
                j++;
                setTimeout(moveCard, 224);
            }
        };
        moveCard();
    },

    //理牌
    neatenPoker: function neatenPoker(pokerNode, seatPosParam, showWidth, startX) {
        if (pokerNode.length < 1) {
            return;
        }
        var pokerNum = pokerNode.length;

        var disBetween = seatPosParam.disBetween;
        if (showWidth > 2330) {
            disBetween = config.seatPos.center.disBetweenIX;
        }

        var needWidth = (pokerNum - 1) * disBetween + pokerNode[0].getComponent(PokerControl).node.width * seatPosParam.pokerScale;
        // console.log("needWidth:" + needWidth);
        showWidth = showWidth || cc.director.getWinSize().width;
        var startPosX = (showWidth - needWidth) / 2;
        startX = startX || startPosX;
        for (var i = 0; i < pokerNode.length; i++) {
            pokerNode[i].setPosition(startX + i * disBetween + pokerNode[0].getComponent(PokerControl).node.width * seatPosParam.pokerScale * 0.5, seatPosParam.positionY);
            //把提出的牌设置 未提出
            // var pokerNode = pokerNode[i];
            pokerNode[i].getComponent(PokerControl).setMoveDown();
        }
    },
    clearTableCard: function clearTableCard(dispatchCard) {
        if (dispatchCard && dispatchCard.length > 0) {
            //先清理桌上的牌
            for (var i = 0; i < dispatchCard.length; i++) {
                dispatchCard[i].getComponent(PokerControl).node.removeFromParent();
            }
            dispatchCard = [];
        }
    },
    getSendCard: function getSendCard(dispatchCard, cards, PokerNode, PokerData) {
        //获取要出的牌
        if (dispatchCard && dispatchCard.length > 0) {
            //先清理桌上的牌
            for (var i = 0; i < dispatchCard.length; i++) {
                dispatchCard[i].getComponent(PokerControl).node.removeFromParent();
            }
            dispatchCard = [];
        }
        var index = 0;
        for (var i = PokerData.length - 1; i > -1; i--) {
            //这里要添加花色判断
            var cardValue = CardUtil.StringToNumber(PokerData[i].showTxt);
            var cardType = CardUtil.StringToNumber(PokerData[i].showType);
            if (index < cards.length && cards[index].showTxt == cardValue && cards[index].showType == cardType) {
                // console.log("cards:"+cards[index].showTxt);
                var isChoosedPoker = PokerNode[i];
                dispatchCard.unshift(isChoosedPoker);
                PokerData.splice(i, 1);
                PokerNode.splice(i, 1);
                index++;
            }
        }
        this.setMyCards(PokerData);
        return dispatchCard;
    },

    //出牌
    playCard: function playCard(pokerNode, jokto) {
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
            var move = cc.moveTo(0.1, posX, 500);
            var poker = pokerNode[i].getComponent(PokerControl);
            poker.node.runAction(move);
            // pokerNode[i].setPosition(posX,500);
        }

        // setTimeout(function(){
        //     for(var i = 0; i < pokerNode.length; i++){
        //         var poker = pokerNode[i].getComponent(PokerControl);
        //         if(poker.node.y != 500)
        //             poker.node.y = 500;
        //     }
        // },200);

        var joktoIndex = 0;
        var curSendCards = this.getCurrentCards();
        for (var i = 0; i < pokerNode.length; i++) {
            var poker = pokerNode[i].getComponent(PokerControl);
            poker.setPokerBg();
            var pokerData = CardUtil.convertCardToClient(curSendCards[i]);
            // poker.showPoker(pokerData);
            if (config.joker != "") {
                //赖子牌值转换
                if (jokto && jokto.length > 0) {
                    var jokerValue = CardUtil.serverCardValueToClient(config.joker);
                    if (jokto[joktoIndex] && pokerData.showTxt == jokerValue) {
                        var joktoValue = CardUtil.serverCardValueToClient(jokto[joktoIndex]);
                        // console.log(joktoValue);
                        poker.convertLazarillo(joktoValue);
                        joktoIndex++;
                    } else {
                        // console.log(pokerData);
                        poker.showPoker(pokerData);
                    }
                } else {
                    // console.log(pokerData);
                    poker.showPoker(pokerData);
                }
            } else {
                // console.log(PokerData[i]);
                poker.showPoker(pokerData);
            }
        }

        //最后一张牌设置为地主牌 
        if (this.isLandlord) {
            pokerNode[pokerNode.length - 1].getComponent(PokerControl).setCardDiZhu(true);
        }
        if (this.openHandCards) {
            pokerNode[pokerNode.length - 1].getComponent(PokerControl).setCardShow(true);
        }
    },

    //左边玩家明牌
    playerLeftShowCard: function playerLeftShowCard(myPokerData, myPokerNode, parentNode, sceneWidth) {
        this.initMyCards(myPokerData, myPokerNode, parentNode, sceneWidth, 2); //0右边 1下边 2左边
    },
    neatenLeftPoker: function neatenLeftPoker(pokerNode, seatPosParam, showWidth, startX, startY) {
        if (pokerNode.length < 1) {
            return;
        }
        var pokerNum = pokerNode.length;
        var needWidth = (pokerNum - 1) * seatPosParam.disBetween + pokerNode[0].getComponent(PokerControl).node.width * seatPosParam.pokerScale;
        showWidth = showWidth || cc.director.getWinSize().width;
        var startPosX = (showWidth - needWidth) / 2;
        startX = startX || startPosX;

        startX = startX + 64;

        var pokerY = seatPosParam.positionY;
        if (startY) {
            pokerY = startY;
        }

        var len = pokerNode.length;
        if (len <= 10) {
            for (var i = 0; i < pokerNode.length; i++) {
                pokerNode[i].setPosition(startX + i * seatPosParam.disBetween + pokerNode[0].getComponent(PokerControl).node.width * seatPosParam.pokerScale * 0.5, pokerY);
            }
        } else {
            for (var i = 0; i < 10; i++) {
                pokerNode[i].setPosition(startX + i * seatPosParam.disBetween + pokerNode[0].getComponent(PokerControl).node.width * seatPosParam.pokerScale * 0.5, pokerY);
            }

            for (var i = 0; i < len - 10; i++) {
                pokerNode[i + 10].setPosition(startX + i * seatPosParam.disBetween + pokerNode[0].getComponent(PokerControl).node.width * seatPosParam.pokerScale * 0.5, pokerY - 55);
            }
        }
    },

    //左边出牌
    playCardLeft: function playCardLeft(pokerNode, startX, startY, jokto) {
        if (pokerNode.length < 1) {
            return;
        }
        var cardScale = 0.5; //0.38
        var disBetween = 37; //27
        startX = startX + 64;
        //设置出去的牌的大小
        for (var i = 0; i < pokerNode.length; i++) {
            pokerNode[i].scale = cardScale;
            var posX = startX + i * disBetween + pokerNode[0].getComponent(PokerControl).node.width * cardScale * 0.5;
            // console.log("posX:"+posX);
            var poker = pokerNode[i].getComponent(PokerControl);
            poker.node.runAction(cc.moveTo(0.1, posX, startY));
        }
        var joktoIndex = 0;
        var curSendCards = this.getCurrentCards();
        for (var i = 0; i < pokerNode.length; i++) {
            var poker = pokerNode[i].getComponent(PokerControl);
            poker.setPokerBg();
            var pokerData = CardUtil.convertCardToClient(curSendCards[i]);
            // poker.showPoker(pokerData);

            if (config.joker != "") {
                //赖子牌值转换
                if (jokto && jokto.length > 0) {
                    var jokerValue = CardUtil.serverCardValueToClient(config.joker);
                    if (jokto[joktoIndex] && pokerData.showTxt == jokerValue) {
                        var joktoValue = CardUtil.serverCardValueToClient(jokto[joktoIndex]);
                        // console.log(joktoValue);
                        poker.convertLazarillo(joktoValue);
                        joktoIndex++;
                    } else {
                        // console.log(pokerData);
                        poker.showPoker(pokerData);
                    }
                } else {
                    // console.log(pokerData);
                    poker.showPoker(pokerData);
                }
            } else {
                // console.log(PokerData[i]);
                poker.showPoker(pokerData);
            }
        }

        //最后一张牌设置为地主牌 
        if (this.isLandlord) {
            pokerNode[pokerNode.length - 1].getComponent(PokerControl).setCardDiZhu(true);
        }
        if (this.openHandCards) {
            pokerNode[pokerNode.length - 1].getComponent(PokerControl).setCardShow(true);
        }
    },

    //右边玩家明牌
    playerRightShowCard: function playerRightShowCard(myPokerData, myPokerNode, parentNode, sceneWidth) {
        this.initMyCards(myPokerData, myPokerNode, parentNode, sceneWidth, 0);
    },
    neatenRightPoker: function neatenRightPoker(pokerNode, seatPosParam, showWidth, startX, startY) {
        if (pokerNode.length < 1) {
            return;
        }
        var pokerNum = pokerNode.length;
        var needWidth = (pokerNum - 1) * seatPosParam.disBetween + pokerNode[0].getComponent(PokerControl).node.width * seatPosParam.pokerScale;
        showWidth = showWidth || cc.director.getWinSize().width;
        var startPosX = (showWidth - needWidth) / 2;
        startX = startX || startPosX;

        startX = startX + 10 * seatPosParam.disBetween - 64;

        var pokerY = seatPosParam.positionY;
        if (startY) {
            pokerY = startY;
        }

        var len = pokerNode.length;
        if (len <= 10) {
            startX = startX + (10 - len) * seatPosParam.disBetween;
            for (var i = 0; i < pokerNode.length; i++) {
                pokerNode[i].setPosition(startX + i * seatPosParam.disBetween + pokerNode[0].getComponent(PokerControl).node.width * seatPosParam.pokerScale * 0.5, pokerY);
            }
        } else {
            for (var i = 0; i < 10; i++) {
                pokerNode[i].setPosition(startX + i * seatPosParam.disBetween + pokerNode[0].getComponent(PokerControl).node.width * seatPosParam.pokerScale * 0.5, pokerY);
            }
            for (var i = 0; i < len - 10; i++) {
                pokerNode[i + 10].setPosition(startX + i * seatPosParam.disBetween + pokerNode[0].getComponent(PokerControl).node.width * seatPosParam.pokerScale * 0.5, pokerY - 55);
            }
        }
    },
    playCardRight: function playCardRight(pokerNode, startX, startY, jokto) {
        if (pokerNode.length < 1) {
            return;
        }
        var cardScale = 0.5; //0.38
        var disBetween = 37; //27
        var sceneWidth = cc.director.getWinSize().width;
        startX = sceneWidth / 2 + 590 - disBetween * pokerNode.length - 64;

        //设置出去的牌的大小
        for (var i = 0; i < pokerNode.length; i++) {
            pokerNode[i].scale = cardScale;
            var posX = startX + i * disBetween + pokerNode[0].getComponent(PokerControl).node.width * cardScale * 0.5;
            var poker = pokerNode[i].getComponent(PokerControl);
            poker.node.runAction(cc.moveTo(0.2, posX, startY));
        }

        var joktoIndex = 0;
        var curSendCards = this.getCurrentCards();
        for (var i = 0; i < pokerNode.length; i++) {
            var poker = pokerNode[i].getComponent(PokerControl);
            poker.setPokerBg();
            var pokerData = CardUtil.convertCardToClient(curSendCards[i]);
            // poker.showPoker(pokerData);
            if (config.joker != "") {
                //赖子牌值转换
                if (jokto && jokto.length > 0) {
                    var jokerValue = CardUtil.serverCardValueToClient(config.joker);
                    if (jokto[joktoIndex] && pokerData.showTxt == jokerValue) {
                        var joktoValue = CardUtil.serverCardValueToClient(jokto[joktoIndex]);
                        // console.log(joktoValue);
                        poker.convertLazarillo(joktoValue);
                        joktoIndex++;
                    } else {
                        // console.log(pokerData);
                        poker.showPoker(pokerData);
                    }
                } else {
                    // console.log(pokerData);
                    poker.showPoker(pokerData);
                }
            } else {
                // console.log(PokerData[i]);
                poker.showPoker(pokerData);
            }
        }

        //最后一张牌设置为地主牌 
        if (this.isLandlord) {
            pokerNode[pokerNode.length - 1].getComponent(PokerControl).setCardDiZhu(true);
        }
        if (this.openHandCards) {
            pokerNode[pokerNode.length - 1].getComponent(PokerControl).setCardShow(true);
        }
    },

    //其他玩家没有明牌 暗牌出牌 seatNumber//0右边 1下边 2左边
    darkCardSend: function darkCardSend(dispatchCard, cardData, parentNode, seatNumber, sceneWidth, jokto) {

        if (dispatchCard.length > 0) {
            //先清理桌上的牌
            for (var i = 0; i < dispatchCard.length; i++) {
                dispatchCard[i].getComponent(PokerControl).node.removeFromParent();
            }
            dispatchCard = [];
        }
        // console.log(cardData);
        // console.log(jokto);

        var PokerData = cardData;
        for (var i = 0; i < PokerData.length; i++) {
            var cardNode = cc.instantiate(this.pokerCard);
            cardNode.parent = parentNode;

            if (seatNumber == 0) {
                cardNode.scale = config.seatPos.right.pokerScale;
            } else if (seatNumber == 2) {
                cardNode.scale = config.seatPos.left.pokerScale;
            }
            var poker = cardNode.getComponent(PokerControl);
            poker.showPoker(PokerData[i]);
            dispatchCard.push(cardNode);

            if (seatNumber == 0) {
                this.neatenRightPoker(dispatchCard, config.seatPos.right, sceneWidth / 2, sceneWidth / 2 + 140 + 200, 750);
            } else if (seatNumber == 2) {
                this.neatenLeftPoker(dispatchCard, config.seatPos.left, sceneWidth / 2, 230 - 200, 750);
            }
        }
        //最后一张牌设置为地主牌
        if (this.isLandlord && dispatchCard.length > 0) {
            dispatchCard[dispatchCard.length - 1].getComponent(PokerControl).setCardDiZhu(true);
        }
        return dispatchCard;
    },

    //显示闹钟
    showClock: function showClock(time) {
        var clock = this.node_clockDwonTime.getComponent(ClockControl);
        clock.show(time);
    },
    hideClock: function hideClock() {
        this.node_clockDwonTime.active = false;
    },


    //玩家操作结果现实 “叫地主” “抢地主”
    showHint: function showHint(type) {
        var self = this;
        self.node_hint.enabled = true;
        self.showHintType = type;
        var url = "showTips/p_tip_chuno";
        if (type == config.hintType.callLoad) {
            url = "showTips/p_tip_jiaodizhu";
        } else if (type == config.hintType.callLoadNo) {
            url = "showTips/p_tip_jiaodizhuno";
        } else if (type == config.hintType.grabLoad) {
            url = "showTips/p_tip_qiangdizhu";
        } else if (type == config.hintType.grabLoadNo) {
            url = "showTips/p_tip_qiangdizhuno";
        } else if (type == config.hintType.dont) {
            url = "showTips/p_tip_chuno";
        } else if (type == config.hintType.double) {
            url = "showTips/p_tip_jiabei";
        } else if (type == config.hintType.doubleNo) {
            url = "showTips/p_tip_jiabeino";
        } else if (type == config.hintType.waitingDouble) {
            url = "showTips/p_tips_waitingDouble";
        }
        cc.loader.loadRes(url, cc.SpriteFrame, function (err, spriteFrame) {
            self.node_hint.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        });
    },
    hideHint: function hideHint() {
        this.node_hint.enabled = false;
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
        //# sourceMappingURL=Player.js.map
        