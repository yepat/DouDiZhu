
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
var ClockControl = require("ClockControl");


var Player = cc.Class({
    
    ctor:function (parm) {
        if(!parm)
            return;
        this.uid = parm.uid;
        this.nickname = parm.nickname;
        this.gender = parm.gender;
        this.coin = parm.coin;
        this.gold = parm.gold;
        this.lequan = parm.lequan;
        this.propDress = parm.propDress;//玩家服装
        this.seatId = parm.myseat;//座位id（服务器端）
        this.roomid = parm.roomid;
        this.tableid = parm.tableid;
        this.signature = parm.signature;//个性签名
        this.buff = parm.buff;
        this.wechatImg = parm.wechatImg;
        this.title = parm.title;//称号
        this.emoticon = parm.emoticon;//表情包
        this.emoticonItems = parm.emoticonItems;//表情包道具

        this.state  = -1;
        this.seatNumber = 0;    //座位编号(客户端) 0右边 1下边 2左边
        this.isLandlord = false; // 是否是地主
        this.cardCount = 0; //手牌数量
        this.isDelegated = false;//是否托管
        this.jokerValue = -1; //癞子牌值
        this.openHandCards = false;//是否明牌

        this.currentCards    = {};    //最近一次出的牌
        this.curSendedCards  = {};    //最近一次出的牌的面值
        this.cards           = {};    //所有牌
        this.smallcards      = {};    //小牌（纯粹用于计数）
        this.noteCards       = {};    //记牌器
        this.lordCard    = {};         //地主牌
        this.currentCardType = 0;      //最近一次出的牌的牌型
        this.noteCards       = "";    //记牌器(剩余没出出去的全部牌)
        this.joktoCards      = {};    //最近一次出的牌里癞子当的牌
        this.jokerCardsValue = {};    //最近一次出的牌里癞子当的牌的值


        //玩家信息节点
        this.node_name = null;//昵称
        this.node_LeDou = null;//乐斗
        this.node_LeQuan = null;//乐券
        this.node_cardsNum = null;//剩余牌数 
        this.node_Landlord = null;//地主标志
        this.node_delegate = null;//托管标志
        this.node_hint = null;//操作显示语 “要不起”
        this.node_clockDwonTime = null;//闹钟倒计时
        this.node_wechatImg = null;//微信头像
        this.pokerCard = null;//预设扑克牌
        this.node_alarm = null;//警报装置
    },
    initInfo(parm){
        this.uid = parm.uid;
        this.nickname = parm.nickname;
        this.gender = parm.gender;
        this.coin = parm.coin;
        this.gold = parm.gold;
        this.propDress = parm.propDress;//玩家服装
        this.seatId = parm.myseat;//座位id（服务器端）
        this.roomid = parm.roomid;
        this.tableid = parm.tableid;
        this.signature = parm.signature;//个性签名
        this.buff = parm.buff;
        this.wechatImg = parm.wechatImg;
        this.title = parm.title;//称号
        this.emoticon = parm.emoticon;//表情包
        this.emoticonItems = parm.emoticonItems;//表情包道具
    },
    initNodes(nodes){//初始化玩家节点信息
        this.node_name = nodes.node_name;//昵称
        this.node_LeDou = nodes.node_LeDou;//乐斗
        this.node_LeQuan = nodes.node_LeQuan;//乐券
        this.node_cardsNum = nodes.node_cardsNum;//剩余牌数 
        this.node_Landlord = nodes.node_Landlord;//地主标志
        this.node_delegate = nodes.node_delegate;//托管标志
        this.node_hint = nodes.node_hint;//操作显示语 “要不起”
        this.node_clockDwonTime = nodes.node_clockDwonTime;//闹钟倒计时
        this.node_wechatImg = nodes.node_wechatImg;//微信头像
        this.pokerCard = nodes.pokerCard;//预设扑克牌
        this.node_alarm = nodes.node_alarm;//警报装置
    },
    //初始化玩家基础信息
    initBaseInfo(){
        console.log("初始化玩家基础信息");
        this.setnickname(this.nickname);
        this.setCoin(this.coin); 
        this.setLeQuan(this.lequan); 
        this.setWechatImg(this.wechatImg);
        this.setCardCount(17);
    },
    clear(){
        this.cardCount = 0; //手牌数量
        this.currentCardType = 0;     //最近一次出的牌的牌型
        this.jokerValue     = -1;
        this.preSelectedCardIdx = -1;
        this.curSendedCards = {};
        this.currentCards = {};
        this.cards = {};
        this.smallcards  = {};
        this.lordCard    = {};
        this.joktoCards  = {};
        this.jokerCardsValue  = {};
        this.sendCardPos = {};
        this.noteCards   = {};

        this.state  = -1;
        this.seatNumber = 0;    //座位编号(客户端) 0右边 1下边 2左边
        this.isLandlord = false; // 是否是地主
        this.isDelegated = false;//是否托管
        this.openHandCards = false;//是否明牌

        if(this.node_Landlord){
            this.node_Landlord.enabled = false;
        }
        if(this.node_delegate){
            this.node_delegate.enabled = false;
        }
        if(this.node_hint){
            this.node_hint.enabled = false;
        }
        if(this.node_clockDwonTime){
            this.node_clockDwonTime.active = false;
        }
        if(this.node_alarm){
            this.node_alarm.active = false;
        }
    },
    setOpenHandCards(blt){
        this.openHandCards = blt;
    },
    getOpenHandCards(){
        return this.openHandCards;
    },
    setDelegated(isDelegated){
        this.isDelegated = isDelegated;
        if(isDelegated&&this.node_delegate){
            this.node_delegate.enabled = true;
        }else if(this.node_delegate){
            this.node_delegate.enabled = false;
        }
    },
    getDelegated(){
        return this.isDelegated;
    },
    setLandlord(isLandlord){
        this.isLandlord = isLandlord;
        if(isLandlord&&this.node_Landlord){
            this.node_Landlord.enabled = true;
        }
    },
    getLandlord(){
        return this.isLandlord;
    },
    setRoomId(roomid){
        this.roomid = roomid;
    },
    getRoomId(){
        return this.roomid;
    },
    setTableId(tableid){
        this.tableid = tableid;
    },
    getTableId(){
        return this.tableid;
    },
    setSignature(signature){
        this.signature = signature;
    },
    getSignature(){
        return this.signature;
    },
    setBuff(buff){
        this.buff = buff;
    },
    getBuff(){
        return this.buff;
    },
    setnickname(nickname){
        this.nickname = nickname;
        if(this.node_name){
            this.node_name.string = config.parseString(nickname);
        }
    },
    getNickname(){
        return this.nickname;
    },
    getWechatImg(){
        return this.wechatImg;
    },
    setWechatImg(wechatImg){
        var self = this;
        this.wechatImg = wechatImg;
        wechatImg = ""+wechatImg;
        if(wechatImg.length < 2){
            cc.loader.loadRes("defult_head",cc.SpriteFrame,function(err,spriteFrame){
                self.node_wechatImg.getComponent(cc.Sprite).spriteFrame = spriteFrame;
            });
            return;
        }
        var imgUrl = wechatImg + "?aa=aa.jpg";
        if(this.node_wechatImg){
            cc.loader.load(imgUrl, function(err, texture){
                self.node_wechatImg.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
            });
        }
    },
    getTitle(){
        return this.title;
    },
    setTitle(title){
        this.title = title;
    },
    setCoin(coin){
        this.coin = coin;     
        if(this.node_LeDou){
            this.node_LeDou.string = "" + config.parseNumber(coin);
        }
    },

    setLeQuan(lequan){
        this.lequan = lequan;
        if(this.node_LeQuan){
            this.node_LeQuan.string = ""+config.parseNumber(lequan);
        }
    },
    getLeQuan(){
        return this.lequan;
    },

    setWinCoin(coin){
        this.winCoin = coin;
    },
    getWinCoin(){
        return this.winCoin;
    },
    getIsWinner(){
        return this.isWinner;
    },
    setIsWinner(win){
        this.isWinner = win;
    },
    getCoin(){
        return this.coin;
    },
    setGold(gold){
        this.gold = gold;
    },
    getGold(){
        return this.gold;
    },
    setCoinNode(node){
        this.node_Coin = node;
    },
    setFlagNode(node){
        this.node_Flag = node;
    },
    setCardCount(num){
        this.cardCount = num;
        if(this.node_cardsNum){
            this.node_cardsNum.string = ""+num;
        }
    },
    getCardCount(){
        return this.cardCount;
    },
    setJockerVlue(jokerValue){
        this.jokerValue = jokerValue
    },
    //身份得到确认
    refreshIdentity(){
    },
    getGender(){
        return this.gender;
    },
    getMySeatId(){
        return this.seatId;
    },
    setMySeatId(seatId){
        this.seatId = seatId;
    },
    setMySeatNum(seatNumber){
        this.seatNumber = seatNumber;
    },
    getMySeatNum(){
        return this.seatNumber;
    },
    //设置癞子当的牌
    setJoktoCards(joktoCards){
        this.joktoCards = joktoCards;
    },
    //获得癞子当的牌
    getJoktoCards(){
        return this.joktoCards;
    },
    //癞子牌面值
    setJokerCardsValue(jokerCardsValue){
        this.jokerCardsValue = jokerCardsValue;
    },
    setPokerCard(pokerCard){
        this.pokerCard = pokerCard;
    },
    //初始化自己的牌
    initMyCards(myPokerData,myPokerNode,parentNode,sceneWidth,seatNumber){ //0右边 1下边 2左边
        for(var i = 0;i < myPokerData.length;i++){
            var cardNode = cc.instantiate(this.pokerCard);
            cardNode.parent = parentNode;

            if(seatNumber == 0){
                cardNode.scale = config.seatPos.right.pokerScale;
            }else if(seatNumber == 2){
                cardNode.scale = config.seatPos.left.pokerScale;
            }else{
                cardNode.scale = config.seatPos.center.pokerScale;
            }
            var poker = cardNode.getComponent(PokerControl);
            myPokerData[i].canTouch = true;
            poker.showPoker(myPokerData[i]);
            myPokerNode.push(cardNode);

            if(seatNumber == 0){
                this.neatenRightPoker(myPokerNode,config.seatPos.right,sceneWidth/2, sceneWidth/2 + 140);
            }else if(seatNumber == 2){
                this.neatenLeftPoker(myPokerNode,config.seatPos.left,sceneWidth/2, 230);
            }else{
                this.neatenPoker(myPokerNode,config.seatPos.center,sceneWidth);
            }  
        }
        //最后一张牌设置为地主牌
        if(this.isLandlord){
            myPokerNode[myPokerNode.length-1].getComponent(PokerControl).setCardDiZhu(true);
        }
        if(this.openHandCards){
            myPokerNode[myPokerNode.length-1].getComponent(PokerControl).setCardShow(true);
        }
        return myPokerNode;
    },
    //理牌
    neatenPoker(pokerNode,seatPosParam,showWidth,startX,seatNumber){
        if(pokerNode.length < 1){return}
        var pokerNum = pokerNode.length;
        var needWidth = (pokerNum - 1) * seatPosParam.disBetween + pokerNode[0].getComponent(PokerControl).node.width * seatPosParam.pokerScale;
        // console.log("needWidth:" + needWidth);
        showWidth = showWidth || cc.director.getWinSize().width;
        var startPosX = (showWidth - needWidth) / 2;
        startX = startX || startPosX;
        for(var i = 0; i < pokerNode.length; i++){
            pokerNode[i].setPosition(startX + i * seatPosParam.disBetween + pokerNode[0].getComponent(PokerControl).node.width * seatPosParam.pokerScale * 0.5,seatPosParam.positionY);
            //把提出的牌设置 未提出
            // var pokerNode = pokerNode[i];
            pokerNode[i].getComponent(PokerControl).setMoveDown();
        }
    },
    clearTableCard(dispatchCard){
        if(dispatchCard&&dispatchCard.length > 0){ //先清理桌上的牌
            for(var i = 0; i < dispatchCard.length; i++){
                dispatchCard[i].getComponent(PokerControl).node.removeFromParent();
            }
            dispatchCard = [];
        }
    },
    getSendCard(dispatchCard,cards,PokerNode,PokerData){ //获取要出的牌
        if(dispatchCard&&dispatchCard.length > 0){ //先清理桌上的牌
            for(var i = 0; i < dispatchCard.length; i++){
                dispatchCard[i].getComponent(PokerControl).node.removeFromParent();
            }
            dispatchCard = [];
        }
        var index = 0;
        // for(var i = PokerData.length - 1; i > -1;i--){
        //     var cardValue = CardUtil.StringToNumber(PokerData[i].showTxt);
        //     if(index<cards.length&&cards[index]==cardValue){ 
        //         console.log("cards:"+cards[index]);
        //         var isChoosedPoker = PokerNode[i];
        //         dispatchCard.unshift(isChoosedPoker);
        //         PokerData.splice(i,1);
        //         PokerNode.splice(i,1);
        //         index++;
        //     }
        // }
        for(var i = PokerData.length - 1; i > -1;i--){ //这里要添加花色判断
            var cardValue = CardUtil.StringToNumber(PokerData[i].showTxt);
            var cardType = CardUtil.StringToNumber(PokerData[i].showType);
            if(index<cards.length&&cards[index].showTxt==cardValue&&cards[index].showType==cardType){
                console.log("cards:"+cards[index].showTxt);
                var isChoosedPoker = PokerNode[i];
                dispatchCard.unshift(isChoosedPoker);
                PokerData.splice(i,1);
                PokerNode.splice(i,1);
                index++;
            }
        }
        return dispatchCard;
    },
    //出牌
    playCard(pokerNode){
        if(pokerNode.length < 1){return}
        var cardScale = 0.57
        var disBetween = 40;
        var showCardWidth = (pokerNode.length - 1) * disBetween + pokerNode[0].getComponent(PokerControl).node.width * cardScale;
        var sceneWidth = cc.director.getWinSize().width;
        var startX = (sceneWidth - showCardWidth) / 2;
        //设置出去的牌的大小

        for(var i = 0; i < pokerNode.length; i++){
            pokerNode[i].scale = cardScale;
            var posX = startX + i * disBetween + pokerNode[0].getComponent(PokerControl).node.width * cardScale * 0.5;
            var move = cc.moveTo(0.2,posX,500);
            move.easing(cc.easeIn(2));
            var poker = pokerNode[i].getComponent(PokerControl);
            poker.node.runAction(move);

            //最后一张牌设置为地主牌 
            if(this.isLandlord&&i==pokerNode.length-1){
                poker.setCardDiZhu(true);
            }
            if(this.openHandCards&&i==pokerNode.length-1){
                poker.setCardShow(true);
            }
        }
    },
    //左边玩家明牌
    playerLeftShowCard(myPokerData,myPokerNode,parentNode,sceneWidth){
        this.initMyCards(myPokerData,myPokerNode,parentNode,sceneWidth,2); //0右边 1下边 2左边
    },
    neatenLeftPoker(pokerNode,seatPosParam,showWidth,startX,startY){
        if(pokerNode.length < 1){return}
        var pokerNum = pokerNode.length;
        var needWidth = (pokerNum - 1) * seatPosParam.disBetween + pokerNode[0].getComponent(PokerControl).node.width * seatPosParam.pokerScale;
        showWidth = showWidth || cc.director.getWinSize().width;
        var startPosX = (showWidth - needWidth) / 2;
        startX = startX || startPosX;

        var pokerY = seatPosParam.positionY;
        if(startY){
            pokerY = startY;
        }

        var len = pokerNode.length;
        if(len<=10){
            for(var i = 0; i < pokerNode.length; i++){
                pokerNode[i].setPosition(startX + i * seatPosParam.disBetween + pokerNode[0].getComponent(PokerControl).node.width * seatPosParam.pokerScale * 0.5,pokerY);
            }
        }else{
            for(var i = 0; i < 10; i++){
                pokerNode[i].setPosition(startX + i * seatPosParam.disBetween + pokerNode[0].getComponent(PokerControl).node.width * seatPosParam.pokerScale * 0.5,pokerY);
            }

            for(var i=0;i<len-10;i++){
                pokerNode[i+10].setPosition(startX + i * seatPosParam.disBetween + pokerNode[0].getComponent(PokerControl).node.width * seatPosParam.pokerScale * 0.5,pokerY-55);
            }
        }
    },
    //左边出牌
    playCardLeft(pokerNode,startX,startY){
        if(pokerNode.length < 1){return}
        var cardScale = 0.38;
        var disBetween = 27;
        var showCardWidth = (pokerNode.length - 1) * disBetween + pokerNode[0].getComponent(PokerControl).node.width * cardScale;
        var sceneWidth = cc.director.getWinSize().width;
    
        //设置出去的牌的大小
        for(var i = 0; i < pokerNode.length; i++){
            pokerNode[i].scale = cardScale;
            var posX = startX + i * disBetween + pokerNode[0].getComponent(PokerControl).node.width * cardScale * 0.5;
            // console.log("posX:"+posX);
            var poker = pokerNode[i].getComponent(PokerControl);
            poker.node.runAction(cc.moveTo(0.2,posX,startY));

            if(this.isLandlord&&i==pokerNode.length-1){
                poker.setCardDiZhu(true);
            }
            if(this.openHandCards&&i==pokerNode.length-1){
                poker.setCardShow(true);
            }
        }
    },
    //右边玩家明牌
    playerRightShowCard(myPokerData,myPokerNode,parentNode,sceneWidth){
        this.initMyCards(myPokerData,myPokerNode,parentNode,sceneWidth,0);
    },
    neatenRightPoker(pokerNode,seatPosParam,showWidth,startX,startY){
        if(pokerNode.length < 1){return}
        var pokerNum = pokerNode.length;
        var needWidth = (pokerNum - 1) * seatPosParam.disBetween + pokerNode[0].getComponent(PokerControl).node.width * seatPosParam.pokerScale;
        showWidth = showWidth || cc.director.getWinSize().width;
        var startPosX = (showWidth - needWidth) / 2;
        startX = startX || startPosX;

        startX = startX + 10*seatPosParam.disBetween;

        var pokerY = seatPosParam.positionY;
        if(startY){
            pokerY = startY;
        }

        var len = pokerNode.length;
        if(len<=10){
            startX = startX + (10 - len)*seatPosParam.disBetween;
            for(var i = 0; i < pokerNode.length; i++){
                pokerNode[i].setPosition(startX + i * seatPosParam.disBetween + pokerNode[0].getComponent(PokerControl).node.width * seatPosParam.pokerScale * 0.5,pokerY);
            }
        }else{
            for(var i = 0; i < 10; i++){
                pokerNode[i].setPosition(startX + i * seatPosParam.disBetween + pokerNode[0].getComponent(PokerControl).node.width * seatPosParam.pokerScale * 0.5,pokerY);
            }
            for(var i=0;i<len-10;i++){
                pokerNode[i+10].setPosition(startX + i * seatPosParam.disBetween + pokerNode[0].getComponent(PokerControl).node.width * seatPosParam.pokerScale * 0.5,pokerY-55);
            }
        }
    },
    playCardRight(pokerNode,startX,startY){
        if(pokerNode.length < 1){return}
        var cardScale = 0.38;
        var disBetween = 27;
        var showCardWidth = (pokerNode.length - 1) * disBetween + pokerNode[0].getComponent(PokerControl).node.width * cardScale;
        var sceneWidth = cc.director.getWinSize().width;
        startX = sceneWidth/2 + 590 - disBetween*pokerNode.length;

        //设置出去的牌的大小
        for(var i = 0; i < pokerNode.length; i++){
            pokerNode[i].scale = cardScale;
            var posX = startX + i * disBetween + pokerNode[0].getComponent(PokerControl).node.width * cardScale * 0.5;
            var poker = pokerNode[i].getComponent(PokerControl);
            poker.node.runAction(cc.moveTo(0.2,posX,startY));
            if(this.isLandlord&&i==pokerNode.length-1){
                poker.setCardDiZhu(true);
            }
            if(this.openHandCards&&i==pokerNode.length-1){
                poker.setCardShow(true);
            }
        }
    },
    //其他玩家没有明牌 暗牌出牌 seatNumber//0右边 1下边 2左边
    darkCardSend(dispatchCard,cardData,parentNode,seatNumber,sceneWidth){
        
        if(dispatchCard.length > 0){ //先清理桌上的牌
            for(var i = 0; i < dispatchCard.length; i++){
                dispatchCard[i].getComponent(PokerControl).node.removeFromParent();
            }
            dispatchCard = [];
        }

        cardData.sort(CardUtil.gradeDown);

        var PokerData = cardData;
        
        for(var i = 0;i < PokerData.length;i++){
            var cardNode = cc.instantiate(this.pokerCard);
            cardNode.parent = parentNode;

            if(seatNumber == 0){
                cardNode.scale = config.seatPos.right.pokerScale;
            }else if(seatNumber == 2){
                cardNode.scale = config.seatPos.left.pokerScale;
            }
            var poker = cardNode.getComponent(PokerControl);
            poker.showPoker(PokerData[i]);
            dispatchCard.push(cardNode);

            if(seatNumber == 0){
                this.neatenRightPoker(dispatchCard,config.seatPos.right,sceneWidth/2, sceneWidth/2 + 140+200,750);
            }else if(seatNumber == 2){
                this.neatenLeftPoker(dispatchCard,config.seatPos.left,sceneWidth/2, 230-200,750);
            } 
        }
        //最后一张牌设置为地主牌
        if(this.isLandlord){
            dispatchCard[dispatchCard.length-1].getComponent(PokerControl).setCardDiZhu(true);
        } 
        // if(this.openHandCards&&i==pokerNode.length-1){
        //     dispatchCard[dispatchCard.length-1].getComponent(PokerControl).setCardShow(true);
        // }
        return dispatchCard;
    },


    //显示闹钟
    showClock(time){
        var clock = this.node_clockDwonTime.getComponent(ClockControl);
        clock.show(time);
    },
    hideClock(){
        this.node_clockDwonTime.active = false;
    },

    //玩家操作结果现实 “叫地主” “抢地主”
    showHint(type){
        var self = this;
        self.node_hint.enabled = true;
        var url = "showTips/p_tip_chuno";
        if(type == config.hintType.callLoad){
            url = "showTips/p_tip_jiaodizhu";
        }else if(type == config.hintType.callLoadNo){
            url = "showTips/p_tip_jiaodizhuno";
        }else if(type == config.hintType.grabLoad){
            url = "showTips/p_tip_qiangdizhu";
        }else if(type == config.hintType.grabLoadNo){
            url = "showTips/p_tip_qiangdizhuno";
        }else if(type == config.hintType.dont){
            url = "showTips/p_tip_chuno";
        }
        cc.loader.loadRes(url,cc.SpriteFrame,function(err,spriteFrame){
            self.node_hint.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        });
    },
    hideHint(){
        this.node_hint.enabled = false;
    },
});


