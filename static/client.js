var playerName;
var currentGame;

function createPlayer() {
	var playerID = $("playerID-input");
	for (var i=0; i<playerList.length; i++) {
		if (playerList[i] === playerID) {
			playerID.val("");
			return;
		}
	}
	playerList.push(playerID.val());
	playerName = playerID.val();
	playerID.val("");
	refreshDOM();
}

function refreshDOM() {	
	console.log(playerList);
}

function getCurrentGames(playerID) {
	$.ajax({
		type: "get",
		url: "/displayCurrentGames/:" + playerID,
		success: function(data) {
			
			refreshDOM();
		}
	});
}

function getOpenGames() {
	$.ajax({
		type: "get",
		url: "/displayOpenGames",
		success: function(data) {
			console.log(data);
			refreshDOM();
		}
	});
}

function joinGame(playerID) {
	$.ajax({
		type: "post",
		url: "/joinGame",
		data: playerID,
		success: function(data) {
			currentGame = data.game;
			refreshDOM();
			var pNum;
			if (currentGame.player1 === "playerName") {
				pNum = 1;
			} else {
				pNum = 2;
			}
			init(currentGame, pNum);
			//CALL INIT HERE WITH PROPER STUFF
		}
	});
}

function addGame(playerID) {
	$.ajax({
		type: "post",
		url: "/createGame",
		data: playerID,
		success: function() {
			refreshDOM();
		}
	});
}

function deleteAll() {
	$.ajax({
		type: "delete"
	});
}

function endTurn() {
	//send: gameID, character lists, player points
	//see update game in app.js
	$.ajax({
		type: "post"
	});
}

function isMyTurn() {
	//function that is used that will constantly poll
	//the server to see if the turn changes
	//ask the server if its my turn
	
	//to be implemented
	$.ajax({
		type: "get"
	});
}

// $(document).ready(function() {
// });