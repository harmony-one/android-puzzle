
cc.Class({
    extends: cc.Component,

    properties: {
        entriesRoot: cc.Node,
        prefabEntry: cc.Prefab,

        medalSprites: {default: [], type: cc.SpriteFrame}
    },

    start () {
        let json = Global.getLeaderboard();
        
        cc.log("json string", json);
        //Global.showAlertDialog(json);
        let entries = JSON.parse(json);
       
        let rank = 1;
        entries.forEach(entry => {
            let newEntry = cc.instantiate(this.prefabEntry);
            let script = newEntry.getComponent('Entry');
        
            let medal = this.medalSprites[this.medalSprites.length - 1]; // normal medal
            if (rank == 1 || rank == 2){ // Gold + Silver
                medal = this.medalSprites[rank - 1];
            }
            
            let shortenKey = entry.key.slice(0, 10) + "...";
            script.setup(rank, shortenKey, entry.score, medal);

            this.entriesRoot.addChild(newEntry);

            rank ++;
        });
    },

    onPlayAgainClicked(){
        cc.director.loadScene("game");
    },

    onBackClicked(){
        cc.director.loadScene("end_game")
    }
});
