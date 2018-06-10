
cc.Class({
    extends: cc.Component,

    properties: {
    },
    start () {
        var self = this;
        var callFunc = cc.callFunc(function(){
            self.node.destroy();
        });
        var delay = cc.delayTime(1);
        this.node.runAction(cc.sequence(delay,callFunc)); 
    },
    close(){
        this.node.destroy();
    }

});
