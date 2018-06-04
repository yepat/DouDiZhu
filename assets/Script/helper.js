// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html

var helper = {};

helper.copyObj = function(obj){
    var getType = Object.prototype.toString;
    if(getType.call(obj) == "[object Array]"){
        var copy_obj = [];
        for(var k in obj){
            copy_obj.push(obj[k]);
        }
        return copy_obj
    }else if(getType.call(obj) == "[object Object]"){
        var copy_obj = {};
        for(var k in obj){
            copy_obj[k] = obj[k];
        }
        return copy_obj;
    }
    return obj
}

module.exports = helper;
