
cc.Class({
    extends: cc.Component,

    properties: {
        loading : {
            default : null,
            type : cc.Sprite
        },
    },

    start () {
        var rotate=cc.rotateBy(3,360);
		var repeat_=cc.repeatForever(rotate);
        this.loading.node.runAction(repeat_);
    },
    show(time){
        
    },
    close(){
        if(this.node){
            this.node.destroy();
        }
    }

});
