// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        // progressBar : {
        //     default : null,
        //     type : cc.ProgressBar
        // },
        timeTxt : {
            default : null,
            type : cc.Label
        },
        clock : {
            default : null,
            type : cc.Node,
        },
        timeCount:30,
    },

    start () {
        this.show(10,null);
        this.clockX = this.clock.getPositionX();
        this.clockY = this.clock.getPositionY();

        this.schedule(function() {
            if(this.timeCount > 0){
                this.timeCount -= 1;
                if(this.timeCount <= 5){
                    // cc.vv.audioMgr.playSFX("timeup_alarm.mp3");
                    this.shakeClock();
                }
                var pre = "";
                if(this.timeCount <= 0){
                    this.timeCount = 0;
                    this.node.destroy();
                }
                var t = Math.ceil(this.timeCount);
                if(t < 10){
                    pre = "";
                }
                this.timeTxt.string = pre + t; 
            }   
        }, 1);

    },
    show(time,click){
        // this.time = time*10;
        this.click = click;
        this.timeCount = time;
        this.timeTxt.string = "" + time;

        // this.pross = 1.0;
        // this.dt = 1/this.time;
        // this.schedule(function() {
        //     if(this.pross > 0){
        //         this.pross -= this.dt;
        //         // this.progressBar.getComponent(cc.ProgressBar).progress = this.pross;
        //     }else{
        //         // this.progressBar.getComponent(cc.ProgressBar).progress = 0;
        //         this.node.destroy();
        //     }  
        // },0.1, this.time, 0.01);
    },
    btnClick1(){
        console.log("点击了加倍按钮");
        if(this.click){
            this.click();
        }
        this.node.destroy();
    },
    btnClick2(){
        console.log("点击了不加倍按钮");
        // if(this.click){
        //     this.click();
        // }
        this.node.destroy();
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
    }
});
