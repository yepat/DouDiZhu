"use strict";
cc._RF.push(module, 'a85e4oibOFF+Ip+aqcwZSHY', 'PopCardUtil');
// Script/PopCardUtil.js

"use strict";

var config = require("config");
// var CardUtil = require("CardUtil")

var PopCardUtil = {};

//牌直转换（文本转数值）
PopCardUtil.StringToNumber = function (str) {
    var num = 0;
    if (typeof str == "string") {
        num = parseInt(str);
    } else {
        num = str;
    }
    return num;
};

//找出相同的牌 放进一个数组
PopCardUtil.getSameCards = function (cards) {
    var source = [];
    for (var i = 0; i < cards.length; i++) {
        source[i] = PopCardUtil.StringToNumber(cards[i]);
    }
    // console.log("sourcelength:"+source.length);

    var sameValues = [];
    var tampValues = [];
    var k = "";
    var tempValue = source[0];
    // var flag = false;
    for (var i = 0; i < source.length; i++) {
        if (source[i] == tempValue) {
            tampValues.push(source[i]);
            if (i == source.length - 1) {
                // sameValues.push(tampValues);
                k = "" + tempValue;
                // console.log("kk3:"+k+" length:"+tampValues.length);
                sameValues[k] = tampValues;
            }
        } else {
            // sameValues.push(tampValues);
            k = "" + tempValue;
            // console.log("kk1:"+k+" length:"+tampValues.length);

            sameValues[k] = tampValues;
            tampValues = [];
            tempValue = source[i];
            tampValues.push(tempValue);

            if (i == source.length - 1) {
                k = "" + tempValue;
                // console.log("kk2:"+k+" length:"+tampValues.length);
                sameValues[k] = tampValues;
            }
        }
    }
    // console.log(sameValues);
    return sameValues;
};

PopCardUtil.SingleNum = 0;
PopCardUtil.PairNum = 0;
PopCardUtil.ThreeNum = 0;
PopCardUtil.FourNum = 0;

PopCardUtil.SingleCards = [];
PopCardUtil.PairCards = [];
PopCardUtil.ThreeCards = [];
PopCardUtil.FourCards = [];

PopCardUtil.setSameVulueCardCount = function (cards) {
    var SingleNum = 0;
    var PairNum = 0;
    var ThreeNum = 0;
    var FourNum = 0;

    var SingleCards = [];
    var PairCards = [];
    var ThreeCards = [];
    var FourCards = [];

    for (var k in cards) {
        var d = cards[k];
        // console.log(">>length:"+d.length+"  k:"+k);
        if (d.length == 1) {
            SingleNum++;
            SingleCards.push(d);
        } else if (d.length == 2) {
            PairNum++;
            PairCards.push(d);
        } else if (d.length == 3) {
            ThreeNum++;
            ThreeCards.push(d);
        } else if (d.length == 4) {
            FourNum++;
            FourCards.push(d);
        }
    }
    PopCardUtil.SingleNum = SingleNum;
    PopCardUtil.PairNum = PairNum;
    PopCardUtil.ThreeNum = ThreeNum;
    PopCardUtil.FourNum = FourNum;

    PopCardUtil.SingleCards = SingleCards;
    PopCardUtil.PairCards = PairCards;
    PopCardUtil.ThreeCards = ThreeCards;
    PopCardUtil.FourCards = FourCards;

    // console.log("SingleNum:"+SingleNum);
    // console.log("PairNum:"+PairNum);
    // console.log("ThreeNum:"+ThreeNum);
    // console.log("FourNum:"+FourNum);
};
PopCardUtil.getSingle = function () {
    var SingleCards = [];
    SingleCards.cards = PopCardUtil.SingleCards;
    SingleCards.count = PopCardUtil.SingleNum;
    // return PopCardUtil.SingleNum;
    // console.log(SingleCards);
    return SingleCards;
};
PopCardUtil.getPair = function () {
    var PairCards = [];
    PairCards.cards = PopCardUtil.PairCards;
    PairCards.count = PopCardUtil.PairNum;
    // return PopCardUtil.PairNum;
    // console.log(PairCards);
    return PairCards;
};
PopCardUtil.getThree = function () {
    var ThreeCards = [];
    ThreeCards.cards = PopCardUtil.ThreeCards;
    ThreeCards.count = PopCardUtil.ThreeNum;
    // return PopCardUtil.ThreeNum;
    // console.log(ThreeCards);
    return ThreeCards;
};
PopCardUtil.getFour = function () {
    var FourCards = [];
    FourCards.cards = PopCardUtil.FourCards;
    FourCards.count = PopCardUtil.FourNum;
    // return PopCardUtil.FourNum;
    // console.log(FourCards);
    return FourCards;
};

module.exports = PopCardUtil;

cc._RF.pop();