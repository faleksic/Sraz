var express = require('express');
var app = express();
var serv = require('http').Server(app);

app.get('/',function(req,res){
	res.sendFile(__dirname + '/Client/index.html');
});
app.use('/Client',express.static(__dirname + '/Client'));

serv.listen(2000);
console.log("Server started");

var svaPolja = [];
for (var i = 0; i < 49; i++){
	svaPolja.push(Math.round(Math.random() * 4));
}


var SOCKET_LIST = {};
var brojIgraca = 0;
var igracNaRedu = 1; //svaki parni igra 1, a svaki neparni 2 (ili suprotno)

var io = require('socket.io')(serv,{});

io.sockets.on('connection',function(socket){
	console.log('socket connection');
	
	brojIgraca++;
	socket.id = brojIgraca;
	

	socket.emit('newGame',svaPolja,socket.id);
	
	SOCKET_LIST[socket.id] = socket;
	
	if (brojIgraca == 2){
		for (var i in SOCKET_LIST){
			var socket = SOCKET_LIST[i];
			socket.emit('gameCanStart');
		}
	}
	
	
	
	socket.on('disconnect',function(){
		delete SOCKET_LIST[socket.id]
		brojIgraca--;
	});
	

	socket.on('correctAnswer',function(data){

	for (var i in SOCKET_LIST){
		//igracNaRedu++;
		var socket = SOCKET_LIST[i];
		socket.emit('skoci',data);
		
	}
	if (data[0].myID == 1)
	{
		var socket = SOCKET_LIST[2];
		socket.emit('enableMyFigures', 2);
	}
	if (data[0].myID == 2)
	{
		var socket = SOCKET_LIST[1];
		socket.emit('enableMyFigures', 1);
	}
	var socket = SOCKET_LIST[data[0].myID]; //posalji onom koji je poslao da mu blokiras figuice
	socket.emit('disbleAllFigures');
		
		
	});
});



/* setInterval(function(){
	var pack = [];
	for (var i in SOCKET_LIST){
		var socket = SOCKET_LIST[i];
		pack.push({
			id : socket.id,
			name : socket.name
		});
	}
	for (var i in SOCKET_LIST){
		var socket = SOCKET_LIST[i];
		socket.emit('posta',pack);
	}
},5000); */