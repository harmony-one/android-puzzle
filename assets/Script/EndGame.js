var DialogBox = require("DialogBox");
var Loading = require("Loading");

cc.Class({
    extends: cc.Component,

    properties: {
        score: { default: null, type: cc.Label },
        score2: { default: null, type: cc.Label },
        lblWelcome: {default: null, type: cc.Label},
        panelGuest: {default: null, type: cc.Node},
        panelAuthenticated: {default: null, type: cc.Node},
        dialogBox: {default: null, type: DialogBox},
        loading: {default: null, type: cc.Node},
    },

    start () {
        this.score.string = Global.newScore;
        this.score2.string = Global.newScore;

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
            Global.showAlertDialog("Your phone does not have Samsung wallet support to store your record in Harmony blockchain");
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

            Global.restUpdateScore();
        }
    },

    onPlayAgainClicked(){
        cc.director.loadScene("game");
    },

    onLeaderboardClicked(){
        cc.director.loadScene("leader_board");
    },


});
