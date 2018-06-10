
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
        this.content.string = contentTxt;

        var self = this;
        var callFunc = cc.callFunc(function(){
            self.node.destroy();
        });
        var delay = cc.delayTime(2);
        this.node.runAction(cc.sequence(delay,callFunc));
    },
});
