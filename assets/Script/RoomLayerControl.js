
var config = require("config");
var EventHelper = require("EventHelper");
var PlayerDetailModel = require("PlayerDetailModel");

cc.Class({
    extends: cc.Component,

    properties: {
        headImg : {
            default : null,
            type : cc.Sprite
        },
        playerName : {
            default : null,
            type : cc.Label
        },
        playerLevel : {
            default : null,
            type : cc.Label
        },
        playerLedou : {
            default : null,
            type : cc.Label
        },
        playerLeQuan : {
            default : null,
            type : cc.Label
        },
        room1 : {
            default : null,
            type : cc.Node
        },
        room2 : {
            default : null,
            type : cc.Node
        },
        room3 : {
            default : null,
            type : cc.Node
        },
        room4 : {
            default : null,
            type : cc.Node
        },
        
    },
    // onLoad () {},
    start () {
        var self = this;
        // EventHelper.AddCustomEvent(config.MyNode,"EnterHallOK",function(event){
            self.setHeadUrl("");
            self.setNickName(PlayerDetailModel.getNickName());
            self.setLevel(PlayerDetailModel.getTitle());
            self.setLeDou(PlayerDetailModel.getCoin());
            self.setLuQuan(PlayerDetailModel.getCoupon());
        // });

        this.initRoomInfo();
    },
    initRoomInfo(){
        console.log(">>>initRoomInfo");

        var roomInfos = [];
        for(var i=0;i<4;i++){
            var index = i+1;
            var name = "p_room_"+index;
            var strPeopleNum = "Canvas/happyroom/rooms/"+name+"/lab_peopleNum";
            var strCoins = "Canvas/happyroom/rooms/"+name+"/lab_coins";

            var lab_peopleNum =  cc.find(strPeopleNum).getComponent(cc.Label);
            var lab_coins =  cc.find(strCoins).getComponent(cc.Label);
            var item = {
                peopleNum:lab_peopleNum,
                coins:lab_coins
            }
            roomInfos.push(item);
        }

        var roomType_ = [];
        var rooms = PlayerDetailModel.getRoom();
        for(var k in rooms){
            var v = rooms[k];
            if(v.modelId == config.ModelId.normal){
                roomType_ =  v.rooms;
            }
        }
        console.log(roomType_);

        for(var i = 0;i<roomType_.length;i++){
            roomInfos[i].peopleNum.string = ""+this.pepleNumAdd(roomType_[i]["onlineNum"]);
            var str_enter = roomType_[i]["enter"].replace("乐豆", "");
            roomInfos[i].coins.string = str_enter;
        }
    },
    setHeadUrl(url){
        var self = this;
         //设置微信头像
         var imgUrl="http://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLSO7sOWsNicYdNM3MbNGGo58zticxgqoO2aqS7zOCVClXl7WExa4KNQ48uSTSszicsyspzsDQ51M4EQ/132";
         imgUrl = imgUrl + "?aa=aa.jpg";
         cc.loader.load(imgUrl, function(err, texture){
             self.headImg.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
         });
    },
    setNickName(name){
         //修改昵称
         this.playerName.string = name;
    },
    setLevel(lv){
        //修改等级
        this.playerLevel.string = lv;
    },
    setLeDou(number){
        //修改乐豆数
        if(number >= 10000000){
            number = Math.floor(number / 10000)
            this.playerLedou.string = ""+number+"万";
        }else{
            this.playerLedou.string = ""+number;
        }
    },
    setLuQuan(number){
        //修改乐券数
        if(number >= 10000000){
            number = Math.floor(number / 10000)
            this.playerLeQuan.string = ""+number+"万";
        }else{
            this.playerLeQuan.string = ""+number;
        }
    },
    room1Click(){
        console.log("room1Click");
        cc.director.loadScene("GameScene");
    },
    room2Click(){
        console.log("room2Click");
        cc.director.loadScene("GameScene");
    },
    room3Click(){
        console.log("room3Click");
        cc.director.loadScene("GameScene");
    },
    room4Click(){
        console.log("room4Click");
        cc.director.loadScene("GameScene");
    },
    quickStartClick(){
        console.log("quickStartClick");
        cc.director.loadScene("GameScene");
    },
    pepleNumAdd(str){
        var curNum = str;
        if(typeof(str) == "string")
            curNum = parseInt(str);
        var endNum = 0
        if (curNum <= 60){
            endNum = curNum + 60;
        }else if(curNum > 60 && curNum <=200){
            endNum = curNum + 200;
        }else if(curNum > 200 && curNum <=500){
            endNum = curNum + 1000;
        }else{
            endNum = curNum + 3000;
        }
           
        return endNum;
    }
    // update (dt) {},
});
