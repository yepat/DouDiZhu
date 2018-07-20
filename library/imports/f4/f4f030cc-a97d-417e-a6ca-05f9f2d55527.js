"use strict";
cc._RF.push(module, 'f4f03DMqX1BfqbKBfny1VUn', 'BagControl');
// Script/dialog/BagControl.js

"use strict";

var BagItemControl = require("BagItemControl");
var GameNetMgr = require("GameNetMgr");
var EventHelper = require("EventHelper");
var config = require("config");
var dialogManager = require("dialogManager");
var PlayerDetailModel = require("PlayerDetailModel");

cc.Class({
    extends: cc.Component,

    properties: {
        btnLeft_1: {
            default: null,
            type: cc.Sprite
        },
        btnLeft_2: {
            default: null,
            type: cc.Sprite
        },
        btnRight_1: {
            default: null,
            type: cc.Sprite
        },
        btnRight_2: {
            default: null,
            type: cc.Sprite
        },
        content: {
            default: null,
            type: cc.Node
        },
        propItem: {
            default: null,
            type: cc.Prefab
        },
        lab_tips: {
            default: null,
            type: cc.Label
        }
    },
    onLoad: function onLoad() {
        this.lab_tips.string = "空空如也";
    },
    start: function start() {
        // this.btnRight_1.enabled = false;
        var self = this;
        GameNetMgr.sendRequest("System", "BagInfo");
        EventHelper.AddCustomEvent(config.MyNode, "BagInfoResult", self.onBagInfoResult, self);
        // this.show();
    },
    onBagInfoResult: function onBagInfoResult(event) {
        var response = event.getUserData();
        console.log("背包：", response);
        this.show(response.data);
    },
    show: function show(data) {
        // var coupon = PlayerDetailModel.getCoupon();
        // var list = [
        //     {propName:"lequan",propNum:coupon},{propName:"jipaiqi",propNum:"11"},
        // ]
        var list = [];
        var item = { propName: "lequan", propNum: data.list.coupon };
        list.push(item);

        if (data.list.noteCards) {
            var item = { propName: "jipaiqi", propNum: data.list.noteCards };
            list.push(item);
        }

        for (var i = 0; i < list.length; i++) {
            var propItem = cc.instantiate(this.propItem);
            propItem.parent = this.content;
            var prop = propItem.getComponent(BagItemControl);
            prop.show(list[i].propName, list[i].propNum, i);
        }
        if (list.length > 0) {
            this.lab_tips.string = "";
        }
    },
    closeClick: function closeClick() {
        console.log("close click");
        var self = this;
        EventHelper.RemoveCustomEvent(config.MyNode, "BagInfoResult", self.onBagInfoResult, self);
        this.node.destroy();
        cc.vv.audioMgr.playSFX("SpecOk");
    },
    leftClick: function leftClick() {
        console.log("left click");
        this.btnLeft_1.enabled = true;
        this.btnRight_1.enabled = false;
        cc.vv.audioMgr.playSFX("SpecOk");
    },
    rightClick: function rightClick() {
        console.log("right click");
        this.btnLeft_1.enabled = false;
        this.btnRight_1.enabled = true;
        cc.vv.audioMgr.playSFX("SpecOk");
    }
});

cc._RF.pop();