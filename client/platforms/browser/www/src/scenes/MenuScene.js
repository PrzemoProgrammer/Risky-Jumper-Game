class MenuScene extends Phaser.Scene {
  constructor() {
    super("MenuScene");
  }
  create() {
    this.gw = gameWidth;
    this.gh = gameHeight;
    this.halfW = halfGameWidth;
    this.halfH = halfGameHeight;

    this.audio = this.game.audio;
    this.audio.mainMenu.play();
    this.addBackground();

    this.addBackgroundComponents();
    this.addRiskyJumperText();
    this.addPlayButton();
    this.addSettingsButton();
    this.addRankingButton();
    this.addAchievementsButton();
    this.checkConnectionStatus();
  }

  addBackground() {
    this.add
      .image(0, 0, "menuBg")
      .setOrigin(0, 0)
      .setDisplaySize(this.gw, this.gh);
  }

  addRiskyJumperText() {
    this.add.image(this.halfW, this.gh / 7, "riskyJumperText");
  }
  addSettingsButton() {
    new Button(
      this,
      this.halfW - this.gw / 3,
      this.gh - this.gh / 3 + 250,
      "settingsButton"
    ).onClick(() => {
      this.audio.click.play();
      this.scene.bringToTop("SettingsScene");
      this.scene.setVisible(true, "SettingsScene");
      this.scene.resume("SettingsScene");
      if (!this.scene.isPaused("SettingsScene")) {
        this.scene.launch("SettingsScene");
      }
    });
  }
  addRankingButton() {
    new Button(
      this,
      this.halfW,
      this.gh - this.gh / 3 + 250,
      "rankingButton"
    ).onClick(() => {
      this.audio.click.play();
      this.changeScene("RankingScene", "MenuScene");
    });
  }
  addAchievementsButton() {
    new Button(
      this,
      this.halfW + this.gw / 3,
      this.gh - this.gh / 3 + 250,
      "achivButton"
    ).onClick(() => {
      this.audio.click.play();
      this.changeScene("RankScene", "MenuScene");
    });
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
  addBackgroundComponents() {
    this.addLayer1(this.halfW, this.gh);
    this.addClouds(this.halfW, this.gh / 4);
    this.addPlatform1(this.halfW - 150, this.gh - this.gh / 3);
    this.addPlatform2(this.halfW + 200, this.gh - this.gh / 3 - 200);
    this.addHeroIcon(this.halfW, this.halfH);
    this.addGround(this.halfW, this.gh);
  }

  addLayer1(x, y) {
    this.add.image(x, y, "menuLayer1").setOrigin(0.5, 1);
  }

  addClouds(x, y) {
    const clouds = this.add.image(x, y, "menuClouds").setOrigin(0.5, 0);

    const animConfig = {
      target: clouds,
      x: clouds.x - 20,
      y: clouds.y + 15,
      time: 2100,
    };

    this.moveAnim(animConfig);
  }

  addPlatform1(x, y) {
    const platform1 = this.add.image(x, y, "menuPlatform1").setOrigin(0.5, 0);

    const animConfig = {
      target: platform1,
      x: platform1.x - 20,
      y: platform1.y + 15,
      time: 2000,
    };

    this.moveAnim(animConfig);
  }

  addPlatform2(x, y) {
    const platform2 = this.add.image(x, y, "menuPlatform2").setOrigin(0.5, 0);

    const animConfig = {
      target: platform2,
      x: platform2.x - 20,
      y: platform2.y + 15,
      time: 2500,
    };

    this.moveAnim(animConfig);
  }

  addHeroIcon(x, y) {
    const menuHero = this.add.image(x, y, "heroMenuIcon").setOrigin(0.5, 0.5);

    const animConfig = {
      target: menuHero,
      x: menuHero.x - 20,
      y: menuHero.y + 15,
      time: 2200,
    };

    this.moveAnim(animConfig);
  }

  addGround(x, y) {
    this.add.image(x, y, "menuGround").setOrigin(0.5, 1);
  }

  moveAnim({ target, x, y, time, ease = "Sine.easeInOut" }) {
    this.tweens.add({
      targets: target,
      x,
      y,
      ease,
      duration: time,
      yoyo: true,
      repeat: -1,
    });
  }
  addPlayButton() {
    const button = new Button(
      this,
      this.halfW,
      this.gh - this.gh / 3,
      "playButton"
    ).onClick(() => {
      this.audio.mainMenu.stop();
      this.audio.click.play();
      this.scene
        .sleep("MenuScene")
        .resume("PlayScene")
        .swapPosition("MenuScene", "PlayScene");
      this.scene.setVisible(false, "MenuScene");
    });
    this.tweens.add({
      targets: button,
      ease: "Power2",
      scaleX: 1.1,
      scaleY: 1.1,
      duration: 500,
      yoyo: true,
      repeat: -1,
    });
  }

  addConnectionProblemText(x, y) {
    const text = "Nick couldn't be saved\ndue to a connection problem";

    this.connectionStatus = this.add
      .text(x, y, text, {
        fontFamily: "Arial",
        fontSize: "50px",
        color: "#FF0000",
        stroke: "#FF0000",
        strokeThickness: 3,
        shadow: { blur: 0, stroke: false, fill: false },
      })
      .setOrigin(0.5, 0.5);
  }

  checkConnectionStatus() {
    if (localStorage.getItem("nickname")) return;
    this.addConnectionProblemText(this.halfW, this.halfH);
  }
}
