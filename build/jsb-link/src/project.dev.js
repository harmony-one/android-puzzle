window.__require = function e(t, n, r) {
  function s(o, u) {
    if (!n[o]) {
      if (!t[o]) {
        var b = o.split("/");
        b = b[b.length - 1];
        if (!t[b]) {
          var a = "function" == typeof __require && __require;
          if (!u && a) return a(b, !0);
          if (i) return i(b, !0);
          throw new Error("Cannot find module '" + o + "'");
        }
      }
      var f = n[o] = {
        exports: {}
      };
      t[o][0].call(f.exports, function(e) {
        var n = t[o][1][e];
        return s(n || e);
      }, f, f.exports, e, t, n, r);
    }
    return n[o].exports;
  }
  var i = "function" == typeof __require && __require;
  for (var o = 0; o < r.length; o++) s(r[o]);
  return s;
}({
  Block: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "89334GVgj1MkaQ0C/zPbcJf", "Block");
    "use strict";
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
      onLoad: function onLoad() {},
      setColorAndValue: function setColorAndValue(sprite, value) {
        this.value = value;
        this.sprite.spriteFrame = sprite;
        this.setNumber(value);
      },
      setNumber: function setNumber(value) {
        this.number.string = value;
      },
      setSelected: function setSelected(val) {
        this.selected.enabled = val;
        val && this.animate();
      },
      animate: function animate() {
        cc.tween(this.node).to(.08, {
          scale: 1.06
        }).to(.08, {
          scale: 1
        }).start();
      }
    });
    cc._RF.pop();
  }, {} ],
  DialogBox: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "9c515QSqVdGj4bHCOMnzXYO", "DialogBox");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        lblMessage: cc.RichText
      },
      showMessage: function showMessage(msg) {
        this.lblMessage.string = msg;
        this.show();
      },
      hide: function hide() {
        this.node.active = false;
      },
      show: function show() {
        this.node.active = true;
      }
    });
    cc._RF.pop();
  }, {} ],
  EndGame: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "83178yEnslO66ZUZISIERtM", "EndGame");
    "use strict";
    var DialogBox = require("DialogBox");
    var Loading = require("Loading");
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
        },
        dialogBox: {
          default: null,
          type: DialogBox
        },
        loading: {
          default: null,
          type: cc.Node
        }
      },
      start: function start() {
        this.score.string = Global.newScore;
        this.score2.string = Global.newScore;
        Global.dialogBox = this.dialogBox;
        Global.loading = this.loading;
        if (Global.isLoggedIn()) {
          this.panelGuest.active = false;
          this.panelAuthenticated.active = true;
        }
      },
      onLoginClicked: function onLoginClicked() {
        if (Global.isSamsungBlockchainSupported()) {
          if (Global.isAndroid()) {
            Global.getKeystore();
            this.lblWelcome.string = "Welcome!";
          }
          this.panelGuest.active = false;
          this.panelAuthenticated.active = true;
        } else Global.showAlertDialog("Your phone does not have Samsung wallet support to store your record in Harmony blockchain");
      },
      onCreateKeystoreClicked: function onCreateKeystoreClicked() {
        Global.isAndroid() && Global.gotoSamsungBlockchainKeystoreMenu();
      },
      onSaveClicked: function onSaveClicked() {
        Global.isAndroid() && Global.restUpdateScore();
      },
      onPlayAgainClicked: function onPlayAgainClicked() {
        cc.director.loadScene("game");
      },
      onLeaderboardClicked: function onLeaderboardClicked() {
        cc.director.loadScene("leader_board");
      }
    });
    cc._RF.pop();
  }, {
    DialogBox: "DialogBox",
    Loading: "Loading"
  } ],
  Entry: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "0eff6fHW9ZJqbcebTF5iL8z", "Entry");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        rank: cc.Label,
        key: cc.Label,
        score: cc.Label,
        medal: cc.Sprite
      },
      setup: function setup(rank, key, score, medal) {
        this.rank.string = rank;
        this.key.string = key;
        this.score.string = score;
        this.medal.spriteFrame = medal;
      }
    });
    cc._RF.pop();
  }, {} ],
  Game: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "918870dx+VCSJisaYjAnxgN", "Game");
    "use strict";
    var BLOCKS_PER_ROW = 3;
    var BLOCK_WIDTH = 18;
    var STATE = {
      TUTORIAL: 0,
      STARTED: 1,
      END: 2
    };
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
      state: STATE.TUTORIAL,
      lastMove: null,
      onLoad: function onLoad() {
        var spaceX = 11;
        var spaceY = 11;
        var padding = 22;
        this.nodeWidth = (this.node.width - (2 * padding + 2 * spaceX)) / 3;
        this.nodeHeight = (this.node.height - (2 * padding + 2 * spaceY)) / 3;
        this.generateAllLevels();
        this._currentLevel = 0;
        var level = this._allLevels[this._currentLevel];
        this.instantiateBlocks(level);
        this.reset();
        null != this.themeMusic && cc.audioEngine.playMusic(this.themeMusic, true);
      },
      generateAllLevels: function generateAllLevels() {
        var script = this.levelGenerator.getComponent("LevelGenerator");
        this._allLevels = script.levels();
        cc.log("[All Levels] ", this._allLevels);
      },
      instantiateBlocks: function instantiateBlocks() {
        this.listBlockScripts = [];
        for (var i = 0; i < BLOCKS_PER_ROW * BLOCKS_PER_ROW; i++) {
          var block = cc.instantiate(this.prefabBlock);
          block.width = this.nodeWidth;
          block.height = this.nodeHeight;
          var x = i % BLOCKS_PER_ROW;
          var y = Math.floor(i / BLOCKS_PER_ROW);
          block.position = this.getNodePosition(x, y);
          this.node.addChild(block);
          var script = block.getComponent("Block");
          script.x = x;
          script.y = y;
          this.listBlockScripts.push(script);
        }
      },
      getNodePosition: function getNodePosition(x, y) {
        var w = this.nodeWidth;
        return cc.v2(BLOCK_WIDTH * (y + 1) + w * y + w / 2, -(BLOCK_WIDTH * (x + 1) + w * x + w / 2));
      },
      reset: function reset() {
        this.state = STATE.TUTORIAL;
        this.score = 0;
        this._currentLevel = 0;
        this._timer = 0;
        var level = this._allLevels[this._currentLevel];
        this.loadLevel(level);
        this.disableTouch();
        this.animatePlayButton();
      },
      loadLevel: function loadLevel(level) {
        Global.board_state = "";
        Global.player_sequence = "";
        var temp = "";
        for (var i = 0; i < level.contents.length; i++) {
          var value = level.contents[i];
          var y = i % BLOCKS_PER_ROW;
          var x = Math.floor(i / BLOCKS_PER_ROW);
          var block = this.findBlock(x, y);
          block.setSelected(false);
          block.setColorAndValue(this.getSpriteByValue(value), value);
          temp += value;
        }
        Global.board_state = temp;
        this.selectedX = level.initialSelected.x;
        this.selectedY = level.initialSelected.y;
        cc.log("SELECTED " + this.selectedX + "-" + this.selectedY, "finding node...");
        var selectedBlock = this.findBlock(this.selectedX, this.selectedY);
        null != selectedBlock && selectedBlock.setSelected(true);
        this.lblLevel.string = this._currentLevel + 1 + "/100";
        this.btnUndo.interactable = false;
        null != this.tween4Stopwatch && this.tween4Stopwatch.stop();
        this.isClockRinging = false;
      },
      getSpriteByValue: function getSpriteByValue(number) {
        var index = number % this.numberBgArray.length;
        return this.numberBgArray[index];
      },
      enableTouch: function enableTouch() {
        this.node.parent.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.parent.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
      },
      disableTouch: function disableTouch() {
        this.node.parent.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.parent.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
      },
      onTouchStart: function onTouchStart(event) {
        this.startPos = event.getLocation();
      },
      onTouchEnd: function onTouchEnd(event) {
        var endPos = event.getLocation();
        var deltaX = endPos.x - this.startPos.x;
        var deltaY = endPos.y - this.startPos.y;
        var offset = 80;
        if (Math.abs(deltaX) < offset && Math.abs(deltaY) < offset) return;
        var direction = void 0;
        direction = Math.abs(deltaX) >= Math.abs(deltaY) ? deltaX > 0 ? "R" : "L" : deltaY > 0 ? "U" : "D";
        this.tryMove(direction);
      },
      findBlock: function findBlock(x, y) {
        for (var i = 0; i < this.listBlockScripts.length; i++) {
          var block = this.listBlockScripts[i];
          if (block.x == x && block.y == y) return block;
        }
        cc.log("findBlock: FAILED at index ", i);
      },
      tryMove: function tryMove(direction) {
        var canMove = false;
        var currentBlock = this.findBlock(this.selectedX, this.selectedY);
        switch (direction) {
         case "U":
          if (0 == this.selectedX) break;
          this.selectedX--;
          canMove = true;
          break;

         case "D":
          if (this.selectedX == BLOCKS_PER_ROW - 1) break;
          this.selectedX++;
          canMove = true;
          break;

         case "L":
          if (0 == this.selectedY) break;
          this.selectedY--;
          canMove = true;
          break;

         case "R":
          if (this.selectedY == BLOCKS_PER_ROW - 1) break;
          this.selectedY++;
          canMove = true;
        }
        if (canMove) {
          if (this.btnPlay.enabled) {
            this.btnPlay.node.active = false;
            this.btnUndo.node.active = true;
            this.tutorialLine.enabled = false;
            this.state = STATE.STARTED;
          }
          Global.player_sequence += direction;
          this.lastMove = direction;
          this.btnUndo.interactable = true;
          var nextBlock = this.findBlock(this.selectedX, this.selectedY);
          var newValue = nextBlock.value + 1;
          nextBlock.setColorAndValue(this.getSpriteByValue(newValue), newValue);
          currentBlock.setSelected(false);
          nextBlock.setSelected(true);
          this.playMoveSound();
          if (this.isPlayerWin()) {
            cc.audioEngine.playEffect(this.soundWin);
            this.score += this.calculateScore();
            this.lblScore.string = this.score;
            this.gotoNextLevel();
          }
        } else {
          currentBlock.animate();
          this.playInvalidMoveSound();
        }
      },
      gotoNextLevel: function gotoNextLevel() {
        this._currentLevel++;
        this._timer = this.getTimeByLevel(this._currentLevel);
        this.lblLevel.string = this._currentLevel + 1 + "/100";
        var level = this._allLevels[this._currentLevel];
        this.loadLevel(level);
      },
      calculateScore: function calculateScore() {
        return (this._currentLevel + 1) * Math.floor(this._timer);
      },
      getTimeByLevel: function getTimeByLevel(level) {
        if (level <= 2) return 20;
        if (level <= 5) return 30;
        if (level <= 10) return 25;
        if (level <= 20) return 20;
        return 15;
      },
      isPlayerWin: function isPlayerWin() {
        var value0 = this.listBlockScripts[0].value;
        for (var i = 1; i < this.listBlockScripts.length; i++) if (this.listBlockScripts[i].value != value0) return false;
        return true;
      },
      playMoveSound: function playMoveSound() {
        if (null == this.soundMove) return;
        cc.audioEngine.playEffect(this.soundMove);
      },
      playInvalidMoveSound: function playInvalidMoveSound() {
        if (null == this.soundCantMove) return;
        cc.audioEngine.playEffect(this.soundCantMove);
      },
      onPlayClicked: function onPlayClicked() {
        this.enableTouch();
        this.tween4PlayButton.stop();
        this.btnPlay.node.scale = 1;
        this._timer = this.getTimeByLevel(this._currentLevel);
        cc.audioEngine.playEffect(this.soundButtonClick);
        var selectedBlock = this.findBlock(this.selectedX, this.selectedY);
        selectedBlock.animate();
      },
      onUndoClicked: function onUndoClicked() {
        if (null == this.lastMove) return;
        var currentBlock = this.findBlock(this.selectedX, this.selectedY);
        var oldValue = currentBlock.value - 1;
        currentBlock.setColorAndValue(this.getSpriteByValue(oldValue), oldValue);
        currentBlock.setSelected(false);
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
        var temp = Global.player_sequence;
        temp = temp.substring(temp.length - 1);
        Global.player_sequence = temp;
        this.lastMove = null;
        var previousBlock = this.findBlock(this.selectedX, this.selectedY);
        previousBlock.setSelected(true);
        this.btnUndo.interactable = false;
      },
      animatePlayButton: function animatePlayButton() {
        var _this = this;
        this.tween4PlayButton = cc.tween(this.btnPlay.node).to(.5, {
          scale: 1.2
        }).to(.5, {
          scale: 1
        }).call(function() {
          _this.animatePlayButton();
        }).start();
      },
      isClockRinging: false,
      update: function update(dt) {
        if (this.state == STATE.TUTORIAL) return;
        if (this.state == STATE.END) return;
        this._timer -= dt;
        if (this._timer > 0) {
          var floored = Math.floor(this._timer);
          var formattedNumber = ("0" + floored).slice(-2);
          this.lblTime.string = "00:" + formattedNumber;
          if (this._timer <= 10 && !this.isClockRinging) {
            this.tween4Stopwatch = cc.tween(this.stopwatch).repeat(10, cc.tween().by(.5, {
              angle: -20
            }).by(.5, {
              angle: 20
            })).start();
            this.isClockRinging = true;
          }
        } else {
          Global.newScore = this.score;
          cc.director.loadScene("end_game");
          this.state = STATE.END;
        }
      }
    });
    cc._RF.pop();
  }, {} ],
  Global: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "9bf09yemltMJ6LDPqxBrroN", "Global");
    "use strict";
    var DialogBox = require("DialogBox");
    window.Global = {
      myKeystore: "",
      newScore: 0,
      board_state: "",
      player_sequence: "",
      dialogBox: null,
      loading: null,
      isAndroid: function isAndroid() {
        return cc.sys.os == cc.sys.OS_ANDROID;
      },
      isLoggedIn: function isLoggedIn() {
        var myKeystore = localStorage.getItem("my_keystore");
        return null != myKeystore && myKeystore.length > 10;
      },
      getKeystore: function getKeystore() {
        this.myKeystore = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "getKeystore", "()Ljava/lang/String;");
        localStorage.setItem("my_keystore", this.myKeystore);
        return this.myKeystore;
      },
      logout: function logout() {
        localStorage.setItem("my_keystore", "");
      },
      getScore: function getScore() {
        return jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "getScore", "()I");
      },
      updateScore: function updateScore() {
        if (this.newScore <= 0) return;
        var currentScore = this.getScore();
        this.newScore > currentScore;
      },
      getLeaderboard: function getLeaderboard() {
        return jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "getLeaderboard", "()Ljava/lang/String;");
      },
      showAlertDialog: function showAlertDialog(message) {
        Global.dialogBox.showMessage(message);
      },
      gotoSamsungBlockchainKeystoreMenu: function gotoSamsungBlockchainKeystoreMenu() {
        return jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "gotoSamsungBlockchainKeystoreMenu", "()V");
      },
      isSamsungBlockchainSupported: function isSamsungBlockchainSupported() {
        return jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "isSamsungBlockchainSupported", "()Z");
      },
      isInternetConnectionAvailable: function isInternetConnectionAvailable() {
        return jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "isInternetConnectionAvailable", "()Z");
      },
      restUpdateScore: function restUpdateScore() {
        var url = "http://ec2-54-212-193-72.us-west-2.compute.amazonaws.com:8080/api/submit";
        var params = "address=" + this.myKeystore + "&score=" + this.newScore + "&board_state=" + this.board_state + "&sequence=" + this.player_sequence;
        cc.log("PARAMZ ", params);
        var xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        null != Global.loading && (Global.loading.active = true);
        xhr.onreadystatechange = function() {
          null != Global.loading && (Global.loading.active = false);
          if (4 === this.readyState && 200 === this.status) {
            var data = JSON.parse(xhr.responseText);
            cc.log("RESP", xhr.responseText);
            var tx = data["tx"];
            tx.length > 10 && (tx = tx.substring(0, 10) + "...");
            var seq = Global.player_sequence;
            seq.length > 10 && (seq = seq.substring(0, 10) + "...");
            var msg = "<color=#FFC530>Your score Saved!<c> \n <color=#131475>Txn:</c>" + tx + "\n <color=#131475>BOARD:</c> " + Global.board_state + "\n <color=#131475>SEQ.</c> " + seq;
            cc.log("RESP", msg);
            Global.showAlertDialog(msg);
          }
        };
        xhr.send(params);
      },
      restGetLeaderBoard: function restGetLeaderBoard(onSuccessCallback) {
        var url = "http://ec2-54-212-193-72.us-west-2.compute.amazonaws.com:8080/api/leader_boards";
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        null != Global.loading && (Global.loading.active = true);
        xhr.onreadystatechange = function() {
          null != Global.loading && (Global.loading.active = false);
          if (4 == xhr.readyState && xhr.status >= 200 && xhr.status < 400) {
            var response = xhr.responseText;
            onSuccessCallback(response);
          }
        };
        xhr.send(null);
      }
    };
    cc._RF.pop();
  }, {
    DialogBox: "DialogBox"
  } ],
  Leadearboard: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "e4231kRB6FO7qKfwfFVqxPB", "Leadearboard");
    "use strict";
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
      start: function start() {
        var json = "";
        var entries = null;
        Global.isAndroid();
        var that = this;
        Global.loading = this.loading;
        Global.restGetLeaderBoard(function(jsonText) {
          json = jsonText;
          var data = JSON.parse(json);
          cc.log("json string", json);
          entries = data["leaders"];
          cc.log("Entries", entries);
          entries.sort(function(a, b) {
            return a.score > b.score ? -1 : 1;
          });
          var rank = 1;
          entries.forEach(function(entry) {
            var newEntry = cc.instantiate(that.prefabEntry);
            var script = newEntry.getComponent("Entry");
            var medal = that.medalSprites[that.medalSprites.length - 1];
            1 != rank && 2 != rank || (medal = that.medalSprites[rank - 1]);
            var shortenKey = entry.address.slice(0, 10) + "...";
            script.setup(rank, shortenKey, entry.score, medal);
            that.entriesRoot.addChild(newEntry);
            rank++;
          });
        });
      },
      onPlayAgainClicked: function onPlayAgainClicked() {
        cc.director.loadScene("game");
      },
      onBackClicked: function onBackClicked() {
        cc.director.loadScene("end_game");
      }
    });
    cc._RF.pop();
  }, {} ],
  LevelGenerator: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "3ffbfo+zY9GiJgho3eM08Wb", "LevelGenerator");
    "use strict";
    cc.Class({
      extends: cc.Component,
      randRange: function randRange(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
      },
      getDifficulty: function getDifficulty(level) {
        return 1 == level ? 1 : level >= 2 && level <= 3 ? 2 : level >= 4 && level <= 5 ? 3 : level >= 6 && level <= 7 ? 4 : level >= 8 && level <= 10 ? 5 : level >= 11 && level <= 20 ? 7 : level >= 21 && level <= 40 ? 8 : level >= 41 && level <= 60 ? 9 : level >= 61 && level <= 80 ? 10 : level >= 81 && level <= 90 ? 11 : level >= 91 && level <= 95 ? 12 : 96 == level ? 13 : 97 == level ? 14 : 98 == level ? 15 : 99 == level ? 16 : 17;
      },
      possible: function possible(data, selected, roll) {
        if (-1 == roll) return false;
        if (0 == roll && 0 == Math.floor(selected / 3)) return false;
        if (1 == roll && 2 == Math.floor(selected / 3)) return false;
        if (2 == roll && selected % 3 == 0) return false;
        if (3 == roll && selected % 3 == 2) return false;
        return true;
      },
      levels: function levels() {
        var start = 1;
        var outputArray = new Array(100);
        var difficulty;
        for (var i = 1; i < 101; i++) {
          difficulty = this.getDifficulty(i);
          var minMoves = 3 * difficulty;
          var maxMoves = 4 * difficulty;
          var parity = i + 3;
          var moves = this.randRange(minMoves, maxMoves);
          var levelDict = {};
          var data = [];
          if (1 == i) {
            data = [ 1, 0, 0, 1, 1, 0, 1, 1, 0 ];
            levelDict["contents"] = data;
            levelDict["initialSelected"] = {};
            levelDict["initialSelected"]["x"] = 0;
            levelDict["initialSelected"]["y"] = 0;
            outputArray[i - 1] = levelDict;
          } else {
            for (var j = 0; j < 9; j++) data.push(parity);
            var selected = this.randRange(0, 9);
            var solution = [];
            data[selected] -= 1;
            for (var j = 0; j < moves; j++) {
              var roll = -1;
              do {
                roll = this.randRange(0, 4);
              } while (!this.possible(data, selected, roll));
              switch (roll) {
               case 0:
                selected -= 3;
                solution.push('"d"');
                j + 1 != moves && (data[selected] -= 1);
                break;

               case 1:
                selected += 3;
                solution.push('"u"');
                j + 1 != moves && (data[selected] -= 1);
                break;

               case 2:
                selected -= 1;
                solution.push('"r"');
                j + 1 != moves && (data[selected] -= 1);
                break;

               case 3:
                selected += 1;
                solution.push('"l"');
                j + 1 != moves && (data[selected] -= 1);
              }
            }
            var y = selected % 3;
            var x = Math.floor(selected / 3);
            solution = solution.reverse();
            levelDict["contents"] = data;
            levelDict["initialSelected"] = {};
            levelDict["initialSelected"]["x"] = x;
            levelDict["initialSelected"]["y"] = y;
            outputArray[i - 1] = levelDict;
          }
        }
        return outputArray;
      }
    });
    cc._RF.pop();
  }, {} ],
  Loading: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "0ab5fsWe1ZMhp4pZYuuNkS+", "Loading");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        icon: cc.Sprite
      },
      onEnable: function onEnable() {
        var seq = cc.repeatForever(cc.rotateBy(.2, 360).easing(cc.easeIn(3)));
        this.icon.node.runAction(seq);
      }
    });
    cc._RF.pop();
  }, {} ],
  SplashScript: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "280c3rsZJJKnZ9RqbALVwtK", "SplashScript");
    "use strict";
    cc.Class({
      extends: cc.Component,
      onLoad: function onLoad() {
        var delay = cc.delayTime(1.5);
        var actions = cc.sequence(delay, cc.callFunc(this.loadGameScene.bind(this)));
        this.node.runAction(actions);
        Global.logout();
      },
      loadGameScene: function loadGameScene() {
        cc.director.loadScene("game");
      },
      update: function update(dt) {}
    });
    cc._RF.pop();
  }, {} ]
}, {}, [ "Block", "DialogBox", "EndGame", "Entry", "Game", "Global", "Leadearboard", "LevelGenerator", "Loading", "SplashScript" ]);