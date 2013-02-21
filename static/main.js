var map;
var width;
var height;
var p1charList;
var p2charList;

function init() {
	init_characters();
	
	init_map(mapNum);
	
	canvas.addEventListener('mousemove', onMouseMove, false);
	
	intervalId = setInterval(update, timerDelay);
	cursor.x = 0;
	cursor.y = 0;
	playerAction = "";
}

function init_characters(list1,list2) { 
	p1charList = [];
	p2charlist = [];
	for (var i = 0; i < list1.length; i++) {
		p1charList.push(createCharacter(list1[i]);
	}
	for (var i = 0; i < list1.length; i++) {
		p2charList.push(createCharacter(list2[i]);
	}
}

function init_map(mapNum) {
	if (mapNum === '1') {
		map = new Array(height);
		for (var i = 0; i < height; i++) {
			map[i] = new Array(width);
		}

		for (var i = 0; i < height; i++) {
			for (var j = 0; j < width; j++) {
				map[i][j] = ("plain");
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
}

init();



