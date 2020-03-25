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
    },

    onLoginClicked(){
        if (Global.isAndroid()){
            Global.getKeystore();

            let name = Global.getUserName();
            this.lblWelcome.string = "Welcome, " + name;

            Global.showAlertDialog("Hello, " + name);
        }

        this.panelGuest.active = false;
        this.panelAuthenticated.active = true;
    },

    onCreateKeystoreClicked(){
        Global.showAlertDialog("Please go to Settings > Biometrics & Security > Samsung Blockchain Keystore \n To create your keystore");
    },

    onSaveClicked(){ 
        if (Global.isAndroid()){
            Global.updateScore();

            Global.showAlertDialog("Your score has been updated");
        }
    },

    onPlayAgainClicked(){
        cc.director.loadScene("game");
    },

    onLeaderboardClicked(){
        cc.director.loadScene("leader_board");
    },


});
