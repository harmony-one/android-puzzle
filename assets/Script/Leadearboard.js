
cc.Class({
    extends: cc.Component,

    properties: {
    
    },

    start () {
        let json = Global.getLeaderboard();
        
        cc.log("json string", json);
        //Global.showAlertDialog(json);
        let entries = JSON.parse(json);
       
    },

    onPlayAgainClicked(){
        cc.director.loadScene("game");
    },

    onBackClicked(){
        cc.director.loadScene("end_game")
    }
});
