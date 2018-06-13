
var config = require("config");
var EventHelper = require("EventHelper");
var PlayerDetailModel = require("PlayerDetailModel");
var dialogManager = require("dialogManager");

cc.Class({
    extends: cc.Component,

    properties: {
    },
    // onLoad () {},
    start () {
    },
    btnSetClick(){
        console.log("btnSetClick");
        // dialogManager.showSetDialog();
    },
    btnTaskClick(){
        console.log("btnTaskClick");
        // dialogManager.showTaskDialog();
    },
    btnEmailClick(){
        console.log("btnEmailClick");
        dialogManager.showEmailDialog();
    },
    btnBagClick(){
        console.log("btnBagClick");
        // dialogManager.showBagDialog();
    },
    btnShopClick(){
        console.log("btnShopClick");
        // dialogManager.showShopDialog();
    },
    btnShareClick(){
        console.log("btnShareClick");
        dialogManager.showShareDialog();
    }
});
