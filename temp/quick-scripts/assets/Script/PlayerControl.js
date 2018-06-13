(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/PlayerControl.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '3c4f20tXR5PuI0NTCNoAn1B', 'PlayerControl', __filename);
// Script/PlayerControl.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        playerMy: {
            default: null,
            type: cc.Node
        },
        headMyImg: {
            default: null,
            type: cc.Sprite
        },
        headMyName: {
            default: null,
            type: cc.Label
        },
        headMyCoin: {
            default: null,
            type: cc.Label
        },
        headMyLeQuan: {
            default: null,
            type: cc.Label
        },

        playerLeft: {
            default: null,
            type: cc.Node
        },
        headLeftImg: {
            default: null,
            type: cc.Sprite
        },
        headLeftName: {
            default: null,
            type: cc.Label
        },
        headLeftCoin: {
            default: null,
            type: cc.Label
        },

        playerRight: {
            default: null,
            type: cc.Node
        },
        headRightImg: {
            default: null,
            type: cc.Sprite
        },
        headRightName: {
            default: null,
            type: cc.Label
        },
        headRightCoin: {
            default: null,
            type: cc.Label
        }
    },

    // onLoad () {},

    start: function start() {
        this.initMyInfo();
        this.initLeftPlayerInfo();
        this.initRightPlayerInfo();
    },
    initMyInfo: function initMyInfo() {
        //设置微信头像
        var self = this;
        var imgUrl = config.wxInfo.avatarUrl;
        imgUrl = imgUrl + "?aa=aa.jpg";
        cc.loader.load(imgUrl, function (err, texture) {
            self.headMyImg.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
        });

        this.headMyName.string = this.parseString("我自己啊啊啊啊");
        this.headMyCoin.string = this.parseNumber("1000000000");
        this.headMyLeQuan.string = this.parseNumber("500000");
    },
    initLeftPlayerInfo: function initLeftPlayerInfo() {
        var self = this;
        var imgUrl = config.wxInfo.avatarUrl;
        imgUrl = imgUrl + "?aa=aa.jpg";
        cc.loader.load(imgUrl, function (err, texture) {
            self.headLeftImg.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
        });

        this.headLeftName.string = this.parseString("美好的回忆233");
        this.headLeftCoin.string = this.parseNumber("1000000");
    },
    initRightPlayerInfo: function initRightPlayerInfo() {
        var self = this;
        var imgUrl = config.wxInfo.avatarUrl;
        imgUrl = imgUrl + "?aa=aa.jpg";
        cc.loader.load(imgUrl, function (err, texture) {
            self.headRightImg.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
        });

        this.headRightName.string = this.parseString("新手1366567222");
        this.headRightCoin.string = this.parseNumber("1000000");
    },
    parseNumber: function parseNumber(number) {
        if (typeof number == "string") number = parseInt(number);
        if (number >= 100000000) {
            number = Math.floor(number / 100000000);
            number = "" + number + "亿";
        } else if (number >= 1000000) {
            number = Math.floor(number / 10000);
            number = "" + number + "万";
        } else {
            number = "" + number;
        }
        return number;
    },
    parseString: function parseString(string) {
        var str = string.substring(0, 4);
        str = str + "...";
        console.log(">>string:" + string);
        return str;
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
        //# sourceMappingURL=PlayerControl.js.map
        