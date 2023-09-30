class Platform {
  constructor(scene, config) {
    this.scene = scene;
    this.config = config;
    this.addSkeleton();
    this.addTexture();
    this.addTopGround();
    this.addLeftCorner();
    this.addRightCorner();
    this.addTopLight();
    this.addLeftLight();
    this.addRightLight();
    this.container = this.scene.add.container(this.config.x, this.config.y, [
      this.skeleton,
      this.tileTexture,
      this.topGround,
      this.leftCorner,
      this.rightCorner,
      this.topLight,
      this.leftLight,
      this.rightLight,
    ]);
  }
  addLeftCorner() {
    this.leftCorner = this.scene.add
      .image(this.skeleton.x, this.skeleton.y, "floorLightCorner")
      .setTint(this.config.theme.basic_color);
  }
  addSkeleton() {
    this.skeleton = this.scene.physics.add
      .sprite(0, 0, "floor")
      .setVisible(false)
      .setOrigin(0, 0)
      .setDisplaySize(this.config.w, this.config.h)
      .setImmovable(true);
    this.scene.physics.world.enableBody(this.skeleton);
    this.skeleton.body.allowGravity = false;
  }
  addTexture() {
    this.tileTexture = this.scene.add
      .tileSprite(0, 0, this.config.w, this.config.h, this.config.theme.texture)
      .setOrigin(0, 0);
    this.tileTexture.tilePositionX -= this.config.w / 2 + 40;
  }
  addTopGround() {
    this.topGround = this.scene.add
      .tileSprite(0, 0, this.config.w, 49, "platformFloor")
      .setOrigin(0, 0)
      .setTint(this.config.theme.basic_color);
    this.topGround.tilePositionX -= this.config.w / 2 + 40;
  }
  addRightCorner() {
    this.rightCorner = this.scene.add
      .image(
        this.skeleton.x + this.skeleton.displayWidth,
        this.skeleton.y,
        "floorLightCorner"
      )
      .setTint(this.config.theme.basic_color);
    this.rightCorner.flipX = true;
  }
  addTopLight() {
    this.topLight = this.scene.add
      .image(
        this.skeleton.x + this.leftCorner.displayWidth / 2,
        this.skeleton.y,
        "floorLight"
      )
      .setOrigin(0, 0.5)
      .setTint(this.config.theme.basic_color);
    this.topLight.displayWidth =
      this.skeleton.displayWidth - this.leftCorner.displayWidth;
  }
  addLeftLight() {
    this.leftLight = this.scene.add
      .image(
        this.skeleton.x,
        this.skeleton.y + this.leftCorner.displayWidth / 2,
        "floorLight"
      )
      .setTint(this.config.theme.basic_color)
      .setOrigin(0, 0.5)
      .setAngle(90);
    this.leftLight.displayWidth = this.skeleton.displayHeight;
  }
  addRightLight() {
    this.rightLight = this.scene.add
      .image(
        this.skeleton.x + this.skeleton.displayWidth,
        this.skeleton.y + this.leftCorner.displayWidth / 2,
        "floorLight"
      )
      .setTint(this.config.theme.basic_color)
      .setOrigin(0, 0.5)
      .setAngle(90);
    this.rightLight.displayWidth = this.skeleton.displayHeight;
  }
  move(value) {
    this.container.x += value;
  }
  setup(x, y, w, h, config) {
    const {
      container,
      skeleton,
      tileTexture,
      topGround,
      leftCorner,
      rightCorner,
      topLight,
      leftLight,
      rightLight,
    } = this;
    const { texture, basic_color } = config;
    container.setPosition(x, y);
    tileTexture.setTexture(texture);
    [topGround, tileTexture, skeleton.body, rightCorner, rightLight].forEach(
      (obj) => (obj.width = w)
    );
    topLight.displayWidth = w - leftCorner.displayWidth;
    rightLight.x = skeleton.x + w;
    rightCorner.x = rightLight.x;
    [topGround, tileTexture].forEach(
      (obj) => ((obj.tilePositionX = 0), (obj.tilePositionX -= w / 2 + 40))
    );
    [
      leftCorner,
      rightCorner,
      topLight,
      leftLight,
      rightLight,
      topGround,
    ].forEach((obj) => obj.setTint(basic_color));
  }
}
