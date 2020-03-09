cc.Class({
    extends: cc.Component,

    properties: {
        score: {default: null, type: cc.Label}
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        if (Global.isAndroid()){
            Global.getKeystore();
            //jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "getKeystore", "()Ljava/lang/String;");//
            //let sum = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "sum", "(II)I", 1, 2);
            

            let score = Global.getScore();
            this.score.string = Global.newScore;

            //jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "toast", "(Ljava/lang/String;)V", sum);
        }
    },

    

    onLoginClicked(){
        Global.updateScore();
    },

    onPlayAgainClicked(){
        cc.director.loadScene("game");
    },

    onLeaderboardClicked(){
        cc.director.loadScene("leader_board");
    },
});
