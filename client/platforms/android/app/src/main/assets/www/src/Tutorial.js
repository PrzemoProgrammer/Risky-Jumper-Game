class Tutorial {
  constructor(scene, x, y) {
    this.scene = scene;
    this.x = x;
    this.y = y;

    this.gw = gameWidth;
    this.gh = gameHeight;

    this.repeats = 0;
    this.maxRepeats = 2;

    this.addBackground(0, 0);
    this.addHand(this.x, this.gh - 300);
    this.addTouchedHand(this.x, this.gh - 300);
    this.addLine(this.x - 230, this.y - 250);

    this.animHand();
  }

  addBackground(x, y) {
    this.bg = this.scene.add
      .image(x, y, "darkScreen")
      .setOrigin(0, 0)
      .setDisplaySize(this.gw, this.gh);
  }

  addHand(x, y) {
    this.hand1 = this.scene.add.image(x, y, "hand1");
  }

  addTouchedHand(x, y) {
    this.hand2 = this.scene.add.image(x, y, "hand2").setVisible(false);
  }

  addLine(x, y) {
    this.line = this.scene.add.image(x, y, "tutorialLine").setOrigin(0, 0);
    this.line.displayWidth = 50;
  }

  addBackButton(x, y) {
    this.backButton = new Button(this.scene, x, y, "backButton").onClick(() => {
      this.hand1.destroy();
      this.hand2.destroy();
      this.line.destroy();
      this.backButton.destroy();
    });
  }

  tutorialDestroy() {
    this.bg.destroy();
    this.hand1.destroy();
    this.hand2.destroy();
    this.line.destroy();
  }

  animHand() {
    this.scene.tweens.add({
      targets: this.hand1,
      scale: 0.7,
      duration: 500,
      onComplete: () => {
        this.hand1.setVisible(false);
        this.hand2.setVisible(true);
        this.animLine();
      },
      onUpdate: () => {},
      onStart: () => {},
    });
  }

  animLine() {
    this.scene.tweens.add({
      targets: this.line,
      displayWidth: 400,
      duration: 1000,
      onComplete: () => {
        if (this.repeats === this.maxRepeats) {
          this.tutorialDestroy();
          return;
        }

        this.repeats += 1;
        this.hand1.setScale(1);
        this.hand1.setVisible(true);
        this.hand2.setVisible(false);
        this.line.displayWidth = 50;
        this.animHand();
      },
    });
  }
}
