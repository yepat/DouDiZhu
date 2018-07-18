var PokerControl = require("PokerControl");
var config = require("config");
var CardUtil = require("CardUtil");
var GameNetMgr = require("GameNetMgr");
cc.Class({
    extends: cc.Component,

    properties: {
        pokerCard : {
            default : null,
            type : cc.Prefab
        },
    },
    onLoad () {
        this.index = -1;
    },
    start () {
        // var cards = ["25", "15", "14", "43"];
        // this.show(cards);
    },   
    show(lazCards,index,parentNode){
        this.index = index;
        this.lazCards = lazCards;
        this.parentNode = parentNode;

        var cards = lazCards[0];
        var pokerData = CardUtil.serverCardsToClient(cards);
        var jokto = lazCards[1];
        var joktoIndex = 0;
        var jokerValue = CardUtil.serverCardValueToClient(config.joker);
        for(var i = 0;i < pokerData.length;i++){
            var cardNode = cc.instantiate(this.pokerCard);
            cardNode.parent = this.node;
            cardNode.scale = 0.3;
            var poker = cardNode.getComponent(PokerControl);
            pokerData[i].canTouch = false;
            if(jokto[joktoIndex] && pokerData[i].showTxt == jokerValue){
                var joktoValue = CardUtil.serverCardValueToClient(jokto[joktoIndex]);
                poker.convertLazarillo(joktoValue);
                joktoIndex++;
            }else{
                poker.showPoker(pokerData[i]);
            }
        }
    },
    Click(){
        console.log("cardlist click");
        if(this.index != -1){
            console.log("index = ",this.index);
            var jackto = this.lazCards[1];
            for(var i=0;i<jackto.length;i++){
                jackto[i] = CardUtil.serverCardValueToServer(jackto[i]);
            }
            GameNetMgr.sendRequest("Game","sendCard",{0:this.lazCards[0],1:jackto});
            if(this.parentNode){
                console.log("-----parentNode.closeClick");
                this.parentNode.closeClick();
            }
        }
    }
});
