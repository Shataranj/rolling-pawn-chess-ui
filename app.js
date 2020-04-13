const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const cors = require("cors");
const logger = require("morgan");
const url = require("url");
const DatabaseHelper = require("./mongo_helper");
const MongoClient = require("mongodb").MongoClient;

const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({ extended: false });

const PORT = process.env.PORT || 3000;
const DB_URL = process.env.DB_URL;
const DB_TABLE = process.env.DB_TABLE;
const DB_NAME = process.env.DB_NAME;

const databaseHelper = new DatabaseHelper(MongoClient, DB_URL);

app.use(cors());
app.use(express.static("public"));
app.use(logger("dev"));

app.post("/move", urlencodedParser, function (req, res) {
  // {color: "w", from: "d2", to: "d4", flags: "b", piece: "p", …}
  response = {
    from: req.body.from,
    to: req.body.to,
  };
  console.log(response);
  io.emit("move", response);
  res.end(JSON.stringify(response));
});

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/public/index.html");
});

app.get("/login", function (req, res) {
  res.sendFile(__dirname + "/public/portal-login.html");
});

app.get("/games/in_progress", async (req, res) => {
  const IPGames = await databaseHelper.find(DB_TABLE, {
    gameStatus: "In Progress",
  });
  res.send(IPGames);
});

app.get("/game", async (req, res) => {
  const { gameId } = url.parse(req.url, true).query;
  console.log(gameId);
  const gameDetails = (await databaseHelper.find("chess_game", { _id: gameId }))[0];
  res.send(gameDetails);
});

http.listen(PORT, async function () {
  await databaseHelper.connect(DB_NAME);
  console.log("listening on *: " + PORT);
});

io.on("connection", function (socket) {
  console.log("new connection");

  socket.on("move", function (msg) {
    socket.broadcast.emit("move", msg);
  });
});
