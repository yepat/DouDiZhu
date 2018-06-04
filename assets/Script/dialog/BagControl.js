
cc.Class({
    extends: cc.Component,

    properties: {
        btnLeft_1 : {
            default : null,
            type : cc.Sprite
        },
        btnLeft_2 : {
            default : null,
            type : cc.Sprite
        },
        btnRight_1 : {
            default : null,
            type : cc.Sprite
        },
        btnRight_2 : {
            default : null,
            type : cc.Sprite
        },
    },
    start () {
        this.btnRight_1.enabled = false;
    },   
    closeClick(){
        console.log("close click");
        this.node.destroy();
    },
    leftClick(){
        console.log("left click");
        this.btnLeft_1.enabled = true;
        this.btnRight_1.enabled = false;
    },
    rightClick(){
        console.log("right click");
        this.btnLeft_1.enabled = false;
        this.btnRight_1.enabled = true; 
    }
});
