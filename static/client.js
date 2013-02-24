var playerName;
var currentGame;

var gameList;
var playerList;

var pageState;

function refreshDOM() {	
// overarching refreshDOM function
	if (pageState === undefined) 
		pageState = "title";
	else if (pageState === "title") {
		loadTitleScreen();
	}
	if (pageState === "menu") {
		refreshMenuScreen();
	}
	else if (pageState === "gameStart") {
		refreshGameStartScreen()
	}
	else if (pageState === "gameInPlay") {
		refreshGameScreen()
	}
	console.log(pageState);
}

function loadTitleScreen() {	
// show title screen
	var submitButton = $("#submitButton");
	submitButton.html("Submit");
	// submitButton.attr("href", "menu.html");
	submitButton.click(function() {
		// var newPage = (this.attr("href"));
		// window.open(newPage);
		createPlayer();
		pageState = "menu";
		refreshDOM();
	});
}

function refreshMenuScreen() {	
// refresh menu screen
	var container = $("#titleContent");
	container.html("");
	var title = $("#title");
	title.html("<h1>"+playerName+", welcome to Norbert Wars</h1>");
	title.css("font-size", "30px");
	var instructions = $("<div id = 'instructions'>");
	instructions.html("[instructions]"); // load from text file on server?
	var availButton = $("<a>").html("Available Games");
	availButton.addClass("roombut");
	availButton.mousedown(
				function(event) {
					console.log("avail");
				});
	var currButton = $("<a>").html("Current Games");
	currButton.addClass("roombut");
	currButton.mousedown(
				function(event) {
					console.log("current");
				});
	var rooms = $("<div>").addClass("rooms");
	var gamesAvailable = $("<ul>");
	var game = $("<li>").html("game1");
	gamesAvailable.append(game);
	var joinButton = $("<a>").html("Join Game");
	joinButton.addClass("menubut");
	joinButton.mousedown(
				function(event) {
					console.log("join");
				});
	var createButton = $("<a>").html("Create Game");
	createButton.addClass("menubut");
	createButton.mousedown(
				function(event) {
					console.log("create");
				});
	rooms.append(gamesAvailable);
	container.append(instructions, availButton, currButton,
					rooms, createButton, joinButton);
}

function refreshGameStartScreen() {	
// refreshDOM while on game start screen

}

function refreshGameScreen() {	
// refreshDOM while on game screen

}

/* TITLE SCREEN functions */

function createPlayer() {
	var playerID = $("#playerID-input");
	if (playerList === undefined) {
		playerList = [];
	}
	else {
		for (var player in playerList) {
			if (player === playerID.value) {
				playerID.val("");
				return;
			}
		}
	}
	playerList.push(playerID.val());
	playerName = playerID.val();
	playerID.val("");
	refreshDOM();
}

/* MENU SCREEN functions */

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

/* GAME START SCREEN functions */

function submitTeam() {
	// submit the created team's stats and other new game data
	$.ajax({
		type: "post"
	});
}

/* GAME functions */

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

/* don't need for now
function deleteAll() {
	$.ajax({
		type: "delete"
	});
}
*/

$(document).ready(function() {
	loadTitleScreen();
});