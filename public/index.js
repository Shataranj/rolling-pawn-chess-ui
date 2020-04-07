const showTable = function (game) {
  const gamesElement = document.querySelector("#games");

  const boardIDElem = `<td>${game.boardId}</td>`;
  const gameIDElem = `<td>${game.gameId}</td>`;
  const opponentElem = `<td>${game.withEngine}</td>`;
  const gameStatusElem = `<td><button id=${game.gameId} onclick="fetchGame()">${game.gameStatus}</button></td>`;
  gamesElement.innerHTML += `<tr>${boardIDElem}${gameIDElem}${opponentElem}${gameStatusElem}</tr>`;
};

const fetchGame = function () {
  const gameId = event.target.id;
  fetch(`https://rolling-pawn.herokuapp.com/game?gameId=${gameId}`)
    .then((res) => res.json())
    .then((game) => initGame(game.currentFen));
};

{
  /* <a href=${window.location}game?gameID=${game.gameId}> ${game.gameStatus}</a> */
}

const getOnlineGames = function () {
  fetch("https://rolling-pawn.herokuapp.com/games/in_progress")
    .then((res) => res.json())
    .then((games) => games.map(showTable));
};

window.onload = getOnlineGames;
