var board;
var game;
var socket = io();


// window.onload = function () {initGame();};
var initGame = function(fen) {
   var cfg = {
       draggable: true,
       position: fen,
       onDrop: handleMove,
   };
   board = new ChessBoard('gameBoard', cfg);
   game = new Chess(fen);
   console.log("board created")
};

var handleMove = function(source, target ) {
    console.log(source, target)
    var move = game.move({from: source, to: target});
    console.log(move);
    if (move === null)  return 'snapback';
    else socket.emit('move', move);
};

socket.on('move', function(msg) {
    game.move(msg);
    board.position(game.fen());
});