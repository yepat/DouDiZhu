(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/dialog/shareControl.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '69186QOGcNP24M8wI7sbkLu', 'shareControl', __filename);
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
        },
        btnNode_get: {
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
        this.palyerNum = 0; //邀请玩家人数

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

        cc.vv.audioMgr.playSFX("SpecOk");
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

        //"小伙伴们帮帮忙，小手一点助我拿豆！"
        var _palyerNum = 5 - this.palyerNum;

        console.log("xxxxxxx", _palyerNum);

        if (_palyerNum > 0) {} else {
            return;
        }

        var index = config.getRandom(1);
        var shareTxt = config.shareTxt["share"][index];
        if (index == 1) {
            shareTxt = "【仅剩" + _palyerNum + "人】麻烦你啦，点击帮我拆礼包吧！";
        }
        console.log(">>>>shareTxt:", shareTxt);

        var shareImg = config.getShareImgPath("share");
        console.log(">>>shareImg:", shareImg);

        // cc.loader.loadRes("shareImg",function(err,data){
        wx.shareAppMessage({
            title: shareTxt,
            imageUrl: shareImg,
            query: "key=" + PlayerDetailModel.uid,
            success: function success(res) {
                console.log("---转发成功!!!");
                console.log(res);
                GameNetMgr.sendRequest("System", "ShareWxRes", 2);
            },
            fail: function fail(res) {
                console.log("---转发失败!!!");
            }
        });
        // });

        cc.vv.audioMgr.playSFX("SpecOk");
    },
    getClick: function getClick() {
        console.log("-------get");
        GameNetMgr.sendRequest("System", "ShareGet");
        cc.vv.audioMgr.playSFX("SpecOk");
    },
    onShareInfoResult: function onShareInfoResult(event) {
        var response = event.getUserData();
        console.log(response);

        // "img":头像
        // "nickname":昵称
        // "uid":uid
        // "award":0没有领取1已领取
        // "award_info":[ //奖品
        // "gold":金币

        var list = response.data.list;
        this.palyerNum = 0;
        for (var i = 0; i < list.length; i++) {
            if (list[i].img) {
                this.pHeads[i].enabled = true;
                this.setHeadUrl(list[i].img, this.pHeads[i]);
                this.palyerNum++;
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
        var self = this;
        var awarded = response.data.awarded;
        // dialogManager.showCommonDialog("温馨提示",response.data.award_desc,function(){
        //     if(awarded<5&&response.data.award.length==0){
        //         self.btnClick();
        //         for(var i=0;i<awarded;i++){
        //             self.labCoins[i].string = "已领取";
        //         }
        //     }
        // });
        var award = response.data.award;
        var list = [];
        if (award.coins) {
            var args = {
                arg1: "ledou",
                arg2: award.coins
            };
            list.push(args);
        }
        if (award.coupon) {
            var args = {
                arg1: "lequan",
                arg2: award.coupon
            };
            list.push(args);
        }
        if (list.length > 0) {
            dialogManager.showAnimGetProp(list, function () {
                if (awarded <= 5) {
                    // self.btnClick();
                    for (var i = 0; i < awarded; i++) {
                        self.labCoins[i].string = "已领取";
                    }
                }
            });
        } else {
            if (awarded == 5) {
                dialogManager.showCommonDialog("温馨提示", response.data.award_desc);
            } else {
                // self.btnClick();
                dialogManager.showCommonDialog("温馨提示", response.data.award_desc, function () {
                    self.btnClick();
                });
            }
        }

        PlayerDetailModel.setShareUnReward(0);
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
        //# sourceMappingURL=shareControl.js.map
        