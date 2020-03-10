window.Global = {
    myKeystore: "",
    leaderboard: "",
    newScore: 0,

    isAndroid: function() {
        return cc.sys.os == cc.sys.OS_ANDROID;
    },

    getKeystore: function(){
        this.myKeystore = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "getKeystore", "()Ljava/lang/String;");

        return this.myKeystore;
    },

    getScore: function(){
        return jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "getScore", "(Ljava/lang/String;)I", this.myKeystore);
    },

    getUserName: function(){
        // return "Joe";
        return jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "getUserName", "(Ljava/lang/String;)Ljava/lang/String;", this.myKeystore);
    },

    updateScore: function(){
        if (this.newScore <= 0) return;

        let currentScore = this.getScore();

        if (this.newScore > currentScore){
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "updateScore", "(Ljava/lang/String;I)V", this.myKeystore, this.newScore);
        }
    },

    getLeaderboard: function(){
        this.leaderboard = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "getLeaderboard", "()Ljava/lang/String;");
    }
}