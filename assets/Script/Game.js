var BLOCKS_PER_ROW = 3;
var BLOCK_SPACE = 18;
const STATE = {
    TUTORIAL: 0,
    STARTED: 1,
    END: 2
}

cc.Class({
    extends: cc.Component,   

    properties: {
        prefabBlock: {default: null, type: cc.Prefab},
        levelGenerator: {default: null, type: cc.Node},
        stopwatch: {default: null, type: cc.Node},
        numberBgArray: {default: [], type: cc.SpriteFrame},
        lblScore: cc.Label,
        lblTime: cc.Label,
        lblLevel: cc.Label,
        btnPlay: cc.Button,
        btnUndo: cc.Button,
        lblError: {default: null, type: cc.Label},
        tutorialLine: {default: null, type: cc.Sprite},
        themeMusic: {default: null, type: cc.AudioClip},
        soundMove: {default: null, type: cc.AudioClip},
        soundCantMove: {default: null, type: cc.AudioClip},
        soundWin: {default: null, type: cc.AudioClip},
        soundButtonClick: {default: null, type: cc.AudioClip},
    },

    state: STATE.TUTORIAL,
    lastMove: null,
    usedReset: false,
    touchedBlock: null,
    startPos: null,
    endPos: null,

    onLoad () {        
        let spaceX = 11;
        let spaceY = 11;
        let padding = 22;
        this.nodeWidth = (this.node.width - (2 * padding + 2 * spaceX))/3;
        this.nodeHeight = (this.node.height - (2 * padding + 2 * spaceY))/3;

        this.generateAllLevels();        
        
        this._currentLevel = 0;

        let level = this._allLevels[this._currentLevel];

        this.instantiateBlocks(level);        

        this.reset();

        if (this.themeMusic != null && Global.isAndroid()){
            cc.audioEngine.playMusic(this.themeMusic, true);
        }

        // let ii = 10;
        // this.schedule(function(){
        //     this.lblError.string = ii;
        //     ii+= 10;
        // }, 2);

    },

    generateAllLevels: function(){
        // Generate all Levels for this whole Run.
        let script = this.levelGenerator.getComponent('LevelGenerator');

        this._allLevels = script.levels();
        cc.log("[All Levels] ", this._allLevels);
    },

    instantiateBlocks: function(){
        this.listBlockScripts = [];

        // Create 9 Blocks for all level, then reuse them with this.listBlockScripts
        for (let i = 0; i < BLOCKS_PER_ROW * BLOCKS_PER_ROW; i++) {
            let block = cc.instantiate(this.prefabBlock);
            this.node.addChild(block);
            
            block.width = this.nodeWidth;
            block.height = this.nodeHeight;
            
            let x = i % BLOCKS_PER_ROW;
            let y = Math.floor(i / BLOCKS_PER_ROW);

            block.position = this.getNodePosition(x, y);

            let script = block.getComponent('Block');
            script.x = x;
            script.y = y;
            this.listBlockScripts.push(script);
        }
    },

    getNodePosition: function (row, col) {
        let w = this.nodeWidth;
        let h = this.nodeHeight;
        
        return cc.v2((row - 1) * (BLOCK_SPACE + w) , - (col - 1) * (BLOCK_SPACE + h));
    },

    reset: function () {
        this.state = STATE.TUTORIAL;
        this.score = 0;
        this._currentLevel = 0;
        this._timer = 0;
        this.usedReset = false;

        let level = this._allLevels[this._currentLevel];

        this.loadLevel(level);

        this.disableTouch();

        this.animatePlayButton();
    },
    
    loadLevel: function(level){
        Global.board_state = "";
        Global.player_sequence = "";
        let temp = "";

        for (let i = 0; i < level.contents.length; i++) {
            let value = level.contents[i];

            let x = i % BLOCKS_PER_ROW;
            let y = Math.floor(i / BLOCKS_PER_ROW);

            let block = this.findBlock(x, y);
            block.setSelected(false);

            block.setColorAndValue(this.getSpriteByValue(value), value);

            temp += value;
        }
        Global.board_state = temp;
        Global.current_level = level;

        this.selectedX = level.initialSelected.x;
        this.selectedY = level.initialSelected.y;

        let selectedBlock = this.findBlock(this.selectedX, this.selectedY);
        if (selectedBlock != null){
            selectedBlock.setSelected(true);
        }

        this.lblLevel.string = (this._currentLevel + 1) + "/100";
        this.btnUndo.interactable = true;
        
        if (this.tween4Stopwatch != null) this.tween4Stopwatch.stop();
        this.isClockRinging = false;
    },

    getSpriteByValue: function(number){
        let index = number % this.numberBgArray.length;

        return this.numberBgArray[index];
    },

    enableTouch: function () {
        this.node.parent.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.parent.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
    },

    disableTouch: function () {
        this.node.parent.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.parent.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
    },

    onTouchStart: function (event) {
        this.startPos = event.getLocation();
        //cc.log(">>BOARD touch-START ", this.startPos);        
    },

    onTouchEnd: function (event) {
        //cc.log("BOARD touch-END", event.target);
        let endPos = event.getLocation();

        let deltaX = endPos.x - this.startPos.x;
        let deltaY = endPos.y - this.startPos.y;

        if (Math.abs(deltaX) < SWIFT_DISTANCE && Math.abs(deltaY) < SWIFT_DISTANCE) {
            let board = event.target;
            
            let touchBlock = this.findBlockByCoordinate(cc.v2(endPos.x - board.x, endPos.y - board.y));

            this.moveByClickingBlock(touchBlock);
        } else {
            this.moveBySwift(deltaX, deltaY);
        }
    },

    moveBySwift: function(deltaX, deltaY){
        //cc.log("moveBySwift");

        let direction;
        if (Math.abs(deltaX) >= Math.abs(deltaY)) {
            direction = deltaX > 0 ? 'R' : 'L';
        } else {
            direction = deltaY > 0 ? 'U' : 'D';
        }

        this.tryMove(direction);
    },

    moveByClickingBlock: function(touchBlock){    
        cc.log("moveByClickingBlock", touchBlock);

        if (touchBlock === undefined || touchBlock === null) return;

        let currentBlock = this.findBlock(this.selectedX, this.selectedY);

        let dx = currentBlock.x - touchBlock.x;
        let dy = currentBlock.y - touchBlock.y;

        let absDx = Math.abs(dx);
        let absDy = Math.abs(dy);
        if ((absDx === 1 || absDy === 1) // delta == 1: neighbor blocks only
            && !(absDx === 1 && absDy === 1) // not allow 2 directions at the same time
            && (absDx <= 1 && absDy <= 1)) // not allow "far away" click
        {  
            let direction = '';
            if (dx != 0) {
                direction = dx > 0 ? 'L' : 'R';
            } else if (dy != 0) {
                direction = dy > 0 ? 'U' : 'D';
            }

            this.tryMove(direction);
        } else {
            this.playInvalidMoveSound();
        }
    },
    
    findBlock: function(x, y){        
        for(var i = 0; i < this.listBlockScripts.length; i++){
            let block = this.listBlockScripts[i];
            
            if (block.x == x && block.y == y) {
                return block;
            }
        }

        cc.log("findBlock: FAILED at index ", i);
    },

    findBlockByCoordinate: function(v2){        
        for(var i = 0; i < this.listBlockScripts.length; i++){
            let block = this.listBlockScripts[i];
            
            let blockPos = this.getNodePosition(block.x, block.y);
            let halfSize = cc.v2(this.nodeWidth, this.nodeHeight);

            let minX = blockPos.x - halfSize.x;
            let maxX = blockPos.x + halfSize.x;
            let minY = blockPos.y - halfSize.y;
            let maxY = blockPos.y + halfSize.y;

            cc.log("block" + i, blockPos, minX, maxX, minY, maxY);

            if (minX <= v2.x && v2.x <= maxX
                && minY <= v2.y && v2.y <= maxY) {
                return this.listBlockScripts[i];
            }
        }

        cc.log("findBlock: FAILED at coordinate ", v2);
    },

    tryMove: function (direction) {
        cc.log("tryMove with direction=", direction);
        let canMove = false;

        let currentBlock = this.findBlock(this.selectedX, this.selectedY);

        switch (direction){
            case 'L':
                if (this.selectedX == 0) break;

                this.selectedX--;
                canMove = true;
                break;
            case 'R':
                if (this.selectedX == BLOCKS_PER_ROW - 1) break;

                this.selectedX++;
                canMove = true;
                break;
            case 'U':
                if (this.selectedY == 0) break;

                this.selectedY--;
                canMove = true;
                break;
            case 'D':
                if (this.selectedY == BLOCKS_PER_ROW - 1) break;

                this.selectedY++;
                canMove = true;
                break;
        }

        if (!canMove){
            currentBlock.animate();
            this.playInvalidMoveSound();
        } else {
            if (this.btnPlay.enabled){
                this.btnPlay.node.active = false;
                this.btnUndo.node.active = true;
                this.tutorialLine.enabled = false;

                this.state = STATE.STARTED;
            }

            // Log player's move to submit later
            Global.player_sequence += direction;

            this.lastMove = direction;
            //this.btnUndo.interactable = true;

            let nextBlock = this.findBlock(this.selectedX, this.selectedY);                
            let newValue = nextBlock.value + 1;
            //cc.log("found one, with value: " + nextBlock.number)

            // if (newValue >= this.numberBgArray.length){
            //     nextBlock.setNumber(newValue);
            // }
            nextBlock.setColorAndValue(this.getSpriteByValue(newValue), newValue);

            currentBlock.setSelected(false);
            nextBlock.setSelected(true);

            this.playMoveSound();

            if (this.isPlayerWin()){
                cc.audioEngine.playEffect(this.soundWin);
                
                this.score += this.calculateScore();
                this.lblScore.string = this.score;

                this.gotoNextLevel();
            }
        }
    },

    gotoNextLevel: function(){
        this._currentLevel ++;
        this._timer = this.getTimeByLevel(this._currentLevel);
        
        this.lblLevel.string = (this._currentLevel + 1) + "/100";
        
        let level = this._allLevels[this._currentLevel];
        this.loadLevel(level);
    },

    calculateScore: function(){
        return (this._currentLevel + 1) * Math.floor(this._timer);
    },

    getTimeByLevel: function(level){
        if (level <= 2) return 20;
        if (level <= 5) return 30;
        if (level <= 10) return 25;
        if (level <= 20) return 20;
        
        return 15;
    },

    isPlayerWin: function(){
        let value0 = this.listBlockScripts[0].value;
        for(var i = 1; i < this.listBlockScripts.length; i++){
            if (this.listBlockScripts[i].value != value0) return false;
        }

        return true;
    },

    playMoveSound: function(){
        if (this.soundMove == null) return;
        cc.audioEngine.playEffect(this.soundMove);
    },

    playInvalidMoveSound: function(){
        if (this.soundCantMove == null) return;

        cc.audioEngine.playEffect(this.soundCantMove);
    },
    
    onPlayClicked: function(){        
        this.enableTouch();
        this.tween4PlayButton.stop();
        this.btnPlay.node.scale = 1;

        this._timer = this.getTimeByLevel(this._currentLevel);

        cc.audioEngine.playEffect(this.soundButtonClick);

        let selectedBlock = this.findBlock(this.selectedX, this.selectedY);
        selectedBlock.animate();
    },

    // onUndoClicked: function(){
    //     if (this.lastMove == null) return;

    //     // Deselect + substract value
    //     let currentBlock = this.findBlock(this.selectedX, this.selectedY);                
    //     let oldValue = currentBlock.value - 1;

    //     currentBlock.setColorAndValue(this.getSpriteByValue(oldValue), oldValue);
    //     currentBlock.setSelected(false);

    //     // back to previous selected block
    //     switch (this.lastMove){
    //         case 'U':
    //             this.selectedX++;
    //             break;
    //         case 'D':
    //             this.selectedX--;
    //             break;
    //         case 'L':
    //             this.selectedY++;
    //             break;
    //         case 'R':
    //             this.selectedY--;
    //             break;
    //     }

    //     // Remove last letter from player's activity
    //     let temp = Global.player_sequence;
    //     temp = temp.substring(temp.length - 1);

    //     Global.player_sequence = temp;
        
    //     this.lastMove = null;

    //     let previousBlock = this.findBlock(this.selectedX, this.selectedY);                
    //     previousBlock.setSelected(true);

    //     this.btnUndo.interactable = false;
    // },
    onUndoClicked: function(){
        if (this.usedReset) return;

        let level = this._allLevels[this._currentLevel];

        this.loadLevel(level);        
        
        this.btnUndo.interactable = false;
    },

    animatePlayButton: function(){
        this.tween4PlayButton = cc.tween(this.btnPlay.node)
        .to(0.5, { scale: 1.2 })
        .to(0.5, { scale: 1 })
        .call(()=>{ this.animatePlayButton();})
        .start()
    },

    isClockRinging: false,
    update (dt) {
        if (this.state == STATE.TUTORIAL) return;
        if (this.state == STATE.END) return;

        this._timer -= dt;

        if (this._timer > 0){
            let floored = Math.floor(this._timer);
            let formattedNumber = ("0" + floored).slice(-2);
            this.lblTime.string = '00:' + formattedNumber;

            if (this._timer <= 10 && !this.isClockRinging){
                this.tween4Stopwatch = cc.tween(this.stopwatch)
                    .repeat(
                        10,
                        cc.tween()
                            .by(0.5, { angle: -20 })
                            .by(0.5, { angle: 20 })
                    )
                .start();

                this.isClockRinging = true;
            }
        } else {
            Global.newScore = this.score;

            cc.director.loadScene("end_game");
            this.state = STATE.END;
        }
    },
});
