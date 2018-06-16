
var emailItemControl = require("emailItemControl");
var GameNetMgr = require("GameNetMgr");
var EventHelper = require("EventHelper");
var config = require("config");
var dialogManager = require("dialogManager");
var PlayerDetailModel = require("PlayerDetailModel");
cc.Class({
    extends: cc.Component,

    properties: {
        btnLeft_1 : {
            default : null,
            type : cc.Sprite
        },
        btnLeft_2 : {
            default : null,
            type : cc.Sprite
        },
        btnRight_1 : {
            default : null,
            type : cc.Sprite
        },
        btnRight_2 : {
            default : null,
            type : cc.Sprite
        },
        content : {
            default : null,
            type : cc.Node
        },
        emailItem : {
            default : null,
            type : cc.Prefab
        },
        label_noEmail : {
            default : null,
            type : cc.Label
        },
    },
    start () {
        var self = this;
        // this.btnRight_1.enabled = false;

        this.label_noEmail.node.active = false;
        GameNetMgr.sendRequest("System","Mail");
        EventHelper.AddCustomEvent(config.MyNode,"MailResult",self.onMailResult,self);
        EventHelper.AddCustomEvent(config.MyNode,"ReadMailResult",self.onReadMailResult,self);
        EventHelper.AddCustomEvent(config.MyNode,"GetMailAttachmentResult",self.onGetMailAttachmentResult,self);
    },
    closeClick(){
        console.log("close click");
        var self = this;
        EventHelper.RemoveCustomEvent(config.MyNode,"MailResult",self.onMailResult,self);
        EventHelper.RemoveCustomEvent(config.MyNode,"ReadMailResult",self.onReadMailResult,self);
        EventHelper.RemoveCustomEvent(config.MyNode,"GetMailAttachmentResult",self.onGetMailAttachmentResult,self);
        this.node.destroy();
    },
    leftClick(){
        // console.log("left click");
        // this.btnLeft_1.enabled = true;
        // this.btnRight_1.enabled = false;
    },
    rightClick(){
        // console.log("right click");
        // this.btnLeft_1.enabled = false;
        // this.btnRight_1.enabled = true; 
    },
    onMailResult(event){
        var response = event.getUserData();
        console.log(response);
        var list = response.data.list;

        if(list.length == 0){
            this.label_noEmail.node.active = true;
        }
        for(var i = 0;i<list.length;i++){
            var info = list[i];
            var emailItem = cc.instantiate(this.emailItem);
            emailItem.parent = this.content;
            var task = emailItem.getComponent(emailItemControl);
            task.init(info,info.id,info.subject,info.content,info.create_time);
        }
    },
    onReadMailResult(event){
        var response = event.getUserData();
        console.log(response);
    },
    onGetMailAttachmentResult(event){
        var response = event.getUserData();
        console.log(response);
        var text = "恭喜您";
        if (response.data.coins){//乐豆
            text = text + "获得乐豆" + response.data.coins;
        }
        if (response.data.coupon){ //乐劵
            text = text + "获得乐劵" + response.data.coupon;
        }
        if (response.data.propItems){
            for (k in response.data.propItems){
                var v = response.data.propItems[k];
                text = text + "获得道具" + v.name + v.num +"个";
            }
        }
        dialogManager.showCommonDialog("温馨提示",text);
    }
});
