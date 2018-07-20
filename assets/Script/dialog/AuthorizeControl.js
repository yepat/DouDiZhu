// var GameNetMgr = require("GameNetMgr");
// var PlayerDetailModel = require("PlayerDetailModel");
// var config = require("config");
var dialogManager = require("dialogManager");
cc.Class({
    extends: cc.Component,

    properties: {
        title : {
            default : null,
            type : cc.Label
        },
        content : {
            default : null,
            type : cc.Label
        },
        btn_enter : {
            default : null,
            type : cc.Node,
            opentype : "getUserInfo"
        }
    },
    start () {   
        // var enter = function(){
        //     console.log("确认按钮");
        // }
        // this.show("xx","但想啊想啊啊想啊",enter,null);
    },   
    show(args){
        var title = args.arg1;
        var content = args.arg2;
        var enterClick = args.arg3;

        if(title!="")
            this.title.string = title;
        if(content!="") 
            this.content.string = content;
        this.enterClick = enterClick;
    },
    closeClick(){
        console.log("close click");
        // this.node.destroy();
        // cc.vv.audioMgr.playSFX("SpecOk");
    },
    btnEnterClick(){
        console.log("btn2 click");
        wx.authorize({
            // scope: 'scope.userInfo',
            success: function (res) {
                console.log("authorize 获取信息成功!!!")
            },
            fail: function (res) {
              // iOS 和 Android 对于拒绝授权的回调 errMsg 没有统一，需要做一下兼容处理
              if (res.errMsg.indexOf('auth deny') > -1 || res.errMsg.indexOf('auth denied') > -1 ) {
                // 处理用户拒绝授权的情况
                console.log("authorize 获取信息失败!!!")
                // dialogManager.showAuthorizeDialog("","",null);
              }    
            }
          });
        this.node.destroy();
    }
});
