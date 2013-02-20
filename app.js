var express = require("express");
var app = express();
var fs = require("fs");

var gameList;
var playerList;

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
	var gameID = req.body.gameID;
	var player1ID = req.body.playerName;
	var mapNum = req.body.map;
	var game = {
		"player1": player1ID, 
		"player2": "",
		"map": mapNum,
		"status": "not joined"
	}
	gameList[gameID] = game;
	writeFile("games.txt", JSON.stringify(gameList));
	res.send( {success : true });
});


/*game has two players, now initialize everything
* and start the actual game! 
*/
app.post("/joinGame", function(req,res){ 
	var gameID = req.body.gameID;
	var playerID = req.body.playerName;
	var game = gameList[gameID];
	if (game.player2 !== "") {
		game.player2 = playerID;
		game.status = "p2turn";
		res.send( {success : true});
	} else {
		alert("cannot join game");
		res.send ( {success: false});
		}
});


//joined a game now create your squadron of characters
app.post("/createCharacters", function(req,res) {
	var charList = req.body.chars;
	
	res.send ( { success: true});
});

app.get("/displayOpenGames", function(req, res) {
	//var data = JSON.parse(JSON.stringify(gameList)); //create deep copy
	var data = {};
	for (var gameID in gameList) {
		var game = gameList[gameID];
		if (game.status === "not joined") {
			data[gameID] = game;
		}
	}
	data.success = true;
	res.send(data);
});


app.get("/displayCurrentGames/:playerID", function(req,res) {
	var data = {};
	var playerID = req.params.playerID;
	for (var gameID in gameList) {
		var game = gameList[gameID];
		if ((game.player1 == playerID) ||
			(game.player2 == playerID)) {
				data[gameID] = game;
			}
	}
	data.success = true;
	res.send(data);
});

// taken from hw3
function initServer() {
	var defaultList = "{}";
	readFile("games.txt", defaultList, function(err, data) {
		gameList = JSON.parse(data);
	});
	readFile("players.txt", defaultList, function(err, data) {
		playerList = JSON.parse(data);
	});
}

// serves files in the static directory
app.get("/static/:filename", function (request, response) {
    response.sendfile("static/" + request.params.filename);
});

initServer();
app.listen(8889);
