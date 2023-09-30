const mongoose = require("mongoose");
mongoose.set("strictQuery", true);
const Player = require("./models/Player");

class DatabaseManager {
  constructor() {}

  async connectDatabase() {
    await mongoose
      .connect("ENTER URL", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(async () => {
        console.log("DB init");
      });
  }

  async addPlayer(data) {
    const player = new Player({
      id: data.id,
      nick: data.nick,
      score: data.score,
    });

    await player
      .save()
      .then((savedDoc) => {
        console.log("Player saved in database");
      })
      .catch((error) => {
        console.log(error + " Player NOT saved in database");
      });

    return true;
  }

  updatePlayer(data) {
    return Player.updateOne(
      { id: data.id },
      {
        $set: {
          score: data.score,
        },
      }
    );
  }

  findPlayer(data) {
    return Player.findOne(data);
  }

  downloadPlayer(data) {
    return this.findPlayer(data).then((player) => {
      if (!player) {
        return "Player does not exist";
      }
      return player;
    });
  }

  downloadPlayers() {
    return Player.find({});
  }
}

mongoose.connection.on("connected", function () {
  console.log("Connected to mongo");
});

mongoose.connection.on("error", (error) => {
  console.log("Mongo connection ERROR", error);
});

module.exports = DatabaseManager;
