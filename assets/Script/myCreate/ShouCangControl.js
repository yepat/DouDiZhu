// var GameNetMgr = require("GameNetMgr");
// var PlayerDetailModel = require("PlayerDetailModel");
var config = require("config");

cc.Class({
    extends: cc.Component,

    properties: {
        img_bg : {
            default : null,
            type : cc.Sprite
        },
        node_ske : {
            default : null,
            type : cc.Node
        },
    },
    onLoad () {
        var width = cc.director.getWinSize().width;
        this.node.width = width;
        if(width > 2200){
            this.node_ske.x = this.node_ske.x + 180;
        }

        if(config.device == "Android"){
            config.loadImage(this.img_bg,"p_android_sc");
        }else{
            config.loadImage(this.img_bg,"p_ios_sc");
        }
    },
    show(){
    },
    closeClick(){
        // console.log("close click");
        this.node.destroy();
        cc.vv.audioMgr.playSFX("SpecOk");
    }
});
