const showTable = function (game) {
    const gamesElement = document.querySelector("#games tbody");

    const gameIDElem = `<td>${game.game_id}</td>`;
    const withEngine = `<td>${game.with_engine}</td>`;
    const gameStatusElem = `<td><button id=${game.game_id} class="glow-on-hover" onclick="fetchGame()">${game.game_status}</button></td>`;
    gamesElement.innerHTML += `<tr>${gameIDElem}${withEngine}${gameStatusElem}</tr>`;
};

const fetchGame = function () {
    const gameId = event.target.id;
    console.log(`Game ID: ${gameId}`);
    window.location = window.location.origin + `/game?gameId=${gameId}`
};

const fetchMyGames = function () {
    fetch('/config')
        .then(res => res.json())
        .then(({apiURL}) => fetch(apiURL + "/my_games",
            {headers: {"x-access-token": localStorage.getItem("token")}}))
        .then(res => res.json())
        .then(data => data.games.map(showTable));
}

window.onload = fetchMyGames;
