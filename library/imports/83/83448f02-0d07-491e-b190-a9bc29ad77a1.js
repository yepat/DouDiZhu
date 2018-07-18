"use strict";
cc._RF.push(module, '834488CDQdJHrGQqbwprXeh', 'huodedaojuControl');
// Script/animation/huodedaojuControl.js

"use strict";

// var GameNetMgr = require("GameNetMgr");
// var config = require("config");
var animPropControl = require("animPropControl");
cc.Class({
    extends: cc.Component,

    properties: {
        node_ske: {
            default: null,
            type: cc.Node
        },
        propList: {
            default: null,
            type: cc.Node
        },
        anima_prop: {
            default: null,
            type: cc.Prefab
        }

    },
    onLoad: function onLoad() {
        var width = cc.director.getWinSize().width;
        var height = cc.director.getWinSize().height;
        // console.log("width:"+width);
        // console.log("height:"+height);
        this.node.width = width;
        this.node.height = height;
    },
    start: function start() {
        // var list=[];
        // var args = {
        //     arg1:"ledou",//jipaiqi
        //     arg2:200,
        // }
        // var args1 = {
        //     arg1:"jipaiqi",//jipaiqi
        //     arg2:200,
        // }
        // var args2 = {
        //     arg1:"lequan",
        //     arg2:200,
        // }
        // list.push(args);
        // list.push(args1);
        // list.push(args2);
        // this.show(list);
    },
    show: function show(args) {
        var list = args.arg1;
        var click = args.arg2;
        this.enterClick = click;

        for (var i = 0; i < list.length; i++) {
            var info = list[i];
            var prop = cc.instantiate(this.anima_prop);
            prop.parent = this.propList;
            var task = prop.getComponent(animPropControl);
            task.show(info);
        }

        var self = this;
        cc.vv.audioMgr.playSFX("gifteffect");
        var dragonDisplay = self.node_ske.getComponent(dragonBones.ArmatureDisplay);
        var callFunc1 = cc.callFunc(function () {
            if (dragonDisplay) {
                dragonDisplay.playAnimation('newAnimation');
            }
        });
        var callFunc2 = cc.callFunc(function () {
            if (dragonDisplay) {
                dragonDisplay.playAnimation('newAnimation1');
            }
        });
        var delay1 = cc.delayTime(0.5);
        this.node_ske.runAction(cc.sequence(callFunc1, delay1, callFunc2));
    },
    close: function close() {
        if (this.enterClick) {
            this.enterClick();
        }
        this.node.destroy();
    }
});

cc._RF.pop();