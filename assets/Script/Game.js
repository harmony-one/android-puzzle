var levelGenerator = require('level_generator.js');

var TOTAL_BLOCK = 9;
var BLOCK_PER_LINE = 3;



cc.Class({
    extends: cc.Component,   

    properties: {
        prefabBlock: {default: null, type: cc.Prefab},
        numberBgArray: {default: [], type: cc.SpriteFrame},
        indicator: cc.Sprite,
        lblScore: cc.Label,
        lblTime: cc.Label,
        lblLevel: cc.Label,
        btnPlay: cc.Button,
        btnUndo: cc.Button,
        lblError: {default: null, type: cc.Label},
        themeMusic: {default: null, type: cc.AudioClip},
        soundMove: {default: null, type: cc.AudioClip},
        soundCantMove: {default: null, type: cc.AudioClip},
    },
    
    onLoad () {
        let spaceX = 11;
        let spaceY = 11;
        let padding = 22;
        this.nodeWidth = (this.node.width - (2 * padding + 2 * spaceX))/3;
        this.nodeHeight = (this.node.height - (2 * padding + 2 * spaceY))/3;

        this._allLevels = levelGenerator.levels();
        cc.log("[All Levels] ", this._allLevels);

        this.listBlockScripts = [];

        this._level = this._allLevels[this._currentLevel];

        this._currentBlock = null;

        for (let i = 0; i < BLOCK_PER_LINE; i++) {
            for (let j = 0; j < BLOCK_PER_LINE; j++){

                let block = cc.instantiate(this.prefabBlock);
                
                block.position = this.getNodePos(i,j);
                block.width = this.nodeWidth;
                block.height = this.nodeHeight;
                block.i = i;
                block.j = j;
                this.node.addChild(block);

                let blockScript = block.getComponent('Block');
                this.listBlockScripts.push(blockScript);                
            }
        }

        this.currentScore = 0;
        this.step = 0;

        this.reset();

        if (this.themeMusic != null){
            cc.audioEngine.playMusic(this.themeMusic, true);
        }
    },

    

    getNumberBgForValue: function (value) {
        let index = 0;
        switch (value) {
            default:
            case 0: index = 0; break;
            case 1: index = 1; break;
            case 2: index = 2; break;
            
        }
        return this.numberBgArray[index];
    },

    getNodePos: function (i, j) {
        let w = this.nodeWidth;
        return cc.v2(18*(j + 1) + w*j + w/2, -(18*(i+1) + w*i + w/2));
    },

    reset: function () {
        this._currentLevel = 0;

        let level = this._allLevels[this._currentLevel];

        this.loadLevel(level);

        this.currentScore = 0;
        this.step = 0;

        this._currentBlock = this.findBlock(this.selectedX, this.selectedY);
        this._currentBlock.setSelected(true);

        this.enableTouch();
    },
    
    loadLevel: function(level){
        let index = 0;
        for (let x = 0; x < BLOCK_PER_LINE; x++) {
            for (let y = 0; y < BLOCK_PER_LINE; y++){
                let number = level.contents[x*y + y];
                let blockScript = this.listBlockScripts[index];
                blockScript.x = x;
                blockScript.y = y;
                
                blockScript.setColorAndValue(this.getSpriteByIndex(number), number);
                blockScript.setSelected(false);
                index++;
            }
        }

        this.selectedX = level.initialSelected.x;
        this.selectedY = level.initialSelected.y;
        cc.log("SELECTED " + this.selectedX + "-" + this.selectedY);
    },

    getSpriteByIndex: function(number){
        let value = number + 1;
        if (number < 0 || number >= this.numberBgArray.length){
            return this.numberBgArray[0]; // "no-number" sprite
        }

        return this.numberBgArray[number];
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
        cc.log("findBlock at (" + x + ", " + y + ")", this.listBlockScripts);
        for(var i = 0; i < this.listBlockScripts.length; i++){
            let block = this.listBlockScripts[i];
            
            if (block.x == x && block.y == y) return block;
        }
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
                if (this.selectedX == BLOCK_PER_LINE - 1) break;

                this.selectedX++;
                canMove = true;
                break;
            case 'left':
                if (this.selectedY == 0) break;

                this.selectedY--;
                canMove = true;
                break;
            case 'right':
                if (this.selectedY == BLOCK_PER_LINE - 1) break;

                this.selectedY++;
                canMove = true;
                break;
        }

        if (canMove){
            let nextBlock = this.findBlock(this.selectedX, this.selectedY);                
            let newValue = nextBlock.value + 1;
            //cc.log("found one, with value: " + nextBlock.number)

            if (newValue >= this.numberBgArray.length){
                nextBlock.setNumber(newValue);
            }
            nextBlock.setColorAndValue(this.getSpriteByIndex(newValue), newValue);

            currentBlock.setSelected(false);
            nextBlock.setSelected(true);

            this.playMoveSound();

            let action = cc.scaleTo(0.05, 1.0, 1.0).easing(cc.easeInOut(3));
            let act = cc.sequence(actionBy, cc.delayTime(0.25), actionBy.reverse());
            nextBlock.parent.runAction(act);
        } else {
            this.playCantMoveSound();
        }
        
        // if (this.canMove) {
        //     this.step++;
        //     this.showMoveAnimation();
            
        //     //playAudio('move');

        //     this.scheduleOnce(()=>{
        //         this.updateBoard();
        //         this.showScaleAnimation(direction);
        //         if (!this.isOver()) {
        //             this.randomNode();
        //             if (this.isOver()) {
        //                 this.disableTouch();
                        
        //                 //this.parent.gameOver();
        //             }
        //         }
        //     }, 0.05);
        // }
    },

    playMoveSound: function(){
        if (this.soundMove == null) return;
        cc.audioEngine.playEffect(this.soundMove);
    },

    playCantMoveSound: function(){
        if (this.soundCantMove == null) return;

        cc.audioEngine.playEffect(this.soundCantMove);
    },

    showMoveAnimation: function () {
        
        this._currentBlock.runAction(cc.moveTo(0.05, this._nextBlock));
    },

    updateBoard: function () {
        // for (let i = 0; i < this.listBlockScripts.length; i++) {
        //     let k = parseInt(i/3);
        //     let j = i%3;
        //     let numberPrefab = this.listBlockScripts[i];
        //     numberPrefab.node.position = this.getNodePos(k,j);
        //     numberPrefab.setNumberxxAndxColor(, );
        // }
    },

    showScaleAnimation: function (direction) {
        // for (let i = 0; i < this.isNeedAnimateArr.length; i++) {
        //     if (this.isNeedAnimateArr[i] !== 0) {
                
        //         let node = this.listBlockScripts[i].node;
        //         let action1 = cc.scaleTo(0.05, 1.2, 1.2);
        //         let action2 = cc.scaleTo(0.05, 1.0, 1.0);
        //         node.runAction(cc.sequence(action1, action2));
                
        //         let animationNode = this.listBlockScripts[i].animationNode;
        //         let positon3 = cc.v2(node.x, node.y);
        //         let positon4 = cc.v2(node.x, node.y);
        //         let amplitude = 10;
        //         switch(direction){
        //         case 'up':
        //             animationNode.rotation = 90;
        //             positon3 = cc.v2(node.x, node.y + amplitude);
        //             break;
        //         case 'down':
        //             animationNode.rotation = -90;
        //             positon3 = cc.v2(node.x, node.y - amplitude);
        //             break;
        //         case 'left':
        //             animationNode.rotation = 0;
        //             positon3 = cc.v2(node.x - amplitude, node.y);
        //             break;
        //         case 'right':
        //             animationNode.rotation = 180;
        //             positon3 = cc.v2(node.x + amplitude, node.y);
        //             break;
        //         }
        //         animationNode.active = true;
        //         // Configure.playAnimation(animationNode, 'impact', 'Normal', function () {
        //         //     animationNode.active = false;
        //         // });
        //         let action3 = cc.moveTo(0.05, positon3);
        //         let action4 = cc.moveTo(0.05, positon4);
        //         node.runAction(cc.sequence(action3, action4));
        //     }
        // }
    },

    isOver: function () {
        return false;
    },

    // update (dt) {},
});
