(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/dialog/AuthorizeControl.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '33b87emX1pFPo8NaAniAuL7', 'AuthorizeControl', __filename);
// Script/dialog/AuthorizeControl.js

'use strict';

// var GameNetMgr = require("GameNetMgr");
// var PlayerDetailModel = require("PlayerDetailModel");
// var config = require("config");
// var MD5 = require("md5");
// var dialogManager = require("dialogManager");
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
            type: cc.Button,
            opentype: "getUserInfo"
        }
    },
    onLoad: function onLoad() {
        this.btn_enter.active = false;
        var self = this;
        var res = wx.getSystemInfoSync();
        var topdis = res.screenHeight / 2 + 30;
        var leftdis = res.screenWidth / 2 - 50;
        var button = wx.createUserInfoButton({
            type: 'text',
            text: '确定',
            style: {
                left: leftdis,
                top: topdis,
                width: 100,
                height: 40,
                lineHeight: 40,
                backgroundColor: '#27AAFD',
                color: '#ffffff',
                textAlign: 'center',
                fontSize: 16,
                borderRadius: 20
            }
        });
        button.onTap(function (res) {
            if (res.userInfo) {
                button.destroy();
                self.preloadNextScene();
                console.log("获取用户信息成功。", res);
            } else {
                console.log("获取用户信息失败。", res);
            }
        });
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
        // this.node.destroy();
    },
    preloadNextScene: function preloadNextScene() {
        cc.director.preloadScene("LoadingScene", function () {
            cc.director.loadScene("LoadingScene");
        });
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
        