var map;
var width;
var height;
var p1charList;
var p2charList;

function init(gameData, player) {
	game = gameData;
	playerNumber = player;
	init_map(game.map);
	p1charList = game.p1charList;
	p2charList = game.p2charList; 
	
	/* on second thought we should store the entire
	 * character objects rather than recreating them
	 * with just x/y coordinates
	 * so we can maintain customizable stats
	 */
	//init_characters(game.p1charList, game.p2charList);
	canvas.addEventListener('keyup', onKeyUp, false);
	canvas.addEventListener('keydown', onKeyDown, false);
	
	//canvas.addEventListener('mousemove', onMouseMove, false);
	
	intervalId = setInterval(update, timerDelay);
	cursor.x = 0;
	cursor.y = 0;
	playerFocus = "";
	key_pressed.time = 0;
}

//ASSUMING GIVEN TWO LISTS WITH DATA OBJECTS
//DATA HAS 
/*CHAR TYPE (CLASS/RACE)
* PLAYER (1 or 2)
* x and y coordinates
*/
function init_characters(list1,list2) { 
	p1charList = [];
	p2charlist = [];
	var newchar;
	for (var i = 0; i < list1.length; i++) {
		newchar = newCharacter(list1[i]);
		newchar.index = i;
		p1charList.push(newchar);
	}
	for (var i = 0; i < list1.length; i++) {
		newchar = newCharacter(list2[i]);
		newchar.index = i;
		p2charList.push(newchar);
	}
}


//for now just one map 
function init_map(mapNum) {
	if (mapNum === '1') {
		width = 20;
		height = 20;
		map = new Array(height);
		for (var i = 0; i < height; i++) {
			map[i] = new Array(width);
		}

		for (var i = 0; i < height; i++) {
			for (var j = 0; j < width; j++) {
				var tile = {};
				tile.type = "plain";
				tile.character = null;
				tile.special = "";
				map[i][j] = tile;
			}
		}
		return map;
	} else if (mapNum === '2') {
		//second map type
	} else if (mapNum === '3') {
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

function update() {
	draw();
	//key_pressed.time++ % 10;
	var cList;
	if ((playerNumber === 1) 
	&& (game.status === "p1turn")) {
		cList = p1charList;
	} else if (game.status === "p2turn") {
		cList = p2charList;
	} else { //it isn't your turn, whichever player you are...
		isMyTurn();
		return;
	}
	
	//fall through: it is your turn, check to see if 
	//any characters can still move
	//check to see if any characters have movepoints left
	for (var i = 0; i < cList.length; i++) {
		if (cList[i].hasMoved) {
			return;
		}
	}
	
	//only reaches endturn if all characters have 0 movepoints
	endTurn();
}


//I don't think we need a separate function for this

//we can do whatever needs doing in our update() check and 
//endTurn function
/*
function beginTurn() {
	var cList;
	if (playerNumber === 1) {
		cList = p1charList;
	} else { 
		cList = p2charList;
	}
	for (var i = 0; i < cList.length; i++) {
		cList[i].movePoints = cList[i].maxMovePoints;
	}
	//should game.status be changed here or in the calling function of begin turn? 
	//
}
*/

