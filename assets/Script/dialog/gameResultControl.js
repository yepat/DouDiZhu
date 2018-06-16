
var resoultInfoItemControl = require("resoultInfoItemControl");
var dialogManager = require("dialogManager");

cc.Class({
    extends: cc.Component,

    properties: {
        guang : {
            default : null,
            type : cc.Sprite
        },
        resoultInfoItem : {
            default : null,
            type : cc.Prefab
        },
        content : {
            default : null,
            type : cc.Node
        },
    },
    onLoad () {
        var width = cc.director.getWinSize().width;
        console.log("width:"+width);
        this.node.width = width;
    },
    start () {
        var rotate=cc.rotateBy(8,360);
		var repeat_=cc.repeatForever(rotate);
        this.guang.node.runAction(repeat_);
    },
    show(infos,click1,click2,mySeatId,backHallScene){
        this.click1 = click1;
        this.click2 = click2;
        this.backHallScene = backHallScene;
        for(var i = 0;i < 3;i++){
            var resoultInfoItem = cc.instantiate(this.resoultInfoItem);
            resoultInfoItem.parent = this.content;
            var task = resoultInfoItem.getComponent(resoultInfoItemControl);
            task.init(infos[i].isdizhu,infos[i].nickname,infos[i].difen,infos[i].beishu,infos[i].ledou,mySeatId==i,infos[i].coin,infos[i].rateMax);
        }
    },
    btn1Click(){
        console.log("btn1Click");
        if(this.click1){
            this.click1();
        }
        if(this.node){
            this.node.destroy();
        }
    },
    btn2Click(){
        console.log("btn2Click");
        if(this.click2){
            this.click2();
        }
        if(this.node){
            this.node.destroy();
        }
    },
    close(){
        var self = this;
        dialogManager.showCommonDialog("提示","是否返回大厅！",function(){
            if(self.backHallScene){
                self.backHallScene()
                self.node.destroy();
            }
        },function(){
        });
        // this.node.destroy();
    }
});
