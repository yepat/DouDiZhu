// var GameNetMgr = require("GameNetMgr");
// var PlayerDetailModel = require("PlayerDetailModel");
// var config = require("config");
// var MD5 = require("md5");
// var dialogManager = require("dialogManager");
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
            type : cc.Button,
            opentype : "getUserInfo"
        }
    },
    onLoad () {
        this.btn_enter.active = false;
        var self = this;
        var res = wx.getSystemInfoSync()
        var topdis = res.screenHeight/2+30;
        var leftdis = res.screenWidth/2-50;
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
        button.onTap((res) =>{
            if(res.userInfo){
                button.destroy()
                self.preloadNextScene();
                console.log("获取用户信息成功。",res);
            }else{
                console.log("获取用户信息失败。",res);
            }
        });
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
        // this.node.destroy();
    },
    preloadNextScene(){
        cc.director.preloadScene("LoadingScene", function () {
            cc.director.loadScene("LoadingScene");
        });
    },
});
