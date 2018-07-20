"use strict";
cc._RF.push(module, 'a70ae9sWxROLoEclQxr/OAA', 'emailItemControl');
// Script/dialog/emailItemControl.js

"use strict";

var GameNetMgr = require("GameNetMgr");
var PlayerDetailModel = require("PlayerDetailModel");
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
        this.info = 0;
        this.id = 0;

        //领取/删除按钮
        //v.items == 1  //领取
        //v.is_read == 1 --已读
    },
    init: function init(info, id, title, content, time) {
        this.info = info;
        this.id = id;
        this.labTitle.string = title;
        this.labContent.string = content;
        this.labTime.string = time;
        if (info.is_read == 1) {
            //已读
            this.read.active = true;
        } else {
            //未读
            this.unRead.active = true;
        }
    },
    getClick: function getClick() {
        console.log("点击了邮件" + this.id);
        GameNetMgr.sendRequest("System", "ReadMail", this.id);
        GameNetMgr.sendRequest("System", "GetMailAttachment", this.id);

        var num = PlayerDetailModel.getMailUnread();
        PlayerDetailModel.setMailUnread(num - 1);

        this.node.destroy();

        cc.vv.audioMgr.playSFX("SpecOk");
    }
});

cc._RF.pop();