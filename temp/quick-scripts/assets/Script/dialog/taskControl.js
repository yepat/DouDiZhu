(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/dialog/taskControl.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '48cba0x+mdEuZiLRl/DVjiH', 'taskControl', __filename);
// Script/dialog/taskControl.js

"use strict";

var taskItemControl = require("taskItemControl");
var GameNetMgr = require("GameNetMgr");
var EventHelper = require("EventHelper");
var config = require("config");
var dialogManager = require("dialogManager");
var PlayerDetailModel = require("PlayerDetailModel");

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
        var self = this;
        GameNetMgr.sendRequest("System", "TaskDaily");
        EventHelper.AddCustomEvent(config.MyNode, "TaskDailyResult", self.onTaskDailyResult, self);
        EventHelper.AddCustomEvent(config.MyNode, "GetTaskRewardResult", self.onGetTaskRewardResult, self);
    },
    closeClick: function closeClick() {
        var self = this;
        console.log("close click");
        EventHelper.RemoveCustomEvent(config.MyNode, "TaskDailyResult", self.onTaskDailyResult, self);
        EventHelper.RemoveCustomEvent(config.MyNode, "GetTaskRewardResult", self.onGetTaskRewardResult, self);
        this.node.destroy();
    },
    leftClick: function leftClick() {
        // console.log("left click");
        // this.btnLeft_1.enabled = true;
        // this.btnRight_1.enabled = false;
    },
    rightClick: function rightClick() {
        // console.log("right click");
        // this.btnLeft_1.enabled = false;
        // this.btnRight_1.enabled = true; 
    },
    onTaskDailyResult: function onTaskDailyResult(event) {
        var response = event.getUserData();
        console.log(response);
        var listEveryday = response.data.list.everyday;
        for (var i = 0; i < listEveryday.length; i++) {
            var info = listEveryday[i];
            var taskItem = cc.instantiate(this.taskItem);
            taskItem.parent = this.content;
            var task = taskItem.getComponent(taskItemControl);
            var progress = info.complete + "/" + info.target;
            task.init(info, info.desc, info.award_desc, progress);
        }
    },
    onGetTaskRewardResult: function onGetTaskRewardResult(event) {
        var response = event.getUserData();
        console.log(response);
        dialogManager.showCommonDialog("温馨提示", response.data.error);
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
        