var GameNetMgr = require("GameNetMgr");
var PlayerDetailModel = require("PlayerDetailModel");
var config = require("config");

cc.Class({
    extends: cc.Component,

    properties: {
        img_bg : {
            default : null,
            type : cc.Sprite
        },
        img_head : {
            default : null,
            type : cc.Sprite
        },
        btn_1 : {
            default : null,
            type : cc.Node,
        },
        btn_2 : {
            default : null,
            type : cc.Node,
            opentype : "share"
        },
        lab_rate : {
            default : null,
            type : cc.Label
        },

    },
    onLoad () {
        // 获取乐券和打出春天公用
        this.dialogName = "";
        this.lab_rate.string = "";

        if(!config.canSeeVideoAd){
            this.btn_1.active = false;
            this.btn_2.x = 0;
        }
    },
    start () {
        // this.show("chuntian");
    },   
    show(dialogName){
        this.dialogName = dialogName;
        if(dialogName == "lequan"){
            config.loadImage(this.img_bg,"p_get_lequan");
        }else if(dialogName == "chuntian"){
            config.loadImage(this.img_bg,"p_chuntian");
        }else if(dialogName == "liansheng_3"){
            config.loadImage(this.img_bg,"p_liansheng_3");
        }else if(dialogName == "gaobei"){
            config.loadImage(this.img_bg,"p_gaobei");
            this.lab_rate.string = ""+config.maxRateShare;
        }
        this.setHeadUrl();
    },
    setHeadUrl(){
        var self = this;
         //设置微信头像
         var imgUrl=config.wxInfo.avatarUrl;
         if(imgUrl==""){
            var headUrl = "common/p_head_woman";
            if(PlayerDetailModel.getGender() == 1){
                headUrl = "common/p_head_man";
            }
            cc.loader.loadRes(headUrl,cc.SpriteFrame,function(err,spriteFrame){
                self.img_head.getComponent(cc.Sprite).spriteFrame = spriteFrame;
            });
            return;
        }

        imgUrl = imgUrl + "?aa=aa.jpg";
        cc.loader.load(imgUrl, function(err, texture){
            self.img_head.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
        });
    },
    closeClick(){
        // console.log("close click");
        this.node.destroy();
        cc.vv.audioMgr.playSFX("SpecOk");
    },
    btnEnterClick(){
        var dialogName = this.dialogName; //lequan 5  //chuntian  5
        var shareType = 5;
        if(dialogName == "lequan"){
            shareType = 5;
        }else if(dialogName == "chuntian"){
            shareType = 5;
        }else if(dialogName == "liansheng_3"){
            shareType = 5;
        }else if(dialogName == "gaobei"){
            shareType = 5;
        }

        var index = config.getRandom(1);
        var shareTxt = config.shareTxt[dialogName][index];
        var shareImg = config.getShareImgPath(dialogName);
        wx.shareAppMessage({
            title: shareTxt,
            imageUrl: shareImg,
            query : "key="+PlayerDetailModel.uid,
            success(res){
                console.log("---转发成功!!!");
                console.log(res);
                // GameNetMgr.sendRequest("System","ShareWxRes",shareType);
            },
            fail(res){
                console.log("---转发失败!!!")
            } 
        })

        this.node.destroy();
        cc.vv.audioMgr.playSFX("SpecOk");
    },
    btnKanShiPinClick(){
        console.log("btnKanShiPinClick");
        cc.vv.audioMgr.playSFX("SpecOk");
        if(typeof(wx)=="undefined"){
            return;
        }
        config.rewardedVideoType = 3;
        if(config.rewardedVideoAd){
            config.rewardedVideoAd.show().then();//() => cc.vv.audioMgr.stopMusic()
            if(this.node)
                this.node.destroy();
        }
    }
});
