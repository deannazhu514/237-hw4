function refreshDOM() {
}

function displayCurrentGames(playerID) {
	$.ajax({
		type: "get",
		url: "/displayCurrentGames/:" + playerID,
		success: function() {
			refreshDOM();
		}
	});
}

function displayOpenGames() {
	$.ajax({
		type: "get",
		url: "/displayOpenGames",
		success: function() {
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

function createGame(playerID) {
	$.ajax({
		type: "post",
		url: "/createGame",
		data: playerID,
		success: function() {
			refreshDOM();
		}
	});
}

function put() {
}

function delAll() {
	$.ajax({
		type: "delete"
	});
}