var BlockchainApi = require('Global')

cc.Class({
    extends: cc.Component,

    properties: {
        score: {default: null, type: cc.Label}
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    isAndroid: function() {
        return cc.sys.os == cc.sys.OS_ANDROID;
    },

    onLoginClicked(){
        let keystore = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "getKeystore", "()Ljava/lang/String;");//BlockchainApi.getKeystore();
        this.score = keystore;

        jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "toast", "(Ljava/lang/String;)V", keystore);
    },

    onPlayAgainClicked(){
        cc.director.loadScene("game");
    },

    onLeaderboardClicked(){
        cc.director.loadScene("leader_board");
    },
});
