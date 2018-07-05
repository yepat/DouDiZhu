var config = require("config");
var dialogManager = require("dialogManager");
cc.Class({
    extends: cc.Component,

    properties: {
        hallLayer : {
            default : null,
            type : cc.Node
        },
        roomLayer : {
            default : null,
            type : cc.Node
        }
    },
    onLoad () {
        cc.game.on(cc.game.EVENT_HIDE, function(){
            console.log("游戏进入后台");   
            // config.stopOnMassage = true;  
            cc.vv.audioMgr.stopMusic();
        },this);
        cc.game.on(cc.game.EVENT_SHOW, function(){
            console.log("重新返回游戏");
            cc.vv.audioMgr.playBGM("MusicEx_Welcome");
        },this);

        cc.vv.audioMgr.playBGM("MusicEx_Welcome");

        // this.loadSubpackage();
    },
    start () {
       this.hallLayer.active = true;
       this.roomLayer.active = false;
    },
    btnRoom1Click(){
        console.log("欢乐场")
        config.curRoomModelId = config.ModelId.normal;
        this.hallLayer.active = false;
        this.roomLayer.active = true;
        cc.vv.audioMgr.playSFX("SpecOk");
    },
    btnRoom2Click(){
        console.log("赖子场")
        // config.curRoomModelId = config.ModelId.lazarillo;
        // this.hallLayer.active = false;
        // this.roomLayer.active = true;
        dialogManager.showCommonDialog("温馨提示","赖子场暂未开放！",null,null);
        cc.vv.audioMgr.playSFX("SpecOk");
    },
    roomBackHall(){
        console.log("反回大厅")
        this.hallLayer.active = true;
        this.roomLayer.active = false;
        cc.vv.audioMgr.playSFX("SpecOk");
    },
    loadSubpackage(){
        if(typeof(wx)=="undefined"){return;}

        if (wx.loadSubpackage) {
        }else{
            console.log("没有分包加载这个接口");
            return;
        }

        var loadTask = wx.loadSubpackage({
            name: 'stage1', // name 可以填 name 或者 root
            success: function(res) {
              // 分包加载成功后通过 success 回调
              console.log("分包加载成功",res);
            },
            fail: function(res) {
              // 分包加载失败通过 fail 回调
              console.log("分包加载失败",res);
            }
          })
          
          loadTask.onProgressUpdate(res => {
            console.log('下载进度', res.progress)
            console.log('已经下载的数据长度', res.totalBytesWritten)
            console.log('预期需要下载的数据总长度', res.totalBytesExpectedToWrite)
          })
    }
});
