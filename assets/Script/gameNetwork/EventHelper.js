
var config = require("config");
var EventHelper = {};

EventHelper.AddCustomEvent = function(__node, __eventName, __handler){
    if(typeof(__node) != "object"){
        console.log("__node节点不存在")
        return;
    }
    __node.on(__eventName, function (event) {
        // console.log(">>>AddCustomEvent:"+__eventName);
        __handler(event);
    });
}

EventHelper.DispatchCustomEvent = function(__node,__name, __data){
    // console.log(typeof(__node));
    if(typeof(__node) != "object"){
        console.log("__node节点不存在")
        return;
    }
    var event = new cc.Event.EventCustom(__name, true);
    event.setUserData(__data);
    __node.dispatchEvent(event);
}

EventHelper.addPersistRootNode = function(__node){
    cc.game.addPersistRootNode(__node);//将myNode成为常驻节点，场景切换时不会清除这个节点的内存
    config.MyNode = __node;
}

EventHelper.removePersistRootNode = function(__node){
    cc.game.removePersistRootNode(__node);//将取消这个节点的常驻属性
}

module.exports = EventHelper;
