
cc.Class({
    extends: cc.Component,

    properties: {
       
    },
    start () {

    },
    show(click){
        this.click = click;
    },
    close(){
        if(this.node){
            this.node.destroy();
        }
    },
    btnClick() {
        console.log("取消托管");
        if(this.click)
            this.click();
        this.node.destroy();
    },
});
