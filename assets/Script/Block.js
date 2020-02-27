
cc.Class({
    extends: cc.Component,

    properties: {
        x: -1,
        y: -1,
        value: 0,
        number: cc.Label,
        sprite:cc.Sprite,
        selected: cc.Sprite,
        animationNode: cc.Node,
    },

    onLoad () {
       
    },

    setColorAndValue: function(sprite, value){
        this.value = value;
        this.sprite.spriteFrame = sprite;
    },
    
    setNumber: function(value){
        this.number.string = value;
    },

    setSelected: function(val){
        this.selected.enabled = val;
    }

});
