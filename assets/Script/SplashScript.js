cc.Class({
    extends: cc.Component,

    // use this for initialization
    onLoad: function () {
        let delay = cc.delayTime(1.5);
        let actions = cc.sequence(delay, cc.callFunc(this.loadGameScene.bind(this)));

        this.node.runAction(actions);

        Global.logout();
    },
    loadGameScene: function(){
        cc.director.loadScene("game");
    },

    // called every frame
    update: function (dt) {

    },
});
