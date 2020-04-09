
cc.Class({
    extends: cc.Component,

    properties: {
        lblMessage: cc.RichText,        
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    showMessage: function(msg){
        this.lblMessage.string = msg;
        this.show();
    },

    hide: function(){
        this.node.active = false;
    },

    show: function(){
        this.node.active = true;
    }

    // update (dt) {},
});
