"use strict";
cc._RF.push(module, 'cfc00zTG3FGgL4E2ZZPOFFW', 'LazarilloCardUtil');
// Script/LazarilloCardUtil.js

"use strict";

var config = require("config");
var PopCardUtil = require("PopCardUtil");
var CardUtil = require("CardUtil");
var helper = require("helper");

var LazarilloCardUtil = {};

//获取大于上家的赖子牌组合
LazarilloCardUtil.get_big_tips_cards = function (cardlist, preCardType) {
    var return_cards = [];

    // var testType = {
    //     rank:1,
    //     repeatCount:1,
    //     type:88
    // }
    // preCardType = testType;

    // console.log("------获取大于上家的赖子牌组合")
    // console.log("cardlist",cardlist);
    // console.log("preCardType",preCardType);
    var jokerValue = CardUtil.serverCardValueToClient(config.joker);

    var newCardlist = [];
    for (var i = 0; i < cardlist.length; i++) {
        var cards = cardlist[i][0];
        var jokto = cardlist[i][1];
        // console.log(">>>cards",cards);
        // console.log(">>>jokto",jokto);
        var joktoIndex = 0;
        var tempcards = [];
        for (var j = 0; j < cards.length; j++) {
            var str2 = cards[j].substring(1);
            var cardvalue = CardUtil.serverCardValueToClient(str2);
            if (jokto[joktoIndex] && cardvalue == jokerValue) {
                var joktoValue = CardUtil.serverCardValueToClient(jokto[joktoIndex]);
                tempcards.push(joktoValue);
                joktoIndex++;
            } else {
                tempcards.push(cardvalue);
            }
        }
        tempcards.sort(config.arrayUp);
        // console.log(">>>>tempcards",tempcards);
        var cardstype = CardUtil.get_topCard_type(tempcards);
        var item = {
            cardlist: cardlist[i],
            cardstype: cardstype
        };
        newCardlist.push(item);
    }

    // console.log(">>>newCardlist",newCardlist);
    for (var i = 0; i < newCardlist.length; i++) {
        var cardsType = newCardlist[i].cardstype;
        if (cardsType.type == preCardType.type && cardsType.rank > preCardType.rank || cardsType.type == 88) {
            return_cards.push(newCardlist[i].cardlist);
        }
    }
    console.log(">>>return_cards", return_cards);
    return return_cards;
};

//根据提起的牌获得全部有效牌面(必须有癞子)
LazarilloCardUtil.get_effective_tips_cards = function (cards, lazarillo) {
    var return_cards = [];
    if (!cards) {
        return return_cards;
    }

    //服务器牌值转化
    var clientCards = CardUtil.serverCardsToClient(cards);
    lazarillo = CardUtil.serverCardValueToClient(lazarillo);

    //癞子牌面
    var lz_cards = [];
    //普通牌面
    var tip_cards = [];
    for (var k in clientCards) {
        var v = clientCards[k];
        if (v.showTxt == lazarillo) {
            //癞子牌
            lz_cards.push(clientCards[k]);
        } else {
            //普通牌
            tip_cards.push(clientCards[k]);
        }
    }

    if (lz_cards.length > 0 && tip_cards.length > 0) {
        //有癞子和普通牌
    } else {
        //纯癞子/纯普通牌
        var item = {
            0: cards,
            1: []
        };
        return_cards.push(item);
        return return_cards;
    }

    //癞子数
    var lzLen = lz_cards.length;
    var allCardsCount = tip_cards.length + lzLen; //普通牌和癞子牌的总数

    if (allCardsCount == 2) {
        //一对
        return_cards = LazarilloCardUtil.get_pair_lazarillo_cards(allCardsCount, tip_cards, lazarillo, lzLen, cards);
    } else if (allCardsCount == 3) {
        //三张
        return_cards = LazarilloCardUtil.get_three_lazarillo_cards(allCardsCount, tip_cards, lazarillo, lzLen, cards);
    } else if (allCardsCount == 4) {
        //三带一/四炸
        //三带一    
        var all_cards = LazarilloCardUtil.get_three_single_lazarillo_cards(allCardsCount, tip_cards, lazarillo, lzLen, cards);
        for (var k in all_cards) {
            return_cards[return_cards.length] = all_cards[k];
        }
        //四炸
        all_cards = [];
        all_cards = LazarilloCardUtil.get_bomb_lazarillo_cards(allCardsCount, tip_cards, lazarillo, lzLen, cards);
        for (var k in all_cards) {
            return_cards[return_cards.length] = all_cards[k];
        }
    } else if (allCardsCount == 5) {
        //三带一对/顺子
        //三带一对
        var all_cards = LazarilloCardUtil.get_three_pair_lazarillo_cards(allCardsCount, tip_cards, lazarillo, lzLen, cards);
        for (var k in all_cards) {
            return_cards[return_cards.length] = all_cards[k];
        }
        //顺子
        all_cards = [];
        all_cards = LazarilloCardUtil.get_straight_lazarillo_cards(allCardsCount, tip_cards, lazarillo, lzLen, cards);
        for (var k in all_cards) {
            return_cards[return_cards.length] = all_cards[k];
        }
    } else if (allCardsCount == 6) {
        //四带二张/连对/顺子/飞机
        //四带二张
        var all_cards = LazarilloCardUtil.get_four_single_lazarillo_cards(allCardsCount, tip_cards, lazarillo, lzLen, cards);
        for (var k in all_cards) {
            return_cards[return_cards.length] = all_cards[k];
        }
        //连对
        all_cards = [];
        all_cards = LazarilloCardUtil.get_straight_double_lazarillo_cards(allCardsCount, tip_cards, lazarillo, lzLen, cards);
        for (var k in all_cards) {
            return_cards[return_cards.length] = all_cards[k];
        }
        //顺子
        all_cards = [];
        all_cards = LazarilloCardUtil.get_straight_lazarillo_cards(allCardsCount, tip_cards, lazarillo, lzLen, cards);
        for (var k in all_cards) {
            return_cards[return_cards.length] = all_cards[k];
        }
        //飞机不带
        all_cards = [];
        var len = 2; //飞机长度
        all_cards = LazarilloCardUtil.get_straight_three_lazarillo_cards(len, tip_cards, lazarillo, lzLen, cards, config.CardType.StraightThree);
        for (var k in all_cards) {
            return_cards[return_cards.length] = all_cards[k];
        }
    } else if (allCardsCount == 7 || allCardsCount == 11) {
        //顺子
        return_cards = LazarilloCardUtil.get_straight_lazarillo_cards(allCardsCount, tip_cards, lazarillo, lzLen, cards);
    } else if (allCardsCount == 8) {
        //四带二对/连对/顺子/飞机
        //四带二对
        var all_cards = LazarilloCardUtil.get_four_pair_lazarillo_cards(allCardsCount, tip_cards, lazarillo, lzLen, cards);
        for (var k in all_cards) {
            return_cards[return_cards.length] = all_cards[k];
        }
        //连对
        all_cards = [];
        all_cards = LazarilloCardUtil.get_straight_double_lazarillo_cards(allCardsCount, tip_cards, lazarillo, lzLen, cards);
        for (var k in all_cards) {
            return_cards[return_cards.length] = all_cards[k];
        }
        //顺子
        all_cards = [];
        all_cards = LazarilloCardUtil.get_straight_lazarillo_cards(allCardsCount, tip_cards, lazarillo, lzLen, cards);
        for (var k in all_cards) {
            return_cards[return_cards.length] = all_cards[k];
        }
        //飞机带单
        all_cards = [];
        var len = 2; //飞机长度
        all_cards = LazarilloCardUtil.get_straight_three_lazarillo_cards(len, tip_cards, lazarillo, lzLen, cards, config.CardType.StraightThreePlusSingle);
        for (var k in all_cards) {
            return_cards[return_cards.length] = all_cards[k];
        }
    } else if (allCardsCount == 9) {
        //顺子/飞机
        //顺子
        var all_cards = LazarilloCardUtil.get_straight_lazarillo_cards(allCardsCount, tip_cards, lazarillo, lzLen, cards);
        for (var k in all_cards) {
            return_cards[return_cards.length] = all_cards[k];
        }
        //飞机不带
        all_cards = [];
        var len = 3; //飞机长度
        all_cards = LazarilloCardUtil.get_straight_three_lazarillo_cards(len, tip_cards, lazarillo, lzLen, cards, config.CardType.StraightThree);
        for (var k in all_cards) {
            return_cards[return_cards.length] = all_cards[k];
        }
    } else if (allCardsCount == 10) {
        //连对/顺子/飞机
        //连对
        var all_cards = LazarilloCardUtil.get_straight_double_lazarillo_cards(allCardsCount, tip_cards, lazarillo, lzLen, cards);
        for (var k in all_cards) {
            return_cards[return_cards.length] = all_cards[k];
        }
        //顺子
        all_cards = [];
        all_cards = LazarilloCardUtil.get_straight_lazarillo_cards(allCardsCount, tip_cards, lazarillo, lzLen, cards);
        for (var k in all_cards) {
            return_cards[return_cards.length] = all_cards[k];
        }
        //飞机带对
        all_cards = [];
        var len = 2; //飞机长度
        all_cards = LazarilloCardUtil.get_straight_three_lazarillo_cards(len, tip_cards, lazarillo, lzLen, cards, config.CardType.StraightThreePlusPair);
        for (var k in all_cards) {
            return_cards[return_cards.length] = all_cards[k];
        }
    } else if (allCardsCount == 12) {
        //连对/顺子/飞机
        //连对
        var all_cards = LazarilloCardUtil.get_straight_double_lazarillo_cards(allCardsCount, tip_cards, lazarillo, lzLen, cards);
        for (var k in all_cards) {
            return_cards[return_cards.length] = all_cards[k];
        }
        //顺子
        all_cards = [];
        all_cards = LazarilloCardUtil.get_straight_lazarillo_cards(allCardsCount, tip_cards, lazarillo, lzLen, cards);
        for (var k in all_cards) {
            return_cards[return_cards.length] = all_cards[k];
        }
        //飞机不带
        all_cards = [];
        var len = 4; //飞机长度
        all_cards = LazarilloCardUtil.get_straight_three_lazarillo_cards(len, tip_cards, lazarillo, lzLen, cards, config.CardType.StraightThree);
        for (var k in all_cards) {
            return_cards[return_cards.length] = all_cards[k];
        }
        //飞机带单
        all_cards = [];
        len = 3; //飞机长度
        all_cards = LazarilloCardUtil.get_straight_three_lazarillo_cards(len, tip_cards, lazarillo, lzLen, cards, config.CardType.StraightThreePlusSingle);
        for (var k in all_cards) {
            return_cards[return_cards.length] = all_cards[k];
        }
    } else if (allCardsCount == 13) {} else if (allCardsCount == 14) {
        //连对
        //连对
        var all_cards = LazarilloCardUtil.get_straight_double_lazarillo_cards(allCardsCount, tip_cards, lazarillo, lzLen, cards);
        for (var k in all_cards) {
            return_cards[return_cards.length] = all_cards[k];
        }
    } else if (allCardsCount == 15) {
        //飞机
        //飞机不带
        var len = 5; //飞机长度
        var all_cards = LazarilloCardUtil.get_straight_three_lazarillo_cards(len, tip_cards, lazarillo, lzLen, cards, config.CardType.StraightThree);
        for (var k in all_cards) {
            return_cards[return_cards.length] = all_cards[k];
        }
        //飞机带对
        all_cards = [];
        len = 3; //飞机长度
        all_cards = LazarilloCardUtil.get_straight_three_lazarillo_cards(len, tip_cards, lazarillo, lzLen, cards, config.CardType.StraightThreePlusPair);
        for (var k in all_cards) {
            return_cards[return_cards.length] = all_cards[k];
        }
    } else if (allCardsCount == 16) {
        //连对/飞机
        //连对
        var all_cards = LazarilloCardUtil.get_straight_double_lazarillo_cards(allCardsCount, tip_cards, lazarillo, lzLen, cards);
        for (var k in all_cards) {
            return_cards[return_cards.length] = all_cards[k];
        }
        //飞机带单
        all_cards = [];
        var len = 4; //飞机长度
        all_cards = LazarilloCardUtil.get_straight_three_lazarillo_cards(len, tip_cards, lazarillo, lzLen, cards, config.CardType.StraightThreePlusSingle);
        for (var k in all_cards) {
            return_cards[return_cards.length] = all_cards[k];
        }
    } else if (allCardsCount == 17) {} else if (allCardsCount == 18) {
        //连对/飞机
        //连对
        var all_cards = LazarilloCardUtil.get_straight_double_lazarillo_cards(allCardsCount, tip_cards, lazarillo, lzLen, cards);
        for (var k in all_cards) {
            return_cards[return_cards.length] = all_cards[k];
        }
        //飞机不带
        all_cards = [];
        var len = 6; //飞机长度
        all_cards = LazarilloCardUtil.get_straight_three_lazarillo_cards(len, tip_cards, lazarillo, lzLen, cards, config.CardType.StraightThree);
        for (var k in all_cards) {
            return_cards[return_cards.length] = all_cards[k];
        }
    } else if (allCardsCount == 19) {} else if (allCardsCount == 20) {
        //连对/飞机
        //连对
        var all_cards = LazarilloCardUtil.get_straight_double_lazarillo_cards(allCardsCount, tip_cards, lazarillo, lzLen, cards);
        for (var k in all_cards) {
            return_cards[return_cards.length] = all_cards[k];
        }
        //飞机带单
        all_cards = [];
        var len = 5; //飞机长度
        all_cards = LazarilloCardUtil.get_straight_three_lazarillo_cards(len, tip_cards, lazarillo, lzLen, cards, config.CardType.StraightThreePlusSingle);
        for (var k in all_cards) {
            return_cards[return_cards.length] = all_cards[k];
        }
        //飞机带对
        all_cards = [];
        len = 4; //飞机长度
        all_cards = LazarilloCardUtil.get_straight_three_lazarillo_cards(len, tip_cards, lazarillo, lzLen, cards, config.CardType.StraightThreePlusPair);
        for (var k in all_cards) {
            return_cards[return_cards.length] = all_cards[k];
        }
    }
    return return_cards;
};

LazarilloCardUtil.checkTopCardsHasKing = function (topCards) {
    var hasKing = 0;
    for (var i = 0; i < topCards.length; i++) {
        if (topCards[i] == "00" || topCards[i] == "01") {
            hasKing++;
        }
    }
    return hasKing;
};

//获取提起牌能组合成对子的值
LazarilloCardUtil.get_pair_lazarillo_cards = function (allCardsCount, tip_cards, lazarillo, lzLen, cards) {
    var return_cards = [];
    var replaceCards = [];

    if (LazarilloCardUtil.checkTopCardsHasKing(cards) > 0) {
        return return_cards;
    }

    if (tip_cards[0].showTxt <= CardUtil.cardGrade["2"]) {
        var replaceValue = CardUtil.serverCardValueToServer(tip_cards[0].showTxt);
        replaceCards.push(replaceValue);
        var item = {
            0: cards,
            1: replaceCards
        };
        return_cards.push(item);
    }

    console.log("---赖子组合成对子的值");
    console.log(return_cards);
    return return_cards;
};
//获取提起牌能组合成三张的值
LazarilloCardUtil.get_three_lazarillo_cards = function (allCardsCount, tip_cards, lazarillo, lzLen, cards) {
    var return_cards = [];
    var tipCards = [];

    if (LazarilloCardUtil.checkTopCardsHasKing(cards) > 0) {
        return return_cards;
    }
    for (var i = 0; i < tip_cards.length; i++) {
        tipCards.push(tip_cards[i].showTxt);
    }

    var sameValues = PopCardUtil.getSameCards(tipCards);
    PopCardUtil.setSameVulueCardCount(sameValues);

    var single = PopCardUtil.getSingle();
    var pair = PopCardUtil.getPair();

    var singleLength = single.count;
    var pairLength = pair.count;
    var setVal = 0;
    var lz_three_val = [];
    if (singleLength == 1 && lzLen == 2) {
        setVal = single.cards[0][0];
    } else if (pairLength == 1 && lzLen == 1) {
        setVal = pair.cards[0][0];
    }
    if (setVal) {
        for (var i = 0; i < lzLen; i++) {
            lz_three_val.push(setVal);
        }
        var item = {
            0: cards,
            1: lz_three_val
        };
        return_cards.push(item);
    }

    console.log("---赖子组合成三张的值");
    console.log(return_cards);
    return return_cards;
};

// 获取提起牌能组合成三带一的值
LazarilloCardUtil.get_three_single_lazarillo_cards = function (straightLen, tip_cards, lazarillo, lzLen, cards) {
    var return_cards = [];
    var tipCards = [];

    var kingCount = LazarilloCardUtil.checkTopCardsHasKing(cards);
    // console.log("kingCount:"+kingCount);

    if (kingCount > 1) {
        return return_cards;
    }

    for (var i = 0; i < tip_cards.length; i++) {
        tipCards.push(tip_cards[i].showTxt);
    }
    var sameValues = PopCardUtil.getSameCards(tipCards);
    PopCardUtil.setSameVulueCardCount(sameValues);

    var singleSet = PopCardUtil.getSingle();
    var pairSet = PopCardUtil.getPair();
    var threeSet = PopCardUtil.getThree();
    // var fourSet = PopCardUtil.getFour();

    var singleSetLen = singleSet.count;
    var pairSetLen = pairSet.count;
    var threeSetLen = threeSet.count;
    // var fourSetLen = fourSet.length;

    var item = {};
    if (lzLen == 3) {
        if (singleSetLen == 1) {
            item = { 0: cards, 1: [] };
            return_cards.push(item);
            if (kingCount == 0) {
                item = { 0: cards, 1: [singleSet.cards[0][0], singleSet.cards[0][0]] };
                return_cards.push(item);
            }
        }
    } else if (lzLen == 2) {
        if (pairSetLen == 1) {
            item = { 0: cards, 1: [pairSet.cards[0][0]] };
            return_cards.push(item);
        } else if (singleSetLen == 2) {
            console.log(singleSet.cards[0][0], singleSet.cards[1][0]);
            if (singleSet.cards[0][0] == CardUtil.cardGrade["g"] || singleSet.cards[0][0] == CardUtil.cardGrade["G"]) {
                var lz_three_val = [];
                for (var i = 0; i < lzLen; i++) {
                    lz_three_val.push(singleSet.cards[1][0]);
                }
                item = { 0: cards, 1: lz_three_val };
                return_cards.push(item);
            } else if (singleSet.cards[1][0] == CardUtil.cardGrade["g"] || singleSet.cards[1][0] == CardUtil.cardGrade["G"]) {
                var lz_three_val = [];
                for (var i = 0; i < lzLen; i++) {
                    lz_three_val.push(singleSet.cards[0][0]);
                }
                item = { 0: cards, 1: lz_three_val };
                return_cards.push(item);
            } else {
                for (var i = 0; i < singleSetLen; i++) {
                    var lz_three_val = [];
                    for (var j = 0; j < lzLen; j++) {
                        lz_three_val.push(singleSet.cards[i][0]);
                    }
                    item = { 0: cards, 1: lz_three_val };
                    return_cards.push(item);
                }
            }
        }
    } else if (lzLen == 1) {
        if (threeSetLen == 1) {
            item = { 0: cards, 1: [] };
            return_cards.push(item);
        } else if (pairSetLen == 1 && singleSetLen == 1) {
            item = { 0: cards, 1: [pairSet.cards[0][0]] };
            return_cards.push(item);
        }
    }

    console.log("---赖子组合成三带一的值");
    console.log(return_cards);
    return return_cards;
};

//获取提起牌能组合成三带一对的值
LazarilloCardUtil.get_three_pair_lazarillo_cards = function (straightLen, tip_cards, lazarillo, lzLen, cards) {
    var return_cards = [];
    var tipCards = [];

    if (LazarilloCardUtil.checkTopCardsHasKing(cards) > 0) {
        return return_cards;
    }

    for (var i = 0; i < tip_cards.length; i++) {
        tipCards.push(tip_cards[i].showTxt);
    }
    var sameValues = PopCardUtil.getSameCards(tipCards);
    PopCardUtil.setSameVulueCardCount(sameValues);

    var singleSet = PopCardUtil.getSingle();
    var pairSet = PopCardUtil.getPair();
    var threeSet = PopCardUtil.getThree();
    // var fourSet = PopCardUtil.getFour();

    var singleSetLen = singleSet.count;
    var pairSetLen = pairSet.count;
    var threeSetLen = threeSet.count;
    // var fourSetLen = fourSet.length;
    var item = {};
    if (lzLen == 4) {
        if (singleSetLen == 1) {
            item = { 0: cards, 1: [singleSet.cards[0][0]] };
            return_cards.push(item);

            item = { 0: cards, 1: [singleSet.cards[0][0], singleSet.cards[0][0]] };
            return_cards.push(item);
        }
    } else if (lzLen == 3) {
        if (pairSetLen == 1) {
            item = { 0: cards, 1: [] };
            return_cards.push(item);

            item = { 0: cards, 1: [pairSet.cards[0][0]] };
            return_cards.push(item);
        } else if (singleSetLen == 2) {
            item = { 0: cards, 1: [singleSet.cards[0][0], singleSet.cards[0][0], singleSet.cards[1][0]] };
            return_cards.push(item);

            item = { 0: cards, 1: [singleSet.cards[1][0], singleSet.cards[1][0], singleSet.cards[0][0]] };
            return_cards.push(item);
        }
    } else if (lzLen == 2) {
        if (threeSetLen == 1) {
            item = { 0: cards, 1: [] };
            return_cards.push(item);
        } else if (pairSetLen == 1 && singleSetLen == 1) {
            item = { 0: cards, 1: [pairSet.cards[0][0], singleSet.cards[0][0]] };
            return_cards.push(item);

            item = { 0: cards, 1: [singleSet.cards[0][0], singleSet.cards[0][0]] };
            return_cards.push(item);
        }
    } else if (lzLen == 1) {
        if (threeSetLen == 1 && singleSetLen == 1) {
            item = { 0: cards, 1: [singleSet.cards[0][0]] };
            return_cards.push(item);
        } else if (pairSetLen == 2) {
            item = { 0: cards, 1: [pairSet.cards[0][0]] };
            return_cards.push(item);

            item = { 0: cards, 1: [pairSet.cards[1][0]] };
            return_cards.push(item);
        }
    }

    console.log("---赖子组合成三带一对的值");
    console.log(return_cards);
    return return_cards;
};

// 获取提起牌能组合成四炸的值
LazarilloCardUtil.get_bomb_lazarillo_cards = function (straightLen, tip_cards, lazarillo, lzLen, cards) {
    var return_cards = [];
    var tipCards = [];

    if (LazarilloCardUtil.checkTopCardsHasKing(cards) > 0) {
        return return_cards;
    }

    for (var i = 0; i < tip_cards.length; i++) {
        tipCards.push(tip_cards[i].showTxt);
    }
    var sameValues = PopCardUtil.getSameCards(tipCards);
    PopCardUtil.setSameVulueCardCount(sameValues);

    var singleSet = PopCardUtil.getSingle();
    var pairSet = PopCardUtil.getPair();
    var threeSet = PopCardUtil.getThree();
    // var fourSet = PopCardUtil.getFour();

    var singleSetLen = singleSet.count;
    var pairSetLen = pairSet.count;
    var threeSetLen = threeSet.count;
    // var fourSetLen = fourSet.count;
    var item = {};

    var setVal = 0;
    var lz_bomb_val = [];
    if (singleSetLen == 1 && lzLen == 3) {
        setVal = singleSet.cards[0][0];
    } else if (pairSetLen == 1 && lzLen == 2) {
        setVal = pairSet.cards[0][0];
    } else if (threeSetLen == 1 && lzLen == 1) {
        setVal = threeSet.cards[0][0];
    }

    // console.log(setVal);

    if (setVal) {
        for (var i = 0; i < lzLen; i++) {
            lz_bomb_val.push(setVal);
        }
        item = { 0: cards, 1: lz_bomb_val };
        return_cards.push(item);
    }

    console.log("---赖子组合成四炸的值");
    console.log(return_cards);
    return return_cards;
};

//获取提起牌能组合成四带二张的值
LazarilloCardUtil.get_four_single_lazarillo_cards = function (straightLen, tip_cards, lazarillo, lzLen, cards) {
    var return_cards = [];
    var tipCards = [];

    var kingCount = LazarilloCardUtil.checkTopCardsHasKing(cards);

    for (var i = 0; i < tip_cards.length; i++) {
        tipCards.push(tip_cards[i].showTxt);
    }
    var sameValues = PopCardUtil.getSameCards(tipCards);
    PopCardUtil.setSameVulueCardCount(sameValues);

    var singleSet = PopCardUtil.getSingle();
    var pairSet = PopCardUtil.getPair();
    var threeSet = PopCardUtil.getThree();
    var fourSet = PopCardUtil.getFour();

    var singleSetLen = singleSet.count;
    var pairSetLen = pairSet.count;
    var threeSetLen = threeSet.count;
    var fourSetLen = fourSet.count;
    var item = {};

    if (lzLen == 4) {
        if (pairSetLen == 1 || singleSetLen == 2) {
            item = { 0: cards, 1: [] };
            return_cards.push(item);
        }
    } else if (lzLen == 3) {
        if (threeSetLen == 1) {
            item = { 0: cards, 1: [threeSet.cards[0][0]] };
            return_cards.push(item);
        } else if (pairSetLen == 1 && singleSetLen == 1) {
            item = { 0: cards, 1: [pairSet.cards[0][0], pairSet.cards[0][0]] };
            return_cards.push(item);

            if (!kingCount) {
                item = { 0: cards, 1: [singleSet.cards[0][0], singleSet.cards[0][0], singleSet.cards[0][0]] };
                return_cards.push(item);
            }
        } else if (singleSetLen == 3) {
            for (var k in singleSet) {
                var v = singleSet.cards[k][0];
                if (v == CardUtil.cardGrade["g"] || v == CardUtil.cardGrade["G"]) {} else {
                    var lz_four_val = [];
                    for (var i = 1; i < lzLen; i++) {
                        lz_four_val.push(v);
                    }
                    item = { 0: cards, 1: lz_four_val };
                    return_cards.push(item);
                }
            }
        }
    } else if (lzLen == 2) {
        if (fourSetLen == 1) {
            item = { 0: cards, 1: [] };
            return_cards.push(item);
        } else if (threeSetLen == 1 && singleSetLen == 1) {
            item = { 0: cards, 1: [threeSet.cards[0][0]] };
            return_cards.push(item);
        } else if (pairSetLen == 2) {
            item = { 0: cards, 1: [pairSet.cards[0][0], pairSet.cards[0][0]] };
            return_cards.push(item);

            item = { 0: cards, 1: [pairSet.cards[1][0], pairSet.cards[1][0]] };
            return_cards.push(item);
        } else if (pairSetLen == 1 && singleSetLen == 2) {
            item = { 0: cards, 1: [pairSet.cards[0][0], pairSet.cards[0][0]] };
            return_cards.push(item);
        }
    } else if (lzLen == 1) {
        if (fourSetLen == 1 && singleSetLen == 1) {
            item = { 0: cards, 1: [] };
            return_cards.push(item);
        } else if (threeSetLen == 1 && pairSetLen == 1) {
            item = { 0: cards, 1: [threeSet.cards[0][0]] };
            return_cards.push(item);
        } else if (threeSetLen == 1 && singleSetLen == 2) {
            item = { 0: cards, 1: [threeSet.cards[0][0]] };
            return_cards.push(item);
        }
    }

    console.log("---赖子组合成四带二张的值");
    console.log(return_cards);
    return return_cards;
};

//获取提起牌能组合成四带二对的值
LazarilloCardUtil.get_four_pair_lazarillo_cards = function (straightLen, tip_cards, lazarillo, lzLen, cards) {
    var return_cards = [];
    var tipCards = [];

    var kingCount = LazarilloCardUtil.checkTopCardsHasKing(cards);
    if (kingCount > 0) {
        return return_cards;
    }

    for (var i = 0; i < tip_cards.length; i++) {
        tipCards.push(tip_cards[i].showTxt);
    }
    var sameValues = PopCardUtil.getSameCards(tipCards);
    PopCardUtil.setSameVulueCardCount(sameValues);

    var singleSet = PopCardUtil.getSingle();
    var pairSet = PopCardUtil.getPair();
    var threeSet = PopCardUtil.getThree();
    var fourSet = PopCardUtil.getFour();

    var singleSetLen = singleSet.count;
    var pairSetLen = pairSet.count;
    var threeSetLen = threeSet.count;
    var fourSetLen = fourSet.count;
    var item = {};

    if (lzLen == 4) {
        if (fourSetLen == 1) {
            item = { 0: cards, 1: [] };
            return_cards.push(item);
        } else if (threeSetLen == 1 && singleSetLen == 1) {
            item = { 0: cards, 1: [threeSet.cards[0][0], singleSet.cards[0][0]] };
            return_cards.push(item);
        } else if (pairSetLen == 2) {
            item = { 0: cards, 1: [] };
            return_cards.push(item);

            item = { 0: cards, 1: [pairSet.cards[0][0], pairSet.cards[0][0]] };
            return_cards.push(item);

            item = { 0: cards, 1: [pairSet.cards[1][0], pairSet.cards[1][0]] };
            return_cards.push(item);
        } else if (pairSetLen == 1 || singleSetLen == 2) {
            item = { 0: cards, 1: [pairSet.cards[0][0], pairSet.cards[0][0], singleSet.cards[0][0], singleSet.cards[1][0]] };
            return_cards.push(item);
        }
    } else if (lzLen == 3) {
        if (fourSetLen == 1 && singleSetLen == 1) {
            if (fourSet.cards[0][0] > lazarillo) {
                item = { 0: cards, 1: [singleSet.cards[0][0]] };
                return_cards.push(item);
            } else {
                item = { 0: cards, 1: [singleSet.cards[0][0], singleSet.cards[0][0], singleSet.cards[0][0], singleSet.cards[0][0]] };
                return_cards.push(item);
            }
        } else if (threeSetLen == 1 && pairSetLen == 1) {
            if (threeSet.cards[0][0] > pairSet.cards[0][0]) {
                item = { 0: cards, 1: [threeSet.cards[0][0]] };
                return_cards.push(item);
            } else {
                item = { 0: cards, 1: [pairSet.cards[0][0], pairSet.cards[0][0], threeSet.cards[0][0]] };
                return_cards.push(item);
            }
        } else if (threeSetLen == 1 && singleSetLen == 2) {
            item = { 0: cards, 1: [threeSet.cards[0][0], singleSet.cards[0][0], singleSet.cards[1][0]] };
            return_cards.push(item);
        } else if (pairSetLen == 2 && singleSetLen == 1) {
            item = { 0: cards, 1: [pairSet.cards[0][0], pairSet.cards[0][0], singleSet.cards[0][0]] };
            return_cards.push(item);

            item = { 0: cards, 1: [pairSet.cards[1][0], pairSet.cards[1][0], singleSet.cards[0][0]] };
            return_cards.push(item);
        }
    } else if (lzLen == 2) {
        if (fourSetLen == 1 && pairSetLen == 1) {
            if (fourSet.cards[0][0] > pairSet.cards[0][0]) {
                item = { 0: cards, 1: [] };
                return_cards.push(item);
            } else {
                item = { 0: cards, 1: [pairSet.cards[0][0], pairSet.cards[0][0]] };
                return_cards.push(item);
            }
        } else if (fourSetLen == 1 && singleSetLen == 2) {
            item = { 0: cards, 1: [singleSet.cards[0][0], singleSet.cards[1][0]] };
            return_cards.push(item);
        } else if (threeSetLen == 2) {
            if (threeSet.cards[0][0] > threeSet.cards[1][0]) {
                item = { 0: cards, 1: [threeSet.cards[0][0], threeSet.cards[1][0]] };
                return_cards.push(item);
            } else {
                item = { 0: cards, 1: [threeSet.cards[1][0], threeSet.cards[0][0]] };
                return_cards.push(item);
            }
        } else if (threeSetLen == 1 && pairSetLen == 1 && singleSetLen == 1) {
            item = { 0: cards, 1: [threeSet.cards[0][0], singleSet.cards[0][0]] };
            return_cards.push(item);
        } else if (pairSetLen == 3) {
            item = { 0: cards, 1: [pairSet.cards[0][0], pairSet.cards[0][0]] };
            return_cards.push(item);

            item = { 0: cards, 1: [pairSet.cards[1][0], pairSet.cards[1][0]] };
            return_cards.push(item);

            item = { 0: cards, 1: [pairSet.cards[2][0], pairSet.cards[2][0]] };
            return_cards.push(item);
        }
    } else if (lzLen == 1) {
        if (fourSetLen == 1 && pairSetLen == 1 && singleSetLen == 1) {
            item = { 0: cards, 1: [singleSet.cards[0][0]] };
            return_cards.push(item);
        } else if (threeSetLen == 1 && pairSetLen == 2) {
            item = { 0: cards, 1: [threeSet.cards[0][0]] };
            return_cards.push(item);
        }
    }

    console.log("---赖子组合成四带二对的值");
    console.log(return_cards);
    return return_cards;
};

//获取提起牌能组合成飞机的值
LazarilloCardUtil.get_straight_three_lazarillo_cards = function (straightLen, tip_cards, lazarillo, lzLen, cards, tType) {
    var return_cards = [];
    var tipCards = [];

    // var kingCount = LazarilloCardUtil.checkTopCardsHasKing(cards);

    for (var i = 0; i < tip_cards.length; i++) {
        tipCards.push(tip_cards[i].showTxt);
    }
    var sameValues = PopCardUtil.getSameCards(tipCards);
    PopCardUtil.setSameVulueCardCount(sameValues);

    var singleSet = PopCardUtil.getSingle();
    var pairSet = PopCardUtil.getPair();
    var threeSet = PopCardUtil.getThree();
    var fourSet = PopCardUtil.getFour();

    var singleSetLen = singleSet.count;
    var pairSetLen = pairSet.count;
    var threeSetLen = threeSet.count;
    var fourSetLen = fourSet.count;
    var item = {};

    var tip_cards_val = []; //提起的普通牌值
    var tip_all_cards = []; //提起的普通牌全部牌面
    var tip_kings = []; //提起的普通牌里的王

    if (singleSetLen > 0) {
        for (var k in singleSet.cards) {
            var v = singleSet.cards[k][0];
            if (v == CardUtil.cardGrade["g"] || v == CardUtil.cardGrade["G"]) {
                tip_kings.push(v);
            } else {
                tip_cards_val.push(v);
            }
            tip_all_cards.push(v);
        }
    }
    if (pairSetLen > 0) {
        for (var k in pairSet.cards) {
            var v = pairSet.cards[k][0];
            tip_cards_val.push(v);

            for (var i = 0; i < 2; i++) {
                tip_all_cards.push(v);
            }
        }
    }
    if (threeSetLen > 0) {
        for (var k in threeSet.cards) {
            var v = threeSet.cards[k][0];
            tip_cards_val.push(v);

            for (var i = 0; i < 3; i++) {
                tip_all_cards.push(v);
            }
        }
    }
    if (fourSetLen > 0) {
        for (var k in fourSet.cards) {
            var v = fourSet.cards[k][0];
            tip_cards_val.push(v);

            for (var i = 0; i < 4; i++) {
                tip_all_cards.push(v);
            }
        }
    }
    //升序
    tip_cards_val.sort(config.arrayUp);

    // console.log(tip_cards_val);

    var minCard = 0; //连对最小值
    var maxCard = 0; //连对最大值

    if (tip_cards_val.length > 0) {
        if (tip_cards_val[0] > lazarillo) {
            minCard = lazarillo;
        } else {
            minCard = tip_cards_val[0];
        }

        if (tip_cards_val[tip_cards_val.length - 1] > lazarillo) {
            maxCard = tip_cards_val[tip_cards_val.length - 1];
        } else {
            maxCard = lazarillo;
        }
    }

    var all_result = [];
    //飞机
    for (var i = 3; i <= CardUtil.cardGrade["1"]; i++) {
        //3-A
        if (i >= minCard - 1 && i <= maxCard) {
            if (i + (straightLen - 1) <= CardUtil.cardGrade["1"]) {
                //要的起的飞机
                var straightThree = [i, i, i];
                for (var j = 1; j < straightLen; j++) {
                    //飞机的牌数
                    for (var n = 0; n < 3; n++) {
                        straightThree[straightThree.length] = i + j;
                    }
                }
                all_result.push(straightThree);
            }
        }
    }

    // console.log(all_result);

    var effectiveType = []; //有效牌型
    for (var key in all_result) {
        var val = all_result[key];
        var other_tip_cards = [];
        for (var n = 0; n < val.length; n++) {
            other_tip_cards[n] = val[n];
        }

        var lz_val = []; //癞子当的值
        for (var k in tip_all_cards) {
            var v = tip_all_cards[k];
            for (var i in other_tip_cards) {
                var j = other_tip_cards[i];
                if (j == v) {
                    // table.remove(other_tip_cards, i)
                    other_tip_cards.splice(i, 1);
                    break;
                }
            }
        }
        //欠缺的飞机牌
        if (other_tip_cards.length <= lzLen) {
            effectiveType[effectiveType.length] = [other_tip_cards, val];
        }
    }

    // console.log(effectiveType);

    if (effectiveType.length > 0) {
        if (tType == config.CardType.StraightThree) {
            //飞机不带
            for (var k in effectiveType) {
                //剩下的癞子数
                var v = effectiveType[k];
                var remainingLz = lzLen - v[0].length;
                if (remainingLz == 0) {
                    item = { 0: cards, 1: v[0] };
                    return_cards.push(item);
                }
            }
        } else if (tType == config.CardType.StraightThreePlusSingle) {
            //飞机带单张
            for (var k in effectiveType) {
                //剩下的癞子数
                var v = effectiveType[k];
                var remainingLz = lzLen - v[0].length;

                var other_tip_all_cards = [];
                for (var x = 0; x < tip_all_cards.length; x++) {
                    other_tip_all_cards[x] = tip_all_cards[x];
                }

                for (var i in v[1]) {
                    var j = v[1][i];
                    for (var m in other_tip_all_cards) {
                        var n = other_tip_all_cards[m];
                        if (n == j) {
                            // table.remove(other_tip_all_cards, m)
                            other_tip_all_cards.splice(m, 1);
                            break;
                        }
                    }
                }

                //剩下的单张数等于飞机长度
                if (remainingLz == 0) {
                    //无癞子
                    if (other_tip_all_cards.length == straightLen) {
                        item = { 0: cards, 1: v[0] };
                        return_cards.push(item);
                    }
                } else {
                    //还剩余癞子
                    if (other_tip_all_cards.length + remainingLz == straightLen) {
                        item = { 0: cards, 1: v[0] };
                        return_cards.push(item);
                    }
                }
            }
        } else if (tType == config.CardType.StraightThreePlusPair) {
            //飞机带对子
            //提起的牌里不能有王
            if (tip_kings.length == 0) {
                for (var k in effectiveType) {
                    //剩下的癞子数
                    var v = effectiveType[k];
                    var remainingLz = lzLen - v[0].length;

                    var other_tip_all_cards = [];
                    for (var x = 0; x < tip_all_cards.length; x++) {
                        other_tip_all_cards[x] = tip_all_cards[x];
                    }

                    for (var i in v[1]) {
                        var j = v[1][i];
                        for (var m in other_tip_all_cards) {
                            var n = other_tip_all_cards[m];
                            if (n == j) {
                                // table.remove(other_tip_all_cards, m)
                                other_tip_all_cards.splice(m, 1);
                                break;
                            }
                        }
                    }

                    //剩下的单张数等于飞机长度
                    if (remainingLz == 0) {
                        //无癞子
                        if (other_tip_all_cards.length == straightLen * 2) {
                            var tempTipCards = [];
                            for (var i in other_tip_all_cards) {
                                var j = other_tip_all_cards[i];
                                tempTipCards[j] = tempTipCards[j] || [];
                                tempTipCards[j][tempTipCards[j].length] = j;
                            }

                            var through = true;
                            for (var i in tempTipCards) {
                                var j = tempTipCards[i];
                                if (j.length != 2) {
                                    through = false;
                                }
                            }
                            if (through) {
                                item = { 0: cards, 1: v[0] };
                                return_cards.push(item);
                            }
                        }
                    } else {
                        //还剩余癞子
                        if (other_tip_all_cards.length + remainingLz == straightLen * 2) {
                            var tempTipCards = [];
                            for (var i in other_tip_all_cards) {
                                var j = other_tip_all_cards[i];
                                tempTipCards[j] = tempTipCards[j] || [];
                                tempTipCards[j][tempTipCards[j].length] = j;
                            }

                            var through = true;
                            var lz_three_val = v[0];
                            for (var i in tempTipCards) {
                                var j = tempTipCards[i];
                                if (j.length != 2) {
                                    if (remainingLz > 0) {
                                        lz_three_val[lz_three_val.length] = j[0];
                                        remainingLz = remainingLz - 1;
                                    } else {
                                        through = false;
                                    }
                                }
                            }
                            if (through) {
                                //癞子用完或还剩两张
                                if (remainingLz == 0 || remainingLz == 2) {
                                    item = { 0: cards, 1: v[0] };
                                    return_cards.push(item);
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    console.log("---赖子组合成飞机的值");
    console.log(return_cards);
    return return_cards;
};

//获取提起牌能组合成连对的值
LazarilloCardUtil.get_straight_double_lazarillo_cards = function (straightLen, tip_cards, lazarillo, lzLen, cards) {
    var return_cards = [];
    var tipCards = [];

    var kingCount = LazarilloCardUtil.checkTopCardsHasKing(cards);
    if (kingCount > 0) {
        return return_cards;
    }

    for (var i = 0; i < tip_cards.length; i++) {
        tipCards.push(tip_cards[i].showTxt);
    }
    var sameValues = PopCardUtil.getSameCards(tipCards);
    PopCardUtil.setSameVulueCardCount(sameValues);

    var singleSet = PopCardUtil.getSingle();
    var pairSet = PopCardUtil.getPair();

    // var singleSetLen = singleSet.count;
    // var pairSetLen = pairSet.count;

    straightLen = straightLen / 2;

    for (var n = CardUtil.cardGrade["1"]; n >= 3; n--) {
        if (n + (straightLen - 1) <= CardUtil.cardGrade["1"]) {
            //不能超过A
            var lz_straight_val = [];
            var lz_nochange_count = 0; //癞子牌没百搭的数量

            for (var i = 0; i < straightLen; i++) {
                var haveCard = false;
                for (var k in singleSet.cards) {
                    //先判断单张里有值没
                    var v = singleSet.cards[k][0];
                    if (v == n + i) {
                        haveCard = true;
                    }
                }
                if (haveCard) {
                    // if(n+i == lazarillo){ //是癞子本身值，不用转化
                    //     lz_nochange_count = lz_nochange_count + 1;
                    // }else{
                    lz_straight_val.push(n + i);
                    // }
                } else {
                    for (var k in pairSet.cards) {
                        //先判断单张里有值没
                        var v = pairSet.cards[k][0];
                        if (v == n + i) {
                            haveCard = true;
                        }
                    }
                    if (!haveCard) {
                        // if(n+i == lazarillo){ //是癞子本身值，不用转化
                        //     lz_nochange_count = lz_nochange_count + 2
                        // }else{
                        lz_straight_val.push(n + i);
                        lz_straight_val.push(n + i);
                        // }
                    }
                }
            }

            if (lz_straight_val.length + lz_nochange_count == lzLen) {
                var item = { 0: cards, 1: lz_straight_val };
                return_cards.push(item);
            }
        }
    }

    console.log("---赖子组合成连对的值");
    console.log(return_cards);
    return return_cards;
};

//获取提起牌能组合成顺子的各各值
LazarilloCardUtil.get_straight_lazarillo_cards = function (straightLen, tip_cards, lazarillo, lzLen, cards) {
    var return_cards = [];
    var tipCards = [];

    var kingCount = LazarilloCardUtil.checkTopCardsHasKing(cards);
    if (kingCount > 0) {
        return return_cards;
    }

    for (var i = 0; i < tip_cards.length; i++) {
        tipCards.push(tip_cards[i].showTxt);
    }
    var sameValues = PopCardUtil.getSameCards(tipCards);
    PopCardUtil.setSameVulueCardCount(sameValues);

    var singleSet = PopCardUtil.getSingle();
    var singleSetLen = singleSet.count;

    // console.log(singleSet);

    if (singleSetLen == 0) return return_cards;

    for (var n = CardUtil.cardGrade["1"]; n >= 3; n--) {
        if (n + (straightLen - 1) <= CardUtil.cardGrade["1"]) {
            //不能超过A
            var lz_straight_val = [];
            var lz_nochange_count = 0; //癞子牌没百搭的数量

            for (var i = 0; i < straightLen; i++) {
                var haveCard = false;
                for (var k in singleSet.cards) {
                    var v = singleSet.cards[k][0];
                    if (v == n + i) {
                        haveCard = true;
                    }
                }
                if (!haveCard) {
                    // if(n+i == lazarillo){ //是癞子本身值，不用转化
                    //     lz_nochange_count = lz_nochange_count + 1;
                    // }else{
                    lz_straight_val.push(n + i);
                    // }
                }
            }

            if (lz_straight_val.length + lz_nochange_count == lzLen) {
                var item = { 0: cards, 1: lz_straight_val };
                return_cards.push(item);
            }
        }
    }

    console.log("---赖子组合成顺子的值");
    console.log(return_cards);
    return return_cards;
};

//--------------------------分割线---------------------------------
//赖子出牌提示 //CardUtil 等下统一改下****
// 获取能比上家牌大的全部牌型
LazarilloCardUtil.get_cards_larger = function (last_cards_type, myCards) {
    var all_result = [];
    // console.log("myCards=",myCards);
    var prop = PopCardUtil.getSameCards(myCards);
    var lzValue = CardUtil.serverCardValueToClient(config.joker);
    var lzLen = 0;
    for (var i = 0; i < myCards.length; i++) {
        if (myCards[i] == lzValue) {
            lzLen++;
        }
    }

    var cardsType = last_cards_type.type;
    if (cardsType == config.CardType.Single) {
        all_result = LazarilloCardUtil.find_single_card(last_cards_type, prop, myCards, lzLen, lzValue);
    } else if (cardsType == config.CardType.Pair) {
        all_result = LazarilloCardUtil.find_pair_card(last_cards_type, prop, myCards, lzLen, lzValue);
    } else if (cardsType == config.CardType.ThreeOfKind) {
        all_result = LazarilloCardUtil.find_three_card(last_cards_type, prop, myCards, lzLen, lzValue);
    } else if (cardsType == config.CardType.SoftBomb) {
        //SoftBomb
        all_result = LazarilloCardUtil.find_SoftBomb_card(last_cards_type, prop, myCards, lzLen, lzValue);
    } else if (cardsType == config.CardType.Bomb) {
        all_result = LazarilloCardUtil.find_bomb_card(last_cards_type, prop, myCards, lzLen, lzValue);
    } else if (cardsType == config.CardType.LazarilloBomb) {
        //LazarilloBomb
        all_result = LazarilloCardUtil.find_LazarilloBomb_card(last_cards_type, prop, myCards, lzLen, lzValue);
    } else if (cardsType == config.CardType.ThreeOfKindPlusOne) {
        all_result = LazarilloCardUtil.find_three_with_one_card(last_cards_type, prop, myCards, lzLen, lzValue);
    } else if (cardsType == config.CardType.ThreeOfKindPlusPair) {
        all_result = LazarilloCardUtil.find_three_with_two_card(last_cards_type, prop, myCards, lzLen, lzValue);
    } else if (cardsType == config.CardType.FourPlusOne) {
        all_result = LazarilloCardUtil.find_four_with_two_single_card(last_cards_type, prop, myCards, lzLen, lzValue);
    } else if (cardsType == config.CardType.FourPlusTwo) {
        all_result = LazarilloCardUtil.find_four_with_two_pair_card(last_cards_type, prop, myCards, lzLen, lzValue);
    } else if (cardsType == config.CardType.Straight) {
        all_result = LazarilloCardUtil.find_straight(last_cards_type, prop, myCards, lzLen, lzValue);
    } else if (cardsType == config.CardType.StraightDouble) {
        all_result = LazarilloCardUtil.find_pair_straight(last_cards_type, prop, myCards, lzLen, lzValue);
    } else if (cardsType == config.CardType.StraightThree) {
        all_result = LazarilloCardUtil.find_three_straight(last_cards_type, prop, myCards, lzLen, lzValue);
    } else if (cardsType == config.CardType.StraightThreePlusSingle) {
        all_result = LazarilloCardUtil.find_three_straight_with_single_card(last_cards_type, prop, myCards, lzLen, lzValue);
    } else if (cardsType == config.CardType.StraightThreePlusPair) {
        all_result = LazarilloCardUtil.find_three_straight_with_pair_card(last_cards_type, prop, myCards, lzLen, lzValue);
    }

    if (cardsType != config.CardType.SoftBomb && cardsType != config.CardType.Bomb && cardsType != config.CardType.LazarilloBomb && cardsType != config.CardType.DoubleKing) {
        var all_bomb = LazarilloCardUtil.find_allBomb_card(last_cards_type, prop, myCards, lzLen, lzValue);
        for (var i = 0; i < all_bomb.length; i++) {
            all_result.push(all_bomb[i]);
        }
    }

    return all_result;
};

//符合条件的单张牌
LazarilloCardUtil.find_single_card = function (last_cards_type, prop, myCards, lzLen, lzValue) {
    var all_result = [];
    PopCardUtil.setSameVulueCardCount(prop);
    var single = PopCardUtil.getSingle();
    var rank = parseInt(last_cards_type.rank);
    if (single.count > 0) {
        for (var k in single.cards) {
            var v = single.cards[k];
            if (rank < v) {
                all_result.push(v);
            }
        }
    }
    //没有适合单张 就拆分牌
    var allcards = []; //所有牌值
    for (var k in prop) {
        var v = prop[k];
        allcards.push(k);
    }
    if (all_result.length <= 0) {
        for (var k in allcards) {
            var v = parseInt(allcards[k]);
            if (rank < v && v != lzValue) {
                all_result.push(v);
            }
        }
    }

    //赖子牌加在最后
    if (lzLen >= 1 && rank < lzValue) {
        all_result.push(lzValue);
    }

    return all_result;
};

//找合适的对子出牌
LazarilloCardUtil.find_pair_card = function (last_cards_type, prop, myCards, lzLen, lzValue) {
    var all_result = [];
    PopCardUtil.setSameVulueCardCount(prop);
    var pair = PopCardUtil.getPair();
    var rank = parseInt(last_cards_type.rank);
    if (pair.count > 0) {
        for (var k in pair.cards) {
            var v = pair.cards[k];
            if (rank < v[0]) {
                all_result.push(v);
            }
        }
    }
    //赖子组合单张
    if (lzLen > 0) {
        var single = PopCardUtil.getSingle();
        if (single.count > 0) {
            for (var k in single.cards) {
                var v = single.cards[k];
                if (rank < v && v <= CardUtil.cardGrade["2"]) {
                    var item = [lzValue, v];
                    all_result.push(item);
                }
            }
        }
    }

    //没有适合对子 就拆分牌
    var allcards = []; //所有牌值
    if (all_result.length <= 0) {
        var three = PopCardUtil.getThree();
        var four = PopCardUtil.getFour();
        if (three.count > 0) {
            for (var k in three.cards) {
                var d = three.cards[k];
                if (rank < d[0]) {
                    var temp = d.slice(0, 2);
                    allcards.push(temp);
                }
            }
        }
        if (four.count > 0) {
            for (var k in four.cards) {
                var d = four.cards[k];
                if (rank < d[0]) {
                    var temp = d.slice(0, 2);
                    allcards.push(temp);
                }
            }
        }
        return allcards;
    }

    return all_result;
};

//寻找合适的三个出牌
LazarilloCardUtil.find_three_card = function (last_cards_type, prop, myCards, lzLen, lzValue) {
    var all_result = [];
    PopCardUtil.setSameVulueCardCount(prop);
    var single = PopCardUtil.getSingle();
    var pair = PopCardUtil.getPair();
    var three = PopCardUtil.getThree();
    var rank = parseInt(last_cards_type.rank);
    if (three.count > 0) {
        for (var k in three.cards) {
            var v = three.cards[k];
            // console.log("v:"+v[0]+"  k:"+k);
            if (rank < v[0]) {
                all_result.push(v);
            }
        }
        // return all_result;
    }

    if (lzLen >= 1) {
        if (pair.count > 0) {
            for (var k in pair.cards) {
                var v = pair.cards[k];
                // console.log("v:"+v[0]+"  k:"+k);
                if (rank < v[0]) {
                    var item = [lzValue, v[0], v[0]];
                    all_result.push(item);
                }
            }
        }
    }

    if (lzLen >= 2) {
        if (single.count > 0) {
            for (var k in single.cards) {
                var v = single.cards[k];
                // console.log("v:"+v[0]+"  k:"+k);
                if (rank < v[0] && v[0] <= CardUtil.cardGrade["2"]) {
                    var item = [lzValue, lzValue, v[0]];
                    all_result.push(item);
                }
            }
        }
    }

    return all_result;
};

//所有的炸弹牌
LazarilloCardUtil.find_allBomb_card = function (last_cards_type, prop, myCards, lzLen, lzValue) {
    var all_result = [];
    PopCardUtil.setSameVulueCardCount(prop);
    var single = PopCardUtil.getSingle();
    var pair = PopCardUtil.getPair();
    var three = PopCardUtil.getThree();
    var four = PopCardUtil.getFour();

    if (lzLen >= 1) {
        if (three.count > 0) {
            for (var k in three.cards) {
                var v = three.cards[k];
                // console.log("v:"+v[0]+"  k:"+k);
                if (v[0] != lzValue) {
                    var item = [lzValue, v[0], v[0], v[0]];
                    all_result.push(item);
                }
            }
        }
    }
    if (lzLen >= 2) {
        if (pair.count > 0) {
            for (var k in pair.cards) {
                var v = pair.cards[k];
                // console.log("v:"+v[0]+"  k:"+k);
                if (v[0] != lzValue) {
                    var item = [lzValue, lzValue, v[0], v[0]];
                    all_result.push(item);
                }
            }
        }
    }

    if (lzLen >= 3) {
        if (single.count > 0) {
            for (var k in single.cards) {
                var v = single.cards[k];
                // console.log("v:"+v[0]+"  k:"+k);
                if (v[0] != lzValue && v[0] <= CardUtil.cardGrade["2"]) {
                    var item = [lzValue, lzValue, lzValue, v[0]];
                    all_result.push(item);
                }
            }
        }
    }

    if (four.count > 0) {
        for (var k in four.cards) {
            var v = four.cards[k];
            all_result.push(v);
        }
    }
    if (prop[16] && prop[17]) {
        console.log("有王炸");
        var values = [16, 17];
        all_result.push(values);
    }

    console.log("赖子场所有的炸弹牌", all_result);
    return all_result;
};

//找合适的软炸弹牌
LazarilloCardUtil.find_SoftBomb_card = function (last_cards_type, prop, myCards, lzLen, lzValue) {
    var all_result = [];
    PopCardUtil.setSameVulueCardCount(prop);
    var single = PopCardUtil.getSingle();
    var pair = PopCardUtil.getPair();
    var three = PopCardUtil.getThree();
    var four = PopCardUtil.getFour();
    var rank = parseInt(last_cards_type.rank);

    if (lzLen >= 1) {
        if (three.count > 0) {
            for (var k in three.cards) {
                var v = three.cards[k];
                // console.log("v:"+v[0]+"  k:"+k);
                if (rank < v[0] && v[0] != lzValue) {
                    var item = [lzValue, v[0], v[0], v[0]];
                    all_result.push(item);
                }
            }
        }
    }
    if (lzLen >= 2) {
        if (pair.count > 0) {
            for (var k in pair.cards) {
                var v = pair.cards[k];
                // console.log("v:"+v[0]+"  k:"+k);
                if (rank < v[0] && v[0] != lzValue) {
                    var item = [lzValue, lzValue, v[0], v[0]];
                    all_result.push(item);
                }
            }
        }
    }

    if (lzLen >= 3) {
        if (single.count > 0) {
            for (var k in single.cards) {
                var v = single.cards[k];
                // console.log("v:"+v[0]+"  k:"+k);
                if (rank < v[0] && v[0] <= CardUtil.cardGrade["2"]) {
                    var item = [lzValue, lzValue, lzValue, v[0]];
                    all_result.push(item);
                }
            }
        }
    }

    if (four.count > 0) {
        for (var k in four.cards) {
            var v = four.cards[k];
            // console.log("v:"+v[0]+"  k:"+k);
            if (v[0] != lzValue) {
                all_result.push(v);
            } else {
                if (v[0] == lzValue) {
                    all_result.push(v); //纯赖子炸弹
                }
            }
        }
    }
    if (prop[16] && prop[17]) {
        console.log("有王炸");
        var values = [16, 17];
        all_result.push(values);
    }

    return all_result;
};

//找合适的炸弹牌
LazarilloCardUtil.find_bomb_card = function (last_cards_type, prop, myCards, lzLen, lzValue) {
    var all_result = [];
    PopCardUtil.setSameVulueCardCount(prop);
    var four = PopCardUtil.getFour();
    var rank = parseInt(last_cards_type.rank);
    if (four.count > 0) {
        for (var k in four.cards) {
            var v = four.cards[k];
            // console.log("v:"+v[0]+"  k:"+k);
            if (rank < v[0]) {
                all_result.push(v);
            } else {
                if (v[0] == lzValue) {
                    all_result.push(v); //纯赖子炸弹
                }
            }
        }
    }

    if (prop[16] && prop[17]) {
        console.log("有王炸");
        var values = [16, 17];
        all_result.push(values);
    }
    return all_result;
};

//纯癞子炸弹牌
LazarilloCardUtil.find_LazarilloBomb_card = function (last_cards_type, prop, myCards, lzLen, lzValue) {
    var all_result = [];
    if (prop[16] && prop[17]) {
        console.log("有王炸");
        var values = [16, 17];
        all_result.push(values);
    }
    return all_result;
};

//找合适的三带一
LazarilloCardUtil.find_three_with_one_card = function (last_cards_type, prop, myCards, lzLen, lzValue) {
    var all_result = [];
    PopCardUtil.setSameVulueCardCount(prop);
    var pair = PopCardUtil.getPair();
    var three = PopCardUtil.getThree();
    var rank = parseInt(last_cards_type.rank);
    if (three.count > 0) {
        for (var k in three.cards) {
            var v = three.cards[k];
            // console.log("v:"+v[0]+"  k:"+k);
            if (rank < v[0]) {
                all_result.push(v);
            }
        }
        // return all_result;
    }

    if (lzLen >= 1) {
        if (pair.count > 0) {
            for (var k in pair.cards) {
                var v = pair.cards[k];
                console.log("v:" + v[0] + "  k:" + k);
                if (rank < v[0] && v[0] != lzValue) {
                    var item = [lzValue, v[0], v[0]];
                    all_result.push(item);
                }
            }
        }
    }

    // if(lzLen >= 2){
    //     if(single.count>0){
    //         for(var k in single.cards){
    //             var v = single.cards[k];
    //             // console.log("v:"+v[0]+"  k:"+k);
    //             if (rank < v[0]){
    //                 var item = [lzValue,lzValue,v[0]];
    //                 all_result.push(item);
    //             }
    //         }
    //     }
    // }

    var single = PopCardUtil.getSingle();
    var pair = PopCardUtil.getPair();
    // var three = PopCardUtil.getThree();
    var allOne = []; //所有三张的牌值 单张组

    var onecard = 0;
    if (single.count > 0) {
        console.log(single.cards);
        if (single.count >= 1 && single.cards[0][0] != lzValue) {
            onecard = single.cards[0][0];
        } else {
            onecard = single.cards[1][0];
        }
        console.log("onecard1:" + onecard);
    } else if (pair.count > 0) {
        onecard = parseInt(pair.cards[0][0]);
        console.log("onecard2:" + onecard);
    } else {
        //拆分3张
        for (var k in three.cards) {
            var v = three.cards[k];
            allOne.push(v[0]);
        }
    }

    for (var k in all_result) {
        var v = all_result[k];
        console.log("v:" + v + "  k:" + k + " allone:" + allOne[k]);

        if (onecard == 0) {
            if (k < allOne.length - 1) {
                if (v[0] != allOne[k]) {
                    onecard = allOne[k];
                } else {
                    var n = parseInt(k) + 1;
                    onecard = allOne[n];
                }
            } else {
                onecard = allOne[0];
            }
        }
        v[v.length] = onecard; //onecard
        v.sort(config.arrayUp);
    }

    console.log("找合适的三带一");
    console.log("all_result:", all_result);

    return all_result;
};

//三带一对
LazarilloCardUtil.find_three_with_two_card = function (last_cards_type, prop, myCards, lzLen, lzValue) {
    var all_result = [];
    PopCardUtil.setSameVulueCardCount(prop);
    var pair = PopCardUtil.getPair();
    var three = PopCardUtil.getThree();
    var rank = parseInt(last_cards_type.rank);
    if (three.count > 0) {
        for (var k in three.cards) {
            var v = three.cards[k];
            // console.log("v:"+v[0]+"  k:"+k);
            if (rank < v[0]) {
                all_result.push(v);
            }
        }
        // return all_result;
    }

    if (lzLen >= 1) {
        if (pair.count > 0) {
            for (var k in pair.cards) {
                var v = pair.cards[k];
                // console.log("v:"+v[0]+"  k:"+k);
                if (rank < v[0] && v[0] != lzValue) {
                    var item = [lzValue, v[0], v[0]];
                    all_result.push(item);
                }
            }
        }
    }

    // if(lzLen >= 2){
    //     if(single.count>0){
    //         for(var k in single.cards){
    //             var v = single.cards[k];
    //             // console.log("v:"+v[0]+"  k:"+k);
    //             if (rank < v[0]){
    //                 var item = [lzValue,lzValue,v[0]];
    //                 all_result.push(item);
    //             }
    //         }
    //     }
    // }

    var allOne = []; //所有三张的牌值 对子组

    var pair = PopCardUtil.getPair();
    var tempPair = [];
    if (pair.count > 0) {
        // tempPair = pair.cards[0];
        if (pair.count >= 1 && parseInt(pair.cards[0][0]) != lzValue) {
            tempPair = pair.cards[0];
        } else {
            tempPair = pair.cards[1];
        }
    }

    if (tempPair.length == 0) {
        //拆分3张
        for (var k in three.cards) {
            var v = three.cards[k];
            allOne.push(v[0]);
        }
    }

    console.log("tempPair:", tempPair);

    // console.log("tempPair:"+tempPair+" allOne:"+allOne.length);

    var onecard = tempPair.length;

    for (var k in all_result) {
        var v = all_result[k];
        // console.log("v:"+v+"  k:"+k);

        if (onecard == 0) {
            if (k < allOne.length - 1) {
                if (v[0] != allOne[k]) {
                    onecard = allOne[k];
                } else {
                    var n = parseInt(k) + 1;
                    onecard = allOne[n];
                }
            } else {
                onecard = allOne[0];
            }
            for (var i = 0; i < 2; i++) {
                v.push(parseInt(onecard));
            }
            onecard = 0;
        } else {
            for (var i = 0; i < tempPair.length; i++) {
                v.push(parseInt(tempPair[i]));
            }
        }

        // v.concat(tempPair[0],tempPair[1]);
        console.log("v2:" + v);
        v.sort(config.arrayUp);
    }

    return all_result;
};

//四带二
LazarilloCardUtil.find_four_with_two_single_card = function (last_cards_type, prop, myCards, lzLen, lzValue) {
    var all_result = [];
    PopCardUtil.setSameVulueCardCount(prop);
    var four = PopCardUtil.getFour();
    var rank = parseInt(last_cards_type.rank);

    if (four.count > 0) {
        for (var k in four.cards) {
            var v = four.cards[k];
            // console.log("v:"+v[0]+"  k:"+k);
            if (rank < v[0]) {
                all_result.push(v);
            }
        }
        // return all_result;
    }

    var temps = [];
    var single = PopCardUtil.getSingle();
    var pair = PopCardUtil.getPair();
    var three = PopCardUtil.getThree();

    // if(lzLen >=1){
    //     if(three.count>0){
    //         for(var k in three.cards){
    //             var v = three.cards[k];
    //             // console.log("v:"+v[0]+"  k:"+k);
    //             if (rank < v[0]){
    //                 var item = [lzValue,v[0],v[0],v[0]];
    //                 all_result.push(item);
    //             }
    //         }
    //     }
    // }

    if (single.count > 1) {
        for (var i = 0; i < 2; i++) {
            temps.push(parseInt(single.cards[i]));
        }
    } else if (pair.count > 0) {
        for (var i = 0; i < 2; i++) {
            temps.push(parseInt(pair.cards[0]));
        }
    } else if (three.count > 0) {
        for (var i = 0; i < 2; i++) {
            temps.push(parseInt(three.cards[0]));
        }
    }

    for (var k in all_result) {
        var v = all_result[k];

        for (var i = 0; i < temps.length; i++) {
            v.push(parseInt(temps[i]));
        }
        console.log("v2:" + v);
        v.sort(config.arrayUp);
    }

    return all_result;
};

//四带两队
LazarilloCardUtil.find_four_with_two_pair_card = function (last_cards_type, prop, myCards, lzLen, lzValue) {
    var all_result = [];
    PopCardUtil.setSameVulueCardCount(prop);
    var four = PopCardUtil.getFour();
    var rank = parseInt(last_cards_type.rank);

    if (four.count > 0) {
        for (var k in four.cards) {
            var v = four.cards[k];
            // console.log("v:"+v[0]+"  k:"+k);
            if (rank < v[0]) {
                all_result.push(v);
            }
        }
        // return all_result;
    }

    var temps = [];
    var pair = PopCardUtil.getPair();
    var three = PopCardUtil.getThree();

    if (pair.count > 1) {
        for (var i = 0; i < 2; i++) {
            for (var j = 0; j < 2; j++) {
                temps.push(parseInt(pair.cards[i]));
            }
        }
    } else if (pair.count == 1 && three.count > 0) {
        for (var i = 0; i < 2; i++) {
            temps.push(parseInt(pair.cards[0]));
        }
        for (var i = 0; i < 2; i++) {
            temps.push(parseInt(three.cards[0]));
        }
    } else if (three.count > 1) {
        for (var i = 0; i < 2; i++) {
            for (var j = 0; j < 2; j++) {
                temps.push(parseInt(three.cards[i]));
            }
        }
    }

    for (var k in all_result) {
        var v = all_result[k];

        for (var i = 0; i < temps.length; i++) {
            v.push(parseInt(temps[i]));
        }
        console.log("v2:" + v);
        v.sort(config.arrayUp);
    }

    return all_result;
};

//符合的顺子牌
LazarilloCardUtil.find_straight = function (last_cards_type, prop, myCards, lzLen, lzValue) {
    var all_result = [];
    PopCardUtil.setSameVulueCardCount(prop);
    var rank = parseInt(last_cards_type.rank);
    var repeatCount = last_cards_type.repeatCount;
    // var single = PopCardUtil.getSingle();

    console.log("rank:" + rank + " repeatCount:" + repeatCount);

    var maxRank = rank + repeatCount - 1;
    if (maxRank == CardUtil.cardGrade["1"]) {
        console.log("-----已经是通天顺子");
        return all_result;
    }

    //所有赖子补齐
    if (true) {
        console.log("-------所有顺子赖子补齐");
        var tempAllcards = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
        var begin = rank + 1;
        var tempCards = config.arraySub(begin, tempAllcards.length, tempAllcards, 1);
        var tempAll_result = [];
        var len = tempCards.length - repeatCount;
        var temparr = [];
        for (var i = 0; i <= len; i++) {
            if (tempCards.length >= repeatCount + i) {
                temparr = config.arraySub(i, repeatCount + i, tempCards, 1);
                tempAll_result.push(temparr);
            }
        }
        // console.log("tempAll_result:",tempAll_result);
        //自己所有单张牌
        var singles = [];
        for (var k in prop) {
            singles.push(k);
        }
        // console.log("singles:",singles);
        var xx_All_result = [];
        for (var i = 0; i < tempAll_result.length; i++) {
            var xx_temp = [];
            for (var m = 0; m < tempAll_result[i].length; m++) {
                for (var n = 0; n < singles.length; n++) {
                    if (tempAll_result[i][m] == singles[n]) {
                        xx_temp.push(tempAll_result[i][m]);
                    }
                }
            }
            xx_All_result.push(xx_temp);
        }
        // console.log("xx_All_result:",xx_All_result);
        // lzLen
        for (var i = 0; i < xx_All_result.length; i++) {
            //要补齐的张数
            var lznum = 0;
            var repCount = repeatCount - xx_All_result[i].length;
            if (lzLen >= repCount) {
                for (var m = 0; m < repCount; m++) {
                    xx_All_result[i].push(lzValue);
                }
                for (var j = 0; j < xx_All_result[i].length; j++) {
                    if (xx_All_result[i][j] == lzValue) {
                        lznum++;
                    }
                }
                // console.log("-------lznum:",lznum);
                if (lznum <= lzLen) all_result.push(xx_All_result[i]);
            }
        }
    }

    console.log(all_result);
    return all_result;
};

//符合的连对
LazarilloCardUtil.find_pair_straight = function (last_cards_type, prop, myCards, lzLen, lzValue) {
    var all_result = [];
    PopCardUtil.setSameVulueCardCount(prop);
    var rank = parseInt(last_cards_type.rank);
    var repeatCount = last_cards_type.repeatCount;

    console.log("rank:" + rank + " repeatCount:" + repeatCount);

    var maxRank = rank + repeatCount - 1;
    if (maxRank == CardUtil.cardGrade["1"]) {
        console.log("-----已经是通天连队");
        return all_result;
    }

    //找到所有符合的连队
    if (true) {
        console.log("-------所有顺子赖子补齐");
        var tempAllcards = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
        var begin = rank + 1;
        var tempCards = config.arraySub(begin, tempAllcards.length, tempAllcards, 1);
        var tempAll_result = [];
        var len = tempCards.length - repeatCount;
        var temparr = [];
        for (var i = 0; i <= len; i++) {
            if (tempCards.length >= repeatCount + i) {
                temparr = config.arraySub(i, repeatCount + i, tempCards, 1);
                tempAll_result.push(temparr);
            }
        }
        console.log("tempAll_result:", tempAll_result);

        var xx_All_result = [];
        for (var i = 0; i < tempAll_result.length; i++) {
            // console.log("xxx:",tempAll_result[i]);
            var xx_temp = [];
            var len = 0;
            for (var j = 0; j < tempAll_result[i].length; j++) {
                if (prop[tempAll_result[i][j]]) {
                    len = prop[tempAll_result[i][j]].length;
                    console.log(">>>>len:", len);
                    if (len > 2) {
                        len = 2;
                    }
                    for (var m = 0; m < len; m++) {
                        xx_temp.push(tempAll_result[i][j]);
                    }
                }
            }
            xx_All_result.push(xx_temp);
        }
        console.log("xx_All_result:", xx_All_result);
        for (var i = 0; i < xx_All_result.length; i++) {
            //要补齐的张数
            var lznum = 0;
            var repCount = repeatCount * 2 - xx_All_result[i].length;
            if (lzLen >= repCount) {
                for (var m = 0; m < repCount; m++) {
                    xx_All_result[i].push(lzValue);
                }
                for (var j = 0; j < xx_All_result[i].length; j++) {
                    if (xx_All_result[i][j] == lzValue) {
                        lznum++;
                    }
                }
                // console.log("-------lznum:",lznum);
                if (lznum <= lzLen) all_result.push(xx_All_result[i]);
            }
        }
    }
    console.log(all_result);
    return all_result;
};

//符合的飞机不带
LazarilloCardUtil.find_three_straight = function (last_cards_type, prop, myCards, lzLen, lzValue) {
    var all_result = [];
    PopCardUtil.setSameVulueCardCount(prop);
    var rank = parseInt(last_cards_type.rank);
    var repeatCount = last_cards_type.repeatCount;

    console.log("rank:" + rank + " repeatCount:" + repeatCount);

    var three = PopCardUtil.getThree();
    var four = PopCardUtil.getFour();
    var allpair = [];

    for (var i = 0; i < three.count; i++) {
        allpair.push(three.cards[i][0]);
    }
    for (var i = 0; i < four.count; i++) {
        allpair.push(four.cards[i][0]);
    }

    allpair.sort(config.arrayUp);

    console.log(allpair);

    var autoCards = [];
    var tempCards = [];
    var tempNum = 0;
    for (var i = 0; i < allpair.length; i++) {

        if (allpair[i] < CardUtil.cardGrade["2"] && allpair[i] > rank) {
            console.log("i:" + i);
            if (allpair[i] + 1 == allpair[i + 1] && allpair[i + 1] < CardUtil.cardGrade["2"]) {
                console.log("i2:" + i);
                if (tempNum + 1 == allpair[i + 1]) {
                    autoCards.push(tempNum);
                }
                if (i == 0) {
                    autoCards.push(allpair[i]);
                }
                autoCards.push(allpair[i + 1]);
            } else {
                tempNum = allpair[i + 1];
                if (autoCards.length >= repeatCount) {
                    tempCards.push(autoCards);
                }
                autoCards = [];
                continue;
            }
        }
    }

    console.log(tempCards);

    for (var i = 0; i < tempCards.length; i++) {
        if (tempCards[i].length >= repeatCount) {
            var len = tempCards[i].length - repeatCount;
            var temparr = [];
            for (var j = 0; j <= len; j++) {
                if (tempCards[i].length >= repeatCount + j) {
                    temparr = config.arraySub(j, repeatCount + j, tempCards[i], 3);
                    all_result.push(temparr);
                }
            }
        }
    }

    console.log(all_result);
    return all_result;
};

//符合的飞机带单
LazarilloCardUtil.find_three_straight_with_single_card = function (last_cards_type, prop, myCards, lzLen, lzValue) {
    var all_result = [];
    all_result = LazarilloCardUtil.find_three_straight(last_cards_type, prop, myCards, lzLen, lzValue);
    return all_result;
};

LazarilloCardUtil.find_three_straight_with_pair_card = function (last_cards_type, prop, myCards) {
    var all_result = [];
    all_result = LazarilloCardUtil.find_three_straight(last_cards_type, prop, myCards, lzLen, lzValue);
    return all_result;
};

module.exports = LazarilloCardUtil;

cc._RF.pop();