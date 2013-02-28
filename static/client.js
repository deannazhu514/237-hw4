var playerName; //id for the player
var currentGame; //which game the player is playing or making, is a game object
var gameList;
var gamenum = 0;
var openGameList = {};	//array of objects, containing joinable games			
var myGameList = {}; //array of objects, containing games player is currently in	
var pageState = []; //what screens to load on page 
var teamSize = 3; //default size of your team
var currentTeam; //array of character objects player is creating


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
	else if (pageState[0] === "gameInPlay") {
		refreshGameScreen();
    if (playerName === currentGame.player1) {
      init(1);
    } else {
      init(2);
    }
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
	var instructions = $("#instruction").addClass("instructions").html(menuText);
	var container = $("#content");
	container.html("");
	
	
	if (pageState.length === 1) 
		pageState.push("openGames");
	var availButton = $("<a id=availButton>")
					.html("Available Games <span> See which games are available. </span>");
	availButton.addClass("roombut");
	availButton.click(
				function() {
					pageState[1] = "openGames";
					refreshDOM();
					//getOpenGames();
				});
	var currButton = $("<a id=currButton>").html("Current Games <span> See the games you've joined. </span>");
	currButton.addClass("roombut");
	currButton.click(
				function() {
					pageState[1] = "myGames";
					refreshDOM();
					//getCurrentGames();
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
		.html("Join Game <span> Join this game. </span>")
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
						pageState[0] = "gameInPlay";
						pageState[1] = "myGames";
						refreshDOM();
						return;
					}
				}			
			}
			alert("Please select a game.");
		});
	var createButton = $("<a>")
		.html("Create Game <span> Create a new game. </span>")
		.addClass("menubut")
		.attr("id", "createButton")
		.click(function() {
			pageState[0] = "createGame";
			pageState[1] = "";
			refreshDOM();
		});
		
	rooms.append(gamesAvailable);
	
	//adjust height of games box based on number of games
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
	gamenum = 0;
	for (var gameID in myGameList) {
		gamenum++;
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



/* CREATE TEAM SCREEN FUNCTIONS */
function refreshCreateTeamScreen() {
// load the team create screen
var container = $("#content");
	var instructions = $("<div>").addClass("instructions");
	var teamList = $("<div>").attr("id", "teamList");
	if (currentTeam === undefined)
		currentTeam = new Array(teamSize);
	if (currentGame === undefined) {
		currentGame = new Object();
	} 
	
	container.html("");
	instructions.html("Create your team of characters! Choose from a variety of different classes:");
	container.append(instructions);
	if (pageState[0] === "createGame") {
	// if creating a new game, need to create game name
		var gameName = $("<div>").append(
				$("<label>").html("Your game's name: "),
				$("<input id=gameName>")
					.attr("name", "gameName")
					.attr("type", "text")
			);
		instructions.append(gameName);
		if ((currentGame !== undefined) && (currentGame.name !== undefined))
			$("#gameName").val(currentGame.name);
	}
	
	for (var i=0; i<currentTeam.length; i++) {
		var	currCharacter = $("<div>")
			.attr("id", "char"+i)
			.addClass("charInput");
		refreshNewCharacter(currCharacter, i);
		teamList.append(currCharacter);
	}
	container.append(teamList);
	
	// goes back to menu, if creating game, or to game screen
	var continueButton = $("<a id=continueButton>")
		.html("Continue")
		.addClass("menubut");
	continueButton.click(function() {
		// add verification stuff
		currentTeam = getCharData();
		if (pageState[0] === "createGame") {
		// creates new game object
			currentGame.player1 = playerName;
			currentGame.name = $("#gameName").val();
			var tempdatalist = currentTeam;
      currentGame.p1charList = init_characters(tempdatalist);
			currentGame.map = 1; // default map number 
			pageState[0] = "menu";
			pageState[1] = "openGames";
			alert("Game created!");
			createGame();
		}
		else {
		// adds player to another player's game
		// resets currentTeam for future team creations
			currentGame.player2 = playerName;
			currentGame.p2charList = init_characters(currentTeam);
			pageState[0] = "gameInPlay";
			currentTeam = undefined;
			joinGame();
		}
	});	
	// go back to menu screen
	var backButton = $("<a id=joinButton>").html("Go Back").addClass("menubut");
	backButton.click(function(){
		pageState[0] = "menu";
		pageState[1] = "openGames";
		currentGame = undefined;
		currentTeam = undefined;
		refreshDOM();
	});
	container.append(continueButton, backButton);
}
// helper functions
function refreshNewCharacter(currCharacter, i) {
// function to only refresh one team member element in the DOM	
	if (currentTeam[i] === undefined) {
		currCharacter.addClass("warrior"); //set default character class
		currentTeam[i] = new Object;
		currentTeam[i].type = "warrior";
	}
	else {
		currCharacter.addClass(currentTeam[i].type);
	}
	var classOptions = $("<ul>").addClass("classOptions");
	for (var className in baseStats) {
		var classText;
		if (className === "warrior")
			classText = "Warrior";
		else if (className === "archer")
			classText = "Archer";
		else if (className === "mage")
			classText = "Mage";
		var currOption = $("<li>").html(classText);
		if (className === currentTeam[i].type) {
			currOption.addClass("classSelected")
		}
		currOption.click(function() {
			selectClass($(this), i);
			currentGame.name = $("#gameName").val();
			refreshCreateTeamScreen();
		});
		classOptions.append(currOption);
	}		
	var charDescription = $("<div>")
		.addClass("charDescription")
		.html(classDescriptions[currentTeam[i].type]);
	var charImage = $("<div>")
		.append(getCharImage(currCharacter))
		.addClass("charImage");
	currCharacter.append(charImage, classOptions, charDescription);
}
function selectClass(classOption, i) {
	var selectedChar = classOption.parents(".charInput");
	var className;
	if (classOption.html() === "Warrior") 
		className = "warrior";
	else if (classOption.html() === "Archer") 
		className = "archer";
	else if (classOption.html() === "Mage") 
		className = "mage";
	currentTeam[i].type = className;
	selectedChar.attr("class", "charInput "+className);
}
function getCharImage(currCharacter) {
// helper function to load appropriate image for character
	var img, sx, sy, width, height;
	var charImage = $("<canvas>")
		.attr("id", currCharacter.attr("id")+"Canvas");
	if (currCharacter.hasClass("warrior")) {
		img = warriorImage1;
		sx = sXList["warrior"][0];
		sy = sYList["warrior"][0];
		width = widthList["warrior"][0];
		height = heightList["warrior"][0];
	}
	else if (currCharacter.hasClass("archer")) {
		img = archerImage1;
		sx = sXList["archer"][0];
		sy = sYList["archer"][0];
		width = widthList["archer"][0];
		height = heightList["archer"][0];
	}
	else if (currCharacter.hasClass("mage")) {
		img = mageImage1;
		sx = sXList["mage"][0];
		sy = sYList["mage"][0];
		width = widthList["mage"][0];
		height = heightList["mage"][0];
	}
	charImage.attr("width", width)
		.attr("height", height);
	var context = $(charImage)[0].getContext("2d");
	context.drawImage(img,sx,sy,width,height,0,0,width,height);
	return charImage;
}

function getCharData() {
// gets classes of characters and creates array of player's characters
	var charList = Array(teamSize);
	for (var i=0; i< charList.length; i++) {
		var currChar = $("#char"+i);
		var data = new Object();
		if (currChar.hasClass("warrior"))
			data.type = "warrior";
		else if (currChar.hasClass("archer"))
			data.type = "archer";
		else if (currChar.hasClass("mage"))
			data.type = "mage";
		data.x = Math.floor(Math.random()*10); // figure out what the default starting points are
		data.y = Math.floor(Math.random()*10); // and put them here in a variable later
								// make sure no one has same starting point
		data.strength = getRandom(data.type, "strength");
		data.dexterity = getRandom(data.type, "dexterity");
		data.endurance = getRandom(data.type, "endurance");
		data.agility = getRandom(data.type, "agility");
		if (pageState[0] === "createGame") {
			data.player = 1;
		}	else if (pageState[0] === "joinGame") {
			data.player = 2;
		}
		charList[i] = data;
	}
	return charList;
}
function getRandom(charClass, stat) {
// helper function to generate random character stats
	var min = classStats[charClass][stat][0]; // base stat
	var max = classStats[charClass][stat][2];
	return Math.floor(min + Math.random()*(max-min));
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
				"charList": JSON.stringify(currentGame.p2charList)},
		success: function(data) {
			if (data.success === true){
				console.log("game start");
				//var stringgame = data.game;
				//console.log(stringgame);
				currentGame = data.game;
				var playerNumber;
				if (currentGame.player1 === playerName) {
					playerNumber = 1;
				} else {
					playerNumber = 2;
				}
				refreshGameScreen();
				init(playerNumber);
			}	else { 
				//alert("Cannot join game."); //calling alert doesn't work..........
        console.log("Cannot join game.");
				pageState[0] = "menu";
				pageState[1] = "openGames";
				refreshDOM();
			}
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
	container.append(main, terrain);//implement maps and terrain later
}

function updateGame() {
	//send: gameID, character lists, player points
	//see update game in app.js
  
	console.log(currentGame);
	$.ajax({
		type: "post",
		url: "/updateGame",
		data: {"gameObj" : (currentGame)},
		success: function() {
			refreshGameScreen();
		}
	});
}

function isMyTurn() {
	//function that is used that will constantly poll
	//the server to see if the turn changes
	//ask the server if its my turn
	
	console.log('calling ismyturn');
	$.ajax({
		type: "get",
		url: "/isYourTurn/"+playerName+"/"+(currentGame.id),
		success: function(data) {
			if (data.answer) {
				//currentGame = JSON.parse(data.game);
				currentGame = (data.game);
				console.log("yes");
				//this should have a new status 
				//which will cause ismyturn to not be
				//called anymore in update
        currentGame.status = "p"+playerNumber+"turn";
        window.clearInterval(intervalId);
        init(playerNumber);
			}
			else console.log("no");
			// refreshGameScreen();
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