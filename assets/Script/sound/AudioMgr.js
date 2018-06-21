var AppConfig = require("config");
cc.Class({
    extends: cc.Component,

    properties: {
        bgmVolume:1.0,
        sfxVolume:1.0,
        bgmAudioID:-1,
    },

    onLoad () {
        // this.playBGM("MusicEx_Welcome.mp3");
    },
    // use this for initialization
    init () {
        var t = cc.sys.localStorage.getItem("bgmVolume");
        if(t){
            this.bgmVolume = parseFloat(t);    
        }else{
            cc.sys.localStorage.setItem("bgmVolume",1);
        }
        
        var t2 = cc.sys.localStorage.getItem("sfxVolume");
        if(t2){
            this.sfxVolume = parseFloat(t2);    
        }else{
            cc.sys.localStorage.setItem("sfxVolume",1);
        }
        
        // cc.game.on(cc.game.EVENT_HIDE, function () {
        //     console.log("cc.audioEngine.pauseAll");
        //     cc.audioEngine.pauseAll();
        // });
        // cc.game.on(cc.game.EVENT_SHOW, function () {
        //     console.log("cc.audioEngine.resumeAll");
        //     cc.audioEngine.resumeAll();
        // });
    },

    getUrl(url){
        // return cc.url.raw("resources/sounds/" + url + ".mp3");
        if(typeof(wx)=="undefined"){
            return cc.url.raw("resources/sounds/" + url + ".mp3");
        }else{
            return wx.env.USER_DATA_PATH+"/sounds/" + url + ".mp3";
        }

        // return cc.url.raw("usr/sounds/" + url + ".mp3");
    },
    
    playBGM(url){
        var audioUrl = this.getUrl(url);
        console.log(audioUrl);
        if(this.bgmAudioID >= 0){
            cc.audioEngine.stop(this.bgmAudioID);
        }
        this.bgmAudioID = cc.audioEngine.play(audioUrl,true,this.bgmVolume);
    },
    
    playSFX(url){
        var audioUrl = this.getUrl(url);
        if(this.sfxVolume > 0){
            var audioId = cc.audioEngine.play(audioUrl,false,this.sfxVolume);    
        }
    },
    
    setSFXVolume(v){
        if(this.sfxVolume != v){
            cc.sys.localStorage.setItem("sfxVolume",v);
            this.sfxVolume = v;
        }
    },
    
    setBGMVolume(v,force){
        if(this.bgmAudioID >= 0){
            if(v > 0){
                cc.audioEngine.resume(this.bgmAudioID);
            }
            else{
                cc.audioEngine.pause(this.bgmAudioID);
            }
            //cc.audioEngine.setVolume(this.bgmAudioID,this.bgmVolume);
        }
        if(this.bgmVolume != v || force){
            cc.sys.localStorage.setItem("bgmVolume",v);
            this.bgmVolume = v;
            cc.audioEngine.setVolume(this.bgmAudioID,v);
        }
    },
    
    pauseAll(){
        cc.audioEngine.pauseAll();
    },
    
    resumeAll(){
        cc.audioEngine.resumeAll();
    },

    stopMusic(){
        cc.audioEngine.stopMusic();
    },

    stopAllEffects(){
        cc.audioEngine.stopAllEffects();
    },

    getCardValue(value){
        console.log(value);
        var str = "";
        if(value == "00"){
            str = "14";
        }else if(value == "01"){
            str = "15";
        }else{
            str = value.substring(1);
            if(str == "a"){
                str = "10";
            }else if(str == "b"){
                str = "11";
            }else if(str == "c"){
                str = "12";
            }else if(str == "d"){
                str = "13";
            }
        }
        return str;
    },
    //拍桌聊天声音
    playSay(gender,say){
        var index = 1;
        console.log("say1:"+say);
        for(var k in AppConfig.chatContent){
            var v = AppConfig.chatContent[k];
            if(v == say){
                index = k;
            }
        }
        var say = AppConfig.chatSay[index];
        if(gender == 1){
            say = "Man_"+say;
        }else{
            say = "Woman_"+say;
        }
        this.playSFX(say);
    },
    //打牌时报牌的声音
    playCardsEffect(gender, cardtype, cards){
        if(gender == 1){
            if (cardtype == "mingpai"){
                this.playSFX("Man_Share");
                this.playSFX("Special_Multiply");
            }else if(cardtype == "jiaodizhu"){
                this.playSFX("Man_Order");
            }else if(cardtype == "bujiao"){
                this.playSFX("Man_NoOrder");
            }else if(cardtype == "qiangdizhu"){
                this.playSFX("Man_Rob1");
            }else if(cardtype == "buqiang"){
                this.playSFX("Man_NoRob");
            }else if(cardtype == "buyao"){
                this.playSFX("Man_buyao1");
            }else if(cardtype == "baojing1"){
                this.playSFX("Man_baojing1");
                this.playSFX("Special_alert");
            }else if(cardtype == "baojing2"){
                this.playSFX("Man_baojing2");
                this.playSFX("Special_alert");
            }else if(cardtype == "dani"){
                this.playSFX("Man_dani1");
            }else if(cardtype == "jiabei"){
                this.playSFX("Man_jiabei");
            }else if(cardtype == AppConfig.CardType.Single){
                var value = cards[0];
                var str = this.getCardValue(value);
                this.playSFX("Man_"+str);
                this.playSFX("Special_give");
            }else if(cardtype == AppConfig.CardType.Pair){
                var value = cards[0];
                var str = this.getCardValue(value);
                this.playSFX("Man_dui"+str);
                this.playSFX("Special_give");
            }else if(cardtype == AppConfig.CardType.ThreeOfKind){
                var value = cards[0];
                var str = this.getCardValue(value);
                this.playSFX("Man_tuple"+str);
                this.playSFX("Special_give");
            }else if(cardtype == AppConfig.CardType.ThreeOfKindPlusOne){
                this.playSFX("Man_sandaiyi");
                this.playSFX("Special_give");
            }else if(cardtype == AppConfig.CardType.ThreeOfKindPlusPair){
                this.playSFX("Man_sandaiyidui");
                this.playSFX("Special_give");
            }else if(cardtype == AppConfig.CardType.Straight){
                this.playSFX("Man_shunzi");
                this.playSFX("Special_star");
            }else if(cardtype == AppConfig.CardType.StraightDouble){
                this.playSFX("Man_liandui");
                this.playSFX("Special_star");
            }else if(cardtype == AppConfig.CardType.StraightThree){
                this.playSFX("Man_feiji");
                this.playSFX("Special_plane");
            }else if(cardtype == AppConfig.CardType.StraightThreePlusSingle){
                this.playSFX("Man_feiji");
                this.playSFX("Special_plane");
            }else if(cardtype == AppConfig.CardType.StraightThreePlusPair){
                this.playSFX("Man_feiji");
                this.playSFX("Special_plane");
            }else if(cardtype == AppConfig.CardType.FourPlusOne){
                this.playSFX("Man_sidaier");
                this.playSFX("Special_give");
            }else if(cardtype == AppConfig.CardType.FourPlusTwo){
                this.playSFX("Man_sidailiangdui");
                this.playSFX("Special_give");
            }else if(cardtype == AppConfig.CardType.Bomb){
                this.playSFX("Man_zhadan");
                this.playSFX("Special_Bomb");
                this.playBGM("MusicEx_Exciting");
            }else if(cardtype == AppConfig.CardType.DoubleKing){
                this.playSFX("Man_wangzha");
                this.playSFX("Rocket");
                this.playBGM("MusicEx_Exciting");
            }
        }else{///////
            if (cardtype == "mingpai"){
                this.playSFX("Woman_Share");
                this.playSFX("Special_Multiply");
            }else if(cardtype == "jiaodizhu"){
                this.playSFX("Woman_Order");
            }else if(cardtype == "bujiao"){
                this.playSFX("Woman_NoOrder");
            }else if(cardtype == "qiangdizhu"){
                this.playSFX("Woman_Rob1");
            }else if(cardtype == "buqiang"){
                this.playSFX("Woman_NoRob");
            }else if(cardtype == "buyao"){
                this.playSFX("Woman_buyao1");
            }else if(cardtype == "baojing1"){
                this.playSFX("Woman_baojing1");
                this.playSFX("Special_alert");
            }else if(cardtype == "baojing2"){
                this.playSFX("Woman_baojing2");
                this.playSFX("Special_alert");
            }else if(cardtype == "dani"){
                this.playSFX("Woman_dani1");
            }else if(cardtype == "jiabei"){
                this.playSFX("Woman_jiabei");
            }else if(cardtype == AppConfig.CardType.Single){
                var value = cards[0];
                var str = this.getCardValue(value);
                this.playSFX("Woman_"+str);
                this.playSFX("Special_give");
            }else if(cardtype == AppConfig.CardType.Pair){
                var value = cards[0];
                var str = this.getCardValue(value);
                this.playSFX("Woman_dui"+str);
                this.playSFX("Special_give");
            }else if(cardtype == AppConfig.CardType.ThreeOfKind){
                var value = cards[0];
                var str = this.getCardValue(value);
                this.playSFX("Woman_tuple"+str);
                this.playSFX("Special_give");
            }else if(cardtype == AppConfig.CardType.ThreeOfKindPlusOne){
                this.playSFX("Woman_sandaiyi");
                this.playSFX("Special_give");
            }else if(cardtype == AppConfig.CardType.ThreeOfKindPlusPair){
                this.playSFX("Woman_sandaiyidui");
                this.playSFX("Special_give");
            }else if(cardtype == AppConfig.CardType.Straight){
                this.playSFX("Woman_shunzi");
                this.playSFX("Special_star");
            }else if(cardtype == AppConfig.CardType.StraightDouble){
                this.playSFX("Woman_liandui");
                this.playSFX("Special_star");
            }else if(cardtype == AppConfig.CardType.StraightThree){
                this.playSFX("Woman_feiji");
                this.playSFX("Special_plane");
            }else if(cardtype == AppConfig.CardType.StraightThreePlusSingle){
                this.playSFX("Woman_feiji");
                this.playSFX("Special_plane");
            }else if(cardtype == AppConfig.CardType.StraightThreePlusPair){
                this.playSFX("Woman_feiji");
                this.playSFX("Special_plane");
            }else if(cardtype == AppConfig.CardType.FourPlusOne){
                this.playSFX("Woman_sidaier");
                this.playSFX("Special_give");
            }else if(cardtype == AppConfig.CardType.FourPlusTwo){
                this.playSFX("Woman_sidailiangdui");
                this.playSFX("Special_give");
            }else if(cardtype == AppConfig.CardType.Bomb){
                this.playSFX("Woman_zhadan");
                this.playSFX("Special_Bomb");
                this.playBGM("MusicEx_Exciting");
            }else if(cardtype == AppConfig.CardType.DoubleKing){
                this.playSFX("Woman_wangzha");
                this.playSFX("Rocket");
                this.playBGM("MusicEx_Exciting");
            }
        }
    }
	
});
