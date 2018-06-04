var config = require("config");
var dialogManager = require("dialogManager");
cc.Class({
    extends: cc.Component,

    properties: {
        hallLayer : {
            default : null,
            type : cc.Node
        },
        roomLayer : {
            default : null,
            type : cc.Node
        }
    },
    // onLoad () {},
    start () {
       this.hallLayer.active = true;
       this.roomLayer.active = false;
    },
    btnRoom1Click(){
        console.log("欢乐场")
        this.hallLayer.active = false;
        this.roomLayer.active = true;
        config.curRoomModelId = config.ModelId.normal;
    },
    btnRoom2Click(){
        console.log("赖子场")
        // this.hallLayer.active = false;
        // this.roomLayer.active = true;
        // config.curRoomModelId = config.ModelId.lazarillo;
        dialogManager.showCommonDialog("温馨提示","赖子场暂未开放！",null,null);
    },
    roomBackHall(){
        console.log("反回大厅")
        this.hallLayer.active = true;
        this.roomLayer.active = false;
    },
    
    
});
