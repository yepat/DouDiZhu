var GameNetMgr = require("GameNetMgr");
var PlayerDetailModel = require("PlayerDetailModel");
cc.Class({
    extends: cc.Component,

    properties: {
        nodeGet : {
            default : null,
            type : cc.Node
        },
        nodeComplete : {
            default : null,
            type : cc.Node
        },
        nodeProgrss : {
            default : null,
            type : cc.Node
        },
        labTitle : {
            default : null,
            type : cc.Label
        },
        labContent : {
            default : null,
            type : cc.Label
        },
        labProgress : {
            default : null,
            type : cc.Label
        },

    },
    onLoad () {
         this.nodeGet.active = false;
         this.nodeComplete.active = false;
         this.nodeProgrss.active = false;
         this.state = 0;
         this.id = 0;
    },
    
    init(info,title,content,progress){
        this.state = info.state; //"state":状态 0未完成 1未领取 2已领取 
        this.labTitle.string = title;
        this.labContent.string = content;
        this.id = info.id;
        this.goto = info.goto;
        if(this.state == "0"){ //进行中
            this.nodeProgrss.active = true;
            this.labProgress.string = progress;
        }else if(this.state == "1"){//领取
            this.nodeGet.active = true;
        }else if(this.state == "2"){//完成
            this.nodeComplete.active = true;
        }
    },
    getClick(){
        if(this.state == "1"){
            console.log("点击了任务领取按钮 this.id:"+this.id);
            GameNetMgr.sendRequest("System", "GetTaskReward", this.id);//任务id
            this.nodeGet.active = false;
            this.nodeProgrss.active = false;
            this.nodeComplete.active = true;

            var num = PlayerDetailModel.getTaskUnReward();
            PlayerDetailModel.setTaskUnReward(num-1);
        }
        cc.vv.audioMgr.playSFX("SpecOk");
    },
    gotoClick(){
        console.log("this.goto:"+this.goto);
        if(this.goto&&this.state == "0"){ //1房间  2邀请好友
            if(this.goto == 1){
                console.log("前往普通场");
                // this.onWantGotoRoom();
            }else if(this.goto == 2){
                console.log("前往分享");
            }
        }
    },
    onWantGotoRoom(){//去适合的场次
        // HallCanvasControl.gotoRoom1();
    },
});
