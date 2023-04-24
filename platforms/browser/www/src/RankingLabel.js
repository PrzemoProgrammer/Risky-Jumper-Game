class Label {
  constructor(scene, x, y, number, score, nick) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.score = score;
    this.nickname = nick;
    this.number = number;

    this.localNick = localStorage.getItem("nickname");
    this.admins = {
      sid: "Sid",
      muran: "Muran",
    };

    this.addBackground();
    this.addNick(this.bg.x - 230, this.bg.y - 20);
    this.addScore(this.bg.x + 300, this.bg.y - 30);

    this.container = this.scene.add.container(this.x, this.y, [
      this.bg,
      this.score,
      this.nick,
    ]);
    this.addRankNumbers(this.bg.x - this.bg.width / 2 + 10, this.bg.y - 36);
    this.addAdmin();
  }

  addBackground() {
    this.bg = this.scene.add.image(0, 0, "rankingPlayerBg");
  }

  addScore(x, y) {
    this.score = this.addText(x, y, this.score).setFontSize(60).setOrigin(1, 0);
  }

  addNumber(x, y, number) {
    this.number = this.addText(x, y, number + ")").setFontSize(60);
    this.container.add([this.number]);
  }

  addMedal(x, y, image) {
    this.medal = this.scene.add.image(x, y, image);
    this.container.add([this.medal]);
  }

  addRankNumbers(x, y) {
    let number = this.number;
    let movedX = x + 40;
    let movedY = y + 50;

    switch (number) {
      case 1:
        this.addMedal(movedX, movedY, "firstPlace");
        break;
      case 2:
        this.addMedal(movedX, movedY, "secondPlace");
        break;
      case 3:
        this.addMedal(movedX, movedY, "thirdPlace");
        break;
      default:
        this.addNumber(x + 20, y + 10, number);
    }
  }

  addNick(x, y) {
    this.nick = this.addText(x + 10, y, this.nickname).setOrigin(0, 0);
    console.log(this.nick);
  }

  addAdmin() {
    const color = "#B8860B";
    if (this.localNick === this.nickname) {
      this.nick.setColor(color).setStroke(color);
    }

    if (this.isAdmin()) {
      this.addAdminText(this.nick.x + this.nick.width + 5, this.nick.y);
    }
  }

  isAdmin() {
    return (
      this.nickname === this.admins.sid || this.nickname === this.admins.muran
    );
  }

  addAdminText(x, y) {
    const text = "(ADMIN)";
    const color = "#FF0000";
    this.paragraph = this.addText(x, y, text)
      .setOrigin(0, 0)
      .setColor(color)
      .setFontSize(30);

    this.container.add([this.paragraph]);
  }

  hide() {
    this.score.setVisible(false);
    this.nick.setVisible(false);
  }

  addText(x, y, text) {
    return this.scene.add.text(x, y, text, {
      fontFamily: "Arial",
      fontSize: "40px",
      color: "#000000",
      stroke: "#000000",
      strokeThickness: 1,
      shadow: { blur: 0, stroke: false, fill: false },
    });
  }
}
