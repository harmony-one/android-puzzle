var BLOCKS_PER_ROW = 3;
var BLOCK_WIDTH = 18;
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

        if (this.themeMusic != null){
            cc.audioEngine.playMusic(this.themeMusic, true);
        }

        if (this.isAndroid()){            
            let result = this.sum2NumbersFromJava(123, 456);
            this.lblError.string = result;

            this.apiInitBlockchain();
        }
        
        
        // let ii = 10;
        // this.schedule(function(){
        //     this.lblError.string = ii;
        //     ii+= 10;
        // }, 2);

    },

    isAndroid: function() {
        return cc.sys.os == cc.sys.OS_ANDROID;
    },

    sum2NumbersFromJava: function(a, b){        
        return jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "sum", "(II)I", a, b);
    },

    apiInitBlockchain: function() {
        jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "initBlockchain", "()V");
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
            
            block.width = this.nodeWidth;
            block.height = this.nodeHeight;
            
            let x = i % BLOCKS_PER_ROW;
            let y = Math.floor(i / BLOCKS_PER_ROW);
            block.position = this.getNodePosition(x, y);

            this.node.addChild(block);

            let script = block.getComponent('Block');
            script.x = x;
            script.y = y;
            this.listBlockScripts.push(script);                
        }
    },

    getNodePosition: function (x, y) {
        let w = this.nodeWidth;
        return cc.v2(BLOCK_WIDTH*(y + 1) + w*y + w/2, -(BLOCK_WIDTH*(x+1) + w*x + w/2));
    },

    reset: function () {
        this.state = STATE.TUTORIAL;
        this.score = 0;
        this._currentLevel = 0;
        this._timer = 0;

        let level = this._allLevels[this._currentLevel];

        this.loadLevel(level);

        this.disableTouch();

        this.animatePlayButton();
    },
    
    loadLevel: function(level){
        for (let i = 0; i < level.contents.length; i++) {
            let value = level.contents[i];

            let y = i % BLOCKS_PER_ROW;
            let x = Math.floor(i / BLOCKS_PER_ROW);

            let block = this.findBlock(x, y);
            block.setSelected(false);
            
            block.setColorAndValue(this.getSpriteByValue(value), value);
        }

        this.selectedX = level.initialSelected.x;
        this.selectedY = level.initialSelected.y;
        cc.log("SELECTED " + this.selectedX + "-" + this.selectedY, "finding node...");

        let selectedBlock = this.findBlock(this.selectedX, this.selectedY);
        if (selectedBlock != null){
            selectedBlock.setSelected(true);
        }

        this.lblLevel.string = (this._currentLevel + 1) + "/100";
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
    },

    onTouchEnd: function (event) {
        let endPos = event.getLocation();

        let deltaX = endPos.x - this.startPos.x;
        let deltaY = endPos.y - this.startPos.y;

        let offset = 80;
        if (Math.abs(deltaX) < offset && 
            Math.abs(deltaY) < offset) {
            return;
        }

        let direction;
        if (Math.abs(deltaX) >= Math.abs(deltaY)) {
            direction = deltaX > 0 ? 'right' : 'left';
        } else {
            direction = deltaY > 0 ? 'up' : 'down';
        }

        this.lblError.string = direction;

        this.tryMove(direction);
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

    tryMove: function (direction) {
        let canMove = false;

        let currentBlock = this.findBlock(this.selectedX, this.selectedY);

        switch (direction){
            case 'up':
                if (this.selectedX == 0) break;

                this.selectedX--;
                canMove = true;
                break;
            case 'down':
                if (this.selectedX == BLOCKS_PER_ROW - 1) break;

                this.selectedX++;
                canMove = true;
                break;
            case 'left':
                if (this.selectedY == 0) break;

                this.selectedY--;
                canMove = true;
                break;
            case 'right':
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

    onUndoClicked: function(){

    },

    animatePlayButton: function(){
        this.tween4PlayButton = cc.tween(this.btnPlay.node)
        .to(0.5, { scale: 1.2 })
        .to(0.5, { scale: 1 })
        .call(()=>{ this.animatePlayButton();})
        .start()
    },

    update (dt) {
        this._timer -= dt;

        if (this._timer > 0){
            let floored = Math.floor(this._timer);
            let formattedNumber = ("0" + floored).slice(-2);
            this.lblTime.string = '00:' + formattedNumber;
        } else if (this.state == STATE.STARTED) {
            cc.director.loadScene("end_game");
            this.state = STATE.END;
        }
    },
});
