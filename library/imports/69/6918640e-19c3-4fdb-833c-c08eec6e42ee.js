"use strict";
cc._RF.push(module, '69186QOGcNP24M8wI7sbkLu', 'shareControl');
// Script/dialog/shareControl.js

"use strict";

var PlayerDetailModel = require("PlayerDetailModel");
var dialogManager = require("dialogManager");
var config = require("config");
var GameNetMgr = require("GameNetMgr");
var EventHelper = require("EventHelper");
cc.Class({
    extends: cc.Component,
    properties: {
        btnNode_1: {
            default: null,
            type: cc.Button,
            opentype: "share"
        },
        btnNode_2: {
            default: null,
            type: cc.Button,
            opentype: "share"
        },
        btnNode_3: {
            default: null,
            type: cc.Button,
            opentype: "share"
        },
        btnNode_4: {
            default: null,
            type: cc.Button,
            opentype: "share"
        },
        btnNode_5: {
            default: null,
            type: cc.Button,
            opentype: "share"
        }
    },
    start: function start() {
        var self = this;
        GameNetMgr.sendRequest("System", "ShareInfo");
        EventHelper.AddCustomEvent(config.MyNode, "ShareInfoResult", self.onShareInfoResult, self);
        EventHelper.AddCustomEvent(config.MyNode, "ShareGetResult", self.onShareGetResult, self);

        // var nodeHeads = [];//头像节点
        this.pHeads = []; //微信头像
        this.labCoins = []; //奖励乐豆

        for (var i = 1; i <= 5; i++) {
            // var nodeHead = "shareDialog/"+"head_"+i;
            var pHead = "head_" + i; //+"/mask/defult_head";
            var labCoin = "label_" + i;
            var _pHead = this.node.getChildByName(pHead).getChildByName("mask").getChildByName("defult_head").getComponent(cc.Sprite);
            var _labCoin = this.node.getChildByName(labCoin).getComponent(cc.Label); //.getComponent(cc.Label);
            this.pHeads.push(_pHead);
            this.labCoins.push(_labCoin);
            _pHead.enabled = false;
        }
    },
    closeClick: function closeClick() {
        var self = this;
        console.log("close click");
        this.node.destroy();
        EventHelper.RemoveCustomEvent(config.MyNode, "ShareInfoResult", self.onShareInfoResult, self);
        EventHelper.RemoveCustomEvent(config.MyNode, "ShareGetResult", self.onShareGetResult, self);
    },
    btnClick: function btnClick() {
        // shareImg
        // var width  = cc.director.getWinSize().width;
        // var height  = cc.director.getWinSize().height;
        // canvas.toTempFilePath({
        //     x: 0,
        //     y: 0,
        //     width: width,
        //     height: height,
        //     destWidth: width,
        //     destHeight: height,
        //     success (res) {
        //         //.可以保存该截屏图片
        //         console.log(res)
        //         wx.shareAppMessage({
        //             title: "有乐斗地主等你来战！",
        //             imageUrl: res.tempFilePath,
        //             query : "key="+PlayerDetailModel.uid,
        //         })
        //     }
        // });

        cc.loader.loadRes("shareImg", function (err, data) {
            wx.shareAppMessage({
                title: "小伙伴们帮帮忙，小手一点助我拿豆！",
                imageUrl: data.url,
                query: "key=" + PlayerDetailModel.uid
            });
        });
    },
    getClick: function getClick() {
        console.log("-------get");
        GameNetMgr.sendRequest("System", "ShareGet");
    },
    onShareInfoResult: function onShareInfoResult(event) {
        var response = event.getUserData();
        console.log(response);

        // "img":头像
        // "nickname":昵称
        // "uid":uid
        // "award":0没有领取1已领取
        // "award_info":[ //奖品
        //   "gold":金币

        var list = response.data.list;
        for (var i = 0; i < list.length; i++) {
            if (list[i].img) {
                this.pHeads[i].enabled = true;
                this.setHeadUrl(list[i].img, this.pHeads[i]);
            }
            if (list[i].award) {
                if (list[i].award == 0) {
                    this.labCoins[i].string = "" + list[i].award_desc;
                } else {
                    this.labCoins[i].string = "已领取";
                }
            }
        }
    },
    onShareGetResult: function onShareGetResult(event) {
        var response = event.getUserData();
        console.log(response);
        dialogManager.showCommonDialog("温馨提示", response.data.award_desc);
    },
    setHeadUrl: function setHeadUrl(imgUrl, headImg) {
        // console.log(headImg);
        // console.log(imgUrl);
        //设置微信头像
        imgUrl = imgUrl + "?aa=aa.jpg";
        cc.loader.load(imgUrl, function (err, texture) {
            headImg.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
        });
    }
});

cc._RF.pop();