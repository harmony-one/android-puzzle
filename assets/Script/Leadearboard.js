
cc.Class({
    extends: cc.Component,

    properties: {
        entriesRoot: cc.Node,
        prefabEntry: cc.Prefab,

        medalSprites: {default: [], type: cc.SpriteFrame},
        loading: {default: null, type: cc.Node},
    },

    start () {
        let json = "";
        let entries = null;

        if (Global.isAndroid()){
            let str = Global.getLeaderboard();
            str = str.replace("[", "");
            str = str.replace("]", "");

            
            entries = str.split(",");

            let rank = 1;
            entries.forEach(entry => {
                let newEntry = cc.instantiate(this.prefabEntry);
                let script = newEntry.getComponent('Entry');
            
                let medal = this.medalSprites[this.medalSprites.length - 1]; // normal medal
                if (rank == 1 || rank == 2){ // Gold + Silver
                    medal = this.medalSprites[rank - 1];
                }
                
                let shortenKey = entry.slice(0, 10) + "...";
                //script.setup(rank, shortenKey, entry.score, medal);
                script.setup(rank, shortenKey, 0, medal);

                this.entriesRoot.addChild(newEntry);

                rank ++;
            });
        } else {
            
            
        }

        let that = this;

        Global.loading = this.loading;

        // Global.restGetLeaderBoard(function(jsonText){
        //     json = jsonText;
        //     let data = JSON.parse(json);

        //     cc.log("json string", json);

        //     entries = data["leaders"];

        //     cc.log("Entries" , entries);

        //     entries.sort((a, b) => (a.score > b.score) ? -1 : 1);

        //     let rank = 1;
        //     entries.forEach(entry => {
        //         let record = cc.instantiate(that.prefabEntry);
        //         let script = record.getComponent('Entry');
            
        //         let medal = that.medalSprites[that.medalSprites.length - 1]; // normal medal
        //         if (rank == 1 || rank == 2){ // Gold + Silver
        //             medal = that.medalSprites[rank - 1];
        //         }
                
        //         let shortenKey = entry.address.slice(0, 10) + "...";
        //         let tx = "0x0816c249e4ecc3f9992044a8aaa4cc13cb3a5465a35cc52b5804b98170d77040";

        //         if (entry.txn != undefined && entry.txn != null){
        //             tx = entry.txn;
        //         }

        //         script.setup(rank, shortenKey, entry.score, medal, tx);

        //         that.entriesRoot.addChild(record);

        //         rank ++;
        //     });
        // });

        
    },

    onPlayAgainClicked(){
        cc.director.loadScene("game");
    },

    onBackClicked(){
        cc.director.loadScene("end_game")
    }
});
