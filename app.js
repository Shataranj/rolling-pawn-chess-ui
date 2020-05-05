const express = require("express");
const app = express();
const http = require("http").Server(app);
const cors = require("cors");
const logger = require("morgan");
const url = require("url");
const DatabaseHelper = require("./mongo_helper");
const MongoClient = require("mongodb").MongoClient;

const bodyParser = require("body-parser");

const PORT = process.env.PORT || 3000;
const DB_URL = process.env.DB_URL;
const DB_TABLE = process.env.DB_TABLE;
const DB_NAME = process.env.DB_NAME;
const API_ENDPOINT = process.env.API_ENDPOINT || 'http://0.0.0.0:5000';

const databaseHelper = new DatabaseHelper(MongoClient, DB_URL);

app.use(cors(origin="*"));
app.use(express.static("public"));
app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

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
  const gameDetails = (await databaseHelper.find("chess_game", { _id: gameId }))[0];
  res.setHeader("Set-Cookie", `fen=${gameDetails.currentFen}`);
  res.sendFile(__dirname + "/public/gameplay.html");
});

app.get('/config', (req, res) => {
  res.send({ apiURL: API_ENDPOINT });
})

http.listen(PORT, async function () {
  await databaseHelper.connect(DB_NAME);
  console.log("listening on *: " + PORT);
});
