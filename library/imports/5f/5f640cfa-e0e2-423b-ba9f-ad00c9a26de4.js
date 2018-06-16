"use strict";
cc._RF.push(module, '5f640z64OJCO7qfrQDJom3k', 'EventHelper');
// Script/gameNetwork/EventHelper.js

"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var config = require("config");
var EventHelper = {};

EventHelper.AddCustomEvent = function (__node, __eventName, __handler, self) {
    if ((typeof __node === "undefined" ? "undefined" : _typeof(__node)) != "object") {
        console.log("__node节点不存在");
        return;
    }
    __node.on(__eventName, __handler, self);
};

EventHelper.DispatchCustomEvent = function (__node, __name, __data) {
    // console.log(typeof(__node));
    if ((typeof __node === "undefined" ? "undefined" : _typeof(__node)) != "object") {
        console.log("__node节点不存在");
        return;
    }
    var event = new cc.Event.EventCustom(__name, true);
    event.setUserData(__data);
    __node.dispatchEvent(event);
};

EventHelper.RemoveCustomEvent = function (__node, __eventName, __handler, self) {
    if ((typeof __node === "undefined" ? "undefined" : _typeof(__node)) != "object") {
        console.log("__node节点不存在");
        return;
    }
    __node.off(__eventName, __handler, self);
};

EventHelper.addPersistRootNode = function (__node) {
    cc.game.addPersistRootNode(__node); //将myNode成为常驻节点，场景切换时不会清除这个节点的内存
    config.MyNode = __node;
};

EventHelper.removePersistRootNode = function (__node) {
    cc.game.removePersistRootNode(__node); //将取消这个节点的常驻属性
};

module.exports = EventHelper;

cc._RF.pop();