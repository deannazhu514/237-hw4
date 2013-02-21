function createPlayer() {
	var playerID = $("playerID-input");
	for (var i=0; i<playerList.length; i++) {
		if (playerList[i] === playerID) {
			playerID.val("");
			return;
		}
	}
	playerList.push(playerID.val());
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
		success: function() {
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
		success: function() {
			refreshDOM();
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

// $(document).ready(function() {
// });