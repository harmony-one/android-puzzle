cc.Class({
    extends: cc.Component,

    properties: {
        rank: cc.Label,
        key: cc.Label,
        score: cc.Label,
        medal: cc.Sprite,
        tx: {default: "", visible: false}
    },

    setup: function(rank, key, score, medal, tx){
        this.tx = tx;

        this.rank.string = rank;
        this.key.string = key;
        this.score.string = score;
        this.medal.spriteFrame = medal;

        this.node.on(cc.Node.EventType.TOUCH_END, this.onClick, this);
    },

    onClick: function(){
        cc.sys.openURL("https://explorer.harmony.one/#/tx/" + this.tx);
    },
});
