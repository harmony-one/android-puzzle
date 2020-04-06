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
var u = i[o] = {
exports: {}
};
t[o][0].call(u.exports, function(e) {
return c(t[o][1][e] || e);
}, u, u.exports, e, t, i, n);
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
if (Global.isLoggedIn()) {
this.panelGuest.active = !1;
this.panelAuthenticated.active = !0;
}
},
onLoginClicked: function() {
if (Global.isAndroid()) {
Global.getKeystore();
this.lblWelcome.string = "Welcome!";
Global.showAlertDialog("Welcome!, your public key: \n" + Global.myKeystore);
}
this.panelGuest.active = !1;
this.panelAuthenticated.active = !0;
},
onCreateKeystoreClicked: function() {
Global.isAndroid() && Global.gotoSamsungBlockchainKeystoreMenu();
},
onSaveClicked: function() {
Global.isAndroid() && Global.restUpdateScore();
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
Entry: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "0eff6fHW9ZJqbcebTF5iL8z", "Entry");
cc.Class({
extends: cc.Component,
properties: {
rank: cc.Label,
key: cc.Label,
score: cc.Label,
medal: cc.Sprite
},
setup: function(e, t, i, n) {
this.rank.string = e;
this.key.string = t;
this.score.string = i;
this.medal.spriteFrame = n;
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
state: n,
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
Global.player_sequence = "";
var e = this._allLevels[this._currentLevel];
this.loadLevel(e);
this.disableTouch();
this.animatePlayButton();
},
loadLevel: function(e) {
Global.board_state = "";
for (var t = "", i = 0; i < e.contents.length; i++) {
var n = e.contents[i], c = i % 3, s = Math.floor(i / 3), o = this.findBlock(s, c);
o.setSelected(!1);
o.setColorAndValue(this.getSpriteByValue(n), n);
t += n;
}
Global.board_state = t;
this.selectedX = e.initialSelected.x;
this.selectedY = e.initialSelected.y;
cc.log("SELECTED " + this.selectedX + "-" + this.selectedY, "finding node...");
var l = this.findBlock(this.selectedX, this.selectedY);
null != l && l.setSelected(!0);
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
var t = e.getLocation(), i = t.x - this.startPos.x, n = t.y - this.startPos.y;
if (!(Math.abs(i) < 80 && Math.abs(n) < 80)) {
var c = void 0;
c = Math.abs(i) >= Math.abs(n) ? i > 0 ? "R" : "L" : n > 0 ? "U" : "D";
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
case "U":
if (0 == this.selectedX) break;
this.selectedX--;
t = !0;
break;

case "D":
if (2 == this.selectedX) break;
this.selectedX++;
t = !0;
break;

case "L":
if (0 == this.selectedY) break;
this.selectedY--;
t = !0;
break;

case "R":
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
Global.player_sequence += e;
this.lastMove = e;
this.btnUndo.interactable = !0;
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
Global.restUpdateScore();
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
case "U":
this.selectedX++;
break;

case "D":
this.selectedX--;
break;

case "L":
this.selectedY++;
break;

case "R":
this.selectedY--;
}
var i = Global.player_sequence;
i = i.substring(i.length - 1);
Global.player_sequence = i;
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
} else if (this.state == c) {
Global.newScore = this.score;
cc.director.loadScene("end_game");
this.state = s;
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
newScore: 0,
board_state: "",
player_sequence: "",
isAndroid: function() {
return cc.sys.os == cc.sys.OS_ANDROID;
},
isLoggedIn: function() {
var e = localStorage.getItem("my_keystore");
return null != e && e.length > 10;
},
getKeystore: function() {
this.myKeystore = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "getKeystore", "()Ljava/lang/String;");
localStorage.setItem("my_keystore", this.myKeystore);
return this.myKeystore;
},
getScore: function() {
return jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "getScore", "()I");
},
updateScore: function() {
if (!(this.newScore <= 0)) {
this.getScore();
this.newScore;
}
},
getLeaderboard: function() {
return jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "getLeaderboard", "()Ljava/lang/String;");
},
showAlertDialog: function(e) {
return jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "showAlertDialog", "(Ljava/lang/String;)V", e);
},
gotoSamsungBlockchainKeystoreMenu: function() {
return jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "gotoSamsungBlockchainKeystoreMenu", "()V");
},
restUpdateScore: function() {
var e = "address=" + this.myKeystore + "&score=" + this.newScore + "&board_state=" + this.board_state + "&sequence=" + this.player_sequence;
cc.log("PARAMZ ", e);
},
restGetLeaderBoard: function(e) {
var t = new XMLHttpRequest();
t.open("GET", "http://ec2-54-212-193-72.us-west-2.compute.amazonaws.com:8080/api/leader_boards", !0);
t.onreadystatechange = function() {
if (4 == t.readyState && t.status >= 200 && t.status < 400) {
var i = t.responseText;
e(i);
}
};
t.send(null);
}
};
cc._RF.pop();
}, {} ],
Leadearboard: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "e4231kRB6FO7qKfwfFVqxPB", "Leadearboard");
cc.Class({
extends: cc.Component,
properties: {
entriesRoot: cc.Node,
prefabEntry: cc.Prefab,
medalSprites: {
default: [],
type: cc.SpriteFrame
}
},
start: function() {
var e = "", t = null;
Global.isAndroid();
var i = this;
Global.restGetLeaderBoard(function(n) {
e = n;
var c = JSON.parse(e);
cc.log("json string", e);
t = c.leaders;
cc.log("Entries", t);
t.sort(function(e, t) {
return e.score > t.score ? 1 : -1;
});
var s = 1;
t.forEach(function(e) {
var t = cc.instantiate(i.prefabEntry), n = t.getComponent("Entry"), c = i.medalSprites[i.medalSprites.length - 1];
1 != s && 2 != s || (c = i.medalSprites[s - 1]);
var o = e.address.slice(0, 10) + "...";
n.setup(s, o, e.score, c);
i.entriesRoot.addChild(t);
s++;
});
});
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
var u = this.randRange(0, 9), h = [];
a[u] -= 1;
for (r = 0; r < o; r++) {
var d = -1;
do {
d = this.randRange(0, 4);
} while (!this.possible(a, u, d));
switch (d) {
case 0:
u -= 3;
h.push('"d"');
r + 1 != o && (a[u] -= 1);
break;

case 1:
u += 3;
h.push('"u"');
r + 1 != o && (a[u] -= 1);
break;

case 2:
u -= 1;
h.push('"r"');
r + 1 != o && (a[u] -= 1);
break;

case 3:
u += 1;
h.push('"l"');
r + 1 != o && (a[u] -= 1);
}
}
var p = u % 3, f = Math.floor(u / 3);
h = h.reverse();
l.contents = a;
l.initialSelected = {};
l.initialSelected.x = f;
l.initialSelected.y = p;
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
}, {}, [ "Block", "EndGame", "Entry", "Game", "Global", "Leadearboard", "LevelGenerator", "SplashScript" ]);