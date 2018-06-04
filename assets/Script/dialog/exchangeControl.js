
cc.Class({
    extends: cc.Component,

    properties: {
        lequanNum : {
            default : null,
            type : cc.Label
        }
    },
    start () {
        
    },   
    closeClick(){
        console.log("close click");
        this.node.destroy();
    },
    recordClick(){
        console.log("record click");
    }
});
