class Button extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, sprite) {
    super(scene, x, y, sprite);
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.sprite = sprite;
    scene.add.existing(this);

    this.setInteractive();
  }

  onClick(cb) {
    this.on("pointerdown", () => {
      this.setScale(0.9);
    }).on("pointerup", () => {
      cb(), this.setScale(1);
    });

    return this;
  }
}
