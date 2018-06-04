
var taskItemControl = require("taskItemControl");
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
        taskItem : {
            default : null,
            type : cc.Prefab
        },
    },
    start () {
        this.btnRight_1.enabled = false;

        var testItem=[1,1,1,1,2,2,3,3,3,3];

        var disBetween = 130;
        for(var i = 0;i < testItem.length;i++){
            var taskItem = cc.instantiate(this.taskItem);
            taskItem.parent = this.content;
            var task = taskItem.getComponent(taskItemControl);
            task.init(testItem[i],"标题","内容。。。。。。","1/10");
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
