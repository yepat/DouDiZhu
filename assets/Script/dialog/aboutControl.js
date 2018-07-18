var config = require("config");
cc.Class({
    extends: cc.Component,

    properties: {
        lab_content_1 : {
            default : null,
            type : cc.Label
        },
        lab_content_2 : {
            default : null,
            type : cc.Label
        },
    },
    start () {
        this.lab_content_2.string = "版本号："+config.VERSION_ABOUT;
    },   
    closeClick(){
        console.log("close click");
        this.node.destroy();
        cc.vv.audioMgr.playSFX("SpecOk");
    },
});
