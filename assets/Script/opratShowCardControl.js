var config = require("config");
cc.Class({
    extends: cc.Component,

    properties: {
        spNum : {
            default : null,
            type : cc.Sprite
        },
    },

    start () {
        // this.show(5,null);
    },
    show(click){
        this.click =  click;
        var self = this;
        this.time = 5;
        this.spTxt = "operation_btn/p_add";

        this.schedule(function() {
            if(this.time > 2){
                this.time -= 1;
                var spurl = this.spTxt+this.time;
                cc.loader.loadRes(spurl,cc.SpriteFrame,function(err,spriteFrame){
                    self.spNum.getComponent(cc.Sprite).spriteFrame = spriteFrame;
                });
            }else{
                this.node.destroy();
            }  
        },0.8, this.time, 0);

    },
    close(){
        if(this.node){
            this.node.destroy();
        }
    },
    btnClick(){
        console.log("点击了明牌按钮");
        if(this.click){
            this.click(this.time);
        }
        this.node.destroy();

        cc.vv.audioMgr.playSFX("SpecOk");
    }

});
