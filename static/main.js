var currentGame; //for testing

function init(gameData, player) {
	currentGame = gameData; //for testing
	playerNumber = player;
	init_map(currentGame.map);
	p1charList = currentGame.p1charList;
	p2charList = currentGame.p2charList; 
	canvas.addEventListener('keyup', onKeyUp, false);
	canvas.addEventListener('keydown', onKeyDown, false);
	
	//canvas.addEventListener('mousemove', onMouseMove, false);
	
	intervalId = setInterval(update, timerDelay);
	cursor.x = 0;
	cursor.y = 0;
	playerFocus = "viewing";
	
	//i hope the inconsistency in style doesnt bug anyone
	key_pressed.timeleft = 0;
	key_pressed.timeright = 0;
	key_pressed.timeup = 0;
	key_pressed.timedown = 0;
	key_pressed["right"] = false;
	key_pressed["left"] = false;
	key_pressed["up"] = false;
	key_pressed["down"] = false;
	gameEndFlag = false;
}

//ASSUMING GIVEN TWO LISTS WITH DATA OBJECTS
//DATA HAS 
/*CHAR TYPE (CLASS/RACE)
* PLAYER (1 or 2)
* x and y coordinates
*/
function init_characters(datalist) { 
	var charlist = [];
	var newchar;
	for (var i = 0; i < datalist.length; i++) {
		newchar = newCharacter(datalist[i]);
		newchar.index = i;
		charlist.push(newchar);
	}
	return charlist;
}


//for now just one map 
function init_map (mapNum) {
	if (mapNum == '1') {
		// width = 20;
		// height = 20;
		
		//initialize a widthxheight 2D array for the map tiles
		map = new Array(height);
		for (var i = 0; i < height; i++) {
			map[i] = new Array(width);
		}

		for (var i = 0; i < height; i++) {
			for (var j = 0; j < width; j++) {
				var tile = {};
				tile.type = tileType[Math.floor(Math.random()*3)];
				tile.character = null;
				if (((i === height/2) || (i === ((height/2) - 1)))
					&& ((j === width/2) || (j === ((width/2) - 1)))) {
					tile.special = "scorespot";
				} else { 
					tile.special = "";
				}
				map[i][j] = tile;
			}
		}
		return map;
	} else if (mapNum == '2') {
		//second map type
	} else if (mapNum == '3') {
		//third map type etc
	}
}

/*
function terrain_factory(type) {
	var tile;
	if (type == "p") { //Plain: default terrain type
		tile.dodgeModifier = 0; //gives bonus to dodge (positive is better)
		tile.moveAmount = 1; //move points required to cross the tile
		tile.damageModifier = 0;
		tile.character = "";
	} else if (type == "m") { //mountain: impassable
		tile.dodgeModifier = 0; //dummy value
		tile.moveAmount = 1000; //effectively impassable terrain
		tile.damageModifier = 0; //dummy value
		tile.character = "";
	} else if (type == "f") { //forest: defensive benefits, difficult to traverse
		tile.dodgeModifier = 15;
		tile.moveAmount = 2;
		tile.damageModifier = 1;
		tile.character = "";
	}
}*/


function checkVictory() {
	//god this function should be split into 
	//multiple helper functions but im so tired
	//so inelegant sigh
	var i = 0;
	if (playerNumber === 1) {
		while (i < p2charList.length) {
			if (!isDead(p2charList[i])) {
				break;
			}
			i++;
		}
		if (i === p2charList.length) { //never broke out of the loop
			currentGame.status = "p1Victory"; //have not yet implemented anything server side to deal with victories and ending games
											  //this is a placeholder
			//display victory animation
			gameEndFlag = true;
			endTurn();
		}
		if (currentGame.p1points >= 100) {
			currentGame.status = "p1Victory";
			gameEndFlag = true;
			endTurn();
		}
	} else {
		while (i < p1charList.length) {
			if (!isDead(p1charList[i])) {
				break;
			}
			i++;
		}
		if (i === p1charList.length) { //never broke out of the loop
			currentGame.status = "p2Victory"; 
			//display victory animation
			gameEndFlag = true;
			endTurn();
		}
		if (currentGame.p2points >= pointGoal) {
			currentGame.status = "p2Victory";
			gameEndFlag = true;
			endTurn();
		}
	}
}

/* this function doesn't really offer any core functionality 
 * BUT WHY NOT
 * if a direction key is pressed, move once as handled in eventhandlers
 * if keyup isn't detected for a certain amount of time, then the movement
 * is repeated automatically and rapidly as calculated below
 * as of now support only exists for one key being held down at a time
 * pressing multiple will override and reset the timer
 * god why did i spend any time on this
 */
function checkKeyPressed() {
	key_pressed.time++; //yeah this will keep incrementing 
						//after you release the key
						//but its okay because it only gets checked
						//when any keypress becomes true, and that will
						//reset the counter
	if ((key_pressed.time > keyPressThreshhold) && (key_pressed.time%keyPressThreshhold === 0)) {
		if (key_pressed["left"]) {
			onKeyDownParser(65);
		} else if (key_pressed["right"]) {
			onKeyDownParser(68);
		} else if (key_pressed["up"]) {
			onKeyDownParser(87);
		} else if (key_pressed["down"]) {
			onKeyDownParser(83);
		}
	}
}

function update() {
	draw();
	checkKeyPressed();
	
	/*if (checkVictory()) {
		endTurn();
		return;
	}
	*/
	var cList;
	if ((playerNumber === 1) 
	&& (currentGame.status === "p1turn")) {
		cList = p1charList;
	} else if (currentGame.status === "p2turn") {
		cList = p2charList;
	} else { //it isn't your turn, whichever player you are...
		//isMyTurn();
		return;
	}
	
	//fall through: it is your turn, check to see if 
	//any characters can still move
	//check to see if any living characters have movepoints left
	for (var i = 0; i < cList.length; i++) {
		if (cList[i].hasMoved && !isDead(cList[i])) {
			return;
		}
	}
	
	//only reaches endturn if all characters have moved or are dead
	endTurn();
}

function endTurn() {
	var pList; //player's list
	var opList; //opponent's list
	if (playerNumber === 1) {
		pList = p1charList;
		opList = p2charList;
	} else { 
		pList = p2charList;
		opList = p1charList;
	}
	for (var i = 0; i < pList.length; i++) {
		pList[i].movePoints = pList[i].maxMovePoints;
	}
	
	//so you only get points after one full turn: that is,
	//after your opponent finishes his turn. 
	//Technically i guess it should be awarded at the 
	//*start* of your turn but this is pretty much the same
	for (var i = 0; i < opList.length; i++) {
		var x = opList[i].x;
		var y = opList[i].y;
		var tile = map[x][y];
		if (tile.special === "scorespot") {
			if (playerNumber === 1) {
				currentGame.p2points = currentGame.p2points + pointGain;
			} else {
				currentGame.p1points = currentGame.p1points + pointGain;
			}
		}
	}
	//i'm assuming p1charlist etc are just references to
	//game.p1charlist rather than modifying a different copy
	//but i'm not sure thats the case so here's some possibly
	//redundant code lool fml
	
	currentGame.p1charList = p1charList;
	currentGame.p2charList = p2charList;
	
	if (currentGame.status === "p1turn") {
		currentGame.status = "p2turn";
	} else {
		currentGame.status = "p1turn";
	}
	
	update();
}



