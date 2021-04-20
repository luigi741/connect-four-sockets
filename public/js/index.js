$(() => {
	console.log('Document Ready');
	var socket = io();
	var roomToJoin;
	var gameMoves = {
		'column-0': 0,
		'column-1': 0,
		'column-2': 0,
		'column-3': 0,
		'column-4': 0,
		'column-5': 0
	}
	//=========================================================================
	// Socket event listeners
	socket.on('receiveAll', data => {
		console.log('Message received');
		alert(data);
	});

	// When an opponent makes a move
	socket.on('opponentMove', data => {
		let column = data.substring(1);
		gameMoves[`colum-${column}`]++;
		$(`#${data}`).css('background-color', 'red');
	});

	// ========================================================================
	// jQuery event listeners
	$('#startButton').on('click', () => {
		console.log('Starting game...');
		for (let i = 0; i < 6; i++) {
			let row = `
				<div class="row" id="${String.fromCharCode(70 - i)}"></div>
			`;
			
			$('#tableContainer').append(row.trim());

			for (let j = 0; j < 7; j++) {
				let cell = `
					<div style="width: 100px; height: 100px; padding: 0px">
						<div class="gameCell" style="width: 100%; height: 100%" id="${String.fromCharCode(70 - i)}${j}"></div>
					</div>
				`;

				$(`#${String.fromCharCode(70 - i)}`).append(cell.trim());
			}
		}
	});

	$('#createRoomButton').on('click', () => {
		socket.emit('createRoom', 'Luis\'s Room');
	});

	$('#viewAllRoomsButton').on('click', () => {
		console.log('Getting available rooms...');
		socket.emit('getRooms', 'any');
		socket.on('roomResponse', data => {
			console.log('Rooms:');
			console.log(data);
			roomToJoin = data[0].id
		});
	});

	$('#joinRoomButton').on('click', () => {
		console.log(`Joining room: ${roomToJoin}`);
		socket.emit('joinRoom', 'any');
	});

	$('#emitAllButton').on('click', () => {
		console.log(`Emitting to all in room: ${roomToJoin}`);
		socket.emit('emitToAllInRoom', roomToJoin);
	});

	$('#tableContainer').on('click', '.gameCell', (event) => {
		$(`#${event.target.id}`).css('background-color', 'blue');
		let column = event.target.id.substring(1);
		let currentColumnValue = gameMoves[`column-${column}`];

		$(`#${String.fromCharCode(65 + currentColumnValue)}${column}`).css(
			'background-color', 'blue'
		);

		gameMoves[`column-${column}`]++;
		socket.emit('chooseCell', {
			'roomId': roomToJoin,
			'cell': `${String.fromCharCode(65 + currentColumnValue)}${column}`
		});
	});

	// Get players in current room
	$('#listPlayers').on('click', () => {
		socket.emit('getPlayersInRoom', roomToJoin);
	});
});