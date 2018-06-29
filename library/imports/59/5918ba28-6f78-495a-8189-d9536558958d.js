"use strict";
cc._RF.push(module, '5918boob3hJWoGJ2VNlWJWN', 'playerInfoControl');
// Script/dialog/playerInfoControl.js

"use strict";

var config = require("config");
var PlayerDetailModel = require("PlayerDetailModel");
var GameNetMgr = require("GameNetMgr");
cc.Class({
    extends: cc.Component,

    properties: {
        head: {
            default: null,
            type: cc.Sprite
        },
        ledou: {
            default: null,
            type: cc.Label
        },
        lequan: {
            default: null,
            type: cc.Label
        },
        nickname: {
            default: null,
            type: cc.Label
        },
        id: {
            default: null,
            type: cc.Label
        },
        duijv: {
            default: null,
            type: cc.Label
        },
        shenglv: {
            default: null,
            type: cc.Label
        },
        expressionNode: {
            default: null,
            type: cc.Node
        },
        nodeLequan: {
            default: null,
            type: cc.Node
        }

    },
    onLoad: function onLoad() {
        this.expressionNode.active = false;
        this.args = {};

        this.canClick = true;
    },
    start: function start() {},
    showMyInfo: function showMyInfo() {
        this.expressionNode.active = true;
        this.canClick = false;
        this.ledou.string = "" + PlayerDetailModel.getCoin();
        this.lequan.string = "" + PlayerDetailModel.getCoupon();
        this.nickname.string = "" + PlayerDetailModel.getNickName();
        this.id.string = "(ID:" + PlayerDetailModel.getUid() + ")";

        var Matches = PlayerDetailModel.getMatches();
        var win = PlayerDetailModel.getWin();
        var rate = 0;
        if (PlayerDetailModel.getMatches() == 0) {
            rate = 0;
        } else {
            rate = Math.ceil(win / Matches * 100);
        }

        this.duijv.string = "对局：" + Matches;
        this.shenglv.string = "胜率：" + rate + "%";
        this.setHeadUrl();
    },
    initInfo: function initInfo(args) {
        if (args == "hall") {
            this.showMyInfo();
            return;
        }
        this.args = args;
        if (args.posName == "my") {
            this.expressionNode.active = false;
            this.nodeLequan.active = true;
        } else {
            this.expressionNode.active = true;
            this.nodeLequan.active = false;
            // if(!args.player)
            //     return;
            // this.ledou.string = ""+args.player.getCoin();
            // // this.lequan.string = ""+args.player.getLeQuan();
            // this.nickname.string = ""+args.player.getNickname();
            // this.id.string = "(ID:"+ args.player.getUid()+")";

            // var Matches = args.player.getPlay();
            // var win = args.player.getWin();
            // var rate = 0;
            // if (Matches == 0){
            //     rate = 0
            // }else{
            //     rate = Math.ceil(win / Matches * 100);
            // }
            // this.duijv.string = "对局："+Matches;
            // this.shenglv.string = "胜率："+rate+"%";
            // this.setHeadUrl(args.player.getWechatImg());
        }
        if (!args.player) return;
        this.ledou.string = "" + args.player.getCoin();
        // this.lequan.string = ""+args.player.getLeQuan();
        this.nickname.string = "" + args.player.getNickname();
        this.id.string = "(ID:" + args.player.getUid() + ")";

        var Matches = args.player.getPlay();
        var win = args.player.getWin();
        var rate = 0;
        if (Matches == 0) {
            rate = 0;
        } else {
            rate = Math.ceil(win / Matches * 100);
        }
        this.duijv.string = "对局：" + Matches;
        this.shenglv.string = "胜率：" + rate + "%";
        this.setHeadUrl(args.player);
    },
    show: function show(args) {
        // console.log(args);
        this.initInfo(args);
    },
    closeClick: function closeClick() {
        console.log("close click");
        cc.vv.audioMgr.playSFX("SpecOk");
        this.node.destroy();
    },
    setHeadUrl: function setHeadUrl(player) {
        var self = this;
        //设置微信头像
        var imgUrl = "";
        if (player) {
            imgUrl = player.getWechatImg();
        }

        if (imgUrl == "") {
            var headUrl = "p_head_woman";
            if (player && player.getGender() == 1) {
                headUrl = "p_head_man";
            }
            cc.loader.loadRes(headUrl, cc.SpriteFrame, function (err, spriteFrame) {
                self.head.getComponent(cc.Sprite).spriteFrame = spriteFrame;
            });
            return;
        }

        imgUrl = imgUrl + "?aa=aa.jpg";
        cc.loader.load(imgUrl, function (err, texture) {
            self.head.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
        });
    },
    btn1Click: function btn1Click() {
        console.log(" 拖鞋");
        if (!this.canClick) return;
        cc.vv.audioMgr.playSFX("SpecOk");
        this.node.destroy();

        var args = this.args;
        var expressionId = 0;
        var emoticonType = 2; //1:表情包，2:表情包道具
        if (config.tableInfo) {
            expressionId = config.tableInfo.emoticon_items[0];
        }
        var data = { sendSeatId: args.sendSeatId, receiveSeatId: args.receiveSeatId, emoticonType: emoticonType, id: expressionId };
        GameNetMgr.sendRequest("Game", "emoticon", data);
    },
    btn2Click: function btn2Click() {
        console.log(" 鸡蛋");
        if (!this.canClick) return;
        cc.vv.audioMgr.playSFX("SpecOk");
        this.node.destroy();

        var args = this.args;
        var expressionId = 0;
        var emoticonType = 2; //1:表情包，2:表情包道具
        if (config.tableInfo) {
            expressionId = config.tableInfo.emoticon_items[1];
        }
        var data = { sendSeatId: args.sendSeatId, receiveSeatId: args.receiveSeatId, emoticonType: emoticonType, id: expressionId };
        GameNetMgr.sendRequest("Game", "emoticon", data);
    },
    btn3Click: function btn3Click() {
        console.log(" 点赞");
        if (!this.canClick) return;
        cc.vv.audioMgr.playSFX("SpecOk");
        this.node.destroy();

        var args = this.args;
        var expressionId = 0;
        var emoticonType = 2; //1:表情包，2:表情包道具
        if (config.tableInfo) {
            expressionId = config.tableInfo.emoticon_items[2];
        }
        var data = { sendSeatId: args.sendSeatId, receiveSeatId: args.receiveSeatId, emoticonType: emoticonType, id: expressionId };
        GameNetMgr.sendRequest("Game", "emoticon", data);
    },
    btn4Click: function btn4Click() {
        console.log(" 鲜花");
        if (!this.canClick) return;
        cc.vv.audioMgr.playSFX("SpecOk");
        this.node.destroy();

        var args = this.args;
        var expressionId = 0;
        var emoticonType = 2; //1:表情包，2:表情包道具
        if (config.tableInfo) {
            expressionId = config.tableInfo.emoticon_items[3];
        }
        var data = { sendSeatId: args.sendSeatId, receiveSeatId: args.receiveSeatId, emoticonType: emoticonType, id: expressionId };
        GameNetMgr.sendRequest("Game", "emoticon", data);
    }
});

cc._RF.pop();