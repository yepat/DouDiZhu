(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/dialog/AuthorizeControl.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '33b87emX1pFPo8NaAniAuL7', 'AuthorizeControl', __filename);
// Script/dialog/AuthorizeControl.js

"use strict";

// var GameNetMgr = require("GameNetMgr");
// var PlayerDetailModel = require("PlayerDetailModel");
// var config = require("config");
var dialogManager = require("dialogManager");
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
        btn_enter: {
            default: null,
            type: cc.Node,
            opentype: "getUserInfo"
        }
    },
    start: function start() {
        // var enter = function(){
        //     console.log("确认按钮");
        // }
        // this.show("xx","但想啊想啊啊想啊",enter,null);
    },
    show: function show(args) {
        var title = args.arg1;
        var content = args.arg2;
        var enterClick = args.arg3;

        if (title != "") this.title.string = title;
        if (content != "") this.content.string = content;
        this.enterClick = enterClick;
    },
    closeClick: function closeClick() {
        console.log("close click");
        // this.node.destroy();
        // cc.vv.audioMgr.playSFX("SpecOk");
    },
    btnEnterClick: function btnEnterClick() {
        console.log("btn2 click");
        wx.authorize({
            // scope: 'scope.userInfo',
            success: function success(res) {
                console.log("authorize 获取信息成功!!!");
            },
            fail: function fail(res) {
                // iOS 和 Android 对于拒绝授权的回调 errMsg 没有统一，需要做一下兼容处理
                if (res.errMsg.indexOf('auth deny') > -1 || res.errMsg.indexOf('auth denied') > -1) {
                    // 处理用户拒绝授权的情况
                    console.log("authorize 获取信息失败!!!");
                    // dialogManager.showAuthorizeDialog("","",null);
                }
            }
        });
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
        //# sourceMappingURL=AuthorizeControl.js.map
        