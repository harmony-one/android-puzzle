cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    isAndroid: function() {
        return cc.sys.os == cc.sys.OS_ANDROID;
    },

    apiInitBlockchain: function() {
        jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "initBlockchain", "()V");
    },

    onLoginClicked(){
        jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "toast", "(Ljava/lang/String;)V", "Login clicked");

        this.apiInitBlockchain();
    },

    onPlayAgainClicked(){
        cc.director.loadScene("game");
    },

    onLeaderboardClicked(){
        cc.director.loadScene("leader_board");
    },
});
