"use strict";
cc._RF.push(module, 'ca1bfsOJVRIfZ+JaI0gWh+N', 'HallLayerControl');
// Script/HallLayerControl.js

"use strict";

var config = require("config");
var EventHelper = require("EventHelper");
var PlayerDetailModel = require("PlayerDetailModel");
var dialogManager = require("dialogManager");

cc.Class({
    extends: cc.Component,

    properties: {
        headImg: {
            default: null,
            type: cc.Sprite
        },
        playerName: {
            default: null,
            type: cc.Label
        },
        playerLevel: {
            default: null,
            type: cc.Label
        },
        playerLedou: {
            default: null,
            type: cc.Label
        },
        playerLeQuan: {
            default: null,
            type: cc.Label
        }
    },
    // onLoad () {},
    start: function start() {
        var self = this;
        self.setHeadUrl("");
        self.setNickName(PlayerDetailModel.getNickName());
        self.setLevel(PlayerDetailModel.getTitle());
        self.setLeDou(PlayerDetailModel.getCoin());
        self.setLuQuan(PlayerDetailModel.getCoupon());
    },
    setHeadUrl: function setHeadUrl(url) {
        var self = this;
        //设置微信头像
        var imgUrl = "http://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLSO7sOWsNicYdNM3MbNGGo58zticxgqoO2aqS7zOCVClXl7WExa4KNQ48uSTSszicsyspzsDQ51M4EQ/132";
        imgUrl = imgUrl + "?aa=aa.jpg";
        cc.loader.load(imgUrl, function (err, texture) {
            self.headImg.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
        });
    },
    setNickName: function setNickName(name) {
        //修改昵称
        this.playerName.string = name;
    },
    setLevel: function setLevel(lv) {
        //修改等级
        this.playerLevel.string = lv;
    },
    setLeDou: function setLeDou(number) {
        //修改乐豆数
        if (number >= 10000000) {
            number = Math.floor(number / 10000);
            this.playerLedou.string = "" + number + "万";
        } else {
            this.playerLedou.string = "" + number;
        }
    },
    setLuQuan: function setLuQuan(number) {
        //修改乐券数
        if (number >= 10000000) {
            number = Math.floor(number / 10000);
            this.playerLeQuan.string = "" + number + "万";
        } else {
            this.playerLeQuan.string = "" + number;
        }
    },
    btnSetClick: function btnSetClick() {
        console.log("btnSetClick");
        dialogManager.showSetDialog();
    },
    btnTaskClick: function btnTaskClick() {
        console.log("btnTaskClick");
        dialogManager.showTaskDialog();
    },
    btnEmailClick: function btnEmailClick() {
        console.log("btnEmailClick");
        dialogManager.showEmailDialog();
    },
    btnBagClick: function btnBagClick() {
        console.log("btnBagClick");
        dialogManager.showBagDialog();
    },
    btnShopClick: function btnShopClick() {
        console.log("btnShopClick");
    },
    btnShareClick: function btnShareClick() {
        console.log("btnShareClick");
    }
});

cc._RF.pop();