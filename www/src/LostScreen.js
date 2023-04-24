class LostScreen {
  constructor(scene, score, bestScore) {
    this.scene = scene;
    this.gw = gameWidth;
    this.gh = gameHeight;
    this.score = score;
    this.bestScore = bestScore;

    this.deleteTimeResponseText = 4000;
    this.medalColors = [9127187, 7568545, 16170496, 205];
    this.addScoreBoard(0, 0);
    this.addScoreText(this.scoreBoard.x + 140, this.scoreBoard.y - 175);
    this.addBestScoreText(this.scoreBoard.x + 140, this.scoreBoard.y + 5);
    this.addReplayButton(this.scoreBoard.w / 2, this.scoreBoard.y + 240);
    this.addShareScoreButton(
      this.bestScoreFrame.x,
      this.bestScoreFrame.y + 125
    );
    this.addAchievementsButton(
      this.scoreBoard.w / 2 + 150,
      this.replayButton.y + 130
    );
    this.addRankingButton(
      this.scoreBoard.w / 2 - 150,
      this.replayButton.y + 130
    );
    this.addResponseText(this.shareButton.x, this.shareButton.y + 60);
    this.addMedal(this.scoreBoard.x - 150, this.scoreBoard.y - 60);
    this.container = this.scene.add.container(
      this.gw / 2,
      -this.scoreBoard.displayHeight,
      [
        this.scoreBoard,
        this.scoreText,
        this.bestScoreText,
        this.shareButton,
        this.responseText,
        this.replayButton,
        this.achievementsButton,
        this.rankingButton,
        this.medalColor,
        this.medal,
        this.bestScoreFrame,
      ]
    );
    this.updateScore();
    this.updateMedalColor();
    this.addAppearanceAnimation();
  }
  addScoreBoard(x, y) {
    this.scoreBoard = this.scene.add.image(x, y, "scoreBoard");
  }
  addMedal(x, y) {
    this.addMedalColor(x, y);
    this.medal = this.scene.add.image(x, y, "medalSmaller").setVisible(false);
  }
  addMedalColor(x, y) {
    this.medalColor = this.scene.add
      .image(x, y, "smallerMedalColor")
      .setVisible(false)
      .setTint(9127187);
  }
  addReplayButton(x, y) {
    this.replayButton = new Button(this.scene, x, y, "replayButton");
  }
  addAchievementsButton(x, y) {
    this.achievementsButton = new Button(this.scene, x, y, "achivButton2");
  }
  addRankingButton(x, y) {
    this.rankingButton = new Button(this.scene, x, y, "rankingButton2");
  }
  addScoreText(x, y) {
    this.scoreText = addText(this.scene, x, y, this.score);
  }
  addBestScoreText(x, y) {
    this.bestScoreText = addText(this.scene, x, y, this.bestScore);
    this.addUpdateBestRecordFrame(x, y - 25);
  }
  addUpdateBestRecordFrame(x, y) {
    this.bestScoreFrame = this.scene.add
      .image(x, y, "newRecordUpdate")
      .setVisible(false);
  }

  addResponseText(x, y) {
    this.responseText = this.scene.add
      .text(x, y, "", {
        fontFamily: "Arial",
        fontSize: "30px",
        color: "#00FF00",
        stroke: "#00FF00",
        strokeThickness: 0,
        shadow: { blur: 0, stroke: false, fill: false },
      })
      .setOrigin(0.5, 0.5)
      .setVisible(false);
  }

  changeResponseText(value) {
    let text = "";
    let color = "";

    if (value) {
      text = "Update successfully !";
      color = "#00FF00";
    } else {
      text = "Update failed";
      color = "#FF0000";
    }

    this.responseText.setText(text);
    this.responseText.setColor(color);

    this.responseText.setVisible(true);
    setTimeout(() => {
      this.responseText.setVisible(false);
    }, this.deleteTimeResponseText);
  }

  addShareScoreButton(x, y) {
    this.shareButton = new Button(this.scene, x, y, "shareButton").setVisible(
      false
    );
  }
  setNewRecord() {
    localStorage.setItem("bestScore", this.score);
    this.bestScoreText.setText(this.score);
    this.bestScoreFrame.setVisible(true);
    this.shareButton.setVisible(true);
  }
  isNewRecord() {
    return this.score > this.bestScore;
  }
  updateScore() {
    if (this.isNewRecord()) this.setNewRecord();
  }
  addAppearanceAnimation() {
    this.scene.tweens.add({
      targets: this.container,
      ease: "Power2",
      y: this.gh / 2,
      duration: 300,
      onComplete: () => {},
    });
  }
  updateMedalColor() {
    const medalColors = { 20: 9127187, 40: 7568545, 60: 16170496, 80: 205 };
    const scoreFloor = Math.floor(this.score / 20) * 20;
    const scoreCapped = Math.min(80, scoreFloor);
    if (this.score >= this.bestScore && scoreCapped in medalColors) {
      const color = medalColors[scoreCapped];
      if (color !== this.currentMedalColor) {
        this.medalColor.setTint(color);
        [this.medalColor, this.medal].forEach((component) => {
          component.setVisible(true);
        });
        this.currentMedalColor = color;
      }
    }
  }
}
function addText(scene, x, y, text) {
  return scene.add
    .text(x, y, text, {
      fontFamily: "Arial",
      fontSize: "80px",
      color: "#FFFFFF",
      stroke: "#FFFFFF",
      strokeThickness: 3,
      shadow: { blur: 0, stroke: false, fill: false },
    })
    .setOrigin(0.5, 0.5);
}
