var DialogBox = require("DialogBox");

window.Global = {
    myKeystore: "",
    newScore: 0,
    board_state: "",
    player_sequence: "",
    dialogBox: null,
    

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

    logout: function(){
        localStorage.setItem("my_keystore", "");
    },

    getScore: function(){
        return jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "getScore", "()I");
    },

    updateScore: function(){
        if (this.newScore <= 0) return;

        let currentScore = this.getScore();

        if (this.newScore > currentScore){
            //jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "updateScore", "(I)V", this.newScore);

        }
    },

    getLeaderboard: function(){
        return jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "getLeaderboard", "()Ljava/lang/String;");
    },

    showAlertDialog: function(message){
        //return jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "showAlertDialog", "(Ljava/lang/String;)V", message);
        Global.dialogBox.showMessage(message);        
    },

    gotoSamsungBlockchainKeystoreMenu: function(){
        return jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "gotoSamsungBlockchainKeystoreMenu", "()V");
    },

    isSamsungBlockchainSupported: function(){
        return jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "isSamsungBlockchainSupported", "()Z");
    },

    isInternetConnectionAvailable: function(){
        return jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "isInternetConnectionAvailable", "()Z");
    },

    // call rest api
    restUpdateScore: function(){
        let url = "http://ec2-54-212-193-72.us-west-2.compute.amazonaws.com:8080/api/submit" ;
        var params = "address=" + this.myKeystore + "&score=" + this.newScore + "&board_state=" + this.board_state + "&sequence=" + this.player_sequence;

        cc.log("PARAMZ ", params);

        var xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

        xhr.onreadystatechange = function() { // Call a function when the state changes.
            if (this.readyState === 4 && this.status === 200) {                
                let data = JSON.parse(xhr.responseText);

                cc.log("RESP", xhr.responseText); //{"status":"success","msg":"","tx":"0x32490249324i2390432432432"}
                
                // let status = data["status"];
                //if (status === "success"){
                // {
                
                // }

                
                let tx = data["tx"];
                if (tx.length > 10) tx = tx.substring(0, 10) + "...";

                let seq = Global.player_sequence;
                if (seq.length > 10) seq = seq.substring(0, 10) + "...";

                let msg = "<color=#FFC530>Your score Saved!<c> \n <color=#131475>Txn:</c>" + tx + "\n <color=#131475>BOARD:</c> " + Global.board_state + "\n <color=#131475>SEQ.</c> " + seq;
                
                cc.log("RESP", msg);

                Global.showAlertDialog(msg);
                
            }
        }
        
        xhr.send(params);
    },

    restGetLeaderBoard: function(onSuccessCallback){
        let url = "http://ec2-54-212-193-72.us-west-2.compute.amazonaws.com:8080/api/leader_boards";        

        let xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                var response = xhr.responseText;
                
                onSuccessCallback(response);
            }
        };
        
        xhr.send(null);
    }
}