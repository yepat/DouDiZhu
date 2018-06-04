"use strict";
cc._RF.push(module, 'f75a5WV9zFIIZD2d9+2E/ny', 'Events');
// Script/gameNetwork/Events.js

"use strict";

var _Events$Network;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Events = {};

//--网络相关的事件名
Events.Network = (_Events$Network = {
    GameStateChanged: "GameStateChanged", //游戏状态发生改变
    StatusChange: "network_status_change", //网络状态改变
    LoginServerResult: "network_loginserver_result", //登录服务器结果
    LoginRoomResult: "network_loginroom_result", //登录房间结果
    JoinQueueResult: "network_joinqueue_result", //加入队列结果
    GameReady: "network_gameready", //游戏已经准备好开玩
    EditProfile: "network_editprofile", //个人资料改变
    DispatchCard: "network_dispatchcard", //发牌
    CallLordTurn: "network_calllord_turn", //轮到谁叫地主
    CallLordResult: "network_calllord_result", //叫地主结果
    GrabLordTurn: "network_grablord_turn", //轮到谁抢地主
    GrabLordResult: "network_grablord_result", //抢地主结果
    ConfirmedLord: "network_confirmed_lord", //地主身份已确认
    SendCardTurn: "network_sendcard_turn", //轮到谁出牌
    PlayerSendCard: "network_player_sendcard", //玩家出牌
    PlayerNotSendCard: "network_player_notsendcard", //玩家不出牌
    PlayerShowCard: "network_player_showcard", //玩家亮牌
    PlayerReady: "network_player_ready", //玩家已就绪
    GameOver: "network_gameover", //游戏结束
    GameRequestReady: "network_game_requestready", //游戏要求开始
    TalkContent: "talk_content", //游戏牌桌-谈话框-通知说的话
    SayToTableInfo: "say_to_table_info", //牌桌里发语言
    TableRateUpdate: "network_tablerate_update", //桌子倍数发生改变
    ExchangeGoldToCoin: "exchange_gold_to_coin", //兑换乐币
    RechargeOk: "recharge_ok", //充值成功
    PlayerDelegated: "network_player_delegated", //玩家被托管了
    PlayerCancelDelegate: "network_player_canceldelegate", //玩家取消托管  
    SendCoinsFree: "send_coins_free", //赠送乐豆
    TableUserExit: "table_user_exit", //有玩家退出游戏
    PlayerInvalidSendCard: "network_sendcard_invalid", //玩家出牌有非法数据
    Notice: "notice", //系统公告消息
    ContinueGame: "continue_game", //未完成牌桌协议执行完
    LoginContestSignUpResult: "login_contest_signup_result", //进入竞技模式结果
    ContestSignUpResult: "contest_signup_result", //竞技报名结果
    CancelContestSignUpResult: "cancel_contest_signup_result", //取消报名结果
    GiveUpContestResult: "give_up_contest_result", //通知用户已放弃
    ContestStart: "contest_start", //通知竞技开始
    ContestOut: "contest_out", //通知用户被淘汰
    ContestEnd: "contest_end", //通知竞技结束
    ContestFormalEnd: "contest_formal_end", //通知竞技结果
    SendContestReward: "send_contest_reward", //通知发送竞技奖励
    SendContestWeekReward: "send_contest_week_reward", //通知发送竞技每周奖励
    InvalidGameModel: "invalid_game_model", //通知游戏模式冲突
    ChangeSkinResult: "change_skin_result", //更换皮肤结果
    BuySkinResult: "buy_skin_result", //购买皮肤结果
    BuySkinResultAtHall: "buy_goodsAtHall_result", //在大厅购买皮肤物品
    LuckyDrawViewResult: "lucky_draw_view_result", //抽奖界面数据
    LuckyDrawResult: "lucky_draw_result", //抽奖结果数据
    LuckyDrawRecordResult: "lucky_draw_record_result", //抽奖记录数据(7日内的)
    LoginRewardViewResult: "login_reward_view_result", //查看签到界面
    LoginRewardResult: "login_reward_result", //执行签到操作
    GameDayRankResult: "game_day_rank_result", //回馈今日榜单
    GameThisWeekRankResult: "game_this_week_rank_result", //回馈本周榜单
    GameLastWeekRankResult: "game_last_week_rank_result", //回馈上周榜单
    ActivityBarResult: "activity_bar_result", //回馈公告面板
    GiftBagResult: "gift_bag_result", //领取礼包结果

    ShowActivity: "show_activity", //显示活动对话框

    MailResult: "mail_result", //邮箱数据
    ActivityResult: "activity_result", //活动数据
    AnnouncementResult: "announcement_result", //公告数据
    GetFileResult: "get_file_result", //获取相应版本号图片素材结果
    GetTipsResult: "get_tips_result", //获取相应版本号滚动数据结果
    RichRankResult: "rich_rank_result", //富豪榜数据
    EveryDayRankResult: "every_day_rank_result", //每日榜数据
    EveryWeekRankResult: "every_week_rank_result", //每周榜数据
    ModifyAgeResult: "modify_age_result", //修改年龄结果
    GetNewMailResult: "get_new_mail_result", //用户新收邮件列表结果
    ReadMailResult: "read_mail_result", //标记邮件已读结果
    GetMailAttachmentResult: "get_mail_attachment_result", //领取邮件附件结果
    DelMailResult: "del_mail_result", //删除某个邮件结果
    GetNewActivityResult: "get_new_activity_result", //活动栏目里的新数据结果
    GetNewAnnouncementResult: "get_new_announcement_result", //公告栏目里的新数据结果
    OpenAdvertisingResult: "open_advertising_result", //打开大厅热门活动结果
    ConsumeResult: "consume_result", //消费记录结果
    GetPersonalItems: "get_personal_items", //获得个人道具提示
    GetPublicItems: "get_public_items", //获得公共道具提示
    GetPropsGift: "get_props_gift", //获得礼包、哄抢礼包
    PlunderGiftResult: "plunder_gift_result", //获得哄抢礼包数据

    OpenRechargeTip: "open_recharge_tip", //打开救济面板
    OpenReliefTip: "open_relief_tip", //执行拉霸操作
    ShopItem: "shop_item", //打开充值中心
    ExchangeItems: "exchange_items", //打开兑换中心

    RefreshDataResult: "refresh_data_result", //刷新用户信息数据
    ExchangeItemConfirm: "exchange_item_confirm", //执行兑换操作
    PokerTask: "poker_task", //触发牌局任务，发牌后触发，达成后触发
    TaskDailyResult: "task_daily_result", //打开每日任务面板
    TaskGrowthResult: "task_growth_result", //打开成长任务面板
    GetTaskRewardResult: "get_task_reward_result", //领取任务奖励
    PropItems: "prop_items", //切换道具状态
    BuyPropsResult: "buy_props_result", //打开商品道具中心
    ShopBuyGoldResult: "shop_buy_gold_result", //打开充值乐币
    NoviceGiftResult: "novice_gift_result", //打开新手礼包

    BackpackResult: "backpack_result", //我的道具
    MonthNoticeResult: "month_notice_result", //月卡购买、领取通知
    GetSalaryResult: "get_salary_result", //领取包月俸禄

    GetLoginReward: "GetLoginReward", //1.9.3版以上领取登陆奖励
    Complaint: "Complaint", //牌局投诉


    RepeatLogin: "repeat_login", //通知用户连接被另外一个连接踢掉
    MonthUseUp: "month_use_up", //通知用户月卡耗尽
    SendLzCard: "send_lz_card", //发送癞子牌
    BuySingleItemsResult: "buy_single_items_result", //购买单次记牌器
    LuckyDrawListResult: "lucky_draw_list_result", //幸运抽奖列表
    LuckyDrawNewResult: "lucky_draw_new_result", //执行一次抽奖(新版)
    ExitGameTextResult: "exit_game_text_result", //退出游戏文本
    SlotMachineGetInfo: "slotMachine_getInfo", //摇摇乐获取信息
    SlotMachineGameResult: "slotMachine_gameResult", //摇摇乐返回抽奖结果
    GetMenuPromptResult: "get_menu_prompt_result", //获取菜单提示项
    GetGameGiftListResult: "get_game_lift_list_result", //获取礼包列表
    GetRewardListResult: "get_reward_list_result" }, _defineProperty(_Events$Network, "GetGameGiftListResult", "get_game_lift_list_result"), _defineProperty(_Events$Network, "CanDoubleResult", "can_double_result"), _defineProperty(_Events$Network, "BuyGoodsResult", "buyGoods_result"), _defineProperty(_Events$Network, "GetGameFieldResult", "getGameField_result"), _defineProperty(_Events$Network, "GetFieldDetailResult", "getFieldDetail_result"), _defineProperty(_Events$Network, "GetMyFieldResult", "getMyField_result"), _defineProperty(_Events$Network, "SignupResult", "Signup_Result"), _defineProperty(_Events$Network, "UnSignupResult", "UnSignup_Result"), _defineProperty(_Events$Network, "GetMatchItemsResult", "GetMatchItems_Result"), _defineProperty(_Events$Network, "GameMatchStart", "gamematch_start"), _defineProperty(_Events$Network, "MatchEliminateResult", "MatchEliminate_Result"), _defineProperty(_Events$Network, "EnterHallScence", "EnterHallScenece"), _defineProperty(_Events$Network, "MatchOrderChangedResult", "MatchOrderChangedResult"), _defineProperty(_Events$Network, "MatchStartSoonResult", "MatchStartSoonResult"), _defineProperty(_Events$Network, "MatchEndBagResult", "MatchEndBagResult"), _defineProperty(_Events$Network, "FirstgetlequanResult", "FirstgetlequanResult"), _defineProperty(_Events$Network, "RedpacketprocessResult", "RedpacketprocessResult"), _defineProperty(_Events$Network, "EntergamerestnumResult", "EntergamerestnumResult"), _defineProperty(_Events$Network, "RefreshPlayerData", "RefreshPlayerData"), _defineProperty(_Events$Network, "GetPlayerMatchesInfo", "GetPlayerMatchesInfo"), _defineProperty(_Events$Network, "Analysis_log", "Analysis_log"), _defineProperty(_Events$Network, "EmoticonData", "emoticon_data"), _defineProperty(_Events$Network, "PokerAnalysis", "PokerAnalysis"), _Events$Network);

module.exports = Events;

cc._RF.pop();