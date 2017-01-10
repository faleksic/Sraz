var express = require('express');
var app = express();
var serv = require('http').Server(app);
var mysql = require('mysql');

var connection = mysql.createConnection({
	host:'eu-cdbr-azure-north-e.cloudapp.net',
	user:'bbe7f3209be205',
	password: 'b8690431',
	database: 'srazdb'
});

connection.connect();
var pitanje = [];
function glavniSelect(callback)
{
	connection.query('SELECT p.id, p.tekst as pitanje, p.tocan_odgovor, k.naziv as kategorija FROM pitanje p JOIN kategorija k ON (p.kategorija=k.id)',function(err,rows,fields){
	if (!err) {
		callback(rows);
	}
	else console.log('Error.');
});
}

function upisivanjeUPolje(rows){
	for(var i = 0;i < rows.length;i++)
	{
		pitanje[i] = {
			id : rows[i].id,
			pitanje : rows[i].pitanje,
			tocan_odgovor : rows[i].tocan_odgovor,
			kategorija : rows[i].kategorija
		};
		sporedniSelect(drugoUpisivanjeUPolje,pitanje[i].id, i);
	}
	
}
function sporedniSelect(callback,id, i){
	var q = 'select distinct ko.tekst from krivi_odgovor ko, pitanje p, pitanje_krivi_odgovor pko WHERE ko.id=pko.odgovor AND pko.pitanje='+id;
	connection.query(q,function(e,r,f){
	if (!e) {
		callback(r, i);
	}
	else console.log('Error.');
	});
}
function drugoUpisivanjeUPolje(rows, i)
{
	pitanje[i]['krivi_odgovor'] = 
	{
		krivi_odgovor1 : rows[0].tekst,
		krivi_odgovor2 : rows[1].tekst,
		krivi_odgovor3 : rows[2].tekst
	};
}
glavniSelect(upisivanjeUPolje);

app.get('/',function(req,res){
	res.sendFile(__dirname + '/Client/index.html');
});
app.use('/Client',express.static(__dirname + '/Client'));

serv.listen(2000);
console.log("Server started");

var svaPolja = [];
function generirajPlocu(){
	svaPolja = [];
	for (var i = 0; i < 49; i++){
		svaPolja.push(Math.round(Math.random() * 4));
	}
}
generirajPlocu();
var roomNum = 1;
var io = require('socket.io')(serv,{});

io.sockets.on('connection',function(socket){
	
	//broji da li je u sobi 2 igrača
    if (io.nsps['/'].adapter.rooms["room-" + roomNum] && io.nsps['/'].adapter.rooms["room-" + roomNum].length > 1){
        roomNum++;
		generirajPlocu();
	}
    socket.join("room-" + roomNum);
	socket.room = "room-" + roomNum;
    io.sockets.in("room-" + roomNum).emit('connectedToRoom', "room-" + roomNum);
	//Object.keys(io.nsps['/'].adapter.rooms["room-" + roomNum]['sockets'])[0]
	
	var brojIgraca = io.nsps['/'].adapter.rooms["room-" + roomNum].length;
	
	socket.emit('newGame',svaPolja,brojIgraca);
	
	if (brojIgraca == 2){
		io.sockets.in(socket.room).emit('gameCanStart');
	}
	
	socket.on('dohvatiPitanje',function(kategorija){
		switch(kategorija)
		{
			case 'pitanjepov': kategorija = 'Povijest'; break;
			case 'pitanjezem': kategorija = 'Zemljopis'; break;
			case 'pitanjeinf': kategorija = 'Informatika'; break;
			case 'pitanjeumj': kategorija = 'Umjetnost'; break;
			case 'pitanjemat': kategorija = 'Matematika'; break;
		}
		dohvatiRandomPitanje(kategorija);
	});
	
	function dohvatiRandomPitanje(kategorija)
	{
		var j = 0;
		var poljeKategorije = [];
		for (var i = 0; i < pitanje.length; i++)
		{
			if (pitanje[i].kategorija == kategorija)
			{
				poljeKategorije[j] = pitanje[i];
				j++;
			}
		}
		var randomBroj = Math.floor(poljeKategorije.length * Math.random());
		socket.tocan_odgovor = poljeKategorije[randomBroj].tocan_odgovor;
		var klijentPitanje = {
			pitanje : poljeKategorije[randomBroj].pitanje,
			odgovor1 : poljeKategorije[randomBroj].tocan_odgovor,
			odgovor2 : poljeKategorije[randomBroj].krivi_odgovor.krivi_odgovor1,
			odgovor3 : poljeKategorije[randomBroj].krivi_odgovor.krivi_odgovor2,
			odgovor4 : poljeKategorije[randomBroj].krivi_odgovor.krivi_odgovor3

		};
		socket.emit('vratiPitanje',klijentPitanje);
	}
	
	socket.on('disconnect',function(){
		io.sockets.in(socket.room).emit('otiso', 'Suigrač je napustio igru :(');
		roomNum++;
		generirajPlocu();
	});
	
	socket.on('provjeriOdgovor',function(odgovor){
		if (odgovor == socket.tocan_odgovor)
		{
			socket.emit('provjerenOdgovor',true);
		}
		else{
			socket.emit('provjerenOdgovor',false);
		}
	});

	socket.on('correctAnswer',function(data){
		io.sockets.in(socket.room).emit('skoci',data);
		if (data[0].myID == 1)
		{
			var sock = io.sockets.connected[Object.keys(io.nsps['/'].adapter.rooms[socket.room]['sockets'])[1]];
			sock.emit('enableMyFigures', 2);
		}
		if (data[0].myID == 2)
		{
			var sock = io.sockets.connected[Object.keys(io.nsps['/'].adapter.rooms[socket.room]['sockets'])[0]];
			sock.emit('enableMyFigures', 1);
		}		
	});
	//trebalo bi napraviti sa SOCKED.ID
	socket.on('wrongAnswer',function(id){
		if (id == 1)
		{
			var sock = io.sockets.connected[Object.keys(io.nsps['/'].adapter.rooms[socket.room]['sockets'])[1]];
			sock.emit('enableMyFigures', 2);
		}
		if (id == 2)
		{
			var sock = io.sockets.connected[Object.keys(io.nsps['/'].adapter.rooms[socket.room]['sockets'])[0]];
			sock.emit('enableMyFigures', 1);
		}			
	});
	socket.on('pobjeda',function(bojaIgraca){
		io.sockets.in(socket.room).emit('pobjedioJeIgrac',bojaIgraca);
	});
	
	
});
