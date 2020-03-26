cc.Class({
    extends: cc.Component,

    properties: {
        rank: cc.Label,
        key: cc.Label,
        score: cc.Label,
        medal: cc.Sprite,
    },

    setup: function(rank, key, score, medal){
        this.rank.string = rank;
        this.key.string = key;
        this.score.string = score;
        this.medal.spriteFrame = medal;
    }
});
