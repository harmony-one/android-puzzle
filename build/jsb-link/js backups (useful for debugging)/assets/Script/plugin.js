cc.Class({
extends: cc.Component,
properties: {},
start() {},
callHello: function() {
jsb.reflection.callStaticMethod("com/harmony/game/samsungblockchain/SamSungBlockChainLib", "hello", "(Ljava/lang/String;)V", "this is a message from js");
},
callAdd: function(a, c) {
var n = jsb.reflection.callStaticMethod("com/harmony/game/samsungblockchain/SamSungBlockChainLib", "sum", "(II)I", a, c);
cc.log(n);
return n;
}
});