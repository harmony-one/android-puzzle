
cc.Class({
    extends: cc.Component,

    properties: {
        icon: cc.Sprite
    },

    onEnable: function(){
        var seq = cc.repeatForever(
            cc.rotateBy(0.2, 360).easing(cc.easeIn(3.0))
        );

        this.icon.node.runAction(seq);
    },
});
