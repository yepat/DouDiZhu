
var Protocol = require("Protocol");

var GameNetMgr = cc.Class({
    extends: cc.Component,
    statics: {
        opPlayerSeatId:"",
        sendRequest(cmdName,eventName,arg){
            if(cmdName == "Game"){
                if(eventName == "loginRoom"){
                    this.sendLoginRoom(arg);
                }else if(eventName == "startGame"){
                    this.sendStartGame(arg);
                }else if(eventName == "callLord"){
                    this.sendCallLord(arg);
                }else if(eventName == "grabLord"){
                    this.sendGrabLord(arg);
                }else if(eventName == "showCard"){
                    this.sendShowCard(arg);
                }else if(eventName == "giveupSendCard"){
                    this.sendGiveupSendCard(arg);
                }else if(eventName == "sendCard"){
                    this.sendSendCard(arg);
                }else if(eventName == "requestDelegate"){
                    this.sendRequestDelegate(arg);
                }else if(eventName == "cancelDelegate"){
                    this.sendCancelDelegate(arg);
                }else if(eventName == "addRatio"){
                    this.sendAddRatio(arg);
                }else if(eventName == "exitRoom"){
                    this.sendExitRoom();
                }else if(eventName == "sayToTable"){
                    this.sendSayToTable(arg);
                }else if(eventName == "openRechargeTip"){
                    this.sendOpenRechargeTip();
                }else if(eventName == "openReliefTip"){
                    this.sendOpenReliefTip();
                }else if(eventName == "reconnection"){
                    this.sendReconnection();
                }else if(eventName == "emoticon"){
                    this.sendEmoticon(arg);
                }
            }
            //系统
            if(cmdName == "System"){
                if(eventName == "Mail"){//邮箱
                    this.sendMail();
                }else if(eventName == "ReadMail"){//标记邮件已读
                    this.sendReadMail(arg);
                }
                else if(eventName == "GetMailAttachment"){//领取邮件附件
                    this.sendGetMailAttachment(arg);
                }
                else if(eventName == "DelMail"){//删除某个邮件
                    this.sendDelMail(arg);
                }else if(eventName == "TaskDaily"){//每日任务
                    this.sendTaskDaily();
                }else if(eventName == "GetTaskReward"){//领取任务奖励
                    this.sendGetTaskReward(arg);
                }else if(eventName == "ShareInfo"){//分享信息
                    this.sendShareInfo();
                }else if(eventName == "ShareGet"){//分享领取
                    this.sendShareGet();
                }else if(eventName == "ShareWxRes"){//微信分享成功发送
                    this.sendShareWxRes(arg);
                }

            }
        },
        sendLoginRoom(arg){
            var params = {};
            params.t = Protocol.Request.Game.Init;
            params.roomId = parseInt(arg.roomId);
            params.isContinue = parseInt(arg.isContinue);
            params.modelId = arg.modelId;
            cc.vv.net.send("loginRoom",Protocol.Command.Game,params);
        },
        sendStartGame(arg){
            var params = {};
            params.t = Protocol.Request.Game.Go;
            if(arg){
                params.showcard = true;
            }
            this.opPlayerSeatId = "-1";
            cc.vv.net.send("startGame",Protocol.Command.Game,params);
        },
        sendCallLord(arg){
            var params = {};
            var num = arg;  // 1=叫地主 2=不叫地主
            params.t = Protocol.Request.Game.CallLord;
            params.doLord = num;
            cc.vv.net.send("callLord",Protocol.Command.Game,params);
        },
        sendGrabLord(arg){
            var params = {};
            var num = arg;  // 1=抢地主 2=不抢地主
            params.t = Protocol.Request.Game.GrabLord;
            params.grabLord = num;
            cc.vv.net.send("grabLord",Protocol.Command.Game,params);
        },
        sendShowCard(rate){
            if(rate>2){
            }else{
                rate = 2;
            }
            var params = {};
            params.t = Protocol.Request.Game.ShowCard;
            params.showRate = rate;
            cc.vv.net.send("showCard",Protocol.Command.Game,params);
        },
        sendGiveupSendCard(){
            var params = {};
            params.t = Protocol.Request.Game.NotFollow;
            cc.vv.net.send("giveupSendCard",Protocol.Command.Game,params);
        },
        sendSendCard(args){
            var params = {};
            params.t = Protocol.Request.Game.SendCard;
            if (typeof(args[0]) == "object"){
                params.sendCards = args[0];
                params.jokto = args[1];
            }else{
                params.sendCards = args;
            }
            cc.vv.net.send("sendCard",Protocol.Command.Game,params);
        },
        sendRequestDelegate(){
            var params = {};
            params.t = Protocol.Request.Game.RequestDelegate;
            cc.vv.net.send("requestDelegate",Protocol.Command.Game,params);
        },
        sendCancelDelegate(){
            var params = {};
            params.t = Protocol.Request.Game.CancelDelegate;
            cc.vv.net.send("cancelDelegate",Protocol.Command.Game,params);
        },
        //--加倍
        sendAddRatio(){
            var params = {};
            params.t = Protocol.Request.Game.AddRatio;
            cc.vv.net.send("addRatio",Protocol.Command.Game,params);
        },
        //退出
        sendExitRoom(){
            var params = {};
            params.t = Protocol.Request.Game.ExitRoom;
            cc.vv.net.send("exitRoom",Protocol.Command.Game,params);
        },
        //牌桌里发语言
        sendSayToTable(arg){
            var params = {};
            params.t = Protocol.Request.Game.SayToTable;
            params.wordId = arg.id;
            params.word = arg.word;
            cc.vv.net.send("sayToTable",Protocol.Command.Game,params);
        },
        //打开救济面板
        sendOpenRechargeTip(){
            var params = {};
            params.t = Protocol.Request.Game.OpenRechargeTip;
            cc.vv.net.send("openRechargeTip",Protocol.Command.Game,params);
        },
        //执行拉霸操作(领救济)
        sendOpenReliefTip(){
            var params = {};
            params.t = Protocol.Request.Game.OpenReliefTip;
            cc.vv.net.send("openReliefTip",Protocol.Command.Game,params);
        },
        //发送短线重连
        sendReconnection(){
            var params = {};
            params.t = Protocol.Request.Game.Reconnection;
            cc.vv.net.send("reconnection",Protocol.Command.Game,params);
        },
        //发送表情包
        sendEmoticon(arg){
            var params = {};
            params.t = Protocol.Request.Game.Emoticon;
            params.emoticonData = arg;
            cc.vv.net.send("emoticon",Protocol.Command.Game,params);
        },



        //大厅-------
        sendMail(){//邮箱
            var params = {};
            params.t = Protocol.Request.System.Mail;
            cc.vv.net.send("Mail",Protocol.Command.System,params);
        },
        sendReadMail(arg){//标记邮件已读
            var params = {};
            params.t = Protocol.Request.System.ReadMail;
            params.id = arg;
            cc.vv.net.send("Mail",Protocol.Command.System,params);
        },
        sendGetMailAttachment(arg){//领取邮件附件
            var params = {};
            params.t = Protocol.Request.System.GetMailAttachment;
            params.id = arg;
            cc.vv.net.send("Mail",Protocol.Command.System,params);
        },
        sendDelMail(arg){//删除某个邮件
            var params = {};
            params.t = Protocol.Request.System.DelMail;
            params.id = arg;
            cc.vv.net.send("Mail",Protocol.Command.System,params);
        },
        sendTaskDaily(){ //每日任务
            var params = {};
            params.t = Protocol.Request.System.TaskDaily;
            cc.vv.net.send("TaskDaily",Protocol.Command.System,params);
        },
        sendGetTaskReward(arg){//领取任务奖励
            var params = {};
            params.t = Protocol.Request.System.GetTaskReward;
            params.id = arg;
            cc.vv.net.send("GetTaskReward",Protocol.Command.System,params);
        },
        sendShareInfo(){
            var params = {};
            params.t = Protocol.Request.System.ShareInfo;
            cc.vv.net.send("ShareInfo",Protocol.Command.System,params);
        },
        sendShareGet(){
            var params = {};
            params.t = Protocol.Request.System.ShareGet;
            cc.vv.net.send("ShareGet",Protocol.Command.System,params);
        },
        sendShareWxRes(arg){ //type 1系统自动分享 2邀请好友分享  3救济分享 4记牌器分享 5春天分享
            var params = {};
            params.t = Protocol.Request.System.ShareWxRes;
            params.type = arg;
            cc.vv.net.send("ShareWxRes",Protocol.Command.System,params);
        }


    

    },
});