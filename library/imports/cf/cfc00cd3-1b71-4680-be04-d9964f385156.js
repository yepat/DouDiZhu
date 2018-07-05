"use strict";
cc._RF.push(module, 'cfc00zTG3FGgL4E2ZZPOFFW', 'LazarilloCardUtil');
// Script/LazarilloCardUtil.js

"use strict";

var AppConfig = require("config");
var PopCardUtil = require("PopCardUtil");
var CardUtil = require("CardUtil");

var LazarilloCardUtil = {};

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
        all_cards = LazarilloCardUtil.get_straight_three_lazarillo_cards(len, tip_cards, lazarillo, lzLen, cards, AppConfig.CardType.StraightThree);
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
        all_cards = LazarilloCardUtil.get_straight_three_lazarillo_cards(len, tip_cards, lazarillo, lzLen, cards, AppConfig.CardType.StraightThreePlusSingle);
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
        all_cards = LazarilloCardUtil.get_straight_three_lazarillo_cards(len, tip_cards, lazarillo, lzLen, cards, AppConfig.CardType.StraightThree);
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
        all_cards = LazarilloCardUtil.get_straight_three_lazarillo_cards(len, tip_cards, lazarillo, lzLen, cards, AppConfig.CardType.StraightThreePlusPair);
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
        all_cards = LazarilloCardUtil.get_straight_three_lazarillo_cards(len, tip_cards, lazarillo, lzLen, cards, AppConfig.CardType.StraightThree);
        for (var k in all_cards) {
            return_cards[return_cards.length] = all_cards[k];
        }
        //飞机带单
        all_cards = [];
        len = 3; //飞机长度
        all_cards = LazarilloCardUtil.get_straight_three_lazarillo_cards(len, tip_cards, lazarillo, lzLen, cards, AppConfig.CardType.StraightThreePlusSingle);
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
        var all_cards = LazarilloCardUtil.get_straight_three_lazarillo_cards(len, tip_cards, lazarillo, lzLen, cards, AppConfig.CardType.StraightThree);
        for (var k in all_cards) {
            return_cards[return_cards.length] = all_cards[k];
        }
        //飞机带对
        all_cards = [];
        len = 3; //飞机长度
        all_cards = LazarilloCardUtil.get_straight_three_lazarillo_cards(len, tip_cards, lazarillo, lzLen, cards, AppConfig.CardType.StraightThreePlusPair);
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
        all_cards = LazarilloCardUtil.get_straight_three_lazarillo_cards(len, tip_cards, lazarillo, lzLen, cards, AppConfig.CardType.StraightThreePlusSingle);
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
        all_cards = LazarilloCardUtil.get_straight_three_lazarillo_cards(len, tip_cards, lazarillo, lzLen, cards, AppConfig.CardType.StraightThree);
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
        all_cards = LazarilloCardUtil.get_straight_three_lazarillo_cards(len, tip_cards, lazarillo, lzLen, cards, AppConfig.CardType.StraightThreePlusSingle);
        for (var k in all_cards) {
            return_cards[return_cards.length] = all_cards[k];
        }
        //飞机带对
        all_cards = [];
        len = 4; //飞机长度
        all_cards = LazarilloCardUtil.get_straight_three_lazarillo_cards(len, tip_cards, lazarillo, lzLen, cards, AppConfig.CardType.StraightThreePlusPair);
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
    console.log("kingCount:" + kingCount);

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
    tip_cards_val.sort(AppConfig.arrayUp);

    console.log(tip_cards_val);

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

    // --飞机
    // for i=3, mapping["ace"] do--3-A
    //     if i >= minCard - 1 and i <= maxCard then
    //         if i + (straightLen - 1) <= mapping["ace"] then --要的起的飞机
    //             local straightThree = {i,i,i}
    //             for j=1, straightLen-1 do--飞机的牌数
    //                 for n=1, 3 do
    //                     straightThree[#straightThree + 1] = i+j
    //                 end
    //             end
    //             all_result[#all_result + 1] = straightThree
    //         end
    //     end
    // end

    console.log(all_result);

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

    console.log(effectiveType);

    if (effectiveType.length > 0) {
        if (tType == AppConfig.CardType.StraightThree) {
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
        } else if (tType == AppConfig.CardType.StraightThreePlusSingle) {
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
        } else if (tType == AppConfig.CardType.StraightThreePlusPair) {
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
                    if (n + i == lazarillo) {
                        //是癞子本身值，不用转化
                        lz_nochange_count = lz_nochange_count + 1;
                    } else {
                        lz_straight_val.push(n + i);
                    }
                } else {
                    for (var k in pairSet.cards) {
                        //先判断单张里有值没
                        var v = pairSet.cards[k][0];
                        if (v == n + i) {
                            haveCard = true;
                        }
                    }
                    if (!haveCard) {
                        if (n + i == lazarillo) {
                            //是癞子本身值，不用转化
                            lz_nochange_count = lz_nochange_count + 2;
                        } else {
                            lz_straight_val.push(n + i);
                            lz_straight_val.push(n + i);
                        }
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
                    if (n + i == lazarillo) {
                        //是癞子本身值，不用转化
                        lz_nochange_count = lz_nochange_count + 1;
                    } else {
                        lz_straight_val.push(n + i);
                    }
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

module.exports = LazarilloCardUtil;

cc._RF.pop();