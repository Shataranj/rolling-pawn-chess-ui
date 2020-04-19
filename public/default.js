let board;
let game;
let socket = io();

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
  console.log(source, target);
  let move = game.move({ from: source, to: target });
  console.log(move);
  if (move === null) return "snapback";
  else socket.emit("move", move);
};

socket.on("move", function (msg) {
  game.move(msg);
  board.position(game.fen());
});

window.onload = function () {
  initGame();
};
