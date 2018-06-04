"use strict";
cc._RF.push(module, 'd79724yjfxDdbgN/3Ee9zWb', 'gameResultControl');
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

        var infos = {
            0: { isdizhu: false, nickname: "新手123", difen: 60, beishu: 1000, ledou: "- 60000" },
            1: { isdizhu: true, nickname: "新手333", difen: 60, beishu: 1000, ledou: "+820000" },
            2: { isdizhu: false, nickname: "新手456", difen: 60, beishu: 1000, ledou: "- 10000" }
        };

        for (var i = 0; i < 3; i++) {
            var resoultInfoItem = cc.instantiate(this.resoultInfoItem);
            resoultInfoItem.parent = this.content;
            var task = resoultInfoItem.getComponent(resoultInfoItemControl);
            task.init(infos[i].isdizhu, infos[i].nickname, infos[i].difen, infos[i].beishu, infos[i].ledou);
        }
    },
    btn1Click: function btn1Click() {
        console.log("btn1Click");
    },
    btn2Click: function btn2Click() {
        console.log("btn2Click");
    }
});

cc._RF.pop();