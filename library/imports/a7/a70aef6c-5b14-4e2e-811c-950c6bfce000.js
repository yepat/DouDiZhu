"use strict";
cc._RF.push(module, 'a70ae9sWxROLoEclQxr/OAA', 'emailItemControl');
// Script/dialog/emailItemControl.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        read: {
            default: null,
            type: cc.Node
        },
        unRead: {
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
        labTime: {
            default: null,
            type: cc.Label
        }
    },
    onLoad: function onLoad() {
        this.read.active = false;
        this.unRead.active = false;
        this.state = 0;
        this.id = 0;
    },
    init: function init(state, id, title, content, time) {
        this.state = state;
        this.id = id;
        this.labTitle.string = title;
        this.labContent.string = content;
        this.labTime.string = time;
        if (state == 1) {
            //未读
            this.unRead.active = true;
        } else if (state == 2) {
            //已读
            this.read.active = true;
        }
    },
    getClick: function getClick() {
        // if(this.state == 1){
        console.log("点击了邮件" + this.id);
        // }
    }
});

cc._RF.pop();