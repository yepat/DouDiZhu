
cc.Class({
    extends: cc.Component,

    properties: {
        title : {
            default : null,
            type : cc.Label
        },
        content : {
            default : null,
            type : cc.Label
        },
        btn_cancel : {
            default : null,
            type : cc.Node
        },
        btn_enter : {
            default : null,
            type : cc.Node
        },
    },
    start () {   
        // var enter = function(){
        //     console.log("确认按钮");
        // }
        // this.show("xx","但想啊想啊啊想啊",enter,null);
    },   
    show(args){
        var title = args.arg1;
        var content = args.arg2;
        var enterClick = args.arg3;
        var cancelClick = args.arg4;

        this.title.string = title;
        this.content.string = content;
        if(cancelClick){
        }else{
            this.btn_cancel.active = false;
            this.btn_enter.x = 0;
        }
        this.enterClick = enterClick;
        this.cancelClick = cancelClick;

    },
    closeClick(){
        console.log("close click");
        this.node.destroy();
    },
    btnCancelClick(){
        console.log("btn1 click");
        if(this.cancelClick){
            this.cancelClick();
        }
        this.node.destroy();
    },
    btnEnterClick(){
        console.log("btn2 click");
        if(this.enterClick){
            this.enterClick();
        }
        this.node.destroy();
    }
});
