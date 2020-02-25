
cc.Class({
    extends: cc.Component,

    properties: {
        i: -1,
        j: -1,
        number: cc.Label,
        bg:cc.Sprite,
        animationNode: cc.Node,
    },

    

    onLoad () {

    },

    setNumberAndColor: function(value, spriteFrame){
        this.number.string = value;
        this.bg.spriteFrame = spriteFrame;      
    },
    
    setNumber: function(value){
        this.number.string = value;
    }
});
