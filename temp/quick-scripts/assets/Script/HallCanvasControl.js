(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/HallCanvasControl.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '7b0e5TdvIVGPocizZ83oGuj', 'HallCanvasControl', __filename);
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
            // config.stopOnMassage = true;  
            cc.vv.audioMgr.stopMusic();
        }, this);
        cc.game.on(cc.game.EVENT_SHOW, function () {
            console.log("重新返回游戏");
            cc.vv.audioMgr.playBGM("MusicEx_Welcome");
        }, this);

        cc.vv.audioMgr.playBGM("MusicEx_Welcome");

        // this.loadSubpackage();
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
    },
    loadSubpackage: function loadSubpackage() {
        if (typeof wx == "undefined") {
            return;
        }

        if (wx.loadSubpackage) {} else {
            console.log("没有分包加载这个接口");
            return;
        }

        var loadTask = wx.loadSubpackage({
            name: 'stage1', // name 可以填 name 或者 root
            success: function success(res) {
                // 分包加载成功后通过 success 回调
                console.log("分包加载成功", res);
            },
            fail: function fail(res) {
                // 分包加载失败通过 fail 回调
                console.log("分包加载失败", res);
            }
        });

        loadTask.onProgressUpdate(function (res) {
            console.log('下载进度', res.progress);
            console.log('已经下载的数据长度', res.totalBytesWritten);
            console.log('预期需要下载的数据总长度', res.totalBytesExpectedToWrite);
        });
    }
});

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=HallCanvasControl.js.map
        