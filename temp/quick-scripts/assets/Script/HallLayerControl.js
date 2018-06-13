(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/HallLayerControl.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'ca1bfsOJVRIfZ+JaI0gWh+N', 'HallLayerControl', __filename);
// Script/HallLayerControl.js

"use strict";

var config = require("config");
var EventHelper = require("EventHelper");
var PlayerDetailModel = require("PlayerDetailModel");
var dialogManager = require("dialogManager");

cc.Class({
    extends: cc.Component,

    properties: {},
    // onLoad () {},
    start: function start() {},
    btnSetClick: function btnSetClick() {
        console.log("btnSetClick");
        // dialogManager.showSetDialog();
    },
    btnTaskClick: function btnTaskClick() {
        console.log("btnTaskClick");
        // dialogManager.showTaskDialog();
    },
    btnEmailClick: function btnEmailClick() {
        console.log("btnEmailClick");
        dialogManager.showEmailDialog();
    },
    btnBagClick: function btnBagClick() {
        console.log("btnBagClick");
        // dialogManager.showBagDialog();
    },
    btnShopClick: function btnShopClick() {
        console.log("btnShopClick");
        // dialogManager.showShopDialog();
    },
    btnShareClick: function btnShareClick() {
        console.log("btnShareClick");
        dialogManager.showShareDialog();
    }
});

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
        //# sourceMappingURL=HallLayerControl.js.map
        