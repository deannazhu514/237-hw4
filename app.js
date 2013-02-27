var express = require("express");
var app = express();
var fs = require("fs");

var gameList;
//var playerList; not used for now

app.use(express.bodyParser());

//taken from hw3
// Asynchronously write file contents, then call callbackFn
function writeFile(filename, data, callbackFn) {
  fs.writeFile(filename, data, function(err) {
    if (err) {
      console.log("Error writing file: ", filename);
    } else {
      console.log("Success writing file: ", filename);
    }
    if (callbackFn) callbackFn(err);
  });
}

//taken from hw3
// Asynchronously read file contents, then call callbackFn
function readFile(filename, defaultData, callbackFn) {
  fs.readFile(filename, function(err, data) {
    if (err) {
      console.log("Error reading file: ", filename);
      data = defaultData;
    } else {
      console.log("Success reading file: ", filename);
    }
    if (callbackFn) callbackFn(err, data);
  });
}

app.post("/createGame", function(req, res){
	var time = new Date().getTime();
	var name = req.body.name;
	var player1ID = req.body.playerName;
	var p1charList = req.body.charList;
	var mapNum = req.body.map;
	var game = {
		"id" : time,
		"name": name,
		"player1": player1ID, 
		"player2": "",
		"map": mapNum,
		"status": "not joined",
		"p1charList": p1charList,
		"p2charList": [], 
		"p1points": 0,
		"p2points": 0
	}
	gameList[time] = game;
	writeFile("games.txt", JSON.stringify(gameList));
	res.send( {success : (game !== undefined) ,
				game: game});
});


/*game has two players, now initialize everything
* and start the actual game! 
*/
app.post("/joinGame", function(req,res){ 
	var gameID = req.body.gameID;
	var playerID = req.body.playerName;
	var charList = req.body.charList;
	var game = gameList[gameID];
	if (game.player2 === "") { //why was this !== ?
		game.player2 = playerID;
		game.status = "p2turn"; //what if p1 hasn't done anything for their turn yet?
		game.p2charList = charList;
		gameList[gameID] = game; //is this line necessary?
		writeFile("games.txt", JSON.stringify(gameList));
		res.send( {
			game : game,
			success : true });
	} else {
		res.send ( {success: false});
	}
});

app.get("/isYourTurn/:info", function(req,res) {
	var obj = JSON.parse(req.params.info);
	var pname = obj.name;
	var game = gameList[obj.game];
	if (((game.player1 === pname) 
		&& (game.status === "p1turn")) 
	 || ((game.player2 === pname) 
		&& (game.status === "p2turn"))){
		res.send({ 
			answer: 'true',
			game: game
		});
	} else {
		res.send({
			answer: false,
			//game: {} //this should never be read if answer is false
		});
	}
});


app.post("/updateGame", function(req,res) {
	var game = JSON.parse(req.body.gameObj);
	var gameID = game.id;
	gameList[gameID] = game;

	writeFile("games.txt", JSON.stringify(gameList));
});


//joined a game now create your squadron of characters

//going to combine this with create/join instead
/*app.post("/createCharacters", function(req,res) {
	var charList = req.body.chars;
	
	res.send ( { success: true});
}); */

app.get("/displayOpenGames/:playerID", function(req, res) {
	//var data = JSON.parse(JSON.stringify(gameList)); //create deep copy
	var playerID = req.params.playerID;
	var data = {};
	for (var gameID in gameList) {
		var game = gameList[gameID];
		if ((game.status === "not joined")
			&& (playerID !== game.player1)) {
			data[gameID] = game;
		}
	}
	res.send({games: data,
						success: (data !== undefined)});
});


app.get("/displayCurrentGames/:playerID", function(req,res) {
	var data = {};
	var playerID = req.params.playerID;
	for (var gameID in gameList) {
		var game = gameList[gameID];
		if ((game.player1 === playerID) ||
			(game.player2 === playerID)) {
				data[gameID] = game;
		}
	}
	res.send({games: data,
						success: (data !== undefined)});
});

app.get("/displayAllGames", function(req,res) {
	res.send({games: gameList,
						success: (gameList !== undefined)});
});

// taken from hw3
function initServer() {
	var defaultList = "{}";
	readFile("games.txt", defaultList, function(err, data) {
		gameList = JSON.parse(data);
	});
	/*
	readFile("players.txt", defaultList, function(err, data) {
		playerList = JSON.parse(data);
	});*/
}

// serves files in the static directory
app.get("/static/:filename", function (request, response) {
    response.sendfile("static/" + request.params.filename);
});

app.get("/static/images/:filename", function (request, response) {
    response.sendfile("static/images/" + request.params.filename);
});

initServer();
app.listen(8889);
