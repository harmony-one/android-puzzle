
cc.Class({
    extends: cc.Component,

    properties: {
    
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    // update (dt) {},

    onPlayAgainClicked(){
        cc.director.loadScene("game");
    },

    onBackClicked(){
        cc.director.loadScene("end_game")
    }
});
