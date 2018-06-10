(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/dialog/chatItemControl.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'b3645qoxnlJU5gaqwi6VMyZ', 'chatItemControl', __filename);
// Script/dialog/chatItemControl.js

"use strict";

var config = require("config");
var GameNetMgr = require("GameNetMgr");

cc.Class({
    extends: cc.Component,

    properties: {
        content: {
            default: null,
            type: cc.Label
        },
        index: 0
    },
    // onLoad () {},
    start: function start() {},
    show: function show(contentTxt, index, parentNode) {
        this.index = index;
        this.content.string = contentTxt;
        this.parentNode = parentNode;
    },
    itemClick: function itemClick() {
        if (this.index) {
            console.log("index:" + this.index);
            var index = this.index;
            var content = config.chatContent[index - 1];
            var arg = {
                id: 1, //音效id，0：不带音效，不为0：为系统对应说话音效
                word: content
            };
            GameNetMgr.sendRequest("Game", "sayToTable", arg);
        }
        if (this.parentNode) {
            // this.click();
            this.parentNode.close();
        }
    }
}
// close(){
//     console.log("close");
//     this.node.destroy();
// }
);

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
        //# sourceMappingURL=chatItemControl.js.map
        