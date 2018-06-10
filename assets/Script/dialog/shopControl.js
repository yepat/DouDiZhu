var config = require("config");
var EventHelper = require("EventHelper");
var PlayerDetailModel = require("PlayerDetailModel");
var dialogManager = require("dialogManager");

cc.Class({
    extends: cc.Component,

    properties: {
        btnCoin : {
            default : null,
            type : cc.Sprite
        },
        btnProp : {
            default : null,
            type : cc.Sprite
        },
        gridCoin: {
            default : null,
            type : cc.Node
        },
        gridProp: {
            default : null,
            type : cc.Node
        },
        //tou
        headImg : {
            default : null,
            type : cc.Sprite
        },
        playerName : {
            default : null,
            type : cc.Label
        },
        playerLevel : {
            default : null,
            type : cc.Label
        },
        playerLedou : {
            default : null,
            type : cc.Label
        },
        playerLeQuan : {
            default : null,
            type : cc.Label
        }
    },
    // onLoad () {},
    start () {
        var self = this;
        cc.loader.loadRes("shop/p_shopBtn_1",cc.SpriteFrame,function(err,spriteFrame){
            self.btnCoin.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        })
        cc.loader.loadRes("shop/p_shopBtn_2",cc.SpriteFrame,function(err,spriteFrame){
            self.btnProp.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        })
        this.gridCoin.active = true;
        this.gridProp.active = false;

        //tou
        self.setHeadUrl("");
        self.setNickName(PlayerDetailModel.getNickName());
        self.setLevel(PlayerDetailModel.getTitle());
        self.setLeDou(PlayerDetailModel.getCoin());
        self.setLuQuan(PlayerDetailModel.getCoupon());
    },   
    setHeadUrl(url){
        var self = this;
         //设置微信头像
         var imgUrl="http://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLSO7sOWsNicYdNM3MbNGGo58zticxgqoO2aqS7zOCVClXl7WExa4KNQ48uSTSszicsyspzsDQ51M4EQ/132";
         imgUrl = imgUrl + "?aa=aa.jpg";
         cc.loader.load(imgUrl, function(err, texture){
             self.headImg.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
         });
    },
    setNickName(name){
         //修改昵称
         this.playerName.string = name;
    },
    setLevel(lv){
        //修改等级
        this.playerLevel.string = lv;
    },
    setLeDou(number){
        //修改乐豆数
        if(number >= 10000000){
            number = Math.floor(number / 10000)
            this.playerLedou.string = ""+number+"万";
        }else{
            this.playerLedou.string = ""+number;
        }
        
    },
    setLuQuan(number){
        //修改乐券数
        if(number >= 10000000){
            number = Math.floor(number / 10000)
            this.playerLeQuan.string = ""+number+"万";
        }else{
            this.playerLeQuan.string = ""+number;
        }
    },
    closeClick(){
        console.log("close click");
        this.node.destroy();
    },
    btnCoinClick(){
        console.log("btnCoinClick");
        this.gridCoin.active = true;
        this.gridProp.active = false;
        var self = this;
        cc.loader.loadRes("shop/p_shopBtn_1",cc.SpriteFrame,function(err,spriteFrame){
            self.btnCoin.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        })
        cc.loader.loadRes("shop/p_shopBtn_2",cc.SpriteFrame,function(err,spriteFrame){
            self.btnProp.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        })
    },
    btnPropClick(){
        console.log("btnPropClick");
        this.gridCoin.active = false;
        this.gridProp.active = true;
        var self = this;
        cc.loader.loadRes("shop/p_shopBtn_2",cc.SpriteFrame,function(err,spriteFrame){
            self.btnCoin.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        })
        cc.loader.loadRes("shop/p_shopBtn_1",cc.SpriteFrame,function(err,spriteFrame){
            self.btnProp.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        })
    },
    coinItemClick(event){
        var btnName = event.target.name;
        console.log("coinItemClick:"+btnName);
        
    },
    propItemClick(event){
        var btnName = event.target.name;
        console.log("propItemClick:"+btnName);

    }
});
