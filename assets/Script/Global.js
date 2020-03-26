window.Global = {
    myKeystore: "",
    newScore: 0,

    isAndroid: function() {
        return cc.sys.os == cc.sys.OS_ANDROID;
    },

    isLoggedIn: function(){
        let myKeystore = localStorage.getItem("my_keystore");

        // Ethereum public key length = 128 chars
        return myKeystore != null && myKeystore.length > 10;
    },

    getKeystore: function(){
        this.myKeystore = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "getKeystore", "()Ljava/lang/String;");

        localStorage.setItem("my_keystore", this.myKeystore);

        return this.myKeystore;
    },

    getScore: function(){
        return jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "getScore", "()I");
    },

    updateScore: function(){
        if (this.newScore <= 0) return;

        let currentScore = this.getScore();

        if (this.newScore > currentScore){
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "updateScore", "(I)V", this.newScore);
        }
    },

    getLeaderboard: function(){
        return jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "getLeaderboard", "()Ljava/lang/String;");
    },

    showAlertDialog: function(message){
        return jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "showAlertDialog", "(Ljava/lang/String;)V", message);
    },

    gotoSamsungBlockchainKeystoreMenu: function(){
        return jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "gotoSamsungBlockchainKeystoreMenu", "()V");
    },
}