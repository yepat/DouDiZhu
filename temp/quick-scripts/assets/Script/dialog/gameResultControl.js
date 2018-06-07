(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/dialog/gameResultControl.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'd79724yjfxDdbgN/3Ee9zWb', 'gameResultControl', __filename);
// Script/dialog/gameResultControl.js

"use strict";

var resoultInfoItemControl = require("resoultInfoItemControl");
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
    // onLoad () {

    // },
    start: function start() {
        var rotate = cc.rotateBy(8, 360);
        var repeat_ = cc.repeatForever(rotate);
        this.guang.node.runAction(repeat_);

        // var infos = {
        //     0:{isdizhu : false,nickname : "新手123",difen : 60,beishu : 1000,ledou : "- 60000"},
        //     1:{isdizhu : true,nickname : "新手333",difen : 60,beishu : 1000,ledou : "+820000"},
        //     2:{isdizhu : false,nickname : "新手456",difen : 60,beishu : 1000,ledou : "- 10000"},
        // }

        // for(var i = 0;i < 3;i++){
        //     var resoultInfoItem = cc.instantiate(this.resoultInfoItem);
        //     resoultInfoItem.parent = this.content;
        //     var task = resoultInfoItem.getComponent(resoultInfoItemControl);
        //     task.init(infos[i].isdizhu,infos[i].nickname,infos[i].difen,infos[i].beishu,infos[i].ledou);
        // }
    },
    show: function show(infos, click1, click2, mySeatId) {
        this.click1 = click1;
        this.click2 = click2;
        for (var i = 0; i < 3; i++) {
            var resoultInfoItem = cc.instantiate(this.resoultInfoItem);
            resoultInfoItem.parent = this.content;
            var task = resoultInfoItem.getComponent(resoultInfoItemControl);
            task.init(infos[i].isdizhu, infos[i].nickname, infos[i].difen, infos[i].beishu, infos[i].ledou, mySeatId == i);
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
    },
    btn2Click: function btn2Click() {
        console.log("btn2Click");
        if (this.click2) {
            this.click2();
        }
        if (this.node) {
            this.node.destroy();
        }
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
        