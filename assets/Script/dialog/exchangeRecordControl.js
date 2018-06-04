
cc.Class({
    extends: cc.Component,

    properties: {
        
    },
    start () {
        
    },   
    closeClick(){
        console.log("close click");
        this.node.destroy();
    }
});
