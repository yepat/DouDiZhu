
cc.Class({
    extends: cc.Component,

    properties: {
        content : {
            default : null,
            type : cc.Label
        },
    },
    // onLoad () {},
    start () {
    },   
    show(contentTxt){
        this.node.active = true;
        this.content.string = contentTxt;
        this.node.stopAllActions();
        var self = this;
        var callFunc = cc.callFunc(function(){
            // self.node.destroy();
            self.node.active = false;
        });
        var delay = cc.delayTime(2);
        this.node.runAction(cc.sequence(delay,callFunc));
    },
});
