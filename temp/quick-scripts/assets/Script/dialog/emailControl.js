(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/dialog/emailControl.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '59af9SWmdhEaaOvGCS7ZmBO', 'emailControl', __filename);
// Script/dialog/emailControl.js

"use strict";

var emailItemControl = require("emailItemControl");
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
        emailItem: {
            default: null,
            type: cc.Prefab
        }
    },
    start: function start() {
        this.btnRight_1.enabled = false;

        var testItem = [1, 1, 1, 1, 2, 2, 2, 2, 2, 2];

        var disBetween = 130;
        for (var i = 0; i < testItem.length; i++) {
            var emailItem = cc.instantiate(this.emailItem);
            emailItem.parent = this.content;
            var task = emailItem.getComponent(emailItemControl);
            task.init(testItem[i], i, "标题" + i, "内容111。。。", "2018-05-28 08:36");
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
        //# sourceMappingURL=emailControl.js.map
        