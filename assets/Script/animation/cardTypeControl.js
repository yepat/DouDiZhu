var config = require("config");
cc.Class({
    extends: cc.Component,

    properties: {
        myCardtype : {
            default : null,
            type : cc.Sprite
        },
    },
    start () {
        var self = this;
        var callFunc = cc.callFunc(function(){
            self.node.destroy();
        });
        var delay = cc.delayTime(2);
        this.node.runAction(cc.sequence(delay,callFunc));
    },
    close(){
        this.node.destroy();
    },
    show(cardType){
        var self = this;
        var numUrl = "showTips/p_cardtype_1";
        if(cardType == config.CardType.Straight){
        }else if(cardType == config.CardType.StraightDouble){
            numUrl = "showTips/p_cardtype_2";
        }
        cc.loader.loadRes(numUrl,cc.SpriteFrame,function(err,spriteFrame){
            self.myCardtype.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        });
    }

});
