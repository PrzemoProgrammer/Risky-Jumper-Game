class PreloadScene extends Phaser.Scene {
  constructor() {
    super("PreloadScene");
  }
  preload() {
    this.load.on("complete", () => {
      this.startNextScene();
    });
    this.load.plugin(
      "rexinputtextplugin",
      "https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexinputtextplugin.min.js",
      true
    );
    this.load.plugin(
      "rexninepatchplugin",
      "https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexninepatchplugin.min.js",
      true
    );

    this.load.setPath("./src/assets/images");
    this.loadImages();
    this.loadAudio();
  }
  create() {
    this.loadPlugin();
    this.addAnims();
    this.addAudio();
  }
  addAnims() {
    this.anims.create({
      key: `moveRight`,
      frames: this.anims.generateFrameNumbers(`player`, {
        frames: [1, 2, 3, 2],
      }),
      frameRate: 8,
      repeat: -1,
    });
    this.anims.create({
      key: "idle",
      frames: [{ key: "player", frame: 0 }],
      frameRate: 20,
    });
    this.anims.create({
      key: "jump",
      frames: [{ key: "player", frame: 5 }],
      frameRate: 20,
    });
    this.anims.create({
      key: "preparing",
      frames: [{ key: "player", frame: 4 }],
      frameRate: 20,
    });
    this.anims.create({
      key: "fall",
      frames: [{ key: "player", frame: 6 }],
      frameRate: 20,
    });
    this.anims.create({
      key: "hurt",
      frames: [{ key: "player", frame: 8 }],
      frameRate: 20,
    });
    this.anims.create({
      key: "dead",
      frames: [{ key: "player", frame: 7 }],
      frameRate: 20,
    });
  }
  startNextScene() {
    StatusBar.backgroundColorByHexString("#00000000");
    localStorage.getItem("nickname")
      ? this.startMenuScene()
      : this.startLoginScene();
  }

  startLoginScene() {
    this.scene.launch("LoginScene");
  }

  startMenuScene() {
    this.scene
      .start("PlayScene")
      .pause("PlayScene")
      .start("MenuScene")
      .swapPosition("PlayScene", "MenuScene");
  }

  loadPlugin() {
    this.load.plugin(
      "rexinputtextplugin",
      "https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexinputtextplugin.min.js",
      true
    );
    this.load.plugin(
      "rexninepatchplugin",
      "https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexninepatchplugin.min.js",
      true
    );
  }

  loadImages() {
    this.images = [
      "background",
      "playButton",
      "riskyJumperText",
      "settingsButton",
      "topBelt",
      "bottomBelt1",
      "bottomBelt2",
      "topBeltHorizontal",
      "buble",
      "bg1",
      "floor",
      "floorLight",
      "floorLightCorner",
      "replayButton",
      "scoreBoard",
      "gameOverText",
      "achivButton",
      "updateAchivButton",
      "ground",
      "platformFloor",
      "rankingButton",
      "rankingButton2",
      "achivButton2",
      "rankScreenMedal",
      "rankScreenMedalColor",
      "newRecordUpdate",
      "medalSmaller",
      "smallerMedalColor",
      "backButton",
      "pauseButton",
      "pauseText",
      "settingsText",
      "settingsButton2",
      "soundOnOff",
      "slider",
      "rankingPlayerBg",
      "hand1",
      "hand2",
      "tutorialLine",
      "darkScreen",
      "crown",
      "shareButton",
      "firstPlace",
      "secondPlace",
      "thirdPlace",
      "leaderBoardStatus",
      "loginProfil",
      "startButton",
      "medalShine",
      "rankStars",
      "medalText",
      "loading",
      "menuBg",
      "menuLayer1",
      "menuGround",
      "heroMenuIcon",
      "menuPlatform1",
      "menuPlatform2",
      "menuClouds",
      "greenTopBelt",
    ];
    this.images.forEach((img) => {
      this.load.image(img, `${img}.png`);
    });
    for (let i = 0; i <= 2; i++) {
      this.load.image(`layer${i}`, `layer${i}.png`);
    }
    for (let i = 1; i <= 9; i++) {
      this.load.image(`floor${i}`, `floor${i}.png`);
    }
    this.load.spritesheet("player", "player.png", {
      frameWidth: 855 / 9,
      frameHeight: 95,
    });
  }
  loadAudio() {
    this.audio = ["mainMenu", "click", "hurt", "startJump", "endJump"];
    this.audio.forEach((name) => {
      this.load.audio(name, `../audio/${name}.mp3`);
    });
  }
  addAudio() {
    this.game.audio = {};
    this.audio.forEach(
      (name) => (this.game.audio[name] = this.sound.add(name))
    );
    this.game.audio.mainMenu.setLoop(true);
    this.setupAudioVolume();
  }
  setupAudioVolume() {
    this.game.audio.hurt.setVolume(0.5);
  }
}
