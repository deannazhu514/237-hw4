var playerName; //id for the player
var currentGame; //which game the player is playing or making, is a game object
var gameList;
var gamenum = 0;
var openGameList = {};	//array of objects, containing joinable games			
var myGameList = {}; //array of objects, containing games player is currently in	
var pageState = []; //what screens to load on page 
var teamSize = 3; //default size of your team


function refreshDOM() {	
// overarching refreshDOM function
	if (pageState.length === 0) 
		pageState.push("title");
	if (pageState[0] === "title") {
		loadTitleScreen();
	}
	else if (pageState[0] === "menu") {
		getAllGames();
		refreshMenuScreen();
	}
	else if ((pageState[0] === "createGame") ||
					 (pageState[0] === "joinGame")) {
		refreshCreateTeamScreen();
	}	
	else if (pageState[0] === "confirmScreen") {
		refreshConfirmScreen();
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
			alert("Please input a username");
		}
	});
}


/* MENU SCREEN FUNCTIONS */
function refreshMenuScreen() {
// refreshDOM while on menu screen
// to do: add continue game functionality
	var container = $("#content");
	container.html("");
	
	var title = $("#title");
	title.html("<h1> Welcome to "+gametitle+"</h1>");
	//title.css("font-size", "30px");
	
	var instructions = $("<div class = 'instructions'>");
	instructions.html("[instructions]"); // load from text file on server?
	
	if (pageState.length === 1) 
		pageState.push("openGames");
	var availButton = $("<a>").html("Available Games");
	availButton.addClass("roombut");
	availButton.mousedown(
				function(event) {
					pageState[1] = "openGames";
					refreshDOM();
					// getOpenGames();
				});
	var currButton = $("<a>").html("Current Games");
	currButton.addClass("roombut");
	currButton.mousedown(
				function(event) {
					pageState[1] = "myGames";
					refreshDOM();
					// getCurrentGames();
				});

	var rooms = $("<div>").addClass("rooms");
	var gamesAvailable = $("<ul>");		
	if (pageState[1] === "openGames") {
		// getOpenGames();
		refreshOpenGames(gamesAvailable);
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
		// join or continue game only if game is selected
		// and it appears in the active tab
			if ((currentGame!==undefined) && (pageState[1]==="openGames")) {
				for (var gameID in openGameList) {
					if (currentGame.id==gameID) {
						pageState[0] = "joinGame";
						pageState[1] = "openGames";
						refreshDOM();
						return;
					}
				}
			}
			else if ((currentGame!==undefined)	&& (pageState[1]==="myGames")) {	
				for (var gameID in myGameList) {
					if (currentGame.id==gameID) {
						pageState[0] = "joinGame";
						pageState[1] = "myGames";
						refreshDOM();
						return;
					}
				}			
			}
			alert("Please select a game.");
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
	rooms.css("height", gamenum*20+10);
	container.append(instructions,
				availButton, currButton,
				rooms, createButton, joinButton);
}

function refreshOpenGames(gamesAvailable) {
// display all available games on menu screen
	gamenum = 0;
	for (var gameID in openGameList) {
		gamenum++;
		var game = openGameList[gameID];
		var listing = $("<li>")
			.attr("id", gameID)
			.html(gameID+": "+game.name+" creator: "+game.player1)
			.click(function() {
				selectGame($(this));
				refreshDOM();
			});
		if ((currentGame !== undefined) && (currentGame.id == gameID)) {
			listing.addClass("selected");
		}	
		gamesAvailable.append(listing);
	}
}
function refreshMyGames(gamesAvailable) {
// display player's games on menu screen
	for (var gameID in myGameList) {
		var game = myGameList[gameID];
		var listing = $("<li>")
			.attr("id", gameID)
			.html(gameID +": "+game.name)
			.click(function() {
				selectGame($(this));
				refreshDOM();
			});	
		if ((currentGame !== undefined) && (currentGame.id == gameID)) {
			listing.addClass("selected");
		}
		gamesAvailable.append(listing);
	}
}
function selectGame(listing) {
	currentGame = gameList[listing.attr("id")];
	listing.addClass("selected");
}

// function getOpenGames() {
	// $.ajax({
		// type: "get",
		// url: "/displayOpenGames/:" + playerName,
		// success: function(data) {
			// if (data.success === true) {
				// openGameList = data.games;
				// console.log("getopen");
				// refreshDOM();
			// }
		// }
	// });
// }
// function getCurrentGames() {
	// $.ajax({
		// type: "get",
		// url: "/displayCurrentGames/:" + playerName,
		// success: function(data) {
			// if (data.success === true) {
				// myGameList = data.games;
				// console.log("getcurrent");
				// refreshDOM();
			// }
		// }
	// });
// }


/* CREATE TEAM SCREEN FUNCTIONS */
function refreshCreateTeamScreen() {
// load the team create screen
	$("#title").html("Create your team");
	$(".instructions").html("instructions or class descriptions go here");
	var container = $("#content");
	container.html("");
	var charList = Array(teamSize);
	var teamList = $("<div>").attr("id", "teamList");
	
	if (pageState[0] === "createGame") {
		var gameName = $("<div>").append(
				$("<label>").html("Enter a game name: "),
				$("<input id=gameName>")
					.attr("name", "gameName")
					.attr("type", "text")
			);
		container.append(gameName);
	}
	
	for (var i=0; i<charList.length; i++) {
		var currCharacter = $("<div>")
			.attr("id", "char"+i)
			.addClass("charInput")
			.addClass(baseStats[0]); //set default character class
		var classOptions = $("<ul>").addClass("classOptions");
		for (var className in baseStats) {
			var currOption = $("<li>")
				.html(className)
				.click(function() {
					var selectedChar = $(this).parent(".charInput");
					selectedChar.addClass(className);
					refreshDOM();
				});
			classOptions.append(currOption);
		}
		var charImageSrc = getCharImgSrc(currCharacter);
		var charImage = $("<img>").attr("src", charImageSrc);
		var charDescription = $("<div>")
			.addClass("charDescription")
			.html("class description");
		currCharacter.append(charImage, classOptions, charDescription);
		teamList.append(currCharacter);
	}
	container.append(teamList);
	
	// goes to confirmation screen
	var continueButton = $("<a id=continueButton>")
		.html("continue")
		.addClass("menubut");
	continueButton.click(function() {
		// add verification stuff
		charList = inputCharData();
		if (pageState[0] === "createGame") {
		// creates new game object
			currentGame = new Object();
			currentGame.player1 = playerName;
			currentGame.name = $("#gameName").val();
			currentGame.p1charList = charList;
			currentGame.map = 1; // default map number 
		}
		else {
		// adds player to another player's game
			currentGame.player2 = playerName;
			currentGame.p2charList = charList;
		}
		pageState[0] = "confirmScreen";
		refreshDOM();
	});	
	// go back to menu screen
	var backButton = $("<a id=joinButton>").html("Go Back").addClass("menubut");
	backButton.click(function(){
		pageState[0] = "menu";
		pageState[1] = "openGames";
		refreshDOM();
	});
	container.append(continueButton, backButton);
}

function getCharImgSrc(currCharacter) {
// helper function to get appropriate image for character
	var src = "";
	if (currCharacter.hasClass("warrior"))
		src = warriorImageM.src;
	else if (currCharacter.hasClass("archer"))
		src = archerImageM.src;
	else if (currCharacter.hasClass("mage"))
		src = mageImageM.src;
	return src;
}
function inputCharData() {
// gets classes of characters and creates array of player's characters
	var teamList = $("#teamList");
	var charList = Array(teamList.length);
	for (var i=0; i< teamList.length; i++) {
		var currChar = $("#char"+i);
		var data = new Object();
		if (currChar.hasClass("warrior"))
			data.type = "warrior";
		else if (currChar.hasClass("archer"))
			data.type = "archer";
		else if (currChar.hasClass("mage"))
			data.type = "mage";
		else
			data.type = "warrior";
		data.x = i; // figure out what the default starting points are
		data.y = i; // and put them here in a variable later
		data.strength = getRandom(data.type, "strength");
		data.dexterity = getRandom(data.type, "dexterity");
		data.endurance = getRandom(data.type, "endurance");
		data.agility = getRandom(data.type, "agility");
		data.player = playerName;
		charList[i] = data;
	}
	return charList;
}
function getRandom(charClass, stat) {
// helper function to generate random character stats
	var min = classStats[charClass][stat][1];
	var max = classStats[charClass][stat][2];
	return Math.floor(min + Math.random()*(max-min));
}


function refreshConfirmScreen() {
// shows your team and game info before playing game
	refreshGameScreen();
}

/*function refreshCreateTeamScreen() {	
// refreshDOM while on game start screen
// create a team to join/create a game
// if creating a new game, can choose map type
	var container = $("#content");
	container.html("");
	
	var charList = new Array(teamSize);
	
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
			.attr("id", "char"+i)
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
	
	var startButton = $("<a id=createTeamButton>").addClass("menubut");
	if (pageState[0] === "createGame") {		
		startButton.html("Create Game");
		startButton.click(function(){
			pageState[0] = "menu";
			pageState[1] = "openGames";
			currentGame = new Object();
			var datalist = getCharData();
			currentGame.p1charList = datalist;
			currentGame.name = $("#gameName").val();
			currentGame.map = $("#mapNumber").val();
			createGame();
			// refreshDOM();
		});
	}
	else if (pageState[0] === "joinGame") {
		startButton.html("Join Game");
		startButton.click(function(){
			pageState[0] = "gameInPlay";
			pageState[1] = "";
			var datalist = getCharData();
			currentGame.p1charList = datalist;
			joinGame();
			// refreshDOM();
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
		data.endurance = $("#"+i+"charEndurance").val();
		data.agility = $("#"+i+"charAgility").val();
		data.player = playerName;
		datalist[i] = data;
	}
	return datalist;
}
*/
function createGame() {
	$.ajax({
		type: "post",
		url: "/createGame",
		data: { "name": currentGame.name,
				"playerName": playerName,
				"charList": currentGame.p1charList,
				"map": currentGame.map},		
		success: function(data) {
			if (data.success === true) {
				refreshDOM();
			}
		}
	});
}
function joinGame() {
	$.ajax({
		type: "post",
		url: "/joinGame",
		data: { "playerName": playerName, 
				"gameID": currentGame.id,
				"charList": currentGame.p2charList},
		success: function(data) {
			console.log("game start");
			//var stringgame = data.game;
			//console.log(stringgame);
			currentGame = data.game;
			refreshDOM();
			var playerNumber;
			if (currentGame.player1 === "playerName") {
				playerNumber = 1;
			} else {
				playerNumber = 2;
			}
			refreshGameScreen();
			init(playerNumber);
		}
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
	
	var character = $("<script src = 'character.js'>");
	var draw = $("<script src = 'draw.js'>");
	var eventHandlers = $("<script src = 'eventHandlers.js'>");
	var maps = $("<script src = 'maps.js'>");
	var mechanics = $("<script src = 'mechanics.js'>");
	var terrain = $("<script src = 'terrain.js'>");
	var main = $("<script src = 'main.js'>");
	container.append(character, draw,	eventHandlers, mechanics);
	container.append(main);//implement maps and terrain later
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

function getAllGames() {
	$.ajax({
		type: "get",
		url: "/displayAllGames",
		success: function(data) {
			if (data.success === true) {
				gameList = data.games;
				// refreshDOM();
			}
		}
	});
	if (playerName === undefined) return;
	for (var gameID in gameList) {
		var game = gameList[gameID];
		if ((game.status === "not joined") && (playerName !== game.player1)) {
			openGameList[gameID] = game;
		}
		else if ((game.player1 === playerName) || (game.player2 === playerName)) {
			myGameList[gameID] = game;
		}
	}
}


$(document).ready(function() {
	getAllGames();
	refreshDOM();
});