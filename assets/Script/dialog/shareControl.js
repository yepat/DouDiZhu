
cc.Class({
    extends: cc.Component,

    properties: {
        
    },
    start () {
    },   
    closeClick(){
        console.log("close click");
        this.node.destroy();
    },
    btnClick(event){
        var btnName = event.target.name;
        console.log("-------"+btnName);
    },
    getClick(){
        console.log("-------get");
    },
});
