function init(player) {
  console.log("called init");
  canvas = document.getElementById("myCanvas");
  ctx = canvas.getContext("2d");
	canvas.addEventListener('keyup', onKeyUp, false);
	canvas.addEventListener('keydown', onKeyDown, false);
	//canvas.addEventListener('mousemove', onMouseMove, false);

	playerNumber = player;
	init_map(currentGame.map);
	p1charList = currentGame.p1charList;
  p2charList = currentGame.p2charList;
  init_char_images();
	cursor.x = Math.floor(width/2);
	cursor.y = height-1;
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
	
	canvas.setAttribute('tabindex','0');
	canvas.focus();
	
	intervalId = setInterval(update, timerDelay);
}

function init_char_images() {

  for (var i = 0; i < p1charList.length; i++) {
    var type = p1charList[i].type;
    if (type === "warrior") {
      p1charList[i].img = warriorImage[0];
    } else if (type === "mage") {
      p1charList[i].img = mageImage[0];
    } else if (type === "archer") {
      p1charList[i].img = archerImage[0];
    } else {
      p1charList[i].img = "";
    }
	}
  for (var i = 0; i < p2charList.length; i++) {
    var type = p2charList[i].type;
    if (type === "warrior") {
      p2charList[i].img = warriorImage[1];
    } else if (type === "mage") {
      p2charList[i].img = mageImage[1];
    } else if (type === "archer") {
      p2charList[i].img = archerImage[1];
    } else {
      p2charList[i].img = "";
    }
	}
}

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
	if ((mapNum == '1') || (mapNum === undefined)) {
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
				if ((i === 5) || (i === 4)
					&& ((j === 5) || (j === 4))) {
					tile.special = "scorespot";
				} else { 
					tile.special = "";
				}
				map[i][j] = tile;
			}
		}
		// return map;
	} else if (mapNum == '2') {
		//second map type
	} else if (mapNum == '3') {
		//third map type etc
	}
}

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
	var cList;
	for (var i = 0; i < p1charList.length; i++) {
			map[p1charList[i].y][p1charList[i].x].character = p1charList[i];
	}
	for (var i = 0; i < p2charList.length; i++) {
			map[p2charList[i].y][p2charList[i].x].character = p2charList[i];
	}	
	if ((playerNumber == 1) && (currentGame.status === "p1turn")) {
		cList = p1charList;
	} else if ((playerNumber == 2) && (currentGame.status === "p2turn")) {
		cList = p2charList;
	} else { //it isn't your turn, whichever player you are...
		isMyTurn();
		 return;
	}
	
	draw();
	checkKeyPressed();
	checkVictory();
	if (gameEndFlag == true) {
		return;
	}
	
	//fall through: it is your turn, check to see if 
	//any characters can still move
	//check to see if any living characters have movepoints left
	for (var i = 0; i < cList.length; i++) {
		if (!cList[i].hasMoved && !isDead(cList[i])) {
			return;
		}
	}
	
	//only reaches endturn if all characters have moved or are dead
	endTurn();
}

function endTurn() {
	var pList; //player's list
	var opList; //opponent's list
	turnEnd = true;
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
	remove_char_images();
	if (currentGame.status === "p1turn") {
		currentGame.status = "p2turn";
	} else {
		currentGame.status = "p1turn";
	}
	
	update();
}

function remove_char_images() {
  for (var i = 0; i < currentGame.p1charList; i++) {
    delete currentGame.p1charList[i].img;
  }
  for (var i = 0; i < p2charList; i++) {
    delete currentGame.p2charList[i].img;
	}
}



