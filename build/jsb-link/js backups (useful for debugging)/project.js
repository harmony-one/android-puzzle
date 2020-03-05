window.__require = function e(t, i, n) {
function c(o, l) {
if (!i[o]) {
if (!t[o]) {
var a = o.split("/");
a = a[a.length - 1];
if (!t[a]) {
var r = "function" == typeof __require && __require;
if (!l && r) return r(a, !0);
if (s) return s(a, !0);
throw new Error("Cannot find module '" + o + "'");
}
}
var h = i[o] = {
exports: {}
};
t[o][0].call(h.exports, function(e) {
return c(t[o][1][e] || e);
}, h, h.exports, e, t, i, n);
}
return i[o].exports;
}
for (var s = "function" == typeof __require && __require, o = 0; o < n.length; o++) c(n[o]);
return c;
}({
Block: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "89334GVgj1MkaQ0C/zPbcJf", "Block");
cc.Class({
extends: cc.Component,
properties: {
x: -1,
y: -1,
value: 0,
number: cc.Label,
sprite: cc.Sprite,
selected: cc.Sprite,
animationNode: cc.Sprite
},
onLoad: function() {},
setColorAndValue: function(e, t) {
this.value = t;
this.sprite.spriteFrame = e;
this.setNumber(t);
},
setNumber: function(e) {
this.number.string = e;
},
setSelected: function(e) {
this.selected.enabled = e;
e && this.animate();
},
animate: function() {
cc.tween(this.node).to(.08, {
scale: 1.06
}).to(.08, {
scale: 1
}).start();
}
});
cc._RF.pop();
}, {} ],
EndGame: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "83178yEnslO66ZUZISIERtM", "EndGame");
cc.Class({
extends: cc.Component,
properties: {},
start: function() {},
isAndroid: function() {
return cc.sys.os == cc.sys.OS_ANDROID;
},
apiInitBlockchain: function() {
jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "initBlockchain", "()V");
},
onLoginClicked: function() {
jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "toast", "(Ljava/lang/String;)V", "Login clicked");
this.apiInitBlockchain();
},
onPlayAgainClicked: function() {
cc.director.loadScene("game");
},
onLeaderboardClicked: function() {
cc.director.loadScene("leader_board");
}
});
cc._RF.pop();
}, {} ],
Game: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "918870dx+VCSJisaYjAnxgN", "Game");
var n = 0, c = 1, s = 2;
cc.Class({
extends: cc.Component,
properties: {
prefabBlock: {
default: null,
type: cc.Prefab
},
levelGenerator: {
default: null,
type: cc.Node
},
numberBgArray: {
default: [],
type: cc.SpriteFrame
},
lblScore: cc.Label,
lblTime: cc.Label,
lblLevel: cc.Label,
btnPlay: cc.Button,
btnUndo: cc.Button,
lblError: {
default: null,
type: cc.Label
},
tutorialLine: {
default: null,
type: cc.Sprite
},
themeMusic: {
default: null,
type: cc.AudioClip
},
soundMove: {
default: null,
type: cc.AudioClip
},
soundCantMove: {
default: null,
type: cc.AudioClip
},
soundWin: {
default: null,
type: cc.AudioClip
},
soundButtonClick: {
default: null,
type: cc.AudioClip
}
},
state: n,
onLoad: function() {
this.nodeWidth = (this.node.width - 66) / 3;
this.nodeHeight = (this.node.height - 66) / 3;
this.generateAllLevels();
this._currentLevel = 0;
var e = this._allLevels[this._currentLevel];
this.instantiateBlocks(e);
this.reset();
null != this.themeMusic && cc.audioEngine.playMusic(this.themeMusic, !0);
if (this.isAndroid()) {
var t = this.sum2NumbersFromJava(123, 456);
this.lblError.string = t;
}
},
isAndroid: function() {
return cc.sys.os == cc.sys.OS_ANDROID;
},
sum2NumbersFromJava: function(e, t) {
return jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "sum", "(II)I", e, t);
},
apiInitBlockchain: function() {
jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "initBlockchain", "()V");
},
generateAllLevels: function() {
var e = this.levelGenerator.getComponent("LevelGenerator");
this._allLevels = e.levels();
cc.log("[All Levels] ", this._allLevels);
},
instantiateBlocks: function() {
this.listBlockScripts = [];
for (var e = 0; e < 9; e++) {
var t = cc.instantiate(this.prefabBlock);
t.width = this.nodeWidth;
t.height = this.nodeHeight;
var i = e % 3, n = Math.floor(e / 3);
t.position = this.getNodePosition(i, n);
this.node.addChild(t);
var c = t.getComponent("Block");
c.x = i;
c.y = n;
this.listBlockScripts.push(c);
}
},
getNodePosition: function(e, t) {
var i = this.nodeWidth;
return cc.v2(18 * (t + 1) + i * t + i / 2, -(18 * (e + 1) + i * e + i / 2));
},
reset: function() {
this.state = n;
this.score = 0;
this._currentLevel = 0;
this._timer = 0;
var e = this._allLevels[this._currentLevel];
this.loadLevel(e);
this.disableTouch();
this.animatePlayButton();
},
loadLevel: function(e) {
for (var t = 0; t < e.contents.length; t++) {
var i = e.contents[t], n = t % 3, c = Math.floor(t / 3), s = this.findBlock(c, n);
s.setSelected(!1);
s.setColorAndValue(this.getSpriteByValue(i), i);
}
this.selectedX = e.initialSelected.x;
this.selectedY = e.initialSelected.y;
cc.log("SELECTED " + this.selectedX + "-" + this.selectedY, "finding node...");
var o = this.findBlock(this.selectedX, this.selectedY);
null != o && o.setSelected(!0);
this.lblLevel.string = this._currentLevel + 1 + "/100";
},
getSpriteByValue: function(e) {
var t = e % this.numberBgArray.length;
return this.numberBgArray[t];
},
enableTouch: function() {
this.node.parent.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
this.node.parent.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
},
disableTouch: function() {
this.node.parent.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
this.node.parent.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
},
onTouchStart: function(e) {
this.startPos = e.getLocation();
},
onTouchEnd: function(e) {
var t = e.getLocation(), i = t.x - this.startPos.x, n = t.y - this.startPos.y;
if (!(Math.abs(i) < 80 && Math.abs(n) < 80)) {
var c = void 0;
c = Math.abs(i) >= Math.abs(n) ? i > 0 ? "right" : "left" : n > 0 ? "up" : "down";
this.lblError.string = c;
this.tryMove(c);
}
},
findBlock: function(e, t) {
for (var i = 0; i < this.listBlockScripts.length; i++) {
var n = this.listBlockScripts[i];
if (n.x == e && n.y == t) return n;
}
cc.log("findBlock: FAILED at index ", i);
},
tryMove: function(e) {
var t = !1, i = this.findBlock(this.selectedX, this.selectedY);
switch (e) {
case "up":
if (0 == this.selectedX) break;
this.selectedX--;
t = !0;
break;

case "down":
if (2 == this.selectedX) break;
this.selectedX++;
t = !0;
break;

case "left":
if (0 == this.selectedY) break;
this.selectedY--;
t = !0;
break;

case "right":
if (2 == this.selectedY) break;
this.selectedY++;
t = !0;
}
if (t) {
if (this.btnPlay.enabled) {
this.btnPlay.node.active = !1;
this.btnUndo.node.active = !0;
this.tutorialLine.enabled = !1;
this.state = c;
}
var n = this.findBlock(this.selectedX, this.selectedY), s = n.value + 1;
n.setColorAndValue(this.getSpriteByValue(s), s);
i.setSelected(!1);
n.setSelected(!0);
this.playMoveSound();
if (this.isPlayerWin()) {
cc.audioEngine.playEffect(this.soundWin);
this.score += this.calculateScore();
this.lblScore.string = this.score;
this.gotoNextLevel();
}
} else {
i.animate();
this.playInvalidMoveSound();
}
},
gotoNextLevel: function() {
this._currentLevel++;
this._timer = this.getTimeByLevel(this._currentLevel);
this.lblLevel.string = this._currentLevel + 1 + "/100";
var e = this._allLevels[this._currentLevel];
this.loadLevel(e);
},
calculateScore: function() {
return (this._currentLevel + 1) * Math.floor(this._timer);
},
getTimeByLevel: function(e) {
return e <= 2 ? 20 : e <= 5 ? 30 : e <= 10 ? 25 : e <= 20 ? 20 : 15;
},
isPlayerWin: function() {
for (var e = this.listBlockScripts[0].value, t = 1; t < this.listBlockScripts.length; t++) if (this.listBlockScripts[t].value != e) return !1;
return !0;
},
playMoveSound: function() {
null != this.soundMove && cc.audioEngine.playEffect(this.soundMove);
},
playInvalidMoveSound: function() {
null != this.soundCantMove && cc.audioEngine.playEffect(this.soundCantMove);
},
onPlayClicked: function() {
this.enableTouch();
this.tween4PlayButton.stop();
this.btnPlay.node.scale = 1;
this._timer = this.getTimeByLevel(this._currentLevel);
cc.audioEngine.playEffect(this.soundButtonClick);
this.findBlock(this.selectedX, this.selectedY).animate();
},
onUndoClicked: function() {},
animatePlayButton: function() {
var e = this;
this.tween4PlayButton = cc.tween(this.btnPlay.node).to(.5, {
scale: 1.2
}).to(.5, {
scale: 1
}).call(function() {
e.animatePlayButton();
}).start();
},
update: function(e) {
this._timer -= e;
if (this._timer > 0) {
var t = ("0" + Math.floor(this._timer)).slice(-2);
this.lblTime.string = "00:" + t;
} else if (this.state == c) {
cc.director.loadScene("end_game");
this.state = s;
}
}
});
cc._RF.pop();
}, {} ],
Leadearboard: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "e4231kRB6FO7qKfwfFVqxPB", "Leadearboard");
cc.Class({
extends: cc.Component,
properties: {},
start: function() {},
onPlayAgainClicked: function() {
cc.director.loadScene("game");
},
onBackClicked: function() {
cc.director.loadScene("end_game");
}
});
cc._RF.pop();
}, {} ],
LevelGenerator: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "3ffbfo+zY9GiJgho3eM08Wb", "LevelGenerator");
cc.Class({
extends: cc.Component,
randRange: function(e, t) {
return Math.floor(Math.random() * (t - e) + e);
},
getDifficulty: function(e) {
return 1 == e ? 1 : e >= 2 && e <= 3 ? 2 : e >= 4 && e <= 5 ? 3 : e >= 6 && e <= 7 ? 4 : e >= 8 && e <= 10 ? 5 : e >= 11 && e <= 20 ? 7 : e >= 21 && e <= 40 ? 8 : e >= 41 && e <= 60 ? 9 : e >= 61 && e <= 80 ? 10 : e >= 81 && e <= 90 ? 11 : e >= 91 && e <= 95 ? 12 : 96 == e ? 13 : 97 == e ? 14 : 98 == e ? 15 : 99 == e ? 16 : 17;
},
possible: function(e, t, i) {
return -1 != i && ((0 != i || 0 != Math.floor(t / 3)) && ((1 != i || 2 != Math.floor(t / 3)) && ((2 != i || t % 3 != 0) && (3 != i || t % 3 != 2))));
},
levels: function() {
for (var e, t = new Array(100), i = 1; i < 101; i++) {
var n = 3 * (e = this.getDifficulty(i)), c = 4 * e, s = i + 3, o = this.randRange(n, c), l = {}, a = [];
if (1 == i) {
a = [ 1, 0, 0, 1, 1, 0, 1, 1, 0 ];
l.contents = a;
l.initialSelected = {};
l.initialSelected.x = 0;
l.initialSelected.y = 0;
t[i - 1] = l;
} else {
for (var r = 0; r < 9; r++) a.push(s);
var h = this.randRange(0, 9), u = [];
a[h] -= 1;
for (r = 0; r < o; r++) {
var d = -1;
do {
d = this.randRange(0, 4);
} while (!this.possible(a, h, d));
switch (d) {
case 0:
h -= 3;
u.push('"d"');
r + 1 != o && (a[h] -= 1);
break;

case 1:
h += 3;
u.push('"u"');
r + 1 != o && (a[h] -= 1);
break;

case 2:
h -= 1;
u.push('"r"');
r + 1 != o && (a[h] -= 1);
break;

case 3:
h += 1;
u.push('"l"');
r + 1 != o && (a[h] -= 1);
}
}
var f = h % 3, p = Math.floor(h / 3);
u = u.reverse();
l.contents = a;
l.initialSelected = {};
l.initialSelected.x = p;
l.initialSelected.y = f;
t[i - 1] = l;
}
}
return t;
}
});
cc._RF.pop();
}, {} ],
SplashScript: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "280c3rsZJJKnZ9RqbALVwtK", "SplashScript");
cc.Class({
extends: cc.Component,
onLoad: function() {
var e = cc.delayTime(1.5), t = cc.sequence(e, cc.callFunc(this.loadGameScene.bind(this)));
this.node.runAction(t);
},
loadGameScene: function() {
cc.director.loadScene("game");
},
update: function(e) {}
});
cc._RF.pop();
}, {} ]
}, {}, [ "Block", "EndGame", "Game", "Leadearboard", "LevelGenerator", "SplashScript" ]);