const http = require("http");
const compression = require("compression");
const express = require("express");
const app = express();
const server = http.createServer(app);
const cors = require("cors");
const DatabaseManager = require("./MongoDB/DatabaseManager");
const port = process.env.PORT || 8081;

app.use(
  cors({
    origin: "*",
  })
);
app.use(compression());
app.use(express.json());
app.use(express.static(`${__dirname}/../client`));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

const databaseManager = new DatabaseManager();
databaseManager.connectDatabase();

app.post("/createAccount", async (req, res) => {
  let reqData = req.body;
  let databaseData = {};
  let resData = "";

  const isExistingNick = await databaseManager.findPlayer({
    nick: reqData.nick,
  });

  if (isExistingNick === null && reqData.nick !== " " && reqData.nick !== "") {
    databaseData = {
      id: reqData.id,
      nick: reqData.nick,
      score: 0,
    };

    await databaseManager.addPlayer(databaseData);
    resData = true;
  } else {
    resData = false;
  }

  res.json(resData);
});

app.post("/updateScore", async (req, res) => {
  let reqData = req.body;
  let resData = "";

  const getPlayer = await databaseManager.findPlayer({
    id: reqData.id,
  });

  if (
    getPlayer &&
    getPlayer.id === reqData.id &&
    getPlayer.nick === reqData.nick
  ) {
    await databaseManager.updatePlayer({
      id: reqData.id,
      score: reqData.score,
    });

    resData = true;
  } else {
    resData = true;
  }

  res.json(resData);
});

app.get("/playersStatus", async (req, res) => {
  let players = await databaseManager.downloadPlayers();

  players.sort((a, b) => b.score - a.score);

  players.forEach((obj) => (obj.id = 0));

  players.splice(15);

  res.json(players);
});

server.listen(port, function () {
  console.log(`Listening on ${server.address().port}`);
});
