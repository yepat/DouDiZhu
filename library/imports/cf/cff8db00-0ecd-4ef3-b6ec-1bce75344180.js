"use strict";
cc._RF.push(module, 'cff8dsADs1O87bsG851NEGA', 'aboutControl');
// Script/dialog/aboutControl.js

"use strict";

var config = require("config");
cc.Class({
    extends: cc.Component,

    properties: {
        lab_content_1: {
            default: null,
            type: cc.Label
        },
        lab_content_2: {
            default: null,
            type: cc.Label
        }
    },
    start: function start() {
        this.lab_content_2.string = "版本号：" + config.VERSION_ABOUT;
    },
    closeClick: function closeClick() {
        console.log("close click");
        this.node.destroy();
        cc.vv.audioMgr.playSFX("SpecOk");
    }
});

cc._RF.pop();