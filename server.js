//=============================================================================
// server.js - backend code for Connect Four game that uses Socket.io to play
// in real time
// Author: Luis Castro
// Date: 04/19/21
//=============================================================================

// Import npm packages
const express	= require('express');
const app		= express();
const http		= require('http');
const server	= http.createServer(app);
const io		= require('socket.io')(server);
const path		= require('path');
const PORT		= 80;

// Server HTML, CSS, JS and other files
app.use(express.static('public'));

// Global variables
var connectedUsers = [];

app.get('/', (req, res) => {
	console.log('GET /');
	res.sendFile(path.join(__dirname + '/views/index.html'));
});

app.get('/home', (req, res) => {
	console.log('GET /home');
	res.send('OK');
});

io.on('connection', client => {
	console.log('Client connected with ID: ' + client.id);

	// Sample socket event
	client.on('event', data => {
		console.log('Event emitted');
	});

	// When a client disconnects
	client.on('disconnect', () => {
		console.log('Client disconnected');
	});

	// Creating a new game room
	client.on('createRoom', data => {
		connectedUsers.push({
			'id': client.id,
			'roomName': 'room-1'
		});

		console.log(connectedUsers);
	});

	// Get list of available rooms
	client.on('getRooms', data => {
		client.emit('roomResponse', connectedUsers);
	});

	// Join a specific room
	client.on('joinRoom', data => {
		console.log('Joining room: ' + data);
		client.join('room-1');
	});

	// Emit data to all clients in a room
	client.on('emitToAllInRoom', data => {
		console.log('Emitting to all...');
		io.to('room-1').emit('receiveAll', 'TESTING');
	});

	// Emit move to opponent
	client.on('chooseCell', data => {
		console.log(data);
		client.to('room-1').emit('opponentMove', data.cell);
	});

	// Get players in a specific room
	client.on('getPlayersInRoom', data => {
		// Get list of all rooms
		var rooms = io.of('/').adapter.rooms;
		console.log(rooms);
	});
});

server.listen(PORT, () => {
	console.log('Server listening on port: ' + PORT);
});