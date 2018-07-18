(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/dialog/ShareGetControl.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'e1abdVKhKlEFKUlnM50Af1y', 'ShareGetControl', __filename);
// Script/dialog/ShareGetControl.js

"use strict";

var GameNetMgr = require("GameNetMgr");
var PlayerDetailModel = require("PlayerDetailModel");
var config = require("config");

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
            type: cc.Node,
            opentype: "share"
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
        var cancelClick = args.arg4;

        if (title != "") this.title.string = title;
        if (content != "") this.content.string = content;
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
        cc.vv.audioMgr.playSFX("SpecOk");
    },
    btnCancelClick: function btnCancelClick() {
        console.log("btn1 click");
        if (this.cancelClick) {
            this.cancelClick();
        }
        this.node.destroy();
        cc.vv.audioMgr.playSFX("SpecOk");
    },
    btnEnterClick: function btnEnterClick() {
        console.log("btn2 click");

        var index = config.getRandom(1);
        var shareTxt = config.shareTxt["jiuji"][index];
        console.log(">>>shareTxt:", shareTxt);

        var shareImg = config.getShareImgPath("jiuji");
        console.log(">>>shareImg:", shareImg);

        // if(this.enterClick){
        //     this.enterClick();

        // cc.loader.loadRes("shareImg",function(err,data){
        wx.shareAppMessage({
            title: shareTxt,
            imageUrl: shareImg,
            query: "key=" + PlayerDetailModel.uid,
            success: function success(res) {
                console.log("---转发成功!!!");
                console.log(res);
                GameNetMgr.sendRequest("System", "ShareWxRes", 3);
                GameNetMgr.sendRequest("Game", "openReliefTip", {});
            },
            fail: function fail(res) {
                console.log("---转发失败!!!");
            }
        });
        // });
        // }
        this.node.destroy();
        cc.vv.audioMgr.playSFX("SpecOk");
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
        //# sourceMappingURL=ShareGetControl.js.map
        