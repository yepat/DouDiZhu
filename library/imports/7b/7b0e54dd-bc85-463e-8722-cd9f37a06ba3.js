"use strict";
cc._RF.push(module, '7b0e5TdvIVGPocizZ83oGuj', 'HallCanvasControl');
// Script/HallCanvasControl.js

"use strict";

var config = require("config");
var dialogManager = require("dialogManager");
cc.Class({
    extends: cc.Component,

    properties: {
        hallLayer: {
            default: null,
            type: cc.Node
        },
        roomLayer: {
            default: null,
            type: cc.Node
        }
    },
    onLoad: function onLoad() {
        cc.game.on(cc.game.EVENT_HIDE, function () {
            console.log("游戏进入后台");
            config.stopOnMassage = true;
        }, this);
        cc.game.on(cc.game.EVENT_SHOW, function () {
            console.log("重新返回游戏");
            cc.vv.audioMgr.resumeAll();
            config.stopOnMassage = false;
        }, this);

        cc.vv.audioMgr.playBGM("MusicEx_Welcome");
    },
    start: function start() {
        this.hallLayer.active = true;
        this.roomLayer.active = false;
    },
    btnRoom1Click: function btnRoom1Click() {
        console.log("欢乐场");
        this.hallLayer.active = false;
        this.roomLayer.active = true;
        config.curRoomModelId = config.ModelId.normal;
        cc.vv.audioMgr.playSFX("SpecOk");
    },
    btnRoom2Click: function btnRoom2Click() {
        console.log("赖子场");
        // this.hallLayer.active = false;
        // this.roomLayer.active = true;
        // config.curRoomModelId = config.ModelId.lazarillo;
        dialogManager.showCommonDialog("温馨提示", "赖子场暂未开放！", null, null);
        cc.vv.audioMgr.playSFX("SpecOk");
    },
    roomBackHall: function roomBackHall() {
        console.log("反回大厅");
        this.hallLayer.active = true;
        this.roomLayer.active = false;
        cc.vv.audioMgr.playSFX("SpecOk");
    }
});

cc._RF.pop();