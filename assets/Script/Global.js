var DialogBox = require("DialogBox");

window.SWIFT_DISTANCE = 80;

window.Global = {

    myKeystore: "",
    newScore: 0,
    board_state: "",
    player_sequence: "",
    dialogBox: null,
    loading: null,
    saveScoreCallback: null,
    

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
    restUpdateScore: function(onSuccessCallback){

        let url = "http://puzzlemobile.hmny.io:3000/api/submit";
        let params = "address=" + this.myKeystore + "&score=" + this.newScore + "&board_state=" + this.board_state + "&sequence=" + this.player_sequence;

        cc.log("PARAMZ ", params);

        let xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.timeout = 15000;
        
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

        if (Global.loading != null) Global.loading.active = true;

        xhr.onreadystatechange = function() { // Call a function when the state changes.
            if (Global.loading != null) Global.loading.active = false;

            if (this.readyState === 4 && this.status === 200) {                
                let data = JSON.parse(xhr.responseText);

                cc.log("RESP", xhr.responseText); //{"status":"success","msg":"","tx":"0x32490249324i2390432432432"}
                
                let status = data["status"];
                if (status === "success"){
                    onSuccessCallback();
                    // let tx = data["tx"];
                    // if (tx.length > 10) tx = tx.substring(0, 10) + "...";

                    // let seq = Global.player_sequence;
                    // if (seq.length > 10) seq = seq.substring(0, 10) + "...";

                    // let board = Global.board_state;
                    // if (board.length > 10) board = board.substring(0, 10) + "...";

                    //let msg = "<color=#FFC530>Your score Saved!<c> \n <color=#131475>Txn:</c>" + tx + "\n <color=#131475>BOARD:</c> " + board + "\n <color=#131475>SEQ.</c> " + seq;
                    
                    //Global.showAlertDialog(msg);
                    
                } 
                else {
                    let msg = "Failed to save score! \n Please try again.";
                    
                    Global.showAlertDialog(msg);
                }
            }
        }

        xhr.onerror = function () {
            if (Global.loading != null) Global.loading.active = false;

            let msg = "Networking problem \n Failed to save your score";
            Global.showAlertDialog(msg);
        };

        xhr.ontimeout = function (e) {
            if (Global.loading != null) Global.loading.active = false;

            let msg = "Network: Request timeout.";
            Global.showAlertDialog(msg);
        };
        
        xhr.send(params);
    },

    restGetLeaderBoard: function(onSuccessCallback){
        let url = "http://puzzlemobile.hmny.io:3000/api/leader_boards";

        let xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.timeout = 5000;
        
        if (Global.loading != null) Global.loading.active = true;

        xhr.onreadystatechange = function () {
            if (Global.loading != null) Global.loading.active = false;
            
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                var response = xhr.responseText;
                
                let data = JSON.parse(xhr.responseText);

                let status = data["status"];
                if (status === "success"){
                    onSuccessCallback(response);
                } else {
                    let msg = "Unable to get \n Leader Board! \n Please try again.";
                    
                    Global.showAlertDialog(msg);
                }
            }
        };

        xhr.onerror = function () {
            if (Global.loading != null) Global.loading.active = false;
            
            let msg = "Unable to get \n Leader Board!";
            Global.showAlertDialog(msg);
        };
        
        xhr.send(null);
    }
}