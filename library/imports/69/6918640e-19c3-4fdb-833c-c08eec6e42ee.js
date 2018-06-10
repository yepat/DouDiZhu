"use strict";
cc._RF.push(module, '69186QOGcNP24M8wI7sbkLu', 'shareControl');
// Script/dialog/shareControl.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {},
    start: function start() {},
    closeClick: function closeClick() {
        console.log("close click");
        this.node.destroy();
    },
    btnClick: function btnClick(event) {
        var btnName = event.target.name;
        console.log("-------" + btnName);
    },
    getClick: function getClick() {
        console.log("-------get");
    }
});

cc._RF.pop();