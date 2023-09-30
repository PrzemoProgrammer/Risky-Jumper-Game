class LoginScene extends Phaser.Scene {
  constructor() {
    super("LoginScene");
  }

  create() {
    this.gw = gameWidth;
    this.gh = gameHeight;
    this.halfW = halfGameWidth;
    this.halfH = halfGameHeight;

    this.nickText = "";
    this.id = this.generateId();
    this.isStartButtonBLocked = false;

    this.profileMoveY = this.gh / 4;
    this.deleteTimeResponseText = 4000;

    this.addBackground(0, 0);
    this.addProfile(0, 0);
    this.addResponseText(this.profile.x, this.profile.y + 195);
    this.addTextInput(this.profile.x, this.profile.y + 130);
    this.addStartButton(this.profile.x, this.profile.y + 260);

    this.container = this.add.container(this.halfW, this.halfH - 200, [
      this.profile,
      this.notAvailableNickname,
      this.inputText,
      this.startButton,
    ]);
  }

  addBackground(x, y) {
    this.bg = this.add
      .image(x, y, "topBeltHorizontal")
      .setOrigin(0, 0)
      .setDisplaySize(this.gw, this.gh);
  }

  addProfile(x, y) {
    this.profile = this.add.image(x, y, "loginProfil");
  }

  addStartButton(x, y) {
    this.startButton = new Button(this, x, y, "startButton").onClick(() => {
      if (this.isStartButtonBLocked) return;
      this.isStartButtonBLocked = true;
      this.addLoadingAnim(this.halfW, this.halfH);
      this.sendServerRequest();
    });
  }

  addTextInput(x, y) {
    this.inputText = this.add
      .rexInputText({
        x: x,
        y: y,
        width: 450,
        height: 130,
        type: "textarea",
        placeholder: "nickname",
        placeholderColor: "#503af5",
        fontSize: "50px",
        fontFamily: "Arial",
        color: "#503af5",
        align: "center",
        maxLength: 10,
        minLength: 3,
      })

      .on("textchange", ({ text }) => {
        if (text.includes(" ")) {
          this.inputText.text = this.nickText || "";
          return;
        }
        this.nickText = text;
      })
      .on("focus", () => {
        this.addMoveAnim();
      });
  }

  addResponseText(x, y) {
    const text = "Nickname is not available";

    this.notAvailableNickname = this.add
      .text(x, y, text, {
        fontFamily: "Arial",
        fontSize: "30px",
        color: "#FF0000",
        stroke: "#FF0000",
        strokeThickness: 0,
        shadow: { blur: 0, stroke: false, fill: false },
      })
      .setOrigin(0.5, 0.5)
      .setVisible(false);
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

  async sendServerRequest() {
    const data = {
      nick: this.nickText,
      id: this.id,
    };

    console.log(data);

    try {
      const value = await (await CREATE_ACCOUNT(data)).json();
      console.log(value);
      if (value) {
        this.startNextScene();
      } else {
        this.addNickError();
      }
    } catch (error) {
      this.startMenuScene();
    }
  }

  startNextScene() {
    localStorage.setItem("nickname", this.nickText);
    this.startMenuScene();
  }

  addNickError() {
    this.isStartButtonBLocked = false;
    this.loadingDestroy();
    this.notAvailableNickname.setVisible(true);
    setTimeout(() => {
      this.notAvailableNickname.setVisible(false);
    }, this.deleteTimeResponseText);
  }

  startMenuScene() {
    this.scene
      .start("PlayScene")
      .pause("PlayScene")
      .start("MenuScene")
      .swapPosition("PlayScene", "MenuScene");

    this.scene.remove("LoginScene");
  }

  addMoveAnim() {
    this.tweens.add({
      targets: this.container,
      ease: "Power3",
      y: this.profileMoveY,
      duration: 1000,
    });
  }

  addLoadingAnim(x, y) {
    this.loading = this.add.image(x, y, "loading").setDepth(105);

    this.tweens.add({
      targets: this.loading,
      angle: 360,
      duration: 800,
      ease: "Linear",
      repeat: -1,
    });
  }

  loadingDestroy() {
    this.loading.destroy();
  }
}
