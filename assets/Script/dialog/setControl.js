
cc.Class({
    extends: cc.Component,

    properties: {
        imgMusic : {
            default : null,
            type : cc.Node
        },
        imgEffect : {
            default : null,
            type : cc.Node
        },
        musicSet:false,
        effectSet:false,
    },

    start () {

    },
    musicClick(){
        var self = this;
        console.log("music click");
        var imgUrl = "img_dialog/btn_off";
        if(this.musicSet){
            this.musicSet = false;
            imgUrl = "img_dialog/btn_off";
        }else{
            this.musicSet = true;
            imgUrl = "img_dialog/btn_on";
        }

        cc.loader.loadRes(imgUrl,cc.SpriteFrame,function(err,spriteFrame){
            self.imgMusic.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        })
    },
    effectClick(){
        var self = this;
        console.log("effect click");
        var imgUrl = "img_dialog/btn_off";
        if(this.effectSet){
            this.effectSet = false;
            imgUrl = "img_dialog/btn_off";
        }else{
            this.effectSet = true;
            imgUrl = "img_dialog/btn_on";
        }

        cc.loader.loadRes(imgUrl,cc.SpriteFrame,function(err,spriteFrame){
            self.imgEffect.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        })

    },
    fankuiClick(){
        console.log("fankui click");
         // 加载 Prefab
         cc.loader.loadRes("prefab/fankuiDialog", function (err, prefab) {
            if (err) {
                console.log(err);
                return;
            }
            var newNode = cc.instantiate(prefab);
            cc.director.getScene().addChild(newNode);
        });
    },
    aboutClick(){
        console.log("about click");

    },
    closeClick(){
        console.log("close click");
        this.node.destroy();
    },

   
});
