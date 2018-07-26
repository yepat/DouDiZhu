
cc.Class({
    extends: cc.Component,

    properties: {
       
    },
    start () {
    },
    show(click){
        this.node.active = true;
        this.click = click;
    },
    close(){
        if(this.node){
            // this.node.destroy();
            this.node.active = false;
        }
    },
    btnClick() {
        console.log("取消托管");
        if(this.click)
            this.click();
        // this.node.destroy();
        this.node.active = false;
    },
});
