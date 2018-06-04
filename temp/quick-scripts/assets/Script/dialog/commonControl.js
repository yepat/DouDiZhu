(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/dialog/commonControl.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'b2e3ekBAMRH14LrzU4SYSoz', 'commonControl', __filename);
// Script/dialog/commonControl.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        title: {
            default: null,
            type: cc.Label
        },
        content: {
            default: null,
            type: cc.Label
        },
        btn_cancel: {
            default: null,
            type: cc.Node
        },
        btn_enter: {
            default: null,
            type: cc.Node
        }
    },
    start: function start() {
        // var enter = function(){
        //     console.log("确认按钮");
        // }
        // this.show("xx","但想啊想啊啊想啊",enter,null);
    },
    show: function show(title, content, enterClick, cancelClick) {
        this.title.string = title;
        this.content.string = content;
        if (cancelClick) {} else {
            this.btn_cancel.active = false;
            this.btn_enter.x = 0;
        }
        this.enterClick = enterClick;
        this.cancelClick = cancelClick;
    },
    closeClick: function closeClick() {
        console.log("close click");
        this.node.destroy();
    },
    btnCancelClick: function btnCancelClick() {
        console.log("btn1 click");
        if (this.cancelClick) {
            this.cancelClick();
        }
        this.node.destroy();
    },
    btnEnterClick: function btnEnterClick() {
        console.log("btn2 click");
        if (this.enterClick) {
            this.enterClick();
        }
        this.node.destroy();
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
        //# sourceMappingURL=commonControl.js.map
        