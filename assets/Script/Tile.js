
cc.Class({
    extends: cc.Component,

    properties: {
        label: {default: null, type: cc.Label}
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.label.string = '' + Math.floor(Math.random() * 10);

    },

    // update (dt) {},
});
