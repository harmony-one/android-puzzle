var myKeystore = "";
var leaderboard = "";

var BlockchainApi = {
    getKeystore: function(){
        cc.log("xxx : call java.getKeystore()");
        myKeystore = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "getKeystore", "()Ljava/lang/String;");

        cc.log("xxx : java.getKeystore() returns: " + myKeystore);
        return myKeystore;
    },

    getScore: function(){
        return jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "getScore", "(Ljava/lang/String;)I", myKeystore);
    },

    updateScore: function(score){
        jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "updateScore", "(Ljava/lang/String;I)", myKeystore, score);
    },

    getLeaderboard: function(){
        leaderboard = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "getLeaderboard", "()Ljava/lang/String;");
    }
}

module.exports = BlockchainApi;