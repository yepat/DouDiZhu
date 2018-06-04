"use strict";
cc._RF.push(module, 'bbe82HivaFIsojxh19Nd3Sr', 'taskItemControl');
// Script/dialog/taskItemControl.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        nodeGet: {
            default: null,
            type: cc.Node
        },
        nodeComplete: {
            default: null,
            type: cc.Node
        },
        nodeProgrss: {
            default: null,
            type: cc.Node
        },
        labTitle: {
            default: null,
            type: cc.Label
        },
        labContent: {
            default: null,
            type: cc.Label
        },
        labProgress: {
            default: null,
            type: cc.Label
        }

    },
    onLoad: function onLoad() {
        this.nodeGet.active = false;
        this.nodeComplete.active = false;
        this.nodeProgrss.active = false;
        this.state = 0;
        this.id = 0;
    },

    // start () { 
    // },
    init: function init(state, title, content, progress) {
        this.state = state;
        this.labTitle.string = title;
        this.labContent.string = content;
        if (state == 1) {
            //进行中
            this.nodeProgrss.active = true;
            this.labProgress.string = progress;
        } else if (state == 2) {
            //领取
            this.nodeGet.active = true;
        } else if (state == 3) {
            //完成
            this.nodeComplete.active = true;
        }
    },
    getClick: function getClick() {
        if (this.state == 2) {
            console.log("点击了任务领取按钮");
        }
    }
});

cc._RF.pop();