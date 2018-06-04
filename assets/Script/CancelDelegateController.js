
cc.Class({
    extends: cc.Component,

    properties: {
       
    },
    start () {

    },
    show(click){
        this.click = click;
    },
    btnClick() {
        console.log("取消托管");
        if(this.click)
            this.click();
        this.node.destroy();
    },
});
