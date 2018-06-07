
cc.Class({
    extends: cc.Component,

    properties: {
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
                    // this.node.destroy();
                    this.node.active = false;
                }
                var t = Math.ceil(this.timeCount);
                if(t < 10){
                    pre = "";
                }
                this.timeTxt.string = pre + t; 
            }   
        }, 1);

        //xx_test
        // this.show(10);
    },
    show(time){
        this.node.active = true;
        this.timeCount = time;
        this.timeTxt.string = "" + time; 
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
