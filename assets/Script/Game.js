cc.Class({
    extends: cc.Component,

    properties: {
        numberPrefab: {default: null, type: cc.Prefab},
        lblError: {default: null, type: cc.Label}
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.nodeWidth = (this.node.width-18*5)/3;

        this.nodeArray = [];
        this.board = [];

        for (let i = 0; i < 9; i++){
            let node = cc.instantiate(this.numberPrefab);
            let k = parseInt(i / 3);
            let j = i % 3;
            node.position = this.getNodePos(k, j);
            node.width = this.nodeWidth;
            node.height = this.nodeWidth;
            this.node.addChild(node);
        }

        this.reset();
    },

    start () {

    },

    reset: function () {
        this.enableTouch();

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
        cc.log(this.startPos);
    },

    onTouchEnd: function (event) {
        let endPos = event.getLocation();

        cc.log(endPos);
        this.lblError.string = 'from:' + this.startPos + ' to:' + endPos;

        let deltaX = endPos.x - this.startPos.x;
        let deltaY = endPos.y - this.startPos.y;
        let offset = 100;
        if (Math.abs(deltaX) < offset && Math.abs(deltaY) < offset) {
            return;
        }
        let direction;
        if (Math.abs(deltaX) >= Math.abs(deltaY)) {
            direction = deltaX>0 ? 'right' : 'left';
        } else {
            direction = deltaY>0 ? 'up' : 'down';
        }
        //this.move(direction);
    },

    getNodePos: function (i, j) {
        let w = this.nodeWidth;
        return cc.p(18*(j+1)+w*j+w/2, -(18*(i+1)+w*i+w/2));
    },

    // update (dt) {},
});
