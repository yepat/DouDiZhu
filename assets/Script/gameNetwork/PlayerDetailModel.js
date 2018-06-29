
var config = require("config");

var PlayerDetailModel = {};

PlayerDetailModel.nickname = "";            // 昵称
PlayerDetailModel.uid = 0;					//用户ID
PlayerDetailModel.coin = 0;				    //coin 筹码数
PlayerDetailModel.gold = 0;				    //金币数
PlayerDetailModel.gender = 1;				//性别 1=男(默认) 2=女
PlayerDetailModel.word = "";				//签名
PlayerDetailModel.coolnum = "";			    //靓号
PlayerDetailModel.level = 0;				//等级
PlayerDetailModel.matches = 0;				//游戏的场次
PlayerDetailModel.win = 0;					//胜利的场次
PlayerDetailModel.checkCode = "";			//微信校验码
PlayerDetailModel.propDress = {};			//玩家服装
PlayerDetailModel.score = 0;                //竞技场游戏币数

PlayerDetailModel.verfile = 0;				//素材更新版本号
PlayerDetailModel.vertips = 0;				//滚动数据更新版本号
PlayerDetailModel.mailUnread = 0;			//未读邮件数

PlayerDetailModel.taskUnReward = 0;			    //未领取任务数
PlayerDetailModel.shareUnReward = 0;			    //未领取分享数

PlayerDetailModel.coupon = 0;				//乐劵
PlayerDetailModel.age = 0;					//年龄
PlayerDetailModel.room = {};			    //房间显示列表
PlayerDetailModel.contact = "";			    //官方联系右下角
PlayerDetailModel.contacts = "";			//官方联系-帮助
PlayerDetailModel.wechat = "";			    //官方联系-微信

PlayerDetailModel.lottery = 0;			    //用户抽奖数
PlayerDetailModel.checkinUndo = 0;			//0不可签到, 1可以签到
PlayerDetailModel.task1Unaward = 0;		    //可领奖的每日任务数
PlayerDetailModel.task2Unaward = 0;		    //可领奖的成长任务数
PlayerDetailModel.chargeRate = 0;			//充值奖励利率
PlayerDetailModel.propItems = {};			//拥有的道具

PlayerDetailModel.rewardList = {};			//再打几局可以获得的奖励

PlayerDetailModel.isDev = 0;				//判断支付模式:0//正常服,1//测试服

PlayerDetailModel.wechatImg = "";			//微信头像
PlayerDetailModel.title = "";			    //称号

PlayerDetailModel.jpqData = "";			    //记牌器数据

PlayerDetailModel.continueRoomId = 0;	    //短线重连房间id



PlayerDetailModel.getJpqData = function(){
    return PlayerDetailModel.jpqData;
}
PlayerDetailModel.setJpqData = function(jpqData){
    PlayerDetailModel.jpqData = jpqData;
}

PlayerDetailModel.getNickName = function(){
    return PlayerDetailModel.nickname;
}
PlayerDetailModel.setNickName = function(name){
    PlayerDetailModel.nickname = name;
}

PlayerDetailModel.getUid = function(){
    return PlayerDetailModel.uid;
}
PlayerDetailModel.setUid = function(uid){
    PlayerDetailModel.uid = uid;
}

PlayerDetailModel.getCoin = function(){
    return PlayerDetailModel.coin;
}
PlayerDetailModel.setCoin = function(coin){
    PlayerDetailModel.coin = coin;
}

PlayerDetailModel.getGold = function(){
    return PlayerDetailModel.gold;
}
PlayerDetailModel.setGold = function(gold){
    PlayerDetailModel.gold = gold;
}

PlayerDetailModel.getGender = function(){
    return PlayerDetailModel.gender;
}
PlayerDetailModel.setGender = function(gender){
    PlayerDetailModel.gender = gender;
}

PlayerDetailModel.getSign = function(){
    return PlayerDetailModel.word;
}
PlayerDetailModel.setSign = function(word){
    PlayerDetailModel.word = word;
}

PlayerDetailModel.getCoolNum = function(){
    return PlayerDetailModel.coolnum;
}
PlayerDetailModel.setCoolNum = function(coolnum){
    PlayerDetailModel.coolnum = coolnum;
}

PlayerDetailModel.getLevel = function(){
    return PlayerDetailModel.level;
}
PlayerDetailModel.setLevel = function(level){
    PlayerDetailModel.level = level;
}

PlayerDetailModel.getMatches = function(){
    return PlayerDetailModel.matches;
}
PlayerDetailModel.setMatches = function(matches){
    PlayerDetailModel.matches = matches;
}

PlayerDetailModel.getWin = function(){
    return PlayerDetailModel.win;
}
PlayerDetailModel.setWin = function(win){
    PlayerDetailModel.win = win;
}

PlayerDetailModel.getCheckCode = function(){
    return PlayerDetailModel.checkCode;
}
PlayerDetailModel.setCheckCode = function(checkCode){
    PlayerDetailModel.checkCode = checkCode;
}

PlayerDetailModel.getPropDress = function(){
    return PlayerDetailModel.propDress;
}
PlayerDetailModel.setPropDress = function(propDress){
    PlayerDetailModel.propDress = propDress;
}

PlayerDetailModel.getScore = function(){
    return PlayerDetailModel.score;
}
PlayerDetailModel.setScore = function(score){
    PlayerDetailModel.score = score;
}

PlayerDetailModel.getVerfile = function(){
    return PlayerDetailModel.verfile;
}
PlayerDetailModel.setVerfile = function(verfile){
    PlayerDetailModel.verfile = verfile;
}

PlayerDetailModel.getVertips = function(){
    return PlayerDetailModel.vertips;
}
PlayerDetailModel.setVertips = function(vertips){
    PlayerDetailModel.vertips = vertips;
}

PlayerDetailModel.getMailUnread = function(){
    return PlayerDetailModel.mailUnread;
}
PlayerDetailModel.setMailUnread = function(mailUnread){
    PlayerDetailModel.mailUnread = mailUnread;
}

//未领取任务数
PlayerDetailModel.getTaskUnReward = function(){
    return PlayerDetailModel.taskUnReward;
}
PlayerDetailModel.setTaskUnReward = function(taskUnReward){
    PlayerDetailModel.taskUnReward = taskUnReward;
}
//未领取分享数
PlayerDetailModel.getShareUnReward = function(){
    return PlayerDetailModel.shareUnReward;
}
PlayerDetailModel.setShareUnReward = function(shareUnReward){
    PlayerDetailModel.shareUnReward = shareUnReward;
}

PlayerDetailModel.getCoupon = function(){
    return PlayerDetailModel.coupon;
}
PlayerDetailModel.setCoupon = function(coupon){
    PlayerDetailModel.coupon = coupon;
}

PlayerDetailModel.getAge = function(){
    return PlayerDetailModel.age;
}
PlayerDetailModel.setAge = function(age){
    PlayerDetailModel.age = age;
}

PlayerDetailModel.getRoom = function(){
    return PlayerDetailModel.room;
}
PlayerDetailModel.setRoom = function(room){
    PlayerDetailModel.room = room;
}
PlayerDetailModel.getRoomByModel = function(modelId){
    var zrooms = {};
    for(var k in PlayerDetailModel.room){
        var v = PlayerDetailModel.room[k];
        if(modelId == v.modelId){
            return v.rooms;
        }else{

        }
    }
    return zrooms;
}

PlayerDetailModel.getContact = function(){
    return PlayerDetailModel.contact;
}
PlayerDetailModel.setContact = function(contact){
    PlayerDetailModel.contact = contact;
}

PlayerDetailModel.getContacts = function(){
    return PlayerDetailModel.contacts;
}
PlayerDetailModel.setContacts = function(contacts){
    PlayerDetailModel.contacts = contacts;
}

PlayerDetailModel.getWechat = function(){
    return PlayerDetailModel.wechat;
}
PlayerDetailModel.getWechat = function(wechat){
    PlayerDetailModel.wechat = wechat;
}

PlayerDetailModel.getLottery = function(){
    return PlayerDetailModel.lottery;
}
PlayerDetailModel.setLottery = function(lottery){
    PlayerDetailModel.lottery = lottery;
}

PlayerDetailModel.getCheckinUndo = function(){
    return PlayerDetailModel.checkinUndo;
}
PlayerDetailModel.setCheckinUndo = function(checkinUndo){
    PlayerDetailModel.checkinUndo = checkinUndo;
}

PlayerDetailModel.getTask1Unaward = function(){
    return PlayerDetailModel.task1Unaward;
}
PlayerDetailModel.setTask1Unaward = function(task1Unaward){
    PlayerDetailModel.task1Unaward = task1Unaward;
}

PlayerDetailModel.getTask2Unaward = function(){
    return PlayerDetailModel.task2Unaward;
}
PlayerDetailModel.setTask2Unaward = function(task2Unaward){
    PlayerDetailModel.task2Unaward = task2Unaward;
}

PlayerDetailModel.getChargeRate = function(){
    return PlayerDetailModel.chargeRate;
}
PlayerDetailModel.setChargeRate = function(chargeRate){
    PlayerDetailModel.chargeRate = chargeRate;
}

PlayerDetailModel.getPropItems = function(){
    return PlayerDetailModel.propItems;
}
PlayerDetailModel.setPropItems = function(propItems){
    PlayerDetailModel.propItems = propItems;
}

PlayerDetailModel.getIsDev = function(){
    return PlayerDetailModel.isDev;
}
PlayerDetailModel.setIsDev = function(isDev){
    PlayerDetailModel.isDev = isDev;
}

PlayerDetailModel.getRewardList = function(){
    return PlayerDetailModel.rewardList;
}
PlayerDetailModel.setRewardList = function(rewardList){
    PlayerDetailModel.rewardList = rewardList;
}

PlayerDetailModel.getWechatImg = function(){
    return PlayerDetailModel.wechatImg;
}
PlayerDetailModel.setWechatImg = function(wechatImg){
    PlayerDetailModel.wechatImg = wechatImg;
}

PlayerDetailModel.getTitle = function(){
    return PlayerDetailModel.title;
}
PlayerDetailModel.setTitle = function(title){
    PlayerDetailModel.title = title;
}

module.exports = PlayerDetailModel;
