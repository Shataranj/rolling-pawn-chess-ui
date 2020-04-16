const showTable = function (game) {
  const gamesElement = document.querySelector("#games tbody");

  const boardIDElem = `<td>${game.boardId}</td>`;
  const gameIDElem = `<td>${game.gameId}</td>`;
  const opponentElem = `<td>${game.withEngine}</td>`;
  const gameStatusElem = `<td><button id=${game.gameId} class="glow-on-hover" onclick="fetchGame()">${game.gameStatus}</button></td>`;
  gamesElement.innerHTML += `<tr>${boardIDElem}${gameIDElem}${opponentElem}${gameStatusElem}</tr>`;
};

const fetchGame = function () {
  const gameId = event.target.id;
  console.log(`Game ID: ${gameId}`);
  window.location = `https://rolling-pawn.herokuapp.com/game?gameId=${gameId}`
};

const getOnlineGames = function () {
  fetch("https://rolling-pawn.herokuapp.com/games/in_progress")
    .then((res) => res.json())
    .then((games) => games.map(showTable));
    
};

window.onload = getOnlineGames;
