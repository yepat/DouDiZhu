(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/dialog/gameResultControl.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'd79724yjfxDdbgN/3Ee9zWb', 'gameResultControl', __filename);
// Script/dialog/gameResultControl.js

"use strict";

var resoultInfoItemControl = require("resoultInfoItemControl");
// var dialogManager = require("dialogManager");
// var config = require("config");

cc.Class({
    extends: cc.Component,

    properties: {
        guang: {
            default: null,
            type: cc.Sprite
        },
        resoultInfoItem: {
            default: null,
            type: cc.Prefab
        },
        content: {
            default: null,
            type: cc.Node
        }
    },
    onLoad: function onLoad() {
        var width = cc.director.getWinSize().width;
        console.log("width:" + width);
        this.node.width = width;
    },
    start: function start() {
        var rotate = cc.rotateBy(8, 360);
        var repeat_ = cc.repeatForever(rotate);
        this.guang.node.runAction(repeat_);
    },
    show: function show(infos, click1, click2, mySeatId, backHallScene) {
        this.click1 = click1;
        this.click2 = click2;
        this.backHallScene = backHallScene;
        for (var i = 0; i < 3; i++) {
            var resoultInfoItem = cc.instantiate(this.resoultInfoItem);
            resoultInfoItem.parent = this.content;
            var task = resoultInfoItem.getComponent(resoultInfoItemControl);
            task.init(infos[i].isdizhu, infos[i].nickname, infos[i].difen, infos[i].beishu, infos[i].ledou, mySeatId == i, infos[i].coin, infos[i].rateMax);
        }
    },
    btn1Click: function btn1Click() {
        console.log("btn1Click");
        if (this.click1) {
            this.click1();
        }
        if (this.node) {
            this.node.destroy();
        }
        cc.vv.audioMgr.playSFX("SpecOk");
    },
    btn2Click: function btn2Click() {
        console.log("btn2Click");
        if (this.click2) {
            this.click2();
        }
        if (this.node) {
            this.node.destroy();
        }
        cc.vv.audioMgr.playSFX("SpecOk");
    },
    close: function close() {
        var self = this;
        // dialogManager.showCommonDialog("提示","是否返回大厅！",function(){
        //     if(self.backHallScene){
        //         self.backHallScene()
        //         self.node.destroy();
        //     }
        // },function(){
        // });
        // this.node.destroy();

        if (self.backHallScene) {
            self.backHallScene();
            self.node.destroy();
        }
        cc.vv.audioMgr.playSFX("SpecOk");
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
        //# sourceMappingURL=gameResultControl.js.map
        