
cc.Class({
    extends: cc.Component,

    properties: {
        entriesRoot: cc.Node,
        prefabEntry: cc.Prefab,

        medalSprites: {default: [], type: cc.SpriteFrame}
    },

    start () {
        let json = "";
        let entries = null;

        if (Global.isAndroid()){
            //json = Global.getLeaderboard();
            //entries = JSON.parse(json);
        } else {
            
            
        }

        let that = this;

        Global.restGetLeaderBoard(function(jsonText){
            json = jsonText;
            let data = JSON.parse(json);

            cc.log("json string", json);

            entries = data["leaders"];

            cc.log("Entries" , entries);

            entries.sort((a, b) => (a.score > b.score) ? -1 : 1);

            let rank = 1;
            entries.forEach(entry => {
                let newEntry = cc.instantiate(that.prefabEntry);
                let script = newEntry.getComponent('Entry');
            
                let medal = that.medalSprites[that.medalSprites.length - 1]; // normal medal
                if (rank == 1 || rank == 2){ // Gold + Silver
                    medal = that.medalSprites[rank - 1];
                }
                
                let shortenKey = entry.address.slice(0, 10) + "...";
                script.setup(rank, shortenKey, entry.score, medal);

                that.entriesRoot.addChild(newEntry);

                rank ++;
            });
        });

        // let rank = 1;
        // entries.forEach(entry => {
        //     let newEntry = cc.instantiate(this.prefabEntry);
        //     let script = newEntry.getComponent('Entry');
        
        //     let medal = this.medalSprites[this.medalSprites.length - 1]; // normal medal
        //     if (rank == 1 || rank == 2){ // Gold + Silver
        //         medal = this.medalSprites[rank - 1];
        //     }
            
        //     let shortenKey = entry.key.slice(0, 10) + "...";
        //     script.setup(rank, shortenKey, entry.score, medal);

        //     this.entriesRoot.addChild(newEntry);

        //     rank ++;
        // });
    },

    onPlayAgainClicked(){
        cc.director.loadScene("game");
    },

    onBackClicked(){
        cc.director.loadScene("end_game")
    }
});
