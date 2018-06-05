
var commonControl = require("commonControl");


var dialogManager = cc.Class({
    extends: cc.Component,
    statics: {
        showDialog(prefabUrl,mControl,args){
            cc.loader.loadRes(prefabUrl, function (err, prefab) {
                if (err) {
                    console.log(err);
                    return;
                }
                var newNode = cc.instantiate(prefab);
                cc.director.getScene().addChild(newNode);
                if(mControl)
                    newNode.getComponent(mControl).show(args);
            });
        },
        showCommonDialog(title,content,enterClick,cancelClick){
            var args = {};
            args.arg1 = title;
            args.arg2 = content;
            args.arg3 = enterClick;
            args.arg4 = cancelClick;
            this.showDialog("prefab/commonDialog",commonControl,args);
        },
        showBagDialog(){
            this.showDialog("prefab/bagDialog");
        },
        showEmailDialog(){
            this.showDialog("prefab/emailDialog");
        },
        showExchangeDialog(){
            this.showDialog("prefab/exchangeDialog");
        },
        showFanKuiDialog(){
            this.showDialog("prefab/fankuiDialog");
        },
        showGameResultDialog(isWin){
            if(isWin){
                this.showDialog("prefab/gameResultWin");
            }else{
                this.showDialog("prefab/gameResultLose");
            }   
        }, 
        showSetDialog(){
            this.showDialog("prefab/setDialog");
        }, 
        showTaskDialog(){
            this.showDialog("prefab/taskDialog");
        }, 
        showJpqNode(){
            this.showDialog("prefab/jpqNode");
        },


        //牌桌操作界面
        showOpratCallLord(){
            this.showDialog("prefab/opratCallLord");
        },
        showOpratDouble(){
            this.showDialog("prefab/opratDouble");
        },
        showOpratOutCard(){
            this.showDialog("prefab/opratOutCard");
        },
        showOpratShowCard(){
            this.showDialog("prefab/opratShowCard");
        },
        showCancelDelegate(){
            this.showDialog("prefab/CancelDelegate");
        },
    },
});
