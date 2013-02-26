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
			getOpenGames();
		}
		else {
			alert("Please input a username");
		}
	});
}


/* MENU SCREEN FUNCTIONS */
function refreshMenuScreen() {
// refreshDOM while on menu screen
	var container = $("#content");
	container.html("");
	
	var title = $("#title");
	title.html("<h1>"+playerName+", welcome to "+gametitle+"</h1>");
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
					getOpenGames();
				});
	var currButton = $("<a>").html("Current Games");
	currButton.addClass("roombut");
	currButton.mousedown(
				function(event) {
					pageState[1] = "myGames";
					getCurrentGames();
				});

	var rooms = $("<div>").addClass("rooms");
	var gamesAvailable = $("<ul>");		
	if (pageState[1] === "openGames") {
		// getOpenGames();
		refreshAllGames(gamesAvailable);
	}
	if (pageState[1] === "myGames") {
		// getCurrentGames();
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
				if ((currentGame !== undefined) && (currentGame.id !== game.id)) {
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

function getOpenGames() {
	$.ajax({
		type: "get",
		url: "/displayOpenGames/:" + playerName,
		success: function(data) {
			if (data.success === true) {
				openGameList = data.games;
				console.log("getopen");
				refreshDOM();
			}
		}
	});
}
function getCurrentGames() {
	$.ajax({
		type: "get",
		url: "/displayCurrentGames/:" + playerName,
		success: function(data) {
			if (data.success === true) {
				myGameList = data.games;
				console.log("getcurrent");
				refreshMenuScreen();
			}
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
	
	var charList = new Array(3);
	
	var instructions = $("<div>").addClass("instructions");
	instructions.html("Create Team [insert better description]");
	container.append(instructions);
	
	if (pageState[0] === "createGame") {
		var gameName = $("<li>").append(
				$("<label>").html("Enter a game name: "),
				$("<input id=gameName>")
					.attr("name", "gameName")
					.attr("type", "text")
			);
		var mapNumber = $("<li>").append(
				$("<label>").html("Choose your map: "),
				$("<input id=mapNumber>")
					.attr("name", "mapNumber")
					.attr("type", "number")
			);
			
		container.append(gameName, mapNumber);
	}
	
	var createTeam = $("<div>")
				.attr("id", "teampick");
	// show all characters on your team
	for (var i=0; i< charList.length; i++) {
		var currCharacter = $("<ul>")
			.attr("id", i)
			.addClass("charStats");
		
		// displays and sets stats of each character on team
		// for now, user types it in, might make buttons/scrollbar later
		var charType = $("<li>").append(
			$("<label>").html("Class: "),
			$("<input>").addClass("charInput")
				.attr("id", i+"charType")
				.attr("type", "text")
		);
		
		var charXPos = $("<li>").append(
			$("<label>").html("X Position: "),
			$("<input>").addClass("charInput")
				.attr("id", i+"charXPos")
				.attr("type", "number")
		);
		var charYPos = $("<li>").append(
			$("<label>").html("Y Position: "),
			$("<input>").addClass("charInput")
				.attr("id", i+"charYPos")
				.attr("type", "number")
		);

		var charStrength = $("<li>").append(
			$("<label>").html("Strength: "),
			$("<input>").addClass("charInput")
				.attr("id", i+"charStrength")
				.attr("type", "number")
		);
		var charDexterity = $("<li>").append(
			$("<label>").html("Dexterity: "),
			$("<input>").addClass("charInput")
				.attr("id", i+"charDexterity")
				.attr("type", "number")
		);
		var charEndurance = $("<li>").append(
			$("<label>").html("Endurance: "),
			$("<input>").addClass("charInput")
				.attr("id", i+"charEndurance")
				.attr("type", "number")
		);
		var charAgility = $("<li>").append(
			$("<label>").html("Agility: "),

			$("<input>").addClass("charInput")
				.attr("id", i+"charAgility")
				.attr("type", "number")
		);
		
		currCharacter.append(charType, charXPos, charYPos,
							charStrength, charDexterity, 
							charEndurance, charAgility);
		createTeam.append(currCharacter);
	}
	container.append(createTeam);
	
	var startButton = $("<a id=createButton>").addClass("menubut");
	if (pageState[0] === "createGame") {		
		startButton.html("Create Game");
		startButton.click(function(){
			pageState[0] = "gameInPlay";
			pageState[1] = "";

			var datalist = getCharData();
			var charList = init_characters(datalist);

			currentGame.p1charList = charList;

			createGame();
			refreshDOM();
		});
	}
	else if (pageState[0] === "joinGame") {
		startButton.html("Join Game");
		startButton.click(function(){
					pageState[0] = "gameInPlay";
			pageState[1] = "";

			var datalist = getCharData();
			var charList = init_characters(datalist);

			currentGame.p1charList = charList;
			joinGame();
			refreshDOM();
		});
	}
	
	var backButton = $("<a id=joinButton>").html("Go Back").addClass("menubut");
	backButton.click(function(){
		pageState[0] = "menu";
		pageState[1] = "openGames";
		refreshMenuScreen();
	});
	container.append(backButton, startButton);
}

function getCharData() {
	var charStats = $(".charStats");
	var datalist = Array(charStats.length);
	for (var i=0; i< charStats.length; i++) {
		var data ={};
		data.type = $("#"+i+"charType").val();
		data.x = $("#"+i+"charXPos").val();
		data.y = $("#"+i+"charYPos").val();
		data.strength = $("#"+i+"charStrength").val();
		data.dexterity = $("#"+i+"charDexterity").val();
		data.agility = $("#"+i+"charAgility").val();
		datalist[i] = data;
	}
	return datalist;
}

function createGame() {
	$.ajax({
		type: "post",
		url: "/createGame",
		data: { "name": currentGame.name,
				"playerName": playerName,
				"charList": currentGame.p1charList,
				"map": currentGame.map},		
		success: function(data) {
			if (data.success) {
				currentGame = data.game;
				refreshGameScreen();
				init(currentGame, 1);
			}
		}
	});
}
function joinGame() {
	$.ajax({
		type: "post",
		url: "/joinGame",
		data: { "playerName": playerName, 
				"gameID": currentGame.name,
				"charList": currentGame.p2charList},
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
	title.html("<h1>"+gametitle+"</h1>");
	var container = $("#content");
	container.html("");

	var canvas = $("<canvas width='1100' height='600' id='myCanvas'>");
	container.append(canvas);
	
	var main = $("<script src = 'main.js'>");
	var character = $("<script src = 'character.js'>");
	var constants = $("<script src = 'constants.js'>");
	var draw = $("<script src = 'draw.js'>");
	var eventHandlers = $("<script src = 'eventHandlers.js'>");
	var maps = $("<script src = 'maps.js'>");
	var mechanics = $("<script src = 'mechanics.js'>");
	var terrain = $("<script src = 'terrain.js'>");
	container.append(main, character, constants, draw,
				eventHandlers, mechanics); //implement maps and terrain later
	
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
	refreshDOM();
});