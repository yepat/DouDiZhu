
var PokerData = require("PokerData");
var PokerControl = require("PokerControl");
var config = require("config");
var CardUtil = require("CardUtil")
var PopCardUtil = require("PopCardUtil")
var opratOutCardControl = require("opratOutCardControl");
var dialogManager = require("dialogManager");

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

        chupaiBtn : {
            default : null,
            type : cc.Node,
        },

        buchuBtn : {
            default : null,
            type : cc.Node
        },
        canvas:cc.Node, 
        opratOutCard:{
            default : null,
            type : cc.Prefab
        },
    },

    // LIFE-CYCLE CALLBACKS:
    onLoad () {
        //初始化纸牌数据
        PokerData.load();
    },
    start () {
        var self = this;
    
        self.touchBeganX = 0;
        self.leftX = 0;
        self.rightX = 0;
        self.upY = 0;
        self.downY = 0;
        self.isTouchbegan = false;
        //得到第三份数据
        var allPeoplePokerData = PokerData.getPartCardsData()
        var leftPokerData = allPeoplePokerData[0];
        var rightPokerData = allPeoplePokerData[1];
        var myPokerData = allPeoplePokerData[2];
        console.log(config.seatPos);

        //xx_test
        myPokerData = [];
        var myCardValue = [
            3,5,5,5,5,6,6,6,6,9,9,9,10,10,10,"J","J","J","Q","K"//g/G
        ];
        var myCardColor = [
            1,2,3,4,1,2,3,4,1,2,3,4,1,2,3,4,1,2,3,4//"smallG","bigG"
        ]; 
        for(var i = 0;i < myCardValue.length;i++){
            var pokerDataItem = {
                showTxt : myCardValue[i],
                showType : myCardColor[i]
            }
            myPokerData.push(pokerDataItem);
        }
        myPokerData.sort(CardUtil.gradeDown);


        //-----
        // var source = [3,3,3,5,6,7,7,7,9,9,10,10,11,11,12,12,12];
        // var source = [];
        // for(var i=0;i<myCardValue.length;i++){
        //     source[i]=CardUtil.StringToNumber(myCardValue[i]);
        // }
        // console.log("sourcelength:"+source.length);

        // var sameValues = PopCardUtil.getSameCards(myCardValue);
        // PopCardUtil.setSameVulueCardCount(sameValues);

        // for(var k in sameValues){
        //     var d = sameValues[k];
        //     console.log("length_d:"+d.length+"  k:"+k);
        // }
        //-----

        

       
        var myPokerNode = [];
        var leftPokerNode = [];
        var rightPokerNode = [];
        var dispatchCard = [];
        var sceneWidth = cc.director.getWinSize().width;
        //将预制节点放置在界面上
        var scene = cc.director.getScene();
        // var scene = this.pokerLayerMy;

        console.log("sceneWidth:"+sceneWidth);


        for(var i = 0;i < myPokerData.length;i++){
            var cardNode = cc.instantiate(this.pokerCard);
            cardNode.parent = scene;
            cardNode.scale = config.seatPos.center.pokerScale;
            var poker = cardNode.getComponent(PokerControl);
            myPokerData[i].canTouch = true;
            poker.showPoker(myPokerData[i]);
            myPokerNode.push(cardNode);
            this.neatenPoker(myPokerNode,config.seatPos.center,sceneWidth);
        }
        //最后一张牌设置为地主牌
        myPokerNode[myPokerNode.length-1].getComponent(PokerControl).setCardDiZhu(true);

        // for(var i = 0;i < myPokerData.length;i++){ //myPokerData leftPokerData
        //     var cardNode = cc.instantiate(this.pokerCard);
        //     cardNode.parent = scene;
        //     cardNode.scale = config.seatPos.left.pokerScale;
        //     var poker = cardNode.getComponent(PokerControl);
        //     myPokerData[i].canTouch = false;
        //     poker.showPoker(myPokerData[i]);
        //     leftPokerNode.push(cardNode);
        //     this.neatenPoker(leftPokerNode,config.seatPos.left,sceneWidth/2, 230);
        // }

        // for(var i = 0;i < myPokerData.length;i++){ //myPokerData rightPokerData
        //     var cardNode = cc.instantiate(this.pokerCard);
        //     cardNode.parent = scene;
        //     cardNode.scale = config.seatPos.right.pokerScale;
        //     var poker = cardNode.getComponent(PokerControl);
        //     myPokerData[i].canTouch = false;
        //     poker.showPoker(myPokerData[i]);
        //     rightPokerNode.push(cardNode);
        //     this.neatenPoker(rightPokerNode,config.seatPos.right,sceneWidth/2, sceneWidth/2 + 140);
        // }

        this.myPokerData = myPokerData;
        this.myPokerNode = myPokerNode;
        this.dispatchCard = dispatchCard;

        this.sceneWidth = sceneWidth;
        this.scene = scene;
        this.registerEvent();

        this.playerLeftShowCard();
        this.playerRightShowCard();
    },
    //理牌
    neatenPoker(pokerNode,seatPosParam,showWidth,startX){
        if(pokerNode.length < 1){return}
        var pokerNum = pokerNode.length;
        var needWidth = (pokerNum - 1) * seatPosParam.disBetween + pokerNode[0].getComponent(PokerControl).node.width * seatPosParam.pokerScale;
        // console.log("needWidth:" + needWidth);
        showWidth = showWidth || cc.director.getWinSize().width;
        var startPosX = (showWidth - needWidth) / 2;
        startX = startX || startPosX;
        for(var i = 0; i < pokerNode.length; i++){
            pokerNode[i].setPosition(startX + i * seatPosParam.disBetween + pokerNode[0].getComponent(PokerControl).node.width * seatPosParam.pokerScale * 0.5,seatPosParam.positionY);
        }
    },
    //出牌
    playCard(pokerNode){
        if(pokerNode.length < 1){return}
        var cardScale = 0.57
        var disBetween = 40;
        var showCardWidth = (pokerNode.length - 1) * disBetween + pokerNode[0].getComponent(PokerControl).node.width * cardScale;
        // console.log("showCardWidth:"+showCardWidth);
        var sceneWidth = cc.director.getWinSize().width;
        var startX = (sceneWidth - showCardWidth) / 2;
        // console.log("startX:"+startX);
        //设置出去的牌的大小
        for(var i = 0; i < pokerNode.length; i++){
            pokerNode[i].scale = cardScale;
            var posX = startX + i * disBetween + pokerNode[0].getComponent(PokerControl).node.width * cardScale * 0.5;
            // console.log("posX:"+posX);
            var move = cc.moveTo(0.2,posX,500);
            move.easing(cc.easeIn(2));
            var poker = pokerNode[i].getComponent(PokerControl);
            poker.node.runAction(move);

            if(i==pokerNode.length-1){
                poker.setCardDiZhu(true);
            }
        }
    },
    //注册触摸事件
    registerEvent(){
        var self = this;
        var myPokerNode = this.myPokerNode;

        this.canvas.on(cc.Node.EventType.TOUCH_START, function(event){
            // console.log("touchStart");
            if(myPokerNode.length < 1)
            return false;
            var p = event.getLocation();
            // console.log(">>x:"+p.x+">>y:"+p.y);
            self.touchBeganX = p.x;
            self.leftX = 0;
            self.rightX = 10000;
            self.upY = 10000;
            self.downY = 0;
            self.isTouchbegan = true;
            self.setSelectCardByTouch(myPokerNode,p.x,p.y,self.isTouchbegan);

            if (self.isTouchbegan){
                var x1 = myPokerNode[0].getPositionX();
                var x2 = myPokerNode[myPokerNode.length-1].getPositionX();
                var py = myPokerNode[0].getPositionY();
                var psize = myPokerNode[0].getContentSize();
                var pwidth = psize.width;
                var pheight = psize.height;

                var disBetween = 10;
    
                self.leftX = x1-pwidth/2-disBetween;
                self.rightX = x2+pwidth/2+disBetween;
                self.upY = py+pheight/2+40;
                self.downY = py-pheight/2;

                console.log("self.leftX:"+self.leftX+"  self.rightX:"+self.rightX+" self.downY:"+self.downY+"  self.upY:"+ self.upY);
                if (self.isTouchbegan && (p.y > self.upY || p.y < self.downY || p.x < self.leftX || p.x > self.rightX)){
                    self.moveAllCardDown(myPokerNode);
                }
            }
        }, this.node);
        this.canvas.on(cc.Node.EventType.TOUCH_END,function(event){
            // console.log("touchEnd");
            if(myPokerNode.length < 1)
            return;
            var p = event.getLocation();
            self.moveCard(myPokerNode);
        }, this.node);
        this.canvas.on(cc.Node.EventType.TOUCH_MOVE,function(event){
            if(myPokerNode.length < 1)
            return;
            var p = event.getLocation();
            if (Math.abs(self.touchBeganX - p.x) > 40){
                self.isTouchbegan = false;
                self.setSelectCardByTouch(myPokerNode,p.x,p.y,self.isTouchbegan);
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

        var selected = false; //选中状态
        
        for(var i = 0;i < myPokerNode.length;i++){
            var pokerNode = myPokerNode[i];
            var posY = pokerNode.getPositionY();
            var size = pokerNode.getContentSize();
            var posX = pokerNode.getPositionX(); //+ size.width/2;

            var width = size.width;
            var height = size.height;

            var disBetween = config.seatPos.center.disBetween;

            var right = posX - width/2+disBetween;
            var left =  posX - width/2;
            var buttom = posY - height/2;
            var up = posY + height/2;
            //最后一张整张牌都可以点击
            if(i == myPokerNode.length-1){
                right = posX+width/2; 
            }
            // console.log("left:"+left+"  right:"+right+" buttom:"+buttom+" up:"+up);
            // console.log("posX:"+posX+" posY:"+posY+" sizeW:"+width+" sizeH:"+height);
            if ( y >= buttom && y <= up &&
                ((left>= touchStart && left <= touchEnd) || (right>= touchStart && right <= touchEnd) ||
                (touchStart>= left && touchStart <= right) || (touchEnd>= left && touchEnd <= right))){
                    pokerNode.getComponent(PokerControl).setChoosed(true);
                }else{
                    // pokerNode:clearSelection();
             }
        }   
    },
    moveCard(myPokerNode){
        for(var i = 0;i < myPokerNode.length;i++){
            var pokerNode = myPokerNode[i];
            pokerNode.getComponent(PokerControl).cardMove();
        }
    },
    moveAllCardDown(myPokerNode){
        console.log("moveAllCardDown");
        for(var i = 0;i < myPokerNode.length;i++){
            var pokerNode = myPokerNode[i];
            pokerNode.getComponent(PokerControl).cardMoveDown();
        }
    },
    onShow(){
        console.log("onShow");
        this.onMyOutCard();
    },
    onHide(){
        console.log("onHide");
        //智能提牌测试
        var myPokerNode = this.myPokerNode;
        var myPokerData = this.myPokerData;
        var topcards = CardUtil.getMyTopCards(myPokerNode,PokerControl);
        
        var mycards = [];
        for(var i = myPokerData.length - 1; i > -1;i--){
            mycards.push(myPokerData[i].showTxt);
            console.log("xx"+myPokerData[i].showTxt);
        } 
        
        var autocards = CardUtil.getCardsFromTopCards(mycards,topcards);
        if(autocards.length < 1){
        }else{
            this.moveAllCardDown(myPokerNode);//先放下在提起
            CardUtil.AutoChooseLiftUpCard(myPokerNode,PokerControl,autocards);
        } 
    },
    //轮到自己出牌
    onMyOutCard(){
        var self = this;
        var dispatchCard = this.dispatchCard;
        var sceneWidth = this.sceneWidth;
        // var scene = this.scene;
        var scene = cc.director.getScene();

        var myPokerNode = this.myPokerNode;
        var myPokerData = this.myPokerData;

        //牌桌上已经有了出牌，清除掉
        if(dispatchCard.length > 0){
            console.log("dispatchCard.length:"+dispatchCard.length);
            for(var i = 0; i < dispatchCard.length; i++){
                dispatchCard[i].getComponent(PokerControl).node.removeFromParent();
            }
            dispatchCard = [];
        }

        var buchuFunc = function(){
            self.moveAllCardDown(myPokerNode);
        }
        var tishiNum = 0;
        var tishiFunc = function(){
            // var cards = ["3","3","3","7","7"];
            var cards = [5,5,5,6,6,6,7,7];//"3","3","3","3"
            var cardstype = CardUtil.get_topCard_type(cards);
            var myCards = [];
            console.log(cardstype);

            for(var i = myPokerData.length - 1; i > -1;i--){
                var cardValue = CardUtil.StringToNumber(myPokerData[i].showTxt);
                myCards.push(cardValue); 
            }

            var tishicards = CardUtil.get_cards_larger(cardstype,myCards);

            if(tishicards.length == 0){
                console.log("没有符合的牌型可供提示");
                return;
            }

            console.log("xxx:"+tishicards.length);
            console.log(tishicards);

            cards = tishicards[tishiNum];

        
            if(tishiNum<tishicards.length-1){
                tishiNum++;
            }else{
                tishiNum = 0;
            }


            this.node.stopAllActions();
            var callFunc = cc.callFunc(function(){
                CardUtil.AutoChooseLiftUpCard(myPokerNode,PokerControl,cards);
            });
            var delay = cc.delayTime(0.25);
            this.node.runAction(cc.sequence(delay,callFunc));

            self.moveAllCardDown(myPokerNode);
        }
        var chupaiFunc = function(){
            console.log("点击了出牌");
            var topCards = [];
            //获取提起的牌直
            for(var i = myPokerData.length - 1; i > -1;i--){
                if(myPokerData[i].isTopped){
                    var cardValue = CardUtil.StringToNumber(myPokerData[i].showTxt);
                    topCards.push(cardValue);
                }
            }

            if(topCards.length>=1){
                var popCardsType = CardUtil.get_topCard_type(topCards);
                console.log(popCardsType);
                if(popCardsType.type == 0){
                    console.log("提起的牌不合法");
                    return -1;
                }    
            }else{
                console.log("没有牌提起");
                return 0;
            }

            for(var i = myPokerData.length - 1; i > -1;i--){
                    if(myPokerData[i].isTopped){ //myPokerData[i].isChoosed
                    var isChoosedPoker = myPokerNode[i];
                    dispatchCard.unshift(isChoosedPoker);
                    myPokerData.splice(i,1);
                    myPokerNode.splice(i,1);
                }
            }
            self.dispatchCard = dispatchCard;
            //出牌
            self.playCard(dispatchCard);
            self.neatenPoker(myPokerNode,config.seatPos.center,sceneWidth);
            //最后一张牌设置为地主牌
            if(myPokerNode.length>0){
                myPokerNode[myPokerNode.length-1].getComponent(PokerControl).setCardDiZhu(true);
            }
        }
        var opOutCard = cc.instantiate(this.opratOutCard);
        // opOutCard.setPositionX(sceneWidth/2);
        opOutCard.parent = scene;
        var opOutCardControl = opOutCard.getComponent(opratOutCardControl);
        opOutCardControl.show(20,buchuFunc,tishiFunc,chupaiFunc);
    },
    playerLeftShowCard(){
        var leftPokerData = [];
        var leftCardValue = [
            3,5,5,5,5,6,6,6,6,9,9,9,10,10,10,"J","J"//,"J","g","G"
        ];
        var leftCardColor = [
            1,2,3,4,1,2,3,4,1,2,3,4,1,2,3,4,1,2,"smallG","bigG"
        ]; 
        for(var i = 0;i < leftCardValue.length;i++){
            var pokerDataItem = {
                showTxt : leftCardValue[i],
                showType : leftCardColor[i]
            }
            leftPokerData.push(pokerDataItem);
        }
        leftPokerData.sort(CardUtil.gradeDown);

        var leftPokerNode = [];
        var dispatchCard = [];
        var sceneWidth = cc.director.getWinSize().width;
        var scene = this.pokerLayerLeft;

        for(var i = 0;i < leftPokerData.length;i++){
            var cardNode = cc.instantiate(this.pokerCard);
            cardNode.parent = scene;
            cardNode.scale = config.seatPos.left.pokerScale;
            var poker = cardNode.getComponent(PokerControl);
            leftPokerData[i].canTouch = false;
            poker.showPoker(leftPokerData[i]);
            leftPokerNode.push(cardNode);
            this.neatenLeftPoker(leftPokerNode,config.seatPos.left,sceneWidth/2, 230);
        }
        leftPokerNode[leftPokerNode.length-1].getComponent(PokerControl).setCardDiZhu(true);

        //出牌
        var cards = [3];//,5,5,5,5,6,6,6,6,9,9,9,10,10,10
        // cards.sort(config.arrayDown);
        var index = 0;
        for(var i = leftPokerData.length - 1; i > -1;i--){
            var cardValue = CardUtil.StringToNumber(leftPokerData[i].showTxt);
            // var index = leftPokerData.length - 1 - i;
            console.log("cardValue:"+cardValue+"index:"+index);

            if(cards[index]&&cards[index]==cardValue){ //myPokerData[i].isChoosed
                console.log("cards:"+cards[index]);
                var isChoosedPoker = leftPokerNode[i];
                dispatchCard.unshift(isChoosedPoker);
                leftPokerData.splice(i,1);
                leftPokerNode.splice(i,1);
            }
            index++;
        }
        // self.dispatchCard = dispatchCard;
        //出牌
        this.playCardLeft(dispatchCard,320,650);
        this.neatenLeftPoker(leftPokerNode,config.seatPos.left,sceneWidth/2, 230);
        //最后一张牌设置为地主牌
        if(leftPokerNode.length>0){
            leftPokerNode[leftPokerNode.length-1].getComponent(PokerControl).setCardDiZhu(true);
        }

    },
    neatenLeftPoker(pokerNode,seatPosParam,showWidth,startX){
        if(pokerNode.length < 1){return}
        var pokerNum = pokerNode.length;
        var needWidth = (pokerNum - 1) * seatPosParam.disBetween + pokerNode[0].getComponent(PokerControl).node.width * seatPosParam.pokerScale;
        showWidth = showWidth || cc.director.getWinSize().width;
        var startPosX = (showWidth - needWidth) / 2;
        startX = startX || startPosX;

        var len = pokerNode.length;
        if(len<=10){
            for(var i = 0; i < pokerNode.length; i++){
                pokerNode[i].setPosition(startX + i * seatPosParam.disBetween + pokerNode[0].getComponent(PokerControl).node.width * seatPosParam.pokerScale * 0.5,seatPosParam.positionY);
            }
        }else{
            for(var i = 0; i < 10; i++){
                pokerNode[i].setPosition(startX + i * seatPosParam.disBetween + pokerNode[0].getComponent(PokerControl).node.width * seatPosParam.pokerScale * 0.5,seatPosParam.positionY);
            }

            for(var i=0;i<len-10;i++){
                pokerNode[i+10].setPosition(startX + i * seatPosParam.disBetween + pokerNode[0].getComponent(PokerControl).node.width * seatPosParam.pokerScale * 0.5,seatPosParam.positionY-55);
            }
        }
    },
    //左边出牌
    playCardLeft(pokerNode,startX,startY){
        if(pokerNode.length < 1){return}
        var cardScale = 0.38;
        var disBetween = 27;
        var showCardWidth = (pokerNode.length - 1) * disBetween + pokerNode[0].getComponent(PokerControl).node.width * cardScale;
        // console.log("showCardWidth:"+showCardWidth);
        var sceneWidth = cc.director.getWinSize().width;
        // var startX = (sceneWidth/2 - showCardWidth) / 2;

        // console.log("startX:"+startX);
        //设置出去的牌的大小
        for(var i = 0; i < pokerNode.length; i++){
            pokerNode[i].scale = cardScale;
            var posX = startX + i * disBetween + pokerNode[0].getComponent(PokerControl).node.width * cardScale * 0.5;
            // console.log("posX:"+posX);
            var poker = pokerNode[i].getComponent(PokerControl);
            poker.node.runAction(cc.moveTo(0.2,posX,startY));

            if(i==pokerNode.length-1){
                poker.setCardDiZhu(true);
            }
        }
    },

    //右边玩家明牌
    playerRightShowCard(){

        var rightPokerData = [];
        var rightCardValue = [
            3,5,5,5,5,6,6,6,6,9,9,9,10,10,10,"J","J","J","g","G"
        ];
        var rightCardColor = [
            1,2,3,4,1,2,3,4,1,2,3,4,1,2,3,4,1,2,"smallG","bigG"
        ]; 
        for(var i = 0;i < rightCardValue.length;i++){
            var pokerDataItem = {
                showTxt : rightCardValue[i],
                showType : rightCardColor[i]
            }
            rightPokerData.push(pokerDataItem);
        }
        rightPokerData.sort(CardUtil.gradeDown);

        var rightPokerNode = [];
        var dispatchCard = [];
        var sceneWidth = cc.director.getWinSize().width;
        var scene = this.pokerLayerRight;

        for(var i = 0;i < rightPokerData.length;i++){
            var cardNode = cc.instantiate(this.pokerCard);
            cardNode.parent = scene;
            cardNode.scale = config.seatPos.right.pokerScale;
            var poker = cardNode.getComponent(PokerControl);
            rightPokerData[i].canTouch = false;
            poker.showPoker(rightPokerData[i]);
            rightPokerNode.push(cardNode);
            this.neatenRightPoker(rightPokerNode,config.seatPos.right,sceneWidth/2, sceneWidth/2 + 140);
        }

         //出牌
         var cards = [3,5,5,5,5,6,6,6,9,9,9,10,10,10,"J","J","J"];//,5,5,5,5,6,6,6,6
         // cards.sort(config.arrayDown);
         var index = 0;
         for(var i = rightPokerData.length - 1; i > -1;i--){
             var cardValue = CardUtil.StringToNumber(rightPokerData[i].showTxt);

             console.log("cardValueB:"+cardValue+"indexB:"+index);
        
             if(cards[index]&&cards[index]==cardValue){ //myPokerData[i].isChoosed
                 console.log("cardsB:"+cards[index]);
                 var isChoosedPoker = rightPokerNode[i];
                 dispatchCard.unshift(isChoosedPoker);
                 rightPokerData.splice(i,1);
                 rightPokerNode.splice(i,1);
             }
             index++;
         }
         // self.dispatchCard = dispatchCard;
         //出牌
         this.playCardRight(dispatchCard,620,650);
         this.neatenRightPoker(rightPokerNode,config.seatPos.right,sceneWidth/2, sceneWidth/2 + 140);
         //最后一张牌设置为地主牌
        //  if(leftPokerNode.length>0){
        //      leftPokerNode[leftPokerNode.length-1].getComponent(PokerControl).setCardDiZhu(true);
        //  }

    },
    neatenRightPoker(pokerNode,seatPosParam,showWidth,startX){
        if(pokerNode.length < 1){return}
        var pokerNum = pokerNode.length;
        var needWidth = (pokerNum - 1) * seatPosParam.disBetween + pokerNode[0].getComponent(PokerControl).node.width * seatPosParam.pokerScale;
        showWidth = showWidth || cc.director.getWinSize().width;
        var startPosX = (showWidth - needWidth) / 2;
        startX = startX || startPosX;

        startX = startX + 10*seatPosParam.disBetween;

        var len = pokerNode.length;
        if(len<=10){
            startX = startX + (10 - len)*seatPosParam.disBetween;
            for(var i = 0; i < pokerNode.length; i++){
                pokerNode[i].setPosition(startX + i * seatPosParam.disBetween + pokerNode[0].getComponent(PokerControl).node.width * seatPosParam.pokerScale * 0.5,seatPosParam.positionY);
            }
        }else{
            for(var i = 0; i < 10; i++){
                pokerNode[i].setPosition(startX + i * seatPosParam.disBetween + pokerNode[0].getComponent(PokerControl).node.width * seatPosParam.pokerScale * 0.5,seatPosParam.positionY);
            }

            for(var i=0;i<len-10;i++){
                pokerNode[i+10].setPosition(startX + i * seatPosParam.disBetween + pokerNode[0].getComponent(PokerControl).node.width * seatPosParam.pokerScale * 0.5,seatPosParam.positionY-55);
            }
        }
    },

    playCardRight(pokerNode,startX,startY){
        if(pokerNode.length < 1){return}
        var cardScale = 0.38;
        var disBetween = 27;
        var showCardWidth = (pokerNode.length - 1) * disBetween + pokerNode[0].getComponent(PokerControl).node.width * cardScale;
        // console.log("showCardWidth:"+showCardWidth);
        var sceneWidth = cc.director.getWinSize().width;
        // var startX = (sceneWidth/2 - showCardWidth) / 2;

        startX = sceneWidth/2 + 590 - disBetween*pokerNode.length;

        // console.log("startX:"+startX);
        //设置出去的牌的大小
        for(var i = 0; i < pokerNode.length; i++){
            pokerNode[i].scale = cardScale;
            var posX = startX + i * disBetween + pokerNode[0].getComponent(PokerControl).node.width * cardScale * 0.5;
            // console.log("posX:"+posX);
            var poker = pokerNode[i].getComponent(PokerControl);
            poker.node.runAction(cc.moveTo(0.2,posX,startY));

            // if(i==pokerNode.length-1){
            //     poker.setCardDiZhu(true);
            // }
        }
    },

    //按钮点击事件
    btnBackClick(){
        console.log("btnBackClick");
        cc.director.loadScene("HallScene");
    },
    btnDelegateClick(){
        console.log("btnDelegateClick");
        dialogManager.showCancelDelegate();
    },
    btnSetClick(){
        console.log("btnSetClick");
        dialogManager.showSetDialog();
    },
    btnJiPaiQiClick(){
        console.log("btnJiPaiQiClick");
    },
    btnChatClick(){
        console.log("btnChatClick");
    }
});
