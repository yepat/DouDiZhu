
var config = require("config");
var EventHelper = require("EventHelper");
var PlayerDetailModel = require("PlayerDetailModel");

cc.Class({
    extends: cc.Component,

    properties: {
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
    
        // EventHelper.AddCustomEvent(config.MyNode,"EnterHallOK",function(event){
            self.setHeadUrl("");
            self.setNickName(PlayerDetailModel.getNickName());
            self.setLevel(PlayerDetailModel.getTitle());
            self.setLeDou(PlayerDetailModel.getCoin());
            self.setLuQuan(PlayerDetailModel.getCoupon());
        // });

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
    btnSetClick(){
        console.log("btnSetClick");
        // 加载 Prefab
        cc.loader.loadRes("prefab/setDialog", function (err, prefab) {
            if (err) {
                console.log(err);
                return;
            }
            var newNode = cc.instantiate(prefab);
            cc.director.getScene().addChild(newNode);
        });
    },
    btnTaskClick(){
        console.log("btnTaskClick");
        // 加载 Prefab
        cc.loader.loadRes("prefab/taskDialog", function (err, prefab) {
            if (err) {
                console.log(err);
                return;
            }
            var newNode = cc.instantiate(prefab);
            cc.director.getScene().addChild(newNode);
        });
    },
    btnEmailClick(){
        console.log("btnEmailClick");
        // 加载 Prefab
        cc.loader.loadRes("prefab/emailDialog", function (err, prefab) {
            if (err) {
                console.log(err);
                return;
            }
            var newNode = cc.instantiate(prefab);
            cc.director.getScene().addChild(newNode);
        });
    },
    btnBagClick(){
        console.log("btnBagClick");
        // 加载 Prefab
        cc.loader.loadRes("prefab/bagDialog", function (err, prefab) {
            if (err) {
                console.log(err);
                return;
            }
            var newNode = cc.instantiate(prefab);
            cc.director.getScene().addChild(newNode);
        });
    },
    btnShopClick(){
        console.log("btnShopClick");
        // 加载 Prefab
        // cc.loader.loadRes("bagDialog", function (err, prefab) {
        //     if (err) {
        //         console.log(err);
        //         return;
        //     }
        //     var newNode = cc.instantiate(prefab);
        //     cc.director.getScene().addChild(newNode);
        // });
    },
    btnShareClick(){
        console.log("btnShareClick");
    }
});
