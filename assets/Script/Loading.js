
cc.Class({
    extends: cc.Component,

    properties: {
        icon: cc.Sprite
    },

    onEnable: function(){
        var seq = cc.repeatForever(
            cc.rotateBy(1.0, 360).easing(cc.easeIn(3.0))
        );

        this.icon.node.runAction(seq);
    },
});
