var playerName; //id for the player
var currentGame; //which game the player is playing, is a game object
var openGameList;	//array of objects, containing joinable games			
var myGameList; //array of objects, containing games player is currently in	
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
		refreshCreateTeamScreen();
	}	
	else if (pageState[0] === "joinGame") {
		refreshCreateTeamScreen();
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
			playerName = playerID.val();
			playerID.val("");
			pageState[0] = "menu";
			refreshDOM();
		}
		else {
			$("#content").append("<p>Please input name.</p>");
		}
	});
}


/* MENU SCREEN FUNCTIONS */
function refreshMenuScreen() {	
// refreshDOM while on menu screen
	var container = $("#content");
	container.html("");
	
	var title = $("#title");
	title.html("<h1>"+playerName+", welcome to Norbert Wars</h1>");
	title.css("font-size", "30px");
	
	var instructions = $("<div class = 'instructions'>");
	instructions.html("[instructions]"); // load from text file on server?
	
	if (pageState.length === 1) 
		pageState.push("openGames");
	var availButton = $("<a>").html("Available Games");
	availButton.addClass("roombut");
	availButton.mousedown(
				function(event) {
					pageState[1] = "openGames";
					refreshMenuScreen();
				});
	var currButton = $("<a>").html("Current Games");
	currButton.addClass("roombut");
	currButton.mousedown(
				function(event) {
					pageState[1] = "myGames";
					refreshMenuScreen();
				});

	var rooms = $("<div>").addClass("rooms");
	var gamesAvailable = $("<ul>");		
	if (pageState[1] === "openGames") {
		getOpenGames();
		refreshAllGames(gamesAvailable);
	}
	else if (pageState[1] === "myGames") {
		getCurrentGames();
		refreshMyGames(gamesAvailable);
	}
		
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
	for (var key in openGameList) {
		var game = openGameList[key];
		var listing = $("<li>")
			.attr("id", game.id)
			.html(game.id+": "+game.name+" creator: "+game.player1)
			.click(function() {
				if ((currentGame !== undefined) && (currentGame !== game)) {
					$("#"+currentGame.id).removeClass("selected");
				}
				currentGame = game;
				$(this).addClass("selected");	
			});
		gamesAvailable.append(listing);
	}
}

function refreshMyGames(gamesAvailable) {
// display player's games on menu screen
	for (var key in myGameList) {
		var game = $("<li>")
			.attr("id", myGameList[key].id)
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
			myGameList = data;
			// refreshDOM();
		}
	});
}

function getOpenGames() {
	$.ajax({
		type: "get",
		url: "/displayOpenGames/:" + playerName,
		success: function(data) {
			openGameList = data;
			// refreshDOM();
		}
	});
}


/* GAME START SCREEN FUNCTIONS */
function refreshCreateTeamScreen() {	
// refreshDOM while on game start screen
// create a team to join/create a game
// if creating a new game, can choose map type
	var container = $("#content");
	container.html("");
	var charList = new Array(5);
	
	var instructions = $("<div>").addClass("instructions");
	instructions.html("Create Team [insert better description]");
	container.append(instructions);
	
	if (pageState[0] === "createGame") {
		var nameLabel = $("<label>").html("Enter a game name: ");
		var gameName = $("<input id=gameName>")
					.attr("name", "gameName")
					.attr("type", "text");
		var mapLabel = $("<label>").html("Choose your map: ");
		var mapNumber = $("<input id=mapNumber>")
					.attr("name", "mapNumber")
					.attr("type", "number");
	container.append(nameLabel, gameName, mapLabel, mapNumber);
	}
	
	var createTeam = $("<div>").addClass("rooms");
	// show all characters on your team
	for (var i=0; i<charList.length; i++) {
		var currCharacter = $("<ul>").addClass("charStats");
		// displays and sets stats of each character on team
		// for now, user types it in, might make buttons/scrollbar later
		var charXPos = $("<li>").append(
			$("<label>").html("X Position: "),
			$("<input>").addClass("charInput")
				.attr("name", "charXPos")
				.attr("type", "number")
		);
		var charYPos = $("<li>").append(
			$("<label>").html("Y Position: "),
			$("<input>").addClass("charInput")
				.attr("name", "charYPos")
				.attr("type", "number")
		);
		var charType = $("<li>").append(
			$("<label>").html("Class: "),
			$("<input>").addClass("charInput")
				.attr("name", "charType")
				.attr("type", "text")
		);
		var charStrength = $("<li>").append(
			$("<label>").html("Strength: "),
			$("<input>").addClass("charInput")
				.attr("name", "charStrength")
				.attr("type", "number")
		);
		var charDexterity = $("<li>").append(
			$("<label>").html("Dexterity: "),
			$("<input>").addClass("charInput")
				.attr("name", "charDexterity")
				.attr("type", "number")
		);
		var charEndurance = $("<li>").append(
			$("<label>").html("Endurance: "),
			$("<input>").addClass("charInput")
				.attr("name", "charEndurance")
				.attr("type", "number")
		);
		var charAgility = $("<li>").append(
			$("<label>").html("Agility: "),
			$("<input>").addClass("charInput")
				.attr("name", "charAgility")
				.attr("type", "number")
		);
		currCharacter.append(charXPos, charYPos, charType)
			.append(charStrength, charDexterity, charEndurance, charAgility);
		// character.player = playerName;
		createTeam.append(currCharacter);
	}
	container.append(createTeam);
	
	var startButton = $("<a>").addClass("menubut");
	if (pageState[0] === "createGame") {		
		startButton.html("Create Game");
		startButton.click(function(){
			pageState[0] = "gameInPlay";
			pageState[1] = "";
			createGame(charList);
		});
	}
	else if (pageState[0] === "joinGame") {
		startButton.html("Join Game");
		startButton.click(function(){
			pageState[0] = "gameInPlay";
			pageState[1] = "";
			joinGame(charList);
		});
	}
	var backButton = $("<a>").html("Go Back").addClass("menubut");
	backButton.click(function(){
		pageState[0] = "menu";
		pageState[1] = "openGames";
		refreshMenuScreen();
	});
	container.append(startButton, backButton);
}

function createGame(charList) {
	$.ajax({
		type: "post",
		url: "/createGame",
		data: { "name": currentGame.name,
				"playerName": playerName,
				"charList": charList,
				"map": 1},		
		success: function() {
			refreshGameScreen();
			init(currentGame, 1);
		}
	});
}
function joinGame(charList) {
	$.ajax({
		type: "post",
		url: "/joinGame",
		data: { "playerName": playerName, 
				"gameID": currentGame.name,
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

function submitTeam() {
	// submit the created team's stats and other new game data
	// might just consolidate with join/createGame
	$.ajax({
		type: "post"
	});
}

/* GAME FUNCTIONS */
function refreshGameScreen() {	
// load canvas for the game
	var title = $("#title");
	title.html("Norbert Wars");
	var container = $("#content");
	container.html("");

	var main = $("<script src = 'main.js'>");
	var character = $("<script src = 'character.js'>");
	var constants = $("<script src = 'constants.js'>");
	var draw = $("<script src = 'draw.js'>");
	var eventHandlers = $("<script src = 'eventHandlers.js'>");
	var maps = $("<script src = 'maps.js'>");
	var mechanics = $("<script src = 'mechanics.js'>");
	var terrain = $("<script src = 'terrain.js'>");
	container.append(main, character, constants, draw)
		.append(eventHandlers, maps, mechanics, terrain);
	
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