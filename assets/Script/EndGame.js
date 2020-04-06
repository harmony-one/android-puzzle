cc.Class({
    extends: cc.Component,

    properties: {
        score: { default: null, type: cc.Label },
        score2: { default: null, type: cc.Label },
        lblWelcome: {default: null, type: cc.Label},
        panelGuest: {default: null, type: cc.Node},
        panelAuthenticated: {default: null, type: cc.Node},
        
    },

    start () {
        this.score.string = Global.newScore;
        this.score2.string = Global.newScore;

        if (Global.isLoggedIn()){
            this.panelGuest.active = false;
            this.panelAuthenticated.active = true;    
        }
    },

    onLoginClicked(){
        if (Global.isAndroid()){
            Global.getKeystore();

            this.lblWelcome.string = "Welcome!";

            //Global.showAlertDialog("Welcome!, your public key: \n" + Global.myKeystore);
        }

        this.panelGuest.active = false;
        this.panelAuthenticated.active = true;
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

            //Global.showAlertDialog("Your score has been updated");
        }
    },

    onPlayAgainClicked(){
        cc.director.loadScene("game");
    },

    onLeaderboardClicked(){
        cc.director.loadScene("leader_board");
    },


});
