(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/gameNetwork/Protocol.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '15f8e1UHT9ILpWi7f0jBZGL', 'Protocol', __filename);
// Script/gameNetwork/Protocol.js

"use strict";

var Protocol = {};

//协议类型
Protocol.Command = {
    HeartBeat: 0,
    Login: 1,
    Text: 2,
    Broadcast: 3,
    System: 4,
    Game: 5,
    Props: 6,
    FruitMachine: 7, //水果机
    NiuNiu: 8, //牛牛
    GameCommand: 9, //游戏新协议
    Analysis: 10 //日志分析
};
Protocol.CommandRevert = {
    0: "HeartBeat",
    1: "Login",
    2: "Text",
    3: "Broadcast",
    4: "System",
    5: "Game",
    6: "Props",
    7: "FruitMachine",
    8: "NiuNiu",
    9: "GameCommand",
    10: "Analysis"
    //请求码
};Protocol.Request = {
    HeartBeat: {
        Alive: 0
    },
    Login: {
        Guest: 0,
        Mail: 1,
        Weibo: 2,
        Facebook: 3,
        Account: 4,
        Logout: 5,
        Regist: 6 //注册 1.9.3以后注册流程并入socket
    },
    System: {
        Enter: 0,
        Leave: 1,
        Info: 2,
        Profile: 3,
        ChangeAvatar: 4,
        ChangeNick: 5,
        GetFile: 105, //获取相应版本号图片素材
        GetTips: 107, //获取相应版本号滚动数据
        GetNewMail: 111, //用户新收邮件列表
        GetNewActivity: 129, //活动栏目里的新数据
        GetNewAnnouncement: 131, //公告栏目里的新数据
        ModifyAge: 207, //修改年龄
        Mail: 211, //邮箱
        ReadMail: 213, //标记邮件已读
        GetMailAttachment: 215, //领取邮件附件
        DelMail: 217, //删除某个邮件
        Consume: 231, //消费记录
        Activity: 401, //活动
        OpenAdvertising: 403, //打开大厅热门活动
        Announcement: 431, //公告
        RichRank: 611, //富豪榜
        EveryDayRank: 621, //每日榜
        EveryWeekRank: 631, //每周榜

        RefreshData: 109, //刷新用户信息数据
        ShopItem: 301, //打开充值中心
        ExchangeItems: 321, //打开兑换中心
        ExchangeItemConfirm: 323, //执行兑换操作
        TaskDaily: 511, //打开每日任务面板
        TaskGrowth: 503, //打开成长任务面板
        GetTaskReward: 513, //领取任务奖励
        BuyProps: 331, //打开商品道具中心
        ShopBuyGold: 311, //打开充值乐币
        HallReport: 901, //客端报告-用户登录后进入大厅
        Backpack: 221, //我的道具
        MonthNotice: 223, //月卡购买、领取通知
        GetSalary: 225, //领取包月俸禄

        SlotGetInfo: 425, //获取摇摇乐基础信息
        SlotStartRun: 427, //开始滚动
        GetMenuPrompt: 233, //获取菜单提示项

        GetGiftList: 169, //打开礼包面板
        GetRewardList: 235, //再打几局可以获得的奖励

        GetShopItems: 303, //获取商店道具列表
        EnterHall: 701, //进入大厅标示

        ShareInfo: 515, //分享信息
        ShareGet: 517, //分享领取

        ShareWxRes: 519, //微信分享成功发送

        WatchAdvertisement: 521 //看完广告发送
    },
    Game: {
        Init: 0, //进入房间
        Ready: 1, //准备游戏(游戏结束后调用)
        Go: 2, //准备游戏
        CallLord: 5, //叫地主
        GrabLord: 6, //抢地主
        ShowCard: 7, //明牌
        SendCard: 8, //出牌
        NotFollow: 10, //不跟
        BalanceOk: 11, //结算完成
        ExitRoom: 13, //离开游戏
        ChangeTable: 14, //要换桌
        RequestDelegate: 15, //要求托管
        CancelDelegate: 16, //取消托管
        EditNick: 20, //修改昵称
        EditSex: 21, //修改性别
        EditSignature: 22, //修改签名
        SayToTable: 31, //桌内聊天
        ExchangeGoldToCoin: 41, //兑换乐豆
        LoginContestSignUp: 101, //进入竞技模式
        ContestSignUp: 103, //竞技报名
        CancelContestSignUp: 105, //取消报名
        GiveUpContest: 109, //放弃竞技
        ChangeSkin: 123, //更换皮肤
        BuySkin: 125, //购买皮肤
        LuckyDrawView: 131, //查看抽奖界面
        LuckyDraw: 133, //执行一次抽奖
        LuckyDrawRecord: 135, //查看抽奖记录
        LoginRewardView: 137, //查看签到界面
        LoginReward: 139, //执行签到操作
        GameDayRank: 141, //查看今日榜单
        GameThisWeekRank: 143, //查看本周榜单
        GameLastWeekRank: 145, //查看上周榜单
        ActivityBar: 147, //查看公告面板
        RefreshContestData: 127, //刷新竞技场数据
        GiftBag: 149, //领取礼包
        ContestFramesComplete: 111, //竞技场进入房间完成

        OpenRechargeTip: 151, //打开救济面板
        OpenReliefTip: 155, //执行拉霸操作

        LuckyDrawList: 157, //幸运抽奖列表
        LuckyDrawNew: 159, //执行一次抽奖(新版)
        ExitGameText: 161, //退出游戏文本
        AddRatio: 17, //加倍
        GetGameFieldInfo: 201, //获取比赛房间列表信息
        GetFieldDetailInfo: 203, //获取比赛房间详情
        GetMyFieldInfo: 205, //获取自己的参赛情况
        SignupField: 207, //参赛
        UnSignupField: 209, //取消比赛
        GetMatchItems: 217, //获取竞技奖励
        ExchangeMatchItem: 219, //比赛领奖
        SureKnockout: 221, //确认退出淘汰赛
        VipPrivilege: 223, //Vip特权
        GetPlayerMatchesInfo: 225, //获取游戏次数
        GetLoginReward: 227, //领取登陆奖励
        Complaint: 231, //牌局投诉

        Emoticon: 235, //发送表情
        PokerAnalysis: 100, //牌局日志

        Reconnection: 229 //短线重连

    },
    Props: {
        PlunderGift: 107, //发起哄抢请求
        PropItems: 109, //切换道具状态
        BuySingleItems: 111 //购买单次记牌器
    }

    //返回码
};Protocol.Response = {
    HeartBeat: {
        Alive: 0
    },
    Login: {
        Regist: 6,
        OK: 10,
        NoDevice: 11,
        ErrorDevice: 12,
        NotReg: 13,
        NoNum: 14,
        LoginFailed: 15
    },
    Broadcast: {
        Notice: 301, //系统公告消息
        ShowActivity: 306 //显示activity
    },
    System: {
        GetFileResult: 106, //获取相应版本号图片素材结果
        GetTipsResult: 108, //获取相应版本号滚动数据结果
        GetNewMailResult: 112, //用户新收邮件列表结果
        GetNewActivityResult: 130, //活动栏目里的新数据结果
        GetNewAnnouncementResult: 132, //公告栏目里的新数据结果
        ModifyAgeResult: 208, //修改年龄结果
        MailResult: 212, //邮箱数据
        ReadMailResult: 214, //标记邮件已读结果
        GetMailAttachmentResult: 216, //领取邮件附件结果
        DelMailResult: 218, //删除某个邮件结果
        ConsumeResult: 232, //消费记录结果
        ActivityResult: 402, //活动数据
        OpenAdvertisingResult: 404, //打开大厅热门活动结果
        AnnouncementResult: 432, //公告数据
        RichRankResult: 612, //富豪榜数据
        EveryDayRankResult: 622, //每日榜数据
        EveryWeekRankResult: 632, //每周榜数据

        RefreshDataResult: 110, //刷新用户信息数据
        ShopItemResult: 302, //打开充值中心
        ExchangeItemsResult: 322, //打开兑换中心
        ExchangeItemConfirmResult: 324, //执行兑换操作
        TaskDailyResult: 512, //打开每日任务面板
        TaskGrowthResult: 504, //打开成长任务面板
        GetTaskRewardResult: 514, //领取任务奖励
        BuyPropsResult: 332, //打开商品道具中心
        ShopBuyGoldResult: 312, //打开充值乐币
        NoviceGiftResult: 334, //打开新手礼包
        BackpackResult: 222, //我的道具
        MonthNoticeResult: 224, //月卡购买、领取通知
        GetSalaryResult: 226, //领取包月俸禄

        RepeatLogin: 902, //通知用户连接被另外一个连接踢掉
        MonthUseUp: 228, //通知用户月卡耗尽

        SlotInfo: 426, //服务器返回摇摇乐基础信息
        SlotResult: 428, //返回摇摇乐结果
        GetMenuPromptResult: 234, //获取菜单提示项
        GetGiftListResult: 170, //打开礼包面板结果返回
        PushGameGift: 168, //弹出礼包窗口
        GetRewardListResult: 236, //再打几局可以获得的奖励
        GameCommTips: 166, //游戏通用提示框
        ShopItemsResult: 304, //获取商店道具列表
        HallGiftResult: 164, //大厅礼包数据
        GameTips: 120, //新版游戏提示

        ShareInfoResult: 516, //分享信息结果
        ShareGetResult: 518, //分享领取结果

        ShareWxResResult: 520, //微信分享成功发送结果

        WatchAdvertisementResult: 522 //看完广告领奖
    },
    Game: {
        NoLogin: 1000, //未登录
        Queued: 1001, //进入队列
        SendLzCard: 1002, //发送癞子牌      桌子准备好
        PlayerReady: 1003, //某个用户准备好
        GameReady: 1004, //游戏准备好了
        SendCard: 1005, //发牌, 包括各用户的牌信息
        CallLord: 1006, //玩家叫地主
        CallLordOver: 1007, //叫地主结束
        TurnCallLord: 1008, //轮到谁叫地主
        TurnSendCard: 1009, //轮到谁出牌
        ContinueGame: 1010, //未完成牌桌协议执行完
        TurnGrabLord: 1011, //轮到谁抢地主
        InvalidCardSender: 1012, //没轮到出牌 [非法出牌]
        InvalidCardNum: 1013, //出的牌不够大 [非法出牌]
        GameComplete: 1014, //本局结束
        InitOk: 1015, //进入房间成功
        GrabLord: 1016, //玩家抢地主
        PlayerSendCard: 1017, //用户出牌
        PlayerNotSend: 1018, //用户不出牌
        PlayerShowCard: 1019, //用户明牌
        InvalidCardType: 1020, //出牌有非法数据 [非法出牌]
        TableTimesUpdate: 1021, //桌子的倍数发生改变
        RequestReady: 1023, //请求新游戏开始
        CoinsNoMatchRoom: 1027, //乐币不足登录房间
        PlayerDelegated: 1028, //用户托管
        PlayerCancelDelegate: 1029, //用户取消托管
        UpdateSuccess: 2000, //编辑成功
        UpdateFailed: 2001, //编辑出错
        UpdateUnknownErr: 2002, //未知错误编辑
        SayToTableInfo: 3000, //聊天回调信息 供客户端展示 sayId为聊天发起人的座位ID
        ExchangeGoldToCoinOK: 4000, //兑换乐豆成功
        ExchangeGoldToCoinERROR: 4001, //兑换乐豆失败
        RechargeOk: 4002, //充值成功
        SendCoinsFree: 1024, //赠送乐豆
        TableUserExit: 1025, //有用户退出 通知桌上的玩家重新进入队列
        LoginContestSignUpResult: 102, //进入竞技模式结果
        ContestSignUpResult: 104, //竞技报名结果
        CancelContestSignUpResult: 106, //取消报名结果
        ContestStart: 108, //通知竞技开始
        GiveUpContestResult: 110, //通知用户已放弃
        ContestOut: 112, //通知用户被淘汰
        ContestEnd: 114, //通知竞技结束
        ContestFormalEnd: 116, //通知竞技结果
        SendContestReward: 118, //通知发送竞技奖励
        SendContestWeekReward: 120, //通知发送竞技每周奖励
        InvalidGameModel: 122, //通知游戏模式冲突
        ChangeSkinResult: 124, //更换皮肤结果
        BuySkinResult: 126, //购买皮肤结果
        LuckyDrawViewResult: 132, //抽奖界面数据
        LuckyDrawResult: 134, //抽奖结果数据
        LuckyDrawRecordResult: 136, //抽奖记录数据(7日内的)
        LoginRewardViewResult: 138, //查看签到界面
        LoginRewardResult: 140, //执行签到操作
        GameDayRankResult: 142, //回馈今日榜单
        GameThisWeekRankResult: 144, //回馈本周榜单
        GameLastWeekRankResult: 146, //回馈上周榜单
        ActivityBarResult: 148, //回馈公告面板
        GiftBagResult: 150, //领取礼包结果

        OpenRechargeTipResult: 152, //打开救济面板
        OpenReliefTipResult: 156, //执行拉霸操作
        PokerTask: 1022, //触发牌局任务，发牌后触发，达成后触发
        LuckyDrawListResult: 158, //幸运抽奖列表
        LuckyDrawNewResult: 160, //执行一次抽奖(新版)
        ExitGameTextResult: 162, //退出游戏文本
        CanDoubleResult: 1030, //通知是否可以加倍
        GetGameFieldInfoResult: 202, //获取房间信息
        GetFieldDetailInfoResult: 204, //获取比赛房间详情
        GetMyFieldInfoResult: 206, //获取自己的参赛情况
        SignupFieldResult: 208, //参赛结果
        UnSignupFieldResult: 210, //取消比赛结果
        GetMatchItemsResult: 218, //获取竞技奖励结果
        MatchStartResult: 212, //竞技场开始
        MatchEliminateResult: 214, //竞技场淘汰
        MatchResult: 216, //竞技场比赛结果
        MatchOrderChanged: 220, //比赛名次变化
        MatchStartSoon: 222, //通知游戏快开始了

        MatchEndBag: 223, //牌局结束红包
        Firstgetlequan: 224, //第一次获得乐券
        Redpacketprocess: 225, //红包进度条
        Entergamerestnum: 227, //进入房间红包剩余次数

        RefreshPlayerData: 430, //刷新用户金币(用户桌面)
        GetPlayerMatchesInfo: 226, //获取游戏总局数
        Complaint: 232, //牌局投诉

        EmoticonData: 236, //广播表情包
        PokerAnalysis: 100, //牌局日志

        ReconnectionData: 330 //短线重连
    },
    Props: {
        GetPersonalItems: 102, //获得个人道具提示
        GetPublicItems: 104, //获得公共道具提示
        GetPropsGift: 106, //获得礼包、哄抢礼包
        PlunderGiftResult: 108, //获得哄抢礼包数据
        PropItems: 110, //切换道具状态
        BuySingleItemsResult: 112 //购买单次记牌器
    }
};

module.exports = Protocol;

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
        //# sourceMappingURL=Protocol.js.map
        