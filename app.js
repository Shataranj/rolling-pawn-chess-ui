var express = require('express');
var app = express();
app.use(express.static('public'));
var http = require('http').Server(app);
var port = process.env.PORT || 3000;
var io = require('socket.io')(http);

var bodyParser = require('body-parser');  
var urlencodedParser = bodyParser.urlencoded({ extended: false })  


app.post('/move', urlencodedParser, function (req, res) {  

    // {color: "w", from: "d2", to: "d4", flags: "b", piece: "p", …}
    response = {  
        'from': req.body.from,
        'to': req.body.to
    };  
    console.log(response); 
    io.emit('move', response); 

    res.end(JSON.stringify(response));  
 })  


app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/default.html');
});

http.listen(port, function() {
    console.log('listening on *: ' + port);
});

io.on('connection', function(socket) {
    console.log('new connection');
    
    socket.on('move', function(msg) {
       socket.broadcast.emit('move', msg); 
    });
});