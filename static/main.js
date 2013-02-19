var map;
var length;
var height;
var p1charList;
var p2charList;
var terrainDict;

terrainDict.plain = { 
	dodgeModifier = 0, //gives bonus to dodge (positive is better)
	moveAmount = 1, //move points required to cross the tile
	damageModifier = 0,
	character = ""
};
terrainDict.mountain = {
	dodgeModifier = 0, //dummy value
	moveAmount = 1000, //effectively impassable terrain
	damageModifier = 0, //dummy value
	character = "";
};

terrainDict.forest = {
	dodgeModifier = 15,
	moveAmount = 2,
	damageModifier = 1,
	character = ""
};

function init() {
	init_characters();
	
	init_map(mapNum);
	
}

function init_characters() { 
	p1charList = [];
	p2charlist = [];
	var i = 0;
	for (var i = 0; i < 5; i++) {
		var character;
		character.type = "w"; //warrior, placeholder for now
		p1charList.push(character);
	}
	for (var i = 0; i < 5; i++) {
		var character;
	}
	while 
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

init();



