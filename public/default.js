let board;
let game;
let socket;

const getCookie = function(name) {
    // Split cookie string and get all individual name=value pairs in an array
    const cookieArr = document.cookie.split(";");
    
    // Loop through the array elements
    for(let i = 0; i < cookieArr.length; i++) {
        let cookiePair = cookieArr[i].split("=");
        
        /* Removing whitespace at the beginning of the cookie name
        and compare it with the given string */
        if(name == cookiePair[0].trim()) {
            // Decode the cookie value and return
            return decodeURIComponent(cookiePair[1]);
        }
    }
    // Return null if not found
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

window.onload = function () {
  fetch('/config').then(res => res.json()).then(({ apiURL }) => {
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
};
