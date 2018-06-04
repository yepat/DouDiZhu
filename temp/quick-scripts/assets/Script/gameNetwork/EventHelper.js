(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/gameNetwork/EventHelper.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '5f640z64OJCO7qfrQDJom3k', 'EventHelper', __filename);
// Script/gameNetwork/EventHelper.js

"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var config = require("config");
var EventHelper = {};

EventHelper.AddCustomEvent = function (__node, __eventName, __handler) {
    if ((typeof __node === "undefined" ? "undefined" : _typeof(__node)) != "object") {
        console.log("__node节点不存在");
        return;
    }
    __node.on(__eventName, function (event) {
        // console.log(">>>AddCustomEvent:"+__eventName);
        __handler(event);
    });
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

EventHelper.addPersistRootNode = function (__node) {
    cc.game.addPersistRootNode(__node); //将myNode成为常驻节点，场景切换时不会清除这个节点的内存
    config.MyNode = __node;
};

EventHelper.removePersistRootNode = function (__node) {
    cc.game.removePersistRootNode(__node); //将取消这个节点的常驻属性
};

module.exports = EventHelper;

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=EventHelper.js.map
        