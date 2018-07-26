
var config = {}

config.MyNode = null; //常驻节点
config.initMgr = null; //全局变量

config.temppassword = "";

config.OpenUDIDEncryptToken = "!_Tvr%^98071e~int5lmUy";

config.stopOnMassage = false;

config.VERSION_NAME = "2.1.0"; //当前程序版本（2.0.0 是为了兼容tv版）
config.VERSION_ABOUT = "1.0.3";//关于版本号
config.SDKUID = 0;

config.SystemInfo = null;
config.device = null; //iOS  Android

config.TrialShareShow = 0; //分享领豆显示 1 true

config.wxShareInfo = "key1=value1&key2=value2";

config.playGameId = 0; //断线
config.playGameMsg = "";

config.firstLogin = false; //第一次登陆

config.IsContinueGaming = 0; //1是断线重连牌桌

config.RoomId = 0;  //未完成牌桌

config.tableInfo = null;//桌子信息 

config.curRoomModelId = 0;//房间模式
//房间模式
config.ModelId = {normal : 0, contest : 3, lazarillo : 2}

config.joker = "";//赖子牌

config.adCdTime = 0;//广告冷却时间
config.showAd = 0;//显示广告
config.rewardedVideoAd = null;//广告控件
config.rewardedVideoType = 0;
config.canSeeVideoAd = true;

config.jpqShareSucss = false;//获得记牌器分享成功
config.leQuanShareSucss = false;//获得乐券分享成功
config.leDouShareSucss = false;//获得乐豆分享成功

config.shareIndex = 0;
config.sendCardState = false;//发牌状态
config.videoEndFuc = null;

config.maxRateShare = 0;//高倍分享倍数


//叫地主时间
config.CallLordTimeout = 15;
//抢地主超时时间
config.GrabLordTimeout = 15;
//出牌倒计时时间
config.SendCardTimeout = 25;
//过牌时间--要不起
config.CheckCardTimeout = 25;
//加倍时间
config.AddRatioTime = 3.5; 

config.hintType = {
    callLoad:1,    //叫地主
    callLoadNo:2,  //不叫
    grabLoad:3,    //抢地主
    grabLoadNo:4,  //不抢
    dont:5,        //不要
    double:6,      //加倍
    doubleNo:7,    //不加倍
    waitingDouble:8,//等待加倍
}

config.opratType = {
    callLoad:1, //叫地主
    grabLoad:2, //抢地主
    mustOutCard:3,//自己必须出牌
}


config.pokerCardType = {
    spade : 4,//黑桃
    hearts : 3,//红桃
    redslice : 1,//红方
    blackberry : 2,//梅花
}

config.ghostCardType = {
    smallG : 5,//小王
    bigG : 6,//大王
    // lazarillo : 7,//赖子牌
}

//获取设备类型 config.device = null; //iOS  Android
config.setDevice = function(str){
    if(str.indexOf("iOS") != -1){
        config.device = "iOS";
    }else if(str.indexOf("Android") != -1){
        config.device = "Android";
    }else{
        config.device = "otherDevice";
    }
}

//版本号比较  “2.2.1” “2.0.4”
config.compareVersion = function(Version1,Version2){
    var blt = false;
    var temp = [100,10,1];
    var arr1 = Version1.split(".");
    var arr2 = Version2.split(".");
    var value1 = 0;
    var value2 = 0;
    var rate=0
    for(var i=0;i<arr1.length;i++){
        if(i>2){rate=1}else{rate=temp[i]}
        value1+=parseInt(arr1[i])*rate;
    }
    for(var i=0;i<arr2.length;i++){
        if(i>2){rate=1}else{rate=temp[i]}
        value2+=parseInt(arr2[i])*rate;
    }
    if(value1>value2){
        blt = true;
    }
    return blt;
}

//获取随机数
config.getRandom = function(index){
    index = Math.round(Math.random() * index);
    return index;
}

//数组降序排列
config.arrayDown = function(val1,val2){
    return val2-val1;
}
//数组升序排列
config.arrayUp = function(val1,val2){
    return val1-val2;
}
//截取数组的一部分
config.arraySub = function(index,count,arr,repeat){
    var newarr = [];
    for(var i = index;i<count;i++){
        for(var j=0;j<repeat;j++){
            newarr.push(arr[i]);
        }
    }
    return newarr;
}

config.seatPos = {
    center : {
        pokerScale : 1,//0.5
        disBetween : 77, //45
        disBetweenIX: 87,//iphoneX适配
        positionY : 250
    },
    left : {
        pokerScale : 0.38,
        disBetween : 27,
        positionY : 860
    },
    right : {
        pokerScale : 0.38,
        disBetween : 27,
        positionY : 860
    },
    
}

//牌型编号
config.CardType = {
	Single : 1,                         //单张
	Pair : 2,                           //对子
	ThreeOfKind : 3,                    //三不带
	ThreeOfKindPlusOne : 4,             //三带一
	ThreeOfKindPlusPair : 5,            //三带二
	Straight : 6,                       //顺子
	StraightDouble : 7,					//双顺  33 44 55
	StraightThree : 8,					//三顺  333 444    飞机  [333 444 555 a b c/ aa bb cc]
	StraightThreePlusSingle : 9,		//三顺+散牌 飞机带翅膀  333 444 5 6 / +一对
	StraightThreePlusPair : 10,			//三顺+对   飞机带翅膀  333 444 66 77
	SoftBomb : 87,						//软炸弹
	Bomb : 88,							//炸弹
	LazarilloBomb : 89,					//纯癞子炸弹
	DoubleKing : 99,					//双王
	FourPlusOne : 11,					//四带1, 四只带两只单牌
	FourPlusTwo : 12,					//四带2, 四只带两对
}

config.gameState = {
    ST_GAME_PREPARE        : 0, //准备
    ST_GAME_READY          : 1, //游戏准备好了
    ST_GAME_START          : 2, //游戏开始
    ST_GAME_SendCard       : 3, //发牌
    ST_GAME_CallLord       : 4, //叫地主
    ST_GAME_GrabLord       : 5, //抢地主
    ST_GAME_CallLordOver   : 6, //叫地主结束
    ST_GAME_Double         : 7, //加倍
    ST_GAME_OutCard        : 8, //出牌
    ST_GAME_BALANCE        : 9, //结算
    ST_GAME_WAIT_NEXTROUND : 10,  //等待下一轮
}

//微信配置信息、
config.wxInfo = {
    nickName:"",
    gender:1,//1男
    avatarUrl:"",
}
config.UpdateWxInfo = function(userInfo){
    config.wxInfo.nickName = userInfo.nickName;
    config.wxInfo.gender = userInfo.gender;
    config.wxInfo.avatarUrl = userInfo.avatarUrl;
}

config.GlobalRouter = {
    director : "https://ddzprotocal.51864.com/clientConfig/host.php", // host_inner
    statistics : "http://applog.51864.com/index.php",
    host : null,
    port : null,
    versionUrl : null,
    downloadUrl : null,
    filepath : null,
    resversion : null,//热更新版本号
    silenceVerUrl : null,//静默下载资源版本文件地址
    silenceFileUrl : null,//静默下载资源文件地址
    configtable : null,
}

config.GlobalRouterUpdate = function(json){
    config.GlobalRouter.host = json.data.host;
    config.GlobalRouter.port = json.data.port;
    config.GlobalRouter.versionUrl = json.data.update.versionUrl;
    config.GlobalRouter.downloadUrl = json.data.update.downloadUrl;
    config.GlobalRouter.resversion = json.data.update.resversion;
}

//房间配置
config.RoomConfig = {
    1:{name : "新手场",umengEvent : "novice_room" ,pot : 5, min : 1000, max : 80000, texture : "room_1.png", roomId : 1000, roomNameTexture : "p_novice_bar.png"},
    2:{name : "初级场",umengEvent : "primary_room" ,pot : 10, min : 2000, max : 200000, texture : "room_2.png", roomId : 1001, roomNameTexture : "p_primary_bar.png"},
    3:{name : "中级场",umengEvent : "intermediate_room" ,pot : 10, min : 2000, max : 200000, texture : "room_3.png", roomId : 1002, roomNameTexture : "p_intermediate_bar.png"},
    4:{name : "高级场",umengEvent : "senior_room" ,pot : 10, min : 2000, max : 200000, texture : "room_4.png", roomId : 1003, roomNameTexture : "p_senior_bar.png"},
    5:{name : "竞技场",umengEvent : "contest_room" ,pot : 10, min : 5000, max : 50000, texture : "room_JJC.png", roomId : 1004, roomNameTexture : "p_primary_arena_bar.png"},
    6:{name : "无限场",umengEvent : "advanced_room" ,pot : 50, min : 10000, max : 1000000, texture : "room_5.png", roomId : 1006, roomNameTexture : "p_advanced_bar.png"},

    7:{name : "新手场",umengEvent : "l_novice_room" ,pot : 50, min : 10000, max : 1000000, texture : "room_1.png", roomId : 1007, roomNameTexture : "p_novice_bar.png"},
    8:{name : "初级场",umengEvent : "l_primary_room" ,pot : 50, min : 10000, max : 1000000, texture : "room_2.png", roomId : 1008, roomNameTexture : "p_primary_bar.png"},
    9:{name : "中级场",umengEvent : "l_intermediate_room" ,pot : 50, min : 10000, max : 1000000, texture : "room_3.png", roomId : 1009, roomNameTexture : "p_intermediate_bar.png"},
    10:{name : "高级场",umengEvent : "l_senior_room" ,pot : 50, min : 10000, max : 1000000, texture : "room_4.png", roomId : 1010, roomNameTexture : "p_senior_bar.png"},
    11:{name : "无限场",umengEvent : "l_noRate_room" ,pot : 50, min : 10000, max : 1000000, texture : "room_5.png", roomId : 1011, roomNameTexture : "p_senior_bar.png"},
}

config.tableName = {
    1000:"新手场 底分10",
    1001:"初级场 底分60",
    1002:"中级场 底分200",
    1003:"高级场 底分500",
    
    1007:"新手场 底分10",
    1008:"初级场 底分40",
    1009:"中级场 底分150",
}

config.chatContent =
[
    "",
	"大家好,很高兴见到各位",
	"快点啊,等到花儿都谢了",
    "你的牌打的也太好了",
    "不要吵了不要吵了，专心玩游戏吧",
    "怎么又断线,网络怎么这么差啊",
    "不好意思,我要离开一会",
    "再见了,我会想念大家的",
];

config.chatSay = [
    "",
    "welcom",
    "kuaidiana",
    "nidepai",
    "buyaochao",
    "duanxian",
    "buyaozou",
    "zaijian",
];

config.parseNumber = function(number){
    if(typeof(number)=="string")
        number = parseInt(number);
    if(number >= 100000000){
        number = Math.floor(number / 100000000)
        number = ""+number+"亿";
    }else if(number >= 1000000){
        number = Math.floor(number / 10000)
        number = ""+number+"万";
    }else{
        number = ""+number;
    }
    return number;
}
config.parseString = function(string,index){
    var len = 4;
    if(index){
        len = index;
    }
    if(string&&string.length>len){
    }else{
        return string;
    }
    var str = string.substring(0,len);
    str = str+"...";
    // console.log(">>string:"+string);
    return str;
}

//根据自己的mySeatId和玩家SeatId 算出玩家位置
config.getPlayerSeatNum = function(mySeatId,curSeatId){
    var seatNum = 1;
    if(mySeatId == 0){
        if(curSeatId == 1){
            seatNum = 2
        }else if(curSeatId == 2){
            seatNum = 0
        }
    }else if(mySeatId == 1){ 
        if(curSeatId == 0){
            seatNum = 0
        }else if(curSeatId == 2){
            seatNum = 2
        }
    }else if(mySeatId == 2){
        if(curSeatId == 0){
            seatNum = 2
        }else if(curSeatId == 1){
            seatNum = 0
        }
    }
    return seatNum;
}

//分享文字
config.shareTxt = {
    "task":["【有乐开心斗地主】，点击就能和我一起玩！","只有10秒，炸还是不炸，交给你来决定！"],
    "share":["就差你了！帮我一下我就能拆礼包了~","【仅剩N人】麻烦你啦，点击帮我拆礼包吧！"],
    "jiuji":["【含泪求助】老铁们帮帮忙，小手一点助我拿豆！","小伙伴们帮帮忙，小手一点助我拿豆！"],
    "jipaiqi":["世界上最悲伤的事情是什么？","对3，我只剩一张牌啦！"],
    "lequan":["小手一抖，奖券到手，免费兑话费咯！","我在玩【有乐开心斗地主】，赢奖券兑话费！"],
    "chuntian":["对不起，牌好就是可以为所欲为！","又打出春天咯！你能超越我吗？"],
    "liansheng_3":["【有人@你】来和我比一比，看谁更厉害！","已经没有人可以阻止我的连胜了！"],
    "gaobei":["【有人@你】看我这一手高倍，就问你敢不敢来挑战！","没有什么事情是炸弹不能解决的，如果有，就王炸！"],
}
//分享图片
config.shareImg = {
    "task":"share1.png",
    "share":"share2.png",
    "jiuji":"share3.png",
    "jipaiqi":"share4.png",
    "lequan":"share5.png",
    "chuntian":"share6.png",
    "liansheng_3":"share7.png",
    "gaobei":"share8.png",
}
config.getShareImgPath = function(name){
    return config.imagePath() + config.shareImg[name];
}

config.imagePath = function () {
    return wx.env.USER_DATA_PATH + "/ddz_res/image/"; //用户目录图片路径
}
config.soundsPath = function () {
    return wx.env.USER_DATA_PATH + "/ddz_res/sounds/"; //用户目录音频路径
}

config.loadImage = function(imagnode,name){
    var path = cc.url.raw("resources/shareBig/" + name + ".png");
    if(typeof(wx)=="undefined"){
    }else{
        path = wx.env.USER_DATA_PATH + "/ddz_res/image/shareBig/" + name + ".png";
    }
    cc.loader.load(path,function(err, texture){
        imagnode.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
    });
}

module.exports = config;

