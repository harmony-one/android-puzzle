
cc.Class({
    extends: cc.Component,

    properties: {
    
    },

    start () {
        let json = Global.getLeaderboard();
    },

    // update (dt) {},

    onPlayAgainClicked(){
        cc.director.loadScene("game");
    },

    onBackClicked(){
        cc.director.loadScene("end_game")
    }
});
