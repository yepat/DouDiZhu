var GameNetMgr = require("GameNetMgr");
cc.Class({
    extends: cc.Component,

    properties: {
        timeTxt : {
            default : null,
            type : cc.Label
        },
        buchuBtn : {
            default : null,
            type : cc.Node
        },
        tishiBtn : {
            default : null,
            type : cc.Node
        },
        chupaiBtn : {
            default : null,
            type : cc.Node,
        },
        clock : {
            default : null,
            type : cc.Node,
        },
        tishi : {
            default : null,
            type : cc.Sprite
        },
        timeCount:30,
    },

    onLoad () {
        this.clockX = this.clock.getPositionX();
        this.clockY = this.clock.getPositionY();
        this.tishi.enabled = false;

        this.schedule(function() {
            // 这里的 this 指向 component
            if(this.timeCount > 0){
                this.timeCount -= 1;
                if(this.timeCount <= 5 && this.timeCount >=1){
                    // cc.vv.audioMgr.playSFX("timeup_alarm.mp3");
                    if(this.type && this.type == 2){
                    }else{
                        this.shakeClock();
                    }
                }
                var pre = "";
                if(this.timeCount <= 0){
                    this.timeCount = 0;
                    // this.node.destroy();
                    if(this.type && this.type == 2){
                        GameNetMgr.sendRequest("Game","giveupSendCard");
                    }
                    this.node.active = false;
                }
                var t = Math.ceil(this.timeCount);
                if(t < 10){
                    pre = "";
                }
                this.timeTxt.string = pre + t; 
            }
            
        }, 1);
    },
    // start () {
    // },
    show(time,buchuFunc,tishiFunc,chupaiFunc,type){//type 1必出 2要不起
        this.node.active = true;
        this.timeCount = time;
        this.buchuFunc = buchuFunc;
        this.tishiFunc = tishiFunc;
        this.chupaiFunc = chupaiFunc;
        var pre = "";
        this.timeTxt.string = pre + time;

        this.buchuBtn.active = true;
        this.tishiBtn.active = true;
        this.chupaiBtn.active = true;
        this.tishi.enabled = false;
        this.buchuBtn.x = -370;
        this.tishiBtn.x = 79;
        this.chupaiBtn.x = 387;
        this.clock.x = -147;

        this.type = type;

        if(type==1){
            this.clock.x = -163;
            this.chupaiBtn.x = 63;
            this.buchuBtn.active = false;
            this.tishiBtn.active = false;
        }else if(type==2){
            this.clock.x = -163;
            this.buchuBtn.x = 63;
            this.tishiBtn.active = false;
            this.chupaiBtn.active = false;
            this.showTips("showTips/p_tips_noCard");
        }
    },
    close(){
        if(this.node){
            // this.node.destroy();
            this.node.active = false;
        }
    },
    buchuClick() {
        // console.log("不出");
        if(this.buchuFunc)
            this.buchuFunc();
        // this.node.destroy();
        this.node.active = false;
        // cc.vv.audioMgr.playSFX("SpecOk");
    },
    tishiClick() {
        // console.log("提示");
        if(this.tishiFunc)
            this.tishiFunc();
        // cc.vv.audioMgr.playSFX("SpecOk");
    },
    chupaiClick(num) {
        // console.log(">>>出牌");
        var typenum = 0;
        if(this.chupaiFunc)
        {
            typenum = this.chupaiFunc();
            // console.log("typenum:"+typenum);
        }
            
        if(typeof(num)=="number"){
            typenum = num;
        }

        // console.log("typenum11111:"+typenum);

        if(typenum == 0){
            // this.showTips("没有选择要出的牌！");
            this.showTips("showTips/p_tips_noSeletcedCrad");
        }else if(typenum == -1){
            // this.showTips("您选择的牌无法出出去哦！");  
            this.showTips("showTips/p_tips_seletcedCardTypeError");
        }else if(typenum == -2){
            this.showTips("showTips/p_tips_noCard");
            // this.node.destroy();
        }else{
            // this.tishi.enabled = false;
        }
        // cc.vv.audioMgr.playSFX("SpecOk");
    },
    shakeClock(){
        var mt1 = cc.moveTo(0.05,this.clockX,this.clockY-2);
        var mt2 = cc.moveTo(0.05,this.clockX,this.clockY+2);
        var mt3 = cc.moveTo(0.05,this.clockX,this.clockY-2);
        var mt4 = cc.moveTo(0.05,this.clockX,this.clockY+2);
        var mt5 = cc.moveTo(0.05,this.clockX,this.clockY-2);
        var mt6 = cc.moveTo(0.05,this.clockX,this.clockY+2);
        var mt7 = cc.moveTo(0.05,this.clockX,this.clockY);
        this.clock.runAction(cc.sequence(mt1,mt2,mt3,mt4,mt5,mt6,mt7));
        cc.vv.audioMgr.playSFX("Special_Remind");
    },
    showTips(imgUrl){
        var self = this;
        if(self.tishi){   
        }else{
            return;
        }
        this.tishi.node.stopAllActions();
        this.tishi.enabled = true;
        // this.tishi.string = content;
        cc.loader.loadRes(imgUrl,cc.SpriteFrame,function(err,spriteFrame){
            self.tishi.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        })

        var delay = cc.delayTime(2);
        var callFunc = cc.callFunc(function(){
            self.tishi.enabled = false;
        });
        this.tishi.node.runAction(cc.sequence(delay,callFunc));
    }
    
});
