window.__require = function e(t, i, o) {
function n(c, s) {
if (!i[c]) {
if (!t[c]) {
var a = c.split("/");
a = a[a.length - 1];
if (!t[a]) {
var r = "function" == typeof __require && __require;
if (!s && r) return r(a, !0);
if (l) return l(a, !0);
throw new Error("Cannot find module '" + c + "'");
}
}
var d = i[c] = {
exports: {}
};
t[c][0].call(d.exports, function(e) {
return n(t[c][1][e] || e);
}, d, d.exports, e, t, i, o);
}
return i[c].exports;
}
for (var l = "function" == typeof __require && __require, c = 0; c < o.length; c++) n(o[c]);
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
DialogBox: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "9c515QSqVdGj4bHCOMnzXYO", "DialogBox");
cc.Class({
extends: cc.Component,
properties: {
lblMessage: cc.RichText
},
showMessage: function(e) {
this.lblMessage.string = e;
this.show();
},
hide: function() {
this.node.active = !1;
},
show: function() {
this.node.active = !0;
}
});
cc._RF.pop();
}, {} ],
EndGame: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "83178yEnslO66ZUZISIERtM", "EndGame");
var o = e("DialogBox");
e("Loading");
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
lblGold: {
default: null,
type: cc.Label
},
lblWelcome: {
default: null,
type: cc.Label
},
lblUpdateSuccess: {
default: null,
type: cc.Label
},
lblPoint: {
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
},
dialogBox: {
default: null,
type: o
},
loading: {
default: null,
type: cc.Node
}
},
start: function() {
this.score.string = Global.newScore;
this.score2.string = Global.newScore;
this.lblGold.string = Global.newScore;
Global.dialogBox = this.dialogBox;
Global.loading = this.loading;
if (Global.isLoggedIn()) {
this.panelGuest.active = !1;
this.panelAuthenticated.active = !0;
}
},
onLoginClicked: function() {
if (Global.isSamsungBlockchainSupported()) {
if (Global.isAndroid()) {
Global.getKeystore();
this.lblWelcome.string = "Welcome!";
}
this.panelGuest.active = !1;
this.panelAuthenticated.active = !0;
} else Global.showAlertDialog("<center>Your phone does not</center> <br/>support Samsung wallet <br/>to store your record <br/>in Harmony blockchain!");
},
onCreateKeystoreClicked: function() {
Global.isAndroid() && Global.gotoSamsungBlockchainKeystoreMenu();
},
onSaveClicked: function() {
if (Global.isAndroid()) {
var e = this;
Global.restUpdateScore(function() {
cc.log("score updated");
e.lblWelcome.string = "Score Saved";
});
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
}, {
DialogBox: "DialogBox",
Loading: "Loading"
} ],
Entry: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "0eff6fHW9ZJqbcebTF5iL8z", "Entry");
cc.Class({
extends: cc.Component,
properties: {
rank: cc.Label,
key: cc.Label,
score: cc.Label,
medal: cc.Sprite,
tx: {
default: "",
visible: !1
}
},
setup: function(e, t, i, o, n) {
this.tx = n;
this.rank.string = e;
this.key.string = t;
this.score.string = i;
this.medal.spriteFrame = o;
this.node.on(cc.Node.EventType.TOUCH_END, this.onClick, this);
},
onClick: function() {
cc.sys.openURL("https://explorer.harmony.one/#/tx/" + this.tx);
}
});
cc._RF.pop();
}, {} ],
Game: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "918870dx+VCSJisaYjAnxgN", "Game");
var o = 0, n = 1, l = 2;
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
state: o,
lastMove: null,
usedReset: !1,
touchedBlock: null,
startPos: null,
endPos: null,
onLoad: function() {
this.nodeWidth = (this.node.width - 66) / 3;
this.nodeHeight = (this.node.height - 66) / 3;
this.generateAllLevels();
this._currentLevel = 0;
var e = this._allLevels[this._currentLevel];
this.instantiateBlocks(e);
this.reset();
null != this.themeMusic && Global.isAndroid() && cc.audioEngine.playMusic(this.themeMusic, !0);
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
this.node.addChild(t);
t.width = this.nodeWidth;
t.height = this.nodeHeight;
var i = e % 3, o = Math.floor(e / 3);
t.position = this.getNodePosition(i, o);
var n = t.getComponent("Block");
n.x = i;
n.y = o;
this.listBlockScripts.push(n);
}
},
getNodePosition: function(e, t) {
var i = this.nodeWidth, o = this.nodeHeight;
return cc.v2((e - 1) * (18 + i), -(t - 1) * (18 + o));
},
reset: function() {
this.state = o;
this.score = 0;
this._currentLevel = 0;
this._timer = 0;
this.usedReset = !1;
var e = this._allLevels[this._currentLevel];
this.loadLevel(e);
this.disableTouch();
this.animatePlayButton();
},
loadLevel: function(e) {
Global.board_state = "";
Global.player_sequence = "";
for (var t = "", i = 0; i < e.contents.length; i++) {
var o = e.contents[i], n = i % 3, l = Math.floor(i / 3), c = this.findBlock(n, l);
c.setSelected(!1);
c.setColorAndValue(this.getSpriteByValue(o), o);
t += o;
}
Global.board_state = t;
this.selectedX = e.initialSelected.x;
this.selectedY = e.initialSelected.y;
var s = this.findBlock(this.selectedX, this.selectedY);
null != s && s.setSelected(!0);
this.lblLevel.string = this._currentLevel + 1 + "/100";
this.btnUndo.interactable = !0;
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
var t = e.getLocation(), i = t.x - this.startPos.x, o = t.y - this.startPos.y;
if (Math.abs(i) < SWIFT_DISTANCE && Math.abs(o) < SWIFT_DISTANCE) {
var n = e.target, l = this.findBlockByCoordinate(cc.v2(t.x - n.x, t.y - n.y));
this.moveByClickingBlock(l);
} else this.moveBySwift(i, o);
},
moveBySwift: function(e, t) {
var i = void 0;
i = Math.abs(e) >= Math.abs(t) ? e > 0 ? "R" : "L" : t > 0 ? "U" : "D";
this.tryMove(i);
},
moveByClickingBlock: function(e) {
cc.log("moveByClickingBlock", e);
if (void 0 !== e && null !== e) {
var t = this.findBlock(this.selectedX, this.selectedY), i = t.x - e.x, o = t.y - e.y, n = Math.abs(i), l = Math.abs(o);
if ((1 === n || 1 === l) && (1 !== n || 1 !== l) && n <= 1 && l <= 1) {
var c = "";
0 != i ? c = i > 0 ? "L" : "R" : 0 != o && (c = o > 0 ? "U" : "D");
this.tryMove(c);
} else this.playInvalidMoveSound();
}
},
findBlock: function(e, t) {
for (var i = 0; i < this.listBlockScripts.length; i++) {
var o = this.listBlockScripts[i];
if (o.x == e && o.y == t) return o;
}
cc.log("findBlock: FAILED at index ", i);
},
findBlockByCoordinate: function(e) {
for (var t = 0; t < this.listBlockScripts.length; t++) {
var i = this.listBlockScripts[t], o = this.getNodePosition(i.x, i.y), n = cc.v2(this.nodeWidth, this.nodeHeight), l = o.x - n.x, c = o.x + n.x, s = o.y - n.y, a = o.y + n.y;
cc.log("block" + t, o, l, c, s, a);
if (l <= e.x && e.x <= c && s <= e.y && e.y <= a) return this.listBlockScripts[t];
}
cc.log("findBlock: FAILED at coordinate ", e);
},
tryMove: function(e) {
cc.log("tryMove with direction=", e);
var t = !1, i = this.findBlock(this.selectedX, this.selectedY);
switch (e) {
case "L":
if (0 == this.selectedX) break;
this.selectedX--;
t = !0;
break;

case "R":
if (2 == this.selectedX) break;
this.selectedX++;
t = !0;
break;

case "U":
if (0 == this.selectedY) break;
this.selectedY--;
t = !0;
break;

case "D":
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
Global.player_sequence += e;
this.lastMove = e;
var o = this.findBlock(this.selectedX, this.selectedY), l = o.value + 1;
o.setColorAndValue(this.getSpriteByValue(l), l);
i.setSelected(!1);
o.setSelected(!0);
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
if (!this.usedReset) {
var e = this._allLevels[this._currentLevel];
this.loadLevel(e);
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
if (this.state != o && this.state != l) {
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
} else {
Global.newScore = this.score;
cc.director.loadScene("end_game");
this.state = l;
}
}
}
});
cc._RF.pop();
}, {} ],
Global: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "9bf09yemltMJ6LDPqxBrroN", "Global");
e("DialogBox");
window.SWIFT_DISTANCE = 80;
window.Global = {
myKeystore: "",
newScore: 0,
board_state: "",
player_sequence: "",
dialogBox: null,
loading: null,
saveScoreCallback: null,
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
logout: function() {
localStorage.setItem("my_keystore", "");
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
Global.dialogBox.showMessage(e);
},
gotoSamsungBlockchainKeystoreMenu: function() {
return jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "gotoSamsungBlockchainKeystoreMenu", "()V");
},
isSamsungBlockchainSupported: function() {
return jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "isSamsungBlockchainSupported", "()Z");
},
isInternetConnectionAvailable: function() {
return jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "isInternetConnectionAvailable", "()Z");
},
restUpdateScore: function(e) {
var t = "address=" + this.myKeystore + "&score=" + this.newScore + "&board_state=" + this.board_state + "&sequence=" + this.player_sequence;
cc.log("PARAMZ ", t);
var i = new XMLHttpRequest();
i.open("POST", "http://puzzle-backend.hmny.io:3000/api/submit", !0);
i.timeout = 15e3;
i.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
null != Global.loading && (Global.loading.active = !0);
i.onreadystatechange = function() {
null != Global.loading && (Global.loading.active = !1);
if (4 === this.readyState && 200 === this.status) {
var t = JSON.parse(i.responseText);
cc.log("RESP", i.responseText);
if ("success" === t.status) e(); else {
Global.showAlertDialog("Failed to save score! \n Please try again.");
}
}
};
i.onerror = function() {
null != Global.loading && (Global.loading.active = !1);
Global.showAlertDialog("Networking problem \n Failed to save your score");
};
i.ontimeout = function(e) {
null != Global.loading && (Global.loading.active = !1);
Global.showAlertDialog("Network: Request timeout.");
};
i.send(t);
},
restGetLeaderBoard: function(e) {
var t = new XMLHttpRequest();
t.open("GET", "http://puzzle-backend.hmny.io:3000/api/leader_boards", !0);
t.timeout = 5e3;
null != Global.loading && (Global.loading.active = !0);
t.onreadystatechange = function() {
null != Global.loading && (Global.loading.active = !1);
if (4 == t.readyState && t.status >= 200 && t.status < 400) {
var i = t.responseText;
if ("success" === JSON.parse(t.responseText).status) e(i); else {
Global.showAlertDialog("Unable to get \n Leader Board! \n Please try again.");
}
}
};
t.onerror = function() {
null != Global.loading && (Global.loading.active = !1);
Global.showAlertDialog("Unable to get \n Leader Board!");
};
t.send(null);
}
};
cc._RF.pop();
}, {
DialogBox: "DialogBox"
} ],
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
},
loading: {
default: null,
type: cc.Node
}
},
start: function() {
var e = "", t = null;
Global.isAndroid();
var i = this;
Global.loading = this.loading;
Global.restGetLeaderBoard(function(o) {
e = o;
var n = JSON.parse(e);
cc.log("json string", e);
t = n.leaders;
cc.log("Entries", t);
t.sort(function(e, t) {
return e.score > t.score ? -1 : 1;
});
var l = 1;
t.forEach(function(e) {
var t = cc.instantiate(i.prefabEntry), o = t.getComponent("Entry"), n = i.medalSprites[i.medalSprites.length - 1];
1 != l && 2 != l || (n = i.medalSprites[l - 1]);
var c = e.address.slice(0, 10) + "...", s = "0x0816c249e4ecc3f9992044a8aaa4cc13cb3a5465a35cc52b5804b98170d77040";
void 0 != e.txn && null != e.txn && (s = e.txn);
o.setup(l, c, e.score, n, s);
i.entriesRoot.addChild(t);
l++;
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
var o = 3 * (e = this.getDifficulty(i)), n = 4 * e, l = i + 3, c = this.randRange(o, n), s = {}, a = [];
if (1 == i) {
a = [ 1, 0, 0, 1, 1, 0, 1, 1, 0 ];
s.contents = a;
s.initialSelected = {};
s.initialSelected.x = 0;
s.initialSelected.y = 0;
t[i - 1] = s;
} else {
for (var r = 0; r < 9; r++) a.push(l);
var d = this.randRange(0, 9), u = [];
a[d] -= 1;
for (r = 0; r < c; r++) {
var h = -1;
do {
h = this.randRange(0, 4);
} while (!this.possible(a, d, h));
switch (h) {
case 0:
d -= 3;
u.push('"d"');
r + 1 != c && (a[d] -= 1);
break;

case 1:
d += 3;
u.push('"u"');
r + 1 != c && (a[d] -= 1);
break;

case 2:
d -= 1;
u.push('"r"');
r + 1 != c && (a[d] -= 1);
break;

case 3:
d += 1;
u.push('"l"');
r + 1 != c && (a[d] -= 1);
}
}
var p = d % 3, f = Math.floor(d / 3);
u = u.reverse();
s.contents = a;
s.initialSelected = {};
s.initialSelected.x = f;
s.initialSelected.y = p;
t[i - 1] = s;
}
}
return t;
}
});
cc._RF.pop();
}, {} ],
Loading: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "0ab5fsWe1ZMhp4pZYuuNkS+", "Loading");
cc.Class({
extends: cc.Component,
properties: {
icon: cc.Sprite
},
onEnable: function() {
var e = cc.repeatForever(cc.rotateBy(1, 360).easing(cc.easeIn(3)));
this.icon.node.runAction(e);
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
cc.debug.setDisplayStats(!1);
var e = cc.delayTime(1.5), t = cc.sequence(e, cc.callFunc(this.loadGameScene.bind(this)));
this.node.runAction(t);
Global.logout();
},
loadGameScene: function() {
cc.director.loadScene("game");
}
});
cc._RF.pop();
}, {} ]
}, {}, [ "Block", "DialogBox", "EndGame", "Entry", "Game", "Global", "Leadearboard", "LevelGenerator", "Loading", "SplashScript" ]);