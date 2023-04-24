const targetWidth = 720;
const targetHeight = 1280;
const statusbarHeight = 30;

const deviceRatio = window.innerHeight / window.innerWidth;

const newRatio = (targetWidth / targetHeight) * deviceRatio;

const gameWidth = targetWidth;
const gameHeight = targetHeight * newRatio;

const halfGameWidth = gameWidth / 2;
const halfGameHeight = gameHeight / 2;

const config = {
  type: Phaser.AUTO,
  parent: "div",
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
      gravity: { y: 1000 },
    },
  },

  scale: {
    mode: Phaser.Scale.FIT,
    width: gameWidth,
    height: gameHeight,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },

  dom: {
    createContainer: true,
  },
  scene: [
    PreloadScene,
    LoginScene,
    MenuScene,
    PlayScene,
    RankScene,
    PauseScene,
    SettingsScene,
    RankingScene,
  ],
};

const game = new Phaser.Game(config);
