const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const express = require('express');
var user2 = [],num = 0,id_utente = [];
let user = "";

app.use(express.static(__dirname + ''));

app.get('/home', (req, res) => {
	user = req.query.name;
	if(user != "")
		res.sendFile(__dirname + '/big_data.html');
	else 
		res.redirect('/');
});
app.get('/', (req, res) => {
	res.sendFile(__dirname + '/user.html');
});
app.get('/chat', (req, res) => {
	if(user != "")
		res.sendFile(__dirname + '/chat.html');
	else
		res.redirect('/');
});


function getUsers2 (user,n) {
	user2.push(user);
	id_utente.push(n);
	num++;
}

//CONNESSION TO SERVER
io.on('connection', (socket) => {
	var t = 0,i;
	setImmediate(() => {
		var c = num;
		getUsers2 (user,socket.id);
		io.emit('join', {message: user2[c] + ' has join'},user2[c]);
		user = "";
	});
	socket.on('disconnect', () => {
		for(i = 0; i < user2.length; i++){
			if(id_utente[i] == socket.id){
					t = i;
			}
		}
		io.emit('exit', {message: user2[t] + ' has disconnected'});
	});
	socket.on('chat message', (msg,user) => {
		str2 = new String(msg);
		var str="";
		if (str2.length > 30){
			str = str2.substr(0,30);
		}else{
			str = str2;
		}
		for(i = 0; i < user2.length; i++){
			if(id_utente[i] == socket.id){
					t = i;
			}
		}
		io.emit('chat message', str, user,user2[t]);
	});
});

server.listen(3000,function(){
	console.log("Server is running");
});