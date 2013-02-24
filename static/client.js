var playerName; //id for the player
var currentGame; //which game the player is playing, is a game object
var currentGameName; //which game the player is playing
//is a property of currentGame, so this won't need to be used

var gameList = [{"id": 1, "name": "game1"}, 
				{"id": 2, "name": "game2"},
				{"id": 3, "name": "game3"}]; //hard-coded for testing

var openGameList;
var currentGameList;
								
var myGameList = [{"id": 1, "name": "myGame1"}, //for testing only
				{"id": 2, "name": "myGame2"}];
var playerList = []; //probably won't need
var pageState = []; //what screens to load on page 


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
		var playerID = $("#playerID-input");
		if (playerID.val() !== "") {
			createPlayer();
			pageState[0] = "menu";
			refreshDOM();
		}
		else {
			$("#content").append("<p>Please input name.</p>");
		}
	});
}

function createPlayer() {
// submit player's name to list of all players
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
	getOpenGames();
	for (var key in openGameList) {
		var game = $("<li>")
			.attr("id", openGameList[key].id)
			.html(openGameList[key].id+": "+openGameList[key].name)
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

function getCurrentGames() {
	$.ajax({
		type: "get",
		url: "/displayCurrentGames/:" + playerName,
		success: function(data) {
			refreshDOM();
		}
	});
}

function getOpenGames() {
	$.ajax({
		type: "get",
		url: "/displayOpenGames/:" + playerName,
		success: function(data) {
			openGameList = data;
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
			currentGame = JSON.parse(data.game);
			refreshDOM();
			var playerNumber;
			if (currentGame.player1 === "playerName") {
				playerNumber = 1;
			} else {
				playerNumber = 2;
			}
			refreshGameScreen();
			init(currentGame, playerNumber);
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

//yeah idt this is needed yo
	var container = $("#content");
	container.html("");
	
	var canvas = $("<canvas width='800' height='600'>");
	container.append(canvas);
}

function updateGame() {
	//send: gameID, character lists, player points
	//see update game in app.js

	
	//update points if we ever implement that victory condition
	$.ajax({
		type: "post",
		url: "/updateGame",
		data: {"gameObj" : JSON.stringify(currentGame)},
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
	var namegame = {
		name: playerName,
		game: currentGame.id
	}
	
	$.ajax({
		type: "get",
		url: "/isYourTurn/:"+ JSON.stringify(namegame),
		success: function(data) {
			if (data.answer === 'true') {
				currentGame = JSON.parse(data.game);
				//this should have a new status 
				//which will cause ismyturn to not be
				//called anymore in update
			}
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