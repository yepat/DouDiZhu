



cc.Class({
    extends: cc.Component,

    properties: {
        playerMy:{
            default : null,
            type : cc.Node,
        },
        headMyImg : {
            default : null,
            type : cc.Sprite
        },
        headMyName : {
            default : null,
            type : cc.Label
        },
        headMyCoin : {
            default : null,
            type : cc.Label
        },
        headMyLeQuan : {
            default : null,
            type : cc.Label
        },


        playerLeft:{
            default : null,
            type : cc.Node,
        },
        headLeftImg : {
            default : null,
            type : cc.Sprite
        },
        headLeftName : {
            default : null,
            type : cc.Label
        },
        headLeftCoin : {
            default : null,
            type : cc.Label
        },

        playerRight:{
            default : null,
            type : cc.Node,
        },
        headRightImg : {
            default : null,
            type : cc.Sprite
        },
        headRightName : {
            default : null,
            type : cc.Label
        },
        headRightCoin : {
            default : null,
            type : cc.Label
        },
    },

    // onLoad () {},

    start () {
        this.initMyInfo();
        this.initLeftPlayerInfo();
        this.initRightPlayerInfo();
    },
    initMyInfo(){
        //设置微信头像
        var self = this;
        var imgUrl=config.wxInfo.avatarUrl;
        imgUrl = imgUrl + "?aa=aa.jpg";
        cc.loader.load(imgUrl, function(err, texture){
            self.headMyImg.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
        });

        this.headMyName.string = this.parseString("我自己啊啊啊啊");
        this.headMyCoin.string = this.parseNumber("1000000000");
        this.headMyLeQuan.string = this.parseNumber("500000");
    },
    initLeftPlayerInfo(){
        var self = this;
        var imgUrl=config.wxInfo.avatarUrl;
        imgUrl = imgUrl + "?aa=aa.jpg";
        cc.loader.load(imgUrl, function(err, texture){
            self.headLeftImg.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
        });

        this.headLeftName.string = this.parseString("美好的回忆233");
        this.headLeftCoin.string = this.parseNumber("1000000");
    },
    initRightPlayerInfo(){
        var self = this;
        var imgUrl=config.wxInfo.avatarUrl;
        imgUrl = imgUrl + "?aa=aa.jpg";
        cc.loader.load(imgUrl, function(err, texture){
            self.headRightImg.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
        });

        this.headRightName.string = this.parseString("新手1366567222");
        this.headRightCoin.string = this.parseNumber("1000000");
    },
    parseNumber(number){
        if(typeof(number)=="string")
            number = parseInt(number);
        if(number >= 100000000){
            number = Math.floor(number / 100000000)
            number = ""+number+"亿";
        }else if(number >= 1000000){
            number = Math.floor(number / 10000)
            number = ""+number+"万";
        }else{
            number = ""+number;
        }
        return number;
    },
    parseString(string){
        var str = string.substring(0,4);
        str = str+"...";
        console.log(">>string:"+string);
        return str;
    }
});
