var playerName; //id for the player
var currentGame; //which game the player is playing
var currentGameName; //which game the player is playing

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
	else if (pageState[0] === "createGame") {
		refreshCreateGameScreen();
	}	
	else if (pageState[0] === "joinGame") {
		refreshJoinGameScreen();
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
}

/* MENU SCREEN FUNCTIONS */
function refreshMenuScreen() {	
// refreshDOM while on menu screen
	var container = $("#content");
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
					pageState[1] = "allGames";
					refreshDOM();
				});
	var currButton = $("<a>").html("Current Games");
	currButton.addClass("roombut");
	currButton.mousedown(
				function(event) {
					pageState[1] = "myGames";
					refreshDOM();
				});

	var rooms = $("<div>").addClass("rooms");
	var gamesAvailable = $("<ul>");
	if (pageState.length === 1) 
		pageState.push("allGames");
		
	if (pageState[1] === "allGames")
		refreshAllGames(gamesAvailable);
	else if (pageState[1] === "myGames")
		refreshMyGames(gamesAvailable);
		
	var joinButton = $("<a>")
		.html("Join Game")
		.addClass("menubut")
		.attr("id", "joinButton")
		.click(function() {
			pageState[0] = "joinGame";
			pageState[1] = "";
			refreshDOM();
		});
	var createButton = $("<a>")
		.html("Create Game")
		.addClass("menubut")
		.attr("id", "createButton")
		.click(function() {
			pageState[0] = "createGame";
			pageState[1] = "";
			refreshDOM();
		});
		
	rooms.append(gamesAvailable);
	container.append(instructions,
				availButton, currButton,
				rooms, createButton, joinButton);
}

function refreshAllGames(gamesAvailable) {
// display all available games on menu screen
	for (var key in gameList) {
		var game = $("<li>")
			.attr("id", gameList[key].id)
			.html(gameList[key].id+": "+gameList[key].name)
			.click(function() {
				if (currentGameName !== undefined) {
					$("#"+currentGameName).removeClass("selected");
				}
				currentGameName = $(this).attr("id");
				$(this).addClass("selected");	
			});
		gamesAvailable.append(game);
	}
}

function refreshMyGames(gamesAvailable) {
// display player's games on menu screen
	for (var key in myGameList) {
		var game = $("<li>")
			.attr("id", gameList[key].id)
			.html(myGameList[key].id +": "+myGameList[key].name)
			.click(function() {
				if (currentGameName !== undefined) {
					$("#"+currentGameName).removeClass("selected");
				}
				currentGameName = $(this).attr("id");
				$(this).addClass("selected");		
			});
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

function joinGame(charList) {
	$.ajax({
		type: "post",
		url: "/joinGame",
		data: { "playerName": playerName, 
				"gameID": currentGameName,
				"charList": charList},
		success: function(data) {
			console.log("game start");
			currentGame = data.game;
			refreshDOM();
			var playerNumber;
			if (currentGame.player1 === "playerName") {
				playerNumber = 1;
			} else {
				playerNumber = 2;
			}
			refreshGameScreen();
			//CALL INIT HERE WITH PROPER STUFF
		}
	});
}

function createGame(charList) {
	$.ajax({
		type: "post",
		url: "/createGame",
		data: { "name": currentGameName,
				"playerName": playerName,
				"charList": charList,
				"map": 1},		
		success: function() {
			refreshGameScreen();
		}
	});
}

/* GAME START SCREEN FUNCTIONS */
function refreshCreateGameScreen() {	
// refreshDOM while on game start screen
	var container = $("#content");
	container.html("");
	
	var charList = [];
	
	var label = $("<label>").html("Enter a game name:");
	var gameName = $("<input id=gameName>")
				.attr("name", "gameName")
				.attr("type", "text");
				
	 var warriorM = $("<div id = warriorM>").addClass("images");

	
	var startButton = $("<a>").html("Create Game").addClass("menubut");
	startButton.click(function(){
		pageState[0] = "gameInPlay";
		pageState[1] = "";
		createGame(charList);
	});
	
	var backButton = $("<a>").html("Go Back").addClass("menubut");
	backButton.click(function(){
		pageState[0] = "menu";
		pageState[1] = "allGames";
		refreshMenuScreen();
	});
	container.append(label, gameName, warriorM, 
		startButton, backButton);
}

function refreshJoinGameScreen() {	
// refreshDOM while on game start screen
	var container = $("#content");
	container.html("");

	var startButton = $("<a>").html("Join Game").addClass("menubut");
	startButton.click(function(){
		pageState[0] = "gameInPlay";
		pageState[1] = "";
		joinGame(charList);
	});
	var backButton = $("<a>").html("Go Back").addClass("menubut");
	backButton.click(function(){
		pageState[0] = "menu";
		pageState[1] = "allGames";
		refreshMenuScreen();
	});
	container.append(startButton, backButton);
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
	var container = $("#content");
	container.html("");
	
	var canvas = $("<canvas width='800' height='600'>");
	container.append(canvas);
}

function endTurn() {
	//send: gameID, character lists, player points
	//see update game in app.js
	$.ajax({
		type: "post",
		url: "/updateGame",
		data: {"gameID" : currentGameName},
		success: function() {
			refreshGameScreen();
		}
	});
}

function isMyTurn() {
	//function that is used that will constantly poll
	//the server to see if the turn changes
	//ask the server if its my turn
	
	//to be implemented
	$.ajax({
		type: "get",
		url: "/updateGame",
		success: function(data) {
			var game = data.game;
			currentGame.status = game.status;
			refreshGameScreen();
		}
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