(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/util/PokerData.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '2200e8z40ZFt4GkVby0nQUb', 'PokerData', __filename);
// Script/PokerData.js

"use strict";

// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html

var config = require("config");
var helper = require("helper");
var CardUtil = require("CardUtil");

var PokerData = {};

PokerData.cardNo = ["A", 2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K", "G", "g"];

PokerData.showData = [];
//创建纸牌数据
PokerData.setPokerData = function () {
    for (var i = 0; i < PokerData.cardNo.length; i++) {
        if (i < PokerData.cardNo.length - 2) {
            for (var key in config.pokerCardType) {
                var pokerDataItem = {
                    showTxt: PokerData.cardNo[i],
                    showType: config.pokerCardType[key]
                };
                PokerData.showData.push(pokerDataItem);
            }
        } else {
            if (i == 13) {
                var pokerDataItem = {
                    showTxt: PokerData.cardNo[i],
                    showType: config.ghostCardType.bigG
                };
                PokerData.showData.push(pokerDataItem);
            } else if (i == 14) {
                var pokerDataItem = {
                    showTxt: PokerData.cardNo[i],
                    showType: config.ghostCardType.smallG
                };
                PokerData.showData.push(pokerDataItem);
            }
        }
    }
};
//得到纸牌数据
PokerData.getPokerData = function () {
    return PokerData.showData;
};
PokerData.bodyPokerData = [];
//将纸牌分为三份，默认第三份为地主，得20张
PokerData.partCards = function () {
    var copyPokerData = helper.copyObj(PokerData.showData);

    for (var j = 0; j < 2; j++) {
        var bodyPokerDataItem = [];
        for (var i = 0; i < 17; i++) {
            var num = Math.floor(Math.random() * copyPokerData.length);
            // cc.log("PokerData.partCards num:"+num);
            var pokerData = copyPokerData[num];
            bodyPokerDataItem.push(pokerData);
            copyPokerData.splice(num, 1);
        }
        PokerData.bodyPokerData.push(bodyPokerDataItem);
    }
    PokerData.bodyPokerData.push(copyPokerData);
    //对纸牌数据进行排序
    for (var i = 0; i < PokerData.bodyPokerData.length; i++) {
        PokerData.bodyPokerData[i].sort(CardUtil.gradeDown);
    }
};
//得到分成三份的数据
PokerData.getPartCardsData = function () {
    return PokerData.bodyPokerData;
};
//准备纸牌数据
PokerData.load = function () {
    PokerData.setPokerData();
    PokerData.partCards();
    //console.log(PokerData.getPartCardsData());
};
module.exports = PokerData;

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
        //# sourceMappingURL=PokerData.js.map
        