"use strict";
cc._RF.push(module, 'f4f03DMqX1BfqbKBfny1VUn', 'BagControl');
// Script/dialog/BagControl.js

"use strict";

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
        }
    },
    start: function start() {
        this.btnRight_1.enabled = false;
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