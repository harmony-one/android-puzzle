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
        }

        this.panelGuest.active = false;
        this.panelAuthenticated.active = true;
    },

    onSaveClicked(){ 
        if (Global.isAndroid()){
            Global.updateScore();
        }
    },

    onPlayAgainClicked(){
        cc.director.loadScene("game");
    },

    onLeaderboardClicked(){
        cc.director.loadScene("leader_board");
    },


});
