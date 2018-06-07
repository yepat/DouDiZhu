
cc.Class({
    extends: cc.Component,

    properties: {
        timeTxt : {
            default : null,
            type : cc.Label
        },
        timeCount:30,
    },

    start () {
        this.schedule(function() {
            if(this.timeCount > 0){
                this.timeCount -= 1;
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

        //xx_test
        this.show(30);
    },
    show(time){
        this.timeCount = time;
        this.timeTxt.string = "" + time; 
    },
    close(){
        this.node.destroy();
    },

});
