(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/dialog/resoultInfoItemControl.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'befceraMjdEGZQ+n9tC5pA+', 'resoultInfoItemControl', __filename);
// Script/dialog/resoultInfoItemControl.js

"use strict";

var config = require("config");
cc.Class({
    extends: cc.Component,

    properties: {
        pDizhu: {
            default: null,
            type: cc.Sprite
        },
        labNickName: {
            default: null,
            type: cc.Label
        },
        labDifen: {
            default: null,
            type: cc.Label
        },
        labBeishu: {
            default: null,
            type: cc.Label
        },
        labLedou: {
            default: null,
            type: cc.Label
        },
        pInfoBtn: {
            default: null,
            type: cc.Sprite
        },
        pInfoTxt: {
            default: null,
            type: cc.Sprite
        }
    },
    onLoad: function onLoad() {
        this.pDizhu.enabled = false;
        this.pInfoBtn.enabled = false;
        this.pInfoTxt.enabled = false;
    },

    // start () { 
    // },   
    init: function init(isDizhi, name, difen, beishu, ledou, isMe, coin, rateMax) {
        if (isDizhi) {
            this.pDizhu.enabled = true;
        }
        if (isMe) {} else {
            this.labNickName.node.color = new cc.Color(255, 255, 255);
            this.labDifen.node.color = new cc.Color(255, 255, 255);
            this.labBeishu.node.color = new cc.Color(255, 255, 255);
            this.labLedou.node.color = new cc.Color(255, 255, 255);
        }
        this.labNickName.string = config.parseString(name);
        this.labDifen.string = "" + difen;
        this.labBeishu.string = "" + beishu;
        if (ledou > 0) {
            ledou = "+" + ledou;
        } else {
            ledou = "- " + Math.abs(ledou);
        }
        this.labLedou.string = "" + ledou;
        // this.isPochan = false;
        this.fengdingpochan(isDizhi, beishu, ledou, difen, rateMax, isMe, coin);
    },

    //破产封顶判断
    fengdingpochan: function fengdingpochan(test_dz, rate, total, difen, roomRateMax, isMe, palyerCoin) {
        var self = this;
        var rate_ = parseInt(rate); //倍数
        var total_ = parseInt(total); //输赢
        var rateMax_ = parseInt(difen); //低分

        var blt = false; //自身豆够 地主破产 没赢到最大值

        if (roomRateMax && rate_ > roomRateMax && isMe && palyerCoin > 0) {
            var win = false;
            var tag = false;
            if (total_ > 0) {
                win = true;
            }

            if (total_ < 0) {
                //地主钱不够 输不到最大值
                var mRate = rate_;
                if (rate_ > roomRateMax) {
                    mRate = roomRateMax;
                }
                var m_total = mRate * rateMax_;
                if (test_dz) {
                    m_total = m_total * 2;
                }

                if (Math.abs(total_) < m_total) {
                    return;
                }
            }

            //自身豆不够赢不到最大值
            if (total_ > 0) {
                var mRate = rate_;
                if (rate_ > roomRateMax) {
                    mRate = roomRateMax;
                }
                var m_total = mRate * rateMax_;
                if (test_dz) {
                    m_total = m_total * 2;
                }
                if (total_ < m_total) {
                    tag = true;
                }

                if (palyerCoin > total_) {
                    blt = true;
                }
            }

            if (blt) {} else {
                self.fengding(win, tag);
                return;
            }
        }

        if (roomRateMax && rate_ <= roomRateMax && isMe && palyerCoin > 0) {
            var win = false;
            var tag = false;
            if (total_ > 0) {
                win = true;
            }
            //自身豆不够赢不到最大值
            if (total_ > 0) {
                var mRate = rate_;
                if (rate_ > roomRateMax) {
                    mRate = roomRateMax;
                }
                var m_total = mRate * rateMax_;
                if (test_dz) {
                    m_total = m_total * 2;
                }

                if (palyerCoin > total_) {
                    blt = true;
                }

                if (total_ < m_total && !blt) {
                    tag = true;
                    self.fengding(win, tag);
                    return;
                }
            }
        }

        if (total_ < 0) {
            var mRate = rate_;
            if (rate_ > roomRateMax) {
                mRate = roomRateMax;
            }
            var m_total = mRate * rateMax_;
            if (test_dz) {
                m_total = m_total * 2;
            }

            if (m_total > Math.abs(total_) && palyerCoin == 0) {
                self.pochan();
            } else if (m_total == math.abs(total_) && isMe && palyerCoin == 0) {
                self.pochan();
            }
        }
    },
    pochan: function pochan() {
        console.log("破产了");
        this.pInfoBtn.enabled = true;
        this.pInfoTxt.enabled = true;
        cc.loader.loadRes("gameResult/p_pochan", cc.SpriteFrame, function (err, spriteFrame) {
            self.pInfoBtn.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        });
        cc.loader.loadRes("gameResult/tip_pochan", cc.SpriteFrame, function (err, spriteFrame) {
            self.pInfoTxt.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        });
    },
    fengding: function fengding(win, tag) {
        var self = this;
        var tipsStr = "gameResult/tip_fengding";
        if (win) {
            tipsStr = "gameResult/tip_fengding2";
        } else {
            tipsStr = "gameResult/tip_fengding";
        }
        if (tag) {
            tipsStr = "gameResult/tip_fengding3";
        }

        console.log("封顶了：" + tipsStr);
        this.pInfoBtn.enabled = true;
        this.pInfoTxt.enabled = true;

        cc.loader.loadRes("gameResult/p_fengding", cc.SpriteFrame, function (err, spriteFrame) {
            self.pInfoBtn.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        });
        cc.loader.loadRes(tipsStr, cc.SpriteFrame, function (err, spriteFrame) {
            self.pInfoTxt.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        });
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
        //# sourceMappingURL=resoultInfoItemControl.js.map
        