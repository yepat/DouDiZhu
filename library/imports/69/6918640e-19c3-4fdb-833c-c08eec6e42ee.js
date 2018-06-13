"use strict";
cc._RF.push(module, '69186QOGcNP24M8wI7sbkLu', 'shareControl');
// Script/dialog/shareControl.js

"use strict";

var PlayerDetailModel = require("PlayerDetailModel");
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

        self.btnNode_1.node.on(cc.Node.EventType.TOUCH_START, function (event) {
            console.log("TOUCH_START");
        });

        self.btnNode_1.node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            console.log("TOUCH_MOVE");
        });

        self.btnNode_1.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            console.log("TOUCH_END");
            cc.loader.loadRes("img_dialog/p_sharebg", function (err, data) {
                wx.onShareAppMessage(function (res) {
                    return {
                        title: "有乐斗地主等你来战！",
                        imageUrl: data.url,
                        query: PlayerDetailModel.uid,
                        success: function success(res) {
                            console.log("转发成功!!!");
                            console.log(res);
                            // common.diamond += 20;
                        },
                        fail: function fail(res) {
                            console.log("转发失败!!!");
                        }
                    };
                });
            });
        });
    },
    closeClick: function closeClick() {
        console.log("close click");
        this.node.destroy();
    },
    btnClick: function btnClick(event) {
        var btnName = event.target.name;
        console.log("-------" + btnName);
        // cc.loader.loadRes("shop/p_shop_dou5",function(err,data){
        //     wx.onShareAppMessage(function(res){
        //         return {
        //             title: "有乐斗地主等你来战！",
        //             imageUrl: data.url,
        //             query : PlayerDetailModel.uid,
        //             success(res){
        //                 console.log("转发成功!!!")
        //                 console.log(res);
        //                 // common.diamond += 20;
        //             },
        //             fail(res){
        //                 console.log("转发失败!!!")
        //             } 
        //         }
        //     })
        // });
    },
    getClick: function getClick() {
        console.log("-------get");
    }
});

cc._RF.pop();