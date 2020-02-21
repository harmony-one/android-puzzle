cc.Class({
    extends: cc.Component,

    // use this for initialization
    onLoad: function () {
        let delay = cc.delayTime(2);
        let actions = cc.sequence(delay, cc.callFunc(this.loadGameScene.bind(this)));

        this.node.runAction(actions);
        
    },
    loadGameScene: function(){
        cc.director.loadScene("game");
    },

    // called every frame
    update: function (dt) {

    },
});
