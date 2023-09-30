class PlayScene extends Phaser.Scene {
  constructor() {
    super("PlayScene");
  }
  create() {
    this.gw = gameWidth;
    this.gh = gameHeight;
    this.halfW = halfGameWidth;
    this.halfH = halfGameHeight;

    this.halfHeightScreen = this.halfH;
    this.audio = this.game.audio;
    this.platforms = [];
    this.isGameOver = true;
    this.isPlayerCollidePlatform = false;

    this.bestScore = this.getItemFromLocalStorage("bestScore") || 0;
    this.score = 0;
    this.platformThemes = platformThemes;
    this.gameObjectsMoveBackSpeed = 20;
    this.bgElementsBackSpeed = this.gameObjectsMoveBackSpeed / 4;
    this.numberOfPlatformsForChangeTheme = 10;
    this.allNumberOfPlatformsInGame = 0;
    this.bgColorIndex = 0;
    this.platformThemeIndex = 0;

    this.addBackground();
    this.addPlayer();
    this.addPlatforms();
    this.addGround();
    this.addScore();
    this.onClick();
    this.addPauseButton();
    this.addTutorial();
    this.player.startEntryGameAim(() => {
      this.isGameOver = false;
    });
  }
  update() {
    this.moveClouds();
    if (this.isGameOver) return;
    this.updateGame();
    if (this.player.isTouchingRight()) this.player.bounce("right");
    if (this.player.isFallingDown()) this.player.fall();
  }
  addBackground() {
    this.bg = this.add
      .image(0, 0, "bg1")
      .setOrigin(0, 0)
      .setDisplaySize(this.gw, this.gh)
      .setTint(this.platformThemes[this.bgColorIndex].bg_color);
    this.updateColorIndex();
    this.bg2 = this.add
      .image(0, 0, "bg1")
      .setOrigin(0, 0)
      .setDisplaySize(this.gw, this.gh)
      .setTint(this.platformThemes[this.bgColorIndex].bg_color)
      .setAlpha(0);
    this.layer0 = this.add.image(0, gameHeight - 55, "layer0").setOrigin(0, 1);
    this.layer0.displayWidth = this.gw;
    this.layer1 = this.add
      .tileSprite(0, gameHeight - 348, 720, 1839, "layer1")
      .setOrigin(0, 1);
    this.layer2 = this.add
      .tileSprite(0, gameHeight / 8, 720, 346, "layer2")
      .setOrigin(0, 0);
  }
  addTileSprite(x, y, w, h, sprite) {
    const index = this.gw / w;
    this.layer1Array = [];
    for (let i = 0; i <= index; i++) {
      const layer = this.add.image(x, y, sprite).setOrigin(0, 1);
      this.layer1Array.push(layer);
    }
  }

  getItemFromLocalStorage(item) {
    return Number(localStorage.getItem(item));
  }
  addPlatformTextures() {
    let textures = [];
    for (let i = 1; i <= 7; i++) {
      textures.push(`floor_${i}`);
    }
    return textures;
  }
  moveClouds() {
    this.layer2.tilePositionX += 1;
  }
  updateColorIndex() {
    this.bgColorIndex += 1;
    if (this.bgColorIndex === this.platformThemes.length) this.bgColorIndex = 0;
  }
  useNextPlatformTheme() {
    this.platformThemeIndex += 1;
    if (this.platformThemeIndex === this.platformThemes.length)
      this.platformThemeIndex = 0;
  }
  updateGameTheme() {
    const number = this.numberOfPlatformsForChangeTheme;
    if (this.allNumberOfPlatformsInGame % number === 0)
      this.useNextPlatformTheme();
    if (this.score % number || !this.score) return;
    this.updateColorIndex();
    const target = this.bg2.alpha === 0 ? this.bg : this.bg2;
    const alphaValue = target === this.bg ? 1 : 0;
    this.tweens.add({
      targets: this.bg2,
      alpha: alphaValue,
      duration: 1e3,
      ease: "Linear",
      onComplete: () =>
        target.setTint(this.platformThemes[this.bgColorIndex].bg_color),
    });
  }
  addPlayer() {
    this.player = new Player(
      this,
      -70,
      this.gh - this.halfHeightScreen,
      "player"
    );
  }

  addPlatform(i) {
    const config = {
      x: 450 * i + 350,
      y: this.randomNumber(
        this.halfHeightScreen - 160,
        this.halfHeightScreen + 160
      ),
      w: 300 - this.allNumberOfPlatformsInGame * 3,
      h: this.gh - 55,
      theme: this.platformThemes[this.platformThemeIndex],
    };
    let platform = new Platform(this, config);
    this.platforms.push(platform);
    this.physics.add.collider(
      this.player,
      platform.skeleton,
      (player, skeleton) => {
        if (player.body.onFloor() && this.isPlayerCollidePlatform) {
          this.isPlayerCollidePlatform = false;
          player.idle();
        }
      }
    );
  }
  addPlatforms() {
    this.addFirstPlatform();
    this.increaseNumberOfPlatforms();
    for (let i = 0; i <= 1; i++) {
      this.addPlatform(i);
      this.increaseNumberOfPlatforms();
    }
  }
  addFirstPlatform() {
    const config = {
      x: -100,
      y: this.halfHeightScreen,
      w: 300,
      h: this.gh - 55,
      theme: this.platformThemes[this.platformThemeIndex],
    };
    const platform = new Platform(this, config);
    this.physics.add.collider(
      this.player,
      platform.skeleton,
      (player, skeleton) => {
        if (player.body.onFloor() && this.isPlayerCollidePlatform) {
          this.isPlayerCollidePlatform = false;
          player.idle();
        }
      }
    );
    this.platforms.push(platform);
  }
  increaseNumberOfPlatforms() {
    this.allNumberOfPlatformsInGame += 1;
  }
  addGround() {
    this.ground = this.add
      .tileSprite(0, this.gh, 1100, 55, "ground")
      .setOrigin(0, 1)
      .setDepth(1);
    this.physics.world.enableBody(this.ground);
    this.ground.body.allowGravity = false;
    this.ground.body.setImmovable(true);
    this.physics.add.collider(this.player, this.ground, null, () => {
      if (this.isGameOver) return;
      this.initLostGame();
    });
  }
  moveGround() {
    this.ground.tilePositionX += this.gameObjectsMoveBackSpeed;
  }

  onClick() {
    this.input
      .on(
        "pointerdown",
        function () {
          this.player.preparing();
        },
        this
      )
      .on(
        "pointerup",
        function () {
          this.isPlayerCollidePlatform = true;
          this.player.jump();
        },
        this
      );
  }

  generateId() {
    let randomNumbers = [];

    for (let i = 0; i < 10; i++) {
      randomNumbers.push(Math.floor(Math.random() * 100));
    }
    const id = randomNumbers.join("");
    localStorage.setItem("id", id);

    return id;
  }

  initLostGame() {
    this.isGameOver = true;
    this.player.dead();
    this.addLostScreen();
  }
  addLostScreen() {
    this.lostScreen = new LostScreen(this, this.score, this.bestScore);
    this.ground.setDepth(0);
    this.scoreText.setVisible(false);
    this.lostScreen.replayButton.onClick(() => {
      this.audio.click.play();
      this.scene.restart();
    });
    this.lostScreen.achievementsButton.onClick(() => {
      this.audio.click.play();
      this.scene.setVisible(true, "RankScene");
      this.changeScene("RankScene", "PlayScene");
    });
    this.lostScreen.rankingButton.onClick(() => {
      this.audio.click.play();
      this.scene.setVisible(true, "RankingScene");
      this.changeScene("RankingScene", "PlayScene");
    });

    this.lostScreen.shareButton.onClick(() => {
      this.audio.click.play();
      this.sendRequestUpdateScore();
    });
  }

  async sendRequestUpdateScore() {
    const data = {
      score: this.getItemFromLocalStorage("bestScore"),
      nick: localStorage.getItem("nickname"),
      id: this.getItemFromLocalStorage("id"),
    };

    try {
      const message = await (await UPDATE_SCORE(data)).json();

      if (message) {
        this.lostScreen.changeResponseText(true);
      } else {
        this.lostScreen.changeResponseText(false);
      }
    } catch (error) {
      this.lostScreen.changeResponseText(false);
    }
  }

  updateScore() {
    this.score += 1;
    this.scoreText.setText(this.score);
  }
  moveBackground() {
    this.layer1.tilePositionX += this.bgElementsBackSpeed;
    this.layer2.tilePositionX += this.bgElementsBackSpeed;
  }
  movePlatforms() {
    this.platforms.forEach((platform) => {
      platform.move(-this.gameObjectsMoveBackSpeed);
    });
  }
  movePlayer() {
    this.player.move(-this.gameObjectsMoveBackSpeed);
  }
  setupGame() {
    this.movePlatforms();
    this.movePlayer();
    this.moveBackground();
    this.moveGround();
  }
  updateGame() {
    if (
      this.player.isTouchingDown() &&
      this.player.getPosition() >= this.platforms[1].container.x
    ) {
      this.setupGame();
    }
    if (this.platforms[1].container.x <= 0) {
      this.updatePlatforms();
      this.updateScore();
      this.updateGameTheme();
    }
  }
  randomNumber(num1, num2) {
    return Math.floor(Phaser.Math.Between(num1, num2));
  }
  updatePlatforms() {
    const x = 900;
    const y = this.randomNumber(
      this.halfHeightScreen - 160,
      this.halfHeightScreen + 160
    );
    const w = 300 - this.allNumberOfPlatformsInGame * 3;
    const h = this.gh - 55;
    const theme = this.platformThemes[this.platformThemeIndex];
    let firstPlatform = this.platforms.shift();
    this.platforms.push(firstPlatform);
    firstPlatform.setup(x, y, w, h, theme);
    this.increaseNumberOfPlatforms();
    if (this.allNumberOfPlatformsInGame === 5) {
    }
  }
  addScore() {
    this.scoreText = this.add
      .text(this.halfW, this.gh / 10, this.score, {
        fontFamily: "Arial",
        fontSize: "90px",
        color: "#FFFFFF",
        stroke: "#000000",
        strokeThickness: 10,
        shadow: { blur: 0, stroke: false, fill: false },
      })
      .setOrigin(0.5, 0.5);
  }
  changeScene(key, key2) {
    if (!this.scene.isPaused(key)) {
      this.scene.launch(key, { currentScene: key2 });
      this.scene.bringToTop(key);
      return;
    }

    const scene = this.scene.get(key);
    this.scene.pause();
    this.scene.setVisible(false, key2);
    this.scene.setVisible(true, key);
    scene.scene.restart({ currentScene: key2 });
    this.scene.bringToTop(key);
  }
  addTutorial() {
    if (this.bestScore !== 0) return;
    this.tutorial = new Tutorial(this, this.halfW, this.halfHeightScreen);
  }
  addPauseButton() {
    new Button(this, this.gw - 50, this.gh / 10, "pauseButton").on(
      "pointerdown",
      function (event) {
        this.audio.click.play();
        this.scene.setVisible(false, "PlayScene");
        this.changeScene("PauseScene", "PlayScene");
        event.stopPropagation();
      },
      this
    );
  }
}
