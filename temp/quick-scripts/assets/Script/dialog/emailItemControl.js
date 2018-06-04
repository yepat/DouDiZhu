(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/dialog/emailItemControl.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'a70ae9sWxROLoEclQxr/OAA', 'emailItemControl', __filename);
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
        //# sourceMappingURL=emailItemControl.js.map
        