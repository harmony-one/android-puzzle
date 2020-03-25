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
        return jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "getScore", "()I");
    },

    getUserName: function(){
        return jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "getUserName", "()Ljava/lang/String;");
    },

    updateScore: function(){
        if (this.newScore <= 0) return;

        let currentScore = this.getScore();

        if (this.newScore > currentScore){
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "updateScore", "(I)V", this.newScore);
        }
    },

    getLeaderboard: function(){
        this.leaderboard = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "getLeaderboard", "()Ljava/lang/String;");
    },

    showAlertDialog: function(message){
        return jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "showAlertDialog", "(Ljava/lang/String;)V", message);
    },
}