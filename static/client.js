var playerName; //id for the player
var currentGame; //which game the player is playing

var gameList = [{"id": 1, "name": "game1"}, 
								{"id": 2, "name": "game2"},
								{"id": 3, "name": "game3"}]; //hard-coded for testing
								
var myGameList = [{"id": 1, "name": "myGame1"}, //for testing only
								{"id": 2, "name": "myGame2"}];
var playerList = []; //probably won't need
var pageState = []; //what screens to load on page, perhaps have a copy on server? 


function refreshDOM() {	
// overarching refreshDOM function
	if (pageState.length === 0) 
		pageState.push("title");
	if (pageState[0] === "title") {
		loadTitleScreen();
	}
	else if (pageState[0] === "menu") {
		refreshMenuScreen();
	}
	else if (pageState[0] === "gameStart") {
		refreshGameStartScreen();
	}
	else if (pageState[0] === "gameInPlay") {
		refreshGameScreen();
	}
}

/* TITLE SCREEN FUNCTIONS */
function loadTitleScreen() {	
// show title screen
	var submitButton = $("#submitButton");
	submitButton.html("Submit");
	submitButton.click(function() {
		createPlayer();
		pageState[0] = "menu";
		refreshDOM();
	});
}

function createPlayer() {
// submit player's name
	var playerID = $("#playerID-input");
	for (var i=0; i<playerList.length; i++) {
		if (playerList[i] === playerID) {
			playerID.val("");
			return;
		}
	}
	playerList.push(playerID.val());
	playerName = playerID.val();
	playerID.val("");
}

/* MENU SCREEN FUNCTIONS */
function refreshMenuScreen() {	
// refreshDOM while on menu screen
	var container = $("#content");
	container.html("");
	var instructions = $("<div>");
	instructions.html("[insert instructions]"); // load from text file on server, not with ajax?
	
	var rooms = $("<div>").addClass("row");
	var allGamesTab = $("<div>").html("All Games").addClass("tab");
	var myGamesTab = $("<div>").html("My Games").addClass("tab");
	
	var gamesAvailable = $("<ul>");
	if (pageState.length === 1) 
		pageState.push("allGames");
	if (pageState[1] === "allGames")
		refreshAllGames(gamesAvailable);
	else if (pageState[1] === "myGames")
		refreshMyGames(gamesAvailable);

	allGamesTab.click(function(){
		pageState[1] = "allGames";
		refreshDOM();
	});
	myGamesTab.click(function(){
		pageState[1] = "myGames";
		refreshDOM();
	});
		
	var joinButton = $("<a>").html("Join Game").addClass("menubut");
	var createButton = $("<a>").html("Create Game").addClass("menubut");
	joinButton.click(function(){
		pageState[0] = "gameStart";
		pageState[1] = "joinGame";
		refreshDOM();
	});
	createButton.click(function(){
		pageState[0] = "gameStart";
		pageState[1] = "createGame";
		refreshDOM();
	});
	rooms.append(allGamesTab, myGamesTab, gamesAvailable, joinButton, createButton);
	container.append(instructions, rooms);
}

function refreshAllGames(gamesAvailable) {
// display all available games on menu screen
	for (var key in gameList) {
		var game = $("<li>")
			.html(gameList[key].id)
			.append(": "+gameList[key].name);
		gamesAvailable.append(game);
	}
}

function refreshMyGames(gamesAvailable) {
// display player's games on menu screen
	for (var key in myGameList) {
		var game = $("<li>")
			.html(myGameList[key].id)
			.append(": "+myGameList[key].name);
		gamesAvailable.append(game);
	}
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

/* GAME START SCREEN FUNCTIONS */
function refreshGameStartScreen() {	
// refreshDOM while on game start screen
	var container = $("#content");
	container.html("");
}

function submitTeam() {
	// submit the created team's stats and other new game data
	$.ajax({
		type: "post"
	});
}

/* GAME FUNCTIONS */
function refreshGameScreen() {	
// refreshDOM while on game screen, might not need
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