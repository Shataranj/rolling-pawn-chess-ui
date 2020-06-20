const showTable = function (game) {
  const gamesElement = document.querySelector("#games tbody");

  const boardIDElem = `<td>${game.board_id}</td>`;
  const gameIDElem = `<td>${game.game_id}</td>`;
  const opponentElem = `<td>${game.with_engine}</td>`;
  const gameStatusElem = `<td><button id=${game.game_id} class="glow-on-hover" onclick="fetchGame()">${game.game_status}</button></td>`;
  gamesElement.innerHTML += `<tr>${boardIDElem}${gameIDElem}${opponentElem}${gameStatusElem}</tr>`;
};

const fetchGame = function () {
  const gameId = event.target.id;
  console.log(`Game ID: ${gameId}`);
  window.location = window.location.origin + `/game?gameId=${gameId}`
};

const fetchGames = function () {
  fetch('/config').then(res => res.json()).then(({ apiURL }) => {
    fetch(apiURL + "/get_all_games?status=In Progress")
        .then((res) => res.json())
        .then((games) => games.map(showTable));
  });
}

window.onload = fetchGames ;
