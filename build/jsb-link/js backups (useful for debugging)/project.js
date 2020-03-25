window.__require = function e(t, i, c) {
function n(s, l) {
if (!i[s]) {
if (!t[s]) {
var a = s.split("/");
a = a[a.length - 1];
if (!t[a]) {
var r = "function" == typeof __require && __require;
if (!l && r) return r(a, !0);
if (o) return o(a, !0);
throw new Error("Cannot find module '" + s + "'");
}
}
var h = i[s] = {
exports: {}
};
t[s][0].call(h.exports, function(e) {
return n(t[s][1][e] || e);
}, h, h.exports, e, t, i, c);
}
return i[s].exports;
}
for (var o = "function" == typeof __require && __require, s = 0; s < c.length; s++) n(c[s]);
return n;
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
properties: {
score: {
default: null,
type: cc.Label
},
score2: {
default: null,
type: cc.Label
},
lblWelcome: {
default: null,
type: cc.Label
},
panelGuest: {
default: null,
type: cc.Node
},
panelAuthenticated: {
default: null,
type: cc.Node
}
},
start: function() {
this.score.string = Global.newScore;
this.score2.string = Global.newScore;
},
onLoginClicked: function() {
if (Global.isAndroid()) {
Global.getKeystore();
var e = Global.getUserName();
this.lblWelcome.string = "Welcome, " + e;
Global.showAlertDialog("Hello, " + e);
}
this.panelGuest.active = !1;
this.panelAuthenticated.active = !0;
},
onCreateKeystoreClicked: function() {
Global.showAlertDialog("Please go to Settings > Biometrics & Security > Samsung Blockchain Keystore \n To create your keystore");
},
onSaveClicked: function() {
if (Global.isAndroid()) {
Global.updateScore();
Global.showAlertDialog("Your score has been updated");
}
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
var c = 0, n = 1, o = 2;
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
stopwatch: {
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
state: c,
lastMove: null,
onLoad: function() {
this.nodeWidth = (this.node.width - 66) / 3;
this.nodeHeight = (this.node.height - 66) / 3;
this.generateAllLevels();
this._currentLevel = 0;
var e = this._allLevels[this._currentLevel];
this.instantiateBlocks(e);
this.reset();
null != this.themeMusic && cc.audioEngine.playMusic(this.themeMusic, !0);
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
var i = e % 3, c = Math.floor(e / 3);
t.position = this.getNodePosition(i, c);
this.node.addChild(t);
var n = t.getComponent("Block");
n.x = i;
n.y = c;
this.listBlockScripts.push(n);
}
},
getNodePosition: function(e, t) {
var i = this.nodeWidth;
return cc.v2(18 * (t + 1) + i * t + i / 2, -(18 * (e + 1) + i * e + i / 2));
},
reset: function() {
this.state = c;
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
var i = e.contents[t], c = t % 3, n = Math.floor(t / 3), o = this.findBlock(n, c);
o.setSelected(!1);
o.setColorAndValue(this.getSpriteByValue(i), i);
}
this.selectedX = e.initialSelected.x;
this.selectedY = e.initialSelected.y;
cc.log("SELECTED " + this.selectedX + "-" + this.selectedY, "finding node...");
var s = this.findBlock(this.selectedX, this.selectedY);
null != s && s.setSelected(!0);
this.lblLevel.string = this._currentLevel + 1 + "/100";
this.btnUndo.interactable = !1;
null != this.tween4Stopwatch && this.tween4Stopwatch.stop();
this.isClockRinging = !1;
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
var t = e.getLocation(), i = t.x - this.startPos.x, c = t.y - this.startPos.y;
if (!(Math.abs(i) < 80 && Math.abs(c) < 80)) {
var n = void 0;
n = Math.abs(i) >= Math.abs(c) ? i > 0 ? "right" : "left" : c > 0 ? "up" : "down";
this.tryMove(n);
}
},
findBlock: function(e, t) {
for (var i = 0; i < this.listBlockScripts.length; i++) {
var c = this.listBlockScripts[i];
if (c.x == e && c.y == t) return c;
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
this.state = n;
}
this.lastMove = e;
this.btnUndo.interactable = !0;
var c = this.findBlock(this.selectedX, this.selectedY), o = c.value + 1;
c.setColorAndValue(this.getSpriteByValue(o), o);
i.setSelected(!1);
c.setSelected(!0);
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
onUndoClicked: function() {
if (null != this.lastMove) {
var e = this.findBlock(this.selectedX, this.selectedY), t = e.value - 1;
e.setColorAndValue(this.getSpriteByValue(t), t);
e.setSelected(!1);
switch (this.lastMove) {
case "up":
this.selectedX++;
break;

case "down":
this.selectedX--;
break;

case "left":
this.selectedY++;
break;

case "right":
this.selectedY--;
}
this.lastMove = null;
this.findBlock(this.selectedX, this.selectedY).setSelected(!0);
this.btnUndo.interactable = !1;
}
},
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
isClockRinging: !1,
update: function(e) {
this._timer -= e;
if (this._timer > 0) {
var t = ("0" + Math.floor(this._timer)).slice(-2);
this.lblTime.string = "00:" + t;
if (this._timer <= 10 && !this.isClockRinging) {
this.tween4Stopwatch = cc.tween(this.stopwatch).repeat(10, cc.tween().by(.5, {
angle: -20
}).by(.5, {
angle: 20
})).start();
this.isClockRinging = !0;
}
} else if (this.state == n) {
Global.newScore = this.score;
cc.director.loadScene("end_game");
this.state = o;
}
}
});
cc._RF.pop();
}, {} ],
Global: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "9bf09yemltMJ6LDPqxBrroN", "Global");
window.Global = {
myKeystore: "",
leaderboard: "",
newScore: 0,
isAndroid: function() {
return cc.sys.os == cc.sys.OS_ANDROID;
},
getKeystore: function() {
this.myKeystore = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "getKeystore", "()Ljava/lang/String;");
return this.myKeystore;
},
getScore: function() {
return jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "getScore", "()I");
},
getUserName: function() {
return jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "getUserName", "()Ljava/lang/String;");
},
updateScore: function() {
if (!(this.newScore <= 0)) {
var e = this.getScore();
this.newScore > e && jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "updateScore", "(I)V", this.newScore);
}
},
getLeaderboard: function() {
this.leaderboard = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "getLeaderboard", "()Ljava/lang/String;");
},
showAlertDialog: function(e) {
return jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "showAlertDialog", "(Ljava/lang/String;)V", e);
}
};
cc._RF.pop();
}, {} ],
Leadearboard: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "e4231kRB6FO7qKfwfFVqxPB", "Leadearboard");
cc.Class({
extends: cc.Component,
properties: {},
start: function() {
Global.getLeaderboard();
},
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
var c = 3 * (e = this.getDifficulty(i)), n = 4 * e, o = i + 3, s = this.randRange(c, n), l = {}, a = [];
if (1 == i) {
a = [ 1, 0, 0, 1, 1, 0, 1, 1, 0 ];
l.contents = a;
l.initialSelected = {};
l.initialSelected.x = 0;
l.initialSelected.y = 0;
t[i - 1] = l;
} else {
for (var r = 0; r < 9; r++) a.push(o);
var h = this.randRange(0, 9), d = [];
a[h] -= 1;
for (r = 0; r < s; r++) {
var u = -1;
do {
u = this.randRange(0, 4);
} while (!this.possible(a, h, u));
switch (u) {
case 0:
h -= 3;
d.push('"d"');
r + 1 != s && (a[h] -= 1);
break;

case 1:
h += 3;
d.push('"u"');
r + 1 != s && (a[h] -= 1);
break;

case 2:
h -= 1;
d.push('"r"');
r + 1 != s && (a[h] -= 1);
break;

case 3:
h += 1;
d.push('"l"');
r + 1 != s && (a[h] -= 1);
}
}
var f = h % 3, p = Math.floor(h / 3);
d = d.reverse();
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
}, {}, [ "Block", "EndGame", "Game", "Global", "Leadearboard", "LevelGenerator", "SplashScript" ]);