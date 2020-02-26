
cc.Class({
    extends: cc.Component,

    properties: {
        x: -1,
        y: -1,
        number: cc.Label,
        sprite:cc.Sprite,
        selected: cc.Sprite,
        animationNode: cc.Node,
    },

    onLoad () {
    },

    setNumberAndColor: function(value, spriteFrame){
        this.number.string = value;
        this.sprite.spriteFrame = spriteFrame;
    },
    
    setNumber: function(value){
        this.number.string = value;
    },

    setSelected: function(val){
        this.selected.enabled = val;
    }

});
