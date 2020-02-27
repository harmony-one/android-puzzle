
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
        let rect = new cc.DrawNode();
        rect.drawRect(cc.p(0, 0), cc.p(20, 20), cc.color(0,0,0,100), 1, cc.color(200,0,0,255));
        this.parent.addChild(rect);

        this.number.enableOutline(cc.color(255, 255, 255, 255), 1);
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
