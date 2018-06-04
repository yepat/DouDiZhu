
var emailItemControl = require("emailItemControl");
cc.Class({
    extends: cc.Component,

    properties: {
        btnLeft_1 : {
            default : null,
            type : cc.Sprite
        },
        btnLeft_2 : {
            default : null,
            type : cc.Sprite
        },
        btnRight_1 : {
            default : null,
            type : cc.Sprite
        },
        btnRight_2 : {
            default : null,
            type : cc.Sprite
        },
        content : {
            default : null,
            type : cc.Node
        },
        emailItem : {
            default : null,
            type : cc.Prefab
        },
    },
    start () {
        this.btnRight_1.enabled = false;

        var testItem=[1,1,1,1,2,2,2,2,2,2];

        var disBetween = 130;
        for(var i = 0;i < testItem.length;i++){
            var emailItem = cc.instantiate(this.emailItem);
            emailItem.parent = this.content;
            var task = emailItem.getComponent(emailItemControl);
            task.init(testItem[i],i,"标题"+i,"内容111。。。","2018-05-28 08:36");
        }
        this.content.height = disBetween*testItem.length;
    },   
    closeClick(){
        console.log("close click");
        this.node.destroy();
    },
    leftClick(){
        console.log("left click");
        this.btnLeft_1.enabled = true;
        this.btnRight_1.enabled = false;
    },
    rightClick(){
        console.log("right click");
        this.btnLeft_1.enabled = false;
        this.btnRight_1.enabled = true; 
    }
});
