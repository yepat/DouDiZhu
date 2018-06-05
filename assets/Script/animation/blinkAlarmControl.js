
cc.Class({
    extends: cc.Component,

    properties: {
        blinkNode : {
            default : null,
            type : cc.Sprite
        },
    },

    start () {
        var action = cc.blink(1, 3);
		var repeat_=cc.repeatForever(action);
        this.blinkNode.node.runAction(repeat_);
    },
    show(time){
        
    },
    close(){
        this.node.destroy();
    }

});
