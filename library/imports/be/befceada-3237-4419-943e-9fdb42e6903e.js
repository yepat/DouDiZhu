"use strict";
cc._RF.push(module, 'befceraMjdEGZQ+n9tC5pA+', 'resoultInfoItemControl');
// Script/dialog/resoultInfoItemControl.js

"use strict";

var emailItemControl = require("emailItemControl");
cc.Class({
    extends: cc.Component,

    properties: {
        pDizhu: {
            default: null,
            type: cc.Sprite
        },
        labNickName: {
            default: null,
            type: cc.Label
        },
        labDifen: {
            default: null,
            type: cc.Label
        },
        labBeishu: {
            default: null,
            type: cc.Label
        },
        labLedou: {
            default: null,
            type: cc.Label
        }
    },
    onLoad: function onLoad() {
        this.pDizhu.node.active = false;
    },

    // start () {

    // },   
    init: function init(isDizhi, name, difen, beishu, ledou) {
        if (isDizhi) {
            this.pDizhu.node.active = true;
        } else {
            this.labNickName.node.color = new cc.Color(255, 255, 255);
            this.labDifen.node.color = new cc.Color(255, 255, 255);
            this.labBeishu.node.color = new cc.Color(255, 255, 255);
            this.labLedou.node.color = new cc.Color(255, 255, 255);
        }
        this.labNickName.string = name;
        this.labDifen.string = "" + difen;
        this.labBeishu.string = "" + beishu;
        this.labLedou.string = "" + ledou;
    }
});

cc._RF.pop();