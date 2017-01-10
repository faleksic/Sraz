
var socket = io();
var myID = 0;
	
var game = new Phaser.Game(560, 560, Phaser.AUTO, '', {preload:preload, create:create, update:update});
style = { font: "18px Arial", fill: "#ffffff", wordWrap: true, wordWrapWidth: 320, align: "left", backgroundColor: "#ffff00" };

function preload() {
	game.load.image('umj', 'Client/img/umjetnost.png');
	game.load.image('mat', 'Client/img/matematika.png');
	game.load.image('zem', 'Client/img/zemljopis.png');
	game.load.image('inf', 'Client/img/informatika.png');			
	game.load.image('pov', 'Client/img/povijest.png');			

	game.load.image('obrub', 'Client/img/obrub.png');
	game.load.image('obrubLik', 'Client/img/obrubLik.png');
	game.load.image('pjesakPojedi', 'Client/img/pjesakPojedi.png');
		
	game.load.image('pjesak1', 'Client/img/pjesak1.png');
	game.load.image('pjesak2', 'Client/img/pjesak2.png');
	game.load.image('botun','Client/img/botun.png');
	
	game.load.image('pitanjeinf','Client/img/pitanjeInformatika.png')
	game.load.image('pitanjemat','Client/img/pitanjeMatematika.png')
	game.load.image('pitanjepov','Client/img/pitanjePovijest.png')
	game.load.image('pitanjeumj','Client/img/pitanjeUmjetnost.png')
	game.load.image('pitanjezem','Client/img/pitanjeZemljopis.png')

	game.stage.backgroundColor = "#FFF";
}
var btnOdgovor1, btnOdgovor2, btnOdgovor3, btnOdgovor4;
var random;
var mapa = [];
var brojac = -1;
var obrubi = [];
var pojedi = [];
var brojPlocica = 0;

//ova funkcija ce svakom SPRITEU dodjeliti kategoriju
function createColors(){
	var kategorije = ['umj', 'mat', 'pov', 'inf', 'zem'];
	for (var i in mapa)	{
		var polje = mapa[i].kvadrat;
		mapa[i].kategorija = kategorije[sveSlicice[brojPlocica]];
		polje.loadTexture(kategorije[sveSlicice[brojPlocica]]);
		brojPlocica++;
	}
}
//ova funkcija ce stvoriti sva polja i likove, ali poljima nece biti dodjeljena
//kategorija. svaki SPRITE ce biti spremljen u polje MAPA[]
function create() {

	for(var i=0; i<7; i++){
		for(var j=0; j<7; j++){
			var kvadrat = game.add.sprite(i*80, j*80);
			kvadrat.scale.setTo(0.5,0.5);
			var obrub = game.add.sprite(i*80,j*80,"obrub");
			obrub.scale.setTo(0.5,0.5);
			obrub.visible = false;
			
			var pjesakPojedi = game.add.sprite(i*80,j*80,"pjesakPojedi");
			pjesakPojedi.scale.setTo(0.5,0.5);
			pjesakPojedi.visible = false;	
			
			pjesakPojedi.inputEnabled = true;
            pjesakPojedi.events.onInputDown.add(klik);
			pjesakPojedi.input.useHandCursor = true;
			
			obrubi.push({
				obrub: obrub
			});
			pojedi.push({
				pjesakPojedi: pjesakPojedi
			});
			brojac++;
			
			// kvadrat.inputEnabled = true;
            // kvadrat.events.onInputDown.add(klik);
			// kvadrat.input.useHandCursor = true;
			
			var x = Math.floor(i)*80;
			var y = Math.floor(j)*80;
			
			mapa.push({
				kvadrat: kvadrat,
				x: x,
				y: y,
				pozicija: i + "," + j,
				koor_x: i,
				koor_y: j,
				plavi: false,
				crveni: false,
				zauzeto: false,
				kategorija: 0,
				idFigurice: 0
				
			});
		}
	}
		
	mapa[0].zauzeto = true;
	mapa[0].plavi = true;
	mapa[0].idFigurice = 1;
	mapa[1].zauzeto = true;
	mapa[1].plavi = true;
	mapa[1].idFigurice = 2;
	mapa[7].zauzeto = true;
	mapa[7].plavi = true;
	mapa[7].idFigurice = 3;
	mapa[41].zauzeto = true;
	mapa[41].crveni = true;
	mapa[41].idFigurice = 5;
	mapa[47].zauzeto = true;
	mapa[47].crveni = true;
	mapa[47].idFigurice = 6;
	mapa[48].zauzeto = true;
	mapa[48].crveni = true;
	mapa[48].idFigurice = 4;
	
	obrubLik = game.add.sprite(0,0,"obrubLik");
	obrubLik.scale.setTo(0.5,0.5);
	obrubLik.visible = false;
	
	plavi1 = game.add.sprite(0, 0, 'pjesak1');
	plavi2 = game.add.sprite(80, 0, 'pjesak1');
	plavi3 = game.add.sprite(0, 80, 'pjesak1');
	plavi1.id = 1;
	plavi2.id = 2;
	plavi3.id = 3;
	
	plavi1.scale.setTo(0.5,0.5);
	plavi2.scale.setTo(0.5,0.5);
	plavi3.scale.setTo(0.5,0.5);
	
	plavi1.inputEnabled = true;
	plavi2.inputEnabled = true;
	plavi3.inputEnabled = true;
	
	plavi1.events.onInputDown.add(odaberiLika, this);
	plavi2.events.onInputDown.add(odaberiLika, this);
	plavi3.events.onInputDown.add(odaberiLika, this);
	
	crveni1 = game.add.sprite(6*80, 6*80, 'pjesak2');
	crveni2 = game.add.sprite(5*80, 6*80, 'pjesak2');
	crveni3 = game.add.sprite(6*80, 5*80, 'pjesak2');
	crveni1.id = 4;
	crveni2.id = 5;
	crveni3.id = 6;

	crveni1.scale.setTo(0.5,0.5);
	crveni2.scale.setTo(0.5,0.5);
	crveni3.scale.setTo(0.5,0.5);
	
	crveni1.inputEnabled = true;
	crveni2.inputEnabled = true;
	crveni3.inputEnabled = true;
	
	crveni1.events.onInputDown.add(odaberiLika, this);
	crveni2.events.onInputDown.add(odaberiLika, this);
	crveni3.events.onInputDown.add(odaberiLika, this);
	
	for (var i=0; i < 49; i++){
		game.world.bringToTop(pojedi[i].pjesakPojedi);
	}
	
	game.input.onDown.add(nesto, this);
	
	text = game.add.text(180,260, 'Čekam protivnika...', { fill: '#fff' });
	
	/////////////////////////////////
	ispisPobjedeTxt = game.add.text(0,0, '', { fill: '#fff' });

	
	
	
	var bar = game.add.graphics();
    bar.beginFill(0x000000, 0.2);
    bar.drawRect(0, 225, 800, 100);
	bar.visible = false;
	
	
	
	
	
	
	
	/////////////
	//stvori timer
	timer = game.time.create(false);
	timer.loop(Phaser.Timer.SECOND, pokreniTimer, this);
	createColors();
	enableAll(false);

	btnOdgovor1 = game.add.button(120,295,'botun', klikNaPitanje, this, 1,1, 1);
	btnOdgovor2 = game.add.button(120,364,'botun', klikNaPitanje, this, 2,2, 1);
	btnOdgovor3 = game.add.button(120,433,'botun', klikNaPitanje, this, 2,2, 1);
	btnOdgovor4 = game.add.button(120,502,'botun', klikNaPitanje, this, 2,2, 1);

	btnOdgovor1.id = 1;
	btnOdgovor2.id = 2;
	btnOdgovor3.id = 3;
	btnOdgovor4.id = 4;
	
	tekstPitanja1 = game.add.text(120, 295, "Some text", style);
	tekstPitanja2 = game.add.text(120, 364, "Some text", style);
	tekstPitanja3 = game.add.text(120, 433, "Some text", style);
	tekstPitanja4 = game.add.text(120, 502, "Some text", style);	
	visibleButtons(false);


	

	//ovo ce se dogoditi drugom igracu, jer prvi igrac ima ID 1
	//to sam stavio tu jer se igracu prvo treba ucitati sve kako bi dobio kontrolu nad figuricama
	if (myID == 2){
		text.visible = false;
	}
}
	
vrijeme = 11;
function pokreniTimer() {
	timerText.text = 'Preostalo vrijeme: ' + --vrijeme;
	if (vrijeme == 0){
		timer.stop(false);
		vrijeme = 11;
		zatvoriPitanje();
		socket.emit('provjeriOdgovor','');
	}
}

function zatvoriPitanje(){
	pitanje.destroy();
	tekstPitanja.destroy();
	
	visibleButtons(false);
	timerText.destroy();
	timer.stop(false);
}
function visibleButtons(bool){
	tekstPitanja1.visible = bool;
	tekstPitanja2.visible = bool;
	tekstPitanja3.visible = bool;
	tekstPitanja4.visible = bool;
	btnOdgovor1.visible = bool;
	btnOdgovor1.visible = bool;
	btnOdgovor2.visible = bool;
	btnOdgovor3.visible = bool;
	btnOdgovor4.visible = bool;	
}

socket.on('vratiPitanje',function(pitanje){

    tekstPitanja = game.add.text(100, 110, "Ovo je pitanje", { font: "24px Arial", fill: "#ffffff", wordWrap: true, wordWrapWidth: 350, align: "left", backgroundColor: "#000000" });
	tekstPitanja.text = pitanje.pitanje;
	
	var randomPolje = stvoriRandomUniquePolje();
	
	tekstPitanja1.text = vratiPitanjePoIndexu(randomPolje[0],pitanje);
	tekstPitanja2.text = vratiPitanjePoIndexu(randomPolje[1],pitanje);
	tekstPitanja3.text = vratiPitanjePoIndexu(randomPolje[2],pitanje);
	tekstPitanja4.text = vratiPitanjePoIndexu(randomPolje[3],pitanje);
	
	
});
function vratiPitanjePoIndexu(indeks,pitanje)
{
	switch(indeks)
	{
		case 0: return pitanje.odgovor1;
		case 1: return pitanje.odgovor2;
		case 2: return pitanje.odgovor3;
		case 3: return pitanje.odgovor4;
	}
}

function otvoriPitanje(kategorijaPitanja){
	socket.emit('dohvatiPitanje',kategorijaPitanja);

	vrijeme = 11;
	pitanje = game.add.sprite(0, 0, kategorijaPitanja);
	game.world.bringToTop(btnOdgovor1);
	game.world.bringToTop(btnOdgovor2);
	game.world.bringToTop(btnOdgovor3);
	game.world.bringToTop(btnOdgovor4);
	game.world.bringToTop(tekstPitanja1);
	game.world.bringToTop(tekstPitanja2);
	game.world.bringToTop(tekstPitanja3);
	game.world.bringToTop(tekstPitanja4);

	visibleButtons(true);
	timerText = game.add.text (20,20,'Preostalo vrijeme: ',{ font: "14px Arial", fill: '#fff' });
	timer.start();	

	//zabrani klikanje na plocice ili lika
	enableAll(false);
	obrubLik.visible = false;
	odabran = false;
	makniObrube();
}
function klikNaPitanje (odgovor) {
	
	//ako si kiliknuo na btn1 vrati tekst sa btn1
	var odgovorTekst = "";
	switch(odgovor.id)
	{
		case 1: odgovorTekst = tekstPitanja1.text; break;
		case 2: odgovorTekst = tekstPitanja2.text; break;
		case 3: odgovorTekst = tekstPitanja3.text; break;
		case 4: odgovorTekst = tekstPitanja4.text; break;
	}
	
	socket.emit('provjeriOdgovor',odgovorTekst);	

}

socket.on('provjerenOdgovor',function(odgovorTocan){
	if (odgovorTocan == true)
	{
		var podaci = [];
		podaci.push({
			trenutni : trenutni.id,
			xNaKojiJeSkocio : xNaKojiJeSkocio,
			yNaKojiJeSkocio : yNaKojiJeSkocio,
			x : x,
			y : y,
			trenutniX : trenutniX,
			trenutniY : trenutniY,
			myID : myID,
		});
		zatvoriPitanje();
		socket.emit('correctAnswer',podaci);
	}
	else{
			zatvoriPitanje();
			obrubLik.visible = false;
			odabran = false;
			makniObrube();
			socket.emit('wrongAnswer',myID);
		}

});
socket.on('connectedToRoom', function(data){
	console.log(data);
});
socket.on('disbleAllFigures',function(){

	enableAll(false);
	
});
socket.on('enableMyFigures',function(data){

	if (data == 1)
	{
		enabledPlavi(true);
	}
	if (data == 2)
	{
		enabledCrveni(true);
	}
	
});


odabran = false;

function odaberiLika(lik){

	odabran = true;
	trenutni = lik;
	
	x = Math.floor(game.input.mousePointer.x/80)*80;
	y = Math.floor(game.input.mousePointer.y/80)*80;
	obrubLik.reset(x,y);
			
	trenutniX = x;
	trenutniY = y;
	brojac = pronadiPlocicu(x,y);
	
	klik();
}



function nesto(){
	makniPojedi();
	x = Math.floor(game.input.mousePointer.x/80)*80;
	y = Math.floor(game.input.mousePointer.y/80)*80;
	if (odabran == true && trenutni.key == "pjesak1" && mapa[pronadiPlocicu(x,y)].plavi == true){
		return;
	}
	if (odabran == true && trenutni.key == "pjesak2" && mapa[pronadiPlocicu(x,y)].crveni == true){
		return;
	}

	if (odabran == true){

		if ((Math.abs(x-trenutniX) + Math.abs(y-trenutniY)) <= 80 && (Math.abs(x-trenutniX) + Math.abs(y-trenutniY))>0)
		{
			otvoriPitanje('pitanje' + mapa[pronadiPlocicu(x,y)].kategorija);
			xNaKojiJeSkocio = x;
			yNaKojiJeSkocio = y;

		}
	}
	
}

socket.on('skoci',function(data){
	if (mapa[pronadiPlocicu(data[0].xNaKojiJeSkocio,data[0].yNaKojiJeSkocio)].plavi == true)
	{
		switch(mapa[pronadiPlocicu(data[0].xNaKojiJeSkocio,data[0].yNaKojiJeSkocio)].idFigurice)
		{
			case 1: plavi1.visible = false;break;
			case 2: plavi2.visible = false;break;
			case 3: plavi3.visible = false;break;
		}
		mapa[pronadiPlocicu(data[0].xNaKojiJeSkocio,data[0].yNaKojiJeSkocio)].plavi = false;
	}
	if (mapa[pronadiPlocicu(data[0].xNaKojiJeSkocio,data[0].yNaKojiJeSkocio)].crveni == true)
	{
		switch(mapa[pronadiPlocicu(data[0].xNaKojiJeSkocio,data[0].yNaKojiJeSkocio)].idFigurice)
		{
			case 4: crveni1.visible = false;break;
			case 5: crveni2.visible = false;break;
			case 6: crveni3.visible = false;break;
		}
		mapa[pronadiPlocicu(data[0].xNaKojiJeSkocio,data[0].yNaKojiJeSkocio)].crveni = false;

	}
	
	skociNaPolje(data);
});


function skociNaPolje(data){
	if (data[0].trenutni == 1) trenutni = plavi1;
	if (data[0].trenutni == 2) trenutni = plavi2;
	if (data[0].trenutni == 3) trenutni = plavi3;
	if (data[0].trenutni == 4) trenutni = crveni1;
	if (data[0].trenutni == 5) trenutni = crveni2;
	if (data[0].trenutni == 6) trenutni = crveni3;

	trenutni.reset(data[0].xNaKojiJeSkocio,data[0].yNaKojiJeSkocio);
	obrubLik.visible = false;
	odabran = false;
	mapa[pronadiPlocicu(data[0].xNaKojiJeSkocio,data[0].yNaKojiJeSkocio)].zauzeto = true;
	
	if (trenutni.key == "pjesak1") mapa[pronadiPlocicu(data[0].xNaKojiJeSkocio,data[0].yNaKojiJeSkocio)].plavi = true;
	else if (trenutni.key == "pjesak2") mapa[pronadiPlocicu(data[0].xNaKojiJeSkocio,data[0].yNaKojiJeSkocio)].crveni = true;
	
	mapa[pronadiPlocicu(data[0].trenutniX,data[0].trenutniY)].zauzeto = false;
	mapa[pronadiPlocicu(data[0].trenutniX,data[0].trenutniY)].plavi = false;
	mapa[pronadiPlocicu(data[0].trenutniX,data[0].trenutniY)].crveni = false;
	mapa[pronadiPlocicu(data[0].trenutniX,data[0].trenutniY)].idFigurice = 0;
	mapa[pronadiPlocicu(data[0].xNaKojiJeSkocio,data[0].yNaKojiJeSkocio)].idFigurice = trenutni.id;
	
	makniObrube();
	
	//provjera pobjede
	if (plavi1.visible == false && plavi2.visible == false && plavi3.visible == false)
	{
		var boja = 'plavi';
		socket.emit('pobjeda', boja);
	}
	if (crveni1.visible == false && crveni2.visible == false && crveni3.visible == false)
	{
		var boja = 'crveni';
		socket.emit('pobjeda', boja);
	}
}

function update() {

}

function klik() {
	makniObrube();
	if (mapa[brojac].zauzeto === true) {		
		//Provjera da li postoji polje iznad
		if (mapa[brojac].koor_y - 1 >= 0){		
			if (mapa[brojac - 1].zauzeto === false){
				crtajObrub(brojac - 1);
			}
			else if (mapa[brojac - 1].zauzeto === true && mapa[brojac-1].plavi === true && trenutni.key == "pjesak2"){
				crtajPojedi(brojac - 1);
			}
			else if (mapa[brojac - 1].zauzeto === true && mapa[brojac-1].crveni === true && trenutni.key == "pjesak1"){
				crtajPojedi(brojac - 1);
			}
		}
		
		
		//Provjera da li postoji polje ispod
		if (mapa[brojac].koor_y + 1 < 7){		
			if (mapa[brojac + 1].zauzeto === false){
				crtajObrub(brojac + 1);
			}
			else if (mapa[brojac + 1].zauzeto === true && mapa[brojac+1].plavi === true && trenutni.key == "pjesak2"){
				crtajPojedi(brojac + 1);
			}
			else if (mapa[brojac + 1].zauzeto === true && mapa[brojac+1].crveni === true && trenutni.key == "pjesak1"){
				crtajPojedi(brojac + 1);
			}
		}
		
		//Provjera da li postoji polje desno
		if (mapa[brojac].koor_x + 1 < 7){		
			if (mapa[brojac + 7].zauzeto === false){
				crtajObrub(brojac + 7);
			}
			else if (mapa[brojac + 7].zauzeto === true && mapa[brojac+7].plavi === true && trenutni.key == "pjesak2"){
				crtajPojedi(brojac + 7);
			}
			else if (mapa[brojac + 7].zauzeto === true && mapa[brojac+7].crveni === true && trenutni.key == "pjesak1"){
				crtajPojedi(brojac + 7);
			}
		}
		
		//Provjera da li postoji polje lijevo
		if (mapa[brojac].koor_x - 1 >= 0){
			if (mapa[brojac - 7].zauzeto === false){
				crtajObrub(brojac - 7);
			}
			else if (mapa[brojac - 7].zauzeto === true && mapa[brojac-7].plavi === true && trenutni.key == "pjesak2"){
				crtajPojedi(brojac - 7);
			}
			else if (mapa[brojac - 7].zauzeto === true && mapa[brojac-7].crveni === true && trenutni.key == "pjesak1"){
				crtajPojedi(brojac - 7);
			}
		}

	}
}

function crtajObrub(brojac){		
		obrubi[brojac].obrub.visible = true;
}

function crtajPojedi(brojac){		
		pojedi[brojac].pjesakPojedi.visible = true;
}

function pronadiPlocicu(x, y){
	for(var i=0; i<mapa.length; i++){
		if(mapa[i].x == x && mapa[i].y == y){
			return i;
		}
	}
}

function makniObrube(){
	for (var i=0; i<= 48; i++){
		obrubi[i].obrub.visible = false;
	}
}

function makniPojedi(){
	for (var i=0; i<= 48; i++){
		pojedi[i].pjesakPojedi.visible = false;
	}
}
var sveSlicice = [];
socket.on('newGame',function(data, id){
	sveSlicice = data;
	myID = id; //ime koje mu je server dodjelio
});
	
	
//kad se izvrsi ova funkcija, znaci da su 2 igraca usla u igru
//svaki igrad ima svoj ID prethodno dobijen u funkciji iznad (newGame)
//omoguciti ce mu se kretanje samo njegovih figurica
socket.on('gameCanStart',function(){
	if (myID == 1){
		enabledPlavi(true);
	    text.visible = false;
	}
});
//ovo je kraj igre
socket.on('pobjedioJeIgrac',function(bojaIgraca){
	if (bojaIgraca == 'plavi'){
		ispisPobjedeTxt.text = "Pobjeda za crvenog igraca!";
	}
	if (bojaIgraca == 'crveni'){
		ispisPobjedeTxt.text = "Pobjeda za plavog igraca!";
	}
	ispisPobjedeTxt.x = game.width/2-ispisPobjedeTxt.width/2;
	ispisPobjedeTxt.y = game.height/2-10;
	enableAll(false);
});

socket.on('otiso', function(data){
	ispisPobjedeTxt.text = data;
	ispisPobjedeTxt.x = game.width/2-ispisPobjedeTxt.width/2;
	ispisPobjedeTxt.y = game.height/2-10;
	enableAll(false);
});

function enabledPlavi(enabled){
    
	plavi1.inputEnabled = enabled;
	plavi2.inputEnabled = enabled;
	plavi3.inputEnabled = enabled;
	for (var i in mapa){
		mapa[i].kvadrat.inputEnabled  = enabled;
	}
}
function enabledCrveni(enabled){
    
	crveni1.inputEnabled = enabled;
	crveni2.inputEnabled = enabled;
	crveni3.inputEnabled = enabled;
	for (var i in mapa){
		mapa[i].kvadrat.inputEnabled  = enabled;
	}
}
function enableAll(enabled){
    
	enabledPlavi(enabled);
	enabledCrveni(enabled);
}

function stvoriRandomUniquePolje()
{
	var polje = [];

	for (var i = 0; i < 4; )
	{
		var randomBroj = Math.floor(4 * Math.random());	
		if (polje.indexOf(randomBroj) == -1)
		{
			polje.push(randomBroj); 
			i++;
		}
	}
	return polje;
}