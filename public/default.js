let board;
let game;
let socket;

const getCookie = function(name) {
    const cookieArr = document.cookie.split(";");
    
    for(let i = 0; i < cookieArr.length; i++) {
        let cookiePair = cookieArr[i].split("=");
        if(name == cookiePair[0].trim()) {
            return decodeURIComponent(cookiePair[1]);
        }
    }
    return null;
}

const initGame = function () {
  const fen = getCookie("fen")
  const cfg = {
    draggable: true,
    position: fen,
    onDrop: handleMove,
  };
  board = new ChessBoard("gameBoard", cfg);
  $(window).resize(board.resize)
  game = new Chess(fen);
  console.log("board created");
};

const handleMove = function (source, target) {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const gameId = urlParams.get('gameId');
    const move = {from: source, to: target, game_id: gameId};
    fetch('/config').then(res => res.json())
        .then(({apiURL}) =>
            fetch(apiURL + "/move", {
                method: "post",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(move)
            }))
}
const setupGame = function() {
    fetch('/config').then(res => res.json()).then(({apiURL}) => {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const currentGameID = urlParams.get('gameId')

        socket = io.connect(apiURL);
        socket.on("move", function (msg) {
            if (msg.game_id == currentGameID) {
                game.move(msg);
                board.position(game.fen());
            }
        });
        initGame();
    })
}

const download = function(fileName, content) {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,'
        + encodeURIComponent(content));
    element.setAttribute('download', fileName);
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

const downloadPgn = function(){
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const gameId = urlParams.get('gameId');
    fetch('/config').then(res => res.json())
        .then(({apiURL}) =>
            fetch(apiURL + `/pgn?gameId=${gameId}`))
        .then(res => res.json())
        .then(({pgn}) => download(`${gameId}.pgn`, pgn))
}

window.onload = function () {
    let downloadButton = document.getElementById("download-pgn");
    downloadButton.onclick = downloadPgn;
    setupGame();
};
