var DialogBox = require("DialogBox");
var Loading = require("Loading");

cc.Class({
    extends: cc.Component,

    properties: {
        score: { default: null, type: cc.Label },
        score2: { default: null, type: cc.Label },
        lblGold: { default: null, type: cc.Label },
        lblWelcome: {default: null, type: cc.Label},
        lblUpdateSuccess: { default: null, type: cc.Label },
        lblPoint: { default: null, type: cc.Label },
        panelGuest: {default: null, type: cc.Node},
        panelAuthenticated: {default: null, type: cc.Node},
        dialogBox: {default: null, type: DialogBox},
        loading: {default: null, type: cc.Node},
    },

    start () {
        this.score.string = Global.newScore;
        this.score2.string = Global.newScore;
        this.lblGold.string = Global.newScore;

        Global.dialogBox = this.dialogBox;
        Global.loading = this.loading;        


        if (Global.isLoggedIn()){
            this.panelGuest.active = false;
            this.panelAuthenticated.active = true;            
        }
    },

    onLoginClicked(){
        if (Global.isSamsungBlockchainSupported()){
            if (Global.isAndroid()){
                Global.getKeystore();

                this.lblWelcome.string = "Welcome!";
            }

            this.panelGuest.active = false;
            this.panelAuthenticated.active = true;
        } else {
            Global.showAlertDialog("<center>Your phone does not</center> <br/>support Samsung wallet <br/>to store your record <br/>in Harmony blockchain!");
        }
    },

    onCreateKeystoreClicked(){
        if (Global.isAndroid()){
            Global.gotoSamsungBlockchainKeystoreMenu();
        }
    },

    onSaveClicked(){ 
        if (Global.isAndroid()){
            //Global.updateScore(); // update score & send-transaction
            let that = this;

            Global.restUpdateScore(function(){
                cc.log("score updated");

                that.lblWelcome.string = "Score Saved";
                // that.lblUpdateSuccess.active = true;
                // that.lblPoint.active = false;

                // setTimeout(function() {
                //     // that.lblUpdateSuccess.active = false;
                //     // that.lblPoint.active = true;
                // }, 3000);
            });
        }
    },

    onPlayAgainClicked(){
        cc.director.loadScene("game");
    },

    onLeaderboardClicked(){
        cc.director.loadScene("leader_board");
    },

    


});
