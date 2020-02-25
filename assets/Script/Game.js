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
    },
    
    onLoad () {
        let spaceX = 11;
        let spaceY = 11;
        let padding = 22;
        this.nodeWidth = (this.node.width - (2 * padding + 2 * spaceX))/3;
        this.nodeHeight = (this.node.height - (2 * padding + 2 * spaceY))/3;

        this.listBlockScripts = [];

        this.boardData = [
                            [2, 1, 1],
                            [2, 2, 1],
                            [2, 2, 1]
                        ];

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
                let number = this.boardData[i][j];
                blockScript.setNumberAndColor(number, this.numberBgArray[number]);
                

                this.listBlockScripts.push(blockScript);

                if (this._currentBlock == null){
                    this._currentBlock = block;
                }
            }
        }

        this.indicator.position = this._currentBlock.position;

        this.currentScore = 0;
        this.step = 0;

        this.reset();
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
        let k = 0;
        for (let i = 0; i < BLOCK_PER_LINE; i++) {
            for (let j = 0; j < BLOCK_PER_LINE; j++){
                let number = this.boardData[i][j];
                let blockScript = this.listBlockScripts[k];
                blockScript.i = i;
                blockScript.j = j;
                
                blockScript.setNumberAndColor(number, this.numberBgArray[number]);
                k++;
            }
        }
        this.currentScore = 0;
        this.step = 0;

        this._currentBlock = null;

        this.enableTouch();
    },

    randomNode: function () {
        // let zeroArr = [];
        // for (let i = 0; i < this.listBlockScripts.length; i++) {
        //     if (this.listBlockScripts[i].number === 0) {
        //         zeroArr.push(i);
        //     }
        // }
        // if (zeroArr.length !== 0) {
        //     let index = Math.floor(Math.random() * zeroArr.length);
        //     if (index === zeroArr.length) {
        //         index = zeroArr.length - 1;
        //     }
        //     let ranNum = Math.random() < 0.5 ? 1 : 2;
        //     let tmpNumberPrefab = this.listBlockScripts[zeroArr[index]];
        //     tmpNumberPrefab.setNumberAndColor(ranNum, this.numberBgArray[ranNum]);
        //     if (this.newNodeShowAnimation) {
        //         let node = tmpNumberPrefab.node;
        //         node.scale = 0.1;
        //         let action1 = cc.scaleTo(0.05,1.0,1.0).easing(cc.easeInOut(3));
        //         node.runAction(action1);
        //     }
        // }
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

        let offset = 100;
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
    
    findBlock: function(i, j){
        cc.log("findBlock at (" + i + ", " + j + ")", this.listBlockScripts);
        for(var k = 0; k < this.listBlockScripts.length; k++){
            let element = this.listBlockScripts[k];
            
            if (element.i == i && element.j == j) return element;
        }
    },

    tryMove: function (direction) {
        
        let script = this.listBlockScripts[0];
        let i = script.i;
        let j = script.j;

        cc.log(i, j);
        let canMove = false;
        switch (direction){
            case 'up':
                if (i == 0) {
                    alert("can't move");
                    return;
                }

                i--;
                canMove = true;
                break;
            case 'down':
                if (i == BLOCK_PER_LINE - 1) {
                    alert("can't move");
                    return;
                }

                i++;
                canMove = true;
                break;
            case 'left':
                if (j == 0) {
                    alert("can't move");
                    return;
                }

                j--;
                canMove = true;
                break;
            case 'right':
                if (j == BLOCK_PER_LINE - 1) {
                    alert("can't move");
                    return;
                }

                j++;
                canMove = true;
                break;
        }

        if (canMove){
            let nextBlock = this.findBlock(i, j);                
            let newValue = parseInt(nextBlock.number.string) + 1;
            //cc.log("found one, with value: " + nextBlock.number)
            nextBlock.setNumber(newValue);
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

    showMoveAnimation: function () {
        this._currentBlock.runAction(cc.moveTo(0.05, this._nextBlock));
    },

    updateBoard: function () {
        // for (let i = 0; i < this.listBlockScripts.length; i++) {
        //     let k = parseInt(i/3);
        //     let j = i%3;
        //     let numberPrefab = this.listBlockScripts[i];
        //     numberPrefab.node.position = this.getNodePos(k,j);
        //     numberPrefab.setNumberAndColor(, );
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
