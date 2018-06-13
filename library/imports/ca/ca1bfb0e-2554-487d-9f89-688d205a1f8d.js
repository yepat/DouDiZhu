"use strict";
cc._RF.push(module, 'ca1bfsOJVRIfZ+JaI0gWh+N', 'HallLayerControl');
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