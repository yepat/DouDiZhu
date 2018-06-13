(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/dialog/taskControl.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '48cba0x+mdEuZiLRl/DVjiH', 'taskControl', __filename);
// Script/dialog/taskControl.js

"use strict";

var taskItemControl = require("taskItemControl");
var GameNetMgr = require("GameNetMgr");
cc.Class({
    extends: cc.Component,

    properties: {
        btnLeft_1: {
            default: null,
            type: cc.Sprite
        },
        btnLeft_2: {
            default: null,
            type: cc.Sprite
        },
        btnRight_1: {
            default: null,
            type: cc.Sprite
        },
        btnRight_2: {
            default: null,
            type: cc.Sprite
        },
        content: {
            default: null,
            type: cc.Node
        },
        taskItem: {
            default: null,
            type: cc.Prefab
        }
    },
    start: function start() {
        this.btnRight_1.enabled = false;

        // GameNetMgr.sendRequest

        var testItem = [1, 1, 1, 1, 2, 2, 3, 3, 3, 3];
        var disBetween = 130;
        for (var i = 0; i < testItem.length; i++) {
            var taskItem = cc.instantiate(this.taskItem);
            taskItem.parent = this.content;
            var task = taskItem.getComponent(taskItemControl);
            task.init(testItem[i], "标题", "内容。。。。。。", "1/10");
        }
        this.content.height = disBetween * testItem.length;
    },
    closeClick: function closeClick() {
        console.log("close click");
        this.node.destroy();
    },
    leftClick: function leftClick() {
        console.log("left click");
        this.btnLeft_1.enabled = true;
        this.btnRight_1.enabled = false;
    },
    rightClick: function rightClick() {
        console.log("right click");
        this.btnLeft_1.enabled = false;
        this.btnRight_1.enabled = true;
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
        //# sourceMappingURL=taskControl.js.map
        