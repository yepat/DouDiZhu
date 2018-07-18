var config = require("config");
cc.Class({
    extends: cc.Component,

    properties: {
        sp_prop : {
            default : null,
            type : cc.Sprite,
        },
        lab_num : {
            default : null,
            type : cc.Label,
        },
    },
    onLoad () {
        this.lab_num.string = "";
    },
    // start () {
    // },
    show(args){
        var name = args.arg1;
        var num = args.arg2;
        if(name == "lequan"){
            config.loadImage(this.sp_prop,"p_daoju_lequan");
        }else if(name == "jipaiqi"){
            config.loadImage(this.sp_prop,"p_daoju_jpq");
        }else if(name == "ledou"){
            // config.loadImage(this.sp_prop,"p_daoju_ledou");
        }
        this.lab_num.string = "X "+num;
    },
    close(){
        this.node.destroy();
    }
});
