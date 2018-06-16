(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/CardUtil.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'bcf07TAfuVFjJw5QqEtX1yc', 'CardUtil', __filename);
// Script/CardUtil.js

"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var config = require("config");
var PopCardUtil = require("PopCardUtil");

var CardUtil = {};

CardUtil.cardGrade = {
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
    10: 10,
    J: 11,
    Q: 12,
    K: 13,
    A: 14,
    2: 15,
    g: 16,
    G: 17
};

//记牌器数据信息
CardUtil.getNodeCards = function (mycards) {
    var tempstr = "";
    var myCardValue = [];
    for (var i = 0; i < mycards.length; i++) {
        var card = CardUtil.convertCardToClient(mycards[i]);
        myCardValue.push(card.showTxt);
    }
    myCardValue.sort(config.arrayUp);

    var sameCards = PopCardUtil.getSameCards(myCardValue);

    for (var i = 3; i <= 17; i++) {
        if (sameCards[i]) {
            tempstr += sameCards[i].length;
        } else {
            tempstr += "0";
        }
    }

    return tempstr;
};
//获取当前自己手牌(出牌后)
CardUtil.subNodeCards = function (cards1, cards2) {
    var str = "";
    var cards1 = CardUtil.getNodeCards(cards1);
    console.log(cards1);
    var cards2 = CardUtil.getNodeCards(cards2);
    console.log(cards2);
    for (var i = 0; i < cards1.length; i++) {
        var value1 = parseInt(cards1[i]);
        var value2 = parseInt(cards2[i]);
        var value = value1 - value2;
        if (value < 0) {
            value = 0;
        }
        str += value;
    }
    return str;
};

//文本转数值
CardUtil.StringToNumber = function (str) {
    var num = 0;
    if (typeof str == "string") {
        num = parseInt(str);
    } else {
        num = str;
    }
    return num;
};
//降序排列
CardUtil.gradeDown = function (card1, card2) {
    return card2.showTxt * 10 + card2.showType - (card1.showTxt * 10 + card1.showType);
};
//升序排列
CardUtil.gradeUp = function (card1, card2) {
    return card1.showTxt * 10 + card1.showType - (card2.showTxt * 10 + card2.showType);
};

//服务器牌值转化
CardUtil.serverCardsToClient = function (serverCards) {
    var pokerData = [];
    for (var i = 0; i < serverCards.length; i++) {
        var card = serverCards[i];
        pokerData.push(CardUtil.convertCardToClient(card));
    }
    pokerData.sort(CardUtil.gradeDown);
    return pokerData;
};
CardUtil.convertCardToClient = function (value) {
    var cardValue = 0;
    var cardType = 0;
    var cardItem = {};
    if (value == "00") {
        cardValue = 16;
        cardType = config.ghostCardType.smallG;
    } else if (value == "01") {
        cardValue = 17;
        cardType = config.ghostCardType.bigG;
    } else {
        var str1 = value.substring(0, 1);
        var str2 = value.substring(1);
        if (str1 == "4") {
            cardType = config.pokerCardType.spade;
        } else if (str1 == "3") {
            cardType = config.pokerCardType.hearts;
        } else if (str1 == "2") {
            cardType = config.pokerCardType.blackberry;
        } else if (str1 == "1") {
            cardType = config.pokerCardType.redslice;
        }

        if (str2 == "1") {
            cardValue = 14;
        } else if (str2 == "2") {
            cardValue = 15;
        } else if (str2 == "a") {
            cardValue = 10;
        } else if (str2 == "b") {
            cardValue = 11;
        } else if (str2 == "c") {
            cardValue = 12;
        } else if (str2 == "d") {
            cardValue = 13;
        } else {
            cardValue = parseInt(str2);
        }
    }
    cardItem.showTxt = cardValue;
    cardItem.showType = cardType;
    return cardItem;
};

//客户端牌转成服务器格式
CardUtil.clientCardsToServer = function (clientCards) {
    var serverCardData = [];
    for (var i = 0; i < clientCards.length; i++) {
        serverCardData.push(CardUtil.convertCardToServer(clientCards[i]));
    }
    return serverCardData;
};
CardUtil.convertCardToServer = function (cardItem) {
    var cardValue = cardItem.showTxt;
    var cardType = cardItem.showType;
    var str1 = "";
    var str2 = "";
    if (cardType == config.pokerCardType.spade) {
        str1 = "4";
    } else if (cardType == config.pokerCardType.hearts) {
        str1 = "3";
    } else if (cardType == config.pokerCardType.blackberry) {
        str1 = "2";
    } else if (cardType == config.pokerCardType.redslice) {
        str1 = "1";
    }
    if (cardValue == 14) {
        str2 = "1";
    } else if (cardValue == 15) {
        str2 = "2";
    } else if (cardValue == 10) {
        str2 = "a";
    } else if (cardValue == 11) {
        str2 = "b";
    } else if (cardValue == 12) {
        str2 = "c";
    } else if (cardValue == 13) {
        str2 = "d";
    } else {
        str2 = "" + cardValue;
    }
    var str = str1 + str2;
    if (cardValue == 16) {
        str = "00";
    } else if (cardValue == 17) {
        str = "01";
    }
    return str;
};

//获取提起的牌值
CardUtil.getMyTopCards = function (myPokerNode, PokerControl) {
    var topcards = [];
    for (var i = myPokerNode.length - 1; i > 0; i--) {
        var pokerControl = myPokerNode[i].getComponent(PokerControl);
        if (pokerControl.cardData.isTopped) {
            topcards.push(pokerControl.cardValue);
        }
    }
    return topcards;
};

//提起手牌
CardUtil.AutoChooseLiftUpCard = function (myPokerNode, PokerControl, cards) {
    console.log("tishiFunc!!");
    // var cards = ["3","3","5","6","7"];
    var maxLenght = 0;
    var num = 0;

    console.log(typeof cards === "undefined" ? "undefined" : _typeof(cards));
    if (!cards) {
        console.log("没有符合牌型！");
        return;
    }

    if (typeof cards == "number") {
        console.log("这是个数字");
        maxLenght = 1;
    } else {
        //if(typeof(cards) == "string")
        // console.log("这是个字符");
        maxLenght = cards.length;
    }

    console.log("maxLenght:" + maxLenght);

    for (var i = myPokerNode.length - 1; i >= 0; i--) {
        var pokerControl = myPokerNode[i].getComponent(PokerControl);
        // var pktxt = pokerControl.cardData.showTxt;
        var pktxt = parseInt(pokerControl.cardValue);
        var cardvalue = parseInt(cards[num]);
        if (maxLenght == 1) {
            cardvalue = cards;
        } else {
            // cardvalue = parseInt(cards[num]);
        }
        console.log("cardvalue:" + cardvalue + " pktxt:" + pktxt); //+" cards[num]:"+cards[num]
        if (num < maxLenght && cardvalue == pktxt) {
            console.log("num:" + num);
            num++;
            pokerControl.setChoosed(true);
        }
    }
    if (num < cards.length) {
        for (var i = myPokerNode.length - 1; i >= 0; i--) {
            var pokerControl = myPokerNode[i].getComponent(PokerControl);
            pokerControl.setChoosed(false);
        }
    } else {
        for (var i = myPokerNode.length - 1; i >= 0; i--) {
            var pokerControl = myPokerNode[i].getComponent(PokerControl);
            // if(!pokerControl.cardData.isTopped&&pokerControl.cardData.isChoosed){
            pokerControl.cardMove();
            // }
        }
    }
};
//判断是否连续
CardUtil.is_rank_consective_inc = function (cards) {
    var count = 0;
    count = cards.length;
    if (count < 2) {
        return true;
    }

    //这里是降?
    for (var i = 0; i < count - 1; i++) {
        if (cards[i][0] + 1 != cards[i + 1][0]) {
            return false;
        }
    }
    return true;
};

//3个头和4个头放在一起
CardUtil.extend = function (table1, table2) {
    if (!table1 || !table2) {
        console.log("table can not be nil");
        return false;
    }

    for (var i = 0; i < table2.length; i++) {
        if (table2[i]) {
            table1.push(table2[i]);
        }
    }
};

//判断提起的牌是否合法
CardUtil.get_topCard_type = function (topCards) {

    if (typeof topCards == "number") {
        console.log("这是个数字");
        topCards = [topCards];
    } else {}

    // console.log(topCards);

    //相同值归类并统计
    var sameValues = PopCardUtil.getSameCards(topCards);
    PopCardUtil.setSameVulueCardCount(sameValues);

    var topLength = topCards.length;
    var blt = false;

    var cardtype = [];
    cardtype.type = 0;
    cardtype.rank = 0;
    cardtype.repeatCount = 0;

    if (topLength == 1) {
        //单只
        var single = PopCardUtil.getSingle();
        cardtype.type = config.CardType.Single;
        cardtype.rank = topCards[0];
        cardtype.repeatCount = 1;
        console.log("单只");
        return cardtype;
    } else if (topLength == 2) {
        //对子 王炸
        var pair = PopCardUtil.getPair();
        if (pair.count == 1) {
            cardtype.type = config.CardType.Pair;
            cardtype.rank = topCards[0];
            cardtype.repeatCount = 1;
            console.log("对子");
            return cardtype;
        } else if (topCards[0] == 16 && topCards[1] == 17) {
            cardtype.type = config.CardType.DoubleKing;
            cardtype.rank = topCards[0];
            cardtype.repeatCount = 1;
            console.log("王炸");
            return cardtype;
        }
    } else if (topLength == 3) {
        //三不带
        var three = PopCardUtil.getThree();
        if (three.count > 0) {
            cardtype.type = config.CardType.ThreeOfKind;
            cardtype.rank = three.cards[0][0];
            cardtype.repeatCount = 1;
            console.log("三不带");
            return cardtype;
        }
    } else if (topLength == 4) {
        //三带一 炸弹
        var three = PopCardUtil.getThree();
        var four = PopCardUtil.getFour();
        if (four.count > 0) {
            cardtype.type = config.CardType.Bomb;
            cardtype.rank = four.cards[0][0];
            cardtype.repeatCount = 1;
            console.log("炸弹");
            return cardtype;
        } else if (three.count > 0) {
            cardtype.type = config.CardType.ThreeOfKindPlusOne;
            cardtype.rank = three.cards[0][0];
            cardtype.repeatCount = 1;
            console.log("三带一");
            return cardtype;
        }
    } else {
        //三带一对 四带一 顺子
        var single = PopCardUtil.getSingle();
        var pair = PopCardUtil.getPair();
        var three = PopCardUtil.getThree();
        var four = PopCardUtil.getFour();

        var singleNum = single.count;
        var pairNum = pair.count;
        var threeNum = three.count;
        var fourNum = four.count;

        var singleCards = PopCardUtil.SingleCards;
        var pairCards = PopCardUtil.PairCards;
        var threeCards = PopCardUtil.ThreeCards;
        var fourCards = PopCardUtil.FourCards;

        var singleSetConsective = CardUtil.is_rank_consective_inc(singleCards);
        var pairSetConsective = CardUtil.is_rank_consective_inc(pairCards);
        var threeSetConsective = CardUtil.is_rank_consective_inc(threeCards);

        var consectiveEnd = CardUtil.cardGrade["2"];

        // for(var i=0;i<threeCards.length;i++){
        //     console.log("three:"+threeCards[i]);
        // }

        //四带
        if (fourNum == 1 && threeNum == 0) {
            if (singleNum == 2 && pairNum == 0) {
                cardtype.type = config.CardType.FourPlusOne;
                cardtype.rank = fourCards[0][0];
                cardtype.repeatCount = 1;
                console.log("四带二单");
                return cardtype;
            } else if (singleNum == 0 && pairNum == 1) {
                cardtype.type = config.CardType.FourPlusOne;
                cardtype.rank = fourCards[0][0];
                cardtype.repeatCount = 1;
                console.log("四带一对");
                return cardtype;
            } else if (singleNum == 0 && pairNum == 2) {
                cardtype.type = config.CardType.FourPlusTwo;
                cardtype.rank = fourCards[0][0];
                cardtype.repeatCount = 1;
                console.log("四带两对");
                return cardtype;
            }
        }
        //三带一对
        if (threeNum == 1 && singleNum == 0 && pairNum == 1 && fourNum == 0) {
            cardtype.type = config.CardType.ThreeOfKindPlusPair;
            cardtype.rank = threeCards[0][0];
            cardtype.repeatCount = 1;
            console.log("三带一对");
            return cardtype;
        }
        //飞机不带
        if (threeNum > 1 && singleNum == 0 && pairNum == 0 && fourNum == 0) {
            if (threeSetConsective && threeCards[threeNum - 1][0] < consectiveEnd) {
                cardtype.type = config.CardType.StraightThree;
                cardtype.rank = threeCards[0][0];
                cardtype.repeatCount = threeNum;
                console.log("飞机不带");
                return cardtype;
            }
        }
        //连队
        if (pairNum > 2 && singleNum == 0 && threeNum == 0 && fourNum == 0) {
            if (pairSetConsective && pairCards[pairNum - 1][0] < consectiveEnd) {
                cardtype.type = config.CardType.StraightDouble;
                cardtype.rank = pairCards[0][0];
                cardtype.repeatCount = pairNum;
                console.log("连对");
                return cardtype;
            }
        }
        //顺子
        if (singleNum > 4 && pairNum == 0 && threeNum == 0 && fourNum == 0) {
            if (singleSetConsective && singleCards[singleNum - 1][0] < consectiveEnd) {
                cardtype.type = config.CardType.Straight;
                cardtype.rank = singleCards[0][0];
                cardtype.repeatCount = singleNum;
                console.log("顺子");
                return cardtype;
            }
        }

        var allThree = [];

        if (threeNum > 0) {
            if (singleNum == threeNum && pairNum == 0 && fourNum == 0) {
                //飞机带单
                if (threeSetConsective && threeCards[threeNum - 1][0] < consectiveEnd) {
                    cardtype.type = config.CardType.StraightThreePlusSingle;
                    cardtype.rank = threeCards[0][0];
                    cardtype.repeatCount = threeNum;
                    console.log("飞机带单");
                    return cardtype;
                }
            } else if (singleNum == 0 && pairNum == threeNum && fourNum == 0) {
                if (threeSetConsective && threeCards[threeNum - 1][0] < consectiveEnd) {
                    cardtype.type = config.CardType.StraightThreePlusPair;
                    cardtype.rank = threeCards[0][0];
                    cardtype.repeatCount = threeNum;
                    console.log("飞机带双");
                    return cardtype;
                }
            } else if (singleNum + pairNum * 2 == threeNum && fourNum == 0) {
                if (threeSetConsective && threeCards[threeNum - 1][0] < consectiveEnd) {
                    cardtype.type = config.CardType.StraightThreePlusSingle;
                    cardtype.rank = threeCards[0][0];
                    cardtype.repeatCount = threeNum;
                    console.log("飞机带单");
                    return cardtype;
                }
            } else if (threeNum + fourNum == pairNum * 2 + singleNum + fourNum) {
                //带炸弹的飞机（4=3+1）
                console.log("带炸弹的飞机（4=3+1）");
                var isConsective = threeSetConsective;
                if (fourNum > 0) {
                    CardUtil.extend(allThree, threeCards);
                    CardUtil.extend(allThree, fourCards);
                    allThree.sort(config.arrayUp);
                    isConsective = CardUtil.is_rank_consective_inc(allThree);
                } else {
                    allThree = threeCards;
                }
                var allThreeLength = allThree.length;
                if (isConsective && allThree[allThreeLength - 1][0] < consectiveEnd) {
                    cardtype.type = config.CardType.StraightThreePlusSingle;
                    cardtype.rank = threeCards[0][0];
                    cardtype.repeatCount = allThreeLength;
                    console.log("飞机带单2");
                    return cardtype;
                }
            } else {
                if (pairNum + fourNum * 2 == threeNum && singleNum == 0) {
                    //炸弹拆开当对子
                    if (threeSetConsective && threeCards[threeNum - 1][0] < consectiveEnd) {
                        cardtype.type = config.CardType.StraightThreePlusPair;
                        cardtype.rank = threeCards[0][0];
                        cardtype.repeatCount = threeNum;
                        console.log("飞机带双2");
                        return cardtype;
                    }
                }

                if (threeNum > 3) {
                    //三飞以上给服务器判断
                    cardtype.type = -1;
                    console.log("特殊牌型");
                    return cardtype;
                }

                // cardtype.type = -1;
                return cardtype; //一些特殊情况交给服务器了 比如：3个拆开当单只， 
            }
        }
    }
    return cardtype;
};

//根据提起的牌智能提牌
CardUtil.getCardsFromTopCards = function (myCards, topCards) {
    var myCards = myCards;
    var topCards = topCards;
    topCards.sort(config.arrayUp);
    var myCardsLength = myCards.length;
    var topCardsLength = topCards.length;

    //值相同的牌放在一起
    var classificationCards = {};
    //相同值归类并统计
    classificationCards = PopCardUtil.getSameCards(myCards);
    // PopCardUtil.setSameVulueCardCount(classificationCards);

    var autoCards = [];
    if (topCardsLength == 2) {
        if (topCards[0] == topCards[1]) {
            var key = topCards[0];
            //提起的牌值在牌面上能组成炸弹
            var kCount = classificationCards[key].length;
            console.log("key:" + key + " kCount:" + kCount);
            if (kCount == 4) {
                console.log("炸弹----------");
                autoCards = classificationCards[key];
                return autoCards;
            }

            if (kCount == 3 && key != "2") {
                console.log("可能有飞机");
                var temp = [];
                var tempCount = 0;
                temp[tempCount] = classificationCards[key];
                //提起的牌值(++)
                for (var i = 1; i < myCardsLength; i++) {
                    if (classificationCards[key + i] && classificationCards[key + i].length == 3 && key + i != "2") {
                        tempCount++;
                        temp[tempCount] = classificationCards[key + i];
                        console.log("key+i:" + (key + i));
                    } else {
                        break;
                    }
                }
                //提起的牌值(--)
                for (var i = 1; i < myCardsLength; i++) {
                    if (classificationCards[key - i] && classificationCards[key - i].length == 3 && key + i != "2") {
                        tempCount++;
                        temp[tempCount] = classificationCards[key - i];
                        console.log("key+i:" + (key - i));
                    } else {
                        break;
                    }
                }

                //检查牌组是否是飞机
                if (temp.length > 1) {
                    for (var i = 0; i < temp.length; i++) {
                        for (var j = 0; j < temp[i].length; j++) {
                            console.log("temp:" + temp[i][j]);
                            autoCards.push(temp[i][j]);
                        }
                    }
                }
                autoCards.sort(config.arrayUp);
                return autoCards;
            }
        } else if (topCards[0] + 1 == topCards[1]) {
            if (topCards[1] >= CardUtil.cardGrade["2"]) {
                autoCards = topCards;
                return autoCards;
            }

            var key = topCards[1];
            autoCards = topCards;
            for (var i = 1; i <= 3; i++) {
                if (classificationCards[key + i] && key + i < CardUtil.cardGrade["2"]) {
                    //满足组成顺子的牌
                    autoCards.push(classificationCards[key + i][0]);
                }
            }
            if (autoCards.length < 5) {
                autoCards = [];
            }
            return autoCards;
        } else {
            autoCards = [];
            return autoCards;
        }
    } else if (topCardsLength == 3) {
        //连队判定
        console.log("连队判定");
        var classificationTopCards = {};
        classificationTopCards = PopCardUtil.getSameCards(topCards);
        // classificationTopCards.sort();
        if (classificationTopCards.length > 2) {
            var topKeys = [];
            for (var k in classificationTopCards) {
                topKeys.push(k);
            }
            var k1 = parseInt(topKeys[0]);
            var k2 = parseInt(topKeys[1]);
            var kk = k1 + 1;
            // console.log("k1:"+k1+" k2:"+k2+" kk:"+kk);
            if (kk == k2 && k2 < CardUtil.cardGrade["2"]) {
                var key = k1;
                for (var k in classificationCards) {
                    if (k == key) {
                        var d = classificationCards[k];
                        console.log("d:" + d.length + "  k:" + k);
                        if (d.length >= 2) {
                            for (var i = 0; i < 2; i++) {
                                autoCards.push(d[i]);
                            }
                            key++;
                        } else {
                            break;
                        }
                    }
                }
                if (autoCards.length < 6) {
                    autoCards = [];
                }
                return autoCards;
            }
        }
    }

    return autoCards;
};

//提示----------------------------------------

// config.CardType = {
// 	Single : 1,                         //单张
// 	Pair : 2,                           //对子
// 	ThreeOfKind : 3,                    //三不带
// 	ThreeOfKindPlusOne : 4,             //三带一
// 	ThreeOfKindPlusPair : 5,            //三带二
// 	Straight : 6,                       //顺子
// 	StraightDouble : 7,					//双顺  33 44 55
// 	StraightThree : 8,					//三顺  333 444    飞机  [333 444 555 a b c/ aa bb cc]
// 	StraightThreePlusSingle : 9,		//三顺+散牌 飞机带翅膀  333 444 5 6 / +一对
// 	StraightThreePlusPair : 10,			//三顺+对   飞机带翅膀  333 444 66 77
// 	SoftBomb : 87,						//软炸弹
// 	Bomb : 88,							//炸弹
// 	LazarilloBomb : 89,					//纯癞子炸弹
// 	DoubleKing : 99,					//双王
// 	FourPlusOne : 11,					//四带1, 四只带两只单牌
// 	FourPlusTwo : 12,					//四带2, 四只带两对
// }

//获取比上家大的牌
CardUtil.get_cards_larger = function (last_cards_type, myCards) {
    var all_result = [];

    var prop = PopCardUtil.getSameCards(myCards);
    // PopCardUtil.setSameVulueCardCount(classificationCards);

    var cardsType = last_cards_type.type;
    if (cardsType == config.CardType.Single) {
        all_result = CardUtil.find_single_card(last_cards_type, prop, myCards);
    } else if (cardsType == config.CardType.Pair) {
        all_result = CardUtil.find_pair_card(last_cards_type, prop, myCards);
    } else if (cardsType == config.CardType.ThreeOfKind) {
        all_result = CardUtil.find_three_card(last_cards_type, prop, myCards);
    } else if (cardsType == config.CardType.Bomb) {
        all_result = CardUtil.find_bomb_card(last_cards_type, prop, myCards);
    } else if (cardsType == config.CardType.ThreeOfKindPlusOne) {
        all_result = CardUtil.find_three_with_one_card(last_cards_type, prop, myCards);
    } else if (cardsType == config.CardType.ThreeOfKindPlusPair) {
        all_result = CardUtil.find_three_with_two_card(last_cards_type, prop, myCards);
    } else if (cardsType == config.CardType.FourPlusOne) {
        all_result = CardUtil.find_four_with_two_single_card(last_cards_type, prop, myCards);
    } else if (cardsType == config.CardType.FourPlusTwo) {
        all_result = CardUtil.find_four_with_two_pair_card(last_cards_type, prop, myCards);
    } else if (cardsType == config.CardType.Straight) {
        all_result = CardUtil.find_straight(last_cards_type, prop, myCards);
    } else if (cardsType == config.CardType.StraightDouble) {
        all_result = CardUtil.find_pair_straight(last_cards_type, prop, myCards);
    } else if (cardsType == config.CardType.StraightThree) {
        all_result = CardUtil.find_three_straight(last_cards_type, prop, myCards);
    } else if (cardsType == config.CardType.StraightThreePlusSingle) {
        all_result = CardUtil.find_three_straight_with_single_card(last_cards_type, prop, myCards);
    } else if (cardsType == config.CardType.StraightThreePlusPair) {
        all_result = CardUtil.find_three_straight_with_pair_card(last_cards_type, prop, myCards);
    }

    if (cardsType != config.CardType.Bomb && cardsType != config.CardType.DoubleKing) {
        var all_bomb = CardUtil.find_bomb_all(prop);
        for (var i = 0; i < all_bomb.length; i++) {
            all_result.push(all_bomb[i]);
        }
    }

    return all_result;
};
//符合条件的单张牌
CardUtil.find_single_card = function (last_cards_type, prop, myCards) {
    var all_result = [];
    PopCardUtil.setSameVulueCardCount(prop);
    var single = PopCardUtil.getSingle();
    var rank = parseInt(last_cards_type.rank);
    // console.log("符合条件的单张牌");
    if (single.count > 0) {
        for (var k in single.cards) {
            var v = single.cards[k];
            // console.log("v:"+v+"  k:"+k);
            if (rank < v) {
                all_result.push(v);
            }
        }
        // return all_result;
    }

    //没有适合单张 就拆分牌
    var allcards = []; //所有牌值
    for (var k in prop) {
        var v = prop[k];
        // console.log("v:"+v[0]+"  k:"+k);
        allcards.push(k);
    }

    // console.log("length::"+all_result.length);
    if (all_result.length <= 0) {
        for (var k in allcards) {
            var v = parseInt(allcards[k]);
            // console.log("v:"+v+"  k:"+k);
            if (rank < v) {
                all_result.push(v);
            }
        }
    }

    return all_result;
};

//找合适的对子出牌
CardUtil.find_pair_card = function (last_cards_type, prop, myCards) {
    var all_result = [];
    PopCardUtil.setSameVulueCardCount(prop);
    var pair = PopCardUtil.getPair();
    // console.log("符合条件的对子牌");
    var rank = parseInt(last_cards_type.rank);
    if (pair.count > 0) {
        for (var k in pair.cards) {
            var v = pair.cards[k];
            // console.log("v:"+v[0]+"  k:"+k);
            if (rank < v[0]) {
                all_result.push(v);
            }
        }
        // return all_result;
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
CardUtil.find_three_card = function (last_cards_type, prop, myCards) {
    var all_result = [];
    PopCardUtil.setSameVulueCardCount(prop);
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
    return all_result;
};

//所有的炸弹牌
CardUtil.find_bomb_all = function (prop) {
    var all_result = [];
    PopCardUtil.setSameVulueCardCount(prop);
    var four = PopCardUtil.getFour();
    for (var k in four.cards) {
        var v = four.cards[k];
        // console.log("v:"+v[0]+"  k:"+k);
        all_result.push(v);
    }

    if (prop[16] && prop[17]) {
        console.log("有王炸");
        var values = [16, 17];
        all_result.push(values);
    } else {
        console.log("没有王炸");
    }

    return all_result;
};

//找合适的炸弹牌
CardUtil.find_bomb_card = function (last_cards_type, prop, myCards) {
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
    }
    if (prop[16] && prop[17]) {
        console.log("有王炸");
        var values = [16, 17];
        all_result.push(values);
    } else {
        console.log("没有王炸");
    }

    return all_result;
};

//找合适的三带一
CardUtil.find_three_with_one_card = function (last_cards_type, prop, myCards) {
    var all_result = [];
    PopCardUtil.setSameVulueCardCount(prop);
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

    var single = PopCardUtil.getSingle();
    var pair = PopCardUtil.getPair();
    // var three = PopCardUtil.getThree();
    var allOne = []; //所有三张的牌值 单张组

    var onecard = 0;
    if (single.count > 0) {
        onecard = parseInt(single.cards[0]);
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

    return all_result;
};
//三带一对
CardUtil.find_three_with_two_card = function (last_cards_type, prop, myCards) {
    var all_result = [];
    PopCardUtil.setSameVulueCardCount(prop);
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

    var allOne = []; //所有三张的牌值 对子组

    var pair = PopCardUtil.getPair();
    var tempPair = [];
    if (pair.count > 0) {
        tempPair = pair.cards[0];
    } else {
        //拆分3张
        for (var k in three.cards) {
            var v = three.cards[k];
            allOne.push(v[0]);
        }
    }

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
CardUtil.find_four_with_two_single_card = function (last_cards_type, prop, myCards) {
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
CardUtil.find_four_with_two_pair_card = function (last_cards_type, prop, myCards) {
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
CardUtil.find_straight = function (last_cards_type, prop, myCards) {

    var all_result = [];
    PopCardUtil.setSameVulueCardCount(prop);
    var rank = parseInt(last_cards_type.rank);
    var repeatCount = last_cards_type.repeatCount;
    var single = PopCardUtil.getSingle();

    console.log("rank:" + rank + " repeatCount:" + repeatCount);

    //所有牌可以组成的顺子
    var autoCards = [];
    var tempCards = [];
    var key = rank;
    for (var i = 1; i < 20; i++) {
        if (prop[key + i] && key + i < CardUtil.cardGrade["2"]) {
            //满足组成顺子的牌
            autoCards.push(prop[key + i][0]);
        } else {
            if (autoCards.length >= repeatCount) {
                tempCards.push(autoCards);
            }
            autoCards = [];
            continue;
        }
    }

    console.log(tempCards);
    if (tempCards.length == 0) return all_result;
    console.log("length:" + tempCards[0].length);

    if (tempCards[0].length > repeatCount) {
        var len = tempCards[0].length - repeatCount;
        var temparr = [];
        for (var i = 0; i <= len; i++) {
            if (tempCards[0].length >= repeatCount + i) {
                temparr = config.arraySub(i, repeatCount + i, tempCards[0]);
                all_result.push(temparr);
            }
        }
    } else {
        all_result = tempCards;
    }

    console.log(all_result);

    return all_result;
};

//符合的连对
CardUtil.find_pair_straight = function (last_cards_type, prop, myCards) {
    var all_result = [];
    PopCardUtil.setSameVulueCardCount(prop);
    var rank = parseInt(last_cards_type.rank);
    var repeatCount = last_cards_type.repeatCount;

    console.log("rank:" + rank + " repeatCount:" + repeatCount);

    var pair = PopCardUtil.getPair();
    var three = PopCardUtil.getThree();
    var four = PopCardUtil.getFour();
    var allpair = [];

    for (var i = 0; i < pair.count; i++) {
        allpair.push(pair.cards[i][0]);
    }
    for (var i = 0; i < three.count; i++) {
        allpair.push(three.cards[i][0]);
    }
    for (var i = 0; i < four.count; i++) {
        allpair.push(four.cards[i][0]);
    }

    allpair.sort(config.arrayUp);

    var autoCards = [];
    var tempCards = [];
    var tempNum = 0;
    for (var i = 0; i < allpair.length; i++) {

        if (allpair[i] < CardUtil.cardGrade["2"] && allpair[i] > rank) {
            console.log("i:" + i);
            if (allpair[i] + 1 == allpair[i + 1]) {
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

    for (var i = 0; i < tempCards.length; i++) {
        if (tempCards[i].length >= repeatCount) {
            var len = tempCards[i].length - repeatCount;
            var temparr = [];
            for (var j = 0; j <= len; j++) {
                if (tempCards[i].length >= repeatCount + j) {
                    temparr = config.arraySub2(j, repeatCount + j, tempCards[i]);
                    all_result.push(temparr);
                }
            }
        }
    }

    console.log(all_result);
    return all_result;
};

//符合的飞机不带
CardUtil.find_three_straight = function (last_cards_type, prop, myCards) {
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
            if (allpair[i] + 1 == allpair[i + 1]) {
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
                    temparr = config.arraySub3(j, repeatCount + j, tempCards[i]);
                    all_result.push(temparr);
                }
            }
        }
    }

    console.log(all_result);
    return all_result;
};

//符合的飞机带单
CardUtil.find_three_straight_with_single_card = function (last_cards_type, prop, myCards) {
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
            if (allpair[i] + 1 == allpair[i + 1]) {
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
                    temparr = config.arraySub3(j, repeatCount + j, tempCards[i]);
                    all_result.push(temparr);
                }
            }
        }
    }

    console.log(all_result);
    return all_result;
};
//符合的飞机带双
CardUtil.find_three_straight_with_pair_card = function (last_cards_type, prop, myCards) {
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
            if (allpair[i] + 1 == allpair[i + 1]) {
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
                    temparr = config.arraySub3(j, repeatCount + j, tempCards[i]);
                    all_result.push(temparr);
                }
            }
        }
    }

    console.log(all_result);
    return all_result;
};

//提示----------------------------------------
module.exports = CardUtil;

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
        //# sourceMappingURL=CardUtil.js.map
        