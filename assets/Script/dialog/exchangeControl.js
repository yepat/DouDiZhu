
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
        cc.vv.audioMgr.playSFX("SpecOk");
    },
    recordClick(){
        console.log("record click");
    }
});
