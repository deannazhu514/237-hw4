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
	
	rooms.append(gamesAvailable);
	container.append(instructions, availButton, currButton, rooms, joinButton, createButton);
}

function refreshAllGames(gamesAvailable) {
// display all available games on menu screen
	for (var key in gameList) {
		var game = $("<li id="+key+">")
			.html(gameList[key].id)
			.append(": "+gameList[key].name)
			.mousedown(function(event){
				
				$("#"+this.id).addClass("selected");
			});		
		gamesAvailable.append(game);
	}
}

function refreshMyGames(gamesAvailable) {
// display player's games on menu screen
	for (var key in myGameList) {
		var game = $("<li id="+key+">")
			.html(myGameList[key].id)
			.append(": "+myGameList[key].name)
			.mousedown(function(event){
				$("#"+this.id).addClass("selected");
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
	draw();
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