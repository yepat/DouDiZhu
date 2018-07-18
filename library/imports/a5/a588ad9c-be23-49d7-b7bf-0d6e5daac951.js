"use strict";
cc._RF.push(module, 'a588a2cviNJ17e/DW5dqslR', 'animPropControl');
// Script/animation/animPropControl.js

"use strict";

var config = require("config");
cc.Class({
    extends: cc.Component,

    properties: {
        sp_prop: {
            default: null,
            type: cc.Sprite
        },
        lab_num: {
            default: null,
            type: cc.Label
        }
    },
    onLoad: function onLoad() {
        this.lab_num.string = "";
    },

    // start () {
    // },
    show: function show(args) {
        var name = args.arg1;
        var num = args.arg2;
        if (name == "lequan") {
            config.loadImage(this.sp_prop, "p_daoju_lequan");
        } else if (name == "jipaiqi") {
            config.loadImage(this.sp_prop, "p_daoju_jpq");
        } else if (name == "ledou") {
            // config.loadImage(this.sp_prop,"p_daoju_ledou");
        }
        this.lab_num.string = "X " + num;
    },
    close: function close() {
        this.node.destroy();
    }
});

cc._RF.pop();